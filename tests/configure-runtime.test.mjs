import assert from "node:assert/strict";
import test from "node:test";

import { contentBundle, retailSegment, validateContentBundle } from "../app/content/index.ts";
import { evidenceInputs } from "../app/content/evidence-inputs.ts";
import { allScenes } from "../app/content/segments/index.ts";
import {
  getImplementation,
  getTechnologyCapability,
} from "../app/content/technology-runtime.ts";
import * as solutionRuntime from "../app/content/solution-runtime.ts";
import {
  configurePrivacyStatement,
  getAllCapabilityExplainerVisuals,
  getConfigureSynthesis,
  getSolutionDirection,
  getSolutionDirectionsForSegment,
  getSolutionImplementationOptions,
  getSolutionPrivacyDetail,
  getSolutionProof,
  getSolutionRequirements,
  getSolutionTechnologyDrilldown,
  implementationsAreRanked,
  validateSolutionDirections,
} from "../app/content/solution-runtime.ts";
import {
  configureViewReducer,
  initialConfigureViewState,
  resolveVisibleDepth,
} from "../app/lib/configure-view.ts";

const directions = getSolutionDirectionsForSegment("retail");

const byId = Object.fromEntries(directions.map((d) => [d.id, d]));

/** Every leaf value reachable from a runtime result. */
function leaves(value, out = []) {
  if (value === null || value === undefined) return out;
  if (Array.isArray(value)) {
    for (const item of value) leaves(item, out);
    return out;
  }
  if (typeof value === "object") {
    for (const item of Object.values(value)) leaves(item, out);
    return out;
  }
  out.push(value);
  return out;
}

/* ------------------------------------------------------------------ 1 */
test("Configure remains a synthesis stage, not a fabricated matrix scene", () => {
  // The architectural invariant the whole stage rests on: Configure holds no
  // scenes, and the content validator's `synthesis_as_scene` rule still passes.
  assert.deepEqual(retailSegment.stageMapping.configure, []);
  assert.deepEqual(retailSegment.stageMapping.act, []);
  assert.deepEqual(validateContentBundle(contentBundle), []);

  const synthesis = getConfigureSynthesis("retail");
  assert.equal(synthesis.journeyStage, "configure");
  assert.equal(synthesis.recommendationMode, "none");
  assert.ok(synthesis.governingQuestion.length > 0);

  // A solution direction is not a scene and can never be routed to as one.
  const sceneIds = new Set(allScenes.map((scene) => scene.id));
  for (const direction of directions) {
    assert.equal(sceneIds.has(direction.id), false, `${direction.id} must not be a scene id`);
  }

  assert.deepEqual(validateSolutionDirections(), []);
});

/* ------------------------------------------------------------------ 2 */
test("four Retail solution directions resolve, anchored to the four journey territories", () => {
  assert.equal(directions.length, 4);
  assert.deepEqual(
    directions.map((direction) => direction.id),
    [
      "solution-location-opportunity",
      "solution-capture-and-visits",
      "solution-in-store-intelligence",
      "solution-performance-intelligence",
    ],
  );
  assert.deepEqual(
    directions.map((direction) => direction.territory),
    ["outside", "entrance", "inside", "performance"],
  );

  for (const direction of directions) {
    assert.equal(getSolutionDirection(direction.id).id, direction.id);
    assert.ok(direction.customerQuestion.trim().endsWith("?"), `${direction.id} asks a question`);
    assert.ok(direction.capabilityPhrases.length >= 2 && direction.capabilityPhrases.length <= 3);
    assert.ok(direction.relatedSceneIds.length > 0);
    assert.ok(direction.technologyCapabilityIds.length > 0);
  }
});

/* ------------------------------------------------------------------ 3 */
test("solution directions are customer problems, never vendor products", () => {
  // Whole-word matching: "hme" as a bare substring also lives inside
  // "catchment", which is legitimate customer language.
  const productTokens = [
    /\bxovis\b/i,
    /\bmilesight\b/i,
    /\bisarsoft\b/i,
    /\blidar\b/i,
    /\bvs-?361\b/i,
    /\bvs-?125/i,
    /\bzoom nitro\b/i,
    /\bnexeo\b/i,
    /\bhme\b/i,
    /\bsensor\b/i,
    /\bcamera\b/i,
  ];

  for (const direction of directions) {
    const customerFacing = [
      direction.id,
      direction.title,
      direction.customerQuestion,
      direction.lead,
      direction.territoryLabel,
      ...direction.capabilityPhrases,
    ]
      .join(" ");

    for (const token of productTokens) {
      assert.equal(
        token.test(customerFacing),
        false,
        `${direction.id} customer-facing copy must not name ${token}`,
      );
    }
    // Nor may a direction ever carry an implementation reference directly.
    assert.equal("technologyImplementationIds" in direction, false);
    assert.equal("implementationIds" in direction, false);
  }
});

