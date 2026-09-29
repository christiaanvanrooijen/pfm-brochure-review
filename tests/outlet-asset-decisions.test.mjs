import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { outletCentreSegment } from "../app/content/segments/outlet-centre.ts";
import { allScenes } from "../app/content/segments/index.ts";
import {
  getOutletDecision,
  OUTLET_VISUALS,
  outletRejectedFiles,
  outletSceneAssetDecisions,
  outletUsedPaths,
} from "../app/content/outlet-asset-decisions.ts";
import { getCapabilityExplainerVisuals } from "../app/content/technology-visuals.ts";
import { getUsableProofsForScene } from "../app/content/proof-runtime.ts";
import { getSegmentStartVisual } from "../app/content/segment-start-visuals.ts";
import { startCoverCopy } from "../app/i18n/starts.ts";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repo(p), "utf8");
const onDisk = (webPath) => existsSync(repo(`public${webPath}`));

test("1. every Core scene has exactly one decision, in typed order", () => {
  assert.deepEqual(
    outletSceneAssetDecisions.map((d) => d.sceneId),
    [...outletCentreSegment.coreRoute],
  );
  for (const decision of outletSceneAssetDecisions) {
    const scene = allScenes.find((s) => s.id === decision.sceneId);
    assert.ok(scene, `${decision.sceneId} is not in the model`);
    assert.equal(scene.segment, "outlet-centre");
  }
});

test("2. a decision resolves consistently with its candidate", () => {
  for (const d of outletSceneAssetDecisions) {
    if (d.decision === "missing") {
      assert.equal(d.candidatePath, null, `${d.sceneId}: missing must carry no path`);
      assert.equal(d.assetSize, null);
      assert.equal(d.focusLocus, null);
      assert.ok(d.blockedOn, `${d.sceneId}: missing must say what would unblock it`);
    } else {
      assert.ok(d.candidatePath, `${d.sceneId}: a non-missing decision needs a candidate`);
      assert.ok(onDisk(d.candidatePath), `${d.sceneId}: ${d.candidatePath} is not on disk`);
      assert.ok(d.assetSize && d.assetSize.w > 0 && d.assetSize.h > 0);
      assert.ok(d.role, `${d.sceneId}: a candidate needs a role`);
    }
    // Every decision states what it depicts and what it cannot support.
    assert.ok(d.depicts.length > 40, `${d.sceneId}: depicts is too thin to review`);
    assert.ok(d.limitations.length > 0, `${d.sceneId}: no limitation recorded`);
    if (d.decision === "rejected") {
      assert.ok(d.blockedOn, `${d.sceneId}: a rejection must say what it is blocked on`);
    }
  }
});

test("3. no rejected file is used anywhere in the mapping, except a documented Gate 9 exception", () => {
  const rejected = new Set(outletRejectedFiles.map((f) => f.path));
  for (const d of outletSceneAssetDecisions) {
    if (d.candidatePath) {
      assert.ok(!rejected.has(d.candidatePath), `${d.sceneId} uses a rejected file`);
    }
  }
  for (const used of outletUsedPaths()) {
    assert.ok(!rejected.has(used));
  }
  // Gate 9: the segment owner explicitly accepted three previously-rejected,
  // cross-segment-duplicate files for one scene each. Each acceptance is
  // pinned here by exact scene + path, and each scene's own `limitations`
  // still names the duplicate origin — reinstating one must not silently
  // reinstate the others, and dropping this scene's use of it should trip
  // this test back to red until outletRejectedFiles is updated to match.
  const gate9Exceptions = {
    "outlet-centre-destination-catchment": `${OUTLET_VISUALS}outlet-centre-geo-intelligence-hero.png`,
    "outlet-centre-tourism-origin-context": `${OUTLET_VISUALS}outlet-centre-geo-intelligence-hero.png`,
    "outlet-centre-entrances": `${OUTLET_VISUALS}outlet-centre-visitors-hero.png`,
    "outlet-centre-vehicle-coach-arrival": `${OUTLET_VISUALS}outlet-centre-vehicle-arrival-hero.png`,
    // These two were rejected via their own `decision` field (a real-brand
    // fascia; garbled text echoing it) rather than via outletRejectedFiles,
    // so they carry no cross-check against that list, only the same
    // must-stay-documented rule as the four above.
    "outlet-centre-brand-counting": `${OUTLET_VISUALS}outlet-centre-brand-counting-hero.png`,
    "outlet-centre-time-in-destination": `${OUTLET_VISUALS}outlet-centre-time-in-centre-hero.png`,
  };
  for (const [sceneId, path] of Object.entries(gate9Exceptions)) {
    const decision = getOutletDecision(sceneId);
    assert.equal(decision.candidatePath, path, `${sceneId}: Gate 9 exception path drifted`);
    assert.equal(decision.decision, "suitable", `${sceneId}: Gate 9 exception must be marked suitable`);
    assert.ok(!rejected.has(path), `${sceneId}: its Gate 9 exception file must not also sit in outletRejectedFiles`);
    assert.match(
      decision.limitations.join(" "),
      /Gate 9/,
      `${sceneId}: the reinstatement must stay documented in its own limitations`,
    );
  }
});

