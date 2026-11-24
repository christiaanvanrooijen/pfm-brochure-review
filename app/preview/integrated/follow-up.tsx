'use client';

import { useEffect, useState } from 'react';
import { customerProofLogos } from '../../content/customer-logos';
import { certificationContent } from '../../content/pfm-certifications';
import { escapeDocumentText as esc, renderCustomerDocument, type BrochureApplication, type DocumentImage, type TechnologySection } from '../../lib/customer-document/template';
import { applicationCopy, brochureCopy, retailCombinedCover, supplementCopy } from '../../lib/customer-document/copy';
import type { Locale } from '../../i18n/locales';
import { segmentDefinitions } from '../../content/segments';
import autoEn from '../../../docs/reviews/automotive/locales/en.json';
import autoFr from '../../../docs/reviews/automotive/locales/fr.json';
import autoDe from '../../../docs/reviews/automotive/locales/de.json';
import { STORE_MAP } from '../../content/output-specimens/report-fixtures';
import { journeySceneCopy } from '../demo/journey';
import { demoMedia } from '../demo/registry';
import { pfmPages } from './pfm-copy';
import { implementationRequirementProfiles } from '../../content/technology-visuals';
import { resolveEssentialLabel, resolveEssentialBody, resolveDetailLabel, resolveDetailValue } from '../../i18n/domain-requirements';