/* ------------------------------------------------------------------ 4 */
test("technology drilldown stays capability-first: capability before implementation", () => {
  for (const direction of directions) {
    const drilldown = getSolutionTechnologyDrilldown(direction.id);

    // Level 1 is the customer's question, not a capability and not a product.
    assert.equal(drilldown.customerQuestion, direction.customerQuestion);
    // No implementation is reachable at the top level of the drilldown.
    assert.equal("implementations" in drilldown, false);

    for (const entry of drilldown.capabilities) {
      const keys = Object.keys(entry);
      assert.ok(
        keys.indexOf("capability") < keys.indexOf("implementations"),
        "capability must precede implementations in the exposed shape",
      );
      assert.ok(entry.name.length > 0);
      assert.ok(entry.purpose.length > 0);
      assert.ok(entry.privacyPrinciple.length > 0);
      // Implementations only exist nested inside a capability.
      for (const impl of entry.implementations) {
        assert.ok(
          getImplementation(impl.id).capabilityIds.includes(entry.capabilityId),
          `${impl.id} must belong to ${entry.capabilityId}`,
        );
      }
    }
  }
});

/* ------------------------------------------------------------------ 5 */
test("the passer-by solution resolves VS361 as an implementation, never as a capability", () => {
  const drilldown = getSolutionTechnologyDrilldown("solution-location-opportunity");
  const passerBy = drilldown.capabilities.find((entry) => entry.capabilityId === "TECH-01");

  // TECH-01 is the capability, and it is vendor-neutral.
  assert.equal(passerBy.name, "Outdoor opportunity measurement");
  assert.equal(passerBy.name.toLowerCase().includes("vs361"), false);
  assert.equal(passerBy.name.toLowerCase().includes("milesight"), false);

  // VS361 exists exactly one level down, as one implementation option.
  const vs361 = passerBy.implementations.find(
    (impl) => impl.id === "impl-milesight-vs361-passerby",
  );
  assert.ok(vs361, "VS361 must resolve as an implementation of TECH-01");
  assert.equal(vs361.product, "VS361");
  assert.equal(vs361.supplier, "Milesight");
  assert.equal(vs361.measurementMethod, "diffuse-reflective infrared beam (940 nm)");

  // And it is not a capability anywhere in the model.
  for (const capability of contentBundle.technologyCapabilities) {
    assert.equal(capability.name.toLowerCase().includes("vs361"), false);
  }
  // Entrance measurement (TECH-02) is a different capability, not the same one.
  assert.notEqual(getTechnologyCapability("TECH-01").id, getTechnologyCapability("TECH-02").id);
});

/* ------------------------------------------------------------------ 6 */
test("the entrance solution exposes several implementation options without ranking them", () => {
  const drilldown = getSolutionTechnologyDrilldown("solution-capture-and-visits");
  const entrance = drilldown.capabilities.find((entry) => entry.capabilityId === "TECH-02");

  assert.deepEqual(
    entrance.implementations.map((impl) => impl.id),
    [
      "impl-xovis-3d-entrance",
      "impl-milesight-vs125p-entrance",
      "impl-isarsoft-camera-analytics",
    ],
  );

  // The runtime states outright that order is not a ranking.
  assert.equal(implementationsAreRanked, false);
  assert.equal(drilldown.ranked, false);

  // And carries no field that could express one.
  const rankingFields = [
    "rank",
    "ranking",
    "order",
    "score",
    "weight",
    "priority",
    "recommended",
    "preferred",
    "default",
    "best",
    "isDefault",
    "selected",
  ];
  for (const impl of entrance.implementations) {
    for (const field of rankingFields) {
      assert.equal(field in impl, false, `implementation must not carry "${field}"`);
    }
  }
  for (const field of rankingFields) {
    assert.equal(field in entrance, false, `capability must not carry "${field}"`);
  }
});

/* ------------------------------------------------------------------ 7 */
test("the in-store solution exposes Xovis 3D and LiDAR without implying they are equivalent", () => {
  const drilldown = getSolutionTechnologyDrilldown("solution-in-store-intelligence");
  const spatial = drilldown.capabilities.find((entry) => entry.capabilityId === "TECH-04");

  const ids = spatial.implementations.map((impl) => impl.id);
  assert.ok(ids.includes("impl-lidar-spatial"));
  assert.ok(ids.includes("impl-xovis-3d-spatial"));

  const lidar = spatial.implementations.find((impl) => impl.id === "impl-lidar-spatial");
  const xovis = spatial.implementations.find((impl) => impl.id === "impl-xovis-3d-spatial");

  // Each explicitly blocks equivalence with the other, and the runtime surfaces
  // those blocked claims rather than smoothing them away.
  assert.ok(lidar.blockedClaims.some((claim) => /equivalence with 3D stereo vision/i.test(claim)));
  assert.ok(xovis.blockedClaims.some((claim) => /equivalence with LiDAR/i.test(claim)));

  // Neither claims to produce the same output as the other.
  for (const impl of [lidar, xovis]) {
    for (const claim of impl.supportedClaims) {
      assert.equal(/equivalent/i.test(claim), false);
    }
  }
  // Their supported claims are their own, not a shared array.
  assert.notEqual(lidar.supportedClaims, xovis.supportedClaims);
  assert.notDeepEqual(lidar.supportedClaims, xovis.supportedClaims);
});

