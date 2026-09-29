/**
 * Segment-specific overrides for how a shared capability is EXPLAINED.
 *
 * WHY THIS EXISTS
 *
 * A capability is shared across segments, but the way it is physically measured
 * is not always the same in every kind of location. TECH-04 is the case that
 * forced this file: in a store, spatial movement is measured with 3D sensors —
 * LiDAR or 3D stereo vision — and the approved Retail media shows exactly that.
 * In a shopping centre it is not. Movement across a centre is reconstructed from
 * compatible IP-camera coverage, with anonymous matching between camera views.
 *
 * Before this file, Configure resolved capability media by capability alone, so
 * Shopping Centre's "How do visitors move through the centre?" rendered a LiDAR
 * point cloud of a clothing store, a store-floor tracking diagram, and a video
 * captioned "LiDAR in a store". That is not what a centre would be sold, and it
 * is not what a centre would be measured with.
 *
 * WHAT THIS IS NOT
 *
 * Not a second technology model. It cannot invent a capability, an
 * implementation or a privacy claim: every field either narrows what the shared
 * model already contains, or replaces customer-facing explanation text. An
 * override may REMOVE an implementation from a segment's view; it may never add
 * one that `technology.ts` does not already resolve for that capability.
 *
 * WHAT AN EMPTY MEDIA LIST MEANS
 *
 * That the correct media does not exist yet, not that none is wanted. Showing
 * nothing is the honest state; showing another segment's media is not.
 */

import type {
  SegmentId,
  TechnologyCapabilityId,
  TechnologyImplementationId,
} from "./types.ts";
import type { CapabilityExplainerVisual } from "./technology-visuals.ts";

export interface SegmentCapabilityMediaOverride {
  segment: SegmentId;
  capabilityId: TechnologyCapabilityId;
  /** Replaces the capability's customer-facing explanation for this segment. */
  purpose?: string;
  /**
   * Explainer diagrams for this segment. An empty array means the segment shows
   * none — deliberately, because the correct ones do not exist yet.
   */
  explainerVisuals?: readonly CapabilityExplainerVisual[];
  /** When false, the capability's example video is withheld for this segment. */
  allowCapabilityVideo?: boolean;
  /**
   * The implementations this segment may show, as a NARROWING of what the
   * capability already resolves. An empty array shows none.
   */
  implementationIds?: readonly TechnologyImplementationId[];
  /** Shown in place of an implementation list when that list is empty. */
  note?: string;
  sourceRefs: readonly string[];
}

const salesDirection = "SALES-EXPERIENCE-DIRECTION.md";

