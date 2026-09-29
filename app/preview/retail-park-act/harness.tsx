"use client";

import { useState } from "react";
import { RetailParkActScene } from "../../components/RetailParkActScene";
import { getCanonicalJourneyStages } from "../../content/runtime";

/**
 * The same rail vocabulary the seven approved Retail Park scene harnesses use.
 * Prove stays visible but inert: `stageMapping.prove` is empty for this
 * segment, so there is nothing to stand in. Act is now the current stage.
 */
const STAGE_LABELS: Record<string, { label: string; descriptor: string }> = {
  context: { label: "Context", descriptor: "Outside" },
  measure: { label: "Measure", descriptor: "Units" },
  understand: { label: "Understand", descriptor: "Exposure" },
  prove: { label: "Prove", descriptor: "Evidence" },
  configure: { label: "Configure", descriptor: "Solution" },
  act: { label: "Act", descriptor: "Next step" },
};

export function RetailParkActHarness({
  initialPresentationMode,
}: {
  initialPresentationMode: boolean;
}) {
  const [presentationMode, setPresentationMode] = useState(initialPresentationMode);
  const stages = getCanonicalJourneyStages();

  return (
    <main className={`ce-shell${presentationMode ? " ce-shell--presenting" : ""}`}>
      <header className="ce-topbar">
        <div className="ce-identity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ce-identity__logo"
            src="/assets/logo/pfm-logo-black.png"
            alt="PFM"
            width={54}
            height={16}
          />
          <span className="ce-identity__text">Commercial Experience</span>
        </div>
        <nav className="ce-segments" aria-label="Segment">
          <span className="ce-segment is-pending" aria-disabled="true">
            Retail Park · Act
          </span>
        </nav>
        <div className="ce-account">
          <span className="ce-account__name">Retail Park exploration</span>
          <button
            type="button"
            className={`ce-mode${presentationMode ? " is-active" : ""}`}
            aria-pressed={presentationMode}
            onClick={() => setPresentationMode((mode) => !mode)}
          >
            {presentationMode ? "Exit presentation" : "Presentation mode"}
          </button>
        </div>
      </header>

      <div className="ce-body">
        <nav className="ce-journey" aria-label="Location journey">
          {stages.map((stageId) => {
            const item = STAGE_LABELS[stageId];
            const current = stageId === "act";
            const inert = stageId === "prove";
            return (
              <button
                type="button"
                key={stageId}
                className={`ce-journey__step${current ? " is-current" : ""}${
                  inert ? " is-inert" : ""
                }`}
                aria-current={current ? "step" : undefined}
                aria-disabled={inert || undefined}
              >
                <span className="ce-journey__mark" aria-hidden="true" />
                <span className="ce-journey__text">
                  <strong>{item.label}</strong>
                  <small>{item.descriptor}</small>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="ce-stage">
          <RetailParkActScene presentationMode={presentationMode} />
        </div>
      </div>
    </main>
  );
}
