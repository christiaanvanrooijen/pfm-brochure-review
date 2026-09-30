"use client";

/**
 * The redesign presentation layer — an editorial two-column canvas.
 *
 * THE CORRECTION THIS FILE CARRIES
 *
 * The previous composition laid the question over the photograph as a dark
 * gradient slab and put three labelled hotspots on the image at once. It passed
 * every functional check and still read as a brochure with overlays: the
 * picture was occluded by its own caption, and five controls competed before
 * the reader had chosen anything.
 *
 * The reference recording resolves both. The page is white. The narrative sits
 * in a restrained left column and the photograph is an unoccluded rectangle on
 * the right. The textual focus controls in the column drive the scene — they
 * change the question, the support and what the image shows — and the image
 * carries at most ONE `+`, belonging to the currently selected subject. Opening
 * it turns it into `×` and attaches one flat card beside it.
 *
 * WHAT THE CARD MAY AND MAY NOT SAY
 *
 * A kicker, one typed explanation, and one illustrative note. It does NOT
 * repeat the full truth boundary: that lives in the narrative column, where it
 * is read once and stays read, rather than being restated on every reveal until
 * it becomes wallpaper.
 *
 * GEOMETRY
 *
 * Only where the selected typed evidence has a defensible spatial locus, and
 * only as a thin, subtle rectangle or line. No dashed contours, no rings, no
 * fills: a shape that does not carry evidence is decoration, and decoration on
 * a measurement image is a claim nobody made.
 */

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import type { Locale } from "../../i18n/locales";
import { localeLabels, locales } from "../../i18n/locales";
import { getMessages, type SceneCopy } from "../../i18n/messages";

export interface StageMarker {
  id: string;
  label: string;
  state: "past" | "current" | "upcoming" | "unavailable";
}

/** The `+` anchor for one subject, in the asset's own pixel coordinates. */
export interface Hotspot {
  id: string;
  x: number;
  y: number;
  /** Which side of the point the card opens on, so it stays on the image. */
  side: "left" | "right";
  vertical: "above" | "below";
}

interface SceneFrameProps {
  locale: Locale;
  onLocale: (locale: Locale) => void;
  segmentLabel: string;
  copy: SceneCopy;
  stages: readonly StageMarker[];
  position: { index: number; total: number };
  /**
   * The approved photograph, or null where none exists for this scene. Null is
   * a real state, not a loading state: two segment starts have no approved
   * asset, and the honest answer is to say which visual is missing rather than
   * to borrow another segment's picture.
   */
  heroSrc: string | null;
  /** Alt text belonging to a cover, which describes a different picture. */
  heroAltOverride?: string | null;
  /**
   * Present only on a segment start's cover view.
   *
   * A cover is labelled as what it is, on the image, in the reader's language.
   * Without the label a photograph beside a measurement question is read as
   * proof of it — which is exactly how an Outlet cover would become a claim
   * about catchment.
   */
  cover?: { label: string; note: string } | null;
  /**
   * A typed diagram, where no photograph is available for this scene.
   *
   * It replaces the picture, not the boundary: a diagram carries the concept
   * where a large "not produced" panel would carry nothing, and it is captioned
   * as an illustration so it is never read as a photograph of a real place.
   */
  diagram?: ReactNode | null;
  diagramCaption?: string | null;
  asset: { w: number; h: number };
  /**
   * `hotspots` where the image has subjects that can be pointed at honestly;
   * `layer` where it does not — a compact evidence strip rather than a `+`
   * invented so every scene behaves alike.
   */
  mode: "hotspots" | "layer";
  hotspots: readonly Hotspot[];
  focusIds: readonly string[];
  activeFocusId: string;
  onFocus: (id: string) => void;
  /** Open state of the `+` belonging to the active subject. */
  pointOpen: boolean;
  onPoint: (open: boolean) => void;
  overlay: ReactNode;
  depthOpen: boolean;
  onDepth: (open: boolean) => void;
  /**
   * Null where the segment has no onward destination. The control is then
   * rendered inert rather than as a link to "#": a button that reads "Measure
   * store visits" and goes nowhere is a promise the page cannot keep.
   */
  ctaHref: string | null;
  /**
   * In-place advance, for a journey that moves between scenes without leaving
   * the page. When present it takes precedence over `ctaHref`, and the control
   * becomes a button — a control that changes the page in place is a button,
   * not a link, whatever it looks like.
   */
  onCta?: (() => void) | undefined;
  /**
   * Where the onward control is rendered.
   *
   * `column` (the default, and what every existing caller keeps) puts it in the
   * narrative column beside "How does this work?". `external` renders no
   * onward control at all, for a caller that owns a persistent navigation bar
   * of its own — the demo, where "next" belongs with previous, position and the
   * way back rather than one of four buttons in three different places.
   *
   * `ctaNote` still renders in the column either way: it explains what the
   * onward step IS, which is narrative, not navigation.
   */
  ctaPlacement?: "column" | "external";
  ctaNote: string | null;
  /**
   * Where "home" is, for the callers that have one.
   *
   * Readers reach for the logo to get out of a journey long before they find
   * a worded control lower down the page — feedback from the go-demo was that
   * the bar's "All segments" is read as chrome, not as the way back. So the
   * brand block becomes the link where a caller passes this, and stays the
   * inert block it was signed off as where a caller does not: the approved
   * segment starts share this frame and have nowhere to go.
   */
  homeHref?: string | null;
  /**
   * The journey's own first scene, for the middle step of the breadcrumb.
   *
   * With `homeHref` on the logo, the header reads as the trail it already
   * looked like: PFM, this journey, this scene. Callers with one scene and
   * no journey behind it pass nothing and keep a plain label.
   */
  segmentHref?: string | null;
  /**
   * One caller-owned control in the header's right group, before the language
   * switcher.
   *
   * It exists for Restart. Restart used to sit in the journey bar between two
   * back-arrows, where the control that clears the session read as the mildest
   * of three ways back. The header is where a reader looks to leave or reset a
   * thing, and the bar is left to move through it.
   */
  headerAction?: ReactNode;
  /**
   * The optional proof level: "what do I actually get?".
   *
   * Where a scene has a product specimen, the column carries one more control
   * beside the depth trigger, and opening it swaps the two columns for the
   * caller's `output` in place — no navigation, and the journey bar below stays
   * where it is. Scenes without a specimen pass nothing and are unchanged.
   */
  outputLabel?: string | null;
  outputOpen?: boolean;
  onOutput?: (open: boolean) => void;
  output?: ReactNode;
  depthRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}

