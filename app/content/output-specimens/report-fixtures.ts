/**
 * Illustrative fixtures for the report specimens ("What you get") on the
 * Retail and Shopping Centre scenes, beyond the catchment and store reports.
 *
 * Everything here is invented. Locations, shops, brands, sensors and regions
 * are fictional; no value is taken from a real report — only the shapes and
 * ranges follow what each report shows. Derived figures (totals, changes,
 * shares) are computed from the rows beside them so a card and its chart can
 * never disagree. Generated once from fixed seeds: every render is identical.
 */

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
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

/* ------------------------------------------------- FOOTFALL REPORT (entrances) */

export const FOOTFALL_SENSORS = (() => {
  const random = rng(8810);
  const names = ["North Gate", "Station Link", "Market Hall", "Garage Link", "Park Entrance", "Boulevard Door", "Food Court Link", "Plaza Entrance", "West Bridge", "South Gate", "Terrace Door", "Canal Walk"];
  const base = [244, 150, 114, 113, 85, 64, 59, 48, 42, 35, 28, 21];
  return names.map((name, i) => {
    const selected = Math.round(base[i] * 1000 * (0.9 + random() * 0.2));
    const compared = Math.round(selected / (1 + (random() - 0.35) * 0.45));
    return { name, selected, compared, change: r1(((selected - compared) / compared) * 100) };
  });
})();
const sum = (xs: number[]) => xs.reduce((s, v) => s + v, 0);
export const FOOTFALL_TOTAL = (() => {
  const selected = sum(FOOTFALL_SENSORS.map((s) => s.selected));
  const compared = sum(FOOTFALL_SENSORS.map((s) => s.compared));
  return { selected, compared, change: r1(((selected - compared) / compared) * 100) };
})();

export const FOOTFALL_WEEKDAYS = (() => {
  const random = rng(5521);
  const base = [55.7, 46.2, 45.1, 43.5, 56.5, 90.7, 58.3];
  const rows = base.map((b) => {
    const selected = Math.round(b * 1000 * (0.97 + random() * 0.06));
    const compared = Math.round(selected / (1 + (0.02 + random() * 0.17)));
    return { selected, compared, change: r1(((selected - compared) / compared) * 100) };
  });
  const selected = Math.round(sum(rows.map((r) => r.selected)) / 7);
  const compared = Math.round(sum(rows.map((r) => r.compared)) / 7);
  return { rows, total: { selected, compared, change: r1(((selected - compared) / compared) * 100) } };
})();

export const FOOTFALL_HOURS = [8, 10, 12, 14, 16, 18, 20, 22] as const;
export const FOOTFALL_HOURLY = [0.6, 6.4, 10.4, 10.2, 8.8, 7.4, 4.2, 0.8].map((v, i) => ({
  hour: FOOTFALL_HOURS[i],
  selected: v * 1000,
  compared: v * 1000 * (0.9 + (i % 3) * 0.02),
}));

export const FOOTFALL_MONTHS = (() => {
  const random = rng(3317);
  const sel = [1416, 1472, 1445, 1640, 1688, 1670, 1890, 2228, 983];
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  let ytd = 0;
  let cytd = 0;
  const rows = sel.map((v, i) => {
    const selected = v * 1000 + Math.round(random() * 900);
    const compared = Math.round(selected / (1 + (random() - 0.3) * 0.2));
    ytd += selected;
    cytd += compared;
    return { month: names[i], selected, compared, change: r1(((selected - compared) / compared) * 100), ytd, cytd, ytdChange: r1(((ytd - cytd) / cytd) * 100) };
  });
  return rows.reverse();
})();

/* ------------------------------------------------------- LANDLORD REPORT */

export const LANDLORD = (() => {
  const random = rng(6013);
  const labels = ["Sat", "Fri", "Wed", "Mon", "Thu", "Tue", "Sun"];
  const base = [26.4, 19.0, 16.6, 15.0, 14.8, 14.4, 0.6];
  const temps = [16, 15, 16, 17, 14, 16, 17];
  const sky = ["sun", "cloud", "cloud", "rain", "rain", "cloud", "cloud"] as const;
  const days = labels.map((l, i) => {
    const footfall = Math.round(base[i] * 1000 * (0.97 + random() * 0.06));
    const previous = Math.round(footfall * (0.82 + random() * 0.4));
    return { label: l, footfall, previous, temp: temps[i], sky: sky[i] };
  });
  const hours = [3.7, 7.9, 9.0, 12.4, 11.8, 10.8, 12.3, 12.4, 12.0, 7.8];
  return { days, hours: hours.map((v, i) => ({ hour: 9 + i, v })), total: sum(days.map((d) => d.footfall)), group: 1.31, adults: 84.5, women: 66.4 };
})();

/* -------------------------------------------------------- LOCATION REPORT */

