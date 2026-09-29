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
const SCENE = "shopping-centre-internal-circulation";

const repoFile = (relative) =>
  fileURLToPath(new URL(`../${relative}`, import.meta.url));

const COMPONENT_PATH = repoFile(
  "app/components/ShoppingCentreInternalCirculationScene.tsx",
);
const PREVIEW_PATH = repoFile("app/preview/shopping-centre-internal-circulation/page.tsx");

/* The production hero. Per the asset-selection rule in AGENTS.md, a scene hero
   comes from `public/assets/location-visuals/<segment>/` — the curated
   production set — not from the legacy `public/assets/locations/` tree.

   This is the first Shopping Centre plate taken inside the asset: a multi-storey
   concourse with an escalator bank centre-frame, thin purple route lines
   splitting and rejoining across the floor, and soft purple rounded outlines
   over the shopfronts. Those two marks are the reason this plate and no other:
   the lines are the physical movement signal, the outlines are the configured
   spatial definitions, and the scene has to keep those two source roles apart.

   The dwell plate in the same directory is deliberately NOT used. It belongs to
   the next Core step, Zone & anchor exposure, whose subject is where attention
   builds; making dwell heat the story here would collapse two scenes into one. */
const HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-spatial-journey-hero.png";
const HERO_PATH = repoFile(`public${HERO_URL}`);

const DWELL_HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-dwell-hero.png";

/* The three human-approved Shopping Centre plates. Each belongs to exactly one
   scene and this scene must render none of them. */
const APPROVED_SCENE_HEROES = {
  "app/components/ShoppingCentreCatchmentScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-geo-intelligence-hero.png",
  "app/components/ShoppingCentreEntrancesScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-visitors-hero.png",
  "app/components/ShoppingCentreVisitorCompositionScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-visitor-composition-hero.png",
};

/* What the scene actually puts on screen: component source with its explanatory
   comments removed.

   The comments in these components carry the reasoning behind a decision, and
   that reasoning legitimately names the very things the copy must avoid — "no
   route is called busy, quiet, good or bad", "getOptionalBranchesForScene
   returns nothing for it". Scanning raw source would therefore fail on the
   sentences that document the boundary rather than on a breach of it, so every
   copy-boundary test below reads the stripped text. */
const visibleCopy = (source) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

/* JSX wraps a sentence across source lines at arbitrary points, so copy
   assertions run against a whitespace-flattened form. */
const flatten = (text) => text.replace(/\s+/g, " ");

// Data-binding tests for the fourth Shopping Centre Core scene, and the first
// one set inside the asset. They assert what the component reads out of the
// runtime and the boundaries its copy must not cross — not how it lays anything
// out — so they fail if the typed content or a runtime resolution changes
// underneath the scene, and stay silent about visual decisions.

test("Internal circulation binds its headline, eyebrow and CTA from typed content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component uses `commercialQuestion` verbatim as the headline, derives
  // the eyebrow from `journeyStage`, and renders `supportingLine` as its
  // decision line; none of the three is invented in the component.
  assert.equal(
    scene.commercialQuestion,
    "How do visitors move across floors, corridors, zones and anchors?",
  );
  assert.equal(
    scene.supportingLine,
    "Improve wayfinding, layout, operations and anchor connectivity",
  );
  assert.equal(scene.nextCta, "Explore zone & anchor exposure");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  // The eyebrow is composed from the typed stage plus a fixed descriptor, and
  // the rail's left-hand stage label must never disagree with it.
  assert.match(component, /stageLabel\(scene\.journeyStage\)/);
  assert.match(component, /Circulation/);
  assert.match(component, /\{scene\.commercialQuestion\}/);
  assert.match(component, /\{scene\.supportingLine\}/);
  assert.match(component, /\{scene\.nextCta\}/);

  // No shortened or reworded headline is written into the component; the typed
  // question is the only one on screen.
  assert.doesNotMatch(visibleCopy(component), /<h1[^>]*>(?!\{scene\.commercialQuestion\})/);
});

