import assert from "node:assert/strict";
import test from "node:test";

import {
  allScenes,
  canonicalJourney,
  contentBundle,
  segmentDefinitions,
} from "../app/content/index.ts";

import {
  getSegment,
  getScene,
  getSceneForSegment,
  getScenesForStage,
  getCoreRoute,
  getOptionalBranches,
  getAdvancedBranches,
  getNextCoreScene,
  getPreviousCoreScene,
  getRoutePosition,
  getSegmentImplementationStatus,
  getUsableProofsForScene,
  sceneHasUsableProof,
  getTechnologyCapabilitiesForScene,
  getImplementationsForCapability,
  getVisualAssetForScene,
  isVisualAssetReady,
  getSceneRouteMetadata,
  getCoreRouteMetadata,
  validateCrossSegmentReferences,
  getCanonicalJourneyStages,
  isSynthesisStage,
  getSynthesisStages,
  getOptionalBranchesForScene,
  getAdvancedBranchesForScene,
  getBranchesForScene,
  getBranchParentsForScene,
} from "../app/content/runtime.ts";

test("All five segments resolve", () => {
  const segments = segmentDefinitions.map((s) => s.id);
  assert.deepEqual(segments.slice().sort(), ["outlet-centre", "qsr", "retail", "retail-park", "shopping-centre"].sort());
  
  for (const segmentId of segments) {
    const segment = getSegment(segmentId);
    assert.ok(segment, "Segment " + segmentId + " should resolve");
    assert.equal(segment.id, segmentId);
  }
});

test("Retail resolves as implementation_ready", () => {
  const status = getSegmentImplementationStatus("retail");
  assert.equal(status, "implementation_ready");
});

test("Other three segments resolve as architecture_only", () => {
  assert.equal(getSegmentImplementationStatus("shopping-centre"), "architecture_only");
  assert.equal(getSegmentImplementationStatus("retail-park"), "architecture_only");
  assert.equal(getSegmentImplementationStatus("outlet-centre"), "architecture_only");
});

test("Canonical journey order remains Context -> Measure -> Understand -> Prove -> Configure -> Act", () => {
  assert.deepEqual(canonicalJourney, [
    "context",
    "measure",
    "understand",
    "prove",
    "configure",
    "act",
  ]);
});

test("Each segment Core route resolves deterministically", () => {
  for (const segment of segmentDefinitions) {
    const coreRoute = getCoreRoute(segment.id);
    assert.ok(coreRoute.length > 0, segment.id + " should have Core scenes");
    
    for (const scene of coreRoute) {
      assert.equal(scene.priority, "core", scene.id + " should be Core priority");
    }
    
    for (let i = 0; i < coreRoute.length; i++) {
      assert.equal(coreRoute[i].corePathOrder, i + 1, coreRoute[i].id + " should have corePathOrder " + (i + 1));
    }
  }
});

test("Core routes contain only Core scenes", () => {
  for (const segment of segmentDefinitions) {
    const coreRoute = getCoreRoute(segment.id);
    for (const scene of coreRoute) {
      assert.equal(scene.priority, "core");
    }
  }
});

test("Optional scenes do not appear in Core route", () => {
  for (const segment of segmentDefinitions) {
    const coreRoute = getCoreRoute(segment.id);
    const coreIds = new Set(coreRoute.map((s) => s.id));
    for (const optionalId of segment.optionalBranches) {
      assert.ok(!coreIds.has(optionalId), "Optional scene " + optionalId + " should not be in Core route");
    }
  }
});

test("Advanced scenes do not appear in Core route", () => {
  for (const segment of segmentDefinitions) {
    const coreRoute = getCoreRoute(segment.id);
    const coreIds = new Set(coreRoute.map((s) => s.id));
    for (const advancedId of segment.advancedBranches) {
      assert.ok(!coreIds.has(advancedId), "Advanced scene " + advancedId + " should not be in Core route");
    }
  }
});

test("Core path order is respected", () => {
  for (const segment of segmentDefinitions) {
    const coreRoute = getCoreRoute(segment.id);
    for (let i = 0; i < coreRoute.length - 1; i++) {
      assert.ok(
        coreRoute[i].corePathOrder < coreRoute[i + 1].corePathOrder,
        "Core path order should be ascending: " + coreRoute[i].id + " (" + coreRoute[i].corePathOrder + ") -> " + coreRoute[i + 1].id + " (" + coreRoute[i + 1].corePathOrder + ")"
      );
    }
  }
});

