/**
 * Outlet Centre asset review, isolated under /preview/redesign/outlet-asset-review.
 *
 * `?scene=<id>` opens one Core scene so a capture can be reproduced exactly.
 * Nothing here is reachable from the approved shell, and nothing here renders
 * an approved component.
 */

import type { Metadata } from "next";
import { OutletAssetReview } from "./review";
import { outletCentreSegment } from "../../../content/segments";

export const metadata: Metadata = {
  title: "Outlet asset review — redesign preview",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.scene;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const scene =
    requested && (outletCentreSegment.coreRoute as readonly string[]).includes(requested)
      ? requested
      : outletCentreSegment.coreRoute[0];

  return <OutletAssetReview key={scene} initialSceneId={scene} />;
}
