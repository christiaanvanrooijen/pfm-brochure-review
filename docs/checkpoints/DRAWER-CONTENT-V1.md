# Checkpoint — Drawer content v1

**Date:** 2026-09-27
**Tag:** `pfm-commercial-experience/drawer-content-v1-2026-09-27`
**Builds on:** `coherent-demo-v1` (2026-09-25)
**State:** local preview only. Nothing deployed, no integration built.

## What this milestone is

The "How does this work?" drawer now explains each question with the sensor
that actually answers it, as set per scene by the product lead, and names
every device by what it does rather than by vendor and model number.

## What changed since coherent-demo-v1

**Content inventory** — `docs/content/`
- Generated from the typed runtime, not kept by hand: 185 scene sections,
  26 segment+capability pairs, the implementations, and In practice.
- `PFM-drawer-content-inventory.xlsx` is the product lead's filled-in version,
  including the Media register.
- `EXPLAINER-BRIEF.md` lists the six illustrations still missing.

**Names, not part numbers**
- Functional names render in the drawer — "3D Sensor Basic FoV",
  "Infrared Storefront sensor", "IP Detection Sensor outdoor" — and no vendor
  or model reaches alt text or claim copy in any of the three languages.
- Vendor and model stay in the model, where sources and requirement
  profiles attach to them.

**New devices**
- IP Detection Sensor indoor (Bosch FLEXIDOME micro 3100i) for Retail and
  Shopping Centre; outdoor (FLEXIDOME 5100i) for Retail Park and Outlet
  Centre.
- 3D Sensor Basic FoV outdoor (Xovis PC2SE-O) for the open-air segments.
- None claims privacy or technical detail: no datasheet is mapped yet.

**Per-scene measurement methods**
- Shopping Centre, Retail Park and Outlet Centre follow the product lead's
  2026-09-27 direction, carried in `app/content/scene-drawer-overrides.ts`.
- Three approved explainers attached, each to its own segment only.
- Accessories (LiDAR Processing unit; 3D Processing unit above nine FishEye
  sensors) and Retail staff exclusion shown under Requirements.

**Corrections**
- `isarsoft/bosch-3100i.jpg` showed a 5100i; renamed with history kept.
- HME ZOOM Nitro screen cropped to the product, without marketing callouts.

## Deliberately unchanged

- The approved Configure previews: "What is needed" and "How we do this" are
  identical in all twelve directions, verified against the previous commit.
  Their privacy detail does list the new devices, because that section lists
  every implementation of a capability — reported, not patched.
- The approved `/shell` and the frozen Retail and Shopping Centre scenes.

## Open

- Six explainers still to produce — see `EXPLAINER-BRIEF.md`.
- HME product photos, apart from the timer screen.
- Configure still shows vendor names under the role.
- Image rights for the HME and Xovis supplier images.
- `public/assets/content-candidates/` is intentionally not in git: reference
  images with unverified rights and real brand logos.

## Verification

- `npm run typecheck`, `npm run build` — clean
- `npx eslint app tests scripts` — 0 errors
- `npm test` — **851 / 852**. The one failure is `outlet-asset-decisions`
  test 4, which names a file never committed and predates this work.
