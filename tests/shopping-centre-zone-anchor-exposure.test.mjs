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
const SCENE = "shopping-centre-zone-anchor-exposure";

const repoFile = (relative) =>
  fileURLToPath(new URL(`../${relative}`, import.meta.url));

const COMPONENT_PATH = repoFile(
  "app/components/ShoppingCentreZoneAnchorExposureScene.tsx",
);
const PREVIEW_PATH = repoFile("app/preview/shopping-centre-zone-anchor-exposure/page.tsx");

/* The production hero. Per the asset-selection rule in AGENTS.md, a scene hero
   comes from `public/assets/location-visuals/<segment>/` — the curated
   production set — not from the legacy `public/assets/locations/` tree.

   A wide skylit atrium: three storefronts each drawn around with a soft purple
   rounded outline, and individual visitors standing on soft purple rings on the
   floor. Those two marks are the reason this plate and no other — the rings are
   the observed presence, the outlines are the configured anchors, and the scene
   has to keep those two source roles apart.

   Note on the filename: it reads `brand-journey`, which by name suggests Core
   step 7 (Brand flow). Its content is unmistakably this scene — outlined anchor
   units and presence rings, with no brand-to-brand movement anywhere in the
   frame — and it was supplied for this scene directly. Brand flow will need a
   plate of its own; this test exists so the mismatch is recorded rather than
   rediscovered. */
const HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-brand-journey-hero.png";
const HERO_PATH = repoFile(`public${HERO_URL}`);

/* The dwell plate in the same directory is deliberately NOT used. It is the same
   photograph Internal circulation renders — same room, same camera, same
   foreground figure, same sweeping route lines — so using it here would produce
   a second version of the circulation scene rather than a scene about place. */
const DWELL_HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-dwell-hero.png";

/* The four human-approved Shopping Centre plates. Each belongs to exactly one
   scene and this scene must render none of them. */
const APPROVED_SCENE_HEROES = {
  "app/components/ShoppingCentreCatchmentScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-geo-intelligence-hero.png",
  "app/components/ShoppingCentreEntrancesScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-visitors-hero.png",
  "app/components/ShoppingCentreVisitorCompositionScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-visitor-composition-hero.png",
  "app/components/ShoppingCentreInternalCirculationScene.tsx":
    "/assets/location-visuals/shopping-centre/shopping-centre-spatial-journey-hero.png",
};

/* What the scene actually puts on screen: component source with its explanatory
   comments removed.

   The comments in these components carry the reasoning behind a decision, and
   that reasoning legitimately names the very things the copy must avoid — "not
   POS, tenant turnover or transactions", "no area is called hot or cold".
   Scanning raw source would therefore fail on the sentences that document the
   boundary rather than on a breach of it, so every copy-boundary test below
   reads the stripped text. */
const visibleCopy = (source) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

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

// Data-binding tests for the fifth Shopping Centre Core scene, and the segment's
// clearest Physical + Business pairing. They assert what the component reads out
// of the runtime and the boundaries its copy must not cross — not how it lays
// anything out — so they fail if the typed content or a runtime resolution
// changes underneath the scene, and stay silent about visual decisions.

test("Zone & anchor exposure binds its headline, eyebrow and CTA from typed content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component uses `commercialQuestion` verbatim as the headline, derives
  // the eyebrow from `journeyStage`, and renders `supportingLine` as its
  // decision line; none of the three is invented in the component.
  assert.equal(
    scene.commercialQuestion,
    "Which areas receive attention, and where do visitors dwell?",
  );
  assert.equal(
    scene.supportingLine,
    "Support tenant conversations, leasing context, events and space planning",
  );
  assert.equal(scene.nextCta, "See brand visits");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  // The eyebrow is composed from the typed stage plus a fixed descriptor, and
  // the rail's left-hand stage label must never disagree with it.
  assert.match(component, /stageLabel\(scene\.journeyStage\)/);
  assert.match(component, /Zones/);
  assert.match(component, /\{scene\.commercialQuestion\}/);
  assert.match(component, /\{scene\.supportingLine\}/);
  assert.match(component, /\{scene\.nextCta\}/);

  // No shortened or reworded headline is written into the component; the typed
  // question is the only one on screen.
  assert.doesNotMatch(visibleCopy(component), /<h1[^>]*>(?!\{scene\.commercialQuestion\})/);
});

