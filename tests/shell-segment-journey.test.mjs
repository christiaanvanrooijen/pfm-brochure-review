import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getScenesForStage, getCanonicalJourneyStages } from "../app/content/runtime.ts";
import {
  getSegmentJourney,
  shellJourneys,
  shellCanRunSegment,
  shellRunsSegment,
} from "../app/lib/segment-journey.ts";
import { experienceReducer, initialState } from "../app/lib/session.ts";
import { initialConfigureViewState } from "../app/lib/configure-view.ts";
import { getActDirectionsForSegment } from "../app/content/act-runtime.ts";

const read = (relative) => readFileSync(fileURLToPath(new URL(`../${relative}`, import.meta.url)), "utf8");
const shell = () => read("app/components/CommercialExperience.tsx");

test("1. the shell resolves Retail's own scenes", () => {
  assert.deepEqual(
    getScenesForStage("retail", "measure").map((scene) => scene.id),
    ["retail-store-visits", "retail-visitor-composition"],
  );
  const journey = getSegmentJourney("retail");
  assert.equal(journey.configureVariant, "retail");
  assert.equal(journey.configureHandsOnToAct, true);
});

test("2. the shell resolves Shopping Centre's own scenes", () => {
  // The registry imports .tsx components, which Node cannot load here, so this
  // reads its source. The guarantee is the same: every scene on the typed Core
  // route has a component, and the registry holds nothing that is not on it.
  const registry = read("app/components/shopping-centre-scenes.ts");
  const registered = [...registry.matchAll(/^  "(shopping-centre-[a-z-]+)":/gm)].map((m) => m[1]);
  const route = getSegment("shopping-centre").coreRoute;

  for (const sceneId of route) {
    assert.ok(registered.includes(sceneId), `${sceneId} has no component in the registry`);
  }
  for (const sceneId of registered) {
    assert.ok(route.includes(sceneId), `${sceneId} is registered but not on the Core route`);
  }
  assert.equal(registered.length, route.length);
});

test("3/4/5. Configure resolves the segment's own wrapper, and only that one", () => {
  assert.equal(getSegmentJourney("shopping-centre").configureVariant, "shopping-centre");
  assert.equal(getSegmentJourney("retail").configureVariant, "retail");

  const source = shell();
  // Both wrappers are imported, and the choice is made from the journey config
  // rather than by testing a segment id at the render site.
  assert.match(source, /<RetailConfigureScene/);
  assert.match(source, /<ShoppingCentreConfigureScene/);
  assert.match(source, /journey\.configureVariant === "shopping-centre"/);
  // The Shopping Centre branch is the guarded one, so Retail remains the default
  // path exactly as before.
  const centreIndex = source.indexOf("<ShoppingCentreConfigureScene");
  const retailIndex = source.indexOf("<RetailConfigureScene");
  assert.ok(centreIndex < retailIndex, "the centre branch is the conditional arm");
});

test("6/7/8. the Core route is 8 scenes, ends at Time in centre, and excludes Configure", () => {
  const segment = getSegment("shopping-centre");
  assert.equal(segment.coreRoute.length, 8);
  assert.equal(segment.coreRoute[7], "shopping-centre-time-in-centre");

  // Configure is a stage, not a scene: it may not appear on the route, and no
  // scene may claim it as a next scene.
  assert.ok(!segment.coreRoute.some((id) => id.includes("configure")));
  assert.deepEqual(segment.stageMapping.configure, []);
  const last = segment.scenes.find((scene) => scene.id === "shopping-centre-time-in-centre");
  assert.equal(last.nextSceneId, undefined, "Time in centre types no next scene");
  assert.equal(last.nextCta, "Configure solution");
});

