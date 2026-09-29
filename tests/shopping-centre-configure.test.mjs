import assert from "node:assert/strict";
import test from "node:test";

import { getScenesForSegment, getSegment } from "../app/content/runtime.ts";
import {
  getConfigureSynthesis,
  getSolutionDirectionsForSegment,
  validateSolutionDirections,
} from "../app/content/solution-runtime.ts";
import {
  solutionDirectionIds,
  solutionTerritories,
} from "../app/content/solution-directions.ts";

const SEGMENT = "shopping-centre";

const SC_IDS = [
  "solution-sc-arrival-and-rhythm",
  "solution-sc-movement-and-space",
  "solution-sc-tenant-and-brand",
  "solution-sc-catchment-and-positioning",
];

const RETAIL_IDS = [
  "solution-location-opportunity",
  "solution-capture-and-visits",
  "solution-in-store-intelligence",
  "solution-performance-intelligence",
];

const directions = () => getSolutionDirectionsForSegment(SEGMENT);

/* The surface on which this experience makes an OFFER: the words that promise a
   prospect something. The unsupported-vocabulary ban belongs here.

   `boundaryNote` is deliberately excluded and tested separately below. It is the
   one field whose job is to DENY, and the Tenant & brand denial has to name what
   it denies — "never tenant sales, turnover or spend". Banning those tokens
   across every field would fail on the exact sentence that enforces the
   boundary, which is a scanner fault rather than a breach. */
const offerSurface = (direction) =>
  [
    direction.territoryLabel,
    direction.title,
    direction.customerQuestion,
    direction.lead,
    ...direction.capabilityPhrases,
    ...direction.alignmentNotes,
  ].join(" | ");

test("1. every solution direction validates, Shopping Centre included", () => {
  assert.deepEqual(validateSolutionDirections(), []);
  assert.equal(directions().length, 4);
});

test("2. every relatedSceneId resolves inside Shopping Centre", () => {
  const sceneIds = new Set(getScenesForSegment(SEGMENT).map((scene) => scene.id));
  for (const direction of directions()) {
    assert.ok(direction.relatedSceneIds.length > 0, `${direction.id}: synthesises no scene`);
    for (const sceneId of direction.relatedSceneIds) {
      assert.ok(sceneIds.has(sceneId), `${direction.id}: ${sceneId} is not a Shopping Centre scene`);
    }
  }
});

test("3. no direction reaches across segments", () => {
  for (const direction of directions()) {
    assert.equal(direction.segment, SEGMENT);
    for (const sceneId of direction.relatedSceneIds) {
      assert.ok(
        sceneId.startsWith("shopping-centre-"),
        `${direction.id}: ${sceneId} is not a Shopping Centre scene id`,
      );
    }
  }
});

test("4. Configure stays a synthesis stage with no scenes", () => {
  const segment = getSegment(SEGMENT);
  assert.deepEqual(segment.stageMapping.configure, []);
  assert.deepEqual(segment.stageMapping.act, []);
  assert.ok(segment.scenes.every((scene) => scene.journeyStage !== "configure"));
});

test("5. the four Retail directions are unchanged", () => {
  // A literal snapshot. Shopping Centre was added by extending shared unions, so
  // the guard that matters is that the frozen segment did not move.
  const retail = getSolutionDirectionsForSegment("retail");
  assert.deepEqual(
    retail.map((direction) => ({
      id: direction.id,
      territory: direction.territory,
      territoryLabel: direction.territoryLabel,
      title: direction.title,
      customerQuestion: direction.customerQuestion,
      capabilities: [...direction.technologyCapabilityIds],
      site: [...direction.siteCapabilityIds],
      scenes: [...direction.relatedSceneIds],
    })),
    [
      {
        id: "solution-location-opportunity",
        territory: "outside",
        territoryLabel: "Outside",
        title: "Understand the opportunity around each store",
        customerQuestion: "Is the right opportunity around each store?",
        capabilities: ["TECH-01", "TECH-07"],
        site: ["TECH-01"],
        scenes: ["retail-street-opportunity", "retail-portfolio-comparison"],
      },
      {
        id: "solution-capture-and-visits",
        territory: "entrance",
        territoryLabel: "Entrance",
        title: "See how much opportunity becomes a visit",
        customerQuestion: "Are enough passers-by choosing to enter?",
        capabilities: ["TECH-01", "TECH-02", "TECH-03"],
        site: ["TECH-02"],
        scenes: ["retail-store-visits", "retail-visitor-composition"],
      },
      {
        id: "solution-in-store-intelligence",
        territory: "inside",
        territoryLabel: "Inside",
        title: "Understand what happens during the visit",
        customerQuestion: "What happens after visitors enter?",
        capabilities: ["TECH-04", "TECH-05", "TECH-03"],
        site: ["TECH-04", "TECH-05"],
        scenes: [
          "retail-in-store-journey",
          "retail-zone-engagement",
          "retail-visit-duration",
        ],
      },
      {
        id: "solution-performance-intelligence",
        territory: "performance",
        territoryLabel: "Performance",
        title: "Connect visits to commercial performance",
        customerQuestion: "How does traffic connect to commercial performance?",
        capabilities: ["TECH-02", "TECH-08"],
        site: [],
        scenes: ["retail-conversion-sales-context", "retail-portfolio-comparison"],
      },
    ],
  );
});

