"use client";

import { Fragment, useMemo } from "react";
import type { EvidenceDefinition, SceneId, SegmentId } from "../content/types";
import { getSceneForSegment } from "../content/runtime";
import {
  getEvidenceAvailability,
  getSceneEvidenceRuntime,
} from "../content/evidence-runtime";
import { getProofRuntimeForScene } from "../content/proof-runtime";
import type { LensId } from "../lib/types";
import { SceneLensRail, lensesToRoles } from "./SceneLensRail";

const SEGMENT: SegmentId = "retail";
const SCENE: SceneId = "retail-store-visits";

interface RetailMeasureSceneProps {
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  onNextScene: () => void;
  presentationMode?: boolean;
}

/**
 * Story presentation for the three canonical Capture values. Values, roles and
 * availability all come from the evidence runtime; only the icon, the short
 * label and the one-line explanation live here.
 */
const STORY_STEPS: ReadonlyArray<{
  evidenceId: string;
  label: string;
  note: string;
  icon: "walking" | "entering" | "percent";
}> = [
  {
    evidenceId: "ev-retail-passing-audience",
    label: "passing opportunity",
    note: "People who passed within the defined entrance opportunity area.",
    icon: "walking",
  },
  {
    evidenceId: "ev-retail-store-visits",
    label: "store visits",
    note: "People who entered the store.",
    icon: "entering",
  },
  {
    evidenceId: "ev-retail-capture-rate",
    label: "captured",
    note: "Share of aligned passing opportunity that became a visit.",
    icon: "percent",
  },
];

function StepIcon({ name }: { name: "walking" | "entering" | "percent" }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "walking") {
    return (
      <svg {...common}>
        <circle cx="13" cy="4.5" r="1.6" />
        <path d="M11 21l2-5-2.5-2.5.8-4.5 3.2 2 2.5.8" />
        <path d="M8.6 12.2L11.3 9l2-.4" />
        <path d="M13 16l3 5" />
      </svg>
    );
  }
  if (name === "entering") {
    return (
      <svg {...common}>
        <path d="M14 3.5H6.5v17H14" />
        <path d="M17.5 12H9.5" />
        <path d="M14 8.5l3.5 3.5-3.5 3.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="7.5" cy="7.5" r="2.6" />
      <circle cx="16.5" cy="16.5" r="2.6" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

/**
 * Display formatting only. Derived rates are stored as numbers by the evidence
 * runtime; the Capture story presents a rate with one decimal so the
 * progression reads consistently (4,250 → 681 → 16.0%).
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

export function RetailMeasureScene({
  activeLenses,
  onToggleLens,
  onNextScene,
  presentationMode = false,
}: RetailMeasureSceneProps) {
  const scene = useMemo(() => getSceneForSegment(SEGMENT, SCENE), []);

  const activeRoles = useMemo(() => lensesToRoles(activeLenses), [activeLenses]);

  const evidenceRuntime = useMemo(
    () => getSceneEvidenceRuntime(SEGMENT, SCENE, activeRoles),
    [activeRoles],
  );

  const proof = useMemo(() => getProofRuntimeForScene(SEGMENT, SCENE), []);

  const steps = STORY_STEPS.map((step) => {
    const evidence = evidenceRuntime.evidence.find((item) => item.id === step.evidenceId);
    const availability = evidence
      ? getEvidenceAvailability(evidence.id, activeRoles)
      : { available: false as const };
    return { ...step, evidence, available: Boolean(evidence) && availability.available };
  });

  const period = evidenceRuntime.periodMetadata;
  const hasExternalProof = proof?.hasExternalProof ?? false;

  return (
    <div className={`capture${presentationMode ? " capture--presenting" : ""}`}>
      <div className="capture__story">
        <section className="capture__scene">
          <figure className="capture__hero">
            <img
              src="/assets/location-visuals/retail/retail-capture-storefront-hero-v2.png"
              alt="Passing movement on the street curving through the storefront entrance and into the store"
            />
          </figure>
          <header className="capture__intro">
            <p className="capture__eyebrow">
              Measure <span aria-hidden="true">·</span> Entrance
            </p>
            <h1 className="capture__question">{scene.commercialQuestion}</h1>
          </header>
        </section>

        <div className="capture__progression" role="group" aria-label="Capture progression">
          {steps.map((step, index) => (
            <Fragment key={step.evidenceId}>
              {index > 0 && (
                <span className="capture__arrow" aria-hidden="true">
                  <svg width="34" height="10" viewBox="0 0 34 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M0 5h31" />
                    <path d="M27.5 1.5L31 5l-3.5 3.5" />
                  </svg>
                </span>
              )}
              <div className={`capture__step${step.available ? "" : " is-muted"}`}>
                <div className="capture__figure">
                  <span className="capture__mark" aria-hidden="true">
                    <StepIcon name={step.icon} />
                  </span>
                  <div className="capture__reading">
                    <strong>{step.available && step.evidence ? formatEvidence(step.evidence) : "—"}</strong>
                    <span>{step.label}</span>
                  </div>
                </div>
                <p className="capture__note">
                  {step.available
                    ? step.note
                    : "Not shown — the source layer for this value is switched off."}
                </p>
              </div>
            </Fragment>
          ))}
        </div>

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
        />
      )}
    </div>
  );
}
