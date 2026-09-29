import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { segmentDefinitions, allScenes } from "../app/content/segments/index.ts";
import { demoMedia, demoEnding, demoFocusOrder } from "../app/preview/demo/registry.ts";
import { resolveJourneyCopy, validateJourneyCopy } from "../app/i18n/journey-copy.ts";
import { retailJourneyCopy } from "../app/i18n/journey-retail.ts";
import { retailParkJourneyCopy } from "../app/i18n/journey-retail-park.ts";
import { outletJourneyCopy } from "../app/i18n/journey-outlet.ts";
import { sceneCopy } from "../app/i18n/scenes.ts";
import { qsrJourneyCopy } from "../app/i18n/qsr-journey.ts";
import { getUsableProofsForScene } from "../app/content/proof-runtime.ts";
import { getCapabilityExplainerVisuals } from "../app/content/technology-visuals.ts";
import { outletRejectedFiles } from "../app/content/outlet-asset-decisions.ts";
import {
  buildReview,
  configureOffer,
  connectedContextOf,
} from "../app/preview/demo/review-content.ts";
import {
  PICKER_PATH,
  addressAfter,
  demoUrl,
  openingScene,
  parseDemoUrl,
  pickerUrl,
  reviewUrl,
  visitedAfter,
  conversationAfterRestart,
} from "../app/preview/demo/navigation.ts";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repo(p), "utf8");
const onDisk = (webPath) => existsSync(repo(`public${webPath}`));
const LOCALES = ["en", "fr", "de"];
const KNOWN = segmentDefinitions.map((s) => s.id);
const AUTHORED = { retail: retailJourneyCopy, "retail-park": retailParkJourneyCopy, "outlet-centre": outletJourneyCopy };

const copyFor = (segmentId, scene, locale) => {
  if (segmentId === "shopping-centre") return sceneCopy[locale][scene.id];
  if (segmentId === "qsr") return qsrJourneyCopy[locale][scene.id];
  return resolveJourneyCopy(locale, scene, AUTHORED[segmentId][scene.id]);
};

test("1. every segment's Core route is walkable end to end", () => {
  for (const segment of segmentDefinitions) {
    const route = segment.coreRoute;
    assert.ok(route.length > 0);
    for (let i = 0; i < route.length; i += 1) {
      const scene = allScenes.find((s) => s.id === route[i]);
      assert.ok(scene, `${route[i]} is not in the model`);
      assert.equal(scene.corePathOrder, i + 1);
      if (i < route.length - 1) assert.equal(scene.nextSceneId, route[i + 1]);
      else assert.ok(!scene.nextSceneId, `${scene.id} continues past the end of Core`);
      assert.ok(demoMedia[segment.id][scene.id], `${scene.id} has no media entry`);
    }
  }
});

test("2. every Core scene resolves complete copy in all three languages", () => {
  for (const [segmentId, authored] of Object.entries(AUTHORED)) {
    assert.deepEqual(validateJourneyCopy(authored), [], `${segmentId} copy is incomplete`);
  }
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);
      for (const locale of LOCALES) {
        const copy = copyFor(segment.id, scene, locale);
        for (const field of ["eyebrow", "question", "supporting", "truth", "coverageNote", "nextCta", "heroCaption", "heroAlt", "illustrative"]) {
          assert.ok(copy[field] && copy[field].length > 0, `${sceneId}.${field} empty in ${locale}`);
        }
        assert.ok(copy.sequence.length > 0);
        assert.ok(Object.keys(copy.focus).length > 0);
      }
      // English is the model's own, never a restatement that can drift.
      const en = copyFor(segment.id, scene, "en");
      if (AUTHORED[segment.id]) {
        assert.equal(en.question, scene.commercialQuestion, `${sceneId} question drifted`);
        assert.equal(en.supporting, scene.supportingLine, `${sceneId} supporting drifted`);
        assert.equal(en.nextCta, scene.nextCta, `${sceneId} CTA drifted`);
      }
    }
  }
});

test("3. the rail never forces three steps", () => {
  const counts = new Set();
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);
      const copy = copyFor(segment.id, scene, "en");
      const kinds = new Set(scene.evidence.filter((e) => e.type !== "decision").map((e) => e.type));
      counts.add(copy.sequence.length);
      assert.ok(copy.sequence.length <= kinds.size + 1, `${sceneId} rail claims more kinds than it declares`);
      assert.ok(copy.sequence.length >= 2, `${sceneId} rail is too short to be a chain`);
    }
  }
  assert.ok(counts.size > 1, "every rail is the same length, which suggests it is forced");
});

test("4. every + belongs to a focus that exists, and only one can ever render", () => {
  // One point at a time is a property of SceneFrame, which resolves the point
  // from the ACTIVE focus. What can silently break here is the binding: a point
  // whose id matches no focus renders nothing at all, and nothing complains.
  const frame = read("app/components/redesign/SceneFrame.tsx");
  assert.match(frame, /hotspots\.find\(\(h\) => h\.id === activeFocusId\)/);

  let bound = 0;
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const media = demoMedia[segment.id][sceneId];
      if (media.hotspots.length === 0) continue;
      const scene = allScenes.find((s) => s.id === sceneId);
      const declared = demoFocusOrder[segment.id]?.[sceneId] ?? Object.keys(copyFor(segment.id, scene, "en").focus);
      const ids = media.hotspots.map((h) => h.id);
      assert.equal(new Set(ids).size, ids.length, `${sceneId} declares the same point twice`);
      for (const point of media.hotspots) {
        assert.ok(declared.includes(point.id), `${sceneId}: point "${point.id}" matches no focus (${declared.join(", ")})`);
        assert.ok(point.x >= 0 && point.y >= 0);
        bound += 1;
      }
      if (media.geometry && Object.keys(media.geometry).length > 0) {
        for (const point of media.hotspots) {
          const key = `${sceneId}:${point.id}`;
          if (media.geometry[key]) {
            const { x, y, w, h } = media.geometry[key];
            assert.ok(x + w <= media.asset.w && y + h <= media.asset.h, `${key} geometry runs off the asset`);
          }
        }
      }
    }
  }
  assert.ok(bound > 8, "too few points bound to be a meaningful check");
});

test("5. every mapped image exists and belongs to its own segment", () => {
  const folder = { retail: "retail", "shopping-centre": "shopping-centre", "retail-park": "retail-park", "outlet-centre": "outlet-centre", qsr: "qsr" };
  const rejected = new Set(outletRejectedFiles.map((f) => f.path));
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const { hero } = demoMedia[segment.id][sceneId];
      if (!hero) continue;
      assert.ok(onDisk(hero), `${sceneId}: ${hero} is not on disk`);
      assert.ok(hero.includes(`/${folder[segment.id]}/`), `${sceneId} uses another segment's folder: ${hero}`);
      assert.ok(!rejected.has(hero), `${sceneId} uses a rejected duplicate`);
    }
  }
});

test("6. a scene with no photograph is carried by a diagram, not an empty panel", () => {
  const withoutHero = [];
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const media = demoMedia[segment.id][sceneId];
      if (!media.hero) withoutHero.push([sceneId, media.diagram]);
    }
  }
  // Gate 9: the six outlet-centre scenes that used to land here (no
  // photograph, diagram fallback) were all given an accepted photograph on
  // the segment owner's explicit sign-off (see outlet-asset-decisions.ts),
  // so this list is currently empty and the diagram path is unexercised by
  // any Core scene. The invariant below still holds if a future scene ever
  // lands here again — it is just not currently tripped by anything.
  for (const [sceneId, diagram] of withoutHero) {
    assert.ok(diagram, `${sceneId} has neither a photograph nor a diagram`);
  }
});

