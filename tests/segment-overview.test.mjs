/**
 * The front door: five segments, as a choice.
 *
 * What these tests hold is the thing a picker loses first. A card has space for
 * a tagline, a tagline is quicker to write than to check, and within a release
 * the card and the journey are saying two different things about the same
 * segment. So: the overview authors nothing about a segment, every cover is a
 * real file that belongs to that segment alone, and every promise the card
 * makes about how far a segment runs comes from the segment's own status.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { segmentStartVisuals, getSegmentStartVisual } from "../app/content/segment-start-visuals.ts";
import { segmentDefinitions } from "../app/content/segments/index.ts";
import { overviewCopy } from "../app/i18n/overview.ts";
import { startCopy, startScenes } from "../app/i18n/starts.ts";
import { locales } from "../app/i18n/locales.ts";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const publicFile = (webPath) =>
  fileURLToPath(new URL(`../public${webPath}`, import.meta.url));

const overview = () => read("app/components/SegmentOverview.tsx");

test("1. every segment the overview lists has a cover, and every cover is on disk", () => {
  assert.equal(segmentDefinitions.length, 5);
  for (const segment of segmentDefinitions) {
    const cover = getSegmentStartVisual(segment.id);
    assert.ok(cover, `${segment.id} has no cover, so its card would show an empty plate`);
    assert.ok(
      existsSync(publicFile(cover.assetPath)),
      `${segment.id}'s cover names a file that is not there: ${cover.assetPath}`,
    );
  }
});

test("2. no two segments share a cover", () => {
  const paths = segmentStartVisuals.map((v) => v.assetPath);
  assert.equal(
    new Set(paths).size,
    paths.length,
    "two segments are covered by the same picture, which makes one of them a picture of the other",
  );
});

test("3. a cover claims nothing", () => {
  for (const visual of segmentStartVisuals) {
    assert.equal(visual.isEvidence, false);
    assert.equal(visual.illustrative, true);
    assert.ok(visual.selectionNote.length > 40, `${visual.segment}'s cover has no real reason`);
    // Alt text describes a picture; it never states a quantity.
    assert.doesNotMatch(
      visual.altText,
      /\d[\d,.]*\s*(%|per cent|percent|visits|visitors|entries|counts)/i,
      `${visual.segment}'s cover alt text states a figure`,
    );
  }
});

test("4. a cover is never also the evidence hero of the scene it covers", () => {
  const heroes = read("app/preview/redesign/start/media.ts");
  for (const visual of segmentStartVisuals) {
    if (visual.alsoSceneHeroFor) continue; // Declared dual use, and only QSR has one.
    const sceneId = startScenes[visual.segment];
    const at = heroes.indexOf(`"${sceneId}":`);
    const line = heroes.slice(at, heroes.indexOf("\n", at));
    assert.ok(
      !line.includes(visual.assetPath.split("/").pop()),
      `${visual.segment}'s cover is also its first scene's hero without saying so`,
    );
  }
});

test("5. the overview writes no prose of its own about any segment", () => {
  const source = overview();
  // Every segment-specific string is resolved, never typed.
  assert.match(source, /segment\.experienceName \?\? segment\.name/);
  assert.match(source, /startCopy\[locale\]\[sceneId\]\.question/);
  assert.match(source, /getSegmentStartVisual\(segment\.id\)/);
  // No segment name appears as a literal anywhere in the component.
  for (const segment of segmentDefinitions) {
    assert.ok(
      !source.includes(`"${segment.name}"`),
      `${segment.name} is written into the overview instead of resolved`,
    );
  }
});

/* The defect this guards: the card labelled itself from the PRODUCT status and
   linked every segment to a one-scene start, so Retail read "full journey" and
   opened a single scene, while four complete Core journeys sat in the demo
   unmentioned. Every card now opens a Core journey, and readiness is a separate
   claim that cannot borrow the journey's words. */
