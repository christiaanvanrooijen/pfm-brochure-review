/**
 * Journey copy for the segments added in the demo gate.
 *
 * WHY THIS SHAPE DIFFERS FROM `scenes.ts`
 *
 * The two earlier copy modules restate the model's English so a translator can
 * see it beside the French and German. That worked for eight scenes and does
 * not scale to twenty-three: every restated sentence is a place the copy can
 * drift away from the model without anything failing.
 *
 * So English is not restated here. `resolveJourneyCopy` reads the question, the
 * supporting line, the next CTA and every focus body from the scene's own typed
 * definition, and this file carries only two things:
 *
 *   - what the model does not contain: the eyebrow, the truth boundary, the
 *     coverage note, the caption and the alt text;
 *   - French and German, which are translations of the model's English and have
 *     to live somewhere.
 *
 * `validateJourneyCopy()` fails on any scene where a locale is short of a
 * string, so a gap is a failing check rather than an English sentence appearing
 * mid-French.
 */

import type { Locale } from "./locales.ts";
import { locales } from "./locales.ts";
import type { SceneCopy } from "./messages.ts";
import type { SceneDefinition } from "../content/types.ts";

/** Per-locale strings for a field the model does not carry. */
export type Localized = Readonly<Record<Locale, string>>;

/** Three strings, one field. Keeps a scene readable instead of a wall of keys. */
export const L = (en: string, fr: string, de: string): Localized => ({ en, fr, de });

/**
 * One focus control, bound to one evidence cluster BY INDEX.
 *
 * By index and not by kind: several scenes declare two `measured` clusters, and
 * matching on kind silently returns the first one twice. `cluster` is the
 * position within the scene's non-decision evidence, so the binding is exact
 * and a reordered model breaks the test rather than the meaning.
 */
export interface AuthoredFocus {
  id: string;
  cluster: number;
  label: Localized;
  fr: string;
  de: string;
}

export interface AuthoredScene {
  /** Evidence clusters shown as focus controls, in typed order. */
  focus: readonly AuthoredFocus[];
  eyebrow: Localized;
  truth: Localized;
  coverageNote: Localized;
  heroCaption: Localized;
  heroAlt: Localized;
  /** One rail step per evidence kind the scene declares, in order. */
  rail: readonly { kicker: Localized; label: Localized }[];
  /** Translations of the model's own English. */
  fr: { question: string; supporting: string; nextCta: string };
  de: { question: string; supporting: string; nextCta: string };
}

const ILLUSTRATIVE: Localized = {
  en: "Illustrative visual · not customer data",
  fr: "Visuel illustratif · pas des données client",
  de: "Illustrative Darstellung · keine Kundendaten",
};

/**
 * Build display copy for one scene.
 *
 * English comes from the scene definition; French and German from the authored
 * translations. A focus body is the wording of one typed evidence cluster —
 * matched by kind, so a cluster that moves in the model moves here too.
 */
export function resolveJourneyCopy(
  locale: Locale,
  scene: SceneDefinition,
  authored: AuthoredScene,
): SceneCopy {
  const clusters = scene.evidence.filter((entry) => entry.type !== "decision");

  return {
    eyebrow: authored.eyebrow[locale],
    question: locale === "en" ? scene.commercialQuestion : authored[locale].question,
    supporting: locale === "en" ? scene.supportingLine : authored[locale].supporting,
    truth: authored.truth[locale],
    coverageNote: authored.coverageNote[locale],
    nextCta: locale === "en" ? scene.nextCta : authored[locale].nextCta,
    focus: Object.fromEntries(
      authored.focus.map((entry) => [
        entry.id,
        {
          label: entry.label[locale],
          body:
            locale === "en"
              ? clusters[entry.cluster]?.description ?? ""
              : entry[locale],
        },
      ]),
    ),
    sequence: authored.rail.map((step) => ({
      kicker: step.kicker[locale],
      label: step.label[locale],
    })),
    heroCaption: authored.heroCaption[locale],
    heroAlt: authored.heroAlt[locale],
    illustrative: ILLUSTRATIVE[locale],
  };
}

/** Every locale must be complete before a journey may render. */
export function validateJourneyCopy(
  scenes: Readonly<Record<string, AuthoredScene>>,
): readonly string[] {
  const missing: string[] = [];
  for (const [sceneId, authored] of Object.entries(scenes)) {
    for (const locale of locales) {
      for (const field of ["eyebrow", "truth", "coverageNote", "heroCaption", "heroAlt"] as const) {
        if (!authored[field][locale]) missing.push(`${sceneId}.${field}.${locale}`);
      }
      for (const entry of authored.focus) {
        if (!entry.label[locale]) missing.push(`${sceneId}.focus.${entry.id}.${locale}`);
      }
      for (const [index, step] of authored.rail.entries()) {
        if (!step.kicker[locale] || !step.label[locale]) missing.push(`${sceneId}.rail.${index}.${locale}`);
      }
    }
    for (const locale of ["fr", "de"] as const) {
      const t = authored[locale];
      if (!t.question) missing.push(`${sceneId}.question.${locale}`);
      if (!t.supporting) missing.push(`${sceneId}.supporting.${locale}`);
      if (!t.nextCta) missing.push(`${sceneId}.nextCta.${locale}`);
      for (const entry of authored.focus) {
        if (!entry[locale]) missing.push(`${sceneId}.body.${entry.id}.${locale}`);
      }
    }
  }
  return missing;
}
