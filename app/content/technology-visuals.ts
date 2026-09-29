/**
 * Implementation imagery and site-requirement profiles.
 *
 * WHAT THIS IS
 *
 * The two things a prospect needs once they have understood a capability and
 * asked what it would take: something to look at, and a short, honest answer to
 * "what would you actually need at my store".
 *
 * WHAT THIS IS NOT
 *
 * - Not a product catalogue. Nothing here is reachable except through a
 *   capability. `technology-runtime.ts` and `solution-runtime.ts` resolve
 *   scene -> capability -> implementation; this file only decorates the leaf.
 * - Not a second source of truth. Every technical value in a
 *   `technicalDetail` row is read from the mapped source document named in the
 *   source registry, and every value carries its own `status` so a presenter
 *   can see which rows are source-backed and which are product input awaiting
 *   validation. Where no source supports a value, there is no row.
 * - Not a specification sheet. `essentials` is deliberately capped at three
 *   plain-language site concerns, and it is what leads. The technical rows sit
 *   behind a secondary action precisely so that the first thing a customer
 *   meets is "what would be needed", not "compare this hardware".
 * - Not a ranking, a recommendation or a price.
 *
 * [Source: docs/reference/technology/SOURCE-REGISTRY.md;
 *          SALES-EXPERIENCE-DIRECTION.md §22 Configure direction]
 */

import type {
  SegmentId,
  SourceStatus,
  TechnologyCapabilityId,
  TechnologyImplementationId,
} from "./types.ts";

/* ==========================================================================
   IMAGERY
   ========================================================================== */

export interface ImplementationVisual {
  implementationId: TechnologyImplementationId;
  /**
   * Web path under `public/`.
   *
   * Filenames are canonical kebab-case (`supplier-model.ext`), lower-case,
   * hyphen-separated, no underscores. This is a content-layer path string and
   * not a public API, so the canonical name is the only name: there are no
   * aliases, symlinks or legacy paths. The asset-safety tests assert both
   * directions — every referenced path exists on disk, and every file on disk
   * is referenced — so a rename or a drop-in can never silently 404.
   */
  assetPath: string;
  /** Describes what is pictured. Never a capability, accuracy or privacy claim. */
  altText: string;
  /**
   * What the picture is evidence of, and nothing more.
   *
   * This matters most for infrastructure photographs. A camera photographed
   * next to an analytics implementation shows compatible infrastructure; it is
   * not evidence that the analytics exist, work, classify anything, or handle
   * data in any particular way.
   */
  showsInfrastructureOnly: boolean;
}

