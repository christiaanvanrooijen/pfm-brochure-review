import assert from "node:assert/strict";
import test from "node:test";

import { allScenes, dataRoles, segmentDefinitions } from "../app/content/index.ts";

import {
  evidenceCatalog,
  getAvailableEvidenceForScene,
  getConnectedEvidenceForScene,
  getDerivedEvidenceForScene,
  getEvidence,
  getEvidenceAvailability,
  getEvidenceForScene,
  getEvidenceMetadata,
  getMeasuredEvidenceForScene,
  getSceneEvidenceRuntime,
} from "../app/content/evidence-runtime.ts";

// 1. Evidence lookup by ID
test("getEvidence resolves a known evidence id and returns undefined for an unknown one", () => {
  const evidence = getEvidence("ev-retail-store-visits");
  assert.ok(evidence);
  assert.equal(evidence.id, "ev-retail-store-visits");
  assert.equal(evidence.segment, "retail");
  assert.equal(evidence.illustrative, true);

  assert.equal(getEvidence("ev-does-not-exist"), undefined);
});

// 2. Scene -> evidence resolution
test("getEvidenceForScene resolves the evidence attached to a Retail scene", () => {
  const evidence = getEvidenceForScene("retail", "retail-store-visits");
  assert.ok(evidence.length > 0);
  for (const item of evidence) {
    assert.equal(item.segment, "retail");
    assert.ok(item.relatedSceneIds.includes("retail-store-visits"));
  }
});

// 3. Cross-segment evidence leakage rejected
test("Cross-segment evidence leakage is rejected", () => {
  assert.throws(
    () => getEvidenceForScene("shopping-centre", "retail-store-visits"),
    /belongs to segment retail, not shopping-centre/,
  );

  // Even for a valid shopping-centre scene, no retail evidence leaks in.
  const scEvidence = getEvidenceForScene("shopping-centre", "shopping-centre-entrances");
  for (const item of scEvidence) {
    assert.equal(item.segment, "shopping-centre");
  }
});

// 4. Retail Store Visits resolves passing audience and visits
test("Retail Store visits scene resolves both passing audience and store visits evidence", () => {
  const evidence = getEvidenceForScene("retail", "retail-store-visits");
  const ids = evidence.map((item) => item.id);
  assert.ok(ids.includes("ev-retail-passing-audience"));
  assert.ok(ids.includes("ev-retail-store-visits"));

  const visits = getEvidence("ev-retail-store-visits");
  assert.equal(visits.evidenceType, "measured");
  assert.equal(visits.dataRole, "physical");

  // Passer-by measurement is a physical measurement of the outdoor
  // opportunity area (TECH-01), not mobile/geo context.
  const passingAudience = getEvidence("ev-retail-passing-audience");
  assert.equal(passingAudience.evidenceType, "measured");
  assert.equal(passingAudience.dataRole, "physical");
});

// 5. Capture resolves only when both dependencies exist
test("Capture rate is available when both aligned passing audience and visits exist", () => {
  const availability = getEvidenceAvailability("ev-retail-capture-rate");
  assert.equal(availability.available, true);

  const capture = getEvidence("ev-retail-capture-rate");
  assert.equal(capture.evidenceType, "derived");
  assert.deepEqual([...capture.dependencyIds].sort(), ["aligned_passer_by_audience", "store_visits"].sort());
});

// 6. Mobile & geo is optional context and never gates the capture calculation
test("Capture rate is unaffected by the Mobile & geo lens, and follows the Physical lens instead", () => {
  const withoutGeo = dataRoles.filter((role) => role !== "mobile_geo");
  const geoAvailability = getEvidenceAvailability("ev-retail-capture-rate", withoutGeo);
  assert.equal(geoAvailability.available, true);
  assert.equal(
    getEvidenceAvailability("ev-retail-passing-audience", withoutGeo).available,
    true,
  );

  const withoutPhysical = dataRoles.filter((role) => role !== "physical");
  const physicalAvailability = getEvidenceAvailability("ev-retail-capture-rate", withoutPhysical);
  assert.equal(physicalAvailability.available, false);
  assert.equal(physicalAvailability.reason, "lens_disabled");
  assert.ok(physicalAvailability.missingDependencies.includes("aligned_passer_by_audience"));
});

