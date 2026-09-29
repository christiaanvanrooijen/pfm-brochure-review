"use client";

/**
 * Development-only preview harness for the Shopping Centre Visitor composition
 * scene.
 *
 * Shopping Centre is `implementationStatus: "architecture_only"` and the top-bar
 * segment selector in `CommercialExperience` correctly renders it as a
 * non-navigable, subdued label. That gating is production behaviour and this
 * file does not touch it: a prospect still cannot reach any Shopping Centre
 * scene from the live experience.
 *
 * This route exists so the scene can be rendered and reviewed while it is being
 * built, in the real shell chrome, at the real viewport sizes. It returns 404 in
 * a production build, so it cannot become a back door into an unapproved
 * segment.
 *
 * It is a third route rather than a parameterised harness on purpose. The
 * Catchment and Entrances harnesses are both part of approved reviews, and a
 * shared harness would mean editing them to add this scene; small independent
 * files keep the approved ones untouched, and all three are deleted together
 * when Shopping Centre is wired into `CommercialExperience` for real.
 *
 * The shell markup below is a static, read-only stand-in for the presenter
 * shell — six canonical stages with Measure current — not a second navigation
 * system and not a Shopping Centre journey.
 */

import { useState } from "react";
import { notFound } from "next/navigation";
import { ShoppingCentreVisitorCompositionScene } from "../../components/ShoppingCentreVisitorCompositionScene";
import { getCanonicalJourneyStages } from "../../content/runtime";
import type { LensId } from "../../lib/types";

const STAGE_LABELS: Record<string, { label: string; descriptor: string }> = {
  context: { label: "Context", descriptor: "Outside" },
  measure: { label: "Measure", descriptor: "Entrance" },
  understand: { label: "Understand", descriptor: "Inside" },
  prove: { label: "Prove", descriptor: "Performance" },
  configure: { label: "Configure", descriptor: "Solution" },
  act: { label: "Act", descriptor: "Next step" },
};

export default function ShoppingCentreVisitorCompositionPreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [activeLenses, setActiveLenses] = useState<LensId[]>([
    "physical",
    "mobile-geo",
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
            Shopping Centre · scene preview
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
            const current = stageId === "measure";
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
          <ShoppingCentreVisitorCompositionScene
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
