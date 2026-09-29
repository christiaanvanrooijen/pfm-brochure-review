/**
 * Retail Park Act — the four decision beats.
 *
 * WHY THIS IS NOT A COPY OF SHOPPING CENTRE'S MODEL
 *
 * The shape is shared — four decisions, each grouped by the person who owns it,
 * each stating what the evidence can and cannot carry — because that shape is
 * the honest one after a Configure stage. The content is not shared, and could
 * not be: a retail park's decisions are taken by people looking at a car park, a
 * parade of units and a catchment, not at a mall's floors and anchors. A centre
 * has no vehicle evidence at its heart; this segment's first decision is made of
 * almost nothing else.
 *
 * THE STANDING BOUNDARY
 *
 * `synthesis.act.decisionOwner` is the literal "human". Nothing in this file may
 * recommend, rank, score, prefer or select. Every `nextDecision` is an example
 * of a decision a person could take, phrased as something to agree — never as
 * something this experience has concluded on their behalf.
 *
 * THE SIX BOUNDARIES THIS FILE MUST NOT LOSE
 *
 * Act is the last page, which makes it the easiest place to quietly upgrade a
 * measurement into a business claim. Each `cannotSupport` below carries the
 * boundary its own beat could otherwise cross:
 *
 *   - a vehicle is not a visitor, and an arrival is not an occupancy;
 *   - occupancy is unreadable without an agreed capacity;
 *   - a unit visit is not a person, a vehicle, a sale or a transaction;
 *   - exposure ranks nothing, and outside coverage is unknown, not zero;
 *   - a sequence is an order, never an identity or a cause;
 *   - time on site is a visitor duration, not vehicle dwell.
 *
 * The four vehicle units themselves — count, visit, dwell, registration origin —
 * are NOT restated here. They are declared once in `vehicle-semantics.ts` and
 * rendered from it, so this file cannot drift from that invariant.
 *
 * [Source: SEGMENT-STORY-ARCHITECTURE.md, Retail Park synthesis route;
 *          SALES-EXPERIENCE-DIRECTION.md §23 Act direction]
 */

import type { ActDecisionBeat } from "./act-shopping-centre.ts";
import type { SceneId } from "./types.ts";

export const retailParkActBeatIds = [
  "rp-act-access-and-parking",
  "rp-act-unit-mix-and-leasing",
  "rp-act-layout-and-adjacency",
  "rp-act-position-and-catchment",
] as const;
export type RetailParkActBeatId = (typeof retailParkActBeatIds)[number];

/**
 * The beat shape is shared with Shopping Centre rather than redeclared. The
 * fields are the same questions — who owns this, what can it carry, what can it
 * not — and a second copy of the interface would be a second place for a
 * boundary field to be quietly dropped. Only the id union is this segment's.
 */
export type RetailParkActDecisionBeat = Omit<ActDecisionBeat, "id"> & {
  id: RetailParkActBeatId;
};

const source = (beat: string): readonly string[] => [
  "SEGMENT-STORY-ARCHITECTURE.md: Retail Park synthesis route",
  `SALES-EXPERIENCE-DIRECTION.md: §23 Act direction — ${beat}`,
];

