"use client";

/**
 * Outlet Centre asset review — one screen per Core scene, in typed order.
 *
 * WHAT THIS IS
 *
 * A review instrument, not a journey. It exists so a human can see each Core
 * scene's candidate image beside the decision taken on it and disagree with
 * something specific. Scene order, questions and capabilities are resolved from
 * the model; every decision, limitation and locus comes from the typed decision
 * module beside it.
 *
 * WHY IT IS ENGLISH ONLY
 *
 * Because writing ten scenes of French and German narrative copy would BE the
 * Outlet journey, which this gate is explicitly not building. The one piece of
 * customer-facing wording this gate does touch — the segment cover caption — is
 * corrected in all three languages, in `starts.ts`, and shown here as such.
 *
 * PRESENTATION
 *
 * The accepted editorial system, reused rather than restyled: white narrative
 * column, dominant image, restrained focus controls, one optional `+`, the dark
 * evidence rail, and the existing technical drawer. The only new styling is the
 * review chrome itself, under its own `rd-rev` prefix.
 */

import { useMemo, useRef, useState } from "react";
import { DepthPanel } from "../../../components/redesign/DepthPanel";
import { getMessages } from "../../../i18n/messages";
import { allScenes, outletCentreSegment } from "../../../content/segments";
import {
  getOutletDecision,
  outletRejectedFiles,
  type AssetDecision,
} from "../../../content/outlet-asset-decisions";
import { getCapabilityExplainerVisuals } from "../../../content/technology-visuals";
import { getUsableProofsForScene } from "../../../content/proof-runtime";
import { startCoverCopy } from "../../../i18n/starts";
import { getSegmentStartVisual } from "../../../content/segment-start-visuals";
import type { SceneCopy } from "../../../i18n/messages";
import type { SceneId } from "../../../content/types";

const SEGMENT = "outlet-centre" as const;

const DECISION_LABEL: Record<AssetDecision, string> = {
  suitable: "Suitable scene illustration",
  cover_only: "Cover only",
  rejected: "Rejected",
  missing: "Missing",
};

