"use client";

import { useMemo, useState } from "react";
import type { DataRole, SceneId, SegmentId } from "../content/types";
import { getBranchesForScene, getSceneForSegment } from "../content/runtime";
import { evidenceInputs } from "../content/evidence-inputs";
import {
  getSceneDependencyAvailability,
  getSceneEvidenceRuntime,
} from "../content/evidence-runtime";
import { getProofRuntimeForScene } from "../content/proof-runtime";
import type { LensId } from "../lib/types";
import { SceneLensRail, lensesToRoles } from "./SceneLensRail";

const SEGMENT: SegmentId = "retail";
const SCENE: SceneId = "retail-in-store-journey";

interface RetailInStoreJourneySceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation-layer display headline.
 *
 * The scene's typed `commercialQuestion` — "Where do visitors go during the
 * visit?" — stays exactly as it is in `content/segments/retail.ts`, along with
 * the scene id, its journey stage and its place in the Core path. This constant
 * only changes the words the presenter leads with on screen, to the shorter
 * reading of the same question, and it lives here rather than in typed content
 * precisely because it is a copy decision and not a change to what the scene
 * means.
 *
 * Same mechanism, and the same reasoning, as `DISPLAY_QUESTION` on Zone
 * engagement. Two scenes now do this; it is still a per-scene copy decision
 * rather than a mechanism, so each keeps its own named constant.
 */
const DISPLAY_QUESTION = "Where do visitors go?";

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * Business is required here for one narrow reason: the store layout and zone
 * definitions that give a trajectory its spatial meaning. Without that
 * distinction a presenter would read the generic "Customer-connected context"
 * as POS or staffing data, neither of which this scene uses. Insight derives
 * route patterns only — it never states why a route behaves as it does.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Anonymous trajectories, zone entries and transitions",
  business: "Store layout & zone definitions",
  insight: "Route patterns derived from those two layers",
};

/**
 * The three concepts this scene carries, drawn directly on the store.
 *
 * They are anchored to points on the photographed floor rather than restated as
 * a row of cards beneath it: the store is the subject, and the reading should
 * sit in it. Each is a spatial concept, not a value — this scene has no approved
 * demo values, so no count, share, dwell time or route frequency appears
 * anywhere, and nothing here explains why a route behaves the way it does.
 *
 * Coordinates are in the photograph's own pixel space (1672 x 941); see
 * `RouteLayer` for why that space is the right one to author in.
 */
const CALLOUTS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Where the callout touches the floor, on one of the routes. */
  anchor: { x: number; y: number };
  /** Where the text sits. The kicker takes this baseline, the label 19 below. */
  text: { x: number; y: number };
}> = [
  {
    id: "movement",
    kicker: "Movement",
    label: "Where visitors go",
    anchor: { x: 386, y: 797 },
    text: { x: 452, y: 706 },
  },
  {
    id: "diversity",
    kicker: "Route diversity",
    label: "How journeys differ",
    anchor: { x: 860, y: 730 },
    text: { x: 860, y: 656 },
  },
  {
    id: "exposure",
    kicker: "Exposure",
    label: "Which areas are reached",
    anchor: { x: 1178, y: 612 },
    text: { x: 1338, y: 516 },
  },
];

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "understand" -> "Understand". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

/**
 * The anonymous route network drawn over the photographed store.
 *
 * The base is the Northstar sales floor — the same room the Capture scene shows
 * from the street and Visitor composition shows at its threshold, now seen from
 * inside with the entrance at the left, womenswear and the branded wall ahead,
 * menswear to the right and the whole depth of the floor between them. The
 * photograph is used close to its own framing: it was made as a wide in-store
 * shot and already carries the depth this scene needs, so nothing is zoomed into
 * and no department, fixture or walking area is cropped away.
 *
 * Nothing about the store is redrawn. The routes are the only thing this layer
 * adds, and they are drawn in PFM Purple because purple is the movement and
 * measured-structure colour in this system. They are deliberately quiet: soft
 * bands with a thin core, fading with depth, so they read as measured movement
 * lying on the floor rather than as lit paths hovering over it.
 *
 * Four anonymous progressions leave the entrance at the left and separate: one
 * up the left of the floor to womenswear, one through the middle to the branded
 * wall at the back, one diagonally across to menswear on the right, and one
 * short one along the front to the display island. Each follows walkable floor
 * between the fixtures. They are anonymous progressions — no figure, no
 * identity, no per-person trail — and they carry no frequency, count or share,
 * because this scene has no approved demo values.
 *
 * The coordinate space is the photograph's own pixels (1672 x 941). The frame
 * applies `object-fit: cover` to the image and `xMidYMid slice` to this overlay,
 * which are the same fit, so the routes stay registered to the floor at every
 * viewport width.
 */
