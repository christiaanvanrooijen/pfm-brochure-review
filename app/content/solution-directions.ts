/**
 * Retail solution directions — the typed content behind the Configure stage.
 *
 * WHAT THIS IS
 *
 * Configure is a synthesis stage, not a capability scene: `stageMapping.configure`
 * is empty and must stay empty. What the prospect meets in Configure is therefore
 * not a scene and not a matrix row — it is a small number of *solution
 * directions*: customer-problem territories that synthesise the Retail journey
 * the prospect has just walked (Outside -> Entrance -> Inside -> Performance).
 *
 * WHAT THIS IS NOT
 *
 * - Not a product catalogue. No direction names a supplier or a product. Supplier
 *   and product live one layer deeper, in the Technology Runtime, reached only
 *   after the capability context.
 * - Not a recommendation model. Nothing here ranks, scores, prefers or selects.
 *   The segment's `synthesis.configure.recommendationMode` is the literal `"none"`
 *   and this content deliberately carries no field that could express a ranking.
 * - Not a second truth for technology, privacy, proof or evidence. Every one of
 *   those is a reference into the existing typed content (`technologyCapabilityIds`,
 *   `relatedSceneIds`), resolved by `solution-runtime.ts`. The only thing this file
 *   owns is customer-facing framing copy.
 * - Not a requirements runtime. "What is needed" is derived at query time from the
 *   related scenes' own `derivedDependencies`, mapped through `evidence-inputs.ts`.
 *   The only requirement text stored here is `alignmentNotes`: the small number of
 *   commercial alignments (scope, position, connectivity) that are genuinely not
 *   evidence inputs and would otherwise have to be invented in a component.
 *
 * [Source: SALES-EXPERIENCE-DIRECTION.md §22 Configure direction;
 *          SEGMENT-STORY-ARCHITECTURE.md, Configure and Act synthesis contract]
 */

import type {
  SceneId,
  SegmentId,
  TechnologyCapabilityId,
  TechnologyImplementationId,
} from "./types.ts";

const storyArchitecture = "SEGMENT-STORY-ARCHITECTURE.md";
const salesDirection = "SALES-EXPERIENCE-DIRECTION.md";

export const solutionDirectionIds = [
  // Retail. Unprefixed for historical reasons; left exactly as they are.
  "solution-location-opportunity",
  "solution-capture-and-visits",
  "solution-in-store-intelligence",
  "solution-performance-intelligence",
  // Shopping Centre. Segment-prefixed, because a second segment makes the
  // unprefixed form ambiguous. Definitions live in
  // `solution-directions-shopping-centre.ts`; only the identity is declared here,
  // with the union it belongs to.
  "solution-sc-arrival-and-rhythm",
  "solution-sc-movement-and-space",
  "solution-sc-tenant-and-brand",
  "solution-sc-catchment-and-positioning",
  // Retail Park. Segment-prefixed, definitions in
  // `solution-directions-retail-park.ts`. Appended, never interleaved, so the
  // Retail and Shopping Centre positions in this union are unchanged.
  "solution-rp-arrival-and-parking",
  "solution-rp-units-and-visitation",
  "solution-rp-movement-and-dwell",
  "solution-rp-catchment-and-demand",
] as const;
export type SolutionDirectionId = (typeof solutionDirectionIds)[number];

/**
 * The four territories of the Retail journey the prospect has just experienced.
 *
 * These are the same four beats as the approved journey rail's secondary labels
 * (Outside / Entrance / Inside / Performance), which is the point: Configure is
 * anchored to the story the customer just saw, not to a disconnected feature set.
 *
 * A territory is NOT a data lens. Data lenses (Physical / Mobile & geo / Business
 * / Insight) answer "which evidence layers are contributing" and keep their own
 * names everywhere in the experience. A territory answers "which part of the
 * customer's world are we discussing".
 */
export const solutionTerritories = [
  // Retail: the four beats of the Retail journey.
  "outside",
  "entrance",
  "inside",
  "performance",
  // Shopping Centre: four centre problems, deliberately NOT a rename of the
  // Retail four. A centre has no passing-frontage beat and no performance beat —
  // the segment declares no business-data capability at all — so reusing the
  // Retail territories here would promise something this segment cannot measure.
  "arrival",
  "movement",
  "tenancy",
  "reach",
  // Retail Park: four park problems, and again not a rename of either set
  // above. A park has a car park and no internal circulation, so "vehicles"
  // exists here and "movement" does not mean the same thing it means in a
  // centre; "dwell" is named for duration rather than for a route. Reusing the
  // centre's four would promise circulation this segment does not measure.
  "vehicles",
  "units",
  "dwell",
  "catchment",
] as const;
export type SolutionTerritory = (typeof solutionTerritories)[number];

