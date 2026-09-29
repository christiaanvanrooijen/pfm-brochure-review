/**
 * Where the reader is, as data.
 *
 * WHY THIS IS NOT INSIDE THE COMPONENTS
 *
 * Navigation was the part of the demo that could only be checked by reading the
 * source and believing it. Two defects lived in exactly that blind spot: a Back
 * that left the demo altogether, and a Back that returned but silently emptied
 * the list of scenes the person had seen — so the closing summary under-reported
 * the conversation it was summarising.
 *
 * Every rule that decides an address, an opening scene or the visited list is
 * therefore a pure function here, and the tests walk real sequences through
 * them — enter, next, back, forward, restart, deep link — instead of asserting
 * that the source still contains a particular string.
 *
 * THE ONE RULE WORTH STATING IN WORDS
 *
 * `visited` is a record of what a person actually opened in this session. It
 * survives every move, including moves backwards: going back to scene two does
 * not unsee scene four. Only Restart clears it, because Restart says in the
 * reader's own words that the conversation is beginning again.
 */

import type { SceneId, SegmentId } from "../../content/types.ts";
import { defaultLocale, isLocale, type Locale } from "../../i18n/locales.ts";

/** The one picker, at one address. The demo never renders a second one. */
export const PICKER_PATH = "/";

export const DEMO_PATH = "/preview/demo";

/**
 * A journey has three kinds of place: a scene, the review that closes it, and
 * the brief a person prepares from that review.
 *
 * Each is addressable for the same reason a scene is — it is somewhere the
 * reader can be, so Back must leave it, Forward must return to it, and a link
 * to it must open it rather than the first scene.
 */
export type DemoView = "scene" | "review" | "brief";

export interface DemoPlace {
  segmentId: SegmentId | null;
  sceneId: SceneId | null;
  view: DemoView;
  locale: Locale;
}

/** Where the picker lives, in this language. */
export function pickerUrl(locale: Locale): string {
  return `${PICKER_PATH}?locale=${locale}`;
}

/**
 * The demo's address, built from what is actually on screen.
 *
 * A segment with no scene is the segment opened at its first scene: the address
 * stays short until the reader moves, so a link shared from the opening of a
 * journey reads as "this journey" rather than "this one scene of it".
 */
export function demoUrl(
  segmentId: SegmentId,
  sceneId: SceneId | null,
  locale: Locale,
): string {
  const params = new URLSearchParams();
  params.set("segment", segmentId);
  if (sceneId) params.set("scene", sceneId);
  params.set("locale", locale);
  return `${DEMO_PATH}?${params.toString()}`;
}

/**
 * Read an address back into a place.
 *
 * Anything unrecognised resolves to null rather than to a guess — a hand-typed
 * segment that does not exist must land on the picker, not on Retail pretending
 * to be what was asked for.
 */
export function parseDemoUrl(
  search: string,
  knownSegments: readonly SegmentId[],
): DemoPlace {
  const params = new URLSearchParams(search);
  const rawSegment = params.get("segment");
  const rawLocale = params.get("locale");
  return {
    segmentId: knownSegments.includes(rawSegment as SegmentId)
      ? (rawSegment as SegmentId)
      : null,
    sceneId: (params.get("scene") as SceneId | null) ?? null,
    view:
      params.get("view") === "review"
        ? "review"
        : params.get("view") === "brief"
          ? "brief"
          : "scene",
    locale: isLocale(rawLocale) ? rawLocale : defaultLocale,
  };
}

/**
 * The address of a journey's closing review.
 *
 * It names no scene, because the review is not one: it is what the scenes that
 * were opened add up to. Opened from a link rather than walked to, it therefore
 * has nothing to report — and says so, rather than listing a conversation that
 * did not happen.
 */
export function reviewUrl(segmentId: SegmentId, locale: Locale): string {
  return viewUrl(segmentId, "review", locale);
}

/**
 * The address of the brief prepared from a review.
 *
 * Like the review, it names no scene: it is what the scenes that were opened
 * add up to. A note typed into it is never in the address — a note is the
 * person's own words, and an address is copied, pasted and logged.
 */
