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
const SCENE = "shopping-centre-time-in-centre";

const repoFile = (relative) =>
  fileURLToPath(new URL(`../${relative}`, import.meta.url));

const COMPONENT_PATH = repoFile("app/components/ShoppingCentreTimeInCentreScene.tsx");
const PREVIEW_PATH = repoFile("app/preview/shopping-centre-time-in-centre/page.tsx");

/* The production hero. Per the asset-selection rule in AGENTS.md, a scene hero
   comes from `public/assets/location-visuals/<segment>/` — the curated
   production set — not from the legacy `public/assets/locations/` tree.

   A calm skylit atrium with a seating lounge: people settled in armchairs
   around a low table, someone on the planter bench, others standing at a café
   counter — and, decisively, soft concentric purple rings spreading on the
   floor beneath each of them. Rings under people who are NOT MOVING are what
   makes this plate and no other: they read as elapsed presence rather than as a
   path taken, which is a different object from Internal circulation's route
   network, Zone & anchor exposure's outlined units, Brand counting's line in a
   doorway and Brand flow's dotted link between two shopfronts. */
const HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-time-in-centre-hero.png";
const HERO_PATH = repoFile(`public${HERO_URL}`);

/* Two plates in the production directory that are deliberately NOT used. The
   dwell plate is the same photograph Internal circulation renders — and it is
   the single most tempting wrong choice here, because its FILENAME says
   "dwell", which is the word this scene must not build itself around. The
   parking plate belongs to the segment's parking branch. */
const REJECTED_HERO_URLS = [
  "/assets/location-visuals/shopping-centre/shopping-centre-dwell-hero.png",
  "/assets/location-visuals/shopping-centre/shopping-centre-parking-intelligence-hero.png",
];

/* The seven human-approved and LOCKED Shopping Centre plates. Each belongs to
   exactly one scene and this scene must render none of them. */
const APPROVED_SCENE_HEROES = {
  "app/components/ShoppingCentreCatchmentScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-geo-intelligence-hero.png",
  "app/components/ShoppingCentreEntrancesScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-visitors-hero.png",
  "app/components/ShoppingCentreVisitorCompositionScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-visitor-composition-hero.png",
  "app/components/ShoppingCentreInternalCirculationScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-spatial-journey-hero.png",
  "app/components/ShoppingCentreZoneAnchorExposureScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-brand-journey-hero.png",
  "app/components/ShoppingCentreBrandCountingScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-brand-counting-hero.png",
  "app/components/ShoppingCentreBrandFlowScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-visitor-brand-flow-hero.png",
};

/* What the scene actually puts on screen: component source with its explanatory
   comments removed.

   The comments in these components carry the reasoning behind a decision, and
   that reasoning legitimately names the very things the copy must avoid — "no
   length is read as enjoyment, satisfaction or spend", "nothing may imply that
   a person is followed". Scanning raw source would therefore fail on the
   sentences that document the boundary rather than on a breach of it, so every
   copy-boundary test below reads the stripped text. */
const stripComments = (source) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ")
    // JSX requires a bare apostrophe in text to be written as an entity, so the
    // entity is folded back to the character the reader actually sees.
    .replace(/&rsquo;|&apos;|&#39;/g, "'");

/* Neither markup nor code is copy, and a ban that fires on their syntax has not
   caught a breach. Two kinds are removed:

   - element tags: `<strong>` is an element name, not the word "strong";
   - implementation expressions: `alternativeLabels.length > 0` is a render
     condition, not a stated figure.

   JSX expression containers are deliberately NOT removed wholesale. Conditional
   rendering wraps real sentences in braces, so stripping every `{...}` would
   delete the very copy under test — including this scene's whole definition
   line, which sits inside a `period ? ... : ...` ternary. */
const stripMarkup = (source) =>
  source
    .replace(/<[^>]*>/g, " ")
    .replace(/\s*(?:[<>]=?|={2,3}|!==?)\s*\d+/g, " ");

/* Comments gone, markup intact — for the few assertions that pin the JSX
   composition itself rather than the words a reader sees. */
const structuralSource = (source) => stripComments(source);

/* Reader-visible copy: the words the scene puts on the screen in its own voice.
   Alt text is deliberately NOT folded in here — it describes a photograph
   rather than asserting a claim, so it is governed by its own rules and tested
   on its own below. */
const visibleCopy = (source) => stripMarkup(stripComments(source));

/* The alt text alone, for the test that governs it. */
const altCopy = (source) =>
  [...stripComments(source).matchAll(/\balt="([^"]*)"/g)].map((match) => match[1]).join(" ");

/* JSX wraps a sentence across source lines at arbitrary points, so copy
   assertions run against a whitespace-flattened form. */
const flatten = (text) => text.replace(/\s+/g, " ");

/* The scene's own typed words, as one string, for the assertions that must hold
   of the content model and not only of the component. */
const typedCopyFor = (scene) =>
  [
    scene.title,
    scene.commercialQuestion,
    scene.supportingLine,
    scene.nextCta,
    ...scene.evidence.map((entry) => entry.description),
    ...scene.derivedDependencies.map((dependency) => dependency.output),
  ].join(" | ");

// Data-binding tests for the eighth and LAST Shopping Centre Core scene. They
// assert what the component reads out of the runtime and the boundaries its
// copy must not cross — not how it lays anything out — so they fail if the
// typed content or a runtime resolution changes underneath the scene, and stay
// silent about visual decisions.

test("Time in centre binds its headline, eyebrow and CTA from typed content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.equal(scene.commercialQuestion, "How long do visitors stay in the asset?");
  assert.equal(
    scene.supportingLine,
    "Understand depth of visit and operational pressure by period",
  );
  assert.equal(scene.nextCta, "Configure solution");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /stageLabel\(scene\.journeyStage\)/);
  assert.match(component, /\{scene\.commercialQuestion\}/);
  assert.match(component, /\{scene\.supportingLine\}/);
  assert.match(component, /\{scene\.nextCta\}/);

  // No shortened or reworded headline is written into the component; the typed
  // question is the only one on screen.
  assert.doesNotMatch(visibleCopy(component), /<h1[^>]*>(?!\{scene\.commercialQuestion\})/);
});

