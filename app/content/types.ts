export const segmentIds = [
  "retail",
  "shopping-centre",
  "retail-park",
  "outlet-centre",
  "qsr",
] as const;
export type SegmentId = (typeof segmentIds)[number];

export const canonicalJourney = [
  "context",
  "measure",
  "understand",
  "prove",
  "configure",
  "act",
] as const;
export type JourneyStage = (typeof canonicalJourney)[number];

export const storyPriorities = ["core", "optional", "advanced"] as const;
export type StoryPriority = (typeof storyPriorities)[number];

export const dataRoles = ["physical", "mobile_geo", "business", "insight"] as const;
export type DataRole = (typeof dataRoles)[number];

export const evidenceTypes = [
  "measured",
  "connected",
  "derived",
  "decision",
  "outcome",
] as const;
export type EvidenceType = (typeof evidenceTypes)[number];

export const assetStatuses = [
  "approved",
  "reference",
  "approval_required",
  "placeholder",
] as const;
export type AssetStatus = (typeof assetStatuses)[number];

export const proofStatuses = [
  "available",
  "placeholder",
  "approval_required",
  "unavailable",
] as const;
export type ProofStatus = (typeof proofStatuses)[number];

export const sourceStatuses = [
  "source_backed",
  "partially_source_backed",
  "user_approved_product_input",
  "architecture_only",
  "requires_product_validation",
  "requires_source_mapping",
] as const;
export type SourceStatus = (typeof sourceStatuses)[number];

/**
 * Commercial availability is a separate concept from source/evidence readiness
 * (`SourceStatus`). A capability may be fully source-backed and still not be
 * commercially available in a PFM market, and vice versa.
 * [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §21]
 */
export const commercialAvailabilityStatuses = [
  "available",
  "available_if_compatible",
  "optional_add_on",
  "future_ready",
  "region_limited",
  "requires_validation",
  "not_in_prospect_mode",
] as const;
export type CommercialAvailabilityStatus = (typeof commercialAvailabilityStatuses)[number];

export interface CommercialAvailability {
  status: CommercialAvailabilityStatus;
  /** Required whenever status is "region_limited"; null otherwise. */
  region: string | null;
  note: string;
  /** Date of the source research baseline, where the source states one. */
  researchBaseline?: string;
}

export type TechnologyCapabilityId =
  | "TECH-01"
  | "TECH-02"
  | "TECH-03"
  | "TECH-04"
  | "TECH-05"
  | "TECH-06"
  | "TECH-07"
  | "TECH-08"
  | "TECH-QSR-01"
  | "TECH-QSR-02"
  | "TECH-QSR-03"
  | "TECH-QSR-04"
  | "TECH-QSR-05"
  | "TECH-QSR-06"
  | "TECH-QSR-07"
  | "TECH-QSR-08"
  | "TECH-QSR-09"
  | "TECH-QSR-10";

