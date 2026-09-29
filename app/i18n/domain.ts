/**
 * Localized DISPLAY of domain content, resolved by canonical id.
 *
 * THE RULE THIS FILE OBEYS
 *
 * The domain model is the single source of every fact. English is therefore
 * never retyped here: `resolveX(...)` returns the model's own strings for `en`,
 * and only `fr` and `de` carry translations. There is exactly one place that
 * says what TECH-04 measures, what the override's approach explains and what
 * the privacy statement claims — `technology.ts`, `segment-capability-media.ts`
 * and `solution-runtime.ts` — and this file renders those, in another language,
 * against their own ids.
 *
 * That is also why the maps below are keyed by `TechnologyCapabilityId`,
 * `approachId` and principle `title`: if a canonical id changes, the lookup
 * misses and `validateDomainMessages()` reports it, rather than a stale
 * translation silently outliving the fact it was translating.
 *
 * WHAT MAY NOT HAPPEN HERE
 *
 * A translation may not add, soften or widen a claim. Every French and German
 * string below is a rendering of the English one beside it in the model, and
 * the boundary words — anonymous, configured coverage, illustrative, per
 * implementation, never generalised — survive intact in all three languages.
 */

import type { Locale } from "./locales.ts";
import { locales } from "./locales.ts";
import type { TechnologyCapabilityId } from "../content/types.ts";
import { getTechnologyCapability } from "../content/technology-runtime.ts";
import { getSegmentCapabilityMediaOverride } from "../content/segment-capability-media.ts";
import { configurePrivacyStatement } from "../content/solution-runtime.ts";
import type { ExplainerVideoViewKind } from "../content/solution-directions.ts";
import type { SegmentId } from "../content/types.ts";

/* ---------------------------------------------------------------- *
   CAPABILITIES — name and purpose, by capability id
 * ---------------------------------------------------------------- */

interface CapabilityCopy {
  name: string;
  /** The segment override's purpose where one exists, else the capability's. */
  purpose: string;
}

/**
 * Translated OVERRIDE purposes, keyed by segment then capability.
 *
 * The resolver's English branch already prefers an override's own purpose
 * over the capability's generic one — that is how Shopping Centre's TECH-04
 * panel correctly says "camera feeds" in English while Retail's says
 * "measured inside a location". Until this table existed, French and German
 * had no equivalent branch: both looked the id up in the one generic per-
 * capability table below, regardless of segment, so a single fixed sentence
 * had to serve every segment declaring that capability. The Shopping-Centre-
 * specific camera wording was sitting in that one shared slot, which meant
 * Retail and Outlet Centre — 3D LiDAR and stereo-vision segments, not camera
 * segments — were shown French and German copy claiming their movement is
 * reconstructed from IP cameras. This table gives the resolver the segment-
 * aware branch it needs, so the override text is chosen only where an
 * override for THAT segment actually exists.
 */
const capabilityOverridePurposeTranslations: Readonly<
  Record<Exclude<Locale, "en">, Readonly<Partial<Record<SegmentId, Readonly<Partial<Record<TechnologyCapabilityId, string>>>>>>>
> = {
  fr: {
    "shopping-centre": {
      "TECH-04":
        "Expliquer comment le mouvement anonyme entre zones couvertes est reconstitué à partir de flux de caméras IP compatibles au moyen d'un logiciel de perception, uniquement à l'intérieur de la couverture configurée.",
    },
  },
  de: {
    "shopping-centre": {
      "TECH-04":
        "Erklären, wie anonyme Bewegung zwischen abgedeckten Bereichen aus kompatiblen IP-Kamera-Feeds mittels Wahrnehmungssoftware rekonstruiert wird — ausschließlich innerhalb der konfigurierten Abdeckung.",
    },
  },
};

const capabilityTranslations: Readonly<
  Record<Exclude<Locale, "en">, Readonly<Partial<Record<TechnologyCapabilityId, CapabilityCopy>>>>
> = {
  fr: {
    "TECH-08": {
      name: "Connexion aux données métier et analytique",
      purpose:
        "Expliquer comment des données opérationnelles ou client sont jointes aux preuves de mouvement.",
    },
    "TECH-QSR-03": {
      name: "Communication drive et équipe",
      purpose:
        "Expliquer la communication client-équipe et équipe-équipe au point de commande et autour.",
    },
    "TECH-QSR-04": {
      name: "Clarté audio",
      purpose:
        "Expliquer comment la qualité de communication entre client et équipe peut être améliorée dans une voie bruyante.",
    },
    "TECH-QSR-06": {
      name: "Alertes intégrées au flux de travail",
      purpose:
        "Expliquer comment un événement de seuil atteint la personne capable de changer l'issue, plutôt qu'un écran de plus.",
    },
    "TECH-QSR-07": {
      name: "Intelligence de performance à l'échelle du parc",
      purpose:
        "Expliquer la comparaison multi-restaurants, hiérarchique, par plage horaire et historique de la performance de service mesurée.",
    },
    "TECH-03": {
      name: "Classification anonyme des visiteurs",
      purpose:
        "Expliquer les attributs anonymes configurés des visiteurs ou les schémas d'unité d'achat.",
    },
    "TECH-05": {
      name: "Appariement anonyme des visites",
      purpose:
        "Expliquer quand des événements anonymes distincts peuvent former une visite ou un parcours.",
    },
    "TECH-06": {
      name: "Intelligence véhicule et stationnement",
      purpose:
        "Expliquer l'arrivée des véhicules, l'accès et la pression sur le stationnement comme des questions de mesure distinctes.",
    },
    "TECH-01": {
      name: "Mesure de l'opportunité extérieure",
      purpose: "Expliquer comment le mouvement passant autour d'une vitrine est mesuré.",
    },
    "TECH-02": {
      name: "Mesure d'entrée",
      purpose: "Expliquer comment le mouvement anonyme ENTRÉE/SORTIE est mesuré à une entrée.",
    },
    "TECH-04": {
      name: "Intelligence de mouvement spatial",
      // Vendor-neutral, matching the model's own generic English purpose. The
      // camera-based wording belongs to the Shopping Centre OVERRIDE only —
      // see `capabilityOverridePurposeTranslations` below — and must not sit
      // here, where Retail and Outlet Centre (LiDAR / 3D stereo, not cameras)
      // would inherit it too.
      purpose: "Expliquer comment les parcours, zones et temps de présence anonymes sont mesurés à l'intérieur d'un lieu.",
    },
    "TECH-07": {
      name: "Géo, mobilité et SIG",
      purpose:
        "Expliquer comment un contexte de localisation agrégé est ajouté autour d'un actif physique.",
    },
    "TECH-QSR-01": {
      name: "Détection du parcours véhicule",
      purpose:
        "Expliquer comment un véhicule est détecté à des points configurés afin qu'une chronologie de parcours drive puisse exister.",
    },
    "TECH-QSR-02": {
      name: "Chronométrage drive en temps réel",
      purpose:
        "Expliquer comment le temps écoulé entre des points de détection configurés devient temps d'étape, de file et temps total de voie.",
    },
  },
  de: {
    "TECH-08": {
      name: "Anbindung von Geschäftsdaten und Analytik",
      purpose:
        "Erklären, wie betriebliche oder Kundendaten mit Bewegungsnachweisen verbunden werden.",
    },
    "TECH-QSR-03": {
      name: "Drive-Thru- und Team-Kommunikation",
      purpose:
        "Gast-zu-Team- und Team-zu-Team-Kommunikation am und um den Bestellpunkt erklären.",
    },
    "TECH-QSR-04": {
      name: "Audioklarheit",
      purpose:
        "Erklären, wie die Kommunikationsqualität zwischen Gast und Team in einer lauten Spur verbessert werden kann.",
    },
    "TECH-QSR-06": {
      name: "Meldungen im Arbeitsablauf",
      purpose:
        "Erklären, wie ein Schwellenereignis die Person erreicht, die das Ergebnis ändern kann — statt einen weiteren Bildschirm.",
    },
    "TECH-QSR-07": {
      name: "Performance-Intelligenz über das Portfolio",
      purpose:
        "Vergleich über mehrere Restaurants, Hierarchie, Tagesabschnitte und Historie der gemessenen Servicequalität erklären.",
    },
    "TECH-03": {
      name: "Anonyme Besucherklassifikation",
      purpose:
        "Konfigurierte anonyme Besuchermerkmale oder Kaufeinheitsmuster erklären.",
    },
    "TECH-05": {
      name: "Anonyme Besuchszuordnung",
      purpose:
        "Erklären, wann getrennte anonyme Ereignisse einen Besuch oder eine Reise bilden dürfen.",
    },
    "TECH-06": {
      name: "Fahrzeug- und Parkraumintelligenz",
      purpose:
        "Fahrzeugankunft, Zufahrt und Parkdruck als getrennte Messfragen erklären.",
    },
    "TECH-01": {
      name: "Messung des Außenpotenzials",
      purpose: "Erklären, wie vorbeigehende Bewegung rund um eine Fassade gemessen wird.",
    },
    "TECH-02": {
      name: "Eingangsmessung",
      purpose: "Erklären, wie anonyme EIN-/AUS-Bewegung an einem Eingang gemessen wird.",
    },
    "TECH-04": {
      name: "Räumliche Bewegungsintelligenz",
      // Vendor-neutral, matching the model's own generic English purpose. The
      // camera-based wording belongs to the Shopping Centre OVERRIDE only —
      // see `capabilityOverridePurposeTranslations` below.
      purpose: "Erklären, wie anonyme Wege, Zonen und Verweildauer innerhalb eines Standorts gemessen werden.",
    },
    "TECH-07": {
      name: "Geo, Mobilität und GIS",
      purpose:
        "Erklären, wie aggregierter Standortkontext rund um ein physisches Objekt ergänzt wird.",
    },
    "TECH-QSR-01": {
      name: "Erkennung der Fahrzeugfahrt",
      purpose:
        "Erklären, wie ein Fahrzeug an konfigurierten Punkten erkannt wird, damit eine Zeitleiste der Drive-Thru-Fahrt entstehen kann.",
    },
    "TECH-QSR-02": {
      name: "Echtzeit-Drive-Thru-Zeitmessung",
      purpose:
        "Erklären, wie die verstrichene Zeit zwischen konfigurierten Erkennungspunkten zu Stufen-, Warteschlangen- und Gesamtspurzeit wird.",
    },
  },
};

