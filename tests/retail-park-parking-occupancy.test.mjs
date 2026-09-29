import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getSceneForSegment } from "../app/content/runtime.ts";
import { technologyImplementations } from "../app/content/technology.ts";
import {
  getVehicleEvidenceSemantic,
  resolvesAsPeopleEvidence,
  vehicleUnitAvailable,
} from "../app/content/vehicle-semantics.ts";
import { getProofRuntimeForScene } from "../app/content/proof-runtime.ts";

const repoFile = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repoFile(p), "utf8");
const SEGMENT = "retail-park";
const SCENE = "retail-park-parking-occupancy";
const COMPONENT = "app/components/RetailParkParkingOccupancyScene.tsx";
const HERO = "public/assets/location-visuals/retail-park/retail-park-parking-occupancy-hero.png";

const code = () =>
  read(COMPONENT)
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
const flat = () => code().replace(/\s+/g, " ");

test("the typed question, supporting line and handoff are unchanged", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.commercialQuestion, "How much parking capacity is used and where?");
  assert.equal(scene.supportingLine, "Improve parking operations and peak-day planning");
  assert.equal(scene.journeyStage, "measure");
  assert.equal(scene.corePathOrder, 3);
  assert.equal(scene.nextCta, "See unit visits");
  assert.equal(scene.nextSceneId, "retail-park-unit-visits");
  assert.equal(getSegment(SEGMENT).coreRoute[2], SCENE);
});

test("TECH-06 only, and all three lenses are required", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.technologyCapabilityIds, ["TECH-06"]);
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-04"));
  // Business is required here, not optional: without capacity there is no rate.
  assert.deepEqual(scene.dataRequirements.required, ["physical", "business", "insight"]);
  assert.deepEqual(scene.dataRequirements.optional, []);
});

test("occupancy needs a denominator, and arrival counting cannot supply one", () => {
  const parking = getSceneForSegment(SEGMENT, SCENE);
  const parkingInputs = new Set(parking.derivedDependencies.flatMap((d) => d.requiredInputIds));
  assert.deepEqual([...parkingInputs].sort(), ["parking_capacity", "parking_events"]);

  const arrival = getSceneForSegment(SEGMENT, "retail-park-vehicle-arrival");
  const arrivalInputs = new Set(arrival.derivedDependencies.flatMap((d) => d.requiredInputIds));
  assert.deepEqual([...arrivalInputs], ["vehicle_events"]);

  // Neither scene can stand in for the other, and the model says so itself.
  assert.ok(!parkingInputs.has("vehicle_events"));
  const arrivalMethod = technologyImplementations.find((i) => i.id === "impl-vehicle-arrival-method");
  const parkingMethod = technologyImplementations.find((i) => i.id === "impl-parking-occupancy-method");
  assert.match(arrivalMethod.unsupportedClaims.join(" "), /suitability for occupancy/i);
  assert.match(parkingMethod.unsupportedClaims.join(" "), /interchangeability with arrival counting/i);

  assert.match(flat(), /not the number of vehicles that arrived/i);
});

test("occupancy is not dwell and not a people count", () => {
  assert.equal(vehicleUnitAvailable("vehicle_dwell", ["parking_events"]), false);
  assert.equal(resolvesAsPeopleEvidence("vehicle_count"), false);
  assert.match(getVehicleEvidenceSemantic("vehicle_dwell").isNot.join(" | "), /vehicle count alone/i);

  assert.match(flat(), /not how long any of them stayed/i);
  assert.match(flat(), /one occupied bay is one vehicle/i);
  assert.match(flat(), /not a count of people/i);
});

test("no ANPR, plate or origin reaches this Core scene", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const inputs = new Set(scene.derivedDependencies.flatMap((d) => d.requiredInputIds));
  assert.ok(!inputs.has("licence_plate_events"));
  assert.ok(!inputs.has("lawful_origin_source"));

  // Alt text lifted out: it says no plate is visible, which is a denial.
  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\bANPR\b/i, /\bLPR\b/i, /\blicence plates?\b/i, /\bnumber plates?\b/i,
    /\bregistrations?\b/i, /\bTattile\b/i, /\bplate recognition\b/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `must not mention ${forbidden}`);
  }

  const alt = read(COMPONENT).match(/\balt="([^"]*)"/)[1];
  assert.match(alt, /No vehicle is boxed, labelled or has its plate read/i);
  assert.match(alt, /no person is marked/i);
});

test("the hero is this segment's own, and states no figure", () => {
  const source = code();
  assert.match(
    source,
    /src="\/assets\/location-visuals\/retail-park\/retail-park-parking-occupancy-hero\.png"/,
  );
  for (const other of ["shopping-centre", "outlet-centre", "location-visuals/retail/"]) {
    assert.ok(!source.includes(other), `must not reference ${other}`);
  }
  // Every Retail Park Core scene built so far uses its own plate. The audit
  // found four files sharing one base render, and adjacent scenes drawn from
  // that set would have read as the same photograph twice.
  const heroes = ["RetailParkCatchmentScene", "RetailParkVehicleArrivalScene", "RetailParkParkingOccupancyScene"]
    .map((name) => read(`app/components/${name}.tsx`).match(/retail-park-[a-z-]+-hero\.png/)[0]);
  assert.equal(new Set(heroes).size, heroes.length, `two scenes share a hero: ${heroes.join(", ")}`);
  assert.ok(!heroes.includes("retail-park-visitors-hero.png"), "the shared base render is not used");

  const rendered = source.slice(source.indexOf("return ("));
  const copy = rendered.replace(/<[^>]*>/g, " ").replace(/\s*(?:[<>]=?|={2,3}|!==?)\s*\d+/g, " ");
  assert.doesNotMatch(copy, /\b\d+\b/, "no figure may be stated");
  assert.doesNotMatch(copy, /\d+\s*%/, "no percentage may be stated");
});

test("the hero asset must exist before this scene can be reviewed", () => {
  // Deliberately a hard assertion rather than a skip. The scene is complete in
  // every other respect; what is missing is a purpose-built plate that this
  // session cannot generate, and a green suite must not imply otherwise.
  assert.ok(
    existsSync(repoFile(HERO)),
    `${HERO} does not exist yet — the Parking occupancy hero has not been produced`,
  );
});

test("placeholder proof is never offered as approved external proof", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.proofAssetIds, ["CASE-RP-02"]);
  assert.equal(getProofRuntimeForScene(SEGMENT, SCENE)?.hasExternalProof ?? false, false);
  assert.match(code(), /No approved external proof yet/);
});

test("the earlier locked scenes and frozen segments are untouched", () => {
  assert.equal(
    getSceneForSegment(SEGMENT, "retail-park-catchment-area").commercialQuestion,
    "Where do park visitors come from, and what demand sits around the asset?",
  );
  assert.equal(
    getSceneForSegment(SEGMENT, "retail-park-vehicle-arrival").commercialQuestion,
    "How many vehicles arrive, and when?",
  );
  assert.equal(getSegment("retail").implementationStatus, "implementation_ready");
  assert.equal(getSegment(SEGMENT).implementationStatus, "architecture_only");

  const shell = read("app/components/CommercialExperience.tsx");
  assert.ok(!shell.includes("RetailParkParkingOccupancyScene"));
});

test("the preview route is production-guarded", () => {
  const page = read("app/preview/retail-park-parking-occupancy/page.tsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});