test("7. technical media resolves by segment AND capability", () => {
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);
      for (const capabilityId of scene.technologyCapabilityIds) {
        for (const visual of getCapabilityExplainerVisuals(capabilityId, segment.id)) {
          assert.equal(visual.segment, segment.id, `${sceneId} resolved another segment's explainer`);
          assert.ok(onDisk(visual.assetPath));
        }
      }
    }
  }
});

test("8. no approved proof is implied anywhere in the demo", () => {
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const usable = getUsableProofsForScene(segment.id, sceneId);
      for (const proof of usable) {
        assert.notEqual(proof.status, "placeholder", `${sceneId} would show placeholder proof`);
      }
    }
  }
});

/* Gate 2: the two endings became one. `demoEnding` no longer decides WHERE a
   journey ends — every segment ends in the review — it only records whether a
   separate Configure preview exists to be offered from there. */
test("9. every journey ends in the review, and only some have a Configure preview", () => {
  const demo = read("app/preview/demo/demo.tsx");
  const journey = read("app/preview/demo/journey.tsx");

  // One ending, chosen by no segment.
  assert.match(journey, /onOpenReview/);
  assert.doesNotMatch(journey, /ending\.kind|DiscussionSummary/);
  assert.match(demo, /if \(view === "review"\)/);

  for (const segment of segmentDefinitions) {
    const ending = demoEnding[segment.id];
    assert.ok(ending, `${segment.id} has no ending record`);
    if (ending.kind === "configure") {
      // The preview it offers has to exist, and stays untouched by this gate.
      const route = ending.href.replace("/preview/", "");
      assert.ok(
        existsSync(repo(`app/preview/${route}/page.tsx`)),
        `${segment.id} offers a missing Configure preview`,
      );
    } else {
      assert.equal(ending.kind, "summary");
    }
  }

  // The two segments with no Configure preview are offered none.
  assert.equal(demoEnding["outlet-centre"].kind, "summary");
  assert.equal(demoEnding.qsr.kind, "summary");
  assert.match(demo, /configureHref=\{ending\.kind === "configure" \? ending\.href : null\}/);

  // No inert primary CTA and no "#" anywhere in the flow.
  assert.doesNotMatch(journey, /href="#"/);
  assert.doesNotMatch(read("app/preview/demo/review.tsx"), /href="#"/);
});

test("10. changing language does not remount the journey or reset the scene", () => {
  const journey = read("app/preview/demo/journey.tsx");
  // Locale lives in the journey's own state; nothing keys on it.
  assert.match(journey, /const \[locale, setLocale\] = useState<Locale>\(initialLocale\)/);
  assert.doesNotMatch(journey, /key=\{[^}]*locale/);
  const demo = read("app/preview/demo/demo.tsx");
  /* The journey is keyed on WHERE the reader is — segment and history position
     — and on nothing else. A history move must re-enter the journey on the
     scene the address names; a language change must not disturb it. */
  assert.match(demo, /key=\{`\$\{segmentId\}-\$\{place\.epoch\}`\}/);
  assert.doesNotMatch(demo, /key=\{[^}]*locale/);
  // The language rewrites the current address; it never adds a history step,
  // or Back would undo a word change instead of a move.
  assert.match(journey, /onNavigate\?\.\(sceneId, next, "language"\)/);
  // Leaving a journey carries the language to the picker rather than dropping it.
  assert.match(demo, /exitHref=\{pickerUrl\(locale\)\}/);
});

/* The "Beyond Core" list under the source rail was removed on 2026-09-29
   (DECISION-LOG): it sat below the footer, linked nowhere and stayed English in
   FR and DE. The branch scenes stay in the model and still need a home. */
test("11. branches are never in Core order, and the scene page does not list them", () => {
  const journey = read("app/preview/demo/journey.tsx");
  assert.doesNotMatch(journey, /rd-demo__branches|demoBeyond/);
  for (const segment of segmentDefinitions) {
    const core = new Set(segment.coreRoute);
    const branches = [...segment.optionalBranches, ...segment.advancedBranches];
    for (const branchId of branches) {
      assert.ok(!core.has(branchId), `${branchId} is both a branch and Core`);
    }
  }
});

/* The approved shell links to no preview. A preview reached from inside the
   customer-facing experience is read as part of it, and this gate deliberately
   did not widen that. The demo has its own front door. */
test("12. the demo is isolated from the approved shell", () => {
  const shell = read("app/components/CommercialExperience.tsx");
  assert.doesNotMatch(shell, /preview\/demo|DemoJourney/);
  assert.match(read("app/preview/demo/page.tsx"), /robots: \{ index: false, follow: false \}/);
});

test("13. every explainer the demo can reach is translated", async () => {
  const { resolveExplainerCopy } = await import("../app/i18n/domain.ts");
  const reachable = new Set();
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);
      for (const capabilityId of scene.technologyCapabilityIds) {
        for (const visual of getCapabilityExplainerVisuals(capabilityId, segment.id)) reachable.add(visual);
      }
    }
  }
  assert.ok(reachable.size > 0);
  for (const visual of reachable) {
    const fallback = {
      approachName: visual.approachName,
      explanation: visual.explanation,
      illustrationNote: visual.illustrationNote ?? "",
      altText: visual.altText,
    };
    for (const locale of ["fr", "de"]) {
      const copy = resolveExplainerCopy(locale, visual.approachId, fallback);
      assert.notEqual(copy.explanation, visual.explanation, `${visual.approachId} falls back to English in ${locale}`);
      assert.notEqual(copy.approachName, visual.approachName, `${visual.approachId} name untranslated in ${locale}`);
    }
  }
});

test("14. every capability the demo can reach is translated", async () => {
  const { resolveCapabilityCopy } = await import("../app/i18n/domain.ts");
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);
      for (const capabilityId of scene.technologyCapabilityIds) {
        for (const locale of ["fr", "de"]) {
          const copy = resolveCapabilityCopy(locale, segment.id, capabilityId);
          assert.ok(copy, `${capabilityId} has no ${locale} copy, reached from ${sceneId}`);
          assert.ok(copy.name && copy.purpose);
        }
      }
    }
  }
});

/* ===================================================================
   GATE 1 — one clear entry, and navigation a presenter can read.

   The defect these hold: "next" lived in the narrative column, previous
   and restart in a row of identical small buttons, and the position in
   two corners of the header — so the one control that moves the story
   was the hardest one to find. And none of it touched the address, so
   Back left the demo and a copied link never named the scene on screen.
   =================================================================== */