export function resolveCapabilityCopy(
  locale: Locale,
  segmentId: SegmentId,
  capabilityId: TechnologyCapabilityId,
): CapabilityCopy | null {
  const capability = getTechnologyCapability(capabilityId);
  if (!capability) return null;

  const override = getSegmentCapabilityMediaOverride(segmentId, capabilityId);
  if (locale === "en") {
    // The model itself, including the segment's own narrowed purpose.
    return { name: capability.name, purpose: override?.purpose ?? capability.purpose };
  }
  const base = capabilityTranslations[locale][capabilityId];
  if (!base) return null;
  // Mirror the English branch exactly: an override's purpose wins, but only
  // where THIS segment has a translated override text. A segment whose
  // override has not been translated falls back to the generic capability
  // text rather than silently borrowing another segment's override — the
  // same "narrow, never invent" rule the override model itself states.
  const overridePurpose = override?.purpose
    ? capabilityOverridePurposeTranslations[locale][segmentId]?.[capabilityId]
    : undefined;
  return { name: base.name, purpose: overridePurpose ?? base.purpose };
}

/* ---------------------------------------------------------------- *
   EXPLAINERS — by the override's own approachId
 * ---------------------------------------------------------------- */

interface ExplainerCopy {
  approachName: string;
  explanation: string;
  illustrationNote: string;
  altText: string;
}

const explainerTranslations: Readonly<
  Record<Exclude<Locale, "en">, Readonly<Record<string, ExplainerCopy>>>