test("9. an empty Prove stage is a marker, not a step", () => {
  const segment = getSegment("shopping-centre");
  assert.deepEqual(segment.stageMapping.prove, []);

  const journey = getSegmentJourney("shopping-centre");
  // The rail still shows all six canonical stages...
  assert.equal(getCanonicalJourneyStages().length, 6);
  // ...but Prove is not a place a presenter can stand: this segment has no Prove
  // content, so it stays a marker. Act became navigable once the segment had one.
  assert.ok(!journey.navigableStages.includes("prove"));
  assert.ok(journey.navigableStages.includes("act"));
  assert.deepEqual(journey.navigableStages, [
    "context", "measure", "understand", "configure", "act",
  ]);

  // Retail keeps all six.
  assert.deepEqual(getSegmentJourney("retail").navigableStages, [
    "context", "measure", "understand", "prove", "configure", "act",
  ]);

  assert.match(shell(), /journey\.navigableStages\.includes\(item\.id\)/);
});

test("10. Retail's stage labels are unchanged", () => {
  assert.deepEqual(getSegmentJourney("retail").stageDescriptors, {
    context: "Outside",
    measure: "Entrance",
    understand: "Inside",
    prove: "Performance",
    configure: "Solution",
    act: "Next step",
  });
});

test("11. Shopping Centre's stage labels are truthful for a centre", () => {
  const descriptors = getSegmentJourney("shopping-centre").stageDescriptors;
  // "Inside" is a store's word for its own floor; this stage covers a whole
  // asset. "Performance" names a territory this segment does not have.
  assert.equal(descriptors.understand, "Centre");
  assert.equal(descriptors.prove, "Evidence");
  assert.ok(!Object.values(descriptors).includes("Performance"));
  assert.ok(!Object.values(descriptors).includes("Inside"));
});

test("12. the Retail journey behaves exactly as before", () => {
  // Retail is the default segment and nothing about switching is required to
  // reach it.
  assert.equal(initialState.segmentId, "retail");

  // Configure -> Act -> Configure keeps its place, which is why the view state
  // lives in the shell rather than in the Configure scene.
  const opened = experienceReducer(initialState, { type: "SET_STAGE", stageIndex: 4 });
  const act = experienceReducer(opened, { type: "SET_STAGE", stageIndex: 5 });
  const back = experienceReducer(act, { type: "SET_STAGE", stageIndex: 4 });
  assert.equal(back.stageIndex, 4);
  assert.equal(back.segmentId, "retail");
});

test("13. switching segment restarts the journey without a fake scene id", () => {
  const centre = experienceReducer(initialState, {
    type: "SET_SEGMENT",
    segmentId: "shopping-centre",
  });
  assert.equal(centre.segmentId, "shopping-centre");
  assert.equal(centre.stageIndex, 0, "a new journey starts at its first stage");
  assert.equal(centre.lensRestore, null);

  // Configure opens with nothing selected, and no scene id is invented for it.
  assert.equal(initialConfigureViewState.openDirectionId, null);
  assert.match(shell(), /configureDispatch\(\{ type: "CLOSE_DIRECTION" \}\)/);
});

test("14. no recommendation state is introduced anywhere in the shell", () => {
  const source = shell();
  for (const forbidden of [/recommendedSegment/, /selectedDirection/, /\bscore\b/, /\branking\b/]) {
    assert.doesNotMatch(source, forbidden);
  }
  for (const key of ["rank", "score", "recommended", "selectedTerritory"]) {
    assert.ok(!(key in initialState), `ExperienceState must not carry ${key}`);
  }
});

test("15. Configure hands on to Act, now that both segments have one", () => {
  // Both hand on. The flag stays because it is what withheld the control while
  // this segment's Act did not exist, and the next segment built will need it.
  assert.equal(getSegmentJourney("shopping-centre").configureHandsOnToAct, true);
  assert.equal(getSegmentJourney("retail").configureHandsOnToAct, true);

  // The withheld state remains implemented and reachable for a segment that
  // sets the flag false — it is not deleted just because nobody uses it today.
  const layout = read("app/components/ConfigureSceneLayout.tsx");
  assert.match(layout, /showNextStage = true/, "the default keeps Retail's behaviour");
  assert.match(layout, /This is as far as the centre journey goes today/);
  assert.match(shell(), /showNextStage=\{journey\.configureHandsOnToAct\}/);
});

