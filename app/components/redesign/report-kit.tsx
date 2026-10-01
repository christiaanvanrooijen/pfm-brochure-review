"use client";

/**
 * Shared base for the "What you get" report specimens.
 *
 * Every specimen is a fixed 1100 × 620 page scaled to the room it gets (width
 * left of the reading column, height left above the journey bar and rail), so
 * opening one never scrolls the scene and its proportions never reflow into
 * something the real report does not look like. `Area` is the reading guide's
 * handle: it dims everything but the focused part and carries the numbered
 * marker. Nothing here adds a feature a report does not have.
 */

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import type { Locale } from "../../i18n/locales";
import "./report-specimens.css";

export const CANVAS = { w: 1100, h: 620 };
export const PURPLE = "#7b2382";
export const PINK = "#d6456e";
export const ORANGE = "#f7a46b";
export const LILAC = "#c9a0d4";

export function useFitScale(host: RefObject<HTMLDivElement | null>) {
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

export function makeFmt(numberLocale: string, currency = "EUR") {
  const num = (v: number, d = 0) =>
    v.toLocaleString(numberLocale, { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (v: number, d = 1) => `${num(v, d)} %`;
  const signed = (v: number, d = 1) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${num(Math.abs(v), d)}%`;
  const eur = (v: number, d = 2) =>
    v.toLocaleString(numberLocale, { style: "currency", currency, minimumFractionDigits: d, maximumFractionDigits: d });
  const compact = (v: number) =>
    v >= 1e6 ? `${num(v / 1e6, 2)}M` : v >= 1e3 ? `${num(v / 1e3, v >= 1e5 ? 0 : 1)}K` : num(v);
  return { num, pct, signed, eur, compact };
}
export type Fmt = ReturnType<typeof makeFmt>;

export function Frame({
  locale,
  focus,
  className = "",
  children,
}: {
  locale: Locale;
  focus: string | null;
  className?: string;
  children: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const scale = useFitScale(host);
  return (
    <div className="rp-host" ref={host} style={{ width: CANVAS.w * scale, height: CANVAS.h * scale }}>
      <div
        className={`rp ${className}`}
        lang={locale}
        data-focus={focus ?? undefined}
        style={{ width: CANVAS.w, height: CANVAS.h, transform: `scale(${scale})` } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** A part of the page the reading guide can point at. */
export function Area({
  id,
  n,
  focus,
  className = "",
  style,
  children,
}: {
  id: string;
  n?: number;
  focus: string | null;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const state = focus ? (focus === id ? " is-spot" : " is-dim") : "";
  return (
    <div className={`rp__area ${className}${state}`} style={style}>
      {n !== undefined && (
        <span className={`rp__marker${focus === id ? " is-active" : ""}`} aria-hidden="true">
          {n}
        </span>
      )}
      {children}
    </div>
  );
}

/** The report's Day … Custom (or similar) bar with one selected. */
export function Tabs({ items, active, className = "" }: { items: readonly string[]; active: number; className?: string }) {
  return (
    <nav className={`rp__tabs ${className}`} style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }} aria-hidden="true">
      {items.map((t, i) => (
        <span key={t} className={i === active ? "is-active" : undefined}>
          {t}
        </span>
      ))}
    </nav>
  );
}

export function Donut({ parts, size = 120, hole = 0.58 }: { parts: ReadonlyArray<{ v: number; c: string }>; size?: number; hole?: number }) {
  const total = parts.reduce((s, p) => s + p.v, 0);
  const r = size / 2;
  // Start angle of each slice, computed up front: nothing is reassigned while rendering.
  const starts = parts.map((_, i) => -Math.PI / 2 + (parts.slice(0, i).reduce((s, p) => s + p.v, 0) / total) * Math.PI * 2);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="rp__donut" aria-hidden="true">
      {parts.map((p, i) => {
        const a0 = starts[i];
        const a1 = a0 + (p.v / total) * Math.PI * 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const d = `M${r + r * Math.cos(a0)},${r + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${r + r * Math.cos(a1)},${r + r * Math.sin(a1)} L${r + r * hole * Math.cos(a1)},${r + r * hole * Math.sin(a1)} A${r * hole},${r * hole} 0 ${large} 0 ${r + r * hole * Math.cos(a0)},${r + r * hole * Math.sin(a0)} Z`;
        return <path key={p.c + p.v} d={d} fill={p.c} />;
      })}
    </svg>
  );
}

export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
