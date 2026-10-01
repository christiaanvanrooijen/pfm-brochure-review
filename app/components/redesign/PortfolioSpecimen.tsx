"use client";

/**
 * "What you get" for Shopping Centre · Brand flow and Zone & anchor exposure —
 * two pages of the portfolio report: Retailer (capture rate, brand affinity)
 * and Mall (the centre at a glance, where visitors come from, the floor plan).
 * Group, regions, centres, brands and municipalities are fictional; the plan
 * and the maps are stylised stand-ins with no third-party basemap.
 */

import { Area, Donut, Frame, PURPLE, ORANGE, makeFmt, seeded } from "./report-kit";
import { labels, type L } from "./report-copy";
import {
  BRAND_AFFINITY, BRAND_TOTAL, CAPTURE_LINE, MALL, PORTFOLIO_NAME, PORTFOLIO_TREE, RETAILER_KPIS, SCATTER,
} from "../../content/output-specimens/report-fixtures";
import type { Locale } from "../../i18n/locales";

export type PortfolioPage = "retailer" | "mall";

function Chrome({ L, page }: { L: L; page: PortfolioPage }) {
  const nav = L.list("poTabs");
  return (
    <header className="po__head">
      <div>
        <h3 className="po__title">{L.t("poTitle")}</h3>
        <p className="po__sub">{PORTFOLIO_NAME}</p>
      </div>
      <nav className="po__nav" aria-hidden="true">
        {nav.map((n, i) => <span key={n} className={i === (page === "mall" ? 2 : 3) ? "is-active" : undefined}>{n}</span>)}
      </nav>
      <div className="po__date" aria-hidden="true">
        <span>{L.t("lastN")}</span><span>1</span><span>{L.t("months1")}</span>
      </div>
    </header>
  );
}

function Tree({ L }: { L: L }) {
  return (
    <div className="po__tree">
      <div><i className="po__box" />{L.t("selectAll")}</div>
      {PORTFOLIO_TREE.map((r) => (
        <div key={r.region}>
          <div className="is-reg"><i className="po__box on" />▸ {r.region}</div>
          {r.open && r.malls.map((m, i) => <div key={m} className="is-sub"><i className={`po__box${i % 3 !== 2 ? " on" : ""}`} />{m}</div>)}
        </div>
      ))}
    </div>
  );
}

