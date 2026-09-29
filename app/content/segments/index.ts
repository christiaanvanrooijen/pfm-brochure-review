import { outletCentreSegment } from "./outlet-centre.ts";
import {
  qsrActHypotheses,
  qsrConfigurePaths,
  qsrExperienceLenses,
  qsrSegment,
} from "./qsr.ts";
import { retailParkSegment } from "./retail-park.ts";
import { retailSegment } from "./retail.ts";
import { shoppingCentreSegment } from "./shopping-centre.ts";
import type { SceneDefinition, SegmentDefinition } from "../types.ts";

export {
  outletCentreSegment,
  qsrActHypotheses,
  qsrConfigurePaths,
  qsrExperienceLenses,
  qsrSegment,
  retailParkSegment,
  retailSegment,
  shoppingCentreSegment,
};
export type { QsrConfigurePath } from "./qsr.ts";

export const segmentDefinitions: readonly SegmentDefinition[] = [
  retailSegment,
  shoppingCentreSegment,
  retailParkSegment,
  outletCentreSegment,
  qsrSegment,
];

export const allScenes: readonly SceneDefinition[] = segmentDefinitions.flatMap(
  (segment) => segment.scenes,
);
