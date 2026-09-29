/**
 * The Shopping Centre Core scene components, keyed by scene id.
 *
 * A registry rather than a chain of ternaries in the shell. All eight scenes
 * take the same four props, so the shell can walk the segment's typed
 * `coreRoute` and render whatever it lands on without knowing which scene that
 * is. Adding a Core scene to this segment means adding one line here.
 *
 * The route itself is NOT defined here — it comes from `coreRoute` in the typed
 * content, which stays the single source of truth for order.
 */

import type { ComponentType } from "react";
import type { SceneId } from "../content/types";
import type { LensId } from "../lib/types";
import { ShoppingCentreCatchmentScene } from "./ShoppingCentreCatchmentScene";
import { ShoppingCentreEntrancesScene } from "./ShoppingCentreEntrancesScene";
import { ShoppingCentreVisitorCompositionScene } from "./ShoppingCentreVisitorCompositionScene";
import { ShoppingCentreInternalCirculationScene } from "./ShoppingCentreInternalCirculationScene";
import { ShoppingCentreZoneAnchorExposureScene } from "./ShoppingCentreZoneAnchorExposureScene";
import { ShoppingCentreBrandCountingScene } from "./ShoppingCentreBrandCountingScene";
import { ShoppingCentreBrandFlowScene } from "./ShoppingCentreBrandFlowScene";
import { ShoppingCentreTimeInCentreScene } from "./ShoppingCentreTimeInCentreScene";

export interface SegmentSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

export const shoppingCentreSceneComponents: Partial<
  Record<SceneId, ComponentType<SegmentSceneProps>>
> = {
  "shopping-centre-catchment-area": ShoppingCentreCatchmentScene,
  "shopping-centre-entrances": ShoppingCentreEntrancesScene,
  "shopping-centre-visitor-composition": ShoppingCentreVisitorCompositionScene,
  "shopping-centre-internal-circulation": ShoppingCentreInternalCirculationScene,
  "shopping-centre-zone-anchor-exposure": ShoppingCentreZoneAnchorExposureScene,
  "shopping-centre-brand-counting": ShoppingCentreBrandCountingScene,
  "shopping-centre-brand-flow": ShoppingCentreBrandFlowScene,
  "shopping-centre-time-in-centre": ShoppingCentreTimeInCentreScene,
};
