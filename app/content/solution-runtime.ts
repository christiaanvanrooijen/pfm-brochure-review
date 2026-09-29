/**
 * Configure / Solution Direction Runtime
 *
 * Deterministic query layer for the Configure synthesis stage. It answers the
 * four questions a prospect may ask of a solution direction — how we do this,
 * what is needed, privacy, see it in practice — by composing the runtimes that
 * already own those truths:
 *
 *   how we do this     -> technology-runtime.ts (capability -> implementation)
 *   what is needed     -> scene `derivedDependencies` + evidence-inputs.ts
 *   privacy            -> technology.ts, per implementation, never generalised
 *   see it in practice -> proof-runtime.ts, permission-gated
 *
 * Design constraints, all of them load-bearing:
 *
 * - CAPABILITY-FIRST. The drilldown shape puts `capability` at the root of each
 *   entry and nests `implementations` inside it. There is no shape in which an
 *   implementation can be read without its capability context first.
 * - NO RECOMMENDATION. No function ranks, scores, sorts by preference, marks a
 *   default or picks a "best" option. Implementation order is declaration order
 *   from the typed content and carries no meaning; `implementationsAreRanked` is
 *   exported as a literal `false` so a consumer cannot infer one.
 * - NO PRICING, ROI OR CALCULATION. Nothing here computes a number.
 * - PRIVACY IS IMPLEMENTATION-SPECIFIC. `getSolutionPrivacyDetail` returns one
 *   entry per implementation, each carrying that implementation's own
 *   `privacyStatus`, its own claims and its own source refs. Claims are never
 *   merged, defaulted or copied between suppliers.
 * - NO NEW TRUTH. Every string that makes a product, privacy or proof claim is
 *   read from existing typed content. This module composes; it does not assert.
 */

import type {
  DataRole,
  EvidenceInputId,
  ProofAssetDefinition,
  SceneDefinition,
  SegmentId,
  SourceStatus,
  TechnologyCapabilityDefinition,
  TechnologyCapabilityId,
  TechnologyImplementationDefinition,
  TechnologyImplementationId,
} from "./types.ts";

import { evidenceInputs } from "./evidence-inputs.ts";
import { getSceneForSegment, getSegment } from "./runtime.ts";
import {
  getCapabilityReadiness,
  getImplementation,
  getImplementationReadiness,
  getImplementationsForCapability,
  getTechnologyCapability,
  type CapabilityReadiness,
  type ImplementationReadiness,
} from "./technology-runtime.ts";
import {
  getInternalProofsForScene,
  getPlayableProofsForScene,
} from "./proof-runtime.ts";
import {
  capabilityContextVisuals,
  capabilityExplainerVisuals,
  getCapabilityContextVisual,
  getAllCapabilityExplainerVisuals,
  getCapabilityExplainerVisuals,
  getImplementationRequirementProfile,
  getImplementationVisual,
  implementationRequirementProfiles,
  implementationVisuals,
  type CapabilityContextVisual,
  type CapabilityExplainerVisual,
  type ImplementationDetailRow,
} from "./technology-visuals.ts";
import {
  capabilityExplainerVideos,
  configureDepthIds,
  configureDepthLabels,
  configurePrivacyStatement,
  explainerVideoViewLabels,
  retailSolutionDirections,
  solutionDirectionIds,
  type CapabilityExplainerFollowOnVideo,
  type CapabilityExplainerVideo,
  type ConfigureDepthId,
  type ExplainerVideoViewKind,
  type SolutionDirectionDefinition,
  type SolutionDirectionId,
  type SolutionTerritory,
} from "./solution-directions.ts";
import { shoppingCentreSolutionDirections } from "./solution-directions-shopping-centre.ts";
import { retailParkSolutionDirections } from "./solution-directions-retail-park.ts";
import { getSegmentCapabilityMediaOverride } from "./segment-capability-media.ts";
import { implementationPresentationNames } from "./technology-presentation.ts";
import { getImplementationExplainerVideo, type ImplementationExplainerVideo } from "./implementation-videos.ts";

export type {
  CapabilityContextVisual,
  CapabilityExplainerFollowOnVideo,
  CapabilityExplainerVideo,
  CapabilityExplainerVisual,
  ConfigureDepthId,
  ExplainerVideoViewKind,
  ImplementationDetailRow,
  SolutionDirectionDefinition,
  SolutionDirectionId,
  SolutionTerritory,
};
export {
  capabilityExplainerVideos,
  capabilityExplainerVisuals,
  explainerVideoViewLabels,
  getCapabilityExplainerVisuals,
  configureDepthIds,
  configureDepthLabels,
  configurePrivacyStatement,
  solutionDirectionIds,
};

/**
 * Explicit, machine-readable statement that implementation order is not a
 * ranking. Exported so the UI and the tests read the same fact rather than each
 * assuming it.
 */
export const implementationsAreRanked = false as const;

const allSolutionDirections: readonly SolutionDirectionDefinition[] = [
  ...retailSolutionDirections,
  ...shoppingCentreSolutionDirections,
  ...retailParkSolutionDirections,
];

const inputById = new Map(evidenceInputs.map((input) => [input.id, input]));

/** Every solution direction defined for a segment, in declaration order. */
export function getSolutionDirectionsForSegment(
  segmentId: SegmentId,
): readonly SolutionDirectionDefinition[] {
  return allSolutionDirections.filter((direction) => direction.segment === segmentId);
}

