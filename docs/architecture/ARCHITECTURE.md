# Target architecture

## Principle

One experience platform, three controlled modes and explicit integration boundaries.

```text
Public visitor ─┐
PFM employee ───┼─> PFM Experience web application ─> Application API
Customer ───────┘                                  │
                                                   ├─> Odoo 18 adapter
                                                   ├─> SharePoint/content adapter
                                                   ├─> Microsoft identity adapter
                                                   ├─> Quote Builder adapter
                                                   └─> Analytics/event adapter
```

## System responsibilities

### Odoo 18

Commercial system of record for:

- companies and contacts;
- CRM opportunities;
- sales ownership and operating unit;
- next activities;
- quotation flow and commercial status;
- references to shared client experiences.

### SharePoint

Source and approval environment for:

- formal documents;
- case source material;
- photography and video masters;
- technical documentation;
- review and approval evidence.

### AWS Experience application and CMS

Runtime and structured presentation layer for:

- interactive location scenes;
- content modules and translations;
- hotspots and story sequences;
- client-room snapshots;
- session and interaction state;
- integration services and audit events.

### Microsoft Entra

- PFM employee SSO;
- later external/customer identity and access controls.

### Digital Quote Builder

Initially remains a separate capability. It accepts an explicit context payload and returns a saved configuration or draft quotation reference.

## Go-demo architecture

The first demo uses:

- local typed fixtures;
- no external network calls;
- simulated Odoo, content, Quote Builder and client-room adapters;
- an interface that can later be replaced by real adapters.

### CE-DEMO-001 implementation

The first Retail slice is a single-route TypeScript/React application with one shared fixture and session model for Sales Mode, discovery and the six-stage journey. Public Experience, Client Room and production handoffs remain future slices.

```text
Local typed fixtures ─┐
Shared session state ─┼─> Commercial Experience ─> Persistent Location Canvas
Demo adapters ────────┘                         └─> Prove / Configure / Act handoff placeholders
```

The interface boundaries in `app/lib/adapters.ts` are deliberately small. Every current implementation resolves locally and does not make a network call. Source: `docs/PFM-COMMERCIAL-EXPERIENCE-RETAIL-GO-DEMO-PACKAGE.md`, CE-DEMO-001; `AGENTS.md`, Product rules.

The session reducer in `app/lib/session.ts` is the single source of truth for mode, discovery question, stage, selected challenges, capabilities and lenses. Future handoff fields stay behind the same reducer boundary so later slices do not require a new information architecture. Source: `AGENTS.md`, Product rules; `docs/PFM-COMMERCIAL-EXPERIENCE-RETAIL-GO-DEMO-PACKAGE.md`, CE-DEMO-001.

The location canvas changes perspective and layer treatment across the six stages, while truth labels remain stable. Source: `docs/DESIGN-SYSTEM.md`, Experience concept, Journey and Data semantics.

## Security boundary

The browser must never receive Odoo, SharePoint or infrastructure credentials. Real integrations run server-side and use least-privilege service identities, validation, logging and retry controls.
