# Retail go-demo scope

## Goal

Create a short, high-fidelity and clickable demonstration that is strong enough to support an internal go/no-go decision.

## Demo story

A presenter can switch between Sales Mode and Public Mode, explore one retail location, activate data lenses, see proof, transfer selections into a simulated Quote Builder and finish with a simulated Odoo/client-room result.

## Required screens and interactions

### 1. Entry

- Mode selector: Sales Mode / Public Experience.
- Sales Mode: search and select a fictional Odoo customer or create a prospect.
- Public Mode: start from sector or business challenge without customer selection.

### 2. Location journey

A persistent location canvas supports these stages:

1. Context
2. Measure
3. Understand
4. Prove
5. Configure
6. Act

The user should feel that the perspective and layers change while the same location story remains central.

### 3. Data lenses

- Mobile & geo context
- Physical measurement
- Business data
- Derived insight

Each lens must have distinct visual semantics and an accessible text label. Sample data must be visibly identified as illustrative.

### 4. Build to believe

Include:

- one short video component or realistic video placeholder;
- a contextual customer-logo strip clearly labelled as illustrative unless approved assets are supplied;
- one compact case-study interaction;
- a short `Why PFM` proof section;
- a method/privacy explainer that distinguishes mobile/geo context from physical measurement.

### 5. Configure

Show a simulated Digital Quote Builder handoff with prefilled context:

- vertical;
- number of locations;
- selected challenges;
- selected capabilities;
- selected data layers.

Do not rebuild full pricing logic in this task.

### 6. Act

Show a completion summary with simulated actions:

- create/update Odoo CRM opportunity;
- create a quotation draft;
- publish a client room;
- schedule a location/data workshop.

### 7. Client-room preview

Show the simplified customer view containing only the selected story, proof, configuration and next step.

## Visual requirements

- PFM brand colours and semantic roles.
- Instrument Sans where practical, with local/system fallback.
- Strong at 1440 × 900 and usable on a tablet.
- One dominant visual per screen.
- No generic stock dashboard aesthetic.
- Motion should explain movement, layering or progression; no decorative animation.

## Acceptance criteria

- A first-time viewer understands the concept within 30 seconds.
- The presenter can complete the core story in 4–6 minutes.
- Sales and Public modes are visibly related but have different entry and completion flows.
- Measured, connected and derived information cannot reasonably be mistaken for one another.
- The Quote Builder appears as part of the experience, not an unrelated external tool.
- The demo contains no live credentials, external system calls or real customer data.
- The app passes lint, type-check and production build.
- Core navigation has at least one automated smoke test or documented manual test script.

## Non-goals

- Live Odoo integration
- Microsoft login
- SharePoint publishing workflow
- Real client-room security
- Full quotation or pricing engine
- All PFM verticals
- Production analytics or consent management
- Final customer claims, final case content or unrestricted public launch
