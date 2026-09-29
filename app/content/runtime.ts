/**
 * Scene Runtime
 *
 * Generic, deterministic runtime for querying the typed content model.
 * Translates SceneDefinition/SegmentDefinition into presenter/navigation logic.
 *
 * Design principles:
 * - Pure functions where possible
 * - Segment-safe lookups (prevent cross-segment errors)
 * - Canonical journey order preserved
 * - Core/Optional/Advanced separation maintained
 * - No UI coupling - this is a data/query layer only
 */

import type {
  SegmentDefinition,
  SegmentId,
  SceneDefinition,
  SceneId,
  JourneyStage,
  ProofAssetDefinition,
  TechnologyCapabilityDefinition,
  TechnologyImplementationDefinition,
  TechnologyCapabilityId,
  VisualAssetDefinition,
} from "./types.ts";

import { canonicalJourney } from "./types.ts";

import {
  segmentDefinitions,
  allScenes,
  contentBundle,
} from "./index.ts";

// Re-export canonical journey for consumers
export { canonicalJourney } from "./types.ts";

/**
 * Get a segment by ID
 */
export function getSegment(segmentId: SegmentId): SegmentDefinition | undefined {
  return segmentDefinitions.find((segment) => segment.id === segmentId);
}

/**
 * Get all segments
 */
export function getAllSegments(): readonly SegmentDefinition[] {
  return segmentDefinitions;
}

/**
 * Get a scene by ID (segment-safe - validates segment match)
 */
export function getScene(sceneId: SceneId): SceneDefinition | undefined {
  return allScenes.find((scene) => scene.id === sceneId);
}

/**
 * Get a scene for a specific segment (throws if scene belongs to different segment)
 */
export function getSceneForSegment(segmentId: SegmentId, sceneId: SceneId): SceneDefinition {
  const scene = allScenes.find((s) => s.id === sceneId);
  if (!scene) {
    throw new Error(`Scene not found: ${sceneId}`);
  }
  if (scene.segment !== segmentId) {
    throw new Error(`Scene ${sceneId} belongs to segment ${scene.segment}, not ${segmentId}`);
  }
  return scene;
}

/**
 * Get all scenes for a segment
 */
export function getScenesForSegment(segmentId: SegmentId): readonly SceneDefinition[] {
  const segment = getSegment(segmentId);
  if (!segment) {
    return [];
  }
  return segment.scenes;
}

/**
 * Get scenes for a specific journey stage within a segment
 */
export function getScenesForStage(segmentId: SegmentId, journeyStage: JourneyStage): readonly SceneDefinition[] {
  const segment = getSegment(segmentId);
  if (!segment) {
    return [];
  }
  const sceneIds = segment.stageMapping[journeyStage] ?? [];
  return sceneIds.map((id) => getSceneForSegment(segmentId, id));
}

/**
 * Get the Core route for a segment (only Core scenes, ordered by corePathOrder)
 */
export function getCoreRoute(segmentId: SegmentId): readonly SceneDefinition[] {
  const segment = getSegment(segmentId);
  if (!segment) {
    return [];
  }
  return segment.coreRoute.map((sceneId) => getSceneForSegment(segmentId, sceneId));
}

/**
 * Get Optional branches for a segment
 */
export function getOptionalBranches(segmentId: SegmentId): readonly SceneDefinition[] {
  const segment = getSegment(segmentId);
  if (!segment) {
    return [];
  }
  return segment.optionalBranches.map((sceneId) => getSceneForSegment(segmentId, sceneId));
}

/**
 * Get Advanced branches for a segment
 */
export function getAdvancedBranches(segmentId: SegmentId): readonly SceneDefinition[] {
  const segment = getSegment(segmentId);
  if (!segment) {
    return [];
  }
  return segment.advancedBranches.map((sceneId) => getSceneForSegment(segmentId, sceneId));
}

/**
 * Get the next Core scene in the route
 */
export function getNextCoreScene(segmentId: SegmentId, currentSceneId: SceneId): SceneDefinition | null {
  const coreRoute = getCoreRoute(segmentId);
  const currentIndex = coreRoute.findIndex((scene) => scene.id === currentSceneId);
  if (currentIndex === -1 || currentIndex === coreRoute.length - 1) {
    return null;
  }
  return coreRoute[currentIndex + 1];
}

/**
 * Get the previous Core scene in the route
 */
export function getPreviousCoreScene(segmentId: SegmentId, currentSceneId: SceneId): SceneDefinition | null {
  const coreRoute = getCoreRoute(segmentId);
  const currentIndex = coreRoute.findIndex((scene) => scene.id === currentSceneId);
  if (currentIndex <= 0) {
    return null;
  }
  return coreRoute[currentIndex - 1];
}

/**
 * Get route position metadata for a Core scene
 */
export interface RoutePosition {
  currentIndex: number;           // 0-based index in Core route
  totalCoreScenes: number;        // total scenes in Core route
  isFirst: boolean;               // first scene in Core route
  isLast: boolean;                // last scene in Core route
  previousCoreScene: SceneDefinition | null;
  nextCoreScene: SceneDefinition | null;
  journeyStage: JourneyStage;     // canonical journey stage
  scene: SceneDefinition;
}

