import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { qsrSegment } from "../app/content/segments/qsr.ts";
import { allScenes } from "../app/content/segments/index.ts";
import { getUsableProofsForScene } from "../app/content/proof-runtime.ts";
import { getCapabilityExplainerVisuals } from "../app/content/technology-visuals.ts";
import { qsrCoreRoute, qsrFocusOrder, qsrJourneyCopy } from "../app/i18n/qsr-journey.ts";
import { QSR_ASSET, QSR_GEOMETRY, QSR_HERO, QSR_HOTSPOTS, QSR_MODE } from "../app/preview/redesign/qsr-journey/media.ts";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repo(p), "utf8");
const onDisk = (webPath) => existsSync(repo(`public${webPath}`));

test("1. the route is the typed Core route, in the model's order", () => {
  assert.deepEqual([...qsrCoreRoute], [...qsrSegment.coreRoute]);
  // And each scene's corePathOrder agrees with its position.
  qsrCoreRoute.forEach((sceneId, position) => {
    const scene = allScenes.find((s) => s.id === sceneId);
    assert.ok(scene, `${sceneId} is not in the model`);
    assert.equal(scene.segment, "qsr");
    assert.equal(scene.corePathOrder, position + 1);
  });
});

test("2. every question, supporting line and CTA is the model's own", () => {
  for (const sceneId of qsrCoreRoute) {
    const scene = allScenes.find((s) => s.id === sceneId);
    const copy = qsrJourneyCopy.en[sceneId];
    assert.ok(copy, `${sceneId} has no English copy`);
    assert.equal(copy.question, scene.commercialQuestion);
    assert.equal(copy.supporting, scene.supportingLine);
    assert.equal(copy.nextCta, scene.nextCta);
  }
});

test("3. the CTA chain follows nextSceneId and ends where the model ends", () => {
  for (let i = 0; i < qsrCoreRoute.length - 1; i += 1) {
    const scene = allScenes.find((s) => s.id === qsrCoreRoute[i]);
    assert.equal(scene.nextSceneId, qsrCoreRoute[i + 1]);
  }
  const last = allScenes.find((s) => s.id === qsrCoreRoute[qsrCoreRoute.length - 1]);
  assert.ok(!last.nextSceneId, "the final Core scene must not continue inside Core");

  const journey = read("app/preview/redesign/qsr-journey/journey.tsx");
  // The final CTA is inert and says Configure is a separate preview.
  assert.match(journey, /ctaHref=\{isFinal \? null : "#"\}/);
  assert.match(journey, /ctaNote=\{isFinal \? t\.qsrConfigureSeparate : null\}/);
  const ui = read("app/i18n/messages.ts");
  assert.equal((ui.match(/qsrConfigureSeparate:/g) ?? []).length, 3);
});

