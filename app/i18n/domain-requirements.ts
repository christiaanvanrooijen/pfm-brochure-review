/**
 * Localized DISPLAY of installation requirements and data-role labels.
 *
 * WHY A SEPARATE FILE FROM `domain.ts`
 *
 * `implementationRequirementProfiles` (essentials + technical detail) was
 * typed and source-referenced but never rendered anywhere before Gate 8 — the
 * Requirements tab showed only the scene's evidence-input list, never an
 * implementation's own site prerequisites. Wiring it in for the first time
 * means writing its French and German for the first time too, and there is
 * enough of it (18 essentials, 29 technical-detail rows) to warrant its own
 * file rather than growing `domain.ts` further.
 *
 * THE SAME RULE AS `domain.ts`: English is never retyped here. Every English
 * essential body and technical-detail value is read at render time from
 * `implementationRequirementProfiles` itself; this file supplies only the
 * French and German renderings, keyed by the row's own implementation id and
 * label so a row that moves in the source model is caught by
 * `validateRequirementMessages()` rather than silently drifting.
 *
 * DATA-ROLE LABELS reuse the exact English wording the approved shell already
 * uses in `SceneLensRail.tsx` ("Physical" / "Mobile & geo" / "Business" /
 * "Insight"), rather than inventing new terms for the same four roles.
 */

import type { Locale } from "./locales.ts";
import type { DataRole, TechnologyImplementationId } from "../content/types.ts";
import { implementationRequirementProfiles } from "../content/technology-visuals.ts";

/* ---------------------------------------------------------------- *
   DATA ROLES — the four canonical layers, named as the approved shell
   already names them
 * ---------------------------------------------------------------- */

export interface DataRoleCopy {
  label: string;
  note: string;
}

const dataRoleCopy: Readonly<Record<Locale, Readonly<Record<DataRole, DataRoleCopy>>>> = {
  en: {
    physical: { label: "Physical", note: "Measured at the location" },
    mobile_geo: { label: "Mobile & geo", note: "Aggregate area context" },
    business: { label: "Business", note: "Customer-connected context" },
    insight: { label: "Insight", note: "Derived from its named source layers" },
  },
  fr: {
    physical: { label: "Physique", note: "Mesuré sur le lieu" },
    mobile_geo: { label: "Mobile et géo", note: "Contexte de zone agrégé" },
    business: { label: "Métier", note: "Contexte connecté au client" },
    insight: { label: "Analyse", note: "Déduit de ses couches sources nommées" },
  },
  de: {
    physical: { label: "Physisch", note: "Am Standort gemessen" },
    mobile_geo: { label: "Mobil & Geo", note: "Aggregierter Gebietskontext" },
    business: { label: "Geschäftlich", note: "Kundenverbundener Kontext" },
    insight: { label: "Erkenntnis", note: "Aus seinen benannten Quellschichten abgeleitet" },
  },
};

export function resolveDataRoleCopy(locale: Locale, role: DataRole): DataRoleCopy {
  return dataRoleCopy[locale][role];
}

/* ---------------------------------------------------------------- *
   REQUIREMENT-PROFILE LABELS — the small, reused vocabulary
 * ---------------------------------------------------------------- */

const essentialLabelTranslations: Readonly<Record<Exclude<Locale, "en">, Readonly<Record<string, string>>>> = {
  fr: {
    Placement: "Emplacement",
    "Measurement area": "Zone de mesure",
    "Power and connectivity": "Alimentation et connectivité",
  },
  de: {
    Placement: "Platzierung",
    "Measurement area": "Messbereich",
    "Power and connectivity": "Stromversorgung und Konnektivität",
  },
};

