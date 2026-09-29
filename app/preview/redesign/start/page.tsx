/**
 * The five segment starts, isolated under /preview/redesign/start.
 *
 * `?segment=<id>` selects which segment starts. `?view=cover` (the default) is
 * the segment start — identity and orientation; `?view=scene` is the first Core
 * scene as evidence. `?locale=`, `?focus=`, `?point=open` and `?depth=<section>`
 * address a state so a capture can be reproduced exactly.
 *
 * Nothing here is reachable from the approved shell.
 */

import type { Metadata } from "next";
import { SegmentStart } from "./start";
import { defaultLocale, isLocale } from "../../../i18n/locales";
import { startScenes } from "../../../i18n/starts";
import type { SegmentId } from "../../../content/types";

export const metadata: Metadata = {
  title: "Segment start — redesign preview",
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
  const segment: SegmentId =
    rawSegment && rawSegment in startScenes ? (rawSegment as SegmentId) : "retail";

  const rawLocale = first(params.locale);
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const depth = first(params.depth);
  const focus = first(params.focus);
  const point = first(params.point) === "open";

  /* `cover` is the segment start itself; `scene` is the first Core scene as
     evidence. Addressable separately so the distinction can be captured. */
  const view = first(params.view) === "scene" ? "scene" : "cover";

  return (
    <SegmentStart
      key={`${segment}-${locale}-${view}`}
      segmentId={segment}
      initialLocale={locale}
      initialFocusId={focus ?? null}
      initialPointOpen={point}
      initialDepthSection={depth ?? null}
      view={view}
    />
  );
}
