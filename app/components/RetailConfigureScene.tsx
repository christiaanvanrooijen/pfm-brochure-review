"use client";

/**
 * Retail Configure — a thin wrapper over the shared Configure presentation.
 *
 * Everything structural (landing and detail layout, direction switching, depth
 * accordions, requirements rendering, proof gating, presentation-mode gating,
 * footer behaviour and `ConfigureViewState` handling) lives in
 * `ConfigureSceneLayout`, so it cannot diverge between segments. Those are the
 * truth-bearing parts, and a second copy of them would be a second place for a
 * proof or privacy rule to drift.
 *
 * What stays here is only what is genuinely Retail: the masthead sentences, the
 * four territory glyphs, and the two video qualifiers. Every string below is
 * unchanged from the frozen implementation.
 */

import type { ReactNode } from "react";
import type { SegmentId } from "../content/types";
import type { SolutionTerritory } from "../content/solution-runtime";
import { ConfigureSceneLayout } from "./ConfigureSceneLayout";
import type { ConfigureViewAction, ConfigureViewState } from "../lib/configure-view";

const SEGMENT: SegmentId = "retail";

/**
 * Presentation-layer masthead copy.
 *
 * The typed governing question in `content/segments/retail.ts` — "What
 * measurement and context do we need to answer this customer's question?" — is
 * the architecture's question, and it is the right one for the model. It is not
 * the right first sentence for a prospect, who has just watched their own store
 * measured end to end and is not yet thinking about measurement design. The
 * typed question is unchanged and is still bound and rendered below the
 * headline, in the presenter's own language.
 */
const DISPLAY_HEADLINE = 'What could this unlock for your stores?';
const DISPLAY_LEAD =
  'You have just seen one location end to end — the street outside, the threshold, the floor inside, and the sale. These are the four directions that story can be taken in.';

/**
 * The qualifying sentence under an explainer video.
 *
 * Two of them, because there are two honest cases. Where the content documents
 * which implementation the footage was recorded with, the sentence has to say
 * that other implementations do not behave identically. Where it documents none
 * — because none is known — the sentence must not imply one, and instead says
 * that the footage is an example of the approach.
 *
 * Both are presentation copy rather than content: they qualify the picture, they
 * do not describe a capability, and neither of them may become a claim.
 */
const VIDEO_NOTE_IMPLEMENTATION =
  'One way this capability is implemented. Other implementations do not produce identical output, and nothing shown here is a measurement, accuracy or coverage claim.';
/** Unchanged from the frozen implementation, moved out of the shared layout. */
const EXPLAINER_PAIR_LEDE =
  "Two ways of measuring this. They answer the same question by different physical means — neither is a default, and the choice is made per store.";

const VIDEO_NOTE_APPROACH =
  'An example of what this measurement looks like in a real store. What a given store would see is designed per site, and nothing shown here is a measurement, accuracy or coverage claim.';

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
 * One glyph per Retail territory. Carries no state and no data.
 *
 * A complete lookup rather than a switch with a default: the default case used
 * to hand the Performance glyph to any territory it did not recognise, which
 * meant another segment would have inherited a chart-like mark implying
 * commercial performance. The artwork itself is unchanged.
 */
const RETAIL_GLYPHS: Readonly<Partial<Record<SolutionTerritory, ReactNode>>> = {
  // A frontage with movement passing it: opportunity that has not entered.
  outside: (
    <svg {...glyphCommon}>
          <path d="M4 26h26" strokeDasharray="1 4" />
          <path d="M9 21V12l8-4 8 4v9" />
          <path d="M14.5 21v-5h5v5" />
          <circle cx="5.5" cy="17" r="1.6" />
          <circle cx="28.5" cy="17" r="1.6" />
        </svg>
  ),
  // The threshold, and the one arrow that crosses it.
  entrance: (
    <svg {...glyphCommon}>
          <path d="M11 6v22" />
          <path d="M23 6v22" />
          <path d="M4 17h13" />
          <path d="M13.5 13.5L17 17l-3.5 3.5" />
          <path d="M23 6h5v22h-5" strokeDasharray="1 4" />
        </svg>
  ),
  // A route through zones, with one stop on it.
  inside: (
    <svg {...glyphCommon}>
          <rect x="4.5" y="5.5" width="25" height="23" />
          <path d="M9 24c0-6 5-5 5-10s6-5 6-1 4 4 5 1" />
          <circle cx="14" cy="14" r="2.2" />
        </svg>
  ),
  // Two measured columns meeting a connected value.
  performance: (
    <svg {...glyphCommon}>
          <path d="M5 28V17" />
          <path d="M12 28V10" />
          <path d="M19 28v-7" />
          <path d="M23 12h7v7" />
          <path d="M30 12l-7 7" />
        </svg>
  ),
};

interface RetailConfigureSceneProps {
  view: ConfigureViewState;
  onView: (action: ConfigureViewAction) => void;
  onNextStage: () => void;
  presentationMode?: boolean;
}

export function RetailConfigureScene({
  view,
  onView,
  onNextStage,
  presentationMode = false,
}: RetailConfigureSceneProps) {
  return (
    <ConfigureSceneLayout
      segmentId={SEGMENT}
      headline={DISPLAY_HEADLINE}
      lead={DISPLAY_LEAD}
      glyphs={RETAIL_GLYPHS}
      videoNoteImplementation={VIDEO_NOTE_IMPLEMENTATION}
      videoNoteApproach={VIDEO_NOTE_APPROACH}
      explainerPairLede={EXPLAINER_PAIR_LEDE}
      view={view}
      onView={onView}
      onNextStage={onNextStage}
      presentationMode={presentationMode}
    />
  );
}

export { RETAIL_GLYPHS, DISPLAY_HEADLINE, DISPLAY_LEAD };