/* ------------------------------------------------------------------ 8 */
test("business data stays connected context and is never reclassified as measurement", () => {
  const businessInputs = ["transactions", "sales_value", "portfolio_context", "zone_mapping"];
  for (const id of businessInputs) {
    const input = evidenceInputs.find((item) => item.id === id);
    assert.equal(input.dataRole, "business");
    assert.equal(input.evidenceType, "connected");
  }

  // TECH-08 yields connected and derived evidence — never "measured".
  const capability = getTechnologyCapability("TECH-08");
  assert.deepEqual([...capability.evidenceTypes], ["connected", "derived"]);
  assert.equal(capability.evidenceTypes.includes("measured"), false);

  // And the Performance direction presents it with its business role intact.
  const requirements = getSolutionRequirements("solution-performance-intelligence");
  const salesValue = [...requirements.primary, ...requirements.additional].find(
    (item) => item.inputId === "sales_value",
  );
  assert.equal(salesValue.dataRole, "business");

  const business = getSolutionTechnologyDrilldown("solution-performance-intelligence").capabilities.find(
    (entry) => entry.capabilityId === "TECH-08",
  );
  assert.ok(
    business.implementations.some((impl) => impl.id === "impl-business-data-connection"),
  );
  // PFM does not measure turnover, and the direction says so on its face.
  assert.match(
    byId["solution-performance-intelligence"].boundaryNote,
    /does not measure them/i,
  );
});

/* ------------------------------------------------------------------ 9 */
test("geo and mobility stay contextual and never replace physical measurement", () => {
  const geo = evidenceInputs.find((item) => item.id === "aggregate_mobility");
  assert.equal(geo.dataRole, "mobile_geo");
  assert.equal(geo.evidenceType, "connected");

  const geoImpl = getImplementation("impl-aggregate-geo-mobility");
  assert.ok(
    geoImpl.unsupportedClaims.some((claim) =>
      /substitution for physical measurement/i.test(claim),
    ),
  );
  assert.match(
    getTechnologyCapability("TECH-07").privacyPrinciple,
    /cannot replace direct entrance measurement/i,
  );

  // No direction's requirements substitute an aggregate mobility input for the
  // physical passer-by or visit measurement.
  for (const direction of directions) {
    const requirements = getSolutionRequirements(direction.id);
    const items = [...requirements.primary, ...requirements.additional];
    const inputIds = items.map((item) => item.inputId);
    assert.equal(
      inputIds.includes("aggregate_mobility"),
      false,
      `${direction.id} must not require aggregate mobility in place of measurement`,
    );
    for (const id of ["aligned_passer_by_audience", "store_visits"]) {
      if (!inputIds.includes(id)) continue;
      assert.equal(items.find((item) => item.inputId === id).dataRole, "physical");
    }
  }

  // The Location direction names both sources and states they are different.
  const location = byId["solution-location-opportunity"];
  assert.deepEqual([...location.technologyCapabilityIds], ["TECH-01", "TECH-07"]);
  assert.match(location.boundaryNote, /never replaces it/i);
});

/* ----------------------------------------------------------------- 10 */
test("privacy status stays implementation-specific, never one value shared by all", () => {
  const privacy = getSolutionPrivacyDetail("solution-capture-and-visits");
  const statuses = Object.fromEntries(
    privacy.entries.map((entry) => [entry.implementationId, entry.privacyStatus]),
  );

  // Each of these carries its own status, straight from technology.ts.
  assert.equal(statuses["impl-xovis-3d-entrance"], "source_backed");
  assert.equal(statuses["impl-milesight-vs125p-entrance"], "partially_source_backed");
  assert.equal(statuses["impl-isarsoft-camera-analytics"], "partially_source_backed");
  assert.equal(statuses["impl-milesight-vs361-passerby"], "partially_source_backed");

  // Not a single shared value asserted for all.
  assert.ok(new Set(Object.values(statuses)).size > 1);

  const spatial = getSolutionPrivacyDetail("solution-in-store-intelligence");
  const spatialStatuses = Object.fromEntries(
    spatial.entries.map((entry) => [entry.implementationId, entry.privacyStatus]),
  );
  assert.equal(spatialStatuses["impl-lidar-spatial"], "requires_source_mapping");
  assert.equal(spatialStatuses["impl-xovis-3d-spatial"], "source_backed");

  // No blanket compliance claim anywhere in the standing privacy statement.
  const statementText = [
    configurePrivacyStatement.headline,
    configurePrivacyStatement.lead,
    ...configurePrivacyStatement.principles.flatMap((p) => [p.title, p.body]),
  ].join(" ");
  assert.equal(/gdpr/i.test(statementText), false);
  assert.equal(/no personal data is ever/i.test(statementText), false);
  assert.equal(/fully compliant|guarantee/i.test(statementText), false);
});

