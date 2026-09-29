/**
 * Display copy for the redesign pilot, resolved by stable id.
 *
 * SHAPE
 *
 * `ui` is chrome and controls. `stages` are the six canonical stage names — the
 * stage IDS never change, only how they are read aloud. `scene` is keyed by the
 * real `SceneId` from the content model, so a localized string can only exist
 * for a scene the model actually declares.
 *
 * WHAT IS DELIBERATELY ABSENT
 *
 * No capability id, no evidence-input id, no approval state and no unit. Those
 * come from the typed content model in every locale. This file also holds no
 * claim the model does not already make: every sentence here is a rendering of
 * `shopping-centre-internal-circulation`'s own typed question, supporting line
 * and evidence clusters.
 *
 * English is authored; French and German are translated against the glossary in
 * `locales.ts`. `validateMessages()` fails on any key that English has and a
 * translation does not, so a gap is detectable in development and CI rather
 * than discovered by a prospect.
 */

import type { Locale } from "./locales.ts";
import { locales } from "./locales.ts";
import { sceneCopy } from "./scenes.ts";

export interface SceneCopy {
  /** Short subject label above the question, e.g. "CIRCULATION". */
  eyebrow: string;
  question: string;
  supporting: string;
  /** The essential truth boundary, kept beside the claim and never in a drawer. */
  truth: string;
  /**
   * Repeated on every hotspot reveal.
   *
   * The truth boundary above sits on the canvas once; this is the half that
   * must survive being read on its own, because a prospect who opens one
   * subject and never reads the rest still has to leave with it.
   */
  coverageNote: string;
  nextCta: string;
  /** Focus interests. These are exploratory, never recommended paths. */
  focus: Readonly<Record<string, { label: string; body: string }>>;
  /** measured input -> relevant context -> available interpretation. */
  sequence: readonly { kicker: string; label: string }[];
  heroCaption: string;
  heroAlt: string;
  illustrative: string;
}

export interface Messages {
  ui: Readonly<Record<string, string>>;
  stages: Readonly<Record<string, string>>;
  scene: Readonly<Record<string, SceneCopy>>;
}

