"use client";

/**
 * "What you get" for the Shopping Centre catchment scene — the real report.
 *
 * This follows the catchment report customers actually receive (the
 * "Demografie" overview page): the same header and tabs, the same five KPI
 * cards against last year, average visit duration by date, day of week, the
 * postcode table and the change-in-catchment map. What a customer sees here is
 * what they get — nothing is shown that the report does not have.
 *
 * Only the data is not real: the location is fictional (Centrum Lindenhaven),
 * the values are illustrative, and the map is a neutral stand-in for the
 * report's basemap with invented postcode areas and place names. Every label is
 * in the reader's language (EN, FR, DE), from `catchment-report-copy.ts`.
 *
 * `focus` spotlights one part of the page — the reading guide beside it points
 * at what is already there; it never adds a feature the report does not have.
 *
 * The page is laid out on a fixed 1100 × 620 canvas and scaled to the space it
 * gets, the way a report page scales in its viewer, so its proportions never
 * reflow into something the real report does not look like.
 */

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { POSTCODES, TOP_POSTCODES, type PostcodeCell } from "../../content/output-specimens/catchment-fixture";
import type { Locale } from "../../i18n/locales";
import { reportCopy, type ReportCopy, type ReportFocus } from "./catchment-report-copy";
import "./catchment-report.css";

const CANVAS = { w: 1100, h: 620 };
const LOCATION = "Centrum Lindenhaven";