export function getSolutionDirection(
  directionId: SolutionDirectionId,
): SolutionDirectionDefinition | undefined {
  return allSolutionDirections.find((direction) => direction.id === directionId);
}

/**
 * The typed Configure synthesis contract for a segment.
 *
 * The UI binds to this rather than restating the governing question in JSX, so
 * Configure cannot drift from the architecture that declares it a synthesis
 * stage with `recommendationMode: "none"`.
 */
export function getConfigureSynthesis(segmentId: SegmentId) {
  return getSegment(segmentId)?.synthesis.configure;
}

/** Scenes a direction synthesises, resolved segment-safely. */
function relatedScenes(
  direction: SolutionDirectionDefinition,
): readonly SceneDefinition[] {
  return direction.relatedSceneIds.map((sceneId) =>
    getSceneForSegment(direction.segment, sceneId),
  );
}

/* ==========================================================================
   HOW WE DO THIS — customer question -> capability -> what it provides ->
   possible implementations -> source / readiness
   ========================================================================== */

export interface SolutionImplementationView {
  implementation: TechnologyImplementationDefinition;
  id: TechnologyImplementationId;
  supplier: string | null;
  product: string | null;
  implementationRole: string;
  measurementMethod: string | null;
  readiness: ImplementationReadiness;
  sourceStatus: SourceStatus;
  privacyStatus: SourceStatus;
  technicalDetailStatus: SourceStatus;
  supportedClaims: readonly string[];
  blockedClaims: readonly string[];
  sourceRefs: readonly string[];
  /** Product or infrastructure photograph, where one exists. */
  assetPath: string | null;
  altText: string | null;
  /**
   * True when the photograph shows infrastructure the implementation runs on
   * rather than the implementation itself — a camera beside an analytics
   * layer, for instance. The UI must not let such an image read as proof of
   * the analytics, its outputs or its privacy behaviour.
   */
  visualShowsInfrastructureOnly: boolean;
}

export interface SolutionCapabilityView {
  capability: TechnologyCapabilityDefinition;
  capabilityId: TechnologyCapabilityId;
  /**
   * A visual that explains the CAPABILITY, where one exists. Currently only the
   * geo/GIS catchment reference map. It is illustrative context, and it is
   * never presented as a measurement or as customer data.
   */
  contextVisual: CapabilityContextVisual | null;
  /**
   * The capability's example video AS RESOLVED FOR THIS SEGMENT.
   *
   * Resolved here rather than looked up in the component, so that a segment can
   * withhold a video whose own copy belongs to another kind of location without
   * the presentation layer having to know which segment it is rendering.
   */
  explainerVideo: CapabilityExplainerVideoView | null;
  /**
   * Shown where a segment resolves no implementation for this capability, so an
   * empty list reads as "not stated here" rather than as "nothing is required".
   */
  implementationNote: string | null;
  /**
   * Measurement-principle explainers for this capability, in declaration order.
   *
   * A list, not a single visual: a capability served by two genuinely different
   * physical approaches gets two, and they are shown side by side as
   * alternatives rather than merged. Empty where no explainer exists — the
   * layer is optional and its absence renders nothing.
   *
   * Distinct from `contextVisual`, which illustrates aggregate context, and from
   * the per-implementation product photographs under "What is needed".
   */
  explainerVisuals: readonly CapabilityExplainerVisual[];
  name: string;
  /** What the capability is for, in the content model's own words. */
  purpose: string;
  /** What kind of evidence it yields — "measured", "connected", "derived". */
  provides: readonly string[];
  privacyPrinciple: string;
  readiness: CapabilityReadiness;
  /** Implementation options. Order is declaration order and is not a ranking. */
  implementations: readonly SolutionImplementationView[];
}

export interface SolutionTechnologyDrilldown {
  direction: SolutionDirectionDefinition;
  /** Level 1 of the hierarchy: the customer's question, never a product. */
  customerQuestion: string;
  /**
   * What this direction makes answerable, taken verbatim from the related
   * scenes' typed `derivedDependencies[].output`. Real declared outputs, not
   * marketing copy.
   */
  answerableOutputs: readonly string[];
  /** Level 2 onwards. Capability at the root, implementations nested inside. */
  capabilities: readonly SolutionCapabilityView[];
  /** Always false. Implementation order carries no preference. */
  ranked: false;
}

function toImplementationView(
  impl: TechnologyImplementationDefinition,
): SolutionImplementationView {
  const visual = getImplementationVisual(impl.id);
  return {
    assetPath: visual?.assetPath ?? null,
    altText: visual?.altText ?? null,
    visualShowsInfrastructureOnly: visual?.showsInfrastructureOnly ?? false,
    implementation: impl,
    id: impl.id,
    supplier: impl.supplier,
    product: impl.product,
    implementationRole: impl.implementationRole,
    measurementMethod: impl.measurementMethod ?? null,
    readiness: getImplementationReadiness(impl.id),
    sourceStatus: impl.sourceStatus,
    privacyStatus: impl.privacyStatus,
    technicalDetailStatus: impl.technicalDetailStatus,
    supportedClaims: impl.supportedClaims,
    blockedClaims: impl.unsupportedClaims,
    sourceRefs: impl.sourceRefs,
  };
}

