# Case and Proof Model

## Purpose and source basis

This document translates the approved sales direction and matrix registry into a reusable proof-asset and interaction model. Cases, videos and other proof assets remain contextual progressive disclosure, not a separate primary journey. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§7.4, 13, 18; `PFM_Segment_Insight_Matrix_v1_1.xlsx`, `PFM Matrix!A3:P3`; `Definitions & guardrails!A23:B23`; `Visual & proof registry!A1:G34`]

The requested hyphenated workbook filename is absent; the repository’s same-titled underscore-normalised `docs/product/PFM_Segment_Insight_Matrix_v1_1.xlsx` is the source used. No customer case, logo, video, result or performance claim is added.

User task requirement (2026-08-14): the current approved request, cited below by numbered section.

User-approved product input (2026-08-14): the follow-up dependency-readiness requirement used to distinguish architecture readiness from missing proof content.

## Conflict assessment

There is no approved proof content in the matrix: every `CASE-*` registry entry is explicitly `Placeholder`, with the note “Add approved video/case when available”. [Source: `Visual & proof registry!A22:G34`]

**Model decision:** placeholder proof assets are non-playable and non-claimable. They may reserve a contextual attachment point, but the presenter must not imply that a case, video or customer result exists. This applies the repository prohibition on invented cases, claims and unapproved customer identities. [Source: `Visual & proof registry!A2:G2`; `Visual & proof registry!E22:G34`; `AGENTS.md`, “Truth rules”]

The registry statuses `Available reference` and `Active visual direction` apply to visual directions, not proof assets, and do not provide a file path, provenance or approval record. They must not be reinterpreted as approved case proof. Seventeen additional visual IDs are marked planned in scene rows but have no registry entry. [Source: `Visual & proof registry!A5:G21`; `PFM Matrix!M8:M49`; `../../AGENTS.md`, “Traceability”]

## Placement model

| Rule | Required behaviour | Source |
|---|---|---|
| Scene-owned | Every proof attachment is reached from one of its registry-linked scenes. | `Visual & proof registry!F22:F34`; `PFM Matrix!O5:O49` |
| Contextual | The asset supports the current question; it does not become a primary journey stage. | `PFM Matrix!A3:P3`; `Definitions & guardrails!A23:B23` |
| Returnable | Closing proof returns to the originating scene and preserves the next canonical CTA. | **Model decision** from `PFM Matrix!O4:P49` and the fixed journey in `AGENTS.md`, “Canonical journey” |
| Status-gated | `Placeholder` means the attachment structure exists but no approved asset is assigned. | `Definitions & guardrails!A23:B23`; `Visual & proof registry!E22:G34` |
| Claim-safe | Proof may not introduce invented accuracy, ROI, uplift, payback, benchmarks, results, customers or logos. | `AGENTS.md`, “Truth rules” |
| Segment-scoped | A proof asset is offered only to its registered segment and linked scenes. | `Visual & proof registry!C22:F34` |

Cases or videos may be opened from Context, Measure, Understand or Prove scenes when linked, but they do not replace Prove, Configure or Act. The presenter resumes the originating route after closing the asset. [Source: `PFM Matrix!J5:O49`; `Journey architecture!A4:F28`; `Definitions & guardrails!A23:B23`; `SALES-EXPERIENCE-DIRECTION.md` §13]

## `See it in practice` interaction

1. A scene may expose `See it in practice` only when it references a proof ID.
2. The action is secondary to the scene's main CTA and does not advance the journey.
3. Opening proof retains the originating scene, commercial question, selected data lenses and next CTA.
4. The first proof view shows only title, format, challenge, measurement approach, customer learning, approval/permission state and the approved media or placeholder treatment.
5. Closing proof returns directly to the originating scene; proof must not open another mandatory navigation chain.
6. In Presentation Mode, suppress placeholder, internal-only or permission-unknown proof. In Sales Mode, a placeholder may appear as an unavailable internal fixture but must not offer playback or customer attribution.

