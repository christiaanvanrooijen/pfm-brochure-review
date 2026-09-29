/**
 * Shopping Centre Act — the four decision beats.
 *
 * WHY THIS IS NOT RETAIL'S MODEL
 *
 * Retail closes with a recap that converges into three next-conversation offers.
 * A shopping centre has just walked four Configure territories, and a second set
 * of offer cards after that is simply another menu. So here the four beats ARE
 * the closing conversation: each names a decision that a real person in the
 * centre's own organisation owns, what the evidence can and cannot carry into
 * it, one question worth investigating, and one example of a next decision.
 *
 * They are grouped by DECISION OWNER, which is a different axis from Configure's
 * measurement scope. The same subjects appear, because they are the subjects the
 * centre has; what changes is who is in the room and what they would decide.
 *
 * THE STANDING BOUNDARY
 *
 * `synthesis.act.decisionOwner` is the literal "human". Nothing in this file may
 * recommend, rank, score, prefer or select. Every `nextDecision` below is an
 * example of a decision a person could take, phrased as something to agree —
 * never as something the experience has concluded on their behalf.
 *
 * [Source: SEGMENT-STORY-ARCHITECTURE.md, Shopping Centre synthesis route;
 *          SALES-EXPERIENCE-DIRECTION.md §23 Act direction]
 */

import type { SceneId, SegmentId } from "./types.ts";

export const shoppingCentreActBeatIds = [
  "sc-act-operating-rhythm",
  "sc-act-space-and-layout",
  "sc-act-leasing-and-mix",
  "sc-act-position-and-reach",
] as const;
export type ShoppingCentreActBeatId = (typeof shoppingCentreActBeatIds)[number];

export interface ActDecisionBeat {
  id: ShoppingCentreActBeatId;
  segment: SegmentId;
  /** The decision, named as a conversation rather than a metric. */
  title: string;
  /** Who in the centre's organisation owns it. Never a PFM role. */
  owner: string;
  /** Which Core scenes inform it. Resolved, never restated. */
  relatedSceneIds: readonly SceneId[];
  /** The evidence in the customer's words, one short line. */
  evidence: string;
  /** What that evidence can carry into the decision. */
  supports: string;
  /** What it cannot, stated as plainly as what it can. */
  cannotSupport: string;
  /** One question worth investigating. Never rhetorical. */
  investigation: string;
  /** One example of a next decision. Owned by a person, not by this page. */
  nextDecision: string;
  sourceRefs: readonly string[];
}

const source = (beat: string): readonly string[] => [
  "SEGMENT-STORY-ARCHITECTURE.md: Shopping Centre synthesis route",
  `SALES-EXPERIENCE-DIRECTION.md: §23 Act direction — ${beat}`,
];

export const shoppingCentreActBeats: readonly ActDecisionBeat[] = [
  {
    id: "sc-act-operating-rhythm",
    segment: "shopping-centre",
    title: "Operating rhythm",
    owner: "Centre / operations manager",
    relatedSceneIds: [
      "shopping-centre-entrances",
      "shopping-centre-visitor-composition",
      "shopping-centre-time-in-centre",
    ],
    evidence: "Entries by entrance and hour, the anonymous mix behind them, and how long visits run.",
    supports: "When the centre is busiest, through which doors, and how the pattern shifts by daypart, event or season.",
    cannotSupport:
      "Whether a longer visit was a better one, anything a visitor felt, any effect on tenant trade — and where parking context is included, a vehicle is still not a visitor.",
    investigation:
      "Do our current cleaning and security shifts match the entrance and daypart pattern we actually observe?",
    nextDecision:
      "Agree a two-week review of shift coverage against the observed rhythm before changing rosters.",
    sourceRefs: source("operating rhythm"),
  },
  {
    id: "sc-act-space-and-layout",
    segment: "shopping-centre",
    title: "Space & layout",
    owner: "Asset / centre management",
    relatedSceneIds: [
      "shopping-centre-internal-circulation",
      "shopping-centre-zone-anchor-exposure",
    ],
    evidence: "Routes between floors and corridors, transitions, and the areas that hold attention.",
    supports: "Where movement concentrates, where it thins, and which areas are reached and dwelled in.",
    cannotSupport:
      "That a busy area is a good one or a quiet one a failure, why anyone moved as they did, or anything at all outside the configured camera coverage.",
    investigation:
      "Is the weak reach of the upper east mall a wayfinding problem or a coverage gap?",
    nextDecision:
      "Agree one wayfinding intervention and a before/after measurement window.",
    sourceRefs: source("space and layout"),
  },
  {
    id: "sc-act-leasing-and-mix",
    segment: "shopping-centre",
    title: "Leasing & mix",
    owner: "Leasing / commercial",
    relatedSceneIds: ["shopping-centre-brand-counting", "shopping-centre-brand-flow"],
    evidence:
      "Anonymous visits to covered unit boundaries, and the sequences between covered tenants.",
    supports:
      "Which units are visited, how visit share compares between them, and which tenants are visited together.",
    cannotSupport:
      "Tenant sales, turnover or spend, whether a unit trades well or badly, or that a sequence between two tenants was a shopping trip with an intention behind it.",
    investigation:
      "Which adjacencies do visits already suggest, and which are we assuming?",
    nextDecision:
      "Agree to bring visitation evidence — not trade assumptions — into the next three lease conversations.",
    sourceRefs: source("leasing and mix"),
  },
  {
    id: "sc-act-position-and-reach",
    segment: "shopping-centre",
    title: "Position & reach",
    owner: "Marketing / asset strategy",
    relatedSceneIds: ["shopping-centre-catchment-area"],
    evidence:
      "Catchment bands, origin mix and travel-time reach, with competitive destinations where that layer is included.",
    supports:
      "How far the centre draws from, which areas are under-represented, and where a positioning conversation might start.",
    cannotSupport:
      "That this describes the people actually measured at the doors — it is aggregate area context, it never replaces entrance measurement, and no origin reading identifies anyone.",
    investigation:
      "Are the areas we market into the same ones our reach evidence describes?",
    nextDecision:
      "Agree one under-represented area to test with a measurable campaign window.",
    sourceRefs: source("position and reach"),
  },
];

/** Where the four threads meet. A question, deliberately, and never a count. */
export const shoppingCentreActConvergence = {
  label: "Your next property question",
  note: "Four conversations, one centre. The decision, and its timing, stay yours.",
  sourceRefs: source("convergence"),
} as const;

export const shoppingCentreActClosing = {
  cta: "Continue the conversation",
  headline: "Let's explore the property question that matters most for this centre.",
  handoff: "Your PFM contact can take the conversation from here.",
  truth:
    "Nothing has been sent, submitted or saved. This is a conversation, and it continues with a person.",
  back: "Back to the decisions",
  sourceRefs: source("closing state"),
} as const;

export const shoppingCentreActFooterNote =
  "Nothing here is recommended, ranked or decided for you. Whichever of these decisions is worth having next, that is the one to have.";