export function getSolutionTechnologyDrilldown(
  directionId: SolutionDirectionId,
): SolutionTechnologyDrilldown | null {
  const direction = getSolutionDirection(directionId);
  if (!direction) return null;

  const answerableOutputs = [
    ...new Set(
      relatedScenes(direction).flatMap((scene) =>
        scene.derivedDependencies.map((dependency) => dependency.output),
      ),
    ),
  ];

  const capabilities = direction.technologyCapabilityIds
    .map((capabilityId) => getTechnologyCapability(capabilityId))
    .filter((c): c is TechnologyCapabilityDefinition => c !== undefined)
    .map((capability): SolutionCapabilityView => {
      // How a capability is EXPLAINED can differ by segment even though the
      // capability itself does not. An override may narrow what this segment
      // shows or replace its explanation; it can never add an implementation
      // that the capability does not already resolve.
      const override = getSegmentCapabilityMediaOverride(direction.segment, capability.id);

      const resolvedImplementations = getImplementationsForCapability(capability.id).filter(
        (implementation) =>
          !override?.implementationIds ||
          override.implementationIds.includes(implementation.id),
      );

      return {
        capability,
        capabilityId: capability.id,
        contextVisual: getCapabilityContextVisual(capability.id),
        explainerVisuals:
          override?.explainerVisuals ?? getCapabilityExplainerVisuals(capability.id, direction.segment),
        explainerVideo:
          override?.allowCapabilityVideo === false
            ? null
            : getCapabilityExplainerVideo(capability.id),
        implementationNote: override?.note ?? null,
        name: capability.name,
        purpose: override?.purpose ?? capability.purpose,
        provides: capability.evidenceTypes,
        privacyPrinciple: capability.privacyPrinciple,
        readiness: getCapabilityReadiness(capability.id),
        implementations: resolvedImplementations.map(toImplementationView),
      };
    });

  return {
    direction,
    customerQuestion: direction.customerQuestion,
    answerableOutputs,
    capabilities,
    ranked: implementationsAreRanked,
  };
}

/* ==========================================================================
   VISUAL EXPLANATION — one optional PRIMARY video per capability, resolved
   beneath the capability it explains and never beneath a supplier, with an
   optional second derived layer nested inside it
   ========================================================================== */

/**
 * The nested second layer, resolved.
 *
 * It is returned INSIDE the primary view and is not reachable by any other
 * function. There is deliberately no `getCapabilityExplainerFollowOnVideo`: a
 * caller that wants the derived view has to hold the measured one first, which
 * is the same rule the UI enforces visually.
 */
export interface CapabilityExplainerFollowOnVideoView {
  src: string;
  actionLabel: string;
  intro: string;
  description: string;
  viewKind: ExplainerVideoViewKind;
  /** Reader-facing name of the view kind, so the distinction is visible. */
  viewLabel: string;
  distinctionNote: string;
  frameRatio: string;
  sourceRefs: readonly string[];
}

export interface CapabilityExplainerVideoView {
  capabilityId: TechnologyCapabilityId;
  /** The capability's own name. The video is always subordinate to it. */
  capabilityName: string;
  /** The measurement approach this footage illustrates, where one is named. */
  approachId: string | null;
  /** That approach's vendor-neutral name, read from the explainer family. */
  approachName: string | null;
  src: string;
  actionLabel: string;
  intro: string;
  description: string;
  viewKind: ExplainerVideoViewKind;
  /** Reader-facing name of the view kind, so the distinction is visible. */
  viewLabel: string;
  frameRatio: string;
  /**
   * The implementation the footage was recorded with, in the Technology
   * Runtime's own words (`implementationRole`). Not a recommendation, and never
   * a claim that other implementations of this capability behave the same way.
   * Null throughout where the footage documents no particular implementation.
   */
  exampleImplementationId: TechnologyImplementationId | null;
  exampleImplementationRole: string | null;
  /**
   * Internal: the supplier behind the example. Never rendered — the functional
   * name below is what a reader sees (product lead, 2026-09-27).
   */
  exampleSupplier: string | null;
  /** The example's functional name ("3D Sensor Basic FoV"); null where it has none. */
  exampleImplementationName: string | null;
  /** The optional derived view. Nested, so it can only be reached through this one. */
  followOn: CapabilityExplainerFollowOnVideoView | null;
  sourceRefs: readonly string[];
}

/**
 * The explanatory video for a capability, if one exists.
 *
 * Deliberately keyed by capability, so the hierarchy can only ever read
 * "capability -> example implementation" and never "supplier -> solution". Returns
 * null for every capability without approved footage, which is most of them.
 */
export function getCapabilityExplainerVideo(
  capabilityId: TechnologyCapabilityId,
): CapabilityExplainerVideoView | null {
  const video = capabilityExplainerVideos.find(
    (entry) => entry.capabilityId === capabilityId,
  );
  if (!video) return null;

  const capability = getTechnologyCapability(capabilityId);
  if (!capability) return null;

  // An implementation is named only where the content names one. A missing
  // implementation is not a failure state here — it is the honest case for
  // footage nobody has documented a product for.
  const impl = video.exampleImplementationId
    ? getImplementation(video.exampleImplementationId)
    : null;
  if (video.exampleImplementationId && !impl) return null;

  const approach = video.approachId
    ? getAllCapabilityExplainerVisuals(capabilityId).find(
        (visual) => visual.approachId === video.approachId,
      ) ?? null
    : null;

  return {
    capabilityId,
    capabilityName: capability.name,
    approachId: video.approachId,
    approachName: approach?.approachName ?? null,
    src: video.src,
    actionLabel: video.actionLabel,
    intro: video.intro,
    description: video.description,
    viewKind: video.viewKind,
    viewLabel: explainerVideoViewLabels[video.viewKind],
    frameRatio: video.frameRatio,
    exampleImplementationId: impl?.id ?? null,
    exampleImplementationRole: impl?.implementationRole ?? null,
    exampleSupplier: impl?.supplier ?? null,
    exampleImplementationName: impl ? (implementationPresentationNames[impl.id] ?? null) : null,
    followOn: video.followOn
      ? {
          src: video.followOn.src,
          actionLabel: video.followOn.actionLabel,
          intro: video.followOn.intro,
          description: video.followOn.description,
          viewKind: video.followOn.viewKind,
          viewLabel: explainerVideoViewLabels[video.followOn.viewKind],
          distinctionNote: video.followOn.distinctionNote,
          frameRatio: video.followOn.frameRatio,
          sourceRefs: video.followOn.sourceRefs,
        }
      : null,
    sourceRefs: video.sourceRefs,
  };
}