// 7. Capture becomes unavailable if visits are unavailable
test("Capture rate becomes unavailable when the Physical lens is disabled", () => {
  const activeLenses = dataRoles.filter((role) => role !== "physical");
  const availability = getEvidenceAvailability("ev-retail-capture-rate", activeLenses);
  assert.equal(availability.available, false);
  assert.ok(availability.missingDependencies.includes("store_visits"));
});

// 8. Conversion requires visits + transactions
test("Conversion rate depends on both store visits and transactions", () => {
  const conversion = getEvidence("ev-retail-conversion-rate");
  assert.equal(conversion.evidenceType, "derived");
  assert.deepEqual([...conversion.dependencyIds].sort(), ["store_visits", "transactions"].sort());

  const availability = getEvidenceAvailability("ev-retail-conversion-rate");
  assert.equal(availability.available, true);
});

// 9. Business lens removal can invalidate conversion evidence
test("Business lens removal invalidates conversion and sales-per-visitor evidence", () => {
  const activeLenses = dataRoles.filter((role) => role !== "business");

  const conversionAvailability = getEvidenceAvailability("ev-retail-conversion-rate", activeLenses);
  assert.equal(conversionAvailability.available, false);
  assert.ok(conversionAvailability.missingDependencies.includes("transactions"));

  const salesPerVisitorAvailability = getEvidenceAvailability("ev-retail-sales-per-visitor", activeLenses);
  assert.equal(salesPerVisitorAvailability.available, false);

  // Business-only base evidence directly reports lens_disabled.
  const transactionsAvailability = getEvidenceAvailability("ev-retail-transactions", activeLenses);
  assert.equal(transactionsAvailability.available, false);
  assert.equal(transactionsAvailability.reason, "lens_disabled");

  // Capture rate does not depend on business data and should remain available.
  const captureAvailability = getEvidenceAvailability("ev-retail-capture-rate", activeLenses);
  assert.equal(captureAvailability.available, true);
});

// 9b. Average transaction value is a runtime-derived term of the equation
test("Average transaction value is derived in the runtime from turnover and transactions", () => {
  // ATV is the fourth term of the Retail commercial equation
  // (passers-by × capture rate × conversion rate × ATV = turnover). It must be
  // a derived entry in the evidence catalog — never arithmetic inside React —
  // so that it carries a source layer, named dependencies and the same
  // availability propagation as every other derived reading.
  const atv = getEvidence("ev-retail-average-transaction-value");
  assert.ok(atv);
  assert.equal(atv.evidenceType, "derived");
  assert.equal(atv.dataRole, "insight");
  assert.equal(atv.sourceLayer, "insight");
  assert.equal(atv.segment, "retail");
  assert.deepEqual([...atv.dependencyIds].sort(), ["sales_value", "transactions"].sort());

  // The value is the quotient of the two connected values on screen, not a
  // separately typed constant: €6,480 ÷ 103 = €62.91.
  const turnover = getEvidence("ev-retail-transaction-value");
  const transactions = getEvidence("ev-retail-transactions");
  assert.equal(
    atv.value,
    Number((turnover.value / transactions.value).toFixed(2)),
  );
  assert.equal(atv.displayValue, "€62.91");

  assert.equal(getEvidenceAvailability(atv.id).available, true);
});

// 9c. ATV is distinct from sales per visitor and neither replaces the other
test("Average transaction value and sales per visitor stay distinct derived readings", () => {
  // ATV divides turnover by transactions (what one purchase is worth); sales
  // per visitor divides turnover by visits (what one visitor is worth). They
  // answer different questions and must not collapse into one another.
  const atv = getEvidence("ev-retail-average-transaction-value");
  const spv = getEvidence("ev-retail-sales-per-visitor");
  const turnover = getEvidence("ev-retail-transaction-value");
  const visits = getEvidence("ev-retail-store-visits");

  assert.notEqual(atv.value, spv.value);
  assert.equal(spv.value, Number((turnover.value / visits.value).toFixed(2)));
  assert.ok(spv.dependencyIds.includes("store_visits"));
  assert.ok(!atv.dependencyIds.includes("store_visits"));
});

