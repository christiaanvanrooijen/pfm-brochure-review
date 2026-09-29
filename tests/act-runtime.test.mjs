import assert from "node:assert/strict";
import test from "node:test";

import { contentBundle, retailSegment, validateContentBundle } from "../app/content/index.ts";
import { getCanonicalJourneyStages, isSynthesisStage } from "../app/content/runtime.ts";
import * as actRuntime from "../app/content/act-runtime.ts";
import {
  actClosing,
  actConvergence,
  actDecisionOwner,
  actRecapBeats,
  getActDirection,
  getActDirectionsForSegment,
  getActProof,
  getActSynthesis,
  getOfferableActDirections,
  validateActDirections,
  validateActRuntime,
} from "../app/content/act-runtime.ts";
import {
  actViewReducer,
  initialActViewState,
  resolveVisibleActDirection,
} from "../app/lib/act-view.ts";
import { experienceReducer, initialState } from "../app/lib/session.ts";
import {
  configureViewReducer,
  initialConfigureViewState,
} from "../app/lib/configure-view.ts";
import { stages } from "../app/lib/fixtures.ts";

const directions = getActDirectionsForSegment("retail");

/** Every leaf value reachable from a runtime result. */
function leaves(value, out = []) {
  if (value === null || value === undefined) return out;
  if (Array.isArray(value)) {
    for (const item of value) leaves(item, out);
    return out;
  }
  if (typeof value === "object") {
    for (const item of Object.values(value)) leaves(item, out);
    return out;
  }
  out.push(value);
  return out;
}

/* ------------------------------------------------------------------ 1 */
test("Act remains the final canonical stage and a synthesis stage, not a fabricated scene", () => {
  const journey = getCanonicalJourneyStages();
  assert.equal(journey[journey.length - 1], "act");
  assert.equal(journey.length, 6);
  assert.ok(isSynthesisStage("act"));

  // The architectural invariant Act rests on: it holds no scenes at all.
  assert.deepEqual(retailSegment.stageMapping.act, []);
  assert.deepEqual(validateContentBundle(contentBundle), []);
  assert.deepEqual(validateActDirections(), []);
  assert.deepEqual(validateActRuntime(), []);

  const synthesis = getActSynthesis("retail");
  assert.equal(synthesis.journeyStage, "act");
  assert.equal(synthesis.decisionOwner, "human");
  assert.equal(synthesis.decisionOwner, actDecisionOwner);
  assert.ok(synthesis.governingQuestion.length > 0);
});

/* ------------------------------------------------------------------ 2 */
test("the journey ends at Act — no seventh stage such as Contact, Finish or Quote", () => {
  assert.deepEqual(
    stages.map((stage) => stage.id),
    ["context", "measure", "understand", "prove", "configure", "act"],
  );
  assert.equal(stages[stages.length - 1].id, "act");
  // The last stage offers no "next stage", so nothing can be appended silently.
  assert.equal(stages.filter((stage) => stage.id === "act").length, 1);
});

/* ------------------------------------------------------------------ 3 */
test("Act binds to the typed synthesis contract rather than restating it", () => {
  const synthesis = getActSynthesis("retail");
  assert.deepEqual(
    [...synthesis.captures],
    [
      "observed_evidence",
      "interpretation",
      "investigation_or_test",
      "next_step",
      "human_owned_decision",
    ],
  );
  assert.ok(synthesis.sourceRefs.length > 0);
});

/* ------------------------------------------------------------------ 4 */
test("Act exposes no pricing anywhere in its content or runtime", () => {
  const forbidden = [
    "price", "pricing", "cost", "eur", "€", "$", "licence fee", "subscription",
    "quote", "quotation", "proposal", "invoice", "discount", "checkout",
  ];
  const surface = leaves([
    directions,
    actRecapBeats,
    actConvergence,
    actClosing,
    getActProof("retail", "sales"),
    getActProof("retail", "presentation"),
    getOfferableActDirections("retail", "sales"),
    getOfferableActDirections("retail", "presentation"),
  ])
    .filter((value) => typeof value === "string")
    .join(" \n ")
    .toLowerCase();

  for (const token of forbidden) {
    assert.ok(!surface.includes(token), `Act content must not mention "${token}"`);
  }
});

