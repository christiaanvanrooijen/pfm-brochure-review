/**
 * How the shell runs one segment's journey.
 *
 * WHY THIS EXISTS
 *
 * `CommercialExperience` was written when Retail was the only vertical, so it
 * read its scenes with `getScenesForStage("retail", …)`, rendered
 * `<RetailConfigureScene>` directly, and labelled the rail in Retail's own
 * vocabulary. Adding a second segment by scattering ternaries through that file
 * would leave the Retail path entangled with a segment it has nothing to do
 * with. This is the one place a segment's journey differs, so the shell can ask
 * a question instead of testing an id.
 *
 * WHAT IT DOES NOT DO
 *
 * It holds no scene content, no route and no capability: those come from the
 * typed content model, which already knows every segment. What lives here is
 * only what the SHELL needs to run a journey — which stages a presenter may
 * stand in, what the rail calls them, and which Configure wrapper to render.
 */

import type { SegmentId } from "../content/types";
import type { StageId } from "./types";

export interface SegmentJourneyConfig {
  segmentId: SegmentId;
  /** Rail label under each canonical stage name, in this segment's language. */
  stageDescriptors: Record<StageId, string>;
  /**
   * The stages a presenter may actually stand in.
   *
   * The rail always shows all six canonical stages — the architecture does not
   * change per segment — but a stage with no content is not a place to go. A
   * stage left out here renders as a visible, non-navigable marker rather than
   * as a dead step that leads to an empty panel.
   */
  navigableStages: readonly StageId[];
  /** Which segment's Configure wrapper the shell renders. */
  configureVariant: "retail" | "shopping-centre";
  /** Which segment's Act wrapper the shell renders. */
  actVariant: "retail" | "shopping-centre";
  /**
   * Whether Configure hands on to Act.
   *
   * False where that segment's Act does not exist yet: the Configure CTA is then
   * withheld rather than pointed at another segment's Act. Both segments now
   * have one, so both hand on — but the flag stays, because the next segment to
   * be built will not.
   */
  configureHandsOnToAct: boolean;
  /** Top-bar label when no account is selected. */
  explorationLabel: string;
}

/**
 * Retail — unchanged. Every value here restates what the shell already did, so
 * the frozen journey behaves exactly as before.
 */
const retail: SegmentJourneyConfig = {
  segmentId: "retail",
  stageDescriptors: {
    context: "Outside",
    measure: "Entrance",
    understand: "Inside",
    prove: "Performance",
    configure: "Solution",
    act: "Next step",
  },
  navigableStages: ["context", "measure", "understand", "prove", "configure", "act"],
  configureVariant: "retail",
  actVariant: "retail",
  configureHandsOnToAct: true,
  explorationLabel: "Retail exploration",
};

/**
 * Shopping Centre.
 *
 * Two labels differ from Retail's, and both are truth corrections rather than
 * taste. "Inside" is a store's word for its own floor; a centre's Understand
 * stage covers circulation, zones, anchors and tenants across a whole asset, so
 * it is "Centre". "Performance" names a territory this segment does not have —
 * no Shopping Centre scene declares business-data connection, and
 * `stageMapping.prove` is empty — so Prove is "Evidence", which describes the
 * canonical stage without implying a performance scene exists behind it.
 *
 * Prove is not navigable: `stageMapping.prove` is empty for this segment, so
 * there is nothing to stand in. It remains visible on the rail because the
 * canonical journey is the same six stages for every segment. Act became
 * navigable once this segment had one of its own.
 */
const shoppingCentre: SegmentJourneyConfig = {
  segmentId: "shopping-centre",
  stageDescriptors: {
    context: "Outside",
    measure: "Entrance",
    understand: "Centre",
    prove: "Evidence",
    configure: "Solution",
    act: "Next step",
  },
  navigableStages: ["context", "measure", "understand", "configure", "act"],
  configureVariant: "shopping-centre",
  actVariant: "shopping-centre",
  configureHandsOnToAct: true,
  explorationLabel: "Shopping Centre exploration",
};

const journeys: Record<string, SegmentJourneyConfig> = {
  retail,
  "shopping-centre": shoppingCentre,
};

/** Every segment the shell can currently run, in presentation order. */
export const shellJourneys: readonly SegmentJourneyConfig[] = [retail, shoppingCentre];

export function getSegmentJourney(segmentId: SegmentId): SegmentJourneyConfig {
  return journeys[segmentId] ?? retail;
}

export function shellCanRunSegment(segmentId: SegmentId): boolean {
  return segmentId in journeys;
}

/**
 * Whether a presenter here and now can actually run this segment in the shell.
 *
 * Two questions the shell has always asked together, extracted because a second
 * caller appeared and the two must never answer differently.
 * `implementation_ready` is a PRODUCT claim — a complete demo vertical — while
 * `shellCanRunSegment` is the smaller, technical fact of whether a journey
 * config exists. Outside production the shell offers both; production offers
 * only what is genuinely ready.
 *
 * The segment overview asks this to decide where a card LEADS. That is the
 * reason it has to be one function: a card that reads "full journey" and opens
 * a single scene is the exact drift the overview was built to avoid, and it
 * happens the moment these two rules are written out twice.
 */
export function shellRunsSegment(segment: {
  id: SegmentId;
  implementationStatus: string;
}): boolean {
  if (segment.implementationStatus === "implementation_ready") return true;
  return shellCanRunSegment(segment.id) && process.env.NODE_ENV !== "production";
}
