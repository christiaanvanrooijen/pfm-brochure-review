"use client";

import type { Locale } from "../../i18n/locales";
import type { SegmentId } from "../../content/types";
import { segmentDefinitions } from "../../content/segments";
import { journeySceneCopy } from "../demo/journey";

/** A topic opens a real Core scene, never a synthetic stand-in. */
export interface RetailTopicsProps {
  locale: Locale;
  segment: SegmentId;
  openScene: (scene: string, segment: string, focus?: string) => void;
  onJourney: (segment: string) => void;
  openDwell: () => void;
}

const copy: Record<Locale, {
  eyebrow: string;
  title: string;
  lead: string;
  guided: string;
  guidedBody: string;
  start: string;
  topics: string;
  open: string;
  capture: string;
  captureQuestion: string;
  dwell: string;
  dwellBody: string;
}> = {
  en: {
    eyebrow: "Explore by topic",
    title: "What would you like to understand?",
    lead: "Choose the question that fits your conversation, or follow the full journey.",
    guided: "Follow the journey",
    guidedBody: "Explore the location story in its existing order.",
    start: "Start the journey",
    topics: "Choose a topic",
    open: "Explore this topic",
    capture: "Capture rate",
    captureQuestion: "What share of the aligned passing audience enters the store?",
    dwell: "Dwell time",
    dwellBody: "How long do supported visits or zone stays last?",
  },
  fr: {
    eyebrow: "Explorer par sujet",
    title: "Que souhaitez-vous comprendre ?",
    lead: "Choisissez la question qui correspond à votre échange, ou suivez tout le parcours.",
    guided: "Suivre le parcours",
    guidedBody: "Découvrez l’histoire du lieu dans son ordre actuel.",
    start: "Commencer le parcours",
    topics: "Choisir un sujet",
    open: "Explorer ce sujet",
    capture: "Taux de captation",
    captureQuestion: "Quelle part de l’audience passante alignée entre dans le magasin ?",
    dwell: "Temps de présence",
    dwellBody: "Combien de temps durent les visites ou les présences en zone prises en charge ?",
  },
  de: {
    eyebrow: "Nach Thema erkunden",
    title: "Was möchten Sie verstehen?",
    lead: "Wählen Sie die passende Frage für Ihr Gespräch oder folgen Sie der gesamten Journey.",
    guided: "Der Journey folgen",
    guidedBody: "Erkunden Sie die Geschichte des Standorts in ihrer bestehenden Reihenfolge.",
    start: "Journey starten",
    topics: "Thema auswählen",
    open: "Thema erkunden",
    capture: "Erfassungsrate",
    captureQuestion: "Welcher Anteil des abgestimmten Passantenpublikums betritt den Store?",
    dwell: "Verweildauer",
    dwellBody: "Wie lange dauern unterstützte Besuche oder Aufenthalte in einer Zone?",
  },
};

export function RetailTopics({ locale, segment, openScene, onJourney, openDwell }: RetailTopicsProps) {
  const t = copy[locale];
  const definition = segmentDefinitions.find((item) => item.id === segment);
  if (!definition) return null;

  return (
    <main className="int-topics" aria-labelledby="int-topics-title">
      <div className="int-topics__intro">
        <div>
          <p className="int-topics__eyebrow">{definition.experienceName ?? definition.name} · {t.eyebrow}</p>
          <h1 id="int-topics-title">{t.title}</h1>
          <p className="int-topics__lead">{t.lead}</p>
        </div>
        <div className="int-topics__journey">
          <h2>{t.guided}</h2>
          <p>{t.guidedBody}</p>
          <button type="button" onClick={() => onJourney(segment)}>{t.start} <span aria-hidden="true">→</span></button>
        </div>
      </div>
      <h2 className="int-topics__heading">{t.topics}</h2>
      <div className="int-topics__grid">
        {definition.coreRoute.map((sceneId) => {
          const scene = journeySceneCopy(segment, sceneId, locale);
          return (
            <button className="int-topics__card" type="button" key={sceneId} onClick={() => openScene(sceneId, segment)}>
              <span className="int-topics__label">{scene.eyebrow}</span>
              <strong>{scene.question}</strong>
              <span className="int-topics__open">{t.open} <span aria-hidden="true">→</span></span>
            </button>
          );
        })}
        {segment === "retail" && (
          <>
            <button className="int-topics__card" type="button" onClick={() => openScene("retail-street-opportunity", segment, "capture")}>
              <span className="int-topics__label">{t.capture}</span>
              <strong>{t.captureQuestion}</strong>
              <span className="int-topics__open">{t.open} <span aria-hidden="true">→</span></span>
            </button>
            <button className="int-topics__card" type="button" onClick={openDwell}>
              <span className="int-topics__label">{t.dwell}</span>
              <strong>{t.dwellBody}</strong>
              <span className="int-topics__open">{t.open} <span aria-hidden="true">→</span></span>
            </button>
          </>
        )}
      </div>
      <style>{`
        .int-topics { max-width: 1360px; margin: 0 auto; padding: 48px 40px 72px; color: #0c111d; }
        .int-topics__intro { display: grid; grid-template-columns: 1.2fr .8fr; gap: 56px; align-items: center; }
        .int-topics__eyebrow, .int-topics__label { color: #6941c6; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; }
        .int-topics h1 { max-width: 760px; margin: 20px 0 18px; font-size: clamp(36px, 4vw, 56px); line-height: 1.04; letter-spacing: -.04em; }
        .int-topics__lead { max-width: 660px; color: #475467; font-size: 16px; line-height: 1.55; }
        .int-topics__journey { padding: 8px 0 8px 26px; border-left: 2px solid #9e77ed; }
        .int-topics__journey h2 { margin: 0 0 10px; font-size: 24px; }
        .int-topics__journey p { color: #475467; line-height: 1.5; font-size: 14px; }
        .int-topics__journey button { background: #6941c6; color: white; border: 0; padding: 13px 18px; font: inherit; cursor: pointer; }
        .int-topics__heading { margin: 42px 0 20px; padding-top: 26px; border-top: 1px solid #e4e7ec; font-size: 25px; }
        .int-topics__grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 20px; }
        .int-topics__card { min-height: 155px; border: 1px solid #e4e7ec; background: white; display: flex; flex-direction: column; align-items: start; gap: 14px; padding: 20px; text-align: left; font: inherit; color: #0c111d; }
        button.int-topics__card { cursor: pointer; }
        button.int-topics__card:hover { border-color: #9e77ed; }
        .int-topics__card strong { font-size: 17px; line-height: 1.35; }
        .int-topics__card p { font-size: 13px; line-height: 1.5; color: #475467; margin: 0; }
        .int-topics__open { color: #6941c6; font-size: 13px; font-weight: 600; margin-top: auto; }
        .int-topics button:focus-visible { outline: 2px solid #6941c6; outline-offset: 3px; }
        @media(max-width: 900px) { .int-topics__grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media(max-width: 700px) { .int-topics { padding: 32px 20px 48px; } .int-topics__intro, .int-topics__grid { grid-template-columns: 1fr; } .int-topics__intro { gap: 24px; } }
      `}</style>
    </main>
  );
}
