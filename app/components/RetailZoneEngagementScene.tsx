"use client";

import { useMemo, useState } from "react";
import type {
  DataRole,
  SceneEvidenceDefinition,
  SceneId,
  SegmentId,
} from "../content/types";
import { getOptionalBranchesForScene, getSceneForSegment } from "../content/runtime";
import { evidenceInputs } from "../content/evidence-inputs";
import {
  getSceneDependencyAvailability,
  getSceneEvidenceRuntime,
} from "../content/evidence-runtime";
import { getProofRuntimeForScene } from "../content/proof-runtime";
import type { LensId } from "../lib/types";
import { SceneLensRail, lensesToRoles } from "./SceneLensRail";

const SEGMENT: SegmentId = "retail";
const SCENE: SceneId = "retail-zone-engagement";

interface RetailZoneEngagementSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation-layer display headline.
 *
 * The scene's typed `commercialQuestion` — "What do visitors do in the zones
 * they reach?" — stays exactly as it is in `content/segments/retail.ts`, along
 * with the scene id and its place in the Core path. This constant only changes
 * the words the presenter says out loud on screen, to the sharper reading of
 * the same question, and it lives here rather than in typed content precisely
 * because it is a copy decision and not a change to what the scene means.
 *
 * Kept as a single named constant rather than a map: exactly one scene overrides
 * its headline today, and a one-entry lookup table would imply a mechanism that
 * does not exist yet. If a second scene ever needs this, promote it then.
 */
const DISPLAY_QUESTION = "Where does attention build?";

/**
 * Presentation grouping only.
 *
 * Three concepts, in the order the scene reads them: which zones are reached
 * (exposure), where presence persists (dwell), and where engagement is lower
 * than the zone plan would suggest (opportunity). Each names a short spatial
 * reading and then borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 *
 * These are deliberately quieter than the equivalent row on In-store journey:
 * no icon discs, no dependency lists, small type. The photograph and the three
 * callouts on it already carry the pattern, so this row's job is to explain the
 * concepts, not to restate them at dashboard scale.
 *
 * The scene has no approved demo values, so no dwell time, exposure share or
 * zone percentage is stated anywhere. Every label is observational. Nothing
 * here says a zone performs well or badly, that layout or merchandising caused
 * a pattern, or that dwell implies sales — those are causal claims this
 * measurement cannot support.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "exposure",
    kicker: "Exposure",
    label: "Which zones are reached",
    evidenceType: "measured",
  },
  {
    id: "dwell",
    kicker: "Dwell",
    label: "Where presence persists",
    evidenceType: "derived",
  },
  {
    id: "opportunity",
    kicker: "Opportunity",
    label: "Quieter areas worth investigating",
    evidenceType: "connected",
  },
];

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * Business is required here for one narrow reason: the zone and category
 * boundaries that give presence and time their spatial meaning. Without that
 * distinction a presenter would read the generic "Customer-connected context"
 * as POS, staffing or merchandising data, none of which this scene uses.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Zone presence, entries and time, measured in the store",
  business: "Store layout & zone definitions",
  insight: "Exposure and dwell patterns, derived from those two layers",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "understand" -> "Understand". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

/**
 * The routes In-store journey draws, repeated here as faint context.
 *
 * Deliberately the same paths, the same coordinates and the same photograph as
 * the previous scene — this is the same room and the same camera, only the lens
 * gets deeper. Keeping the geometry identical is what makes the transition read
 * as "now look at where they stopped" rather than as a new location.
 *
 * They are drawn far weaker than on In-store journey: routing is no longer the
 * subject, it is the structure the attention fields sit on.
 */
const CONTEXT_ROUTES: readonly string[] = [
  "M232 806 C 300 803 370 800 430 792",
  "M430 792 C 470 740 500 660 530 592 C 545 556 570 522 606 506",
  "M430 792 C 520 756 600 700 656 636 C 688 600 700 546 706 512 C 716 486 742 474 774 470 C 796 467 812 468 828 468",
  "M430 792 C 620 772 830 736 1020 684 C 1090 664 1170 616 1235 560",
  "M430 792 C 660 812 920 812 1120 792 C 1165 787 1210 776 1245 766",
];

/**
 * The attention layer drawn over the photographed store.
 *
 * The base is the same Northstar sales-floor photograph In-store journey uses,
 * at the same framing: entrance at the left, womenswear and the branded wall
 * ahead, menswear to the right. Nothing is cropped or pushed in relative to the
 * previous scene, because the point of this one is that it is the same room.
 * What changes is what is drawn on it.
 *
 * The route network that was the subject of the previous scene drops back to
 * faint context, and three spatial readings are laid over the floor instead:
 *
 * - a higher-intensity field where presence concentrates, on the open floor in
 *   front of the central display island, using two steps of a Viridis-style
 *   sequential ramp (teal = lower, yellow = higher). It is a single ordinal
 *   scale, not a rainbow, and it appears only where it stands for relative
 *   intensity;
 * - a lower-intensity field on the menswear side, reached but held less;
 * - one PFM Red callout — the only red in the scene — marking the quieter floor
 *   towards womenswear as an area to investigate, not as a verdict on it.
 *
 * The fields are localised ellipses lying in the floor's perspective, never a
 * scene-wide wash: the store has to stay clearly visible underneath, because the
 * point of the scene is that the data reveals the room rather than replacing it.
 * None of the three overlaps a department, a fixture or a shopper.
 *
 * The coordinate space is the photograph's own pixels (1672 x 941) and the frame
 * applies the same fit to image and overlay, so the fields stay registered to
 * the floor at every viewport width.
 */
