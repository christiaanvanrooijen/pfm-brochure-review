import { brochureStyles } from './styles';
import { brochureCopy } from './copy';

/** Portable PFM brochure template v2. No React, framework, storage or pricing dependency. */
export type DocumentLocale = 'en' | 'de' | 'fr';
export interface DocumentImage { src: string; caption: string; background?: string }
export interface DocumentFact { label: string; value: string }
export interface TechnologySection {
 id: string;
 locale: DocumentLocale;
 title: string;
 model: string;
 description: string;
 hardware?: DocumentImage;
 principle?: DocumentImage;
 essentials: readonly DocumentFact[];
 specifications: readonly DocumentFact[];
}
export interface BrochureApplication {
 id: string;
 title: string;
 answer: string;
 measurement?: string;
 limit?: string;
 report: string;
 decision: string;
 columns?: readonly [string, string, string];
 methodIds: readonly string[];
 image?: DocumentImage;
 reportImage?: DocumentImage;
 reportChart?: {title:string; caption:string; values:readonly {label:string;value:number}[]};
 /** Trusted markup rendered from managed, escaped supporting copy. */
 supportingHtml?: string;
}

export interface BrochureDocument {
 documentType: 'brochure';
 locale: DocumentLocale;
 theme: 'brand' | 'light';
 segment: string;
 title: string;
 focus?: string;
 lead: string;
 hero?: DocumentImage;
 logo?: string;
 whiteLogo?: string;
 applications: readonly BrochureApplication[];
 technologies: readonly TechnologySection[];
 about: { title: string; body: string; arc: string };
 steps: readonly DocumentFact[];
 privacy?: { title: string; body: string; image?: DocumentImage };
 logos: readonly {name: string; src: string}[];
 nextText: string;
}
export const escapeDocumentText=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const e=escapeDocumentText;
const labels={
 en:{works:'How it works',needs:'What is needed on site',specs:'Technical specifications',example:'Example implementation · site and configuration subject to review',image:'Measurement principle',missing:'Model-specific specifications are confirmed after selecting the camera, processing hardware and site design.'},
 de:{works:'So funktioniert es',needs:'Voraussetzungen vor Ort',specs:'Technische Spezifikationen',example:'Beispielimplementierung · Standort und Konfiguration werden geprüft',image:'Messprinzip',missing:'Modellspezifische Daten werden nach Auswahl der Kamera, Verarbeitungshardware und Standortplanung bestätigt.'},
 fr:{works:'Comment cela fonctionne',needs:'Prérequis sur site',specs:'Spécifications techniques',example:'Exemple d’implémentation · site et configuration à valider',image:'Principe de mesure',missing:'Les spécifications sont confirmées après choix de la caméra, du matériel de traitement et de la conception du site.'},
};
const isImage = (source: string) => /^data:image\/[a-z0-9.+-]+;base64,/i.test(source);
const imageTag = (source: string, alt: string) => isImage(source) ? `<img src="${e(source)}" alt="${e(alt)}">` : '';