export function getRoutePosition(segmentId: SegmentId, sceneId: SceneId): RoutePosition | null {
  const coreRoute = getCoreRoute(segmentId);
  const currentIndex = coreRoute.findIndex((scene) => scene.id === sceneId);
  if (currentIndex === -1) {
    return null;
  }

  const scene = coreRoute[currentIndex];
  const totalCoreScenes = coreRoute.length;

  return {
    currentIndex,
    totalCoreScenes,
    isFirst: currentIndex === 0,
    isLast: currentIndex === totalCoreScenes - 1,
    previousCoreScene: currentIndex > 0 ? coreRoute[currentIndex - 1] : null,
    nextCoreScene: currentIndex < totalCoreScenes - 1 ? coreRoute[currentIndex + 1] : null,
    journeyStage: scene.journeyStage,
    scene,
  };
}

/**
 * Get segment implementation status
 */
export function getSegmentImplementationStatus(segmentId: SegmentId): "implementation_ready" | "architecture_only" | null {
  const segment = getSegment(segmentId);
  return segment?.implementationStatus ?? null;
}

/**
 * Check if a proof asset is usable (approved and playable)
 */
export function isProofUsable(proof: ProofAssetDefinition): boolean {
  return proof.status === "available" && proof.playable && proof.externalUseApproved && proof.format !== null;
}

/**
 * Get usable proof assets for a scene
 */
export function getUsableProofsForScene(sceneId: SceneId): readonly ProofAssetDefinition[] {
  const scene = getScene(sceneId);
  if (!scene) {
    return [];
  }
  return scene.proofAssetIds
    .map((id) => contentBundle.proofAssets.find((p) => p.id === id))
    // Same scene gate as proof-runtime: the proof must name this scene itself.
    .filter(
      (p): p is ProofAssetDefinition =>
        p !== undefined && p.relatedSceneIds.includes(sceneId) && isProofUsable(p),
    );
}

/**
 * Check if a scene has any usable proof
 */
export function sceneHasUsableProof(sceneId: SceneId): boolean {
  return getUsableProofsForScene(sceneId).length > 0;
}

/**
 * Get technology capabilities attached to a scene
 */
export function getTechnologyCapabilitiesForScene(sceneId: SceneId): readonly TechnologyCapabilityDefinition[] {
  const scene = getScene(sceneId);
  if (!scene) {
    return [];
  }
  return scene.technologyCapabilityIds
    .map((id) => contentBundle.technologyCapabilities.find((c) => c.id === id))
    .filter((c): c is TechnologyCapabilityDefinition => c !== undefined);
}

/**
 * Get implementation options for a capability
 */
export function getImplementationsForCapability(capabilityId: TechnologyCapabilityId): readonly TechnologyImplementationDefinition[] {
  return contentBundle.technologyImplementations.filter((impl) =>
    impl.capabilityIds.includes(capabilityId)
  );
}

/**
 * Get visual asset for a scene
 */
export function getVisualAssetForScene(sceneId: SceneId): VisualAssetDefinition | undefined {
  const scene = getScene(sceneId);
  if (!scene) {
    return undefined;
  }
  return contentBundle.visualAssets.find((asset) => asset.id === scene.visualAssetId);
}

/**
 * Check if a visual asset is approved/ready for use
 */
export function isVisualAssetReady(asset: VisualAssetDefinition): boolean {
  return asset.status === "approved" || asset.status === "reference";
}

/**
 * Get route metadata for a scene (useful for presenter UI)
 */
export interface SceneRouteMetadata {
  scene: SceneDefinition;
  routePosition: RoutePosition | null;
  optionalBranches: readonly SceneDefinition[];
  advancedBranches: readonly SceneDefinition[];
  hasUsableProof: boolean;
  technologyCapabilities: readonly TechnologyCapabilityDefinition[];
  visualAsset: VisualAssetDefinition | undefined;
  isVisualAssetReady: boolean;
}

export function getSceneRouteMetadata(segmentId: SegmentId, sceneId: SceneId): SceneRouteMetadata | null {
  const segment = getSegment(segmentId);
  if (!segment) {
    return null;
  }

  // Validate scene belongs to segment
  const scene = allScenes.find((s) => s.id === sceneId);
  if (!scene || scene.segment !== segmentId) {
    return null;
  }

  const routePosition = getRoutePosition(segmentId, sceneId);
  const optionalBranches = getOptionalBranches(segmentId);
  const advancedBranches = getAdvancedBranches(segmentId);

  return {
    scene,
    routePosition,
    optionalBranches: optionalBranches.filter((s) => s.id !== sceneId),
    advancedBranches: advancedBranches.filter((s) => s.id !== sceneId),
    hasUsableProof: sceneHasUsableProof(sceneId),
    technologyCapabilities: getTechnologyCapabilitiesForScene(sceneId),
    visualAsset: getVisualAssetForScene(sceneId),
    isVisualAssetReady: getVisualAssetForScene(sceneId) ? isVisualAssetReady(getVisualAssetForScene(sceneId)!) : false,
  };
}