export function briefUrl(segmentId: SegmentId, locale: Locale): string {
  return viewUrl(segmentId, "brief", locale);
}

function viewUrl(segmentId: SegmentId, view: "review" | "brief", locale: Locale): string {
  const params = new URLSearchParams();
  params.set("segment", segmentId);
  params.set("view", view);
  params.set("locale", locale);
  return `${DEMO_PATH}?${params.toString()}`;
}

/**
 * What the address must say after one move — and nothing else.
 *
 * THE DEFECT THIS REPLACES
 *
 * A flag in the component remembered that the last move had been a Back, so
 * that the address would not be rewritten for a move the browser had already
 * made. Nothing ever fired that write: a history move remounts the journey, and
 * a remount reports a visit, not a navigation. So the flag was still set when
 * the reader's NEXT genuine move arrived, and swallowed that one instead — the
 * scene advanced on screen while the address stayed a step behind, and the same
 * happened to the first language change after a Back.
 *
 * Hence the shape of this function: it takes the move that just happened and
 * nothing else. There is no state to leave set, because a decision that depends
 * on a previous move is a decision that can be wrong about the current one. A
 * move the browser made needs no entry of its own and never reaches here.
 */
export function addressAfter(
  move: "step" | "language",
  segmentId: SegmentId,
  sceneId: SceneId | null,
  locale: Locale,
  view: DemoView = "scene",
): { url: string; mode: "push" | "replace" } {
  return {
    /* A place without a scene of its own — the review, or the brief prepared
       from it. */
    url:
      view === "brief"
        ? briefUrl(segmentId, locale)
        : sceneId && view === "scene"
          ? demoUrl(segmentId, sceneId, locale)
          : reviewUrl(segmentId, locale),
    /* A step is somewhere new and belongs in history. A language is the same
       place in other words, so it rewrites the entry rather than adding one —
       otherwise Back would undo a word change instead of a move. */
    mode: move === "step" ? "push" : "replace",
  };
}

/**
 * Which scene a journey opens on.
 *
 * A scene is honoured only when it is on THIS segment's Core route. A scene id
 * belonging to another segment, or to no segment, opens the route from the
 * start — which is also what entering from the picker does, because entering a
 * segment is beginning it.
 */
export function openingScene(
  route: readonly SceneId[],
  requested: string | null | undefined,
): SceneId {
  return requested && (route as readonly string[]).includes(requested)
    ? (requested as SceneId)
    : route[0];
}

/**
 * The visited list after opening a scene.
 *
 * Append-once, in the order first seen. Returning to a scene does not move it,
 * and leaving one does not remove it: the summary reports the conversation that
 * happened, not the path that is currently on screen.
 */
export function visitedAfter(
  visited: readonly SceneId[],
  sceneId: SceneId,
): readonly SceneId[] {
  return visited.includes(sceneId) ? visited : [...visited, sceneId];
}

/**
 * Moving to another segment is a full navigation, not a state change: the
 * picker links out of this route, so the browser loads the demo afresh and the
 * visited record starts empty on its own. There is deliberately no function
 * here to "clear on segment change" — a second place that could forget would
 * be a second place that could forget wrongly.
 */

/**
 * The session after a deliberate Restart.
 *
 * EVERYTHING the conversation accumulated, reset together — the scenes opened
 * AND the note the presenter wrote. Restart says, in the reader's own words,
 * that the conversation begins again; a note surviving it would be the
 * previous customer's words sitting in the next customer's brief, which is the
 * one outcome a local-only note must never produce.
 *
 * Returned as one value for that reason. Two resets in two places is two
 * chances for one of them to be forgotten — which is exactly what happened:
 * `visited` was cleared from both Restart paths and the note from neither.
 *
 * Nothing else forgets. Back, Forward, a language change and a return to a
 * scene all leave the conversation intact, because none of them is the reader
 * saying they are starting over.
 */
export interface ConversationReset {
  visited: readonly SceneId[];
  note: string;
}

export function conversationAfterRestart(firstSceneId: SceneId): ConversationReset {
  return { visited: [firstSceneId], note: "" };
}
