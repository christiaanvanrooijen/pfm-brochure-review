import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  directionHasSiteImplementations,
  getSolutionDirectionsForSegment,
  getSolutionProof,
  getSolutionRequirements,
  getSolutionTechnologyDrilldown,
  implementationsAreRanked,
} from "../app/content/solution-runtime.ts";
import { initialConfigureViewState } from "../app/lib/configure-view.ts";

const repoFile = (relative) => fileURLToPath(new URL(`../${relative}`, import.meta.url));
const read = (relative) => readFileSync(repoFile(relative), "utf8");

const LAYOUT = "app/components/ConfigureSceneLayout.tsx";
const RETAIL = "app/components/RetailConfigureScene.tsx";
const CENTRE = "app/components/ShoppingCentreConfigureScene.tsx";
const CSS = "app/globals.css";

/* Components cannot be imported here — Node strips TypeScript types but not JSX
   — so component assertions read source. Comments are stripped first: several of
   the files below deliberately DESCRIBE the thing they forbid, and a scanner
   that reads those sentences reports the documentation rather than a breach. */
const stripComments = (source) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

const code = (relative) => stripComments(read(relative));

/* ---------------------------------------------------------------- Retail */

test("1. Retail's reader-visible masthead and video copy is unchanged", () => {
  const retail = code(RETAIL);
  assert.match(retail, /const DISPLAY_HEADLINE = 'What could this unlock for your stores\?'/);
  assert.match(
    retail,
    /You have just seen one location end to end — the street outside, the threshold, the floor inside, and the sale\. These are the four directions that story can be taken in\./,
  );
  assert.match(
    retail,
    /One way this capability is implemented\. Other implementations do not produce identical output, and nothing shown here is a measurement, accuracy or coverage claim\./,
  );
  assert.match(
    retail,
    /An example of what this measurement looks like in a real store\. What a given store would see is designed per site, and nothing shown here is a measurement, accuracy or coverage claim\./,
  );
});

test("2. Retail's territory modifiers and its stagger survive the extraction", () => {
  const css = read(CSS);
  for (const rule of [
    ".configure__territory--outside",
    ".configure__territory--entrance",
    ".configure__territory--inside",
    ".configure__territory--performance",
    ".configure__detail-head--performance",
    ".configure__detail-head--outside",
    ".configure__detail-head--inside",
  ]) {
    assert.ok(css.includes(rule), `${rule} must still exist`);
  }
  // The staggered composition is Retail's, and it is keyed to Retail's names.
  assert.match(css, /\.configure__territory--entrance,\s*\n\.configure__territory--performance \{ transform: translateY\(20px\); \}/);
});

test("3. Retail's direction order is unchanged", () => {
  assert.deepEqual(
    getSolutionDirectionsForSegment("retail").map((direction) => direction.territory),
    ["outside", "entrance", "inside", "performance"],
  );
});

test("4. Retail's four glyphs keep their exact artwork", () => {
  const retail = code(RETAIL);
  // Pinned by path data: a glyph that is redrawn is a visible Retail change.
  for (const path of [
    'd="M4 26h26"',
    'd="M9 21V12l8-4 8 4v9"',
    'd="M11 6v22"',
    'd="M13.5 13.5L17 17l-3.5 3.5"',
    'd="M9 24c0-6 5-5 5-10s6-5 6-1 4 4 5 1"',
    'd="M5 28V17"',
    'd="M23 12h7v7"',
  ]) {
    assert.ok(retail.includes(path), `Retail glyph path ${path} must be unchanged`);
  }
  for (const territory of ["outside", "entrance", "inside", "performance"]) {
    assert.match(retail, new RegExp(`\\n  ${territory}: \\(`), `Retail must define a ${territory} glyph`);
  }
});

/* ------------------------------------------------- Shared layout / fallback */

test("5. Shopping Centre defines a glyph for every territory it uses", () => {
  const centre = code(CENTRE);
  const territories = getSolutionDirectionsForSegment("shopping-centre").map((d) => d.territory);
  assert.deepEqual(territories, ["arrival", "movement", "tenancy", "reach"]);
  for (const territory of territories) {
    assert.match(
      centre,
      new RegExp(`\\n  ${territory}: \\(`),
      `Shopping Centre must define an explicit ${territory} glyph`,
    );
  }
});

