# Segment Story Architecture

## Status and source basis

This document translates the approved sales-experience direction and PFM Segment Insight Matrix v1.1 into content and interaction architecture. It does not define application implementation or component design. The source workbook requested as `docs/product/PFM-Segment-Insight-Matrix-v1.1.xlsx` is not present under that filename; the repository contains the same-titled v1.1 workbook as `docs/product/PFM_Segment_Insight_Matrix_v1_1.xlsx`, which is the matrix source used here. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§1–7, 14, 21–23; `PFM_Segment_Insight_Matrix_v1_1.xlsx`, `PFM Matrix!A1:P3`]

Direct evidence is identified with workbook cell locators. Statements labelled **Architecture decision** interpret that evidence within the governing repository rules.

User task requirement (2026-08-14): the current approved request, cited below by numbered section or named rule.

User-approved product input (2026-08-14): the follow-up capability, implementation, privacy, data-role, visual and readiness requirements used for the dependency classifications in this revision.

## Conflict and missing-input assessment

1. **Filename mismatch, not a content conflict.** The requested hyphenated filename is absent. The only segment-insight workbook in `docs/product/` is the underscore-normalised v1.1 file named above, and its title identifies it as “PFM solution & insight matrix · v1.1”. [Source: `PFM_Segment_Insight_Matrix_v1_1.xlsx`, `PFM Matrix!A1`]
2. **Segment-scope tension.** The matrix defines Core routes for Retail Chain, Shopping Centre, Retail Park and Outlet Centre, while the current repository objective says Retail is the only complete go-demo vertical. [Source: `PFM_Segment_Insight_Matrix_v1_1.xlsx`, `PFM Matrix!A5:P49`; `AGENTS.md`, “Current objective”]
   - **Architecture decision:** preserve every matrix-backed segment route, but treat only Retail Chain as implementation-ready in the current 4–6 minute go-demo scope. The other routes are product architecture and must not be represented as complete current demo commitments. This applies the higher-priority repository rule without discarding matrix content.
3. **Narrative-tagline ambiguity, resolved by the workbook’s journey sheet.** The matrix subtitle uses “movement → context → insight → decision”, which could be mistaken for a four-step journey. The dedicated Journey architecture sheet says the six canonical stages stay fixed and defines `Context → Measure → Understand → Prove → Configure → Act`; therefore the subtitle is treated as a narrative summary, not navigation or stage order. Configure and Act remain synthesis stages rather than capability rows. [Source: `PFM Matrix!A2:P3`; `Journey architecture!A1:F28`; `AGENTS.md`, “Canonical journey”]
4. **Capability-role versus route-priority terminology.** The Capability overview calls Retail visit duration `Core` and staff interaction `Core/optional`, while the scene rows classify them `Optional` and leave their Core path order blank. **Architecture decision:** use the dedicated `Story priority` and `Core path order` fields for presenter routing; use the Capability overview only as segment-level scope guidance. [Source: `Capability overview!A8:B12`; `PFM Matrix!A8:P8`; `PFM Matrix!A12:P12`; `Definitions & guardrails!A20:B21`]
5. **Visual registry gap, now classified.** Seventeen scene-level visual IDs are marked `planned` in the matrix but are absent from the Visual & proof registry. They are classified `PLACEHOLDER`: the IDs and scene relationships are architecture-ready, but no asset or approval is implied. [Source: `PFM Matrix!M8:M49`; `Visual & proof registry!A4:G21`; user-approved product input (2026-08-14), §7]
6. **Missing fixture and KPI presentation inputs.** The workbook contains no Northstar Retail Group fixture values and does not provide per-KPI area, period, denominator or display-definition metadata. This task does not invent them; any go-demo values must be fictional, illustrative and definition-gated under AGENTS.md. [Source: `PFM Matrix!A1:P49`; `Definitions & guardrails!A5:B15`; `AGENTS.md`, “Truth rules”]
7. **Retail narrative expansion, not journey replacement.** AGENTS.md gives the governing Retail story as outside opportunity → store capture → visits → conversion context → decision → configured next step. The approved direction and matrix add visitor mix, in-store journey and zone engagement between visits and conversion. These are supporting beats inside the governing story and do not rename or reorder the six canonical stages. [Source: `AGENTS.md`, “Canonical Retail story”; `SALES-EXPERIENCE-DIRECTION.md` §14.1; `PFM Matrix!A5:P14`]
8. **Compatible data vocabularies require an explicit mapping.** The matrix uses Measured, Connected, Derived and Decision; the approved direction exposes Physical, Mobile & geo, Business and Insight lenses. This document maps Physical to direct Measured evidence, splits Connected into Mobile & geo versus Business, and maps Insight to Derived. Decision remains a supported choice; Outcome remains a possible real-world effect and is never evidence produced by the experience. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§8.4, 10; `PFM Matrix!E4:I49`; `Definitions & guardrails!A5:B8`; user task requirement (2026-08-14), “Truth and UX rules”]
9. **Product-source gap, classified rather than filled.** No approved vendor datasheet is committed in the repository source bundle. Confidential local PFM material partially supports Xovis/3D explanations and one implementation-specific LiDAR topology, mapped through sanitised source IDs in the technology model. Milesight, Isarsoft and named vehicle/parking product detail remain without local sources. The approved product placement is usable as `USER-APPROVED PRODUCT INPUT`; unsupplied or unvalidated detail remains `REQUIRES SOURCE MAPPING` or `REQUIRES PRODUCT VALIDATION`. [Source: `TECHNOLOGY-DRILLDOWN-MODEL.md`, “Conflict and ambiguity assessment”, “Sanitised local source register” and “Implementation source registry”; `../../../../03-shared/pfm-products.md`]

No capability, case, video or performance claim is added by this document.

## Canonical journey contract

The stage names, order and boundaries are fixed:

`Context → Measure → Understand → Prove → Configure → Act`

| Stage | Story function | Route behaviour | Source |
|---|---|---|---|
| Context | Frame the opportunity before presenting direct measurement. | Establish the relevant external, street, destination or catchment context without presenting mobile/geo context as physical measurement. | `Journey architecture!B5:D28`; `Definitions & guardrails!A15:B15`; `AGENTS.md`, “Data layers” |
| Measure | Establish trusted, directly measured demand. | Keep people, vehicles, entries, visits and unique visitors distinct. | `Journey architecture!B5:D28`; `Definitions & guardrails!A5:B5` |
| Understand | Explain behaviour derived from named measured and/or connected inputs. | Suppress a derived insight when any required source layer is disabled. | `Journey architecture!B5:D28`; `Definitions & guardrails!A7:B7`; `AGENTS.md`, “Data layers” |
| Prove | Connect the observed pattern to a business, operational or comparison question. | Present evidence and a decision question, never a guaranteed outcome. Contextual proof assets may be opened here or earlier from their linked scenes. | `Journey architecture!B5:D28`; `Definitions & guardrails!A8:B8`; `Definitions & guardrails!A23:B23` |
| Configure | Select the minimum evidence stack for the agreed question. | Synthesis stage: select measurement, connected context, scope and coverage; do not turn it into a hardware catalogue. | `Journey architecture!A2:F2`; `Journey architecture!B9:D27` |
| Act | Convert the session into an agreed next question or follow-up. | Synthesis stage: carry forward observed facts, interpretation, test question and agreed follow-up. | `Journey architecture!A2:F2`; `Journey architecture!B10:F28` |

**Architecture decision:** story priority and data availability are independent. `Core` means the scene belongs in the default presenter route; it does not authorise an unavailable derived insight. If a required layer is disabled or not configured, the route must omit the unsupported value and retain only a truthful explanation or configuration question. [Source: `Definitions & guardrails!A5:B12`; `Definitions & guardrails!A20:B22`; `AGENTS.md`, “Data layers”]

## Priority and branching model