export const segmentCapabilityMediaOverrides: readonly SegmentCapabilityMediaOverride[] = [
  {
    segment: "shopping-centre",
    capabilityId: "TECH-04",
    /**
     * The method, stated without naming a supplier. Suppliers belong to the
     * implementation layer, and naming one here would put a product into
     * capability-level copy, which the Configure model forbids everywhere else.
     *
     * "Reconstructed" and "inside configured coverage" are both load-bearing: a
     * centre is not covered everywhere, and movement between two camera views is
     * inferred from matched anonymous appearances rather than observed as one
     * continuous path.
     */
    purpose:
      "Explain how anonymous movement between covered areas is reconstructed from compatible IP-camera feeds using perception software, inside configured coverage only.",
    /**
     * The centre's own explainer, approved 2026-08-30.
     *
     * It replaces — never supplements — the Retail pair. Those are a LiDAR point
     * cloud and a store-floor tracking diagram, and the LiDAR image carries
     * burnt-in copy reading "The entire store is scanned in real time", text this
     * application cannot control. Neither may stand in for a centre.
     *
     * Vendor-neutral throughout: the approach is named for the physical
     * principle, and no supplier appears in any customer-facing string. The
     * perception software that performs the matching is deliberately unnamed.
     */
    explainerVisuals: [
      {
        capabilityId: "TECH-04",
        segment: "shopping-centre",
        approachId: "camera-coverage-anonymous-reid",
        approachName: "Camera coverage and anonymous re-identification",
        assetPath:
          "/assets/technology/explainers/shopping-centre-camera-movement-intelligence.png",
        altText:
          "A shopping-centre atrium seen from an upper level, with a fountain, escalators and shopfronts on two floors. Four small dome cameras each cast a soft translucent purple field of view over a different part of the concourse, and the fields do not meet — much of the floor is outside them. Some of the people walking below carry a small purple ring at their feet, and dashed purple lines link a few of those rings between one covered area and the next. No face is framed, outlined or marked, and nothing in the image is labelled with a name or a figure.",
        explanation:
          "Compatible cameras cover parts of the centre — entrances, corridors and transitions — not all of it. Perception software can anonymously re-identify the same observed appearance across compatible covered camera views and match those observations to each other. This allows movement between covered areas to be reconstructed as routes and transitions, without creating a record of a person.",
        // The scene contains small dome cameras, so the default caption's "not a
        // picture of equipment" would be inaccurate here. This says the same
        // thing the default is protecting — no customer data, no product claim —
        // in words that match the artwork.
        illustrationNote:
          "Illustration of the measurement principle. Not customer data or a depiction of a specific hardware implementation.",
        illustratesImplementationId: null,
        showsSensorHardware: false,
        illustrative: true,
        // The scene carries fictional tenant fascia signage ("FASHION AVENUE",
        // "BEAUTY"), which is depicted environment rather than explanatory copy.
        // The flag marks burnt-in EXPLANATION, and there is none here.
        hasEmbeddedText: false,
      },
    ],
    /**
     * The TECH-04 video is "LiDAR in a store": its own action label, intro and
     * description say "store" four times between them, and its follow-on repeats
     * it. Withheld here rather than re-captioned, because the footage is a store.
     */
    allowCapabilityVideo: false,
    /**
     * Shown as no implementation rather than the wrong one. TECH-04's only
     * implementations in `technology.ts` are RoboSense Airy (3D LiDAR) and Xovis
     * PF-L (3D stereo vision) — both 3D sensors, and neither is how a centre is
     * measured. The camera analytics that would belong here declares TECH-02,
     * TECH-03 and TECH-05 and does NOT declare TECH-04, so there is no honest
     * implementation to resolve for this segment yet. Narrowing to none states
     * that; adding one would be a claim this model does not support.
     */
    implementationIds: [],
    note: "Implementation-specific details available on request",
    sourceRefs: [
      `${salesDirection}: §22 Configure direction — visual explanation of a capability`,
      "Product correction, 2026-08-29: centre movement is camera-based, not LiDAR",
    ],
  },
  {
    segment: "retail-park",
    capabilityId: "TECH-06",
    /**
     * WHY RETAIL PARK NARROWS TECH-06
     *
     * TECH-06 resolves four implementations. Three of them are what a retail
     * park's two vehicle scenes are actually built on — the arrival-counting
     * method class, the parking-occupancy method class, and the ANPR camera
     * that Scenes 2 and 3 already show the reader.
     *
     * The fourth, `impl-lawful-anpr-lpr`, is by its own role a "conditional
     * lawful origin or access method". It belongs to
     * `retail-park-vehicle-origin`, which the typed model declares
     * `priority: "advanced"` and which the segment's Configure contract does
     * not require. Left unnarrowed it would resolve onto the DEFAULT Configure
     * path under two separate directions, putting a licence-plate origin branch
     * in front of every prospect who opens "How we do this" — before anyone has
     * established that it is lawful, configured and supported at that site.
     *
     * This narrows; it adds nothing. The branch is not deleted from the model,
     * it is simply not part of this stage, and one alignment note in
     * `solution-directions-retail-park.ts` says so in the prospect's own words.
     *
     * NOT NARROWED: the Tattile camera stays. It is the sensing the two
     * approved Core scenes depict, and it carries its own denials with it —
     * that a vehicle is not a visitor, that a plate is not anonymous, that a
     * registration country is not a home address, and that its vehicle
     * attributes are optional rather than standard. Removing it would leave
     * this segment's most physical direction with nothing but two abstract
     * method classes, which would be a less honest page, not a safer one.
     */
    implementationIds: [
      "impl-vehicle-arrival-method",
      "impl-parking-occupancy-method",
      "impl-tattile-anpr-vehicle",
    ],
    sourceRefs: [
      `${salesDirection}: §22 Configure direction — capability to possible implementation`,
      "SEGMENT-STORY-ARCHITECTURE.md: Retail Park — vehicle origin is an advanced branch, not Core",
    ],
  },
  {
    segment: "outlet-centre",
    capabilityId: "TECH-04",
    /**
     * WHY THIS OVERRIDE EXISTS (Gate 8, technology-layer wiring)
     *
     * TECH-04's only approved example footage is `capabilityExplainerVideos`'
     * "LiDAR in a store": its own action label, intro and description say
     * "store" four times between them, and it was withheld from Shopping
     * Centre for exactly that reason (see the sibling override above). Outlet
     * Centre is not a store either — Gate 6's own asset decisions describe it
     * as an open-air destination of streets, plazas and covered units — so the
     * same mismatch applies here the moment the video is wired into a
     * customer-facing drawer, which it was not before this gate.
     *
     * NOT NARROWED: implementations and explainers. Gate 6 raised no doubt
     * about the sensing itself — RoboSense Airy and Xovis PF-L are the same 3D
     * sensor family Retail uses, and Outlet declares no dedicated explainer
     * image the way Shopping Centre does, so both stay exactly as the shared
     * model already resolves them. This override withholds ONE piece of
     * footage whose own words contradict the segment; it changes nothing else.
     */
    allowCapabilityVideo: false,
    sourceRefs: [
      "Gate 8 finding: capabilityExplainerVideos' TECH-04 entry names \"store\" in actionLabel, intro and description",
      "docs/design/OUTLET-ASSET-MAPPING.md: Outlet Centre is an open-air destination, not a store",
    ],
  },

  /* ======================================================================
     APPROVED CONFIGURE, HELD STILL — 2026-09-27.

     The two IP detection sensors entered the model linked to TECH-02 to
     TECH-05, so every consumer that reads a capability unnarrowed now sees
     them. The drawer is meant to — the product lead said which sensor answers
     which question, and `scene-drawer-overrides.ts` carries that. The approved
     Configure previews (Retail, Shopping Centre, Retail Park) were not part
     of that direction, so these lists restate exactly what they resolved
     before, and nothing more.

     Remove a line here and that Configure preview starts offering both IP
     detection sensors, indoor AND outdoor — which is why this is explicit
     rather than implied.
     ====================================================================== */
  {
    segment: "retail",
    capabilityId: "TECH-02",
    implementationIds: ["impl-xovis-3d-entrance", "impl-milesight-vs125p-entrance", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "retail",
    capabilityId: "TECH-03",
    implementationIds: ["impl-configured-classification", "impl-milesight-vs125p-entrance", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "retail",
    capabilityId: "TECH-04",
    implementationIds: ["impl-lidar-spatial", "impl-xovis-3d-spatial"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "retail",
    capabilityId: "TECH-05",
    implementationIds: ["impl-anonymous-visit-matching", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "shopping-centre",
    capabilityId: "TECH-02",
    implementationIds: ["impl-xovis-3d-entrance", "impl-milesight-vs125p-entrance", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "shopping-centre",
    capabilityId: "TECH-03",
    implementationIds: ["impl-configured-classification", "impl-milesight-vs125p-entrance", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "shopping-centre",
    capabilityId: "TECH-05",
    implementationIds: ["impl-anonymous-visit-matching", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "retail-park",
    capabilityId: "TECH-02",
    implementationIds: ["impl-xovis-3d-entrance", "impl-milesight-vs125p-entrance", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "retail-park",
    capabilityId: "TECH-03",
    implementationIds: ["impl-configured-classification", "impl-milesight-vs125p-entrance", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "retail-park",
    capabilityId: "TECH-04",
    implementationIds: ["impl-lidar-spatial", "impl-xovis-3d-spatial"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
  {
    segment: "retail-park",
    capabilityId: "TECH-05",
    implementationIds: ["impl-anonymous-visit-matching", "impl-isarsoft-camera-analytics"],
    sourceRefs: ["Approved Configure previews held unchanged while the drawer follows the product lead's per-scene direction, 2026-09-27"],
  },
];

export function getSegmentCapabilityMediaOverride(
  segment: SegmentId,
  capabilityId: TechnologyCapabilityId,
): SegmentCapabilityMediaOverride | null {
  return (
    segmentCapabilityMediaOverrides.find(
      (override) => override.segment === segment && override.capabilityId === capabilityId,
    ) ?? null
  );
}