/* ------------------------------------------------------------------ 5 */
test("Act exposes no ROI, uplift, payback or invented performance claim", () => {
  const forbidden = [
    "roi", "return on investment", "payback", "uplift", "increase of",
    "guarantee", "guaranteed", "benchmark", "% more", "accuracy of",
  ];
  const surface = leaves([directions, actRecapBeats, actConvergence, actClosing])
    .filter((value) => typeof value === "string")
    .join(" \n ")
    .toLowerCase();

  for (const token of forbidden) {
    assert.ok(!surface.includes(token), `Act content must not mention "${token}"`);
  }

  // The recap is a closing gesture, not a KPI wall: no beat carries a number.
  for (const beat of actRecapBeats) {
    assert.ok(!/\d/.test(`${beat.from}${beat.to}`));
  }
});

/* ------------------------------------------------------------------ 6 */
test("Act has no recommendation, ranking or scoring model", () => {
  // Nothing in the module can express a preference: no score, rank, weight,
  // recommendation or default field exists on any direction.
  for (const direction of directions) {
    for (const key of Object.keys(direction)) {
      assert.ok(
        !/(score|rank|weight|recommend|priority|preferred|default|selected)/i.test(key),
        `${direction.id} exposes a preference field: ${key}`,
      );
    }
  }
  assert.equal(actDecisionOwner, "human");
  // No runtime export computes anything.
  for (const [name, value] of Object.entries(actRuntime)) {
    if (typeof value !== "function") continue;
    assert.ok(!/(rank|score|recommend|calculate|compute|price)/i.test(name),
      `act-runtime must not export ${name}`);
  }
});

/* ------------------------------------------------------------------ 7 */
test("Act creates no saved configuration and triggers no external handoff", () => {
  // The view reducer is the entirety of Act's behaviour, and it can reach only
  // three states: a paragraph open, the closing state, or neither. There is no
  // action that could save, send, submit or hand anything off.
  const actionTypes = [
    "TOGGLE_DIRECTION",
    "CLOSE_DIRECTION",
    "CONTINUE_CONVERSATION",
    "BACK_TO_DIRECTIONS",
    "DISMISS",
  ];
  for (const type of actionTypes) {
    assert.ok(!/(save|send|submit|create|publish|export|quote|order)/i.test(type));
  }

  // Every reachable state is describable by exactly these two fields.
  let state = initialActViewState;
  assert.deepEqual(Object.keys(state).sort(), ["closing", "openDirectionId"]);
  for (const type of actionTypes) {
    state = actViewReducer(state, { type, directionId: directions[0].id });
    assert.deepEqual(Object.keys(state).sort(), ["closing", "openDirectionId"]);
  }

  // Opening a paragraph is not a selection: the session state is untouched by
  // Act, so no configured capability or quote status can originate here.
  assert.equal(initialState.quoteStatus, "idle");
  assert.equal(initialState.completionStatus, "idle");
});

/* ------------------------------------------------------------------ 8 */
test("the primary call to action is truthful — it claims nothing was sent", () => {
  const closing = actViewReducer(initialActViewState, { type: "CONTINUE_CONVERSATION" });
  assert.equal(closing.closing, true);
  // Whatever was being read is dropped, so the closing state cannot look like a
  // choice was made.
  assert.equal(closing.openDirectionId, null);

  const claim = actClosing.truth.toLowerCase();
  assert.ok(claim.includes("nothing has been sent"));
  const surface = `${actClosing.headline} ${actClosing.handoff} ${actClosing.truth}`.toLowerCase();
  for (const lie of [
    "your request has been sent",
    "we have received",
    "thank you for your submission",
    "successfully submitted",
    "we will contact you",
  ]) {
    assert.ok(!surface.includes(lie), `closing state must not claim "${lie}"`);
  }

  // And it is reversible: the last screen of the brochure is not a dead end.
  const back = actViewReducer(closing, { type: "BACK_TO_DIRECTIONS" });
  assert.equal(back.closing, false);
});