// 9d. ATV propagates unavailability through the shared mechanism
test("Average transaction value follows the Business lens and ignores Mobile & geo", () => {
  // Both of ATV's inputs are Business/connected, so switching Business off must
  // remove it through the ordinary dependency resolution — no parallel truth.
  const withoutBusiness = dataRoles.filter((role) => role !== "business");
  const businessOff = getEvidenceAvailability(
    "ev-retail-average-transaction-value",
    withoutBusiness,
  );
  assert.equal(businessOff.available, false);
  assert.ok(businessOff.missingDependencies.includes("transactions"));
  assert.ok(businessOff.missingDependencies.includes("sales_value"));

  // Turnover and conversion go with it; the outside-the-store half does not.
  for (const id of ["ev-retail-transaction-value", "ev-retail-conversion-rate"]) {
    assert.equal(getEvidenceAvailability(id, withoutBusiness).available, false);
  }
  for (const id of ["ev-retail-passing-audience", "ev-retail-store-visits", "ev-retail-capture-rate"]) {
    assert.equal(getEvidenceAvailability(id, withoutBusiness).available, true);
  }

  // Mobile & geo measures nothing in this equation, so switching it off must
  // change nothing at all — including ATV.
  const withoutGeo = dataRoles.filter((role) => role !== "mobile_geo");
  for (const id of [
    "ev-retail-passing-audience",
    "ev-retail-capture-rate",
    "ev-retail-store-visits",
    "ev-retail-average-transaction-value",
    "ev-retail-conversion-rate",
    "ev-retail-transaction-value",
  ]) {
    assert.equal(
      getEvidenceAvailability(id, withoutGeo).available,
      true,
      `${id} must be unaffected by the Mobile & geo lens`,
    );
  }
});

// 9e. The scene resolves both halves of the commercial equation
test("Conversion & sales context resolves the full commercial equation, both halves", () => {
  // The Retail commercial story does not begin at store visits. The scene must
  // resolve the outside-the-store half (passers-by × capture rate = store
  // visits) and the inside-the-store half (store visits × conversion × ATV =
  // turnover), with store visits as the single shared hinge term.
  const runtime = getSceneEvidenceRuntime("retail", "retail-conversion-sales-context");
  const byId = new Map(runtime.evidence.map((item) => [item.id, item]));

  for (const id of [
    "ev-retail-passing-audience",
    "ev-retail-capture-rate",
    "ev-retail-store-visits",
    "ev-retail-conversion-rate",
    "ev-retail-average-transaction-value",
    "ev-retail-transaction-value",
  ]) {
    assert.ok(byId.has(id), `${id} should resolve for the commercial equation scene`);
  }

  // Store visits appears exactly once — it is one measurement acting as the
  // hand-off between the halves, never two values that happen to agree.
  assert.equal(
    runtime.evidence.filter((item) => item.id === "ev-retail-store-visits").length,
    1,
  );

  // Both halves are manually verifiable from the values a presenter reads off
  // the screen. The rates are stored rounded for display, so each half is
  // checked to the precision that rounding allows rather than exactly.
  const passers = byId.get("ev-retail-passing-audience").value;
  const capture = byId.get("ev-retail-capture-rate").value;
  const visits = byId.get("ev-retail-store-visits").value;
  const conversion = byId.get("ev-retail-conversion-rate").value;
  const atv = byId.get("ev-retail-average-transaction-value").value;
  const turnover = byId.get("ev-retail-transaction-value").value;

  // Each half must land within half a percent of the stated result. That is
  // the honest bound: the rates are stored rounded for display (capture 16.0%
  // against a true 16.024%, conversion 15.1% against a true 15.125%), so a
  // presenter multiplying the numbers on screen reconstructs the result to
  // display precision, not to the cent.
  const withinHalfAPercent = (actual, expected, description) =>
    assert.ok(
      Math.abs(actual - expected) / expected < 0.005,
      `${description} — got ${actual}, expected about ${expected}`,
    );

  // passers-by × capture rate = store visits
  withinHalfAPercent(
    passers * (capture / 100),
    visits,
    `${passers} passers-by x ${capture}% capture should reconstruct ${visits} store visits`,
  );
  // store visits × conversion rate × average transaction value = turnover
  withinHalfAPercent(
    visits * (conversion / 100) * atv,
    turnover,
    `${visits} visits x ${conversion}% conversion x ${atv} ATV should reconstruct ${turnover} turnover`,
  );

  // And the equation composes end to end: passers-by × capture × conversion ×
  // ATV = turnover, which is the whole point of the scene.
  withinHalfAPercent(
    passers * (capture / 100) * (conversion / 100) * atv,
    turnover,
    "the full four-term commercial equation should reconstruct turnover",
  );
});

