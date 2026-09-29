import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { technologyImplementations } from "../app/content/technology.ts";
import {
  drawerLimitations,
  getDrawerLimitation,
  resolveDrawerLimitation,
} from "../app/content/drawer-limitations.ts";
import { locales } from "../app/i18n/locales.ts";

const expectedWorkbookCells = new Map([
  ["impl-aggregate-geo-mobility", "Implementations!P3"],
  ["impl-business-data-connection", "Implementations!P5"],
  ["impl-compatible-vehicle-detection", "Implementations!P6"],
  ["impl-configured-classification", "Implementations!P7"],
  ["impl-hme-clearsoundx", "Implementations!P8"],
  ["impl-hme-nexeo", "Implementations!P9"],
  ["impl-hme-nexeo-core", "Implementations!P10"],
  ["impl-hme-nexeo-pro", "Implementations!P11"],
  ["impl-hme-zoom-nitro-data-cloud", "Implementations!P13"],
  ["impl-hme-zoom-nitro-nexeo-alerting", "Implementations!P14"],
  ["impl-hme-zoom-nitro-timer", "Implementations!P15"],
  ["impl-lawful-anpr-lpr", "Implementations!P17"],
  ["impl-lidar-spatial", "Implementations!P18"],
  ["impl-milesight-vs361-passerby", "Implementations!P20"],
  ["impl-parking-occupancy-method", "Implementations!P21"],
  ["impl-tattile-anpr-vehicle", "Implementations!P22"],
  ["impl-vehicle-arrival-method", "Implementations!P23"],
  ["impl-xovis-3d-entrance", "Implementations!P24"],
  ["impl-xovis-3d-spatial", "Implementations!P25"],
  ["impl-milesight-vs125p-entrance", "Implementations!P19"],
]);

/* Implementations added after the product lead filled the workbook
   (2026-09-27). They have no workbook row to cite, so each must instead trace
   to the model's own blocked claims — the boundary it states is one the model
   already held. The workbook is the product lead's and is not edited to make
   this pass. */
const postWorkbookImplementations = new Set([
  "impl-ip-detection-indoor",
  "impl-ip-detection-outdoor",
  "impl-xovis-3d-entrance-outdoor",
]);

test("promoted limitations have translated copy and workbook/model traceability", () => {
  assert.equal(drawerLimitations.length, expectedWorkbookCells.size + postWorkbookImplementations.size);

  for (const limitation of drawerLimitations) {
    const implementation = technologyImplementations.find(
      (candidate) => candidate.id === limitation.implementationId,
    );
    assert.ok(implementation, `${limitation.implementationId} is not a typed implementation`);

    if (postWorkbookImplementations.has(limitation.implementationId)) {
      assert.ok(
        limitation.sourceRefs.some((sourceRef) =>
          sourceRef.includes(`${limitation.implementationId}.unsupportedClaims`),
        ),
        `${limitation.implementationId} does not trace to the model's own blocked claims`,
      );
    } else {
      const workbookCell = expectedWorkbookCells.get(limitation.implementationId);
      assert.ok(workbookCell, `${limitation.implementationId} has no expected workbook cell`);
      assert.ok(
        limitation.sourceRefs.some((sourceRef) =>
          sourceRef.includes(`PFM-drawer-content-inventory.xlsx: ${workbookCell}`),
        ),
        `${limitation.implementationId} has no workbook locator`,
      );
    }
    assert.ok(
      limitation.sourceRefs.some((sourceRef) => sourceRef.includes("app/content/technology.ts") || sourceRef.includes("TECHNOLOGY-DRILLDOWN-MODEL.md") || sourceRef.includes("SOURCE-REGISTRY.md")),
      `${limitation.implementationId} has no typed model/source locator`,
    );

    for (const locale of locales) {
      const text = limitation.copy[locale];
      assert.ok(text.length >= 70, `${limitation.implementationId} has short ${locale} copy`);
      assert.equal(resolveDrawerLimitation(locale, limitation.implementationId), text);
    }
  }
});

test("unmapped Isarsoft and matching candidates retain the model fallback", () => {
  assert.equal(getDrawerLimitation("impl-isarsoft-camera-analytics"), null);
  assert.equal(getDrawerLimitation("impl-anonymous-visit-matching"), null);
  /* The Stereo Vision sensor was held here until 2026-09-28. It is mapped for
     both technology and privacy, its limitation concerns counting rather than
     privacy, and its fallback read "Equivalence with the 3D Sensor Basic FoV
     in accuracy…" — a refused claim, not a limitation a reader can use. The
     workbook sentence it now shows states the same boundary plainly. */
  assert.ok(getDrawerLimitation("impl-milesight-vs125p-entrance"));
});

test("DepthPanel keeps scene-specific methods and names missing illustrations", () => {
  const panel = readFileSync(new URL("../app/components/redesign/DepthPanel.tsx", import.meta.url), "utf8");
  assert.match(panel, /getDrawerMethodCopy\(segmentId, view\.capabilityId, sceneId\)/);
  assert.match(panel, /sceneId=\{scene\.id\}/);
  assert.match(panel, /getDrawerLimitation\(impl\.id\)/);
  assert.match(panel, /capabilitiesWithoutIllustration/);
  assert.match(panel, /\{capabilityName\}: \{t\.explainerNone\}/);
});