function RetailerPage({ L, f, focus }: { L: L; f: ReturnType<typeof makeFmt>; focus: string | null }) {
  const W = 300;
  const H = 230;
  const pad = { l: 34, r: 12, t: 8, b: 26 };
  const sx = (v: number) => pad.l + ((W - pad.l - pad.r) * (v - 0)) / 100;
  const sy = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - (v - 20) / 17);
  const LW = 520;
  const LH = 150;
  const lx = (i: number) => 38 + ((LW - 50) / (CAPTURE_LINE.length - 1)) * i;
  const ly = (v: number) => 12 + (LH - 36) * (1 - (v - 4.74) / 0.2);
  const avg = ly(4.84);
  return (
    <div className="po__ret">
      <Area id="capture" n={1} focus={focus} className="po__hero">
        <div>
          <small>{L.t("grossCapture")}</small><b>{f.num(RETAILER_KPIS.gross, 2)}%</b>
          <small style={{ display: "block", marginTop: 14 }}><b style={{ display: "inline", fontSize: 12 }}>{f.num(RETAILER_KPIS.yoy, 2)}%</b> {L.t("vsYoy")}</small>
        </div>
        <div><small>{L.t("netCapture")}</small><b>{f.num(RETAILER_KPIS.net, 2)}%</b></div>
        <div className="po__sub-kpis">
          <div className="po__sub-kpi"><small>{L.t("retVisitsM2")}</small><b>{f.num(RETAILER_KPIS.perM2, 2)}</b></div>
          <div className="po__sub-kpi"><small>{L.t("shopsPerVisit")}</small><b>{f.num(RETAILER_KPIS.shopsPerVisit, 2)}</b></div>
        </div>
      </Area>
      <div className="rp__card tree"><Tree L={L} /></div>
      <div className="rp__card" style={{ justifyContent: "center" }}>
        <h4 style={{ fontSize: 12 }}>{L.t("retailerCategory")}</h4>
        <span className="rp__select">{L.t("all")}</span>
      </div>
      <div className="rp__card">
        <h4 style={{ fontSize: 12 }}>{L.t("scatter")}</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="rp__svg" role="img" aria-label={L.t("scatter")}>
          {[25, 30, 35].map((v) => <text key={v} x={pad.l - 5} y={sy(v) + 3} textAnchor="end" className="rp__axis">{v}</text>)}
          {SCATTER.map((p, i) => <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={p.r} fill={p.c} fillOpacity={0.8} />)}
          <text x={W / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 10 }}>{L.t("retVisitsM2")}</text>
        </svg>
      </div>
      <div className="right">
        <div className="rp__card"><h4 style={{ fontSize: 14 }}>{L.t("brandSearch")}</h4><span className="rp__select" style={{ marginTop: 5 }}>+4</span></div>
        <Area id="affinity" n={2} focus={focus} className="rp__card">
          <h4 style={{ fontSize: 14 }}>{L.t("brandAffinity")}</h4>
          <table className="rp__table po__brand">
            <thead><tr><th>{L.t("category")}</th><th>{L.t("name")}</th><th>{L.t("location")}</th><th>{L.t("tradeArea")}</th><th>{L.t("diff")}</th></tr></thead>
            <tbody>
              {BRAND_AFFINITY.map((b) => (
                <tr key={b.name}>
                  <td>{b.cat}</td><td>{b.name}</td><td>{f.num(b.loc, 2)}%</td><td>{f.num(b.area, 2)}%</td>
                  <td style={{ background: b.diff > 0 ? `rgba(247,164,107,${Math.min(0.8, 0.2 + b.diff / 30).toFixed(2)})` : "transparent" }}>{b.diff > 0 ? "+" : ""}{f.num(b.diff, 1)}%</td>
                </tr>
              ))}
              <tr className="tot"><td>{L.t("total")}</td><td /><td>{f.num(BRAND_TOTAL.loc, 2)}%</td><td>{f.num(BRAND_TOTAL.area, 2)}%</td><td>+{f.num(BRAND_TOTAL.diff, 1)}%</td></tr>
            </tbody>
          </table>
        </Area>
        <Area id="trend" n={3} focus={focus} className="rp__card">
          <h4 style={{ fontSize: 14 }}>{L.t("grossRate")}</h4>
          <svg viewBox={`0 0 ${LW} ${LH}`} className="rp__svg" role="img" aria-label={L.t("grossRate")}>
            {[4.75, 4.8, 4.85, 4.9, 4.95].map((v) => <text key={v} x={32} y={ly(v) + 3} textAnchor="end" className="rp__axis">{f.num(v, 2)}%</text>)}
            <path d={CAPTURE_LINE.map((v, i) => `${i ? "L" : "M"}${lx(i)},${ly(v)}`).join(" ")} fill="none" stroke={PURPLE} strokeWidth={2.4} />
            <line x1={38} x2={LW - 12} y1={avg} y2={avg} stroke={PURPLE} strokeDasharray="1 4" strokeWidth={2.4} />
          </svg>
        </Area>
      </div>
    </div>
  );
}