test("Zone & anchor exposure is an Understand step and the segment's second one", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.equal(scene.journeyStage, "understand");
  assert.equal(scene.priority, "core");
  assert.equal(scene.corePathOrder, 5);

  // Second Understand scene in the Core order, behind Internal circulation,
  // which is why the preview harness marks Understand as the current stage.
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);
  const understand = core.filter((entry) => entry.journeyStage === "understand");
  assert.equal(understand[0].id, "shopping-centre-internal-circulation");
  assert.equal(understand[1].id, SCENE);

  const preview = readFileSync(PREVIEW_PATH, "utf8");
  assert.match(preview, /stageId === "understand"/);
});

test("Zone & anchor exposure resolves only inside Shopping Centre; cross-segment lookup is rejected", () => {
  assert.equal(getSceneForSegment(SEGMENT, SCENE).segment, SEGMENT);

  // The same scene id must not be reachable through another segment. Retail
  // types its own zone scene under its own id, and the Shopping Centre story is
  // not a variant of it.
  for (const otherSegment of ["retail", "retail-park", "outlet-centre", "qsr"]) {
    assert.throws(
      () => getSceneForSegment(otherSegment, SCENE),
      `${SCENE} must not resolve inside ${otherSegment}`,
    );
  }

  // And Retail's own zone scene must not resolve inside Shopping Centre, even
  // though both drill into TECH-04.
  assert.throws(() => getSceneForSegment(SEGMENT, "retail-zone-engagement"));
});

test("Zone & anchor exposure is Core step 5 and hands over to Brand counting", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.nextSceneId, "shopping-centre-brand-counting");

  // The typed next scene must be the segment's next Core step by order, not an
  // arbitrary link: Internal circulation (4) -> Zone & anchor exposure (5) ->
  // the next Core step, which is the scene the CTA names.
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);

  const index = core.findIndex((entry) => entry.id === SCENE);
  assert.ok(index > 0);
  assert.equal(core[index - 1].id, "shopping-centre-internal-circulation");
  assert.equal(core[index - 1].nextSceneId, SCENE);
  assert.equal(core[index + 1].id, "shopping-centre-brand-counting");
  assert.equal(core[index + 1].id, scene.nextSceneId);

  // The next scene asks a different question — which named stores or brands are
  // actually visited — and this scene must not answer it. Presence in or around
  // a defined area is not a visit to a named tenant, and nothing here may claim
  // it is.
  const next = getSceneForSegment(SEGMENT, "shopping-centre-brand-counting");
  assert.equal(next.commercialQuestion, "Which stores or brands are actually visited?");
});

