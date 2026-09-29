/**
 * The brochure names a capability, never a part number.
 *
 * A vendor name on a device card turns a conversation about a location into a
 * conversation about procurement. The names stay in the model — a requirement
 * profile is attached to a product, and every technical claim traces back to
 * that product's documentation — but they stop at the presentation boundary.
 *
 * What these hold is the boundary itself, in both directions: nothing a
 * prospect reads carries a vendor, and nothing in the model's audit chain was
 * removed to achieve that.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { technologyImplementations } from "../app/content/technology.ts";
import { segmentDefinitions, allScenes } from "../app/content/segments/index.ts";
import { getSceneCapabilityViews, getScenePrivacyEntries } from "../app/content/scene-technology-runtime.ts";
import { resolveLimitationClaim, resolveSupportedClaim } from "../app/i18n/domain-claims.ts";
import { locales } from "../app/i18n/locales.ts";
import {
  accessoriesFor,
  implementationAccessories,
  implementationPresentationNames,
  presentationNameOf,
  presentationNamesAwaitingImplementation,
  staffExclusionFor,
  staffExclusionOptions,
} from "../app/content/technology-presentation.ts";

const read = (p) => readFileSync(fileURLToPath(new URL(`../${p}`, import.meta.url)), "utf8");
const VENDORS = ["Xovis", "Milesight", "Tattile", "RoboSense", "Isarsoft", "HME", "Bosch"];

test("1. no implementation a prospect can reach resolves to a vendor or a model", () => {
  for (const implementation of technologyImplementations) {
    const shown = presentationNameOf(implementation);

    assert.ok(shown && shown.length > 0, `${implementation.id} resolves to no name at all`);

    for (const vendor of VENDORS) {
      assert.ok(
        !shown.includes(vendor),
        `${implementation.id} shows the vendor "${vendor}" as "${shown}"`,
      );
    }
    if (implementation.product) {
      assert.notEqual(shown, implementation.product, `${implementation.id} shows its model number`);
    }
  }
});

test("2. every vendor-named implementation is covered by an explicit decision", () => {
  /* The safe direction: no entry means the ROLE is shown, never the vendor. A
     device added tomorrow is therefore vendor-free by default, and naming one
     becomes a deliberate act rather than an oversight. */
  for (const implementation of technologyImplementations.filter((i) => i.supplier)) {
    const named = implementationPresentationNames[implementation.id];
    const role = implementation.implementationRole;
    assert.ok(
      named || (role && role.length > 0),
      `${implementation.id} has neither a presentation name nor a usable role`,
    );
    if (!named) {
      for (const vendor of VENDORS) {
        assert.ok(!role.includes(vendor), `${implementation.id} falls back to a role naming ${vendor}`);
      }
    }
  }
});

test("3. the presentation layer removed nothing from the audit chain", () => {
  // Supplier and product still exist in the model for every named device, so a
  // requirement profile and a privacy source can still be attached to them.
  const named = technologyImplementations.filter((i) => i.supplier);
  assert.ok(named.length >= 7, "the model lost its vendor-named implementations");
  for (const id of Object.keys(implementationPresentationNames)) {
    const implementation = technologyImplementations.find((i) => i.id === id);
    assert.ok(implementation, `${id} has a presentation name but is not in the model`);
    assert.ok(implementation.supplier, `${id} lost its supplier`);
  }
});

test("4. the drawer renders presentation names and never reads a supplier", () => {
  const panel = read("app/components/redesign/DepthPanel.tsx");
  assert.match(panel, /presentationNameOf/);
  // The three places a vendor used to reach the page.
  assert.doesNotMatch(panel, /impl\.supplier|impl\.product|entry\.supplier|entry\.product/);
});

test("5. a name decided for a device the model does not have is recorded, not dropped", () => {
  // Both Bosch sensors that waited here are now in the model, under the names
  // the product lead gave them — so nothing is waiting, and nothing was lost.
  assert.deepEqual([...presentationNamesAwaitingImplementation], []);
  assert.equal(presentationNameOf(technologyImplementations.find((i) => i.id === "impl-ip-detection-indoor")), "IP Detection Sensor indoor");
  assert.equal(presentationNameOf(technologyImplementations.find((i) => i.id === "impl-ip-detection-outdoor")), "IP Detection Sensor outdoor");
});

