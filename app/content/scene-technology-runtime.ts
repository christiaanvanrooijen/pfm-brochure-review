/**
 * Scene-scoped technology runtime.
 *
 * WHY THIS EXISTS, RATHER THAN REUSING `solution-runtime.ts`
 *
 * `solution-runtime.ts` already resolves capability -> implementation ->
 * requirements -> privacy correctly, but it is keyed by `SolutionDirectionId` —
 * a Configure-only grouping that exists for Retail and Shopping Centre and
 * NOT for Retail Park, Outlet Centre or QSR (`solution-directions-*.ts` has no
 * file for either). The technical drawer attaches to a SCENE, in every
 * segment, whether or not that segment has ever had a solution direction
 * written for it. Keying this module by `(segmentId, scene)` instead of by
 * direction is what lets QSR and Outlet Centre resolve technology content at
 * all.
 *
 * The underlying facts are not re-derived. This module composes
 * `technology-runtime.ts`, `technology-visuals.ts` and
 * `segment-capability-media.ts` — the same sources `solution-runtime.ts`
 * composes — so a change to an implementation, a visual or an override is
 * visible here without being re-stated.
 *
 * WHAT MUST SURVIVE FROM THE SEGMENT OVERRIDE, UNCHANGED
 *
 * - An override's `implementationIds` NARROWS the capability's implementation
 *   list; it can never add one the capability does not already resolve.
 * - An empty `implementationIds` array means "none for this segment", and is
 *   preserved as an empty array here — never silently filled with another
 *   segment's implementations, and never read as "no override" (which would
 *   fall through to the full unnarrowed list).
 * - `allowCapabilityVideo: false` withholds the capability's example video
 *   for that segment, regardless of what other segments show.
 *
 * PRIVACY IS PER IMPLEMENTATION
 *
 * `getScenePrivacyEntries` returns one entry per (capability, implementation)
 * pair the scene can honestly show, and every entry carries only that
 * implementation's own `privacyStatus`, `supportedClaims` and `sourceRefs`.
 * Two implementations never share an array. Where `privacyStatus` is not at
 * least `partially_source_backed`, `supportedClaims` is withheld — a status
 * that has not cleared source review is not "probably fine to claim."
 */

import { getSceneDrawerOverride, getSegmentDrawerSetting } from "./scene-drawer-overrides.ts";
import type { Locale } from "../i18n/locales.ts";
import type {
  DataRole,
  DerivedDependencyDefinition,
  EvidenceInputId,
  SceneDefinition,
  SegmentId,
  SourceStatus,
  TechnologyCapabilityDefinition,
  TechnologyCapabilityId,
  TechnologyImplementationDefinition,
  TechnologyImplementationId,
} from "./types.ts";

import { evidenceInputs } from "./evidence-inputs.ts";
import {
  getImplementationReadiness,
  getImplementationsForCapability,
  getTechnologyCapability,
  type ImplementationReadiness,
} from "./technology-runtime.ts";
import {
  getCapabilityContextVisual,
  getCapabilityExplainerVisuals,
  getImplementationRequirementProfile,
  getImplementationVisual,
  type CapabilityContextVisual,
  type CapabilityExplainerVisual,
  type ImplementationRequirementProfile,
  type ImplementationVisual,
} from "./technology-visuals.ts";
import { getCapabilityExplainerVideo, type CapabilityExplainerVideoView } from "./solution-runtime.ts";
import { getSegmentCapabilityMediaOverride } from "./segment-capability-media.ts";

/* ==========================================================================
   TECHNOLOGY — capability, in typed scene order, implementations narrowed
   exactly as the override declares
   ========================================================================== */

export interface SceneImplementationView {
  implementation: TechnologyImplementationDefinition;
  id: TechnologyImplementationId;
  supplier: string | null;
  product: string | null;
  implementationRole: string;
  readiness: ImplementationReadiness;
  visual: ImplementationVisual | null;
  requirementProfile: ImplementationRequirementProfile | null;
  /** This implementation's own status. Never inherited from another. */
  privacyStatus: SourceStatus;
  /** True only when this implementation's own evidence clears the bar. */
  hasPrivacyEvidence: boolean;
  supportedClaims: readonly string[];
  blockedClaims: readonly string[];
  sourceRefs: readonly string[];
}