| Priority | Presenter role | Ordering rule | Source |
|---|---|---|---|
| Core | Default 4–6 minute guided story. | Follow `Core path order` deterministically, then complete Configure and Act. | `PFM Matrix!A3:P3`; `Definitions & guardrails!A20:B21` |
| Optional | Contextual branch when the prospect’s question makes it relevant. | Enter from a relevant Core scene and return to the next Core step; blank Core order means it is not mandatory. | `PFM Matrix!A3:P3`; `Definitions & guardrails!A20:B21` |
| Advanced | Specialist or deeper-scope drilldown. | Open only for a specialist question; it never displaces the Core presenter route. | `PFM Matrix!A3:P3`; `Definitions & guardrails!A20:B21` |

Technology and proof are progressive-disclosure branches, not primary journey stages. [Source: `PFM Matrix!A3:P3`; `Definitions & guardrails!A22:B23`]

The Core path is a presenter compression, not a full capability tour: one question, one dominant visual and only enough evidence to progress. Technology, proof, Optional and Advanced content stays closed unless discovery makes it relevant. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§2, 6–7]

**Architecture decision — presenter pacing:** Core identifies the standard sequence, not an obligation to dwell equally on every row. Consecutive rows within one stage are narrated as a single movement beat, while still retaining their own question, source dependencies and CTA. The default route budget is therefore:

| Segment | Core scene rows | Presenter treatment | Indicative route budget |
|---|---:|---|---:|
| Retail | 6 | Context/Measure in about 2 minutes; Understand/Prove in about 2 minutes; Configure/Act in about 1 minute. | 4–6 minutes |
| Shopping Centre | 8 | Context/Measure in about 2 minutes; the linked circulation/exposure scenes as one 2–3 minute movement beat; Configure/Act in about 1 minute. | 4–6 minutes |
| Retail Park | 7 | Context/arrival in about 2 minutes; unit/cross-visitation/exposure as one 2–3 minute movement beat; Configure/Act in about 1 minute. | 4–6 minutes |
| Outlet Centre | 10 | Reach/arrival in about 2 minutes; circulation/brand/time as one 2–3 minute destination beat; Configure/Act in about 1 minute. | 4–6 minutes |

These are facilitation budgets, not performance claims or automatic timers. Opening a branch extends or substitutes within the conversation; it does not silently lengthen the default route. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§2, 6–7; `PFM Matrix!K4:L49`; user task requirement (2026-08-14) §1]

## Scene interaction contract

Every scene uses the same interaction hierarchy while retaining segment-specific content:

1. Lead with one commercial question and one dominant location or movement visual.
2. Show only the two to four evidence values needed to understand that visual.
3. Offer `How we measure this` only when the scene references one or more technology modules.
4. Offer `See it in practice` only when the scene references a proof asset and that asset is approved for the current audience. A placeholder may remain visible to an internal salesperson as unavailable content, but it must not appear as customer proof.
5. Keep the matrix CTA as the single primary action that advances the commercial narrative.
6. When a technology or proof layer closes, return to the same scene with the same journey position, data-lens state and next CTA.

[Source: `SALES-EXPERIENCE-DIRECTION.md` §§7, 11, 13, 18; `PFM Matrix!M4:P49`]

`How we measure this` and `See it in practice` are secondary actions. They never become stage labels, primary navigation items or mandatory steps in the 4–6 minute route. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§4–7, 13]

## Configure and Act synthesis contract

Configure and Act synthesise the selected story; they are not capabilities copied from matrix rows. [Source: `Journey architecture!A2:F2`; `SALES-EXPERIENCE-DIRECTION.md` §§22–23]

| Stage | Governing question | Inputs | Output | Prohibited behaviour | Source |
|---|---|---|---|---|---|
| Configure | **What measurement and context do we need to answer this customer's question?** | Selected commercial question; required Physical, Mobile & geo and Business roles; coverage, definitions and privacy constraints. | Minimum evidence stack: required measurement, required connected context, available Insight and implementation scope. | Starting from hardware or exposing a device catalogue as the main choice. | `Journey architecture!B9:D27`; `SALES-EXPERIENCE-DIRECTION.md` §22; user task requirement (2026-08-14) §1 |
| Act | **What should we explore, test or agree next?** | Observed Measured/Connected facts, clearly labelled interpretation, configured evidence requirements and unresolved questions. | A human-owned investigation, test or agreed follow-up. | Automatic recommendations, guaranteed conclusions or claims that technology caused an outcome. | `Journey architecture!B10:F28`; `SALES-EXPERIENCE-DIRECTION.md` §23; user task requirement (2026-08-14) §1 |

Act preserves the sequence `What we observed → What it may mean → What we would examine next → What is required`. “What it may mean” is interpretation, not Outcome proof. [Source: `SALES-EXPERIENCE-DIRECTION.md` §23; user task requirement (2026-08-14), “Truth and UX rules”]

## Visual asset status model

Scene rows retain their stable visual IDs, but an ID does not by itself prove that a usable or approved file exists. [Source: `PFM Matrix!M4:M49`; `Visual & proof registry!A2:G21`; `../../AGENTS.md`, “Traceability”]

| Typed status | IDs | Permitted interpretation | Source |
|---|---|---|---|
| `EXISTING APPROVED ASSET` | None evidenced | Use only after an asset path, provenance and approval record exist. | Absence from `Visual & proof registry!A5:G21` |
| `EXISTING REFERENCE ASSET` | `VIS-RET-01`–`VIS-RET-05` | A reference direction is registered. It may guide later work, but no production approval is implied. | `Visual & proof registry!A5:G9` |
| `NEW APPROVAL PROOF REQUIRED` | `VIS-SC-01`–`VIS-SC-04`; `VIS-RP-01`–`VIS-RP-04`; `VIS-OUT-01`–`VIS-OUT-04` | An active visual direction is registered, but the matrix supplies no approved asset path or approval record. | `Visual & proof registry!A10:G21` |
| `PLACEHOLDER` | All 17 planned, unregistered IDs listed below | Preserve the stable ID and intended scene attachment only. Do not imply that an image exists or has been approved. | `PFM Matrix!M8:M49`; absence from `Visual & proof registry!A5:A21` |

### Planned visual classification

| Planned ID | Segment | Intended scene | Typed status | Source |
|---|---|---|---|---|
| `VIS-RET-06` | Retail | Visit duration | `PLACEHOLDER` | `PFM Matrix!A8:M8` |
| `VIS-RET-07` | Retail | Product-category journey | `PLACEHOLDER` | `PFM Matrix!A10:M10` |
| `VIS-RET-08` | Retail | Staff interaction | `PLACEHOLDER` | `PFM Matrix!A12:M12` |
| `VIS-RET-09` | Retail | Conversion and sales context | `PLACEHOLDER` | `PFM Matrix!A13:M13` |
| `VIS-RET-10` | Retail | Portfolio comparison | `PLACEHOLDER` | `PFM Matrix!A14:M14` |
| `VIS-SC-05` | Shopping Centre | Visitor composition | `PLACEHOLDER` | `PFM Matrix!A18:M18` |
| `VIS-SC-06` | Shopping Centre | Brand counting | `PLACEHOLDER` | `PFM Matrix!A22:M22` |
| `VIS-SC-07` | Shopping Centre | Brand flow | `PLACEHOLDER` | `PFM Matrix!A23:M23` |
| `VIS-SC-08` | Shopping Centre | Parking arrival | `PLACEHOLDER` | `PFM Matrix!A24:M24` |
| `VIS-SC-09` | Shopping Centre | Parking occupancy | `PLACEHOLDER` | `PFM Matrix!A25:M25` |
| `VIS-SC-10` | Shopping Centre | Vehicle origin | `PLACEHOLDER` | `PFM Matrix!A26:M26` |
| `VIS-RP-05` | Retail Park | Visitor composition | `PLACEHOLDER` | `PFM Matrix!A32:M32` |
| `VIS-RP-06` | Retail Park | Time on site | `PLACEHOLDER` | `PFM Matrix!A34:M34` |
| `VIS-RP-07` | Retail Park | Unit and category exposure | `PLACEHOLDER` | `PFM Matrix!A35:M35` |
| `VIS-OUT-05` | Outlet Centre | Visitor composition | `PLACEHOLDER` | `PFM Matrix!A42:M42` |
| `VIS-OUT-06` | Outlet Centre | Brand counting | `PLACEHOLDER` | `PFM Matrix!A46:M46` |
| `VIS-OUT-07` | Outlet Centre | Brand flow | `PLACEHOLDER` | `PFM Matrix!A47:M47` |

