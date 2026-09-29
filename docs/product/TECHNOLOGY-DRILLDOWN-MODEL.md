# Technology Drilldown Model

## Purpose and source basis

This document translates the approved insight-first sales direction, the PFM Segment Insight Matrix v1.1 and the current approved PFM product input into reusable technology-drilldown architecture. It separates the measurement capability from the implementation that may deliver it. It is a content and interaction model, not an application, pricing or automatic product-selection specification. [Source: `SALES-EXPERIENCE-DIRECTION.md` §§1–5, 11–12, 22; `PFM_Segment_Insight_Matrix_v1_1.xlsx`, `Technology library!A1:G12`; `PFM Matrix!A1:P49`; user-approved product input (2026-08-14), §§1–6]

The source workbook requested under a hyphenated filename is absent; the repository’s same-titled underscore-normalised `docs/product/PFM_Segment_Insight_Matrix_v1_1.xlsx` is used. Vendor and product names appear only where the current approved input explicitly assigns them as implementation options. No specification, accuracy figure, privacy mechanism or capability is inferred from a product name.

User-approved product input (2026-08-14): the current approved request, cited below by numbered section.

## Conflict and ambiguity assessment

No technology-order conflict exists with AGENTS.md. The matrix explicitly requires progressive disclosure and separates direct measurement, connected context and derived insight. [Source: `Technology library!A2:G2`; `Definitions & guardrails!A5:B8`; `AGENTS.md`, “Data layers”]

The approved direction defines three conceptual depths—Solution story, How we measure and Technical detail—while the approved architecture uses five operational disclosure steps. These are compatible when the five steps are nested inside the three depths; they are not five new primary journeys. [Source: `SALES-EXPERIENCE-DIRECTION.md` §5; user-approved product input (2026-08-14), “Important product model”]

The scene mapping uses several labels that differ from the canonical Technology library names:

| Scene-label form | Canonical-ID handling | Source |
|---|---|---|
| `TECH-02 People measurement` | Keep ID `TECH-02`; display canonical module name `Entrance measurement`; retain the scene qualifier when explaining scope. | `PFM Matrix!N24`; `PFM Matrix!N35`; `Technology library!A6:B6` |
| `TECH-04 Spatial movement` or `Spatial tracking` | Keep ID `TECH-04`; display canonical module name `Spatial movement intelligence`; retain the method qualifier. | `PFM Matrix!N8:N12`; `PFM Matrix!N34:N35`; `Technology library!A8:B8` |
| `TECH-08 Business/data mapping` or `Staff context` | Keep ID `TECH-08`; treat the trailing phrase as scene context, not a new module. | `PFM Matrix!N10`; `PFM Matrix!N12`; `Technology library!A12:B12` |
| `TECH-07 lawful origin context` | Keep ID `TECH-07`; preserve `lawful` as a binding guardrail, not a new module. | `PFM Matrix!N26`; `PFM Matrix!N36`; `PFM Matrix!N49`; `Technology library!A11:F11` |
| `TECH-06/04 depending scope` | Ambiguous shorthand for `TECH-06` or `TECH-04` depending on scope. Do not select one without the configured measurement design. | `PFM Matrix!N34`; `Technology library!A8:G10` |
| `approved tourism/origin data` | External approved data qualifier; no separate technology ID is defined. | `PFM Matrix!N38`; `Technology library!A11:G11` |

**Model decision:** stable IDs resolve to the canonical library modules; scene-specific suffixes remain binding qualifiers. The shorthand at `N34` remains explicitly scope-dependent rather than being silently normalised to a single method.

The matrix names technology methods but does not provide a hardware catalogue or device-level detail schema. **Model decision:** approved implementation names may appear at the implementation layer, but optional technical detail stops at the strongest mapped source. Product names never authorise invented specifications. [Source: `Technology library!A2:G12`; `AGENTS.md`, “Truth rules”; user-approved product input (2026-08-14), §§1–3]

The adjacent legacy Digital Quote Builder configuration describes its `Basic 3D` entrance option as Xovis, while the current approved product input assigns `Milesight VS125-P` to the Basic 3D role. The same legacy catalogue contains inconsistent LiDAR/Xovis template labels. **Decision:** the current approved input governs this Commercial Experience; the legacy configuration is reference-only and cannot establish product capability, specification, pricing or selection logic here. [Source: user-approved product input (2026-08-14), §1; `../digital-quote-builder/pricing-config.js`, `technologyIds.ENTRANCE_3D_BASIC`, `odooTemplateCatalog.retailChain.capex.tpl_rc_instore_lidar`, `tpl_rc_instore_3d`; `AGENTS.md`, “Source-of-truth order”; `docs/decisions/DECISION-LOG.md`, “2026-08-14 — capability-first technology architecture”]

No approved vendor datasheet for Xovis, Milesight, Isarsoft, LiDAR or vehicle/parking implementations is committed in the repository source bundle. Confidential local PFM material does, however, partially support an Xovis/3D explanation and one customer-specific LiDAR implementation. Those sources are mapped below through sanitised IDs and page locators; the raw confidential files remain local and are not committed. No equivalent local product source was found for Milesight, Isarsoft or a named vehicle/parking supplier. [Source: project source inventory performed 2026-08-14; `../../../../03-shared/pfm-products.md`; user-approved product input (2026-08-14), §§1–3]

### Sanitised local source register

| Source ID | Source class | Safe locator | What it may support | What it must not establish |
|---|---|---|---|---|
| `PFM-XOVIS-INTRO` | Confidential internal PFM/Storescan presentation | pp. 3–5 | Xovis PC-series 3D/stereo positioning; IN/OUT context; an internal statement that no recordings are made; four privacy filters described for live audit. | Published accuracy, universal classification, legal compliance, exact model behaviour or applicability to every Xovis deployment. |
| `PFM-RETAIL-3D` | Confidential internal PFM retail presentation | pp. 10–12 | A presented stereo-vision setup with on-device analytics, anonymised count output, no image storage and PoE/network positioning above an entrance. | “Full GDPR” or other legal assurance; a definitive Xovis model mapping; published accuracy; universal plugin/classification support; generic specifications. |
| `PFM-XOVIS-PC2-DRAWING` | Confidential Xovis customer drawing | p. 1 | PC2-family article references and drawing dimensions for that drawing only. | Counting, privacy, coverage, accuracy or compatibility claims. |
| `PFM-LIDAR-FDS` | Confidential customer-specific PFM functional design specification | pp. 4–7 | One multi-sensor LiDAR deployment with processing unit, PoE/network topology and installation planning. | Generic LiDAR specifications, universal topology, privacy mechanics, supplier compatibility or suitability for every spatial use case. |

These source IDs support internal traceability only. Customer-facing activation still depends on product validation, approval for external use and an exact implementation match. [Source: `../../AGENTS.md`, “Confidential Inputs” and “Traceability”; project source review performed 2026-08-14]

## Capability and implementation boundary