const en: Messages = {
  ui: {
    productName: "Commercial Experience",
    previewBadge: "Redesign preview",
    languageLabel: "Language",
    storyOverview: "The story",
    howThisWorks: "How does this work?",
    depthTitle: "How it works",
    depthLead: "Technology, source layers, requirements and privacy boundaries.",
    explainerNone:
      "No approved illustration for this method. The explanation above stands on its own.",
    visualPending: "Visual not yet produced",
    visualPendingBody:
      "No approved visual exists for this scene. Rather than show another segment's photograph, this space stays empty until the segment's own asset is produced.",
    handoffNext: "Next",
    handoffPreviewNote:
      "This opens an approved current preview. The redesign and the language you selected stop there.",
    handoffNone: "No onward preview exists for this segment yet.",
    demoTitle: "Commercial Experience — demo",
    demoLead: "Choose a segment and walk its measurement story end to end.",
    demoScenes: "Core scenes",
    demoOpen: "Open journey",
    demoBack: "All segments",
    demoPrev: "Previous",
    demoNext: "Next",
    demoProgress: "Scene {index} of {total}",
    demoJourneyNav: "Journey navigation",
    demoRestart: "Restart",
    demoIllustration: "Illustrative diagram",
    reviewCta: "Review this conversation",
    reviewTitle: "Conversation review",
    reviewLead:
      "The questions opened in this session, and what each one would need from your location. Nothing here has been answered, measured or saved.",
    reviewCoverage: "{count} of {total} Core questions opened",
    reviewOpened: "Questions opened",
    reviewExamine: "What to examine for your location",
    reviewExamineLead:
      "The context each of these questions depends on. Taken from the scenes opened above — not a requirement list, not a scope, and not a statement about what your location has.",
    reviewBoundary:
      "A record of a conversation, held locally. No result was calculated, no solution was selected, and nothing was sent anywhere.",
    reviewResume: "Return to the journey",
    reviewEmpty:
      "No scenes were opened in this session, so there is nothing to review. Open the journey to begin.",
    reviewStart: "Open the journey",
    reviewConfigure: "Explore measurement scope — separate preview",
    briefCta: "Prepare a conversation brief",
    briefTitle: "Conversation brief",
    briefLead:
      "A written record of this conversation, for you to take away. Copy it and paste it wherever you keep your notes.",
    briefQuestions: "Questions we opened",
    briefTopics: "Topics to discuss for your location",
    briefTopicsNote:
      "Discussion topics, not confirmed requirements. Nothing here states what your location has or needs.",
    briefNoteLabel: "Your note (optional)",
    briefNoteHint:
      "Anything you want to remember from this conversation. It is typed by you, stays in this browser, and is included only if you write something.",
    briefNotePlaceholder: "What stood out, what to follow up on…",
    briefCopy: "Copy the brief",
    briefCopied: "Brief copied to your clipboard.",
    briefCopyFailed: "Could not reach the clipboard. The exact text is below — select it and copy it by hand.",
    briefFallbackLabel: "Text to copy by hand",
    briefExport: "Copy the JSON export",
    briefExportCopied: "JSON copied to your clipboard.",
    briefExportNote:
      "For a future handoff. It carries the segment and scene IDs, the questions opened and your note — no capabilities, no recommendation, no quotation and no contact details.",
    briefBack: "Back to the review",
    briefBoundary:
      "Nothing has been sent or saved to a CRM. This brief exists in this browser until you close the tab.",
    reviewConfigureNote:
      "A separate preview, in a different presentation, that records what a question would require. It recommends nothing and is not part of this review.",
    qsrConfigureSeparate:
      "Configure is a separate preview for this segment, and none exists yet. The Core journey ends here.",
    depthHowItWorks: "How it works",
    depthTechnology: "Technology",
    depthRequirements: "Requirements",
    depthPrivacy: "Privacy",
    depthInPractice: "In practice",
    close: "Close",
    scenePosition: "Scene",
    stageUnavailable: "Not available for this centre",
    proofUnavailable: "No approved customer case for this segment yet.",
    proofUnavailableBody:
      "The measurement method is explained here. A customer result is shown only after approval; none is approved for this question yet.",
    capabilityFirst: "Capability",
    implementations: "Compatible implementations",
    implementationsNone: "Implementation-specific details available on request.",
    videoNone: "No approved example video for this segment and capability.",
    requiredInputs: "Required inputs",
    capabilityRelation:
      "These are separate compatible options for the same capability, not components used together.",
    limitation: "Limitation",
    watchAction: "See",
    hideAction: "Hide",
    closeVideo: "Close video",
    followOnIntro: "A second, derived view is available once this one is open.",
    essentialsHeading: "Installation essentials",
    accessoriesHeading: "Also required",
    accessoryAlways: "Always required with this sensor.",
    staffExclusionHeading: "Excluding staff from the count",
    technicalDetail: "Technical detail",
    showTechnicalDetail: "Show technical detail",
    hideTechnicalDetail: "Hide technical detail",
    installationNone: "Installation prerequisites are not yet documented for the available options.",
    requiredDataHeading: "What this needs",
    optionalDataHeading: "Optional enrichment, never load-bearing",
    requiresAll: "Requires all of",
    requiresOneOf: "Requires one of",
    privacyUnmapped: "Privacy detail requires source validation",
    privacyNoImplementation: "No implementation is shown for this segment, so there is nothing to state privacy evidence for.",
    contextVisualCaption: "Illustrative reference · not a measurement",
    measured: "Measured",
    connected: "Connected",
    derived: "Derived",
    decision: "Decision",
    ctaHandoffNote:
      "This step opens the current experience: the redesigned composition and the chosen language stop here.",
    bridgeKicker: "Downstream, unchanged",
    bridgeLabel: "Open the current Configure stage (separate preview)",
    bridgeNote:
      "A separate preview, not a continuation. That route renders the approved Configure component with its own state; nothing from this page travels with the click, and the language resets to English.",
  },
  stages: {
    context: "Context",
    measure: "Measure",
    understand: "Understand",
    prove: "Prove",
    configure: "Configure",
    act: "Act",
  },
  scene: sceneCopy.en,
};