This classification creates no visual and grants no approval. A future asset may move out of `PLACEHOLDER` only through a sourced asset and approval record. [Source: user-approved product input (2026-08-14), §7; `../../AGENTS.md`, “Traceability”]

### Visual metadata contract

Each future visual record should carry `id`, `segment`, `scene_or_capability`, `visual_family`, `aspect_ratio`, `status`, `alt_text`, `illustrative`, and `source_or_approval_reference`. The matrix currently supplies only some IDs, segment/scene associations, themes and descriptive statuses; all other fields remain unresolved until sourced. [Source: `SALES-EXPERIENCE-DIRECTION.md` §15; `PFM Matrix!M4:M49`; `Visual & proof registry!A4:G21`]

An `Available reference` or `Active visual direction` status does not establish an approved file, aspect ratio, alt text or external-use permission. [Source: `Visual & proof registry!A2:G21`; `../../AGENTS.md`, “Traceability”]

## Retail — current go-demo route (matrix label: Retail Chain)

### Commercial narrative

Retail is performance-led: outside opportunity → store capture → visits → anonymous visitor and journey context → conversion and sales context → decision → configured next step. The additional visitor-mix and in-store beats expand the governing Retail story without replacing it. [Source: `AGENTS.md`, “Canonical Retail story”; `SALES-EXPERIENCE-DIRECTION.md` §14.1; `PFM Matrix!A5:P14`; `Definitions & guardrails!A19:B19`]

### Core presenter route

| Order | Stage | Scene and customer question | Decision / customer value | Visual | Technology | Contextual proof | Next CTA | Source |
|---:|---|---|---|---|---|---|---|---|
| 1 | Context | **Street opportunity** — How much passing traffic is available, and what share enters the store? | Optimise frontage, campaign timing and store-level opportunity. | `VIS-RET-01` | `TECH-01`, `TECH-02` | `CASE-RET-01` (placeholder) | Measure store visits | `PFM Matrix!A5:P5` |
| 2 | Measure | **Store visits** — How many visitors enter, and when does demand occur? | Align staffing, opening hours and operations with demand. | `VIS-RET-04` | `TECH-02` | `CASE-RET-01` (placeholder) | Understand who enters | `PFM Matrix!A6:P6` |
| 3 | Measure | **Visitor composition** — What kind of anonymous visitor mix enters the store? | Understand buying-unit mix and compare visitor composition by store or period. | `VIS-RET-03` | `TECH-03` | `CASE-RET-01` (placeholder) | Enter the location | `PFM Matrix!A7:P7` |
| 4 | Understand | **In-store journey** — Where do visitors go during the visit? | Improve layout, wayfinding and merchandising tests. | `VIS-RET-02` | `TECH-04` | `CASE-RET-02` (placeholder) | Explore zone engagement | `PFM Matrix!A9:P9` |
| 5 | Understand | **Zone engagement** — What do visitors do in the zones they reach? | Prioritise hot/cold zones and test merchandising or layout changes. | `VIS-RET-05` | `TECH-04` | `CASE-RET-02` (placeholder) | Connect performance | `PFM Matrix!A11:P11` |
| 6 | Prove | **Conversion & sales context** — Do store visits become transactions? | Identify whether opportunity sits in traffic, conversion or transaction value. | `VIS-RET-09` (planned) | `TECH-02`, `TECH-08` | `CASE-RET-01` (placeholder) | Compare locations | `PFM Matrix!A13:P13` |
| Synthesis | Configure | **Select the minimum evidence stack** — measurement, connected context, scope and coverage required for the agreed question. | Configure around the question, not around hardware. | No asset assigned | Relevant modules only | Return to originating scene | Build the next step | `Journey architecture!A9:F9` |
| Synthesis | Act | **Turn the session into a commercial next step** — observed facts, interpretation, test question and agreed follow-up. | Customer leaves with a useful next action. | No asset assigned | No mandatory drilldown | Return to originating scene | Finish / save story | `Journey architecture!A10:F10` |

Capture rate may appear only when aligned passing audience and visits are both visible, with area, period and definition stated. Transactions are connected business data and require compatible visitor or buying-unit definitions. [Source: `AGENTS.md`, “Truth rules”; `Definitions & guardrails!A10:B10`; `Technology library!A5:G6`]

### Retail contextual branches

| Priority | Stage | Scene | Commercial question → branch purpose | Visual | Technology | Contextual proof | Rejoin CTA | Source |
|---|---|---|---|---|---|---|---|---|
| Optional | Understand | Visit duration | How long do visitors stay? → Compare engagement depth and identify unusual visit-duration patterns. | `VIS-RET-06` (planned) | `TECH-05` and/or `TECH-04` | `CASE-RET-02` (placeholder) | Explore in-store journey | `PFM Matrix!A8:P8` |
| Advanced | Understand | Product-category journey | How do visitors move between product categories? → Evaluate category placement and adjacencies. | `VIS-RET-07` (planned) | `TECH-04`, `TECH-08` | `CASE-RET-02` (placeholder) | Explore zone engagement | `PFM Matrix!A10:P10` |
| Optional | Prove | Staff interaction | Where and when do visitor and staff presence overlap under the agreed definition? → Align service coverage with visitor demand and high-opportunity zones. | `VIS-RET-08` (planned) | `TECH-04`, `TECH-08` | `CASE-RET-02` (placeholder) | Connect performance | `PFM Matrix!A12:P12` |
| Optional | Prove | Portfolio comparison | How do stores compare on aligned measures and business context? → Prioritise stores and tests instead of treating the portfolio as one average. | `VIS-RET-10` (planned) | `TECH-08` | `CASE-RET-03` (placeholder) | Configure solution | `PFM Matrix!A14:P14` |

Visit matching, visitor classification and staff interaction are conditional. They may be shown only where coverage, configured analytics, privacy framework and agreed definitions support them. [Source: `Definitions & guardrails!A9:B12`; `Technology library!A7:G9`]

## Shopping Centre — product architecture, not a complete current go-demo

### Commercial narrative

Shopping Centre is circulation- and exposure-led: catchment → entrances → visitor mix → circulation → zones/anchors → brand visits and flow → time in centre → site decision. It must feel like movement through a destination, not a scaled-up Retail dashboard. [Source: `SALES-EXPERIENCE-DIRECTION.md` §14.2; `Definitions & guardrails!A16:B16`]

### Core route

