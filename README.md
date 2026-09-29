# PFM Commercial Experience

PFM Commercial Experience is a shared digital commercial platform for public exploration, guided sales conversations and secure client follow-up.

## Product modes

- **Sales Mode** — select or create an Odoo customer/opportunity, run discovery, build a visual story, configure a solution and publish follow-up.
- **Public Experience** — explore without customer selection and convert intent into a qualified Odoo lead/opportunity.
- **Client Room** — replay the agreed story using an approved, secure and time-bound content snapshot.

## Core journey

`Context → Measure → Understand → Prove → Configure → Act`

## Initial delivery target

Build a high-fidelity Retail go-demo that proves the product concept before live Odoo, SharePoint, Entra or production AWS integrations are implemented.

## Repository map

- `AGENTS.md` — durable Codex working agreements.
- `docs/PRODUCT-BRIEF.md` — product direction and users.
- `docs/DEMO-SCOPE.md` — go-demo scope and acceptance criteria.
- `docs/ARCHITECTURE.md` — target system boundaries.
- `docs/DESIGN-SYSTEM.md` — PFM interface and data semantics.
- `docs/INTEGRATION-CONTRACTS.md` — future Odoo and Quote Builder boundaries.
- `tasks/TASK-001-RETAIL-GO-DEMO.md` — first implementation task.
- `CODEX-FIRST-PROMPT.md` — first prompt to use in Codex.
- `reference-demos/` — earlier HTML concept demos; references, not production foundations.

## Current status

CE-DEMO-001V strengthens the Sales Mode Retail narrative across Context, Measure and Understand. It connects outside opportunity to measured entries, capture and illustrative business conversion context using typed local fixtures, with temporary Measure-only capability overlays kept separate from future Configure state. Prove, Configure and Act remain shell placeholders; Public Experience, Client Room, approved proof assets and live handoffs are intentionally deferred.

## Run the go-demo

Requirements:

- Node.js 22.13 or newer.
- npm 11 or newer.

```bash
npm ci
npm run dev
```

Open the local URL shown in the terminal. The demo is optimised for a 1440 × 900 presentation viewport and also supports tablet widths.

## Validate the application

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Implementation

The application uses TypeScript, React and the Sites Vite-compatible runtime. It is intentionally one route and one shared content/session system:

- `app/components/CommercialExperience.tsx` — Sales entry, discovery question, six-stage journey and the CE-DEMO-001V Context/Measure/Understand narrative.
- `app/components/LocationCanvas.tsx` — persistent retail location visual and four distinct data lenses.
- `app/lib/fixtures.ts` — typed, local, fictional content with source references.
- `app/lib/session.ts` — shared session state, navigation and typed handoff payloads.
- `app/lib/adapters.ts` — simulated Odoo, content, identity, analytics and Quote Builder boundaries.
- `tests/session.test.mjs` — deterministic smoke tests for entry, discovery, journey order, lens rules, capture math, fixture traceability and isolated Measure overlays.

The Digital Quote Builder, Odoo completion, Public Experience and Client Room remain explicit future boundaries. No browser-to-system calls are made.