const ROUTES: ReadonlyArray<{ d: string; halo: number; core: number }> = [
  // The shared stem, from the threshold in along the front of the floor.
  {
    d: "M232 806 C 300 803 370 800 430 792",
    halo: 17,
    core: 3.4,
  },
  // Left, up the open floor past the planter to the womenswear rails.
  {
    d: "M430 792 C 470 740 500 660 530 592 C 545 556 570 522 606 506",
    halo: 13,
    core: 2.6,
  },
  // Centre, along the aisle left of the display island and on to the back wall.
  {
    d: "M430 792 C 520 756 600 700 656 636 C 688 600 700 546 706 512 C 716 486 742 474 774 470 C 796 467 812 468 828 468",
    halo: 12,
    core: 2.4,
  },
  // Right, diagonally across the open floor to the menswear side.
  {
    d: "M430 792 C 620 772 830 736 1020 684 C 1090 664 1170 616 1235 560",
    halo: 13,
    core: 2.6,
  },
  // Short, along the front of the floor to the display island on the right.
  {
    d: "M430 792 C 660 812 920 812 1120 792 C 1165 787 1210 776 1245 766",
    halo: 11,
    core: 2.2,
  },
];

function RouteLayer() {
  return (
    <svg
      className="journey__routes"
      viewBox="0 0 1672 941"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Routes fade as they recede, the way movement evidence thins with
            distance from the camera, rather than sitting as a flat graphic. */}
        <linearGradient id="journey-route" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6941c6" stopOpacity="0.4" />
          <stop offset="45%" stopColor="#9e77ed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9e77ed" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="journey-core" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#5b31b8" stopOpacity="1" />
          <stop offset="45%" stopColor="#7644d6" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#9e77ed" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="url(#journey-route)"
      >
        {ROUTES.map((route) => (
          <path key={`halo-${route.d}`} d={route.d} strokeWidth={route.halo} />
        ))}
      </g>
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="url(#journey-core)"
      >
        {ROUTES.map((route) => (
          <path key={`core-${route.d}`} d={route.d} strokeWidth={route.core} />
        ))}
      </g>

      {/* Direction of travel, once per branch. Small chevrons on the core line
          rather than a repeating arrow pattern along every path. */}
      <g
        fill="none"
        stroke="#9e77ed"
        strokeOpacity="0.85"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M536 605 L536 590 L526 601" />
        <path d="M703 555 L700 540 L693 553" />
        <path d="M1013 691 L1024 681 L1009 681" />
        <path d="M946 817 L960 812 L946 807" />
      </g>

      {/* The one structural marker: the threshold the visit came in through.
          Purple, small and unlabelled — the previous scene is the entrance. */}
      <circle cx="232" cy="806" r="7" fill="#6941c6" />
      <circle
        cx="232"
        cy="806"
        r="15"
        fill="none"
        stroke="#9e77ed"
        strokeOpacity="0.5"
        strokeWidth="2.2"
      />

      {/* The three concepts, anchored to the floor they describe. */}
      {CALLOUTS.map((callout) => (
        <g key={callout.id}>
          <circle
            cx={callout.anchor.x}
            cy={callout.anchor.y}
            r="5.5"
            fill="#6941c6"
            fillOpacity="0.9"
          />
          <path
            d={`M${callout.anchor.x} ${callout.anchor.y - 9} L ${callout.text.x} ${callout.text.y + 30}`}
            stroke="#6941c6"
            strokeOpacity="0.42"
            strokeWidth="1.6"
          />
          <text
            className="journey__label journey__label--kicker"
            x={callout.text.x}
            y={callout.text.y}
            textAnchor="middle"
          >
            {callout.kicker}
          </text>
          <text
            className="journey__label"
            x={callout.text.x}
            y={callout.text.y + 19}
            textAnchor="middle"
          >
            {callout.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function RetailInStoreJourneyScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailInStoreJourneySceneProps) {
  const [branchOpen, setBranchOpen] = useState(false);

  const scene = useMemo(() => getSceneForSegment(SEGMENT, SCENE), []);
  const activeRoles = useMemo(() => lensesToRoles(activeLenses), [activeLenses]);

  const evidenceRuntime = useMemo(
    () => getSceneEvidenceRuntime(SEGMENT, SCENE, activeRoles),
    [activeRoles],
  );
  const dependencies = useMemo(
    () => getSceneDependencyAvailability(SEGMENT, SCENE, activeRoles),
    [activeRoles],
  );
  const proof = useMemo(() => getProofRuntimeForScene(SEGMENT, SCENE), []);

  // Product-category journey is typed as an Advanced branch of this scene, not
  // an Optional one, so both branch sets are queried and the first available
  // branch is offered. The affordance is identical to the Visitor composition
  // one: it opens a small panel in place and returns here.
  const branches = useMemo(() => getBranchesForScene(SEGMENT, SCENE), []);
  const branch = branches.optional[0] ?? branches.advanced[0];

  const routes = dependencies.find(
    (entry) => entry.dependencyId === "retail-in-store-journey-routes",
  );

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture journey${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero journey__hero">
            <div className="journey__frame">
              <img
                src="/assets/location-visuals/retail/retail-instore-northstar-hero.png"
                alt="The Northstar sales floor seen from inside: the entrance at the left, womenswear and the branded back wall ahead, menswear on the right, and anonymous shoppers moving between the display tables — with measured movement drawn as purple routes leaving the entrance and separating across the floor"
              />
              <RouteLayer />
            </div>
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Inside
            </p>
            {/* Presentation copy. The scene's typed commercialQuestion is
                unchanged and still describes what the scene measures; this is
                the shorter line the presenter leads with. */}
            <h1 className="capture__question">{DISPLAY_QUESTION}</h1>
            <p className="journey__privacy-line">
              Anonymous paths through the store only — no identity, no personal profile and
              no facial recognition.
            </p>
          </header>
        </section>

        <p className="capture__definition">
          {period ? (
            <>
              Illustrative demo data <span aria-hidden="true">·</span> {period.period}{" "}
              <span aria-hidden="true">·</span> {period.areaDefinition}
            </>
          ) : (
            <>
              Illustrative store layout and movement <span aria-hidden="true">·</span>{" "}
              observation only, not a cause
              {routes && !routes.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> route and zone flow needs{" "}
                  {routes.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Internal proof readiness, not a customer message. "Proof coming
              soon" is a status the presenter needs and a prospect must never
              be shown; it is the same gate Configure and Act already apply to
              their own proof states. */}
          {!presentationMode && !hasExternalProof && (
            <div className="capture__proof" role="note">
              <span className="capture__proof-mark" aria-hidden="true">i</span>
              <span>
                <strong>No approved external proof yet</strong>
                <small>Method shown; no customer result claimed</small>
              </span>
            </div>
          )}
          {branch && (
            <button
              type="button"
              className="composition__branch"
              aria-expanded={branchOpen}
              onClick={() => setBranchOpen((open) => !open)}
            >
              {branchOpen ? `Close ${branch.title.toLowerCase()}` : `Explore ${branch.title.toLowerCase()}`}
              <span aria-hidden="true">{branchOpen ? "×" : "›"}</span>
            </button>
          )}
          <button type="button" className="capture__cta" onClick={onNextScene}>
            {scene.nextCta}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M0 6h15" />
              <path d="M11.5 2.5L15 6l-3.5 3.5" />
            </svg>
          </button>
        </div>

        {branch && branchOpen && (
          <div className="composition__branch-panel" role="note">
            <span className="composition__kicker">
              {branch.priority === "advanced" ? "Advanced step" : "Optional step"}
            </span>
            <strong>{branch.commercialQuestion}</strong>
            <p>{branch.supportingLine}</p>
            <p className="composition__needs">
              <span>Needs</span>
              {branch.derivedDependencies
                .flatMap((dependency) => [
                  ...dependency.requiredInputIds,
                  ...(dependency.alternativeInputGroups ?? []).flat(),
                ])
                .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                .join(" · ")}
            </p>
          </div>
        )}
      </div>

      {!presentationMode && (
        <SceneLensRail
          segmentId={SEGMENT}
          sceneId={SCENE}
          activeLenses={activeLenses}
          activeRoles={activeRoles}
          onToggleLens={onToggleLens}
          roleNotes={ROLE_NOTES}
        />
      )}
    </div>
  );
}
