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
const SCENE = "shopping-centre-brand-flow";

const repoFile = (relative) =>
  fileURLToPath(new URL(`../${relative}`, import.meta.url));

const COMPONENT_PATH = repoFile("app/components/ShoppingCentreBrandFlowScene.tsx");
const PREVIEW_PATH = repoFile("app/preview/shopping-centre-brand-flow/page.tsx");
const BRAND_COUNTING_PATH = repoFile("app/components/ShoppingCentreBrandCountingScene.tsx");

/* The production hero. Per the asset-selection rule in AGENTS.md, a scene hero
   comes from `public/assets/location-visuals/<segment>/` — the curated
   production set — not from the legacy `public/assets/locations/` tree.

   A warm premium gallery at storefront level: a pink-lit beauty unit on the
   left, a chandelier-lit flagship in the centre, a dark-marble accessories unit
   on the right — and, decisively, dotted purple lines carrying directional
   marks that curve across the polished floor FROM one shopfront TO another,
   with a shopper on a presence ring at each end. That point-to-point link is
   the reason this plate and no other: it is a pair of tenants in order, which
   is a different object from Brand counting's line lying in a single doorway,
   from Zone & anchor exposure's outlined units, and from Internal circulation's
   floor-wide route network.

   Note the filename. Every other Shopping Centre production hero is named
   `shopping-centre-*`; this one, as supplied by the human, is
   `shopping-centre-visitor-brand-flow-hero.png`. Supplied assets are used as
   given in this project, so the inconsistency is pinned here rather than
   renamed away. */
const HERO_URL =
  "/assets/location-visuals/shopping-centre/shopping-centre-visitor-brand-flow-hero.png";
const HERO_PATH = repoFile(`public${HERO_URL}`);

/* The legacy plate with the confusingly similar name. It is a different file
   entirely — an abstract white cutaway floorplan with route lines — and it was
   assessed and rejected: it breaks the photographic family the six approved
   scenes share, and it is exactly the "generic floorplan with route lines"
   this scene must avoid. It lives under the legacy `locations/` tree, which a
   production scene may not reach into at all. */
const LEGACY_BRAND_FLOW_URL =
  "/assets/locations/shopping-centre/shopping-mall-visitor-brand-flow.png";

/* Two more plates in the production directory that are deliberately NOT used.
   The dwell plate is the same photograph Internal circulation renders, so it is
   a rejected duplicate for any scene; the parking plate belongs to the
   segment's parking branch. */
const REJECTED_HERO_URLS = [
  "/assets/location-visuals/shopping-centre/shopping-centre-dwell-hero.png",
  "/assets/location-visuals/shopping-centre/shopping-centre-parking-intelligence-hero.png",
];

/* The six human-approved Shopping Centre plates. Each belongs to exactly one
   scene and this scene must render none of them.

   Two are pinned with particular care. Zone & anchor exposure renders the plate
   whose FILENAME says `brand-journey` — a name this scene is the single most
   likely to be mispointed at. And Brand counting, the step immediately before
   this one, is also a warm storefront-level gallery, so its plate is the other
   easy mistake. */
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
};

/* What the scene actually puts on screen: component source with its explanatory
   comments removed.

   The comments in these components carry the reasoning behind a decision, and
   that reasoning legitimately names the very things the copy must avoid — "not
   POS, tenant turnover or transaction data", "never implies that a person is
   recognised". Scanning raw source would therefore fail on the sentences that
   document the boundary rather than on a breach of it, so every copy-boundary
   test below reads the stripped text. */
const visibleCopy = (source) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ")
    // JSX requires a bare apostrophe in text to be written as an entity, so the
    // entity is folded back to the character the reader actually sees.
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

// Data-binding tests for the seventh Shopping Centre Core scene — the first
// step in the segment that rests on anonymous visit matching, and therefore the
// one carrying the heaviest truth burden. They assert what the component reads
// out of the runtime and the boundaries its copy must not cross — not how it
// lays anything out — so they fail if the typed content or a runtime resolution
// changes underneath the scene, and stay silent about visual decisions.

