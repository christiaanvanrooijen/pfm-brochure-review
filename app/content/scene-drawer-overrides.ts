/**
 * How the "How does this work?" drawer explains a capability, where the
 * product lead has said so — per segment, and per scene where one segment
 * needs two answers.
 *
 * WHY A SECOND, NARROWER LAYER
 *
 * `segment-capability-media.ts` decides how a capability is explained per
 * SEGMENT. That is right almost everywhere, and not quite right in a few
 * scenes: in a shopping centre, "How do visitors move across floors" and
 * "Where do visitors dwell" both declare spatial movement, but the product lead
 * answers the first by counting with 3D sensors above access routes and the
 * second with camera re-identification. One segment-wide setting cannot say
 * both. This file says it per scene — for the handful of scenes that need it.
 *
 * WHAT IT MAY DO
 *
 *   capabilityIds   Replace the list the drawer explains for this scene. May
 *                   name a capability the scene does not declare: this is the
 *                   product lead stating HOW a question is answered, which is
 *                   exactly what the drawer exists to show.
 *   implementations Narrow further within a capability. Never widen: an id
 *                   here must already survive the segment's own narrowing.
 *   purpose         The scene-specific explanation, in all three languages at
 *                   once, so no language can fall back to another scene's text.
 *
 * WHY THE DRAWER HAS ITS OWN SEGMENT LAYER
 *
 * `segment-capability-media.ts` is read by the drawer AND by the approved
 * Configure previews. On 2026-09-27 the product lead named which sensor answers
 * each question in the drawer; the Configure previews were not part of that
 * direction. So the drawer's per-segment choices live here, and the shared
 * file holds Configure exactly where it was. The two can be brought together
 * with one decision, rather than having drifted apart by accident.
 *
 * A drawer list REPLACES the shared list for the drawer, but is still bound by
 * the model: every id must be an implementation `technology.ts` links to that
 * capability. It chooses among real options; it cannot invent one.
 *
 * WHAT IT MAY NOT DO
 *
 * Touch the typed scene. `scene.technologyCapabilityIds` still says what it
 * said, so the frozen Retail and Shopping Centre scenes, the approved shell and
 * every requirement derived from a scene's evidence are unaffected. Only the
 * redesign drawer reads this file.
 */

import type {
  SceneId,
  SegmentId,
  TechnologyCapabilityId,
  TechnologyImplementationId,
} from "./types.ts";
import type { Locale } from "../i18n/locales.ts";
import type { CapabilityExplainerVisual } from "./technology-visuals.ts";

export interface SceneCapabilitySetting {
  implementationIds?: readonly TechnologyImplementationId[];
  purpose?: Readonly<Record<Locale, string>>;
}

export interface SceneDrawerOverride {
  sceneId: SceneId;
  capabilityIds: readonly TechnologyCapabilityId[];
  capabilities?: Readonly<Partial<Record<TechnologyCapabilityId, SceneCapabilitySetting>>>;
  /** Why this scene differs from its segment, in one line. */
  reason: string;
}

const lead = "Product lead direction, 2026-09-27";

