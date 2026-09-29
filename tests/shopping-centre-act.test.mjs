import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  shoppingCentreActBeats,
  shoppingCentreActBeatIds,
  shoppingCentreActClosing,
  shoppingCentreActConvergence,
  shoppingCentreActFooterNote,
} from "../app/content/act-shopping-centre.ts";
import { actRecapBeats, actConvergence, actClosing, retailActDirections, validateActDirections } from "../app/content/act-directions.ts";
import { getActSynthesis, getActDirectionsForSegment } from "../app/content/act-runtime.ts";
import { getSegment } from "../app/content/runtime.ts";

const read = (relative) => readFileSync(fileURLToPath(new URL(`../${relative}`, import.meta.url)), "utf8");

/* The surface on which Act makes an OFFER — the words that tell a reader what
   the evidence gives them. The unsupported-vocabulary ban belongs here.

   `cannotSupport` and the footer note are deliberately excluded and asserted
   separately below. Their entire job is to DENY, and the Leasing & mix denial
   has to name what it denies — "Tenant sales, turnover or spend". A ban applied
   across every field fails on the exact sentences that hold the boundary, which
   reports the safeguard rather than a breach. */
const prospectFacing = shoppingCentreActBeats
  .flatMap((beat) => [
    beat.title, beat.owner, beat.evidence, beat.supports,
    beat.investigation, beat.nextDecision,
  ])
  .concat([
    shoppingCentreActConvergence.label,
    shoppingCentreActConvergence.note,
    shoppingCentreActClosing.headline,
    shoppingCentreActClosing.handoff,
    shoppingCentreActClosing.truth,
    shoppingCentreActClosing.back,
    shoppingCentreActClosing.cta,
  ])
  .join(" | ");

/* Everything a reader sees, including the denials — for the bans that hold no
   matter who is speaking, such as identity. */
const everything = prospectFacing
  .concat(" | ", shoppingCentreActBeats.map((beat) => beat.cannotSupport).join(" | "))
  .concat(" | ", shoppingCentreActFooterNote);

test("the four approved beats exist, in the approved order", () => {
  assert.deepEqual([...shoppingCentreActBeatIds], [
    "sc-act-operating-rhythm",
    "sc-act-space-and-layout",
    "sc-act-leasing-and-mix",
    "sc-act-position-and-reach",
  ]);
  assert.deepEqual(
    shoppingCentreActBeats.map((beat) => beat.title),
    ["Operating rhythm", "Space & layout", "Leasing & mix", "Position & reach"],
  );
  // Four, not five: parking stays optional context inside operating rhythm.
  assert.equal(shoppingCentreActBeats.length, 4);
  assert.ok(!/\bparking beat\b/i.test(prospectFacing));
});

test("every beat names a human owner, its evidence, and both of its limits", () => {
  for (const beat of shoppingCentreActBeats) {
    assert.equal(beat.segment, "shopping-centre");
    for (const field of ["title", "owner", "evidence", "supports", "cannotSupport", "investigation", "nextDecision"]) {
      assert.ok(beat[field]?.length > 0, `${beat.id}: ${field} is empty`);
    }
    assert.ok(beat.relatedSceneIds.length > 0, `${beat.id}: names no Core evidence`);
    // The owner is someone in the centre's organisation, never PFM.
    assert.ok(!/\bPFM\b/.test(beat.owner));
    // A next decision is something to agree, not something concluded here.
    assert.match(beat.nextDecision, /^Agree /);
    // An investigation is a real question.
    assert.match(beat.investigation, /\?$/);
  }
});

test("every beat's evidence resolves to Shopping Centre Core scenes", () => {
  const core = new Set(getSegment("shopping-centre").coreRoute);
  const covered = new Set();
  for (const beat of shoppingCentreActBeats) {
    for (const sceneId of beat.relatedSceneIds) {
      assert.ok(core.has(sceneId), `${beat.id}: ${sceneId} is not a Core scene`);
      covered.add(sceneId);
    }
  }
  // Every Core scene reaches a decision.
  for (const sceneId of core) {
    assert.ok(covered.has(sceneId), `${sceneId} informs no Act beat`);
  }
});

test("Act decides nothing on the reader's behalf", () => {
  const synthesis = getActSynthesis("shopping-centre");
  assert.equal(synthesis.decisionOwner, "human");

  // The footer note is excluded from the ban below and asserted separately: its
  // whole job is to say the word it would otherwise be caught by.
  assert.match(shoppingCentreActFooterNote, /Nothing here is recommended, ranked or decided for you/);

  for (const forbidden of [
    /\brecommend(?:ed|s|ation)?\b/i, /\bbest\b/i, /\bhighest opportunity\b/i,
    /\bwinning\b/i, /\bunderperform/i, /\byou should\b/i, /\btherefore\b/i,
    /\broi\b/i, /\buplift\b/i, /\bpayback\b/i, /\bperformance score\b/i,
    /\bconversion\b/i, /\bturnover\b/i, /\bsales per\b/i, /\bspend\b/i,
    /\bloyalty\b/i, /\bsatisfaction\b/i, /\bpurchase intent\b/i,
  ]) {
    assert.doesNotMatch(prospectFacing, forbidden, `Act copy must not say ${forbidden}`);
  }

  // These hold across every surface: a denial may name trade, never identity.
  for (const forbidden of [/\bfacial\b/i, /\bface recognition\b/i, /\bidentifies a person\b/i]) {
    assert.doesNotMatch(everything, forbidden, `nothing in Act may say ${forbidden}`);
  }

  // No beat carries a field that could express an order of preference.
  for (const beat of shoppingCentreActBeats) {
    for (const field of ["rank", "score", "priority", "weight", "recommended"]) {
      assert.ok(!(field in beat), `${beat.id} carries ${field}`);
    }
  }
});

