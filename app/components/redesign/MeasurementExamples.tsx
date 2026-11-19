"use client";

import { useRef, useState } from "react";
import type { Locale } from "../../i18n/locales";

const copy = {
  en: {
    depth: "3D stereo depth view", explanation: "Colours show distance from the sensor.",
    video: "Xovis 3D entrance counting", bosch: "Bosch FLEXIDOME micro 3100i",
    privacy: "IP detection uses on-device processing and dynamic blur to protect people while preserving measurement data. In PFM’s IP detection setup, processing stays on the sensor. Only measurement events are transmitted and video is not stored.",
  },
  de: {
    depth: "3D-Stereo-Tiefenbild", explanation: "Die Farben zeigen den Abstand zum Sensor.",
    video: "3D-Eingangszählung mit Xovis", bosch: "Bosch FLEXIDOME micro 3100i",
    privacy: "In der Bosch-IVA-Traffic-Konfiguration von PFM verarbeitet der Sensor das Video direkt auf dem Gerät. Die Unschärfe ist aktiviert. Nur Messereignisse werden übertragen. Video wird weder gespeichert noch übertragen.",
  },
  fr: {
    depth: "Image de profondeur stéréo 3D", explanation: "Les couleurs indiquent la distance au capteur.",
    video: "Comptage 3D à l’entrée avec Xovis", bosch: "Bosch FLEXIDOME micro 3100i",
    privacy: "Dans la configuration Bosch IVA Traffic de PFM, le capteur traite la vidéo directement sur l’appareil, avec le floutage activé. Seuls les événements de mesure sont transmis. Aucune vidéo n’est stockée ni transmise.",
  },
};

export function BoschPrivacy({ locale }: { locale: Locale }) {
  return <>
    <p>{copy[locale].privacy}</p>
    <figure className="rd-depth__figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/technology/explainers/bosch-privacy-blur.png" alt="" />
      <figcaption>{locale === "fr" ? "Illustration du floutage dynamique" : locale === "de" ? "Illustration der dynamischen Verpixelung" : "Dynamic blur illustration"}</figcaption>
    </figure>
  </>;
}

export function StereoDepth({ locale }: { locale: Locale }) {
  return <figure className="rd-depth__figure">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/assets/technology/explainers/stereo-depth.png" alt={copy[locale].depth} />
    <figcaption><strong>{copy[locale].depth}</strong><span>{copy[locale].explanation}</span></figcaption>
  </figure>;
}

export function MeasurementVideo({ src, label, closeLabel = "Close video" }: { src: string; label: string; closeLabel?: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return <div className="rd-depth__video">
    <button ref={trigger} style={open ? { display: "none" } : undefined} type="button" className="rd-depth__video-trigger" onClick={() => setOpen(true)}>
      <span className="rd-depth__video-play" aria-hidden="true" />{label}
    </button>
    {open && <div className="rd-depth__video-frame">
      <video controls autoPlay playsInline aria-label={label} src={src} ref={element => element?.focus({ preventScroll: true })} />
      <button type="button" className="rd-depth__video-close" onClick={() => {
        setOpen(false);
        requestAnimationFrame(() => trigger.current?.focus());
      }}>{closeLabel}</button>
    </div>}
  </div>;
}

export function MeasurementExamples({ locale, stereo, entranceVideo }: { locale: Locale; stereo: boolean; entranceVideo: boolean }) {
  return <>
    {stereo && entranceVideo && <StereoDepth locale={locale} />}
    {entranceVideo && <MeasurementVideo
      label={copy[locale].video}
      src="/assets/videos/3d-sensor-counting-xovis.mp4"
      closeLabel={locale === "fr" ? "Fermer la vidéo" : locale === "de" ? "Video schließen" : "Close video"}
    />}

  </>;
}

export function LidarPrivacy({ locale }: { locale: Locale }) {
  const description = {
    en: "LiDAR measures reflected laser light to create a point cloud of distances rather than a camera image. Privacy depends on how the resulting data is processed, accessed and retained.",
    de: "LiDAR misst reflektiertes Laserlicht und erzeugt eine Punktewolke aus Abständen. Der Datenschutz hängt von Verarbeitung, Zugriff und Aufbewahrung ab.",
    fr: "Le LiDAR mesure la lumière laser réfléchie et produit un nuage de points de distance. La confidentialité dépend du traitement, des accès et de la conservation.",
  };
  return <><p>{description[locale]}</p><figure className="rd-depth__figure"><img src="/assets/technology/explainers/lidar-privacy.png" alt="" /><figcaption>LiDAR point cloud · illustrative</figcaption></figure></>;
}
