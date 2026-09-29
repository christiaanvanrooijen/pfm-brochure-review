"use client";

/**
 * Retail Park Act — four decision beats, a vehicle-evidence strip, then one
 * question.
 *
 * The shared frame (masthead, closing state, footer, call to action, capture
 * strip, Escape) lives in `ActSceneLayout` and is shared with Retail and
 * Shopping Centre. What is here is only this segment's middle.
 *
 * WHAT IS THIS SEGMENT'S OWN, AND WHY
 *
 * 1. The four beats are grouped by the person who owns the decision, which is a
 *    different axis from Configure's measurement scope. Same subjects, different
 *    room.
 * 2. There is a vehicle-evidence strip, which Shopping Centre has no need for.
 *    Two of these four decisions rest on vehicle evidence, and the four vehicle
 *    units are not interchangeable. The strip is rendered FROM
 *    `vehicle-semantics.ts` — the labels, the meanings and the boundaries are
 *    read, never retyped — so it cannot drift from the invariant it exists to
 *    hold.
 * 3. Registration origin is shown as unavailable rather than omitted, and its
 *    unavailability is COMPUTED: `vehicleUnitAvailable` is asked whether the
 *    inputs this segment's Core route actually supplies can support it. They
 *    cannot, because it needs licence-plate events and a lawful origin source
 *    that no default scene declares. Omitting the row would hide a branch;
 *    hard-coding "unavailable" would be a claim rather than a fact.
 *
 * Nothing here recommends, ranks, scores or selects. The segment contract's
 * `decisionOwner` is the literal "human", and every next decision on this page
 * is an example a person could choose to take.
 */

import { useMemo, useReducer } from "react";
import type { EvidenceInputId, SegmentId } from "../content/types";
import {
  retailParkActBeats,
  retailParkActClosing,
  retailParkActConvergence,
  retailParkActFooterNote,
  retailParkActVehicleNote,
  retailParkVisitorContrast,
} from "../content/act-retail-park";
import { getSegment } from "../content/runtime";
import { vehicleEvidenceSemantics, vehicleUnitAvailable } from "../content/vehicle-semantics";
import { actViewReducer, initialActViewState } from "../lib/act-view";
import { ActSceneLayout } from "./ActSceneLayout";

const SEGMENT: SegmentId = "retail-park";

const DISPLAY_HEADLINE = "What should we decide next?";
const DISPLAY_LEAD =
  "Four decisions this park owns, and the evidence that can — and cannot — inform each one.";

/**
 * Every evidence input the DEFAULT Retail Park path actually supplies.
 *
 * Read from the Core route's own derived dependencies, so the set is whatever
 * the seven approved scenes declare and nothing else. The advanced
 * vehicle-origin scene is not on the Core route, so its inputs are absent —
 * which is precisely what makes the registration-origin row resolve as
 * unavailable below, without anything on this page asserting it.
 *
 * Computed once at module scope rather than in a hook: it is a fact about the
 * typed content model, not about a render, and it depends on nothing reactive.
 */
const DEFAULT_PATH_INPUTS: readonly EvidenceInputId[] = (() => {
  const segment = getSegment(SEGMENT);
  if (!segment) return [];
  const inputs = new Set<EvidenceInputId>();
  for (const sceneId of segment.coreRoute) {
    const scene = segment.scenes.find((candidate) => candidate.id === sceneId);
    for (const dependency of scene?.derivedDependencies ?? []) {
      for (const id of dependency.requiredInputIds) inputs.add(id);
      for (const group of dependency.alternativeInputGroups ?? []) {
        for (const id of group) inputs.add(id);
      }
    }
  }
  return [...inputs];
})();

/**
 * Where the four threads meet. One node, one question.
 *
 * The same idea as Shopping Centre's, redrawn for this segment: its own beats,
 * its own identifiers, its own CSS modifiers. A park is one asset, so the
 * destination is a question and never a count of locations.
 */
