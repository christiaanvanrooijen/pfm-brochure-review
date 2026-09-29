# PFM Commercial Experience — Retail Brochure Experience v1

Date: 2026-08-17 (technology storytelling refinement completed 2026-08-18)

Status: **RETAIL BROCHURE V1 — FROZEN FOR INTERNAL REVIEW**

Visual status: frozen. From this point forward, do not redesign Retail. Only fix functional regressions, broken assets, truth-rule violations, or accessibility blockers. Marketing polish remains deferred to `docs/design/RETAIL-VISUAL-POLISH-BACKLOG.md`.

## Purpose

This checkpoint records that the Retail vertical of the PFM Commercial Experience is now a complete, approved, end-to-end digital sales brochure — the first fully approved segment experience, and the reference pattern for future segments.

## Approved canonical journey

```
Context → Measure → Understand → Prove → Configure → Act
```

## Approved customer story

```
Location opportunity
→ Capture
→ Visitor
→ In-store journey
→ Zone engagement
→ Commercial performance
→ Solution recognition
→ Progressive explanation (technology / requirements / privacy / proof)
→ Human next step
```

## Approved scenes and experiences

- Context (Outside)
- Capture / Store Visits (Measure · Entrance)
- Visitor Composition (Measure · Visitors) — photoreal Northstar hero v2
- In-store Journey (Understand · Inside)
- Zone Engagement (Understand · Zones)
- Commercial Performance (Prove · Performance) — full passers-by → capture → visits → conversion → ATV → turnover funnel
- Configure (Your solution) — four solution directions, technology / requirements / privacy / proof progressive disclosure
- Act (Next step) — convergence composition, up to three next-conversation directions, non-pushy CTA, honest final conversational state
- Presentation Mode — verified end-to-end across every stage above

## Approved technology storytelling (2026-08-18 refinement)

- Canonical kebab-case technology asset naming across the entrance/passerby/spatial/isarsoft families
- Isarsoft asset family structure (`public/assets/technology/isarsoft/`) — a multi-capability analytics family, not filed under a single capability's folder
- Tatille architecture prepared (vehicle/ANPR intelligence, evidence semantics kept separate from people-visit/footfall evidence) — not exposed in Retail UI
- Capability-first technology architecture: scene → capability → possible implementation → source/privacy/requirement status, never scene → product
- `docs/reference/technology/SOURCE-REGISTRY.md` rewritten against real vendor datasheets and privacy certificates, with implementation-specific privacy isolation (Xovis privacy evidence never leaks to Milesight/RoboSense/Isarsoft/Tatille)
- Editorial "What is needed" layout — product image, name, role and three concise requirements visible without scrolling at 1440×900
- "How we do this" explainer family: passer-by physical measurement, entrance-threshold measurement, LiDAR point-cloud, and 3D spatial tracking — vendor-neutral measurement-principle visuals, distinct from the hardware shown under "What is needed"
- Geo/Catchment context kept explicitly distinct from physical measurement
- Xovis entrance-counting video and two LiDAR videos (in-store measurement, tracking/reporting interpretation) integrated as progressive disclosure behind "See an example implementation," secondary to the vendor-neutral explanation
- Presentation Mode verified across the full technology storytelling layer: no source IDs, validation status, implementation IDs, or architecture terminology reaches a prospect

## Approved product principle

The PFM Commercial Experience is **not** primarily:

- a calculator
- a dashboard
- a configurator
- a quote builder
- a CRM workflow

Its primary role is:

```
show relevant possibilities
→ create recognition
→ explain how PFM can provide the insight
→ answer technology / requirement / privacy / proof questions
→ create a natural next conversation
```

This principle governs the Retail experience today and is the standard future segment experiences (Shopping Centre, Retail Park, Outlet Centre, QSR) are expected to meet — not by copying Retail content mechanically, but by reusing the same underlying pattern:

- physical location as hero
- commercial question first
- insight before technology
- progressive disclosure (technology / requirements / privacy / proof as depth, never the primary hero)
- Presentation Mode as a first-class state, not an afterthought
- a conversational Act ending, not a workflow step

Each future segment still receives its own story architecture, evidence model and approved production imagery — this checkpoint documents the pattern, not a template to paste.

## Architecture decisions closed by this checkpoint

- **Act composition vs. the design-direction §23 four-part sequence** — approved 2026-08-17 (`docs/decisions/DECISION-LOG.md`). The brochure-first Act implementation takes precedence for the primary customer experience. The commercial-workflow bridge (story save, CRM/Odoo handoff, Client Room, Quote Builder, quotation/proposal) is deferred to a separate downstream layer, not deleted from the product concept.

## What is explicitly deferred, not implemented

- Story save / session persistence beyond the current in-memory journey state
- CRM (Odoo) write-back or opportunity creation
- Client Room handoff
- Quote Builder handoff
- Quotation or proposal generation
- Pricing, ROI, uplift, or payback calculation
- Any recommendation, ranking or auto-selection engine

## Non-blocking future refinement

Tracked in `docs/design/RETAIL-VISUAL-POLISH-BACKLOG.md`. That backlog is refinement only — it does not reopen any approved Retail V1 decision.

## Live experience

The application itself is the live brochure — there is no separate static HTML mockup. Run `npm run dev` and open the reported local URL to review the approved experience interactively.
