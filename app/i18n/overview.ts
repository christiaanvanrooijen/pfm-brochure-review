/**
 * Chrome copy for the segment overview — the front door.
 *
 * WHAT IS AUTHORED HERE AND WHAT IS NOT
 *
 * Only the chrome: the page's own title, its lead and the destination labels. Everything that describes a SEGMENT is read
 * from that segment's typed model at render time — its name from
 * `segmentDefinitions`, its opening question from `startCopy`, its cover and
 * the cover's alt text from `segment-start-visuals.ts`.
 *
 * That split is the point. A picker is exactly where a segment acquires a
 * second, looser description of itself — a tagline written to fit a card — and
 * then the tagline and the journey drift apart. There is no room for one here:
 * if the card says something about a segment, the segment already said it.
 *
 * WHAT THE CARD SAYS ABOUT READINESS
 *
 * Every segment has a complete Core journey to preview, and exactly one is
 * implementation-ready. Those are different facts and the copy keeps them
 * apart: the card states how many Core scenes the journey holds. The page no
 * longer carries a note on implementation readiness or a link to the approved
 * shell: the product lead removed both on 2026-09-29 (DECISION-LOG), after
 * approving the brochure itself for production.
 */

import type { Locale } from "./locales.ts";

export interface OverviewCopy {
  /** Small label above the title. */
  eyebrow: string;
  title: string;
  lead: string;
  /** Heading for the list of segments, for screen readers and the rule above it. */
  segmentsLabel: string;
  /**
   * The two destinations a card can have.
   *
   * Which one a card offers is decided by whether the shell can run that
   * segment — the same rule the shell's own navigation uses — so the words and
   * the link can never describe different things.
   */
  openJourney: string;
  /** Production only: the card has no destination this build can offer. */
  openUnavailable: string;
  /** How long this segment's Core journey is. `{count}` is the scene total. */
  sceneCount: string;
}

export const overviewCopy: Readonly<Record<Locale, OverviewCopy>> = {
  en: {
    eyebrow: "Commercial experience",
    title: "Which kind of location are we talking about?",
    lead: "Five segments, each with its own first question, its own evidence and its own boundary. Choose the one in front of you.",
    segmentsLabel: "Segments",
    openJourney: "Open the journey",
    openUnavailable: "Not available in this build",
    sceneCount: "{count} Core scenes",
  },
  fr: {
    eyebrow: "Expérience commerciale",
    title: "De quel type de lieu parlons-nous ?",
    lead: "Cinq segments, chacun avec sa première question, ses preuves et ses limites. Choisissez celui que vous avez en face de vous.",
    segmentsLabel: "Segments",
    openJourney: "Ouvrir le parcours",
    openUnavailable: "Indisponible dans cette version",
    sceneCount: "{count} scènes Core",
  },
  de: {
    eyebrow: "Commercial Experience",
    title: "Über welche Art von Standort sprechen wir?",
    lead: "Fünf Segmente, jedes mit eigener erster Frage, eigenen Nachweisen und eigener Grenze. Wählen Sie das, das vor Ihnen liegt.",
    segmentsLabel: "Segmente",
    openJourney: "Journey öffnen",
    openUnavailable: "In diesem Build nicht verfügbar",
    sceneCount: "{count} Core-Szenen",
  },
};
