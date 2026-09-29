/**
 * The conversation brief: what a person takes away from the demo, by hand.
 *
 * WHAT THIS IS
 *
 * A record of a conversation, written for the person who had it. It restates
 * the questions that were opened, the context those questions depend on, and
 * whatever the presenter chose to type as a note. It is produced in the
 * browser, copied by the person, and pasted wherever they decide.
 *
 * WHAT IT IS NOT, AND MUST NEVER BECOME
 *
 * Opening a scene is not choosing a capability. Reading a question is not
 * answering it. So this file turns visited scenes into QUESTIONS and TOPICS
 * and nothing else — never `selected_capabilities`, never a recommendation,
 * never a configuration, never a quotation, never an opportunity. The export
 * says so in its own payload (`not_included`), because the next person to read
 * it will not have read this comment.
 *
 * `INTEGRATION-CONTRACTS.md` governs the shape: stable ids rather than display
 * labels, and a schema version on every contract. Both are honoured here even
 * though nothing transmits this yet — the moment something does, the payload
 * has to already be the right shape, and already be explicit about what it
 * withholds.
 *
 * NOTHING LEAVES, NOTHING IS KEPT
 *
 * No fetch, no storage, no timer. The note lives in React state for as long as
 * the tab is open and is gone when it closes. That is not a limitation to be
 * lifted later by this file: the moment a brief is transmitted, it needs a
 * consented recipient and an audit record, and those belong to a gate that has
 * not happened.
 */

import type { SceneId, SegmentDefinition } from "../../content/types.ts";
import type { Locale } from "../../i18n/locales.ts";
import type { ReviewModel } from "./review-content.ts";

/** Versioned, per `INTEGRATION-CONTRACTS.md`. */
export const BRIEF_SCHEMA_VERSION = "brief-v1";
export const BRIEF_SOURCE = "pfm-commercial-experience";

/**
 * Stated in the payload itself.
 *
 * A future consumer reads the JSON, not this repository. Listing what a brief
 * deliberately does NOT carry is the difference between a consumer treating an
 * absent field as "not collected yet" and treating it as "must not be
 * inferred" — and the second is what this is.
 */
export const BRIEF_NOT_INCLUDED = [
  "selected_capabilities",
  "selected_solution",
  "recommendation",
  "configuration",
  "quotation",
  "pricing",
  "crm_record",
  "contact_details",
] as const;

export interface BriefExportScene {
  scene_id: SceneId;
  journey_stage: string;
  /** The scene's own question, in the language the conversation happened in. */
  question: string;
}

export interface BriefExportTopic {
  topic: string;
  from_scene_ids: readonly SceneId[];
}

export interface BriefExport {
  schema_version: string;
  source: string;
  generated_at: string;
  language: Locale;
  segment_id: string;
  /** Opened scenes only, in the segment's own canonical route order. */
  opened_scene_ids: readonly SceneId[];
  opened_scenes: readonly BriefExportScene[];
  discussion_topics: readonly BriefExportTopic[];
  /** Present only when the person actually typed one. */
  note?: string;
  not_included: readonly string[];
}

/** A note counts as entered only when it has non-whitespace content. */
export function normalizeNote(note: string): string | null {
  const trimmed = note.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * The machine-readable brief.
 *
 * `generatedAt` is a parameter rather than a call to `Date.now()` so that the
 * payload is a pure function of the conversation — the same session always
 * produces the same brief, which is what makes it checkable.
 */
export function buildBriefExport({
  segment,
  model,
  locale,
  note,
  generatedAt,
}: {
  segment: SegmentDefinition;
  model: ReviewModel;
  locale: Locale;
  note: string;
  generatedAt: string;
}): BriefExport {
  const stageOf = (sceneId: SceneId) =>
    model.groups.find((group) => group.questions.some((q) => q.sceneId === sceneId))?.stage ?? "";

  const clean = normalizeNote(note);

  return {
    schema_version: BRIEF_SCHEMA_VERSION,
    source: BRIEF_SOURCE,
    generated_at: generatedAt,
    language: locale,
    segment_id: segment.id,
    opened_scene_ids: [...model.opened],
    opened_scenes: model.questions.map((item) => ({
      scene_id: item.sceneId,
      journey_stage: stageOf(item.sceneId),
      question: item.question,
    })),
    discussion_topics: model.context.map((item) => ({
      topic: item.label,
      from_scene_ids: [...item.fromSceneIds],
    })),
    /* Omitted entirely when nothing was typed. An empty string in a payload
       reads as "asked and left blank", which is a different claim. */
    ...(clean ? { note: clean } : {}),
    not_included: BRIEF_NOT_INCLUDED,
  };
}

export function briefExportJson(brief: BriefExport): string {
  return JSON.stringify(brief, null, 2);
}

/**
 * The readable brief — the one a commercial person actually pastes.
 *
 * Plain text, because it has to survive being dropped into an email, a
 * meeting note or a chat window without carrying formatting nobody asked for.
 * Every heading is supplied by the caller in the reader's language; this
 * function chooses no words of its own.
 */
export function briefSummaryText({
  segmentName,
  model,
  note,
  labels,
}: {
  segmentName: string;
  model: ReviewModel;
  note: string;
  labels: {
    title: string;
    coverage: string;
    questions: string;
    topics: string;
    note: string;
    boundary: string;
  };
}): string {
  const lines: string[] = [`${labels.title} — ${segmentName}`, "", labels.coverage, ""];

  lines.push(`${labels.questions}:`);
  model.questions.forEach((item, position) => {
    lines.push(`  ${String(position + 1).padStart(2, "0")}. ${item.name} — ${item.question}`);
  });

  if (model.context.length > 0) {
    lines.push("", `${labels.topics}:`);
    for (const item of model.context) lines.push(`  - ${item.label}`);
  }

  const clean = normalizeNote(note);
  if (clean) {
    lines.push("", `${labels.note}:`, ...clean.split("\n").map((line) => `  ${line}`));
  }

  lines.push("", labels.boundary);
  return lines.join("\n");
}