test("15. one bar carries position, both directions, the way out and restart", () => {
  const journey = read("app/preview/demo/journey.tsx");

  assert.match(journey, /<nav className="rd-demo__bar" aria-label=\{t\.demoJourneyNav\}/);
  for (const control of ["t.demoBack", "t.demoRestart", "t.demoPrev", "t.demoNext"]) {
    assert.ok(journey.includes(control), `the bar does not carry ${control}`);
  }

  // Position as a number AND as a bar, with the number readable aloud.
  assert.match(journey, /pad\(index \+ 1\)/);
  assert.match(journey, /pad\(route\.length\)/);
  assert.match(journey, /t\.demoProgress/);
  assert.match(journey, /rd-demo__bar-track/);

  // The neighbours are named, and named in the reader's language — never
  // from `scene.title`, which the typed model holds in English only.
  assert.match(journey, /copyFor\(segmentId, target, locale\)\.eyebrow/);
  assert.doesNotMatch(journey, /nameOf[\s\S]{0,200}\.title/);

  // The frame no longer renders a second onward control of its own.
  assert.match(journey, /ctaPlacement="external"/);
  const frame = read("app/components/redesign/SceneFrame.tsx");
  assert.match(frame, /ctaPlacement === "external" \? null/);
  // And every other caller keeps the control where it was.
  assert.match(frame, /ctaPlacement = "column"/);
});

/**
 * A session, played for real.
 *
 * Not a source-text check: this drives the same pure functions the components
 * drive, through a browser-shaped history stack, and asserts what the reader
 * would see. The two defects this gate fixed both lived where a text assertion
 * could not reach — a Back that left the demo, and a Back that silently emptied
 * the list of scenes the person had seen.
 */
function session(startUrl) {
  const stack = [startUrl];
  let at = 0;
  let visited = [];
  let segmentId = null;

  const here = () => parseDemoUrl(stack[at].split("?")[1] ?? "", KNOWN);
  const routeOf = (id) => segmentDefinitions.find((s) => s.id === id).coreRoute;

  const land = () => {
    const place = here();
    if (!place.segmentId) return null;
    /* Entering a different segment is a full navigation out of this route and
       back into it, so the browser starts the demo afresh — the record of what
       was seen belongs to the segment that was left. */
    if (segmentId && place.segmentId !== segmentId) visited = [];
    segmentId = place.segmentId;
    const scene = openingScene(routeOf(segmentId), place.sceneId);
    visited = visitedAfter(visited, scene);
    return scene;
  };

  /* Every reader action goes through the product's own rule for what the
     address becomes, so a defect in that rule fails here rather than in a
     browser. A `push` is a new entry and truncates anything ahead of it, as a
     browser does; a `replace` rewrites the entry the reader is standing on. */
  const apply = ({ url, mode }) => {
    if (mode === "push") {
      stack.length = at + 1;
      stack.push(url);
      at += 1;
    } else {
      stack[at] = url;
    }
    return land();
  };

  const push = (url) => apply({ url, mode: "push" });

  land();

  return {
    get url() { return stack[at]; },
    get scene() { const p = here(); return p.segmentId ? openingScene(routeOf(p.segmentId), p.sceneId) : null; },
    get visited() { return [...visited]; },
    next() {
      const route = routeOf(segmentId);
      const i = route.indexOf(this.scene);
      return apply(addressAfter("step", segmentId, route[i + 1], here().locale));
    },
    prev() {
      const route = routeOf(segmentId);
      const i = route.indexOf(this.scene);
      return apply(addressAfter("step", segmentId, route[i - 1], here().locale));
    },
    setLocale(locale) {
      return apply(addressAfter("language", segmentId, this.scene, locale));
    },
    enter(id, locale) { return push(demoUrl(id, null, locale)); },
    restart() {
      const route = routeOf(segmentId);
      const reset = conversationAfterRestart(route[0]);
      visited = [...reset.visited];
      this.note = reset.note;
      return push(demoUrl(segmentId, route[0], here().locale));
    },
    note: "",
    back() { if (at > 0) at -= 1; return land(); },
    forward() { if (at < stack.length - 1) at += 1; return land(); },
    get exited() { return !here().segmentId; },
  };
}

test("16. Back and Forward move through the journey, and out of it to the picker", () => {
  const sc = session(pickerUrl("en"));
  assert.equal(sc.exited, true, "a session starts at the one picker");

  // Entering a segment from the picker begins it at scene one.
  const route = segmentDefinitions.find((s) => s.id === "shopping-centre").coreRoute;
  assert.equal(sc.enter("shopping-centre", "en"), route[0]);
  assert.equal(sc.url, "/preview/demo?segment=shopping-centre&locale=en");

  sc.next();
  sc.next();
  assert.equal(sc.scene, route[2]);

  // Back walks the scenes, in order.
  assert.equal(sc.back(), route[1]);
  assert.equal(sc.back(), route[0]);

  // And Back from the first scene leaves for the picker rather than out of the
  // product entirely.
  sc.back();
  assert.equal(sc.exited, true);
  assert.equal(sc.url, pickerUrl("en"));

  // Forward returns the way it came.
  assert.equal(sc.forward(), route[0]);
  assert.equal(sc.forward(), route[1]);
});

test("17. a language is a rewrite, not a step", () => {
  const sc = session(pickerUrl("en"));
  const route = segmentDefinitions.find((s) => s.id === "retail").coreRoute;
  sc.enter("retail", "en");
  sc.next();

  sc.setLocale("de");
  assert.equal(sc.scene, route[1], "the reader stayed on the scene");
  assert.match(sc.url, /locale=de/);

  // One Back is still one scene, not an undone word change.
  assert.equal(sc.back(), route[0]);
});

test("18. a copied scene URL opens that scene; an impossible one opens the route", () => {
  for (const segment of segmentDefinitions) {
    const route = segment.coreRoute;
    const deep = session(demoUrl(segment.id, route[route.length - 1], "en"));
    assert.equal(deep.scene, route[route.length - 1], `${segment.id} deep link missed`);

    // A scene belonging to another segment is not honoured.
    const foreign = segmentDefinitions.find((s) => s.id !== segment.id).coreRoute[0];
    const wrong = session(demoUrl(segment.id, foreign, "en"));
    assert.equal(wrong.scene, route[0], `${segment.id} honoured another segment's scene`);
  }

  // An unknown segment is not silently resolved to Retail.
  assert.equal(parseDemoUrl("segment=warehouse&locale=en", KNOWN).segmentId, null);
});

test("19. the summary reports every scene the person opened, and only those", () => {
  const outlet = segmentDefinitions.find((s) => s.id === "outlet-centre");
  const route = outlet.coreRoute;
  const sc = session(pickerUrl("en"));
  sc.enter("outlet-centre", "en");

  // Four scenes seen.
  sc.next();
  sc.next();
  sc.next();
  assert.deepEqual(sc.visited, route.slice(0, 4));

  // Back does not unsee them — this is the defect: the summary used to be
  // emptied by the remount a history move causes.
  sc.back();
  assert.deepEqual(sc.visited, route.slice(0, 4), "Back forgot scenes the reader saw");
  sc.back();
  assert.deepEqual(sc.visited, route.slice(0, 4));

  // Forward adds nothing new, because nothing new was opened.
  sc.forward();
  sc.forward();
  assert.deepEqual(sc.visited, route.slice(0, 4));

  // Walking on to the end reports the whole conversation, in the order it
  // happened, with no repeats.
  while (route.indexOf(sc.scene) < route.length - 1) sc.next();
  assert.deepEqual(sc.visited, [...route]);
  assert.equal(new Set(sc.visited).size, sc.visited.length, "a scene is listed twice");
});