test("The eyebrow names duration, and no locked Understand scene's descriptor", () => {
  // Structural: this test pins the eyebrow's markup and reads the descriptor out
  // of it, so it needs the tags left in place.
  const component = flatten(structuralSource(readFileSync(COMPONENT_PATH, "utf8")));

  assert.match(
    component,
    /\{stageLabel\(scene\.journeyStage\)\} <span aria-hidden="true">·<\/span> Time in centre/,
  );

  const descriptor = component.match(/<\/span> ([A-Z][A-Za-z ]*?)\s*<\/p>/);
  assert.ok(descriptor, "the eyebrow must carry a secondary descriptor");
  assert.equal(descriptor[1], "Time in centre");

  // Four locked Understand steps sit ahead of this one and each has taken its
  // own descriptor. Reusing any of them would give two Understand scenes an
  // identical eyebrow — and the four locked descriptors all name a PLACE or a
  // RELATION, which is exactly what this scene does not own.
  for (const taken of [
    "Outside",
    "Entrance",
    "Composition",
    "Circulation",
    "Zones",
    "Brands",
    "Between brands",
  ]) {
    assert.notEqual(descriptor[1], taken, `${taken} belongs to another scene's eyebrow`);
  }

  // And the four locked Understand components still carry theirs, so this scene
  // is genuinely distinct rather than distinct because one of them changed.
  const lockedEyebrows = {
    "app/components/ShoppingCentreInternalCirculationScene.tsx": "Circulation",
    "app/components/ShoppingCentreZoneAnchorExposureScene.tsx": "Zones",
    "app/components/ShoppingCentreBrandCountingScene.tsx": "Brands",
    "app/components/ShoppingCentreBrandFlowScene.tsx": "Between brands",
  };
  for (const [path, label] of Object.entries(lockedEyebrows)) {
    const locked = flatten(structuralSource(readFileSync(repoFile(path), "utf8")));
    assert.ok(
      locked.includes(`<span aria-hidden="true">·</span> ${label}`),
      `${path} must keep its own eyebrow descriptor`,
    );
    assert.notEqual(label, descriptor[1]);
  }
});

test("Time in centre is an Understand step and the segment's fifth one", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.equal(scene.journeyStage, "understand");
  assert.equal(scene.priority, "core");
  assert.equal(scene.corePathOrder, 8);

  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);
  const understand = core.filter((entry) => entry.journeyStage === "understand");
  assert.equal(understand[0].id, "shopping-centre-internal-circulation");
  assert.equal(understand[1].id, "shopping-centre-zone-anchor-exposure");
  assert.equal(understand[2].id, "shopping-centre-brand-counting");
  assert.equal(understand[3].id, "shopping-centre-brand-flow");
  assert.equal(understand[4].id, SCENE);

  const preview = readFileSync(PREVIEW_PATH, "utf8");
  assert.match(preview, /stageId === "understand"/);
});

test("Time in centre resolves only inside Shopping Centre; cross-segment lookup is rejected", () => {
  assert.equal(getSceneForSegment(SEGMENT, SCENE).segment, SEGMENT);

  for (const otherSegment of ["retail", "retail-park", "outlet-centre", "qsr"]) {
    assert.throws(
      () => getSceneForSegment(otherSegment, SCENE),
      `${SCENE} must not resolve inside ${otherSegment}`,
    );
  }

  assert.throws(() => getSceneForSegment(SEGMENT, "outlet-centre-dwell-time"));
  assert.throws(() => getSceneForSegment(SEGMENT, "retail-park-dwell-time"));
});

test("Time in centre is Core step 8 and the LAST step in the Core route", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);

  const index = core.findIndex((entry) => entry.id === SCENE);
  assert.equal(index, core.length - 1, "Time in centre must be the last Core step");
  assert.equal(core[index - 1].id, "shopping-centre-brand-flow");
  assert.equal(core[index - 1].nextSceneId, SCENE);
  assert.equal(core[core.length - 1].corePathOrder, 8);

  // The Core route ends here: no next scene is typed at all.
  assert.equal(scene.nextSceneId, undefined);
  assert.ok(!("nextSceneId" in scene) || scene.nextSceneId === undefined);

  // No other Core scene may point at this one as a continuation except Brand
  // flow, and nothing anywhere points onward from it.
  const pointingHere = getScenesForSegment(SEGMENT).filter(
    (entry) => entry.nextSceneId === SCENE,
  );
  assert.deepEqual(pointingHere.map((entry) => entry.id), ["shopping-centre-brand-flow"]);
});

