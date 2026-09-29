/**
 * The lens rail at 1024×768 (RETAIL-VISUAL-POLISH-BACKLOG item 9).
 *
 * The supporting line under each lens is where a scene says which layer it is
 * told with and why. Below 1200px it used to be hidden; it is now kept and set
 * compactly. These hold the rule, not the pixel values.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

/** Every block for one media query, joined — the stylesheet has several. */
function mediaBlock(query) {
  const blocks = [];
  let from = 0;
  for (;;) {
    const start = css.indexOf(`@media (${query}) {`, from);
    if (start < 0) break;
    let depth = 0;
    let end = -1;
    for (let i = css.indexOf("{", start); i < css.length; i++) {
      if (css[i] === "{") depth++;
      if (css[i] === "}" && --depth === 0) { end = i; break; }
    }
    blocks.push(css.slice(start, end + 1));
    from = end + 1;
  }
  assert.ok(blocks.length > 0, `no @media (${query}) block`);
  return blocks.join("\n");
}

test("the lens notes stay visible at 1024×768, compact and clamped", () => {
  const block = mediaBlock("max-width: 1200px");
  const rule = block.match(/\.capture__lens-text small \{([^}]*)\}/);
  assert.ok(rule, "the 1200px block no longer sets the lens note");
  assert.doesNotMatch(rule[1], /display:\s*none/);
  assert.match(rule[1], /line-clamp:\s*\d/);
  assert.match(rule[1], /overflow:\s*hidden/);
});

test("the rail is still removed only below the supported viewports", () => {
  assert.match(mediaBlock("max-width: 980px"), /\.capture__lenses \{ display: none; \}/);
});

test("the lens toggles remain real buttons with a pressed state", () => {
  const rail = readFileSync(new URL("../app/components/SceneLensRail.tsx", import.meta.url), "utf8");
  assert.match(rail, /<button\s+type="button"\s+className=\{className\}\s+aria-pressed=\{active\}/);
  // The note is inside the button, so its full text is the accessible name.
  assert.match(rail, /<small>\{note\}<\/small>/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.capture__lens-mark \{ transition: none; \}/);
});
