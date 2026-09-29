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
const SCENE: SceneId = "shopping-centre-internal-circulation";

interface ShoppingCentreInternalCirculationSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three concepts, in the order a circulation conversation actually runs: where
 * traffic travels, how it moves between floors and zones, and the property
 * structure it spreads across.
 *
 * This is the first Understand step, and it is the step where the story walks
 * through the doors. Entrances and Visitor composition both stand at the
 * threshold — one counts crossings, the other describes the mix making them.
 * From here the subject is the inside of the asset: routes across a floor,
 * movement between floors, and the corridors, zones and anchors those routes
 * run through. It stops short of the next step on purpose. Zone & anchor
 * exposure asks where attention builds; this asks only where movement goes.
 *
 * The middle cluster is deliberately the DERIVED entry rather than the
 * connected one. Route structure and floor-to-floor movement are the scene's
 * whole subject and they are not measured directly — they are computed from a
 * movement signal aligned against spatial definitions, which is exactly what
 * the typed derived entry says. Putting it second keeps the reading honest:
 * measured first, derived from it, and the configured structure that makes the
 * derivation possible named last, where it belongs to the Business layer.
 *
 * Each concept borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 * The scene has no approved demo values, so no flow percentage, route share,
 * floor share, transition count, dwell value or visitor total is stated
 * anywhere — and nothing here is carried over from the Retail Property
 * reference board. Every label is observational: a route may be described as
 * busier or quieter, never as a reason, a failure or a cause.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "movement",
    kicker: "Movement",
    label: "Where traffic travels inside the centre",
    evidenceType: "measured",
  },
  {
    id: "transitions",
    kicker: "Transitions",
    label: "How movement passes between floors and zones",
    evidenceType: "derived",
  },
  {
    id: "distribution",
    kicker: "Distribution",
    label: "The floors, corridors and zones traffic spreads across",
    evidenceType: "connected",
  },
];

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * This is the first Shopping Centre scene that REQUIRES all three source-side
 * roles, so all three can carry a scene note in place of the bare "Awaiting
 * demo evidence" line, and each has to say what its layer is for here without
 * claiming what it holds:
 *
 * - Physical is the movement signal itself — anonymous trajectories and zone
 *   transitions observed on the floor.
 * - Business is REQUIRED here for the first time in the segment, and it is not
 *   POS, tenant sales or turnover. `spatial_definitions` is a business-role
 *   input because the floorplan, the floors, the corridors, the zones, the
 *   anchors and the vertical-transport definitions are customer-supplied
 *   configuration. Without them a trajectory is a line with no meaning. The
 *   note says exactly that, so nobody reads the required Business lens as a
 *   sales requirement — the same reason Zone engagement supplies its own note.
 * - Insight is the derived layer: flow matrix, route structure and
 *   floor-to-floor movement, computed from the two named source layers.
 *
 * Mobile & geo is not declared by this scene at all — neither required, nor
 * optional, nor behind any evidence input — so the rail correctly renders it as
 * "No compatible input enabled". That is the honest state and it is not
 * overridden here. Aggregate area context describes movement around a region;
 * it does not observe a route inside the building, and Catchment's geo layer is
 * not carried in here as if it did.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Anonymous movement and zone transitions observed inside the centre",
  business: "Centre layout, floors and configured spatial definitions",
  insight: "Route structure and floor-to-floor movement, derived from the named inputs",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "understand" -> "Understand". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ShoppingCentreInternalCirculationScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: ShoppingCentreInternalCirculationSceneProps) {
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
  // genuinely types itself as a branch of Catchment; Brand flow and the parking
  // scenes are later Core steps of their own, not side doors off this one, and
  // nothing is wired here by hand to pretend otherwise. Asserted in the scene's
  // tests so this stays a fact about typed content rather than an omission in
  // this file.

  const flow = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-internal-circulation-flow",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture sc-circulation${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero sc-circulation__hero">
            <img
              src="/assets/location-visuals/shopping-centre/shopping-centre-spatial-journey-hero.png"
              alt="The concourse of a multi-storey shopping centre from floor level — shopfronts left and right, upper-level balconies above, a planted atrium and a seating island, and an escalator bank in the centre of the frame with anonymous visitors riding between floors. Thin purple route lines sweep across the stone floor, splitting and rejoining, while soft purple rounded outlines rest over the shopfront areas to mark configured zones. Everyone is anonymous and mostly seen from behind, and no line or outline carries a label."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Circulation
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The scene's truth boundary, stated in the main copy rather than
                only in the lens rail. The rail's supporting notes are hidden
                below 1200px by a shared rule this scene does not own, so the one
                thing a reader must not get wrong — a movement event is a
                crossing, not a person — is said here, where it survives at
                1024×768. The escalator is the clearest case and it is the one
                the plate already shows, so it is the one named. */}
            <p className="sc-circulation__truth-line">
              Anonymous movement events and zone transitions, observed where zones,
              corridors and vertical transport are configured. Movement events are not
              unique visitors — a visitor going up and coming back down is observed each
              time.
            </p>
          </header>
        </section>

        {/* Three editorial callouts rising out of the feathered foot of the
            concourse plate, in the order the conversation runs: where traffic
            travels, how it passes between floors and zones, and the configured
            structure it spreads across. The photograph already carries both
            source roles — the route lines are the observed movement, the rounded
            outlines are the configured zones — so this row names the concepts
            and explains each in the scene's own typed words. No values, because
            none are approved, and no route is called busy, quiet, good or bad. */}
        <div className="sc-circulation__clusters" role="group" aria-label="Internal circulation reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="sc-circulation__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="sc-circulation__reading">{cluster.label}</strong>
              <p className="sc-circulation__note">{cluster.note}</p>
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
              {/* The distinction the callouts above cannot carry on their own,
                  and the one most easily collapsed: counting registers a
                  crossing at a configured location, a matched anonymous journey
                  connects separate observations into a route. They are different
                  readings and the scene never merges them into one continuous
                  trail. It sits in the definition line because that line renders
                  at every supported viewport. */}
              Illustrative circulation reading <span aria-hidden="true">·</span> counting
              registers a crossing at a configured location; a matched anonymous journey
              connects separate observations into a route
              {flow && !flow.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {flow.output.toLowerCase()} need{" "}
                  {flow.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Left of the step forward: what an operator does with a circulation
              reading (the scene's own typed decision line), and — for the
              presenter only — the proof state of this step. Grouped so the CTA
              keeps the same right-hand anchor it has in every other scene
              whether or not the presenter note is rendered. */}
          <div className="sc-circulation__decision-group">
            <p className="sc-circulation__decision">{scene.supportingLine}</p>
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