// 10. Physical lens removal can invalidate physical and dependent derived evidence
test("Physical lens removal invalidates physical evidence and every dependent derived KPI", () => {
  const activeLenses = dataRoles.filter((role) => role !== "physical");

  const visitsAvailability = getEvidenceAvailability("ev-retail-store-visits", activeLenses);
  assert.equal(visitsAvailability.available, false);
  assert.equal(visitsAvailability.reason, "lens_disabled");

  for (const derivedId of ["ev-retail-capture-rate", "ev-retail-conversion-rate", "ev-retail-sales-per-visitor"]) {
    const availability = getEvidenceAvailability(derivedId, activeLenses);
    assert.equal(availability.available, false, `${derivedId} should be unavailable without the Physical lens`);
    assert.ok(availability.missingDependencies.includes("store_visits"));
  }
});

// 11. Illustrative Northstar evidence remains marked illustrative
test("Every catalog evidence item is marked illustrative", () => {
  assert.ok(evidenceCatalog.length > 0);
  for (const evidence of evidenceCatalog) {
    assert.equal(evidence.illustrative, true, `${evidence.id} should be illustrative`);
  }

  const runtime = getSceneEvidenceRuntime("retail", "retail-store-visits");
  assert.equal(runtime.illustrativeFlag, true);
});

// 12. Missing evidence returns a valid unavailable result rather than invented data
test("Unknown evidence id returns a structured unavailable result, not invented data", () => {
  const availability = getEvidenceAvailability("ev-does-not-exist");
  assert.equal(availability.available, false);
  assert.equal(availability.reason, "no_demo_values");
});

test("A scene with no approved demo values reports missing demo evidence, never invented numbers", () => {
  // Retail visitor composition currently has no approved fixture value.
  const runtime = getSceneEvidenceRuntime("retail", "retail-visitor-composition");
  assert.equal(runtime.availableEvidence.length, 0);
  assert.ok(runtime.unavailableEvidence.length > 0);
  for (const entry of runtime.unavailableEvidence) {
    assert.equal(entry.reason, "no_demo_values");
  }
});

// 13. Property segments do not receive invented demo values
test("Shopping Centre, Retail Park and Outlet Centre scenes have no invented demo evidence", () => {
  for (const segmentId of ["shopping-centre", "retail-park", "outlet-centre"]) {
    const segment = segmentDefinitions.find((s) => s.id === segmentId);
    for (const scene of segment.scenes) {
      const evidence = getEvidenceForScene(segmentId, scene.id);
      assert.equal(evidence.length, 0, `${scene.id} should have no invented demo evidence`);

      const runtime = getSceneEvidenceRuntime(segmentId, scene.id);
      assert.equal(runtime.availableEvidence.length, 0);
      assert.equal(runtime.illustrativeFlag, false);
    }
  }
});