test("20. Restart forgets on purpose, and a deep link reports only this session", () => {
  const qsr = segmentDefinitions.find((s) => s.id === "qsr");
  const route = qsr.coreRoute;

  const sc = session(pickerUrl("en"));
  sc.enter("qsr", "en");
  sc.next();
  sc.next();
  assert.equal(sc.visited.length, 3);

  // The one move that is allowed to forget, because the reader said so.
  sc.restart();
  assert.deepEqual(sc.visited, [route[0]]);

  // A deep link into the middle reports that scene and nothing before it: the
  // reader did not see those, and the summary may not say they did.
  const deep = session(demoUrl("qsr", route[3], "en"));
  assert.deepEqual(deep.visited, [route[3]]);
  deep.next();
  assert.deepEqual(deep.visited, [route[3], route[4]]);
});

test("21. moving to another segment does not carry the first segment's scenes", () => {
  const sc = session(pickerUrl("en"));
  sc.enter("retail", "en");
  sc.next();
  const carried = sc.visited;
  assert.equal(carried.length, 2);

  sc.enter("retail-park", "en");
  const park = segmentDefinitions.find((s) => s.id === "retail-park").coreRoute;
  assert.deepEqual(sc.visited, [park[0]], "another segment's scenes reached this summary");
});

test("22. there is one picker, and the demo route does not render a second", () => {
  const demo = read("app/preview/demo/demo.tsx");
  const page = read("app/preview/demo/page.tsx");

  // No segment in the address means the reader is choosing, and choosing
  // happens in exactly one place — the SAME component the front door renders,
  // not a second grid that merely serves the same purpose.
  assert.match(page, /if \(!segment\) return <SegmentOverview initialLocale=\{locale\} \/>/);
  assert.match(page, /import \{ SegmentOverview \} from "\.\.\/\.\.\/components\/SegmentOverview"/);
  assert.equal(PICKER_PATH, "/");
  // And the way back from a journey points at the front door itself, opened on
  // the picker rather than the cover the reader has already passed.
  assert.match(pickerUrl("en"), /^\/\?start=segments&locale=en$/);

  // The demo's own grid of segments is gone, not merely hidden.
  for (const gone of ["rd-demo__picker", "rd-demo__grid", "rd-demo__card", "SEGMENT_LABEL"]) {
    assert.ok(!demo.includes(gone), `the demo still renders its own picker (${gone})`);
  }

  // And the way out is a real link, so it behaves like one.
  assert.match(read("app/preview/demo/journey.tsx"), /<a className="rd-demo__bar-quiet" href=\{exitHref\}>/);
});

/* ===================================================================
   The first move after a history move.

   Reported on Outlet Centre: 01/10, Next, Next → 03/10; Back → 02/10;
   Next → the screen said 03/10 and the address still said 02/10. A flag
   in the component remembered that the last move had been a Back and
   swallowed the write it was meant to skip — except the write it was
   meant to skip never happened, so it ate the reader's next real move
   instead. Both sequences below walk that path.
   =================================================================== */

test("23. the first step after Back or Forward is written to the address", () => {
  const route = segmentDefinitions.find((s) => s.id === "outlet-centre").coreRoute;
  const sc = session(demoUrl("outlet-centre", null, "en"));

  sc.next();
  sc.next();
  assert.equal(sc.scene, route[2]);
  assert.match(sc.url, new RegExp(`scene=${route[2]}`), "the address fell behind while going forward");

  sc.back();
  assert.equal(sc.scene, route[1]);
  assert.match(sc.url, new RegExp(`scene=${route[1]}`));

  // The reported defect: this step moved the screen and not the address.
  sc.next();
  assert.equal(sc.scene, route[2], "the screen did not advance");
  assert.match(sc.url, new RegExp(`scene=${route[2]}`), "the address stayed on the scene before");

  // And the same again after a Forward, which is the other history move.
  sc.back();
  sc.forward();
  assert.equal(sc.scene, route[2]);
  sc.next();
  assert.equal(sc.scene, route[3]);
  assert.match(sc.url, new RegExp(`scene=${route[3]}`), "the address fell behind after a Forward");

  // Backwards steps are addressed too — Previous is a move like any other.
  sc.prev();
  assert.match(sc.url, new RegExp(`scene=${route[2]}`));

  /* The sequences above exercise the RULE. The defect lived beside it, in a
     component that remembered the previous move, so this pins the one thing a
     sequence through the rule cannot see: the handler writes every move it is
     given, with nothing held between them. */
  const demo = read("app/preview/demo/demo.tsx");
  assert.doesNotMatch(demo, /popping|useRef/, "the demo is remembering a previous move again");
  assert.match(demo, /const next = addressAfter\(move, segmentId, sceneId, sceneLocale\)/);
  assert.match(demo, /if \(next\.mode === "push"\) window\.history\.pushState/);
  assert.match(demo, /else window\.history\.replaceState/);
  /* And the popstate handler adds no history ENTRY of its own. It may rewrite
     the entry the browser landed on — that is how the language the reader
     chose survives a Back instead of being silently undone — but a push there
     would be a step nobody took. */
  const onPop = demo.slice(demo.indexOf("const onPop"), demo.indexOf("window.addEventListener"));
  assert.doesNotMatch(onPop, /pushState/);
  assert.match(onPop, /searchParams\.set\("locale", locale\)/);
});

test("24. the first language change after Back agrees with what is on screen", () => {
  const route = segmentDefinitions.find((s) => s.id === "outlet-centre").coreRoute;
  const sc = session(demoUrl("outlet-centre", null, "en"));

  sc.next();
  sc.next();
  sc.back();
  assert.equal(sc.scene, route[1]);

  sc.setLocale("de");
  assert.match(sc.url, /locale=de/, "the address kept the language the reader left");
  assert.match(sc.url, new RegExp(`scene=${route[1]}`), "the language change moved the scene");

  // Still a rewrite, not a step: one Back is one scene, not an undone word.
  assert.equal(sc.back(), route[0]);

  // And a step taken in the new language keeps it.
  sc.forward();
  sc.next();
  assert.match(sc.url, /locale=de/);
  assert.match(sc.url, new RegExp(`scene=${route[2]}`));
});

test("25. what the address becomes depends on this move and no earlier one", () => {
  const route = segmentDefinitions.find((s) => s.id === "outlet-centre").coreRoute;

  // The rule is memoryless by construction: same inputs, same answer, no
  // matter what was asked before it. A flag that outlives its move is exactly
  // the defect this replaces.
  const step = () => addressAfter("step", "outlet-centre", route[2], "en");
  const language = () => addressAfter("language", "outlet-centre", route[2], "de");

  assert.deepEqual(step(), step());
  language();
  assert.deepEqual(step(), step(), "a language change changed what a later step does");
  assert.equal(step().mode, "push");
  assert.equal(language().mode, "replace");
  assert.equal(step().url, demoUrl("outlet-centre", route[2], "en"));
});

/* ===================================================================
   GATE 2 — one ending, and what it is allowed to say.

   Three segments used to jump into a Configure preview built in
   another presentation; two ended in a Discussion Summary that existed
   only because those three had somewhere to go. These hold the single
   close: what it reports, what it may not claim, and the one link it
   offers only where something real is behind it.
   =================================================================== */

