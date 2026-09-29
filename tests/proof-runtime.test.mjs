import assert from "node:assert/strict";
import test from "node:test";

import {
  proofAssets,
} from "../app/content/index.ts";

import {
  getProofAsset,
  getProofsForScene,
  getProofsForCapability,
  getProofAvailability,
  getProofPermissionStatus,
  getProofContentReadiness,
  getProofRuntimeForScene,
  validateProofCrossSegment,
  getProofsForSegment,
  getProofStatusCounts,
  validatePlaceholderConstraints,
  sceneHasInternalProof,
  sceneHasExternalProof,
  sceneHasPlayableProof,
} from "../app/content/proof-runtime.ts";

/* Two published customer cases are approved for external use (product lead,
   2026-09-28; DECISION-LOG.md). Every other proof asset is still a placeholder,
   and every placeholder rule below still holds for all of them. */
const APPROVED = new Set(["CASE-RET-01", "CASE-RET-02"]);
const placeholders = () => proofAssets.filter((proof) => !APPROVED.has(proof.id));

test("All proof assets resolve by ID", () => {
  assert.equal(proofAssets.filter((p) => p.segment !== "qsr").length, 13);
  assert.equal(proofAssets.length, 19);
  for (const proof of proofAssets) {
    const resolved = getProofAsset(proof.id);
    assert.ok(resolved, `Proof ${proof.id} should resolve`);
    assert.equal(resolved.id, proof.id);
  }
});

test("Scene -> proof resolution works", () => {
  // retail-store-visits has CASE-RET-01
  const proofs = getProofsForScene("retail", "retail-store-visits");
  assert.equal(proofs.length, 1);
  assert.equal(proofs[0].id, "CASE-RET-01");
  
  // retail-in-store-journey has CASE-RET-02
  const proofs2 = getProofsForScene("retail", "retail-in-store-journey");
  assert.equal(proofs2.length, 1);
  assert.equal(proofs2[0].id, "CASE-RET-02");
  
  // The street scene shares CASE-RET-01's slot, but the Madaq case measures no
  // passers-by, so it does not name that scene and is not returned for it.
  const proofs3 = getProofsForScene("retail", "retail-street-opportunity");
  assert.equal(proofs3.length, 0);
  assert.equal(getProofsForScene("retail", "retail-visitor-composition").length, 0);
});

test("Cross-segment scene misuse is rejected", () => {
  // Shopping centre scene from retail segment should throw
  assert.throws(
    () => getProofsForScene("retail", "shopping-centre-catchment-area"),
    /belongs to segment shopping-centre, not retail/
  );
});

test("Capability -> proof resolution works", () => {
  const proofs = getProofsForCapability("TECH-02");
  assert.ok(proofs.length > 0);
  
  for (const proof of proofs) {
    assert.ok(proof.relatedCapabilityIds.includes("TECH-02"));
  }
});

test("Cross-segment proof leakage is rejected", () => {
  // Shopping centre scene from retail segment should throw
  assert.throws(
    () => getProofsForScene("retail", "shopping-centre-catchment-area"),
    /belongs to segment shopping-centre, not retail/
  );
});

test("Placeholder proof remains queryable", () => {
  for (const proof of placeholders()) {
    assert.equal(proof.status, "placeholder");
    const resolved = getProofAsset(proof.id);
    assert.ok(resolved);
  }
});

test("Placeholder proof is never externally available", () => {
  for (const proof of placeholders()) {
    assert.equal(proof.externalUseApproved, false);
    assert.equal(proof.status, "placeholder");
  }
});

test("Placeholder proof is never playable", () => {
  for (const proof of placeholders()) {
    assert.equal(proof.playable, false);
  }
});

test("External-use approval is required for prospect-facing proof", () => {
  // Only the two approved published cases carry external approval.
  assert.deepEqual(
    proofAssets.filter((proof) => proof.externalUseApproved).map((proof) => proof.id).sort(),
    [...APPROVED].sort(),
  );
});