export const sceneDrawerOverrides: readonly SceneDrawerOverride[] = [
  {
    sceneId: "retail-park-unit-visits",
    capabilityIds: ["TECH-02"],
    capabilities: {
      "TECH-02": {
        purpose: {
          en: "Explain how a Basic or Premium 3D sensor above a unit's entrance counts visitors accurately — at exactly the entrances you choose to measure.",
          fr: "Expliquer comment un capteur 3D Basic ou Premium placé au-dessus de l'entrée d'une cellule compte précisément les visiteurs — exactement aux entrées que vous choisissez de mesurer.",
          de: "Erklären, wie ein Basic- oder Premium-3D-Sensor über dem Eingang einer Einheit Besucher genau zählt — an genau den Eingängen, die Sie messen möchten.",
        },
      },
    },
    reason: `${lead}: unit visits are counted accurately with Basic or Premium 3D, wherever the owner wants to measure.`,
  },
  {
    sceneId: "outlet-centre-entrances",
    capabilityIds: ["TECH-02"],
    capabilities: {
      "TECH-02": {
        purpose: {
          en: "Explain how visitors are counted accurately at the outlet's entrances — with a Basic or Premium 3D sensor overhead, or with an IP detection sensor.",
          fr: "Expliquer comment les visiteurs sont comptés précisément aux entrées de l'outlet — avec un capteur 3D Basic ou Premium en surplomb, ou avec un capteur de détection IP.",
          de: "Erklären, wie Besucher an den Eingängen des Outlets genau gezählt werden — mit einem Basic- oder Premium-3D-Sensor über Kopf oder mit einem IP-Detektionssensor.",
        },
      },
    },
    reason: `${lead}: outlet entrances are counted accurately with Basic 3D, Premium 3D or IP detection.`,
  },
  {
    sceneId: "shopping-centre-internal-circulation",
    capabilityIds: ["TECH-02"],
    capabilities: {
      "TECH-02": {
        implementationIds: ["impl-xovis-3d-entrance", "impl-milesight-vs125p-entrance"],
        purpose: {
          en: "Explain how 3D sensors above access routes, floor transitions and zone boundaries count the visitors moving between them.",
          fr: "Expliquer comment des capteurs 3D placés au-dessus des accès, des transitions entre niveaux et des limites de zones comptent les visiteurs qui passent de l'un à l'autre.",
          de: "Erklären, wie 3D-Sensoren über Zugangswegen, Etagenübergängen und Zonengrenzen die Besucher zählen, die sich zwischen ihnen bewegen.",
        },
      },
    },
    reason: `${lead}: movement across floors is counted with Basic or Premium 3D sensors above access routes, not reconstructed from camera views.`,
  },
  {
    sceneId: "shopping-centre-brand-counting",
    capabilityIds: ["TECH-02"],
    capabilities: {
      "TECH-02": {
        purpose: {
          en: "Explain how a sensor above each store entrance counts the visitors who actually walk in.",
          fr: "Expliquer comment un capteur placé au-dessus de chaque entrée de magasin compte les visiteurs qui y entrent réellement.",
          de: "Erklären, wie ein Sensor über jedem Store-Eingang die Besucher zählt, die tatsächlich hineingehen.",
        },
      },
    },
    reason: `${lead}: a store visit is a store visitor count — the camera-movement illustration belongs to dwell and brand flow, not here.`,
  },
  {
    sceneId: "outlet-centre-brand-counting",
    capabilityIds: ["TECH-02"],
    capabilities: {
      "TECH-02": {
        purpose: {
          en: "Explain how visitors entering each store unit are counted — with a 3D sensor above the door, or with an IP detection sensor whose view can also serve re-identification.",
          fr: "Expliquer comment les visiteurs qui entrent dans chaque cellule sont comptés — avec un capteur 3D au-dessus de la porte, ou avec un capteur de détection IP dont la vue peut aussi servir à la ré-identification.",
          de: "Erklären, wie Besucher gezählt werden, die eine Store-Einheit betreten — mit einem 3D-Sensor über der Tür oder mit einem IP-Detektionssensor, dessen Ansicht auch der Wiedererkennung dienen kann.",
        },
      },
    },
    reason: `${lead}: brand visits are counted per store unit with Basic or Premium 3D, or with IP detection that doubles for re-identification.`,
  },
  {
    sceneId: "outlet-centre-brand-flow",
    capabilityIds: ["TECH-05"],
    reason: `${lead}: movement between brands is measured only with an IP detection sensor per store, with re-identification.`,
  },
  {
    sceneId: "outlet-centre-time-in-destination",
    capabilityIds: ["TECH-05", "TECH-06"],
    capabilities: {
      "TECH-06": {
        implementationIds: ["impl-tattile-anpr-vehicle"],
        purpose: {
          en: "Explain how time in the destination can be measured from a registration plate read on arrival and again on departure — a vehicle's time on site, never a visitor's identity.",
          fr: "Expliquer comment le temps passé dans la destination peut être mesuré à partir d'une plaque lue à l'arrivée puis au départ — le temps de présence d'un véhicule, jamais l'identité d'un visiteur.",
          de: "Erklären, wie die Aufenthaltsdauer anhand eines bei Ankunft und erneut bei Abfahrt gelesenen Kennzeichens gemessen werden kann — die Verweildauer eines Fahrzeugs, niemals die Identität eines Besuchers.",
        },
      },
    },
    reason: `${lead}: two ways to measure time in the outlet — ANPR from plate and time between entry and exit, or IP detection with re-identification.`,
  },
];

