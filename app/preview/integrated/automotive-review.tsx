'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { WhatYouGet, type WhatYouGetStep } from '../../components/redesign/WhatYouGet';
import { DepthPanel } from '../../components/redesign/DepthPanel';
import { retailScenes } from '../../content/segments/retail';
import { getMessages } from '../../i18n/messages';
import nl from '../../../docs/reviews/automotive/locales/nl.json';
import fixture from '../../../docs/reviews/automotive/fixtures.json';

type Stage = 'Context' | 'Measure' | 'Understand' | 'Prove' | 'Configure' | 'Act';
type Section = 'how' | 'technology' | 'requirements' | 'privacy' | 'practice';
type Focus = 'visits' | 'contact' | 'business';
const stages: readonly Stage[] = ['Context', 'Measure', 'Understand', 'Prove', 'Configure', 'Act'];
const scenes = nl.scenes as Array<(typeof nl.scenes)[number] & {stage: Stage}>;
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
  entrance: 'Illustratie van bezoekers die de showroom binnenkomen.',
  destinations: 'Illustratie van bezoekersroutes naar service en verkoop.',
  routes: 'Illustratie van een bezoekersroute door de showroom.',
  dwell: 'Illustratie van bezoekers bij verschillende auto’s in de showroom.',
  contact: 'Illustratie van een verkoper in gesprek met showroombezoekers.',
  desk: 'Illustratie van bezoekers op weg naar de salesdesk.',
  prove: 'Conceptuele illustratie van showroombezoek, contact en een gesprek aan de desk.',
};
const sections: {id: Section; label: string}[] = [
  {id:'how',label:'Hoe werkt het?'}, {id:'technology',label:'Technologie'},
  {id:'requirements',label:'Benodigdheden'}, {id:'privacy',label:'Privacy'}, {id:'practice',label:'In de praktijk'},
];
const steps: WhatYouGetStep<Focus>[] = [
  {id:'visits',title:'Bezoek en modelverblijf',body:'Aantal bezoeken en de afgesproken verblijfsregel.'},
  {id:'contact',title:'Contact en mogelijke kansen',body:'Scheid contactsignalen, vertrokken bezoekers en bezoekers die nog aanwezig zijn.'},
  {id:'business',title:'Opvolging door de dealer',body:'CRM-registraties en een gesimuleerd meldingvoorbeeld staan apart.'},
];
const pad = (n: number) => String(n).padStart(2, '0');

function ShowroomReport({ focus }: {focus: Focus | null}) {
  const o=nl.output;
  return <div className="auto-report" aria-label="Illustratief showroomrapport">
    <div className="auto-report__top"><strong>SHOWROOM PERFORMANCE</strong><span>Illustratief · Northstar Retail Group · Showroom A</span></div>
    <p className="auto-report__scope">5 nov 2026 · 09:00–14:05 CET · {o.definition}</p>
    <div className="auto-report__summary">
      <div className={focus==='visits'?'is-selected':''}><span>Showroombezoeken</span><strong>{fixture.visits}</strong></div>
      <div className={focus==='contact'?'is-selected':''}><span>Contactsignaaldekking</span><strong>{Math.round(fixture.contacted/fixture.qualifying*100)}%</strong><small>{fixture.contacted} / {fixture.qualifying} geldige bezoeken</small></div>
      <div className={focus==='contact'?'is-selected':''}><span>Gem. tijd tot contact</span><strong>1m 42s</strong><small>Onder {fixture.contacted} bezoeken met contact</small></div>
      <div className={focus==='contact'?'is-selected':''}><span>Vertrokken zonder contactsignaal</span><strong>{fixture.departed_without_signal}</strong></div>
    </div>
    <div className="auto-report__columns">
      <section className={focus==='visits'||focus==='contact'?'is-selected':''}><h3>Showroomcontact</h3>
        {o.rowLabels.map((label,i)=>{const value=[fixture.visits,fixture.qualifying,fixture.contacted,fixture.departed_without_signal,fixture.present_without_signal][i] ?? 0;return <div className="auto-report__row" key={label}><span>{label}</span><b>{value}</b><i style={{width:`${value/fixture.visits*100}%`}}/></div>})}
        <p>{o.reconciliation}</p>
      </section>
      <section className={focus==='business'?'is-selected':''}><h3>Dealer CRM / DMS</h3><p>{o.crmBody}</p><h3>Reactievoorbeeld · gesimuleerd</h3><p>{o.alertBody}</p><p>{o.note}</p></section>
    </div>
  </div>;
}

