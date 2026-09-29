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
const SCENE = "shopping-centre-brand-counting";

const repoFile = (relative) =>
  fileURLToPath(new URL(`../${relative}`, import.meta.url));

const COMPONENT_PATH = repoFile("app/components/ShoppingCentreBrandCountingScene.tsx");
const PREVIEW_PATH = repoFile("app/preview/shopping-centre-brand-counting/page.tsx");

/* The production hero. Per the asset-selection rule in AGENTS.md, a scene hero
   comes from `public/assets/location-visuals/<segment>/` — the curated
   production set — not from the legacy `public/assets/locations/` tree.

   A warm gallery at storefront level: three adjacent tenant units filling the
   frame, and a bright purple line lying across the floor at each store
   entrance with individual shoppers crossing it on small purple rings. That
   line is the reason this plate and no other — it is a covered store boundary
   being crossed, which is exactly the event this scene counts, and it is a
   different object from the outlined areas and scattered rings of Zone &
   anchor exposure one step back. */
const HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-brand-counting-hero.png";
const HERO_PATH = repoFile(`public${HERO_URL}`);

/* Two plates in the same directory are deliberately NOT used.

   The dwell plate is the same photograph Internal circulation renders — same
   room, same camera, same sweeping route lines — so it is a rejected duplicate
   for any scene, this one included. The parking plate belongs to the segment's
   parking branch and has nothing to do with a shopfront. */
const REJECTED_HERO_URLS = [
  "/assets/location-visuals/shopping-centre/shopping-centre-dwell-hero.png",
  "/assets/location-visuals/shopping-centre/shopping-centre-parking-intelligence-hero.png",
];

/* The five human-approved Shopping Centre plates. Each belongs to exactly one
   scene and this scene must render none of them.

   Note the last entry: Zone & anchor exposure renders the plate whose FILENAME
   says `brand-journey`. That name is misleading and this scene is the one most
   likely to be mispointed at it, so it is pinned here explicitly. */
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
};

/* The fictional shopfront names visible in the plate. They exist so that
   "which unit" is legible without invoking a real tenant. They are set
   dressing, never data. */
const FICTIONAL_SHOPFRONT_NAMES = [/lumi[eè]re/i, /aurelia/i, /velluto/i];

/* What the scene actually puts on screen: component source with its explanatory
   comments removed.

   The comments in these components carry the reasoning behind a decision, and
   that reasoning legitimately names the very things the copy must avoid — "not
   POS, tenant turnover or transaction data", "no unit is called best or top".
   Scanning raw source would therefore fail on the sentences that document the
   boundary rather than on a breach of it, so every copy-boundary test below
   reads the stripped text. */
const visibleCopy = (source) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ")
    // JSX requires a bare apostrophe in text to be written as an entity — the
    // approved Entrances scene does the same — so the entity is folded back to
    // the character the reader actually sees. Comparing against the escaped
    // form would make every copy assertion below depend on a lint rule rather
    // than on the words on screen.
    .replace(/&rsquo;|&apos;|&#39;/g, "'");

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

// Data-binding tests for the sixth Shopping Centre Core scene — the first step
// that narrows from the centre to a single tenant. They assert what the
// component reads out of the runtime and the boundaries its copy must not
// cross — not how it lays anything out — so they fail if the typed content or a
// runtime resolution changes underneath the scene, and stay silent about visual
// decisions.

test("Brand counting binds its headline, eyebrow and CTA from typed content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component uses `commercialQuestion` verbatim as the headline, derives
  // the eyebrow from `journeyStage`, and renders `supportingLine` as its
  // decision line; none of the three is invented in the component.
  assert.equal(scene.commercialQuestion, "Which stores or brands are actually visited?");
  assert.equal(
    scene.supportingLine,
    "Understand tenant exposure and brand visitation without assuming tenant sales",
  );
  assert.equal(scene.nextCta, "Follow brand flow");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  // The eyebrow is composed from the typed stage plus a fixed descriptor, and
  // the rail's left-hand stage label must never disagree with it.
  assert.match(component, /stageLabel\(scene\.journeyStage\)/);
  assert.match(component, /Brands/);
  assert.match(component, /\{scene\.commercialQuestion\}/);
  assert.match(component, /\{scene\.supportingLine\}/);
  assert.match(component, /\{scene\.nextCta\}/);

  // No shortened or reworded headline is written into the component; the typed
  // question is the only one on screen.
  assert.doesNotMatch(visibleCopy(component), /<h1[^>]*>(?!\{scene\.commercialQuestion\})/);
});