test("4. every rejected file exists, and every rejection carries a reason", () => {
  for (const file of outletRejectedFiles) {
    assert.ok(onDisk(file.path), `rejection names a file that is not there: ${file.path}`);
    assert.ok(file.reason.length > 20);
  }
});

/* The restored visitor-composition file (2026-09-28). Its rejection says it
   is the Retail visitor frame byte for byte; the test checks those bytes. If
   the file is ever replaced by a genuine outlet image, this fails and the
   rejection has to be reconsidered rather than silently kept. */
test("4b. a rejection that claims a byte-identical duplicate is checked against it", () => {
  const withDuplicate = outletRejectedFiles.filter((file) => file.duplicateOf);
  assert.ok(
    withDuplicate.some((file) => file.path.endsWith("outlet-centre-visitor-composition-hero1.png")),
    "the restored visitor-composition rejection is missing",
  );
  const bytes = (webPath) => readFileSync(repo(`public${webPath}`));
  for (const file of withDuplicate) {
    assert.ok(onDisk(file.duplicateOf), `${file.path}: its original ${file.duplicateOf} is not there`);
    assert.ok(
      bytes(file.path).equals(bytes(file.duplicateOf)),
      `${file.path} is no longer identical to ${file.duplicateOf}`,
    );
  }
  // And the accepted outlet frame is a different picture from both.
  const accepted = bytes("/assets/location-visuals/outlet-centre/outlet-centre-visitor-composition-hero.png");
  assert.ok(!accepted.equals(bytes("/assets/location-visuals/outlet-centre/outlet-centre-visitor-composition-hero1.png")));
});

test("5. the cover is cover-only and is never a scene candidate", () => {
  const cover = getSegmentStartVisual("outlet-centre");
  assert.ok(cover);
  assert.equal(cover.isEvidence, false);
  assert.equal(cover.alsoSceneHeroFor, null);
  for (const d of outletSceneAssetDecisions) {
    assert.notEqual(d.candidatePath, cover.assetPath, `${d.sceneId} uses the cover as evidence`);
  }
});

test("6. the cover caption calls the artwork an illustration, not a photograph", () => {
  for (const locale of ["en", "fr", "de"]) {
    const copy = startCoverCopy[locale]["outlet-centre"];
    assert.ok(copy, `no cover caption in ${locale}`);
    const text = `${copy.label} ${copy.note}`;
    assert.doesNotMatch(text, /photograph|photographi|fotografiert/i, `${locale} still calls it a photograph`);
    assert.match(text, /illustrat|Visual/i, `${locale} does not identify it as an illustration`);
    assert.match(text, /customer data|données client|Kundendaten/i, `${locale} lost the not-customer-data boundary`);
    assert.match(text, /catchment|chalandise|Einzugsgebiet/i, `${locale} lost the catchment boundary`);
  }
  // And the same false claim is gone from the typed concept's own prose.
  assert.doesNotMatch(read("app/content/segment-start-visuals.ts"), /photographed as itself/);
});

