/**
 * Short method explanations for the drawer's segment + capability views.
 *
 * The illustration is optional; the method is not. These sentences describe
 * what is measured, what the customer supplies and what is derived, without
 * turning a product name, an accuracy figure or a privacy assumption into a
 * customer claim. The inventory is keyed by the same segment/capability pair
 * as the drawer artwork, so an illustration can never be borrowed from a
 * different place.
 *
 * Source references are kept with each entry rather than in a separate report.
 * The matrix/architecture locators support the property segments; the QSR
 * specification locators support Drive-Thru Performance.
 */

import type { Locale } from "../i18n/locales.ts";
import type { DataRole, SceneId, SegmentId, TechnologyCapabilityId } from "./types.ts";

export type DrawerMethodType =
  | "physical"
  | "geo_context"
  | "business_input"
  | "derived"
  | "operational";

export interface DrawerMethodCopy {
  segmentId: SegmentId;
  capabilityId: TechnologyCapabilityId;
  /** The kinds of method a reader is seeing in the explanation. */
  methodTypes: readonly DrawerMethodType[];
  /** Canonical PFM data roles represented by the method. */
  dataRoles: readonly DataRole[];
  copy: Readonly<Record<Locale, string>>;
  /** Source IDs and precise safe locators for the wording. */
  sourceRefs: readonly string[];
}

const matrix = "PFM_Segment_Insight_Matrix_v1_1.xlsx";
const qsrSpec = "docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md";

const matrixScene = (row: number): string => `${matrix}: PFM Matrix!E${row}:G${row}`;
const technologyCapability = (row: number): string =>
  `${matrix}: Technology library!A${row}:G${row}`;
const storyScene = (row: number): string => `${matrix}: PFM Matrix!A${row}:P${row}`;

const copy = (en: string, fr: string, de: string): Readonly<Record<Locale, string>> => ({
  en,
  fr,
  de,
});

/**
 * One entry per segment + capability pair in the Core drawer inventory.
 *
 * Keep this list explicit. A missing pair should fail the content test rather
 * than silently inheriting a method from another segment.
 */