/* ==========================================================================
   WHAT IS NEEDED — derived from the related scenes' own dependencies
   ========================================================================== */

export interface SolutionRequirementItem {
  /** Present for a requirement derived from an evidence input; null for an alignment. */
  inputId: EvidenceInputId | null;
  label: string;
  dataRole: DataRole | null;
  kind: "evidence_input" | "commercial_alignment";
}

export interface SolutionRequirements {
  direction: SolutionDirectionDefinition;
  /** The commercially reassuring lead-in. */
  framing: string;
  /** First view. Capped so this reads as a conversation, not a site survey. */
  primary: readonly SolutionRequirementItem[];
  /** Everything beyond the first view. Presenter-side depth only. */
  additional: readonly SolutionRequirementItem[];
}

/**
 * The first view is capped, mixed, and balanced across data roles.
 *
 * Three things would each make it read wrongly. A first view of five evidence
 * inputs reads as a data request; a first view of five commercial alignments
 * reads as a sales pitch; and a first view taken in raw declaration order tends
 * to be all one data role, because a scene declares its physical dependencies
 * first. Performance intelligence is the clearest case: taken in raw order its
 * first view would list two physical measurements before naming the connected
 * sales value, which is the single most important thing PFM would need from the
 * customer for that direction — and the one thing PFM does not measure itself.
 *
 * So the evidence requirements are taken round-robin across the data roles they
 * belong to, preserving first-appearance order within each role. The remainder
 * is presenter-side depth, not hidden truth.
 */
const FIRST_VIEW_EVIDENCE_LIMIT = 4;
const FIRST_VIEW_ALIGNMENT_LIMIT = 1;

/** One item per data role in rotation, first-appearance order within each role. */
function balanceByDataRole(
  items: readonly SolutionRequirementItem[],
): readonly SolutionRequirementItem[] {
  const byRole = new Map<string, SolutionRequirementItem[]>();
  for (const item of items) {
    const role = item.dataRole ?? "unknown";
    const bucket = byRole.get(role);
    if (bucket) bucket.push(item);
    else byRole.set(role, [item]);
  }
  const buckets = [...byRole.values()];
  const balanced: SolutionRequirementItem[] = [];
  for (let round = 0; balanced.length < items.length; round += 1) {
    for (const bucket of buckets) {
      if (bucket[round]) balanced.push(bucket[round]);
    }
  }
  return balanced;
}

export function getSolutionRequirements(
  directionId: SolutionDirectionId,
): SolutionRequirements | null {
  const direction = getSolutionDirection(directionId);
  if (!direction) return null;

  // Evidence requirements are never authored here. They are the inputs the
  // related scenes already declare their derived outputs depend on, in scene
  // declaration order, de-duplicated.
  const seen = new Set<EvidenceInputId>();
  const evidenceItems: SolutionRequirementItem[] = [];
  for (const scene of relatedScenes(direction)) {
    for (const dependency of scene.derivedDependencies) {
      const inputIds: readonly EvidenceInputId[] = [
        ...dependency.requiredInputIds,
        ...(dependency.alternativeInputGroups ?? []).flat(),
      ];
      for (const inputId of inputIds) {
        if (seen.has(inputId)) continue;
        seen.add(inputId);
        const input = inputById.get(inputId);
        if (!input) continue;
        evidenceItems.push({
          inputId,
          label: input.label,
          dataRole: input.dataRole,
          kind: "evidence_input",
        });
      }
    }
  }

  const alignmentItems: SolutionRequirementItem[] = direction.alignmentNotes.map(
    (note) => ({
      inputId: null,
      label: note,
      dataRole: null,
      kind: "commercial_alignment",
    }),
  );

  const balanced = balanceByDataRole(evidenceItems);

  return {
    direction,
    framing: "To answer this well, we typically align:",
    primary: [
      ...balanced.slice(0, FIRST_VIEW_EVIDENCE_LIMIT),
      ...alignmentItems.slice(0, FIRST_VIEW_ALIGNMENT_LIMIT),
    ],
    additional: [
      ...balanced.slice(FIRST_VIEW_EVIDENCE_LIMIT),
      ...alignmentItems.slice(FIRST_VIEW_ALIGNMENT_LIMIT),
    ],
  };
}

