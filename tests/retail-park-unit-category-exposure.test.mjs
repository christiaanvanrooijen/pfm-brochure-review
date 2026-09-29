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
const SCENE = "retail-park-unit-category-exposure";
const COMPONENT = "app/components/RetailParkUnitCategoryExposureScene.tsx";
const HERO = "public/assets/location-visuals/retail-park/retail-park-unit-category-exposure-hero.png";

const code = () =>
  read(COMPONENT)
    // `{/*` with no gap, deliberately: `\{\s*\/\*` also matches an interface's
    // opening brace followed by a JSDoc member comment, and then swallows
    // everything up to the first `*/}` in the file — which is most of the JSX.
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
const flat = () => code().replace(/\s+/g, " ");

test("scene presence and position as the last Core scene", () => {
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
  assert.equal(segment.coreRoute[segment.coreRoute.length - 1], SCENE);
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.corePathOrder, 7);
  assert.equal(scene.journeyStage, "understand");
  assert.equal(scene.priority, "core");
  assert.ok(existsSync(repoFile(COMPONENT)));
});

test("end-of-core behaviour: a CTA into Configure, and no next scene", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.nextCta, "Configure solution");
  assert.equal(scene.nextSceneId, undefined, "the last Core scene types no next scene");

  // Configure is a synthesis stage, so no scene is invented to receive the hand-off.
  const segment = getSegment(SEGMENT);
  assert.deepEqual(segment.stageMapping.configure, []);
  assert.deepEqual(segment.stageMapping.act, []);
  assert.ok(segment.scenes.every((s) => s.journeyStage !== "configure"));

  // No other Core scene points at this one as a successor beyond the route.
  const successors = segment.coreRoute
    .map((id) => getSceneForSegment(SEGMENT, id).nextSceneId)
    .filter(Boolean);
  assert.deepEqual(successors, segment.coreRoute.slice(1));
});

test("typed question and supporting line are unchanged and bound, not restated", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(
    scene.commercialQuestion,
    "How does visitor exposure vary across units and categories?",
  );
  assert.equal(scene.supportingLine, "Inform category planning, signage and leasing conversations");
  for (const binding of [/\{scene\.nextCta\}/, /\{scene\.supportingLine\}/, /\{scene\.commercialQuestion\}/]) {
    assert.match(code(), binding);
  }
});

test("exact capability mapping and evidence inputs come from the typed model", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.technologyCapabilityIds, ["TECH-02"]);
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-04"));
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-06"));
  assert.deepEqual(scene.dataRequirements.required, ["physical", "business", "insight"]);
  assert.deepEqual(scene.dataRequirements.optional, []);

  const inputs = new Set(
    scene.derivedDependencies.flatMap((d) => [
      ...d.requiredInputIds,
      ...(d.alternativeInputGroups ?? []).flat(),
    ]),
  );
  assert.deepEqual([...inputs].sort(), ["category_mapping", "unit_events", "unit_mapping"]);
  for (const forbidden of [
    "spatial_trajectories", "spatial_definitions", "vehicle_events", "parking_events",
    "parking_capacity", "licence_plate_events", "lawful_origin_source", "trip_duration_events",
  ]) {
    assert.ok(!inputs.has(forbidden), `${SCENE} must not require ${forbidden}`);
  }
});

test("coverage is unknown, never zero and never a lack of interest", () => {
  const f = flat();
  assert.match(f, /A unit outside coverage has unknown exposure/i);
  assert.match(f, /not none, and not a lack of interest/i);
  // The alt text shows the same idea rather than hiding the gap.
  const alt = read(COMPONENT).match(/\balt="([^"]*)"/)[1];
  assert.match(alt, /carries no halo at all and is drawn with a dashed outline/i);
});

test("exposure is never trade, attribution, intent or a ranking", () => {
  const f = flat();
  assert.match(f, /Exposure is how much visitation a covered unit or category received/);
  assert.match(f, /not a sale, a conversion or an intention/i);
  assert.match(f, /it ranks nothing/i);
  assert.match(f, /never trade, attribution or a ranking/i);

  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\btransactions?\b/i, /\bpurchase intent\b/i, /\battributed?\b/i,
    /\btop performing\b/i, /\bbest\b/i, /\bunderperform/i, /\bscore[ds]?\b/i,
    /\bwinner\b/i, /\brecommend/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `must not say ${forbidden}`);
  }
});

