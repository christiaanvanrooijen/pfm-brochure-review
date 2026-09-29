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
const SCENE: SceneId = "shopping-centre-brand-counting";

interface ShoppingCentreBrandCountingSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation grouping only.
 *
 * Three concepts, in the order this scene's argument actually runs: the entry
 * event itself, the identity that entry is given, and the limit of what the
 * resulting share may be read as.
 *
 * This is the third Understand step and the first one that narrows from the
 * centre to the individual tenant. The three steps behind it each own a
 * different object and this one must not restate any of them. Entrances counts
 * crossings at the centre's own doors. Internal circulation owns routes and the
 * way movement passes between floors and zones. Zone & anchor exposure owns
 * defined areas — a configured zone, a destination anchor — and observed
 * presence in and around them. This step owns the shopfront: the boundary of
 * one named unit, and an entry registered as it is crossed. Presence near a
 * unit was the previous step's reading; crossing into it is this one's, and the
 * two are never merged.
 *
 * Each concept borrows its explanation verbatim from the scene's own typed
 * `evidence` entry, so the words on screen stay tied to the typed truth model.
 *
 * The scene has no approved demo values, so no visit count, visit share,
 * percentage, index or period figure appears anywhere — and, decisively, no
 * figure of any kind is attached to a brand. The shopfront names in the
 * photograph are fictional set dressing that make "which unit" legible without
 * naming a real tenant; this component never repeats them, never presents them
 * as customers, and never puts a number beside one.
 *
 * The typed derived entry draws the boundary this scene exists inside: brand
 * visits, visit share and period patterns do not establish tenant sales or
 * conversion. Visitation to a unit is the whole claim. Nothing here ranks the
 * units, calls one of them stronger, or explains why one is busier — that would
 * be a commercial verdict the measurement cannot support.
 */
