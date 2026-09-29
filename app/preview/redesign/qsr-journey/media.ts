/**
 * Media and geometry for the QSR Core journey.
 *
 * Plain data so tests can assert the values instead of parsing a component.
 *
 * EVERY HERO WAS OPENED BEFORE IT WAS WIRED
 *
 * Scene order and capability ids come from `app/content/segments/qsr.ts`; the
 * filename convention happens to match the scene id, and that is a convention,
 * not a source. Nothing here is resolved from a filename.
 *
 * WHERE A `+` IS HONEST, AND WHERE IT IS NOT
 *
 * Two scenes only, and in both the point sits on EQUIPMENT:
 *
 *   queue   the menu board and order point, which is the visible end of the
 *           measured queue boundary
 *   order   the order post itself
 *
 * The other four use the evidence layer, each for its own reason:
 *
 *   context     an overview of the whole site; the subject is the entire route,
 *               and a point on one part of it would narrow the scene
 *   bottleneck  its contrasting areas are a conceptual stage comparison, not a
 *               lane layout — pointing at one would turn a comparison into a
 *               map, and the artwork explicitly is not one
 *   respond     the link runs to a crew member. A point on a person implies a
 *               measured subject, which is exactly what this segment's boundary
 *               denies
 *   estate      the subject is the comparison BETWEEN restaurants; a point on
 *               one singles it out and implies it is the finding
 */

const V = "/assets/location-visuals/qsr/";

/** One inspected QSR hero per Core scene. */
export const QSR_HERO: Readonly<Record<string, string>> = {
  "qsr-drive-thru-context": `${V}qsr-drive-thru-context-hero.png`,
  "qsr-queue": `${V}qsr-queue-hero.png`,
  "qsr-order": `${V}qsr-order-hero.png`,
  "qsr-bottleneck": `${V}qsr-bottleneck-hero.png`,
  "qsr-respond": `${V}qsr-respond-hero.png`,
  "qsr-estate": `${V}qsr-estate-hero.png`,
};

/** Every QSR asset is 1672x941. Held per scene so a drop-in cannot drift. */
export const QSR_ASSET: Readonly<Record<string, { w: number; h: number }>> = {
  "qsr-drive-thru-context": { w: 1672, h: 941 },
  "qsr-queue": { w: 1672, h: 941 },
  "qsr-order": { w: 1672, h: 941 },
  "qsr-bottleneck": { w: 1672, h: 941 },
  "qsr-respond": { w: 1672, h: 941 },
  "qsr-estate": { w: 1672, h: 941 },
};

export const QSR_MODE: Readonly<Record<string, "hotspots" | "layer">> = {
  "qsr-drive-thru-context": "layer",
  "qsr-queue": "hotspots",
  "qsr-order": "hotspots",
  "qsr-bottleneck": "layer",
  "qsr-respond": "layer",
  "qsr-estate": "layer",
};

export interface QsrHotspot {
  id: string;
  x: number;
  y: number;
  side: "left" | "right";
  vertical: "above" | "below";
}

export const QSR_HOTSPOTS: Readonly<Record<string, readonly QsrHotspot[]>> = {
  "qsr-drive-thru-context": [],
  // The menu board and order point, top of frame: the end of the measured
  // queue boundary, and the only one of its two boundaries that is visible.
  // Gate 9: recalibrated onto the actual menu board sign in the current
  // hero (the old x/y sat on bare wall above it, off a prior crop of this
  // photo) — still the boundary equipment, deliberately not a vehicle.
  "qsr-queue": [{ id: "measured", x: 1010, y: 240, side: "left", vertical: "below" }],
  // The order post. Deliberately the post and not the driver beside it.
  "qsr-order": [{ id: "stagePoints", x: 1000, y: 620, side: "left", vertical: "above" }],
  "qsr-bottleneck": [],
  "qsr-respond": [],
  "qsr-estate": [],
};

/**
 * Where the selected typed evidence has a defensible spatial locus.
 *
 * Both are equipment. Neither outlines a vehicle, a person or a lane: the lane
 * is precisely what queue time may NOT be inferred from, so drawing it would
 * illustrate the error the scene's own boundary warns about.
 */
export const QSR_GEOMETRY: Readonly<Record<string, { x: number; y: number; w: number; h: number }>> = {
  "qsr-queue:measured": { x: 980, y: 195, w: 95, h: 130 },
  "qsr-order:stagePoints": { x: 1000, y: 120, w: 165, h: 690 },
};