export const implementationVisuals: readonly ImplementationVisual[] = [
  {
    implementationId: "impl-xovis-3d-entrance",
    assetPath: "/assets/technology/entrance/xovis-pc2se.jpg",
    altText: "An overhead 3D stereo vision sensor, seen from the front.",
    showsInfrastructureOnly: false,
  },
  {
    implementationId: "impl-milesight-vs125p-entrance",
    assetPath: "/assets/technology/entrance/milesight-vs125p.png",
    altText: "A stereo vision people counter, seen from the front.",
    showsInfrastructureOnly: false,
  },
  {
    // Infrastructure, not analytics. Isarsoft is the analytics layer; this is a
    // photograph of a camera of the kind that layer can run on. It is never
    // headlined with the camera's own model name outside a technical view.
    //
    // Filed under `isarsoft/` rather than `entrance/` by human product decision
    // (DECISION-LOG.md, 2026-08-18 amendment). Isarsoft is a multi-capability
    // analytics family, so the asset's location must not tie it structurally to
    // Entrance Measurement. This is a filesystem-location fact only: the runtime
    // remains capability-first (scene -> capability -> implementation), and the
    // folder name still carries no claim about what the analytics do.
    implementationId: "impl-isarsoft-camera-analytics",
    // Renamed 2026-09-27: the product lead identified this photograph as a
    // FLEXIDOME 5100i, not the 3100i its filename claimed. A filename that
    // names the wrong product is how the next person picks the wrong picture.
    assetPath: "/assets/technology/isarsoft/bosch-flexidome-5100i.jpg",
    altText: "An IP camera of the kind that compatible video analytics can run on.",
    showsInfrastructureOnly: true,
  },
  {
    // Supplied by the product lead, 2026-09-27: the outdoor PC2SE-O.
    implementationId: "impl-xovis-3d-entrance-outdoor",
    assetPath: "/assets/technology/entrance/xovis-pc2se-o.png",
    altText: "An overhead 3D stereo-vision sensor in a weatherproof grey housing, with its network cable and connector.",
    showsInfrastructureOnly: false,
  },
  {
    // Supplied by the product lead, 2026-09-27, cropped to the product screen:
    // the supplier's marketing callouts around it were claims this model has
    // not verified, so they are not shown. The screen's own values are the
    // supplier's example values, and the alt text says so.
    implementationId: "impl-hme-zoom-nitro-timer",
    assetPath: "/assets/technology/hme/zoom-nitro-timer-screen.png",
    altText: "A drive-thru timer screen showing each car in the lane with its elapsed time, and hourly totals. The figures are the supplier's example values, not customer data.",
    showsInfrastructureOnly: false,
  },
  {
    // Supplied and identified by the product lead, 2026-09-27.
    implementationId: "impl-ip-detection-indoor",
    assetPath: "/assets/technology/ip-detection/bosch-flexidome-micro-3100i.png",
    altText: "A compact white micro-dome camera mounted flush against a ceiling.",
    showsInfrastructureOnly: false,
  },
  {
    implementationId: "impl-ip-detection-outdoor",
    assetPath: "/assets/technology/ip-detection/bosch-flexidome-5100i-outdoor.png",
    altText: "A white dome camera in a rugged housing, with a varifocal lens and infrared ring visible under the dome.",
    showsInfrastructureOnly: false,
  },
  {
    implementationId: "impl-milesight-vs361-passerby",
    assetPath: "/assets/technology/passerby/milesight-vs361.jpg",
    altText: "A storefront footfall sensor in its outdoor housing.",
    showsInfrastructureOnly: false,
  },
  {
    implementationId: "impl-lidar-spatial",
    assetPath: "/assets/technology/spatial/robosense-airy.webp",
    altText: "A LiDAR unit, a compact cylindrical sensor.",
    showsInfrastructureOnly: false,
  },
  {
    implementationId: "impl-xovis-3d-spatial",
    assetPath: "/assets/technology/spatial/xovis-pf-l.jpg",
    altText: "A wide-angle 3D stereo vision sensor, seen from the front.",
    showsInfrastructureOnly: false,
  },
] as const;

export function getImplementationVisual(
  implementationId: TechnologyImplementationId,
): ImplementationVisual | null {
  return (
    implementationVisuals.find((visual) => visual.implementationId === implementationId) ?? null
  );
}

/**
 * A visual that explains a CAPABILITY rather than an implementation.
 *
 * Currently one: the catchment reference map under Geo, mobility and GIS. It
 * exists because "aggregate area context" is an abstract phrase, and a map
 * makes it concrete in a second.
 *
 * `illustrative` is not decoration. The map is a reference image, not customer
 * data and not a measurement, and the caption says so wherever it is rendered.
 */
export interface CapabilityContextVisual {
  capabilityId: TechnologyCapabilityId;
  assetPath: string;
  altText: string;
  caption: string;
  illustrative: true;
}

export const capabilityContextVisuals: readonly CapabilityContextVisual[] = [
  {
    capabilityId: "TECH-07",
    assetPath: "/assets/context/catchment-area-reference.png",
    altText:
      "A reference map showing a catchment area around a location, shaded by travel distance.",
    caption:
      "Aggregate mobility and GIS context helps explain where demand around a location may come from. It adds context around direct physical measurement — it does not replace it.",
    illustrative: true,
  },
] as const;

export function getCapabilityContextVisual(
  capabilityId: TechnologyCapabilityId,
): CapabilityContextVisual | null {
  return (
    capabilityContextVisuals.find((visual) => visual.capabilityId === capabilityId) ?? null
  );
}

