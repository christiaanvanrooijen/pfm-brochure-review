"use client";

/**
 * PARKED (2026-09-29) — the editorial "What you get" specimen, version 1.
 *
 * Kept on purpose, not in use. The product lead liked the direction but it
 * does not look like the reporting a customer actually receives, so it could
 * set expectations the product cannot meet. The live spike uses
 * `CatchmentReportSpecimen`, which follows the real catchment report. To try
 * this one again, render `<CatchmentSpecimenEditorial />` in the `SPECIMENS`
 * entry in app/preview/demo/journey.tsx; its styles (`.spec*`) are still in
 * globals.css.
 *
 * "What you get" for the Shopping Centre catchment scene — a product specimen.
 *
 * Not a dashboard page and not a screen recording: one reporting view, three
 * lenses, the same composition throughout. The map stays where it is and
 * recolours; the reading on the right changes with it. A reader should see what
 * the customer gets in five seconds and be back in the journey in ten.
 *
 * The map is a stylised PC4 grid (one hexagon per postcode area), not a
 * geographic basemap, and every value comes from the illustrative fixture.
 */

import { useMemo, useState, type CSSProperties } from "react";
import {
  BAND_SHARES,
  DAY_OF_WEEK,
  DECLINING,
  GROWING,
  POSTCODES,
  SPECIMEN_COMPARE,
  SPECIMEN_LOCATION,
  SPECIMEN_PERIOD,
  TOP_POSTCODES,
  VISIT_KPIS,
  WEEKLY_INDEX,
  type PostcodeCell,
} from "../../content/output-specimens/catchment-fixture";

type Lens = "reach" | "pattern" | "change";

const LENSES: ReadonlyArray<{ id: Lens; label: string }> = [
  { id: "reach", label: "Reach" },
  { id: "pattern", label: "Visit pattern" },
  { id: "change", label: "Change" },
];

/* Chart colours only, from the brand's Viridis-inspired chart ramp. */
const SEQ = ["#21114E", "#3F0F72", "#5B167E", "#842681", "#AE347B", "#D8456C", "#F56B5C", "#FC8B62", "#FEAC76"];
const SHARE_STEPS = [0.12, 0.22, 0.35, 0.55, 0.85, 1.3, 2, 3.2];
const FREQ_STEPS = [0.8, 0.95, 1.1, 1.3, 1.5, 1.75, 2, 2.3];
/* Change: decline in the brand purples, growth in the warm end of the chart ramp. */
const DIV = ["#9E77ED", "#6941C6", "#3A3F52", "#D8456C", "#FC8B62"];
const CHANGE_STEPS = [-10, -3, 3, 10];

function step(value: number, steps: readonly number[]) {
  let i = 0;
  while (i < steps.length && value >= steps[i]) i += 1;
  return i;
}

function fillFor(cell: PostcodeCell, lens: Lens) {
  if (lens === "reach") return SEQ[step(cell.share, SHARE_STEPS)];
  if (lens === "pattern") return SEQ[step(cell.frequency, FREQ_STEPS)];
  return DIV[step(cell.change, CHANGE_STEPS)];
}

const HEX = Array.from({ length: 6 }, (_, k) => {
  const a = (Math.PI / 180) * (60 * k - 30);
  return `${(0.94 * Math.cos(a)).toFixed(3)},${(0.94 * Math.sin(a)).toFixed(3)}`;
}).join(" ");

const pct = (value: number, digits = 1) =>
  `${value.toLocaleString("en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
const signed = (value: number, digits = 1) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${pct(Math.abs(value), digits)}`;

/* The map's own frame, with room for the centre label. */
const BOUNDS = (() => {
  const xs = POSTCODES.map((c) => c.x);
  const ys = POSTCODES.map((c) => c.y);
  const pad = 1.4;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  return { minX, minY, w: Math.max(...xs) + pad - minX, h: Math.max(...ys) + pad - minY };
})();

/* Drive-time contours follow the motorway, so they are ellipses along it. */
const ROAD_DEG = -20;
const RINGS = [
  { minutes: 10, rx: 3.75, ry: 2.42 },
  { minutes: 20, rx: 7.5, ry: 4.84 },
  { minutes: 30, rx: 11.25, ry: 7.26 },
];

const visitsChange = (() => {
  const cur = WEEKLY_INDEX.reduce((s, w) => s + w.current, 0);
  const prev = WEEKLY_INDEX.reduce((s, w) => s + w.previous, 0);
  return ((cur - prev) / prev) * 100;
})();