[Source: `SALES-EXPERIENCE-DIRECTION.md` §§7.4, 13, 18; `PFM Matrix!O5:P49`; `Visual & proof registry!E22:G34`]

## Source-backed proof object

The matrix supplies exactly these proof fields:

| Field | Meaning | Source |
|---|---|---|
| ID | Stable `CASE-*` identifier. | `Visual & proof registry!A4:A34` |
| Type | `Case / proof`. The matrix does not distinguish case from video as a separate type. | `Visual & proof registry!B4:B34` |
| Segment | Segment in which the proof can be surfaced. | `Visual & proof registry!C4:C34` |
| Name/theme | Subject the proof is intended to support. | `Visual & proof registry!D4:D34` |
| Status | Current availability state; all current values are `Placeholder`. | `Visual & proof registry!E22:E34` |
| Used by scenes | Contextual scene reachability. | `Visual & proof registry!F22:F34` |
| Notes | Current assignment note; all require approved video/case content. | `Visual & proof registry!G22:G34` |

The matrix provides no URI, media type, duration, customer identity, approval record, permission scope, thumbnail, transcript, claim text or expiry field. The reusable schema below reserves those fields but requires them to remain null or explicitly unknown until sourced. [Source: `Visual & proof registry!A4:G34`; `SALES-EXPERIENCE-DIRECTION.md` §13; user task requirement (2026-08-14) §3; `AGENTS.md`, “Traceability”]

## Reusable proof asset contract

Conceptual contract version: `proof-asset.v1`. This is product architecture, not an application type implementation. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§13, 21; user task requirement (2026-08-14) §3]

| Field | Requirement | Meaning and constraints | Placeholder value | Source |
|---|---|---|---|---|
| `schema_version` | Required | Fixed contract identifier `proof-asset.v1`. | `proof-asset.v1` | Architecture decision from `SALES-EXPERIENCE-DIRECTION.md` §21 |
| `id` | Required | Stable `CASE-*` identifier. | Existing matrix ID | `Visual & proof registry!A22:A34` |
| `title` | Required | Approved display title; may use the registry theme internally until approved. | Registry name/theme with placeholder label | `Visual & proof registry!D22:D34` |
| `segment` | Required | One registered segment. | Registry segment | `Visual & proof registry!C22:C34` |
| `related_scene_ids` | Required | Scene IDs/names from which proof may open. | Registry `Used by scenes` mapping | `Visual & proof registry!F22:F34`; `PFM Matrix!O5:O49` |
| `capability_tags` | Required | Source-backed capability or measurement tags; never inferred outcomes. | Empty until normalised from approved scene mappings | `SALES-EXPERIENCE-DIRECTION.md` §13 |
| `format` | Required when approved | `video`, `case_summary`, `image`, `document` or another explicitly approved format. | `null` | User task requirement (2026-08-14) §3; `SALES-EXPERIENCE-DIRECTION.md` §13 |
| `video_duration_seconds` | Conditional | Positive duration only when `format=video`. | `null` | User task requirement (2026-08-14) §3 |
| `media_reference` | Required when playable/viewable | Approved repository or external reference; never a guessed path. | `null` | `../../AGENTS.md`, “Traceability” |
| `thumbnail_reference` | Optional | Approved thumbnail and source; never generated from confidential media without approval. | `null` | User task requirement (2026-08-14) §3; `../../AGENTS.md`, “Confidential Inputs” |
| `alt_text` | Required when media exists | Concise accessible description of the approved proof visual. | `null` | `SALES-EXPERIENCE-DIRECTION.md` §27, “Accessibility test” |
| `transcript_or_caption_reference` | Required for approved video | Accessible transcript/caption source. | `null` | `SALES-EXPERIENCE-DIRECTION.md` §27, “Accessibility test” |
| `challenge` | Required when approved | Source-backed customer or fictional-fixture question; no confidential raw excerpt. | `null` | `SALES-EXPERIENCE-DIRECTION.md` §13 |
| `measurement_approach` | Required when approved | What was measured and connected, using Measured/Connected/Derived labels and named source roles. | `null` | `SALES-EXPERIENCE-DIRECTION.md` §§10, 13 |
| `customer_learning` | Required when approved | What the evidence helped the customer understand; not an Outcome or causality claim. | `null` | `SALES-EXPERIENCE-DIRECTION.md` §13; `Definitions & guardrails!A8:B8` |
| `approval_status` | Required | `placeholder`, `pending_review`, `approved` or `retired`. | `placeholder` | Architecture decision from user task requirement (2026-08-14) §3 and `Visual & proof registry!E22:E34` |
| `external_use_permission` | Required | `unknown`, `internal_only` or `approved_external`. | `unknown` | Architecture decision from user task requirement (2026-08-14) §3 and `AGENTS.md`, “Truth rules” |
| `approval_reference` | Required when approved | Precise approval record, owner and date/source locator. | `null` | `../../AGENTS.md`, “Traceability” |
| `source_reference` | Required when approved | Precise source for the asset and every factual claim. | Registry cell locator only; no customer evidence yet | `../../AGENTS.md`, “Traceability” |
| `claim_references` | Conditional | Claim-by-claim sources, definitions, area and period. Empty means no result claims may appear. | Empty | `AGENTS.md`, “Truth rules” |
| `illustrative` | Required | `true` for fictional or demo fixtures; approved real proof must carry its documented classification. | `true` | `AGENTS.md`, “Truth rules” |

