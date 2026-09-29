import { allScenes } from "./segments/index.ts";
import type {
  CommercialAvailability,
  TechnologyCapabilityDefinition,
  TechnologyCapabilityId,
  TechnologyImplementationDefinition,
} from "./types.ts";

const matrix = "PFM_Segment_Insight_Matrix_v1_1.xlsx";
const technologyModel = "TECHNOLOGY-DRILLDOWN-MODEL.md";
const qsrSpec = "docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md";

/**
 * Stable source IDs from the technology source registry.
 *
 * Each one resolves to exactly one real file under `docs/reference/technology/`.
 * They are internal (Sales Mode) detail: the Configure experience never renders
 * a source ID or a document path to a prospect.
 * [Source: docs/reference/technology/SOURCE-REGISTRY.md]
 */
const registry = "docs/reference/technology/SOURCE-REGISTRY.md";
const SRC = {
  xovisPc2seTech: "SRC-XOVIS-PC2SE-TECH-001",
  xovisPc2seOTech: "SRC-XOVIS-PC2SE-O-TECH-001",
  xovisPflTech: "SRC-XOVIS-PFL-TECH-001",
  xovisPrivacySeal: "SRC-XOVIS-PRIVACY-001",
  xovisPrivacyDeclaration: "SRC-XOVIS-PRIVACY-002",
  xovisPrivacyFw5: "SRC-XOVIS-PRIVACY-003",
  xovisIso27001: "SRC-XOVIS-PRIVACY-004",
  milesightVs125Tech: "SRC-MILESIGHT-VS125-TECH-001",
  milesightVs125Privacy: "SRC-MILESIGHT-VS125-PRIVACY-001",
  milesightVs361Tech: "SRC-MILESIGHT-VS361-TECH-001",
  robosenseAiryTech: "SRC-ROBOSENSE-AIRY-TECH-001",
  tattileMk2Tech: "SRC-TATTILE-MK2-TECH-001",
  tattileEnforcementCatalogue: "SRC-TATTILE-ENFORCEMENT-CAT-2026",
} as const;

/** `SRC-…` prefixed with the registry that defines it, for the Sales-Mode trail. */
const src = (...ids: readonly string[]): readonly string[] => [
  `${registry}: ${ids.join(", ")}`,
];

/** Commercial availability is separate from source/evidence readiness. */
const availability = (
  status: CommercialAvailability["status"],
  note: string,
  region: string | null = null,
  researchBaseline?: string,
): CommercialAvailability => ({
  status,
  region,
  note,
  ...(researchBaseline ? { researchBaseline } : {}),
});