test("Internal circulation is the segment's first Understand step", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.equal(scene.journeyStage, "understand");
  assert.equal(scene.priority, "core");
  assert.equal(scene.corePathOrder, 4);

  // It is genuinely the first Understand scene in the Core order, which is why
  // the preview harness marks Understand as the current stage.
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);
  const firstUnderstand = core.find((entry) => entry.journeyStage === "understand");
  assert.equal(firstUnderstand.id, SCENE);

  const preview = readFileSync(PREVIEW_PATH, "utf8");
  assert.match(preview, /stageId === "understand"/);
});

test("Internal circulation resolves only inside Shopping Centre; cross-segment lookup is rejected", () => {
  assert.equal(getSceneForSegment(SEGMENT, SCENE).segment, SEGMENT);

  // The same scene id must not be reachable through another segment. Retail
  // types its own in-store journey scene under its own id, and the Shopping
  // Centre story is not a variant of it.
  for (const otherSegment of ["retail", "retail-park", "outlet-centre", "qsr"]) {
    assert.throws(
      () => getSceneForSegment(otherSegment, SCENE),
      `${SCENE} must not resolve inside ${otherSegment}`,
    );
  }

  // And Retail's own inside-the-location scene must not resolve inside Shopping
  // Centre, even though both drill into TECH-04.
  assert.throws(() => getSceneForSegment(SEGMENT, "retail-in-store-journey"));
});

test("Internal circulation is Core step 4 and hands over to Zone & anchor exposure", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.nextSceneId, "shopping-centre-zone-anchor-exposure");

  // The typed next scene must be the segment's next Core step by order, not an
  // arbitrary link: Visitor composition (3) -> Internal circulation (4) -> the
  // next Core step, which is the scene the CTA names.
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);

  const index = core.findIndex((entry) => entry.id === SCENE);
  assert.ok(index > 0);
  assert.equal(core[index - 1].id, "shopping-centre-visitor-composition");
  assert.equal(core[index - 1].nextSceneId, SCENE);
  assert.equal(core[index + 1].id, "shopping-centre-zone-anchor-exposure");
  assert.equal(core[index + 1].id, scene.nextSceneId);

  // The next scene asks a different question — where attention builds — and
  // this scene must not answer it. Pinned so a later edit cannot quietly turn
  // this scene into a dwell scene while still claiming to lead into one.
  const next = getSceneForSegment(SEGMENT, "shopping-centre-zone-anchor-exposure");
  assert.equal(
    next.commercialQuestion,
    "Which areas receive attention, and where do visitors dwell?",
  );
});

test("Internal circulation has no approved demo evidence and reports it honestly", () => {
  const runtime = getSceneEvidenceRuntime(SEGMENT, SCENE);

  // No Shopping Centre entries exist in the demo evidence catalog, so nothing
  // resolves to a value and the scene must show no flow figure, route share,
  // floor share or transition count at all.
  assert.equal(runtime.evidence.length, 0);
  assert.equal(runtime.availableEvidence.length, 0);
  assert.equal(runtime.periodMetadata, null);
  assert.equal(runtime.illustrativeFlag, false);

  // Three source-bearing entries — measured, connected, derived — each reported
  // as missing demo values rather than filled with a plausible substitute. The
  // fourth typed entry is the `decision` line, which names no input and so has
  // nothing to resolve.
  assert.equal(runtime.unavailableEvidence.length, 3);
  for (const entry of runtime.unavailableEvidence) {
    assert.equal(entry.reason, "no_demo_values");
  }
});

test("Internal circulation's three clusters each resolve a typed evidence description", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Exactly one entry of each type the component addresses, so the component's
  // `find` by type is unambiguous.
  for (const type of ["measured", "derived", "connected"]) {
    const matches = scene.evidence.filter((entry) => entry.type === type);
    assert.equal(matches.length, 1, `expected one ${type} evidence entry`);
    assert.ok(matches[0].description.length > 0);
  }

  // The three descriptions the component actually renders, pinned so the copy on
  // screen stays tied to the typed truth model.
  const byType = (type) => scene.evidence.find((entry) => entry.type === type).description;
  assert.match(byType("measured"), /provide the movement signal/);
  assert.match(byType("derived"), /require aligned movement and spatial definitions/);
  assert.match(byType("connected"), /definitions provide spatial meaning/);

  // The clusters read from typed content rather than restating it inline.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /evidence\?\.description \?\? ""/);
  assert.match(component, /\{cluster\.note\}/);
});

