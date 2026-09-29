/**
 * OUTLET CENTRE — visual-semantic mapping, one decision per Core scene.
 *
 * WHY A DECISION AND NOT A PATH
 *
 * A path says which file to load. A decision says why, what the picture can be
 * read to mean, and what it may not be read to mean. Outlet needed the second
 * kind, because most of its problems are not missing files: they are files that
 * exist, sit in the right folder, carry the right-sounding name, and depict
 * something the scene does not claim.
 *
 * THE THREE ROLES, KEPT APART
 *
 *   location_illustration    a place of this kind, drawn. Orients; proves
 *                            nothing about anyone's behaviour.
 *   measurement_principle    how a measurement works, drawn. Belongs to a
 *                            capability, not to a location.
 *   customer_proof           a real result from a real customer. NONE exists
 *                            for this segment: all three CASE-OUT assets are
 *                            typed placeholders, and nothing here may stand in
 *                            for one. An approved scene illustration is not
 *                            customer evidence.
 *
 * HOW EACH DECISION WAS REACHED
 *
 * By opening the file and describing what is actually in the frame, including
 * the overlays burnt into it, before looking at its name. Two decisions changed
 * direction because of that: the file called `dwell` carries circulation
 * trajectories and no dwell, and the file called `spatial-journey` is the only
 * one carrying zone rectangles, which is what the zone-exposure scene is about.
 * Filenames are a convention here, never a source.
 *
 * WHAT `missing` MEANS
 *
 * That no honest candidate exists — not that nobody has looked. Four Core
 * scenes are missing, and three of those are missing because the only files
 * that would fit are other segments' photographs under Outlet names.
 */

import type { SceneId } from "./types.ts";

export const OUTLET_VISUALS = "/assets/location-visuals/outlet-centre/";

export type AssetRole =
  | "location_illustration"
  | "measurement_principle"
  | "customer_proof";

export type AssetDecision =
  /** Approved to illustrate this scene. Still not customer evidence. */
  | "suitable"
  /** True of the segment, but not evidence for any scene's claim. */
  | "cover_only"
  /** Must not be used for this scene, for the recorded reason. */
  | "rejected"
  /** No honest candidate exists yet. */
  | "missing";

/** A locus is only defensible where the evidence points at a PLACE. */
export interface FocusLocus {
  focusId: string;
  focusLabel: string;
  /** Asset-pixel rectangle around the thing the evidence is configured at. */
  rect: { x: number; y: number; w: number; h: number };
  point: { x: number; y: number; side: "left" | "right"; vertical: "above" | "below" };
}

export interface OutletSceneAssetDecision {
  sceneId: SceneId;
  /** Web path under `public/`, or null where the decision is `missing`. */
  candidatePath: string | null;
  /** The candidate's natural size, so the frame holds its real ratio. */
  assetSize: { w: number; h: number } | null;
  role: AssetRole | null;
  /** What is actually in the frame, overlays included. Written after opening it. */
  depicts: string;
  /** What the picture may be read to support, in this scene's terms. */
  supports: string;
  /** What it may NOT be read to support, and anything wrong with the file. */
  limitations: readonly string[];
  decision: AssetDecision;
  /** For a recoverable rejection: what would have to happen first. */
  blockedOn: string | null;
  /** Null wherever the evidence has no place to point at. */
  focusLocus: FocusLocus | null;
  /** Other files considered for this scene, and why they lost. */
  alternatives: readonly { path: string; note: string }[];
}

const V = OUTLET_VISUALS;

