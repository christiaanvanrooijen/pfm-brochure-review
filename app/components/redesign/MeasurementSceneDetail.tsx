"use client";

import { BoschPrivacy, StereoDepth } from "./MeasurementExamples";

import { useState } from "react";
import type { Locale } from "../../i18n/locales";
import type { SegmentId, SceneDefinition } from "../../content/types";

type Section = "how" | "technology" | "requirements" | "privacy";
type Kind = "street" | "entrance";
export function measurementDetailKind(segment: SegmentId, scene: SceneDefinition["id"]): Kind | null {
  if (segment !== "retail") return null;
  return scene === "retail-street-opportunity" ? "street" : scene === "retail-store-visits" ? "entrance" : null;
}

const text = {
  en: {
    streetIntro: "Measure the people passing the storefront within a defined area. Choose the approach that fits the frontage and installation.",
    entranceIntro: "An overhead sensor observes the threshold and counts configured crossings into and out of the store.",
    radar: "Radar mmWave", ip: "IP detection", infrared: "Infrared storefront",
    radarHow: "Radar mmWave sends radio signals and reads reflections from moving objects. The configured measurement area defines which passing movement is counted.",
    ipHow: "IVA Pro Buildings detects and tracks people in the configured camera view; a counting line records crossings.",
    infraredHow: "The VS361 emits infrared light and detects reflection from passing objects. Its digital switching output does not distinguish direction or object type.",
    unavailable: "Currently unavailable, according to PFM product information.",
    illustration: "Illustration of the measurement principle; the drawn area is not a verified coverage plan.",
    technology: "Measurement options", placement: "Placement and coverage", power: "Power and connection", definition: "Counting definition", capture: "When comparing with store visits", privacy: "Privacy in practice",
    entrancePlacement: "Mount a suitable counter above the doorway with an unobstructed view of the threshold. Check ceiling height, doorway width, obstructions and the number of sensors needed during a site survey.",
    entrancePower: "Provide the sensor's specified power and network connection. Confirm the cable route, network access and installation permissions at the site.",
    entranceDefinition: "Set entrance and exit lines and agree how entries, exits, repeat visits and staff are handled. Validate the count against the physical layout.",
    streetPlacement: "Choose the frontage, direction and pavement area to measure. Check mounting position, obstructions and coverage on site.",
    streetPower: "Provide power and a suitable connection for the selected device; confirm installation access and network availability.",
    streetDefinition: "Agree the counting line or zone, direction and reporting period. Check whether people moving outside the selected area should be included.",
    captureText: "Use a separately measured passing audience and entrance visits with compatible area, period and definitions. Divide visits by the aligned passing audience only when both are available.",
    radarPrivacy: "Radar mmWave uses radio reflections and does not produce camera images. The data processed, transmitted and retained depend on the device configuration and connected system.",
    ipPrivacy: "The IP camera processes video. Choose the configured privacy masks, access, storage and retention for the site; masking is optional and depends on supported firmware and settings.",
    irPrivacy: "The VS361 has no camera or image sensor and produces a switching signal. The connected system's storage and access rules still need to be defined.",
    entrancePrivacy: "Xovis and Milesight describe device privacy modes. The chosen mode, output, access and retention must be checked for the installed configuration. IP camera analytics may process video; masking and retention depend on the actual setup.",
    premium: "Premium 3D · Xovis PC2SE", basic: "Basic 3D · Milesight VS125-P", camera: "IP detection · configured camera analytics",
    premiumSpec: "Overhead stereo vision; 2.2–6 m mounting height for the base model; PoE. Coverage depends on installation.",
    basicSpec: "Overhead stereo vision; mounting height 2.2–6 m, PoE and up to four configured bidirectional counting lines. Coverage depends on the installation.",
    cameraSpec: "A configured IP camera view can support entrance counting with compatible analytics. Camera placement, analytics and site configuration determine the result.",
    radarSpec: "Radar mmWave measures movement through reflected radio signals in a configured area. Installation and data output depend on the selected system configuration.",
    ipSpec: "Bosch FLEXIDOME micro 3100i outdoor NUE-3703-F04: IVA Pro Buildings, person and vehicle detection, PoE, IP66. The supplied sheet is for the outdoor variant.",
    irSpec: "Milesight VS361: active 940 nm infrared, adjustable 1–9 m detection distance, IP65 and a digital switching output. Currently unavailable.",
    entranceTitle: "Entrance counting", entranceHow: "Configure a line across the doorway to distinguish entering and exiting movements. The count describes crossings within the covered threshold.", entrancePrivacyTitle: "Entrance sensors and camera analytics", privacyNote: "Privacy settings and obligations depend on the actual installation, purpose and local policy.", methodLabel: "Measurement approach", streetAlt: "Illustrative passer-by measurement at a storefront", entranceAlt: "Illustrative overhead measurement at a store entrance",
  },
} as const;

