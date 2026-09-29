# Checkpoint — Coherent demo v1

**Date:** 2026-09-25
**Scope:** Gates 1–3 of the commercial experience review, plus their corrections.
**State:** local preview only. Nothing deployed, no integration built.

## What this milestone is

Before it, the product had three front doors, two different endings, and no way
to take anything away from a conversation. A presenter opening two segments met
two products.

After it there is one entry, one journey shape, one ending, and one human-owned
handoff — for all five segments, in three languages.

## Gate 1 — one entry, navigable Core

- `/` is the single segment picker. `/preview/demo` without a segment renders
  that same component rather than a second grid of its own.
- Every card opens that segment's Core journey. "Start only" is gone; the
  isolated one-scene starts are no longer a destination anything links to.
- One journey bar carries the way out, restart, both directions with the
  neighbouring scenes NAMED in the reader's language, and the position.
- The address says where the reader is. Back and Forward move through scenes
  and out to the picker; a copied scene URL opens that scene.

**Corrections applied during review:** duplicate picker removed; the visited
record lifted above the remount a history move causes (it was being emptied by
a Back, so the closing summary under-reported the conversation); the approved
`/shell` and the shared `SceneFrame` returned to their pre-gate state; five
cards laid out as peers.

**Defect worth remembering:** a flag in `demo.tsx` remembered that the last
move had been a Back, to suppress a write that never happened — so it ate the
reader's next real move instead. The address decision is now memoryless by
construction (`addressAfter`).

## Gate 2 — one ending

`ConversationReview` closes every segment. It reports the questions OPENED —
never answered — and, as "What to examine for your location", the CONNECTED
link of each scene's evidence chain: the part of the chain the customer owns.

The picture is a typed segment cover (`isEvidence: false`, `illustrative:
true`), labelled as orientation on the image. Never a scene hero: a hero is
evidence for its scene, and a closing page is where evidence is most easily
misread as a result.

The separate Configure preview is offered only where one exists AND at least
one scene was opened. Outlet Centre and Drive-Thru have none and are offered
nothing.

**Corrections applied during review:** the Configure aside rendered on the
empty state, because it sat outside the empty/non-empty branch — every
structural check passed and only the rendered page was wrong. That is why
`scripts/verify-empty-review.mjs` exists: it asks the running application for
the bytes it serves, in three languages, and was proven against the defect
before the fix landed. The review also went from one long column to a
hero-first layout with the questions grouped by stage.

## Gate 3 — human-owned handoff

"Prepare a conversation brief" opens an in-demo brief: the opened questions,
the context as discussion topics, and one optional note the presenter types.
Copy the readable summary; the versioned JSON export (`brief-v1`) sits below
it, folded away.

Everything is local. No fetch, no storage, no form, no contact field. The
payload declares what it withholds (`not_included`) rather than leaving absence
to be read as "not collected yet" — the Quote Builder handoff in
`INTEGRATION-CONTRACTS.md` is built from `selected_capabilities`, and a brief
must never be mistakable for one.

**Corrections applied during review:** Restart cleared the scenes and left the
note, so a new conversation opened with the previous customer's words in it —
the reset is now one value (`conversationAfterRestart`) consumed by one
function. And a refused clipboard said "select the text" while displaying none;
the exact bytes now appear in a focused, selected, read-only field.

## Standing boundaries

Unchanged and still true:

- Opening a scene is not selecting a capability; reading a question is not
  answering it.
- No score, rating, recommendation, selected solution, proof, pricing or
  customer figure appears anywhere in the review or the brief.
- The approved `/shell` gained no preview links. Frozen Retail and Shopping
  Centre scenes are untouched.
- Nothing calls n8n, Odoo, SharePoint or the Quote Builder.

## Verification at this checkpoint

- `npm run typecheck` — clean
- `npm run build` — clean
- `npx eslint app tests scripts` — 0 errors
- `npm test` — **833 / 834**
- `node scripts/verify-empty-review.mjs` — 45 / 45 (needs the app running)

Walked in a browser at 1440×900 and 1024×768, EN/FR/DE: all five segments full
and partial, Back/Forward, Restart, deep links, keyboard.

## Known, and not fixed here

- `tests/outlet-asset-decisions.test.mjs` test 4 fails on
  `outlet-centre-visitor-composition-hero1.png`, a rejection naming a file that
  is not on disk and was never committed. Present in `HEAD` before this work;
  left alone because the rejection is a segment-owner judgement, not a bug.
- Two `eslint` errors under `npm run lint` come from
  `outputs/PFM-SKINS-locatiepotentie.build.js`, which is git-ignored scratch.
- Segment cover `altText` is English in all locales — a property of the typed
  cover concept, shared with the segment starts.

## Next

Gate 4 has not started. The brief is deliberately a dead end: transmitting one
needs a consented recipient and an audit record, and `INTEGRATION-CONTRACTS.md`
requires server-side validation for every write.
