import { customerDocumentStyles } from './styles';

/** Portable PFM document template v1. No React, framework, storage or pricing dependency. */
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
export interface CustomerDocument {
 locale: DocumentLocale;
 theme: 'brand' | 'light';
 title: string;
 lead: string;
 eyebrow: string;
 logo?: string;
 productLabel?: string;
 footerLabel?: string;
 /** Trusted markup from the content renderer. Escape user-entered text before adding it here. */
 contentHtml: string;
}
export const escapeDocumentText=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const e=escapeDocumentText;
const labels={
 en:{works:'How it works',needs:'What is needed on site',specs:'Technical specifications',example:'Example implementation · site and configuration subject to review',image:'Measurement principle',missing:'Model-specific specifications are confirmed after selecting the camera, processing hardware and site design.'},
 de:{works:'So funktioniert es',needs:'Voraussetzungen vor Ort',specs:'Technische Spezifikationen',example:'Beispielimplementierung · Standort und Konfiguration werden geprüft',image:'Messprinzip',missing:'Modellspezifische Daten werden nach Auswahl der Kamera, Verarbeitungshardware und Standortplanung bestätigt.'},
 fr:{works:'Comment cela fonctionne',needs:'Prérequis sur site',specs:'Spécifications techniques',example:'Exemple d’implémentation · site et configuration à valider',image:'Principe de mesure',missing:'Les spécifications sont confirmées après choix de la caméra, du matériel de traitement et de la conception du site.'},
};
function figure(image:DocumentImage|undefined,className:string){
 if(!image||!/^data:image\/|^https:\/\//.test(image.src))return '';
 const color=image.background&&/^#[0-9a-f]{3,8}$/i.test(image.background)?image.background:undefined;
 return `<figure class="${className}"><div class="document-image-stage"${color?` style="background:${color}"`:''}><img src="${e(image.src)}" alt="${e(image.caption)}"></div><figcaption>${e(image.caption)}</figcaption></figure>`;
}
export function renderTechnologySection(input:TechnologySection):string {
 const c=labels[input.locale];
 return `<article class="technology-sheet" id="technology-${e(input.id)}"><div class="technology-heading"><p class="eyebrow">${e(c.works)}</p><h3>${e(input.title)}</h3><p class="technology-scope">${e(c.example)}</p></div><div class="technology-intro">${figure(input.hardware,'hardware-image')}<div class="technology-description"><span class="eyebrow">${e(input.model)}</span><h4>${e(c.works)}</h4><p>${e(input.description)}</p></div></div><h4 class="technology-label">${e(c.needs)}</h4><div class="requirements-grid">${input.essentials.map((f,i)=>`<div class="requirement"><span class="requirement-number">0${i+1}</span><strong>${e(f.label)}</strong><p>${e(f.value)}</p></div>`).join('')}</div><div class="technology-evidence">${figure(input.principle,'principle-image')}<div class="technology-specs"><h4>${e(c.specs)}</h4>${input.specifications.length?`<table><tbody>${input.specifications.map(f=>`<tr><th scope="row">${e(f.label)}</th><td>${e(f.value)}</td></tr>`).join('')}</tbody></table>`:`<p class="missing-specs">${e(c.missing)}</p>`}</div></div></article>`;
}
export function renderCustomerProof(locale:DocumentLocale,logos:readonly {name:string;src:string}[]):string{
 const c={en:['A selection from our customer portfolio','Solutions and configurations vary by organisation.'],de:['Eine Auswahl aus unserem Kundenportfolio','Lösungen und Konfigurationen unterscheiden sich je Organisation.'],fr:['Une sélection de notre portefeuille clients','Les solutions et configurations varient selon les organisations.']}[locale];
 return `<div class="customer-proof"><p class="eyebrow">${e(c[0])}</p><div class="customer-proof-logos">${logos.filter(logo=>/^data:image\/|^https:\/\//.test(logo.src)).map(logo=>`<img src="${e(logo.src)}" alt="${e(logo.name)}">`).join('')}</div><p class="customer-proof-note">${e(c[1])}</p></div>`;
}
export function renderCustomerDocument(input:CustomerDocument):string {
 const logo=input.logo&&/^data:image\/|^https:\/\//.test(input.logo)?`<img src="${e(input.logo)}" alt="PFM">`:'<strong>PFM.</strong>';
 return `<!doctype html><html lang="${input.locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="pfm-template-version" content="1.0.0"><title>PFM · ${e(input.title)}</title><style>${customerDocumentStyles}</style></head><body class="${input.theme}"><div class="document-tools"><button type="button" onclick="window.print()">${e({en:"Save as PDF / Print",de:"Als PDF speichern / Drucken",fr:"Enregistrer en PDF / Imprimer"}[input.locale])}</button></div><header>${logo}<span>${e(input.productLabel??"Commercial Experience")}</span></header><div class="hero"><div class="eyebrow">${e(input.eyebrow)}</div><h1>${e(input.title)}</h1><p>${e(input.lead)}</p></div>${input.contentHtml}<footer>${e(input.footerLabel??"PFM Intelligence Group · Unlocking location potential")}</footer></body></html>`;
}