test("The absent nextSceneId renders no next-scene link and is never invented", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  const visible = visibleCopy(component);

  // The component never reads the typed next scene, so an undefined value can
  // neither crash it nor leak an empty target into the markup.
  assert.doesNotMatch(visible, /nextSceneId/);

  // No scene id is hard-coded as a destination either — in particular no
  // Configure scene id, which is the obvious thing to invent for the last Core
  // step.
  assert.doesNotMatch(visible, /shopping-centre-configure/);
  assert.doesNotMatch(visible, /onNextScene\(["'][^"']+["']\)/);

  // The step forward is the same typed-label button every other scene renders,
  // wired to the shell's own callback — not an anchor to a route.
  assert.match(component, /<button type="button" className="capture__cta" onClick=\{onNextScene\}>/);
  assert.doesNotMatch(visible, /<a\s/);
  assert.doesNotMatch(visible, /href=/);

  // And the preview harness passes a no-op, so nothing navigates from here.
  const preview = readFileSync(PREVIEW_PATH, "utf8");
  assert.match(preview, /onNextScene=\{\(\) => \{\}\}/);
});

test("Time in centre has no approved demo evidence and reports it honestly", () => {
  const runtime = getSceneEvidenceRuntime(SEGMENT, SCENE);

  assert.equal(runtime.evidence.length, 0);
  assert.equal(runtime.availableEvidence.length, 0);
  assert.equal(runtime.periodMetadata, null);
  assert.equal(runtime.illustrativeFlag, false);

  // Three source-bearing entries — measured, connected, derived — each reported
  // as missing demo values rather than filled with a plausible substitute. The
  // fourth typed entry is the `decision` line, which names no input.
  assert.equal(runtime.unavailableEvidence.length, 3);
  for (const entry of runtime.unavailableEvidence) {
    assert.equal(entry.reason, "no_demo_values");
  }
});

test("Time in centre's three callouts each resolve a typed evidence description", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  for (const type of ["measured", "connected", "derived"]) {
    const matches = scene.evidence.filter((entry) => entry.type === type);
    assert.equal(matches.length, 1, `expected one ${type} evidence entry`);
    assert.ok(matches[0].description.length > 0);
  }

  const byType = (type) => scene.evidence.find((entry) => entry.type === type).description;
  assert.match(byType("measured"), /Anonymous entrance events are matched across supported coverage or continuous tracked journeys\./);
  assert.match(byType("connected"), /Event, opening-hours and zone context can segment the time pattern\./);
  assert.match(byType("derived"), /derived only from supported matching and aligned definitions/);
  assert.match(byType("decision"), /Understand depth of visit and operational pressure by period\./);

  // The callouts read from typed content rather than restating it inline.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /evidence\?\.description \?\? ""/);
  assert.match(component, /\{cluster\.note\}/);

  // The observed length, then the context a pattern may be read against, then
  // the limit of what a length of stay establishes. The order is this scene's
  // argument, so it is pinned rather than left to rhythm.
  const order = [...component.matchAll(/evidenceType: "(measured|connected|derived)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(order, ["measured", "connected", "derived"]);
});

test("The distribution is satisfied by EITHER matched visit events OR trip duration events", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The segment's first either/or dependency: no required inputs at all, and
  // two alternative groups of ONE input each. Either group alone satisfies it,
  // and the copy must not imply both are needed.
  assert.equal(scene.derivedDependencies.length, 1);
  const dependency = scene.derivedDependencies[0];
  assert.equal(dependency.id, "shopping-centre-time-in-centre-distribution");
  assert.equal(dependency.output, "Time-in-centre distribution");
  assert.deepEqual([...dependency.requiredInputIds], []);
  assert.deepEqual(
    dependency.alternativeInputGroups.map((group) => [...group]),
    [["matched_visit_events"], ["trip_duration_events"]],
  );
  for (const group of dependency.alternativeInputGroups) {
    assert.equal(group.length, 1, "each alternative must stand on its own single input");
  }

  // The runtime's own satisfaction rule is `group.every(input => satisfied)`
  // with `available = requiredSatisfied || someGroupSatisfied`, and
  // `requiredInputIds` is empty here so `requiredSatisfied` can never be true.
  // Reproducing that rule against each single-input case pins the either/or
  // contract itself: EITHER input alone resolves the dependency, and only the
  // absence of both leaves it unresolved.
  const resolves = (available) =>
    dependency.alternativeInputGroups.some((group) => group.every((id) => available.has(id)));
  assert.equal(resolves(new Set(["matched_visit_events"])), true, "matched visit events alone must resolve it");
  assert.equal(resolves(new Set(["trip_duration_events"])), true, "trip duration events alone must resolve it");
  assert.equal(resolves(new Set(["matched_visit_events", "trip_duration_events"])), true);
  assert.equal(resolves(new Set()), false, "neither input present must leave it unresolved");
  assert.equal(resolves(new Set(["operational_context"])), false);

  // As resolved today: Shopping Centre has no entries in the demo evidence
  // catalog, so neither alternative is backed and the dependency is unavailable
  // — with NO missing inputs named, because `missingInputIds` is derived from
  // the empty `requiredInputIds`. That is precisely why the component describes
  // the unavailable state from the alternative groups instead.
  const distribution = getSceneDependencyAvailability(SEGMENT, SCENE).find(
    (entry) => entry.dependencyId === "shopping-centre-time-in-centre-distribution",
  );
  assert.ok(distribution);
  assert.equal(distribution.available, false);
  assert.deepEqual([...distribution.missingInputIds], []);
  assert.equal(distribution.satisfiedByAlternativeGroup, undefined);

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /alternativeInputGroups \?\? \[\]/);
  assert.match(component, /inputLabelById\.get\(inputId\)/);
  assert.doesNotMatch(visibleCopy(component), /missingInputIds/);
});

