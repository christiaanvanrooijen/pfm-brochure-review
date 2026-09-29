import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  getOptionalBranchesForScene,
  getSceneForSegment,
  getSegment,
  getScenesForSegment,
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
const SCENE = "shopping-centre-entrances";

const repoFile = (relative) =>
  fileURLToPath(new URL(`../${relative}`, import.meta.url));

const COMPONENT_PATH = repoFile("app/components/ShoppingCentreEntrancesScene.tsx");
const PREVIEW_PATH = repoFile("app/preview/shopping-centre-entrances/page.tsx");
/* The approved production hero. Per the asset-selection rule in AGENTS.md, a
   scene hero comes from `public/assets/location-visuals/<segment>/` — the
   curated production set — not from the legacy `public/assets/locations/` tree.
   `shopping-mall-visitor-counting.png` still exists there as reference material
   and an earlier build of this scene used it; the test below pins that it is no
   longer reachable from this component. */
const HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-visitors-hero.png";
const HERO_PATH = repoFile(`public${HERO_URL}`);
const LEGACY_HERO_URL =
  "/assets/locations/shopping-centre/shopping-mall-visitor-counting.png";

// Data-binding tests for the second Shopping Centre Core scene. They assert what
// the component reads out of the runtime and the boundaries its copy must not
// cross — not how it lays anything out — so they fail if the typed content or a
// runtime resolution changes underneath the scene, and stay silent about visual
// decisions.

test("Entrances binds its headline, eyebrow and CTA from typed content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component uses `commercialQuestion` verbatim as the headline, derives
  // the eyebrow from `journeyStage`, and renders `supportingLine` as its
  // decision line; none of the three is invented in the component.
  assert.equal(
    scene.commercialQuestion,
    "How many visitors enter the asset, through which entrances and when?",
  );
  assert.equal(
    scene.supportingLine,
    "Plan operations, cleaning, security, opening hours and event staffing",
  );
  assert.equal(scene.journeyStage, "measure");
  assert.equal(scene.priority, "core");
  assert.equal(scene.corePathOrder, 2);
  assert.equal(scene.nextCta, "Understand visitor mix");
});

test("Entrances resolves only inside Shopping Centre; cross-segment lookup is rejected", () => {
  assert.equal(getSceneForSegment(SEGMENT, SCENE).segment, SEGMENT);

  // The same scene id must not be reachable through another segment — the
  // Shopping Centre story is not a variant of the Retail one.
  for (const otherSegment of ["retail", "retail-park", "outlet-centre", "qsr"]) {
    assert.throws(
      () => getSceneForSegment(otherSegment, SCENE),
      `${SCENE} must not resolve inside ${otherSegment}`,
    );
  }

  // And Retail's own Measure scene must not resolve inside Shopping Centre.
  assert.throws(() => getSceneForSegment(SEGMENT, "retail-store-visits"));
});

test("Entrances is Core step 2 and hands over to Visitor composition", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.nextSceneId, "shopping-centre-visitor-composition");

  // The typed next scene must be the segment's next Core step by order, not an
  // arbitrary link: Catchment (1) -> Entrances (2) -> Visitor composition (3).
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);

  const index = core.findIndex((entry) => entry.id === SCENE);
  assert.ok(index > 0);
  assert.equal(core[index - 1].id, "shopping-centre-catchment-area");
  assert.equal(core[index - 1].nextSceneId, SCENE);
  assert.equal(core[index + 1].id, "shopping-centre-visitor-composition");
  assert.equal(core[index + 1].id, scene.nextSceneId);
});

test("Entrances has no approved demo evidence and reports it honestly", () => {
  const runtime = getSceneEvidenceRuntime(SEGMENT, SCENE);

  // No Shopping Centre entries exist in the demo evidence catalog, so nothing
  // resolves to a value and the scene must show no arrival total, entrance
  // share or peak hour at all.
  assert.equal(runtime.evidence.length, 0);
  assert.equal(runtime.availableEvidence.length, 0);
  assert.equal(runtime.periodMetadata, null);
  assert.equal(runtime.illustrativeFlag, false);

  assert.equal(runtime.unavailableEvidence.length, 3);
  for (const entry of runtime.unavailableEvidence) {
    assert.equal(entry.reason, "no_demo_values");
  }
});

