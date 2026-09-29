/**
 * Technology source, Isarsoft, Tattile and asset-safety guards.
 *
 * These hold the claims that would be most expensive to get wrong: that an
 * analytics family does not become a product domain, that a vehicle never
 * becomes a person, that privacy evidence does not travel between suppliers,
 * and that every picture and every source reference points at a real file.
 */

import { drawerExplainerVisuals } from "../app/content/scene-drawer-overrides.ts";
import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  contentBundle,
  technologyCapabilities,
  technologyImplementations,
} from "../app/content/index.ts";
import {
  getImplementation,
  getImplementationsForCapability,
} from "../app/content/technology-runtime.ts";
import {
  capabilityExplainerVideos,
  getSolutionImplementationOptions,
  getSolutionPrivacyDetail,
  getSolutionTechnologyDrilldown,
  validateSolutionDirections,
  IMPLEMENTATION_DETAIL_ON_REQUEST,
} from "../app/content/solution-runtime.ts";
import {
  capabilityContextVisuals,
  capabilityExplainerVisuals,
  getAllCapabilityExplainerVisuals,
  implementationRequirementProfiles,
  implementationVisuals,
} from "../app/content/technology-visuals.ts";
import { segmentCapabilityMediaOverrides } from "../app/content/segment-capability-media.ts";
import {
  resolvesAsPeopleEvidence,
  validateVehicleSemantics,
  vehicleEvidenceSemantics,
  vehicleEvidenceUnits,
  vehicleUnitAvailable,
} from "../app/content/vehicle-semantics.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(repoRoot, "public");
const registryPath = path.join(repoRoot, "docs/reference/technology/SOURCE-REGISTRY.md");

const impl = (id) => getImplementation(id);
const claims = (id) => impl(id).supportedClaims.join(" ");
const blocked = (id) => impl(id).unsupportedClaims.join(" ");

/* ==================================================================
   ISARSOFT — one implementation family, several possible capabilities
   ================================================================== */

test("Isarsoft is an implementation family, never a capability", () => {
  const identity = technologyCapabilities
    .map((capability) => `${capability.id} ${capability.name} ${capability.purpose}`)
    .join(" ")
    .toLowerCase();
  assert.doesNotMatch(identity, /isarsoft/);
  assert.ok(impl("impl-isarsoft-camera-analytics"));
});

test("Isarsoft is modelled as ONE family, not several products", () => {
  const isarsoft = technologyImplementations.filter((item) => item.supplier === "Isarsoft");
  assert.equal(isarsoft.length, 1);
  // One record, several possible capabilities.
  assert.ok(isarsoft[0].capabilityIds.length > 1);
});

test("Isarsoft may resolve under entrance measurement where the architecture allows", () => {
  const entrance = getImplementationsForCapability("TECH-02").map((item) => item.id);
  assert.ok(entrance.includes("impl-isarsoft-camera-analytics"));
});

test("no Isarsoft deployment is assumed to support every capability", () => {
  assert.match(
    blocked("impl-isarsoft-camera-analytics"),
    /every deployment supports every capability/i,
  );
  assert.match(claims("impl-isarsoft-camera-analytics"), /configuration/i);
});

test("Isarsoft classification stays configuration-dependent", () => {
  const isarsoft = impl("impl-isarsoft-camera-analytics");
  assert.ok(isarsoft.capabilityIds.includes("TECH-03"));
  // The capability itself keeps the guardrail, vendor-neutrally.
  const classification = technologyCapabilities.find((item) => item.id === "TECH-03");
  assert.match(classification.privacyPrinciple, /configured/i);
});

test("single-camera dwell never implies complete journey tracking", () => {
  assert.match(
    blocked("impl-isarsoft-camera-analytics"),
    /single-camera dwell at one view is complete in-store journey tracking/i,
  );
});

test("multi-camera matching never implies identity", () => {
  const isarsoft = impl("impl-isarsoft-camera-analytics");
  assert.match(
    isarsoft.unsupportedClaims.join(" "),
    /identity, facial-recognition or personal-identification/i,
  );
  // And nothing it does claim reads as identification.
  for (const claim of isarsoft.supportedClaims) {
    assert.doesNotMatch(claim, /identif|facial|face|named person/i);
  }
});

test("the anonymous matching capability never presents identity", () => {
  const matching = technologyCapabilities.find((item) => item.id === "TECH-05");
  assert.match(matching.privacyPrinciple, /never imply personal identification/i);
});

test("Isarsoft privacy claims come from its own whitepaper, never Xovis", () => {
  const isarsoft = impl("impl-isarsoft-camera-analytics");
  const xovis = impl("impl-xovis-3d-entrance");

  assert.equal(isarsoft.privacyStatus, "partially_source_backed");
  assert.notEqual(isarsoft.privacyStatus, xovis.privacyStatus);
  assert.match(blocked("impl-isarsoft-camera-analytics"), /Xovis privacy evidence/i);

  // No Xovis sentence appears under Isarsoft.
  for (const claim of xovis.supportedClaims) {
    assert.ok(!isarsoft.supportedClaims.includes(claim));
  }
  // Its own vendor claims are shown with the mapped evidence, not withheld.
  const entries = getSolutionPrivacyDetail("solution-capture-and-visits").entries;
  const entry = entries.find((item) => item.implementationId === "impl-isarsoft-camera-analytics");
  assert.equal(entry.hasPrivacyEvidence, true);
  /* Attributed to the supplier rather than named (2026-09-28): a privacy
     claim must say whose claim it is, and the brochure names no vendor. The
     assertion is on the attribution, which is what protects a reader. */
  assert.ok(entry.supportedClaims.some((claim) => /^The supplier states/.test(claim)));
  assert.ok(entry.blockedClaims.some((claim) => /GDPR compliance statement/i.test(claim)));
});