test("6. every card opens that segment's Core journey", () => {
  const source = overview();

  // One destination for all five, carrying the chosen language.
  assert.match(source, /`\/preview\/demo\?segment=\$\{segment\.id\}&locale=\$\{locale\}`/);

  // No card is sent to an isolated start, and none says "start only".
  assert.doesNotMatch(source, /redesign\/start/);
  assert.doesNotMatch(source, /openStart|statusArchitecture/);

  // The scene total is read from the typed route, not kept in step by hand.
  assert.match(source, /scenes: segment\.coreRoute\.length/);
});

test("7. a complete preview is never presented as an implemented segment", () => {
  const source = overview();

  // Retail is the one implementation-ready segment, and the card does not
  // decide that for itself — it asks the shell's own rule.
  const ready = segmentDefinitions.filter(
    (s) => s.implementationStatus === "implementation_ready",
  );
  assert.equal(ready.length, 1);
  assert.equal(ready[0].id, "retail");
  assert.match(source, /const runsInShell = shellRunsSegment\(segment\)/);
  assert.doesNotMatch(source, /implementation_ready/);

  // With the brochure approved, the overview offers no second link to the
  // approved shell and no internal readiness note (product lead, 2026-09-29):
  // the shell is only the fallback when the brochure is not approved.
  assert.doesNotMatch(source, /shellHref|copy\.alsoShell|copy\.shellLabel|copy\.statusNote|href="\/shell"/);
  for (const locale of locales) {
    assert.equal(overviewCopy[locale].statusNote, undefined);
    assert.equal(overviewCopy[locale].shellLabel, undefined);
  }
});

test("8. the front door exposes in production only what the product lead approved", () => {
  const source = overview();
  // The journeys are offered wherever the brochure is approved: outside
  // production always, and in production by the one release switch (product
  // lead, 2026-09-29). Without it, a card falls back to the approved shell, or
  // to nothing.
  assert.match(source, /const previewable = brochureRouteAvailable\(\)/);
  assert.match(source, /href: previewable/);
  const release = read("app/content/release.ts");
  assert.match(release, /export const brochureApprovedForProduction = true;/);
  assert.match(release, /return brochureApprovedForProduction \|\| process\.env\.NODE_ENV !== "production";/);
  // A card with no destination renders as a card, not as a dead link.
  assert.match(source, /<span className="ov__link is-inert" aria-disabled="true">/);

  // Whatever the shell can run, it can be opened on directly.
  const shellPage = read("app/shell/page.tsx");
  assert.match(shellPage, /shellCanRunSegment\(raw as SegmentId\)/);
  assert.match(shellPage, /initialSegmentId=\{segment\}/);
  const shell = read("app/components/CommercialExperience.tsx");
  assert.match(shell, /initialSegmentId \&\& shellCanRunSegment\(initialSegmentId\)/);
  assert.match(shell, /\{ \.\.\.initialState, segmentId: initialSegmentId \}/);
});

test("9. the overview chrome is translated into every locale", () => {
  const keys = Object.keys(overviewCopy.en);
  for (const locale of locales) {
    assert.ok(overviewCopy[locale], `no overview copy for ${locale}`);
    for (const key of keys) {
      const value = overviewCopy[locale][key];
      // The About facts are a list; every entry in it must be filled.
      const filled = Array.isArray(value)
        ? value.length === overviewCopy.en[key].length && value.every((f) => f.title && f.text)
        : typeof value === "string" && value.length > 0;
      assert.ok(filled, `${locale}.${key} is empty`);
    }
  }
});

test("10. every card's question is the one the reader meets one click later", () => {
  for (const locale of locales) {
    for (const segment of segmentDefinitions) {
      const sceneId = startScenes[segment.id];
      const question = startCopy[locale][sceneId]?.question;
      assert.ok(question, `${segment.id} has no ${locale} question for its start`);
    }
  }
});

