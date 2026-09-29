/**
 * Display copy for the eight Shopping Centre Core scenes, resolved by SceneId.
 *
 * HOW THIS WAS WRITTEN
 *
 * Every question, supporting line and next CTA is the typed model's own, read
 * from `app/content/segments/shopping-centre.ts` — never recalled. Every focus
 * body is the wording of one typed evidence cluster on that scene. Every
 * `sequence` entry is an evidence input's own label, in the order
 * measured -> connected -> derived.
 *
 * The truth lines and coverage notes are the only sentences authored here, and
 * each one states a boundary the scene's own model implies: what the evidence
 * is not, and that observation stops at configured coverage.
 *
 * HOTSPOTS VERSUS THE EVIDENCE LAYER
 *
 * `mode` says how a scene is explored, and it is a judgement about the ASSET,
 * not a styling choice:
 *
 *   hotspots  the scene has at least two subjects that are genuinely visible in
 *             the approved image and can be pointed at honestly — a concourse,
 *             an escalator bank, an anchor frontage, a store threshold, the
 *             asset and the reach around it.
 *   layer     it does not. Entrances resolves to a single visible subject;
 *             visitor composition would require pointing at individual people,
 *             which is precisely what the anonymity boundary forbids; and time
 *             in centre has no place in a picture at all — a duration is not
 *             somewhere. These use a compact evidence strip on the canvas
 *             rather than hotspots invented for consistency.
 *
 * FICTIONAL FASCIA
 *
 * Three of the approved assets carry fictional tenant signage (AURELIA MILANO,
 * VELLUTO ACCESSORIES, LUMIÈRE). It is depicted environment, described as
 * fictional in the alt text, and never read as data: no label below names a
 * brand, and no hotspot claims a tenant.
 */

import type { SceneCopy } from "./messages.ts";
import type { Locale } from "./locales.ts";

export type SceneExploration = "hotspots" | "layer";

export const sceneModes: Readonly<Record<string, SceneExploration>> = {
  "shopping-centre-catchment-area": "hotspots",
  "shopping-centre-entrances": "layer",
  "shopping-centre-visitor-composition": "layer",
  "shopping-centre-internal-circulation": "hotspots",
  "shopping-centre-zone-anchor-exposure": "hotspots",
  "shopping-centre-brand-counting": "hotspots",
  "shopping-centre-brand-flow": "hotspots",
  "shopping-centre-time-in-centre": "layer",
};

/** Focus ids per scene, in typed evidence order. */
export const sceneFocusOrder: Readonly<Record<string, readonly string[]>> = {
  "shopping-centre-catchment-area": ["asset", "reach"],
  "shopping-centre-entrances": ["measured", "connected", "derived"],
  "shopping-centre-visitor-composition": ["measured", "connected", "derived"],
  "shopping-centre-internal-circulation": ["movement", "transitions", "distribution"],
  "shopping-centre-zone-anchor-exposure": ["zones", "anchors"],
  "shopping-centre-brand-counting": ["threshold", "boundary"],
  "shopping-centre-brand-flow": ["between", "covered"],
  "shopping-centre-time-in-centre": ["measured", "connected", "derived"],
};

const ILL_EN = "Illustrative visual · not customer data";
const ILL_FR = "Visuel illustratif · pas des données client";
const ILL_DE = "Illustrative Darstellung · keine Kundendaten";

