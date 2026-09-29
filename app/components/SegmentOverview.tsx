"use client";

/**
 * The front door: five segments, as a choice.
 *
 * WHY THIS EXISTS
 *
 * The five segment starts were reachable only by typing `?segment=<id>` onto a
 * preview URL. Everything a presenter needed was built — five journeys, five
 * covers, three languages — and the one thing missing was the page that lets
 * someone choose between them without knowing the query string. A demo nobody
 * can open is not a demo.
 *
 * WHAT A CARD MAY SAY
 *
 * Its segment's own name, its segment's own opening question, and its segment's
 * own cover. Nothing else. A picker is where marketing copy normally creeps in
 * — a short tagline per card, written to fill the space — and a tagline is a
 * claim that no typed model made and no reviewer approved. So the card carries
 * the same first question the reader will see one click later, in the same
 * words, and a picture that is labelled as orientation rather than proof.
 *
 * WHAT IT DOES NOT PROMISE
 *
 * Four segments cannot yet be run end to end. Each card says so ON the card,
 * before the click, in the reader's language — a presenter standing in front of
 * a customer should not discover the edge of the build by walking into it.
 */

import Link from "next/link";
import { useState } from "react";
import { getSegmentStartVisual } from "../content/segment-start-visuals";
import { segmentDefinitions } from "../content/segments";
import { localeLabels, locales, type Locale } from "../i18n/locales";
import { getMessages } from "../i18n/messages";
import { overviewCopy } from "../i18n/overview";
import { startCopy, startScenes } from "../i18n/starts";
import { shellRunsSegment } from "../lib/segment-journey";
import { customerLogos } from "../content/customer-logos";
import { brochureRouteAvailable } from "../content/release";

export function SegmentOverview({ initialLocale }: { initialLocale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const t = getMessages(locale).ui;
  const copy = overviewCopy[locale];

  /* Presentation order is the content model's own, not a ranking invented here:
     `segmentDefinitions` already lists the five in the order the product tells
     them, and Retail leads because it is the one that runs end to end. */
  /**
   * Two facts, kept apart on purpose.
   *
   * `previewable` — every segment has a complete Core journey in the demo, so
   * every card opens one. The earlier version sent four of the five to an
   * isolated one-scene start and labelled them "Start only", which read as
   * four unfinished segments when what actually existed was five finished
   * preview journeys in a place the overview never mentioned.
   *
   * `runsInShell` — whether the APPROVED sales experience runs this segment.
   * It is used only as the fallback destination when the brochure is not
   * approved for production; with the brochure approved, the overview links
   * to no shell at all (product lead, 2026-09-29).
   *
   * The demo journeys are the destination wherever the brochure is approved:
   * outside production always, and in production since the product lead
   * approved them on 2026-09-29 (app/content/release.ts). Without that
   * approval the overview offers only the approved shell, and a segment it
   * cannot run stays inert.
   */
  const previewable = brochureRouteAvailable();

  const cards = segmentDefinitions.map((segment) => {
    const sceneId = startScenes[segment.id];
    const runsInShell = shellRunsSegment(segment);

    return {
      id: segment.id,
      label: segment.experienceName ?? segment.name,
      /* The reader's first question, in the words they will read one click
         later. Taken from the start's own copy so the two cannot drift. */
      question: startCopy[locale][sceneId].question,
      cover: getSegmentStartVisual(segment.id),
      /* How much of the story this card opens, from the typed Core route
         itself — never a number kept in step by hand. */
      scenes: segment.coreRoute.length,
      runsInShell,
      href: previewable
        ? `/preview/demo?segment=${segment.id}&locale=${locale}`
        : runsInShell
          ? `/shell?segment=${segment.id}`
          : null,
    };
  });

  return (
    <div className="ov">
      <header className="rd__header">
        <div className="rd__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rd__logo"
            src="/assets/logo/pfm-logo-black.png"
            alt="PFM"
            width={54}
            height={16}
          />
          <span className="rd__product">{t.productName}</span>
        </div>

        <p className="rd__where">
          <span>{copy.eyebrow}</span>
        </p>

        <div className="rd__header-right">
          <div className="rd__locales" role="group" aria-label={t.languageLabel}>
            {locales.map((id) => (
              <button
                key={id}
                type="button"
                className={`rd__locale${id === locale ? " is-active" : ""}`}
                aria-pressed={id === locale}
                onClick={() => setLocale(id)}
              >
                <span aria-hidden="true">{localeLabels[id].short}</span>
                <span className="rd__sr">{localeLabels[id].name}</span>
              </button>
            ))}
          </div>
          <span className="rd__badge">{t.previewBadge}</span>
        </div>
      </header>

      <main className="ov__main">
        <section className="ov__intro">
          <p className="rd__eyebrow">
            <span className="rd__eyebrow-rule" aria-hidden="true" />
            {copy.segmentsLabel}
          </p>
          <h1 className="ov__title">{copy.title}</h1>
          <p className="ov__lead">{copy.lead}</p>
        </section>

        <ul className="ov__grid">
          {cards.map((card) => {
            const face = (
              <>
                <span className="ov__figure">
                  {card.cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={card.cover.assetPath} alt={card.cover.altText} />
                  ) : (
                    /* Not a loading state and not a gap to be filled later: a
                       segment with no honest cover shows none, rather than
                       borrowing a picture of a different kind of place. */
                    <span className="ov__figure-absent" aria-hidden="true" />
                  )}
                </span>

                <span className="ov__body">
                  <span className="ov__head">
                    <span className="ov__name">{card.label}</span>
                    <span className="ov__status">
                      {copy.sceneCount.replace("{count}", String(card.scenes))}
                    </span>
                  </span>
                  <span className="ov__question">{card.question}</span>
                  <span className="ov__open">
                    {card.href ? copy.openJourney : copy.openUnavailable}
                    {card.href && <span aria-hidden="true"> →</span>}
                  </span>
                </span>
              </>
            );

            return (
            <li key={card.id} className="ov__card">
              {/* A card with nowhere to go is rendered as a card, not as a link
                  that goes nowhere — the same honesty the shell applies to a
                  segment it cannot run. Only production reaches that state. */}
              {card.href ? (
                <Link className="ov__link" href={card.href}>
                  {face}
                </Link>
              ) : (
                <span className="ov__link is-inert" aria-disabled="true">
                  {face}
                </span>
              )}
            </li>
            );
          })}
        </ul>

        {/* Who is speaking, once the reader has seen what we can show. Every
            claim is sourced in docs/content/PFM-COMPANY-FACTS.md; the logos are
            approved for use here (product lead, 2026-09-29). */}
        <section className="ov__about" aria-labelledby="ov-about-title">
          <div className="ov__about-intro">
            <p className="rd__eyebrow">
              <span className="rd__eyebrow-rule" aria-hidden="true" />
              {copy.aboutLabel}
            </p>
            <h2 id="ov-about-title" className="ov__about-title">{copy.aboutTitle}</h2>
            <p className="ov__about-lead">{copy.aboutLead}</p>
          </div>
          <ul className="ov__about-facts">
            {copy.aboutFacts.map((fact) => (
              <li key={fact.title}>
                <strong>{fact.title}</strong>
                <span>{fact.text}</span>
              </li>
            ))}
          </ul>
          <div className="ov__logos">
            <p className="ov__logos-label">{copy.aboutLogosLabel}</p>
            <ul>
              {customerLogos.map((customer) => (
                <li key={customer.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={customer.assetPath} alt={customer.name} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