test("Zone & anchor exposure has no approved demo evidence and reports it honestly", () => {
  const runtime = getSceneEvidenceRuntime(SEGMENT, SCENE);

  // No Shopping Centre entries exist in the demo evidence catalog, so nothing
  // resolves to a value and the scene must show no exposure rate, reach share,
  // dwell figure or hot/cold ranking at all.
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

test("Zone & anchor exposure's three clusters each resolve a typed evidence description", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Exactly one entry of each type the component addresses, so the component's
  // `find` by type is unambiguous.
  for (const type of ["measured", "connected", "derived"]) {
    const matches = scene.evidence.filter((entry) => entry.type === type);
    assert.equal(matches.length, 1, `expected one ${type} evidence entry`);
    assert.ok(matches[0].description.length > 0);
  }

  // The three descriptions the component actually renders, pinned so the copy on
  // screen stays tied to the typed truth model.
  const byType = (type) => scene.evidence.find((entry) => entry.type === type).description;
  assert.match(byType("measured"), /provide the physical exposure signal/);
  assert.match(byType("connected"), /defines the areas being compared/);
  assert.match(byType("derived"), /require aligned zone events and mappings/);

  // The clusters read from typed content rather than restating it inline.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /evidence\?\.description \?\? ""/);
  assert.match(component, /\{cluster\.note\}/);

  // Measured, then connected, then derived — the source order IS the argument
  // in this scene, so it is pinned rather than left to rhythm.
  const order = [...component.matchAll(/evidenceType: "(measured|connected|derived)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(order, ["measured", "connected", "derived"]);
});

test("Exposure requires BOTH the zone events and the zone mapping", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Both inputs are required together — presence observations are not enough on
  // their own, and neither is a zone map. An exposure reading exists only where
  // the two are aligned. This is the equation the scene exists to land.
  assert.equal(scene.derivedDependencies.length, 1);
  const dependency = scene.derivedDependencies[0];
  assert.equal(dependency.id, SCENE);
  assert.deepEqual([...dependency.requiredInputIds], ["zone_events", "zone_mapping"]);
  assert.equal(dependency.output, "Exposure rate, reach, dwell and hot/cold areas");

  // No alternative input group: there is no second way to arrive at an exposure
  // reading here, unlike Time in centre which types two.
  assert.equal(dependency.alternativeInputGroups, undefined);

  const dependencies = getSceneDependencyAvailability(SEGMENT, SCENE);
  const exposure = dependencies.find((entry) => entry.dependencyId === SCENE);

  assert.ok(exposure);
  assert.equal(exposure.available, false);
  assert.deepEqual([...exposure.missingInputIds], ["zone_events", "zone_mapping"]);

  // And it stays unavailable when either single source role is switched off, in
  // both directions — presence without defined areas, and defined areas without
  // presence.
  for (const roles of [
    ["physical", "insight"],
    ["business", "insight"],
    ["mobile_geo", "insight"],
    ["insight"],
  ]) {
    const restricted = getSceneDependencyAvailability(SEGMENT, SCENE, roles).find(
      (entry) => entry.dependencyId === SCENE,
    );
    assert.equal(
      restricted.available,
      false,
      `exposure must not resolve from ${roles.join("+")}`,
    );
  }

  // The component names the missing inputs by their typed labels rather than by
  // id, so an unavailable state stays readable on screen.
  const labelById = new Map(evidenceInputs.map((input) => [input.id, input.label]));
  assert.equal(labelById.get("zone_events"), "Zone presence, entry and time events");
  assert.equal(labelById.get("zone_mapping"), "Zone, anchor or boundary mapping");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /exposure\.missingInputIds/);
  assert.match(component, /inputLabelById\.get\(inputId\)/);
});

test("Physical presence and Business zone mapping stay separate source roles", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));

  // The two halves of the derived reading come from two different layers and
  // must never be collapsed into one. Presence is measured on the floor; the
  // zone and anchor definitions are customer-supplied configuration.
  assert.equal(roleByInput.get("zone_events"), "physical");
  assert.equal(roleByInput.get("zone_mapping"), "business");

  const measured = scene.evidence.find((entry) => entry.type === "measured");
  const connected = scene.evidence.find((entry) => entry.type === "connected");
  assert.deepEqual([...measured.inputIds], ["zone_events"]);
  assert.deepEqual([...connected.inputIds], ["zone_mapping"]);

  // Business is REQUIRED here and it must not be switched off on the grounds
  // that no sales data exists. `zone_mapping` is what makes it required.
  assert.deepEqual([...scene.dataRequirements.required], ["physical", "business", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional], []);
});