| Order | Stage | Scene | Story question → customer value | Visual | Technology | Contextual proof | Next CTA | Source |
|---:|---|---|---|---|---|---|---|---|
| 1 | Context | Catchment area | Where do centre visitors come from, and who lives in that reach? → Shape marketing, positioning, leasing context and destination strategy. | `VIS-SC-04` | `TECH-07` | `CASE-SC-01` (placeholder) | Measure centre arrivals | `PFM Matrix!A15:P15` |
| 2 | Measure | Centre entrances | How many visitors enter the asset, through which entrances and when? → Plan operations, cleaning, security, opening hours and event staffing. | `VIS-SC-01` | `TECH-02` | `CASE-SC-02` (placeholder) | Understand visitor mix | `PFM Matrix!A17:P17` |
| 3 | Measure | Visitor composition | Who is entering the centre in anonymous visitor groups? → Compare visitor mix by entrance, daypart, event or season. | `VIS-SC-05` (planned) | `TECH-03` | `CASE-SC-02` (placeholder) | Follow centre circulation | `PFM Matrix!A18:P18` |
| 4 | Understand | Internal circulation | How do visitors move across floors, corridors, zones and anchors? → Improve wayfinding, layout, operations and anchor connectivity. | `VIS-SC-02` | `TECH-04` | `CASE-SC-02` (placeholder) | Explore zone and anchor exposure | `PFM Matrix!A20:P20` |
| 5 | Understand | Zone and anchor exposure | Which areas receive attention, and where do visitors dwell? → Support tenant conversations, leasing context, events and space planning. | `VIS-SC-02` | `TECH-04` | `CASE-SC-02` (placeholder) | See brand visits | `PFM Matrix!A21:P21` |
| 6 | Understand | Brand counting | Which stores or brands are actually visited? → Understand tenant exposure and brand visitation without assuming tenant sales. | `VIS-SC-06` (planned) | `TECH-02` and/or `TECH-04` | `CASE-SC-03` (placeholder) | Follow brand flow | `PFM Matrix!A22:P22` |
| 7 | Understand | Brand flow | How do visitors move from one brand to another? → Inform adjacency, wayfinding, leasing context and tenant conversations. | `VIS-SC-07` (planned) | `TECH-05`, `TECH-04` | `CASE-SC-03` (placeholder) | Understand time in centre | `PFM Matrix!A23:P23` |
| 8 | Understand | Time in centre | How long do visitors stay in the asset? → Understand depth of visit and operational pressure by period. | `VIS-SC-02` | `TECH-05`, `TECH-04` | `CASE-SC-02` (placeholder) | Configure solution | `PFM Matrix!A19:P19` |
| Stage beat | Prove | Compare patterns in context | Compare entrance, zone, brand, time and event patterns → Prioritise an operational or commercial question. | No asset assigned | Relevant modules only | Relevant scene-linked proof | Configure the evidence | `Journey architecture!A14:F14` |
| Synthesis | Configure | Select coverage and data layers | Select entrances, spatial coverage, geo context, tenant mapping and optional vehicle data → Match measurement scope to the centre question. | No asset assigned | Relevant modules only | Return to originating scene | Build the next step | `Journey architecture!A15:F15` |
| Synthesis | Act | Agree the property decision to explore | Operations, wayfinding, events, tenant conversations or leasing context → Leave with a defined decision question. | No asset assigned | No mandatory drilldown | Return to originating scene | Finish / save story | `Journey architecture!A16:F16` |

### Branches

| Priority | Stage | Scene | Story question → customer value | Visual | Technology | Contextual proof | Next CTA | Source |
|---|---|---|---|---|---|---|---|---|
| Optional | Context | Competitive visitation and white spots | Where else does the catchment go, and where are we under-represented? → Target under-penetrated areas and understand competitive destination behaviour. | `VIS-SC-03` | `TECH-07` | `CASE-SC-01` (placeholder) | Measure centre arrivals | `PFM Matrix!A16:P16` |
| Optional | Measure | Parking arrival | How does vehicle arrival translate into centre visits? → Plan access, event operations and peak arrival management. | `VIS-SC-08` (planned) | `TECH-06`, `TECH-02` | `CASE-SC-04` (placeholder) | Explore parking pressure | `PFM Matrix!A24:P24` |
| Optional | Understand | Parking occupancy | When and where is parking capacity under pressure? → Manage capacity, circulation and operational interventions. | `VIS-SC-09` (planned) | `TECH-06` | `CASE-SC-04` (placeholder) | Measure centre arrivals | `PFM Matrix!A25:P25` |
| Advanced | Context | Vehicle origin | What vehicle-origin context can be added to asset visitation? → Add destination/tourism context without overstating what the plate itself reveals. | `VIS-SC-10` (planned) | `TECH-06`, `TECH-07` with lawful origin context | `CASE-SC-01` (placeholder) | Explore catchment | `PFM Matrix!A26:P26` |

## Retail Park — product architecture, not a complete current go-demo

### Commercial narrative

Retail Park is arrival- and cross-visitation-led: catchment → vehicle arrival → parking → unit visits → cross-visitation → time on site → unit/category exposure → property decision. Vehicle arrivals, parked vehicles, people and visits remain separate units. [Source: `SALES-EXPERIENCE-DIRECTION.md` §14.3; `Definitions & guardrails!A13:B13`; `Definitions & guardrails!A17:B17`]

### Core route

| Order | Stage | Scene | Story question → customer value | Visual | Technology | Contextual proof | Next CTA | Source |
|---:|---|---|---|---|---|---|---|---|
| 1 | Context | Catchment area | Where do park visitors come from, and what demand sits around the asset? → Inform marketing, tenant mix and park positioning. | `VIS-RP-04` | `TECH-07` | `CASE-RP-01` (placeholder) | Measure vehicle arrival | `PFM Matrix!A27:P27` |
| 2 | Measure | Vehicle arrival | How many vehicles arrive, and when? → Manage access, peaks and operating requirements. | `VIS-RP-01` | `TECH-06` | `CASE-RP-02` (placeholder) | Explore parking | `PFM Matrix!A29:P29` |
| 3 | Measure | Parking occupancy | How much parking capacity is used and where? → Improve parking operations and peak-day planning. | `VIS-RP-01` | `TECH-06` | `CASE-RP-02` (placeholder) | See unit visits | `PFM Matrix!A30:P30` |
| 4 | Measure | Unit visits | Which units are visited, and when? → Understand unit exposure and operating patterns. | `VIS-RP-02` | `TECH-02` and/or `TECH-04` | `CASE-RP-02` (placeholder) | Follow cross-visitation | `PFM Matrix!A31:P31` |
| 5 | Understand | Cross-visitation | How do visitors move from unit to unit? → Support adjacency, tenant mix, leasing context and park layout. | `VIS-RP-02` | `TECH-05`, `TECH-04` | `CASE-RP-03` (placeholder) | Understand time on site | `PFM Matrix!A33:P33` |
| 6 | Understand | Time on site | How long do visitors spend in the retail park? → Compare quick missions with deeper multi-unit visits. | `VIS-RP-06` (planned) | `TECH-05`, with `TECH-06` or `TECH-04` depending scope | `CASE-RP-03` (placeholder) | Explore unit exposure | `PFM Matrix!A34:P34` |
| 7 | Understand | Unit and category exposure | How does visitor exposure vary across units and categories? → Inform category planning, signage and leasing conversations. | `VIS-RP-07` (planned) | `TECH-02`, `TECH-04` | `CASE-RP-03` (placeholder) | Configure solution | `PFM Matrix!A35:P35` |
| Stage beat | Prove | Compare patterns in context | Compare unit, category, daypart and parking patterns → Prioritise an access, tenant or operating question. | No asset assigned | Relevant modules only | Relevant scene-linked proof | Configure the evidence | `Journey architecture!A20:F20` |
| Synthesis | Configure | Select coverage and data layers | Select vehicle, parking, unit counting, spatial, geo and tenant mapping as required → Scope the solution to the park question. | No asset assigned | Relevant modules only | Return to originating scene | Build the next step | `Journey architecture!A21:F21` |
| Synthesis | Act | Agree the property decision to explore | Access, parking, tenant mix, signage, operations or marketing → Leave with a defined next test. | No asset assigned | No mandatory drilldown | Return to originating scene | Finish / save story | `Journey architecture!A22:F22` |

### Branches

| Priority | Stage | Scene | Story question → customer value | Visual | Technology | Contextual proof | Next CTA | Source |
|---|---|---|---|---|---|---|---|---|
| Optional | Context | Competitive visitation and white spots | Which competing parks or centres attract the same audience? → Prioritise marketing areas and understand competitive behaviour. | `VIS-RP-03` | `TECH-07` | `CASE-RP-01` (placeholder) | Measure vehicle arrival | `PFM Matrix!A28:P28` |
| Optional | Measure | Visitor composition | What anonymous visitor mix reaches units or shared areas? → Compare audience mix across units, periods or categories. | `VIS-RP-05` (planned) | `TECH-03` | `CASE-RP-03` (placeholder) | Follow cross-visitation | `PFM Matrix!A32:P32` |
| Advanced | Context | Vehicle origin | What origin context can legally be associated with vehicle arrivals? → Add regional/destination context to vehicle-heavy visitation. | `VIS-RP-04` | `TECH-06`, `TECH-07` with lawful origin context | `CASE-RP-01` (placeholder) | Explore catchment | `PFM Matrix!A36:P36` |

## Outlet Centre — product architecture, not a complete current go-demo

### Commercial narrative

