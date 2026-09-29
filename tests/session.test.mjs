import assert from "node:assert/strict";
import test from "node:test";

import { accounts, capabilities, lenses, retailStory, stages } from "../app/lib/fixtures.ts";
import {
  createQuotePayload,
  experienceReducer,
  getSceneLensDefaults,
  initialState,
  sceneLensDefaults,
} from "../app/lib/session.ts";

test("the shared journey contains the six required stages in order", () => {
  assert.deepEqual(
    stages.map((stage) => stage.label),
    ["Context", "Measure", "Understand", "Prove", "Configure", "Act"],
  );
});

test("Sales Mode starts with the fictional Northstar opportunity and opens discovery", () => {
  const started = experienceReducer(initialState, { type: "START" });

  assert.equal(started.screen, "discovery");
  assert.equal(started.accountId, accounts[0].id);
  const journey = experienceReducer(started, { type: "EXPLORE" });
  assert.equal(journey.screen, "journey");
});

test("discovery keeps one question selected and carries its evidence thread", () => {
  const selected = experienceReducer(initialState, {
    type: "SET_DISCOVERY_QUESTION",
    questionId: "location-attention",
  });

  assert.equal(selected.discoveryQuestionId, "location-attention");
  assert.deepEqual(selected.selectedChallenges, ["compare-location-performance"]);
});

test("the derived lens stays off until physical and business layers are active", () => {
  const blocked = experienceReducer(initialState, { type: "TOGGLE_LENS", lensId: "derived" });
  assert.ok(!blocked.activeLenses.includes("derived"));

  const withBusiness = experienceReducer(initialState, { type: "TOGGLE_LENS", lensId: "business" });
  const withDerived = experienceReducer(withBusiness, { type: "TOGGLE_LENS", lensId: "derived" });
  assert.ok(withDerived.activeLenses.includes("derived"));

  const withoutPhysical = experienceReducer(withDerived, { type: "TOGGLE_LENS", lensId: "physical" });
  assert.ok(!withoutPhysical.activeLenses.includes("physical"));
  assert.ok(!withoutPhysical.activeLenses.includes("derived"));
});

test("lens toggles preserve the four distinct data roles", () => {
  const withoutGeo = experienceReducer(initialState, {
    type: "TOGGLE_LENS",
    lensId: "mobile-geo",
  });
  const restored = experienceReducer(withoutGeo, {
    type: "TOGGLE_LENS",
    lensId: "mobile-geo",
  });

  assert.equal(lenses.length, 4);
  assert.ok(!withoutGeo.activeLenses.includes("mobile-geo"));
  assert.deepEqual(
    [...restored.activeLenses].sort(),
    [...initialState.activeLenses].sort(),
  );
});

test("navigation clamps to the six-stage journey", () => {
  const atEnd = experienceReducer(initialState, {
    type: "SET_STAGE",
    stageIndex: 99,
  });
  assert.equal(atEnd.stageIndex, stages.length - 1);
  assert.equal(atEnd.screen, "entry");
});

test("fixture ideas retain source references", () => {
  for (const item of [...stages, ...lenses, ...accounts, retailStory, ...retailStory.periods]) {
    assert.ok(item.source.sourceId);
    assert.ok(item.source.locator);
    assert.equal(item.source.evidence, "direct");
  }
});

test("illustrative capture is manually verifiable from the aligned afternoon values", () => {
  const afternoon = retailStory.periods.find((period) => period.id === "afternoon");
  assert.ok(afternoon);
  const capture = (afternoon.visits.value / afternoon.passingAudience.value) * 100;
  assert.equal(capture.toFixed(1), "16.0");
  assert.match(retailStory.periodDefinition, /same frontage and definitions/);
});

test("anonymous crossing simulation changes only the illustrative measured visit count", () => {
  const next = experienceReducer(initialState, { type: "SIMULATE_CROSSING" });
  assert.equal(next.measuredVisits, initialState.measuredVisits + 1);
  assert.equal(next.activeLenses.includes("derived"), false);
});

test("measure overlays stay isolated from configured state and quote payload", () => {
  const beforePayload = createQuotePayload(initialState);
  const next = experienceReducer(initialState, {
    type: "TOGGLE_MEASURE_OVERLAY",
    overlayId: "visitor-classification",
  });

  assert.deepEqual(next.measureOverlays, ["visitor-classification"]);
  assert.deepEqual(next.configuredCapabilities, initialState.configuredCapabilities);
  assert.equal(next.measuredVisits, initialState.measuredVisits);
  assert.deepEqual(next.activeLenses, initialState.activeLenses);
  assert.deepEqual(createQuotePayload(next), beforePayload);

  const toggledOff = experienceReducer(next, {
    type: "TOGGLE_MEASURE_OVERLAY",
    overlayId: "visitor-classification",
  });
  assert.deepEqual(toggledOff.measureOverlays, []);
});

test("configured capabilities retain the selected_capabilities quote contract", () => {
  const next = experienceReducer(initialState, {
    type: "TOGGLE_CAPABILITY",
    capabilityId: "portfolio-comparison",
  });

  assert.ok(next.configuredCapabilities.includes("portfolio-comparison"));
  assert.deepEqual(
    createQuotePayload(next).selected_capabilities,
    next.configuredCapabilities,
  );
});

