"use client";

import { Fragment, useMemo, useState } from "react";
import type {
  DataRole,
  EvidenceDefinition,
  SceneId,
  SegmentId,
} from "../content/types";
import { getOptionalBranchesForScene, getSceneForSegment } from "../content/runtime";
import { evidenceInputs } from "../content/evidence-inputs";
import {
  getEvidenceAvailability,
  getSceneEvidenceRuntime,
} from "../content/evidence-runtime";
import { getProofRuntimeForScene } from "../content/proof-runtime";
import type { LensId } from "../lib/types";
import { SceneLensRail, lensesToRoles } from "./SceneLensRail";

const SEGMENT: SegmentId = "retail";
const SCENE: SceneId = "retail-conversion-sales-context";

interface RetailConversionSalesContextSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Presentation-layer display headline.
 *
 * Same mechanism as Zone engagement's `DISPLAY_QUESTION`, and used here for the
 * same reason: the typed `commercialQuestion` in `content/segments/retail.ts`
 * ("Do store visits become transactions?") is unchanged and still describes
 * part of what the scene measures, but it reads as a yes/no, and it starts at
 * store visits — which is precisely the thing this scene exists to correct.
 * The Retail commercial equation does not begin inside the store. This changes
 * the words on screen only — not the scene id, its Core position, its evidence
 * or its meaning.
 */
const DISPLAY_QUESTION = "Where is the commercial opportunity hiding?";

/**
 * Presentation-layer supporting line, same mechanism and same reason.
 *
 * The typed `supportingLine` ("Identify whether opportunity sits in traffic,
 * conversion or transaction value") is unchanged and still names the three
 * places opportunity can sit. What it does not do is state the shape of the
 * equation, which is the one thing the viewer needs before reading the funnel:
 * two halves, one outside the store and one inside it, meeting at store visits.
 */
const DISPLAY_LEAD =
  "See how location opportunity becomes store visits — and how store visits become turnover.";

interface FunnelStep {
  evidenceId: string;
  /** Reading label under the value. */
  label: string;
  /** Factual definition of what the value is. Never a diagnosis. */
  note: string;
  /**
   * Optional quieter sub-line carrying a supporting measurement that is real
   * evidence but is not a stage of the equation. Rendered in place of the
   * generic "from <layer> · <layer>" line, because it says the same thing with
   * the actual numbers in it.
   */
  support?: { valueEvidenceId: string; ofEvidenceId: string; ofLabel: string };
  /**
   * Marks the single value that is the result rather than a lever, for visual
   * emphasis only (the neutral/black value treatment instead of purple).
   *
   * This is a presentation flag, not an evidence-type label: turnover is
   * connected business evidence (see `layerName`), not an "Outcome"-typed
   * value — the typed evidence model reserves "outcome" as a distinct
   * `EvidenceType` for a different concept. No "Outcome" tag is rendered.
   */
  outcome?: boolean;
}

/**
 * PART 1 — LOCATION OPPORTUNITY, outside the store.
 *
 * passers-by × capture rate = store visits.
 *
 * Both terms are physical measurements of the outdoor opportunity area and the
 * entrance; Mobile & geo measures neither of them and is not a dependency of
 * either. The result of this half is the hinge below, not a value of its own.
 */
const LOCATION_STEPS: readonly FunnelStep[] = [
  {
    evidenceId: "ev-retail-passing-audience",
    label: "passers-by",
    note: "The passing opportunity measured outside this store.",
  },
  {
    evidenceId: "ev-retail-capture-rate",
    label: "capture rate",
    note: "The share of that opportunity that crossed the entrance.",
  },
];

/**
 * The hinge.
 *
 * Store visits is the single shared term of the two halves: the result of
 * passers-by × capture rate, and the denominator of conversion. It is rendered
 * once, at the seam, with both halves visibly meeting on it — never as two
 * separate 681s at the end of one row and the start of the next.
 */