test("The definition line phrases the dependency as either/or, never as both", () => {
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));

  // "needs either X or Y" — the words that keep the first either/or dependency
  // in the segment from reading as a pair of requirements.
  // Structural, not copy: it pins the JSX expression itself.
  assert.match(
    flatten(structuralSource(readFileSync(COMPONENT_PATH, "utf8"))),
    /needs either \{alternativeLabels\.join\(" or "\)\}/,
  );
  assert.match(visible, /alternativeLabels\.join\(" or "\)/);
  assert.doesNotMatch(visible, /join\(" · "\)/);
  assert.doesNotMatch(visible, /\bneeds both\b/i);
  assert.doesNotMatch(visible, /\band also requires\b/i);

  // The two labels it will print, pinned so a rename cannot quietly change what
  // the sentence claims.
  const labelById = new Map(evidenceInputs.map((input) => [input.id, input.label]));
  assert.equal(labelById.get("matched_visit_events"), "Supported anonymous matched visit events");
  assert.equal(labelById.get("trip_duration_events"), "Supported vehicle or visitor duration events");

  // And the same either/or is carried in the scene's own written truth line, so
  // it survives at 1024x768 where the lens rail's notes are hidden.
  assert.match(
    visible,
    /either one alone is enough, and neither covers every visit\./,
  );
});

test("Business is OPTIONAL here, and the scene does not force it on", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The first Shopping Centre scene where Business is not required. A length of
  // stay is measured without it; `operational_context` only lets the pattern be
  // read against opening hours, events and operating periods.
  assert.deepEqual([...scene.dataRequirements.required], ["physical", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional], ["business"]);
  assert.ok(!scene.dataRequirements.required.includes("business"));

  // Every locked Shopping Centre Core scene ahead of this one requires
  // Business, which is what makes this scene's shape a real difference rather
  // than an oversight.
  for (const locked of [
    "shopping-centre-internal-circulation",
    "shopping-centre-zone-anchor-exposure",
    "shopping-centre-brand-counting",
    "shopping-centre-brand-flow",
  ]) {
    assert.ok(
      getSceneForSegment(SEGMENT, locked).dataRequirements.required.includes("business"),
      `${locked} must keep Business required`,
    );
  }

  // The Business input is connected context and nothing more.
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));
  const connected = scene.evidence.find((entry) => entry.type === "connected");
  assert.deepEqual([...connected.inputIds], ["operational_context"]);
  assert.equal(roleByInput.get("operational_context"), "business");

  // The scene supplies rail notes for the two REQUIRED roles only. The shared
  // rail renders an optional role with no demo values as "Awaiting demo
  // evidence"; supplying a note for Business would dress an optional layer up
  // as a contributing one, so none is supplied and the shared honest text
  // stands.
  const component = visibleCopy(readFileSync(COMPONENT_PATH, "utf8"));
  assert.match(component, /physical: "/);
  assert.match(component, /insight: "/);
  assert.doesNotMatch(component, /\bbusiness: "/);

  // Switching Business off changes nothing the scene shows, because it supplies
  // no value here.
  const withoutBusiness = getSceneDependencyAvailability(SEGMENT, SCENE, [
    "physical",
    "insight",
  ]);
  const withBusiness = getSceneDependencyAvailability(SEGMENT, SCENE, [
    "physical",
    "business",
    "insight",
  ]);
  assert.deepEqual(
    withoutBusiness.map((entry) => entry.available),
    withBusiness.map((entry) => entry.available),
  );
});

test("Time in centre keeps Catchment's mobile_geo layer out of the rail", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Mobile & geo is neither required nor optional here. Aggregate area context
  // describes a population around the centre; it does not observe when one
  // visit began and ended inside it.
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

  const geoOnly = getSceneDependencyAvailability(SEGMENT, SCENE, ["mobile_geo", "insight"]).find(
    (entry) => entry.dependencyId === "shopping-centre-time-in-centre-distribution",
  );
  assert.equal(geoOnly.available, false);

  // And the scene supplies no note for a lens it cannot offer, so the rail's own
  // honest "No compatible input enabled" is never overridden.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.doesNotMatch(visibleCopy(component), /mobile_geo\s*:/);
});