/* ==========================================================================
   WHAT IS NEEDED, PART TWO — what would physically be at the location

   The requirement list above answers "what data does this need". This answers
   the question a prospect actually asks next: "so what goes in my store?"

   Three rules shape the shape of it:

   - ONE HERO AT A TIME. Not a sensor catalogue. The alternatives are present,
     quietly, and swapping to one replaces the hero rather than adding a card
     beside it. If a prospect leaves able to compare hardware but unable to say
     what would be needed, this section has failed.
   - CAPABILITY FIRST, STILL. Each hero is introduced by the capability it
     implements. The supplier and product are a subtitle, never a headline.
   - PLAIN LANGUAGE LEADS. Three site concerns in sentences. The specification
     rows sit behind a secondary action, and a row that no mapped source
     supports is labelled as product input rather than dressed as documented.
   ========================================================================== */

export interface SolutionImplementationOption {
  implementationId: TechnologyImplementationId;
  supplier: string | null;
  product: string | null;
  implementationRole: string;
  /**
   * The option's functional name ("Infrared Storefront sensor"), or its role
   * where it has none. Never a vendor or model (product lead, 2026-09-27;
   * applied to Configure 2026-09-28). Never the page headline.
   */
  headline: string;
  assetPath: string | null;
  altText: string | null;
  /** See `SolutionImplementationView.visualShowsInfrastructureOnly`. */
  visualShowsInfrastructureOnly: boolean;
  /** Capped at three, in plain language. */
  essentials: readonly { label: string; body: string }[];
  /** Audience-filtered. Empty means there is no honest table to show. */
  technicalDetail: readonly ImplementationDetailRow[];
  /**
   * Customer-safe line for an implementation whose detail is not source-mapped.
   * Null when a real table exists.
   */
  detailUnavailableNote: string | null;
  /**
   * PFM explaining this implementation on video, where one exists. Not proof:
   * it never reaches the proof runtime (implementation-videos.ts).
   */
  explainerVideo: ImplementationExplainerVideo | null;
}

export interface SolutionImplementationGroup {
  capabilityId: TechnologyCapabilityId;
  capabilityName: string;
  options: readonly SolutionImplementationOption[];
}

/**
 * Presentation wording where an implementation carries no mapped detail.
 *
 * Same discipline as the privacy layer: incompleteness is stated as a normal
 * commercial fact, not rendered as a broken or empty panel.
 */
export const IMPLEMENTATION_DETAIL_ON_REQUEST =
  "Implementation-specific details available on request";

/**
 * Whether a direction shows physical implementation options at all.
 *
 * Performance intelligence deliberately does not, and says so by declaring no
 * site capabilities. Nothing is installed for it: it connects transactions and
 * sales value the customer already holds, and the one boundary that matters
 * there is that PFM does not measure those. A sensor hero under it would
 * quietly contradict that.
 */
export function directionHasSiteImplementations(
  direction: SolutionDirectionDefinition,
): boolean {
  return direction.siteCapabilityIds.length > 0;
}

export function getSolutionImplementationOptions(
  directionId: SolutionDirectionId,
  audience: ConfigureAudience = "sales",
): readonly SolutionImplementationGroup[] {
  const direction = getSolutionDirection(directionId);
  if (!direction) return [];

  const presenting = audience === "presentation";
  const groups: SolutionImplementationGroup[] = [];
  const alreadyShown = new Set<TechnologyImplementationId>();

  for (const capabilityId of direction.siteCapabilityIds) {
    const capability = getTechnologyCapability(capabilityId);
    if (!capability) continue;

    // The same segment narrowing that applies to the capability's explainers
    // applies to what would be installed for it. Without this, Shopping Centre's
    // "What is needed" listed 3D LiDAR and 3D stereo-vision sensors under a
    // capability this segment does not measure that way.
    const override = getSegmentCapabilityMediaOverride(direction.segment, capabilityId);
    const permitted = getImplementationsForCapability(capabilityId).filter(
      (impl) => !override?.implementationIds || override.implementationIds.includes(impl.id),
    );

    const options: SolutionImplementationOption[] = [];
    for (const impl of permitted) {
      // An implementation family may serve several capabilities in the same
      // direction. It is one thing to install, so it is shown once, under the
      // first capability that reaches it.
      if (alreadyShown.has(impl.id)) continue;

      const profile = getImplementationRequirementProfile(impl.id);
      // A method class with no site profile and no photograph has nothing to
      // show here. It stays in "How we do this", where it belongs.
      if (!profile) continue;
      alreadyShown.add(impl.id);

      const visual = getImplementationVisual(impl.id);
      const rows = presenting
        ? profile.technicalDetail.filter((row) => row.status === "source_backed")
        : profile.technicalDetail;

      options.push({
        implementationId: impl.id,
        supplier: impl.supplier,
        product: impl.product,
        implementationRole: impl.implementationRole,
        headline: implementationPresentationNames[impl.id] ?? impl.implementationRole,
        assetPath: visual?.assetPath ?? null,
        altText: visual?.altText ?? null,
        visualShowsInfrastructureOnly: visual?.showsInfrastructureOnly ?? false,
        essentials: profile.essentials,
        technicalDetail: rows,
        detailUnavailableNote: rows.length ? null : IMPLEMENTATION_DETAIL_ON_REQUEST,
        explainerVideo: getImplementationExplainerVideo(impl.id),
      });
    }

    if (options.length) {
      groups.push({
        capabilityId: capability.id,
        capabilityName: capability.name,
        options,
      });
    }
  }

  return groups;
}

/* ==========================================================================
   PRIVACY — one entry per implementation, never merged across suppliers
   ========================================================================== */

/**
 * Presentation wording for an implementation whose privacy evidence is not yet
 * mapped to a source. Deliberately the runtime's own vocabulary rather than
 * generic compliance copy: a missing source is stated, not papered over.
 */
