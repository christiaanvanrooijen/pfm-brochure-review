"use client";

import { useMemo, useReducer } from "react";
import type { SegmentId } from "../content/types";
import {
  actClosing,
  actConvergence,
  actRecapBeats,
  getOfferableActDirections,
  type ActAudience,
  type ActDirectionId,
} from "../content/act-runtime";
import {
  actViewReducer,
  initialActViewState,
  resolveVisibleActDirection,
} from "../lib/act-view";

import { ActSceneLayout } from "./ActSceneLayout";

const SEGMENT: SegmentId = "retail";

interface RetailActSceneProps {
  /**
   * The fictional client this session is being presented to, taken from the
   * session state the top bar already shows. Null in a non-account session, in
   * which case the convergence stays about "your locations" and names nobody.
   */
  clientName: string | null;
  locationCount: number;
  presentationMode?: boolean;
}

/**
 * Presentation-layer masthead copy.
 *
 * Same mechanism, and the same reason, as Configure's `DISPLAY_HEADLINE`. The
 * typed governing question in `content/segments/retail.ts` — "What should we
 * explore, test or agree next?" — is the architecture's question and is
 * unchanged; it is still bound and rendered below the headline. It is not the
 * right first sentence for a prospect at the end of a brochure, because it asks
 * them to plan before it has invited them to talk.
 *
 * "Where could we start?" was chosen over the two alternatives because it is the
 * only one of the three that is a genuine opening rather than a closing: it
 * assumes a next conversation without asking for a commitment, it puts "we"
 * before "you", and it is short enough to sit on one line at every supported
 * width.
 */
const DISPLAY_HEADLINE = "Where could we start?";
const DISPLAY_LEAD =
  "Start with the question that matters most — and make it measurable.";

/* --------------------------------------------------------------------------
   THE CONVERGENCE

   One visual conclusion, not the journey shown again. Configure laid the four
   territories out in parallel, along a spine; Act resolves them into a single
   line. Nothing here carries a value, a KPI or a measurement — every number the
   prospect has seen stays in the scene that measured it.
   -------------------------------------------------------------------------- */

/**
 * Geometry for the convergence figure. Presentational only.
 *
 * Two variants of the same figure rather than one figure scaled down: the
 * compact variant shortens the viewBox and closes the gap between the beats,
 * so the type stays the same size on screen. Scaling the whole SVG instead
 * would shrink the labels along with it, which is exactly what a closing
 * statement must not do.
 */
const CONVERGE = {
  width: 1040,
  height: 200,
  compactHeight: 152,
  firstRow: 26,
  rowGap: 48,
  compactRowGap: 36,
  lineStart: 214,
  nodeX: 640,
  labelX: 676,
} as const;

function Convergence({
  destinationLabel,
  destinationNote,
  compact = false,
}: {
  destinationLabel: string;
  destinationNote: string | null;
  compact?: boolean;
}) {
  const height = compact ? CONVERGE.compactHeight : CONVERGE.height;
  const rowGap = compact ? CONVERGE.compactRowGap : CONVERGE.rowGap;
  const nodeY = height / 2;

  return (
    <svg
      className="act__converge"
      viewBox={`0 0 ${CONVERGE.width} ${height}`}
      role="img"
      aria-label={`The four beats of the story — ${actRecapBeats
        .map((beat) => beat.from)
        .join(", ")} — converging into ${destinationLabel}`}
    >
      {actRecapBeats.map((beat, index) => {
        const y = CONVERGE.firstRow + index * rowGap;
        return (
          <g key={beat.territory} className={`act__beat act__beat--${beat.territory}`}>
            <text className="act__beat-from" x={0} y={y}>
              {beat.from}
            </text>
            <text className="act__beat-to" x={0} y={y + 15}>
              {beat.to}
            </text>
            <path
              className="act__thread"
              style={{ animationDelay: `${index * 90}ms` }}
              pathLength={1}
              d={`M ${CONVERGE.lineStart} ${y - 4} C ${CONVERGE.lineStart + 190} ${
                y - 4
              }, ${CONVERGE.nodeX - 150} ${nodeY}, ${CONVERGE.nodeX} ${nodeY}`}
            />
          </g>
        );
      })}

      <circle className="act__node" cx={CONVERGE.nodeX} cy={nodeY} r={6.5} />
      <text className="act__destination" x={CONVERGE.labelX} y={nodeY - 2}>
        {destinationLabel}
      </text>
      {destinationNote && (
        <text
          className="act__destination-note"
          x={CONVERGE.labelX}
          y={nodeY + 20}
        >
          {destinationNote}
        </text>
      )}
    </svg>
  );
}

