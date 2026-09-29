/**
 * SEGMENT START VISUALS — identity and orientation covers.
 *
 * WHY THIS IS A SEPARATE CONCEPT
 *
 * A segment start answers "what kind of place is this, and what are we about to
 * talk about". A Core scene answers "what is measured here, and what may be
 * concluded from it". Those are different jobs, and before this file they were
 * being done by one field: whatever hero the first Core scene carried became
 * the segment's cover by default.
 *
 * That is how Outlet Centre ended up pointed at a Shopping Centre photograph.
 * The catchment scene needed an aerial showing reach, the only outlet "aerial"
 * on disk was the Shopping Centre frame with a different overlay, and because
 * cover and evidence were the same field there was nowhere to put an honest
 * outlet picture that was NOT a claim about catchment.
 *
 * THE DISTINCTION THIS FILE ENFORCES
 *
 * A start visual is a cover. It orients; it proves nothing. It is never
 * evidence for the first Core scene, it may not be read as a measurement of
 * anything, and `isEvidence` is typed as the literal `false` so no future
 * caller can promote one by assignment.
 *
 * A cover still has to be TRUE OF THE SEGMENT: it must depict that kind of
 * place. "Not evidence" lowers what the picture claims; it does not lower
 * whether the picture is honestly of this segment.
 *
 * None of this artwork is a photograph. It is generated illustration, and the
 * captions say so — calling it "photographed" was itself a small false claim,
 * corrected in Gate 6.
 *
 * WHERE A SCENE HERO STILL BELONGS
 *
 * Where the artwork genuinely shows the scene's subject, one image can be both
 * — QSR's drive-thru context frame shows the whole lane, which is exactly what
 * its context scene is about, so it serves as cover AND as that scene's hero.
 * That is a property of the artwork, not a convenience: it is recorded here as
 * `alsoSceneHeroFor`, and left null wherever it is not true.
 */

import type { SceneId, SegmentId } from "./types.ts";

export interface SegmentStartVisual {
  segment: SegmentId;
  /** Web path under `public/`. */
  assetPath: string;
  /** Describes what is pictured. Never a capability or measurement claim. */
  altText: string;
  /** Always false. A cover orients; it is not proof of anything. */
  isEvidence: false;
  /** Always true. Rendered illustration, never customer data. */
  illustrative: true;
  /**
   * The scene this same artwork may also serve as a hero, where the picture
   * genuinely shows that scene's subject. Null where it does not.
   */
  alsoSceneHeroFor: SceneId | null;
  /** Why this file, in one line. Written after opening it. */
  selectionNote: string;
}