/* ------------------------------------------------------------------ 9 */
test("proof stays permission-gated: only approved proof opens a customer-facing action", () => {
  // Two published cases are approved for Retail (product lead, 2026-09-28), so
  // the gated "See it in practice" direction may now be offered — and only
  // because of them.
  const proof = getActProof("retail", "presentation");
  assert.deepEqual(proof.usable.map((asset) => asset.id).sort(), ["CASE-RET-01", "CASE-RET-02"]);
  for (const asset of proof.usable) {
    assert.equal(asset.externalUseApproved, true);
    assert.equal(asset.status, "available");
  }
  assert.deepEqual([...proof.internal], []);
  assert.equal(proof.internalStatusNote, null);

  const salesProof = getActProof("retail", "sales");
  assert.ok(salesProof.internal.length > 0, "the presenter still sees the internal slots");
  assert.equal(salesProof.internalStatusNote, null);

  const gated = directions.filter((direction) => direction.requiresApprovedProof);
  assert.equal(gated.length, 1);

  // Presentation Mode: the gated direction is offered, and says nothing about
  // proof that is missing.
  const presenting = getOfferableActDirections("retail", "presentation");
  const presentedGate = presenting.find((item) => item.direction.requiresApprovedProof);
  assert.ok(presentedGate, "approved proof exists, so the gated direction is offered");
  assert.equal(presentedGate.hasApprovedProof, true);
  assert.equal(presentedGate.internalStatusNote, null);
  const presentingSurface = leaves(presenting)
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();
  assert.ok(!presentingSurface.includes("coming soon"));
  assert.ok(!presentingSurface.includes("no approved"));

  // Sales Mode: every direction is offered, with its true internal status.
  const sales = getOfferableActDirections("retail", "sales");
  assert.equal(sales.length, directions.length);
  const gatedView = sales.find((item) => item.direction.requiresApprovedProof);
  assert.equal(gatedView.internalStatusNote, null);
  assert.equal(gatedView.hasApprovedProof, true);
});

/* ----------------------------------------------------------------- 10 */
test("a paragraph opened in Sales Mode cannot survive into Presentation Mode", () => {
  const gated = directions.find((direction) => direction.requiresApprovedProof);
  const opened = actViewReducer(initialActViewState, {
    type: "TOGGLE_DIRECTION",
    directionId: gated.id,
  });
  assert.equal(opened.openDirectionId, gated.id);

  const offerableInSales = new Set(
    getOfferableActDirections("retail", "sales").map((item) => item.direction.id),
  );
  // Retail now has approved proof, so the gated direction is offered in both
  // modes. The mechanism is what this test holds: whenever a direction is not
  // offerable to the audience — as the gated one is without approved proof —
  // an open paragraph must not survive the switch.
  const offerableInPresentation = new Set(
    getOfferableActDirections("retail", "presentation")
      .filter((item) => !item.direction.requiresApprovedProof)
      .map((item) => item.direction.id),
  );

  assert.equal(
    resolveVisibleActDirection(opened, (id) => offerableInSales.has(id)),
    gated.id,
  );
  assert.equal(
    resolveVisibleActDirection(opened, (id) => offerableInPresentation.has(id)),
    null,
  );
  // The view state itself is untouched, so leaving Presentation Mode puts the
  // presenter back exactly where they were.
  assert.equal(opened.openDirectionId, gated.id);
});

/* ----------------------------------------------------------------- 11 */
test("Presentation Mode hides Act's internal states", () => {
  // Everything a prospect must not see is resolved by audience in the runtime,
  // not by CSS: the values simply are not produced.
  const presenting = getOfferableActDirections("retail", "presentation");
  for (const item of presenting) {
    assert.equal(item.internalStatusNote, null);
  }
  // An approved case reaches the view as a typed record; its id, source note
  // and capability ids are identifiers, never rendered. What a prospect can
  // read of it is its prospect-facing text, and that is what is scanned.
  const readable = getActProof("retail", "presentation").usable.map((asset) => [
    asset.title,
    asset.customerName,
    asset.challenge,
    asset.measurementApproach,
    asset.customerLearning,
    asset.truthBoundary,
    asset.media?.publishedTitle,
  ]);
  const surface = leaves([presenting, readable])
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();
  for (const internalTerm of [
    "placeholder",
    "source mapping",
    "readiness",
    "requires_validation",
    "approval_required",
    "case-ret",
    "tech-0",
    "impl-",
  ]) {
    assert.ok(!surface.includes(internalTerm), `Presentation Mode leaked "${internalTerm}"`);
  }
});

/* ----------------------------------------------------------------- 12 */
test("Act closes the journey without opening a lead form or a handoff", () => {
  const surface = leaves([directions, actClosing, actConvergence])
    .filter((value) => typeof value === "string")
    .join(" \n ")
    .toLowerCase();
  for (const token of [
    "your name",
    "email address",
    "phone number",
    "book a meeting",
    "schedule a call",
    "fill in",
    "sign up",
    "odoo",
    "sharepoint",
    "crm",
    "client room",
  ]) {
    assert.ok(!surface.includes(token), `Act must not offer "${token}"`);
  }
});