/* ----------------------------------------------------------------- 11 */
test("Xovis privacy evidence does not leak to Milesight, Isarsoft or LiDAR", () => {
  const privacy = getSolutionPrivacyDetail("solution-capture-and-visits");
  const entry = (id) => privacy.entries.find((item) => item.implementationId === id);

  const xovis = entry("impl-xovis-3d-entrance");
  assert.equal(xovis.hasPrivacyEvidence, true);
  assert.ok(xovis.supportedClaims.length > 0);
  assert.ok(
    xovis.supportedClaims.some((claim) => /3D stereo vision/i.test(claim)),
    "Xovis keeps its own source-backed claims",
  );

  // Isarsoft has its own vendor whitepaper, but never inherits Xovis claims.
  const isarsoft = entry("impl-isarsoft-camera-analytics");
  assert.equal(isarsoft.hasPrivacyEvidence, true);
  /* Attributed to the supplier rather than named (2026-09-28): a privacy
     claim must say whose claim it is, and the brochure names no vendor. The
     assertion is on the attribution, which is what protects a reader. */
  assert.ok(isarsoft.supportedClaims.some((claim) => /^The supplier states/.test(claim)));

  // The Milesight implementations now carry their own, weaker privacy
  // evidence. The point of this test is unchanged: their claims are their own,
  // and no Xovis sentence appears under either of them.
  const others = [
    entry("impl-milesight-vs125p-entrance"),
    entry("impl-isarsoft-camera-analytics"),
    entry("impl-milesight-vs361-passerby"),
  ];

  for (const other of others) {
    assert.notEqual(other.privacyStatus, xovis.privacyStatus);
    // No claim array is shared by reference or by content.
    assert.notEqual(other.supportedClaims, xovis.supportedClaims);
    // And no Xovis claim string is reused verbatim under another supplier.
    for (const claim of xovis.supportedClaims) {
      assert.equal(
        other.supportedClaims.includes(claim),
        false,
        `${other.implementationId} must not reuse a Xovis privacy claim`,
      );
    }
  }

  // The same holds across capabilities: LiDAR carries none of Xovis's evidence.
  const spatial = getSolutionPrivacyDetail("solution-in-store-intelligence");
  const lidar = spatial.entries.find((item) => item.implementationId === "impl-lidar-spatial");
  for (const claim of xovis.supportedClaims) {
    assert.equal(lidar.supportedClaims.includes(claim), false);
  }
});

/* ----------------------------------------------------------------- 12 */
test("missing privacy evidence stays visible rather than being silently hidden", () => {
  for (const direction of directions) {
    const privacy = getSolutionPrivacyDetail(direction.id);
    for (const entry of privacy.entries) {
      if (entry.hasPrivacyEvidence) {
        assert.equal(entry.unmappedNote, null);
        continue;
      }
      // Stated, in the runtime's own vocabulary, not replaced with marketing.
      assert.equal(entry.unmappedNote, solutionRuntime.PRIVACY_DETAIL_UNMAPPED);
      assert.deepEqual([...entry.supportedClaims], []);
      // The raw status remains available for Sales Mode.
      assert.ok(["requires_source_mapping", "requires_product_validation", "architecture_only"].includes(entry.privacyStatus));
    }
  }

  // Every direction that has an unmapped implementation reports it at the top.
  const capture = getSolutionPrivacyDetail("solution-capture-and-visits");
  assert.equal(capture.hasUnmappedPrivacyEvidence, true);
});

test("Presentation Mode never shows internal source-validation vocabulary", () => {
  // Internal validation terminology a prospect must never read.
  const internalVocabulary = /source validation|source[_ ]mapping|requires_|_status|architecture_only|impl-/i;

  for (const direction of directions) {
    const sales = getSolutionPrivacyDetail(direction.id, "sales");
    const presenting = getSolutionPrivacyDetail(direction.id, "presentation");

    for (const [index, entry] of presenting.entries.entries()) {
      const salesEntry = sales.entries[index];

      // The underlying status data is identical in both modes. Only the
      // customer-facing sentence differs.
      assert.equal(entry.implementationId, salesEntry.implementationId);
      assert.equal(entry.privacyStatus, salesEntry.privacyStatus);
      assert.equal(entry.hasPrivacyEvidence, salesEntry.hasPrivacyEvidence);
      assert.deepEqual([...entry.supportedClaims], [...salesEntry.supportedClaims]);

      if (entry.hasPrivacyEvidence) {
        assert.equal(entry.unmappedNote, null);
        continue;
      }

      assert.equal(
        salesEntry.unmappedNote,
        solutionRuntime.PRIVACY_DETAIL_UNMAPPED,
        "Sales Mode keeps the truthful internal readiness wording",
      );
      assert.equal(
        entry.unmappedNote,
        solutionRuntime.PRIVACY_DETAIL_UNMAPPED_PRESENTATION,
      );
      assert.equal(internalVocabulary.test(entry.unmappedNote), false);
      // Withheld evidence stays withheld: the softer wording does not release
      // claims that have not been mapped to a source.
      assert.deepEqual([...entry.supportedClaims], []);
    }
  }
});