test("6. an accessory is attached to a real implementation, and says when it applies", () => {
  for (const accessory of implementationAccessories) {
    assert.ok(
      technologyImplementations.some((i) => i.id === accessory.implementationId),
      `${accessory.name} is attached to an implementation that does not exist`,
    );
    assert.ok(accessory.purpose.length > 20, `${accessory.name} does not say what it is for`);
    // `null` means always; a string must be a real condition, not an empty one.
    if (accessory.condition !== null) {
      assert.ok(accessory.condition.length > 10, `${accessory.name} has an empty condition`);
    }
  }

  // The two rules the product lead gave, resolved through the public helper.
  const lidar = accessoriesFor("impl-lidar-spatial");
  assert.equal(lidar.length, 1);
  assert.match(lidar[0].name, /LiDAR Processing unit/);
  assert.equal(lidar[0].condition, null, "the LiDAR unit is always required");

  const spatial = accessoriesFor("impl-xovis-3d-spatial");
  assert.equal(spatial.length, 1);
  assert.match(spatial[0].name, /3D Processing unit/);
  assert.match(spatial[0].condition, /nine/, "the threshold is not stated");

  // A sensor with no accessory gets none invented for it.
  assert.deepEqual(accessoriesFor("impl-milesight-vs361-passerby"), []);
});

test("7. staff exclusion stays narrow: one segment, one device family", () => {
  assert.equal(staffExclusionOptions.length, 1);
  const [option] = staffExclusionOptions;
  assert.equal(option.segment, "retail");
  assert.deepEqual([...option.implementationIds], ["impl-milesight-vs125p-entrance"]);
  // Both ways of wearing a tag are named, and the limit is stated.
  assert.match(option.body, /UWB/);
  assert.match(option.body, /lanyard/);
  assert.match(option.body, /this sensor family only/);

  // It resolves for Retail with that sensor, and for nothing else.
  assert.ok(staffExclusionFor("retail", ["impl-milesight-vs125p-entrance"]));
  assert.equal(staffExclusionFor("retail", ["impl-xovis-3d-entrance"]), null);
  assert.equal(staffExclusionFor("shopping-centre", ["impl-milesight-vs125p-entrance"]), null);
});

test("8. no vendor name reaches any scene's drawer, in any segment", () => {
  let checked = 0;
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);

      for (const view of getSceneCapabilityViews(segment.id, scene)) {
        for (const implementation of view.implementations) {
          const shown = presentationNameOf(implementation);
          for (const vendor of VENDORS) {
            assert.ok(
              !shown.includes(vendor),
              `${segment.id}/${sceneId}: "${shown}" names ${vendor}`,
            );
          }
          checked += 1;
        }
      }

      // The privacy section resolves its own heading; it must obey the same rule.
      for (const entry of getScenePrivacyEntries(segment.id, scene)) {
        const shown = presentationNameOf({
          id: entry.implementationId,
          implementationRole: entry.implementationRole,
        });
        for (const vendor of VENDORS) {
          assert.ok(!shown.includes(vendor), `${segment.id}/${sceneId} privacy: "${shown}" names ${vendor}`);
        }
      }
    }
  }
  /* Fewer cards than before 2026-09-27, by design: each segment now shows ONE
     IP detection sensor and several capabilities were narrowed to it. The
     floor guards against the loop silently checking nothing. */
  assert.ok(checked > 80, `only ${checked} implementation cards checked`);
});

/* The leak this catches: the card NAME was vendor-free while the photograph's
   alt text still read "A Xovis PC2SE overhead 3D stereo vision sensor" and a
   limitation line still said "Equivalence with Xovis PC2SE". A test that only
   checks the name passes on a page that names the vendor twice — so this one
   scans every string the drawer can put on screen, in all three languages. */
test("9. no string the drawer renders names a vendor, in any language", () => {
  const MODELS = ["PC2SE", "PF-L", "VS125", "VS361", "MK2", "Airy", "NEXEO", "3100i", "5100i"];
  const forbidden = [...VENDORS, ...MODELS];
  const offences = [];

  const scan = (where, text) => {
    if (!text) return;
    for (const term of forbidden) {
      if (String(text).includes(term)) offences.push(`${where}: "${text}" names ${term}`);
    }
  };

  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);
      for (const view of getSceneCapabilityViews(segment.id, scene)) {
        for (const impl of view.implementations) {
          const at = `${segment.id}/${sceneId}/${impl.id}`;
          scan(`${at} name`, presentationNameOf(impl));
          scan(`${at} role`, impl.implementationRole);
          scan(`${at} alt`, impl.visual?.altText);

          for (const locale of locales) {
            scan(`${at} limitation ${locale}`, resolveLimitationClaim(locale, impl.id, impl.blockedClaims[0]));
            impl.supportedClaims.forEach((claim, index) => {
              scan(`${at} supported[${index}] ${locale}`, resolveSupportedClaim(locale, impl.id, index, claim));
            });
          }

          for (const essential of impl.requirementProfile?.essentials ?? []) {
            scan(`${at} essential`, essential.label);
            scan(`${at} essential`, essential.body);
          }
          for (const row of impl.requirementProfile?.technicalDetail ?? []) {
            scan(`${at} detail`, row.label);
            scan(`${at} detail`, row.value);
          }
        }
      }
    }
  }

  assert.deepEqual(offences, [], `vendor names reach the page:\n  ${offences.join("\n  ")}`);
});