export const segmentStartVisuals: readonly SegmentStartVisual[] = [
  {
    segment: "retail",
    assetPath: "/assets/location-visuals/retail/retail-visitors-hero.png",
    altText:
      "A single store at street level, seen from outside. Its glass frontage stands open, mannequins are dressed in the windows, and the shop floor is visible through the doorway. People pass along the pavement and one person walks in through the door. A soft purple line follows the pavement and turns in at the threshold. The fascia carries an invented name, nothing is labelled with a figure, and no number appears anywhere in the picture.",
    isEvidence: false,
    illustrative: true,
    // Deliberately null. Street opportunity is a claim about passers-by and
    // entries — quantities this picture does not show and must not be read as
    // showing. Its scene keeps its own evidence hero.
    alsoSceneHeroFor: null,
    selectionNote:
      "The one retail frame that shows a store as a PLACE — its own frontage, its own door, at street level — rather than a stage of a measurement. Chosen over retail-instore-northstar-hero2.png, which carries baked-in figures and is rejected for cover use entirely.",
  },
  {
    segment: "shopping-centre",
    assetPath: "/assets/location-visuals/shopping-centre/shopping-centre-dwell-hero.png",
    altText:
      "The interior of a multi-level shopping centre: a wide mall floor with lit shopfronts along both sides, escalators rising at the back, a tree in a planter, and a seating island where one person sits. People walk along the floor. Soft purple lines curve across it. No shopfront carries a readable brand name, nothing is labelled with a figure, and no number appears anywhere in the picture.",
    isEvidence: false,
    illustrative: true,
    // Deliberately null. The segment's first Core scene is catchment — reach and
    // origin, which is outside the building. An interior cannot be evidence for
    // it, and the aerial that can is that scene's own hero.
    alsoSceneHeroFor: null,
    selectionNote:
      "Shows what a shopping centre IS — enclosed, multi-level, tenanted — from inside, where the segment's own character lives. Not shopping-centre-visitors-hero.png, which is already the Entrances scene's evidence hero and would arrive at the reader twice in two different roles.",
  },
  {
    segment: "retail-park",
    assetPath: "/assets/location-visuals/retail-park/retail-park-visitors-hero.png",
    altText:
      "An open-air retail park at dusk, at ground level. A row of single-storey units with lit glass frontages stands behind a car park; cars are parked in marked bays, two more are on the access road, and people walk from the parking towards the units. A camera is mounted on a lamp post in the foreground. Soft purple trails follow one car and the walking route. No unit carries a readable brand name, nothing is labelled with a figure, and no number appears anywhere in the picture.",
    isEvidence: false,
    illustrative: true,
    // Deliberately null. This segment's first Core scene is catchment — where
    // visitors travelled from. A ground-level view of the parking shows arrival
    // at the asset, not origin, so it is not that scene's hero.
    alsoSceneHeroFor: null,
    selectionNote:
      "Open-air, single-storey, car-park-fronted — the three things that make a retail park a different kind of place from a shopping centre, all in one frame, and none of them shared with the Shopping Centre artwork.",
  },
  {
    segment: "qsr",
    assetPath: "/assets/location-visuals/qsr/qsr-drive-thru-context-hero.png",
    altText:
      "A single-storey quick-service restaurant at dusk, seen from slightly above. A drive-thru lane runs in from the road, past an order point and along the side of the building, with cars queuing on it. A soft purple line follows the lane. The building carries no readable brand name, nothing is labelled with a figure, and no number appears anywhere in the picture.",
    isEvidence: false,
    illustrative: true,
    // The frame shows the whole lane from entry to the building — which is
    // precisely what the Drive-Thru context scene is about — so here, and only
    // here, one image is honestly both cover and scene hero.
    alsoSceneHeroFor: "qsr-drive-thru-context",
    selectionNote:
      "The only QSR frame showing the complete lane rather than one stage of it, which is what a segment cover has to do.",
  },
  {
    segment: "outlet-centre",
    assetPath: "/assets/location-visuals/outlet-centre/outlet-centre-visitor-brand-flow-hero.png",
    altText:
      "An open-air outlet village at dusk: low stone-fronted units with awnings around a paved plaza, a central archway building, and hills behind. People walk between the units carrying bags. Shopfront signage is blank, no real brand appears, and nothing is labelled with a figure.",
    isEvidence: false,
    illustrative: true,
    // Deliberately null. This is an open-air village at ground level: it shows
    // what an outlet destination IS, and nothing about where anyone travelled
    // from. Destination catchment is a claim about reach and origin, so this
    // picture is not that scene's hero and must never be read as evidence for
    // it.
    alsoSceneHeroFor: null,
    selectionNote:
      "Genuinely Outlet-specific and genuinely outlet-shaped — open-air, low-rise, village-planned. Chosen over outlet-centre-geo-intelligence-hero.png, which is the Shopping Centre photograph with a different overlay (mean pixel difference 1.9) and is rejected for this segment entirely.",
  },
];

export function getSegmentStartVisual(segment: SegmentId): SegmentStartVisual | null {
  return segmentStartVisuals.find((visual) => visual.segment === segment) ?? null;
}

/**
 * Files that may never be used for a segment, with the reason.
 *
 * A rejection is worth typing: without it the next person sees a plausible
 * filename in the right folder and re-adopts it.
 */
export const rejectedSegmentVisuals: readonly {
  segment: SegmentId;
  assetPath: string;
  reason: string;
}[] = [
  {
    segment: "outlet-centre",
    assetPath: "/assets/location-visuals/outlet-centre/outlet-centre-geo-intelligence-hero.png",
    reason:
      "The Shopping Centre photograph with a different purple overlay, not an outlet. Rejected for the Outlet start and for Destination catchment.",
  },
  {
    segment: "retail",
    assetPath: "/assets/location-visuals/retail/retail-instore-northstar-hero2.png",
    reason:
      "Carries figures burnt into the artwork — an entrance count and four engagement percentages. A cover proves nothing, so a picture that already states a measurement cannot be one, whatever caption is placed under it.",
  },
];
