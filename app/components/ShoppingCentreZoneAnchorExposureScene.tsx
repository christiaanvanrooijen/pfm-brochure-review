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
const SCENE: SceneId = "shopping-centre-zone-anchor-exposure";

interface ShoppingCentreZoneAnchorExposureSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three concepts, deliberately in the order of the equation this scene exists
 * to make legible: observed presence, the places the centre has defined, and
 * the exposure reading the two produce together. Measured, then connected,
 * then derived — the one Shopping Centre scene where the source order IS the
 * argument, so it is not reordered for rhythm.
 *
 * This is the second Understand step and it is the clearest Physical +
 * Business pairing in the segment. Internal circulation, the step before,
 * owns movement itself: where traffic travels, how it passes between floors
 * and zones, the corridors it spreads across. This one owns place. A zone is
 * a configured spatial area; an anchor is a specific destination inside the
 * centre; and relating observed presence to those defined areas is what makes
 * an exposure reading possible at all. Neither half is enough alone, which is
 * exactly what the typed derived entry says and why Business is required here.
 *
 * Each concept borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 * The scene has no approved demo values, so no exposure rate, reach share,
 * dwell time, hot/cold ranking or visitor total is stated anywhere — and
 * nothing here is carried over from the Retail Zone engagement board.
 *
 * The scene stops short of the next step on purpose. Brand counting asks which
 * stores or brands are actually visited; this asks only which defined areas
 * visitors are observed in and around. Presence near an area is not a visit to
 * it, and this scene never upgrades one into the other.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "presence",
    kicker: "Presence",
    label: "Where visitors are observed inside the centre",
    evidenceType: "measured",
  },
  {
    id: "places",
    kicker: "Zones & anchors",
    label: "The defined areas and destinations being compared",
    evidenceType: "connected",
  },
  {
    id: "exposure",
    kicker: "Exposure",
    label: "Which areas are reached, and how long visitors stay",
    evidenceType: "derived",
  },
];

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * All three source-side roles are REQUIRED here, so each can carry a scene note
 * in place of the bare "Awaiting demo evidence" line, and each is written to
 * stay true whether or not demo values ever arrive — it says what the layer is
 * for here, never what it holds.
 *
 * - Physical is the exposure signal itself: presence, entries and time observed
 *   within the centre's zones.
 * - Business is REQUIRED and it is not POS, tenant turnover or transactions.
 *   `zone_mapping` is a business-role input because the anchors, the tenant
 *   areas, the event spaces and the zone boundaries are customer-supplied
 *   definitions. Without them a presence observation belongs to nowhere in
 *   particular. The note names those definitions and nothing else, so nobody
 *   reads the required Business lens as a sales requirement — the same reason
 *   Internal circulation and Retail Zone engagement supply their own notes.
 * - Insight is the derived layer: exposure, reach and dwell, computed from the
 *   two named source layers and shown only when both are aligned.
 *
 * Mobile & geo is not declared by this scene at all — neither required, nor
 * optional, nor behind any evidence input — so the rail correctly renders it as
 * "No compatible input enabled". That is the honest state and it is not
 * overridden here. Aggregate area context describes a population around the
 * centre; it does not observe presence at a defined area inside it.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Presence, entries and time observed within the centre's zones",
  business: "Anchor, tenant, event and zone definitions supplied by the centre",
  insight: "Exposure, reach and dwell readings, derived from the named inputs",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "understand" -> "Understand". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ShoppingCentreZoneAnchorExposureScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: ShoppingCentreZoneAnchorExposureSceneProps) {
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
  // genuinely types itself as a branch of Catchment; the parking scenes are
  // branches of their own parents and Brand counting is the next Core step, not
  // a side door off this one. Nothing is wired here by hand to pretend
  // otherwise. Asserted in the scene's tests so this stays a fact about typed
  // content rather than an omission in this file.

  const exposure = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-zone-anchor-exposure",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture sc-exposure${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero sc-exposure__hero">
            <img
              src="/assets/location-visuals/shopping-centre/shopping-centre-brand-journey-hero.png"
              alt="A wide skylit atrium inside a shopping centre. Three storefronts are each drawn around with a soft purple rounded outline: a cosmetics unit on the left, a large chandelier-lit flagship behind full-height glass in the centre, and an accessories unit on the right. Anonymous visitors stand and walk across the pale stone floor, many of them resting on a soft purple ring lying on the floor beneath them. No outline or ring carries a label, and no face is framed or marked."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Zones
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The scene's truth boundary, stated in the main copy rather than
                only in the lens rail. The rail's supporting notes are hidden
                below 1200px by a shared rule this scene does not own, so the two
                things a reader must not get wrong survive here at 1024x768: the
                typed question says "attention", and attention here is presence
                at a defined area and nothing more; and a zone and an anchor are
                not the same object, which is the distinction the photograph can
                only half carry on its own. */}
            <p className="sc-exposure__truth-line">
              Attention is read here as observed presence in and around a defined area —
              never as a look, a choice or a purchase. A zone is an area the centre
              configures; an anchor is a destination inside it.
            </p>
          </header>
        </section>

        {/* Three editorial callouts rising out of the feathered foot of the
            atrium plate, in the order of the equation the scene exists to land:
            observed presence, the places the centre has defined, and the
            exposure reading the two produce together. The photograph already
            carries both source roles — the rings on the floor are observed
            presence, the outlined units are the configured anchors — so this row
            names the concepts and explains each in the scene's own typed words.
            No values, because none are approved, and no area is called strong,
            weak, hot or cold. */}
        <div className="sc-exposure__clusters" role="group" aria-label="Zone and anchor exposure reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="sc-exposure__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="sc-exposure__reading">{cluster.label}</strong>
              <p className="sc-exposure__note">{cluster.note}</p>
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
              {/* The pairing the three callouts state one at a time, said once as
                  a single sentence: observed movement only becomes exposure
                  where the centre has defined the area it is read against. It
                  sits in the definition line because that line renders at every
                  supported viewport, and it is followed by the runtime's own
                  report of which named inputs the derived reading is still
                  waiting for. */}
              Illustrative exposure reading <span aria-hidden="true">·</span> observed
              movement becomes exposure only where the centre has defined the area it is
              read against
              {exposure && !exposure.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {exposure.output.toLowerCase()} need{" "}
                  {exposure.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Left of the step forward: what an operator does with an exposure
              reading (the scene's own typed decision line), and — for the
              presenter only — the proof state of this step. Grouped so the CTA
              keeps the same right-hand anchor it has in every other scene
              whether or not the presenter note is rendered. */}
          <div className="sc-exposure__decision-group">
            <p className="sc-exposure__decision">{scene.supportingLine}</p>
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