test("the capability video hangs off the capability, not off a supplier", () => {
  const video = solutionRuntime.getCapabilityExplainerVideo("TECH-02");
  assert.ok(video, "Entrance measurement has a visual explanation");

  // Level 1 is the capability. The example implementation is subordinate to it.
  assert.equal(video.capabilityId, "TECH-02");
  assert.equal(video.capabilityName, getTechnologyCapability("TECH-02").name);

  // Every product string is read from the Technology Runtime, never authored
  // next to the video.
  const impl = getImplementation("impl-xovis-3d-entrance");
  assert.equal(video.exampleImplementationId, impl.id);
  assert.equal(video.exampleImplementationRole, impl.implementationRole);
  assert.equal(video.exampleSupplier, impl.supplier);
  // The supplier stays in the view model; what a reader sees is the functional
  // name (product lead, 2026-09-27).
  assert.equal(video.exampleImplementationName, "3D Sensor Basic FoV");

  // The browser is served the web-compatible derivative.
  assert.equal(video.src, "/assets/videos/3d-sensor-counting-xovis.mp4");
  assert.ok(video.description.trim().length > 0);
  assert.ok(video.sourceRefs.length > 0);

  // It is one video for one capability — not a library, and not attached to
  // every capability the entrance direction happens to touch.
  const drilldown = getSolutionTechnologyDrilldown("solution-capture-and-visits");
  const withVideo = drilldown.capabilities.filter((entry) =>
    solutionRuntime.getCapabilityExplainerVideo(entry.capabilityId),
  );
  assert.equal(withVideo.length, 1);
  assert.equal(withVideo[0].capabilityId, "TECH-02");
  assert.equal(solutionRuntime.getCapabilityExplainerVideo("TECH-01"), null);
});

/* ------------------------------------------------------------------
   LIDAR EXPLAINER VIDEO LAYERS
   Two clips under one capability, and the whole point of the shape is
   that they are NOT two clips under one capability: the second is
   reachable only through the first, and the two say different things.
   ------------------------------------------------------------------ */

test("the tracking view is nested behind the in-store LiDAR video, never beside it", () => {
  const video = solutionRuntime.getCapabilityExplainerVideo("TECH-04");
  assert.ok(video, "spatial movement intelligence has a visual explanation");
  assert.equal(video.capabilityId, "TECH-04");
  assert.equal(video.src, "/assets/videos/lidar-in-a-store-pfm.mp4");

  // The second clip exists ONLY as this one's follow-on. If it were ever
  // promoted to its own entry, this capability would hold two videos and the
  // flat-gallery shape the model exists to forbid would be back.
  assert.ok(video.followOn, "the derived view hangs off the primary video");
  assert.equal(video.followOn.src, "/assets/videos/lidar-tracking-reporting-visual.mp4");

  const forCapability = solutionRuntime.capabilityExplainerVideos.filter(
    (entry) => entry.capabilityId === "TECH-04",
  );
  assert.equal(forCapability.length, 1, "one primary video, not two peers");

  // No top-level entry anywhere serves the derived clip.
  for (const entry of solutionRuntime.capabilityExplainerVideos) {
    assert.notEqual(entry.src, "/assets/videos/lidar-tracking-reporting-visual.mp4");
  }

  // And there is no way to resolve the derived view without the measured one:
  // the runtime exposes no getter for it.
  assert.equal(
    typeof solutionRuntime.getCapabilityExplainerFollowOnVideo,
    "undefined",
  );

  // Inside still resolves exactly one capability with footage, so the depth
  // layer is one explanation with two steps, not a media list.
  const inside = getSolutionTechnologyDrilldown("solution-in-store-intelligence");
  const withVideo = inside.capabilities.filter((entry) =>
    solutionRuntime.getCapabilityExplainerVideo(entry.capabilityId),
  );
  assert.equal(withVideo.length, 1);
  assert.equal(withVideo[0].capabilityId, "TECH-04");

  // A follow-on is a distinct type with no capability, approach or example
  // implementation of its own, so it cannot be lifted to a peer by accident.
  for (const field of ["capabilityId", "approachId", "exampleImplementationId", "followOn"]) {
    assert.ok(
      !(field in video.followOn),
      `a follow-on must not carry ${field}, or it is a peer in disguise`,
    );
  }
});

test("the measured view and the derived view stay labelled as different things", () => {
  const video = solutionRuntime.getCapabilityExplainerVideo("TECH-04");

  assert.equal(video.viewKind, "measured_environment");
  assert.equal(video.viewLabel, "Measured physical environment");
  assert.equal(video.followOn.viewKind, "derived_representation");
  assert.equal(video.followOn.viewLabel, "Derived representation");
  assert.notEqual(video.viewLabel, video.followOn.viewLabel);

  // The sentence that stops a reporting view being read as the measurement.
  assert.match(video.followOn.distinctionNote, /not the measurement itself/i);

  // Every primary video is a measured view; nothing else may claim to be one.
  for (const entry of solutionRuntime.capabilityExplainerVideos) {
    assert.equal(entry.viewKind, "measured_environment");
    if (entry.followOn) assert.equal(entry.followOn.viewKind, "derived_representation");
  }

  // The footage is tied to the LiDAR approach, not to the capability as a
  // whole — TECH-04 has two approaches, and a clip floating between them would
  // read as an illustration of both.
  const approaches = getAllCapabilityExplainerVisuals("TECH-04");
  assert.equal(approaches.length, 2);
  assert.equal(video.approachId, "lidar-point-cloud");
  assert.equal(
    video.approachName,
    approaches.find((visual) => visual.approachId === "lidar-point-cloud").approachName,
  );

  // Hardware stays out of the explainer layer. No implementation is documented
  // for this footage, so none is named — rather than one being guessed at.
  assert.equal(video.exampleImplementationId, null);
  assert.equal(video.exampleImplementationRole, null);
  assert.equal(video.exampleSupplier, null);
  assert.equal(video.exampleImplementationName, null);
});