const HINGE_STEP: FunnelStep = {
  evidenceId: "ev-retail-store-visits",
  label: "store visits",
  note: "Anonymous entries measured at the entrance threshold.",
};

/**
 * PART 2 — STORE PERFORMANCE, inside the store.
 *
 * store visits × conversion rate × average transaction value = turnover.
 *
 * Transactions (103) is real connected evidence but is not a fifth equal stage:
 * it is carried as the supporting sub-line of Conversion, which is the reading
 * it belongs to.
 */
const STORE_STEPS: readonly FunnelStep[] = [
  {
    evidenceId: "ev-retail-conversion-rate",
    label: "conversion rate",
    note: "The share of measured visits in the connected transaction count.",
    support: {
      valueEvidenceId: "ev-retail-transactions",
      ofEvidenceId: "ev-retail-store-visits",
      ofLabel: "store visits",
    },
  },
  {
    evidenceId: "ev-retail-average-transaction-value",
    label: "average transaction value",
    note: "What one transaction is worth in the connected sales value.",
  },
  {
    evidenceId: "ev-retail-transaction-value",
    label: "turnover",
    note: "Connected sales value for the same store, period and definition.",
    outcome: true,
  },
];

/** The one derived reading carried below the funnel, never as a stage of it. */
const SECONDARY_EVIDENCE_ID = "ev-retail-sales-per-visitor";

/**
 * Scene-specific supporting text for the shared lens rail.
 *
 * Physical now supplies two measurements here, not one: the passing opportunity
 * outside the store and the visits at the entrance. Mobile & geo is named
 * explicitly as context so the rail cannot be read as saying it measures the
 * passers-by on screen — it does not, and the scene opens with it switched off
 * for exactly that reason.
 */
const ROLE_NOTES: Partial<Record<DataRole, string>> = {
  physical: "Passers-by outside and visits at the entrance, both measured",
  business: "Transactions & turnover, from connected systems",
  insight: "Capture, conversion and transaction value, derived from both layers",
  mobile_geo: "Optional catchment context — never measures passers-by or capture",
};

const inputLabelById = new Map<string, string>(
  evidenceInputs.map((input) => [input.id, input.label]),
);

/** "prove" -> "Prove". The eyebrow follows the scene's typed journeyStage. */
function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

/** Short presentation name for an evidence item's source layer. */
function layerName(evidence: EvidenceDefinition): string {
  if (evidence.evidenceType === "measured") return "Measured";
  if (evidence.evidenceType === "connected") return "Connected";
  return "Derived";
}

/**
 * Display formatting only. The runtime stores derived rates as numbers; the
 * Retail progressions present a rate with one decimal so the funnel reads at a
 * consistent precision, exactly as the Capture scene does.
 */
function formatEvidence(evidence: EvidenceDefinition): string {
  if (
    evidence.evidenceType === "derived" &&
    typeof evidence.value === "number" &&
    evidence.unit.includes("rate")
  ) {
    return `${evidence.value.toFixed(1)}%`;
  }
  return evidence.displayValue;
}

