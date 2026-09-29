import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  getSolutionDirectionsForSegment,
  getSolutionImplementationOptions,
  getSolutionTechnologyDrilldown,
} from "../app/content/solution-runtime.ts";
import { configurePrivacyStatement } from "../app/content/solution-directions.ts";
import { technologyImplementations } from "../app/content/technology.ts";

const read = (relative) => readFileSync(fileURLToPath(new URL(`../${relative}`, import.meta.url)), "utf8");

/* Every asset that belongs to Retail's 3D-sensor account of TECH-04. A shopping
   centre's movement is reconstructed from camera coverage, so none of these may
   reach it — not as a diagram, not as a video, not as hardware. */
const RETAIL_TECH04_ASSETS = [
  "lidar-in-a-store-pfm.mp4",
  "lidar-tracking-reporting-visual.mp4",
  "lidar-spatial-pointcloud.png",
  "3d-spatial-tracking.png",
];

const capabilityViews = (segment, capabilityId) =>
  getSolutionDirectionsForSegment(segment).flatMap((direction) =>
    getSolutionTechnologyDrilldown(direction.id).capabilities.filter(
      (entry) => entry.capabilityId === capabilityId,
    ),
  );

test("1. no Shopping Centre TECH-04 view resolves a Retail 3D-sensor asset", () => {
  const views = capabilityViews("shopping-centre", "TECH-04");
  assert.ok(views.length >= 2, "TECH-04 appears in more than one Shopping Centre direction");

  for (const view of views) {
    const media = [
      ...view.explainerVisuals.map((visual) => visual.assetPath),
      view.explainerVideo?.src,
      view.explainerVideo?.followOn?.src,
      ...view.implementations.map((implementation) => implementation.assetPath),
    ].filter(Boolean);

    for (const asset of RETAIL_TECH04_ASSETS) {
      for (const path of media) {
        assert.ok(!path.includes(asset), `Shopping Centre TECH-04 must not resolve ${asset}`);
      }
    }
  }

  // And the same must hold for what would be installed at the location.
  for (const direction of getSolutionDirectionsForSegment("shopping-centre")) {
    for (const group of getSolutionImplementationOptions(direction.id, "sales")) {
      if (group.capabilityId !== "TECH-04") continue;
      assert.deepEqual(group.options, [], "Shopping Centre shows no TECH-04 site implementation");
    }
  }
});

test("2. Retail TECH-04 still resolves its own assets, unchanged", () => {
  const views = capabilityViews("retail", "TECH-04");
  assert.ok(views.length > 0);

  const inside = views[0];
  assert.deepEqual(
    inside.explainerVisuals.map((visual) => visual.assetPath),
    [
      "/assets/technology/explainers/lidar-spatial-pointcloud.png",
      "/assets/technology/explainers/3d-spatial-tracking.png",
    ],
  );
  assert.equal(inside.explainerVideo?.src, "/assets/videos/lidar-in-a-store-pfm.mp4");
  assert.equal(
    inside.explainerVideo?.followOn?.src,
    "/assets/videos/lidar-tracking-reporting-visual.mp4",
  );
  assert.deepEqual(
    inside.implementations.map((implementation) => implementation.supplier),
    ["RoboSense", "Xovis"],
  );
  assert.equal(
    inside.purpose,
    "Explain how anonymous routes, zones and dwell are measured inside a location.",
  );
});

test("3. Shopping Centre TECH-04 copy carries no 3D-sensor vocabulary", () => {
  for (const view of capabilityViews("shopping-centre", "TECH-04")) {
    const copy = `${view.purpose} ${view.implementationNote ?? ""}`.toLowerCase();
    for (const forbidden of [
      /\blidar\b/,
      /\bpoint cloud\b/,
      /\bpointcloud\b/,
      /\b3d\b/,
      /\bstereo vision\b/,
      /\bscanned\b/,
      /\bper store\b/,
      /\bstores?\b/,
    ]) {
      assert.doesNotMatch(copy, forbidden, `Shopping Centre TECH-04 copy must not say ${forbidden}`);
    }
  }
});

