# Drawer content — what has to be written, and what it may say

The "How does this work?" drawer opens on every Core scene and resolves five
sections. This directory is the inventory of what those sections show today and
what is missing, generated from the typed runtime rather than kept by hand.

```bash
node scripts/content-inventory.mjs     # re-read the runtime, rewrite the CSVs
python3 scripts/content-workbook.py    # dress them as a fillable workbook
```

`PFM-drawer-content-inventory.xlsx` is the product lead's filled working
artefact. Yellow cells are editorial input. Re-running
`scripts/content-workbook.py` would replace the workbook, including those edits;
do not do that without preserving them first. The CSV generator is separate and
does not overwrite the workbook.

The filled yellow cells are editorial input, not runtime content. Review text
against the typed model and its source before moving it into `app/content/`;
regenerating the CSVs does not import workbook edits. See
`CONTENT-REVIEW-2026-09-27.md` for the reconciliation.

## Where the content lives today

| Section | Resolves from | Keyed on |
|---|---|---|
| How it works | `drawer-method-copy.ts` text, `technology-visuals.ts` explainer visuals and video | **segment + capability**, with two scene-specific method overrides |
| Technology | `technology.ts` implementations, with their photo | implementation |
| Requirements | the scene's dependency model, plus per-implementation installation essentials | scene + implementation |
| Privacy | per-implementation, source-backed statements | implementation |
| In practice | `proof-runtime.ts` — customer proof only where explicitly permitted | segment + scene |

## The gaps, measured

37 Core scenes across five segments; 185 scene sections in total.

- **In practice has approved proof in 4 of 37 Core scenes.** Two published
  customer cases (Madaq; Future Stores London) cover Retail store visits,
  conversion, in-store journey and zone engagement (2026-09-28). Every other
  scene is still empty, which remains a legitimate final answer.
- **8 of 26 segment+capability pairs have no illustration.** Outlet Centre has
  2 of 6 without one; Retail Park 2 of 4; Shopping Centre 1 of 5; Retail 1 of 5;
  Drive-Thru 2. Seven pairs gained a schematic illustration on 2026-09-28
  (`EXPLAINER-BRIEF.md`, status note); the photographic versions are still to come.
- **12 of 53 capability views have a video.** The rest show none, which is
  correct where no footage is true of that segment.
- **15 of 24 implementations have no photograph** — mostly the HME drive-thru
  range and the abstract ones (business-data connection, aggregate geo source).
- **17 of 24 implementations have no installation essentials.**
- **Privacy: 12 scene statements are fully source-backed, 83 are not.**

## The five kinds of text needed

Write **English only**. English is the model's own wording; French and German
are resolved from it, and every string is checked for all three before it ships.

### 1. Illustration caption — per segment + capability (26 slots, 18 empty)

One sentence saying what the picture shows. It orients; it proves nothing.

> A ceiling sensor above a shop doorway, with the counting line it is configured
> across drawn on the floor beneath it.

Never: an accuracy figure, a count, a result, or a claim that this is a
customer's location.

### 2. One limitation — per implementation (23 slots)

What the product genuinely cannot do. A limitation, not a softened feature.

> Counts people crossing a configured line; it does not identify anyone and
> cannot follow a visitor between entrances.

Never: "limited only by…", or a limitation that is really a benefit in disguise.

### 3. Installation essentials — per implementation (23 slots, 17 empty)

The three or four physical facts that decide whether this can be installed.

> Ceiling mount, 2.4–4.0 m; PoE; clear line of sight across the full door width.

Never: a price, a lead time, or an installation promise.

### 4. Privacy statement — per implementation (23 slots, most unsourced)

What the product does with what it observes, with a source. Without a source it
stays `requires_source_mapping` — that status is honest and is not a failure.

> Processes depth images on the device and stores no image; only anonymous
> counts leave the sensor. *(Source: datasheet v3.1 p.4, URL)*

Never: a generalisation across suppliers, or a GDPR claim the supplier has not
made in writing.

### 5. Proof of practice — per scene (37 slots, all empty)

Only where a real, approved customer result exists. This is the one section
where the honest answer is most often to write nothing.

Never: an invented case, an unnamed "a large retailer", an uplift or a payback
figure, or a real customer name without documented approval.

## Assets

Images and video go under `public/assets/`, referenced by a web path. Filenames
are canonical kebab-case (`supplier-model.ext`), lower-case, hyphen-separated,
no underscores. The asset-safety tests assert both directions — every
referenced path exists on disk, and every file on disk is referenced — so a
rename can never silently 404, and an orphan file fails the build.

Fill `ASSET_name` and `ASSET_path` in the workbook; I wire them into the typed
model, because each one also needs alt text, a caption and an approval status
that the tests check.

## The rules every text is held to

From `AGENTS.md`, and enforced by tests:

- Fictional customer data only; Northstar Retail Group is the fictional retailer.
- No invented accuracy, ROI, uplift, payback, benchmark or customer result.
- Label every fixture and example value as illustrative.
- State the area, period and definition whenever a calculated KPI is shown.
- Mobile/geo data is context, never a replacement for physical measurement.
- A capability id is shared; footage is not. TECH-01 at a retail frontage is
  not TECH-01 in a drive-thru lane, so artwork resolves on segment **and**
  capability, and a segment with no artwork of its own shows none.