| Layer | Meaning | Stable identity | Must not contain | Source |
|---|---|---|---|---|
| Capability | What PFM needs to measure or connect to answer a question. | Reusable `TECH-*` module ID. | Supplier preference, device price or an assumption that one product is mandatory. | `SALES-EXPERIENCE-DIRECTION.md` §§11, 21–22; `Technology library!A4:G12` |
| Implementation option | A technology, product or existing infrastructure route that may deliver some or all of the capability. | Implementation record scoped beneath a capability. | An implication that all implementations produce identical outputs, coverage or quality. | User-approved product input (2026-08-14), §§1, 6 |
| Implementation tier/role | Commercial or delivery position such as Premium, Basic, Existing infrastructure or Advanced spatial intelligence. | Attribute of an implementation option, never of the capability itself. | Pricing, automatic recommendation or guaranteed suitability. | User-approved product input (2026-08-14), §§1, 4 |
| Source status | Strength and type of evidence supporting the implementation record. | One controlled status below. | A claim stronger than its underlying source. | `../../AGENTS.md`, “Traceability”; user-approved product input (2026-08-14), §2 |

Controlled source statuses:

- `SOURCE-BACKED`: directly supported by a current project source with a precise locator.
- `PARTIALLY SOURCE-BACKED`: part is sourced, but material product, privacy or implementation detail is still missing.
- `USER-APPROVED PRODUCT INPUT`: explicitly approved in the current request, but not yet backed by a local product document.
- `ARCHITECTURE-ONLY`: required structural model with no claim that an implementation exists.
- `REQUIRES PRODUCT VALIDATION`: a factual product or fit decision must be confirmed before use.
- `REQUIRES SOURCE MAPPING`: privacy or technical documentation is known to be needed but is not currently available locally. This is a content dependency, not a statement that the capability is unavailable.

## Mandatory disclosure sequence

Technology is always subordinate to the customer question. The complete commercial sequence is:

`Business question → Insight → Measurement capability → Possible implementation → Optional technical detail`

Within an opened technology drilldown, preserve this explanatory sequence:

`Insight → How we measure this → Measurement method → Technology → Optional technical detail`

| Operational level | Sales-direction depth | Presenter question | Permitted content | Exit condition | Source |
|---|---|---|---|---|---|
| 1. Insight | Level 1 — Solution story | What customer question or decision does this scene support? | Scene question, required data roles, visible evidence, derived interpretation and decision/customer value. | The prospect asks how the evidence is produced. | `PFM Matrix!C4:I49`; `SALES-EXPERIENCE-DIRECTION.md` §§5, 7 |
| 2. How we measure this | Level 2 — How we measure | What is measured directly, what is connected, and what may be derived? | Measurement unit, area, period, definition and named Physical/Mobile & geo/Business/Insight roles. | The prospect asks about the method or trust boundary. | `PFM Matrix!E4:G49`; `SALES-EXPERIENCE-DIRECTION.md` §§10–11 |
| 3. Measurement method | Level 2 — How we measure | How does the method turn source events into an output? | Source-listed method logic, coverage assumptions, processing step and data output, without device specifications. | The prospect asks which technology class enables the method. | `Technology library!C4:E12`; `SALES-EXPERIENCE-DIRECTION.md` §11 |
| 4. Technology | Level 2, with a bridge to Level 3 | Which implementation options could deliver this capability? | Source-gated implementation options, role/tier, scope qualifier, privacy status and `Explore privacy` action. | The prospect asks for implementation detail. | `Technology library!D4:F12`; `SALES-EXPERIENCE-DIRECTION.md` §§11–12; user-approved product input (2026-08-14), §§1–4 |
| 5. Optional technical detail | Level 3 — Technical detail | What approved implementation detail answers this stakeholder's question? | Approved coverage, positioning, network, power, mounting, output/integration boundary, hardware dimensions or specification. | Return to the originating insight scene. | `SALES-EXPERIENCE-DIRECTION.md` §5; `AGENTS.md`, “Traceability” |

**Model decision:** every drilldown retains its originating scene ID and returns to that scene. Technology is not a parallel primary journey, and opening a drilldown must not advance or reorder the canonical journey. [Source: `PFM Matrix!A3:P3`; `Definitions & guardrails!A22:B22`; `AGENTS.md`, “Canonical journey”]

## Eligibility and provenance gate

Before presenting a derived insight, evaluate its source layers:

1. Identify the scene’s `Measured`, `Connected` and `Derived` fields. [Source: `PFM Matrix!D4:G49`]
2. Confirm each required source layer is enabled and within the configured scope. [Source: `AGENTS.md`, “Data layers”]
3. If a required source is absent, suppress the derived result; do not substitute mobile/geo context for physical sensor measurement. [Source: `AGENTS.md`, “Data layers”; `Technology library!F11`]
4. Keep the measurement unit explicit: people, vehicles, entries, visits and unique visitors are not interchangeable. [Source: `Definitions & guardrails!A5:B5`; `Definitions & guardrails!A13:B14`]
5. State the relevant area, period and definition for a calculated KPI. Capture rate additionally requires aligned passing audience and visits to be visible. [Source: `AGENTS.md`, “Truth rules”; `Technology library!F5:F6`]

## Technology module library

| ID | Module | How-we-measure explanation | Matrix-listed method wording (conditional) | Used for | Truth/privacy guardrail | Presenter CTA | Source |
|---|---|---|---|---|---|---|---|
| `TECH-01` | Outdoor opportunity measurement | How passing movement around a frontage is measured. | Outdoor people counter, radar or approved external movement source depending on scope. | Passers-by, direction, street opportunity. | Passing traffic is not a store visit; keep area, direction, period and alignment explicit. | Show outside measurement | `Technology library!A5:G5` |
| `TECH-02` | Entrance measurement | How anonymous IN/OUT movement is measured at an entrance. | 3D stereoscopic people counting sensor. | Store, centre or unit entries; exits; occupancy inputs. | Direct physical measurement; keep entries, visits and unique visitors distinct. | Show entrance sensing | `Technology library!A6:G6` |
| `TECH-03` | Anonymous visitor classification | How configured anonymous visitor attributes or buying-unit patterns are classified. | 3D sensing with optional classification plugins or configured analytics. | Groups/buying units, adult-child and other permitted estimates. | Optional and estimated; use only where included, permitted and configured. | Show anonymous classification | `Technology library!A7:G7` |
| `TECH-04` | Spatial movement intelligence | How anonymous routes, zones and dwell are measured inside a location. | LiDAR and/or 3D spatial tracking depending on scope. | Routes, zone transitions, dwell, exposure and interactions. | Movement is anonymous; do not imply identity tracking or infer intent from movement alone. | Show spatial measurement | `Technology library!A8:G8` |
| `TECH-05` | Anonymous visit matching | How separate anonymous events may be joined into a visit or journey where coverage supports it. | Anonymous re-identification/journey stitching and/or continuous spatial tracking. | Time in centre, cross-visitation, brand flow and time on site. | Only when measurement design supports matching; never imply personal identification. | Show journey matching | `Technology library!A9:G9` |
| `TECH-06` | Vehicle and parking intelligence | How arrivals, access and parking pressure can be measured. | Vehicle counters, radar/camera, ANPR/LPR where lawful, and bay sensing where configured. | Vehicle arrival, parking occupancy, coach/car patterns. | People, vehicles and visits are different units; ANPR only where legally permitted. | Show vehicle measurement | `Technology library!A10:G10` |
| `TECH-07` | Geo/mobility and GIS | How aggregate location context is added around a physical asset. | Anonymised mobility/geo-location data, GIS, demographics and tourism/origin data. | Catchment, competition, origin and drive-time reach. | Contextual and aggregate; it does not replace direct entrance measurement. | Show location context method | `Technology library!A11:G11` |
| `TECH-08` | Business data connection and analytics | How operational or customer data is joined to movement. | POS, staffing, campaigns, tenant maps, store type, square metres and analytics platform. | Conversion, sales per visitor, staffing context and portfolio comparison. | Connected/customer-provided data; calculated KPIs require aligned definitions and source layers. | Show connected data | `Technology library!A12:G12` |

