/**
 * The locale contract.
 *
 * WHAT IS AND IS NOT TRANSLATED
 *
 * Segment ids, scene ids, capability ids, proof ids, evidence-input ids, data
 * roles, units and approval state are LANGUAGE-NEUTRAL and stay exactly as the
 * typed content model declares them. Only display content is resolved by those
 * ids. Nothing in this layer may change what a capability claims, what an input
 * requires or whether proof is approved — a translation is a rendering of a
 * truth, never a second copy of it.
 *
 * English is the default and the editorial source. French and German are
 * translations of English, made against the glossary below; they are not
 * independently authored copy.
 *
 * THE GLOSSARY — terms whose distinction must survive translation
 *
 *   movement events      événements de mouvement   Bewegungsereignisse
 *   unique visitors      visiteurs uniques         eindeutige Besucher
 *   visits               visites                   Besuche
 *   entries              entrées                   Eintritte
 *   occupancy            occupation                Belegung
 *   dwell                temps de présence         Verweildauer
 *   origin               origine                   Herkunft
 *   anonymous matching   appariement anonyme       anonymer Abgleich
 *   inferred             déduit                    abgeleitet
 *   illustrative         illustratif               illustrativ
 *
 * "Movement events are not unique visitors" is the single most important
 * sentence this segment owns, and the pair must stay distinguishable in all
 * three languages. A translation that collapses "événements de mouvement" into
 * "visiteurs" is a truth defect, not a style choice.
 */

export const locales = ["en", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * How each locale is offered in the switcher.
 *
 * `short` is the visible label, `name` the accessible name in that language.
 * No flags: a flag is a country, and a language is not one.
 */
export const localeLabels: Readonly<Record<Locale, { short: string; name: string }>> = {
  en: { short: "EN", name: "English" },
  fr: { short: "FR", name: "Français" },
  de: { short: "DE", name: "Deutsch" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** The `lang` attribute for the document. Same codes, stated once. */
export function documentLanguage(locale: Locale): string {
  return locale;
}