const detailLabelTranslations: Readonly<Record<Exclude<Locale, "en">, Readonly<Record<string, string>>>> = {
  fr: {
    "Detection method": "Méthode de détection",
    "Mounting height": "Hauteur de montage",
    "Detection distance": "Distance de détection",
    "Protection rating": "Indice de protection",
    Power: "Alimentation",
    Output: "Sortie",
    Method: "Méthode",
    Network: "Réseau",
    Environment: "Environnement",
    "Privacy modes": "Modes de confidentialité",
    "Attribute recognition": "Reconnaissance d'attributs",
    "Field of view": "Champ de vision",
    "Laser safety": "Sécurité laser",
    "Analytics layer": "Couche d'analyse",
  },
  de: {
    "Detection method": "Erkennungsmethode",
    "Mounting height": "Montagehöhe",
    "Detection distance": "Erkennungsdistanz",
    "Protection rating": "Schutzart",
    Power: "Stromversorgung",
    Output: "Ausgabe",
    Method: "Methode",
    Network: "Netzwerk",
    Environment: "Umgebung",
    "Privacy modes": "Datenschutzmodi",
    "Attribute recognition": "Attributerkennung",
    "Field of view": "Sichtfeld",
    "Laser safety": "Lasersicherheit",
    "Analytics layer": "Analyseschicht",
  },
};

export function resolveEssentialLabel(locale: Locale, label: string): string {
  if (locale === "en") return label;
  return essentialLabelTranslations[locale][label] ?? label;
}

export function resolveDetailLabel(locale: Locale, label: string): string {
  if (locale === "en") return label;
  return detailLabelTranslations[locale][label] ?? label;
}

/* ---------------------------------------------------------------- *
   REQUIREMENT-PROFILE ROW TEXT — keyed by implementation id + the row's
   own (untranslated) label, so a row that moves in the source is a
   detectable miss rather than a silent English sentence
 * ---------------------------------------------------------------- */

type RowKey = `${TechnologyImplementationId}:${string}`;