test("4. Shopping Centre TECH-04 states the camera method, and its limits", () => {
  for (const view of capabilityViews("shopping-centre", "TECH-04")) {
    assert.match(view.purpose, /IP-camera/);
    assert.match(view.purpose, /anonymous/i);
    assert.match(view.purpose, /reconstructed/i);
    // Coverage is not everywhere, and the copy must not let a reader forget it.
    assert.match(view.purpose, /configured coverage/i);
  }

  // The same capability must resolve the same way in every Shopping Centre
  // direction it appears in — one segment, one account of how it is measured.
  const purposes = new Set(capabilityViews("shopping-centre", "TECH-04").map((v) => v.purpose));
  assert.equal(purposes.size, 1, "TECH-04 must not mean two things inside one segment");
});

test("5. nothing in the Shopping Centre account implies identity", () => {
  const surfaces = [
    ...capabilityViews("shopping-centre", "TECH-04").flatMap((view) => [
      view.purpose,
      view.privacyPrinciple,
    ]),
    configurePrivacyStatement.headline,
    configurePrivacyStatement.lead,
    ...configurePrivacyStatement.principles.flatMap((p) => [p.title, p.body]),
  ].join(" ");

  for (const forbidden of [
    /\bfacial\b/i,
    /\bface recognition\b/i,
    /\bfaces?\b/i,
    /\bidentif(?:y|ied|ication)\b/i,
    /\brecognised shopper\b/i,
    /\bpersistent identity\b/i,
    /\bfollow(?:s|ed|ing)? (?:a )?(?:person|people|individual)/i,
    /\bexact continuous path\b/i,
  ]) {
    assert.doesNotMatch(surfaces, forbidden, `privacy surface must not say ${forbidden}`);
  }

  // The approved boundary is stated positively somewhere the prospect reads it.
  assert.match(configurePrivacyStatement.headline, /behaviour, not identity/i);
});

test("6. the override may narrow a segment's view, never invent an implementation", () => {
  // The guard that keeps this file from becoming a second technology model.
  const byCapability = new Map();
  for (const implementation of technologyImplementations) {
    for (const capabilityId of implementation.capabilityIds) {
      if (!byCapability.has(capabilityId)) byCapability.set(capabilityId, new Set());
      byCapability.get(capabilityId).add(implementation.id);
    }
  }

  for (const segment of ["retail", "shopping-centre"]) {
    for (const direction of getSolutionDirectionsForSegment(segment)) {
      for (const view of getSolutionTechnologyDrilldown(direction.id).capabilities) {
        const allowed = byCapability.get(view.capabilityId) ?? new Set();
        for (const implementation of view.implementations) {
          assert.ok(
            allowed.has(implementation.id),
            `${view.capabilityId} resolved ${implementation.id}, which it does not declare`,
          );
        }
      }
    }
  }
});

test("7. the shared layout carries only the resolver hook, not segment logic", () => {
  const layout = read("app/components/ConfigureSceneLayout.tsx");
  assert.match(layout, /const video = entry\.explainerVideo;/);
  assert.ok(
    !layout.includes("getCapabilityExplainerVideo"),
    "the layout must not resolve media itself",
  );
  for (const token of ["shopping-centre", "shoppingCentre", "TECH-04", "isarsoft", "Isarsoft"]) {
    assert.ok(!layout.includes(token), `the layout must not name ${token}`);
  }
});

/* --------------------------------------------- the centre's own explainer --- */

test("8. Shopping Centre TECH-04 shows the centre camera explainer, and only there", () => {
  const CENTRE_ASSET =
    "/assets/technology/explainers/shopping-centre-camera-movement-intelligence.png";

  for (const view of capabilityViews("shopping-centre", "TECH-04")) {
    assert.deepEqual(
      view.explainerVisuals.map((visual) => visual.assetPath),
      [CENTRE_ASSET],
      "TECH-04 shows exactly the centre explainer in every Shopping Centre direction",
    );
    assert.equal(
      view.explainerVisuals[0].approachName,
      "Camera coverage and anonymous re-identification",
    );
    assert.equal(view.explainerVisuals[0].showsSensorHardware, false);
    assert.equal(view.explainerVisuals[0].hasEmbeddedText, false);
    assert.equal(view.explainerVisuals[0].illustratesImplementationId, null);
  }

  // It is a Shopping Centre TECH-04 asset and must not leak anywhere else.
  for (const segment of ["retail", "shopping-centre"]) {
    for (const direction of getSolutionDirectionsForSegment(segment)) {
      for (const view of getSolutionTechnologyDrilldown(direction.id).capabilities) {
        const shows = view.explainerVisuals.some((v) => v.assetPath === CENTRE_ASSET);
        if (shows) {
          assert.equal(segment, "shopping-centre");
          assert.equal(view.capabilityId, "TECH-04");
        }
      }
    }
  }
});

