"use client";

/**
 * Development-only preview for the Retail Park Time on site scene.
 *
 * Retail Park is `implementationStatus: "architecture_only"` and the shell does
 * not run it yet, so this is how the first Core scene is rendered and reviewed —
 * the same arrangement the eight Shopping Centre Core scenes used. It returns
 * 404 in a production build, so it cannot become a back door into an unapproved
 * segment.
 */

import { useState } from "react";
import { notFound } from "next/navigation";
import { RetailParkTimeOnSiteScene } from "../../components/RetailParkTimeOnSiteScene";
import { getCanonicalJourneyStages } from "../../content/runtime";
import type { LensId } from "../../lib/types";

const STAGE_LABELS: Record<string, { label: string; descriptor: string }> = {
  context: { label: "Context", descriptor: "Outside" },
  measure: { label: "Measure", descriptor: "Units" },
  understand: { label: "Understand", descriptor: "Time on site" },
  prove: { label: "Prove", descriptor: "Evidence" },
  configure: { label: "Configure", descriptor: "Solution" },
  act: { label: "Act", descriptor: "Next step" },
};

export default function RetailParkTimeOnSitePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [activeLenses, setActiveLenses] = useState<LensId[]>([
    "physical",
    "business",
  ]);
  const [presentationMode, setPresentationMode] = useState(false);
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
            Retail Park · scene preview
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
            const current = stageId === "understand";
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
          <RetailParkTimeOnSiteScene
            activeLenses={activeLenses}
            onToggleLens={(lens) =>
              setActiveLenses((lenses) =>
                lenses.includes(lens)
                  ? lenses.filter((item) => item !== lens)
                  : [...lenses, lens],
              )
            }
            onNextScene={() => {}}
            presentationMode={presentationMode}
          />
        </div>
      </div>
    </main>
  );
}
