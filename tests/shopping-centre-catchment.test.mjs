import assert from "node:assert/strict";
import test from "node:test";

import {
  getOptionalBranchesForScene,
  getSceneForSegment,
  getSegment,
  getTechnologyCapabilitiesForScene,
} from "../app/content/runtime.ts";
import {
  getSceneDependencyAvailability,
  getSceneEvidenceRuntime,
} from "../app/content/evidence-runtime.ts";
import { getProofRuntimeForScene } from "../app/content/proof-runtime.ts";
import { getTechnologyDrilldownForScene } from "../app/content/technology-runtime.ts";
import { evidenceInputs } from "../app/content/evidence-inputs.ts";

const SEGMENT = "shopping-centre";
const SCENE = "shopping-centre-catchment-area";
const BRANCH = "shopping-centre-competitive-visitation-white-spots";

// Data-binding tests for the first Shopping Centre scene. They assert what the
// component reads out of the runtime, not how it lays it out — so they fail if
// the typed content or a runtime resolution changes underneath the scene, and
// stay silent about visual decisions.

test("Catchment binds its headline, eyebrow and CTA from typed content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component uses `commercialQuestion` verbatim as the headline and derives
  // the eyebrow from `journeyStage`; neither is invented in the component.
  assert.equal(
    scene.commercialQuestion,
    "Where do centre visitors come from, and who lives in that reach?",
  );
  assert.equal(scene.journeyStage, "context");
  assert.equal(scene.priority, "core");
  assert.equal(scene.corePathOrder, 1);
  assert.equal(scene.nextCta, "Measure centre arrivals");
  assert.equal(scene.nextSceneId, "shopping-centre-entrances");
});

test("Catchment has no approved demo evidence and reports it honestly", () => {
  const runtime = getSceneEvidenceRuntime(SEGMENT, SCENE);

  // No Shopping Centre entries exist in the demo evidence catalog, so nothing
  // resolves to a value and the scene must show no number at all.
  assert.equal(runtime.evidence.length, 0);
  assert.equal(runtime.availableEvidence.length, 0);
  assert.equal(runtime.periodMetadata, null);
  assert.equal(runtime.illustrativeFlag, false);

  // Every declared non-decision evidence slot is reported as missing demo
  // values rather than silently disappearing or being filled in.
  assert.equal(runtime.unavailableEvidence.length, 3);
  for (const entry of runtime.unavailableEvidence) {
    assert.equal(entry.reason, "no_demo_values");
  }
});

test("Catchment's three clusters each resolve a typed evidence description", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component's three callouts borrow their copy from these entries by
  // type; each must exist exactly once and carry non-empty text.
  for (const type of ["connected", "derived", "measured"]) {
    const matches = scene.evidence.filter((entry) => entry.type === type);
    assert.equal(matches.length, 1, `expected one ${type} evidence entry`);
    assert.ok(matches[0].description.length > 0);
  }

  // The scene's own truth boundary: on-site measurement anchors a baseline, it
  // does not produce an origin.
  const measured = scene.evidence.find((entry) => entry.type === "measured");
  assert.match(measured.description, /do not measure origin/);
});

test("Catchment inverts the Retail lens pattern: Mobile & geo required, Physical optional", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.deepEqual([...scene.dataRequirements.required], ["mobile_geo", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional], ["physical", "business"]);
  assert.ok(!scene.dataRequirements.required.includes("physical"));

  // The rail derives the roles it can offer from the scene's declared evidence
  // inputs plus its required roles. Mobile & geo and Physical must both be
  // reachable that way, and the aggregate source must be a mobile_geo input —
  // catchment context is aggregate area data, never physical measurement.
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));
  const declaredInputRoles = new Set(
    scene.evidence.flatMap((entry) => entry.inputIds ?? []).map((id) => roleByInput.get(id)),
  );
  assert.ok(declaredInputRoles.has("mobile_geo"));
  assert.ok(declaredInputRoles.has("physical"));
  assert.equal(roleByInput.get("aggregate_mobility"), "mobile_geo");
  assert.equal(roleByInput.get("asset_baseline_visits"), "physical");
});

test("Catchment's derived reach stays unavailable and names its missing input", () => {
  const dependencies = getSceneDependencyAvailability(SEGMENT, SCENE);
  const reach = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-catchment-reach",
  );

  assert.ok(reach);
  assert.equal(reach.available, false);
  assert.deepEqual([...reach.missingInputIds], ["aggregate_mobility"]);
  assert.equal(reach.output, "Catchment bands, origin mix and travel-time reach");
});

test("Catchment reuses TECH-07 and invents no new technology content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual([...scene.technologyCapabilityIds], ["TECH-07"]);

  const capabilities = getTechnologyCapabilitiesForScene(SCENE);
  assert.equal(capabilities.length, 1);
  assert.equal(capabilities[0].id, "TECH-07");
  assert.equal(capabilities[0].name, "Geo, mobility and GIS");

  // The shared "How we measure this" drilldown in SceneLensRail resolves the
  // same capability for this scene as it does for Retail's own geo context.
  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 1);
  assert.equal(drilldown.capabilities[0].capability.id, "TECH-07");
  assert.match(
    drilldown.capabilities[0].capability.privacyPrinciple,
    /cannot replace direct entrance measurement/,
  );
});

test("Catchment proof resolves to an unapproved placeholder, never a live case", () => {
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);

  assert.ok(proof);
  assert.equal(proof.hasInternalProof, true);
  assert.equal(proof.hasExternalProof, false);
  assert.equal(proof.hasPlayableProof, false);
  assert.equal(proof.internalProofs[0].id, "CASE-SC-01");
  assert.equal(proof.internalProofs[0].status, "placeholder");
  assert.equal(proof.internalProofs[0].externalUseApproved, false);
});

test("Catchment offers White spots as an in-place optional branch", () => {
  const branches = getOptionalBranchesForScene(SEGMENT, SCENE);

  assert.equal(branches.length, 1);
  const branch = branches[0];
  assert.equal(branch.id, BRANCH);
  assert.equal(branch.priority, "optional");
  assert.equal(branch.corePathOrder, null);
  assert.ok(branch.branchFromSceneIds.includes(SCENE));

  // The branch panel renders the branch's own question, supporting line and
  // named dependencies; all three must exist in typed content.
  assert.ok(branch.commercialQuestion.length > 0);
  assert.ok(branch.supportingLine.length > 0);
  assert.deepEqual(
    branch.derivedDependencies.flatMap((dependency) => [...dependency.requiredInputIds]),
    ["aggregate_mobility"],
  );
});

test("Building Catchment does not make Shopping Centre navigable", () => {
  // The scene component exists; the segment's implementation status is what the
  // shell gates on, and it must stay architecture_only until the segment is
  // approved as a whole.
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.segment, "shopping-centre");

  assert.equal(getSegment("shopping-centre").implementationStatus, "architecture_only");
});
