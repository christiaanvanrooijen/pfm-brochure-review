/**
 * Illustrative fixture for the retail store report specimens ("What you get"
 * on Retail · Conversion and Retail · Visitor composition).
 *
 * Everything here is invented. The store is fictional (Northstar Retail Group,
 * the go-demo's fictional retailer) and no value is taken from a real report:
 * the shapes follow what the store report shows — daily footfall against
 * conversion, the opportunity cards, the demographic split by hour and week —
 * and the values are generated once from a fixed seed, so every render and
 * every screenshot is identical.
 *
 * The opportunity figures are not typed in: they are derived from the same
 * daily rows, so the cards and the chart beside them always agree.
 */

export const STORE_REGION = "Benelux";
export const STORE_NAME = "Northstar Utrecht";
export const STORE_REFRESH = "01-04-2026 06:00 UTC";
/** March 2026. 1 March 2026 is a Sunday. */
export const STORE_YEAR = 2026;
export const STORE_MONTH_INDEX = 2;

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
const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

/* --------------------------------------------------------------- INSIGHTS */

export interface StoreDay {
  day: number; // 1..31
  weekday: number; // 0 = Sunday
  footfall: number;
  /** Transactions ÷ footfall, in percent. */
  conversion: number;
  /** Average transaction value, in euro. */
  atv: number;
}

export const STORE_DAYS: readonly StoreDay[] = (() => {
  const random = rng(20260331);
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const weekday = i % 7; // 1 March is a Sunday
    const base = weekday === 6 ? 1180 : weekday === 0 ? 360 : weekday === 5 ? 720 : 520;
    const footfall = Math.round(base * (0.86 + random() * 0.28));
    // Busy days convert worse: the store fills faster than staff can serve it.
    const crowd = footfall / 1200;
    const conversion = round(21 - crowd * 9 + (random() - 0.5) * 5, 1);
    const atv = round(54 + (random() - 0.5) * 22, 2);
    return { day, weekday, footfall, conversion, atv };
  });
})();

const totalFootfall = STORE_DAYS.reduce((s, d) => s + d.footfall, 0);
const transactions = STORE_DAYS.reduce((s, d) => s + (d.footfall * d.conversion) / 100, 0);
const turnover = STORE_DAYS.reduce((s, d) => s + ((d.footfall * d.conversion) / 100) * d.atv, 0);

export const STORE_AVG_CONVERSION = round((transactions / totalFootfall) * 100, 1);
export const STORE_AVG_ATV = round(turnover / transactions, 2);

/** What a day turned over, and what it would have at the period's average conversion and ATV. */
export const STORE_DAY_VALUE = STORE_DAYS.map((d) => {
  const actual = (d.footfall * d.conversion * d.atv) / 100;
  const potential = (d.footfall * STORE_AVG_CONVERSION * STORE_AVG_ATV) / 100;
  return { ...d, actual: round(actual), potential: round(potential), missed: round(Math.max(0, potential - actual)) };
});

/** The day with the most turnover left on the table. */
export const STORE_BEST_OPPORTUNITY = [...STORE_DAY_VALUE].sort((a, b) => b.missed - a.missed)[0];

/* ----------------------------------------------------------- DEMOGRAPHICS */

export const STORE_DEMO_KPIS = {
  groupSize: { value: 1.38, delta: 3.1 },
  star: { value: 3.24, delta: 4.4 },
  capture: { value: 12.6, delta: 0.4 },
  adult: { value: 93.6, delta: -0.4 },
  child: { value: 6.4, delta: 0.4 },
  men: { value: 42.8, delta: 1.1 },
  women: { value: 57.2, delta: -1.1 },
} as const;

/** Opening hours shown on the hourly charts. */
export const STORE_HOURS = [10, 11, 12, 13, 14, 15, 16, 17] as const;

export const STORE_HOURLY = (() => {
  const random = rng(4917);
  const shape = [0.45, 0.72, 0.98, 1.0, 0.94, 0.9, 0.84, 0.56];
  return STORE_HOURS.map((hour, i) => ({
    hour,
    footfall: Math.round(2900 * shape[i] * (0.92 + random() * 0.16)),
    star: round(2.1 + shape[i] * 1.9 + (random() - 0.5) * 0.5, 2),
    men: round(40 + (random() - 0.5) * 6, 1),
    child: round(4 + (i > 4 ? 4 : 1) * random(), 1),
  }));
})();

export const STORE_GROUP_HOURS = [10, 12, 14, 16, 18, 20] as const;
/** Average group size, per weekday (Monday first) and two-hour block. */
export const STORE_GROUP_GRID: readonly (readonly number[])[] = (() => {
  const random = rng(77031);
  return Array.from({ length: 7 }, (_, dow) =>
    STORE_GROUP_HOURS.map((h) => {
      const weekend = dow >= 5 ? 0.35 : 0;
      const afternoon = h >= 14 && h <= 18 ? 0.18 : 0;
      return round(1.12 + weekend + afternoon + random() * 0.32, 2);
    }),
  );
})();

/** Rolling period: the last six ISO weeks. */
export const STORE_WEEKS = (() => {
  const random = rng(31415);
  const starts = ["23/02/2026", "02/03/2026", "09/03/2026", "16/03/2026", "23/03/2026", "30/03/2026"];
  return starts.map((start, i) => {
    const men = round(41 + random() * 4, 1);
    const child = round(5.4 + random() * 2, 1);
    return {
      week: `W${9 + i} - ${start}`,
      // The last week is only two days old on refresh.
      footfall: i === 5 ? Math.round(1700 + random() * 200) : Math.round(4300 + random() * 600),
      adults: round(100 - child, 1),
      child,
      men,
      women: round(100 - men, 1),
      groupSize: round(1.31 + random() * 0.14, 2),
    };
  });
})();
