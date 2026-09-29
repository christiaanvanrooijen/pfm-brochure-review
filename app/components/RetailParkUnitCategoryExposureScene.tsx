"use client";

/**
 * Retail Park — Unit & category exposure. The seventh and LAST scene of the
 * Retail Park Core route.
 *
 * WHAT THIS SCENE OWNS
 *
 * How much visitation a covered unit or category received, and how far a
 * category reaches across the park. Scene 4 counted crossings at one unit and
 * Scene 5 matched two of them; this one steps back and reads the parade as a mix
 * of categories rather than a list of doors.
 *
 * WHY IT ENDS THE ROUTE
 *
 * It types no `nextSceneId`. Its CTA hands over to Configure, which is a
 * synthesis stage rather than a scene — the same shape Time in Centre uses to
 * close the Shopping Centre route. Nothing here invents a next scene.
 *
 * THE BOUNDARIES
 *
 * Exposure is visitation, not trade. It is not a sale, a transaction, a
 * conversion or an intention, and it attributes nothing to anything. It ranks
 * nothing: a category with more exposure is not a better category, and this
 * scene names no winner.
 *
 * COVERAGE IS THE SHARPEST ONE HERE
 *
 * A unit or category outside configured coverage has UNKNOWN exposure. Not zero,
 * and not an absence of interest. That distinction matters more in this scene
 * than anywhere else in the segment, because a category map with a gap in it
 * looks exactly like a category nobody visited.
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
const SCENE: SceneId = "retail-park-unit-category-exposure";

interface RetailParkUnitCategoryExposureSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "signal",
    kicker: "Signal",
    label: "What exposure is measured from",
    evidenceType: "measured",
  },
  {
    id: "meaning",
    kicker: "Meaning",
    label: "What turns a covered unit into a category",
    evidenceType: "connected",
  },
  {
    id: "limit",
    kicker: "Limit",
    label: "What exposure establishes, and what it does not",
    evidenceType: "derived",
  },
];

const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Covered unit and zone visits, with time",
  business: "Tenant, unit, category and boundary mappings — the categories themselves",
  insight: "Exposure rate and category reach, derived from both",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function RetailParkUnitCategoryExposureScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailParkUnitCategoryExposureSceneProps) {
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

  const exposure = dependencies.find(
    (entry) => entry.dependencyId === "retail-park-unit-category-exposure",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture rp-exposure${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero rp-exposure__hero">
            <img
              src="/assets/location-visuals/retail-park/retail-park-unit-category-exposure-hero.png"
              alt="A retail park parade seen along its length at dusk, with several units of different kinds side by side. A soft purple halo rests over each covered unit, stronger over some than others, and a thin line groups two units that share a category. One unit at the end of the parade carries no halo at all and is drawn with a dashed outline. No unit is numbered, ranked or labelled with a figure, and no face is marked."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Exposure
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* Coverage first: a category map with a gap in it looks exactly like
                a category nobody visited, and that is the error to prevent. */}
            <p className="rp-exposure__truth-line">
              Exposure is how much visitation a covered unit or category received. A unit
              outside coverage has unknown exposure — not none, and not a lack of interest.
              Exposure is not a sale, a conversion or an intention, and it ranks nothing.
            </p>
          </header>
        </section>

        <div className="rp-exposure__clusters" role="group" aria-label="Unit and category exposure reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="rp-exposure__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="rp-exposure__reading">{cluster.label}</strong>
              <p className="rp-exposure__note">{cluster.note}</p>
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
              Illustrative exposure reading <span aria-hidden="true">·</span> visitation of
              covered units and categories, never trade, attribution or a ranking
              {exposure && !exposure.available && exposure.missingInputIds.length > 0 && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {exposure.output.toLowerCase()} needs{" "}
                  {exposure.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          <div className="rp-exposure__decision-group">
            <p className="rp-exposure__decision">{scene.supportingLine}</p>
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
          {/* The last Core scene types no next scene: this hands over to
              Configure, which the shell owns as a synthesis stage. */}
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