/**
 * Get all Core route metadata for a segment (for building navigation)
 */
export interface CoreRouteMetadata {
  segment: SegmentDefinition;
  coreScenes: Array<{
    scene: SceneDefinition;
    routePosition: RoutePosition;
    hasUsableProof: boolean;
    technologyCapabilities: readonly TechnologyCapabilityDefinition[];
    visualAsset: VisualAssetDefinition | undefined;
  }>;
}

export function getCoreRouteMetadata(segmentId: SegmentId): CoreRouteMetadata | null {
  const segment = getSegment(segmentId);
  if (!segment) {
    return null;
  }

  const coreScenes = getCoreRoute(segmentId).map((scene) => ({
    scene,
    routePosition: getRoutePosition(segmentId, scene.id)!,
    hasUsableProof: sceneHasUsableProof(scene.id),
    technologyCapabilities: getTechnologyCapabilitiesForScene(scene.id),
    visualAsset: getVisualAssetForScene(scene.id),
  }));

  return {
    segment,
    coreScenes,
  };
}

/**
 * Validate cross-segment references
 * Throws if any scene references a scene from a different segment
 */

/**
 * Get Optional branches for a specific Core scene
 */
export function getOptionalBranchesForScene(segmentId: SegmentId, sceneId: SceneId): readonly SceneDefinition[] {
  const segment = getSegment(segmentId);
  if (!segment) {
    return [];
  }
  // Find all optional scenes that have this scene as a branch parent
  return segment.scenes
    .filter((scene) => scene.priority === "optional")
    .filter((scene) => scene.branchFromSceneIds?.includes(sceneId))
    .map((scene) => getSceneForSegment(segmentId, scene.id));
}

/**
 * Get Advanced branches for a specific Core scene
 */
export function getAdvancedBranchesForScene(segmentId: SegmentId, sceneId: SceneId): readonly SceneDefinition[] {
  const segment = getSegment(segmentId);
  if (!segment) {
    return [];
  }
  // Find all advanced scenes that have this scene as a branch parent
  return segment.scenes
    .filter((scene) => scene.priority === "advanced")
    .filter((scene) => scene.branchFromSceneIds?.includes(sceneId))
    .map((scene) => getSceneForSegment(segmentId, scene.id));
}

/**
 * Get all branches (Optional + Advanced) for a specific Core scene
 */
export function getBranchesForScene(segmentId: SegmentId, sceneId: SceneId): {
  optional: readonly SceneDefinition[];
  advanced: readonly SceneDefinition[];
} {
  return {
    optional: getOptionalBranchesForScene(segmentId, sceneId),
    advanced: getAdvancedBranchesForScene(segmentId, sceneId),
  };
}

/**
 * Get the branch parent scenes for a branch scene (reverse lookup)
 */
export function getBranchParentsForScene(segmentId: SegmentId, sceneId: SceneId): readonly SceneDefinition[] {
  const segment = getSegment(segmentId);
  if (!segment) {
    return [];
  }
  const scene = getSceneForSegment(segmentId, sceneId);
  if (!scene.branchFromSceneIds || scene.branchFromSceneIds.length === 0) {
    return [];
  }
  return scene.branchFromSceneIds.map((parentId) => getSceneForSegment(segmentId, parentId));
}

export function validateCrossSegmentReferences(): readonly string[] {
  const errors: string[] = [];
  for (const scene of allScenes) {
    if (scene.nextSceneId) {
      const nextScene = getScene(scene.nextSceneId);
      if (nextScene && nextScene.segment !== scene.segment) {
        errors.push(`Scene ${scene.id} (${scene.segment}) references nextScene ${scene.nextSceneId} (${nextScene.segment})`);
      }
    }
    // Check proof assets
    for (const proofId of scene.proofAssetIds) {
      const proof = contentBundle.proofAssets.find((p) => p.id === proofId);
      if (proof && proof.segment !== scene.segment) {
        errors.push(`Scene ${scene.id} (${scene.segment}) references proof ${proofId} (${proof.segment})`);
      }
    }
    // Check visual asset
    const visual = contentBundle.visualAssets.find((v) => v.id === scene.visualAssetId);
    if (visual && visual.segment !== scene.segment) {
      errors.push(`Scene ${scene.id} (${scene.segment}) references visual ${scene.visualAssetId} (${visual.segment})`);
    }
  }
  return errors;
}

/**
 * Get canonical journey stages in order
 */
export function getCanonicalJourneyStages(): readonly JourneyStage[] {
  return canonicalJourney;
}

/**
 * Check if a stage is a synthesis stage (Configure or Act)
 */
export function isSynthesisStage(stage: JourneyStage): boolean {
  return stage === "configure" || stage === "act";
}

/**
 * Get all synthesis stages
 */
export function getSynthesisStages(): readonly JourneyStage[] {
  return ["configure", "act"] as const;
}
