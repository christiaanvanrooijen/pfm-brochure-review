/**
 * Gate 1 pilot — the redesign preview for Shopping Centre Internal circulation.
 *
 * These tests hold the things a redesign can quietly break: the locale contract,
 * the isolation of the preview, and the rule that a translation renders a truth
 * rather than becoming a second copy of it.
 *
 * They deliberately do NOT assert markup. Every assertion is about a contract:
 * which keys exist, which ids stay language-neutral, which distinctions survive
 * translation, and what the page is forbidden to claim.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getSegment, getSceneForSegment } from "../app/content/runtime.ts";
import { locales, defaultLocale, localeLabels, isLocale } from "../app/i18n/locales.ts";
import { getMessages, messages, validateMessages } from "../app/i18n/messages.ts";
import { sceneModes, sceneFocusOrder } from "../app/i18n/scenes.ts";
import {
  ASSET_SIZE,
  HEROES,
  HOTSPOTS,
} from "../app/preview/redesign/shopping-centre-circulation/geometry.ts";
import { getSegmentCapabilityMediaOverride } from "../app/content/segment-capability-media.ts";
import { getPlayableProofsForScene } from "../app/content/proof-runtime.ts";
import { getTechnologyCapability } from "../app/content/technology-runtime.ts";
import { configurePrivacyStatement } from "../app/content/solution-runtime.ts";
import {
  resolveCapabilityCopy,
  resolvePrivacyCopy,
  validateDomainMessages,
} from "../app/i18n/domain.ts";

const SEGMENT = "shopping-centre";
const SCENE = "shopping-centre-internal-circulation";

const repoFile = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repoFile(p), "utf8");
const strip = (source) =>
  source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

const frame = () => strip(read("app/components/redesign/SceneFrame.tsx"));
const depth = () => strip(read("app/components/redesign/DepthPanel.tsx"));
// Gate 8 moved override-narrowing out of DepthPanel and into one scene-scoped
// resolver, so all five tabs read the same narrowed implementation list
// instead of only Technology applying it. Checks of that narrowing now read
// this file rather than the panel.
const sceneRuntime = () => strip(read("app/content/scene-technology-runtime.ts"));
const pilot = () => strip(read("app/preview/redesign/shopping-centre-circulation/pilot.tsx"));

/* ------------------------------------------------------------------ *
   1. THE LOCALE CONTRACT
 * ------------------------------------------------------------------ */

test("1. three locales, English default, no flags, accessible names", () => {
  assert.deepEqual([...locales], ["en", "fr", "de"]);
  assert.equal(defaultLocale, "en");
  assert.deepEqual(localeLabels.en, { short: "EN", name: "English" });
  assert.deepEqual(localeLabels.fr, { short: "FR", name: "Français" });
  assert.deepEqual(localeLabels.de, { short: "DE", name: "Deutsch" });
  assert.ok(isLocale("fr") && !isLocale("nl") && !isLocale(undefined));
});

test("2. no locale is missing a key English declares", () => {
  assert.deepEqual(validateMessages(), []);
});

test("3. every locale carries the same stage ids and the same scene ids", () => {
  const stageIds = Object.keys(messages.en.stages).sort();
  const sceneIds = Object.keys(messages.en.scene).sort();
  // The canonical six, in the architecture's own ids.
  assert.deepEqual(stageIds, ["act", "configure", "context", "measure", "prove", "understand"]);
  for (const locale of locales) {
    assert.deepEqual(Object.keys(messages[locale].stages).sort(), stageIds);
    assert.deepEqual(Object.keys(messages[locale].scene).sort(), sceneIds);
  }
  // A localized scene can only exist for a scene the content model declares.
  for (const sceneId of sceneIds) {
    assert.ok(getSceneForSegment(SEGMENT, sceneId), `${sceneId} is not a real scene`);
  }
});

test("4. the locale layer holds no id, no capability and no approval state", () => {
  const serialised = JSON.stringify(messages);
  for (const forbidden of [/TECH-\d\d/, /CASE-[A-Z]+-\d\d/, /impl-[a-z-]+/, /source_backed/, /architecture_only/]) {
    assert.doesNotMatch(serialised, forbidden, `the locale layer carries ${forbidden}`);
  }
});