function figure(image:DocumentImage|undefined,className:string,zoom?:string){
 if(!image||!isImage(image.src))return '';
 const color=image.background&&/^#[0-9a-f]{3,8}$/i.test(image.background)?image.background:undefined;
 return `<figure class="${className}"${zoom ? ` data-zoom="${e(zoom)}"` : ''}><div class="document-image-stage"${color?` style="background:${color}"`:''}>${imageTag(image.src, image.caption)}</div><figcaption>${e(image.caption)}</figcaption></figure>`;
}
export function renderTechnologySection(input:TechnologySection):string {
 const c=labels[input.locale];
 return `<article class="technology-sheet" id="technology-${e(input.id)}"><div class="technology-heading"><p class="eyebrow">${e(c.works)}</p><h3>${e(input.title)}</h3><p class="technology-scope">${e(c.example)}</p></div><div class="technology-intro">${figure(input.hardware,'hardware-image',brochureCopy[input.locale].zoom)}<div class="technology-description">${input.model === input.title ? '' : `<span class="eyebrow">${e(input.model)}</span>`}<h4>${e(c.works)}</h4><p>${e(input.description)}</p></div></div><h4 class="technology-label">${e(c.needs)}</h4><div class="requirements-grid">${input.essentials.map(f=>`<div class="requirement"><strong>${e(f.label)}</strong><p>${e(f.value)}</p></div>`).join('')}</div><div class="technology-evidence">${figure(input.principle,'principle-image',brochureCopy[input.locale].zoom)}<div class="technology-specs"><h4>${e(c.specs)}</h4>${input.specifications.length?`<table><tbody>${input.specifications.map(f=>`<tr><th scope="row">${e(f.label)}</th><td>${e(f.value)}</td></tr>`).join('')}</tbody></table>`:`<p class="missing-specs">${e(c.missing)}</p>`}</div></div></article>`;
}
export function renderCustomerProof(locale:DocumentLocale,logos:readonly {name:string;src:string}[]):string{
 const c={en:['A selection from our customer portfolio','Solutions and configurations vary by organisation.'],de:['Eine Auswahl aus unserem Kundenportfolio','Lösungen und Konfigurationen unterscheiden sich je Organisation.'],fr:['Une sélection de notre portefeuille clients','Les solutions et configurations varient selon les organisations.']}[locale];
 if (!logos.length) return '';
 return `<div class="customer-proof"><p class="eyebrow">${e(c[0])}</p><div class="customer-proof-logos">${logos.map(logo=>imageTag(logo.src,logo.name)).join('')}</div><p class="customer-proof-note">${e(c[1])}</p></div>`;
}
const contact = 'https://www.pfm-intelligence.com/contact';

function renderFooter(locale: DocumentLocale, logo?: string) {
 const [eyebrow, title, focus, intro, offices, nl, uk, de, fr, paris, network, networkTitle, networkText, tagline] = brochureCopy[locale].footer;
 const locations = [[nl, 'Alphen aan den Rijn', true], [uk, 'Redditch'], [de, 'Berlin'], [fr, paris]] as const;
 return `<footer id="offices" class="pfm-footer" aria-label="${e(offices)}">
  <div class="pfm-footer__inner">
   <div class="pfm-footer__top">
    <div><div class="pfm-footer__logo">${imageTag(logo ?? '', 'PFM') || '<strong>PFM</strong>'}</div>
    <p class="pfm-footer__eyebrow">${e(eyebrow)}</p><h2 class="pfm-footer__headline">${e(title)}<br><span>${e(focus)}</span></h2></div>
    <p class="pfm-footer__intro">${e(intro)}</p>
   </div>
   <div class="pfm-footer__body">
    <section aria-labelledby="pfm-office-heading"><h3 id="pfm-office-heading" class="pfm-footer__label">${e(offices)}</h3>
     <div class="pfm-footer__offices">${locations.map(([name, city, hq]) => `<div><h4 class="pfm-footer__office-name">${e(name)}${hq ? ' <small>HQ</small>' : ''}</h4><p class="pfm-footer__city">${e(city)}</p></div>`).join('')}</div>
    </section>
    <section class="pfm-footer__network" aria-labelledby="pfm-partner-heading"><h3 id="pfm-partner-heading" class="pfm-footer__label">${e(network)}</h3>
     <svg class="pfm-footer__globe" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12.2" stroke="currentColor" stroke-width="1.6"/><path d="M4 16h24M16 3.8c-4.2 3.4-6.3 7.5-6.3 12.2s2.1 8.8 6.3 12.2M16 3.8c4.2 3.4 6.3 7.5 6.3 12.2S20.2 24.8 16 28.2M6.1 9.6h19.8M6.1 22.4h19.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
     <p class="pfm-footer__network-intro">${e(networkTitle)}</p><p class="pfm-footer__network-note">${e(networkText)}</p>
    </section>
   </div>
   <div class="pfm-footer__bottom"><p class="pfm-footer__tagline">© 2026 PFM Intelligence Group · ${e(tagline)}</p><a href="${contact}">pfm-intelligence.com ↗</a></div>
  </div>
 </footer>`;
}

