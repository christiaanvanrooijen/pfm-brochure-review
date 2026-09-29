import type {
  ProofAssetDefinition,
  ProofAssetId,
  SceneId,
  SegmentId,
  TechnologyCapabilityId,
} from "./types.ts";

const matrix = "PFM_Segment_Insight_Matrix_v1_1.xlsx";
const qsrSpec = "docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md";

const placeholder = (
  id: ProofAssetId,
  title: string,
  segment: SegmentId,
  relatedSceneIds: readonly SceneId[],
  relatedCapabilityIds: readonly TechnologyCapabilityId[],
  sourceRef: string,
): ProofAssetDefinition => ({
  id,
  title,
  customerName: null,
  media: null,
  publishedSourceUrls: [],
  truthBoundary: null,
  segment,
  relatedSceneIds,
  relatedCapabilityIds,
  format: null,
  status: "placeholder",
  playable: false,
  videoDuration: null,
  thumbnailAssetId: null,
  challenge: null,
  measurementApproach: null,
  customerLearning: null,
  externalUseApproved: false,
  sourceRef,
});

export const proofAssets: readonly ProofAssetDefinition[] = [
  // Published customer cases, included on the product lead's instruction of
  // 2026-09-28 (DECISION-LOG.md). Each is PFM's own public case page and video;
  // the brochure links to them and restates no figure from them. A case is
  // attached only to the scenes it actually evidences: `relatedSceneIds` is the
  // gate, even where a scene's slot is shared with scenes it does not cover.
  {
    id: "CASE-RET-01",
    title: "From visitor counting to store conversion",
    customerName: "Madaq",
    media: { kind: "youtube", videoId: "_UjDI5o5T3I", publishedTitle: "PFM Customer Case - MADAQ" },
    publishedSourceUrls: ["https://www.pfm-intelligence.com/cases/madaq"],
    truthBoundary:
      "The sensors count visitors; they do not measure sales. Conversion, average basket value and products per visit are calculated with the retailer's own sales data. No accuracy or result figure is restated here.",
    segment: "retail",
    // Not the street or visitor-composition scenes: the case measures no
    // passers-by, and its visitor attributes include gender, which the
    // brochure does not present.
    relatedSceneIds: ["retail-store-visits", "retail-conversion-sales-context"],
    relatedCapabilityIds: ["TECH-02", "TECH-08"],
    format: "video",
    status: "available",
    playable: true,
    videoDuration: 204,
    thumbnailAssetId: null,
    challenge:
      "A premium food retailer whose store decisions had run largely on instinct wanted numbers it could trust behind each one.",
    measurementApproach:
      "Visitors are counted at the shop entrances. Combined with the retailer's own sales data, those counts become conversion, average basket value and products per visit.",
    customerLearning:
      "In the published case, decisions once made on gut feeling are supported by data on conversion, basket value and products per visit, and turned into action on the shop floor.",
    externalUseApproved: true,
    sourceRef:
      "Published PFM case, https://www.pfm-intelligence.com/cases/madaq; PFM Intelligence Group YouTube video _UjDI5o5T3I, published 2026-07-27; included on product-lead instruction, 2026-09-28",
  },
  {
    id: "CASE-RET-02",
    title: "The visitor journey inside a brand store",
    customerName: "Future Stores London",
    media: {
      kind: "youtube",
      videoId: "FLLpevyxTss",
      publishedTitle: "PFM x Future Stores: A Customer Case Video about People Flow Intelligence",
    },
    publishedSourceUrls: ["https://www.pfm-intelligence.com/cases/future-stores"],
    truthBoundary:
      "The case names no result figure, and none is shown here. It describes what is measured and how it is delivered, not an uplift.",
    segment: "retail",
    // Journey, zones, dwell and staff interaction are what the case describes.
    // Product categories are not, so that scene keeps no proof.
    relatedSceneIds: ["retail-in-store-journey", "retail-zone-engagement", "retail-visit-duration", "retail-staff-interaction"],
    relatedCapabilityIds: ["TECH-04", "TECH-05"],
    format: "video",
    status: "available",
    playable: true,
    videoDuration: 203,
    thumbnailAssetId: null,
    challenge:
      "Brand activations in a flagship store are short-lived: a layout or feature that is not working has to be spotted during the activation, not in a report weeks later.",
    measurementApproach:
      "The published case describes measurement across the visitor journey: people passing outside, entering, moving through the space, engaging with zones, interacting with staff and leaving, delivered hourly through PFM's Advantage platform.",
    customerLearning:
      "In the published case, brand partners use this while an activation is running, rather than reading about it afterwards.",
    externalUseApproved: true,
    sourceRef:
      "Published PFM case, https://www.pfm-intelligence.com/cases/future-stores; PFM Intelligence Group YouTube video FLLpevyxTss, published 2026-06-19; included on product-lead instruction, 2026-09-28",
  },
  placeholder("CASE-RET-03", "Portfolio performance proof", "retail", ["retail-portfolio-comparison"], ["TECH-08"], `${matrix}: Visual & proof registry!A24:G24`),
  placeholder("CASE-SC-01", "Catchment & destination proof", "shopping-centre", ["shopping-centre-catchment-area", "shopping-centre-competitive-visitation-white-spots", "shopping-centre-vehicle-origin"], ["TECH-06", "TECH-07"], `${matrix}: Visual & proof registry!A25:G25`),
  placeholder("CASE-SC-02", "Centre circulation proof", "shopping-centre", ["shopping-centre-entrances", "shopping-centre-visitor-composition", "shopping-centre-time-in-centre", "shopping-centre-internal-circulation", "shopping-centre-zone-anchor-exposure"], ["TECH-02", "TECH-03", "TECH-04", "TECH-05"], `${matrix}: Visual & proof registry!A26:G26`),
  placeholder("CASE-SC-03", "Brand flow proof", "shopping-centre", ["shopping-centre-brand-counting", "shopping-centre-brand-flow"], ["TECH-02", "TECH-04", "TECH-05"], `${matrix}: Visual & proof registry!A27:G27`),
  placeholder("CASE-SC-04", "Arrival & parking proof", "shopping-centre", ["shopping-centre-parking-arrival", "shopping-centre-parking-occupancy"], ["TECH-02", "TECH-06"], `${matrix}: Visual & proof registry!A28:G28`),
  placeholder("CASE-RP-01", "Catchment & competition proof", "retail-park", ["retail-park-catchment-area", "retail-park-competitive-visitation-white-spots", "retail-park-vehicle-origin"], ["TECH-06", "TECH-07"], `${matrix}: Visual & proof registry!A29:G29`),
  placeholder("CASE-RP-02", "Arrival & parking proof", "retail-park", ["retail-park-vehicle-arrival", "retail-park-parking-occupancy", "retail-park-unit-visits"], ["TECH-02", "TECH-04", "TECH-06"], `${matrix}: Visual & proof registry!A30:G30`),
  placeholder("CASE-RP-03", "Cross-visitation proof", "retail-park", ["retail-park-visitor-composition", "retail-park-cross-visitation", "retail-park-time-on-site", "retail-park-unit-category-exposure"], ["TECH-02", "TECH-03", "TECH-04", "TECH-05", "TECH-06"], `${matrix}: Visual & proof registry!A31:G31`),
  placeholder("CASE-OUT-01", "Destination reach proof", "outlet-centre", ["outlet-centre-destination-catchment", "outlet-centre-tourism-origin-context", "outlet-centre-competitive-destinations-white-spots", "outlet-centre-vehicle-origin"], ["TECH-06", "TECH-07"], `${matrix}: Visual & proof registry!A32:G32`),
  placeholder("CASE-OUT-02", "Arrival & operations proof", "outlet-centre", ["outlet-centre-vehicle-coach-arrival", "outlet-centre-entrances", "outlet-centre-parking-occupancy"], ["TECH-02", "TECH-06"], `${matrix}: Visual & proof registry!A33:G33`),
  placeholder("CASE-OUT-03", "Circulation & brand flow proof", "outlet-centre", ["outlet-centre-visitor-composition", "outlet-centre-time-in-destination", "outlet-centre-circulation", "outlet-centre-zone-exposure-dwell", "outlet-centre-brand-counting", "outlet-centre-brand-flow"], ["TECH-02", "TECH-03", "TECH-04", "TECH-05"], `${matrix}: Visual & proof registry!A34:G34`),

  // QSR / Drive-Thru proof placeholders.
  //
  // Contextual placeholders only: no customer names, no logos, no case
  // content, no external approval and nothing playable. They exist so scenes
  // can declare where proof would belong once an approved source exists.
  // [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §20 Proof layer]
  placeholder("proof-qsr-queue-performance", "Queue performance proof", "qsr", ["qsr-queue"], ["TECH-QSR-01", "TECH-QSR-02"], `${qsrSpec}: §20 Proof layer`),
  placeholder("proof-qsr-communication", "Order-point communication proof", "qsr", ["qsr-order"], ["TECH-QSR-03"], `${qsrSpec}: §20 Proof layer`),
  placeholder("proof-qsr-bottleneck", "Bottleneck diagnosis proof", "qsr", ["qsr-bottleneck"], ["TECH-QSR-02"], `${qsrSpec}: §20 Proof layer`),
  placeholder("proof-qsr-closed-loop-response", "Closed-loop response proof", "qsr", ["qsr-respond"], ["TECH-QSR-06"], `${qsrSpec}: §20 Proof layer`),
  placeholder("proof-qsr-estate-performance", "Estate performance proof", "qsr", ["qsr-estate"], ["TECH-QSR-07"], `${qsrSpec}: §20 Proof layer`),
  placeholder("proof-qsr-improvement", "Operational improvement proof", "qsr", ["qsr-improvement-proof"], ["TECH-QSR-07"], `${qsrSpec}: §20 Proof layer`),
];
