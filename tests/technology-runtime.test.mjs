import assert from "node:assert/strict";
import test from "node:test";

import {
  contentBundle,
  technologyImplementations,
} from "../app/content/index.ts";

import {
  getTechnologyCapability,
  getCapabilitiesForScene,
  getImplementation,
  getImplementationsForCapability,
  getImplementationReadiness,
  getCapabilityReadiness,
  getPrivacyStatusForImplementation,
  getSupportedClaimsForImplementation,
  getBlockedClaimsForImplementation,
  getTechnologyDrilldownForScene,
  getEntranceMeasurementImplementations,
  getPasserByMeasurementImplementations,
  getSpatialMeasurementImplementations,
  getClassificationImplementations,
  getVehicleParkingImplementations,
  getGeoMobilityImplementations,
  getBusinessDataImplementations,
  getVisitMatchingImplementations,
  isEntranceMeasurementCapability,
  isPasserByMeasurementCapability,
  isSpatialMeasurementCapability,
  isClassificationCapability,
  isVehicleParkingCapability,
  isGeoMobilityCapability,
  isBusinessDataCapability,
  isVisitMatchingCapability,
  validateTechnologyCrossSegment,
} from "../app/content/technology-runtime.ts";

test("All technology capabilities resolve", () => {
  for (const cap of contentBundle.technologyCapabilities) {
    const resolved = getTechnologyCapability(cap.id);
    assert.ok(resolved, `Capability ${cap.id} should resolve`);
    assert.equal(resolved.id, cap.id);
  }
});

test("Scene -> capability resolution works", () => {
  // Retail store-visits scene depends on both physical measurements:
  // TECH-01 measures the outdoor passing opportunity, TECH-02 the entrance.
  const caps = getCapabilitiesForScene("retail", "retail-store-visits");
  assert.equal(caps.length, 2);
  assert.deepEqual(caps.map((c) => c.id).sort(), ["TECH-01", "TECH-02"]);
  
  // Scene with multiple capabilities
  const caps2 = getCapabilitiesForScene("retail", "retail-conversion-sales-context");
  // The Conversion & sales context scene now draws the full commercial
  // equation, which begins outside the store, so it explains three
  // capabilities: TECH-01 (outdoor passing opportunity), TECH-02 (entrance
  // visits) and TECH-08 (connected business context).
  assert.equal(caps2.length, 3);
  const capIds = caps2.map((c) => c.id).sort();
  assert.deepEqual(capIds, ["TECH-01", "TECH-02", "TECH-08"].sort());
});

test("Cross-segment scene misuse is rejected", () => {
  // Shopping centre scene from retail segment should throw
  assert.throws(
    () => getCapabilitiesForScene("retail", "shopping-centre-catchment-area"),
    /belongs to segment shopping-centre, not retail/
  );
});

test("Capability -> multiple implementation resolution", () => {
  /* TECH-02 has 5 implementations. The two IP detection sensors joined on
     2026-09-27; which of them a segment is shown is decided per segment in
     segment-capability-media.ts, never here. */
  const impls = getImplementationsForCapability("TECH-02");
  assert.equal(impls.length, 6);
  const implIds = impls.map((i) => i.id).sort();
  assert.deepEqual(implIds, [
    "impl-isarsoft-camera-analytics",
    "impl-milesight-vs125p-entrance",
    "impl-xovis-3d-entrance",
    "impl-ip-detection-indoor",
    "impl-ip-detection-outdoor",
    "impl-xovis-3d-entrance-outdoor",
  ].sort());
  
  // Each implementation references TECH-02
  for (const impl of impls) {
    assert.ok(impl.capabilityIds.includes("TECH-02"));
  }
});

test("Xovis is an implementation, not a capability", () => {
  const xovisImpl = getImplementation("impl-xovis-3d-entrance");
  assert.ok(xovisImpl);
  assert.equal(xovisImpl.supplier, "Xovis");
  assert.equal(xovisImpl.implementationRole, "Premium 3D");
  assert.ok(xovisImpl.capabilityIds.includes("TECH-02"));
  
  // Xovis should not appear as a capability
  const capabilities = contentBundle.technologyCapabilities.map((c) => c.id);
  assert.ok(!capabilities.some((id) => id.toLowerCase().includes("xovis")));
});

