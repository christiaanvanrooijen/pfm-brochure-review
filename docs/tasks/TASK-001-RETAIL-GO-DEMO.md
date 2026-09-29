# TASK-001 — Build the Retail go-demo

## Objective

Turn the current concept into a polished, standalone Retail go-demo suitable for a 4–6 minute leadership presentation.

## Starting point

- Inspect the repository.
- Review both files in `reference-demos/`.
- Treat the v2 demo as the stronger conceptual reference, but do not preserve weak card-heavy or generic website patterns.
- Use the project documents as the source of truth.

## Deliverable

A runnable web application that demonstrates:

1. Sales Mode and Public Experience entry paths.
2. A persistent retail location canvas.
3. The six-stage journey: Context, Measure, Understand, Prove, Configure, Act.
4. Four visually distinct data lenses.
5. Build-to-believe content: video, proof logos, compact case and Why PFM.
6. A Quote Builder handoff with prefilled mock context.
7. A simulated Odoo opportunity/client-room completion.
8. A client-room preview.

## Implementation boundaries

- Use local fixture data only.
- No external APIs, trackers, map SDKs or CDNs are required.
- No real customer names, logos or claims unless already approved and included as assets.
- Use obvious demo labels for illustrative figures and proof placeholders.
- Keep adapters for future integrations, but do not over-engineer them.

## UX requirements

- The core concept must be understandable without narration.
- Optimise the main presentation view for 1440 × 900.
- Support common laptop and tablet widths.
- Use keyboard-accessible navigation and controls.
- Preserve user selections across the journey.
- Keep a visible sense of progress without looking like a form wizard.
- Do not use more than three primary actions on any entry screen.

## Technical acceptance

- Clear local setup instructions.
- Typed fixture and session models.
- Lint passes.
- Type-check passes.
- Production build passes.
- Core navigation smoke test passes or a deterministic manual QA script is supplied.
- No secrets or real personal/customer data.

## Completion report

Document:

- chosen stack and reason;
- main component structure;
- interaction model;
- what is simulated;
- test/build results;
- known limitations;
- screenshots or a concise visual QA note;
- recommended TASK-002.
