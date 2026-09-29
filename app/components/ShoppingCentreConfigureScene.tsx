"use client";

/**
 * Shopping Centre Configure — a thin wrapper over the shared Configure
 * presentation.
 *
 * Everything structural and truth-bearing (landing and detail layout, direction
 * switching, depth accordions, requirements rendering, proof gating,
 * presentation-mode gating, footer behaviour and `ConfigureViewState`) lives in
 * `ConfigureSceneLayout` and is shared with Retail. None of it is duplicated
 * here: a second copy would be a second place for a proof or privacy rule to
 * drift apart between segments.
 *
 * What lives here is only what is genuinely Shopping Centre — the masthead
 * sentences, four territory glyphs and the two video qualifiers.
 *
 * THE ONE BOUNDARY THIS FILE MUST HOLD
 *
 * No Shopping Centre scene declares TECH-08 (business data connection), so this
 * segment measures visitation and never trade. Nothing in the copy below may
 * promise a store, a sale, turnover, a transaction, conversion or performance.
 * Configure here is about choosing a measurement approach, not about promising
 * an outcome.
 */

import type { ReactNode } from "react";
import type { SegmentId } from "../content/types";
import type { SolutionTerritory } from "../content/solution-runtime";
import { ConfigureSceneLayout } from "./ConfigureSceneLayout";
import type { ConfigureViewAction, ConfigureViewState } from "../lib/configure-view";

const SEGMENT: SegmentId = "shopping-centre";

/**
 * Presentation-layer masthead copy.
 *
 * The typed governing question — "What measurement and context do we need to
 * answer this centre question?" — is the architecture's question and is still
 * bound and rendered below this headline. These two sentences are the prospect's
 * version of it: after eight Core scenes the task changes from reading findings
 * to choosing scope, and the masthead is where that change is announced.
 */
const DISPLAY_HEADLINE = "What should we measure to answer the centre question?";
const DISPLAY_LEAD =
  "Choose the measurement scope, context and depth that fit the decision you want to explore.";

const VIDEO_NOTE_IMPLEMENTATION =
  "One way this capability is implemented. Other implementations do not produce identical output, and nothing shown here is a measurement, accuracy or coverage claim.";
const VIDEO_NOTE_APPROACH =
  "An example of what this measurement looks like in a real centre. What a given centre would see is designed per site, and nothing shown here is a measurement, accuracy or coverage claim.";

/**
 * "per site" rather than "per store": the unit a centre's measurement design is
 * decided for is the asset, not a shop inside it.
 */
const EXPLAINER_PAIR_LEDE =
  "Two ways of measuring this. They answer the same question by different physical means — neither is a default, and the choice is made per site.";

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
 * One glyph per Shopping Centre territory. Carries no state and no data.
 *
 * A complete lookup, with no fallback: the shared layout renders nothing for a
 * territory that has no entry, and the tests assert this set covers every
 * territory the segment declares. The previous switch-with-default handed the
 * Retail performance glyph to anything it did not recognise, which would have
 * put a chart-like mark implying commercial performance on all four of these.
 *
 * Each mark is a line drawing of a physical situation, never a data display.
 */
const SHOPPING_CENTRE_GLYPHS: Readonly<Partial<Record<SolutionTerritory, ReactNode>>> = {
  // Visits & rhythm: an opening, and the uneven pulse of arrivals through it
  // over a day. A continuous rhythm line rather than bars, and no clock face —
  // the territory is about visits and their timing, not about a stopwatch.
  arrival: (
    <svg {...glyphCommon}>
      <path d="M10 5v15" />
      <path d="M24 5v15" />
      <path d="M4 26h3l2.5-5 3 8 3-11 3 8 2.5-5h9" />
    </svg>
  ),
  // Movement & space: two floor plates of the asset, and one route threading
  // between them through a single connection. Not a full route map, and not a
  // heatmap — one relationship, drawn once.
  movement: (
    <svg {...glyphCommon}>
      <path d="M4.5 8.5h13v7h-13z" />
      <path d="M16.5 18.5h13v7h-13z" />
      <path d="M11 15.5v3.5a3 3 0 0 0 3 3h2.5" />
      <circle cx="23" cy="22" r="1.5" />
    </svg>
  ),
  // Tenant & brand: three units side by side on a mall frontage, sharing party
  // walls, with one visit crossing from one unit to its neighbour. No ranking,
  // no logo treatment, no funnel.
  tenancy: (
    <svg {...glyphCommon}>
      <path d="M4.5 13.5h25v13h-25z" />
      <path d="M13 13.5v13" />
      <path d="M21 13.5v13" />
      <path d="M4.5 13.5l3-6h19l3 6" />
      <path d="M8.5 21h9" strokeDasharray="1 3" />
    </svg>
  ),
  // Reach & positioning: the asset, and the travel-time contours around it.
  // Open, uneven arcs rather than closed concentric circles, so it reads as
  // geography reached rather than as a target being aimed at.
  reach: (
    <svg {...glyphCommon}>
      <path d="M14 20.5v-5l3.5-2.5 3.5 2.5v5z" />
      <path d="M9.5 24a10 10 0 0 1 .5-13.5" />
      <path d="M25.5 24a10 10 0 0 0 .5-13.5" />
      <path d="M5 27.5A15.5 15.5 0 0 1 7 7" />
      <path d="M30 27.5A15.5 15.5 0 0 0 28 7" />
    </svg>
  ),
};

interface ShoppingCentreConfigureSceneProps {
  view: ConfigureViewState;
  onView: (action: ConfigureViewAction) => void;
  onNextStage: () => void;
  presentationMode?: boolean;
  showNextStage?: boolean;
}

export function ShoppingCentreConfigureScene({
  view,
  onView,
  onNextStage,
  presentationMode = false,
  showNextStage = true,
}: ShoppingCentreConfigureSceneProps) {
  return (
    <ConfigureSceneLayout
      segmentId={SEGMENT}
      headline={DISPLAY_HEADLINE}
      lead={DISPLAY_LEAD}
      glyphs={SHOPPING_CENTRE_GLYPHS}
      videoNoteImplementation={VIDEO_NOTE_IMPLEMENTATION}
      videoNoteApproach={VIDEO_NOTE_APPROACH}
      explainerPairLede={EXPLAINER_PAIR_LEDE}
      view={view}
      onView={onView}
      onNextStage={onNextStage}
      presentationMode={presentationMode}
      showNextStage={showNextStage}
    />
  );
}

export { SHOPPING_CENTRE_GLYPHS, DISPLAY_HEADLINE, DISPLAY_LEAD };
