/**
 * The approved customer cases as a reader meets them (ProofCase).
 *
 * Two published PFM cases — Madaq and Future Stores London — are approved on
 * the product lead's instruction of 2026-09-28. These hold how they appear:
 * nothing loads from YouTube until the reader asks, every language has its own
 * copy, and each case is shown only where it evidences the scene.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { proofAssets } from "../app/content/index.ts";
import { proofCaseTranslations, proofUiCopy } from "../app/i18n/proof.ts";
import { locales } from "../app/i18n/locales.ts";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const component = read("app/components/ProofCase.tsx");
const approved = proofAssets.filter((proof) => proof.externalUseApproved);

test("the video loads only on request, from the privacy-enhanced embed", () => {
  const player = read("app/components/YouTubeOnRequest.tsx");
  // The iframe exists only in the playing branch; before that it is a button.
  assert.match(player, /\{playing \? \(\s*<iframe/);
  assert.match(player, /onClick=\{\(\) => setPlaying\(true\)\}/);
  assert.match(player, /useState\(false\)/);
  assert.match(player, /https:\/\/www\.youtube-nocookie\.com\/embed\//);
  assert.doesNotMatch(player, /https:\/\/www\.youtube\.com\/embed\//);
  // Both kinds of video go through it; neither embeds on its own.
  assert.match(component, /<YouTubeOnRequest/);
  assert.doesNotMatch(component, /<iframe/);
  // The published page is always linked, so an offline demo still has the case.
  assert.match(component, /rel="noopener noreferrer"/);
});

test("PFM's own explanation is shown as an explanation, never as proof", async () => {
  const { implementationExplainerVideos } = await import("../app/content/implementation-videos.ts");
  const { getSolutionImplementationOptions, getSolutionDirectionsForSegment } = await import("../app/content/solution-runtime.ts");
  const { implementationPresentationNames } = await import("../app/content/technology-presentation.ts");

  assert.equal(implementationExplainerVideos.length, 1);
  const [video] = implementationExplainerVideos;
  assert.equal(video.implementationId, "impl-isarsoft-camera-analytics");
  assert.equal(video.videoId, "F1-0cn8noeo");
  assert.match(video.notProofNote, /not a customer result/);
  assert.doesNotMatch(`${video.description} ${video.notProofNote}`, /\d+\s*%|accura|uplift|ROI/i);
  // Not a proof asset, so it can never reach "In practice" or "See it in practice".
  assert.ok(!proofAssets.some((proof) => proof.media?.videoId === video.videoId));

  // The camera option is called what the product lead calls it.
  assert.equal(implementationPresentationNames["impl-isarsoft-camera-analytics"], "IP Detection Sensor");

  // It reaches every Configure option for that implementation, and only those.
  let seen = 0;
  for (const segment of ["retail", "shopping-centre", "retail-park"]) {
    for (const direction of getSolutionDirectionsForSegment(segment)) {
      for (const group of getSolutionImplementationOptions(direction.id, "presentation")) {
        for (const option of group.options) {
          if (option.implementationId === video.implementationId) {
            seen++;
            assert.equal(option.headline, "IP Detection Sensor");
            assert.equal(option.explainerVideo?.videoId, video.videoId);
          } else {
            assert.equal(option.explainerVideo, null);
          }
        }
      }
    }
  }
  assert.ok(seen > 0);

  const layout = read("app/components/ConfigureSceneLayout.tsx");
  assert.match(layout, /\{hero\.explainerVideo && \(/);
  assert.match(layout, />PFM explains</);
  assert.match(layout, /\{hero\.explainerVideo\.notProofNote\}/);
});

test("every approved case has its own French and German copy", () => {
  assert.deepEqual(approved.map((proof) => proof.id).sort(), ["CASE-RET-01", "CASE-RET-02"]);
  for (const locale of locales) assert.ok(proofUiCopy[locale], `no proof UI copy for ${locale}`);
  for (const proof of approved) {
    for (const locale of ["fr", "de"]) {
      const copy = proofCaseTranslations[locale][proof.id];
      assert.ok(copy, `${proof.id} has no ${locale} copy`);
      for (const key of ["title", "challenge", "measurementApproach", "customerLearning", "truthBoundary"]) {
        assert.ok(copy[key] && copy[key] !== proof[key], `${proof.id} ${locale}.${key} is missing or English`);
      }
      assert.doesNotMatch(Object.values(copy).join(" "), /\d|%/, `${proof.id} ${locale} restates a figure`);
    }
  }
});

test("the drawer and Configure render approved proof through the same component", () => {
  assert.match(read("app/components/redesign/DepthPanel.tsx"), /<ProofCase key=\{proof\.id\} proof=\{proof\} locale=\{locale\} \/>/);
  assert.match(read("app/components/ConfigureSceneLayout.tsx"), /<ProofCase key=\{asset\.id\} proof=\{asset\} locale="en" \/>/);
});