export interface SolutionDirectionDefinition {
  id: SolutionDirectionId;
  segment: SegmentId;
  territory: SolutionTerritory;
  /** Short territory label rendered above the title, e.g. "Outside". */
  territoryLabel: string;
  /** Customer-first title. Never a module, product or supplier name. */
  title: string;
  /** The one commercial question this direction answers. */
  customerQuestion: string;
  /** One supporting line. Editorial, not specification. */
  lead: string;
  /**
   * Two or three supporting phrases in customer language. Deliberately capped:
   * the landing must be readable in under five seconds, and technology
   * terminology belongs one layer deeper.
   */
  capabilityPhrases: readonly string[];
  /**
   * One honest boundary sentence per direction — what this direction does NOT
   * claim. Stated on the landing, not hidden in a deeper layer, because each of
   * these is a place the experience could otherwise overclaim.
   */
  boundaryNote: string;
  /**
   * Scenes from the approved Retail journey this direction synthesises. Used to
   * resolve requirements (via each scene's `derivedDependencies`) and proof (via
   * each scene's `proofAssetIds`) — never to re-enter a scene.
   */
  relatedSceneIds: readonly SceneId[];
  /**
   * Capability-first. Implementations are resolved from these capabilities by
   * the runtime and are never listed here, so a direction can never point
   * straight at a vendor product.
   */
  technologyCapabilityIds: readonly TechnologyCapabilityId[];
  /**
   * The subset of `technologyCapabilityIds` for which "what would physically be
   * at the location" is the question this direction is actually asking.
   *
   * It is declared rather than derived, because deriving it produces a worse
   * experience. The Entrance direction legitimately declares the passer-by
   * capability — capture rate needs both sides of it — but a prospect who opens
   * "What is needed" under Entrance is asking about the door, not about the
   * frontage sensor they were shown one direction earlier. Deriving the section
   * from every declared capability repeats that hardware under a second
   * heading, and a repeated sensor is the first step towards a catalogue.
   *
   * Classification is deliberately absent everywhere: it is a configuration of
   * a device that is already in the list, not another thing to install.
   *
   * An empty array means nothing is installed for this direction.
   */
  siteCapabilityIds: readonly TechnologyCapabilityId[];
  /**
   * Commercial alignments that are genuinely not evidence inputs — scope,
   * measurement position, connectivity, agreed definitions. Everything that IS
   * an evidence input is derived from the related scenes instead.
   */
  alignmentNotes: readonly string[];
  sourceRefs: readonly string[];
}

const configureSource = (section: string): readonly string[] => [
  `${storyArchitecture}: Configure and Act synthesis contract`,
  `${salesDirection}: §22 Configure direction — ${section}`,
];

