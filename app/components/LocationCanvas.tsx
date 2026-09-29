import { lenses, retailStory, stages } from "../lib/fixtures";
import type { LensId, StageId } from "../lib/types";

interface LocationCanvasProps {
  stage: StageId;
  activeLenses: LensId[];
  onToggleLens: (lens: LensId) => void;
  presentationMode?: boolean;
}

const isActive = (activeLenses: LensId[], lens: LensId) =>
  activeLenses.includes(lens);

export function LocationCanvas({
  stage,
  activeLenses,
  onToggleLens,
}: LocationCanvasProps) {
  const stageFixture = stages.find((item) => item.id === stage) ?? stages[0];
  return (
    <section className={`location-canvas location-canvas--${stage}`} aria-label="Illustrative retail location canvas">
      <div className="canvas-topline">
        <div>
          <span className="canvas-overline">Selected retail location</span>
          <strong>Utrecht Central Store</strong>
        </div>
        <span className="illustrative-flag">Illustrative data</span>
      </div>

      <div className="canvas-story">
        <span className="eyebrow">{stageFixture.kicker}</span>
        <h1>{stageFixture.title}</h1>
        <p>{stageFixture.description}</p>
      </div>

      <div className="lens-toolbar" aria-label="Data lenses">
        {lenses.map((lens) => {
          const active = isActive(activeLenses, lens.id);
          const unavailable =
            lens.id === "derived" &&
            !(activeLenses.includes("physical") && activeLenses.includes("business"));
          return (
            <button
              className={`lens-control lens-control--${lens.id}${active ? " is-active" : ""}`}
              key={lens.id}
              type="button"
              aria-pressed={active}
              disabled={unavailable}
              aria-label={lens.label}
              title={unavailable ? "Turn on physical measurement and business data first" : lens.role}
              onClick={() => onToggleLens(lens.id)}
            >
              <span className="lens-control__mark" aria-hidden="true" />
              <span>{lens.shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="scene-frame" aria-live="polite">
        {stage === "context" && (
          <div className="context-scene">
            <div className="map-road map-road--one" />
            <div className="map-road map-road--two" />
            <div className="map-road map-road--three" />
            <div className="map-block map-block--one" />
            <div className="map-block map-block--two" />
            <div className="map-block map-block--three" />
            <div className="map-block map-block--four" />
            {isActive(activeLenses, "mobile-geo") && (
              <div className="geo-layer" aria-label="Mobile and geo contextual layer">
                <span className="catchment-ring catchment-ring--one" />
                <span className="catchment-ring catchment-ring--two" />
                <span className="catchment-ring catchment-ring--three" />
                <span className="movement-dot movement-dot--one" />
                <span className="movement-dot movement-dot--two" />
                <span className="movement-dot movement-dot--three" />
                <span className="movement-dot movement-dot--four" />
              </div>
            )}
            <div className="location-building" aria-label="Selected retail location">
              <span className="location-fascia">Sample retail</span>
              <span className="location-door" />
            </div>
            <div className="geo-source-label"><span>Mobile / geo</span><strong>Contextual aggregate</strong><small>Not an entrance count</small></div>
            <div className="catchment-label">Illustrative catchment context</div>
            <div className="approach-label approach-label--west">Approach west</div>
            <div className="approach-label approach-label--south">Approach south</div>
            {isActive(activeLenses, "derived") && (
              <div className="map-callout map-callout--derived">
                <span>Derived pattern</span>
                <strong>Primary approach: west</strong>
              </div>
            )}
            <div className="context-metric">
              <span>Outside opportunity</span>
              <strong>{retailStory.context.displayValue}</strong>
              <small>Illustrative passers-by · 12:00–18:00</small>
            </div>
          </div>
        )}

        {stage === "understand" && (
          <div className="understand-scene">
            <div className="floor-shell">
              <div className="floor-fixture floor-fixture--one" />
              <div className="floor-fixture floor-fixture--two" />
              <div className="floor-fixture floor-fixture--three" />
              <div className="floor-fixture floor-fixture--four" />
              <div className="floor-entry" />
              <span className="zone-label zone-label--front">Front zone</span>
              <span className="zone-label zone-label--mid">Mid-store zone</span>
              <span className="zone-label zone-label--back">Back zone</span>
              <span className="dwell-halo dwell-halo--one" aria-label="Illustrative dwell intensity" />
              <span className="dwell-halo dwell-halo--two" aria-hidden="true" />
              {isActive(activeLenses, "physical") && (
                <div className="route-path" aria-label="Anonymous measured route">
                  <span className="route-segment route-segment--one" />
                  <span className="route-segment route-segment--two" />
                  <span className="route-segment route-segment--three" />
                  <span className="route-node route-node--one" />
                  <span className="route-node route-node--two" />
                  <span className="route-node route-node--three" />
                </div>
              )}
              {isActive(activeLenses, "derived") && (
                <div className="derived-field" aria-label="Derived spatial intensity">
                  <span>Derived comparison</span>
                  <strong>Visits ↑ · conversion ↔</strong>
                </div>
              )}
              {isActive(activeLenses, "business") && (
                <div className="business-connector" aria-label="Connected business data">
                  <span>Customer-supplied</span>
                  <strong>POS + value context</strong>
                </div>
              )}
            </div>
            <div className="truth-stack">
              <span>Measured · route</span>
              <span>Connected · operations</span>
              <span>Derived · interpretation</span>
            </div>
          </div>
        )}

        {stage === "prove" && (
          <div className="prove-scene">
            <div className="proof-location">
              <div className="proof-location__street" />
              <div className="proof-location__shop">Sample retail</div>
              <div className="proof-frame-corner proof-frame-corner--one" />
              <div className="proof-frame-corner proof-frame-corner--two" />
              <div className="proof-frame-corner proof-frame-corner--three" />
              <div className="proof-frame-corner proof-frame-corner--four" />
            </div>
            <div className="proof-caption">
              <span>Method film · 00:34</span>
              <strong>From outside context to direct measurement</strong>
            </div>
          </div>
        )}

        {stage === "configure" && (
          <div className="configure-scene">
            <div className="configuration-location">
              <span className="config-building">One location story</span>
              {isActive(activeLenses, "mobile-geo") && (
                <span className="config-sheet config-sheet--geo">Contextual</span>
              )}
              {isActive(activeLenses, "physical") && (
                <span className="config-sheet config-sheet--physical">Measured</span>
              )}
              {isActive(activeLenses, "business") && (
                <span className="config-sheet config-sheet--business">Connected</span>
              )}
              {isActive(activeLenses, "derived") && (
                <span className="config-sheet config-sheet--derived">Derived</span>
              )}
            </div>
            <div className="handoff-path">
              <span>Session state</span>
              <i aria-hidden="true">→</i>
              <strong>Quote Builder</strong>
            </div>
          </div>
        )}

        {stage === "act" && (
          <div className="act-scene">
            <div className="act-location">
              <span className="act-pulse act-pulse--one" />
              <span className="act-pulse act-pulse--two" />
              <div className="act-building">
                <span>Selected retail story</span>
                <strong>Ready for the next step</strong>
              </div>
            </div>
            <div className="act-route">
              <span>Explore</span><i />
              <span>Configure</span><i />
              <strong>Act</strong>
            </div>
          </div>
        )}
      </div>

      <div className="canvas-legend">
        {lenses.map((lens) => (
          <span className={!isActive(activeLenses, lens.id) ? "is-muted" : ""} key={lens.id}>
            <i className={`legend-mark legend-mark--${lens.id}`} />
            {lens.truthLabel}
          </span>
        ))}
      </div>
    </section>
  );
}
