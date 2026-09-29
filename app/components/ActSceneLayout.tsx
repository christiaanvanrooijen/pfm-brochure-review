"use client";

/**
 * The shared Act frame.
 *
 * WHAT IT OWNS
 *
 * The masthead, the closing state, the footer and its single call to action,
 * the demo-session definition line, the typed capture strip, the Escape
 * behaviour and the Act view state. Everything, in other words, that is the same
 * conversation whatever kind of property is being discussed — and everything
 * that carries a truth rule, so a rule cannot be fixed in one segment and left
 * broken in another.
 *
 * WHAT IT DOES NOT OWN
 *
 * The middle. Retail closes with a recap that converges into three
 * next-conversation offers; Shopping Centre closes with four decision beats and
 * no second menu, because after Configure a second menu is just another menu.
 * Those are different information structures rather than different copy, so each
 * wrapper supplies its own middle as `children` instead of both being bent into
 * one markup shape.
 *
 * Nothing here recommends, ranks, scores or selects. The segment contract's
 * `decisionOwner` is the literal "human", and the closing state sends nothing.
 */

import { useEffect, type ReactNode } from "react";
import type { SegmentId } from "../content/types";
import { getActSynthesis } from "../content/act-runtime";
import type { ActViewAction, ActViewState } from "../lib/act-view";

export interface ActClosingCopy {
  cta: string;
  headline: string;
  handoff: string;
  truth: string;
  back: string;
}

interface ActSceneLayoutProps {
  segmentId: SegmentId;
  /** Masthead headline while the conversation is still open. */
  headline: string;
  lead: string;
  /**
   * The line above the call to action.
   *
   * Segment-specific because it refers to what is on the page: Retail's names
   * the three directions above it, and Shopping Centre has none.
   */
  footerNote: string;
  closing: ActClosingCopy;
  /** The journey in one line, shown in the closing state. */
  closingRecapLine: string;
  /**
   * Quiet context under the convergence destination.
   *
   * Retail names the portfolio the question resolves into. A shopping centre is
   * one asset, not a count of locations, so it passes its own or nothing at all.
   */
  destinationNote: string | null;
  clientName: string | null;
  presentationMode?: boolean;
  view: ActViewState;
  onView: (action: ActViewAction) => void;
  /** The segment's own middle section, shown while the closing state is not. */
  children: ReactNode;
  /** Extra root modifier a segment's middle needs, e.g. Retail's detail state. */
  rootModifier?: string;
}

export function ActSceneLayout({
  segmentId,
  headline,
  lead,
  footerNote,
  closing,
  closingRecapLine,
  destinationNote,
  clientName,
  presentationMode = false,
  view,
  onView,
  children,
  rootModifier = "",
}: ActSceneLayoutProps) {
  const synthesis = getActSynthesis(segmentId);

  // Escape peels exactly one layer: the closing state if it is showing,
  // otherwise whatever the middle has open. Same discipline as Configure.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onView({ type: "DISMISS" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onView]);

  return (
    <div
      className={`act${presentationMode ? " act--presenting" : ""}${
        view.closing ? " act--closing" : ""
      }${rootModifier}`}
    >
      <div className="act__page">
        <header className="act__masthead">
          <p className="capture__eyebrow">
            Act <span aria-hidden="true">·</span> Next step
          </p>
          <h1 className="act__headline">
            {view.closing ? closing.headline : headline}
          </h1>
          {!view.closing && <p className="act__lead">{lead}</p>}
          {/* The typed synthesis contract, bound rather than restated.
              Presenter framing, so it is Sales Mode only. */}
          {!presentationMode && synthesis && (
            <p className="act__governing">{synthesis.governingQuestion}</p>
          )}
        </header>

        {!view.closing && (
          <>
            {children}

            <div className="act__footer">
              <p className="act__footer-note">{footerNote}</p>
              <button
                type="button"
                className="capture__cta act__cta"
                onClick={() => onView({ type: "CONTINUE_CONVERSATION" })}
              >
                {closing.cta}
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M0 6h15" />
                  <path d="M11.5 2.5L15 6l-3.5 3.5" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* ------------------------------------------------------------------
            THE CLOSING STATE

            Reached from the primary call to action, which sends nothing,
            saves nothing and requests nothing — so this screen claims none of
            those things and says so outright. It is also reversible: the way
            back is the last control, because the final screen of a brochure
            must not be a dead end.
            ------------------------------------------------------------------ */}
        {view.closing && (
          <div className="act__closing" role="status">
            <p className="act__closing-recap">{closingRecapLine}</p>
            {destinationNote && (
              <p className="act__closing-client">{destinationNote}</p>
            )}
            <p className="act__closing-handoff">{closing.handoff}</p>
            <p className="act__closing-truth">{closing.truth}</p>
            <button
              type="button"
              className="act__closing-back"
              onClick={() => onView({ type: "BACK_TO_DIRECTIONS" })}
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 5H3" />
                <path d="M6 2L3 5l3 3" />
              </svg>
              {closing.back}
            </button>
          </div>
        )}

        <p className="act__definition">
          Illustrative demo session
          <span aria-hidden="true"> · </span>
          {clientName ? `${clientName} is a fictional account` : "Fictional account data"}
          <span aria-hidden="true"> · </span>
          no customer results are shown
        </p>

        {/* The typed synthesis captures, in the architecture's own words.
            Internal state, so Sales Mode only. */}
        {!presentationMode && synthesis && (
          <p className="act__captures">
            <span>Act carries forward</span>
            {synthesis.captures.map((capture) => capture.replace(/_/g, " ")).join(" · ")}
            <span aria-hidden="true"> · </span>
            decision owner: {synthesis.decisionOwner}
          </p>
        )}
      </div>
    </div>
  );
}