Schema fields do not establish that content exists. A placeholder remains non-playable and non-claimable even though its object is structurally complete. [Source: `Definitions & guardrails!A23:B23`; `Visual & proof registry!E22:G34`]

## Proof registry and contextual reachability

### Retail Chain

| ID | Theme | Status | Reachable from | Journey coverage | Source |
|---|---|---|---|---|---|
| `CASE-RET-01` | Capture and conversion proof | Placeholder | Street opportunity; Store visits; Visitor composition; Conversion and sales context | Context, Measure, Prove | `Visual & proof registry!A22:G22`; `PFM Matrix!A5:P7`; `PFM Matrix!A13:P13` |
| `CASE-RET-02` | In-store behaviour proof | Placeholder | Visit duration; In-store journey; Product-category journey; Zone engagement; Staff interaction | Understand, Prove | `Visual & proof registry!A23:G23`; `PFM Matrix!A8:P12` |
| `CASE-RET-03` | Portfolio performance proof | Placeholder | Portfolio comparison | Prove | `Visual & proof registry!A24:G24`; `PFM Matrix!A14:P14` |

### Shopping Centre

| ID | Theme | Status | Reachable from | Journey coverage | Source |
|---|---|---|---|---|---|
| `CASE-SC-01` | Catchment and destination proof | Placeholder | Catchment area; Competitive visitation and white spots; Vehicle origin | Context | `Visual & proof registry!A25:G25`; `PFM Matrix!A15:P16`; `PFM Matrix!A26:P26` |
| `CASE-SC-02` | Centre circulation proof | Placeholder | Centre entrances; Visitor composition; Time in centre; Internal circulation; Zone and anchor exposure | Measure, Understand | `Visual & proof registry!A26:G26`; `PFM Matrix!A17:P21` |
| `CASE-SC-03` | Brand flow proof | Placeholder | Brand counting; Brand flow | Understand | `Visual & proof registry!A27:G27`; `PFM Matrix!A22:P23` |
| `CASE-SC-04` | Arrival and parking proof | Placeholder | Parking arrival; Parking occupancy | Measure, Understand | `Visual & proof registry!A28:G28`; `PFM Matrix!A24:P25` |

### Retail Park

