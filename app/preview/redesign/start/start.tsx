"use client";

/**
 * A segment-start experience, on the accepted Shopping Centre presentation
 * baseline.
 *
 * WHAT IS SHARED AND WHAT IS NOT
 *
 * The layout, the drawer and the evidence rail are the SAME components the
 * accepted redesign journey uses — that is the point of this gate. What is not
 * shared is anything a segment would have to earn: its identity, its first Core
 * question, its truth boundary, its media and its capabilities all resolve from
 * that segment's own typed model. No Shopping Centre imagery, claim, hotspot or
 * technology semantic reaches another segment.
 *
 * WHERE EACH START CAN GO NEXT
 *
 * Shopping Centre enters the completed redesign journey and takes the chosen
 * language with it. Retail Park hands off to an approved current preview, and
 * says in words — before the click — that the redesign and the selected
 * language stop there. Retail, Outlet Centre and QSR have no onward preview
 * route in this repository, so they say that instead of offering a dead link.
 */

import { useMemo, useRef, useState } from "react";
import { SceneFrame, type Hotspot, type StageMarker } from "../../../components/redesign/SceneFrame";
import { DepthPanel } from "../../../components/redesign/DepthPanel";
import type { Locale } from "../../../i18n/locales";
import { getMessages } from "../../../i18n/messages";
import { startCopy, startCoverCopy, startFocusOrder, startScenes } from "../../../i18n/starts";
import {
  COVER_ASSET,
  getSegmentStartVisual,
  START_ASSET,
  START_HANDOFF,
  START_HERO,
  START_HOTSPOTS,
  START_MODE,
} from "./media";
import { allScenes, segmentDefinitions } from "../../../content/segments";
import type { SegmentId } from "../../../content/types";

const STAGE_IDS = ["context", "measure", "understand", "prove", "configure", "act"] as const;

/**
 * Evidence-carrying geometry for the starts.
 *
 * One thin rectangle marking where the SELECTED typed evidence is configured,
 * and nothing else. A focus with no defensible spatial locus draws nothing:
 * retail's opening hours and capture rate are not places, and neither is a
 * catchment band, so only the asset and the reach around it are ever outlined.
 */
function StartOverlay({ sceneId, focusId }: { sceneId: string; focusId: string }) {
  switch (`${sceneId}:${focusId}`) {
    // The store doorway: passers-by outside it, entries through it.
    case "retail-street-opportunity:measured":
      return <rect className="rd-ov" x="950" y="250" width="265" height="395" rx="8" />;

    // The centre, then the area its reach describes.
    case "shopping-centre-catchment-area:asset":
      return <rect className="rd-ov" x="380" y="230" width="1090" height="215" rx="8" />;
    case "shopping-centre-catchment-area:reach":
      return <rect className="rd-ov" x="90" y="470" width="1740" height="520" rx="8" />;

    // The park's units and surface parking, then the area beyond it.
    case "retail-park-catchment-area:asset":
      return <rect className="rd-ov" x="420" y="300" width="1080" height="330" rx="8" />;
    case "retail-park-catchment-area:reach":
      return <rect className="rd-ov" x="90" y="110" width="1740" height="200" rx="8" />;

    default:
      return null;
  }
}