const en: Readonly<Record<string, SceneCopy>> = {
  "shopping-centre-catchment-area": {
    eyebrow: "Catchment",
    question: "Where do centre visitors come from, and who lives in that reach?",
    supporting: "Shape marketing, positioning, leasing context and destination strategy",
    truth:
      "This is aggregate area context from an approved external source, not a measurement of the people at your doors. Entrance sensors measure visits; they do not measure origin, and no origin reading identifies anyone.",
    coverageNote:
      "Aggregate area context, from an approved source. Not a measurement of this centre's own visitors, and never a substitute for what is measured at the asset.",
    nextCta: "Measure centre arrivals",
    focus: {
      asset: {
        label: "The asset",
        body: "On-site visits can anchor the asset baseline, but entrance sensors do not measure origin.",
      },
      reach: {
        label: "The reach around it",
        body: "Approved aggregate mobility, geo-location and contextual origin sources describe reach around the centre.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "On-site visit baseline" },
      { kicker: "Connected", label: "Approved aggregate mobility or origin context" },
      { kicker: "Derived", label: "Catchment bands, origin mix and travel-time reach" },
    ],
    heroCaption: "Reach is context around the centre, not a count of who came in.",
    heroAlt:
      "An aerial view of a shopping centre and its surroundings at dusk, with roads, car parks and lit buildings. Soft purple arcs curve outward from the centre across the surrounding area, with a few small nodes on them. No place is named and nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },
  "shopping-centre-entrances": {
    eyebrow: "Entrances",
    question: "How many visitors enter the asset, through which entrances and when?",
    supporting: "Plan operations, cleaning, security, opening hours and event staffing",
    truth:
      "Entries and exits are counted per entrance, as anonymous events. An entry is not a unique visitor, and only the entrances that are configured are measured.",
    coverageNote:
      "Anonymous events, at configured entrances only. Not unique people, and an entrance outside the configured set is not measured.",
    nextCta: "Understand visitor mix",
    focus: {
      measured: {
        label: "Measured here",
        body: "Entries and exits are measured per entrance by time.",
      },
      connected: {
        label: "Connected by you",
        body: "Opening hours, events, weather, campaigns and transport context can explain arrival patterns.",
      },
      derived: {
        label: "Derived from both",
        body: "Entrance share, peak arrival rhythm and like-for-like entrance patterns require the physical time series.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Entrance IN/OUT events" },
      { kicker: "Connected", label: "Opening hours, events, campaigns or operational context" },
      { kicker: "Derived", label: "Entrance share and peak arrival rhythm" },
    ],
    heroCaption: "An entry is counted at a door, not attributed to a person.",
    heroAlt:
      "A shopping-centre forecourt at dusk with several glazed entrances and people walking towards them. Soft purple lines run along the paving and converge at the doorways. No face is outlined or marked as measured, and nothing is labelled with a name or a figure.",
    illustrative: ILL_EN,
  },
  "shopping-centre-visitor-composition": {
    eyebrow: "Visitor mix",
    question: "Who is entering the centre in anonymous visitor groups?",
    supporting: "Compare visitor mix by entrance, daypart, event or season",
    truth:
      "Groups are estimated anonymously, and only where classification is enabled, configured and permitted. Nobody is identified, no individual is profiled, and where it is not enabled there is no mix to read.",
    coverageNote:
      "Anonymous group estimates, only where classification is enabled, configured and permitted. Nobody is identified and no individual is profiled.",
    nextCta: "Follow centre circulation",
    focus: {
      measured: {
        label: "Compatible events",
        body: "Entrance visit events must come from a classification-compatible implementation.",
      },
      connected: {
        label: "Permitted and enabled",
        body: "Classification is enabled, configured and permitted for the selected centre scope.",
      },
      derived: {
        label: "The anonymous mix",
        body: "Group size, buying-unit and permitted anonymous classifications are estimated from the named inputs.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Classification-compatible visit events" },
      { kicker: "Connected", label: "Enabled, configured and permitted classification" },
      { kicker: "Derived", label: "Anonymous visitor composition" },
    ],
    heroCaption: "A group is estimated, never recognised.",
    heroAlt:
      "A shopping-centre forecourt at dusk with people walking towards a lit glazed entrance. Soft purple rings sit on the paving at the feet of some of them. No face is outlined, no person is numbered, and nothing is labelled with a name.",
    illustrative: ILL_EN,
  },
  "shopping-centre-internal-circulation": {
    eyebrow: "Circulation",
    question: "How do visitors move across floors, corridors, zones and anchors?",
    supporting: "Improve wayfinding, layout, operations and anchor connectivity",
    truth:
      "Movement events are not unique visitors — a visitor going up and coming back down is observed each time. Movement is only observed where zones, corridors and vertical transport are configured.",
    coverageNote:
      "Anonymous events, inside configured coverage only. Not unique people, and nothing outside the configured areas is observed.",
    nextCta: "Explore zone & anchor exposure",
    focus: {
      movement: {
        label: "Routes",
        body: "Zone entries/exits, transitions and anonymous trajectories provide the movement signal.",
      },
      transitions: {
        label: "Floors",
        body: "Flow matrix, route structure, floor-to-floor movement and bottlenecks require aligned movement and spatial definitions.",
      },
      distribution: {
        label: "Anchors",
        body: "Floorplan, floor, corridor, zone, anchor and vertical-transport definitions provide spatial meaning.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Anonymous spatial trajectories and transitions" },
      { kicker: "Connected", label: "Floorplan and spatial definitions" },
      { kicker: "Derived", label: "Flow matrix, route structure and bottlenecks" },
    ],
    heroCaption: "A route only means something against your own plan of the centre.",
    heroAlt:
      "A shopping-centre concourse on two levels, with escalators, shopfronts and people walking. Soft purple lines follow some of the walking routes across the floor. No face is framed or marked, and nothing is labelled with a name or a figure.",
    illustrative: ILL_EN,
  },
  "shopping-centre-zone-anchor-exposure": {
    eyebrow: "Exposure",
    question: "Which areas receive attention, and where do visitors dwell?",
    supporting: "Support tenant conversations, leasing context, events and space planning",
    truth:
      "Exposure is presence inside a mapped zone, not interest and not trade. A busy area is not a good area and a quiet one is not a failure, and an area outside the agreed mapping is unknown rather than empty.",
    coverageNote:
      "Anonymous events, inside mapped zones only. Not unique people, and an area outside the agreed mapping is unknown rather than empty.",
    nextCta: "See brand visits",
    focus: {
      zones: {
        label: "Zones",
        body: "Presence, entries and time within zones provide the physical exposure signal.",
      },
      anchors: {
        label: "Anchors",
        body: "Anchor, tenant, event and zone mapping defines the areas being compared.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Zone presence, entry and time events" },
      { kicker: "Connected", label: "Zone, anchor or boundary mapping" },
      { kicker: "Derived", label: "Exposure rate, reach, dwell and hot/cold areas" },
    ],
    heroCaption: "An area reads as busy or quiet only against the boundaries you agreed.",
    heroAlt:
      "A shopping-centre atrium at dusk on two levels, with anchor storefronts outlined in soft purple light and people walking across the stone floor. Small purple rings sit at the feet of some of them. No face is outlined or marked as measured, and nothing is labelled with a name or a figure.",
    illustrative: ILL_EN,
  },
  "shopping-centre-brand-counting": {
    eyebrow: "Brand visits",
    question: "Which stores or brands are actually visited?",
    supporting: "Understand tenant exposure and brand visitation without assuming tenant sales",
    truth:
      "A brand visit is an anonymous entry across a covered boundary. It is not a sale, not a transaction and not a customer, and a store outside the covered set is not counted at all.",
    coverageNote:
      "Anonymous entries, across covered brand boundaries only. Not unique customers, not sales, not transactions, and a store outside the covered set is not counted.",
    nextCta: "Follow brand flow",
    focus: {
      threshold: {
        label: "The covered threshold",
        body: "Store or brand entry events are counted only within covered boundaries.",
      },
      boundary: {
        label: "The brand boundary",
        body: "Tenant/brand directories and store boundaries give each entry its identity as a covered brand area.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Covered brand entrance or spatial events" },
      { kicker: "Connected", label: "Tenant, brand and boundary mapping" },
      { kicker: "Derived", label: "Brand visits and visit share" },
    ],
    heroCaption: "A visit is counted at a boundary. It says nothing about what happened inside.",
    heroAlt:
      "A shopping-centre gallery with three storefronts, their fascia signage fictional, and people walking past and entering. Soft purple arcs lie on the floor across two of the shop thresholds. No face is outlined and nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },
  "shopping-centre-brand-flow": {
    eyebrow: "Brand flow",
    question: "How do visitors move from one brand to another?",
    supporting: "Inform adjacency, wayfinding, leasing context and tenant conversations",
    truth:
      "A sequence between two covered brands shows that visits happened in an order. It is not an identity, not a recognised shopper and not a cause, and it exists only between brands that are both covered.",
    coverageNote:
      "Anonymous matched visits, between covered brands only. Not an identity and not a cause: an order, not a reason.",
    nextCta: "Understand time in centre",
    focus: {
      between: {
        label: "Between covered brands",
        body: "Anonymous matched visits or transitions are used only between covered brands or zones.",
      },
      covered: {
        label: "A covered brand area",
        body: "Tenant/brand maps and category definitions explain the sequence.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Supported matched brand visits or transitions" },
      { kicker: "Connected", label: "Tenant, brand and boundary mapping" },
      { kicker: "Derived", label: "Brand cross-visitation and common sequences" },
    ],
    heroCaption: "An order between two brands is not a reason for it.",
    heroAlt:
      "A shopping-centre gallery at dusk with storefronts on both sides, their fascia signage fictional, and people walking between them. A soft purple line runs along the floor from one shopfront across the gallery to another, with rings at a few people's feet. No face is outlined and nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },
  "shopping-centre-time-in-centre": {
    eyebrow: "Time in centre",
    question: "How long do visitors stay in the asset?",
    supporting: "Understand depth of visit and operational pressure by period",
    truth:
      "A duration needs either matched anonymous entrance events or a supported continuous journey — one path is enough, and neither covers every visit. A longer visit is not a better visit, and nothing here says why anyone stayed.",
    coverageNote:
      "Anonymous durations, from one supported path only. Not unique people, not every visit, and a longer visit is not a better one.",
    nextCta: "Configure solution",
    focus: {
      measured: {
        label: "One supported path",
        body: "Anonymous entrance events are matched across supported coverage or continuous tracked journeys.",
      },
      connected: {
        label: "Connected by you",
        body: "Event, opening-hours and zone context can segment the time pattern.",
      },
      derived: {
        label: "The distribution",
        body: "Short/long visit and dwell distributions are derived only from supported matching and aligned definitions.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Supported anonymous matched visit events" },
      { kicker: "Connected", label: "Opening hours, events, campaigns or operational context" },
      { kicker: "Derived", label: "Time-in-centre distribution" },
    ],
    heroCaption: "A duration is a span, not a verdict on the visit.",
    heroAlt:
      "A shopping-centre atrium with a lounge area, seating, a tree and an upper level with storefronts whose fascia signage is fictional. Soft purple rings sit on the floor around some of the seating. No face is outlined and nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },
};


const fr: Readonly<Record<string, SceneCopy>> = {
  "shopping-centre-catchment-area": {
    eyebrow: "Zone de chalandise",
    question: "D'où viennent les visiteurs du centre, et qui habite dans cette portée ?",
    supporting: "Orienter le marketing, le positionnement, le contexte locatif et la stratégie de destination",
    truth:
      "Il s'agit d'un contexte de zone agrégé issu d'une source externe approuvée, et non d'une mesure des personnes présentes à vos portes. Les capteurs d'entrée mesurent des visites ; ils ne mesurent pas l'origine, et aucune lecture d'origine n'identifie qui que ce soit.",
    coverageNote:
      "Contexte de zone agrégé, issu d'une source approuvée. Pas une mesure des visiteurs de ce centre, et jamais un substitut à ce qui est mesuré sur le site.",
    nextCta: "Mesurer les arrivées au centre",
    focus: {
      asset: {
        label: "Le site",
        body: "Les visites sur site peuvent ancrer la référence du site, mais les capteurs d'entrée ne mesurent pas l'origine.",
      },
      reach: {
        label: "La portée autour",
        body: "Des sources approuvées de mobilité agrégée, de géolocalisation et d'origine contextuelle décrivent la portée autour du centre.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Référence de visites sur site" },
      { kicker: "Connecté", label: "Mobilité agrégée ou contexte d'origine approuvés" },
      { kicker: "Déduit", label: "Bandes de chalandise, mix d'origine et portée en temps de trajet" },
    ],
    heroCaption: "La portée est un contexte autour du centre, pas un décompte de qui est entré.",
    heroAlt:
      "Une vue aérienne d'un centre commercial et de ses environs au crépuscule, avec des routes, des parkings et des bâtiments éclairés. De doux arcs violets s'écartent du centre à travers la zone environnante, avec quelques petits nœuds. Aucun lieu n'est nommé et rien n'est étiqueté avec un chiffre.",
    illustrative: ILL_FR,
  },
  "shopping-centre-entrances": {
    eyebrow: "Entrées",
    question: "Combien de visiteurs entrent dans le site, par quelles entrées et quand ?",
    supporting: "Planifier l'exploitation, le nettoyage, la sécurité, les horaires et le personnel d'événement",
    truth:
      "Les entrées et sorties sont comptées par entrée, sous forme d'événements anonymes. Une entrée n'est pas un visiteur unique, et seules les entrées configurées sont mesurées.",
    coverageNote:
      "Des événements anonymes, aux seules entrées configurées. Pas des personnes uniques, et une entrée hors du périmètre configuré n'est pas mesurée.",
    nextCta: "Comprendre le mix de visiteurs",
    focus: {
      measured: {
        label: "Mesuré ici",
        body: "Les entrées et sorties sont mesurées par entrée et par tranche horaire.",
      },
      connected: {
        label: "Connecté par vous",
        body: "Les horaires, événements, conditions météo, campagnes et contextes de transport peuvent expliquer les schémas d'arrivée.",
      },
      derived: {
        label: "Déduit des deux",
        body: "La part d'entrée, le rythme de pointe des arrivées et les comparaisons à périmètre constant exigent la série temporelle physique.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Événements d'entrée et de sortie" },
      { kicker: "Connecté", label: "Horaires, événements, campagnes ou contexte d'exploitation" },
      { kicker: "Déduit", label: "Part d'entrée et rythme de pointe des arrivées" },
    ],
    heroCaption: "Une entrée est comptée à une porte, pas attribuée à une personne.",
    heroAlt:
      "Un parvis de centre commercial au crépuscule avec plusieurs entrées vitrées et des personnes qui s'en approchent. De douces lignes violettes courent sur le dallage et convergent vers les portes. Aucun visage n'est détouré ni marqué comme mesuré, et rien n'est étiqueté avec un nom ou un chiffre.",
    illustrative: ILL_FR,
  },
  "shopping-centre-visitor-composition": {
    eyebrow: "Mix de visiteurs",
    question: "Qui entre dans le centre, en groupes de visiteurs anonymes ?",
    supporting: "Comparer le mix de visiteurs par entrée, tranche horaire, événement ou saison",
    truth:
      "Les groupes sont estimés de façon anonyme, et uniquement là où la classification est activée, configurée et autorisée. Personne n'est identifié, aucun individu n'est profilé, et là où elle n'est pas activée il n'y a aucun mix à lire.",
    coverageNote:
      "Estimations de groupes anonymes, uniquement là où la classification est activée, configurée et autorisée. Personne n'est identifié et aucun individu n'est profilé.",
    nextCta: "Suivre la circulation du centre",
    focus: {
      measured: {
        label: "Événements compatibles",
        body: "Les événements de visite en entrée doivent provenir d'une implémentation compatible avec la classification.",
      },
      connected: {
        label: "Autorisé et activé",
        body: "La classification est activée, configurée et autorisée pour le périmètre de centre retenu.",
      },
      derived: {
        label: "Le mix anonyme",
        body: "La taille de groupe, l'unité d'achat et les classifications anonymes autorisées sont estimées à partir des données nommées.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Événements de visite compatibles avec la classification" },
      { kicker: "Connecté", label: "Classification activée, configurée et autorisée" },
      { kicker: "Déduit", label: "Composition anonyme des visiteurs" },
    ],
    heroCaption: "Un groupe est estimé, jamais reconnu.",
    heroAlt:
      "Un parvis de centre commercial au crépuscule avec des personnes se dirigeant vers une entrée vitrée éclairée. De doux anneaux violets reposent sur le dallage aux pieds de certaines d'entre elles. Aucun visage n'est détouré, aucune personne n'est numérotée, et rien n'est étiqueté avec un nom.",
    illustrative: ILL_FR,
  },
  "shopping-centre-internal-circulation": {
    eyebrow: "Circulation",
    question: "Comment les visiteurs se déplacent-ils entre les niveaux, les allées, les zones et les locomotives ?",
    supporting: "Améliorer la signalétique, l'agencement, l'exploitation et la connexion aux locomotives",
    truth:
      "Les événements de mouvement ne sont pas des visiteurs uniques — un visiteur qui monte puis redescend est observé à chaque fois. Le mouvement n'est observé que là où les zones, les allées et les transports verticaux sont configurés.",
    coverageNote:
      "Des événements anonymes, uniquement à l'intérieur de la couverture configurée. Pas des personnes uniques, et rien hors des zones configurées n'est observé.",
    nextCta: "Explorer l'exposition des zones et des locomotives",
    focus: {
      movement: {
        label: "Parcours",
        body: "Les entrées et sorties de zone, les transitions et les trajectoires anonymes fournissent le signal de mouvement.",
      },
      transitions: {
        label: "Niveaux",
        body: "La matrice de flux, la structure des parcours, les déplacements entre niveaux et les goulets d'étranglement exigent des définitions de mouvement et spatiales alignées.",
      },
      distribution: {
        label: "Locomotives",
        body: "Le plan, les niveaux, les allées, les zones, les locomotives et les transports verticaux fournissent le sens spatial.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Trajectoires et transitions spatiales anonymes" },
      { kicker: "Connecté", label: "Plan et définitions spatiales" },
      { kicker: "Déduit", label: "Matrice de flux, structure des parcours et goulets d'étranglement" },
    ],
    heroCaption: "Un parcours ne prend son sens qu'au regard de votre propre plan du centre.",
    heroAlt:
      "Une galerie marchande sur deux niveaux, avec des escalators, des vitrines et des personnes qui marchent. Des lignes violettes discrètes suivent certains parcours au sol. Aucun visage n'est cadré ni marqué, et rien n'est étiqueté avec un nom ou un chiffre.",
    illustrative: ILL_FR,
  },
  "shopping-centre-zone-anchor-exposure": {
    eyebrow: "Exposition",
    question: "Quelles zones reçoivent de l'attention, et où les visiteurs séjournent-ils ?",
    supporting: "Étayer les échanges avec les enseignes, le contexte locatif, les événements et l'aménagement",
    truth:
      "L'exposition est une présence à l'intérieur d'une zone cartographiée, ni un intérêt ni un acte d'achat. Une zone fréquentée n'est pas une bonne zone et une zone calme n'est pas un échec, et une zone hors de la cartographie convenue est inconnue plutôt que vide.",
    coverageNote:
      "Des événements anonymes, uniquement dans les zones cartographiées. Pas des personnes uniques, et une zone hors de la cartographie convenue est inconnue plutôt que vide.",
    nextCta: "Voir les visites par enseigne",
    focus: {
      zones: {
        label: "Zones",
        body: "La présence, les entrées et le temps passé dans les zones fournissent le signal physique d'exposition.",
      },
      anchors: {
        label: "Locomotives",
        body: "La cartographie des locomotives, des enseignes, des événements et des zones définit les zones comparées.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Événements de présence, d'entrée et de temps par zone" },
      { kicker: "Connecté", label: "Cartographie des zones, locomotives ou périmètres" },
      { kicker: "Déduit", label: "Taux d'exposition, portée, temps de présence et zones chaudes ou froides" },
    ],
    heroCaption: "Une zone ne se lit comme fréquentée ou calme qu'au regard des périmètres convenus.",
    heroAlt:
      "Un atrium de centre commercial au crépuscule sur deux niveaux, avec des vitrines de locomotives soulignées d'une lumière violette douce et des personnes qui marchent sur le sol en pierre. De petits anneaux violets se trouvent aux pieds de certaines d'entre elles. Aucun visage n'est détouré ni marqué comme mesuré, et rien n'est étiqueté avec un nom ou un chiffre.",
    illustrative: ILL_FR,
  },
  "shopping-centre-brand-counting": {
    eyebrow: "Visites par enseigne",
    question: "Quelles boutiques ou enseignes sont réellement visitées ?",
    supporting: "Comprendre l'exposition des enseignes et leur fréquentation sans présumer de leurs ventes",
    truth:
      "Une visite d'enseigne est une entrée anonyme franchissant un périmètre couvert. Ce n'est ni une vente, ni une transaction, ni un client, et une boutique hors du périmètre couvert n'est pas comptée du tout.",
    coverageNote:
      "Des entrées anonymes, uniquement à travers des périmètres d'enseigne couverts. Pas des clients uniques, ni ventes ni transactions, et une boutique hors du périmètre couvert n'est pas comptée.",
    nextCta: "Suivre les flux entre enseignes",
    focus: {
      threshold: {
        label: "Le seuil couvert",
        body: "Les événements d'entrée en boutique ou en enseigne ne sont comptés qu'à l'intérieur des périmètres couverts.",
      },
      boundary: {
        label: "Le périmètre d'enseigne",
        body: "Les annuaires d'enseignes et les périmètres de boutique donnent à chaque entrée son identité de zone d'enseigne couverte.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Événements d'entrée ou spatiaux d'enseignes couvertes" },
      { kicker: "Connecté", label: "Cartographie des enseignes, marques et périmètres" },
      { kicker: "Déduit", label: "Visites par enseigne et part de visites" },
    ],
    heroCaption: "Une visite est comptée à un périmètre. Elle ne dit rien de ce qui s'est passé à l'intérieur.",
    heroAlt:
      "Une galerie de centre commercial avec trois vitrines, dont les enseignes sont fictives, et des personnes qui passent et entrent. De doux arcs violets reposent au sol en travers de deux des seuils de boutique. Aucun visage n'est détouré et rien n'est étiqueté avec un chiffre.",
    illustrative: ILL_FR,
  },
  "shopping-centre-brand-flow": {
    eyebrow: "Flux entre enseignes",
    question: "Comment les visiteurs passent-ils d'une enseigne à une autre ?",
    supporting: "Éclairer l'adjacence, la signalétique, le contexte locatif et les échanges avec les enseignes",
    truth:
      "Une séquence entre deux enseignes couvertes montre que des visites ont eu lieu dans un ordre. Ce n'est ni une identité, ni un client reconnu, ni une cause, et elle n'existe qu'entre des enseignes toutes deux couvertes.",
    coverageNote:
      "Des visites anonymes appariées, uniquement entre enseignes couvertes. Ni une identité ni une cause : un ordre, pas une raison.",
    nextCta: "Comprendre le temps passé dans le centre",
    focus: {
      between: {
        label: "Entre enseignes couvertes",
        body: "Les visites ou transitions anonymes appariées ne sont utilisées qu'entre enseignes ou zones couvertes.",
      },
      covered: {
        label: "Une zone d'enseigne couverte",
        body: "Les cartographies d'enseignes et les définitions de catégories expliquent la séquence.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Visites ou transitions d'enseignes appariées et supportées" },
      { kicker: "Connecté", label: "Cartographie des enseignes, marques et périmètres" },
      { kicker: "Déduit", label: "Visites croisées entre enseignes et séquences fréquentes" },
    ],
    heroCaption: "Un ordre entre deux enseignes n'en est pas la raison.",
    heroAlt:
      "Une galerie de centre commercial au crépuscule avec des vitrines de part et d'autre, dont les enseignes sont fictives, et des personnes qui marchent entre elles. Une ligne violette douce court au sol d'une vitrine à une autre en traversant la galerie, avec des anneaux aux pieds de quelques personnes. Aucun visage n'est détouré et rien n'est étiqueté avec un chiffre.",
    illustrative: ILL_FR,
  },
  "shopping-centre-time-in-centre": {
    eyebrow: "Temps dans le centre",
    question: "Combien de temps les visiteurs restent-ils sur le site ?",
    supporting: "Comprendre la profondeur de visite et la pression opérationnelle par période",
    truth:
      "Une durée exige soit des événements d'entrée anonymes appariés, soit un parcours continu supporté — une seule voie suffit, et aucune ne couvre toutes les visites. Une visite plus longue n'est pas une meilleure visite, et rien ici ne dit pourquoi quelqu'un est resté.",
    coverageNote:
      "Des durées anonymes, issues d'une seule voie supportée. Pas des personnes uniques, pas toutes les visites, et une visite plus longue n'est pas une meilleure visite.",
    nextCta: "Configurer la solution",
    focus: {
      measured: {
        label: "Une voie supportée",
        body: "Les événements d'entrée anonymes sont appariés sur la couverture supportée ou sur des parcours suivis en continu.",
      },
      connected: {
        label: "Connecté par vous",
        body: "Le contexte d'événements, d'horaires et de zones peut segmenter le schéma temporel.",
      },
      derived: {
        label: "La distribution",
        body: "Les distributions de visites courtes ou longues et de temps de présence ne sont déduites que d'un appariement supporté et de définitions alignées.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Visites anonymes appariées et supportées" },
      { kicker: "Connecté", label: "Horaires, événements, campagnes ou contexte d'exploitation" },
      { kicker: "Déduit", label: "Distribution du temps passé dans le centre" },
    ],
    heroCaption: "Une durée est un intervalle, pas un jugement sur la visite.",
    heroAlt:
      "Un atrium de centre commercial avec un espace salon, des assises, un arbre et un niveau supérieur bordé de vitrines dont les enseignes sont fictives. De doux anneaux violets reposent au sol autour d'une partie des assises. Aucun visage n'est détouré et rien n'est étiqueté avec un chiffre.",
    illustrative: ILL_FR,
  },
};


const de: Readonly<Record<string, SceneCopy>> = {
  "shopping-centre-catchment-area": {
    eyebrow: "Einzugsgebiet",
    question: "Woher kommen die Besucher des Centers, und wer lebt in dieser Reichweite?",
    supporting: "Marketing, Positionierung, Vermietungskontext und Destinationsstrategie ausrichten",
    truth:
      "Dies ist aggregierter Gebietskontext aus einer freigegebenen externen Quelle und keine Messung der Menschen an Ihren Türen. Eingangssensoren messen Besuche; sie messen keine Herkunft, und keine Herkunftsauswertung identifiziert jemanden.",
    coverageNote:
      "Aggregierter Gebietskontext aus einer freigegebenen Quelle. Keine Messung der eigenen Besucher dieses Centers und niemals ein Ersatz für das, was am Standort gemessen wird.",
    nextCta: "Ankünfte im Center messen",
    focus: {
      asset: {
        label: "Der Standort",
        body: "Besuche vor Ort können die Standort-Basislinie verankern, aber Eingangssensoren messen keine Herkunft.",
      },
      reach: {
        label: "Die Reichweite darum",
        body: "Freigegebene Quellen für aggregierte Mobilität, Geolokalisierung und Herkunftskontext beschreiben die Reichweite rund um das Center.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Basislinie der Besuche vor Ort" },
      { kicker: "Verbunden", label: "Freigegebene aggregierte Mobilität oder Herkunftskontext" },
      { kicker: "Abgeleitet", label: "Einzugsbänder, Herkunftsmix und Fahrzeit-Reichweite" },
    ],
    heroCaption: "Reichweite ist Kontext um das Center herum, keine Zählung derer, die hereinkamen.",
    heroAlt:
      "Eine Luftaufnahme eines Einkaufszentrums und seiner Umgebung in der Dämmerung, mit Straßen, Parkplätzen und beleuchteten Gebäuden. Weiche violette Bögen führen vom Center nach außen über das Umland, mit einigen kleinen Knotenpunkten. Kein Ort ist benannt und nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },
  "shopping-centre-entrances": {
    eyebrow: "Eingänge",
    question: "Wie viele Besucher betreten den Standort, durch welche Eingänge und wann?",
    supporting: "Betrieb, Reinigung, Sicherheit, Öffnungszeiten und Veranstaltungspersonal planen",
    truth:
      "Eintritte und Austritte werden je Eingang als anonyme Ereignisse gezählt. Ein Eintritt ist kein eindeutiger Besucher, und nur die konfigurierten Eingänge werden gemessen.",
    coverageNote:
      "Anonyme Ereignisse, ausschließlich an konfigurierten Eingängen. Keine eindeutigen Personen, und ein Eingang außerhalb des konfigurierten Umfangs wird nicht gemessen.",
    nextCta: "Besuchermix verstehen",
    focus: {
      measured: {
        label: "Hier gemessen",
        body: "Eintritte und Austritte werden je Eingang und Zeitfenster gemessen.",
      },
      connected: {
        label: "Von Ihnen verbunden",
        body: "Öffnungszeiten, Veranstaltungen, Wetter, Kampagnen und Verkehrskontext können Ankunftsmuster erklären.",
      },
      derived: {
        label: "Aus beidem abgeleitet",
        body: "Eingangsanteil, Spitzenrhythmus der Ankünfte und vergleichbare Eingangsmuster erfordern die physische Zeitreihe.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Eingangs-Ein- und -Austrittsereignisse" },
      { kicker: "Verbunden", label: "Öffnungszeiten, Veranstaltungen, Kampagnen oder Betriebskontext" },
      { kicker: "Abgeleitet", label: "Eingangsanteil und Spitzenrhythmus der Ankünfte" },
    ],
    heroCaption: "Ein Eintritt wird an einer Tür gezählt, nicht einer Person zugeordnet.",
    heroAlt:
      "Ein Vorplatz eines Einkaufszentrums in der Dämmerung mit mehreren verglasten Eingängen und Menschen, die darauf zugehen. Weiche violette Linien verlaufen über die Pflasterung und laufen an den Türen zusammen. Kein Gesicht ist umrandet oder als gemessen markiert, und nichts ist mit einem Namen oder einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },
  "shopping-centre-visitor-composition": {
    eyebrow: "Besuchermix",
    question: "Wer betritt das Center, in anonymen Besuchergruppen?",
    supporting: "Besuchermix nach Eingang, Tageszeit, Veranstaltung oder Saison vergleichen",
    truth:
      "Gruppen werden anonym geschätzt, und nur dort, wo Klassifizierung aktiviert, konfiguriert und zulässig ist. Niemand wird identifiziert, keine Person wird profiliert, und wo sie nicht aktiviert ist, gibt es keinen Mix zu lesen.",
    coverageNote:
      "Anonyme Gruppenschätzungen, nur dort, wo Klassifizierung aktiviert, konfiguriert und zulässig ist. Niemand wird identifiziert und keine Person wird profiliert.",
    nextCta: "Zirkulation im Center verfolgen",
    focus: {
      measured: {
        label: "Kompatible Ereignisse",
        body: "Besuchsereignisse am Eingang müssen aus einer klassifizierungskompatiblen Implementierung stammen.",
      },
      connected: {
        label: "Zulässig und aktiviert",
        body: "Die Klassifizierung ist für den gewählten Center-Umfang aktiviert, konfiguriert und zulässig.",
      },
      derived: {
        label: "Der anonyme Mix",
        body: "Gruppengröße, Kaufeinheit und zulässige anonyme Klassifizierungen werden aus den genannten Daten geschätzt.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Klassifizierungskompatible Besuchsereignisse" },
      { kicker: "Verbunden", label: "Aktivierte, konfigurierte und zulässige Klassifizierung" },
      { kicker: "Abgeleitet", label: "Anonyme Besucherzusammensetzung" },
    ],
    heroCaption: "Eine Gruppe wird geschätzt, niemals erkannt.",
    heroAlt:
      "Ein Vorplatz eines Einkaufszentrums in der Dämmerung mit Menschen, die auf einen beleuchteten verglasten Eingang zugehen. Weiche violette Ringe liegen auf der Pflasterung zu den Füßen einiger von ihnen. Kein Gesicht ist umrandet, keine Person ist nummeriert, und nichts ist mit einem Namen beschriftet.",
    illustrative: ILL_DE,
  },
  "shopping-centre-internal-circulation": {
    eyebrow: "Zirkulation",
    question: "Wie bewegen sich Besucher über Ebenen, Gänge, Zonen und Ankermieter hinweg?",
    supporting: "Wegeführung, Layout, Betrieb und Anbindung der Ankermieter verbessern",
    truth:
      "Bewegungsereignisse sind keine eindeutigen Besucher — ein Besucher, der hinauf- und wieder hinuntergeht, wird jedes Mal beobachtet. Bewegung wird nur dort beobachtet, wo Zonen, Gänge und vertikale Verbindungen konfiguriert sind.",
    coverageNote:
      "Anonyme Ereignisse, ausschließlich innerhalb der konfigurierten Abdeckung. Keine eindeutigen Personen, und nichts außerhalb der konfigurierten Bereiche wird beobachtet.",
    nextCta: "Zonen- und Ankermieter-Exposition erkunden",
    focus: {
      movement: {
        label: "Wege",
        body: "Zonenein- und -austritte, Übergänge und anonyme Trajektorien liefern das Bewegungssignal.",
      },
      transitions: {
        label: "Ebenen",
        body: "Flussmatrix, Wegestruktur, Bewegung zwischen Ebenen und Engstellen erfordern abgestimmte Bewegungs- und Raumdefinitionen.",
      },
      distribution: {
        label: "Ankermieter",
        body: "Grundriss, Ebenen, Gänge, Zonen, Ankermieter und vertikale Verbindungen liefern die räumliche Bedeutung.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Anonyme räumliche Trajektorien und Übergänge" },
      { kicker: "Verbunden", label: "Grundriss und Raumdefinitionen" },
      { kicker: "Abgeleitet", label: "Flussmatrix, Wegestruktur und Engstellen" },
    ],
    heroCaption: "Ein Weg bedeutet erst etwas vor dem Hintergrund Ihres eigenen Grundrisses.",
    heroAlt:
      "Eine Einkaufsgalerie auf zwei Ebenen mit Rolltreppen, Schaufenstern und gehenden Personen. Dezente violette Linien folgen einigen der Laufwege am Boden. Kein Gesicht ist eingerahmt oder markiert, und nichts ist mit einem Namen oder einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },
  "shopping-centre-zone-anchor-exposure": {
    eyebrow: "Exposition",
    question: "Welche Bereiche erhalten Aufmerksamkeit, und wo verweilen Besucher?",
    supporting: "Mietergespräche, Vermietungskontext, Veranstaltungen und Flächenplanung unterstützen",
    truth:
      "Exposition ist Anwesenheit innerhalb einer zugeordneten Zone — weder Interesse noch Handel. Ein belebter Bereich ist kein guter Bereich und ein ruhiger kein Versagen, und ein Bereich außerhalb der vereinbarten Zuordnung ist unbekannt und nicht leer.",
    coverageNote:
      "Anonyme Ereignisse, ausschließlich in zugeordneten Zonen. Keine eindeutigen Personen, und ein Bereich außerhalb der vereinbarten Zuordnung ist unbekannt und nicht leer.",
    nextCta: "Markenbesuche ansehen",
    focus: {
      zones: {
        label: "Zonen",
        body: "Anwesenheit, Eintritte und Zeit innerhalb von Zonen liefern das physische Expositionssignal.",
      },
      anchors: {
        label: "Ankermieter",
        body: "Die Zuordnung von Ankermietern, Mietern, Veranstaltungen und Zonen bestimmt, welche Bereiche verglichen werden.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Zonen-Präsenz-, Eintritts- und Zeitereignisse" },
      { kicker: "Verbunden", label: "Zonen-, Ankermieter- oder Grenzzuordnung" },
      { kicker: "Abgeleitet", label: "Expositionsrate, Reichweite, Verweildauer und stark oder schwach frequentierte Bereiche" },
    ],
    heroCaption: "Ein Bereich liest sich erst vor den vereinbarten Grenzen als belebt oder ruhig.",
    heroAlt:
      "Ein Einkaufszentrum-Atrium in der Dämmerung auf zwei Ebenen, mit Schaufenstern von Ankermietern, die in weichem violettem Licht umrandet sind, und Menschen, die über den Steinboden gehen. Kleine violette Ringe liegen zu den Füßen einiger von ihnen. Kein Gesicht ist umrandet oder als gemessen markiert, und nichts ist mit einem Namen oder einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },
  "shopping-centre-brand-counting": {
    eyebrow: "Markenbesuche",
    question: "Welche Geschäfte oder Marken werden tatsächlich besucht?",
    supporting: "Mieter-Exposition und Markenbesuche verstehen, ohne Mieterumsätze anzunehmen",
    truth:
      "Ein Markenbesuch ist ein anonymer Eintritt über eine abgedeckte Grenze. Er ist kein Verkauf, keine Transaktion und kein Kunde, und ein Geschäft außerhalb des abgedeckten Umfangs wird überhaupt nicht gezählt.",
    coverageNote:
      "Anonyme Eintritte, ausschließlich über abgedeckte Markengrenzen. Keine eindeutigen Kunden, keine Verkäufe, keine Transaktionen, und ein Geschäft außerhalb des abgedeckten Umfangs wird nicht gezählt.",
    nextCta: "Markenfluss verfolgen",
    focus: {
      threshold: {
        label: "Die abgedeckte Schwelle",
        body: "Eintrittsereignisse in ein Geschäft oder eine Marke werden nur innerhalb abgedeckter Grenzen gezählt.",
      },
      boundary: {
        label: "Die Markengrenze",
        body: "Mieter- und Markenverzeichnisse sowie Geschäftsgrenzen geben jedem Eintritt seine Identität als abgedeckter Markenbereich.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Abgedeckte Marken-Eintritts- oder Raumereignisse" },
      { kicker: "Verbunden", label: "Mieter-, Marken- und Grenzzuordnung" },
      { kicker: "Abgeleitet", label: "Markenbesuche und Besuchsanteil" },
    ],
    heroCaption: "Ein Besuch wird an einer Grenze gezählt. Er sagt nichts darüber, was drinnen geschah.",
    heroAlt:
      "Eine Einkaufsgalerie mit drei Schaufenstern, deren Beschilderung fiktiv ist, und Menschen, die vorbeigehen und eintreten. Weiche violette Bögen liegen am Boden quer über zwei der Ladenschwellen. Kein Gesicht ist umrandet und nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },
  "shopping-centre-brand-flow": {
    eyebrow: "Markenfluss",
    question: "Wie bewegen sich Besucher von einer Marke zur nächsten?",
    supporting: "Adjazenz, Wegeführung, Vermietungskontext und Mietergespräche fundieren",
    truth:
      "Eine Abfolge zwischen zwei abgedeckten Marken zeigt, dass Besuche in einer Reihenfolge stattfanden. Sie ist keine Identität, kein wiedererkannter Kunde und keine Ursache, und sie existiert nur zwischen Marken, die beide abgedeckt sind.",
    coverageNote:
      "Anonyme zugeordnete Besuche, ausschließlich zwischen abgedeckten Marken. Keine Identität und keine Ursache: eine Reihenfolge, kein Grund.",
    nextCta: "Verweildauer im Center verstehen",
    focus: {
      between: {
        label: "Zwischen abgedeckten Marken",
        body: "Anonyme zugeordnete Besuche oder Übergänge werden nur zwischen abgedeckten Marken oder Zonen verwendet.",
      },
      covered: {
        label: "Ein abgedeckter Markenbereich",
        body: "Marken- und Mieterzuordnungen sowie Kategoriedefinitionen erklären die Abfolge.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Unterstützte zugeordnete Markenbesuche oder Übergänge" },
      { kicker: "Verbunden", label: "Mieter-, Marken- und Grenzzuordnung" },
      { kicker: "Abgeleitet", label: "Marken-Kreuzbesuche und häufige Abfolgen" },
    ],
    heroCaption: "Eine Reihenfolge zwischen zwei Marken ist noch kein Grund dafür.",
    heroAlt:
      "Eine Einkaufsgalerie in der Dämmerung mit Schaufenstern zu beiden Seiten, deren Beschilderung fiktiv ist, und Menschen, die dazwischen gehen. Eine weiche violette Linie verläuft am Boden von einem Schaufenster quer durch die Galerie zu einem anderen, mit Ringen zu den Füßen einiger Personen. Kein Gesicht ist umrandet und nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },
  "shopping-centre-time-in-centre": {
    eyebrow: "Verweildauer",
    question: "Wie lange bleiben Besucher am Standort?",
    supporting: "Besuchstiefe und betrieblichen Druck je Zeitraum verstehen",
    truth:
      "Eine Dauer erfordert entweder zugeordnete anonyme Eingangsereignisse oder einen unterstützten durchgehenden Weg — ein Pfad genügt, und keiner deckt jeden Besuch ab. Ein längerer Besuch ist kein besserer Besuch, und nichts hier sagt, warum jemand geblieben ist.",
    coverageNote:
      "Anonyme Dauern aus nur einem unterstützten Pfad. Keine eindeutigen Personen, nicht jeder Besuch, und ein längerer Besuch ist kein besserer.",
    nextCta: "Lösung konfigurieren",
    focus: {
      measured: {
        label: "Ein unterstützter Pfad",
        body: "Anonyme Eingangsereignisse werden über die unterstützte Abdeckung oder über durchgehend verfolgte Wege zugeordnet.",
      },
      connected: {
        label: "Von Ihnen verbunden",
        body: "Veranstaltungs-, Öffnungszeiten- und Zonenkontext kann das Zeitmuster segmentieren.",
      },
      derived: {
        label: "Die Verteilung",
        body: "Verteilungen kurzer und langer Besuche sowie der Verweildauer werden nur aus unterstützter Zuordnung und abgestimmten Definitionen abgeleitet.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Unterstützte anonyme zugeordnete Besuchsereignisse" },
      { kicker: "Verbunden", label: "Öffnungszeiten, Veranstaltungen, Kampagnen oder Betriebskontext" },
      { kicker: "Abgeleitet", label: "Verteilung der Verweildauer im Center" },
    ],
    heroCaption: "Eine Dauer ist eine Spanne, kein Urteil über den Besuch.",
    heroAlt:
      "Ein Einkaufszentrum-Atrium mit Lounge-Bereich, Sitzgelegenheiten, einem Baum und einer oberen Ebene mit Schaufenstern, deren Beschilderung fiktiv ist. Weiche violette Ringe liegen am Boden um einen Teil der Sitzgelegenheiten. Kein Gesicht ist umrandet und nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },
};

export const sceneCopy: Readonly<Record<Locale, Readonly<Record<string, SceneCopy>>>> = { en, fr, de };