test("no explainer video changes a capability, privacy or source truth", () => {
  // RoboSense Airy is the implementation nearest this footage, and the one a
  // video could most easily be read as evidence about. Its evidence record must
  // be exactly what it was before any video existed.
  const airy = getImplementation("impl-lidar-spatial");
  assert.deepEqual([...airy.capabilityIds], ["TECH-04"]);
  assert.equal(airy.sourceStatus, "partially_source_backed");
  assert.equal(airy.privacyStatus, "requires_source_mapping");
  assert.equal(airy.technicalDetailStatus, "source_backed");
  assert.match(
    airy.unsupportedClaims.join(" "),
    /no data-protection source is mapped/i,
  );

  // A video is never proof, and never appears in a proof result.
  const video = solutionRuntime.getCapabilityExplainerVideo("TECH-04");
  for (const direction of directions) {
    for (const value of leaves(getSolutionProof(direction.id, "sales"))) {
      assert.notEqual(value, video.src);
      assert.notEqual(value, video.followOn.src);
    }
  }

  // Nor does it appear as an implementation image, or as an explainer still.
  const options = getSolutionImplementationOptions("solution-in-store-intelligence", "sales");
  for (const value of leaves(options)) {
    assert.notEqual(value, video.src);
    assert.notEqual(value, video.followOn.src);
  }
});

test("Presentation Mode reads no internal state anywhere in the LiDAR video flow", () => {
  // Same vocabulary rule the rest of Configure is held to. Applied to every
  // string a prospect can read beside either video — which is everything the
  // view returns except the media path itself and the presenter-only source
  // references, neither of which the component ever renders as text.
  const internalVocabulary =
    /source validation|source[_ ]mapping|requires_|_status|architecture_only|impl-|readiness|SRC-[A-Z]|\.mp4|\.mov|SOURCE-REGISTRY/i;

  for (const capability of contentBundle.technologyCapabilities) {
    const video = solutionRuntime.getCapabilityExplainerVideo(capability.id);
    if (!video) continue;

    // Named field by field rather than swept, so this stays a statement about
    // what the component actually renders as text. Machine identifiers
    // (`approachId`, `exampleImplementationId`, `viewKind`) and the media path
    // are carried by the view but never printed; the source references are
    // presenter-only. Adding a new customer-facing string means adding it here.
    const readable = (view, fields) =>
      fields.map((field) => view[field]).filter((value) => typeof value === "string");

    for (const value of readable(video, [
      "capabilityName",
      "approachName",
      "actionLabel",
      "intro",
      "description",
      "viewLabel",
      "exampleImplementationRole",
      "exampleImplementationName",
    ])) {
      assert.equal(
        internalVocabulary.test(value),
        false,
        `internal vocabulary reaches a prospect: ${value}`,
      );
    }
    if (video.followOn) {
      for (const value of readable(video.followOn, [
        "actionLabel",
        "intro",
        "description",
        "viewLabel",
        "distinctionNote",
      ])) {
        assert.equal(
          internalVocabulary.test(value),
          false,
          `internal vocabulary reaches a prospect: ${value}`,
        );
      }
    }

    // The presenter-only reference is carried, so Sales Mode can still show
    // where the footage is accounted for — it simply is not customer copy.
    assert.ok(video.sourceRefs.length > 0);
    if (video.followOn) assert.ok(video.followOn.sourceRefs.length > 0);
  }
});

test("the capability video makes no accuracy, compliance or proof claim", () => {
  const banned = /accura|guarantee|compliant|compliance|gdpr|certif|proven|proof|best|recommend|%|percent/i;
  for (const capability of contentBundle.technologyCapabilities) {
    const video = solutionRuntime.getCapabilityExplainerVideo(capability.id);
    if (!video) continue;

    for (const value of leaves(video)) {
      if (typeof value !== "string") continue;
      assert.equal(banned.test(value), false, `video copy claims too much: ${value}`);
    }

    // A video is never proof: it does not appear in any proof result.
    for (const direction of directions) {
      const proof = getSolutionProof(direction.id, "sales");
      for (const value of leaves(proof)) {
        assert.notEqual(value, video.src);
      }
    }
  }
});

/* ----------------------------------------------------------------- 13 */
/* Two published cases are approved (product lead, 2026-09-28). Each reaches
   only the directions whose scenes it evidences. */
const expectedProof = new Map([
  ["solution-location-opportunity", []],
  ["solution-capture-and-visits", ["CASE-RET-01"]],
  ["solution-in-store-intelligence", ["CASE-RET-02"]],
  ["solution-performance-intelligence", ["CASE-RET-01"]],
]);