## Capability-to-implementation map

The module remains stable when its implementation changes. An implementation is selectable only after the question, required capability, connected context and insight level are known.

| Capability module | Capability | Current implementation options | Implementation role/tier | Source status | Selection boundary | Source |
|---|---|---|---|---|---|---|
| `TECH-01` | Measure passing opportunity separately from entrance visits. | Milesight VS361; passive-infrared passer-by measurement. | Outdoor/passers-by implementation options; no commercial tier approved. | `USER-APPROVED PRODUCT INPUT` | Suitability, placement, coverage, output and privacy require source mapping and scope validation. | User-approved product input (2026-08-14), “Passers-by / outdoor opportunity” |
| `TECH-02` | Measure anonymous entrance IN/OUT events. | Xovis 3D sensors; Milesight VS125-P; Isarsoft on compatible Internet Protocol (IP) camera infrastructure. | Premium 3D; Basic 3D; Existing infrastructure. | `USER-APPROVED PRODUCT INPUT` | These are one-to-many options. Isarsoft is IP-camera analytics, not a 3D sensor. Final fit depends on requirements outside the go-demo. | User-approved product input (2026-08-14), “Entrance / visitor counting” |
| `TECH-03` | Classify permitted anonymous visitor attributes separately from counting. | Compatible selected hardware plus enabled software/plugin and configuration. | Optional classification add-on; tier not approved. | `REQUIRES PRODUCT VALIDATION` | Do not inherit classification support from basic counting. Validate each classification, implementation, plugin, configuration and permitted use. | `Technology library!A7:G7`; user-approved product input (2026-08-14), “Visitor classification” |
| `TECH-04` | Measure anonymous routing, zone movement, presence and dwell. | LiDAR-based spatial tracking; Xovis 3D sensor-based in-store tracking. | Advanced spatial intelligence; 3D in-store spatial option. | `PARTIALLY SOURCE-BACKED` | Both may support appropriate in-store uses, but coverage, continuity, output and quality may differ. Neither is the universal default. | `Technology library!A8:G8`; user-approved product input (2026-08-14), “In-store movement / tracking” |
| `TECH-05` | Join supported anonymous events into a visit or journey. | Anonymous visit matching/journey stitching; continuous spatial tracking. | Advanced matching/continuity role; no product tier approved. | `PARTIALLY SOURCE-BACKED` | Product compatibility and privacy framework require validation. Do not assume every entrance or spatial implementation supports matching. | `Technology library!A9:G9`; `Definitions & guardrails!A11:B11` |
| `TECH-06` | Measure vehicle arrivals, parking state or lawful vehicle-origin inputs as distinct sub-capabilities. | Vehicle counters; radar/camera; lawful automatic number-plate recognition/licence-plate recognition (ANPR/LPR); bay sensing. | Method classes only; supplier/tier unassigned. | `PARTIALLY SOURCE-BACKED` | Method classes are sourced; product selection and fit require validation. Do not choose one method for all vehicle arrival, occupancy and origin questions. | `Technology library!A10:G10`; `Definitions & guardrails!A13:B14` |
| `TECH-07` | Connect aggregate geo, mobility and catchment context. | Approved mobility/geo data, geographic information system (GIS), demographics and tourism/origin sources. | Connected contextual intelligence. | `SOURCE-BACKED` | Provider, provenance, permissions, granularity and representativeness must be approved; this never replaces entrance measurement. | `Technology library!A11:G11`; `docs/reference/digital-sales-journey/geolocation-principles.md`, “Capability Boundary” |
| `TECH-08` | Connect business and operational context to movement evidence. | POS, staffing, campaign, enterprise resource planning (ERP), business intelligence (BI), tenant/map and operational data connections. | Connected business context. | `SOURCE-BACKED` | Connector and field mapping remain implementation-specific; these sources are not movement technologies. | `Technology library!A12:G12`; `Definitions & guardrails!A6:B6`; user-approved product input (2026-08-14), “Business data connection” |

## Implementation source registry

The registry records only supported detail. A blank or source-gated field is intentional.