Outlet Centre is destination-, reach- and circulation-led: destination catchment → tourism/origin → vehicle and coach arrival → entrances → visitor mix → circulation and exposure → brand flow → time in destination → decision. Movement alone cannot establish turnover, profitability, rent potential or centre ranking. [Source: `SALES-EXPERIENCE-DIRECTION.md` §14.4; `Definitions & guardrails!A18:B18`]

### Core route

| Order | Stage | Scene | Story question → customer value | Visual | Technology | Contextual proof | Next CTA | Source |
|---:|---|---|---|---|---|---|---|---|
| 1 | Context | Destination catchment | How far are visitors willing to travel to the outlet destination? → Support destination marketing, positioning and expansion of reach. | `VIS-OUT-04` | `TECH-07` | `CASE-OUT-01` (placeholder) | Understand origin context | `PFM Matrix!A37:P37` |
| 2 | Context | Tourism and origin context | How much of the audience is local, regional or destination-led? → Adapt campaigns, operating pressure and destination strategy. | `VIS-OUT-04` | `TECH-07` plus approved tourism/origin data | `CASE-OUT-01` (placeholder) | Measure destination arrival | `PFM Matrix!A38:P38` |
| 3 | Measure | Vehicle and coach arrival | When do cars and coaches arrive, and through which access points? → Prepare parking, staffing and operations for destination peaks. | `VIS-OUT-01` | `TECH-06` | `CASE-OUT-02` (placeholder) | Measure centre entrances | `PFM Matrix!A40:P40` |
| 4 | Measure | Centre entrances | How many visitors enter the outlet streets and when? → Plan operations, staffing, security and opening hours. | `VIS-OUT-01` | `TECH-02` | `CASE-OUT-02` (placeholder) | Understand visitor mix | `PFM Matrix!A41:P41` |
| 5 | Measure | Visitor composition | What anonymous visitor mix enters the outlet centre? → Understand visitor mix by period, entrance and destination context. | `VIS-OUT-05` (planned) | `TECH-03` | `CASE-OUT-03` (placeholder) | Follow circulation | `PFM Matrix!A42:P42` |
| 6 | Understand | Circulation | How do visitors move across outlet streets, zones and anchors? → Improve wayfinding, layout, events and circulation planning. | `VIS-OUT-02` | `TECH-04` | `CASE-OUT-03` (placeholder) | Explore zone exposure | `PFM Matrix!A44:P44` |
| 7 | Understand | Zone exposure and dwell | Which outlet zones and brand areas receive attention? → Support tenant conversations, events, leasing context and space planning. | `VIS-OUT-02` | `TECH-04` | `CASE-OUT-03` (placeholder) | See brand visits | `PFM Matrix!A45:P45` |
| 8 | Understand | Brand counting | Which brands are visited? → Understand brand visitation without inferring turnover or rent potential. | `VIS-OUT-06` (planned) | `TECH-02` and/or `TECH-04` | `CASE-OUT-03` (placeholder) | Follow brand flow | `PFM Matrix!A46:P46` |
| 9 | Understand | Brand flow | How do visitors move from one brand to another? → Inform adjacency, wayfinding and tenant/leasing conversations. | `VIS-OUT-07` (planned) | `TECH-05`, `TECH-04` | `CASE-OUT-03` (placeholder) | Understand time in destination | `PFM Matrix!A47:P47` |
| 10 | Understand | Time in destination | How long do visitors stay in the outlet centre? → Understand destination depth and operating pressure. | `VIS-OUT-02` | `TECH-05`, `TECH-04` | `CASE-OUT-03` (placeholder) | Configure solution | `PFM Matrix!A43:P43` |
| Stage beat | Prove | Compare patterns in context | Compare arrival cohorts, zones, brands, dayparts and tourism context → Prioritise destination and operating questions. | No asset assigned | Relevant modules only | Relevant scene-linked proof | Configure the evidence | `Journey architecture!A26:F26` |
| Synthesis | Configure | Select coverage and data layers | Select geo, vehicle, entrances, spatial, brand mapping and tourism context as required → Scope the solution to the destination question. | No asset assigned | Relevant modules only | Return to originating scene | Build the next step | `Journey architecture!A27:F27` |
| Synthesis | Act | Agree the destination decision to explore | Marketing reach, operations, wayfinding, tenant conversations or space planning → Leave with a defined next action. | No asset assigned | No mandatory drilldown | Return to originating scene | Finish / save story | `Journey architecture!A28:F28` |

### Branches

| Priority | Stage | Scene | Story question → customer value | Visual | Technology | Contextual proof | Next CTA | Source |
|---|---|---|---|---|---|---|---|---|
| Optional | Context | Competitive destinations and white spots | Which competing destinations share the same audience, and where are gaps? → Focus marketing and understand destination competition. | `VIS-OUT-03` | `TECH-07` | `CASE-OUT-01` (placeholder) | Measure destination arrival | `PFM Matrix!A39:P39` |
| Optional | Measure | Parking occupancy | When and where does destination parking reach pressure points? → Manage capacity and improve peak-day arrival operations. | `VIS-OUT-01` | `TECH-06` | `CASE-OUT-02` (placeholder) | Measure centre entrances | `PFM Matrix!A48:P48` |
| Optional | Context | Vehicle origin | What vehicle-origin context can be added to destination demand? → Add international/regional destination context without overstating precision. | `VIS-OUT-04` | `TECH-06`, `TECH-07` with lawful origin context | `CASE-OUT-01` (placeholder) | Explore destination reach | `PFM Matrix!A49:P49` |

No Outlet Centre scene is classified `Advanced` in the current matrix. [Source: `PFM Matrix!A37:L49`]

## QSR / Drive-Thru Performance — product architecture, not a complete current go-demo

Segment id `qsr`, display name `QSR`, experience name `Drive-Thru Performance`, implementation status `architecture_only`. QSR is the fifth typed segment and the first that does not originate from the PFM Segment Insight Matrix; its detailed experience source is `docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md`, which remains the source of truth for QSR scene content. Adding QSR to the typed content model does not expose it in the production UI. [Source: `PFM_QSR_Commercial_Experience_Agent_Spec.md` §§22, 32]

### Commercial narrative

QSR is journey-time led: physical drive-thru → vehicle journey → measurable time → bottleneck → crew response → multi-site performance → capability → possible implementation. The canonical journey is unchanged; Configure and Act remain synthesis stages. Measured time identifies where time accumulates; it never establishes the operational cause, and it never produces revenue, average order value, order accuracy, labour cost or profitability. [Source: `PFM_QSR_Commercial_Experience_Agent_Spec.md` §§2, 3, 16, 23 Rule 7]

### Core route

| Order | Stage | Scene | Commercial question | Visual | Technology | Contextual proof | Next CTA |
|---:|---|---|---|---|---|---|---|
| 1 | Context | `qsr-drive-thru-context` | Where does your drive-thru lose time? | `VIS-QSR-CONTEXT-DRIVE-THRU` (placeholder) | `TECH-QSR-01`, `TECH-QSR-02` | none | Follow the vehicle journey |
| 2 | Measure | `qsr-queue` | How long are guests waiting before they can even order? | `VIS-QSR-QUEUE` (placeholder) | `TECH-QSR-01`, `TECH-QSR-02` | `proof-qsr-queue-performance` (placeholder) | Move to the order point |
| 3 | Measure | `qsr-order` | How much time is lost when guest and crew cannot hear each other clearly? | `VIS-QSR-ORDER` (placeholder) | `TECH-QSR-02`, `TECH-QSR-03`, `TECH-QSR-04` | `proof-qsr-communication` (placeholder) | Diagnose the bottleneck |
| 4 | Understand | `qsr-bottleneck` | Where is today's lost time actually coming from? | `VIS-QSR-BOTTLENECK` (placeholder) | `TECH-QSR-02`, `TECH-QSR-07` | `proof-qsr-bottleneck` (placeholder) | Close the loop with the crew |
| 5 | Understand | `qsr-respond` | Can the right person know before the queue becomes the problem? | `VIS-QSR-RESPOND` (placeholder) | `TECH-QSR-02`, `TECH-QSR-06`, `TECH-QSR-03` | `proof-qsr-closed-loop-response` (placeholder) | Compare the estate |
| 6 | Prove | `qsr-estate` | Which restaurants are converting the same demand into faster service? | `VIS-QSR-ESTATE` (placeholder) | `TECH-QSR-07`, `TECH-QSR-02` | `proof-qsr-estate-performance` (placeholder) | Configure the drive-thru performance view |
| Synthesis | Configure | Capability → possible implementation → dependencies → commercial availability | No scene | Relevant capabilities only | Return to originating scene | Build the next step |
| Synthesis | Act | Human-owned hypotheses to validate | No scene | No mandatory drilldown | Return to originating scene | Finish / save story |

