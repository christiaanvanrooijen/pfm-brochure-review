/**
 * Every word on the retail store report specimens and around them, per locale.
 *
 * One report, two pages: Insights (conversion) and Demographics (visitor
 * composition). The page chrome — tabs, slicers, period bar — is shared; each
 * page has its own reading guide. Labels keep the report's own terms (ATV,
 * STAR); FR/DE terms are listed for native review in the decision log.
 */

import type { Locale } from "../../i18n/locales";

export type StorePage = "insights" | "demographics" | "indepth";
export type InsightsFocus = "pattern" | "opportunity" | "missed";
export type DemographicsFocus = "who" | "hours" | "weeks";
export type InDepthFocus = "kpis" | "capture" | "heat";
export type StoreFocus = InsightsFocus | DemographicsFocus | InDepthFocus;

export interface StoreGuide {
  trigger: string;
  eyebrow: string;
  sentence: string;
  stepsLabel: string;
  steps: ReadonlyArray<{ id: StoreFocus; title: string; body: string }>;
  back: string;
}

export interface StoreCopy {
  numberLocale: string;
  guide: Record<StorePage, StoreGuide>;
  refresh: string;
  tabs: readonly [string, string, string, string];
  locations: string;
  year: string;
  currentYear: string;
  comparedYear: string;
  month: string;
  monthValue: string;
  type: string;
  people: string;
  periods: readonly [string, string, string, string, string, string];
  /* Insights */
  chartTitle: string;
  selected: string;
  conversion: string;
  atv: string;
  bestDate: string;
  footfall: string;
  turnover: string;
  averageAtv: string;
  potential: string;
  missed: string;
  monthShort: string;
  /* Demographics */
  groupSize: string;
  star: string;
  capture: string;
  adult: string;
  child: string;
  men: string;
  women: string;
  footfallVsStar: string;
  groupGrid: string;
  dayName: string;
  weekdays: readonly [string, string, string, string, string, string, string];
  rolling: string;
  weekNumber: string;
  selectedPeriod: string;
  adults: string;
  avgGroup: string;
  byTime: string;
  index: string;
  byDateShort: string;
  captureTitle: string;
  rollingMonth: string;
  selectedShort: string;
  compShort: string;
  varShort: string;
}

