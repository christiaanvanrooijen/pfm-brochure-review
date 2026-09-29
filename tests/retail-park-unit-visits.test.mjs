import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getSceneForSegment } from "../app/content/runtime.ts";
import { getProofRuntimeForScene } from "../app/content/proof-runtime.ts";

const repoFile = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repoFile(p), "utf8");
const SEGMENT = "retail-park";
const SCENE = "retail-park-unit-visits";
const COMPONENT = "app/components/RetailParkUnitVisitsScene.tsx";
const HERO = "public/assets/location-visuals/retail-park/retail-park-brand-counting-hero.png";

/* Comments stripped: the component documents the concepts it deliberately keeps
   out — trajectories, vehicles, transactions — and that is not a use of them. */
const code = () =>
  read(COMPONENT)
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
const flat = () => code().replace(/\s+/g, " ");

test("scene presence and position in the locked Core route", () => {
  const segment = getSegment(SEGMENT);
  assert.deepEqual([...segment.coreRoute], [
    "retail-park-catchment-area",
    "retail-park-vehicle-arrival",
    "retail-park-parking-occupancy",
    "retail-park-unit-visits",
    "retail-park-cross-visitation",
    "retail-park-time-on-site",
    "retail-park-unit-category-exposure",
  ]);
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.corePathOrder, 4);
  assert.equal(scene.journeyStage, "measure");
  assert.ok(existsSync(repoFile(COMPONENT)));
  assert.ok(existsSync(repoFile("app/preview/retail-park-unit-visits/page.tsx")));
});

test("typed question, supporting line, CTA and nextSceneId are unchanged", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.commercialQuestion, "Which units are visited, and when?");
  assert.equal(scene.supportingLine, "Understand unit exposure and operating patterns");
  assert.equal(scene.nextCta, "Follow cross-visitation");
  assert.equal(scene.nextSceneId, "retail-park-cross-visitation");
  // The CTA and the handoff come from typed content, not from the component.
  assert.match(code(), /\{scene\.nextCta\}/);
  assert.match(code(), /\{scene\.supportingLine\}/);
  assert.match(code(), /\{scene\.commercialQuestion\}/);
});

test("TECH-02 only — no TECH-04, no trajectories", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.technologyCapabilityIds, ["TECH-02"]);
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-04"));
  assert.deepEqual(scene.dataRequirements.required, ["physical", "business", "insight"]);

  const inputs = new Set(
    scene.derivedDependencies.flatMap((d) => [
      ...d.requiredInputIds,
      ...(d.alternativeInputGroups ?? []).flat(),
    ]),
  );
  assert.deepEqual([...inputs].sort(), ["unit_events", "unit_mapping"]);
  for (const forbidden of ["spatial_trajectories", "spatial_definitions", "vehicle_events", "parking_events", "licence_plate_events", "trip_duration_events"]) {
    assert.ok(!inputs.has(forbidden), `${SCENE} must not require ${forbidden}`);
  }
});

test("the hero is this segment's own, and semantically the unit threshold", () => {
  assert.ok(existsSync(repoFile(HERO)), "the unit-visits hero must exist");
  assert.match(
    code(),
    /src="\/assets\/location-visuals\/retail-park\/retail-park-brand-counting-hero\.png"/,
  );
  for (const other of ["shopping-centre", "outlet-centre", "location-visuals/retail/"]) {
    assert.ok(!code().includes(other), `must not reference ${other}`);
  }

  // Every Retail Park scene built so far uses a different plate.
  const heroes = [
    "RetailParkCatchmentScene",
    "RetailParkVehicleArrivalScene",
    "RetailParkParkingOccupancyScene",
    "RetailParkUnitVisitsScene",
  ].map((n) => read(`app/components/${n}.tsx`).match(/retail-park-[a-z-]+-hero\.png/)[0]);
  assert.equal(new Set(heroes).size, heroes.length, `two scenes share a hero: ${heroes}`);
});

test("truth boundary: a visit is a crossing, not trade, identity, a vehicle or a duration", () => {
  const f = flat();
  assert.match(f, /A unit visit is an entry detected at a configured unit boundary/);
  assert.match(f, /not a sale or a transaction/i);
  assert.match(f, /not a unique person/i);
  assert.match(f, /not a vehicle/i);
  assert.match(f, /not how long anyone stayed/i);
  // Partial coverage is stated, so an uncovered unit is not read as a quiet one.
  assert.match(f, /absent from the reading rather than quiet/i);
});

test("no vehicle, plate, origin or dwell concept leaks into this scene", () => {
  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\bANPR\b/i, /\bLPR\b/i, /\blicence plates?\b/i, /\bnumber plates?\b/i,
    /\bregistrations?\b/i, /\bTattile\b/i, /\borigin\b/i, /\bLiDAR\b/i,
    /\btrajector/i, /\bdwell\b/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `must not mention ${forbidden}`);
  }
  // The alt text says what the picture does not show, which is a denial.
  const alt = read(COMPONENT).match(/\balt="([^"]*)"/)[1];
  assert.match(alt, /No unit is ranked or labelled with a figure/i);
  assert.match(alt, /no face is marked/i);
  assert.match(alt, /nothing is drawn between one unit and another/i);
});

test("nothing is ranked, scored or given a figure", () => {
  const source = code();
  for (const forbidden of [/\brank(?:ed|ing)?\b/i, /\bscore[ds]?\b/i, /\bbest\b/i, /\btop performing\b/i, /\bunderperform/i, /\bconversion\b/i]) {
    assert.doesNotMatch(source.replace(/\balt="[^"]*"/g, " "), forbidden, `must not say ${forbidden}`);
  }
  const rendered = source.slice(source.indexOf("return ("));
  const copy = rendered.replace(/<[^>]*>/g, " ").replace(/\s*(?:[<>]=?|={2,3}|!==?)\s*\d+/g, " ");
  assert.doesNotMatch(copy, /\b\d+\b/, "no figure may be stated");
  assert.doesNotMatch(copy, /\d+\s*%/, "no percentage may be stated");
});

test("placeholder proof is never offered as approved external proof", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.proofAssetIds, ["CASE-RP-02"]);
  assert.equal(getProofRuntimeForScene(SEGMENT, SCENE)?.hasExternalProof ?? false, false);
  assert.match(code(), /No approved external proof yet/);
});

test("earlier locked scenes and frozen segments are untouched", () => {
  for (const [id, question] of [
    ["retail-park-catchment-area", "Where do park visitors come from, and what demand sits around the asset?"],
    ["retail-park-vehicle-arrival", "How many vehicles arrive, and when?"],
    ["retail-park-parking-occupancy", "How much parking capacity is used and where?"],
  ]) {
    assert.equal(getSceneForSegment(SEGMENT, id).commercialQuestion, question);
  }
  assert.equal(getSegment("retail").implementationStatus, "implementation_ready");
  assert.equal(getSegment("shopping-centre").implementationStatus, "architecture_only");
  assert.equal(getSegment(SEGMENT).implementationStatus, "architecture_only");

  // Configure and Act stay synthesis stages with no scenes and no fake ids.
  const segment = getSegment(SEGMENT);
  assert.deepEqual(segment.stageMapping.configure, []);
  assert.deepEqual(segment.stageMapping.act, []);
  assert.deepEqual(segment.stageMapping.prove, []);

  // Not exposed in production.
  const shell = read("app/components/CommercialExperience.tsx");
  assert.ok(!shell.includes("RetailParkUnitVisitsScene"));
  const page = read("app/preview/retail-park-unit-visits/page.tsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});