test("6. no glyph fallback survives anywhere", () => {
  // The regression this guards: the old switch ended in `default:` and handed
  // the Retail performance glyph to any territory it did not recognise, so a new
  // segment silently inherited a chart-like mark implying commercial
  // performance. Nothing may reintroduce a default.
  const layout = code(LAYOUT);
  assert.ok(!layout.includes("TerritoryGlyph"), "the layout must not own a glyph component");
  assert.match(layout, /glyphs\[direction\.territory\] \?\? null/);
  assert.match(layout, /glyphs\[open\.territory\] \?\? null/);

  for (const file of [RETAIL, CENTRE]) {
    const source = code(file);
    assert.ok(!/\bdefault:/.test(source), `${file} must not carry a default glyph case`);
    assert.ok(!/\bswitch\s*\(/.test(source), `${file} must use an explicit lookup, not a switch`);
  }
});

test("7. the Shopping Centre masthead promises no outcome it cannot measure", () => {
  const centre = code(CENTRE);
  const headline = centre.match(/const DISPLAY_HEADLINE = "([^"]+)"/)[1];
  const lead = centre.match(/const DISPLAY_LEAD =\s*\n\s*"([^"]+)"/)[1];

  assert.equal(headline, "What should we measure to answer the centre question?");
  assert.equal(
    lead,
    "Choose the measurement scope, context and depth that fit the decision you want to explore.",
  );

  const masthead = `${headline} ${lead}`.toLowerCase();
  for (const forbidden of [
    /\bstores?\b/, /\bsales?\b/, /\bsale\b/, /\btransactions?\b/, /\bturnover\b/,
    /\bconversions?\b/, /\bperformance\b/, /\bspend\b/, /\broi\b/, /\brevenue\b/,
  ]) {
    assert.doesNotMatch(masthead, forbidden, `the centre masthead must not say ${forbidden}`);
  }
});

test("8. Shopping Centre's direction order is the approved order, not Core order", () => {
  assert.deepEqual(
    getSolutionDirectionsForSegment("shopping-centre").map((direction) => direction.territoryLabel),
    ["Visits & rhythm", "Movement & space", "Tenant & brand", "Reach & positioning"],
  );
});

test("9. nothing is preselected when Configure opens", () => {
  assert.equal(initialConfigureViewState.openDirectionId, null);
  assert.equal(initialConfigureViewState.openDepthId, null);
});

test("10. the shared layout ranks, scores and recommends nothing", () => {
  const layout = code(LAYOUT);

  // Asserted structurally rather than lexically. This file's ranking words all
  // appear inside the sentences that FORBID ranking — "not a ranking",
  // "nothing is selected, scored or priced" — so a keyword ban would fail on the
  // very copy that enforces the boundary. What matters is that the denials are
  // present and that the model carries no ranking at all.
  assert.match(layout, /Nothing here is selected, scored or priced/);
  assert.match(layout, /Looking at a direction does not select it/);
  assert.match(layout, /These are alternatives, not a ranking/);

  assert.equal(implementationsAreRanked, false);

  for (const segment of ["retail", "shopping-centre"]) {
    for (const direction of getSolutionDirectionsForSegment(segment)) {
      for (const field of ["rank", "score", "priority", "weight", "recommended", "isDefault"]) {
        assert.ok(!(field in direction), `${direction.id} carries a ranking field ${field}`);
      }
    }
  }
});

test("11. Reach & positioning offers no site implementation section", () => {
  const reach = getSolutionDirectionsForSegment("shopping-centre").find(
    (direction) => direction.territory === "reach",
  );
  assert.deepEqual(reach.siteCapabilityIds, []);
  assert.equal(directionHasSiteImplementations(reach), false);
});

test("12/13. Movement and Tenant surface business as operational context, never trade", () => {
  for (const territory of ["movement", "tenancy"]) {
    const direction = getSolutionDirectionsForSegment("shopping-centre").find(
      (entry) => entry.territory === territory,
    );
    const requirements = getSolutionRequirements(direction.id);
    const business = requirements.primary.filter((item) => item.dataRole === "business");
    assert.ok(business.length > 0, `${territory} must surface business context`);

    const labels = business.map((item) => item.label).join(" | ").toLowerCase();
    assert.match(labels, /floorplan|zone|boundary|tenant|brand|mapping|definitions/);
    for (const forbidden of [/\bsales\b/, /\bturnover\b/, /\btransaction/, /\bspend\b/, /\bpos\b/]) {
      assert.doesNotMatch(labels, forbidden, `${territory} business context must not name ${forbidden}`);
    }
  }
});

