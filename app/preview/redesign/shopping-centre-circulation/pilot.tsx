"use client";

/**
 * The pilot's own wiring: typed content in, localized composition out.
 *
 * Everything structural lives in `SceneFrame` and `DepthPanel`. What is here is
 * the resolution: which scene, where it sits in its segment's own `coreRoute`,
 * which stages exist for this segment, which focus ids the scene's typed
 * evidence declares, and — the point of this gate's correction — where the
 * primary action actually goes.
 *
 * THE PRIMARY ACTION
 *
 * Its destination is `scene.nextSceneId`, never a literal. Where the next scene
 * has localized pilot copy, the action stays inside the redesigned frame and
 * carries the chosen language in the URL, so language is demonstrably preserved
 * across the step. Where it does not, the action hands off to that scene's
 * existing approved preview and SAYS SO: a handoff carries neither this
 * composition nor the language, and the page states that rather than letting a
 * reviewer discover it by clicking.
 */

import { useEffect, useRef, useState } from "react";
import { SceneFrame, type StageMarker } from "../../../components/redesign/SceneFrame";
import { DepthPanel } from "../../../components/redesign/DepthPanel";
import { getCanonicalJourneyStages, getSceneForSegment, getSegment } from "../../../content/runtime";
import type { SceneId } from "../../../content/types";
import { documentLanguage, type Locale } from "../../../i18n/locales";
import { getMessages } from "../../../i18n/messages";
import { sceneFocusOrder, sceneModes } from "../../../i18n/scenes";
import { ASSET_SIZE, HEROES, HOTSPOTS } from "./geometry";

const SEGMENT = "shopping-centre" as const;

/** Heroes are per scene, chosen from the approved production directory. */
const PILOT_ROUTE = "/preview/redesign/shopping-centre-circulation";
/** The one permitted handoff: the end of Core steps into Configure. */
const CONFIGURE_PREVIEW = "/preview/shopping-centre-configure";

/**
 * What each subject draws on its picture.
 *
 * ONE RULE: a shape may only exist where the SELECTED typed evidence has a
 * defensible spatial locus, and it may only be a thin rectangle or line that
 * marks where that observation is configured.
 *
 * Removed in this correction: every dashed contour, every translucent fill and
 * both decorative rings. The rings in particular marked "the floor around it",
 * which no typed cluster claims — a shape with no evidence behind it is a claim
 * nobody made, and on a measurement image that is the worst kind of decoration.
 *
 * Scenes whose selected evidence has NO locus draw nothing at all. An empty
 * overlay is the honest state, not a gap to fill.
 */
function Overlay({ sceneId, focusId }: { sceneId: string; focusId: string }) {
  const key = `${sceneId}:${focusId}`;
  switch (key) {
    // Catchment — the asset, then the roads and surroundings it draws from.
    case "shopping-centre-catchment-area:asset":
      return <rect className="rd-ov" x="380" y="230" width="1090" height="215" rx="8" />;
    case "shopping-centre-catchment-area:reach":
      return <rect className="rd-ov" x="90" y="470" width="1740" height="520" rx="8" />;

    // Circulation — the concourse, the escalator bank, an anchor frontage.
    case "shopping-centre-internal-circulation:movement":
      return <rect className="rd-ov" x="430" y="660" width="1180" height="400" rx="8" />;
    case "shopping-centre-internal-circulation:transitions":
      return <rect className="rd-ov" x="880" y="250" width="330" height="360" rx="8" />;
    case "shopping-centre-internal-circulation:distribution":
      return <rect className="rd-ov" x="1400" y="290" width="470" height="360" rx="8" />;

    // Exposure — the mapped floor zone, then an anchor frontage.
    case "shopping-centre-zone-anchor-exposure:zones":
      return <rect className="rd-ov" x="470" y="690" width="1080" height="300" rx="8" />;
    case "shopping-centre-zone-anchor-exposure:anchors":
      return <rect className="rd-ov" x="1330" y="250" width="530" height="380" rx="8" />;

    // Brand counting — a covered threshold, then a covered frontage.
    case "shopping-centre-brand-counting:threshold":
      return <rect className="rd-ov" x="620" y="700" width="350" height="110" rx="8" />;
    case "shopping-centre-brand-counting:boundary":
      return <rect className="rd-ov" x="1340" y="190" width="325" height="470" rx="8" />;

    // Brand flow — the gallery between two covered frontages, then one of them.
    case "shopping-centre-brand-flow:between":
      return <rect className="rd-ov" x="230" y="560" width="1290" height="230" rx="8" />;
    case "shopping-centre-brand-flow:covered":
      return <rect className="rd-ov" x="1230" y="330" width="400" height="330" rx="8" />;

    default:
      return null;
  }
}

