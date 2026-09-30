"use client";

/**
 * How a journey closes, for all five segments.
 *
 * WHAT IT REPLACES
 *
 * Two different endings. Three segments jumped from their last Core scene into
 * a Configure preview built in another presentation — a different page, a
 * different layout, arrived at without warning — and two ended in a Discussion
 * Summary that existed only because those three had somewhere to go and they
 * did not. A reader walking two segments met two products.
 *
 * WHAT IT IS ALLOWED TO SAY
 *
 * Only what the session actually contains, and only in words the model already
 * carries: each opened scene's own commercial question, and the CONNECTED link
 * of that scene's evidence chain — what the question depends on a location
 * supplying. Both are assembled in `review-content.ts`, where they can be
 * walked through by a test rather than only looked at.
 *
 * WHAT IT MAY NOT SAY, AND DOES NOT
 *
 * No score, no completeness rating, no recommendation, no selected solution, no
 * proof, no customer figure, and nothing about what this particular location
 * has. The coverage line counts scenes opened against the Core route and says
 * exactly that.
 *
 * THE PICTURE
 *
 * A segment cover, and only a segment cover: the typed `segmentStartVisuals`
 * entry, whose whole definition is that it orients and proves nothing
 * (`isEvidence: false`, `illustrative: true`). It carries its own label and its
 * own boundary note, in the reader's language, on the image. No scene hero
 * appears here — a scene hero is evidence for the scene it belongs to, and a
 * closing page is the easiest place in the product for evidence to be read as
 * a result.
 *
 * THE CONFIGURE LINK
 *
 * Offered only where a Configure preview genuinely exists AND at least one Core
 * scene was opened — see `configureOffer`. It is a clearly labelled, secondary
 * way OUT of this review into a separate preview, never the ending itself.
 */

import { segmentDefinitions } from "../../content/segments";
import { getSegmentStartVisual } from "../../content/segment-start-visuals";
import type { SceneId, SegmentId } from "../../content/types";
import { localeLabels, locales, type Locale } from "../../i18n/locales";
import { getMessages, type SceneCopy } from "../../i18n/messages";
import { demoUrl } from "./navigation";
import { startCoverCopy } from "../../i18n/starts";
import { buildReview, configureOffer } from "./review-content";

