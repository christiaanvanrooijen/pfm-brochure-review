/**
 * The brochure's route for the Retail Act stage.
 *
 * Retail Act is frozen and its presentation is about to be extracted into a
 * shared layout so Shopping Centre can reuse the frame. The only honest way to
 * show an extraction changed nothing is to render the same states before and
 * after and compare the pixels, and Act sits six stages deep behind an account
 * gate that a headless screenshot cannot click through.
 *
 * `?mode=presentation` renders the
 * prospect-facing state; the direction-open and closing states are interactive
 * and are reviewed by driving the page.
 *
 * Since 2026-09-29 it is also the brochure's own route for this stage, and
 * renders in production (app/content/release.ts). It returned 404 there before.
 */

import { notFound } from "next/navigation";
import { brochureRouteAvailable } from "../../content/release";
import { RetailActHarness } from "./harness";

export default async function RetailActPreview({
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

  return <RetailActHarness initialPresentationMode={presentation} />;
}