test("Brand counting is an Understand step and the segment's third one", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.equal(scene.journeyStage, "understand");
  assert.equal(scene.priority, "core");
  assert.equal(scene.corePathOrder, 6);

  // Third Understand scene in the Core order, behind Internal circulation and
  // Zone & anchor exposure, which is why the preview harness marks Understand
  // as the current stage.
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);
  const understand = core.filter((entry) => entry.journeyStage === "understand");
  assert.equal(understand[0].id, "shopping-centre-internal-circulation");
  assert.equal(understand[1].id, "shopping-centre-zone-anchor-exposure");
  assert.equal(understand[2].id, SCENE);

  const preview = readFileSync(PREVIEW_PATH, "utf8");
  assert.match(preview, /stageId === "understand"/);
});

test("Brand counting resolves only inside Shopping Centre; cross-segment lookup is rejected", () => {
  assert.equal(getSceneForSegment(SEGMENT, SCENE).segment, SEGMENT);

  // The same scene id must not be reachable through another segment. Outlet
  // centre types its own brand-counting scene under its own id, and the
  // Shopping Centre story is not a variant of it.
  for (const otherSegment of ["retail", "retail-park", "outlet-centre", "qsr"]) {
    assert.throws(
      () => getSceneForSegment(otherSegment, SCENE),
      `${SCENE} must not resolve inside ${otherSegment}`,
    );
  }

  // And Outlet centre's own brand-counting scene must not resolve inside
  // Shopping Centre, even though both drill into TECH-02 and TECH-04.
  assert.throws(() => getSceneForSegment(SEGMENT, "outlet-centre-brand-counting"));
});

test("Brand counting is Core step 6 and hands over to Brand flow", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.nextSceneId, "shopping-centre-brand-flow");

  // The typed next scene must be the segment's next Core step by order, not an
  // arbitrary link: Zone & anchor exposure (5) -> Brand counting (6) -> the
  // next Core step, which is the scene the CTA names.
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);

  const index = core.findIndex((entry) => entry.id === SCENE);
  assert.ok(index > 0);
  assert.equal(core[index - 1].id, "shopping-centre-zone-anchor-exposure");
  assert.equal(core[index - 1].nextSceneId, SCENE);
  assert.equal(core[index + 1].id, "shopping-centre-brand-flow");
  assert.equal(core[index + 1].id, scene.nextSceneId);
  assert.equal(core[index + 1].corePathOrder, 7);

  // The next scene asks a different question — how visitors move from one brand
  // to another — and this scene must not answer it. Counting an entry at one
  // shopfront is not a sequence between two, and nothing here may claim it is.
  const next = getSceneForSegment(SEGMENT, "shopping-centre-brand-flow");
  assert.equal(next.commercialQuestion, "How do visitors move from one brand to another?");
});

