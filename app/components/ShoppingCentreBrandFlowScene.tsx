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
const SCENE: SceneId = "shopping-centre-brand-flow";

interface ShoppingCentreBrandFlowSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three concepts, in the order this scene's argument actually runs: the matched
 * sequence itself, the maps that give each end of it a name, and the limit of
 * what an order of visits may be read as.
 *
 * This is the fourth Understand step and the first scene in the segment that
 * depends on anonymous visit matching. The steps behind it each own a different
 * object and this one must not restate any of them. Internal circulation owns
 * movement across the floor as a whole. Zone & anchor exposure owns defined
 * areas and observed presence in and around them. Brand counting owns one
 * shopfront boundary and the entry registered as it is crossed. This step owns
 * the LINK between two specific tenants — which was visited after which. One
 * entry is not a sequence, and this scene is the only one allowed to speak
 * about the pair.
 *
 * Each concept borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 *
 * The truth burden here is heavier than in any previous Shopping Centre scene,
 * and three boundaries are load-bearing:
 *
 * 1. Matching is ANONYMOUS. Nothing in this component may imply that a person
 *    is recognised, identified, re-identified, profiled, tracked, followed or
 *    carried between two units by a device. The typed measured entry says
 *    "anonymous matched visits or transitions" and that is the ceiling.
 * 2. Matching is valid only BETWEEN COVERED BRANDS. A pair where one end is not
 *    covered produces no sequence at all — and that absence is not evidence
 *    that nobody moved between them. Stated in the main copy, not only in the
 *    lens rail, because the rail's supporting notes are hidden below 1200px by
 *    a shared rule this scene does not own.
 * 3. Cross-visitation is NOT affinity, preference or influence. An order of
 *    visits is an observation of order, never a relationship of cause: nothing
 *    here says or implies that visiting one brand drives, leads to or predicts
 *    visiting another, and nothing explains why a sequence occurs.
 *
 * The scene has no approved demo values, so no sequence count, cross-visitation
 * share, percentage or period figure appears anywhere — and, decisively, no
 * figure is attached to a pair of tenants. The typed decision line supports
 * adjacency and leasing CONVERSATIONS; this scene therefore recommends no
 * co-location, ranks no tenant and claims no adjacency would work. Tenant sales,
 * turnover and conversion are as absent here as in Brand counting.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "sequence",
    kicker: "Sequence",
    label: "Anonymous matched visits between two covered brands",
    evidenceType: "measured",
  },
  {
    id: "meaning",
    kicker: "Meaning",
    label: "The tenant, brand and category maps behind each sequence",
    evidenceType: "connected",
  },
  {
    id: "cross-visitation",
    kicker: "Cross-visitation",
    label: "What an order of visits establishes, and what it does not",
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
 * - Physical is the matched signal: anonymous matched visits observed between
 *   brands that are actually covered by measurement. The note keeps "anonymous"
 *   and "covered" together, because this is the one scene where dropping either
 *   word would change the claim.
 * - Business is REQUIRED and it is emphatically not POS, tenant turnover or
 *   transaction data. `brand_mapping` is a business-role input because the
 *   tenant directory, the brand names and the category definitions are
 *   customer-supplied definitions; without them a matched sequence connects two
 *   nameless areas. The note names those definitions and nothing else, so the
 *   required Business lens is never read as a sales requirement.
 * - Insight is the derived layer: cross-visitation and common sequences,
 *   computed from the two named source layers and shown only when both are
 *   aligned.
 *
 * Mobile & geo is not declared by this scene at all — neither required, nor
 * optional, nor behind any evidence input — so the rail correctly renders it as
 * "No compatible input enabled". That is the honest state and it is not
 * overridden here. Aggregate area context describes a population around the
 * centre; it does not match one covered brand to another inside it.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Anonymous matched visits observed between covered brands",
  business: "Tenant and brand maps and the category definitions they carry",
  insight: "Cross-visitation and common sequences, derived from the named inputs",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "understand" -> "Understand". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ShoppingCentreBrandFlowScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: ShoppingCentreBrandFlowSceneProps) {
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
  // genuinely types itself as a branch of Catchment; Time in centre is the next
  // Core step and the parking scenes are branches of their own parents, so
  // nothing is wired here by hand to pretend otherwise. Asserted in the scene's
  // tests so this stays a fact about typed content rather than an omission in
  // this file.

  const sequences = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-brand-flow-sequences",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture sc-brandflow${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero sc-brandflow__hero">
            <img
              src="/assets/location-visuals/shopping-centre/shopping-centre-visitor-brand-flow-hero.png"
              alt="A warm, brightly lit shopping-centre gallery seen at storefront level. A pink-lit beauty and handbag unit stands on the left, a large chandelier-lit flagship behind full-height glass in the centre, and a dark-marble accessories unit on the right. Dotted purple lines curve across the polished floor from one shopfront to another, carrying small directional marks along their length, and several of the anonymous shoppers at either end stand on soft purple rings. No line, ring or unit carries a label, a count or a figure, and no face is framed or marked."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {/* The stage word is derived from the typed journeyStage; the
                  descriptor beside it deliberately does NOT repeat Brand
                  counting's "Brands". Both scenes are Understand steps about
                  tenants, and reusing the descriptor would give two consecutive
                  scenes an identical eyebrow. This one names the relation
                  between two units rather than the units themselves, which is
                  the only thing that separates the two steps. */}
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Between brands
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The scene's two hardest boundaries, stated in the main copy
                rather than only in the lens rail. The rail's supporting notes
                are hidden below 1200px by a shared rule this scene does not own,
                so both have to survive here at 1024x768: matching is anonymous
                and produces an order and nothing else, and matching holds only
                between brands that are covered — which is not automatically
                every tenant. The third boundary, that an order of visits does
                not establish a relationship between two brands, is carried by
                the typed derived callout and the typed decision line, both of
                which also render at every supported viewport. */}
            <p className="sc-brandflow__truth-line">
              A sequence here is an anonymous matched visit between two covered brands — a
              record of which was visited after which, and nothing more. Matching works
              only where both brands are covered, which is not automatically every tenant
              in the centre.
            </p>
          </header>
        </section>

        {/* Three editorial callouts rising out of the feathered foot of the
            gallery plate, in the order of this scene's argument: the matched
            sequence, the maps that give each end of it a name, and the limit of
            what an order of visits may be read as. The photograph already
            carries both source roles — the dotted line running from one
            shopfront to another is the matched sequence, the rings are the
            anonymous shoppers at either end of it — so this row names the
            concepts and explains each in the scene's own typed words. No values,
            because none are approved, and no pair of tenants is called close,
            complementary or well matched. */}
        <div className="sc-brandflow__clusters" role="group" aria-label="Brand flow reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="sc-brandflow__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="sc-brandflow__reading">{cluster.label}</strong>
              <p className="sc-brandflow__note">{cluster.note}</p>
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
                  sentence, and the one most easily lost in this scene: an
                  uncovered end does not produce a small sequence, it produces
                  none, so a blank pair says nothing about whether anyone moved
                  between them. It sits in the definition line because that line
                  renders at every supported viewport, and it is followed by the
                  runtime's own report of which named inputs the derived reading
                  is still waiting for. */}
              Illustrative sequence reading <span aria-hidden="true">·</span> a sequence
              forms only between two covered brands, so a pair with one uncovered end is
              absent from the reading rather than evidence that nobody moved between them
              {sequences && !sequences.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {sequences.output.toLowerCase()} need{" "}
                  {sequences.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Left of the step forward: what an operator does with a sequence
              reading (the scene's own typed decision line, which frames
              adjacency and leasing as conversations to inform rather than as
              recommendations to act on), and — for the presenter only — the
              proof state of this step. Grouped so the CTA keeps the same
              right-hand anchor it has in every other scene whether or not the
              presenter note is rendered. */}
          <div className="sc-brandflow__decision-group">
            <p className="sc-brandflow__decision">{scene.supportingLine}</p>
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
