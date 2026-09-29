import type { SegmentId } from "../content/types";
export type ExperienceMode = "sales" | "public";

export type StageId =
  | "context"
  | "measure"
  | "understand"
  | "prove"
  | "configure"
  | "act";

export type LensId = "mobile-geo" | "physical" | "business" | "derived";

export type MeasureOverlayId =
  | "visitor-classification"
  | "anonymous-journey-continuity";

export type ExperienceScreen = "entry" | "discovery" | "journey" | "client-room";

export interface SourceReference {
  sourceId: string;
  locator: string;
  evidence: "direct" | "inference";
}

export interface StageFixture {
  id: StageId;
  label: string;
  kicker: string;
  title: string;
  description: string;
  nextLabel: string;
  source: SourceReference;
}

export interface LensFixture {
  id: LensId;
  shortLabel: string;
  label: string;
  role: string;
  truthLabel: "Contextual" | "Measured" | "Connected" | "Derived";
  source: SourceReference;
}

export interface AccountFixture {
  id: string;
  name: string;
  detail: string;
  opportunity: string;
  locationCount: number;
  fictional: true;
  source: SourceReference;
}

export interface ChallengeFixture {
  id: string;
  label: string;
  description: string;
  capabilityIds: string[];
  source: SourceReference;
}

export interface CapabilityFixture {
  id: string;
  label: string;
  description: string;
  group?: "core" | "classification" | "continuity";
  source: SourceReference;
}

export interface ProofFixture {
  id: string;
  label: string;
  detail: string;
  source: SourceReference;
}

export type RetailMetricRole = "contextual" | "measured" | "connected" | "derived";

export interface RetailMetricFixture {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  unit: string;
  role: RetailMetricRole;
  definition: string;
  scope: string;
  source: SourceReference;
}

export interface RetailPeriodFixture {
  id: string;
  label: string;
  passingAudience: RetailMetricFixture;
  visits: RetailMetricFixture;
  transactions: RetailMetricFixture;
  transactionValue: RetailMetricFixture;
  conversionDisplay: string;
  source: SourceReference;
}

export interface RetailStoryFixture {
  locationLabel: string;
  areaDefinition: string;
  audienceDefinition: string;
  periodDefinition: string;
  context: RetailMetricFixture;
  periods: RetailPeriodFixture[];
  source: SourceReference;
}

/**
 * QSR / Drive-Thru illustrative fixture types.
 *
 * Every value carried by these types is a fictional interface example.
 * They are NOT HME benchmarks, NOT QSR industry benchmarks, NOT customer
 * results and NOT PFM performance claims.
 * [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §17]
 */
export type QsrMetricRole = "measured" | "connected" | "derived";

export interface QsrMetricFixture {
  id: string;
  label: string;
  /** Durations are stored in whole seconds; counts and percentages as numbers. */
  value: number;
  displayValue: string;
  unit: string;
  role: QsrMetricRole;
  definition: string;
  scope: string;
  illustrative: true;
  source: SourceReference;
}

export interface QsrVehicleJourneyFixture {
  id: string;
  label: string;
  stages: QsrMetricFixture[];
  total: QsrMetricFixture;
  illustrative: true;
  source: SourceReference;
}

export interface QsrDaypartFixture {
  id: string;
  label: string;
  vehicles: QsrMetricFixture;
  averageLaneTotal: QsrMetricFixture;
  serviceGoal: QsrMetricFixture;
  withinGoal: QsrMetricFixture;
  peakQueue: QsrMetricFixture;
  bottleneckStage: string;
  illustrative: true;
  source: SourceReference;
}

export interface QsrRestaurantFixture {
  id: string;
  label: string;
  averageLaneTotalSeconds: number;
  averageLaneTotalDisplay: string;
  vehicles: number;
  withinGoalPercent: number;
  illustrative: true;
}

export interface QsrStoryFixture {
  brandLabel: string;
  fictional: true;
  illustrative: true;
  locationLabel: string;
  areaDefinition: string;
  periodDefinition: string;
  measurementDefinition: string;
  daypart: QsrDaypartFixture;
  vehicleJourney: QsrVehicleJourneyFixture;
  estate: QsrRestaurantFixture[];
  estateDefinition: string;
  disclaimer: string;
  source: SourceReference;
}

