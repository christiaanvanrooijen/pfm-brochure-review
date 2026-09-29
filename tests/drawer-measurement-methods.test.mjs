/**
 * Which sensor answers which question, per scene — as the product lead set it
 * on 2026-09-27.
 *
 * These walk the SAME resolver the drawer renders from, so what they assert is
 * what a prospect sees in "How does this work?", not what a table somewhere
 * happens to contain. And they hold the other half just as firmly: the approved
 * Configure previews, which read the shared segment file, did not move.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { allScenes, segmentDefinitions } from "../app/content/segments/index.ts";
import { technologyImplementations } from "../app/content/technology.ts";
import { getSceneCapabilityViews } from "../app/content/scene-technology-runtime.ts";
import { getImplementationsForCapability } from "../app/content/technology-runtime.ts";
import { getSolutionImplementationOptions } from "../app/content/solution-runtime.ts";
import {
  drawerExplainerVisuals,
  sceneDrawerOverrides,
  segmentDrawerSettings,
} from "../app/content/scene-drawer-overrides.ts";
import { locales } from "../app/i18n/locales.ts";

const IN = "impl-ip-detection-indoor";
const OUT = "impl-ip-detection-outdoor";
const PREMIUM_3D = "impl-xovis-3d-entrance";
// Open-air segments get the outdoor variant (PC2SE-O), never the indoor one.
const PREMIUM_3D_OUT = "impl-xovis-3d-entrance-outdoor";
const BASIC_3D = "impl-milesight-vs125p-entrance";
const ANALYTICS = "impl-isarsoft-camera-analytics";
const ANPR = "impl-tattile-anpr-vehicle";

const drawer = (sceneId) => {
  const scene = allScenes.find((s) => s.id === sceneId);
  assert.ok(scene, `${sceneId} is not a scene`);
  const views = getSceneCapabilityViews(scene.segment, scene);
  return {
    capabilities: views.map((v) => v.capabilityId),
    sensors: (capabilityId) =>
      views.find((v) => v.capabilityId === capabilityId)?.implementations.map((i) => i.id) ?? null,
    all: views.flatMap((v) => v.implementations.map((i) => i.id)),
    explainers: views.flatMap((v) => v.explainerVisuals.map((e) => e.assetPath)),
    view: (capabilityId) => views.find((v) => v.capabilityId === capabilityId),
  };
};

test("1. Retail Park: units are counted in 3D; time and movement by re-identification", () => {
  const units = drawer("retail-park-unit-visits");
  assert.deepEqual(units.capabilities, ["TECH-02"]);
  assert.deepEqual(units.sensors("TECH-02").sort(), [PREMIUM_3D_OUT, BASIC_3D].sort());

  for (const sceneId of ["retail-park-time-on-site", "retail-park-cross-visitation"]) {
    const d = drawer(sceneId);
    assert.deepEqual(d.sensors("TECH-05"), [OUT], `${sceneId} is not re-identification via IP detection`);
  }
});

test("2. Outlet Centre follows the product lead's method for every scene", () => {
  // Entrances and brand visits: Basic 3D, Premium 3D or IP detection.
  for (const sceneId of ["outlet-centre-entrances", "outlet-centre-brand-counting"]) {
    const d = drawer(sceneId);
    assert.deepEqual(d.capabilities, ["TECH-02"]);
    assert.deepEqual(d.sensors("TECH-02").sort(), [PREMIUM_3D_OUT, BASIC_3D, OUT].sort());
  }

  // Streets, zones and anchors: IP detection only — explicitly NOT LiDAR or
  // the FishEye 3D sensor.
  for (const sceneId of ["outlet-centre-circulation", "outlet-centre-zone-exposure-dwell"]) {
    const d = drawer(sceneId);
    assert.deepEqual(d.sensors("TECH-04"), [OUT]);
    assert.ok(!d.all.includes("impl-lidar-spatial"), `${sceneId} still offers LiDAR`);
    assert.ok(!d.all.includes("impl-xovis-3d-spatial"), `${sceneId} still offers the FishEye sensor`);
  }

  // Brand to brand: ONLY an IP detection sensor per store, with re-ID.
  const flow = drawer("outlet-centre-brand-flow");
  assert.deepEqual(flow.capabilities, ["TECH-05"]);
  assert.deepEqual(flow.all, [OUT]);

  // Time in the outlet: two ways — ANPR plate and time, or IP re-ID.
  const time = drawer("outlet-centre-time-in-destination");
  assert.deepEqual(time.capabilities, ["TECH-05", "TECH-06"]);
  assert.deepEqual(time.sensors("TECH-05"), [OUT]);
  assert.deepEqual(time.sensors("TECH-06"), [ANPR]);

  // Visitor mix: privacy-proof analysis, with its approved explainer.
  const mix = drawer("outlet-centre-visitor-composition");
  assert.ok(mix.explainers.some((p) => p.includes("outlet-centre-anonymous-classification")));
});

test("3. Shopping Centre: floors are counted, dwell is re-identified, stores are counted", () => {
  const floors = drawer("shopping-centre-internal-circulation");
  assert.deepEqual(floors.capabilities, ["TECH-02"]);
  assert.deepEqual(floors.all.sort(), [PREMIUM_3D, BASIC_3D].sort());

  // Dwell keeps what was there: camera coverage and re-identification.
  const dwell = drawer("shopping-centre-zone-anchor-exposure");
  assert.ok(dwell.explainers.some((p) => p.includes("shopping-centre-camera-movement-intelligence")));
  assert.deepEqual(dwell.sensors("TECH-04"), [IN]);

  // A store visit is a store visitor count — not the camera-movement picture.
  const stores = drawer("shopping-centre-brand-counting");
  assert.deepEqual(stores.capabilities, ["TECH-02"]);
  assert.ok(
    !stores.explainers.some((p) => p.includes("camera-movement")),
    "store visits still show the camera-movement illustration",
  );

  // Brand flow and time carry the approved re-identification explainer.
  for (const sceneId of ["shopping-centre-brand-flow", "shopping-centre-time-in-centre"]) {
    assert.ok(drawer(sceneId).explainers.some((p) => p.includes("shopping-centre-anonymous-re-id")));
  }
});

test("4. every segment is shown exactly one IP detection sensor, and the right one", () => {
  /* The same rule holds for the Premium 3D sensor: indoor segments see the
     PC2SE, open-air segments its outdoor variant, and never the other way. */
  const indoor = new Set(["retail", "shopping-centre"]);
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const shown = drawer(sceneId).all;
      if (indoor.has(segment.id)) {
        assert.ok(!shown.includes(OUT), `${sceneId}: an indoor segment is shown the outdoor sensor`);
        assert.ok(!shown.includes(PREMIUM_3D_OUT), `${sceneId}: an indoor segment is shown the outdoor 3D sensor`);
      } else {
        assert.ok(!shown.includes(IN), `${sceneId}: an open-air segment is shown the indoor sensor`);
        assert.ok(!shown.includes(PREMIUM_3D), `${sceneId}: an open-air segment is shown the indoor 3D sensor`);
      }
      // And the analytics card they replace no longer appears in the drawer.
      assert.ok(!shown.includes(ANALYTICS), `${sceneId} still shows "Analytics on existing camera infrastructure"`);
    }
  }
});

