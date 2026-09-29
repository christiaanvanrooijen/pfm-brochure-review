import type {
  AssetStatus,
  SceneId,
  SegmentId,
  TechnologyCapabilityId,
  VisualAssetDefinition,
  VisualAssetId,
} from "./types.ts";

const matrix = "PFM_Segment_Insight_Matrix_v1_1.xlsx";
const qsrSpec = "docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md";

/**
 * Shared visual direction notes for every planned QSR asset.
 *
 * Direction only. No composition, layout, imagery or file path is implemented
 * here, and no QSR asset exists yet.
 * [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §13 Visual DNA, §29]
 */
const qsrVisualDirection: readonly string[] = [
  "Photoreal physical QSR location; the drive-thru is the hero, not a dashboard",
  "The vehicle journey must be understandable spatially",
  "Restrained PFM purple for movement, detection and connected flow",
  "PFM red reserved for exception, delay, bottleneck or missed goal",
  "No HME hardware hero shot and no device close-ups",
  "No dashboard or BI aesthetic",
  "Fictional neutral QSR brand only; no recognisable customer brand marks",
];

const visual = (
  id: VisualAssetId,
  segment: SegmentId,
  sceneIds: readonly SceneId[],
  capabilityIds: readonly TechnologyCapabilityId[],
  status: AssetStatus,
  sourceRef: string,
): VisualAssetDefinition => ({
  id,
  segment,
  sceneIds,
  capabilityIds,
  status,
  assetPath: null,
  altText: null,
  illustrative: true,
  sourceRef,
});

const qsrVisual = (
  id: VisualAssetId,
  sceneIds: readonly SceneId[],
  capabilityIds: readonly TechnologyCapabilityId[],
  section: string,
  /**
   * `approved` once the segment's own artwork exists AND has been opened and
   * checked against the direction notes below and against the scene's typed
   * evidence. `placeholder` while no artwork exists.
   *
   * `assetPath` stays null either way: this registry records approval and scene
   * coverage, never file paths (AGENTS.md, "Scene hero asset selection").
   */
  status: AssetStatus = "placeholder",
): VisualAssetDefinition => ({
  ...visual(id, "qsr", sceneIds, capabilityIds, status, `${qsrSpec}: ${section}`),
  visualDirectionNotes: qsrVisualDirection,
});