test("Milesight VS125-P is an implementation, not a capability", () => {
  const milesightImpl = getImplementation("impl-milesight-vs125p-entrance");
  assert.ok(milesightImpl);
  assert.equal(milesightImpl.supplier, "Milesight");
  assert.equal(milesightImpl.product, "VS125-P");
  assert.equal(milesightImpl.implementationRole, "Basic 3D");
  assert.ok(milesightImpl.capabilityIds.includes("TECH-02"));
  
  // Milesight should not appear as a capability
  const capabilities = contentBundle.technologyCapabilities.map((c) => c.id);
  assert.ok(!capabilities.some((id) => id.toLowerCase().includes("milesight")));
});

test("Isarsoft is IP-camera analytics, not 3D", () => {
  const isarsoftImpl = getImplementation("impl-isarsoft-camera-analytics");
  assert.ok(isarsoftImpl);
  assert.equal(isarsoftImpl.supplier, "Isarsoft");
  assert.equal(isarsoftImpl.implementationRole, "Analytics on existing camera infrastructure");
  assert.ok(isarsoftImpl.capabilityIds.includes("TECH-02"));
  assert.match(isarsoftImpl.supportedClaims.join(" ") ?? "", /not a 3D sensor/);
  // One family, several possible capabilities — never four separate products.
  assert.ok(isarsoftImpl.capabilityIds.includes("TECH-03"));
  assert.ok(isarsoftImpl.capabilityIds.includes("TECH-05"));
  assert.equal(
    technologyImplementations.filter((item) => item.supplier === "Isarsoft").length,
    1,
  );
});

test("VS361 resolves only to passer-by capability (TECH-01), not entrance (TECH-02)", () => {
  const vs361 = getImplementation("impl-milesight-vs361-passerby");
  assert.ok(vs361);
  assert.deepEqual(vs361.capabilityIds, ["TECH-01"]);
  assert.ok(!vs361.capabilityIds.includes("TECH-02"));
  
  // Verify it's not in TECH-02 implementations
  const entranceImpls = getImplementationsForCapability("TECH-02");
  const vs361InEntrance = entranceImpls.find((i) => i.id === "impl-milesight-vs361-passerby");
  assert.ok(!vs361InEntrance);
});

test("LiDAR and Xovis can both be possible spatial implementations where documented", () => {
  const spatialImpls = getImplementationsForCapability("TECH-04");
  // LiDAR and the FishEye 3D sensor, plus the two IP detection sensors that
  // count between zones in open-air and camera-measured segments.
  assert.equal(spatialImpls.length, 4);
  
  const implIds = spatialImpls.map((i) => i.id).sort();
  assert.deepEqual(implIds, ["impl-lidar-spatial", "impl-xovis-3d-spatial", "impl-ip-detection-indoor", "impl-ip-detection-outdoor"].sort());
  
  // Both reference TECH-04
  for (const impl of spatialImpls) {
    assert.ok(impl.capabilityIds.includes("TECH-04"));
  }
  
  // Neither claims equivalence
  const lidar = spatialImpls.find((i) => i.id === "impl-lidar-spatial");
  const xovis = spatialImpls.find((i) => i.id === "impl-xovis-3d-spatial");
  
  assert.match(lidar?.unsupportedClaims.join(" ") ?? "", /equivalence with 3D stereo vision/);
  // Xovis spatial explicitly blocks equivalence with LiDAR
  assert.match(xovis?.unsupportedClaims.join(" ") ?? "", /Equivalence with LiDAR/);
});

