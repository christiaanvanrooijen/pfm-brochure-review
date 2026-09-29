import assert from "node:assert/strict";
import test from "node:test";

import {
  allScenes,
  canonicalJourney,
  contentBundle,
  proofAssets,
  qsrActHypotheses,
  qsrConfigurePaths,
  qsrSegment,
  segmentDefinitions,
  technologyCapabilities,
  technologyImplementations,
  validateContentBundle,
  visualAssets,
} from "../app/content/index.ts";

import {
  getCoreRoute,
  getOptionalBranchesForScene,
  getBranchParentsForScene,
  getSceneForSegment,
  getSegment,
  getSegmentImplementationStatus,
  isSynthesisStage,
} from "../app/content/runtime.ts";

import {
  getCapabilitiesForScene,
  getImplementationsForCapability,
} from "../app/content/technology-runtime.ts";

import { getProofRuntimeForScene } from "../app/content/proof-runtime.ts";

import {
  getEvidenceForScene,
  getSceneDependencyAvailability,
  getDerivedDependencyAvailability,
  getSceneEvidenceRuntime,
} from "../app/content/evidence-runtime.ts";

import * as technologyRuntime from "../app/content/technology-runtime.ts";

import { qsrDriveThruStory } from "../app/lib/fixtures.ts";

const qsrScenes = qsrSegment.scenes;

// ---------------------------------------------------------------------------
// SEGMENT
// ---------------------------------------------------------------------------

// 1
test("QSR resolves as the fifth segment", () => {
  assert.equal(segmentDefinitions.length, 5);
  assert.equal(segmentDefinitions[4].id, "qsr");

  const segment = getSegment("qsr");
  assert.ok(segment);
  assert.equal(segment.id, "qsr");
  assert.equal(segment.name, "QSR");
  assert.equal(segment.experienceName, "Drive-Thru Performance");
  assert.deepEqual(validateContentBundle(contentBundle), []);
});

// 2
test("QSR implementation status is architecture_only", () => {
  assert.equal(getSegmentImplementationStatus("qsr"), "architecture_only");
  assert.equal(qsrSegment.implementationStatus, "architecture_only");
});

// 3
test("Retail remains implementation_ready", () => {
  assert.equal(getSegmentImplementationStatus("retail"), "implementation_ready");
});

// 4
test("The three property segments remain architecture_only", () => {
  for (const segmentId of ["shopping-centre", "retail-park", "outlet-centre"]) {
    assert.equal(getSegmentImplementationStatus(segmentId), "architecture_only");
  }
});

// ---------------------------------------------------------------------------
// JOURNEY
// ---------------------------------------------------------------------------

// 5
test("The canonical journey order is unchanged by QSR", () => {
  assert.deepEqual(canonicalJourney, [
    "context",
    "measure",
    "understand",
    "prove",
    "configure",
    "act",
  ]);
});

// 6
test("The QSR Core route contains exactly six content scenes", () => {
  assert.equal(getCoreRoute("qsr").length, 6);
  assert.equal(qsrSegment.coreRoute.length, 6);
  assert.equal(qsrScenes.filter((scene) => scene.priority === "core").length, 6);
});

// 7
test("The QSR Core route order matches the approved commercial route", () => {
  assert.deepEqual(
    getCoreRoute("qsr").map((scene) => scene.id),
    [
      "qsr-drive-thru-context",
      "qsr-queue",
      "qsr-order",
      "qsr-bottleneck",
      "qsr-respond",
      "qsr-estate",
    ],
  );
  assert.deepEqual(
    getCoreRoute("qsr").map((scene) => scene.corePathOrder),
    [1, 2, 3, 4, 5, 6],
  );
  assert.deepEqual(
    getCoreRoute("qsr").map((scene) => scene.journeyStage),
    ["context", "measure", "measure", "understand", "understand", "prove"],
  );
});