export function AutomotiveReview() {
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
  const heroAlt=reviewHeroDescriptions[scene.id] ?? scene.alt;
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
  const focusItems=[{id:'insight',label:'Het inzicht',body:scene.body},{id:'question',label:'Voor de dealer',body:scene.question}];
  if(index===0)focusItems.push({id:'geo',label:'Herkomst en bereik',body:`${nl.geo.intro} ${nl.geo.note}`});
  const referenceId = scene.id === 'entrance'
    ? (showMix ? 'retail-visitor-composition' : 'retail-store-visits')
    : ['destinations', 'routes', 'dwell', 'contact', 'desk'].includes(scene.id)
      ? 'retail-in-store-journey'
      : undefined;
  const referenceScene = retailScenes.find(item => item.id === referenceId);
  const referenceCopy = referenceScene && getMessages('en').scene[referenceScene.id];
  const detailText: Record<Section,string>={
    how:scene.detail,
    technology:'De gekozen sensor en analyse volgen uit de showroomvraag en de gevalideerde meetopstelling.',
    requirements:'Spreek met de dealer de zones, meetdekking en beschikbare registratiegegevens af.',
    privacy:'Gebruik geaggregeerde geocontext. Valideer instellingen, toegang en bewaartermijn per gegevensbron.',
    practice:index===9?nl.action.intro:'Kies met de dealer een onderzoeksvraag, een actie en een evaluatiemoment. Vergelijk dezelfde definities en perioden.',
  };
  return <main className="automotive-journey rd-demo" lang="nl">
    <div className="integrated-journey-bar automotive-journey__bar">
      <p className="integrated-journey-context">Automotive / {scene.stage}</p>
      <nav aria-label="Fasen van de showroomreis"><ol>{stages.map((stage,i)=><li key={stage} className={i===currentStage?'is-current':''}><button type="button" aria-current={i===currentStage?'step':undefined} onClick={()=>goTo(scenes.findIndex(s=>s.stage===stage))}>{stage}</button></li>)}</ol></nav>
      <div className="integrated-journey-tools"><span>Scène {pad(index+1)} / {pad(scenes.length)}</span><button type="button" onClick={()=>goTo(0)}>Herstart</button><button type="button" onClick={()=>setTopics(!topics)}>Kies een onderwerp →</button></div>
    </div>
    {topics&&<div className="automotive-journey__topics" aria-label="Kies een onderwerp">{scenes.map((item,i)=><button type="button" key={item.id} onClick={()=>goTo(i)}>{item.stage} · {item.title}</button>)}</div>}
    <div className={`rd${depth?' rd--dimmed':''}`}>
      {output ? <div className="rd__main rd__main--output"><WhatYouGet eyebrow="Wat je krijgt" sentence="Een illustratief showroomrapport met bezoek, contact en opvolging." stepsLabel="Wat je erin ziet" steps={steps} back="Terug naar inzicht" heroSrc={hero} question={scene.title} onClose={closeOutput}>{(selected)=><ShowroomReport focus={selected}/>}</WhatYouGet></div>
      : <div className="rd__main">
        <section className="rd__column"><p className="rd__eyebrow"><span className="rd__eyebrow-rule"/>{scene.stage} · Automotive <span className="rd__eyebrow-pos">{pad(index+1)} / {pad(scenes.length)}</span></p>
          <h1 className="rd__question">{scene.title}</h1><p className="rd__supporting">{scene.intro}</p><p className="rd__truth">{scene.body}</p>
          <div className="rd__focus" role="group" aria-label="Onderwerpen">{focusItems.map(item=><button key={item.id} type="button" className={`rd__focus-tab${focus===item.id?' is-active':''}`} aria-pressed={focus===item.id} onClick={()=>setFocus(item.id)}>{item.label}</button>)}</div>
          <p className="rd__focus-body">{focusItems.find(item=>item.id===focus)?.body}</p>
          <div className="rd__actions"><button type="button" className="rd__output-trigger" onClick={()=>setOutput(true)}><span aria-hidden="true">▣</span> Bekijk wat je krijgt</button><button ref={trigger} type="button" className="rd__depth-trigger" aria-haspopup="dialog" aria-expanded={depth} onClick={()=>setDepth(true)}>Hoe werkt dit? <span aria-hidden="true">+</span></button></div>
        </section>
        <figure className="rd__stage-figure automotive-journey__hero"><img src={hero} alt={heroAlt}/><figcaption className="rd__figcaption"><span>{scene.question}</span><span className="rd__figcaption-note">Illustratieve visual · kandidaat ter review</span></figcaption></figure>
      </div>}
      <nav className="rd-demo__bar" aria-label="Navigatie door de showroomreis"><button type="button" className="rd-demo__bar-step" disabled={index===0} onClick={()=>goTo(index-1)}><span aria-hidden="true">←</span> Vorige {index>0&&<span className="rd-demo__bar-step-name">{scenes[index-1]?.stage}</span>}</button><p className="rd-demo__bar-position"><span>{pad(index+1)} / {pad(scenes.length)}</span><span className="rd-demo__bar-track"><span style={{width:`${(index+1)/scenes.length*100}%`}}/></span></p><button type="button" className="rd-demo__bar-next" disabled={index===scenes.length-1} onClick={()=>goTo(index+1)}>Volgende <span className="rd-demo__bar-step-name">{scenes[index+1]?.stage ?? ''}</span> →</button></nav>
      <ol className="rd__rail" aria-label="Bronlagen"><li><span className="rd__rail-index">01</span><span className="rd__rail-kicker">Fysiek</span><span className="rd__rail-label">Entree en showroomgedrag</span></li><li><span className="rd__rail-index">02</span><span className="rd__rail-kicker">Context</span><span className="rd__rail-label">Geo en dealergegevens</span></li><li><span className="rd__rail-index">03</span><span className="rd__rail-kicker">Inzicht</span><span className="rd__rail-label">Afgeleid uit genoemde bronnen</span></li></ol>
      {depth && referenceScene && referenceCopy ? (
        <DepthPanel
          ref={panel}
          locale="en"
          segmentId="retail"
          scene={referenceScene}
          copy={{ ...referenceCopy, sequence: [] }}
          onClose={closeDepth}
          labels={{ title: 'Hoe werkt dit?', lead: 'Meetmethoden en voorbeelden uit Retail.', close: 'Sluiten', tabs: sections.map(item => item.label) }}
          introduction={scene.id === 'entrance' ? (
            <div className="rd-depth__passerby-tabs" role="group" aria-label="Entreeverdieping">
              <button type="button" aria-pressed={!showMix} onClick={() => setShowMix(false)}>Passages tellen</button>
              <button type="button" aria-pressed={showMix} onClick={() => setShowMix(true)}>Bezoekersmix</button>
            </div>
          ) : <p>{scene.detail}</p>}
          howSupplement={scene.id === 'entrance' ? (showMix ? (
            <p>Bezoekersmix is een optionele schatting op groepsniveau. Leeftijd of kind/volwassene vraagt een geschikte en gevalideerde configuratie. Voor de Xovis PC2SE is die indeling hier niet onderbouwd.</p>
          ) : null) : (
            <div className="automotive-lidar-video">
              <h3>LiDAR in een autoshowroom</h3>
              <a href="/assets/videos/lidar-showroom-automotive.mov" target="_blank" rel="noreferrer">Open de showroomvideo (MOV) ↗</a>
            </div>
          )}
          practiceIntroduction={<p>Praktijkvoorbeelden uit Retail.</p>}
        />
      ) : depth && <section ref={panel} className="rd-depth" role="dialog" aria-modal="true" aria-label="Hoe werkt dit?" tabIndex={-1}><div className="rd-depth__head"><h2 className="rd-depth__title">Hoe werkt dit?</h2><p className="rd-depth__lead">Technologie, bronnen, voorwaarden en privacy.</p><button type="button" className="rd-depth__close" onClick={closeDepth}>Sluiten ×</button></div><div className="rd-depth__tabs" role="tablist" aria-label="Verdieping">{sections.map(item=><button type="button" role="tab" className={`rd-depth__tab${section===item.id?' is-active':''}`} aria-selected={section===item.id} key={item.id} onClick={()=>setSection(item.id)}>{item.label}</button>)}</div><div className="rd-depth__body"><h3>{sections.find(item=>item.id===section)?.label}</h3><p>{detailText[section]}</p>{section==='how'&&<><figure className="rd-depth__figure"><img src={hero} alt={heroAlt}/><figcaption><em>Illustratieve visual · kandidaat ter review</em></figcaption></figure></>}{section==='practice'&&index===9&&nl.action.articles.map(item=><div key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></section>}
    </div>
  </main>;
}
