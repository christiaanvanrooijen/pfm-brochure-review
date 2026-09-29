/**
 * Localized DISPLAY of per-implementation claims.
 *
 * WHY THIS FILE EXISTS
 *
 * `TechnologyImplementationDefinition.supportedClaims` and `.unsupportedClaims`
 * were typed and source-referenced from the start, but reached no
 * customer-facing surface before Gate 8: the drawer's Technology cards and
 * Privacy entries are the first UI to render them at all. Wiring restrained
 * cards ("real photo, name, role, one limitation") and implementation-specific
 * privacy in French and German therefore means writing these translations for
 * the first time — there was nothing to have missed before.
 *
 * SCOPE, DELIBERATELY NARROW
 *
 * Only what the drawer actually renders:
 *
 *   - the Technology card's single "Limitation" line, which is always
 *     `blockedClaims[0]` — the model orders each implementation's own
 *     unsupported-claims list with the most load-bearing one first;
 *   - every `supportedClaims` entry for an implementation whose privacy
 *     status has cleared the evidence bar (`hasPrivacyEvidence`), which is
 *     what the Privacy tab renders per implementation.
 *
 * The rest of `unsupportedClaims` (index 1 onward) is not rendered anywhere in
 * this drawer and is not translated here — translating prose nobody reads
 * would be effort spent on the wrong thing, and it would give a false
 * impression of exhaustiveness this file does not have.
 *
 * THE SAME RULE AS `domain.ts` AND `domain-requirements.ts`: English is read
 * from the model at render time, never retyped here. Every translation below
 * is keyed by the implementation id and the claim's own index in its array, so
 * a claim that is reordered or reworded in `technology.ts` is a detectable
 * validation miss rather than a silently mismatched French or German sentence.
 */

import type { Locale } from "./locales.ts";
import type { TechnologyImplementationId } from "../content/types.ts";
import { technologyImplementations } from "../content/technology.ts";

type ClaimKey = `${TechnologyImplementationId}:${number}`;