// 8
test("QSR Optional scenes never appear in the Core route", () => {
  const core = new Set(qsrSegment.coreRoute);
  for (const sceneId of qsrSegment.optionalBranches) {
    assert.equal(core.has(sceneId), false, `${sceneId} must stay outside Core`);
    assert.equal(getSceneForSegment("qsr", sceneId).corePathOrder, null);
  }
});

// 9
test("QSR has exactly six Optional scenes", () => {
  assert.equal(qsrSegment.optionalBranches.length, 6);
  assert.deepEqual(qsrSegment.optionalBranches.slice().sort(), [
    "qsr-arrival",
    "qsr-beyond-lane",
    "qsr-daypart",
    "qsr-handoff",
    "qsr-improvement-proof",
    "qsr-payment",
  ]);
  assert.equal(qsrScenes.filter((scene) => scene.priority === "optional").length, 6);
});

// 10
test("QSR currently has zero Advanced scenes", () => {
  assert.deepEqual(qsrSegment.advancedBranches, []);
  assert.equal(qsrScenes.filter((scene) => scene.priority === "advanced").length, 0);
  assert.equal(qsrScenes.length, 12);
});

// 11
test("QSR Configure and Act remain synthesis stages, not scenes", () => {
  assert.ok(isSynthesisStage("configure"));
  assert.ok(isSynthesisStage("act"));
  assert.deepEqual(qsrSegment.stageMapping.configure, []);
  assert.deepEqual(qsrSegment.stageMapping.act, []);
  assert.ok(
    qsrScenes.every(
      (scene) => scene.journeyStage !== "configure" && scene.journeyStage !== "act",
    ),
  );
  assert.equal(qsrSegment.synthesis.configure.recommendationMode, "none");
  assert.equal(qsrSegment.synthesis.act.decisionOwner, "human");
  assert.ok(qsrConfigurePaths.length > 0);
  assert.ok(qsrActHypotheses.length > 0);
});

// ---------------------------------------------------------------------------
// BRANCHES
// ---------------------------------------------------------------------------

const branchCase = (childId, parentId) => {
  const parents = getBranchParentsForScene("qsr", childId).map((scene) => scene.id);
  assert.deepEqual(parents, [parentId]);
  const branches = getOptionalBranchesForScene("qsr", parentId).map((scene) => scene.id);
  assert.ok(branches.includes(childId), `${childId} should branch from ${parentId}`);
};

// 12
test("Arrival branches from Queue", () => branchCase("qsr-arrival", "qsr-queue"));
// 13
test("Payment branches from Order", () => branchCase("qsr-payment", "qsr-order"));
// 14
test("Handoff branches from Order", () => branchCase("qsr-handoff", "qsr-order"));
// 15
test("Beyond-lane branches from Queue", () => branchCase("qsr-beyond-lane", "qsr-queue"));
// 16
test("Daypart branches from Bottleneck", () => branchCase("qsr-daypart", "qsr-bottleneck"));
// 17
test("Improvement-proof branches from Estate", () =>
  branchCase("qsr-improvement-proof", "qsr-estate"));

test("Every QSR branch parent stays inside the QSR segment and is a Core scene", () => {
  const core = new Set(qsrSegment.coreRoute);
  for (const scene of qsrScenes) {
    for (const parentId of scene.branchFromSceneIds ?? []) {
      const parent = getSceneForSegment("qsr", parentId);
      assert.equal(parent.segment, "qsr");
      assert.ok(core.has(parentId), `${parentId} should be a Core scene`);
    }
  }
});

// ---------------------------------------------------------------------------
// EVIDENCE
// ---------------------------------------------------------------------------

const dependency = (sceneId, dependencyId) => {
  const resolved = getDerivedDependencyAvailability("qsr", sceneId, dependencyId);
  assert.ok(resolved, `${sceneId} should declare ${dependencyId}`);
  return resolved;
};