test("Brand flow binds its headline, eyebrow and CTA from typed content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // The component uses `commercialQuestion` verbatim as the headline, derives
  // the eyebrow stage from `journeyStage`, and renders `supportingLine` as its
  // decision line; none of the three is invented in the component.
  assert.equal(scene.commercialQuestion, "How do visitors move from one brand to another?");
  assert.equal(
    scene.supportingLine,
    "Inform adjacency, wayfinding, leasing context and tenant conversations",
  );
  assert.equal(scene.nextCta, "Understand time in centre");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /stageLabel\(scene\.journeyStage\)/);
  assert.match(component, /\{scene\.commercialQuestion\}/);
  assert.match(component, /\{scene\.supportingLine\}/);
  assert.match(component, /\{scene\.nextCta\}/);

  // No shortened or reworded headline is written into the component; the typed
  // question is the only one on screen.
  assert.doesNotMatch(visibleCopy(component), /<h1[^>]*>(?!\{scene\.commercialQuestion\})/);
});

test("The eyebrow names the relation, not the tenants Brand counting already named", () => {
  const component = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const brandCounting = flatten(visibleCopy(readFileSync(BRAND_COUNTING_PATH, "utf8")));

  // Brand counting, the Core step immediately before this one, is also an
  // Understand step and also about tenants. It renders "Understand · Brands".
  // Reusing that descriptor here would give two consecutive scenes an identical
  // eyebrow, so this scene names the relation between two units instead.
  assert.match(brandCounting, /\{stageLabel\(scene\.journeyStage\)\} <span aria-hidden="true">·<\/span> Brands/);
  assert.match(component, /\{stageLabel\(scene\.journeyStage\)\} <span aria-hidden="true">·<\/span> Between brands/);

  // The descriptor is genuinely different, and it is not simply "Brands" again.
  const descriptor = component.match(/<\/span> ([A-Z][A-Za-z ]*?)\s*<\/p>/);
  assert.ok(descriptor, "the eyebrow must carry a secondary descriptor");
  assert.equal(descriptor[1], "Between brands");
  assert.notEqual(descriptor[1], "Brands");

  // And it must not borrow any other Shopping Centre scene's descriptor either.
  for (const taken of ["Outside", "Entrance", "Composition", "Circulation", "Zones", "Brands"]) {
    assert.notEqual(descriptor[1], taken, `${taken} belongs to another scene's eyebrow`);
  }
});

test("Brand flow is an Understand step and the segment's fourth one", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  assert.equal(scene.journeyStage, "understand");
  assert.equal(scene.priority, "core");
  assert.equal(scene.corePathOrder, 7);

  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);
  const understand = core.filter((entry) => entry.journeyStage === "understand");
  assert.equal(understand[0].id, "shopping-centre-internal-circulation");
  assert.equal(understand[1].id, "shopping-centre-zone-anchor-exposure");
  assert.equal(understand[2].id, "shopping-centre-brand-counting");
  assert.equal(understand[3].id, SCENE);

  const preview = readFileSync(PREVIEW_PATH, "utf8");
  assert.match(preview, /stageId === "understand"/);
});

test("Brand flow resolves only inside Shopping Centre; cross-segment lookup is rejected", () => {
  assert.equal(getSceneForSegment(SEGMENT, SCENE).segment, SEGMENT);

  // The same scene id must not be reachable through another segment. Outlet
  // centre types its own brand-flow scene under its own id, and the Shopping
  // Centre story is not a variant of it.
  for (const otherSegment of ["retail", "retail-park", "outlet-centre", "qsr"]) {
    assert.throws(
      () => getSceneForSegment(otherSegment, SCENE),
      `${SCENE} must not resolve inside ${otherSegment}`,
    );
  }

  assert.throws(() => getSceneForSegment(SEGMENT, "outlet-centre-brand-flow"));
  assert.throws(() => getSceneForSegment(SEGMENT, "retail-park-cross-visitation"));
});

