"use client";

/**
 * "What you get" for Shopping Centre · Visitor composition — the landlord
 * report's Center summary: footfall and group size with trend, the adult/child
 * and gender split, this week against last with the weather, and the day's
 * hourly contribution. Centre and owner are fictional; data is illustrative.
 */

import { Area, Donut, Frame, PINK, PURPLE, ORANGE, makeFmt } from "./report-kit";
import { labels } from "./report-copy";
import { LANDLORD } from "../../content/output-specimens/report-fixtures";
import type { Locale } from "../../i18n/locales";

const SKY = { sun: "☀", cloud: "☁", rain: "☂" } as const;

export function LandlordReportSpecimen({ locale, focus = null }: { locale: Locale; focus?: string | null }) {
  const L = labels(locale);
  const f = makeFmt(L.numberLocale);
  const tabs = L.list("llTabs");
  const [adultL, kidL] = L.list("adultLegend");
  const [femL, maleL] = L.list("sexLegend");
  const W = 600;
  const H = 230;
  const pad = { l: 34, r: 30, t: 18, b: 30 };
  const step = (W - pad.l - pad.r) / LANDLORD.days.length;
  const x = (i: number) => pad.l + step * i + step / 2;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / 32000);
  const temp = (t: number) => pad.t + (H - pad.t - pad.b) * (1 - (t - 14) / 3.4);
  const line = LANDLORD.days.map((d, i) => `${i ? "L" : "M"}${x(i)},${temp(d.temp)}`).join(" ");
  return (
    <Frame locale={locale} focus={focus} className="ll">
      <header className="ll__head">
        <h3 className="ll__title">
          {L.t("llTitle")}
          <small>October 2026</small>
        </h3>
        {/* The approved logo asset, never a redrawn one. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ll__logo" src="/assets/logo/pfm-logo-black.png" alt="PFM" width={74} height={22} />
      </header>
      <div className="ll__nav">
        <div className="ll__toggle rp__tabs" aria-hidden="true" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <span>{L.t("llPortfolio")}</span>
          <span className="is-active">{L.t("llLocation")}</span>
        </div>
        <div className="ll__body">
          <aside className="ll__side">
            <h3>{L.t("llCentre")}</h3>
            <p className="ll__owner">{L.t("llOwner")}</p>
            <div className="ll__row">
              <div><p>{L.t("year")}</p><span className="rp__select">2026</span></div>
              <div><p>{L.t("weekNum")}</p><span className="rp__select">40</span></div>
            </div>
            <p style={{ color: "#605e5c" }}>{L.t("weekStart")} 28-09-2026</p>
            <div className="ll__row"><div><p>{L.t("timeFrom")}</p></div></div>
            <div className="ll__row"><span className="rp__select">6</span><span className="rp__select">23</span></div>
            <div className="ll__slider" />
            <p style={{ textAlign: "center", fontSize: 9 }}>09:00 - 18:00</p>
          </aside>
          <div className="ll__main">
            <div className="ll__left">
              <nav className="ll__tabs" aria-hidden="true">
                {tabs.map((t, i) => <span key={t} className={i === 0 ? "is-active" : undefined}>{t}</span>)}
              </nav>
              <div className="ll__chart" style={{ display: "grid", gridTemplateRows: "auto minmax(0, 1fr)", gap: 10, minHeight: 0 }}>
                <Area id="who" n={1} focus={focus} className="ll__stats">
                  <div className="ll__stat"><span>{L.t("groupSize")}</span><b>{f.num(LANDLORD.group, 2)} <i className="ll__arrow is-down">↘</i></b></div>
                  <div className="ll__stat"><span>{L.t("centerFootfall")}</span><b>{f.compact(LANDLORD.total)} <i className="ll__arrow is-up">↗</i></b></div>
                  <div className="ll__stat ll__donut-card">
                    <h4>{L.t("adultChild")}</h4>
                    <div className="ll__donut"><Donut parts={[{ v: LANDLORD.adults, c: PURPLE }, { v: 100 - LANDLORD.adults, c: ORANGE }]} size={86} /></div>
                    <p className="rp__legend"><i style={{ background: PURPLE }} /> {adultL} <i style={{ background: ORANGE }} /> {kidL}</p>
                  </div>
                  <div className="ll__stat ll__donut-card">
                    <h4>{L.t("gender")}</h4>
                    <div className="ll__donut"><Donut parts={[{ v: 100 - LANDLORD.women, c: PURPLE }, { v: LANDLORD.women, c: PINK }]} size={86} /></div>
                    <p className="rp__legend"><i style={{ background: PINK }} /> {femL} <i style={{ background: PURPLE }} /> {maleL}</p>
                  </div>
                </Area>
                <Area id="week" n={2} focus={focus} className="rp__card ll__chart">
                  <p className="rp__legend"><i style={{ background: PURPLE }} /> {L.t("footfall")} <i style={{ background: ORANGE }} /> {L.t("footfallPrev")} <i style={{ background: "#f3c9c9" }} /> {L.t("conditions")}</p>
                  <svg viewBox={`0 0 ${W} ${H}`} className="rp__svg" role="img" aria-label={L.t("footfall")}>
                    {[0, 10000, 20000, 30000].map((v) => (
                      <text key={v} x={pad.l - 5} y={y(v) + 3} textAnchor="end" className="rp__axis">{v === 0 ? "0K" : `${v / 1000}K`}</text>
                    ))}
                    {LANDLORD.days.map((d, i) => (
                      <g key={d.label}>
                        <rect x={x(i) - step * 0.4} width={step * 0.38} y={y(d.footfall)} height={H - pad.b - y(d.footfall)} fill={PURPLE} />
                        <rect x={x(i) + step * 0.02} width={step * 0.38} y={y(d.previous)} height={H - pad.b - y(d.previous)} fill={ORANGE} />
                        <text x={x(i)} y={H - 12} textAnchor="middle" className="rp__axis">{d.label}</text>
                      </g>
                    ))}
                    <path d={line} fill="none" stroke="#f3c9c9" strokeWidth={2.2} />
                    {LANDLORD.days.map((d, i) => (
                      <g key={d.label}>
                        <rect x={x(i) - 17} y={temp(d.temp) - 8} width={34} height={14} rx={2} fill="#8a8886" />
                        <text x={x(i)} y={temp(d.temp) + 3} textAnchor="middle" className="rp__lbl">{d.temp}° {SKY[d.sky]}</text>
                      </g>
                    ))}
                  </svg>
                </Area>
              </div>
            </div>
            <Area id="hours" n={3} focus={focus} className="ll__right">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><th>{L.t("time")}</th><th>{L.t("contribution")}</th></tr></thead>
                <tbody>
                  {LANDLORD.hours.map((h) => (
                    <tr key={h.hour}>
                      <td>{String(h.hour).padStart(2, "0")}:00</td>
                      <td><div className="ll__bar" style={{ width: `${(h.v / 13) * 100}%` }}>{f.num(h.v, 1)}%</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Area>
          </div>
        </div>
      </div>
    </Frame>
  );
}