export const retailSolutionDirections: readonly SolutionDirectionDefinition[] = [
  {
    id: "solution-location-opportunity",
    segment: "retail",
    territory: "outside",
    territoryLabel: "Outside",
    title: "Understand the opportunity around each store",
    customerQuestion: "Is the right opportunity around each store?",
    lead:
      "See how much physical opportunity passes each location — and what kind of area that location actually sits in.",
    capabilityPhrases: [
      "Passing opportunity, measured at the location",
      "Catchment, origin and area context",
      "Compare locations across the portfolio",
    ],
    // The Capture fix, restated at solution level: geo context sits beside the
    // physical measurement and never stands in for it.
    boundaryNote:
      "Physical passer-by measurement and area context are two different sources. Context is added beside the measurement; it never replaces it.",
    relatedSceneIds: ["retail-street-opportunity", "retail-portfolio-comparison"],
    // TECH-01 measures the passing opportunity; TECH-07 adds aggregate area
    // context. They are listed as separate capabilities for exactly that reason.
    technologyCapabilityIds: ["TECH-01", "TECH-07"],
    // Geo context connects an approved external source; nothing is installed
    // for it, so it is not a site capability.
    siteCapabilityIds: ["TECH-01"],
    alignmentNotes: [
      "A defined store and location scope",
      "An agreed frontage or opportunity measurement area",
      "An approved area-context source, where that layer is included",
    ],
    sourceRefs: configureSource("business question -> required measurement"),
  },
  {
    id: "solution-capture-and-visits",
    segment: "retail",
    territory: "entrance",
    territoryLabel: "Entrance",
    title: "See how much opportunity becomes a visit",
    customerQuestion: "Are enough passers-by choosing to enter?",
    lead:
      "Follow the one relationship every store front lives on: passers-by, capture, store visits.",
    capabilityPhrases: [
      "Passers-by and store visits, measured separately",
      "Capture rate by hour, day and store",
      "Anonymous visitor and buying-unit mix",
    ],
    boundaryNote:
      "Capture rate is only shown when the passing audience and the visits share the same area, period and definition.",
    relatedSceneIds: ["retail-store-visits", "retail-visitor-composition"],
    technologyCapabilityIds: ["TECH-01", "TECH-02", "TECH-03"],
    // The entrance itself. The passer-by sensor belongs to the Outside
    // direction, where it was already met, and classification is a
    // configuration of the entrance device rather than a second install.
    siteCapabilityIds: ["TECH-02"],
    alignmentNotes: [
      "Defined entrances and a suitable measurement position",
      "Connectivity and power at the measurement point, depending on the implementation",
    ],
    sourceRefs: configureSource("required measurement -> available insight"),
  },
  {
    id: "solution-in-store-intelligence",
    segment: "retail",
    territory: "inside",
    territoryLabel: "Inside",
    title: "Understand what happens during the visit",
    customerQuestion: "What happens after visitors enter?",
    lead:
      "Anonymous routing, dwell and zone exposure — where visitors actually go inside the store, and where they stop.",
    capabilityPhrases: [
      "Anonymous routes and zone-to-zone flow",
      "Dwell and zone exposure",
      "Visit duration and buying-unit context, where supported",
    ],
    boundaryNote:
      "Not every implementation supports every output. What can be answered inside a store is agreed per location and per coverage.",
    relatedSceneIds: [
      "retail-in-store-journey",
      "retail-zone-engagement",
      "retail-visit-duration",
    ],
    technologyCapabilityIds: ["TECH-04", "TECH-05", "TECH-03"],
    // Spatial measurement, plus anonymous matching — which is where the
    // multi-camera analytics option legitimately appears as a third possible
    // approach, without implying it matches the other two.
    siteCapabilityIds: ["TECH-04", "TECH-05"],
    alignmentNotes: [
      "An agreed spatial measurement scope and suitable infrastructure",
      "Classification configuration, where that layer is included",
    ],
    sourceRefs: configureSource("required measurement -> implementation scope"),
  },
  {
    id: "solution-performance-intelligence",
    segment: "retail",
    territory: "performance",
    territoryLabel: "Performance",
    title: "Connect visits to commercial performance",
    customerQuestion: "How does traffic connect to commercial performance?",
    lead:
      "Put measured visits next to your own transactions and sales value: conversion, transaction value, sales per visitor.",
    capabilityPhrases: [
      "Conversion and sales per visitor",
      "Average transaction value in context",
      "Like-for-like comparison across stores",
    ],
    // The single most important boundary in this whole stage.
    boundaryNote:
      "PFM measures visits. Transactions and turnover stay your data, connected from your own business systems — PFM does not measure them.",
    relatedSceneIds: [
      "retail-conversion-sales-context",
      "retail-portfolio-comparison",
    ],
    technologyCapabilityIds: ["TECH-02", "TECH-08"],
    // Nothing is installed for this direction. It connects transactions and
    // sales value the customer already holds, and the boundary that matters is
    // that PFM does not measure those.
    siteCapabilityIds: [],
    alignmentNotes: [
      "Shared location identifiers and aligned period definitions",
      "Agreed KPI definitions before any figure is compared",
    ],
    sourceRefs: configureSource("required connected context -> available insight"),
  },
] satisfies readonly SolutionDirectionDefinition[];