test("Brand flow is Core step 7 and hands over to Time in centre", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.nextSceneId, "shopping-centre-time-in-centre");

  // The typed next scene must be the segment's next Core step by order, not an
  // arbitrary link: Brand counting (6) -> Brand flow (7) -> the next Core step,
  // which is the scene the CTA names.
  const core = getScenesForSegment(SEGMENT)
    .filter((entry) => entry.priority === "core")
    .sort((a, b) => a.corePathOrder - b.corePathOrder);

  const index = core.findIndex((entry) => entry.id === SCENE);
  assert.ok(index > 0);
  assert.equal(core[index - 1].id, "shopping-centre-brand-counting");
  assert.equal(core[index - 1].nextSceneId, SCENE);
  assert.equal(core[index + 1].id, "shopping-centre-time-in-centre");
  assert.equal(core[index + 1].id, scene.nextSceneId);
  assert.equal(core[index + 1].corePathOrder, 8);

  // The next scene asks a different question — how long visitors stay — and
  // this scene must not answer it. An order of visits is not a duration.
  const next = getSceneForSegment(SEGMENT, "shopping-centre-time-in-centre");
  assert.equal(next.commercialQuestion, "How long do visitors stay in the asset?");
});

test("Brand flow has no approved demo evidence and reports it honestly", () => {
  const runtime = getSceneEvidenceRuntime(SEGMENT, SCENE);

  // No Shopping Centre entries exist in the demo evidence catalog, so nothing
  // resolves to a value and the scene must show no sequence count,
  // cross-visitation share or period figure at all.
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

test("Brand flow's three callouts each resolve a typed evidence description", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Exactly one entry of each type the component addresses, so the component's
  // `find` by type is unambiguous.
  for (const type of ["measured", "connected", "derived"]) {
    const matches = scene.evidence.filter((entry) => entry.type === type);
    assert.equal(matches.length, 1, `expected one ${type} evidence entry`);
    assert.ok(matches[0].description.length > 0);
  }

  // The three descriptions the component actually renders, pinned so the copy
  // on screen stays tied to the typed truth model.
  const byType = (type) => scene.evidence.find((entry) => entry.type === type).description;
  assert.match(byType("measured"), /Anonymous matched visits or transitions/);
  assert.match(byType("measured"), /only between covered brands or zones/);
  assert.match(byType("connected"), /Tenant\/brand maps and category definitions/);
  assert.match(byType("derived"), /require supported matching and mapping/);

  // The callouts read from typed content rather than restating it inline.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /evidence\?\.description \?\? ""/);
  assert.match(component, /\{cluster\.note\}/);

  // The matched sequence, then the maps that name each of its ends, then the
  // limit of what the order may be read as. The order is this scene's argument,
  // so it is pinned rather than left to rhythm.
  const order = [...component.matchAll(/evidenceType: "(measured|connected|derived)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(order, ["measured", "connected", "derived"]);
});

test("Brand flow sequences require BOTH the matched events and the brand mapping", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Both inputs are required together — matched events are not enough on their
  // own, and neither is a tenant directory. A sequence between two named brands
  // exists only where the two are aligned.
  assert.equal(scene.derivedDependencies.length, 1);
  const dependency = scene.derivedDependencies[0];
  assert.equal(dependency.id, "shopping-centre-brand-flow-sequences");
  assert.deepEqual([...dependency.requiredInputIds], ["matched_brand_events", "brand_mapping"]);
  assert.equal(dependency.output, "Brand cross-visitation and common sequences");

  // No alternative input group: there is no second way to arrive at a sequence
  // here, unlike Time in centre which types two.
  assert.equal(dependency.alternativeInputGroups, undefined);

  const dependencies = getSceneDependencyAvailability(SEGMENT, SCENE);
  const sequences = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-brand-flow-sequences",
  );

  assert.ok(sequences);
  assert.equal(sequences.available, false);
  assert.deepEqual([...sequences.missingInputIds], ["matched_brand_events", "brand_mapping"]);

  // And it stays unavailable when either single source role is switched off, in
  // both directions — matched events with no maps, and maps with no events.
  for (const roles of [
    ["physical", "insight"],
    ["business", "insight"],
    ["mobile_geo", "insight"],
    ["insight"],
  ]) {
    const restricted = getSceneDependencyAvailability(SEGMENT, SCENE, roles).find(
      (entry) => entry.dependencyId === "shopping-centre-brand-flow-sequences",
    );
    assert.equal(
      restricted.available,
      false,
      `brand flow sequences must not resolve from ${roles.join("+")}`,
    );
  }

  // The component names the missing inputs by their typed labels rather than by
  // id, so an unavailable state stays readable on screen.
  const labelById = new Map(evidenceInputs.map((input) => [input.id, input.label]));
  assert.equal(
    labelById.get("matched_brand_events"),
    "Supported matched brand visits or transitions",
  );
  assert.equal(labelById.get("brand_mapping"), "Tenant, brand and boundary mapping");

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /sequences\.missingInputIds/);
  assert.match(component, /inputLabelById\.get\(inputId\)/);
});

