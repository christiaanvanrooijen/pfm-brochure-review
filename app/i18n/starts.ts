/**
 * Display copy for the five segment-start experiences, resolved by SceneId.
 *
 * HOW THIS WAS WRITTEN
 *
 * Every question, supporting line and next CTA is the typed model's own, read
 * from `app/content/segments/*.ts` — never recalled. Every focus body is the
 * wording of one typed evidence cluster on that scene, in the order
 * measured -> connected -> derived. Each `sequence` entry names the evidence
 * that cluster rests on.
 *
 * The truth lines and coverage notes are the only sentences authored here, and
 * each states a boundary the scene's own model implies: what the evidence is
 * not, and where observation stops.
 *
 * Shopping Centre's start is NOT written here. It is the same scene the
 * accepted redesign journey already opens on, so it is re-exported from
 * `scenes.ts` rather than restated — one scene, one copy, no drift.
 *
 * WHY TWO STARTS CARRY NO PHOTOGRAPH
 *
 * Outlet Centre and QSR have no approved visual for their first Core scene.
 * QSR has no asset at all: `visual-assets.ts` registers every QSR visual as a
 * placeholder with no path, and none has been produced. Outlet Centre's on-disk
 * `outlet-centre-geo-intelligence-hero.png` is the SHOPPING CENTRE photograph
 * with a different overlay — pixel comparison puts it at a mean difference of
 * 1.9 from the Shopping Centre file, and five more outlet files duplicate other
 * segments the same way. Its typed entry, VIS-OUT-04, has no asset path either.
 *
 * `segment-capability-media.ts` already states the rule these two follow:
 * showing nothing is the honest state; showing another segment's media is not.
 * So both starts render the absent-media panel and say which visual is missing,
 * rather than borrowing a picture of a different kind of place.
 */

import type { Locale } from "./locales.ts";
import type { SceneCopy } from "./messages.ts";
import { sceneCopy } from "./scenes.ts";

/** The five segments, and the first Core scene each one opens on. */
export const startScenes: Readonly<Record<string, string>> = {
  retail: "retail-street-opportunity",
  "shopping-centre": "shopping-centre-catchment-area",
  "retail-park": "retail-park-catchment-area",
  "outlet-centre": "outlet-centre-destination-catchment",
  qsr: "qsr-drive-thru-context",
};

export const startSegments = Object.keys(startScenes);

/** Focus ids per start, in typed evidence order. */
export const startFocusOrder: Readonly<Record<string, readonly string[]>> = {
  "retail-street-opportunity": ["measured", "connected", "derived"],
  "shopping-centre-catchment-area": ["asset", "reach"],
  "retail-park-catchment-area": ["asset", "reach"],
  "outlet-centre-destination-catchment": ["asset", "reach"],
  "qsr-drive-thru-context": ["measured", "connected", "derived"],
};

const ILL_EN = "Illustrative visual · not customer data";
const ILL_FR = "Visuel illustratif · pas des données client";
const ILL_DE = "Illustrative Darstellung · keine Kundendaten";

/** Stated where a scene has no approved photograph, in place of alt text. */
const NO_ASSET_EN = "No approved visual exists for this scene yet.";
const NO_ASSET_FR = "Aucun visuel approuvé n'existe encore pour cette scène.";
const NO_ASSET_DE = "Für diese Szene existiert noch kein freigegebenes Visual.";

