import { accounts, discoveryQuestions, stages } from "./fixtures.ts";
import type {
  CompletionIntent,
  ExperienceAction,
  ExperienceState,
  LensId,
  QuoteBuilderPayload,
} from "./types";

/**
 * Scene-specific opening lens state.
 *
 * The global opening state below (`initialState.activeLenses`) is the default
 * for every scene in the experience and is deliberately unchanged: Mobile & geo
 * and Physical, which is what the four approved Retail scenes before
 * Conversion & sales context open with.
 *
 * One scene needs a different opening state. Conversion & sales context draws
 * the full commercial equation — passers-by × capture rate = store visits, and
 * store visits × conversion rate × average transaction value = turnover — and
 * half of that equation is connected business data. Opening it with Business
 * switched off would open the scene with three of its six readings missing.
 * Mobile & geo is switched off for the opposite reason: nothing in the equation
 * is measured by it, so leaving it on would imply it contributes to the numbers
 * on screen.
 *
 * A scene absent from this map has no scene-specific default and keeps whatever
 * lens state the presenter is already in.
 */
export const sceneLensDefaults: Readonly<Record<string, readonly LensId[]>> = {
  "retail-conversion-sales-context": ["physical", "business"],
};

/** The declared opening lens state for a scene, or null when it declares none. */
export function getSceneLensDefaults(
  sceneId: string | null,
): readonly LensId[] | null {
  if (!sceneId) return null;
  return sceneLensDefaults[sceneId] ?? null;
}

export const initialState: ExperienceState = {
  screen: "entry",
  mode: "sales",
  segmentId: "retail",
  stageIndex: 0,
  journeyEpoch: 0,
  accountId: accounts[0].id,
  prospectName: "New retail prospect",
  locationCount: accounts[0].locationCount,
  discoveryQuestionId: discoveryQuestions[0].id,
  selectedChallenges: [...discoveryQuestions[0].challengeIds],
  configuredCapabilities: ["entrance-intelligence", "capture-rate"],
  measureOverlays: [],
  activeLenses: ["mobile-geo", "physical"],
  selectedProof: ["method"],
  quoteStatus: "idle",
  completionStatus: "idle",
  quoteOpen: false,
  caseView: "question",
  measuredVisits: 681,
  presentationMode: false,
  lensRestore: null,
};

