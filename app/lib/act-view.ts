/**
 * Act view state — which next-conversation direction is expanded, and whether
 * the closing conversational state is showing.
 *
 * A pure reducer for the same reason `configure-view.ts` is one: the return
 * discipline the approved scenes follow (open something, close it, land back
 * exactly where you were) is a behaviour, and a behaviour that matters should be
 * testable without a DOM.
 *
 * Three rules define the whole thing:
 *
 * 1. At most one direction is expanded at a time. Act is a closing gesture, not
 *    an accordion wall.
 * 2. The closing state is reachable and REVERSIBLE. `BACK_TO_DIRECTIONS` always
 *    returns to the directions, so the final screen of the brochure is never a
 *    dead end.
 * 3. NOTHING IS SELECTED. There is no "chosen" direction, no submission, no
 *    saved configuration and no external handoff. `openDirectionId` means "this
 *    is the paragraph currently being read", nothing more — and entering the
 *    closing state deliberately clears it rather than carrying it forward,
 *    because carrying it forward would make it look like a choice.
 */

import type { ActDirectionId } from "../content/act-directions";

export interface ActViewState {
  /** The direction whose detail is currently expanded. */
  openDirectionId: ActDirectionId | null;
  /** Whether the final conversational state is showing. */
  closing: boolean;
}

export type ActViewAction =
  | { type: "TOGGLE_DIRECTION"; directionId: ActDirectionId }
  | { type: "CLOSE_DIRECTION" }
  /** The primary call to action. Sends nothing; shows the closing state. */
  | { type: "CONTINUE_CONVERSATION" }
  | { type: "BACK_TO_DIRECTIONS" }
  /** Escape: peel one layer only. */
  | { type: "DISMISS" };

export const initialActViewState: ActViewState = {
  openDirectionId: null,
  closing: false,
};

export function actViewReducer(
  state: ActViewState,
  action: ActViewAction,
): ActViewState {
  switch (action.type) {
    case "TOGGLE_DIRECTION":
      return {
        ...state,
        openDirectionId:
          state.openDirectionId === action.directionId ? null : action.directionId,
      };

    case "CLOSE_DIRECTION":
      return { ...state, openDirectionId: null };

    case "CONTINUE_CONVERSATION":
      // The expanded paragraph is dropped rather than carried into the closing
      // state: nothing was chosen, and the closing state must not imply that
      // whatever happened to be open is now a selection.
      return { openDirectionId: null, closing: true };

    case "BACK_TO_DIRECTIONS":
      return { ...state, closing: false };

    case "DISMISS":
      if (state.closing) return { ...state, closing: false };
      if (state.openDirectionId) return { ...state, openDirectionId: null };
      return state;

    default:
      return state;
  }
}

/**
 * The direction that may actually be rendered as expanded right now.
 *
 * A direction can stop being offerable while its detail is open. The case that
 * matters is identical to Configure's: a presenter expands the proof-gated "See
 * it in practice" in Sales Mode, reads the quiet internal status, and then
 * switches to Presentation Mode. The direction itself is correctly gone from
 * the row — and without this, the paragraph it opened would still be on screen.
 *
 * Availability is therefore resolved at render time rather than trusted from
 * when the direction was expanded. The view state is deliberately left alone,
 * so exiting Presentation Mode puts the presenter back exactly where they were.
 */
export function resolveVisibleActDirection(
  state: ActViewState,
  isOfferable: (directionId: ActDirectionId) => boolean,
): ActDirectionId | null {
  if (state.closing || !state.openDirectionId) return null;
  return isOfferable(state.openDirectionId) ? state.openDirectionId : null;
}
