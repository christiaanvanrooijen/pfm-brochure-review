"use client";

/**
 * Retail Park Configure — a thin wrapper over the shared Configure
 * presentation.
 *
 * Everything structural and truth-bearing (landing and detail layout, direction
 * switching, depth accordions, requirements rendering, proof gating,
 * presentation-mode gating, footer behaviour and `ConfigureViewState`) lives in
 * `ConfigureSceneLayout` and is shared with Retail and Shopping Centre. None of
 * it is duplicated here: a third copy would be a third place for a proof or
 * privacy rule to drift apart between segments.
 *
 * What lives here is only what is genuinely Retail Park — the masthead
 * sentences, four territory glyphs, the two video qualifiers, the explainer
 * lede, and the terminal sentence for a segment whose Act does not exist yet.
 *
 * Nothing here restates a scene. The four directions, their questions, their
 * boundaries, their capabilities and their evidence all come from the typed
 * model via the shared layout, which resolves them with
 * `getSolutionDirectionsForSegment("retail-park")`.
 *
 * THE BOUNDARIES THIS FILE MUST NOT ERASE
 *
 * No Retail Park scene declares TECH-08, so this segment measures visitation
 * and vehicles and never trade. Nothing in the copy below may promise a sale,
 * turnover, a transaction, conversion, performance or a ranking — and the
 * masthead in particular must not turn a synthesis stage into a
 * recommendation. `recommendationMode` is the literal `"none"`, and this page
 * is exploration: a human decides, and nothing here is selected for them.
 */

import type { ReactNode } from "react";
import type { SegmentId } from "../content/types";
import type { SolutionTerritory } from "../content/solution-runtime";
import { ConfigureSceneLayout } from "./ConfigureSceneLayout";
import type { ConfigureViewAction, ConfigureViewState } from "../lib/configure-view";

const SEGMENT: SegmentId = "retail-park";

/**
 * Presentation-layer masthead copy.
 *
 * The typed governing question — "What measurement and context do we need to
 * answer this park question?" — is the architecture's question and is still
 * bound and rendered below this headline. These two sentences are the
 * prospect's version of it: after seven Core scenes the task changes from
 * reading findings to shaping scope, and the masthead is where that change is
 * announced.
 *
 * "Shape" rather than "choose your solution", and "explore" rather than
 * "recommended": this stage proposes nothing.
 */
const DISPLAY_HEADLINE = "What should we measure to answer the park question?";
const DISPLAY_LEAD =
  "Shape the measurement scope, context and depth that fit the decision you want to explore. Nothing here is selected, scored or recommended for you.";

const VIDEO_NOTE_IMPLEMENTATION =
  "One way this capability is implemented. Other implementations do not produce identical output, and nothing shown here is a measurement, accuracy or coverage claim.";
const VIDEO_NOTE_APPROACH =
  "An example of what this measurement looks like in a real location. What a given park would see is designed per site, and nothing shown here is a measurement, accuracy or coverage claim.";

/**
 * "per site" rather than "per unit": the unit a park's measurement design is
 * decided for is the asset and its car park, not a shop standing on it.
 */
const EXPLAINER_PAIR_LEDE =
  "Two ways of measuring this. They answer the same question by different physical means — neither is a default, and the choice is made per site.";

/**
 * Retail Park has no Act stage yet, so Configure withholds the step-on control
 * and says so. In this segment's own noun: a park, never a centre.
 */
const TERMINAL_NOTE = "This is as far as the retail park journey goes today.";

