"use client";

/**
 * Scene diagrams, for scenes with no usable photograph.
 *
 * WHY THESE EXIST
 *
 * Four Outlet Core scenes have no honest photograph, and two more carry
 * signage restrictions that cannot be waived. A large "visual not produced"
 * panel is truthful but useless: the concept is explainable even when the
 * picture is not available, and the reader is here to understand the concept.
 *
 * WHAT THEY MAY AND MAY NOT CONTAIN
 *
 * Shapes and relationships from the scene's own typed evidence. No numbers, no
 * distances, no travel bands, no origins, no proportions and no coverage
 * claims — anything of that kind would be invented data wearing a diagram's
 * clothes. Every label passed in is the model's own or the journey's own
 * localized chrome, and each diagram is captioned as illustrative.
 */

export type DiagramKind = "aggregate-context" | "origin-source" | "access-points" | "entrance-line";

const INK = "rgba(255,255,255,0.82)";
const FAINT = "rgba(255,255,255,0.30)";
const ACCENT = "#B692F6";

export function SceneDiagram({
  kind,
  labels,
}: {
  kind: DiagramKind;
  /**
   * Short localized words for the parts. Never values.
   *
   * `measuredThing` is what the sensor produces; `contextSource` is what an
   * approved external source supplies. Keeping them named rather than
   * positional is what stopped the origin diagram pointing its arrow the wrong
   * way — from the measurement to the context, which is the exact claim the
   * scene's truth line denies.
   */
  labels: { measuredThing: string; contextSource: string; note: string };
}) {
  const text = { fill: INK, fontSize: 34, fontFamily: "inherit" } as const;
  const small = { fill: FAINT, fontSize: 27, fontFamily: "inherit" } as const;

  return (
    <svg
      className="rd-demo__diagram"
      viewBox="0 0 1600 900"
      role="img"
      aria-label={`${labels.measuredThing} · ${labels.contextSource}`}
    >
      {kind === "aggregate-context" && (
        <g>
          {/* The asset, measured. A closed shape because it has a boundary. */}
          <rect x="640" y="360" width="320" height="180" rx="10" fill="none" stroke={ACCENT} strokeWidth="3" />
          <text x="800" y="455" textAnchor="middle" {...text}>{labels.measuredThing}</text>
          {/* The area around it. Deliberately open and unbounded: no band, no
              radius, no distance — the source describes an area, and drawing a
              ring would invent a travel band nobody measured. */}
          <path d="M300 250 C 500 170, 1100 170, 1300 250" fill="none" stroke={FAINT} strokeWidth="2" strokeDasharray="10 14" />
          <path d="M260 600 C 480 700, 1120 700, 1340 600" fill="none" stroke={FAINT} strokeWidth="2" strokeDasharray="10 14" />
          <text x="800" y="185" textAnchor="middle" {...small}>{labels.contextSource}</text>
          <text x="800" y="735" textAnchor="middle" {...small}>{labels.note}</text>
        </g>
      )}

      {kind === "origin-source" && (
        <g>
          <rect x="200" y="380" width="360" height="150" rx="10" fill="none" stroke={ACCENT} strokeWidth="3" />
          <text x="380" y="462" textAnchor="middle" {...text}>{labels.measuredThing}</text>
          <rect x="1040" y="380" width="360" height="150" rx="10" fill="none" stroke={FAINT} strokeWidth="2" strokeDasharray="10 14" />
          <text x="1220" y="462" textAnchor="middle" {...text}>{labels.contextSource}</text>
          {/* One arrow, and it runs FROM the approved source TO the measurement.
              Context is added to what was measured; a sensor cannot produce
              origin, so the arrow must never point the other way. */}
          <path d="M1030 455 H 620" fill="none" stroke={FAINT} strokeWidth="2" />
          <path d="M630 443 L 604 455 L 630 467 Z" fill={FAINT} />
          <text x="820" y="360" textAnchor="middle" {...small}>{labels.note}</text>
        </g>
      )}

      {kind === "access-points" && (
        <g>
          {/* Access points on a boundary. Three marks because a site has more
              than one way in — not because three were counted. */}
          <path d="M240 620 H 1360" fill="none" stroke={FAINT} strokeWidth="2" />
          {[440, 800, 1160].map((x) => (
            <g key={x}>
              <line x1={x} y1="560" x2={x} y2="680" stroke={ACCENT} strokeWidth="3" />
              <circle cx={x} cy="620" r="12" fill="none" stroke={ACCENT} strokeWidth="3" />
            </g>
          ))}
          <text x="800" y="500" textAnchor="middle" {...text}>{labels.measuredThing}</text>
          <text x="800" y="735" textAnchor="middle" {...small}>{labels.note}</text>
        </g>
      )}

      {kind === "entrance-line" && (
        <g>
          {/* A configured line, and movement crossing it in both directions.
              Two arrows because in and out are separate signals. */}
          <line x1="700" y1="250" x2="700" y2="650" stroke={ACCENT} strokeWidth="4" />
          <text x="700" y="205" textAnchor="middle" {...small}>{labels.measuredThing}</text>
          <path d="M380 380 H 660" fill="none" stroke={INK} strokeWidth="2" />
          <path d="M650 368 L 676 380 L 650 392 Z" fill={INK} />
          <path d="M1020 520 H 740" fill="none" stroke={FAINT} strokeWidth="2" />
          <path d="M750 508 L 724 520 L 750 532 Z" fill={FAINT} />
          <text x="1120" y="530" {...small}>{labels.contextSource}</text>
          <text x="700" y="735" textAnchor="middle" {...small}>{labels.note}</text>
        </g>
      )}
    </svg>
  );
}