test("Physical matched events and Business brand mapping stay separate source roles", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const roleByInput = new Map(evidenceInputs.map((input) => [input.id, input.dataRole]));

  // The two halves of the derived reading come from two different layers and
  // must never be collapsed into one. The sequence is measured; the brands at
  // either end of it are customer-supplied configuration.
  assert.equal(roleByInput.get("matched_brand_events"), "physical");
  assert.equal(roleByInput.get("brand_mapping"), "business");

  const measured = scene.evidence.find((entry) => entry.type === "measured");
  const connected = scene.evidence.find((entry) => entry.type === "connected");
  assert.deepEqual([...measured.inputIds], ["matched_brand_events"]);
  assert.deepEqual([...connected.inputIds], ["brand_mapping"]);

  // Business is REQUIRED here and it must not be switched off on the grounds
  // that no sales data exists. `brand_mapping` is what makes it required, and
  // it keeps exactly the business role and label Brand counting relies on.
  assert.deepEqual([...scene.dataRequirements.required], ["physical", "business", "insight"]);
  assert.deepEqual([...scene.dataRequirements.optional], []);

  const brandCounting = getSceneForSegment(SEGMENT, "shopping-centre-brand-counting");
  const sharedMapping = brandCounting.evidence
    .flatMap((entry) => entry.inputIds ?? [])
    .includes("brand_mapping");
  assert.ok(sharedMapping, "brand_mapping is shared with Brand counting, not redefined here");
});

test("The required Business layer is described as maps and categories, never as sales", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The rail's generic "Customer-connected context" would misdescribe what
  // Business does here, so the scene supplies its own note — and that note must
  // name tenant and brand maps and category definitions, not POS or turnover.
  assert.match(
    component,
    /business: "Tenant and brand maps and the category definitions they carry"/,
  );

  // The scene's own written copy names none of the commercial-outcome
  // vocabulary. Unlike Brand counting, no typed string on this scene even
  // mentions sales or conversion, so nothing of the kind may reach the screen
  // at all — a bare mention here would be a new claim.
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

test("No tenant is ranked, and no pair is recommended", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // The typed decision line supports adjacency and leasing CONVERSATIONS. The
  // scene therefore informs a discussion; it does not recommend a co-location,
  // rank a tenant or claim an adjacency would work.
  assert.match(scene.supportingLine, /leasing context and tenant conversations/);

  for (const forbidden of [
    /\bbest performing\b/i,
    /\btop (?:store|brand|tenant|pair|performer)/i,
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
    /\bco-?locate/i,
    /\brelocat/i,
    /\bwe recommend\b/i,
    /\brecommend(?:s|ed|ation)?\b/i,
    /\boptimi[sz]/i,
    /\bcomplementary\b/i,
    /\bwell matched\b/i,
    /\bgood fit\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }
});

test("Matching is anonymous, and nothing in the scene implies a recognised person", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // This is the first scene in the segment to depend on TECH-05, and matched
  // journeys are the most over-claimable thing in the product. The typed
  // measured entry says "anonymous matched visits" and that is the ceiling:
  // nothing may imply identity, recognition, re-identification, a personal
  // profile, device tracking, or an individual being followed between units.
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
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }

  // And the word that does the work is present, in the main copy and in the
  // Physical lens note, not only inside the typed callout.
  assert.match(visible, /A sequence here is an anonymous matched visit between two covered brands/);
  assert.match(visible, /physical: "Anonymous matched visits observed between covered brands"/);
});

