import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getSceneForSegment } from "../app/content/runtime.ts";
import {
  getVehicleEvidenceSemantic,
  resolvesAsPeopleEvidence,
  vehicleUnitAvailable,
} from "../app/content/vehicle-semantics.ts";
import { getProofRuntimeForScene } from "../app/content/proof-runtime.ts";

const read = (p) => readFileSync(fileURLToPath(new URL(`../${p}`, import.meta.url)), "utf8");
const SEGMENT = "retail-park";
const SCENE = "retail-park-vehicle-arrival";
const COMPONENT = "app/components/RetailParkVehicleArrivalScene.tsx";

/* Comments stripped: the component documents at length the things it must not
   do — ANPR, plates, occupancy, dwell — and that documentation is not a use. */
const code = () =>
  read(COMPONENT)
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
const flat = () => code().replace(/\s+/g, " ");

test("1/2/10/11. the typed question, supporting line and handoff are unchanged", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.commercialQuestion, "How many vehicles arrive, and when?");
  assert.equal(scene.supportingLine, "Manage access, peaks and operating requirements");
  assert.equal(scene.journeyStage, "measure");
  assert.equal(scene.corePathOrder, 2);
  assert.equal(scene.nextCta, "Explore parking");
  assert.equal(scene.nextSceneId, "retail-park-parking-occupancy");
  assert.equal(getSegment(SEGMENT).coreRoute[1], SCENE);
});

test("3/4. the scene declares TECH-06 and nothing else", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.technologyCapabilityIds, ["TECH-06"]);
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-04"));
  assert.deepEqual(scene.dataRequirements.required, ["physical", "insight"]);
  assert.deepEqual(scene.dataRequirements.optional, ["business"]);
});

test("5/6. no ANPR, no plate, no origin reaches this Core scene", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const inputs = new Set(
    scene.derivedDependencies.flatMap((d) => [
      ...d.requiredInputIds,
      ...(d.alternativeInputGroups ?? []).flat(),
    ]),
  );
  assert.deepEqual([...inputs], ["vehicle_events"]);
  assert.ok(!inputs.has("licence_plate_events"));
  assert.ok(!inputs.has("lawful_origin_source"));

  // Two exclusions, both deliberate. Word-boundary matched rather than
   // substring, because "lpr" sits inside "externalProof". And the alt text is
   // lifted out first: its job is to say that no plate is visible in the
   // photograph, so banning the word there would fail on the denial itself.
  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\bANPR\b/i, /\bLPR\b/i, /\blicence plates?\b/i, /\blicense plates?\b/i,
    /\bnumber plates?\b/i, /\bregistrations?\b/i, /\bTattile\b/i,
    /\bplate recognition\b/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `component must not mention ${forbidden}`);
  }
});

test("6b. the alt text says the plate is absent, rather than staying silent", () => {
  const alt = read(COMPONENT).match(/\balt="([^"]*)"/)[1];
  assert.match(alt, /No vehicle is boxed, labelled or has its plate read/i);
  assert.match(alt, /no person is marked/i);
  // The purpose-built plate shows the configured access point itself.
  assert.match(alt, /configured access point/i);
  // It describes a photograph, so it may name what is absent — but it must not
  // describe anything being read from a vehicle.
  for (const forbidden of [/\bANPR\b/i, /\brecognis/i, /\bidentif/i, /\bTattile\b/i]) {
    assert.doesNotMatch(alt, forbidden);
  }
});

test("7. a vehicle arrival never resolves as people evidence", () => {
  assert.equal(resolvesAsPeopleEvidence("vehicle_count"), false);
  const count = getVehicleEvidenceSemantic("vehicle_count");
  assert.match(count.isNot.join(" | "), /number of people/i);

  // And the scene says so where a reader will see it.
  assert.match(flat(), /a vehicle is not a visitor/i);
  assert.match(flat(), /do not tell us how many people arrived/i);
});

test("8. a vehicle count does not imply parking occupancy", () => {
  // Occupancy needs a capacity denominator this scene does not have.
  const parking = getSceneForSegment(SEGMENT, "retail-park-parking-occupancy");
  const parkingInputs = new Set(parking.derivedDependencies.flatMap((d) => d.requiredInputIds));
  assert.ok(parkingInputs.has("parking_capacity"));

  const arrival = getSceneForSegment(SEGMENT, SCENE);
  const arrivalInputs = new Set(arrival.derivedDependencies.flatMap((d) => d.requiredInputIds));
  assert.ok(!arrivalInputs.has("parking_capacity"));
  assert.ok(!arrivalInputs.has("parking_events"));

  assert.match(flat(), /how full the car park is/i);
});

test("9. a vehicle count does not imply dwell", () => {
  assert.equal(vehicleUnitAvailable("vehicle_dwell", ["vehicle_events"]), false);
  assert.match(getVehicleEvidenceSemantic("vehicle_dwell").isNot.join(" | "), /vehicle count alone/i);
  assert.match(flat(), /a count is not a duration/i);
  assert.match(flat(), /how long anyone stayed/i);
});

test("the scene states no figure, and borrows no other segment's media", () => {
  const source = code();
  assert.match(
    source,
    /src="\/assets\/location-visuals\/retail-park\/retail-park-vehicle-arrival-hero\.png"/,
  );
  for (const other of ["shopping-centre", "outlet-centre", "location-visuals/retail/"]) {
    assert.ok(!source.includes(other), `must not reference ${other}`);
  }
  // No approved values exist for this segment.
  const rendered = source.slice(source.indexOf("return ("));
  const copy = rendered.replace(/<[^>]*>/g, " ").replace(/\s*(?:[<>]=?|={2,3}|!==?)\s*\d+/g, " ");
  assert.doesNotMatch(copy, /\b\d+\b/, "no figure may be stated");
});

test("placeholder proof is never offered as approved external proof", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.proofAssetIds, ["CASE-RP-02"]);
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);
  assert.equal(proof?.hasExternalProof ?? false, false);
  assert.match(code(), /No approved external proof yet/);
});

test("12/13/14. Catchment, Retail and Shopping Centre are untouched", () => {
  assert.equal(
    getSceneForSegment(SEGMENT, "retail-park-catchment-area").commercialQuestion,
    "Where do park visitors come from, and what demand sits around the asset?",
  );
  assert.deepEqual(
    getSceneForSegment(SEGMENT, "retail-park-catchment-area").technologyCapabilityIds,
    ["TECH-07"],
  );
  assert.equal(getSegment("retail").implementationStatus, "implementation_ready");
  assert.equal(
    getSceneForSegment("shopping-centre", "shopping-centre-entrances").commercialQuestion,
    "How many visitors enter the asset, through which entrances and when?",
  );

  // The shell still does not run Retail Park.
  const shell = read("app/components/CommercialExperience.tsx");
  assert.ok(!shell.includes("RetailParkVehicleArrivalScene"));
  assert.equal(getSegment(SEGMENT).implementationStatus, "architecture_only");
});

test("the preview route is production-guarded", () => {
  const page = read("app/preview/retail-park-vehicle-arrival/page.tsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});