type Copy = { [K in keyof typeof text.en]: string };
const translations: Record<Locale, Copy> = {
 en: text.en,
 de: { ...text.en,
 streetIntro: "Erfassen Sie Passanten vor der Fassade in einem definierten Bereich. Die passende Methode hängt vom Standort und der Installation ab.", entranceIntro: "Ein Sensor über dem Eingang erfasst die eingestellte Zähllinie und zählt Bewegungen hinein und hinaus.", radar: "Radar mmWave", ip: "IP-Erkennung", infrared: "Infrarot an der Fassade",
 radarHow: "Radar mmWave sendet Funksignale und erfasst Reflexionen bewegter Objekte. Der konfigurierte Messbereich legt fest, welche Passanten gezählt werden.", ipHow: "IVA Pro Buildings erkennt und verfolgt Personen im eingestellten Kamerabild; eine Zähllinie erfasst Übertritte.", infraredHow: "Der VS361 sendet Infrarotlicht aus und erkennt die Reflexion vorbeigehender Objekte. Sein digitaler Schaltausgang unterscheidet weder Richtung noch Objekttyp.", unavailable: "Laut PFM-Produktinformation derzeit nicht lieferbar.", illustration: "Illustration des Messprinzips; der gezeichnete Bereich ist kein geprüfter Abdeckungsplan.", technology: "Messoptionen", placement: "Montage und Abdeckung", power: "Strom und Verbindung", definition: "Zähldefinition", capture: "Vergleich mit Storebesuchen", privacy: "Datenschutz in der Praxis",
 entrancePlacement: "Montieren Sie einen geeigneten Zähler über dem Eingang mit freier Sicht auf die Schwelle. Prüfen Sie Deckenhöhe, Türbreite, Hindernisse und benötigte Sensoranzahl vor Ort.", entrancePower: "Stellen Sie die erforderliche Stromversorgung und Netzwerkverbindung bereit. Prüfen Sie Kabelweg, Netzwerkzugang und Montageerlaubnis.", entranceDefinition: "Legen Sie Ein- und Ausgangslinien fest und vereinbaren Sie den Umgang mit Eintritten, Austritten, wiederholten Besuchen und Mitarbeitenden. Prüfen Sie die Zählung vor Ort.", streetPlacement: "Legen Sie Fassade, Richtung und zu messenden Gehwegbereich fest. Prüfen Sie Montageposition, Hindernisse und Abdeckung vor Ort.", streetPower: "Stellen Sie Strom und eine geeignete Verbindung für das gewählte Gerät bereit; prüfen Sie Montagezugang und Netzwerk.", streetDefinition: "Vereinbaren Sie Zähllinie oder Zone, Richtung und Berichtszeitraum. Prüfen Sie, ob Personen außerhalb des gewählten Bereichs einbezogen werden sollen.", captureText: "Verwenden Sie separat gemessene Passanten und Eingangsbesuche mit vergleichbarem Bereich, Zeitraum und Definitionen. Teilen Sie Besuche nur durch die abgestimmte Passantenzahl, wenn beide vorliegen.",
 },
 fr: {
 streetIntro: "Mesurez les passants devant la vitrine dans une zone définie. La méthode dépend de la façade et de l’installation.", entranceIntro: "Un capteur installé au-dessus de l’entrée compte les passages entrants et sortants sur une ligne configurée.", radar: "Radar mmWave", ip: "Détection IP", infrared: "Infrarouge en façade",
 radarHow: "Le radar mmWave émet des ondes radio et détecte les réflexions des objets en mouvement. La zone configurée définit les mouvements comptés.", ipHow: "IVA Pro Buildings détecte et suit les personnes dans le champ configuré ; une ligne de comptage enregistre les passages.", infraredHow: "Le VS361 émet une lumière infrarouge et détecte sa réflexion sur les objets passant devant lui. Sa sortie numérique ne distingue ni direction ni type d’objet.", unavailable: "Actuellement indisponible selon les informations produit de PFM.", illustration: "Illustration du principe de mesure ; la zone dessinée ne constitue pas un plan de couverture validé.", technology: "Options de mesure", placement: "Installation et couverture", power: "Alimentation et connexion", definition: "Définition du comptage", capture: "Comparaison avec les visites", privacy: "Confidentialité en pratique",
 entrancePlacement: "Installez un compteur adapté au-dessus de la porte avec une vue dégagée du seuil. Vérifiez sur place hauteur, largeur, obstacles et nombre de capteurs nécessaires.", entrancePower: "Prévoyez l’alimentation et la connexion réseau requises. Vérifiez le passage des câbles, l’accès réseau et les autorisations d’installation.", entranceDefinition: "Définissez les lignes d’entrée et de sortie ainsi que le traitement des entrées, sorties, visites répétées et employés. Validez le comptage sur place.", streetPlacement: "Définissez la façade, la direction et la zone de passage à mesurer. Vérifiez position, obstacles et couverture sur place.", streetPower: "Prévoyez l’alimentation et une connexion adaptée à l’appareil choisi ; vérifiez l’accès pour l’installation et le réseau.", streetDefinition: "Définissez la ligne ou zone, la direction et la période de reporting. Précisez si les personnes hors de la zone doivent être incluses.", captureText: "Utilisez des mesures distinctes des passants et des visites à l’entrée, avec des zones, périodes et définitions compatibles. Divisez les visites par les passants alignés uniquement lorsque les deux mesures sont disponibles.",
 radarPrivacy: "Le radar mmWave utilise des réflexions radio et ne produit pas d’images de caméra. Les données traitées, transmises et conservées dépendent de la configuration et du système connecté.", ipPrivacy: "La caméra IP traite de la vidéo. Définissez masquage, accès, stockage et conservation pour le site ; le masquage est facultatif et dépend du firmware et des réglages.", irPrivacy: "Le VS361 ne possède ni caméra ni capteur d’image et produit un signal de commutation. Les règles de stockage et d’accès du système connecté restent à définir.", entrancePrivacy: "Xovis et Milesight décrivent des modes de confidentialité. Vérifiez le mode, les sorties, l’accès et la conservation pour l’installation choisie. L’analyse par caméra IP peut traiter de la vidéo ; masquage et conservation dépendent de la configuration.", premium: "Premium 3D · Xovis PC2SE", basic: "Basic 3D · Milesight VS125-P", camera: "Détection IP · analyse vidéo configurée", premiumSpec: "Vision stéréo en hauteur ; montage de 2,2 à 6 m pour le modèle de base ; PoE. La couverture dépend de l’installation.", basicSpec: "Vision stéréo en hauteur ; montage de 2,2 à 6 m, PoE et jusqu’à quatre lignes bidirectionnelles. La couverture dépend de l’installation.", cameraSpec: "Une caméra IP configurée peut compter les passages à l’entrée avec une analyse compatible. Position et configuration déterminent le résultat.", radarSpec: "Le radar mmWave mesure les mouvements par réflexion des ondes radio dans une zone configurée. L’installation et les données produites dépendent du système choisi.", ipSpec: "Bosch FLEXIDOME micro 3100i outdoor NUE-3703-F04 : IVA Pro Buildings, détection de personnes et véhicules, PoE, IP66. La fiche fournie concerne la version extérieure.", irSpec: "Milesight VS361 : infrarouge actif 940 nm, distance réglable de 1 à 9 m, IP65 et sortie numérique. Actuellement indisponible.", entranceTitle: "Comptage à l’entrée", entranceHow: "Une ligne configurée sur le seuil distingue les mouvements entrants et sortants. Le comptage concerne les passages dans la zone couverte.", entrancePrivacyTitle: "Capteurs d’entrée et analyse vidéo", privacyNote: "Les réglages et obligations de confidentialité dépendent de l’installation, de sa finalité et des règles locales.", methodLabel: "Méthode de mesure", streetAlt: "Illustration de la mesure des passants devant une vitrine", entranceAlt: "Illustration d’une mesure en hauteur à l’entrée d’un magasin",
 },
};

