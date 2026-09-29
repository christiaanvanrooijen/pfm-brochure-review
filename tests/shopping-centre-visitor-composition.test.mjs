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
const SCENE = "shopping-centre-visitor-composition";

const repoFile = (relative) =>
  fileURLToPath(new URL(`../${relative}`, import.meta.url));

const COMPONENT_PATH = repoFile(
  "app/components/ShoppingCentreVisitorCompositionScene.tsx",
);
const PREVIEW_PATH = repoFile("app/preview/shopping-centre-visitor-composition/page.tsx");

/* The production hero. Per the asset-selection rule in AGENTS.md, a scene hero
   comes from `public/assets/location-visuals/<segment>/` — the curated
   production set — not from the legacy `public/assets/locations/` tree.

   This plate is deliberately close to the approved Entrances hero: same
   property, same plaza, same dusk. The difference is the intelligence layer
   drawn on it — Entrances carries arrival streams converging on the doors, this
   carries anonymous grouping halos on individuals and walking pairs. They are
   separate files and the scenes must not share one, so both directions are
   pinned below. */
const HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-visitor-composition-hero.png";
const HERO_PATH = repoFile(`public${HERO_URL}`);
const ENTRANCES_HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-visitors-hero.png";

/* What the scene actually puts on screen: component source with its explanatory
   comments removed.

   The comments in these components carry the reasoning behind a decision, and
   that reasoning legitimately names the very things the copy must avoid — "not
   the population living around the centre", "getOptionalBranchesForScene
   returns nothing for it". Scanning raw source would therefore fail on the
   sentences that document the boundary rather than on a breach of it, so every
   copy-boundary test below reads the stripped text. */
const visibleCopy = (source) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

// Data-binding tests for the third Shopping Centre Core scene. They assert what
// the component reads out of the runtime and the boundaries its copy must not
// cross — not how it lays anything out — so they fail if the typed content or a
// runtime resolution changes underneath the scene, and stay silent about visual
// decisions.

test("Visitor composition binds its headline, eyebrow and CTA from typed content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component uses `commercialQuestion` verbatim as the headline, derives
  // the eyebrow from `journeyStage`, and renders `supportingLine` as its
  // decision line; none of the three is invented in the component.
  assert.equal(
    scene.commercialQuestion,
    "Who is entering the centre in anonymous visitor groups?",
  );
  assert.equal(
    scene.supportingLine,
    "Compare visitor mix by entrance, daypart, event or season",
  );
  assert.equal(scene.journeyStage, "measure");
  assert.equal(scene.priority, "core");
  assert.equal(scene.corePathOrder, 3);
  assert.equal(scene.nextCta, "Follow centre circulation");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  // The eyebrow is composed from the typed stage plus a fixed descriptor, and
  // the rail's left-hand stage label must never disagree with it.
  assert.match(component, /stageLabel\(scene\.journeyStage\)/);
  assert.match(component, /Visitors/);
  assert.match(component, /\{scene\.commercialQuestion\}/);
  assert.match(component, /\{scene\.supportingLine\}/);
  assert.match(component, /\{scene\.nextCta\}/);
});

test("Visitor composition resolves only inside Shopping Centre; cross-segment lookup is rejected", () => {
  assert.equal(getSceneForSegment(SEGMENT, SCENE).segment, SEGMENT);

  // The same scene id must not be reachable through another segment. Every
  // other segment types its own visitor-composition scene under its own id, and
  // the Shopping Centre story is not a variant of any of them.
  for (const otherSegment of ["retail", "retail-park", "outlet-centre", "qsr"]) {
    assert.throws(
      () => getSceneForSegment(otherSegment, SCENE),
      `${SCENE} must not resolve inside ${otherSegment}`,
    );
  }

  // And Retail's own visitor-composition scene must not resolve inside Shopping
  // Centre, even though both drill into TECH-03.
  assert.throws(() => getSceneForSegment(SEGMENT, "retail-visitor-composition"));
});

