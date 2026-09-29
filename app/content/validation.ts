import {
  commercialAvailabilityStatuses,
  dataRoles,
  segmentIds,
  type CommercialAvailability,
  type ContentBundle,
  type DataRole,
  type SceneDefinition,
  type SceneId,
  type SegmentDefinition,
} from "./types.ts";

export interface ContentValidationIssue {
  code: string;
  path: string;
  message: string;
}

const vendorTokens = [
  "xovis",
  "milesight",
  "isarsoft",
  "lidar",
  "hme",
  "zoom nitro",
  "nexeo",
  "clearsoundx",
];

/**
 * Commercial availability is a separate concept from source/evidence
 * readiness, so it is validated independently.
 * [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §21]
 */
const validateCommercialAvailability = (
  issues: ContentValidationIssue[],
  path: string,
  availability: CommercialAvailability | undefined,
) => {
  if (!availability) return;
  if (!commercialAvailabilityStatuses.includes(availability.status)) {
    issues.push({ code: "invalid_commercial_availability", path, message: `Unknown commercial availability status: ${availability.status}` });
  }
  if (availability.status === "region_limited" && !availability.region) {
    issues.push({ code: "missing_availability_region", path, message: "region_limited availability requires region metadata" });
  }
  if (availability.status !== "region_limited" && availability.region) {
    issues.push({ code: "unexpected_availability_region", path, message: "Only region_limited availability may carry a region" });
  }
  if (!availability.note.trim()) {
    issues.push({ code: "missing_availability_note", path, message: "Commercial availability requires an explanatory note" });
  }
};

