/**
 * Words on the report specimens and around them, per locale (EN, FR, DE).
 *
 * `en` defines the keys; `fr` and `de` are typed against it, so a label can
 * never exist in one language and be missing in another. Each report keeps its
 * own terms where the real report does (ATV, STAR, MVI…); FR/DE terms for
 * native review are listed in the decision log.
 */

import type { Locale } from "../../i18n/locales";

export type ReportKey = "footfall" | "landlord" | "location" | "retailer" | "mall" | "storemap";

export interface Guide {
  trigger: string;
  eyebrow: string;
  sentence: string;
  stepsLabel: string;
  steps: ReadonlyArray<{ id: string; title: string; body: string }>;
  back: string;
}

const en = {
  numberLocale: "en-GB",
  refresh: "Last refresh", year: "Year", currentYear: "Current Year", comparedYear: "Compared year", month: "Month",
  currentMonth: "Current Month", type: "Type", people: "People", site: "Site/Zone", overview: "Overview", inDepth: "In-Depth",
  periods: "Day|Week|Month|Quarter|Year|Custom", selectedPeriod: "Selected period", comparedPeriod: "Compared period",
  change: "% Change", total: "Total", weekdays: "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday",
  /* footfall */
  ffDay: "Average footfall by day of the week", ffHour: "Average footfall by hour", ffSensor: "Footfall by sensor",
  ffRolling: "Rolling period", selShort: "Selected", compShort: "Compared", dayName: "Day name", sensor: "Sensor", monthH: "Month", ytd: "YTD", comparedYtd: "Compared YTD",
  months: "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec",
  /* landlord */
  llTitle: "PORTFOLIO LANDLORD REPORT", llPortfolio: "PORTFOLIO", llLocation: "LOCATION",
  llTabs: "CENTER SUMMARY|CENTER COUNT TYPE|ZONE BREAKDOWN|CENTER MAPS", llCentre: "Shopping centre", llOwner: "Centre owner",
  weekNum: "Week Num", timeFrom: "Time (hour from)", weekStart: "Week Starting", groupSize: "Group Size", centerFootfall: "Center Footfall",
  adultChild: "Adult & Child", adults: "Adults %", kids: "Kids %", gender: "Gender", female: "Female %", male: "Male %",
  footfall: "Footfall", footfallPrev: "Footfall Previous Week", conditions: "Conditions", time: "Time", contribution: "Contribution",
  /* location */
  loTitle: "LOCATION REPORT", loDate: "DATE", loTabs: "ENTRANCES|ZONES|SHOPS|ALL SENSORS", avgDaily: "AVERAGE DAILY FOOTFALL",
  avgEntrances: "AVERAGE DAILY FOOTFALL ENTRANCES", avgShops: "AVERAGE DAILY FOOTFALL SHOPS", avgM2: "AVERAGE DAILY FOOTFALL PER M²",
  bySensor: "AVERAGE DAILY FOOTFALL BY SENSOR", sensorName: "Sensor name", minus1: "-1 Year", minus2: "-2 Year", sqm: "Square Meters",
  perSqm: "AVG FF per SQM", perHour: "AVERAGE DAILY FOOTFALL PER HOUR", perMonth: "AVERAGE DAILY FOOTFALL PER MONTH", avgLy: "AVG Footfall Daily -1 Year",
  avgDailyLegend: "AVG Daily Footfall", mapNote: "Map view · illustrative",
  /* portfolio */
  poTitle: "Portfolio Overview", poTabs: "Overview|Country|Mall|Retailer|Operations", grossCapture: "Gross Capture Rate", netCapture: "Net Capture Rate",
  retVisitsM2: "Retailer Visits per M²", shopsPerVisit: "Shops per Visit", vsYoy: "vs YoY", selectAll: "Select all", retailerCategory: "Retailer Category",
  all: "All", scatter: "Retailer Mall vs Internal Footfall Traffic", mallVisitsM2: "Mall Visits per M²", brandSearch: "Brand Search", brandAffinity: "Brand Affinity",
  category: "Category", name: "Name", location: "Location", tradeArea: "Trade Area", diff: "Diff", grossRate: "Retailer Gross Capture Rate",
  lastN: "Last", months1: "Months (Cal…",
  shopsPerVisitor: "Shops per Visitor", mallVisits: "Mall Visits", retailerCapture: "Retailer Capture Rate", visitorFreq: "Visitor Frequency",
  dwell: "Dwell Time", mins: "mins", retailers: "Retailers", visitsM2: "Visits per M²", avgGroup: "Avg Group Size", rent: "Rent Turnover",
  muni: "Municipality", chg: "Change", top5: "Top 5", bottom5: "Bottom 5", level: "Mall Shopping – Level 1", totalStore: "Total Store Footfall",
  events: "Marketing Event Tracker", platform: "Platform", interaction: "Interaction", visitChange: "Visit Change YoY", marketShare: "Relative Market Share",
  adultLegend: "Adult|Child", sexLegend: "Female|Male", mallPick: "Lindenhaven",
  /* store map */
  smTitle: "Store Map", smStore: "Northstar Store A", chooseMetric: "Choose LiDAR Metric", selectSection: "Select a section to review - Use CTRL to select multiple",
  storeFootfall: "Store Footfall", streetFootfall: "Street Footfall", section: "Section", dateRange: "Mon, 29 Sep 2025 to Sat, 04 Oct 2025", timeRange: "12:00 AM to 11:45 PM",
};
type Labels = typeof en;