export const technologyImplementations: readonly TechnologyImplementationDefinition[] = [
  {
    // Xovis PC2SE. The one implementation in this model that is source-backed
    // on all three axes: its own technical datasheet, plus an ePrivacy
    // certificate whose Annex 1 names "PC2SE" explicitly.
    id: "impl-xovis-3d-entrance",
    capabilityIds: ["TECH-02"],
    supplier: "Xovis",
    product: "PC2SE",
    implementationRole: "Premium 3D",
    measurementMethod: "3D stereo vision",
    sourceStatus: "source_backed",
    sourceRefs: src(SRC.xovisPc2seTech, SRC.xovisPrivacySeal, SRC.xovisPrivacyDeclaration, SRC.xovisPrivacyFw5, SRC.xovisIso27001),
    supportedClaims: [
      "Overhead 3D stereo vision with processing on the device itself",
      "Mounting from 2.20 m to 6.00 m, powered and connected over a single PoE network cable",
      "The manufacturer states that processed images are neither stored nor leave the sensor, and that only text-format count data is transmitted",
      "Four selectable privacy levels; the certified scope covers level 2 and above",
    ],
    unsupportedClaims: [
      "Any accuracy, capture-rate or coverage figure",
      "Compliance of the overall system — the source states the sensor enables, but does not by itself deliver, a compliant system",
      "Privacy level 0 or 1 operation, which the certificate explicitly excludes",
      "Behaviour of any processing carried out by the customer as controller, which the certificate places out of scope",
    ],
    privacyStatus: "source_backed",
    technicalDetailStatus: "source_backed",
  },
  {
    // Milesight VS125-P. Its own datasheet is real and detailed, so technical
    // detail is source-backed. Privacy is only partially so: the datasheet
    // asserts GDPR compliance itself, with no independent certificate behind
    // it — which is a materially weaker evidence class than the Xovis seal and
    // must never be presented as equivalent to it.
    id: "impl-milesight-vs125p-entrance",
    capabilityIds: ["TECH-02", "TECH-03"],
    supplier: "Milesight",
    product: "VS125-P",
    implementationRole: "Basic 3D",
    measurementMethod: "AI stereo vision",
    sourceStatus: "source_backed",
    sourceRefs: src(SRC.milesightVs125Tech, SRC.milesightVs125Privacy),
    supportedClaims: [
      "Binocular stereo vision with on-device AI processing",
      "Mounting from 2.2 m to 6 m over PoE; a separate cellular variant exists",
      "Up to four bi-directional counting lines, with configurable counting areas",
      "Configurable attribute recognition, which the datasheet limits to a 2.2–4 m mounting height",
      // Rewritten 2026-09-28 against SRC-MILESIGHT-VS125-PRIVACY-001 pp. 7–10:
      // the device processes images, and exactly one of its three preview
      // modes shows none — the earlier plural read as an image-free device.
      "The manufacturer describes image processing on the device, with depth and colour images used to detect people; one of its three preview modes shows no image. It also describes on-device storage with manual deletion, and states that the device is GDPR compliant",
    ],
    unsupportedClaims: [
      "Equivalence with the 3D Sensor Basic FoV in accuracy, classification, coverage, processing or privacy evidence",
      // The figure itself is not repeated (2026-09-28): Configure renders every
      // blocked claim, and a number shown to a prospect is read as a result
      // even when it is introduced as one PFM does not claim.
      "The manufacturer's own counting-accuracy figure, which PFM does not restate as a claim",
      "Independent privacy certification — the GDPR statement is the manufacturer's own, not a certified assessment",
      "Retention, storage location or deletion behaviour of the local data store the datasheet describes",
      "That every installation uses a no-image preview, automatically deletes stored data, or is legally compliant without a site-specific assessment",
    ],
    privacyStatus: "partially_source_backed",
    technicalDetailStatus: "source_backed",
  },
  {
    /**
     * Isarsoft — ONE analytics implementation family, several possible
     * capabilities.
     *
     * Isarsoft is the analytics layer. Compatible IP-camera infrastructure is
     * the hardware it runs on, and the two are not the same thing: a camera
     * does not perform the analysis, and no camera model is evidence for any
     * analytics, classification or privacy claim.
     *
     * Which of TECH-02 / TECH-03 / TECH-05 a given deployment actually answers
     * is configuration-dependent. Listing all three here states that they are
     * POSSIBLE, never that any one deployment supports all of them.
     *
     * Isarsoft's vendor privacy whitepaper is mapped, but it supports only
     * vendor-described privacy controls and deployment options. It does not
     * validate PFM's proposed retail configuration or make it legally compliant.
     * In particular,
     * multi-camera matching is described only as anonymous matched journeys
     * across camera views; nothing in this model may render it as identity,
     * facial recognition or personal identification.
     */
    id: "impl-isarsoft-camera-analytics",
    capabilityIds: ["TECH-02", "TECH-03", "TECH-05"],
    supplier: "Isarsoft",
    // Kept short deliberately: this string is rendered as a name, and a
    // sentence-length "product" reads as a claim rather than a label. What the
    // analytics run on is said in prose, where it belongs.
    product: "Video analytics",
    implementationRole: "Analytics on existing camera infrastructure",
    measurementMethod: "configured video analytics",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${registry}: SRC-ISARSOFT-PRIVACY-001`],
    supportedClaims: [
      "An analytics layer configured on compatible IP-camera infrastructure, not a 3D sensor",
      "Which measurement question a deployment answers is decided by configuration, per site",
      // Attributed to the supplier, not named: privacy claims must say whose
      // claim they are (task brief, 2026-09-28), and the brochure names no
      // vendor (product lead, 2026-09-27). The source ID carries the name.
      "The supplier states that its analytics can anonymise video in real time and produce metadata such as object positions or counts",
      "The supplier describes local or edge processing on customer hardware as its default deployment, with cloud use optional",
      "The vendor states that its cross-camera matching uses abstract visual features rather than biometric features",
    ],
    unsupportedClaims: [
      "That every deployment supports every capability listed here",
      "Any identity, facial-recognition or personal-identification reading of multi-camera matching",
      "That single-camera dwell at one view is complete in-store journey tracking",
      "Camera compatibility, topology, licensing, accuracy, classification quality or network detail",
      "That every deployment uses the same anonymisation, video-retention, re-identification or storage configuration",
      "That Isarsoft's GDPR compliance statement establishes compliance for a PFM/customer deployment or replaces the controller's assessment",
      "Any privacy claim for an unspecified Isarsoft version or configuration",
      "Xovis privacy evidence, which belongs to Xovis products only and is never inherited here",
    ],
    privacyStatus: "partially_source_backed",
    technicalDetailStatus: "requires_source_mapping",
  },
  {
    // Xovis PC2SE-O, the outdoor variant of the Premium 3D entrance sensor.
    // Named by the product lead on 2026-09-27 for the open-air segments. No
    // datasheet is mapped for this variant, so nothing the indoor sensor's
    // sources say is carried across — not its mounting range, its power, its
    // environment rating or its privacy certification.
    id: "impl-xovis-3d-entrance-outdoor",
    capabilityIds: ["TECH-02"],
    supplier: "Xovis",
    product: "PC2SE-O",
    implementationRole: "Premium 3D, outdoor",
    measurementMethod: "overhead 3D stereo vision",
    sourceStatus: "source_backed",
    // Its own datasheet, mapped 2026-09-28. Every figure below is the PC2SE-O's
    // own; none is carried across from the indoor PC2SE. The ePrivacyseal
    // certificate names the PC2SE but not the PC2SE-O, so no certification is
    // claimed and privacy stays partial.
    sourceRefs: [
      ...src(SRC.xovisPc2seOTech),
      `${registry}: PC2SE family membership confirmed by the product lead, 2026-09-28`,
      `${registry}: SRC-XOVIS-PRIVACY-001 names the PC2SE, not the PC2SE-O — certification not mapped`,
    ],
    supportedClaims: [
      "Part of the same 3D stereo-vision entrance sensor family as the indoor 3D Sensor Basic FoV, in a version the manufacturer specifies for outdoor use",
      "Overhead 3D stereo vision with processing on the device itself",
      "Mounting from 2.20 m to 6.00 m for the base model, powered and connected over a single PoE network cable",
      "Specified by the manufacturer for -33 °C to +40 °C and a minimum of 9 lux, with ingress protection against water and dust",
      "The manufacturer describes four privacy modes, with data transmitted only in text format and without personally identifiable information",
    ],
    unsupportedClaims: [
      "Any figure from the indoor sensor's datasheet — this version has its own, and the two differ in operating temperature, illumination and ingress protection",
      "Any accuracy, capture-rate or coverage figure — its datasheet states none",
      "A privacy certification: the privacy certificate names the indoor sensor, not this outdoor version, and the datasheet's own mention of the seal is not the certificate",
      "That the sensor makes an installation legally compliant — the datasheet describes privacy modes, not a compliant system",
      "Privacy evidence belonging to any other device, which is never inherited here",
    ],
    privacyStatus: "partially_source_backed",
    technicalDetailStatus: "source_backed",
  },
  {
    // Bosch FLEXIDOME micro 3100i. Named by the product lead on 2026-09-27 as
    // the IP detection sensor for indoor segments — Retail and Shopping Centre.
    // No datasheet is mapped yet, so every technical and privacy field says so
    // rather than borrowing a figure from another device.
    id: "impl-ip-detection-indoor",
    capabilityIds: ["TECH-02", "TECH-03", "TECH-04", "TECH-05"],
    supplier: "Bosch",
    product: "FLEXIDOME micro 3100i",
    implementationRole: "IP detection sensor for indoor counting and anonymous re-identification",
    measurementMethod: "IP camera with configured detection analytics",
    sourceStatus: "requires_source_mapping",
    // Privacy mapped 2026-09-28: the product lead confirmed this model is a
    // CPP14 device, which puts it inside the IVA Pro Privacy whitepaper's
    // platform scope. Every condition that paper attaches travels with it.
    sourceRefs: [
      `${registry}: FLEXIDOME micro 3100i named by the product lead, 2026-09-27; CPP14 platform confirmed by the product lead, 2026-09-28`,
      `${registry}: SRC-BOSCH-IVA-PRO-PRIVACY-001 — IVA Pro Privacy, firmware 9.40, pp. 3–6`,
    ],
    supportedClaims: [
      "An IP camera whose configured views carry detection analytics — counting lines, zone transitions and, where configured, anonymous re-identification",
      "Which of those a deployment answers is decided by configuration and camera placement, per site",
      "The manufacturer describes optional privacy masking on this camera platform: blurring or masking people, faces or vehicles, or hiding the video while keeping its metadata",
      "The manufacturer describes these settings per video stream, on supported firmware and analytics variants, and only as configured",
    ],
    unsupportedClaims: [
      "A count or a route outside the configured views — where there is no view, there is no measurement",
      "Any identity, facial-recognition or personal-identification reading of re-identification",
      "Accuracy, coverage, classification quality, retention or storage behaviour — the mapped manufacturer document covers privacy configuration only",
      "That masking is active on every installation: it depends on firmware 9.40, supported modes and correct configuration, and the manufacturer lists cases where it can fail — delayed metadata, some high-resolution still images and image stabilisation",
      "That the camera's privacy settings make a customer installation legally compliant, or describe the analytics a PFM deployment would run on the camera",
      "Privacy evidence belonging to any other device, which is never inherited here",
    ],
    privacyStatus: "partially_source_backed",
    technicalDetailStatus: "requires_source_mapping",
  },
  {
    // Bosch FLEXIDOME 5100i, outdoor. The IP detection sensor for open-air
    // segments — Retail Park and Outlet Centre — named by the product lead on
    // 2026-09-27. Same honesty as its indoor counterpart: nothing is asserted
    // that a mapped document does not yet support.
    id: "impl-ip-detection-outdoor",
    capabilityIds: ["TECH-02", "TECH-03", "TECH-04", "TECH-05"],
    supplier: "Bosch",
    product: "FLEXIDOME 5100i",
    implementationRole: "IP detection sensor for outdoor counting and anonymous re-identification",
    measurementMethod: "IP camera with configured detection analytics",
    sourceStatus: "requires_source_mapping",
    // Privacy mapped 2026-09-28: the product lead confirmed this model is a
    // CPP14 device, which puts it inside the IVA Pro Privacy whitepaper's
    // platform scope. Every condition that paper attaches travels with it.
    sourceRefs: [
      `${registry}: FLEXIDOME 5100i named by the product lead, 2026-09-27; CPP14 platform confirmed by the product lead, 2026-09-28`,
      `${registry}: SRC-BOSCH-IVA-PRO-PRIVACY-001 — IVA Pro Privacy, firmware 9.40, pp. 3–6`,
    ],
    supportedClaims: [
      "An IP camera whose configured views carry detection analytics — counting lines, zone transitions and, where configured, anonymous re-identification",
      "Which of those a deployment answers is decided by configuration and camera placement, per site",
      "The manufacturer describes optional privacy masking on this camera platform: blurring or masking people, faces or vehicles, or hiding the video while keeping its metadata",
      "The manufacturer describes these settings per video stream, on supported firmware and analytics variants, and only as configured",
    ],
    unsupportedClaims: [
      "A count or a route outside the configured views — where there is no view, there is no measurement",
      "Any identity, facial-recognition or personal-identification reading of re-identification",
      "Accuracy, coverage, classification quality, retention or storage behaviour — the mapped manufacturer document covers privacy configuration only",
      "That masking is active on every installation: it depends on firmware 9.40, supported modes and correct configuration, and the manufacturer lists cases where it can fail — delayed metadata, some high-resolution still images and image stabilisation",
      "That the camera's privacy settings make a customer installation legally compliant, or describe the analytics a PFM deployment would run on the camera",
      "Privacy evidence belonging to any other device, which is never inherited here",
    ],
    privacyStatus: "partially_source_backed",
    technicalDetailStatus: "requires_source_mapping",
  },
  {
    // Milesight VS361. Physical passer-by measurement at a frontage — a
    // different measurement question from entrance counting, and not geo.
    //
    // The prototype product input described this as "passive infrared". The
    // real datasheet describes a DIFFUSE-REFLECTIVE photoelectric switch with
    // an active 940 nm infrared emitter, which is an active method, not a
    // passive one. The datasheet wins.
    id: "impl-milesight-vs361-passerby",
    capabilityIds: ["TECH-01"],
    supplier: "Milesight",
    product: "VS361",
    implementationRole: "Passer-by measurement option",
    measurementMethod: "diffuse-reflective infrared beam (940 nm)",
    sourceStatus: "source_backed",
    sourceRefs: src(SRC.milesightVs361Tech),
    supportedClaims: [
      "Detects a passer-by by emitting an infrared beam and registering its reflection",
      "Wall-mounted at 0.7–1.2 m, with a detection distance adjustable from 1 m to 9 m",
      "IP65-rated for outdoor frontage use, from -20 °C to 50 °C",
      "Powered over PoE or 12–60 V DC, at a maximum of 0.9 W",
      "The device has no camera and no image sensor: its only output is a digital switching signal",
    ],
    unsupportedClaims: [
      "Any accuracy figure, or that a passer-by count is a store visit",
      "Direction, classification, attribute or unique-visitor output — the device emits one switching signal",
      "Formal data-protection certification, legal basis or retention behaviour, none of which the datasheet addresses",
      "Application of any of this to another passer-by implementation",
    ],
    privacyStatus: "partially_source_backed",
    technicalDetailStatus: "source_backed",
  },
  {
    /**
     * RoboSense Airy — a possible LiDAR implementation for spatial movement.
     *
     * An important honesty boundary lives here. The mapped datasheet is a
     * robotics LiDAR datasheet: it documents the sensor thoroughly (FOV, range,
     * precision, point rate, output format) but positions the device for
     * obstacle avoidance, mapping and navigation on robots. It says nothing
     * about retail spatial analytics, anonymous trajectories or data
     * protection. The sensor specifications are therefore source-backed while
     * the analytics and privacy layers are not, and the record says exactly
     * that rather than borrowing credibility from the specification table.
     */
    id: "impl-lidar-spatial",
    capabilityIds: ["TECH-04"],
    supplier: "RoboSense",
    product: "Airy",
    implementationRole: "Advanced spatial intelligence",
    measurementMethod: "3D LiDAR point cloud",
    sourceStatus: "partially_source_backed",
    sourceRefs: src(SRC.robosenseAiryTech),
    supportedClaims: [
      "Hemispherical 360° × 90° field of view from a single unit",
      "Class 1 eye-safe laser, unaffected by ambient lighting conditions",
      "Outputs a point cloud of spatial coordinates over Ethernet — it captures no image of a person",
    ],
    unsupportedClaims: [
      "Retail spatial analytics — the mapped datasheet documents the sensor for robotics, not for people-movement measurement",
      "The analytics layer that would turn a point cloud into anonymous trajectories, which no mapped source covers",
      "Coverage, resolution, tracking continuity, classification, installation topology or output equivalence with 3D stereo vision",
      "Any privacy, retention or identity-handling behaviour; no data-protection source is mapped",
      "That a specification measured for one configuration applies to every RoboSense configuration",
    ],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "source_backed",
  },
  {
    // Xovis PF-L. A DIFFERENT product from the PC2SE, grounded in its own
    // datasheet. The shared Xovis ePrivacy certificate genuinely covers it —
    // Annex 1 names "PF-L" in the certified product list — so this is one of
    // the rare cases where vendor-level privacy evidence legitimately applies
    // to two products. That is established by reading the certificate's scope,
    // not by assuming that a vendor document covers a vendor's whole catalogue.
    id: "impl-xovis-3d-spatial",
    capabilityIds: ["TECH-04"],
    supplier: "Xovis",
    product: "PF-L",
    implementationRole: "3D in-store spatial option",
    measurementMethod: "3D stereo vision",
    sourceStatus: "source_backed",
    sourceRefs: src(SRC.xovisPflTech, SRC.xovisPrivacySeal, SRC.xovisPrivacyDeclaration, SRC.xovisPrivacyFw5),
    supportedClaims: [
      "3D stereo vision with on-device AI processing, for indoor use",
      "Mounting from 2.00 m to 6.00 m over PoE, with USB-C as an alternative supply",
      "The manufacturer states that all processing happens on the device and that only text data is transmitted",
      "Four selectable privacy levels; the certified scope covers level 2 and above",
    ],
    unsupportedClaims: [
      "The 3D Sensor Basic FoV's specifications — the two are different devices and neither one's figures describe the other",
      "Equivalence with LiDAR in coverage, resolution, tracking continuity, classification, installation topology or output",
      "Full-journey continuity, universal coverage, classification, re-identification or any accuracy figure",
      "How many units a given floor area needs, which is a per-site design question no datasheet answers",
    ],
    privacyStatus: "source_backed",
    technicalDetailStatus: "source_backed",
  },
  {
    id: "impl-configured-classification",
    capabilityIds: ["TECH-03"],
    supplier: null,
    product: "Compatible configured analytics or plugin",
    implementationRole: "Optional classification add-on",
    sourceStatus: "requires_product_validation",
    sourceRefs: [`${technologyModel}: Implementation source registry`, `${matrix}: Technology library!A7:G7`],
    supportedClaims: ["Only classifications explicitly enabled, configured and permitted for a compatible implementation"],
    unsupportedClaims: ["That every counter supports identical classifications or any named classification without validation"],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_product_validation",
  },
  {
    id: "impl-anonymous-visit-matching",
    capabilityIds: ["TECH-05"],
    supplier: null,
    product: null,
    implementationRole: "Advanced matching or continuity",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${technologyModel}: Implementation source registry`, `${matrix}: Technology library!A9:G9`],
    supportedClaims: ["Visit duration, cross-visitation or brand flow only where the measurement design supports matched events"],
    unsupportedClaims: ["Product support, matching quality, persistence, identifier mechanics, retention, storage or universal availability"],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_product_validation",
  },
  {
    id: "impl-vehicle-arrival-method",
    capabilityIds: ["TECH-06"],
    supplier: null,
    product: null,
    implementationRole: "Vehicle-arrival method class",
    sourceStatus: "source_backed",
    sourceRefs: [`${matrix}: Technology library!A10:G10`],
    supportedClaims: ["Vehicle entries, exits and arrival rhythm where configured"],
    unsupportedClaims: ["Supplier, accuracy, classification, storage, plate capture or suitability for occupancy and origin"],
    privacyStatus: "architecture_only",
    technicalDetailStatus: "requires_source_mapping",
  },
  {
    id: "impl-parking-occupancy-method",
    capabilityIds: ["TECH-06"],
    supplier: null,
    product: null,
    implementationRole: "Parking-occupancy method class",
    sourceStatus: "source_backed",
    sourceRefs: [`${matrix}: Technology library!A10:G10`],
    supportedClaims: ["Bay state or occupancy derived from the configured parking setup"],
    unsupportedClaims: ["Supplier, accuracy, turnover logic, space-level coverage or interchangeability with arrival counting"],
    privacyStatus: "architecture_only",
    technicalDetailStatus: "requires_source_mapping",
  },
  {
    id: "impl-lawful-anpr-lpr",
    capabilityIds: ["TECH-06"],
    supplier: null,
    product: null,
    implementationRole: "Conditional lawful origin or access method",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${technologyModel}: Implementation source registry`, `${matrix}: Definitions & guardrails!A14:B14`],
    supportedClaims: ["Licence-plate or country-code events only where lawful, configured and supported by jurisdiction and source"],
    unsupportedClaims: ["Supplier, legal basis, retention, storage, security, accuracy, jurisdictional availability or local home origin from a Dutch plate"],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_source_mapping",
  },
  {
    /**
     * Tattile Basic MK2 Varifocal — vehicle / ANPR intelligence.
     *
     * ARCHITECTURE AND SOURCE MAPPING ONLY. This is deliberately not reachable
     * from the Retail experience: no Retail scene declares TECH-06, so no
     * Retail solution direction can resolve it. It is prepared here so a future
     * Shopping Centre / Retail Park / Outlet Centre Configure experience
     * inherits the semantics instead of re-deriving them.
     *
     * The two invariants that matter most:
     *
     * 1. This is vehicle measurement, never people counting. A vehicle is not a
     *    visitor, and property footfall cannot be inferred from a vehicle count
     *    without a separate methodology and a separate source.
     * 2. A licence plate is not anonymous. The mapped datasheet documents
     *    cybersecurity (IEC-62443, AES256, SHA2) — which is not the same thing
     *    as data protection — and documents on-device JPG image storage. No
     *    people-counting privacy language may be carried across to it.
     *
     * Note on the vendor name: the manufacturer spells itself "Tattile"
     * (www.tattile.com). The reference directory is spelled `tatille/`, which
     * is retained so existing paths keep resolving; the vendor name here
     * follows the source document.
     */
    id: "impl-tattile-anpr-vehicle",
    capabilityIds: ["TECH-06"],
    supplier: "Tattile",
    product: "Basic MK2 Varifocal",
    implementationRole: "Vehicle and registration-plate intelligence",
    measurementMethod: "ANPR camera with on-board plate recognition",
    sourceStatus: "partially_source_backed",
    sourceRefs: src(SRC.tattileMk2Tech, SRC.tattileEnforcementCatalogue),
    supportedClaims: [
      "Single-lane ANPR camera with the plate-recognition engine running on the device",
      "Working distance from 3 m to 15 m, with a varifocal lens and infrared illumination",
      "IP67-rated, powered over PoE+ or 24 V DC",
      "The software platform carries an IEC-62443 cybersecurity certification",
      // Added 2026-09-04 from the enforcement catalogue. "Optional" is part of
      // the claim rather than a footnote to it: every product spec table in that
      // document lists the four vehicle attributes as optional, never standard.
      "Plate metadata recognition including region and country, per the vendor's world OCR",
      "Vehicle classification, make, model and colour, as optional add-ons where specified",
    ],
    unsupportedClaims: [
      "That this counts people — it detects vehicles, and one vehicle is never one visitor",
      "Property footfall, visitor numbers or people visits derived from vehicle events",
      "That a licence plate is anonymous, or that people-counting privacy evidence applies here",
      // Corrected 2026-09-04. The MK2 datasheet documents no country output; the
      // enforcement catalogue does. What survives the correction is the half that
      // was never about a datasheet at all.
      "Vehicle registration origin as visitor home origin — a registration country is where a vehicle is registered, never where a person lives",
      "That the vehicle attributes are standard — classification, make, model and colour are optional add-ons on every model listed",
      "That an enforcement deployment transfers unchanged to a retail car park — the catalogue documents speed, red light, LEZ, bus lane and tolling",
      "Legal basis, lawful jurisdiction, retention, deletion or plate-hashing behaviour; the datasheet covers cybersecurity, not data protection",
      "Generic GDPR compliance",
      "The manufacturer's own detection and reading percentages, which PFM does not restate as claims",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "source_backed",
  },
  {
    id: "impl-aggregate-geo-mobility",
    capabilityIds: ["TECH-07"],
    supplier: null,
    product: "Approved external contextual source",
    implementationRole: "Connected contextual intelligence",
    sourceStatus: "source_backed",
    sourceRefs: [`${matrix}: Technology library!A11:G11`],
    supportedClaims: ["Aggregate catchment, origin, competition, travel-time or tourism context where an approved source supports it"],
    unsupportedClaims: ["Provider, sample, precision, representativeness, contractual rights or substitution for physical measurement"],
    privacyStatus: "source_backed",
    technicalDetailStatus: "requires_source_mapping",
  },
  {
    id: "impl-business-data-connection",
    capabilityIds: ["TECH-08"],
    supplier: null,
    product: "Customer or external business systems",
    implementationRole: "Connected business context",
    sourceStatus: "source_backed",
    sourceRefs: [`${matrix}: Technology library!A12:G12`, "AGENTS.md: Integration boundaries"],
    supportedClaims: ["Joins approved POS, staffing, campaign, ERP, BI or operational context to movement evidence"],
    unsupportedClaims: ["Live connector availability, direct browser access, automatic recommendation, pricing or movement measurement"],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_product_validation",
  },

  // ---------------------------------------------------------------------
  // QSR / Drive-Thru implementation options.
  //
  // Implementation options, not recommendations. Nothing in this model
  // selects a product, a NEXEO tier or a voice AI provider, and nothing
  // ranks or prices these options. Where the source states that
  // availability or compatibility must be revalidated, that uncertainty is
  // preserved rather than resolved.
  // [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §5, §15, §21, §35]
  // ---------------------------------------------------------------------
  {
    id: "impl-hme-zoom-nitro-timer",
    capabilityIds: ["TECH-QSR-01", "TECH-QSR-02"],
    supplier: "HME",
    product: "ZOOM Nitro Timer",
    implementationRole: "Real-time drive-thru timing and diagnostic environment",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability B`, `${qsrSpec}: §15 Product / capability truth table`, "https://www.hme.com/qsr/zoom-nitro-drive-thru-timers/"],
    supportedClaims: [
      "Current core timer and diagnostic capability per the source model",
      "Real-time service time, bottleneck visibility and car count within the configured measurement design",
      "Additional configured spaces such as pull-forward and mobile pickup where supported",
    ],
    unsupportedClaims: [
      "Accuracy, throughput improvement, revenue uplift, order accuracy or queue reduction",
      "That timing data alone establishes an operational cause",
      "Universal POS, geofence or mobile integration availability",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available",
      "Current core capability per the source model; site design and configuration remain project-specific.",
    ),
  },
  {
    id: "impl-compatible-vehicle-detection",
    capabilityIds: ["TECH-QSR-01"],
    supplier: null,
    product: "Compatible vehicle detection infrastructure",
    implementationRole: "Vehicle detection method class",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability A`, "https://www.hme.com/qsr/add-a-drive-thru/"],
    supportedClaims: [
      "Detection at configured journey points such as lane entry, order post and windows",
      "The source describes magnetic/inductive loops as one common detection method among compatible methods",
    ],
    unsupportedClaims: [
      "That one fixed detection technology is mandatory for every site",
      "Supplier, accuracy, coverage, part specification or installation detail",
    ],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available_if_compatible",
      "Detection design is site-specific; the implementation depends on lane geometry and engineering assessment.",
    ),
  },
  {
    id: "impl-hme-nexeo-core",
    capabilityIds: ["TECH-QSR-03"],
    supplier: "HME",
    product: "NEXEO Core",
    implementationRole: "Core digital drive-thru communication tier",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability C`, `${qsrSpec}: §15 Product / capability truth table`, "https://www.hme.com/qsr/drive-thru-headsets-NEXEO/"],
    supportedClaims: ["Core digital drive-thru communication per the source tier description"],
    unsupportedClaims: [
      "1:1 or group crew communication — the source says not to attribute this to Core unless verified in the current tier matrix",
      "Voice commands — attribute only where the tier is verified to support it",
      "Third-party voice AI integration",
      "Advanced noise and echo cancellation",
    ],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available",
      "Tier-specific feature availability must be verified against the current tier matrix before any tier-level claim.",
    ),
  },
  {
    id: "impl-hme-nexeo",
    capabilityIds: ["TECH-QSR-03"],
    supplier: "HME",
    product: "NEXEO",
    implementationRole: "Broader crew communication tier",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability C`, `${qsrSpec}: §15 Product / capability truth table`, "https://www.hme.com/qsr/drive-thru-headsets-NEXEO/"],
    supportedClaims: [
      "Broader crew communication and timer integration where the tier supports it",
    ],
    unsupportedClaims: [
      "Specific per-tier feature lists without verification against the current tier matrix",
      "Third-party voice AI integration",
    ],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available",
      "Tier capability boundaries remain subject to verification against the current tier matrix.",
    ),
  },
  {
    id: "impl-hme-nexeo-pro",
    capabilityIds: ["TECH-QSR-03", "TECH-QSR-09"],
    supplier: "HME",
    product: "NEXEO Pro",
    implementationRole: "Advanced third-party integration tier",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability C`, `${qsrSpec}: §5 Capability I`, "https://www.hme.com/qsr/drive-thru-voice-ai-ordering/"],
    supportedClaims: [
      "Advanced third-party integration tier, positioned by the source for third-party voice AI ordering integration",
    ],
    unsupportedClaims: [
      "That PFM supplies the voice AI service",
      "Any named voice AI provider",
      "Automation outcomes such as labour saving, accuracy or speed improvement",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available",
      "Voice AI readiness additionally requires a separate compatible third-party provider chosen by the customer.",
    ),
  },
  {
    id: "impl-hme-clearsoundx",
    capabilityIds: ["TECH-QSR-04"],
    supplier: "HME",
    product: "ClearSoundX",
    implementationRole: "Audio clarity enhancement",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability D`, `${qsrSpec}: §15 Product / capability truth table`, "https://qsr.hme.com/clearsoundx"],
    supportedClaims: [
      "Advanced noise and echo cancellation enhancement for the communication platform per the source description",
      "The source describes it for the broader and advanced crew-communication tiers",
    ],
    unsupportedClaims: [
      "Order accuracy, repetition or speed improvement figures",
      "Regional availability in any PFM market without validation",
      "Availability on the Core tier",
    ],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "optional_add_on",
      "Enhancement capability, not an opening proposition. Regional and product availability must be validated before presenting it as orderable in a PFM market.",
    ),
  },
  {
    id: "impl-hme-text-and-connect",
    capabilityIds: ["TECH-QSR-03"],
    supplier: "HME",
    product: "Text & Connect",
    implementationRole: "Optional cloud text-to-speech messaging",
    sourceStatus: "requires_product_validation",
    sourceRefs: [`${qsrSpec}: §15 Product / capability truth table`],
    supportedClaims: ["Listed by the source as an advanced, optional capability"],
    unsupportedClaims: [
      "Tier availability, functional scope, regional availability or integration detail",
    ],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_source_mapping",
    commercialAvailability: availability(
      "requires_validation",
      "The source model lists this only as an advanced optional capability; scope and availability are unresolved.",
    ),
  },
  {
    id: "impl-compatible-pos-integration",
    capabilityIds: ["TECH-QSR-05"],
    supplier: null,
    product: "Compatible POS integration",
    implementationRole: "Connected order-context integration",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability E`, `${qsrSpec}: §15 Product / capability truth table`, `${qsrSpec}: §21 Availability and confidence states`],
    supportedClaims: [
      "Order context such as transaction reference, order value or order state where a compatible integration exists",
    ],
    unsupportedClaims: [
      "Universal POS availability",
      "A named POS platform, brand or connector",
      "That order value or revenue can be derived from timer data",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available_if_compatible",
      "Brand and POS platform compatibility must be confirmed per customer; never present POS integration as universally available.",
    ),
  },
  {
    id: "impl-compatible-geofence-mobile-integration",
    capabilityIds: ["TECH-QSR-05"],
    supplier: null,
    product: "Compatible geofence or mobile-order integration",
    implementationRole: "Connected mobile/curbside context integration",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §15 Product / capability truth table`],
    supportedClaims: ["Mobile or geofence flow context where a compatible integration exists"],
    unsupportedClaims: [
      "Universal availability",
      "A named mobile ordering platform or provider",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_source_mapping",
    commercialAvailability: availability(
      "available_if_compatible",
      "Brand and platform dependent; compatibility must be confirmed per customer.",
    ),
  },
  {
    id: "impl-hme-zoom-nitro-nexeo-alerting",
    capabilityIds: ["TECH-QSR-06"],
    supplier: "HME",
    product: "ZOOM Nitro with a compatible NEXEO configuration",
    implementationRole: "Closed-loop timer alert into crew communication",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability F`, `${qsrSpec}: §15 Product / capability truth table`],
    supportedClaims: [
      "Timer threshold events can be delivered into crew communication through a compatible configuration",
      "Configurable thresholds and targeted recipients or groups within the configured setup",
    ],
    unsupportedClaims: [
      "That an alert changes the operational outcome by itself",
      "Response-time, service-time or throughput improvement figures",
      "Tier-specific routing behaviour without verification",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available_if_compatible",
      "Requires a compatible timer and communication configuration on the same site.",
    ),
  },
  {
    id: "impl-hme-zoom-nitro-data-cloud",
    capabilityIds: ["TECH-QSR-07"],
    supplier: "HME",
    product: "ZOOM Nitro Data / HME CLOUD",
    implementationRole: "Enterprise reporting and multi-site management environment",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability G`, `${qsrSpec}: §15 Product / capability truth table`, "https://qsr.hme.com/zoom/data"],
    supportedClaims: [
      "Multi-store and hierarchical reporting, car counts, average service times and goal percentages per the source description",
      "Remote timer settings and support per the source description",
    ],
    unsupportedClaims: [
      "Benchmark values, customer results or estate-level improvement claims",
      "That comparison establishes why one restaurant is faster",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available",
      "Current enterprise capability per the source model; subscription and service scope remain project-specific.",
    ),
  },
  {
    id: "impl-hme-zoom-nitro-gamification",
    capabilityIds: ["TECH-QSR-08"],
    supplier: "HME",
    product: "ZOOM Nitro Gamification",
    implementationRole: "Optional team engagement layer",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability H`, `${qsrSpec}: §15 Product / capability truth table`],
    supportedClaims: ["Contests and goal visibility for crews per the source description"],
    unsupportedClaims: ["Any performance, retention or engagement outcome figure"],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "optional_add_on",
      "Secondary reveal only; never part of the primary QSR commercial story.",
    ),
  },
  {
    id: "impl-hme-zoom-nitro-leaderboard",
    capabilityIds: ["TECH-QSR-08"],
    supplier: "HME",
    product: "ZOOM Nitro Leaderboard",
    implementationRole: "Optional multi-store competition layer",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability H`, `${qsrSpec}: §15 Product / capability truth table`],
    supportedClaims: ["Multi-store competition per the source description"],
    unsupportedClaims: ["Any performance, retention or engagement outcome figure"],
    privacyStatus: "requires_source_mapping",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "optional_add_on",
      "Secondary reveal only; never part of the primary QSR commercial story.",
    ),
  },
  {
    id: "impl-compatible-voice-ai-provider",
    capabilityIds: ["TECH-QSR-09"],
    supplier: null,
    product: "Compatible third-party voice AI provider",
    implementationRole: "Customer-selected third-party automation service",
    sourceStatus: "requires_product_validation",
    sourceRefs: [`${qsrSpec}: §5 Capability I`, `${qsrSpec}: §21 Availability and confidence states`],
    supportedClaims: [
      "A separate compatible third-party provider is required alongside an advanced communication tier",
    ],
    unsupportedClaims: [
      "Any named provider",
      "That PFM supplies, resells or auto-selects the voice AI service",
      "Automation accuracy, labour or speed outcomes",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "available_if_compatible",
      "Provider is selected by the customer and must be compatible; PFM does not supply or auto-select a provider.",
    ),
  },
  {
    id: "impl-hme-nitro-vision-ai",
    capabilityIds: ["TECH-QSR-10"],
    supplier: "HME",
    product: "Nitro Vision AI",
    implementationRole: "Expanded journey visibility add-on",
    sourceStatus: "partially_source_backed",
    sourceRefs: [`${qsrSpec}: §5 Capability J`, `${qsrSpec}: §21 Availability and confidence states`, "https://qsr.hme.com/zoom/visionai"],
    supportedClaims: [
      "Source markets it as an add-on combining computer vision with existing loop infrastructure",
    ],
    unsupportedClaims: [
      "Availability through PFM in Europe",
      "That cameras are part of a standard European solution",
      "Accuracy, drive-off detection quality or any performance figure",
    ],
    privacyStatus: "requires_product_validation",
    technicalDetailStatus: "requires_product_validation",
    commercialAvailability: availability(
      "region_limited",
      "The source states this is available in the United States only at the research baseline. Do not present it as a current PFM Europe solution without explicit confirmation.",
      "United States",
      "2026-08-15",
    ),
  },
];

const scenesFor = (id: TechnologyCapabilityId) =>
  allScenes.filter((scene) => scene.technologyCapabilityIds.includes(id)).map((scene) => scene.id);

export const technologyCapabilities: readonly TechnologyCapabilityDefinition[] = [
  {
    id: "TECH-01",
    name: "Outdoor opportunity measurement",
    purpose: "Explain how passing movement around a frontage is measured.",
    supportedSceneIds: scenesFor("TECH-01"),
    evidenceTypes: ["measured", "derived"],
    privacyPrinciple: "Passing traffic is not a store visit; keep area, direction, period and alignment explicit.",
    implementationIds: ["impl-milesight-vs361-passerby"],
    sourceRefs: [`${matrix}: Technology library!A5:G5`],
  },
  {
    id: "TECH-02",
    name: "Entrance measurement",
    purpose: "Explain how anonymous IN/OUT movement is measured at an entrance.",
    supportedSceneIds: scenesFor("TECH-02"),
    evidenceTypes: ["measured", "derived"],
    privacyPrinciple: "Keep entries, visits and unique visitors distinct and do not present identity.",
    implementationIds: ["impl-xovis-3d-entrance", "impl-milesight-vs125p-entrance", "impl-isarsoft-camera-analytics", "impl-ip-detection-indoor", "impl-ip-detection-outdoor", "impl-xovis-3d-entrance-outdoor"],
    sourceRefs: [`${matrix}: Technology library!A6:G6`],
  },
  {
    id: "TECH-03",
    name: "Anonymous visitor classification",
    purpose: "Explain configured anonymous visitor attributes or buying-unit patterns.",
    supportedSceneIds: scenesFor("TECH-03"),
    evidenceTypes: ["derived"],
    privacyPrinciple: "Classification is optional and estimated; use it only where included, permitted and configured.",
    implementationIds: [
      "impl-configured-classification",
      "impl-milesight-vs125p-entrance",
      "impl-isarsoft-camera-analytics",
      "impl-ip-detection-indoor",
      "impl-ip-detection-outdoor",
    ],
    sourceRefs: [`${matrix}: Technology library!A7:G7`],
  },
  {
    id: "TECH-04",
    name: "Spatial movement intelligence",
    purpose: "Explain how anonymous routes, zones and dwell are measured inside a location.",
    supportedSceneIds: scenesFor("TECH-04"),
    evidenceTypes: ["measured", "derived"],
    privacyPrinciple: "Movement remains anonymous; do not imply identity tracking or infer intent from movement alone.",
    implementationIds: ["impl-lidar-spatial", "impl-xovis-3d-spatial", "impl-ip-detection-indoor", "impl-ip-detection-outdoor"],
    sourceRefs: [`${matrix}: Technology library!A8:G8`],
  },
  {
    id: "TECH-05",
    name: "Anonymous visit matching",
    purpose: "Explain when separate anonymous events may form a visit or journey.",
    supportedSceneIds: scenesFor("TECH-05"),
    evidenceTypes: ["measured", "derived"],
    privacyPrinciple: "Use only when the measurement design supports matching; never imply personal identification.",
    implementationIds: ["impl-anonymous-visit-matching", "impl-isarsoft-camera-analytics", "impl-ip-detection-indoor", "impl-ip-detection-outdoor"],
    sourceRefs: [`${matrix}: Technology library!A9:G9`],
  },
  {
    id: "TECH-06",
    name: "Vehicle and parking intelligence",
    purpose: "Explain vehicle arrival, access and parking pressure as separate measurement questions.",
    supportedSceneIds: scenesFor("TECH-06"),
    evidenceTypes: ["measured", "connected", "derived"],
    privacyPrinciple: "People, vehicles and visits are different units; ANPR/LPR appears only where lawful and configured.",
    implementationIds: [
      "impl-vehicle-arrival-method",
      "impl-parking-occupancy-method",
      "impl-lawful-anpr-lpr",
      "impl-tattile-anpr-vehicle",
    ],
    sourceRefs: [`${matrix}: Technology library!A10:G10`],
  },
  {
    id: "TECH-07",
    name: "Geo, mobility and GIS",
    purpose: "Explain how aggregate location context is added around a physical asset.",
    supportedSceneIds: scenesFor("TECH-07"),
    evidenceTypes: ["connected", "derived"],
    privacyPrinciple: "Context stays aggregate and cannot replace direct entrance measurement.",
    implementationIds: ["impl-aggregate-geo-mobility"],
    sourceRefs: [`${matrix}: Technology library!A11:G11`],
  },
  {
    id: "TECH-08",
    name: "Business data connection and analytics",
    purpose: "Explain how operational or customer data is joined to movement evidence.",
    supportedSceneIds: scenesFor("TECH-08"),
    evidenceTypes: ["connected", "derived"],
    privacyPrinciple: "Connected customer data remains distinct; calculated KPIs require aligned definitions and source layers.",
    implementationIds: ["impl-business-data-connection"],
    sourceRefs: [`${matrix}: Technology library!A12:G12`],
  },

  // ---------------------------------------------------------------------
  // QSR / Drive-Thru capabilities.
  //
  // Capability-first and vendor-neutral, exactly like TECH-01..08. The QSR
  // capability IDs are namespaced (TECH-QSR-nn) so no existing capability ID
  // is altered or renumbered. TECH-06 (vehicle and parking intelligence) is
  // deliberately NOT reused for vehicle journey detection: property vehicle
  // arrival/parking-occupancy measurement and drive-thru journey-stage timing
  // are different measurement questions with different implementations.
  // [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §5, §15, §21]
  // ---------------------------------------------------------------------
  {
    id: "TECH-QSR-01",
    name: "Vehicle journey detection",
    purpose:
      "Explain how a vehicle is detected at configured points so a drive-thru journey timeline can exist.",
    supportedSceneIds: scenesFor("TECH-QSR-01"),
    evidenceTypes: ["measured"],
    privacyPrinciple:
      "Vehicles are detected as anonymous operational units at configured points; detection design is site-specific and no single method is mandatory.",
    implementationIds: ["impl-compatible-vehicle-detection", "impl-hme-zoom-nitro-timer"],
    commercialAvailability: availability(
      "available_if_compatible",
      "Detection points and method depend on site design and engineering assessment.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability A`],
  },
  {
    id: "TECH-QSR-02",
    name: "Real-time drive-thru timing",
    purpose:
      "Explain how elapsed time between configured detection points becomes stage, queue and lane total time.",
    supportedSceneIds: scenesFor("TECH-QSR-02"),
    evidenceTypes: ["measured", "derived"],
    privacyPrinciple:
      "A measured time is only meaningful with its defined start point, end point and period; timing never establishes an operational cause.",
    implementationIds: ["impl-hme-zoom-nitro-timer"],
    commercialAvailability: availability(
      "available",
      "Current core timing capability per the source model.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability B`, `${qsrSpec}: §16 KPI and data vocabulary`],
  },
  {
    id: "TECH-QSR-03",
    name: "Drive-thru and crew communication",
    purpose:
      "Explain guest-to-crew and crew-to-crew communication at and around the order point.",
    supportedSceneIds: scenesFor("TECH-QSR-03"),
    evidenceTypes: ["measured"],
    privacyPrinciple:
      "Tier capability differs; never generalise one tier's communication features to another without the current tier matrix.",
    implementationIds: [
      "impl-hme-nexeo-core",
      "impl-hme-nexeo",
      "impl-hme-nexeo-pro",
      "impl-hme-text-and-connect",
    ],
    commercialAvailability: availability(
      "available",
      "Tier selection follows the customer's requirement and is never chosen automatically.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability C`, `${qsrSpec}: §15 Product / capability truth table`],
  },
  {
    id: "TECH-QSR-04",
    name: "Audio clarity",
    purpose:
      "Explain how communication quality between guest and crew can be improved in a noisy lane environment.",
    supportedSceneIds: scenesFor("TECH-QSR-04"),
    evidenceTypes: ["measured"],
    privacyPrinciple:
      "An enhancement capability, not an opening proposition; no accuracy or repetition improvement may be claimed without an approved proof source.",
    implementationIds: ["impl-hme-clearsoundx"],
    commercialAvailability: availability(
      "optional_add_on",
      "Regional and tier availability must be validated before presenting it as orderable in a PFM market.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability D`],
  },
  {
    id: "TECH-QSR-05",
    name: "POS and order-context integration",
    purpose:
      "Explain how order context can be associated with measured wait time where a compatible integration exists.",
    supportedSceneIds: scenesFor("TECH-QSR-05"),
    evidenceTypes: ["connected", "derived"],
    privacyPrinciple:
      "Order context is connected business data, never measured by the timer, and never universally available.",
    implementationIds: [
      "impl-compatible-pos-integration",
      "impl-compatible-geofence-mobile-integration",
    ],
    commercialAvailability: availability(
      "available_if_compatible",
      "Brand / POS platform compatibility must be confirmed.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability E`, `${qsrSpec}: §21 Availability and confidence states`],
  },
  {
    id: "TECH-QSR-06",
    name: "Alerts into workflow",
    purpose:
      "Explain how a threshold event reaches the person who can change the outcome instead of another screen.",
    supportedSceneIds: scenesFor("TECH-QSR-06"),
    evidenceTypes: ["measured", "decision"],
    privacyPrinciple:
      "An alert enables a human response; the operational change, not the alert, produces the outcome.",
    implementationIds: ["impl-hme-zoom-nitro-nexeo-alerting"],
    commercialAvailability: availability(
      "available_if_compatible",
      "Requires a compatible timer and communication configuration on the same site.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability F`],
  },
  {
    id: "TECH-QSR-07",
    name: "Enterprise performance intelligence",
    purpose:
      "Explain multi-restaurant, hierarchy, daypart and historical comparison of measured service performance.",
    supportedSceneIds: scenesFor("TECH-QSR-07"),
    evidenceTypes: ["connected", "derived"],
    privacyPrinciple:
      "Comparison requires compatible metric definitions and a comparable period; a ranking is a question, not a proven cause.",
    implementationIds: ["impl-hme-zoom-nitro-data-cloud"],
    commercialAvailability: availability(
      "available",
      "Current enterprise capability per the source model.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability G`],
  },
  {
    id: "TECH-QSR-08",
    name: "Team engagement and gamification",
    purpose:
      "Explain optional goal visibility, contests and leaderboards for crews.",
    supportedSceneIds: scenesFor("TECH-QSR-08"),
    evidenceTypes: ["derived"],
    privacyPrinciple:
      "Secondary reveal only; it must never carry the primary QSR commercial story or imply a performance outcome.",
    implementationIds: [
      "impl-hme-zoom-nitro-gamification",
      "impl-hme-zoom-nitro-leaderboard",
    ],
    commercialAvailability: availability(
      "optional_add_on",
      "Optional engagement layer, deliberately outside the primary commercial story.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability H`],
  },
  {
    id: "TECH-QSR-09",
    name: "Voice AI readiness",
    purpose:
      "Explain what an automated order-taking option would require, while keeping crew takeover and escalation.",
    supportedSceneIds: scenesFor("TECH-QSR-09"),
    evidenceTypes: ["measured"],
    privacyPrinciple:
      "An advanced, optional readiness layer; PFM does not supply or select the third-party voice AI service.",
    implementationIds: ["impl-hme-nexeo-pro", "impl-compatible-voice-ai-provider"],
    commercialAvailability: availability(
      "available_if_compatible",
      "Requires an advanced communication tier plus a separate compatible third-party voice AI provider. Do not invent or auto-select a provider.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability I`, `${qsrSpec}: §21 Availability and confidence states`],
  },
  {
    id: "TECH-QSR-10",
    name: "Vision AI and expanded journey visibility",
    purpose:
      "Explain the technology horizon for expanded drive-thru journey visibility beyond configured detection points.",
    supportedSceneIds: scenesFor("TECH-QSR-10"),
    evidenceTypes: ["measured"],
    privacyPrinciple:
      "Region-limited at the research baseline; it must not be shown as part of a standard European solution and no camera imagery may imply that it is.",
    implementationIds: ["impl-hme-nitro-vision-ai"],
    commercialAvailability: availability(
      "region_limited",
      "The source states United States only at the research baseline. Not a current PFM Europe implementation without explicit confirmation.",
      "United States",
      "2026-08-15",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability J`, `${qsrSpec}: §21 Availability and confidence states`],
  },
];