export interface SceneCapabilityView {
  capabilityId: TechnologyCapabilityId;
  capability: TechnologyCapabilityDefinition;
  name: string;
  /** The segment override's purpose where one exists, else the capability's own. */
  purpose: string;
  /** The drawer's own explanation — scene first, then segment — in every language. */
  scenePurpose: Readonly<Record<Locale, string>> | null;
  privacyPrinciple: string;
  /** Illustrative reference visual for the capability itself — e.g. the GIS map. */
  contextVisual: CapabilityContextVisual | null;
  /** Measurement-principle explainers, resolved by SEGMENT and capability. */
  explainerVisuals: readonly CapabilityExplainerVisual[];
  /** Null where the override withholds the capability's video for this segment. */
  explainerVideo: CapabilityExplainerVideoView | null;
  implementations: readonly SceneImplementationView[];
  /** Set only when the override narrows implementations to none, with its reason. */
  implementationNote: string | null;
}

/** Privacy evidence counts as present only when the source says so. */
function hasPrivacyEvidence(status: SourceStatus): boolean {
  return status === "source_backed" || status === "partially_source_backed";
}

function toImplementationView(impl: TechnologyImplementationDefinition): SceneImplementationView {
  const evidencePresent = hasPrivacyEvidence(impl.privacyStatus);
  return {
    implementation: impl,
    id: impl.id,
    supplier: impl.supplier,
    product: impl.product,
    implementationRole: impl.implementationRole,
    readiness: getImplementationReadiness(impl.id),
    visual: getImplementationVisual(impl.id),
    requirementProfile: getImplementationRequirementProfile(impl.id),
    privacyStatus: impl.privacyStatus,
    hasPrivacyEvidence: evidencePresent,
    supportedClaims: evidencePresent ? impl.supportedClaims : [],
    blockedClaims: impl.unsupportedClaims,
    sourceRefs: impl.sourceRefs,
  };
}

/**
 * Every capability a scene declares, in the scene's own declaration order,
 * each with its implementations narrowed exactly as the segment override
 * says — the SAME narrowing the Technology, Requirements and Privacy views
 * all read, so the three tabs can never disagree about which implementations
 * this segment shows for this capability.
 */
export function getSceneCapabilityViews(
  segmentId: SegmentId,
  scene: SceneDefinition,
): readonly SceneCapabilityView[] {
  /* A scene may explain a different set of capabilities than it declares —
     see `scene-drawer-overrides.ts`. Only this drawer reads that; the typed
     scene is untouched. */
  const sceneOverride = getSceneDrawerOverride(scene.id);
  return (sceneOverride?.capabilityIds ?? scene.technologyCapabilityIds)
    .map((capabilityId) => getTechnologyCapability(capabilityId))
    .filter((c): c is TechnologyCapabilityDefinition => c !== undefined)
    .map((capability): SceneCapabilityView => {
      const override = getSegmentCapabilityMediaOverride(segmentId, capability.id);
      /* The drawer's own choice for this segment, where the product lead made
         one. It replaces the shared list — which the approved Configure
         previews also read — for this drawer only. */
      const drawer = getSegmentDrawerSetting(segmentId, capability.id);
      const sceneSetting = sceneOverride?.capabilities?.[capability.id];
      const segmentList = drawer?.implementationIds ?? override?.implementationIds;

      const implementations = getImplementationsForCapability(capability.id)
        .filter((impl) => !segmentList || segmentList.includes(impl.id))
        // Narrows further, never widens: applied after the segment's own list.
        .filter((impl) => !sceneSetting?.implementationIds || sceneSetting.implementationIds.includes(impl.id));

      return {
        capabilityId: capability.id,
        capability,
        name: capability.name,
        purpose: sceneSetting?.purpose?.en ?? drawer?.purpose?.en ?? override?.purpose ?? capability.purpose,
        scenePurpose: sceneSetting?.purpose ?? drawer?.purpose ?? null,
        privacyPrinciple: capability.privacyPrinciple,
        contextVisual: getCapabilityContextVisual(capability.id),
        explainerVisuals:
          drawer?.explainerVisuals ??
          override?.explainerVisuals ??
          getCapabilityExplainerVisuals(capability.id, segmentId),
        explainerVideo:
          override?.allowCapabilityVideo === false ? null : getCapabilityExplainerVideo(capability.id),
        implementationNote: implementations.length === 0 ? (override?.note ?? null) : null,
        implementations: implementations.map(toImplementationView),
      };
    });
}

