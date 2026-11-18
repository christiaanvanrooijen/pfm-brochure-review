'use client';

import { useCallback, useEffect, useState } from 'react';
import { customerProofLogos } from '../../content/customer-logos';
import type { Locale } from '../../i18n/locales';
import { pfmPages, type PFMArea, type PFMPage } from './pfm-copy';

const areaPages: Readonly<Record<PFMArea, readonly PFMPage[]>> = {
  pfm: ['about', 'arc', 'data-services', 'privacy', 'certifications'],
  platforms: ['toolbox', 'advantage', 'pulse', 'data-flow'],
};
const areaLabels: Record<Locale, Record<PFMArea, string>> = {
  en: { pfm: 'How PFM works', platforms: 'Platforms & insights' },
  de: { pfm: 'So arbeitet PFM', platforms: 'Plattformen & Insights' },
  fr: { pfm: 'Notre approche', platforms: 'Plateformes et insights' },
};
const sectionLabels: Record<Locale, string> = {
  en: 'What this includes',
  de: 'Was dazugehört',
  fr: 'Ce que cela comprend',
};
const arcLabels: Record<Locale, { objective: string; value: string; ai: string; aiText: string }> = {
  en: { objective: 'Our objective · object detection', value: '98%', ai: 'ARC in the era of AI', aiText: 'When agentic business agents use operational data to support decisions or trigger actions, the quality of their inputs matters. Accurate detection, reliable data over time and consistent definitions provide a foundation for those decisions.' },
  de: { objective: 'Unser Ziel · Objekterkennung', value: '98 %', ai: 'ARC im Zeitalter der KI', aiText: 'Wenn agentische Business Agents operative Daten für Entscheidungen oder Aktionen nutzen, ist die Qualität der Eingaben entscheidend. Genaue Erkennung, dauerhaft zuverlässige Daten und konsistente Definitionen bilden dafür eine Grundlage.' },
  fr: { objective: 'Notre objectif · détection d’objets', value: '98 %', ai: 'ARC à l’ère de l’IA', aiText: 'Lorsque des agents métier utilisent les données opérationnelles pour soutenir des décisions ou déclencher des actions, la qualité des données d’entrée compte. Une détection précise, des données fiables dans le temps et des définitions cohérentes constituent une base pour ces décisions.' },
};
const impactCopy: Record<Locale, { kicker: string; title: string; intro: string; fund: string; partnership: string; contribution: string }> = {
  en: { kicker: 'PFM · accessibility', title: 'Supporting more accessible public spaces.', intro: 'PFM uses its people-flow expertise to help clients identify features that can make public places harder to access.', fund: 'Accessibility Fund', partnership: 'PFM established a fund for accessibility projects, including support for guide-dog training with KNGF and navigation work with eZwayZ for people with visual impairments.', contribution: 'A portion of each data licence sold is donated to the Accessibility Fund.' },
  de: { kicker: 'PFM · Barrierefreiheit', title: 'Öffentliche Räume zugänglicher machen.', intro: 'PFM nutzt seine Expertise im Personenfluss, um Kunden auf Merkmale aufmerksam zu machen, die den Zugang zu öffentlichen Orten erschweren können.', fund: 'Accessibility Fund', partnership: 'PFM hat einen Fonds für Barrierefreiheitsprojekte eingerichtet. Dazu gehören die Unterstützung der Blindenführhundausbildung mit KNGF und die Zusammenarbeit mit eZwayZ zur Navigation für Menschen mit Sehbehinderung.', contribution: 'Ein Teil jeder verkauften Datenlizenz fließt in den Accessibility Fund.' },
  fr: { kicker: 'PFM · accessibilité', title: 'Pour des espaces publics plus accessibles.', intro: 'PFM met son expertise des flux de personnes au service de l’identification des éléments qui peuvent compliquer l’accès aux espaces publics.', fund: 'Accessibility Fund', partnership: 'PFM a créé un fonds dédié à des projets d’accessibilité, notamment le soutien à la formation de chiens guides avec KNGF et le travail avec eZwayZ sur la navigation des personnes malvoyantes.', contribution: 'Une partie de chaque licence de données vendue est versée à l’Accessibility Fund.' },
};
const reachCopy: Record<Locale, { title: string; values: readonly { value: string; label: string }[] }> = {
  en: { title: 'PFM in commercial locations', values: [{ value: '500+', label: 'shopping centres' }, { value: '25,000+', label: 'retail locations' }, { value: '1,500+', label: 'drive-thru locations' }] },
  de: { title: 'PFM an Gewerbestandorten', values: [{ value: '500+', label: 'Einkaufszentren' }, { value: '25.000+', label: 'Einzelhandelsstandorte' }, { value: '1.500+', label: 'Drive-thru-Standorte' }] },
  fr: { title: 'PFM sur des sites commerciaux', values: [{ value: '500+', label: 'centres commerciaux' }, { value: '25 000+', label: 'sites de vente au détail' }, { value: '1 500+', label: 'sites drive' }] },
};