const en: Readonly<Record<string, SceneCopy>> = {
  "retail-street-opportunity": {
    eyebrow: "Street opportunity",
    question: "How much passing traffic is available, and what share enters the store?",
    supporting: "Optimise frontage, campaign timing and store-level opportunity",
    truth:
      "Passing audience and store entries are two separate signals, not one funnel. Passers-by are sampled context near the defined frontage; entries are counted where a threshold is configured. A capture rate exists only when both describe the same area, period and definitions.",
    coverageNote:
      "Passing audience is sampled context near the defined frontage; entries are counted only where a threshold is configured. Nobody is identified at either.",
    nextCta: "Measure store visits",
    focus: {
      measured: {
        label: "The street and the door",
        body: "Passing pedestrians and store entries/exits by time are kept as separate physical signals.",
      },
      connected: {
        label: "What explains the period",
        body: "Store hours, campaigns, weather or street context may explain the observed period.",
      },
      derived: {
        label: "Capture rate",
        body: "Capture rate and missed street opportunity are shown only when the aligned inputs share area, period and definitions.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Passing audience and store entries" },
      { kicker: "Connected", label: "Store hours, campaigns and street context" },
      { kicker: "Derived", label: "Capture rate and missed street opportunity" },
    ],
    heroCaption: "A capture rate needs both signals to describe the same door and the same hours.",
    heroAlt:
      "A city shopping street at golden hour. Pedestrians walk along a wide pavement past a lit store frontage whose fascia carries a fictional name. Soft purple trails follow the pavement and curve in through the entrance. Nothing is labelled with a figure and no real brand appears.",
    illustrative: ILL_EN,
  },

  "retail-park-catchment-area": {
    eyebrow: "Catchment",
    question: "Where do park visitors come from, and what demand sits around the asset?",
    supporting: "Inform marketing, tenant mix and park positioning",
    truth:
      "This is aggregate area context from an approved external source, not a measurement of the people on your park. Unit sensors measure visits; they do not measure origin, and no origin reading identifies anyone.",
    coverageNote:
      "Aggregate area context, from an approved source. Not a measurement of this park's own visitors, and never a substitute for what is measured at the units.",
    nextCta: "Measure vehicle arrival",
    focus: {
      asset: {
        label: "The asset",
        body: "Asset or unit visits can anchor on-site demand, but unit sensors do not measure origin.",
      },
      reach: {
        label: "The demand around it",
        body: "Approved aggregate mobility, geo-location and contextual origin sources describe demand around the park.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "On-site unit visit baseline" },
      { kicker: "Connected", label: "Approved aggregate mobility or origin context" },
      { kicker: "Derived", label: "Catchment bands, origin mix, visitor profile and drive-time reach" },
    ],
    heroCaption: "Reach is context around the park, not a count of who arrived.",
    heroAlt:
      "An aerial view of a retail park at dusk: single-storey units around a large surface car park, with lit roads and housing beyond. Soft purple arcs curve outward across the surrounding area with a few small nodes on them. No place is named and nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },

  "outlet-centre-destination-catchment": {
    eyebrow: "Destination catchment",
    question: "How far are visitors willing to travel to the outlet destination?",
    supporting: "Support destination marketing, positioning and expansion of reach",
    truth:
      "This is aggregate area context from an approved external source, not a measurement of the people at the destination. Entrance sensors measure visits; they do not measure origin, and no origin reading identifies anyone.",
    coverageNote:
      "Aggregate area context, from an approved source. Not a measurement of this destination's own visitors, and never a substitute for what is measured on site.",
    nextCta: "Understand origin context",
    focus: {
      asset: {
        label: "The destination",
        body: "On-site visits can anchor destination demand, but entrance sensors do not measure origin.",
      },
      reach: {
        label: "The reach around it",
        body: "Approved aggregate mobility, geo-location and destination context describe reach around the outlet.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "On-site visit baseline" },
      { kicker: "Connected", label: "Approved aggregate mobility or destination context" },
      { kicker: "Derived", label: "Primary, secondary and extended catchment and travel-time reach" },
    ],
    heroCaption: "Destination reach is context around the outlet, not a count of who came in.",
    heroAlt: NO_ASSET_EN,
    illustrative: ILL_EN,
  },

  "qsr-drive-thru-context": {
    eyebrow: "Context · Drive-Thru",
    question: "Where does your drive-thru lose time?",
    supporting: "Follow every measurable stage from arrival to handoff before discussing technology",
    truth:
      "Lane timing is measured between two configured points, not across the whole visit. The measurement period and the service goal are supplied by the operation; the timer does not set them, and no vehicle or person is identified.",
    coverageNote:
      "Timing exists only between the configured journey start and end points. A goal is a configured target, not a measured value.",
    nextCta: "Follow the vehicle journey",
    focus: {
      measured: {
        label: "The lane",
        body: "Vehicle detections at the configured journey start and end points provide the measured timing signal.",
      },
      connected: {
        label: "What the operation supplies",
        body: "The measurement period and the configured service goal are supplied by the operation, not measured by the timer.",
      },
      derived: {
        label: "Time, throughput and goal",
        body: "Lane total time, throughput and goal attainment are calculated only from compatible journey start/end definitions and a configured target.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Vehicle detections at the configured start and end points" },
      { kicker: "Connected", label: "Measurement period and configured service goal" },
      { kicker: "Derived", label: "Lane total time, throughput and goal attainment" },
    ],
    heroCaption: "A lane time is a span between two configured points, not a verdict on the visit.",
    heroAlt: NO_ASSET_EN,
    illustrative: ILL_EN,
  },
};

const fr: Readonly<Record<string, SceneCopy>> = {
  "retail-street-opportunity": {
    eyebrow: "Opportunité de rue",
    question: "Quel trafic passant est disponible, et quelle part entre dans le magasin ?",
    supporting: "Optimiser la vitrine, le calendrier des campagnes et l'opportunité au niveau du magasin",
    truth:
      "L'audience passante et les entrées en magasin sont deux signaux distincts, pas un entonnoir unique. Les passants sont un contexte échantillonné près de la vitrine définie ; les entrées sont comptées là où un seuil est configuré. Un taux de captation n'existe que si les deux décrivent la même zone, la même période et les mêmes définitions.",
    coverageNote:
      "L'audience passante est un contexte échantillonné près de la vitrine définie ; les entrées ne sont comptées que là où un seuil est configuré. Personne n'est identifié dans l'un ni dans l'autre.",
    nextCta: "Mesurer les visites en magasin",
    focus: {
      measured: {
        label: "La rue et la porte",
        body: "Les piétons passants et les entrées/sorties du magasin par période sont conservés comme signaux physiques distincts.",
      },
      connected: {
        label: "Ce qui explique la période",
        body: "Les horaires du magasin, les campagnes, la météo ou le contexte de rue peuvent expliquer la période observée.",
      },
      derived: {
        label: "Taux de captation",
        body: "Le taux de captation et l'opportunité de rue manquée ne sont affichés que si les entrées alignées partagent zone, période et définitions.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Audience passante et entrées en magasin" },
      { kicker: "Connecté", label: "Horaires, campagnes et contexte de rue" },
      { kicker: "Déduit", label: "Taux de captation et opportunité de rue manquée" },
    ],
    heroCaption: "Un taux de captation exige que les deux signaux décrivent la même porte et les mêmes heures.",
    heroAlt:
      "Une rue commerçante urbaine à l'heure dorée. Des piétons marchent sur un large trottoir devant une vitrine éclairée dont l'enseigne porte un nom fictif. De douces traînées violettes suivent le trottoir et s'incurvent vers l'entrée. Rien n'est étiqueté d'un chiffre et aucune marque réelle n'apparaît.",
    illustrative: ILL_FR,
  },

  "retail-park-catchment-area": {
    eyebrow: "Zone de chalandise",
    question: "D'où viennent les visiteurs du parc, et quelle demande entoure l'actif ?",
    supporting: "Éclairer le marketing, le mix locatif et le positionnement du parc",
    truth:
      "Il s'agit d'un contexte de zone agrégé issu d'une source externe approuvée, pas d'une mesure des personnes présentes sur votre parc. Les capteurs des unités mesurent des visites ; ils ne mesurent pas l'origine, et aucune lecture d'origine n'identifie quiconque.",
    coverageNote:
      "Contexte de zone agrégé, issu d'une source approuvée. Ce n'est pas une mesure des visiteurs propres à ce parc, ni un substitut à ce qui est mesuré au niveau des unités.",
    nextCta: "Mesurer l'arrivée des véhicules",
    focus: {
      asset: {
        label: "L'actif",
        body: "Les visites de l'actif ou des unités peuvent ancrer la demande sur site, mais les capteurs des unités ne mesurent pas l'origine.",
      },
      reach: {
        label: "La demande alentour",
        body: "Des sources approuvées de mobilité agrégée, de géolocalisation et de contexte d'origine décrivent la demande autour du parc.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Base de visites des unités sur site" },
      { kicker: "Connecté", label: "Mobilité agrégée approuvée ou contexte d'origine" },
      { kicker: "Déduit", label: "Bandes de chalandise, mix d'origines, profil visiteur et portée en temps de trajet" },
    ],
    heroCaption: "La portée est un contexte autour du parc, pas un comptage de qui est arrivé.",
    heroAlt:
      "Vue aérienne d'un parc commercial au crépuscule : des unités de plain-pied autour d'un grand parking de surface, avec des routes éclairées et des habitations au-delà. De douces arches violettes s'incurvent vers l'extérieur au-dessus de la zone environnante, ponctuées de quelques petits nœuds. Aucun lieu n'est nommé et rien n'est étiqueté d'un chiffre.",
    illustrative: ILL_FR,
  },

  "outlet-centre-destination-catchment": {
    eyebrow: "Chalandise de destination",
    question: "Jusqu'où les visiteurs sont-ils prêts à voyager vers la destination outlet ?",
    supporting: "Soutenir le marketing de destination, le positionnement et l'extension de la portée",
    truth:
      "Il s'agit d'un contexte de zone agrégé issu d'une source externe approuvée, pas d'une mesure des personnes présentes sur la destination. Les capteurs d'entrée mesurent des visites ; ils ne mesurent pas l'origine, et aucune lecture d'origine n'identifie quiconque.",
    coverageNote:
      "Contexte de zone agrégé, issu d'une source approuvée. Ce n'est pas une mesure des visiteurs propres à cette destination, ni un substitut à ce qui est mesuré sur site.",
    nextCta: "Comprendre le contexte d'origine",
    focus: {
      asset: {
        label: "La destination",
        body: "Les visites sur site peuvent ancrer la demande de destination, mais les capteurs d'entrée ne mesurent pas l'origine.",
      },
      reach: {
        label: "La portée alentour",
        body: "Des sources approuvées de mobilité agrégée, de géolocalisation et de contexte de destination décrivent la portée autour de l'outlet.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Base de visites sur site" },
      { kicker: "Connecté", label: "Mobilité agrégée approuvée ou contexte de destination" },
      { kicker: "Déduit", label: "Chalandise primaire, secondaire et étendue, et portée en temps de trajet" },
    ],
    heroCaption: "La portée de destination est un contexte autour de l'outlet, pas un comptage des entrées.",
    heroAlt: NO_ASSET_FR,
    illustrative: ILL_FR,
  },

  "qsr-drive-thru-context": {
    eyebrow: "Contexte · Drive",
    question: "Où votre drive perd-il du temps ?",
    supporting: "Suivre chaque étape mesurable, de l'arrivée à la remise, avant de parler technologie",
    truth:
      "Le temps de file est mesuré entre deux points configurés, pas sur l'ensemble de la visite. La période de mesure et l'objectif de service sont fournis par l'exploitation ; le chronomètre ne les définit pas, et aucun véhicule ni aucune personne n'est identifié.",
    coverageNote:
      "Le chronométrage n'existe qu'entre les points de début et de fin de parcours configurés. Un objectif est une cible configurée, pas une valeur mesurée.",
    nextCta: "Suivre le parcours du véhicule",
    focus: {
      measured: {
        label: "La file",
        body: "Les détections de véhicules aux points de début et de fin de parcours configurés fournissent le signal de chronométrage mesuré.",
      },
      connected: {
        label: "Ce que fournit l'exploitation",
        body: "La période de mesure et l'objectif de service configuré sont fournis par l'exploitation, non mesurés par le chronomètre.",
      },
      derived: {
        label: "Temps, débit et objectif",
        body: "Le temps total de file, le débit et l'atteinte de l'objectif ne sont calculés qu'à partir de définitions de début/fin compatibles et d'une cible configurée.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Détections de véhicules aux points de début et de fin configurés" },
      { kicker: "Connecté", label: "Période de mesure et objectif de service configuré" },
      { kicker: "Déduit", label: "Temps total de file, débit et atteinte de l'objectif" },
    ],
    heroCaption: "Un temps de file est une durée entre deux points configurés, pas un jugement sur la visite.",
    heroAlt: NO_ASSET_FR,
    illustrative: ILL_FR,
  },
};

const de: Readonly<Record<string, SceneCopy>> = {
  "retail-street-opportunity": {
    eyebrow: "Straßenpotenzial",
    question: "Wie viel Passantenverkehr ist verfügbar, und welcher Anteil betritt den Store?",
    supporting: "Schaufenster, Kampagnen-Timing und Potenzial auf Store-Ebene optimieren",
    truth:
      "Passantenpublikum und Store-Eintritte sind zwei getrennte Signale, kein einzelner Funnel. Passanten sind ein stichprobenartiger Kontext nahe der definierten Fassade; Eintritte werden dort gezählt, wo eine Schwelle konfiguriert ist. Eine Erfassungsrate existiert nur, wenn beide dieselbe Fläche, denselben Zeitraum und dieselben Definitionen beschreiben.",
    coverageNote:
      "Das Passantenpublikum ist stichprobenartiger Kontext nahe der definierten Fassade; Eintritte werden nur dort gezählt, wo eine Schwelle konfiguriert ist. In beiden Fällen wird niemand identifiziert.",
    nextCta: "Store-Besuche messen",
    focus: {
      measured: {
        label: "Die Straße und die Tür",
        body: "Vorbeigehende Passanten und Store-Eintritte/-Austritte nach Zeit werden als getrennte physische Signale geführt.",
      },
      connected: {
        label: "Was den Zeitraum erklärt",
        body: "Öffnungszeiten, Kampagnen, Wetter oder Straßenkontext können den beobachteten Zeitraum erklären.",
      },
      derived: {
        label: "Erfassungsrate",
        body: "Erfassungsrate und verpasstes Straßenpotenzial werden nur gezeigt, wenn die abgestimmten Eingaben Fläche, Zeitraum und Definitionen teilen.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Passantenpublikum und Store-Eintritte" },
      { kicker: "Verbunden", label: "Öffnungszeiten, Kampagnen und Straßenkontext" },
      { kicker: "Abgeleitet", label: "Erfassungsrate und verpasstes Straßenpotenzial" },
    ],
    heroCaption: "Eine Erfassungsrate verlangt, dass beide Signale dieselbe Tür und dieselben Stunden beschreiben.",
    heroAlt:
      "Eine städtische Einkaufsstraße im goldenen Licht. Passanten gehen über einen breiten Gehweg an einer beleuchteten Ladenfront vorbei, deren Beschilderung einen fiktiven Namen trägt. Weiche violette Spuren folgen dem Gehweg und biegen zum Eingang ab. Nichts ist mit einer Zahl beschriftet und keine reale Marke erscheint.",
    illustrative: ILL_DE,
  },

  "retail-park-catchment-area": {
    eyebrow: "Einzugsgebiet",
    question: "Woher kommen die Besucher des Parks, und welche Nachfrage liegt rund um das Objekt?",
    supporting: "Marketing, Mietermix und Positionierung des Parks fundieren",
    truth:
      "Dies ist aggregierter Gebietskontext aus einer freigegebenen externen Quelle, keine Messung der Menschen auf Ihrem Park. Sensoren an den Einheiten messen Besuche; sie messen keine Herkunft, und keine Herkunftslesung identifiziert jemanden.",
    coverageNote:
      "Aggregierter Gebietskontext aus einer freigegebenen Quelle. Keine Messung der eigenen Besucher dieses Parks und niemals ein Ersatz für das, was an den Einheiten gemessen wird.",
    nextCta: "Fahrzeugankunft messen",
    focus: {
      asset: {
        label: "Das Objekt",
        body: "Objekt- oder Einheitsbesuche können die Nachfrage vor Ort verankern, aber Sensoren an den Einheiten messen keine Herkunft.",
      },
      reach: {
        label: "Die Nachfrage ringsum",
        body: "Freigegebene aggregierte Mobilitäts-, Geo- und Herkunftskontextquellen beschreiben die Nachfrage rund um den Park.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Basis der Einheitsbesuche vor Ort" },
      { kicker: "Verbunden", label: "Freigegebene aggregierte Mobilität oder Herkunftskontext" },
      { kicker: "Abgeleitet", label: "Einzugsbänder, Herkunftsmix, Besucherprofil und Fahrzeit-Reichweite" },
    ],
    heroCaption: "Reichweite ist Kontext rund um den Park, keine Zählung der Angekommenen.",
    heroAlt:
      "Luftbild eines Fachmarktzentrums in der Dämmerung: eingeschossige Einheiten um einen großen ebenerdigen Parkplatz, dahinter beleuchtete Straßen und Wohnbebauung. Weiche violette Bögen schwingen nach außen über das umliegende Gebiet, mit einigen kleinen Knotenpunkten. Kein Ort ist benannt und nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },

  "outlet-centre-destination-catchment": {
    eyebrow: "Destinations-Einzugsgebiet",
    question: "Wie weit sind Besucher bereit, zur Outlet-Destination zu reisen?",
    supporting: "Destinationsmarketing, Positionierung und Ausweitung der Reichweite unterstützen",
    truth:
      "Dies ist aggregierter Gebietskontext aus einer freigegebenen externen Quelle, keine Messung der Menschen an der Destination. Eingangssensoren messen Besuche; sie messen keine Herkunft, und keine Herkunftslesung identifiziert jemanden.",
    coverageNote:
      "Aggregierter Gebietskontext aus einer freigegebenen Quelle. Keine Messung der eigenen Besucher dieser Destination und niemals ein Ersatz für das, was vor Ort gemessen wird.",
    nextCta: "Herkunftskontext verstehen",
    focus: {
      asset: {
        label: "Die Destination",
        body: "Besuche vor Ort können die Nachfrage der Destination verankern, aber Eingangssensoren messen keine Herkunft.",
      },
      reach: {
        label: "Die Reichweite ringsum",
        body: "Freigegebene aggregierte Mobilitäts-, Geo- und Destinationskontextquellen beschreiben die Reichweite rund um das Outlet.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Basis der Besuche vor Ort" },
      { kicker: "Verbunden", label: "Freigegebene aggregierte Mobilität oder Destinationskontext" },
      { kicker: "Abgeleitet", label: "Primäres, sekundäres und erweitertes Einzugsgebiet sowie Fahrzeit-Reichweite" },
    ],
    heroCaption: "Destinations-Reichweite ist Kontext rund um das Outlet, keine Zählung der Eintritte.",
    heroAlt: NO_ASSET_DE,
    illustrative: ILL_DE,
  },

  "qsr-drive-thru-context": {
    eyebrow: "Kontext · Drive-Thru",
    question: "Wo verliert Ihr Drive-Thru Zeit?",
    supporting: "Jeder messbaren Stufe von der Ankunft bis zur Übergabe folgen, bevor über Technologie gesprochen wird",
    truth:
      "Die Spurzeit wird zwischen zwei konfigurierten Punkten gemessen, nicht über den gesamten Besuch. Messzeitraum und Servicezielwert werden vom Betrieb geliefert; der Timer setzt sie nicht, und kein Fahrzeug und keine Person wird identifiziert.",
    coverageNote:
      "Zeitmessung existiert nur zwischen den konfigurierten Start- und Endpunkten der Fahrt. Ein Ziel ist ein konfigurierter Sollwert, kein gemessener Wert.",
    nextCta: "Der Fahrzeugfahrt folgen",
    focus: {
      measured: {
        label: "Die Spur",
        body: "Fahrzeugerkennungen an den konfigurierten Start- und Endpunkten der Fahrt liefern das gemessene Zeitsignal.",
      },
      connected: {
        label: "Was der Betrieb liefert",
        body: "Messzeitraum und konfiguriertes Serviceziel werden vom Betrieb geliefert, nicht vom Timer gemessen.",
      },
      derived: {
        label: "Zeit, Durchsatz und Ziel",
        body: "Gesamtspurzeit, Durchsatz und Zielerreichung werden nur aus kompatiblen Start-/Enddefinitionen und einem konfigurierten Sollwert berechnet.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Fahrzeugerkennungen an den konfigurierten Start- und Endpunkten" },
      { kicker: "Verbunden", label: "Messzeitraum und konfiguriertes Serviceziel" },
      { kicker: "Abgeleitet", label: "Gesamtspurzeit, Durchsatz und Zielerreichung" },
    ],
    heroCaption: "Eine Spurzeit ist eine Spanne zwischen zwei konfigurierten Punkten, kein Urteil über den Besuch.",
    heroAlt: NO_ASSET_DE,
    illustrative: ILL_DE,
  },
};

/**
 * COVER COPY — what a start visual is allowed to say about itself.
 *
 * A cover orients; it proves nothing. Each note below states that in the terms
 * of its own segment, because "this is not evidence" is too abstract to land:
 * the Outlet note has to name catchment, origin and demand, since those are the
 * three things a picture of a shopping destination will otherwise be read as
 * claiming.
 */
export const startCoverCopy: Readonly<
  Record<Locale, Readonly<Record<string, { label: string; note: string }>>>
> = {
  en: {
    retail: {
      label: "Illustrative location visual",
      note: "An illustrative location visual of a store of this kind — not customer data and not a count. It shows no passing audience and no entries, and nothing below is concluded from it.",
    },
    "shopping-centre": {
      label: "Illustrative location visual",
      note: "An illustrative location visual of a centre of this kind — not customer data and not a catchment measurement. It shows no visitor origin and no reach, and nothing below is concluded from it.",
    },
    "retail-park": {
      label: "Illustrative location visual",
      note: "An illustrative location visual of a retail park of this kind — not customer data and not a catchment measurement. It shows no visitor origin and no demand, and nothing below is concluded from it.",
    },
    qsr: {
      label: "Illustrative location visual",
      note: "An illustrative location visual of a drive-thru of this kind — not customer data. It carries no timing, no count and no goal, and identifies no vehicle and no person.",
    },
    "outlet-centre": {
      label: "Illustrative location visual",
      note: "An illustrative location visual of an outlet destination — not customer data and not a catchment measurement. It shows no origin and no visitor demand, and nothing below is concluded from it.",
    },
  },
  fr: {
    retail: {
      label: "Visuel de lieu illustratif",
      note: "Visuel de lieu illustratif d'un magasin de ce type — pas des données client ni un comptage. Il ne montre ni audience passante ni entrées, et rien ci-dessous n'en est déduit.",
    },
    "shopping-centre": {
      label: "Visuel de lieu illustratif",
      note: "Visuel de lieu illustratif d'un centre de ce type — pas des données client ni une mesure de chalandise. Il ne montre ni origine des visiteurs ni portée, et rien ci-dessous n'en est déduit.",
    },
    "retail-park": {
      label: "Visuel de lieu illustratif",
      note: "Visuel de lieu illustratif d'un retail park de ce type — pas des données client ni une mesure de chalandise. Il ne montre ni origine des visiteurs ni demande, et rien ci-dessous n'en est déduit.",
    },
    qsr: {
      label: "Visuel de lieu illustratif",
      note: "Visuel de lieu illustratif d'un drive de ce type — pas des données client. Il ne porte aucun chronométrage, aucun comptage ni objectif, et n'identifie aucun véhicule ni aucune personne.",
    },
    "outlet-centre": {
      label: "Visuel de lieu illustratif",
      note: "Visuel de lieu illustratif d'une destination outlet — pas des données client ni une mesure de chalandise. Il ne montre ni origine ni demande des visiteurs, et rien ci-dessous n'en est déduit.",
    },
  },
  de: {
    retail: {
      label: "Illustratives Standort-Visual",
      note: "Illustratives Standort-Visual eines Geschäfts dieser Art — keine Kundendaten und keine Zählung. Es zeigt weder vorbeigehendes Publikum noch Eintritte, und nichts darunter wird daraus abgeleitet.",
    },
    "shopping-centre": {
      label: "Illustratives Standort-Visual",
      note: "Illustratives Standort-Visual eines Centers dieser Art — keine Kundendaten und keine Einzugsgebietsmessung. Es zeigt weder Besucherherkunft noch Reichweite, und nichts darunter wird daraus abgeleitet.",
    },
    "retail-park": {
      label: "Illustratives Standort-Visual",
      note: "Illustratives Standort-Visual eines Retail Parks dieser Art — keine Kundendaten und keine Einzugsgebietsmessung. Es zeigt weder Besucherherkunft noch Nachfrage, und nichts darunter wird daraus abgeleitet.",
    },
    qsr: {
      label: "Illustratives Standort-Visual",
      note: "Illustratives Standort-Visual eines Drive-Thru dieser Art — keine Kundendaten. Es trägt keine Zeitmessung, keine Zählung und kein Ziel und identifiziert weder Fahrzeug noch Person.",
    },
    "outlet-centre": {
      label: "Illustratives Standort-Visual",
      note: "Illustratives Standort-Visual einer Outlet-Destination — keine Kundendaten und keine Einzugsgebietsmessung. Es zeigt weder Herkunft noch Besuchernachfrage, und nichts darunter wird daraus abgeleitet.",
    },
  },
};

/**
 * Start copy per locale. Shopping Centre is taken from the accepted journey's
 * own copy for that scene rather than restated here.
 */
export const startCopy: Readonly<Record<Locale, Readonly<Record<string, SceneCopy>>>> = {
  en: { ...en, "shopping-centre-catchment-area": sceneCopy.en["shopping-centre-catchment-area"] },
  fr: { ...fr, "shopping-centre-catchment-area": sceneCopy.fr["shopping-centre-catchment-area"] },
  de: { ...de, "shopping-centre-catchment-area": sceneCopy.de["shopping-centre-catchment-area"] },
};