### Branches

Six Optional scenes, zero Advanced scenes. Every branch returns to its originating Core scene, per the existing branch contract.

| Priority | Stage | Scene | Branch parent | Commercial question |
|---|---|---|---|---|
| Optional | Measure | `qsr-arrival` | `qsr-queue` | When does the drive-thru journey really begin? |
| Optional | Measure | `qsr-payment` | `qsr-order` | Is the queue slow — or is one order slowing the queue? |
| Optional | Measure | `qsr-handoff` | `qsr-order` | How fast does an order become a completed guest journey? |
| Optional | Measure | `qsr-beyond-lane` | `qsr-queue` | Does moving a vehicle out of the lane really remove the wait? |
| Optional | Understand | `qsr-daypart` | `qsr-bottleneck` | Is this a bad moment — or a repeatable operating pattern? |
| Optional | Prove | `qsr-improvement-proof` | `qsr-estate` | Did the operational change actually improve the drive-thru? |

Voice AI, Vision AI and gamification are deliberately not Core scenes. They belong in capability and technology progressive disclosure. [Source: `PFM_QSR_Commercial_Experience_Agent_Spec.md` §§5, 12.5, 29]

### QSR experience lenses

The QSR specification proposes five presenter lenses: Vehicle flow, Communication, Business / Order, Insight and Automation (advanced, hidden by default). These are typed as segment-specific `experienceLenses` presentation metadata. They map onto the existing global evidence roles (`physical`, `mobile_geo`, `business`, `insight`) and never rename or replace them. No lens UI exists. [Source: `PFM_QSR_Commercial_Experience_Agent_Spec.md` §12]

### QSR derived-dependency gates

Machine-readable in `app/content/segments/qsr.ts` and resolvable through `getSceneDependencyAvailability`:

- Lane total time requires a compatible journey start and end timestamp.
- Stage time requires two compatible configured detection points.
- Queue time requires a defined queue start and a defined queue end or order-point detection.
- Throughput requires vehicle count plus a defined measurement period.
- Goal attainment requires compatible measured time plus a configured target.
- Pull-forward and mobile pickup wait each require their own configured measurement space.
- Daypart pattern requires historical time-series evidence plus consistent daypart definitions.
- Estate comparison requires multiple restaurants, compatible metric definitions and a comparable period or daypart.
- Improvement proof requires a before period, an operational change marker, an after period and compatible measurement definitions.
- Revenue, average order value and profitability remain unavailable unless compatible business data is connected.
- Drive-off remains unavailable unless the configured detection or AI implementation can determine it.

### QSR illustrative demo evidence

The QSR specification's §17 interface examples are registered as illustrative demo evidence only (`illustrative: true`) in `app/lib/fixtures.ts` (`qsrDriveThruStory`) and surfaced through the existing Demo Evidence Runtime. They are fictional interface examples: not HME benchmarks, not QSR industry benchmarks, not customer results and not PFM performance claims. Five QSR scenes carry demo evidence; the remaining seven correctly report missing demo evidence rather than an invented value.

## Core-scene data-role validation

This is the canonical gating model for typed Core-scene content. `Required` means the source must exist for the scene's advertised direct evidence to function truthfully. `Optional` may enrich the story but cannot silently become a prerequisite. `Derived dependency` names every input that must be enabled before the stated Insight appears. [Source: `AGENTS.md`, “Data layers”; `SALES-EXPERIENCE-DIRECTION.md` §10; `PFM Matrix!E4:G49`; user-approved product input (2026-08-14), §5]

### Retail Core

| Core scene | Required | Optional | Derived dependency | Source |
|---|---|---|---|---|
| Street opportunity | Physical: aligned passer-by measure and entrance visits for the capture story. | Business: store hours, campaign, weather or street context. | Capture rate = aligned passer-by audience + entrance visits, with the same area/direction, period and definitions visible. Passing patterns alone require only the passer-by measure. | `PFM Matrix!E5:G5`; `AGENTS.md`, “Truth rules” |
| Store visits | Physical: entrance IN/OUT events by entrance and time. | Business: opening hours, staffing and sales-period context. | Peaks and visit rhythm require the Physical time series; cross-store comparison additionally requires aligned entrance/visit definitions. | `PFM Matrix!E6:G6` |
| Visitor composition | Physical: visit events from a classification-compatible implementation with the required classification enabled. | Business: campaign, format and period context. | Each classification requires compatible hardware, enabled software/plugin, configuration and permitted use; counting alone is insufficient. | `PFM Matrix!E7:G7`; `Definitions & guardrails!A9:B9`; user-approved product input (2026-08-14), “Visitor classification” |
| In-store journey | Physical: anonymous trajectories, zone entries/exits and transitions. Business: approved floorplan and zone definitions. | Business: merchandising or campaign context beyond the required map. | Routes, flow and drop-off require Physical trajectories/transitions + the relevant Business spatial definitions. | `PFM Matrix!E9:G9` |
| Zone engagement | Physical: presence, movement and time within zones. Business: approved zone/category definitions. | Business: merchandising or campaign context. | Dwell/exposure/repeat-zone Insight requires Physical zone events + Business zone definitions. | `PFM Matrix!E11:G11` |
| Conversion and sales context | Physical: compatible store visit or buying-unit count. Business: compatible POS transaction definition and aligned period. | Business: turnover, average transaction value, staffing and campaign context. | Conversion requires compatible visit/buying-unit + transaction inputs; sales per visitor additionally requires sales/turnover. Suppress each unavailable calculation independently. | `PFM Matrix!E13:G13`; `Definitions & guardrails!A10:B10` |

### Shopping Centre Core

| Core scene | Required | Optional | Derived dependency | Source |
|---|---|---|---|---|
| Catchment area | Mobile & geo: approved aggregate origin/mobility source, geography and period. | Physical: on-site visits as an asset baseline; Mobile & geo: approved demographic/affinity context; Business: positioning or campaign context. | Catchment bands, origin mix and travel-time reach require the approved Mobile & geo origin/mobility source; Physical data may anchor demand but cannot create origin. | `PFM Matrix!E15:G15`; `Definitions & guardrails!A15:B15` |
| Centre entrances | Physical: entrance IN/OUT events by entrance and time. | Business: opening hours, events, weather, campaigns and transport context. | Entrance share and peak rhythm require the Physical time series; contextual comparisons require the relevant aligned optional source. | `PFM Matrix!E17:G17` |
| Visitor composition | Physical: classification-compatible entrance events with the selected classification enabled. | Business: event, campaign and daypart context. | Each displayed classification depends on compatible implementation + enabled/configured/permitted classification. | `PFM Matrix!E18:G18`; `Definitions & guardrails!A9:B9` |
| Internal circulation | Physical: anonymous trajectories/transitions. Business: floorplan, floor, corridor, zone, anchor and vertical-transport definitions used by the view. | Business: event/operational context. | Flow, routes and bottlenecks require Physical movement + the relevant Business spatial definitions. | `PFM Matrix!E20:G20` |
| Zone and anchor exposure | Physical: zone presence, entries and time. Business: zone/anchor boundaries. | Business: tenant and event context. | Exposure, reach, dwell and hot/cold patterns require Physical zone events + Business zone/anchor definitions. | `PFM Matrix!E21:G21` |
| Brand counting | Physical: brand/store entrance events or spatial events within covered boundaries. Business: tenant/brand directory and store boundaries. | Business: category and trading-hours context. | Brand visits/share require Physical covered events + Business brand/boundary mapping; they do not establish tenant performance. | `PFM Matrix!E22:G22` |
| Brand flow | Physical: supported anonymous matched visits/transitions. Business: tenant/brand map and category definitions. | Business: event and campaign context. | Brand sequence/cross-visitation requires supported event matching + Business brand mapping. | `PFM Matrix!E23:G23`; `Definitions & guardrails!A11:B11` |
| Time in centre | Physical: matched entrance events or continuous tracked journeys within supported coverage. | Business: opening hours, event and zone context. | Time-in-centre distribution requires a supported matching/continuous method + aligned entry/exit or journey definitions. | `PFM Matrix!E19:G19`; `Definitions & guardrails!A11:B11` |

