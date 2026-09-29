/**
 * Retail Core — the six scenes of the typed Core route.
 *
 * English is not restated: `resolveJourneyCopy` reads the question, supporting
 * line, CTA and every focus body from the scene's own definition. What is here
 * is the boundary the model implies but does not spell out, the caption, the
 * alt text, and the French and German.
 *
 * The boundary this segment repeats is the one AGENTS.md names: a capture rate
 * exists only where the passing audience and the visits describe the same area,
 * the same period and the same definitions. It appears on three scenes because
 * three scenes can imply it.
 */

import type { AuthoredScene } from "./journey-copy.ts";

export const retailJourneyCopy: Readonly<Record<string, AuthoredScene>> = {
  "retail-street-opportunity": {
    focus: [
      { id: "street", cluster: 0, label: { en: "The street and the door", fr: "La rue et la porte", de: "Die Straße und die Tür" },
        fr: "Les piétons passants et les entrées/sorties du magasin par période sont conservés comme signaux physiques distincts.",
        de: "Vorbeigehende Passanten und Store-Eintritte/-Austritte nach Zeit werden als getrennte physische Signale geführt." },
      { id: "context", cluster: 1, label: { en: "What explains the period", fr: "Ce qui explique la période", de: "Was den Zeitraum erklärt" },
        fr: "Les horaires du magasin, les campagnes, la météo ou le contexte de rue peuvent expliquer la période observée.",
        de: "Öffnungszeiten, Kampagnen, Wetter oder Straßenkontext können den beobachteten Zeitraum erklären." },
      { id: "capture", cluster: 2, label: { en: "Capture rate", fr: "Taux de captation", de: "Erfassungsrate" },
        fr: "Le taux de captation et l'opportunité de rue manquée ne sont affichés que si les entrées alignées partagent zone, période et définitions.",
        de: "Erfassungsrate und verpasstes Straßenpotenzial werden nur gezeigt, wenn die abgestimmten Eingaben Fläche, Zeitraum und Definitionen teilen." },
    ],
    eyebrow: { en: "Context · Street", fr: "Contexte · Rue", de: "Kontext · Straße" },
    truth: {
      en: "Passing audience and store entries are two separate signals. A capture rate exists only where both describe the same area, period and definitions.",
      fr: "L'audience passante et les entrées en magasin sont deux signaux distincts. Un taux de captation n'existe que si les deux décrivent la même zone, la même période et les mêmes définitions.",
      de: "Passantenpublikum und Store-Eintritte sind zwei getrennte Signale. Eine Erfassungsrate existiert nur, wenn beide dieselbe Fläche, denselben Zeitraum und dieselben Definitionen beschreiben.",
    },
    coverageNote: {
      en: "Passers-by are sampled near the defined frontage; entries are counted where a threshold is configured. Nobody is identified at either.",
      fr: "Les passants sont échantillonnés près de la vitrine définie ; les entrées sont comptées là où un seuil est configuré. Personne n'est identifié.",
      de: "Passanten werden nahe der definierten Fassade erfasst; Eintritte werden dort gezählt, wo eine Schwelle konfiguriert ist. Niemand wird identifiziert.",
    },
    heroCaption: {
      en: "A capture rate needs both signals to describe the same door and the same hours.",
      fr: "Un taux de captation exige que les deux signaux décrivent la même porte et les mêmes heures.",
      de: "Eine Erfassungsrate verlangt, dass beide Signale dieselbe Tür und dieselben Stunden beschreiben.",
    },
    heroAlt: {
      en: "A city shopping street at golden hour with pedestrians passing a lit store frontage, and soft purple trails curving in through the entrance.",
      fr: "Une rue commerçante à l'heure dorée, des piétons passant devant une vitrine éclairée, et de douces traînées violettes s'incurvant vers l'entrée.",
      de: "Eine Einkaufsstraße im goldenen Licht, Passanten vor einer beleuchteten Ladenfront, und weiche violette Spuren, die zum Eingang abbiegen.",
    },
    rail: [
      { kicker: { en: "Measured", fr: "Mesuré", de: "Gemessen" }, label: { en: "Passing audience and store entries", fr: "Audience passante et entrées en magasin", de: "Passantenpublikum und Store-Eintritte" } },
      { kicker: { en: "Connected", fr: "Connecté", de: "Verbunden" }, label: { en: "Store hours, campaigns and street context", fr: "Horaires, campagnes et contexte de rue", de: "Öffnungszeiten, Kampagnen und Straßenkontext" } },
      { kicker: { en: "Derived", fr: "Déduit", de: "Abgeleitet" }, label: { en: "Capture rate and missed street opportunity", fr: "Taux de captation et opportunité manquée", de: "Erfassungsrate und verpasstes Potenzial" } },
    ],
    fr: { question: "Quel trafic passant est disponible, et quelle part entre dans le magasin ?", supporting: "Optimiser la vitrine, le calendrier des campagnes et l'opportunité au niveau du magasin", nextCta: "Mesurer les visites en magasin" },
    de: { question: "Wie viel Passantenverkehr ist verfügbar, und welcher Anteil betritt den Store?", supporting: "Schaufenster, Kampagnen-Timing und Potenzial auf Store-Ebene optimieren", nextCta: "Store-Besuche messen" },
  },

  "retail-store-visits": {
    focus: [
      { id: "threshold", cluster: 0, label: { en: "The threshold", fr: "Le seuil", de: "Die Schwelle" },
        fr: "Les visites en magasin sont mesurées directement au seuil de l'entrée.",
        de: "Store-Besuche werden direkt an der Eingangsschwelle gemessen." },
      { id: "opportunity", cluster: 1, label: { en: "The opportunity outside", fr: "L'opportunité à l'extérieur", de: "Das Potenzial draußen" },
        fr: "L'opportunité passante alignée est mesurée physiquement dans la zone d'opportunité extérieure, séparément du capteur d'entrée.",
        de: "Das abgestimmte Passantenpotenzial wird physisch im Außenbereich gemessen, getrennt vom Eingangssensor." },
      { id: "context", cluster: 2, label: { en: "Area context", fr: "Contexte de zone", de: "Gebietskontext" },
        fr: "Un contexte agrégé de chalandise ou d'origine peut accompagner la mesure ; il ne fait jamais partie du calcul de captation.",
        de: "Aggregierter Einzugs- oder Herkunftskontext kann die Messung begleiten; er ist niemals Teil der Erfassungsberechnung." },
      { id: "capture", cluster: 3, label: { en: "Capture rate", fr: "Taux de captation", de: "Erfassungsrate" },
        fr: "Le taux de captation n'est déduit que si l'audience passante alignée et les visites partagent zone, période et définitions.",
        de: "Die Erfassungsrate wird nur abgeleitet, wenn abgestimmtes Passantenpublikum und Besuche Fläche, Zeitraum und Definitionen teilen." },
    ],
    eyebrow: { en: "Measure · Entrance", fr: "Mesurer · Entrée", de: "Messen · Eingang" },
    truth: {
      en: "Two sensors, two questions. The entrance measures visits; the outdoor area measures passers-by. Area context sits beside them and never enters the calculation.",
      fr: "Deux capteurs, deux questions. L'entrée mesure les visites ; la zone extérieure mesure les passants. Le contexte de zone les accompagne sans jamais entrer dans le calcul.",
      de: "Zwei Sensoren, zwei Fragen. Der Eingang misst Besuche; der Außenbereich misst Passanten. Gebietskontext steht daneben und geht nie in die Berechnung ein.",
    },
    coverageNote: {
      en: "Visits are counted at the configured threshold only. A visit is not a unique visitor.",
      fr: "Les visites ne sont comptées qu'au seuil configuré. Une visite n'est pas un visiteur unique.",
      de: "Besuche werden nur an der konfigurierten Schwelle gezählt. Ein Besuch ist kein eindeutiger Besucher.",
    },
    heroCaption: {
      en: "The threshold answers one question. The street outside answers another.",
      fr: "Le seuil répond à une question. La rue en répond à une autre.",
      de: "Die Schwelle beantwortet eine Frage. Die Straße draußen eine andere.",
    },
    heroAlt: {
      en: "The same lit store frontage, with movement trails along the pavement turning in through the open entrance.",
      fr: "La même vitrine éclairée, avec des traînées de mouvement le long du trottoir s'incurvant vers l'entrée ouverte.",
      de: "Dieselbe beleuchtete Ladenfront, mit Bewegungsspuren auf dem Gehweg, die durch den offenen Eingang abbiegen.",
    },
    rail: [
      { kicker: { en: "Measured", fr: "Mesuré", de: "Gemessen" }, label: { en: "Entrance visits and outdoor passing audience", fr: "Visites à l'entrée et audience passante extérieure", de: "Eingangsbesuche und Passantenpublikum draußen" } },
      { kicker: { en: "Connected", fr: "Connecté", de: "Verbunden" }, label: { en: "Aggregate catchment or origin context", fr: "Contexte agrégé de chalandise ou d'origine", de: "Aggregierter Einzugs- oder Herkunftskontext" } },
      { kicker: { en: "Derived", fr: "Déduit", de: "Abgeleitet" }, label: { en: "Capture rate, on aligned definitions", fr: "Taux de captation, sur définitions alignées", de: "Erfassungsrate, auf abgestimmten Definitionen" } },
    ],
    fr: { question: "Quelle part de l'opportunité devient une visite ?", supporting: "Voir l'audience passante, le seuil de l'entrée et les visites qui en résultent", nextCta: "Entrer dans le magasin" },
    de: { question: "Wie viel Potenzial wird zu einem Besuch?", supporting: "Passantenpublikum, Eingangsschwelle und die daraus entstehenden Besuche sehen", nextCta: "Den Standort betreten" },
  },

  "retail-visitor-composition": {
    focus: [
      { id: "events", cluster: 0, label: { en: "Compatible events", fr: "Événements compatibles", de: "Kompatible Ereignisse" },
        fr: "Les événements de visite à l'entrée doivent provenir d'une implémentation compatible avec la classification.",
        de: "Eingangs-Besuchsereignisse müssen aus einer klassifikationsfähigen Implementierung stammen." },
      { id: "permitted", cluster: 1, label: { en: "Enabled and permitted", fr: "Activée et autorisée", de: "Aktiviert und zulässig" },
        fr: "La classification doit être activée, configurée et autorisée pour le périmètre sélectionné.",
        de: "Die Klassifikation muss für den gewählten Bereich aktiviert, konfiguriert und zulässig sein." },
      { id: "context", cluster: 2, label: { en: "What segments the mix", fr: "Ce qui segmente le mix", de: "Was den Mix segmentiert" },
        fr: "Le contexte de campagne, de format de magasin ou de période peut segmenter le mix anonyme.",
        de: "Kampagnen-, Storeformat- oder Zeitraumkontext kann den anonymen Mix segmentieren." },
      { id: "estimated", cluster: 3, label: { en: "What is estimated", fr: "Ce qui est estimé", de: "Was geschätzt wird" },
        fr: "La taille de groupe, l'unité d'achat et les sorties de classification anonyme autorisées sont estimées à partir des entrées nommées.",
        de: "Gruppengröße, Kaufeinheit und zulässige anonyme Klassifikationsausgaben werden aus den genannten Eingaben geschätzt." },
    ],
    eyebrow: { en: "Measure · Mix", fr: "Mesurer · Mix", de: "Messen · Mix" },
    truth: {
      en: "Classification is estimated, optional and permission-bound. It describes an anonymous mix; it never identifies anyone and is not available unless it is configured.",
      fr: "La classification est estimée, optionnelle et soumise à autorisation. Elle décrit un mix anonyme ; elle n'identifie personne et n'est pas disponible sans configuration.",
      de: "Klassifikation ist geschätzt, optional und genehmigungsgebunden. Sie beschreibt einen anonymen Mix; sie identifiziert niemanden und ist ohne Konfiguration nicht verfügbar.",
    },
    coverageNote: {
      en: "Anonymous grouping only, within the configured scope. No face, no identity, no individual record.",
      fr: "Regroupement anonyme uniquement, dans le périmètre configuré. Aucun visage, aucune identité, aucun enregistrement individuel.",
      de: "Nur anonyme Gruppierung im konfigurierten Bereich. Kein Gesicht, keine Identität, kein Einzeldatensatz.",
    },
    heroCaption: {
      en: "A mix is a shape in the data, not a description of anyone in it.",
      fr: "Un mix est une forme dans les données, pas une description de quiconque.",
      de: "Ein Mix ist eine Form in den Daten, keine Beschreibung von irgendjemandem darin.",
    },
    heroAlt: {
      en: "A store interior with visitors moving between displays, soft purple rings on the floor grouping people who arrived together.",
      fr: "Un intérieur de magasin avec des visiteurs entre les présentoirs, de doux anneaux violets au sol regroupant les personnes arrivées ensemble.",
      de: "Ein Ladeninneres mit Besuchern zwischen den Auslagen, weiche violette Ringe am Boden gruppieren gemeinsam Angekommene.",
    },
    rail: [
      { kicker: { en: "Measured", fr: "Mesuré", de: "Gemessen" }, label: { en: "Classification-compatible entrance events", fr: "Événements d'entrée compatibles", de: "Klassifikationsfähige Eingangsereignisse" } },
      { kicker: { en: "Connected", fr: "Connecté", de: "Verbunden" }, label: { en: "Campaign, format or period context", fr: "Contexte de campagne, format ou période", de: "Kampagnen-, Format- oder Zeitraumkontext" } },
      { kicker: { en: "Derived", fr: "Déduit", de: "Abgeleitet" }, label: { en: "Group size and permitted anonymous output", fr: "Taille de groupe et sortie anonyme autorisée", de: "Gruppengröße und zulässige anonyme Ausgabe" } },
    ],
    fr: { question: "Quel type de mix anonyme de visiteurs entre dans le magasin ?", supporting: "Comprendre le mix d'unités d'achat et comparer la composition par magasin ou période", nextCta: "Suivre la visite" },
    de: { question: "Welcher anonyme Besuchermix betritt den Store?", supporting: "Kaufeinheitsmix verstehen und die Zusammensetzung nach Store oder Zeitraum vergleichen", nextCta: "Dem Besuch folgen" },
  },

  "retail-in-store-journey": {
    focus: [
      { id: "movement", cluster: 0, label: { en: "The movement signal", fr: "Le signal de mouvement", de: "Das Bewegungssignal" },
        fr: "Les trajectoires anonymes, les entrées/sorties de zone et les transitions fournissent le signal physique de mouvement.",
        de: "Anonyme Trajektorien, Zonenein-/-austritte und Übergänge liefern das physische Bewegungssignal." },
      { id: "definitions", cluster: 1, label: { en: "What gives it meaning", fr: "Ce qui lui donne du sens", de: "Was ihm Bedeutung gibt" },
        fr: "L'agencement du magasin et les définitions de zones donnent le sens spatial du parcours.",
        de: "Ladenlayout und Zonendefinitionen geben dem Weg seine räumliche Bedeutung." },
      { id: "routes", cluster: 2, label: { en: "Routes and drop-off", fr: "Parcours et abandons", de: "Wege und Abbrüche" },
        fr: "Les flux de zone à zone, les parcours, la fréquence des itinéraires et les points d'abandon sont interprétés à partir du mouvement et des définitions alignés.",
        de: "Zone-zu-Zone-Flüsse, Wege, Routenhäufigkeit und Abbruchpunkte werden aus abgestimmter Bewegung und Definitionen interpretiert." },
    ],
    eyebrow: { en: "Understand · Journey", fr: "Comprendre · Parcours", de: "Verstehen · Weg" },
    truth: {
      en: "A route is reconstructed inside configured coverage, from anonymous shapes. Outside that coverage there is no route, and there is never a person.",
      fr: "Un parcours est reconstitué dans la couverture configurée, à partir de formes anonymes. Hors de cette couverture il n'y a pas de parcours, et jamais de personne.",
      de: "Ein Weg wird innerhalb der konfigurierten Abdeckung aus anonymen Formen rekonstruiert. Außerhalb gibt es keinen Weg — und nie eine Person.",
    },
    coverageNote: {
      en: "Movement exists only where coverage and zone definitions exist. Gaps in coverage are gaps in the route.",
      fr: "Le mouvement n'existe que là où la couverture et les définitions de zones existent. Les trous de couverture sont des trous dans le parcours.",
      de: "Bewegung existiert nur dort, wo Abdeckung und Zonendefinitionen existieren. Lücken in der Abdeckung sind Lücken im Weg.",
    },
    heroCaption: {
      en: "A route is only as complete as the coverage under it.",
      fr: "Un parcours n'est complet que dans la mesure de la couverture qui le porte.",
      de: "Ein Weg ist nur so vollständig wie die Abdeckung darunter.",
    },
    heroAlt: {
      en: "A store floor seen from above, with smooth purple routes traced between displays and fixtures.",
      fr: "Un sol de magasin vu d'en haut, avec de doux parcours violets tracés entre présentoirs et mobilier.",
      de: "Eine Ladenfläche von oben, mit weichen violetten Wegen zwischen Auslagen und Möbeln.",
    },
    rail: [
      { kicker: { en: "Measured", fr: "Mesuré", de: "Gemessen" }, label: { en: "Anonymous trajectories and zone transitions", fr: "Trajectoires anonymes et transitions de zones", de: "Anonyme Trajektorien und Zonenübergänge" } },
      { kicker: { en: "Connected", fr: "Connecté", de: "Verbunden" }, label: { en: "Store layout and zone definitions", fr: "Agencement et définitions de zones", de: "Ladenlayout und Zonendefinitionen" } },
      { kicker: { en: "Derived", fr: "Déduit", de: "Abgeleitet" }, label: { en: "Zone-to-zone flow and drop-off points", fr: "Flux de zone à zone et points d'abandon", de: "Zone-zu-Zone-Fluss und Abbruchpunkte" } },
    ],
    fr: { question: "Où vont les visiteurs pendant la visite ?", supporting: "Améliorer l'agencement, l'orientation et les tests de merchandising", nextCta: "Explorer l'engagement par zone" },
    de: { question: "Wohin gehen Besucher während des Besuchs?", supporting: "Layout, Wegeführung und Merchandising-Tests verbessern", nextCta: "Zonen-Engagement erkunden" },
  },

  "retail-zone-engagement": {
    focus: [
      { id: "measured", cluster: 0, label: { en: "Inside a defined zone", fr: "Dans une zone définie", de: "In einer definierten Zone" },
        fr: "La présence, le mouvement et le temps à l'intérieur des zones définies fournissent le signal physique.",
        de: "Präsenz, Bewegung und Zeit innerhalb definierter Zonen liefern das physische Signal." },
      { id: "definitions", cluster: 1, label: { en: "What a zone means", fr: "Ce qu'est une zone", de: "Was eine Zone bedeutet" },
        fr: "Les définitions de zones et de catégories fournissent le contexte métier de chaque espace.",
        de: "Zonen- und Kategoriedefinitionen liefern den geschäftlichen Kontext jeder Fläche." },
      { id: "derived", cluster: 2, label: { en: "Dwell and exposure", fr: "Présence et exposition", de: "Verweildauer und Exposition" },
        fr: "Le temps de présence, le taux d'exposition, les visites répétées et les indicateurs d'engagement ne sont calculés que pour des zones définies.",
        de: "Verweildauer, Expositionsrate, wiederholte Zonenbesuche und Engagement-Näherungswerte werden nur für definierte Zonen berechnet." },
    ],
    eyebrow: { en: "Understand · Zones", fr: "Comprendre · Zones", de: "Verstehen · Zonen" },
    truth: {
      en: "A zone is a configured shape. Dwell and exposure exist for defined zones only, and engagement is a proxy for attention, not a measurement of it.",
      fr: "Une zone est une forme configurée. Présence et exposition n'existent que pour des zones définies, et l'engagement est un indicateur indirect de l'attention, pas sa mesure.",
      de: "Eine Zone ist eine konfigurierte Fläche. Verweildauer und Exposition existieren nur für definierte Zonen, und Engagement ist ein Näherungswert für Aufmerksamkeit, nicht deren Messung.",
    },
    coverageNote: {
      en: "No zone definition, no zone measurement. Undefined floor is not a cold zone; it is unmeasured floor.",
      fr: "Pas de définition de zone, pas de mesure. Un sol non défini n'est pas une zone froide : c'est un sol non mesuré.",
      de: "Ohne Zonendefinition keine Zonenmessung. Undefinierte Fläche ist keine kalte Zone, sondern ungemessene Fläche.",
    },
    heroCaption: {
      en: "A cold zone and an unmeasured zone look the same until the definitions exist.",
      fr: "Une zone froide et une zone non mesurée se ressemblent tant que les définitions n'existent pas.",
      de: "Eine kalte und eine ungemessene Zone sehen gleich aus, solange die Definitionen fehlen.",
    },
    heroAlt: {
      en: "A store floor with purple routes and brighter pooling where those routes pause between fixtures.",
      fr: "Un sol de magasin avec des parcours violets et des zones plus lumineuses là où ils s'attardent.",
      de: "Eine Ladenfläche mit violetten Wegen und helleren Flächen dort, wo diese Wege verweilen.",
    },
    rail: [
      { kicker: { en: "Measured", fr: "Mesuré", de: "Gemessen" }, label: { en: "Presence and time within defined zones", fr: "Présence et temps dans les zones définies", de: "Präsenz und Zeit in definierten Zonen" } },
      { kicker: { en: "Connected", fr: "Connecté", de: "Verbunden" }, label: { en: "Zone and category definitions", fr: "Définitions de zones et de catégories", de: "Zonen- und Kategoriedefinitionen" } },
      { kicker: { en: "Derived", fr: "Déduit", de: "Abgeleitet" }, label: { en: "Dwell, exposure and engagement proxies", fr: "Présence, exposition et indicateurs d'engagement", de: "Verweildauer, Exposition und Engagement-Näherungswerte" } },
    ],
    fr: { question: "Que font les visiteurs dans les zones qu'ils atteignent ?", supporting: "Prioriser les zones chaudes/froides et tester merchandising ou agencement", nextCta: "Connecter la performance" },
    de: { question: "Was tun Besucher in den Zonen, die sie erreichen?", supporting: "Heiße/kalte Zonen priorisieren und Merchandising oder Layout testen", nextCta: "Performance verbinden" },
  },

  "retail-conversion-sales-context": {
    focus: [
      { id: "denominator", cluster: 0, label: { en: "The denominator", fr: "Le dénominateur", de: "Der Nenner" },
        fr: "Les visites en magasin ou le trafic d'unités d'achat fournissent le dénominateur physique.",
        de: "Store-Besuche oder Kaufeinheitsverkehr liefern den physischen Nenner." },
      { id: "outside", cluster: 1, label: { en: "The opportunity outside", fr: "L'opportunité à l'extérieur", de: "Das Potenzial draußen" },
        fr: "L'opportunité passante devant le magasin est mesurée physiquement dans la zone extérieure, séparément du capteur d'entrée.",
        de: "Das Passantenpotenzial vor dem Store wird physisch im Außenbereich gemessen, getrennt vom Eingangssensor." },
      { id: "sales", cluster: 2, label: { en: "Connected sales", fr: "Ventes connectées", de: "Verbundene Verkäufe" },
        fr: "Les transactions, le chiffre d'affaires, le panier moyen et le contexte optionnel restent des données connectées du client.",
        de: "Transaktionen, Umsatz, durchschnittlicher Bonwert und optionaler Kontext bleiben verbundene Kundendaten." },
      { id: "equation", cluster: 4, label: { en: "What may be calculated", fr: "Ce qui peut être calculé", de: "Was berechnet werden darf" },
        fr: "Taux de captation, conversion, panier moyen et ventes par visiteur ne sont calculés que si les entrées passants, visites et ventes partagent magasin, zone, période et définitions.",
        de: "Erfassungsrate, Konversion, Bonwert und Umsatz pro Besucher werden nur berechnet, wenn Passanten-, Besuchs- und Verkaufseingaben Store, Fläche, Zeitraum und Definitionen teilen." },
    ],
    eyebrow: { en: "Prove · Performance", fr: "Prouver · Performance", de: "Belegen · Performance" },
    truth: {
      en: "Sales are connected customer data, never measured here. Conversion exists only where the passer-by, visit and sales inputs share the same store, area, period and definitions.",
      fr: "Les ventes sont des données client connectées, jamais mesurées ici. La conversion n'existe que si les entrées passants, visites et ventes partagent magasin, zone, période et définitions.",
      de: "Verkäufe sind verbundene Kundendaten, hier niemals gemessen. Konversion existiert nur, wenn Passanten-, Besuchs- und Verkaufseingaben Store, Fläche, Zeitraum und Definitionen teilen.",
    },
    coverageNote: {
      en: "Area context may be discussed beside the equation. It never measures passers-by, visits or capture.",
      fr: "Le contexte de zone peut accompagner l'équation. Il ne mesure jamais les passants, les visites ni la captation.",
      de: "Gebietskontext darf neben der Gleichung stehen. Er misst niemals Passanten, Besuche oder Erfassung.",
    },
    heroCaption: {
      en: "Three inputs, one equation — and only when all three describe the same thing.",
      fr: "Trois entrées, une équation — et seulement si les trois décrivent la même chose.",
      de: "Drei Eingaben, eine Gleichung — und nur, wenn alle drei dasselbe beschreiben.",
    },
    heroAlt: {
      en: "A store interior with purple routes across the floor, seen towards the till area.",
      fr: "Un intérieur de magasin avec des parcours violets au sol, vu vers la zone de caisse.",
      de: "Ein Ladeninneres mit violetten Wegen am Boden, Blick zur Kassenzone.",
    },
    rail: [
      { kicker: { en: "Measured", fr: "Mesuré", de: "Gemessen" }, label: { en: "Store visits and outdoor passing opportunity", fr: "Visites en magasin et opportunité passante extérieure", de: "Store-Besuche und Passantenpotenzial draußen" } },
      { kicker: { en: "Connected", fr: "Connecté", de: "Verbunden" }, label: { en: "POS transactions, turnover and optional context", fr: "Transactions, chiffre d'affaires et contexte optionnel", de: "Kassentransaktionen, Umsatz und optionaler Kontext" } },
      { kicker: { en: "Derived", fr: "Déduit", de: "Abgeleitet" }, label: { en: "Capture, conversion and sales per visitor", fr: "Captation, conversion et ventes par visiteur", de: "Erfassung, Konversion und Umsatz pro Besucher" } },
    ],
    fr: { question: "Les visites en magasin deviennent-elles des transactions ?", supporting: "Identifier si l'opportunité se situe dans le trafic, la conversion ou la valeur du panier", nextCta: "Choisir quoi améliorer" },
    de: { question: "Werden Store-Besuche zu Transaktionen?", supporting: "Erkennen, ob das Potenzial im Verkehr, in der Konversion oder im Bonwert liegt", nextCta: "Wählen, was verbessert wird" },
  },
};