export function CirculationPilot({
  initialLocale,
  initialSceneId,
  initialFocusId = null,
  initialPointOpen = false,
  initialDepthSection = null,
}: {
  initialLocale: Locale;
  initialSceneId: SceneId;
  initialFocusId?: string | null;
  initialPointOpen?: boolean;
  initialDepthSection?: string | null;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const focusOrder = sceneFocusOrder[initialSceneId] ?? [];
  const [focusId, setFocusId] = useState<string>(
    focusOrder.find((id) => id === initialFocusId) ?? focusOrder[0] ?? "",
  );
  const [pointOpen, setPointOpen] = useState(initialPointOpen);
  const [depthOpen, setDepthOpen] = useState(initialDepthSection !== null);
  const depthRef = useRef<HTMLElement>(null);

  const segment = getSegment(SEGMENT);
  const scene = getSceneForSegment(SEGMENT, initialSceneId);
  const messages = getMessages(locale);
  const copy = messages.scene[initialSceneId];

  /* The document language follows the switcher, and so does the URL — via
     replaceState, so a reload keeps the language without adding a history entry
     that a Back press would have to walk through. The scene, the focus and the
     open panel are React state and are untouched by the switch. */
  useEffect(() => {
    document.documentElement.lang = documentLanguage(locale);
    const url = new URL(window.location.href);
    url.searchParams.set("locale", locale);
    window.history.replaceState(null, "", url);
  }, [locale]);

  const route = segment?.coreRoute ?? [];
  const index = route.indexOf(initialSceneId) + 1;

  // Where the primary action goes, resolved from the typed route.
  const nextSceneId = scene.nextSceneId ?? null;
  const nextHasPilotCopy = nextSceneId !== null && Boolean(messages.scene[nextSceneId]);
  /* Three cases, and each is stated rather than implied:
       - the next Core scene has pilot copy: stay inside the redesign, carrying
         the language, so the whole Core route is one experience;
       - it does not: hand off to that scene's approved preview and say so;
       - there is no next scene at all, which is the END of Core: hand off to
         Configure, which is a separate preview with its own state. */
  const endOfCore = nextSceneId === null;
  const ctaHref = endOfCore
    ? CONFIGURE_PREVIEW
    : nextHasPilotCopy
      ? `${PILOT_ROUTE}?scene=${nextSceneId}&locale=${locale}`
      : `/preview/${nextSceneId}`;
  const ctaNote = endOfCore || !nextHasPilotCopy ? messages.ui.ctaHandoffNote : null;

  const stages: readonly StageMarker[] = getCanonicalJourneyStages().map((stageId) => {
    const hasContent = (segment?.stageMapping[stageId] ?? []).length > 0;
    const isSynthesis = stageId === "configure" || stageId === "act";
    const state: StageMarker["state"] =
      stageId === scene.journeyStage
        ? "current"
        : !hasContent && !isSynthesis
          ? // Prove holds no scenes for this segment. Shown, never completed.
            "unavailable"
          : route
                .slice(0, index - 1)
                .some((id) => getSceneForSegment(SEGMENT, id).journeyStage === stageId)
            ? "past"
            : "upcoming";
    return { id: stageId, label: messages.stages[stageId] ?? stageId, state };
  });

  return (
    <SceneFrame
      locale={locale}
      onLocale={setLocale}
      segmentLabel={segment?.experienceName ?? segment?.name ?? SEGMENT}
      copy={copy}
      stages={stages}
      position={{ index, total: route.length }}
      heroSrc={HEROES[initialSceneId]}
      asset={ASSET_SIZE[initialSceneId]}
      mode={sceneModes[initialSceneId] ?? "layer"}
      hotspots={HOTSPOTS[initialSceneId] ?? []}
      focusIds={focusOrder}
      activeFocusId={focusId}
      onFocus={setFocusId}
      pointOpen={pointOpen}
      onPoint={setPointOpen}
      overlay={<Overlay sceneId={initialSceneId} focusId={focusId} />}
      depthOpen={depthOpen}
      onDepth={setDepthOpen}
      ctaHref={ctaHref}
      ctaNote={ctaNote}
      depthRef={depthRef}
    >
      {/* The lower sequence: measured input -> relevant context -> available
          interpretation, populated from the scene's own dependency model. */}
      {/* The evidence chain, as a dark full-width rail beneath the composition:
          measured input, the context you connect, and only then what may be
          derived. It reads as one sentence in three steps rather than as three
          tiles competing with the picture above them. */}
      <ol className="rd__rail" aria-label={copy.eyebrow}>
        {copy.sequence.map((step, position) => (
          <li key={step.kicker}>
            <span className="rd__rail-index">{String(position + 1).padStart(2, "0")}</span>
            <span className="rd__rail-kicker">{step.kicker}</span>
            <span className="rd__rail-label">{step.label}</span>
          </li>
        ))}
      </ol>

      {/* THE BRIDGE, and the honest limit of this gate.

          A link to a SEPARATE preview, not a continuation. That route renders
          the approved Configure component with its own state and has no locale
          of its own, so neither this composition nor the chosen language
          travels with the click. The note below says exactly that, because the
          earlier wording ("on the same state") claimed a continuity that does
          not exist. */}
      <aside className="rd__bridge">
        <p className="rd__bridge-kicker">{messages.ui.bridgeKicker}</p>
        <a className="rd__bridge-link" href="/preview/shopping-centre-configure">
          {messages.ui.bridgeLabel}
          <span aria-hidden="true">→</span>
        </a>
        <p className="rd__bridge-note">{messages.ui.bridgeNote}</p>
      </aside>

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