const essentialBodyTranslations: Readonly<Record<Exclude<Locale, "en">, Readonly<Record<RowKey, string>>>> = {
  fr: {
    "impl-milesight-vs361-passerby:Placement":
      "Monté en façade, à hauteur de taille environ, face au flux de passants.",
    "impl-milesight-vs361-passerby:Measurement area":
      "Une distance de détection réglable de 1 à 9 mètres, pour que la bande mesurée corresponde à la façade dont vous voulez parler.",
    "impl-milesight-vs361-passerby:Power and connectivity":
      "Un câble réseau porte à la fois l'alimentation et les données ; une alimentation DC locale fonctionne aussi.",
    "impl-xovis-3d-entrance:Placement":
      "En surplomb, directement au-dessus de la porte, regardant droit vers le seuil.",
    "impl-xovis-3d-entrance:Measurement area":
      "L'entrée elle-même. La hauteur de plafond détermine la largeur de porte qu'une seule unité peut couvrir.",
    "impl-xovis-3d-entrance:Power and connectivity":
      "Un seul câble réseau porte l'alimentation et les données jusqu'au capteur.",
    "impl-milesight-vs125p-entrance:Placement":
      "En surplomb au-dessus de la porte, monté au plafond ou au linteau.",
    "impl-milesight-vs125p-entrance:Measurement area":
      "Jusqu'à quatre lignes de comptage dans une seule vue ; plusieurs unités peuvent se combiner pour une entrée plus large.",
    "impl-milesight-vs125p-entrance:Power and connectivity":
      "Un câble réseau pour l'alimentation et les données, ou une alimentation DC locale. Une variante cellulaire existe là où le câblage est impossible.",
    "impl-isarsoft-camera-analytics:Placement":
      "Utilise les positions de caméras déjà en place, là où la vue existante couvre la question de mesure.",
    "impl-isarsoft-camera-analytics:Measurement area":
      "Décidée site par site selon les vues existantes et leur configuration. Toutes les questions ne peuvent pas être répondues depuis toutes les positions de caméra.",
    "impl-isarsoft-camera-analytics:Power and connectivity":
      "Les caméras conservent leur alimentation et leur réseau existants ; la couche d'analyse est configurée par-dessus.",
    "impl-ip-detection-indoor:Placement":
      "Des vues de caméra aux points choisis — entrées, allées, limites de zones ou portes de magasin — selon un plan de caméras validé sur site.",
    "impl-ip-detection-indoor:Measurement area":
      "Uniquement ce que couvrent les vues configurées. Le nombre de caméras et leur emplacement découlent d'une conception de site, pas d'une fiche technique.",
    "impl-ip-detection-indoor:Power and connectivity":
      "Un accès réseau pour chaque caméra, plus un matériel de traitement local dimensionné pour l'analytique qui y tourne.",
    "impl-ip-detection-outdoor:Placement":
      "Des vues de caméra aux points choisis — entrées, allées, limites de zones ou portes de magasin — selon un plan de caméras validé sur site.",
    "impl-ip-detection-outdoor:Measurement area":
      "Uniquement ce que couvrent les vues configurées. Le nombre de caméras et leur emplacement découlent d'une conception de site, pas d'une fiche technique.",
    "impl-ip-detection-outdoor:Power and connectivity":
      "Un accès réseau pour chaque caméra, plus un matériel de traitement local dimensionné pour l'analytique qui y tourne.",
    "impl-xovis-3d-spatial:Placement":
      "En surplomb au plafond, sur toute la zone mesurée, regardant vers le sol.",
    "impl-xovis-3d-spatial:Measurement area":
      "Convenue par magasin. Le nombre d'unités qu'un plancher nécessite est une question de conception, décidée à partir de votre plan.",
    "impl-xovis-3d-spatial:Power and connectivity":
      "Un câble réseau vers chaque position porte l'alimentation et les données.",
    "impl-lidar-spatial:Placement":
      "Monté pour couvrir l'espace depuis le haut ; une unité voit un hémisphère complet autour d'elle.",
    "impl-lidar-spatial:Measurement area":
      "Convenue par magasin à partir du plan. La couverture et l'analyse qui s'appuie dessus sont conçues ensemble, par site.",
    "impl-lidar-spatial:Power and connectivity":
      "Une alimentation DC et une connexion Ethernet jusqu'au point de traitement.",
  },
  de: {
    "impl-milesight-vs361-passerby:Placement":
      "An der Fassade montiert, etwa auf Hüfthöhe, dem vorbeigehenden Verkehr zugewandt.",
    "impl-milesight-vs361-passerby:Measurement area":
      "Eine Erkennungsdistanz, die von 1 bis 9 Metern einstellbar ist, sodass der gemessene Streifen zu der Fassade passt, über die Sie sprechen möchten.",
    "impl-milesight-vs361-passerby:Power and connectivity":
      "Ein Netzwerkkabel führt sowohl Strom als auch Daten; eine lokale Gleichstromversorgung funktioniert ebenfalls.",
    "impl-xovis-3d-entrance:Placement":
      "Überkopf, direkt über der Tür, senkrecht auf die Schwelle gerichtet.",
    "impl-xovis-3d-entrance:Measurement area":
      "Der Eingang selbst. Die Deckenhöhe bestimmt, wie viel Breite einer weiten Tür eine Einheit abdeckt.",
    "impl-xovis-3d-entrance:Power and connectivity":
      "Ein einzelnes Netzwerkkabel führt Strom und Daten zum Sensor.",
    "impl-milesight-vs125p-entrance:Placement":
      "Überkopf über der Tür, an Decke oder Sturz montiert.",
    "impl-milesight-vs125p-entrance:Measurement area":
      "Bis zu vier Zähllinien in einer Ansicht; mehrere Einheiten lassen sich für einen breiteren Eingang kombinieren.",
    "impl-milesight-vs125p-entrance:Power and connectivity":
      "Ein Netzwerkkabel für Strom und Daten, oder eine lokale Gleichstromversorgung. Eine Mobilfunkvariante existiert, wo keine Verkabelung möglich ist.",
    "impl-isarsoft-camera-analytics:Placement":
      "Nutzt bereits vorhandene Kamerapositionen, wo die bestehende Ansicht die Messfrage abdeckt.",
    "impl-isarsoft-camera-analytics:Measurement area":
      "Wird je Standort anhand der vorhandenen Ansichten und ihrer Konfiguration entschieden. Nicht jede Frage lässt sich aus jeder Kameraposition beantworten.",
    "impl-isarsoft-camera-analytics:Power and connectivity":
      "Die Kameras behalten ihre vorhandene Stromversorgung und ihr Netzwerk; die Analyseschicht wird darauf konfiguriert.",
    "impl-ip-detection-indoor:Placement":
      "Kameraansichten an den gewählten Messpunkten — Eingänge, Gänge, Zonengrenzen oder Store-Türen — nach einem vor Ort validierten Kameralayout.",
    "impl-ip-detection-indoor:Measurement area":
      "Nur was die konfigurierten Ansichten abdecken. Wie viele Kameras und wo, ergibt sich aus einer Standortplanung, nicht aus einem Datenblatt.",
    "impl-ip-detection-indoor:Power and connectivity":
      "Netzwerkzugang für jede Kamera, dazu lokale Verarbeitungshardware, passend zur darauf laufenden Analytik.",
    "impl-ip-detection-outdoor:Placement":
      "Kameraansichten an den gewählten Messpunkten — Eingänge, Gänge, Zonengrenzen oder Store-Türen — nach einem vor Ort validierten Kameralayout.",
    "impl-ip-detection-outdoor:Measurement area":
      "Nur was die konfigurierten Ansichten abdecken. Wie viele Kameras und wo, ergibt sich aus einer Standortplanung, nicht aus einem Datenblatt.",
    "impl-ip-detection-outdoor:Power and connectivity":
      "Netzwerkzugang für jede Kamera, dazu lokale Verarbeitungshardware, passend zur darauf laufenden Analytik.",
    "impl-xovis-3d-spatial:Placement":
      "Überkopf an der Decke über dem gemessenen Bereich, nach unten auf den Boden gerichtet.",
    "impl-xovis-3d-spatial:Measurement area":
      "Je Filiale vereinbart. Wie viele Einheiten eine Fläche benötigt, ist eine Designfrage, die anhand Ihres Grundrisses entschieden wird.",
    "impl-xovis-3d-spatial:Power and connectivity":
      "Ein Netzwerkkabel zu jeder Position führt Strom und Daten.",
    "impl-lidar-spatial:Placement":
      "So montiert, dass der Raum von oben abgedeckt wird; eine Einheit sieht eine volle Hemisphäre um sich herum.",
    "impl-lidar-spatial:Measurement area":
      "Je Filiale anhand des Grundrisses vereinbart. Abdeckung und die darauf aufbauende Analyse werden gemeinsam, je Standort, konzipiert.",
    "impl-lidar-spatial:Power and connectivity":
      "Eine Gleichstromversorgung und eine Ethernet-Verbindung zum Verarbeitungspunkt.",
  },
};

