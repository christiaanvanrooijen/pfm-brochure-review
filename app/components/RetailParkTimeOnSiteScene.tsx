"use client";

/**
 * Retail Park — Time on site. The sixth scene of the Retail Park Core route.
 *
 * WHAT THIS SCENE OWNS
 *
 * Elapsed time inside configured coverage. It is the only scene in the segment
 * whose subject is a duration, and the only one that can be read from either of
 * two entirely different units — which is exactly why it is the most dangerous
 * one to write.
 *
 * THE UNIT IS ALWAYS NAMED
 *
 * The typed measured evidence says "supported vehicle OR visitor duration
 * events", and the derived evidence ends with the sentence this whole scene
 * turns on: vehicle duration is not people duration. A car standing in a bay for
 * ninety minutes is a vehicle dwell. A person inside covered areas for ninety
 * minutes is a visitor duration. They are different measurements, taken at
 * different places, and neither converts into the other.
 *
 * THE INVARIANT, RENDERED RATHER THAN RESTATED
 *
 * `vehicle-semantics.ts` has held the chain — count, visit, dwell, origin — as
 * architecture since before this segment had a component, and no scene had a
 * reason to show it. This one does: it is the scene where the units are most
 * likely to be collapsed into each other. The strip below is built from that
 * typed content, so the page cannot drift from the model.
 *
 * COVERAGE
 *
 * Time outside covered areas is unknown, not zero. A short reading may mean a
 * short visit or a visit that spent its time somewhere uncovered, and the scene
 * must not let the first reading stand for both.
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
import { vehicleEvidenceSemantics } from "../content/vehicle-semantics";
import type { LensId } from "../lib/types";
import { SceneLensRail, lensesToRoles } from "./SceneLensRail";

const SEGMENT: SegmentId = "retail-park";
const SCENE: SceneId = "retail-park-time-on-site";

interface RetailParkTimeOnSiteSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * The five units that must not collapse into one another, in the order the
 * segment builds them up. Four come from the typed vehicle semantics; the fifth
 * is the people unit they are most often confused with, and it sits between
 * dwell and origin because that is where the confusion actually happens.
 */
const MEASUREMENT_UNITS: readonly string[] = [
  ...vehicleEvidenceSemantics
    .filter((semantic) => semantic.unit !== "registration_origin")
    .map((semantic) => semantic.label),
  "Visitor visit",
  ...vehicleEvidenceSemantics
    .filter((semantic) => semantic.unit === "registration_origin")
    .map((semantic) => semantic.label),
];

const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "duration",
    kicker: "Duration",
    label: "One supported duration event, with its unit named",
    evidenceType: "measured",
  },
  {
    id: "pattern",
    kicker: "Pattern",
    label: "What a length of stay can be read against",
    evidenceType: "connected",
  },
  {
    id: "limit",
    kicker: "Limit",
    label: "What a duration establishes, and what it does not",
    evidenceType: "derived",
  },
];

const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Supported duration events — vehicle or visitor, never both at once",
  insight: "Time-on-site distribution, derived from aligned arrival and departure",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function RetailParkTimeOnSiteScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailParkTimeOnSiteSceneProps) {
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

  const distribution = dependencies.find(
    (entry) => entry.dependencyId === "retail-park-time-on-site-distribution",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture rp-time${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero rp-time__hero">
            <img
              src="/assets/location-visuals/retail-park/retail-park-time-in-centre-hero.png"
              alt="An open-air retail park at sunset. In front of the units, people have stopped: some seated at café tables, others on a bench or standing in conversation, each with soft concentric purple rings spreading on the paving beneath them. Surface parking runs along the left. A café A-board carries its own painted wording. No ring, seat or unit is labelled with a clock or a figure, and no face is marked."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Time on site
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* Coverage first, because a short reading and a short visit are not
                the same thing, and that is the easiest error to make here. */}
            <p className="rp-time__truth-line">
              Time on site is elapsed time inside configured coverage, and the unit is always
              named. Time spent outside coverage is unknown rather than zero. A duration is
              not an identity, a guaranteed count of unique visitors, a purchase, or a reason
              anyone stayed.
            </p>
          </header>
        </section>

        <div className="rp-time__clusters" role="group" aria-label="Time on site reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="rp-time__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="rp-time__reading">{cluster.label}</strong>
              <p className="rp-time__note">{cluster.note}</p>
            </div>
          ))}
        </div>

        {/* The five units, from the typed vehicle semantics. Rendered here and
            nowhere else in the segment: this is the scene where they are most
            likely to be read as one measurement. */}
        <p className="rp-time__units">
          <span className="rp-time__units-kicker">Five different measurements</span>
          {MEASUREMENT_UNITS.map((label, index) => (
            <span key={label}>
              {index > 0 && <span aria-hidden="true"> · </span>}
              {label}
            </span>
          ))}
        </p>

        <p className="capture__definition">
          {period ? (
            <>
              Illustrative demo data <span aria-hidden="true">·</span> {period.period}{" "}
              <span aria-hidden="true">·</span> {period.areaDefinition}
            </>
          ) : (
            <>
              Illustrative duration reading <span aria-hidden="true">·</span> one named
              duration unit inside configured coverage, never a people number taken from a
              vehicle
              {distribution && !distribution.available && distribution.missingInputIds.length > 0 && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {distribution.output.toLowerCase()} needs{" "}
                  {distribution.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          <div className="rp-time__decision-group">
            <p className="rp-time__decision">{scene.supportingLine}</p>
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
