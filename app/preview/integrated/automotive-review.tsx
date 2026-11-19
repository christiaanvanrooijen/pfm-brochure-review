'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { WhatYouGet, type WhatYouGetStep } from '../../components/redesign/WhatYouGet';
import { MeasurementVideo } from '../../components/redesign/MeasurementExamples';
import { DepthPanel } from '../../components/redesign/DepthPanel';
import { retailScenes } from '../../content/segments/retail';
import { resolveJourneyCopy } from '../../i18n/journey-copy';
import { retailJourneyCopy } from '../../i18n/journey-retail';
import type { Locale } from '../../i18n/locales';
import { getMessages } from '../../i18n/messages';
import fr from '../../../docs/reviews/automotive/locales/fr.json';
import de from '../../../docs/reviews/automotive/locales/de.json';
import en from '../../../docs/reviews/automotive/locales/en.json';
import fixture from '../../../docs/reviews/automotive/fixtures.json';

type Stage = 'Context' | 'Measure' | 'Understand' | 'Prove' | 'Configure' | 'Act';
type Section = 'how' | 'technology' | 'requirements' | 'privacy' | 'practice';
type Focus = 'visits' | 'contact' | 'business';
const stages: readonly Stage[] = ['Context', 'Measure', 'Understand', 'Prove', 'Configure', 'Act'];
const content = { en, fr, de };
// Landscape candidates supplied for this review; the source package remains unchanged.
const reviewHeroes: Record<string, string> = {
  entrance: 'automotive-visual-who-is-visiting.png',
  destinations: 'automotive-visual-reason-visit.png',
  routes: 'automotive-visual-routing.png',
  dwell: 'automotive-visual-where-do-people-go.png',
  contact: 'automotive-visual-seller-touch-point.png',
  desk: 'automotive-visual-route-to-orderdesk.png',
  prove: 'automotive-visual-conversion-funnel.png',
};
const reviewHeroDescriptions: Record<string, string> = {
  entrance: 'Illustration of visitors entering the showroom.',
  destinations: 'Illustration of routes to service and sales.',
  routes: 'Illustration of a route through the showroom.',
  dwell: 'Illustration of visitors by different vehicles.',
  contact: 'Illustration of a salesperson speaking with visitors.',
  desk: 'Illustration of visitors walking towards the sales desk.',
  prove: 'Illustration of a showroom visit, staff contact and a conversation at the sales desk.',
};
const sectionDefinitions: {id: Section; label: string}[] = [
  {id:'how',label:'How it works'}, {id:'technology',label:'Technology'},
  {id:'requirements',label:'Requirements'}, {id:'privacy',label:'Privacy'}, {id:'practice',label:'In practice'},
];
const steps: WhatYouGetStep<Focus>[] = [
  {id:'visits',title:'Visits and time in vehicle zones',body:'Visit counts and the agreed dwell rule.'},
  {id:'contact',title:'Staff contact and opportunities',body:'See which visits had a contact signal and which visitors left or are still present.'},
  {id:'business',title:'Dealer follow-up',body:'See dealer CRM records and a simulated alert.'},
];
const pad = (n: number) => String(n).padStart(2, '0');

