"use client";

/**
 * The conversation brief — the one thing a person carries out of the demo.
 *
 * WHAT IT IS FOR
 *
 * A presenter finishes a conversation and wants a record of it. Until now the
 * only way to keep one was to retype the questions from the screen. This
 * writes them out, lets the person add their own note, and hands the text to
 * their clipboard. They decide where it goes.
 *
 * WHY THERE IS NO FORM
 *
 * Because there is nothing to submit. A field asking for a name, an email or a
 * company would look exactly like the start of a CRM record, and would be one
 * — the moment a brief is transmitted it needs a consented recipient and an
 * audit record, and those belong to a gate that has not happened. So the only
 * input on this page is the person's own note to themselves, labelled as such,
 * and the only actions copy text to the clipboard.
 *
 * WHAT IT REFUSES TO INFER
 *
 * Opening a scene is not selecting a capability, and reading a question is not
 * answering it. Questions stay questions and context stays "topics to
 * discuss". Nothing on this page, and nothing in the export, becomes a
 * selection, a recommendation, a configuration or a quotation — and the
 * export says so in its own payload rather than leaving it to be assumed.
 *
 * THE JSON IS SECONDARY, AND LOOKS IT
 *
 * A commercial user needs the readable brief; the export exists for a handoff
 * that does not exist yet. So the readable copy is the one filled button and
 * the JSON sits below it, folded away, described in plain words.
 */

import { useEffect, useRef, useState } from "react";
import { segmentDefinitions } from "../../content/segments";
import type { SceneId, SegmentId } from "../../content/types";
import { localeLabels, locales, type Locale } from "../../i18n/locales";
import { getMessages, type SceneCopy } from "../../i18n/messages";
import { buildReview } from "./review-content";
import { briefExportJson, briefSummaryText, buildBriefExport } from "./brief-content";

type CopyState = null | "summary" | "export" | "failed";