/* ==========================================================================
   MEASUREMENT-PRINCIPLE EXPLAINERS
   ========================================================================== */

/**
 * A visual that explains HOW A MEASUREMENT WORKS, not what gets installed.
 *
 * This is the "How we do this" family, and the distinction from
 * `implementationVisuals` is the whole point of it existing:
 *
 * - An `ImplementationVisual` is a photograph of a physical product. It answers
 *   "what would go on my wall" and lives under "What is needed".
 * - A `CapabilityExplainerVisual` is a rendered illustration of a measurement
 *   principle — a line across a frontage, a cone over a threshold, a point
 *   cloud, a set of paths. It answers "how does this actually work" and lives
 *   under "How we do this".
 *
 * Two rules follow from that and are enforced by test:
 *
 * 1. **No sensor hardware is depicted.** The moment a device appears, the image
 *    stops explaining a principle and starts advertising a product, and the two
 *    depth layers collapse into one. `showsSensorHardware` is `false` for every
 *    member and there is no variant that sets it true.
 * 2. **This is not an implementation.** These carry no implementation ID as
 *    their identity. `illustratesImplementationId` is an optional pointer used
 *    only to say "this approach is the one that implementation belongs to" —
 *    it is not a recommendation, not a default and not a product claim.
 *
 * A capability may own MORE THAN ONE explainer where it is genuinely served by
 * more than one measurement approach. Spatial movement intelligence (TECH-04)
 * is the case in point: a LiDAR point cloud and 3D stereo tracking are two
 * different ways of answering the same question, and they are deliberately
 * presented as two distinct approaches rather than merged into a single
 * "in-store tracking" picture that would imply one method.
 *
 * `approachName` is vendor-neutral on purpose. It names the physical principle,
 * never the supplier.
 *
 * [Source: SALES-EXPERIENCE-DIRECTION.md §22 Configure direction;
 *          human product decision 2026-08-18, explainer visual family]
 */
export interface CapabilityExplainerVisual {
  capabilityId: TechnologyCapabilityId;
  /**
   * The segment this artwork is true of.
   *
   * A capability id is shared; footage is not. TECH-01 is measured at a street
   * frontage in Retail and would be measured somewhere else entirely in a
   * drive-thru, so resolving an explainer by capability alone would hand one
   * segment another segment's location. Resolution is therefore keyed on
   * segment AND capability, and a capability with no artwork for the asking
   * segment resolves to nothing rather than to someone else's picture.
   */
  segment: SegmentId;
  /** Stable slug for the measurement approach. Not an implementation ID. */
  approachId: string;
  /** The physical principle, in vendor-neutral words. Never a supplier name. */
  approachName: string;
  assetPath: string;
  altText: string;
  /**
   * Short, plain-English explanation of the measurement principle.
   *
   * Deliberately about the PRINCIPLE. No mounting heights, cable types, power
   * budgets or environmental ranges — that is "What is needed" copy, and
   * letting it leak in here is what turns an explanation into a product page.
   */
  explanation: string;
  /**
   * Which implementation happens to use this approach, where naming one helps.
   * Not a recommendation, not a default, not the only option.
   */
  illustratesImplementationId: TechnologyImplementationId | null;
  /** Always false. An explainer that shows a device is not an explainer. */
  showsSensorHardware: false;
  /** Always true. These are rendered illustrations, never customer data. */
  illustrative: true;
  /**
   * Replaces the standing caption under this explainer, where the default would
   * be inaccurate for the particular artwork.
   *
   * The default says the picture is "not a picture of equipment", which is true
   * of a diagram but not of an explainer whose scene happens to contain visible
   * devices. Optional: a visual without one keeps the shared caption exactly.
   */
  illustrationNote?: string;
  /**
   * True where the supplied artwork has explanatory copy burnt into the pixels.
   *
   * Flagged rather than hidden. Burnt-in text cannot be translated, is invisible
   * to a screen reader, and sits outside the truth-labelling system that governs
   * every other string in this app — so the UI must not rely on it, and a
   * presenter should know it is there. See the review note on
   * `lidar-spatial-pointcloud.png`.
   */
  hasEmbeddedText: boolean;
}