> = {
  fr: {
    "frontage-beam": {
      approachName: "Ligne de détection en façade",
      explanation:
        "Une ligne de détection court le long de la façade. Chaque personne qui passe physiquement la franchit, et le franchissement est compté. C'est une mesure physique directe des personnes réellement devant votre magasin — pas une estimation de la zone environnante.",
      illustrationNote: "",
      altText:
        "Une rue commerçante au crépuscule vue du trottoir, avec une ligne horizontale tracée le long de la façade. Des passants la franchissent.",
    },
    "threshold-cone": {
      approachName: "Vue de seuil en plongée",
      explanation:
        "La porte est observée directement d'en haut, de sorte que toute la largeur du seuil est couverte. Toute personne qui le franchit est suivie comme une forme, assez longtemps pour savoir si elle est entrée ou sortie — c'est ce qui distingue une visite d'un passant.",
      illustrationNote: "",
      altText:
        "Une entrée de magasin vue de l'extérieur, avec un cône de lumière descendant du plafond pour couvrir la largeur de la porte. Des personnes entrent et sortent en le traversant.",
    },
    "lidar-point-cloud": {
      approachName: "Nuage de points LiDAR",
      explanation:
        "L'espace est mesuré comme un nuage de points de distance plutôt que comme une image. Les personnes apparaissent comme des formes anonymes dans ce nuage : leur position et leur parcours peuvent être suivis sans qu'aucune image de quiconque ne soit jamais formée.",
      illustrationNote: "",
      altText:
        "Un intérieur de magasin rendu comme un nuage de points, les personnes apparaissant comme des silhouettes anonymes formées de points et leurs parcours tracés en pointillés entre les meubles.",
    },
    "3d-path-tracking": {
      approachName: "Suivi de parcours 3D",
      explanation:
        "Le sol est observé d'en haut et chaque visiteur est suivi comme une forme anonyme qui s'y déplace. Il en ressort le parcours emprunté et les endroits où il s'est arrêté — la forme de l'usage réel de l'espace.",
      illustrationNote: "",
      altText:
        "Un sol de magasin vu d'en haut, avec de doux parcours lumineux tracés entre les présentoirs et des points clairs marquant les arrêts.",
    },
    "threshold-alert-to-person": {
      approachName: "Un événement de seuil qui atteint la personne capable d'agir",
      explanation:
        "Lorsqu'un seuil configuré est franchi, l'événement est signalé là où la personne capable de réagir l'entendra. L'alerte sert à l'atteindre ; ce qui suit lui appartient.",
      illustrationNote:
        "Illustration du principe d'alerte. Pas de données client, et pas la représentation d'une installation matérielle particulière.",
      altText:
        "Un membre d'équipe portant un casque se tient à l'intérieur d'un restaurant. Un indicateur ambre se trouve à l'oreillette, et de doux liens violets partent du casque vers la ligne de cuisine et vers un collègue servant une voiture à la fenêtre du drive.",
    },
    "lane-point-detection": {
      approachName: "Détection aux points de voie configurés",
      explanation:
        "Un véhicule est détecté lorsqu'il atteint chaque point configuré de la voie. Ce qui existe, c'est l'instant d'arrivée à ce point, et rien qui décrive le véhicule ni quiconque à son bord.",
      illustrationNote:
        "Illustration du principe de mesure. Pas de données client, et pas la représentation d'une installation matérielle particulière.",
      altText:
        "Une voie de drive au crépuscule avec trois voitures en file. Un arc discret surmonte chaque voiture à l'endroit où la voie croise un point marqué, et une ligne violette longe le sol jusqu'à un écran à l'intérieur du bâtiment affichant une barre segmentée neutre. Aucun chiffre n'apparaît.",
    },
    "point-to-point-timing": {
      approachName: "Temps écoulé entre deux points configurés",
      explanation:
        "Le temps est l'écart entre un point de détection configuré et le suivant. Le temps d'étape, de file et le temps total de voie sont cet écart, mesuré — ce n'est pas une estimation, et cela ne dit rien de ce qui s'est passé dans la voiture.",
      illustrationNote:
        "Illustration du principe de mesure. Pas de données client, et pas la représentation d'une installation matérielle particulière.",
      altText:
        "Une voie de drive au crépuscule avec des voitures en file, une ligne violette allant de la voie à un écran à l'intérieur du bâtiment, et sur cet écran une barre segmentée neutre représentant les étapes du parcours. Aucun chiffre n'apparaît.",
    },
    "crew-communication-link": {
      approachName: "Audio client-équipe et équipe-équipe",
      explanation:
        "La parole circule entre la borne de voie et l'équipe, et entre membres de l'équipe. C'est un canal de communication, pas une mesure : rien ici ne compte, ne chronomètre ni ne classe quiconque.",
      illustrationNote:
        "Illustration du principe de communication. Pas de données client, et pas la représentation d'une installation matérielle particulière.",
      altText:
        "Un membre d'équipe portant un casque se tient à l'intérieur d'un restaurant. Deux arcs violets partent du casque : l'un vers la ligne de cuisine, l'autre vers une borne au bord de la voie de drive où un autre membre d'équipe sert une voiture.",
    },
    "voice-ai-with-crew-takeover": {
      approachName: "Prise de commande automatisée avec reprise par l'équipe",
      explanation:
        "Un service automatisé peut prendre la commande à la borne, et un membre de l'équipe peut reprendre la main à tout moment. L'image montre ce chemin de reprise et rien sur l'issue d'une commande.",
      illustrationNote:
        "Illustration du principe de commande. Pas de données client, et pas la représentation du service d'un fournisseur particulier.",
      altText:
        "Une voiture à une borne de commande de drive au crépuscule. Une forme d'onde relie la vitre du conducteur à la borne, puis à un petit groupe de symboles d'articles et enfin à un membre d'équipe portant un casque à la fenêtre intérieure.",
    },
    "sc-anonymous-classification": {
      approachName: "Groupes de visiteurs anonymes",
      explanation:
        "Une analytique configurée classe des silhouettes anonymes en grands groupes de visiteurs — une personne seule, un couple, un groupe, une personne avec une poussette. Elle décrit des groupes, jamais une personne, et uniquement pour les attributs qu'un déploiement est configuré et validé pour produire.",
      illustrationNote: "Illustration du principe de mesure. Pas des données client ni la représentation d'une implémentation matérielle particulière.",
      altText:
        "Une galerie de centre commercial lumineuse vue derrière les visiteurs. De légers cadres colorés entourent une personne seule, un couple, une personne avec un sac à dos et une personne poussant une poussette. Aucun visage n'est visible et rien n'est étiqueté.",
    },
    "sc-anonymous-reid": {
      approachName: "Ré-identification anonyme entre vues",
      explanation:
        "Une même apparence observée est appariée entre deux vues de caméra distinctes — ici une entrée et une allée — dans une courte fenêtre et uniquement dans la couverture configurée. Cet appariement transforme deux observations en un seul mouvement anonyme, sans savoir qui est qui.",
      illustrationNote: "Illustration du principe de mesure. Pas des données client ni la représentation d'une implémentation matérielle particulière.",
      altText:
        "Deux vues côte à côte dans un centre commercial : à gauche une personne entre par l'entrée, à droite la même personne marche dans une allée. Le même cadre l'entoure dans les deux vues. Elle est vue de dos et rien n'est étiqueté.",
    },
    "oc-anonymous-classification": {
      approachName: "Groupes de visiteurs anonymes",
      explanation:
        "Une analytique configurée classe des silhouettes anonymes en grands groupes de visiteurs à mesure qu'ils parcourent les rues de l'outlet — une personne seule, un couple, un groupe, une personne avec une poussette. Elle décrit des groupes, jamais une personne, et uniquement pour les attributs qu'un déploiement est configuré et validé pour produire.",
      illustrationNote: "Illustration du principe de mesure. Pas des données client ni la représentation d'une implémentation matérielle particulière.",
      altText:
        "Une rue d'outlet à ciel ouvert au coucher du soleil, vue derrière les visiteurs. De légers cadres colorés entourent une personne seule, un couple portant des sacs et une personne poussant une poussette. Aucun visage n'est visible et rien n'est étiqueté.",
    },    "vehicle-anpr-plate-reading": {
      approachName: "Lecture de plaques aux points d'accès",
      explanation:
        "Un capteur ANPR lit la plaque d'immatriculation de chaque véhicule qui franchit un point d'accès configuré, avec l'heure. On obtient les arrivées de véhicules et, lorsque la plaque est relue à la sortie, la durée de présence d'un véhicule. Une plaque n'est pas anonyme et un véhicule n'est pas un visiteur : elle ne dit rien de qui se trouve à bord, ni de combien de personnes.",
      illustrationNote:
        "Illustration du principe de mesure. Le lieu, les plaques, les heures et les scores sont illustratifs, les enseignes sont floutées, et ce ne sont pas des données client.",
      altText:
        "L'accès d'un retail park au coucher du soleil. Les voitures qui entrent sont encadrées, avec leur plaque lue à côté ; une plaque est agrandie avec son pays, sa date et son heure. Les enseignes sont floutées.",
    },
    "vehicle-object-detection": {
      approachName: "Détection d'objets dans une vue caméra",
      explanation:
        "Un capteur de détection IP reconnaît les objets dans sa vue configurée — véhicules, personnes, chariots — et les compte lorsqu'ils franchissent des lignes configurées. Une détection est une classe d'objet, pas une identité, et les scores sont la confiance du modèle dans une détection, pas un résultat mesuré.",
      illustrationNote:
        "Illustration du principe de mesure. Le lieu, les plaques, les heures et les scores sont illustratifs, les enseignes sont floutées, et ce ne sont pas des données client.",
      altText:
        "Un retail park vu depuis le trottoir au coucher du soleil. Les voitures du parking et les personnes qui se dirigent vers les magasins sont encadrées et étiquetées comme voiture, personne ou chariot, avec un score de détection. Les enseignes sont floutées.",
    },

    "retail-anonymous-classification": {
      approachName: "Groupes de visiteurs anonymes",
      explanation:
        "Une analytique configurée classe les silhouettes anonymes qui franchissent l'entrée en grandes unités d'achat — une personne seule, deux personnes ensemble, un groupe, une personne avec une poussette. Elle décrit des groupes, jamais une personne, et uniquement pour les catégories qu'un déploiement est configuré et validé pour produire.",
      illustrationNote: "Illustration schématique du principe de mesure. Pas des données client, pas un lieu réel et pas la représentation d'un matériel particulier.",
      altText:
        "Un dessin au trait d'un intérieur de magasin vu d'en haut, avec des tables et un portant. De légers cadres colorés entourent une personne seule, deux personnes ensemble, un adulte avec une poussette et un groupe de trois. Les silhouettes n'ont pas de visage et rien n'est étiqueté.",
    },
    "sc-threshold-counting": {
      approachName: "Comptage à un seuil",
      explanation:
        "Un capteur au-dessus du seuil en observe toute la largeur. Chaque personne qui franchit la ligne en dessous est comptée, et le sens du passage indique si elle est entrée ou sortie — une visite, pas un passant. Il compte des passages ; il n'identifie personne.",
      illustrationNote: "Illustration schématique du principe de mesure. Pas des données client, pas un lieu réel et pas la représentation d'un matériel particulier.",
      altText:
        "Un dessin au trait d'une galerie de centre commercial, avec des vitrines et la balustrade d'une trémie donnant sur le niveau inférieur. Un petit capteur au-dessus de l'entrée d'un magasin projette un cône léger sur toute la largeur du seuil, avec une ligne au sol en dessous. Deux personnes le franchissent, l'une en entrant, l'autre en sortant ; d'autres passent le long de la galerie.",
    },
    "rp-unit-entrance-counting": {
      approachName: "Comptage à l'entrée d'une cellule",
      explanation:
        "Un capteur au-dessus de l'entrée d'une cellule observe toute la largeur de la porte. Chaque personne qui franchit la ligne en dessous est comptée, en entrée ou en sortie, exactement aux entrées choisies pour la mesure. Le reste du parc n'est pas compté par ce capteur.",
      illustrationNote: "Illustration schématique du principe de mesure. Pas des données client, pas un lieu réel et pas la représentation d'un matériel particulier.",
      altText:
        "Un dessin au trait d'un retail park à ciel ouvert : deux façades de cellules, un trottoir et un parking devant. Un petit capteur sous l'auvent de l'entrée d'une cellule projette un cône léger sur la porte, avec une ligne au sol en dessous. Une personne entre, une autre sort ; d'autres traversent le parking.",
    },

    "oc-entrance-counting": {
      approachName: "Comptage à l'entrée de l'outlet",
      explanation:
        "Un capteur au-dessus de l'entrée observe toute la largeur du passage. Chaque visiteur qui franchit la ligne en dessous est compté, en entrée ou en sortie. Le même principe s'applique à la porte d'un magasin, pour compter les visiteurs qui y entrent réellement.",
      illustrationNote: "Illustration schématique du principe de mesure. Pas des données client, pas un lieu réel et pas la représentation d'un matériel particulier.",
      altText:
        "Un dessin au trait du portail d'entrée d'un village outlet, avec des magasins à toits en pente derrière. Un petit capteur sur la poutre du portail projette un cône léger sur toute la largeur du passage, avec une ligne sur le pavage en dessous. Des visiteurs le traversent dans les deux sens.",
    },
    "oc-zone-counting-lines": {
      approachName: "Lignes de comptage entre zones",
      explanation:
        "Les visiteurs sont comptés lorsqu'ils franchissent des lignes configurées là où une rue, une zone ou une locomotive rejoint la suivante. Le comptage n'a lieu que dans les vues couvertes ; la rue entre elles n'est pas mesurée, et rien n'est reconstitué à travers les zones non couvertes.",
      illustrationNote: "Illustration schématique du principe de mesure. Pas des données client, pas un lieu réel et pas la représentation d'un matériel particulier.",
      altText:
        "Un dessin au trait d'une rue d'outlet à ciel ouvert vue d'en haut, bordée d'une rangée de magasins à toits en pente. Trois petits dômes sur les bâtiments couvrent chacun une portion de la rue, avec du pavage non couvert entre elles. Une ligne lumineuse traverse la rue dans chaque portion couverte, et les visiteurs qui la franchissent sont mis en évidence.",
    },

    "camera-coverage-anonymous-reid": {
      approachName: "Couverture caméra et ré-identification anonyme",
      explanation:
        "Des caméras compatibles couvrent certaines parties du centre — entrées, allées et transitions — et non l'ensemble. Un logiciel de perception peut ré-identifier anonymement une même apparence observée entre des vues de caméras compatibles et couvertes, puis apparier ces observations entre elles. Cela permet de reconstituer le mouvement entre zones couvertes sous forme de parcours et de transitions, sans créer d'enregistrement d'une personne.",
      illustrationNote:
        "Illustration du principe de mesure. Pas des données client ni la représentation d'une implémentation matérielle particulière.",
      altText:
        "Un atrium de centre commercial vu d'un niveau supérieur, avec une fontaine, des escalators et des vitrines sur deux niveaux. Quatre petites caméras dôme projettent chacune un champ de vision violet translucide sur une partie différente de la galerie, et ces champs ne se rejoignent pas — une grande partie du sol reste en dehors. Certaines des personnes qui marchent en dessous portent un petit anneau violet à leurs pieds, et des lignes violettes en pointillés relient quelques-uns de ces anneaux d'une zone couverte à la suivante. Aucun visage n'est cadré, détouré ni marqué, et rien dans l'image n'est étiqueté avec un nom ou un chiffre.",
    },
  },
  de: {
    "frontage-beam": {
      approachName: "Detektionslinie an der Fassade",
      explanation:
        "Eine Detektionslinie verläuft entlang der Fassade. Jede Person, die physisch vorbeigeht, überquert sie, und die Überquerung wird gezählt. Das ist eine direkte physische Messung der Menschen tatsächlich vor Ihrem Store — keine Schätzung des weiteren Umfelds.",
      illustrationNote: "",
      altText:
        "Eine Einkaufsstraße in der Dämmerung vom Gehweg aus, mit einer waagerechten Linie entlang der Fassade. Vorbeigehende überqueren sie.",
    },
    "threshold-cone": {
      approachName: "Schwellenansicht von oben",
      explanation:
        "Die Tür wird direkt von oben beobachtet, sodass die volle Breite der Schwelle abgedeckt ist. Wer sie überquert, wird als Form lange genug verfolgt, um zu erkennen, ob jemand hinein- oder hinausging — genau das trennt einen Besuch von einem Passanten.",
      illustrationNote: "",
      altText:
        "Ein Ladeneingang von außen, mit einem Lichtkegel, der von der Decke herab die Breite der Tür abdeckt. Menschen gehen hindurch hinein und hinaus.",
    },
    "lidar-point-cloud": {
      approachName: "LiDAR-Punktwolke",
      explanation:
        "Der Raum wird als Wolke von Distanzpunkten gemessen, nicht als Bild. Menschen erscheinen als anonyme Formen in dieser Wolke, sodass Position und Weg verfolgt werden können, ohne dass je ein Bild von jemandem entsteht.",
      illustrationNote: "",
      altText:
        "Ein Ladeninneres als Punktwolke dargestellt, Menschen als anonyme, aus Punkten geformte Figuren, ihre Wege als gepunktete Pfade zwischen den Möbeln.",
    },
    "3d-path-tracking": {
      approachName: "3D-Wegeverfolgung",
      explanation:
        "Die Fläche wird von oben beobachtet, und jeder Besucher wird als anonyme Form über sie hinweg verfolgt. Heraus kommt der genommene Weg und wo er innehielt — die Form der tatsächlichen Nutzung des Raums.",
      illustrationNote: "",
      altText:
        "Eine Ladenfläche von oben, mit weichen leuchtenden Wegen zwischen den Auslagen und hellen Punkten dort, wo diese Wege innehalten.",
    },
    "threshold-alert-to-person": {
      approachName: "Ein Schwellenereignis, das die handlungsfähige Person erreicht",
      explanation:
        "Wird ein konfigurierter Schwellenwert überschritten, wird das Ereignis dort ausgelöst, wo die Person, die reagieren kann, es hört. Sie zu erreichen ist die Aufgabe der Meldung; was danach geschieht, liegt bei ihr.",
      illustrationNote:
        "Illustration des Meldeprinzips. Keine Kundendaten und keine Darstellung einer bestimmten Hardware-Installation.",
      altText:
        "Ein Teammitglied mit Headset steht in einem Restaurant. Am Ohrstück liegt ein bernsteinfarbener Hinweis, und weiche violette Verbindungen führen vom Headset zur Küchenlinie und hinaus zu einer Kollegin, die ein Auto am Drive-Thru-Fenster bedient.",
    },
    "lane-point-detection": {
      approachName: "Erkennung an konfigurierten Spurpunkten",
      explanation:
        "Ein Fahrzeug wird erkannt, sobald es jeden konfigurierten Punkt der Spur erreicht. Was existiert, ist der Moment der Ankunft an diesem Punkt — und nichts, was das Fahrzeug oder jemanden darin beschreibt.",
      illustrationNote:
        "Illustration des Messprinzips. Keine Kundendaten und keine Darstellung einer bestimmten Hardware-Installation.",
      altText:
        "Eine Drive-Thru-Spur in der Dämmerung mit drei wartenden Autos. Über jedem Auto liegt ein weicher Bogen dort, wo die Spur einen markierten Punkt kreuzt, und eine violette Linie verläuft am Boden entlang zu einem Bildschirm im Gebäude, der einen schlichten segmentierten Balken zeigt. Es erscheint keine Zahl.",
    },
    "point-to-point-timing": {
      approachName: "Verstrichene Zeit zwischen zwei konfigurierten Punkten",
      explanation:
        "Zeit ist der Abstand zwischen einem konfigurierten Erkennungspunkt und dem nächsten. Stufen-, Warteschlangen- und Gesamtspurzeit sind dieser gemessene Abstand — keine Schätzung, und sie sagen nichts darüber aus, was im Auto geschah.",
      illustrationNote:
        "Illustration des Messprinzips. Keine Kundendaten und keine Darstellung einer bestimmten Hardware-Installation.",
      altText:
        "Eine Drive-Thru-Spur in der Dämmerung mit wartenden Autos, einer violetten Linie von der Spur zu einem Bildschirm im Gebäude und einem schlichten segmentierten Balken auf diesem Bildschirm, der für die Stufen der Fahrt steht. Es erscheint keine Zahl.",
    },
    "crew-communication-link": {
      approachName: "Audio zwischen Gast und Team und innerhalb des Teams",
      explanation:
        "Sprache läuft zwischen der Spursäule und dem Team sowie zwischen Teammitgliedern. Das ist ein Kommunikationsweg, keine Messung: nichts hier zählt, misst Zeit oder klassifiziert jemanden.",
      illustrationNote:
        "Illustration des Kommunikationsprinzips. Keine Kundendaten und keine Darstellung einer bestimmten Hardware-Installation.",
      altText:
        "Ein Teammitglied mit Headset steht in einem Restaurant. Zwei weiche violette Bögen verlaufen vom Headset: einer zurück zur Küchenlinie, einer hinaus zu einer Säule an der Drive-Thru-Spur, wo ein weiteres Teammitglied ein Auto bedient.",
    },
    "voice-ai-with-crew-takeover": {
      approachName: "Automatisierte Bestellannahme mit Übernahme durch das Team",
      explanation:
        "Ein automatisierter Dienst kann die Bestellung an der Säule annehmen, und ein Teammitglied kann jederzeit übernehmen. Das Bild zeigt diesen Übergabeweg und nichts über den Ausgang einer Bestellung.",
      illustrationNote:
        "Illustration des Bestellprinzips. Keine Kundendaten und keine Darstellung des Dienstes eines bestimmten Anbieters.",
      altText:
        "Ein Auto an einer Drive-Thru-Bestellsäule in der Dämmerung. Eine Wellenform verläuft vom Fahrerfenster zur Säule, von dort zu einer kleinen Gruppe von Artikelsymbolen und weiter zu einem Teammitglied mit Headset am Fenster im Inneren.",
    },
    "sc-anonymous-classification": {
      approachName: "Anonyme Besuchergruppen",
      explanation:
        "Konfigurierte Analytik ordnet anonyme Silhouetten groben Besuchergruppen zu — eine Person allein, ein Paar, eine Gruppe, eine Person mit Kinderwagen. Sie beschreibt Gruppen, niemals eine Person, und nur für die Merkmale, für die ein Einsatz konfiguriert und validiert ist.",
      illustrationNote: "Illustration des Messprinzips. Keine Kundendaten und keine Darstellung einer bestimmten Hardware-Implementierung.",
      altText:
        "Eine helle Einkaufszentrum-Passage, von hinten gesehen. Dezente farbige Rahmen umgeben eine allein gehende Person, ein Paar, eine Person mit Rucksack und eine Person mit Kinderwagen. Kein Gesicht ist sichtbar und nichts ist beschriftet.",
    },
    "sc-anonymous-reid": {
      approachName: "Anonyme Wiedererkennung zwischen Ansichten",
      explanation:
        "Dieselbe beobachtete Erscheinung wird zwischen zwei getrennten Kameraansichten zugeordnet — hier ein Eingang und ein Gang — innerhalb eines kurzen Zeitfensters und nur innerhalb der konfigurierten Abdeckung. Diese Zuordnung macht aus zwei Beobachtungen eine anonyme Bewegung, ohne zu erfahren, wer jemand ist.",
      illustrationNote: "Illustration des Messprinzips. Keine Kundendaten und keine Darstellung einer bestimmten Hardware-Implementierung.",
      altText:
        "Zwei Ansichten nebeneinander in einem Einkaufszentrum: links betritt eine Person den Eingang, rechts geht dieselbe Person einen Gang entlang. Derselbe Rahmen umgibt sie in beiden Ansichten. Sie ist von hinten zu sehen und nichts ist beschriftet.",
    },
    "oc-anonymous-classification": {
      approachName: "Anonyme Besuchergruppen",
      explanation:
        "Konfigurierte Analytik ordnet anonyme Silhouetten groben Besuchergruppen zu, während sie sich durch die Outlet-Straßen bewegen — eine Person allein, ein Paar, eine Gruppe, eine Person mit Kinderwagen. Sie beschreibt Gruppen, niemals eine Person, und nur für die Merkmale, für die ein Einsatz konfiguriert und validiert ist.",
      illustrationNote: "Illustration des Messprinzips. Keine Kundendaten und keine Darstellung einer bestimmten Hardware-Implementierung.",
      altText:
        "Eine offene Outlet-Straße bei Sonnenuntergang, von hinten gesehen. Dezente farbige Rahmen umgeben eine allein gehende Person, ein Paar mit Einkaufstaschen und eine Person mit Kinderwagen. Kein Gesicht ist sichtbar und nichts ist beschriftet.",
    },    "vehicle-anpr-plate-reading": {
      approachName: "Kennzeichenerfassung an Zufahrtspunkten",
      explanation:
        "Ein ANPR-Sensor liest das Kennzeichen jedes Fahrzeugs, das einen konfigurierten Zufahrtspunkt überquert, mit Uhrzeit. So entstehen Fahrzeugankünfte und, wenn das Kennzeichen bei der Ausfahrt erneut gelesen wird, die Aufenthaltsdauer eines Fahrzeugs. Ein Kennzeichen ist nicht anonym, und ein Fahrzeug ist kein Besucher: Es sagt nichts darüber, wer oder wie viele Personen darin sitzen.",
      illustrationNote:
        "Illustration des Messprinzips. Ort, Kennzeichen, Uhrzeiten und Werte sind illustrativ, Ladenschilder sind unkenntlich gemacht, und es handelt sich nicht um Kundendaten.",
      altText:
        "Die Zufahrt eines Fachmarktzentrums bei Sonnenuntergang. Einfahrende Autos sind jeweils gerahmt, ihr Kennzeichen daneben gelesen; ein Kennzeichen ist mit Land, Datum und Uhrzeit vergrößert. Ladenschilder sind unkenntlich gemacht.",
    },
    "vehicle-object-detection": {
      approachName: "Objekterkennung in einer Kameraansicht",
      explanation:
        "Ein IP-Detektionssensor erkennt Objekte in seiner konfigurierten Ansicht — Fahrzeuge, Personen, Einkaufswagen — und zählt sie, wenn sie konfigurierte Linien überqueren. Eine Erkennung ist eine Objektklasse, keine Identität, und die Werte sind die Sicherheit des Modells bei einer Erkennung, kein Messergebnis.",
      illustrationNote:
        "Illustration des Messprinzips. Ort, Kennzeichen, Uhrzeiten und Werte sind illustrativ, Ladenschilder sind unkenntlich gemacht, und es handelt sich nicht um Kundendaten.",
      altText:
        "Ein Fachmarktzentrum vom Gehweg aus bei Sonnenuntergang. Autos auf dem Parkplatz und Menschen auf dem Weg zu den Geschäften sind jeweils gerahmt und als Auto, Person oder Einkaufswagen beschriftet, mit einem Erkennungswert. Ladenschilder sind unkenntlich gemacht.",
    },

    "retail-anonymous-classification": {
      approachName: "Anonyme Besuchergruppen",
      explanation:
        "Eine konfigurierte Analytik ordnet die anonymen Gestalten, die den Eingang passieren, groben Kaufeinheiten zu — eine Person allein, zwei zusammen, eine Gruppe, jemand mit Kinderwagen. Sie beschreibt Gruppen, niemals eine Person, und nur für die Kategorien, für die ein Einsatz konfiguriert und validiert ist.",
      illustrationNote: "Schematische Illustration des Messprinzips. Keine Kundendaten, kein realer Ort und keine Darstellung bestimmter Hardware.",
      altText:
        "Eine Strichzeichnung eines Ladeninneren von oben, mit Tischen und einer Kleiderstange. Weiche farbige Rahmen umgeben eine Person allein, zwei Personen zusammen, einen Erwachsenen mit Kinderwagen und eine Dreiergruppe. Die Figuren haben keine Gesichter, und nichts ist beschriftet.",
    },
    "sc-threshold-counting": {
      approachName: "Zählung an einer Schwelle",
      explanation:
        "Ein Sensor über der Schwelle erfasst deren volle Breite. Jede Person, die die Linie darunter überquert, wird gezählt, und die Richtung zeigt, ob sie hinein- oder hinausgegangen ist — ein Besuch, kein Passant. Er zählt Überquerungen; er identifiziert niemanden.",
      illustrationNote: "Schematische Illustration des Messprinzips. Keine Kundendaten, kein realer Ort und keine Darstellung bestimmter Hardware.",
      altText:
        "Eine Strichzeichnung einer Einkaufszentrum-Mall mit Schaufenstern und der Brüstung eines Luftraums zur Etage darunter. Ein kleiner Sensor über einem Store-Eingang wirft einen weichen Kegel über die volle Breite der Schwelle, mit einer Linie auf dem Boden darunter. Zwei Personen überqueren sie, eine hinein, eine hinaus; andere gehen die Mall entlang.",
    },
    "rp-unit-entrance-counting": {
      approachName: "Zählung am Eingang einer Einheit",
      explanation:
        "Ein Sensor über dem Eingang einer Einheit erfasst die volle Breite der Tür. Jede Person, die die Linie darunter überquert, wird gezählt, hinein oder hinaus, genau an den Eingängen, die für die Messung gewählt wurden. Den Rest des Parks zählt dieser Sensor nicht.",
      illustrationNote: "Schematische Illustration des Messprinzips. Keine Kundendaten, kein realer Ort und keine Darstellung bestimmter Hardware.",
      altText:
        "Eine Strichzeichnung eines Fachmarktzentrums unter freiem Himmel: zwei Fassaden von Einheiten, ein Gehweg und davor ein Parkplatz. Ein kleiner Sensor unter dem Vordach eines Eingangs wirft einen weichen Kegel über die Tür, mit einer Linie auf dem Boden darunter. Eine Person geht hinein, eine hinaus; andere überqueren den Parkplatz.",
    },

    "oc-entrance-counting": {
      approachName: "Zählung am Outlet-Eingang",
      explanation:
        "Ein Sensor über dem Eingang erfasst die volle Breite des Durchgangs. Jeder Besucher, der die Linie darunter überquert, wird gezählt, hinein oder hinaus. Dasselbe Prinzip gilt an einer Store-Tür und zählt die Besucher, die tatsächlich hineingehen.",
      illustrationNote: "Schematische Illustration des Messprinzips. Keine Kundendaten, kein realer Ort und keine Darstellung bestimmter Hardware.",
      altText:
        "Eine Strichzeichnung des Eingangstors eines Outlet-Villages, dahinter Stores mit Satteldächern. Ein kleiner Sensor am Torbalken wirft einen weichen Kegel über die volle Breite des Durchgangs, mit einer Linie auf dem Pflaster darunter. Besucher gehen in beide Richtungen hindurch.",
    },
    "oc-zone-counting-lines": {
      approachName: "Zähllinien zwischen Zonen",
      explanation:
        "Besucher werden gezählt, wenn sie konfigurierte Linien überqueren, an denen eine Straße, Zone oder ein Ankermieter an den nächsten grenzt. Gezählt wird nur in den abgedeckten Ansichten; die Straße dazwischen wird nicht gemessen, und über die Lücken hinweg wird nichts rekonstruiert.",
      illustrationNote: "Schematische Illustration des Messprinzips. Keine Kundendaten, kein realer Ort und keine Darstellung bestimmter Hardware.",
      altText:
        "Eine Strichzeichnung einer Outlet-Straße unter freiem Himmel aus erhöhtem Blickwinkel, gesäumt von einer Reihe Stores mit Satteldächern. Drei kleine Kuppeln an den Gebäuden decken je einen Straßenabschnitt ab, mit nicht abgedecktem Pflaster dazwischen. In jedem abgedeckten Abschnitt verläuft eine leuchtende Linie quer über die Straße, und die Besucher, die sie überqueren, sind hervorgehoben.",
    },

    "camera-coverage-anonymous-reid": {
      approachName: "Kameraabdeckung und anonyme Re-Identifikation",
      explanation:
        "Kompatible Kameras decken Teile des Centers ab — Eingänge, Gänge und Übergänge — nicht das gesamte Center. Wahrnehmungssoftware kann dieselbe beobachtete Erscheinung anonym über kompatible, abgedeckte Kameraansichten hinweg re-identifizieren und diese Beobachtungen einander zuordnen. So lässt sich Bewegung zwischen abgedeckten Bereichen als Wege und Übergänge rekonstruieren, ohne einen Datensatz zu einer Person anzulegen.",
      illustrationNote:
        "Illustration des Messprinzips. Keine Kundendaten und keine Darstellung einer bestimmten Hardware-Implementierung.",
      altText:
        "Ein Einkaufszentrum-Atrium von einer oberen Ebene aus gesehen, mit Brunnen, Rolltreppen und Schaufenstern auf zwei Ebenen. Vier kleine Dome-Kameras werfen jeweils ein weiches, durchscheinendes violettes Sichtfeld über einen anderen Teil der Galerie, und die Felder berühren sich nicht — ein großer Teil des Bodens liegt außerhalb. Einige der unten gehenden Personen tragen einen kleinen violetten Ring zu ihren Füßen, und gestrichelte violette Linien verbinden einige dieser Ringe von einem abgedeckten Bereich zum nächsten. Kein Gesicht ist eingerahmt, umrandet oder markiert, und nichts im Bild ist mit einem Namen oder einer Zahl beschriftet.",
    },
  },
};

