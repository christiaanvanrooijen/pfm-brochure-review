import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getSceneForSegment } from "../app/content/runtime.ts";
import { visualAssets } from "../app/content/index.ts";
import { getProofRuntimeForScene } from "../app/content/proof-runtime.ts";
import {
  vehicleEvidenceSemantics,
  resolvesAsPeopleEvidence,
  vehicleUnitAvailable,
} from "../app/content/vehicle-semantics.ts";

const repoFile = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repoFile(p), "utf8");
const SEGMENT = "retail-park";
const SCENE = "retail-park-time-on-site";
const COMPONENT = "app/components/RetailParkTimeOnSiteScene.tsx";
const HERO = "public/assets/location-visuals/retail-park/retail-park-time-in-centre-hero.png";

const code = () =>
  read(COMPONENT)
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
const flat = () => code().replace(/\s+/g, " ");

test("scene presence and position in the locked Core route", () => {
  assert.deepEqual([...getSegment(SEGMENT).coreRoute], [
    "retail-park-catchment-area",
    "retail-park-vehicle-arrival",
    "retail-park-parking-occupancy",
    "retail-park-unit-visits",
    "retail-park-cross-visitation",
    "retail-park-time-on-site",
    "retail-park-unit-category-exposure",
  ]);
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.corePathOrder, 6);
  assert.equal(scene.journeyStage, "understand");
  assert.ok(existsSync(repoFile(COMPONENT)));
  assert.ok(existsSync(repoFile("app/preview/retail-park-time-on-site/page.tsx")));
});

test("typed question, supporting line, CTA and nextSceneId are unchanged", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.commercialQuestion, "How long do visitors spend in the retail park?");
  assert.equal(scene.supportingLine, "Compare quick missions with deeper multi-unit visits");
  assert.equal(scene.nextCta, "Explore unit exposure");
  assert.equal(scene.nextSceneId, "retail-park-unit-category-exposure");
  for (const binding of [/\{scene\.nextCta\}/, /\{scene\.supportingLine\}/, /\{scene\.commercialQuestion\}/]) {
    assert.match(code(), binding);
  }
});

test("exact capability mapping and evidence inputs come from the typed model", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  // The one scene in this segment that legitimately spans both units.
  assert.deepEqual(scene.technologyCapabilityIds, ["TECH-05", "TECH-06"]);
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-04"));
  assert.deepEqual(scene.dataRequirements.required, ["physical", "insight"]);
  assert.deepEqual(scene.dataRequirements.optional, ["business"]);

  const inputs = new Set(
    scene.derivedDependencies.flatMap((d) => [
      ...d.requiredInputIds,
      ...(d.alternativeInputGroups ?? []).flat(),
    ]),
  );
  assert.deepEqual([...inputs], ["trip_duration_events"]);
  for (const forbidden of [
    "spatial_trajectories", "spatial_definitions", "licence_plate_events",
    "lawful_origin_source", "parking_capacity", "unit_mapping",
  ]) {
    assert.ok(!inputs.has(forbidden), `${SCENE} must not require ${forbidden}`);
  }
});

test("the hero resolves through the typed mapping and is this scene's own", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.visualAssetId, "VIS-RP-06");
  const mapping = visualAssets.find((v) => v.id === "VIS-RP-06");
  assert.deepEqual([...mapping.sceneIds], [SCENE]);
  assert.deepEqual([...mapping.capabilityIds].sort(), ["TECH-05", "TECH-06"]);

  assert.ok(existsSync(repoFile(HERO)));
  assert.match(
    code(),
    /src="\/assets\/location-visuals\/retail-park\/retail-park-time-in-centre-hero\.png"/,
  );
  for (const other of ["shopping-centre", "outlet-centre", "location-visuals/retail/"]) {
    assert.ok(!code().includes(other), `must not reference ${other}`);
  }

  const heroes = [
    "RetailParkCatchmentScene",
    "RetailParkVehicleArrivalScene",
    "RetailParkParkingOccupancyScene",
    "RetailParkUnitVisitsScene",
    "RetailParkCrossVisitationScene",
    "RetailParkTimeOnSiteScene",
  ].map((n) => read(`app/components/${n}.tsx`).match(/retail-park-[a-z-]+-hero\.png/)[0]);
  assert.equal(new Set(heroes).size, heroes.length, `two scenes share a hero: ${heroes}`);
});

test("truth boundary: coverage, and not identity, unique count, sales or cause", () => {
  const f = flat();
  assert.match(f, /Time on site is elapsed time inside configured coverage/);
  assert.match(f, /the unit is always named/i);
  // Time outside coverage is unknown, never zero.
  assert.match(f, /Time spent outside coverage is unknown rather than zero/i);
  assert.match(f, /not an identity/i);
  assert.match(f, /a guaranteed count of unique visitors/i);
  assert.match(f, /a purchase/i);
  assert.match(f, /a reason anyone stayed/i);
  // Vehicle duration is not people duration — from the typed derived evidence.
  const derived = getSceneForSegment(SEGMENT, SCENE).evidence.find((e) => e.type === "derived");
  assert.match(derived.description, /vehicle duration is not people duration/i);
});