test("Brand counting has no approved demo evidence and reports it honestly", () => {
  const runtime = getSceneEvidenceRuntime(SEGMENT, SCENE);

  // No Shopping Centre entries exist in the demo evidence catalog, so nothing
  // resolves to a value and the scene must show no visit count, visit share or
  // period figure at all.
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

test("Brand counting's three callouts each resolve a typed evidence description", () => {
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
  assert.match(byType("measured"), /counted only within covered boundaries/);
  assert.match(byType("connected"), /its identity as a covered brand area/);
  assert.match(byType("derived"), /do not establish tenant sales or conversion/);

  // The callouts read from typed content rather than restating it inline.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /evidence\?\.description \?\? ""/);
  assert.match(component, /\{cluster\.note\}/);

  // The event, then the identity it is given, then the limit of what the share
  // may be read as. The order is this scene's argument, so it is pinned rather
  // than left to rhythm.
  const order = [...component.matchAll(/evidenceType: "(measured|connected|derived)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(order, ["measured", "connected", "derived"]);
});

test("Brand visits require BOTH the brand events and the brand mapping", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Both inputs are required together — entry events are not enough on their
  // own, and neither is a tenant directory. A brand visit exists only where the
  // two are aligned.
  assert.equal(scene.derivedDependencies.length, 1);
  const dependency = scene.derivedDependencies[0];
  assert.equal(dependency.id, "shopping-centre-brand-visits");
  assert.deepEqual([...dependency.requiredInputIds], ["brand_events", "brand_mapping"]);
  assert.equal(dependency.output, "Brand visits and visit share");

  // No alternative input group: there is no second way to arrive at a brand
  // visit here, unlike Time in centre which types two.
  assert.equal(dependency.alternativeInputGroups, undefined);

  const dependencies = getSceneDependencyAvailability(SEGMENT, SCENE);
  const brandVisits = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-brand-visits",
  );

  assert.ok(brandVisits);
  assert.equal(brandVisits.available, false);
  assert.deepEqual([...brandVisits.missingInputIds], ["brand_events", "brand_mapping"]);

  // And it stays unavailable when either single source role is switched off, in
  // both directions — entries with no directory, and a directory with no
  // entries.
  for (const roles of [
    ["physical", "insight"],
    ["business", "insight"],
    ["mobile_geo", "insight"],
    ["insight"],
  ]) {
    const restricted = getSceneDependencyAvailability(SEGMENT, SCENE, roles).find(
      (entry) => entry.dependencyId === "shopping-centre-brand-visits",
    );
    assert.equal(
      restricted.available,
      false,
      `brand visits must not resolve from ${roles.join("+")}`,
    );
  }

  // The component names the missing inputs by their typed labels rather than by
  // id, so an unavailable state stays readable on screen.
  const labelById = new Map(evidenceInputs.map((input) => [input.id, input.label]));
  assert.equal(labelById.get("brand_events"), "Covered brand entrance or spatial events");
  assert.equal(labelById.get("brand_mapping"), "Tenant, brand and boundary mapping");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /brandVisits\.missingInputIds/);
  assert.match(component, /inputLabelById\.get\(inputId\)/);
});

test("Physical entry events and Business brand mapping stay separate source roles", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));

  // The two halves of the derived reading come from two different layers and
  // must never be collapsed into one. The entry is measured at the boundary;
  // the brand it belongs to is customer-supplied configuration.
  assert.equal(roleByInput.get("brand_events"), "physical");
  assert.equal(roleByInput.get("brand_mapping"), "business");

  const measured = scene.evidence.find((entry) => entry.type === "measured");
  const connected = scene.evidence.find((entry) => entry.type === "connected");
  assert.deepEqual([...measured.inputIds], ["brand_events"]);
  assert.deepEqual([...connected.inputIds], ["brand_mapping"]);

  // Business is REQUIRED here and it must not be switched off on the grounds
  // that no sales data exists. `brand_mapping` is what makes it required, and
  // this is the scene where that distinction matters most.
  assert.deepEqual([...scene.dataRequirements.required], ["physical", "business", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional], []);
});