test("the Bosch camera image is infrastructure, never a capability", () => {
  const visual = implementationVisuals.find(
    (item) => item.implementationId === "impl-isarsoft-camera-analytics",
  );
  assert.ok(visual);
  assert.equal(visual.showsInfrastructureOnly, true);
  // The camera model is not the name of anything in the model.
  const modelSurface = [
    ...technologyCapabilities.map((item) => `${item.id} ${item.name}`),
    ...technologyImplementations.map((item) => `${item.id} ${item.implementationRole}`),
  ]
    .join(" ")
    .toLowerCase();
  assert.doesNotMatch(modelSurface, /bosch|3100i/);
  // Nor does the alt text turn the photograph into an analytics claim.
  assert.doesNotMatch(visual.altText, /count|classif|re-identif|privacy|accura/i);
});

test("Isarsoft shows no invented technical detail table", () => {
  const profile = implementationRequirementProfiles.find(
    (item) => item.implementationId === "impl-isarsoft-camera-analytics",
  );
  assert.equal(profile.technicalDetail.length, 0);

  const groups = getSolutionImplementationOptions("solution-capture-and-visits", "presentation");
  const option = groups
    .flatMap((group) => group.options)
    .find((item) => item.implementationId === "impl-isarsoft-camera-analytics");
  assert.ok(option);
  assert.equal(option.detailUnavailableNote, IMPLEMENTATION_DETAIL_ON_REQUEST);
});

/* ==================================================================
   TATTILE — vehicle intelligence, architecture only
   ================================================================== */

test("Tattile is vehicle intelligence, not people counting", () => {
  const tattile = impl("impl-tattile-anpr-vehicle");
  assert.ok(tattile);
  assert.equal(tattile.supplier, "Tattile");
  assert.match(blocked("impl-tattile-anpr-vehicle"), /one vehicle is never one visitor/i);
  assert.match(blocked("impl-tattile-anpr-vehicle"), /Property footfall/i);
  for (const claim of tattile.supportedClaims) {
    assert.doesNotMatch(claim, /people counting|visitor count|footfall/i);
  }
});

test("Tattile is not exposed as Retail entrance technology", () => {
  const retail = contentBundle.segments.find((segment) => segment.id === "retail");
  // No Retail scene declares the vehicle capability at all.
  for (const scene of retail.scenes) {
    assert.ok(!scene.technologyCapabilityIds.includes("TECH-06"));
  }
  // So no Retail solution direction can reach it.
  const reachable = [
    "solution-location-opportunity",
    "solution-capture-and-visits",
    "solution-in-store-intelligence",
    "solution-performance-intelligence",
  ].flatMap((id) =>
    getSolutionTechnologyDrilldown(id).capabilities.flatMap((entry) =>
      entry.implementations.map((item) => item.id),
    ),
  );
  assert.ok(!reachable.includes("impl-tattile-anpr-vehicle"));
  // And it is not an entrance implementation.
  assert.ok(!impl("impl-tattile-anpr-vehicle").capabilityIds.includes("TECH-02"));
});

test("Tattile privacy is implementation-specific and never inherited", () => {
  const tattile = impl("impl-tattile-anpr-vehicle");
  assert.equal(tattile.privacyStatus, "requires_product_validation");

  for (const donorId of [
    "impl-xovis-3d-entrance",
    "impl-xovis-3d-spatial",
    "impl-milesight-vs125p-entrance",
    "impl-milesight-vs361-passerby",
  ]) {
    const donor = impl(donorId);
    assert.notEqual(tattile.privacyStatus, donor.privacyStatus);
    for (const claim of donor.supportedClaims) {
      assert.ok(!tattile.supportedClaims.includes(claim));
    }
    for (const ref of donor.sourceRefs) {
      assert.ok(!tattile.sourceRefs.includes(ref));
    }
  }
});

test("ANPR never silently resolves as anonymous sensing", () => {
  assert.match(blocked("impl-tattile-anpr-vehicle"), /a licence plate is anonymous/i);
  assert.match(blocked("impl-tattile-anpr-vehicle"), /Generic GDPR compliance/i);
  const vehicle = technologyCapabilities.find((item) => item.id === "TECH-06");
  assert.match(vehicle.privacyPrinciple, /only where lawful and configured/i);
});

test("vehicle registration origin stays vehicle-registration context", () => {
  assert.match(blocked("impl-tattile-anpr-vehicle"), /not visitor home origin|registration origin as visitor home origin/i);
  const origin = vehicleEvidenceSemantics.find((item) => item.unit === "registration_origin");
  assert.match(origin.meaning, /registered/i);
  assert.ok(origin.isNot.some((line) => /where a person lives/i.test(line)));
  assert.ok(origin.isNot.some((line) => /home location/i.test(line)));
});