export const outletSceneAssetDecisions: readonly OutletSceneAssetDecision[] = [
  {
    sceneId: "outlet-centre-destination-catchment",
    // Gate 9: reinstated on the segment owner's explicit sign-off, having
    // been shown this is the Shopping Centre aerial (mean pixel difference
    // 1.9) and reads as an enclosed mall, not an open-air outlet village.
    candidatePath: `${V}outlet-centre-geo-intelligence-hero.png`,
    assetSize: { w: 1920, h: 1080 },
    role: "location_illustration",
    depicts:
      "No Outlet frame shows reach around the destination. The only file shaped like one, outlet-centre-geo-intelligence-hero.png, is the Shopping Centre aerial with a different purple overlay.",
    supports: "Nothing. There is no candidate to support anything.",
    limitations: [
      "Reach and origin are not visible in any ground-level Outlet frame, and no Outlet aerial exists.",
      "The segment cover is an open-air village at ground level. It shows what an outlet IS and nothing about where anyone travelled from, so it must not stand in here.",
      "Gate 9: this is still the Shopping Centre's own aerial under an Outlet name, not a distinct Outlet frame. Accepted anyway, on the segment owner's explicit sign-off, aware of the origin.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: null,
    alternatives: [
      {
        path: `${V}outlet-centre-geo-intelligence-hero.png`,
        note: "Was rejected for the Shopping Centre origin above; reinstated Gate 9 (see limitations).",
      },
    ],
  },
  {
    sceneId: "outlet-centre-tourism-origin-context",
    // Gate 9: reinstated on the segment owner's explicit sign-off. Gate 6's
    // own reasoning still applies — origin isn't a thing a location photo
    // can show — so this frame illustrates the destination, not the claim.
    candidatePath: `${V}outlet-centre-geo-intelligence-hero.png`,
    assetSize: { w: 1920, h: 1080 },
    role: "location_illustration",
    depicts: "No candidate. Origin is not a thing a picture of a place can show.",
    supports: "Nothing.",
    limitations: [
      "Local, regional and destination-led shares come from an approved aggregate source. A photograph of visitors cannot distinguish them, and any image implying it would be a claim the model does not make.",
      "Gate 9: accepted anyway, on the segment owner's explicit sign-off. The scene's own copy must not lean on this image to imply origin is visually measured — it isn't.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: null,
    alternatives: [],
  },
  {
    sceneId: "outlet-centre-vehicle-coach-arrival",
    // Gate 9: reinstated on the segment owner's explicit sign-off, aware
    // this file is byte-identical to the Retail Park vehicle-arrival frame.
    candidatePath: `${V}outlet-centre-vehicle-arrival-hero.png`,
    assetSize: { w: 1672, h: 941 },
    role: "location_illustration",
    depicts:
      "No Outlet frame shows vehicle or coach arrival. Every arrival-shaped file under the Outlet folder is another segment's frame.",
    supports: "Nothing.",
    limitations: [
      "Coaches in particular appear in no Outlet file at all, and the scene's own evidence includes them only where explicitly measured.",
      "Gate 9: byte-identical to the Retail Park vehicle-arrival frame — the same photo, not an Outlet-specific one. Accepted anyway, on the segment owner's explicit sign-off.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: null,
    alternatives: [
      {
        path: `${V}outlet-centre-vehicle-arrival-hero.png`,
        note: "Was rejected as byte-identical to Retail Park's frame; reinstated Gate 9 (see limitations).",
      },
      {
        path: `${V}outlet-centre-parking-occupancy-hero.png`,
        note: "Rejected: byte-identical to the Retail Park parking-occupancy frame.",
      },
      {
        path: `${V}outlet-centre-parking-intelligence-hero.png`,
        note: "Rejected: the Shopping Centre parking frame.",
      },
    ],
  },
  {
    sceneId: "outlet-centre-entrances",
    // Gate 9: reinstated on the segment owner's explicit sign-off, aware
    // this reads as a Shopping Centre mall entrance, not an Outlet street.
    candidatePath: `${V}outlet-centre-visitors-hero.png`,
    assetSize: { w: 1920, h: 1080 },
    role: "location_illustration",
    depicts:
      "No Outlet frame shows entry to the outlet streets. The frames that show a threshold show a SHOP doorway, which is a different boundary.",
    supports: "Nothing.",
    limitations: [
      "An open-air outlet is entered from streets and car parks, not through one door set. Using a shop-threshold frame here would answer a centre-entrance question with store counting.",
      "Gate 9: this is a Shopping Centre-style enclosed mall entrance, not Outlet Centre's own open-air street. Accepted anyway, on the segment owner's explicit sign-off.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: null,
    alternatives: [
      {
        path: `${V}outlet-centre-brand-counting-hero.png`,
        note: "Considered and set aside: its thresholds are shop doorways, not centre entrances.",
      },
      {
        path: `${V}outlet-centre-visitors-hero.png`,
        note: "Was rejected as the Shopping Centre parking frame under an Outlet name; reinstated Gate 9 (see limitations).",
      },
    ],
  },
  {
    sceneId: "outlet-centre-visitor-composition",
    candidatePath: `${V}outlet-centre-visitor-composition-hero.png`,
    assetSize: { w: 1672, h: 941 },
    role: "location_illustration",
    depicts:
      "An open-air outlet plaza at dusk. Families and couples walk with bags, and soft purple rings lie on the paving around GROUPS of people — some rings enclose two to four people together, some a single person.",
    supports:
      "Anonymous grouping: that separate people may be estimated as one buying unit where classification is enabled and permitted.",
    limitations: [
      "The rings enclose people, so nothing here may be pointed at: a marker on a ring is a marker on a person, which is exactly what the anonymity boundary refuses.",
      "Faces are visible. Depicted environment, never a classification subject.",
      "It shows grouping, not attributes. It cannot illustrate age, gender or any other classified characteristic.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: null,
    alternatives: [
      {
        path: `${V}outlet-centre-visitor-composition-hero1.png`,
        note: "Rejected: byte-identical to the Retail visitor frame — a store interior, not an outlet.",
      },
    ],
  },
  {
    sceneId: "outlet-centre-circulation",
    candidatePath: `${V}outlet-centre-dwell-hero.png`,
    assetSize: { w: 1920, h: 1080 },
    role: "location_illustration",
    depicts:
      "An outlet street at golden hour with fictional fascia (NORTHSTAR, AURORA, VERDE, SOLACE). Bright purple trajectory lines sweep along the paving, branching between the units. No zone rectangles.",
    supports:
      "Movement across outlet streets: anonymous trajectories and transitions as a shape on the ground.",
    limitations: [
      "The file is named `dwell` and contains no dwell at all — no duration, no lingering, no seated presence. The name is wrong; the content is circulation.",
      "The trajectories are drawn continuous. Real movement is reconstructed only within configured coverage.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: {
      focusId: "measured",
      focusLabel: "The street the trajectories run along",
      rect: { x: 250, y: 620, w: 1180, h: 400 },
      point: { x: 840, y: 620, side: "right", vertical: "above" },
    },
    alternatives: [
      {
        path: `${V}outlet-centre-spatial-journey-hero.png`,
        note: "Near-identical frame that ALSO carries zone rectangles; assigned to zone exposure, where the rectangles are the point.",
      },
    ],
  },
  {
    sceneId: "outlet-centre-zone-exposure-dwell",
    candidatePath: `${V}outlet-centre-spatial-journey-hero.png`,
    assetSize: { w: 1920, h: 1080 },
    role: "location_illustration",
    depicts:
      "The same outlet street as the circulation frame, plus faint rectangular outlines standing over the shopfronts — the only Outlet frame carrying zone geometry. Purple trajectories run along the paving beneath them.",
    supports:
      "Zone and brand-area definition: that comparison areas are configured shapes, and presence is read against them.",
    limitations: [
      "It shows zones and movement, not DWELL. Nothing in the frame represents time spent, so the duration half of this scene has no illustration.",
      "The rectangles are drawn over shopfronts, which are units. A zone in the model may be larger or smaller than a unit.",
    ],
    decision: "suitable",
    blockedOn: null,
    /* Measured, not guessed: differencing this frame against the near-identical
       `dwell` frame isolates the zone rectangles exactly, and this is the
       leftmost and only unobstructed one. */
    focusLocus: {
      focusId: "connected",
      focusLabel: "One configured zone",
      rect: { x: 60, y: 290, w: 460, h: 500 },
      point: { x: 520, y: 790, side: "right", vertical: "below" },
    },
    alternatives: [
      {
        path: `${V}outlet-centre-unit-category-exposure-hero.png`,
        note: "Alternative: portal outlines around whole unit facades. Reads as unit exposure rather than configured zones; kept as a second option.",
      },
      {
        path: `${V}outlet-centre-unit-category-exposure-hero-2.png`,
        note: "Byte-identical duplicate of the file above. One of the two should be removed.",
      },
    ],
  },
  {
    sceneId: "outlet-centre-brand-counting",
    candidatePath: `${V}outlet-centre-brand-counting-hero.png`,
    assetSize: { w: 1672, h: 941 },
    role: "location_illustration",
    depicts:
      "An outlet street with three lit shopfronts. Each doorway carries a purple threshold glow on the floor. The fascia read LUXE ATELIER OUTLET, PEAK PERFORMANCE with a chevron mark, and RADIANCE BEAUTY.",
    supports:
      "Counting at a covered store boundary: that a brand visit is an entry across a configured threshold, and only inside covered boundaries.",
    limitations: [
      "PEAK PERFORMANCE is a real apparel brand, rendered as a legible fascia with a mark. AGENTS.md forbids real customer names or logos without documented approval, so this frame cannot be used as it stands.",
      "The frame shows entries only. It cannot support turnover, rent potential or category performance, which the scene's own evidence also refuses.",
      "Gate 9: accepted anyway, on the segment owner's explicit sign-off, aware the PEAK PERFORMANCE fascia is a real, legible brand mark and that AGENTS.md documents this as normally disqualifying.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: null,
    alternatives: [
      {
        path: `${V}outlet-centre-unit-category-exposure-hero.png`,
        note: "Alternative with no legible fascia, but its portals enclose whole units rather than doorways, which reads as exposure rather than entry counting.",
      },
    ],
  },
  {
    sceneId: "outlet-centre-brand-flow",
    candidatePath: `${V}outlet-centre-brand-journey-hero.png`,
    assetSize: { w: 1672, h: 941 },
    role: "location_illustration",
    depicts:
      "An outlet plaza at dusk with a large glass anchor building. Purple portal frames stand at three shopfronts, and many small purple rings under walking people converge across the plaza towards the anchor.",
    supports:
      "Movement between brand areas: that a transition is one covered brand area to another, where matching supports it.",
    limitations: [
      "The rings sit under individual people, so no point may be placed: the subject is the transition BETWEEN areas, and marking one storefront would make that store the finding.",
      "Portals and movement rings appear together, which mixes entry counting with matching. The scene's evidence needs both, but the frame does not distinguish them.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: null,
    alternatives: [
      {
        path: `${V}outlet-centre-visitor-brand-flow-hero.png`,
        note: "Stronger flow depiction — a dotted line runs street-long between units — but it is the segment cover, and one file should not be both cover and evidence here.",
      },
    ],
  },
  {
    sceneId: "outlet-centre-time-in-destination",
    candidatePath: `${V}outlet-centre-time-in-centre-hero.png`,
    assetSize: { w: 1672, h: 941 },
    role: "location_illustration",
    depicts:
      "An outlet street at sunset with seating and café terraces. People sit on benches and sofas, and purple rings lie on the ground around the SEATED groups rather than around walkers.",
    supports:
      "Duration and lingering: that time in the destination is presence over a period, not a count of arrivals.",
    limitations: [
      "The signage is malformed. One fascia reads PEAK PTELIER / PERFORMANCE — a garbled render that still echoes a real brand name, and several further fascia are illegible artefacts.",
      "Rings around seated people are the closest any Outlet frame comes to dwell, but presence is drawn per person; matched duration needs supported matching, which the picture cannot show.",
      "Gate 9: accepted anyway, on the segment owner's explicit sign-off, aware the signage is a garbled real-brand echo and several fascia are illegible AI-rendering artefacts.",
    ],
    decision: "suitable",
    blockedOn: null,
    focusLocus: null,
    alternatives: [],
  },
];

/**
 * Files under the Outlet folder that may never be used for this segment.
 *
 * Typed because a rejection that lives only in a report gets re-adopted: the
 * next person sees a plausible name in the right folder and wires it in.
 */
export const outletRejectedFiles: readonly {
  path: string;
  reason: string;
  /** Where a rejection says "byte-identical to X", X — so the claim is checked, not trusted. */
  duplicateOf?: string;
}[] = [
  {
    path: `${V}outlet-centre-parking-intelligence-hero.png`,
    reason: "The Shopping Centre parking frame.",
  },
  {
    path: `${V}outlet-centre-parking-occupancy-hero.png`,
    reason: "Byte-identical to the Retail Park parking-occupancy frame.",
  },
  {
    // Restored 2026-09-28 at the product lead's instruction, after a brief
    // removal from this list while the file was missing from disk. It is the
    // byte-for-byte Retail visitor frame documented in OUTLET-ASSET-MAPPING.md,
    // and the test now checks exactly that — not merely that a file exists.
    path: `${V}outlet-centre-visitor-composition-hero1.png`,
    reason: "Byte-identical to the Retail visitor frame — a store interior, not an outlet.",
    duplicateOf: "/assets/location-visuals/retail/retail-visitor-composition-hero.png",
  },
  // Gate 9: outlet-centre-geo-intelligence-hero.png, outlet-centre-visitors-hero.png
  // and outlet-centre-vehicle-arrival-hero.png moved OUT of this list — each is
  // now the accepted candidate for one scene (destination-catchment /
  // tourism-origin-context, entrances, vehicle-coach-arrival), on the segment
  // owner's explicit sign-off. The cross-segment-duplicate origin of each is
  // recorded in that scene's own `limitations`, not erased.
];

export function getOutletDecision(sceneId: SceneId): OutletSceneAssetDecision | null {
  return outletSceneAssetDecisions.find((entry) => entry.sceneId === sceneId) ?? null;
}

/** Every file the mapping actively uses, for asset-safety checks. */
export function outletUsedPaths(): readonly string[] {
  return outletSceneAssetDecisions
    .filter((entry) => entry.decision === "suitable" && entry.candidatePath)
    .map((entry) => entry.candidatePath!);
}
