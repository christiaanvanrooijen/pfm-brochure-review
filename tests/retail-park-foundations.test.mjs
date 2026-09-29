import assert from "node:assert/strict";
import test from "node:test";

import { getSegment } from "../app/content/runtime.ts";
import { technologyCapabilities, technologyImplementations } from "../app/content/technology.ts";
import { visualAssets } from "../app/content/index.ts";
import {
  vehicleEvidenceSemantics,
  getVehicleEvidenceSemantic,
  resolvesAsPeopleEvidence,
  vehicleUnitAvailable,
  validateVehicleSemantics,
} from "../app/content/vehicle-semantics.ts";

const SEGMENT = "retail-park";
const segment = () => getSegment(SEGMENT);
const sceneById = (id) => segment().scenes.find((scene) => scene.id === id);
const inputsOf = (scene) =>
  new Set(
    scene.derivedDependencies.flatMap((dependency) => [
      ...dependency.requiredInputIds,
      ...(dependency.alternativeInputGroups ?? []).flat(),
    ]),
  );

/* ------------------------------------------- capability / evidence alignment */

test("1. every declared capability is one the scene's evidence actually needs", () => {
  // The correction this gate made: TECH-04 is spatial movement intelligence, and
  // no Retail Park scene declares a trajectory input. A retail park is a set of
  // separate buildings across a car park — it is measured at unit thresholds and
  // by matching between them, not by tracking someone across the tarmac.
  assert.deepEqual(sceneById("retail-park-unit-visits").technologyCapabilityIds, ["TECH-02"]);
  assert.deepEqual(sceneById("retail-park-cross-visitation").technologyCapabilityIds, ["TECH-05"]);
  assert.deepEqual(sceneById("retail-park-time-on-site").technologyCapabilityIds, [
    "TECH-05",
    "TECH-06",
  ]);
  assert.deepEqual(sceneById("retail-park-unit-category-exposure").technologyCapabilityIds, [
    "TECH-02",
  ]);
});

test("2. no Retail Park scene declares TECH-04, and none declares a trajectory input", () => {
  for (const scene of segment().scenes) {
    assert.ok(
      !scene.technologyCapabilityIds.includes("TECH-04"),
      `${scene.id} declares TECH-04 without a trajectory input to justify it`,
    );
    for (const input of inputsOf(scene)) {
      assert.ok(
        !["spatial_trajectories", "spatial_definitions"].includes(input),
        `${scene.id} requires ${input}; TECH-04 would then be justified and this test must be revisited`,
      );
    }
  }
  // And the capability's own scene list follows, because it is derived.
  const tech04 = technologyCapabilities.find((capability) => capability.id === "TECH-04");
  assert.equal(tech04.supportedSceneIds.filter((id) => id.startsWith("retail-park")).length, 0);
});

test("3. the visual registry declares no capability its scenes do not", () => {
  const byScene = new Map(segment().scenes.map((s) => [s.id, new Set(s.technologyCapabilityIds)]));
  for (const visual of visualAssets.filter((v) => v.segment === SEGMENT)) {
    const union = new Set(visual.sceneIds.flatMap((id) => [...(byScene.get(id) ?? [])]));
    for (const capabilityId of visual.capabilityIds) {
      assert.ok(union.has(capabilityId), `${visual.id} claims ${capabilityId}, no scene declares it`);
    }
  }
});

/* ------------------------------------------------------ ANPR / plate boundary */

test("4. no Core scene requests licence-plate events", () => {
  for (const sceneId of segment().coreRoute) {
    const inputs = inputsOf(sceneById(sceneId));
    assert.ok(!inputs.has("licence_plate_events"), `${sceneId} requests plate events in Core`);
    assert.ok(!inputs.has("lawful_origin_source"), `${sceneId} requests a lawful origin source in Core`);
  }
});

test("5. vehicle origin stays an advanced branch, and is the only plate consumer", () => {
  const origin = sceneById("retail-park-vehicle-origin");
  assert.equal(origin.priority, "advanced");
  assert.ok(segment().advancedBranches.includes(origin.id));
  assert.ok(!segment().coreRoute.includes(origin.id));

  const inputs = inputsOf(origin);
  assert.ok(inputs.has("licence_plate_events"));
  assert.ok(inputs.has("lawful_origin_source"));

  // Every scene that touches plate data anywhere in the segment is this one.
  const consumers = segment().scenes.filter((s) => inputsOf(s).has("licence_plate_events"));
  assert.deepEqual(consumers.map((s) => s.id), ["retail-park-vehicle-origin"]);

  // Lawful-and-configured framing is already in the typed evidence.
  const measured = origin.evidence.find((e) => e.type === "measured");
  assert.match(measured.description, /only where lawful and configured/i);
});

