# First prompt for Codex

Use this after opening the `pfm-commercial-experience` repository in Codex.

---

You are starting the PFM Commercial Experience repository.

First, inspect the repository and read `AGENTS.md`, `README.md`, all files in `docs/`, and `tasks/TASK-001-RETAIL-GO-DEMO.md`. Review the two HTML files in `reference-demos/` as concept references only.

Your task is to implement TASK-001: a polished Retail go-demo for an internal go/no-go presentation.

Before editing code:

1. Summarise the product goal in no more than five bullets.
2. Report the current repository structure and whether an application stack already exists.
3. Propose the smallest suitable implementation plan, including the chosen stack, route/component structure, fixture model, test approach and commands you will run.
4. Identify any conflict between the documents. If there is no material conflict, proceed without waiting for confirmation.

Implementation requirements:

- Build one application supporting Sales Mode and Public Experience from a shared component/content system.
- Use the journey `Context → Measure → Understand → Prove → Configure → Act`.
- Make one retail location canvas the visual centre of the experience.
- Include distinct lenses for mobile/geo context, physical measurement, connected business data and derived insight.
- Include a functional video/proof section, illustrative logo proof, a compact case interaction and `Why PFM` content.
- Include a simulated Digital Quote Builder handoff populated from the session state.
- Include simulated Odoo completion and a client-room preview.
- Use local typed fixtures only; make no live external calls.
- Follow all PFM brand, copy, truth and evidence rules in `AGENTS.md` and `docs/DESIGN-SYSTEM.md`.
- Do not invent customer results, permissions or technical claims.
- Keep future Odoo, content, identity, analytics and Quote Builder connections behind small adapter interfaces.
- Prefer a coherent experience over a large number of screens.
- Use motion only to explain zoom, movement, layering or progression.

Quality requirements:

- Strong presentation at 1440 × 900 and usable at tablet width.
- Accessible semantic controls and visible keyboard focus.
- No generic dashboard-card wall.
- Lint, type-check, tests and production build must pass.
- Visually inspect the final result and fix obvious spacing, overflow, hierarchy and interaction problems.

At completion, update the README if setup changed and provide a concise report containing changed files, key decisions, commands run, results, limitations and the recommended next task.

Proceed with the work in this repository.
