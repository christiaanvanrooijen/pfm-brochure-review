'use client';

import { useEffect, useMemo, useState } from 'react';
import { customerProofLogos } from '../../content/customer-logos';
import { certificationContent } from '../../content/pfm-certifications';
import { renderCustomerDocument, renderTechnologySection, renderCustomerProof } from '../../lib/customer-document/template';
import type { Locale } from '../../i18n/locales';
import { segmentDefinitions } from '../../content/segments';
import { journeySceneCopy } from '../demo/journey';
import { pfmPages, type PFMPage } from './pfm-copy';
import { implementationRequirementProfiles } from '../../content/technology-visuals';
import { resolveEssentialLabel, resolveEssentialBody, resolveDetailLabel, resolveDetailValue } from '../../i18n/domain-requirements';

type Text = Record<Locale, string>;
type Extra = { id: string; label: Text; body: Text };
const extras: Extra[] = [
 {id:'counting3d',label:{en:'3D people counting · Xovis PC2SE',de:'3D-Personenzählung · Xovis PC2SE',fr:'Comptage 3D · Xovis PC2SE'},body:{en:'Overhead 3D stereo vision counts entrance crossings, with processing on the device. Placement and configured privacy level determine the measurement scope.',de:'3D-Stereosicht von oben zählt Eingangsübertritte mit Verarbeitung im Gerät. Platzierung und Datenschutzstufe bestimmen den Messumfang.',fr:'La vision stéréo 3D en hauteur compte les passages avec traitement dans le capteur. Le placement et le niveau de confidentialité définissent le périmètre.'}},
 {id:'ip',label:{en:'IP detection · privacy and installation',de:'IP-Erkennung · Datenschutz und Installation',fr:'Détection IP · confidentialité et installation'},body:{en:'Configured camera analytics detect movement in selected views. Privacy masking, processing, retention and access must be defined for the implementation.',de:'Konfigurierte Kameraanalytik erkennt Bewegungen in gewählten Ansichten. Maskierung, Verarbeitung, Speicherung und Zugriff werden je Implementierung festgelegt.',fr:'L’analyse vidéo configurée détecte les mouvements dans les vues choisies. Masquage, traitement, conservation et accès sont définis selon l’implémentation.'}},
 {id:'lidar',label:{en:'LiDAR in store',de:'LiDAR im Store',fr:'LiDAR en magasin'},body:{en:'LiDAR can support spatial movement measurement in a configured area. Coverage and outputs depend on the site and implementation.',de:'LiDAR kann räumliche Bewegungen in einem konfigurierten Bereich erfassen. Abdeckung und Ergebnisse hängen vom Standort und der Implementierung ab.',fr:'Le LiDAR peut mesurer les mouvements spatiaux dans une zone configurée. La couverture et les résultats dépendent du site et de l’implémentation.'}},
 {id:'tracking',label:{en:'3D tracking in store',de:'3D-Tracking im Store',fr:'Suivi 3D en magasin'},body:{en:'Configured 3D tracking can represent movement paths and time in defined areas. The available output depends on the implementation.',de:'Konfiguriertes 3D-Tracking kann Bewegungswege und Aufenthaltszeiten in definierten Bereichen darstellen. Die Ausgabe hängt von der Implementierung ab.',fr:'Le suivi 3D configuré peut représenter les parcours et le temps passé dans des zones définies. Les résultats dépendent de l’implémentation.'}},
 {id:'packages',label:{en:'Service packages',de:'Servicepakete',fr:'Offres de service'},body:{en:'Essential, Professional and Enterprise offer different reporting and service scopes. The applicable features and conditions are agreed for each solution.',de:'Essential, Professional und Enterprise bieten unterschiedliche Berichts- und Serviceumfänge. Leistungen und Bedingungen werden für jede Lösung vereinbart.',fr:'Essential, Professional et Enterprise proposent différents périmètres de reporting et de service. Les fonctionnalités et conditions sont convenues pour chaque solution.'}},
 {id:'assurance',label:{en:'Certifications and hosting',de:'Zertifizierungen und Hosting',fr:'Certifications et hébergement'},body:{en:'PFM’s accreditations cover information security, quality, environmental management and relevant installation and safety work.',de:'PFMs Akkreditierungen umfassen Informationssicherheit, Qualität, Umweltmanagement sowie relevante Installations- und Sicherheitsarbeiten.',fr:'Les accréditations de PFM couvrent la sécurité de l’information, la qualité, l’environnement et les travaux d’installation et de sécurité concernés.'}},
];
const accessibility: Record<Locale, { eyebrow: string; title: string; intro: string; body: string; contribution: string }> = {
 en:{eyebrow:'PFM · accessibility',title:'Supporting more accessible public spaces.',intro:'PFM applies its people-flow expertise to help clients identify features that may create barriers in public spaces.',body:'PFM established an Accessibility Fund for projects such as guide-dog training with KNGF. PFM has also worked with eZwayZ on navigation for people with visual impairments.',contribution:'A portion of each data licence sold is donated to the Accessibility Fund.'},
 de:{eyebrow:'PFM · Barrierefreiheit',title:'Öffentliche Räume zugänglicher machen.',intro:'PFM nutzt seine Expertise im Personenfluss, um Merkmale zu erkennen, die den Zugang zu öffentlichen Räumen erschweren können.',body:'PFM hat einen Accessibility Fund für Projekte wie die Ausbildung von Blindenführhunden mit KNGF eingerichtet. Gemeinsam mit eZwayZ wurde außerdem an Navigationslösungen für Menschen mit Sehbehinderung gearbeitet.',contribution:'Ein Teil jeder verkauften Datenlizenz wird an den Accessibility Fund gespendet.'},
 fr:{eyebrow:'PFM · accessibilité',title:'Pour des espaces publics plus accessibles.',intro:'PFM met son expertise des flux de personnes au service de l’identification des obstacles possibles dans les espaces publics.',body:'PFM a créé un Accessibility Fund pour soutenir des projets tels que la formation de chiens guides avec KNGF. PFM a également travaillé avec eZwayZ sur la navigation des personnes malvoyantes.',contribution:'Une partie de chaque licence de données vendue est versée à l’Accessibility Fund.'},
};
const reach: Record<Locale, { title: string; values: readonly { value: string; label: string }[] }> = {
 en:{title:'PFM in commercial locations',values:[{value:'500+',label:'shopping centres'},{value:'25,000+',label:'retail locations'},{value:'1,500+',label:'drive-thru locations'}]},
 de:{title:'PFM an Gewerbestandorten',values:[{value:'500+',label:'Einkaufszentren'},{value:'25.000+',label:'Einzelhandelsstandorte'},{value:'1.500+',label:'Drive-thru-Standorte'}]},
 fr:{title:'PFM sur des sites commerciaux',values:[{value:'500+',label:'centres commerciaux'},{value:'25 000+',label:'sites de vente au détail'},{value:'1 500+',label:'sites drive'}]},
};
const ui = {
 en:{nav:'Follow-up',kicker:'Customer follow-up · review',title:'Turn your conversation into a useful follow-up.',lead:'Choose the location story and topics you discussed. Preview a polished customer page, then download it as a shareable HTML file.',segment:'1. Location type',soon:'Retail is the complete review example. Content for other locations can be added as those journeys are completed.',topics:'Choose a topic or follow the journey',topicsNote:'Select only the questions you covered. You can also include the complete Retail journey.',allJourney:'Select the full Retail journey',clear:'Clear selection',selectedCount:'selected',extras:'Add useful context',platforms:'Platforms and services',methods:'Methods and technical detail',outputStyle:'Choose the page style',brandStyle:'PFM brand · dark cover',lightStyle:'Light · white cover',included:'Included in every follow-up',includedText:'About PFM · ARC · Privacy · Accessibility work',preview:'Your customer page',download:'Download customer HTML',empty:'Choose a topic to start building the follow-up.',previewTitle:'Live customer page preview',customerTitle:'A closer look at your location.',customerLead:'A selection of the subjects we discussed, with the information you need to continue the conversation.',selected:'What we discussed',more:'Additional information',contact:'Continue the conversation',contactText:'Your PFM contact can help you explore the right scope for your location.',illustrative:'Review example · Content and scope are subject to agreement.',view:'Preview',platformLabel:'Platform',loading:'Preparing images…',styleDark:'Editorial, high contrast',styleLight:'Open, light and calm',selectionLabel:'Your selection',remove:'Remove',previewEmptyTitle:'Your follow-up takes shape here',previewEmptyText:'Choose a question or a topic. We’ll assemble a customer-ready page with the relevant context and visuals.',sectionJourney:'Retail conversation',sectionInsights:'Platforms & insights',sectionTechnical:'Methods & service detail',story:'A clear story, ready to share',storyText:'Your chosen topics lead the page. PFM, ARC, privacy and accessibility provide the context around them.',topicImage:'Illustrative visual',includedBadge:'Always included'},
 de:{nav:'Follow-up',kicker:'Kunden-Follow-up · Vorschau',title:'Aus Ihrem Gespräch wird ein hilfreicher Rückblick.',lead:'Wählen Sie den Standorttyp und die besprochenen Themen. Prüfen Sie die gestaltete Kundenseite und laden Sie sie als HTML-Datei herunter.',segment:'1. Standorttyp',soon:'Retail ist das vollständige Review-Beispiel. Inhalte für weitere Standorttypen folgen mit den jeweiligen Journeys.',topics:'Thema wählen oder der Journey folgen',topicsNote:'Wählen Sie nur die Fragen aus, die Sie besprochen haben. Sie können auch die gesamte Retail-Journey aufnehmen.',allJourney:'Gesamte Retail-Journey auswählen',clear:'Auswahl löschen',selectedCount:'ausgewählt',extras:'Hilfreichen Kontext ergänzen',platforms:'Plattformen und Services',methods:'Methoden und technische Details',outputStyle:'Seitenstil wählen',brandStyle:'PFM Brand · dunkles Titelbild',lightStyle:'Hell · weißes Titelbild',included:'In jedem Follow-up enthalten',includedText:'Über PFM · ARC · Datenschutz · Barrierefreiheit',preview:'Ihre Kundenseite',download:'Kunden-HTML herunterladen',empty:'Wählen Sie ein Thema, um das Follow-up zu erstellen.',previewTitle:'Live-Vorschau der Kundenseite',customerTitle:'Ihr Standort im Überblick.',customerLead:'Eine Auswahl der besprochenen Themen und Informationen für den nächsten Schritt.',selected:'Unsere Gesprächsthemen',more:'Weitere Informationen',contact:'Das Gespräch fortsetzen',contactText:'Ihr PFM-Kontakt unterstützt Sie bei der Auswahl des passenden Umfangs.',illustrative:'Reviewbeispiel · Inhalte und Umfang werden vereinbart.',view:'Vorschau',platformLabel:'Plattform',loading:'Bilder werden vorbereitet…',styleDark:'Redaktionell und kontrastreich',styleLight:'Offen, hell und ruhig',selectionLabel:'Ihre Auswahl',remove:'Entfernen',previewEmptyTitle:'Hier entsteht Ihr Follow-up',previewEmptyText:'Wählen Sie eine Frage oder ein Thema. Wir stellen daraus eine Kundenseite mit passendem Kontext und Bildmaterial zusammen.',sectionJourney:'Retail-Gespräch',sectionInsights:'Plattformen & Insights',sectionTechnical:'Methoden & Serviceumfang',story:'Eine klare Geschichte zum Teilen',storyText:'Die ausgewählten Themen führen durch die Seite. PFM, ARC, Datenschutz und Barrierefreiheit ergänzen den nötigen Kontext.',topicImage:'Illustrative Darstellung',includedBadge:'Immer enthalten'},
 fr:{nav:'Suivi',kicker:'Suivi client · aperçu',title:'Faites de votre échange un suivi utile.',lead:'Choisissez le type de site et les sujets abordés. Prévisualisez une page client soignée, puis téléchargez-la en HTML pour la partager.',segment:'1. Type de site',soon:'Le Retail est l’exemple complet de cette revue. Les contenus des autres sites seront ajoutés avec leurs parcours.',topics:'Choisir un sujet ou suivre le parcours',topicsNote:'Sélectionnez uniquement les questions abordées. Vous pouvez aussi inclure tout le parcours Retail.',allJourney:'Sélectionner tout le parcours Retail',clear:'Effacer la sélection',selectedCount:'sélectionnés',extras:'Ajouter du contexte utile',platforms:'Plateformes et services',methods:'Méthodes et détails techniques',outputStyle:'Choisir le style de page',brandStyle:'Marque PFM · couverture sombre',lightStyle:'Clair · couverture blanche',included:'Inclus dans chaque suivi',includedText:'À propos de PFM · ARC · Confidentialité · Accessibilité',preview:'Votre page client',download:'Télécharger le HTML client',empty:'Choisissez un sujet pour commencer le suivi.',previewTitle:'Aperçu en direct de la page client',customerTitle:'Un regard sur votre site.',customerLead:'Une sélection des sujets abordés et des informations pour poursuivre la conversation.',selected:'Nos sujets de discussion',more:'Informations complémentaires',contact:'Poursuivre la conversation',contactText:'Votre contact PFM vous aide à définir le périmètre adapté à votre site.',illustrative:'Exemple de revue · Le contenu et le périmètre restent à convenir.',view:'Aperçu',platformLabel:'Plateforme',loading:'Préparation des images…',styleDark:'Éditorial et contrasté',styleLight:'Ouvert, clair et apaisant',selectionLabel:'Votre sélection',remove:'Retirer',previewEmptyTitle:'Votre suivi prend forme ici',previewEmptyText:'Choisissez une question ou un sujet. Nous composerons une page client avec le contexte et les visuels associés.',sectionJourney:'Échange Retail',sectionInsights:'Plateformes et insights',sectionTechnical:'Méthodes et services',story:'Un récit clair à partager',storyText:'Les sujets choisis guident la page. PFM, ARC, confidentialité et accessibilité apportent le contexte.',topicImage:'Visuel illustratif',includedBadge:'Toujours inclus'},
} satisfies Record<Locale, Record<string,string>>;
const enrich: Record<string, Text> = {
 'data-services': {en:'PFM’s data validation draws on over 40 years of experience. Data management investigates anomalies, gaps and missing data, coordinating corrections or service visits within the agreed package. Common causes include connectivity, power outages, site works, configuration, calibration and sensor hardware or software.',de:'PFMs Datenvalidierung basiert auf über 40 Jahren Erfahrung. Das Datenmanagement untersucht Auffälligkeiten und Datenlücken und koordiniert Korrekturen oder Serviceeinsätze im vereinbarten Paket. Ursachen sind etwa Verbindung, Stromausfälle, Umbauten, Konfiguration, Kalibrierung sowie Hard- oder Software.',fr:'La validation PFM s’appuie sur plus de 40 ans d’expérience. La gestion des données examine anomalies et données manquantes et coordonne corrections ou interventions selon l’offre convenue. Les causes comprennent connexion, alimentation, travaux, configuration, étalonnage et matériel ou logiciel des capteurs.'},
 toolbox:{en:'PFM Toolbox brings sites, devices, data quality, customer accounts and exports together. The supplied infrastructure overview shows sensor data pushed via HTTPS to a REST API in an AWS cloud ecosystem, with data management, event processing, a data lake and exports feeding reporting and occupancy alerts. Advantage presents the resulting dashboards and reports. Available integrations and hosting scope are agreed per solution.',de:'PFM Toolbox verbindet Standorte, Geräte, Datenqualität, Kundenkonten und Exporte. Die bereitgestellte Übersicht zeigt Sensordaten per HTTPS an eine REST-API in einem AWS-Cloud-Ökosystem. Datenmanagement, Ereignisverarbeitung, Data Lake und Exporte unterstützen Berichte und Belegungsalarme. Advantage stellt Dashboards und Berichte bereit. Integrationen und Hostingumfang werden je Lösung vereinbart.',fr:'PFM Toolbox réunit sites, appareils, qualité des données, comptes clients et exports. Le schéma fourni montre l’envoi HTTPS des données vers une API REST dans un écosystème cloud AWS. Gestion des données, événements, lac de données et exports alimentent reporting et alertes d’occupation. Advantage présente les tableaux de bord. Intégrations et hébergement sont convenus par solution.'},
 assurance:{en:'PFM’s supplied accreditation overview lists ISO/IEC 27001:2022 for information security (Information Security & Tech, Software Development and HR scope), ISO 9001:2015 for quality and ISO 14001:2015 for environmental management. It also lists NICEIC, SafeContractor (SSIP) and VCA for relevant installation and safety activities. RI&E is a risk assessment process. Applicable entities, current certificates and scope are available from PFM. The infrastructure overview identifies AWS; provider assurance and PFM certification are distinct.',de:'Die bereitgestellte PFM-Übersicht nennt ISO/IEC 27001:2022 für Informationssicherheit (Information Security & Tech, Softwareentwicklung und HR), ISO 9001:2015 für Qualität und ISO 14001:2015 für Umweltmanagement. NICEIC, SafeContractor (SSIP) und VCA betreffen relevante Installations- und Sicherheitsaktivitäten. RI&E ist ein Risikobewertungsprozess. Gesellschaften, aktuelle Zertifikate und Geltungsbereiche erhalten Sie von PFM. Die Infrastrukturübersicht nennt AWS; Anbieter-Nachweise und PFM-Zertifizierung sind getrennt.',fr:'L’aperçu fourni par PFM mentionne ISO/IEC 27001:2022 pour la sécurité de l’information (Information Security & Tech, développement logiciel et RH), ISO 9001:2015 pour la qualité et ISO 14001:2015 pour l’environnement. NICEIC, SafeContractor (SSIP) et VCA concernent les activités d’installation et de sécurité applicables. RI&E est une démarche d’évaluation des risques. Les entités, certificats actuels et périmètres sont disponibles auprès de PFM. Le schéma identifie AWS ; assurance du fournisseur et certification PFM sont distinctes.'}
};
const platformIds: readonly PFMPage[] = ['data-services','toolbox','advantage','pulse'];
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] ?? c));
const esc = escapeHtml;
// Existing review visuals are selected by subject; their captions describe their role.
const media: Record<string, { path: string; caption: Text }> = {
 counting3d:{path:'/assets/follow-up/3d-depth-detection.png',caption:{en:'Supplied example of a 3D depth detection view · not a thermal measurement',de:'Bereitgestelltes Beispiel einer 3D-Tiefenansicht · keine Wärmemessung',fr:'Exemple fourni de détection en profondeur 3D · pas une mesure thermique'}},
 ip:{path:'/assets/follow-up/ip-detection-privacy.png',caption:{en:'Illustration of IP detection and privacy masking · configuration-specific',de:'Illustration von IP-Erkennung und Maskierung · konfigurationsabhängig',fr:'Illustration de détection IP et de masquage · selon la configuration'}},
 'retail-street-opportunity': {path:'/assets/technology/explainers/passerby-physical-measurement.png',caption:{en:'Illustrative passer-by measurement',de:'Illustrative Passantenmessung',fr:'Illustration de la mesure des passants'}},
 'retail-store-visits': {path:'/assets/technology/explainers/entrance-threshold-measurement.png',caption:{en:'Illustrative entrance measurement',de:'Illustrative Eingangsmessung',fr:'Illustration de la mesure à l’entrée'}},
 'retail-visitor-composition': {path:'/assets/integrated-review/advantage-report.png',caption:{en:'Illustrative Advantage report · example data',de:'Illustrativer Advantage-Bericht · Beispieldaten',fr:'Exemple de rapport Advantage · données illustratives'}},
 'retail-in-store-journey': {path:'/assets/technology/explainers/3d-spatial-tracking.png',caption:{en:'Illustrative in-store movement paths',de:'Illustrative Bewegungswege im Store',fr:'Illustration des parcours en magasin'}},
 'retail-zone-engagement': {path:'/assets/technology/explainers/3d-spatial-tracking.png',caption:{en:'Illustrative movement through store zones',de:'Illustrative Bewegung durch Store-Zonen',fr:'Illustration des mouvements entre les zones'}},
 'retail-conversion-sales-context': {path:'/assets/integrated-review/advantage-report.png',caption:{en:'Illustrative Advantage reporting interface · not a conversion result',de:'Illustrative Advantage-Berichtsoberfläche · kein Conversion-Ergebnis',fr:'Interface de reporting Advantage illustrative · sans résultat de conversion'}},
 advantage:{path:'/assets/integrated-review/advantage-report.png',caption:{en:'Illustrative Advantage report · example data',de:'Illustrativer Advantage-Bericht · Beispieldaten',fr:'Exemple de rapport Advantage · données illustratives'}},
 pulse:{path:'/assets/integrated-review/pulse.png',caption:{en:'Illustrative Pulse App screen',de:'Illustrative Pulse-App-Ansicht',fr:'Écran illustratif de Pulse App'}},
 tracking:{path:'/assets/follow-up/3d-tracking-video-still.jpg',caption:{en:'Frame from the supplied 3D tracking video',de:'Illustrative 3D-Bewegungsdarstellung',fr:'Représentation illustrative des mouvements 3D'}},
 lidar:{path:'/assets/follow-up/lidar-video-still.jpg',caption:{en:'Frame from the supplied in-store LiDAR video',de:'Illustratives LiDAR-Prinzip · die Abdeckung variiert',fr:'Principe LiDAR illustratif · la couverture varie'}},
 privacy:{path:'/assets/technology/explainers/retail-anonymous-classification-explainer.svg',caption:{en:'Schematic illustration of category-level detection · implementation and privacy scope vary',de:'Schematische Darstellung der Erkennung auf Kategorieebene · Datenschutz und Implementierung variieren',fr:'Illustration schématique de la détection par catégorie · le périmètre dépend de l’implémentation'}},
 'hardware-tracking':{path:'/assets/technology/spatial/xovis-pf-l-transparent.png',caption:{en:'Xovis PF-L · example hardware',de:'Xovis PF-L · Beispielhardware',fr:'Xovis PF-L · exemple de matériel'}},
 'hardware-lidar':{path:'/assets/technology/spatial/robosense-airy-transparent.png',caption:{en:'RoboSense Airy · example hardware',de:'RoboSense Airy · Beispielhardware',fr:'RoboSense Airy · exemple de matériel'}},
 'hardware-ip':{path:'/assets/technology/ip-detection/bosch-flexidome-5100i-outdoor.png',caption:{en:'Example IP detection camera',de:'Beispiel einer IP-Kamera',fr:'Exemple de caméra IP'}},
 sensor:{path:'/assets/technology/entrance/xovis-pc2se-transparent.png',caption:{en:'Example sensor · subject to site and implementation review',de:'Sensorbeispiel · vorbehaltlich Standort- und Implementierungsprüfung',fr:'Exemple de capteur · sous réserve d’une étude du site et de l’implémentation'}},
};