test("Cross-visitation is never described as affinity, preference or influence", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // Sequence is an observation of order, not a relationship of cause. Nothing
  // may say or imply that visiting one brand causes, drives, leads to or
  // predicts visiting another, and nothing may claim attraction, loyalty,
  // intent or draw.
  for (const forbidden of [
    /\baffinit/i,
    /\bpreferen/i,
    /\bprefers?\b/i,
    /\bloyal(?:ty)?\b/i,
    /\battracted\b/i,
    /\battracts?\b/i,
    /\battraction\b/i,
    /\bdrawn to\b/i,
    /\bdraws?\b/i,
    /\binfluenced?\b/i,
    /\binfluences\b/i,
    /\bintent\b/i,
    /\bintention/i,
    /\bintended\b/i,
    /\bpredicts?\b/i,
    /\bpredict(?:ed|ion|ive)\b/i,
    /\blikelihood\b/i,
    /\bpropensity\b/i,
    /\bengag(?:ed|ing|ement)\b/i,
    /\binterested\b/i,
    /\bwanted\b/i,
    /\bchose\b/i,
    /\bgaze\b/i,
    /\blooked at\b/i,
    /\bnotice[ds]?\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }
});

test("Brand flow describes what order was observed, never why", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const visible = flatten(visibleCopy(readFileSync(COMPONENT_PATH, "utf8")));
  const typedCopy = typedCopyFor(scene);

  // Observation, not explanation. The scene may say which brand was visited
  // after which; it may not say why, and it may not turn the order into a
  // causal or directional claim about one brand acting on another.
  for (const forbidden of [
    /\bbecause\b/i,
    /\bcauses?\b/i,
    /\bcausing\b/i,
    /\bcausal\b/i,
    /\bdue to\b/i,
    /\bdrives\b/i,
    /\bdriving\b/i,
    /\bleads? to\b/i,
    /\bresults? in\b/i,
    /\bexplains? why\b/i,
    /\bsends?\b/i,
    /\bfeeds?\b/i,
    /\bpulls?\b/i,
    /\bpush(?:es)?\b/i,
    /\bavoid(?:s|ed|ing)?\b/i,
    /\bpoorly\b/i,
    /\bineffic/i,
    /\bsuboptimal\b/i,
    /\bshould\b/i,
  ]) {
    assert.doesNotMatch(typedCopy, forbidden, `${forbidden} must not appear in typed content`);
    assert.doesNotMatch(visible, forbidden, `${forbidden} must not appear in the component`);
  }
});

test("The covered-brands caveat survives into the main copy", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");
  const visible = flatten(visibleCopy(component));

  // The coverage boundary is carried by the typed measured entry, and it has to
  // survive at 1024x768, where the lens rail's supporting notes are hidden by a
  // shared rule this scene does not own. It is therefore stated in the headline
  // block: matching holds only between covered brands, which is not
  // automatically every tenant.
  assert.match(
    visible,
    /Matching works only where both brands are covered, which is not automatically every tenant in the centre\./,
  );

  // And the consequence, said once in the definition line — which renders at
  // every supported viewport. This is the specific thing a reader gets wrong
  // here: an uncovered end does not produce a small sequence, it produces none,
  // so a blank pair is not evidence that nobody moved between them.
  assert.match(
    visible,
    /a sequence forms only between two covered brands, so a pair with one uncovered end is absent from the reading rather than evidence that nobody moved between them/,
  );

  // The word "covered" is the scene's load-bearing qualifier and it is never
  // dropped from the callout that names the matched sequence.
  assert.match(visible, /Anonymous matched visits between two covered brands/);
});