export function MeasurementSceneDetail({ kind, section, locale }: { kind: Kind; section: Section; locale: Locale }) {
  const [method, setMethod] = useState<"radar" | "ip" | "infrared">("radar");
  const t = translations[locale];
  const street = kind === "street";
  const methods = [{ id: "radar", label: t.radar }, { id: "ip", label: t.ip }, { id: "infrared", label: t.infrared }] as const;
  return <div className="rd-depth__how" lang={locale}>
    {section === "how" && (street ? <>
      <p>{t.streetIntro}</p>
      <div className="rd-depth__passerby-tabs" role="group" aria-label={t.methodLabel}>{methods.map(m => <button key={m.id} type="button" aria-pressed={method === m.id} onClick={() => setMethod(m.id)}>{m.label}</button>)}</div>
      <figure className="rd-depth__figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={method === "radar" ? "/assets/retail-passersby/radar.png" : method === "ip" ? "/assets/retail-passersby/ip-detection.png" : "/assets/technology/explainers/passerby-physical-measurement.png"} alt={t.streetAlt} />
        <figcaption><strong>{methods.find(m => m.id === method)?.label}</strong><span>{method === "radar" ? t.radarHow : method === "ip" ? t.ipHow : t.infraredHow}</span><em>{t.illustration}</em>{method === "infrared" && <span>{t.unavailable}</span>}</figcaption>
      </figure>
    </> : <><p>{t.entranceIntro}</p><figure className="rd-depth__figure">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/technology/explainers/entrance-threshold-measurement.png" alt={t.entranceAlt}/><figcaption><strong>{t.entranceTitle}</strong><span>{t.entranceHow}</span><em>{t.illustration}</em></figcaption></figure></>)}
    {section === "technology" && <><p className="rd-depth__kicker">{t.technology}</p><ul className="rd-depth__cards">{(street ? [
      {title:t.radar, body:t.radarSpec, image:"/assets/retail-passersby/hardware/sensmax-tac-3dn-ewp.png"}, {title:t.ip, body:t.ipSpec, image:"/assets/technology/ip-detection/bosch-flexidome-micro-3100i.png"}, {title:t.infrared, body:t.irSpec, image:"/assets/technology/passerby/milesight-vs361.jpg"},
    ] : [
      {title:t.premium,body:t.premiumSpec,image:"/assets/technology/entrance/xovis-pc2se-transparent.png"}, {title:t.basic,body:t.basicSpec,image:"/assets/technology/entrance/milesight-vs125p.png"}, {title:t.camera,body:t.cameraSpec,image:"/assets/technology/ip-detection/bosch-flexidome-micro-3100i.png"},
    ]).map(item => <li className="rd-depth__card" key={item.title}>{item.image && <div className="rd-depth__card-visual">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={item.image} alt="" /></div>}<div className="rd-depth__card-body"><strong>{item.title}</strong><span className="rd-depth__card-role">{item.body}</span></div></li>)}</ul></>}
    {section === "requirements" && (street ? <><p>{street ? t.streetIntro : t.entranceIntro}</p><ul className="rd-depth__list"><li><strong>{t.placement}</strong><span>{street ? t.streetPlacement : t.entrancePlacement}</span></li><li><strong>{t.power}</strong><span>{street ? t.streetPower : t.entrancePower}</span></li><li><strong>{t.definition}</strong><span>{street ? t.streetDefinition : t.entranceDefinition}</span></li></ul></> : <ul className="rd-depth__list">
      <li><strong>{t.premium}</strong><span>{t.premiumSpec}</span></li>
      <li><strong>{t.basic}</strong><span>{t.basicSpec}</span></li>
      <li><strong>{t.camera}</strong><span>{t.cameraSpec}</span></li>
      <li><strong>{t.definition}</strong><span>{t.entranceDefinition}</span></li>
    </ul>)}
    {section === "privacy" && <><p className="rd-depth__kicker">{t.privacy}</p><ul className="rd-depth__list">{street ? <><li><strong>{t.radar}</strong><span>{t.radarPrivacy}</span></li><li><strong>{t.ip}</strong><BoschPrivacy locale={locale} /></li><li><strong>{t.infrared}</strong><span>{t.irPrivacy}</span></li></> : <>
      <li><strong>{t.premium}</strong><span>{locale === "en" ? "The PC2SE processes stereo images on the sensor. Xovis describes text-only count output and four privacy levels. Its certification covers level 2 and above." : t.entrancePrivacy}</span><StereoDepth locale={locale} /></li>
      <li><strong>{t.basic}</strong><span>{locale === "en" ? "Milesight describes device privacy modes for stereo counting. Confirm the mode, outputs and retention for the installed sensor." : t.entrancePrivacy}</span></li>
      <li><strong>{t.camera}</strong><BoschPrivacy locale={locale} /></li>
    </>}</ul><p>{t.privacyNote}</p></>}
  </div>;
}