/** A stylised stand-in for a basemap choropleth: cells in an ellipse, no tiles. */
function CellMap({ seed, hue }: { seed: number; hue: "visit" | "share" }) {
  const random = seeded(seed);
  const cells: Array<{ x: number; y: number; c: string }> = [];
  for (let gy = 0; gy < 11; gy += 1) {
    for (let gx = 0; gx < 11; gx += 1) {
      const dx = (gx - 5) / 5.4;
      const dy = (gy - 5) / 5.4;
      if (dx * dx + dy * dy > 1) continue;
      const v = random();
      const c = hue === "visit"
        ? v > 0.66 ? "#8fd18a" : v > 0.33 ? "#d8e07a" : "#e9a15c"
        : v > 0.66 ? "#e4786b" : v > 0.33 ? "#e7c26a" : "#8fd18a";
      cells.push({ x: gx, y: gy, c });
    }
  }
  return (
    <svg viewBox="0 0 110 110" className="rp__svg" aria-hidden="true">
      <rect width="110" height="110" fill="#cfe6ee" />
      {cells.map((c) => <rect key={`${c.x}-${c.y}`} x={c.x * 10} y={c.y * 10} width={9} height={9} fill={c.c} stroke="#fff" strokeWidth={0.4} />)}
    </svg>
  );
}