export function resolveExplainerCopy(
  locale: Locale,
  approachId: string,
  fallback: ExplainerCopy,
): ExplainerCopy {
  if (locale === "en") return fallback;
  return explainerTranslations[locale][approachId] ?? fallback;
}

/* ---------------------------------------------------------------- *
   EXAMPLE VIDEOS — by capability id, and the nested follow-on by its
   own action label (the only thing that names it uniquely)
 *
 * Nothing here existed before Gate 8: the two approved videos
 * (`capabilityExplainerVideos` in solution-directions.ts) were typed but never
 * rendered anywhere a prospect could reach, so no locale gap could show. Wiring
 * them into the technical drawer's "How it works" tab is what makes this
 * translation layer necessary for the first time.
 * ---------------------------------------------------------------- */

interface VideoCopy {
  actionLabel: string;
  intro: string;
  description: string;
}

interface FollowOnVideoCopy extends VideoCopy {
  distinctionNote: string;
}

const videoTranslations: Readonly<Record<Exclude<Locale, "en">, Readonly<Record<TechnologyCapabilityId, VideoCopy>>>> = {
  fr: {
    "TECH-02": {
      actionLabel: "un exemple d'implémentation",
      intro: "Un bref aperçu de ce que le capteur au-dessus de la porte voit réellement.",
      description:
        "Images d'un capteur en surplomb à une entrée : les personnes qui franchissent le seuil sont suivies comme des formes anonymes et comptées à l'entrée et à la sortie.",
    },
    "TECH-04": {
      actionLabel: "LiDAR dans un magasin",
      intro: "Un exemple réel de mesure spatiale par LiDAR à l'intérieur d'un magasin.",
      description:
        "Images enregistrées dans un magasin, montrant l'espace et les personnes qui s'y déplacent tels que le LiDAR spatial les mesure.",
    },
  } as Readonly<Record<TechnologyCapabilityId, VideoCopy>>,
  de: {
    "TECH-02": {
      actionLabel: "eine Beispielimplementierung",
      intro: "Ein kurzer Blick darauf, was der Sensor über der Tür tatsächlich sieht.",
      description:
        "Aufnahme eines Überkopfsensors an einem Eingang: Personen, die die Türschwelle überqueren, werden als anonyme Formen verfolgt und ein- und ausgezählt.",
    },
    "TECH-04": {
      actionLabel: "LiDAR in einem Geschäft",
      intro: "Ein reales Beispiel für räumliche LiDAR-Messung in einem Geschäft.",
      description:
        "Aufnahme aus einem Geschäft, die den Raum und die sich darin bewegenden Personen zeigt, so wie räumliches LiDAR sie misst.",
    },
  } as Readonly<Record<TechnologyCapabilityId, VideoCopy>>,
};