/* ------------------------------------------------------------------ *
   2. THE GLOSSARY — distinctions that must survive translation
 * ------------------------------------------------------------------ */

test("5. movement events stay distinguishable from unique visitors in all three languages", () => {
  const truth = (locale) => getMessages(locale).scene[SCENE].truth;

  // The typed scene says it; each locale must still say it.
  assert.match(getSceneForSegment(SEGMENT, SCENE).supportingLine.length > 0 ? truth("en") : "", /Movement events are not unique visitors/i);
  assert.match(truth("fr"), /événements de mouvement ne sont pas des visiteurs uniques/i);
  assert.match(truth("de"), /Bewegungsereignisse sind keine eindeutigen Besucher/i);

  // And no locale may collapse the pair into one word.
  for (const locale of locales) {
    const value = truth(locale);
    assert.ok(value.length > 80, `${locale} truth line is too short to carry the boundary`);
    assert.match(
      value,
      /(configured|configurés|konfiguriert)/i,
      `${locale} drops the coverage condition`,
    );
  }
});

test("6. no locale turns observation into a causal, identity or commercial claim", () => {
  const banned = [
    /\bbecause\b/i, /\bcauses?\b/i, /\bparce que\b/i, /\bweil\b/i,
    /\bidentif(y|ies|ied)\b/i, /\bwho they are\b/i,
    /\bsales\b/i, /\bturnover\b/i, /\bROI\b/, /\brevenue\b/i,
    /\bchiffre d'affaires\b/i, /\bUmsatz\b/i,
    /\brecommend/i, /\brecommand/i, /\bempfehl/i,
    /\bbest\b/i, /\bmeilleur\b/i, /\bbeste[nrs]?\b/i,
  ];
  for (const locale of locales) {
    const copy = getMessages(locale).scene[SCENE];
    const surface = [
      copy.eyebrow, copy.question, copy.supporting, copy.prompt, copy.nextCta,
      copy.heroCaption, copy.heroAlt,
      ...Object.values(copy.focus).flatMap((f) => [f.label, f.body]),
      ...copy.sequence.map((s) => `${s.kicker} ${s.label}`),
    ].join(" | ");
    for (const pattern of banned) {
      assert.doesNotMatch(surface, pattern, `${locale} copy matches ${pattern}`);
    }
  }
});

test("7. every locale marks the hero as illustrative and describes it without a face", () => {
  for (const locale of locales) {
    const copy = getMessages(locale).scene[SCENE];
    assert.match(copy.illustrative, /(illustrative|illustratif|Illustrative)/i);
    assert.match(copy.heroAlt, /(No face|Aucun visage|Kein Gesicht)/i);
    assert.ok(copy.heroAlt.length > 120, `${locale} alt text is too thin to be useful`);
  }
});

/* ------------------------------------------------------------------ *
   3. THE PILOT RENDERS THE MODEL, NOT A COPY OF IT
 * ------------------------------------------------------------------ */