test("26. the review reports the scenes opened, in route order, and no others", () => {
  for (const segment of segmentDefinitions) {
    const route = segment.coreRoute;

    // Walked end to end: every question, once, in the order of the story.
    const full = session(demoUrl(segment.id, null, "en"));
    while (route.indexOf(full.scene) < route.length - 1) full.next();
    const opened = route.filter((id) => full.visited.includes(id));
    assert.deepEqual(opened, [...route], `${segment.id} lost a scene on the way`);

    // Entered in the middle: only what was actually opened is reported, and
    // the scenes before it are absent rather than assumed.
    const from = route[Math.floor(route.length / 2)];
    const partial = session(demoUrl(segment.id, from, "en"));
    while (route.indexOf(partial.scene) < route.length - 1) partial.next();
    const reported = route.filter((id) => partial.visited.includes(id));
    assert.deepEqual(reported, route.slice(route.indexOf(from)));
    assert.ok(reported.length < route.length, `${segment.id} has no middle to enter`);
  }
});

test("27. every question the review shows is the scene's own, in the reader's language", () => {
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);
      for (const locale of LOCALES) {
        const copy = copyFor(segment.id, scene, locale);
        // The review renders copy.question and copy.eyebrow. Both must exist in
        // every language, or a review would fall back to English mid-page.
        assert.ok(copy.question?.length > 0, `${sceneId}.question empty in ${locale}`);
        assert.ok(copy.eyebrow?.length > 0, `${sceneId}.eyebrow empty in ${locale}`);
      }
      // English is the model's own question, not a restatement of it.
      assert.equal(copyFor(segment.id, scene, "en").question, scene.commercialQuestion);
    }
  }
});

test("28. what to examine is the CONNECTED half of the scene's own evidence chain", () => {
  const ORDER = ["measured", "connected", "derived"];

  let resolved = 0;
  for (const segment of segmentDefinitions) {
    for (const sceneId of segment.coreRoute) {
      const scene = allScenes.find((s) => s.id === sceneId);
      const kinds = ORDER.filter((k) => scene.evidence.some((e) => e.type === k));

      for (const locale of LOCALES) {
        const copy = copyFor(segment.id, scene, locale);
        /* Position is the join between the typed kinds and the localized
           chain. If that ever stops holding, the review would attribute one
           scene's context to another kind of evidence entirely. */
        assert.equal(
          kinds.length,
          copy.sequence.length,
          `${sceneId} (${locale}): evidence kinds and localized chain disagree`,
        );

        const label = connectedContextOf(sceneId, copy);
        if (!kinds.includes("connected")) {
          assert.equal(label, null, `${sceneId} invented a connected context`);
          continue;
        }
        assert.equal(label, copy.sequence[kinds.indexOf("connected")].label);
        assert.ok(label.length > 0);
        resolved += 1;
      }
    }
  }
  assert.ok(resolved > 60, "too few scenes resolved to be a meaningful check");
});

