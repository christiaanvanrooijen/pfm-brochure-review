/**
 * What the closing review is allowed to say, assembled from what exists.
 *
 * Kept out of the component for the same reason the addresses are: this is the
 * part that can be wrong in a way nobody sees. A review that quietly drops a
 * scene, lists one twice, attributes one scene's context to another, or reports
 * a conversation that did not happen all render perfectly well. So the
 * assembly is data-in, data-out, and the tests walk real sessions through it.
 *
 * THE TWO THINGS IT MAY REPORT
 *
 *   questions   Each opened scene's own commercial question, in the reader's
 *               language, taken from the same resolver the scene itself used.
 *               Listed because the scene was OPENED. Never because it was
 *               answered — nothing here is an answer.
 *
 *   context     The CONNECTED link of that scene's evidence chain: what the
 *               question depends on a location supplying. That is the honest
 *               answer to "what should I examine", because it is the part of
 *               the chain the customer owns rather than the part a sensor
 *               measures or the part that is interpreted afterwards.
 *
 * And nothing else. No score, no completeness rating, no recommendation, no
 * selected solution, no proof, and no statement about what any particular
 * location has.
 */

import { allScenes } from "../../content/segments/index.ts";
import type { SceneId, SegmentDefinition } from "../../content/types.ts";
import type { Locale } from "../../i18n/locales.ts";
import type { SceneCopy } from "../../i18n/messages.ts";

/** Canonical order of the evidence chain, which the scene rail also follows. */
const EVIDENCE_ORDER = ["measured", "connected", "derived"] as const;

/**
 * The localized label for one scene's CONNECTED evidence.
 *
 * The typed model holds the evidence kinds; `copy.sequence` holds the same
 * chain in the reader's language, in the same canonical order. Position is
 * therefore the join between them — and a join must not be assumed silently,
 * so a scene whose two lists disagree contributes nothing rather than
 * contributing the wrong line. A test pins the alignment for every Core scene
 * in all three languages, so this is a guard against future drift.
 */
export function connectedContextOf(
  sceneId: SceneId,
  copy: SceneCopy,
): string | null {
  const scene = allScenes.find((s) => s.id === sceneId);
  if (!scene) return null;
  const kinds = EVIDENCE_ORDER.filter((kind) =>
    scene.evidence.some((item) => item.type === kind),
  );
  if (kinds.length !== copy.sequence.length) return null;
  const at = kinds.indexOf("connected");
  return at === -1 ? null : copy.sequence[at]?.label ?? null;
}

export interface ReviewQuestion {
  sceneId: SceneId;
  /** The scene's short subject name, in the reader's language. */
  name: string;
  question: string;
}

export interface ReviewContext {
  label: string;
  /** The scenes that rest on this context, named as the reader saw them. */
  from: readonly string[];
  /**
   * The same scenes as stable model ids.
   *
   * The page shows names because a reader reads names; anything leaving the
   * page carries ids, because a display label is not a thing another system
   * can resolve. `INTEGRATION-CONTRACTS.md` states the rule.
   */
  fromSceneIds: readonly SceneId[];
}

/**
 * Opened questions, gathered under the stage they belong to.
 *
 * Grouping, not ranking. The canonical journey is the same six stages for
 * every segment, so a stage is a place in the story rather than a judgement
 * about a question — and a ten-scene review read as one unbroken list of ten
 * near-identical rows, which is how a reader stops reading. Route order is
 * preserved inside each group, and no group is ever reordered or promoted.
 */
export interface ReviewGroup {
  stage: string;
  questions: readonly ReviewQuestion[];
}

export interface ReviewModel {
  /** Opened scenes, in the order the route tells them. */
  opened: readonly SceneId[];
  total: number;
  questions: readonly ReviewQuestion[];
  groups: readonly ReviewGroup[];
  context: readonly ReviewContext[];
}

/** The canonical journey. Core scenes only ever sit in the first four. */
const STAGE_ORDER = ["context", "measure", "understand", "prove", "configure", "act"] as const;

/**
 * Whether this review may offer the separate Configure preview, and where to.
 *
 * Two conditions, both required. A segment must HAVE an implemented Configure
 * preview — Outlet Centre and QSR do not — and the reader must have opened at
 * least one Core scene. A review of nothing that nonetheless offers a route
 * onward is an invitation dressed as a conclusion: there is no conversation
 * behind it to continue from.
 */
export function configureOffer(
  configureHref: string | null,
  model: ReviewModel,
): string | null {
  if (!configureHref) return null;
  return model.opened.length > 0 ? configureHref : null;
}

/**
 * Build the review for one session.
 *
 * `visited` is the record of what was opened, in the order it was opened. The
 * review re-orders it to the route's own order, because a conversation about a
 * location reads more clearly as the story runs than as the presenter happened
 * to jump around it — but it adds nothing to the record and removes nothing
 * from it.
 */
export function buildReview(
  segment: SegmentDefinition,
  visited: readonly SceneId[],
  copyFor: (sceneId: SceneId, locale: Locale) => SceneCopy,
  locale: Locale,
): ReviewModel {
  const opened = segment.coreRoute.filter((id) => visited.includes(id));

  const questions = opened.map((sceneId) => {
    const copy = copyFor(sceneId, locale);
    return { sceneId, name: copy.eyebrow, question: copy.question };
  });

  /* One line per distinct dependency. Two scenes resting on the same context
     say so once: repeating it would read as two separate things to examine. */
  const grouped = new Map<string, { from: string[]; fromSceneIds: SceneId[] }>();
  for (const sceneId of opened) {
    const copy = copyFor(sceneId, locale);
    const label = connectedContextOf(sceneId, copy);
    if (!label) continue;
    const entry = grouped.get(label) ?? { from: [], fromSceneIds: [] };
    entry.from.push(copy.eyebrow);
    entry.fromSceneIds.push(sceneId);
    grouped.set(label, entry);
  }

  const groups = STAGE_ORDER.map((stage) => ({
    stage,
    questions: questions.filter(
      (item) => allScenes.find((s) => s.id === item.sceneId)?.journeyStage === stage,
    ),
  })).filter((group) => group.questions.length > 0);

  return {
    opened,
    total: segment.coreRoute.length,
    questions,
    groups,
    context: [...grouped.entries()].map(([label, entry]) => ({
      label,
      from: entry.from,
      fromSceneIds: entry.fromSceneIds,
    })),
  };
}
