"use client";

/**
 * Retail Park — Vehicle arrival. The second scene of the Retail Park Core route.
 *
 * WHAT THIS SCENE OWNS
 *
 * Vehicle arrival counting, and only that: how many vehicles crossed a
 * configured access point, and when. It is the first measured scene of the
 * segment and the first place the vehicle model becomes visible.
 *
 * THE BOUNDARY THAT MATTERS HERE
 *
 * A vehicle is not a visitor. `vehicle-semantics.ts` has held that invariant as
 * architecture since before this segment had a single component, and this is the
 * scene where it finally reaches a reader. A count of vehicles is a count of
 * vehicles: it carries no occupancy figure, no people number and no park
 * footfall. Turning one into the other is a modelling decision that belongs to
 * whoever makes it explicitly, and it is not made here.
 *
 * THREE THINGS THIS SCENE IS NOT
 *
 * - Not parking occupancy. That needs a capacity denominator and bay state, and
 *   it is the next scene. A count of arrivals cannot produce it.
 * - Not vehicle dwell. Dwell needs an arrival matched to a departure; a count
 *   alone cannot produce a duration.
 * - Not ANPR. No plate, no registration, no origin. Vehicle origin is an
 *   advanced branch of this segment and is the only scene permitted to consume
 *   plate events. TECH-06 is declared here as arrival counting only.
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
const SCENE: SceneId = "retail-park-vehicle-arrival";

interface RetailParkVehicleArrivalSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only, in the order the measurement is built up: what is
 * counted, what explains the shape of it, and — deliberately last and stated as
 * plainly as the rest — what a count of vehicles does not establish.
 *
 * The limit is a cluster rather than a footnote because in this segment it is
 * the single most expensive thing to get wrong. Each cluster borrows its wording
 * from the scene's own typed evidence.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "arrivals",
    kicker: "Arrivals",
    label: "Vehicles crossing a configured access point, by time",
    evidenceType: "measured",
  },
  {
    id: "context",
    kicker: "Context",
    label: "What can explain the shape of a day",
    evidenceType: "connected",
  },
  {
    id: "limit",
    kicker: "Limit",
    label: "What the arrival series establishes, and what it does not",
    evidenceType: "derived",
  },
];

const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Vehicle entry and exit events at the configured access points",
  insight: "Arrival peaks and access-point share, derived from the time series",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function RetailParkVehicleArrivalScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailParkVehicleArrivalSceneProps) {
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

  const rhythm = dependencies.find(
    (entry) => entry.dependencyId === "retail-park-vehicle-arrival-rhythm",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture rp-arrival${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero rp-arrival__hero">
            <img
              src="/assets/location-visuals/retail-park/retail-park-vehicle-arrival-hero.png"
              alt="A retail park access road at golden hour, seen from above the entrance. Cars drive in along the carriageway towards the units, and a single slim purple line is drawn across the road where they cross into the park — the configured access point. Surface parking and a terrace of units run along both sides. No vehicle is boxed, labelled or has its plate read, and no person is marked."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Arrival
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The invariant `vehicle-semantics.ts` has held since before this
                segment had a component, said out loud at the first scene that
                could be misread as a people number. */}
            <p className="rp-arrival__truth-line">
              Vehicle arrivals describe movements through a configured access point. They do
              not tell us how many people arrived, how long anyone stayed, or how full the
              car park is — a vehicle is not a visitor, and a count is not a duration.
            </p>
          </header>
        </section>

        <div className="rp-arrival__clusters" role="group" aria-label="Vehicle arrival reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="rp-arrival__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="rp-arrival__reading">{cluster.label}</strong>
              <p className="rp-arrival__note">{cluster.note}</p>
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
              Illustrative vehicle-arrival reading <span aria-hidden="true">·</span> vehicles
              counted at the access point, never people, occupancy or dwell
              {rhythm && !rhythm.available && rhythm.missingInputIds.length > 0 && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {rhythm.output.toLowerCase()} needs{" "}
                  {rhythm.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          <div className="rp-arrival__decision-group">
            <p className="rp-arrival__decision">{scene.supportingLine}</p>
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
