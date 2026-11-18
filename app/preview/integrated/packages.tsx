"use client";

import { useState } from "react";
import type { Locale } from "../../i18n/locales";

type Copy = Record<Locale, string>;
type Value = boolean | Copy;
type Item = { label: Copy; values: readonly [Value, Value, Value] };
type Group = { title: Copy; items: readonly Item[] };
const t = (en: string, fr: string, de: string): Copy => ({ en, fr, de });
const all = [true, true, true] as const;
const pro = [false, true, true] as const;
const ent = [false, false, true] as const;
const row = (label: Copy, values: readonly [Value, Value, Value]): Item => ({ label, values });

const reporting: readonly Group[] = [
  { title: t("Real-time reporting", "Rapports en temps réel", "Echtzeitberichte"), items: [
    row(t("Perimeter baseline counting of people movement", "Comptage de base des mouvements aux entrées", "Basiszählung der Personenbewegungen am Perimeter"), all),
    row(t("Perimeter occupancy with email and SMS alerting", "Occupation du périmètre avec alertes e-mail et SMS", "Perimeterbelegung mit E-Mail- und SMS-Alarmen"), all),
    row(t("Zones and zonal occupancy", "Zones et occupation par zone", "Zonen und Zonenbelegung"), all),
    row(t("Flow and heatmapping", "Flux et cartes de chaleur", "Bewegungsfluss und Heatmaps"), ent),
  ] },
  { title: t("Reporting", "Rapports", "Berichte"), items: [
    row(t("Interactive preconfigured reports, KPIs and historical week/month/quarter/year comparisons", "Rapports interactifs préconfigurés, KPI et comparaisons historiques par semaine, mois, trimestre ou année", "Interaktive vorkonfigurierte Berichte, KPIs und historische Vergleiche nach Woche, Monat, Quartal oder Jahr"), all),
    row(t("Multi-site comparative reporting", "Rapports comparatifs multisites", "Standortübergreifende Vergleichsberichte"), pro),
    row(t("Bespoke reports, optional floor plans", "Rapports sur mesure et plans en option", "Individuelle Berichte, optionale Grundrisse"), ent),
    row(t("Large portfolio reporting", "Rapports pour grands portefeuilles", "Berichte für große Portfolios"), ent),
  ] },
  { title: t("Index access", "Accès aux indices", "Indexzugang"), items: [
    row(t("Scheduled preconfigured index reports", "Rapports d’indices préconfigurés et planifiés", "Geplante vorkonfigurierte Indexberichte"), all),
    row(t("Bespoke index integration and comparison", "Intégration et comparaison d’indices sur mesure", "Individuelle Indexintegration und Vergleiche"), ent),
  ] },
  { title: t("Data delivery", "Livraison des données", "Datenbereitstellung"), items: [
    row(t("Scheduled preconfigured reports", "Rapports préconfigurés planifiés", "Geplante vorkonfigurierte Berichte"), all),
    row(t("sFTP or API data delivery", "Livraison des données par sFTP ou API", "Datenbereitstellung per sFTP oder API"), pro),
  ] },
  { title: t("User access", "Accès utilisateur", "Benutzerzugang"), items: [
    row(t("Unlimited user access (reactive management)", "Accès utilisateur illimité (gestion réactive)", "Unbegrenzter Benutzerzugang (reaktive Verwaltung)"), all),
    row(t("User access management (self-service portal)", "Gestion des accès utilisateur (portail libre-service)", "Benutzerzugangsverwaltung (Self-Service-Portal)"), all),
  ] },
  { title: t("Consultancy", "Conseil", "Beratung"), items: [
    row(t("Bespoke insight content and report creation", "Création sur mesure de contenus d’analyse et de rapports", "Individuelle Insight-Inhalte und Berichtserstellung"), ent),
    row(t("Environment creation and support consultancy", "Création d’environnement et conseil en support", "Einrichtung der Umgebung und Supportberatung"), ent),
    row(t("Data lake creation and management consultancy", "Conseil pour la création et la gestion d’un lac de données", "Beratung zur Einrichtung und Verwaltung eines Data Lakes"), ent),
  ] },
];
const service: readonly Group[] = [
  { title: t("Data management", "Gestion des données", "Datenmanagement"), items: [
    row(t("Daily data delivery check", "Contrôle quotidien de la réception des données", "Tägliche Prüfung der Datenlieferung"), all),
    row(t("Daily weekday data management (pre 10am completion)", "Gestion quotidienne des données en semaine (avant 10 h)", "Tägliches Datenmanagement an Werktagen (Abschluss vor 10 Uhr)"), all),
    row(t("Sensor firmware updates", "Mises à jour du micrologiciel des capteurs", "Sensor-Firmware-Updates"), all),
    row(t("Sensor online/offline status", "État en ligne / hors ligne des capteurs", "Sensorstatus online/offline"), all),
    row(t("7/7 dedicated data management", "Gestion dédiée des données 7 j/7", "Dediziertes Datenmanagement an sieben Tagen pro Woche"), ent),
    row(t("Proactive data/systems monitoring", "Surveillance proactive des données et systèmes", "Proaktive Daten- und Systemüberwachung"), ent),
    row(t("Operational and patch management reporting", "Rapports de gestion opérationnelle et des correctifs", "Berichte zu Betriebs- und Patchmanagement"), pro),
  ] },
  { title: t("Visits, maintenance and warranty", "Interventions, maintenance et garantie", "Einsätze, Wartung und Garantie"), items: [
    row(t("All-inclusive hardware warranty for the term*", "Garantie matérielle tout compris pour la durée du contrat*", "Hardware-Komplettgarantie für die Vertragslaufzeit*"), pro),
    row(t("All service visits included*", "Toutes les interventions de service incluses*", "Alle Serviceeinsätze inklusive*"), pro),
    row(t("Annual remote validation (audit & accuracy report)", "Validation annuelle à distance (audit et rapport de précision)", "Jährliche Fernvalidierung (Audit und Genauigkeitsbericht)"), pro),
    row(t("All access vehicles and HLA included*", "Tous les véhicules d’accès et HLA inclus*", "Alle Zugangsfahrzeuge und HLA inklusive*"), ent),
  ] },
  { title: t("Support and performance reporting", "Support et rapports de performance", "Support und Leistungsberichte"), items: [
    row(t("Unlimited support calls / tickets*", "Appels / tickets de support illimités*", "Unbegrenzte Supportanrufe / Tickets*"), all),
    row(t("PFM Service Self Service Dashboard — Odoo", "Tableau de bord libre-service PFM Service — Odoo", "PFM Service Self-Service-Dashboard — Odoo"), ent),
    row(t("PFM hardware performance report", "Rapport de performance du matériel PFM", "PFM-Hardware-Leistungsbericht"), ent),
    row(t("Dedicated service delivery manager reporting/meetings", "Rapports et réunions avec un responsable de service dédié", "Berichte und Meetings mit dediziertem Service Delivery Manager"), ent),
  ] },
  { title: t("Response and call-to-fix", "Réponse et délai de résolution", "Reaktions- und Behebungszeit"), items: [
    row(t("Response time during working days", "Délai de réponse les jours ouvrés", "Reaktionszeit an Werktagen"), [t("3 working days", "3 jours ouvrés", "3 Werktage"), t("8 hours", "8 heures", "8 Stunden"), t("1 hour", "1 heure", "1 Stunde")]),
    row(t("Call-to-fix duration***", "Délai de résolution après signalement***", "Behebungsdauer nach Meldung***"), [t("6 working days", "6 jours ouvrés", "6 Werktage"), t("4 working days", "4 jours ouvrés", "4 Werktage"), t("2 working days", "2 jours ouvrés", "2 Werktage")]),
  ] },
];
const labels = {
  en: { eyebrow: "Service packages", title: "Make the service scope visible.", intro: "Compare reporting and insights alongside the data management, maintenance and support behind them.", report: "Reporting & insights", service: "Service & support", differences: "Show differences only", feature: "Feature", included: "Included", excluded: "Not included", note: "* Agreed scope and conditions apply. *** Call-to-fix duration starts after the day of notification." },
  fr: { eyebrow: "Offres de service", title: "Comprendre le périmètre du service.", intro: "Comparez les rapports et analyses ainsi que la gestion des données, la maintenance et le support associés.", report: "Rapports et analyses", service: "Service et support", differences: "Afficher uniquement les différences", feature: "Fonctionnalité", included: "Inclus", excluded: "Non inclus", note: "* Le périmètre et les conditions convenus s’appliquent. *** Le délai de résolution commence après le jour du signalement." },
  de: { eyebrow: "Servicepakete", title: "Den Serviceumfang verstehen.", intro: "Vergleichen Sie Berichte und Insights sowie das zugehörige Datenmanagement, die Wartung und den Support.", report: "Berichte & Insights", service: "Service & Support", differences: "Nur Unterschiede anzeigen", feature: "Leistung", included: "Enthalten", excluded: "Nicht enthalten", note: "Auf Grundlage der bereitgestellten Paketmatrizen. * Vereinbarter Umfang und Bedingungen gelten. *** Die Behebungsdauer beginnt nach dem Tag der Meldung. HLA wird wie bereitgestellt übernommen." },
} satisfies Record<Locale, Record<string, string>>;