const fr: Messages = {
  ui: {
    productName: "Commercial Experience",
    previewBadge: "Aperçu de la refonte",
    languageLabel: "Langue",
    storyOverview: "Le récit",
    howThisWorks: "Comment cela fonctionne-t-il ?",
    depthTitle: "Comment cela fonctionne",
    depthLead: "Technologie, couches de sources, prérequis et limites de confidentialité.",
    explainerNone:
      "Aucune illustration approuvée pour cette méthode. L'explication ci-dessus se suffit à elle-même.",
    visualPending: "Visuel non encore produit",
    visualPendingBody:
      "Aucun visuel approuvé n'existe pour cette scène. Plutôt que d'afficher la photographie d'un autre segment, cet espace reste vide jusqu'à ce que l'actif propre au segment soit produit.",
    handoffNext: "Suite",
    handoffPreviewNote:
      "Ceci ouvre un aperçu actuel approuvé. La refonte et la langue sélectionnée s'y arrêtent.",
    handoffNone: "Aucun aperçu ultérieur n'existe encore pour ce segment.",
    demoTitle: "Commercial Experience — démo",
    demoLead: "Choisissez un segment et parcourez son histoire de mesure de bout en bout.",
    demoScenes: "Scènes Core",
    demoOpen: "Ouvrir le parcours",
    demoBack: "Tous les segments",
    demoPrev: "Précédent",
    demoNext: "Suivant",
    demoProgress: "Scène {index} sur {total}",
    demoJourneyNav: "Navigation du parcours",
    demoRestart: "Recommencer",
    demoIllustration: "Schéma illustratif",
    reviewCta: "Revoir cette conversation",
    reviewTitle: "Revue de la conversation",
    reviewLead:
      "Les questions ouvertes au cours de cette session, et ce que chacune exigerait de votre site. Rien ici n'a été répondu, mesuré ni enregistré.",
    reviewCoverage: "{count} des {total} questions Core ouvertes",
    reviewOpened: "Questions ouvertes",
    reviewExamine: "Ce qu'il faut examiner pour votre site",
    reviewExamineLead:
      "Le contexte dont dépend chacune de ces questions. Issu des scènes ouvertes ci-dessus — ni une liste d'exigences, ni un périmètre, ni une affirmation sur ce que possède votre site.",
    reviewBoundary:
      "Un relevé de conversation, conservé localement. Aucun résultat n'a été calculé, aucune solution n'a été retenue et rien n'a été transmis.",
    reviewResume: "Revenir au parcours",
    reviewEmpty:
      "Aucune scène n'a été ouverte dans cette session, il n'y a donc rien à revoir. Ouvrez le parcours pour commencer.",
    reviewStart: "Ouvrir le parcours",
    reviewConfigure: "Explorer le périmètre de mesure — aperçu distinct",
    briefCta: "Préparer un compte rendu",
    briefTitle: "Compte rendu de conversation",
    briefLead:
      "Un compte rendu écrit de cette conversation, à emporter. Copiez-le et collez-le là où vous conservez vos notes.",
    briefQuestions: "Questions que nous avons ouvertes",
    briefTopics: "Sujets à aborder pour votre site",
    briefTopicsNote:
      "Sujets de discussion, pas des exigences confirmées. Rien ici n'indique ce que votre site possède ou nécessite.",
    briefNoteLabel: "Votre note (facultatif)",
    briefNoteHint:
      "Ce que vous souhaitez retenir de cette conversation. Vous la saisissez vous-même, elle reste dans ce navigateur et n'est incluse que si vous écrivez quelque chose.",
    briefNotePlaceholder: "Ce qui vous a marqué, ce qu'il faut suivre…",
    briefCopy: "Copier le compte rendu",
    briefCopied: "Compte rendu copié dans votre presse-papiers.",
    briefCopyFailed: "Impossible d'accéder au presse-papiers. Le texte exact est ci-dessous — sélectionnez-le et copiez-le à la main.",
    briefFallbackLabel: "Texte à copier à la main",
    briefExport: "Copier l'export JSON",
    briefExportCopied: "JSON copié dans votre presse-papiers.",
    briefExportNote:
      "Pour une future transmission. Il contient les identifiants de segment et de scène, les questions ouvertes et votre note — aucune capacité, aucune recommandation, aucun devis et aucune coordonnée.",
    briefBack: "Retour à la revue",
    briefBoundary:
      "Rien n'a été envoyé ni enregistré dans un CRM. Ce compte rendu existe dans ce navigateur jusqu'à la fermeture de l'onglet.",
    reviewConfigureNote:
      "Un aperçu distinct, dans une autre présentation, qui consigne ce qu'exigerait une question. Il ne recommande rien et ne fait pas partie de cette revue.",
    qsrConfigureSeparate:
      "Configurer est un aperçu distinct pour ce segment, et il n'en existe pas encore. Le parcours Core s'arrête ici.",
    depthHowItWorks: "Comment cela fonctionne",
    depthTechnology: "Technologie",
    depthRequirements: "Prérequis",
    depthPrivacy: "Confidentialité",
    depthInPractice: "En pratique",
    close: "Fermer",
    scenePosition: "Scène",
    stageUnavailable: "Non disponible pour ce centre",
    proofUnavailable: "Aucun cas client approuvé pour ce segment à ce jour.",
    proofUnavailableBody:
      "La méthode de mesure est expliquée ici. Un résultat client n'est montré qu'après approbation ; aucun n'est encore approuvé pour cette question.",
    capabilityFirst: "Capacité",
    implementations: "Implémentations compatibles",
    implementationsNone: "Détails spécifiques à l'implémentation disponibles sur demande.",
    videoNone: "Aucune vidéo d'exemple approuvée pour ce segment et cette capacité.",
    requiredInputs: "Données requises",
    capabilityRelation:
      "Ce sont des options compatibles distinctes pour la même capacité, pas des composants utilisés ensemble.",
    limitation: "Limite",
    watchAction: "Voir",
    hideAction: "Masquer",
    closeVideo: "Fermer la vidéo",
    followOnIntro: "Une seconde vue, dérivée, est disponible une fois celle-ci ouverte.",
    essentialsHeading: "Éléments essentiels d'installation",
    accessoriesHeading: "Également nécessaire",
    accessoryAlways: "Toujours nécessaire avec ce capteur.",
    staffExclusionHeading: "Exclure le personnel du comptage",
    technicalDetail: "Détail technique",
    showTechnicalDetail: "Afficher le détail technique",
    hideTechnicalDetail: "Masquer le détail technique",
    installationNone: "Les prérequis d'installation ne sont pas encore documentés pour les options disponibles.",
    requiredDataHeading: "Ce qui est nécessaire",
    optionalDataHeading: "Enrichissement optionnel, jamais déterminant",
    requiresAll: "Exige la totalité de",
    requiresOneOf: "Exige l'un de",
    privacyUnmapped: "Le détail de confidentialité nécessite une validation des sources",
    privacyNoImplementation: "Aucune implémentation n'est montrée pour ce segment ; il n'y a donc rien à déclarer en matière de preuve de confidentialité.",
    contextVisualCaption: "Référence illustrative · pas une mesure",
    measured: "Mesuré",
    connected: "Connecté",
    derived: "Déduit",
    decision: "Décision",
    ctaHandoffNote:
      "Cette étape ouvre l'expérience actuelle : la composition refondue et la langue choisie s'arrêtent ici.",
    bridgeKicker: "En aval, inchangé",
    bridgeLabel: "Ouvrir l'étape Configurer actuelle (aperçu distinct)",
    bridgeNote:
      "Un aperçu distinct, et non une continuité. Cette route affiche le composant Configurer approuvé avec son propre état ; rien de cette page ne suit le clic, et la langue revient à l'anglais.",
  },
  stages: {
    context: "Contexte",
    measure: "Mesurer",
    understand: "Comprendre",
    prove: "Prouver",
    configure: "Configurer",
    act: "Agir",
  },
  scene: sceneCopy.fr,
};