test("Circulation flow requires BOTH the movement signal and the spatial definitions", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Both inputs are required together — anonymous trajectories are not enough on
  // their own, and neither is a floorplan. Route structure exists only where the
  // two are aligned.
  assert.equal(scene.derivedDependencies.length, 1);
  const dependency = scene.derivedDependencies[0];
  assert.equal(dependency.id, "shopping-centre-internal-circulation-flow");
  assert.deepEqual(
    [...dependency.requiredInputIds],
    ["spatial_trajectories", "spatial_definitions"],
  );
  assert.equal(dependency.output, "Flow matrix, route structure and bottlenecks");

  // No alternative input group: there is no second way to arrive at a route
  // structure here, unlike Time in centre which types two.
  assert.equal(dependency.alternativeInputGroups, undefined);

  const dependencies = getSceneDependencyAvailability(SEGMENT, SCENE);
  const flow = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-internal-circulation-flow",
  );

  assert.ok(flow);
  assert.equal(flow.available, false);
  assert.deepEqual(
    [...flow.missingInputIds],
    ["spatial_trajectories", "spatial_definitions"],
  );

  // And it stays unavailable when either single source role is switched off, in
  // both directions — movement without layout, and layout without movement.
  for (const roles of [
    ["physical", "insight"],
    ["business", "insight"],
    ["mobile_geo", "insight"],
    ["insight"],
  ]) {
    const restricted = getSceneDependencyAvailability(SEGMENT, SCENE, roles).find(
      (entry) => entry.dependencyId === "shopping-centre-internal-circulation-flow",
    );
    assert.equal(restricted.available, false, `flow must not resolve from ${roles.join("+")}`);
  }

  // The component names the missing inputs by their typed labels rather than by
  // id, so an unavailable state stays readable on screen.
  const labelById = new Map(evidenceInputs.map((input) => [input.id, input.label]));
  assert.equal(
    labelById.get("spatial_trajectories"),
    "Anonymous spatial trajectories and transitions",
  );
  assert.equal(labelById.get("spatial_definitions"), "Floorplan and spatial definitions");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /flow\.missingInputIds/);
  assert.match(component, /inputLabelById\.get\(inputId\)/);
});

test("Physical movement and Business layout stay separate source roles", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));

  // The two halves of the derived reading come from two different layers and
  // must never be collapsed into one. The movement signal is measured on the
  // floor; the floorplan is customer-supplied configuration.
  assert.equal(roleByInput.get("spatial_trajectories"), "physical");
  assert.equal(roleByInput.get("spatial_definitions"), "business");

  const measured = scene.evidence.find((entry) => entry.type === "measured");
  const connected = scene.evidence.find((entry) => entry.type === "connected");
  assert.deepEqual([...measured.inputIds], ["spatial_trajectories"]);
  assert.deepEqual([...connected.inputIds], ["spatial_definitions"]);

  // Business is REQUIRED here — the first Shopping Centre scene where that is
  // true — and it must not be switched off on the grounds that no sales data
  // exists. `spatial_definitions` is what makes it required.
  assert.deepEqual([...scene.dataRequirements.required], ["physical", "business", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional], []);
});

