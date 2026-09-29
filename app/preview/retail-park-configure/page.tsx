/**
 * The brochure's route for the Retail Park Configure stage.
 *
 * WHY THIS EXISTS
 *
 * Retail Park is not yet wired into the segment-aware shell — that is a later
 * gate — so Configure has no URL a headless screenshot can reach, and the only
 * honest way to review a stage is to look at it. This route makes the real
 * component addressable, inside the real shell chrome. It began as a review
 * harness, like the seven Retail Park scene harnesses and the two approved
 * Configure harnesses.
 *
 * States are addressable by query string:
 *   ?direction=<solutionDirectionId>   open that direction's detail layer
 *   ?depth=<configureDepthId>          open a depth layer inside it
 *   ?mode=presentation                 render in Presentation Mode
 *
 * Since 2026-09-29 it is also the brochure's own route for this stage, and
 * renders in production (app/content/release.ts). It returned 404 there before.
 */

import { notFound } from "next/navigation";
import { brochureRouteAvailable } from "../../content/release";
import { configureDepthIds, solutionDirectionIds } from "../../content/solution-runtime";
import type { ConfigureViewState } from "../../lib/configure-view";
import { RetailParkConfigureHarness } from "./harness";

export default async function RetailParkConfigurePreview({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Part of the approved brochure since 2026-09-29 (app/content/release.ts).
  if (!brochureRouteAvailable()) {
    notFound();
  }

  const params = await searchParams;
  const read = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const openDirectionId = solutionDirectionIds.find((id) => id === read("direction")) ?? null;
  const openDepthId = openDirectionId
    ? configureDepthIds.find((id) => id === read("depth")) ?? null
    : null;

  const initialView: ConfigureViewState = { openDirectionId, openDepthId };

  return (
    <RetailParkConfigureHarness
      initialView={initialView}
      initialPresentationMode={read("mode") === "presentation"}
    />
  );
}