| Capability | Supplier / technology | Product / platform | Role or tier | Source status | Supported functionality | Supported technical detail | Supported privacy statement | Unsupported or unverified claims | Documented constraints and sources |
|---|---|---|---|---|---|---|---|---|---|
| `TECH-02` Entrance measurement | Xovis 3D | PC series described; selected model remains unspecified | Premium 3D | `PARTIALLY SOURCE-BACKED` | An implementation option for entrance/visitor counting; internal material describes 3D stereo sensing and IN/OUT output. | A confidential internal source describes dual-lens 3D/stereo sensing. A separate PC2-family drawing supports dimensions only for the listed drawing variants. | Internal material describes no recordings, four privacy filters, on-device analytics, anonymised counting output and no image storage for the presented setups. Exact model/version applicability and external-use approval remain `REQUIRES PRODUCT VALIDATION`. | Accuracy, “full GDPR”, universal metadata schema, retention/deletion, legal basis, classification/plugin support, re-identification, coverage and applicability to every Xovis product or deployment. | Final implementation varies by scope. Do not merge the presentations and drawing into a synthetic product specification. [Source: user-approved product input (2026-08-14), §§1, 3; `PFM-XOVIS-INTRO`, pp. 3–5; `PFM-RETAIL-3D`, pp. 10–12; `PFM-XOVIS-PC2-DRAWING`, p. 1] |
| `TECH-02` Entrance measurement | Milesight | VS125-P | Basic 3D | `USER-APPROVED PRODUCT INPUT` | An implementation option for entrance/visitor counting. | Product name and Basic 3D role only. | `REQUIRES SOURCE MAPPING`; no Milesight privacy mechanic is stated. | Accuracy, coverage, classification, storage, processing location, metadata, retention, network/power and interchangeability with Xovis. | Compatibility and scope require validation. [Source: user-approved product input (2026-08-14), §§1, 3] |
| `TECH-02` Entrance measurement | Isarsoft analytics | Compatible customer IP-camera infrastructure | Existing infrastructure | `USER-APPROVED PRODUCT INPUT` | Entrance/visitor counting using compatible IP-camera infrastructure. | It is camera analytics and is not a 3D sensor. | `REQUIRES SOURCE MAPPING`; no Isarsoft privacy or video-processing mechanic is stated. | Camera compatibility list, server/cloud/edge topology, video storage, metadata, accuracy, classification, licensing and network requirements. | Requires compatible IP-camera infrastructure and customer-scope validation. [Source: user-approved product input (2026-08-14), §§1, 3] |
| `TECH-01` Outdoor opportunity | Milesight | VS361 | Passer-by measurement option | `USER-APPROVED PRODUCT INPUT` | Passer-by/outdoor opportunity measurement, separate from entrance counting. | Product name and role only. | `REQUIRES SOURCE MAPPING`; no privacy mechanic is stated. | Sensing method, range, directionality, accuracy, environmental limits, placement, power/network and classification. | Cannot be represented as entrance visit measurement. Capture requires a separate aligned entrance measure. Generic outdoor-counter material does not validate VS361. [Source: user-approved product input (2026-08-14), “Passers-by / outdoor opportunity”; `AGENTS.md`, “Truth rules”] |
| `TECH-01` Outdoor opportunity | Passive infrared | Product unspecified | Passer-by measurement method | `USER-APPROVED PRODUCT INPUT` | Passive-infrared-based passer-by measurement. | Method class only. | No product-specific privacy claim; capability principle remains aggregate, non-identifying count evidence. | Product, field geometry, directionality, accuracy, environment, output, power/network and suitability. | Site feasibility and alignment with the entrance measure require validation. [Source: user-approved product input (2026-08-14), “Passers-by / outdoor opportunity”] |
| `TECH-04` Spatial movement | LiDAR-based tracking | Supplier/product unspecified | Advanced spatial intelligence | `PARTIALLY SOURCE-BACKED` | May support routing, zone movement, presence and dwell where the configured coverage and method support them. | One confidential customer-specific FDS documents a multi-sensor deployment, processing unit, PoE/network topology and installation planning; its values and topology are not generic. | Capability-level anonymous-movement principle only; the FDS contains no sufficient implementation privacy evidence, so privacy remains `REQUIRES SOURCE MAPPING`. | Generic supplier/model specifications, universal coverage, continuity, occlusion behaviour, accuracy, identity handling, storage, metadata, topology and equivalence with Xovis 3D. | Do not assume LiDAR is required for every route, dwell or zone use case, and do not reuse customer-specific network details. [Source: `Technology library!A8:G8`; user-approved product input (2026-08-14), “In-store movement / tracking”; `PFM-LIDAR-FDS`, pp. 4–7] |
| `TECH-04` Spatial movement | Xovis 3D | In-store-capable product/model unspecified | 3D in-store spatial option | `PARTIALLY SOURCE-BACKED` | May support in-store measurement where the selected Xovis implementation and coverage support the requested output. | Internal material supports the Xovis 3D/stereo method class; no source establishes universal in-store coverage or continuity. | Reuse the mapped Xovis statements only after exact model and deployment validation; otherwise show `REQUIRES PRODUCT VALIDATION`. | Full-journey continuity, equivalence with LiDAR, coverage, classification, re-identification, accuracy, retention, mounting and network/power for the selected in-store design. | Do not imply every Xovis 3D implementation provides the same full-journey capability as LiDAR. [Source: user-approved product input (2026-08-14), §§1, 3, 6; `PFM-XOVIS-INTRO`, pp. 4–5; `PFM-RETAIL-3D`, p. 11] |
| `TECH-03` Visitor classification | Configured analytics/plugin | Product compatibility unspecified | Optional add-on | `REQUIRES PRODUCT VALIDATION` | Only the classifications explicitly enabled, configured and permitted for a compatible implementation. | None beyond the conditional capability statement. | Anonymous/estimated; not identity recognition. Product-specific processing is `REQUIRES SOURCE MAPPING`. | That every counter supports the same classifications; specific age, gender, adult/child, group or confidence outputs for any named product. | Validate hardware, software/plugin, configuration and permitted use together. [Source: `Technology library!A7:G7`; `Definitions & guardrails!A9:B9`; user-approved product input (2026-08-14), “Visitor classification”] |
| `TECH-05` Anonymous visit matching | Anonymous event matching or continuous spatial tracking | Product unspecified | Advanced matching/continuity | `PARTIALLY SOURCE-BACKED` | Visit duration, cross-visitation or brand flow only when the measurement design supports matched events. | Method classes only. | Never imply personal identification; implementation privacy is `REQUIRES SOURCE MAPPING`. | Product support, matching quality, persistence, identifier mechanics, retention, storage and universal availability. | Coverage and configured privacy framework are mandatory. [Source: `Technology library!A9:G9`; `Definitions & guardrails!A11:B11`] |
| `TECH-06` Vehicle/parking | Vehicle counter or radar/camera | Product unspecified | Vehicle-arrival method | `SOURCE-BACKED` | Vehicle entries/exits and arrival rhythm where configured. | Method classes only. | No product-specific privacy claim. | Supplier, accuracy, classification, storage, plate capture and suitability for occupancy/origin. | Vehicles and people remain different units. [Source: `Technology library!A10:G10`; `Definitions & guardrails!A13:B13`] |
| `TECH-06` Vehicle/parking | Bay sensing or capacity model from entry/exit events | Product unspecified | Parking-occupancy method | `SOURCE-BACKED` | Bay state or occupancy derived from the configured parking setup. | Method classes only. | No product-specific privacy claim. | Supplier, accuracy, turnover logic, space-level coverage and interchangeability with arrival counting. | Capacity, zones and event definitions are required. [Source: `Technology library!A10:G10`; `PFM Matrix!A25:H25`; `PFM Matrix!A30:H30`] |
| `TECH-06` Vehicle/parking | Lawful ANPR/LPR | Product unspecified | Conditional origin/access method | `PARTIALLY SOURCE-BACKED` | Licence-plate/country-code events only where lawful, configured and supported by the jurisdiction/source. | No product detail. | Lawful/configured only; no local home origin from a Dutch plate alone. | Supplier, legal basis, retention, storage, security, local origin, accuracy and jurisdictional availability. | Local geographic origin requires a lawful additional source and product validation. [Source: `Definitions & guardrails!A14:B14`; `Technology library!A10:G10`] |
| `TECH-07` Geo/mobility | Approved external contextual data | Provider/platform unspecified | Connected context | `SOURCE-BACKED` | Aggregate catchment, origin, competition, travel-time or tourism context where the approved source supports it. | Aggregation/provenance questions only. | Aggregate outputs; no individual tracking or personal profile. | Provider, sample, precision, representativeness, contractual rights and substitution for physical measurement. | Validate spatial/temporal fit, permissions and source stability. [Source: `docs/reference/digital-sales-journey/privacy-governance-notes.md`, “Required Guardrails”; `Technology library!A11:G11`] |
| `TECH-08` Business connection | Customer/external business systems | POS, staffing, campaigns, ERP, BI and operational sources | Connected business context | `SOURCE-BACKED` | Joins approved operational/customer data to physical evidence for defined comparisons and calculations. | Field mapping and integration boundary only after contract definition. | Customer/external data remains Connected; access, purpose and retention require the applicable contract and governance. | Live connector availability, direct browser access, automatic recommendation, pricing and movement measurement. | Browser-to-Odoo/SharePoint communication remains prohibited. [Source: `Technology library!A12:G12`; `AGENTS.md`, “Integration boundaries”; user-approved product input (2026-08-14), “Business data connection”] |

**Architecture decision:** retain `PRIVACY-DATA` as an architecture-only, cross-cutting explanation module to satisfy the direction's contextual privacy requirement and the two-level privacy model. It has no matrix technology ID and must not be represented as a new measurement capability. [Source: `SALES-EXPERIENCE-DIRECTION.md` §12; user-approved product input (2026-08-14), §3]

## Reusable module evidence contracts