test("6. ANPR is never promoted, and its limits are stated", () => {
  const tattile = technologyImplementations.find((i) => i.id === "impl-tattile-anpr-vehicle");
  assert.equal(tattile.privacyStatus, "requires_product_validation");
  const unsupported = tattile.unsupportedClaims.join(" | ");
  assert.match(unsupported, /one vehicle is never one visitor/i);
  assert.match(unsupported, /a licence plate is anonymous/i);
  assert.match(unsupported, /not visitor home origin|registration origin as visitor home origin/i);

  // No Core scene resolves an implementation that reads plates.
  const plateImpls = new Set(["impl-tattile-anpr-vehicle", "impl-lawful-anpr-lpr"]);
  for (const sceneId of segment().coreRoute) {
    for (const capabilityId of sceneById(sceneId).technologyCapabilityIds) {
      const capability = technologyCapabilities.find((c) => c.id === capabilityId);
      const plateOnly = capability.implementationIds.every((id) => plateImpls.has(id));
      assert.ok(!plateOnly, `${sceneId} resolves only plate-reading implementations`);
    }
  }
});

/* --------------------------------------------------------- vehicle semantics */

test("7. a vehicle is never a visitor", () => {
  assert.deepEqual(validateVehicleSemantics(), []);
  for (const semantic of vehicleEvidenceSemantics) {
    assert.equal(resolvesAsPeopleEvidence(semantic.unit), false);
  }
  const count = getVehicleEvidenceSemantic("vehicle_count");
  assert.match(count.isNot.join(" | "), /number of people/i);
  assert.match(count.isNot.join(" | "), /visitors or visits/i);
  assert.match(count.isNot.join(" | "), /footfall/i);
});

test("8. count is not dwell, and dwell needs matching", () => {
  // A bare vehicle count cannot produce a duration.
  assert.equal(vehicleUnitAvailable("vehicle_dwell", ["vehicle_events"]), false);
  assert.equal(vehicleUnitAvailable("vehicle_visit", ["vehicle_events"]), false);
  assert.equal(
    vehicleUnitAvailable("vehicle_dwell", ["vehicle_events", "trip_duration_events"]),
    true,
  );
  assert.match(getVehicleEvidenceSemantic("vehicle_dwell").isNot.join(" | "), /from a vehicle count alone/i);
});

test("9. arrival counting and parking occupancy are different measurements", () => {
  const arrival = sceneById("retail-park-vehicle-arrival");
  const parking = sceneById("retail-park-parking-occupancy");

  assert.deepEqual([...inputsOf(arrival)], ["vehicle_events"]);
  assert.deepEqual([...inputsOf(parking)].sort(), ["parking_capacity", "parking_events"]);

  // Occupancy needs a denominator; arrival counting does not have one.
  assert.ok(inputsOf(parking).has("parking_capacity"));
  assert.ok(!inputsOf(arrival).has("parking_capacity"));

  // And the implementations say so themselves.
  const arrivalMethod = technologyImplementations.find((i) => i.id === "impl-vehicle-arrival-method");
  const parkingMethod = technologyImplementations.find((i) => i.id === "impl-parking-occupancy-method");
  assert.match(arrivalMethod.unsupportedClaims.join(" "), /suitability for occupancy/i);
  assert.match(parkingMethod.unsupportedClaims.join(" "), /interchangeability with arrival counting/i);
});

test("10. registration origin is not a home location or a catchment substitute", () => {
  const origin = getVehicleEvidenceSemantic("registration_origin");
  const isNot = origin.isNot.join(" | ");
  assert.match(isNot, /Where a person lives/i);
  assert.match(isNot, /home location/i);
  assert.match(isNot, /substitute for catchment/i);
  assert.match(isNot, /a licence plate identifies a vehicle/i);
  assert.equal(origin.derivation, "classified_context");
});

test("11. vehicle duration is not human time in the park", () => {
  const timeOnSite = sceneById("retail-park-time-on-site");
  const derived = timeOnSite.evidence.find((e) => e.type === "derived");
  assert.match(derived.description, /vehicle duration is not people duration/i);
  assert.match(getVehicleEvidenceSemantic("vehicle_dwell").isNot.join(" | "), /Time a person spent inside/i);
});

/* -------------------------------------------------- neighbouring segments --- */

test("12. Retail and Shopping Centre capability declarations are untouched", () => {
  const retail = getSegment("retail");
  const centre = getSegment("shopping-centre");

  // Both still use TECH-04, and still declare the trajectory inputs that justify it.
  assert.deepEqual(
    retail.scenes.find((s) => s.id === "retail-in-store-journey").technologyCapabilityIds,
    ["TECH-04"],
  );
  assert.deepEqual(
    centre.scenes.find((s) => s.id === "shopping-centre-internal-circulation").technologyCapabilityIds,
    ["TECH-04"],
  );
  const tech04 = technologyCapabilities.find((c) => c.id === "TECH-04");
  assert.ok(tech04.supportedSceneIds.some((id) => id.startsWith("retail-")));
  assert.ok(tech04.supportedSceneIds.some((id) => id.startsWith("shopping-centre-")));
});