test("The required Business layer is described as layout, never as sales", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The rail's generic "Customer-connected context" would misdescribe what
  // Business does here, so the scene supplies its own note — and that note must
  // name layout, not POS, turnover or tenant sales.
  assert.match(
    component,
    /business: "Centre layout, floors and configured spatial definitions"/,
  );

  const visible = visibleCopy(component);
  for (const forbidden of [
    /\bPOS\b/,
    /turnover/i,
    /tenant sales/i,
    /sales value/i,
    /\brevenue\b/i,
    /\btransactions?\b/i,
    /\bbasket\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("Internal circulation keeps Catchment's mobile_geo layer out of the rail", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Mobile & geo is neither required nor optional here. Aggregate area context
  // describes movement around a region; it does not observe a route inside the
  // building, and the rail must say so rather than offer it as a fallback.
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
  assert.ok(declaredRoles.has("business"));
  assert.ok(declaredRoles.has("insight"));
  assert.ok(!declaredRoles.has("mobile_geo"), "Mobile & geo must render as unavailable");

  // No evidence entry anywhere in the scene may name a mobile_geo input.
  const declaredInputRoles = new Set(
    scene.evidence.flatMap((entry) => entry.inputIds ?? []).map((id) => roleByInput.get(id)),
  );
  assert.ok(!declaredInputRoles.has("mobile_geo"));

  // And the scene supplies no note for a lens it cannot offer, so the rail's own
  // honest "No compatible input enabled" is never overridden.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.doesNotMatch(visibleCopy(component), /mobile_geo\s*:/);

  // Catchment is the mirror image, and both must stay that way.
  const catchment = getSceneForSegment(SEGMENT, "shopping-centre-catchment-area");
  assert.ok(catchment.dataRequirements.required.includes("mobile_geo"));
  assert.ok(!catchment.dataRequirements.required.includes("physical"));
});

test("Nothing in the scene equates a movement event with a unique visitor", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));

  const typedCopy = [
    scene.title,
    scene.commercialQuestion,
    scene.supportingLine,
    scene.nextCta,
    ...scene.evidence.map((entry) => entry.description),
    ...scene.derivedDependencies.map((dependency) => dependency.output),
  ].join(" | ");

  // The typed content never reaches for a visitor total at all.
  assert.doesNotMatch(typedCopy, /unique visitors?/i);

  // The component mentions unique visitors exactly once, and only to deny the
  // equivalence. Any second mention would be a claim.
  const mentions = [...visible.matchAll(/unique visitors?/gi)];
  assert.equal(mentions.length, 1, "unique visitors may be mentioned only once, to deny it");
  assert.match(visible, /Movement events are not unique visitors/);

  for (const forbidden of [
    /movement events? (?:are|is) (?:the |a )?(?:number|count|total)/i,
    /transitions? (?:are|is) (?:the |a )?visitors?/i,
    /visitors? counted per/i,
    /\bfootfall total\b/i,
    /each (?:crossing|transition|event) is a visitor/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }

  // The boundary is stated in the main copy, not only in the lens rail — the
  // rail's supporting notes are hidden below 1200px by a shared rule.
  assert.match(
    visible,
    /Movement events are not unique visitors — a visitor going up and coming back down is observed each time/,
  );
});

test("Counting and matched anonymous journeys are kept as separate readings", () => {
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));

  // Zone/transition counting and matched anonymous journeys are two different
  // readings and the scene must not merge them verbally. The distinction sits in
  // the definition line, which renders at every supported viewport.
  assert.match(
    visible,
    /counting registers a crossing at a configured location; a matched anonymous journey connects separate observations into a route/,
  );

  // And it must never be described as continuous following of a person.
  for (const forbidden of [
    /\btracking\b/i,
    /\btracked\b/i,
    /\bfollow(?:s|ed|ing)? (?:a |each |every )?(?:person|visitor|shopper|individual)\b/i,
    /\btrail\b/i,
    /\bre-?identif/i,
    /\bidentif/i,
    /continuous(?:ly)? (?:observ|monitor|record)/i,
    /\bsurveillance\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("The scene describes where movement goes, never why", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));

  const typedCopy = [
    scene.title,
    scene.commercialQuestion,
    scene.supportingLine,
    scene.nextCta,
    ...scene.evidence.map((entry) => entry.description),
    ...scene.derivedDependencies.map((dependency) => dependency.output),
  ].join(" | ");

  // Observation, not evaluation. A split, a transition and a distribution may be
  // described; a reason, a verdict or a recommendation may not.
  for (const forbidden of [
    /\bbecause\b/i,
    /\bcauses?\b/i,
    /\bcausing\b/i,
    /\bdue to\b/i,
    /\bdrives\b/i,
    /\bdriving\b/i,
    /\bleads? to\b/i,
    /\bresults? in\b/i,
    /\bunderperform/i,
    /\bunderused\b/i,
    /\bavoid(?:s|ed|ing)?\b/i,
    /\bpoorly\b/i,
    /\bineffic/i,
    /\bsuboptimal\b/i,
    /\bshould\b/i,
    /\bwe recommend\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }
});

