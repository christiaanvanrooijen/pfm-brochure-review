"use client";

/**
 * "What you get" for Retail · Zone engagement — the store map, as customers
 * receive it: a LiDAR metric (STAR) over the floor plan, against store and
 * street footfall, and the same metric for every section and weekday.
 * The store is fictional (Northstar Store A); the plan is a stylised stand-in.
 */

import { Area, Frame, PURPLE, PINK, ORANGE, makeFmt } from "./report-kit";
import { labels } from "./report-copy";
import { STORE_MAP, STORE_SECTIONS } from "../../content/output-specimens/report-fixtures";
import type { Locale } from "../../i18n/locales";

/** The plan: sections as polygons on a 300 × 330 canvas, shaded by their metric. */
const PLAN: ReadonlyArray<{ id: number; pts: string; label: [number, number]; text: string }> = [
  { id: 0, pts: "40,40 120,30 130,110 50,120", label: [88, 78], text: "Display" },
  { id: 1, pts: "130,30 230,24 238,100 140,110", label: [186, 66], text: "Wall A" },
  { id: 5, pts: "50,120 130,110 138,190 58,200", label: [94, 158], text: "Wall B" },
  { id: 6, pts: "140,110 238,100 246,170 148,184", label: [194, 142], text: "Wall C" },
  { id: 3, pts: "58,200 138,190 146,250 66,262", label: [102, 226], text: "Rear" },
  { id: 1, pts: "148,184 246,170 254,236 156,250", label: [200, 210], text: "Centre" },
  { id: 2, pts: "30,262 230,236 244,292 40,310", label: [136, 276], text: "Entry" },
  { id: 4, pts: "108,288 170,280 176,314 114,320", label: [142, 303], text: "Entrance" },
];

export function StoreMapSpecimen({ locale, focus = null }: { locale: Locale; focus?: string | null }) {
  const L = labels(locale);
  const f = makeFmt(L.numberLocale);
  const days = L.list("weekdays");
  const shade = (id: number) => {
    const v = STORE_SECTIONS[id].total;
    return `rgba(123, 35, 130, ${(0.18 + (v / 2.8) * 0.7).toFixed(2)})`;
  };
  // chart geometry
  const W = 560;
  const H = 180;
  const pad = { l: 34, r: 56, t: 22, b: 30 };
  const step = (W - pad.l - pad.r) / STORE_MAP.length;
  const x = (i: number) => pad.l + step * i + step / 2;
  const yS = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / 0.8);
  const logY = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - (Math.log10(v) - 2) / 3);
  const line = (key: "store" | "street") => STORE_MAP.map((d, i) => `${i ? "L" : "M"}${x(i)},${logY(d[key]).toFixed(1)}`).join(" ");

  return (
    <Frame locale={locale} focus={focus} className="sm">
      <header className="sm__head">
        <h3 className="sm__title">
          {L.t("smTitle")} <b>{L.t("smStore")}</b>
        </h3>
        <p className="sm__dates">
          {L.t("dateRange")}
          <br />
          {L.t("timeRange")}
        </p>
      </header>
      <div className="sm__body">
        <div className="sm__left">
          <Area id="map" n={1} focus={focus} className="rp__card sm__metric">
            <div>
              <p>{L.t("chooseMetric")}</p>
              <span className="rp__select">STAR</span>
            </div>
            <span className="sm__help" aria-hidden="true">?</span>
          </Area>
          <Area id="map" focus={focus} className="rp__card sm__plan">
            <h4>{L.t("smStore")}</h4>
            <p>{L.t("selectSection")}</p>
            <svg viewBox="0 0 300 330" className="rp__svg" role="img" aria-label={L.t("smTitle")}>
              {PLAN.map((p) => (
                <g key={p.pts}>
                  <polygon points={p.pts} fill={shade(p.id)} stroke="#fff" strokeWidth={2} />
                  <text x={p.label[0]} y={p.label[1]} textAnchor="middle" className="rp__axis" style={{ fontSize: 8 }}>{p.text}</text>
                </g>
              ))}
            </svg>
          </Area>
        </div>
        <div className="sm__right">
          <Area id="trend" n={2} focus={focus} className="rp__card sm__chart">
            <h4>STAR</h4>
            <p className="rp__legend">
              <i style={{ background: PURPLE }} /> STAR <i style={{ background: ORANGE }} /> {L.t("storeFootfall")} <i style={{ background: PINK }} /> {L.t("streetFootfall")}
            </p>
            <svg viewBox={`0 0 ${W} ${H}`} className="rp__svg" role="img" aria-label="STAR">
              {[0, 0.2, 0.4, 0.6].map((v) => (
                <text key={v} x={pad.l - 6} y={yS(v) + 3} textAnchor="end" className="rp__axis">{f.num(v, 1)}</text>
              ))}
              {["100", "1,000", "10,000", "100,000"].map((v, i) => (
                <text key={v} x={W - pad.r + 8} y={logY(Math.pow(10, 2 + i)) + 3} className="rp__axis">{i === 0 ? "100" : f.num(Math.pow(10, 2 + i))}</text>
              ))}
              {STORE_MAP.map((d, i) => (
                <g key={d.d}>
                  <rect x={x(i) - step * 0.38} width={step * 0.76} y={yS(d.star)} height={H - pad.b - yS(d.star)} fill={PURPLE} />
                  <text x={x(i)} y={yS(d.star) - 5} textAnchor="middle" className="rp__axis" style={{ fontSize: 11 }}>{f.num(d.star, 2)}</text>
                  <text x={x(i)} y={H - 10} textAnchor="middle" className="rp__axis">{days[[1, 2, 3, 4, 5, 0][i]].slice(0, 3)}</text>
                </g>
              ))}
              <path d={line("street")} fill="none" stroke={PINK} strokeWidth={2.2} />
              <path d={line("store")} fill="none" stroke={ORANGE} strokeWidth={2.2} />
            </svg>
          </Area>
          <Area id="table" n={3} focus={focus} className="rp__card">
            <table className="rp__table">
              <thead>
                <tr>
                  <th>{L.t("section")}</th>
                  {days.slice(0, 6).map((d) => <th key={d}>{d.slice(0, 3)}</th>)}
                  <th><b>{L.t("total")}</b></th>
                </tr>
              </thead>
              <tbody>
                {STORE_SECTIONS.map((s) => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    {s.days.map((v, i) => <td key={i}>{f.num(v, 2)}</td>)}
                    <td><b>{f.num(s.total, 2)}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Area>
        </div>
      </div>
    </Frame>
  );
}