// 14. Evidence type distinctions remain intact
test("Evidence type distinctions (measured/connected/derived) remain intact", () => {
  const measured = getMeasuredEvidenceForScene("retail", "retail-store-visits");
  const connected = getConnectedEvidenceForScene("retail", "retail-store-visits");
  const derived = getDerivedEvidenceForScene("retail", "retail-store-visits");

  assert.ok(measured.every((e) => e.evidenceType === "measured"));
  assert.ok(connected.every((e) => e.evidenceType === "connected"));
  assert.ok(derived.every((e) => e.evidenceType === "derived"));

  const measuredIds = new Set(measured.map((e) => e.id));
  const connectedIds = new Set(connected.map((e) => e.id));
  const derivedIds = new Set(derived.map((e) => e.id));
  for (const id of measuredIds) {
    assert.ok(!connectedIds.has(id) && !derivedIds.has(id));
  }
});

// 15. Data role distinctions remain intact
test("Data role distinctions (physical/mobile_geo/business/insight) remain intact", () => {
  const roleById = new Map(evidenceCatalog.map((e) => [e.id, e.dataRole]));
  assert.equal(roleById.get("ev-retail-store-visits"), "physical");
  assert.equal(roleById.get("ev-retail-passing-audience"), "physical");
  assert.equal(roleById.get("ev-retail-transactions"), "business");
  assert.equal(roleById.get("ev-retail-capture-rate"), "insight");
  assert.equal(roleById.get("ev-retail-conversion-rate"), "insight");
});

// 16. Existing 45 scene definitions remain valid
test("Existing 45-scene coverage remains untouched by the evidence runtime", () => {
  const matrixScenes = allScenes.filter((s) => s.segment !== "qsr");
  assert.equal(matrixScenes.length, 45);
  assert.equal(new Set(matrixScenes.map((s) => s.id)).size, 45);
});

test("getSceneEvidenceRuntime builds a complete presentation contract for Conversion & sales context", () => {
  const runtime = getSceneEvidenceRuntime("retail", "retail-conversion-sales-context");

  assert.equal(runtime.scene.id, "retail-conversion-sales-context");
  assert.equal(runtime.scene.segment, "retail");
  assert.ok(runtime.availableEvidence.length > 0);
  assert.ok(runtime.measuredEvidence.every((e) => e.evidenceType === "measured"));
  assert.ok(runtime.connectedEvidence.every((e) => e.evidenceType === "connected"));
  assert.ok(runtime.derivedEvidence.every((e) => e.evidenceType === "derived"));
  assert.ok(runtime.periodMetadata);
  assert.equal(typeof runtime.periodMetadata.period, "string");
  assert.equal(typeof runtime.periodMetadata.areaDefinition, "string");
});

test("getEvidenceMetadata exposes numerator/denominator definitions only for derived KPIs", () => {
  const captureMetadata = getEvidenceMetadata("ev-retail-capture-rate");
  assert.ok(captureMetadata);
  assert.equal(typeof captureMetadata.numeratorDefinition, "string");
  assert.equal(typeof captureMetadata.denominatorDefinition, "string");
  assert.equal(captureMetadata.compatibleSourceRequired, true);

  const visitsMetadata = getEvidenceMetadata("ev-retail-store-visits");
  assert.ok(visitsMetadata);
  assert.equal(visitsMetadata.numeratorDefinition, undefined);
  assert.equal(visitsMetadata.denominatorDefinition, undefined);

  assert.equal(getEvidenceMetadata("ev-does-not-exist"), null);
});

test("getAvailableEvidenceForScene respects the active lens set", () => {
  const allLenses = getAvailableEvidenceForScene("retail", "retail-conversion-sales-context", dataRoles);
  const businessDisabled = getAvailableEvidenceForScene(
    "retail",
    "retail-conversion-sales-context",
    dataRoles.filter((role) => role !== "business"),
  );

  assert.ok(businessDisabled.length < allLenses.length);
  assert.ok(businessDisabled.every((e) => e.dataRole !== "business"));
});

test("Decision-only scene evidence entries are not reported as missing demo evidence", () => {
  // Scenes without approved values should only report measured/connected/derived
  // gaps, never their decision-prompt entries.
  const runtime = getSceneEvidenceRuntime("retail", "retail-zone-engagement");
  for (const entry of runtime.unavailableEvidence) {
    assert.ok(!entry.id.includes("::decision::"));
  }
});