/* ==========================================================================
   PRIVACY — flattened across every capability the scene declares, one entry
   per implementation, never merged
   ========================================================================== */

export interface ScenePrivacyEntry {
  capabilityId: TechnologyCapabilityId;
  capabilityName: string;
  privacyPrinciple: string;
  implementationId: TechnologyImplementationId;
  supplier: string | null;
  product: string | null;
  implementationRole: string;
  privacyStatus: SourceStatus;
  hasPrivacyEvidence: boolean;
  supportedClaims: readonly string[];
  blockedClaims: readonly string[];
  sourceRefs: readonly string[];
}

export function getScenePrivacyEntries(
  segmentId: SegmentId,
  scene: SceneDefinition,
): readonly ScenePrivacyEntry[] {
  return getSceneCapabilityViews(segmentId, scene).flatMap((capView) =>
    capView.implementations.map(
      (impl): ScenePrivacyEntry => ({
        capabilityId: capView.capabilityId,
        capabilityName: capView.name,
        privacyPrinciple: capView.privacyPrinciple,
        implementationId: impl.id,
        supplier: impl.supplier,
        product: impl.product,
        implementationRole: impl.implementationRole,
        privacyStatus: impl.privacyStatus,
        hasPrivacyEvidence: impl.hasPrivacyEvidence,
        supportedClaims: impl.supportedClaims,
        blockedClaims: impl.blockedClaims,
        sourceRefs: impl.sourceRefs,
      }),
    ),
  );
}

/* ==========================================================================
   REQUIREMENTS — the scene's own declared inputs, distinguishing mandatory
   from alternative from optional-enrichment
   ========================================================================== */

export interface RequirementInput {
  id: EvidenceInputId;
  label: string;
  dataRole: DataRole;
}

export interface DependencyRequirementView {
  dependencyId: string;
  output: string;
  /** Every one of these is required together. Empty when the dependency is
   *  satisfied by an alternative group instead. */
  required: readonly RequirementInput[];
  /** Each inner array is one sufficient combination; the groups are
   *  alternatives to each other. Empty when there is no alternative path. */
  alternativeGroups: readonly (readonly RequirementInput[])[];
}

export interface SceneRequirementView {
  /** Data roles this scene cannot answer its question without. */
  requiredRoles: readonly DataRole[];
  /** Data roles that enrich the answer but are never load-bearing. */
  optionalRoles: readonly DataRole[];
  dependencies: readonly DependencyRequirementView[];
}

function resolveInput(id: EvidenceInputId): RequirementInput | null {
  const input = evidenceInputs.find((candidate) => candidate.id === id);
  return input ? { id: input.id, label: input.label, dataRole: input.dataRole } : null;
}

function resolveDependency(dependency: DerivedDependencyDefinition): DependencyRequirementView {
  return {
    dependencyId: dependency.id,
    output: dependency.output,
    required: dependency.requiredInputIds
      .map(resolveInput)
      .filter((input): input is RequirementInput => input !== null),
    alternativeGroups: (dependency.alternativeInputGroups ?? []).map((group) =>
      group.map(resolveInput).filter((input): input is RequirementInput => input !== null),
    ),
  };
}

export function getSceneRequirementView(scene: SceneDefinition): SceneRequirementView {
  return {
    requiredRoles: scene.dataRequirements.required,
    optionalRoles: scene.dataRequirements.optional,
    dependencies: scene.derivedDependencies.map(resolveDependency),
  };
}
