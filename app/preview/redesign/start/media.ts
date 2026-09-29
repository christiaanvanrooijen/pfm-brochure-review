/**
 * Media, geometry and onward handoff for the five segment starts.
 *
 * Plain data, deliberately: no JSX and no React, so tests can assert the values
 * instead of parsing a component.
 *
 * HOW EACH ASSET WAS CHOSEN
 *
 * By opening it. Every file below was rendered and looked at before it was
 * used, and two candidates were rejected on sight:
 *
 *   retail-capture-storefront-01.png       not a photograph at all — a screenshot
 *                                          of an older interface mock-up, complete
 *                                          with red metric cards.
 *   outlet-centre-geo-intelligence-hero    the SHOPPING CENTRE photograph with a
 *                                          different overlay (mean pixel
 *                                          difference 1.9). Five further outlet
 *                                          files duplicate other segments the
 *                                          same way, two of them exactly.
 *
 * So Outlet Centre and QSR carry no photograph. QSR has no asset at all: every
 * QSR visual in `visual-assets.ts` is a placeholder with no path. Both render
 * the absent-media panel instead of borrowing a picture of a different kind of
 * place, which is the rule `segment-capability-media.ts` already states.
 */

export const V = "/assets/location-visuals/";

/**
 * The scene hero for the start's first Core scene — EVIDENCE, not a cover.
 *
 * The cover lives in `segment-start-visuals.ts` and is a different thing. Two
 * segments show that the distinction is real rather than bookkeeping:
 *
 *   QSR             one image serves both, because the drive-thru context frame
 *                   genuinely shows the whole lane its context scene is about.
 *   Outlet Centre   the cover is an outlet village; the catchment scene keeps
 *                   NO hero, because no honest picture of reach exists for it
 *                   and the one file that looks like one is the Shopping Centre
 *                   photograph.
 */
export const START_HERO: Readonly<Record<string, string | null>> = {
  // Used by the approved RetailMeasureScene for the adjacent store-visits
  // scene: a street, a frontage and trails turning in through the door — which
  // is exactly what street opportunity is about.
  "retail-street-opportunity": `${V}retail/retail-capture-storefront-hero-v2.png`,
  // The same asset the accepted redesign journey opens on.
  "shopping-centre-catchment-area": `${V}shopping-centre/shopping-centre-geo-intelligence-hero.png`,
  // Used by the approved RetailParkCatchmentScene for this very scene.
  "retail-park-catchment-area": `${V}retail-park/retail-park-geo-intelligence-hero.png`,
  // The cover is not promoted here: an open-air village is not a picture of
  // where anyone travelled from, and Destination catchment is a claim about
  // reach and origin. The rejected duplicate is not used either.
  "outlet-centre-destination-catchment": null,
  // Cover and hero, because the artwork is honestly both.
  "qsr-drive-thru-context": `${V}qsr/qsr-drive-thru-context-hero.png`,
};

/** The natural size of each asset, so a point cannot drift off its subject. */
export const START_ASSET: Readonly<Record<string, { w: number; h: number }>> = {
  "retail-street-opportunity": { w: 1672, h: 941 },
  "shopping-centre-catchment-area": { w: 1920, h: 1080 },
  "retail-park-catchment-area": { w: 1920, h: 1080 },
  "outlet-centre-destination-catchment": { w: 1920, h: 1080 },
  "qsr-drive-thru-context": { w: 1672, h: 941 },
};

/**
 * How each start is explored. `hotspots` only where the asset genuinely shows
 * the subject; `layer` where an image interaction would be artificial or where
 * there is no image to interact with.
 */
export const START_MODE: Readonly<Record<string, "hotspots" | "layer">> = {
  "retail-street-opportunity": "hotspots",
  "shopping-centre-catchment-area": "hotspots",
  "retail-park-catchment-area": "hotspots",
  // No approved asset for this scene, so nothing to point at.
  "outlet-centre-destination-catchment": "layer",
  // The lane is one continuous subject, and the scene's three focuses are the
  // lane, what the operation supplies, and what may be derived. Only the first
  // is a place, and a single `+` on a lane the whole picture already shows adds
  // nothing — so this stays an evidence layer.
  "qsr-drive-thru-context": "layer",
};

export interface StartHotspot {
  id: string;
  x: number;
  y: number;
  side: "left" | "right";
  vertical: "above" | "below";
}

/**
 * Where a subject sits ON its own asset, in that asset's pixel coordinates.
 *
 * A focus appears here ONLY when it has a defensible spatial locus. Retail's
 * `connected` (store hours, campaigns, weather) and `derived` (capture rate)
 * have none — an opening hour is not somewhere and a rate is not a place — so
 * those focuses show no `+` at all rather than one invented for symmetry.
 */
export const START_HOTSPOTS: Readonly<Record<string, readonly StartHotspot[]>> = {
  // The doorway, where the two physical signals meet: passers-by outside it,
  // entries through it.
  "retail-street-opportunity": [
    { id: "measured", x: 1080, y: 645, side: "left", vertical: "above" },
  ],
  "shopping-centre-catchment-area": [
    { id: "asset", x: 940, y: 445, side: "right", vertical: "below" },
    { id: "reach", x: 1480, y: 470, side: "left", vertical: "above" },
  ],
  "retail-park-catchment-area": [
    { id: "asset", x: 900, y: 630, side: "left", vertical: "below" },
    { id: "reach", x: 1480, y: 310, side: "left", vertical: "below" },
  ],
  "outlet-centre-destination-catchment": [],
  "qsr-drive-thru-context": [],
};

/**
 * Where a start's cover comes from. Resolved through the typed concept so a
 * cover can never be set here by hand.
 */
export { getSegmentStartVisual } from "../../../content/segment-start-visuals";

/**
 * The natural size of each segment's COVER, which is a different picture from
 * that segment's scene hero and therefore a different rectangle.
 *
 * Kept separate from `START_ASSET` for the reason the geometry exists at all:
 * the frame positions everything it draws in the asset's own pixel coordinates,
 * so handing it the hero's dimensions while it renders the cover would place
 * every point and outline against the wrong picture. Nothing is drawn on a
 * cover — see `start.tsx` — but the size still has to describe what is on
 * screen.
 */
export const COVER_ASSET: Readonly<Record<string, { w: number; h: number }>> = {
  retail: { w: 1672, h: 941 },
  "shopping-centre": { w: 1920, h: 1080 },
  "retail-park": { w: 1920, h: 1080 },
  "outlet-centre": { w: 1672, h: 941 },
  qsr: { w: 1672, h: 941 },
};

/**
 * Onward handoff.
 *
 * `redesign` continues inside the accepted journey and carries the chosen
 * language with it. `preview` leaves for an approved current preview, which is
 * neither redesigned nor localized — the start says so in words before the
 * click. `none` means no onward preview exists for that segment yet, and the
 * start says that too rather than offering a dead link.
 */
export type StartHandoff =
  | { kind: "redesign"; sceneId: string }
  | { kind: "preview"; href: string }
  | { kind: "none" };

export const START_HANDOFF: Readonly<Record<string, StartHandoff>> = {
  "shopping-centre-catchment-area": { kind: "redesign", sceneId: "shopping-centre-entrances" },
  "retail-park-catchment-area": { kind: "preview", href: "/preview/retail-park-vehicle-arrival" },
  // retail-store-visits, outlet-centre-tourism-origin-context and qsr-queue
  // have no preview route in this repository.
  "retail-street-opportunity": { kind: "none" },
  "outlet-centre-destination-catchment": { kind: "none" },
  "qsr-drive-thru-context": { kind: "none" },
};
