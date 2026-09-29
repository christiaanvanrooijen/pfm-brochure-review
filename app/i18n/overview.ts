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
  /**
   * Who PFM is, at the foot of the page. Every claim is sourced in
   * docs/content/PFM-COMPANY-FACTS.md. The logos themselves are listed in
   * `app/content/customer-logos.ts`; only their heading is copy.
   */
  aboutLabel: string;
  aboutTitle: string;
  aboutLead: string;
  aboutFacts: readonly { title: string; text: string }[];
  aboutLogosLabel: string;
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
    aboutLabel: "About PFM",
    aboutTitle: "Every movement leaves data. We turn it into insight you can act on.",
    aboutLead:
      "With movement data and historical context, we help commercial locations make the right choices. Trusted by retailers, landlords and advisors across Europe.",
    aboutFacts: [
      { title: "Local presence", text: "Offices in Alphen aan den Rijn, Birmingham, Paris and Berlin." },
      {
        title: "In your language",
        text: "In-country teams in the Netherlands, Belgium, the UK, France and Germany, backed by a trusted partner network.",
      },
      {
        title: "Accredited",
        text: "ISO/IEC 27001 for information security, ISO 9001 for quality and ISO 14001 for environmental management.",
      },
    ],
    aboutLogosLabel: "Trusted by leading organisations",
  },
  fr: {
    eyebrow: "Expérience commerciale",
    title: "De quel type de lieu parlons-nous ?",
    lead: "Cinq segments, chacun avec sa première question, ses preuves et ses limites. Choisissez celui que vous avez en face de vous.",
    segmentsLabel: "Segments",
    openJourney: "Ouvrir le parcours",
    openUnavailable: "Indisponible dans cette version",
    sceneCount: "{count} scènes Core",
    aboutLabel: "À propos de PFM",
    aboutTitle: "Chaque mouvement laisse des données. Nous en faisons des insights exploitables.",
    aboutLead:
      "Grâce aux données de mouvement et au contexte historique, nous aidons les lieux commerciaux à faire les bons choix. Retailers, propriétaires et conseils nous font confiance partout en Europe.",
    aboutFacts: [
      { title: "Présence locale", text: "Bureaux à Alphen aan den Rijn, Birmingham, Paris et Berlin." },
      {
        title: "Dans votre langue",
        text: "Des équipes locales aux Pays-Bas, en Belgique, au Royaume-Uni, en France et en Allemagne, appuyées par un réseau de partenaires de confiance.",
      },
      {
        title: "Certifiés",
        text: "ISO/IEC 27001 pour la sécurité de l'information, ISO 9001 pour la qualité et ISO 14001 pour le management environnemental.",
      },
    ],
    aboutLogosLabel: "Ils nous font confiance",
  },
  de: {
    eyebrow: "Commercial Experience",
    title: "Über welche Art von Standort sprechen wir?",
    lead: "Fünf Segmente, jedes mit eigener erster Frage, eigenen Nachweisen und eigener Grenze. Wählen Sie das, das vor Ihnen liegt.",
    segmentsLabel: "Segmente",
    openJourney: "Journey öffnen",
    openUnavailable: "In diesem Build nicht verfügbar",
    sceneCount: "{count} Core-Szenen",
    aboutLabel: "Über PFM",
    aboutTitle: "Jede Bewegung hinterlässt Daten. Wir machen daraus Erkenntnisse, mit denen Sie handeln können.",
    aboutLead:
      "Mit Bewegungsdaten und historischem Kontext helfen wir Handelsstandorten, die richtigen Entscheidungen zu treffen. Händler, Eigentümer und Berater in ganz Europa vertrauen uns.",
    aboutFacts: [
      { title: "Vor Ort präsent", text: "Büros in Alphen aan den Rijn, Birmingham, Paris und Berlin." },
      {
        title: "In Ihrer Sprache",
        text: "Teams vor Ort in den Niederlanden, Belgien, Großbritannien, Frankreich und Deutschland, unterstützt von einem bewährten Partnernetzwerk.",
      },
      {
        title: "Zertifiziert",
        text: "ISO/IEC 27001 für Informationssicherheit, ISO 9001 für Qualität und ISO 14001 für Umweltmanagement.",
      },
    ],
    aboutLogosLabel: "Sie vertrauen uns",
  },
};
