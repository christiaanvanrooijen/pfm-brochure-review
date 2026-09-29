import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const starts = () => read("app/i18n/starts.ts");
const media = () => read("app/preview/redesign/start/media.ts");
const start = () => read("app/preview/redesign/start/start.tsx");

const SEGMENTS = ["retail", "shopping-centre", "retail-park", "outlet-centre", "qsr"];
const SCENES = {
  retail: "retail-street-opportunity",
  "shopping-centre": "shopping-centre-catchment-area",
  "retail-park": "retail-park-catchment-area",
  "outlet-centre": "outlet-centre-destination-catchment",
  qsr: "qsr-drive-thru-context",
};

test("1. each start opens on its segment's own first Core scene", () => {
  for (const [segment, sceneId] of Object.entries(SCENES)) {
    const model = read(
      `app/content/segments/${segment === "qsr" ? "qsr" : segment === "retail" ? "retail" : segment}.ts`,
    );
    // The scene is the model's own, and it is corePathOrder 1.
    const at = model.indexOf(`id: "${sceneId}"`);
    assert.ok(at > 0, `${sceneId} is not declared in the ${segment} model`);
    const block = model.slice(at, at + 400);
    assert.match(block, /corePathOrder: 1/, `${sceneId} is not the first Core scene`);
    assert.match(starts(), new RegExp(`\"?${segment}\"?: "${sceneId}"`));
  }
});

test("2. every start question and CTA is the typed model's own wording", () => {
  const copy = starts();
  const pairs = [
    ["retail", "How much passing traffic is available, and what share enters the store?", "Measure store visits"],
    ["retail-park", "Where do park visitors come from, and what demand sits around the asset?", "Measure vehicle arrival"],
    ["outlet-centre", "How far are visitors willing to travel to the outlet destination?", "Understand origin context"],
    ["qsr", "Where does your drive-thru lose time?", "Follow the vehicle journey"],
  ];
  for (const [segment, question, cta] of pairs) {
    const file = segment === "retail" ? "retail" : segment;
    const model = read(`app/content/segments/${file}.ts`);
    assert.ok(model.includes(question), `${segment}: question is not the model's`);
    assert.ok(model.includes(`nextCta: "${cta}"`), `${segment}: CTA is not the model's`);
    assert.ok(copy.includes(question) && copy.includes(cta));
  }
});

test("3. Shopping Centre's start is not a second copy of an existing scene", () => {
  // It reuses the accepted journey's copy for the same scene rather than
  // restating it, so the two can never drift apart.
  assert.match(starts(), /sceneCopy\.en\["shopping-centre-catchment-area"\]/);
  assert.match(starts(), /sceneCopy\.fr\["shopping-centre-catchment-area"\]/);
  assert.match(starts(), /sceneCopy\.de\["shopping-centre-catchment-area"\]/);
});

test("4. no start borrows another segment's imagery", () => {
  const m = media();
  const heroBlock = m.slice(m.indexOf("START_HERO"), m.indexOf("START_ASSET"));
  // Each hero path must live under its own segment's asset folder.
  const folderFor = { retail: "retail/", "shopping-centre": "shopping-centre/", "retail-park": "retail-park/" };
  for (const [segment, folder] of Object.entries(folderFor)) {
    const line = heroBlock
      .split("\n")
      .find((l) => l.includes(`"${SCENES[segment]}"`));
    assert.ok(line, `${segment} has no hero entry`);
    assert.ok(line.includes(`${folder}`), `${segment} hero is not from its own folder: ${line.trim()}`);
  }
  // Outlet catchment still has no hero: its cover is a cover, and the one file
  // that looks like a catchment aerial is the Shopping Centre duplicate.
  assert.match(heroBlock, /"outlet-centre-destination-catchment": null/);
  // QSR now has its own artwork, and that frame genuinely shows the lane its
  // context scene is about — so here the cover is also the hero.
  assert.match(heroBlock, /"qsr-drive-thru-context": `\$\{V\}qsr\/qsr-drive-thru-context-hero\.png`/);
});