export const capabilityExplainerVisuals: readonly CapabilityExplainerVisual[] = [
  {
    capabilityId: "TECH-01",
    segment: "retail",
    approachId: "frontage-beam",
    approachName: "Frontage detection line",
    assetPath: "/assets/technology/explainers/passerby-physical-measurement.png",
    altText:
      "A shopping street at dusk seen from the pavement, with a horizontal line drawn along the frontage. People walking past cross the line.",
    explanation:
      "A detection line runs along the frontage. Each person who physically walks past crosses it, and the crossing is counted. This is direct physical measurement of the people actually in front of your store — it is not an estimate of the wider area.",
    illustratesImplementationId: "impl-milesight-vs361-passerby",
    showsSensorHardware: false,
    illustrative: true,
    hasEmbeddedText: false,
  },
  {
    capabilityId: "TECH-02",
    segment: "retail",
    approachId: "threshold-cone",
    approachName: "Overhead threshold view",
    assetPath: "/assets/technology/explainers/entrance-threshold-measurement.png",
    altText:
      "A shop entrance seen from outside, with a cone of light spreading down from the ceiling to cover the width of the doorway. People walk in and out through it.",
    explanation:
      "The doorway is watched from directly above, so the whole width of the threshold is covered. Anyone crossing it is followed as a shape long enough to tell whether they went in or came out — which is what separates a visit from a passer-by.",
    illustratesImplementationId: null,
    showsSensorHardware: false,
    illustrative: true,
    hasEmbeddedText: false,
  },
  {
    // Two approaches under one capability, deliberately not merged. A point
    // cloud and stereo tracking answer the same question by different physical
    // means, and flattening them into one picture would imply a single method.
    capabilityId: "TECH-04",
    // A store interior. Shopping Centre asks the same capability and gets its
    // own camera-coverage artwork through segment-capability-media.ts, which is
    // exactly the leak this segment field closes for every other pair.
    segment: "retail",
    approachId: "lidar-point-cloud",
    approachName: "LiDAR point cloud",
    assetPath: "/assets/technology/explainers/lidar-spatial-pointcloud.png",
    altText:
      "A store interior rendered as a cloud of points, with people appearing as anonymous point-formed figures and their routes drawn as dotted paths between fixtures.",
    explanation:
      "The space is measured as a cloud of distance points rather than as a picture. People appear as anonymous shapes within that cloud, so their position and route can be followed without an image of anyone ever being formed.",
    illustratesImplementationId: "impl-lidar-spatial",
    showsSensorHardware: false,
    illustrative: true,
    // The supplied artwork carries a burnt-in four-step caption strip. Flagged
    // so the UI never treats it as neutral artwork; see the interface note.
    hasEmbeddedText: true,
  },
  {
    capabilityId: "TECH-04",
    segment: "retail",
    approachId: "3d-path-tracking",
    approachName: "3D path tracking",
    assetPath: "/assets/technology/explainers/3d-spatial-tracking.png",
    altText:
      "A store floor seen from above, with smooth glowing routes traced across it between displays and bright points marking where those routes pause.",
    explanation:
      "The floor is watched from above and each visitor is followed as an anonymous shape moving across it. What comes out is the route taken and where it paused — the shape of how the space is actually used.",
    illustratesImplementationId: "impl-xovis-3d-spatial",
    showsSensorHardware: false,
    illustrative: true,
    hasEmbeddedText: false,
  },
  {
    // The lane frame: detection arcs above cars at configured points, and a
    // stage-timing strip on an indoor screen. Both halves of what this timer
    // does are visible, so it explains the detection capability and the timing
    // capability — and nothing beyond them.
    capabilityId: "TECH-QSR-01",
    segment: "qsr",
    approachId: "lane-point-detection",
    approachName: "Detection at configured lane points",
    assetPath: "/assets/technology/qsr/qsr-hme-zoom-nitro-stage-timing-hero.png",
    altText:
      "A drive-thru lane at dusk with three cars queuing. A soft arc sits above each car where the lane crosses a marked point, and a purple line runs along the ground beside the lane to a screen inside the building showing a plain segmented bar. No number appears anywhere.",
    explanation:
      "A vehicle is detected as it reaches each configured point on the lane. What exists is the moment of arrival at that point, and nothing that describes the vehicle or anyone inside it.",
    illustratesImplementationId: "impl-hme-zoom-nitro-timer",
    showsSensorHardware: false,
    illustrative: true,
    // The frame includes a real car marque badge on the nearest vehicle. It is
    // depicted environment, not a claim about compatibility with any brand.
    illustrationNote:
      "Illustration of the measurement principle. Not customer data, and not a depiction of a particular hardware installation.",
    hasEmbeddedText: false,
  },
  {
    capabilityId: "TECH-QSR-02",
    segment: "qsr",
    approachId: "point-to-point-timing",
    approachName: "Elapsed time between two configured points",
    assetPath: "/assets/technology/qsr/qsr-hme-zoom-nitro-stage-timing-hero.png",
    altText:
      "A drive-thru lane at dusk with cars queuing, a purple line running from the lane to a screen inside the building, and a plain segmented bar on that screen standing for the stages of the journey. No number appears anywhere.",
    explanation:
      "Time is the gap between one configured detection point and the next. Stage, queue and lane total time are that gap, measured — they are not an estimate, and they say nothing about what happened inside the car.",
    illustratesImplementationId: "impl-hme-zoom-nitro-timer",
    showsSensorHardware: false,
    illustrative: true,
    illustrationNote:
      "Illustration of the measurement principle. Not customer data, and not a depiction of a particular hardware installation.",
    hasEmbeddedText: false,
  },
  {
    capabilityId: "TECH-QSR-03",
    segment: "qsr",
    approachId: "crew-communication-link",
    approachName: "Guest-to-crew and crew-to-crew audio",
    assetPath: "/assets/technology/qsr/qsr-nexeo-headset-alert-and-crew-communication-hero.png",
    altText:
      "A crew member wearing a headset stands inside a restaurant. Two soft purple arcs run from the headset: one back towards the kitchen line, one out to a post beside the drive-thru lane where another crew member is serving a car.",
    explanation:
      "Speech travels between the lane post and the crew, and between crew members. It is a communication path, not a measurement: nothing here counts, times or classifies anyone.",
    illustratesImplementationId: "impl-hme-nexeo",
    showsSensorHardware: false,
    illustrative: true,
    illustrationNote:
      "Illustration of the communication principle. Not customer data, and not a depiction of a particular hardware installation.",
    hasEmbeddedText: false,
  },
  {
    /* Added after zooming in on the earpiece, which Gate 4 had not done: the
       frame carries an AMBER indicator at the ear, visually distinct from the
       purple communication links. That is a threshold event reaching a person,
       which is what this capability is — so the mapping is earned by what is in
       the picture, not by the file's name. */
    capabilityId: "TECH-QSR-06",
    segment: "qsr",
    approachId: "threshold-alert-to-person",
    approachName: "A threshold event reaching the person who can act",
    assetPath: "/assets/technology/qsr/qsr-nexeo-headset-alert-and-crew-communication-hero.png",
    altText:
      "A crew member wearing a headset stands inside a restaurant. An amber indicator sits at the earpiece, and soft purple links run from the headset towards the kitchen line and out to a colleague serving a car at the drive-thru window.",
    explanation:
      "When a configured threshold is passed, the event is raised where the person who can respond will hear it. Reaching them is what the alert does; what happens next is theirs.",
    illustratesImplementationId: "impl-hme-zoom-nitro-nexeo-alerting",
    showsSensorHardware: false,
    illustrative: true,
    illustrationNote:
      "Illustration of the alerting principle. Not customer data, and not a depiction of a particular hardware installation.",
    hasEmbeddedText: false,
  },
  {
    capabilityId: "TECH-QSR-09",
    segment: "qsr",
    approachId: "voice-ai-with-crew-takeover",
    approachName: "Automated order taking with crew takeover",
    assetPath: "/assets/technology/qsr/qsr-compatible-voice-ai-order-and-human-handoff-hero.png",
    altText:
      "A car at a drive-thru order point at dusk. A waveform runs from the driver's window to the order terminal, and from there to a small group of item symbols and on to a crew member wearing a headset at the window inside.",
    explanation:
      "An automated service can take the order at the post, and a crew member can take it over at any point. The picture shows that handover path and nothing about the outcome of any order.",
    illustratesImplementationId: "impl-compatible-voice-ai-provider",
    showsSensorHardware: false,
    illustrative: true,
    illustrationNote:
      "Illustration of the ordering principle. Not customer data, and not a depiction of a particular provider's service.",
    hasEmbeddedText: false,
  },
] as const;