const en: StoreCopy = {
  numberLocale: "en-GB",
  guide: {
    insights: {
      trigger: "See what you get",
      eyebrow: "What you get",
      sentence: "The store report's Insights page as customers receive it — shown with illustrative data for a fictional store.",
      stepsLabel: "What you read in it",
      steps: [
        { id: "pattern", title: "Footfall against conversion, day by day", body: "Bars are visits through the door; the line is the share that bought. Busy days that convert worse stand out at once." },
        { id: "opportunity", title: "The best opportunity date", body: "The day with the most turnover left on the table, with its own footfall, conversion, ATV and turnover." },
        { id: "missed", title: "Potential and missed turnover", body: "What that day would have turned over at the period's average conversion and ATV — and the gap." },
      ],
      back: "Back to insight",
    },
    indepth: {
      trigger: "See what you get",
      eyebrow: "What you get",
      sentence: "The store report's In-Depth page as customers receive it — shown with illustrative data for a fictional store.",
      stepsLabel: "What you read in it",
      steps: [
        { id: "kpis", title: "The store's six numbers, against last year", body: "Store footfall, index, turnover, conversion rate, capture rate and ATV, each with its change." },
        { id: "capture", title: "Footfall and capture, hour by hour", body: "Footfall by date, and footfall against the capture rate through the day, with the rolling month." },
        { id: "heat", title: "The busiest hours of the week", body: "Footfall for every weekday and time block, with totals, so the peaks are visible at a glance." },
      ],
      back: "Back to insight",
    },
    demographics: {
      trigger: "See what you get",
      eyebrow: "What you get",
      sentence: "The store report's Demographics page as customers receive it — shown with illustrative data for a fictional store.",
      stepsLabel: "What you read in it",
      steps: [
        { id: "who", title: "Who came in, against last year", body: "Group size, STAR, capture rate and the adult, child and gender split, each with its change." },
        { id: "hours", title: "When groups come, hour by hour", body: "Footfall against STAR through the day, and the average group size for every weekday and time block." },
        { id: "weeks", title: "How the mix moves week to week", body: "The rolling weeks and the split by hour, so a shift in who visits is visible before it is in the totals." },
      ],
      back: "Back to insight",
    },
  },
  refresh: "Last refresh",
  tabs: ["Overview", "In-Depth", "Demographics", "Insights"],
  locations: "Locations",
  year: "Year",
  currentYear: "Current Year",
  comparedYear: "Compared year",
  month: "Month",
  monthValue: "Previous Months (M…",
  type: "Type",
  people: "People",
  periods: ["Day", "Week", "Month", "Quarter", "Year", "Custom"],
  chartTitle: "Footfall vs. Conversion Rate",
  selected: "Selected Period",
  conversion: "Conversion Rate",
  atv: "ATV",
  bestDate: "Best Opportunity Date",
  footfall: "Footfall",
  turnover: "Turnover",
  averageAtv: "Average ATV",
  potential: "Potential Turnover",
  missed: "Missed Turnover",
  monthShort: "Mar",
  groupSize: "Avg. group size",
  star: "STAR",
  capture: "Capture rate",
  adult: "Adult",
  child: "Child",
  men: "Men",
  women: "Women",
  footfallVsStar: "Footfall vs. STAR",
  groupGrid: "Average group size",
  dayName: "Day name",
  weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  rolling: "Rolling period",
  weekNumber: "Week number",
  selectedPeriod: "Selected period",
  adults: "Adults",
  avgGroup: "Avg. group size",
  byTime: "Demographics by time",
  index: "Index",
  byDateShort: "by date",
  captureTitle: "Footfall vs. Capture rate",
  rollingMonth: "Month Year",
  selectedShort: "Selected period",
  compShort: "Comp. period",
  varShort: "% Var",
};

