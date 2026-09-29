/**
 * Canvas geometry for the Shopping Centre redesign pilot.
 *
 * Plain data, deliberately: no JSX and no React, so the test suite can import
 * these values and assert them instead of parsing the component's source. A
 * coordinate that drifts off its subject is a defect, and a defect should be
 * caught by reading the number rather than by reading a regular expression.
 */

export const V = "/assets/location-visuals/shopping-centre/";

/**
 * One approved production hero per Core scene — the SAME asset each approved
 * scene component already uses, read from those components rather than chosen
 * by filename. Every one was opened and looked at before it was used here.
 *
 * Three of them (brand counting, brand flow, time in centre) carry fictional
 * tenant fascia. That is depicted environment: the alt text says it is
 * fictional, and nothing in this pilot reads a fascia name as data.
 */
export const HEROES: Readonly<Record<string, string>> = {
  "shopping-centre-catchment-area": `${V}shopping-centre-geo-intelligence-hero.png`,
  "shopping-centre-entrances": `${V}shopping-centre-visitors-hero.png`,
  "shopping-centre-visitor-composition": `${V}shopping-centre-visitor-composition-hero.png`,
  "shopping-centre-internal-circulation": `${V}shopping-centre-spatial-journey-hero.png`,
  "shopping-centre-zone-anchor-exposure": `${V}shopping-centre-brand-journey-hero.png`,
  "shopping-centre-brand-counting": `${V}shopping-centre-brand-counting-hero.png`,
  "shopping-centre-brand-flow": `${V}shopping-centre-visitor-brand-flow-hero.png`,
  "shopping-centre-time-in-centre": `${V}shopping-centre-time-in-centre-hero.png`,
};

/**
 * The natural size of each asset, so the canvas can hold that exact ratio and
 * a hotspot cannot drift off the thing it points at. Two shapes are in use:
 * 1920x1080 and 1672x941.
 */
export const ASSET_SIZE: Readonly<Record<string, { w: number; h: number }>> = {
  "shopping-centre-catchment-area": { w: 1920, h: 1080 },
  "shopping-centre-entrances": { w: 1920, h: 1080 },
  "shopping-centre-visitor-composition": { w: 1672, h: 941 },
  "shopping-centre-internal-circulation": { w: 1920, h: 1080 },
  "shopping-centre-zone-anchor-exposure": { w: 1920, h: 1080 },
  "shopping-centre-brand-counting": { w: 1672, h: 941 },
  "shopping-centre-brand-flow": { w: 1672, h: 941 },
  "shopping-centre-time-in-centre": { w: 1672, h: 941 },
};

/**
 * Where each subject sits ON its own approved asset, in that asset's own pixel
 * coordinates.
 *
 * Placed by opening each image and finding the thing the subject is about. A
 * scene appears here ONLY when at least two of its subjects are genuinely
 * visible and can be pointed at honestly; the rest use the evidence layer, and
 * no hotspot exists anywhere purely to make the scenes look alike.
 *
 *   catchment    the asset in the middle of the aerial, and the reach around it
 *   circulation  the concourse floor, the escalator bank, an anchor frontage
 *   exposure     the open floor zones, and an anchor frontage
 *   brand count  a covered store threshold, and a store frontage boundary
 *   brand flow   the connecting path across the gallery, and a covered frontage
 */
export interface SceneHotspot {
  id: string;
  x: number;
  y: number;
  side: "left" | "right";
  vertical: "above" | "below";
}

export const HOTSPOTS: Readonly<Record<string, readonly SceneHotspot[]>> = {
  /* Each point sits on the EDGE of its subject and its card opens away from it.
     Placing the point in the middle put the card on top of the very rectangle
     it was explaining — the anchor frontage disappeared behind its own
     description. */
  "shopping-centre-catchment-area": [
    { id: "asset", x: 940, y: 445, side: "right", vertical: "below" },
    { id: "reach", x: 1480, y: 470, side: "left", vertical: "above" },
  ],
  "shopping-centre-internal-circulation": [
    { id: "movement", x: 860, y: 660, side: "right", vertical: "above" },
    { id: "transitions", x: 1035, y: 610, side: "right", vertical: "below" },
    { id: "distribution", x: 1560, y: 650, side: "left", vertical: "below" },
  ],
  "shopping-centre-zone-anchor-exposure": [
    { id: "zones", x: 900, y: 690, side: "right", vertical: "above" },
    { id: "anchors", x: 1520, y: 630, side: "left", vertical: "below" },
  ],
  "shopping-centre-brand-counting": [
    { id: "threshold", x: 795, y: 700, side: "right", vertical: "above" },
    // Opens upward: the French and German bodies are taller, and downward the
    // card ran off the bottom of the image.
    { id: "boundary", x: 1500, y: 660, side: "left", vertical: "above" },
  ],
  "shopping-centre-brand-flow": [
    { id: "between", x: 700, y: 560, side: "right", vertical: "above" },
    { id: "covered", x: 1420, y: 660, side: "left", vertical: "above" },
  ],
};