export const drawerMethodCopies: readonly DrawerMethodCopy[] = [
  /* ---------------------------------------------------------------------- *
     Outlet Centre
   * ---------------------------------------------------------------------- */
  {
    segmentId: "outlet-centre",
    capabilityId: "TECH-02",
    methodTypes: ["physical"],
    dataRoles: ["physical"],
    copy: copy(
      "Physical measurement: selected entrance thresholds are measured directly as people cross in or out. Each count belongs to the configured entrance and period.",
      "Mesure physique : les seuils d'entrée sélectionnés sont mesurés directement lorsque les personnes entrent ou sortent. Chaque comptage est rattaché à l'entrée et à la période configurées.",
      "Physische Messung: Ausgewählte Eingangsschwellen werden direkt erfasst, wenn Menschen hinein- oder hinausgehen. Jede Zählung gehört zum konfigurierten Eingang und Zeitraum.",
    ),
    sourceRefs: [
      storyScene(41),
      matrixScene(41),
      technologyCapability(6),
    ],
  },
  {
    segmentId: "outlet-centre",
    capabilityId: "TECH-03",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Physical entrance events provide the input; a permitted, configured classification then derives visitor or buying-unit patterns. The output stays at the selected category level.",
      "Les événements physiques aux entrées fournissent la donnée source ; une classification configurée et autorisée en déduit ensuite des profils de visiteurs ou d'unités d'achat. Le résultat reste au niveau de catégorie sélectionné.",
      "Physische Eingangsereignisse liefern die Quelle; eine konfigurierte und zulässige Klassifikation leitet daraus Besucher- oder Kaufeinheitsmuster ab. Das Ergebnis bleibt auf der ausgewählten Kategorieebene.",
    ),
    sourceRefs: [
      storyScene(42),
      matrixScene(42),
      technologyCapability(7),
    ],
  },
  {
    segmentId: "outlet-centre",
    capabilityId: "TECH-04",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "business", "insight"],
    copy: copy(
      "Physical measurement: configured IP-camera views record movement across lines between outlet streets, zones and anchor areas. Derived circulation uses those events only inside covered views and mapped areas.",
      "Mesure physique : des vues de caméras IP configurées enregistrent les déplacements qui franchissent les lignes entre rues, zones et espaces d'ancrage de l'outlet. La circulation déduite utilise ces événements uniquement dans les vues couvertes et les zones cartographiées.",
      "Physische Messung: Konfigurierte IP-Kameraansichten erfassen Bewegungen über Linien zwischen Outlet-Straßen, Zonen und Ankerbereichen. Die abgeleitete Zirkulation nutzt diese Ereignisse nur innerhalb der abgedeckten Ansichten und zugeordneten Bereiche.",
    ),
    sourceRefs: [
      storyScene(44),
      storyScene(45),
      storyScene(46),
      storyScene(47),
      matrixScene(44),
      technologyCapability(8),
    ],
  },
  {
    segmentId: "outlet-centre",
    capabilityId: "TECH-05",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Physical observations from configured store views can be matched into a visit or journey where the measurement design supports it. Derived brand flow and time remain limited to covered views and definitions.",
      "Les observations physiques issues des vues configurées des magasins peuvent être appariées pour former une visite ou un parcours lorsque la conception de mesure le permet. Le flux entre marques et le temps déduits restent limités aux vues couvertes et aux définitions établies.",
      "Physische Beobachtungen aus konfigurierten Store-Ansichten können zu einem Besuch oder Weg zusammengeführt werden, wenn das Messdesign dies unterstützt. Der abgeleitete Markenfluss und die Zeit bleiben auf abgedeckte Ansichten und Definitionen begrenzt.",
    ),
    sourceRefs: [
      storyScene(43),
      storyScene(47),
      matrixScene(43),
      technologyCapability(9),
    ],
  },
  {
    segmentId: "outlet-centre",
    capabilityId: "TECH-06",
    methodTypes: ["physical", "business_input", "derived"],
    dataRoles: ["physical", "business", "insight"],
    copy: copy(
      "Physical vehicle or parking events mark arrivals, exits and occupancy at configured points. Derived arrival and pressure patterns use those events with the destination's capacity and area definitions.",
      "Les événements physiques liés aux véhicules ou au stationnement marquent les arrivées, sorties et occupations aux points configurés. Les profils d'arrivée et de pression déduits utilisent ces événements avec les définitions de capacité et de zone de la destination.",
      "Physische Fahrzeug- oder Parkereignisse markieren Ankünfte, Abfahrten und Belegung an konfigurierten Punkten. Abgeleitete Ankunfts- und Druckmuster nutzen diese Ereignisse zusammen mit den Kapazitäts- und Bereichsdefinitionen der Destination.",
    ),
    sourceRefs: [
      storyScene(40),
      storyScene(48),
      storyScene(49),
      matrixScene(40),
      technologyCapability(10),
    ],
  },
  {
    segmentId: "outlet-centre",
    capabilityId: "TECH-07",
    methodTypes: ["geo_context", "derived"],
    dataRoles: ["mobile_geo", "insight"],
    copy: copy(
      "Geo context: an approved aggregate mobility or origin source adds reach and origin context around the destination. It complements physical visits and does not measure an entrance.",
      "Contexte géographique : une source agrégée approuvée de mobilité ou d'origine ajoute un contexte de portée et d'origine autour de la destination. Elle complète les visites physiques et ne mesure pas une entrée.",
      "Geo-Kontext: Eine freigegebene aggregierte Mobilitäts- oder Herkunftsquelle ergänzt Reichweiten- und Herkunftskontext rund um die Destination. Sie ergänzt physische Besuche und misst keinen Eingang.",
    ),
    sourceRefs: [
      storyScene(37),
      storyScene(38),
      storyScene(39),
      storyScene(49),
      matrixScene(37),
      technologyCapability(11),
    ],
  },

  /* ---------------------------------------------------------------------- *
     Drive-Thru Performance
   * ---------------------------------------------------------------------- */
  {
    segmentId: "qsr",
    capabilityId: "TECH-QSR-01",
    methodTypes: ["physical"],
    dataRoles: ["physical"],
    copy: copy(
      "Physical measurement: compatible detection points mark where a vehicle enters each configured part of the drive-thru journey. Those events provide the points from which a journey timeline can be calculated.",
      "Mesure physique : des points de détection compatibles indiquent où un véhicule entre dans chaque partie configurée du parcours drive. Ces événements fournissent les points à partir desquels une chronologie peut être calculée.",
      "Physische Messung: Kompatible Erkennungspunkte markieren, wo ein Fahrzeug in jeden konfigurierten Teil der Drive-Thru-Fahrt eintritt. Diese Ereignisse bilden die Punkte für die Berechnung einer Zeitlinie.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability A`, `${qsrSpec}: §6 Scene 0`, `${qsrSpec}: §7 Scenes 1–2`],
  },
  {
    segmentId: "qsr",
    capabilityId: "TECH-QSR-02",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Physical measurement: timestamps from configured vehicle points are compared to form stage, queue and lane times. Derived durations depend on named start and end points and the measurement period; timing alone does not explain cause.",
      "Mesure physique : les horodatages des points véhicule configurés sont comparés pour former les temps d'étape, de file et de voie. Les durées déduites dépendent des points de début et de fin nommés et de la période de mesure ; le temps seul n'explique pas la cause.",
      "Physische Messung: Zeitstempel von konfigurierten Fahrzeugpunkten werden verglichen, um Abschnitts-, Warte- und Spurzeiten zu bilden. Abgeleitete Dauern hängen von benannten Start- und Endpunkten sowie dem Messzeitraum ab; die Zeit allein erklärt keine Ursache.",
    ),
    sourceRefs: [
      `${qsrSpec}: §5 Capability B`,
      `${qsrSpec}: §6 Scene 0`,
      `${qsrSpec}: §7 Scenes 1–5`,
      `${qsrSpec}: §8 Scene 7–8`,
    ],
  },
  {
    segmentId: "qsr",
    capabilityId: "TECH-QSR-03",
    methodTypes: ["operational"],
    dataRoles: [],
    copy: copy(
      "Operational method: a compatible communication setup connects the guest at the order point with the crew. Available functions depend on the selected tier and configuration; this is not a measurement of service time.",
      "Méthode opérationnelle : une configuration de communication compatible relie le client au point de commande à l'équipe. Les fonctions disponibles dépendent du niveau et de la configuration choisis ; ce n'est pas une mesure du temps de service.",
      "Betriebliche Methode: Eine kompatible Kommunikationskonfiguration verbindet den Gast am Bestellpunkt mit dem Team. Verfügbare Funktionen hängen von der gewählten Stufe und Konfiguration ab; dies misst keine Servicezeit.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability C`, `${qsrSpec}: §7 Scene 3`, `${qsrSpec}: §8 Scene 8`],
  },
  {
    segmentId: "qsr",
    capabilityId: "TECH-QSR-04",
    methodTypes: ["operational"],
    dataRoles: [],
    copy: copy(
      "Operational method: compatible audio processing can reduce noise and echo in the guest-to-crew conversation. It is a communication option, not a measurement of order accuracy or service performance.",
      "Méthode opérationnelle : un traitement audio compatible peut réduire le bruit et l'écho dans l'échange entre le client et l'équipe. C'est une option de communication, pas une mesure de l'exactitude des commandes ni de la performance du service.",
      "Betriebliche Methode: Kompatible Audioverarbeitung kann Rauschen und Echo im Gespräch zwischen Gast und Team verringern. Sie ist eine Kommunikationsoption, keine Messung von Bestellgenauigkeit oder Serviceleistung.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability D`, `${qsrSpec}: §7 Scene 3`],
  },
  {
    segmentId: "qsr",
    capabilityId: "TECH-QSR-06",
    methodTypes: ["physical", "business_input", "derived"],
    dataRoles: ["physical", "business", "insight"],
    copy: copy(
      "Derived method: a measured threshold event and a configured service target are passed into a compatible communication workflow so a person can respond. The alert supports a decision; it does not guarantee an operational outcome.",
      "Méthode déduite : un événement de seuil mesuré et un objectif de service configuré sont transmis à un flux de communication compatible pour permettre une réponse humaine. L'alerte aide à décider ; elle ne garantit pas un résultat opérationnel.",
      "Abgeleitete Methode: Ein gemessenes Schwellenereignis und ein konfiguriertes Serviceziel werden in einen kompatiblen Kommunikationsablauf übergeben, damit eine Person reagieren kann. Die Meldung unterstützt eine Entscheidung und garantiert kein betriebliches Ergebnis.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability F`, `${qsrSpec}: §8 Scene 8`],
  },
  {
    segmentId: "qsr",
    capabilityId: "TECH-QSR-07",
    methodTypes: ["business_input", "derived"],
    dataRoles: ["physical", "business", "insight"],
    copy: copy(
      "Business input: compatible site, hierarchy, daypart and period definitions are aligned with measured service times. Derived comparisons show only like-for-like periods and definitions.",
      "Donnée métier : les définitions compatibles de site, hiérarchie, tranche horaire et période sont alignées sur les temps de service mesurés. Les comparaisons déduites ne montrent que des périodes et définitions comparables.",
      "Geschäftsdaten: Kompatible Definitionen für Standort, Hierarchie, Tagesabschnitt und Zeitraum werden mit gemessenen Servicezeiten abgeglichen. Abgeleitete Vergleiche zeigen nur vergleichbare Zeiträume und Definitionen.",
    ),
    sourceRefs: [`${qsrSpec}: §5 Capability G`, `${qsrSpec}: §8 Scene 7`, `${qsrSpec}: §9 Scene 10`],
  },

  /* ---------------------------------------------------------------------- *
     Retail
   * ---------------------------------------------------------------------- */
  {
    segmentId: "retail",
    capabilityId: "TECH-01",
    methodTypes: ["physical"],
    dataRoles: ["physical"],
    copy: copy(
      "Physical measurement: movement crossing a configured line along the shopfront is counted by direction and period. It describes the passing opportunity; it does not count store visits.",
      "Mesure physique : les mouvements qui franchissent une ligne configurée le long de la façade sont comptés par direction et par période. Ils décrivent l'opportunité de passage ; ils ne comptent pas les visites en magasin.",
      "Physische Messung: Bewegungen über eine konfigurierte Linie an der Fassade werden nach Richtung und Zeitraum gezählt. Sie beschreibt die Passantenchance und zählt keine Store-Besuche.",
    ),
    sourceRefs: [storyScene(5), matrixScene(5), technologyCapability(5)],
  },
  {
    segmentId: "retail",
    capabilityId: "TECH-02",
    methodTypes: ["physical"],
    dataRoles: ["physical"],
    copy: copy(
      "Physical measurement: configured entry and exit lines at the doorway record anonymous movement through the threshold. Entries, exits and visits remain separate measures.",
      "Mesure physique : des lignes d'entrée et de sortie configurées à la porte enregistrent les mouvements anonymes qui franchissent le seuil. Les entrées, sorties et visites restent des mesures distinctes.",
      "Physische Messung: Konfigurierte Ein- und Ausgangslinien an der Tür erfassen anonyme Bewegungen über die Schwelle. Eintritte, Austritte und Besuche bleiben getrennte Messgrößen.",
    ),
    sourceRefs: [storyScene(6), matrixScene(6), technologyCapability(6)],
  },
  {
    segmentId: "retail",
    capabilityId: "TECH-03",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Physical entrance events provide the input; a permitted, configured classification then derives visitor or buying-unit patterns. The output stays at the selected category level.",
      "Les événements physiques aux entrées fournissent la donnée source ; une classification configurée et autorisée en déduit ensuite des profils de visiteurs ou d'unités d'achat. Le résultat reste au niveau de catégorie sélectionné.",
      "Physische Eingangsereignisse liefern die Quelle; eine konfigurierte und zulässige Klassifikation leitet daraus Besucher- oder Kaufeinheitsmuster ab. Das Ergebnis bleibt auf der ausgewählten Kategorieebene.",
    ),
    sourceRefs: [storyScene(7), matrixScene(7), technologyCapability(7)],
  },
  {
    segmentId: "retail",
    capabilityId: "TECH-04",
    methodTypes: ["physical", "business_input", "derived"],
    dataRoles: ["physical", "business", "insight"],
    copy: copy(
      "Physical measurement: configured sensors observe movement, presence and time within defined zones. Derived routes, zone visits and dwell use those events with the location's zone definitions.",
      "Mesure physique : des capteurs configurés observent les mouvements, la présence et le temps passé dans des zones définies. Les parcours, visites de zones et temps de présence déduits utilisent ces événements avec les définitions de zones du lieu.",
      "Physische Messung: Konfigurierte Sensoren erfassen Bewegung, Präsenz und Zeit in definierten Zonen. Abgeleitete Wege, Zonenbesuche und Verweildauer nutzen diese Ereignisse zusammen mit den Zonendefinitionen des Standorts.",
    ),
    sourceRefs: [storyScene(9), storyScene(11), matrixScene(9), technologyCapability(8)],
  },
  {
    segmentId: "retail",
    capabilityId: "TECH-08",
    methodTypes: ["business_input", "derived"],
    dataRoles: ["business", "insight"],
    copy: copy(
      "Business input: customer-supplied transactions, sales or operating context is connected to physical movement evidence. Derived comparisons need aligned fields, area and period; the connection itself is not a result.",
      "Donnée métier : les transactions, ventes ou éléments opérationnels fournis par le client sont reliés aux preuves de mouvement physique. Les comparaisons déduites exigent des champs, une zone et une période alignés ; la connexion elle-même n'est pas un résultat.",
      "Geschäftsdaten: Vom Kunden gelieferte Transaktionen, Verkäufe oder betriebliche Zusammenhänge werden mit physischen Bewegungsnachweisen verbunden. Abgeleitete Vergleiche brauchen abgestimmte Felder, Bereiche und Zeiträume; die Verbindung selbst ist kein Ergebnis.",
    ),
    sourceRefs: [storyScene(10), storyScene(12), storyScene(13), matrixScene(13), technologyCapability(12)],
  },

  /* ---------------------------------------------------------------------- *
     Retail Park
   * ---------------------------------------------------------------------- */
  {
    segmentId: "retail-park",
    capabilityId: "TECH-02",
    methodTypes: ["physical"],
    dataRoles: ["physical"],
    copy: copy(
      "Physical measurement: a sensor over each chosen unit entrance records anonymous crossings in and out, keeping unit visits tied to the configured threshold.",
      "Mesure physique : un capteur placé au-dessus de chaque entrée d'unité sélectionnée enregistre les franchissements anonymes entrants et sortants, en rattachant les visites à leur seuil configuré.",
      "Physische Messung: Ein Sensor über jedem ausgewählten Einheiteneingang erfasst anonyme Ein- und Austritte und ordnet die Besuche der konfigurierten Schwelle zu.",
    ),
    sourceRefs: [storyScene(31), storyScene(35), matrixScene(31), technologyCapability(6)],
  },
  {
    segmentId: "retail-park",
    capabilityId: "TECH-05",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Physical observations from configured unit views may be matched to form a cross-visitation or time-on-site view when the design supports it. Derived journeys stay within covered views and definitions.",
      "Les observations physiques issues des vues configurées des unités peuvent être appariées pour former une vue de cross-visite ou de temps passé sur site lorsque la conception le permet. Les parcours déduits restent dans les vues couvertes et les définitions établies.",
      "Physische Beobachtungen aus konfigurierten Einheitenansichten können zu einer Cross-Visitation- oder Aufenthaltsansicht zusammengeführt werden, wenn das Design dies unterstützt. Abgeleitete Wege bleiben auf abgedeckte Ansichten und Definitionen begrenzt.",
    ),
    sourceRefs: [storyScene(33), storyScene(34), matrixScene(33), technologyCapability(9)],
  },
  {
    segmentId: "retail-park",
    capabilityId: "TECH-06",
    methodTypes: ["physical", "business_input", "derived"],
    dataRoles: ["physical", "business", "insight"],
    copy: copy(
      "Physical vehicle and parking events mark arrivals, exits and occupancy at configured points. Derived patterns require customer-supplied capacity or area definitions alongside those events.",
      "Les événements physiques liés aux véhicules et au stationnement marquent les arrivées, sorties et occupations aux points configurés. Les profils déduits exigent, avec ces événements, les définitions de capacité ou de zone fournies par le client.",
      "Physische Fahrzeug- und Parkereignisse markieren Ankünfte, Abfahrten und Belegung an konfigurierten Punkten. Abgeleitete Muster benötigen neben diesen Ereignissen vom Kunden gelieferte Kapazitäts- oder Bereichsdefinitionen.",
    ),
    sourceRefs: [storyScene(29), storyScene(30), matrixScene(29), technologyCapability(10)],
  },
  {
    segmentId: "retail-park",
    capabilityId: "TECH-07",
    methodTypes: ["geo_context", "derived"],
    dataRoles: ["mobile_geo", "insight"],
    copy: copy(
      "Geo context: an approved aggregate mobility source adds catchment and origin context around the park. It can enrich the physical story, but it does not measure unit entrances or parking events.",
      "Contexte géographique : une source agrégée approuvée de mobilité ajoute un contexte de zone d'attraction et d'origine autour du parc. Elle enrichit le récit physique, mais ne mesure ni les entrées des unités ni les événements de stationnement.",
      "Geo-Kontext: Eine freigegebene aggregierte Mobilitätsquelle ergänzt Einzugsgebiets- und Herkunftskontext rund um den Park. Sie kann die physische Geschichte anreichern, misst aber weder Einheiteneingänge noch Parkereignisse.",
    ),
    sourceRefs: [storyScene(27), matrixScene(27), technologyCapability(11)],
  },

  /* ---------------------------------------------------------------------- *
     Shopping Centre
   * ---------------------------------------------------------------------- */
  {
    segmentId: "shopping-centre",
    capabilityId: "TECH-02",
    methodTypes: ["physical"],
    dataRoles: ["physical"],
    copy: copy(
      "Physical measurement: sensors at selected entrances and access routes record movement through each configured threshold. Entries, exits and movement between floors remain tied to the measured threshold.",
      "Mesure physique : des capteurs placés aux entrées et accès sélectionnés enregistrent les mouvements à chaque seuil configuré. Les entrées, sorties et déplacements entre niveaux restent rattachés au seuil mesuré.",
      "Physische Messung: Sensoren an ausgewählten Eingängen und Zugangswegen erfassen Bewegungen über jede konfigurierte Schwelle. Eintritte, Austritte und Bewegungen zwischen Etagen bleiben an die gemessene Schwelle gebunden.",
    ),
    sourceRefs: [storyScene(17), storyScene(22), matrixScene(17), technologyCapability(6)],
  },
  {
    segmentId: "shopping-centre",
    capabilityId: "TECH-03",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Physical entrance events provide the input; a permitted, configured classification then derives visitor or buying-unit patterns. The output stays at the selected category level.",
      "Les événements physiques aux entrées fournissent la donnée source ; une classification configurée et autorisée en déduit ensuite des profils de visiteurs ou d'unités d'achat. Le résultat reste au niveau de catégorie sélectionné.",
      "Physische Eingangsereignisse liefern die Quelle; eine konfigurierte und zulässige Klassifikation leitet daraus Besucher- oder Kaufeinheitsmuster ab. Das Ergebnis bleibt auf der ausgewählten Kategorieebene.",
    ),
    sourceRefs: [storyScene(18), matrixScene(18), technologyCapability(7)],
  },
  {
    segmentId: "shopping-centre",
    capabilityId: "TECH-04",
    methodTypes: ["physical", "business_input", "derived"],
    dataRoles: ["physical", "business", "insight"],
    copy: copy(
      "Physical measurement: compatible camera views observe movement in configured areas. Derived routes link observations across covered views using floor, corridor, zone and anchor definitions; uncovered areas remain outside the measurement.",
      "Mesure physique : des vues de caméras compatibles observent les mouvements dans des zones configurées. Les parcours déduits relient les observations entre vues couvertes à l'aide des définitions d'étage, de couloir, de zone et d'enseigne phare ; les zones non couvertes restent hors mesure.",
      "Physische Messung: Kompatible Kameraansichten beobachten Bewegungen in konfigurierten Bereichen. Abgeleitete Wege verbinden Beobachtungen über abgedeckte Ansichten hinweg anhand von Etagen-, Korridor-, Zonen- und Ankerdefinitionen; nicht abgedeckte Bereiche bleiben außerhalb der Messung.",
    ),
    sourceRefs: [storyScene(20), storyScene(21), matrixScene(20), technologyCapability(8)],
  },
  {
    segmentId: "shopping-centre",
    capabilityId: "TECH-05",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Physical observations from compatible covered views may be matched into a visit or journey when the configured design supports it. Derived dwell and movement stay within those views and definitions.",
      "Les observations physiques issues de vues couvertes compatibles peuvent être appariées pour former une visite ou un parcours lorsque la configuration le permet. Le temps de présence et le mouvement déduits restent dans ces vues et définitions.",
      "Physische Beobachtungen aus kompatiblen abgedeckten Ansichten können zu einem Besuch oder Weg zusammengeführt werden, wenn die konfigurierte Auslegung dies unterstützt. Abgeleitete Verweildauer und Bewegung bleiben auf diese Ansichten und Definitionen begrenzt.",
    ),
    sourceRefs: [storyScene(19), storyScene(23), matrixScene(19), technologyCapability(9)],
  },
  {
    segmentId: "shopping-centre",
    capabilityId: "TECH-07",
    methodTypes: ["geo_context", "derived"],
    dataRoles: ["mobile_geo", "insight"],
    copy: copy(
      "Geo context: an approved aggregate mobility source adds catchment and origin context around the centre. It complements on-site measurement and cannot replace entrance events.",
      "Contexte géographique : une source agrégée approuvée de mobilité ajoute un contexte de zone d'attraction et d'origine autour du centre. Elle complète la mesure sur site et ne peut pas remplacer les événements d'entrée.",
      "Geo-Kontext: Eine freigegebene aggregierte Mobilitätsquelle ergänzt Einzugsgebiets- und Herkunftskontext rund um das Zentrum. Sie ergänzt die Messung vor Ort und kann keine Eingangsergebnisse ersetzen.",
    ),
    sourceRefs: [storyScene(15), matrixScene(15), technologyCapability(11)],
  },
] as const;