/* ----------------------------------------------------------------- 13 */
test("Configure -> Act -> Configure preserves the journey context", () => {
  // Stage movement keeps every session decision the prospect has made.
  const journeyState = { ...initialState, screen: "journey", stageIndex: 4 };
  const onAct = experienceReducer(journeyState, { type: "SET_STAGE", stageIndex: 5 });
  assert.equal(onAct.stageIndex, 5);
  assert.deepEqual(onAct.selectedChallenges, journeyState.selectedChallenges);
  assert.deepEqual(onAct.activeLenses, journeyState.activeLenses);
  assert.equal(onAct.discoveryQuestionId, journeyState.discoveryQuestionId);
  assert.equal(onAct.accountId, journeyState.accountId);

  const backOnConfigure = experienceReducer(onAct, { type: "SET_STAGE", stageIndex: 4 });
  assert.equal(backOnConfigure.stageIndex, 4);
  assert.deepEqual(backOnConfigure.selectedChallenges, journeyState.selectedChallenges);
  assert.deepEqual(backOnConfigure.activeLenses, journeyState.activeLenses);

  // Act is a synthesis stage with no scene, so arriving there restores the
  // presenter's own lens state rather than applying a scene default.
  const restored = experienceReducer(
    { ...onAct, lensRestore: ["mobile-geo", "physical"], activeLenses: ["physical", "business"] },
    { type: "ENTER_SCENE", sceneId: null },
  );
  assert.deepEqual(restored.activeLenses, ["mobile-geo", "physical"]);
  assert.equal(restored.lensRestore, null);
});

/* ----------------------------------------------------------------- 14 */
test("stepping from Configure to Act and back does not reset the open direction", () => {
  // Configure's view state is owned by the journey shell, not by the Configure
  // component, precisely so that a round trip through Act survives. The reducer
  // is what that guarantee is testable against: nothing in it is stage-aware,
  // so no stage change can clear it.
  const opened = configureViewReducer(initialConfigureViewState, {
    type: "OPEN_DIRECTION",
    directionId: "solution-capture-and-visits",
  });
  const withDepth = configureViewReducer(opened, {
    type: "TOGGLE_DEPTH",
    depthId: "how-we-do-this",
  });

  // Anything that is not an explicit close leaves it exactly as it was.
  const unchanged = configureViewReducer(withDepth, { type: "UNKNOWN_TO_THIS_REDUCER" });
  assert.deepEqual(unchanged, withDepth);
  assert.equal(unchanged.openDirectionId, "solution-capture-and-visits");
  assert.equal(unchanged.openDepthId, "how-we-do-this");
});

/* ----------------------------------------------------------------- 15 */
test("Act's own layers unwind one at a time, and nothing is lost by looking", () => {
  const first = directions[0].id;
  const second = directions[1].id;

  const opened = actViewReducer(initialActViewState, {
    type: "TOGGLE_DIRECTION",
    directionId: first,
  });
  assert.equal(opened.openDirectionId, first);

  // At most one paragraph at a time.
  const switched = actViewReducer(opened, {
    type: "TOGGLE_DIRECTION",
    directionId: second,
  });
  assert.equal(switched.openDirectionId, second);

  // Toggling the same one closes it.
  assert.equal(
    actViewReducer(switched, { type: "TOGGLE_DIRECTION", directionId: second })
      .openDirectionId,
    null,
  );

  // Escape peels exactly one layer.
  const closing = actViewReducer(opened, { type: "CONTINUE_CONVERSATION" });
  const afterFirstDismiss = actViewReducer(closing, { type: "DISMISS" });
  assert.equal(afterFirstDismiss.closing, false);
  const afterSecondDismiss = actViewReducer(
    actViewReducer(opened, { type: "DISMISS" }),
    { type: "DISMISS" },
  );
  assert.deepEqual(afterSecondDismiss, initialActViewState);
});

/* ----------------------------------------------------------------- 16 */
test("Act offers a small number of conversations, each honest about its boundary", () => {
  assert.ok(directions.length >= 3 && directions.length <= 4);
  for (const direction of directions) {
    assert.equal(direction.segment, "retail");
    assert.ok(direction.boundaryNote.length > 0);
    assert.ok(direction.detail.length > 0 && direction.detail.length <= 3);
    assert.ok(direction.sourceRefs.length > 0);
    assert.equal(getActDirection(direction.id), direction);
  }
  // The recap follows the journey the prospect actually walked.
  assert.deepEqual(
    actRecapBeats.map((beat) => beat.territory),
    ["outside", "entrance", "inside", "performance"],
  );
});