export function RetailConversionSalesContextScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailConversionSalesContextSceneProps) {
  const [branchOpen, setBranchOpen] = useState(false);

  const scene = useMemo(() => getSceneForSegment(SEGMENT, SCENE), []);
  const activeRoles = useMemo(() => lensesToRoles(activeLenses), [activeLenses]);

  const evidenceRuntime = useMemo(
    () => getSceneEvidenceRuntime(SEGMENT, SCENE, activeRoles),
    [activeRoles],
  );
  const proof = useMemo(() => getProofRuntimeForScene(SEGMENT, SCENE), []);

  // Portfolio comparison is typed as an Optional branch of this scene. It is
  // offered here as a side step, exactly like Visit duration, Product-category
  // journey and Staff interaction are on their own parents — it is not the
  // primary next step, and this scene's CTA no longer pretends it is.
  const branches = useMemo(() => getOptionalBranchesForScene(SEGMENT, SCENE), []);
  const branch = branches[0];

  /**
   * Which named evidence supplies a derived step, resolved through the demo
   * evidence catalog rather than restated in copy. This is what makes the
   * dependency visible on screen: each derived reading names the layers it is
   * calculated from, and disappears with either of them.
   */
  const sourceLabelsFor = (evidence: EvidenceDefinition): string[] =>
    evidence.dependencyIds.map((inputId) => {
      const base = evidenceRuntime.evidence.find(
        (item) =>
          item.evidenceType !== "derived" &&
          item.dependencyIds.length === 1 &&
          item.dependencyIds[0] === inputId,
      );
      return base?.label ?? inputLabelById.get(inputId) ?? inputId;
    });

  const resolve = (evidenceId: string) => {
    const evidence = evidenceRuntime.evidence.find((item) => item.id === evidenceId);
    const availability = evidence
      ? getEvidenceAvailability(evidence.id, activeRoles)
      : { available: false as const, missingDependencies: undefined };
    return { evidence, available: Boolean(evidence) && availability.available };
  };

  const locationSteps = LOCATION_STEPS.map((step) => ({ ...step, ...resolve(step.evidenceId) }));
  const storeSteps = STORE_STEPS.map((step) => ({ ...step, ...resolve(step.evidenceId) }));
  const hinge = { ...HINGE_STEP, ...resolve(HINGE_STEP.evidenceId) };
  const secondary = resolve(SECONDARY_EVIDENCE_ID);

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  // The scene's own typed derived-evidence sentence, used verbatim as the truth
  // line under the funnel. It states the compatibility condition every
  // calculation on screen depends on and makes no claim about cause.
  const derivedTruth = scene.evidence.find((entry) => entry.type === "derived")?.description;

  /** One stage of the funnel. Identical markup in both halves and at the seam. */
  const renderStep = (
    step: (typeof locationSteps)[number],
    variant?: "hinge",
  ) => {
    const support = step.support
      ? {
          value: resolve(step.support.valueEvidenceId),
          of: resolve(step.support.ofEvidenceId),
          ofLabel: step.support.ofLabel,
        }
      : null;
    const showSupport = Boolean(support?.value.available && support?.of.available);

    return (
      <div
        className={`performance__step${
          step.evidence ? ` performance__step--${step.evidence.evidenceType}` : ""
        }${variant === "hinge" ? " performance__step--hinge" : ""}${
          step.outcome ? " performance__step--outcome" : ""
        }${step.available ? "" : " is-muted"}`}
      >
        <span className="performance__layer">
          {step.evidence ? layerName(step.evidence) : "—"}
        </span>
        <strong className="performance__value">
          {step.available && step.evidence ? formatEvidence(step.evidence) : "—"}
        </strong>
        <span className="performance__label">{step.label}</span>
        {/* Supporting evidence, not a stage: the transaction count that
            conversion is calculated from, stated with its own numbers instead
            of the generic layer names. */}
        {step.available && showSupport && support?.value.evidence && support.of.evidence && (
          <span className="performance__from">
            {support.value.evidence.displayValue}{" "}
            {support.value.evidence.label.toLowerCase()} from{" "}
            {support.of.evidence.displayValue} {support.ofLabel}
          </span>
        )}
        {step.available && !showSupport && step.evidence?.evidenceType === "derived" && (
          <span className="performance__from">
            from {sourceLabelsFor(step.evidence).join(" · ")}
          </span>
        )}
        <p className="performance__note">
          {step.available
            ? step.note
            : "Not shown — a source layer this value depends on is switched off."}
        </p>
      </div>
    );
  };

  const linkArrow = (
    <span className="performance__link" aria-hidden="true">
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 5h19" />
        <path d="M15.5 1.5L19 5l-3.5 3.5" />
      </svg>
    </span>
  );

  return (
    <div
      className={`capture performance${branchOpen ? " performance--branch-open" : ""}${
        presentationMode ? " capture--presenting" : ""
      }`}
    >
      <div className="capture__story">
        <header className="performance__masthead">
          <p className="capture__eyebrow">
            {stageLabel(scene.journeyStage)} <span aria-hidden="true">·</span> Performance
          </p>
          {/* Presentation copy. The typed commercialQuestion is unchanged. */}
          <h1 className="capture__question">{DISPLAY_QUESTION}</h1>
          <p className="performance__lead">{DISPLAY_LEAD}</p>
        </header>

        <div className="performance__band">
          {/* The store the viewer has just walked through, compressed to a
              quiet band of context. The page belongs to the equation now, but
              the physical location is still unmistakably present above it. */}
          <figure className="performance__place">
            <div className="performance__place-frame">
              <img
                src="/assets/location-visuals/retail/retail-instore-northstar-hero.png"
                alt="The Northstar sales floor from the previous scenes, compressed to a quiet band of context above the commercial equation"
              />
            </div>
          </figure>

          <div className="performance__funnel" role="group" aria-label="Commercial equation">
            {/* PART 1 — outside the store. */}
            <section className="performance__part">
              <header className="performance__part-head">
                <span className="performance__part-kicker">Outside the store</span>
                <h2 className="performance__part-title">Location opportunity</h2>
                <p className="performance__part-ask">
                  Is enough opportunity passing — and is enough of it coming in?
                </p>
              </header>
              <div className="performance__steps performance__steps--two">
                {locationSteps.map((step, index) => (
                  <Fragment key={step.evidenceId}>
                    {index > 0 && linkArrow}
                    {renderStep(step)}
                  </Fragment>
                ))}
              </div>
            </section>

            {/* THE HINGE — store visits, stated once.
                The result of the half above and the denominator of the half
                below are the same measurement, so it is drawn once at the seam
                with both halves visibly meeting on it. */}
            <div className="performance__hinge">
              <span className="performance__seam" aria-hidden="true">
                <svg width="12" height="34" viewBox="0 0 12 34" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 0v30" />
                  <path d="M2.5 26.5L6 30l3.5-3.5" />
                </svg>
              </span>
              {renderStep(hinge, "hinge")}
              <p className="performance__hinge-note">
                <span className="performance__hinge-tag">The hand-off</span>
                Where the location stops and the store starts. The same measured
                visits close the half above and open the half below.
              </p>
            </div>

            {/* PART 2 — inside the store. */}
            <section className="performance__part">
              <header className="performance__part-head">
                <span className="performance__part-kicker">Inside the store</span>
                <h2 className="performance__part-title">Store performance</h2>
                <p className="performance__part-ask">
                  Are visits becoming transactions — and what is each transaction worth?
                </p>
              </header>
              <div className="performance__steps performance__steps--three">
                {storeSteps.map((step, index) => (
                  <Fragment key={step.evidenceId}>
                    {index > 0 && linkArrow}
                    {renderStep(step)}
                  </Fragment>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Secondary derived depth, deliberately one line and one size down:
            sales per visitor is store productivity after entry — a different
            concept from capture, and not a stage of the equation. */}
        {secondary.available && secondary.evidence && (
          <p className="performance__secondary">
            <strong>{secondary.evidence.displayValue}</strong>
            <span>{secondary.evidence.label.toLowerCase()}</span>
            <small>from {sourceLabelsFor(secondary.evidence).join(" · ")}</small>
          </p>
        )}

        {derivedTruth && <p className="performance__truth">{derivedTruth}</p>}

        {period && (
          <p className="capture__definition">
            Illustrative demo data <span aria-hidden="true">·</span> {period.period}{" "}
            <span aria-hidden="true">·</span> {period.areaDefinition}
          </p>
        )}

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
              {branchOpen ? "Close location comparison" : "Compare locations"}
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
