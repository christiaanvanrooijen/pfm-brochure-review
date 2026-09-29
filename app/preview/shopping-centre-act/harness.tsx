"use client";

import { useState } from "react";
import { ShoppingCentreActScene } from "../../components/ShoppingCentreActScene";
import { getCanonicalJourneyStages } from "../../content/runtime";

const STAGE_LABELS: Record<string, { label: string; descriptor: string }> = {
  context: { label: "Context", descriptor: "Outside" },
  measure: { label: "Measure", descriptor: "Entrance" },
  understand: { label: "Understand", descriptor: "Centre" },
  prove: { label: "Prove", descriptor: "Evidence" },
  configure: { label: "Configure", descriptor: "Solution" },
  act: { label: "Act", descriptor: "Next step" },
};

export function ShoppingCentreActHarness({
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
            Shopping Centre · Act
          </span>
        </nav>
        <div className="ce-account">
          <span className="ce-account__name">Shopping Centre exploration</span>
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
                className={`ce-journey__step${current ? " is-current" : ""}${inert ? " is-inert" : ""}`}
                aria-current={current ? "step" : undefined}
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
          <ShoppingCentreActScene
            assetName={presentationMode ? null : "Selected shopping centre"}
            presentationMode={presentationMode}
          />
        </div>
      </div>
    </main>
  );
}
