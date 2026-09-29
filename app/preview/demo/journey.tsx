"use client";

/**
 * One journey component, five segments.
 *
 * Order, scene count, branches and next destinations are read from the typed
 * model. Media comes from the registry beside this file; copy from the accepted
 * modules for Shopping Centre and QSR, and from the resolver for Retail, Retail
 * Park and Outlet.
 *
 * TWO THINGS THIS DELIBERATELY DOES NOT DO
 *
 * It does not remount on a language change — the reader keeps the scene, the
 * focus and the open point they had, and only the words change. And it does not
 * put branch scenes into Core order: they are surfaced where the model attaches
 * them, named and reachable to read, without being walked through as if they
 * were part of the route.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SceneFrame, type Hotspot, type StageMarker } from "../../components/redesign/SceneFrame";
import { DepthPanel } from "../../components/redesign/DepthPanel";
import type { Locale } from "../../i18n/locales";
import { getMessages } from "../../i18n/messages";
import { sceneCopy } from "../../i18n/scenes";
import { qsrJourneyCopy } from "../../i18n/qsr-journey";
import { resolveJourneyCopy } from "../../i18n/journey-copy";
import { retailJourneyCopy } from "../../i18n/journey-retail";
import { retailParkJourneyCopy } from "../../i18n/journey-retail-park";
import { outletJourneyCopy } from "../../i18n/journey-outlet";
import { allScenes, segmentDefinitions } from "../../content/segments";
import type { SceneDefinition, SceneId, SegmentId } from "../../content/types";
import { demoEnding, demoFocusOrder, demoMedia } from "./registry";
import { openingScene } from "./navigation";
import { SceneDiagram } from "./diagrams";
import type { SceneCopy } from "../../i18n/messages";

const STAGE_IDS = ["context", "measure", "understand", "prove", "configure", "act"] as const;
const pct = (v: number, total: number) => `${(v / total) * 100}%`;
const pad = (v: number) => String(v).padStart(2, "0");

/**
 * Copy for one scene, from whichever module owns that segment.
 *
 * Exported through `journeySceneCopy` so the closing review reads a scene in
 * exactly the words the scene itself used. A second resolver would be a second
 * chance to describe the same scene differently.
 */
function copyFor(segment: SegmentId, scene: SceneDefinition, locale: Locale): SceneCopy {
  if (segment === "shopping-centre") return sceneCopy[locale][scene.id];
  if (segment === "qsr") return qsrJourneyCopy[locale][scene.id];
  const authored =
    segment === "retail"
      ? retailJourneyCopy[scene.id]
      : segment === "retail-park"
        ? retailParkJourneyCopy[scene.id]
        : outletJourneyCopy[scene.id];
  return resolveJourneyCopy(locale, scene, authored);
}

export function journeySceneCopy(
  segment: SegmentId,
  sceneId: SceneId,
  locale: Locale,
): SceneCopy {
  return copyFor(segment, allScenes.find((s) => s.id === sceneId)!, locale);
}

function focusIdsFor(segment: SegmentId, scene: SceneDefinition, copy: SceneCopy): readonly string[] {
  const declared = demoFocusOrder[segment]?.[scene.id];
  return declared ?? Object.keys(copy.focus);
}