test("5. the drawer chooses among real options — it cannot invent one", () => {
  for (const setting of segmentDrawerSettings) {
    const linked = getImplementationsForCapability(setting.capabilityId).map((i) => i.id);
    for (const id of setting.implementationIds ?? []) {
      assert.ok(linked.includes(id), `${setting.segment}/${setting.capabilityId}: ${id} is not linked to it`);
    }
  }
  for (const override of sceneDrawerOverrides) {
    const scene = allScenes.find((s) => s.id === override.sceneId);
    assert.ok(scene, `${override.sceneId} does not exist`);
    for (const [capabilityId, setting] of Object.entries(override.capabilities ?? {})) {
      assert.ok(override.capabilityIds.includes(capabilityId), `${override.sceneId}: ${capabilityId} set but not shown`);
      const linked = getImplementationsForCapability(capabilityId).map((i) => i.id);
      for (const id of setting.implementationIds ?? []) assert.ok(linked.includes(id));
    }
    assert.ok(override.reason.length > 30, `${override.sceneId} does not say why it differs`);
  }
});

test("6. every explanation the drawer adds exists in all three languages", () => {
  const purposes = [
    ...segmentDrawerSettings.map((s) => [`${s.segment}/${s.capabilityId}`, s.purpose]),
    ...sceneDrawerOverrides.flatMap((o) =>
      Object.entries(o.capabilities ?? {}).map(([cap, s]) => [`${o.sceneId}/${cap}`, s.purpose]),
    ),
  ].filter(([, p]) => p);
  assert.ok(purposes.length >= 8);
  for (const [where, purpose] of purposes) {
    for (const locale of locales) {
      assert.ok(purpose[locale]?.length > 30, `${where} has no ${locale} explanation`);
    }
    assert.notEqual(purpose.fr, purpose.en, `${where}: French is the English`);
    assert.notEqual(purpose.de, purpose.en, `${where}: German is the English`);
  }
});