test("A length of stay is never read as enjoyment, satisfaction or spend", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // The single most over-claimable step in the segment. Time observed is time
  // observed: it is not enjoyment, not satisfaction, not engagement, not
  // experience quality, not loyalty, and not money. Nothing here may bridge
  // duration to any of them.
  for (const forbidden of [
    /\benjoy(?:s|ed|ing|ment|able)?\b/i,
    /\bsatisf(?:ied|action|ying)\b/i,
    /\bhapp(?:y|iness)\b/i,
    /\bpleas(?:ed|ant|ure)\b/i,
    /\bengag(?:ed|ing|ement)\b/i,
    /\bexperience quality\b/i,
    /\bquality of (?:visit|experience|stay)\b/i,
    /\bcomfort(?:able)?\b/i,
    /\bdwell quality\b/i,
    /\bloyal(?:ty)?\b/i,
    /\bretention\b/i,
    /\bsticki/i,
    /\bspend(?:s|ing)?\b/i,
    /\bsales\b/i,
    /\brevenue\b/i,
    /\bturnover\b/i,
    /\bconversions?\b/i,
    /\bbasket\b/i,
    /\btransactions?\b/i,
    /\bpurchas/i,
    /\bbuy(?:s|ing)?\b/i,
    /\bbought\b/i,
    /\bintent\b/i,
    /\bintention/i,
    /\bpropensity\b/i,
    /\blikelihood\b/i,
    /\bPOS\b/,
    /\breceipts?\b/i,
    /\btill\b/i,
    /\battribution\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }
});

test("No duration is ranked, scored or evaluated", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // A long visit is not a good visit and a short visit is not a bad one. The
  // scene observes a length; it never grades one, compares one favourably, or
  // explains why a visit lasted as long as it did.
  for (const forbidden of [
    /\bgood\b/i,
    /\bbad\b/i,
    /\bpoor(?:ly)?\b/i,
    /\bbetter\b/i,
    /\bworse\b/i,
    /\bbest\b/i,
    /\bworst\b/i,
    /\bhealthy\b/i,
    /\bstrong(?:er|est)?\b/i,
    /\bweak(?:er|est)?\b/i,
    /\bideal\b/i,
    /\btarget (?:dwell|duration|time)\b/i,
    /\bbenchmark\b/i,
    /\branked?\b/i,
    /\branking\b/i,
    /\bscore[sd]?\b/i,
    /\bgrade[sd]?\b/i,
    /\bsuccess(?:ful)?\b/i,
    /\bunderperform/i,
    /\bimprove(?:s|d|ment)?\b/i,
    /\bincrease\b/i,
    /\bmaximi[sz]/i,
    /\boptimi[sz]/i,
    /\bshould\b/i,
    /\brecommend(?:s|ed|ation)?\b/i,
    /\bbecause\b/i,
    /\bcauses?\b/i,
    /\bcausal\b/i,
    /\bdue to\b/i,
    /\bdrives\b/i,
    /\bdriving\b/i,
    /\bleads? to\b/i,
    /\bresults? in\b/i,
    /\bexplains? why\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }
});

test("Matching is anonymous, and nothing in the scene implies a recognised person", () => {
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));

  // TECH-05 is ANONYMOUS visit matching, and a duration is the most personal
  // sounding thing the product produces. Nothing the scene writes may imply
  // identity, recognition, re-identification, a profile, a device, or an
  // individual being followed through the centre.
  //
  // Scope note: this reads the component's OWN written copy. The typed
  // `measured` entry contains the phrase "continuous tracked journeys", which
  // the component renders by reference rather than restating; that typed
  // sentence is the content model's, not this scene's, and it is asserted
  // verbatim in the callout test above.
  for (const forbidden of [
    /\bidentit(?:y|ies)\b/i,
    /\bidentif/i,
    /\brecogni[sz]/i,
    /\bre-?identif/i,
    /\bprofile[sd]?\b/i,
    /\bprofiling\b/i,
    /\btrack(?:s|ed|ing)?\b/i,
    /\btrace[sd]?\b/i,
    /\btracing\b/i,
    /\bfollow(?:s|ed|ing)?\b/i,
    /\bdevices?\b/i,
    /\bphones?\b/i,
    /\bmac address/i,
    /\bopt-?in\b/i,
    /\bshopper id\b/i,
    /\bsame person\b/i,
    /\bindividual (?:shopper|visitor|person)/i,
    /\bpersonal data\b/i,
    /\bcookie/i,
    /\blogged in\b/i,
    /\bmember/i,
    /\bloyalty card\b/i,
    /\bwho (?:they|the visitor) (?:is|was)\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }

  // And the words that do the work are present in the main copy, not only
  // inside a typed callout.
  assert.match(visible, /Time in centre is the length of an anonymous presence window/);
  assert.match(visible, /never who it belonged to and never what happened inside it/);
  assert.match(visible, /physical: "Anonymous presence windows, observed where matching is supported"/);
});

test("The coverage-or caveat survives into the main copy", () => {
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));

  // The coverage boundary is carried by the typed measured entry, and it has to
  // survive at 1024x768, where the lens rail's supporting notes are hidden by a
  // shared rule this scene does not own. It is therefore stated in the headline
  // block — and stated as an EITHER/OR, because that is what the model types.
  assert.match(
    visible,
    /It can be read only where anonymous entrance events are matched across supported coverage, or where a continuous anonymous journey is supported; either one alone is enough, and neither covers every visit\./,
  );

  // And the consequence, said once in the definition line — which renders at
  // every supported viewport. This is the specific thing a reader gets wrong
  // here: an uncovered visit does not produce a short duration, it produces
  // none at all.
  assert.match(
    visible,
    /a length of stay exists only where one of the two supported forms of matching covers the visit, so an uncovered visit is absent from the reading rather than recorded as a short one/,
  );

  // "supported" is the scene's load-bearing qualifier and it is never dropped
  // from the callout that names the measured object.
  assert.match(visible, /How long an anonymous presence window lasted, where it is covered/);
});