export function getSceneDrawerOverride(sceneId: string): SceneDrawerOverride | null {
  return sceneDrawerOverrides.find((o) => o.sceneId === sceneId) ?? null;
}


/* ==========================================================================
   PER SEGMENT
   ========================================================================== */

export interface SegmentDrawerSetting {
  segment: SegmentId;
  capabilityId: TechnologyCapabilityId;
  /** Replaces the shared list for the drawer. Bound by `technology.ts` links. */
  implementationIds?: readonly TechnologyImplementationId[];
  purpose?: Readonly<Record<Locale, string>>;
  /** Replaces the shared explainers for the drawer. Each one true of this segment. */
  explainerVisuals?: readonly CapabilityExplainerVisual[];
}

/* Three concepts the product lead approved on 2026-09-26 (Media register,
   "User-approved concept"). Each is drawn in its own segment's kind of place
   and is attached to that segment only. */
const scClassification: CapabilityExplainerVisual = {
  capabilityId: "TECH-03",
  segment: "shopping-centre",
  approachId: "sc-anonymous-classification",
  approachName: "Anonymous visitor groups",
  assetPath: "/assets/technology/explainers/shopping-centre-anonymous-classification-explainer.png",
  altText:
    "A bright shopping-centre concourse seen from behind the shoppers. Soft coloured frames surround a person walking alone, a couple walking together, a person with a backpack and a person pushing a pram. Nobody's face is visible and nothing is labelled.",
  explanation:
    "Configured analytics sort anonymous shapes into broad visitor groups — someone alone, a couple, a group, someone with a pram. It describes groups, never a person, and only for the attributes a deployment is configured and validated for.",
  illustrationNote: "Illustration of the measurement principle. Not customer data or a depiction of a specific hardware implementation.",
  illustratesImplementationId: null,
  showsSensorHardware: false,
  illustrative: true,
  hasEmbeddedText: false,
};

const scReid: CapabilityExplainerVisual = {
  capabilityId: "TECH-05",
  segment: "shopping-centre",
  approachId: "sc-anonymous-reid",
  approachName: "Anonymous re-identification between views",
  assetPath: "/assets/technology/explainers/shopping-centre-anonymous-re-id-explainer.png",
  altText:
    "Two views side by side inside a shopping centre: on the left a person walks in through the entrance, on the right the same person walks down a corridor. The same frame surrounds them in both views. They are seen from behind and nothing is labelled.",
  explanation:
    "The same observed appearance is matched between two separate camera views — here an entrance and a corridor — within a short window and inside configured coverage only. That match turns two observations into one anonymous movement, without learning who anyone is.",
  illustrationNote: "Illustration of the measurement principle. Not customer data or a depiction of a specific hardware implementation.",
  illustratesImplementationId: null,
  showsSensorHardware: false,
  illustrative: true,
  hasEmbeddedText: false,
};

