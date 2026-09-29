/**
 * The Unified PFM Intro's copy, per locale.
 *
 * English is the approved source (Unified intro brief and visual correction,
 * 2026-09-28). French and German are translations of it, made against the
 * glossary in `locales.ts`; they are not independently authored copy and carry
 * no claim the English does not. "People Flow Management" is the brand name and
 * is not translated.
 *
 * Each headline and lead is given as two lines, because the cover sets them on
 * two lines; a translation that needed a third would push the CTA into the
 * footer at 1024 × 768.
 */

import type { Locale } from "./locales";

export interface IntroCopy {
  eyebrow: string;
  headline: readonly [string, string];
  lead: readonly [string, string];
  cta: string;
  beats: readonly [string, string, string];
  footer: string;
}

export const introCopy: Readonly<Record<Locale, IntroCopy>> = {
  en: {
    eyebrow: "See a place differently",
    headline: ["Unlock the potential", "of every location."],
    lead: ["Location data reveals how people move, dwell and visit —", "turning movement into understanding."],
    cta: "Explore the PFM experience",
    beats: ["Place", "Signal", "Understanding"],
    footer: "Movement makes a place legible.",
  },
  fr: {
    eyebrow: "Voir un lieu autrement",
    headline: ["Libérez le potentiel", "de chaque lieu."],
    lead: [
      "Les données de lieu montrent trajets, présence et visites —",
      "et transforment le mouvement en compréhension.",
    ],
    cta: "Explorer l'expérience PFM",
    beats: ["Lieu", "Signal", "Compréhension"],
    footer: "Le mouvement rend un lieu lisible.",
  },
  de: {
    eyebrow: "Einen Ort anders sehen",
    headline: ["Das Potenzial", "jedes Standorts nutzen."],
    lead: [
      "Standortdaten zeigen Wege, Verweildauer und Besuche —",
      "und machen aus Bewegung Verständnis.",
    ],
    cta: "Die PFM-Erfahrung entdecken",
    beats: ["Ort", "Signal", "Verständnis"],
    footer: "Bewegung macht einen Ort lesbar.",
  },
};