test("Entrances' three clusters each resolve a typed evidence description", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component's three callouts borrow their copy from these entries by
  // type; each must exist exactly once and carry non-empty text.
  for (const type of ["measured", "derived", "connected"]) {
    const matches = scene.evidence.filter((entry) => entry.type === type);
    assert.equal(matches.length, 1, `expected one ${type} evidence entry`);
    assert.ok(matches[0].description.length > 0);
  }

  // The scene's own truth boundary: what is measured is an entrance event by
  // time, and the derived reading is explicitly conditional on that series.
  const measured = scene.evidence.find((entry) => entry.type === "measured");
  assert.match(measured.description, /per entrance by time/);
  const derived = scene.evidence.find((entry) => entry.type === "derived");
  assert.match(derived.description, /require the physical time series/);
});

test("Entrance evidence is Physical-rooted, never mobile_geo", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));

  // Every input the measured and derived readings name must be a physical
  // input. Arrivals are counted at the doors; aggregate area data never stands
  // in for that.
  for (const type of ["measured", "derived"]) {
    const entry = scene.evidence.find((item) => item.type === type);
    for (const inputId of entry.inputIds) {
      assert.equal(roleByInput.get(inputId), "physical", `${inputId} must be physical`);
    }
  }
  assert.equal(roleByInput.get("entrance_events"), "physical");

  // No evidence entry anywhere in the scene may name a mobile_geo input.
  const declaredInputRoles = new Set(
    scene.evidence.flatMap((entry) => entry.inputIds ?? []).map((id) => roleByInput.get(id)),
  );
  assert.ok(declaredInputRoles.has("physical"));
  assert.ok(!declaredInputRoles.has("mobile_geo"));

  // And the derived dependency is gated on the physical series alone.
  assert.deepEqual(
    scene.derivedDependencies.flatMap((dependency) => [...dependency.requiredInputIds]),
    ["entrance_events"],
  );
});

test("Entrances inverts Catchment: Physical required, Mobile & geo not declared at all", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.deepEqual([...scene.dataRequirements.required], ["physical", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional], ["business"]);

  // Mobile & geo is neither required nor optional here. That is stronger than
  // "optional context, switched off": counting arrivals is not a question
  // aggregate area data participates in, and the rail must say so.
  assert.ok(!scene.dataRequirements.required.includes("mobile_geo"));
  assert.ok(!scene.dataRequirements.optional.includes("mobile_geo"));

  // SceneLensRail derives the roles it can offer from the scene's declared
  // evidence inputs plus its required roles. Reproducing that derivation here
  // pins the rail state each lens must render: Physical/Business/Insight
  // supported, Mobile & geo unavailable ("No compatible input enabled").
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));
  const declaredRoles = new Set([
    ...scene.evidence.flatMap((entry) => entry.inputIds ?? []).map((id) => roleByInput.get(id)),
    ...scene.dataRequirements.required,
  ]);

  assert.ok(declaredRoles.has("physical"));
  assert.ok(declaredRoles.has("insight"));
  assert.ok(declaredRoles.has("business"), "operational_context makes Business selectable");
  assert.ok(!declaredRoles.has("mobile_geo"), "Mobile & geo must render as unavailable");

  // Catchment is the mirror image, and both must stay that way.
  const catchment = getSceneForSegment(SEGMENT, "shopping-centre-catchment-area");
  assert.ok(catchment.dataRequirements.required.includes("mobile_geo"));
  assert.ok(!catchment.dataRequirements.required.includes("physical"));
});

test("Entrance rhythm stays unavailable and names its missing physical input", () => {
  const dependencies = getSceneDependencyAvailability(SEGMENT, SCENE);
  const rhythm = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-entrance-rhythm",
  );

  assert.ok(rhythm);
  assert.equal(rhythm.available, false);
  assert.deepEqual([...rhythm.missingInputIds], ["entrance_events"]);
  assert.equal(rhythm.output, "Entrance share and peak arrival rhythm");
});