function Convergence() {
  const rowHeight = 32;
  const top = 16;
  const nodeX = 470;
  const nodeY = top + ((retailParkActBeats.length - 1) * rowHeight) / 2;
  const height = top * 2 + (retailParkActBeats.length - 1) * rowHeight;

  return (
    <svg
      className="rp-act__converge"
      viewBox={`0 0 900 ${height}`}
      role="img"
      aria-label={`Four decisions meeting at one question: ${retailParkActConvergence.label}`}
    >
      <g>
        {retailParkActBeats.map((beat, index) => {
          const y = top + index * rowHeight;
          return (
            <g key={beat.id} className={`rp-act__beat rp-act__beat--${beat.id}`}>
              <text className="rp-act__beat-label" x={0} y={y + 4}>
                {beat.title}
              </text>
              <path
                className="rp-act__thread"
                d={`M190 ${y} C 300 ${y}, 360 ${nodeY}, ${nodeX - 8} ${nodeY}`}
                fill="none"
              />
            </g>
          );
        })}
      </g>
      <circle className="rp-act__node" cx={nodeX} cy={nodeY} r={6.5} />
      <text className="rp-act__destination" x={nodeX + 20} y={nodeY - 1}>
        {retailParkActConvergence.label}
      </text>
      <text className="rp-act__destination-note" x={nodeX + 20} y={nodeY + 17}>
        {retailParkActConvergence.note}
      </text>
    </svg>
  );
}

interface RetailParkActSceneProps {
  /** Quiet context only. A park is one asset, so no count is shown. */
  assetName?: string | null;
  presentationMode?: boolean;
}

export function RetailParkActScene({
  assetName = null,
  presentationMode = false,
}: RetailParkActSceneProps) {
  const [view, dispatch] = useReducer(actViewReducer, initialActViewState);

  const closingRecapLine = useMemo(
    () =>
      [...retailParkActBeats.map((beat) => beat.title), retailParkActConvergence.label].join(
        " → ",
      ),
    [],
  );

  return (
    <ActSceneLayout
      segmentId={SEGMENT}
      headline={DISPLAY_HEADLINE}
      lead={DISPLAY_LEAD}
      footerNote={retailParkActFooterNote}
      closing={retailParkActClosing}
      closingRecapLine={closingRecapLine}
      destinationNote={assetName}
      clientName={assetName}
      presentationMode={presentationMode}
      view={view}
      onView={dispatch}
      rootModifier=" act--park"
    >
      <div className="rp-act__beats">
        {retailParkActBeats.map((beat) => (
          <article className="rp-act__beat-card" key={beat.id}>
            <p className="rp-act__owner">{beat.owner}</p>
            {/* `beat.evidence` is deliberately NOT rendered, exactly as in the
                approved Shopping Centre Act: it restates what "Can inform"
                already says, and this page is a conclusion rather than a source
                list. It stays in the typed content, where the tests and the
                architecture still resolve it. */}
            <h2 className="rp-act__title">{beat.title}</h2>
            <dl className="rp-act__bounds">
              <dt>Can inform</dt>
              <dd>{beat.supports}</dd>
              <dt>Cannot</dt>
              <dd>{beat.cannotSupport}</dd>
            </dl>

            <p className="rp-act__investigation">{beat.investigation}</p>
            <p className="rp-act__decision">
              <span className="rp-act__decision-kicker">A next decision could be</span>
              {beat.nextDecision}
            </p>
          </article>
        ))}
      </div>

      {/* -------------------------------------------------------------------
          THE VEHICLE EVIDENCE STRIP

          Rendered from the typed semantics, with the people unit shown beside
          them rather than left as a gap the reader fills in wrongly. A unit the
          default path cannot support is dimmed and labelled, never hidden.
          ------------------------------------------------------------------- */}
      <section className="rp-act__units" aria-label="What the vehicle evidence is, and is not">
        <p className="rp-act__units-note">{retailParkActVehicleNote}</p>
        <ul className="rp-act__unit-list">
          {vehicleEvidenceSemantics.map((semantic) => {
            const available = vehicleUnitAvailable(semantic.unit, DEFAULT_PATH_INPUTS);
            return (
              <li
                className={`rp-act__unit${available ? "" : " rp-act__unit--unavailable"}`}
                key={semantic.unit}
              >
                <p className="rp-act__unit-label">
                  {semantic.label}
                  {!available && (
                    <span className="rp-act__unit-flag">
                      Separate lawful configuration · not part of this design
                    </span>
                  )}
                </p>
                <p className="rp-act__unit-meaning">{semantic.meaning}</p>
                <p className="rp-act__unit-not">
                  <span>Not</span>
                  {semantic.isNot.join(" · ")}
                </p>
              </li>
            );
          })}
          <li className="rp-act__unit rp-act__unit--people">
            <p className="rp-act__unit-label">{retailParkVisitorContrast.label}</p>
            <p className="rp-act__unit-meaning">{retailParkVisitorContrast.meaning}</p>
            <p className="rp-act__unit-not">
              <span>Not</span>
              {retailParkVisitorContrast.isNot.join(" · ")}
            </p>
          </li>
        </ul>
      </section>

      <figure className="rp-act__convergence">
        <Convergence />
      </figure>
    </ActSceneLayout>
  );
}