const fr: Labels = {
  numberLocale: "fr-FR",
  refresh: "Dernière actualisation", year: "Année", currentYear: "Année en cours", comparedYear: "Année comparée", month: "Mois",
  currentMonth: "Mois en cours", type: "Type", people: "Personnes", site: "Site/Zone", overview: "Vue d'ensemble", inDepth: "Détail",
  periods: "Jour|Semaine|Mois|Trimestre|Année|Personnalisé", selectedPeriod: "Période sélectionnée", comparedPeriod: "Période comparée",
  change: "% Évol.", total: "Total", weekdays: "Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche",
  ffDay: "Fréquentation moyenne par jour de la semaine", ffHour: "Fréquentation moyenne par heure", ffSensor: "Fréquentation par capteur",
  ffRolling: "Période glissante", selShort: "Choisie", compShort: "Comparée", dayName: "Jour", sensor: "Capteur", monthH: "Mois", ytd: "Cumul", comparedYtd: "Cumul comp.",
  months: "Janv.|Févr.|Mars|Avr.|Mai|Juin|Juil.|Août|Sept.|Oct.|Nov.|Déc.",
  llTitle: "RAPPORT BAILLEUR DU PORTEFEUILLE", llPortfolio: "PORTEFEUILLE", llLocation: "SITE",
  llTabs: "RÉSUMÉ DU CENTRE|TYPE DE COMPTAGE|DÉTAIL PAR ZONE|PLANS DU CENTRE", llCentre: "Centre commercial", llOwner: "Propriétaire du centre",
  weekNum: "N° de semaine", timeFrom: "Heure (à partir de)", weekStart: "Semaine du", groupSize: "Taille des groupes", centerFootfall: "Fréquentation du centre",
  adultChild: "Adultes et enfants", adults: "Adultes %", kids: "Enfants %", gender: "Genre", female: "Femmes %", male: "Hommes %",
  footfall: "Fréquentation", footfallPrev: "Fréquentation semaine précédente", conditions: "Conditions", time: "Heure", contribution: "Contribution",
  loTitle: "RAPPORT SITE", loDate: "DATE", loTabs: "ENTRÉES|ZONES|COMMERCES|TOUS LES CAPTEURS", avgDaily: "FRÉQUENTATION QUOTIDIENNE MOYENNE",
  avgEntrances: "FRÉQ. QUOTIDIENNE MOYENNE ENTRÉES", avgShops: "FRÉQ. QUOTIDIENNE MOYENNE COMMERCES", avgM2: "FRÉQ. QUOTIDIENNE MOYENNE PAR M²",
  bySensor: "FRÉQUENTATION QUOTIDIENNE MOYENNE PAR CAPTEUR", sensorName: "Capteur", minus1: "-1 an", minus2: "-2 ans", sqm: "Mètres carrés",
  perSqm: "Fréq. moy. par m²", perHour: "FRÉQUENTATION QUOTIDIENNE MOYENNE PAR HEURE", perMonth: "FRÉQUENTATION QUOTIDIENNE MOYENNE PAR MOIS", avgLy: "Fréq. quotidienne moy. -1 an",
  avgDailyLegend: "Fréq. quotidienne moy.", mapNote: "Vue du plan · illustratif",
  poTitle: "Vue du portefeuille", poTabs: "Vue d'ensemble|Pays|Centre|Enseignes|Exploitation", grossCapture: "Taux de captation brut", netCapture: "Taux de captation net",
  retVisitsM2: "Visites enseignes par m²", shopsPerVisit: "Commerces par visite", vsYoy: "vs N-1", selectAll: "Tout sélectionner", retailerCategory: "Catégorie d'enseigne",
  all: "Toutes", scatter: "Fréquentation du centre vs fréquentation interne par enseigne", mallVisitsM2: "Visites du centre par m²", brandSearch: "Recherche d'enseigne", brandAffinity: "Affinité entre enseignes",
  category: "Catégorie", name: "Nom", location: "Site", tradeArea: "Zone de chalandise", diff: "Écart", grossRate: "Taux de captation brut des enseignes",
  lastN: "Derniers", months1: "Mois (cal…",
  shopsPerVisitor: "Commerces par visiteur", mallVisits: "Visites du centre", retailerCapture: "Taux de captation des enseignes", visitorFreq: "Fréquence de visite",
  dwell: "Durée de présence", mins: "min", retailers: "Enseignes", visitsM2: "Visites par m²", avgGroup: "Taille moy. des groupes", rent: "Chiffre d'affaires locatif",
  muni: "Commune", chg: "Évol.", top5: "Top 5", bottom5: "Flop 5", level: "Centre commercial – Niveau 1", totalStore: "Fréquentation totale des commerces",
  events: "Suivi des actions marketing", platform: "Plateforme", interaction: "Interaction", visitChange: "Évolution des visites (N-1)", marketShare: "Part de marché relative",
  adultLegend: "Adultes|Enfants", sexLegend: "Femmes|Hommes", mallPick: "Lindenhaven",
  smTitle: "Plan du magasin", smStore: "Northstar Magasin A", chooseMetric: "Choisir l'indicateur LiDAR", selectSection: "Sélectionnez une section – Ctrl pour en choisir plusieurs",
  storeFootfall: "Fréquentation du magasin", streetFootfall: "Fréquentation de la rue", section: "Section", dateRange: "Lun 29 sept 2025 au sam 4 oct 2025", timeRange: "00:00 à 23:45",
};

