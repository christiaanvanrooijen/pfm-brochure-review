"use client";

/**
 * Retail Park — Parking occupancy. The third scene of the Retail Park Core route.
 *
 * WHAT THIS SCENE OWNS
 *
 * How much of a defined parking capacity is in use, and where. Occupancy is the
 * only reading in this segment that needs a DENOMINATOR: without an agreed
 * capacity, a zone map and the operating rules that go with them, there is a
 * numerator and nothing to divide it by.
 *
 * WHY IT IS NOT THE SCENE BEFORE IT
 *
 * Vehicle arrival counts movements across an access point. Occupancy is a state
 * of the car park at a moment. `impl-vehicle-arrival-method` disclaims
 * "suitability for occupancy", and `impl-parking-occupancy-method` disclaims
 * "interchangeability with arrival counting" — the two are different
 * measurements in the typed model, and this scene does not inherit the previous
 * one's numbers.
 *
 * THE BOUNDARIES
 *
 * An occupied bay is one vehicle in one space. It carries no count of people:
 * a full car park is not a full centre, and one bay says nothing about how many
 * got out of the car. Occupancy is also not dwell — turnover needs matched
 * arrivals and departures, not a state. And no plate is read anywhere: ANPR
 * belongs to the advanced vehicle-origin branch, not to Core.
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
const SCENE: SceneId = "retail-park-parking-occupancy";

interface RetailParkParkingOccupancySceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only: the signal, the denominator that makes it a rate,
 * and what the reading still does not establish. The middle cluster is the one
 * that distinguishes this scene from every other measured scene in the segment —
 * capacity is business data, and without it there is no occupancy at all.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "signal",
    kicker: "Signal",
    label: "What tells us a space is in use",
    evidenceType: "measured",
  },
  {
    id: "denominator",
    kicker: "Denominator",
    label: "The capacity and zones a rate is measured against",
    evidenceType: "connected",
  },
  {
    id: "limit",
    kicker: "Limit",
    label: "What occupancy establishes, and what it does not",
    evidenceType: "derived",
  },
];

const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Parking entry/exit or bay-state events, depending on the setup",
  business: "Capacity, zone and operating definitions — the denominator",
  insight: "Occupancy, utilisation and pressure by zone, derived from both",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function RetailParkParkingOccupancyScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailParkParkingOccupancySceneProps) {
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

  const pressure = dependencies.find(
    (entry) => entry.dependencyId === "retail-park-parking-pressure",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture rp-parking${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero rp-parking__hero">
            <img
              src="/assets/location-visuals/retail-park/retail-park-parking-occupancy-hero.png"
              alt="A retail park car park seen from above at an angle, late in the day. Rows of marked bays run across the frame, some holding a parked car and many standing empty. Two areas of the car park are outlined with a soft purple boundary, and the cars standing inside them carry a gentle purple fill; the empty bays are left untouched. No vehicle is boxed, labelled or has its plate read, and no person is marked."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Parking
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The denominator is the whole point, and an occupied bay is still
                one vehicle — never a number of people. */}
            <p className="rp-parking__truth-line">
              Occupancy is how much of an agreed capacity is in use, by zone. It is not the
              number of vehicles that arrived, not how long any of them stayed, and not a
              count of people — one occupied bay is one vehicle.
            </p>
          </header>
        </section>

        <div className="rp-parking__clusters" role="group" aria-label="Parking occupancy reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="rp-parking__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="rp-parking__reading">{cluster.label}</strong>
              <p className="rp-parking__note">{cluster.note}</p>
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
              Illustrative occupancy reading <span aria-hidden="true">·</span> a state of the
              car park against a defined capacity, never an arrival count or a duration
              {pressure && !pressure.available && pressure.missingInputIds.length > 0 && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {pressure.output.toLowerCase()} needs{" "}
                  {pressure.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          <div className="rp-parking__decision-group">
            <p className="rp-parking__decision">{scene.supportingLine}</p>
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
