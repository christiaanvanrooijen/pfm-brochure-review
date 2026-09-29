/**
 * Display copy for the six QSR Core scenes, resolved by SceneId.
 *
 * HOW THIS WAS WRITTEN
 *
 * Every question, supporting line and next CTA is the typed model's own, read
 * from `app/content/segments/qsr.ts` — never recalled, and never inferred from
 * an asset filename. Every focus body is the wording of one typed evidence
 * cluster on that scene, in the order measured -> connected -> derived.
 *
 * The `sequence` rail carries ONE entry per evidence kind the scene actually
 * declares. Queue and Order have no connected cluster, so their rails have two
 * steps rather than an invented third: an empty "Connected" column would imply
 * a context input the model does not ask for.
 *
 * The truth lines and coverage notes are the only sentences authored here. Each
 * states a boundary this segment's model implies, and four of them exist to stop
 * a specific misreading the artwork invites:
 *
 *   queue       spacing between vehicles is drawn, not measured
 *   bottleneck  the contrasting areas are a stage comparison, not a lane plan
 *               and not a cause
 *   respond     a crew member is a role in the loop, not a measured subject
 *   estate      a comparison is not a benchmark
 *
 * Drive-thru context is not restated here. It is the same scene the QSR segment
 * start already opens on, so it is re-exported from `starts.ts` — one scene, one
 * copy, no drift.
 */

import type { Locale } from "./locales.ts";
import type { SceneCopy } from "./messages.ts";
import { startCopy } from "./starts.ts";

/** The typed Core route, in `coreRoute` order. */
export const qsrCoreRoute: readonly string[] = [
  "qsr-drive-thru-context",
  "qsr-queue",
  "qsr-order",
  "qsr-bottleneck",
  "qsr-respond",
  "qsr-estate",
];

/** Focus ids per scene, in typed evidence order. */
export const qsrFocusOrder: Readonly<Record<string, readonly string[]>> = {
  "qsr-drive-thru-context": ["measured", "connected", "derived"],
  "qsr-queue": ["measured", "derived", "driveOff"],
  "qsr-order": ["stagePoints", "communication", "stageTime"],
  "qsr-bottleneck": ["measured", "connected", "derived"],
  "qsr-respond": ["measured", "connected", "derived"],
  "qsr-estate": ["measured", "connected", "derived"],
};

const ILL_EN = "Illustrative visual · not customer data";
const ILL_FR = "Visuel illustratif · pas des données client";
const ILL_DE = "Illustrative Darstellung · keine Kundendaten";

