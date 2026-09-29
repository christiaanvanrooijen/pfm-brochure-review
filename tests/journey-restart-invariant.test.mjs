/**
 * The journey-restart invariant.
 *
 * CONFIRMED DEFECT, 5 September 2026, reproduced in a live walkthrough:
 *
 *   Shopping Centre → advance to Internal circulation → switch to Retail →
 *   return to Shopping Centre.
 *
 * The page showed Internal circulation, the stage rail said Context, and the
 * next action was "Explore zone & anchor exposure" — three different answers to
 * "where am I". Retail had a quieter version of the same fault: after switching
 * away and back, entering Measure resumed at its SECOND scene.
 *
 * ROOT CAUSE
 *
 * Navigation state is split. `session.ts` owns `stageIndex`; the shell owns the
 * per-route scene positions (Retail's Measure and Understand indices, Shopping
 * Centre's `coreRoute` index). `SET_SEGMENT` and `RESTART` reset the reducer's
 * half and left the shell's half behind.
 *
 * THE FIX THIS TEST PINS
 *
 * `journeyEpoch` is bumped by every action that restarts a journey. The shell
 * stamps its three positions with it and treats a stale stamp as "start", so
 * the reset is derived rather than synchronised. These tests hold the reducer
 * half; the source assertions hold the wiring, because the component half is
 * React state that this suite cannot render.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { experienceReducer, initialState } from "../app/lib/session.ts";

const shell = () =>
  readFileSync(
    fileURLToPath(new URL("../app/components/CommercialExperience.tsx", import.meta.url)),
    "utf8",
  );

test("switching segment restarts the journey and bumps the epoch", () => {
  const mid = { ...initialState, segmentId: "shopping-centre", stageIndex: 2 };
  const next = experienceReducer(mid, { type: "SET_SEGMENT", segmentId: "retail" });

  assert.equal(next.segmentId, "retail");
  assert.equal(next.stageIndex, 0);
  assert.equal(
    next.journeyEpoch,
    mid.journeyEpoch + 1,
    "a segment switch must change the epoch, or the shell keeps the old scene positions",
  );
});

test("restart bumps the epoch too, and never returns it to a value already seen", () => {
  const mid = { ...initialState, segmentId: "shopping-centre", stageIndex: 3, journeyEpoch: 4 };
  const next = experienceReducer(mid, { type: "RESTART" });

  // Everything else goes back to the initial state...
  assert.equal(next.segmentId, initialState.segmentId);
  assert.equal(next.stageIndex, 0);
  assert.equal(next.screen, initialState.screen);
  // ...but the epoch keeps climbing. Resetting it to initialState's 0 would be
  // a no-op for any shell already stamped 0, which is the common case: Restart
  // pressed during the very first journey.
  assert.equal(next.journeyEpoch, 5);
  assert.notEqual(next.journeyEpoch, initialState.journeyEpoch);
});

test("every consecutive restart is observable as a change", () => {
  let state = initialState;
  const seen = new Set([state.journeyEpoch]);
  for (const action of [
    { type: "SET_SEGMENT", segmentId: "shopping-centre" },
    { type: "RESTART" },
    { type: "SET_SEGMENT", segmentId: "shopping-centre" },
    { type: "SET_SEGMENT", segmentId: "retail" },
    { type: "RESTART" },
  ]) {
    const next = experienceReducer(state, action);
    assert.ok(!seen.has(next.journeyEpoch), `${action.type} reused epoch ${next.journeyEpoch}`);
    seen.add(next.journeyEpoch);
    state = next;
  }
});

test("actions that are not a journey restart leave the epoch alone", () => {
  const base = { ...initialState, journeyEpoch: 7 };
  for (const action of [
    { type: "SET_STAGE", stageIndex: 2 },
    { type: "TOGGLE_PRESENTATION_MODE" },
    { type: "SET_CASE_VIEW", view: "question" },
  ]) {
    assert.equal(
      experienceReducer(base, action).journeyEpoch,
      7,
      `${action.type} must not reset the shell's scene positions`,
    );
  }
});

test("the shell derives all three scene positions from the epoch", () => {
  const source = shell();

  // One stamped value, not three independent useStates — which is what made the
  // old reset something a call site had to remember.
  assert.match(source, /storedScenePositions/);
  assert.match(source, /epoch === state\.journeyEpoch/);
  assert.match(source, /\{ epoch: state\.journeyEpoch, measure: 0, understand: 0, centre: 0 \}/);

  for (const name of ["measure", "understand", "centre"]) {
    assert.match(
      source,
      new RegExp(`scenePositions\\.${name}`),
      `the ${name} position must be read from the stamped value`,
    );
  }
  // The three separate useState hooks must be gone, or the invariant has two
  // sources of truth again.
  for (const gone of [
    /useState\(0\);\s*\n\s*const centreSceneId/,
    /const \[measureSceneIndex, setMeasureSceneIndex\] = useState/,
    /const \[understandSceneIndex, setUnderstandSceneIndex\] = useState/,
    /const \[centreSceneIndex, setCentreSceneIndex\] = useState/,
  ]) {
    assert.doesNotMatch(source, gone);
  }
});