/** `blockedClaims[0]` — the Technology card's one limitation line. */
const limitationTranslations: Readonly<Record<Exclude<Locale, "en">, Readonly<Record<TechnologyImplementationId, string>>>> = {
  fr: {
    "impl-milesight-vs361-passerby":
      "Un chiffre d'exactitude quel qu'il soit, ou qu'un comptage de passants équivaille à une visite en magasin",
    "impl-xovis-3d-entrance": "Un chiffre d'exactitude, de taux de captation ou de couverture quel qu'il soit",
    "impl-milesight-vs125p-entrance":
      "Une équivalence avec le 3D Sensor Basic FoV en exactitude, classification, couverture, traitement ou preuve de confidentialité",
    "impl-isarsoft-camera-analytics": "Que chaque déploiement prenne en charge chaque capacité listée ici",
    "impl-xovis-3d-entrance-outdoor":
      "Tout chiffre de la fiche technique du capteur intérieur — cette version a la sienne, et les deux diffèrent en température de fonctionnement, en éclairage et en protection contre les intrusions",
    "impl-ip-detection-indoor":
      "Un comptage ou un parcours en dehors des vues configurées — là où il n'y a pas de vue, il n'y a pas de mesure",
    "impl-ip-detection-outdoor":
      "Un comptage ou un parcours en dehors des vues configurées — là où il n'y a pas de vue, il n'y a pas de mesure",
    "impl-configured-classification":
      "Que chaque compteur prenne en charge des classifications identiques, ou toute classification nommée sans validation",
    "impl-lidar-spatial":
      "L'analyse spatiale en magasin — la fiche technique cartographiée documente le capteur pour la robotique, pas pour la mesure du mouvement des personnes",
    "impl-xovis-3d-spatial":
      "Les spécifications du 3D Sensor Basic FoV — ce sont deux appareils différents, et les chiffres de l'un ne décrivent pas l'autre",
    "impl-business-data-connection":
      "La disponibilité d'un connecteur en direct, l'accès navigateur direct, la recommandation automatique, la tarification ou la mesure de mouvement",
    "impl-aggregate-geo-mobility":
      "Le fournisseur, l'échantillon, la précision, la représentativité, les droits contractuels ou la substitution à la mesure physique",
    "impl-anonymous-visit-matching":
      "Le support produit, la qualité de l'appariement, la persistance, la mécanique des identifiants, la rétention, le stockage ou la disponibilité universelle",
    "impl-vehicle-arrival-method":
      "Le fournisseur, l'exactitude, la classification, le stockage, la capture de plaque ou l'adéquation à l'occupation et à l'origine",
    "impl-parking-occupancy-method":
      "Le fournisseur, l'exactitude, la logique de rotation, la couverture par emplacement ou l'interchangeabilité avec le comptage d'arrivées",
    "impl-tattile-anpr-vehicle":
      "Que ceci compte des personnes — cela détecte des véhicules, et un véhicule n'est jamais un visiteur",
    "impl-lawful-anpr-lpr":
      "Le fournisseur, la base légale, la rétention, le stockage, la sécurité, l'exactitude, la disponibilité juridictionnelle, ou une origine domestique néerlandaise déduite d'une plaque",
    "impl-hme-zoom-nitro-timer":
      "L'exactitude, l'amélioration du débit, l'augmentation du chiffre d'affaires, l'exactitude des commandes ou la réduction de la file",
    "impl-compatible-vehicle-detection": "Qu'une seule technologie de détection fixe soit obligatoire pour chaque site",
    "impl-hme-nexeo-core":
      "La communication d'équipe individuelle ou de groupe — la source indique de ne pas l'attribuer à Core sans vérification dans la matrice de niveaux actuelle",
    "impl-hme-nexeo": "Des listes de fonctionnalités par niveau précises sans vérification par rapport à la matrice de niveaux actuelle",
    "impl-hme-nexeo-pro": "Que PFM fournisse le service d'IA vocale",
    "impl-hme-text-and-connect": "La disponibilité par niveau, le périmètre fonctionnel, la disponibilité régionale ou le détail d'intégration",
    "impl-hme-clearsoundx": "Des chiffres d'exactitude de commande, de répétition ou d'amélioration de vitesse",
    "impl-hme-zoom-nitro-data-cloud": "Des valeurs de référence, des résultats clients ou des affirmations d'amélioration à l'échelle du parc",
    "impl-hme-zoom-nitro-nexeo-alerting": "Qu'une alerte change l'issue opérationnelle à elle seule",
  } as Readonly<Record<TechnologyImplementationId, string>>,
  de: {
    "impl-milesight-vs361-passerby":
      "Eine Genauigkeitsangabe jeglicher Art, oder dass eine Passantenzählung einem Ladenbesuch entspricht",
    "impl-xovis-3d-entrance": "Eine Genauigkeits-, Erfassungsraten- oder Abdeckungsangabe jeglicher Art",
    "impl-milesight-vs125p-entrance":
      "Eine Gleichwertigkeit mit dem 3D Sensor Basic FoV in Genauigkeit, Klassifikation, Abdeckung, Verarbeitung oder Datenschutznachweis",
    "impl-isarsoft-camera-analytics": "Dass jede Installation jede hier aufgeführte Fähigkeit unterstützt",
    "impl-xovis-3d-entrance-outdoor":
      "Jede Angabe aus dem Datenblatt des Innensensors — diese Version hat ihr eigenes, und beide unterscheiden sich in Betriebstemperatur, Beleuchtung und Schutz gegen Eindringen",
    "impl-ip-detection-indoor":
      "Eine Zählung oder ein Weg außerhalb der konfigurierten Ansichten — wo keine Ansicht ist, gibt es keine Messung",
    "impl-ip-detection-outdoor":
      "Eine Zählung oder ein Weg außerhalb der konfigurierten Ansichten — wo keine Ansicht ist, gibt es keine Messung",
    "impl-configured-classification":
      "Dass jeder Zähler identische Klassifikationen unterstützt, oder eine benannte Klassifikation ohne Validierung",
    "impl-lidar-spatial":
      "Räumliche Analytik im Einzelhandel — das zugeordnete Datenblatt dokumentiert den Sensor für Robotik, nicht für die Messung von Personenbewegung",
    "impl-xovis-3d-spatial":
      "Spezifikationen des 3D Sensor Basic FoV — die beiden sind unterschiedliche Geräte, und die Werte des einen beschreiben nicht das andere",
    "impl-business-data-connection":
      "Verfügbarkeit eines Live-Connectors, direkten Browserzugriff, automatische Empfehlung, Preisgestaltung oder Bewegungsmessung",
    "impl-aggregate-geo-mobility":
      "Anbieter, Stichprobe, Genauigkeit, Repräsentativität, vertragliche Rechte oder Ersatz für physische Messung",
    "impl-anonymous-visit-matching":
      "Produktunterstützung, Zuordnungsqualität, Persistenz, Kennungsmechanik, Aufbewahrung, Speicherung oder universelle Verfügbarkeit",
    "impl-vehicle-arrival-method":
      "Anbieter, Genauigkeit, Klassifikation, Speicherung, Kennzeichenerfassung oder Eignung für Belegung und Herkunft",
    "impl-parking-occupancy-method":
      "Anbieter, Genauigkeit, Umschlaglogik, stellplatzgenaue Abdeckung oder Austauschbarkeit mit Ankunftszählung",
    "impl-tattile-anpr-vehicle":
      "Dass dies Personen zählt — es erkennt Fahrzeuge, und ein Fahrzeug ist niemals ein Besucher",
    "impl-lawful-anpr-lpr":
      "Anbieter, Rechtsgrundlage, Aufbewahrung, Speicherung, Sicherheit, Genauigkeit, gerichtliche Verfügbarkeit oder eine niederländische Herkunft, abgeleitet aus einem Kennzeichen",
    "impl-hme-zoom-nitro-timer":
      "Genauigkeit, Durchsatzverbesserung, Umsatzsteigerung, Bestellgenauigkeit oder Warteschlangenverkürzung",
    "impl-compatible-vehicle-detection": "Dass eine einzige feste Erkennungstechnologie für jeden Standort verpflichtend ist",
    "impl-hme-nexeo-core":
      "1:1- oder Gruppen-Teamkommunikation — die Quelle besagt, dies nicht ohne Prüfung anhand der aktuellen Stufenmatrix Core zuzuschreiben",
    "impl-hme-nexeo": "Spezifische Funktionslisten je Stufe ohne Abgleich mit der aktuellen Stufenmatrix",
    "impl-hme-nexeo-pro": "Dass PFM den Voice-AI-Dienst liefert",
    "impl-hme-text-and-connect": "Stufenverfügbarkeit, funktionalen Umfang, regionale Verfügbarkeit oder Integrationsdetails",
    "impl-hme-clearsoundx": "Angaben zu Bestellgenauigkeit, Wiederholung oder Geschwindigkeitsverbesserung",
    "impl-hme-zoom-nitro-data-cloud": "Referenzwerte, Kundenergebnisse oder Aussagen zur Verbesserung auf Portfolioebene",
    "impl-hme-zoom-nitro-nexeo-alerting": "Dass eine Meldung allein das betriebliche Ergebnis ändert",
  } as Readonly<Record<TechnologyImplementationId, string>>,
};