const glyphCommon = {
  width: 34,
  height: 34,
  viewBox: "0 0 34 34",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/**
 * One glyph per Retail Park territory. Carries no state and no data.
 *
 * A complete lookup, with no fallback: the shared layout renders nothing for a
 * territory that has no entry, and the tests assert this set covers every
 * territory the segment declares. A fallback would hand one territory's mark to
 * another and quietly imply a relationship the model does not declare.
 *
 * Each mark is a line drawing of a physical situation, never a data display —
 * no bars, no gauge, no arrow that could read as growth, and nothing that
 * orders one thing above another.
 */
const RETAIL_PARK_GLYPHS: Readonly<Partial<Record<SolutionTerritory, ReactNode>>> = {
  // Arrival & parking: a barrier arm at an entry point, and the bays beyond it.
  // Two distinct things in one mark, because the territory holds two distinct
  // readings — the crossing, and the standing. No dial and no fill level: an
  // occupancy needs a defined capacity before it can be drawn as a share, and
  // the glyph must not promise one.
  vehicles: (
    <svg {...glyphCommon}>
      <path d="M4.5 21.5v-9" />
      <path d="M4.5 15h11" />
      <path d="M19.5 12.5h10v9h-10z" />
      <path d="M23 12.5v9" />
      <path d="M26 12.5v9" />
    </svg>
  ),
  // Units & visitation: three units in a parade under one continuous roofline,
  // with a single visit crossing one threshold. One arrow, into one unit — not
  // a comparison between them, and no unit drawn larger or brighter than
  // another.
  units: (
    <svg {...glyphCommon}>
      <path d="M4.5 14.5h25v12h-25z" />
      <path d="M13 14.5v12" />
      <path d="M21 14.5v12" />
      <path d="M3 14.5l3.5-5h21l3.5 5" />
      <path d="M17 28.5v-4.5" />
      <path d="M15.3 25.7L17 24l1.7 1.7" />
    </svg>
  ),
  // Movement & dwell: two covered units with a dashed link between them for a
  // sequence, and below them a measured span with two end ticks for elapsed
  // time. Dashed rather than solid, because the link is a matched pair of
  // observations and not a followed path. A span rather than an arc or a clock
  // face, because a duration is the distance between two moments — an arc with
  // a mark rising from its centre reads as a dial with a needle, which is a
  // reading taken off an instrument and is exactly the wrong idea here.
  dwell: (
    <svg {...glyphCommon}>
      <path d="M4.5 8.5h8v7h-8z" />
      <path d="M21.5 8.5h8v7h-8z" />
      <path d="M12.5 12h9" strokeDasharray="1 3" />
      <path d="M7 21.5v6" />
      <path d="M27 21.5v6" />
      <path d="M7 24.5h20" />
    </svg>
  ),
  // Catchment & demand: the park as a single mark, with open travel-time
  // contours around it and one separate destination out at the edge. Open,
  // uneven arcs rather than closed concentric rings, so it reads as area
  // reached rather than as a target being aimed at, and the second destination
  // sits outside the arcs because a competing park is context, not coverage.
  catchment: (
    <svg {...glyphCommon}>
      <path d="M13 21v-6.5h8V21z" />
      <path d="M11.5 14.5l2.5-4h6l2.5 4" />
      <path d="M8.5 25a9.5 9.5 0 0 1 0-13" />
      <path d="M25.5 25a9.5 9.5 0 0 0 0-13" />
      <path d="M4 28.5A15 15 0 0 1 5.5 8" />
      <circle cx="28.5" cy="6.5" r="2" />
    </svg>
  ),
};

interface RetailParkConfigureSceneProps {
  view: ConfigureViewState;
  onView: (action: ConfigureViewAction) => void;
  onNextStage: () => void;
  presentationMode?: boolean;
  /**
   * Defaults to false, unlike the other two segments. Retail Park has no Act
   * stage: the control is withheld rather than pointed at Retail's Act, which
   * would walk a park into a store's page.
   */
  showNextStage?: boolean;
}

export function RetailParkConfigureScene({
  view,
  onView,
  onNextStage,
  presentationMode = false,
  showNextStage = false,
}: RetailParkConfigureSceneProps) {
  return (
    <ConfigureSceneLayout
      segmentId={SEGMENT}
      headline={DISPLAY_HEADLINE}
      lead={DISPLAY_LEAD}
      glyphs={RETAIL_PARK_GLYPHS}
      videoNoteImplementation={VIDEO_NOTE_IMPLEMENTATION}
      videoNoteApproach={VIDEO_NOTE_APPROACH}
      explainerPairLede={EXPLAINER_PAIR_LEDE}
      view={view}
      onView={onView}
      onNextStage={onNextStage}
      presentationMode={presentationMode}
      showNextStage={showNextStage}
      terminalNote={TERMINAL_NOTE}
    />
  );
}

export { RETAIL_PARK_GLYPHS, DISPLAY_HEADLINE, DISPLAY_LEAD, TERMINAL_NOTE };
