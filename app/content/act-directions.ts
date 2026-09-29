/**
 * Act — the typed content behind the closing stage.
 *
 * WHAT THIS IS
 *
 * Act is the sixth and final canonical stage, and it is a synthesis stage:
 * `stageMapping.act` is empty and must stay empty. What the prospect meets here
 * is therefore not a scene and not a matrix row — it is the convergence of the
 * story they have just walked, plus a small number of *next-conversation
 * directions*: ways the conversation can continue, phrased as conversations
 * rather than as actions a system performs.
 *
 * WHAT THIS IS NOT
 *
 * - Not a lead form, a booking widget or a contact capture. Act carries no
 *   field a prospect could type into and no control that sends anything.
 * - Not a quote, proposal, pricing or configuration step. Nothing here is
 *   selected, scored, saved or priced, and no direction resolves to a package.
 * - Not a second Configure. The four depth questions (how we do this, what is
 *   needed, privacy, see it in practice per direction) stay under Configure.
 *   Act links back to that depth by leaving it exactly where it was.
 * - Not a recommendation model. The segment's `synthesis.act.decisionOwner` is
 *   the literal `"human"`, and this content carries no field that could rank,
 *   score or prefer one direction over another.
 * - Not a new truth for proof. "See it in practice" is resolved at query time
 *   from `proof-runtime.ts` under the same permission gate Configure uses, and
 *   is withheld entirely from a prospect when nothing is approved.
 *
 * [Source: SALES-EXPERIENCE-DIRECTION.md §23 Act direction;
 *          SEGMENT-STORY-ARCHITECTURE.md, Configure and Act synthesis contract]
 */

import type { SceneId, SegmentId } from "./types.ts";
import { retailSolutionDirections, type SolutionTerritory } from "./solution-directions.ts";

const storyArchitecture = "SEGMENT-STORY-ARCHITECTURE.md";
const salesDirection = "SALES-EXPERIENCE-DIRECTION.md";

const actSource = (section: string): readonly string[] => [
  `${storyArchitecture}: Configure and Act synthesis contract`,
  `${salesDirection}: §23 Act direction — ${section}`,
];

/* ==========================================================================
   THE CONVERGENCE — one restrained narrative recap, not a second dashboard
   ========================================================================== */

/**
 * The four beats of the Retail story, restated once as a closing gesture.
 *
 * These are the same four territories as Configure's spine and as the journey
 * rail's secondary labels, which is deliberate: Configure laid them out in
 * parallel, and Act resolves them into one line. Each beat carries a `from` and
 * a `to` and nothing else — no value, no KPI, no metric. Everything the prospect
 * has actually seen stays in the scene that measured it.
 */
export interface ActRecapBeat {
  territory: SolutionTerritory;
  /** Where this beat of the story started. */
  from: string;
  /** What it became. Two words at most. */
  to: string;
}

export const actRecapBeats: readonly ActRecapBeat[] = [
  { territory: "outside", from: "Opportunity", to: "Passers-by" },
  { territory: "entrance", from: "Visits", to: "Capture" },
  { territory: "inside", from: "Experience", to: "Movement & attention" },
  { territory: "performance", from: "Performance", to: "Conversion & value" },
];

/** Where the four beats converge. Deliberately a question, not a product. */
export const actConvergence = {
  label: "Your next question",
  note: "One question, made measurable across your own locations.",
  sourceRefs: actSource("convergence"),
} as const;

/* ==========================================================================
   NEXT-CONVERSATION DIRECTIONS
   ========================================================================== */

export const actDirectionIds = [
  "act-explore-your-locations",
  "act-start-with-one-use-case",
  "act-see-it-in-practice",
] as const;
export type ActDirectionId = (typeof actDirectionIds)[number];

