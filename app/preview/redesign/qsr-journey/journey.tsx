"use client";

/**
 * The QSR Core journey, on the accepted editorial presentation baseline.
 *
 * WHAT IS RESOLVED, NOT DECIDED HERE
 *
 * The route, its order, every question, every CTA and every capability come
 * from `app/content/segments/qsr.ts`. This file renders them. It does not know
 * what the sixth scene is until the model says so, and it never reads a scene
 * or a capability out of an asset filename.
 *
 * THE BOUNDARIES THIS SEGMENT OWNS
 *
 * Timing exists only between configured stage points; a measured stage is not
 * the whole visit; nothing identifies a vehicle or a person; and throughput,
 * goals and bottlenecks are operational context rather than values this
 * interface may invent. Those are carried by the typed copy, and the layout
 * puts the truth line where it is read once — in the column, beside the
 * question — rather than behind a control.
 *
 * PROOF
 *
 * Not shown, and not because it was forgotten. Every QSR proof asset is typed
 * as a placeholder, so `getUsableProofsForScene` returns nothing and the drawer
 * says so in the reader's language. An empty proof section here is the model
 * being honest, not a gap.
 */

import { useMemo, useRef, useState } from "react";
import { SceneFrame, type Hotspot, type StageMarker } from "../../../components/redesign/SceneFrame";
import { DepthPanel } from "../../../components/redesign/DepthPanel";
import type { Locale } from "../../../i18n/locales";
import { getMessages } from "../../../i18n/messages";
import { qsrCoreRoute, qsrFocusOrder, qsrJourneyCopy } from "../../../i18n/qsr-journey";
import { QSR_ASSET, QSR_GEOMETRY, QSR_HERO, QSR_HOTSPOTS, QSR_MODE } from "./media";
import { allScenes, segmentDefinitions } from "../../../content/segments";

const SEGMENT = "qsr" as const;
const STAGE_IDS = ["context", "measure", "understand", "prove", "configure", "act"] as const;

/**
 * Evidence-carrying geometry: one thin rectangle around the equipment the
 * selected evidence is configured at, and nothing anywhere else.
 */
function QsrOverlay({ sceneId, focusId }: { sceneId: string; focusId: string }) {
  const rect = QSR_GEOMETRY[`${sceneId}:${focusId}`];
  if (!rect) return null;
  return <rect className="rd-ov" x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="8" />;
}

export function QsrJourney({
  initialLocale,
  initialSceneId,
  initialFocusId = null,
  initialPointOpen = false,
  initialDepthSection = null,
}: {
  initialLocale: Locale;
  initialSceneId: string;
  initialFocusId?: string | null;
  initialPointOpen?: boolean;
  initialDepthSection?: string | null;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [sceneId, setSceneId] = useState(initialSceneId);
  const focusIds = qsrFocusOrder[sceneId];
  const [focusId, setFocusId] = useState(
    initialFocusId && focusIds.includes(initialFocusId) ? initialFocusId : focusIds[0],
  );
  const [pointOpen, setPointOpen] = useState(initialPointOpen);
  const [depthOpen, setDepthOpen] = useState(initialDepthSection !== null);
  const depthRef = useRef<HTMLElement>(null);

  const t = getMessages(locale).ui;
  const stageNames = getMessages(locale).stages;
  const copy = qsrJourneyCopy[locale][sceneId];

  const segment = useMemo(() => segmentDefinitions.find((s) => s.id === SEGMENT)!, []);
  const scene = useMemo(() => allScenes.find((s) => s.id === sceneId)!, [sceneId]);
  const index = qsrCoreRoute.indexOf(sceneId);

  /* Configure and Act are synthesis stages, present in every segment even
     though no scene is mapped to them. Only a scene-backed stage with nothing
     in it is unavailable. */
  const stages: StageMarker[] = STAGE_IDS.map((id) => {
    const hasScenes = (segment.stageMapping[id] ?? []).length > 0;
    const isSynthesis = id === "configure" || id === "act";
    const state: StageMarker["state"] =
      id === scene.journeyStage
        ? "current"
        : !hasScenes && !isSynthesis
          ? "unavailable"
          : qsrCoreRoute
                .slice(0, index)
                .some((id2) => allScenes.find((s) => s.id === id2)?.journeyStage === id)
            ? "past"
            : "upcoming";
    return { id, label: stageNames[id], state };
  });

  const goTo = (next: string) => {
    setSceneId(next);
    setFocusId(qsrFocusOrder[next][0]);
    setPointOpen(false);
    setDepthOpen(false);
  };

  const nextSceneId = scene.nextSceneId;
  const isFinal = index === qsrCoreRoute.length - 1;

  return (
    <SceneFrame
      locale={locale}
      onLocale={setLocale}
      segmentLabel={segment.experienceName ?? segment.name}
      copy={copy}
      stages={stages}
      position={{ index: index + 1, total: qsrCoreRoute.length }}
      heroSrc={QSR_HERO[sceneId]}
      asset={QSR_ASSET[sceneId]}
      mode={QSR_MODE[sceneId]}
      hotspots={QSR_HOTSPOTS[sceneId] as readonly Hotspot[]}
      focusIds={focusIds}
      activeFocusId={focusId}
      onFocus={setFocusId}
      pointOpen={pointOpen}
      onPoint={setPointOpen}
      overlay={<QsrOverlay sceneId={sceneId} focusId={focusId} />}
      depthOpen={depthOpen}
      onDepth={setDepthOpen}
      /* The final Core CTA does not link. QSR has a Configure synthesis stage
         in the model but no Configure preview in this repository, and an
         onward button with nowhere to go is a promise the page cannot keep. */
      ctaHref={isFinal ? null : "#"}
      onCta={isFinal || !nextSceneId ? undefined : () => goTo(nextSceneId)}
      ctaNote={isFinal ? t.qsrConfigureSeparate : null}
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
          segmentId={SEGMENT}
          scene={scene}
          copy={copy}
          initialSection={initialDepthSection}
          onClose={() => setDepthOpen(false)}
        />
      )}
    </SceneFrame>
  );
}
