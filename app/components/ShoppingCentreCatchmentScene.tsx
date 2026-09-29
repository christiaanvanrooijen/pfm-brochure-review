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

const SEGMENT: SegmentId = "shopping-centre";
const SCENE: SceneId = "shopping-centre-catchment-area";

interface ShoppingCentreCatchmentSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three concepts, in the order a catchment conversation actually runs: what the
 * approved external source describes (reach), what can be derived from it
 * (origin mix and travel time), and what the asset's own sensors do and do not
 * contribute (a visit baseline, never an origin).
 *
 * The order is deliberately the inverse of the Retail scenes. Retail leads with
 * what is physically measured because measurement is its subject; this scene
 * leads with the connected aggregate layer because that is the only layer that
 * can answer "where do they come from" at all. Putting the on-site baseline last
 * is the honest reading, not a demotion — it is the entry that says out loud
 * that entrance sensors do not measure origin.
 *
 * Each concept borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 * The scene has no approved demo values, so no catchment percentage, band size,
 * drive time, population figure or origin share is stated anywhere. Every label
 * is observational.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "reach",
    kicker: "Reach",
    label: "Where the centre draws from",
    evidenceType: "connected",
  },
  {
    id: "origin",
    kicker: "Origin",
    label: "Who lives inside that reach",
    evidenceType: "derived",
  },
  {
    id: "baseline",
    kicker: "On site",
    label: "What the asset itself measures",
    evidenceType: "measured",
  },
];

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * This scene inverts the Retail pattern and the rail has to say why. Mobile &
 * geo is the REQUIRED layer here: catchment is aggregate area context, and no
 * amount of entrance measurement produces an origin. Physical is optional and
 * narrower than the generic "Measured at the location" suggests — it anchors the
 * asset's own visit baseline and nothing more — and Insight is derived strictly
 * from the approved aggregate source, not from the entrance count.
 *
 * The rail only substitutes a scene note where the role is required or already
 * contributing, so the Physical line below is written to be true in either
 * place it can appear.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  mobile_geo: "Approved aggregate origin and reach context · the primary layer here",
  physical: "On-site visit baseline only — entrance sensors do not measure origin",
  insight: "Catchment bands and origin mix, derived from the approved aggregate source",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "context" -> "Context". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ShoppingCentreCatchmentScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: ShoppingCentreCatchmentSceneProps) {
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

  // Competitive visitation & white spots is typed as an Optional branch of this
  // scene, so it resolves directly. The affordance opens a panel in place and
  // returns to this scene — the same behaviour the Retail scenes established.
  const branches = useMemo(() => getOptionalBranchesForScene(SEGMENT, SCENE), []);
  const branch = branches[0];

  const reach = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-catchment-reach",
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
                src="/assets/location-visuals/shopping-centre/shopping-centre-geo-intelligence-hero.png"
                alt="A shopping centre photographed from the air at dusk — storefronts, parking and the road network around it, with a purple reach visualisation drawn over the wider area as arcs and connection lines running out from the centre towards the surrounding towns"
              />
            </div>
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Outside
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            <p className="catchment__privacy-line">
              Aggregate area context from an approved external source — no individuals, no
              devices and no personal profiles.
            </p>
          </header>
        </section>

        {/* Three editorial callouts rising out of the feathered foot of the
            aerial, in the order the conversation runs. The photograph already
            carries the reach; this row names the concepts and explains each in
            the scene's own typed words. No values, because none are approved. */}
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
              Illustrative catchment composition <span aria-hidden="true">·</span> aggregate
              context, not entrance measurement
              {reach && !reach.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {reach.output.toLowerCase()} need{" "}
                  {reach.missingInputIds
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
              be shown — the same gate every Retail scene applies. */}
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