test("Brand flow keeps Catchment's mobile_geo layer out of the rail", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);

  // Mobile & geo is neither required nor optional here. Aggregate area context
  // describes a population around the centre; it does not match one covered
  // brand to another inside it, and the rail must say so rather than offer it
  // as a fallback.
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
    (entry) => entry.dependencyId === "shopping-centre-brand-flow-sequences",
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

test("The Brand flow scene states no sequence, share or cross-visitation value", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The scene has no approved demo values, so no count, share, percentage or
  // index may be written into the component — and, decisively, no figure may be
  // attached to a pair of tenants.
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
    /\bcross-visitation rate\b/i,
    /\bshare of (?:visitors|traffic|footfall|visits)\b/i,
    /\bout of every\b/i,
    /\bone in \w+\b/i,
    /\bmost common sequence\b/i,
    /\btop pair\b/i,
    /\bx of y\b/i,
  ]) {
    assert.doesNotMatch(copy, forbidden, `${forbidden} must not appear in this scene`);
  }
});

test("Brand flow owns the link between two tenants, not the neighbouring scenes' subjects", () => {
  const visible = flatten(
    visibleCopy(readFileSync(COMPONENT_PATH, "utf8")).replace(/<svg[\s\S]*?<\/svg>/g, " "),
  );

  // Brand counting owns the shopfront threshold and the discrete entry event;
  // Zone & anchor exposure owns outlined units, anchors and dwell; Internal
  // circulation owns floor-wide routes, corridors, escalators and transitions.
  // This scene owns the link between two specific tenants — order and sequence —
  // and its own written copy must not restate any of the three.
  //
  // Note the scope: this reads the component's own words. "wayfinding" DOES
  // legitimately reach the screen, but only through the scene's typed
  // `supportingLine`, which the component renders by reference. Written into
  // the component it would be a route mechanic this scene does not own.
  for (const forbidden of [
    /\bthresholds?\b/i,
    /\bzones?\b/i,
    /\banchors?\b/i,
    /\bdwell\b/i,
    /\bcorridors?\b/i,
    /\bescalator/i,
    /\bwayfinding\b/i,
    /\broutes?\b/i,
    /\btrajector/i,
    /\bfloor-to-floor\b/i,
    /\btransitions?\b/i,
    /\bflow matrix\b/i,
    /\bhot\/cold\b/i,
    /\bcentre entrance/i,
    /\bmain doors?\b/i,
  ]) {
    assert.doesNotMatch(visible, forbidden, `${forbidden} belongs to another Shopping Centre scene`);
  }

  // The concepts this scene does lead with, in the order of its own argument.
  assert.match(visible, /Anonymous matched visits between two covered brands/);
  assert.match(visible, /The tenant, brand and category maps behind each sequence/);
  assert.match(visible, /What an order of visits establishes, and what it does not/);
});

test("Nothing is drawn on top of the Brand flow photograph", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // No label, legend, pin, arrow, number or badge is rendered above the hero.
  // The plate is a single <img> inside the shared hero figure and nothing else,
  // which is what makes it impossible to attach a value to a pair of tenants.
  const hero = component.match(/<figure className="capture__hero[\s\S]*?<\/figure>/);
  assert.ok(hero, "the hero must stay a single shared figure");
  const heroChildren = [...hero[0].matchAll(/<([a-zA-Z]+)/g)].map((match) => match[1]);
  assert.deepEqual(heroChildren, ["figure", "img"]);

  assert.doesNotMatch(
    component,
    /sc-brandflow__(?:label|legend|pin|marker|badge|arrow|heat|overlay|bar|chart|matrix|chord)/,
  );
  assert.doesNotMatch(flatten(visibleCopy(component)), /\bheat ?map\b/i);
  assert.doesNotMatch(flatten(visibleCopy(component)), /\bchord diagram\b/i);
});

