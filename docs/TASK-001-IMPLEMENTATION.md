# TASK-001 implementation record

## Outcome

CE-DEMO-001V strengthens the repaired Retail narrative in the existing Sales Mode shell for an internal go/no-go presentation. It makes the first three stages one continuous spatial story: outside opportunity, aligned store entries and capture, then an illustrative performance chain and decision question.

Source: `tasks/TASK-001-RETAIL-GO-DEMO.md`, Objective and Deliverable.

## Key decisions

- Use one route and one persistent location canvas instead of a collection of screens. Source: `docs/DEMO-SCOPE.md`, Location journey; `docs/DESIGN-SYSTEM.md`, Experience concept.
- Use the six-stage sequence `Context → Measure → Understand → Prove → Configure → Act` as direct navigation, not a form wizard. Source: `AGENTS.md`, Product rules; `tasks/TASK-001-RETAIL-GO-DEMO.md`, Deliverable and UX requirements.
- Label mobile/geo as contextual and sampled, physical data as measured, customer business data as connected and interpretation as derived. Source: `docs/DESIGN-SYSTEM.md`, Data semantics.
- Keep Quote Builder, Odoo, content, identity and analytics behind local demo adapters. Source: `docs/ARCHITECTURE.md`, Go-demo architecture; `docs/INTEGRATION-CONTRACTS.md`, Rules.
- Use only fictional accounts and typed illustrative figures. Prove, Configure and Act remain explicit placeholders in this slice. Source: `docs/tasks/CE-DEMO-001R.md`, Truth and evidence boundaries; `AGENTS.md`, Copy and evidence.
- Use PFM Black, Purple and Red with sparse type-led layouts and a single dominant visual. Source: `docs/DESIGN-SYSTEM.md`, Brand tokens and Interface principles; `pfm-brandbook-2024-02-14`, pages 51–60 and 73–86, as extracted in `03-shared/brand/`.
- Keep Measure capability toggles as temporary presentation overlays, separate from `configuredCapabilities` used by future Quote Builder handoff state. Source: CE-DEMO-001V correction, Measure capability view requirements.

## Interaction model

- Sales Mode selects the fictional Northstar Retail Group opportunity, then binds one discovery question to the story.
- The location canvas stays central while stage navigation changes zoom, perspective and data layers.
- Four keyboard-accessible lens controls distinguish mobile/geo context, physical measurement, connected business data and derived insight.
- Context, Measure and Understand are complete scenes with visible truth labels. The story explicitly separates passing opportunity, physical entries, customer-supplied transactions and derived comparison; derived insight is disabled until physical and business layers are active.
- Measure shows Core measurement as the active illustrative basis and exposes Visitor classification plus Anonymous journey continuity only as temporary overlays. These overlays do not alter capture, business, derived or future configured capability state.
- Prove, Configure and Act show the approved handoff copy: `Content/function follows in next demo slice`.

## What is simulated

- Odoo account/opportunity selection.
- Northstar location details, map treatments, sampled context and direct measurement figures.
- All figures and location details are illustrative and local.

Public Experience, video playback, approved proof, Quote Builder execution, Odoo completion, authentication and tracking are non-goals for CE-DEMO-001V. No live external calls, logos or real customer data are included.

## Visual QA note

Browser QA covered Sales entry, discovery, all six journey stages, four lens controls and the 1440 × 900 / 1024 × 768 layouts. Horizontal overflow was checked at both target sizes.

The presentation layout fits without horizontal or viewport overflow at 1440 × 900. Tablet widths use a vertical canvas-then-panel layout without horizontal page overflow.

## Known limitations

- The video is an interactive placeholder, not approved production media.
- Proof names and the case pattern are explicit illustrative placeholders.
- Client-room security, expiry and audit behaviour are descriptive only.
- The Quote Builder payload uses provisional demo fields and IDs.
- Instrument Sans is used when available on the device; no licensed font files are bundled.

## Recommended next task

CE-DEMO-002 remains the recommended next task: add approved proof content and the functional Prove scene, while preserving the repaired truth labels and adapter boundaries.