test("No equality of output/coverage is inferred between implementations", () => {
  // LiDAR explicitly blocks equivalence claims
  const lidar = getImplementation("impl-lidar-spatial");
  assert.ok(lidar);
  assert.match(lidar.unsupportedClaims.join(" ") ?? "", /equivalence with 3D stereo vision/);
  
  // Xovis spatial doesn't claim equivalence either
  const xovisSpatial = getImplementation("impl-xovis-3d-spatial");
  assert.ok(xovisSpatial);
  // Has unsupported claims about generic specs
  assert.match(xovisSpatial.unsupportedClaims.join(" ") ?? "", /universal coverage|continuity|accuracy|classification|re-identification/);
  /* And it never borrows the other 3D sensor's figures. The claim is named
     by presentation name, not model number — the brochure does not name a
     vendor, and a blocked claim is brochure copy like any other. */
  assert.match(xovisSpatial.unsupportedClaims.join(" ") ?? "", /3D Sensor Basic FoV's specifications/);
});

test("Missing source mapping remains visible", () => {
  // Isarsoft privacy is partially documented; technical detail remains unmapped.
  const isarsoft = getImplementation("impl-isarsoft-camera-analytics");
  assert.equal(isarsoft.privacyStatus, "partially_source_backed");
  assert.equal(isarsoft.technicalDetailStatus, "requires_source_mapping");

  // The RoboSense datasheet documents the sensor but nothing about data
  // protection, so the privacy gap stays visible even though the technical
  // detail is now source-backed.
  const lidar = getImplementation("impl-lidar-spatial");
  assert.equal(lidar.privacyStatus, "requires_source_mapping");

  // A mapped datasheet raises technical detail but never silently raises
  // privacy with it: Milesight's GDPR statement is the manufacturer's own.
  const milesight = getImplementation("impl-milesight-vs125p-entrance");
  assert.equal(milesight.technicalDetailStatus, "source_backed");
  assert.notEqual(milesight.privacyStatus, "source_backed");

  const vs361 = getImplementation("impl-milesight-vs361-passerby");
  assert.equal(vs361.technicalDetailStatus, "source_backed");
  assert.notEqual(vs361.privacyStatus, "source_backed");
});

test("Privacy evidence does not leak across implementations", () => {
  // Xovis PC2SE is named in the ePrivacy certificate's own product scope.
  const xovis = getImplementation("impl-xovis-3d-entrance");
  assert.equal(xovis.privacyStatus, "source_backed");
  
  // Milesight's privacy statement is its own, with no certificate behind it.
  const milesight = getImplementation("impl-milesight-vs125p-entrance");
  assert.equal(milesight.privacyStatus, "partially_source_backed");
  
  // Isarsoft's own privacy document is partial and does not inherit Xovis evidence.
  const isarsoft = getImplementation("impl-isarsoft-camera-analytics");
  assert.equal(isarsoft.privacyStatus, "partially_source_backed");

  // The Xovis certificate must not be readable as covering the others.
  assert.notEqual(milesight.privacyStatus, xovis.privacyStatus);
  assert.notEqual(isarsoft.privacyStatus, xovis.privacyStatus);
  
  // At least 2 different values (not all identical)
  const privacySet = new Set([xovis.privacyStatus, milesight.privacyStatus, isarsoft.privacyStatus]);
  assert.ok(privacySet.size >= 2, "Privacy statuses should differ across implementations");
});

test("Supported claims resolve correctly", () => {
  const xovis = getImplementation("impl-xovis-3d-entrance");
  assert.ok(xovis.supportedClaims.length > 0);
  assert.match(xovis.supportedClaims.join(" "), /3D stereo vision/);
  assert.match(xovis.supportedClaims.join(" "), /processed on the device|on the device itself/);
  assert.match(xovis.supportedClaims.join(" "), /neither stored nor leave the sensor/);
});

test("Blocked claims resolve correctly", () => {
  const xovis = getImplementation("impl-xovis-3d-entrance");
  assert.ok(xovis.unsupportedClaims.length > 0);
  assert.match(xovis.unsupportedClaims.join(" "), /accuracy, capture-rate or coverage figure/);
  // A certified sensor is still not a compliant system, and the record says so.
  assert.match(xovis.unsupportedClaims.join(" "), /Compliance of the overall system/);
  
  const milesight = getImplementation("impl-milesight-vs125p-entrance");
  assert.match(milesight.unsupportedClaims.join(" "), /Equivalence with the 3D Sensor Basic FoV/);
  /* The manufacturer's own accuracy figure is never restated as a PFM claim —
     and since 2026-09-28 it is not repeated at all. Configure renders every
     blocked claim, and a percentage shown to a prospect is read as a result
     even when introduced as one PFM does not claim. */
  assert.match(milesight.unsupportedClaims.join(" "), /manufacturer's own counting-accuracy figure/);
  for (const claim of [...milesight.supportedClaims, ...milesight.unsupportedClaims]) {
    assert.doesNotMatch(claim, /\d+(\.\d+)?\s*%/, `a percentage reaches the page: ${claim}`);
  }
  // Its privacy claim says the device processes images, and that exactly one
  // preview mode shows none — never that the device is image-free.
  const privacy = milesight.supportedClaims.join(" ");
  assert.match(privacy, /image processing on the device/);
  assert.match(privacy, /one of its three preview modes shows no image/);
  assert.doesNotMatch(privacy, /no-image preview modes/);
});

test("No automatic implementation ranking exists", () => {
  // getImplementationsForCapability returns all, no ranking
  const impls = getImplementationsForCapability("TECH-02");
  assert.equal(impls.length, 6);
  
  // No priority/rank field exists
  for (const impl of impls) {
    assert.ok(!("rank" in impl));
    assert.ok(!("priority" in impl));
    assert.ok(!("score" in impl));
  }
});

test("Architecture-only capability remains queryable", () => {
  // All 8 capabilities are queryable
  const capIds = ["TECH-01", "TECH-02", "TECH-03", "TECH-04", "TECH-05", "TECH-06", "TECH-07", "TECH-08"];
  for (const capId of capIds) {
    const cap = getTechnologyCapability(capId);
    assert.ok(cap, "Capability " + capId + " should be queryable");
  }
});

test("getTechnologyDrilldownForScene returns complete contract", () => {
  const drilldown = getTechnologyDrilldownForScene("retail", "retail-store-visits");
  assert.ok(drilldown);
  assert.equal(drilldown.scene.id, "retail-store-visits");
  assert.ok(drilldown.capabilities.length > 0);
  
  for (const cap of drilldown.capabilities) {
    assert.ok(cap.capability);
    assert.ok(cap.readiness);
    assert.ok(cap.purpose);
    assert.ok(cap.privacyPrinciple);
    assert.ok(Array.isArray(cap.evidenceTypes));
    assert.ok(Array.isArray(cap.implementations));
    
    for (const impl of cap.implementations) {
      assert.ok(impl.implementation);
      assert.ok(impl.readiness);
      assert.ok(impl.supplier !== undefined); // null or string
      assert.ok(impl.product !== undefined); // null or string
      assert.ok(impl.implementationRole);
      assert.ok(impl.sourceStatus);
      assert.ok(impl.privacyStatus);
      assert.ok(impl.technicalDetailStatus);
      assert.ok(Array.isArray(impl.supportedClaims));
      assert.ok(Array.isArray(impl.blockedClaims));
      assert.ok(Array.isArray(impl.sourceRefs));
    }
  }
});

test("Cross-segment scene misuse is rejected in drilldown", () => {
  assert.throws(
    () => getTechnologyDrilldownForScene("retail", "shopping-centre-catchment-area"),
    /belongs to segment shopping-centre, not retail/
  );
});

test("getEntranceMeasurementImplementations returns correct implementations", () => {
  const impls = getEntranceMeasurementImplementations();
  assert.equal(impls.length, 6);
  const roles = impls.map((i) => i.implementationRole).sort();
  assert.deepEqual(
    roles,
    [
      "Analytics on existing camera infrastructure",
      "Basic 3D",
      "Premium 3D",
      "Premium 3D, outdoor",
      "IP detection sensor for indoor counting and anonymous re-identification",
      "IP detection sensor for outdoor counting and anonymous re-identification",
    ].sort(),
  );
});

test("getPasserByMeasurementImplementations returns correct implementations", () => {
  const impls = getPasserByMeasurementImplementations();
  assert.equal(impls.length, 1);
  const ids = impls.map((i) => i.id);
  assert.deepEqual(ids, ["impl-milesight-vs361-passerby"]);
});

test("Passer-by and entrance capabilities are separate", () => {
  // TECH-01 is passer-by, TECH-02 is entrance
  assert.ok(isPasserByMeasurementCapability("TECH-01"));
  assert.ok(!isPasserByMeasurementCapability("TECH-02"));
  assert.ok(isEntranceMeasurementCapability("TECH-02"));
  assert.ok(!isEntranceMeasurementCapability("TECH-01"));
  
  // VS361 only in TECH-01
  const vs361 = getImplementation("impl-milesight-vs361-passerby");
  assert.ok(vs361.capabilityIds.includes("TECH-01"));
  assert.ok(!vs361.capabilityIds.includes("TECH-02"));
});

test("Spatial measurement implementations (LiDAR and Xovis 3D) both exist for TECH-04", () => {
  const impls = getSpatialMeasurementImplementations();
  assert.equal(impls.length, 4);
  const roles = impls.map((i) => i.implementationRole).sort();
  assert.deepEqual(
    roles,
    [
      "3D in-store spatial option",
      "Advanced spatial intelligence",
      "IP detection sensor for indoor counting and anonymous re-identification",
      "IP detection sensor for outdoor counting and anonymous re-identification",
    ].sort(),
  );
});

test("Classification capability (TECH-03) has implementations", () => {
  const impls = getClassificationImplementations();
  assert.equal(impls.length, 5);
  // The vendor-neutral method class is present. Its position is not asserted:
  // declaration order carries no meaning in this model, by design.
  const methodClass = impls.find((i) => i.id === "impl-configured-classification");
  assert.ok(methodClass);
  assert.equal(methodClass.implementationRole, "Optional classification add-on");
  // Classification stays configuration-dependent for every one of them.
  const ids = impls.map((i) => i.id).sort();
  assert.deepEqual(ids, [
    "impl-configured-classification",
    "impl-isarsoft-camera-analytics",
    "impl-ip-detection-indoor",
    "impl-ip-detection-outdoor",
    "impl-milesight-vs125p-entrance",
  ].sort());
});

test("Vehicle/parking capability (TECH-06) has implementations", () => {
  const impls = getVehicleParkingImplementations();
  assert.equal(impls.length, 4);
  const ids = impls.map((i) => i.id).sort();
  assert.deepEqual(ids, [
    "impl-lawful-anpr-lpr",
    "impl-parking-occupancy-method",
    "impl-tattile-anpr-vehicle",
    "impl-vehicle-arrival-method",
  ].sort());
});

test("Geo/mobility capability (TECH-07) has implementations", () => {
  const impls = getGeoMobilityImplementations();
  assert.equal(impls.length, 1);
  assert.equal(impls[0].id, "impl-aggregate-geo-mobility");
});

test("Business data capability (TECH-08) has implementations", () => {
  const impls = getBusinessDataImplementations();
  assert.equal(impls.length, 1);
  assert.equal(impls[0].id, "impl-business-data-connection");
});

test("Visit matching capability (TECH-05) has implementations", () => {
  const impls = getVisitMatchingImplementations();
  assert.equal(impls.length, 4);
  const ids = impls.map((i) => i.id).sort();
  assert.deepEqual(
    ids,
    ["impl-anonymous-visit-matching", "impl-isarsoft-camera-analytics", "impl-ip-detection-indoor", "impl-ip-detection-outdoor"].sort(),
  );
});

test("Implementation readiness derives correctly", () => {
  // Xovis has partially_source_backed for critical fields -> PARTIAL
  const xovisReadiness = getImplementationReadiness("impl-xovis-3d-entrance");
  assert.ok(["PARTIAL", "SOURCE_MAPPING_REQUIRED", "READY_FOR_EXTERNAL_EXPLANATION", "ARCHITECTURE_ONLY", "PRODUCT_VALIDATION_REQUIRED"].includes(xovisReadiness));
  
  // Milesight requires source mapping -> SOURCE_MAPPING_REQUIRED
  const milesightReadiness = getImplementationReadiness("impl-milesight-vs125p-entrance");
  assert.ok(["SOURCE_MAPPING_REQUIRED", "PARTIAL", "READY_FOR_EXTERNAL_EXPLANATION", "ARCHITECTURE_ONLY", "PRODUCT_VALIDATION_REQUIRED"].includes(milesightReadiness));
});

/**
 * Referential integrity, stated as a test rather than left to the type union.
 *
 * A capability may only point at an implementation that actually exists in
 * `technologyImplementations`. The union type alone is not enough: a member can
 * be declared there and never defined as content, which is exactly how
 * `impl-passive-infrared-passerby` survived as a phantom id.
 */
test("Every capability implementationId resolves to a defined implementation", () => {
  const defined = new Set(contentBundle.technologyImplementations.map((impl) => impl.id));
  for (const capability of contentBundle.technologyCapabilities) {
    assert.ok(
      capability.implementationIds.length > 0,
      `Capability ${capability.id} declares no implementation`,
    );
    for (const implementationId of capability.implementationIds) {
      assert.ok(
        defined.has(implementationId),
        `Capability ${capability.id} references undefined implementation ${implementationId}`,
      );
      const resolved = getImplementation(implementationId);
      assert.ok(resolved, `${implementationId} should resolve through the runtime`);
      assert.equal(resolved.id, implementationId);
      assert.ok(
        resolved.capabilityIds.includes(capability.id),
        `${implementationId} does not declare ${capability.id} in return`,
      );
    }
  }
});

test("Capability readiness derives correctly", () => {
  const tech02Readiness = getCapabilityReadiness("TECH-02");
  assert.ok(["READY_FOR_EXTERNAL_EXPLANATION", "PARTIAL", "SOURCE_MAPPING_REQUIRED", "PRODUCT_VALIDATION_REQUIRED", "ARCHITECTURE_ONLY"].includes(tech02Readiness));
  
  const tech01Readiness = getCapabilityReadiness("TECH-01");
  assert.ok(["READY_FOR_EXTERNAL_EXPLANATION", "PARTIAL", "SOURCE_MAPPING_REQUIRED", "PRODUCT_VALIDATION_REQUIRED", "ARCHITECTURE_ONLY"].includes(tech01Readiness));
});

test("Privacy status is implementation-specific", () => {
  const xovisPrivacy = getPrivacyStatusForImplementation("impl-xovis-3d-entrance");
  const milesightPrivacy = getPrivacyStatusForImplementation("impl-milesight-vs125p-entrance");
  const isarsoftPrivacy = getPrivacyStatusForImplementation("impl-isarsoft-camera-analytics");
  
  // Three implementations, three different privacy evidence classes.
  assert.equal(xovisPrivacy, "source_backed");
  assert.equal(milesightPrivacy, "partially_source_backed");
  assert.equal(isarsoftPrivacy, "partially_source_backed");
  
  // Not all identical (at least 2 different)
  const privacySet = new Set([xovisPrivacy, milesightPrivacy, isarsoftPrivacy]);
  assert.ok(privacySet.size >= 2, "Privacy statuses should differ across implementations");
});

test("Supported and blocked claims are accessible", () => {
  const xovisClaims = getSupportedClaimsForImplementation("impl-xovis-3d-entrance");
  const xovisBlocked = getBlockedClaimsForImplementation("impl-xovis-3d-entrance");
  
  assert.ok(xovisClaims.length > 0);
  assert.ok(xovisBlocked.length > 0);
  
  // Claims don't overlap
  const claimSet = new Set([...xovisClaims, ...xovisBlocked]);
  assert.equal(claimSet.size, xovisClaims.length + xovisBlocked.length);
});

test("validateTechnologyCrossSegment returns no errors for valid content", () => {
  const errors = validateTechnologyCrossSegment();
  assert.deepEqual(errors, []);
});

test("getTechnologyDrilldownForScene returns capabilities with all required fields", () => {
  const drilldown = getTechnologyDrilldownForScene("retail", "retail-conversion-sales-context");
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 3); // TECH-01, TECH-02 and TECH-08
  
  for (const cap of drilldown.capabilities) {
    assert.ok(cap.capability);
    assert.ok(cap.readiness);
    assert.ok(cap.purpose);
    assert.ok(cap.privacyPrinciple);
    assert.ok(Array.isArray(cap.evidenceTypes));
    assert.ok(cap.implementations.length > 0);
    
    for (const impl of cap.implementations) {
      assert.ok(impl.implementation);
      assert.ok(impl.readiness);
      assert.ok(impl.supplier !== undefined);
      assert.ok(impl.product !== undefined);
      assert.ok(impl.implementationRole);
      assert.ok(impl.sourceStatus);
      assert.ok(impl.privacyStatus);
      assert.ok(impl.technicalDetailStatus);
      assert.ok(Array.isArray(impl.supportedClaims));
      assert.ok(Array.isArray(impl.blockedClaims));
      assert.ok(Array.isArray(impl.sourceRefs));
    }
  }
});

test("Helper functions correctly identify capability types", () => {
  assert.ok(isEntranceMeasurementCapability("TECH-02"));
  assert.ok(!isEntranceMeasurementCapability("TECH-01"));
  
  assert.ok(isPasserByMeasurementCapability("TECH-01"));
  assert.ok(!isPasserByMeasurementCapability("TECH-02"));
  
  assert.ok(isSpatialMeasurementCapability("TECH-04"));
  assert.ok(!isSpatialMeasurementCapability("TECH-02"));
  
  assert.ok(isClassificationCapability("TECH-03"));
  
  assert.ok(isVehicleParkingCapability("TECH-06"));
  
  assert.ok(isGeoMobilityCapability("TECH-07"));
  
  assert.ok(isBusinessDataCapability("TECH-08"));
  
  assert.ok(isVisitMatchingCapability("TECH-05"));
});