export function Packages({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<"reporting" | "service">("reporting");
  const [differences, setDifferences] = useState(false);
  const c = labels[locale];
  const groups = (mode === "reporting" ? reporting : service).map((group) => ({ ...group, items: differences ? group.items.filter((item) => !(item.values[0] === item.values[1] && item.values[1] === item.values[2])) : group.items })).filter((group) => group.items.length);
  return <section className="ipk" lang={locale}>
    <p className="ipk-kicker">{c.eyebrow}</p><h1>{c.title}</h1><p className="ipk-intro">{c.intro}</p>
    <div className="ipk-switch" role="group" aria-label={c.eyebrow}>
      <button type="button" aria-pressed={mode === "reporting"} onClick={() => setMode("reporting")}>{c.report}</button>
      <button type="button" aria-pressed={mode === "service"} onClick={() => setMode("service")}>{c.service}</button>
    </div>
    <label className="ipk-filter"><input type="checkbox" checked={differences} onChange={(event) => setDifferences(event.target.checked)} /> {c.differences}</label>
    <div className="ipk-scroll"><table><thead><tr><th scope="col">{c.feature}</th><th scope="col">Essential</th><th scope="col">Professional</th><th scope="col">Enterprise</th></tr></thead><tbody>
      {groups.map((group) => <FragmentGroup key={group.title.en} group={group} locale={locale} included={c.included} excluded={c.excluded} />)}
    </tbody></table></div><p className="ipk-note">{c.note}</p>
    <style>{`.ipk{max-width:1300px;margin:0 auto;padding:50px 32px 70px;color:#0c111d;font-family:'Instrument Sans',Helvetica,sans-serif}.ipk h1{font-size:clamp(36px,4.1vw,58px);line-height:1.04;letter-spacing:-.05em;margin:0 0 24px}.ipk-kicker{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#6941c6}.ipk-intro{font-size:17px;line-height:1.6;color:#475467;max-width:750px}.ipk-switch{display:flex;flex-wrap:wrap;gap:24px;margin-top:35px;border-bottom:1px solid #e4e7ec}.ipk-switch button{font:inherit;background:none;border:0;border-bottom:3px solid transparent;padding:14px 0;cursor:pointer;color:#667085}.ipk-switch button[aria-pressed=true]{color:#6941c6;border-bottom-color:#6941c6;font-weight:600}.ipk-filter{display:block;margin:20px 0;color:#475467;font-size:13px}.ipk-scroll{overflow:auto;border:1px solid #e4e7ec}.ipk table{width:100%;min-width:700px;border-collapse:collapse;font-size:13px}.ipk th,.ipk td{padding:13px 18px;border-bottom:1px solid #e4e7ec;text-align:center}.ipk th:first-child,.ipk td:first-child{text-align:left;width:49%}.ipk td+td,.ipk th+th{border-left:1px solid #e4e7ec}.ipk thead th{background:#f9fafb}.ipk thead th:nth-child(3){background:#f4ebff}.ipk thead th:nth-child(4){background:#fff0ef}.ipk .ipk-group th{text-align:left;background:#0c111d;color:#fff;font-size:11px;letter-spacing:.08em;text-transform:uppercase}.ipk-yes{color:#027a48;font-weight:700}.ipk-no{color:#98a2b3}.ipk-note{font-size:12px;color:#667085;line-height:1.55}.ipk button:focus-visible,.ipk input:focus-visible{outline:2px solid #6941c6;outline-offset:3px}@media(max-width:800px){.ipk{padding:32px 20px 45px}}`}</style>
  </section>;
}
function FragmentGroup({ group, locale, included, excluded }: { group: Group; locale: Locale; included: string; excluded: string }) {
  return <><tr className="ipk-group"><th colSpan={4} scope="colgroup">{group.title[locale]}</th></tr>{group.items.map((item) => <tr key={item.label.en}><th scope="row">{item.label[locale]}</th>{item.values.map((value, index) => <td key={index}>{typeof value === "boolean" ? <span className={value ? "ipk-yes" : "ipk-no"} aria-label={value ? included : excluded}>{value ? "✓" : "—"}</span> : value[locale]}</td>)}</tr>)}</>;
}