type Text = Record<Locale, string>;
type Extra = { id: string; label: Text; body: Text };
const extras: Extra[] = [
 {id:'counting3d',label:{en:'3D Sensor',de:'3D-Sensor',fr:'Capteur 3D'},body:{en:'Overhead 3D stereo vision counts entrance crossings, with processing on the device. Placement and configured privacy level determine the measurement scope.',de:'3D-Stereosicht von oben zählt Eingangsübertritte mit Verarbeitung im Gerät. Platzierung und Datenschutzstufe bestimmen den Messumfang.',fr:'La vision stéréo 3D en hauteur compte les passages avec traitement dans le capteur. Le placement et le niveau de confidentialité définissent le périmètre.'}},
 {id:'ip',label:{en:'IP Detection Sensor',de:'IP-Sensor zur Objekterkennung',fr:'Capteur de détection IP'},body:{en:'Configured camera analytics detect movement in selected views. Privacy masking, processing, retention and access must be defined for the implementation.',de:'Konfigurierte Kameraanalytik erkennt Bewegungen in gewählten Ansichten. Maskierung, Verarbeitung, Speicherung und Zugriff werden je Implementierung festgelegt.',fr:'L’analyse vidéo configurée détecte les mouvements dans les vues choisies. Masquage, traitement, conservation et accès sont définis selon l’implémentation.'}},
 {id:'lidar',label:{en:'LiDAR in store',de:'LiDAR im Store',fr:'LiDAR en magasin'},body:{en:'LiDAR can support spatial movement measurement in a configured area. Coverage and outputs depend on the site and implementation.',de:'LiDAR kann räumliche Bewegungen in einem konfigurierten Bereich erfassen. Abdeckung und Ergebnisse hängen vom Standort und der Implementierung ab.',fr:'Le LiDAR peut mesurer les mouvements spatiaux dans une zone configurée. La couverture et les résultats dépendent du site et de l’implémentation.'}},
 {id:'tracking',label:{en:'3D tracking in store',de:'3D-Tracking im Store',fr:'Suivi 3D en magasin'},body:{en:'Configured 3D tracking can represent movement paths and time in defined areas. The available output depends on the implementation.',de:'Konfiguriertes 3D-Tracking kann Bewegungswege und Aufenthaltszeiten in definierten Bereichen darstellen. Die Ausgabe hängt von der Implementierung ab.',fr:'Le suivi 3D configuré peut représenter les parcours et le temps passé dans des zones définies. Les résultats dépendent de l’implémentation.'}},
 {id:'packages',label:{en:'Service packages',de:'Servicepakete',fr:'Offres de service'},body:{en:'Essential, Professional and Enterprise offer different reporting and service scopes. The applicable features and conditions are agreed for each solution.',de:'Essential, Professional und Enterprise bieten unterschiedliche Berichts- und Serviceumfänge. Leistungen und Bedingungen werden für jede Lösung vereinbart.',fr:'Essential, Professional et Enterprise proposent différents périmètres de reporting et de service. Les fonctionnalités et conditions sont convenues pour chaque solution.'}},
 {id:'assurance',label:{en:'Certifications and hosting',de:'Zertifizierungen und Hosting',fr:'Certifications et hébergement'},body:{en:'PFM’s accreditations cover information security, quality, environmental management and relevant installation and safety work.',de:'PFMs Akkreditierungen umfassen Informationssicherheit, Qualität, Umweltmanagement sowie relevante Installations- und Sicherheitsarbeiten.',fr:'Les accréditations de PFM couvrent la sécurité de l’information, la qualité, l’environnement et les travaux d’installation et de sécurité concernés.'}},
];
const ui = {
 en:{nav:'Follow-up',kicker:'Customer brochure',title:'Build a brochure for your prospect.',lead:'Choose the location type and applications. Preview the brochure and download it as a shareable HTML file.',segment:'Location type',topics:'Choose the applications',topicsNote:'Pick the questions relevant to this location.',clear:'Clear selection',selectedCount:'selected',extras:'Add relevant detail',platforms:'Platforms and services',methods:'Methods and technical detail',outputStyle:'Page style',brandStyle:'PFM brand · dark',lightStyle:'Light · white',includedText:'About PFM · ARC · Portfolio',preview:'Customer brochure',download:'Download customer HTML',empty:'Choose an application to build the brochure.',previewTitle:'Live brochure preview',loading:'Preparing images…',selectionLabel:'Your selection',remove:'Remove',add:'Add',previewEmptyTitle:'Choose what to include',previewEmptyText:'Select an application, platform or service to preview the brochure.',sectionInsights:'Platforms and insights',sectionTechnical:'Methods and services',includedBadge:'Included'},
 de:{nav:'Follow-up',kicker:'Kundenbroschüre',title:'Erstellen Sie eine Broschüre für Ihren Interessenten.',lead:'Wählen Sie Standorttyp und Anwendungen. Prüfen Sie die Broschüre in der Vorschau und laden Sie sie als HTML herunter.',segment:'Standorttyp',topics:'Anwendungen wählen',topicsNote:'Wählen Sie die Fragen, die für diesen Standort relevant sind.',clear:'Auswahl löschen',selectedCount:'ausgewählt',extras:'Passende Details ergänzen',platforms:'Plattformen und Services',methods:'Methoden und technische Details',outputStyle:'Seitenstil',brandStyle:'PFM-Marke · dunkel',lightStyle:'Hell · weiß',includedText:'Über PFM · ARC · Kundenportfolio',preview:'Kundenbroschüre',download:'Kunden-HTML herunterladen',empty:'Wählen Sie eine Anwendung für die Broschüre.',previewTitle:'Live-Vorschau der Broschüre',loading:'Bilder werden vorbereitet…',selectionLabel:'Ihre Auswahl',remove:'Entfernen',add:'Hinzufügen',previewEmptyTitle:'Broschüreninhalt wählen',previewEmptyText:'Wählen Sie eine Anwendung, Plattform oder Leistung für die Vorschau.',sectionInsights:'Plattformen und Insights',sectionTechnical:'Methoden und Services',includedBadge:'Enthalten'},
 fr:{nav:'Suivi',kicker:'Brochure client',title:'Créez une brochure pour votre prospect.',lead:'Choisissez le type de site et les applications. Prévisualisez la brochure puis téléchargez-la en HTML pour la partager.',segment:'Type de site',topics:'Choisir les applications',topicsNote:'Sélectionnez les questions pertinentes pour ce site.',clear:'Effacer la sélection',selectedCount:'sélectionnés',extras:'Ajouter les détails utiles',platforms:'Plateformes et services',methods:'Méthodes et détails techniques',outputStyle:'Style de la page',brandStyle:'Marque PFM · sombre',lightStyle:'Clair · blanc',includedText:'À propos de PFM · ARC · Portefeuille clients',preview:'Brochure client',download:'Télécharger le HTML client',empty:'Choisissez une application pour créer la brochure.',previewTitle:'Aperçu en direct de la brochure',loading:'Préparation des images…',selectionLabel:'Votre sélection',remove:'Retirer',add:'Ajouter',previewEmptyTitle:'Choisissez le contenu de la brochure',previewEmptyText:'Sélectionnez une application, une plateforme ou un service pour afficher l’aperçu.',sectionInsights:'Plateformes et insights',sectionTechnical:'Méthodes et services',includedBadge:'Inclus'},
} satisfies Record<Locale, Record<string,string>>;
const platformIds = ['data-services','toolbox','advantage','pulse'] as const;
// Existing review visuals are selected by subject; their captions describe their role.
const media: Record<string, { path: string; caption: Text }> = {
 counting3d:{path:'/assets/follow-up/3d-depth-detection.png',caption:{en:'Supplied example of a 3D depth detection view · not a thermal measurement',de:'Bereitgestelltes Beispiel einer 3D-Tiefenansicht · keine Wärmemessung',fr:'Exemple fourni de détection en profondeur 3D · pas une mesure thermique'}},
 ip:{path:'/assets/follow-up/ip-detection-privacy.png',caption:{en:'Illustration of IP detection and privacy masking · configuration-specific',de:'Illustration von IP-Erkennung und Maskierung · konfigurationsabhängig',fr:'Illustration de détection IP et de masquage · selon la configuration'}},
 'retail-street-opportunity': {path:demoMedia.retail['retail-street-opportunity'].hero!,caption:{en:'Illustrative passer-by measurement',de:'Illustrative Passantenmessung',fr:'Illustration de la mesure des passants'}},
 'retail-store-visits': {path:demoMedia.retail['retail-store-visits'].hero!,caption:{en:'Illustrative entrance measurement',de:'Illustrative Eingangsmessung',fr:'Illustration de la mesure à l’entrée'}},
 'retail-in-store-journey': {path:'/assets/technology/explainers/3d-spatial-tracking.png',caption:{en:'Illustrative in-store movement paths',de:'Illustrative Bewegungswege im Store',fr:'Illustration des parcours en magasin'}},
 'retail-zone-engagement': {path:'/assets/technology/explainers/3d-spatial-tracking.png',caption:{en:'Illustrative movement through store zones',de:'Illustrative Bewegung durch Store-Zonen',fr:'Illustration des mouvements entre les zones'}},
 advantage:{path:'/assets/integrated-review/advantage-report.png',caption:{en:'Illustrative Advantage report · example data',de:'Illustrativer Advantage-Bericht · Beispieldaten',fr:'Exemple de rapport Advantage · données illustratives'}},
 pulse:{path:'/assets/integrated-review/pulse.png',caption:{en:'Illustrative Pulse App screen',de:'Illustrative Pulse-App-Ansicht',fr:'Écran illustratif de Pulse App'}},
 tracking:{path:'/assets/follow-up/3d-tracking-video-still.jpg',caption:{en:'Frame from the supplied 3D tracking video',de:'Illustrative 3D-Bewegungsdarstellung',fr:'Représentation illustrative des mouvements 3D'}},
 lidar:{path:'/assets/follow-up/lidar-video-still.jpg',caption:{en:'Frame from the supplied in-store LiDAR video',de:'Illustratives LiDAR-Prinzip · die Abdeckung variiert',fr:'Principe LiDAR illustratif · la couverture varie'}},
 privacy:{path:'/assets/technology/explainers/retail-anonymous-classification-explainer.svg',caption:{en:'Schematic illustration of category-level detection · implementation and privacy scope vary',de:'Schematische Darstellung der Erkennung auf Kategorieebene · Datenschutz und Implementierung variieren',fr:'Illustration schématique de la détection par catégorie · le périmètre dépend de l’implémentation'}},
 'hardware-tracking':{path:'/assets/technology/spatial/xovis-pf-l-transparent.png',caption:{en:'3D · example hardware',de:'3D · Beispielhardware',fr:'3D · exemple de matériel'}},
 'hardware-lidar':{path:'/assets/technology/spatial/robosense-airy-transparent.png',caption:{en:'LiDAR · example hardware',de:'LiDAR · Beispielhardware',fr:'LiDAR · exemple de matériel'}},
 'hardware-ip':{path:'/assets/technology/ip-detection/bosch-flexidome-micro-3100i.png',caption:{en:'Example IP detection camera',de:'Beispiel einer IP-Kamera',fr:'Exemple de caméra IP'}},
 sensor:{path:'/assets/technology/entrance/xovis-pc2se-transparent.png',caption:{en:'Example sensor · subject to site and implementation review',de:'Sensorbeispiel · vorbehaltlich Standort- und Implementierungsprüfung',fr:'Exemple de capteur · sous réserve d’une étude du site et de l’implémentation'}},
};