const toggleInList = <T extends string>(items: T[], item: T): T[] =>
  items.includes(item) ? items.filter((value) => value !== item) : [...items, item];

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "SET_MODE":
      return {
        ...state,
        mode: action.mode,
        accountId: action.mode === "sales" ? (state.accountId ?? accounts[0].id) : null,
      };
    case "SET_ACCOUNT": {
      const account = accounts.find((item) => item.id === action.accountId);
      return {
        ...state,
        accountId: action.accountId,
        locationCount: account?.locationCount ?? state.locationCount,
      };
    }
    case "START_PROSPECT":
      return { ...state, accountId: null };
    case "SET_PROSPECT":
      return { ...state, prospectName: action.name };
    case "SET_LOCATION_COUNT":
      return { ...state, locationCount: Math.max(1, Math.min(999, action.count)) };
    case "TOGGLE_CHALLENGE":
      return {
        ...state,
        selectedChallenges: toggleInList(state.selectedChallenges, action.challengeId),
      };
    case "SET_DISCOVERY_QUESTION": {
      const question = discoveryQuestions.find((item) => item.id === action.questionId);
      return question
        ? { ...state, discoveryQuestionId: question.id, selectedChallenges: [...question.challengeIds] }
        : state;
    }
    case "TOGGLE_CAPABILITY":
      return {
        ...state,
        configuredCapabilities: toggleInList(
          state.configuredCapabilities,
          action.capabilityId,
        ),
      };
    case "TOGGLE_MEASURE_OVERLAY":
      return {
        ...state,
        measureOverlays: toggleInList(
          state.measureOverlays,
          action.overlayId,
        ),
      };
    case "TOGGLE_LENS":
      if (
        action.lensId === "derived" &&
        (!state.activeLenses.includes("physical") ||
          !state.activeLenses.includes("business"))
      ) {
        return state;
      }
      if (
        (action.lensId === "physical" || action.lensId === "business") &&
        state.activeLenses.includes(action.lensId)
      ) {
        return {
          ...state,
          activeLenses: state.activeLenses
            .filter((lensId) => lensId !== action.lensId && lensId !== "derived"),
        };
      }
      return {
        ...state,
        activeLenses: toggleInList(state.activeLenses, action.lensId),
      };
    /**
     * Scene entry and exit, as far as the lens rail is concerned.
     *
     * Entering a scene that declares an opening lens state records the lens
     * state the presenter arrived with and applies the declared one. Entering
     * anything else — another scene, a stage with no scene component — puts the
     * recorded state back untouched. That is what keeps this scene-specific
     * default from leaking into scenes that never asked for it, without
     * changing the global opening state or any other scene's behaviour.
     *
     * Re-dispatching for the scene already in force is idempotent: the recorded
     * restore state is kept, never overwritten with the declared defaults.
     */
    case "ENTER_SCENE": {
      const defaults = getSceneLensDefaults(action.sceneId);
      if (!defaults) {
        return state.lensRestore
          ? { ...state, activeLenses: [...state.lensRestore], lensRestore: null }
          : state;
      }
      return {
        ...state,
        lensRestore: state.lensRestore ?? [...state.activeLenses],
        activeLenses: [...defaults],
      };
    }
    case "TOGGLE_PROOF":
      return {
        ...state,
        selectedProof: toggleInList(state.selectedProof, action.proofId),
      };
    case "SET_SEGMENT":
      // Switching segment restarts the journey: stage indices and scene-entry
      // lens state belong to the journey that was being walked, and carrying
      // them across would land the presenter in a stage of a route that no
      // longer exists.
      return {
        ...state,
        segmentId: action.segmentId,
        stageIndex: 0,
        // The shell's own scene indices belong to the route being left. Bumping
        // the epoch is what sends them back to the start; without it the rail
        // and the scene disagree on return.
        journeyEpoch: state.journeyEpoch + 1,
        activeLenses: [...initialState.activeLenses],
        lensRestore: null,
      };
    case "SET_STAGE":
      return {
        ...state,
        stageIndex: Math.max(0, Math.min(stages.length - 1, action.stageIndex)),
      };
    case "START":
      return { ...state, screen: "discovery", stageIndex: 0 };
    case "EXPLORE":
      return { ...state, screen: "journey", stageIndex: 0 };
    case "OPEN_QUOTE":
      return { ...state, quoteOpen: true, quoteStatus: "prepared" };
    case "CLOSE_QUOTE":
      return { ...state, quoteOpen: false };
    case "SAVE_QUOTE":
      return { ...state, quoteOpen: false, quoteStatus: "saved" };
    case "COMPLETE":
      return { ...state, completionStatus: "complete" };
    case "SHOW_CLIENT_ROOM":
      return { ...state, screen: "client-room" };
    case "SHOW_JOURNEY":
      return { ...state, screen: "journey" };
    case "SET_CASE_VIEW":
      return { ...state, caseView: action.view };
    case "SIMULATE_CROSSING":
      return { ...state, measuredVisits: state.measuredVisits + 1 };
    case "TOGGLE_PRESENTATION_MODE":
      return { ...state, presentationMode: !state.presentationMode };
    case "RESTART":
      // Restart is a journey restart too, and it can be pressed from a segment
      // whose scene indices are not at zero. The epoch keeps climbing rather
      // than returning to the initial 0, so the shell always sees a change.
      return { ...initialState, journeyEpoch: state.journeyEpoch + 1 };
    default:
      return state;
  }
}

export function createQuotePayload(state: ExperienceState): QuoteBuilderPayload {
  const accountIndex = accounts.findIndex((item) => item.id === state.accountId);
  return {
    schema_version: "demo-v1",
    company_id: state.mode === "sales" && accountIndex >= 0 ? 4200 + accountIndex : null,
    opportunity_id:
      state.mode === "sales" && accountIndex >= 0 ? 9100 + accountIndex : null,
    vertical: "retail",
    location_count: state.locationCount,
    country: "NL",
    currency: "EUR",
    selected_capabilities: [...state.configuredCapabilities],
    selected_layers: [...state.activeLenses],
    selected_challenges: [...state.selectedChallenges],
    source: "pfm-commercial-experience",
  };
}

export function createCompletionIntent(state: ExperienceState): CompletionIntent {
  return {
    company_action: "match_or_create",
    opportunity_action: "create_or_update",
    opportunity_title:
      state.mode === "sales"
        ? "Retail location intelligence exploration"
        : "Public retail location enquiry",
    source: "PFM Commercial Experience",
    next_activity: {
      type: "meeting",
      summary: "Location and data workshop",
    },
    client_room_requested: true,
  };
}