const followOnVideoTranslations: Readonly<Record<Exclude<Locale, "en">, FollowOnVideoCopy>> = {
  fr: {
    actionLabel: "la vue de suivi",
    intro: "Le même type de mouvement, une étape plus loin : représenté sous forme de parcours et résumé pour un rapport.",
    description:
      "Une vue de suivi et de reporting dans laquelle le mouvement mesuré à travers un espace est dessiné sous forme de parcours et résumé.",
    distinctionNote:
      "Ceci n'est pas la mesure elle-même. C'est une façon de représenter et d'interpréter a posteriori un mouvement mesuré — ce qui est réellement construit pour un magasin est conçu au cas par cas.",
  },
  de: {
    actionLabel: "die Tracking-Ansicht",
    intro: "Dieselbe Art von Bewegung, einen Schritt später: als Routen dargestellt und für die Berichterstattung zusammengefasst.",
    description:
      "Eine Tracking- und Reporting-Ansicht, in der gemessene Bewegung durch einen Raum als Routen gezeichnet und zusammengefasst wird.",
    distinctionNote:
      "Dies ist nicht die Messung selbst. Es ist eine Möglichkeit, gemessene Bewegung im Nachhinein darzustellen und zu interpretieren — was für ein Geschäft tatsächlich gebaut wird, wird je Standort entworfen.",
  },
};