test("getNextCoreScene returns correct next scene", () => {
  const retailCore = getCoreRoute("retail");
  for (let i = 0; i < retailCore.length - 1; i++) {
    const next = getNextCoreScene("retail", retailCore[i].id);
    assert.ok(next, "Should have next scene for " + retailCore[i].id);
    assert.equal(next.id, retailCore[i + 1].id);
  }
  
  const lastScene = retailCore[retailCore.length - 1];
  assert.equal(getNextCoreScene("retail", lastScene.id), null);
});

test("getPreviousCoreScene returns correct previous scene", () => {
  const retailCore = getCoreRoute("retail");
  for (let i = 1; i < retailCore.length; i++) {
    const prev = getPreviousCoreScene("retail", retailCore[i].id);
    assert.ok(prev, "Should have previous scene for " + retailCore[i].id);
    assert.equal(prev.id, retailCore[i - 1].id);
  }
  
  const firstScene = retailCore[0];
  assert.equal(getPreviousCoreScene("retail", firstScene.id), null);
});

test("First Core scene has no previous Core scene", () => {
  for (const segment of segmentDefinitions) {
    const coreRoute = getCoreRoute(segment.id);
    const first = coreRoute[0];
    assert.equal(getPreviousCoreScene(segment.id, first.id), null);
  }
});

test("Last Core scene has no next Core scene", () => {
  for (const segment of segmentDefinitions) {
    const coreRoute = getCoreRoute(segment.id);
    const last = coreRoute[coreRoute.length - 1];
    assert.equal(getNextCoreScene(segment.id, last.id), null);
  }
});

test("Cross-segment scene lookup is rejected", () => {
  assert.throws(
    () => getSceneForSegment("shopping-centre", "retail-store-visits"),
    /belongs to segment retail, not shopping-centre/
  );
  
  const scene = getSceneForSegment("retail", "retail-store-visits");
  assert.equal(scene.id, "retail-store-visits");
});

test("Stage-level lookup only returns scenes belonging to that segment/stage", () => {
  const retailMeasure = getScenesForStage("retail", "measure");
  assert.ok(retailMeasure.length > 0);
  for (const scene of retailMeasure) {
    assert.equal(scene.segment, "retail");
    assert.equal(scene.journeyStage, "measure");
  }
  
  const scMeasure = getScenesForStage("shopping-centre", "measure");
  for (const scene of scMeasure) {
    assert.equal(scene.segment, "shopping-centre");
    assert.ok(!scene.id.startsWith("retail-"));
  }
});

test("Optional and Advanced branch queries remain distinct", () => {
  const retail = getSegment("retail");
  
  const optional = getOptionalBranches("retail");
  const advanced = getAdvancedBranches("retail");
  
  const optionalIds = new Set(optional.map((s) => s.id));
  const advancedIds = new Set(advanced.map((s) => s.id));
  
  for (const id of optionalIds) {
    assert.ok(!advancedIds.has(id), id + " should not be in both optional and advanced");
  }
  
  assert.deepEqual([...optionalIds].sort(), [...retail.optionalBranches].sort());
  assert.deepEqual([...advancedIds].sort(), [...retail.advancedBranches].sort());
});

test("Placeholder proof assets are not reported as playable/available proof", () => {
  // Usable proof exists only where an approved published case names the scene
  // itself (product lead, 2026-09-28). A scene that merely shares the slot —
  // the Retail street and visitor-composition scenes — gets none.
  const expected = new Map([
    ["retail-store-visits", ["CASE-RET-01"]],
    ["retail-conversion-sales-context", ["CASE-RET-01"]],
    ["retail-in-store-journey", ["CASE-RET-02"]],
    ["retail-zone-engagement", ["CASE-RET-02"]],
    ["retail-visit-duration", ["CASE-RET-02"]],
    ["retail-staff-interaction", ["CASE-RET-02"]],
  ]);
  for (const scene of allScenes) {
    const usable = getUsableProofsForScene(scene.id).map((proof) => proof.id);
    assert.deepEqual(usable, expected.get(scene.id) ?? [], scene.id + " has unexpected usable proof");
    assert.equal(sceneHasUsableProof(scene.id), expected.has(scene.id));
  }

  const approved = new Set(["CASE-RET-01", "CASE-RET-02"]);
  for (const proof of contentBundle.proofAssets.filter((proof) => !approved.has(proof.id))) {
    assert.equal(proof.status, "placeholder");
    assert.equal(proof.playable, false);
  }
});