const de: Labels = {
  numberLocale: "de-DE",
  refresh: "Letzte Aktualisierung", year: "Jahr", currentYear: "Aktuelles Jahr", comparedYear: "Vergleichsjahr", month: "Monat",
  currentMonth: "Aktueller Monat", type: "Typ", people: "Personen", site: "Standort/Zone", overview: "Übersicht", inDepth: "Detail",
  periods: "Tag|Woche|Monat|Quartal|Jahr|Benutzerdefiniert", selectedPeriod: "Gewählter Zeitraum", comparedPeriod: "Vergleichszeitraum",
  change: "% Änderung", total: "Gesamt", weekdays: "Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag",
  ffDay: "Durchschnittliche Frequenz nach Wochentag", ffHour: "Durchschnittliche Frequenz nach Uhrzeit", ffSensor: "Frequenz nach Sensor",
  ffRolling: "Rollierender Zeitraum", selShort: "Gewählt", compShort: "Vergleich", dayName: "Wochentag", sensor: "Sensor", monthH: "Monat", ytd: "YTD", comparedYtd: "Vgl. YTD",
  months: "Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez",
  llTitle: "PORTFOLIO-VERMIETERBERICHT", llPortfolio: "PORTFOLIO", llLocation: "STANDORT",
  llTabs: "CENTER-ÜBERSICHT|ZÄHLART|ZONENAUFTEILUNG|CENTER-PLÄNE", llCentre: "Einkaufszentrum", llOwner: "Eigentümer des Centers",
  weekNum: "Kalenderwoche", timeFrom: "Uhrzeit (ab)", weekStart: "Woche ab", groupSize: "Gruppengröße", centerFootfall: "Center-Frequenz",
  adultChild: "Erwachsene & Kinder", adults: "Erwachsene %", kids: "Kinder %", gender: "Geschlecht", female: "Frauen %", male: "Männer %",
  footfall: "Frequenz", footfallPrev: "Frequenz Vorwoche", conditions: "Wetter", time: "Uhrzeit", contribution: "Anteil",
  loTitle: "STANDORTBERICHT", loDate: "DATUM", loTabs: "EINGÄNGE|ZONEN|GESCHÄFTE|ALLE SENSOREN", avgDaily: "DURCHSCHNITTLICHE TÄGLICHE FREQUENZ",
  avgEntrances: "Ø TÄGLICHE FREQUENZ EINGÄNGE", avgShops: "Ø TÄGLICHE FREQUENZ GESCHÄFTE", avgM2: "Ø TÄGLICHE FREQUENZ PRO M²",
  bySensor: "Ø TÄGLICHE FREQUENZ NACH SENSOR", sensorName: "Sensor", minus1: "-1 Jahr", minus2: "-2 Jahre", sqm: "Quadratmeter",
  perSqm: "Ø Frequenz pro m²", perHour: "Ø TÄGLICHE FREQUENZ NACH UHRZEIT", perMonth: "Ø TÄGLICHE FREQUENZ NACH MONAT", avgLy: "Ø tägl. Frequenz -1 Jahr",
  avgDailyLegend: "Ø tägl. Frequenz", mapNote: "Kartenansicht · illustrativ",
  poTitle: "Portfolio-Übersicht", poTabs: "Übersicht|Land|Center|Händler|Betrieb", grossCapture: "Brutto-Capture-Rate", netCapture: "Netto-Capture-Rate",
  retVisitsM2: "Händlerbesuche pro m²", shopsPerVisit: "Geschäfte pro Besuch", vsYoy: "ggü. Vorjahr", selectAll: "Alle auswählen", retailerCategory: "Händlerkategorie",
  all: "Alle", scatter: "Center- vs. interne Frequenz je Händler", mallVisitsM2: "Center-Besuche pro m²", brandSearch: "Markensuche", brandAffinity: "Markenaffinität",
  category: "Kategorie", name: "Name", location: "Standort", tradeArea: "Einzugsgebiet", diff: "Diff.", grossRate: "Brutto-Capture-Rate der Händler",
  lastN: "Letzte", months1: "Monate (Kal…",
  shopsPerVisitor: "Geschäfte pro Besucher", mallVisits: "Center-Besuche", retailerCapture: "Capture-Rate der Händler", visitorFreq: "Besuchshäufigkeit",
  dwell: "Verweildauer", mins: "Min.", retailers: "Händler", visitsM2: "Besuche pro m²", avgGroup: "Ø Gruppengröße", rent: "Mietumsatz",
  muni: "Gemeinde", chg: "Änderung", top5: "Top 5", bottom5: "Flop 5", level: "Einkaufszentrum – Ebene 1", totalStore: "Gesamtfrequenz der Geschäfte",
  events: "Marketing-Event-Tracker", platform: "Plattform", interaction: "Interaktion", visitChange: "Besuchsänderung ggü. Vorjahr", marketShare: "Relativer Marktanteil",
  adultLegend: "Erwachsene|Kinder", sexLegend: "Frauen|Männer", mallPick: "Lindenhaven",
  smTitle: "Filialplan", smStore: "Northstar Filiale A", chooseMetric: "LiDAR-Kennzahl wählen", selectSection: "Bereich wählen – mit Strg mehrere auswählen",
  storeFootfall: "Frequenz in der Filiale", streetFootfall: "Frequenz auf der Straße", section: "Bereich", dateRange: "Mo, 29. Sep 2025 bis Sa, 04. Okt 2025", timeRange: "00:00 bis 23:45",
};