test("the shell can run exactly the segments it declares", () => {
  assert.deepEqual(shellJourneys.map((journey) => journey.segmentId), [
    "retail",
    "shopping-centre",
  ]);
  assert.ok(shellCanRunSegment("retail"));
  assert.ok(shellCanRunSegment("shopping-centre"));
  assert.ok(!shellCanRunSegment("retail-park"));
  assert.ok(!shellCanRunSegment("qsr"));

  // Shopping Centre stays architecture_only: the shell being able to run a
  // journey is a smaller fact than the segment being a complete demo vertical,
  // and only the second is a claim to a prospect.
  assert.equal(getSegment("shopping-centre").implementationStatus, "architecture_only");
  assert.equal(getSegment("retail").implementationStatus, "implementation_ready");
  /* The production gate itself moved into `shellRunsSegment`, so that the
     shell's navigation and the segment overview cannot answer it differently.
     The shell asks the rule; the rule is the one that knows about production. */
  assert.match(shell(), /shellRunsSegment\(segment\)/);
  assert.match(read("app/lib/segment-journey.ts"), /process\.env\.NODE_ENV !== "production"/);
  // And outside production it offers exactly the journeys the shell has.
  assert.ok(shellRunsSegment(getSegment("retail")));
  assert.ok(shellRunsSegment(getSegment("shopping-centre")));
  assert.ok(!shellRunsSegment(getSegment("retail-park")));
  assert.ok(!shellRunsSegment(getSegment("outlet-centre")));
  assert.ok(!shellRunsSegment(getSegment("qsr")));
});

/* ------------------------------------------- Act integration (final gate) --- */

test("16. Act resolves the segment's own wrapper, and never the other's", () => {
  assert.equal(getSegmentJourney("retail").actVariant, "retail");
  assert.equal(getSegmentJourney("shopping-centre").actVariant, "shopping-centre");

  const source = shell();
  assert.match(source, /<RetailActScene/);
  assert.match(source, /<ShoppingCentreActScene/);
  assert.match(source, /journey\.actVariant === "shopping-centre"/);

  // The Shopping Centre branch is the conditional arm, so Retail stays the
  // default path exactly as it was.
  assert.ok(
    source.indexOf("<ShoppingCentreActScene") < source.indexOf("<RetailActScene"),
  );

  // Both go through the shared frame; neither middle is merged into the other.
  assert.match(read("app/components/RetailActScene.tsx"), /<ActSceneLayout/);
  assert.match(read("app/components/ShoppingCentreActScene.tsx"), /<ActSceneLayout/);
  assert.ok(!read("app/components/ShoppingCentreActScene.tsx").includes("actRecapBeats"));
  assert.ok(!read("app/components/RetailActScene.tsx").includes("shoppingCentreActBeats"));
});

test("17. Shopping Centre runs Core -> Configure -> Act, with Act outside the route", () => {
  const journeyStages = getCanonicalJourneyStages();
  const configureIndex = journeyStages.indexOf("configure");
  const actIndex = journeyStages.indexOf("act");
  assert.equal(actIndex, configureIndex + 1, "Act follows Configure");

  const segment = getSegment("shopping-centre");
  assert.equal(segment.coreRoute.length, 8);
  assert.ok(!segment.coreRoute.includes("act"));
  assert.deepEqual(segment.stageMapping.act, []);
  assert.deepEqual(segment.stageMapping.prove, []);

  // Configure's step-on control is available again, so the temporary terminal
  // line is no longer reached for this segment.
  assert.equal(getSegmentJourney("shopping-centre").configureHandsOnToAct, true);
});