const fr: StoreCopy = {
  ...en,
  numberLocale: "fr-FR",
  guide: {
    insights: {
      trigger: "Voir ce que vous obtenez",
      eyebrow: "Ce que vous obtenez",
      sentence: "La page Insights du rapport magasin telle que les clients la reçoivent — avec des données illustratives pour un magasin fictif.",
      stepsLabel: "Ce que vous y lisez",
      steps: [
        { id: "pattern", title: "Fréquentation et taux de conversion, jour par jour", body: "Les barres sont les entrées ; la ligne, la part qui a acheté. Les jours chargés qui convertissent moins ressortent immédiatement." },
        { id: "opportunity", title: "La meilleure date d'opportunité", body: "Le jour où le plus de chiffre d'affaires a été manqué, avec sa fréquentation, sa conversion, son panier moyen et son chiffre d'affaires." },
        { id: "missed", title: "Chiffre d'affaires potentiel et manqué", body: "Ce que ce jour aurait réalisé avec la conversion et le panier moyens de la période — et l'écart." },
      ],
      back: "Retour à l'insight",
    },
    indepth: {
      trigger: "Voir ce que vous obtenez",
      eyebrow: "Ce que vous obtenez",
      sentence: "La page Détail du rapport magasin telle que les clients la reçoivent — avec des données illustratives pour un magasin fictif.",
      stepsLabel: "Ce que vous y lisez",
      steps: [
        { id: "kpis", title: "Les six chiffres du magasin, face à l'an dernier", body: "Fréquentation, indice, chiffre d'affaires, taux de conversion, taux de captation et panier moyen, chacun avec son évolution." },
        { id: "capture", title: "Fréquentation et captation, heure par heure", body: "La fréquentation par date, et face au taux de captation au fil de la journée, avec le mois glissant." },
        { id: "heat", title: "Les heures les plus chargées de la semaine", body: "La fréquentation par jour et par créneau, avec les totaux : les pics se voient d'un coup d'œil." },
      ],
      back: "Retour à l'insight",
    },
    demographics: {
      trigger: "Voir ce que vous obtenez",
      eyebrow: "Ce que vous obtenez",
      sentence: "La page Démographie du rapport magasin telle que les clients la reçoivent — avec des données illustratives pour un magasin fictif.",
      stepsLabel: "Ce que vous y lisez",
      steps: [
        { id: "who", title: "Qui est entré, comparé à l'an dernier", body: "Taille des groupes, STAR, taux de captation et répartition adultes, enfants et genre, chacun avec son évolution." },
        { id: "hours", title: "Quand viennent les groupes, heure par heure", body: "La fréquentation face au STAR au fil de la journée, et la taille moyenne des groupes par jour et par créneau." },
        { id: "weeks", title: "Comment la composition évolue d'une semaine à l'autre", body: "Les semaines glissantes et la répartition par heure : un changement de clientèle se voit avant d'apparaître dans les totaux." },
      ],
      back: "Retour à l'insight",
    },
  },
  refresh: "Dernière actualisation",
  tabs: ["Vue d'ensemble", "Détail", "Démographie", "Insights"],
  locations: "Sites",
  year: "Année",
  currentYear: "Année en cours",
  comparedYear: "Année comparée",
  month: "Mois",
  monthValue: "Mois précédents (M…",
  type: "Type",
  people: "Personnes",
  periods: ["Jour", "Semaine", "Mois", "Trimestre", "Année", "Personnalisé"],
  chartTitle: "Fréquentation et taux de conversion",
  selected: "Période sélectionnée",
  conversion: "Taux de conversion",
  atv: "Panier moyen",
  bestDate: "Meilleure date d'opportunité",
  footfall: "Fréquentation",
  turnover: "Chiffre d'affaires",
  averageAtv: "Panier moyen (période)",
  potential: "CA potentiel",
  missed: "CA manqué",
  monthShort: "mars",
  groupSize: "Taille moy. des groupes",
  capture: "Taux de captation",
  adult: "Adultes",
  child: "Enfants",
  men: "Hommes",
  women: "Femmes",
  footfallVsStar: "Fréquentation et STAR",
  groupGrid: "Taille moyenne des groupes",
  dayName: "Jour",
  weekdays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
  rolling: "Période glissante",
  weekNumber: "Semaine",
  selectedPeriod: "Période sélectionnée",
  adults: "Adultes",
  avgGroup: "Taille moy. groupe",
  byTime: "Démographie par heure",
  index: "Indice",
  byDateShort: "par date",
  captureTitle: "Fréquentation et taux de captation",
  rollingMonth: "Mois Année",
  selectedShort: "Période sélectionnée",
  compShort: "Période comp.",
  varShort: "% Évol.",
};