// 18
test("Lane total time requires a compatible journey start and end timestamp", () => {
  const laneTotal = dependency("qsr-drive-thru-context", "qsr-lane-total-time");
  assert.deepEqual(laneTotal.requiredInputIds, [
    "lane_entry_timestamp",
    "pickup_timestamp",
  ]);
  assert.equal(laneTotal.available, true);
});

// 19
test("Stage time requires two compatible configured detection points", () => {
  const orderStage = dependency("qsr-order", "qsr-order-stage-time");
  assert.deepEqual(orderStage.requiredInputIds, [
    "order_point_timestamp",
    "payment_timestamp",
  ]);
  assert.equal(orderStage.requiredInputIds.length, 2);

  const handoffStage = dependency("qsr-handoff", "qsr-handoff-stage-time");
  assert.deepEqual(handoffStage.requiredInputIds, [
    "payment_timestamp",
    "pickup_timestamp",
  ]);
});

// 20
test("Queue time requires defined measurement boundaries", () => {
  const queueTime = dependency("qsr-queue", "qsr-queue-time");
  assert.deepEqual(queueTime.requiredInputIds, [
    "lane_entry_timestamp",
    "order_point_timestamp",
  ]);

  // Pull-forward and mobile pickup waiting each require their own configured space.
  assert.deepEqual(
    dependency("qsr-beyond-lane", "qsr-pull-forward-wait").requiredInputIds,
    ["pull_forward_timestamp"],
  );
  assert.deepEqual(
    dependency("qsr-beyond-lane", "qsr-mobile-pickup-wait").requiredInputIds,
    ["mobile_pickup_timestamp"],
  );
});

// 21
test("Goal attainment requires measured time plus a configured target", () => {
  const goal = dependency("qsr-drive-thru-context", "qsr-goal-attainment");
  assert.deepEqual(goal.requiredInputIds, [
    "lane_entry_timestamp",
    "pickup_timestamp",
    "configured_service_goal",
  ]);
  assert.equal(goal.available, true);

  const throughput = dependency("qsr-drive-thru-context", "qsr-throughput");
  assert.deepEqual(throughput.requiredInputIds, ["vehicle_count", "measurement_period"]);
});

// 22
test("Estate comparison requires comparable multi-store definitions", () => {
  const estate = dependency("qsr-estate", "qsr-estate-comparison");
  for (const inputId of [
    "restaurant_id",
    "restaurant_hierarchy",
    "configured_service_goal",
    "daypart",
    "measurement_period",
  ]) {
    assert.ok(
      estate.requiredInputIds.includes(inputId),
      `estate comparison should require ${inputId}`,
    );
  }

  const improvement = dependency("qsr-improvement-proof", "qsr-improvement-proof");
  assert.ok(improvement.requiredInputIds.includes("operational_change_marker"));
  assert.ok(improvement.requiredInputIds.includes("measurement_period"));
  assert.equal(
    improvement.available,
    false,
    "improvement proof stays unavailable without a recorded change marker",
  );
});

// 23
test("Revenue and drive-off remain unavailable without the required source", () => {
  const revenue = dependency("qsr-improvement-proof", "qsr-revenue-context");
  assert.equal(revenue.available, false);
  assert.ok(revenue.missingInputIds.includes("pos_order_value"));
  assert.ok(revenue.missingInputIds.includes("pos_transaction_reference"));

  const driveOff = dependency("qsr-queue", "qsr-drive-off");
  assert.equal(driveOff.available, false);
  assert.ok(driveOff.missingInputIds.includes("drive_off_capable_detection"));

  // No QSR demo evidence claims revenue, order value or profitability.
  for (const scene of qsrScenes) {
    for (const evidence of getEvidenceForScene("qsr", scene.id)) {
      assert.ok(
        !/revenue|profit|order value|labour|labor|accuracy/i.test(evidence.label),
        `${evidence.id} must not present a business outcome metric`,
      );
    }
  }
});