export function DemoJourney({
  segmentId,
  initialLocale,
  initialSceneId,
  initialFocusId = null,
  initialPointOpen = false,
  initialDepthSection = null,
  exitHref,
  onVisit,
  onRestart,
  onOpenReview,
  onNavigate,
}: {
  segmentId: SegmentId;
  initialLocale: Locale;
  initialSceneId?: string;
  initialFocusId?: string | null;
  initialPointOpen?: boolean;
  /** Preview-only: opens the drawer on a named section so a capture can address one. */
  initialDepthSection?: string | null;
  /**
   * The one picker, as an address rather than a callback.
   *
   * A real link, so leaving is a real browser navigation: Back from the first
   * scene then returns to the picker the way a reader expects, and the control
   * can be opened in a new tab like any other link.
   */
  exitHref: string;
  /**
   * Visits are reported upward, because this component remounts on a history
   * move and a list held here would be emptied by a Back.
   */
  onVisit: (sceneId: SceneId) => void;
  /** Restart is the one move that deliberately forgets. */
  onRestart: (firstSceneId: SceneId) => void;
  /**
   * The close of the journey, for every segment.
   *
   * The journey no longer decides where it ends — three segments used to jump
   * into a Configure preview from here and two into a summary. It reports that
   * the reader reached the end and lets the one ending answer.
   */
  onOpenReview: () => void;
  /**
   * Report where the reader now is, so the address bar can say the same thing.
   *
   * The journey does not own the URL — `Demo` does, because the segment and the
   * scene are one address together. It reports WHAT KIND of move happened and
   * lets `Demo` decide what the address does about it: a `step` goes somewhere
   * new, a `language` is the same place in other words.
   */
  onNavigate?: (sceneId: SceneId, locale: Locale, move: "step" | "language") => void;
}) {
  const segment = useMemo(() => segmentDefinitions.find((s) => s.id === segmentId)!, [segmentId]);
  const route = segment.coreRoute;

  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [sceneId, setSceneId] = useState<SceneId>(openingScene(route, initialSceneId));
  const [focusId, setFocusId] = useState<string | null>(initialFocusId);
  const [pointOpen, setPointOpen] = useState(initialPointOpen);
  const [depthOpen, setDepthOpen] = useState(initialDepthSection !== null);
  const depthRef = useRef<HTMLElement>(null);

  const t = getMessages(locale).ui;
  const stageNames = getMessages(locale).stages;
  const scene = useMemo(() => allScenes.find((s) => s.id === sceneId)!, [sceneId]);
  const copy = copyFor(segmentId, scene, locale);
  const focusIds = focusIdsFor(segmentId, scene, copy);
  const activeFocusId = focusId && focusIds.includes(focusId) ? focusId : focusIds[0];
  const index = route.indexOf(sceneId);
  const media = demoMedia[segmentId][sceneId];
  const ending = demoEnding[segmentId];

  /* Branch scenes the model attaches to THIS scene. Surfaced, never inserted. */
  const branches = useMemo(
    () =>
      allScenes.filter(
        (candidate) =>
          candidate.segment === segmentId &&
          ((candidate.branchFromSceneIds ?? []) as readonly string[]).includes(sceneId),
      ),
    [segmentId, sceneId],
  );

  const goTo = useCallback(
    (next: SceneId) => {
      setSceneId(next);
      setFocusId(null);
      setPointOpen(false);
      setDepthOpen(false);
      onVisit(next);
      onNavigate?.(next, locale, "step");
    },
    [locale, onNavigate, onVisit],
  );

  const restart = useCallback(() => {
    onRestart(route[0]);
    goTo(route[0]);
  }, [goTo, onRestart, route]);

  /* The scene this journey opened on counts as seen — including on a deep link,
     where it is the only scene seen so far, and on a remount after Back, where
     it is already in the record and appending is a no-op. */
  useEffect(() => {
    onVisit(openingScene(route, initialSceneId));
    // Mount only: every later visit is reported by `goTo`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* A language change rewrites the current address rather than adding to it. */
  const changeLocale = useCallback(
    (next: Locale) => {
      setLocale(next);
      onNavigate?.(sceneId, next, "language");
    },
    [onNavigate, sceneId],
  );

  const stages: StageMarker[] = STAGE_IDS.map((id) => {
    const hasScenes = (segment.stageMapping[id] ?? []).length > 0;
    const isSynthesis = id === "configure" || id === "act";
    const state: StageMarker["state"] =
      id === scene.journeyStage
        ? "current"
        : !hasScenes && !isSynthesis
          ? "unavailable"
          : route.slice(0, index).some((id2) => allScenes.find((s) => s.id === id2)?.journeyStage === id)
            ? "past"
            : "upcoming";
    return { id, label: stageNames[id], state };
  });

  const isFinal = index === route.length - 1;
  const point = media.mode === "hotspots" ? media.hotspots.find((h) => h.id === activeFocusId) ?? null : null;
  const rect = media.geometry?.[`${sceneId}:${activeFocusId}`] ?? null;

  /* A neighbouring scene is named in the reader's own language, from that
     scene's own copy — never from `scene.title`, which the typed model holds in
     English only. A control that says "Next: Zone & anchor exposure" inside a
     German journey is a small lie about what comes next. */
  const nameOf = (id: SceneId | null | undefined) => {
    if (!id) return null;
    const target = allScenes.find((s) => s.id === id);
    return target ? copyFor(segmentId, target, locale).eyebrow : null;
  };
  const prevSceneId = index > 0 ? route[index - 1] : null;
  const nextSceneId = isFinal ? null : (scene.nextSceneId ?? route[index + 1]) as SceneId;

  return (
    <div className="rd-demo">
      <SceneFrame
        locale={locale}
        onLocale={changeLocale}
        segmentLabel={segment.experienceName ?? segment.name}
        copy={copy}
        stages={stages}
        position={{ index: index + 1, total: route.length }}
        heroSrc={media.hero}
        asset={media.asset}
        mode={media.mode}
        hotspots={media.hotspots as readonly Hotspot[]}
        focusIds={focusIds}
        activeFocusId={activeFocusId}
        onFocus={setFocusId}
        pointOpen={pointOpen}
        onPoint={setPointOpen}
        overlay={rect ? <rect className="rd-ov" x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="8" /> : null}
        depthOpen={depthOpen}
        onDepth={setDepthOpen}
        /* Null, and no `onCta`: with the control placed externally the frame
           renders neither, and handing it a destination it will not use would
           only invite the next reader to wonder which one wins. */
        ctaHref={null}
        /* The demo owns its onward control: it belongs in the bar below, with
           previous, position and the way out, rather than as one of several
           buttons in three different places. The note stays in the column,
           because it explains what the step IS. */
        ctaPlacement="external"
        ctaNote={null}
        depthRef={depthRef}
        diagram={
          media.diagram ? (
            <SceneDiagram
              kind={media.diagram}
              /* Named parts, from the scene's own focus labels: the measured
                 cluster and the connected one. The derived cluster is not a
                 box — it is what the two produce together, and drawing it as a
                 third box invited the arrow to point at it. */
              labels={{
                measuredThing: copy.focus[focusIds[0]]?.label ?? "",
                contextSource: copy.focus[focusIds[1]]?.label ?? "",
                note: copy.sequence[copy.sequence.length - 1]?.label ?? "",
              }}
            />
          ) : null
        }
        diagramCaption={media.diagram ? t.demoIllustration : null}
      >
        {/* ---------------------------------------------------------------
            WHERE YOU ARE AND HOW YOU GO ON.

            One bar, in reading order: out, back, where, on. Previously these
            were four controls in three places — "next" in the narrative
            column, previous and restart in a row of identical small buttons,
            and the position in two corners of the header — which left the
            reader hunting for the one control that moves the story.

            The neighbouring scenes are named. A presenter who can read what
            comes next can decide whether to go there; "Previous / Next" alone
            makes that a guess.
            --------------------------------------------------------------- */}
        <nav className="rd-demo__bar" aria-label={t.demoJourneyNav}>
          <div className="rd-demo__bar-left">
            <a className="rd-demo__bar-quiet" href={exitHref}>
              <span aria-hidden="true">←</span> {t.demoBack}
            </a>
            <button type="button" className="rd-demo__bar-quiet" onClick={restart}>
              {t.demoRestart}
            </button>
          </div>

          <button
            type="button"
            className="rd-demo__bar-step"
            disabled={!prevSceneId}
            onClick={() => prevSceneId && goTo(prevSceneId)}
          >
            <span aria-hidden="true">←</span>
            <span className="rd-demo__bar-step-kind">{t.demoPrev}</span>{" "}
            {prevSceneId && <span className="rd-demo__bar-step-name">{nameOf(prevSceneId)}</span>}
          </button>

          <p className="rd-demo__bar-position">
            <span className="rd__sr">
              {t.demoProgress
                .replace("{index}", String(index + 1))
                .replace("{total}", String(route.length))}
            </span>
            <span aria-hidden="true">
              {pad(index + 1)} <i>/</i> {pad(route.length)}
            </span>
            <span className="rd-demo__bar-track" aria-hidden="true">
              <span style={{ width: pct(index + 1, route.length) }} />
            </span>
          </p>

          {/* Every segment ends in the same place. The wording is the
              review's own, not the scene's `nextCta`: that line named a
              Configure step for three segments and a summary for two, and the
              ending is now neither of those. */}
          {isFinal ? (
            <button type="button" className="rd-demo__bar-next" onClick={onOpenReview}>
              {t.reviewCta} <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="button"
              className="rd-demo__bar-next"
              onClick={() => nextSceneId && goTo(nextSceneId)}
            >
              <span className="rd-demo__bar-step-kind">{t.demoNext}</span>{" "}
              <span className="rd-demo__bar-step-name">{nameOf(nextSceneId)}</span>
              <span aria-hidden="true">→</span>
            </button>
          )}
        </nav>

        <ol className="rd__rail" aria-label={copy.eyebrow}>
          {copy.sequence.map((step, position) => (
            <li key={`${step.kicker}-${position}`}>
              <span className="rd__rail-index">{String(position + 1).padStart(2, "0")}</span>
              <span className="rd__rail-kicker">{step.kicker}</span>
              <span className="rd__rail-label">{step.label}</span>
            </li>
          ))}
        </ol>

        {branches.length > 0 && (
          <section className="rd-demo__branches">
            <h2>{t.demoBeyond}</h2>
            <p>{t.demoBeyondNote}</p>
            <ul>
              {branches.map((branch) => (
                <li key={branch.id}>
                  <strong>{branch.title}</strong>
                  <span>{branch.commercialQuestion}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

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
    </div>
  );
}
