# CE-DEMO-001R — Repair the core Retail narrative

## Goal

Transform the existing Sales Mode shell into a commercially convincing Retail story across Context, Measure and Understand, while retaining the current technical foundation.

## Product question

Why does location potential not consistently become visits and performance?

## Required story

Outside opportunity → capture → visits → conversion context → decision.

## Scope

### Context

Show location opportunity without suggesting that mobile/geo data is exact physical measurement.

The scene should communicate:

- catchment or origin context;
- approach directions;
- passing opportunity;
- mobile/geo as an aggregate context layer.

Remove the unsupported 18.4 km headline unless its precise role and fixture definition are documented.

### Measure

Show:

- aligned passing audience;
- measured store visits;
- capture-rate calculation;
- matching period, area and audience definition;
- physical measurement as visually different from mobile/geo context.

Use illustrative fixture data only.

### Understand

Show how physical visits can be connected to illustrative customer business data.

Include one clear comparison such as:

“Visits rise during the afternoon, while conversion does not.”

Make clear that this identifies a question for investigation, not a proven cause or lost-revenue claim.

Show the performance chain:

- outside opportunity;
- store entries;
- transactions;
- transaction value context.

Move capability selection out of Understand and reserve it for Configure.

## Content sources

Use:

- docs/reference/digital-sales-journey/retail-fit-signals.md
- docs/reference/digital-sales-journey/kpi-library.md
- docs/reference/digital-sales-journey/story-modules.md
- docs/reference/digital-sales-journey/geolocation-principles.md
- docs/reference/digital-sales-journey/privacy-governance-notes.md
- docs/product/RETAIL-GO-DEMO-PACKAGE.md

These files provide domain knowledge. They do not override the canonical journey or truth rules.

## Non-goals

- Prove implementation;
- final cases, logos or video;
- Quote Builder implementation;
- Odoo actions;
- Client Room;
- Public Experience;
- production APIs;
- pricing;
- additional verticals;
- wholesale visual redesign.

## Acceptance criteria

- A first-time viewer can explain the difference between outside opportunity, capture, visits and conversion.
- Context, Measure and Understand form one continuous Retail story.
- Capture rate can be manually verified from visible values.
- The capture calculation states its illustrative period and comparable measurement scope.
- Mobile/geo, physical measurement, business data and derived insight remain distinguishable without relying only on colour.
- Turning off a required source layer disables the related derived insight.
- Understand contains one decision-relevant observation without presenting causality as fact.
- Capability selection no longer appears in Understand.
- Existing six-stage navigation remains intact.
- Prove, Configure and Act remain clearly labelled placeholders.
- No real customer data, customer logos, external calls or credentials are introduced.
- Lint, type-check, automated tests and production build pass.
- Screenshots are produced for Context, Measure and Understand at 1440×900.