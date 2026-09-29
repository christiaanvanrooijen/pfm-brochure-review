/**
 * Development-only preview for the Shopping Centre Configure stage.
 *
 * Shopping Centre is `implementationStatus: "architecture_only"`, and the shell
 * routes the Configure stage to Retail. Making the shell segment-aware is a
 * separate, later gate, so this route is how the stage is rendered and reviewed
 * in the meantime — the same arrangement as the eight Shopping Centre Core scene
 * harnesses. It returned 404 in a production build until the segment was
 * approved, so it could not become a back door into an unapproved segment.
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
import { ShoppingCentreConfigureHarness } from "./harness";

export default async function ShoppingCentreConfigurePreview({
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
    <ShoppingCentreConfigureHarness
      initialView={initialView}
      initialPresentationMode={read("mode") === "presentation"}
    />
  );
}