### Retail Park Core

| Core scene | Required | Optional | Derived dependency | Source |
|---|---|---|---|---|
| Catchment area | Mobile & geo: approved aggregate origin/mobility source, geography and period. | Physical: asset/unit visits as an on-site baseline; Mobile & geo: approved demographic/affinity context; Business: positioning or campaign context. | Catchment and drive-time Insight requires the approved Mobile & geo origin/mobility source; unit sensors cannot measure origin. | `PFM Matrix!E27:G27`; `Definitions & guardrails!A15:B15` |
| Vehicle arrival | Physical: vehicle entries/exits by access point and time. | Business: opening hours, events, access-road and weather context. | Arrival peaks/share require Physical vehicle events; contextual explanations require the selected optional source. | `PFM Matrix!E29:G29`; `Definitions & guardrails!A13:B13` |
| Parking occupancy | Physical: vehicle entry/exit events or bay status. Business: parking capacity, zone and operating definitions. | Business: event and access context. | Occupancy/utilisation/turnover requires the configured Physical parking source + Business capacity/zone definitions. | `PFM Matrix!E30:G30` |
| Unit visits | Physical: entrance or spatial events at covered units. Business: tenant directory, unit boundaries/category and applicable opening hours. | Business: event/campaign context. | Unit visits/share/category visitation require Physical covered events + Business unit mapping. | `PFM Matrix!E31:G31` |
| Cross-visitation | Physical: supported anonymous matched unit visits/transitions. Business: tenant/category map. | Business: event/campaign context. | Cross-visitation, sequence and units-per-trip require matching-compatible Physical coverage + Business unit/category mapping. | `PFM Matrix!E33:G33`; `Definitions & guardrails!A11:B11` |
| Time on site | Physical: supported anonymous vehicle duration or visitor duration events, with the unit explicitly stated. | Business: opening hours, unit visits and event context. | Time-on-site distribution requires one supported duration method and aligned arrival/departure definitions; vehicle duration must not be presented as people duration. | `PFM Matrix!E34:G34`; `Definitions & guardrails!A13:B13` |
| Unit and category exposure | Physical: unit/zone visits and time. Business: tenant, unit, category and boundary mapping. | Business: signage, campaign or event context. | Exposure/category reach requires Physical covered events + Business mapping; it does not prove tenant sales. | `PFM Matrix!E35:G35` |

### Outlet Centre Core

| Core scene | Required | Optional | Derived dependency | Source |
|---|---|---|---|---|
| Destination catchment | Mobile & geo: approved aggregate origin/mobility source, geography and period. | Physical: on-site visits as an asset baseline; Mobile & geo: approved demographic/affinity context; Business: positioning or campaign context. | Destination reach, origin mix and travel-time bands require the approved Mobile & geo origin/mobility source; entrance sensors cannot create origin. | `PFM Matrix!E37:G37`; `Definitions & guardrails!A15:B15` |
| Tourism and origin context | Mobile & geo: approved tourism/mobility/origin source. | Physical: measured arrivals; Business: approved hotel, event or operational context. | Local/regional/destination mix requires the approved Mobile & geo source; arrival measurement may anchor volume but not infer origin. | `PFM Matrix!E38:G38` |
| Vehicle and coach arrival | Physical: vehicle entries/exits and explicitly measured coach events where included. | Business: parking/access layout, tourism and event context. | Arrival rhythm/access share requires Physical events; coach-vs-car Insight additionally requires an agreed classification/definition. | `PFM Matrix!E40:G40`; `Definitions & guardrails!A13:B13` |
| Centre entrances | Physical: entrance IN/OUT events by entrance and time. | Business: opening hours, tourism, event and weather context. | Entrance share and peak demand require the Physical time series; contextual comparisons require the selected optional source. | `PFM Matrix!E41:G41` |
| Visitor composition | Physical: classification-compatible entrance events with the selected classification enabled. | Business: tourism, event and daypart context. | Each displayed classification depends on compatible implementation + enabled/configured/permitted classification. | `PFM Matrix!E42:G42`; `Definitions & guardrails!A9:B9` |
| Circulation | Physical: anonymous trajectories/transitions. Business: street, zone, anchor and brand-area definitions used by the view. | Business: event/operational context. | Route structure, depth and bottlenecks require Physical movement + Business spatial definitions. | `PFM Matrix!E44:G44` |
| Zone exposure and dwell | Physical: zone presence, entries and time. Business: zone, brand-area, anchor and street mapping. | Business: event and campaign context. | Exposure/reach/dwell/hot-cold patterns require Physical zone events + Business spatial definitions. | `PFM Matrix!E45:G45` |
| Brand counting | Physical: brand/store entrance or spatial events within covered boundaries. Business: tenant/brand directory and category/boundary mapping. | Business: trading hours and event context. | Brand visits/share require Physical covered events + Business brand mapping; they do not establish turnover or rent potential. | `PFM Matrix!E46:G46` |
| Brand flow | Physical: supported anonymous matched brand visits/transitions. Business: tenant/brand map and category definitions. | Business: event/campaign context. | Brand cross-visitation/sequences require matching-compatible Physical coverage + Business brand mapping. | `PFM Matrix!E47:G47`; `Definitions & guardrails!A11:B11` |
| Time in destination | Physical: matched entrance/exit events or continuous tracked journeys within supported coverage. | Business: tourism, event and zone context. | Time-in-destination distribution requires a supported matching/continuous method + aligned journey definitions. | `PFM Matrix!E43:G43`; `Definitions & guardrails!A11:B11` |

Business mapping is required only when the advertised Insight refers to named zones, units, brands, categories, anchors or capacity. The same Business source may remain optional for a simpler unnamed physical movement view. [Source: `PFM Matrix!E9:G49`; `AGENTS.md`, “Data layers”]

## All-scene role inventory

These compact tables retain branch coverage and the earlier workbook-to-lens translation. For Core scenes, the explicit Required/Optional/Derived Dependency tables above are authoritative. `R` means required for the matrix's advertised Insight; `C` means conditional context; `—` means not required. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§8.4, 10; `PFM Matrix!E4:G49`; `AGENTS.md`, “Data layers”]

### Retail

| Scene | Priority | Physical | Mobile & geo | Business | Insight | Source |
|---|---|:---:|:---:|:---:|:---:|---|
| Street opportunity | Core | R | — | C | R | `PFM Matrix!E5:G5` |
| Store visits | Core | R | — | C | R | `PFM Matrix!E6:G6` |
| Visitor composition | Core | R | — | C | R | `PFM Matrix!E7:G7` |
| Visit duration | Optional | R | — | C | R | `PFM Matrix!E8:G8` |
| In-store journey | Core | R | — | R | R | `PFM Matrix!E9:G9` |
| Product-category journey | Advanced | R | — | R | R | `PFM Matrix!E10:G10` |
| Zone engagement | Core | R | — | R | R | `PFM Matrix!E11:G11` |
| Staff interaction | Optional | R | — | C | R | `PFM Matrix!E12:G12` |
| Conversion and sales context | Core | R | — | R | R | `PFM Matrix!E13:G13` |
| Portfolio comparison | Optional | R | — | R | R | `PFM Matrix!E14:G14` |

### Shopping Centre