const ocClassification: CapabilityExplainerVisual = {
  capabilityId: "TECH-03",
  segment: "outlet-centre",
  approachId: "oc-anonymous-classification",
  approachName: "Anonymous visitor groups",
  assetPath: "/assets/technology/explainers/outlet-centre-anonymous-classification-explainer.png",
  altText:
    "An open-air outlet street at sunset, seen from behind the visitors. Soft coloured frames surround a person walking alone, a couple carrying shopping bags and a person pushing a pram. Nobody's face is visible and nothing is labelled.",
  explanation:
    "Configured analytics sort anonymous shapes into broad visitor groups as they move through the outlet streets — someone alone, a couple, a group, someone with a pram. It describes groups, never a person, and only for the attributes a deployment is configured and validated for.",
  illustrationNote: "Illustration of the measurement principle. Not customer data or a depiction of a specific hardware implementation.",
  illustratesImplementationId: null,
  showsSensorHardware: false,
  illustrative: true,
  hasEmbeddedText: false,
};

/* Seven schematic explainers drawn for the drawer on 2026-09-28
   (scripts/explainer-illustrations.py): the six in docs/content/EXPLAINER-BRIEF.md
   and the Retail classification gap (CONTENT-REVIEW-2026-09-27.md, proposal 5).
   Each is drawn in its own segment's kind of place and attached to that
   segment only. They are line drawings in the brand's glass-layer style, not
   the photographic artwork the brief asks for — the note under each says so,
   and the photographic versions remain a production task. */
const schematicNote =
  "Schematic illustration of the measurement principle. Not customer data, not a real location and not a depiction of specific hardware.";

const schematic = (
  segment: SegmentId,
  capabilityId: TechnologyCapabilityId,
  approachId: string,
  file: string,
  approachName: string,
  altText: string,
  explanation: string,
): CapabilityExplainerVisual => ({
  capabilityId,
  segment,
  approachId,
  approachName,
  assetPath: `/assets/technology/explainers/${file}`,
  altText,
  explanation,
  illustrationNote: schematicNote,
  illustratesImplementationId: null,
  showsSensorHardware: false,
  illustrative: true,
  hasEmbeddedText: false,
});

const retailClassification = schematic(
  "retail",
  "TECH-03",
  "retail-anonymous-classification",
  "retail-anonymous-classification-explainer.svg",
  "Anonymous visitor groups",
  "A line drawing of a store interior seen from above, with tables and a rail. Soft coloured frames surround a person shopping alone, two people together, an adult with a pram and a group of three. The figures have no faces and nothing is labelled.",
  "Configured analytics sort the anonymous shapes coming through the entrance into broad buying units — someone alone, two together, a group, someone with a pram. It describes groups, never a person, and only for the categories a deployment is configured and validated for.",
);

const scThreshold = schematic(
  "shopping-centre",
  "TECH-02",
  "sc-threshold-counting",
  "shopping-centre-threshold-counting-explainer.svg",
  "Counting at a threshold",
  "A line drawing of a shopping-centre concourse, with store fronts and the balustrade of a void to the floor below. A small sensor above one store entrance casts a soft cone across the full width of the threshold, with a line on the floor beneath it. Two people cross it, one going in and one coming out; others walk past along the concourse.",
  "A sensor above the threshold watches its full width. Each person who crosses the line beneath it is counted, and the direction they cross in says whether they went in or came out — a visit, not a passer-by. It counts crossings; it does not identify anyone.",
);

const rpEntrance = schematic(
  "retail-park",
  "TECH-02",
  "rp-unit-entrance-counting",
  "retail-park-unit-entrance-counting-explainer.svg",
  "Counting at a unit entrance",
  "A line drawing of an open-air retail park: two unit fronts with a pavement and a car park in front. A small sensor under the canopy of one unit's entrance casts a soft cone across the doorway, with a line on the ground beneath it. One person walks in and one walks out; others cross the car park.",
  "A sensor above a unit's entrance watches the full width of the door. Each person crossing the line beneath it is counted, in or out, at exactly the entrances chosen for measurement. The rest of the park is not counted by it.",
);

const ocEntrance = schematic(
  "outlet-centre",
  "TECH-02",
  "oc-entrance-counting",
  "outlet-centre-entrance-counting-explainer.svg",
  "Counting at the outlet entrance",
  "A line drawing of an outlet village's entrance gateway, with pitched-roof store units behind it. A small sensor on the gateway beam casts a soft cone across the full width of the passage, with a line on the paving beneath it. Visitors walk through in both directions.",
  "A sensor above the entrance watches the full width of the passage. Each visitor crossing the line beneath it is counted, in or out. The same principle applies at a store door, counting the visitors who actually walk in.",
);