export const retailParkActBeats: readonly RetailParkActDecisionBeat[] = [
  {
    id: "rp-act-access-and-parking",
    segment: "retail-park",
    title: "Access & parking",
    owner: "Park / operations management",
    relatedSceneIds: ["retail-park-vehicle-arrival", "retail-park-parking-occupancy"],
    evidence:
      "Vehicle arrivals across the day, and how much of an agreed parking capacity is in use.",
    supports:
      "When traffic reaches the park, where pressure builds across parking zones, and how both shift by day and daypart.",
    // Three boundaries, because this beat could cross three: people from
    // vehicles, occupancy from arrivals, and a share from an undefined total.
    cannotSupport:
      "How many people arrived — a vehicle is not a visitor. An arrival is not an occupancy, and an occupancy is not readable at all until a capacity and its zones are agreed. Nothing here says why anyone came.",
    investigation:
      "Does parking pressure peak when we assume it peaks, and is that assumption built on anything we have actually observed?",
    nextDecision:
      "Agree one arrival and occupancy window to observe before changing signage, staffing or access arrangements.",
    sourceRefs: source("access and parking"),
  },
  {
    id: "rp-act-unit-mix-and-leasing",
    segment: "retail-park",
    title: "Unit mix & leasing",
    owner: "Leasing / commercial",
    relatedSceneIds: ["retail-park-unit-visits", "retail-park-unit-category-exposure"],
    evidence:
      "Anonymous visits to covered unit boundaries, and how exposure varies across units and the categories they sit in.",
    supports:
      "Which covered units are visited and when, and how exposure differs between units and between categories.",
    // The unknown-not-zero sentence is repeated from Scene 7 on purpose: it is
    // the single easiest thing to lose on a page whose job is to conclude.
    cannotSupport:
      "Tenant trade of any kind — a unit visit is not a person, a vehicle, a sale or a transaction. Exposure ranks nothing, and a unit outside coverage has unknown exposure rather than none.",
    investigation:
      "Which units are we treating as quiet, and which are simply outside coverage?",
    nextDecision:
      "Agree which units are inside coverage before the next round of lease conversations, so an unknown is never read as a low number.",
    sourceRefs: source("unit mix and leasing"),
  },
  {
    id: "rp-act-layout-and-adjacency",
    segment: "retail-park",
    title: "Layout & adjacency",
    owner: "Asset / property management",
    relatedSceneIds: ["retail-park-cross-visitation", "retail-park-time-on-site"],
    evidence:
      "Sequences between covered units, and how long a visit to the park lasts within configured coverage.",
    supports:
      "Which covered units are visited in the same trip, in what order, and how visit duration is distributed across a day.",
    cannotSupport:
      "Why anyone moved as they did — a sequence is an order, never a cause, an identity or a recognised shopper. Time on site is a visitor duration and is not how long a vehicle stood in the car park.",
    investigation:
      "Are the adjacencies we designed the ones visits actually follow, or the ones we expected them to follow?",
    nextDecision:
      "Agree one adjacency or wayfinding change, and the observation window either side of it.",
    sourceRefs: source("layout and adjacency"),
  },
  {
    id: "rp-act-position-and-catchment",
    segment: "retail-park",
    title: "Position & catchment",
    owner: "Marketing / asset strategy",
    relatedSceneIds: ["retail-park-catchment-area"],
    evidence:
      "Catchment reach and the area context around the park, from an approved aggregate source.",
    supports:
      "How far the park draws from, which areas are under-represented in that reach, and where a positioning conversation might start.",
    // Registration origin is named here only to be denied. It belongs to an
    // advanced, separately configured branch that is not on this path, and the
    // denial is the whole reason it is mentioned at all.
    cannotSupport:
      "That this describes the people measured at the park — it is aggregate area context and never replaces what the asset itself measures. Where a lawful registration-origin branch is separately configured, a registration country is where a vehicle is registered, never where a person lives.",
    investigation:
      "Are the areas we market into the same ones our reach evidence actually describes?",
    nextDecision:
      "Agree one under-represented area to test inside a measurable window, before committing to a campaign.",
    sourceRefs: source("position and catchment"),
  },
];

/**
 * Where the four threads meet. A question, deliberately, and never a count.
 *
 * The note is rendered as a single SVG <text>, which does not wrap: it is kept
 * short enough to fit the 900-unit viewBox at 11.5px rather than trusting it to.
 */
export const retailParkActConvergence = {
  label: "Your next property question",
  note: "Four conversations, one park. The choice stays yours.",
  sourceRefs: source("convergence"),
} as const;

export const retailParkActClosing = {
  cta: "Continue the conversation",
  headline: "Let's explore the property question that matters most for this park.",
  handoff: "Your PFM contact can take the conversation from here.",
  truth:
    "Nothing has been sent, submitted or saved. This is a conversation, and it continues with a person.",
  back: "Back to the decisions",
  sourceRefs: source("closing state"),
} as const;

export const retailParkActFooterNote =
  "Nothing here is recommended, ranked or decided for you. Whichever of these decisions is worth having next, that is the one to have.";

/**
 * The lede above the vehicle-evidence strip.
 *
 * The strip's own rows are rendered from `vehicle-semantics.ts`. This sentence
 * says why they are on a decision page: two of this segment's four beats rest on
 * vehicle evidence, and the units are not interchangeable.
 */
export const retailParkActVehicleNote =
  "Two of these decisions rest on vehicle evidence. These are not four names for one number, and the last of them is not part of this measurement design.";

/**
 * The contrast row on the vehicle strip.
 *
 * The four vehicle units are rendered from `vehicle-semantics.ts`. A strip of
 * four vehicle units and nothing else invites the reader to fill the gap
 * themselves, and the gap they fill it with is people. So the people unit is
 * shown beside them, named as the different thing it is.
 *
 * It is declared here rather than added to `vehicle-semantics.ts` because it is
 * not a vehicle semantic: putting it in that list would make
 * `resolvesAsPeopleEvidence` and `vehicleUnitAvailable` answer for a unit they
 * were built to keep separate.
 */
export const retailParkVisitorContrast = {
  label: "Visitor visit",
  meaning:
    "A person's visit to the park, measured anonymously at covered units and shared areas.",
  isNot: [
    "Derivable from any vehicle number",
    "The same thing as a vehicle visit or a vehicle dwell",
  ],
  sourceRefs: source("vehicle and visitor units"),
} as const;
