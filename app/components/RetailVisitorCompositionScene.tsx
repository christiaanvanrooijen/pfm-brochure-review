"use client";

import { useMemo, useState } from "react";
import type { EvidenceInputId, SceneId, SegmentId } from "../content/types";
import { getOptionalBranchesForScene, getSceneForSegment } from "../content/runtime";
import { evidenceInputs } from "../content/evidence-inputs";
import {
  getSceneDependencyAvailability,
  getSceneEvidenceRuntime,
} from "../content/evidence-runtime";
import { getProofRuntimeForScene } from "../content/proof-runtime";
import type { LensId } from "../lib/types";
import { SceneLensRail, lensesToRoles } from "./SceneLensRail";

const SEGMENT: SegmentId = "retail";
const SCENE: SceneId = "retail-visitor-composition";

interface RetailVisitorCompositionSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three restrained clusters, not six KPI cards. Each cluster names the typed
 * evidence inputs it depends on; whether it can be shown, and what is missing,
 * is answered by the evidence runtime. No classification percentage, count or
 * duration is stated here: this scene has no approved demo values, and an
 * invented plausible number would be a truth-rule breach.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  note: string;
  inputIds: readonly EvidenceInputId[];
  /** Set when the concept is supported by a capability outside this scene. */
  branchOnly?: boolean;
}> = [
  {
    id: "who",
    kicker: "Who",
    label: "Adults and children",
    note:
      "Adults versus children, and estimated age or gender bands — anonymous, estimated, and shown only where that classification is included, permitted and configured.",
    inputIds: ["classification_compatible_events", "enabled_classification"],
  },
  {
    id: "arrival",
    kicker: "How they arrive",
    label: "Groups and individuals",
    note:
      "The buying unit that walks in together, rather than the individual: group size and the split between groups and single visitors.",
    inputIds: ["classification_compatible_events"],
  },
  {
    id: "session",
    kicker: "Deeper journey",
    label: "Duration and repeat",
    note:
      "Needs supported matched events, so it sits in a separate optional step. Visitor-versus-staff separation is a separately configured capability, not part of this scene.",
    inputIds: ["matched_visit_events", "trip_duration_events"],
    branchOnly: true,
  },
];

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "measure" -> "Measure". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function RetailVisitorCompositionScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailVisitorCompositionSceneProps) {
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
  const branches = useMemo(() => getOptionalBranchesForScene(SEGMENT, SCENE), []);
  const branch = branches[0];

  const classification = dependencies.find(
    (entry) => entry.dependencyId === "retail-visitor-composition-classification",
  );

  // Nothing in this scene has approved demo values yet, so every cluster
  // resolves through the runtime rather than through a hard-coded figure.
  const clusters = CLUSTERS.map((cluster) => {
    const available =
      !cluster.branchOnly &&
      classification !== undefined &&
      classification.available &&
      evidenceRuntime.availableEvidence.length > 0;
    return { ...cluster, available };
  });

  const hasExternalProof = proof?.hasExternalProof ?? false;
  const period = evidenceRuntime.periodMetadata;

  return (
    <div className={`capture composition${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          {/* The Northstar threshold, photographed from the street side.
              Deliberately the same production world as the Capture storefront
              before it and the sales floor after it: same camera treatment,
              same feathered left edge dissolving into the page, same store. The
              only measured structure drawn on it is the quiet purple ring under
              each arriving group — an anonymous grouping marker on the ground,
              not a box on a person. No face is framed, outlined or singled out. */}
          <figure className="capture__hero composition__hero">
            <div className="composition__frame">
              <img
                src="/assets/location-visuals/retail/retail-visitor-northstar-hero.png"
                alt="The Northstar storefront at street level: pairs, a lone visitor and a parent with a child walking in from the pavement into the lit interior, each arriving group marked by a soft purple ring on the ground — an anonymous grouping indicator with no face box and no identifying detail"
              />
            </div>
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Visitors
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            <p className="composition__privacy-line">
              Anonymous statistical classification only — no identity, no personal profile and no
              facial recognition.
            </p>
          </header>
        </section>

        {/* Three concepts, read left to right in the order the visit produces
            them. Editorial callouts rising out of the feathered foot of the
            photograph, not a row of KPI cards: no icon discs, no panels, no
            values. The scene has no approved demo values, so each cluster
            states its own availability plainly instead of showing a plausible
            share, band or duration. */}
        <div className="composition__clusters" role="group" aria-label="Visitor composition">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              className={`composition__cluster${cluster.available ? "" : " is-muted"}`}
            >
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="composition__reading">{cluster.label}</strong>
              <span className="composition__state">
                {cluster.available ? "Method available for this scope" : "No illustrative reading in this view"}
              </span>
              <p className="composition__note">{cluster.note}</p>
              <p className="composition__needs">
                <span>To examine</span>
                {cluster.inputIds
                  .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                  .join(" · ")}
              </p>
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
              Illustrative method only <span aria-hidden="true">·</span> no visitor
              composition result is shown{" "}
              {classification && !classification.available && classification.missingInputIds.length > 0
                ? `· A reading needs ${classification.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" and ")}`
                : ""}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Internal proof readiness, not a customer message. "Proof coming
              soon" is a status the presenter needs and a prospect must never
              be shown; it is the same gate Configure and Act already apply to
              their own proof states. */}
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
            <span className="composition__kicker">Optional step</span>
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
        />
      )}
    </div>
  );
}
