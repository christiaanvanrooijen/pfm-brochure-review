/**
 * Retail Park Act — the last page, which makes it the easiest place to quietly
 * upgrade a measurement into a business claim.
 *
 * These tests police four things:
 *
 *   1. The decision stays with a person. No score, no ranking, no preselection,
 *      no conclusion drawn on the reader's behalf.
 *   2. The six Retail Park boundaries survive into the closing argument, and the
 *      five evidence units stay distinct from one another.
 *   3. Nothing licence-plate or lawful-origin-shaped reaches the default flow,
 *      and the one place registration origin is named it is being DENIED.
 *   4. Act adds no scene, no route position and no proof it does not have.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getSceneForSegment, getScenesForStage } from "../app/content/runtime.ts";
import {
  actDecisionOwner,
  getActDirectionsForSegment,
  getActSynthesis,
  validateActRuntime,
} from "../app/content/act-runtime.ts";
import {
  retailParkActBeatIds,
  retailParkActBeats,
  retailParkActClosing,
  retailParkActConvergence,
  retailParkActFooterNote,
  retailParkActVehicleNote,
  retailParkVisitorContrast,
} from "../app/content/act-retail-park.ts";
import { shoppingCentreActBeats } from "../app/content/act-shopping-centre.ts";
import {
  vehicleEvidenceSemantics,
  vehicleUnitAvailable,
  resolvesAsPeopleEvidence,
} from "../app/content/vehicle-semantics.ts";
import { getPlayableProofsForScene } from "../app/content/proof-runtime.ts";
import { getSolutionDirectionsForSegment } from "../app/content/solution-runtime.ts";

const SEGMENT = "retail-park";
const COMPONENT = "app/components/RetailParkActScene.tsx";

const repoFile = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const code = () =>
  readFileSync(repoFile(COMPONENT), "utf8")
    // `{/*` with no gap, deliberately: `\{\s*\/\*` also matches an interface's
    // opening brace followed by a JSDoc member comment, and then swallows
    // everything up to the first `*/}` in the file — which is most of the JSX.
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

const CORE_ROUTE = [
  "retail-park-catchment-area",
  "retail-park-vehicle-arrival",
  "retail-park-parking-occupancy",
  "retail-park-unit-visits",
  "retail-park-cross-visitation",
  "retail-park-time-on-site",
  "retail-park-unit-category-exposure",
];

const byId = (id) => retailParkActBeats.find((beat) => beat.id === id);

/* The OFFER surface — what this page promises. `cannotSupport` is excluded and
   tested separately: it is the field whose job is to DENY, and a denial has to
   name what it denies ("not a sale", "never where a person lives"). Banning
   those tokens everywhere would fail on the sentences that enforce the rule. */
const offerSurface = (beat) =>
  [beat.title, beat.owner, beat.evidence, beat.supports, beat.investigation, beat.nextDecision].join(
    " | ",
  );

/* ------------------------------------------------------------------ *
   1. SEGMENT-SPECIFIC RESOLUTION
 * ------------------------------------------------------------------ */

test("1. Retail Park Act resolves its own four beats, reaching no other segment", () => {
  assert.deepEqual(validateActRuntime(), []);
  assert.deepEqual(retailParkActBeats.map((b) => b.id), [...retailParkActBeatIds]);
  assert.equal(retailParkActBeats.length, 4);
  for (const beat of retailParkActBeats) {
    assert.equal(beat.segment, SEGMENT);
    for (const sceneId of beat.relatedSceneIds) {
      // Throws if the scene is not this segment's, which is the assertion.
      assert.ok(getSceneForSegment(SEGMENT, sceneId));
      assert.ok(CORE_ROUTE.includes(sceneId), `${beat.id} reaches a non-Core scene: ${sceneId}`);
    }
  }
  // Every Core scene is carried by exactly one beat, so the closing argument
  // drops none of the evidence story and double-counts none of it.
  const carried = retailParkActBeats.flatMap((b) => b.relatedSceneIds);
  assert.deepEqual([...carried].sort(), [...CORE_ROUTE].sort());
  assert.equal(new Set(carried).size, carried.length);
});

test("2. the approved Shopping Centre Act beats are untouched", () => {
  assert.deepEqual(shoppingCentreActBeats.map((b) => b.id), [
    "sc-act-operating-rhythm",
    "sc-act-space-and-layout",
    "sc-act-leasing-and-mix",
    "sc-act-position-and-reach",
  ]);
  for (const beat of shoppingCentreActBeats) {
    assert.equal(beat.segment, "shopping-centre");
  }
  // And no Retail Park copy leaked into it.
  const scText = shoppingCentreActBeats.map((b) => Object.values(b).join(" ")).join(" ");
  assert.doesNotMatch(scText, /retail-park|car park|retail park/i);
});

/* ------------------------------------------------------------------ *
   2. THE DECISION IS HUMAN-OWNED
 * ------------------------------------------------------------------ */

test("3. decisionOwner is the literal human, and the page binds it rather than restating it", () => {
  const synthesis = getActSynthesis(SEGMENT);
  assert.equal(synthesis.decisionOwner, "human");
  assert.equal(actDecisionOwner, "human");
  assert.equal(synthesis.journeyStage, "act");
  assert.ok(synthesis.captures.includes("human_owned_decision"));
  // The wrapper must not hard-code the owner: it comes from the typed contract
  // through the shared layout.
  assert.doesNotMatch(code(), /decision owner/i);
  assert.match(code(), /ActSceneLayout/);
  assert.match(code(), /segmentId=\{SEGMENT\}/);
});

test("4. every next decision is something a person agrees, never something concluded for them", () => {
  for (const beat of retailParkActBeats) {
    assert.match(
      beat.nextDecision,
      /^Agree /,
      `${beat.id}: a next decision must be phrased as something to agree`,
    );
    assert.ok(beat.investigation.trim().endsWith("?"), `${beat.id}: investigation must be a question`);
    assert.ok(beat.owner.length > 0);
    // Never a PFM role: the owner is someone in the customer's organisation.
    assert.doesNotMatch(beat.owner, /\bPFM\b/);
  }
  assert.match(retailParkActFooterNote, /Nothing here is recommended, ranked or decided for you/);
  assert.match(retailParkActClosing.truth, /Nothing has been sent, submitted or saved/);
  // Reversible: the last screen of a brochure must not be a dead end.
  assert.ok(retailParkActClosing.back.length > 0);
});

test("5. no ranking, score, optimisation or automated conclusion anywhere", () => {
  const banned = [
    /\brank(?:ed|ing|s)?\b/i, /\bscor(?:e|ed|es|ing)\b/i, /\bbest\b/i, /\bworst\b/i,
    /\btop\b/i, /\bhighest\b/i, /\blowest\b/i, /\bleading\b/i, /\boptimis|\boptimiz/i,
    /\brecommend/i, /\bwe suggest\b/i, /\bpreferred\b/i, /\bautomatic/i, /\bwinner\b/i,
    /\byou should\b/i, /\bwe conclude\b/i, /\bthe answer is\b/i, /\bselected for you\b/i,
  ];
  const surfaces = [
    ...retailParkActBeats.map(offerSurface),
    retailParkActConvergence.label,
    retailParkActConvergence.note,
    retailParkActVehicleNote,
    retailParkActClosing.headline,
    retailParkActClosing.handoff,
    retailParkActClosing.cta,
  ];
  for (const surface of surfaces) {
    for (const pattern of banned) {
      assert.doesNotMatch(surface, pattern, `Act offer copy matches ${pattern}: ${surface}`);
    }
  }
  // The footer note is a denial and names "recommended, ranked"; scan the rest.
  assert.doesNotMatch(retailParkActFooterNote, /\bscore|\boptimis|\bbest\b/i);
});

test("6. the component holds no selection, scoring or preselection state", () => {
  const source = code();
  for (const forbidden of [
    /\bscore/i, /\brank/i, /\brecommend/i, /\bsort\(/, /\bselected\b/i, /defaultBeat/i,
    /\bbest\b/i, /localStorage/, /fetch\(/,
  ]) {
    assert.doesNotMatch(source, forbidden, `Act component carries ${forbidden}`);
  }
});

/* ------------------------------------------------------------------ *
   3. THE SIX BOUNDARIES, AND THE FIVE UNITS
 * ------------------------------------------------------------------ */

test("7. a vehicle is not a visitor, an arrival is not an occupancy, and occupancy needs a capacity", () => {
  const beat = byId("rp-act-access-and-parking");
  assert.match(beat.cannotSupport, /a vehicle is not a visitor/i);
  assert.match(beat.cannotSupport, /An arrival is not an occupancy/i);
  assert.match(beat.cannotSupport, /until a capacity and its zones are agreed/i);
  assert.deepEqual([...beat.relatedSceneIds], [
    "retail-park-vehicle-arrival",
    "retail-park-parking-occupancy",
  ]);
});

test("8. a unit visit is not a person, vehicle, sale or transaction, and exposure ranks nothing", () => {
  const beat = byId("rp-act-unit-mix-and-leasing");
  assert.match(beat.cannotSupport, /a unit visit is not a person, a vehicle, a sale or a transaction/i);
  assert.match(beat.cannotSupport, /Exposure ranks nothing/i);
  assert.match(beat.cannotSupport, /unknown exposure rather than none/i);
  assert.match(beat.cannotSupport, /Tenant trade of any kind/i);
});

test("9. a sequence is an order not a cause, and time on site is not vehicle dwell", () => {
  const beat = byId("rp-act-layout-and-adjacency");
  assert.match(beat.cannotSupport, /a sequence is an order, never a cause, an identity or a recognised shopper/i);
  assert.match(beat.cannotSupport, /Time on site is a visitor duration and is not how long a vehicle stood/i);
  assert.match(beat.supports, /within|covered/i);
});

test("10. geo stays context, and registration origin is named only to be denied", () => {
  const beat = byId("rp-act-position-and-catchment");
  assert.match(beat.cannotSupport, /never replaces what the asset itself measures/i);
  assert.match(beat.cannotSupport, /never where a person lives/i);
  // It appears in the denial and nowhere in what is offered.
  assert.match(beat.cannotSupport, /registration/i);
  assert.doesNotMatch(offerSurface(beat), /registration|licence plate|number plate|\bANPR\b|\bLPR\b/i);
});

test("11. every beat denies as plainly as it offers", () => {
  for (const beat of retailParkActBeats) {
    assert.ok(beat.cannotSupport.length > 80, `${beat.id}: the limit is too thin to be honest`);
    assert.match(beat.cannotSupport, /\b(not|never|no|neither|nothing)\b/i);
  }
});

test("12. the five evidence units stay distinct, and the strip is derived not retyped", () => {
  const source = code();
  // The four vehicle units are rendered FROM the typed semantics.
  assert.match(source, /vehicleEvidenceSemantics/);
  assert.match(source, /vehicleUnitAvailable/);
  // None of their labels, meanings or boundaries is retyped in the component.
  for (const semantic of vehicleEvidenceSemantics) {
    assert.ok(!source.includes(semantic.label), `component retypes "${semantic.label}"`);
    assert.ok(!source.includes(semantic.meaning), `component retypes a unit meaning`);
    for (const not of semantic.isNot) {
      assert.ok(!source.includes(not), `component retypes a unit boundary`);
    }
  }
  // The people unit is present as a contrast and is not a vehicle semantic.
  assert.equal(retailParkVisitorContrast.label, "Visitor visit");
  assert.ok(!vehicleEvidenceSemantics.some((s) => s.label === retailParkVisitorContrast.label));
  assert.ok(
    retailParkVisitorContrast.isNot.some((n) => /Derivable from any vehicle number/i.test(n)),
  );
  // And no vehicle unit may ever resolve as people evidence.
  for (const semantic of vehicleEvidenceSemantics) {
    assert.equal(resolvesAsPeopleEvidence(semantic.unit), false);
  }
  const labels = [...vehicleEvidenceSemantics.map((s) => s.label), retailParkVisitorContrast.label];
  assert.deepEqual(labels, [
    "Vehicle count", "Vehicle visit", "Vehicle dwell", "Registration origin", "Visitor visit",
  ]);
  assert.equal(new Set(labels).size, 5);
});

/* ------------------------------------------------------------------ *
   4. NO ANPR OR LAWFUL-ORIGIN LEAKAGE INTO THE DEFAULT FLOW
 * ------------------------------------------------------------------ */

test("13. the default Act path cannot support registration origin, by computation", () => {
  const segment = getSegment(SEGMENT);
  const inputs = new Set();
  for (const sceneId of segment.coreRoute) {
    const scene = getSceneForSegment(SEGMENT, sceneId);
    for (const dependency of scene.derivedDependencies) {
      for (const id of dependency.requiredInputIds) inputs.add(id);
      for (const group of dependency.alternativeInputGroups ?? []) {
        for (const id of group) inputs.add(id);
      }
    }
  }
  const available = [...inputs];
  // The two plate-shaped inputs are simply not on the Core route.
  assert.ok(!available.includes("licence_plate_events"));
  assert.ok(!available.includes("lawful_origin_source"));
  // So the unit resolves unavailable, and the other three resolve available.
  assert.equal(vehicleUnitAvailable("registration_origin", available), false);
  assert.equal(vehicleUnitAvailable("vehicle_count", available), true);
  assert.equal(vehicleUnitAvailable("vehicle_visit", available), true);
  assert.equal(vehicleUnitAvailable("vehicle_dwell", available), true);
});

test("14. the advanced origin scene reaches no beat, and no beat offers a plate", () => {
  const advanced = getSceneForSegment(SEGMENT, "retail-park-vehicle-origin");
  assert.equal(advanced.priority, "advanced");
  for (const beat of retailParkActBeats) {
    assert.ok(!beat.relatedSceneIds.includes("retail-park-vehicle-origin"), `${beat.id}`);
    for (const forbidden of [/\bANPR\b/i, /\bLPR\b/i, /licence plate/i, /number plate/i, /\bplate\b/i]) {
      assert.doesNotMatch(offerSurface(beat), forbidden, `${beat.id} offers ${forbidden}`);
    }
  }
  // The component names no plate vocabulary of its own either.
  const source = code();
  for (const forbidden of [/\bANPR\b/i, /\bLPR\b/i, /licence plate/i, /number plate/i]) {
    assert.doesNotMatch(source, forbidden);
  }
});

/* ------------------------------------------------------------------ *
   5. ACT ADDS NO SCENE, NO ROUTE AND NO PROOF
 * ------------------------------------------------------------------ */

test("15. the Core route and the Configure stage are exactly as approved", () => {
  const segment = getSegment(SEGMENT);
  assert.deepEqual([...segment.coreRoute], CORE_ROUTE);
  assert.deepEqual(segment.stageMapping.act, []);
  assert.deepEqual(segment.stageMapping.configure, []);
  assert.deepEqual(getScenesForStage(SEGMENT, "act"), []);
  assert.deepEqual(getScenesForStage(SEGMENT, "configure"), []);
  for (const scene of segment.scenes) {
    assert.notEqual(scene.journeyStage, "act");
  }
  const ordered = segment.scenes
    .filter((s) => s.corePathOrder !== null && s.corePathOrder !== undefined)
    .sort((a, b) => a.corePathOrder - b.corePathOrder);
  assert.deepEqual(ordered.map((s) => s.id), CORE_ROUTE);
  // Configure still resolves its own four directions, untouched by Act.
  assert.deepEqual(getSolutionDirectionsForSegment(SEGMENT).map((d) => d.id), [
    "solution-rp-arrival-and-parking",
    "solution-rp-units-and-visitation",
    "solution-rp-movement-and-dwell",
    "solution-rp-catchment-and-demand",
  ]);
});

test("16. Act invents no direction, no nextSceneId and no proof it does not have", () => {
  // Retail offers three next-conversation directions; this segment declares none,
  // exactly as the approved Shopping Centre Act does.
  assert.deepEqual(getActDirectionsForSegment(SEGMENT), []);
  // Nothing in this segment is external-approved, so nothing is prospect-playable.
  for (const sceneId of CORE_ROUTE) {
    assert.deepEqual(getPlayableProofsForScene(SEGMENT, sceneId), []);
  }
  // "See it in practice" is a Configure depth and must not appear on Act at all.
  assert.doesNotMatch(code(), /see it in practice/i);
  // The last Core scene still ends the route rather than pointing at Act.
  const last = getSceneForSegment(SEGMENT, "retail-park-unit-category-exposure");
  assert.equal(last.nextSceneId, undefined);
  assert.equal(last.nextCta, "Configure solution");
});

test("17. the closing state sends nothing and the CTA is a conversation, not a submission", () => {
  assert.equal(retailParkActClosing.cta, "Continue the conversation");
  for (const forbidden of [/\bsubmit/i, /\bsend\b/i, /\brequest a\b/i, /\bsign up\b/i, /\bbook\b/i, /\bdemo request/i]) {
    assert.doesNotMatch(retailParkActClosing.cta, forbidden);
    assert.doesNotMatch(retailParkActClosing.headline, forbidden);
  }
  assert.match(retailParkActClosing.handoff, /Your PFM contact/);
  // The component owns no form, no input and no network call.
  const source = code();
  for (const forbidden of [/<form/i, /<input/i, /<textarea/i, /fetch\(/, /XMLHttpRequest/]) {
    assert.doesNotMatch(source, forbidden);
  }
});

test("18. Retail Park's Act copy is its own, not a centre's or a store's", () => {
  const source = code();
  const copy = [
    ...retailParkActBeats.map((b) => Object.values(b).flat().join(" ")),
    retailParkActConvergence.note,
    retailParkActClosing.headline,
    retailParkActVehicleNote,
  ].join(" | ");
  assert.doesNotMatch(copy, /\bcentre\b/i, "Retail Park Act uses a centre's vocabulary");
  assert.doesNotMatch(copy, /\bstore\b/i, "Retail Park Act uses a store's vocabulary");
  assert.doesNotMatch(source, /\bcentre\b/i);
  // The convergence note is a single SVG text node and does not wrap, so it is
  // held short enough to fit the 900-unit viewBox.
  assert.ok(
    retailParkActConvergence.note.length <= 70,
    `convergence note is ${retailParkActConvergence.note.length} chars and will clip`,
  );
});
