"use client";

/**
 * Retail Park — Catchment area. The first scene of the Retail Park Core route.
 *
 * WHAT THIS SCENE IS
 *
 * Geographic reach, and nothing else. It answers where demand around the park
 * sits, from an approved aggregate source. It is the only scene in this segment
 * that is not a measurement of the asset itself.
 *
 * THE BOUNDARY THAT MATTERS HERE
 *
 * Catchment describes area context, not a list of measured visitors. Nobody in
 * the bands has been observed arriving, no vehicle has been traced to a home
 * address, and this layer never replaces the vehicle and unit measurement that
 * follows it. That distinction is stated on the page rather than implied,
 * because "where visitors come from" is the sentence a reader is most likely to
 * hear as a claim about people who were actually counted.
 *
 * WHAT THIS SCENE MUST NOT TOUCH
 *
 * No ANPR, no licence plates, no vehicle origin. Vehicle origin is an advanced
 * branch of this segment and stays there — it is the only scene permitted to
 * consume plate events, and it is not this one. TECH-07 is the sole capability
 * declared here.
 *
 * The layout reuses the shared `catchment__*` grammar established by the frozen
 * Shopping Centre scene. The environment does the segment's storytelling: an
 * open-air power centre, its surface parking and its road access.
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
const SCENE: SceneId = "retail-park-catchment-area";

interface RetailParkCatchmentSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only, in the order a catchment conversation runs.
 *
 * The connected aggregate layer leads, because it is the only layer that can
 * answer "where do they come from" at all. What the park's own sensors do —
 * anchor demand on site without measuring origin — comes last, and that
 * position is the honest reading rather than a demotion: it is the entry that
 * says out loud that unit sensors do not measure where anyone came from.
 *
 * Each cluster borrows its explanation verbatim from the scene's typed evidence,
 * so the words on screen stay tied to the typed truth model. No band size, drive
 * time, population figure or origin share appears anywhere — none is approved.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "reach",
    kicker: "Reach",
    label: "Where demand around the park sits",
    evidenceType: "connected",
  },
  {
    id: "profile",
    kicker: "Profile",
    label: "What that reach is made of, and how far it drives",
    evidenceType: "derived",
  },
  {
    id: "on-site",
    kicker: "On site",
    label: "What the park's own sensors anchor, and what they cannot",
    evidenceType: "measured",
  },
];

const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  mobile_geo: "Approved aggregate origin and reach context — the primary layer here",
  insight: "Catchment bands and origin mix, derived from the approved source",
  physical: "On-site visits can anchor demand, but never origin",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "context" -> "Context". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function RetailParkCatchmentScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailParkCatchmentSceneProps) {
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

  const reach = dependencies.find(
    (entry) => entry.dependencyId === "retail-park-catchment-reach",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture catchment${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero catchment__hero">
            <div className="catchment__frame">
              <img
                src="/assets/location-visuals/retail-park/retail-park-geo-intelligence-hero.png"
                alt="A retail park photographed from the air at dusk: low rectangular terraces of units around a large surface car park, a bigger anchor unit at the front, and a dual carriageway and roundabout running past it. Soft purple arcs and rings spread outward from the park across the surrounding towns. No vehicle, plate, person or unit carries a label or a figure."
              />
            </div>
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Outside
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The sentence a reader is most likely to hear as a claim about
                counted people, answered before they can. */}
            <p className="catchment__privacy-line">
              Catchment describes area context from an approved aggregate source — not a
              list of measured park visitors, no individuals and no home addresses. It sits
              beside the arrival and unit measurement that follows, and never replaces it.
            </p>
          </header>
        </section>

        <div className="catchment__clusters" role="group" aria-label="Catchment reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="catchment__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="catchment__reading">{cluster.label}</strong>
              <p className="catchment__note">{cluster.note}</p>
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
              Illustrative catchment context <span aria-hidden="true">·</span> aggregate area
              context, not arrival or unit measurement
              {reach && !reach.available && reach.missingInputIds.length > 0 && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {reach.output.toLowerCase()} needs{" "}
                  {reach.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          <div className="catchment__decision-group">
            <p className="catchment__decision">{scene.supportingLine}</p>
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