test("Visitor composition is Core step 3 and hands over to Internal circulation", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.nextSceneId, "shopping-centre-internal-circulation");

  // The typed next scene must be the segment's next Core step by order, not an
  // arbitrary link: Entrances (2) -> Visitor composition (3) -> the next Core
  // step, which is the scene the CTA names.
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);

  const index = core.findIndex((entry) => entry.id === SCENE);
  assert.ok(index > 0);
  assert.equal(core[index - 1].id, "shopping-centre-entrances");
  assert.equal(core[index - 1].nextSceneId, SCENE);
  assert.equal(core[index + 1].id, "shopping-centre-internal-circulation");
  assert.equal(core[index + 1].id, scene.nextSceneId);
});

test("Visitor composition has no approved demo evidence and reports it honestly", () => {
  const runtime = getSceneEvidenceRuntime(SEGMENT, SCENE);

  // No Shopping Centre entries exist in the demo evidence catalog, so nothing
  // resolves to a value and the scene must show no share, split, band, group
  // size or party average at all.
  assert.equal(runtime.evidence.length, 0);
  assert.equal(runtime.availableEvidence.length, 0);
  assert.equal(runtime.periodMetadata, null);
  assert.equal(runtime.illustrativeFlag, false);

  assert.equal(runtime.unavailableEvidence.length, 4);
  for (const entry of runtime.unavailableEvidence) {
    assert.equal(entry.reason, "no_demo_values");
  }
});

test("Visitor composition's three clusters each resolve a typed evidence description", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The scene types two `measured` entries; the component addresses them by
  // occurrence, so both must exist and carry text.
  const measured = scene.evidence.filter((entry) => entry.type === "measured");
  assert.equal(measured.length, 2);
  for (const entry of measured) assert.ok(entry.description.length > 0);

  for (const type of ["derived", "connected"]) {
    const matches = scene.evidence.filter((entry) => entry.type === type);
    assert.equal(matches.length, 1, `expected one ${type} evidence entry`);
    assert.ok(matches[0].description.length > 0);
  }

  // The three descriptions the component actually renders, pinned so the copy on
  // screen stays tied to the typed truth model.
  assert.match(
    measured[1].description,
    /enabled, configured and permitted for the selected centre scope/,
  );
  const derived = scene.evidence.find((entry) => entry.type === "derived");
  assert.match(derived.description, /estimated from the named inputs/);
  const connected = scene.evidence.find((entry) => entry.type === "connected");
  assert.match(connected.description, /may segment the anonymous mix/);
});

test("Composition values require their two named classification inputs", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Both inputs are required together — a classification-compatible
  // implementation is not enough on its own, and neither is permission.
  assert.deepEqual(
    scene.derivedDependencies.flatMap((dependency) => [...dependency.requiredInputIds]),
    ["classification_compatible_events", "enabled_classification"],
  );

  const dependencies = getSceneDependencyAvailability(SEGMENT, SCENE);
  const classification = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-visitor-composition-classification",
  );

  assert.ok(classification);
  assert.equal(classification.available, false);
  assert.deepEqual(
    [...classification.missingInputIds],
    ["classification_compatible_events", "enabled_classification"],
  );
  assert.equal(classification.output, "Anonymous visitor composition");

  // The component names the missing inputs by their typed labels rather than by
  // id, so an unavailable state stays readable on screen.
  const labelById = new Map(evidenceInputs.map((input) => [input.id, input.label]));
  assert.equal(
    labelById.get("classification_compatible_events"),
    "Classification-compatible visit events",
  );
  assert.equal(
    labelById.get("enabled_classification"),
    "Enabled, configured and permitted classification",
  );

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /classification\.missingInputIds/);
  assert.match(component, /inputLabelById\.get\(inputId\)/);
});

test("Composition evidence is Physical-rooted, never mobile_geo", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));

  // Every input the measured and derived readings name must be a physical
  // input. The mix is observed at the doors; aggregate area data never stands
  // in for that.
  for (const entry of scene.evidence.filter(
    (item) => item.type === "measured" || item.type === "derived",
  )) {
    for (const inputId of entry.inputIds) {
      assert.equal(roleByInput.get(inputId), "physical", `${inputId} must be physical`);
    }
  }
  assert.equal(roleByInput.get("classification_compatible_events"), "physical");
  assert.equal(roleByInput.get("enabled_classification"), "physical");

  // No evidence entry anywhere in the scene may name a mobile_geo input.
  const declaredInputRoles = new Set(
    scene.evidence.flatMap((entry) => entry.inputIds ?? []).map((id) => roleByInput.get(id)),
  );
  assert.ok(declaredInputRoles.has("physical"));
  assert.ok(!declaredInputRoles.has("mobile_geo"));
});