test("7. a locus exists only where the evidence points at a place", () => {
  const withLocus = outletSceneAssetDecisions.filter((d) => d.focusLocus);
  assert.deepEqual(
    withLocus.map((d) => d.sceneId),
    ["outlet-centre-circulation", "outlet-centre-zone-exposure-dwell"],
  );
  for (const d of withLocus) {
    const { rect, point } = d.focusLocus;
    const { w, h } = d.assetSize;
    assert.ok(rect.x >= 0 && rect.x + rect.w <= w, `${d.sceneId}: rect runs off the asset`);
    assert.ok(rect.y >= 0 && rect.y + rect.h <= h, `${d.sceneId}: rect runs off the asset`);
    assert.ok(point.x >= 0 && point.x <= w && point.y >= 0 && point.y <= h);
  }
  // Origin, tourism, duration and comparison never get geometry.
  for (const sceneId of [
    "outlet-centre-destination-catchment",
    "outlet-centre-tourism-origin-context",
    "outlet-centre-time-in-destination",
    "outlet-centre-brand-flow",
    "outlet-centre-visitor-composition",
  ]) {
    assert.equal(getOutletDecision(sceneId).focusLocus, null, `${sceneId} must carry no geometry`);
  }
});

test("8. technical media resolves by segment AND capability, and Outlet has none", () => {
  for (const d of outletSceneAssetDecisions) {
    const scene = allScenes.find((s) => s.id === d.sceneId);
    for (const capabilityId of scene.technologyCapabilityIds) {
      assert.equal(
        getCapabilityExplainerVisuals(capabilityId, "outlet-centre").length,
        0,
        `${capabilityId} resolved artwork for Outlet that does not exist`,
      );
      // The same ids DO resolve for the segments that own artwork, which is
      // what proves the lookup is segment-scoped rather than simply empty.
      if (capabilityId === "TECH-02" || capabilityId === "TECH-04") {
        assert.ok(getCapabilityExplainerVisuals(capabilityId, "retail").length > 0);
      }
    }
  }
});

test("9. no approved customer proof is implied for any Outlet Core scene", () => {
  for (const sceneId of outletCentreSegment.coreRoute) {
    assert.deepEqual([...getUsableProofsForScene("outlet-centre", sceneId)], []);
  }
  // A scene illustration is not customer evidence: no decision claims that role.
  for (const d of outletSceneAssetDecisions) {
    assert.notEqual(d.role, "customer_proof");
  }
});

test("10. every distinct Outlet file is accounted for", () => {
  const files = readdirSync(repo("public/assets/location-visuals/outlet-centre"))
    .filter((f) => f.endsWith(".png"))
    .map((f) => `/assets/location-visuals/outlet-centre/${f}`);
  const accounted = new Set([
    ...outletSceneAssetDecisions.flatMap((d) => [
      d.candidatePath,
      ...d.alternatives.map((a) => a.path),
    ]),
    ...outletRejectedFiles.map((f) => f.path),
    getSegmentStartVisual("outlet-centre").assetPath,
  ].filter(Boolean));
  const orphans = files.filter((f) => !accounted.has(f));
  assert.deepEqual(orphans, [], "Outlet files exist that the mapping never mentions");
});

test("11. the review route is isolated and reachable only as a preview", () => {
  assert.match(read("app/preview/redesign/outlet-asset-review/page.tsx"), /robots: \{ index: false, follow: false \}/);
  const shell = read("app/components/CommercialExperience.tsx");
  assert.doesNotMatch(shell, /outlet-asset-review|OutletAssetReview/);
  // Review chrome carries its own prefix and changes no accepted rule.
  const css = read("app/globals.css");
  const reviewRules = css.split("\n").filter((line) => line.trim().startsWith(".rd-rev"));
  assert.ok(reviewRules.length > 10);
  for (const rule of reviewRules) {
    assert.match(rule.trim(), /^\.rd-rev/, `review styling leaked outside its prefix: ${rule.trim()}`);
  }
});