test("The required Business layer is described as zone definitions, never as sales", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The rail's generic "Customer-connected context" would misdescribe what
  // Business does here, so the scene supplies its own note — and that note must
  // name anchor, tenant, event and zone definitions, not POS or turnover.
  assert.match(
    component,
    /business: "Anchor, tenant, event and zone definitions supplied by the centre"/,
  );

  const visible = visibleCopy(component);
  for (const forbidden of [
    /\bPOS\b/,
    /turnover/i,
    /tenant sales/i,
    /sales value/i,
    /\bsales\b/i,
    /\brevenue\b/i,
    /\btransactions?\b/i,
    /\bbasket\b/i,
    /\bconversions?\b/i,
    /\bcampaigns?\b/i,
    /\battribution\b/i,
    /\bspend\b/i,
    /\bpurchased\b/i,
    /\bpurchasing\b/i,
    /\bbought\b/i,
    /\bbuy(?:s|ing)?\b/i,
    /\bshopper spend\b/i,
    /\btill\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in this scene`);
  }

  // "Purchase" appears exactly once, and only to deny it — the same
  // single-denial pattern Internal circulation uses for "unique visitors". This
  // is not a sales-performance scene, and the noun most likely to be read into
  // an exposure story is the one the truth line rules out by name. A second
  // mention anywhere would be a claim rather than a boundary.
  const flat = flatten(visible);
  const mentions = [...flat.matchAll(/\bpurchases?\b/gi)];
  assert.equal(mentions.length, 1, "purchase may be mentioned only once, to deny it");
  assert.match(flat, /never as a look, a choice or a purchase/);
});

test("Zone & anchor exposure keeps Catchment's mobile_geo layer out of the rail", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Mobile & geo is neither required nor optional here. Aggregate area context
  // describes a population around the centre; it does not observe presence at a
  // defined area inside it, and the rail must say so rather than offer it as a
  // fallback.
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

  // All three roles it does declare carry a scene note, because all three are
  // required and the rail would otherwise report "Awaiting demo evidence".
  for (const role of ["physical", "business", "insight"]) {
    assert.match(visibleCopy(component), new RegExp(`${role}: "`));
  }
});