export type TechnologyImplementationId =
  | "impl-xovis-3d-entrance"
  /**
   * The outdoor variant (PC2SE-O), a separate record because the indoor
   * sensor's source-backed specifications — indoor environment, 0–45 °C — must
   * never be read as describing a threshold exposed to the weather.
   */
  | "impl-xovis-3d-entrance-outdoor"
  | "impl-milesight-vs125p-entrance"
  /**
   * One Isarsoft implementation FAMILY, not four products.
   *
   * Isarsoft is an analytics layer configured on compatible IP-camera
   * infrastructure. Which measurement questions a given deployment answers is
   * configuration-dependent, so the family is linked to several capabilities
   * rather than duplicated into per-capability records. The id deliberately no
   * longer says "entrance": the same family may be configured for entrance
   * measurement, anonymous classification or multi-camera matching, and an id
   * that named only one of those would be a latent untruth in the model.
   */
  | "impl-isarsoft-camera-analytics"
  /**
   * IP detection sensors — an IP camera whose configured views carry detection
   * analytics. Two products rather than one family, because indoor and outdoor
   * are different housings with different specifications, and a datasheet
   * mapped later must attach to the device it actually describes.
   */
  | "impl-ip-detection-indoor"
  | "impl-ip-detection-outdoor"
  | "impl-milesight-vs361-passerby"
  | "impl-lidar-spatial"
  | "impl-xovis-3d-spatial"
  | "impl-configured-classification"
  | "impl-anonymous-visit-matching"
  | "impl-vehicle-arrival-method"
  | "impl-parking-occupancy-method"
  | "impl-lawful-anpr-lpr"
  /**
   * Vehicle / ANPR intelligence. Architecture and source mapping only: it is
   * NOT exposed in the Retail experience, because no Retail scene declares
   * TECH-06. It exists so a future Shopping Centre / Retail Park / Outlet
   * Centre Configure experience can reuse it without re-deriving the semantics.
   */
  | "impl-tattile-anpr-vehicle"
  | "impl-aggregate-geo-mobility"
  | "impl-business-data-connection"
  | "impl-hme-zoom-nitro-timer"
  | "impl-compatible-vehicle-detection"
  | "impl-hme-nexeo-core"
  | "impl-hme-nexeo"
  | "impl-hme-nexeo-pro"
  | "impl-hme-clearsoundx"
  | "impl-hme-text-and-connect"
  | "impl-compatible-pos-integration"
  | "impl-compatible-geofence-mobile-integration"
  | "impl-hme-zoom-nitro-nexeo-alerting"
  | "impl-hme-zoom-nitro-data-cloud"
  | "impl-hme-zoom-nitro-gamification"
  | "impl-hme-zoom-nitro-leaderboard"
  | "impl-compatible-voice-ai-provider"
  | "impl-hme-nitro-vision-ai";

export type SceneId =
  | "retail-street-opportunity"
  | "retail-store-visits"
  | "retail-visitor-composition"
  | "retail-visit-duration"
  | "retail-in-store-journey"
  | "retail-product-category-journey"
  | "retail-zone-engagement"
  | "retail-staff-interaction"
  | "retail-conversion-sales-context"
  | "retail-portfolio-comparison"
  | "shopping-centre-catchment-area"
  | "shopping-centre-competitive-visitation-white-spots"
  | "shopping-centre-entrances"
  | "shopping-centre-visitor-composition"
  | "shopping-centre-time-in-centre"
  | "shopping-centre-internal-circulation"
  | "shopping-centre-zone-anchor-exposure"
  | "shopping-centre-brand-counting"
  | "shopping-centre-brand-flow"
  | "shopping-centre-parking-arrival"
  | "shopping-centre-parking-occupancy"
  | "shopping-centre-vehicle-origin"
  | "retail-park-catchment-area"
  | "retail-park-competitive-visitation-white-spots"
  | "retail-park-vehicle-arrival"
  | "retail-park-parking-occupancy"
  | "retail-park-unit-visits"
  | "retail-park-visitor-composition"
  | "retail-park-cross-visitation"
  | "retail-park-time-on-site"
  | "retail-park-unit-category-exposure"
  | "retail-park-vehicle-origin"
  | "outlet-centre-destination-catchment"
  | "outlet-centre-tourism-origin-context"
  | "outlet-centre-competitive-destinations-white-spots"
  | "outlet-centre-vehicle-coach-arrival"
  | "outlet-centre-entrances"
  | "outlet-centre-visitor-composition"
  | "outlet-centre-time-in-destination"
  | "outlet-centre-circulation"
  | "outlet-centre-zone-exposure-dwell"
  | "outlet-centre-brand-counting"
  | "outlet-centre-brand-flow"
  | "outlet-centre-parking-occupancy"
  | "outlet-centre-vehicle-origin"
  | "qsr-drive-thru-context"
  | "qsr-arrival"
  | "qsr-queue"
  | "qsr-order"
  | "qsr-payment"
  | "qsr-handoff"
  | "qsr-beyond-lane"
  | "qsr-bottleneck"
  | "qsr-respond"
  | "qsr-daypart"
  | "qsr-estate"
  | "qsr-improvement-proof";

