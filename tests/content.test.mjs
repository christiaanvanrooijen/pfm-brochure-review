import assert from "node:assert/strict";
import test from "node:test";

import {
  allScenes,
  canonicalJourney,
  contentBundle,
  proofAssets,
  retailSegment,
  segmentDefinitions,
  technologyCapabilities,
  technologyImplementations,
  validateContentBundle,
  visualAssets,
} from "../app/content/index.ts";

test("the typed content domain preserves the canonical journey order", () => {
  assert.deepEqual(canonicalJourney, [
    "context",
    "measure",
    "understand",
    "prove",
    "configure",
    "act",
  ]);
});

test("all five segment definitions pass deterministic content validation", () => {
  assert.deepEqual(segmentDefinitions.map((segment) => segment.id), [
    "retail",
    "shopping-centre",
    "retail-park",
    "outlet-centre",
    "qsr",
  ]);
  assert.deepEqual(validateContentBundle(contentBundle), []);
});

test("the Retail Core path is complete and ordered for the presenter route", () => {
  assert.equal(retailSegment.implementationStatus, "implementation_ready");
  assert.equal(retailSegment.coreRoute.length, 6);
  assert.deepEqual(
    retailSegment.coreRoute.map((id) =>
      retailSegment.scenes.find((scene) => scene.id === id)?.corePathOrder,
    ),
    [1, 2, 3, 4, 5, 6],
  );
  assert.ok(retailSegment.coreRoute.every((id) =>
    retailSegment.scenes.find((scene) => scene.id === id)?.priority === "core"));
});

test("every Retail Core scene's nextSceneId follows the Core route order", () => {
  // Regression guard: `retail-store-visits.nextSceneId` once pointed straight at
  // `retail-in-store-journey`, silently skipping `retail-visitor-composition`
  // even though `coreRoute` places it next. The typed next-scene pointer must
  // agree with the Core route for every Core scene that has a successor.
  const sceneById = new Map(retailSegment.scenes.map((scene) => [scene.id, scene]));
  const route = retailSegment.coreRoute;

  assert.equal(
    sceneById.get("retail-store-visits")?.nextSceneId,
    "retail-visitor-composition",
  );
  assert.equal(
    sceneById.get("retail-visitor-composition")?.nextSceneId,
    "retail-in-store-journey",
  );

  for (let index = 0; index < route.length - 1; index += 1) {
    assert.equal(
      sceneById.get(route[index])?.nextSceneId,
      route[index + 1],
      `${route[index]} should hand over to ${route[index + 1]}`,
    );
  }
});

test("the last Retail Core scene has no next scene and never points at a branch", () => {
  // Regression guard, same fault class as the `retail-store-visits` fix above:
  // `retail-conversion-sales-context.nextSceneId` once pointed at
  // `retail-portfolio-comparison`, which is an Optional branch of this very
  // scene rather than a continuation of the Core route. The last Core scene has
  // no successor at all — Configure and Act are synthesis stages with empty
  // scene arrays — so its next-scene pointer must stay undefined, and a branch
  // must never be reachable as a Core scene's primary next step.
  const sceneById = new Map(retailSegment.scenes.map((scene) => [scene.id, scene]));
  const route = retailSegment.coreRoute;
  const last = sceneById.get(route[route.length - 1]);

  assert.equal(last?.id, "retail-conversion-sales-context");
  assert.equal(last?.nextSceneId, undefined);
  assert.equal(retailSegment.stageMapping.configure.length, 0);
  assert.equal(retailSegment.stageMapping.act.length, 0);

  const branchIds = new Set([
    ...retailSegment.optionalBranches,
    ...retailSegment.advancedBranches,
  ]);
  for (const id of route) {
    const next = sceneById.get(id)?.nextSceneId;
    assert.ok(
      next === undefined || !branchIds.has(next),
      `${id} must not hand over to the branch scene ${next}`,
    );
  }
});