const controls = `<script>
const reports = [...document.querySelectorAll('.report')];
const choices = [...document.querySelectorAll('.proof-controls button')];
function showReport(index) {
  reports.forEach((item, position) => { item.hidden = position !== index; });
  choices.forEach((item, position) => item.setAttribute('aria-pressed', String(position === index)));
}
if (choices.length) {
  document.querySelector('.proof-controls').hidden = false;
  choices.forEach((button, index) => button.addEventListener('click', () => showReport(index)));
  showReport(0);
}
const dialog = document.querySelector('dialog');
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('figure[data-zoom] img').forEach(image => {
    const figure = image.closest('figure');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'zoom-button';
    button.setAttribute('aria-label', figure.dataset.zoom + ' · ' + image.alt);
    image.before(button);
    button.append(image);
    button.addEventListener('click', () => {
      const enlarged = dialog.querySelector('img');
      enlarged.src = image.src;
      enlarged.alt = image.alt;
      dialog.querySelector('p').textContent = figure.querySelector('figcaption').textContent;
      dialog.showModal();
    });
  });
}
document.querySelector('.print-button').addEventListener('click', () => window.print());
</script>`;

function renderReportChart(chart: NonNullable<BrochureApplication['reportChart']>, locale: DocumentLocale) {
 const maximum = Math.ceil(Math.max(...chart.values.map(point => point.value), 1) / 5000) * 5000;
 const number = new Intl.NumberFormat(locale === 'en' ? 'en-GB' : locale);
 const ticks = [maximum, maximum * 2 / 3, maximum / 3, 0].map(value => `<span>${number.format(Math.round(value))}</span>`).join('');
 return `<figure class="report-chart"><div class="chart-title"><span>Store Map</span><strong>${e(chart.title)}</strong></div>
  <div class="chart-body"><div class="chart-axis" aria-hidden="true">${ticks}</div><ul class="chart-plot">${chart.values.map(({label,value}) => `
   <li style="--bar:${value / maximum * 100}%"><div><b>${number.format(value)}</b><i aria-hidden="true"></i></div><span>${e(label)}</span></li>`).join('')}</ul></div>
  <figcaption>${e(chart.caption)}</figcaption></figure>`;
}