In these contracts, `Directly measured` maps to the Physical lens, `Connected` must be classified as Mobile & geo or Business by source, and `May be derived` maps to Insight. The scene-level R/C gating table in `SEGMENT-STORY-ARCHITECTURE.md` is the canonical dependency map. [Source: `SALES-EXPERIENCE-DIRECTION.md` §10; `Definitions & guardrails!A5:B7`; `PFM Matrix!E4:G49`]

| Module | Purpose | Supporting scenes/capabilities | Directly measured | Connected | May be derived | Source |
|---|---|---|---|---|---|---|
| `TECH-01` Outdoor opportunity | Explain passing opportunity around a frontage and its alignment with an entrance. | Street opportunity; capture context. | Passing movement, direction and time where a physical outdoor counter is in scope. | Approved external movement source and street/store context where used. | Passing patterns and capture rate only when aligned passing audience and visits are visible. | `Technology library!A5:F5`; `PFM Matrix!E5:H5` |
| `TECH-02` Entrance measurement | Establish trusted anonymous IN/OUT evidence at a threshold. | Store visits; centre entrances; unit visits; brand counting; occupancy inputs. | Entries and exits by entrance and time. | Opening hours, store/tenant definitions and event context where relevant. | Visit rhythm, entrance share and occupancy inputs; visits or unique visitors only with compatible definitions. | `Technology library!A6:F6`; `PFM Matrix!E6:H6`; `PFM Matrix!E17:H17` |
| `TECH-03` Anonymous visitor classification | Explain configured anonymous visitor or buying-unit estimates. | Visitor composition across Retail and property segments. | Visit events used by configured classification. | Campaign, event, format or daypart context where available. | Group/buying-unit, adult-child and other permitted estimates. | `Technology library!A7:F7`; `PFM Matrix!E7:H7`; `Definitions & guardrails!A9:B9` |
| `TECH-04` Spatial movement intelligence | Explain anonymous routes, zones, transitions, dwell and exposure. | In-store journey; circulation; zone/anchor/category exposure; some unit/brand counting. | Anonymous trajectories, zone events, transitions, presence and time. | Floorplan, zone, tenant, category, anchor and event definitions. | Routes, flow, dwell, exposure, reach, bottlenecks and hot/cold patterns. | `Technology library!A8:F8`; `PFM Matrix!E9:H11`; `PFM Matrix!E20:H21` |
| `TECH-05` Anonymous visit matching | Explain when separate anonymous events may form a visit or journey. | Visit duration; time in centre/destination; cross-visitation; brand flow; time on site. | Anonymous events within supported coverage. | Entrance, unit, brand, zone and time definitions. | Matched visit duration, cross-visitation, sequences and time on site. | `Technology library!A9:F9`; `Definitions & guardrails!A11:B11`; `PFM Matrix!E19:H19` |
| `TECH-06` Vehicle and parking intelligence | Explain vehicle arrival, access and parking pressure without equating vehicles to people. | Vehicle/coach arrival; parking arrival/occupancy; lawful vehicle-origin context. | Vehicle entries/exits, coach events or bay status where configured. | Capacity, parking/access layout, operating rules, events and lawful origin source where applicable. | Arrival rhythm, occupancy/utilisation, pressure and limited lawful origin context. | `Technology library!A10:F10`; `Definitions & guardrails!A13:B14`; `PFM Matrix!E24:H26` |
| `TECH-07` Geo/mobility and GIS | Explain aggregate context around a physical asset. | Catchment, origin, competition, white spots, drive-time and tourism context. | No substitute entrance measurement; on-site evidence may only anchor the asset baseline. | Anonymised mobility/geo data, GIS, demographics and approved tourism/origin data. | Catchment bands, origin mix, overlap, affinity, travel-time reach and white spots. | `Technology library!A11:F11`; `Definitions & guardrails!A15:B15`; `PFM Matrix!E15:H16` |
| `TECH-08` Business data connection and analytics | Explain how operational/customer context joins movement evidence. | Conversion/sales context; portfolio comparison; staff context; category/tenant mapping. | No physical measurement is added by this module. | POS, transactions, turnover, staffing, campaigns, maps, formats, square metres and related definitions. | Conversion, sales per visitor, like-for-like comparison and contextual performance gaps only from aligned definitions. | `Technology library!A12:F12`; `Definitions & guardrails!A6:B10`; `PFM Matrix!E13:H14` |
| `PRIVACY-DATA` Privacy and data processing | Explain the capture-to-output trust boundary for the originating module. | Every measurement or connected-data drilldown; deeper `Explore privacy` action. | None; it describes processing of the originating module's inputs. | Approved privacy, jurisdiction, processing and integration documentation. | Nothing; this module does not create a commercial insight. | `SALES-EXPERIENCE-DIRECTION.md` §12; `Technology library!F5:F12`; user-approved product input (2026-08-14), §3 |

## Reusable module explanation contracts

| Module | Recommended visual explanation | Contextual privacy explanation | Optional technical detail | Hardware/implementation deeper only | Source |
|---|---|---|---|---|---|
| `TECH-01` | Reuse the storefront scene and zoom from passing stream to aligned entrance threshold. | Passing traffic is not a visit; show area, direction, period and alignment. | Coverage direction, counting boundary, output interval and source provenance. | Counter/radar type, placement, power/network and approved specifications. | `Technology library!A5:G5`; `SALES-EXPERIENCE-DIRECTION.md` §§11, 25 |
| `TECH-02` | Zoom into an entrance threshold with anonymous IN/OUT events and the resulting count output. | Explain anonymous processing and distinguish entries, visits and unique visitors. | Threshold coverage, entry/exit definition, output and integration boundary. | Sensor type, mounting/positioning, power/network and approved dimensions/specifications. | `Technology library!A6:G6`; `SALES-EXPERIENCE-DIRECTION.md` §§11–12 |
| `TECH-03` | Show anonymous group/classification examples beside the originating entrance scene. | Classification is estimated, optional and permitted/configured only; never identity recognition. | Enabled classifications, definitions, confidence/quality handling only from an approved source. | Classification plugin/configuration and compatible sensing detail only when approved. | `Technology library!A7:G7`; `Definitions & guardrails!A9:B9` |
| `TECH-04` | Reuse the location plan and zoom from anonymous paths to zones, transitions and dwell output. | Movement remains anonymous; do not infer identity or intent. | Coverage, zone definitions, occlusion/continuity assumptions, output and integration boundary. | LiDAR/3D class, positioning, mounting, network/power and approved specifications. | `Technology library!A8:G8`; `SALES-EXPERIENCE-DIRECTION.md` §§11–12 |
| `TECH-05` | Show separate anonymous events becoming a matched journey only inside supported coverage. | Never imply personal identification; matching is conditional on design and privacy framework. | Matching boundary, event lifecycle, pseudonymous/anonymous handling and output definition. | Re-identification/journey-stitching configuration and infrastructure only from approved documentation. | `Technology library!A9:G9`; `Definitions & guardrails!A11:B11` |
| `TECH-06` | Reuse arrival/parking scene and separate vehicle events, parked vehicles and people flows visually. | ANPR/LPR is lawful/configured only; a plate does not by itself reveal a Dutch home location. | Vehicle/bay event definition, capacity model, jurisdiction and output boundary. | Counter, radar/camera, lawful ANPR/LPR or bay-sensing detail; placement, power/network and approved specifications. | `Technology library!A10:G10`; `Definitions & guardrails!A13:B14` |
| `TECH-07` | Reuse the catchment map and reveal aggregate source layers around, not inside, the measured asset. | Aggregate contextual data does not replace physical entrance measurement. | Aggregation, geography, time window, provenance and permitted granularity. | Data-provider/integration detail only where an approved source and usage permission exist. | `Technology library!A11:G11`; `SALES-EXPERIENCE-DIRECTION.md` §§10–12 |
| `TECH-08` | Add connected business context to the existing movement scene only after the Business lens is enabled. | Customer/external data remains Connected; calculated KPIs require aligned definitions. | Field mapping, aggregation grain, validation, output contract and integration boundary. | Approved connector, network/security and typed integration-contract detail; never browser-to-Odoo/SharePoint access. | `Technology library!A12:G12`; `AGENTS.md`, “Integration boundaries” |
| `PRIVACY-DATA` | Keep the originating scene visible and overlay a simple capture → processing → output → retention/access boundary. | State only approved facts about anonymity, classification, re-identification, lawful scope and aggregate context. | Processing location, data leaving the measurement layer, retention/deletion, access, jurisdiction, controller/processor roles and integration boundary—each unresolved until sourced. | Security architecture, edge/device processing and network/storage detail only from approved privacy and technical documentation. | `SALES-EXPERIENCE-DIRECTION.md` §12; `Technology library!F5:F12`; `AGENTS.md`, “Traceability” |