test("the segment's standing boundaries survive into Act", () => {
  const byId = Object.fromEntries(shoppingCentreActBeats.map((b) => [b.id, b]));
  assert.match(byId["sc-act-operating-rhythm"].cannotSupport, /a vehicle is still not a visitor/i);
  assert.match(byId["sc-act-operating-rhythm"].cannotSupport, /longer visit was a better one/i);
  assert.match(byId["sc-act-space-and-layout"].cannotSupport, /busy area is a good one or a quiet one a failure/i);
  assert.match(byId["sc-act-space-and-layout"].cannotSupport, /outside the configured camera coverage/i);
  assert.match(byId["sc-act-leasing-and-mix"].cannotSupport, /Tenant sales, turnover or spend/i);
  assert.match(byId["sc-act-position-and-reach"].cannotSupport, /never replaces entrance measurement/i);
  assert.match(byId["sc-act-position-and-reach"].cannotSupport, /identifies anyone/i);
});

test("Shopping Centre closes with one question and no second menu", () => {
  // Retail converges into three next-conversation offers. This segment has none:
  // after four Configure territories, another offer set is just another menu.
  assert.equal(getActDirectionsForSegment("shopping-centre").length, 0);
  assert.equal(shoppingCentreActConvergence.label, "Your next property question");
  assert.equal(shoppingCentreActClosing.cta, "Continue the conversation");

  // A centre is one asset, never a count of locations.
  for (const forbidden of [/\blocations\b/i, /\bportfolio\b/i, /\bstores?\b/i]) {
    assert.doesNotMatch(prospectFacing, forbidden);
  }

  const component = read("app/components/ShoppingCentreActScene.tsx");
  assert.ok(!component.includes("locationCount"));
  // No proof is approved for this segment, so "see it in practice" is absent.
  assert.ok(!/see it in practice/i.test(prospectFacing));
  assert.ok(!component.includes("requiresApprovedProof"));
});

test("Retail Act content is untouched by the extraction", () => {
  assert.deepEqual(actRecapBeats.map((beat) => `${beat.territory}:${beat.from}>${beat.to}`), [
    "outside:Opportunity>Passers-by",
    "entrance:Visits>Capture",
    "inside:Experience>Movement & attention",
    "performance:Performance>Conversion & value",
  ]);
  assert.equal(actConvergence.label, "Your next question");
  assert.equal(actClosing.cta, "Continue the conversation");
  assert.equal(actClosing.back, "Back to the next steps");
  assert.equal(retailActDirections.length, 3);
  assert.deepEqual(validateActDirections(), []);

  // Retail keeps its own headline and its three-direction middle.
  const retail = read("app/components/RetailActScene.tsx");
  assert.match(retail, /const DISPLAY_HEADLINE = "Where could we start\?";/);
  assert.match(retail, /act__directions/);
  assert.match(retail, /<ActSceneLayout/);
});

test("the shared Act frame names no segment", () => {
  // Comments stripped first: the file explains WHY Retail and Shopping Centre
  // need different middles, and that explanation is not a coupling.
  const layout = read("app/components/ActSceneLayout.tsx")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
  assert.match(layout, /act__masthead/);
  assert.match(layout, /act__closing/);
  assert.match(layout, /act__captures/);
  for (const token of ["retail", "shopping-centre", "Retail", "ShoppingCentre", "locationCount"]) {
    assert.ok(!layout.includes(token), `the shared frame must not name ${token}`);
  }
  // Both wrappers go through it.
  assert.match(read("app/components/ShoppingCentreActScene.tsx"), /<ActSceneLayout/);
});

test("the Shopping Centre Act route is guarded by the release switch", () => {
  // Approved for production on 2026-09-29; still one switch away from a 404.
  const page = read("app/preview/shopping-centre-act/page.tsx");
  assert.match(page, /if \(!brochureRouteAvailable\(\)\) \{\s*notFound\(\);/);
});

test("Act is wired into the shell as a stage, never as a scene", () => {
  const shell = read("app/components/CommercialExperience.tsx");
  assert.match(shell, /<ShoppingCentreActScene/);
  assert.match(shell, /journey\.actVariant === "shopping-centre"/);

  // Still a synthesis stage: no scene, no route entry, no invented id.
  const segment = getSegment("shopping-centre");
  assert.deepEqual(segment.stageMapping.act, []);
  assert.ok(!segment.coreRoute.some((id) => id.includes("act")));
  assert.ok(segment.scenes.every((scene) => scene.journeyStage !== "act"));

  // The centre's Act takes no portfolio count from the session. Scoped to the
  // element's own props: the Retail branch sits directly beside it in the
  // ternary and legitimately passes `locationCount`.
  const centreElement = shell.match(/<ShoppingCentreActScene[\s\S]*?\/>/)[0];
  assert.ok(!centreElement.includes("locationCount"));
  assert.ok(!centreElement.includes("account?.name"));
  assert.match(centreElement, /assetName=/);
  assert.match(shell, /SHOPPING_CENTRE_ASSET_FALLBACK = "Selected shopping centre"/);
});