export interface QuoteBuilderPayload {
  schema_version: "demo-v1";
  company_id: number | null;
  opportunity_id: number | null;
  vertical: "retail";
  location_count: number;
  country: "NL";
  currency: "EUR";
  selected_capabilities: string[];
  selected_layers: LensId[];
  selected_challenges: string[];
  source: "pfm-commercial-experience";
}

export interface QuoteBuilderResult {
  schema_version: "demo-v1";
  configuration_id: string;
  quotation_draft_id: null;
  status: "saved";
  review_required: true;
}

export interface CompletionIntent {
  company_action: "match_or_create";
  opportunity_action: "create_or_update";
  opportunity_title: string;
  source: "PFM Commercial Experience";
  next_activity: {
    type: "meeting";
    summary: "Location and data workshop";
  };
  client_room_requested: boolean;
}

export interface ExperienceState {
  screen: ExperienceScreen;
  /**
   * Which segment's journey the shell is running.
   *
   * The shell had no segment state at all: it read Retail's scenes by name. This
   * is the single source of truth for the active journey, so nothing downstream
   * needs to test an id twice.
   */
  segmentId: SegmentId;
  mode: ExperienceMode;
  stageIndex: number;
  /**
   * Bumped every time the journey RESTARTS — a different segment, or Restart.
   *
   * It exists because navigation state is split: the reducer owns `stageIndex`,
   * while the shell owns the per-route scene indices (Retail's Measure and
   * Understand positions, and Shopping Centre's `coreRoute` position). Resetting
   * only the reducer left those behind, so returning to Shopping Centre showed
   * Internal circulation under a rail that said Context. The shell resets them
   * on a change of this value, so one number governs the invariant instead of
   * every call site remembering to.
   */
  journeyEpoch: number;
  accountId: string | null;
  prospectName: string;
  locationCount: number;
  discoveryQuestionId: string;
  selectedChallenges: string[];
  configuredCapabilities: string[];
  measureOverlays: MeasureOverlayId[];
  activeLenses: LensId[];
  selectedProof: string[];
  quoteStatus: "idle" | "prepared" | "saved";
  completionStatus: "idle" | "complete";
  quoteOpen: boolean;
  caseView: "question" | "context";
  measuredVisits: number;
  presentationMode: boolean;
  /**
   * The lens state to put back when leaving a scene that declares its own
   * opening lens state (see `sceneLensDefaults` in `app/lib/session.ts`).
   *
   * `null` whenever no scene-specific default is in force, which is every
   * scene except the one that declares one. This exists so a scene-specific
   * default cannot leak: the scenes before and after it are handed back
   * exactly the lens state they had, and the global `initialState.activeLenses`
   * is never changed.
   */
  lensRestore: LensId[] | null;
}

export type ExperienceAction =
  | { type: "SET_MODE"; mode: ExperienceMode }
  | { type: "SET_SEGMENT"; segmentId: SegmentId }
  | { type: "SET_ACCOUNT"; accountId: string }
  | { type: "START_PROSPECT" }
  | { type: "SET_PROSPECT"; name: string }
  | { type: "SET_LOCATION_COUNT"; count: number }
  | { type: "TOGGLE_CHALLENGE"; challengeId: string }
  | { type: "SET_DISCOVERY_QUESTION"; questionId: string }
  | { type: "TOGGLE_CAPABILITY"; capabilityId: string }
  | { type: "TOGGLE_MEASURE_OVERLAY"; overlayId: MeasureOverlayId }
  | { type: "TOGGLE_LENS"; lensId: LensId }
  /**
   * Dispatched when the presenter arrives at a scene (or at a stage with no
   * scene component). Applies that scene's declared opening lens state if it
   * declares one, and restores the previous lens state on the way out.
   */
  | { type: "ENTER_SCENE"; sceneId: string | null }
  | { type: "SET_STAGE"; stageIndex: number }
  | { type: "START" }
  | { type: "EXPLORE" }
  | { type: "RESTART" }
  | { type: "TOGGLE_PROOF"; proofId: string }
  | { type: "OPEN_QUOTE" }
  | { type: "CLOSE_QUOTE" }
  | { type: "SAVE_QUOTE" }
  | { type: "COMPLETE" }
  | { type: "SHOW_CLIENT_ROOM" }
  | { type: "SHOW_JOURNEY" }
  | { type: "SET_CASE_VIEW"; view: "question" | "context" }
  | { type: "SIMULATE_CROSSING" }
  | { type: "TOGGLE_PRESENTATION_MODE" };
