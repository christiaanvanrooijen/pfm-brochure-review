/**
 * The brochure's route for the Retail Park Act stage.
 *
 * Retail Park is not yet wired into the segment-aware shell — that is a later
 * gate — so Act has no URL a headless screenshot can reach, and the only honest
 * way to review a stage is to look at it.
 *
 * `?mode=presentation` renders the prospect-facing state; the closing state is
 * interactive and is reviewed by driving the page.
 *
 * Since 2026-09-29 it is also the brochure's own route for this stage, and
 * renders in production (app/content/release.ts). It returned 404 there before.
 */

import { notFound } from "next/navigation";
import { brochureRouteAvailable } from "../../content/release";
import { RetailParkActHarness } from "./harness";

export default async function RetailParkActPreview({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Part of the approved brochure since 2026-09-29 (app/content/release.ts).
  if (!brochureRouteAvailable()) {
    notFound();
  }

  const params = await searchParams;
  const mode = params.mode;
  const presentation = (Array.isArray(mode) ? mode[0] : mode) === "presentation";

  return <RetailParkActHarness initialPresentationMode={presentation} />;
}