const duplicateIds = (ids: readonly string[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return duplicates;
};

const addDuplicateIssues = (
  issues: ContentValidationIssue[],
  path: string,
  ids: readonly string[],
) => {
  for (const id of duplicateIds(ids)) {
    issues.push({ code: "duplicate_id", path, message: `Duplicate ID: ${id}` });
  }
};

/**
 * Branch-parent integrity for a segment.
 *
 * Every branch parent must exist, must live in the same segment, and must not
 * be the scene itself. This keeps the existing Core → Optional → Core routing
 * rule intact and prevents cross-segment leakage through branch metadata.
 */
const validateBranchParents = (
  issues: ContentValidationIssue[],
  segmentPath: string,
  segment: SegmentDefinition,
) => {
  const sceneById = new Map(segment.scenes.map((scene) => [scene.id, scene]));
  for (const scene of segment.scenes) {
    for (const parentId of scene.branchFromSceneIds ?? []) {
      const parent = sceneById.get(parentId);
      if (!parent) {
        issues.push({ code: "invalid_branch_parent", path: `${segmentPath}.scenes.${scene.id}`, message: `Branch parent is not in this segment: ${parentId}` });
        continue;
      }
      if (parent.id === scene.id) {
        issues.push({ code: "self_branch_parent", path: `${segmentPath}.scenes.${scene.id}`, message: "A scene cannot branch from itself" });
      }
      if (scene.priority === "core") {
        issues.push({ code: "core_scene_branch_parent", path: `${segmentPath}.scenes.${scene.id}`, message: "Core scenes must not declare a branch parent" });
      }
    }
  }
};

const validateCoreRoute = (
  issues: ContentValidationIssue[],
  segmentPath: string,
  scenes: readonly SceneDefinition[],
  coreRoute: readonly SceneId[],
) => {
  const sceneMap = new Map(scenes.map((scene) => [scene.id, scene]));
  const ordered = coreRoute.map((id) => sceneMap.get(id));
  ordered.forEach((scene, index) => {
    if (!scene) {
      issues.push({ code: "missing_core_scene", path: `${segmentPath}.coreRoute[${index}]`, message: `Core route references missing scene: ${coreRoute[index]}` });
      return;
    }
    if (scene.priority !== "core") {
      issues.push({ code: "non_core_route_scene", path: `${segmentPath}.coreRoute[${index}]`, message: `${scene.id} is not Core` });
    }
    if (scene.corePathOrder !== index + 1) {
      issues.push({ code: "invalid_core_order", path: `${segmentPath}.coreRoute[${index}]`, message: `${scene.id} has order ${scene.corePathOrder}; expected ${index + 1}` });
    }
  });
  for (const scene of scenes.filter((item) => item.priority === "core")) {
    if (!coreRoute.includes(scene.id)) {
      issues.push({ code: "core_scene_not_routed", path: segmentPath, message: `Core scene is absent from route: ${scene.id}` });
    }
  }
};

export function validateContentBundle(bundle: ContentBundle): readonly ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const scenes = bundle.segments.flatMap((segment) => segment.scenes);
  const sceneIds = new Set(scenes.map((scene) => scene.id));
  const capabilityIds = new Set(bundle.technologyCapabilities.map((item) => item.id));
  const implementationIds = new Set(bundle.technologyImplementations.map((item) => item.id));
  const visualIds = new Set(bundle.visualAssets.map((item) => item.id));
  const proofIds = new Set(bundle.proofAssets.map((item) => item.id));
  const inputById = new Map(bundle.evidenceInputs.map((item) => [item.id, item]));

  addDuplicateIssues(issues, "segments", bundle.segments.map((item) => item.id));
  addDuplicateIssues(issues, "scenes", scenes.map((item) => item.id));
  addDuplicateIssues(issues, "evidenceInputs", bundle.evidenceInputs.map((item) => item.id));
  addDuplicateIssues(issues, "technologyCapabilities", bundle.technologyCapabilities.map((item) => item.id));
  addDuplicateIssues(issues, "technologyImplementations", bundle.technologyImplementations.map((item) => item.id));
  addDuplicateIssues(issues, "visualAssets", bundle.visualAssets.map((item) => item.id));
  addDuplicateIssues(issues, "proofAssets", bundle.proofAssets.map((item) => item.id));
  addDuplicateIssues(issues, "allContentIds", [
    ...scenes.map((item) => item.id),
    ...bundle.technologyCapabilities.map((item) => item.id),
    ...bundle.technologyImplementations.map((item) => item.id),
    ...bundle.visualAssets.map((item) => item.id),
    ...bundle.proofAssets.map((item) => item.id),
  ]);

  for (const [segmentIndex, segment] of bundle.segments.entries()) {
    const path = `segments[${segmentIndex}]`;
    if (!segmentIds.includes(segment.id)) {
      issues.push({ code: "invalid_segment", path, message: `Unknown segment: ${segment.id}` });
    }
    validateCoreRoute(issues, path, segment.scenes, segment.coreRoute);
    validateBranchParents(issues, path, segment);
    addDuplicateIssues(issues, `${path}.coreRoute`, segment.coreRoute);
    for (const lens of segment.experienceLenses ?? []) {
      // Experience lenses are presentation groupings; they must map onto the
      // existing global evidence roles and never redefine them.
      for (const role of lens.dataRoles) {
        if (!dataRoles.includes(role)) {
          issues.push({ code: "invalid_experience_lens_role", path: `${path}.experienceLenses.${lens.id}`, message: `Unknown data role: ${role}` });
        }
      }
      if (!lens.dataRoles.length) {
        issues.push({ code: "unmapped_experience_lens", path: `${path}.experienceLenses.${lens.id}`, message: "An experience lens must map onto at least one global data role" });
      }
    }
    const optional = new Set(segment.optionalBranches);
    const advanced = new Set(segment.advancedBranches);
    for (const scene of segment.scenes) {
      if (scene.segment !== segment.id) {
        issues.push({ code: "scene_segment_mismatch", path: `${path}.scenes`, message: `${scene.id} belongs to ${scene.segment}` });
      }
      if (scene.priority === "optional" && !optional.has(scene.id)) {
        issues.push({ code: "missing_optional_branch", path, message: `Optional scene is not routed: ${scene.id}` });
      }
      if (scene.priority === "advanced" && !advanced.has(scene.id)) {
        issues.push({ code: "missing_advanced_branch", path, message: `Advanced scene is not routed: ${scene.id}` });
      }
    }
    for (const [stage, mappedIds] of Object.entries(segment.stageMapping)) {
      for (const id of mappedIds) {
        const scene = segment.scenes.find((item) => item.id === id);
        if (!scene) {
          issues.push({ code: "invalid_stage_scene", path: `${path}.stageMapping.${stage}`, message: `Unknown scene: ${id}` });
        } else if (scene.journeyStage !== stage) {
          issues.push({ code: "stage_scene_mismatch", path: `${path}.stageMapping.${stage}`, message: `${id} belongs to ${scene.journeyStage}` });
        }
      }
    }
    if (segment.stageMapping.configure.length || segment.stageMapping.act.length) {
      issues.push({ code: "synthesis_as_scene", path: `${path}.stageMapping`, message: "Configure and Act must not contain matrix capability scenes" });
    }
    if (segment.synthesis.configure.recommendationMode !== "none") {
      issues.push({ code: "configure_recommendation", path: `${path}.synthesis.configure`, message: "Configure must not implement recommendation logic" });
    }
    if (segment.synthesis.act.decisionOwner !== "human") {
      issues.push({ code: "automated_act_decision", path: `${path}.synthesis.act`, message: "Act decisions must remain human-owned" });
    }
  }

  for (const scene of scenes) {
    const path = `scenes.${scene.id}`;
    if (!visualIds.has(scene.visualAssetId)) {
      issues.push({ code: "missing_visual", path, message: `Unknown visual: ${scene.visualAssetId}` });
    }
    if (scene.nextSceneId && !sceneIds.has(scene.nextSceneId)) {
      issues.push({ code: "missing_next_scene", path, message: `Unknown next scene: ${scene.nextSceneId}` });
    }
    if (!scene.sourceRefs.length) {
      issues.push({ code: "missing_scene_source", path, message: "Scene has no source reference" });
    }
    for (const role of scene.dataRequirements.required) {
      if (scene.dataRequirements.optional.includes(role)) {
        issues.push({ code: "overlapping_data_role", path, message: `${role} cannot be both required and optional` });
      }
    }
    scene.technologyCapabilityIds.forEach((id) => {
      if (!capabilityIds.has(id)) issues.push({ code: "missing_capability", path, message: `Unknown capability: ${id}` });
    });
    scene.proofAssetIds.forEach((id) => {
      if (!proofIds.has(id)) issues.push({ code: "missing_proof", path, message: `Unknown proof: ${id}` });
    });
    const requiredRoles = new Set<DataRole>(scene.dataRequirements.required);
    for (const dependency of scene.derivedDependencies) {
      const dependencyGroups = dependency.alternativeInputGroups ?? [];
      if (!dependency.requiredInputIds.length && !dependencyGroups.length) {
        issues.push({ code: "empty_derived_dependency", path, message: `${dependency.id} has no required inputs` });
      }
      if (dependencyGroups.some((group) => !group.length)) {
        issues.push({ code: "empty_alternative_dependency", path, message: `${dependency.id} has an empty alternative input group` });
      }
      for (const inputId of [
        ...dependency.requiredInputIds,
        ...dependencyGroups.flat(),
      ]) {
        const input = inputById.get(inputId);
        if (!input) {
          issues.push({ code: "missing_evidence_input", path, message: `${dependency.id} references ${inputId}` });
        } else if (!dataRoles.includes(input.dataRole) || !requiredRoles.has(input.dataRole)) {
          issues.push({ code: "derived_role_not_required", path, message: `${dependency.id} requires ${input.dataRole} input ${inputId}, but the role is not required by the scene` });
        }
      }
    }
    for (const evidence of scene.evidence) {
      for (const inputId of evidence.inputIds ?? []) {
        if (!inputById.has(inputId)) {
          issues.push({ code: "missing_evidence_input", path, message: `Evidence references ${inputId}` });
        }
      }
    }
  }

  for (const capability of bundle.technologyCapabilities) {
    const path = `technologyCapabilities.${capability.id}`;
    const lowerIdentity = `${capability.id} ${capability.name}`.toLowerCase();
    const validCapabilityId = /^TECH-0[1-8]$/.test(capability.id) || /^TECH-QSR-(0[1-9]|10)$/.test(capability.id);
    if (!validCapabilityId || vendorTokens.some((vendor) => lowerIdentity.includes(vendor))) {
      issues.push({ code: "vendor_capability_identity", path, message: `${capability.id} must remain vendor-neutral` });
    }
    validateCommercialAvailability(issues, path, capability.commercialAvailability);
    capability.supportedSceneIds.forEach((id) => {
      if (!sceneIds.has(id)) issues.push({ code: "invalid_capability_scene", path, message: `Unknown scene: ${id}` });
    });
    capability.implementationIds.forEach((id) => {
      if (!implementationIds.has(id)) issues.push({ code: "missing_implementation", path, message: `Unknown implementation: ${id}` });
    });
  }

  for (const implementation of bundle.technologyImplementations) {
    const path = `technologyImplementations.${implementation.id}`;
    validateCommercialAvailability(issues, path, implementation.commercialAvailability);
    // A compatibility-dependent integration must never lose its compatibility
    // status: "impl-compatible-*" is the naming contract for that class.
    if (
      implementation.id.startsWith("impl-compatible-") &&
      implementation.commercialAvailability &&
      implementation.commercialAvailability.status !== "available_if_compatible"
    ) {
      issues.push({ code: "lost_compatibility_status", path, message: "A compatibility-dependent implementation must remain available_if_compatible" });
    }
    implementation.capabilityIds.forEach((id) => {
      if (!capabilityIds.has(id)) {
        issues.push({ code: "invalid_implementation_capability", path, message: `Unknown capability: ${id}` });
      } else if (!bundle.technologyCapabilities.find((item) => item.id === id)?.implementationIds.includes(implementation.id)) {
        issues.push({ code: "missing_reverse_implementation", path, message: `${id} does not reference ${implementation.id}` });
      }
    });
  }

  for (const visual of bundle.visualAssets) {
    const path = `visualAssets.${visual.id}`;
    if (!bundle.segments.some((segment) => segment.id === visual.segment)) {
      issues.push({ code: "invalid_visual_segment", path, message: `Unknown segment: ${visual.segment}` });
    }
    visual.sceneIds.forEach((id) => {
      const scene = scenes.find((item) => item.id === id);
      if (!scene) issues.push({ code: "invalid_visual_scene", path, message: `Unknown scene: ${id}` });
      else if (scene.segment !== visual.segment) issues.push({ code: "visual_segment_mismatch", path, message: `${id} belongs to ${scene.segment}` });
    });
    visual.capabilityIds.forEach((id) => {
      if (!capabilityIds.has(id)) issues.push({ code: "invalid_visual_capability", path, message: `Unknown capability: ${id}` });
    });
    if ((visual.status === "placeholder" || visual.status === "approval_required") && visual.assetPath !== null) {
      issues.push({ code: "unsourced_visual_path", path, message: "Missing or unapproved visual must not have an asset path" });
    }
  }

  for (const proof of bundle.proofAssets) {
    const path = `proofAssets.${proof.id}`;
    if (!bundle.segments.some((segment) => segment.id === proof.segment)) {
      issues.push({ code: "invalid_proof_segment", path, message: `Unknown segment: ${proof.segment}` });
    }
    proof.relatedSceneIds.forEach((id) => {
      const scene = scenes.find((item) => item.id === id);
      if (!scene) issues.push({ code: "invalid_proof_scene", path, message: `Unknown scene: ${id}` });
      else if (scene.segment !== proof.segment) issues.push({ code: "proof_segment_mismatch", path, message: `${id} belongs to ${scene.segment}` });
    });
    proof.relatedCapabilityIds.forEach((id) => {
      if (!capabilityIds.has(id)) issues.push({ code: "invalid_proof_capability", path, message: `Unknown capability: ${id}` });
    });
    if (proof.playable && (proof.status !== "available" || !proof.externalUseApproved || proof.format === null)) {
      issues.push({ code: "unapproved_playable_proof", path, message: "Playable proof requires available status, an approved format and external-use approval" });
    }
    if (proof.status === "placeholder" && proof.playable) {
      issues.push({ code: "playable_placeholder", path, message: "Placeholder proof cannot be playable" });
    }
    if (proof.status === "placeholder" && (proof.format !== null || proof.videoDuration !== null || proof.thumbnailAssetId !== null || proof.challenge !== null || proof.measurementApproach !== null || proof.customerLearning !== null)) {
      issues.push({ code: "populated_proof_placeholder", path, message: "Placeholder proof content must remain null until approved" });
    }
  }

  return issues;
}

export function assertValidContentBundle(bundle: ContentBundle): void {
  const issues = validateContentBundle(bundle);
  if (issues.length) {
    throw new Error(issues.map((issue) => `${issue.code} at ${issue.path}: ${issue.message}`).join("\n"));
  }
}
