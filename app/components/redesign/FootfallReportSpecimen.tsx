"use client";

/**
 * "What you get" for Shopping Centre · Entrances — the footfall report's
 * In-Depth page: footfall by sensor against the compared period, the weekly
 * and daily rhythm, and the rolling months with year-to-date.
 * The centre is fictional; the figures are an illustrative fixture.
 */

import { Area, Frame, Tabs, PURPLE, ORANGE, makeFmt } from "./report-kit";
import { labels } from "./report-copy";
import {
  FOOTFALL_HOURLY, FOOTFALL_MONTHS, FOOTFALL_SENSORS, FOOTFALL_TOTAL, FOOTFALL_WEEKDAYS,
} from "../../content/output-specimens/report-fixtures";
import type { Locale } from "../../i18n/locales";

export function FootfallReportSpecimen({ locale, focus = null }: { locale: Locale; focus?: string | null }) {
  const L = labels(locale);
  const f = makeFmt(L.numberLocale);
  const days = L.list("weekdays");
  const months = L.list("months");
  const tint = (c: number) =>
    c >= 0 ? `rgba(46, 158, 87, ${Math.min(0.55, 0.12 + c / 70).toFixed(2)})` : `rgba(209, 52, 56, ${Math.min(0.65, 0.12 + -c / 60).toFixed(2)})`;
  const pc = (c: number) => <td className="ff__pc" style={{ background: tint(c) }}>{f.num(c, 1)} %</td>;

  // hourly area chart
  const W = 470;
  const H = 150;
  const pad = { l: 38, r: 10, t: 8, b: 20 };
  const x = (i: number) => pad.l + ((W - pad.l - pad.r) / (FOOTFALL_HOURLY.length - 1)) * i;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / 12000);
  const base = y(0);
  const path = (key: "selected" | "compared") =>
    `M${x(0)},${base} ${FOOTFALL_HOURLY.map((h, i) => `L${x(i)},${y(h[key])}`).join(" ")} L${x(FOOTFALL_HOURLY.length - 1)},${base} Z`;

  return (
    <Frame locale={locale} focus={focus} className="ff">
      <header className="ff__top">
        <p className="ff__refresh">{L.t("refresh")}: 01-10-2026 06:00 UTC</p>
        <Tabs items={[L.t("overview"), L.t("inDepth")]} active={1} className="ff__tabs" />
      </header>
      <div className="ff__body">
        <aside className="ff__slicers">
          {[[L.t("year"), L.t("currentYear")], [L.t("comparedYear"), "2025"], [L.t("month"), L.t("currentMonth")], [L.t("type"), L.t("people")], [L.t("site"), "site"]].map(([k, v]) => (
            <div key={k} className="ff__slicer"><p>{k}</p><span className="rp__select">{v}</span></div>
          ))}
        </aside>
        <div className="ff__main">
          <div className="ff__grid">
            <div className="ff__col ff__col--l">
              <Area id="pattern" n={2} focus={focus} className="rp__card">
                <h4>{L.t("ffDay")}</h4>
                <table className="rp__table">
                  <thead><tr><th>{L.t("dayName")}</th><th>{L.t("selectedPeriod")}</th><th>{L.t("comparedPeriod")}</th><th>{L.t("change")}</th></tr></thead>
                  <tbody>
                    {FOOTFALL_WEEKDAYS.rows.map((r, i) => (
                      <tr key={days[i]}><td>{days[i]}</td><td>{f.num(r.selected)}</td><td>{f.num(r.compared)}</td>{pc(r.change)}</tr>
                    ))}
                    <tr className="ff__total"><td>{L.t("total")}</td><td>{f.num(FOOTFALL_WEEKDAYS.total.selected)}</td><td>{f.num(FOOTFALL_WEEKDAYS.total.compared)}</td>{pc(FOOTFALL_WEEKDAYS.total.change)}</tr>
                  </tbody>
                </table>
              </Area>
              <Area id="sensor" n={1} focus={focus} className="rp__card">
                <h4>{L.t("ffSensor")}</h4>
                <table className="rp__table">
                  <thead><tr><th>{L.t("sensor")}</th><th>{L.t("selectedPeriod")}</th><th>{L.t("comparedPeriod")}</th><th>{L.t("change")}</th></tr></thead>
                  <tbody>
                    {FOOTFALL_SENSORS.map((s) => (
                      <tr key={s.name}><td>{s.name}</td><td>{f.num(s.selected)}</td><td>{f.num(s.compared)}</td>{pc(s.change)}</tr>
                    ))}
                    <tr className="ff__total"><td>{L.t("total")}</td><td>{f.num(FOOTFALL_TOTAL.selected)}</td><td>{f.num(FOOTFALL_TOTAL.compared)}</td>{pc(FOOTFALL_TOTAL.change)}</tr>
                  </tbody>
                </table>
              </Area>
            </div>
            <div className="ff__col ff__col--r">
              <Area id="pattern" focus={focus} className="rp__card">
                <h4>{L.t("ffHour")}</h4>
                <p className="rp__legend"><i style={{ background: PURPLE }} /> {L.t("selectedPeriod")} <i style={{ background: ORANGE }} /> {L.t("comparedPeriod")}</p>
                <svg viewBox={`0 0 ${W} ${H}`} className="rp__svg" role="img" aria-label={L.t("ffHour")}>
                  {[0, 10000].map((v) => (
                    <g key={v}>
                      <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="rp__grid" />
                      <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" className="rp__axis">{v === 0 ? "0K" : "10K"}</text>
                    </g>
                  ))}
                  <path d={path("compared")} fill={ORANGE} fillOpacity={0.45} stroke={ORANGE} strokeWidth={1.8} />
                  <path d={path("selected")} fill={PURPLE} fillOpacity={0.3} stroke={PURPLE} strokeWidth={2} />
                  {FOOTFALL_HOURLY.map((h, i) => <text key={h.hour} x={x(i)} y={H - 4} textAnchor="middle" className="rp__axis">{h.hour}</text>)}
                </svg>
              </Area>
              <Area id="rolling" n={3} focus={focus} className="rp__card">
                <h4>{L.t("ffRolling")}</h4>
                <table className="rp__table">
                  <thead><tr><th>{L.t("monthH")}</th><th>{L.t("selShort")}</th><th>{L.t("compShort")}</th><th>%</th><th>{L.t("ytd")}</th><th>{L.t("comparedYtd")}</th><th>%</th></tr></thead>
                  <tbody>
                    {FOOTFALL_MONTHS.map((m) => (
                      <tr key={m.month}>
                        <td>{months[["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"].indexOf(m.month)]} 2026</td>
                        <td>{f.num(m.selected)}</td><td>{f.num(m.compared)}</td>{pc(m.change)}<td>{f.num(m.ytd)}</td><td>{f.num(m.cytd)}</td>{pc(m.ytdChange)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Area>
            </div>
          </div>
          <Tabs items={L.list("periods")} active={2} className="ff__periods" />
        </div>
      </div>
    </Frame>
  );
}