test("Nothing in the Entrances scene claims a unique visitor", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Typed content first: every string this scene puts on screen.
  const typedCopy = [
    scene.title,
    scene.commercialQuestion,
    scene.supportingLine,
    scene.nextCta,
    ...scene.evidence.map((entry) => entry.description),
    ...scene.derivedDependencies.map((dependency) => dependency.output),
  ].join(" | ");
  assert.doesNotMatch(typedCopy, /unique\s+visitor/i, typedCopy);

  // Then the component's own copy. The scene is allowed to say "visitors enter"
  // — that is the typed commercial question — but never that an entrance count
  // resolves to a distinct person.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.doesNotMatch(component, /unique\s+visitor/i);
  assert.doesNotMatch(component, /de-?duplicat/i);

  // The one place the phrase legitimately appears anywhere near this scene is
  // TECH-02's privacy principle, behind "How we measure this", and it appears
  // there precisely to keep the three ideas apart rather than to claim one.
  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.match(
    drilldown.capabilities[0].capability.privacyPrinciple,
    /Keep entries, visits and unique visitors distinct/,
  );
});

test("Entrances reuses TECH-02 and invents no new technology content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual([...scene.technologyCapabilityIds], ["TECH-02"]);

  const capabilities = getTechnologyCapabilitiesForScene(SCENE);
  assert.equal(capabilities.length, 1);
  assert.equal(capabilities[0].id, "TECH-02");
  assert.equal(capabilities[0].name, "Entrance measurement");

  // The same capability Retail's own Capture flow drills into — reused, not
  // duplicated for this segment.
  assert.ok(capabilities[0].supportedSceneIds.includes("retail-store-visits"));
  assert.ok(capabilities[0].supportedSceneIds.includes(SCENE));

  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 1);
  assert.equal(drilldown.capabilities[0].capability.id, "TECH-02");
});

test("Entrances proof resolves to an unapproved placeholder, never a live case", () => {
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);

  assert.ok(proof);
  assert.equal(proof.hasInternalProof, true);
  assert.equal(proof.hasExternalProof, false);
  assert.equal(proof.hasPlayableProof, false);
  assert.equal(proof.internalProofs[0].id, "CASE-SC-02");
  assert.equal(proof.internalProofs[0].status, "placeholder");
  assert.equal(proof.internalProofs[0].externalUseApproved, false);
});

test("Entrances offers no optional branch, because none is typed", () => {
  assert.deepEqual(getOptionalBranchesForScene(SEGMENT, SCENE), []);

  // Nothing in the segment declares Entrances as a branch parent. Parking
  // arrival in particular is a Core step of its own, not a side door here.
  for (const scene of getScenesForSegment(SEGMENT)) {
    assert.ok(
      !(scene.branchFromSceneIds ?? []).includes(SCENE),
      `${scene.id} must not branch from ${SCENE}`,
    );
  }
});

test("Entrances renders the approved production hero, and it exists on disk", () => {
  assert.ok(existsSync(HERO_PATH));

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    component.includes(`src="${HERO_URL}"`),
    "the scene must render the approved location-visuals hero",
  );
});

test("Entrances no longer reaches the legacy locations/ asset", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    !component.includes(LEGACY_HERO_URL),
    "the superseded shopping-mall-visitor-counting plate must not be referenced",
  );
  // It stays in the repository as reference material — this test pins that the
  // scene does not use it, not that the file was deleted.
  assert.ok(existsSync(repoFile(`public${LEGACY_HERO_URL}`)));
});

test("Entrances' hero belongs to Shopping Centre, not another segment", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  for (const foreign of ["/retail/", "/retail-park/", "/outlet-centre/", "/qsr/"]) {
    assert.ok(
      !component.includes(`assets/location-visuals${foreign}`) &&
        !component.includes(`assets/locations${foreign}`),
      `a Shopping Centre scene must not render a ${foreign} asset`,
    );
  }
  assert.ok(HERO_URL.includes("/shopping-centre/"));
});

test("Building Entrances does not make Shopping Centre navigable", () => {
  // The scene component exists; the segment's implementation status is what the
  // shell gates on, and it must stay architecture_only until the segment is
  // approved as a whole.
  assert.equal(getSegment(SEGMENT).implementationStatus, "architecture_only");

  // The dev-only preview harness must 404 in a production build, so it cannot
  // become a back door into an unapproved segment.
  const preview = readFileSync(PREVIEW_PATH, "utf8");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
});