// Crops of the matching “What you get” specimen, with only the relevant panel.
const reportPanels: Readonly<Record<string, Text>> = {
 'retail-store-visits': {en:'Northstar Utrecht · March 2026 · fictional entrance footfall by weekday and hour',de:'Northstar Utrecht · März 2026 · fiktive Eintritte je Wochentag und Stunde',fr:'Northstar Utrecht · mars 2026 · entrées fictives par jour et par heure'},
 'retail-visitor-composition': {en:'Northstar Utrecht · March 2026 · illustrative estimated mean group size by weekday and hour',de:'Northstar Utrecht · März 2026 · beispielhafte geschätzte mittlere Gruppengröße je Wochentag und Stunde',fr:'Northstar Utrecht · mars 2026 · estimation illustrative de la taille moyenne des groupes par jour et heure'},
 'retail-zone-engagement': {en:'Northstar Store A · illustrative store map with sections shaded by the selected LiDAR metric (STAR) · 29 September to 4 October 2025',de:'Northstar Store A · beispielhafter Zonenplan mit Einfärbung nach der gewählten LiDAR-Kennzahl (STAR) · 29. September bis 4. Oktober 2025',fr:'Northstar Store A · carte illustrative des zones selon l’indicateur LiDAR sélectionné (STAR) · du 29 septembre au 4 octobre 2025'},
 'retail-conversion-sales-context': {en:'Northstar Utrecht · March 2026 · illustrative daily visits and conversion (transactions divided by visits)',de:'Northstar Utrecht · März 2026 · illustrative tägliche Besuche und Conversion (Transaktionen geteilt durch Besuche)',fr:'Northstar Utrecht · mars 2026 · visites quotidiennes et conversion illustratives (transactions divisées par visites)'},
 'shopping-centre-entrances': {en:'Illustrative shopping-centre footfall by hour for the selected and comparison periods',de:'Illustrative stündliche Center-Besuche für Auswahl- und Vergleichszeitraum',fr:'Fréquentation horaire illustrative du centre pour les périodes sélectionnée et comparée'},
 'shopping-centre-visitor-composition': {en:'Illustrative shopping-centre visitor mix and estimated average group size',de:'Illustrativer Center-Besuchermix und geschätzte mittlere Gruppengröße',fr:'Composition illustrative des visiteurs du centre et taille moyenne estimée des groupes'},
 'shopping-centre-brand-counting': {en:'Illustrative monthly pattern in average daily visits for a shopping-centre location',de:'Illustrativer Monatsverlauf der mittleren täglichen Besuche eines Center-Standorts',fr:'Profil mensuel illustratif des visites quotidiennes moyennes d’un emplacement du centre'},
 'shopping-centre-brand-flow': {en:'Illustrative brand affinity for the selected centre portfolio',de:'Illustrative Markenaffinität für das ausgewählte Center-Portfolio',fr:'Affinité illustrative entre enseignes du portefeuille de centres sélectionné'},
 'shopping-centre-zone-anchor-exposure': {en:'Illustrative floor plan shaded by store footfall',de:'Illustrativer Etagenplan mit Einfärbung nach Ladenfrequenz',fr:'Plan illustratif par niveau, coloré selon la fréquentation des magasins'},
 'shopping-centre-catchment-area': {en:'Illustrative shopping-centre catchment by visitor origin · aggregate context',de:'Illustratives Center-Einzugsgebiet nach Besucherherkunft · aggregierter Kontext',fr:'Zone de chalandise illustrative selon l’origine des visiteurs · contexte agrégé'},
};