test("all 45 matrix scenes are represented exactly once", () => {
  // QSR is not a matrix segment: its 12 scenes come from the QSR specification,
  // so the matrix coverage assertion is scoped to the four matrix segments.
  const matrixScenes = allScenes.filter((scene) => scene.segment !== "qsr");
  assert.equal(matrixScenes.length, 45);
  assert.equal(new Set(matrixScenes.map((scene) => scene.id)).size, 45);
  assert.equal(new Set(allScenes.map((scene) => scene.id)).size, allScenes.length);
  assert.deepEqual(
    segmentDefinitions.map((segment) => segment.scenes.length),
    [10, 12, 10, 13, 12],
  );
});

test("every scene technology capability ID resolves", () => {
  const capabilityIds = new Set(technologyCapabilities.map((capability) => capability.id));
  for (const scene of allScenes) {
    for (const id of scene.technologyCapabilityIds) assert.ok(capabilityIds.has(id), `${scene.id}: ${id}`);
  }
  assert.deepEqual(technologyCapabilities.map((capability) => capability.id), [
    "TECH-01", "TECH-02", "TECH-03", "TECH-04",
    "TECH-05", "TECH-06", "TECH-07", "TECH-08",
    "TECH-QSR-01", "TECH-QSR-02", "TECH-QSR-03", "TECH-QSR-04", "TECH-QSR-05",
    "TECH-QSR-06", "TECH-QSR-07", "TECH-QSR-08", "TECH-QSR-09", "TECH-QSR-10",
  ]);
});

test("technology implementations resolve independently from capability identities", () => {
  const capabilityIds = new Set(technologyCapabilities.map((capability) => capability.id));
  const implementationIds = new Set(technologyImplementations.map((item) => item.id));
  assert.equal(implementationIds.size, technologyImplementations.length);
  for (const implementation of technologyImplementations) {
    assert.ok(!capabilityIds.has(implementation.id));
    assert.ok(implementation.capabilityIds.every((id) => capabilityIds.has(id)));
  }
});

test("Xovis, Milesight and Isarsoft remain implementations rather than capabilities", () => {
  const capabilityIdentity = technologyCapabilities
    .map((capability) => `${capability.id} ${capability.name}`.toLowerCase())
    .join(" ");
  assert.doesNotMatch(capabilityIdentity, /xovis|milesight|isarsoft/);

  const xovisEntrance = technologyImplementations.find((item) => item.id === "impl-xovis-3d-entrance");
  const milesightEntrance = technologyImplementations.find((item) => item.id === "impl-milesight-vs125p-entrance");
  const isarsoftEntrance = technologyImplementations.find((item) => item.id === "impl-isarsoft-camera-analytics");
  assert.equal(xovisEntrance?.implementationRole, "Premium 3D");
  assert.equal(milesightEntrance?.implementationRole, "Basic 3D");
  assert.equal(isarsoftEntrance?.implementationRole, "Analytics on existing camera infrastructure");
  assert.match(isarsoftEntrance?.supportedClaims.join(" ") ?? "", /not a 3D sensor/);
});

test("Milesight VS361 is a passer-by option and never entrance counting", () => {
  const vs361 = technologyImplementations.find((item) => item.id === "impl-milesight-vs361-passerby");
  assert.ok(vs361);
  assert.deepEqual(vs361.capabilityIds, ["TECH-01"]);
  assert.ok(!vs361.capabilityIds.includes("TECH-02"));
});

test("capture rate and conversion dependencies are machine-readable", () => {
  const street = allScenes.find((scene) => scene.id === "retail-street-opportunity");
  const capture = street?.derivedDependencies.find((dependency) => dependency.id.includes("capture"));
  assert.deepEqual(capture?.requiredInputIds, ["aligned_passer_by_audience", "store_visits"]);

  const conversionScene = allScenes.find((scene) => scene.id === "retail-conversion-sales-context");
  const conversion = conversionScene?.derivedDependencies.find((dependency) => dependency.id === "retail-conversion-rate");
  assert.deepEqual(conversion?.requiredInputIds, ["store_visits", "transactions"]);
});

