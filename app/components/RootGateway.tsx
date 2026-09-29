"use client";

/**
 * The cover, then the front door — at `/` only.
 *
 * The Unified PFM Intro is the brochure's cover: shared across segments, owned
 * by no segment, and not a scene. It is not in any `coreRoute`, and
 * `SegmentOverview` knows nothing about it, because `/preview/demo` renders the
 * overview too and must keep opening straight on the picker.
 *
 * "Explore the PFM experience" swaps the cover for the overview in place — no
 * navigation, no reload, so the URL and its `?locale=` stay exactly as they
 * were. A refresh starts at the cover again, which is what a cover is for —
 * unless the address says `?start=segments`, which is where "All segments"
 * inside a journey leads.
 */

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../i18n/locales";
import { SegmentOverview } from "./SegmentOverview";
import { UnifiedIntro } from "./UnifiedIntro/UnifiedIntro";

export function RootGateway({
  initialLocale,
  startAtSegments = false,
}: {
  initialLocale: Locale;
  /** Open on the picker, for a reader who has already passed the cover. */
  startAtSegments?: boolean;
}) {
  const [exploring, setExploring] = useState(startAtSegments);
  // One locale from cover to picker: chosen on the cover, carried into the picker.
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const overview = useRef<HTMLDivElement>(null);

  // Keyboard and screen-reader users land on the picker, not on a focus that
  // vanished with the cover.
  useEffect(() => {
    if (!exploring) return;
    window.scrollTo(0, 0);
    overview.current?.focus({ preventScroll: true });
  }, [exploring]);

  if (!exploring) {
    return <UnifiedIntro locale={locale} onLocaleChange={setLocale} onExplore={() => setExploring(true)} />;
  }

  return (
    <div ref={overview} tabIndex={-1} style={{ outline: "none" }}>
      <SegmentOverview initialLocale={locale} />
    </div>
  );
}