export type VisualAssetId = `VIS-${string}`;
export type ProofAssetId =
  | "CASE-RET-01"
  | "CASE-RET-02"
  | "CASE-RET-03"
  | "CASE-SC-01"
  | "CASE-SC-02"
  | "CASE-SC-03"
  | "CASE-SC-04"
  | "CASE-RP-01"
  | "CASE-RP-02"
  | "CASE-RP-03"
  | "CASE-OUT-01"
  | "CASE-OUT-02"
  | "CASE-OUT-03"
  | "proof-qsr-queue-performance"
  | "proof-qsr-communication"
  | "proof-qsr-bottleneck"
  | "proof-qsr-closed-loop-response"
  | "proof-qsr-estate-performance"
  | "proof-qsr-improvement";

export type EvidenceInputId =
  | "aligned_passer_by_audience"
  | "entrance_events"
  | "store_visits"
  | "classification_compatible_events"
  | "enabled_classification"
  | "matched_visit_events"
  | "spatial_trajectories"
  | "spatial_definitions"
  | "zone_events"
  | "zone_mapping"
  | "category_mapping"
  | "staff_events"
  | "staff_context"
  | "transactions"
  | "sales_value"
  | "comparable_metrics"
  | "portfolio_context"
  | "aggregate_mobility"
  | "asset_baseline_visits"
  | "vehicle_events"
  | "coach_events"
  | "parking_events"
  | "parking_capacity"
  | "unit_events"
  | "unit_mapping"
  | "brand_events"
  | "brand_mapping"
  | "matched_brand_events"
  | "tenant_mapping"
  | "trip_duration_events"
  | "licence_plate_events"
  | "lawful_origin_source"
  | "tourism_origin_context"
  | "operational_context"
  // QSR / Drive-Thru evidence inputs
  // [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §16, §24]
  | "vehicle_detection"
  | "lane_entry_timestamp"
  | "order_point_timestamp"
  | "payment_timestamp"
  | "pickup_timestamp"
  | "pull_forward_timestamp"
  | "mobile_pickup_timestamp"
  | "vehicle_count"
  | "measurement_period"
  | "configured_service_goal"
  | "restaurant_id"
  | "restaurant_hierarchy"
  | "daypart"
  | "communication_event"
  | "timer_alert_event"
  | "drive_off_capable_detection"
  | "pos_transaction_reference"
  | "pos_order_value"
  | "pos_order_state"
  | "operational_change_marker";

export interface EvidenceInputDefinition {
  id: EvidenceInputId;
  label: string;
  dataRole: DataRole;
  evidenceType: "measured" | "connected";
  sourceRefs: readonly string[];
}

export interface DerivedDependencyDefinition {
  id: string;
  output: string;
  requiredInputIds: readonly EvidenceInputId[];
  alternativeInputGroups?: readonly (readonly EvidenceInputId[])[];
}

export interface SceneEvidenceDefinition {
  type: Exclude<EvidenceType, "outcome">;
  inputIds?: readonly EvidenceInputId[];
  description: string;
}

export interface SceneDefinition {
  id: SceneId;
  segment: SegmentId;
  title: string;
  journeyStage: Exclude<JourneyStage, "configure" | "act">;
  priority: StoryPriority;
  corePathOrder: number | null;
  commercialQuestion: string;
  supportingLine: string;
  /** Optional small presenter eyebrow, e.g. "Measure · Queue". */
  eyebrow?: string;
  visualAssetId: VisualAssetId;
  dataRequirements: {
    required: readonly DataRole[];
    optional: readonly DataRole[];
  };
  derivedDependencies: readonly DerivedDependencyDefinition[];
  evidence: readonly SceneEvidenceDefinition[];
  technologyCapabilityIds: readonly TechnologyCapabilityId[];
  proofAssetIds: readonly ProofAssetId[];
  nextCta: string;
  nextSceneId?: SceneId;
  branchFromSceneIds?: readonly SceneId[];
  presenterNotes?: readonly string[];
  sourceRefs: readonly string[];
}