export function ConversationBrief({
  segmentId,
  locale,
  visited,
  copyFor,
  note,
  onNote,
  onLocale,
  onBack,
  exitHref,
}: {
  segmentId: SegmentId;
  locale: Locale;
  visited: readonly SceneId[];
  copyFor: (sceneId: SceneId, locale: Locale) => SceneCopy;
  /** The person's own words, held above this component so a Back does not eat them. */
  note: string;
  onNote: (note: string) => void;
  onLocale: (locale: Locale) => void;
  onBack: () => void;
  exitHref: string;
}) {
  const t = getMessages(locale).ui;
  const segment = segmentDefinitions.find((s) => s.id === segmentId)!;
  const segmentLabel = segment.experienceName ?? segment.name;

  const model = buildReview(segment, visited, copyFor, locale);
  const [copied, setCopied] = useState<CopyState>(null);
  const [exportOpen, setExportOpen] = useState(false);
  /**
   * The exact text a failed copy was carrying.
   *
   * Not a re-derivation: a person copying by hand must get the same bytes the
   * button would have given them, so the failure keeps what it tried to send
   * rather than rebuilding it. Null in the normal case, which is why the page
   * stays as short as it was.
   */
  const [fallback, setFallback] = useState<string | null>(null);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);

  const coverage = t.reviewCoverage
    .replace("{count}", String(model.opened.length))
    .replace("{total}", String(model.total));

  const summary = briefSummaryText({
    segmentName: segmentLabel,
    model,
    note,
    labels: {
      title: t.briefTitle,
      coverage,
      questions: t.briefQuestions,
      topics: t.briefTopics,
      note: t.briefNoteLabel,
      boundary: t.briefBoundary,
    },
  });

  /* `generated_at` is passed in rather than read inside the builder, so the
     payload stays a pure function of the conversation everywhere else. Here,
     at the edge, the real clock is the honest value. */
  const exportJson = briefExportJson(
    buildBriefExport({
      segment,
      model,
      locale,
      note,
      generatedAt: new Date().toISOString(),
    }),
  );

  /* The clipboard is the whole mechanism. No request, no storage, no history:
     the text goes to the person, and the person decides where it goes next. */
  const copy = async (text: string, which: "summary" | "export") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setFallback(null);
    } catch {
      /* A clipboard can be refused — a permission, an insecure context, a
         browser that has none. Saying so and leaving the person to retype the
         brief from the page would be worse than not offering the button: the
         exact text appears instead, selectable and focusable. */
      setCopied("failed");
      setFallback(text);
    }
  };

  /* Put the cursor in it and select it, so the next keystroke can be a copy. */
  useEffect(() => {
    if (!fallback) return;
    const field = fallbackRef.current;
    field?.focus({ preventScroll: false });
    field?.select();
  }, [fallback]);

  return (
    <div className="rd rd-brief">
      <header className="rd__header">
        <div className="rd__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rd__logo" src="/assets/logo/pfm-logo-black.png" alt="PFM" width={54} height={16} />
          <span className="rd__product">{t.productName}</span>
        </div>
        <p className="rd__where">
          <span>{segmentLabel}</span>
          <span aria-hidden="true">/</span>
          <span>{t.briefTitle}</span>
        </p>
        <div className="rd__header-right">
          <div className="rd__locales" role="group" aria-label={t.languageLabel}>
            {locales.map((id) => (
              <button
                key={id}
                type="button"
                className={`rd__locale${id === locale ? " is-active" : ""}`}
                aria-pressed={id === locale}
                onClick={() => onLocale(id)}
              >
                <span aria-hidden="true">{localeLabels[id].short}</span>
                <span className="rd__sr">{localeLabels[id].name}</span>
              </button>
            ))}
          </div>
          <span className="rd__badge">{t.previewBadge}</span>
        </div>
      </header>

      <main className="rd-brief__body">
        <p className="rd__eyebrow">
          <span className="rd__eyebrow-rule" aria-hidden="true" />
          {segmentLabel}
        </p>
        <h1 className="rd-brief__title">{t.briefTitle}</h1>
        <p className="rd-brief__lead">{t.briefLead}</p>
        <p className="rd-brief__coverage">{coverage}</p>

        <section className="rd-brief__section">
          <h2>{t.briefQuestions}</h2>
          <ol className="rd-brief__questions">
            {model.questions.map((item, position) => (
              <li key={item.sceneId}>
                <span className="rd-brief__index">{String(position + 1).padStart(2, "0")}</span>
                <span className="rd-brief__name">{item.name}</span>
                <span className="rd-brief__question">{item.question}</span>
              </li>
            ))}
          </ol>
        </section>

        {model.context.length > 0 && (
          <section className="rd-brief__section">
            <h2>{t.briefTopics}</h2>
            {/* Named as topics, and said again in words: a thing to talk about
                is not a thing that has been established. */}
            <p className="rd-brief__section-note">{t.briefTopicsNote}</p>
            <ul className="rd-brief__topics">
              {model.context.map((item) => (
                <li key={item.label}>{item.label}</li>
              ))}
            </ul>
          </section>
        )}

        {/* The only input on the page, and it belongs to the person who types
            it. Not a contact field, not a submission — there is no form
            element here and nothing to submit it to. */}
        <section className="rd-brief__section">
          <h2>
            <label htmlFor="brief-note">{t.briefNoteLabel}</label>
          </h2>
          <p className="rd-brief__section-note" id="brief-note-hint">
            {t.briefNoteHint}
          </p>
          <textarea
            id="brief-note"
            className="rd-brief__note"
            rows={4}
            value={note}
            placeholder={t.briefNotePlaceholder}
            aria-describedby="brief-note-hint"
            onChange={(event) => {
              onNote(event.target.value);
              /* The brief just changed, so a previous copy no longer describes
                 what is on screen and a stale fallback would be the wrong
                 text entirely. */
              setCopied(null);
              setFallback(null);
            }}
          />
        </section>

        <p className="rd-brief__boundary">{t.briefBoundary}</p>

        <div className="rd-brief__actions">
          <button type="button" className="rd__cta" onClick={() => copy(summary, "summary")}>
            {t.briefCopy}
          </button>
          <button type="button" className="rd-brief__quiet" onClick={onBack}>
            {t.briefBack}
          </button>
          <a className="rd-brief__quiet" href={exitHref}>
            {t.demoBack}
          </a>
        </div>

        {/* One live region for both actions, so a copy is confirmed rather
            than silently assumed to have worked. */}
        <p className="rd-brief__status" role="status" aria-live="polite">
          {copied === "summary" && t.briefCopied}
          {copied === "export" && t.briefExportCopied}
          {copied === "failed" && t.briefCopyFailed}
        </p>

        {/* Only after a refused copy. The normal page never shows it. */}
        {fallback !== null && (
          <div className="rd-brief__fallback">
            <label htmlFor="brief-fallback">{t.briefFallbackLabel}</label>
            <textarea
              id="brief-fallback"
              ref={fallbackRef}
              readOnly
              rows={10}
              value={fallback}
            />
          </div>
        )}

        {/* Secondary, and folded away: a commercial user needs the text above,
            not this. */}
        <section className="rd-brief__export">
          <button
            type="button"
            className="rd-brief__export-toggle"
            aria-expanded={exportOpen}
            onClick={() => setExportOpen(!exportOpen)}
          >
            {t.briefExport} <span aria-hidden="true">{exportOpen ? "−" : "+"}</span>
          </button>
          <p className="rd-brief__export-note">{t.briefExportNote}</p>
          {exportOpen && (
            <>
              <pre className="rd-brief__json">{exportJson}</pre>
              <button
                type="button"
                className="rd-brief__quiet"
                onClick={() => copy(exportJson, "export")}
              >
                {t.briefExport}
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
