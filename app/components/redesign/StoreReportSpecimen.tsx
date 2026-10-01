"use client";

/**
 * "What you get" for Retail — the store report, as customers receive it.
 *
 * One report, two of its pages, each on the scene whose question it answers:
 *
 *   insights      → Retail · Conversion & sales context ("Footfall vs.
 *                   Conversion Rate" and the opportunity cards)
 *   demographics  → Retail · Visitor composition (group size, STAR, the
 *                   adult/child/gender split, by hour and by week)
 *
 * The chrome is the report's own and is shared: last-refresh stamp, the four
 * page tabs, the slicer column and the period bar. Only the data is not real —
 * the store is fictional (Northstar) and every value comes from a seeded
 * fixture. The reading guide beside it only points at what is on the page.
 *
 * Like the catchment specimen, the page is laid out on a fixed 1100 × 620
 * canvas and scaled to the room it gets, so it never reflows into something
 * the real report does not look like, and opening it never makes the scene
 * scroll.
 */

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  STORE_AVG_ATV,
  STORE_BEST_OPPORTUNITY,
  STORE_DAYS,
  STORE_DEMO_KPIS,
  STORE_GROUP_GRID,
  STORE_GROUP_HOURS,
  STORE_HOURLY,
  STORE_MONTH_INDEX,
  STORE_NAME,
  STORE_REFRESH,
  STORE_REGION,
  STORE_WEEKS,
  STORE_YEAR,
  STORE_AVG_CONVERSION,
} from "../../content/output-specimens/store-fixture";
import type { Locale } from "../../i18n/locales";
import { storeCopy, type StoreCopy, type StoreFocus, type StorePage } from "./store-report-copy";
import "./store-report.css";

const CANVAS = { w: 1100, h: 620 };
const PURPLE = "#7b2382";
const PINK = "#d6456e";
const ORANGE = "#f7a46b";

/* ----------------------------------------------------------------- SIZING */

/** The catchment specimen's fit, unchanged: width left of the reading column,
    height left above the journey bar and rail — so opening never scrolls. */
function useFitScale(host: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = host.current;
    const frame = el?.closest<HTMLElement>(".wyg");
    const main = el?.closest(".rd__main");
    if (!el || !frame || !main) return;
    const update = () => {
      const lead = frame.querySelector<HTMLElement>(".wyg__lead");
      const leadMin = (lead && parseFloat(getComputedStyle(lead).minWidth)) || 300;
      const gap = parseFloat(getComputedStyle(frame).columnGap) || 40;
      const width = frame.clientWidth - leadMin - gap;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const siblings = main.parentElement ? Array.from(main.parentElement.children) : [];
      const below =
        siblings.slice(siblings.indexOf(main) + 1).reduce((sum, node) => sum + node.getBoundingClientRect().height, 0) + 24;
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
  }, [host]);
  return scale;
}

/* ----------------------------------------------------------------- HELPERS */

