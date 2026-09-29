/**
 * Configure view state — which solution direction is open, and which optional
 * depth layer is open inside it.
 *
 * This is a pure reducer for one reason: the branch-return discipline the
 * approved Retail scenes already follow (open a branch, close it, land back
 * exactly where you were) is a behaviour, and a behaviour that matters should be
 * testable without a DOM. The Configure component holds no other navigation
 * state.
 *
 * Two rules define the whole thing:
 *
 * 1. Closing a depth layer NEVER closes the direction. "How we do this" always
 *    closes back to the solution direction it was opened from, with that
 *    direction still open. This is not a wizard; nothing is lost by looking.
 * 2. Opening a different direction clears the depth layer, because a depth layer
 *    only ever means something in the context of one direction.
 *
 * Nothing here selects, saves, scores or carries a configuration forward. There
 * is no "chosen" direction — only an opened one.
 */

import type {
  ConfigureDepthId,
  SolutionDirectionId,
} from "../content/solution-directions";

export interface ConfigureViewState {
  /** The solution direction the prospect is currently reading. */
  openDirectionId: SolutionDirectionId | null;
  /** The optional depth layer open inside that direction. */
  openDepthId: ConfigureDepthId | null;
}

export type ConfigureViewAction =
  | { type: "OPEN_DIRECTION"; directionId: SolutionDirectionId }
  | { type: "CLOSE_DIRECTION" }
  | { type: "OPEN_DEPTH"; depthId: ConfigureDepthId }
  | { type: "TOGGLE_DEPTH"; depthId: ConfigureDepthId }
  | { type: "CLOSE_DEPTH" }
  /** Escape: peel one layer only. */
  | { type: "DISMISS" };

export const initialConfigureViewState: ConfigureViewState = {
  openDirectionId: null,
  openDepthId: null,
};

export function configureViewReducer(
  state: ConfigureViewState,
  action: ConfigureViewAction,
): ConfigureViewState {
  switch (action.type) {
    case "OPEN_DIRECTION":
      // Re-opening the direction already open is a no-op, so a stray click
      // cannot silently discard the depth layer being read.
      if (state.openDirectionId === action.directionId) return state;
      return { openDirectionId: action.directionId, openDepthId: null };

    case "CLOSE_DIRECTION":
      return initialConfigureViewState;

    case "OPEN_DEPTH":
      // A depth layer only exists inside a direction.
      if (!state.openDirectionId) return state;
      return { ...state, openDepthId: action.depthId };

    case "TOGGLE_DEPTH":
      if (!state.openDirectionId) return state;
      return {
        ...state,
        openDepthId: state.openDepthId === action.depthId ? null : action.depthId,
      };

    case "CLOSE_DEPTH":
      // The direction stays open. This is the round trip.
      return { ...state, openDepthId: null };

    case "DISMISS":
      if (state.openDepthId) return { ...state, openDepthId: null };
      if (state.openDirectionId) return initialConfigureViewState;
      return state;

    default:
      return state;
  }
}

/**
 * The depth layer that may actually be rendered right now.
 *
 * A depth layer can stop being offerable while it is open. The case that
 * matters: a presenter opens "See it in practice" in Sales Mode, sees the quiet
 * internal status, and then switches to Presentation Mode. The action itself is
 * correctly gone from the row — but without this, the panel it opened would
 * still be on screen, which is precisely the "coming soon" state a prospect must
 * never be shown.
 *
 * Availability is therefore resolved at render time rather than trusted from
 * when the layer was opened. The view state is deliberately left alone: exiting
 * Presentation Mode puts the presenter back exactly where they were.
 */
export function resolveVisibleDepth(
  state: ConfigureViewState,
  isAvailable: (depthId: ConfigureDepthId) => boolean,
): ConfigureDepthId | null {
  if (!state.openDirectionId || !state.openDepthId) return null;
  return isAvailable(state.openDepthId) ? state.openDepthId : null;
}