const table: Record<Locale, Labels> = { en, fr, de };
export type LabelKey = Exclude<keyof Labels, "numberLocale">;
export interface L {
  numberLocale: string;
  t: (key: LabelKey) => string;
  list: (key: LabelKey) => string[];
}
export function labels(locale: Locale): L {
  const d = table[locale] ?? en;
  return { numberLocale: d.numberLocale, t: (k) => d[k], list: (k) => d[k].split("|") };
}

/* ------------------------------------------------------------ READING GUIDES */

const eyebrow: Record<Locale, string> = { en: "What you get", fr: "Ce que vous obtenez", de: "Was Sie erhalten" };
const trigger: Record<Locale, string> = { en: "See what you get", fr: "Voir ce que vous obtenez", de: "Sehen, was Sie erhalten" };
const stepsLabel: Record<Locale, string> = { en: "What you read in it", fr: "Ce que vous y lisez", de: "Was Sie darin lesen" };
const back: Record<Locale, string> = { en: "Back to insight", fr: "Retour à l'insight", de: "Zurück zum Insight" };

type Step = { id: string; title: string; body: string };
function guide(locale: Locale, sentence: Record<Locale, string>, steps: Record<Locale, Step[]>): Guide {
  return { trigger: trigger[locale], eyebrow: eyebrow[locale], sentence: sentence[locale], stepsLabel: stepsLabel[locale], steps: steps[locale], back: back[locale] };
}

