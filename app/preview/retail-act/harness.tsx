"use client";

import { useState } from "react";
import { RetailActScene } from "../../components/RetailActScene";
import { getCanonicalJourneyStages } from "../../content/runtime";

const STAGE_LABELS: Record<string, { label: string; descriptor: string }> = {
  context: { label: "Context", descriptor: "Outside" },
  measure: { label: "Measure", descriptor: "Entrance" },
  understand: { label: "Understand", descriptor: "Inside" },
  prove: { label: "Prove", descriptor: "Performance" },
  configure: { label: "Configure", descriptor: "Solution" },
  act: { label: "Act", descriptor: "Next step" },
};

export function RetailActHarness({ initialPresentationMode }: { initialPresentationMode: boolean }) {
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
            Retail · Act
          </span>
        </nav>
        <div className="ce-account">
          <span className="ce-account__name">Northstar Retail Group</span>
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
            return (
              <button
                type="button"
                key={stageId}
                className={`ce-journey__step${current ? " is-current" : ""}`}
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
          <RetailActScene
            clientName={presentationMode ? null : "Northstar Retail Group"}
            locationCount={24}
            presentationMode={presentationMode}
          />
        </div>
      </div>
    </main>
  );
}
