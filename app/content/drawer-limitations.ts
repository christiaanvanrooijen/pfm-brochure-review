/**
 * Technology-card limitation copy that has been reviewed against the filled
 * content inventory and the typed implementation model.
 *
 * The workbook is a source of candidate wording, not a second technology
 * model. A limitation is promoted here only when the typed model or its
 * mapped source supports the boundary it states. Entries that remain
 * product- or privacy-uncertain are intentionally absent; the Technology
 * card falls back to `unsupportedClaims[0]` for those implementations.
 *
 * Every promoted sentence keeps the workbook cell and the model/source
 * locator beside it. These references are internal traceability only and are
 * never rendered in the drawer.
 */

import type { Locale } from "../i18n/locales.ts";
import type { TechnologyImplementationId } from "./types.ts";

export interface DrawerLimitation {
  implementationId: TechnologyImplementationId;
  copy: Readonly<Record<Locale, string>>;
  sourceRefs: readonly string[];
}

const workbook = "docs/content/PFM-drawer-content-inventory.xlsx";
const technologyModel = "app/content/technology.ts";
const drilldownModel = "docs/product/TECHNOLOGY-DRILLDOWN-MODEL.md";
const qsrSpec = "docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md";
const registry = "docs/reference/technology/SOURCE-REGISTRY.md";

const workbookCell = (row: number): string => `${workbook}: Implementations!P${row}`;
const modelClaim = (implementationId: TechnologyImplementationId, field: string): string =>
  `${technologyModel}: ${implementationId}.${field}`;
const copy = (en: string, fr: string, de: string): Readonly<Record<Locale, string>> => ({
  en,
  fr,
  de,
});

/**
 * Safe workbook overrides. The intentionally unlisted workbook rows include
 * Isarsoft and anonymous matching: their candidate wording describes
 * re-identification mechanics or privacy behaviour that the source registry
 * explicitly leaves unmapped, so those cards retain the model's blocked claim.
 */