The `PRIVACY-DATA` module must show `Not specified in current source` for any unsourced processing location, retention period, legal basis, access rule or deletion policy. [Source: `SALES-EXPERIENCE-DIRECTION.md` §12; `AGENTS.md`, “Traceability”]

## Two-level privacy model

### Capability-level privacy

| Capability | Intended privacy principle | Source |
|---|---|---|
| Outdoor and entrance measurement | Count movement at the defined boundary without presenting identity. Keep passers-by and visits separate. | `Technology library!F5:F6`; `SALES-EXPERIENCE-DIRECTION.md` §12 |
| Visitor classification | Anonymous, estimated, optional and limited to explicitly enabled, configured and permitted classifications. | `Technology library!F7`; `Definitions & guardrails!A9:B9` |
| Spatial movement and visit matching | Explain anonymous movement or supported matching without implying personal identification, identity tracking or intent. | `Technology library!F8:F9`; `Definitions & guardrails!A11:B11` |
| Vehicle and parking | Separate vehicles, occupancy and people; use ANPR/LPR only where lawful and configured. | `Technology library!F10`; `Definitions & guardrails!A13:B14` |
| Geo/mobility | Use aggregate contextual outputs, not raw individual paths, profiles or a substitute for physical entrance measurement. | `Technology library!F11`; `docs/reference/digital-sales-journey/privacy-governance-notes.md`, “Required Guardrails” |
| Business connection | Minimise connected fields to the defined question and apply the approved integration/governance boundary. | `AGENTS.md`, “Integration boundaries”; `docs/reference/digital-sales-journey/privacy-governance-notes.md`, “Required Guardrails” |

### Implementation-level privacy

1. Show only claims mapped to the selected implementation's approved source.
2. For Xovis, confidential internal sources partially map on-device processing, image-storage behaviour, anonymised count output and four privacy filters for the presented setups. Show those statements only with `PARTIALLY SOURCE-BACKED`, exact-model validation and external-use approval. Do not claim universal behaviour, a complete metadata schema, retention policy, legal compliance or “full GDPR”.
3. For Milesight and Isarsoft, show `REQUIRES SOURCE MAPPING` for product-specific processing, storage, metadata, retention, network or privacy mechanics.
4. For LiDAR, one customer-specific FDS supports implementation topology but not privacy; for vehicle/parking, no named supplier source is mapped. Apply the capability principle but withhold product-specific privacy claims until the actual implementation source and jurisdiction are known.
5. `REQUIRES SOURCE MAPPING` means the explanation content is missing; it does not mean that the implementation cannot support the capability.

[Source: user-approved product input (2026-08-14), §3; `../../AGENTS.md`, “Traceability”; `PFM-XOVIS-INTRO`, p. 4; `PFM-RETAIL-3D`, p. 11; `PFM-LIDAR-FDS`, pp. 4–7; project source review performed 2026-08-14]

## Configure model

Configure asks for the evidence design before it reveals implementations:

1. **Question** — What question must be answered?
2. **Capability** — Which physical measurement capability is required?
3. **Connected context** — Which Mobile & geo or Business context is required or optional?
4. **Insight level** — Which direct output or derived insight must be supported, and what dependencies gate it?
5. **Implementation fit** — Which source-gated implementation option may fit the scope?

| Configure output | Required content | Must not do | Source |
|---|---|---|---|
| Evidence requirement | Question, unit, area, period, definition and required capability. | Start with a supplier or device. | `SALES-EXPERIENCE-DIRECTION.md` §§11, 22 |
| Context requirement | Required/optional Mobile & geo and Business sources. | Present contextual data as direct sensor measurement. | `AGENTS.md`, “Data layers” |
| Insight dependency | Named inputs that must be enabled before the derived output appears. | Show an unsupported derived value. | `AGENTS.md`, “Data layers”; `SEGMENT-STORY-ARCHITECTURE.md`, “Core-scene data-role validation” |
| Implementation shortlist | One or more source-gated options with role/tier, known differences and validation needs. | Automatically recommend hardware or imply interchangeability. | User-approved product input (2026-08-14), §§1, 4, 6 |
| Deferred decision | Requirements outside the go-demo: detailed coverage design, technical validation, commercial selection and pricing. | Rebuild pricing or choose a final product automatically. | `AGENTS.md`, “Integration boundaries”; user-approved product input (2026-08-14), §4 |

Example:

- Question: How many people enter the store?
- Capability: `TECH-02 Entrance measurement`.
- Possible implementations: Xovis Premium 3D; Milesight VS125-P Basic 3D; Isarsoft on compatible IP-camera infrastructure.
- Deferred decision: final fit after requirements and source-backed technical validation.

The example is a one-to-many option set, not a recommendation or price configuration. [Source: user-approved product input (2026-08-14), §§1, 4]

## Scene-to-module routing

The following routes preserve the exact scene assignments in the matrix. `and/or`, `depending on scope`, `where lawful` and other qualifiers are binding.

### Retail Chain

| Scene | Priority | Module route | Source |
|---|---|---|---|
| Street opportunity | Core | `TECH-01` + `TECH-02` | `PFM Matrix!A5:P5` |
| Store visits | Core | `TECH-02` | `PFM Matrix!A6:P6` |
| Visitor composition | Core | `TECH-03` | `PFM Matrix!A7:P7` |
| Visit duration | Optional | `TECH-05` and/or `TECH-04` | `PFM Matrix!A8:P8` |
| In-store journey | Core | `TECH-04` | `PFM Matrix!A9:P9` |
| Product-category journey | Advanced | `TECH-04` + `TECH-08` business/data mapping | `PFM Matrix!A10:P10` |
| Zone engagement | Core | `TECH-04` | `PFM Matrix!A11:P11` |
| Staff interaction | Optional | `TECH-04` + `TECH-08` staff context | `PFM Matrix!A12:P12` |
| Conversion and sales context | Core | `TECH-02` + `TECH-08` | `PFM Matrix!A13:P13` |
| Portfolio comparison | Optional | `TECH-08` | `PFM Matrix!A14:P14` |