test("Visitor composition keeps Catchment's mobile_geo layer out of the rail", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.deepEqual([...scene.dataRequirements.required], ["physical", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional], ["business"]);

  // Mobile & geo is neither required nor optional here. That is stronger than
  // "optional context, switched off": who lives around the centre is a
  // different question from who is observed entering it, and the rail must say
  // so rather than offer aggregate area data as a fallback classification.
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

test("No catchment demographic language is presented as physical visitor classification", () => {
  const component = visibleCopy(readFileSync(COMPONENT_PATH, "utf8"));

  // The catchment vocabulary — households, postcodes, residents, population,
  // drive time, catchment bands — describes the area around the centre. It must
  // never appear here as something an entrance observes. The single permitted
  // mention of "catchment" is the truth line that separates the two, and it is
  // pinned by shape below so it cannot drift into a claim.
  for (const forbidden of [
    /household/i,
    /postcode/i,
    /\bresidents?\b/i,
    /population/i,
    /drive[- ]time/i,
    /catchment band/i,
    /\borigin mix\b/i,
    /affluen/i,
    /socio-?economic/i,
  ]) {
    assert.doesNotMatch(component, forbidden, `${forbidden} must not appear in this scene`);
  }

  // And the separation is made in the main copy, not only in the lens rail —
  // the rail's supporting notes are hidden below 1200px.
  assert.match(
    component,
    /who is observed entering the centre, not who lives in\s*\n?\s*the catchment around it/,
  );
});

test("Nothing in the Visitor composition scene equates a group with a people count", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const component = visibleCopy(readFileSync(COMPONENT_PATH, "utf8"));

  const typedCopy = [
    scene.title,
    scene.commercialQuestion,
    scene.supportingLine,
    scene.nextCta,
    ...scene.evidence.map((entry) => entry.description),
    ...scene.derivedDependencies.map((dependency) => dependency.output),
  ].join(" | ");

  // Neither the typed content nor the component may turn a visiting party into
  // a headcount, a transaction or an average.
  for (const forbidden of [
    /average party/i,
    /party size of/i,
    /group count/i,
    /groups?\s*=\s*/i,
    /per (?:group|party)/i,
    /transaction/i,
    /unique\s+visitor/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(component, forbidden, `${forbidden} must not appear in the component`);
  }

  // The distinction is stated positively, in the definition line, which renders
  // at every supported viewport.
  assert.match(
    component,
    /a visiting party is\s*\n?\s*the group that arrives together, never a count of people/,
  );
});

test("The Visitor composition scene states no composition value", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The scene has no approved demo values, so no share, split or band may be
  // written into the component — including anything carried over from the
  // Retail Property reference board (58/42, 78/22, 56/44).
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
});

test("The Visitor composition scene carries no identity or recognition language", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const component = visibleCopy(readFileSync(COMPONENT_PATH, "utf8"));

  const typedCopy = [
    scene.title,
    scene.commercialQuestion,
    scene.supportingLine,
    scene.nextCta,
    ...scene.evidence.map((entry) => entry.description),
    ...scene.derivedDependencies.map((dependency) => dependency.output),
  ].join(" | ");

  // Neither the typed content nor the component may reach for identity, face or
  // person-level vocabulary — not even to deny it. Naming the technique plants
  // the idea; the scene states what it is instead.
  for (const forbidden of [
    /facial/i,
    /face recognition/i,
    /recognition/i,
    /biometric/i,
    /\bidentif/i,
    /re-?identif/i,
    /personal profile[sd]/i,
    /individual profile/i,
    /named (?:person|individual|visitor)/i,
    /person-level/i,
    /\btracking\b/i,
    /\bsurveillance\b/i,
    /\bage \d/i,
    /\bmale\b/i,
    /\bfemale\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(component, forbidden, `${forbidden} must not appear in the component`);
  }

  // The privacy register is stated positively, in the main copy, and never as a
  // compliance claim.
  assert.match(
    component,
    /Anonymous statistical classification only — no identity and no personal\s*\n?\s*profile/,
  );
  assert.doesNotMatch(component, /GDPR/i, "no compliance claim may be made in a scene");
  assert.doesNotMatch(component, /100\s*%/);

  // The alt text describes the plate without framing a face.
  assert.match(component, /No face is framed or outlined and no marker carries a label/);
});

