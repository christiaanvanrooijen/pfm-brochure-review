import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getSceneForSegment } from "../app/content/runtime.ts";

const repoFile = (relative) => fileURLToPath(new URL(`../${relative}`, import.meta.url));
const read = (relative) => readFileSync(repoFile(relative), "utf8");

const SEGMENT = "retail-park";
const SCENE = "retail-park-catchment-area";
const COMPONENT = "app/components/RetailParkCatchmentScene.tsx";

/* Comments stripped: the component documents the things it deliberately does
   NOT do — ANPR, plates, vehicle origin — and that documentation is not a use. */
const code = () =>
  read(COMPONENT)
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

/* ------------------------------------------------- asset ownership guard --- */

test("each segment's geo hero lives in its own asset namespace", () => {
  // The mistake this prevents: the Retail Park and Outlet Centre aerials were
  // in each other's directories, so Retail Park's catchment showed an
  // outlet-village morphology. Corrected by swapping the files, not by
  // cross-referencing them.
  const paths = {
    "retail-park": "public/assets/location-visuals/retail-park/retail-park-geo-intelligence-hero.png",
    "outlet-centre": "public/assets/location-visuals/outlet-centre/outlet-centre-geo-intelligence-hero.png",
    "shopping-centre": "public/assets/location-visuals/shopping-centre/shopping-centre-geo-intelligence-hero.png",
  };
  for (const [segment, path] of Object.entries(paths)) {
    assert.ok(existsSync(repoFile(path)), `${segment} geo hero is missing at ${path}`);
  }

  // No segment component may reference another segment's asset namespace.
  const components = {
    "retail-park": COMPONENT,
    "shopping-centre": "app/components/ShoppingCentreCatchmentScene.tsx",
  };
  for (const [segment, file] of Object.entries(components)) {
    const source = read(file);
    for (const other of ["retail-park", "shopping-centre", "outlet-centre", "retail"]) {
      if (other === segment) continue;
      assert.ok(
        !source.includes(`/assets/location-visuals/${other}/`),
        `${file} references the ${other} asset namespace`,
      );
    }
  }
});

test("the Retail Park catchment scene renders its own segment's hero", () => {
  const source = code();
  assert.match(
    source,
    /src="\/assets\/location-visuals\/retail-park\/retail-park-geo-intelligence-hero\.png"/,
  );
  assert.ok(!source.includes("outlet-centre"), "no Outlet Centre reference");
});

/* ------------------------------------------------------------ scene truth --- */

test("the typed question, supporting line and handoff are unchanged", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(
    scene.commercialQuestion,
    "Where do park visitors come from, and what demand sits around the asset?",
  );
  assert.equal(scene.supportingLine, "Inform marketing, tenant mix and park positioning");
  assert.equal(scene.journeyStage, "context");
  assert.equal(scene.corePathOrder, 1);
  assert.equal(scene.nextCta, "Measure vehicle arrival");
  assert.equal(scene.nextSceneId, "retail-park-vehicle-arrival");
  assert.equal(getSegment(SEGMENT).coreRoute[0], SCENE);
});

test("the scene declares TECH-07 and nothing else", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual(scene.technologyCapabilityIds, ["TECH-07"]);
  // Vehicle and parking intelligence belongs to the scenes that follow.
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-06"));
  assert.ok(!scene.technologyCapabilityIds.includes("TECH-04"));
  assert.deepEqual(scene.dataRequirements.required, ["mobile_geo", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional].sort(), ["business", "physical"]);
});

test("no plate, ANPR or vehicle-origin concept reaches this scene", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const inputs = new Set(
    scene.derivedDependencies.flatMap((d) => [
      ...d.requiredInputIds,
      ...(d.alternativeInputGroups ?? []).flat(),
    ]),
  );
  assert.ok(!inputs.has("licence_plate_events"));
  assert.ok(!inputs.has("lawful_origin_source"));
  assert.deepEqual([...inputs], ["aggregate_mobility"]);

  const source = code().toLowerCase();
  for (const forbidden of ["anpr", "licence plate", "license plate", "number plate", "tattile", "vehicle origin"]) {
    assert.ok(!source.includes(forbidden), `component must not mention ${forbidden}`);
  }
});

test("geo context is never presented as measured park visitors", () => {
  const source = code();
  // JSX wraps a sentence across source lines at arbitrary points, so copy
  // assertions read a whitespace-flattened form.
  const flat = source.replace(/\s+/g, " ");

  // Stated, not implied.
  assert.match(flat, /Catchment describes area context from an approved aggregate source/);
  assert.match(flat, /not a list of measured park visitors/);
  assert.match(flat, /no individuals and no home addresses/);
  assert.match(flat, /never replaces it/);

  // And the typed evidence keeps the same boundary on the on-site layer.
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const measured = scene.evidence.find((entry) => entry.type === "measured");
  assert.match(measured.description, /unit sensors do not measure origin/i);

  // No approved values exist, so no figure may be written into the scene.
  const rendered = source.slice(source.indexOf("return ("));
  const copy = rendered.replace(/<[^>]*>/g, " ").replace(/\s*(?:[<>]=?|={2,3}|!==?)\s*\d+/g, " ");
  assert.doesNotMatch(copy, /\d+\s*%/, "no percentage may be stated");
  assert.doesNotMatch(copy, /\b\d+\s*(?:min|minutes?|km|miles?)\b/i, "no drive time or distance");
});

test("the preview route is production-guarded and the segment stays unbuilt", () => {
  const page = read("app/preview/retail-park-catchment/page.tsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);

  // Retail Park is not yet a shell journey.
  assert.equal(getSegment(SEGMENT).implementationStatus, "architecture_only");
  const shell = read("app/components/CommercialExperience.tsx");
  assert.ok(!shell.includes("RetailParkCatchmentScene"));
});

test("Retail and Shopping Centre are untouched by this scene", () => {
  assert.equal(getSegment("retail").implementationStatus, "implementation_ready");
  assert.equal(
    getSceneForSegment("shopping-centre", "shopping-centre-catchment-area").commercialQuestion,
    "Where do centre visitors come from, and who lives in that reach?",
  );
  // The shared catchment grammar is reused, not forked.
  assert.match(code(), /className=\{`capture catchment/);
});