// 24
test("Illustrative QSR fixture values remain marked illustrative", () => {
  assert.equal(qsrDriveThruStory.illustrative, true);
  assert.equal(qsrDriveThruStory.fictional, true);
  assert.match(qsrDriveThruStory.disclaimer, /not HME benchmarks/i);
  assert.match(qsrDriveThruStory.disclaimer, /not customer results/i);

  // The specification's fictional interface examples are preserved exactly.
  assert.equal(qsrDriveThruStory.daypart.vehicles.value, 126);
  assert.equal(qsrDriveThruStory.daypart.averageLaneTotal.displayValue, "03:08");
  assert.equal(qsrDriveThruStory.daypart.serviceGoal.displayValue, "03:00");
  assert.equal(qsrDriveThruStory.daypart.withinGoal.value, 87);
  assert.equal(qsrDriveThruStory.daypart.peakQueue.value, 8);
  assert.equal(qsrDriveThruStory.daypart.bottleneckStage, "Pickup");
  assert.equal(qsrDriveThruStory.vehicleJourney.total.displayValue, "03:31");
  assert.equal(qsrDriveThruStory.estate.length, 4);
  for (const restaurant of qsrDriveThruStory.estate) {
    assert.equal(restaurant.illustrative, true);
  }

  for (const scene of qsrScenes) {
    for (const evidence of getEvidenceForScene("qsr", scene.id)) {
      assert.equal(evidence.illustrative, true, `${evidence.id} must be illustrative`);
    }
  }
});

test("QSR scenes without approved demo values report missing demo evidence", () => {
  const withEvidence = ["qsr-drive-thru-context", "qsr-queue", "qsr-order", "qsr-bottleneck", "qsr-estate"];
  for (const scene of qsrScenes) {
    const runtime = getSceneEvidenceRuntime("qsr", scene.id);
    if (withEvidence.includes(scene.id)) {
      assert.ok(runtime.availableEvidence.length > 0, `${scene.id} should resolve evidence`);
      assert.equal(runtime.illustrativeFlag, true);
    } else {
      assert.equal(runtime.availableEvidence.length, 0, `${scene.id} should have no demo values`);
      assert.ok(runtime.unavailableEvidence.length > 0);
      for (const entry of runtime.unavailableEvidence) {
        assert.equal(entry.reason, "no_demo_values");
      }
    }
  }
});

// ---------------------------------------------------------------------------
// TECHNOLOGY
// ---------------------------------------------------------------------------

const implementation = (id) => {
  const impl = technologyImplementations.find((item) => item.id === id);
  assert.ok(impl, `${id} should exist`);
  return impl;
};

const capability = (id) => {
  const found = technologyCapabilities.find((item) => item.id === id);
  assert.ok(found, `${id} should exist`);
  return found;
};

// 25
test("Scene to capability resolution works for QSR", () => {
  for (const scene of qsrScenes) {
    const capabilities = getCapabilitiesForScene("qsr", scene.id);
    assert.ok(capabilities.length > 0, `${scene.id} should resolve capabilities`);
    for (const item of capabilities) {
      assert.match(item.id, /^TECH-QSR-(0[1-9]|10)$/);
      assert.ok(getImplementationsForCapability(item.id).length > 0);
    }
  }
  assert.equal(technologyCapabilities.filter((c) => c.id.startsWith("TECH-QSR-")).length, 10);
});

// 26
test("ZOOM Nitro is an implementation, never a capability", () => {
  const impl = implementation("impl-hme-zoom-nitro-timer");
  assert.equal(impl.supplier, "HME");
  assert.equal(impl.product, "ZOOM Nitro Timer");
  for (const item of technologyCapabilities) {
    assert.ok(!/zoom|nitro|hme|nexeo/i.test(item.name), `${item.id} must stay vendor-neutral`);
  }
});