test("4. every scene maps to its own inspected QSR hero", () => {
  for (const sceneId of qsrCoreRoute) {
    const hero = QSR_HERO[sceneId];
    assert.ok(hero, `${sceneId} has no hero`);
    // Its own segment folder, and the file exists.
    assert.match(hero, /^\/assets\/location-visuals\/qsr\//);
    assert.ok(onDisk(hero), `missing hero: ${hero}`);
    // No other segment's asset can appear anywhere in the mapping.
    assert.ok(!hero.includes("shopping-centre") && !hero.includes("retail") && !hero.includes("outlet"));
    assert.deepEqual(QSR_ASSET[sceneId], { w: 1672, h: 941 });
  }
});

test("5. a + exists only where a physical journey-stage locus is honest", () => {
  const withPoints = qsrCoreRoute.filter((id) => QSR_HOTSPOTS[id].length > 0);
  assert.deepEqual(withPoints, ["qsr-queue", "qsr-order"]);
  for (const sceneId of withPoints) {
    assert.equal(QSR_MODE[sceneId], "hotspots");
    assert.equal(QSR_HOTSPOTS[sceneId].length, 1, "at most one point per scene");
    // Every point must have geometry, and the geometry must sit on the asset.
    const point = QSR_HOTSPOTS[sceneId][0];
    const rect = QSR_GEOMETRY[`${sceneId}:${point.id}`];
    assert.ok(rect, `${sceneId}:${point.id} has a point but no evidence geometry`);
    const { w, h } = QSR_ASSET[sceneId];
    assert.ok(rect.x >= 0 && rect.x + rect.w <= w, "geometry runs off the asset");
    assert.ok(rect.y >= 0 && rect.y + rect.h <= h, "geometry runs off the asset");
    assert.ok(point.x >= rect.x - 40 && point.x <= rect.x + rect.w + 40, "the point sits away from its subject");
  }
  // The four that would imply identity or a false map carry no point at all.
  for (const sceneId of ["qsr-drive-thru-context", "qsr-bottleneck", "qsr-respond", "qsr-estate"]) {
    assert.equal(QSR_MODE[sceneId], "layer");
    assert.deepEqual(QSR_HOTSPOTS[sceneId], []);
  }
});

test("6. the rail carries only the evidence kinds the scene declares", () => {
  // Queue and Order have no connected cluster; an empty Connected column would
  // imply a context input the model never asks for.
  const expected = {
    "qsr-drive-thru-context": 3,
    "qsr-queue": 2,
    "qsr-order": 2,
    "qsr-bottleneck": 3,
    "qsr-respond": 3,
    "qsr-estate": 3,
  };
  for (const [sceneId, count] of Object.entries(expected)) {
    for (const locale of ["en", "fr", "de"]) {
      assert.equal(qsrJourneyCopy[locale][sceneId].sequence.length, count, `${sceneId} ${locale}`);
    }
  }
});

test("7. the QSR truth boundaries survive in all three languages", () => {
  const mustMention = {
    "qsr-queue": [/configured|configuré|konfiguriert/i, /never inferred|jamais déduit|niemals aus/i],
    "qsr-order": [/two compatible configured|deux points de détection configurés|zwei kompatiblen konfigurierten/i],
    "qsr-bottleneck": [/does not establish why|n'établit pas pourquoi|begründet nicht, warum/i],
    "qsr-respond": [/identified|identifié|identifiziert/i],
    "qsr-estate": [/revenue|revenu|Umsatz/i],
  };
  for (const [sceneId, patterns] of Object.entries(mustMention)) {
    for (const locale of ["en", "fr", "de"]) {
      const copy = qsrJourneyCopy[locale][sceneId];
      const text = `${copy.truth} ${copy.coverageNote}`;
      for (const pattern of patterns) {
        assert.match(text, pattern, `${sceneId} ${locale} lost a boundary`);
      }
    }
  }
});

test("8. no scene copy invents a metric, a goal value or an identity", () => {
  for (const locale of ["en", "fr", "de"]) {
    for (const sceneId of qsrCoreRoute) {
      const copy = qsrJourneyCopy[locale][sceneId];
      const text = [copy.question, copy.supporting, copy.truth, copy.coverageNote, copy.heroCaption,
        copy.heroAlt, ...Object.values(copy.focus).flatMap((f) => [f.label, f.body]),
        ...copy.sequence.map((s) => s.label)].join(" ");
      assert.doesNotMatch(text, /\d+\s*(%|s\b|sec|seconds|secondes|Sekunden|minutes|Minuten)/i,
        `${sceneId} ${locale} carries a figure`);
      assert.doesNotMatch(text, /number plate|plaque|Kennzeichen|licence plate/i,
        `${sceneId} ${locale} carries an identity claim`);
    }
  }
});

test("9. proof is not shown, because the typed proof runtime permits none", () => {
  for (const sceneId of qsrCoreRoute) {
    assert.deepEqual(
      [...getUsableProofsForScene("qsr", sceneId)],
      [],
      `${sceneId} would show proof that is not approved`,
    );
  }
});

test("10. every locale is complete for every Core scene", () => {
  for (const sceneId of qsrCoreRoute) {
    const en = qsrJourneyCopy.en[sceneId];
    for (const locale of ["fr", "de"]) {
      const copy = qsrJourneyCopy[locale][sceneId];
      assert.ok(copy, `${sceneId} missing in ${locale}`);
      for (const field of ["eyebrow", "question", "supporting", "truth", "coverageNote", "nextCta", "heroCaption", "heroAlt", "illustrative"]) {
        assert.ok(copy[field] && copy[field].length > 0, `${sceneId}.${field} empty in ${locale}`);
        assert.notEqual(copy[field], en[field], `${sceneId}.${field} untranslated in ${locale}`);
      }
      assert.deepEqual(Object.keys(copy.focus), Object.keys(en.focus));
      assert.equal(copy.sequence.length, en.sequence.length);
    }
    assert.deepEqual(Object.keys(en.focus), [...qsrFocusOrder[sceneId]]);
  }
});

test("11. technology media resolves per capability, and only QSR's own", () => {
  for (const sceneId of qsrCoreRoute) {
    const scene = allScenes.find((s) => s.id === sceneId);
    for (const capabilityId of scene.technologyCapabilityIds) {
      for (const visual of getCapabilityExplainerVisuals(capabilityId, "qsr")) {
        assert.equal(visual.segment, "qsr");
        assert.match(visual.assetPath, /^\/assets\/technology\/qsr\//);
        assert.ok(onDisk(visual.assetPath));
      }
      // The same capability must resolve nothing for any other segment.
      for (const other of ["retail", "shopping-centre", "retail-park", "outlet-centre"]) {
        assert.equal(getCapabilityExplainerVisuals(capabilityId, other).length, 0);
      }
    }
  }
});

test("12. the journey is isolated and renders no approved component", () => {
  const journey = read("app/preview/redesign/qsr-journey/journey.tsx");
  assert.doesNotMatch(journey, /components\/(Qsr|ShoppingCentre|Retail|CommercialExperience)/);
  assert.match(read("app/preview/redesign/qsr-journey/page.tsx"), /robots: \{ index: false, follow: false \}/);
  assert.doesNotMatch(read("app/components/CommercialExperience.tsx"), /qsr-journey|QsrJourney/);
});