test("unapproved proof is never prospect-playable", () => {
  for (const direction of directions) {
    const prospect = getSolutionProof(direction.id, "presentation");
    assert.deepEqual(prospect.usable.map((asset) => asset.id), expectedProof.get(direction.id));
    for (const asset of prospect.usable) {
      assert.equal(asset.playable, true);
      assert.equal(asset.externalUseApproved, true);
      assert.equal(asset.status, "available");
    }
    // Every internal slot is either an approved case or a placeholder that is
    // not offered outward.
    const sales = getSolutionProof(direction.id, "sales");
    assert.ok(sales.internal.length > 0, `${direction.id} has internal proof slots`);
    for (const asset of sales.internal) {
      if (asset.externalUseApproved) {
        assert.ok(prospect.usable.some((usable) => usable.id === asset.id));
      } else {
        assert.equal(asset.playable, false);
        assert.equal(asset.status, "placeholder");
      }
    }
  }
});

/* ----------------------------------------------------------------- 14 */
test("Presentation Mode hides unusable proof actions; Sales Mode keeps the truth", () => {
  for (const direction of directions) {
    const hasProof = expectedProof.get(direction.id).length > 0;
    const prospect = getSolutionProof(direction.id, "presentation");
    // A prospect is invited to click only where approved proof exists.
    assert.equal(prospect.actionAvailable, hasProof);
    assert.equal(prospect.internalStatusNote, null);
    assert.deepEqual([...prospect.internal], []);

    const sales = getSolutionProof(direction.id, "sales");
    assert.equal(sales.actionAvailable, true);
    assert.equal(sales.internalStatusNote, hasProof ? null : "No approved external proof yet");
    assert.ok(sales.internal.length > 0);
  }
});

test("a proof layer opened in Sales Mode does not survive the switch to Presentation Mode", () => {
  // The presenter opens "See it in practice" on a direction with no approved
  // proof in Sales Mode and sees the quiet internal status...
  const opened = configureViewReducer(
    configureViewReducer(initialConfigureViewState, {
      type: "OPEN_DIRECTION",
      directionId: "solution-location-opportunity",
    }),
    { type: "OPEN_DEPTH", depthId: "see-it-in-practice" },
  );

  const salesAvailable = (depthId) =>
    depthId === "see-it-in-practice"
      ? getSolutionProof("solution-location-opportunity", "sales").actionAvailable
      : true;
  assert.equal(resolveVisibleDepth(opened, salesAvailable), "see-it-in-practice");

  // ...then switches to Presentation Mode. The panel must be gone, or the
  // prospect is looking at exactly the "coming soon" state that is forbidden.
  const prospectAvailable = (depthId) =>
    depthId === "see-it-in-practice"
      ? getSolutionProof("solution-location-opportunity", "presentation").actionAvailable
      : true;
  assert.equal(resolveVisibleDepth(opened, prospectAvailable), null);

  // The other three layers are unaffected in either mode.
  for (const depthId of ["how-we-do-this", "what-is-needed", "privacy"]) {
    const other = configureViewReducer(opened, { type: "OPEN_DEPTH", depthId });
    assert.equal(resolveVisibleDepth(other, prospectAvailable), depthId);
  }

  // And the view state itself is untouched, so leaving Presentation Mode puts
  // the presenter back exactly where they were.
  assert.equal(opened.openDepthId, "see-it-in-practice");
  assert.equal(resolveVisibleDepth(opened, salesAvailable), "see-it-in-practice");

  // No layer is ever visible without a direction open.
  assert.equal(
    resolveVisibleDepth({ openDirectionId: null, openDepthId: "privacy" }, () => true),
    null,
  );
});

/* ----------------------------------------------------------------- 15 */
test("no recommendation, ranking or auto-selection API is introduced", () => {
  const banned = /recommend|rank|score|prefer|best|choose|autoselect|auto_select|shortlist|suggest|winner/i;
  for (const name of Object.keys(solutionRuntime)) {
    if (name === "implementationsAreRanked") continue; // the explicit negation
    assert.equal(banned.test(name), false, `solution-runtime must not export "${name}"`);
  }

  // Nor may any result object carry a field expressing a preference.
  for (const direction of directions) {
    const results = [
      getSolutionTechnologyDrilldown(direction.id),
      getSolutionRequirements(direction.id),
      getSolutionPrivacyDetail(direction.id),
      getSolutionProof(direction.id, "sales"),
    ];
    const keys = new Set();
    const walk = (value) => {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) return value.forEach(walk);
      for (const [key, child] of Object.entries(value)) {
        keys.add(key);
        walk(child);
      }
    };
    results.forEach(walk);
    for (const key of keys) {
      if (key === "ranked") continue; // the literal `false` negation
      assert.equal(banned.test(key), false, `${direction.id} result carries "${key}"`);
    }
  }
});

