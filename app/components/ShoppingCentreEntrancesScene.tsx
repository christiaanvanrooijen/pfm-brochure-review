"use client";

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

const SEGMENT: SegmentId = "shopping-centre";
const SCENE: SceneId = "shopping-centre-entrances";

interface ShoppingCentreEntrancesSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three concepts, in the order an arrivals conversation actually runs: what the
 * entrance itself records, what that time series makes derivable, and what
 * outside context can explain about the shape of it.
 *
 * This is the inverse of the Catchment order, and deliberately so. Catchment
 * leads with the connected aggregate layer because that is the only layer that
 * can answer "where do they come from". This scene leads with what is measured,
 * because direct measurement is its whole subject — the step where the story
 * stops describing an area and starts counting the asset's own doors. It is the
 * same order Retail's own Measure stage uses.
 *
 * Each concept borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 * The scene has no approved demo values, so no arrival total, entrance share,
 * percentage, peak hour or ranking is stated anywhere. Every label is
 * observational, and no label implies that an entrance count resolves a person.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "arrivals",
    kicker: "Arrivals",
    label: "What each entrance records",
    evidenceType: "measured",
  },
  {
    id: "rhythm",
    kicker: "Entrance mix",
    label: "How arrivals split and when they peak",
    evidenceType: "derived",
  },
  {
    id: "context",
    kicker: "Context",
    label: "What can explain an arrival pattern",
    evidenceType: "connected",
  },
];

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * Only two roles can actually receive a scene note here, and the rail's own
 * logic is what decides that — not a per-scene override:
 *
 * - Physical and Insight are the scene's REQUIRED roles, so the rail
 *   substitutes a supplied note in place of the bare "Awaiting demo evidence".
 *   Both lines below are written to stay true whether or not demo values ever
 *   arrive, since they describe what the layer is for, never what it holds.
 * - Business is declared (through `operational_context`) but only OPTIONAL, and
 *   with no demo evidence anywhere in the scene the rail reports
 *   "Awaiting demo evidence" for it regardless of any note supplied. A note is
 *   therefore deliberately not supplied: it could never render, and dead copy in
 *   a truth-modelled scene is worse than no copy.
 * - Mobile & geo is not declared by this scene at all — neither required, nor
 *   optional, nor behind any evidence input — so the rail correctly renders it
 *   as "No compatible input enabled". That is the honest state and it is not
 *   overridden here: aggregate area context is not a weaker way of counting
 *   arrivals, it is not a way of counting arrivals at all. Catchment already
 *   says the converse in its own rail.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Anonymous arrivals measured at the centre entrances",
  insight: "Entrance share and arrival rhythm, derived from the entrance time series",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "measure" -> "Measure". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ShoppingCentreEntrancesScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: ShoppingCentreEntrancesSceneProps) {
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

  // No branch affordance: no Optional scene in the segment declares this one as
  // its parent, so `getOptionalBranchesForScene` returns nothing for it and
  // there is nothing to offer. Catchment renders a branch because White spots
  // genuinely types itself as a branch of Catchment; Parking arrival is a later
  // Core step of its own, not a side door off Entrances, and nothing is wired
  // here by hand to pretend otherwise. Asserted in the scene's tests so this
  // stays a fact about typed content rather than an omission in this file.

  const rhythm = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-entrance-rhythm",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture entrances${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero entrances__hero">
            <img
              src="/assets/location-visuals/shopping-centre/shopping-centre-visitors-hero.png"
              alt="The entrance frontage of a shopping centre photographed from the plaza at dusk — a low-rise stone and glass centre with several separate entrance door sets lit from inside, and anonymous people crossing the paved plaza towards them, with purple movement paths sweeping across the paving and converging on the entrance lines"
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Entrance
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The scene's truth boundary, stated in the main copy rather than
                only in the lens rail. The rail's supporting notes are hidden
                below 1200px by a shared rule this task does not touch, so the
                one thing a reader must not get wrong — an entrance count is an
                anonymous crossing, not a resolved person — is said here, where
                it survives at 1024×768. */}
            <p className="entrances__truth-line">
              Anonymous entry and exit events, counted at each entrance by time. Arrivals
              are measured — people are not identified, and crossings are not matched
              between entrances or across a day.
            </p>
          </header>
        </section>

        {/* Three editorial callouts rising out of the feathered foot of the
            entrance plate, in the order the conversation runs: what is
            recorded, what that makes derivable, what can explain its shape. The
            photograph already carries the arrival; this row names the concepts
            and explains each in the scene's own typed words. No values, because
            none are approved — and no entrance is named as the busiest, because
            nothing here could support that. */}
        <div className="entrances__clusters" role="group" aria-label="Entrance reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="entrances__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="entrances__reading">{cluster.label}</strong>
              <p className="entrances__note">{cluster.note}</p>
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
              Illustrative entrance reading <span aria-hidden="true">·</span> measured on
              site at the asset&rsquo;s own doors, not aggregate area context
              {rhythm && !rhythm.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {rhythm.output.toLowerCase()} need{" "}
                  {rhythm.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Left of the step forward: what an operator does with a measured
              arrival pattern (the scene's own typed decision line), and — for
              the presenter only — the proof state of this step. Grouped so the
              CTA keeps the same right-hand anchor it has in every other scene
              whether or not the presenter note is rendered. */}
          <div className="entrances__decision-group">
            <p className="entrances__decision">{scene.supportingLine}</p>
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