test("Exposure is never described as looking, choosing or being drawn in", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // The typed question says "attention". The scene has to answer it as observed
  // presence at a defined area and nothing more, so the boundary is stated in
  // the main copy — the lens rail's notes are hidden below 1200px by a shared
  // rule this scene does not own.
  assert.match(
    visible,
    /Attention is read here as observed presence in and around a defined area — never as a look, a choice or a purchase/,
  );

  // No gaze, intent or influence anywhere — in the typed content or on screen.
  // Presence in or near a configured area is the whole claim.
  for (const forbidden of [
    /\bgaze\b/i,
    /\blooked at\b/i,
    /\blooking at\b/i,
    /\bglance/i,
    /\bnotice[ds]?\b/i,
    /\bsaw\b/i,
    /\bviewed\b/i,
    /\bintent\b/i,
    /\bintention/i,
    /\bintended\b/i,
    /\battracted\b/i,
    /\battracts?\b/i,
    /\bdrawn to\b/i,
    /\binfluenced?\b/i,
    /\bengag(?:ed|ing|ement)\b/i,
    /\binterested\b/i,
    /\bpreferen/i,
    /\bwanted\b/i,
    /\bchose\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }

  // And presence near an area is never upgraded into a visit to it, which is
  // the next Core step's question, not this one's.
  for (const forbidden of [
    /presence (?:means|is) a visit/i,
    /\bvisited the (?:store|anchor|tenant|brand)\b/i,
    /\bentered the store\b/i,
    /\bwent into\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("The scene describes which areas are reached, never why", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // Observation, not evaluation. An area may be described as busier or quieter;
  // a reason, a verdict or a recommendation may not appear.
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
    /\bwasted\b/i,
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

test("The Zone & anchor exposure scene states no exposure, reach or dwell value", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The scene has no approved demo values, so no rate, share, percentage or
  // duration may be written into the component — including anything carried over
  // from the Retail Zone engagement reference board.
  //
  // Scanned over the rendered block alone, from `return (` onwards: that is
  // exactly what reaches the screen, and it keeps the blanket figure ban below
  // from tripping over ordinary implementation code above it.
  const rendered = component.slice(component.indexOf("return ("));
  const copy = visibleCopy(rendered)
    // Ignore SVG path geometry and viewBox numbers in the CTA arrow.
    .replace(/<svg[\s\S]*?<\/svg>/g, "");

  assert.doesNotMatch(copy, /\d+\s*%/, "no percentage may be stated");
  assert.doesNotMatch(copy, /\b\d+\s*(?:min|minutes?|sec|seconds?|hrs?|hours?)\b/i, "no duration may be stated");
  assert.doesNotMatch(copy, /\b\d{2,}\s*\/\s*\d{2,}\b/, "no split may be stated");
  assert.doesNotMatch(copy, /\b\d+\b/, "no bare figure may be stated");

  // And no share/rate vocabulary that would imply an unsupported value.
  for (const forbidden of [
    /\bexposure rate of\b/i,
    /\breach of\b/i,
    /\bshare of (?:visitors|traffic|footfall)\b/i,
    /\baverage dwell\b/i,
    /\bhottest\b/i,
    /\bcoldest\b/i,
    /\branked?\b/i,
    /\bx of y\b/i,
  ]) {
    assert.doesNotMatch(copy, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("Zone & anchor exposure is a scene about place, not a second circulation scene", () => {
  const visible = flatten(
    visibleCopy(readFileSync(COMPONENT_PATH, "utf8")).replace(/<svg[\s\S]*?<\/svg>/g, " "),
  );

  // Internal circulation owns routes, path splitting, directional movement,
  // escalators and floor-to-floor transitions. This scene owns destination,
  // place, presence and configured areas, and its copy must not restate the
  // previous step's subject.
  for (const forbidden of [
    /\broutes?\b/i,
    /\btrajector/i,
    /\bcorridors?\b/i,
    /\bescalator/i,
    /\bwayfinding\b/i,
    /\bfloor-to-floor\b/i,
    /\bbottleneck/i,
    /\bflow matrix\b/i,
    /\btransitions?\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} belongs to Internal circulation`);
  }

  // The concepts this scene does lead with, in the order of its own argument.
  assert.match(visible, /Where visitors are observed inside the centre/);
  assert.match(visible, /The defined areas and destinations being compared/);
  assert.match(visible, /Which areas are reached, and how long visitors stay/);

  // And the pairing itself, said once in the definition line, which renders at
  // every supported viewport.
  assert.match(
    visible,
    /observed movement becomes exposure only where the centre has defined the area it is read against/,
  );
});

test("A zone and an anchor are distinguished in the copy, not drawn on the plate", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  const visible = flatten(visibleCopy(component));

  // The distinction is carried by concise copy in the main column, because the
  // photograph can only half carry it and nothing may be drawn on top of it.
  assert.match(
    visible,
    /A zone is an area the centre configures; an anchor is a destination inside it/,
  );

  // Nothing is overlaid on the photograph: no label, legend, pin, marker,
  // number or heat field is rendered above the hero. The plate is a single
  // <img> inside the shared hero figure and nothing else.
  const hero = component.match(/<figure className="capture__hero[\s\S]*?<\/figure>/);
  assert.ok(hero, "the hero must stay a single shared figure");
  const heroChildren = [...hero[0].matchAll(/<([a-zA-Z]+)/g)].map((match) => match[1]);
  assert.deepEqual(heroChildren, ["figure", "img"]);

  // And the ban that keeps the visual honest: dwell is a typed word, a heatmap
  // is a picture of a value this scene does not have.
  assert.doesNotMatch(visible, /\bheat ?map\b/i);
  assert.doesNotMatch(component, /sc-exposure__(?:label|legend|pin|marker|heat|overlay)/);
});

test("Zone & anchor exposure names no sensor, vendor or camera technology", () => {
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

test("Zone & anchor exposure reuses TECH-04 and invents no new technology content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual([...scene.technologyCapabilityIds], ["TECH-04"]);

  const capabilities = getTechnologyCapabilitiesForScene(SCENE);
  assert.equal(capabilities.length, 1);
  assert.equal(capabilities[0].id, "TECH-04");
  assert.equal(capabilities[0].name, "Spatial movement intelligence");

  // The same capability Internal circulation and Retail's in-store journey drill
  // into — reused, not duplicated for this scene.
  assert.ok(capabilities[0].supportedSceneIds.includes("shopping-centre-internal-circulation"));
  assert.ok(capabilities[0].supportedSceneIds.includes(SCENE));

  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 1);
  assert.equal(drilldown.capabilities[0].capability.id, "TECH-04");

  // The capability's own privacy principle is what carries the anonymity and
  // no-intent caveat into the drilldown, so the scene never has to claim it.
  assert.match(
    drilldown.capabilities[0].capability.privacyPrinciple,
    /do not imply identity tracking or infer intent from movement alone/,
  );
});

test("Zone & anchor exposure proof resolves to an unapproved placeholder, never a live case", () => {
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);

  assert.ok(proof);
  assert.equal(proof.hasInternalProof, true);
  assert.equal(proof.hasExternalProof, false);
  assert.equal(proof.hasPlayableProof, false);
  assert.equal(proof.internalProofs[0].id, "CASE-SC-02");
  assert.equal(proof.internalProofs[0].status, "placeholder");
  assert.equal(proof.internalProofs[0].externalUseApproved, false);
});

test("Zone & anchor exposure offers no optional branch, because none is typed", () => {
  assert.deepEqual(getOptionalBranchesForScene(SEGMENT, SCENE), []);

  // Nothing in the segment declares this scene as a branch parent, so the
  // component renders no branch affordance.
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
  assert.doesNotMatch(source, /exposure__branch/);
});

test("Zone & anchor exposure renders its own production hero, and it exists on disk", () => {
  assert.ok(existsSync(HERO_PATH));

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    component.includes(`src="${HERO_URL}"`),
    "the scene must render the location-visuals hero for this scene",
  );
  assert.ok(HERO_URL.includes("/location-visuals/shopping-centre/"));

  // The plate's filename says `brand-journey`; the scene it serves is Zone &
  // anchor exposure. Recorded here on purpose: Brand flow (Core step 7) shares
  // the name but not the asset, and will need a plate of its own.
  assert.ok(HERO_URL.includes("brand-journey"));
  const brandFlow = getSceneForSegment(SEGMENT, "shopping-centre-brand-flow");
  assert.equal(brandFlow.corePathOrder, 7);
  assert.notEqual(brandFlow.visualAssetId, getSceneForSegment(SEGMENT, SCENE).visualAssetId);
});

test("Zone & anchor exposure does not reuse the plate Internal circulation already renders", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The dwell plate is the same photograph Internal circulation renders — same
  // room, same camera, same foreground figure, same sweeping route lines — so
  // rendering it here would produce a second circulation scene rather than a
  // scene about place.
  assert.ok(existsSync(repoFile(`public${DWELL_HERO_URL}`)));
  assert.ok(
    !component.includes(DWELL_HERO_URL),
    "the dwell plate duplicates the circulation photograph",
  );
});

test("Zone & anchor exposure takes no approved scene's hero, and none takes its own", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  for (const [path, heroUrl] of Object.entries(APPROVED_SCENE_HEROES)) {
    assert.ok(!component.includes(heroUrl), `${heroUrl} belongs to ${path} alone`);

    // And the reverse: no approved scene may be repointed at this scene's plate.
    const approved = readFileSync(repoFile(path), "utf8");
    assert.ok(approved.includes(`src="${heroUrl}"`), `${path} must keep its own hero`);
    assert.ok(!approved.includes(HERO_URL), `${path} must not render the exposure plate`);
    assert.ok(existsSync(repoFile(`public${heroUrl}`)));
  }
});

test("Zone & anchor exposure reaches no legacy locations/ asset and no other segment's asset", () => {
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

test("Zone & anchor exposure owns its styles and patches no shared rule", () => {
  const css = readFileSync(repoFile("app/globals.css"), "utf8");

  // Every rule this scene added is namespaced under its own prefix, so no
  // approved scene can be altered by a change made for this one — and in
  // particular the shared SceneLensRail rules are left exactly as they are.
  assert.match(css, /\.sc-exposure__hero \{/);
  assert.match(css, /\.sc-exposure \.capture__intro::before \{/);
  assert.doesNotMatch(css, /\.sc-exposure[^{]*\.capture__lens/);
  assert.doesNotMatch(css, /\.sc-exposure[^{]*\.capture__method/);

  // No zoom workaround anywhere in this scene's block; the crop is tuned with
  // object-position alone.
  const block = css.slice(css.indexOf("Shopping Centre · Zone & anchor exposure"));
  assert.doesNotMatch(block, /transform:\s*scale\(/);
  assert.match(block, /object-position:/);
});

test("Building Zone & anchor exposure does not make Shopping Centre navigable", () => {
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
