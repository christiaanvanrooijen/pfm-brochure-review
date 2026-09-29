"use client";

/**
 * Retail Park — Cross-visitation. The fifth scene of the Retail Park Core route.
 *
 * WHAT THIS SCENE OWNS
 *
 * The relationship between units: which covered units are visited in the same
 * trip, and in what order. Scene 4 counted crossings at one unit; this one is
 * about the step between two of them.
 *
 * WHY TECH-05 AND NOT TECH-04
 *
 * A sequence here is built from anonymous MATCHED visits, not from a path
 * followed across the site. This segment declares no trajectory input anywhere,
 * which is exactly why the earlier TECH-04 declaration was narrowed away: a
 * retail park is separate buildings around a car park, and nobody is tracked over
 * the tarmac between them. Two covered crossings can be matched to one another;
 * what happened in between is not observed.
 *
 * THE BOUNDARIES
 *
 * A sequence is not a purchase, and it is not transaction linkage — PFM measures
 * visitation, never trade. It is not a recognised person: matching is anonymous,
 * and it never becomes an identity. It is not a guaranteed count of unique
 * visitors. It is not a reason — an order of visits is not a cause of one. And
 * coverage is partial: where a unit is not covered, its step is missing from the
 * sequence rather than absent from the trip.
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
const SCENE: SceneId = "retail-park-cross-visitation";

interface RetailParkCrossVisitationSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only: what a sequence is made of, what turns two units
 * into a network worth reading, and what the sequence still does not establish.
 * Each cluster borrows its wording from the scene's own typed evidence.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "sequence",
    kicker: "Sequence",
    label: "Anonymous visits at two covered units, matched to each other",
    evidenceType: "measured",
  },
  {
    id: "network",
    kicker: "Network",
    label: "What makes two units a pair worth comparing",
    evidenceType: "connected",
  },
  {
    id: "limit",
    kicker: "Limit",
    label: "What a sequence establishes, and what it does not",
    evidenceType: "derived",
  },
];

const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Anonymous matched visits between covered units",
  business: "Tenant, unit and category mapping — the units in the network",
  insight: "Cross-visitation and common sequences, derived from both",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function RetailParkCrossVisitationScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailParkCrossVisitationSceneProps) {
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

  const crossVisitation = dependencies.find(
    (entry) => entry.dependencyId === "retail-park-unit-cross-visitation",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture rp-cross${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero rp-cross__hero">
            <img
              src="/assets/location-visuals/retail-park/retail-park-visitor-brand-flow-hero.png"
              alt="An open-air retail park at dusk, with several separate units around a paved plaza. Each unit doorway is lit with a soft purple portal, and slim purple lines curve across the plaza linking one doorway to another. Some shoppers carry a small ring at their feet where a line passes. Surface parking sits to the left. No line is followed continuously from person to person, no face is marked, and no unit carries a figure or a rank."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Between units
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* Matched, not followed — and an order of visits is not a reason for
                one. Both are live misreadings at exactly this point. */}
            <p className="rp-cross__truth-line">
              A sequence is an anonymous visit at one covered unit matched to another —
              never a purchase between them, a recognised person, a guaranteed count of
              unique visitors, or a reason anyone moved. An uncovered unit is a missing
              step, not an absent one.
            </p>
          </header>
        </section>

        <div className="rp-cross__clusters" role="group" aria-label="Cross-visitation reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="rp-cross__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="rp-cross__reading">{cluster.label}</strong>
              <p className="rp-cross__note">{cluster.note}</p>
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
              Illustrative cross-visitation reading <span aria-hidden="true">·</span> matched
              anonymous visits between covered units, never a followed path or a purchase
              {crossVisitation &&
                !crossVisitation.available &&
                crossVisitation.missingInputIds.length > 0 && (
                  <>
                    {" "}
                    <span aria-hidden="true">·</span>{" "}
                    {crossVisitation.output.toLowerCase()} needs{" "}
                    {crossVisitation.missingInputIds
                      .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                      .join(" · ")}
                  </>
                )}
            </>
          )}
        </p>

        <div className="capture__decision">
          <div className="rp-cross__decision-group">
            <p className="rp-cross__decision">{scene.supportingLine}</p>
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