function formatter(copy: ReportCopy) {
  return (value: number, digits = 1) =>
    value.toLocaleString(copy.numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/* ------------------------------------------------------------------ DATA */

type Unit = "mins" | "num" | "pct";
const KPIS: ReadonlyArray<{ value: number; ly: number; unit: Unit; digits: number; delta: number; deltaUnit: "mins" | "pct" | "pp" }> = [
  { value: 58, ly: 61, unit: "mins", digits: 0, delta: -3, deltaUnit: "mins" },
  { value: 1.72, ly: 1.66, unit: "num", digits: 2, delta: 3.6, deltaUnit: "pct" },
  { value: 57.4, ly: 55.9, unit: "pct", digits: 1, delta: 1.5, deltaUnit: "pp" },
  { value: 24.1, ly: 26.0, unit: "pct", digits: 1, delta: -1.9, deltaUnit: "pp" },
  { value: 75.9, ly: 74.0, unit: "pct", digits: 1, delta: 1.9, deltaUnit: "pp" },
];

const DURATION = [55.0, 56.5, 60.0];

const DAY_COLOURS = ["#b06ab3", "#f7c59f", "#ee8a93", "#6b5b8c", "#f19a73", "#c07fc0", "#fbd3a8"];
/* Share of visits per weekday, per month; each column sums to 100. */
const DAY_SHARE: number[][] = [
  [11.4, 13.2, 11.6, 14.9, 17.6, 18.1, 13.2],
  [12.8, 14.4, 14.0, 13.6, 13.9, 16.9, 14.4],
  [14.2, 12.6, 12.3, 12.4, 15.1, 16.8, 16.6],
];

const TABLE = TOP_POSTCODES.concat(
  [...POSTCODES].sort((a, b) => b.share - a.share).slice(7, 8),
).map((cell) => ({
  postcode: cell.postcode,
  penetration: Math.min(100, cell.penetration * 1.55),
  visits: cell.share * 5.2,
  population: cell.population,
}));

/* ------------------------------------------------------------------ MAP */

type Pt = [number, number];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Keep the part of `poly` on `a`'s side of the bisector between a and b. */
function clip(poly: Pt[], a: Pt, b: Pt): Pt[] {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const side = (p: Pt) => (p[0] - mx) * dx + (p[1] - my) * dy;
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i += 1) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const sp = side(p);
    const sq = side(q);
    if (sp <= 0) out.push(p);
    if (sp * sq < 0) {
      const t = sp / (sp - sq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
}

/** Irregular postcode areas: a Voronoi cell per postcode, capped in size. */
const AREAS = (() => {
  const random = rng(4242);
  const seeds: Pt[] = POSTCODES.map((c) => [c.x + (random() - 0.5) * 1.1, c.y + (random() - 0.5) * 1.1]);
  return POSTCODES.map((cell, i) => {
    const [sx, sy] = seeds[i];
    const cap = 1.25 + random() * 0.5;
    let poly: Pt[] = Array.from({ length: 9 }, (_, k) => {
      const a = (k / 9) * Math.PI * 2 + random() * 0.3;
      return [sx + Math.cos(a) * cap * 1.2, sy + Math.sin(a) * cap];
    });
    for (let j = 0; j < seeds.length && poly.length; j += 1) {
      if (j === i) continue;
      const other = seeds[j];
      if (Math.abs(other[0] - sx) > 4 || Math.abs(other[1] - sy) > 4) continue;
      poly = clip(poly, seeds[i], other);
    }
    // The report's map is mixed, not two clean halves: the regional drift is
    // there, but each postcode moves on its own as well.
    const change = Math.round((cell.change * 0.45 + (random() - 0.5) * 22) * 10) / 10;
    return {
      cell: { ...cell, change },
      d: `M${poly.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join("L")}Z`,
    };
  });
})();

/** Green for growth, red for decline, paler the smaller the change. */
function changeFill(change: number) {
  const strength = Math.min(1, Math.abs(change) / 12);
  if (Math.abs(change) < 2.5) return "rgba(255,255,255,0.6)";
  return change > 0
    ? `rgba(92, 190, 92, ${0.16 + strength * 0.58})`
    : `rgba(236, 110, 110, ${0.14 + strength * 0.54})`;
}

const MAP_VIEW = { x: -19, y: -14, w: 40, h: 30 };
/* A neutral stand-in basemap: water, a few roads and invented place names. */
const ROADS = [
  "M-19,8 C-8,4 -3,2.2 2,0.4 S10,-3 21,-7",
  "M-4,-14 C-3,-5 -1.5,-1 -0.5,3 S0.5,9 1,16",
  "M-19,-2 C-9,-1.5 -4,1 0,1.6 S9,3 21,8",
  "M6,-14 C6.5,-6 8,-2 9.5,2 S12,8 13,16",
];
const PLACES: ReadonlyArray<{ name: string; x: number; y: number; big?: boolean }> = [
  { name: "Lindenhaven", x: 0.6, y: 2.6, big: true },
  { name: "Brakeloo", x: -8.5, y: -5.6 },
  { name: "Oosterzande", x: 8.2, y: -6.4 },
  { name: "Hemstede", x: 10.8, y: 5.4 },
  { name: "Wijkerveen", x: -9.4, y: 6.2 },
  { name: "Aldermeer", x: -14.5, y: -2.8 },
  { name: "Sint Ootmarsum", x: 16.5, y: -1.5 },
  { name: "Dorrenburg", x: 3.6, y: 9.4 },
];

/* ------------------------------------------------------------------ VIEW */

interface CatchmentReportSpecimenProps {
  locale: Locale;
  focus?: ReportFocus | null;
}

/** Numbered marker tying a part of the page to the reading guide beside it. */
function Marker({ n, area, focus }: { n: number; area: ReportFocus; focus: ReportFocus | null }) {
  return (
    <span className={`pbi__marker${focus === area ? " is-active" : ""}`} aria-hidden="true">
      {n}
    </span>
  );
}

export function CatchmentReportSpecimen({ locale, focus = null }: CatchmentReportSpecimenProps) {
  const copy = reportCopy(locale);
  const n = formatter(copy);
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hover, setHover] = useState<PostcodeCell | null>(null);

  /* Fit the page to the width the layout leaves it AND to the height the
     window has left, so opening it never makes the scene scroll. The width
     budget is the whole composition minus the reading column's minimum; the
     height is the window minus what sits above the report and the journey bar
     and rail below it. */
  useLayoutEffect(() => {
    const el = host.current;
    const frame = el?.closest<HTMLElement>(".wyg");
    const main = el?.closest(".rd__main");
    if (!el || !frame || !main) return;
    const update = () => {
      const style = getComputedStyle(frame);
      const lead = frame.querySelector<HTMLElement>(".wyg__lead");
      const leadMin = (lead && parseFloat(getComputedStyle(lead).minWidth)) || 300;
      const gap = parseFloat(style.columnGap) || 40;
      const width = frame.clientWidth - leadMin - gap;
      const top = el.getBoundingClientRect().top + window.scrollY;
      // The heights of what follows, not the distance to it: the page is at
      // least one window tall, so any slack would otherwise count as taken.
      const siblings = main.parentElement ? Array.from(main.parentElement.children) : [];
      const below =
        siblings
          .slice(siblings.indexOf(main) + 1)
          .reduce((sum, node) => sum + node.getBoundingClientRect().height, 0) + 24;
      const height = window.innerHeight - top - below - 12;
      const next = Math.max(0.4, Math.min(width / CANVAS.w, height / CANVAS.h));
      setScale((current) => (Math.abs(current - next) < 0.002 ? current : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const unitOf = (unit: Unit, value: number, digits: number) =>
    unit === "mins" ? `${n(value, digits)} ${copy.mins}` : unit === "pct" ? `${n(value, digits)}%` : n(value, digits);
  const deltaOf = (delta: number, unit: "mins" | "pct" | "pp") => {
    const sign = delta > 0 ? "+" : "-";
    const abs = Math.abs(delta);
    return unit === "mins" ? `${sign}${n(abs, 0)}` : unit === "pct" ? `${sign}${n(abs)}%` : `${sign}${n(abs)}${copy.pp}`;
  };

  return (
    <div className="pbi-host" ref={host} style={{ width: CANVAS.w * scale, height: CANVAS.h * scale }}>
      <div
        className="pbi"
        data-focus={focus ?? undefined}
        lang={locale}
        style={{ width: CANVAS.w, height: CANVAS.h, transform: `scale(${scale})` } as CSSProperties}
      >
        <header className="pbi__head">
          <h3 className="pbi__title">{copy.title}</h3>
          <span className="pbi__help">
            <i aria-hidden="true">?</i> {copy.help}
          </span>
          <nav className="pbi__tabs" aria-label={copy.title}>
            {copy.tabs.map((tab, i) => (
              <span key={tab} className={i === 0 ? "is-active" : undefined}>
                {tab}
              </span>
            ))}
          </nav>
          <span className="pbi__select pbi__select--short">{copy.month}</span>
          <span className="pbi__select">{LOCATION}</span>
        </header>

        <div className="pbi__kpis" data-area="quality">
          <Marker n={1} area="quality" focus={focus} />
          <div className="pbi__card pbi__period">
            <div className="pbi__period-row">
              <span className="pbi__muted">{copy.trend}</span>
              <span className="pbi__pill">{copy.periodView}</span>
            </div>
            <div className="pbi__period-row">
              <span>{copy.period}</span>
              <span className="pbi__select pbi__select--inline">2026</span>
            </div>
            <div className="pbi__period-row">
              <span>{copy.compareWith}</span>
              <span className="pbi__select pbi__select--inline">{copy.multiple}</span>
            </div>
          </div>
          {KPIS.map((kpi, i) => (
            <div key={copy.kpis[i]} className="pbi__card pbi__kpi">
              <p className="pbi__kpi-label">{copy.kpis[i]}</p>
              <p className="pbi__kpi-value">{unitOf(kpi.unit, kpi.value, kpi.digits)}</p>
              <p className="pbi__kpi-ly">
                {copy.ly}: {unitOf(kpi.unit, kpi.ly, kpi.digits)}{" "}
                <b className={kpi.delta > 0 ? "is-up" : "is-down"}>
                  {deltaOf(kpi.delta, kpi.deltaUnit)} {kpi.delta > 0 ? "↑" : "↓"}
                </b>
              </p>
            </div>
          ))}
        </div>

        <div className="pbi__grid">
          <section className="pbi__card pbi__duration" data-area="when">
            <Marker n={2} area="when" focus={focus} />
            <div className="pbi__card-head">
              <div>
                <h4>{copy.durationTitle}</h4>
                <p>{copy.byDate}</p>
              </div>
              <span className="pbi__select pbi__select--inline">{copy.durationSelect}</span>
            </div>
            <DurationChart copy={copy} n={n} />
          </section>

          <section className="pbi__card pbi__slider" data-area="where">
            <span className="pbi__slider-input">{n(0, 2)}%</span>
            <span>{copy.sliderLabel}</span>
            <span className="pbi__slider-track" aria-hidden="true">
              <i />
            </span>
          </section>

          <section className="pbi__card pbi__days" data-area="when">
            <div className="pbi__card-head">
              <div>
                <h4>{copy.daysTitle}</h4>
                <p>{copy.byDate}</p>
              </div>
              <span className="pbi__select pbi__select--inline">{copy.daysSelect}</span>
            </div>
            <p className="pbi__legend">
              {copy.days.map((day, i) => (
                <span key={day}>
                  <i style={{ background: DAY_COLOURS[i] }} />
                  {day}
                </span>
              ))}
            </p>
            <RibbonChart copy={copy} n={n} />
          </section>

          <section className="pbi__card pbi__table" data-area="where">
            <div className="pbi__table-filters">
              <span className="pbi__select pbi__select--inline">{copy.postcode}</span>
              <span className="pbi__select pbi__select--inline">{copy.multiple}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>{copy.postcode}</th>
                  <th>{copy.penetration}</th>
                  <th>{copy.visits}</th>
                  <th>{copy.population}</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row) => (
                  <tr
                    key={row.postcode}
                    className={hover?.postcode === row.postcode ? "is-hover" : undefined}
                    onMouseEnter={() => setHover(AREAS.find((a) => a.cell.postcode === row.postcode)?.cell ?? null)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <td>{row.postcode}</td>
                    <td>
                      <Bar value={row.penetration} max={100} label={`${n(row.penetration)}%`} />
                    </td>
                    <td>
                      <Bar value={row.visits} max={TABLE[0].visits} label={`${n(row.visits, 2)}%`} />
                    </td>
                    <td>
                      <Bar value={row.population} max={25000} label={n(row.population, 0)} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>{copy.average}</td>
                  <td>{n(21.4)}%</td>
                  <td>{n(100, 2)}%</td>
                  <td>{n(1284306, 0)}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          <section className="pbi__card pbi__map" data-area="where">
            <Marker n={3} area="where" focus={focus} />
            <h4>{copy.mapTitle}</h4>
            <div className="pbi__map-frame" onMouseLeave={() => setHover(null)}>
              <svg viewBox={`${MAP_VIEW.x} ${MAP_VIEW.y} ${MAP_VIEW.w} ${MAP_VIEW.h}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${copy.mapTitle} · ${LOCATION}`}>
                <rect x={MAP_VIEW.x} y={MAP_VIEW.y} width={MAP_VIEW.w} height={MAP_VIEW.h} className="pbi__land" />
                <path className="pbi__water" d="M-19,-14 L-1,-14 C-2,-10.5 -6,-9.5 -9,-10 C-12,-10.5 -15,-8 -19,-7.5 Z" />
                <path className="pbi__water" d="M7,16 C10,13.2 14,13.6 21,12 L21,16 Z" />
                {ROADS.map((d) => (
                  <g key={d}>
                    <path d={d} className="pbi__road-casing" />
                    <path d={d} className="pbi__road" />
                  </g>
                ))}
                {AREAS.map(({ cell, d }) => (
                  <path
                    key={cell.postcode}
                    d={d}
                    className={`pbi__area${hover?.postcode === cell.postcode ? " is-hover" : ""}`}
                    style={{ fill: changeFill(cell.change) }}
                    onMouseEnter={() => setHover(cell)}
                  />
                ))}
                {PLACES.map((place) => (
                  <text key={place.name} x={place.x} y={place.y} className={`pbi__place${place.big ? " is-big" : ""}`} textAnchor="middle">
                    {place.name}
                  </text>
                ))}
                <circle cx="0" cy="0" r="0.45" className="pbi__centre" />
              </svg>
              <span className="pbi__map-controls" aria-hidden="true">
                <i>+</i>
                <i>−</i>
              </span>
              {hover && (
                <span className="pbi__tip" role="status">
                  <b>{hover.postcode}</b> · {hover.change > 0 ? "+" : ""}
                  {n(hover.change)}% {copy.mapTip}
                </span>
              )}
              <span className="pbi__map-note">{copy.mapNote}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <span className="pbi__bar">
      <i style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      <span>{label}</span>
    </span>
  );
}

type Fmt = (value: number, digits?: number) => string;

function DurationChart({ copy, n }: { copy: ReportCopy; n: Fmt }) {
  const W = 560;
  const H = 150;
  const min = 54;
  const max = 61;
  const x = (i: number) => 30 + (i / (DURATION.length - 1)) * (W - 70);
  const y = (v: number) => 8 + (1 - (v - min) / (max - min)) * (H - 30);
  const ticks = [55, 57, 59, 61];
  const first = DURATION[0];
  const last = DURATION[DURATION.length - 1];
  return (
    <svg className="pbi__line" viewBox={`-26 0 ${W + 26} ${H + 8}`} role="img" aria-label={copy.durationTitle}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1="30" x2={W - 40} y1={y(t)} y2={y(t)} className="pbi__gridline" />
          <text x="-24" y={y(t) + 4} className="pbi__axis">{t} {copy.mins}</text>
        </g>
      ))}
      <line x1={x(0)} x2={x(2)} y1={y(first + 0.4)} y2={y(last - 0.6)} className="pbi__trendline" />
      <polyline points={DURATION.map((v, i) => `${x(i)},${y(v)}`).join(" ")} className="pbi__series" />
      {DURATION.map((v, i) => (
        <g key={copy.months[i]}>
          <circle cx={x(i)} cy={y(v)} r="3.2" className="pbi__dot" />
          <text x={x(i)} y={y(v) - 8} textAnchor="middle" className="pbi__datalabel">
            {n(v)} {copy.mins}
          </text>
          <text x={x(i)} y={H + 6} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"} className="pbi__axis">
            {copy.months[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function RibbonChart({ copy, n }: { copy: ReportCopy; n: Fmt }) {
  const W = 330;
  const H = 150;
  const colW = 64;
  const xs = [26, 26 + (W - 26 - colW) / 2, W - colW];
  const y = (v: number) => (v / 100) * H;
  /* Top and bottom of every segment, per month. Monday at the bottom. */
  const stacks = useMemo(
    () =>
      DAY_SHARE.map((shares) => {
        let acc = 0;
        return shares.map((share) => {
          const bottom = acc;
          acc += share;
          return { top: H - y(acc), bottom: H - y(bottom), share };
        });
      }),
    [],
  );
  return (
    <svg className="pbi__ribbon" viewBox={`0 0 ${W} ${H + 16}`} role="img" aria-label={copy.daysTitle}>
      <text x="0" y="9" className="pbi__axis">100%</text>
      <text x="0" y={H / 2 + 3} className="pbi__axis">50%</text>
      <text x="6" y={H} className="pbi__axis">0%</text>
      {copy.days.map((day, d) =>
        [0, 1].map((m) => {
          const a = stacks[m][d];
          const b = stacks[m + 1][d];
          const x1 = xs[m] + colW;
          const x2 = xs[m + 1];
          const mid = (x1 + x2) / 2;
          return (
            <path
              key={`${day}-${m}`}
              d={`M${x1},${a.top} C${mid},${a.top} ${mid},${b.top} ${x2},${b.top} L${x2},${b.bottom} C${mid},${b.bottom} ${mid},${a.bottom} ${x1},${a.bottom} Z`}
              fill={DAY_COLOURS[d]}
              opacity="0.55"
            />
          );
        }),
      )}
      {stacks.map((stack, m) => (
        <g key={copy.months[m]}>
          {stack.map((seg, d) => (
            <g key={d}>
              <rect x={xs[m]} y={seg.top} width={colW} height={seg.bottom - seg.top} fill={DAY_COLOURS[d]} />
              <text x={xs[m] + colW / 2} y={(seg.top + seg.bottom) / 2 + 3} textAnchor="middle" className="pbi__seg">
                {n(seg.share)}%
              </text>
            </g>
          ))}
          <text x={xs[m] + colW / 2} y={H + 13} textAnchor="middle" className="pbi__axis">
            {copy.months[m]}
          </text>
        </g>
      ))}
    </svg>
  );
}
