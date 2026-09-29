/**
 * The brochure's route for the Retail Configure stage.
 *
 * WHY THIS EXISTS
 *
 * Retail Configure is frozen, and the Configure presentation was extracted into
 * a shared layout so Shopping Centre could reuse it. The only honest way to show
 * an extraction changed nothing is to render the same states before and after
 * and compare the pixels. Configure is reached in the real shell only by
 * clicking through an account gate and five stages, which a headless screenshot
 * cannot do, so this route makes the same component addressable by URL.
 *
 * It renders the real component inside the real shell chrome. It began as a
 * review harness, like the eight Shopping Centre scene harnesses.
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
import { RetailConfigureHarness } from "./harness";

export default async function RetailConfigurePreview({
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
    <RetailConfigureHarness
      initialView={initialView}
      initialPresentationMode={read("mode") === "presentation"}
    />
  );
}