test("the vehicle/visitor invariant is rendered from the typed semantics", () => {
  // vehicle count != vehicle visit != vehicle dwell != visitor visit !=
  // registration origin. The strip is BUILT from the typed content at render
  // time, so the labels are not literals in the source — asserting on source
  // text would be checking the wrong artefact. What matters is that the
  // component derives from the model and that the model still holds the chain.
  assert.match(code(), /vehicleEvidenceSemantics/);
  assert.match(code(), /"Visitor visit"/);
  assert.match(flat(), /Five different measurements/i);

  assert.deepEqual(
    vehicleEvidenceSemantics.map((semantic) => semantic.label),
    ["Vehicle count", "Vehicle visit", "Vehicle dwell", "Registration origin"],
  );
  // The people unit is placed between dwell and origin, which is where the
  // confusion actually happens.
  assert.match(code(), /unit !== "registration_origin"[\s\S]{0,400}"Visitor visit"/);

  assert.equal(resolvesAsPeopleEvidence("vehicle_dwell"), false);
  assert.equal(vehicleUnitAvailable("vehicle_dwell", ["vehicle_events"]), false);
});

test("no ANPR, plate, origin, face or LiDAR claim reaches this scene", () => {
  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\bANPR\b/i, /\bLPR\b/i, /\blicence plates?\b/i, /\bnumber plates?\b/i,
    /\bTattile\b/i, /\bfacial\b/i, /\bface recognition\b/i, /\bLiDAR\b/i,
    /\btrajector/i, /\bhome origin\b/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `must not mention ${forbidden}`);
  }
  // The one place origin may be named is the invariant strip, and it gets there
  // from the typed semantics rather than from a string in this file.
  assert.ok(
    vehicleEvidenceSemantics.some((semantic) => semantic.unit === "registration_origin"),
  );

  const alt = read(COMPONENT).match(/\balt="([^"]*)"/)[1];
  assert.match(alt, /No ring, seat or unit is labelled with a clock or a figure/i);
  assert.match(alt, /no face is marked/i);
});

test("nothing is ranked, scored or given a figure", () => {
  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\brank(?:ed|ing)?\b/i, /\bscore[ds]?\b/i, /\brecommend/i, /\bbest\b/i,
    /\bconversion\b/i, /\bintent\b/i, /\blonger visit is better\b/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `must not say ${forbidden}`);
  }
  const rendered = code().slice(code().indexOf("return ("));
  const copy = rendered.replace(/<[^>]*>/g, " ").replace(/\s*(?:[<>]=?|={2,3}|!==?)\s*\d+/g, " ");
  assert.doesNotMatch(copy, /\b\d+\s*(?:min|minutes?|hrs?|hours?)\b/i, "no duration figure");
  assert.doesNotMatch(copy, /\d+\s*%/, "no percentage may be stated");
});

test("placeholder proof is never offered as approved external proof", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.proofAssetIds, ["CASE-RP-03"]);
  assert.equal(getProofRuntimeForScene(SEGMENT, SCENE)?.hasExternalProof ?? false, false);
  assert.match(code(), /No approved external proof yet/);
});

test("earlier locked scenes, frozen segments and synthesis stages are untouched", () => {
  for (const [id, question] of [
    ["retail-park-catchment-area", "Where do park visitors come from, and what demand sits around the asset?"],
    ["retail-park-vehicle-arrival", "How many vehicles arrive, and when?"],
    ["retail-park-parking-occupancy", "How much parking capacity is used and where?"],
    ["retail-park-unit-visits", "Which units are visited, and when?"],
    ["retail-park-cross-visitation", "How do visitors move from unit to unit?"],
  ]) {
    assert.equal(getSceneForSegment(SEGMENT, id).commercialQuestion, question);
  }
  assert.equal(getSegment("retail").implementationStatus, "implementation_ready");
  assert.equal(getSegment("shopping-centre").implementationStatus, "architecture_only");

  const segment = getSegment(SEGMENT);
  assert.deepEqual(segment.stageMapping.configure, []);
  assert.deepEqual(segment.stageMapping.act, []);
  assert.deepEqual(segment.stageMapping.prove, []);
  assert.equal(segment.implementationStatus, "architecture_only");

  const shell = read("app/components/CommercialExperience.tsx");
  assert.ok(!shell.includes("RetailParkTimeOnSiteScene"));
  const page = read("app/preview/retail-park-time-on-site/page.tsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});