test("9. the centre explainer copy uses the approved vocabulary and no vendor", () => {
  const view = capabilityViews("shopping-centre", "TECH-04")[0];
  const visual = view.explainerVisuals[0];
  const prospectFacing = [
    view.purpose,
    visual.approachName,
    visual.explanation,
    visual.altText,
  ].join(" ");

  for (const required of [
    /IP-camera/,
    /perception software/i,
    /anonymously re-identify|anonymous re-identification/i,
    /covered areas/i,
    /configured coverage only/i,
  ]) {
    assert.match(prospectFacing, required, `must state ${required}`);
  }

  for (const forbidden of [
    /\bisarsoft\b/i,
    /\blidar\b/i,
    /\bpoint ?cloud\b/i,
    /\b3d\b/i,
    /\bfacial\b/i,
    /\bface recognition\b/i,
    /\bidentified shopper\b/i,
    /\brecognised shopper\b/i,
    /\bpersistent identity\b/i,
    /\bprofile\b/i,
    /\bstores?\b/i,
  ]) {
    assert.doesNotMatch(prospectFacing, forbidden, `must not say ${forbidden}`);
  }

  // The boundary is stated, not merely implied: coverage is partial, and the
  // output is movement rather than a person.
  assert.match(visual.explanation, /not all of it/i);
  assert.match(visual.explanation, /without creating a record of a person/i);
  // And the picture itself is described as carrying no face treatment.
  assert.match(visual.altText, /No face is framed, outlined or marked/i);
});

test("10. Movement & space no longer describes itself in sensor-density terms", () => {
  const movement = getSolutionDirectionsForSegment("shopping-centre").find(
    (direction) => direction.territory === "movement",
  );
  const notes = movement.alignmentNotes.join(" | ");

  assert.doesNotMatch(notes, /sensor density/i, "sensor density is LiDAR wording");
  assert.match(notes, /The camera coverage and placement the reading is based on/);

  // No vendor or 3D-sensor vocabulary anywhere in this direction's own copy.
  const surface = [
    movement.title,
    movement.customerQuestion,
    movement.lead,
    movement.boundaryNote,
    ...movement.capabilityPhrases,
    ...movement.alignmentNotes,
  ].join(" ");
  for (const forbidden of [/\blidar\b/i, /\bisarsoft\b/i, /\bpoint ?cloud\b/i, /\bsensor density\b/i]) {
    assert.doesNotMatch(surface, forbidden);
  }
});

test("11. Retail TECH-04 never resolves the centre explainer", () => {
  for (const view of capabilityViews("retail", "TECH-04")) {
    for (const visual of view.explainerVisuals) {
      assert.ok(
        !visual.assetPath.includes("shopping-centre-camera-movement-intelligence"),
        "Retail must not show the centre explainer",
      );
    }
  }
});

test("12. the explainer caption matches its artwork, and Retail's is untouched", () => {
  const DEFAULT_NOTE =
    "Illustration of the measurement principle. Not customer data, and not a picture of equipment.";

  // Retail's four explainers are diagrams, so they keep the shared caption by
  // carrying no override at all.
  for (const view of capabilityViews("retail", "TECH-04")) {
    for (const visual of view.explainerVisuals) {
      assert.equal(visual.illustrationNote, undefined, "Retail must keep the shared caption");
    }
  }
  assert.match(read("app/components/ConfigureSceneLayout.tsx"), new RegExp(DEFAULT_NOTE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  // The centre explainer's scene contains dome cameras, so "not a picture of
  // equipment" would be inaccurate. Its caption says the same thing in words
  // that match the artwork.
  for (const view of capabilityViews("shopping-centre", "TECH-04")) {
    const [visual] = view.explainerVisuals;
    assert.equal(
      visual.illustrationNote,
      "Illustration of the measurement principle. Not customer data or a depiction of a specific hardware implementation.",
    );
    // It must still deny both things the default denies.
    assert.match(visual.illustrationNote, /Not customer data/);
    assert.match(visual.illustrationNote, /specific hardware implementation/);
    assert.ok(!visual.illustrationNote.includes("not a picture of equipment"));
  }
});