export const PRIVACY_DETAIL_UNMAPPED = "Privacy detail requires source validation";

/**
 * The same state, said to a prospect.
 *
 * "Requires source validation" is true and it is the right sentence for a
 * presenter: it names an internal readiness gap in the internal vocabulary. It
 * is the wrong sentence for a customer, who hears an unfinished product rather
 * than an unfinished source registry. Presentation Mode therefore says what is
 * actually true of the conversation — the detail exists, it just is not being
 * claimed here — without ever presenting evidence that has not been mapped.
 *
 * Only the wording changes. `privacyStatus`, `hasPrivacyEvidence` and the claims
 * themselves are identical in both modes, and unmapped claims stay withheld.
 */
export const PRIVACY_DETAIL_UNMAPPED_PRESENTATION =
  "Implementation-specific privacy details available on request";

export interface SolutionPrivacyEntry {
  capabilityId: TechnologyCapabilityId;
  capabilityName: string;
  /** The capability's own privacy principle. Vendor-neutral by construction. */
  privacyPrinciple: string;
  implementationId: TechnologyImplementationId;
  supplier: string | null;
  product: string | null;
  implementationRole: string;
  /** This implementation's own status. Never inherited from another. */
  privacyStatus: SourceStatus;
  /** True when this implementation carries its own privacy evidence. */
  hasPrivacyEvidence: boolean;
  /** This implementation's own claims. Never merged with another's. */
  supportedClaims: readonly string[];
  blockedClaims: readonly string[];
  sourceRefs: readonly string[];
  /** Shown in place of claims when privacy evidence is not source-mapped. */
  unmappedNote: string | null;
}

export interface SolutionPrivacyView {
  direction: SolutionDirectionDefinition;
  statement: typeof configurePrivacyStatement;
  /** One entry per implementation reachable from this direction. */
  entries: readonly SolutionPrivacyEntry[];
  /** True when at least one implementation has no mapped privacy evidence. */
  hasUnmappedPrivacyEvidence: boolean;
}

/** Privacy evidence counts as present only when the source says so. */
function hasPrivacyEvidence(status: SourceStatus): boolean {
  return status === "source_backed" || status === "partially_source_backed";
}

export function getSolutionPrivacyDetail(
  directionId: SolutionDirectionId,
  audience: ConfigureAudience = "sales",
): SolutionPrivacyView | null {
  const direction = getSolutionDirection(directionId);
  if (!direction) return null;

  // Presentation-layer wording only. The status that produced it is unchanged.
  const unmapped =
    audience === "presentation"
      ? PRIVACY_DETAIL_UNMAPPED_PRESENTATION
      : PRIVACY_DETAIL_UNMAPPED;

  const entries: SolutionPrivacyEntry[] = [];
  for (const capabilityId of direction.technologyCapabilityIds) {
    const capability = getTechnologyCapability(capabilityId);
    if (!capability) continue;
    for (const impl of getImplementationsForCapability(capabilityId)) {
      const evidencePresent = hasPrivacyEvidence(impl.privacyStatus);
      entries.push({
        capabilityId: capability.id,
        capabilityName: capability.name,
        privacyPrinciple: capability.privacyPrinciple,
        implementationId: impl.id,
        supplier: impl.supplier,
        product: impl.product,
        implementationRole: impl.implementationRole,
        privacyStatus: impl.privacyStatus,
        hasPrivacyEvidence: evidencePresent,
        // Claims are read straight off this implementation. Two implementations
        // never share an array, and no implementation borrows another's text.
        supportedClaims: evidencePresent ? impl.supportedClaims : [],
        blockedClaims: impl.unsupportedClaims,
        sourceRefs: impl.sourceRefs,
        unmappedNote: evidencePresent ? null : unmapped,
      });
    }
  }

  return {
    direction,
    statement: configurePrivacyStatement,
    entries,
    hasUnmappedPrivacyEvidence: entries.some((entry) => !entry.hasPrivacyEvidence),
  };
}

/* ==========================================================================
   SEE IT IN PRACTICE — permission-gated, never invented
   ========================================================================== */

export type ConfigureAudience = "sales" | "presentation";

export interface SolutionProofView {
  direction: SolutionDirectionDefinition;
  /** Proof approved and playable for a prospect. */
  usable: readonly ProofAssetDefinition[];
  /** Everything linked internally, including placeholders. Sales Mode only. */
  internal: readonly ProofAssetDefinition[];
  /**
   * Whether the "See it in practice" action may be offered at all.
   *
   * Presentation Mode: only when usable proof exists. A prospect is never
   * invited to click into an empty or "coming soon" state.
   * Sales Mode: always, so the presenter can see the true internal status.
   */
  actionAvailable: boolean;
  /** Quiet internal status line. Null in Presentation Mode. */
  internalStatusNote: string | null;
}

export function getSolutionProof(
  directionId: SolutionDirectionId,
  audience: ConfigureAudience,
): SolutionProofView | null {
  const direction = getSolutionDirection(directionId);
  if (!direction) return null;

  const dedupe = (assets: readonly ProofAssetDefinition[]) => [
    ...new Map(assets.map((asset) => [asset.id, asset])).values(),
  ];

  // `getPlayableProofsForScene` already requires status "available", a declared
  // format, `playable` and `externalUseApproved`. Nothing else may reach a
  // prospect, so this is the only definition of "usable" the UI is given.
  const usable = dedupe(
    direction.relatedSceneIds.flatMap((sceneId) => [
      ...getPlayableProofsForScene(direction.segment, sceneId),
    ]),
  );

  const internal = dedupe(
    direction.relatedSceneIds.flatMap((sceneId) => [
      ...getInternalProofsForScene(direction.segment, sceneId),
    ]),
  );

  const presenting = audience === "presentation";

  return {
    direction,
    usable,
    internal: presenting ? [] : internal,
    actionAvailable: presenting ? usable.length > 0 : true,
    internalStatusNote: presenting
      ? null
      : usable.length > 0
        ? null
        : "No approved external proof yet",
  };
}