test("Visitor composition names no sensor, vendor or camera technology", () => {
  const component = visibleCopy(readFileSync(COMPONENT_PATH, "utf8"));

  // Technology stays behind the rail's "How we measure this" drilldown, which is
  // rendered by the shared SceneLensRail from typed content — never written into
  // the scene itself.
  for (const vendor of [/xovis/i, /milesight/i, /bosch/i, /isarsoft/i, /lidar/i, /\bcamera\b/i, /\bsensor\b/i]) {
    assert.doesNotMatch(component, vendor, `${vendor} must not appear in the scene`);
  }
});

test("Visitor composition reuses TECH-03 and invents no new technology content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual([...scene.technologyCapabilityIds], ["TECH-03"]);

  const capabilities = getTechnologyCapabilitiesForScene(SCENE);
  assert.equal(capabilities.length, 1);
  assert.equal(capabilities[0].id, "TECH-03");
  assert.equal(capabilities[0].name, "Anonymous visitor classification");

  // The same capability Retail's own visitor composition scene drills into —
  // reused, not duplicated for this segment.
  assert.ok(capabilities[0].supportedSceneIds.includes("retail-visitor-composition"));
  assert.ok(capabilities[0].supportedSceneIds.includes(SCENE));

  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 1);
  assert.equal(drilldown.capabilities[0].capability.id, "TECH-03");

  // The capability's own privacy principle is what carries the "only where
  // included, permitted and configured" caveat into the drilldown.
  assert.match(
    drilldown.capabilities[0].capability.privacyPrinciple,
    /optional and estimated; use it only where included, permitted and configured/,
  );
});

test("Visitor composition proof resolves to an unapproved placeholder, never a live case", () => {
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);

  assert.ok(proof);
  assert.equal(proof.hasInternalProof, true);
  assert.equal(proof.hasExternalProof, false);
  assert.equal(proof.hasPlayableProof, false);
  assert.equal(proof.internalProofs[0].id, "CASE-SC-02");
  assert.equal(proof.internalProofs[0].status, "placeholder");
  assert.equal(proof.internalProofs[0].externalUseApproved, false);
});

test("Visitor composition offers no optional branch, because none is typed", () => {
  assert.deepEqual(getOptionalBranchesForScene(SEGMENT, SCENE), []);

  // Nothing in the segment declares Visitor composition as a branch parent, so
  // the component renders no branch affordance.
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
  assert.doesNotMatch(source, /composition__branch/);
});

test("Visitor composition renders its own production hero, and it exists on disk", () => {
  assert.ok(existsSync(HERO_PATH));

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    component.includes(`src="${HERO_URL}"`),
    "the scene must render the location-visuals hero for this scene",
  );
  assert.ok(HERO_URL.includes("/location-visuals/shopping-centre/"));
});

test("Visitor composition does not reuse the Entrances hero, and Entrances keeps its own", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    !component.includes(ENTRANCES_HERO_URL),
    "the approved Entrances plate belongs to the Entrances scene alone",
  );

  // And the reverse: the approved Entrances scene must not be repointed at this
  // scene's plate. The two plates are near-identical photographs and the only
  // thing keeping the scenes apart is that each renders its own.
  const entrances = readFileSync(
    repoFile("app/components/ShoppingCentreEntrancesScene.tsx"),
    "utf8",
  );
  assert.ok(entrances.includes(`src="${ENTRANCES_HERO_URL}"`));
  assert.ok(!entrances.includes(HERO_URL));
  assert.ok(existsSync(repoFile(`public${ENTRANCES_HERO_URL}`)));
});

test("Visitor composition reaches no legacy locations/ asset and no other segment's asset", () => {
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

test("Building Visitor composition does not make Shopping Centre navigable", () => {
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