const de: StoreCopy = {
  ...en,
  numberLocale: "de-DE",
  guide: {
    insights: {
      trigger: "Sehen, was Sie erhalten",
      eyebrow: "Was Sie erhalten",
      sentence: "Die Insights-Seite des Filialberichts, wie Kunden sie erhalten – gezeigt mit illustrativen Daten für eine fiktive Filiale.",
      stepsLabel: "Was Sie darin lesen",
      steps: [
        { id: "pattern", title: "Frequenz und Conversion Rate, Tag für Tag", body: "Die Balken sind Besuche durch die Tür, die Linie ist der Anteil, der gekauft hat. Volle Tage mit schwächerer Conversion fallen sofort auf." },
        { id: "opportunity", title: "Der Tag mit dem größten Potenzial", body: "Der Tag, an dem am meisten Umsatz liegen blieb – mit seiner Frequenz, Conversion, ATV und seinem Umsatz." },
        { id: "missed", title: "Potenzieller und entgangener Umsatz", body: "Was dieser Tag bei durchschnittlicher Conversion und ATV des Zeitraums umgesetzt hätte – und die Differenz." },
      ],
      back: "Zurück zum Insight",
    },
    indepth: {
      trigger: "Sehen, was Sie erhalten",
      eyebrow: "Was Sie erhalten",
      sentence: "Die Detail-Seite des Filialberichts, wie Kunden sie erhalten – gezeigt mit illustrativen Daten für eine fiktive Filiale.",
      stepsLabel: "Was Sie darin lesen",
      steps: [
        { id: "kpis", title: "Die sechs Kennzahlen der Filiale im Vorjahresvergleich", body: "Frequenz, Index, Umsatz, Conversion Rate, Capture Rate und ATV, jeweils mit Veränderung." },
        { id: "capture", title: "Frequenz und Capture, Stunde für Stunde", body: "Die Frequenz nach Datum und gegen die Capture Rate im Tagesverlauf, mit dem rollierenden Monat." },
        { id: "heat", title: "Die stärksten Stunden der Woche", body: "Die Frequenz je Wochentag und Zeitblock mit Summen – die Spitzen sind auf einen Blick sichtbar." },
      ],
      back: "Zurück zum Insight",
    },
    demographics: {
      trigger: "Sehen, was Sie erhalten",
      eyebrow: "Was Sie erhalten",
      sentence: "Die Demografie-Seite des Filialberichts, wie Kunden sie erhalten – gezeigt mit illustrativen Daten für eine fiktive Filiale.",
      stepsLabel: "Was Sie darin lesen",
      steps: [
        { id: "who", title: "Wer kam, verglichen mit dem Vorjahr", body: "Gruppengröße, STAR, Capture Rate und der Anteil von Erwachsenen, Kindern und Geschlecht – jeweils mit Veränderung." },
        { id: "hours", title: "Wann Gruppen kommen, Stunde für Stunde", body: "Frequenz und STAR über den Tag, und die durchschnittliche Gruppengröße je Wochentag und Zeitblock." },
        { id: "weeks", title: "Wie sich der Mix von Woche zu Woche verschiebt", body: "Die rollierenden Wochen und die Aufteilung nach Uhrzeit – eine Verschiebung der Besucher ist sichtbar, bevor sie in den Summen steht." },
      ],
      back: "Zurück zum Insight",
    },
  },
  refresh: "Letzte Aktualisierung",
  tabs: ["Übersicht", "Detail", "Demografie", "Insights"],
  locations: "Standorte",
  year: "Jahr",
  currentYear: "Aktuelles Jahr",
  comparedYear: "Vergleichsjahr",
  month: "Monat",
  monthValue: "Vorherige Monate (M…",
  type: "Typ",
  people: "Personen",
  periods: ["Tag", "Woche", "Monat", "Quartal", "Jahr", "Benutzerdefiniert"],
  chartTitle: "Frequenz vs. Conversion Rate",
  selected: "Gewählter Zeitraum",
  conversion: "Conversion Rate",
  atv: "ATV",
  bestDate: "Tag mit größtem Potenzial",
  footfall: "Frequenz",
  turnover: "Umsatz",
  averageAtv: "Durchschnittliche ATV",
  potential: "Potenzieller Umsatz",
  missed: "Entgangener Umsatz",
  monthShort: "März",
  groupSize: "Ø Gruppengröße",
  capture: "Capture Rate",
  adult: "Erwachsene",
  child: "Kinder",
  men: "Männer",
  women: "Frauen",
  footfallVsStar: "Frequenz vs. STAR",
  groupGrid: "Durchschnittliche Gruppengröße",
  dayName: "Wochentag",
  weekdays: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
  rolling: "Rollierender Zeitraum",
  weekNumber: "Kalenderwoche",
  selectedPeriod: "Gewählter Zeitraum",
  adults: "Erwachsene",
  avgGroup: "Ø Gruppengröße",
  byTime: "Demografie nach Uhrzeit",
  index: "Index",
  byDateShort: "nach Datum",
  captureTitle: "Frequenz vs. Capture Rate",
  rollingMonth: "Monat Jahr",
  selectedShort: "Gewählter Zeitraum",
  compShort: "Vgl.-Zeitraum",
  varShort: "% Abw.",
};

const table: Record<Locale, StoreCopy> = { en, fr, de };

export function storeCopy(locale: Locale): StoreCopy {
  return table[locale] ?? en;
}

export function storeGuide(locale: Locale, page: StorePage): StoreGuide {
  return storeCopy(locale).guide[page];
}