// 27
test("NEXEO Core, NEXEO and NEXEO Pro remain implementations of one capability", () => {
  const tiers = ["impl-hme-nexeo-core", "impl-hme-nexeo", "impl-hme-nexeo-pro"];
  for (const id of tiers) {
    const impl = implementation(id);
    assert.ok(impl.capabilityIds.includes("TECH-QSR-03"));
  }
  const communication = capability("TECH-QSR-03");
  for (const id of tiers) {
    assert.ok(communication.implementationIds.includes(id));
  }

  // Tier safety: unverified tier capability is not attributed to Core.
  const core = implementation("impl-hme-nexeo-core");
  assert.ok(core.unsupportedClaims.some((claim) => /1:1 or group crew communication/i.test(claim)));
  assert.ok(core.unsupportedClaims.some((claim) => /voice commands/i.test(claim)));
  assert.ok(core.unsupportedClaims.some((claim) => /voice ai/i.test(claim)));
  assert.ok(!core.capabilityIds.includes("TECH-QSR-09"));
});

// 28
test("No automatic NEXEO tier selection or product recommendation exists", () => {
  const forbidden = /chooseBest|recommend|rankHME|rank|autoSelect|selectTier|bestProduct|price|pricing/i;
  for (const exportName of Object.keys(technologyRuntime)) {
    assert.ok(!forbidden.test(exportName), `${exportName} must not implement selection or pricing`);
  }
  // Capability -> implementation stays a set of options, never a single choice.
  assert.equal(getImplementationsForCapability("TECH-QSR-03").length, 4);
  assert.equal(qsrSegment.synthesis.configure.recommendationMode, "none");
  for (const path of qsrConfigurePaths) {
    assert.ok(!("selectedImplementationId" in path));
  }
});

// 29
test("POS integration remains compatibility-dependent", () => {
  const pos = implementation("impl-compatible-pos-integration");
  assert.equal(pos.commercialAvailability.status, "available_if_compatible");
  assert.equal(pos.supplier, null);
  assert.match(pos.commercialAvailability.note, /compatib/i);
  assert.ok(pos.unsupportedClaims.some((claim) => /universal pos availability/i.test(claim)));
  assert.equal(capability("TECH-QSR-05").commercialAvailability.status, "available_if_compatible");

  const geofence = implementation("impl-compatible-geofence-mobile-integration");
  assert.equal(geofence.commercialAvailability.status, "available_if_compatible");
});

// 30
test("Voice AI readiness requires an advanced tier plus a compatible third-party provider", () => {
  const voiceAi = capability("TECH-QSR-09");
  assert.deepEqual(voiceAi.implementationIds.slice().sort(), [
    "impl-compatible-voice-ai-provider",
    "impl-hme-nexeo-pro",
  ]);
  assert.equal(voiceAi.commercialAvailability.status, "available_if_compatible");
  const provider = implementation("impl-compatible-voice-ai-provider");
  assert.equal(provider.commercialAvailability.status, "available_if_compatible");
});

// 31
test("No voice AI provider is invented and PFM is not represented as supplying one", () => {
  const provider = implementation("impl-compatible-voice-ai-provider");
  assert.equal(provider.supplier, null);
  assert.equal(provider.product, "Compatible third-party voice AI provider");
  assert.ok(provider.unsupportedClaims.some((claim) => /any named provider/i.test(claim)));
  assert.ok(
    provider.unsupportedClaims.some((claim) => /PFM (supplies|does not)|supplies, resells/i.test(claim)),
  );
  assert.ok(
    implementation("impl-hme-nexeo-pro").unsupportedClaims.some((claim) =>
      /PFM supplies the voice AI service/i.test(claim),
    ),
  );
});