test("The required Business layer is described as directories and boundaries, never as sales", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The rail's generic "Customer-connected context" would misdescribe what
  // Business does here, so the scene supplies its own note — and that note must
  // name tenant and brand directories and unit boundaries, not POS or turnover.
  assert.match(
    component,
    /business: "Tenant and brand directories and the unit boundaries they define"/,
  );

  // The scene's own written copy names none of the commercial-outcome
  // vocabulary. The words "tenant sales" and "conversion" DO reach the screen —
  // but only through the scene's typed `supportingLine` and typed `derived`
  // description, where both appear inside a denial, and the component renders
  // those by reference rather than restating them. Anything of this kind
  // written into the component itself would be a new claim, so none is allowed.
  const visible = visibleCopy(component);
  for (const forbidden of [
    /\bPOS\b/,
    /turnover/i,
    /\bsales\b/i,
    /\brevenue\b/i,
    /\bconversions?\b/i,
    /\btransactions?\b/i,
    /\bbasket\b/i,
    /\bspend\b/i,
    /\bpurchas/i,
    /\bbought\b/i,
    /\bbuy(?:s|ing)?\b/i,
    /\btill\b/i,
    /\breceipts?\b/i,
    /\bcampaigns?\b/i,
    /\battribution\b/i,
    /\bfootfall-to-sales\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("The no-tenant-sales boundary reaches the screen, and only ever as a denial", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The two typed strings that carry the boundary. Both render at every
  // supported viewport — the derived callout in the three-callout row, the
  // decision line beside the CTA — so the boundary survives at 1024x768, where
  // the lens rail's supporting notes are hidden by a shared rule.
  const derived = scene.evidence.find((entry) => entry.type === "derived").description;
  assert.equal(
    derived,
    "Brand visits, visit share and period patterns do not establish tenant sales or conversion.",
  );
  assert.match(scene.supportingLine, /without assuming tenant sales/);

  // Every mention of the commercial-outcome vocabulary anywhere in the scene's
  // typed copy is negated. A bare mention would be a claim.
  const typedCopy = typedCopyFor(scene);
  for (const match of typedCopy.matchAll(/[^|]*\b(?:tenant sales|conversion|turnover|revenue)\b[^|]*/gi)) {
    assert.match(
      match[0],
      /\bdo not establish\b|\bwithout assuming\b/i,
      `"${match[0].trim()}" must state the boundary, not a result`,
    );
  }

  // And no ranking or performance verdict is typed or written: visitation is
  // described, tenant performance is not.
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  for (const forbidden of [
    /\bbest performing\b/i,
    /\btop (?:store|brand|tenant|performer)/i,
    /\bperformance\b/i,
    /\bperforming\b/i,
    /\branked?\b/i,
    /\branking\b/i,
    /\bleaderboard\b/i,
    /\bwinners?\b/i,
    /\bsuccess(?:ful)?\b/i,
    /\bstrongest\b/i,
    /\bweakest\b/i,
    /\bbusiest\b/i,
    /\bunderperform/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }
});

test("The covered-boundary caveat survives into the main copy", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  const visible = flatten(visibleCopy(component));

  // Both coverage caveats are carried by the typed evidence, and both have to
  // survive at 1024x768, where the lens rail's supporting notes are hidden by a
  // shared rule this scene does not own. They are therefore stated in the
  // headline block: an entry is counted only where the boundary is covered, and
  // the brand on that entry comes from the centre's own directory.
  assert.match(
    visible,
    /A brand visit is an entry registered at a covered store boundary — counted only where a boundary is covered, which is not automatically every tenant\./,
  );
  assert.match(
    visible,
    /Each entry takes its brand identity from the centre's own tenant directory\./,
  );

  // And the consequence, said once in the definition line — which renders at
  // every supported viewport: an uncovered unit is absent from the reading, not
  // quiet in it. Without this a reader treats missing coverage as a low result.
  assert.match(
    visible,
    /an entry is registered when a covered store boundary is crossed, so a unit without a covered boundary is absent from the reading rather than quiet in it/,
  );

  // The word "covered" is the scene's load-bearing qualifier and it is never
  // dropped from the callout that names the entry event.
  assert.match(visible, /Entries counted at the threshold of a covered store/);
});

test("Brand counting keeps Catchment's mobile_geo layer out of the rail", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Mobile & geo is neither required nor optional here. Aggregate area context
  // describes a population around the centre; it does not register an entry at
  // one tenant's shopfront, and the rail must say so rather than offer it as a
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

  // No evidence entry anywhere in the scene may name a mobile_geo input, and no
  // derived dependency may resolve from it.
  assert.ok(!new Set(
    scene.evidence.flatMap((entry) => entry.inputIds ?? []).map((id) => roleByInput.get(id)),
  ).has("mobile_geo"));

  const geoOnly = getSceneDependencyAvailability(SEGMENT, SCENE, ["mobile_geo", "insight"]).find(
    (entry) => entry.dependencyId === "shopping-centre-brand-visits",
  );
  assert.equal(geoOnly.available, false);

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

test("A brand visit is never described as looking, choosing or being drawn in", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // The same gaze/intent/influence ban the approved scenes carry. An entry at a
  // covered boundary is the whole claim; nothing about noticing, wanting or
  // being attracted may be inferred from it.
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
    /\bloyal(?:ty)?\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }
});

test("Brand counting describes which units are entered, never why", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // Observation, not explanation. The scene may say a boundary was crossed; it
  // may not say why one unit is crossed more than another, and it may not
  // recommend anything.
  for (const forbidden of [
    /\bbecause\b/i,
    /\bcauses?\b/i,
    /\bcausing\b/i,
    /\bdue to\b/i,
    /\bdrives\b/i,
    /\bdriving\b/i,
    /\bleads? to\b/i,
    /\bresults? in\b/i,
    /\bexplains? why\b/i,
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

test("The Brand counting scene states no visit or share value", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The scene has no approved demo values, so no count, share, percentage or
  // index may be written into the component.
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

  // And no share/count vocabulary that would imply an unsupported value.
  for (const forbidden of [
    /\bvisit share of\b/i,
    /\bshare of (?:visitors|traffic|footfall|visits)\b/i,
    /\bout of every\b/i,
    /\bone in \w+\b/i,
    /\bx of y\b/i,
  ]) {
    assert.doesNotMatch(copy, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("The fictional shopfront names are never presented as tenants, and carry no figure", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  const visible = flatten(visibleCopy(component));

  // The plate carries three invented shopfront names so that "which unit" is
  // legible without invoking a real tenant. The component never repeats them:
  // no callout, no label and no alt-text phrase names one, so no figure can
  // ever sit beside one and no reader can take one for a customer.
  for (const name of FICTIONAL_SHOPFRONT_NAMES) {
    assert.doesNotMatch(visible, name, `${name} is set dressing and must not be written as copy`);
  }

  // The alt text says what those names are, so a reader who cannot see the
  // plate is not left to assume they are real.
  assert.match(visible, /fictional shopfront names/);

  // No claimed customer, logo or real-brand attribution anywhere.
  for (const forbidden of [
    /\breal (?:tenant|brand|store)/i,
    /\bour customer\b/i,
    /\bcustomer's\b/i,
    /\blogos?\b/i,
    /\bactual tenant\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("Brand counting owns the shopfront threshold, not the neighbouring scenes' subjects", () => {
  const visible = flatten(
    visibleCopy(readFileSync(COMPONENT_PATH, "utf8")).replace(/<svg[\s\S]*?<\/svg>/g, " "),
  );

  // Entrances owns the centre's own doors; Internal circulation owns routes,
  // escalators and floor-to-floor transitions; Zone & anchor exposure owns
  // configured zones, anchors and dwell. This scene owns the boundary of one
  // named unit, and its copy must not restate any of the three.
  for (const forbidden of [
    /\broutes?\b/i,
    /\btrajector/i,
    /\bcorridors?\b/i,
    /\bescalator/i,
    /\bwayfinding\b/i,
    /\bfloor-to-floor\b/i,
    /\btransitions?\b/i,
    /\bflow matrix\b/i,
    /\bdwell\b/i,
    /\bhot\/cold\b/i,
    /\banchors?\b/i,
    /\bzones?\b/i,
    /\bcentre entrance/i,
    /\bmain doors?\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} belongs to another Shopping Centre scene`);
  }

  // The concepts this scene does lead with, in the order of its own argument.
  assert.match(visible, /Entries counted at the threshold of a covered store/);
  assert.match(visible, /The tenant directory and boundaries behind each entry/);
  assert.match(visible, /What visit share describes, and what it stops short of/);
});

test("Nothing is drawn on top of the Brand counting photograph", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // No label, legend, pin, marker, number or badge is rendered above the hero.
  // The plate is a single <img> inside the shared hero figure and nothing else,
  // which is what makes it impossible to attach a value to a shopfront.
  const hero = component.match(/<figure className="capture__hero[\s\S]*?<\/figure>/);
  assert.ok(hero, "the hero must stay a single shared figure");
  const heroChildren = [...hero[0].matchAll(/<([a-zA-Z]+)/g)].map((match) => match[1]);
  assert.deepEqual(heroChildren, ["figure", "img"]);

  assert.doesNotMatch(
    component,
    /sc-brands__(?:label|legend|pin|marker|badge|heat|overlay|bar|chart)/,
  );
  assert.doesNotMatch(flatten(visibleCopy(component)), /\bheat ?map\b/i);
});

test("Brand counting names no sensor, vendor or camera technology", () => {
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

test("Brand counting reuses TECH-02 and TECH-04 and invents no new technology content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual([...scene.technologyCapabilityIds], ["TECH-02", "TECH-04"]);

  const capabilities = getTechnologyCapabilitiesForScene(SCENE);
  assert.deepEqual(
    capabilities.map((entry) => entry.id).sort(),
    ["TECH-02", "TECH-04"],
  );

  // Both are reused from scenes that already drill into them, not duplicated
  // for this one: TECH-02 is the entrance-measurement capability Entrances
  // uses, TECH-04 the spatial capability Internal circulation and Zone & anchor
  // exposure use.
  const byId = new Map(capabilities.map((entry) => [entry.id, entry]));
  assert.equal(byId.get("TECH-02").name, "Entrance measurement");
  assert.equal(byId.get("TECH-04").name, "Spatial movement intelligence");
  assert.ok(byId.get("TECH-02").supportedSceneIds.includes("shopping-centre-entrances"));
  assert.ok(byId.get("TECH-04").supportedSceneIds.includes("shopping-centre-zone-anchor-exposure"));
  assert.ok(byId.get("TECH-02").supportedSceneIds.includes(SCENE));
  assert.ok(byId.get("TECH-04").supportedSceneIds.includes(SCENE));

  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 2);

  // Each capability's own privacy principle is what carries the anonymity and
  // no-intent caveat into the drilldown, so the scene never has to claim it.
  const principles = drilldown.capabilities.map((entry) => entry.capability.privacyPrinciple);
  assert.ok(principles.some((text) => /Keep entries, visits and unique visitors distinct/.test(text)));
  assert.ok(principles.some((text) => /do not imply identity tracking or infer intent from movement alone/.test(text)));
});

test("Brand counting proof resolves to an unapproved placeholder, never a live case", () => {
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);

  assert.ok(proof);
  assert.equal(proof.hasInternalProof, true);
  assert.equal(proof.hasExternalProof, false);
  assert.equal(proof.hasPlayableProof, false);
  assert.equal(proof.internalProofs[0].id, "CASE-SC-03");
  assert.equal(proof.internalProofs[0].status, "placeholder");
  assert.equal(proof.internalProofs[0].externalUseApproved, false);

  // The placeholder is shared with Brand flow and carries no customer name, so
  // the presenter note is the only thing the component may render from it.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /!presentationMode && !hasExternalProof/);
  assert.match(component, /No approved external proof yet/);
});

test("Brand counting offers no optional branch, because none is typed", () => {
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
  assert.doesNotMatch(source, /brands__branch/);
});

test("Brand counting renders its own production hero, and it exists on disk", () => {
  assert.ok(existsSync(HERO_PATH));

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    component.includes(`src="${HERO_URL}"`),
    "the scene must render the location-visuals hero for this scene",
  );
  assert.ok(HERO_URL.includes("/location-visuals/shopping-centre/"));
  assert.ok(HERO_URL.includes("brand-counting"));

  // The scene's typed visual asset is its own, and is still a placeholder — no
  // approved-visual claim is made anywhere by rendering it.
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.visualAssetId, "VIS-SC-06");
});

test("Brand counting renders neither rejected plate", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The dwell plate duplicates the photograph Internal circulation renders; the
  // parking plate belongs to the segment's parking branch. Both exist in the
  // same directory, and neither may be reached from here.
  for (const url of REJECTED_HERO_URLS) {
    assert.ok(existsSync(repoFile(`public${url}`)));
    assert.ok(!component.includes(url), `${url} must not be rendered by this scene`);
  }
});

test("Brand counting takes no approved scene's hero, and none takes its own", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  for (const [path, heroUrl] of Object.entries(APPROVED_SCENE_HEROES)) {
    assert.ok(!component.includes(heroUrl), `${heroUrl} belongs to ${path} alone`);

    // And the reverse: no approved scene may be repointed at this scene's plate.
    const approved = readFileSync(repoFile(path), "utf8");
    assert.ok(approved.includes(`src="${heroUrl}"`), `${path} must keep its own hero`);
    assert.ok(!approved.includes(HERO_URL), `${path} must not render the brand-counting plate`);
    assert.ok(existsSync(repoFile(`public${heroUrl}`)));
  }
});

test("Brand counting reaches no legacy locations/ asset and no other segment's asset", () => {
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

test("Brand counting owns its styles and patches no shared rule", () => {
  const css = readFileSync(repoFile("app/globals.css"), "utf8");

  // Every rule this scene added is namespaced under its own prefix, so no
  // approved scene can be altered by a change made for this one — and in
  // particular the shared SceneLensRail rules are left exactly as they are,
  // including the sub-1200px note hiding, which is a shared backlog item and
  // not this scene's to patch.
  assert.match(css, /\.sc-brands__hero \{/);
  assert.match(css, /\.sc-brands \.capture__intro::before \{/);
  assert.doesNotMatch(css, /\.sc-brands[^{]*\.capture__lens/);
  assert.doesNotMatch(css, /\.sc-brands[^{]*\.capture__method/);

  // The prefix collides with no approved scene's prefix.
  for (const prefix of [
    ".catchment__",
    ".entrances__",
    ".sc-composition__",
    ".sc-circulation__",
    ".sc-exposure__",
  ]) {
    assert.ok(!prefix.startsWith(".sc-brands"), `${prefix} must not collide with .sc-brands`);
  }

  // No zoom workaround anywhere in this scene's block; the crop is tuned with
  // object-position alone.
  const block = css.slice(css.indexOf("Shopping Centre · Brand counting"));
  assert.doesNotMatch(block, /transform:\s*scale\(/);
  assert.match(block, /object-position:/);
});

test("Building Brand counting does not make Shopping Centre navigable", () => {
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