const ocZoneLines = schematic(
  "outlet-centre",
  "TECH-04",
  "oc-zone-counting-lines",
  "outlet-centre-zone-counting-lines-explainer.svg",
  "Counting lines between zones",
  "A line drawing of an open-air outlet street seen from a raised angle, a row of pitched-roof units along it. Three small domes on the buildings each cover one stretch of the street, with uncovered paving between them. A glowing line runs across the street inside each covered stretch, and the visitors crossing those lines are highlighted.",
  "Visitors are counted as they cross configured lines where one street, zone or anchor meets the next. Counting happens only inside the covered views; the street between them is not measured, and nothing is reconstructed across the gaps.",
);

/* Product lead review, 2026-09-29.

   RE-IDENTIFICATION: the approved photographic re-identification explainer is
   the explainer for every segment that measures it, replacing the schematic
   Retail Park and Outlet drawings. The same picture and words, attached to each
   segment explicitly, so a segment still only shows what it was given.

   VEHICLES: arrival is measured with an ANPR sensor or an outdoor IP detection
   sensor, so each open-air segment shows both principles. The pictures are the
   product lead's candidates with every store sign blurred: a real retailer's
   logo in a PFM brochure reads as a customer (AGENTS.md). Their plates, times
   and detection scores are illustrative and flagged as embedded text. */
const reidPhotoFor = (segment: SegmentId): CapabilityExplainerVisual => ({ ...scReid, segment });

const vehicleNote =
  "Illustration of the measurement principle. The place, plates, times and scores are illustrative, store signs are blurred, and it is not customer data.";

const vehicleExplainers = (segment: SegmentId): CapabilityExplainerVisual[] => [
  {
    capabilityId: "TECH-06",
    segment,
    approachId: "vehicle-anpr-plate-reading",
    approachName: "Registration-plate reading at access points",
    assetPath: "/assets/technology/explainers/vehicle-anpr-plate-reading-explainer.png",
    altText:
      "A retail-park access road at sunset. Cars heading in are each framed with their registration plate read beside them; one plate is enlarged with its country, date and time. Store signs are blurred.",
    explanation:
      "An ANPR sensor reads the registration plate of each vehicle crossing a configured access point, with its time. That gives vehicle arrivals and, where the plate is read again on leaving, a vehicle's time on site. A plate is not anonymous and a vehicle is not a visitor: it says nothing about who, or how many people, are inside.",
    illustrationNote: vehicleNote,
    illustratesImplementationId: "impl-tattile-anpr-vehicle",
    showsSensorHardware: false,
    illustrative: true,
    hasEmbeddedText: true,
  },
  {
    capabilityId: "TECH-06",
    segment,
    approachId: "vehicle-object-detection",
    approachName: "Object detection in a camera view",
    assetPath: "/assets/technology/explainers/vehicle-object-detection-explainer.png",
    altText:
      "A retail park seen from the pavement at sunset. Cars in the car park and people walking to the stores are each framed and labelled as a car, a person or a trolley, with a detection score. Store signs are blurred.",
    explanation:
      "An IP detection sensor recognises objects in its configured view — vehicles, people, trolleys — and counts them as they cross configured lines. A detection is an object class, not an identity, and the scores are the model's confidence in a detection, not a measured result.",
    illustrationNote: vehicleNote,
    illustratesImplementationId: "impl-ip-detection-outdoor",
    showsSensorHardware: false,
    illustrative: true,
    hasEmbeddedText: true,
  },
];