const detailValueTranslations: Readonly<Record<Exclude<Locale, "en">, Readonly<Record<RowKey, string>>>> = {
  fr: {
    "impl-milesight-vs361-passerby:Detection method": "Faisceau infrarouge à réflexion diffuse, 940 nm",
    "impl-milesight-vs361-passerby:Mounting height": "0,7 – 1,2 m",
    "impl-milesight-vs361-passerby:Detection distance": "1 – 9 m, réglable",
    "impl-milesight-vs361-passerby:Protection rating": "IP65, -20 °C à 50 °C",
    "impl-milesight-vs361-passerby:Power": "802.3af PoE ou 12–60 V CC, max 0,9 W",
    "impl-milesight-vs361-passerby:Output":
      "Un seul signal de commutation numérique. Pas de caméra, pas de capture d'image.",
    "impl-xovis-3d-entrance:Method": "Vision stéréo 3D, traitée sur l'appareil",
    "impl-xovis-3d-entrance:Mounting height": "2,20 – 6,00 m",
    "impl-xovis-3d-entrance:Power": "Alimentation par Ethernet, max 7,5 W",
    "impl-xovis-3d-entrance:Network": "Ethernet Gigabit, Cat-5e ou supérieur, jusqu'à 100 m",
    "impl-xovis-3d-entrance:Environment": "Intérieur, 0 °C à 45 °C, minimum 2 lux",
    "impl-xovis-3d-entrance:Privacy modes":
      "Quatre niveaux sélectionnables ; le périmètre certifié couvre le niveau 2 et au-delà",
    "impl-milesight-vs125p-entrance:Method": "Vision stéréo binoculaire avec IA embarquée",
    "impl-milesight-vs125p-entrance:Mounting height": "2,2 – 6 m",
    "impl-milesight-vs125p-entrance:Power": "802.3af PoE ou 12 V CC, max 11,1 W",
    "impl-milesight-vs125p-entrance:Environment":
      "-20 °C à 50 °C, IP40, fonctionne dans l'obscurité totale",
    "impl-milesight-vs125p-entrance:Attribute recognition":
      "Configurable ; la fiche technique la limite à une hauteur de montage de 2,2 à 4 m",
    "impl-xovis-3d-spatial:Method": "Vision stéréo 3D avec IA embarquée",
    "impl-xovis-3d-spatial:Mounting height": "2,00 – 6,00 m",
    "impl-xovis-3d-spatial:Power": "Alimentation par Ethernet, max 12,95 W ; alternative USB-C",
    "impl-xovis-3d-spatial:Network": "Ethernet Gigabit, Cat-6 blindé ou supérieur, jusqu'à 100 m",
    "impl-xovis-3d-spatial:Environment": "Intérieur, 0 °C à 45 °C, minimum 2 lux",
    "impl-xovis-3d-spatial:Privacy modes":
      "Quatre niveaux sélectionnables ; le périmètre certifié couvre le niveau 2 et au-delà",
    "impl-lidar-spatial:Method": "Nuage de points LiDAR 3D ; ne capture aucune image d'une personne",
    "impl-lidar-spatial:Field of view": "360° horizontal × 90° vertical",
    "impl-lidar-spatial:Laser safety": "Classe 1, sans danger pour les yeux",
    "impl-lidar-spatial:Power": "9 – 32 V, moins de 8 W",
    "impl-lidar-spatial:Output": "Nuage de points transmis par Ethernet",
    "impl-lidar-spatial:Analytics layer":
      "Non couverte par la fiche technique cartographiée, qui documente le capteur pour un usage robotique. Conçue et validée par projet.",
  },
  de: {
    "impl-milesight-vs361-passerby:Detection method": "Diffus-reflektierender Infrarotstrahl, 940 nm",
    "impl-milesight-vs361-passerby:Mounting height": "0,7 – 1,2 m",
    "impl-milesight-vs361-passerby:Detection distance": "1 – 9 m, einstellbar",
    "impl-milesight-vs361-passerby:Protection rating": "IP65, -20 °C bis 50 °C",
    "impl-milesight-vs361-passerby:Power": "802.3af PoE oder 12–60 V DC, max. 0,9 W",
    "impl-milesight-vs361-passerby:Output":
      "Ein einziges digitales Schaltsignal. Keine Kamera, keine Bildaufnahme.",
    "impl-xovis-3d-entrance:Method": "3D-Stereovision, auf dem Gerät verarbeitet",
    "impl-xovis-3d-entrance:Mounting height": "2,20 – 6,00 m",
    "impl-xovis-3d-entrance:Power": "Power over Ethernet, max. 7,5 W",
    "impl-xovis-3d-entrance:Network": "Gigabit-Ethernet, Cat-5e oder besser, bis zu 100 m",
    "impl-xovis-3d-entrance:Environment": "Innenbereich, 0 °C bis 45 °C, mindestens 2 Lux",
    "impl-xovis-3d-entrance:Privacy modes":
      "Vier wählbare Stufen; der zertifizierte Umfang deckt Stufe 2 und höher ab",
    "impl-milesight-vs125p-entrance:Method": "Binokulare Stereovision mit KI auf dem Gerät",
    "impl-milesight-vs125p-entrance:Mounting height": "2,2 – 6 m",
    "impl-milesight-vs125p-entrance:Power": "802.3af PoE oder 12 V DC, max. 11,1 W",
    "impl-milesight-vs125p-entrance:Environment":
      "-20 °C bis 50 °C, IP40, funktioniert auch bei völliger Dunkelheit",
    "impl-milesight-vs125p-entrance:Attribute recognition":
      "Konfigurierbar; das Datenblatt begrenzt dies auf eine Montagehöhe von 2,2–4 m",
    "impl-xovis-3d-spatial:Method": "3D-Stereovision mit KI auf dem Gerät",
    "impl-xovis-3d-spatial:Mounting height": "2,00 – 6,00 m",
    "impl-xovis-3d-spatial:Power": "Power over Ethernet, max. 12,95 W; USB-C-Alternative",
    "impl-xovis-3d-spatial:Network": "Gigabit-Ethernet, Cat-6 abgeschirmt oder besser, bis zu 100 m",
    "impl-xovis-3d-spatial:Environment": "Innenbereich, 0 °C bis 45 °C, mindestens 2 Lux",
    "impl-xovis-3d-spatial:Privacy modes":
      "Vier wählbare Stufen; der zertifizierte Umfang deckt Stufe 2 und höher ab",
    "impl-lidar-spatial:Method": "3D-LiDAR-Punktwolke; erfasst kein Bild einer Person",
    "impl-lidar-spatial:Field of view": "360° horizontal × 90° vertikal",
    "impl-lidar-spatial:Laser safety": "Klasse 1, augensicher",
    "impl-lidar-spatial:Power": "9 – 32 V, unter 8 W",
    "impl-lidar-spatial:Output": "Punktwolke über Ethernet",
    "impl-lidar-spatial:Analytics layer":
      "Nicht durch das zugeordnete Datenblatt abgedeckt, das den Sensor für den Robotik-Einsatz dokumentiert. Je Projekt konzipiert und validiert.",
  },
};