/** Every `supportedClaims` entry, for implementations the Privacy tab can show. */
const supportedClaimTranslations: Readonly<Record<Exclude<Locale, "en">, Readonly<Record<ClaimKey, string>>>> = {
  fr: {
    "impl-xovis-3d-entrance-outdoor:0":
      "Membre de la même famille de capteurs d'entrée à vision stéréo 3D que le 3D Sensor Basic FoV intérieur, dans une version que le fabricant spécifie pour un usage extérieur",
    "impl-xovis-3d-entrance-outdoor:1":
      "Vision stéréo 3D en surplomb, avec traitement sur l'appareil lui-même",
    "impl-xovis-3d-entrance-outdoor:2":
      "Montage de 2,20 m à 6,00 m pour le modèle de base, alimenté et connecté par un seul câble réseau PoE",
    "impl-xovis-3d-entrance-outdoor:3":
      "Spécifié par le fabricant pour -33 °C à +40 °C et un minimum de 9 lux, avec une protection contre l'eau et la poussière",
    "impl-xovis-3d-entrance-outdoor:4":
      "Le fabricant décrit quatre modes de confidentialité, les données n'étant transmises qu'au format texte et sans aucune information personnellement identifiable",
    "impl-ip-detection-indoor:0":
      "Une caméra IP dont les vues configurées portent une analytique de détection — lignes de comptage, transitions entre zones et, lorsque c'est configuré, ré-identification anonyme",
    "impl-ip-detection-indoor:1":
      "Ce qu'un déploiement mesure parmi ces éléments dépend de la configuration et de l'emplacement des caméras, site par site",
    "impl-ip-detection-indoor:2":
      "Le fabricant décrit un masquage optionnel de la confidentialité sur cette plateforme de caméra : flouter ou masquer des personnes, des visages ou des véhicules, ou masquer la vidéo en conservant ses métadonnées",
    "impl-ip-detection-indoor:3":
      "Le fabricant décrit ces réglages par flux vidéo, sur des versions de firmware et d'analytique prises en charge, et uniquement tels que configurés",
    "impl-ip-detection-outdoor:0":
      "Une caméra IP dont les vues configurées portent une analytique de détection — lignes de comptage, transitions entre zones et, lorsque c'est configuré, ré-identification anonyme",
    "impl-ip-detection-outdoor:1":
      "Ce qu'un déploiement mesure parmi ces éléments dépend de la configuration et de l'emplacement des caméras, site par site",
    "impl-ip-detection-outdoor:2":
      "Le fabricant décrit un masquage optionnel de la confidentialité sur cette plateforme de caméra : flouter ou masquer des personnes, des visages ou des véhicules, ou masquer la vidéo en conservant ses métadonnées",
    "impl-ip-detection-outdoor:3":
      "Le fabricant décrit ces réglages par flux vidéo, sur des versions de firmware et d'analytique prises en charge, et uniquement tels que configurés",
    "impl-ip-detection-outdoor:4":
      "Sur un site à ciel ouvert, les vues configurées peuvent aussi détecter les véhicules qui franchissent les lignes d'accès — comme événements de véhicule, ni visiteurs ni plaques",
    "impl-milesight-vs361-passerby:0": "Détecte un passant en émettant un faisceau infrarouge et en enregistrant son reflet",
    "impl-milesight-vs361-passerby:1":
      "Monté en façade à 0,7–1,2 m, avec une distance de détection réglable de 1 à 9 m",
    "impl-milesight-vs361-passerby:2": "Classé IP65 pour un usage en façade extérieure, de -20 °C à 50 °C",
    "impl-milesight-vs361-passerby:3": "Alimenté par PoE ou 12–60 V CC, à un maximum de 0,9 W",
    "impl-milesight-vs361-passerby:4":
      "L'appareil n'a ni caméra ni capteur d'image : sa seule sortie est un signal de commutation numérique",
    "impl-xovis-3d-entrance:0": "Vision stéréo 3D en surplomb, traitée sur l'appareil lui-même",
    "impl-xovis-3d-entrance:1": "Montage de 2,20 m à 6,00 m, alimenté et connecté par un seul câble réseau PoE",
    "impl-xovis-3d-entrance:2":
      "Le fabricant indique que les images traitées ne sont ni stockées ni transmises hors du capteur, et que seules des données de comptage au format texte sont transmises",
    "impl-xovis-3d-entrance:3": "Quatre niveaux de confidentialité sélectionnables ; le périmètre certifié couvre le niveau 2 et au-delà",
    "impl-milesight-vs125p-entrance:0": "Vision stéréo binoculaire avec traitement IA embarqué",
    "impl-milesight-vs125p-entrance:1": "Montage de 2,2 m à 6 m par PoE ; une variante cellulaire distincte existe",
    "impl-milesight-vs125p-entrance:2": "Jusqu'à quatre lignes de comptage bidirectionnelles, avec zones de comptage configurables",
    "impl-milesight-vs125p-entrance:3":
      "Reconnaissance d'attributs configurable, que la fiche technique limite à une hauteur de montage de 2,2–4 m",
    "impl-milesight-vs125p-entrance:4": "Le fabricant décrit un traitement d'images sur l'appareil, des images de profondeur et couleur servant à détecter les personnes ; l'un de ses trois modes d'aperçu n'affiche aucune image. Il décrit aussi un stockage sur l'appareil avec suppression manuelle et déclare l'appareil conforme au RGPD",
    "impl-isarsoft-camera-analytics:0": "Une couche d'analytique configurée sur une infrastructure de caméras IP compatible, et non un capteur 3D",
    "impl-isarsoft-camera-analytics:1": "La question de mesure à laquelle répond un déploiement dépend de sa configuration, site par site",
    "impl-isarsoft-camera-analytics:2": "Le fournisseur déclare que son analytique peut anonymiser les vidéos en temps réel et produire des métadonnées telles que des positions d'objets ou des comptages",
    "impl-isarsoft-camera-analytics:3": "Le fournisseur présente le traitement local ou en périphérie sur le matériel du client comme le déploiement par défaut, avec le cloud en option",
    "impl-isarsoft-camera-analytics:4": "Le fournisseur indique que la mise en correspondance entre caméras utilise des caractéristiques visuelles abstraites plutôt que biométriques",
    "impl-xovis-3d-spatial:0": "Vision stéréo 3D avec traitement IA embarqué, pour usage intérieur",
    "impl-xovis-3d-spatial:1": "Montage de 2,00 m à 6,00 m par PoE, avec le USB-C comme alimentation alternative",
    "impl-xovis-3d-spatial:2":
      "Le fabricant indique que tout le traitement s'effectue sur l'appareil et que seules des données au format texte sont transmises",
    "impl-xovis-3d-spatial:3": "Quatre niveaux de confidentialité sélectionnables ; le périmètre certifié couvre le niveau 2 et au-delà",
    "impl-aggregate-geo-mobility:0":
      "Contexte agrégé de chalandise, d'origine, de concurrence, de temps de trajet ou de tourisme, là où une source approuvée le permet",
  },
  de: {
    "impl-xovis-3d-entrance-outdoor:0":
      "Teil derselben 3D-Stereo-Eingangssensor-Familie wie der 3D Sensor Basic FoV für innen, in einer Version, die der Hersteller für den Außeneinsatz spezifiziert",
    "impl-xovis-3d-entrance-outdoor:1":
      "3D-Stereovision über Kopf, mit Verarbeitung auf dem Gerät selbst",
    "impl-xovis-3d-entrance-outdoor:2":
      "Montage von 2,20 m bis 6,00 m beim Basismodell, Stromversorgung und Anbindung über ein einziges PoE-Netzwerkkabel",
    "impl-xovis-3d-entrance-outdoor:3":
      "Vom Hersteller spezifiziert für -33 °C bis +40 °C und mindestens 9 Lux, mit Schutz gegen Wasser und Staub",
    "impl-xovis-3d-entrance-outdoor:4":
      "Der Hersteller beschreibt vier Datenschutzmodi; Daten werden nur im Textformat und ohne personenbezogene Informationen übertragen",
    "impl-ip-detection-indoor:0":
      "Eine IP-Kamera, deren konfigurierte Ansichten Detektionsanalytik tragen — Zähllinien, Zonenübergänge und, sofern konfiguriert, anonyme Wiedererkennung",
    "impl-ip-detection-indoor:1":
      "Welche davon ein Einsatz beantwortet, hängt je Standort von Konfiguration und Kameraplatzierung ab",
    "impl-ip-detection-indoor:2":
      "Der Hersteller beschreibt eine optionale Privatsphäre-Maskierung auf dieser Kameraplattform: Personen, Gesichter oder Fahrzeuge unscharf machen oder maskieren, oder das Video ausblenden und seine Metadaten behalten",
    "impl-ip-detection-indoor:3":
      "Der Hersteller beschreibt diese Einstellungen je Videostream, auf unterstützten Firmware- und Analytikvarianten und nur wie konfiguriert",
    "impl-ip-detection-outdoor:0":
      "Eine IP-Kamera, deren konfigurierte Ansichten Detektionsanalytik tragen — Zähllinien, Zonenübergänge und, sofern konfiguriert, anonyme Wiedererkennung",
    "impl-ip-detection-outdoor:1":
      "Welche davon ein Einsatz beantwortet, hängt je Standort von Konfiguration und Kameraplatzierung ab",
    "impl-ip-detection-outdoor:2":
      "Der Hersteller beschreibt eine optionale Privatsphäre-Maskierung auf dieser Kameraplattform: Personen, Gesichter oder Fahrzeuge unscharf machen oder maskieren, oder das Video ausblenden und seine Metadaten behalten",
    "impl-ip-detection-outdoor:3":
      "Der Hersteller beschreibt diese Einstellungen je Videostream, auf unterstützten Firmware- und Analytikvarianten und nur wie konfiguriert",
    "impl-ip-detection-outdoor:4":
      "An einem Standort unter freiem Himmel können konfigurierte Ansichten auch Fahrzeuge erkennen, die Zufahrtslinien überqueren — als Fahrzeugereignisse, weder Besucher noch Kennzeichen",
    "impl-milesight-vs361-passerby:0":
      "Erkennt einen Passanten, indem ein Infrarotstrahl ausgesendet und dessen Reflexion registriert wird",
    "impl-milesight-vs361-passerby:1":
      "An der Fassade montiert, 0,7–1,2 m, mit einer von 1 bis 9 m einstellbaren Erkennungsdistanz",
    "impl-milesight-vs361-passerby:2": "IP65-geschützt für den Außeneinsatz an der Fassade, von -20 °C bis 50 °C",
    "impl-milesight-vs361-passerby:3": "Versorgt über PoE oder 12–60 V DC, mit maximal 0,9 W",
    "impl-milesight-vs361-passerby:4":
      "Das Gerät hat weder Kamera noch Bildsensor: Seine einzige Ausgabe ist ein digitales Schaltsignal",
    "impl-xovis-3d-entrance:0": "Überkopf-3D-Stereovision, auf dem Gerät selbst verarbeitet",
    "impl-xovis-3d-entrance:1": "Montage von 2,20 m bis 6,00 m, über ein einziges PoE-Netzwerkkabel versorgt und verbunden",
    "impl-xovis-3d-entrance:2":
      "Der Hersteller gibt an, dass verarbeitete Bilder weder gespeichert noch vom Sensor übertragen werden und nur Zähldaten im Textformat übertragen werden",
    "impl-xovis-3d-entrance:3": "Vier wählbare Datenschutzstufen; der zertifizierte Umfang deckt Stufe 2 und höher ab",
    "impl-milesight-vs125p-entrance:0": "Binokulare Stereovision mit KI-Verarbeitung auf dem Gerät",
    "impl-milesight-vs125p-entrance:1": "Montage von 2,2 m bis 6 m über PoE; eine separate Mobilfunkvariante existiert",
    "impl-milesight-vs125p-entrance:2": "Bis zu vier bidirektionale Zähllinien mit konfigurierbaren Zählbereichen",
    "impl-milesight-vs125p-entrance:3":
      "Konfigurierbare Attributerkennung, die das Datenblatt auf eine Montagehöhe von 2,2–4 m begrenzt",
    "impl-milesight-vs125p-entrance:4": "Der Hersteller beschreibt eine Bildverarbeitung auf dem Gerät, bei der Tiefen- und Farbbilder zur Personenerkennung dienen; einer seiner drei Vorschau-Modi zeigt kein Bild. Er beschreibt außerdem eine Speicherung auf dem Gerät mit manuellem Löschen und erklärt das Gerät für DSGVO-konform",
    "impl-isarsoft-camera-analytics:0": "Eine Analytikschicht auf kompatibler IP-Kamerainfrastruktur, kein 3D-Sensor",
    "impl-isarsoft-camera-analytics:1": "Welche Messfrage eine Installation beantwortet, hängt von der standortspezifischen Konfiguration ab",
    "impl-isarsoft-camera-analytics:2": "Der Anbieter erklärt, seine Analytik könne Videostreams in Echtzeit anonymisieren und Metadaten wie Objektpositionen oder Zählwerte erzeugen",
    "impl-isarsoft-camera-analytics:3": "Der Anbieter beschreibt lokale oder Edge-Verarbeitung auf Kundenhardware als Standard, Cloud-Nutzung sei optional",
    "impl-isarsoft-camera-analytics:4": "Der Anbieter erklärt, dass kameraübergreifendes Matching abstrakte visuelle statt biometrische Merkmale nutzt",
    "impl-xovis-3d-spatial:0": "3D-Stereovision mit KI-Verarbeitung auf dem Gerät, für den Innenbereich",
    "impl-xovis-3d-spatial:1": "Montage von 2,00 m bis 6,00 m über PoE, mit USB-C als alternativer Versorgung",
    "impl-xovis-3d-spatial:2":
      "Der Hersteller gibt an, dass die gesamte Verarbeitung auf dem Gerät erfolgt und nur Daten im Textformat übertragen werden",
    "impl-xovis-3d-spatial:3": "Vier wählbare Datenschutzstufen; der zertifizierte Umfang deckt Stufe 2 und höher ab",
    "impl-aggregate-geo-mobility:0":
      "Aggregierter Kontext zu Einzugsgebiet, Herkunft, Wettbewerb, Fahrzeit oder Tourismus, dort wo eine freigegebene Quelle dies stützt",
  },
};