### Shopping Centre

| Scene | Priority | Module route | Source |
|---|---|---|---|
| Catchment area | Core | `TECH-07` | `PFM Matrix!A15:P15` |
| Competitive visitation and white spots | Optional | `TECH-07` | `PFM Matrix!A16:P16` |
| Centre entrances | Core | `TECH-02` | `PFM Matrix!A17:P17` |
| Visitor composition | Core | `TECH-03` | `PFM Matrix!A18:P18` |
| Time in centre | Core | `TECH-05` + `TECH-04` | `PFM Matrix!A19:P19` |
| Internal circulation | Core | `TECH-04` | `PFM Matrix!A20:P20` |
| Zone and anchor exposure | Core | `TECH-04` | `PFM Matrix!A21:P21` |
| Brand counting | Core | `TECH-02` and/or `TECH-04` | `PFM Matrix!A22:P22` |
| Brand flow | Core | `TECH-05` + `TECH-04` | `PFM Matrix!A23:P23` |
| Parking arrival | Optional | `TECH-06` + `TECH-02` | `PFM Matrix!A24:P24` |
| Parking occupancy | Optional | `TECH-06` | `PFM Matrix!A25:P25` |
| Vehicle origin | Advanced | `TECH-06` + `TECH-07` lawful origin context | `PFM Matrix!A26:P26` |

### Retail Park

| Scene | Priority | Module route | Source |
|---|---|---|---|
| Catchment area | Core | `TECH-07` | `PFM Matrix!A27:P27` |
| Competitive visitation and white spots | Optional | `TECH-07` | `PFM Matrix!A28:P28` |
| Vehicle arrival | Core | `TECH-06` | `PFM Matrix!A29:P29` |
| Parking occupancy | Core | `TECH-06` | `PFM Matrix!A30:P30` |
| Unit visits | Core | `TECH-02` and/or `TECH-04` | `PFM Matrix!A31:P31` |
| Visitor composition | Optional | `TECH-03` | `PFM Matrix!A32:P32` |
| Cross-visitation | Core | `TECH-05` + `TECH-04` | `PFM Matrix!A33:P33` |
| Time on site | Core | `TECH-05`, then `TECH-06` or `TECH-04` depending on scope | `PFM Matrix!A34:P34` |
| Unit and category exposure | Core | `TECH-02` + `TECH-04` | `PFM Matrix!A35:P35` |
| Vehicle origin | Advanced | `TECH-06` + `TECH-07` lawful origin context | `PFM Matrix!A36:P36` |

### Outlet Centre

| Scene | Priority | Module route | Source |
|---|---|---|---|
| Destination catchment | Core | `TECH-07` | `PFM Matrix!A37:P37` |
| Tourism and origin context | Core | `TECH-07` plus approved tourism/origin data | `PFM Matrix!A38:P38` |
| Competitive destinations and white spots | Optional | `TECH-07` | `PFM Matrix!A39:P39` |
| Vehicle and coach arrival | Core | `TECH-06` | `PFM Matrix!A40:P40` |
| Centre entrances | Core | `TECH-02` | `PFM Matrix!A41:P41` |
| Visitor composition | Core | `TECH-03` | `PFM Matrix!A42:P42` |
| Time in destination | Core | `TECH-05` + `TECH-04` | `PFM Matrix!A43:P43` |
| Circulation | Core | `TECH-04` | `PFM Matrix!A44:P44` |
| Zone exposure and dwell | Core | `TECH-04` | `PFM Matrix!A45:P45` |
| Brand counting | Core | `TECH-02` and/or `TECH-04` | `PFM Matrix!A46:P46` |
| Brand flow | Core | `TECH-05` + `TECH-04` | `PFM Matrix!A47:P47` |
| Parking occupancy | Optional | `TECH-06` | `PFM Matrix!A48:P48` |
| Vehicle origin | Optional | `TECH-06` + `TECH-07` lawful origin context | `PFM Matrix!A49:P49` |

## QSR / Drive-Thru capability extension

QSR capabilities are namespaced `TECH-QSR-01`–`TECH-QSR-10`. No existing `TECH-01`–`TECH-08` ID is altered, renumbered or reused. The detailed source is `docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md` §§5, 15, 21.

### Reuse assessment

`TECH-06` (vehicle and parking intelligence) was assessed for reuse and **deliberately not reused** for `TECH-QSR-01`. Property vehicle arrival and parking-occupancy measurement and drive-thru journey-stage timing are different measurement questions with different implementations; sharing a capability only because both involve vehicles would corrupt both. `TECH-08` (business data connection) is the closest generic analogue to `TECH-QSR-05` (POS and order-context integration); they remain separate because the QSR capability is order-context inside a timing environment with its own brand/platform compatibility rule. Both reuse candidates are recorded here rather than merged.

### Capability-to-implementation map (QSR)

Implementation options only. Nothing selects a product, a communication tier or a voice AI provider, and nothing ranks or prices an option.

| Capability | Capability meaning | Implementation options | Commercial availability | Selection boundary |
|---|---|---|---|---|
| `TECH-QSR-01` | Detect a vehicle at configured points so a journey timeline can exist. | Compatible vehicle detection infrastructure; HME ZOOM Nitro timing environment where applicable. | `available_if_compatible` | No single detection technology is mandatory; detection design is site-specific. |
| `TECH-QSR-02` | Measure elapsed time between configured detection points. | HME ZOOM Nitro Timer. | `available` | A measured time requires a defined start, end and period; it never establishes a cause. |
| `TECH-QSR-03` | Guest-to-crew and crew-to-crew communication. | NEXEO Core; NEXEO; NEXEO Pro; Text & Connect (optional, unvalidated scope). | `available` | Tier capability is never generalised. 1:1/group communication and voice commands are not attributed to Core unless verified in the current tier matrix. No tier is auto-selected. |
| `TECH-QSR-04` | Audio clarity in a noisy lane environment. | ClearSoundX. | `optional_add_on` | Enhancement capability, not an opening proposition; regional and tier availability require validation. |
| `TECH-QSR-05` | Order context associated with measured wait time. | Compatible POS integration; compatible geofence/mobile integration. | `available_if_compatible` | Brand and platform dependent; never presented as universally available. |
| `TECH-QSR-06` | A threshold event reaches the person who can act. | ZOOM Nitro with a compatible NEXEO configuration. | `available_if_compatible` | Strong closed-loop capability; the alert enables a human response and does not itself produce the outcome. |
| `TECH-QSR-07` | Multi-restaurant, hierarchy, daypart and historical comparison. | ZOOM Nitro Data / HME CLOUD. | `available` | Comparison requires compatible definitions and a comparable period. |
| `TECH-QSR-08` | Team engagement and gamification. | ZOOM Nitro Gamification; ZOOM Nitro Leaderboard. | `optional_add_on` | Secondary reveal; attached to no scene and never part of the primary commercial story. |
| `TECH-QSR-09` | Voice AI readiness. | NEXEO Pro plus a separate compatible third-party voice AI provider. | `available_if_compatible` | PFM does not supply, resell or auto-select a provider, and no provider is named. |
| `TECH-QSR-10` | Vision AI / expanded journey visibility. | Nitro Vision AI. | `region_limited`, region `United States`, research baseline `2026-08-15` | Attached to no scene. Not presentable as a current PFM Europe implementation without explicit confirmation. |