/** The route has ten columns; the full label does not fit and does not need to. */
const DECISION_SHORT: Record<AssetDecision, string> = {
  suitable: "Suitable",
  cover_only: "Cover only",
  rejected: "Rejected",
  missing: "Missing",
};

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export function OutletAssetReview({ initialSceneId }: { initialSceneId: string }) {
  const route = outletCentreSegment.coreRoute;
  const [sceneId, setSceneId] = useState<SceneId>(
    (route as readonly string[]).includes(initialSceneId)
      ? (initialSceneId as SceneId)
      : route[0],
  );
  const [pointOpen, setPointOpen] = useState(false);
  const [depthOpen, setDepthOpen] = useState(false);
  const depthRef = useRef<HTMLElement>(null);

  const t = getMessages("en").ui;
  const scene = useMemo(() => allScenes.find((s) => s.id === sceneId)!, [sceneId]);
  const decision = getOutletDecision(sceneId)!;
  const index = route.indexOf(sceneId);

  /* Technical media, resolved by segment AND capability. Outlet has no
     segment-specific explainer for any of its capabilities, so this is empty
     everywhere — which the drawer states rather than filling with another
     segment's artwork. */
  const explainerCount = scene.technologyCapabilityIds.reduce(
    (total, id) => total + getCapabilityExplainerVisuals(id, SEGMENT).length,
    0,
  );
  const usableProofs = getUsableProofsForScene(SEGMENT, sceneId);

  /* The drawer reads only `sequence`, so this is derived from the scene's own
     typed evidence kinds — no prose is invented to satisfy a prop. */
  const depthCopy = {
    sequence: [...new Set(scene.evidence.map((e) => e.type))]
      .filter((kind) => kind !== "decision")
      .map((kind) => ({
        kicker: kind.charAt(0).toUpperCase() + kind.slice(1),
        label: scene.evidence.find((e) => e.type === kind)?.description.slice(0, 96) ?? "",
      })),
  } as unknown as SceneCopy;

  const cover = getSegmentStartVisual(SEGMENT);
  const coverCopy = startCoverCopy.en[SEGMENT];
  const locus = decision.focusLocus;
  const showImage = decision.candidatePath !== null;

  return (
    <div className={`rd rd-rev${depthOpen ? " rd--dimmed" : ""}`}>
      <header className="rd__header">
        <div className="rd__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rd__logo" src="/assets/logo/pfm-logo-black.png" alt="PFM" width={54} height={16} />
          <span className="rd__product">{t.productName}</span>
        </div>
        <p className="rd__where">
          <span>Outlet Centre</span>
          <span aria-hidden="true">/</span>
          <span>Asset review</span>
        </p>
        <div className="rd__header-right">
          <span className="rd__badge">Review preview · English only</span>
        </div>
      </header>

      <nav className="rd-rev__route" aria-label="Outlet Core route">
        <ol>
          {route.map((id, position) => {
            const d = getOutletDecision(id)!;
            return (
              <li key={id}>
                <button
                  type="button"
                  className={`rd-rev__step is-${d.decision}${id === sceneId ? " is-current" : ""}`}
                  aria-current={id === sceneId ? "true" : undefined}
                  onClick={() => {
                    setSceneId(id);
                    setPointOpen(false);
                    setDepthOpen(false);
                  }}
                >
                  <span className="rd-rev__step-index">{String(position + 1).padStart(2, "0")}</span>
                  <span className="rd-rev__step-name">{allScenes.find((s) => s.id === id)!.title}</span>
                  <span className={`rd-rev__chip is-${d.decision}`}>{DECISION_SHORT[d.decision]}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="rd__main">
        <section className="rd__column">
          <p className="rd__eyebrow">
            <span className="rd__eyebrow-rule" aria-hidden="true" />
            {scene.title}
            <span className="rd__eyebrow-pos">
              {String(index + 1).padStart(2, "0")} <span aria-hidden="true">/</span>{" "}
              {String(route.length).padStart(2, "0")}
            </span>
          </p>

          <h1 className="rd__question">{scene.commercialQuestion}</h1>
          <p className="rd__supporting">{scene.supportingLine}</p>

          <p className={`rd-rev__decision is-${decision.decision}`}>
            <strong>{DECISION_LABEL[decision.decision]}</strong>
            {decision.candidatePath && (
              <span className="rd-rev__path">{decision.candidatePath.split("/").pop()}</span>
            )}
            {decision.role && <span className="rd-rev__role">{decision.role.replace(/_/g, " ")}</span>}
          </p>

          <dl className="rd-rev__notes">
            <dt>Depicts</dt>
            <dd>{decision.depicts}</dd>
            <dt>Supports</dt>
            <dd>{decision.supports}</dd>
            <dt>Limitations</dt>
            <dd>
              <ul>
                {decision.limitations.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </dd>
            {decision.blockedOn && (
              <>
                <dt>Blocked on</dt>
                <dd className="rd-rev__blocked">{decision.blockedOn}</dd>
              </>
            )}
            {decision.alternatives.length > 0 && (
              <>
                <dt>Alternatives considered</dt>
                <dd>
                  <ul>
                    {decision.alternatives.map((alt) => (
                      <li key={alt.path}>
                        <code>{alt.path.split("/").pop()}</code> — {alt.note}
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>

          {locus && (
            <div className="rd__focus" role="group" aria-label="Focus with a defensible locus">
              <button type="button" className="rd__focus-tab is-active" aria-pressed="true">
                {locus.focusLabel}
              </button>
            </div>
          )}
          {!locus && showImage && (
            <p className="rd-rev__nolocus">
              No defensible locus. Nothing in this frame may be pointed at without
              implying a person, a single store, or a concept that is not a place.
            </p>
          )}

          <div className="rd__actions">
            <button
              type="button"
              ref={undefined}
              className="rd__depth-trigger"
              aria-expanded={depthOpen}
              aria-haspopup="dialog"
              onClick={() => setDepthOpen(!depthOpen)}
            >
              {t.howThisWorks}
              <span aria-hidden="true">{depthOpen ? "−" : "+"}</span>
            </button>
          </div>
          <p className="rd-rev__resolve">
            Capabilities {scene.technologyCapabilityIds.join(", ")} · segment-specific
            technical media: {explainerCount === 0 ? "none for Outlet Centre" : `${explainerCount}`} ·
            approved customer proof: {usableProofs.length === 0 ? "none" : `${usableProofs.length}`}
          </p>
        </section>

        <figure
          className="rd__stage-figure"
          style={{
            ["--rd-aspect" as string]: decision.assetSize
              ? `${decision.assetSize.w} / ${decision.assetSize.h}`
              : "1920 / 1080",
          }}
        >
          {showImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={decision.candidatePath!} alt={decision.depicts} />
              {locus && (
                <svg
                  className="rd__overlay"
                  viewBox={`0 0 ${decision.assetSize!.w} ${decision.assetSize!.h}`}
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect
                    className="rd-ov"
                    x={locus.rect.x}
                    y={locus.rect.y}
                    width={locus.rect.w}
                    height={locus.rect.h}
                    rx="8"
                  />
                </svg>
              )}
              {locus && (
                <>
                  <button
                    type="button"
                    className={`rd__point${pointOpen ? " is-open" : ""}`}
                    style={{ left: pct(locus.point.x, decision.assetSize!.w), top: pct(locus.point.y, decision.assetSize!.h) }}
                    aria-expanded={pointOpen}
                    onClick={() => setPointOpen(!pointOpen)}
                  >
                    <span aria-hidden="true">{pointOpen ? "×" : "+"}</span>
                    <span className="rd__sr">{locus.focusLabel}</span>
                  </button>
                  {pointOpen && (
                    <div
                      className={`rd__card rd__card--${locus.point.side} rd__card--${locus.point.vertical}`}
                      style={{
                        ["--px" as string]: pct(locus.point.x, decision.assetSize!.w),
                        ["--py" as string]: pct(locus.point.y, decision.assetSize!.h),
                      }}
                      role="status"
                    >
                      <p className="rd__card-kicker">{locus.focusLabel}</p>
                      <p className="rd__card-body">{decision.supports}</p>
                      <p className="rd__card-note">Illustrative visual · not customer data</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="rd__pending">
              <p className="rd__pending-kicker">{DECISION_LABEL[decision.decision]}</p>
              <p className="rd__pending-body">{decision.depicts}</p>
              <p className="rd__pending-caption">{decision.blockedOn}</p>
            </div>
          )}
        </figure>
      </div>

      <ol className="rd__rail" aria-label="Evidence for this scene">
        {["measured", "connected", "derived"].map((kind, position) => {
          const entry = scene.evidence.find((e) => e.type === kind);
          return (
            <li key={kind}>
              <span className="rd__rail-index">{String(position + 1).padStart(2, "0")}</span>
              <span className="rd__rail-kicker">{kind}</span>
              <span className="rd__rail-label">
                {entry ? entry.description : "No cluster of this kind on this scene."}
              </span>
            </li>
          );
        })}
      </ol>

      <section className="rd-rev__footer">
        <div>
          <h2>Segment cover — cover only, never scene evidence</h2>
          <p>
            <code>{cover?.assetPath.split("/").pop()}</code>
          </p>
          <p className="rd-rev__caption">{coverCopy.label} — {coverCopy.note}</p>
        </div>
        <div>
          <h2>Rejected files under the Outlet folder</h2>
          <ul>
            {outletRejectedFiles.map((file) => (
              <li key={file.path}>
                <code>{file.path.split("/").pop()}</code> — {file.reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {depthOpen && (
        <DepthPanel
          ref={depthRef}
          locale="en"
          segmentId={SEGMENT}
          scene={scene}
          copy={depthCopy}
          onClose={() => setDepthOpen(false)}
        />
      )}
    </div>
  );
}