export function RetailActScene({
  clientName,
  locationCount,
  presentationMode = false,
}: RetailActSceneProps) {
  const [view, dispatch] = useReducer(actViewReducer, initialActViewState);

  const audience: ActAudience = presentationMode ? "presentation" : "sales";

  const offerable = useMemo(
    () => getOfferableActDirections(SEGMENT, audience),
    [audience],
  );

  // Resolved at render time, not trusted from when the paragraph was opened:
  // a direction expanded in Sales Mode must not survive a switch into
  // Presentation Mode if the prospect is not allowed to see it.
  const isOfferable = (directionId: ActDirectionId) =>
    offerable.some((item) => item.direction.id === directionId);
  const visibleDirectionId = resolveVisibleActDirection(view, isOfferable);
  const visible = offerable.find((item) => item.direction.id === visibleDirectionId);

  // The customer stays the hero of the convergence: the story resolves into
  // their locations, not into PFM's solution. The client comes from the session
  // state the top bar already shows — no second reference is invented here.
  const destinationNote = clientName
    ? `${clientName} · ${locationCount} locations`
    : `Your ${locationCount} locations`;

  const recapLine = [
    ...actRecapBeats.map((beat) => beat.from),
    actConvergence.label,
  ].join(" → ");

  return (
    <ActSceneLayout
      segmentId={SEGMENT}
      headline={DISPLAY_HEADLINE}
      lead={DISPLAY_LEAD}
      footerNote="Nothing here is recommended, ranked or decided for you. Whichever of these is worth a conversation, that is the one to have."
      closing={actClosing}
      closingRecapLine={recapLine}
      destinationNote={destinationNote}
      clientName={clientName}
      presentationMode={presentationMode}
      view={view}
      onView={dispatch}
      rootModifier={visible ? " act--detail" : ""}
    >
      <figure className="act__convergence">
        <Convergence
          destinationLabel={actConvergence.label}
          destinationNote={destinationNote}
          compact={Boolean(visible)}
        />
        <figcaption className="act__convergence-note">
          {actConvergence.note}
        </figcaption>
      </figure>

      <div className="act__directions">
            {offerable.map(({ direction, internalStatusNote }) => {
              const isOpen = visibleDirectionId === direction.id;
              return (
                <button
                  type="button"
                  key={direction.id}
                  className={`act__direction${isOpen ? " is-open" : ""}`}
                  aria-expanded={isOpen}
                  onClick={() =>
                    dispatch({ type: "TOGGLE_DIRECTION", directionId: direction.id })
                  }
                >
                  <span className="act__direction-kicker">{direction.kicker}</span>
                  <span className="act__direction-title">{direction.title}</span>
                  <span className="act__direction-lead">{direction.lead}</span>
                  {/* Quiet internal context, never shown to a prospect. The
                      direction itself is already withheld in Presentation
                      Mode when nothing is approved, so this line can only
                      ever be read by a presenter. */}
                  {internalStatusNote && (
                    <span className="act__direction-status">{internalStatusNote}</span>
                  )}
                  <span className="act__direction-more">
                    {isOpen ? "Close" : "Tell me more"}
                    <span aria-hidden="true">{isOpen ? " ×" : " ›"}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {visible && (
            <section
              className="act__detail"
              aria-label={visible.direction.kicker}
            >
              <header className="act__detail-head">
                <h2>{visible.direction.title}</h2>
                <button
                  type="button"
                  className="act__detail-close"
                  onClick={() => dispatch({ type: "CLOSE_DIRECTION" })}
                >
                  Close <span aria-hidden="true">×</span>
                </button>
              </header>
              <ul className="act__detail-list">
                {visible.direction.detail.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="act__detail-boundary">{visible.direction.boundaryNote}</p>
            </section>
          )}
    </ActSceneLayout>
  );
}