test("a vehicle count never resolves as people visits", () => {
  for (const unit of vehicleEvidenceUnits) {
    assert.equal(resolvesAsPeopleEvidence(unit), false);
  }
  const count = vehicleEvidenceSemantics.find((item) => item.unit === "vehicle_count");
  assert.ok(count.isNot.some((line) => /number of people/i.test(line)));
  assert.ok(count.isNot.some((line) => /footfall/i.test(line)));
});

test("vehicle dwell requires compatible vehicle events", () => {
  // A bare vehicle count is not enough.
  assert.equal(vehicleUnitAvailable("vehicle_dwell", ["vehicle_events"]), false);
  assert.equal(
    vehicleUnitAvailable("vehicle_dwell", ["vehicle_events", "trip_duration_events"]),
    true,
  );
  assert.equal(vehicleUnitAvailable("vehicle_visit", ["vehicle_events"]), false);
  assert.equal(vehicleUnitAvailable("vehicle_count", ["vehicle_events"]), true);
});

test("vehicle semantics validate structurally", () => {
  assert.deepEqual(validateVehicleSemantics(), []);
});

/* ==================================================================
   PRIVACY SOURCE ISOLATION
   ================================================================== */

test("privacy evidence never leaks between implementations", () => {
  // Every supported claim belongs to exactly one implementation, except where
  // two products genuinely share a certificate whose own scope names both.
  const xovisPc2se = impl("impl-xovis-3d-entrance");
  const xovisPfl = impl("impl-xovis-3d-spatial");
  const others = [
    "impl-milesight-vs125p-entrance",
    "impl-milesight-vs361-passerby",
    "impl-isarsoft-camera-analytics",
    "impl-lidar-spatial",
    "impl-tattile-anpr-vehicle",
  ].map(impl);

  const xovisRefs = new Set([...xovisPc2se.sourceRefs, ...xovisPfl.sourceRefs]);
  for (const other of others) {
    for (const ref of other.sourceRefs) {
      assert.ok(!xovisRefs.has(ref), `${other.id} must not cite a Xovis source`);
    }
  }

  // The two Xovis products still carry their own technical sources.
  assert.notDeepEqual(xovisPc2se.sourceRefs, xovisPfl.sourceRefs);
  assert.match(blocked("impl-xovis-3d-spatial"), /3D Sensor Basic FoV's specifications/);
});

test("no implementation claims equivalence with another", () => {
  for (const item of technologyImplementations) {
    for (const claim of item.supportedClaims) {
      assert.doesNotMatch(claim, /equivalent to|same as|as accurate as|better than/i);
    }
  }
});

/* ==================================================================
   GEO STAYS CONTEXT
   ================================================================== */

test("the catchment visual is geo context, never physical measurement", () => {
  const geo = capabilityContextVisuals.find((item) => item.capabilityId === "TECH-07");
  assert.ok(geo);
  assert.equal(geo.illustrative, true);
  assert.match(geo.caption, /does not replace it/i);
  // It hangs off the geo capability only.
  assert.equal(capabilityContextVisuals.length, 1);

  const capability = technologyCapabilities.find((item) => item.id === "TECH-07");
  assert.match(capability.privacyPrinciple, /cannot replace direct entrance measurement/i);
  assert.deepEqual(capability.evidenceTypes, ["connected", "derived"]);
  // Geo is never a measured layer.
  assert.ok(!capability.evidenceTypes.includes("measured"));
});

test("passer-by measurement and geo context stay separate capabilities", () => {
  const outside = getSolutionTechnologyDrilldown("solution-location-opportunity");
  const ids = outside.capabilities.map((entry) => entry.capabilityId);
  assert.ok(ids.includes("TECH-01"));
  assert.ok(ids.includes("TECH-07"));
  assert.notEqual("TECH-01", "TECH-07");

  // VS361 belongs to the physical capability, never to the geo one.
  const geo = outside.capabilities.find((entry) => entry.capabilityId === "TECH-07");
  assert.ok(!geo.implementations.some((item) => item.id === "impl-milesight-vs361-passerby"));
});

/* ==================================================================
   ASSET AND SOURCE SAFETY
   ================================================================== */

test("every referenced product image exists on disk", () => {
  for (const visual of [...implementationVisuals, ...capabilityContextVisuals]) {
    const filePath = path.join(publicDir, visual.assetPath.replace(/^\//, ""));
    assert.ok(existsSync(filePath), `missing asset: ${visual.assetPath}`);
  }
});

/**
 * Same guard, for footage.
 *
 * A missing video does not 404 loudly — it renders as a black frame with dead
 * controls, which is indistinguishable from "the demo machine is being slow"
 * until someone presses play in front of a customer. Every served path is
 * checked, including the nested derived layer, which is the one most likely to
 * be forgotten precisely because it is one click further in.
 *
 * Deliberately one-directional. Unlike the technology image tree there is no
 * "every file is referenced" counterpart here: `public/assets/videos/` also
 * holds camera masters and footage held for future work, and an orphan guard
 * would turn "a file is waiting to be used" into a failing build.
 */
test("every video an explainer serves exists on disk", () => {
  const served = [];
  for (const video of capabilityExplainerVideos) {
    served.push(video.src);
    if (video.originalSrc) served.push(video.originalSrc);
    if (video.followOn) served.push(video.followOn.src);
  }
  assert.ok(served.length >= 4, "the explainer videos are still wired up");

  for (const assetPath of served) {
    assert.match(
      assetPath,
      /^\/assets\/videos\/[a-z0-9]+(-[a-z0-9]+)*\.(mp4|mov)$/,
      `not a canonical kebab-case video path: ${assetPath}`,
    );
    assert.ok(
      existsSync(path.join(publicDir, assetPath.replace(/^\//, ""))),
      `missing video asset: ${assetPath}`,
    );
  }

  // The exact files this task wired in, named explicitly. A silent rename would
  // otherwise still satisfy the generic guard above by pointing somewhere else.
  const lidar = capabilityExplainerVideos.find((video) => video.capabilityId === "TECH-04");
  assert.ok(lidar, "spatial movement intelligence still has an explainer video");
  assert.equal(lidar.src, "/assets/videos/lidar-in-a-store-pfm.mp4");
  assert.equal(lidar.followOn.src, "/assets/videos/lidar-tracking-reporting-visual.mp4");
  // Both were supplied web-compatible, so there is no camera master beside them
  // and no transcoding step to keep in sync.
  assert.equal(lidar.originalSrc, null);
});

/**
 * Filename drift is silent: a renamed file leaves the reference pointing at a
 * 404 that only shows up as a blank frame in a live demo. Two guards close it
 * from both sides — every reference resolves, and every file is referenced —
 * plus a naming rule so the canonical form cannot quietly re-fragment into
 * underscores, plurals and mixed case.
 */
test("technology asset filenames are canonical kebab-case", () => {
  for (const visual of implementationVisuals) {
    assert.match(
      visual.assetPath,
      /^\/assets\/technology\/[a-z0-9-]+\/[a-z0-9]+(-[a-z0-9]+)*\.(jpg|png|webp)$/,
      `not canonical kebab-case: ${visual.assetPath}`,
    );
    assert.ok(
      !visual.assetPath.includes("_"),
      `underscore in asset path: ${visual.assetPath}`,
    );
  }
});

test("no unreferenced file is left under public/assets/technology", () => {
  const root = path.join(publicDir, "assets/technology");
  const referenced = new Set(
    // Three families now live under this tree: product photographs keyed by
    // implementation, measurement-principle explainers keyed by capability, and
    // explainers a SEGMENT substitutes for a capability where that segment is
    // measured differently. The third was added when Shopping Centre stopped
    // sharing Retail's 3D-sensor account of TECH-04; without it, a correctly
    // wired segment asset reads as an orphan.
    [
      ...implementationVisuals,
      ...capabilityExplainerVisuals,
      ...segmentCapabilityMediaOverrides.flatMap(
        (override) => override.explainerVisuals ?? [],
      ),
      // A fourth family, 2026-09-27: explainers the DRAWER attaches per
      // segment, kept out of the shared registry so the approved Configure
      // previews are not changed by them.
      ...drawerExplainerVisuals,
    ].map((visual) => path.join(publicDir, visual.assetPath.replace(/^\//, ""))),
  );

  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      // Finder metadata is not an asset.
      if (entry.name === ".DS_Store") return [];
      return [full];
    });

  for (const file of walk(root)) {
    assert.ok(
      referenced.has(file),
      `orphan asset not referenced by any implementation visual: ${path.relative(publicDir, file)}`,
    );
  }
});

/* ------------------------------------------------------------------
   ISARSOFT ASSET FOLDER
   Human product decision, 2026-08-18: the photograph lives under an
   analytics-family folder, not under a measurement-position folder,
   because Isarsoft is multi-capability and the filesystem location
   must not assert a single-capability membership.
   ------------------------------------------------------------------ */

test("the Isarsoft photograph lives under isarsoft/, not under a position folder", () => {
  const visual = implementationVisuals.find(
    (item) => item.implementationId === "impl-isarsoft-camera-analytics",
  );
  assert.ok(visual, "the Isarsoft implementation still has a visual");
  /* Renamed 2026-09-27: the product lead identified the photograph as a
     FLEXIDOME 5100i, not the 3100i its old filename claimed. The folder still
     asserts no single capability; the filename no longer names the wrong
     product. */
  assert.equal(visual.assetPath, "/assets/technology/isarsoft/bosch-flexidome-5100i.jpg");
  assert.ok(existsSync(path.join(publicDir, "assets/technology/isarsoft/bosch-flexidome-5100i.jpg")));
  assert.ok(!existsSync(path.join(publicDir, "assets/technology/isarsoft/bosch-3100i.jpg")));

  // Moving it must not turn an infrastructure photograph into evidence of
  // analytics. The folder name changed; the claim it carries did not.
  assert.equal(visual.showsInfrastructureOnly, true);
});

test("no stale entrance/bosch-3100i path survives anywhere in the repo", () => {
  assert.ok(
    !existsSync(path.join(publicDir, "assets/technology/entrance/bosch-3100i.jpg")),
    "the old file was moved, not copied",
  );

  // Content surface, and then the documents that describe it. A rename that
  // updates the code but leaves the registry pointing at the old folder is
  // exactly the silent drift the source registry exists to prevent.
  const surface = [
    ...implementationVisuals.map((item) => item.assetPath),
    ...capabilityContextVisuals.map((item) => item.assetPath),
    ...capabilityExplainerVisuals.map((item) => item.assetPath),
  ].join(" ");
  assert.doesNotMatch(surface, /entrance\/bosch/);

  for (const relative of [
    "docs/reference/technology/SOURCE-REGISTRY.md",
    "app/content/technology-visuals.ts",
  ]) {
    const text = readFileSync(path.join(repoRoot, relative), "utf8");
    assert.doesNotMatch(
      text,
      /technology\/entrance\/bosch-3100i/,
      `${relative} still cites the superseded entrance/ path`,
    );
  }
});

test("only the Isarsoft asset moved; the position folders keep their assets", () => {
  // Scoped deliberately. This was a single-asset correction, not a licence to
  // reorganise the tree, and the other three families must be provably intact.
  const expected = {
    "impl-xovis-3d-entrance": "/assets/technology/entrance/xovis-pc2se.jpg",
    "impl-milesight-vs125p-entrance": "/assets/technology/entrance/milesight-vs125p.png",
    "impl-milesight-vs361-passerby": "/assets/technology/passerby/milesight-vs361.jpg",
    "impl-lidar-spatial": "/assets/technology/spatial/robosense-airy.webp",
    "impl-xovis-3d-spatial": "/assets/technology/spatial/xovis-pf-l.jpg",
  };
  for (const [id, assetPath] of Object.entries(expected)) {
    const visual = implementationVisuals.find((item) => item.implementationId === id);
    assert.ok(visual, `${id} still has a visual`);
    assert.equal(visual.assetPath, assetPath, `${id} must not have moved`);
  }
});

test("the six what-is-needed implementations are unchanged by the asset move", () => {
  // The move was a filesystem fact. Capability -> implementation resolution is
  // the thing it must not have touched.
  assert.deepEqual(
    implementationVisuals.map((item) => item.implementationId),
    [
      "impl-xovis-3d-entrance",
      "impl-milesight-vs125p-entrance",
      "impl-isarsoft-camera-analytics",
      // Added 2026-09-27 with their own product photographs. Additions, not
      // reorderings: the six that were here are unchanged and in place.
      "impl-xovis-3d-entrance-outdoor",
      "impl-hme-zoom-nitro-timer",
      "impl-ip-detection-indoor",
      "impl-ip-detection-outdoor",
      "impl-milesight-vs361-passerby",
      "impl-lidar-spatial",
      "impl-xovis-3d-spatial",
    ],
  );
  assert.deepEqual(
    getImplementationsForCapability("TECH-02").map((item) => item.id),
    [
      "impl-xovis-3d-entrance",
      "impl-milesight-vs125p-entrance",
      "impl-isarsoft-camera-analytics",
      "impl-xovis-3d-entrance-outdoor",
      "impl-ip-detection-indoor",
      "impl-ip-detection-outdoor",
    ],
  );
  assert.deepEqual(
    getImplementationsForCapability("TECH-04").map((item) => item.id),
    ["impl-ip-detection-indoor", "impl-ip-detection-outdoor", "impl-lidar-spatial", "impl-xovis-3d-spatial"],
  );
});

/* ------------------------------------------------------------------
   MEASUREMENT-PRINCIPLE EXPLAINERS
   ------------------------------------------------------------------ */

test("every explainer asset resolves, in a folder that matches its segment", () => {
  // Four Retail explainers under the shared folder, plus five QSR explainers
  // under the QSR technology folder. A shared capability id does not authorise
  // shared footage, so a segment-scoped path must name that visual's own
  // segment.
  assert.equal(capabilityExplainerVisuals.length, 9);
  for (const visual of capabilityExplainerVisuals) {
    const filePath = path.join(publicDir, visual.assetPath.replace(/^\//, ""));
    assert.ok(existsSync(filePath), `missing explainer asset: ${visual.assetPath}`);
    assert.match(
      visual.assetPath,
      new RegExp(
        `^/assets/technology/(explainers|${visual.segment})/[a-z0-9]+(-[a-z0-9]+)*\\.(png|jpg|webp)$`,
      ),
      `not a canonical explainer path for ${visual.segment}: ${visual.assetPath}`,
    );
  }
});

test("no explainer reaches a segment it is not true of", () => {
  const bySegment = new Map();
  for (const visual of capabilityExplainerVisuals) {
    bySegment.set(visual.segment, (bySegment.get(visual.segment) ?? 0) + 1);
  }
  assert.deepEqual([...bySegment.entries()].sort(), [["qsr", 5], ["retail", 4]]);
  // Retail's street explainers must not resolve for any other segment, even
  // though other segments declare the same capability ids.
  for (const segment of ["shopping-centre", "retail-park", "outlet-centre", "qsr"]) {
    for (const capabilityId of ["TECH-01", "TECH-02"]) {
      assert.equal(
        getAllCapabilityExplainerVisuals(capabilityId).filter((v) => v.segment === segment).length,
        0,
        `${capabilityId} must not resolve a Retail explainer for ${segment}`,
      );
    }
  }
});

test("an explainer explains a principle and is never an implementation", () => {
  const implIds = new Set(technologyImplementations.map((item) => item.id));
  for (const visual of capabilityExplainerVisuals) {
    // The identity of an explainer is capability + approach. If an approach ID
    // were an implementation ID, "How we do this" would have quietly become a
    // second product list.
    assert.ok(
      !implIds.has(visual.approachId),
      `${visual.approachId} is an implementation ID, not a measurement approach`,
    );
    assert.equal(visual.showsSensorHardware, false);
    assert.equal(visual.illustrative, true);

    // Vendor-neutral naming. The approach names a physical principle; a
    // supplier name here would make the method sound proprietary.
    for (const supplier of ["Xovis", "Milesight", "RoboSense", "Bosch", "Isarsoft"]) {
      assert.doesNotMatch(
        visual.approachName,
        new RegExp(supplier, "i"),
        `${visual.approachId} names a supplier in its approach name`,
      );
    }

    // Site-requirement vocabulary belongs to "What is needed". Letting it leak
    // in here is what collapses the two depth layers into one product page.
    assert.doesNotMatch(
      visual.explanation,
      /\bPoE\b|Ethernet|mounting height|IP65|volts?\b|watt/i,
      `${visual.approachId} explains installation rather than measurement`,
    );

    // Where it points at an implementation, that implementation really uses it.
    if (visual.illustratesImplementationId) {
      const implementation = getImplementation(visual.illustratesImplementationId);
      assert.ok(implementation, `${visual.approachId} names a real implementation`);
      assert.ok(implementation.capabilityIds.includes(visual.capabilityId));
    }
  }
});

test("no explainer reuses a product photograph, and no product photo is an explainer", () => {
  // The two families must not share a file. A hardware photo standing in for a
  // measurement principle is precisely the substitution this family exists to
  // make unnecessary.
  const explainerPaths = new Set(capabilityExplainerVisuals.map((item) => item.assetPath));
  for (const visual of implementationVisuals) {
    assert.ok(
      !explainerPaths.has(visual.assetPath),
      `${visual.implementationId} shares a file with an explainer`,
    );
    assert.ok(!visual.assetPath.includes("/explainers/"));
  }
});

test("LiDAR and 3D tracking are two approaches, not one merged in-store visual", () => {
  const spatial = getAllCapabilityExplainerVisuals("TECH-04");
  assert.equal(spatial.length, 2, "spatial intelligence keeps both approaches");

  const ids = spatial.map((item) => item.approachId);
  assert.deepEqual(ids, ["lidar-point-cloud", "3d-path-tracking"]);

  // Genuinely distinct: different files, different names, different words.
  assert.notEqual(spatial[0].assetPath, spatial[1].assetPath);
  assert.notEqual(spatial[0].approachName, spatial[1].approachName);
  assert.notEqual(spatial[0].explanation, spatial[1].explanation);

  // Each is tied to the implementation that actually uses that method, so the
  // two cannot be swapped without the validator noticing.
  assert.equal(spatial[0].illustratesImplementationId, "impl-lidar-spatial");
  assert.equal(spatial[1].illustratesImplementationId, "impl-xovis-3d-spatial");

  // Neither is presented as the default or the better one.
  const surface = spatial.map((item) => `${item.approachName} ${item.explanation}`).join(" ");
  assert.doesNotMatch(surface, /\bbest\b|\bpreferred\b|\brecommended\b|\bsuperior\b|\bdefault\b/i);
});

test("explainers attach to the capabilities they explain, and nowhere else", () => {
  assert.equal(getAllCapabilityExplainerVisuals("TECH-01").length, 1);
  assert.equal(getAllCapabilityExplainerVisuals("TECH-02").length, 1);
  assert.equal(getAllCapabilityExplainerVisuals("TECH-04").length, 2);

  // Geo stays a context visual, not a measurement explainer. This is the
  // mobile/geo-vs-physical boundary in AGENTS.md expressed as a type: aggregate
  // area context must never be filed as a physical measurement principle.
  assert.equal(getAllCapabilityExplainerVisuals("TECH-07").length, 0);
  const geo = capabilityContextVisuals.find((item) => item.capabilityId === "TECH-07");
  assert.ok(geo);
  assert.equal(geo.assetPath, "/assets/context/catchment-area-reference.png");
  assert.equal(geo.illustrative, true);
  assert.match(geo.caption, /does not replace it/i);
  assert.ok(
    !geo.assetPath.includes("/technology/"),
    "the geo reference is context, so it does not live in the technology tree",
  );
});

test("the drilldown carries explainers into Outside, Entrance and Inside", () => {
  const outside = getSolutionTechnologyDrilldown("solution-location-opportunity");
  const passerby = outside.capabilities.find((entry) => entry.capabilityId === "TECH-01");
  assert.equal(passerby.explainerVisuals.length, 1);
  assert.equal(passerby.explainerVisuals[0].approachId, "frontage-beam");

  // Outside carries both, and they stay separate concepts on separate
  // capabilities: physical frontage measurement, and aggregate area context.
  const geo = outside.capabilities.find((entry) => entry.capabilityId === "TECH-07");
  assert.equal(geo.explainerVisuals.length, 0);
  assert.ok(geo.contextVisual, "geo keeps its context map");
  assert.equal(passerby.contextVisual, null, "the physical capability has no context map");

  const inside = getSolutionTechnologyDrilldown("solution-in-store-intelligence");
  const spatial = inside.capabilities.find((entry) => entry.capabilityId === "TECH-04");
  assert.equal(spatial.explainerVisuals.length, 2);
});

test("no explainer changes what a capability or implementation may claim", () => {
  // The visual layer is decoration over the truth model, never a source for it.
  // Asserted against the real current values rather than trivially: an explainer
  // exists for TECH-04, and the LiDAR analytics layer is still the unsourced
  // thing it was before the picture was added.
  const lidar = getImplementation("impl-lidar-spatial");
  assert.ok(getAllCapabilityExplainerVisuals("TECH-04").length > 0);
  assert.ok(
    lidar.unsupportedClaims.length > 0,
    "adding an explainer did not quietly clear the blocked claims",
  );

  // Isarsoft has no explainer image at all, by decision: its explanation stays
  // text-only, because a picture of a measurement principle would imply which
  // single measurement it performs.
  assert.equal(getAllCapabilityExplainerVisuals("TECH-03").length, 0);

  // And no explainer string smuggles in a number, a rate or a guarantee.
  for (const visual of capabilityExplainerVisuals) {
    assert.doesNotMatch(
      `${visual.approachName} ${visual.explanation}`,
      /\d+\s*%|accuracy|guarantee|uplift|ROI|payback|benchmark/i,
      `${visual.approachId} carries a performance claim`,
    );
  }
});

test("no stale re-id or carpark asset path remains", () => {
  assert.ok(!existsSync(path.join(publicDir, "assets/technology/re-id")));
  assert.ok(!existsSync(path.join(publicDir, "assets/technology/carpark")));
  const surface = [
    ...implementationVisuals.map((item) => item.assetPath),
    ...capabilityContextVisuals.map((item) => item.assetPath),
    ...technologyImplementations.map((item) => item.id),
  ].join(" ");
  assert.doesNotMatch(surface, /technology\/re-id|technology\/carpark/);
});

test("no generic carpark implementation remains; vehicle work is Tattile-shaped", () => {
  const ids = technologyImplementations.map((item) => item.id);
  assert.ok(!ids.some((id) => /carpark/i.test(id)));
  assert.ok(ids.includes("impl-tattile-anpr-vehicle"));
});

test("every source reference in the registry resolves to a real file", () => {
  const registry = readFileSync(registryPath, "utf8");
  const paths = [...registry.matchAll(/^\*\*File:\*\*\s*`([^`]+)`/gm)]
    .map((match) => match[1])
    .filter((entry) => !/^https?:\/\//i.test(entry));
  assert.ok(paths.length >= 10, "the registry must describe the real source documents");
  for (const relative of paths) {
    const filePath = path.join(repoRoot, "docs/reference/technology", relative);
    assert.ok(existsSync(filePath), `registry cites a missing file: ${relative}`);
  }
});

test("every implementation source ref names the registry or a known source", () => {
  const registry = readFileSync(registryPath, "utf8");
  for (const item of technologyImplementations) {
    assert.ok(item.sourceRefs.length > 0, `${item.id} has no source reference`);
    for (const ref of item.sourceRefs) {
      for (const id of ref.match(/SRC-[A-Z0-9-]+/g) ?? []) {
        assert.ok(registry.includes(id), `${item.id} cites unknown source ${id}`);
      }
    }
  }
});

/* ==================================================================
   NO CATALOGUE, NO RANKING, NO PRICING
   ================================================================== */

test("solution content, imagery and requirement profiles validate", () => {
  assert.deepEqual(validateSolutionDirections(), []);
});

test("what-is-needed shows one hero per capability, with alternatives not a grid", () => {
  const entrance = getSolutionImplementationOptions("solution-capture-and-visits");
  const tech02 = entrance.find((group) => group.capabilityId === "TECH-02");
  assert.ok(tech02);
  assert.ok(tech02.options.length >= 3, "the alternatives are present");
  // Each option is one hero's worth of content: three site concerns, no more.
  for (const option of tech02.options) {
    assert.equal(option.essentials.length, 3);
  }
  // An implementation family is offered once, not once per capability.
  const allIds = entrance.flatMap((group) =>
    group.options.map((option) => option.implementationId),
  );
  assert.equal(new Set(allIds).size, allIds.length);
});

test("performance intelligence installs nothing, so it shows no hardware", () => {
  assert.deepEqual(getSolutionImplementationOptions("solution-performance-intelligence"), []);
});

test("each direction's site section answers that direction's own question", () => {
  // Entrance asks about the door. The passer-by sensor belongs to Outside and
  // must not reappear here under a second heading.
  const entrance = getSolutionImplementationOptions("solution-capture-and-visits");
  assert.deepEqual(
    entrance.map((group) => group.capabilityId),
    ["TECH-02"],
  );
  const entranceIds = entrance.flatMap((group) =>
    group.options.map((option) => option.implementationId),
  );
  assert.ok(!entranceIds.includes("impl-milesight-vs361-passerby"));
  assert.ok(entranceIds.includes("impl-xovis-3d-entrance"));
  assert.ok(entranceIds.includes("impl-milesight-vs125p-entrance"));
  assert.ok(entranceIds.includes("impl-isarsoft-camera-analytics"));

  const outside = getSolutionImplementationOptions("solution-location-opportunity");
  assert.deepEqual(
    outside.map((group) => group.capabilityId),
    ["TECH-01"],
  );
  // Geo installs nothing, so it never appears as something to put on site.
  assert.ok(!outside.some((group) => group.capabilityId === "TECH-07"));

  // Inside offers the two spatial options plus multi-camera matching as a
  // third possible approach — and the third is not a spatial implementation.
  const inside = getSolutionImplementationOptions("solution-in-store-intelligence");
  assert.deepEqual(
    inside.map((group) => group.capabilityId),
    ["TECH-04", "TECH-05"],
  );
  const spatial = inside.find((group) => group.capabilityId === "TECH-04");
  assert.deepEqual(
    spatial.options.map((option) => option.implementationId).sort(),
    ["impl-lidar-spatial", "impl-xovis-3d-spatial"].sort(),
  );
  const matching = inside.find((group) => group.capabilityId === "TECH-05");
  assert.deepEqual(
    matching.options.map((option) => option.implementationId),
    ["impl-isarsoft-camera-analytics"],
  );
});

test("no ranking, recommendation or pricing exists anywhere in the options", () => {
  const groups = [
    "solution-location-opportunity",
    "solution-capture-and-visits",
    "solution-in-store-intelligence",
  ].flatMap((id) => getSolutionImplementationOptions(id));

  for (const group of groups) {
    for (const option of group.options) {
      for (const field of ["rank", "score", "price", "cost", "recommended", "preferred", "default", "best"]) {
        assert.equal(field in option, false, `${option.implementationId} exposes ${field}`);
      }
      const surface = JSON.stringify(option);
      assert.doesNotMatch(surface, /€|\$|\bprice\b|\bcost\b|per month|recommended/i);
    }
  }
});

test("presentation mode hides product input that is not source-mapped", () => {
  const sales = getSolutionImplementationOptions("solution-in-store-intelligence", "sales");
  const presenting = getSolutionImplementationOptions("solution-in-store-intelligence", "presentation");

  const rowsFor = (groups, id) =>
    groups
      .flatMap((group) => group.options)
      .find((option) => option.implementationId === id).technicalDetail;

  const salesRows = rowsFor(sales, "impl-lidar-spatial");
  const presentingRows = rowsFor(presenting, "impl-lidar-spatial");

  assert.ok(salesRows.some((row) => row.status === "user_approved_product_input"));
  assert.ok(!presentingRows.some((row) => row.status === "user_approved_product_input"));
  assert.ok(presentingRows.length > 0, "source-backed rows still reach a prospect");
});

test("no source ID or document path can reach a prospect", () => {
  const presenting = [
    "solution-location-opportunity",
    "solution-capture-and-visits",
    "solution-in-store-intelligence",
    "solution-performance-intelligence",
  ].flatMap((id) => getSolutionImplementationOptions(id, "presentation"));

  const surface = JSON.stringify(presenting);
  assert.doesNotMatch(surface, /SRC-[A-Z]/);
  assert.doesNotMatch(surface, /\.pdf/i);
  assert.doesNotMatch(surface, /SOURCE-REGISTRY/);
  assert.doesNotMatch(surface, /requires_source_mapping|requires_product_validation/);
});

test("the PC2SE-O rests on its own datasheet, and its certification stays unmapped", () => {
  const impl = getImplementation("impl-xovis-3d-entrance-outdoor");
  const refs = impl.sourceRefs.join(" ");
  const registryText = readFileSync(
    fileURLToPath(new URL("../docs/reference/technology/SOURCE-REGISTRY.md", import.meta.url)),
    "utf8",
  );

  // Its own datasheet, on disk and in the registry.
  assert.match(refs, /SRC-XOVIS-PC2SE-O-TECH-001/);
  assert.ok(
    existsSync(fileURLToPath(new URL(
      "../docs/reference/technology/xovis/pc2se-o/technical/Xovis-TechnicalDatasheet-PC2SE-O-EN-V4.0.pdf",
      import.meta.url,
    ))),
  );
  assert.match(registryText, /### SRC-XOVIS-PC2SE-O-TECH-001[\s\S]*?\*\*Supports:\*\* `impl-xovis-3d-entrance-outdoor`/);

  // Its figures are its own; the indoor sensor's are not carried across.
  const claims = impl.supportedClaims.join(" ");
  assert.match(claims, /-33 °C to \+40 °C/);
  assert.match(claims, /9 lux/);
  assert.doesNotMatch(claims, /0 °C to 45 °C|2 lux|IP40/);
  assert.doesNotMatch(refs, /SRC-XOVIS-PC2SE-TECH-001/);

  // The certificate names the PC2SE, not the PC2SE-O: no certification claimed.
  const privacy = registryText.slice(registryText.indexOf("### SRC-XOVIS-PRIVACY-001"));
  assert.doesNotMatch(privacy.split("\n").find((l) => l.startsWith("**Supports:**")), /entrance-outdoor/);
  assert.doesNotMatch(claims, /certif/i);
  assert.ok(impl.unsupportedClaims.some((c) => /^A privacy certification/.test(c)));
  assert.equal(impl.privacyStatus, "partially_source_backed");
  assert.equal(impl.technicalDetailStatus, "source_backed");
});
