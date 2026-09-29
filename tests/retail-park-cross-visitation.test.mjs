import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getSceneForSegment } from "../app/content/runtime.ts";
import { visualAssets } from "../app/content/index.ts";
import { getProofRuntimeForScene } from "../app/content/proof-runtime.ts";

const repoFile = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repoFile(p), "utf8");
const SEGMENT = "retail-park";
const SCENE = "retail-park-cross-visitation";
const COMPONENT = "app/components/RetailParkCrossVisitationScene.tsx";
const HERO = "public/assets/location-visuals/retail-park/retail-park-visitor-brand-flow-hero.png";

/* Comments stripped: the component documents what it deliberately excludes —
   trajectories, trade, identity — and documenting a boundary is not crossing it. */
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
  assert.equal(scene.corePathOrder, 5);
  assert.equal(scene.journeyStage, "understand");
  assert.ok(existsSync(repoFile(COMPONENT)));
  assert.ok(existsSync(repoFile("app/preview/retail-park-cross-visitation/page.tsx")));
});

test("typed question, supporting line, CTA and nextSceneId are unchanged", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.commercialQuestion, "How do visitors move from unit to unit?");
  assert.equal(scene.supportingLine, "Support adjacency, tenant mix, leasing context and park layout");
  assert.equal(scene.nextCta, "Understand time on site");
  assert.equal(scene.nextSceneId, "retail-park-time-on-site");
  // Bound from typed content, not restated in the component.
  for (const binding of [/\{scene\.nextCta\}/, /\{scene\.supportingLine\}/, /\{scene\.commercialQuestion\}/]) {
    assert.match(code(), binding);
  }
});

test("capability and evidence inputs come from the typed model", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.technologyCapabilityIds, ["TECH-05"]);
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-04"));
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-02"));
  assert.deepEqual(scene.dataRequirements.required, ["physical", "business", "insight"]);

  const inputs = new Set(
    scene.derivedDependencies.flatMap((d) => [
      ...d.requiredInputIds,
      ...(d.alternativeInputGroups ?? []).flat(),
    ]),
  );
  assert.deepEqual([...inputs].sort(), ["matched_visit_events", "unit_mapping"]);
  // Matching, never a followed path — and never the vehicle scenes' inputs.
  for (const forbidden of [
    "spatial_trajectories", "spatial_definitions", "vehicle_events",
    "parking_events", "parking_capacity", "licence_plate_events", "trip_duration_events",
  ]) {
    assert.ok(!inputs.has(forbidden), `${SCENE} must not require ${forbidden}`);
  }
});

test("the hero resolves through the typed mapping and is this segment's own", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.visualAssetId, "VIS-RP-02");
  const mapping = visualAssets.find((v) => v.id === "VIS-RP-02");
  assert.ok(mapping.sceneIds.includes(SCENE));
  assert.ok(mapping.capabilityIds.includes("TECH-05"));

  assert.ok(existsSync(repoFile(HERO)), "the cross-visitation hero must exist");
  assert.match(
    code(),
    /src="\/assets\/location-visuals\/retail-park\/retail-park-visitor-brand-flow-hero\.png"/,
  );
  for (const other of ["shopping-centre", "outlet-centre", "location-visuals/retail/"]) {
    assert.ok(!code().includes(other), `must not reference ${other}`);
  }

  // Five scenes, five different plates — VIS-RP-02 covers two scenes, and they
  // must still not look like the same photograph.
  const heroes = [
    "RetailParkCatchmentScene",
    "RetailParkVehicleArrivalScene",
    "RetailParkParkingOccupancyScene",
    "RetailParkUnitVisitsScene",
    "RetailParkCrossVisitationScene",
  ].map((n) => read(`app/components/${n}.tsx`).match(/retail-park-[a-z-]+-hero\.png/)[0]);
  assert.equal(new Set(heroes).size, heroes.length, `two scenes share a hero: ${heroes}`);
});

test("truth boundary: matched, not trade, identity, unique count, cause or a whole journey", () => {
  const f = flat();
  assert.match(f, /A sequence is an anonymous visit at one covered unit matched to another/);
  assert.match(f, /never a purchase between them/i);
  assert.match(f, /a recognised person/i);
  assert.match(f, /a guaranteed count of unique visitors/i);
  assert.match(f, /a reason anyone moved/i);
  assert.match(f, /An uncovered unit is a missing step, not an absent one/i);
  // And the definition line says the same thing in the presenter's register.
  assert.match(f, /never a followed path or a purchase/i);
});

test("no vehicle, plate, origin, LiDAR or trajectory claim leaks in", () => {
  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\bANPR\b/i, /\bLPR\b/i, /\blicence plates?\b/i, /\bnumber plates?\b/i,
    /\bregistrations?\b/i, /\bTattile\b/i, /\bhome origin\b/i, /\bLiDAR\b/i,
    /\btrajector/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `must not mention ${forbidden}`);
  }
  const alt = read(COMPONENT).match(/\balt="([^"]*)"/)[1];
  assert.match(alt, /No line is followed continuously/i);
  assert.match(alt, /no face is marked/i);
  assert.match(alt, /no unit carries a figure or a rank/i);
});

test("nothing is ranked, scored, recommended or given a figure", () => {
  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\brank(?:ed|ing)?\b/i, /\bscore[ds]?\b/i, /\brecommend/i, /\bbest\b/i,
    /\bconversion\b/i, /\bsales\b/i, /\bturnover\b/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `must not say ${forbidden}`);
  }
  const rendered = code().slice(code().indexOf("return ("));
  const copy = rendered.replace(/<[^>]*>/g, " ").replace(/\s*(?:[<>]=?|={2,3}|!==?)\s*\d+/g, " ");
  assert.doesNotMatch(copy, /\b\d+\b/, "no figure may be stated");
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
  assert.ok(!shell.includes("RetailParkCrossVisitationScene"));
  const page = read("app/preview/retail-park-cross-visitation/page.tsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});
