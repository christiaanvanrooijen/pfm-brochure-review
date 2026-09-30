/**
 * Illustrative reporting fixture for the "What you get" spike on the Shopping
 * Centre catchment scene.
 *
 * Everything here is invented for a fictional centre, Centrum Lindenhaven. The
 * structure follows what the catchment report actually shows — postcode reach,
 * visit pattern, change against last year — but no value is taken from a real
 * report. The map is a stylised PC4 grid, not a geographic map: one hexagon
 * stands for one postcode area.
 *
 * The data is generated once, deterministically, so every render and every
 * screenshot shows the same picture.
 */

export const SPECIMEN_LOCATION = "Centrum Lindenhaven";
export const SPECIMEN_PERIOD = "Q1 2026";
export const SPECIMEN_COMPARE = "Q1 2025";

export type DriveBand = "0–10 min" | "10–20 min" | "20–30 min" | "30+ min";
export const DRIVE_BANDS: readonly DriveBand[] = ["0–10 min", "10–20 min", "20–30 min", "30+ min"];

export interface PostcodeCell {
  postcode: string;
  /** Hex centre in the map's own unit space (the centre sits at 0,0). */
  x: number;
  y: number;
  /** Drive time from the centre, in minutes. */
  minutes: number;
  band: DriveBand;
  population: number;
  /** Share of all centre visits in the period, in percent. */
  share: number;
  /** Residents who visited at least once in the period, in percent. */
  penetration: number;
  /** Average visits per visiting resident per month. */
  frequency: number;
  /** Change in visits against the comparison period, in percent. */
  change: number;
}

/** Small deterministic PRNG (mulberry32), so the fixture never shifts. */
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

const round = (value: number, digits = 1) => {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
};

function bandFor(minutes: number): DriveBand {
  if (minutes < 10) return "0–10 min";
  if (minutes < 20) return "10–20 min";
  if (minutes < 30) return "20–30 min";
  return "30+ min";
}

function build(): PostcodeCell[] {
  const random = rng(20260329);
  const SQRT3 = Math.sqrt(3);
  const RADIUS = 9;
  // The motorway runs roughly west-south-west to east-north-east, so drive time
  // grows more slowly along it — which is what stretches the catchment.
  const ROAD = -0.35;
  // PC4 series by direction, so neighbouring areas read as one town.
  const SERIES = [5211, 5261, 5301, 5351, 5401, 5451, 5501, 5551];
  const counters = SERIES.map(() => 0);

  const raw: Array<Omit<PostcodeCell, "share" | "postcode"> & { weight: number; sector: number }> = [];

  for (let q = -RADIUS; q <= RADIUS; q += 1) {
    for (let r = -RADIUS; r <= RADIUS; r += 1) {
      const s = -q - r;
      const steps = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
      if (steps > RADIUS) continue;

      const x = SQRT3 * (q + r / 2);
      const y = 1.5 * r;
      const angle = Math.atan2(y, x);

      // An irregular outline, so the catchment does not read as a hexagon.
      const edge =
        6.6 +
        1.5 * Math.cos(2 * (angle - ROAD)) +
        0.9 * Math.sin(3 * angle + 1.9) +
        0.6 * Math.cos(5 * angle + 0.4);
      const reach = Math.hypot(x, y) / 1.5;
      const jitter = random();
      if (reach > edge + (jitter - 0.5) * 1.2) continue;

      const along = Math.abs(Math.cos(angle - ROAD));
      const minutes = Math.max(2, reach * (6.2 - 2.2 * along) + (random() - 0.5) * 3);

      const population = Math.round(5200 + random() * 17800 - Math.min(reach, 7) * 380);
      const penetration = Math.max(2.5, 71 * Math.exp(-minutes / 15) + (random() - 0.5) * 8);
      const frequency = Math.max(0.6, 2.9 * Math.exp(-minutes / 24) + (random() - 0.5) * 0.35);

      // The catchment is growing to the north-east (a new residential district)
      // and losing ground in the south-west, where a competitor opened.
      const drift = Math.cos(angle - -0.8) * Math.min(1, minutes / 14);
      const change = 16 * drift + (random() - 0.5) * 9;

      const sector = Math.floor((((angle + Math.PI) / (2 * Math.PI)) * SERIES.length) % SERIES.length);

      raw.push({
        x,
        y,
        minutes: round(minutes, 0),
        band: bandFor(minutes),
        population,
        penetration: round(penetration),
        frequency: round(frequency, 2),
        change: round(change),
        weight: population * (penetration / 100) * frequency,
        sector,
      });
    }
  }

  const total = raw.reduce((sum, cell) => sum + cell.weight, 0);

  // Postcodes count up outward from the centre within each direction.
  return raw
    .sort((a, b) => a.minutes - b.minutes || b.weight - a.weight)
    .map(({ weight, sector, ...cell }) => {
      const postcode = String(SERIES[sector] + counters[sector]);
      counters[sector] += 1 + (counters[sector] % 3 === 2 ? 1 : 0);
      return { ...cell, postcode, share: round((weight / total) * 100, 2) };
    });
}