/** Global v4 content only. Real segment scenes and report specimens stay in the existing demo. */
export function PFMContent({ locale, area, onOpenScene }: { locale: Locale; area: PFMArea; onOpenScene: (scene: string, segment: string) => void }) {
  const pageFromHash = useCallback(() => { const id = typeof window === 'undefined' ? '' : window.location.hash.split('/')[1]; return areaPages[area].includes(id as PFMPage) ? id as PFMPage : areaPages[area][0]; }, [area]);
  const [page, setPage] = useState<PFMPage>(pageFromHash);
  useEffect(() => { const restore = () => setPage(pageFromHash()); window.addEventListener('popstate', restore); return () => window.removeEventListener('popstate', restore); }, [pageFromHash]);
  const navigate = (id: PFMPage) => { window.history.pushState(null, '', `#${area}/${id}`); setPage(id); };
  const available = areaPages[area];
  const currentPage = available.includes(page) ? page : available[0];
  const content = pfmPages[locale][currentPage];
  const isArc = currentPage === 'arc';
  const arc = arcLabels[locale];
  const isIntro = currentPage === 'about' || isArc;
  const actions = ({
    en: { services: 'See the Data Services', story: 'Follow the Retail story', portal: 'Open Advantage portal', illustration: 'Illustrative app screens · not customer data', pulseOverview: 'Pulse overview', pulseTimeline: 'Timeline view', pulseBuilding: 'Building view', advantageAlt: 'PFM Advantage report screen with location filters, footfall and demographic charts', advantageNote: 'Illustrative Advantage screen · example report' },
    de: { services: 'Data Services ansehen', story: 'Retail-Journey öffnen', portal: 'Advantage-Portal öffnen', illustration: 'Illustrative App-Ansichten · keine Kundendaten', pulseOverview: 'Pulse-Übersicht', pulseTimeline: 'Timeline-Ansicht', pulseBuilding: 'Building-Ansicht', advantageAlt: 'PFM-Advantage-Berichtsansicht mit Standortfiltern, Besucherzahlen und demografischen Diagrammen', advantageNote: 'Illustrative Advantage-Ansicht · Beispielbericht' },
    fr: { services: 'Voir les Data Services', story: 'Suivre le parcours Retail', portal: 'Ouvrir le portail Advantage', illustration: 'Écrans illustratifs de l’application · pas de données client', pulseOverview: 'Vue Pulse', pulseTimeline: 'Vue Timeline', pulseBuilding: 'Vue Building', advantageAlt: 'Écran de rapport PFM Advantage avec filtres de lieu, fréquentation et graphiques démographiques', advantageNote: 'Écran Advantage illustratif · exemple de rapport' },
  })[locale];
  if(currentPage==='certifications') return <>
    <nav className="integrated-subnav" aria-label={areaLabels[locale][area]}>{available.map(id=><button type="button" key={id} className={id===currentPage?'active':''} aria-current={id===currentPage?'page':undefined} onClick={()=>navigate(id)}>{pfmPages[locale][id].tab}</button>)}</nav>
    <main className="integrated-content"><p className="integrated-kicker">{areaLabels[locale][area]} · {content.tab}</p><h1>{content.title}</h1><p style={{fontSize:18,maxWidth:'65ch'}}>{content.lead}</p><p>{content.body}</p><div className="integrated-certifications">{content.rows.map((item,i)=><article key={item.title}><span className="integrated-kicker">{String(i+1).padStart(2,'0')}</span><h2>{item.title}</h2><p>{item.body}</p></article>)}</div><p className="integrated-cert-scope">{content.detail}</p></main>
  </>;
  return <>
    <nav className="integrated-subnav" aria-label={areaLabels[locale][area]}>
      {available.map(id => <button type="button" key={id} className={id === currentPage ? 'active' : ''} aria-current={id === currentPage ? 'page' : undefined} onClick={() => navigate(id)}>{pfmPages[locale][id].tab}</button>)}
    </nav>
    <main className="integrated-content">
      <div className="integrated-split">
        <div>
          <p className="integrated-kicker">{areaLabels[locale][area]} · {content.tab}</p>
          <h1>{content.title}</h1>
          <p style={{ fontSize: '18px', maxWidth: '56ch' }}>{content.lead}</p>
          <p style={{ maxWidth: '62ch' }}>{content.body}</p>
          {isArc && <div className="integrated-action-row"><button type="button" className="integrated-button" onClick={() => navigate('data-services')}>{actions.services} →</button><button type="button" className="integrated-link-button" onClick={() => onOpenScene('retail-street-opportunity', 'retail')}>{actions.story} →</button></div>}
          {currentPage === 'advantage' && <div className="integrated-action-row"><a className="integrated-button" href="https://advantage.pfm-intelligence.com/" target="_blank" rel="noopener noreferrer">{actions.portal} ↗</a></div>}
        </div>
        {isIntro ? <div className="integrated-panel">
          <p className="integrated-kicker" style={{ color: '#d6bbfb' }}>ARC</p>
          {pfmPages[locale].arc.rows.map((item, i) => <div key={item.title} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '12px', padding: '20px 0', borderBottom: i < 2 ? '1px solid #ffffff26' : undefined }}>
            <strong style={{ color: '#b692f6', fontSize: '56px', lineHeight: 1 }}>{['A','R','C'][i]}</strong>
            <div><h2 style={{ fontSize: '22px', margin: '0 0 8px' }}>{item.title}</h2><p style={{ fontSize: '13px', margin: 0 }}>{item.body}</p></div>
          </div>)}
        </div> : currentPage === 'advantage' ? <figure className="integrated-advantage-visual"><img src="/assets/integrated-review/advantage-report.png" alt={actions.advantageAlt} /><figcaption>{actions.advantageNote}</figcaption></figure> : currentPage === 'pulse' ? <div className="integrated-pulse-gallery">
          {[
            { src: '/assets/integrated-review/pulse.png', alt: actions.pulseOverview, title: actions.pulseOverview },
            { src: '/assets/integrated-review/pulse-timeline.png', alt: actions.pulseTimeline, title: actions.pulseTimeline },
            { src: '/assets/integrated-review/pulse-building.png', alt: actions.pulseBuilding, title: actions.pulseBuilding },
          ].map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} /><figcaption>{image.title}</figcaption></figure>)}
          <small>{actions.illustration}</small>
        </div> : <div className="integrated-panel"><p className="integrated-kicker" style={{ color: '#d6bbfb' }}>{content.tab}</p><h2 style={{ fontSize: '28px', margin: '22px 0 12px' }}>{content.detailTitle}</h2><p>{content.detail}</p></div>}
      </div>
      <section style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e4e7ec' }}>
        <h2 style={{ fontSize: '30px', letterSpacing: '-.035em' }}>{isArc || isIntro || currentPage === 'advantage' || currentPage === 'pulse' ? content.detailTitle : sectionLabels[locale]}</h2>
        {isArc ? <div className="integrated-split" style={{ margin: '26px 0' }}>
          <div style={{ background: '#f4ebff', borderLeft: '3px solid #9e77ed', padding: '28px' }}>
            <p className="integrated-kicker">{arc.objective}</p><strong style={{ color: '#6941c6', display: 'block', fontSize: '72px', lineHeight: 1 }}>{arc.value}</strong><p>{content.detail}</p>
          </div>
          <div><p className="integrated-kicker">{arc.ai}</p><p style={{ fontSize: '18px' }}>{arc.aiText}</p></div>
        </div> : isIntro || currentPage === 'advantage' || currentPage === 'pulse' ? <p style={{ maxWidth: '72ch' }}>{content.detail}</p> : null}
        {content.rows.map((item, i) => <article className="integrated-row" key={item.title} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '12px' }}><strong style={{ color: '#9e77ed', fontSize: '20px' }}>{isArc ? ['A','R','C'][i] : String(i + 1).padStart(2,'0')}</strong><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}
      </section>
      {currentPage === 'about' && <section className="integrated-proof" aria-label={locale==='en'?'A selection from our customer portfolio':locale==='de'?'Eine Auswahl aus unserem Kundenportfolio':'Une sélection de notre portefeuille clients'}><p className="integrated-kicker">{locale==='en'?'A selection from our customer portfolio':locale==='de'?'Eine Auswahl aus unserem Kundenportfolio':'Une sélection de notre portefeuille clients'}</p><div>{customerProofLogos.map(customer=><img key={customer.name} src={customer.assetPath} alt={customer.name}/>)}</div><p>{locale==='en'?'Solutions and configurations vary by organisation.':locale==='de'?'Lösungen und Konfigurationen unterscheiden sich je Organisation.':'Les solutions et configurations varient selon les organisations.'}</p></section>}
      {currentPage === 'about' && <section className="integrated-impact" aria-labelledby="integrated-impact-title">
        <p className="integrated-kicker">{reachCopy[locale].title}</p>
        <div className="integrated-reach-row">{reachCopy[locale].values.map(item => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
        <p className="integrated-kicker">{impactCopy[locale].kicker}</p>
        <div className="integrated-impact-layout">
          <div><h2 id="integrated-impact-title">{impactCopy[locale].title}</h2><p>{impactCopy[locale].intro}</p></div>
          <div className="integrated-impact-copy">
            <h3>{impactCopy[locale].fund}</h3>
            <p>{impactCopy[locale].partnership}</p>
            <p className="integrated-impact-contribution">{impactCopy[locale].contribution}</p>
          </div>
        </div>
      </section>}
    </main>
  </>;
}
export type { PFMArea, PFMPage } from './pfm-copy';