| Scene | Priority | Physical | Mobile & geo | Business | Insight | Source |
|---|---|:---:|:---:|:---:|:---:|---|
| Catchment area | Core | C | R | — | R | `PFM Matrix!E15:G15` |
| Competitive visitation and white spots | Optional | — | R | — | R | `PFM Matrix!E16:G16` |
| Centre entrances | Core | R | — | C | R | `PFM Matrix!E17:G17` |
| Visitor composition | Core | R | — | C | R | `PFM Matrix!E18:G18` |
| Time in centre | Core | R | — | C | R | `PFM Matrix!E19:G19` |
| Internal circulation | Core | R | — | R | R | `PFM Matrix!E20:G20` |
| Zone and anchor exposure | Core | R | — | R | R | `PFM Matrix!E21:G21` |
| Brand counting | Core | R | — | R | R | `PFM Matrix!E22:G22` |
| Brand flow | Core | R | — | R | R | `PFM Matrix!E23:G23` |
| Parking arrival | Optional | R | — | R | R | `PFM Matrix!E24:G24` |
| Parking occupancy | Optional | R | — | R | R | `PFM Matrix!E25:G25` |
| Vehicle origin | Advanced | R | C | — | R | `PFM Matrix!E26:G26` |

### Retail Park

| Scene | Priority | Physical | Mobile & geo | Business | Insight | Source |
|---|---|:---:|:---:|:---:|:---:|---|
| Catchment area | Core | C | R | — | R | `PFM Matrix!E27:G27` |
| Competitive visitation and white spots | Optional | — | R | — | R | `PFM Matrix!E28:G28` |
| Vehicle arrival | Core | R | — | C | R | `PFM Matrix!E29:G29` |
| Parking occupancy | Core | R | — | R | R | `PFM Matrix!E30:G30` |
| Unit visits | Core | R | — | R | R | `PFM Matrix!E31:G31` |
| Visitor composition | Optional | R | — | C | R | `PFM Matrix!E32:G32` |
| Cross-visitation | Core | R | — | R | R | `PFM Matrix!E33:G33` |
| Time on site | Core | R | — | C | R | `PFM Matrix!E34:G34` |
| Unit and category exposure | Core | R | — | R | R | `PFM Matrix!E35:G35` |
| Vehicle origin | Advanced | R | C | — | R | `PFM Matrix!E36:G36` |

### Outlet Centre

| Scene | Priority | Physical | Mobile & geo | Business | Insight | Source |
|---|---|:---:|:---:|:---:|:---:|---|
| Destination catchment | Core | C | R | — | R | `PFM Matrix!E37:G37` |
| Tourism and origin context | Core | C | R | C | R | `PFM Matrix!E38:G38` |
| Competitive destinations and white spots | Optional | — | R | — | R | `PFM Matrix!E39:G39` |
| Vehicle and coach arrival | Core | R | — | C | R | `PFM Matrix!E40:G40` |
| Centre entrances | Core | R | — | C | R | `PFM Matrix!E41:G41` |
| Visitor composition | Core | R | — | C | R | `PFM Matrix!E42:G42` |
| Time in destination | Core | R | — | C | R | `PFM Matrix!E43:G43` |
| Circulation | Core | R | — | R | R | `PFM Matrix!E44:G44` |
| Zone exposure and dwell | Core | R | — | R | R | `PFM Matrix!E45:G45` |
| Brand counting | Core | R | — | R | R | `PFM Matrix!E46:G46` |
| Brand flow | Core | R | — | R | R | `PFM Matrix!E47:G47` |
| Parking occupancy | Optional | R | — | R | R | `PFM Matrix!E48:G48` |
| Vehicle origin | Optional | R | C | — | R | `PFM Matrix!E49:G49` |

Mobile & geo remains aggregate context. Physical remains the direct location signal. Business includes customer-provided or simulated operational context. Insight is calculated, classified or interpreted from named enabled roles. [Source: `SALES-EXPERIENCE-DIRECTION.md` §10; `Definitions & guardrails!A5:B7`; `AGENTS.md`, “Data layers”]

For catchment scenes, `Physical=C` means on-site measurement may anchor an asset baseline only; it does not measure origin or catchment. Origin, reach and competitive context remain Mobile & geo. Approved tourism/mobility/origin data belongs to Mobile & geo; operational event, hotel or customer-supplied context belongs to Business. [Source: `PFM Matrix!E15:G15`; `PFM Matrix!E27:G27`; `PFM Matrix!E37:G38`; `SALES-EXPERIENCE-DIRECTION.md` §10]

## Truth chain: evidence to action

| Term | Meaning in the experience | Must not imply | Source |
|---|---|---|---|
| Measured | Directly captured physical evidence within configured scope. | Identity, intent, sales or profitability. | `Definitions & guardrails!A5:B5`; `SALES-EXPERIENCE-DIRECTION.md` §10 |
| Connected | Mobile/geo or Business context joined to the physical story. | That contextual data was physically measured by PFM sensors. | `Definitions & guardrails!A6:B6`; `SALES-EXPERIENCE-DIRECTION.md` §10 |
| Derived | A calculation, classification, comparison or interpretation from named source roles. | Causality or an unsupported conclusion. | `Definitions & guardrails!A7:B7`; `AGENTS.md`, “Data layers” |
| Decision | A supported question, choice, test or investigation. | An automated recommendation or guaranteed business result. | `Definitions & guardrails!A8:B8`; `SALES-EXPERIENCE-DIRECTION.md` §23 |
| Outcome | A later real-world effect that may be evaluated after action. It is not produced or proven by the sales experience. | ROI, uplift, revenue, rent potential, profitability or customer success without approved evidence. | User task requirement (2026-08-14), “Truth and UX rules”; `AGENTS.md`, “Truth rules” |

## Cross-segment truth and availability gates

These gates apply before any scene is presenter-visible:

1. Label measured, connected and derived content distinctly. [Source: `Definitions & guardrails!A5:B8`; `AGENTS.md`, “Data layers”]
2. Do not show a derived result without all named required source layers. [Source: `AGENTS.md`, “Data layers”]
3. Treat catchment, mobility, demographics, competitive visitation and white spots as connected/derived context, not direct entrance measurement. [Source: `Definitions & guardrails!A15:B15`; `Technology library!A11:G11`]
4. Keep people, vehicles, entries, visits and unique visitors distinct; never equate one vehicle with one visitor. [Source: `Definitions & guardrails!A5:B5`; `Definitions & guardrails!A13:B14`]
5. Present customer value as a supported decision or investigation, not as a guaranteed result. [Source: `Definitions & guardrails!A8:B8`; `AGENTS.md`, “Truth rules”]
6. Use fictional customer data only in the go-demo and identify illustrative values. [Source: `AGENTS.md`, “Truth rules”]
7. Traffic is opportunity, not sales; transactions are Connected Business data, not a proxy for footfall. [Source: `SALES-EXPERIENCE-DIRECTION.md` §14.1; `Definitions & guardrails!A10:B10`]
8. Centre or unit footfall does not establish tenant conversion or tenant performance without compatible tenant business data. [Source: `SALES-EXPERIENCE-DIRECTION.md` §14.2; `PFM Matrix!E22:I23`]
9. Parking arrivals, parked vehicles and people visits are different measures. [Source: `Definitions & guardrails!A13:B13`; `SALES-EXPERIENCE-DIRECTION.md` §14.3]
10. Movement alone does not prove revenue, profitability, rent potential, centre ranking or commercial causality. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§10, 14.4; user task requirement (2026-08-14), “Truth and UX rules”]
11. Technology explains how evidence is produced; it does not cause a commercial improvement. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§1, 11, 24; user task requirement (2026-08-14), “Truth and UX rules”]

## Open questions before any non-Retail implementation

The matrix supplies product architecture but does not override the repository’s Retail-only implementation scope. Product-lead approval is required before treating Shopping Centre, Retail Park or Outlet Centre as a complete demo vertical. [Source: `AGENTS.md`, “Current objective”; `AGENTS.md`, “Canonical journey”]

The matrix also leaves several visuals in `planned` status and every proof asset in `placeholder` status. Those statuses must be honoured; planned visuals and placeholder proof cannot be represented as production-ready or approved assets. [Source: `PFM Matrix!M8:O49`; `Visual & proof registry!A2:G34`]