export const drawerLimitations: readonly DrawerLimitation[] = [
  {
    implementationId: "impl-aggregate-geo-mobility",
    copy: copy(
      "Aggregate mobility context cannot replace directly measured entrances or establish an individual visitor’s origin.",
      "Le contexte agrégé de mobilité ne peut pas remplacer les entrées mesurées directement ni établir l’origine d’un visiteur individuel.",
      "Aggregierter Mobilitätskontext kann direkt gemessene Eingänge nicht ersetzen und nicht die Herkunft eines einzelnen Besuchers feststellen.",
    ),
    sourceRefs: [
      workbookCell(3),
      modelClaim("impl-aggregate-geo-mobility", "unsupportedClaims[0]"),
      `${technologyModel}: Technology library!A11:G11 / TECH-07 privacy principle`,
      `${drilldownModel}: Technology library!F11; Capability-to-implementation map for TECH-07`,
    ],
  },
  {
    implementationId: "impl-business-data-connection",
    copy: copy(
      "A business-data connection does not measure movement; calculated metrics require customer-approved data and aligned definitions.",
      "Une connexion de données métier ne mesure pas les mouvements ; les indicateurs calculés exigent des données approuvées par le client et des définitions alignées.",
      "Eine Geschäftsdatenverbindung misst keine Bewegung; berechnete Kennzahlen erfordern vom Kunden freigegebene Daten und abgestimmte Definitionen.",
    ),
    sourceRefs: [
      workbookCell(5),
      modelClaim("impl-business-data-connection", "unsupportedClaims[0]"),
      `${technologyModel}: Technology library!A12:G12 / TECH-08 privacy principle`,
      `${drilldownModel}: Technology library!F12; Capability-to-implementation map for TECH-08`,
    ],
  },
  {
    implementationId: "impl-compatible-vehicle-detection",
    copy: copy(
      "A vehicle trigger detects a vehicle at its configured point; it does not count people, orders or completed visits.",
      "Un déclencheur véhicule détecte un véhicule à son point configuré ; il ne compte ni les personnes, ni les commandes, ni les visites terminées.",
      "Ein Fahrzeug-Trigger erkennt ein Fahrzeug an seinem konfigurierten Punkt; er zählt weder Personen noch Bestellungen oder abgeschlossene Besuche.",
    ),
    sourceRefs: [
      workbookCell(6),
      modelClaim("impl-compatible-vehicle-detection", "supportedClaims[0]"),
      `${qsrSpec}: §5 Capability A — Vehicle journey detection`,
      `${qsrSpec}: §5 Capability E — Order context is a separate compatible input`,
    ],
  },
  {
    implementationId: "impl-configured-classification",
    copy: copy(
      "Classification is an estimate available only for supported, configured attributes; it cannot establish a person’s identity or intent.",
      "La classification est une estimation disponible uniquement pour les attributs pris en charge et configurés ; elle ne permet pas d’établir l’identité ou l’intention d’une personne.",
      "Klassifikation ist eine Schätzung, die nur für unterstützte und konfigurierte Attribute verfügbar ist; sie stellt weder die Identität noch die Absicht einer Person fest.",
    ),
    sourceRefs: [
      workbookCell(7),
      modelClaim("impl-configured-classification", "supportedClaims[0]"),
      `${technologyModel}: Technology library!A7:G7 / TECH-03 privacy principle`,
      `${drilldownModel}: Definitions & guardrails!A9:B9; Technology-specific guardrails`,
    ],
  },
  {
    implementationId: "impl-hme-clearsoundx",
    copy: copy(
      "Audio processing supports communication but cannot by itself establish order accuracy or service performance.",
      "Le traitement audio facilite la communication, mais ne peut à lui seul établir l’exactitude des commandes ou la performance du service.",
      "Audioverarbeitung unterstützt die Kommunikation, stellt aber allein weder Bestellgenauigkeit noch Serviceleistung fest.",
    ),
    sourceRefs: [
      workbookCell(8),
      modelClaim("impl-hme-clearsoundx", "supportedClaims[0]"),
      modelClaim("impl-hme-clearsoundx", "unsupportedClaims[0]"),
      `${qsrSpec}: §5 Capability D — Audio clarity`,
    ],
  },
  {
    implementationId: "impl-hme-nexeo",
    copy: copy(
      "Crew communication does not measure visits, orders or service time without a separately configured measurement source.",
      "La communication d’équipe ne mesure ni les visites, ni les commandes, ni le temps de service sans une source de mesure configurée séparément.",
      "Teamkommunikation misst ohne eine separat konfigurierte Messquelle weder Besuche noch Bestellungen oder Servicezeit.",
    ),
    sourceRefs: [
      workbookCell(9),
      modelClaim("impl-hme-nexeo", "supportedClaims[0]"),
      `${qsrSpec}: §5 Capabilities A–C — detection and timing are separate from communication`,
      `${drilldownModel}: QSR capability-to-implementation map, TECH-QSR-03`,
    ],
  },
  {
    implementationId: "impl-hme-nexeo-core",
    copy: copy(
      "The Core configuration cannot be assumed to include every option of the wider communication range, or a site-specific integration.",
      "La configuration Core ne peut pas être supposée inclure toutes les options de la gamme de communication, ni une intégration propre au site.",
      "Bei der Core-Konfiguration kann nicht vorausgesetzt werden, dass sie jede Option der breiteren Kommunikationsreihe oder eine standortspezifische Integration enthält.",
    ),
    sourceRefs: [
      workbookCell(10),
      modelClaim("impl-hme-nexeo-core", "unsupportedClaims[0]"),
      `${qsrSpec}: §15 Product / capability truth table`,
      `${qsrSpec}: §21 Availability and confidence states`,
    ],
  },
  {
    implementationId: "impl-hme-nexeo-pro",
    copy: copy(
      "The Pro configuration cannot be assumed to include every integration or deliver a service outcome at a given site.",
      "La configuration Pro ne peut pas être supposée inclure toutes les intégrations ni produire un résultat de service sur un site donné.",
      "Bei der Pro-Konfiguration kann nicht vorausgesetzt werden, dass sie jede Integration umfasst oder an einem bestimmten Standort ein Serviceergebnis liefert.",
    ),
    sourceRefs: [
      workbookCell(11),
      modelClaim("impl-hme-nexeo-pro", "unsupportedClaims[0]"),
      modelClaim("impl-hme-nexeo-pro", "unsupportedClaims[2]"),
      `${qsrSpec}: §5 Capability I — voice AI requires a separate compatible provider`,
      `${qsrSpec}: §21 Availability and confidence states`,
    ],
  },
  {
    implementationId: "impl-hme-zoom-nitro-data-cloud",
    copy: copy(
      "Aggregated timing data does not explain why a stage takes longer or prove an operational cause.",
      "Les données de temps agrégées n’expliquent pas pourquoi une étape dure plus longtemps et ne prouvent pas une cause opérationnelle.",
      "Aggregierte Zeitdaten erklären nicht, warum ein Abschnitt länger dauert, und belegen keine betriebliche Ursache.",
    ),
    sourceRefs: [
      workbookCell(13),
      modelClaim("impl-hme-zoom-nitro-data-cloud", "unsupportedClaims[1]"),
      `${qsrSpec}: §5 Capability G — Enterprise performance intelligence`,
      `${drilldownModel}: QSR technology guardrails — timing does not establish cause`,
    ],
  },
  {
    implementationId: "impl-hme-zoom-nitro-nexeo-alerting",
    copy: copy(
      "An alert signals a configured event; it does not choose an action or guarantee a response.",
      "Une alerte signale un événement configuré ; elle ne choisit pas l’action et ne garantit pas une réponse.",
      "Eine Meldung signalisiert ein konfiguriertes Ereignis; sie wählt keine Handlung und garantiert keine Reaktion.",
    ),
    sourceRefs: [
      workbookCell(14),
      modelClaim("impl-hme-zoom-nitro-nexeo-alerting", "supportedClaims[0]"),
      modelClaim("impl-hme-zoom-nitro-nexeo-alerting", "unsupportedClaims[0]"),
      `${qsrSpec}: §5 Capability F — Alerts into the workflow`,
    ],
  },
  {
    implementationId: "impl-hme-zoom-nitro-timer",
    copy: copy(
      "Stage timing measures elapsed time between configured points; it does not prove order accuracy, throughput improvement or causality.",
      "Le temps d’étape mesure la durée entre des points configurés ; il ne prouve ni l’exactitude des commandes, ni une amélioration du débit, ni la causalité.",
      "Abschnittszeiten messen die verstrichene Zeit zwischen konfigurierten Punkten; sie belegen weder Bestellgenauigkeit noch eine Durchsatzverbesserung oder Kausalität.",
    ),
    sourceRefs: [
      workbookCell(15),
      modelClaim("impl-hme-zoom-nitro-timer", "unsupportedClaims[0]"),
      modelClaim("impl-hme-zoom-nitro-timer", "unsupportedClaims[1]"),
      `${qsrSpec}: §5 Capability B — Real-time drive-thru timing`,
    ],
  },
  {
    implementationId: "impl-lawful-anpr-lpr",
    copy: copy(
      "Plate recognition detects vehicle registrations under a defined lawful purpose; it cannot identify visitors or infer footfall.",
      "La reconnaissance des plaques détecte des immatriculations dans le cadre d’une finalité légale définie ; elle ne permet pas d’identifier les visiteurs ni d’inférer la fréquentation.",
      "Kennzeichenerkennung erfasst Fahrzeugzulassungen für einen festgelegten rechtmäßigen Zweck; sie identifiziert keine Besucher und leitet keine Besucherfrequenz ab.",
    ),
    sourceRefs: [
      workbookCell(17),
      modelClaim("impl-lawful-anpr-lpr", "supportedClaims[0]"),
      `${technologyModel}: Technology library!A10:G10 / TECH-06 privacy principle`,
      `${drilldownModel}: Definitions & guardrails!A14:B14; Technology-specific guardrails`,
    ],
  },
  {
    implementationId: "impl-lidar-spatial",
    copy: copy(
      // Rewritten 2026-09-28: the brochure names no model (product-lead rule,
      // 2026-09-27), and "the mapped sensor source" was internal wording.
      "The sensor outputs a point cloud. Its own documentation does not cover how visitors move; that depends on a separate analytics layer.",
      "Le capteur produit un nuage de points. Sa propre documentation ne couvre pas la manière dont les visiteurs se déplacent ; cela dépend d’une couche d’analytique distincte.",
      "Der Sensor gibt eine Punktwolke aus. Seine eigene Dokumentation deckt nicht ab, wie sich Besucher bewegen; das hängt von einer separaten Analytikschicht ab.",
    ),
    sourceRefs: [
      workbookCell(18),
      modelClaim("impl-lidar-spatial", "supportedClaims[2]"),
      modelClaim("impl-lidar-spatial", "unsupportedClaims[0]"),
      `${registry}: SRC-ROBOSENSE-AIRY-TECH-001 — retail people-movement measurement and analytics are not supported`,
    ],
  },
  {
    implementationId: "impl-milesight-vs361-passerby",
    copy: copy(
      "It emits a switching signal when its infrared beam is reflected; it does not provide direction, identity or store visits.",
      "Il émet un signal de commutation lorsque son faisceau infrarouge est réfléchi ; il ne fournit ni direction, ni identité, ni visites en magasin.",
      "Es gibt ein Schaltsignal aus, wenn sein Infrarotstrahl reflektiert wird; es liefert weder Richtung noch Identität oder Ladenbesuche.",
    ),
    sourceRefs: [
      workbookCell(20),
      modelClaim("impl-milesight-vs361-passerby", "supportedClaims[0]"),
      modelClaim("impl-milesight-vs361-passerby", "supportedClaims[4]"),
      modelClaim("impl-milesight-vs361-passerby", "unsupportedClaims[1]"),
      `${registry}: SRC-MILESIGHT-VS361-TECH-001 — one switching signal cannot carry direction, classification or unique-visitor output`,
    ],
  },
  {
    implementationId: "impl-parking-occupancy-method",
    copy: copy(
      "Parking occupancy requires a defined capacity and measurement method; it cannot be inferred from one arrival count alone.",
      "L’occupation du stationnement exige une capacité et une méthode de mesure définies ; elle ne peut pas être déduite d’un seul comptage d’arrivées.",
      "Parkbelegung erfordert eine definierte Kapazität und Messmethode; aus einer einzelnen Ankunftszählung lässt sie sich nicht ableiten.",
    ),
    sourceRefs: [
      workbookCell(21),
      modelClaim("impl-parking-occupancy-method", "supportedClaims[0]"),
      modelClaim("impl-parking-occupancy-method", "unsupportedClaims[0]"),
      `${technologyModel}: Technology library!A10:G10 / TECH-06`,
    ],
  },
  {
    implementationId: "impl-tattile-anpr-vehicle",
    copy: copy(
      "It reads plates from vehicles in a configured lane; a plate is not anonymous and a vehicle event is not a visitor count.",
      "Il lit les plaques des véhicules dans une voie configurée ; une plaque n’est pas anonyme et un événement véhicule n’est pas un comptage de visiteurs.",
      "Es liest Kennzeichen von Fahrzeugen in einer konfigurierten Spur; ein Kennzeichen ist nicht anonym und ein Fahrzeugereignis ist keine Besucherzählung.",
    ),
    sourceRefs: [
      workbookCell(22),
      modelClaim("impl-tattile-anpr-vehicle", "supportedClaims[0]"),
      modelClaim("impl-tattile-anpr-vehicle", "unsupportedClaims[0]"),
      modelClaim("impl-tattile-anpr-vehicle", "unsupportedClaims[2]"),
      `${registry}: SRC-TATTILE-MK2-TECH-001 — people counting and anonymity are not supported`,
    ],
  },
  {
    implementationId: "impl-vehicle-arrival-method",
    copy: copy(
      "An arrival event records a vehicle at a defined point; it does not establish parking duration or the number of people inside.",
      "Un événement d’arrivée enregistre un véhicule à un point défini ; il n’établit ni la durée de stationnement ni le nombre de personnes à bord.",
      "Ein Ankunftsereignis erfasst ein Fahrzeug an einem definierten Punkt; es stellt weder die Parkdauer noch die Zahl der Insassen fest.",
    ),
    sourceRefs: [
      workbookCell(23),
      modelClaim("impl-vehicle-arrival-method", "supportedClaims[0]"),
      modelClaim("impl-vehicle-arrival-method", "unsupportedClaims[0]"),
      `${technologyModel}: Technology library!A10:G10 / TECH-06 unit boundary`,
    ],
  },
  {
    implementationId: "impl-xovis-3d-entrance",
    copy: copy(
      "It measures configured entrance crossings; the sensor alone cannot establish unique visitors across entrances or whole-system compliance.",
      "Il mesure les franchissements d’entrées configurés ; le capteur seul ne peut pas établir les visiteurs uniques entre les entrées ni la conformité de l’ensemble du système.",
      "Es misst konfigurierte Eingangsdurchquerungen; der Sensor allein stellt weder eindeutige Besucher über mehrere Eingänge noch die Konformität des Gesamtsystems fest.",
    ),
    sourceRefs: [
      workbookCell(24),
      modelClaim("impl-xovis-3d-entrance", "unsupportedClaims[1]"),
      `${registry}: SRC-XOVIS-PC2SE-TECH-001 — coverage is not established by the datasheet`,
      `${registry}: SRC-XOVIS-PRIVACY-001 — the surrounding system remains under customer control`,
    ],
  },
  {
    implementationId: "impl-xovis-3d-spatial",
    copy: copy(
      "It measures only configured indoor coverage; it does not guarantee full-journey continuity or a site-wide sensor count.",
      "Il mesure uniquement la couverture intérieure configurée ; il ne garantit ni la continuité d’un parcours complet ni un comptage par capteurs à l’échelle du site.",
      "Es misst nur die konfigurierte Innenabdeckung; es garantiert weder eine durchgängige Gesamtstrecke noch eine standortweite Sensorzählung.",
    ),
    sourceRefs: [
      workbookCell(25),
      modelClaim("impl-xovis-3d-spatial", "unsupportedClaims[1]"),
      modelClaim("impl-xovis-3d-spatial", "unsupportedClaims[2]"),
      `${registry}: SRC-XOVIS-PFL-TECH-001 — coverage and tracking continuity are not supported`,
      `${registry}: SRC-XOVIS-PRIVACY-001 — the surrounding system remains under customer control`,
    ],
  },
  /* Added 2026-09-28. Each of these fell back to `unsupportedClaims[0]`,
     which is written as a claim the model refuses ("Equivalence with …",
     "A count or a route outside …") rather than as a limitation a reader can
     act on. The boundary each states is the one that fallback already held. */
  {
    implementationId: "impl-milesight-vs125p-entrance",
    copy: copy(
      "It counts crossings at configured lines; it cannot follow a visitor beyond the covered area or establish purchase intent.",
      "Il compte les franchissements de lignes configurées ; il ne peut pas suivre un visiteur au-delà de la zone couverte ni établir une intention d’achat.",
      "Es zählt Überquerungen konfigurierter Linien; es kann einem Besucher nicht über den abgedeckten Bereich hinaus folgen und keine Kaufabsicht feststellen.",
    ),
    sourceRefs: [
      workbookCell(19),
      modelClaim("impl-milesight-vs125p-entrance", "supportedClaims[2]"),
      modelClaim("impl-milesight-vs125p-entrance", "unsupportedClaims[0]"),
      `${registry}: SRC-MILESIGHT-VS125-TECH-001 — counting lines and zones; no coverage or intent is established`,
    ],
  },
  {
    implementationId: "impl-ip-detection-indoor",
    copy: copy(
      "It measures only inside its configured views: outside them there is no count and no route, and re-identification never establishes who someone is.",
      "Il ne mesure qu’à l’intérieur de ses vues configurées : en dehors, il n’y a ni comptage ni parcours, et la ré-identification n’établit jamais qui est une personne.",
      "Es misst nur innerhalb seiner konfigurierten Ansichten: außerhalb gibt es keine Zählung und keinen Weg, und die Wiedererkennung stellt nie fest, wer jemand ist.",
    ),
    sourceRefs: [
      modelClaim("impl-ip-detection-indoor", "unsupportedClaims[0]"),
      modelClaim("impl-ip-detection-indoor", "unsupportedClaims[1]"),
      `${registry}: no product document is mapped for this device; the boundary restates the model's own blocked claims`,
    ],
  },
  {
    implementationId: "impl-ip-detection-outdoor",
    copy: copy(
      "It measures only inside its configured views: outside them there is no count and no route, and re-identification never establishes who someone is.",
      "Il ne mesure qu’à l’intérieur de ses vues configurées : en dehors, il n’y a ni comptage ni parcours, et la ré-identification n’établit jamais qui est une personne.",
      "Es misst nur innerhalb seiner konfigurierten Ansichten: außerhalb gibt es keine Zählung und keinen Weg, und die Wiedererkennung stellt nie fest, wer jemand ist.",
    ),
    sourceRefs: [
      modelClaim("impl-ip-detection-outdoor", "unsupportedClaims[0]"),
      modelClaim("impl-ip-detection-outdoor", "unsupportedClaims[1]"),
      `${registry}: no product document is mapped for this device; the boundary restates the model's own blocked claims`,
    ],
  },
  {
    implementationId: "impl-xovis-3d-entrance-outdoor",
    copy: copy(
      "It counts crossings at the threshold it is mounted over. Its datasheet states no accuracy or coverage figure, and no privacy certification is established for this outdoor version: the certificate names the indoor sensor only.",
      "Il compte les franchissements au seuil au-dessus duquel il est monté. Sa fiche technique n’indique aucun chiffre d’exactitude ni de couverture, et aucune certification de confidentialité n’est établie pour cette version extérieure : le certificat ne nomme que le capteur intérieur.",
      "Er zählt Überquerungen an der Schwelle, über der er montiert ist. Sein Datenblatt nennt keine Genauigkeits- oder Abdeckungsangabe, und für diese Außenversion ist keine Datenschutzzertifizierung belegt: Das Zertifikat nennt nur den Innensensor.",
    ),
    sourceRefs: [
      modelClaim("impl-xovis-3d-entrance-outdoor", "unsupportedClaims[1]"),
      modelClaim("impl-xovis-3d-entrance-outdoor", "unsupportedClaims[2]"),
      `${registry}: SRC-XOVIS-PC2SE-O-TECH-001 (PC2SE-O datasheet); SRC-XOVIS-PRIVACY-001 names the PC2SE, not the PC2SE-O`,
    ],
  },
] as const;

export function getDrawerLimitation(
  implementationId: TechnologyImplementationId,
): DrawerLimitation | null {
  return drawerLimitations.find((entry) => entry.implementationId === implementationId) ?? null;
}

export function resolveDrawerLimitation(
  locale: Locale,
  implementationId: TechnologyImplementationId,
): string | null {
  return getDrawerLimitation(implementationId)?.copy[locale] ?? null;
}
