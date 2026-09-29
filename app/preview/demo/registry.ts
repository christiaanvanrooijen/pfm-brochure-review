/**
 * What each segment's Core journey shows, and where it ends.
 *
 * ONE REGISTRY, FIVE SEGMENTS
 *
 * Scene order, scene count, branches and next destinations are NEVER listed
 * here — they are read from `app/content/segments/*` at render time. This file
 * carries only what the model cannot know: which picture belongs beside which
 * scene, whether that picture has a place worth pointing at, and which ending
 * the segment has earned.
 *
 * REUSE
 *
 * Shopping Centre and QSR keep the exact media modules their accepted redesigns
 * already use, imported rather than restated. Retail and Retail Park take the
 * heroes their approved production scenes already carry, read from those
 * components. Outlet takes the Gate 6 decisions, including the four scenes that
 * have no photograph and are carried by a typed diagram instead.
 */

import { HEROES as SC_HEROES, ASSET_SIZE as SC_ASSET, HOTSPOTS as SC_HOTSPOTS } from "../redesign/shopping-centre-circulation/geometry.ts";
import { QSR_HERO, QSR_ASSET, QSR_HOTSPOTS, QSR_MODE, QSR_GEOMETRY } from "../redesign/qsr-journey/media.ts";
import { outletSceneAssetDecisions } from "../../content/outlet-asset-decisions.ts";
import { sceneModes as SC_MODE, sceneFocusOrder as SC_FOCUS } from "../../i18n/scenes.ts";
import { qsrFocusOrder as QSR_FOCUS } from "../../i18n/qsr-journey.ts";
import type { SegmentId } from "../../content/types.ts";

const RET = "/assets/location-visuals/retail/";
const RP = "/assets/location-visuals/retail-park/";

export interface SceneHotspot {
  id: string;
  x: number;
  y: number;
  side: "left" | "right";
  vertical: "above" | "below";
}

export interface SceneMedia {
  /** Web path, or null where a typed diagram carries the scene instead. */
  hero: string | null;
  asset: { w: number; h: number };
  mode: "hotspots" | "layer";
  hotspots: readonly SceneHotspot[];
  /** Evidence geometry, keyed `sceneId:focusId`. */
  geometry?: Readonly<Record<string, { x: number; y: number; w: number; h: number }>>;
  /** Set where a diagram stands in for a photograph. */
  diagram?: "aggregate-context" | "origin-source" | "access-points" | "entrance-line";
}

/* ---------------------------------------------------------------- RETAIL */

/**
 * The heroes the approved Retail scene components already carry, plus the
 * storefront frame for street opportunity — the one Core scene with no approved
 * component, whose frame the adjacent store-visits scene already uses and whose
 * subject (passing street, frontage, entries turning in) is exactly this scene.
 */
const RETAIL_MEDIA: Readonly<Record<string, SceneMedia>> = {
  "retail-street-opportunity": {
    hero: `${RET}retail-capture-storefront-hero-v2.png`,
    asset: { w: 1672, h: 941 },
    mode: "hotspots",
    hotspots: [{ id: "street", x: 1080, y: 645, side: "left", vertical: "above" }],
    geometry: { "retail-street-opportunity:street": { x: 950, y: 250, w: 265, h: 395 } },
  },
  "retail-store-visits": {
    // Gate 9: own hero (was sharing street-opportunity's frame). Threshold
    // ring under the entering visitor's feet, framed by the door uprights.
    hero: `${RET}retail-visitors-hero.png`,
    asset: { w: 1672, h: 941 },
    mode: "hotspots",
    hotspots: [{ id: "threshold", x: 870, y: 700, side: "left", vertical: "above" }],
    geometry: { "retail-store-visits:threshold": { x: 660, y: 520, w: 480, h: 420 } },
  },
  "retail-visitor-composition": {
    // Gate 9: own hero (was sharing the visitor-northstar frame with no
    // scene it was actually shot for). Distinct visitor types, each with
    // their own anonymous floor marker.
    hero: `${RET}retail-visitor-composition-hero.png`,
    asset: { w: 1672, h: 941 },
    // Classification is about people. Nothing here may be pointed at.
    mode: "layer",
    hotspots: [],
  },
  "retail-in-store-journey": {
    // Gate 9: own hero (was sharing one frame across three scenes).
    hero: `${RET}retail-instore-movement-hero.png`,
    asset: { w: 1672, h: 941 },
    mode: "layer",
    hotspots: [],
  },
  "retail-zone-engagement": {
    // Gate 9: own hero. Hotspot on the central dwell ring, framed tight so
    // the two side rings stay legible without being pointed at.
    hero: `${RET}retail-instore-zone-hero.png`,
    asset: { w: 1672, h: 941 },
    mode: "hotspots",
    hotspots: [{ id: "measured", x: 900, y: 715, side: "right", vertical: "above" }],
    geometry: { "retail-zone-engagement:measured": { x: 570, y: 470, w: 600, h: 420 } },
  },
  "retail-conversion-sales-context": {
    // Gate 9: own hero. The journey trail now visibly arrives at a checkout.
    hero: `${RET}retail-conversion-hero.png`,
    asset: { w: 1672, h: 941 },
    // Conversion is a relationship between two aligned inputs, not a place.
    mode: "layer",
    hotspots: [],
  },
};