test("7. each drawer explainer is true of its own segment, and on disk", () => {
  const root = fileURLToPath(new URL("../public", import.meta.url));
  for (const visual of drawerExplainerVisuals) {
    assert.ok(existsSync(root + visual.assetPath), `${visual.assetPath} is not on disk`);
    const owner = segmentDrawerSettings.find((s) => (s.explainerVisuals ?? []).includes(visual));
    assert.equal(owner.segment, visual.segment, `${visual.approachId} is attached to another segment`);
    assert.ok(visual.assetPath.includes(visual.segment), `${visual.assetPath} does not say whose it is`);
    assert.equal(visual.illustrative, true);
    assert.doesNotMatch(`${visual.approachName} ${visual.explanation}`, /\d+\s*%|accuracy|guarantee/i);
  }
});

test("8. the approved Configure previews did not move", () => {
  /* The shared segment file is read by Configure as well as the drawer. The
     drawer changed; Configure was not part of that direction, so its "What is
     needed" still offers exactly what it offered — including the analytics
     option — and neither IP detection sensor. */
  for (const direction of ["solution-capture-and-visits", "solution-in-store-intelligence"]) {
    const ids = getSolutionImplementationOptions(direction).flatMap((g) => g.options.map((o) => o.implementationId));
    assert.ok(!ids.includes(IN) && !ids.includes(OUT), `${direction} now offers an IP detection sensor`);
    assert.ok(!ids.includes(PREMIUM_3D_OUT), `${direction} now offers the outdoor 3D sensor`);
  }
  const entrance = getSolutionImplementationOptions("solution-capture-and-visits").flatMap((g) =>
    g.options.map((o) => o.implementationId),
  );
  assert.ok(entrance.includes(ANALYTICS), "Configure lost its analytics option");
});

test("9. both sensors carry installation essentials the product lead wrote, and nothing more", () => {
  for (const id of [IN, OUT]) {
    const impl = technologyImplementations.find((i) => i.id === id);
    assert.equal(impl.supplier, "Bosch");
    /* Privacy is partially backed since 2026-09-28: the product lead confirmed
       both models are CPP14, inside the Bosch IVA Pro Privacy paper's scope.
       Every privacy sentence is attributed to the manufacturer, and the
       paper's conditions and the absence of any compliance judgement are
       stated as blocked claims. */
    assert.equal(impl.privacyStatus, "partially_source_backed");
    assert.ok(impl.sourceRefs.some((ref) => ref.includes("SRC-BOSCH-IVA-PRO-PRIVACY-001")));
    const privacy = impl.supportedClaims.filter((claim) => /masking|privacy/i.test(claim));
    assert.ok(privacy.length > 0 && privacy.every((claim) => claim.startsWith("The manufacturer")));
    const blocked = impl.unsupportedClaims.join(" ");
    assert.match(blocked, /firmware 9\.40/);
    assert.match(blocked, /legally compliant/);
    assert.equal(impl.technicalDetailStatus, "requires_source_mapping");
  }
});