export interface ConfigureSynthesisDefinition {
  journeyStage: "configure";
  governingQuestion: string;
  captures: readonly (
    | "selected_question"
    | "required_capabilities"
    | "required_context"
    | "selected_insight_depth"
    | "possible_implementation_choices"
  )[];
  recommendationMode: "none";
  sourceRefs: readonly string[];
}

export interface ActSynthesisDefinition {
  journeyStage: "act";
  governingQuestion: string;
  captures: readonly (
    | "observed_evidence"
    | "interpretation"
    | "investigation_or_test"
    | "next_step"
    | "human_owned_decision"
  )[];
  decisionOwner: "human";
  sourceRefs: readonly string[];
}

/**
 * Segment-specific presenter/experience lens metadata.
 *
 * These are presentation groupings only. They do NOT replace or rename the
 * global evidence roles (`DataRole`) or the evidence-source semantics; every
 * experience lens maps onto one or more existing global data roles.
 * [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §12]
 */
export interface ExperienceLensDefinition {
  id: string;
  label: string;
  purpose: string;
  /** Global evidence roles this presentation lens draws from. */
  dataRoles: readonly DataRole[];
  defaultState: "active" | "inactive" | "disabled" | "hidden";
  advanced: boolean;
  sourceRefs: readonly string[];
}

export interface SegmentDefinition {
  id: SegmentId;
  name: string;
  /** Optional commercial experience name, e.g. "Drive-Thru Performance". */
  experienceName?: string;
  implementationStatus: "implementation_ready" | "architecture_only";
  commercialNarrative: string;
  scenes: readonly SceneDefinition[];
  coreRoute: readonly SceneId[];
  optionalBranches: readonly SceneId[];
  advancedBranches: readonly SceneId[];
  stageMapping: Readonly<Record<JourneyStage, readonly SceneId[]>>;
  synthesis: {
    configure: ConfigureSynthesisDefinition;
    act: ActSynthesisDefinition;
  };
  /** Optional segment-specific presenter lenses; never replaces global DataRole semantics. */
  experienceLenses?: readonly ExperienceLensDefinition[];
  sourceRefs: readonly string[];
}

export interface TechnologyCapabilityDefinition {
  id: TechnologyCapabilityId;
  name: string;
  purpose: string;
  supportedSceneIds: readonly SceneId[];
  evidenceTypes: readonly EvidenceType[];
  privacyPrinciple: string;
  implementationIds: readonly TechnologyImplementationId[];
  /**
   * Commercial availability of the capability through PFM. Separate from
   * source/evidence readiness. Optional so existing capabilities are unchanged.
   */
  commercialAvailability?: CommercialAvailability;
  sourceRefs: readonly string[];
}

export interface TechnologyImplementationDefinition {
  id: TechnologyImplementationId;
  capabilityIds: readonly TechnologyCapabilityId[];
  supplier: string | null;
  product: string | null;
  implementationRole: string;
  measurementMethod?: string;
  sourceStatus: SourceStatus;
  sourceRefs: readonly string[];
  supportedClaims: readonly string[];
  unsupportedClaims: readonly string[];
  privacyStatus: SourceStatus;
  technicalDetailStatus: SourceStatus;
  /**
   * Commercial availability of this implementation through PFM. Separate from
   * `sourceStatus` (evidence readiness). Optional so existing implementations
   * are unchanged.
   */
  commercialAvailability?: CommercialAvailability;
}

export interface VisualAssetDefinition {
  id: VisualAssetId;
  segment: SegmentId;
  sceneIds: readonly SceneId[];
  capabilityIds: readonly TechnologyCapabilityId[];
  status: AssetStatus;
  assetPath: string | null;
  altText: string | null;
  illustrative: boolean;
  /** Optional direction notes for a planned asset. Never a composition spec. */
  visualDirectionNotes?: readonly string[];
  sourceRef: string;
}