const words = {
  "en": {
    "report": "Illustrative showroom report",
    "performance": "SHOWROOM PERFORMANCE",
    "visits": "Showroom visits",
    "coverage": "Contact signal coverage",
    "qualified": "qualifying visits",
    "time": "Mean time to contact",
    "left": "Left without a contact signal",
    "contact": "Showroom contact",
    "alert": "Simulated alert example",
    "insight": "The insight",
    "dealer": "For the dealer",
    "origin": "Visitor origin and reach",
    "restart": "Restart",
    "topic": "Choose a topic",
    "scene": "Scene",
    "get": "What you get",
    "see": "See what you get",
    "sentence": "An illustrative showroom report covering visits, staff contact and follow-up.",
    "reportShows": "What the report shows",
    "back": "Back to the insight",
    "visual": "Illustrative visual",
    "previous": "Previous",
    "next": "Next",
    "entrance": "Entrance counting",
    "mix": "Visitor mix",
    "retail": "Examples from Retail.",
    "video": "See LiDAR in a car showroom",
    "tech": "Choose the sensors and analytics for the showroom question and validate the setup on site.",
    "requirements": "Agree the zones, sensor coverage and available dealer records.",
    "privacy": "Use aggregate geographic context. Agree settings, access and retention for each data source.",
    "practice": "Agree a question, an action and a review date with the dealer. Compare periods using consistent definitions."
  },
  "fr": {
    "report": "Rapport de showroom illustratif",
    "performance": "PERFORMANCE DU SHOWROOM",
    "visits": "Visites du showroom",
    "coverage": "Couverture des signaux de contact",
    "qualified": "visites éligibles",
    "time": "Délai moyen avant contact",
    "left": "Départ sans signal de contact",
    "contact": "Contacts en showroom",
    "alert": "Exemple d’alerte simulée",
    "insight": "L’analyse",
    "dealer": "Pour le concessionnaire",
    "origin": "Origine et zone de chalandise",
    "restart": "Recommencer",
    "topic": "Choisir un sujet",
    "scene": "Scène",
    "get": "Ce que vous obtenez",
    "see": "Voir le résultat",
    "sentence": "Exemple de rapport sur les visites, les contacts avec le personnel et le suivi.",
    "reportShows": "Contenu du rapport",
    "back": "Retour à l’analyse",
    "visual": "Illustration",
    "previous": "Précédent",
    "next": "Suivant",
    "entrance": "Comptage à l’entrée",
    "mix": "Profil des visiteurs",
    "retail": "Exemples du commerce de détail.",
    "video": "Voir le LiDAR dans un showroom automobile",
    "tech": "Choisissez les capteurs et les analyses adaptés, puis validez l’installation sur place.",
    "requirements": "Définissez les zones, la couverture et les données disponibles chez le concessionnaire.",
    "privacy": "Utilisez des données géographiques agrégées. Définissez les accès et la conservation par source.",
    "practice": "Convenez d’une question, d’une action et d’une date de bilan. Comparez les périodes avec les mêmes définitions."
  },
  "de": {
    "report": "Beispielhafter Showroom-Bericht",
    "performance": "SHOWROOM-LEISTUNG",
    "visits": "Showroom-Besuche",
    "coverage": "Abdeckung der Kontaktsignale",
    "qualified": "qualifizierte Besuche",
    "time": "Mittlere Zeit bis zum Kontakt",
    "left": "Ohne Kontaktsignal gegangen",
    "contact": "Kontakt im Showroom",
    "alert": "Beispiel einer simulierten Meldung",
    "insight": "Die Erkenntnis",
    "dealer": "Für den Händler",
    "origin": "Herkunft und Einzugsgebiet",
    "restart": "Neu starten",
    "topic": "Thema auswählen",
    "scene": "Szene",
    "get": "Was Sie erhalten",
    "see": "Ergebnis ansehen",
    "sentence": "Beispielbericht über Besuche, Personalkontakte und Nachverfolgung.",
    "reportShows": "Inhalt des Berichts",
    "back": "Zurück zur Erkenntnis",
    "visual": "Illustrative Darstellung",
    "previous": "Zurück",
    "next": "Weiter",
    "entrance": "Eingangszählung",
    "mix": "Besucherstruktur",
    "retail": "Beispiele aus dem Einzelhandel.",
    "video": "LiDAR im Autohaus ansehen",
    "tech": "Wählen Sie geeignete Sensoren und Analysen und prüfen Sie die Einrichtung vor Ort.",
    "requirements": "Zonen, Sensorabdeckung und verfügbare Händlerdaten abstimmen.",
    "privacy": "Nutzen Sie aggregierte Standortdaten. Legen Sie Zugriff und Aufbewahrung je Quelle fest.",
    "practice": "Frage, Maßnahme und Prüftermin vereinbaren. Zeiträume mit einheitlichen Definitionen vergleichen."
  }
};