test("Brand flow names no sensor, vendor or camera technology", () => {
  const visible = visibleCopy(readFileSync(COMPONENT_PATH, "utf8"));

  // Technology stays behind the rail's "How we measure this" drilldown, which is
  // rendered by the shared SceneLensRail from typed content — never written into
  // the scene itself. This matters more here than anywhere: naming a matching
  // technology in the copy would invite exactly the identity reading the scene
  // exists to refuse.
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

test("Brand flow reuses TECH-05 and TECH-04 and invents no new technology content", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.deepEqual([...scene.technologyCapabilityIds], ["TECH-05", "TECH-04"]);

  const capabilities = getTechnologyCapabilitiesForScene(SCENE);
  assert.deepEqual(
    capabilities.map((entry) => entry.id).sort(),
    ["TECH-04", "TECH-05"],
  );

  // Both are reused from scenes that already drill into them, not duplicated
  // for this one: TECH-04 is the spatial capability Internal circulation, Zone
  // & anchor exposure and Brand counting use; TECH-05 is the anonymous
  // visit-matching capability, which this is the segment's first Core scene to
  // depend on.
  const byId = new Map(capabilities.map((entry) => [entry.id, entry]));
  assert.equal(byId.get("TECH-04").name, "Spatial movement intelligence");
  assert.equal(byId.get("TECH-05").name, "Anonymous visit matching");
  assert.ok(byId.get("TECH-04").supportedSceneIds.includes("shopping-centre-brand-counting"));
  assert.ok(byId.get("TECH-04").supportedSceneIds.includes(SCENE));
  assert.ok(byId.get("TECH-05").supportedSceneIds.includes(SCENE));

  const drilldown = getTechnologyDrilldownForScene(SEGMENT, SCENE);
  assert.ok(drilldown);
  assert.equal(drilldown.capabilities.length, 2);

  // Each capability's own privacy principle is what carries the anonymity
  // caveat into the drilldown, so the scene never has to claim it — and
  // TECH-05's is the one that names the matching boundary explicitly.
  const principles = drilldown.capabilities.map((entry) => entry.capability.privacyPrinciple);
  assert.ok(principles.some((text) =>
    /Use only when the measurement design supports matching; never imply personal identification/.test(text),
  ));
  assert.ok(principles.some((text) =>
    /do not imply identity tracking or infer intent from movement alone/.test(text),
  ));
});

test("Brand flow proof resolves to an unapproved placeholder shared with Brand counting", () => {
  const proof = getProofRuntimeForScene(SEGMENT, SCENE);

  assert.ok(proof);
  assert.equal(proof.hasInternalProof, true);
  assert.equal(proof.hasExternalProof, false);
  assert.equal(proof.hasPlayableProof, false);
  assert.equal(proof.internalProofs[0].id, "CASE-SC-03");
  assert.equal(proof.internalProofs[0].status, "placeholder");
  assert.equal(proof.internalProofs[0].externalUseApproved, false);

  // The same placeholder Brand counting resolves — it is deliberately shared,
  // not a second proof invented for this scene.
  const counting = getProofRuntimeForScene(SEGMENT, "shopping-centre-brand-counting");
  assert.equal(counting.internalProofs[0].id, "CASE-SC-03");

  // It carries no customer name, so the presenter note is the only thing the
  // component may render from it.
  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.match(component, /!presentationMode && !hasExternalProof/);
  assert.match(component, /No approved external proof yet/);
});

test("Brand flow offers no optional branch, because none is typed", () => {
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
  assert.doesNotMatch(source, /brandflow__branch/);
});

test("Brand flow renders its own production hero, and it exists on disk", () => {
  assert.ok(existsSync(HERO_PATH));

  const component = readFileSync(COMPONENT_PATH, "utf8");
  assert.ok(
    component.includes(`src="${HERO_URL}"`),
    "the scene must render the location-visuals hero for this scene",
  );
  assert.ok(HERO_URL.includes("/location-visuals/shopping-centre/"));
  assert.ok(HERO_URL.includes("brand-flow"));

  // The filename breaks the `shopping-centre-*` convention every other
  // production hero in this directory follows. Supplied assets are used as
  // given in this project, so the inconsistency is pinned rather than renamed
  // away — and pinned here so a later rename cannot silently break the scene.
  assert.ok(HERO_URL.endsWith("shopping-centre-visitor-brand-flow-hero.png"));

  // The scene's typed visual asset is its own, and is still a placeholder — no
  // approved-visual claim is made anywhere by rendering it.
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.visualAssetId, "VIS-SC-07");
});