/* ==========================================================================
   Validation
   ========================================================================== */

/**
 * Deterministic structural checks over the solution-direction content.
 *
 * These guard the properties that make Configure a brochure rather than a
 * catalogue, and are run from the test suite alongside the content validator.
 */
export function validateSolutionDirections(): readonly string[] {
  const errors: string[] = [];

  for (const direction of allSolutionDirections) {
    const path = `solutionDirections.${direction.id}`;

    if (!direction.technologyCapabilityIds.length) {
      errors.push(`${path}: declares no capability`);
    }
    for (const capabilityId of direction.technologyCapabilityIds) {
      if (!getTechnologyCapability(capabilityId)) {
        errors.push(`${path}: unknown capability ${capabilityId}`);
      }
    }

    for (const sceneId of direction.relatedSceneIds) {
      const scene = getSceneForSegment(direction.segment, sceneId);
      if (!scene) {
        errors.push(`${path}: unknown or cross-segment scene ${sceneId}`);
      }
    }

    // A solution direction must never be a product. The one place suppliers and
    // products are allowed is the implementation layer of the drilldown.
    const surface = `${direction.id} ${direction.title} ${direction.customerQuestion} ${direction.lead} ${direction.capabilityPhrases.join(" ")}`.toLowerCase();
    for (const impl of direction.technologyCapabilityIds.flatMap((capabilityId) =>
      getImplementationsForCapability(capabilityId),
    )) {
      for (const token of [impl.supplier, impl.product]) {
        if (!token) continue;
        const needle = token.toLowerCase();
        // Only guard distinctive brand/product tokens, not descriptive product
        // strings such as "Customer or external business systems".
        if (needle.length < 4 || needle.includes(" ")) continue;
        if (surface.includes(needle)) {
          errors.push(`${path}: customer-facing copy names a product or supplier (${token})`);
        }
      }
    }

    // A site capability must be one the direction actually declares. Otherwise
    // "what would be at the location" could answer a question the direction
    // never asked.
    for (const capabilityId of direction.siteCapabilityIds) {
      if (!direction.technologyCapabilityIds.includes(capabilityId)) {
        errors.push(`${path}: site capability ${capabilityId} is not declared by the direction`);
      }
    }

    if (direction.capabilityPhrases.length > 3) {
      errors.push(`${path}: more than three supporting phrases`);
    }
    if (!direction.boundaryNote) {
      errors.push(`${path}: has no boundary note`);
    }
    if (!direction.sourceRefs.length) {
      errors.push(`${path}: has no source reference`);
    }
  }

  const ids = allSolutionDirections.map((direction) => direction.id);
  if (new Set(ids).size !== ids.length) {
    errors.push("solutionDirections: duplicate direction id");
  }

  // A visual explanation must hang off a real capability, must name an example
  // implementation that genuinely belongs to that capability, and must point at
  // the web-compatible derivative rather than the camera master.
  const videoCapabilityIds = capabilityExplainerVideos.map((video) => video.capabilityId);
  if (new Set(videoCapabilityIds).size !== videoCapabilityIds.length) {
    errors.push("capabilityExplainerVideos: more than one video for a capability");
  }
  for (const video of capabilityExplainerVideos) {
    const path = `capabilityExplainerVideos.${video.capabilityId}`;
    if (!getTechnologyCapability(video.capabilityId)) {
      errors.push(`${path}: unknown capability`);
      continue;
    }
    if (video.exampleImplementationId) {
      const impl = getImplementation(video.exampleImplementationId);
      if (!impl) {
        errors.push(`${path}: unknown implementation ${video.exampleImplementationId}`);
      } else if (!impl.capabilityIds.includes(video.capabilityId)) {
        errors.push(
          `${path}: ${impl.id} is not an implementation of ${video.capabilityId}`,
        );
      }
    }
    // Where the capability is served by more than one measurement approach, the
    // footage has to say which one it illustrates — otherwise a LiDAR clip sits
    // under a stereo-vision explanation with nothing to tell them apart.
    if (video.approachId) {
      const approaches = getAllCapabilityExplainerVisuals(video.capabilityId);
      if (!approaches.some((visual) => visual.approachId === video.approachId)) {
        errors.push(
          `${path}: approach ${video.approachId} is not an explainer of ${video.capabilityId}`,
        );
      }
    } else if (getAllCapabilityExplainerVisuals(video.capabilityId).length > 1) {
      errors.push(
        `${path}: the capability has more than one approach, so the video must name the one it illustrates`,
      );
    }
    if (video.viewKind !== "measured_environment") {
      errors.push(`${path}: a primary video shows the measured environment`);
    }
    if (!video.src.endsWith(".mp4")) {
      errors.push(`${path}: served source must be a web-compatible .mp4`);
    }
    if (!video.actionLabel.trim()) {
      errors.push(`${path}: has no action label`);
    }
    if (!video.description.trim()) {
      errors.push(`${path}: has no accessible description`);
    }
    if (!video.sourceRefs.length) {
      errors.push(`${path}: has no source reference`);
    }

    // The nested second layer. It is a further depth layer of one explanation,
    // not a second entry in a media list, so it is validated here rather than in
    // a loop of its own — there is no collection of follow-ons to loop over.
    if (video.followOn) {
      const followPath = `${path}.followOn`;
      if (video.followOn.viewKind !== "derived_representation") {
        errors.push(`${followPath}: a follow-on shows a derived representation`);
      }
      if (video.followOn.src === video.src) {
        errors.push(`${followPath}: repeats the primary video`);
      }
      if (!video.followOn.src.endsWith(".mp4")) {
        errors.push(`${followPath}: served source must be a web-compatible .mp4`);
      }
      if (!video.followOn.actionLabel.trim()) {
        errors.push(`${followPath}: has no action label`);
      }
      if (!video.followOn.description.trim()) {
        errors.push(`${followPath}: has no accessible description`);
      }
      if (!video.followOn.distinctionNote.trim()) {
        errors.push(
          `${followPath}: has no note separating the derived view from the measurement`,
        );
      }
      if (!video.followOn.sourceRefs.length) {
        errors.push(`${followPath}: has no source reference`);
      }
    }
  }

  // A measurement-principle explainer must hang off a real capability, must not
  // depict hardware, and must not quietly become an implementation card. Where
  // it names an implementation, that implementation must genuinely belong to the
  // capability — the pointer says "this approach is theirs", so a wrong one
  // would attach a method to a product that does not use it.
  const explainerKeys = capabilityExplainerVisuals.map(
    (visual) => `${visual.capabilityId}:${visual.approachId}`,
  );
  if (new Set(explainerKeys).size !== explainerKeys.length) {
    errors.push("capabilityExplainerVisuals: duplicate capability/approach pair");
  }
  for (const visual of capabilityExplainerVisuals) {
    const path = `capabilityExplainerVisuals.${visual.capabilityId}.${visual.approachId}`;
    if (!getTechnologyCapability(visual.capabilityId)) {
      errors.push(`${path}: unknown capability`);
      continue;
    }
    if (visual.showsSensorHardware !== false) {
      errors.push(`${path}: an explainer must not depict sensor hardware`);
    }
    /* Two legal homes, and the segment-scoped one must agree with the visual's
       own segment. `/explainers/` holds artwork shared across segments;
       `/assets/technology/<segment>/` holds artwork that is only true of that
       segment. A QSR lane picture filed under another segment's folder — or
       under a segment folder that is not its own — is exactly the mismatch this
       check exists to catch. */
    const sharedHome = visual.assetPath.startsWith("/assets/technology/explainers/");
    const segmentHome = visual.assetPath.startsWith(`/assets/technology/${visual.segment}/`);
    if (!sharedHome && !segmentHome) {
      errors.push(
        `${path}: explainer assets live under /assets/technology/explainers/ or /assets/technology/${visual.segment}/`,
      );
    }
    if (!visual.altText.trim()) {
      errors.push(`${path}: has no accessible alt text`);
    }
    if (!visual.explanation.trim()) {
      errors.push(`${path}: has no plain-language explanation`);
    }
    if (visual.illustratesImplementationId) {
      const impl = getImplementation(visual.illustratesImplementationId);
      if (!impl) {
        errors.push(`${path}: unknown implementation ${visual.illustratesImplementationId}`);
      } else if (!impl.capabilityIds.includes(visual.capabilityId)) {
        errors.push(
          `${path}: ${impl.id} is not an implementation of ${visual.capabilityId}`,
        );
      }
    }
  }

  // Imagery must hang off a real implementation, and a capability context
  // visual off a real capability. An image whose subject does not exist in the
  // model is exactly how a picture starts making a claim of its own.
  for (const visual of implementationVisuals) {
    const path = `implementationVisuals.${visual.implementationId}`;
    if (!getImplementation(visual.implementationId)) {
      errors.push(`${path}: unknown implementation`);
    }
    if (!visual.assetPath.startsWith("/assets/")) {
      errors.push(`${path}: asset path must be served from /assets/`);
    }
    if (!visual.altText.trim()) {
      errors.push(`${path}: has no alt text`);
    }
  }
  const visualIds = implementationVisuals.map((visual) => visual.implementationId);
  if (new Set(visualIds).size !== visualIds.length) {
    errors.push("implementationVisuals: more than one image for an implementation");
  }

  for (const visual of capabilityContextVisuals) {
    const path = `capabilityContextVisuals.${visual.capabilityId}`;
    if (!getTechnologyCapability(visual.capabilityId)) {
      errors.push(`${path}: unknown capability`);
    }
    if (!visual.illustrative) {
      errors.push(`${path}: a capability context visual must stay illustrative`);
    }
  }

  // Three site concerns, no more. The cap is the whole point of the section:
  // it is the answer to "what would be needed", not a site survey.
  for (const profile of implementationRequirementProfiles) {
    const path = `implementationRequirementProfiles.${profile.implementationId}`;
    if (!getImplementation(profile.implementationId)) {
      errors.push(`${path}: unknown implementation`);
    }
    if (profile.essentials.length !== 3) {
      errors.push(`${path}: must declare exactly three site essentials`);
    }
    if (!profile.sourceRefs.length) {
      errors.push(`${path}: has no source reference`);
    }
  }

  return errors;
}

/** Re-exported for registry-level validation and tests; see technology-visuals.ts. */
export { getAllCapabilityExplainerVisuals };
