/**
 * Retail Park Configure — the synthesis stage, not an eighth Core scene.
 *
 * These tests police three things the model could otherwise lose when seven
 * scenes are compressed into four offers:
 *
 *   1. Configure stays a synthesis. It adds no scene, no route position and no
 *      recommendation, and the seven-scene Core route is untouched by it.
 *   2. The six Retail Park capability boundaries survive the compression. Each
 *      one is asserted against the direction that carries it, on the reader's
 *      own copy rather than on the source file.
 *   3. Nothing licence-plate, origin-shaped or advanced reaches the default
 *      path — neither as a scene, nor as a capability, nor as a resolved
 *      implementation.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getScenesForStage, getSegment, getSceneForSegment } from "../app/content/runtime.ts";
import {
  getConfigureSynthesis,
  getSolutionDirectionsForSegment,
  getSolutionTechnologyDrilldown,
  getSolutionImplementationOptions,
  getSolutionRequirements,
  implementationsAreRanked,
  validateSolutionDirections,
} from "../app/content/solution-runtime.ts";
import {
  solutionDirectionIds,
  solutionTerritories,
} from "../app/content/solution-directions.ts";
import { getSegmentCapabilityMediaOverride } from "../app/content/segment-capability-media.ts";

const SEGMENT = "retail-park";
const COMPONENT = "app/components/RetailParkConfigureScene.tsx";

const repoFile = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const code = () =>
  readFileSync(repoFile(COMPONENT), "utf8")
    // `{/*` with no gap, deliberately: `\{\s*\/\*` also matches an interface's
    // opening brace followed by a JSDoc member comment, and then swallows
    // everything up to the first `*/}` in the file — which is most of the JSX.
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

const RP_IDS = [
  "solution-rp-arrival-and-parking",
  "solution-rp-units-and-visitation",
  "solution-rp-movement-and-dwell",
  "solution-rp-catchment-and-demand",
];

const RETAIL_IDS = [
  "solution-location-opportunity",
  "solution-capture-and-visits",
  "solution-in-store-intelligence",
  "solution-performance-intelligence",
];

const SC_IDS = [
  "solution-sc-arrival-and-rhythm",
  "solution-sc-movement-and-space",
  "solution-sc-tenant-and-brand",
  "solution-sc-catchment-and-positioning",
];

const CORE_ROUTE = [
  "retail-park-catchment-area",
  "retail-park-vehicle-arrival",
  "retail-park-parking-occupancy",
  "retail-park-unit-visits",
  "retail-park-cross-visitation",
  "retail-park-time-on-site",
  "retail-park-unit-category-exposure",
];

const directions = () => getSolutionDirectionsForSegment(SEGMENT);
const byId = (id) => directions().find((d) => d.id === id);

/* The surface on which this stage makes an OFFER — the words that promise a
   prospect something. `boundaryNote` is excluded and tested separately: it is
   the one field whose job is to DENY, and a denial has to name what it denies.
   Banning "sale" everywhere would fail on the sentence that forbids sales. */
const offerSurface = (direction) =>
  [
    direction.territoryLabel,
    direction.title,
    direction.customerQuestion,
    direction.lead,
    ...direction.capabilityPhrases,
    ...direction.alignmentNotes,
  ].join(" | ");

/* ------------------------------------------------------------------ *
   1. SEGMENT-SPECIFIC RESOLUTION
 * ------------------------------------------------------------------ */

test("1. Retail Park resolves its own four directions and reaches no other segment", () => {
  assert.deepEqual(validateSolutionDirections(), []);
  assert.deepEqual(directions().map((d) => d.id), RP_IDS);
  for (const direction of directions()) {
    assert.equal(direction.segment, SEGMENT);
    for (const sceneId of direction.relatedSceneIds) {
      // Throws if the scene is not this segment's, which is the assertion.
      assert.ok(getSceneForSegment(SEGMENT, sceneId));
    }
  }
  // And no other segment reached into Retail Park.
  for (const other of ["retail", "shopping-centre"]) {
    for (const direction of getSolutionDirectionsForSegment(other)) {
      for (const sceneId of direction.relatedSceneIds) {
        assert.ok(!sceneId.startsWith("retail-park-"), `${direction.id} reaches ${sceneId}`);
      }
    }
  }
});

test("2. the approved Retail and Shopping Centre directions are untouched", () => {
  assert.deepEqual(getSolutionDirectionsForSegment("retail").map((d) => d.id), RETAIL_IDS);
  assert.deepEqual(getSolutionDirectionsForSegment("shopping-centre").map((d) => d.id), SC_IDS);
  // Appended, never interleaved: the earlier positions in both shared unions
  // are byte-for-byte where they were.
  assert.deepEqual(solutionDirectionIds.slice(0, 8), [...RETAIL_IDS, ...SC_IDS]);
  assert.deepEqual(solutionDirectionIds.slice(8), RP_IDS);
  assert.deepEqual(solutionTerritories.slice(0, 8), [
    "outside", "entrance", "inside", "performance",
    "arrival", "movement", "tenancy", "reach",
  ]);
  assert.deepEqual(solutionTerritories.slice(8), ["vehicles", "units", "dwell", "catchment"]);
});

/* ------------------------------------------------------------------ *
   2. CONFIGURE IS A SYNTHESIS, NOT AN EIGHTH SCENE
 * ------------------------------------------------------------------ */

test("3. Configure and Act hold no scenes, and no scene claims those stages", () => {
  const segment = getSegment(SEGMENT);
  assert.deepEqual(segment.stageMapping.configure, []);
  assert.deepEqual(segment.stageMapping.act, []);
  assert.deepEqual(getScenesForStage(SEGMENT, "configure"), []);
  assert.deepEqual(getScenesForStage(SEGMENT, "act"), []);
  for (const scene of segment.scenes) {
    assert.notEqual(scene.journeyStage, "configure");
    assert.notEqual(scene.journeyStage, "act");
  }
});

test("4. the seven-scene Core route is exactly as approved, and Configure is not in it", () => {
  const segment = getSegment(SEGMENT);
  assert.deepEqual([...segment.coreRoute], CORE_ROUTE);
  assert.equal(segment.coreRoute.length, 7);
  // corePathOrder is 1..7 and nothing else holds one.
  const ordered = segment.scenes
    .filter((s) => s.corePathOrder !== null && s.corePathOrder !== undefined)
    .sort((a, b) => a.corePathOrder - b.corePathOrder);
  assert.deepEqual(ordered.map((s) => s.corePathOrder), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(ordered.map((s) => s.id), CORE_ROUTE);
  // A direction is not a scene: no direction id can be read as one.
  for (const direction of directions()) {
    assert.ok(!segment.coreRoute.includes(direction.id));
  }
});

test("5. the CTA out of Scene 7 hands to Configure and to no eighth scene", () => {
  const last = getSceneForSegment(SEGMENT, "retail-park-unit-category-exposure");
  assert.equal(last.nextCta, "Configure solution");
  assert.equal(last.nextSceneId, undefined);
  // Every earlier Core scene still points at its successor, unchanged.
  const successors = CORE_ROUTE.map((id) => getSceneForSegment(SEGMENT, id).nextSceneId);
  assert.deepEqual(successors, [...CORE_ROUTE.slice(1), undefined]);
});

/* ------------------------------------------------------------------ *
   3. NO RECOMMENDATION, ANYWHERE
 * ------------------------------------------------------------------ */

test("6. recommendationMode is the literal none, and Configure recommends nothing", () => {
  const synthesis = getConfigureSynthesis(SEGMENT);
  assert.equal(synthesis.recommendationMode, "none");
  assert.equal(synthesis.journeyStage, "configure");
  assert.equal(implementationsAreRanked, false);
  // The decision stays with a person: the typed Act contract says so, and
  // Configure must not quietly pre-empt it.
  assert.equal(getSegment(SEGMENT).synthesis.act.decisionOwner, "human");
});

test("7. no direction ranks, scores, prefers, optimises or auto-selects", () => {
  const banned = [
    /\brank(?:ed|ing|s)?\b/i, /\bscor(?:e|ed|es|ing)\b/i, /\bbest\b/i, /\bworst\b/i,
    /\btop\b/i, /\bhighest\b/i, /\blowest\b/i, /\bleading\b/i, /\boptimis|\boptimiz/i,
    /\brecommend/i, /\bsuggest/i, /\bpreferred\b/i, /\bdefault\b/i, /\bselected for you\b/i,
    /\bwe advise\b/i, /\bshould choose\b/i, /\bautomatic/i, /\bwinner\b/i,
    /\bmost\b/i, /\bleast\b/i,
  ];
  for (const direction of directions()) {
    const surface = offerSurface(direction);
    for (const pattern of banned) {
      assert.doesNotMatch(surface, pattern, `${direction.id} offer copy matches ${pattern}`);
    }
  }
  // The presentation wrapper is an offer surface too — but only its OFFER half.
  // The masthead's own denial ("Nothing here is selected, scored or recommended
  // for you") has to name what it denies, so scanning it for those words fails
  // on the sentence that enforces the rule. Test 21 asserts that denial is
  // present; this scans what is left once it is removed.
  const DENIAL = /Nothing here is selected, scored or recommended for you\./;
  assert.match(code(), DENIAL, "the denial this scanner excludes must actually exist");
  const wrapperOffer = code().replace(DENIAL, " ");
  for (const pattern of [/\brecommend/i, /\bbest\b/i, /\bscored\b/i, /\bwe suggest\b/i, /\boptimis|\boptimiz/i]) {
    assert.doesNotMatch(wrapperOffer, pattern, `Configure wrapper copy matches ${pattern}`);
  }
});

test("8. no ranking or selection state is exposed by the runtime for this segment", () => {
  for (const direction of directions()) {
    // `ranked` is the one permitted key of that shape, and it exists precisely
    // so a consumer reads the fact rather than assuming it. Its VALUE is the
    // assertion; banning the name would delete the guarantee.
    const drilldown = getSolutionTechnologyDrilldown(direction.id);
    assert.equal(drilldown.ranked, false, `${direction.id} declares itself ranked`);

    for (const result of [drilldown, getSolutionRequirements(direction.id)]) {
      for (const key of Object.keys(result ?? {})) {
        if (key === "ranked") continue;
        assert.doesNotMatch(
          key,
          /rank|score|recommend|preferred|default|selected|best|optimis|optimiz/i,
          `${direction.id} result carries "${key}"`,
        );
      }
    }
  }
});

/* ------------------------------------------------------------------ *
   4. THE SIX CAPABILITY BOUNDARIES
 * ------------------------------------------------------------------ */

test("9. vehicle arrival is not parking occupancy, and occupancy needs a capacity", () => {
  const d = byId("solution-rp-arrival-and-parking");
  assert.match(d.boundaryNote, /An arrival is not an occupancy/i);
  assert.match(d.boundaryNote, /a vehicle is not a visitor/i);
  assert.match(d.boundaryNote, /needs an agreed capacity and zone definition/i);
  assert.match(d.boundaryNote, /neither reading counts people or identifies a car/i);
  // The capacity requirement is not only prose: it is a derived input.
  const inputs = d.relatedSceneIds.flatMap((id) =>
    getSceneForSegment(SEGMENT, id).derivedDependencies.flatMap((dep) => dep.requiredInputIds),
  );
  assert.ok(inputs.includes("parking_capacity"));
  assert.ok(inputs.includes("vehicle_events"));
});

test("10. a unit visit is not a person, vehicle, sale or transaction, and exposure ranks nothing", () => {
  const d = byId("solution-rp-units-and-visitation");
  assert.match(d.boundaryNote, /A unit visit is not a person, a vehicle, a sale or a transaction/i);
  assert.match(d.boundaryNote, /exposure ranks nothing/i);
  assert.match(d.boundaryNote, /unknown exposure rather than none/i);
  assert.match(d.boundaryNote, /no tenant trade anywhere in this segment/i);
});

test("11. cross-visitation is neither identity nor cause, and time on site is not vehicle dwell", () => {
  const d = byId("solution-rp-movement-and-dwell");
  assert.match(d.boundaryNote, /not an identity, a recognised shopper or a cause/i);
  assert.match(d.boundaryNote, /visits happened in an order, never why/i);
  assert.match(d.boundaryNote, /not the same measurement as how long a vehicle stood/i);
  // The distinction is carried into scoping, not just stated once.
  assert.ok(
    d.alignmentNotes.some((n) => /a vehicle duration and a visitor visit are not the same/i.test(n)),
  );
});

test("12. geo stays context and never replaces what is measured at the park", () => {
  const d = byId("solution-rp-catchment-and-demand");
  assert.match(d.boundaryNote, /not a measurement of this park's own visitors/i);
  assert.match(d.boundaryNote, /never replaces them/i);
  assert.match(d.boundaryNote, /identifies anyone or names a vehicle/i);
});

test("13. every boundary note denies rather than staying silent", () => {
  for (const direction of directions()) {
    assert.ok(direction.boundaryNote.length > 60, `${direction.id} boundary is too thin`);
    assert.match(
      direction.boundaryNote,
      /\b(not|never|no|neither|rather than)\b/i,
      `${direction.id} boundary states no denial`,
    );
  }
});

/* ------------------------------------------------------------------ *
   5. NO TRADE, NO ANPR, NO ADVANCED BRANCH ON THE DEFAULT PATH
 * ------------------------------------------------------------------ */

test("14. TECH-08 appears nowhere in Retail Park, and no direction offers trade", () => {
  for (const scene of getSegment(SEGMENT).scenes) {
    assert.ok(!scene.technologyCapabilityIds.includes("TECH-08"), `${scene.id} declares TECH-08`);
  }
  const banned = [
    /\bsales?\b/i, /\bturnover\b/i, /\brevenue\b/i, /\btransactions?\b/i, /\bspend\b/i,
    /\bbasket\b/i, /\bconversion\b/i, /\bATV\b/, /\bPOS\b/, /\bROI\b/i, /\bfootfall to sales\b/i,
  ];
  for (const direction of directions()) {
    assert.ok(!direction.technologyCapabilityIds.includes("TECH-08"));
    for (const pattern of banned) {
      assert.doesNotMatch(offerSurface(direction), pattern, `${direction.id} offers ${pattern}`);
    }
  }
});

test("15. the advanced vehicle-origin scene is on no direction and contributes no capability", () => {
  const advanced = getSceneForSegment(SEGMENT, "retail-park-vehicle-origin");
  assert.equal(advanced.priority, "advanced");
  for (const direction of directions()) {
    assert.ok(
      !direction.relatedSceneIds.includes("retail-park-vehicle-origin"),
      `${direction.id} pulls the advanced origin scene onto the default path`,
    );
  }
  // No direction's derived inputs may reach plate or lawful-origin data.
  for (const direction of directions()) {
    const inputs = direction.relatedSceneIds.flatMap((id) =>
      getSceneForSegment(SEGMENT, id).derivedDependencies.flatMap((dep) => [
        ...dep.requiredInputIds,
        ...(dep.alternativeInputGroups ?? []).flat(),
      ]),
    );
    for (const forbidden of ["licence_plate_events", "lawful_origin_source"]) {
      assert.ok(!inputs.includes(forbidden), `${direction.id} requires ${forbidden}`);
    }
  }
});

test("16. the conditional lawful origin implementation resolves nowhere in this segment", () => {
  const override = getSegmentCapabilityMediaOverride(SEGMENT, "TECH-06");
  assert.ok(override, "Retail Park must narrow TECH-06");
  assert.ok(!override.implementationIds.includes("impl-lawful-anpr-lpr"));
  // A narrowing, never an addition.
  assert.deepEqual(override.implementationIds, [
    "impl-vehicle-arrival-method",
    "impl-parking-occupancy-method",
    "impl-tattile-anpr-vehicle",
  ]);
  for (const direction of directions()) {
    const resolved = getSolutionTechnologyDrilldown(direction.id).capabilities.flatMap((entry) =>
      entry.implementations.map((impl) => impl.id),
    );
    assert.ok(
      !resolved.includes("impl-lawful-anpr-lpr"),
      `${direction.id} resolves the conditional lawful origin branch`,
    );
    const site = getSolutionImplementationOptions(direction.id).flatMap((group) =>
      group.options.map((option) => option.implementationId),
    );
    assert.ok(!site.includes("impl-lawful-anpr-lpr"));
  }
  // The narrowing is scoped to Retail Park: Shopping Centre is untouched.
  assert.equal(getSegmentCapabilityMediaOverride("shopping-centre", "TECH-06"), null);
});

test("17. the vehicle implementation carries its own denials with it", () => {
  const entry = getSolutionTechnologyDrilldown("solution-rp-arrival-and-parking")
    .capabilities.find((c) => c.capability.id === "TECH-06");
  const tattile = entry.implementations.find((i) => i.id === "impl-tattile-anpr-vehicle");
  assert.ok(tattile, "the sensing the two approved scenes depict must stay visible");
  assert.ok(tattile.blockedClaims.some((c) => /one vehicle is never one visitor/i.test(c)));
  assert.ok(tattile.blockedClaims.some((c) => /licence plate is anonymous/i.test(c)));
  assert.ok(tattile.blockedClaims.some((c) => /never where a person lives/i.test(c)));
});

/* ------------------------------------------------------------------ *
   6. THE PRESENTATION WRAPPER
 * ------------------------------------------------------------------ */

test("18. the wrapper is thin: it owns copy and glyphs, and restates no scene", () => {
  const source = code();
  assert.match(source, /ConfigureSceneLayout/);
  assert.match(source, /segmentId=\{SEGMENT\}/);
  // Nothing structural is duplicated here.
  for (const forbidden of [/useReducer/, /getSolutionRequirements/, /getSolutionProof/, /getSolutionPrivacyDetail/]) {
    assert.doesNotMatch(source, forbidden, `wrapper duplicates ${forbidden}`);
  }
  // No scene id, capability id or implementation id is hand-written here.
  assert.doesNotMatch(source, /retail-park-[a-z-]+"/, "wrapper names a scene by id");
  assert.doesNotMatch(source, /TECH-\d\d/, "wrapper names a capability by id");
  assert.doesNotMatch(source, /impl-[a-z-]+/, "wrapper names an implementation by id");
});

test("19. one glyph per territory, complete, with no fallback", () => {
  // Read the declared keys off the source rather than rendering React here:
  // the assertion is that the lookup is exhaustive and has no default arm.
  const source = code();
  const declared = [...source.matchAll(/^\s{2}([a-z]+): \(/gm)].map((m) => m[1]);
  const territories = [...new Set(directions().map((d) => d.territory))];
  assert.deepEqual(declared.sort(), [...territories].sort());
  assert.doesNotMatch(source, /default:/, "a glyph fallback would lend one territory another's mark");
});

test("20. Configure withholds the step on to Act, in this segment's own noun", () => {
  const source = code();
  assert.match(source, /showNextStage = false/);
  assert.match(source, /This is as far as the retail park journey goes today\./);
  // The shared default is a centre's noun and must not reach a park.
  assert.doesNotMatch(source, /centre/i, "Retail Park copy uses a centre's vocabulary");
  assert.doesNotMatch(source, /\bstore\b/i, "Retail Park copy uses a store's vocabulary");
});

test("21. the masthead announces exploration, never a chosen or validated solution", () => {
  const source = code();
  assert.match(source, /Nothing here is selected, scored or recommended for you\./);
  for (const forbidden of [
    /your recommended/i, /we have selected/i, /chosen solution/i, /validated solution/i,
    /the right solution/i, /your solution is/i,
  ]) {
    assert.doesNotMatch(source, forbidden, `masthead implies a decision: ${forbidden}`);
  }
});