/**
 * Explanatory video, declared against a CAPABILITY — never against a supplier,
 * a solution direction or a proof case.
 *
 * WHAT THIS IS
 *
 * One short visual explanation of how a measurement capability physically works,
 * shown inside "How we do this", after the capability has been explained in
 * words and before implementation options are opened. It exists because
 * entrance counting is easier to understand seen than described.
 *
 * WHAT THIS IS NOT
 *
 * - Not proof. It is not a case, not a customer result and not a reference. The
 *   proof layer stays permission-gated in `proof-runtime.ts` and is untouched.
 * - Not a source. No accuracy, coverage, GDPR, classification or hardware claim
 *   may be derived from what the footage happens to show. Those claims stay
 *   owned by the Technology Runtime, per implementation.
 * - Not a recommendation. `exampleImplementationId` names the implementation the
 *   footage was recorded with, so the prospect is not left guessing — it does not
 *   make that implementation the default, the preferred or the only option, and
 *   the other implementations of the same capability do not behave identically.
 * - Not a media library. One capability, one PRIMARY video. Where a second piece
 *   of footage genuinely adds a further layer of understanding it is declared as
 *   that primary video's `followOn` — structurally nested inside it, never a
 *   sibling entry — so the model itself cannot express a flat gallery of
 *   equally-weighted clips hanging off one capability.
 *
 * The only new copy here is `intro`, which introduces the video itself. Every
 * other string shown beside it — capability name, purpose, privacy principle,
 * implementation role — is read from the Technology Runtime.
 *
 * MEASUREMENT IS NOT INTERPRETATION
 *
 * `viewKind` is the field that keeps those two apart, and it is the reason the
 * follow-on exists as its own type rather than as a second `CapabilityExplainerVideo`:
 *
 * - `measured_environment` — the sensor's-eye view. What the physical space and
 *   the movement through it look like as they are measured.
 * - `derived_representation` — a view calculated *from* that measurement:
 *   routing, tracking, reporting. It is downstream of the measurement and is
 *   never evidence of how the measurement itself works.
 *
 * A primary video is always a measured view; a follow-on is always a derived
 * one. Collapsing the two into one undifferentiated "video" category is exactly
 * the mistake the labelling in the UI, and the validator, exist to prevent.
 *
 * [Source: SALES-EXPERIENCE-DIRECTION.md §22 Configure direction;
 *          human product decision 2026-08-18, LiDAR explainer video layers]
 */

/** What a piece of footage actually shows. Never a claim about output quality. */
export type ExplainerVideoViewKind = "measured_environment" | "derived_representation";

/** Customer-facing label per view kind. The distinction has to be readable. */
export const explainerVideoViewLabels: Readonly<
  Record<ExplainerVideoViewKind, string>
> = {
  measured_environment: "Measured physical environment",
  derived_representation: "Derived representation",
};

/**
 * An optional SECOND depth layer, reachable only once the primary video is open.
 *
 * Deliberately a different shape from `CapabilityExplainerVideo`: it has no
 * capability of its own, no approach of its own and no example implementation.
 * It cannot exist on its own, and it cannot be promoted to a peer of the primary
 * video without changing its type — which is the point.
 */
export interface CapabilityExplainerFollowOnVideo {
  src: string;
  /** Completes "See …" / "Hide …". Never a sentence, never a claim. */
  actionLabel: string;
  /** One line, and only about this second view. */
  intro: string;
  /** Accessible description of what is visible. Carries no measurement claim. */
  description: string;
  /** Always derived. A follow-on is never the measurement itself. */
  viewKind: "derived_representation";
  /**
   * The sentence that stops a reporting view being read as the measurement.
   * Rendered wherever the follow-on is rendered, in both audiences.
   */
  distinctionNote: string;
  /** `width / height` of the source footage, so the frame never crops or stretches it. */
  frameRatio: string;
  sourceRefs: readonly string[];
}

export interface CapabilityExplainerVideo {
  capabilityId: TechnologyCapabilityId;
  /**
   * Which measurement approach under that capability this footage illustrates,
   * where the capability has more than one. Matches a `CapabilityExplainerVisual`
   * `approachId`. Null where the capability has a single approach.
   */
  approachId: string | null;
  /** Web-compatible derivative. The camera original stays alongside it where one exists. */
  src: string;
  /** Original camera master, kept for archival; not served to the browser. Null where the supplied file is already web-compatible. */
  originalSrc: string | null;
  /** Completes "See …" / "Hide …". Never a sentence, never a claim. */
  actionLabel: string;
  /** One line, and only about the video. Never a second capability explanation. */
  intro: string;
  /** Accessible description of what is visible. Carries no measurement claim. */
  description: string;
  /** Always the measured view. Interpretation belongs to `followOn`. */
  viewKind: "measured_environment";
  /**
   * The implementation the footage was recorded with, where that is known and
   * documented. Not a preference. Null where no implementation is documented for
   * the footage — in which case no product is named, rather than one guessed at.
   */
  exampleImplementationId: TechnologyImplementationId | null;
  /** `width / height` of the source footage, so the frame never crops or stretches it. */
  frameRatio: string;
  /** The optional second, derived layer. Nested, never a sibling. */
  followOn: CapabilityExplainerFollowOnVideo | null;
  sourceRefs: readonly string[];
}

const videoSource = `${salesDirection}: §22 Configure direction — visual explanation of a capability`;