/**
 * Every explainer for a segment and capability, in declaration order.
 *
 * Returns an array, not a single visual, because "one capability, one picture"
 * is exactly the assumption that would merge LiDAR and 3D tracking. Order is
 * declaration order and carries no preference.
 */
/**
 * Every explainer registered for a capability, across all segments.
 *
 * For REGISTRY VALIDATION only — checking that a video's `approachId` names a
 * real approach. Never for rendering: a rendering path that forgets the segment
 * is the leak this pair of functions exists to prevent, which is why the two
 * have different names instead of one optional argument.
 */
export function getAllCapabilityExplainerVisuals(
  capabilityId: TechnologyCapabilityId,
): readonly CapabilityExplainerVisual[] {
  return capabilityExplainerVisuals.filter((visual) => visual.capabilityId === capabilityId);
}

export function getCapabilityExplainerVisuals(
  capabilityId: TechnologyCapabilityId,
  segment: SegmentId,
): readonly CapabilityExplainerVisual[] {
  return capabilityExplainerVisuals.filter(
    (visual) => visual.capabilityId === capabilityId && visual.segment === segment,
  );
}

/* ==========================================================================
   SITE REQUIREMENT PROFILES
   ========================================================================== */

export interface ImplementationDetailRow {
  label: string;
  value: string;
  /**
   * Evidence class of this single row.
   *
   * `source_backed` means the value was read from the mapped source document.
   * `user_approved_product_input` means it came from approved product input
   * that no mapped document confirms — it is shown to a presenter as such and
   * is never presented to a prospect as a documented specification.
   */
  status: Extract<SourceStatus, "source_backed" | "user_approved_product_input">;
}

