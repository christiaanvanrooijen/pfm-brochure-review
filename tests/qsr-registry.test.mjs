import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { visualAssets } from "../app/content/visual-assets.ts";
import { allScenes } from "../app/content/segments/index.ts";
import {
  capabilityExplainerVisuals,
  getAllCapabilityExplainerVisuals,
  getCapabilityExplainerVisuals,
} from "../app/content/technology-visuals.ts";
import {
  getSegmentStartVisual,
  rejectedSegmentVisuals,
  segmentStartVisuals,
} from "../app/content/segment-start-visuals.ts";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const publicDir = repo("public");
const onDisk = (webPath) => existsSync(path.join(publicDir, webPath.replace(/^\//, "")));

/* ------------------------------------------------------------------ *
   THE FAILURE THIS FILE EXISTS FOR

   Twelve QSR visuals sat in the registry as "placeholder" long after their
   artwork had landed in public/assets/location-visuals/qsr/. Nothing failed,
   nothing warned, and the preview went on rendering an honest "not yet
   produced" panel over a folder full of finished images.
 * ------------------------------------------------------------------ */

test("a QSR scene with artwork on disk cannot stay a placeholder", () => {
  const qsrScenes = allScenes.filter((scene) => scene.segment === "qsr");
  assert.ok(qsrScenes.length > 0);

  const stale = [];
  for (const scene of qsrScenes) {
    const asset = visualAssets.find((visual) => visual.id === scene.visualAssetId);
    assert.ok(asset, `${scene.id} declares ${scene.visualAssetId}, which is not registered`);
    // The conventional path for a segment scene hero.
    const conventional = `/assets/location-visuals/qsr/${scene.id}-hero.png`;
    if (onDisk(conventional) && asset.status === "placeholder") {
      stale.push(`${asset.id}: ${conventional} exists but the registry says placeholder`);
    }
  }
  assert.deepEqual(stale, []);
});

test("every QSR scene hero on disk is claimed by exactly one registry entry", () => {
  const files = readdirSync(path.join(publicDir, "assets/location-visuals/qsr"))
    .filter((f) => f.endsWith(".png"));
  const sceneIds = new Set(allScenes.filter((s) => s.segment === "qsr").map((s) => s.id));
  const orphans = files.filter((f) => !sceneIds.has(f.replace(/-hero\.png$/, "")));
  assert.deepEqual(orphans, [], "QSR artwork exists that no scene claims");
});

test("QSR registry entries still carry no invented paths", () => {
  for (const asset of visualAssets.filter((v) => v.segment === "qsr")) {
    // AGENTS.md: this registry records approval and scene coverage, never paths.
    assert.equal(asset.assetPath, null);
    assert.equal(asset.illustrative, true);
  }
});

/* ------------------------------------------------------------------ *
   SEGMENT START VISUALS — cover, never evidence
 * ------------------------------------------------------------------ */

test("a start visual is a cover and can never be typed as evidence", () => {
  assert.ok(segmentStartVisuals.length >= 2);
  for (const visual of segmentStartVisuals) {
    assert.equal(visual.isEvidence, false);
    assert.equal(visual.illustrative, true);
    assert.ok(onDisk(visual.assetPath), `missing start visual: ${visual.assetPath}`);
    assert.ok(visual.altText.length > 40);
    assert.ok(visual.selectionNote.length > 20, "a cover records why it was chosen");
    // A cover must come from its own segment's folder.
    assert.ok(
      visual.assetPath.includes(`/location-visuals/${visual.segment}/`),
      `${visual.segment} cover is not from its own folder: ${visual.assetPath}`,
    );
  }
});

test("the Outlet cover is not evidence for Destination catchment", () => {
  const cover = getSegmentStartVisual("outlet-centre");
  assert.ok(cover);
  // The distinction, typed: this artwork is a cover only.
  assert.equal(cover.alsoSceneHeroFor, null);
  assert.equal(cover.isEvidence, false);

  // And the preview must not promote it to that scene's hero.
  const media = readFileSyncText("app/preview/redesign/start/media.ts");
  assert.match(media, /"outlet-centre-destination-catchment": null/);
  assert.ok(
    !media.includes("outlet-centre-visitor-brand-flow-hero.png"),
    "the Outlet cover must not be wired in as a scene hero",
  );
});

test("QSR's cover is also its context hero, because the artwork is both", () => {
  const cover = getSegmentStartVisual("qsr");
  assert.equal(cover.alsoSceneHeroFor, "qsr-drive-thru-context");
  const media = readFileSyncText("app/preview/redesign/start/media.ts");
  assert.match(media, /"qsr-drive-thru-context": `\$\{V\}qsr\/qsr-drive-thru-context-hero\.png`/);
});

test("the rejected Shopping Centre duplicate is typed as rejected and never used", () => {
  const rejected = rejectedSegmentVisuals.find((r) => r.segment === "outlet-centre");
  assert.ok(rejected);
  assert.match(rejected.assetPath, /outlet-centre-geo-intelligence-hero\.png$/);
  assert.match(rejected.reason, /Shopping Centre/i);
  for (const file of ["app/preview/redesign/start/media.ts", "app/content/segment-start-visuals.ts"]) {
    const source = readFileSyncText(file);
    const uses = source
      .split("\n")
      .filter((line) => line.includes("outlet-centre-geo-intelligence-hero"))
      .filter((line) => !line.trim().startsWith("*") && !line.trim().startsWith("//"));
    for (const line of uses) {
      assert.ok(
        line.includes("rejected") || line.includes("assetPath:"),
        `${file} uses the rejected duplicate: ${line.trim()}`,
      );
    }
  }
});

/* ------------------------------------------------------------------ *
   TECHNOLOGY IMAGERY — per segment AND capability
 * ------------------------------------------------------------------ */

test("a shared capability id does not authorise shared footage", () => {
  // TECH-01 and TECH-02 are Retail's, and resolve for Retail only.
  for (const capabilityId of ["TECH-01", "TECH-02"]) {
    assert.equal(getCapabilityExplainerVisuals(capabilityId, "retail").length, 1);
    for (const segment of ["shopping-centre", "retail-park", "outlet-centre", "qsr"]) {
      assert.equal(
        getCapabilityExplainerVisuals(capabilityId, segment).length,
        0,
        `${capabilityId} leaked Retail footage into ${segment}`,
      );
    }
  }
  // And the registry-level view still sees them, for validation only.
  assert.ok(getAllCapabilityExplainerVisuals("TECH-01").length > 0);
});

test("QSR technology imagery resolves for QSR and lives in the QSR folder", () => {
  const expected = {
    "TECH-QSR-01": "qsr-hme-zoom-nitro-stage-timing-hero.png",
    "TECH-QSR-02": "qsr-hme-zoom-nitro-stage-timing-hero.png",
    "TECH-QSR-03": "qsr-nexeo-headset-alert-and-crew-communication-hero.png",
    "TECH-QSR-09": "qsr-compatible-voice-ai-order-and-human-handoff-hero.png",
  };
  for (const [capabilityId, file] of Object.entries(expected)) {
    const visuals = getCapabilityExplainerVisuals(capabilityId, "qsr");
    assert.equal(visuals.length, 1, `${capabilityId} must resolve exactly one QSR explainer`);
    assert.match(visuals[0].assetPath, new RegExp(`/assets/technology/qsr/${file}$`));
    assert.ok(onDisk(visuals[0].assetPath));
    // Not reachable from any other segment.
    for (const segment of ["retail", "shopping-centre", "retail-park", "outlet-centre"]) {
      assert.equal(getCapabilityExplainerVisuals(capabilityId, segment).length, 0);
    }
  }
});

test("every QSR technology file on disk is mapped to a capability", () => {
  const files = readdirSync(path.join(publicDir, "assets/technology/qsr"))
    .filter((f) => f.endsWith(".png"));
  const mapped = new Set(
    capabilityExplainerVisuals
      .filter((v) => v.segment === "qsr")
      .map((v) => v.assetPath.split("/").pop()),
  );
  assert.deepEqual(
    files.filter((f) => !mapped.has(f)),
    [],
    "QSR technology artwork exists that no capability claims",
  );
});

test("no QSR explainer invents a metric or an identity claim", () => {
  for (const visual of capabilityExplainerVisuals.filter((v) => v.segment === "qsr")) {
    const text = `${visual.approachName} ${visual.explanation} ${visual.altText}`;
    assert.doesNotMatch(text, /\d+\s*(%|s\b|sec|seconds|minutes)/i, `${visual.approachId} carries a figure`);
    assert.doesNotMatch(text, /plate|licence|license|face|identif(y|ies|ied)\s+(the\s+)?(driver|customer)/i,
      `${visual.approachId} carries an identity claim`);
    assert.equal(visual.showsSensorHardware, false);
    assert.equal(visual.illustrative, true);
  }
});

function readFileSyncText(p) {
  return readFileSync(repo(p), "utf8");
}

test("every QSR explainer is translated into French and German", async () => {
  const { resolveExplainerCopy } = await import("../app/i18n/domain.ts");
  for (const visual of capabilityExplainerVisuals.filter((v) => v.segment === "qsr")) {
    const fallback = {
      approachName: visual.approachName,
      explanation: visual.explanation,
      illustrationNote: visual.illustrationNote ?? "",
      altText: visual.altText,
    };
    for (const locale of ["fr", "de"]) {
      const copy = resolveExplainerCopy(locale, visual.approachId, fallback);
      assert.notEqual(
        copy.explanation,
        visual.explanation,
        `${visual.approachId} falls back to English in ${locale}`,
      );
      assert.ok(copy.approachName.length > 0 && copy.altText.length > 0);
    }
  }
});

test("the NEXEO frame explains alerting only because the alert is visible in it", () => {
  // Gate 4 declined this mapping after a quick look and was wrong: zoomed in,
  // the frame carries an amber indicator at the earpiece, distinct from the
  // purple communication links. The mapping is earned by the picture.
  const alerting = getCapabilityExplainerVisuals("TECH-QSR-06", "qsr");
  assert.equal(alerting.length, 1);
  assert.match(alerting[0].assetPath, /qsr-nexeo-headset-alert-and-crew-communication-hero\.png$/);
  assert.match(alerting[0].altText, /amber indicator/i);
  // Communication and alerting stay separate approaches on the same artwork.
  const comms = getCapabilityExplainerVisuals("TECH-QSR-03", "qsr");
  assert.equal(comms.length, 1);
  assert.notEqual(comms[0].approachId, alerting[0].approachId);
});

test("no QSR capability claims footage the picture does not carry", () => {
  // TECH-QSR-07 is multi-restaurant intelligence. The ZOOM Nitro frame shows
  // ONE restaurant, so it is not mapped there however plausible the file name
  // makes it sound. TECH-QSR-04 is audio clarity and has no artwork at all.
  for (const capabilityId of ["TECH-QSR-04", "TECH-QSR-07"]) {
    assert.equal(
      getCapabilityExplainerVisuals(capabilityId, "qsr").length,
      0,
      `${capabilityId} has no honest QSR artwork and must resolve none`,
    );
  }
});