test("18. Act opens neutral — no Configure direction is carried into it", () => {
  const centreAct = shell().match(/<ShoppingCentreActScene[\s\S]*?\/>/)[0];
  for (const leak of ["configureView", "openDirectionId", "selected", "recommended"]) {
    assert.ok(!centreAct.includes(leak), `Act must not receive ${leak}`);
  }
  // Act state is owned by each Act scene, so moving between segments cannot
  // carry a closing state across: the components are different types.
  assert.match(read("app/components/ShoppingCentreActScene.tsx"), /useReducer\(actViewReducer, initialActViewState\)/);
  assert.equal(initialConfigureViewState.openDirectionId, null);
});

test("19. no Retail Act content or proof can reach Shopping Centre", () => {
  // Comments stripped: this file documents the Retail concepts it deliberately
  // does NOT use, and that explanation is not a leak.
  const centre = read("app/components/ShoppingCentreActScene.tsx")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
  for (const token of [
    "Where could we start?",
    "Your next question",
    "locations",
    "retailActDirections",
    "act-see-it-in-practice",
    "requiresApprovedProof",
  ]) {
    assert.ok(!centre.includes(token), `Shopping Centre Act must not carry ${token}`);
  }
  assert.equal(getActDirectionsForSegment("shopping-centre").length, 0);
  assert.equal(getActDirectionsForSegment("retail").length, 3);
});

test("20. the rail follows the active stage, and Prove stays inert", () => {
  const source = shell();
  // Rail entries navigate only where the segment declares a stage navigable.
  assert.match(source, /journey\.navigableStages\.includes\(item\.id\)/);
  assert.match(source, /if \(navigable\) goToStage\(index\);/);
  // Core stage navigation lands on that stage's first Core scene.
  assert.match(source, /centreCoreRoute\.findIndex\(/);
  // Advancing a scene carries the rail with it.
  assert.match(source, /const goToCentreScene = \(index: number\)/);

  const journey = getSegmentJourney("shopping-centre");
  assert.ok(!journey.navigableStages.includes("prove"));
  assert.ok(journey.navigableStages.includes("act"));
});

test("21. switching segment resets segment-scoped view state", () => {
  const centre = experienceReducer(initialState, {
    type: "SET_SEGMENT",
    segmentId: "shopping-centre",
  });
  assert.equal(centre.stageIndex, 0);
  assert.equal(centre.lensRestore, null);
  assert.deepEqual(centre.activeLenses, initialState.activeLenses);

  const back = experienceReducer(centre, { type: "SET_SEGMENT", segmentId: "retail" });
  assert.equal(back.segmentId, "retail");
  assert.equal(back.stageIndex, 0);

  // Configure's open direction is closed on the way out, because its ids are
  // segment-scoped.
  assert.match(shell(), /configureDispatch\(\{ type: "CLOSE_DIRECTION" \}\)/);
});

test("22. running a journey is not the same as declaring the segment ready", () => {
  // The shell can now run Shopping Centre end to end. That is a smaller fact
  // than `implementation_ready`, which is a product claim about a complete demo
  // vertical, and it has NOT been flipped.
  assert.equal(getSegment("shopping-centre").implementationStatus, "architecture_only");
  assert.equal(getSegment("retail").implementationStatus, "implementation_ready");
  /* The production gate itself moved into `shellRunsSegment`, so that the
     shell's navigation and the segment overview cannot answer it differently.
     The shell asks the rule; the rule is the one that knows about production. */
  assert.match(shell(), /shellRunsSegment\(segment\)/);
  assert.match(read("app/lib/segment-journey.ts"), /process\.env\.NODE_ENV !== "production"/);
  // And outside production it offers exactly the journeys the shell has.
  assert.ok(shellRunsSegment(getSegment("retail")));
  assert.ok(shellRunsSegment(getSegment("shopping-centre")));
  assert.ok(!shellRunsSegment(getSegment("retail-park")));
  assert.ok(!shellRunsSegment(getSegment("outlet-centre")));
  assert.ok(!shellRunsSegment(getSegment("qsr")));
});