test("restart resets temporary measure overlays without changing quote semantics", () => {
  const withOverlay = experienceReducer(initialState, {
    type: "TOGGLE_MEASURE_OVERLAY",
    overlayId: "anonymous-journey-continuity",
  });
  const restarted = experienceReducer(withOverlay, { type: "RESTART" });

  assert.deepEqual(restarted.measureOverlays, []);
  assert.deepEqual(restarted.configuredCapabilities, initialState.configuredCapabilities);
  assert.deepEqual(createQuotePayload(restarted), createQuotePayload(initialState));
});

// --- Scene-specific opening lens state -------------------------------------

test("the global opening lens state is unchanged by any scene-specific default", () => {
  // Regression guard. Conversion & sales context needs Business switched on and
  // Mobile & geo switched off, but it must get that from a scene-scoped
  // mechanism — never by editing the global default, which is what every other
  // scene (including the four approved Retail scenes) opens with.
  assert.deepEqual(initialState.activeLenses, ["mobile-geo", "physical"]);
  assert.equal(initialState.lensRestore, null);
});

test("only Conversion & sales context declares an opening lens state", () => {
  assert.deepEqual(Object.keys(sceneLensDefaults), ["retail-conversion-sales-context"]);

  // The four human-approved Retail scenes declare nothing, so they keep
  // whatever lens state the presenter is already in.
  for (const sceneId of [
    "retail-store-visits",
    "retail-visitor-composition",
    "retail-in-store-journey",
    "retail-zone-engagement",
  ]) {
    assert.equal(getSceneLensDefaults(sceneId), null, `${sceneId} must declare no lens default`);
  }
  assert.equal(getSceneLensDefaults(null), null);
});

test("entering Conversion & sales context opens Physical + Business with Mobile & geo off", () => {
  // Insight is not in this list by design: it has no presenter toggle
  // (`lensId: null` in the lens rail) and `lensesToRoles` always queries it, so
  // Physical + Business here means Physical ON, Business ON, Insight ON,
  // Mobile & geo OFF on screen — the declared opening state for this scene.
  const entered = experienceReducer(initialState, {
    type: "ENTER_SCENE",
    sceneId: "retail-conversion-sales-context",
  });

  assert.deepEqual([...entered.activeLenses].sort(), ["business", "physical"]);
  assert.ok(!entered.activeLenses.includes("mobile-geo"));
  assert.deepEqual(entered.lensRestore, initialState.activeLenses);
});

test("the scene-specific lens default does not leak into any other scene", () => {
  const entered = experienceReducer(initialState, {
    type: "ENTER_SCENE",
    sceneId: "retail-conversion-sales-context",
  });

  // Leaving for a scene that declares nothing hands back exactly the lens
  // state the presenter arrived with, and clears the restore slot.
  for (const sceneId of [
    "retail-store-visits",
    "retail-visitor-composition",
    "retail-in-store-journey",
    "retail-zone-engagement",
    null,
  ]) {
    const left = experienceReducer(entered, { type: "ENTER_SCENE", sceneId });
    assert.deepEqual(
      left.activeLenses,
      initialState.activeLenses,
      `leaving for ${sceneId} must restore the presenter's lens state`,
    );
    assert.equal(left.lensRestore, null);
  }
});

test("re-entering the same scene is idempotent and never overwrites the restore state", () => {
  // The scene-entry effect can fire more than once for the same scene. The
  // recorded restore state must survive that, or leaving would hand back the
  // scene's own defaults instead of the presenter's real lens state.
  const once = experienceReducer(initialState, {
    type: "ENTER_SCENE",
    sceneId: "retail-conversion-sales-context",
  });
  const twice = experienceReducer(once, {
    type: "ENTER_SCENE",
    sceneId: "retail-conversion-sales-context",
  });

  assert.deepEqual(twice.activeLenses, once.activeLenses);
  assert.deepEqual(twice.lensRestore, initialState.activeLenses);

  const left = experienceReducer(twice, { type: "ENTER_SCENE", sceneId: null });
  assert.deepEqual(left.activeLenses, initialState.activeLenses);
});

test("scene entry changes lenses only, and never the quote payload", () => {
  const entered = experienceReducer(initialState, {
    type: "ENTER_SCENE",
    sceneId: "retail-conversion-sales-context",
  });

  assert.equal(entered.stageIndex, initialState.stageIndex);
  assert.deepEqual(entered.configuredCapabilities, initialState.configuredCapabilities);
  assert.deepEqual(entered.measureOverlays, initialState.measureOverlays);
  assert.equal(entered.measuredVisits, initialState.measuredVisits);

  // selected_layers is the one contract field that legitimately follows the
  // lens state; nothing else in the payload may move.
  const before = createQuotePayload(initialState);
  const after = createQuotePayload(entered);
  assert.deepEqual({ ...after, selected_layers: null }, { ...before, selected_layers: null });
});

test("optional entrance capability fixtures preserve privacy wording", () => {
  const classification = capabilities.find((capability) => capability.id === "visitor-classification");
  const continuity = capabilities.find((capability) => capability.id === "anonymous-journey-continuity");

  assert.ok(classification);
  assert.match(classification.description, /Adults \/ children/);
  assert.match(classification.description, /Estimated age bands/);
  assert.match(classification.description, /Estimated gender classification/);
  assert.ok(continuity);
  assert.match(continuity.label, /Anonymous journey continuity/);
  assert.match(continuity.description, /not named identity or facial identification/);
});