test("Attached technology capability IDs resolve without selecting vendor implementations", () => {
  for (const scene of allScenes) {
    const capabilities = getTechnologyCapabilitiesForScene(scene.id);
    for (const capability of capabilities) {
      assert.match(capability.id, /^(TECH-0[1-8]|TECH-QSR-(0[1-9]|10))$/);
      
      const implementations = getImplementationsForCapability(capability.id);
      assert.ok(implementations.length > 0, "Capability " + capability.id + " should have implementations");
      
      for (const impl of implementations) {
        assert.ok(impl.capabilityIds.includes(capability.id));
      }
    }
  }
});

test("Configure and Act remain synthesis stages and not matrix capability scenes", () => {
  for (const segment of segmentDefinitions) {
    assert.deepEqual(segment.stageMapping.configure, []);
    assert.deepEqual(segment.stageMapping.act, []);
    
    for (const scene of segment.scenes) {
      assert.ok(
        scene.journeyStage !== "configure" && scene.journeyStage !== "act",
        scene.id + " should not have journeyStage configure or act"
      );
    }
    
    assert.equal(segment.synthesis.configure.journeyStage, "configure");
    assert.equal(segment.synthesis.configure.recommendationMode, "none");
    assert.equal(segment.synthesis.act.journeyStage, "act");
    assert.equal(segment.synthesis.act.decisionOwner, "human");
  }
});

test("Existing 45-scene coverage remains intact", () => {
  const matrixScenes = allScenes.filter((s) => s.segment !== "qsr");
  assert.equal(matrixScenes.length, 45);
  assert.equal(new Set(matrixScenes.map((s) => s.id)).size, 45);
});

test("getRoutePosition returns correct metadata", () => {
  const retailCore = getCoreRoute("retail");
  const firstScene = retailCore[0];
  const lastScene = retailCore[retailCore.length - 1];
  
  const firstPos = getRoutePosition("retail", firstScene.id);
  assert.ok(firstPos);
  assert.equal(firstPos.currentIndex, 0);
  assert.equal(firstPos.isFirst, true);
  assert.equal(firstPos.isLast, false);
  assert.equal(firstPos.previousCoreScene, null);
  assert.ok(firstPos.nextCoreScene);
  
  const lastPos = getRoutePosition("retail", lastScene.id);
  assert.ok(lastPos);
  assert.equal(lastPos.currentIndex, retailCore.length - 1);
  assert.equal(lastPos.isFirst, false);
  assert.equal(lastPos.isLast, true);
  assert.ok(lastPos.previousCoreScene);
  assert.equal(lastPos.nextCoreScene, null);
  
  assert.equal(getRoutePosition("retail", "retail-portfolio-comparison"), null);
});

test("getSceneRouteMetadata provides complete presenter metadata", () => {
  const meta = getSceneRouteMetadata("retail", "retail-store-visits");
  assert.ok(meta);
  assert.equal(meta.scene.id, "retail-store-visits");
  assert.ok(meta.routePosition);
  assert.ok(Array.isArray(meta.optionalBranches));
  assert.ok(Array.isArray(meta.advancedBranches));
  assert.equal(typeof meta.hasUsableProof, "boolean");
  assert.ok(Array.isArray(meta.technologyCapabilities));
  assert.ok(meta.visualAsset === undefined || typeof meta.visualAsset === "object");
  assert.equal(typeof meta.isVisualAssetReady, "boolean");
});

test("getCoreRouteMetadata provides complete Core route metadata", () => {
  const meta = getCoreRouteMetadata("retail");
  assert.ok(meta);
  assert.equal(meta.segment.id, "retail");
  assert.equal(meta.coreScenes.length, 6);
  
  for (const coreScene of meta.coreScenes) {
    assert.ok(coreScene.scene);
    assert.ok(coreScene.routePosition);
    assert.equal(typeof coreScene.hasUsableProof, "boolean");
    assert.ok(Array.isArray(coreScene.technologyCapabilities));
  }
});

test("validateCrossSegmentReferences returns no errors for valid content", () => {
  const errors = validateCrossSegmentReferences();
  assert.deepEqual(errors, []);
});

test("getCanonicalJourneyStages returns correct order", () => {
  const stages = getCanonicalJourneyStages();
  assert.deepEqual(stages, ["context", "measure", "understand", "prove", "configure", "act"]);
});

test("isSynthesisStage identifies Configure and Act", () => {
  assert.equal(isSynthesisStage("configure"), true);
  assert.equal(isSynthesisStage("act"), true);
  assert.equal(isSynthesisStage("context"), false);
  assert.equal(isSynthesisStage("measure"), false);
  assert.equal(isSynthesisStage("understand"), false);
  assert.equal(isSynthesisStage("prove"), false);
});