function fmt(copy: StoreCopy) {
  const num = (v: number, d = 0) =>
    v.toLocaleString(copy.numberLocale, { minimumFractionDigits: d, maximumFractionDigits: d });
  const eur = (v: number, d = 2) =>
    v.toLocaleString(copy.numberLocale, { style: "currency", currency: "EUR", minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (v: number, d = 1) => `${num(v, d)} %`;
  const k = (v: number) => `${num(v / 1000, 1)}K`;
  const signed = (v: number, d = 1) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${num(Math.abs(v), d)}%`;
  return { num, eur, pct, k, signed };
}

function Marker({ n, area, focus }: { n: number; area: StoreFocus; focus: StoreFocus | null }) {
  return (
    <span className={`str__marker${focus === area ? " is-active" : ""}`} aria-hidden="true">
      {n}
    </span>
  );
}

function Slicer({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="str__slicer">
      <p className="str__slicer-label">{label}</p>
      <span className="str__select">{value}</span>
      {note && <p className="str__slicer-note">{note}</p>}
    </div>
  );
}

/* --------------------------------------------------------------- INSIGHTS */

function InsightsChart({ copy, f }: { copy: StoreCopy; f: ReturnType<typeof fmt> }) {
  const W = 640;
  const H = 400;
  const pad = { l: 40, r: 40, t: 14, b: 26 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;
  const maxF = 1400;
  const maxC = 30;
  const step = pw / STORE_DAYS.length;
  const x = (i: number) => pad.l + step * i + step / 2;
  const yF = (v: number) => pad.t + ph - (v / maxF) * ph;
  const yC = (v: number) => pad.t + ph - (v / maxC) * ph;
  const line = STORE_DAYS.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${yC(d.conversion).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="str__svg" role="img" aria-label={copy.chartTitle}>
      {[0, 200, 400, 600, 800, 1000, 1200].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={yF(v)} y2={yF(v)} className="str__grid" />
          <text x={pad.l - 6} y={yF(v) + 3} textAnchor="end" className="str__axis">
            {f.num(v)}
          </text>
        </g>
      ))}
      {[0, 5, 10, 15, 20, 25].map((v) => (
        <text key={v} x={W - pad.r + 6} y={yC(v) + 3} className="str__axis">
          {v}%
        </text>
      ))}
      {STORE_DAYS.map((d, i) => (
        <rect
          key={d.day}
          x={x(i) - step * 0.36}
          width={step * 0.72}
          y={yF(d.footfall)}
          height={pad.t + ph - yF(d.footfall)}
          fill={d.conversion >= STORE_AVG_CONVERSION ? PURPLE : PINK}
        />
      ))}
      <path d={line} fill="none" stroke={ORANGE} strokeWidth={2.2} />
      {STORE_DAYS.map((d, i) => (
        <circle key={d.day} cx={x(i)} cy={yC(d.conversion)} r={2.6} fill={ORANGE} />
      ))}
      {STORE_DAYS.filter((d) => d.weekday === 1).map((d) => (
        <text key={d.day} x={x(d.day - 1)} y={H - 8} textAnchor="middle" className="str__axis">
          {String(d.day).padStart(2, "0")} {copy.monthShort}
        </text>
      ))}
    </svg>
  );
}

function InsightsPage({ copy, focus }: { copy: StoreCopy; focus: StoreFocus | null }) {
  const f = fmt(copy);
  const b = STORE_BEST_OPPORTUNITY;
  const date = new Date(STORE_YEAR, STORE_MONTH_INDEX, b.day).toLocaleDateString(copy.numberLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return (
    <div className="str__insights">
      <section className="str__card str__chart" data-area="pattern">
        <Marker n={1} area="pattern" focus={focus} />
        <div className="str__chart-head">
          <div>
            <h4>{copy.chartTitle}</h4>
            <p className="str__legend">
              <i style={{ background: PURPLE }} /> {copy.selected} <i style={{ background: ORANGE }} /> {copy.conversion}
            </p>
          </div>
          <div className="str__toggle" aria-hidden="true">
            <span className="is-active">{copy.conversion}</span>
            <span>{copy.atv}</span>
          </div>
        </div>
        <InsightsChart copy={copy} f={f} />
      </section>

      <div className="str__cards">
        <div className="str__card-group" data-area="opportunity">
          <Marker n={2} area="opportunity" focus={focus} />
          <div className="str__stat"><span>{copy.bestDate}</span><b>{date}</b></div>
          <div className="str__stat"><span>{copy.footfall}</span><b>{f.num(b.footfall)}</b></div>
          <div className="str__stat"><span>{copy.conversion}</span><b>{f.pct(b.conversion, 2)}</b></div>
          <div className="str__stat"><span>{copy.atv}</span><b>{f.eur(b.atv)}</b></div>
          <div className="str__stat"><span>{copy.turnover}</span><b>{f.eur(b.actual)}</b></div>
        </div>
        <div className="str__card-group" data-area="missed">
          <Marker n={3} area="missed" focus={focus} />
          <div className="str__stat is-soft"><span>{copy.averageAtv}</span><b>{f.eur(STORE_AVG_ATV)}</b></div>
          <div className="str__stat is-soft"><span>{copy.potential}</span><b>{f.eur(b.potential)}</b></div>
          <div className="str__stat is-missed"><span>{copy.missed}</span><b>{f.eur(b.missed)}</b></div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- DEMOGRAPHICS */

function StarChart({ copy, f }: { copy: StoreCopy; f: ReturnType<typeof fmt> }) {
  const W = 400;
  const H = 150;
  const pad = { l: 26, r: 22, t: 16, b: 18 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;
  const step = pw / STORE_HOURLY.length;
  const x = (i: number) => pad.l + step * i + step / 2;
  const yF = (v: number) => pad.t + ph - (v / 4000) * ph;
  const yS = (v: number) => pad.t + ph - (v / 5) * ph;
  const line = STORE_HOURLY.map((h, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${yS(h.star).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="str__svg" role="img" aria-label={copy.footfallVsStar}>
      {[0, 2000, 4000].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={yF(v)} y2={yF(v)} className="str__grid" />
          <text x={pad.l - 4} y={yF(v) + 3} textAnchor="end" className="str__axis">{v / 1000}K</text>
        </g>
      ))}
      {STORE_HOURLY.map((h, i) => (
        <g key={h.hour}>
          <rect x={x(i) - step * 0.38} width={step * 0.76} y={yF(h.footfall)} height={pad.t + ph - yF(h.footfall)} fill={PURPLE} />
          <text x={x(i)} y={H - 4} textAnchor="middle" className="str__axis">{h.hour}</text>
        </g>
      ))}
      <path d={line} fill="none" stroke={ORANGE} strokeWidth={2} />
      {STORE_HOURLY.map((h, i) => (
        <g key={h.hour}>
          <rect x={x(i) - 13} y={yS(h.star) - 7} width={26} height={13} rx={2} fill={ORANGE} />
          <text x={x(i)} y={yS(h.star) + 3} textAnchor="middle" className="str__pill-text">{f.num(h.star, 2)}</text>
        </g>
      ))}
    </svg>
  );
}

function ByTimeChart({ copy, f }: { copy: StoreCopy; f: ReturnType<typeof fmt> }) {
  const W = 400;
  const H = 140;
  const pad = { l: 26, r: 6, t: 6, b: 16 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;
  const step = pw / STORE_HOURLY.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="str__svg" role="img" aria-label={copy.byTime}>
      {[0, 50, 100].map((v) => (
        <text key={v} x={pad.l - 4} y={pad.t + ph - (v / 100) * ph + 3} textAnchor="end" className="str__axis">{v}%</text>
      ))}
      {STORE_HOURLY.map((h, i) => {
        const women = Math.max(0, 100 - h.men - h.child);
        const parts = [
          { v: h.men, c: PURPLE },
          { v: women, c: PINK },
          { v: h.child, c: ORANGE },
        ];
        let acc = 0;
        const bx = pad.l + step * i + step * 0.14;
        return (
          <g key={h.hour}>
            {parts.map((p) => {
              const y = pad.t + ph - ((acc + p.v) / 100) * ph;
              const hgt = (p.v / 100) * ph;
              acc += p.v;
              return (
                <g key={p.c}>
                  <rect x={bx} width={step * 0.72} y={y} height={hgt} fill={p.c} />
                  {hgt > 14 && (
                    <text x={bx + step * 0.36} y={y + hgt / 2 + 3} textAnchor="middle" className="str__seg-text">
                      {f.num(p.v, 1)}%
                    </text>
                  )}
                </g>
              );
            })}
            <text x={bx + step * 0.36} y={H - 4} textAnchor="middle" className="str__axis">{h.hour}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DemographicsPage({ copy, focus }: { copy: StoreCopy; focus: StoreFocus | null }) {
  const f = fmt(copy);
  const K = STORE_DEMO_KPIS;
  const kpis: Array<[string, string, number]> = [
    [copy.groupSize, f.num(K.groupSize.value, 2), K.groupSize.delta],
    [copy.star, f.num(K.star.value, 2), K.star.delta],
    [copy.capture, f.pct(K.capture.value), K.capture.delta],
    [copy.adult, f.pct(K.adult.value), K.adult.delta],
    [copy.child, f.pct(K.child.value), K.child.delta],
    [copy.men, f.pct(K.men.value), K.men.delta],
    [copy.women, f.pct(K.women.value), K.women.delta],
  ];
  const all = STORE_GROUP_GRID.flat();
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const heat = (v: number) => {
    const t = (v - lo) / (hi - lo);
    return `rgba(247, 164, 107, ${(0.12 + t * 0.88).toFixed(2)})`;
  };
  return (
    <div className="str__demo">
      <div className="str__kpis" data-area="who">
        <Marker n={1} area="who" focus={focus} />
        {kpis.map(([label, value, delta]) => (
          <div key={label} className="str__kpi">
            <span>{label}</span>
            <b>{value}</b>
            <em className={delta >= 0 ? "is-up" : "is-down"}>{f.signed(delta)}</em>
          </div>
        ))}
      </div>

      <div className="str__demo-grid">
        <section className="str__card" data-area="hours">
          <Marker n={2} area="hours" focus={focus} />
          <h4>{copy.footfallVsStar}</h4>
          <p className="str__legend">
            <i style={{ background: PURPLE }} /> {copy.footfall} <i style={{ background: ORANGE }} /> {copy.star}
          </p>
          <StarChart copy={copy} f={f} />
        </section>

        <section className="str__card" data-area="hours">
          <h4>{copy.groupGrid}</h4>
          <table className="str__table str__heat">
            <thead>
              <tr>
                <th>{copy.dayName}</th>
                {STORE_GROUP_HOURS.map((h) => <th key={h}>{String(h).padStart(2, "0")}</th>)}
              </tr>
            </thead>
            <tbody>
              {STORE_GROUP_GRID.map((row, d) => (
                <tr key={copy.weekdays[d]}>
                  <td>{copy.weekdays[d]}</td>
                  {row.map((v, i) => (
                    <td key={i} style={{ background: heat(v) }}>{f.num(v, 2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="str__card" data-area="weeks">
          <Marker n={3} area="weeks" focus={focus} />
          <h4>{copy.rolling}</h4>
          <table className="str__table str__rolling">
            <thead>
              <tr>
                <th>{copy.weekNumber}</th>
                <th>{copy.selectedPeriod}</th>
                <th>{copy.adults}</th>
                <th>{copy.child}</th>
                <th>{copy.men}</th>
                <th>{copy.women}</th>
                <th>{copy.avgGroup}</th>
              </tr>
            </thead>
            <tbody>
              {[...STORE_WEEKS].reverse().map((w) => (
                <tr key={w.week}>
                  <td>{w.week}</td>
                  <td>{f.num(w.footfall)}</td>
                  <td>{f.pct(w.adults)}</td>
                  <td>{f.pct(w.child)}</td>
                  <td>{f.pct(w.men)}</td>
                  <td>{f.pct(w.women)}</td>
                  <td>{f.num(w.groupSize, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="str__card" data-area="weeks">
          <h4>{copy.byTime}</h4>
          <p className="str__legend">
            <i style={{ background: PURPLE }} /> {copy.men} <i style={{ background: PINK }} /> {copy.women}{" "}
            <i style={{ background: ORANGE }} /> {copy.child}
          </p>
          <ByTimeChart copy={copy} f={f} />
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ PAGE */

export function StoreReportSpecimen({
  locale,
  page,
  focus = null,
}: {
  locale: Locale;
  page: StorePage;
  focus?: StoreFocus | null;
}) {
  const copy = storeCopy(locale);
  const host = useRef<HTMLDivElement>(null);
  const scale = useFitScale(host);
  const activeTab = page === "insights" ? 3 : 2;

  let body: ReactNode;
  let slicers: ReactNode;
  if (page === "insights") {
    body = <InsightsPage copy={copy} focus={focus} />;
    slicers = (
      <>
        <Slicer label={copy.locations} value={STORE_REGION} note={STORE_NAME} />
        <Slicer label={copy.year} value={copy.currentYear} />
        <Slicer label={copy.month} value={copy.monthValue} />
      </>
    );
  } else {
    body = <DemographicsPage copy={copy} focus={focus} />;
    slicers = (
      <>
        <Slicer label={copy.locations} value={STORE_REGION} note={STORE_NAME} />
        <Slicer label={copy.year} value={copy.currentYear} />
        <Slicer label={copy.comparedYear} value={String(STORE_YEAR - 1)} />
        <Slicer label={copy.month} value={copy.monthValue} />
        <Slicer label={copy.type} value={copy.people} />
      </>
    );
  }

  return (
    <div className="str-host" ref={host} style={{ width: CANVAS.w * scale, height: CANVAS.h * scale }}>
      <div
        className="str"
        data-focus={focus ?? undefined}
        lang={locale}
        style={{ width: CANVAS.w, height: CANVAS.h, transform: `scale(${scale})` } as CSSProperties}
      >
        <header className="str__top">
          <p className="str__refresh">
            {copy.refresh}: {STORE_REFRESH}
          </p>
          <nav className="str__tabs" aria-label={copy.tabs.join(" · ")}>
            {copy.tabs.map((tab, i) => (
              <span key={tab} className={i === activeTab ? "is-active" : undefined}>
                {tab}
              </span>
            ))}
          </nav>
        </header>
        <div className="str__body">
          <aside className="str__slicers">{slicers}</aside>
          <div className="str__main">
            {body}
            <nav className="str__periods" aria-hidden="true">
              {copy.periods.map((p, i) => (
                <span key={p} className={i === 2 ? "is-active" : undefined}>
                  {p}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