const videoViewLabelTranslations: Readonly<Record<Exclude<Locale, "en">, Readonly<Record<ExplainerVideoViewKind, string>>>> = {
  fr: {
    measured_environment: "Environnement physique mesuré",
    derived_representation: "Représentation dérivée",
  },
  de: {
    measured_environment: "Gemessene physische Umgebung",
    derived_representation: "Abgeleitete Darstellung",
  },
};

export function resolveVideoCopy(
  locale: Locale,
  capabilityId: TechnologyCapabilityId,
  fallback: VideoCopy,
): VideoCopy {
  if (locale === "en") return fallback;
  return videoTranslations[locale][capabilityId] ?? fallback;
}

export function resolveFollowOnVideoCopy(locale: Locale, fallback: FollowOnVideoCopy): FollowOnVideoCopy {
  if (locale === "en") return fallback;
  return followOnVideoTranslations[locale];
}

export function resolveVideoViewLabel(locale: Locale, kind: ExplainerVideoViewKind, fallback: string): string {
  if (locale === "en") return fallback;
  return videoViewLabelTranslations[locale][kind] ?? fallback;
}

/**
 * The video trigger button's full label: watch-word plus action label.
 *
 * English and French both read naturally as VERB + OBJECT ("See an example
 * implementation", "Voir un exemple d'implémentation"), so `messages.ts`'s
 * flat `watchAction` string can simply be prefixed. German cannot: its
 * translated action labels ("die Tracking-Ansicht", "eine
 * Beispielimplementierung") are noun phrases that take the verb at the END
 * ("die Tracking-Ansicht ansehen"), not the start — prefixing "Ansehen"
 * the same way produces ungrammatical German ("Ansehen die
 * Tracking-Ansicht"). This composes the two pieces in the order each
 * language actually needs.
 */
