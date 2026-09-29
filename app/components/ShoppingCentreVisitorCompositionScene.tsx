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
const SCENE: SceneId = "shopping-centre-visitor-composition";

interface ShoppingCentreVisitorCompositionSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three concepts, in the order a visitor-mix conversation actually runs: who the
 * anonymous mix can describe, how those visitors arrive as a party, and what
 * that mix adds to a number the previous scene already produced.
 *
 * This is the second Measure step and it deliberately keeps the Entrances order
 * — what the entrance can report, what that makes derivable, what context can
 * segment it — because both scenes read the same physical layer. What changes is
 * the subject: Entrances counts crossings, this describes the composition of the
 * people making them. Neither replaces Catchment, which describes the population
 * living around the centre rather than the people observed entering it.
 *
 * Each concept borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 * The scene has no approved demo values, so no share, split, band, group size or
 * party average is stated anywhere — and nothing here is carried over from the
 * Retail Property reference board.
 *
 * The scene types two `measured` entries. The second one — classification
 * enabled, configured and permitted for the selected centre scope — is the one
 * that belongs beside "who", because permission and configuration are what
 * decide which anonymous classifications exist at all. The first one, that the
 * events must come from a classification-compatible implementation, is not
 * dropped: it is the other half of the scene's derived dependency and is named
 * in the definition line below, where the runtime reports both missing inputs by
 * their typed labels.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
  /** Which occurrence of that type, for the two `measured` entries. */
  evidenceIndex?: number;
}> = [
  {
    id: "who",
    kicker: "Who",
    label: "What the anonymous mix is made of",
    evidenceType: "measured",
    evidenceIndex: 1,
  },
  {
    id: "party",
    kicker: "Visiting party",
    label: "Arriving alone, in a pair or in a group",
    evidenceType: "derived",
  },
  {
    id: "why",
    kicker: "Why it matters",
    label: "What a mix adds behind an arrival total",
    evidenceType: "connected",
  },
];

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * Physical and Insight are the scene's REQUIRED roles, so the rail substitutes a
 * supplied note in place of the bare "Awaiting demo evidence". Both lines are
 * written to stay true whether or not demo values ever arrive, because they
 * describe what the layer is for here, never what it holds.
 *
 * Business is declared (through `operational_context`) but only OPTIONAL, and
 * with no demo evidence anywhere in the scene the rail reports "Awaiting demo
 * evidence" for it regardless of any note supplied. A note is therefore
 * deliberately not supplied, exactly as on Entrances: it could never render.
 *
 * Mobile & geo is not declared by this scene at all, so the rail correctly
 * renders it as "No compatible input enabled". That is the honest state and it
 * is not overridden here. Aggregate area context describes who lives around the
 * centre; it is not a weaker way of classifying the people walking through a
 * door, it is a different question, and Catchment already answers it.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Anonymous classification at the entrances, where it is configured and permitted",
  insight: "Visitor mix and visiting-party estimates, derived from the named entrance inputs",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "measure" -> "Measure". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ShoppingCentreVisitorCompositionScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: ShoppingCentreVisitorCompositionSceneProps) {
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
  // genuinely types itself as a branch of Catchment; nothing is wired here by
  // hand to pretend this scene has one. Asserted in the scene's tests so this
  // stays a fact about typed content rather than an omission in this file.

  const classification = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-visitor-composition-classification",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const matches = scene.evidence.filter((entry) => entry.type === cluster.evidenceType);
    const evidence = matches[cluster.evidenceIndex ?? 0];
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture sc-composition${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero sc-composition__hero">
            <img
              src="/assets/location-visuals/shopping-centre/shopping-centre-visitor-composition-hero.png"
              alt="The plaza of a shopping centre at dusk, seen from among the people rather than from the doors — anonymous visitors crossing the paving towards the lit entrances alone, in pairs and in small groups, several of them carrying a soft purple halo that marks them as an anonymous group. No face is framed or outlined and no marker carries a label."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Visitors
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The scene's two truth boundaries, stated in the main copy rather
                than only in the lens rail. The rail's supporting notes are
                hidden below 1200px by a shared rule this scene does not own, so
                the two things a reader must not get wrong — that this is
                anonymous statistical classification, and that it describes the
                people observed entering rather than the population in the
                catchment — are said here, where they survive at 1024x768. */}
            <p className="sc-composition__truth-line">
              Anonymous statistical classification only — no identity and no personal
              profile. It describes who is observed entering the centre, not who lives in
              the catchment around it.
            </p>
          </header>
        </section>

        {/* Three editorial callouts rising out of the feathered foot of the
            plaza plate, in the order the conversation runs: who the mix can
            describe, how a party arrives, what the mix adds to the arrival total
            the previous scene produced. The photograph already carries the
            anonymous grouping; this row names the concepts and explains each in
            the scene's own typed words. No values, because none are approved —
            and no dimension is claimed to be available at every entrance. */}
        <div className="sc-composition__clusters" role="group" aria-label="Visitor composition reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="sc-composition__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="sc-composition__reading">{cluster.label}</strong>
              <p className="sc-composition__note">{cluster.note}</p>
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
              {/* The one distinction the callouts above cannot carry on their
                  own: a visiting party is a group that walks in together, and
                  counting parties is not counting people. It sits in the
                  definition line because that line renders at every viewport. */}
              Illustrative visitor mix <span aria-hidden="true">·</span> a visiting party is
              the group that arrives together, never a count of people
              {classification && !classification.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {classification.output.toLowerCase()}{" "}
                  needs{" "}
                  {classification.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Left of the step forward: what an operator does with a visitor mix
              (the scene's own typed decision line), and — for the presenter only
              — the proof state of this step. Grouped so the CTA keeps the same
              right-hand anchor it has in every other scene whether or not the
              presenter note is rendered. */}
          <div className="sc-composition__decision-group">
            <p className="sc-composition__decision">{scene.supportingLine}</p>
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