export function SegmentStart({
  segmentId,
  initialLocale,
  initialFocusId = null,
  initialPointOpen = false,
  initialDepthSection = null,
  view = "cover",
}: {
  segmentId: SegmentId;
  initialLocale: Locale;
  initialFocusId?: string | null;
  initialPointOpen?: boolean;
  initialDepthSection?: string | null;
  /**
   * `cover` is the segment start: identity and orientation.
   * `scene` is the first Core scene as evidence.
   *
   * They are separated because they answer different questions and are allowed
   * different pictures. Outlet Centre is the case that forced it: it has an
   * honest cover and no honest catchment hero, and one field could not hold
   * both without one of them lying.
   */
  view?: "cover" | "scene";
}) {
  const sceneId = startScenes[segmentId];
  const focusIds = startFocusOrder[sceneId];

  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [focusId, setFocusId] = useState(
    initialFocusId && focusIds.includes(initialFocusId) ? initialFocusId : focusIds[0],
  );
  const [pointOpen, setPointOpen] = useState(initialPointOpen);
  const [depthOpen, setDepthOpen] = useState(initialDepthSection !== null);
  const depthRef = useRef<HTMLElement>(null);

  const t = getMessages(locale).ui;
  const stageNames = getMessages(locale).stages;
  const copy = startCopy[locale][sceneId];

  const segment = useMemo(
    () => segmentDefinitions.find((s) => s.id === segmentId)!,
    [segmentId],
  );
  const scene = useMemo(() => allScenes.find((s) => s.id === sceneId)!, [sceneId]);

  /* The start is scene one of the segment's own Core route, and the stage row
     reflects THAT route — not Shopping Centre's.
     
     The availability rule is the accepted journey's, unchanged: Configure and
     Act hold no scenes in any segment's mapping because they are SYNTHESIS
     stages, built from the route rather than listed in it. Only a scene-backed
     stage with nothing in it is unavailable — otherwise Retail and QSR would
     strike through two stages they genuinely have. */
  const stages: StageMarker[] = STAGE_IDS.map((id) => {
    const hasScenes = (segment.stageMapping[id] ?? []).length > 0;
    const isSynthesis = id === "configure" || id === "act";
    const state: StageMarker["state"] =
      id === scene.journeyStage
        ? "current"
        : !hasScenes && !isSynthesis
          ? "unavailable"
          : "upcoming";
    return { id, label: stageNames[id], state };
  });

  /* The cover is only ever shown on the cover view, and only where the typed
     concept declares one. It never substitutes for a missing scene hero. */
  const cover = view === "cover" ? getSegmentStartVisual(segmentId) : null;
  const coverCopy = cover ? startCoverCopy[locale][segmentId] ?? null : null;

  const handoff = START_HANDOFF[sceneId];
  const ctaHref =
    handoff.kind === "redesign"
      ? `/preview/redesign/shopping-centre-circulation?scene=${handoff.sceneId}&locale=${locale}`
      : handoff.kind === "preview"
        ? handoff.href
        : null;

  const ctaNote =
    handoff.kind === "preview"
      ? t.handoffPreviewNote
      : handoff.kind === "none"
        ? t.handoffNone
        : null;

  return (
    <SceneFrame
      locale={locale}
      onLocale={setLocale}
      segmentLabel={segment.experienceName ?? segment.name}
      copy={copy}
      stages={stages}
      position={{ index: 1, total: segment.coreRoute.length }}
      heroSrc={cover ? cover.assetPath : START_HERO[sceneId]}
      heroAltOverride={cover ? cover.altText : null}
      cover={cover && coverCopy ? { label: coverCopy.label, note: coverCopy.note } : null}
      /* On the cover view the picture on screen is the COVER, so everything the
         frame draws in pixel coordinates has to follow it there. A cover proves
         nothing, so there is nothing on it to point at: no `+`, no outline, and
         its own dimensions rather than the hero's. Pointing the scene's hotspots
         at a different photograph would place them on whatever happens to be at
         those coordinates — which is how a picture that claims nothing starts
         claiming something. */
      asset={cover ? COVER_ASSET[segmentId] : START_ASSET[sceneId]}
      mode={cover ? "layer" : START_MODE[sceneId]}
      hotspots={cover ? [] : (START_HOTSPOTS[sceneId] as readonly Hotspot[])}
      focusIds={focusIds}
      activeFocusId={focusId}
      onFocus={setFocusId}
      pointOpen={pointOpen}
      onPoint={setPointOpen}
      overlay={cover ? null : <StartOverlay sceneId={sceneId} focusId={focusId} />}
      depthOpen={depthOpen}
      onDepth={setDepthOpen}
      ctaHref={ctaHref}
      ctaNote={ctaNote}
      depthRef={depthRef}
    >
      <ol className="rd__rail" aria-label={copy.eyebrow}>
        {copy.sequence.map((step, position) => (
          <li key={step.kicker}>
            <span className="rd__rail-index">{String(position + 1).padStart(2, "0")}</span>
            <span className="rd__rail-kicker">{step.kicker}</span>
            <span className="rd__rail-label">{step.label}</span>
          </li>
        ))}
      </ol>

      {depthOpen && (
        <DepthPanel
          ref={depthRef}
          locale={locale}
          segmentId={segmentId}
          scene={scene}
          copy={copy}
          initialSection={initialDepthSection}
          onClose={() => setDepthOpen(false)}
        />
      )}
    </SceneFrame>
  );
}