test("The Time in centre scene states no duration, share or split value", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The scene has no approved demo values, so no minute figure, average, share,
  // percentage or split may be written into it. Scanned over the rendered block
  // alone, from `return (` onwards: that is exactly what reaches the screen.
  const rendered = component.slice(component.indexOf("return ("));
  const copy = visibleCopy(rendered).replace(/<svg[\s\S]*?<\/svg>/g, "");

  assert.doesNotMatch(copy, /\d+\s*%/, "no percentage may be stated");
  assert.doesNotMatch(
    copy,
    /\b\d+\s*(?:min|minutes?|sec|seconds?|hrs?|hours?)\b/i,
    "no duration may be stated",
  );
  assert.doesNotMatch(copy, /\b\d{2,}\s*\/\s*\d{2,}\b/, "no split may be stated");
  assert.doesNotMatch(copy, /\b\d+\b/, "no bare figure may be stated");

  for (const forbidden of [
    /\baverage (?:dwell|visit|stay|duration)\b/i,
    /\bmedian\b/i,
    /\bmean (?:visit|stay|duration)\b/i,
    /\bshare of (?:visitors|visits|footfall)\b/i,
    /\bout of every\b/i,
    /\bone in \w+\b/i,
    /\bunder an hour\b/i,
    /\bover an hour\b/i,
    /\btypical(?:ly)? (?:stay|visit)\b/i,
  ]) {
    assert.doesNotMatch(copy, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("The hero alt text describes the photograph without asserting a measurement", () => {
  const alt = flatten(altCopy(readFileSync(COMPONENT_PATH, "utf8")));

  assert.ok(alt.length > 0, "the hero must carry alt text");

  // Alt text is governed by different rules from the scene's own copy. It is a
  // description of a photograph, so it MAY name what is physically in the
  // picture — a balcony of shopfronts, a seating lounge — without that counting
  // as this scene claiming another scene's subject. What it may not do is
  // assert a measurement, a value, or an identity.

  // 1. It states no figure. A picture of a visit cannot report its length.
  assert.doesNotMatch(alt, /\d+\s*%/, "no percentage may appear in alt text");
  assert.doesNotMatch(
    alt,
    /\b\d+\s*(?:min|minutes?|sec|seconds?|hrs?|hours?)\b/i,
    "no duration may appear in alt text",
  );
  assert.doesNotMatch(alt, /\b\d+\b/, "no bare figure may appear in alt text");

  // 2. Nobody in the picture is identified, recognised or followed. The rings
  //    are a presence, not a person with a history.
  for (const forbidden of [
    /\bidentif(?:y|ied|ication)\b/i,
    /\brecognis(?:e|ed)\b/i,
    /\brecogniz(?:e|ed)\b/i,
    /\bprofiled?\b/i,
    /\bfollowed\b/i,
    /\btracked\b/i,
    /\bre-?identif/i,
    /\bfacial\b/i,
    /\bface recognition\b/i,
  ]) {
    assert.doesNotMatch(alt, forbidden, `${forbidden} must not appear in alt text`);
  }

  // 3. No length of stay is graded, and no crowd is called busy or quiet — the
  //    same evaluative ban the visible copy carries, applied to the image.
  for (const forbidden of [
    /\bgood\b/i,
    /\bbad\b/i,
    /\bpoor(?:ly)?\b/i,
    /\bbetter\b/i,
    /\bbest\b/i,
    /\bbusy\b/i,
    /\bquiet\b/i,
    /\bpopular\b/i,
    /\bengaged?\b/i,
    /\bsatisf(?:ied|action)\b/i,
    /\bloyal(?:ty)?\b/i,
    /\bdwell time\b/i,
    /\blingering\b/i,
  ]) {
    assert.doesNotMatch(alt, forbidden, `${forbidden} must not appear in alt text`);
  }

  // 4. And it says the boundary out loud, so a screen-reader user is told the
  //    same thing a sighted reader can see: nothing in the image is labelled.
  assert.match(
    alt,
    /No ring, seat or shopfront carries a label, a clock or a figure, and no face is framed or marked/,
  );
});

test("Time in centre owns overall visit length, not the locked scenes' subjects", () => {
  // Scoped to the scene's own written voice. The alt text is excluded by
  // construction: it describes the photograph, in which a balcony of shopfronts
  // is plainly visible, and describing what is in the picture is not this scene
  // claiming another scene's subject. Alt text has its own test.
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));

  // Zone & anchor exposure owns defined areas, anchors and area-level dwell;
  // Internal circulation owns routes, corridors, escalators and transitions;
  // Brand flow owns the sequence between two tenants; Brand counting owns the
  // shopfront threshold. This scene owns the OVERALL length of a visit to the
  // centre, and its own written copy must restate none of them.
  //
  // Note the scope: this reads the component's own words. The typed `derived`
  // entry legitimately contains "dwell" and the typed `connected` entry
  // contains "zone"; both reach the screen only by reference through
  // `evidence[].description`, never written into this component.
  for (const forbidden of [
    /\bzones?\b/i,
    /\banchors?\b/i,
    /\bdwell\b/i,
    /\bcorridors?\b/i,
    /\bescalator/i,
    /\btransitions?\b/i,
    /\bsequences?\b/i,
    /\broutes?\b/i,
    /\btrajector/i,
    /\bwayfinding\b/i,
    /\bfloor-to-floor\b/i,
    /\bflow matrix\b/i,
    /\bhot\/cold\b/i,
    /\bthresholds?\b/i,
    /\bbrands?\b/i,
    /\btenants?\b/i,
    /\bshopfronts?\b/i,
    /\bcross-visitation\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} belongs to another Shopping Centre scene`);
  }

  // The concepts this scene does lead with, in the order of its own argument.
  assert.match(visible, /How long an anonymous presence window lasted, where it is covered/);
  assert.match(
    visible,
    /The opening-hours, event and operating context a time pattern can be read against/,
  );
  assert.match(visible, /What a length of stay establishes, and what it does not/);
});

test("Nothing is drawn on top of the Time in centre photograph", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // No label, legend, clock, pin, number, histogram or badge is rendered above
  // the hero. The plate is a single <img> inside the shared hero figure and
  // nothing else.
  const hero = component.match(/<figure className="capture__hero[\s\S]*?<\/figure>/);
  assert.ok(hero, "the hero must stay a single shared figure");
  const heroChildren = [...hero[0].matchAll(/<([a-zA-Z]+)/g)].map((match) => match[1]);
  assert.deepEqual(heroChildren, ["figure", "img"]);

  assert.doesNotMatch(
    component,
    /sc-time__(?:label|legend|pin|marker|badge|arrow|clock|heat|overlay|bar|chart|histogram|curve|gauge|timeline)/,
  );
  const visible = flatten(visibleCopy(component));
  assert.doesNotMatch(visible, /\bheat ?map\b/i);
  assert.doesNotMatch(visible, /\bhistogram\b/i);
  assert.doesNotMatch(visible, /\bdashboard\b/i);
});

test("Time in centre names no sensor, vendor or camera technology", () => {
  const visible = visibleCopy(readFileSync(COMPONENT_PATH, "utf8"));

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
    /\bre-?id\b/i,
  ]) {
    assert.doesNotMatch(visible, vendor, `${vendor} must not appear in the scene`);
  }
});

test("Time in centre reuses TECH-05 and TECH-04 and invents no new technology content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual([...scene.technologyCapabilityIds], ["TECH-05", "TECH-04"]);

  const capabilities = getTechnologyCapabilitiesForScene(SCENE);
  assert.deepEqual(capabilities.map((entry) => entry.id).sort(), ["TECH-04", "TECH-05"]);

  const byId = new Map(capabilities.map((entry) => [entry.id, entry]));
  assert.equal(byId.get("TECH-04").name, "Spatial movement intelligence");
  assert.equal(byId.get("TECH-05").name, "Anonymous visit matching");
  assert.ok(byId.get("TECH-05").supportedSceneIds.includes(SCENE));
  assert.ok(byId.get("TECH-04").supportedSceneIds.includes(SCENE));

  // Both are reused from scenes that already drill into them — TECH-05 from
  // Brand flow, the step immediately before this one — not duplicated for this
  // scene.
  assert.ok(byId.get("TECH-05").supportedSceneIds.includes("shopping-centre-brand-flow"));

  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 2);

  // TECH-05's own privacy principle is what carries the anonymity caveat into
  // the drilldown, so the scene never has to claim it.
  const principles = drilldown.capabilities.map((entry) => entry.capability.privacyPrinciple);
  assert.ok(
    principles.some((text) =>
      /Use only when the measurement design supports matching; never imply personal identification/.test(
        text,
      ),
    ),
  );
});

test("Time in centre proof resolves to an unapproved placeholder", () => {
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);

  assert.ok(proof);
  assert.equal(proof.hasExternalProof, false);
  assert.equal(proof.hasPlayableProof, false);
  assert.equal(proof.internalProofs[0].id, "CASE-SC-02");
  assert.equal(proof.internalProofs[0].status, "placeholder");
  assert.equal(proof.internalProofs[0].externalUseApproved, false);
  assert.deepEqual([...getSceneForSegment(SEGMENT, SCENE).proofAssetIds], ["CASE-SC-02"]);

  // It carries no customer name, so the presenter note is the only thing the
  // component may render from it.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /!presentationMode && !hasExternalProof/);
  assert.match(component, /No approved external proof yet/);
});

test("Time in centre offers no optional branch, because none is typed", () => {
  assert.deepEqual(getOptionalBranchesForScene(SEGMENT, SCENE), []);

  for (const scene of getScenesForSegment(SEGMENT)) {
    assert.ok(
      !(scene.branchFromSceneIds ?? []).includes(SCENE),
      `${scene.id} must not branch from ${SCENE}`,
    );
  }

  const source = readFileSync(COMPONENT_PATH, "utf8");
  assert.doesNotMatch(visibleCopy(source), /getOptionalBranchesForScene/);
  assert.doesNotMatch(source, /sc-time__branch/);
});

test("Time in centre adds no recap of the seven scenes behind it", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  const visible = flatten(visibleCopy(component));

  // The last Core step may read as a natural conclusion, but the spine stays
  // identical to the seven locked scenes: eyebrow, headline, truth line, hero,
  // three callouts, definition line, decision line + proof note, CTA, rail.
  // No summary band, no recap, no new structural element.
  for (const forbidden of [
    /\bso far\b/i,
    /\bin summary\b/i,
    /\bto recap\b/i,
    /\beverything above\b/i,
    /\bthe full picture\b/i,
    /\bputting it together\b/i,
    /\bthe story so far\b/i,
    /\bwe have (?:now )?seen\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} would be a recap this scene must not add`);
  }

  // Exactly three callouts, as in every scene in the segment.
  const clusters = [...component.matchAll(/^\s{4}id: "/gm)];
  assert.equal(clusters.length, 3, "three callouts, no more");

  // And the spine's own landmarks, each exactly once.
  for (const landmark of [
    'className="capture__eyebrow"',
    'className="capture__question"',
    'className="sc-time__truth-line"',
    'className="capture__hero sc-time__hero"',
    'className="sc-time__clusters"',
    'className="capture__definition"',
    'className="capture__decision"',
    'className="capture__cta"',
  ]) {
    const count = component.split(landmark).length - 1;
    assert.equal(count, 1, `${landmark} must appear exactly once`);
  }
});

test("Time in centre renders its own production hero, and it exists on disk", () => {
  assert.ok(existsSync(HERO_PATH));

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    component.includes(`src="${HERO_URL}"`),
    "the scene must render the location-visuals hero for this scene",
  );
  assert.ok(HERO_URL.includes("/location-visuals/shopping-centre/"));
  assert.ok(HERO_URL.endsWith("shopping-centre-time-in-centre-hero.png"));

  // The scene's typed visual asset is a placeholder shared with the other
  // Shopping Centre interior scenes — no approved-visual claim is made anywhere
  // by rendering this plate.
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.visualAssetId, "VIS-SC-02");
});