export function resolveLimitationClaim(
  locale: Locale,
  implementationId: TechnologyImplementationId,
  fallback: string,
): string {
  if (locale === "en") return fallback;
  return limitationTranslations[locale][implementationId] ?? fallback;
}

export function resolveSupportedClaim(
  locale: Locale,
  implementationId: TechnologyImplementationId,
  index: number,
  fallback: string,
): string {
  if (locale === "en") return fallback;
  return supportedClaimTranslations[locale][`${implementationId}:${index}`] ?? fallback;
}

/**
 * Every claim the drawer can actually render, checked against the maps.
 * Run from the test suite: an implementation newly reachable from a Core
 * scene, or a reordered claims array, is a failing check rather than a
 * silently English sentence under an FR/DE Technology card or Privacy entry.
 */
export function validateClaimMessages(
  reachable: readonly { implementationId: TechnologyImplementationId; hasPrivacyEvidence: boolean }[],
): readonly string[] {
  const missing: string[] = [];
  for (const { implementationId, hasPrivacyEvidence } of reachable) {
    const impl = technologyImplementations.find((i) => i.id === implementationId);
    if (!impl) continue;
    for (const locale of ["fr", "de"] as const) {
      if (impl.unsupportedClaims[0] && !limitationTranslations[locale][implementationId]) {
        missing.push(`${locale}.limitation.${implementationId}`);
      }
      if (hasPrivacyEvidence) {
        impl.supportedClaims.forEach((_, index) => {
          const key: ClaimKey = `${implementationId}:${index}`;
          if (!supportedClaimTranslations[locale][key]) missing.push(`${locale}.supportedClaim.${key}`);
        });
      }
    }
  }
  return missing;
}