| ID | Theme | Status | Reachable from | Journey coverage | Source |
|---|---|---|---|---|---|
| `CASE-RP-01` | Catchment and competition proof | Placeholder | Catchment area; Competitive visitation and white spots; Vehicle origin | Context | `Visual & proof registry!A29:G29`; `PFM Matrix!A27:P28`; `PFM Matrix!A36:P36` |
| `CASE-RP-02` | Arrival and parking proof | Placeholder | Vehicle arrival; Parking occupancy; Unit visits | Measure | `Visual & proof registry!A30:G30`; `PFM Matrix!A29:P31` |
| `CASE-RP-03` | Cross-visitation proof | Placeholder | Visitor composition; Cross-visitation; Time on site; Unit and category exposure | Measure, Understand | `Visual & proof registry!A31:G31`; `PFM Matrix!A32:P35` |

### Outlet Centre

| ID | Theme | Status | Reachable from | Journey coverage | Source |
|---|---|---|---|---|---|
| `CASE-OUT-01` | Destination reach proof | Placeholder | Destination catchment; Tourism and origin context; Competitive destinations and white spots; Vehicle origin | Context | `Visual & proof registry!A32:G32`; `PFM Matrix!A37:P39`; `PFM Matrix!A49:P49` |
| `CASE-OUT-02` | Arrival and operations proof | Placeholder | Vehicle and coach arrival; Centre entrances; Parking occupancy | Measure | `Visual & proof registry!A33:G33`; `PFM Matrix!A40:P41`; `PFM Matrix!A48:P48` |
| `CASE-OUT-03` | Circulation and brand flow proof | Placeholder | Visitor composition; Time in destination; Circulation; Zone exposure and dwell; Brand counting; Brand flow | Measure, Understand | `Visual & proof registry!A34:G34`; `PFM Matrix!A42:P47` |

### QSR / Drive-Thru

QSR is `architecture_only` and its proof registry uses `proof-qsr-*` IDs rather than the matrix `CASE-*` convention, because these placeholders originate from the QSR specification rather than the Segment Insight Matrix. Every entry is a structural placeholder: no format, no media, no challenge, no measurement approach, no customer learning, no external-use approval and not playable. No customer names or logos are recorded. [Source: `PFM_QSR_Commercial_Experience_Agent_Spec.md` §20]

| ID | Theme | Status | Reachable from | Related capability | Journey coverage |
|---|---|---|---|---|---|
| `proof-qsr-queue-performance` | Queue performance proof | Placeholder | `qsr-queue` | `TECH-QSR-01`, `TECH-QSR-02` | Measure |
| `proof-qsr-communication` | Order-point communication proof | Placeholder | `qsr-order` | `TECH-QSR-03` | Measure |
| `proof-qsr-bottleneck` | Bottleneck diagnosis proof | Placeholder | `qsr-bottleneck` | `TECH-QSR-02` | Understand |
| `proof-qsr-closed-loop-response` | Closed-loop response proof | Placeholder | `qsr-respond` | `TECH-QSR-06` | Understand |
| `proof-qsr-estate-performance` | Estate performance proof | Placeholder | `qsr-estate` | `TECH-QSR-07` | Prove |
| `proof-qsr-improvement` | Operational improvement proof | Placeholder | `qsr-improvement-proof` | `TECH-QSR-07` | Prove |

QSR-specific proof truth gate: vendor marketing claims (deployment country counts, daily order volumes, tier-specific feature availability, additional-space counts) are vendor statements. They must remain source-qualified and validation-aware and must never be promoted into a PFM outcome claim. No accuracy, revenue uplift, throughput improvement, order-accuracy improvement, ROI or queue reduction may be stated without an approved proof source. [Source: `PFM_QSR_Commercial_Experience_Agent_Spec.md` §§19-20, 23 Rule 7]

## Presenter behaviour by status

The matrix defines only `Placeholder`; the wider lifecycle below is an architecture decision required to model future review safely.