test("6. the Retail ids and territories keep their positions in the shared unions", () => {
  assert.deepEqual(solutionDirectionIds.slice(0, 4), RETAIL_IDS);
  assert.deepEqual(solutionTerritories.slice(0, 4), [
    "outside",
    "entrance",
    "inside",
    "performance",
  ]);
});

test("7. Shopping Centre is additive — appended, never interleaved", () => {
  /* This originally read `slice(4)` and asserted a total length of 8, which
     also asserted that Shopping Centre is the LAST segment in both unions. That
     was never the claim being made — the claim is that Retail comes first and
     Shopping Centre follows it contiguously, so approved Retail positions never
     move. A third segment appended after Shopping Centre satisfies that and
     broke the old form, so the assertion is stated the way it was meant. */
  assert.deepEqual(solutionDirectionIds.slice(0, 4), RETAIL_IDS);
  assert.deepEqual(solutionDirectionIds.slice(4, 8), SC_IDS);
  assert.deepEqual(solutionTerritories.slice(0, 4), ["outside", "entrance", "inside", "performance"]);
  assert.deepEqual(solutionTerritories.slice(4, 8), ["arrival", "movement", "tenancy", "reach"]);
  assert.ok(solutionDirectionIds.length >= 8);
  assert.ok(solutionTerritories.length >= 8);
  assert.equal(
    new Set(solutionDirectionIds).size,
    solutionDirectionIds.length,
    "no duplicate direction id",
  );
  assert.equal(
    new Set(solutionTerritories).size,
    solutionTerritories.length,
    "no duplicate territory",
  );
});

test("8. siteCapabilityIds is always a subset of the declared capabilities", () => {
  for (const direction of directions()) {
    for (const capabilityId of direction.siteCapabilityIds) {
      assert.ok(
        direction.technologyCapabilityIds.includes(capabilityId),
        `${direction.id}: site capability ${capabilityId} is not declared`,
      );
    }
  }

  // Reach installs nothing at the asset: geo connects an approved external
  // source. An empty array here is the meaningful case, not an oversight.
  const reach = directions().find((direction) => direction.territory === "reach");
  assert.deepEqual(reach.siteCapabilityIds, []);

  // Classification is a configuration of a device already in the list, per the
  // schema convention, so it is never a site capability.
  for (const direction of directions()) {
    assert.ok(!direction.siteCapabilityIds.includes("TECH-03"));
  }
});

test("9. TECH-08 appears nowhere in Shopping Centre", () => {
  // The load-bearing fact of this segment: no scene declares business-data
  // connection, so no direction may claim it either.
  for (const direction of directions()) {
    assert.ok(
      !direction.technologyCapabilityIds.includes("TECH-08"),
      `${direction.id}: declares TECH-08, which no Shopping Centre scene supports`,
    );
    assert.ok(!direction.siteCapabilityIds.includes("TECH-08"));
  }
  for (const scene of getScenesForSegment(SEGMENT)) {
    assert.ok(!scene.technologyCapabilityIds.includes("TECH-08"), scene.id);
  }
});

test("10. no direction OFFERS what this segment cannot measure", () => {
  // Shopping Centre measures visitation. It does not measure trade.
  for (const direction of directions()) {
    const surface = offerSurface(direction).toLowerCase();
    for (const forbidden of [
      /\bsales\b/,
      /\bturnover\b/,
      /\batv\b/,
      /\bbasket\b/,
      /\btransactions?\b/,
      /\bpos\b/,
      /\bconversions?\b/,
      /\brevenue\b/,
      /\broi\b/,
      /\bspend(?:ing)?\b/,
      /\bpurchases?\b/,
      /\bpayback\b/,
      /\buplift\b/,
    ]) {
      assert.doesNotMatch(surface, forbidden, `${direction.id}: offers ${forbidden}`);
    }
  }
});

test("10b. the boundary note denies rather than stays silent", () => {
  // The counterpart to the ban above. `boundaryNote` MAY name trade vocabulary,
  // because naming it is how the denial is made legible to a prospect — but the
  // Tenant & brand note is the one that must actually say it out loud.
  for (const direction of directions()) {
    assert.ok(direction.boundaryNote.length > 0, `${direction.id}: has no boundary note`);
  }

  const tenancy = directions().find((direction) => direction.territory === "tenancy");
  assert.match(tenancy.boundaryNote, /never tenant sales, turnover or spend/i);
  assert.match(tenancy.boundaryNote, /not a purchase journey|not a recognised shopper/i);

  const reach = directions().find((direction) => direction.territory === "reach");
  assert.match(reach.boundaryNote, /never replaces it/i);
  assert.match(reach.boundaryNote, /identifies anyone/i);

  const arrival = directions().find((direction) => direction.territory === "arrival");
  // Either/or, never both — the same dependency shape the Time in centre scene carries.
  assert.match(arrival.boundaryNote, /either/i);
  assert.match(arrival.boundaryNote, /one path is enough/i);
  assert.match(arrival.boundaryNote, /a vehicle is still not a visitor/i);

  const movement = directions().find((direction) => direction.territory === "movement");
  assert.match(movement.boundaryNote, /nobody is followed/i);
  assert.match(movement.boundaryNote, /not a good area|not a failure/i);
});

