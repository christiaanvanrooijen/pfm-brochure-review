/**
 * The Unified PFM Intro — the brochure's shared cover (integrated 2026-09-28).
 *
 * It is not a scene and owns no navigation: the caller decides what Explore
 * does. These hold the boundaries that keep it that way, and the truth rules
 * a cover is most tempted to break.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { introCopy } from "../app/i18n/intro.ts";
import { locales } from "../app/i18n/locales.ts";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const intro = read("app/components/UnifiedIntro/UnifiedIntro.tsx");
const scene = read("app/components/UnifiedIntro/UnifiedIntroScene.tsx");
const css = read("app/components/UnifiedIntro/UnifiedIntro.module.css");

test("the intro owns no navigation; its caller does", () => {
  assert.match(intro, /onExplore: \(\) => void;\s*locale: Locale;\s*onLocaleChange: \(locale: Locale\) => void;/);
  assert.match(intro, /<button className=\{styles\.cta\} type="button" onClick=\{onExplore\}>/);
  assert.doesNotMatch(intro, /useRouter|href=|window\.location/);
});

test("the canvas never takes a click or focus, and WebGL failure leaves the page usable", () => {
  assert.match(css, /\.scene canvas \{[^}]*pointer-events: none;/);
  assert.match(intro, /<div className=\{styles\.scene\} aria-hidden="true">/);
  // The base plate is an <img>, not a WebGL texture, so it survives without WebGL.
  assert.match(intro, /src="\/assets\/unified-intro\/architectural-evening-base\.jpg"/);
  assert.ok(existsSync(new URL("../public/assets/unified-intro/architectural-evening-base.jpg", import.meta.url)));
  assert.match(scene, /try \{\s*renderer = new THREE\.WebGLRenderer/);
});

test("reduced motion shows the settled scene without travel", () => {
  assert.match(intro, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(scene, /signal\.update\(reducedMotion \? 5 : seconds, reducedMotion\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{ \.scene \{ animation: none; \}/);
});

test("the cover makes no measured or customer claim, in any language", () => {
  const copy = intro.replace(/\{\/\*[\s*\S]*?\*\/\}/g, "");
  assert.doesNotMatch(copy, /\d+\s*%|uplift|ROI|accura|customer|Northstar/i);
  for (const locale of locales) {
    const text = JSON.stringify(introCopy[locale]);
    assert.doesNotMatch(text, /\d|%|ROI|uplift|client|Kunde|customer/i, `${locale} intro copy makes a claim`);
  }
});

test("the language selector is inline, editorial and follows the app's convention", () => {
  // Every locale has cover copy, and French and German are not the English.
  for (const locale of locales) assert.ok(introCopy[locale], `no intro copy for ${locale}`);
  assert.notEqual(introCopy.fr.cta, introCopy.en.cta);
  assert.notEqual(introCopy.de.cta, introCopy.en.cta);
  // Buttons with aria-pressed, as in the segment picker; the language's own
  // name for assistive technology; the visible label is the two-letter code.
  assert.match(intro, /role="group" aria-label=\{getMessages\(locale\)\.ui\.languageLabel\}/);
  assert.match(intro, /aria-pressed=\{id === locale\}/);
  assert.match(intro, /onClick=\{\(\) => onLocaleChange\(id\)\}/);
  assert.match(intro, /\{localeLabels\[id\]\.short\}/);
  assert.match(intro, /localeLabels\[id\]\.name/);
  assert.match(intro, /<main className=\{styles\.intro\} lang=\{locale\}>/);
  // Not a dropdown, not a select, no flags or globe.
  assert.doesNotMatch(intro, /<select|role="listbox"|flag|globe|🌐/i);
  // No fills or borders per language; a visible focus state.
  const rule = (sel) => css.match(new RegExp(`${sel.replace(/[.[\]"=]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
  assert.match(rule(".locale"), /border: 0; background: none;/);
  assert.match(css, /\.locale:focus-visible \{ outline: 2px solid #d6bbfb;/);
  assert.match(rule('.locale[aria-pressed="true"]'), /color: #fff;/);
});

test("the review route is development-only", () => {
  assert.match(read("app/preview/unified-intro/page.tsx"), /if \(process\.env\.NODE_ENV === "production"\) notFound\(\);/);
});