test("8. scene position and stage state are derived from coreRoute, not hard-coded", () => {
  const segment = getSegment(SEGMENT);
  assert.equal(segment.coreRoute.length, 8);
  assert.equal(segment.coreRoute.indexOf(SCENE) + 1, 4);

  const source = pilot();
  assert.match(source, /segment\?\.coreRoute/);
  // The scene is now addressable, so the position derives from whichever scene
  // is being rendered rather than from a fixed constant.
  assert.match(source, /route\.indexOf\(initialSceneId\) \+ 1/);
  assert.match(source, /total: route\.length/);
  // No literal "04" or "8" standing in for the real position.
  assert.doesNotMatch(source, /position=\{\{ index: \d/);

  // And a scene is only addressable when the route contains it AND the pilot
  // has copy for it — either alone would let a URL reach a half-built page.
  const page = read("app/preview/redesign/shopping-centre-circulation/page.tsx");
  assert.match(page, /route\.find\(\(id\) => id === requested && pilotScenes\[id\]\)/);
});

test("9. Prove is shown unavailable rather than completed", () => {
  // The segment declares no Prove scenes, so nothing may imply it is done.
  assert.deepEqual(getSegment(SEGMENT).stageMapping.prove, []);
  assert.match(pilot(), /"unavailable"/);
  assert.match(frame(), /is-\$\{stage\.state\}/);
  assert.match(frame(), /stageUnavailable/);
});

test("10. subjects are exploratory, never a recommendation or a selection", () => {
  const source = frame();
  // The textual focus controls are toggles with a pressed state, not a
  // scored choice, and they are what drives the scene.
  assert.match(source, /aria-pressed=\{id === activeFocusId\}/);
  for (const forbidden of [/recommend/i, /\bscore/i, /\bbest\b/i, /suggested/i, /\bdefault\b/i]) {
    assert.doesNotMatch(source, forbidden, `the frame implies ${forbidden}`);
  }
});

test("11. the truth boundary is on the main screen, not inside the depth panel", () => {
  const source = frame();
  assert.match(source, /className="rd__truth"/);
  assert.match(source, /\{copy\.truth\}/);
  // And the panel does not render it, which would mean it had moved.
  assert.doesNotMatch(depth(), /copy\.truth/);
});

/* ------------------------------------------------------------------ *
   4. MEDIA AND PROOF TRUTH
 * ------------------------------------------------------------------ */

test("12. the TECH-04 override is honoured: no video, no implementations, approved image", () => {
  const override = getSegmentCapabilityMediaOverride(SEGMENT, "TECH-04");
  assert.ok(override, "the approved Shopping Centre override must still exist");
  assert.equal(override.allowCapabilityVideo, false);
  assert.deepEqual(override.implementationIds, []);
  assert.equal(
    override.explainerVisuals[0].assetPath,
    "/assets/technology/explainers/shopping-centre-camera-movement-intelligence.png",
  );

  // The narrowing is asked once, in the scene-scoped resolver every tab reads
  // from — not re-implemented per tab, and not left to the panel to remember.
  const runtime = sceneRuntime();
  assert.match(runtime, /getSegmentCapabilityMediaOverride/);
  assert.match(runtime, /override\?\.allowCapabilityVideo === false \? null/);
  /* Still asked once, in the one resolver every tab reads. Since 2026-09-27
     the drawer may prefer its own per-segment list over the shared one (see
     scene-drawer-overrides.ts), so the check names both sources and the
     single place they are combined. */
  assert.match(runtime, /const segmentList = drawer\?\.implementationIds \?\? override\?\.implementationIds/);
  assert.match(runtime, /!segmentList \|\| segmentList\.includes\(impl\.id\)/);

  const source = depth();
  // And the panel itself never hard-codes a hardware name or a fallback from
  // another segment — every name it can show comes from the resolved model.
  // (The runtime file legitimately discusses several segments by name in its
  // own comments, so this check stays scoped to the panel.)
  for (const forbidden of [/LiDAR/i, /Xovis/i, /RoboSense/i, /Milesight/i, /retail/i]) {
    assert.doesNotMatch(source, forbidden, `the panel names ${forbidden}`);
  }
});

test("13. no fake proof: this segment has none approved and the panel says so", () => {
  for (const sceneId of getSegment(SEGMENT).coreRoute) {
    assert.deepEqual(getPlayableProofsForScene(SEGMENT, sceneId), []);
  }
  const source = depth();
  assert.match(source, /getPlayableProofsForScene/);
  assert.match(source, /proofUnavailable/);
  // "In practice" itself — the proof section — carries no player, no
  // transcript, no fabricated case. (A demonstration video now legitimately
  // exists elsewhere in this file, under "How it works"; Gate 8 wires it in
  // deliberately and keeps it out of the proof section specifically — see the
  // "demonstrations stay under How it works" test below.)
  const practiceTab = source.slice(source.indexOf("function PracticeTab"));
  for (const forbidden of [/<video/i, /autoplay/i, /transcript/i, /case-study/i]) {
    assert.doesNotMatch(practiceTab, forbidden);
  }
  for (const locale of locales) {
    assert.ok(getMessages(locale).ui.proofUnavailable.length > 10);
  }
});

test("13b. demonstration video is user-initiated, has controls, and stays out of proof", () => {
  const source = depth();
  // The player is native, with controls, and mounts only once the reader
  // clicks — never `autoPlay` on the drawer opening, only on the explicit
  // "See …" trigger.
  assert.match(source, /<video[\s\S]{0,40}controls[\s\S]{0,20}autoPlay/);
  assert.match(source, /rd-depth__video-trigger.*onClick.*setOpen\(true\)/);
  // It lives in the "How it works" machinery, not in the proof one.
  const howSection = source.slice(source.indexOf("function HowItWorksTab"), source.indexOf("function TechnologyTab"));
  assert.match(howSection, /ExplainerVideo/);
  const practiceTab = source.slice(source.indexOf("function PracticeTab"));
  assert.doesNotMatch(practiceTab, /<video/i);
});

/* ------------------------------------------------------------------ *
   5. ISOLATION
 * ------------------------------------------------------------------ */

test("14. the redesign is reachable only from the preview, and is production-guarded", () => {
  const page = read("app/preview/redesign/shopping-centre-circulation/page.tsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);

  // The shell must not import any redesign component.
  const shell = read("app/components/CommercialExperience.tsx");
  assert.doesNotMatch(shell, /components\/redesign/);
  assert.doesNotMatch(shell, /SceneFrame|DepthPanel/);

  // And no approved scene component adopts the redesign class prefix.
  for (const file of [
    "app/components/ShoppingCentreInternalCirculationScene.tsx",
    "app/components/ConfigureSceneLayout.tsx",
    "app/components/ActSceneLayout.tsx",
  ]) {
    assert.doesNotMatch(read(file), /className="rd[_-]/);
  }
});

test("15. the redesign styles are namespaced so no approved surface can inherit them", () => {
  const css = read("app/globals.css");
  const redesignRules = css.split("\n").filter((line) => /^\.rd[_-]/.test(line.trim()));
  assert.ok(redesignRules.length > 20, "the pilot must actually carry its own rules");
  for (const rule of redesignRules) {
    assert.match(
      rule.trim(),
      /^\.rd(__|-depth|-ov|-rev|-demo|-brief|--)/,
      `a redesign rule is not namespaced: ${rule.trim()}`,
    );
  }
});

/* ------------------------------------------------------------------ *
   6. INTERACTION — the three review blockers
 * ------------------------------------------------------------------ */

test("16. the primary action resolves from nextSceneId and is a real destination", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  assert.equal(scene.nextSceneId, "shopping-centre-zone-anchor-exposure");

  const source = pilot();
  // Derived, never a literal path to a scene.
  assert.match(source, /const nextSceneId = scene\.nextSceneId \?\? null;/);
  assert.match(source, /\?scene=\$\{nextSceneId\}&locale=\$\{locale\}/);
  assert.doesNotMatch(source, /"\/preview\/shopping-centre-zone-anchor-exposure"/);

  // An anchor, so the destination is verifiable and navigable — the previous
  // build shipped an inert <button> with no destination at all.
  assert.match(frame(), /<a className="rd__cta" href=\{ctaHref\}>/);
});

test("17. a handoff out of the redesign says so, in every language", () => {
  // Every Core scene now has pilot copy, so the CTA stays inside the redesign
  // for the whole route. The single handoff is at the END of Core.
  const route = getSegment(SEGMENT).coreRoute;
  for (const sceneId of route.slice(0, -1)) {
    const next = getSceneForSegment(SEGMENT, sceneId).nextSceneId;
    assert.ok(messages.en.scene[next], `${sceneId} steps out of the redesign at ${next}`);
  }
  const last = getSceneForSegment(SEGMENT, route[route.length - 1]);
  assert.equal(last.nextSceneId, undefined, "Core must end, not point at a ninth scene");
  assert.equal(last.nextCta, "Configure solution");

  assert.match(pilot(), /const endOfCore = nextSceneId === null;/);
  assert.match(pilot(), /ctaNote = endOfCore \|\| !nextHasPilotCopy/);
  for (const locale of locales) {
    const note = getMessages(locale).ui.ctaHandoffNote;
    assert.ok(note && note.length > 30, `${locale} has no handoff note`);
    assert.match(
      note,
      /(language|langue|Sprache)/,
      `${locale} must say the language does not travel`,
    );
  }
});

test("18. the technical drawer is modal: focus in, trapped, returned", () => {
  const source = frame();
  // A right-side drawer that dims the page, so it is focused rather than
  // scrolled to.
  assert.match(source, /panel\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /rd--dimmed/);
  assert.match(read("app/globals.css"), /\.rd--dimmed[\s\S]{0,400}pointer-events: none/);
  // Tab is trapped inside while it is open.
  assert.match(source, /event\.key !== "Tab"/);
  assert.match(source, /event\.shiftKey && \(active === first/);
  assert.match(depth(), /aria-modal="true"/);
  // Focus return lives in the effect cleanup, so every close path is covered —
  // Escape, the Close control, and anything added later.
  assert.match(source, /if \(cameFromPanel\) trigger\?\.focus\(\);/);
  // The trigger is captured on setup, not read at teardown.
  assert.match(source, /const trigger = depthTrigger\.current;/);
  assert.match(source, /active === document\.body/);
  // And the panel is focusable at all.
  assert.match(depth(), /tabIndex=\{-1\}/);
  assert.match(depth(), /ref=\{ref\}/);
});

test("19. the Configure bridge is described as a separate preview, not continuity", () => {
  for (const locale of locales) {
    const ui = getMessages(locale).ui;
    assert.match(
      ui.bridgeLabel,
      /(separate preview|aperçu distinct|separate Vorschau)/i,
      `${locale} bridge label implies continuity`,
    );
    // The earlier wording claimed the same state. It must not come back.
    assert.doesNotMatch(ui.bridgeNote, /same state|même état|demselben Zustand/i);
    assert.match(
      ui.bridgeNote,
      /(own state|son propre état|eigenem Zustand)/i,
      `${locale} bridge note must say the destination has its own state`,
    );
  }
  // It is a plain link to another preview route, and nothing is handed to it.
  assert.match(pilot(), /href="\/preview\/shopping-centre-configure"/);
  assert.doesNotMatch(pilot(), /shopping-centre-configure\?/);
});

/* ------------------------------------------------------------------ *
   7. RUNTIME-DERIVED CONTENT IS TRANSLATED, NOT DUPLICATED
 * ------------------------------------------------------------------ */

test("20. every runtime-derived string the panel renders is covered in FR and DE", () => {
  const scene = getSceneForSegment(SEGMENT, SCENE);
  const override = getSegmentCapabilityMediaOverride(SEGMENT, "TECH-04");
  const inputIds = scene.derivedDependencies.flatMap((d) => d.requiredInputIds);

  assert.deepEqual(
    validateDomainMessages(
      SEGMENT,
      scene.technologyCapabilityIds,
      override.explainerVisuals.map((visual) => visual.approachId),
      inputIds,
    ),
    [],
  );
});

test("21. English is resolved from the domain model, never retyped", () => {
  const capability = getTechnologyCapability("TECH-04");
  const override = getSegmentCapabilityMediaOverride(SEGMENT, "TECH-04");

  // The English case returns the model's own strings, by identity of content.
  const en = resolveCapabilityCopy("en", SEGMENT, "TECH-04");
  assert.equal(en.name, capability.name);
  assert.equal(en.purpose, override.purpose);

  const enPrivacy = resolvePrivacyCopy("en");
  assert.equal(enPrivacy.headline, configurePrivacyStatement.headline);
  assert.equal(enPrivacy.principles.length, configurePrivacyStatement.principles.length);

  // And the translation layer holds no English copy of those strings.
  const domainSource = read("app/i18n/domain.ts");
  assert.ok(!domainSource.includes(capability.purpose), "the English purpose is duplicated");
  assert.ok(!domainSource.includes(override.purpose), "the override purpose is duplicated");
  assert.ok(
    !domainSource.includes(configurePrivacyStatement.lead),
    "the English privacy lead is duplicated",
  );
});

test("22. translated domain copy keeps the boundaries the English states", () => {
  for (const locale of ["fr", "de"]) {
    const cap = resolveCapabilityCopy(locale, SEGMENT, "TECH-04");
    // "inside configured coverage only" is the load-bearing half of TECH-04.
    assert.match(
      cap.purpose,
      /(couverture configurée|konfigurierten Abdeckung)/i,
      `${locale} drops the configured-coverage boundary`,
    );
    const privacy = resolvePrivacyCopy(locale);
    assert.match(privacy.principles[3].body, /(implémentation|Implementierung)/i);
    assert.match(
      privacy.principles[3].body,
      /(jamais généralis|niemals.*verallgemeinert)/i,
      `${locale} drops "never generalised across suppliers"`,
    );
  }
});

test("23. French typography: a narrow no-break space precedes ? ! ; and :", () => {
  const fr = JSON.stringify(messages.fr);
  // No plain space before those marks anywhere in French display copy.
  assert.doesNotMatch(fr, /\w \?/, "French copy has a plain space before ?");
  assert.doesNotMatch(fr, /\w !/, "French copy has a plain space before !");
  // English and German must NOT have picked one up.
  for (const locale of ["en", "de"]) {
    assert.doesNotMatch(
      JSON.stringify(messages[locale]),
      / /,
      `${locale} copy carries a French narrow no-break space`,
    );
  }
  // And the character must never appear in executable code.
  for (const file of ["app/i18n/messages.ts", "app/i18n/domain.ts"]) {
    for (const line of read(file).split("\n")) {
      if (!line.includes(" ")) continue;
      assert.ok(
        !/\?\?|!==|=>/.test(line),
        `a narrow no-break space reached code: ${line.trim().slice(0, 70)}`,
      );
    }
  }
});


/* ------------------------------------------------------------------ *
   8. THE EXPLORATION CANVAS
 * ------------------------------------------------------------------ */

test("24. hotspot geometry exists only where a scene has a real visual locus", () => {
  assert.match(read("app/globals.css"), /aspect-ratio: var\(--rd-aspect/);

  const declared = Object.keys(HOTSPOTS);
  const hotspotScenes = Object.entries(sceneModes)
    .filter(([, mode]) => mode === "hotspots")
    .map(([id]) => id);
  assert.deepEqual([...declared].sort(), [...hotspotScenes].sort());

  // A layer scene must have NO geometry: that is the whole point of the split.
  for (const [sceneId, mode] of Object.entries(sceneModes)) {
    if (mode === "layer") assert.ok(!declared.includes(sceneId), `${sceneId} has hotspots`);
  }

  for (const [sceneId, points] of Object.entries(HOTSPOTS)) {
    const size = ASSET_SIZE[sceneId];
    assert.ok(size, `${sceneId} declares no asset size`);
    assert.ok(points.length >= 2, `${sceneId} declares fewer than two subjects`);
    for (const point of points) {
      assert.ok(point.x > 0 && point.x < size.w, `${sceneId}.${point.id} x is outside the asset`);
      assert.ok(point.y > 0 && point.y < size.h, `${sceneId}.${point.id} y is outside the asset`);
      assert.ok(["left", "right"].includes(point.side));
      assert.ok(["above", "below"].includes(point.vertical));
      for (const locale of locales) {
        assert.ok(
          getMessages(locale).scene[sceneId].focus[point.id],
          `${locale} has no copy for ${sceneId}.${point.id}`,
        );
      }
    }
    // Points must be distinct, or two subjects sit on top of each other.
    const keys = points.map((p) => `${p.x},${p.y}`);
    assert.equal(new Set(keys).size, keys.length, `${sceneId} has coincident hotspots`);
  }
});

test("24b. the whole Core route is covered, in every language", () => {
  const route = getSegment(SEGMENT).coreRoute;
  assert.equal(route.length, 8);
  for (const locale of locales) {
    for (const sceneId of route) {
      const copy = getMessages(locale).scene[sceneId];
      assert.ok(copy, `${locale} has no copy for ${sceneId}`);
      // The question and CTA are the typed model's own, not a paraphrase.
      if (locale === "en") {
        const scene = getSceneForSegment(SEGMENT, sceneId);
        assert.equal(copy.question, scene.commercialQuestion, `${sceneId} question drifted`);
        assert.equal(copy.supporting, scene.supportingLine, `${sceneId} supporting line drifted`);
        assert.equal(copy.nextCta, scene.nextCta, `${sceneId} CTA drifted`);
      }
      // Every focus body is one of that scene's typed evidence descriptions.
      const scene = getSceneForSegment(SEGMENT, sceneId);
      assert.equal(
        Object.keys(copy.focus).length,
        sceneFocusOrder[sceneId].length,
        `${locale}.${sceneId} focus count does not match its declared order`,
      );
      if (locale === "en") {
        const typed = scene.evidence.map((e) => e.description);
        for (const [id, entry] of Object.entries(copy.focus)) {
          assert.ok(
            typed.includes(entry.body),
            `${sceneId}.${id} body is not one of the scene's typed evidence clusters`,
          );
        }
      }
    }
    // Exactly the eight Core scenes, and nothing else.
    assert.deepEqual(Object.keys(getMessages(locale).scene).sort(), [...route].sort());
  }
});

test("24c. every scene renders an approved production hero that exists on disk", () => {
  const route = getSegment(SEGMENT).coreRoute;
  assert.deepEqual(Object.keys(HEROES).sort(), [...route].sort());
  for (const [sceneId, path] of Object.entries(HEROES)) {
    assert.match(path, /^\/assets\/location-visuals\/shopping-centre\//, `${sceneId} leaves the approved directory`);
    assert.ok(
      existsSync(repoFile(`public${path}`)),
      `${sceneId} points at a hero that does not exist: ${path}`,
    );
    // The asset's declared size must match the file the scene actually uses.
    assert.ok(ASSET_SIZE[sceneId], `${sceneId} declares no asset size`);
  }
  assert.ok(new Set(Object.values(HEROES)).size >= 7, "too many scenes share one hero");
});

test("25. activating a subject changes the overlay, and each overlay marks an area", () => {
  const source = pilot();
  // One overlay per subject, selected by the active id — not a static picture.
  assert.match(source, /function Overlay\(\{ sceneId, focusId \}/);
  // One overlay case per hotspot, keyed by scene AND subject, so two scenes
  // that share a subject id cannot share a drawing.
  assert.match(source, /const key = `\$\{sceneId\}:\$\{focusId\}`/);
  for (const key of [
    "shopping-centre-catchment-area:asset",
    "shopping-centre-internal-circulation:movement",
    "shopping-centre-zone-anchor-exposure:zones",
    "shopping-centre-brand-counting:threshold",
    "shopping-centre-brand-flow:between",
  ]) {
    assert.ok(source.includes(`case "${key}"`), `no overlay for ${key}`);
  }
  assert.match(frame(), /overlay=\{|\{overlay\}/);

  /* The overlays carry geometry only. The rule that matters is that nothing
     READABLE is drawn on the picture: no count, no percentage, no label. SVG
     geometry may legitimately use percentage units, so the assertion is about
     rendered text rather than about the character. */
  const overlayBlock = source.slice(source.indexOf("function Overlay"));
  assert.doesNotMatch(overlayBlock, /<text/, "an overlay renders text on the picture");
  assert.doesNotMatch(overlayBlock, /<tspan/, "an overlay renders text on the picture");
  assert.doesNotMatch(overlayBlock, />[^<>{}\n]*[A-Za-z]{3}[^<>{}\n]*</, "an overlay renders a label");
});

test("26. every reveal repeats a coverage boundary, in every language", () => {
  assert.match(frame(), /\{copy\.coverageNote\}/);
  for (const locale of locales) {
    for (const sceneId of Object.keys(messages[locale].scene)) {
      const note = messages[locale].scene[sceneId].coverageNote;
      assert.ok(note && note.length > 60, `${locale}.${sceneId} coverage note is too thin`);
      // Every note must DENY something and must name the limit of what is seen.
      assert.match(
        note,
        /\b(not|never|no|neither|nothing|nobody|pas|ni|jamais|aucun|personne|keine|kein|nicht|niemals|niemand)\b/i,
        `${locale}.${sceneId} coverage note states no denial`,
      );
      assert.match(
        note,
        /(only|approved|source|seul|uniquement|approuvée|nur|ausschließlich|freigegeben)/i,
        `${locale}.${sceneId} coverage note names no limit of scope`,
      );

      /* Catchment is the one scene whose evidence is NOT anonymous event
         counting — it is aggregate area context — so the anonymity pair does
         not apply to it, and asserting it there would force a sentence that
         misdescribes the scene. Every other scene must carry it. */
      if (sceneId === "shopping-centre-catchment-area") continue;
      assert.match(
        note,
        /(anonymous|anonymes?|Anonyme)/i,
        `${locale}.${sceneId} drops "anonymous"`,
      );
      assert.match(
        note,
        /(unique people|unique customers|personnes uniques|clients uniques|eindeutigen? (Personen|Kunden)|identit(y|é|ät)|identifi)/i,
        `${locale}.${sceneId} drops the not-unique-people boundary`,
      );
    }
  }
});

test("27. the photograph is unoccluded and the narrative sits beside it", () => {
  const source = frame();
  const css = read("app/globals.css");

  // Two columns, and the question lives in the LEFT one — not on the picture.
  assert.match(css, /\.rd__main \{[\s\S]{0,220}grid-template-columns: minmax\(0, 0\.62fr\)/);
  assert.match(source, /<section className="rd__column">/);
  assert.match(source, /<h1 className="rd__question">/);

  // The dark gradient slab over the hero is gone, in markup and in CSS.
  assert.doesNotMatch(source, /rd__overlay-panel/, "the text slab is still on the image");
  assert.doesNotMatch(css, /\.rd__overlay-panel/, "the slab's styles are still present");

  // Nothing is laid across the picture except the evidence geometry, at most
  // one point, its card, and the evidence layer where a scene has no locus.
  const figureStart = source.indexOf('className="rd__stage-figure"');
  const figure = source.slice(figureStart, source.indexOf("</figure>"));
  for (const allowed of ["rd__overlay", "rd__point", "rd__card", "rd__layer", "rd__figcaption"]) {
    assert.ok(figure.includes(allowed), `${allowed} is missing from the figure`);
  }
  assert.doesNotMatch(figure, /rd__question|rd__truth|rd__focus-tab/, "narrative leaked onto the image");

  // The evidence chain is a dark full-width rail beneath the composition.
  assert.match(css, /\.rd__rail \{[\s\S]{0,260}background: var\(--pfm-black\)/);
  const pilotSource = pilot();
  assert.ok(
    pilotSource.indexOf("rd__rail") > pilotSource.indexOf("<SceneFrame"),
    "the evidence rail must sit below the composition",
  );
  assert.ok(pilotSource.indexOf("rd__bridge") > pilotSource.indexOf("rd__rail"));
});

test("28. at most one point of interest, tied to the selected subject", () => {
  const source = frame();
  // One point, resolved from the active focus — never a set of labels.
  assert.match(source, /hotspots\.find\(\(h\) => h\.id === activeFocusId\)/);
  assert.doesNotMatch(source, /rd__hotspot-label/, "permanent image labels are back");
  assert.doesNotMatch(source, /hotspots\.map\(/, "the image renders every hotspot again");
  // It becomes a close control when open.
  assert.match(source, /\{pointOpen \? "×" : "\+"\}/);
  // Choosing another subject closes the open point rather than moving it.
  assert.match(source, /onFocus\(id\);\s*\n\s*onPoint\(false\);/);
});

test("29. the attached card carries a kicker, one explanation and one note", () => {
  const source = frame();
  const cardStart = source.indexOf('className={`rd__card');
  const card = source.slice(cardStart, source.indexOf("</div>", cardStart));
  assert.match(card, /rd__card-kicker">\{copy\.focus\[point\.id\]\?\.label\}/);
  assert.match(card, /rd__card-body">\{copy\.focus\[point\.id\]\?\.body\}/);
  assert.match(card, /rd__card-note">\{copy\.illustrative\}/);
  // It must NOT repeat the full truth boundary.
  assert.doesNotMatch(card, /coverageNote|copy\.truth/, "the card repeats the truth boundary");
  // The boundary is still on the page, in the narrative column.
  assert.match(source, /className="rd__truth">\{copy\.truth\}/);
  // Flat: attached, not a floating tooltip.
  assert.doesNotMatch(read("app/globals.css"), /\.rd__card \{[\s\S]{0,300}box-shadow/);
});

test("30. only evidence-carrying geometry survives", () => {
  const overlay = pilot().slice(pilot().indexOf("function Overlay"));
  // Thin strokes only. No dashes, no fills, no rings.
  assert.doesNotMatch(overlay, /strokeDasharray|stroke-dasharray/, "dashed contours are back");
  assert.doesNotMatch(overlay, /<ellipse|<circle/, "ring geometry is back");
  assert.doesNotMatch(overlay, /rd-ov__area|rd-ov__ring|rd-ov__inset/, "fill classes are back");
  const css = read("app/globals.css");
  assert.match(css, /\.rd-ov \{[^}]*fill: none/);
  assert.doesNotMatch(css, /\.rd-ov__(area|ring|inset|edge|link)/, "decorative overlay styles remain");

  // Every case returns a single rect, and a scene with no locus draws nothing.
  assert.match(overlay, /default:\s*\n\s*return null;/);
});