function ShowroomReport({ focus, locale }: {focus: Focus | null; locale: Locale}) {
  const o=content[locale].output;
  const t = words[locale];
  return <div className="auto-report" aria-label={t.report}>
    <div className="auto-report__top"><strong>{t.performance}</strong><span>{t.report} · Northstar Retail Group · Showroom A</span></div>
    <p className="auto-report__scope">5 Nov 2026 · 09:00–14:05 CET · {o.definition}</p>
    <div className="auto-report__summary">
      <div className={focus==='visits'?'is-selected':''}><span>{t.visits}</span><strong>{fixture.visits}</strong></div>
      <div className={focus==='contact'?'is-selected':''}><span>{t.coverage}</span><strong>{Math.round(fixture.contacted/fixture.qualifying*100)}%</strong><small>{fixture.contacted} / {fixture.qualifying} {t.qualified}</small></div>
      <div className={focus==='contact'?'is-selected':''}><span>{t.time}</span><strong>1m 42s</strong><small>n = {fixture.contacted}</small></div>
      <div className={focus==='contact'?'is-selected':''}><span>{t.left}</span><strong>{fixture.departed_without_signal}</strong></div>
    </div>
    <div className="auto-report__columns">
      <section className={focus==='visits'||focus==='contact'?'is-selected':''}><h3>{t.contact}</h3>
        {o.rowLabels.map((label,i)=>{const value=[fixture.visits,fixture.qualifying,fixture.contacted,fixture.departed_without_signal,fixture.present_without_signal][i] ?? 0;return <div className="auto-report__row" key={label}><span>{label}</span><b>{value}</b><i style={{width:`${value/fixture.visits*100}%`}}/></div>})}
        <p>{o.reconciliation}</p>
      </section>
      <section className={focus==='business'?'is-selected':''}><h3>Dealer CRM / DMS</h3><p>{o.crmBody}</p><h3>{t.alert}</h3><p>{o.alertBody}</p><p>{o.note}</p></section>
    </div>
  </div>;
}