const pad = (value: number) => String(value).padStart(2, "0");
const pct = (value: number, total: number) => `${(value / total) * 100}%`;

export function SceneFrame({
  locale,
  onLocale,
  segmentLabel,
  copy,
  stages,
  position,
  heroSrc,
  heroAltOverride = null,
  cover = null,
  diagram = null,
  diagramCaption = null,
  asset,
  mode,
  hotspots,
  focusIds,
  activeFocusId,
  onFocus,
  pointOpen,
  onPoint,
  overlay,
  depthOpen,
  onDepth,
  ctaHref,
  onCta,
  ctaPlacement = "column",
  ctaNote,
  homeHref = null,
  segmentHref = null,
  headerAction = null,
  outputLabel = null,
  outputOpen = false,
  onOutput,
  output = null,
  depthRef,
  children,
}: SceneFrameProps) {
  const t = getMessages(locale).ui;
  const depthTrigger = useRef<HTMLButtonElement>(null);
  const outputTrigger = useRef<HTMLButtonElement>(null);
  const showOutput = outputOpen && output !== null;

  /* Back from the specimen lands on the control that opened it. */
  const wasOutput = useRef(false);
  useEffect(() => {
    if (wasOutput.current && !showOutput) outputTrigger.current?.focus({ preventScroll: true });
    wasOutput.current = showOutput;
  }, [showOutput]);

  /* The drawer is modal: it dims the page behind it, takes focus when it opens,
     keeps Tab inside itself while it is open, and gives focus back to the
     control that opened it on every way out. */
  useEffect(() => {
    if (!depthOpen) return;
    const panel = depthRef.current;
    const trigger = depthTrigger.current;
    panel?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDepth(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      // `video[controls]` is included because Gate 8 put a native player inside
      // this panel: Chrome and Safari both put a controls-bearing video in the
      // natural tab order without ever matching `a[href]`, `button` or an
      // explicit `[tabindex]`. Without this, the video was still reachable by
      // Tab (browsers walk the whole DOM, not just this list) but the trap's
      // own first/last bookkeeping did not know about it — so tabbing FROM the
      // video, when it happened to be the last focusable element, left the
      // panel instead of wrapping back to the top.
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), video[controls]',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      const active = document.activeElement;
      const cameFromPanel =
        active === null ||
        active === document.body ||
        active === panel ||
        (panel !== null && panel.contains(active));
      if (cameFromPanel) trigger?.focus();
    };
  }, [depthOpen, onDepth, depthRef]);

  // At most one `+`, and it belongs to whatever the column has selected.
  const point = mode === "hotspots" ? hotspots.find((h) => h.id === activeFocusId) ?? null : null;

  return (
    <div className={`rd${depthOpen ? " rd--dimmed" : ""}`}>
      <header className="rd__header">
        {/* A link only where the caller has somewhere to go. This frame is
            shared by the approved starts and the preview journeys alike, so a
            way out added unconditionally would be added to every caller at
            once; `homeHref` makes it the demo's choice. The logo artwork is
            untouched either way — the link wraps it, and the hover and focus
            affordances sit in the padding around it, so its clear space is
            widened rather than crowded. */}
        {homeHref ? (
          <a className="rd__brand rd__brand--home" href={homeHref} aria-label={t.demoBack} title={t.demoBack}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="rd__logo"
              src="/assets/logo/pfm-logo-black.png"
              alt=""
              width={54}
              height={16}
            />
            <span className="rd__product">{t.productName}</span>
          </a>
        ) : (
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
        )}

        <p className="rd__where">
          {segmentHref ? (
            <a className="rd__where-link" href={segmentHref} title={t.demoJourneyStart}>
              {segmentLabel}
            </a>
          ) : (
            <span>{segmentLabel}</span>
          )}
          <span aria-hidden="true">/</span>
          <span>{copy.eyebrow}</span>
        </p>

        <div className="rd__header-right">
          {headerAction}
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

      <nav className="rd__stages" aria-label={t.storyOverview}>
        <ol className="rd__stage-list">
          {stages.map((stage) => (
            <li key={stage.id} className={`rd__stage is-${stage.state}`}>
              <span aria-current={stage.state === "current" ? "step" : undefined}>
                {stage.label}
              </span>
              {stage.state === "unavailable" && (
                <span className="rd__sr">{t.stageUnavailable}</span>
              )}
            </li>
          ))}
        </ol>
        <p className="rd__position">
          <span className="rd__sr">{t.scenePosition} </span>
          {pad(position.index)} <span aria-hidden="true">/</span> {pad(position.total)}
        </p>
      </nav>

      {showOutput ? (
        <div className="rd__main rd__main--output">{output}</div>
      ) : (
      <div className="rd__main">
        {/* ---------------------------------------------------------------
            THE NARRATIVE COLUMN — white, restrained, and the thing that
            drives the image rather than sitting on top of it.
            --------------------------------------------------------------- */}
        <section className="rd__column">
          <p className="rd__eyebrow">
            <span className="rd__eyebrow-rule" aria-hidden="true" />
            {copy.eyebrow}
            <span className="rd__eyebrow-pos">
              {pad(position.index)} <span aria-hidden="true">/</span> {pad(position.total)}
            </span>
          </p>

          <h1 className="rd__question">{copy.question}</h1>
          <p className="rd__supporting">{copy.supporting}</p>

          {/* The truth boundary, read once, in the column — not restated on
              every reveal until it stops being read at all. */}
          <p className="rd__truth">{copy.truth}</p>

          <div className="rd__focus" role="group" aria-label={copy.eyebrow}>
            {focusIds.map((id) => (
              <button
                key={id}
                type="button"
                className={`rd__focus-tab${id === activeFocusId ? " is-active" : ""}`}
                aria-pressed={id === activeFocusId}
                onClick={() => {
                  onFocus(id);
                  onPoint(false);
                }}
              >
                {copy.focus[id]?.label}
              </button>
            ))}
          </div>
          <p className="rd__focus-body">{copy.focus[activeFocusId]?.body}</p>

          <div className="rd__actions">
            {ctaPlacement === "external" ? null : onCta ? (
              <button type="button" className="rd__cta" onClick={onCta}>
                {copy.nextCta}
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12L12 4" />
                  <path d="M5.5 4H12v6.5" />
                </svg>
              </button>
            ) : ctaHref ? (
              <a className="rd__cta" href={ctaHref}>
                {copy.nextCta}
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12L12 4" />
                  <path d="M5.5 4H12v6.5" />
                </svg>
              </a>
            ) : (
              <span className="rd__cta is-inert" aria-disabled="true">
                {copy.nextCta}
              </span>
            )}
            {outputLabel && onOutput && (
              <button
                type="button"
                ref={outputTrigger}
                className="rd__output-trigger"
                aria-expanded={outputOpen}
                onClick={() => onOutput(true)}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="1.75" y="2.75" width="12.5" height="10.5" />
                  <path d="M1.75 6h12.5M6.5 6v7.25" />
                </svg>
                {outputLabel}
              </button>
            )}
            <button
              type="button"
              ref={depthTrigger}
              className="rd__depth-trigger"
              aria-expanded={depthOpen}
              aria-haspopup="dialog"
              onClick={() => onDepth(!depthOpen)}
            >
              {t.howThisWorks}
              <span aria-hidden="true">{depthOpen ? "−" : "+"}</span>
            </button>
          </div>
          {ctaNote && <p className="rd__cta-note">{ctaNote}</p>}
        </section>

        {/* ---------------------------------------------------------------
            THE VISUAL — unoccluded. Nothing is laid across it except the
            geometry that explains the selected evidence and, at most, one
            point of interest.
            --------------------------------------------------------------- */}
        <figure
          className="rd__stage-figure"
          style={{ "--rd-aspect": `${asset.w} / ${asset.h}` } as CSSProperties}
        >
          {heroSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={heroSrc} alt={heroAltOverride ?? copy.heroAlt} />
          ) : diagram ? (
            <div className="rd__diagram">{diagram}</div>
          ) : (
            <div className="rd__pending">
              <p className="rd__pending-kicker">{t.visualPending}</p>
              <p className="rd__pending-body">{t.visualPendingBody}</p>
              {/* The scene's own caption still belongs here. What does NOT is
                  the "illustrative visual" note: nothing illustrative is being
                  shown, so claiming one would be its own small untruth. */}
              <p className="rd__pending-caption">{copy.heroCaption}</p>
            </div>
          )}

          <svg
            className="rd__overlay"
            viewBox={`0 0 ${asset.w} ${asset.h}`}
            aria-hidden="true"
            focusable="false"
          >
            {overlay}
          </svg>

          {point && (
            <>
              <button
                type="button"
                className={`rd__point${pointOpen ? " is-open" : ""}`}
                style={{ left: pct(point.x, asset.w), top: pct(point.y, asset.h) }}
                aria-expanded={pointOpen}
                onClick={() => onPoint(!pointOpen)}
              >
                <span aria-hidden="true">{pointOpen ? "×" : "+"}</span>
                <span className="rd__sr">{copy.focus[point.id]?.label}</span>
              </button>

              {pointOpen && (
                <div
                  className={`rd__card rd__card--${point.side} rd__card--${point.vertical}`}
                  /* The point's position is handed to CSS as a percentage and
                     clamped there, so the card stays inside the image at every
                     width instead of each hotspot being hand-tuned per
                     viewport — which is what pushed the French and German cards
                     off the bottom edge at 1024. */
                  style={
                    {
                      "--px": pct(point.x, asset.w),
                      "--py": pct(point.y, asset.h),
                    } as CSSProperties
                  }
                  role="status"
                >
                  <p className="rd__card-kicker">{copy.focus[point.id]?.label}</p>
                  <p className="rd__card-body">{copy.focus[point.id]?.body}</p>
                  <p className="rd__card-note">{copy.illustrative}</p>
                </div>
              )}
            </>
          )}

          {/* The evidence layer, for scenes with no honest spatial locus.
              It is a READ-OUT, not a second set of controls: the focus buttons
              live in the narrative column for every scene, and repeating them
              here as chips made the same three labels appear twice on one
              screen. What belongs on the image is the boundary that applies to
              what is being shown. */}
          {/* Not on a cover. A cover is orientation; putting an evidence layer
              on it would re-merge the two things this view exists to separate. */}
          {mode === "layer" && !cover && (
            /* On a diagram the layer moves to the top: the diagram uses the
               lower third for its own labels, and two boxes fighting over the
               same band is how a clear picture becomes a busy one. */
            <div className={`rd__layer${diagram ? " rd__layer--on-diagram" : ""}`}>
              <p className="rd__layer-kicker">{copy.focus[activeFocusId]?.label}</p>
              <p className="rd__layer-bound">{copy.coverageNote}</p>
            </div>
          )}

          {/* A cover states what it is and what it does not claim, in place of
              the scene caption — that caption belongs to evidence. */}
          {heroSrc && cover && (
            <figcaption className="rd__figcaption rd__figcaption--cover">
              <span className="rd__cover-label">{cover.label}</span>
              <span className="rd__cover-note">{cover.note}</span>
            </figcaption>
          )}

          {!heroSrc && diagram && (
            <figcaption className="rd__figcaption rd__figcaption--diagram">
              <span>{copy.heroCaption}</span>
              <span className="rd__figcaption-note">{diagramCaption}</span>
            </figcaption>
          )}

          {heroSrc && !cover && (
            <figcaption className="rd__figcaption">
              <span>{copy.heroCaption}</span>
              <span className="rd__figcaption-note">{copy.illustrative}</span>
            </figcaption>
          )}
        </figure>
      </div>
      )}

      {children}
    </div>
  );
}