const de: Messages = {
  ui: {
    productName: "Commercial Experience",
    previewBadge: "Redesign-Vorschau",
    languageLabel: "Sprache",
    storyOverview: "Die Geschichte",
    howThisWorks: "Wie funktioniert das?",
    depthTitle: "Wie es funktioniert",
    depthLead: "Technologie, Quellschichten, Voraussetzungen und Datenschutzgrenzen.",
    explainerNone:
      "Keine freigegebene Illustration für diese Methode. Die Erklärung oben steht für sich.",
    visualPending: "Visual noch nicht erstellt",
    visualPendingBody:
      "Für diese Szene existiert kein freigegebenes Visual. Statt die Fotografie eines anderen Segments zu zeigen, bleibt diese Fläche leer, bis das eigene Asset des Segments erstellt ist.",
    handoffNext: "Weiter",
    handoffPreviewNote:
      "Dies öffnet eine freigegebene aktuelle Vorschau. Das Redesign und die gewählte Sprache enden dort.",
    handoffNone: "Für dieses Segment existiert noch keine weiterführende Vorschau.",
    demoTitle: "Commercial Experience — Demo",
    demoLead: "Wählen Sie ein Segment und durchlaufen Sie seine Messgeschichte von Anfang bis Ende.",
    demoScenes: "Core-Szenen",
    demoOpen: "Reise öffnen",
    demoBack: "Alle Segmente",
    demoPrev: "Zurück",
    demoNext: "Weiter",
    demoProgress: "Szene {index} von {total}",
    demoJourneyNav: "Navigation der Journey",
    demoRestart: "Neu starten",
    demoIllustration: "Illustrative Skizze",
    reviewCta: "Dieses Gespräch ansehen",
    reviewTitle: "Gesprächsrückblick",
    reviewLead:
      "Die in dieser Sitzung geöffneten Fragen und was jede davon von Ihrem Standort verlangen würde. Nichts davon wurde beantwortet, gemessen oder gespeichert.",
    reviewCoverage: "{count} von {total} Core-Fragen geöffnet",
    reviewOpened: "Geöffnete Fragen",
    reviewExamine: "Was Sie für Ihren Standort prüfen sollten",
    reviewExamineLead:
      "Der Kontext, von dem jede dieser Fragen abhängt. Aus den oben geöffneten Szenen — keine Anforderungsliste, kein Leistungsumfang und keine Aussage darüber, was Ihr Standort hat.",
    reviewBoundary:
      "Eine lokal gehaltene Aufzeichnung eines Gesprächs. Es wurde kein Ergebnis berechnet, keine Lösung ausgewählt und nichts übermittelt.",
    reviewResume: "Zurück zur Journey",
    reviewEmpty:
      "In dieser Sitzung wurden keine Szenen geöffnet, es gibt also nichts anzusehen. Öffnen Sie die Journey, um zu beginnen.",
    reviewStart: "Journey öffnen",
    reviewConfigure: "Messumfang erkunden — separate Vorschau",
    briefCta: "Gesprächsnotiz vorbereiten",
    briefTitle: "Gesprächsnotiz",
    briefLead:
      "Eine schriftliche Aufzeichnung dieses Gesprächs zum Mitnehmen. Kopieren Sie sie und fügen Sie sie dort ein, wo Sie Ihre Notizen führen.",
    briefQuestions: "Fragen, die wir geöffnet haben",
    briefTopics: "Themen, die Sie für Ihren Standort besprechen sollten",
    briefTopicsNote:
      "Gesprächsthemen, keine bestätigten Anforderungen. Nichts hier sagt aus, was Ihr Standort hat oder benötigt.",
    briefNoteLabel: "Ihre Notiz (optional)",
    briefNoteHint:
      "Was Sie sich aus diesem Gespräch merken möchten. Sie tippen sie selbst, sie bleibt in diesem Browser und wird nur aufgenommen, wenn Sie etwas schreiben.",
    briefNotePlaceholder: "Was aufgefallen ist, was nachzuverfolgen ist…",
    briefCopy: "Notiz kopieren",
    briefCopied: "Notiz in die Zwischenablage kopiert.",
    briefCopyFailed: "Zwischenablage nicht erreichbar. Der genaue Text steht unten — markieren und von Hand kopieren.",
    briefFallbackLabel: "Text zum manuellen Kopieren",
    briefExport: "JSON-Export kopieren",
    briefExportCopied: "JSON in die Zwischenablage kopiert.",
    briefExportNote:
      "Für eine künftige Übergabe. Er enthält Segment- und Szenen-IDs, die geöffneten Fragen und Ihre Notiz — keine Fähigkeiten, keine Empfehlung, kein Angebot und keine Kontaktdaten.",
    briefBack: "Zurück zum Rückblick",
    briefBoundary:
      "Es wurde nichts an ein CRM gesendet oder dort gespeichert. Diese Notiz existiert in diesem Browser, bis Sie den Tab schließen.",
    reviewConfigureNote:
      "Eine separate Vorschau in einer anderen Darstellung, die festhält, was eine Frage erfordern würde. Sie empfiehlt nichts und ist nicht Teil dieses Rückblicks.",
    qsrConfigureSeparate:
      "Konfigurieren ist für dieses Segment eine separate Vorschau, und es existiert noch keine. Die Core-Reise endet hier.",
    depthHowItWorks: "Wie es funktioniert",
    depthTechnology: "Technologie",
    depthRequirements: "Voraussetzungen",
    depthPrivacy: "Datenschutz",
    depthInPractice: "In der Praxis",
    close: "Schließen",
    scenePosition: "Szene",
    stageUnavailable: "Für dieses Center nicht verfügbar",
    proofUnavailable: "Noch kein freigegebener Kundenfall für dieses Segment.",
    proofUnavailableBody:
      "Die Messmethode wird hier erklärt. Ein Kundenergebnis wird erst nach Freigabe gezeigt; für diese Frage ist noch keines freigegeben.",
    capabilityFirst: "Fähigkeit",
    implementations: "Kompatible Implementierungen",
    implementationsNone: "Implementierungsspezifische Details auf Anfrage verfügbar.",
    videoNone: "Kein freigegebenes Beispielvideo für dieses Segment und diese Fähigkeit.",
    requiredInputs: "Erforderliche Daten",
    capabilityRelation:
      "Dies sind separate kompatible Optionen für dieselbe Fähigkeit, keine gemeinsam genutzten Komponenten.",
    limitation: "Einschränkung",
    watchAction: "Ansehen",
    hideAction: "Ausblenden",
    closeVideo: "Video schließen",
    followOnIntro: "Eine zweite, abgeleitete Ansicht ist verfügbar, sobald diese geöffnet ist.",
    essentialsHeading: "Installationsgrundlagen",
    accessoriesHeading: "Ebenfalls erforderlich",
    accessoryAlways: "Immer zusammen mit diesem Sensor erforderlich.",
    staffExclusionHeading: "Personal aus der Zählung ausschließen",
    technicalDetail: "Technisches Detail",
    showTechnicalDetail: "Technisches Detail anzeigen",
    hideTechnicalDetail: "Technisches Detail ausblenden",
    installationNone: "Installationsvoraussetzungen sind für die verfügbaren Optionen noch nicht dokumentiert.",
    requiredDataHeading: "Was dafür nötig ist",
    optionalDataHeading: "Optionale Anreicherung, nie ausschlaggebend",
    requiresAll: "Erfordert alle von",
    requiresOneOf: "Erfordert eines von",
    privacyUnmapped: "Datenschutzdetails erfordern eine Quellenprüfung",
    privacyNoImplementation: "Für dieses Segment wird keine Implementierung gezeigt, daher gibt es keine Datenschutznachweise zu nennen.",
    contextVisualCaption: "Illustrative Referenz · keine Messung",
    measured: "Gemessen",
    connected: "Verbunden",
    derived: "Abgeleitet",
    decision: "Entscheidung",
    ctaHandoffNote:
      "Dieser Schritt öffnet die aktuelle Erfahrung: die neu gestaltete Komposition und die gewählte Sprache enden hier.",
    bridgeKicker: "Nachgelagert, unverändert",
    bridgeLabel: "Die aktuelle Konfigurieren-Stufe öffnen (separate Vorschau)",
    bridgeNote:
      "Eine separate Vorschau, keine Fortsetzung. Diese Route zeigt die freigegebene Konfigurieren-Komponente mit eigenem Zustand; nichts von dieser Seite reist mit dem Klick mit, und die Sprache fällt auf Englisch zurück.",
  },
  stages: {
    context: "Kontext",
    measure: "Messen",
    understand: "Verstehen",
    prove: "Belegen",
    configure: "Konfigurieren",
    act: "Handeln",
  },
  scene: sceneCopy.de,
};