for (const [id, caption] of Object.entries(reportPanels)) {
 media[`report-${id}`] = {path:`/assets/follow-up/reports/${id}.webp`, caption};
}

function reportAssetId(id: string) {
 const scene = id === 'counting3d' ? 'retail-store-visits' : id;
 return reportPanels[scene] ? `report-${scene}` : id === 'advantage' || id === 'pulse' ? id : '';
}

for (const segment of segmentDefinitions) {
 for (const id of segment.coreRoute) {
  const path = demoMedia[segment.id][id]?.hero;
  if (path && !path.includes('/content-candidates/') && !media[id]) media[id] = {
   path, caption: {en:'Illustrative visual',fr:'Visuel illustratif',de:'Illustrative Darstellung'},
  };
 }
}

const automotive = { en: autoEn, fr: autoFr, de: autoDe };
const retailCoverPaths: Readonly<Record<string, string | null>> = {
 'retail-store-visits': demoMedia.retail['retail-store-visits'].hero,
 'retail-street-opportunity': demoMedia.retail['retail-street-opportunity'].hero,
};
const coverCaptions: Text = {
 en:'Northstar Retail Group · illustrative location', de:'Northstar Retail Group · illustrativer Standort', fr:'Northstar Retail Group · site illustratif',
};

const topicMethods: Record<string, readonly string[]> = {
 'automotive-entrance':['counting3d'],
 'automotive-destinations':['tracking','lidar'],
 'automotive-routes':['tracking','lidar'],
 'automotive-dwell':['tracking','lidar'],
 'retail-street-opportunity':['ip'],
 'retail-store-visits':['counting3d'],
 'retail-visitor-composition':['counting3d'],
 'retail-in-store-journey':['tracking','lidar'],
 'retail-zone-engagement':['tracking','lidar'],
};
const methodHardware = { counting3d:'sensor', tracking:'hardware-tracking', lidar:'hardware-lidar', ip:'hardware-ip' } as const;
type MethodId = keyof typeof methodHardware;
const methodProfiles: Record<MethodId, {profile:string; model:string; background?:string}> = {
 counting3d:{profile:'impl-xovis-3d-entrance',model:'3D Sensor',background:'#0000ff'},
 tracking:{profile:'impl-xovis-3d-spatial',model:'3D Tracking Sensor',background:'#000000'},
 lidar:{profile:'impl-lidar-spatial',model:'LiDAR Sensor',background:'#000000'},
 ip:{profile:'impl-ip-detection-outdoor',model:'IP Detection Sensor'},
};
const isMethod = (id: string): id is MethodId => Object.hasOwn(methodHardware, id);
const technicalCopy = {
 en:{included:'Technical explanation included',specs:'Sensor, installation and specifications'},
 de:{included:'Technische Erklärung enthalten',specs:'Sensor, Installation und Spezifikationen'},
 fr:{included:'Explication technique incluse',specs:'Capteur, installation et spécifications'},
};

type Topic = Omit<BrochureApplication, 'image' | 'reportImage' | 'supportingHtml'>;

function makeSupplements(locale: Locale, selected: readonly string[], methodIds: readonly MethodId[], topics: readonly Topic[]): Topic[] {
 const standaloneMethods = methodIds.filter(id => !topics.some(topic => topic.methodIds.includes(id)));
 const methods = standaloneMethods.map((id): Topic => {
  const item = extras.find(extra => extra.id === id)!;
  const applied = id === 'counting3d' ? applicationCopy['retail-store-visits'][locale] : id === 'ip' ? applicationCopy['retail-street-opportunity'][locale] : undefined;
  if (applied) return {
   id, title:applied.question, answer:applied.answer, measurement:applied.measurement,
   report:applied.report, decision:applied.decision, columns:applied.columns, methodIds:[id],
  };
  const [title, report, decision] = supplementCopy[locale][id as 'tracking' | 'lidar'];
  return {id, title, answer:item.body[locale], measurement:item.body[locale], report, decision, methodIds:[id]};
 });
 const platforms = platformIds.filter(id => selected.includes(id)).map((id): Topic => {
  const [title, report, decision] = supplementCopy[locale][id];
  return {id, title, answer:pfmPages[locale][id].lead, report, decision, methodIds:[]};
 });
 const services = (['packages','assurance'] as const).filter(id => selected.includes(id)).map((id): Topic => {
  const [title, report, decision] = supplementCopy[locale][id];
  return {id, title, answer:extras.find(extra => extra.id === id)!.body[locale], report, decision, methodIds:[]};
 });
 return [...methods, ...platforms, ...services];
}