export type ProofFormat = "video" | "case_summary" | "image" | "document";

/**
 * Where a proof's media lives. Only a published video is modelled: the
 * brochure never hosts a customer's footage itself, it points at the copy the
 * publisher (PFM) already made public, and loads it only on request.
 */
export interface ProofMedia {
  kind: "youtube";
  videoId: string;
  /** The title the publisher gave the video, for the accessible name. */
  publishedTitle: string;
}

export interface ProofAssetDefinition {
  id: ProofAssetId;
  title: string;
  /**
   * The customer the proof is about, or null for a placeholder. A real name is
   * set only with documented approval (AGENTS.md truth rules); the approval is
   * recorded in `sourceRef` and in the decision log.
   */
  customerName: string | null;
  media: ProofMedia | null;
  /** Public pages the proof is published on. Empty for a placeholder. */
  publishedSourceUrls: readonly string[];
  /**
   * What the proof does NOT show, stated beside it — e.g. that conversion is
   * derived with the retailer's own sales data, not measured by a sensor.
   */
  truthBoundary: string | null;
  segment: SegmentId;
  relatedSceneIds: readonly SceneId[];
  relatedCapabilityIds: readonly TechnologyCapabilityId[];
  format: ProofFormat | null;
  status: ProofStatus;
  playable: boolean;
  videoDuration: number | null;
  thumbnailAssetId: VisualAssetId | null;
  challenge: string | null;
  measurementApproach: string | null;
  customerLearning: string | null;
  externalUseApproved: boolean;
  sourceRef: string;
}


export type EvidenceId = string;

export interface EvidenceDefinition {
  id: EvidenceId;
  label: string;
  value: number | string;
  displayValue: string;
  unit: string;
  evidenceType: EvidenceType;
  dataRole: DataRole;
  sourceLayer: "mobile_geo" | "physical" | "business" | "insight";
  segment: SegmentId;
  relatedSceneIds: readonly SceneId[];
  period: string;
  areaDefinition: string;
  illustrative: boolean;
  dependencyIds: readonly EvidenceInputId[];
  available: boolean;
  displayEligible: boolean;
  sourceRefs: readonly string[];
}

export interface EvidenceAvailability {
  available: boolean;
  reason?: "missing_dependency" | "lens_disabled" | "no_demo_values" | "segment_mismatch";
  missingDependencies?: readonly EvidenceInputId[];
}

export interface EvidenceMetadata {
  period: string;
  areaDefinition: string;
  denominatorDefinition?: string;
  numeratorDefinition?: string;
  compatibleSourceRequired?: boolean;
}

export interface LensAwareEvidenceQuery {
  activeLenses: readonly DataRole[];
  segmentId: SegmentId;
  sceneId: SceneId;
}

export interface SceneEvidenceRuntime {
  scene: {
    id: SceneId;
    segment: SegmentId;
    title: string;
  };
  evidence: readonly EvidenceDefinition[];
  availableEvidence: readonly EvidenceDefinition[];
  measuredEvidence: readonly EvidenceDefinition[];
  connectedEvidence: readonly EvidenceDefinition[];
  derivedEvidence: readonly EvidenceDefinition[];
  illustrativeFlag: boolean;
  periodMetadata: {
    period: string;
    areaDefinition: string;
  } | null;
  unavailableEvidence: Array<{
    id: EvidenceId;
    reason: "missing_dependency" | "lens_disabled" | "no_demo_values" | "segment_mismatch";
    missingDependencies?: readonly EvidenceInputId[];
  }>;
}

export interface ContentBundle {
  segments: readonly SegmentDefinition[];
  evidenceInputs: readonly EvidenceInputDefinition[];
  technologyCapabilities: readonly TechnologyCapabilityDefinition[];
  technologyImplementations: readonly TechnologyImplementationDefinition[];
  visualAssets: readonly VisualAssetDefinition[];
  proofAssets: readonly ProofAssetDefinition[];
}
