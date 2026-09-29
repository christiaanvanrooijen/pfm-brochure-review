"use client";

/**
 * Retail Park — Unit visits. The fourth scene of the Retail Park Core route.
 *
 * WHAT THIS SCENE OWNS
 *
 * Entries detected at a configured unit boundary, by unit and by time. It is the
 * first scene in this segment that measures PEOPLE rather than vehicles, and the
 * first that needs the tenant directory to mean anything: an event without a
 * mapping is a crossing at an unnamed door.
 *
 * WHY TECH-02 AND NOTHING ELSE
 *
 * A retail park is a set of separate buildings across a car park. Its units are
 * measured at their own thresholds, not by tracking anyone across the tarmac —
 * this segment declares no trajectory input anywhere, which is why the earlier
 * TECH-04 declaration was narrowed away. Cross-unit behaviour is the NEXT scene's
 * subject and comes from anonymous matching, not from a continuous path.
 *
 * THE BOUNDARIES
 *
 * A visit is a crossing. It is not a transaction or a sale — PFM measures
 * visitation, never trade. It is not a unique person: the same person entering
 * twice is two entries. It is not a vehicle, and the vehicle scenes before it do
 * not convert into it. It is not a duration. And coverage is partial: a unit
 * without a covered boundary is absent from the reading, which is a different
 * thing from being quiet.
 */

import { useMemo } from "react";
import type {
  DataRole,
  SceneEvidenceDefinition,
  SceneId,
  SegmentId,
} from "../content/types";
import { getSceneForSegment } from "../content/runtime";
import { evidenceInputs } from "../content/evidence-inputs";
import {
  getSceneDependencyAvailability,
  getSceneEvidenceRuntime,
} from "../content/evidence-runtime";
import { getProofRuntimeForScene } from "../content/proof-runtime";
import type { LensId } from "../lib/types";
import { SceneLensRail, lensesToRoles } from "./SceneLensRail";

const SEGMENT: SegmentId = "retail-park";
const SCENE: SceneId = "retail-park-unit-visits";

interface RetailParkUnitVisitsSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only: the signal at the threshold, the directory that
 * gives it a name, and what a crossing still does not establish. Each cluster
 * borrows its wording from the scene's own typed evidence.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "signal",
    kicker: "Unit signal",
    label: "Entries detected at a covered unit boundary",
    evidenceType: "measured",
  },
  {
    id: "coverage",
    kicker: "Coverage",
    label: "What gives a crossing a unit and a category",
    evidenceType: "connected",
  },
  {
    id: "limit",
    kicker: "Limit",
    label: "What a unit visit establishes, and what it does not",
    evidenceType: "derived",
  },
];

const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Entry events at covered unit boundaries",
  business: "Tenant, unit and category mapping — what names a crossing",
  insight: "Unit visits, visit share and peaks, derived from both",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function RetailParkUnitVisitsScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailParkUnitVisitsSceneProps) {
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

  const byPeriod = dependencies.find(
    (entry) => entry.dependencyId === "retail-park-unit-visits-by-period",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture rp-units${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero rp-units__hero">
            <img
              src="/assets/location-visuals/retail-park/retail-park-brand-counting-hero.png"
              alt="Three separate retail park units side by side at dusk, each with its own fascia and its own entrance. A soft purple portal marks the doorway of each unit, and shoppers crossing those doorways carry a small purple ring at their feet. Surface parking sits beyond the planting to the left. No unit is ranked or labelled with a figure, no face is marked, and nothing is drawn between one unit and another."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Units
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* Visitation, not trade — and not the vehicle scenes converted into
                people. Both are live misreadings at exactly this point. */}
            <p className="rp-units__truth-line">
              A unit visit is an entry detected at a configured unit boundary. It is not a
              sale or a transaction, not a unique person, not a vehicle, and not how long
              anyone stayed. A unit without a covered boundary is absent from the reading
              rather than quiet.
            </p>
          </header>
        </section>

        <div className="rp-units__clusters" role="group" aria-label="Unit visits reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="rp-units__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="rp-units__reading">{cluster.label}</strong>
              <p className="rp-units__note">{cluster.note}</p>
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
              Illustrative unit-visit reading <span aria-hidden="true">·</span> crossings at
              covered unit boundaries, never transactions, people identified or vehicles
              {byPeriod && !byPeriod.available && byPeriod.missingInputIds.length > 0 && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {byPeriod.output.toLowerCase()} needs{" "}
                  {byPeriod.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          <div className="rp-units__decision-group">
            <p className="rp-units__decision">{scene.supportingLine}</p>
            {!presentationMode && !hasExternalProof && (
              <div className="capture__proof" role="note">
                <span className="capture__proof-mark" aria-hidden="true">i</span>
                <span>
                  <strong>No approved external proof yet</strong>
                  <small>Method shown; no customer result claimed</small>
                </span>
              </div>
            )}
          </div>
          <button type="button" className="capture__cta" onClick={onNextScene}>
            {scene.nextCta}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M0 6h15" />
              <path d="M11.5 2.5L15 6l-3.5 3.5" />
            </svg>
          </button>
        </div>
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