export const capabilityExplainerVideos: readonly CapabilityExplainerVideo[] = [
  {
    capabilityId: "TECH-02",
    approachId: "threshold-cone",
    src: "/assets/videos/3d-sensor-counting-xovis.mp4",
    originalSrc: "/assets/videos/3d-sensor-counting-xovis.mov",
    actionLabel: "an example implementation",
    intro: "A short look at what the sensor above the door actually sees.",
    description:
      "Overhead sensor footage of an entrance: people crossing the doorway are tracked as anonymous shapes and counted in and out.",
    viewKind: "measured_environment",
    exampleImplementationId: "impl-xovis-3d-entrance",
    frameRatio: "388 / 328",
    followOn: null,
    sourceRefs: [videoSource],
  },
  {
    // Spatial movement intelligence, LiDAR approach.
    //
    // No implementation is named. The mapped RoboSense datasheet documents a
    // sensor for robotics use, and nothing states which unit recorded this
    // footage — so attributing it to a product would be an invented fact, and
    // would also drag hardware up into the explainer layer, which is precisely
    // where it does not belong. The footage illustrates the APPROACH.
    capabilityId: "TECH-04",
    approachId: "lidar-point-cloud",
    src: "/assets/videos/lidar-in-a-store-pfm.mp4",
    originalSrc: null,
    actionLabel: "LiDAR in a store",
    intro: "A real-world example of spatial LiDAR measurement inside a store.",
    description:
      "Footage recorded inside a store, showing the space and the people moving through it as spatial LiDAR measures them.",
    viewKind: "measured_environment",
    exampleImplementationId: null,
    frameRatio: "664 / 604",
    followOn: {
      // The second layer, and deliberately the smaller one. It shows what may
      // subsequently be done with measured movement — routing, tracking,
      // reporting — which is a different question from how the space is
      // measured, and it must not be mistaken for an answer to that question.
      src: "/assets/videos/lidar-tracking-reporting-visual.mp4",
      actionLabel: "the tracking view",
      intro:
        "The same kind of movement, one step later: represented as routes and summarised for reporting.",
      description:
        "A tracking and reporting view in which measured movement through a space is drawn as routes and summarised.",
      viewKind: "derived_representation",
      distinctionNote:
        "This is not the measurement itself. It is one way measured movement may be represented and interpreted afterwards — what is actually built for a store is designed per site.",
      frameRatio: "1280 / 720",
      sourceRefs: [videoSource],
    },
    sourceRefs: [videoSource],
  },
] satisfies readonly CapabilityExplainerVideo[];

/**
 * The four depth questions a prospect may optionally ask of any direction.
 *
 * Progressive disclosure only. The solution story is the page; these are quiet
 * secondary actions that open one layer at a time, and every one of them closes
 * back to the same direction it was opened from.
 */
export const configureDepthIds = [
  "how-we-do-this",
  "what-is-needed",
  "privacy",
  "see-it-in-practice",
] as const;
export type ConfigureDepthId = (typeof configureDepthIds)[number];

export const configureDepthLabels: Readonly<Record<ConfigureDepthId, string>> = {
  "how-we-do-this": "How we do this",
  "what-is-needed": "What is needed",
  privacy: "Privacy",
  "see-it-in-practice": "See it in practice",
};

/**
 * The single privacy statement for the Configure stage, and the principles under
 * it.
 *
 * Every principle here is a restatement of something the typed architecture
 * already enforces, and nothing here is a legal assurance. Implementation-level
 * privacy evidence is NEVER generalised from this block: it is resolved per
 * implementation from `technology.ts`, where Xovis, Milesight, Isarsoft and
 * LiDAR each carry their own `privacyStatus` and their own claims.
 */
export const configurePrivacyStatement = {
  headline: "We measure behaviour, not identity.",
  lead:
    "PFM solutions are designed around anonymous measurement and the minimum data required for the insight you actually selected.",
  principles: [
    {
      title: "Anonymous measurement",
      body: "Movement, visits and zones are counted as anonymous events. Nothing in this experience presents or depends on identity.",
    },
    {
      title: "Minimum required data",
      body: "The measurement design follows the question. A deeper insight is only configured where it has been asked for.",
    },
    {
      title: "Configured outputs",
      body: "Classification and additional outputs exist only where they are explicitly enabled, configured and permitted.",
    },
    {
      title: "Implementation-specific safeguards",
      body: "Privacy evidence belongs to a specific implementation. It is stated per implementation and never generalised across suppliers.",
    },
  ],
} as const;
