"use client";

/**
 * The proof level between a scene and its technical depth.
 *
 *   Discover  the scene — what can I learn?
 *   Proof     this — what do I actually get?
 *   Explain   the depth drawer — how is it created?
 *
 * It takes over the scene's own two columns rather than navigating anywhere:
 * the output sits flush left where the narrative column was, and the reading
 * column beside it takes whatever width is left. That column opens on a small,
 * dimmed reminder of the scene the reader came from, says what the output is,
 * then walks through it in a few numbered points — each lights up its part of
 * the output. Escape, or that reminder, returns to exactly the same
 * scene state.
 *
 * On open the points play through once, so a presenter who says nothing still
 * shows what to look at. Any hover, focus or click takes over from the tour,
 * and reduced motion skips it.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import "./what-you-get.css";

export interface WhatYouGetStep<F extends string> {
  id: F;
  title: string;
  body: string;
}

interface WhatYouGetProps<F extends string> {
  eyebrow: string;
  sentence: string;
  stepsLabel: string;
  steps: ReadonlyArray<WhatYouGetStep<F>>;
  back: string;
  heroSrc: string | null;
  question: string;
  onClose: () => void;
  children: (focus: F | null) => ReactNode;
}

const TOUR_START_MS = 900;
const TOUR_STEP_MS = 2400;

export function WhatYouGet<F extends string>({
  eyebrow,
  sentence,
  stepsLabel,
  steps,
  back,
  heroSrc,
  question,
  onClose,
  children,
}: WhatYouGetProps<F>) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [focus, setFocus] = useState<F | null>(null);
  const [pinned, setPinned] = useState<F | null>(null);
  const touring = useRef(true);
  const timers = useRef<number[]>([]);

  const stopTour = useCallback(() => {
    touring.current = false;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  /* The one-time tour. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ids = steps.map((step) => step.id);
    const schedule = [...ids, null].map((id, i) =>
      window.setTimeout(() => {
        if (touring.current) setFocus(id);
      }, TOUR_START_MS + i * TOUR_STEP_MS),
    );
    timers.current = schedule;
    return () => schedule.forEach((id) => window.clearTimeout(id));
  }, [steps]);

  const shown = pinned ?? focus;

  return (
    <div className="wyg">
      <div className="wyg__specimen">{children(shown)}</div>

      <aside className="wyg__lead">
        {/* The way back, first and compact: a thumbnail of the scene and one
            line. The question it returns to is its tooltip and accessible
            name, so the column keeps its height for the reading guide. */}
        <button type="button" className="wyg__back" onClick={onClose} title={question} aria-label={`${back}: ${question}`}>
          {heroSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={heroSrc} alt="" />
          )}
          <span className="wyg__back-kind">
            <span aria-hidden="true">←</span> {back}
          </span>
        </button>
        <p className="rd__eyebrow">
          <span className="rd__eyebrow-rule" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="wyg__sentence" ref={heading} tabIndex={-1}>
          {sentence}
        </h2>

        <p className="wyg__steps-label">{stepsLabel}</p>
        <ol className="wyg__steps" onMouseLeave={() => !pinned && setFocus(null)}>
          {steps.map((step, i) => (
            <li key={step.id}>
              <button
                type="button"
                className={`wyg__step${shown === step.id ? " is-active" : ""}`}
                aria-pressed={pinned === step.id}
                onMouseEnter={() => {
                  stopTour();
                  setFocus(step.id);
                }}
                onFocus={() => {
                  stopTour();
                  setFocus(step.id);
                }}
                onBlur={() => !pinned && setFocus(null)}
                onClick={() => {
                  stopTour();
                  setPinned((current) => (current === step.id ? null : step.id));
                }}
              >
                <span className="wyg__step-n" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="wyg__step-text">
                  <strong>{step.title}</strong>
                  <span>{step.body}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