const CLUSTERS: ReadonlyArray<{
  id: string;
  kicker: string;
  label: string;
  /** Which of the scene's typed evidence entries supplies this cluster's explanation. */
  evidenceType: SceneEvidenceDefinition["type"];
}> = [
  {
    id: "visits",
    kicker: "Brand visits",
    label: "Entries counted at the threshold of a covered store",
    evidenceType: "measured",
  },
  {
    id: "identity",
    kicker: "Identity",
    label: "The tenant directory and boundaries behind each entry",
    evidenceType: "connected",
  },
  {
    id: "share",
    kicker: "Visit share",
    label: "What visit share describes, and what it stops short of",
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
 * - Physical is the entry signal: events registered at store boundaries that
 *   are actually covered by measurement.
 * - Business is REQUIRED and it is emphatically not POS, tenant turnover or
 *   transaction data. `brand_mapping` is a business-role input because the
 *   tenant directory, the brand names and the unit boundaries are
 *   customer-supplied definitions; without them an entry event belongs to no
 *   particular unit. The note names those definitions and nothing else, so the
 *   required Business lens is never read as a sales requirement — which matters
 *   more in this scene than in any other, because it is the one scene a reader
 *   is most tempted to hear as a tenant-performance story.
 * - Insight is the derived layer: brand visits and visit share, computed from
 *   the two named source layers and shown only when both are aligned.
 *
 * Mobile & geo is not declared by this scene at all — neither required, nor
 * optional, nor behind any evidence input — so the rail correctly renders it as
 * "No compatible input enabled". That is the honest state and it is not
 * overridden here. Aggregate area context describes a population around the
 * centre; it does not register an entry at one tenant's shopfront.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Entry events registered at covered store boundaries",
  business: "Tenant and brand directories and the unit boundaries they define",
  insight: "Brand visits and visit share, derived from the named inputs",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "understand" -> "Understand". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ShoppingCentreBrandCountingScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: ShoppingCentreBrandCountingSceneProps) {
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
  // genuinely types itself as a branch of Catchment; Brand flow is the next Core
  // step and the parking scenes are branches of their own parents, so nothing is
  // wired here by hand to pretend otherwise. Asserted in the scene's tests so
  // this stays a fact about typed content rather than an omission in this file.

  const brandVisits = dependencies.find(
    (entry) => entry.dependencyId === "shopping-centre-brand-visits",
  );

  const clusters = CLUSTERS.map((cluster) => {
    const evidence = scene.evidence.find((entry) => entry.type === cluster.evidenceType);
    return { ...cluster, note: evidence?.description ?? "" };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture sc-brands${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero sc-brands__hero">
            <img
              src="/assets/location-visuals/shopping-centre/shopping-centre-brand-counting-hero.png"
              alt="A warm, brightly lit shopping-centre gallery seen at storefront level. Three adjacent tenant units stand side by side behind fictional shopfront names — a beauty unit on the left, a large open-fronted flagship in the centre with its interior visible, and an accessories unit on the right. A bright purple line lies across the floor at each shopfront entrance, and some of the anonymous shoppers crossing or standing at those lines rest on small purple rings. No line, ring or unit carries a label, a count or a figure, and no face is framed or marked."
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Brands
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
            {/* The scene's coverage boundary, stated in the main copy rather than
                only in the lens rail. The rail's supporting notes are hidden
                below 1200px by a shared rule this scene does not own, so the two
                caveats carried by the typed evidence have to survive here at
                1024x768: an entry is only counted where the store boundary is
                actually covered — which is not automatically every tenant in the
                centre — and a brand name on an entry comes from the centre's own
                directory rather than from anything inferred. The third boundary,
                that visitation is not tenant performance, is carried by the
                typed derived callout and the typed decision line, both of which
                also render at every supported viewport. */}
            <p className="sc-brands__truth-line">
              A brand visit is an entry registered at a covered store boundary — counted
              only where a boundary is covered, which is not automatically every tenant.
              Each entry takes its brand identity from the centre&rsquo;s own tenant
              directory.
            </p>
          </header>
        </section>

        {/* Three editorial callouts rising out of the feathered foot of the
            gallery plate, in the order of this scene's argument: the entry
            event, the identity that entry is given, and the limit of what the
            resulting share may be read as. The photograph already carries both
            source roles — the purple line across each shopfront entrance is the
            covered boundary, the rings are the people crossing it — so this row
            names the concepts and explains each in the scene's own typed words.
            No values, because none are approved, and no unit is called busy,
            quiet, strong or successful. */}
        <div className="sc-brands__clusters" role="group" aria-label="Brand counting reading">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="sc-brands__cluster">
              <span className="composition__kicker">{cluster.kicker}</span>
              <strong className="sc-brands__reading">{cluster.label}</strong>
              <p className="sc-brands__note">{cluster.note}</p>
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
              {/* The consequence the callouts state one at a time, said once as a
                  single sentence, and the one most easily lost: coverage is a
                  property of the measurement design, so an uncovered unit is
                  absent from the reading rather than quiet in it. It sits in the
                  definition line because that line renders at every supported
                  viewport, and it is followed by the runtime's own report of
                  which named inputs the derived reading is still waiting for. */}
              Illustrative brand reading <span aria-hidden="true">·</span> an entry is
              registered when a covered store boundary is crossed, so a unit without a
              covered boundary is absent from the reading rather than quiet in it
              {brandVisits && !brandVisits.available && (
                <>
                  {" "}
                  <span aria-hidden="true">·</span> {brandVisits.output.toLowerCase()} need{" "}
                  {brandVisits.missingInputIds
                    .map((inputId) => inputLabelById.get(inputId) ?? inputId)
                    .join(" · ")}
                </>
              )}
            </>
          )}
        </p>

        <div className="capture__decision">
          {/* Left of the step forward: what an operator does with a brand
              reading (the scene's own typed decision line, which is also where
              the no-tenant-sales boundary is stated in the scene's own typed
              words), and — for the presenter only — the proof state of this
              step. Grouped so the CTA keeps the same right-hand anchor it has in
              every other scene whether or not the presenter note is rendered. */}
          <div className="sc-brands__decision-group">
            <p className="sc-brands__decision">{scene.supportingLine}</p>
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