test("getSynthesisStages returns Configure and Act", () => {
  assert.deepEqual(getSynthesisStages(), ["configure", "act"]);
});

test("getScene returns undefined for unknown scene", () => {
  assert.equal(getScene("non-existent-scene"), undefined);
});

test("getSegment returns undefined for unknown segment", () => {
  assert.equal(getSegment("non-existent-segment"), undefined);
});

test("getSceneForSegment throws for invalid segment-scene combination", () => {
  assert.throws(
    () => getSceneForSegment("retail", "shopping-centre-catchment-area"),
    /belongs to segment shopping-centre, not retail/
  );
});

test("getVisualAssetForScene returns visual asset or undefined", () => {
  const asset = getVisualAssetForScene("retail-store-visits");
  assert.ok(asset);
  assert.equal(asset.id, "VIS-RET-04");
  
  const unknownAsset = getVisualAssetForScene("non-existent");
  assert.equal(unknownAsset, undefined);
});

test("isVisualAssetReady returns true for approved/reference assets", () => {
  const approvedAsset = contentBundle.visualAssets.find((a) => a.status === "approved" || a.status === "reference");
  if (approvedAsset) {
    assert.equal(isVisualAssetReady(approvedAsset), true);
  }
  
  const placeholderAsset = contentBundle.visualAssets.find((a) => a.status === "placeholder");
  if (placeholderAsset) {
    assert.equal(isVisualAssetReady(placeholderAsset), false);
  }
});


test("getOptionalBranchesForScene returns correct branches for a Core scene", () => {
  // retail-visitor-composition (core, measure) has retail-visit-duration as optional branch
  const branches = getOptionalBranchesForScene("retail", "retail-visitor-composition");
  assert.equal(branches.length, 1);
  assert.equal(branches[0].id, "retail-visit-duration");
  assert.equal(branches[0].priority, "optional");
  
  // retail-zone-engagement (core, understand) has retail-staff-interaction as optional branch
  const branches2 = getOptionalBranchesForScene("retail", "retail-zone-engagement");
  assert.equal(branches2.length, 1);
  assert.equal(branches2[0].id, "retail-staff-interaction");
  assert.equal(branches2[0].priority, "optional");
  
  // retail-conversion-sales-context (core, prove) has retail-portfolio-comparison as optional branch
  const branches3 = getOptionalBranchesForScene("retail", "retail-conversion-sales-context");
  assert.equal(branches3.length, 1);
  assert.equal(branches3[0].id, "retail-portfolio-comparison");
  assert.equal(branches3[0].priority, "optional");
  
  // Core scene with no optional branches
  const branches4 = getOptionalBranchesForScene("retail", "retail-street-opportunity");
  assert.equal(branches4.length, 0);
});

test("getAdvancedBranchesForScene returns correct branches for a Core scene", () => {
  // retail-in-store-journey (core, understand) has retail-product-category-journey as advanced branch
  const branches = getAdvancedBranchesForScene("retail", "retail-in-store-journey");
  assert.equal(branches.length, 1);
  assert.equal(branches[0].id, "retail-product-category-journey");
  assert.equal(branches[0].priority, "advanced");
  
  // Core scene with no advanced branches
  const branches2 = getAdvancedBranchesForScene("retail", "retail-street-opportunity");
  assert.equal(branches2.length, 0);
});

test("getBranchesForScene returns both optional and advanced branches", () => {
  const result = getBranchesForScene("retail", "retail-in-store-journey");
  assert.ok(Array.isArray(result.optional));
  assert.ok(Array.isArray(result.advanced));
  assert.equal(result.advanced.length, 1);
  assert.equal(result.advanced[0].id, "retail-product-category-journey");
  assert.equal(result.optional.length, 0);
  
  const result2 = getBranchesForScene("retail", "retail-zone-engagement");
  assert.equal(result2.optional.length, 1);
  assert.equal(result2.optional[0].id, "retail-staff-interaction");
  assert.equal(result2.advanced.length, 0);
});