/* ----------------------------------------------------------- RETAIL PARK */

const RP_MEDIA: Readonly<Record<string, SceneMedia>> = {
  "retail-park-catchment-area": {
    hero: `${RP}retail-park-geo-intelligence-hero.png`,
    asset: { w: 1920, h: 1080 },
    mode: "hotspots",
    hotspots: [
      { id: "asset", x: 900, y: 630, side: "left", vertical: "below" },
      { id: "reach", x: 1480, y: 310, side: "left", vertical: "below" },
    ],
    geometry: {
      "retail-park-catchment-area:asset": { x: 420, y: 300, w: 1080, h: 330 },
      "retail-park-catchment-area:reach": { x: 90, y: 110, w: 1740, h: 200 },
    },
  },
  "retail-park-vehicle-arrival": {
    hero: `${RP}retail-park-vehicle-arrival-hero.png`,
    asset: { w: 1672, h: 941 },
    mode: "hotspots",
    // Gate 9: moved off the foreground car (half-clipped by the frame edge)
    // onto the car actually crossing the purple detection line. No geometry
    // box — this frame's own purple line already carries the "measured"
    // evidence; a second rectangle on top of it read as clutter.
    hotspots: [{ id: "measured", x: 950, y: 460, side: "right", vertical: "above" }],
  },
  "retail-park-parking-occupancy": {
    hero: `${RP}retail-park-parking-occupancy-hero.png`,
    asset: { w: 1672, h: 941 },
    mode: "hotspots",
    // Gate 9: no geometry box — this frame already carries baked-in purple
    // occupancy outlines per bay; the app's rectangle on top was redundant.
    hotspots: [{ id: "measured", x: 500, y: 620, side: "right", vertical: "above" }],
  },
  "retail-park-unit-visits": {
    hero: `${RP}retail-park-brand-counting-hero.png`,
    asset: { w: 1672, h: 941 },
    mode: "hotspots",
    hotspots: [{ id: "measured", x: 700, y: 690, side: "right", vertical: "above" }],
    geometry: { "retail-park-unit-visits:measured": { x: 480, y: 380, w: 340, h: 310 } },
  },
  "retail-park-cross-visitation": {
    hero: `${RP}retail-park-visitor-brand-flow-hero.png`,
    asset: { w: 1672, h: 941 },
    // The subject is the transition between units; marking one makes it the finding.
    mode: "layer",
    hotspots: [],
  },
  "retail-park-time-on-site": {
    hero: `${RP}retail-park-time-in-centre-hero.png`,
    asset: { w: 1672, h: 941 },
    mode: "layer",
    hotspots: [],
  },
  "retail-park-unit-category-exposure": {
    hero: `${RP}retail-park-unit-category-exposure-hero.png`,
    asset: { w: 1672, h: 941 },
    mode: "hotspots",
    hotspots: [{ id: "connected", x: 430, y: 640, side: "right", vertical: "below" }],
    geometry: { "retail-park-unit-category-exposure:connected": { x: 90, y: 300, w: 340, h: 340 } },
  },
};

/* ---------------------------------------------------------------- OUTLET */

/**
 * Built from the Gate 6 decisions rather than restated.
 *
 * Four Core scenes have no usable photograph: two because every candidate is
 * another segment's frame, one because origin is not a thing a picture of a
 * place can show, and one because no frame depicts entry to the outlet streets.
 * Those four carry a typed diagram instead of an empty panel — the concept is
 * explainable even when the photograph is not available.
 *
 * The two rejected frames stay rejected: brand counting carries a real brand
 * fascia, and time-in-destination carries malformed signage echoing it. Both
 * fall back to a diagram rather than to a signage restriction quietly ignored.
 */