// 32
test("Nitro Vision AI remains region_limited to the United States", () => {
  const visionCapability = capability("TECH-QSR-10");
  assert.equal(visionCapability.commercialAvailability.status, "region_limited");
  assert.equal(visionCapability.commercialAvailability.region, "United States");
  assert.equal(visionCapability.commercialAvailability.researchBaseline, "2026-08-15");

  const visionImpl = implementation("impl-hme-nitro-vision-ai");
  assert.equal(visionImpl.commercialAvailability.status, "region_limited");
  assert.equal(visionImpl.commercialAvailability.region, "United States");
  assert.equal(visionImpl.commercialAvailability.researchBaseline, "2026-08-15");
});

// 33
test("Nitro Vision AI is never returned as standard European availability", () => {
  const visionImpl = implementation("impl-hme-nitro-vision-ai");
  assert.notEqual(visionImpl.commercialAvailability.status, "available");
  assert.ok(visionImpl.unsupportedClaims.some((claim) => /europe/i.test(claim)));
  assert.match(visionImpl.commercialAvailability.note, /United States only/i);

  // It is not attached to any QSR scene, so it can never surface in the route.
  assert.equal(capability("TECH-QSR-10").supportedSceneIds.length, 0);
  for (const scene of qsrScenes) {
    assert.ok(!scene.technologyCapabilityIds.includes("TECH-QSR-10"));
  }
});

// 34
test("The timer-to-headset workflow resolves through the right capabilities", () => {
  const respond = getSceneForSegment("qsr", "qsr-respond");
  for (const capabilityId of ["TECH-QSR-02", "TECH-QSR-06", "TECH-QSR-03"]) {
    assert.ok(respond.technologyCapabilityIds.includes(capabilityId));
  }
  const alerting = implementation("impl-hme-zoom-nitro-nexeo-alerting");
  assert.deepEqual(alerting.capabilityIds, ["TECH-QSR-06"]);
  assert.equal(alerting.commercialAvailability.status, "available_if_compatible");
  assert.ok(
    alerting.unsupportedClaims.some((claim) => /alert changes the operational outcome/i.test(claim)),
  );
});

// 35
test("Gamification remains secondary and outside the Core story", () => {
  const gamification = capability("TECH-QSR-08");
  assert.equal(gamification.commercialAvailability.status, "optional_add_on");
  assert.equal(gamification.supportedSceneIds.length, 0);
  for (const scene of qsrScenes) {
    assert.ok(
      !scene.technologyCapabilityIds.includes("TECH-QSR-08"),
      `${scene.id} must not carry gamification`,
    );
  }
  for (const id of ["impl-hme-zoom-nitro-gamification", "impl-hme-zoom-nitro-leaderboard"]) {
    assert.equal(implementation(id).commercialAvailability.status, "optional_add_on");
  }
});

test("QSR commercial availability never collapses into source readiness", () => {
  const clearSoundX = implementation("impl-hme-clearsoundx");
  assert.equal(clearSoundX.commercialAvailability.status, "optional_add_on");
  assert.match(clearSoundX.commercialAvailability.note, /validated/i);
  // Availability and source readiness are separate fields with separate values.
  assert.notEqual(clearSoundX.commercialAvailability.status, clearSoundX.sourceStatus);
  assert.equal(implementation("impl-hme-text-and-connect").commercialAvailability.status, "requires_validation");
});

// ---------------------------------------------------------------------------
// PROOF
// ---------------------------------------------------------------------------

const qsrProofIds = [
  "proof-qsr-queue-performance",
  "proof-qsr-communication",
  "proof-qsr-bottleneck",
  "proof-qsr-closed-loop-response",
  "proof-qsr-estate-performance",
  "proof-qsr-improvement",
];

// 36
test("All new QSR proof assets begin as placeholders", () => {
  const qsrProofs = proofAssets.filter((proof) => proof.segment === "qsr");
  assert.equal(qsrProofs.length, 6);
  assert.deepEqual(qsrProofs.map((proof) => proof.id), qsrProofIds);
  for (const proof of qsrProofs) {
    assert.equal(proof.status, "placeholder");
    assert.equal(proof.format, null);
    assert.equal(proof.challenge, null);
    assert.equal(proof.measurementApproach, null);
    assert.equal(proof.customerLearning, null);
    assert.equal(proof.thumbnailAssetId, null);
  }
});

