# PFM Commercial Experience

## Current objective

Build an implementation-ready Retail go-demo for an internal go/no-go decision.

The experience must support a convincing four-to-six-minute presentation. Retail is the only complete demo vertical in the current scope.

## Source-of-truth order

When files conflict, use this order:

1. This AGENTS.md and its truth rules
2. docs/product/RETAIL-GO-DEMO-PACKAGE.md
3. docs/architecture/INTEGRATION-CONTRACTS.md
4. docs/architecture/ARCHITECTURE.md
5. docs/design/DESIGN-SYSTEM.md
6. docs/product/PRODUCT-BRIEF.md
7. docs/product/DEMO-SCOPE.md
8. Existing prototypes and digital-sales-journey files as reference only

Do not silently resolve a material conflict. Record it in docs/decisions/DECISION-LOG.md.

## Canonical journey

Context → Measure → Understand → Prove → Configure → Act

Do not combine, rename or reorder these stages without product-lead approval.

## Canonical Retail story

Outside opportunity → store capture → visits → conversion context → decision → configured next step.

Every screen must contribute to this story.

## Data layers

Keep these visibly and semantically separate:

- Mobile/geo data: contextual and aggregate
- Physical sensor data: directly measured
- Business data: customer-provided or simulated
- Derived insights: calculated or interpreted from named source layers

Derived insights must not appear when their required source layers are disabled.

## Truth rules

- Use only fictional customer data in the go-demo.
- Use Northstar Retail Group as the fictional retailer.
- Label all fixtures and example values as illustrative.
- Do not invent accuracy, ROI, uplift, payback, benchmarks or customer results.
- Do not use real customer names or logos without documented approval.
- Do not imply that simulated Odoo, Quote Builder or Client Room actions are live.
- Capture rate may only be shown when the aligned passing audience and visits are both visible.
- State the relevant area, period and definition when displaying a calculated KPI.
- Treat mobile/geo data as context, not as a replacement for physical sensor measurement.

## Integration boundaries

- The Digital Quote Builder remains a separate module.
- Do not rebuild pricing logic.
- The browser must never communicate directly with Odoo or SharePoint.
- All current Odoo, Quote Builder and Client Room results are simulated fixtures.
- Integration objects must have typed, versioned contracts.

## Design requirements

- PFM Red: #F04438
- PFM Purple: #9E77ED
- PFM Black: #0C111D
- Primary canvas: white or black
- Font: Instrument Sans, with Helvetica or system sans-serif fallback
- One dominant visual per scene
- Do not create a generic dashboard aesthetic
- Motion must explain data, movement or progression
- Support 1440×900 and 1024×768
- Support keyboard navigation and reduced motion

## Scene hero asset selection

When choosing the production hero for a segment scene, use this order:

1. `public/assets/location-visuals/<segment>/` — the approved production heroes. First choice.
2. An explicit scene mapping in `app/content/visual-assets.ts`, where one exists and is approved.
3. `public/assets/locations/<segment>/` — legacy assets, only when no suitable production hero exists.
4. `reference-demos/` — visual reference only. Never production runtime imagery unless explicitly approved.

Before selecting any hero: list the files in the segment's `location-visuals` directory and open the actual candidates. Never pick an older image because its filename sounds relevant. If more than one production asset looks valid, report the ambiguity instead of silently choosing a legacy asset.

Note that `visual-assets.ts` carries `assetPath: null` for every entry by design — it registers visual-asset IDs, scene coverage and approval status, not file paths. Scene components hold their own hero path, and tests pin it.

## Working method

Before implementing a task:

1. Read this file.
2. Read the named task specification completely.
3. Read only the source documents referenced by that task.
4. Inspect existing code and tests.
5. Report material conflicts or missing inputs.
6. Implement only the defined scope.
7. Run lint, type-check, tests and production build.
8. Provide changed files, verification results, screenshots and remaining risks.

Do not start the next backlog item automatically.

## Model routing (Sol + Luna)
- Sol blijft in de hoofdthread voor planning, architectuur, conflictresolutie en eindcontrole.
- Gebruik de custom agent `luna_worker` (gpt-5.6-luna @ max) voor afgebakende implementatie-, test- en analyse-taken.
- Delegeer alleen taken met duidelijke scope, acceptance criteria en schrijfrechten.
- Sol controleert altijd het resultaat van Luna voordat iets als klaar wordt beschouwd.