test("14. no Shopping Centre direction requires business-data connection", () => {
  for (const direction of getSolutionDirectionsForSegment("shopping-centre")) {
    assert.ok(!direction.technologyCapabilityIds.includes("TECH-08"), direction.id);
  }
});

test("15. placeholder proof is inspectable in Sales Mode and withheld from a prospect", () => {
  for (const direction of getSolutionDirectionsForSegment("shopping-centre")) {
    const sales = getSolutionProof(direction.id, "sales");
    const presenting = getSolutionProof(direction.id, "presentation");

    // No Shopping Centre proof is approved yet, so nothing is playable anywhere.
    assert.deepEqual(sales.usable, [], `${direction.id}: no proof may be usable`);
    assert.deepEqual(presenting.usable, []);

    // Sales Mode may show the internal placeholder and says so honestly.
    assert.equal(sales.internalStatusNote, "No approved external proof yet");

    // A prospect sees neither the placeholder nor an action.
    assert.deepEqual(presenting.internal, [], `${direction.id}: internal proof must not reach a prospect`);
    assert.equal(presenting.actionAvailable, false);
    assert.equal(presenting.internalStatusNote, null);
  }
});

test("16. the Shopping Centre Configure route is guarded by the release switch", () => {
  // Approved for production on 2026-09-29; still one switch away from a 404.
  const page = read("app/preview/shopping-centre-configure/page.tsx");
  assert.match(page, /if \(!brochureRouteAvailable\(\)\) \{\s*notFound\(\);/);
  // Configure hands on to this segment's Act.
  assert.match(read("app/preview/shopping-centre-configure/harness.tsx"), /router\.push\("\/preview\/shopping-centre-act"\)/);
});

test("18. the shell routes Configure through a segment wrapper, never the layout", () => {
  // This replaces the previous gate's invariant, which was that the shell must
  // not reference Shopping Centre Configure at all. It now must — but only
  // through the segment wrappers, so the shared layout stays reachable in one
  // way per segment.
  const shell = read("app/components/CommercialExperience.tsx");
  assert.match(shell, /import \{ RetailConfigureScene \} from "\.\/RetailConfigureScene";/);
  assert.match(
    shell,
    /import \{ ShoppingCentreConfigureScene \} from "\.\/ShoppingCentreConfigureScene";/,
  );
  assert.ok(
    !shell.includes("ConfigureSceneLayout"),
    "the shell must go through a segment wrapper, never the shared layout",
  );

  // And the choice is made from the segment's journey config rather than by
  // testing an id at the render site.
  assert.match(shell, /journey\.configureVariant === "shopping-centre"/);
});

test("19. both wrappers delegate to the shared layout rather than duplicating it", () => {
  for (const file of [RETAIL, CENTRE]) {
    const source = code(file);
    assert.match(source, /<ConfigureSceneLayout/, `${file} must render the shared layout`);
    // Truth-bearing logic lives in one place only.
    for (const forbidden of ["getSolutionProof", "getSolutionRequirements", "resolveVisibleDepth"]) {
      assert.ok(!source.includes(forbidden), `${file} must not re-implement ${forbidden}`);
    }
  }
});

test("Shopping Centre territory modifiers exist and carry no Retail stagger", () => {
  const css = read(CSS);
  for (const territory of ["arrival", "movement", "tenancy", "reach"]) {
    assert.ok(
      css.includes(`.configure__territory--${territory}`),
      `.configure__territory--${territory} must be defined`,
    );
    assert.ok(css.includes(`.configure__detail-head--${territory}`));
    // No transform may be attached to a Shopping Centre territory: the stagger
    // is Retail's editorial composition, and these four are of equal status.
    assert.ok(
      !new RegExp(`configure__territory--${territory}[^{]*\\{[^}]*transform`).test(css),
      `${territory} must not carry a transform`,
    );
  }
});

/* ------------------------------------------------------------------- media */

test("explainer media is resolved by segment AND capability, never by capability alone", () => {
  // This test previously asserted the audit's finding as behaviour: nothing in
  // the media layer was segment-keyed, so Shopping Centre inherited Retail's
  // entrance explainer — a street doorway — under "How do visitors arrive".
  // A shared capability id does not authorise shared footage, so that
  // inheritance is now closed.
  const centre = getSolutionDirectionsForSegment("shopping-centre");

  // Context visuals remain capability-scoped: TECH-07's catchment reference is
  // a diagram of the principle, not a photograph of a segment.
  const reach = centre.find((direction) => direction.territory === "reach");
  const geo = getSolutionTechnologyDrilldown(reach.id).capabilities.find(
    (entry) => entry.capabilityId === "TECH-07",
  );
  assert.ok(geo.contextVisual, "TECH-07 must carry its catchment context visual");
  assert.match(geo.contextVisual.assetPath, /catchment-area-reference\.png$/);

  // Explainers are photographs of a place, and Shopping Centre has none of its
  // own for TECH-02. Nothing is the honest answer; Retail's street doorway is
  // not.
  const arrival = centre.find((direction) => direction.territory === "arrival");
  const entrance = getSolutionTechnologyDrilldown(arrival.id).capabilities.find(
    (entry) => entry.capabilityId === "TECH-02",
  );
  assert.equal(entrance.explainerVisuals.length, 0);

  // Retail still resolves its own, unchanged.
  const retailEntrance = getSolutionDirectionsForSegment("retail")
    .flatMap((direction) => getSolutionTechnologyDrilldown(direction.id).capabilities)
    .find((entry) => entry.capabilityId === "TECH-02");
  assert.equal(retailEntrance.explainerVisuals.length, 1);
  assert.match(retailEntrance.explainerVisuals[0].assetPath, /entrance-threshold-measurement\.png$/);

  // And Shopping Centre keeps the movement explainers it supplies for itself
  // through segment-capability-media.ts.
  const movement = centre
    .flatMap((direction) => getSolutionTechnologyDrilldown(direction.id).capabilities)
    .find((entry) => entry.capabilityId === "TECH-04");
  assert.ok(movement.explainerVisuals.length > 0);
  for (const visual of movement.explainerVisuals) {
    assert.equal(visual.segment, "shopping-centre");
  }
});

test("no Shopping Centre direction can reach the Retail-only passer-by explainer", () => {
  // TECH-01 is Retail's outdoor opportunity capability. No Shopping Centre scene
  // or direction declares it, so its explainer cannot appear here.
  for (const direction of getSolutionDirectionsForSegment("shopping-centre")) {
    const paths = getSolutionTechnologyDrilldown(direction.id)
      .capabilities.flatMap((entry) => entry.explainerVisuals.map((v) => v.assetPath));
    for (const path of paths) {
      assert.ok(
        !path.includes("passerby-physical-measurement"),
        `${direction.id} must not show the Retail passer-by explainer`,
      );
    }
    assert.ok(!direction.technologyCapabilityIds.includes("TECH-01"));
  }
});

test("the explainer-pair lede is segment-specific, and Retail's wording is unchanged", () => {
  // It read "the choice is made per store" for every segment, which reached
  // Shopping Centre under "How do visitors move through the centre".
  const layout = code(LAYOUT);
  assert.match(layout, /\{explainerPairLede\}/);
  assert.ok(
    !layout.includes("made per store"),
    "the shared layout must not hardcode a segment's unit",
  );

  assert.match(
    code(RETAIL),
    /Two ways of measuring this\. They answer the same question by different physical means — neither is a default, and the choice is made per store\./,
  );
  assert.match(
    code(CENTRE),
    /Two ways of measuring this\. They answer the same question by different physical means — neither is a default, and the choice is made per site\./,
  );
});

test("Shopping Centre proof never borrows a Retail case asset", () => {
  // Technology explainers belong under How we do this. Missing proof stays
  // missing rather than being filled with another segment's case material.
  for (const direction of getSolutionDirectionsForSegment("shopping-centre")) {
    for (const audience of ["sales", "presentation"]) {
      const proof = getSolutionProof(direction.id, audience);
      for (const item of [...proof.usable, ...proof.internal]) {
        assert.equal(item.segment, "shopping-centre", `${direction.id}: borrowed ${item.id}`);
        assert.ok(item.id.startsWith("CASE-SC-"), `${direction.id}: borrowed ${item.id}`);
      }
    }
  }
});