test("duration dependencies preserve alternative valid measurement methods", () => {
  for (const sceneId of [
    "retail-visit-duration",
    "shopping-centre-time-in-centre",
    "outlet-centre-time-in-destination",
  ]) {
    const scene = allScenes.find((item) => item.id === sceneId);
    const duration = scene?.derivedDependencies[0];
    assert.deepEqual(duration?.requiredInputIds, []);
    assert.deepEqual(duration?.alternativeInputGroups, [
      ["matched_visit_events"],
      ["trip_duration_events"],
    ]);
  }
});

test("proof placeholders are non-playable and validation rejects activation without approval", () => {
  // Two published cases are approved (product lead, 2026-09-28). Every other
  // proof asset is a placeholder and stays non-playable.
  const approved = new Set(["CASE-RET-01", "CASE-RET-02"]);
  assert.ok(
    proofAssets
      .filter((proof) => !approved.has(proof.id))
      .every((proof) => proof.status === "placeholder" && !proof.playable),
  );
  assert.ok(proofAssets.filter((proof) => approved.has(proof.id)).every((proof) => proof.externalUseApproved));
  // Activating a placeholder without approval is still rejected.
  const target = contentBundle.proofAssets.findIndex((proof) => proof.status === "placeholder");
  const invalidBundle = {
    ...contentBundle,
    proofAssets: contentBundle.proofAssets.map((proof, index) =>
      index === target ? { ...proof, playable: true } : proof),
  };
  const issueCodes = validateContentBundle(invalidBundle).map((issue) => issue.code);
  assert.ok(issueCodes.includes("unapproved_playable_proof"));
  assert.ok(issueCodes.includes("playable_placeholder"));
});

test("missing visuals remain typed placeholders without invented paths", () => {
  const placeholders = visualAssets.filter((asset) => asset.status === "placeholder");
  // 16 matrix, and no QSR: all twelve QSR visuals left the placeholder set once
  // their segment-specific artwork existed and was inspected. VIS-SC-05 left it
  // on 2026-08-19 when the Visitor composition hero was human-approved.
  assert.equal(placeholders.length, 16);
  assert.equal(placeholders.filter((asset) => asset.segment === "qsr").length, 0);
  assert.ok(placeholders.every((asset) => asset.assetPath === null));
  assert.deepEqual(validateContentBundle(contentBundle), []);
});

test("Configure and Act are synthesis stages and not matrix capability scenes", () => {
  for (const segment of segmentDefinitions) {
    assert.equal(segment.synthesis.configure.journeyStage, "configure");
    assert.equal(segment.synthesis.configure.recommendationMode, "none");
    assert.equal(segment.synthesis.act.journeyStage, "act");
    assert.equal(segment.synthesis.act.decisionOwner, "human");
    assert.deepEqual(segment.stageMapping.configure, []);
    assert.deepEqual(segment.stageMapping.act, []);
    assert.ok(segment.scenes.every((scene) => scene.journeyStage !== "configure" && scene.journeyStage !== "act"));
  }
});

test("visual and proof registries retain the documented readiness counts", () => {
  const matrixVisuals = visualAssets.filter((asset) => asset.segment !== "qsr");
  const matrixProofs = proofAssets.filter((proof) => proof.segment !== "qsr");
  assert.equal(matrixVisuals.length, 34);
  assert.equal(matrixVisuals.filter((asset) => asset.status === "reference").length, 5);
  // Shopping Centre heroes are signed off one scene at a time, so "approved"
  // grows as the segment is built: VIS-SC-01 (Centre entrances) moved
  // approval_required -> approved and VIS-SC-05 (Visitor composition) moved
  // placeholder -> approved, both on 2026-08-19.
  assert.equal(matrixVisuals.filter((asset) => asset.status === "approved").length, 2);
  assert.equal(matrixVisuals.filter((asset) => asset.status === "approval_required").length, 11);
  assert.equal(matrixVisuals.filter((asset) => asset.status === "placeholder").length, 16);
  assert.equal(matrixProofs.length, 13);
  const qsrVisuals = visualAssets.filter((asset) => asset.segment === "qsr");
  assert.equal(qsrVisuals.length, 12);
  assert.equal(qsrVisuals.filter((asset) => asset.status === "approved").length, 12);
  assert.equal(visualAssets.length, 46);
  assert.equal(proofAssets.length, 19);
});