test("11. the front door is the cover, then the overview, and the approved shell keeps its own address", () => {
  // The root renders the gateway, and the gateway renders the Unified Intro
  // first and the overview after Explore — nothing else.
  const home = read("app/page.tsx");
  assert.match(home, /<RootGateway\s+initialLocale=\{isLocale\(rawLocale\) \? rawLocale : defaultLocale\}\s+startAtSegments=\{startAtSegments\}\s+\/>/);
  assert.match(home, /const startAtSegments = first\(params\.start\) === "segments";/);
  assert.match(read("app/components/RootGateway.tsx"), /useState\(startAtSegments\)/);
  assert.doesNotMatch(home, /CommercialExperience/);
  const gateway = read("app/components/RootGateway.tsx");
  assert.match(gateway, /if \(!exploring\) \{\s*return <UnifiedIntro locale=\{locale\} onLocaleChange=\{setLocale\} onExplore=\{\(\) => setExploring\(true\)\} \/>;/);
  // The language chosen on the cover is the one the picker opens in.
  assert.match(gateway, /useState<Locale>\(initialLocale\)/);
  assert.match(gateway, /<SegmentOverview initialLocale=\{locale\} \/>/);
  assert.doesNotMatch(gateway, /CommercialExperience|router|href=/);

  // The cover belongs to the root only: the overview carries no intro logic, so
  // /preview/demo keeps opening straight on the picker; and no segment route
  // lists the intro as a scene.
  assert.doesNotMatch(overview(), /UnifiedIntro|RootGateway/);
  assert.doesNotMatch(read("app/preview/demo/page.tsx"), /UnifiedIntro|RootGateway/);
  assert.doesNotMatch(read("app/shell/page.tsx"), /UnifiedIntro|RootGateway/);
  for (const segment of segmentDefinitions) {
    assert.ok(!segment.coreRoute.some((id) => /intro/i.test(id)), `${segment.id} lists an intro scene`);
  }

  const shell = read("app/shell/page.tsx");
  assert.match(shell, /<CommercialExperience initialSegmentId=\{segment\} \/>/);

  // Every journey link carries the chosen language with it.
  const journeys = [...overview().matchAll(/\/preview\/demo\?segment=[^`"]*/g)];
  assert.ok(journeys.length > 0);
  for (const [href] of journeys) {
    assert.match(href, /&locale=\$\{locale\}/, `a journey link drops the language: ${href}`);
  }

  // The shell keeps its own address, but the overview no longer links to it
  // (product lead, 2026-09-29): it is reachable at /shell for those who need it.
  assert.doesNotMatch(overview(), /href="\/shell"/);
});

test("12. a cover carries no scene geometry", () => {
  const start = read("app/preview/redesign/start/start.tsx");
  // The picture on screen is the cover, so the frame is given the cover's own
  // size, no hotspots and no overlay.
  assert.match(start, /asset=\{cover \? COVER_ASSET\[segmentId\] : START_ASSET\[sceneId\]\}/);
  assert.match(start, /mode=\{cover \? "layer" : START_MODE\[sceneId\]\}/);
  assert.match(start, /hotspots=\{cover \? \[\]/);
  assert.match(start, /overlay=\{cover \? null/);
});

test("13. every approved brochure route follows the release switch; review routes stay development-only", () => {
  for (const segment of ["retail", "shopping-centre", "retail-park"]) {
    for (const stage of ["configure", "act"]) {
      const page = read(`app/preview/${segment}-${stage}/page.tsx`);
      assert.match(page, /if \(!brochureRouteAvailable\(\)\) \{\s*notFound\(\);/, `${segment}-${stage}`);
      assert.doesNotMatch(page, /process\.env\.NODE_ENV/, `${segment}-${stage} keeps its own gate`);
      // No internal "capture harness" or "draft" wording in the visible header.
      assert.doesNotMatch(read(`app/preview/${segment}-${stage}/harness.tsx`), /capture harness<|draft preview|· (Configure|Act) preview/);
    }
    // Configure hands on to Act rather than ending on a button that does nothing.
    assert.match(read(`app/preview/${segment}-configure/harness.tsx`), new RegExp(`router\\.push\\("/preview/${segment}-act"\\)`));
  }
  // Retail Park's component withholds the control by default (the shell has no
  // Retail Park Act); its own route shows it, pointed at its own Act.
  assert.match(read("app/preview/retail-park-configure/harness.tsx"), /router\.push\("\/preview\/retail-park-act"\)\} presentationMode=\{presentationMode\} showNextStage \/>/);
  // The per-scene review routes are not the brochure and stay development-only.
  for (const route of ["retail-park-unit-visits", "shopping-centre-entrances", "unified-intro"]) {
    assert.match(read(`app/preview/${route}/page.tsx`), /process\.env\.NODE_ENV === "production"/, route);
  }
});

/* "About PFM" (product lead, 2026-09-29). Every claim is traced in
   docs/content/PFM-COMPANY-FACTS.md, and the customer logos are approved for
   this use by the product lead (DECISION-LOG) — the documented approval the
   AGENTS.md truth rules require. */
test("12. the overview says who PFM is, in every language, from sourced facts only", async () => {
  const { customerLogos } = await import("../app/content/customer-logos.ts");
  const facts = read("docs/content/PFM-COMPANY-FACTS.md");
  assert.match(overview(), /copy\.aboutFacts\.map/);
  assert.match(overview(), /customerLogos\.map/);
  assert.match(read("app/i18n/overview.ts"), /PFM-COMPANY-FACTS\.md/);
  assert.match(read("docs/decisions/DECISION-LOG.md"), /customer logos[^\n]*approved/i);

  // Every logo is on disk, named, sized from its own proportions, and one of
  // the approved set; C&A was withdrawn from the set by the product lead.
  assert.equal(customerLogos.length, 20);
  for (const customer of customerLogos) {
    assert.ok(existsSync(publicFile(customer.assetPath)), `${customer.name}'s logo is not on disk`);
    assert.match(facts, new RegExp(customer.name.replace(/[&']/g, ".")), `${customer.name} is not in the approved set`);
    assert.ok(customer.aspect > 0.5 && customer.aspect < 15, `${customer.name} has no real aspect ratio`);
  }
  assert.ok(!customerLogos.some((c) => c.name === "C&A"));

  for (const locale of locales) {
    const copy = overviewCopy[locale];
    assert.equal(copy.aboutFacts.length, 3, `${locale} does not carry the three facts`);
    const all = [copy.aboutTitle, copy.aboutLead, ...copy.aboutFacts.flatMap((f) => [f.title, f.text])].join(" ");
    for (const office of ["Alphen aan den Rijn", "Birmingham", "Paris", "Berlin"]) {
      assert.match(all, new RegExp(office), `${locale} drops the ${office} office`);
    }
    for (const standard of ["ISO/IEC 27001", "ISO 9001", "ISO 14001"]) {
      assert.ok(all.includes(standard), `${locale} drops ${standard}`);
    }
  }
});

/* The installation accreditations are about installing, not about who PFM is,
   so they close the drawer's Requirements answer instead (2026-09-29). */
test("13. installation accreditations sit with installation, in every language", async () => {
  const { installationAccreditations } = await import("../app/content/installation-accreditations.ts");
  assert.match(read("app/components/redesign/DepthPanel.tsx"), /hasAnyImplementation && \(\s*<>\s*<p className="rd-depth__kicker">\{installationAccreditations\[locale\]\.heading\}/);
  assert.doesNotMatch(overview(), /installationAccreditations|NICEIC|SafeContractor/);
  for (const locale of locales) {
    const names = installationAccreditations[locale].items.map((item) => item.name);
    assert.deepEqual(names, ["NICEIC approved contractor", "SafeContractor (SSIP)", "VCA", "RI&E"]);
    assert.ok(installationAccreditations[locale].items.every((item) => item.text.length > 20));
  }
});