export const LOCATION_SHOPS = [
  { id: "Shop A", value: 751 }, { id: "Shop B", value: 1485 }, { id: "Shop C", value: 280 }, { id: "Shop D", value: 845 },
  { id: "Shop E", value: 1402 }, { id: "Shop F", value: 373 }, { id: "Shop G", value: 193 }, { id: "Shop H", value: 902 },
  { id: "Shop I", value: 69 }, { id: "Shop J", value: 967 },
];
export const LOCATION_SENSORS = [
  { name: "Bakery Corner", sel: 373, y1: 525, y2: 486, m2: 326 },
  { name: "Food Court", sel: 193, y1: 512, y2: 841, m2: 613 },
  { name: "Fashion Hall", sel: 845, y1: 806, y2: 871, m2: 1274 },
  { name: "Garden Store", sel: 902, y1: 770, y2: 735, m2: 880 },
].map((s) => ({ ...s, perM2: r2(s.sel / s.m2) }));
export const LOCATION_KPIS = { entrances: 12000, shops: LOCATION_SHOPS.reduce((s, x) => s + x.value, 0) + 0, perM2: 4.53 };
export const LOCATION_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] as const;
export const LOCATION_HEAT = (() => {
  const random = rng(7424);
  const shape = [0.01, 0.12, 0.22, 0.4, 0.78, 0.9, 0.97, 0.9, 0.7, 0.4, 0.11, 0.03];
  return [0.82, 0.9, 0.95, 0.88, 1.1, 1.55, 1.2].map((day, d) =>
    shape.map((s) => Math.round(day * s * 1000 * (0.92 + random() * 0.16) * (d === 6 ? 0.9 : 1))),
  );
})();
export const LOCATION_MONTHS = (() => {
  const random = rng(1129);
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"].map((m, i) => {
    const cur = Math.round(6600 + random() * 700 + (i >= 9 && i <= 11 ? 1900 : 0));
    return { m, cur, prev: Math.round(cur * (0.65 + random() * 0.4)) };
  });
})();

/* ------------------------------------------------------ PORTFOLIO (mall, retailer) */

export const PORTFOLIO_NAME = "Aurora Retail Properties";
export const PORTFOLIO_TREE = [
  { region: "North", open: false, malls: [] as string[] },
  { region: "Central", open: true, malls: ["Lindenhaven", "Marktplein", "Havenpoort", "Zuidbrug", "Parkgalerij", "Westhof", "Kanaalstad", "Het Atrium"] },
  { region: "South", open: false, malls: [] as string[] },
];
export const RETAILER_KPIS = { gross: 4.85, net: 5.32, perM2: 76.28, shopsPerVisit: 2.69, yoy: 0.03 };
export const BRAND_AFFINITY = [
  { cat: "Department Stores", name: "Atlas Warehouse", loc: 29.65, area: 8.48 },
  { cat: "General Clothing", name: "Northline", loc: 15.23, area: 3.15 },
  { cat: "Department Stores", name: "Merchant & Co", loc: 12.38, area: 5.25 },
  { cat: "General Clothing", name: "Fjord Wear", loc: 9.46, area: 3.11 },
  { cat: "Home Furnishings", name: "Atlas Home", loc: 0.44, area: 0.69 },
  { cat: "Home Furnishings", name: "Northline Home", loc: 0.42, area: 0.81 },
].map((b) => ({ ...b, diff: r1(b.loc - b.area) }));
export const BRAND_TOTAL = { loc: 11.26, area: 3.58, diff: 7.7 };
export const SCATTER = (() => {
  const random = rng(9091);
  const colors = ["#2b9a8f", "#d6456e", "#7b2382", "#f7a46b", "#3a5bd9", "#58b368", "#c9a0d4"];
  return Array.from({ length: 38 }, (_, i) => ({
    x: 15 + random() * 85,
    y: 22 + random() * 13,
    r: 2.5 + random() * (i % 6 === 0 ? 11 : 4.5),
    c: colors[i % colors.length],
  }));
})();
export const CAPTURE_LINE = (() => {
  const random = rng(4204);
  return Array.from({ length: 30 }, (_, i) => r2(4.84 + Math.sin(i / 2.3) * 0.045 + (random() - 0.5) * 0.04 - (i === 20 ? 0.07 : 0)));
})();

export const MALL = {
  shopsPerVisitor: 2.74, visits: "4.55M", visitsChange: -2.3, retailerCapture: 2.19, adult: 76, women: 55,
  frequency: 1.37, dwell: 39.6, retailers: 125, perM2: 101.88, group: 1.94, rent: -1.2, gross: 2.19, net: 2.28,
  top: [
    { name: "Aldervliet", change: 13.1 }, { name: "Bergenhout", change: 11.6 }, { name: "Sint-Maarten", change: 11.5 },
    { name: "Kerkdorp", change: 9.6 }, { name: "Eversdal", change: 7.8 },
  ],
  bottom: [
    { name: "Nieuwmark", change: -4.8 }, { name: "Grootbroek", change: -2.6 }, { name: "Havenrade", change: -0.4 },
    { name: "Rijnstad", change: 1.7 }, { name: "Vlietoord", change: 2.0 },
  ],
  events: [
    { name: "Facebook", v: 47.0 }, { name: "Instagram", v: 52.0 }, { name: "Online", v: 38.0 }, { name: "X", v: 34.0 },
  ],
};

/* ------------------------------------------------------------- STORE MAP */

export const STORE_MAP = (() => {
  const random = rng(2701);
  const days = ["Tue", "Wed", "Thu", "Fri", "Sat", "Mon"];
  const star = [0.58, 0.58, 0.53, 0.65, 0.58, 0.54];
  return days.map((d, i) => ({
    d,
    star: star[i],
    store: Math.round(130 + random() * 60),
    street: Math.round(11000 + random() * 3500),
  }));
})();
export const STORE_SECTIONS = (() => {
  const random = rng(3302);
  const names = ["Display Table", "Common Area – Centre", "Common Area – Entry", "Common Area – Rear", "Entrance", "Wall Display A", "Wall Display B", "Wall Display C"];
  const base = [1.1, 1.24, 2.76, 0.84, 1.98, 1.92, 0.92, 1.11];
  return names.map((name, i) => ({
    name,
    days: Array.from({ length: 6 }, () => r2(base[i] * (0.4 + random() * 1.2))),
    total: base[i],
  }));
})();