export interface ActDirectionDefinition {
  id: ActDirectionId;
  segment: SegmentId;
  /** Short all-caps label. Names a conversation, never a product or a package. */
  kicker: string;
  /** The invitation, in the customer's language. */
  title: string;
  /** One supporting line. Editorial, not specification. */
  lead: string;
  /**
   * What this conversation actually looks like, revealed only when the
   * prospect asks for it. Two or three short lines; never a scope document,
   * never a deliverable list, never a commitment.
   */
  detail: readonly string[];
  /** One honest boundary sentence: what this direction does not do. */
  boundaryNote: string;
  /**
   * Whether this direction may only be offered to a prospect once approved,
   * externally-cleared proof exists. `true` for exactly one direction — see it
   * in practice — and the gate is enforced by the runtime, not by the UI.
   */
  requiresApprovedProof: boolean;
  /**
   * Scenes from the approved Retail journey this direction draws proof from.
   * Only meaningful for the proof-gated direction; used to resolve approved
   * assets, never to re-enter a scene.
   */
  proofSceneIds: readonly SceneId[];
  sourceRefs: readonly string[];
}

export const retailActDirections: readonly ActDirectionDefinition[] = [
  {
    id: "act-explore-your-locations",
    segment: "retail",
    kicker: "Explore your locations",
    title: "See which questions matter most across your stores",
    lead:
      "Every store sits in a different street, with a different passing opportunity and a different floor. The first conversation is usually about which of them the question belongs to.",
    detail: [
      "We look at your own locations together — not a portfolio tool, a conversation.",
      "Some stores will already have the question answered. Others will not have been asked it yet.",
      "The outcome is a shortlist worth measuring first, agreed with you.",
    ],
    boundaryNote:
      "No store is scored, ranked or compared here, and nothing about your portfolio is assumed.",
    requiresApprovedProof: false,
    proofSceneIds: [],
    sourceRefs: actSource("explore your locations"),
  },
  {
    id: "act-start-with-one-use-case",
    segment: "retail",
    kicker: "Start with one use case",
    title: "Begin with one question — capture, in-store intelligence or performance",
    lead:
      "The shortest route to something useful is one question, measured properly, in one place. The rest of the story can follow it.",
    detail: [
      "Pick the question you are least certain about today.",
      "We agree what would have to be measured for it to be answerable.",
      "It stays one question until it has an answer worth widening.",
    ],
    boundaryNote:
      "This is not a package, a tier or a starting configuration. Talking about it selects nothing and commits to nothing.",
    requiresApprovedProof: false,
    proofSceneIds: [],
    sourceRefs: actSource("start with one use case"),
  },
  {
    id: "act-see-it-in-practice",
    segment: "retail",
    kicker: "See it in practice",
    title: "Explore a relevant example or customer story",
    lead:
      "Where a customer has approved their story for sharing, it is often the fastest way to recognise your own situation in someone else's.",
    detail: [
      "We walk through an approved example close to your own situation.",
      "What was measured, what it changed, and what it did not.",
    ],
    boundaryNote:
      "Only material a customer has approved for external use is ever shown, and no result shown for one retailer is a prediction for another.",
    requiresApprovedProof: true,
    proofSceneIds: [
      "retail-street-opportunity",
      "retail-store-visits",
      "retail-visitor-composition",
      "retail-in-store-journey",
      "retail-zone-engagement",
      "retail-conversion-sales-context",
    ],
    sourceRefs: actSource("see it in practice"),
  },
];

/* ==========================================================================
   THE CLOSING STATE
   ========================================================================== */

/**
 * The final conversational state, reached from the primary call to action.
 *
 * Every string here is load-bearing and every string here is true. The CTA
 * sends nothing, saves nothing, creates nothing and requests nothing — so this
 * copy claims none of those things, and says so explicitly rather than leaving
 * the prospect to assume a submission happened.
 */
export const actClosing = {
  cta: "Continue the conversation",
  headline: "Let's explore the question that matters most for your locations.",
  handoff: "Your PFM contact can take the conversation from here.",
  /**
   * The one sentence that keeps this honest. Nothing left the browser, and the
   * screen says so.
   */
  truth:
    "Nothing has been sent, submitted or saved. This is a conversation, and it continues with a person.",
  back: "Back to the next steps",
  sourceRefs: actSource("closing state"),
} as const;

