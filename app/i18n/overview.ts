/**
 * Chrome copy for the segment overview — the front door.
 *
 * WHAT IS AUTHORED HERE AND WHAT IS NOT
 *
 * Only the chrome: the page's own title, its lead, the destination labels and
 * the link to the approved shell. Everything that describes a SEGMENT is read
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
 * apart: the card states how many Core scenes the journey holds, and `statusNote`
 * says once, in plain words, that a complete preview is not implemented product.
 * A presenter needs that distinction before the click, not after it.
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
  /** The approved sales experience, where it runs this segment. */
  alsoShell: string;
  /** How long this segment's Core journey is. `{count}` is the scene total. */
  sceneCount: string;
  /** One line on what the journeys are, and what they are not. */
  statusNote: string;
  /** The link to the approved shell, which is a different thing from a start. */
  shellLabel: string;
  shellNote: string;
}

export const overviewCopy: Readonly<Record<Locale, OverviewCopy>> = {
  en: {
    eyebrow: "Commercial experience",
    title: "Which kind of location are we talking about?",
    lead: "Five segments, each with its own first question, its own evidence and its own boundary. Choose the one in front of you.",
    segmentsLabel: "Segments",
    openJourney: "Open the journey",
    openUnavailable: "Not available in this build",
    alsoShell: "Approved sales experience",
    sceneCount: "{count} Core scenes",
    statusNote:
      "Each journey walks that segment's Core route end to end, from the typed model. These are local previews of the measurement story, not implemented product: only Retail is implementation-ready, and where the approved sales experience runs a segment it is linked separately.",
    shellLabel: "Open the approved sales shell",
    shellNote: "The account-led go-demo, with Retail and Shopping Centre running end to end.",
  },
  fr: {
    eyebrow: "Expérience commerciale",
    title: "De quel type de lieu parlons-nous ?",
    lead: "Cinq segments, chacun avec sa première question, ses preuves et ses limites. Choisissez celui que vous avez en face de vous.",
    segmentsLabel: "Segments",
    openJourney: "Ouvrir le parcours",
    openUnavailable: "Indisponible dans cette version",
    alsoShell: "Expérience commerciale approuvée",
    sceneCount: "{count} scènes Core",
    statusNote:
      "Chaque parcours suit la route Core du segment de bout en bout, depuis le modèle typé. Ce sont des aperçus locaux de l'histoire de mesure, pas un produit implémenté : seul Retail est prêt pour l'implémentation, et là où l'expérience commerciale approuvée couvre un segment, elle est liée séparément.",
    shellLabel: "Ouvrir l'application commerciale approuvée",
    shellNote:
      "La démo pilotée par compte, avec Retail et Shopping Centre exécutables de bout en bout.",
  },
  de: {
    eyebrow: "Commercial Experience",
    title: "Über welche Art von Standort sprechen wir?",
    lead: "Fünf Segmente, jedes mit eigener erster Frage, eigenen Nachweisen und eigener Grenze. Wählen Sie das, das vor Ihnen liegt.",
    segmentsLabel: "Segmente",
    openJourney: "Journey öffnen",
    openUnavailable: "In diesem Build nicht verfügbar",
    alsoShell: "Freigegebene Vertriebserfahrung",
    sceneCount: "{count} Core-Szenen",
    statusNote:
      "Jede Journey durchläuft die Core-Route des Segments vollständig, aus dem typisierten Modell. Das sind lokale Vorschauen der Messgeschichte, kein implementiertes Produkt: nur Retail ist implementierungsbereit, und wo die freigegebene Vertriebserfahrung ein Segment abdeckt, ist sie separat verlinkt.",
    shellLabel: "Die freigegebene Vertriebsanwendung öffnen",
    shellNote:
      "Die accountgeführte Go-Demo, mit Retail und Shopping Centre durchgängig lauffähig.",
  },
};