export function renderCustomerDocument(input: BrochureDocument): string {
 const c = brochureCopy[input.locale];
 const { applications, technologies } = input;
 const hasTechnical = applications.some(item => item.measurement) || technologies.length > 0 || !!input.privacy;
 const nav = [
  ['application', c.application],
  ...(hasTechnical ? [['measurement', c.measurement]] : []),
  ['report', c.report], ['pfm', c.partner], ['next', c.next],
 ];
 const logo = imageTag((input.theme === 'brand' ? input.whiteLogo : input.logo) ?? '', 'PFM') || '<strong>PFM.</strong>';
 const hero = input.hero && isImage(input.hero.src) ? `<figure>${imageTag(input.hero.src, input.hero.caption)}<figcaption>${e(input.hero.caption)}</figcaption></figure>` : '';
 const summaries: [string, readonly string[]][] = [
  [c.selection, applications.map(item => item.title)],
 ];
 if (technologies.length) summaries.push([c.methods, technologies.map(item => item.model)]);
 const outputs = applications.flatMap(item => item.columns ? [item.columns[2]] : []);
 summaries.push([c.report, outputs.length === applications.length ? outputs : [c.outcome]]);

 const methods = new Map(technologies.map(item => [item.id, item.title]));
 const rows = applications.map(item => {
  const visual = item.image && isImage(item.image.src) ? `<figure class="application-visual">${imageTag(item.image.src, item.image.caption)}<figcaption>${e(item.image.caption)}</figcaption></figure>` : '';
  return `<article id="application-${e(item.id)}" class="row"><div>${visual}<div class="application-heading"><h3>${e(item.title)}</h3><p>${e(item.answer)}</p></div></div>
   <div>${item.measurement ? `<p>${e(item.measurement)}</p>` : ''}
   ${item.limit ? `<p class="limit">${e(item.limit)}</p>` : ''}
   ${item.methodIds.length ? `<div class="methods">${item.methodIds.map(id => `<a href="#technology-${e(id)}">${e(methods.get(id) ?? '')}</a>`).join('')}</div>` : ''}
   ${item.supportingHtml ?? ''}</div></article>`;
 }).join('');
 const reports = applications.map(item => {
  const image = item.reportImage;
  const labels = {en:['Area','Period','Output'],de:['Bereich','Zeitraum','Ausgabe'],fr:['Zone','Période','Résultat']}[input.locale];
  const sample = image && isImage(image.src)
   ? `<figure data-zoom="${e(c.zoom)}">${imageTag(image.src, image.caption)}<figcaption>${e(image.caption)}</figcaption></figure>`
   : item.reportChart
    ? renderReportChart(item.reportChart, input.locale)
   : item.columns
    ? `<div class="report-sample"><strong>${e(c.example)}</strong><dl>${item.columns.map((field, i) => `<div><dt>${e(labels[i])}</dt><dd>${e(field)}</dd></div>`).join('')}</dl></div>`
    : '';
  return `<article class="report${sample ? '' : ' no-image'}" id="report-${e(item.id)}">${sample ? `<div class="report-media">${sample}</div>` : ''}
   <div class="report-copy"><h3>${e(item.title)}</h3><p>${e(item.report)}</p><strong class="decision-label">${e(c.decision)}</strong><p>${e(item.decision)}</p></div></article>`;
 }).join('');
 const privacy = input.privacy ? `<div class="note"><h3>${e(input.privacy.title)}</h3><p>${e(input.privacy.body)}</p>${figure(input.privacy.image, 'application-visual')}</div>` : '';
 return `<!doctype html><html lang="${input.locale === 'en' ? 'en-GB' : input.locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="pfm-template-version" content="2.0.0"><meta name="pfm-document-type" content="${input.documentType}"><title>PFM · ${e(c.edition)} · ${e(input.segment)}</title><style>${brochureStyles}</style></head>
  <body class="${input.theme}"><a class="skip" href="#application">${e(c.application)}</a>
   <header class="masthead"><div class="mast">${logo}<span>${e(c.edition)}</span></div>
    <nav aria-label="${e(c.edition)}">${nav.map(([id, label]) => `<a href="#${id}">${e(label)}</a>`).join('')}</nav>
    <button class="pill print-button" type="button">${e(c.print)}</button></header>
   <main><section class="hero band${hero ? ' with-hero' : ''}"><article><div class="eyebrow">${e(input.segment)}</div><h1>${e(input.title)}${input.focus ? ` <em>${e(input.focus)}</em>` : ''}</h1><p>${e(input.lead)}</p><a class="btn" href="#next">${e(c.explore)}</a></article>${hero}</section>
    <div class="band summary">${summaries.map(([label, values]) => `<div><small>${e(label)}</small>${values.map(value => `<b>${e(value)}</b>`).join('')}</div>`).join('')}</div>
    <section id="application" class="band"><h2 class="eyebrow">${e(c.application)}</h2><div class="rows${applications.length === 2 && applications.every(item => item.image) ? ' application-cards' : ''}">${rows}</div></section>
    ${hasTechnical ? `<section id="measurement" class="band pale technical-band"><div class="intro"><h2>${e(c.measurement)}</h2>${technologies.length ? `<p>${e(c.measurementIntro)}</p>` : ''}</div>${technologies.map(renderTechnologySection).join('')}${privacy}</section>` : ''}
    <section id="report" class="band reportarea"><div class="intro"><h2>${e(c.report)}</h2></div>
     ${applications.length > 1 ? `<div class="proof-controls" role="group" aria-label="${e(c.report)}" hidden>${applications.map(item => `<button type="button" class="pill" aria-controls="report-${e(item.id)}" aria-pressed="false">${e(item.title)}</button>`).join('')}</div>` : ''}${reports}</section>
    <section id="pfm" class="band"><p class="eyebrow">${e(c.partner)}</p><div class="intro"><h2>${e(input.about.title)}</h2><p>${e(input.about.body)}</p></div>
     <div class="steps">${input.steps.map(step => `<div class="step"><h3>${e(step.label)}</h3><p>${e(step.value)}</p></div>`).join('')}</div>
     <p class="note">${e(input.about.arc)}</p>${renderCustomerProof(input.locale, input.logos)}</section>
    <section id="next" class="band next"><div><p class="eyebrow">${e(c.next)}</p><h2>${e(c.nextTitle)}</h2></div><div><p>${e(input.nextText)}</p><a class="btn" href="${contact}">${e(c.explore)}</a></div></section>
   </main>${renderFooter(input.locale, input.whiteLogo)}
   <dialog aria-labelledby="image-detail"><div class="dialog-head"><strong id="image-detail">${e(c.detail)}</strong><form method="dialog"><button class="pill" type="submit">${e(c.close)}</button></form></div><img alt=""><p></p></dialog>
   ${controls}</body></html>`;
}