export function resolveWatchLabel(locale: Locale, watchWord: string, actionLabel: string): string {
  if (locale === "de") return `${actionLabel} ${watchWord.toLowerCase()}`;
  return `${watchWord} ${actionLabel}`;
}

/* ---------------------------------------------------------------- *
   PRIVACY — by principle title, which is the statement's own key
 * ---------------------------------------------------------------- */

interface PrivacyCopy {
  headline: string;
  lead: string;
  principles: readonly { title: string; body: string }[];
}

const privacyTranslations: Readonly<Record<Exclude<Locale, "en">, PrivacyCopy>> = {
  fr: {
    headline: "Nous mesurons des comportements, pas des identités.",
    lead: "Les solutions PFM sont conçues autour d'une mesure anonyme et du minimum de données nécessaires à l'analyse que vous avez réellement retenue.",
    principles: [
      {
        title: "Mesure anonyme",
        body: "Le mouvement, les visites et les zones sont comptés comme des événements anonymes. Rien dans cette expérience ne présente ni ne dépend d'une identité.",
      },
      {
        title: "Données minimales requises",
        body: "La conception de la mesure suit la question. Une analyse plus approfondie n'est configurée que là où elle a été demandée.",
      },
      {
        title: "Sorties configurées",
        body: "La classification et les sorties supplémentaires n'existent que là où elles sont explicitement activées, configurées et autorisées.",
      },
      {
        title: "Garanties propres à l'implémentation",
        body: "Les preuves de confidentialité appartiennent à une implémentation précise. Elles sont énoncées par implémentation et ne sont jamais généralisées entre fournisseurs.",
      },
    ],
  },
  de: {
    headline: "Wir messen Verhalten, nicht Identität.",
    lead: "PFM-Lösungen sind auf anonyme Messung und auf das Minimum an Daten ausgelegt, das die von Ihnen tatsächlich gewählte Auswertung erfordert.",
    principles: [
      {
        title: "Anonyme Messung",
        body: "Bewegung, Besuche und Zonen werden als anonyme Ereignisse gezählt. Nichts in dieser Erfahrung zeigt eine Identität oder hängt von ihr ab.",
      },
      {
        title: "Minimal erforderliche Daten",
        body: "Das Messdesign folgt der Frage. Eine tiefere Auswertung wird nur dort konfiguriert, wo sie angefragt wurde.",
      },
      {
        title: "Konfigurierte Ausgaben",
        body: "Klassifizierung und zusätzliche Ausgaben existieren nur dort, wo sie ausdrücklich aktiviert, konfiguriert und zulässig sind.",
      },
      {
        title: "Implementierungsspezifische Schutzmaßnahmen",
        body: "Datenschutznachweise gehören zu einer bestimmten Implementierung. Sie werden je Implementierung genannt und niemals über Anbieter hinweg verallgemeinert.",
      },
    ],
  },
};

