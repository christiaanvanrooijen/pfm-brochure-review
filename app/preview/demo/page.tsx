/**
 * The integrated demo, isolated under /preview/demo.
 *
 * This route is a JOURNEY. Choosing between segments happens at the one picker,
 * `/`, and an address here without a segment redirects there rather than
 * offering a second, differently-shaped front door.
 *
 * `?segment=<id>`, `?scene=<id>`, `?locale=`, `?focus=<id>`, `?point=open` and
 * `?depth=<section>` address a state so a capture can be reproduced exactly.
 * Nothing here is reachable from the approved shell and nothing here renders an
 * approved scene component.
 */

import type { Metadata } from "next";
import { Demo } from "./demo";
import { SegmentOverview } from "../../components/SegmentOverview";
import { defaultLocale, isLocale } from "../../i18n/locales";
import { segmentDefinitions } from "../../content/segments";
import type { SegmentId } from "../../content/types";

export const metadata: Metadata = {
  title: "PFM Commercial Experience — demo",
  robots: { index: false, follow: false },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawSegment = first(params.segment);
  const segment = segmentDefinitions.some((s) => s.id === rawSegment)
    ? (rawSegment as SegmentId)
    : undefined;
  const rawLocale = first(params.locale);
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  /* No segment, or one that does not exist: the reader is choosing, and
     choosing happens in ONE place. This renders that same picker rather than a
     second one of its own — same component, same design, same words. */
  if (!segment) return <SegmentOverview initialLocale={locale} />;

  /* Addressable so a capture, or a check, can reproduce one scene exactly
     instead of clicking its way there. */
  const scene = first(params.scene);
  /* The journey's close, and the brief prepared from it, are places like any
     other, so they have addresses. */
  const rawView = first(params.view);
  const view = rawView === "review" ? "review" : rawView === "brief" ? "brief" : "scene";
  const focus = first(params.focus);
  const point = first(params.point) === "open";
  const depth = first(params.depth);

  return (
    <Demo
      initialSegment={segment}
      initialLocale={locale}
      initialScene={scene}
      initialView={view}
      initialFocus={focus ?? null}
      initialPointOpen={point}
      initialDepthSection={depth ?? null}
    />
  );
}
