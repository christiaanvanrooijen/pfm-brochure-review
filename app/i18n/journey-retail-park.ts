/**
 * Retail Park Core — the seven scenes of the typed Core route.
 *
 * English is read from the model; see `journey-copy.ts`. What is authored here
 * is the boundary, the caption, the alt text and the translations.
 *
 * The boundary this segment repeats is the vehicle one: a vehicle is not a
 * visitor, and a vehicle duration is not a people duration. It appears on three
 * scenes because three scenes can imply otherwise.
 */

import { L, type AuthoredScene } from "./journey-copy.ts";

const RAIL = {
  m: L("Measured", "Mesuré", "Gemessen"),
  c: L("Connected", "Connecté", "Verbunden"),
  d: L("Derived", "Déduit", "Abgeleitet"),
};

export const retailParkJourneyCopy: Readonly<Record<string, AuthoredScene>> = {
  "retail-park-catchment-area": {
    focus: [
      { id: "asset", cluster: 0, label: L("The asset", "L'actif", "Das Objekt"),
        fr: "Les visites de l'actif ou des unités peuvent ancrer la demande sur site, mais les capteurs des unités ne mesurent pas l'origine.",
        de: "Objekt- oder Einheitsbesuche können die Nachfrage vor Ort verankern, aber Sensoren an den Einheiten messen keine Herkunft." },
      { id: "reach", cluster: 1, label: L("The demand around it", "La demande alentour", "Die Nachfrage ringsum"),
        fr: "Des sources approuvées de mobilité agrégée, de géolocalisation et de contexte d'origine décrivent la demande autour du parc.",
        de: "Freigegebene aggregierte Mobilitäts-, Geo- und Herkunftskontextquellen beschreiben die Nachfrage rund um den Park." },
      { id: "derived", cluster: 2, label: L("What may be derived", "Ce qui peut être déduit", "Was abgeleitet werden darf"),
        fr: "Les bandes de chalandise, le mix d'origines, le profil visiteur et la portée en temps de trajet exigent la source agrégée approuvée.",
        de: "Einzugsbänder, Herkunftsmix, Besucherprofil und Fahrzeit-Reichweite erfordern die freigegebene aggregierte Quelle." },
    ],
    eyebrow: L("Context · Catchment", "Contexte · Chalandise", "Kontext · Einzugsgebiet"),
    truth: L(
      "This is aggregate area context from an approved external source, not a measurement of the people on your park. Unit sensors measure visits; they do not measure origin.",
      "Il s'agit d'un contexte de zone agrégé issu d'une source externe approuvée, pas d'une mesure des personnes présentes sur votre parc. Les capteurs des unités mesurent des visites, pas l'origine.",
      "Dies ist aggregierter Gebietskontext aus einer freigegebenen externen Quelle, keine Messung der Menschen auf Ihrem Park. Sensoren an den Einheiten messen Besuche, nicht Herkunft.",
    ),
    coverageNote: L(
      "Aggregate area context, from an approved source. Never a substitute for what is measured at the units.",
      "Contexte de zone agrégé, issu d'une source approuvée. Jamais un substitut à ce qui est mesuré aux unités.",
      "Aggregierter Gebietskontext aus freigegebener Quelle. Niemals ein Ersatz für das, was an den Einheiten gemessen wird.",
    ),
    heroCaption: L(
      "Reach is context around the park, not a count of who arrived.",
      "La portée est un contexte autour du parc, pas un comptage des arrivées.",
      "Reichweite ist Kontext rund um den Park, keine Zählung der Angekommenen.",
    ),
    heroAlt: L(
      "An aerial view of a retail park at dusk with lit roads and housing beyond, and soft purple arcs curving outward across the surrounding area.",
      "Vue aérienne d'un parc commercial au crépuscule, routes éclairées et habitations au-delà, et de douces arches violettes vers l'extérieur.",
      "Luftbild eines Fachmarktzentrums in der Dämmerung mit beleuchteten Straßen und Wohnbebauung und weichen violetten Bögen nach außen.",
    ),
    rail: [
      { kicker: RAIL.m, label: L("On-site unit visit baseline", "Base de visites des unités sur site", "Basis der Einheitsbesuche vor Ort") },
      { kicker: RAIL.c, label: L("Approved aggregate mobility or origin context", "Mobilité agrégée approuvée ou contexte d'origine", "Freigegebene aggregierte Mobilität oder Herkunftskontext") },
      { kicker: RAIL.d, label: L("Catchment bands, origin mix and drive-time reach", "Bandes de chalandise, mix d'origines et portée en temps de trajet", "Einzugsbänder, Herkunftsmix und Fahrzeit-Reichweite") },
    ],
    fr: { question: "D'où viennent les visiteurs du parc, et quelle demande entoure l'actif ?", supporting: "Éclairer le marketing, le mix locatif et le positionnement du parc", nextCta: "Mesurer l'arrivée des véhicules" },
    de: { question: "Woher kommen die Besucher des Parks, und welche Nachfrage liegt rund um das Objekt?", supporting: "Marketing, Mietermix und Positionierung des Parks fundieren", nextCta: "Fahrzeugankunft messen" },
  },

  "retail-park-vehicle-arrival": {
    focus: [
      { id: "measured", cluster: 0, label: L("The access points", "Les points d'accès", "Die Zufahrten"),
        fr: "Les entrées et sorties de véhicules sont mesurées par point d'accès et par période.",
        de: "Fahrzeugein- und -ausfahrten werden je Zufahrt und Zeit gemessen." },
      { id: "connected", cluster: 1, label: L("What explains demand", "Ce qui explique la demande", "Was die Nachfrage erklärt"),
        fr: "Les horaires, les événements, la voirie d'accès et la météo peuvent expliquer la demande de véhicules.",
        de: "Öffnungszeiten, Veranstaltungen, Zufahrtsstraßen und Wetter können die Fahrzeugnachfrage erklären." },
      { id: "derived", cluster: 2, label: L("Peaks and share", "Pics et répartition", "Spitzen und Anteil"),
        fr: "Les pics d'arrivée, la part par point d'accès et la signature de demande exigent la série temporelle physique.",
        de: "Ankunftsspitzen, Anteil je Zufahrt und Nachfragesignatur erfordern die physische Zeitreihe." },
    ],
    eyebrow: L("Measure · Arrival", "Mesurer · Arrivée", "Messen · Ankunft"),
    truth: L(
      "A vehicle is not a visitor. What is measured here is vehicles crossing an access point, and how many people were inside is not part of that signal.",
      "Un véhicule n'est pas un visiteur. Ce qui est mesuré ici, ce sont des véhicules franchissant un point d'accès ; le nombre de personnes à bord ne fait pas partie de ce signal.",
      "Ein Fahrzeug ist kein Besucher. Gemessen werden hier Fahrzeuge, die eine Zufahrt passieren; wie viele Menschen darin saßen, gehört nicht zu diesem Signal.",
    ),
    coverageNote: L(
      "Counted per configured access point only. An unconfigured entrance is not a quiet entrance; it is an unmeasured one.",
      "Comptés uniquement par point d'accès configuré. Une entrée non configurée n'est pas une entrée calme : elle est non mesurée.",
      "Nur je konfigurierter Zufahrt gezählt. Eine nicht konfigurierte Einfahrt ist keine ruhige, sondern eine ungemessene.",
    ),
    heroCaption: L(
      "Arrival is a vehicle crossing a line, at a time.",
      "L'arrivée, c'est un véhicule franchissant une ligne, à un moment donné.",
      "Ankunft ist ein Fahrzeug, das eine Linie überquert, zu einer Zeit.",
    ),
    heroAlt: L(
      "A retail park entrance road at dusk with cars turning in, and a soft purple line marking the access point they cross.",
      "Une voie d'accès de parc commercial au crépuscule, des voitures qui tournent, et une ligne violette marquant le point d'accès franchi.",
      "Eine Zufahrtsstraße eines Fachmarktzentrums in der Dämmerung mit einbiegenden Autos und einer weichen violetten Linie an der Zufahrt.",
    ),
    rail: [
      { kicker: RAIL.m, label: L("Vehicle entries and exits by access point", "Entrées et sorties par point d'accès", "Fahrzeugein- und -ausfahrten je Zufahrt") },
      { kicker: RAIL.c, label: L("Hours, events, access roads and weather", "Horaires, événements, voirie et météo", "Öffnungszeiten, Veranstaltungen, Zufahrten und Wetter") },
      { kicker: RAIL.d, label: L("Arrival peaks and access-point share", "Pics d'arrivée et part par point d'accès", "Ankunftsspitzen und Anteil je Zufahrt") },
    ],
    fr: { question: "Combien de véhicules arrivent, et quand ?", supporting: "Gérer l'accès, les pics et les besoins d'exploitation", nextCta: "Explorer le stationnement" },
    de: { question: "Wie viele Fahrzeuge kommen an, und wann?", supporting: "Zufahrt, Spitzen und Betriebsanforderungen steuern", nextCta: "Parkraum erkunden" },
  },

  "retail-park-parking-occupancy": {
    focus: [
      { id: "measured", cluster: 0, label: L("The parking signal", "Le signal de stationnement", "Das Parksignal"),
        fr: "Les comptages d'entrées/sorties de véhicules ou les états de place fournissent le signal de stationnement, selon l'installation.",
        de: "Fahrzeugein-/-ausfahrtszählungen oder Stellplatzzustände liefern das Parksignal, je nach Aufbau." },
      { id: "connected", cluster: 1, label: L("The denominator", "Le dénominateur", "Der Nenner"),
        fr: "La capacité, les zones et les règles d'exploitation définissent le dénominateur et le contexte.",
        de: "Kapazität, Zonen und Betriebsregeln definieren Nenner und Kontext." },
      { id: "derived", cluster: 2, label: L("Occupancy and pressure", "Occupation et pression", "Belegung und Druck"),
        fr: "L'occupation, l'utilisation, la rotation et la pression par zone exigent des événements configurés et des définitions de capacité.",
        de: "Belegung, Auslastung, Umschlag und Druck je Zone erfordern konfigurierte Ereignisse und Kapazitätsdefinitionen." },
    ],
    eyebrow: L("Measure · Parking", "Mesurer · Stationnement", "Messen · Parken"),
    truth: L(
      "Occupancy is a ratio, and a ratio needs a stated capacity. Without a configured capacity and zone there is a count, but there is no occupancy.",
      "L'occupation est un ratio, et un ratio exige une capacité déclarée. Sans capacité ni zone configurées il y a un comptage, mais pas d'occupation.",
      "Belegung ist ein Verhältnis, und ein Verhältnis braucht eine angegebene Kapazität. Ohne konfigurierte Kapazität und Zone gibt es eine Zählung, aber keine Belegung.",
    ),
    coverageNote: L(
      "What is measured depends on the setup: counts at the entrance, or the state of individual bays. The two answer different questions.",
      "Ce qui est mesuré dépend de l'installation : des comptages à l'entrée, ou l'état de chaque place. Les deux répondent à des questions différentes.",
      "Was gemessen wird, hängt vom Aufbau ab: Zählungen an der Einfahrt oder der Zustand einzelner Stellplätze. Beides beantwortet verschiedene Fragen.",
    ),
    heroCaption: L(
      "A full car park and an unmeasured car park look alike from the road.",
      "Un parking plein et un parking non mesuré se ressemblent depuis la route.",
      "Ein voller und ein ungemessener Parkplatz sehen von der Straße gleich aus.",
    ),
    heroAlt: L(
      "A retail park car park from above at dusk, with soft purple marking across a block of bays.",
      "Un parking de parc commercial vu d'en haut au crépuscule, avec un marquage violet doux sur un bloc de places.",
      "Ein Parkplatz eines Fachmarktzentrums von oben in der Dämmerung, mit weicher violetter Markierung über einem Stellplatzblock.",
    ),
    rail: [
      { kicker: RAIL.m, label: L("Entry/exit counts or bay-state events", "Comptages d'entrée/sortie ou états de place", "Ein-/Ausfahrtszählungen oder Stellplatzzustände") },
      { kicker: RAIL.c, label: L("Capacity, zones and operating rules", "Capacité, zones et règles d'exploitation", "Kapazität, Zonen und Betriebsregeln") },
      { kicker: RAIL.d, label: L("Occupancy, turnover and pressure by zone", "Occupation, rotation et pression par zone", "Belegung, Umschlag und Druck je Zone") },
    ],
    fr: { question: "Quelle part de la capacité de stationnement est utilisée, et où ?", supporting: "Améliorer l'exploitation du stationnement et la planification des jours de pointe", nextCta: "Voir les visites d'unités" },
    de: { question: "Wie viel Parkkapazität wird genutzt, und wo?", supporting: "Parkbetrieb und Spitzentagsplanung verbessern", nextCta: "Einheitsbesuche ansehen" },
  },

  "retail-park-unit-visits": {
    focus: [
      { id: "measured", cluster: 0, label: L("Covered units", "Unités couvertes", "Abgedeckte Einheiten"),
        fr: "Les entrées de visiteurs aux unités couvertes ou dans les zones piétonnes fournissent le signal d'unité.",
        de: "Besuchereintritte an abgedeckten Einheiten oder in Fußgängerzonen liefern das Einheitssignal." },
      { id: "connected", cluster: 1, label: L("What defines coverage", "Ce qui définit la couverture", "Was Abdeckung definiert"),
        fr: "L'annuaire des enseignes, la catégorie d'unité, les limites et les horaires applicables définissent la couverture.",
        de: "Mieterverzeichnis, Einheitskategorie, Grenzen und geltende Öffnungszeiten definieren die Abdeckung." },
      { id: "derived", cluster: 2, label: L("Visits and share", "Visites et part", "Besuche und Anteil"),
        fr: "Les visites d'unités, la part de visites, les pics et la visitation par catégorie exigent des événements couverts et une cartographie.",
        de: "Einheitsbesuche, Besuchsanteil, Spitzen und Kategoriebesuche erfordern abgedeckte Ereignisse und Zuordnung." },
    ],
    eyebrow: L("Measure · Units", "Mesurer · Unités", "Messen · Einheiten"),
    truth: L(
      "Only covered units produce visits. An uncovered unit has no figure at all, which is different from having a low one.",
      "Seules les unités couvertes produisent des visites. Une unité non couverte n'a aucun chiffre, ce qui diffère d'en avoir un faible.",
      "Nur abgedeckte Einheiten erzeugen Besuche. Eine nicht abgedeckte Einheit hat gar keinen Wert — das ist etwas anderes als ein niedriger.",
    ),
    coverageNote: L(
      "Visit counts are bounded by the tenant directory and the configured unit boundaries.",
      "Les comptages de visites sont bornés par l'annuaire des enseignes et les limites d'unités configurées.",
      "Besuchszahlen sind durch das Mieterverzeichnis und die konfigurierten Einheitsgrenzen begrenzt.",
    ),
    heroCaption: L(
      "A unit visit is an entry across a boundary somebody configured.",
      "Une visite d'unité est une entrée franchissant une limite configurée.",
      "Ein Einheitsbesuch ist ein Eintritt über eine konfigurierte Grenze.",
    ),
    heroAlt: L(
      "Retail park unit frontages at dusk with people walking towards them, and soft purple thresholds glowing at the doorways.",
      "Des façades d'unités de parc commercial au crépuscule, des passants s'en approchant, et de doux seuils violets aux portes.",
      "Einheitsfassaden eines Fachmarktzentrums in der Dämmerung mit Passanten davor und weich violett leuchtenden Türschwellen.",
    ),
    rail: [
      { kicker: RAIL.m, label: L("Entries at covered units", "Entrées aux unités couvertes", "Eintritte an abgedeckten Einheiten") },
      { kicker: RAIL.c, label: L("Tenant directory, categories and boundaries", "Annuaire, catégories et limites", "Mieterverzeichnis, Kategorien und Grenzen") },
      { kicker: RAIL.d, label: L("Unit visits, share and category visitation", "Visites, part et visitation par catégorie", "Einheitsbesuche, Anteil und Kategoriebesuche") },
    ],
    fr: { question: "Quelles unités sont visitées, et quand ?", supporting: "Comprendre l'exposition des unités et les rythmes d'exploitation", nextCta: "Suivre la visitation croisée" },
    de: { question: "Welche Einheiten werden besucht, und wann?", supporting: "Exposition der Einheiten und Betriebsmuster verstehen", nextCta: "Cross-Visitation verfolgen" },
  },

  "retail-park-cross-visitation": {
    focus: [
      { id: "measured", cluster: 0, label: L("Matched transitions", "Transitions appariées", "Zugeordnete Übergänge"),
        fr: "Les visites d'unités appariées anonymement et les transitions ne sont utilisées que là où la couverture le permet.",
        de: "Anonym zugeordnete Einheitsbesuche und Übergänge werden nur genutzt, wo die Abdeckung es trägt." },
      { id: "connected", cluster: 1, label: L("The flow network", "Le réseau de flux", "Das Flussnetz"),
        fr: "La cartographie des enseignes et des catégories définit les unités et catégories du réseau de flux.",
        de: "Mieter- und Kategoriezuordnung definiert die Einheiten und Kategorien im Flussnetz." },
      { id: "derived", cluster: 2, label: L("Sequences and adjacency", "Séquences et adjacence", "Sequenzen und Nachbarschaft"),
        fr: "La visitation croisée, les séquences fréquentes, le nombre moyen d'unités par trajet et les relations entre catégories exigent appariement et cartographie.",
        de: "Cross-Visitation, häufige Sequenzen, durchschnittliche Einheiten je Weg und Kategoriebeziehungen erfordern Zuordnung und Kartierung." },
    ],
    eyebrow: L("Understand · Cross-visits", "Comprendre · Visites croisées", "Verstehen · Cross-Visits"),
    truth: L(
      "A transition needs both ends covered and anonymous matching supported. Where either is missing there is no sequence, only two separate visits.",
      "Une transition exige que les deux extrémités soient couvertes et que l'appariement anonyme soit pris en charge. À défaut, il n'y a pas de séquence, seulement deux visites distinctes.",
      "Ein Übergang erfordert beide Enden abgedeckt und unterstützte anonyme Zuordnung. Fehlt eines, gibt es keine Sequenz, nur zwei getrennte Besuche.",
    ),
    coverageNote: L(
      "Matching is anonymous and bounded by coverage. It links visits, never people.",
      "L'appariement est anonyme et borné par la couverture. Il relie des visites, jamais des personnes.",
      "Die Zuordnung ist anonym und durch die Abdeckung begrenzt. Sie verknüpft Besuche, nie Personen.",
    ),
    heroCaption: L(
      "Adjacency is a pattern between units, not a claim about anyone's trip.",
      "L'adjacence est un motif entre unités, pas une affirmation sur le trajet de quiconque.",
      "Nachbarschaft ist ein Muster zwischen Einheiten, keine Aussage über jemandes Weg.",
    ),
    heroAlt: L(
      "A retail park walkway at dusk with soft purple paths running between unit frontages.",
      "Une allée de parc commercial au crépuscule, avec de doux chemins violets entre les façades des unités.",
      "Ein Weg im Fachmarktzentrum in der Dämmerung mit weichen violetten Pfaden zwischen den Einheitsfassaden.",
    ),
    rail: [
      { kicker: RAIL.m, label: L("Anonymous matched unit transitions", "Transitions d'unités appariées anonymement", "Anonym zugeordnete Einheitsübergänge") },
      { kicker: RAIL.c, label: L("Tenant and category mapping", "Cartographie enseignes et catégories", "Mieter- und Kategoriezuordnung") },
      { kicker: RAIL.d, label: L("Cross-visitation and common sequences", "Visitation croisée et séquences fréquentes", "Cross-Visitation und häufige Sequenzen") },
    ],
    fr: { question: "Comment les visiteurs passent-ils d'une unité à l'autre ?", supporting: "Soutenir l'adjacence, le mix locatif, le contexte de bail et l'agencement du parc", nextCta: "Comprendre le temps sur site" },
    de: { question: "Wie bewegen sich Besucher von Einheit zu Einheit?", supporting: "Nachbarschaft, Mietermix, Vermietungskontext und Parklayout unterstützen", nextCta: "Aufenthaltsdauer verstehen" },
  },

  "retail-park-time-on-site": {
    focus: [
      { id: "measured", cluster: 0, label: L("The duration unit", "L'unité de durée", "Die Dauereinheit"),
        fr: "Les événements de durée véhicule ou visiteur pris en charge fournissent l'unité de durée explicitement étiquetée.",
        de: "Unterstützte Fahrzeug- oder Besucherdauerereignisse liefern die ausdrücklich benannte Dauereinheit." },
      { id: "connected", cluster: 1, label: L("What segments it", "Ce qui la segmente", "Was sie segmentiert"),
        fr: "Les horaires, les visites d'unités et le contexte d'événements peuvent segmenter le schéma de durée.",
        de: "Öffnungszeiten, Einheitsbesuche und Veranstaltungskontext können das Dauermuster segmentieren." },
      { id: "derived", cluster: 2, label: L("The distribution", "La distribution", "Die Verteilung"),
        fr: "La distribution du temps sur site est déduite de définitions d'arrivée/départ alignées ; la durée d'un véhicule n'est pas celle des personnes.",
        de: "Die Verteilung der Aufenthaltsdauer wird aus abgestimmten Ankunfts-/Abfahrtsdefinitionen abgeleitet; Fahrzeugdauer ist nicht Personendauer." },
    ],
    eyebrow: L("Understand · Duration", "Comprendre · Durée", "Verstehen · Dauer"),
    truth: L(
      "A vehicle duration is not a people duration. Which unit is being measured has to be stated, because the two are not interchangeable.",
      "La durée d'un véhicule n'est pas celle des personnes. L'unité mesurée doit être déclarée, car les deux ne sont pas interchangeables.",
      "Fahrzeugdauer ist nicht Personendauer. Welche Einheit gemessen wird, muss benannt werden, denn beide sind nicht austauschbar.",
    ),
    coverageNote: L(
      "Duration exists between a supported arrival and departure definition, and nowhere else.",
      "La durée existe entre une définition d'arrivée et de départ prise en charge, et nulle part ailleurs.",
      "Dauer existiert zwischen einer unterstützten Ankunfts- und Abfahrtsdefinition — und sonst nirgends.",
    ),
    heroCaption: L(
      "A duration is a span between two definitions, not a judgement on the visit.",
      "Une durée est une plage entre deux définitions, pas un jugement sur la visite.",
      "Eine Dauer ist eine Spanne zwischen zwei Definitionen, kein Urteil über den Besuch.",
    ),
    heroAlt: L(
      "A retail park seating and walkway area at dusk with soft purple rings on the ground where people have stopped.",
      "Une zone d'assises et de circulation de parc commercial au crépuscule, avec de doux anneaux violets là où l'on s'est arrêté.",
      "Ein Sitz- und Wegebereich im Fachmarktzentrum in der Dämmerung mit weichen violetten Ringen dort, wo Menschen verweilt haben.",
    ),
    rail: [
      { kicker: RAIL.m, label: L("Supported vehicle or visitor duration events", "Événements de durée véhicule ou visiteur pris en charge", "Unterstützte Fahrzeug- oder Besucherdauerereignisse") },
      { kicker: RAIL.c, label: L("Hours, unit visits and event context", "Horaires, visites d'unités et contexte d'événements", "Öffnungszeiten, Einheitsbesuche und Veranstaltungskontext") },
      { kicker: RAIL.d, label: L("Time-on-site distribution, on aligned definitions", "Distribution du temps sur site, sur définitions alignées", "Verteilung der Aufenthaltsdauer, auf abgestimmten Definitionen") },
    ],
    fr: { question: "Combien de temps les visiteurs passent-ils dans le parc commercial ?", supporting: "Comparer les missions rapides et les visites multi-unités plus profondes", nextCta: "Explorer l'exposition des unités" },
    de: { question: "Wie lange halten sich Besucher im Fachmarktzentrum auf?", supporting: "Kurze Erledigungen mit tieferen Mehr-Einheiten-Besuchen vergleichen", nextCta: "Exposition der Einheiten erkunden" },
  },

  "retail-park-unit-category-exposure": {
    focus: [
      { id: "measured", cluster: 0, label: L("Presence and time", "Présence et temps", "Präsenz und Zeit"),
        fr: "Les visites d'unités et de zones, ainsi que le temps, fournissent le signal physique d'exposition.",
        de: "Einheits- und Zonenbesuche sowie Zeit liefern das physische Expositionssignal." },
      { id: "connected", cluster: 1, label: L("What gives it meaning", "Ce qui lui donne du sens", "Was ihm Bedeutung gibt"),
        fr: "Les cartographies enseigne, unité, catégorie et limites fournissent le sens métier.",
        de: "Mieter-, Einheits-, Kategorie- und Grenzzuordnungen liefern die geschäftliche Bedeutung." },
      { id: "derived", cluster: 2, label: L("Exposure and reach", "Exposition et portée", "Exposition und Reichweite"),
        fr: "Le taux d'exposition, la portée par catégorie et la profondeur de visitation exigent des événements couverts et des cartographies alignées.",
        de: "Expositionsrate, Kategoriereichweite und Besuchstiefe erfordern abgedeckte Ereignisse und abgestimmte Zuordnungen." },
    ],
    eyebrow: L("Prove · Exposure", "Prouver · Exposition", "Belegen · Exposition"),
    truth: L(
      "Exposure is presence near a defined area, not attention and not intent. It says where people were, not what they thought.",
      "L'exposition est une présence près d'une zone définie, pas de l'attention ni une intention. Elle dit où les gens étaient, pas ce qu'ils pensaient.",
      "Exposition ist Präsenz nahe einer definierten Fläche, weder Aufmerksamkeit noch Absicht. Sie sagt, wo Menschen waren, nicht was sie dachten.",
    ),
    coverageNote: L(
      "Category comparison holds only where the mappings are aligned and the areas are covered.",
      "La comparaison par catégorie ne tient que si les cartographies sont alignées et les zones couvertes.",
      "Ein Kategorievergleich hält nur, wo Zuordnungen abgestimmt und Flächen abgedeckt sind.",
    ),
    heroCaption: L(
      "Exposure compares areas, not tenants.",
      "L'exposition compare des zones, pas des enseignes.",
      "Exposition vergleicht Flächen, keine Mieter.",
    ),
    heroAlt: L(
      "Retail park unit frontages at dusk with soft purple outlines standing over several of them.",
      "Des façades d'unités de parc commercial au crépuscule, avec de doux contours violets sur plusieurs d'entre elles.",
      "Einheitsfassaden eines Fachmarktzentrums in der Dämmerung mit weichen violetten Umrissen über mehreren davon.",
    ),
    rail: [
      { kicker: RAIL.m, label: L("Unit and zone visits, plus time", "Visites d'unités et de zones, et temps", "Einheits- und Zonenbesuche sowie Zeit") },
      { kicker: RAIL.c, label: L("Tenant, unit, category and boundary mappings", "Cartographies enseigne, unité, catégorie et limites", "Mieter-, Einheits-, Kategorie- und Grenzzuordnungen") },
      { kicker: RAIL.d, label: L("Exposure rate and category reach", "Taux d'exposition et portée par catégorie", "Expositionsrate und Kategoriereichweite") },
    ],
    fr: { question: "Comment l'exposition des visiteurs varie-t-elle selon les unités et catégories ?", supporting: "Éclairer le plan de catégories, la signalétique et les discussions de bail", nextCta: "Configurer la solution" },
    de: { question: "Wie unterscheidet sich die Besucherexposition zwischen Einheiten und Kategorien?", supporting: "Kategorieplanung, Beschilderung und Vermietungsgespräche fundieren", nextCta: "Lösung konfigurieren" },
  },
};