export const visualAssets: readonly VisualAssetDefinition[] = [
  visual("VIS-RET-01", "retail", ["retail-street-opportunity"], ["TECH-01", "TECH-02"], "reference", `${matrix}: Visual & proof registry!A5:G5`),
  visual("VIS-RET-02", "retail", ["retail-in-store-journey"], ["TECH-04"], "reference", `${matrix}: Visual & proof registry!A6:G6`),
  visual("VIS-RET-03", "retail", ["retail-visitor-composition"], ["TECH-03"], "reference", `${matrix}: Visual & proof registry!A7:G7`),
  visual("VIS-RET-04", "retail", ["retail-store-visits"], ["TECH-02"], "reference", `${matrix}: Visual & proof registry!A8:G8`),
  visual("VIS-RET-05", "retail", ["retail-zone-engagement"], ["TECH-04"], "reference", `${matrix}: Visual & proof registry!A9:G9`),
  visual("VIS-RET-06", "retail", ["retail-visit-duration"], ["TECH-04", "TECH-05"], "placeholder", `${matrix}: PFM Matrix!A8:M8`),
  visual("VIS-RET-07", "retail", ["retail-product-category-journey"], ["TECH-04", "TECH-08"], "placeholder", `${matrix}: PFM Matrix!A10:M10`),
  visual("VIS-RET-08", "retail", ["retail-staff-interaction"], ["TECH-04", "TECH-08"], "placeholder", `${matrix}: PFM Matrix!A12:M12`),
  visual("VIS-RET-09", "retail", ["retail-conversion-sales-context"], ["TECH-02", "TECH-08"], "placeholder", `${matrix}: PFM Matrix!A13:M13`),
  visual("VIS-RET-10", "retail", ["retail-portfolio-comparison"], ["TECH-08"], "placeholder", `${matrix}: PFM Matrix!A14:M14`),

  // Human-approved 2026-08-19: the Centre entrances scene renders
  // location-visuals/shopping-centre/shopping-centre-visitors-hero.png. The path
  // itself stays out of this registry — see AGENTS.md, "Scene hero asset
  // selection" — so this records the approval, not the file.
  visual("VIS-SC-01", "shopping-centre", ["shopping-centre-entrances"], ["TECH-02"], "approved", `${matrix}: Visual & proof registry!A10:G10`),
  visual("VIS-SC-02", "shopping-centre", ["shopping-centre-time-in-centre", "shopping-centre-internal-circulation", "shopping-centre-zone-anchor-exposure"], ["TECH-04", "TECH-05"], "approval_required", `${matrix}: Visual & proof registry!A11:G11`),
  visual("VIS-SC-03", "shopping-centre", ["shopping-centre-competitive-visitation-white-spots"], ["TECH-07"], "approval_required", `${matrix}: Visual & proof registry!A12:G12`),
  visual("VIS-SC-04", "shopping-centre", ["shopping-centre-catchment-area"], ["TECH-07"], "approval_required", `${matrix}: Visual & proof registry!A13:G13`),
  // Human-approved 2026-08-19: the Visitor composition scene renders
  // location-visuals/shopping-centre/shopping-centre-visitor-composition-hero.png.
  // The path stays out of this registry — see AGENTS.md, "Scene hero asset
  // selection" — so this records the approval, not the file.
  visual("VIS-SC-05", "shopping-centre", ["shopping-centre-visitor-composition"], ["TECH-03"], "approved", `${matrix}: PFM Matrix!A18:M18`),
  visual("VIS-SC-06", "shopping-centre", ["shopping-centre-brand-counting"], ["TECH-02", "TECH-04"], "placeholder", `${matrix}: PFM Matrix!A22:M22`),
  visual("VIS-SC-07", "shopping-centre", ["shopping-centre-brand-flow"], ["TECH-04", "TECH-05"], "placeholder", `${matrix}: PFM Matrix!A23:M23`),
  visual("VIS-SC-08", "shopping-centre", ["shopping-centre-parking-arrival"], ["TECH-02", "TECH-06"], "placeholder", `${matrix}: PFM Matrix!A24:M24`),
  visual("VIS-SC-09", "shopping-centre", ["shopping-centre-parking-occupancy"], ["TECH-06"], "placeholder", `${matrix}: PFM Matrix!A25:M25`),
  visual("VIS-SC-10", "shopping-centre", ["shopping-centre-vehicle-origin"], ["TECH-06", "TECH-07"], "placeholder", `${matrix}: PFM Matrix!A26:M26`),

  visual("VIS-RP-01", "retail-park", ["retail-park-vehicle-arrival", "retail-park-parking-occupancy"], ["TECH-06"], "approval_required", `${matrix}: Visual & proof registry!A14:G14`),
  visual("VIS-RP-02", "retail-park", ["retail-park-unit-visits", "retail-park-cross-visitation"], ["TECH-02", "TECH-05"], "approval_required", `${matrix}: Visual & proof registry!A15:G15`),
  visual("VIS-RP-03", "retail-park", ["retail-park-competitive-visitation-white-spots"], ["TECH-07"], "approval_required", `${matrix}: Visual & proof registry!A16:G16`),
  visual("VIS-RP-04", "retail-park", ["retail-park-catchment-area", "retail-park-vehicle-origin"], ["TECH-06", "TECH-07"], "approval_required", `${matrix}: Visual & proof registry!A17:G17`),
  visual("VIS-RP-05", "retail-park", ["retail-park-visitor-composition"], ["TECH-03"], "placeholder", `${matrix}: PFM Matrix!A32:M32`),
  visual("VIS-RP-06", "retail-park", ["retail-park-time-on-site"], ["TECH-05", "TECH-06"], "placeholder", `${matrix}: PFM Matrix!A34:M34`),
  visual("VIS-RP-07", "retail-park", ["retail-park-unit-category-exposure"], ["TECH-02"], "placeholder", `${matrix}: PFM Matrix!A35:M35`),

  visual("VIS-OUT-01", "outlet-centre", ["outlet-centre-vehicle-coach-arrival", "outlet-centre-entrances", "outlet-centre-parking-occupancy"], ["TECH-02", "TECH-06"], "approval_required", `${matrix}: Visual & proof registry!A18:G18`),
  visual("VIS-OUT-02", "outlet-centre", ["outlet-centre-time-in-destination", "outlet-centre-circulation", "outlet-centre-zone-exposure-dwell", "outlet-centre-brand-flow"], ["TECH-04", "TECH-05"], "approval_required", `${matrix}: Visual & proof registry!A19:G19`),
  visual("VIS-OUT-03", "outlet-centre", ["outlet-centre-competitive-destinations-white-spots"], ["TECH-07"], "approval_required", `${matrix}: Visual & proof registry!A20:G20`),
  visual("VIS-OUT-04", "outlet-centre", ["outlet-centre-destination-catchment", "outlet-centre-tourism-origin-context", "outlet-centre-vehicle-origin"], ["TECH-06", "TECH-07"], "approval_required", `${matrix}: Visual & proof registry!A21:G21`),
  visual("VIS-OUT-05", "outlet-centre", ["outlet-centre-visitor-composition"], ["TECH-03"], "placeholder", `${matrix}: PFM Matrix!A42:M42`),
  visual("VIS-OUT-06", "outlet-centre", ["outlet-centre-brand-counting"], ["TECH-02", "TECH-04"], "placeholder", `${matrix}: PFM Matrix!A46:M46`),
  visual("VIS-OUT-07", "outlet-centre", ["outlet-centre-brand-flow"], ["TECH-04", "TECH-05"], "placeholder", `${matrix}: PFM Matrix!A47:M47`),

  // QSR / Drive-Thru visuals.
  //
  // Every one of these twelve now has segment-specific artwork in
  // public/assets/location-visuals/qsr/, and every one was opened and checked
  // before its status was raised: against the direction notes above, and
  // against what its scene's typed evidence actually claims. The bottleneck
  // artwork carries PFM red only at the pinch point; the improvement-proof
  // artwork carries a before/after divider and no figures, which is what that
  // scene's typed comparison is. None of them shows an HME product hero, a
  // dashboard, or a readable brand fascia.
  //
  // They were placeholders long after the files landed. That is the failure
  // this block exists to prevent: `qsr-registry.test.mjs` now fails if a scene
  // has artwork on disk and a placeholder status, so the two cannot drift
  // apart silently again.
  qsrVisual("VIS-QSR-CONTEXT-DRIVE-THRU", ["qsr-drive-thru-context"], ["TECH-QSR-01", "TECH-QSR-02"], "§6 Scene 0", "approved"),
  qsrVisual("VIS-QSR-ARRIVAL", ["qsr-arrival"], ["TECH-QSR-01"], "§7 Scene 1", "approved"),
  qsrVisual("VIS-QSR-QUEUE", ["qsr-queue"], ["TECH-QSR-01", "TECH-QSR-02"], "§7 Scene 2", "approved"),
  qsrVisual("VIS-QSR-ORDER", ["qsr-order"], ["TECH-QSR-03", "TECH-QSR-04"], "§7 Scene 3", "approved"),
  qsrVisual("VIS-QSR-PAYMENT", ["qsr-payment"], ["TECH-QSR-05"], "§7 Scene 4", "approved"),
  qsrVisual("VIS-QSR-HANDOFF", ["qsr-handoff"], ["TECH-QSR-02"], "§7 Scene 5", "approved"),
  qsrVisual("VIS-QSR-BEYOND-LANE", ["qsr-beyond-lane"], ["TECH-QSR-01", "TECH-QSR-02"], "§7 Scene 6", "approved"),
  qsrVisual("VIS-QSR-BOTTLENECK", ["qsr-bottleneck"], ["TECH-QSR-02"], "§8 Scene 7", "approved"),
  qsrVisual("VIS-QSR-RESPOND", ["qsr-respond"], ["TECH-QSR-06", "TECH-QSR-03"], "§8 Scene 8", "approved"),
  qsrVisual("VIS-QSR-DAYPART", ["qsr-daypart"], ["TECH-QSR-07"], "§8 Scene 9", "approved"),
  qsrVisual("VIS-QSR-ESTATE", ["qsr-estate"], ["TECH-QSR-07"], "§9 Scene 10", "approved"),
  qsrVisual("VIS-QSR-IMPROVEMENT-PROOF", ["qsr-improvement-proof"], ["TECH-QSR-07"], "§9 Scene 11", "approved"),
];
