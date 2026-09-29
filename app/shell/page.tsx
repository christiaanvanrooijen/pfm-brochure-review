/**
 * The approved account-led sales shell, at its own address.
 *
 * Unchanged: this is the same component the root route used to render, moved
 * rather than rewritten, so the go-demo that was signed off behaves exactly as
 * it was signed off. The segment overview at `/` links here.
 *
 * `?segment=` opens the shell already in that segment's journey — the overview
 * uses it, so a card that says a segment runs end to end lands in that
 * segment's journey rather than in Retail's. The shell still opens on its own
 * entry screen: which account is being met is its question, not the overview's.
 * A segment the shell cannot run is ignored.
 */

import { CommercialExperience } from "../components/CommercialExperience";
import { shellCanRunSegment } from "../lib/segment-journey";
import type { SegmentId } from "../content/types";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Shell({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = first(params.segment);
  const segment =
    raw && shellCanRunSegment(raw as SegmentId) ? (raw as SegmentId) : undefined;

  return <CommercialExperience initialSegmentId={segment} />;
}
