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
const SCENE: SceneId = "shopping-centre-time-in-centre";

interface ShoppingCentreTimeInCentreSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three concepts, in the order this scene's argument runs: how long a presence
 * window lasted, what that pattern may be segmented by, and the limit of what a
 * length of stay establishes.
 *
 * This is the fifth Understand step and the LAST Core step in the segment. The
 * steps behind it each own a different object and this one must restate none of
 * them. Internal circulation owns movement across the floor. Zone & anchor
 * exposure owns defined areas and the presence observed in and around them —
 * including area-level dwell. Brand counting owns one shopfront boundary and the
 * entry registered as it is crossed. Brand flow owns the link between two
 * tenants, which was visited after which. This step owns something none of them
 * touches: the OVERALL LENGTH of a visit to the centre as a whole, from arrival
 * to departure, with no interest in where inside it the time was spent.
 *
 * That distinction is the reason this scene must not become a second dwell
 * scene. The typed `derived` entry contains the word "dwell" and is rendered
 * verbatim, because it is the content model's own sentence; nothing written in
 * this component builds on it, and no area, anchor, route or tenant is named
 * here at all.
 *
 * Each concept borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 *
 * Three boundaries are load-bearing:
 *
 * 1. Matching is ANONYMOUS. TECH-05 is anonymous visit matching. Nothing here
 *    may imply that a person is identified, recognised, re-identified, profiled
 *    or followed through the centre by a device. A presence window has a start
 *    and an end; it has no owner.
 * 2. A visit is measurable only where ONE OF TWO supported forms of matching
 *    covers it — anonymous entrance events matched across supported coverage,
 *    OR a supported continuous journey. Either one alone is enough; neither is
 *    available everywhere. Stated in the main copy rather than only in the lens
 *    rail, because the rail's supporting notes are hidden below 1200px by a
 *    shared rule this scene does not own.
 * 3. A length of stay is NOT a quality of stay. A long visit is not a good
 *    visit and a short visit is not a bad one. Nothing here may imply
 *    enjoyment, satisfaction, engagement, experience quality, loyalty, spend,
 *    sales, conversion, basket or intent, and no duration is ranked, scored,
 *    praised or criticised. Duration is observed; it is never evaluated and it
 *    never explains itself.
 *
 * The scene has no approved demo values, so no minute figure, share, split or
 * period value appears anywhere.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "visit-length",
    kicker: "Visit length",
    label: "How long an anonymous presence window lasted, where it is covered",
    evidenceType: "measured",
  },
  {
    id: "pattern",
    kicker: "Pattern",
    label: "The opening-hours, event and operating context a time pattern can be read against",
    evidenceType: "connected",
  },
  {
    id: "limit",
    kicker: "Limit",
    label: "What a length of stay establishes, and what it does not",
    evidenceType: "derived",
  },
];

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * Physical and Insight are REQUIRED here, so each carries a scene note in place
 * of the bare "Awaiting demo evidence" line, and each is written to stay true
 * whether or not demo values ever arrive — it says what the layer is for here,
 * never what it holds.
 *
 * Business is deliberately absent from this map, and that is the point of the
 * scene's data shape. This is the first Shopping Centre scene where Business is
 * OPTIONAL rather than required: `operational_context` can segment a time
 * pattern by opening hours, events and operating periods, but a length of stay
 * is measured without it. The shared rail reports an optional role with no demo
 * values as "Awaiting demo evidence", which is exactly right and is not
 * overridden here — supplying a note would dress an optional layer up as a
 * contributing one. Nothing in this component forces Business on.
 *
 * Mobile & geo is not declared by this scene at all — neither required, nor
 * optional, nor behind any evidence input — so the rail correctly renders it as
 * "No compatible input enabled". Aggregate area context describes a population
 * around the centre; it does not observe when one visit began and ended inside
 * it.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Anonymous presence windows, observed where matching is supported",
  insight: "Visit-length distributions, derived from the named inputs",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "understand" -> "Understand". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ShoppingCentreTimeInCentreScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: ShoppingCentreTimeInCentreSceneProps) {
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
  // there is nothing to offer. Asserted in the scene's tests so this stays a
  // fact about typed content rather than an omission in this file.

  const distributionDependency = scene.derivedDependencies.find(
    (entry) => entry.id === "shopping-centre-time-in-centre-distribution",
  );
  const distribution = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-time-in-centre-distribution",
  );

  /**
   * The scene's dependency is the segment's first EITHER/OR one: it types no
   * required inputs at all and two alternative groups of one input each, so it
   * resolves as soon as one of them is satisfied.
   *
   * `missingInputIds` is therefore empty here — it is derived from
   * `requiredInputIds`, which is empty by design — and naming it would print an
   * empty list. The unavailable state is instead described from the alternative
   * groups themselves, joined with "or", so the sentence on screen says what
   * the model actually says: one of these is enough.
   */
  const alternativeLabels = (distributionDependency?.alternativeInputGroups ?? []).map((group) =>
    group.map((inputId) => inputLabelById.get(inputId) ?? inputId).join(" and "),
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture sc-time${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero sc-time__hero">
            <img
              src="/assets/location-visuals/shopping-centre/shopping-centre-time-in-centre-hero.png"
              alt="A calm, skylit shopping-centre atrium with a pale stone floor and a tall planted tree. To the right, a seating lounge: people settled in armchairs around a low table, someone resting on the planter bench, and others standing at a café counter, each with soft concentric purple rings spreading on the floor beneath them. Upper-level shopfronts line the balcony above. No ring, seat or shopfront carries a label, a clock or a figure, and no face is framed or marked."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {/* The stage word is derived from the typed journeyStage. Four
                  Understand steps already sit ahead of this one and each has
                  taken its own descriptor — Circulation, Zones, Brands, Between
                  brands — all of which name a PLACE or a RELATION. This scene
                  owns neither: it owns how long the visit lasted, so the
                  descriptor names duration and nothing else. */}
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Time in centre
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The scene's two hardest boundaries, in the main copy rather than
                only in the lens rail — the rail's supporting notes are hidden
                below 1200px by a shared rule this scene does not own, so both
                have to survive at 1024x768. First, a presence window is
                anonymous and has a start and an end and no owner. Second, a
                visit is measurable only where ONE of two supported forms of
                matching covers it — either alone is enough, and neither is
                available everywhere. The third boundary, that a length of stay
                is not a quality of stay, is carried by the typed derived
                callout and the typed decision line, both of which also render
                at every supported viewport. */}
            <p className="sc-time__truth-line">
              Time in centre is the length of an anonymous presence window — when a visit
              began and when it ended, never who it belonged to and never what happened
              inside it. It can be read only where anonymous entrance events are matched
              across supported coverage, or where a continuous anonymous journey is
              supported; either one alone is enough, and neither covers every visit.
            </p>
          </header>
        </section>

        {/* Three editorial callouts rising out of the feathered foot of the
            atrium plate, in the order of this scene's argument: the observed
            length, the operating context a pattern may be read against, and the
            limit of what a length of stay establishes. The photograph already
            carries the measured object — the concentric rings spreading beneath
            people who are seated and standing still read as elapsed presence
            rather than as movement — so this row names the concepts and
            explains each in the scene's own typed words. No values, because
            none are approved, and no visit length is called long, short, good
            or poor. */}
        <div className="sc-time__clusters" role="group" aria-label="Time in centre reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="sc-time__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="sc-time__reading">{cluster.label}</strong>
              <p className="sc-time__note">{cluster.note}</p>
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
              {/* The consequence of the coverage rule, said once as a single
                  sentence, and the one most easily lost here: a visit that
                  neither supported form of matching covers is absent from the
                  reading altogether — it is not recorded as a short one. It
                  sits in the definition line because that line renders at every
                  supported viewport, and it is followed by the runtime's own
                  report of what the derived reading is waiting for, phrased as
                  the either/or the content model actually types. */}
              Illustrative visit-length reading <span aria-hidden="true">·</span> a length of
              stay exists only where one of the two supported forms of matching covers the
              visit, so an uncovered visit is absent from the reading rather than recorded
              as a short one
              {distribution && !distribution.available && alternativeLabels.length > 0 && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {distribution.output.toLowerCase()} needs
                  either {alternativeLabels.join(" or ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Left of the step forward: what an operator does with a visit-length
              reading (the scene's own typed decision line), and — for the
              presenter only — the proof state of this step. Grouped so the CTA
              keeps the same right-hand anchor it has in every other scene
              whether or not the presenter note is rendered. */}
          <div className="sc-time__decision-group">
            <p className="sc-time__decision">{scene.supportingLine}</p>
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
          {/* The last Core step in the segment, and the only Shopping Centre
              scene that types NO `nextSceneId`: the Core route ends here and the
              typed `nextCta` hands over to Configure, which is a stage rather
              than a scene this component may name.

              So the step forward stays exactly the control every other scene
              renders — the typed CTA label, calling the `onNextScene` callback
              the shell owns. Nothing in this file reads `scene.nextSceneId`, no
              next-scene id is written in by hand, and no link is rendered to a
              target that does not exist. A scene the route does not continue
              past is a fact about the typed content, not a dead end to invent a
              destination for. */}
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
