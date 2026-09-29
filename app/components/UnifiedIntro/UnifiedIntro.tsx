"use client";

import { useEffect, useState } from "react";
import { introCopy } from "../../i18n/intro";
import { localeLabels, locales, type Locale } from "../../i18n/locales";
import { getMessages } from "../../i18n/messages";
import { UnifiedIntroScene } from "./UnifiedIntroScene";
import styles from "./UnifiedIntro.module.css";

/**
 * Shared-shell entry point. The caller owns navigation to segment selection,
 * and the locale: the cover only reports a choice, so the language picked here
 * is the one the segment picker opens in.
 */
export function UnifiedIntro({
  onExplore,
  locale,
  onLocaleChange,
}: {
  onExplore: () => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const copy = introCopy[locale];
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <main className={styles.intro} lang={locale}>
      <div className={styles.scene} aria-hidden="true">
        {/* Fictional, label-free architectural base; live movement is rendered above it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.basePlate}
          src="/assets/unified-intro/architectural-evening-base.jpg"
          alt=""
        />
        <UnifiedIntroScene reducedMotion={reducedMotion} />
      </div>
      <div className={styles.vignette} aria-hidden="true" />

      <header className={styles.header}>
        {/* Existing approved asset; the scene never redraws or recolours the logo. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo/pfm-logo-white.svg" alt="PFM" width="72" height="22" />
        <span className={styles.headerRule} aria-hidden="true" />
        <span className={styles.headerLabel}>People Flow Management</span>
        {/* The app's locale convention: buttons with aria-pressed, as in the
            segment picker. The visible label is the shared short code; the
            accessible name is the language's own name. */}
        <div className={styles.locales} role="group" aria-label={getMessages(locale).ui.languageLabel}>
          {locales.map((id) => (
            <button
              key={id}
              type="button"
              className={styles.locale}
              aria-pressed={id === locale}
              onClick={() => onLocaleChange(id)}
            >
              <span aria-hidden="true">{localeLabels[id].short}</span>
              <span className={styles.srOnly}>{localeLabels[id].name}</span>
            </button>
          ))}
        </div>
      </header>

      <div className={styles.content}>
        <p className={styles.eyebrow}><span aria-hidden="true" /> {copy.eyebrow}</p>
        <h1>{copy.headline[0]}<br />{copy.headline[1]}</h1>
        <p className={styles.lead}>
          {copy.lead[0]}<br className={styles.wideBreak} /> {copy.lead[1]}
        </p>
        <button className={styles.cta} type="button" onClick={onExplore}>
          {copy.cta} <span aria-hidden="true">→</span>
        </button>
      </div>

      <footer className={styles.footer}>
        <span>{copy.beats[0]} <b aria-hidden="true" /> {copy.beats[1]} <b aria-hidden="true" /> {copy.beats[2]}</span>
        <span className={styles.footerRight}>{copy.footer}</span>
      </footer>
    </main>
  );
}