const topicMethods: Record<string, readonly string[]> = {
 'retail-street-opportunity':['ip'],
 'retail-store-visits':['counting3d'],
 'retail-visitor-composition':['counting3d'],
 'retail-in-store-journey':['tracking','lidar'],
 'retail-zone-engagement':['tracking','lidar'],
};
const technicalCopy = {
 en:{title:'How the measurement works',lead:'These example measurement methods relate to your selected topics. Where alternatives are shown, the site survey determines the appropriate implementation.',included:'Technical explanation included',specs:'Sensor, installation and specifications',contents:'In this follow-up'},
 de:{title:'So funktioniert die Messung',lead:'Diese beispielhaften Messmethoden gehören zu Ihren Themen. Bei Alternativen bestimmt die Standortprüfung die passende Implementierung.',included:'Technische Erklärung enthalten',specs:'Sensor, Installation und Spezifikationen',contents:'In diesem Follow-up'},
 fr:{title:'Comment fonctionne la mesure',lead:'Ces exemples de méthodes correspondent aux sujets choisis. Lorsque plusieurs options sont présentées, l’étude du site détermine l’implémentation adaptée.',included:'Explication technique incluse',specs:'Capteur, installation et spécifications',contents:'Dans ce suivi'},
};

export function FollowUp({locale}: {locale: Locale}) {
 const c=ui[locale];
 const [segment,setSegment]=useState('retail');
 const [outputStyle,setOutputStyle]=useState<'brand'|'light'>('brand');
 const [selected,setSelected]=useState<string[]>([]);
 const [assets,setAssets]=useState<Record<string,string>>({});
 const [assetError,setAssetError]=useState(false);
 const logo=assets.logo;
 const pdfLabel={en:'Save PDF',de:'PDF speichern',fr:'Enregistrer en PDF'}[locale];
 const retail=segmentDefinitions.find(s=>s.id==='retail')!;
 useEffect(()=>{
  let active=true;
  const entries=[['logo','/assets/logo/pfm-logo-black.png'],...customerProofLogos.map(x=>['proof-'+x.name,x.assetPath]),...Object.entries(media).map(([id,item])=>[id,item.path])];
  Promise.all(entries.map(async ([id,path])=>{const response=await fetch(path);if(!response.ok)throw new Error(path);const blob=await response.blob();const value=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>typeof reader.result==='string'?resolve(reader.result):reject(new Error(path));reader.onerror=()=>reject(new Error(path));reader.readAsDataURL(blob)});return [id,value] as const;})).then(items=>{if(active)setAssets(Object.fromEntries(items))}).catch(()=>{if(active)setAssetError(true)});
  return()=>{active=false};
 },[]);
 const toggle=(id:string)=>setSelected(items=>items.includes(id)?items.filter(x=>x!==id):[...items,id]);
 const methodIds=useMemo(()=>Array.from(new Set(selected.flatMap(id=>topicMethods[id]??(['counting3d','tracking','lidar','ip'].includes(id)?[id]:[])))),[selected]);
 const sections=useMemo(()=>{
  const sceneSections=retail.coreRoute.filter(id=>selected.includes(id)).map(id=>{const s=journeySceneCopy('retail',id,locale);return {id,title:s.question,body:s.supporting,detail:s.truth};});
  const platformSections=platformIds.filter(id=>selected.includes(id)).map(id=>{const p=pfmPages[locale][id];return {id,title:p.tab,body:p.lead,detail:['data-services','toolbox'].includes(id)?'':enrich[id]?.[locale] ?? p.body};});
  const extraSections=extras.filter(x=>selected.includes(x.id)&&!['counting3d','tracking','lidar','ip'].includes(x.id)).map(x=>({id:x.id,title:x.label[locale],body:x.body[locale],detail:x.id==='assurance'?'':enrich[x.id]?.[locale] ?? ''}));
  return [...sceneSections,...platformSections,...extraSections];
 },[selected,locale,retail]);
 const html=useMemo(()=>{
  const about=pfmPages[locale].about, arc=pfmPages[locale].arc, privacy=pfmPages[locale].privacy;
  const tech=technicalCopy[locale];
  const figure=(id:string)=>media[id]&&assets[id]?`<figure><img src="${assets[id]}" alt="${esc(media[id].caption[locale])}"><figcaption>${esc(media[id].caption[locale])}</figcaption></figure>`:'';
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
   const className=id==='toolbox'?'flow-list':id==='assurance'?'cert-list':'fact-list';
   return `<div class="${className}">${rows.map(([title,body])=>`<div><strong>${esc(title)}</strong><p>${esc(body)}</p></div>`).join('')}</div>`;
  };
  const requirements=(id:string)=>{
   const implementation={counting3d:'impl-xovis-3d-entrance',tracking:'impl-xovis-3d-spatial',lidar:'impl-lidar-spatial',ip:'impl-ip-detection-outdoor'}[id as 'counting3d'];
   const profile=implementationRequirementProfiles.find(p=>p.implementationId===implementation);
   if(!profile)return '';
   const essentials=profile.essentials.map(r=>({label:resolveEssentialLabel(locale,r.label),value:resolveEssentialBody(locale,profile.implementationId,r.label,r.body)}));
   const rows=profile.technicalDetail.filter(r=>r.status==='source_backed').map(r=>({label:resolveDetailLabel(locale,r.label),value:resolveDetailValue(locale,profile.implementationId,r.label,r.value)}));
   const model={counting3d:'Xovis PC2SE',tracking:'Xovis PF-L',lidar:'RoboSense Airy',ip:'IP detection · configured camera analytics'}[id as 'counting3d'];
   const item=extras.find(x=>x.id===id)!;
   const hardwareId=id==='counting3d'?'sensor':`hardware-${id}`;
   return renderTechnologySection({id,locale,title:item.label[locale],model,description:item.body[locale],hardware:assets[hardwareId]?{src:assets[hardwareId],caption:media[hardwareId].caption[locale]}:undefined,principle:assets[id]?{src:assets[id],caption:media[id].caption[locale],background:id==='tracking'||id==='lidar'?'#000000':id==='counting3d'?'#0000ff':undefined}:undefined,essentials,specifications:rows});
  };
  const blocks=sections.map((s,i)=>`<article id="topic-${s.id}" class="story-article ${assets[s.id]?'with-visual':'text-story'}"><div class="article-heading"><span>${String(i+1).padStart(2,'0')}</span><h3>${esc(s.title)}</h3></div><div class="article-grid"><div class="story-copy"><p>${esc(s.body)}</p>${s.detail?`<p class="detail">${esc(s.detail)}</p>`:''}</div>${figure(s.id)}</div>${editorial(s.id)}</article>`).join('');
  const technical=methodIds.length?`<section id="measurement" class="technical-section"><p class="eyebrow">${esc(tech.specs)}</p><h2>${esc(tech.title)}</h2><p class="section-lead">${esc(tech.lead)}</p>${methodIds.map(id=>requirements(id)).join('')}</section>`:'';
  const contents=sections.map(s=>`<a href="#topic-${s.id}">${esc(s.title)} <span>↗</span></a>`).join('');
  const impact=accessibility[locale], reachCopy=reach[locale];
  const reachMarkup=reachCopy.values.map(item=>`<div><strong>${esc(item.value)}</strong><span>${esc(item.label)}</span></div>`).join('');
  return renderCustomerDocument({locale,theme:outputStyle,title:c.customerTitle,lead:c.customerLead,eyebrow:'PFM · Retail',logo,contentHtml:`<main><nav class="contents" aria-label="${esc(tech.contents)}"><p class="eyebrow">${esc(tech.contents)}</p>${contents}${methodIds.length?`<a href="#measurement">${esc(tech.title)} <span>↗</span></a>`:""}</nav><section><p class="eyebrow">${esc(c.selected)}</p><div class="grid">${blocks}</div></section>${technical}<section><p class="eyebrow">${esc(about.tab)}</p><div class="about-grid"><div><h2>${esc(about.title)}</h2><p>${esc(about.lead)} ${esc(about.body)}</p></div><div><h3>${esc(about.detailTitle)}</h3><p>${esc(about.detail)}</p></div></div><p class="eyebrow">${esc(reachCopy.title)}</p><div class="reach-list">${reachMarkup}</div>${renderCustomerProof(locale,customerProofLogos.filter(x=>assets["proof-"+x.name]).map(x=>({name:x.name,src:assets["proof-"+x.name]})))}</section><section class="impact"><p class="eyebrow">${esc(impact.eyebrow)}</p><div class="impact-grid"><div><h2>${esc(impact.title)}</h2><p>${esc(impact.intro)}</p></div><div><p>${esc(impact.body)}</p><p class="contribution">${esc(impact.contribution)}</p></div></div></section><section><p class="eyebrow">ARC</p><h2>${esc(arc.title)}</h2><p>${esc(arc.lead)}</p><p>${esc(arc.detail)}</p></section><section><p class="eyebrow">${esc(privacy.tab)}</p><div class="privacy-grid"><div><h2>${esc(privacy.title)}</h2><p>${esc(privacy.lead)} ${esc(privacy.body)}</p></div>${figure('privacy')}</div></section><section><h2>${esc(c.contact)}</h2><p>${esc(c.contactText)}</p><small>${esc(c.illustrative)}</small></section></main>`});
 },[sections,locale,c,logo,assets,outputStyle,methodIds]);
 const download=()=>{const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`PFM-follow-up-retail-${outputStyle}-${locale}.html`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const savePdf=()=>{const win=window.open('','_blank');if(!win)return;win.addEventListener('load',async()=>{await Promise.all(Array.from(win.document.images).map(image=>image.decode().catch(()=>{})));await win.document.fonts.ready;win.focus();win.print()},{once:true});win.document.write(html);win.document.close();};
 const choices=(ids:readonly string[],group:string)=>ids.map(id=>{
  const selectedNow=selected.includes(id);
  const sceneId=retail.coreRoute.find(sceneId=>sceneId===id);
  const scene=sceneId?journeySceneCopy('retail',sceneId,locale):null;
  const platform=platformIds.includes(id as PFMPage)?pfmPages[locale][id as PFMPage]:null;
  const extra=extras.find(item=>item.id===id);
  const title=scene?.question??platform?.tab??extra?.label[locale]??id;
  const description=scene?.supporting??platform?.lead??extra?.body[locale]??'';
  const visual=assets[id];
  return <label className={`follow-choice${selectedNow?' is-selected':''}${visual?' has-visual':''}`} key={id}>
   <input type="checkbox" checked={selectedNow} onChange={()=>toggle(id)} aria-label={`${selectedNow?c.remove:'Add'}: ${title}`}/>
   {visual&&<img className="follow-choice-visual" src={visual} alt="" aria-hidden="true"/>}
   <span className="follow-choice-copy"><small className="follow-choice-group">{group}</small><strong>{title}</strong><small className="follow-choice-description">{description}</small>{topicMethods[id]&&<small className="follow-technical-included">{technicalCopy[locale].included}: {topicMethods[id].map(method=>extras.find(x=>x.id===method)?.label[locale]).join(" / ")}</small>}</span>
   <span className="follow-choice-mark" aria-hidden="true">{selectedNow?'✓':'+'}</span>
  </label>;
 });
 const selectedNames=[...sections.map(section=>({id:section.id,title:section.title})),...extras.filter(item=>selected.includes(item.id)&&methodIds.includes(item.id)).map(item=>({id:item.id,title:item.label[locale]}))];
 const stepStatus=selected.length?`${selected.length} ${c.selectedCount}`:c.empty;
 return <main className="follow-up" lang={locale}>
  <div className="follow-hero">
   <div><p className="integrated-kicker">{c.kicker}</p><h1>{c.title}</h1><p className="follow-lead">{c.lead}</p></div>
   <div className="follow-story-note"><span className="follow-story-mark">PFM</span><div><strong>{c.story}</strong><p>{c.storyText}</p></div></div>
  </div>
  <div className="follow-progress" aria-label={c.nav}><span className="is-current"><b>01</b>{c.selectionLabel}</span><i/><span className={selected.length?'is-ready':''}><b>02</b>{c.preview}</span><i/><span className={selected.length?'is-ready':''}><b>03</b>{c.download}</span></div>
  <div className="follow-grid">
   <div className="follow-builder">
    <section className="follow-step-section">
     <div className="follow-step-heading"><span>01</span><div><h2>{c.segment}</h2><p>{locale==='en'?'Start with the location in front of you.':locale==='de'?'Beginnen Sie mit dem Standort, um den es geht.':'Commencez par le site dont vous parlez.'}</p></div></div>
     <select className="follow-segment-select" aria-label={c.segment} value={segment} onChange={e=>{setSegment(e.target.value);setSelected([])}}>{segmentDefinitions.map(s=><option key={s.id} value={s.id}>{s.experienceName??s.name}</option>)}</select>
    </section>
    {segment!=='retail'?<p className="follow-notice">{c.soon}</p>:<>
     <section className="follow-step-section">
      <div className="follow-step-heading"><span>02</span><div><h2>{c.topics}</h2><p>{c.topicsNote}</p></div></div>
      <div className="follow-journey-actions"><span>{c.sectionJourney}</span><button type="button" onClick={()=>setSelected(items=>Array.from(new Set([...items,...retail.coreRoute])))}>{c.allJourney} <b aria-hidden="true">↗</b></button></div>
      <div className="follow-choices">{choices(retail.coreRoute,c.sectionJourney)}</div>
     </section>
     <section className="follow-step-section follow-additions">
      <div className="follow-step-heading"><span>03</span><div><h2>{c.extras}</h2><p>{locale==='en'?'Add only the platform, service or technical detail that came up.':locale==='de'?'Ergänzen Sie nur Plattformen, Services oder technische Details, die angesprochen wurden.':'Ajoutez uniquement la plateforme, le service ou le détail technique évoqué.'}</p></div></div>
      <h3>{c.platforms}</h3><div className="follow-choices follow-choices-visual">{choices(platformIds,c.sectionInsights)}</div>
      <h3>{c.methods}</h3><div className="follow-choices">{choices(extras.map(item=>item.id),c.sectionTechnical)}</div>
     </section>
    </>}
   </div>
   <aside className="follow-preview-column"><div className="follow-sticky">
    <div className="follow-preview-head"><div><p className="integrated-kicker">{c.preview}</p><h2>{c.previewTitle}</h2></div><span className="follow-live-dot">{locale==='en'?'LIVE':locale==='de'?'LIVE':'DIRECT'}</span></div>
    <label className="follow-output-style"><span>{c.outputStyle}</span><select value={outputStyle} onChange={e=>setOutputStyle(e.target.value as 'brand'|'light')}><option value="brand">{c.brandStyle}</option><option value="light">{c.lightStyle}</option></select><small>{outputStyle==='brand'?c.styleDark:c.styleLight}</small></label>
    <div className="follow-selected-summary"><div className="follow-summary-title"><strong>{c.selectionLabel}</strong><span>{stepStatus}</span></div>{selectedNames.length>0?<div className="follow-selected-chips">{selectedNames.map(item=><button type="button" key={item.id} onClick={()=>toggle(item.id)} aria-label={`${c.remove}: ${item.title}`}>{item.title}<span aria-hidden="true">×</span></button>)}</div>:<p>{c.previewEmptyText}</p>}</div>
    {segment==='retail'&&selected.length>0?<iframe title={c.previewTitle} srcDoc={html.replace('<body class=','<body data-preview="true" class=')} sandbox=""/>:<div className="follow-preview-empty"><span className="follow-preview-empty-icon" aria-hidden="true">↗</span><h3>{c.previewEmptyTitle}</h3><p>{segment==='retail'?c.previewEmptyText:c.soon}</p></div>}
    <div className="follow-preview-footer"><button type="button" className="integrated-button" onClick={savePdf} disabled={!logo||selected.length===0||segment!=='retail'}>{pdfLabel}<span aria-hidden="true">↓</span></button><small>{c.includedBadge}: {c.includedText}</small>{methodIds.length>0&&<small>{technicalCopy[locale].specs}: {methodIds.map(id=>extras.find(x=>x.id===id)?.label[locale]).join(" · ")}</small>}<button type="button" className="integrated-button" onClick={download} disabled={!logo||selected.length===0||segment!=='retail'}>{logo?c.download:assetError?({en:'Images unavailable — reload',de:'Bilder nicht verfügbar — neu laden',fr:'Images indisponibles — rechargez'}[locale]):c.loading}<span aria-hidden="true">↓</span></button></div>
   </div></aside>
  </div>
 </main>;
}