export interface ImplementationRequirementProfile {
  implementationId: TechnologyImplementationId;
  /**
   * The three site concerns, in plain language. Capped at three on purpose:
   * this is the answer to "what would we need", not a survey and not a spec.
   */
  essentials: readonly { label: string; body: string }[];
  /** Secondary reveal. Every row names its own evidence class. */
  technicalDetail: readonly ImplementationDetailRow[];
  sourceRefs: readonly string[];
}

const registry = "docs/reference/technology/SOURCE-REGISTRY.md";

export const implementationRequirementProfiles: readonly ImplementationRequirementProfile[] = [
  {
    implementationId: "impl-milesight-vs361-passerby",
    essentials: [
      {
        label: "Placement",
        body: "Mounted on the frontage at roughly waist height, facing the passing flow.",
      },
      {
        label: "Measurement area",
        body: "A detection distance set anywhere from 1 to 9 metres, so the measured strip matches the frontage you want to talk about.",
      },
      {
        label: "Power and connectivity",
        body: "One network cable carries both power and data; a local DC supply also works.",
      },
    ],
    technicalDetail: [
      { label: "Detection method", value: "Diffuse-reflective infrared beam, 940 nm", status: "source_backed" },
      { label: "Mounting height", value: "0.7 – 1.2 m", status: "source_backed" },
      { label: "Detection distance", value: "1 – 9 m, adjustable", status: "source_backed" },
      { label: "Protection rating", value: "IP65, -20 °C to 50 °C", status: "source_backed" },
      { label: "Power", value: "802.3af PoE or 12–60 V DC, max 0.9 W", status: "source_backed" },
      { label: "Output", value: "One digital switching signal. No camera, no image capture.", status: "source_backed" },
    ],
    sourceRefs: [`${registry}: SRC-MILESIGHT-VS361-TECH-001`],
  },
  {
    implementationId: "impl-xovis-3d-entrance",
    essentials: [
      {
        label: "Placement",
        body: "Overhead, directly above the doorway, looking straight down at the threshold.",
      },
      {
        label: "Measurement area",
        body: "The entrance itself. Ceiling height decides how much of a wide doorway one unit covers.",
      },
      {
        label: "Power and connectivity",
        body: "A single network cable carries power and data to the sensor.",
      },
    ],
    technicalDetail: [
      { label: "Method", value: "3D stereo vision, processed on the device", status: "source_backed" },
      { label: "Mounting height", value: "2.20 – 6.00 m", status: "source_backed" },
      { label: "Power", value: "Power over Ethernet, max 7.5 W", status: "source_backed" },
      { label: "Network", value: "Gigabit Ethernet, Cat-5e or better, up to 100 m", status: "source_backed" },
      { label: "Environment", value: "Indoor, 0 °C to 45 °C, minimum 2 lux", status: "source_backed" },
      { label: "Privacy modes", value: "Four selectable levels; certified scope covers level 2 and above", status: "source_backed" },
    ],
    sourceRefs: [`${registry}: SRC-XOVIS-PC2SE-TECH-001, SRC-XOVIS-PRIVACY-001`],
  },
  {
    implementationId: "impl-milesight-vs125p-entrance",
    essentials: [
      {
        label: "Placement",
        body: "Overhead above the doorway, ceiling- or lintel-mounted.",
      },
      {
        label: "Measurement area",
        body: "Up to four counting lines in one view; several units can be combined for a wider entrance.",
      },
      {
        label: "Power and connectivity",
        body: "One network cable for power and data, or a local DC supply. A cellular variant exists where no cabling is possible.",
      },
    ],
    technicalDetail: [
      { label: "Method", value: "Binocular stereo vision with on-device AI", status: "source_backed" },
      { label: "Mounting height", value: "2.2 – 6 m", status: "source_backed" },
      { label: "Power", value: "802.3af PoE or 12 V DC, max 11.1 W", status: "source_backed" },
      { label: "Environment", value: "-20 °C to 50 °C, IP40, works in full darkness", status: "source_backed" },
      { label: "Attribute recognition", value: "Configurable; the datasheet limits it to a 2.2–4 m mounting height", status: "source_backed" },
    ],
    sourceRefs: [`${registry}: SRC-MILESIGHT-VS125-TECH-001`],
  },
  {
    implementationId: "impl-isarsoft-camera-analytics",
    essentials: [
      {
        label: "Placement",
        body: "Uses camera positions you already have, where the existing view covers the measurement question.",
      },
      {
        label: "Measurement area",
        body: "Decided per site by which views exist and how they are configured. Not every question can be answered from every camera position.",
      },
      {
        label: "Power and connectivity",
        body: "The cameras keep their existing power and network; the analytics layer is configured on top.",
      },
    ],
    // Deliberately empty. No Isarsoft document is mapped, so there is nothing
    // to put in a technical detail table that would be true. An empty table is
    // the honest state; the UI omits the reveal rather than showing a shell.
    technicalDetail: [],
    sourceRefs: [`${registry}: no Isarsoft source document is mapped`],
  },
  {
    // The product lead's own installation text for an IP-camera deployment
    // (content inventory, Implementations sheet, 2026-09-26), stated without a
    // vendor. Essentials only: no datasheet is mapped for this device, so no
    // technical-detail row is asserted — an empty table is the honest one.
    implementationId: "impl-ip-detection-indoor",
    essentials: [
      {
        label: "Placement",
        body: "Camera views at the chosen touchpoints — entrances, corridors, zone boundaries or store doors — from a site-validated camera layout.",
      },
      {
        label: "Measurement area",
        body: "Only what the configured views cover. How many cameras, and where, follows from a site design rather than from a datasheet.",
      },
      {
        label: "Power and connectivity",
        body: "Network access for each camera, plus local processing hardware sized to the analytics that run on it.",
      },
    ],
    technicalDetail: [],
    sourceRefs: ["docs/content/PFM-drawer-content-inventory.xlsx: Implementations, installation essentials written by the product lead, 2026-09-26"],
  },
  {
    // The product lead's own installation text for an IP-camera deployment
    // (content inventory, Implementations sheet, 2026-09-26), stated without a
    // vendor. Essentials only: no datasheet is mapped for this device, so no
    // technical-detail row is asserted — an empty table is the honest one.
    implementationId: "impl-ip-detection-outdoor",
    essentials: [
      {
        label: "Placement",
        body: "Camera views at the chosen touchpoints — entrances, corridors, zone boundaries or store doors — from a site-validated camera layout.",
      },
      {
        label: "Measurement area",
        body: "Only what the configured views cover. How many cameras, and where, follows from a site design rather than from a datasheet.",
      },
      {
        label: "Power and connectivity",
        body: "Network access for each camera, plus local processing hardware sized to the analytics that run on it.",
      },
    ],
    technicalDetail: [],
    sourceRefs: ["docs/content/PFM-drawer-content-inventory.xlsx: Implementations, installation essentials written by the product lead, 2026-09-26"],
  },
  {
    implementationId: "impl-xovis-3d-spatial",
    essentials: [
      {
        label: "Placement",
        body: "Overhead in the ceiling across the area being measured, looking down at the floor.",
      },
      {
        label: "Measurement area",
        body: "Agreed per store. How many units a floor needs is a design question, decided from your floorplan.",
      },
      {
        label: "Power and connectivity",
        body: "A network cable to each position carries power and data.",
      },
    ],
    technicalDetail: [
      { label: "Method", value: "3D stereo vision with on-device AI", status: "source_backed" },
      { label: "Mounting height", value: "2.00 – 6.00 m", status: "source_backed" },
      { label: "Power", value: "Power over Ethernet, max 12.95 W; USB-C alternative", status: "source_backed" },
      { label: "Network", value: "Gigabit Ethernet, Cat-6 shielded or better, up to 100 m", status: "source_backed" },
      { label: "Environment", value: "Indoor, 0 °C to 45 °C, minimum 2 lux", status: "source_backed" },
      { label: "Privacy modes", value: "Four selectable levels; certified scope covers level 2 and above", status: "source_backed" },
    ],
    sourceRefs: [`${registry}: SRC-XOVIS-PFL-TECH-001, SRC-XOVIS-PRIVACY-001`],
  },
  {
    implementationId: "impl-lidar-spatial",
    essentials: [
      {
        label: "Placement",
        body: "Mounted to cover the space from above; one unit sees a full hemisphere around itself.",
      },
      {
        label: "Measurement area",
        body: "Agreed per store from the floorplan. Coverage and the analytics on top of it are designed together, per site.",
      },
      {
        label: "Power and connectivity",
        body: "A DC supply and an Ethernet connection to the processing point.",
      },
    ],
    technicalDetail: [
      { label: "Method", value: "3D LiDAR point cloud; captures no image of a person", status: "source_backed" },
      { label: "Field of view", value: "360° horizontal × 90° vertical", status: "source_backed" },
      { label: "Laser safety", value: "Class 1 eye-safe", status: "source_backed" },
      { label: "Power", value: "9 – 32 V, under 8 W", status: "source_backed" },
      { label: "Output", value: "Point cloud over Ethernet", status: "source_backed" },
      {
        label: "Analytics layer",
        value: "Not covered by the mapped datasheet, which documents the sensor for robotics use. Designed and validated per project.",
        status: "user_approved_product_input",
      },
    ],
    sourceRefs: [`${registry}: SRC-ROBOSENSE-AIRY-TECH-001`],
  },
] as const;

export function getImplementationRequirementProfile(
  implementationId: TechnologyImplementationId,
): ImplementationRequirementProfile | null {
  return (
    implementationRequirementProfiles.find(
      (profile) => profile.implementationId === implementationId,
    ) ?? null
  );
}
