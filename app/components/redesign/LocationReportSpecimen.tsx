"use client";

/**
 * "What you get" for Shopping Centre · Brand counting — the location report's
 * Shops page: average daily footfall counted at each covered shop, shown on
 * the plan, with each sensor over the past two years, the hourly rhythm and
 * the months against last year. The centre and every shop are fictional; the
 * plan is a stylised stand-in, not a drawing of a real building.
 */

import { Area, Frame, PURPLE, ORANGE, makeFmt } from "./report-kit";
import { labels } from "./report-copy";
import {
  LOCATION_HEAT, LOCATION_HOURS, LOCATION_KPIS, LOCATION_MONTHS, LOCATION_SENSORS, LOCATION_SHOPS,
} from "../../content/output-specimens/report-fixtures";
import type { Locale } from "../../i18n/locales";

/** Plan blocks: [x, y, w, h, shop index | null] on a 380 × 360 canvas. */
const BLOCKS: ReadonlyArray<readonly [number, number, number, number, number | null]> = [
  [34, 24, 52, 62, 0], [34, 88, 52, 12, null], [34, 102, 52, 150, 3], [102, 70, 70, 44, 1], [102, 170, 70, 36, 1],
  [200, 66, 56, 40, 4], [102, 122, 70, 36, null], [190, 118, 40, 40, null], [102, 216, 84, 30, null],
  [212, 242, 66, 42, 7], [296, 140, 44, 190, 9], [296, 270, 44, 46, 8], [262, 118, 70, 44, 2], [140, 262, 60, 36, 5],
];

export function LocationReportSpecimen({ locale, focus = null }: { locale: Locale; focus?: string | null }) {
  const L = labels(locale);
  const f = makeFmt(L.numberLocale);
  const tabs = L.list("loTabs");
  const months = L.list("months");
  const heatMax = Math.max(...LOCATION_HEAT.flat());
  const days = L.list("weekdays");
  const W = 410;
  const H = 150;
  const pad = { l: 28, r: 6, t: 8, b: 26 };
  const step = (W - pad.l - pad.r) / LOCATION_MONTHS.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / 12000);
  return (
    <Frame locale={locale} focus={focus} className="lo">
      <h3 className="lo__title">{L.t("loTitle")}</h3>
      <div className="lo__body">
        <aside className="lo__nav">
          {/* The approved logo asset, never a redrawn one. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lo__logo" src="/assets/logo/pfm-logo-black.png" alt="PFM" width={72} height={22} />
          <div className="lo__date">
            <p>{L.t("loDate")}</p>
            <div><span>01/01/2026</span><span>31/12/2026</span></div>
            <i className="lo__slider" style={{ display: "block" }} />
          </div>
          {tabs.map((t, i) => <span key={t} className={`lo__btn${i === 2 ? " is-active" : ""}`}>{t}</span>)}
        </aside>

        <div className="lo__center">
          <Area id="map" n={1} focus={focus} className="rp__card">
            <p className="lo__h">{L.t("avgDaily")}</p>
            <svg viewBox="0 0 380 360" className="rp__svg" role="img" aria-label={L.t("avgDaily")}>
              <rect x="14" y="8" width="352" height="344" fill="#f4f4f4" />
              {BLOCKS.map(([bx, by, bw, bh, shop], i) => (
                <g key={i}>
                  <rect x={bx} y={by} width={bw} height={bh} fill={shop === null ? "#c8c8c8" : `rgba(176, 80, 184, ${(0.55 + LOCATION_SHOPS[shop].value / 3300).toFixed(2)})`} />
                  {shop !== null && <text x={bx + bw / 2} y={by + bh / 2 + 4} textAnchor="middle" style={{ fontSize: 11 }}>{f.num(LOCATION_SHOPS[shop].value)}</text>}
                </g>
              ))}
              <text x="190" y="346" textAnchor="middle" className="rp__note">{L.t("mapNote")}</text>
            </svg>
          </Area>
          <Area id="rhythm" focus={focus} className="rp__card">
            <p className="lo__h">{L.t("perMonth")}</p>
            <p className="rp__legend"><i style={{ background: PURPLE }} /> {L.t("avgDailyLegend")} <i style={{ background: ORANGE }} /> {L.t("avgLy")}</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="rp__svg" role="img" aria-label={L.t("perMonth")}>
              {[0, 10000].map((v) => (
                <g key={v}>
                  <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="rp__grid" />
                  <text x={pad.l - 4} y={y(v) + 3} textAnchor="end" className="rp__axis">{v === 0 ? "0K" : "10K"}</text>
                </g>
              ))}
              {LOCATION_MONTHS.map((m, i) => (
                <g key={i}>
                  <rect x={pad.l + step * i + 2} width={step * 0.42} y={y(m.cur)} height={H - pad.b - y(m.cur)} fill={PURPLE} />
                  <rect x={pad.l + step * i + 2 + step * 0.44} width={step * 0.42} y={y(m.prev)} height={H - pad.b - y(m.prev)} fill={ORANGE} />
                  <text x={pad.l + step * i + step / 2} y={H - 12} textAnchor="middle" className="rp__axis" style={{ fontSize: 8 }}>{months[["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(m.m)]}</text>
                </g>
              ))}
            </svg>
          </Area>
        </div>

        <div className="lo__right">
          <div className="lo__kpis">
            <div className="lo__kpi"><span>{L.t("avgEntrances")}</span><b>{f.compact(LOCATION_KPIS.entrances)}</b></div>
            <div className="lo__kpi"><span>{L.t("avgShops")}</span><b>{f.num(LOCATION_KPIS.shops)}</b></div>
            <div className="lo__kpi"><span>{L.t("avgM2")}</span><b>{f.num(LOCATION_KPIS.perM2, 2)}</b></div>
          </div>
          <Area id="sensors" n={2} focus={focus} className="rp__card">
            <p className="lo__h">{L.t("bySensor")}</p>
            <table className="rp__table lo__table">
              <thead><tr><th>{L.t("sensorName")}</th><th>{L.t("selectedPeriod")}</th><th>{L.t("minus1")}</th><th>{L.t("minus2")}</th><th>{L.t("sqm")}</th><th>{L.t("perSqm")}</th></tr></thead>
              <tbody>
                {LOCATION_SENSORS.map((s) => (
                  <tr key={s.name}><td>{s.name}</td><td>{f.num(s.sel)}</td><td>{f.num(s.y1)}</td><td>{f.num(s.y2)}</td><td>{f.num(s.m2)}</td><td>{f.num(s.perM2, 2)}</td></tr>
                ))}
              </tbody>
            </table>
          </Area>
          <Area id="rhythm" n={3} focus={focus} className="rp__card">
            <p className="lo__h">{L.t("perHour")}</p>
            <table className="rp__table lo__heat">
              <thead><tr><th>{L.t("dayName")}</th>{LOCATION_HOURS.map((h) => <th key={h}>{String(h).padStart(2, "0")}:00</th>)}</tr></thead>
              <tbody>
                {LOCATION_HEAT.map((row, d) => (
                  <tr key={d}>
                    <td>{days[d]}</td>
                    {row.map((v, i) => <td key={i} style={{ background: `rgba(176, 80, 184, ${(0.08 + (v / heatMax) * 0.8).toFixed(2)})`, color: v / heatMax > 0.6 ? "#fff" : "#252423" }}>{f.num(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </Area>
        </div>
      </div>
      <div className="lo__foot" aria-hidden="true">
        {tabs.map((t, i) => <span key={t} className={i === 2 ? "is-active" : undefined}>{t}</span>)}
      </div>
    </Frame>
  );
}