export function ConversationReview({
  segmentId,
  locale,
  visited,
  copyFor,
  onLocale,
  onResume,
  onRestart,
  onPrepareBrief,
  exitHref,
  configureHref,
}: {
  segmentId: SegmentId;
  locale: Locale;
  /** The scenes opened in this session, in the order they were opened. */
  visited: readonly SceneId[];
  /** The journey's own copy resolver, so the review cannot drift from a scene. */
  copyFor: (sceneId: SceneId, locale: Locale) => SceneCopy;
  onLocale: (locale: Locale) => void;
  onResume: () => void;
  onRestart: () => void;
  /**
   * Prepare a written record of this conversation.
   *
   * Offered only on a review that has one. The empty state does not carry it,
   * because there is nothing to write down.
   */
  onPrepareBrief: () => void;
  exitHref: string;
  /** Null for a segment with no Configure preview. Outlet Centre and QSR. */
  configureHref: string | null;
}) {
  const t = getMessages(locale).ui;
  const stageNames = getMessages(locale).stages;
  const segment = segmentDefinitions.find((s) => s.id === segmentId)!;
  const segmentLabel = segment.experienceName ?? segment.name;
  const route = segment.coreRoute;

  const model = buildReview(segment, visited, copyFor, locale);
  const { opened, groups, context } = model;
  const isEmpty = opened.length === 0;

  const cover = getSegmentStartVisual(segmentId);
  const coverCopy = startCoverCopy[locale][segmentId] ?? null;
  const configure = configureOffer(configureHref, model);

  const header = (
    <header className="rd__header">
      {/* The logo is the way home across the whole demo, not just the
          scenes — a reader who learns it on one screen must not lose it
          on the next. */}
      <a className="rd__brand rd__brand--home" href={exitHref} aria-label={t.demoBack} title={t.demoBack}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="rd__logo" src="/assets/logo/pfm-logo-black.png" alt="" width={54} height={16} />
        <span className="rd__product">{t.productName}</span>
      </a>
      <p className="rd__where">
        <a className="rd__where-link" href={demoUrl(segmentId, null, locale)} title={t.demoJourneyStart}>
          {segmentLabel}
        </a>
        <span aria-hidden="true">/</span>
        <span>{t.reviewTitle}</span>
      </p>
      <div className="rd__header-right">
        {/* Restart sits where it sits on every scene, so the reader who
            learned it there does not hunt for it here. */}
        <button type="button" className="rd__header-restart" onClick={onRestart}>
          {t.demoRestart}
        </button>
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
  );

  /* Nothing was opened — a link straight to this address, or a restart that
     has not been walked yet. It says so and offers the way in. No picture, no
     coverage, no questions, no context, and NO Configure preview: there is no
     conversation here to continue from, and offering one would be an
     invitation dressed as a conclusion. */
  if (isEmpty) {
    return (
      <div className="rd rd-review">
        {header}
        <main className="rd-review__body rd-review__body--empty">
          <p className="rd__eyebrow">
            <span className="rd__eyebrow-rule" aria-hidden="true" />
            {segmentLabel}
          </p>
          <h1 className="rd-review__title">{t.reviewTitle}</h1>
          <p className="rd-review__empty-text">{t.reviewEmpty}</p>
          <div className="rd-review__actions">
            <button type="button" className="rd__cta" onClick={onRestart}>
              {t.reviewStart} <span aria-hidden="true">→</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="rd rd-review">
      {header}

      <main className="rd-review__body">
        {/* ---------------------------------------------------------------
            THE FIRST VIEWPORT — who this was about, how far it went, the
            picture that orients it, and what to do next. The actions live
            here rather than under the questions, so a ten-scene review does
            not bury them a screen and a half down.
            --------------------------------------------------------------- */}
        <section className="rd-review__hero">
          <div className="rd-review__hero-copy">
            <p className="rd__eyebrow">
              <span className="rd__eyebrow-rule" aria-hidden="true" />
              {segmentLabel}
            </p>
            <h1 className="rd-review__title">{t.reviewTitle}</h1>
            <p className="rd-review__lead">{t.reviewLead}</p>

            {/* A count and a route, not a rating. Filled marks are scenes
                opened; the rest are scenes that exist and were not. */}
            <figure className="rd-review__coverage">
              <ol className="rd-review__route" aria-hidden="true">
                {route.map((id) => (
                  <li key={id} className={visited.includes(id) ? "is-opened" : ""} />
                ))}
              </ol>
              <figcaption>
                {t.reviewCoverage
                  .replace("{count}", String(opened.length))
                  .replace("{total}", String(route.length))}
              </figcaption>
            </figure>

            <div className="rd-review__actions">
              <button type="button" className="rd__cta" onClick={onResume}>
                {t.reviewResume} <span aria-hidden="true">→</span>
              </button>
              <button type="button" className="rd-review__secondary" onClick={onPrepareBrief}>
                {t.briefCta}
              </button>
              {/* Restart and the way out used to trail this row as two grey
                  words, the weakest things on the screen and the two a reader
                  at the end of a journey is actually looking for. Restart is
                  in the header now; the way out is the logo. What is left
                  here are the two onward choices. */}
            </div>
          </div>

          {/* The segment's own cover. Orientation, labelled as such on the
              image in the reader's language — never a scene hero, and never
              presented as anything a customer's location produced. */}
          {cover && coverCopy && (
            <figure className="rd-review__visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover.assetPath} alt={cover.altText} />
              <figcaption>
                <span className="rd-review__visual-label">{coverCopy.label}</span>
                <span className="rd-review__visual-note">{coverCopy.note}</span>
              </figcaption>
            </figure>
          )}
        </section>

        {/* Grouped by the stage each question belongs to — a place in the
            story, not a ranking — with route order kept inside each group. */}
        <section className="rd-review__section">
          <h2>{t.reviewOpened}</h2>
          <div className="rd-review__groups">
            {groups.map((group) => (
              <section key={group.stage} className="rd-review__group">
                <h3>{stageNames[group.stage]}</h3>
                <ol className="rd-review__questions">
                  {group.questions.map((item) => (
                    <li key={item.sceneId}>
                      <span className="rd-review__name">{item.name}</span>
                      <span className="rd-review__question">{item.question}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </section>

        {context.length > 0 && (
          <section className="rd-review__section">
            <h2>{t.reviewExamine}</h2>
            <p className="rd-review__section-lead">{t.reviewExamineLead}</p>
            <ul className="rd-review__context">
              {context.map((item) => (
                <li key={item.label}>
                  <span className="rd-review__context-label">{item.label}</span>
                  <span className="rd-review__context-from">{item.from.join(" · ")}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="rd-review__boundary">{t.reviewBoundary}</p>

        {/* Out of the review, not onward from it: a different preview, named
            as one, with what it is written beside it rather than discovered
            after the click. */}
        {configure && (
          <aside className="rd-review__aside">
            <a className="rd-review__configure" href={configure}>
              {t.reviewConfigure} <span aria-hidden="true">↗</span>
            </a>
            <p>{t.reviewConfigureNote}</p>
          </aside>
        )}
      </main>
    </div>
  );
}