export function resolvePrivacyCopy(locale: Locale): PrivacyCopy {
  if (locale === "en") {
    return {
      headline: configurePrivacyStatement.headline,
      lead: configurePrivacyStatement.lead,
      principles: configurePrivacyStatement.principles.map((principle) => ({
        title: principle.title,
        body: principle.body,
      })),
    };
  }
  return privacyTranslations[locale];
}

/* ---------------------------------------------------------------- *
   EVIDENCE INPUT LABELS — by evidence input id
 * ---------------------------------------------------------------- */

const inputTranslations: Readonly<
  Record<Exclude<Locale, "en">, Readonly<Record<string, string>>>
> = {
  fr: {
    spatial_trajectories: "Trajectoires et transitions spatiales anonymes",
    spatial_definitions: "Plan et définitions spatiales",
    zone_events: "Événements de présence, d'entrée et de temps par zone",
    zone_mapping: "Cartographie des zones, locomotives ou périmètres",
  },
  de: {
    spatial_trajectories: "Anonyme räumliche Trajektorien und Übergänge",
    spatial_definitions: "Grundriss und Raumdefinitionen",
    zone_events: "Zonen-Präsenz-, Eintritts- und Zeitereignisse",
    zone_mapping: "Zonen-, Ankermieter- oder Grenzzuordnung",
  },
};

export function resolveInputLabel(locale: Locale, inputId: string, fallback: string): string {
  if (locale === "en") return fallback;
  return inputTranslations[locale][inputId] ?? fallback;
}

/**
 * Every canonical id the pilot renders that a translation does not cover.
 *
 * Run from the test suite. A miss here means either a translation was never
 * written, or an id changed underneath one — both of which must fail a build
 * rather than reach a prospect as a stray English sentence.
 */
export function validateDomainMessages(
  segmentId: SegmentId,
  capabilityIds: readonly TechnologyCapabilityId[],
  approachIds: readonly string[],
  inputIds: readonly string[],
): readonly string[] {
  const missing: string[] = [];

  for (const locale of locales) {
    if (locale === "en") continue;

    for (const capabilityId of capabilityIds) {
      if (!resolveCapabilityCopy(locale, segmentId, capabilityId)) {
        missing.push(`${locale}.capability.${capabilityId}`);
      }
    }
    for (const approachId of approachIds) {
      if (!explainerTranslations[locale][approachId]) {
        missing.push(`${locale}.explainer.${approachId}`);
      }
    }
    for (const inputId of inputIds) {
      if (!inputTranslations[locale][inputId]) {
        missing.push(`${locale}.input.${inputId}`);
      }
    }
    const privacy = privacyTranslations[locale];
    if (privacy.principles.length !== configurePrivacyStatement.principles.length) {
      missing.push(`${locale}.privacy.principles`);
    }
  }
  return missing;
}