test("Time in centre renders neither rejected production plate", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  for (const url of REJECTED_HERO_URLS) {
    assert.ok(existsSync(repoFile(`public${url}`)));
    assert.ok(!component.includes(url), `${url} must not be rendered by this scene`);
  }
});

test("Time in centre takes no locked scene's hero, and none takes its own", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  for (const [path, heroUrl] of Object.entries(APPROVED_SCENE_HEROES)) {
    assert.ok(!component.includes(heroUrl), `${heroUrl} belongs to ${path} alone`);

    // And the reverse: no locked scene may be repointed at this scene's plate.
    const approved = readFileSync(repoFile(path), "utf8");
    assert.ok(approved.includes(`src="${heroUrl}"`), `${path} must keep its own hero`);
    assert.ok(!approved.includes(HERO_URL), `${path} must not render the time-in-centre plate`);
    assert.ok(existsSync(repoFile(`public${heroUrl}`)));
  }
});

test("Time in centre reaches no legacy locations/ asset and no other segment's asset", () => {
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

test("Time in centre owns its styles and patches no shared rule", () => {
  const css = readFileSync(repoFile("app/globals.css"), "utf8");

  // Every rule this scene added is namespaced under its own prefix, so no
  // locked scene can be altered by a change made for this one — and in
  // particular the shared SceneLensRail rules are left exactly as they are,
  // including the sub-1200px note hiding, which is a shared backlog item and
  // not this scene's to patch.
  assert.match(css, /\.sc-time__hero \{/);
  assert.match(css, /\.sc-time \.capture__intro::before \{/);
  assert.doesNotMatch(css, /\.sc-time[^{]*\.capture__lens/);
  assert.doesNotMatch(css, /\.sc-time[^{]*\.capture__method/);

  // The prefix collides with no locked scene's prefix, in either direction.
  for (const prefix of [
    ".catchment__",
    ".entrances__",
    ".sc-composition__",
    ".sc-circulation__",
    ".sc-exposure__",
    ".sc-brands__",
    ".sc-brandflow__",
  ]) {
    assert.ok(!prefix.startsWith(".sc-time"), `${prefix} must not collide with .sc-time`);
    assert.ok(!".sc-time__hero".startsWith(prefix), `${prefix} must not match .sc-time`);
  }

  // No zoom workaround anywhere in this scene's block; the crop is tuned with
  // object-position alone.
  const block = css.slice(css.indexOf("Shopping Centre · Time in centre"));
  assert.doesNotMatch(block, /transform:\s*scale\(/);
  assert.match(block, /object-position:/);
});

test("Building Time in centre does not make Shopping Centre navigable", () => {
  // The scene component exists; the segment's implementation status is what the
  // shell gates on, and it must stay architecture_only until the segment is
  // approved as a whole — completing the Core route changes nothing about that.
  assert.equal(getSegment(SEGMENT).implementationStatus, "architecture_only");

  // The dev-only preview harness must 404 in a production build, so it cannot
  // become a back door into an unapproved segment.
  const preview = readFileSync(PREVIEW_PATH, "utf8");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
});