const en: Readonly<Record<string, SceneCopy>> = {
  "qsr-queue": {
    eyebrow: "Measure · Queue",
    question: "How long are guests waiting before they can even order?",
    supporting:
      "Total service time hides where friction starts; queue time can reveal capacity pressure earlier",
    truth:
      "Queue time is measured between a defined queue start and the order point. It is never inferred from total lane time, and a vehicle leaving the lane is known only where the configured implementation can actually determine it.",
    coverageNote:
      "Timing exists only between configured points. The spacing drawn between vehicles here is illustrative, not a measured value.",
    nextCta: "Move to the order point",
    focus: {
      measured: {
        label: "The measured boundary",
        body: "Detections at the defined queue start and the order point provide the measured queue boundary.",
      },
      derived: {
        label: "Queue time",
        body: "Queue time requires a defined queue start and a defined queue end or order-point detection; it is never inferred from total lane time.",
      },
      driveOff: {
        label: "Drive-off",
        body: "Drive-off remains unavailable unless the configured detection or vision implementation can actually determine it.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Detections at the queue start and the order point" },
      { kicker: "Derived", label: "Queue time, and drive-off only where it can be determined" },
    ],
    heroCaption: "Queue time ends where ordering begins, not where the lane does.",
    heroAlt:
      "Vehicles queue in one drive-thru lane at dusk, approaching a menu board and order point ahead. A soft purple pool sits under each vehicle and small chevron markers sit in the gaps between them. Nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },

  "qsr-order": {
    eyebrow: "Measure · Order",
    question: "How much time is lost when guest and crew cannot hear each other clearly?",
    supporting: "Ordering is an operational moment and a communication moment at the same time",
    truth:
      "A stage time exists only between two compatible configured detection points. Communication events are measured by the configured platform, which records that an exchange happened — not what was said, and not who said it.",
    coverageNote:
      "The order point is equipment, and what is measured here is the stage between configured points. No one at the window is identified.",
    nextCta: "Diagnose the bottleneck",
    focus: {
      stagePoints: {
        label: "The configured points",
        body: "Order-point and payment detections provide the two compatible configured points a stage time requires.",
      },
      communication: {
        label: "The communication",
        body: "Drive-thru and crew communication events are measured by the configured communication platform.",
      },
      stageTime: {
        label: "Stage time",
        body: "Stage time is only calculated between two compatible configured detection points.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Order-point and payment detections, and communication events" },
      { kicker: "Derived", label: "Stage time between two compatible configured points" },
    ],
    heroCaption: "Ordering is one stage between two configured points, and one conversation.",
    heroAlt:
      "A vehicle stopped beside a drive-thru order post at dusk, with the driver's window open towards it. A soft purple waveform runs from the window to the post. Nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },

  "qsr-bottleneck": {
    eyebrow: "Understand · Bottleneck",
    question: "Where is today's lost time actually coming from?",
    supporting: "See where time accumulates across stages instead of reading one final average",
    truth:
      "A bottleneck is an interpretation of measured stage time. It shows where time accumulates; it does not establish why. The goal it is read against is a configured operational target, not a measured value.",
    coverageNote:
      "The contrasting areas here are a conceptual comparison of configured stages — not a lane layout, and not a diagnosis of cause.",
    nextCta: "Close the loop with the crew",
    focus: {
      measured: {
        label: "Every stage point",
        body: "Detections at every configured stage point provide the measured stage durations.",
      },
      connected: {
        label: "The configured goal",
        body: "The service goal against which variance is expressed is a configured operational target.",
      },
      derived: {
        label: "The bottleneck",
        body: "The bottleneck stage and its goal variance are interpretations of measured stage time; they do not establish an operational cause.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Detections at every configured stage point" },
      { kicker: "Connected", label: "The configured service goal" },
      { kicker: "Derived", label: "Bottleneck stage and goal variance, as interpretations" },
    ],
    heroCaption: "Where time accumulates is a question, not yet an answer.",
    heroAlt:
      "An elevated view of a drive-thru restaurant at dusk with vehicles along the lane. One group of service stages is washed in soft purple and one stage is washed in contrasting red. Nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },

  "qsr-respond": {
    eyebrow: "Understand · Respond",
    question: "Can the right person know before the queue becomes the problem?",
    supporting: "Insight is only valuable when it reaches the person who can change the outcome",
    truth:
      "An alert reaches a person; it does not produce the outcome. Thresholds are configured operational targets, and the loop needs both a timer event and a compatible communication configuration.",
    coverageNote:
      "Nobody in this picture is identified. A crew member appears here as a role in the loop, never as a measured subject.",
    nextCta: "Compare the estate",
    focus: {
      measured: {
        label: "The events",
        body: "Timer threshold events and crew communication events are measured by the configured system.",
      },
      connected: {
        label: "The thresholds",
        body: "Alert thresholds are configured operational targets, not measured values.",
      },
      derived: {
        label: "The closed loop",
        body: "The closed loop — detect, understand, alert, act — requires both a timer alert event and a compatible communication configuration.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Timer threshold events and crew communication events" },
      { kicker: "Connected", label: "Configured alert thresholds" },
      { kicker: "Derived", label: "The closed loop: detect, understand, alert, act" },
    ],
    heroCaption: "An alert can reach someone in time. It cannot act for them.",
    heroAlt:
      "A vehicle waits at a drive-thru service window at dusk while a crew member wearing a headset stands inside. A soft purple link runs between them and an amber indicator sits at the earpiece. Nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },

  "qsr-estate": {
    eyebrow: "Prove · Estate",
    question: "Which restaurants are converting the same demand into faster service?",
    supporting: "Compare restaurants on comparable definitions, periods and dayparts",
    truth:
      "A comparison is only as sound as the definitions under it. Restaurant identity, hierarchy, goals and periods are supplied by the operation, and the timer supplies no revenue, order value or labour figure at all.",
    coverageNote:
      "Comparison requires several restaurants on compatible definitions and a comparable period or daypart. Nothing here is a benchmark or an external claim.",
    nextCta: "Configure the drive-thru performance view",
    focus: {
      measured: {
        label: "What every site provides",
        body: "Comparable measured timing and vehicle counts are required from every compared restaurant.",
      },
      connected: {
        label: "What the operation supplies",
        body: "Restaurant identity, hierarchy, goals, daypart and period definitions are supplied by the operation.",
      },
      derived: {
        label: "The comparison",
        body: "Estate comparison requires multiple restaurants, compatible metric definitions and a comparable period or daypart.",
      },
    },
    sequence: [
      { kicker: "Measured", label: "Comparable timing and vehicle counts from every restaurant" },
      { kicker: "Connected", label: "Restaurant identity, hierarchy, goals and period definitions" },
      { kicker: "Derived", label: "Estate comparison on compatible definitions" },
    ],
    heroCaption: "Restaurants only compare where the definitions underneath them do.",
    heroAlt:
      "Several drive-thru restaurants across one landscape at dusk, each with vehicles at its lane. A restrained purple line links them to one another. No place is named and nothing is labelled with a figure.",
    illustrative: ILL_EN,
  },
};

const fr: Readonly<Record<string, SceneCopy>> = {
  "qsr-queue": {
    eyebrow: "Mesurer · File",
    question: "Combien de temps les clients attendent-ils avant même de pouvoir commander ?",
    supporting:
      "Le temps de service total masque où naît la friction ; le temps de file peut révéler plus tôt une pression sur la capacité",
    truth:
      "Le temps de file est mesuré entre un début de file défini et le point de commande. Il n'est jamais déduit du temps total de voie, et un véhicule qui quitte la voie n'est connu que là où l'implémentation configurée peut réellement le déterminer.",
    coverageNote:
      "Le chronométrage n'existe qu'entre des points configurés. L'espacement dessiné ici entre les véhicules est illustratif, pas une valeur mesurée.",
    nextCta: "Passer au point de commande",
    focus: {
      measured: {
        label: "La limite mesurée",
        body: "Les détections au début de file défini et au point de commande fournissent la limite de file mesurée.",
      },
      derived: {
        label: "Temps de file",
        body: "Le temps de file exige un début de file défini et une fin de file définie ou une détection au point de commande ; il n'est jamais déduit du temps total de voie.",
      },
      driveOff: {
        label: "Départ sans commande",
        body: "Le départ sans commande reste indisponible tant que l'implémentation de détection ou de vision configurée ne peut pas réellement le déterminer.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Détections au début de file et au point de commande" },
      { kicker: "Déduit", label: "Temps de file, et départ sans commande uniquement là où il est déterminable" },
    ],
    heroCaption: "Le temps de file s'arrête là où la commande commence, pas là où la voie s'arrête.",
    heroAlt:
      "Des véhicules font la file dans une voie de drive au crépuscule, en approche d'un panneau de menu et d'un point de commande. Une douce nappe violette se trouve sous chaque véhicule et de petits chevrons occupent les intervalles entre eux. Rien n'est étiqueté d'un chiffre.",
    illustrative: ILL_FR,
  },

  "qsr-order": {
    eyebrow: "Mesurer · Commande",
    question: "Combien de temps perd-on quand le client et l'équipe ne s'entendent pas clairement ?",
    supporting: "Commander est à la fois un moment opérationnel et un moment de communication",
    truth:
      "Un temps d'étape n'existe qu'entre deux points de détection configurés compatibles. Les événements de communication sont mesurés par la plateforme configurée, qui enregistre qu'un échange a eu lieu — pas ce qui a été dit, ni par qui.",
    coverageNote:
      "Le point de commande est un équipement, et ce qui est mesuré ici est l'étape entre des points configurés. Personne à la fenêtre n'est identifié.",
    nextCta: "Diagnostiquer le goulot d'étranglement",
    focus: {
      stagePoints: {
        label: "Les points configurés",
        body: "Les détections au point de commande et au paiement fournissent les deux points configurés compatibles qu'exige un temps d'étape.",
      },
      communication: {
        label: "La communication",
        body: "Les événements de communication du drive et de l'équipe sont mesurés par la plateforme de communication configurée.",
      },
      stageTime: {
        label: "Temps d'étape",
        body: "Le temps d'étape n'est calculé qu'entre deux points de détection configurés compatibles.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Détections au point de commande et au paiement, et événements de communication" },
      { kicker: "Déduit", label: "Temps d'étape entre deux points configurés compatibles" },
    ],
    heroCaption: "Commander, c'est une étape entre deux points configurés, et une conversation.",
    heroAlt:
      "Un véhicule à l'arrêt près d'une borne de commande de drive au crépuscule, vitre conducteur ouverte vers elle. Une douce forme d'onde violette relie la vitre à la borne. Rien n'est étiqueté d'un chiffre.",
    illustrative: ILL_FR,
  },

  "qsr-bottleneck": {
    eyebrow: "Comprendre · Goulot",
    question: "D'où vient réellement le temps perdu aujourd'hui ?",
    supporting: "Voir où le temps s'accumule entre les étapes plutôt que lire une seule moyenne finale",
    truth:
      "Un goulot d'étranglement est une interprétation du temps d'étape mesuré. Il montre où le temps s'accumule ; il n'établit pas pourquoi. L'objectif auquel il est comparé est une cible opérationnelle configurée, pas une valeur mesurée.",
    coverageNote:
      "Les zones contrastées ici sont une comparaison conceptuelle d'étapes configurées — ni un plan de voie, ni un diagnostic de cause.",
    nextCta: "Boucler la boucle avec l'équipe",
    focus: {
      measured: {
        label: "Chaque point d'étape",
        body: "Les détections à chaque point d'étape configuré fournissent les durées d'étape mesurées.",
      },
      connected: {
        label: "L'objectif configuré",
        body: "L'objectif de service auquel l'écart est rapporté est une cible opérationnelle configurée.",
      },
      derived: {
        label: "Le goulot",
        body: "L'étape en goulot et son écart à l'objectif sont des interprétations du temps d'étape mesuré ; elles n'établissent pas de cause opérationnelle.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Détections à chaque point d'étape configuré" },
      { kicker: "Connecté", label: "L'objectif de service configuré" },
      { kicker: "Déduit", label: "Étape en goulot et écart à l'objectif, comme interprétations" },
    ],
    heroCaption: "Là où le temps s'accumule est une question, pas encore une réponse.",
    heroAlt:
      "Vue en surplomb d'un restaurant drive au crépuscule, véhicules le long de la voie. Un groupe d'étapes de service est baigné de violet doux et une étape est baignée de rouge contrasté. Rien n'est étiqueté d'un chiffre.",
    illustrative: ILL_FR,
  },

  "qsr-respond": {
    eyebrow: "Comprendre · Réagir",
    question: "La bonne personne peut-elle savoir avant que la file ne devienne le problème ?",
    supporting: "Une information n'a de valeur que si elle atteint la personne qui peut changer l'issue",
    truth:
      "Une alerte atteint une personne ; elle ne produit pas l'issue. Les seuils sont des cibles opérationnelles configurées, et la boucle exige à la fois un événement de chronomètre et une configuration de communication compatible.",
    coverageNote:
      "Personne sur cette image n'est identifié. Un membre d'équipe y figure comme un rôle dans la boucle, jamais comme un sujet mesuré.",
    nextCta: "Comparer le parc",
    focus: {
      measured: {
        label: "Les événements",
        body: "Les événements de seuil du chronomètre et les événements de communication de l'équipe sont mesurés par le système configuré.",
      },
      connected: {
        label: "Les seuils",
        body: "Les seuils d'alerte sont des cibles opérationnelles configurées, pas des valeurs mesurées.",
      },
      derived: {
        label: "La boucle fermée",
        body: "La boucle fermée — détecter, comprendre, alerter, agir — exige à la fois un événement d'alerte du chronomètre et une configuration de communication compatible.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Événements de seuil du chronomètre et de communication de l'équipe" },
      { kicker: "Connecté", label: "Seuils d'alerte configurés" },
      { kicker: "Déduit", label: "La boucle fermée : détecter, comprendre, alerter, agir" },
    ],
    heroCaption: "Une alerte peut atteindre quelqu'un à temps. Elle ne peut pas agir à sa place.",
    heroAlt:
      "Un véhicule attend à une fenêtre de service de drive au crépuscule tandis qu'un membre d'équipe portant un casque se tient à l'intérieur. Un lien violet doux les relie et un indicateur ambre se trouve à l'oreillette. Rien n'est étiqueté d'un chiffre.",
    illustrative: ILL_FR,
  },

  "qsr-estate": {
    eyebrow: "Prouver · Parc",
    question: "Quels restaurants transforment la même demande en service plus rapide ?",
    supporting: "Comparer les restaurants sur des définitions, périodes et plages horaires comparables",
    truth:
      "Une comparaison ne vaut que ce que valent les définitions qui la soutiennent. L'identité des restaurants, la hiérarchie, les objectifs et les périodes sont fournis par l'exploitation, et le chronomètre ne fournit aucun chiffre de revenu, de panier ni de main-d'œuvre.",
    coverageNote:
      "La comparaison exige plusieurs restaurants sur des définitions compatibles et une période ou plage horaire comparable. Rien ici n'est une référence ni une affirmation externe.",
    nextCta: "Configurer la vue de performance du drive",
    focus: {
      measured: {
        label: "Ce que fournit chaque site",
        body: "Un chronométrage mesuré et des comptages de véhicules comparables sont exigés de chaque restaurant comparé.",
      },
      connected: {
        label: "Ce que fournit l'exploitation",
        body: "L'identité des restaurants, la hiérarchie, les objectifs, les plages horaires et les définitions de période sont fournis par l'exploitation.",
      },
      derived: {
        label: "La comparaison",
        body: "La comparaison de parc exige plusieurs restaurants, des définitions de métriques compatibles et une période ou plage horaire comparable.",
      },
    },
    sequence: [
      { kicker: "Mesuré", label: "Chronométrage et comptages comparables de chaque restaurant" },
      { kicker: "Connecté", label: "Identité, hiérarchie, objectifs et définitions de période" },
      { kicker: "Déduit", label: "Comparaison de parc sur définitions compatibles" },
    ],
    heroCaption: "Les restaurants ne se comparent que là où leurs définitions se comparent.",
    heroAlt:
      "Plusieurs restaurants drive répartis dans un même paysage au crépuscule, chacun avec des véhicules sur sa voie. Une ligne violette sobre les relie entre eux. Aucun lieu n'est nommé et rien n'est étiqueté d'un chiffre.",
    illustrative: ILL_FR,
  },
};

const de: Readonly<Record<string, SceneCopy>> = {
  "qsr-queue": {
    eyebrow: "Messen · Warteschlange",
    question: "Wie lange warten Gäste, bevor sie überhaupt bestellen können?",
    supporting:
      "Die Gesamtservicezeit verdeckt, wo Reibung entsteht; die Wartezeit kann Kapazitätsdruck früher zeigen",
    truth:
      "Die Wartezeit wird zwischen einem definierten Warteschlangenbeginn und dem Bestellpunkt gemessen. Sie wird niemals aus der Gesamtspurzeit abgeleitet, und ein Fahrzeug, das die Spur verlässt, ist nur dort bekannt, wo die konfigurierte Implementierung das tatsächlich bestimmen kann.",
    coverageNote:
      "Zeitmessung existiert nur zwischen konfigurierten Punkten. Der hier gezeichnete Abstand zwischen den Fahrzeugen ist illustrativ, kein gemessener Wert.",
    nextCta: "Weiter zum Bestellpunkt",
    focus: {
      measured: {
        label: "Die gemessene Grenze",
        body: "Erkennungen am definierten Warteschlangenbeginn und am Bestellpunkt liefern die gemessene Warteschlangengrenze.",
      },
      derived: {
        label: "Wartezeit",
        body: "Wartezeit erfordert einen definierten Warteschlangenbeginn und ein definiertes Ende oder eine Erkennung am Bestellpunkt; sie wird niemals aus der Gesamtspurzeit abgeleitet.",
      },
      driveOff: {
        label: "Abfahrt ohne Bestellung",
        body: "Abfahrt ohne Bestellung bleibt nicht verfügbar, solange die konfigurierte Erkennungs- oder Vision-Implementierung sie nicht tatsächlich bestimmen kann.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Erkennungen am Warteschlangenbeginn und am Bestellpunkt" },
      { kicker: "Abgeleitet", label: "Wartezeit, und Abfahrt ohne Bestellung nur dort, wo bestimmbar" },
    ],
    heroCaption: "Die Wartezeit endet dort, wo das Bestellen beginnt — nicht dort, wo die Spur endet.",
    heroAlt:
      "Fahrzeuge warten in einer Drive-Thru-Spur in der Dämmerung und nähern sich einer Menütafel und einem Bestellpunkt. Unter jedem Fahrzeug liegt eine weiche violette Fläche, und kleine Winkelmarken liegen in den Lücken dazwischen. Nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },

  "qsr-order": {
    eyebrow: "Messen · Bestellung",
    question: "Wie viel Zeit geht verloren, wenn Gast und Team einander nicht klar verstehen?",
    supporting: "Bestellen ist zugleich ein betrieblicher und ein kommunikativer Moment",
    truth:
      "Eine Stufenzeit existiert nur zwischen zwei kompatiblen konfigurierten Erkennungspunkten. Kommunikationsereignisse werden von der konfigurierten Plattform gemessen, die festhält, dass ein Austausch stattfand — nicht, was gesagt wurde, und nicht, von wem.",
    coverageNote:
      "Der Bestellpunkt ist Technik, und gemessen wird hier die Stufe zwischen konfigurierten Punkten. Niemand am Fenster wird identifiziert.",
    nextCta: "Den Engpass diagnostizieren",
    focus: {
      stagePoints: {
        label: "Die konfigurierten Punkte",
        body: "Erkennungen am Bestellpunkt und an der Zahlung liefern die zwei kompatiblen konfigurierten Punkte, die eine Stufenzeit erfordert.",
      },
      communication: {
        label: "Die Kommunikation",
        body: "Kommunikationsereignisse im Drive-Thru und im Team werden von der konfigurierten Kommunikationsplattform gemessen.",
      },
      stageTime: {
        label: "Stufenzeit",
        body: "Stufenzeit wird nur zwischen zwei kompatiblen konfigurierten Erkennungspunkten berechnet.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Erkennungen an Bestellpunkt und Zahlung sowie Kommunikationsereignisse" },
      { kicker: "Abgeleitet", label: "Stufenzeit zwischen zwei kompatiblen konfigurierten Punkten" },
    ],
    heroCaption: "Bestellen ist eine Stufe zwischen zwei konfigurierten Punkten — und ein Gespräch.",
    heroAlt:
      "Ein Fahrzeug steht in der Dämmerung an einer Drive-Thru-Bestellsäule, das Fahrerfenster ihr zugewandt und geöffnet. Eine weiche violette Wellenform verläuft vom Fenster zur Säule. Nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },

  "qsr-bottleneck": {
    eyebrow: "Verstehen · Engpass",
    question: "Woher kommt die heute verlorene Zeit tatsächlich?",
    supporting: "Sehen, wo sich Zeit über die Stufen hinweg ansammelt, statt einen einzigen Endmittelwert zu lesen",
    truth:
      "Ein Engpass ist eine Interpretation gemessener Stufenzeit. Er zeigt, wo sich Zeit ansammelt; er begründet nicht, warum. Das Ziel, an dem er gelesen wird, ist ein konfigurierter betrieblicher Sollwert, kein gemessener Wert.",
    coverageNote:
      "Die kontrastierenden Flächen hier sind ein konzeptioneller Vergleich konfigurierter Stufen — kein Spurlayout und keine Ursachendiagnose.",
    nextCta: "Den Kreis mit dem Team schließen",
    focus: {
      measured: {
        label: "Jeder Stufenpunkt",
        body: "Erkennungen an jedem konfigurierten Stufenpunkt liefern die gemessenen Stufendauern.",
      },
      connected: {
        label: "Das konfigurierte Ziel",
        body: "Das Serviceziel, gegen das die Abweichung ausgedrückt wird, ist ein konfigurierter betrieblicher Sollwert.",
      },
      derived: {
        label: "Der Engpass",
        body: "Die Engpassstufe und ihre Zielabweichung sind Interpretationen gemessener Stufenzeit; sie begründen keine betriebliche Ursache.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Erkennungen an jedem konfigurierten Stufenpunkt" },
      { kicker: "Verbunden", label: "Das konfigurierte Serviceziel" },
      { kicker: "Abgeleitet", label: "Engpassstufe und Zielabweichung als Interpretationen" },
    ],
    heroCaption: "Wo sich Zeit ansammelt, ist eine Frage — noch keine Antwort.",
    heroAlt:
      "Erhöhte Ansicht eines Drive-Thru-Restaurants in der Dämmerung mit Fahrzeugen entlang der Spur. Eine Gruppe von Servicestufen liegt in weichem Violett, eine Stufe in kontrastierendem Rot. Nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },

  "qsr-respond": {
    eyebrow: "Verstehen · Reagieren",
    question: "Kann die richtige Person es wissen, bevor die Warteschlange zum Problem wird?",
    supporting: "Eine Erkenntnis ist nur wertvoll, wenn sie die Person erreicht, die das Ergebnis ändern kann",
    truth:
      "Eine Meldung erreicht eine Person; sie erzeugt nicht das Ergebnis. Schwellenwerte sind konfigurierte betriebliche Sollwerte, und der Kreis erfordert sowohl ein Timer-Ereignis als auch eine kompatible Kommunikationskonfiguration.",
    coverageNote:
      "Niemand auf diesem Bild wird identifiziert. Ein Teammitglied erscheint hier als Rolle im Kreislauf, nie als gemessenes Subjekt.",
    nextCta: "Das Portfolio vergleichen",
    focus: {
      measured: {
        label: "Die Ereignisse",
        body: "Timer-Schwellenereignisse und Kommunikationsereignisse des Teams werden vom konfigurierten System gemessen.",
      },
      connected: {
        label: "Die Schwellenwerte",
        body: "Meldungsschwellen sind konfigurierte betriebliche Sollwerte, keine gemessenen Werte.",
      },
      derived: {
        label: "Der geschlossene Kreis",
        body: "Der geschlossene Kreis — erkennen, verstehen, melden, handeln — erfordert sowohl ein Timer-Meldeereignis als auch eine kompatible Kommunikationskonfiguration.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Timer-Schwellenereignisse und Kommunikationsereignisse des Teams" },
      { kicker: "Verbunden", label: "Konfigurierte Meldungsschwellen" },
      { kicker: "Abgeleitet", label: "Der geschlossene Kreis: erkennen, verstehen, melden, handeln" },
    ],
    heroCaption: "Eine Meldung kann jemanden rechtzeitig erreichen. Handeln kann sie nicht.",
    heroAlt:
      "Ein Fahrzeug wartet in der Dämmerung an einem Drive-Thru-Servicefenster, während drinnen ein Teammitglied mit Headset steht. Eine weiche violette Verbindung läuft zwischen ihnen, und am Ohrstück liegt ein bernsteinfarbener Hinweis. Nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },

  "qsr-estate": {
    eyebrow: "Belegen · Portfolio",
    question: "Welche Restaurants setzen dieselbe Nachfrage in schnelleren Service um?",
    supporting: "Restaurants auf vergleichbaren Definitionen, Zeiträumen und Tagesabschnitten vergleichen",
    truth:
      "Ein Vergleich taugt nur so viel wie die Definitionen darunter. Restaurantidentität, Hierarchie, Ziele und Zeiträume werden vom Betrieb geliefert, und der Timer liefert überhaupt keine Umsatz-, Bonwert- oder Personalkennzahl.",
    coverageNote:
      "Der Vergleich erfordert mehrere Restaurants auf kompatiblen Definitionen und einen vergleichbaren Zeitraum oder Tagesabschnitt. Nichts hier ist ein Benchmark oder eine externe Aussage.",
    nextCta: "Die Drive-Thru-Performance-Ansicht konfigurieren",
    focus: {
      measured: {
        label: "Was jeder Standort liefert",
        body: "Vergleichbare gemessene Zeitmessung und Fahrzeugzählungen werden von jedem verglichenen Restaurant benötigt.",
      },
      connected: {
        label: "Was der Betrieb liefert",
        body: "Restaurantidentität, Hierarchie, Ziele, Tagesabschnitts- und Zeitraumdefinitionen werden vom Betrieb geliefert.",
      },
      derived: {
        label: "Der Vergleich",
        body: "Ein Portfoliovergleich erfordert mehrere Restaurants, kompatible Metrikdefinitionen und einen vergleichbaren Zeitraum oder Tagesabschnitt.",
      },
    },
    sequence: [
      { kicker: "Gemessen", label: "Vergleichbare Zeitmessung und Fahrzeugzählungen jedes Restaurants" },
      { kicker: "Verbunden", label: "Identität, Hierarchie, Ziele und Zeitraumdefinitionen" },
      { kicker: "Abgeleitet", label: "Portfoliovergleich auf kompatiblen Definitionen" },
    ],
    heroCaption: "Restaurants vergleichen sich nur dort, wo ihre Definitionen es tun.",
    heroAlt:
      "Mehrere Drive-Thru-Restaurants in einer Landschaft in der Dämmerung, jedes mit Fahrzeugen an seiner Spur. Eine zurückhaltende violette Linie verbindet sie miteinander. Kein Ort ist benannt und nichts ist mit einer Zahl beschriftet.",
    illustrative: ILL_DE,
  },
};

/**
 * Journey copy per locale. Drive-thru context comes from the segment start's
 * own copy for that scene rather than being restated.
 */
export const qsrJourneyCopy: Readonly<Record<Locale, Readonly<Record<string, SceneCopy>>>> = {
  en: { ...en, "qsr-drive-thru-context": startCopy.en["qsr-drive-thru-context"] },
  fr: { ...fr, "qsr-drive-thru-context": startCopy.fr["qsr-drive-thru-context"] },
  de: { ...de, "qsr-drive-thru-context": startCopy.de["qsr-drive-thru-context"] },
};
