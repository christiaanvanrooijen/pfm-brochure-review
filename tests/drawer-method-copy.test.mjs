import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { allScenes, segmentDefinitions } from "../app/content/segments/index.ts";
import { getSceneCapabilityViews } from "../app/content/scene-technology-runtime.ts";
import { drawerMethodCopies, getDrawerMethodCopy } from "../app/content/drawer-method-copy.ts";
import { locales } from "../app/i18n/locales.ts";

const corePairs = () => {
  const pairs = new Map();
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((candidate) => candidate.id === sceneId);
      assert.ok(scene, `${sceneId} is not a scene`);
      for (const view of getSceneCapabilityViews(segment.id, scene)) {
        pairs.set(`${segment.id}/${view.capabilityId}`, [segment.id, view.capabilityId]);
      }
    }
  }
  return pairs;
};

test("every Core segment-capability pair has short translated method copy", () => {
  const pairs = corePairs();
  assert.equal(pairs.size, 26);
  assert.equal(drawerMethodCopies.length, pairs.size);

  for (const [key, [segmentId, capabilityId]] of pairs) {
    const method = getDrawerMethodCopy(segmentId, capabilityId);
    assert.ok(method, `${key} has no method copy`);
    for (const locale of locales) {
      const text = method.copy[locale];
      assert.ok(text.length >= 80, `${key} has short ${locale} copy`);
      assert.doesNotMatch(text, /Explain how|Expliquer comment|Erklären, wie/i, `${key} uses instruction copy`);
    }
    assert.ok(method.methodTypes.length > 0, `${key} has no method type`);
    if (!method.methodTypes.includes("operational")) {
      assert.ok(method.dataRoles.length > 0, `${key} has no data role`);
    }
    assert.ok(method.sourceRefs.length > 0, `${key} has no source locator`);
    for (const sourceRef of method.sourceRefs) assert.ok(sourceRef.length > 12, `${key} has a weak source locator`);
  }
});

test("method copy keeps the four source layers explicit", () => {
  const methodTypes = new Set(drawerMethodCopies.flatMap((entry) => entry.methodTypes));
  assert.deepEqual(
    [...methodTypes].sort(),
    ["business_input", "derived", "geo_context", "operational", "physical"],
  );

  const roleSets = new Set(drawerMethodCopies.map((entry) => entry.dataRoles.join("/")));
  assert.ok(roleSets.has("physical"));
  assert.ok(roleSets.has("mobile_geo/insight"));
  assert.ok(roleSets.has("business/insight"));
});

test("copy remains segment-specific and the drawer renders it in How it works", () => {
  const retailEntrance = getDrawerMethodCopy("retail", "TECH-02");
  const outletEntrance = getDrawerMethodCopy("outlet-centre", "TECH-02");
  assert.ok(retailEntrance && outletEntrance);
  assert.notEqual(retailEntrance.copy.en, outletEntrance.copy.en);

  const centreMovement = getDrawerMethodCopy("shopping-centre", "TECH-02", "shopping-centre-internal-circulation");
  const centreEntrance = getDrawerMethodCopy("shopping-centre", "TECH-02", "shopping-centre-entrances");
  assert.ok(centreMovement && centreEntrance);
  assert.notEqual(centreMovement.copy.en, centreEntrance.copy.en);
  const outletDuration = getDrawerMethodCopy("outlet-centre", "TECH-06", "outlet-centre-time-in-destination");
  assert.match(outletDuration?.copy.en ?? "", /plate data is not anonymous/i);

  const panel = readFileSync(new URL("../app/components/redesign/DepthPanel.tsx", import.meta.url), "utf8");
  assert.match(panel, /getDrawerMethodCopy/);
  assert.match(panel, /segmentId=\{segmentId\}/);
  assert.match(panel, /method\.copy\[locale\]/);
});
