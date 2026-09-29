"use client";

/**
 * Shopping Centre Act — four decision beats, then one question.
 *
 * The shared frame (masthead, closing state, footer, call to action, capture
 * strip, Escape) lives in `ActSceneLayout`. What is here is only this segment's
 * middle: the four decisions, and the convergence they feed.
 *
 * TWO STRUCTURAL DIFFERENCES FROM RETAIL, BOTH DELIBERATE
 *
 * 1. No second menu. Retail converges into three next-conversation offers. A
 *    centre has just walked four Configure territories, and another set of offer
 *    cards after that reads as a menu rather than a conclusion. Here the beats
 *    ARE the conversation.
 * 2. The convergence comes AFTER the beats rather than before them. Retail
 *    recaps and then offers; this page states four decisions and then shows them
 *    meeting at a single question. The order is the argument.
 */

import { useMemo, useReducer } from "react";
import type { SegmentId } from "../content/types";
import {
  shoppingCentreActBeats,
  shoppingCentreActClosing,
  shoppingCentreActConvergence,
  shoppingCentreActFooterNote,
} from "../content/act-shopping-centre";
import { actViewReducer, initialActViewState } from "../lib/act-view";
import { ActSceneLayout } from "./ActSceneLayout";

const SEGMENT: SegmentId = "shopping-centre";

const DISPLAY_HEADLINE = "What should we decide next?";
const DISPLAY_LEAD =
  "Four decisions this centre owns, and the evidence that can — and cannot — inform each one.";

/**
 * The convergence.
 *
 * Retail's idea, redrawn: four threads meeting at one point. Not Retail's
 * implementation — the beats, the identifiers and the CSS modifiers are this
 * segment's, there is no performance thread, and the destination is a question
 * rather than a count of locations. A centre is one asset.
 */
function Convergence() {
  const rowHeight = 32;
  const top = 16;
  const nodeX = 470;
  const nodeY = top + ((shoppingCentreActBeats.length - 1) * rowHeight) / 2;
  const height = top * 2 + (shoppingCentreActBeats.length - 1) * rowHeight;

  return (
    <svg
      className="sc-act__converge"
      viewBox={`0 0 900 ${height}`}
      role="img"
      aria-label={`Four decisions meeting at one question: ${shoppingCentreActConvergence.label}`}
    >
      <g>
        {shoppingCentreActBeats.map((beat, index) => {
          const y = top + index * rowHeight;
          return (
            <g key={beat.id} className={`sc-act__beat sc-act__beat--${beat.id}`}>
              <text className="sc-act__beat-label" x={0} y={y + 4}>
                {beat.title}
              </text>
              <path
                className="sc-act__thread"
                d={`M190 ${y} C 300 ${y}, 360 ${nodeY}, ${nodeX - 8} ${nodeY}`}
                fill="none"
              />
            </g>
          );
        })}
      </g>
      <circle className="sc-act__node" cx={nodeX} cy={nodeY} r={6.5} />
      <text className="sc-act__destination" x={nodeX + 20} y={nodeY - 1}>
        {shoppingCentreActConvergence.label}
      </text>
      <text className="sc-act__destination-note" x={nodeX + 20} y={nodeY + 17}>
        {shoppingCentreActConvergence.note}
      </text>
    </svg>
  );
}

interface ShoppingCentreActSceneProps {
  /** Quiet context only. A centre is one asset, so no count is shown. */
  assetName?: string | null;
  presentationMode?: boolean;
}

export function ShoppingCentreActScene({
  assetName = null,
  presentationMode = false,
}: ShoppingCentreActSceneProps) {
  const [view, dispatch] = useReducer(actViewReducer, initialActViewState);

  const closingRecapLine = useMemo(
    () =>
      [
        ...shoppingCentreActBeats.map((beat) => beat.title),
        shoppingCentreActConvergence.label,
      ].join(" → "),
    [],
  );

  return (
    <ActSceneLayout
      segmentId={SEGMENT}
      headline={DISPLAY_HEADLINE}
      lead={DISPLAY_LEAD}
      footerNote={shoppingCentreActFooterNote}
      closing={shoppingCentreActClosing}
      closingRecapLine={closingRecapLine}
      destinationNote={assetName}
      clientName={assetName}
      presentationMode={presentationMode}
      view={view}
      onView={dispatch}
      rootModifier=" act--centre"
    >
      <div className="sc-act__beats">
        {shoppingCentreActBeats.map((beat) => (
          <article className="sc-act__beat-card" key={beat.id}>
            <p className="sc-act__owner">{beat.owner}</p>
            {/* `beat.evidence` is deliberately NOT rendered. It restated what
                "Can inform" already says, and the page is a conclusion rather
                than a source list. It stays in the typed content, where the
                tests and the architecture still resolve it. */}
            <h2 className="sc-act__title">{beat.title}</h2>
            <dl className="sc-act__bounds">
              <dt>Can inform</dt>
              <dd>{beat.supports}</dd>
              <dt>Cannot</dt>
              <dd>{beat.cannotSupport}</dd>
            </dl>

            <p className="sc-act__investigation">{beat.investigation}</p>
            <p className="sc-act__decision">
              <span className="sc-act__decision-kicker">A next decision could be</span>
              {beat.nextDecision}
            </p>
          </article>
        ))}
      </div>

      <figure className="sc-act__convergence">
        <Convergence />
      </figure>
    </ActSceneLayout>
  );
}
