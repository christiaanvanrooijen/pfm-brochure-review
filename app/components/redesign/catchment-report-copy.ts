/**
 * Every word on the catchment report specimen and around it, per locale.
 *
 * The report is shown in the reader's own language: an English journey shows
 * an English report, a French one French, a German one German. Numbers follow
 * the same locale (decimal comma in FR and DE).
 */

import type { Locale } from "../../i18n/locales";

export type ReportFocus = "quality" | "when" | "where";

export interface ReportCopy {
  numberLocale: string;
  /* Around the report */
  trigger: string;
  eyebrow: string;
  sentence: string;
  stepsLabel: string;
  steps: ReadonlyArray<{ id: ReportFocus; title: string; body: string }>;
  back: string;
  /* On the report */
  title: string;
  help: string;
  tabs: readonly string[];
  month: string;
  trend: string;
  periodView: string;
  period: string;
  compareWith: string;
  multiple: string;
  kpis: readonly [string, string, string, string, string];
  ly: string;
  mins: string;
  pp: string;
  durationTitle: string;
  byDate: string;
  durationSelect: string;
  sliderLabel: string;
  daysTitle: string;
  daysSelect: string;
  days: readonly string[];
  months: readonly [string, string, string];
  postcode: string;
  penetration: string;
  visits: string;
  population: string;
  average: string;
  mapTitle: string;
  mapNote: string;
  mapTip: string;
}

const en: ReportCopy = {
  numberLocale: "en-GB",
  trigger: "See what you get",
  eyebrow: "What you get",
  sentence: "The catchment report as customers receive it — shown with illustrative data for a fictional centre.",
  stepsLabel: "What you read in it",
  steps: [
    { id: "quality", title: "Visit quality at a glance", body: "Duration, frequency and the share of unique visitors, each against last year." },
    { id: "when", title: "When they come", body: "Visit duration over time and the weekly rhythm, month by month." },
    { id: "where", title: "Where they come from", body: "Every postcode: penetration, visits and residents — and where the catchment grows or shrinks." },
  ],
  back: "Back to insight",
  title: "Demographics",
  help: "Help",
  tabs: ["Overview", "Leasing", "Marketing", "Household", "Competition"],
  month: "Month",
  trend: "Trend",
  periodView: "Period view",
  period: "Period:",
  compareWith: "Compare with:",
  multiple: "Multiple selections",
  kpis: ["Visit duration", "Visit frequency", "Unique visitors %", "Long visits (1h+)", "Short visits (<1h)"],
  ly: "LY",
  mins: "mins",
  pp: "pp",
  durationTitle: "Average visit duration",
  byDate: "By date",
  durationSelect: "Average duration",
  sliderLabel: "Postcode above visit %",
  daysTitle: "Day of the week",
  daysSelect: "Day of week",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  months: ["Jan 2026", "Feb 2026", "Mar 2026"],
  postcode: "Postcode",
  penetration: "Penetration",
  visits: "Visits",
  population: "Population",
  average: "Average",
  mapTitle: "Change in catchment area",
  mapNote: "Map view · illustrative",
  mapTip: "vs LY",
};

const fr: ReportCopy = {
  numberLocale: "fr-FR",
  trigger: "Voir ce que vous obtenez",
  eyebrow: "Ce que vous obtenez",
  sentence: "Le rapport de zone de chalandise tel que les clients le reçoivent — avec des données illustratives pour un centre fictif.",
  stepsLabel: "Ce que vous y lisez",
  steps: [
    { id: "quality", title: "La qualité des visites en un coup d'œil", body: "Durée, fréquence et part de visiteurs uniques, chacune comparée à l'an dernier." },
    { id: "when", title: "Quand ils viennent", body: "L'évolution de la durée de visite et le rythme de la semaine, mois par mois." },
    { id: "where", title: "D'où ils viennent", body: "Chaque code postal : pénétration, visites et habitants — et où la zone de chalandise progresse ou recule." },
  ],
  back: "Retour à l'analyse",
  title: "Démographie",
  help: "Aide",
  tabs: ["Vue d'ensemble", "Location", "Marketing", "Ménages", "Concurrence"],
  month: "Mois",
  trend: "Tendance",
  periodView: "Vue période",
  period: "Période :",
  compareWith: "Comparer avec :",
  multiple: "Plusieurs sélections",
  kpis: ["Durée de visite", "Fréquence de visite", "Visiteurs uniques %", "Visites longues (1h+)", "Visites courtes (<1h)"],
  ly: "N-1",
  mins: "min",
  pp: "pt",
  durationTitle: "Durée moyenne de visite",
  byDate: "Par date",
  durationSelect: "Durée moyenne",
  sliderLabel: "Code postal au-dessus du % de visites",
  daysTitle: "Jour de la semaine",
  daysSelect: "Jour de la semaine",
  days: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  months: ["janv. 2026", "févr. 2026", "mars 2026"],
  postcode: "Code postal",
  penetration: "Pénétration",
  visits: "Visites",
  population: "Population",
  average: "Moyenne",
  mapTitle: "Évolution de la zone de chalandise",
  mapNote: "Vue carte · illustrative",
  mapTip: "vs N-1",
};

const de: ReportCopy = {
  numberLocale: "de-DE",
  trigger: "Sehen, was Sie erhalten",
  eyebrow: "Was Sie erhalten",
  sentence: "Der Einzugsgebietsbericht, wie Kunden ihn erhalten – gezeigt mit illustrativen Daten für ein fiktives Center.",
  stepsLabel: "Was Sie darin lesen",
  steps: [
    { id: "quality", title: "Besuchsqualität auf einen Blick", body: "Dauer, Frequenz und Anteil eindeutiger Besucher, jeweils gegenüber dem Vorjahr." },
    { id: "when", title: "Wann sie kommen", body: "Die Besuchsdauer im Zeitverlauf und der Wochenrhythmus, Monat für Monat." },
    { id: "where", title: "Woher sie kommen", body: "Jede Postleitzahl: Durchdringung, Besuche und Einwohner – und wo das Einzugsgebiet wächst oder schrumpft." },
  ],
  back: "Zurück zur Erkenntnis",
  title: "Demografie",
  help: "Hilfe",
  tabs: ["Übersicht", "Vermietung", "Marketing", "Haushalte", "Wettbewerb"],
  month: "Monat",
  trend: "Trend",
  periodView: "Periodenansicht",
  period: "Zeitraum:",
  compareWith: "Vergleichen mit:",
  multiple: "Mehrfachauswahl",
  kpis: ["Besuchsdauer", "Besuchsfrequenz", "Eindeutige Besucher %", "Lange Besuche (1 Std.+)", "Kurze Besuche (<1 Std.)"],
  ly: "VJ",
  mins: "Min.",
  pp: "PP",
  durationTitle: "Durchschnittliche Besuchsdauer",
  byDate: "Nach Datum",
  durationSelect: "Durchschnittsdauer",
  sliderLabel: "PLZ über Besuchs-%",
  daysTitle: "Wochentag",
  daysSelect: "Wochentag",
  days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  months: ["Jan. 2026", "Feb. 2026", "März 2026"],
  postcode: "PLZ",
  penetration: "Durchdringung",
  visits: "Besuche",
  population: "Einwohner",
  average: "Durchschnitt",
  mapTitle: "Veränderung im Einzugsgebiet",
  mapNote: "Kartenansicht · illustrativ",
  mapTip: "ggü. VJ",
};

const COPY: Record<Locale, ReportCopy> = { en, fr, de } as Record<Locale, ReportCopy>;

export function reportCopy(locale: Locale): ReportCopy {
  return COPY[locale] ?? en;
}