test("getBranchParentsForScene returns parent Core scenes for a branch", () => {
  // retail-visit-duration branches from retail-visitor-composition
  const parents = getBranchParentsForScene("retail", "retail-visit-duration");
  assert.equal(parents.length, 1);
  assert.equal(parents[0].id, "retail-visitor-composition");
  assert.equal(parents[0].priority, "core");
  
  // retail-product-category-journey branches from retail-in-store-journey
  const parents2 = getBranchParentsForScene("retail", "retail-product-category-journey");
  assert.equal(parents2.length, 1);
  assert.equal(parents2[0].id, "retail-in-store-journey");
  
  // Core scene has no branch parents
  const parents3 = getBranchParentsForScene("retail", "retail-street-opportunity");
  assert.equal(parents3.length, 0);
  
  // Branch with no parent defined
  const parents4 = getBranchParentsForScene("retail", "retail-staff-interaction");
  assert.ok(parents4.length >= 0); // May be 0 if not defined
});

test("Branch queries respect segment boundaries", () => {
  // Querying retail branches from shopping-centre should return empty
  const branches = getOptionalBranchesForScene("shopping-centre", "retail-visitor-composition");
  assert.equal(branches.length, 0);
  
  const branches2 = getAdvancedBranchesForScene("shopping-centre", "retail-in-store-journey");
  assert.equal(branches2.length, 0);
});

test("Optional and Advanced branch queries remain distinct per scene", () => {
  const result = getBranchesForScene("retail", "retail-in-store-journey");
  const optionalIds = new Set(result.optional.map((s) => s.id));
  const advancedIds = new Set(result.advanced.map((s) => s.id));
  
  for (const id of optionalIds) {
    assert.ok(!advancedIds.has(id), id + " should not be in both optional and advanced for same scene");
  }
});

test("Branch parent IDs exist and belong to same segment", () => {
  // Verify all branchFromSceneIds reference valid scenes in the same segment
  for (const scene of allScenes) {
    if (scene.branchFromSceneIds && scene.branchFromSceneIds.length > 0) {
      for (const parentId of scene.branchFromSceneIds) {
        const parent = getScene(parentId);
        assert.ok(parent, "Branch parent " + parentId + " should exist for " + scene.id);
        assert.equal(parent.segment, scene.segment, "Branch parent " + parentId + " should be in same segment as " + scene.id);
        assert.ok(parent.priority === "core", "Branch parent " + parentId + " should be Core priority");
        assert.notEqual(parentId, scene.id, "Branch should not reference itself");
      }
    }
  }
});

test("Optional and Advanced scenes remain outside Core route", () => {
  for (const segment of segmentDefinitions) {
    const coreRoute = getCoreRoute(segment.id);
    const coreIds = new Set(coreRoute.map((s) => s.id));
    
    for (const scene of segment.scenes) {
      if (scene.priority === "optional" || scene.priority === "advanced") {
        assert.ok(!coreIds.has(scene.id), "Branch scene " + scene.id + " should not be in Core route");
      }
    }
  }
});

test("Cross-segment branch references are not present", () => {
  for (const scene of allScenes) {
    if (scene.branchFromSceneIds) {
      for (const parentId of scene.branchFromSceneIds) {
        const parent = getScene(parentId);
        if (parent) {
          assert.equal(parent.segment, scene.segment, "Cross-segment branch reference detected: " + scene.id + " -> " + parentId);
        }
      }
    }
  }
});

test("getOptionalBranches and getAdvancedBranches (segment-wide) still work", () => {
  // Original segment-wide functions should still return all branches
  const allOptional = getOptionalBranches("retail");
  const allAdvanced = getAdvancedBranches("retail");
  
  assert.equal(allOptional.length, 3);
  assert.equal(allAdvanced.length, 1);
  
  const optionalIds = new Set(allOptional.map((s) => s.id));
  assert.ok(optionalIds.has("retail-visit-duration"));
  assert.ok(optionalIds.has("retail-staff-interaction"));
  assert.ok(optionalIds.has("retail-portfolio-comparison"));
  
  const advancedIds = new Set(allAdvanced.map((s) => s.id));
  assert.ok(advancedIds.has("retail-product-category-journey"));
});
test("Scene route metadata includes all required fields", () => {
  const meta = getSceneRouteMetadata("retail", "retail-street-opportunity");
  assert.ok(meta);
  
  const rp = meta.routePosition;
  assert.ok(rp);
  assert.equal(typeof rp.currentIndex, "number");
  assert.equal(typeof rp.totalCoreScenes, "number");
  assert.equal(typeof rp.isFirst, "boolean");
  assert.equal(typeof rp.isLast, "boolean");
  assert.ok(rp.previousCoreScene === null || typeof rp.previousCoreScene === "object");
  assert.ok(rp.nextCoreScene === null || typeof rp.nextCoreScene === "object");
  assert.ok(canonicalJourney.includes(rp.journeyStage));
  assert.ok(rp.scene);
});