### Commercial availability is not source readiness

`commercialAvailability` (`available`, `available_if_compatible`, `optional_add_on`, `future_ready`, `region_limited`, `requires_validation`, `not_in_prospect_mode`) answers "can PFM offer this here?". `sourceStatus`, `privacyStatus` and `technicalDetailStatus` answer "what can we truthfully say about it?". They are independent fields and are validated independently. `region_limited` requires region metadata; any `impl-compatible-*` integration must retain `available_if_compatible`. [Source: `PFM_QSR_Commercial_Experience_Agent_Spec.md` §21]

### QSR Configure synthesis

Configure remains a synthesis stage and never becomes a hardware catalogue. The QSR Configure chain is: business/operational need → required capability → possible implementations → dependencies → commercial availability → source/readiness. Reference paths are typed in `app/content/segments/qsr.ts` (`qsrConfigurePaths`), for example stage-level timing (`TECH-QSR-01` + `TECH-QSR-02`, dependencies: site/lane survey, detection-point design, goal configuration, connectivity/services as applicable) and timer alert reaching an employee (`TECH-QSR-02` + `TECH-QSR-06` + `TECH-QSR-03`). No tier, product or provider is selected. [Source: `PFM_QSR_Commercial_Experience_Agent_Spec.md` §§10, 24, 30]

### QSR technology guardrails

- Timing creates visibility and enables intervention; the operational change creates the outcome. Never claim causality from timer data.
- Revenue, average order value, order accuracy, labour cost and profitability require connected business data and are never derived from timing.
- Drive-off is only available where the configured detection or AI implementation can determine it.
- Vendor marketing claims (deployment country counts, daily order volumes, additional-space counts, tier feature lists) remain source-qualified vendor statements and never become PFM outcome claims.
- Unknown tier capability stays unknown or `requires_validation`; it is never guessed.
- No `chooseBestQSRProduct`, `recommendNexeoTier`, `rankHMEProducts`, pricing or automatic tier selection exists anywhere in the model.

## Technology-specific guardrails

- Anonymous classification is estimated and conditional; it is not identity tracking. [Source: `Definitions & guardrails!A9:B9`; `Technology library!A7:G7`]
- Anonymous visit matching may only be claimed when coverage and the configured privacy framework support matched events. [Source: `Definitions & guardrails!A11:B11`; `Technology library!A9:G9`]
- Staff interaction metrics require reliable staff/visitor distinction and an agreed definition. [Source: `Definitions & guardrails!A12:B12`]
- ANPR/LPR is lawful-scope only. A Dutch registration plate does not by itself establish a local home origin. [Source: `Definitions & guardrails!A14:B14`; `Technology library!A10:G10`]
- POS, staffing, campaigns, tenant maps and other business inputs are connected data, not direct PFM physical measurement. [Source: `Definitions & guardrails!A6:B6`; `Technology library!A12:G12`]

## Typed-content verification invariants

The later typed model must enforce all of the following:

1. A technology capability record has no supplier/product field; implementations reference the capability one-to-many.
2. Xovis Premium 3D and Milesight VS125-P Basic 3D are different `TECH-02` implementation records.
3. Isarsoft uses compatible IP-camera infrastructure and is never typed as a 3D sensor.
4. LiDAR-based spatial tracking and Xovis 3D-based in-store tracking can both reference `TECH-04`, with implementation-specific supported outputs and constraints.
5. Milesight VS361 references `TECH-01` passer-by measurement, not `TECH-02` entrance measurement.
6. Capture rate depends on aligned passer-by and entrance-visit inputs and is absent when either dependency is unavailable.
7. POS, staffing, campaign, ERP, BI and operational inputs remain connected Business context.
8. Geo/mobile data remains connected, aggregate context and cannot satisfy a required Physical dependency.
9. Implementation-level privacy copy is limited to mapped source claims; missing product detail renders `REQUIRES SOURCE MAPPING`.
10. No typed rule recommends hardware, calculates pricing or assumes interchangeable measurement quality.
11. QSR capability IDs are namespaced `TECH-QSR-nn` and never collide with or replace `TECH-01`–`TECH-08`.
12. ZOOM Nitro, NEXEO Core/NEXEO/NEXEO Pro, ClearSoundX, HME CLOUD and Nitro Vision AI are implementation records, never capabilities.
13. Commercial availability is a separate field from source, privacy and technical-detail readiness; `region_limited` requires region metadata.
14. A compatibility-dependent integration (`impl-compatible-*`) must retain `available_if_compatible`.

[Source: `AGENTS.md`, “Data layers”, “Truth rules” and “Integration boundaries”; user-approved product input (2026-08-14), §§1–6, 10]

## READY FOR TYPED CONTENT MODEL

### READY

- Vendor-neutral capability records for `TECH-01`–`TECH-08` and the `PRIVACY-DATA` explanatory overlay.
- One-to-many capability-to-implementation relationships.
- The capability-first disclosure sequence and Configure decision order.
- Scene-to-capability routes, including all `and/or`, `depending on scope` and `where lawful` qualifiers.
- Xovis Premium 3D, Milesight VS125-P Basic 3D and Isarsoft compatible IP-camera analytics as distinct entrance implementation options.
- Milesight VS361 and passive infrared as passer-by options, separate from entrance visits.
- LiDAR-based and Xovis 3D-based in-store options without declaring them equivalent.
- Physical, Mobile & geo, Business and Insight separation; capture, conversion and other derived dependency gates.
- Architecture/content readiness distinction for proof and visuals.

[Source: `Technology library!A4:G12`; `PFM Matrix!A5:P49`; user-approved product input (2026-08-14), §§1–10]

### IMPLEMENT WITH PLACEHOLDER

- Product cards or technical-detail panels may use a labelled unavailable state where implementation source detail is missing.
- All 17 planned, unregistered visual IDs remain `PLACEHOLDER`.
- All 13 case/proof IDs are architecture-ready but content-missing, non-playable placeholders.
- Geo/mobility provider detail, business connector detail and vehicle/parking supplier detail remain source placeholders until a specific implementation is selected.

[Source: `Visual & proof registry!A22:G34`; `SEGMENT-STORY-ARCHITECTURE.md`, “Visual asset status model”; `CASE-PROOF-MODEL.md`, “Architecture readiness versus content readiness”]

### BLOCKED

- Customer-facing Xovis privacy or technical claims until the exact model/deployment mapping and external-use approval are validated; internal source mapping alone does not authorise publication.
- Customer-facing Milesight or Isarsoft privacy/technical claims beyond the approved product name and role.
- Generic or product-specific LiDAR, vehicle/parking, classification or anonymous-matching specifications and compatibility beyond the mapped implementation-specific evidence.
- Any accuracy, coverage, field-of-view, mounting, power, network, retention, legal-basis, security or performance claim not mapped to an approved source.
- Automatic hardware recommendation, final implementation selection or pricing logic.

Blocked items do not block the typed architecture. They block population or activation of the affected implementation-detail fields. [Source: `AGENTS.md`, “Truth rules” and “Integration boundaries”; `../../AGENTS.md`, “Traceability”; user-approved product input (2026-08-14), §§2–4, 9]