test("The Internal circulation scene states no flow, route or floor value", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The scene has no approved demo values, so no share, split, percentage or
  // count may be written into the component — including anything carried over
  // from the Retail Property reference board (58/42, 78/22, 56/44).
  const copy = visibleCopy(component)
    // Ignore SVG path geometry and viewBox numbers in the CTA arrow.
    .replace(/<svg[\s\S]*?<\/svg>/g, "")
    .replace(/import[\s\S]*?from "[^"]+";/g, "");

  assert.doesNotMatch(copy, /\d+\s*%/, "no percentage may be stated");
  assert.doesNotMatch(copy, /\b\d{2,}\s*\/\s*\d{2,}\b/, "no split may be stated");
  for (const banned of ["58", "42", "78", "22", "56", "44"]) {
    assert.doesNotMatch(
      copy,
      new RegExp(`\\b${banned}\\b`),
      `${banned} must not appear — it belongs to the Retail Property reference board`,
    );
  }

  // And no share/rate vocabulary that would imply an unsupported value.
  for (const forbidden of [
    /\broute share\b/i,
    /\bfloor share\b/i,
    /\bshare of (?:traffic|visitors|movement)\b/i,
    /\bflow rate\b/i,
    /\bx of y\b/i,
  ]) {
    assert.doesNotMatch(copy, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("Internal circulation does not become the dwell scene", () => {
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));

  // Zone & anchor exposure is the next Core step and owns attention and dwell.
  // Routes and transitions have to dominate here, so the component's own copy
  // must not lead with heat, dwell or attention.
  for (const forbidden of [
    /\bdwell\b/i,
    /\bheat ?map\b/i,
    /\bhot ?spot\b/i,
    /\bhot and cold\b/i,
    /\battention\b/i,
    /\bexposure rate\b/i,
    /\blinger/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} belongs to Zone & anchor exposure`);
  }

  // The concepts the scene does lead with.
  assert.match(visible, /Where traffic travels inside the centre/);
  assert.match(visible, /How movement passes between floors and zones/);
  assert.match(visible, /The floors, corridors and zones traffic spreads across/);
});

test("Internal circulation names no sensor, vendor or camera technology", () => {
  const visible = visibleCopy(readFileSync(COMPONENT_PATH, "utf8"));

  // Technology stays behind the rail's "How we measure this" drilldown, which is
  // rendered by the shared SceneLensRail from typed content — never written into
  // the scene itself.
  for (const vendor of [
    /xovis/i,
    /robosense/i,
    /\bairy\b/i,
    /milesight/i,
    /bosch/i,
    /isarsoft/i,
    /\bpf-?l\b/i,
    /lidar/i,
    /\bcamera\b/i,
    /\bsensors?\b/i,
    /wi-?fi/i,
    /bluetooth/i,
    /\bbeacon\b/i,
  ]) {
    assert.doesNotMatch(visible, vendor, `${vendor} must not appear in the scene`);
  }
});

test("Internal circulation reuses TECH-04 and invents no new technology content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual([...scene.technologyCapabilityIds], ["TECH-04"]);

  const capabilities = getTechnologyCapabilitiesForScene(SCENE);
  assert.equal(capabilities.length, 1);
  assert.equal(capabilities[0].id, "TECH-04");
  assert.equal(capabilities[0].name, "Spatial movement intelligence");

  // The same capability Retail's own in-store journey scene drills into —
  // reused, not duplicated for this segment.
  assert.ok(capabilities[0].supportedSceneIds.includes("retail-in-store-journey"));
  assert.ok(capabilities[0].supportedSceneIds.includes(SCENE));

  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 1);
  assert.equal(drilldown.capabilities[0].capability.id, "TECH-04");

  // The capability's own privacy principle is what carries the anonymity caveat
  // into the drilldown, so the scene never has to claim it itself.
  assert.match(
    drilldown.capabilities[0].capability.privacyPrinciple,
    /do not imply identity tracking or infer intent from movement alone/,
  );
});

test("Internal circulation proof resolves to an unapproved placeholder, never a live case", () => {
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);

  assert.ok(proof);
  assert.equal(proof.hasInternalProof, true);
  assert.equal(proof.hasExternalProof, false);
  assert.equal(proof.hasPlayableProof, false);
  assert.equal(proof.internalProofs[0].id, "CASE-SC-02");
  assert.equal(proof.internalProofs[0].status, "placeholder");
  assert.equal(proof.internalProofs[0].externalUseApproved, false);
});

test("Internal circulation offers no optional branch, because none is typed", () => {
  assert.deepEqual(getOptionalBranchesForScene(SEGMENT, SCENE), []);

  // Nothing in the segment declares Internal circulation as a branch parent, so
  // the component renders no branch affordance — not parking, not brand flow.
  for (const scene of getScenesForSegment(SEGMENT)) {
    assert.ok(
      !(scene.branchFromSceneIds ?? []).includes(SCENE),
      `${scene.id} must not branch from ${SCENE}`,
    );
  }

  // The component neither imports the branch resolver nor renders a branch
  // affordance; the concept is documented in its comments and nowhere else.
  const source = readFileSync(COMPONENT_PATH, "utf8");
  assert.doesNotMatch(visibleCopy(source), /getOptionalBranchesForScene/);
  assert.doesNotMatch(source, /circulation__branch/);
});

test("Internal circulation renders its own production hero, and it exists on disk", () => {
  assert.ok(existsSync(HERO_PATH));

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    component.includes(`src="${HERO_URL}"`),
    "the scene must render the location-visuals hero for this scene",
  );
  assert.ok(HERO_URL.includes("/location-visuals/shopping-centre/"));
});

test("Internal circulation does not take the dwell plate reserved for the next scene", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The dwell plate exists in the same directory and is reserved for Zone &
  // anchor exposure. Rendering it here would make dwell heat the story of a
  // scene about routes.
  assert.ok(existsSync(repoFile(`public${DWELL_HERO_URL}`)));
  assert.ok(
    !component.includes(DWELL_HERO_URL),
    "the dwell plate belongs to Zone & anchor exposure",
  );
});

test("Internal circulation takes no approved scene's hero, and none takes its own", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  for (const [path, heroUrl] of Object.entries(APPROVED_SCENE_HEROES)) {
    assert.ok(
      !component.includes(heroUrl),
      `${heroUrl} belongs to ${path} alone`,
    );

    // And the reverse: no approved scene may be repointed at this scene's plate.
    const approved = readFileSync(repoFile(path), "utf8");
    assert.ok(approved.includes(`src="${heroUrl}"`), `${path} must keep its own hero`);
    assert.ok(!approved.includes(HERO_URL), `${path} must not render the circulation plate`);
    assert.ok(existsSync(repoFile(`public${heroUrl}`)));
  }
});

test("Internal circulation reaches no legacy locations/ asset and no other segment's asset", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  assert.ok(
    !component.includes("/assets/locations/"),
    "a production scene must not reach into the legacy locations/ tree",
  );
  assert.ok(
    !component.includes("reference-demos"),
    "reference material is never production runtime imagery",
  );

  for (const foreign of ["/retail/", "/retail-park/", "/outlet-centre/", "/qsr/"]) {
    assert.ok(
      !component.includes(`assets/location-visuals${foreign}`) &&
        !component.includes(`assets/locations${foreign}`),
      `a Shopping Centre scene must not render a ${foreign} asset`,
    );
  }
});

test("Building Internal circulation does not make Shopping Centre navigable", () => {
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
