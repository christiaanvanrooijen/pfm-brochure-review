import { evidenceInputs } from "./evidence-inputs.ts";
import { proofAssets } from "./proof-assets.ts";
import { segmentDefinitions } from "./segments/index.ts";
import {
  technologyCapabilities,
  technologyImplementations,
} from "./technology.ts";
import type { ContentBundle } from "./types.ts";
import { visualAssets } from "./visual-assets.ts";

export * from "./types.ts";
export * from "./validation.ts";
export * from "./segments/index.ts";
export { evidenceInputs } from "./evidence-inputs.ts";
export { proofAssets } from "./proof-assets.ts";
export { technologyCapabilities, technologyImplementations } from "./technology.ts";
export { visualAssets } from "./visual-assets.ts";

export const contentBundle: ContentBundle = {
  segments: segmentDefinitions,
  evidenceInputs,
  technologyCapabilities,
  technologyImplementations,
  visualAssets,
  proofAssets,
};