async function embedAsset(path: string) {
 const response = await fetch(path);
 if (!response.ok) throw new Error(path);
 const original = await response.blob();
 if (!original.type.startsWith('image/')) throw new Error(path);
 let blob = original;
 if (original.size > 300_000 && /^image\/(png|jpeg|webp)$/.test(original.type)) {
  try {
   const bitmap = await createImageBitmap(original);
   try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Unable to decode image');
    context.drawImage(bitmap, 0, 0);
    const compact = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.93));
    if (compact?.type === 'image/webp' && compact.size < original.size) blob = compact;
   } finally {
    bitmap.close();
   }
  } catch {
   // Keep the original asset when the browser cannot re-encode it.
  }
 }
 return new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error(path));
  reader.onerror = () => reject(new Error(path));
  reader.readAsDataURL(blob);
 });
}

export function FollowUp({locale}: {locale: Locale}) {
 const c=ui[locale];
 const [segment,setSegment]=useState('retail');
 const [outputStyle,setOutputStyle]=useState<'brand'|'light'>('brand');
 const [selected,setSelected]=useState<string[]>([]);
 const [assetState, setAssetState] = useState<{ key: string; data: Record<string,string> }>();
 const pdfLabel={en:'Save PDF',de:'PDF speichern',fr:'Enregistrer en PDF'}[locale];
 const definition = segmentDefinitions.find(item => item.id === segment);
 const segmentName = definition?.experienceName ?? definition?.name ?? 'Automotive';
 const segmentExtras = extras.filter(item => segment === 'retail' ||
   ['packages', 'assurance'].includes(item.id) ||
   (segment === 'automotive' && ['counting3d', 'tracking', 'lidar'].includes(item.id)));
 const sceneTopics: Topic[] = definition
  ? definition.coreRoute.map(id => {
    const copy = journeySceneCopy(definition.id, id, locale);
    const scoped = applicationCopy[id]?.[locale];
    return {
     id, title: scoped?.question ?? copy.question, answer: scoped?.answer ?? copy.supporting,
     measurement: scoped?.measurement ?? Object.values(copy.focus)[0]?.body ?? copy.coverageNote,
     limit: id === 'retail-street-opportunity' ? undefined : scoped ? copy.coverageNote : copy.truth, report: scoped?.report ?? copy.sequence.at(-1)?.label ?? copy.coverageNote,
     decision: scoped?.decision ?? copy.supporting, columns: scoped?.columns, methodIds: topicMethods[id] ?? [],
    };
   })
  : automotive[locale].scenes.map(scene => ({
    id:`automotive-${scene.id}`, title:scene.title.endsWith('?') ? scene.title : scene.question, answer:scene.intro, measurement:scene.source,
    report:scene.body, decision:scene.question, methodIds:topicMethods[`automotive-${scene.id}`] ?? [],
   }));
 const journeyIds = sceneTopics.map(topic => topic.id);
 const fullJourneyLabel = {en:'Select all applications',fr:'Sélectionner toutes les applications',de:'Alle Anwendungen auswählen'}[locale];
 const toggle = (id: string) => setSelected(items => items.includes(id) ? items.filter(x => x !== id) : [...items,id]);
 const topics = sceneTopics.filter(topic => selected.includes(topic.id));
 const methodIds = [...new Set([...topics.flatMap(topic => topic.methodIds), ...selected])].filter(isMethod);
 const supplements = makeSupplements(locale, selected, methodIds, topics);
 const sections = [...topics, ...supplements];
 const first = sections[0];
 const coverPath = first && retailCoverPaths[first.id];
 const needsPrivacy = topics.length > 0 || methodIds.length > 0;
 const imageIds = [...new Set([
  ...sections.map(topic => topic.id),
  ...methodIds.flatMap(id => [id, methodHardware[id]]),
  ...sections.map(topic => reportAssetId(topic.id)),
  ...(selected.includes('retail-visitor-composition') ? ['privacy'] : []),
 ])];
 const entries: [string, string][] = selected.length ? [
  ['logo','/assets/logo/pfm-logo-black.png'], ['whiteLogo','/assets/logo/pfm-logo-white.svg'],
  ...customerProofLogos.map((x): [string,string] => ['proof-'+x.name,x.assetPath]),
  ...(coverPath ? [['hero', coverPath] as [string,string]] : []),
  ...imageIds.filter(id => media[id]).map((id): [string,string] => [id, media[id].path]),
 ] : [];
 const assetKey = JSON.stringify(entries);
 useEffect(() => {
  let active = true;
  const requested: [string,string][] = JSON.parse(assetKey);
  Promise.allSettled(requested.map(async ([id,path]) => [id, await embedAsset(path)] as const)).then(results => {
   if (!active) return;
   const data = Object.fromEntries(results.flatMap(result => result.status === 'fulfilled' ? [result.value] : []));
   setAssetState({key: assetKey, data});
  });
  return () => { active = false; };
 }, [assetKey]);
 const assetsReady = assetState?.key === assetKey;
 const assets = assetsReady ? assetState.data : {};
 const exportReady = assetsReady && !!assets.logo && !!assets.whiteLogo && !!first;
 const html = first && assetsReady ? buildHtml(first) : '';
 function buildHtml(first: Topic) {
  const c = brochureCopy[locale];
  const { about, arc, privacy } = pfmPages[locale];
  const figure = (id: string): DocumentImage | undefined => media[id] && assets[id]
   ? {src: assets[id], caption: media[id].caption[locale]} : undefined;
  const editorial=(id:string)=>{
   if(id==='assurance'){
    const cert=certificationContent[locale];
    return `<div class="cert-list">${cert.rows.map(item=>`<div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p></div>`).join('')}</div><p class="detail">${esc(cert.detail)}</p>`;
   }
   const copy={
    'data-services':{
     en:[['Data validation','More than 40 years of people-counting experience inform PFM’s data validation work.'],['People','A dedicated data manager works with the customer team to investigate anomalies, gaps and missing data.'],['Typical causes','Connectivity · power supply · site works · configuration and calibration · sensor hardware and software.']],
     de:[['Datenvalidierung','Mehr als 40 Jahre Erfahrung im People Counting prägen PFMs Datenvalidierung.'],['Ansprechperson','Ein dedizierter Data Manager untersucht Auffälligkeiten und Datenlücken gemeinsam mit dem Kundenteam.'],['Häufige Ursachen','Verbindung · Stromversorgung · Bauarbeiten · Konfiguration und Kalibrierung · Sensorhardware und -software.']],
     fr:[['Validation des données','Plus de 40 ans d’expérience du comptage de personnes guident la validation des données par PFM.'],['Équipe','Un gestionnaire de données dédié examine les anomalies et les données manquantes avec l’équipe du client.'],['Causes fréquentes','Connectivité · alimentation · travaux sur site · configuration et calibration · matériel et logiciel des capteurs.']],
    },
    toolbox:{
     en:[['01 · Measure','Modern sensors produce signals at the customer site.'],['02 · Transfer','Data is pushed via HTTPS to a REST API in the AWS cloud ecosystem.'],['03 · Manage','Toolbox supports data management, event processing, data-lake storage and exports.'],['04 · Use','Reporting, occupancy alerts and customer exports make configured outputs available.']],
     de:[['01 · Messen','Moderne Sensoren erfassen Signale am Kundenstandort.'],['02 · Übertragen','Daten werden per HTTPS an eine REST-API im AWS-Cloud-Ökosystem gesendet.'],['03 · Verwalten','Toolbox unterstützt Datenmanagement, Ereignisverarbeitung, Data Lake und Exporte.'],['04 · Nutzen','Berichte, Belegungsalarme und Kundenexporte stellen konfigurierte Ausgaben bereit.']],
     fr:[['01 · Mesurer','Des capteurs modernes produisent des signaux sur le site du client.'],['02 · Transférer','Les données sont envoyées par HTTPS vers une API REST dans l’écosystème cloud AWS.'],['03 · Gérer','Toolbox prend en charge la gestion des données, le traitement des événements, le lac de données et les exports.'],['04 · Utiliser','Reporting, alertes d’occupation et exports rendent disponibles les résultats configurés.']],
    },

   } as const;
   const rows=copy[id as keyof typeof copy]?.[locale];
   if(!rows)return '';
   const className = id === 'toolbox' ? 'flow-list' : 'fact-list';
   return `<div class="${className}">${rows.map(([title,body])=>`<div><strong>${esc(title)}</strong><p>${esc(body)}</p></div>`).join('')}</div>`;
  };
  const technologies: TechnologySection[] = methodIds.map(id => {
   const {profile: implementation, model, background} = methodProfiles[id];
   const profile = implementationRequirementProfiles.find(p => p.implementationId === implementation)!;
   const placement = {
    en:'Validate the camera position and line of sight along the selected section of pavement on site.',
    de:'Kameraposition und freie Sicht entlang des gewählten Gehwegabschnitts vor Ort prüfen.',
    fr:'Vérifier sur site la position de la caméra et sa visibilité le long de la portion de trottoir retenue.',
   }[locale];
   const essentials = profile.essentials.map(r => ({
    label:resolveEssentialLabel(locale,r.label),
    value:id === 'ip' && r.label === 'Placement' ? placement : resolveEssentialBody(locale,profile.implementationId,r.label,r.body),
   }));
   // Outdoor reference hardware: the supplied NUE-3703-F04 datasheet, technical data.
   const ipSpecs = {
    en:['Weather protection','Impact protection','Power supply','Operating temperature'],
    de:['Wetterschutz','Stoßfestigkeit','Stromversorgung','Betriebstemperatur'],
    fr:['Protection extérieure','Résistance aux chocs','Alimentation','Température de fonctionnement'],
   }[locale];
   const specifications = id === 'ip'
    ? ['IP66','IK10','PoE IEEE 802.3af / 802.3at Type 1','−30 °C – +50 °C'].map((value, i) => ({label:ipSpecs[i],value}))
    : profile.technicalDetail.filter(r => r.status === 'source_backed').map(r => ({label:resolveDetailLabel(locale,r.label),value:resolveDetailValue(locale,profile.implementationId,r.label,r.value)}));
   const item = extras.find(x => x.id === id)!;
   const principle = figure(id);
   return {id, locale, title:item.label[locale], model: id === 'counting3d' || id === 'ip' ? item.label[locale] : model, description:item.body[locale], hardware:figure(methodHardware[id]), principle:principle ? {...principle, background} : undefined, essentials, specifications};
  });
  const usedVisualPaths = new Set<string>();
  const applications = sections.map((topic): BrochureApplication => {
   const reportId = reportAssetId(topic.id);
   const path = media[topic.id]?.path;
   const image = path && !isMethod(topic.id) && reportId !== topic.id && !usedVisualPaths.has(path) ? figure(topic.id) : undefined;
   if (image) usedVisualPaths.add(path);
   const reportPath = media[reportId]?.path;
   const reportImage = reportPath && !usedVisualPaths.has(reportPath) ? figure(reportId) : undefined;
   if (reportImage) usedVisualPaths.add(reportPath);
   const streetReport = topic.id === 'retail-street-opportunity' || topic.id === 'ip';
   return {...topic, image, reportImage,
    reportChart: streetReport ? {
     title: {en:'Street footfall by day',de:'Passantenfrequenz pro Tag',fr:'Passages piétons par jour'}[locale],
     caption: {
      en:'Illustrative Store Map extract · Northstar Store A frontage · 29 September–4 October 2025 · pedestrian passages',
      de:'Illustrativer Store-Map-Auszug · Ladenfront Northstar Store A · 29. September–4. Oktober 2025 · Passantenbewegungen',
      fr:'Extrait illustratif de Store Map · devanture Northstar Store A · 29 septembre–4 octobre 2025 · passages piétons',
     }[locale],
     values: ['Mon','Tue','Wed','Thu','Fri','Sat'].map((day, index) => ({
      label: new Intl.DateTimeFormat(locale, {weekday:'short',timeZone:'UTC'}).format(Date.UTC(2025,8,29+index)),
      value: STORE_MAP.find(point => point.d === day)!.street,
     })),
    } : undefined, supportingHtml: editorial(topic.id)};
  });
  const scenario = sections.find(topic => topic.measurement);
  const example = scenario && (applicationCopy[scenario.id]?.[locale] ??
   (scenario.id === 'counting3d' ? applicationCopy['retail-store-visits'][locale] : scenario.id === 'ip' ? applicationCopy['retail-street-opportunity'][locale] : undefined));
  const steps = scenario ? [
   {label:c.define, value:example?.steps?.[0] ?? c.defineText},
   {label:c.validate, value:example?.steps?.[1] ?? c.validateText},
   {label:c.interpret, value:example?.steps?.[2] ?? scenario.decision},
  ] : pfmPages[locale]['data-services'].rows.filter(row => row.title !== '').map(row => ({label:row.title,value:row.body}));
  const focus = first.id === 'retail-store-visits' || first.id === 'counting3d'
   ? {en:'enter your store?', de:'Ihren Store?', fr:'dans votre magasin ?'}[locale]
   : first.id === 'retail-street-opportunity' || first.id === 'ip'
    ? {en:'shopfront busiest?', de:'an Ihrem Schaufenster vorbei?', fr:'devant votre vitrine ?'}[locale] : undefined;
  const cover = selected.includes('retail-street-opportunity') && selected.includes('retail-store-visits')
   ? retailCombinedCover[locale]
   : {title:focus ? first.title.slice(0, -focus.length).trim() : first.title, focus, lead:first.answer};
  return renderCustomerDocument({
   documentType:'brochure', locale, theme:outputStyle, segment:segmentName,
   ...cover,
   hero:assets.hero ? {src:assets.hero, caption:coverCaptions[locale]} : undefined,
   logo:assets.logo, whiteLogo:assets.whiteLogo, applications, technologies,
   about:{title:about.title, body:`${about.lead} ${about.body}`, arc:arc.lead},
   steps,
   privacy:needsPrivacy ? {title:privacy.tab, body:`${privacy.lead} ${privacy.body}`, image:figure('privacy')} : undefined,
   logos:customerProofLogos.flatMap(x => assets['proof-'+x.name] ? [{name:x.name,src:assets['proof-'+x.name]}] : []),
   nextText:scenario ? c.nextText : c.serviceNext,
  });
 }
 const download=()=>{const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`PFM-brochure-${segment}-${outputStyle}-${locale}.html`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const savePdf=()=>{const win=window.open('','_blank');if(!win)return;win.addEventListener('load',async()=>{await Promise.all(Array.from(win.document.images).map(image=>image.decode().catch(()=>{})));await win.document.fonts.ready;win.focus();win.print()},{once:true});win.document.write(html);win.document.close();};
 const choices=(ids:readonly string[],group:string)=>ids.map(id=>{
  const selectedNow=selected.includes(id);
  const scene=sceneTopics.find(topic=>topic.id===id);
  const platform=platformIds.find(item=>item===id);
  const platformCopy=platform ? pfmPages[locale][platform] : undefined;
  const extra=extras.find(item=>item.id===id);
  const title=scene?.title??platformCopy?.tab??extra?.label[locale]??id;
  const description=scene?.answer??platformCopy?.lead??extra?.body[locale]??'';
  const visual=media[id]?.path;
  return <label className={`follow-choice${selectedNow?' is-selected':''}${visual?' has-visual':''}`} key={id}>
   <input type="checkbox" checked={selectedNow} onChange={()=>toggle(id)} aria-label={`${selectedNow?c.remove:c.add}: ${title}`}/>
   {visual&&<img className="follow-choice-visual" src={visual} alt="" aria-hidden="true"/>}
   <span className="follow-choice-copy"><small className="follow-choice-group">{group}</small><strong>{title}</strong><small className="follow-choice-description">{description}</small>{topicMethods[id]&&<small className="follow-technical-included">{technicalCopy[locale].included}: {topicMethods[id].map(method=>extras.find(x=>x.id===method)?.label[locale]).join(" / ")}</small>}</span>
   <span className="follow-choice-mark" aria-hidden="true">{selectedNow?'✓':'+'}</span>
  </label>;
 });
 const selectedNames = selected.map(id => ({
  id, title: sections.find(topic => topic.id === id)?.title ?? extras.find(item => item.id === id)?.label[locale] ?? id,
 }));
 const stepStatus=selected.length?`${selected.length} ${c.selectedCount}`:c.empty;
 return <main className="follow-up" lang={locale}>
  <div className="follow-hero">
   <div><p className="integrated-kicker">{c.kicker}</p><h1>{c.title}</h1><p className="follow-lead">{c.lead}</p></div>
  </div>
  <div className="follow-progress" aria-label={c.nav}><span className="is-current"><b>01</b>{c.selectionLabel}</span><i/><span className={selected.length?'is-ready':''}><b>02</b>{c.preview}</span><i/><span className={selected.length?'is-ready':''}><b>03</b>{c.download}</span></div>
  <div className="follow-grid">
   <div className="follow-builder">
    <section className="follow-step-section">
     <div className="follow-step-heading"><span>01</span><div><h2>{c.segment}</h2><p>{locale==='en'?'Choose the location you want to illustrate.':locale==='de'?'Beginnen Sie mit dem Standort, um den es geht.':'Choisissez le site à illustrer.'}</p></div></div>
     <select className="follow-segment-select" aria-label={c.segment} value={segment} onChange={e=>{setSegment(e.target.value);setSelected([])}}>{segmentDefinitions.map(s=><option key={s.id} value={s.id}>{s.experienceName??s.name}</option>)}<option value="automotive">Automotive</option></select>
    </section>

     <section className="follow-step-section">
      <div className="follow-step-heading"><span>02</span><div><h2>{c.topics}</h2><p>{c.topicsNote}</p></div></div>
      <div className="follow-journey-actions"><span>{segmentName}</span><button type="button" onClick={()=>setSelected(items=>Array.from(new Set([...items,...journeyIds])))}>{fullJourneyLabel} <b aria-hidden="true">↗</b></button></div>
      <div className="follow-choices">{choices(journeyIds,segmentName)}</div>
     </section>
     <section className="follow-step-section follow-additions">
      <div className="follow-step-heading"><span>03</span><div><h2>{c.extras}</h2><p>{locale==='en'?'Choose the platform, service or technical detail that fits the application.':locale==='de'?'Ergänzen Sie passende Plattformen, Services oder technische Details.':'Ajoutez la plateforme, le service ou le détail technique adapté.'}</p></div></div>
      <h3>{c.platforms}</h3><div className="follow-choices follow-choices-visual">{choices(platformIds,c.sectionInsights)}</div>
      <h3>{c.methods}</h3><div className="follow-choices">{choices(segmentExtras.map(item=>item.id),c.sectionTechnical)}</div>
     </section>
   </div>
   <aside className="follow-preview-column"><div className="follow-sticky">
    <div className="follow-preview-head"><div><p className="integrated-kicker">{c.preview}</p><h2>{c.previewTitle}</h2></div><span className="follow-live-dot">{locale==='en'?'LIVE':locale==='de'?'LIVE':'DIRECT'}</span></div>
    <label className="follow-output-style"><span>{c.outputStyle}</span><select value={outputStyle} onChange={e=>setOutputStyle(e.target.value as 'brand'|'light')}><option value="brand">{c.brandStyle}</option><option value="light">{c.lightStyle}</option></select></label>
    <div className="follow-selected-summary"><div className="follow-summary-title"><strong>{c.selectionLabel}</strong><span>{stepStatus}</span></div>{selectedNames.length>0?<div className="follow-selected-chips">{selectedNames.map(item=><button type="button" key={item.id} onClick={()=>toggle(item.id)} aria-label={`${c.remove}: ${item.title}`}>{item.title}<span aria-hidden="true">×</span></button>)}</div>:<p>{c.previewEmptyText}</p>}</div>
    {html?<iframe title={c.previewTitle} srcDoc={html.replace('<body class=', '<body data-preview="true" class=')} sandbox="allow-scripts"/>:<div className="follow-preview-empty"><span className="follow-preview-empty-icon" aria-hidden="true">↗</span><h3>{c.previewEmptyTitle}</h3><p>{selected.length ? c.loading : c.previewEmptyText}</p></div>}
    <div className="follow-preview-footer"><button type="button" className="integrated-button" onClick={savePdf} disabled={!exportReady}>{pdfLabel}<span aria-hidden="true">↓</span></button><small>{c.includedBadge}: {c.includedText}</small>{methodIds.length>0&&<small>{technicalCopy[locale].specs}: {methodIds.map(id=>extras.find(x=>x.id===id)?.label[locale]).join(" · ")}</small>}<button type="button" className="integrated-button" onClick={download} disabled={!exportReady}>{!selected.length||exportReady?c.download:assetsReady?({en:'Images unavailable — reload',de:'Bilder nicht verfügbar — neu laden',fr:'Images indisponibles — rechargez'}[locale]):c.loading}<span aria-hidden="true">↓</span></button></div>
   </div></aside>
  </div>
 </main>;
}