export function AutomotiveReview({ locale = 'en' }: { locale?: Locale }) {
  const t = words[locale];
  const data = content[locale];
  const scenes = data.scenes as Array<(typeof en.scenes)[number] & {stage: Stage}>;
  const ui = getMessages(locale).ui;
  const sections = sectionDefinitions.map((section, index) => ({
    ...section, label: [ui.depthHowItWorks, ui.depthTechnology, ui.depthRequirements, ui.depthPrivacy, ui.depthInPractice][index] ?? section.label,
  }));
  const [index,setIndex]=useState(0);
  const [focus,setFocus]=useState('insight');
  const [output,setOutput]=useState(false);
  const [depth,setDepth]=useState(false);
  const [showMix, setShowMix] = useState(false);
  const [section,setSection]=useState<Section>('how');
  const [topics,setTopics]=useState(false);
  const panel=useRef<HTMLElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const scene=scenes[index] ?? scenes[0]!;
  const currentStage=stages.indexOf(scene.stage);
  const hero=`/assets/content-candidates/automotive/${reviewHeroes[scene.id] ?? scene.image}`;
  const heroAlt=(locale === "en" ? reviewHeroDescriptions[scene.id] : undefined) ?? scene.alt;
  const closeOutput=useCallback(()=>setOutput(false),[]);
  const closeDepth=useCallback(()=>setDepth(false),[]);
  const goTo=(next: number)=>{setIndex(next);setFocus('insight');setDepth(false);setShowMix(false);setOutput(false);setTopics(false);setSection('how');};
  useEffect(()=>{
    if (!depth) return;
    panel.current?.focus({preventScroll:true});
    const key=(e: KeyboardEvent)=>{
      if(e.key==='Escape'){setDepth(false);return;}
      if(e.key!=='Tab'||!panel.current)return;
      const items=panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],video[controls],[tabindex]:not([tabindex="-1"])');
      if(!items.length)return;
      const first=items[0],last=items[items.length-1];
      if(e.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    };
    window.addEventListener('keydown',key);
    return ()=>{window.removeEventListener('keydown',key);trigger.current?.focus({preventScroll:true});};
  },[depth]);
  const focusItems=[{id:'insight',label:t.insight,body:scene.body},{id:'question',label:t.dealer,body:scene.question}];
  if(index===0)focusItems.push({id:'geo',label:t.origin,body:`${data.geo.intro} ${data.geo.note}`});
  const referenceId = scene.id === 'entrance'
    ? (showMix ? 'retail-visitor-composition' : 'retail-store-visits')
    : ['destinations', 'routes', 'dwell', 'contact', 'desk'].includes(scene.id)
      ? 'retail-in-store-journey'
      : undefined;
  const referenceScene = retailScenes.find(item => item.id === referenceId);

  const detailText: Record<Section,string>={
    how:scene.detail,
    technology:t.tech,
    requirements:t.requirements,
    privacy:t.privacy,
    practice:index===9?data.action.intro:t.practice,
  };
  return <main className="automotive-journey rd-demo" lang={locale}>
    <div className="integrated-journey-bar automotive-journey__bar">
      <p className="integrated-journey-context">Automotive / {scene.stage}</p>
      <nav aria-label={t.scene}><ol>{stages.map((stage,i)=><li key={stage} className={i===currentStage?'is-current':''}><button type="button" aria-current={i===currentStage?'step':undefined} onClick={()=>goTo(scenes.findIndex(s=>s.stage===stage))}>{stage}</button></li>)}</ol></nav>
      <div className="integrated-journey-tools"><span>{t.scene} {pad(index+1)} / {pad(scenes.length)}</span><button type="button" onClick={()=>goTo(0)}>{t.restart}</button><button type="button" onClick={()=>setTopics(!topics)}>{t.topic} →</button></div>
    </div>
    {topics&&<div className="automotive-journey__topics" aria-label={t.topic}>{scenes.map((item,i)=><button type="button" key={item.id} onClick={()=>goTo(i)}>{item.stage} · {item.title}</button>)}</div>}
    <div className={`rd${depth?' rd--dimmed':''}`}>
      {output ? <div className="rd__main rd__main--output"><WhatYouGet eyebrow={t.get} sentence={t.sentence} stepsLabel={t.reportShows} steps={locale === "en" ? steps : steps.map((step, i) => ({ ...step, title: [t.visits, t.coverage, data.output.crmTitle][i] ?? step.title, body: [data.output.definition, data.output.reconciliation, data.output.crmBody][i] ?? step.body }))} back={t.back} heroSrc={hero} question={scene.title} onClose={closeOutput}>{(selected)=><ShowroomReport focus={selected} locale={locale}/>}</WhatYouGet></div>
      : <div className="rd__main">
        <section className="rd__column"><p className="rd__eyebrow"><span className="rd__eyebrow-rule"/>{scene.stage} · Automotive <span className="rd__eyebrow-pos">{pad(index+1)} / {pad(scenes.length)}</span></p>
          <h1 className="rd__question">{scene.title}</h1><p className="rd__supporting">{scene.intro}</p><p className="rd__truth">{scene.body}</p>
          <div className="rd__focus" role="group" aria-label={t.topic}>{focusItems.map(item=><button key={item.id} type="button" className={`rd__focus-tab${focus===item.id?' is-active':''}`} aria-pressed={focus===item.id} onClick={()=>setFocus(item.id)}>{item.label}</button>)}</div>
          <p className="rd__focus-body">{focusItems.find(item=>item.id===focus)?.body}</p>
          <div className="rd__actions"><button type="button" className="rd__output-trigger" onClick={()=>setOutput(true)}><span aria-hidden="true">▣</span> {t.see}</button><button ref={trigger} type="button" className="rd__depth-trigger" aria-haspopup="dialog" aria-expanded={depth} onClick={()=>setDepth(true)}>{ui.howThisWorks} <span aria-hidden="true">+</span></button></div>
        </section>
        <figure className="rd__stage-figure automotive-journey__hero"><img src={hero} alt={heroAlt}/><figcaption className="rd__figcaption"><span>{scene.question}</span><span className="rd__figcaption-note">{t.visual}</span></figcaption></figure>
      </div>}
      <nav className="rd-demo__bar" aria-label={t.topic}><button type="button" className="rd-demo__bar-step" disabled={index===0} onClick={()=>goTo(index-1)}><span aria-hidden="true">←</span> {t.previous} {index>0&&<span className="rd-demo__bar-step-name">{scenes[index-1]?.stage}</span>}</button><p className="rd-demo__bar-position"><span>{pad(index+1)} / {pad(scenes.length)}</span><span className="rd-demo__bar-track"><span style={{width:`${(index+1)/scenes.length*100}%`}}/></span></p><button type="button" className="rd-demo__bar-next" disabled={index===scenes.length-1} onClick={()=>goTo(index+1)}>{t.next} <span className="rd-demo__bar-step-name">{scenes[index+1]?.stage ?? ''}</span> →</button></nav>
      <ol className="rd__rail" aria-label={ui.depthLead}><li><span className="rd__rail-index">01</span><span className="rd__rail-kicker">{locale === "fr" ? "Mesure" : locale === "de" ? "Messung" : "Physical"}</span><span className="rd__rail-label">{t.visits}</span></li><li><span className="rd__rail-index">02</span><span className="rd__rail-kicker">Context</span><span className="rd__rail-label">{t.origin} · CRM</span></li><li><span className="rd__rail-index">03</span><span className="rd__rail-kicker">{t.insight}</span><span className="rd__rail-label">{t.coverage}</span></li></ol>
      {depth && referenceScene ? (
        <DepthPanel
          ref={panel}
          locale={locale}
          segmentId="retail"
          scene={referenceScene}
          copy={resolveJourneyCopy(locale, referenceScene, retailJourneyCopy[referenceScene.id])}
          onClose={closeDepth}
          labels={{ title: ui.howThisWorks, lead: ui.depthLead, close: ui.close, tabs: sections.map(item => item.label) }}
          introduction={scene.id === 'entrance' ? (
            <div className="rd-depth__passerby-tabs" role="group" aria-label={t.entrance}>
              <button type="button" aria-pressed={!showMix} onClick={() => setShowMix(false)}>{t.entrance}</button>
              <button type="button" aria-pressed={showMix} onClick={() => setShowMix(true)}>{t.mix}</button>
            </div>
          ) : <p>{scene.detail}</p>}
          howSupplement={scene.id !== 'entrance' && (
            <MeasurementVideo label={t.video} src="/assets/videos/lidar-showroom-automotive.mp4" />
          )}
          practiceIntroduction={<p>Examples from Retail.</p>}
        />
      ) : depth && <section ref={panel} className="rd-depth" role="dialog" aria-modal="true" aria-label={ui.howThisWorks} tabIndex={-1}><div className="rd-depth__head"><h2 className="rd-depth__title">{ui.howThisWorks}</h2><p className="rd-depth__lead">{ui.depthLead}</p><button type="button" className="rd-depth__close" onClick={closeDepth}>{ui.close} ×</button></div><div className="rd-depth__tabs" role="tablist" aria-label={ui.depthTitle}>{sections.map(item=><button type="button" role="tab" className={`rd-depth__tab${section===item.id?' is-active':''}`} aria-selected={section===item.id} key={item.id} onClick={()=>setSection(item.id)}>{item.label}</button>)}</div><div className="rd-depth__body"><h3>{sections.find(item=>item.id===section)?.label}</h3><p>{detailText[section]}</p>{section==='how'&&<><figure className="rd-depth__figure"><img src={hero} alt={heroAlt}/><figcaption><em>{t.visual}</em></figcaption></figure></>}{section==='practice'&&index===9&&data.action.articles.map(item=><div key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></section>}
    </div>
  </main>;
}