test("5. a missing visual is stated, never filled with a substitute", () => {
  const frame = read("app/components/redesign/SceneFrame.tsx");
  assert.match(frame, /heroSrc: string \| null/);
  assert.match(frame, /rd__pending/);
  // Nothing illustrative is displayed, so nothing claims to be.
  const pending = frame.slice(frame.indexOf('className="rd__pending"'), frame.indexOf("</div>", frame.indexOf('className="rd__pending"')));
  assert.doesNotMatch(pending, /copy\.illustrative/);
  assert.match(frame, /\{heroSrc && !cover && \(\s*\n\s*<figcaption/);
  for (const locale of ["visualPending", "visualPendingBody"]) {
    const count = (read("app/i18n/messages.ts").match(new RegExp(`${locale}:`, "g")) ?? []).length;
    assert.equal(count, 3, `${locale} must exist in all three locales`);
  }
});

test("6. a + exists only where a real spatial locus does", () => {
  const m = media();
  const block = m.slice(m.indexOf("START_HOTSPOTS"), m.indexOf("Onward handoff"));
  // Retail points at the doorway only. Opening hours and a capture rate are
  // not places, so those focuses carry no point at all.
  assert.match(block, /"retail-street-opportunity": \[\s*\n\s*\{ id: "measured"/);
  assert.doesNotMatch(block, /id: "connected"/);
  assert.doesNotMatch(block, /id: "derived"/);
  // The two starts with no asset have nothing to point at.
  assert.match(block, /"outlet-centre-destination-catchment": \[\]/);
  assert.match(block, /"qsr-drive-thru-context": \[\]/);
  // And those two use the evidence layer instead.
  assert.match(m, /"outlet-centre-destination-catchment": "layer"/);
  assert.match(m, /"qsr-drive-thru-context": "layer"/);
});

test("7. overlay geometry carries evidence and nothing decorative", () => {
  const overlay = start().slice(start().indexOf("function StartOverlay"));
  assert.doesNotMatch(overlay, /strokeDasharray|<circle|<ellipse/);
  // Only the loci that the typed evidence defends are drawn.
  assert.match(overlay, /retail-street-opportunity:measured/);
  assert.match(overlay, /retail-park-catchment-area:asset/);
  assert.match(overlay, /retail-park-catchment-area:reach/);
  assert.doesNotMatch(overlay, /retail-street-opportunity:(connected|derived)/);
  assert.match(overlay, /default:\s*\n\s*return null;/);
});

test("8. only Shopping Centre continues into the redesign; the rest say where it stops", () => {
  const m = media();
  assert.match(m, /"shopping-centre-catchment-area": \{ kind: "redesign"/);
  assert.match(m, /"retail-park-catchment-area": \{ kind: "preview", href: "\/preview\/retail-park-vehicle-arrival" \}/);
  for (const sceneId of ["retail-street-opportunity", "outlet-centre-destination-catchment", "qsr-drive-thru-context"]) {
    assert.match(m, new RegExp(`"${sceneId}": \\{ kind: "none" \\}`));
  }
  const s = start();
  // The redesign handoff carries the chosen language; the preview handoff says
  // in words that it does not.
  assert.match(s, /shopping-centre-circulation\?scene=\$\{handoff\.sceneId\}&locale=\$\{locale\}/);
  assert.match(s, /handoff\.kind === "preview"\s*\n?\s*\? t\.handoffPreviewNote/);
  const ui = read("app/i18n/messages.ts");
  for (const key of ["handoffPreviewNote", "handoffNone"]) {
    assert.equal((ui.match(new RegExp(`${key}:`, "g")) ?? []).length, 3, `${key} missing a locale`);
  }
});

test("9. every start is covered in all three locales", () => {
  const copy = starts();
  for (const sceneId of Object.values(SCENES)) {
    if (sceneId === "shopping-centre-catchment-area") continue; // re-exported
    const occurrences = (copy.match(new RegExp(`"${sceneId}": \\{`, "g")) ?? []).length;
    assert.equal(occurrences, 3, `${sceneId} must appear in en, fr and de`);
  }
});

test("10. the starts reuse the accepted presentation baseline", () => {
  const s = start();
  assert.match(s, /from "\.\.\/\.\.\/\.\.\/components\/redesign\/SceneFrame"/);
  assert.match(s, /from "\.\.\/\.\.\/\.\.\/components\/redesign\/DepthPanel"/);
  assert.match(s, /className="rd__rail"/);
  // Configure and Act are synthesis stages: never struck through.
  assert.match(s, /isSynthesis = id === "configure" \|\| id === "act"/);
  assert.match(s, /!hasScenes && !isSynthesis/);
});

/* The isolated starts are no longer a destination anything links to: the demo
   is the one local preview, and it opens a segment's whole Core route rather
   than its first scene. The starts keep their own addresses for capture and
   review, so the original invariant stands again as written. */
test("11. the starts are isolated from the approved shell", () => {
  const shell = read("app/components/CommercialExperience.tsx");
  assert.doesNotMatch(shell, /redesign\/start|SegmentStart|startCopy/);

  // Nor are they offered as a destination from the front door, where they read
  // as a lesser version of a journey that exists in full elsewhere.
  assert.doesNotMatch(read("app/components/SegmentOverview.tsx"), /redesign\/start/);

  const page = read("app/preview/redesign/start/page.tsx");
  assert.match(page, /robots: \{ index: false, follow: false \}/);
});

test("12. a start with nowhere to go does not pretend otherwise", () => {
  const frame = read("app/components/redesign/SceneFrame.tsx");
  assert.match(frame, /ctaHref: string \| null/);
  // Rendered inert, not as a link to "#".
  assert.match(frame, /<span className="rd__cta is-inert" aria-disabled="true">/);
  assert.doesNotMatch(read("app/preview/redesign/start/start.tsx"), /"#"/);
  assert.match(read("app/globals.css"), /\.rd__cta\.is-inert/);
});

test("13. every capability a start opens on is translated into FR and DE", () => {
  const domain = read("app/i18n/domain.ts");
  const block = domain.slice(domain.indexOf("capabilityTranslations"), domain.indexOf("resolveCapabilityCopy"));
  const fr = block.slice(block.indexOf("  fr: {"), block.indexOf("  de: {"));
  const de = block.slice(block.indexOf("  de: {"));
  // The capabilities the five first Core scenes declare.
  for (const id of ["TECH-01", "TECH-02", "TECH-07", "TECH-QSR-01", "TECH-QSR-02"]) {
    assert.ok(fr.includes(`"${id}"`), `${id} has no French capability copy`);
    assert.ok(de.includes(`"${id}"`), `${id} has no German capability copy`);
  }
});

test("14. a missing illustration is not reported as a missing video", () => {
  const panel = read("app/components/redesign/DepthPanel.tsx");
  // Gate 8 extracted the inline "how" branch into its own component; the
  // check now reads that function's body directly.
  const how = panel.slice(panel.indexOf("function HowItWorksTab"), panel.indexOf("function ExplainerVideo"));
  assert.match(how, /t\.explainerNone/);
  // The video sentence may only appear where a video is actually the subject
  // (there are explainers to illustrate) and none was resolved.
  assert.match(how, /videos\.length === 0 && explainers\.length > 0/);
  const ui = read("app/i18n/messages.ts");
  assert.equal((ui.match(/explainerNone:/g) ?? []).length, 3);
});