export function resolveEssentialBody(
  locale: Locale,
  implementationId: TechnologyImplementationId,
  label: string,
  fallback: string,
): string {
  if (locale === "en") return fallback;
  return essentialBodyTranslations[locale][`${implementationId}:${label}`] ?? fallback;
}

export function resolveDetailValue(
  locale: Locale,
  implementationId: TechnologyImplementationId,
  label: string,
  fallback: string,
): string {
  if (locale === "en") return fallback;
  return detailValueTranslations[locale][`${implementationId}:${label}`] ?? fallback;
}

/**
 * Every row the source model carries, checked against the translation maps.
 * Run from the test suite: a row added to `implementationRequirementProfiles`
 * without a matching French and German translation is a failing check, not a
 * silently English row under an FR/DE heading.
 */
export function validateRequirementMessages(): readonly string[] {
  const missing: string[] = [];
  for (const profile of implementationRequirementProfiles) {
    for (const locale of ["fr", "de"] as const) {
      for (const essential of profile.essentials) {
        if (!essentialLabelTranslations[locale][essential.label]) {
          missing.push(`${locale}.essentialLabel.${essential.label}`);
        }
        const key: RowKey = `${profile.implementationId}:${essential.label}`;
        if (!essentialBodyTranslations[locale][key]) missing.push(`${locale}.essentialBody.${key}`);
      }
      for (const detail of profile.technicalDetail) {
        if (!detailLabelTranslations[locale][detail.label]) {
          missing.push(`${locale}.detailLabel.${detail.label}`);
        }
        const key: RowKey = `${profile.implementationId}:${detail.label}`;
        if (!detailValueTranslations[locale][key]) missing.push(`${locale}.detailValue.${key}`);
      }
    }
  }
  return missing;
}