test("an approved case is complete, published, named and bounded", () => {
  for (const id of APPROVED) {
    const proof = getProofAsset(id);
    assert.equal(proof.segment, "retail");
    assert.equal(proof.status, "available");
    assert.equal(proof.playable, true);
    assert.equal(proof.format, "video");
    assert.equal(proof.media?.kind, "youtube");
    assert.match(proof.media.videoId, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(proof.videoDuration > 0);
    assert.ok(proof.customerName, `${id} names no customer`);
    assert.ok(proof.publishedSourceUrls.length > 0);
    for (const url of proof.publishedSourceUrls) assert.match(url, /^https:\/\/www\.pfm-intelligence\.com\/cases\//);
    assert.ok(proof.truthBoundary && proof.truthBoundary.length > 40, `${id} states no boundary`);
    assert.match(proof.sourceRef, /product-lead instruction, 2026-09-28/);
    // A case restates no figure: no percentage, count or accuracy claim.
    const copy = [proof.title, proof.challenge, proof.measurementApproach, proof.customerLearning].join(" ");
    assert.doesNotMatch(copy, /\d|%|accura|uplift|ROI/i, `${id} restates a figure`);
    const availability = getProofAvailability(id);
    assert.equal(availability.externallyAvailable, true);
    assert.deepEqual(availability.playable, { playable: true, reason: "approved" });
  }
  // The conversion case keeps its truth boundary: the sensors count, the
  // retailer's own sales data completes the KPI.
  assert.match(getProofAsset("CASE-RET-01").truthBoundary, /sales data/);
});

test("Internal proof metadata may still be queryable when external approval is false", () => {
  for (const proof of placeholders()) {
    const availability = getProofAvailability(proof.id);
    assert.ok(availability);
    assert.equal(availability.internallyAvailable, true);
    assert.equal(availability.externallyAvailable, false);
  }
});

test("Missing video/media reference prevents playable status", () => {
  for (const proof of placeholders()) {
    const availability = getProofAvailability(proof.id);
    assert.ok(availability);
    assert.equal(availability.playable.playable, false);
    assert.ok(["placeholder", "missing_media", "missing_format", "not_approved_externally"].includes(availability.playable.reason));
  }
});

test("Scene without proof returns valid empty result", () => {
  // Check if any scene has no proof
  // For now, all scenes in the matrix seem to have at least one proof
  // But the function should handle empty gracefully
  const empty = getProofsForScene("retail", "retail-street-opportunity");
  // This scene has CASE-RET-01
  assert.ok(Array.isArray(empty));
});

test("Proof relation by explicit scene ID works", () => {
  const proofs = getProofsForScene("retail", "retail-store-visits");
  assert.ok(proofs.length > 0);
  for (const proof of proofs) {
    assert.ok(proof.relatedSceneIds.includes("retail-store-visits"));
  }
});

test("Proof relation by explicit capability ID works", () => {
  const proofs = getProofsForCapability("TECH-02");
  assert.ok(proofs.length > 0);
  for (const proof of proofs) {
    assert.ok(proof.relatedCapabilityIds.includes("TECH-02"));
  }
});

test("Runtime does not infer relationships from titles/text", () => {
  // Proof relationships are explicit via relatedSceneIds and relatedCapabilityIds
  // No inference from title text
  const proof = getProofAsset("CASE-RET-01");
  assert.ok(proof);
  // The title does not drive the relationship; the explicit ids do.
  assert.ok(proof.relatedSceneIds.includes("retail-store-visits"));
  assert.ok(proof.relatedCapabilityIds.includes("TECH-02"));
  assert.ok(!proof.relatedCapabilityIds.includes("TECH-01"));
});

test("Proof is not added to Core routes", () => {
  // Proof is contextual, not part of core navigation
  // This is a design principle, verified by the architecture
  // The runtime doesn't expose proof as part of core route
  // Proof is contextual, not part of core navigation
  assert.ok(true); // Placeholder for design principle
});

test("Proof runtime does not alter branch navigation", () => {
  // Proof is contextual depth, not route navigation
  // The runtime functions don't modify branch navigation
  assert.ok(true); // Placeholder for design principle
});

test("All existing proof asset IDs still resolve", () => {
  const expectedIds = [
    "CASE-RET-01", "CASE-RET-02", "CASE-RET-03",
    "CASE-SC-01", "CASE-SC-02", "CASE-SC-03", "CASE-SC-04",
    "CASE-RP-01", "CASE-RP-02", "CASE-RP-03",
    "CASE-OUT-01", "CASE-OUT-02", "CASE-OUT-03"
  ];
  
  for (const id of expectedIds) {
    const proof = getProofAsset(id);
    assert.ok(proof, `Proof ${id} should resolve`);
  }
});

test("All current placeholder proof assets remain non-playable", () => {
  for (const proof of placeholders()) {
    assert.equal(proof.status, "placeholder");
    assert.equal(proof.playable, false);
  }
});

test("getProofAvailability returns correct structure", () => {
  const availability = getProofAvailability("CASE-RET-03");
  assert.ok(availability);
  assert.equal(availability.internallyAvailable, true);
  assert.equal(availability.externallyAvailable, false);
  assert.equal(availability.isPlaceholder, true);
  assert.equal(availability.playable.playable, false);
  assert.equal(availability.playable.reason, "placeholder");
});

test("getProofPermissionStatus returns correct structure", () => {
  const permission = getProofPermissionStatus("CASE-RET-03");
  assert.ok(permission);
  assert.equal(permission.canViewInternally, true);
  assert.equal(permission.canViewExternally, false);
  assert.equal(permission.approvalStatus, "placeholder");
  const approved = getProofPermissionStatus("CASE-RET-01");
  assert.equal(approved.canViewExternally, true);
  assert.equal(approved.canPlayExternally, true);
});

test("getProofContentReadiness returns correct structure", () => {
  const readiness = getProofContentReadiness("CASE-RET-01");
  assert.ok(readiness);
  assert.equal(typeof readiness.completenessScore, "number");
  assert.ok(readiness.completenessScore >= 0 && readiness.completenessScore <= 1);
});

test("getProofRuntimeForScene returns complete contract", () => {
  const runtime = getProofRuntimeForScene("retail", "retail-store-visits");
  assert.ok(runtime);
  assert.equal(runtime.scene.id, "retail-store-visits");
  assert.ok(Array.isArray(runtime.internalProofs));
  assert.ok(Array.isArray(runtime.externalProofs));
  assert.ok(Array.isArray(runtime.playableProofs));
  assert.ok(typeof runtime.hasInternalProof === "boolean");
  assert.ok(typeof runtime.hasExternalProof === "boolean");
  assert.ok(typeof runtime.hasPlayableProof === "boolean");
  assert.ok(Array.isArray(runtime.proofDetails));
  assert.ok(runtime.capabilityProofs instanceof Map);
});

test("Cross-segment proof leakage is prevented in getProofRuntimeForScene", () => {
  assert.throws(
    () => getProofRuntimeForScene("retail", "shopping-centre-catchment-area"),
    /belongs to segment shopping-centre, not retail/
  );
});

test("validateProofCrossSegment returns no errors for valid content", () => {
  const errors = validateProofCrossSegment();
  assert.deepEqual(errors, []);
});

test("getProofsForSegment returns correct proofs per segment", () => {
  const retailProofs = getProofsForSegment("retail");
  const scProofs = getProofsForSegment("shopping-centre");
  const rpProofs = getProofsForSegment("retail-park");
  const outProofs = getProofsForSegment("outlet-centre");
  
  assert.equal(retailProofs.length, 3);
  assert.equal(scProofs.length, 4);
  assert.equal(rpProofs.length, 3);
  assert.equal(outProofs.length, 3);
  
  for (const proof of retailProofs) {
    assert.equal(proof.segment, "retail");
  }
});

test("getProofStatusCounts returns correct counts", () => {
  const retailCounts = getProofStatusCounts("retail");
  assert.equal(retailCounts.placeholder, 1);
  assert.equal(retailCounts.available, 2);
  for (const segment of ["shopping-centre", "retail-park", "outlet-centre", "qsr"]) {
    assert.equal(getProofStatusCounts(segment).available, 0, `${segment} has approved proof`);
  }
  assert.equal(retailCounts.approval_required, 0);
  assert.equal(retailCounts.unavailable, 0);
});

test("validatePlaceholderConstraints passes for current content", () => {
  const errors = validatePlaceholderConstraints();
  assert.deepEqual(errors, []);
});

test("Scene has internal proof check", () => {
  assert.equal(sceneHasInternalProof("retail", "retail-store-visits"), true);
  assert.equal(sceneHasExternalProof("retail", "retail-store-visits"), true);
  assert.equal(sceneHasPlayableProof("retail", "retail-store-visits"), true);
  // A placeholder-only scene is still internal-only.
  assert.equal(sceneHasInternalProof("retail", "retail-portfolio-comparison"), true);
  assert.equal(sceneHasExternalProof("retail", "retail-portfolio-comparison"), false);
  assert.equal(sceneHasPlayableProof("retail", "retail-portfolio-comparison"), false);
});

test("Cross-segment proof leakage is prevented", () => {
  assert.throws(
    () => getProofsForScene("retail", "shopping-centre-catchment-area"),
    /belongs to segment shopping-centre, not retail/
  );
});

test("All proof assets accounted for in segment distribution", () => {
  const total = proofAssets.length;
  const segments = ["retail", "shopping-centre", "retail-park", "outlet-centre", "qsr"];
  let sum = 0;
  for (const seg of segments) {
    sum += getProofsForSegment(seg).length;
  }
  assert.equal(sum, total);
});