function AttentionLayer() {
  return (
    <svg
      className="zones__overlay"
      viewBox="0 0 1672 941"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="zone-dwell-field" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f2e02f" stopOpacity="0.5" />
          <stop offset="36%" stopColor="#addc30" stopOpacity="0.32" />
          <stop offset="68%" stopColor="#5ec962" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#5ec962" stopOpacity="0" />
        </radialGradient>
        {/* The lower step of the same ramp — faint enough to read as "less"
            beside the dwell field, strong enough to be visible as a field at all
            against a very high-key interior. */}
        <radialGradient id="zone-reached-field" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#21918c" stopOpacity="0.66" />
          <stop offset="52%" stopColor="#2c728e" stopOpacity="0.36" />
          <stop offset="100%" stopColor="#2c728e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Route context, demoted: the same five paths as the previous scene, at a
          fraction of their weight, so the viewer can still see that this is the
          same measured movement without routing competing with attention for
          the subject. */}
      <g
        fill="none"
        stroke="#9e77ed"
        strokeOpacity="0.3"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {CONTEXT_ROUTES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Where presence concentrates: the open floor in front of the central
          display island. The ellipse is flattened into the floor's perspective
          rather than drawn as a disc floating over the photograph, and it is
          small enough that the display, the floor and the people around it all
          stay readable through it. */}
      <ellipse cx="870" cy="676" rx="170" ry="50" fill="url(#zone-dwell-field)" />
      <path d="M870 726 v26" stroke="#8a9a3a" strokeOpacity="0.5" strokeWidth="1.6" />
      <text className="zones__label zones__label--strong" x="870" y="774" textAnchor="middle">
        Visitors concentrate here
      </text>

      {/* Reached, but held less — the lower step of the intensity ramp, on the
          menswear side of the floor. */}
      <ellipse cx="1180" cy="626" rx="120" ry="36" fill="url(#zone-reached-field)" />
      <path d="M1160 660 L 1130 692" stroke="#2c728e" strokeOpacity="0.45" strokeWidth="1.6" />
      <text className="zones__label" x="1130" y="714" textAnchor="middle">
        Reached, shorter presence
      </text>

      {/* The one exception callout in the scene. Red marks where to look, not a
          verdict on the area: the copy stays observational, and this is the only
          red anywhere on this scene. */}
      <ellipse
        cx="585"
        cy="658"
        rx="105"
        ry="32"
        fill="none"
        stroke="#f04438"
        strokeOpacity="0.85"
        strokeWidth="2.4"
        strokeDasharray="7 6"
      />
      <path d="M585 690 v26" stroke="#f04438" strokeOpacity="0.45" strokeWidth="1.6" />
      <text className="zones__label zones__label--alert" x="585" y="738" textAnchor="middle">
        Lower exposure observed
      </text>
    </svg>
  );
}

export function RetailZoneEngagementScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailZoneEngagementSceneProps) {
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

  // Staff interaction is typed as an Optional branch of this scene, so it
  // resolves directly — no advanced-branch fallback is needed here. The
  // affordance opens a panel in place and returns to this scene.
  const branches = useMemo(() => getOptionalBranchesForScene(SEGMENT, SCENE), []);
  const branch = branches[0];

  const pattern = dependencies.find(
    (entry) => entry.dependencyId === "retail-zone-engagement-pattern",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return {
      ...cluster,
      note: evidence?.description ?? "",
      inputIds: evidence?.inputIds ?? [],
    };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture zones${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero zones__hero">
            <div className="zones__frame">
              <img
                src="/assets/location-visuals/retail/retail-instore-northstar-hero.png"
                alt="The same Northstar sales floor as the previous scene, at the same framing, read one lens deeper: the movement routes are softened back and attention is shown instead — a stronger intensity field where anonymous presence concentrates on the open floor by the central display, a lighter field on the menswear side that is reached but held less, and a marked quieter area with lower observed exposure towards womenswear"
              />
              <AttentionLayer />
            </div>
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Zones
            </p>
            {/* Presentation copy. The scene's typed commercialQuestion is
                unchanged and still describes what the scene measures; this is
                the shorter line the presenter leads with. */}
            <h1 className="capture__question">{DISPLAY_QUESTION}</h1>
            <p className="zones__privacy-line">
              Anonymous presence and time inside defined zones only — no identity, no personal
              profile and no facial recognition.
            </p>
          </header>
        </section>

        {/* Compact editorial callouts, not three dashboard blocks. The
            photograph already shows where attention builds; this row only names
            the three concepts and explains each in the scene's own typed words.
            The per-cluster input lists that In-store journey shows are dropped
            here — the same inputs are already named in the lens rail, and
            repeating them would put more copy under a richer visual. */}
        <div className="zones__clusters" role="group" aria-label="Zone engagement">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="zones__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="zones__reading">{cluster.label}</strong>
              <p className="zones__note">{cluster.note}</p>
            </div>
          ))}
        </div>

        <p className="capture__definition">
          {period ? (
            <>
              Illustrative demo data <span aria-hidden="true">·</span> {period.period}{" "}
              <span aria-hidden="true">·</span> {period.areaDefinition}
            </>
          ) : (
            <>
              Illustrative zone pattern · observation only, not a cause
              {pattern && !pattern.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> dwell and exposure need{" "}
                  {pattern.missingInputIds
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