const OUTLET_DIAGRAMS: Readonly<Record<string, SceneMedia["diagram"]>> = {
  "outlet-centre-destination-catchment": "aggregate-context",
  "outlet-centre-tourism-origin-context": "origin-source",
  "outlet-centre-vehicle-coach-arrival": "access-points",
  "outlet-centre-entrances": "entrance-line",
  "outlet-centre-brand-counting": "entrance-line",
  "outlet-centre-time-in-destination": "aggregate-context",
};

const OUTLET_MEDIA: Readonly<Record<string, SceneMedia>> = Object.fromEntries(
  outletSceneAssetDecisions.map((decision) => {
    const usable = decision.decision === "suitable" && decision.candidatePath;
    return [
      decision.sceneId,
      {
        hero: usable ? decision.candidatePath : null,
        asset: decision.assetSize ?? { w: 1920, h: 1080 },
        mode: decision.focusLocus ? "hotspots" : "layer",
        hotspots: decision.focusLocus
          ? [
              {
                id: decision.focusLocus.focusId,
                x: decision.focusLocus.point.x,
                y: decision.focusLocus.point.y,
                side: decision.focusLocus.point.side,
                vertical: decision.focusLocus.point.vertical,
              },
            ]
          : [],
        geometry: decision.focusLocus
          ? { [`${decision.sceneId}:${decision.focusLocus.focusId}`]: decision.focusLocus.rect }
          : {},
        diagram: usable ? undefined : OUTLET_DIAGRAMS[decision.sceneId],
      } satisfies SceneMedia,
    ];
  }),
);

/**
 * Gate 9: outlet-centre-circulation's own hero already carries the "measured"
 * evidence baked in, as bright purple trajectory lines along the paving. The
 * generic geometry rectangle the Gate 6 decision also specified sat on top of
 * that as a second, redundant box, boxing in a stretch of visible trajectory
 * rather than adding anything. The hotspot point stays; only the rectangle
 * goes.
 */
const OUTLET_MEDIA_PATCHED: Readonly<Record<string, SceneMedia>> = {
  ...OUTLET_MEDIA,
  "outlet-centre-circulation": { ...OUTLET_MEDIA["outlet-centre-circulation"], geometry: {} },
};

/* ------------------------------------------------- SHOPPING CENTRE + QSR */

const SC_MEDIA: Readonly<Record<string, SceneMedia>> = Object.fromEntries(
  Object.keys(SC_HEROES).map((sceneId) => [
    sceneId,
    {
      hero: SC_HEROES[sceneId],
      asset: SC_ASSET[sceneId],
      mode: SC_MODE[sceneId],
      hotspots: SC_HOTSPOTS[sceneId] ?? [],
    } satisfies SceneMedia,
  ]),
);

const QSR_MEDIA: Readonly<Record<string, SceneMedia>> = Object.fromEntries(
  Object.keys(QSR_HERO).map((sceneId) => [
    sceneId,
    {
      hero: QSR_HERO[sceneId],
      asset: QSR_ASSET[sceneId],
      mode: QSR_MODE[sceneId],
      hotspots: QSR_HOTSPOTS[sceneId] ?? [],
      geometry: QSR_GEOMETRY,
    } satisfies SceneMedia,
  ]),
);

export const demoMedia: Readonly<Record<SegmentId, Readonly<Record<string, SceneMedia>>>> = {
  retail: RETAIL_MEDIA,
  "shopping-centre": SC_MEDIA,
  "retail-park": RP_MEDIA,
  "outlet-centre": OUTLET_MEDIA_PATCHED,
  qsr: QSR_MEDIA,
};

export const demoFocusOrder: Readonly<Record<SegmentId, Readonly<Record<string, readonly string[]>>>> = {
  retail: {},
  "shopping-centre": SC_FOCUS,
  "retail-park": {},
  "outlet-centre": {},
  qsr: QSR_FOCUS,
};

/**
 * Where a segment's journey ends.
 *
 * `configure` only where that segment has a real Configure implementation to
 * hand off to. The rest end in a discussion summary that is explicitly not a
 * Configure flow, not a recommendation and not a saved record.
 */
export const demoEnding: Readonly<Record<SegmentId, { kind: "configure"; href: string } | { kind: "summary" }>> = {
  retail: { kind: "configure", href: "/preview/retail-configure" },
  "shopping-centre": { kind: "configure", href: "/preview/shopping-centre-configure" },
  "retail-park": { kind: "configure", href: "/preview/retail-park-configure" },
  "outlet-centre": { kind: "summary" },
  qsr: { kind: "summary" },
};