// 37
test("No QSR proof is externally available by default", () => {
  for (const proof of proofAssets.filter((item) => item.segment === "qsr")) {
    assert.equal(proof.externalUseApproved, false);
  }
});

// 38
test("No QSR proof is playable by default", () => {
  for (const proof of proofAssets.filter((item) => item.segment === "qsr")) {
    assert.equal(proof.playable, false);
  }
  for (const sceneId of ["qsr-queue", "qsr-order", "qsr-bottleneck", "qsr-respond", "qsr-estate", "qsr-improvement-proof"]) {
    const runtime = getProofRuntimeForScene("qsr", sceneId);
    assert.ok(runtime, `${sceneId} should resolve a proof runtime`);
    assert.equal(runtime.hasPlayableProof, false);
    assert.equal(runtime.hasExternalProof, false);
    assert.equal(runtime.playableProofs.length, 0);
    assert.equal(runtime.externalProofs.length, 0);
    assert.equal(runtime.hasInternalProof, true);
    assert.equal(runtime.internalProofs.length, 1);
  }
});

test("QSR visual assets are approved artwork, still without invented paths", () => {
  // They were placeholders long after the files landed. Status now tracks the
  // artwork; the registry still records approval and scene coverage only, so
  // the path stays null and lives with the preview mapping instead.
  const qsrVisuals = visualAssets.filter((asset) => asset.segment === "qsr");
  assert.equal(qsrVisuals.length, 12);
  for (const asset of qsrVisuals) {
    assert.equal(asset.status, "approved");
    assert.equal(asset.assetPath, null);
    assert.equal(asset.illustrative, true);
    assert.ok(asset.visualDirectionNotes.length > 0);
  }
  for (const scene of qsrScenes) {
    assert.ok(qsrVisuals.some((asset) => asset.id === scene.visualAssetId));
  }
});

// ---------------------------------------------------------------------------
// SAFETY
// ---------------------------------------------------------------------------

// 39
test("Cross-segment scene lookup is rejected for QSR in both directions", () => {
  assert.throws(
    () => getSceneForSegment("retail", "qsr-queue"),
    /belongs to segment qsr, not retail/,
  );
  assert.throws(
    () => getSceneForSegment("qsr", "retail-store-visits"),
    /belongs to segment retail, not qsr/,
  );
  assert.throws(
    () => getEvidenceForScene("retail", "qsr-queue"),
    /belongs to segment qsr, not retail/,
  );
  assert.equal(getSceneDependencyAvailability("qsr", "qsr-queue").length, 3);
});

// 40
test("Existing Retail and Retail Property content remains valid alongside QSR", () => {
  assert.deepEqual(validateContentBundle(contentBundle), []);
  const matrixScenes = allScenes.filter((scene) => scene.segment !== "qsr");
  assert.equal(matrixScenes.length, 45);
  assert.equal(allScenes.length, 57);
  assert.equal(new Set(allScenes.map((scene) => scene.id)).size, 57);

  // No QSR capability, proof or visual leaked into a matrix segment.
  for (const scene of matrixScenes) {
    assert.ok(scene.technologyCapabilityIds.every((id) => !id.startsWith("TECH-QSR-")));
    assert.ok(scene.proofAssetIds.every((id) => !id.startsWith("proof-qsr-")));
    assert.ok(!scene.visualAssetId.startsWith("VIS-QSR-"));
  }
  // And no matrix capability leaked into QSR.
  for (const scene of qsrScenes) {
    assert.ok(scene.technologyCapabilityIds.every((id) => id.startsWith("TECH-QSR-")));
  }
});