/* ==========================================================================
   Validation
   ========================================================================== */

/**
 * Words that would turn the closing chapter of a brochure into a funnel, a
 * quotation engine or a fake submission. Checked against every customer-facing
 * string this module owns, so the guard is content-level rather than a test
 * that reads the component.
 */
const forbiddenActTokens: readonly string[] = [
  "price",
  "pricing",
  "quote",
  "quotation",
  "proposal",
  "roi",
  "payback",
  "uplift",
  "discount",
  "invoice",
  "checkout",
  "sign up",
  "submit",
  "request sent",
  "has been sent",
  "we will contact you",
  "coming soon",
];

export function validateActDirections(): readonly string[] {
  const errors: string[] = [];

  const ids = retailActDirections.map((direction) => direction.id);
  if (new Set(ids).size !== ids.length) {
    errors.push("actDirections: duplicate direction id");
  }

  // Three directions, optionally four. More than four stops being a closing
  // gesture and starts being a menu.
  if (retailActDirections.length < 1 || retailActDirections.length > 4) {
    errors.push("actDirections: must offer between one and four directions");
  }

  for (const direction of retailActDirections) {
    const path = `actDirections.${direction.id}`;
    if (!direction.boundaryNote) errors.push(`${path}: has no boundary note`);
    if (!direction.sourceRefs.length) errors.push(`${path}: has no source reference`);
    if (!direction.detail.length) errors.push(`${path}: has no detail`);
    if (direction.detail.length > 3) {
      errors.push(`${path}: more than three detail lines`);
    }
    if (direction.requiresApprovedProof && !direction.proofSceneIds.length) {
      errors.push(`${path}: proof-gated but names no proof scenes`);
    }
    if (!direction.requiresApprovedProof && direction.proofSceneIds.length) {
      errors.push(`${path}: names proof scenes but is not proof-gated`);
    }
  }

  const surfaces = [
    ...retailActDirections.flatMap((direction) => [
      direction.kicker,
      direction.title,
      direction.lead,
      direction.boundaryNote,
      ...direction.detail,
    ]),
    ...actRecapBeats.flatMap((beat) => [beat.from, beat.to]),
    actConvergence.label,
    actConvergence.note,
    actClosing.cta,
    actClosing.headline,
    actClosing.handoff,
    actClosing.back,
  ];

  for (const surface of surfaces) {
    const haystack = surface.toLowerCase();
    for (const token of forbiddenActTokens) {
      if (haystack.includes(token)) {
        errors.push(`actContent: customer-facing copy uses forbidden token (${token}) in "${surface}"`);
      }
    }
  }

  // The recap is a closing gesture, not a second Configure screen: one beat per
  // territory, in the order the prospect walked them, and no numbers in it.
  //
  // Scoped to the Retail directions rather than to the global territory list.
  // `solutionTerritories` is the union across every segment, and Act's recap
  // beats are Retail's — "Opportunity -> Passers-by" is a Retail sentence. When
  // Shopping Centre added four territories to the shared union, comparing
  // against the global list turned a correct Retail recap into a failure. The
  // real invariant is one beat per direction the prospect actually walked, in
  // that segment's own order.
  const retailTerritories = retailSolutionDirections.map((direction) => direction.territory);
  if (actRecapBeats.length !== retailTerritories.length) {
    errors.push("actRecapBeats: must carry exactly one beat per territory");
  }
  actRecapBeats.forEach((beat, index) => {
    if (beat.territory !== retailTerritories[index]) {
      errors.push(
        `actRecapBeats[${index}]: territory ${beat.territory} is out of journey order`,
      );
    }
    if (/\d/.test(`${beat.from}${beat.to}`)) {
      errors.push(`actRecapBeats[${index}]: carries a value; the recap is not a KPI row`);
    }
  });

  return errors;
}