function MallPage({ L, f, focus }: { L: L; f: ReturnType<typeof makeFmt>; focus: string | null }) {
  const random = seeded(7788);
  const [adultL, kidL] = L.list("adultLegend");
  const [femL, maleL] = L.list("sexLegend");
  const plan = Array.from({ length: 44 }, (_, i) => {
    const row = i % 2;
    const col = Math.floor(i / 2);
    const v = random();
    return { x: 6 + col * 12 + (row ? 3 : 0), y: 24 + row * 20 + Math.sin(col / 3) * 6, w: 11 + random() * 3, h: 17, c: v > 0.82 ? "#f7a46b" : v > 0.5 ? "#d6456e" : v > 0.25 ? "#a1366f" : "#7b2382" };
  });
  const kpis6: Array<[string, string]> = [
    [L.t("retailers"), f.num(MALL.retailers)], [L.t("visitsM2"), f.num(MALL.perM2, 2)], [L.t("avgGroup"), f.num(MALL.group, 2)],
    [L.t("rent"), f.signed(MALL.rent)], [L.t("grossCapture"), f.pct(MALL.gross, 2)], [L.t("netCapture"), f.pct(MALL.net, 2)],
  ];
  const ev = (e: { name: string; v: number }) => (
    <tr key={e.name}><td>{e.name}</td><td>{f.pct(e.v)}</td><td><i className="po__bar" style={{ width: `${e.v}%` }} /></td></tr>
  );
  const muni = (rows: ReadonlyArray<{ name: string; change: number }>, head: string) => (
    <div className="rp__card">
      <table><thead><tr><th>{L.t("muni")}</th><th>{L.t("chg")}</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.name}><td>{r.name}</td><td className={r.change >= 0 ? "is-up" : "is-down"}>{f.signed(r.change)} {r.change >= 0 ? "▲" : "▼"}</td></tr>)}</tbody>
      </table>
      <p className="rp__note" style={{ textAlign: "center", marginTop: 3 }}>{head}</p>
    </div>
  );
  return (
    <div className="po__mall">
      <div className="po__r1">
      <Area id="headline" n={1} focus={focus} className="hero2">
        <div>
          <small>{L.t("shopsPerVisitor")}</small><b style={{ display: "block", fontSize: 44, fontWeight: 600 }}>{f.num(MALL.shopsPerVisitor, 2)}</b>
        </div>
        <div className="po__sub-kpis">
          <div className="po__sub-kpi"><small>{L.t("mallVisits")}</small> <b>{MALL.visits}</b> <small>{f.signed(MALL.visitsChange)}</small></div>
          <div className="po__sub-kpi"><small>{L.t("retailerCapture")}</small><b>{f.pct(MALL.gross, 2)}</b></div>
        </div>
      </Area>
      <Area id="headline" focus={focus} className="rp__card donut">
        <div style={{ width: 90, height: 90, margin: "0 auto" }}><Donut parts={[{ v: MALL.adult, c: PURPLE }, { v: 100 - MALL.adult, c: "#b17bc0" }]} size={90} /></div>
        <p className="rp__legend" style={{ justifyContent: "center" }}><i style={{ background: PURPLE }} /> {adultL} <i style={{ background: "#b17bc0" }} /> {kidL}</p>
      </Area>
      <Area id="headline" focus={focus} className="rp__card donut">
        <div style={{ width: 90, height: 90, margin: "0 auto" }}><Donut parts={[{ v: MALL.women, c: ORANGE }, { v: 100 - MALL.women, c: "#fbd3a8" }]} size={90} /></div>
        <p className="rp__legend" style={{ justifyContent: "center" }}><i style={{ background: ORANGE }} /> {femL} <i style={{ background: "#fbd3a8" }} /> {maleL}</p>
      </Area>
      <div className="facts">
        <div className="rp__card po__fact"><span>{L.t("visitorFreq")}</span><b>{f.num(MALL.frequency, 2)}</b></div>
        <div className="rp__card po__fact"><span>{L.t("dwell")}</span><b>{f.num(MALL.dwell, 1)} {L.t("mins")}</b></div>
      </div>
      </div>

      <div className="po__r2">
      <div className="po__kpis6">
        {kpis6.map(([k, v]) => (
          <div key={k} className="rp__card po__kpi6"><svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="6" width="22" height="18" rx="2" fill="none" stroke="#252423" strokeWidth="1.8" /><path d="M3 12h22M10 6v6" stroke="#252423" strokeWidth="1.8" /></svg><span>{k}<b>{v}</b></span></div>
        ))}
      </div>
      <Area id="reach" n={2} focus={focus} className="po__top5">
        {muni(MALL.top, L.t("top5"))}
        {muni(MALL.bottom, L.t("bottom5"))}
      </Area>
      </div>

      <div className="po__low">
        <Area id="floor" n={3} focus={focus} className="rp__card">
          <h4 style={{ fontSize: 14 }}>{L.t("level")}</h4>
          <p className="rp__note" style={{ marginBottom: 2 }}>{L.t("totalStore")}</p>
          <svg viewBox="0 0 540 70" className="rp__svg" role="img" aria-label={L.t("level")}>
            {plan.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />)}
          </svg>
          <p className="rp__note" style={{ textAlign: "right" }}>{L.t("mapNote")}</p>
        </Area>
        <Area id="floor" focus={focus} className="rp__card">
          <h4 style={{ fontSize: 14 }}>{L.t("events")}</h4>
          <table className="rp__table" style={{ marginTop: 6 }}>
            <thead><tr><th>{L.t("platform")}</th><th>{L.t("interaction")}</th><th>{L.t("chg")}</th></tr></thead>
            <tbody>{MALL.events.map(ev)}</tbody>
          </table>
        </Area>
        <Area id="reach" focus={focus} className="rp__card"><h4 style={{ fontSize: 14 }}>{L.t("visitChange")}</h4><CellMap seed={11} hue="visit" /><p className="rp__note">{L.t("mapNote")}</p></Area>
        <Area id="reach" focus={focus} className="rp__card"><h4 style={{ fontSize: 14 }}>{L.t("marketShare")}</h4><CellMap seed={12} hue="share" /><p className="rp__note">{L.t("mapNote")}</p></Area>
      </div>
    </div>
  );
}

export function PortfolioSpecimen({
  locale, page, focus = null,
}: { locale: Locale; page: PortfolioPage; focus?: string | null }) {
  const L = labels(locale);
  const f = makeFmt(L.numberLocale);
  return (
    <Frame locale={locale} focus={focus} className="po">
      <Chrome L={L} page={page} />
      {page === "retailer" ? <RetailerPage L={L} f={f} focus={focus} /> : <MallPage L={L} f={f} focus={focus} />}
    </Frame>
  );
}