/* ----------------------------------------------------------------- 16 */
test("no pricing, ROI or calculation logic is introduced", () => {
  const banned = /price|pricing|cost|roi|payback|uplift|revenue|quote|budget|calculat|forecast|target|discount|invest/i;
  for (const name of Object.keys(solutionRuntime)) {
    assert.equal(banned.test(name), false, `solution-runtime must not export "${name}"`);
  }

  // Configure produces no numbers at all. Every leaf of every result is a
  // string, a boolean or null — there is nothing here that could be a figure,
  // a rate, a score or an amount.
  for (const direction of directions) {
    // One exemption: an approved case video carries its running time in
    // seconds. It is media metadata, not a figure, rate, score or amount, and it
    // is pinned below rather than scanned.
    const withoutDuration = (proof) => ({
      ...proof,
      usable: proof.usable.map(({ videoDuration, ...asset }) => {
        assert.ok(Number.isInteger(videoDuration) && videoDuration > 0);
        return asset;
      }),
      internal: proof.internal.map(({ videoDuration, ...asset }) => {
        assert.ok(videoDuration === null || (Number.isInteger(videoDuration) && videoDuration > 0));
        return asset;
      }),
    });
    const results = [
      getSolutionTechnologyDrilldown(direction.id),
      getSolutionRequirements(direction.id),
      getSolutionPrivacyDetail(direction.id),
      withoutDuration(getSolutionProof(direction.id, "sales")),
      withoutDuration(getSolutionProof(direction.id, "presentation")),
    ];
    for (const value of leaves(results)) {
      assert.notEqual(
        typeof value,
        "number",
        `${direction.id} exposes a numeric value: ${value}`,
      );
    }
  }
});

/* ----------------------------------------------------------------- 17 */
test("a detail layer closes back to the solution direction it was opened from", () => {
  let state = initialConfigureViewState;
  assert.deepEqual(state, { openDirectionId: null, openDepthId: null });

  // A depth layer cannot exist before a direction is opened.
  state = configureViewReducer(state, { type: "OPEN_DEPTH", depthId: "privacy" });
  assert.equal(state.openDepthId, null);

  state = configureViewReducer(state, {
    type: "OPEN_DIRECTION",
    directionId: "solution-capture-and-visits",
  });

  for (const depthId of solutionRuntime.configureDepthIds) {
    const opened = configureViewReducer(state, { type: "OPEN_DEPTH", depthId });
    assert.equal(opened.openDepthId, depthId);
    // The round trip: closing the layer keeps the same direction open.
    const closed = configureViewReducer(opened, { type: "CLOSE_DEPTH" });
    assert.equal(closed.openDirectionId, "solution-capture-and-visits");
    assert.equal(closed.openDepthId, null);
    // Escape peels one layer only, then the direction.
    const escapedOnce = configureViewReducer(opened, { type: "DISMISS" });
    assert.deepEqual(escapedOnce, {
      openDirectionId: "solution-capture-and-visits",
      openDepthId: null,
    });
    assert.deepEqual(configureViewReducer(escapedOnce, { type: "DISMISS" }), {
      openDirectionId: null,
      openDepthId: null,
    });
  }

  // Re-opening the direction already open does not discard the layer being read.
  const reading = configureViewReducer(state, { type: "OPEN_DEPTH", depthId: "how-we-do-this" });
  assert.deepEqual(
    configureViewReducer(reading, {
      type: "OPEN_DIRECTION",
      directionId: "solution-capture-and-visits",
    }),
    reading,
  );

  // Moving to a different direction clears the layer, because a layer only
  // means something inside one direction.
  const moved = configureViewReducer(reading, {
    type: "OPEN_DIRECTION",
    directionId: "solution-in-store-intelligence",
  });
  assert.deepEqual(moved, {
    openDirectionId: "solution-in-store-intelligence",
    openDepthId: null,
  });

  // Nothing is ever "selected" or saved: there is no such state to reach.
  assert.deepEqual(Object.keys(initialConfigureViewState).sort(), [
    "openDepthId",
    "openDirectionId",
  ]);
});

/* ------------------------------------------------------- requirements */
test("requirements are derived from declared evidence dependencies, not invented", () => {
  const inputIds = new Set(evidenceInputs.map((input) => input.id));

  for (const direction of directions) {
    const requirements = getSolutionRequirements(direction.id);
    assert.equal(requirements.framing, "To answer this well, we typically align:");
    assert.ok(requirements.primary.length <= 5, "first view stays short");

    const declared = new Set(
      direction.relatedSceneIds
        .flatMap((sceneId) => allScenes.find((scene) => scene.id === sceneId).derivedDependencies)
        .flatMap((dependency) => [
          ...dependency.requiredInputIds,
          ...(dependency.alternativeInputGroups ?? []).flat(),
        ]),
    );

    for (const item of [...requirements.primary, ...requirements.additional]) {
      if (item.kind === "evidence_input") {
        assert.ok(inputIds.has(item.inputId), `${item.inputId} is a real evidence input`);
        assert.ok(
          declared.has(item.inputId),
          `${item.inputId} is declared by a scene this direction synthesises`,
        );
        assert.equal(
          item.label,
          evidenceInputs.find((input) => input.id === item.inputId).label,
        );
      } else {
        assert.equal(item.kind, "commercial_alignment");
        assert.equal(item.inputId, null);
        assert.ok(direction.alignmentNotes.includes(item.label));
      }
    }

    // Both kinds are represented in the first view, so it reads as a
    // conversation rather than a data request or a pitch.
    const kinds = new Set(requirements.primary.map((item) => item.kind));
    assert.ok(kinds.has("evidence_input"));
    assert.ok(kinds.has("commercial_alignment"));
  }
});