const messages: Readonly<Record<Locale, Messages>> = { en, fr, de };

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.en;
}

/**
 * Every key English declares that a translation does not.
 *
 * A deterministic English fallback exists at runtime as resilience, but a gap
 * is a defect rather than an acceptable state: this runs in the test suite, so
 * a missing key fails a build rather than shipping a mixed-language page.
 */
export function validateMessages(): readonly string[] {
  const missing: string[] = [];
  const source = messages.en;

  for (const locale of locales) {
    if (locale === "en") continue;
    const target = messages[locale];

    for (const key of Object.keys(source.ui)) {
      if (!target.ui[key]) missing.push(`${locale}.ui.${key}`);
    }
    for (const key of Object.keys(source.stages)) {
      if (!target.stages[key]) missing.push(`${locale}.stages.${key}`);
    }
    for (const [sceneId, copy] of Object.entries(source.scene)) {
      const targetScene = target.scene[sceneId];
      if (!targetScene) {
        missing.push(`${locale}.scene.${sceneId}`);
        continue;
      }
      for (const field of ["eyebrow", "question", "supporting", "truth", "coverageNote", "nextCta", "heroCaption", "heroAlt", "illustrative"] as const) {
        if (!targetScene[field]) missing.push(`${locale}.scene.${sceneId}.${field}`);
      }
      for (const focusId of Object.keys(copy.focus)) {
        if (!targetScene.focus[focusId]) missing.push(`${locale}.scene.${sceneId}.focus.${focusId}`);
      }
      if (targetScene.sequence.length !== copy.sequence.length) {
        missing.push(`${locale}.scene.${sceneId}.sequence`);
      }
    }
  }
  return missing;
}

export { messages };