test("11. Configure recommends nothing", () => {
  const synthesis = getConfigureSynthesis(SEGMENT);
  assert.equal(synthesis.recommendationMode, "none");
  assert.equal(synthesis.journeyStage, "configure");
});

test("12. no direction ranks, scores, prefers or auto-selects", () => {
  for (const direction of directions()) {
    const surface = offerSurface(direction).toLowerCase();
    for (const forbidden of [
      /\brecommend(?:ed|s|ation)?\b/,
      /\bbest\b/,
      /\boptimal\b/,
      /\bideal\b/,
      /\bpreferred\b/,
      /\brank(?:ed|ing)?\b/,
      /\bscore[ds]?\b/,
      /\btier (?:one|1)\b/,
      /\bwe suggest\b/,
      /\bautomatically select/,
    ]) {
      assert.doesNotMatch(surface, forbidden, `${direction.id}: ranks or recommends`);
    }

    // Structural, not just lexical: the schema carries no field that could
    // express a preference order.
    for (const field of ["rank", "score", "priority", "weight", "recommended"]) {
      assert.ok(!(field in direction), `${direction.id}: carries a ranking field ${field}`);
    }
  }
});

test("13. Parking did not become a fifth territory", () => {
  assert.equal(directions().length, 4);
  assert.ok(!solutionTerritories.includes("parking"));

  // Parking stays a branch of the segment, and vehicle context is optional depth
  // inside Visits & rhythm rather than a territory of its own.
  const segment = getSegment(SEGMENT);
  assert.ok(segment.optionalBranches.includes("shopping-centre-parking-arrival"));
  assert.ok(segment.optionalBranches.includes("shopping-centre-parking-occupancy"));
  for (const direction of directions()) {
    assert.ok(!direction.relatedSceneIds.includes("shopping-centre-parking-arrival"));
    assert.ok(!direction.relatedSceneIds.includes("shopping-centre-parking-occupancy"));
  }
});

test("14. Shopping Centre has no Performance territory", () => {
  const territories = directions().map((direction) => direction.territory);
  assert.ok(!territories.includes("performance"));
  assert.deepEqual(territories, ["arrival", "movement", "tenancy", "reach"]);

  // And the prospect-facing label is "Visits & rhythm", not "Arrival": this
  // territory carries overall visit length, not entries alone.
  const arrival = directions().find((direction) => direction.territory === "arrival");
  assert.equal(arrival.territoryLabel, "Visits & rhythm");
});

test("15. the four customer problems are distinct", () => {
  const all = directions();
  for (const field of ["territory", "territoryLabel", "title", "customerQuestion"]) {
    assert.equal(
      new Set(all.map((direction) => direction[field])).size,
      4,
      `${field} is not distinct across the four directions`,
    );
  }

  // And no two directions synthesise the same set of scenes.
  const sceneSets = all.map((direction) => [...direction.relatedSceneIds].sort().join(","));
  assert.equal(new Set(sceneSets).size, 4, "two directions synthesise the same scenes");
});

test("16. no territory maps one-to-one onto a Core scene", () => {
  const segment = getSegment(SEGMENT);
  assert.equal(segment.coreRoute.length, 8);
  assert.equal(directions().length, 4);

  // Every direction synthesises more than one scene: a direction that wrapped a
  // single scene would be that scene under a new heading.
  for (const direction of directions()) {
    assert.ok(
      direction.relatedSceneIds.length >= 2,
      `${direction.id}: synthesises only one scene`,
    );
  }

  // Every Core scene is reachable from some direction.
  const covered = new Set(directions().flatMap((direction) => direction.relatedSceneIds));
  for (const sceneId of segment.coreRoute) {
    assert.ok(covered.has(sceneId), `${sceneId} is covered by no direction`);
  }
});

test("17. capabilities may overlap between territories", () => {
  // Explicitly asserted, so nobody later "tidies" the model by giving each
  // capability a single owner. The centre of gravity of a territory is its
  // customer decision, not its technology.
  const counts = new Map();
  for (const direction of directions()) {
    for (const capabilityId of direction.technologyCapabilityIds) {
      counts.set(capabilityId, (counts.get(capabilityId) ?? 0) + 1);
    }
  }

  assert.ok(counts.get("TECH-02") >= 2, "TECH-02 legitimately serves more than one territory");
  assert.ok(counts.get("TECH-04") >= 2, "TECH-04 legitimately serves more than one territory");
  assert.ok(counts.get("TECH-05") >= 2, "TECH-05 legitimately serves more than one territory");

  // And overlap is not a validation error.
  assert.deepEqual(validateSolutionDirections(), []);
});
