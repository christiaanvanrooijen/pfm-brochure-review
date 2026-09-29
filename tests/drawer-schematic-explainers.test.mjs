/**
 * The seven schematic explainers drawn on 2026-09-28.
 *
 * Six close the gaps in docs/content/EXPLAINER-BRIEF.md; the seventh is the
 * Retail classification gap (CONTENT-REVIEW-2026-09-27.md, proposal 5). These
 * hold three things: each reaches the scenes the brief names, and only its own
 * segment's; each keeps the brief's rules in the file itself; and each has
 * French and German copy of its own.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { allScenes } from "../app/content/segments/index.ts";
import { getSceneCapabilityViews } from "../app/content/scene-technology-runtime.ts";
import { drawerExplainerVisuals } from "../app/content/scene-drawer-overrides.ts";
import { resolveExplainerCopy } from "../app/i18n/domain.ts";

const DIR = "/assets/technology/explainers/";

/** File → the scenes the brief (or the review) says it serves. */
const expected = new Map([
  ["retail-anonymous-classification-explainer.svg", ["retail-visitor-composition"]],
  ["shopping-centre-threshold-counting-explainer.svg", [
    "shopping-centre-internal-circulation",
    "shopping-centre-brand-counting",
    "shopping-centre-entrances",
  ]],
  ["retail-park-unit-entrance-counting-explainer.svg", ["retail-park-unit-visits", "retail-park-unit-category-exposure"]],
  ["retail-park-anonymous-re-id-explainer.svg", ["retail-park-cross-visitation", "retail-park-time-on-site"]],
  ["outlet-centre-entrance-counting-explainer.svg", ["outlet-centre-entrances", "outlet-centre-brand-counting"]],
  ["outlet-centre-zone-counting-lines-explainer.svg", ["outlet-centre-circulation", "outlet-centre-zone-exposure-dwell"]],
  ["outlet-centre-anonymous-re-id-explainer.svg", ["outlet-centre-brand-flow", "outlet-centre-time-in-destination"]],
]);

const schematic = drawerExplainerVisuals.filter((v) => v.assetPath.endsWith(".svg"));
const shownIn = (file) =>
  allScenes
    .filter((scene) =>
      getSceneCapabilityViews(scene.segment, scene).some((view) =>
        view.explainerVisuals.some((visual) => visual.assetPath === DIR + file),
      ),
    )
    .map((scene) => scene.id);

test("each schematic explainer reaches the scenes it was drawn for, and no others", () => {
  assert.equal(schematic.length, expected.size);
  for (const [file, scenes] of expected) {
    const visual = schematic.find((v) => v.assetPath === DIR + file);
    assert.ok(visual, `${file} is not wired`);
    const shown = shownIn(file);
    for (const sceneId of scenes) assert.ok(shown.includes(sceneId), `${file} is missing from ${sceneId}`);
    for (const sceneId of shown) {
      const scene = allScenes.find((s) => s.id === sceneId);
      assert.equal(scene.segment, visual.segment, `${file} reaches another segment's scene (${sceneId})`);
    }
  }
});

test("the files keep the brief's rules: no text, no raster, brand colours only", () => {
  const tokens = new Set([
    "#0C111D", "#161B26", "#1F242F", "#333741", "#61646C", "#94969C", "#CECFD2",
    "#E9D7FE", "#D6BBFB", "#B692F6", "#9E77ED", "#7F56D9", "#6941C6",
    "#FDA29B", "#F97066", "#F04438",
  ]);
  for (const file of expected.keys()) {
    const svg = readFileSync(new URL(`../public${DIR}${file}`, import.meta.url), "utf8");
    assert.match(svg, /viewBox="0 0 1672 941"/, `${file} is not 1672×941`);
    // No text, numbers or labels in the pixels: there is no text element at all.
    assert.doesNotMatch(svg, /<text|<tspan|<foreignObject/i, `${file} carries text`);
    // Nothing photographic or external is embedded.
    assert.doesNotMatch(svg, /<image|href="http|data:image/i, `${file} embeds an image`);
    for (const colour of svg.match(/#[0-9A-Fa-f]{6}\b/g) ?? []) {
      assert.ok(tokens.has(colour.toUpperCase()), `${file} uses ${colour}, which is not a brand token`);
    }
  }
});

test("each says it is schematic, and has French and German copy of its own", () => {
  for (const visual of schematic) {
    assert.equal(visual.illustrative, true);
    assert.equal(visual.hasEmbeddedText, false);
    assert.equal(visual.showsSensorHardware, false);
    assert.match(visual.illustrationNote, /^Schematic illustration/);
    assert.doesNotMatch(`${visual.approachName} ${visual.explanation} ${visual.altText}`, /\d|accura|guarantee|precis/i);
    for (const locale of ["fr", "de"]) {
      const copy = resolveExplainerCopy(locale, visual.approachId, null);
      assert.ok(copy, `${locale} copy missing for ${visual.approachId}`);
      assert.notEqual(copy.explanation, visual.explanation);
      assert.notEqual(copy.altText, visual.altText);
      assert.ok(copy.illustrationNote.length > 0, `${locale} illustration note missing for ${visual.approachId}`);
    }
  }
});

test("the method heading under an explainer is translated like the rest of the drawer", () => {
  const panel = readFileSync(new URL("../app/components/redesign/DepthPanel.tsx", import.meta.url), "utf8");
  const method = panel.slice(panel.indexOf('className="rd-depth__method"'), panel.indexOf("capabilitiesWithoutIllustration.length > 0"));
  assert.match(method, /resolveCapabilityCopy\(locale, segmentId, view\.capabilityId\)\?\.name/);
  assert.doesNotMatch(method, /<h3>\{view\.name\}<\/h3>/);
});