| Status | Presenter-visible behaviour | Source |
|---|---|---|
| Placeholder | Do not offer playback, customer attribution or proof claims. Preserve the scene link as an internal future attachment point only. | `Definitions & guardrails!A23:B23`; `Visual & proof registry!E22:G34` |
| Pending review | Internal review only; not available in Presentation Mode and not externally shareable. | Architecture decision from user task requirement (2026-08-14) §3 and `AGENTS.md`, “Truth rules” |
| Approved | May appear only within its `external_use_permission`, registered segment/scenes and sourced claim scope. | Architecture decision from user task requirement (2026-08-14) §3; `../../AGENTS.md`, “Traceability” |
| Retired | Do not surface; retain source and retirement reference for auditability. | Architecture decision from `../../AGENTS.md`, “Traceability” |

An asset must not be treated as available merely because its ID exists or its approval status is `approved`; audience permission must also allow the current use. [Source: `Visual & proof registry!A2:G2`; user task requirement (2026-08-14) §3; `AGENTS.md`, “Truth rules”]

## Proof-content truth gate

Before a placeholder can become presenter-visible, the missing source package must establish at least:

1. that the asset is approved for this use;
2. that any customer name or logo is approved;
3. that every stated result or claim has a precise source and does not overstate causality;
4. that the asset’s intended segment and linked scenes match the registry; and
5. that external-use permission allows the intended audience; and
6. that opening and closing it preserves the canonical journey.

Items 1–3 and 5 are governing truth and traceability requirements; items 4 and 6 preserve the matrix’s contextual scene mapping. This list is an activation gate, not evidence that any current asset exists. [Source: `AGENTS.md`, “Truth rules”; `../../AGENTS.md`, “Traceability”; `Visual & proof registry!A22:G34`; `PFM Matrix!O5:P49`; user task requirement (2026-08-14) §3]

## Current proof readiness

Current approved, playable or claimable proof assets: **none**. Current structural placeholders: **19** — **13** from the matrix (`CASE-RET-01`–`03`, `CASE-SC-01`–`04`, `CASE-RP-01`–`03`, `CASE-OUT-01`–`03`) plus **6** QSR placeholders (`proof-qsr-*`). [Source: `Visual & proof registry!A22:G34`; `PFM_QSR_Commercial_Experience_Agent_Spec.md` §20]

Videos are not separately enumerated. A future video may fulfil a placeholder only after an approved source assigns it; no video ID, customer case or claim should be inferred from the placeholder name. [Source: `Definitions & guardrails!A23:B23`; `Visual & proof registry!A22:G34`]

## Architecture readiness versus content readiness

| Readiness dimension | Current state | Typed-content treatment | Implementation consequence | Source |
|---|---|---|---|---|
| Proof object schema | `ARCHITECTURE READY` | The `proof-asset.v1` shape, scene reachability, status gate and return behaviour are safe to encode. | Does not block the typed content model. | This document, “Reusable proof asset contract”; `Visual & proof registry!A22:G34` |
| Scene attachment points | `ARCHITECTURE READY` | Preserve the 13 stable `CASE-*` IDs and linked scenes. | Does not block scene or relationship types. | `PFM Matrix!O5:O49`; `Visual & proof registry!F22:F34` |
| Case/video media | `CONTENT MISSING` | Keep `media_reference`, format, duration, thumbnail and transcript/caption null. | Implement only a non-playable placeholder/internal unavailable state. | `Visual & proof registry!E22:G34` |
| Customer challenge, learning and claims | `CONTENT MISSING` | Keep all customer attribution, learning and claim fields null until approved and sourced. | Do not expose as customer proof. | `AGENTS.md`, “Truth rules”; `../../AGENTS.md`, “Traceability” |
| External-use permission | `CONTENT MISSING` | Default to `unknown`; suppress in Presentation Mode. | Requires approval before activation, not before schema creation. | This document, “See it in practice interaction” and “Presenter behaviour by status” |

`CONTENT MISSING` is not `BLOCKED` for application architecture. It blocks playback, customer attribution and proof claims only. [Source: user-approved product input (2026-08-14), §§8–9]