export const POSTCODES: readonly PostcodeCell[] = build();

export const BAND_SHARES: ReadonlyArray<{ band: DriveBand; share: number }> = DRIVE_BANDS.map(
  (band) => ({
    band,
    share: round(
      POSTCODES.filter((cell) => cell.band === band).reduce((sum, cell) => sum + cell.share, 0),
      0,
    ),
  }),
);

export const TOP_POSTCODES = [...POSTCODES].sort((a, b) => b.share - a.share).slice(0, 7);

export const GROWING = [...POSTCODES]
  .filter((cell) => cell.share > 0.4)
  .sort((a, b) => b.change - a.change)
  .slice(0, 4);
export const DECLINING = [...POSTCODES]
  .filter((cell) => cell.share > 0.4)
  .sort((a, b) => a.change - b.change)
  .slice(0, 4);

export const GROWING_COUNT = POSTCODES.filter((cell) => cell.change >= 3).length;
export const DECLINING_COUNT = POSTCODES.filter((cell) => cell.change <= -3).length;

/** Headline visit KPIs, against the comparison period. */
export const VISIT_KPIS = [
  { id: "duration", label: "Visit duration", value: "58 min", previous: "61 min", delta: "−3 min", direction: "down" },
  { id: "frequency", label: "Visit frequency", value: "1.72", previous: "1.66", delta: "+3.6%", direction: "up" },
  { id: "unique", label: "Unique visitors", value: "57.4%", previous: "55.9%", delta: "+1.5pp", direction: "up" },
  { id: "long", label: "Long visits (1h+)", value: "24.1%", previous: "26.0%", delta: "−1.9pp", direction: "down" },
] as const;

/** Share of weekly visits by day, this period against the comparison period. */
export const DAY_OF_WEEK = [
  { day: "Mon", share: 10.8, previous: 11.4 },
  { day: "Tue", share: 11.9, previous: 12.2 },
  { day: "Wed", share: 13.6, previous: 13.1 },
  { day: "Thu", share: 13.9, previous: 14.4 },
  { day: "Fri", share: 15.7, previous: 15.1 },
  { day: "Sat", share: 21.4, previous: 20.3 },
  { day: "Sun", share: 12.7, previous: 13.5 },
] as const;

/** Weekly visits, indexed to the comparison period's average (= 100). */
export const WEEKLY_INDEX: ReadonlyArray<{ week: number; current: number; previous: number }> = (() => {
  const random = rng(7);
  return Array.from({ length: 13 }, (_, i) => {
    const season = 4 * Math.sin((i / 12) * Math.PI) - 2;
    const previous = round(100 + season + (random() - 0.5) * 5, 0);
    const current = round(previous + 1 + i * 0.75 + (random() - 0.5) * 4, 0);
    return { week: i + 1, current, previous };
  });
})();