test("the typed headline and supporting line carry no ranking or superlative", () => {
  // The component ban above scans the component only. The reader's headline lives
  // in the typed content, which is how "the most" once reached the page while the
  // truth boundary directly below it said exposure ranks nothing. Scan the typed
  // strings the reader actually sees.
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const reader = [scene.commercialQuestion, scene.supportingLine, scene.nextCta].join(" | ");
  for (const forbidden of [
    /\bthe most\b/i, /\bthe least\b/i, /\bmost\b/i, /\bhighest\b/i, /\blowest\b/i,
    /\btop\b/i, /\bbest\b/i, /\bworst\b/i, /\bleading\b/i, /\bstrongest\b/i,
    /\bwhich .* (?:receives?|gets?|wins)\b/i, /\brank/i,
  ]) {
    assert.doesNotMatch(reader, forbidden, `typed reader copy must not say ${forbidden}`);
  }
  assert.match(scene.commercialQuestion, /^How does visitor exposure vary across units and categories\?$/);
});

test("no vehicle, plate, origin, face, LiDAR or trajectory claim reaches this scene", () => {
  const source = code().replace(/\balt="[^"]*"/g, " ");
  for (const forbidden of [
    /\bANPR\b/i, /\bLPR\b/i, /\blicence plates?\b/i, /\bnumber plates?\b/i,
    /\bTattile\b/i, /\bfacial\b/i, /\bface recognition\b/i, /\bLiDAR\b/i,
    /\btrajector/i, /\bhome origin\b/i, /\bvehicle\b/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `must not mention ${forbidden}`);
  }
  const alt = read(COMPONENT).match(/\balt="([^"]*)"/)[1];
  assert.match(alt, /No unit is numbered, ranked or labelled with a figure/i);
  assert.match(alt, /no face is marked/i);
});

test("no figure or percentage reaches the rendered copy", () => {
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

test("the hero is purpose-built for this scene, and borrows no other scene's plate", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.visualAssetId, "VIS-RP-07");
  const mapping = visualAssets.find((v) => v.id === "VIS-RP-07");
  assert.deepEqual([...mapping.sceneIds], [SCENE]);
  assert.deepEqual([...mapping.capabilityIds], ["TECH-02"]);

  assert.match(
    code(),
    /src="\/assets\/location-visuals\/retail-park\/retail-park-unit-category-exposure-hero\.png"/,
  );

  // Seven scenes, seven different plates — and none of the shared base renders.
  const heroes = [
    "RetailParkCatchmentScene",
    "RetailParkVehicleArrivalScene",
    "RetailParkParkingOccupancyScene",
    "RetailParkUnitVisitsScene",
    "RetailParkCrossVisitationScene",
    "RetailParkTimeOnSiteScene",
    "RetailParkUnitCategoryExposureScene",
  ].map((n) => read(`app/components/${n}.tsx`).match(/retail-park-[a-z-]+-hero\.png/)[0]);
  assert.equal(new Set(heroes).size, heroes.length, `two scenes share a hero: ${heroes}`);
  for (const shared of [
    "retail-park-visitors-hero.png",
    "retail-park-spatial-journey-hero.png",
    "retail-park-brand-journey-hero.png",
    "retail-park-parking-intelligence-hero.png",
    "retail-park-dwell-hero.png",
  ]) {
    assert.ok(!heroes.includes(shared), `${shared} is a shared base render and must not be used`);
  }
});

test("the hero asset must exist before this scene can be reviewed", () => {
  // A hard assertion rather than a skip. Every other part of the scene is
  // complete; what is missing is a purpose-built plate this session cannot
  // produce, and a green suite must not imply the scene has been seen.
  assert.ok(
    existsSync(repoFile(HERO)),
    `${HERO} does not exist yet — the Unit & category exposure hero has not been produced`,
  );
});

test("earlier locked scenes, frozen segments and production exposure are untouched", () => {
  for (const [id, question] of [
    ["retail-park-catchment-area", "Where do park visitors come from, and what demand sits around the asset?"],
    ["retail-park-vehicle-arrival", "How many vehicles arrive, and when?"],
    ["retail-park-parking-occupancy", "How much parking capacity is used and where?"],
    ["retail-park-unit-visits", "Which units are visited, and when?"],
    ["retail-park-cross-visitation", "How do visitors move from unit to unit?"],
    ["retail-park-time-on-site", "How long do visitors spend in the retail park?"],
  ]) {
    assert.equal(getSceneForSegment(SEGMENT, id).commercialQuestion, question);
  }
  assert.equal(getSegment("retail").implementationStatus, "implementation_ready");
  assert.equal(getSegment("shopping-centre").implementationStatus, "architecture_only");
  assert.equal(getSegment(SEGMENT).implementationStatus, "architecture_only");

  const shell = read("app/components/CommercialExperience.tsx");
  assert.ok(!shell.includes("RetailParkUnitCategoryExposureScene"));
  const page = read("app/preview/retail-park-unit-category-exposure/page.tsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});
