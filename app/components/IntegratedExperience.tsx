'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '../i18n/locales';
import type { SegmentId } from '../content/types';
import { segmentDefinitions } from '../content/segments';
import { PFMContent } from '../preview/integrated/pfm-content';
import { Packages } from '../preview/integrated/packages';
import { RetailTopics } from '../preview/integrated/retail-topics';
import { Dwell } from '../preview/integrated/dwell';
import { FollowUp } from '../preview/integrated/follow-up';
import { AutomotiveReview } from '../preview/integrated/automotive-review';
type Area = 'locations' | 'pfm' | 'platforms' | 'packages' | 'topics' | 'dwell' | 'follow-up' | 'automotive';
type JourneyHeader = {where:string;position:string;restart:string;label:string;stages:{label:string;state:string}[]};
const areas: readonly Area[] = ['locations','pfm','platforms','packages','topics','dwell','follow-up','automotive'];
const copy: Record<Locale, { areas: string[]; resume: string; title: string; review: string; topics: string; language: string; automotive: string }> = {
 en:{areas:['Locations','How PFM works','Platforms & insights','Service packages','Follow-up'],resume:'Resume journey',title:'Commercial Experience',review:'Integrated review',topics:'Choose a topic',language:'Language',automotive:'Automotive review'},
 de:{areas:['Standorte','So arbeitet PFM','Plattformen & Insights','Servicepakete','Follow-up'],resume:'Journey fortsetzen',title:'Commercial Experience',review:'Integrierte Vorschau',topics:'Thema auswählen',language:'Sprache',automotive:'Automotive review'},
 fr:{areas:['Lieux','Notre approche','Plateformes et insights','Offres de service','Suivi'],resume:'Reprendre le parcours',title:'Expérience commerciale',review:'Aperçu intégré',topics:'Choisir un sujet',language:'Langue',automotive:'Revue Automotive EN'},
};
export function IntegratedExperience({ initialLocale = 'en', includeAutomotiveReview = true, showReviewStatus = true }: { initialLocale?: Locale; includeAutomotiveReview?: boolean; showReviewStatus?: boolean }) {
 const [locale,setLocale]=useState<Locale>(initialLocale);
 const [area,setArea]=useState<Area>('locations');
 const [segment,setSegment]=useState<SegmentId>('retail');
 const [started,setStarted]=useState(false);
 const [journeyHeader,setJourneyHeader]=useState<JourneyHeader|null>(null);
 const frame=useRef<HTMLIFrameElement>(null);
 const observed=useRef('');
 const boundDocument=useRef<Document|null>(null);
 const t=copy[locale];
 const shellParams = new URLSearchParams({ locale, integrated: '1' });
 if (includeAutomotiveReview) shellParams.set('automotiveReview', '1');
 const go=useCallback((next:Area)=>{window.history.pushState(null,'',`#${next}`);setArea(next)},[]);
 useEffect(()=>{const restore=()=>{const id=window.location.hash.slice(1).split('/')[0] as Area;setArea(areas.includes(id)&&(includeAutomotiveReview||id!=='automotive')?id:'locations')};restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)},[includeAutomotiveReview]);
 useEffect(()=>{if(new URLSearchParams(window.location.search).get('passerby')==='1'&&frame.current){frame.current.src='/preview/demo?segment=retail&scene=retail-street-opportunity&locale=en&integrated=1&point=open&depth=how';setStarted(true);setArea('locations')}},[]);
 const openScene=useCallback((scene:string,which:string,focus?:string)=>{const params=new URLSearchParams({segment:which,scene,locale,integrated:'1'});if(focus)params.set('focus',focus);if(frame.current)frame.current.src=`/preview/demo?${params}`;setStarted(true);go('locations')},[locale,go]);
 const openJourney=useCallback((which:string)=>{if(frame.current)frame.current.src=`/preview/demo?${new URLSearchParams({segment:which,locale,integrated:'1'})}`;setStarted(true);go('locations')},[locale,go]);
 const onFrameLoad=useCallback(()=>{try{const doc=frame.current?.contentDocument;if(!doc||doc.readyState==='loading'||boundDocument.current===doc)return;boundDocument.current=doc;
 if(!doc.getElementById('integrated-header-owner')){const style=doc.createElement('style');style.id='integrated-header-owner';style.textContent='.rd__header,.rd__stages{display:none!important}';doc.head.appendChild(style);}
 doc.addEventListener('click',(event)=>{const target=event.target as Element|null;if(!target||typeof target.closest!=='function')return;const home=target.closest('a.rd__brand--home') as HTMLAnchorElement|null;if(home){event.preventDefault();const params=new URLSearchParams({locale,integrated:'1'});if(includeAutomotiveReview)params.set('automotiveReview','1');if(frame.current)frame.current.src=`/preview/demo?${params}`;setStarted(false);setJourneyHeader(null);setArea('locations');return;}const localeButton=target.closest('.rd__locale');const short=localeButton?.querySelector('span')?.textContent?.trim().toLowerCase();if(short==='en'||short==='fr'||short==='de')setLocale(short);const segmentLink=target.closest('a.ov__link') as HTMLAnchorElement|null;if(!segmentLink)return;if(segmentLink.dataset.integratedAutomotive==='true'){event.preventDefault();if(includeAutomotiveReview)go('automotive');return;}const selected=new URL(segmentLink.href).searchParams.get('segment');const found=segmentDefinitions.find(x=>x.id===selected);if(found){event.preventDefault();setSegment(found.id);go('topics')}},true)}catch{/* The review frame remains usable without the optional shortcut. */}},[go,includeAutomotiveReview,locale]);
 useEffect(()=>{const timer=window.setInterval(()=>{try{onFrameLoad();const doc=frame.current?.contentDocument;
 const stages=Array.from(doc?.querySelectorAll('.rd__stage')??[]).map(el=>({label:el.querySelector('span')?.textContent?.trim()??'',state:el.classList.contains('is-current')?'current':el.classList.contains('is-unavailable')?'unavailable':'available'}));
 const next=stages.length?{where:doc?.querySelector('.rd__where')?.textContent?.replace(/\s+/g,' ').trim()??'',position:doc?.querySelector('.rd__position')?.textContent?.replace(/\s+/g,' ').trim()??'',restart:doc?.querySelector('.rd__header-restart')?.textContent?.trim()??'',label:doc?.querySelector('.rd__stages')?.getAttribute('aria-label')??'',stages}:null;
 setJourneyHeader(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
 const search=frame.current?.contentWindow?.location.search;if(!search||search===observed.current)return;observed.current=search;const p=new URLSearchParams(search);const l=p.get('locale');if(l==='en'||l==='de'||l==='fr')setLocale(l);const found=segmentDefinitions.find(x=>x.id===p.get('segment'));if(found){setSegment(found.id);setStarted(true)}else if(!p.get('segment'))setStarted(false)}catch{/* The review frame targets the same-origin brochure. */}},300);return()=>window.clearInterval(timer)},[onFrameLoad]);
 const changeLanguage=(next:Locale)=>{setLocale(next);try{const doc=frame.current?.contentDocument;const button=Array.from(doc?.querySelectorAll<HTMLButtonElement>('.rd__locale')??[]).find(b=>b.querySelector('span')?.textContent?.trim().toLowerCase()===next);if(button){button.click();return}const w=frame.current?.contentWindow;if(!w)return;const url=new URL(w.location.href);url.searchParams.set('locale',next);frame.current!.src=url.pathname+url.search}catch{if(frame.current)frame.current.src=`/preview/demo?locale=${next}&integrated=1`}};
 return <div className={`integrated-review${area==='locations'&&started?' integrated-review--journey':''}`}><header className="integrated-header"><a href={showReviewStatus?'/preview/integrated':`/?locale=${locale}`} className="integrated-brand"><img src="/assets/logo/pfm-logo-black.png" alt="PFM" /><span>{t.title}</span></a><nav aria-label={t.title}>{(['locations','pfm','platforms','packages','follow-up'] as const).map((id,i)=><button key={id} className={area===id||(id==='locations'&&(area==='topics'||area==='dwell'||area==='automotive'))?'active':''} aria-current={area===id||(id==='locations'&&(area==='topics'||area==='dwell'||area==='automotive'))?'page':undefined} onClick={()=>go(id)}>{t.areas[i]}</button>)}</nav><div className="integrated-tools">{started&&area!=='locations'&&<button className="integrated-resume" onClick={()=>go('locations')}>{t.resume} ↗</button>}<div role="group" aria-label={t.language}>{(['en','de','fr'] as const).map(l=><button key={l} aria-pressed={locale===l} className={locale===l?'active':''} onClick={()=>changeLanguage(l)}>{l.toUpperCase()}</button>)}</div>{showReviewStatus&&<span>{t.review}</span>}</div>{area==='locations'&&started&&<div className="integrated-journey-bar"><p className="integrated-journey-context">{journeyHeader?.where}</p><ol aria-label={journeyHeader?.label}>{journeyHeader?.stages.map((stage,i)=><li key={i} className={`is-${stage.state}`} aria-current={stage.state==='current'?'step':undefined}>{stage.label}</li>)}</ol><div className="integrated-journey-tools"><span>{journeyHeader?.position}</span>{journeyHeader?.restart&&<button type="button" onClick={()=>frame.current?.contentDocument?.querySelector<HTMLButtonElement>('.rd__header-restart')?.click()}>{journeyHeader.restart}</button>}<button type="button" onClick={()=>go('topics')}>{t.topics} →</button></div></div>}</header>
 <div className="integrated-frame" hidden={area!=='locations'}><iframe ref={frame} title={t.title} src={`/preview/demo?${shellParams}`} onLoad={onFrameLoad}/></div>
 {area==='topics'&&<RetailTopics locale={locale} segment={segment} openScene={openScene} onJourney={openJourney} openDwell={()=>go('dwell')}/>}
 {area==='dwell'&&<Dwell locale={locale} onBack={()=>go('topics')}/>}
 {(area==='pfm'||area==='platforms')&&<PFMContent key={area} locale={locale} area={area} onOpenScene={openScene}/>}
 {area==='packages'&&<Packages locale={locale}/>}
 {area==='follow-up'&&<FollowUp locale={locale}/>}
 {area==='automotive'&&<AutomotiveReview/>}
 </div>;
}