/* The leak test 9 could not see: it scanned the model's own claim strings, but
   the drawer renders a reviewed limitation from `drawer-limitations.ts` in
   preference to them, and method copy from `drawer-method-copy.ts`. Both
   layers named products — "Airy outputs a point cloud", "every NEXEO option"
   — while every assertion here passed. They are brochure copy like any other. */
test("10. the reviewed limitation and method layers name no vendor or model either", async () => {
  const { drawerLimitations } = await import("../app/content/drawer-limitations.ts");
  const { drawerMethodCopies, sceneMethodCopies } = await import("../app/content/drawer-method-copy.ts");
  const forbidden = [
    ...VENDORS,
    "PC2SE", "PF-L", "VS125", "VS361", "MK2", "Airy", "NEXEO", "ZOOM Nitro",
    "ClearSoundX", "FLEXIDOME", "3100i", "5100i", "Perception",
  ];
  const offences = [];
  const layers = [
    ...drawerLimitations.map((entry) => [`limitation ${entry.implementationId}`, entry.copy]),
    ...[...drawerMethodCopies, ...sceneMethodCopies].map((entry) => [
      `method ${entry.segmentId}/${entry.capabilityId}`,
      entry.copy,
    ]),
  ];
  for (const [where, copy] of layers) {
    for (const locale of locales) {
      for (const term of forbidden) {
        if (copy[locale]?.includes(term)) offences.push(`${where} ${locale}: names ${term}`);
      }
    }
  }
  assert.deepEqual(offences, [], `vendor or model names reach the drawer:\n  ${offences.join("\n  ")}`);
});

test("Configure names each implementation by function, and keeps the vendor internal", async () => {
  const { getSolutionDirectionsForSegment, getSolutionImplementationOptions } = await import(
    "../app/content/solution-runtime.ts"
  );
  const vendorTokens = technologyImplementations
    .flatMap((impl) => [impl.supplier, impl.product])
    .filter((token) => token && token.length >= 3 && !token.includes(" "));
  const vendor = new RegExp(`\\b(${vendorTokens.map((t) => t.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")).join("|")})\\b`, "i");

  let checked = 0;
  for (const segment of segmentDefinitions) {
    for (const direction of getSolutionDirectionsForSegment(segment.id)) {
      for (const audience of ["presentation", "sales"]) {
        for (const group of getSolutionImplementationOptions(direction.id, audience)) {
          for (const option of group.options) {
            checked++;
            assert.doesNotMatch(option.headline, vendor, `${option.implementationId}: ${option.headline}`);
            // The model keeps the supplier for the audit chain.
            const impl = technologyImplementations.find((i) => i.id === option.implementationId);
            assert.equal(option.supplier, impl.supplier);
          }
        }
      }
    }
  }
  assert.ok(checked > 0);

  // The component renders the functional line in every mode, and supplier and
  // model only inside the Sales-mode internal line.
  const layout = readFileSync(
    fileURLToPath(new URL("../app/components/ConfigureSceneLayout.tsx", import.meta.url)),
    "utf8",
  );
  assert.doesNotMatch(layout, /\[impl\.supplier, impl\.product\]\s*\.filter\(Boolean\)\s*\.join\(" · "\) \|\|/);
  assert.doesNotMatch(layout, /video\.exampleSupplier/);
  assert.match(layout, /functionalLine\(impl\)/);
  assert.match(layout, /\[impl\.id, impl\.supplier, impl\.product\]/);
  const panel = readFileSync(
    fileURLToPath(new URL("../app/components/redesign/DepthPanel.tsx", import.meta.url)),
    "utf8",
  );
  assert.doesNotMatch(panel, /video\.exampleSupplier/);
});