export function CatchmentSpecimenEditorial() {
  const [lens, setLens] = useState<Lens>("reach");
  const [hover, setHover] = useState<string | null>(null);

  const hovered = useMemo(() => POSTCODES.find((c) => c.postcode === hover) ?? null, [hover]);
  const within20 = BAND_SHARES[0].share + BAND_SHARES[1].share;

  return (
    <div className="spec" data-lens={lens}>
      <header className="spec__bar">
        <div className="spec__title">
          <span className="spec__product">Catchment report</span>
          <span className="spec__location">
            {SPECIMEN_LOCATION}
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
          <span className="spec__period">
            {SPECIMEN_PERIOD} <i>vs</i> {SPECIMEN_COMPARE}
          </span>
        </div>
        <div className="spec__tabs" role="tablist" aria-label="Report view">
          {LENSES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={lens === item.id}
              className={`spec__tab${lens === item.id ? " is-active" : ""}`}
              onClick={() => setLens(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="spec__body">
        {/* ---------------------------------------------------- THE MAP */}
        <figure className="spec__map" onMouseLeave={() => setHover(null)}>
          <svg
            viewBox={`${BOUNDS.minX} ${BOUNDS.minY} ${BOUNDS.w} ${BOUNDS.h}`}
            role="img"
            aria-label={`Postcode map of the ${SPECIMEN_LOCATION} catchment, coloured by ${
              lens === "reach" ? "share of visits" : lens === "pattern" ? "visit frequency" : "change in visits"
            }`}
          >
            <g className="spec__rings" transform={`rotate(${ROAD_DEG})`}>
              {RINGS.map((ring) => (
                <g key={ring.minutes}>
                  <ellipse cx="0" cy="0" rx={ring.rx} ry={ring.ry} />
                  <text x={ring.rx - 0.3} y={-0.35} textAnchor="end">
                    {ring.minutes} min
                  </text>
                </g>
              ))}
            </g>
            {POSTCODES.map((cell) => (
              <polygon
                key={cell.postcode}
                className={`spec__cell${hover === cell.postcode ? " is-hover" : ""}`}
                points={HEX}
                transform={`translate(${cell.x.toFixed(3)} ${cell.y.toFixed(3)})`}
                style={{ fill: fillFor(cell, lens) } as CSSProperties}
                onMouseEnter={() => setHover(cell.postcode)}
              />
            ))}
            <g className="spec__pin">
              <circle r="0.95" />
              <circle r="0.42" />
            </g>
          </svg>

          <figcaption className="spec__pin-label" style={pos(0, 0)}>
            {SPECIMEN_LOCATION}
          </figcaption>

          {hovered && (
            <div className="spec__tip" style={pos(hovered.x, hovered.y)} role="status">
              <strong>{hovered.postcode}</strong>
              <span>
                {pct(hovered.share, 2)} of visits · {hovered.minutes} min
              </span>
              <span>
                {pct(hovered.penetration)} penetration · {hovered.frequency.toFixed(2)}× / month
              </span>
              <span className={hovered.change >= 0 ? "is-up" : "is-down"}>
                {signed(hovered.change)} vs {SPECIMEN_COMPARE}
              </span>
            </div>
          )}

          <Legend lens={lens} />
        </figure>

        {/* ---------------------------------------------------- THE READING */}
        <section className="spec__read" key={lens} aria-live="polite">
          {lens === "reach" && (
            <>
              <p className="spec__kicker">Where visitors come from</p>
              <p className="spec__headline">
                <strong>{within20}%</strong>
                <span>of visits come from within a 20-minute drive</span>
              </p>
              <ul className="spec__bands">
                {BAND_SHARES.map((band) => (
                  <li key={band.band}>
                    <span>{band.band}</span>
                    <span className="spec__band-track">
                      <span style={{ width: `${band.share * 2}%` }} />
                    </span>
                    <b>{band.share}%</b>
                  </li>
                ))}
              </ul>
              <table className="spec__table">
                <thead>
                  <tr>
                    <th scope="col">Postcode</th>
                    <th scope="col">Visits</th>
                    <th scope="col">Penetration</th>
                    <th scope="col">Residents</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_POSTCODES.slice(0, 5).map((cell) => (
                    <tr
                      key={cell.postcode}
                      className={hover === cell.postcode ? "is-hover" : undefined}
                      onMouseEnter={() => setHover(cell.postcode)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <th scope="row">{cell.postcode}</th>
                      <td>{pct(cell.share, 2)}</td>
                      <td>{pct(cell.penetration)}</td>
                      <td>{cell.population.toLocaleString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {lens === "pattern" && (
            <>
              <p className="spec__kicker">How the catchment visits</p>
              <dl className="spec__kpis">
                {VISIT_KPIS.map((kpi) => (
                  <div key={kpi.id}>
                    <dt>{kpi.label}</dt>
                    <dd>
                      <strong>{kpi.value}</strong>
                      <span className={kpi.direction === "up" ? "is-up" : "is-down"}>
                        {kpi.delta}
                      </span>
                      <small>LY {kpi.previous}</small>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="spec__sub">Share of weekly visits by day</p>
              <DayChart />
            </>
          )}

          {lens === "change" && (
            <>
              <p className="spec__kicker">What is changing</p>
              <p className="spec__headline">
                <strong>{signed(visitsChange, 0)}</strong>
                <span>
                  visits against {SPECIMEN_COMPARE} — growth from the north-east, share lost in the
                  south-west
                </span>
              </p>
              <p className="spec__sub">Weekly visits, indexed to {SPECIMEN_COMPARE}</p>
              <TrendChart />
              <div className="spec__movers">
                <MoverList title="Growing" cells={GROWING} hover={hover} onHover={setHover} />
                <MoverList title="Declining" cells={DECLINING} hover={hover} onHover={setHover} />
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="spec__foot">
        <span>Mobile &amp; geo · aggregate visitor origin by PC4 postcode area</span>
        <span>Illustrative data · fictional centre</span>
      </footer>
    </div>
  );
}

/** A position inside the map figure, as percentages of its viewBox. */
function pos(x: number, y: number): CSSProperties {
  return {
    left: `${((x - BOUNDS.minX) / BOUNDS.w) * 100}%`,
    top: `${((y - BOUNDS.minY) / BOUNDS.h) * 100}%`,
  };
}

function Legend({ lens }: { lens: Lens }) {
  const colours = lens === "change" ? DIV : SEQ;
  const [low, high] =
    lens === "reach"
      ? ["Fewer visits", "More visits"]
      : lens === "pattern"
        ? ["Less often", "More often"]
        : ["Declining", "Growing"];
  return (
    <div className="spec__legend" aria-hidden="true">
      <span>{low}</span>
      <span className="spec__legend-ramp">
        {colours.map((c) => (
          <i key={c} style={{ background: c }} />
        ))}
      </span>
      <span>{high}</span>
    </div>
  );
}

function DayChart() {
  const max = 24;
  return (
    <div className="spec__days" role="img" aria-label="Share of weekly visits by day of the week, Saturday highest">
      {DAY_OF_WEEK.map((d) => (
        <div key={d.day} className={`spec__day${d.day === "Sat" ? " is-peak" : ""}`}>
          <span className="spec__day-value">{d.share.toFixed(1)}</span>
          <span className="spec__day-col">
            <span className="spec__day-bar" style={{ height: `${(d.share / max) * 100}%` }} />
            <span className="spec__day-ly" style={{ bottom: `${(d.previous / max) * 100}%` }} />
          </span>
          <span className="spec__day-label">{d.day}</span>
        </div>
      ))}
      <p className="spec__day-key">
        <i /> {SPECIMEN_COMPARE}
      </p>
    </div>
  );
}

function TrendChart() {
  const W = 300;
  const H = 92;
  const values = WEEKLY_INDEX.flatMap((w) => [w.current, w.previous]);
  const min = Math.min(...values) - 3;
  const max = Math.max(...values) + 3;
  const x = (i: number) => (i / (WEEKLY_INDEX.length - 1)) * W;
  const y = (v: number) => H - ((v - min) / (max - min)) * H;
  const line = (key: "current" | "previous") =>
    WEEKLY_INDEX.map((w, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(w[key]).toFixed(1)}`).join(" ");
  const last = WEEKLY_INDEX[WEEKLY_INDEX.length - 1];
  return (
    <svg className="spec__trend" viewBox={`-4 -8 ${W + 40} ${H + 22}`} role="img" aria-label="Weekly visit index, this year above last year from week two onwards">
      <line x1="0" x2={W} y1={y(100)} y2={y(100)} className="spec__trend-base" />
      <path d={line("previous")} className="spec__trend-prev" />
      <path d={line("current")} className="spec__trend-cur" />
      <circle cx={x(WEEKLY_INDEX.length - 1)} cy={y(last.current)} r="3.2" className="spec__trend-dot" />
      <text x={W + 7} y={y(last.current) + 4}>{last.current}</text>
      <text x={W + 7} y={y(last.previous) + 4} className="is-prev">{last.previous}</text>
      <text x="0" y={H + 13} className="is-axis">wk 1</text>
      <text x={W} y={H + 13} textAnchor="end" className="is-axis">wk 13</text>
    </svg>
  );
}

function MoverList({
  title,
  cells,
  hover,
  onHover,
}: {
  title: string;
  cells: readonly PostcodeCell[];
  hover: string | null;
  onHover: (postcode: string | null) => void;
}) {
  return (
    <div className="spec__mover">
      <p>{title}</p>
      <ul>
        {cells.slice(0, 3).map((cell) => (
          <li
            key={cell.postcode}
            className={hover === cell.postcode ? "is-hover" : undefined}
            onMouseEnter={() => onHover(cell.postcode)}
            onMouseLeave={() => onHover(null)}
          >
            <span>{cell.postcode}</span>
            <b className={cell.change >= 0 ? "is-up" : "is-down"}>{signed(cell.change)}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