/* The indoor IP detection sensor serves the indoor segments (Retail, Shopping
   Centre), the outdoor one the open-air segments (Retail Park, Outlet Centre).
   Each list names exactly one of the two: both are linked to the same
   capabilities, and unnarrowed a store would be shown an outdoor housing and
   an outlet street an indoor one. They take the place of "Analytics on
   existing camera infrastructure", which described software; a prospect asking
   how something is counted is shown the device that counts it. */
export const segmentDrawerSettings: readonly SegmentDrawerSetting[] = [
  { segment: "retail", capabilityId: "TECH-02", implementationIds: ["impl-xovis-3d-entrance", "impl-milesight-vs125p-entrance", "impl-ip-detection-indoor"] },
  {
    segment: "retail",
    capabilityId: "TECH-03",
    implementationIds: ["impl-milesight-vs125p-entrance", "impl-ip-detection-indoor", "impl-configured-classification"],
    explainerVisuals: [retailClassification],
  },
  {
    segment: "shopping-centre",
    capabilityId: "TECH-02",
    implementationIds: ["impl-xovis-3d-entrance", "impl-milesight-vs125p-entrance", "impl-ip-detection-indoor"],
    explainerVisuals: [scThreshold],
  },
  {
    segment: "shopping-centre",
    capabilityId: "TECH-03",
    implementationIds: ["impl-milesight-vs125p-entrance", "impl-ip-detection-indoor", "impl-configured-classification"],
    explainerVisuals: [scClassification],
  },
  {
    // The camera the shared purpose already describes — "compatible IP-camera
    // feeds" — now exists in the model, so the drawer can name it.
    segment: "shopping-centre",
    capabilityId: "TECH-04",
    implementationIds: ["impl-ip-detection-indoor"],
  },
  {
    segment: "shopping-centre",
    capabilityId: "TECH-05",
    implementationIds: ["impl-ip-detection-indoor"],
    explainerVisuals: [scReid],
    purpose: {
      en: "Explain how IP detection sensors anonymously re-identify the same observed appearance between separate views, so dwell and movement between stores can be measured inside configured coverage.",
      fr: "Expliquer comment des capteurs de détection IP ré-identifient anonymement la même apparence observée entre des vues distinctes, afin de mesurer le temps de présence et le mouvement entre magasins, dans la couverture configurée.",
      de: "Erklären, wie IP-Detektionssensoren dieselbe beobachtete Erscheinung zwischen getrennten Ansichten anonym wiedererkennen, sodass Verweildauer und Bewegung zwischen Stores innerhalb der konfigurierten Abdeckung gemessen werden können.",
    },
  },
  {
    // "Which units are visited" — accurate counting where you want it. The
    // Premium 3D sensor is the outdoor PC2SE-O here: a retail park is open-air.
    segment: "retail-park",
    capabilityId: "TECH-02",
    implementationIds: ["impl-xovis-3d-entrance-outdoor", "impl-milesight-vs125p-entrance"],
    explainerVisuals: [rpEntrance],
  },
  {
    segment: "retail-park",
    capabilityId: "TECH-05",
    implementationIds: ["impl-ip-detection-outdoor"],
    explainerVisuals: [reidPhotoFor("retail-park")],
    purpose: {
      en: "Explain how IP detection sensors anonymously re-identify the same observed appearance at different units, so time on site and movement from unit to unit can be measured inside configured coverage.",
      fr: "Expliquer comment des capteurs de détection IP ré-identifient anonymement la même apparence observée à différentes cellules, afin de mesurer le temps passé sur site et le mouvement d'une cellule à l'autre, dans la couverture configurée.",
      de: "Erklären, wie IP-Detektionssensoren dieselbe beobachtete Erscheinung an verschiedenen Einheiten anonym wiedererkennen, sodass Aufenthaltsdauer und Bewegung von Einheit zu Einheit innerhalb der konfigurierten Abdeckung gemessen werden können.",
    },
  },  {
    // Product lead review, 2026-09-29: arrival is measured with the outdoor IP
    // detection sensor or the ANPR sensor — the two devices, not method classes.
    segment: "retail-park",
    capabilityId: "TECH-06",
    implementationIds: ["impl-ip-detection-outdoor", "impl-tattile-anpr-vehicle"],
    explainerVisuals: vehicleExplainers("retail-park"),
  },

  {
    // Open-air entrances: the outdoor Premium 3D sensor, not the indoor one.
    segment: "outlet-centre",
    capabilityId: "TECH-02",
    implementationIds: ["impl-xovis-3d-entrance-outdoor", "impl-milesight-vs125p-entrance", "impl-ip-detection-outdoor"],
    explainerVisuals: [ocEntrance],
  },
  {
    segment: "outlet-centre",
    capabilityId: "TECH-03",
    implementationIds: ["impl-milesight-vs125p-entrance", "impl-ip-detection-outdoor", "impl-configured-classification"],
    explainerVisuals: [ocClassification],
  },
  {
    // Counting lines between zones — explicitly not LiDAR or the FishEye 3D
    // sensor: those are store-interior devices, and an outlet is open-air.
    segment: "outlet-centre",
    capabilityId: "TECH-04",
    implementationIds: ["impl-ip-detection-outdoor"],
    explainerVisuals: [ocZoneLines],
    purpose: {
      en: "Explain how IP detection sensors count visitors crossing configured lines between outlet streets, zones and anchors, inside the covered views only.",
      fr: "Expliquer comment des capteurs de détection IP comptent les visiteurs qui franchissent des lignes configurées entre les rues, zones et locomotives de l'outlet, uniquement dans les vues couvertes.",
      de: "Erklären, wie IP-Detektionssensoren Besucher zählen, die konfigurierte Linien zwischen Outlet-Straßen, Zonen und Ankermietern überqueren — ausschließlich in den abgedeckten Ansichten.",
    },
  },
  {
    segment: "outlet-centre",
    capabilityId: "TECH-05",
    implementationIds: ["impl-ip-detection-outdoor"],
    explainerVisuals: [reidPhotoFor("outlet-centre")],
    purpose: {
      en: "Explain how an IP detection sensor at each store anonymously re-identifies the same observed appearance at the next, so movement between brands and time in the destination can be measured inside configured coverage.",
      fr: "Expliquer comment un capteur de détection IP à chaque magasin ré-identifie anonymement la même apparence observée au magasin suivant, afin de mesurer le mouvement entre marques et le temps passé dans la destination, dans la couverture configurée.",
      de: "Erklären, wie ein IP-Detektionssensor an jedem Store dieselbe beobachtete Erscheinung am nächsten anonym wiedererkennt, sodass Bewegung zwischen Marken und Aufenthaltsdauer im Outlet innerhalb der konfigurierten Abdeckung gemessen werden können.",
    },
  },  {
    // Same as Retail Park (product lead review, 2026-09-29).
    segment: "outlet-centre",
    capabilityId: "TECH-06",
    implementationIds: ["impl-ip-detection-outdoor", "impl-tattile-anpr-vehicle"],
    explainerVisuals: vehicleExplainers("outlet-centre"),
  },
  {
    // Shopping Centre was not part of that review. Its list is stated so the
    // outdoor sensor, newly linked to vehicle intelligence, does not appear
    // here by inheritance: this is exactly what it showed before.
    segment: "shopping-centre",
    capabilityId: "TECH-06",
    implementationIds: [
      "impl-vehicle-arrival-method",
      "impl-parking-occupancy-method",
      "impl-lawful-anpr-lpr",
      "impl-tattile-anpr-vehicle",
    ],
  },

];

export function getSegmentDrawerSetting(
  segment: SegmentId,
  capabilityId: TechnologyCapabilityId,
): SegmentDrawerSetting | null {
  return segmentDrawerSettings.find((o) => o.segment === segment && o.capabilityId === capabilityId) ?? null;
}

/** Every explainer the drawer layer attaches — for the asset-reference check. */
export const drawerExplainerVisuals: readonly CapabilityExplainerVisual[] = segmentDrawerSettings.flatMap(
  (setting) => setting.explainerVisuals ?? [],
);