/** Alias retained for callers that prefer the singular content name. */
export const drawerMethodCopy = drawerMethodCopies;

/** Two scenes use a different method from their segment's usual capability. */
export const sceneMethodCopies: readonly (DrawerMethodCopy & { sceneId: SceneId })[] = [
  {
    sceneId: "shopping-centre-internal-circulation",
    segmentId: "shopping-centre",
    capabilityId: "TECH-02",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Physical measurement: 3D sensors count crossings at configured access routes, floor transitions and zone boundaries. A movement reading combines only those measured crossings; it is not a continuous path through uncovered space.",
      "Mesure physique : des capteurs 3D comptent les passages aux accès, transitions entre niveaux et limites de zones configurés. Une lecture du mouvement combine uniquement ces passages mesurés ; ce n'est pas un parcours continu dans les espaces non couverts.",
      "Physische Messung: 3D-Sensoren zählen Querungen an konfigurierten Zugängen, Etagenübergängen und Zonengrenzen. Eine Bewegungsdarstellung verbindet nur diese gemessenen Querungen; sie ist kein durchgehender Weg durch nicht abgedeckte Bereiche.",
    ),
    sourceRefs: [
      "app/content/scene-drawer-overrides.ts: shopping-centre-internal-circulation, product lead direction 2026-09-27",
      `${matrix}: PFM Matrix!A20:P20`,
    ],
  },
  {
    sceneId: "outlet-centre-time-in-destination",
    segmentId: "outlet-centre",
    capabilityId: "TECH-06",
    methodTypes: ["physical", "derived"],
    dataRoles: ["physical", "insight"],
    copy: copy(
      "Vehicle method: where lawful and configured, a registration plate is read on arrival and again on departure. Plate data is not anonymous. The interval describes a vehicle's time on site, not a person's visit duration.",
      "Méthode véhicule : lorsque c'est légal et configuré, une plaque est lue à l'arrivée puis au départ. Les données de plaque ne sont pas anonymes. L'intervalle décrit le temps de présence d'un véhicule, pas la durée de visite d'une personne.",
      "Fahrzeugmethode: Wo rechtmäßig und konfiguriert, wird ein Kennzeichen bei Ankunft und erneut bei Abfahrt gelesen. Kennzeichendaten sind nicht anonym. Das Intervall beschreibt die Aufenthaltsdauer eines Fahrzeugs, nicht die Besuchsdauer einer Person.",
    ),
    sourceRefs: [
      "app/content/scene-drawer-overrides.ts: outlet-centre-time-in-destination, product lead direction 2026-09-27",
      `${matrix}: PFM Matrix!A48:P48`,
    ],
  },
];

export function getDrawerMethodCopy(
  segmentId: SegmentId,
  capabilityId: TechnologyCapabilityId,
  sceneId?: SceneId,
): DrawerMethodCopy | null {
  if (sceneId) {
    const sceneMethod = sceneMethodCopies.find(
      (entry) => entry.sceneId === sceneId && entry.segmentId === segmentId && entry.capabilityId === capabilityId,
    );
    if (sceneMethod) return sceneMethod;
  }
  return (
    drawerMethodCopies.find(
      (entry) => entry.segmentId === segmentId && entry.capabilityId === capabilityId,
    ) ?? null
  );
}

export function resolveDrawerMethodCopy(
  locale: Locale,
  segmentId: SegmentId,
  capabilityId: TechnologyCapabilityId,
  sceneId?: SceneId,
): string | null {
  return getDrawerMethodCopy(segmentId, capabilityId, sceneId)?.copy[locale] ?? null;
}
