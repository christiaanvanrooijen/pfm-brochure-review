/**
 * Outlet Centre Core — the ten scenes of the typed Core route.
 *
 * English is read from the model; see `journey-copy.ts`. Authored here: the
 * boundary, the caption, the alt text and the translations.
 *
 * Four scenes are carried by a typed diagram rather than a photograph, and two
 * more fall back to one because their only candidate carries a signage
 * restriction that cannot be waived. Their alt text describes the DIAGRAM,
 * because that is what is on screen.
 */

import { L, type AuthoredScene } from "./journey-copy.ts";

const RAIL = {
  m: L("Measured", "Mesuré", "Gemessen"),
  c: L("Connected", "Connecté", "Verbunden"),
  d: L("Derived", "Déduit", "Abgeleitet"),
};

export const outletJourneyCopy: Readonly<Record<string, AuthoredScene>> = {
  "outlet-centre-destination-catchment": {
    focus: [
      { id: "measured", cluster: 0, label: L("The destination", "La destination", "Die Destination"),
        fr: "Les visites sur site peuvent ancrer la demande de destination, mais les capteurs d'entrée ne mesurent pas l'origine.",
        de: "Besuche vor Ort können die Nachfrage der Destination verankern, aber Eingangssensoren messen keine Herkunft." },
      { id: "connected", cluster: 1, label: L("The reach around it", "La portée alentour", "Die Reichweite ringsum"),
        fr: "Des sources approuvées de mobilité agrégée, de géolocalisation et de contexte de destination décrivent la portée autour de l'outlet.",
        de: "Freigegebene aggregierte Mobilitäts-, Geo- und Destinationskontextquellen beschreiben die Reichweite rund um das Outlet." },
      { id: "derived", cluster: 2, label: L("What may be derived", "Ce qui peut être déduit", "Was abgeleitet werden darf"),
        fr: "La chalandise primaire, secondaire et étendue, la portée en temps de trajet et le mix d'origines exigent la source agrégée approuvée.",
        de: "Primäres, sekundäres und erweitertes Einzugsgebiet, Fahrzeit-Reichweite und Herkunftsmix erfordern die freigegebene aggregierte Quelle." },
    ],
    eyebrow: L("Context · Destination", "Contexte · Destination", "Kontext · Destination"),
    truth: L("This is aggregate area context from an approved external source, not a measurement of the people at the destination. Entrance sensors measure visits; they do not measure origin.", "Il s'agit d'un contexte de zone agrégé issu d'une source externe approuvée, pas d'une mesure des personnes à la destination. Les capteurs d'entrée mesurent des visites, pas l'origine.", "Dies ist aggregierter Gebietskontext aus einer freigegebenen externen Quelle, keine Messung der Menschen an der Destination. Eingangssensoren messen Besuche, nicht Herkunft."),
    coverageNote: L("Aggregate area context, from an approved source. Never a substitute for what is measured on site.", "Contexte de zone agrégé, issu d'une source approuvée. Jamais un substitut à ce qui est mesuré sur site.", "Aggregierter Gebietskontext aus freigegebener Quelle. Niemals ein Ersatz für das, was vor Ort gemessen wird."),
    heroCaption: L("Reach is context around the outlet, not a count of who came in.", "La portée est un contexte autour de l'outlet, pas un comptage des entrées.", "Reichweite ist Kontext rund um das Outlet, keine Zählung der Eintritte."),
    heroAlt: L("A diagram: the measured destination as a closed shape, and the area it draws context from as open, unbounded lines.", "Un schéma : la destination mesurée comme forme fermée, et la zone d'où vient le contexte comme lignes ouvertes.", "Eine Skizze: die gemessene Destination als geschlossene Form, und das Gebiet, aus dem der Kontext stammt, als offene Linien."),
    rail: [
      { kicker: RAIL.m, label: L("On-site visit baseline", "Base de visites sur site", "Basis der Besuche vor Ort") },
      { kicker: RAIL.c, label: L("Approved aggregate mobility or destination context", "Mobilité agrégée approuvée ou contexte de destination", "Freigegebene aggregierte Mobilität oder Destinationskontext") },
      { kicker: RAIL.d, label: L("Catchment and travel-time reach", "Chalandise et portée en temps de trajet", "Einzugsgebiet und Fahrzeit-Reichweite") },
    ],
    fr: { question: "Jusqu'où les visiteurs sont-ils prêts à voyager vers la destination outlet ?", supporting: "Soutenir le marketing de destination, le positionnement et l'extension de la portée", nextCta: "Comprendre le contexte d'origine" },
    de: { question: "Wie weit sind Besucher bereit, zur Outlet-Destination zu reisen?", supporting: "Destinationsmarketing, Positionierung und Ausweitung der Reichweite unterstützen", nextCta: "Herkunftskontext verstehen" },
  },

  "outlet-centre-tourism-origin-context": {
    focus: [
      { id: "measured", cluster: 0, label: L("What is measured", "Ce qui est mesuré", "Was gemessen wird"),
        fr: "Les arrivées mesurées de véhicules ou de visiteurs peuvent ancrer la demande de destination mais n'en déduisent pas l'origine.",
        de: "Gemessene Fahrzeug- oder Besucherankünfte können die Nachfrage verankern, leiten daraus aber keine Herkunft ab." },
      { id: "connected", cluster: 1, label: L("What supplies origin", "Ce qui fournit l'origine", "Was Herkunft liefert"),
        fr: "Un contexte approuvé de tourisme, d'hôtellerie, de mobilité ou d'origine fournit le cadrage de destination.",
        de: "Freigegebener Tourismus-, Hotel-, Mobilitäts- oder Herkunftskontext liefert den Destinationsrahmen." },
      { id: "derived", cluster: 2, label: L("The signatures", "Les signatures", "Die Signaturen"),
        fr: "Les signatures locale, régionale, touristique et de destination se limitent à la source d'origine approuvée.",
        de: "Lokale, regionale, Tourismus- und Destinationssignaturen sind auf die freigegebene Herkunftsquelle beschränkt." },
    ],
    eyebrow: L("Context · Origin", "Contexte · Origine", "Kontext · Herkunft"),
    truth: L("Origin never comes from a sensor. It comes from an approved external source, and the relationship runs one way: context is added to a measurement, never produced by it.", "L'origine ne vient jamais d'un capteur. Elle vient d'une source externe approuvée, et la relation va dans un seul sens : le contexte s'ajoute à une mesure, il n'en est jamais produit.", "Herkunft kommt nie aus einem Sensor. Sie kommt aus einer freigegebenen externen Quelle, und die Beziehung läuft in eine Richtung: Kontext wird einer Messung hinzugefügt, nie von ihr erzeugt."),
    coverageNote: L("Local, regional and destination-led shares exist only within the approved origin source.", "Les parts locale, régionale et de destination n'existent que dans la source d'origine approuvée.", "Lokale, regionale und destinationsgetriebene Anteile existieren nur innerhalb der freigegebenen Herkunftsquelle."),
    heroCaption: L("A measurement on site and a source of origin are two different things, joined in one direction.", "Une mesure sur site et une source d'origine sont deux choses différentes, jointes dans un seul sens.", "Eine Messung vor Ort und eine Herkunftsquelle sind zwei verschiedene Dinge, in einer Richtung verbunden."),
    heroAlt: L("A diagram: a measured box, an approved-source box, and a single arrow running from the source to the measurement.", "Un schéma : une boîte mesurée, une boîte source approuvée, et une seule flèche de la source vers la mesure.", "Eine Skizze: ein gemessener Kasten, ein Kasten der freigegebenen Quelle, und ein einzelner Pfeil von der Quelle zur Messung."),
    rail: [
      { kicker: RAIL.m, label: L("Measured arrivals on site", "Arrivées mesurées sur site", "Gemessene Ankünfte vor Ort") },
      { kicker: RAIL.c, label: L("Approved tourism, hotel or mobility context", "Contexte approuvé tourisme, hôtellerie ou mobilité", "Freigegebener Tourismus-, Hotel- oder Mobilitätskontext") },
      { kicker: RAIL.d, label: L("Local, regional and destination signatures", "Signatures locale, régionale et de destination", "Lokale, regionale und Destinationssignaturen") },
    ],
    fr: { question: "Quelle part de l'audience est locale, régionale ou attirée par la destination ?", supporting: "Adapter les campagnes, la pression opérationnelle et la stratégie de destination", nextCta: "Mesurer l'arrivée à la destination" },
    de: { question: "Welcher Teil des Publikums ist lokal, regional oder destinationsgetrieben?", supporting: "Kampagnen, Betriebsdruck und Destinationsstrategie anpassen", nextCta: "Ankunft an der Destination messen" },
  },

  "outlet-centre-vehicle-coach-arrival": {
    focus: [
      { id: "measured", cluster: 0, label: L("What is measured", "Ce qui est mesuré", "Was gemessen wird"),
        fr: "Les entrées/sorties de véhicules sont mesurées ; les arrivées d'autocars ne sont incluses que là où elles sont explicitement mesurées.",
        de: "Fahrzeugein-/-ausfahrten werden gemessen; Busankünfte nur dort, wo sie ausdrücklich gemessen werden." },
      { id: "connected", cluster: 1, label: L("What explains it", "Ce qui l'explique", "Was es erklärt"),
        fr: "L'agencement du stationnement et des accès, le tourisme et le contexte d'événements expliquent le schéma d'arrivée.",
        de: "Park- und Zufahrtslayout, Tourismus und Veranstaltungskontext erklären das Ankunftsmuster." },
      { id: "derived", cluster: 2, label: L("Rhythm and share", "Rythme et répartition", "Rhythmus und Anteil"),
        fr: "Le rythme d'arrivée, la part par point d'accès et le schéma autocar/voiture ne sont montrés qu'au niveau que les définitions permettent.",
        de: "Ankunftsrhythmus, Anteil je Zufahrt und Bus-gegen-Pkw-Muster werden nur so weit gezeigt, wie die Definitionen es tragen." },
    ],
    eyebrow: L("Measure · Arrival", "Mesurer · Arrivée", "Messen · Ankunft"),
    truth: L("A coach is only distinguishable where the setup explicitly measures it. Where it does not, coaches are inside the vehicle count and cannot be separated out afterwards.", "Un autocar n'est distinguable que si l'installation le mesure explicitement. Sinon, les autocars sont inclus dans le comptage de véhicules et ne peuvent en être extraits après coup.", "Ein Bus ist nur unterscheidbar, wo der Aufbau ihn ausdrücklich misst. Andernfalls stecken Busse in der Fahrzeugzählung und lassen sich nachträglich nicht herauslösen."),
    coverageNote: L("Measured per configured access point. A coach is not a visitor count, and a vehicle is not a person.", "Mesuré par point d'accès configuré. Un autocar n'est pas un comptage de visiteurs, et un véhicule n'est pas une personne.", "Je konfigurierter Zufahrt gemessen. Ein Bus ist keine Besucherzahl, und ein Fahrzeug ist keine Person."),
    heroCaption: L("Access points are places. What arrives through them is counted, not classified.", "Les points d'accès sont des lieux. Ce qui les franchit est compté, pas classé.", "Zufahrten sind Orte. Was durch sie kommt, wird gezählt, nicht klassifiziert."),
    heroAlt: L("A diagram: a boundary line with three marked access points on it.", "Un schéma : une ligne de limite avec trois points d'accès marqués.", "Eine Skizze: eine Grenzlinie mit drei markierten Zufahrten."),
    rail: [
      { kicker: RAIL.m, label: L("Vehicle entries and exits by access point", "Entrées et sorties par point d'accès", "Fahrzeugein- und -ausfahrten je Zufahrt") },
      { kicker: RAIL.c, label: L("Parking layout, tourism and event context", "Agencement, tourisme et contexte d'événements", "Parklayout, Tourismus und Veranstaltungskontext") },
      { kicker: RAIL.d, label: L("Arrival rhythm and access-point share", "Rythme d'arrivée et part par point d'accès", "Ankunftsrhythmus und Anteil je Zufahrt") },
    ],
    fr: { question: "Quand les voitures et les autocars arrivent-ils, et par quels accès ?", supporting: "Préparer le stationnement, les effectifs et l'exploitation pour les pics de destination", nextCta: "Mesurer les entrées du centre" },
    de: { question: "Wann kommen Autos und Busse an, und über welche Zufahrten?", supporting: "Parken, Personal und Betrieb auf Destinationsspitzen vorbereiten", nextCta: "Eintritte messen" },
  },

  "outlet-centre-entrances": {
    focus: [
      { id: "measured", cluster: 0, label: L("The entrance line", "La ligne d'entrée", "Die Eingangslinie"),
        fr: "Les entrées et sorties sont mesurées par entrée de l'outlet et par période.",
        de: "Ein- und Austritte werden je Outlet-Eingang und Zeit gemessen." },
      { id: "connected", cluster: 1, label: L("What explains arrivals", "Ce qui explique les arrivées", "Was Ankünfte erklärt"),
        fr: "Les horaires, le tourisme, les événements et la météo peuvent expliquer les schémas d'arrivée.",
        de: "Öffnungszeiten, Tourismus, Veranstaltungen und Wetter können Ankunftsmuster erklären." },
      { id: "derived", cluster: 2, label: L("Share and peaks", "Part et pics", "Anteil und Spitzen"),
        fr: "La part par entrée, les périodes de pointe et les signatures de demande exigent la série temporelle physique.",
        de: "Anteil je Eingang, Spitzenzeiten und Nachfragesignaturen erfordern die physische Zeitreihe." },
    ],
    eyebrow: L("Measure · Entrances", "Mesurer · Entrées", "Messen · Eintritte"),
    truth: L("Entries and exits are two separate signals across one configured line. A visit is not a unique visitor, and an uncounted entrance is not a quiet one.", "Les entrées et les sorties sont deux signaux distincts sur une ligne configurée. Une visite n'est pas un visiteur unique, et une entrée non comptée n'est pas une entrée calme.", "Ein- und Austritte sind zwei getrennte Signale über eine konfigurierte Linie. Ein Besuch ist kein eindeutiger Besucher, und ein ungezählter Eingang ist kein ruhiger."),
    coverageNote: L("Counted only where an entrance line is configured. An open-air destination has several, and each has to be configured to exist.", "Comptées uniquement là où une ligne d'entrée est configurée. Une destination en plein air en a plusieurs, et chacune doit être configurée pour exister.", "Nur dort gezählt, wo eine Eingangslinie konfiguriert ist. Eine Freiluft-Destination hat mehrere, und jede muss konfiguriert sein, um zu existieren."),
    heroCaption: L("An entrance is a line somebody configured, crossed in two directions.", "Une entrée est une ligne configurée, franchie dans deux sens.", "Ein Eingang ist eine konfigurierte Linie, in zwei Richtungen überquert."),
    heroAlt: L("A diagram: a configured entrance line with movement crossing it inward and outward.", "Un schéma : une ligne d'entrée configurée, franchie vers l'intérieur et vers l'extérieur.", "Eine Skizze: eine konfigurierte Eingangslinie, nach innen und außen überquert."),
    rail: [
      { kicker: RAIL.m, label: L("Entries and exits per configured entrance", "Entrées et sorties par entrée configurée", "Ein- und Austritte je konfiguriertem Eingang") },
      { kicker: RAIL.c, label: L("Hours, tourism, events and weather", "Horaires, tourisme, événements et météo", "Öffnungszeiten, Tourismus, Veranstaltungen und Wetter") },
      { kicker: RAIL.d, label: L("Entrance share and peak arrival periods", "Part par entrée et périodes de pointe", "Anteil je Eingang und Spitzenzeiten") },
    ],
    fr: { question: "Combien de visiteurs entrent dans les rues de l'outlet, et quand ?", supporting: "Planifier l'exploitation, les effectifs, la sécurité et les horaires", nextCta: "Comprendre le mix de visiteurs" },
    de: { question: "Wie viele Besucher betreten die Outlet-Straßen, und wann?", supporting: "Betrieb, Personal, Sicherheit und Öffnungszeiten planen", nextCta: "Besuchermix verstehen" },
  },

  "outlet-centre-visitor-composition": {
    focus: [
      { id: "measured", cluster: 0, label: L("Compatible events", "Événements compatibles", "Kompatible Ereignisse"),
        fr: "Les événements de visite à l'entrée doivent prendre en charge la classification anonyme sélectionnée.",
        de: "Eingangs-Besuchsereignisse müssen die gewählte anonyme Klassifikation unterstützen." },
      { id: "connected", cluster: 1, label: L("What segments the mix", "Ce qui segmente le mix", "Was den Mix segmentiert"),
        fr: "Le contexte touristique, événementiel et de période peut segmenter le mix anonyme.",
        de: "Tourismus-, Veranstaltungs- und Tagesabschnittskontext kann den anonymen Mix segmentieren." },
      { id: "derived", cluster: 2, label: L("What is estimated", "Ce qui est estimé", "Was geschätzt wird"),
        fr: "La taille de groupe, l'unité d'achat et les classifications anonymes autorisées sont estimées à partir d'événements configurés.",
        de: "Gruppengröße, Kaufeinheit und zulässige anonyme Klassifikationen werden aus konfigurierten Ereignissen geschätzt." },
    ],
    eyebrow: L("Measure · Mix", "Mesurer · Mix", "Messen · Mix"),
    truth: L("Classification is estimated, optional and permission-bound. It describes an anonymous mix and identifies nobody in it.", "La classification est estimée, optionnelle et soumise à autorisation. Elle décrit un mix anonyme et n'identifie personne.", "Klassifikation ist geschätzt, optional und genehmigungsgebunden. Sie beschreibt einen anonymen Mix und identifiziert niemanden darin."),
    coverageNote: L("Anonymous grouping only, within the configured scope. No face, no identity, no individual record.", "Regroupement anonyme uniquement, dans le périmètre configuré. Aucun visage, aucune identité, aucun enregistrement individuel.", "Nur anonyme Gruppierung im konfigurierten Bereich. Kein Gesicht, keine Identität, kein Einzeldatensatz."),
    heroCaption: L("A group is people who arrived together, not people who are alike.", "Un groupe, ce sont des personnes arrivées ensemble, pas des personnes semblables.", "Eine Gruppe sind Menschen, die gemeinsam ankamen — nicht Menschen, die einander ähneln."),
    heroAlt: L("An open-air outlet plaza at dusk, with soft purple rings on the paving around groups walking together.", "Une place d'outlet en plein air au crépuscule, avec de doux anneaux violets autour des groupes marchant ensemble.", "Ein Outlet-Platz im Freien in der Dämmerung, mit weichen violetten Ringen um gemeinsam gehende Gruppen."),
    rail: [
      { kicker: RAIL.m, label: L("Classification-compatible entrance events", "Événements d'entrée compatibles", "Klassifikationsfähige Eingangsereignisse") },
      { kicker: RAIL.c, label: L("Tourism, event and daypart context", "Contexte tourisme, événements et période", "Tourismus-, Veranstaltungs- und Tagesabschnittskontext") },
      { kicker: RAIL.d, label: L("Group size and permitted anonymous output", "Taille de groupe et sortie anonyme autorisée", "Gruppengröße und zulässige anonyme Ausgabe") },
    ],
    fr: { question: "Quel mix anonyme de visiteurs entre dans le centre outlet ?", supporting: "Comprendre le mix par période, entrée et contexte de destination", nextCta: "Suivre la circulation" },
    de: { question: "Welcher anonyme Besuchermix betritt das Outlet-Center?", supporting: "Besuchermix nach Zeitraum, Eingang und Destinationskontext verstehen", nextCta: "Der Zirkulation folgen" },
  },

  "outlet-centre-circulation": {
    focus: [
      { id: "measured", cluster: 0, label: L("The movement signal", "Le signal de mouvement", "Das Bewegungssignal"),
        fr: "Les trajectoires anonymes, les entrées/sorties de zone et les transitions fournissent le signal de mouvement.",
        de: "Anonyme Trajektorien, Zonenein-/-austritte und Übergänge liefern das Bewegungssignal." },
      { id: "connected", cluster: 1, label: L("What gives it meaning", "Ce qui lui donne du sens", "Was ihm Bedeutung gibt"),
        fr: "Les définitions de rues, zones, ancres et espaces d'enseigne donnent le sens spatial.",
        de: "Straßen-, Zonen-, Anker- und Markenflächendefinitionen liefern die räumliche Bedeutung." },
      { id: "derived", cluster: 2, label: L("Routes and bottlenecks", "Parcours et goulots", "Wege und Engpässe"),
        fr: "Les schémas de circulation, la structure des parcours, la profondeur et les goulots exigent mouvement et définitions alignés.",
        de: "Zirkulationsmuster, Wegestruktur, Bewegungstiefe und Engpässe erfordern abgestimmte Bewegung und Definitionen." },
    ],
    eyebrow: L("Understand · Circulation", "Comprendre · Circulation", "Verstehen · Zirkulation"),
    truth: L("Movement is reconstructed within configured coverage, from anonymous shapes. The trails drawn here are continuous; real coverage is not.", "Le mouvement est reconstitué dans la couverture configurée, à partir de formes anonymes. Les traînées dessinées ici sont continues ; la couverture réelle ne l'est pas.", "Bewegung wird innerhalb der konfigurierten Abdeckung aus anonymen Formen rekonstruiert. Die hier gezeichneten Spuren sind durchgehend; die reale Abdeckung ist es nicht."),
    coverageNote: L("Movement exists only between covered areas. A gap in coverage is a gap in the route, not an empty street.", "Le mouvement n'existe qu'entre zones couvertes. Un trou de couverture est un trou dans le parcours, pas une rue vide.", "Bewegung existiert nur zwischen abgedeckten Bereichen. Eine Abdeckungslücke ist eine Lücke im Weg, keine leere Straße."),
    heroCaption: L("A route is only as complete as the coverage under it.", "Un parcours n'est complet que dans la mesure de la couverture qui le porte.", "Ein Weg ist nur so vollständig wie die Abdeckung darunter."),
    heroAlt: L("An outlet street at golden hour with bright purple trajectory lines sweeping along the paving between the units.", "Une rue d'outlet à l'heure dorée, avec de vives lignes de trajectoire violettes le long du pavage entre les unités.", "Eine Outlet-Straße im goldenen Licht mit hellen violetten Trajektorienlinien entlang des Pflasters zwischen den Einheiten."),
    rail: [
      { kicker: RAIL.m, label: L("Anonymous trajectories and zone transitions", "Trajectoires anonymes et transitions de zones", "Anonyme Trajektorien und Zonenübergänge") },
      { kicker: RAIL.c, label: L("Street, zone, anchor and brand-area definitions", "Définitions de rues, zones, ancres et espaces d'enseigne", "Straßen-, Zonen-, Anker- und Markenflächendefinitionen") },
      { kicker: RAIL.d, label: L("Circulation patterns and bottlenecks", "Schémas de circulation et goulots", "Zirkulationsmuster und Engpässe") },
    ],
    fr: { question: "Comment les visiteurs circulent-ils entre rues, zones et ancres de l'outlet ?", supporting: "Améliorer l'orientation, l'agencement, les événements et la planification de circulation", nextCta: "Explorer l'exposition des zones" },
    de: { question: "Wie bewegen sich Besucher über Outlet-Straßen, Zonen und Anker?", supporting: "Wegeführung, Layout, Veranstaltungen und Zirkulationsplanung verbessern", nextCta: "Zonenexposition erkunden" },
  },

  "outlet-centre-zone-exposure-dwell": {
    focus: [
      { id: "measured", cluster: 0, label: L("Presence in a zone", "Présence dans une zone", "Präsenz in einer Zone"),
        fr: "La présence en zone, les entrées et le temps fournissent le signal physique d'exposition.",
        de: "Zonenpräsenz, Eintritte und Zeit liefern das physische Expositionssignal." },
      { id: "connected", cluster: 1, label: L("One configured zone", "Une zone configurée", "Eine konfigurierte Zone"),
        fr: "La cartographie des espaces d'enseigne, ancres, événements et rues définit les zones de comparaison.",
        de: "Marken-, Anker-, Veranstaltungs- und Straßenzuordnung definiert die Vergleichsflächen." },
      { id: "derived", cluster: 2, label: L("Exposure and dwell", "Exposition et présence", "Exposition und Verweildauer"),
        fr: "L'exposition, la présence, la portée et les zones chaudes/froides exigent des événements de zone et des cartographies alignés.",
        de: "Exposition, Verweildauer, Reichweite und heiße/kalte Flächen erfordern abgestimmte Zonenereignisse und Zuordnungen." },
    ],
    eyebrow: L("Understand · Zones", "Comprendre · Zones", "Verstehen · Zonen"),
    truth: L("A zone is a configured shape, and exposure is presence inside it. Attention is not measured, and an undefined area is unmeasured rather than cold.", "Une zone est une forme configurée, et l'exposition est une présence à l'intérieur. L'attention n'est pas mesurée, et une zone non définie est non mesurée plutôt que froide.", "Eine Zone ist eine konfigurierte Fläche, und Exposition ist Präsenz darin. Aufmerksamkeit wird nicht gemessen, und eine undefinierte Fläche ist ungemessen, nicht kalt."),
    coverageNote: L("Zones are drawn over shopfronts in this illustration. In the model a zone may be larger or smaller than a unit.", "Les zones sont dessinées sur les vitrines dans cette illustration. Dans le modèle, une zone peut être plus grande ou plus petite qu'une unité.", "Die Zonen sind in dieser Illustration über Ladenfronten gezeichnet. Im Modell kann eine Zone größer oder kleiner als eine Einheit sein."),
    heroCaption: L("A zone is a decision about where to compare, made before anything is measured.", "Une zone est une décision sur où comparer, prise avant toute mesure.", "Eine Zone ist eine Entscheidung darüber, wo verglichen wird — getroffen, bevor etwas gemessen wird."),
    heroAlt: L("The same outlet street, with faint rectangular outlines standing over the shopfronts and purple trajectories running beneath them.", "La même rue d'outlet, avec de faibles contours rectangulaires sur les vitrines et des trajectoires violettes en dessous.", "Dieselbe Outlet-Straße, mit blassen rechteckigen Umrissen über den Ladenfronten und violetten Trajektorien darunter."),
    rail: [
      { kicker: RAIL.m, label: L("Zone presence, entries and time", "Présence en zone, entrées et temps", "Zonenpräsenz, Eintritte und Zeit") },
      { kicker: RAIL.c, label: L("Brand-area, anchor and street mapping", "Cartographie espaces d'enseigne, ancres et rues", "Marken-, Anker- und Straßenzuordnung") },
      { kicker: RAIL.d, label: L("Zone exposure, dwell and reach", "Exposition, présence et portée", "Exposition, Verweildauer und Reichweite") },
    ],
    fr: { question: "Quelles zones et espaces d'enseigne de l'outlet reçoivent de l'attention ?", supporting: "Soutenir les échanges avec les enseignes, les événements, le contexte de bail et l'aménagement", nextCta: "Voir les visites d'enseignes" },
    de: { question: "Welche Outlet-Zonen und Markenflächen erhalten Aufmerksamkeit?", supporting: "Mietergespräche, Veranstaltungen, Vermietungskontext und Flächenplanung unterstützen", nextCta: "Markenbesuche ansehen" },
  },

  "outlet-centre-brand-counting": {
    focus: [
      { id: "measured", cluster: 0, label: L("Covered boundaries", "Limites couvertes", "Abgedeckte Grenzen"),
        fr: "Les événements d'entrée en magasin ou en enseigne ne sont comptés qu'à l'intérieur des limites couvertes.",
        de: "Store- oder Markeneintrittsereignisse werden nur innerhalb abgedeckter Grenzen gezählt." },
      { id: "connected", cluster: 1, label: L("What identifies a brand area", "Ce qui identifie un espace d'enseigne", "Was eine Markenfläche identifiziert"),
        fr: "L'annuaire des enseignes et la cartographie des catégories identifient les espaces couverts.",
        de: "Mieterverzeichnis und Kategoriezuordnung identifizieren die abgedeckten Markenflächen." },
      { id: "derived", cluster: 2, label: L("Visits and share", "Visites et part", "Besuche und Anteil"),
        fr: "Les visites d'enseignes, la part de visites et les écarts temporels n'établissent ni chiffre d'affaires ni potentiel locatif.",
        de: "Markenbesuche, Besuchsanteil und zeitliche Unterschiede belegen weder Umsatz noch Mietpotenzial." },
    ],
    eyebrow: L("Measure · Brands", "Mesurer · Enseignes", "Messen · Marken"),
    truth: L("A brand visit is an entry across a covered boundary. It says nothing about turnover, basket or rent potential, and the model refuses those explicitly.", "Une visite d'enseigne est une entrée franchissant une limite couverte. Elle ne dit rien du chiffre d'affaires, du panier ni du potentiel locatif, et le modèle les refuse explicitement.", "Ein Markenbesuch ist ein Eintritt über eine abgedeckte Grenze. Er sagt nichts über Umsatz, Warenkorb oder Mietpotenzial — das Modell schließt das ausdrücklich aus."),
    coverageNote: L("Only covered brand areas produce visits. An uncovered brand has no figure, which is different from a low one.", "Seuls les espaces d'enseigne couverts produisent des visites. Une enseigne non couverte n'a aucun chiffre, ce qui diffère d'un chiffre faible.", "Nur abgedeckte Markenflächen erzeugen Besuche. Eine nicht abgedeckte Marke hat keinen Wert — das ist etwas anderes als ein niedriger."),
    heroCaption: L("A brand visit is an entry, and an entry is not a sale.", "Une visite d'enseigne est une entrée, et une entrée n'est pas une vente.", "Ein Markenbesuch ist ein Eintritt, und ein Eintritt ist kein Verkauf."),
    heroAlt: L("A diagram: a configured store boundary with entries crossing it inward and outward.", "Un schéma : une limite de magasin configurée, franchie vers l'intérieur et vers l'extérieur.", "Eine Skizze: eine konfigurierte Ladengrenze, nach innen und außen überquert."),
    rail: [
      { kicker: RAIL.m, label: L("Entry events inside covered boundaries", "Événements d'entrée dans les limites couvertes", "Eintrittsereignisse innerhalb abgedeckter Grenzen") },
      { kicker: RAIL.c, label: L("Tenant directory and category mapping", "Annuaire des enseignes et cartographie des catégories", "Mieterverzeichnis und Kategoriezuordnung") },
      { kicker: RAIL.d, label: L("Brand visits and visit share", "Visites d'enseignes et part de visites", "Markenbesuche und Besuchsanteil") },
    ],
    fr: { question: "Quelles enseignes sont visitées ?", supporting: "Comprendre la visitation des enseignes sans déduire chiffre d'affaires ni potentiel locatif", nextCta: "Suivre le flux entre enseignes" },
    de: { question: "Welche Marken werden besucht?", supporting: "Markenbesuche verstehen, ohne Umsatz oder Mietpotenzial abzuleiten", nextCta: "Markenfluss verfolgen" },
  },

  "outlet-centre-brand-flow": {
    focus: [
      { id: "measured", cluster: 0, label: L("Matched transitions", "Transitions appariées", "Zugeordnete Übergänge"),
        fr: "Les visites d'enseignes appariées anonymement ou les transitions ne sont utilisées que là où la couverture le permet.",
        de: "Anonym zugeordnete Markenbesuche oder Übergänge werden nur genutzt, wo die Abdeckung es trägt." },
      { id: "connected", cluster: 1, label: L("The brand map", "La carte des enseignes", "Die Markenkarte"),
        fr: "Les cartes d'enseignes et les définitions de catégories expliquent chaque transition.",
        de: "Marken- und Kategoriedefinitionen erklären jeden Übergang." },
      { id: "derived", cluster: 2, label: L("Sequences and adjacency", "Séquences et adjacence", "Sequenzen und Nachbarschaft"),
        fr: "La visitation croisée, les séquences fréquentes et les relations d'adjacence exigent appariement et cartographie pris en charge.",
        de: "Cross-Visitation, häufige Sequenzen und Nachbarschaftsbeziehungen erfordern unterstützte Zuordnung und Kartierung." },
    ],
    eyebrow: L("Understand · Brand flow", "Comprendre · Flux d'enseignes", "Verstehen · Markenfluss"),
    truth: L("A transition needs both brand areas covered and anonymous matching supported. Without both there is no sequence, only two separate visits.", "Une transition exige que les deux espaces soient couverts et l'appariement anonyme pris en charge. Sans les deux, il n'y a pas de séquence, seulement deux visites distinctes.", "Ein Übergang erfordert beide Markenflächen abgedeckt und unterstützte anonyme Zuordnung. Ohne beides gibt es keine Sequenz, nur zwei getrennte Besuche."),
    coverageNote: L("Matching is anonymous and bounded by coverage. It links visits, never people.", "L'appariement est anonyme et borné par la couverture. Il relie des visites, jamais des personnes.", "Die Zuordnung ist anonym und durch die Abdeckung begrenzt. Sie verknüpft Besuche, nie Personen."),
    heroCaption: L("Adjacency is a pattern between brand areas, not a claim about anyone's afternoon.", "L'adjacence est un motif entre espaces d'enseignes, pas une affirmation sur l'après-midi de quiconque.", "Nachbarschaft ist ein Muster zwischen Markenflächen, keine Aussage über jemandes Nachmittag."),
    heroAlt: L("An outlet plaza at dusk with purple portals at shopfronts and small rings under people crossing towards a glass anchor building.", "Une place d'outlet au crépuscule avec des portails violets aux vitrines et de petits anneaux sous les passants vers un bâtiment ancre vitré.", "Ein Outlet-Platz in der Dämmerung mit violetten Portalen an den Ladenfronten und kleinen Ringen unter Passanten Richtung eines gläsernen Ankergebäudes."),
    rail: [
      { kicker: RAIL.m, label: L("Anonymous matched brand transitions", "Transitions d'enseignes appariées anonymement", "Anonym zugeordnete Markenübergänge") },
      { kicker: RAIL.c, label: L("Tenant maps and category definitions", "Cartes d'enseignes et définitions de catégories", "Markenkarten und Kategoriedefinitionen") },
      { kicker: RAIL.d, label: L("Cross-visitation and adjacency relationships", "Visitation croisée et relations d'adjacence", "Cross-Visitation und Nachbarschaftsbeziehungen") },
    ],
    fr: { question: "Comment les visiteurs passent-ils d'une enseigne à l'autre ?", supporting: "Éclairer l'adjacence, l'orientation et les échanges avec les enseignes", nextCta: "Comprendre le temps passé à la destination" },
    de: { question: "Wie bewegen sich Besucher von einer Marke zur nächsten?", supporting: "Nachbarschaft, Wegeführung und Mietergespräche fundieren", nextCta: "Aufenthaltsdauer an der Destination verstehen" },
  },

  "outlet-centre-time-in-destination": {
    focus: [
      { id: "measured", cluster: 0, label: L("The duration signal", "Le signal de durée", "Das Dauersignal"),
        fr: "Les événements d'entrée/sortie appariés anonymement ou les parcours suivis en continu fournissent le signal de durée.",
        de: "Anonym zugeordnete Ein-/Austrittsereignisse oder durchgehend verfolgte Wege liefern das Dauersignal." },
      { id: "connected", cluster: 1, label: L("What segments it", "Ce qui la segmente", "Was sie segmentiert"),
        fr: "Le contexte touristique, événementiel et de zone peut segmenter le schéma de durée.",
        de: "Tourismus-, Veranstaltungs- und Zonenkontext kann das Dauermuster segmentieren." },
      { id: "derived", cluster: 2, label: L("The distribution", "La distribution", "Die Verteilung"),
        fr: "La distribution du temps passé n'est déduite que d'un appariement pris en charge et de définitions de parcours alignées.",
        de: "Die Verteilung der Aufenthaltsdauer wird nur aus unterstützter Zuordnung und abgestimmten Wegedefinitionen abgeleitet." },
    ],
    eyebrow: L("Prove · Duration", "Prouver · Durée", "Belegen · Dauer"),
    truth: L("A duration needs a supported match between an arrival and a departure. Without that match there are two events and no stay.", "Une durée exige un appariement pris en charge entre une arrivée et un départ. Sans cet appariement, il y a deux événements et pas de séjour.", "Eine Dauer erfordert eine unterstützte Zuordnung zwischen Ankunft und Abfahrt. Ohne diese Zuordnung gibt es zwei Ereignisse und keinen Aufenthalt."),
    coverageNote: L("Duration exists between supported, aligned definitions, and nowhere else.", "La durée existe entre des définitions alignées et prises en charge, et nulle part ailleurs.", "Dauer existiert zwischen unterstützten, abgestimmten Definitionen — und sonst nirgends."),
    heroCaption: L("A stay is a span between two definitions, not a verdict on the visit.", "Un séjour est une plage entre deux définitions, pas un verdict sur la visite.", "Ein Aufenthalt ist eine Spanne zwischen zwei Definitionen, kein Urteil über den Besuch."),
    heroAlt: L("A diagram: the measured destination as a closed shape, with the surrounding context it is read against drawn as open lines.", "Un schéma : la destination mesurée comme forme fermée, et le contexte environnant comme lignes ouvertes.", "Eine Skizze: die gemessene Destination als geschlossene Form, mit dem umgebenden Kontext als offene Linien."),
    rail: [
      { kicker: RAIL.m, label: L("Anonymous matched entrance/exit events", "Événements d'entrée/sortie appariés anonymement", "Anonym zugeordnete Ein-/Austrittsereignisse") },
      { kicker: RAIL.c, label: L("Tourism, event and zone context", "Contexte tourisme, événements et zones", "Tourismus-, Veranstaltungs- und Zonenkontext") },
      { kicker: RAIL.d, label: L("Time-in-destination distribution", "Distribution du temps passé", "Verteilung der Aufenthaltsdauer") },
    ],
    fr: { question: "Combien de temps les visiteurs restent-ils dans le centre outlet ?", supporting: "Comprendre la profondeur de la destination et la pression opérationnelle", nextCta: "Configurer la solution" },
    de: { question: "Wie lange bleiben Besucher im Outlet-Center?", supporting: "Destinationstiefe und Betriebsdruck verstehen", nextCta: "Lösung konfigurieren" },
  },

};