const G: Record<ReportKey, (locale: Locale) => Guide> = {
  footfall: (l) =>
    guide(l,
      {
        en: "The footfall report's In-Depth page as customers receive it — shown with illustrative data for a fictional centre.",
        fr: "La page Détail du rapport de fréquentation telle que les clients la reçoivent — avec des données illustratives pour un centre fictif.",
        de: "Die Detail-Seite des Frequenzberichts, wie Kunden sie erhalten – gezeigt mit illustrativen Daten für ein fiktives Center.",
      },
      {
        en: [
          { id: "sensor", title: "Every entrance, against last year", body: "Footfall by sensor for the selected period and the compared period, with the change — so you see which entrances grow and which fade." },
          { id: "pattern", title: "The weekly and daily rhythm", body: "Average footfall per weekday and per hour, selected against compared period." },
          { id: "rolling", title: "The year so far, month by month", body: "The rolling months with year-to-date and its comparison." },
        ],
        fr: [
          { id: "sensor", title: "Chaque entrée, comparée à l'an dernier", body: "La fréquentation par capteur sur la période choisie et la période comparée, avec l'évolution : on voit quelles entrées progressent et lesquelles reculent." },
          { id: "pattern", title: "Le rythme de la semaine et de la journée", body: "La fréquentation moyenne par jour de la semaine et par heure, période choisie contre période comparée." },
          { id: "rolling", title: "L'année en cours, mois par mois", body: "Les mois glissants avec le cumul annuel et sa comparaison." },
        ],
        de: [
          { id: "sensor", title: "Jeder Eingang im Vorjahresvergleich", body: "Die Frequenz je Sensor im gewählten und im Vergleichszeitraum samt Veränderung – so sieht man, welche Eingänge wachsen und welche nachlassen." },
          { id: "pattern", title: "Der Wochen- und Tagesrhythmus", body: "Die durchschnittliche Frequenz je Wochentag und je Uhrzeit, gewählter gegen Vergleichszeitraum." },
          { id: "rolling", title: "Das Jahr bis jetzt, Monat für Monat", body: "Die rollierenden Monate mit Jahresverlauf und dessen Vergleich." },
        ],
      }),
  landlord: (l) =>
    guide(l,
      {
        en: "The landlord report's Center summary as customers receive it — shown with illustrative data for a fictional centre.",
        fr: "Le résumé du centre du rapport bailleur tel que les clients le reçoivent — avec des données illustratives pour un centre fictif.",
        de: "Die Center-Übersicht des Vermieterberichts, wie Kunden sie erhalten – gezeigt mit illustrativen Daten für ein fiktives Center.",
      },
      {
        en: [
          { id: "who", title: "How many came, and in what groups", body: "Center footfall and average group size with their trend, and the adult/child and gender split." },
          { id: "week", title: "This week against last, with the weather", body: "Daily footfall against the previous week, and the weather that day." },
          { id: "hours", title: "When in the day they come", body: "Each hour's share of the day's visits." },
        ],
        fr: [
          { id: "who", title: "Combien sont venus, et en quels groupes", body: "La fréquentation du centre et la taille moyenne des groupes avec leur tendance, et la répartition adultes/enfants et genre." },
          { id: "week", title: "Cette semaine face à la précédente, avec la météo", body: "La fréquentation quotidienne face à la semaine précédente, et le temps de la journée." },
          { id: "hours", title: "À quel moment de la journée", body: "La part de chaque heure dans les visites du jour." },
        ],
        de: [
          { id: "who", title: "Wie viele kamen, und in welchen Gruppen", body: "Center-Frequenz und durchschnittliche Gruppengröße mit Trend sowie die Aufteilung nach Erwachsenen/Kindern und Geschlecht." },
          { id: "week", title: "Diese Woche gegen die letzte, mit Wetter", body: "Die tägliche Frequenz gegenüber der Vorwoche und das Wetter des Tages." },
          { id: "hours", title: "Zu welcher Tageszeit", body: "Der Anteil jeder Stunde an den Besuchen des Tages." },
        ],
      }),
  location: (l) =>
    guide(l,
      {
        en: "The location report's Shops page as customers receive it — shown with illustrative data for a fictional centre.",
        fr: "La page Commerces du rapport site telle que les clients la reçoivent — avec des données illustratives pour un centre fictif.",
        de: "Die Geschäfte-Seite des Standortberichts, wie Kunden sie erhalten – gezeigt mit illustrativen Daten für ein fiktives Center.",
      },
      {
        en: [
          { id: "map", title: "Footfall per shop, on the plan", body: "The average daily footfall counted at each covered shop, shown where the shop is." },
          { id: "sensors", title: "Each sensor, against the past two years", body: "The selected period beside one and two years back, and footfall per square metre." },
          { id: "rhythm", title: "The rhythm of the week and the year", body: "Average daily footfall for every hour and weekday, and month by month against last year." },
        ],
        fr: [
          { id: "map", title: "La fréquentation de chaque commerce, sur le plan", body: "La fréquentation quotidienne moyenne comptée à chaque commerce couvert, là où il se trouve." },
          { id: "sensors", title: "Chaque capteur, sur deux ans", body: "La période choisie à côté d'un et deux ans en arrière, et la fréquentation par mètre carré." },
          { id: "rhythm", title: "Le rythme de la semaine et de l'année", body: "La fréquentation quotidienne moyenne par heure et par jour, et mois par mois face à l'an dernier." },
        ],
        de: [
          { id: "map", title: "Frequenz je Geschäft, auf dem Plan", body: "Die durchschnittliche tägliche Frequenz an jedem erfassten Geschäft, dort gezeigt, wo es liegt." },
          { id: "sensors", title: "Jeder Sensor im Zwei-Jahres-Vergleich", body: "Der gewählte Zeitraum neben einem und zwei Jahren davor sowie die Frequenz pro Quadratmeter." },
          { id: "rhythm", title: "Der Rhythmus von Woche und Jahr", body: "Die durchschnittliche tägliche Frequenz je Stunde und Wochentag sowie Monat für Monat gegen das Vorjahr." },
        ],
      }),
  retailer: (l) =>
    guide(l,
      {
        en: "The portfolio report's Retailer page as customers receive it — shown with illustrative data for a fictional portfolio.",
        fr: "La page Enseignes du rapport portefeuille telle que les clients la reçoivent — avec des données illustratives pour un portefeuille fictif.",
        de: "Die Händler-Seite des Portfolioberichts, wie Kunden sie erhalten – gezeigt mit illustrativen Daten für ein fiktives Portfolio.",
      },
      {
        en: [
          { id: "capture", title: "How much of the visit reaches the shops", body: "Gross and net capture rate, retailer visits per square metre and shops per visit, against last year." },
          { id: "affinity", title: "Which brands share visitors", body: "Brand affinity: how much more a brand's visitors also visit another, here against the trade area." },
          { id: "trend", title: "Capture rate over time", body: "Each retailer's gross capture rate by day, with the period's average." },
        ],
        fr: [
          { id: "capture", title: "Quelle part de la visite atteint les commerces", body: "Taux de captation brut et net, visites d'enseignes par mètre carré et commerces par visite, face à l'an dernier." },
          { id: "affinity", title: "Quelles enseignes partagent leurs visiteurs", body: "L'affinité entre enseignes : combien de visiteurs d'une enseigne visitent aussi une autre, comparé à la zone de chalandise." },
          { id: "trend", title: "Le taux de captation dans le temps", body: "Le taux de captation brut des enseignes par jour, avec la moyenne de la période." },
        ],
        de: [
          { id: "capture", title: "Wie viel vom Besuch die Geschäfte erreicht", body: "Brutto- und Netto-Capture-Rate, Händlerbesuche pro Quadratmeter und Geschäfte pro Besuch, gegen das Vorjahr." },
          { id: "affinity", title: "Welche Marken sich Besucher teilen", body: "Markenaffinität: wie viel häufiger Besucher einer Marke auch eine andere besuchen, hier gegen das Einzugsgebiet." },
          { id: "trend", title: "Die Capture-Rate im Zeitverlauf", body: "Die Brutto-Capture-Rate der Händler je Tag, mit dem Durchschnitt des Zeitraums." },
        ],
      }),
  mall: (l) =>
    guide(l,
      {
        en: "The portfolio report's Mall page as customers receive it — shown with illustrative data for a fictional centre.",
        fr: "La page Centre du rapport portefeuille telle que les clients la reçoivent — avec des données illustratives pour un centre fictif.",
        de: "Die Center-Seite des Portfolioberichts, wie Kunden sie erhalten – gezeigt mit illustrativen Daten für ein fiktives Center.",
      },
      {
        en: [
          { id: "headline", title: "The centre at a glance", body: "Shops per visitor, visits and capture rate, who visits, how often and for how long." },
          { id: "reach", title: "Where visitors come from", body: "The municipalities that grew and shrank most, and the visit change and market share on the map." },
          { id: "floor", title: "Where they go inside", body: "Footfall per shop on the centre's floor plan, beside the marketing events that may explain it." },
        ],
        fr: [
          { id: "headline", title: "Le centre en un coup d'œil", body: "Commerces par visiteur, visites et taux de captation, qui vient, à quelle fréquence et pour combien de temps." },
          { id: "reach", title: "D'où viennent les visiteurs", body: "Les communes qui progressent et reculent le plus, et l'évolution des visites et la part de marché sur la carte." },
          { id: "floor", title: "Où ils vont à l'intérieur", body: "La fréquentation par commerce sur le plan du centre, à côté des actions marketing qui peuvent l'expliquer." },
        ],
        de: [
          { id: "headline", title: "Das Center auf einen Blick", body: "Geschäfte pro Besucher, Besuche und Capture-Rate, wer kommt, wie oft und wie lange." },
          { id: "reach", title: "Woher die Besucher kommen", body: "Die Gemeinden mit dem stärksten Zuwachs und Rückgang sowie Besuchsänderung und Marktanteil auf der Karte." },
          { id: "floor", title: "Wohin sie im Inneren gehen", body: "Die Frequenz je Geschäft auf dem Grundriss des Centers, neben den Marketing-Events, die sie erklären können." },
        ],
      }),
  storemap: (l) =>
    guide(l,
      {
        en: "The store map as customers receive it — shown with illustrative data for a fictional store.",
        fr: "Le plan du magasin tel que les clients le reçoivent — avec des données illustratives pour un magasin fictif.",
        de: "Der Filialplan, wie Kunden ihn erhalten – gezeigt mit illustrativen Daten für eine fiktive Filiale.",
      },
      {
        en: [
          { id: "map", title: "Choose a metric, pick a section", body: "The floor plan is shaded by the chosen LiDAR metric; selecting a section filters the rest of the page." },
          { id: "trend", title: "The metric against footfall", body: "STAR per day, against footfall inside the store and on the street outside." },
          { id: "table", title: "Every section, every day", body: "The metric for each section and weekday, so the sections that engage — and those that do not — are visible." },
        ],
        fr: [
          { id: "map", title: "Choisir un indicateur, choisir une section", body: "Le plan est coloré selon l'indicateur LiDAR choisi ; sélectionner une section filtre le reste de la page." },
          { id: "trend", title: "L'indicateur face à la fréquentation", body: "Le STAR par jour, face à la fréquentation dans le magasin et dans la rue." },
          { id: "table", title: "Chaque section, chaque jour", body: "L'indicateur par section et par jour, pour voir les sections qui attirent — et celles qui n'attirent pas." },
        ],
        de: [
          { id: "map", title: "Kennzahl wählen, Bereich auswählen", body: "Der Grundriss ist nach der gewählten LiDAR-Kennzahl eingefärbt; ein Bereich filtert den Rest der Seite." },
          { id: "trend", title: "Die Kennzahl gegen die Frequenz", body: "STAR je Tag, gegen die Frequenz im Geschäft und auf der Straße davor." },
          { id: "table", title: "Jeder Bereich, jeder Tag", body: "Die Kennzahl je Bereich und Wochentag – sichtbar, welche Bereiche wirken und welche nicht." },
        ],
      }),
};

export function reportGuide(key: ReportKey, locale: Locale): Guide {
  return G[key](locale);
}
