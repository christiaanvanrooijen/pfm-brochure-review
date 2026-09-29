/**
 * Approved customer cases, per locale.
 *
 * English is the model's own wording (`app/content/proof-assets.ts`). French
 * and German are translations of it, made against the glossary in
 * `locales.ts`; they carry no claim the English does not. Customer names are
 * proper names and are not translated.
 */

import type { Locale } from "./locales";

export interface ProofCaseCopy {
  title: string;
  challenge: string;
  measurementApproach: string;
  customerLearning: string;
  truthBoundary: string;
}

export interface ProofUiCopy {
  kicker: string;
  challenge: string;
  approach: string;
  learning: string;
  play: string;
  loadsFrom: string;
  published: string;
}

export const proofUiCopy: Readonly<Record<Locale, ProofUiCopy>> = {
  en: {
    kicker: "Customer case",
    challenge: "The question",
    approach: "What was measured",
    learning: "What it changed",
    play: "Play the case video",
    loadsFrom: "Plays from YouTube, only when you start it.",
    published: "Published case on pfm-intelligence.com",
  },
  fr: {
    kicker: "Cas client",
    challenge: "La question",
    approach: "Ce qui a été mesuré",
    learning: "Ce que cela a changé",
    play: "Lire la vidéo du cas",
    loadsFrom: "Lue depuis YouTube, uniquement quand vous la lancez.",
    published: "Cas publié sur pfm-intelligence.com",
  },
  de: {
    kicker: "Kundenfall",
    challenge: "Die Frage",
    approach: "Was gemessen wurde",
    learning: "Was sich verändert hat",
    play: "Fallvideo abspielen",
    loadsFrom: "Wird von YouTube abgespielt, erst wenn Sie es starten.",
    published: "Veröffentlichter Fall auf pfm-intelligence.com",
  },
};

/** Translations by proof id. English resolves from the model itself. */
export const proofCaseTranslations: Readonly<
  Record<Exclude<Locale, "en">, Readonly<Record<string, ProofCaseCopy>>>
> = {
  fr: {
    "CASE-RET-01": {
      title: "Du comptage des visiteurs à la conversion en magasin",
      challenge:
        "Un détaillant alimentaire premium, dont les décisions en magasin reposaient largement sur l'intuition, voulait des chiffres fiables derrière chacune d'elles.",
      measurementApproach:
        "Les visiteurs sont comptés aux entrées des magasins. Combinés aux données de ventes du détaillant, ces comptages donnent la conversion, le panier moyen et le nombre de produits par visite.",
      customerLearning:
        "Dans le cas publié, des décisions autrefois prises à l'instinct s'appuient sur des données de conversion, de panier et de produits par visite, et se traduisent en actions en magasin.",
      truthBoundary:
        "Les capteurs comptent les visiteurs ; ils ne mesurent pas les ventes. La conversion, le panier moyen et les produits par visite sont calculés avec les données de ventes du détaillant. Aucun chiffre d'exactitude ni de résultat n'est repris ici.",
    },
    "CASE-RET-02": {
      title: "Le parcours des visiteurs dans un magasin de marque",
      challenge:
        "Les activations de marque dans un magasin phare sont brèves : une implantation ou un dispositif qui ne fonctionne pas doit être repéré pendant l'activation, pas dans un rapport des semaines plus tard.",
      measurementApproach:
        "Le cas publié décrit une mesure sur tout le parcours des visiteurs : passage devant le magasin, entrée, déplacement dans l'espace, engagement avec les zones, interaction avec le personnel et sortie, restituée toutes les heures via la plateforme Advantage de PFM.",
      customerLearning:
        "Dans le cas publié, les marques partenaires s'en servent pendant l'activation, plutôt que de la lire après coup.",
      truthBoundary:
        "Le cas ne cite aucun chiffre de résultat, et aucun n'est montré ici. Il décrit ce qui est mesuré et comment c'est restitué, pas une hausse.",
    },
  },
  de: {
    "CASE-RET-01": {
      title: "Von der Besucherzählung zur Konversion im Store",
      challenge:
        "Ein Premium-Lebensmittelhändler, dessen Entscheidungen im Store weitgehend auf Intuition beruhten, wollte hinter jeder Entscheidung verlässliche Zahlen.",
      measurementApproach:
        "Besucher werden an den Ladeneingängen gezählt. Zusammen mit den eigenen Verkaufsdaten des Händlers ergeben diese Zählungen Konversion, durchschnittlichen Warenkorb und Produkte pro Besuch.",
      customerLearning:
        "Im veröffentlichten Fall werden Entscheidungen, die früher aus dem Bauch getroffen wurden, durch Daten zu Konversion, Warenkorb und Produkten pro Besuch gestützt und auf der Fläche umgesetzt.",
      truthBoundary:
        "Die Sensoren zählen Besucher; sie messen keine Verkäufe. Konversion, durchschnittlicher Warenkorb und Produkte pro Besuch werden mit den eigenen Verkaufsdaten des Händlers berechnet. Keine Genauigkeits- oder Ergebnisangabe wird hier wiederholt.",
    },
    "CASE-RET-02": {
      title: "Der Besucherweg in einem Marken-Store",
      challenge:
        "Markenaktivierungen in einem Flagship-Store sind kurzlebig: Eine Platzierung oder ein Element, das nicht funktioniert, muss während der Aktivierung erkannt werden, nicht in einem Bericht Wochen später.",
      measurementApproach:
        "Der veröffentlichte Fall beschreibt eine Messung entlang des gesamten Besucherwegs: Passanten vor dem Store, Eintritt, Bewegung durch den Raum, Interaktion mit Zonen und Personal sowie Verlassen, stündlich bereitgestellt über PFMs Advantage-Plattform.",
      customerLearning:
        "Im veröffentlichten Fall nutzen Markenpartner dies, während eine Aktivierung läuft, statt hinterher darüber zu lesen.",
      truthBoundary:
        "Der Fall nennt keine Ergebniszahl, und hier wird keine gezeigt. Er beschreibt, was gemessen und wie es bereitgestellt wird, keine Steigerung.",
    },
  },
};