test("Brand flow renders neither rejected production plate", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  // The dwell plate duplicates the photograph Internal circulation renders; the
  // parking plate belongs to the segment's parking branch. Both exist in the
  // same directory, and neither may be reached from here.
  for (const url of REJECTED_HERO_URLS) {
    assert.ok(existsSync(repoFile(`public${url}`)));
    assert.ok(!component.includes(url), `${url} must not be rendered by this scene`);
  }
});

test("Brand flow takes no approved scene's hero, and none takes its own", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  for (const [path, heroUrl] of Object.entries(APPROVED_SCENE_HEROES)) {
    assert.ok(!component.includes(heroUrl), `${heroUrl} belongs to ${path} alone`);

    // And the reverse: no approved scene may be repointed at this scene's plate.
    const approved = readFileSync(repoFile(path), "utf8");
    assert.ok(approved.includes(`src="${heroUrl}"`), `${path} must keep its own hero`);
    assert.ok(!approved.includes(HERO_URL), `${path} must not render the brand-flow plate`);
    assert.ok(existsSync(repoFile(`public${heroUrl}`)));
  }
});

test("Brand flow reaches no legacy locations/ asset and no other segment's asset", () => {
  const component = readFileSync(COMPONENT_PATH, "utf8");

  assert.ok(
    !component.includes("/assets/locations/"),
    "a production scene must not reach into the legacy locations/ tree",
  );

  // Named explicitly, because it is the single most confusable file in the
  // repository: a legacy asset whose name differs from this scene's production
  // hero by one suffix, and which is a completely different picture — an
  // abstract white cutaway floorplan with route lines, i.e. exactly the generic
  // diagram this scene exists to avoid.
  assert.ok(existsSync(repoFile(`public${LEGACY_BRAND_FLOW_URL}`)));
  assert.ok(
    !component.includes(LEGACY_BRAND_FLOW_URL),
    "the legacy floorplan plate must never be rendered by this scene",
  );
  assert.notEqual(LEGACY_BRAND_FLOW_URL, HERO_URL);

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

test("Brand flow owns its styles and patches no shared rule", () => {
  const css = readFileSync(repoFile("app/globals.css"), "utf8");

  // Every rule this scene added is namespaced under its own prefix, so no
  // approved scene can be altered by a change made for this one — and in
  // particular the shared SceneLensRail rules are left exactly as they are,
  // including the sub-1200px note hiding, which is a shared backlog item and
  // not this scene's to patch.
  assert.match(css, /\.sc-brandflow__hero \{/);
  assert.match(css, /\.sc-brandflow \.capture__intro::before \{/);
  assert.doesNotMatch(css, /\.sc-brandflow[^{]*\.capture__lens/);
  assert.doesNotMatch(css, /\.sc-brandflow[^{]*\.capture__method/);

  // The prefix collides with no approved scene's prefix. `.sc-brands` is the
  // dangerous one — it is a strict prefix of nothing here, and `.sc-brandflow`
  // is not matched by any `.sc-brands__*` selector.
  for (const prefix of [
    ".catchment__",
    ".entrances__",
    ".sc-composition__",
    ".sc-circulation__",
    ".sc-exposure__",
    ".sc-brands__",
  ]) {
    assert.ok(!prefix.startsWith(".sc-brandflow"), `${prefix} must not collide with .sc-brandflow`);
    assert.ok(!".sc-brandflow__hero".startsWith(prefix), `${prefix} must not match .sc-brandflow`);
  }

  // No zoom workaround anywhere in this scene's block; the crop is tuned with
  // object-position alone.
  const block = css.slice(css.indexOf("Shopping Centre · Brand flow"));
  assert.doesNotMatch(block, /transform:\s*scale\(/);
  assert.match(block, /object-position:/);
});

test("Building Brand flow does not make Shopping Centre navigable", () => {
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