test("29. the review claims nothing it has not been given", () => {
  const review = read("app/preview/demo/review.tsx") + read("app/preview/demo/review-content.ts");
  const ui = read("app/i18n/messages.ts");

  // No score, no rating, no recommendation, no selection, no customer figure.
  for (const forbidden of [/score/i, /recommend(?!s nothing)/i, /\brating\b/i, /\bselected solution\b/i]) {
    assert.doesNotMatch(review.replace(/\/\*[\s\S]*?\*\//g, ""), forbidden, `the review mentions ${forbidden}`);
  }

  // Nothing is submitted, stored or sent: no form, no fetch, no payload.
  assert.doesNotMatch(review, /<form|fetch\(|localStorage|sessionStorage|quote|odoo|n8n/i);

  // The boundary is stated, in every language, on the page itself.
  assert.equal((ui.match(/reviewBoundary:/g) ?? []).length, 3);
  assert.match(review, /t\.reviewBoundary/);

  // And the questions are described as OPENED, never as answered.
  assert.match(ui, /Questions opened/);
  assert.match(ui, /Nothing here has been answered, measured or saved/);
});

test("30. the review is a place: addressable, and Back leaves it", () => {
  const route = segmentDefinitions.find((s) => s.id === "qsr").coreRoute;

  // It has an address of its own, naming no scene.
  const url = reviewUrl("qsr", "de");
  assert.match(url, /view=review/);
  assert.doesNotMatch(url, /scene=/);
  const parsed = parseDemoUrl(url.split("?")[1], KNOWN);
  assert.equal(parsed.view, "review");
  assert.equal(parsed.segmentId, "qsr");
  assert.equal(parsed.locale, "de");

  // A scene address is still a scene.
  assert.equal(parseDemoUrl(demoUrl("qsr", route[0], "en").split("?")[1], KNOWN).view, "scene");

  // Opening it is a step, so Back leaves it; a language on it is a rewrite.
  assert.equal(addressAfter("step", "qsr", null, "en").mode, "push");
  assert.equal(addressAfter("step", "qsr", null, "en").url, reviewUrl("qsr", "en"));
  assert.equal(addressAfter("language", "qsr", null, "de").mode, "replace");
});

test("31. every word the review renders is translated", () => {
  const keys = [
    "reviewCta", "reviewTitle", "reviewLead", "reviewCoverage", "reviewOpened",
    "reviewExamine", "reviewExamineLead", "reviewBoundary", "reviewResume",
    "reviewEmpty", "reviewStart", "reviewConfigure", "reviewConfigureNote",
  ];
  const ui = read("app/i18n/messages.ts");
  for (const key of keys) {
    assert.equal(
      (ui.match(new RegExp(`\\n    ${key}:`, "g")) ?? []).length,
      3,
      `${key} is not present in all three languages`,
    );
  }
  // The coverage line is a count, and says so in every language.
  assert.equal((ui.match(/\{count\} of \{total\}|\{count\} des \{total\}|\{count\} von \{total\}/g) ?? []).length, 3);
});

test("32. the assembled review matches the session that produced it", () => {
  for (const segment of segmentDefinitions) {
    const route = segment.coreRoute;
    const resolve = (sceneId, locale) =>
      copyFor(segment.id, allScenes.find((s) => s.id === sceneId), locale);

    // A session that walks part of the route, goes back, and finishes.
    const sc = session(demoUrl(segment.id, null, "en"));
    sc.next();
    sc.next();
    sc.back();
    while (route.indexOf(sc.scene) < route.length - 1) sc.next();

    const model = buildReview(segment, sc.visited, resolve, "en");

    // Every question is a scene that was opened, once, in route order.
    assert.deepEqual(
      model.questions.map((q) => q.sceneId),
      [...model.opened],
    );
    assert.deepEqual([...model.opened], route.filter((id) => sc.visited.includes(id)));
    assert.equal(model.total, route.length);
    assert.equal(new Set(model.questions.map((q) => q.sceneId)).size, model.questions.length);

    // Each question is that scene's own, and never another's.
    for (const q of model.questions) {
      assert.equal(q.question, resolve(q.sceneId, "en").question);
      assert.equal(q.name, resolve(q.sceneId, "en").eyebrow);
    }

    // Context is deduplicated, and every line is attributed to scenes that
    // were opened and that genuinely carry it.
    const labels = model.context.map((c) => c.label);
    assert.equal(new Set(labels).size, labels.length, `${segment.id} repeats a context line`);
    for (const item of model.context) {
      assert.ok(item.from.length > 0);
      for (const name of item.from) {
        const owner = model.opened.find((id) => resolve(id, "en").eyebrow === name);
        assert.ok(owner, `${segment.id}: "${name}" is not a scene that was opened`);
        assert.equal(connectedContextOf(owner, resolve(owner, "en")), item.label);
      }
    }

    // An empty session reports nothing at all, rather than the whole route.
    const empty = buildReview(segment, [], resolve, "en");
    assert.deepEqual([...empty.opened], []);
    assert.deepEqual([...empty.questions], []);
    assert.deepEqual([...empty.context], []);
  }
});

/* ===================================================================
   GATE 2 CORRECTION.

   Two defects, both invisible to the checks that existed. The Configure
   offer sat OUTSIDE the empty/non-empty branch, so a review of nothing
   still invited the reader onward — every structural assertion passed
   because every piece was present and correct, and only the rendered
   page was wrong. And a ten-scene review was one long column, which put
   every action below the fold.
   =================================================================== */

test("33. a review of nothing offers nothing onward", () => {
  const resolve = (sceneId, locale) =>
    copyFor(
      allScenes.find((s) => s.id === sceneId).segment,
      allScenes.find((s) => s.id === sceneId),
      locale,
    );

  for (const segment of segmentDefinitions) {
    const href = demoEnding[segment.id].kind === "configure" ? demoEnding[segment.id].href : null;

    // Nothing opened: no offer, whether or not the segment has a preview.
    const empty = buildReview(segment, [], resolve, "en");
    assert.equal(empty.opened.length, 0);
    assert.equal(
      configureOffer(href, empty),
      null,
      `${segment.id} offers Configure on a review of nothing`,
    );

    // One scene opened is enough for the offer — where a preview exists.
    const one = buildReview(segment, [segment.coreRoute[0]], resolve, "en");
    assert.equal(configureOffer(href, one), href, `${segment.id} withheld a real offer`);
  }

  // And the two segments with no preview are never offered one, ever.
  for (const id of ["outlet-centre", "qsr"]) {
    const segment = segmentDefinitions.find((s) => s.id === id);
    const full = buildReview(segment, segment.coreRoute, resolve, "en");
    assert.equal(full.opened.length, segment.coreRoute.length);
    assert.equal(configureOffer(null, full), null);
  }
});

test("34. the empty state renders only its explanation and a way in", () => {
  const review = read("app/preview/demo/review.tsx");
  const branch = review.slice(review.indexOf("if (isEmpty) {"), review.indexOf("  return (\n    <div className=\"rd rd-review\">\n      {header}\n\n      <main"));

  assert.ok(branch.length > 0, "the empty state is no longer an early return");
  assert.match(branch, /t\.reviewEmpty/);
  assert.match(branch, /t\.reviewStart/);
  assert.match(branch, /href=\{exitHref\}/);

  // None of the things a review WITH content carries.
  for (const forbidden of [
    "rd-review__aside",
    "rd-review__configure",
    "rd-review__coverage",
    "rd-review__visual",
    "rd-review__questions",
    "reviewResume",
    "demoRestart",
  ]) {
    assert.ok(!branch.includes(forbidden), `the empty state still renders ${forbidden}`);
  }

  // The browser-level check that would have caught the original defect.
  assert.ok(
    existsSync(repo("scripts/verify-empty-review.mjs")),
    "the empty-state browser check is missing",
  );
  const script = read("scripts/verify-empty-review.mjs");
  for (const locale of LOCALES) assert.match(script, new RegExp(`\\b${locale}:`));
  assert.match(script, /Explore measurement scope/);
  assert.match(script, /Explorer le périmètre de mesure/);
  assert.match(script, /Messumfang erkunden/);
});

test("35. the first viewport carries identity, count, picture and actions", async () => {
  const review = read("app/preview/demo/review.tsx");
  const { getSegmentStartVisual } = await import("../app/content/segment-start-visuals.ts");
  const { startCoverCopy } = await import("../app/i18n/starts.ts");

  // Identity, the count, the picture and the actions are all inside the hero.
  const hero = review.slice(
    review.indexOf('<section className="rd-review__hero">'),
    review.indexOf('{/* Grouped by the stage'),
  );
  assert.match(hero, /segmentLabel/);
  assert.match(hero, /t\.reviewCoverage/);
  assert.match(hero, /rd-review__visual/);
  assert.match(hero, /t\.reviewResume/);
  assert.match(hero, /t\.demoRestart/);
  assert.match(hero, /href=\{exitHref\}/);

  /* The picture is a COVER — orientation that proves nothing — never a scene
     hero, which is evidence for the scene it belongs to. Every segment has one
     and every one carries its own label and boundary note in all three
     languages, so the image is never unlabelled. */
  assert.match(review, /getSegmentStartVisual\(segmentId\)/);
  assert.doesNotMatch(review, /demoMedia|START_HERO|\.hero\b/);
  for (const segment of segmentDefinitions) {
    const cover = getSegmentStartVisual(segment.id);
    assert.ok(cover, `${segment.id} has no cover for the review`);
    assert.equal(cover.isEvidence, false);
    assert.equal(cover.illustrative, true);
    for (const locale of LOCALES) {
      const copy = startCoverCopy[locale][segment.id];
      assert.ok(copy?.label && copy?.note, `${segment.id} cover copy missing in ${locale}`);
      assert.match(copy.note, /not customer data|pas des données client|keine Kundendaten/);
    }
  }
});

test("36. questions are grouped by stage, in journey order, and never ranked", () => {
  const resolve = (sceneId, locale) =>
    copyFor(
      allScenes.find((s) => s.id === sceneId).segment,
      allScenes.find((s) => s.id === sceneId),
      locale,
    );
  const STAGES = ["context", "measure", "understand", "prove", "configure", "act"];

  for (const segment of segmentDefinitions) {
    const model = buildReview(segment, segment.coreRoute, resolve, "en");

    // Every opened question appears exactly once across the groups.
    const grouped = model.groups.flatMap((g) => g.questions.map((q) => q.sceneId));
    assert.deepEqual([...grouped].sort(), [...model.opened].sort(), `${segment.id} lost a question`);
    assert.equal(new Set(grouped).size, grouped.length);

    // Groups follow the canonical journey, and route order holds inside each.
    const order = model.groups.map((g) => STAGES.indexOf(g.stage));
    assert.deepEqual(order, [...order].sort((a, b) => a - b), `${segment.id} reorders the journey`);
    for (const group of model.groups) {
      const positions = group.questions.map((q) => segment.coreRoute.indexOf(q.sceneId));
      assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
      // Each group holds one stage, and it is that scene's own.
      for (const q of group.questions) {
        assert.equal(allScenes.find((s) => s.id === q.sceneId).journeyStage, group.stage);
      }
    }

    // A longer review is more groups, not one longer list.
    if (segment.coreRoute.length >= 8) {
      assert.ok(model.groups.length >= 3, `${segment.id} is still one undivided column`);
    }
  }

  /* Grouping is by stage alone — nothing scores, ranks or sorts a question.
     Comments are stripped first: the file's own prose says what it does NOT
     do, and a check that fails on the word "score" in "no score" would be
     read as noise and deleted. */
  const content = read("app/preview/demo/review-content.ts")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  assert.doesNotMatch(content, /\.sort\(|score|rank|priority/i);
});

/* ===================================================================
   GATE 3 — the conversation brief.

   A human-owned handoff: the person reads it, adds their own note,
   copies it, and decides where it goes. The danger in a page like this
   is not that it fails — it is that it quietly becomes a CRM record.
   So these hold what it may carry, what it must refuse to infer, and
   that nothing leaves the browser.
   =================================================================== */

const briefModelFor = (segment, visited, locale = "en") =>
  buildReview(
    segment,
    visited,
    (sceneId, l) =>
      copyFor(segment.id, allScenes.find((s) => s.id === sceneId), l),
    locale,
  );

test("37. the export carries stable model ids, and only scenes that were opened", async () => {
  const { buildBriefExport, BRIEF_SCHEMA_VERSION, BRIEF_SOURCE } = await import(
    "../app/preview/demo/brief-content.ts"
  );

  for (const segment of segmentDefinitions) {
    const route = segment.coreRoute;
    // A partial conversation: entered in the middle, walked to the end.
    const from = Math.floor(route.length / 2);
    const visited = route.slice(from);
    const model = briefModelFor(segment, visited);

    const brief = buildBriefExport({
      segment,
      model,
      locale: "en",
      note: "",
      generatedAt: "2026-01-01T00:00:00.000Z",
    });

    assert.equal(brief.schema_version, BRIEF_SCHEMA_VERSION);
    assert.equal(brief.source, BRIEF_SOURCE);
    assert.equal(brief.segment_id, segment.id);

    // Every exported id is a real Core scene of THIS segment, in route order.
    assert.deepEqual([...brief.opened_scene_ids], [...visited]);
    for (const id of brief.opened_scene_ids) {
      const scene = allScenes.find((s) => s.id === id);
      assert.ok(scene, `${id} is not in the typed model`);
      assert.equal(scene.segment, segment.id, `${id} belongs to another segment`);
      assert.ok(route.includes(id), `${id} is not on ${segment.id}'s Core route`);
    }

    // Scenes that were NOT opened are absent everywhere in the payload.
    const json = JSON.stringify(brief);
    for (const id of route.slice(0, from)) {
      assert.ok(!json.includes(id), `${segment.id}: unopened scene ${id} leaked into the export`);
    }

    // Each exported scene carries its own stage and its own question.
    for (const item of brief.opened_scenes) {
      const scene = allScenes.find((s) => s.id === item.scene_id);
      assert.equal(item.journey_stage, scene.journeyStage);
      assert.equal(item.question, copyFor(segment.id, scene, "en").question);
    }

    // Topics reference opened scenes by id, never by display label alone.
    for (const topic of brief.discussion_topics) {
      assert.ok(topic.from_scene_ids.length > 0);
      for (const id of topic.from_scene_ids) assert.ok(visited.includes(id));
    }
  }
});

test("38. a note is carried only when the person actually wrote one", async () => {
  const { buildBriefExport, normalizeNote, briefSummaryText } = await import(
    "../app/preview/demo/brief-content.ts"
  );
  const segment = segmentDefinitions.find((s) => s.id === "retail");
  const model = briefModelFor(segment, segment.coreRoute);
  const make = (note) =>
    buildBriefExport({ segment, model, locale: "en", note, generatedAt: "2026-01-01T00:00:00.000Z" });

  // Nothing typed, or only whitespace: the key is absent, not empty.
  for (const blank of ["", "   ", "\n\t  \n"]) {
    assert.equal(normalizeNote(blank), null);
    assert.ok(!("note" in make(blank)), `a blank note ("${blank}") produced a note field`);
  }

  // Typed: carried verbatim, trimmed at the edges only.
  const written = "  Ask about the second entrance.  ";
  assert.equal(make(written).note, "Ask about the second entrance.");

  // And the readable summary follows the same rule.
  const labels = {
    title: "Conversation brief",
    coverage: "6 of 6 Core questions opened",
    questions: "Questions we opened",
    topics: "Topics to discuss for your location",
    note: "Your note (optional)",
    boundary: "Nothing has been sent or saved to a CRM.",
  };
  assert.ok(!briefSummaryText({ segmentName: "Retail", model, note: "  ", labels }).includes(labels.note));
  const withNote = briefSummaryText({ segmentName: "Retail", model, note: written, labels });
  assert.match(withNote, /Ask about the second entrance\./);
  assert.match(withNote, /Nothing has been sent or saved to a CRM\./);
  // Every opened question is in the text the person pastes.
  for (const q of model.questions) assert.ok(withNote.includes(q.question));
});

test("39. opened scenes never become a selection, a solution or a quotation", async () => {
  const { buildBriefExport, BRIEF_NOT_INCLUDED } = await import(
    "../app/preview/demo/brief-content.ts"
  );
  const segment = segmentDefinitions.find((s) => s.id === "shopping-centre");
  const brief = buildBriefExport({
    segment,
    model: briefModelFor(segment, segment.coreRoute),
    locale: "en",
    note: "",
    generatedAt: "2026-01-01T00:00:00.000Z",
  });

  /* The Quote Builder handoff in INTEGRATION-CONTRACTS.md is built from
     `selected_capabilities`. A brief must never be mistakable for one, so the
     payload states what it withholds rather than leaving absence to be read
     as "not collected yet". */
  for (const withheld of [
    "selected_capabilities",
    "selected_solution",
    "recommendation",
    "configuration",
    "quotation",
    "pricing",
    "crm_record",
    "contact_details",
  ]) {
    assert.ok(!(withheld in brief), `the brief carries ${withheld}`);
    assert.ok(BRIEF_NOT_INCLUDED.includes(withheld), `${withheld} is not declared as withheld`);
  }

  // No capability, proof or pricing identifier reaches the payload.
  const json = JSON.stringify(brief);
  for (const scene of allScenes.filter((s) => s.segment === segment.id)) {
    for (const capability of scene.technologyCapabilityIds) {
      assert.ok(!json.includes(capability), `capability ${capability} leaked into the brief`);
    }
    for (const proof of scene.proofAssetIds) {
      assert.ok(!json.includes(proof), `proof ${proof} leaked into the brief`);
    }
  }

  // And no company, contact or opportunity identity of any kind.
  assert.doesNotMatch(json, /company_id|contact_id|opportunity_id|currency|price/i);
});

test("40. nothing is sent and nothing is kept", () => {
  /* Comments stripped first: both files explain in prose what they refuse to
     do ("no name, no email, no company"), and a check that fails on the word
     it forbids appearing in its own prohibition would be read as noise. */
  const strip = (path) =>
    read(path).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  const brief = strip("app/preview/demo/brief.tsx") + strip("app/preview/demo/brief-content.ts");

  // No transport of any kind.
  assert.doesNotMatch(brief, /fetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource/);
  assert.doesNotMatch(brief, /n8n|odoo|sharepoint|quote-?builder|webhook/i);

  // No persistence of any kind — the note lives in React state and dies with
  // the tab, which is the only promise this gate is allowed to make.
  assert.doesNotMatch(brief, /localStorage|sessionStorage|indexedDB|document\.cookie/);

  // No form that could appear to submit, and no field that asks who you are.
  assert.doesNotMatch(brief, /<form|type="submit"|method=|action=/);
  assert.doesNotMatch(brief, /email|phone|company|<input/i);

  // The one input is the person's own note, labelled as optional and theirs.
  assert.match(brief, /<textarea/);
  assert.match(brief, /t\.briefNoteLabel/);

  // The boundary is stated on the page, in all three languages.
  const ui = read("app/i18n/messages.ts");
  assert.equal((ui.match(/briefBoundary:/g) ?? []).length, 3);
  assert.match(ui, /Nothing has been sent or saved to a CRM/);
  assert.match(ui, /Rien n'a été envoyé ni enregistré dans un CRM/);
  assert.match(ui, /Es wurde nichts an ein CRM gesendet oder dort gespeichert/);
});

test("41. the brief is offered only where there is a conversation to write down", () => {
  const review = read("app/preview/demo/review.tsx");
  const demo = read("app/preview/demo/demo.tsx");

  // The action sits in the non-empty review, never in the empty branch.
  const emptyBranch = review.slice(
    review.indexOf("if (isEmpty) {"),
    review.indexOf('<section className="rd-review__hero">'),
  );
  assert.ok(!emptyBranch.includes("briefCta"), "the empty review offers the brief");
  assert.match(review, /onPrepareBrief/);
  assert.match(review, /t\.briefCta/);

  // And a brief asked for by address, with nothing opened, is not produced.
  assert.match(demo, /place\.view === "brief" && visited\.length > 0/);
  assert.match(demo, /window\.history\.replaceState\(null, "", reviewUrl\(segmentId, locale\)\)/);

  // The Configure preview stays a separate destination; the brief does not
  // feed it, and nothing infers a selection on its behalf.
  const brief = read("app/preview/demo/brief.tsx");
  assert.doesNotMatch(brief, /configure/i);
});

test("42. the brief is a place, and every word of it is translated", async () => {
  const { briefUrl } = await import("../app/preview/demo/navigation.ts");

  const url = briefUrl("retail-park", "de");
  assert.match(url, /view=brief/);
  assert.doesNotMatch(url, /scene=/);
  // A note is the person's own words: it never reaches the address.
  assert.doesNotMatch(url, /note/);
  const parsed = parseDemoUrl(url.split("?")[1], KNOWN);
  assert.equal(parsed.view, "brief");
  assert.equal(parsed.segmentId, "retail-park");
  assert.equal(parsed.locale, "de");

  // Opening it is a step, so Back leaves it; a language on it is a rewrite.
  assert.equal(addressAfter("step", "retail-park", null, "en", "brief").url, briefUrl("retail-park", "en"));
  assert.equal(addressAfter("step", "retail-park", null, "en", "brief").mode, "push");
  assert.equal(addressAfter("language", "retail-park", null, "de", "brief").mode, "replace");

  const keys = [
    "briefCta", "briefTitle", "briefLead", "briefQuestions", "briefTopics",
    "briefTopicsNote", "briefNoteLabel", "briefNoteHint", "briefNotePlaceholder",
    "briefCopy", "briefCopied", "briefCopyFailed", "briefExport", "briefExportCopied",
    "briefExportNote", "briefBack", "briefBoundary",
  ];
  const ui = read("app/i18n/messages.ts");
  for (const key of keys) {
    assert.equal(
      (ui.match(new RegExp(`\\n    ${key}:`, "g")) ?? []).length,
      3,
      `${key} is not present in all three languages`,
    );
  }
});

/* ===================================================================
   GATE 3 CORRECTION.

   Restart cleared the scenes and left the note, so the next
   conversation opened with the previous customer's words already in
   it. And a refused clipboard said "select the text" while displaying
   no text to select.
   =================================================================== */

test("43. Restart begins a genuinely new conversation", async () => {
  const { buildBriefExport, briefSummaryText } = await import(
    "../app/preview/demo/brief-content.ts"
  );
  const OLD = "PREVIOUS-CUSTOMER-NOTE";
  const labels = {
    title: "Conversation brief",
    coverage: "x of y",
    questions: "Questions we opened",
    topics: "Topics",
    note: "Your note",
    boundary: "Nothing has been sent or saved to a CRM.",
  };

  for (const segment of segmentDefinitions) {
    const route = segment.coreRoute;

    // A conversation happens, and the presenter writes a note.
    const sc = session(demoUrl(segment.id, null, "en"));
    sc.next();
    sc.next();
    sc.note = OLD;
    assert.equal(sc.visited.length, 3);

    // Restart forgets BOTH — the scenes and the note, together.
    sc.restart();
    assert.deepEqual(sc.visited, [route[0]], `${segment.id} kept scenes across a Restart`);
    assert.equal(sc.note, "", `${segment.id} carried a note into a new conversation`);

    // The journey is walked again and a new brief prepared.
    while (route.indexOf(sc.scene) < route.length - 1) sc.next();
    const model = briefModelFor(segment, sc.visited);
    const brief = buildBriefExport({
      segment,
      model,
      locale: "en",
      note: sc.note,
      generatedAt: "2026-01-01T00:00:00.000Z",
    });
    const summary = briefSummaryText({ segmentName: segment.name, model, note: sc.note, labels });

    // The old note is in none of the three places a person would see it.
    assert.ok(!("note" in brief), `${segment.id}: the new export carries a note field`);
    assert.ok(!JSON.stringify(brief).includes(OLD), `${segment.id}: old note leaked into JSON`);
    assert.ok(!summary.includes(OLD), `${segment.id}: old note leaked into the summary`);
    assert.ok(!summary.includes(labels.note), `${segment.id}: the summary has an empty note heading`);
  }

  // The reset is one value, so the two Restart paths cannot forget different
  // things — which is exactly how the defect arose.
  const reset = conversationAfterRestart("retail-street-opportunity");
  assert.deepEqual(reset, { visited: ["retail-street-opportunity"], note: "" });
  const demo = read("app/preview/demo/demo.tsx");
  assert.match(demo, /const forget = useCallback/);
  assert.match(demo, /onRestart=\{forget\}/);
  assert.match(demo, /forget\(route\[0\]\)/);
  // Nothing else forgets: Back, Forward and a language change never reset.
  assert.equal((demo.match(/setNote\(/g) ?? []).length, 1);
});

test("44. a refused clipboard shows the exact text it failed to copy", () => {
  const brief = read("app/preview/demo/brief.tsx");

  // The failure keeps the text it was carrying, rather than rebuilding it —
  // a person copying by hand must get the same bytes the button would have.
  assert.match(brief, /setCopied\("failed"\);\s*\n\s*setFallback\(text\);/);
  assert.match(brief, /const \[fallback, setFallback\] = useState<string \| null>\(null\)/);

  // Rendered only on failure, so the normal view stays as short as it was.
  assert.match(brief, /\{fallback !== null && \(/);
  assert.match(brief, /id="brief-fallback"/);
  assert.match(brief, /readOnly/);
  assert.match(brief, /htmlFor="brief-fallback"/);

  // Focused and selected, so the next keystroke can be a copy.
  assert.match(brief, /field\?\.focus\(/);
  assert.match(brief, /field\?\.select\(\)/);

  // Cleared when it would be stale: a success, or an edit to the note.
  assert.match(brief, /setCopied\(which\);\s*\n\s*setFallback\(null\);/);
  assert.match(brief, /setCopied\(null\);\s*\n\s*setFallback\(null\);/);

  // The message points where the text actually is, in all three languages,
  // and each names a field the reader can find.
  const ui = read("app/i18n/messages.ts");
  assert.equal((ui.match(/briefCopyFailed:/g) ?? []).length, 3);
  assert.equal((ui.match(/briefFallbackLabel:/g) ?? []).length, 3);
  assert.match(ui, /The exact text is below/);
  assert.match(ui, /Le texte exact est ci-dessous/);
  assert.match(ui, /Der genaue Text steht unten/);
  // The old wording pointed at text that was never rendered.
  assert.doesNotMatch(ui, /Select the text above|texte ci-dessus|Text oben/);
});
