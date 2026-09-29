# Decision log

## 2026-08-04 — CE-DEMO-001 review

Status: technically completed, product go withheld.

The first Sales Mode shell correctly established:

- the six-stage journey;
- fictional Northstar context;
- basic truth labels;
- simulated integration states;
- the initial PFM visual direction.

The build is not approved as the Retail go-demo because:

- Context is not yet decision-relevant;
- Measure does not make capture rate auditable;
- Understand is too abstract;
- the Retail performance chain is not sufficiently visible;
- Prove, Configure and Act remain placeholders.

Decision: retain the application shell and complete CE-DEMO-001R before starting CE-DEMO-002.

## 2026-08-14 — Capability-first technology architecture

Status: approved for documentation and typed-content architecture; product-specific technical detail remains source-gated.

Material conflict:

- The legacy Digital Quote Builder configuration labels its Basic 3D entrance sensor as Xovis.
- The current approved PFM product input defines Xovis as Premium 3D and Milesight VS125-P as Basic 3D.
- The legacy catalogue also contains inconsistent LiDAR/Xovis in-store template labels.

Decision:

1. The Commercial Experience models `TECH-01`–`TECH-08` as vendor-neutral capabilities.
2. Supplier products are one-to-many implementation options beneath a capability.
3. The current approved product input governs the option roles: Xovis Premium 3D, Milesight VS125-P Basic 3D and Isarsoft compatible IP-camera analytics for entrance measurement.
4. Legacy quote-builder product names, mappings and pricing remain reference-only and must not populate Commercial Experience specifications, recommendations or pricing.
5. Product-specific privacy and technical claims require a mapped local source. Confidential local PFM material provides a partial Xovis/3D mapping and one implementation-specific LiDAR mapping; exact-model applicability, external-use approval and unsourced fields remain gated. Missing documentation is `REQUIRES SOURCE MAPPING`, not evidence that a capability is unavailable.
6. Final implementation selection remains outside the go-demo and must not be automated.

Sources:

- User-approved product input in the Codex task dated 2026-08-14, §§1–6.
- `docs/design/SALES-EXPERIENCE-DIRECTION.md`, §§11–12 and 22.
- `docs/product/PFM_Segment_Insight_Matrix_v1_1.xlsx`, `Technology library!A4:G12`.
- Sanitised confidential source IDs `PFM-XOVIS-INTRO` (pp. 3–5), `PFM-RETAIL-3D` (pp. 10–12), `PFM-XOVIS-PC2-DRAWING` (p. 1) and `PFM-LIDAR-FDS` (pp. 4–7); raw source files remain local and uncommitted.
- `../digital-quote-builder/pricing-config.js`, `technologyIds.ENTRANCE_3D_BASIC`, `odooTemplateCatalog.retailChain.capex.tpl_rc_instore_lidar` and `tpl_rc_instore_3d`.
- `AGENTS.md`, “Source-of-truth order”, “Truth rules” and “Integration boundaries”.

## 2026-08-16 — QSR as a fifth typed segment with a non-matrix source

Status: approved for typed-content architecture only. QSR is `architecture_only` and is deliberately not exposed in the production UI.

Material conflicts resolved:

1. **Non-matrix source.** Every existing segment is derived from `PFM_Segment_Insight_Matrix_v1_1.xlsx`. QSR is not in that workbook; its source is `docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md`. Decision: QSR is added as a fifth typed segment whose scene, capability, proof and visual entries cite that specification by section, while matrix-derived coverage assertions (45 matrix scenes, 34 matrix visuals, 13 matrix proofs) are scoped to the four matrix segments rather than deleted.
2. **Capability ID namespace.** The existing capability ID space is `TECH-01`–`TECH-08` and the validator enforced that pattern. Decision: QSR capabilities are namespaced `TECH-QSR-01`–`TECH-QSR-10`; no existing ID is altered or renumbered, and the validator now accepts both namespaces.
3. **Capability reuse rejected.** `TECH-06` (vehicle and parking intelligence) was assessed for reuse by `TECH-QSR-01` (vehicle journey detection) and rejected: property arrival/occupancy measurement and drive-thru journey-stage timing are different measurement questions with different implementations. `TECH-08` (business data connection) and `TECH-QSR-05` (POS and order-context integration) are likewise kept separate. Both candidates are recorded rather than merged.
4. **Commercial availability is a new, separate concept.** The specification (§21) requires an availability state that is not the same thing as source/evidence readiness. Decision: an optional `commercialAvailability` field (`available`, `available_if_compatible`, `optional_add_on`, `future_ready`, `region_limited`, `requires_validation`, `not_in_prospect_mode`) is added alongside — never merged into — `sourceStatus`, `privacyStatus` and `technicalDetailStatus`. `region_limited` requires region metadata; `impl-compatible-*` integrations must retain `available_if_compatible`.
5. **Presenter lenses vs global evidence roles.** The specification proposes QSR lenses (Vehicle flow, Communication, Business/Order, Insight, Automation). Decision: these are typed as optional segment-level `experienceLenses` presentation metadata that map onto the existing global data roles (`physical`, `mobile_geo`, `business`, `insight`). The global roles are not renamed, replaced or extended, and no lens UI is built.
6. **Proof ID convention.** QSR proof placeholders use the `proof-qsr-*` IDs named in the approved task rather than the matrix `CASE-*` convention, because they do not originate from the matrix registry. All six remain non-playable, non-external placeholders.

Preserved constraints:

- The canonical journey is unchanged; Configure and Act remain synthesis stages for QSR as for every other segment.
- QSR is queryable through the existing generic Scene, Technology, Proof and Demo Evidence runtimes. No QSR-specific runtime was created.
- No product, tier or voice AI provider is selected, ranked or priced anywhere in the model.
- Nitro Vision AI remains `region_limited` to the United States at the stated 2026-08-15 research baseline and is attached to no scene.
- NEXEO tier capability is not generalised; unverified tier attribution stays unsupported or `requires_validation`.
- The §17 interface examples are registered as illustrative demo evidence only and are explicitly labelled as neither HME nor industry benchmarks, customer results nor PFM performance claims.

Sources:

- `docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md`, §§3, 5, 10–12, 15–17, 20–24, 30, 32, 35.
- `docs/checkpoints/ENGINEERING-FOUNDATION-V1.md`, typed content architecture and runtime sections.
- `AGENTS.md`, “Canonical journey”, “Data layers”, “Truth rules”.

## 2026-08-17 — Act composition vs. the §23 four-part sequence

Status: **APPROVED (2026-08-17).** Recorded rather than silently resolved, per `AGENTS.md`, "Source-of-truth order".

Resolution: the PFM Commercial Experience is confirmed as primarily a guided digital sales brochure. The canonical Act stage closes the customer-facing narrative with recognition, conversation, a next question, and a human-owned next step — it does not need to contain the commercial-workflow bridge described in the older design-direction concept. The brochure-first Act implementation below takes precedence for the primary customer experience. The §23 concept (story save, CRM/Odoo handoff, Client Room, Quote Builder, quotation/proposal workflow) is not deleted — it is deferred to a separate, downstream commercial-workflow layer that may be integrated later but is explicitly out of scope for the Retail brochure journey.

Material conflict:

- `docs/design/SALES-EXPERIENCE-DIRECTION.md` §23 and `docs/product/SEGMENT-STORY-ARCHITECTURE.md` both state that Act preserves the sequence `What we observed → What it may mean → What we would examine next → What is required`, and §23 additionally suggests Act "create a natural bridge to the commercial workflow, including simulated story save, opportunity update, Client Room preparation or separate Quote Builder handoff".
- The approved task specification for this implementation defines Act as the closing chapter of a digital sales brochure: one visual conclusion, up to three next-conversation directions, a non-pushy call to action, and an explicit prohibition on lead capture, quote/proposal generation, CRM or Client Room handoff, and on any state that claims something was sent.

Decision (proposed):

1. Act is implemented as the brochure's closing chapter, following the task specification. The §23 sequence is honoured in substance rather than as four labelled headings: the restrained recap band carries "what we observed", the customer-first framing carries "what it may mean", and the three next-conversation directions carry "what we would examine next".
2. "What is required" is deliberately **not** repeated in Act. It already exists under Configure as the "What is needed" depth layer, per solution direction, derived from each related scene's own typed dependencies. Restating it in Act would duplicate Configure's depth and turn the closing chapter into a second configuration screen.
3. The §23 commercial-workflow bridge (story save, opportunity update, Client Room preparation, Quote Builder handoff) is **not** implemented. Act may visually prepare for a future handoff but executes none of it, and the closing state states outright that nothing has been sent, submitted or saved.
4. The synthesis contract itself is unchanged: `stageMapping.act` stays empty, `synthesis.act` is bound rather than restated, and `decisionOwner` remains the literal `"human"`.

Sources:

- User-approved task specification for the Act stage (2026-08-17), §§1–20 and §§31–43.
- `docs/design/SALES-EXPERIENCE-DIRECTION.md`, §23 Act direction and §24 anti-patterns.
- `docs/product/SEGMENT-STORY-ARCHITECTURE.md`, "Configure and Act synthesis contract".
- `AGENTS.md`, "Canonical journey", "Truth rules", "Integration boundaries".

## 2026-08-18 — Isarsoft asset folder: `entrance/` vs a separate `isarsoft/`

Status: **SUPERSEDED (2026-08-18)** by "Isarsoft asset folder — human decision (supersedes the proposal above)" below. The proposal was declined by the product lead. The entry is kept unchanged as a record of what was considered and why, per `AGENTS.md`, "Source-of-truth order"; it no longer describes the current state of the repository.

Material conflict:

- The asset-normalisation task specification sketches an "expected resulting structure" that places `bosch-3100i.jpg` under a separate `public/assets/technology/isarsoft/` folder.
- The same specification also instructs that the existing semantic folders be preserved, and that where the current structure differs the approved semantic structure is kept and only filename typos and inconsistent underscore naming are corrected.

Decision (proposed): the photograph stays at `public/assets/technology/entrance/bosch-3100i.jpg`. Only its filename is normalised.

Reasoning:

1. The folders are named after the **measurement position** the capability occupies — `entrance`, `passerby`, `spatial` — not after a supplier. A supplier-named folder would be the only one of its kind and would re-introduce the supplier as an organising axis, which is what capability-first modelling exists to prevent.
2. Isarsoft is an analytics layer configured on entrance camera infrastructure, not a hardware category of its own. The photograph is a Bosch camera, not an Isarsoft product; filing it under `isarsoft/` would imply the picture is evidence of the analytics, which `showsInfrastructureOnly: true` and the source registry both explicitly deny.
3. `docs/reference/technology/SOURCE-REGISTRY.md` already names the path `public/assets/technology/entrance/` in its Isarsoft section. Moving the file would silently invalidate an approved source-registry statement.
4. The "expected structure" sketch is read as illustrative of the naming convention, not as a directive to re-file the asset — the instruction to preserve the approved semantic structure is the more specific one.

Sources:

- `docs/reference/technology/SOURCE-REGISTRY.md`, Isarsoft section.
- `app/content/technology-visuals.ts`, `implementationVisuals` and `showsInfrastructureOnly`.
- `AGENTS.md`, "Data layers", "Truth rules".

## 2026-08-18 — Isarsoft asset folder — human decision (supersedes the proposal above)

Status: **DECIDED (2026-08-18) by the product lead.** This entry states the current state of the repository. The preceding entry is superseded and retained for audit only.

Decision: the Isarsoft infrastructure photograph lives at `public/assets/technology/isarsoft/bosch-3100i.jpg`, not under `entrance/`.

Reasoning given by the product lead:

1. Isarsoft is a **multi-capability analytics family**. Depending on configuration and on which sources a deployment supports, it may cover Entrance Measurement, Visitor Classification, single-camera dwell, or multi-camera anonymous journey matching and spatial analysis.
2. Filing the asset under `entrance/` ties it structurally, by filesystem location alone, to Entrance Measurement — asserting a single-capability membership that no mapped source establishes and that the product model does not intend.
3. A supplier- or family-named folder is therefore the more truthful location here precisely because the position-named folders (`entrance/`, `passerby/`, `spatial/`) each encode a single measurement position, and Isarsoft does not occupy exactly one.

What this decision does **not** change:

- The runtime architecture stays capability-first: `scene -> capability -> implementation` is untouched, and nothing here is reachable except through a capability.
- The photograph's evidential status is unchanged. It remains `showsInfrastructureOnly: true` — a camera of the kind the analytics layer can run on, never evidence that the analytics exist, work, classify anything or handle data in any particular way.
- No other asset moves. `entrance/`, `passerby/` and `spatial/` keep their Xovis, Milesight and RoboSense assets; this is not a global asset-tree refactor.

Points 1–2 of the superseded proposal (that folders are named after measurement position, and that a supplier-named folder re-introduces the supplier as an organising axis) are acknowledged and overruled: the product lead accepts a mixed organising axis in the asset tree in exchange for not encoding a false single-capability claim. Point 3 (that the source registry names the `entrance/` path) is resolved by updating `docs/reference/technology/SOURCE-REGISTRY.md` in the same change rather than by leaving the file in place.

Sources:

- Human product decision, 2026-08-18, recorded in the task specification for this change.
- `docs/reference/technology/SOURCE-REGISTRY.md`, Isarsoft section (updated by this change).
- `app/content/technology-visuals.ts`, `implementationVisuals` and `showsInfrastructureOnly`.
- `AGENTS.md`, "Source-of-truth order", "Data layers", "Truth rules".

## 2026-09-28 — Attributing privacy claims without naming the vendor

Status: **RESOLVED in content; confirm with the product lead.**

The conflict. Two instructions pull against each other on the same sentence:

1. The product lead's naming rule (2026-09-27): the brochure does not name a sensor by vendor or model. Devices are shown by functional name — "3D Sensor Basic FoV", "IP Detection Sensor indoor" — and `app/content/technology-presentation.ts` holds that boundary.
2. The content brief (2026-09-28): a privacy claim must be attributed to the supplier and to its specific source, and must never read as independently proven or as a legal judgement.

A sentence such as "Isarsoft states that Perception can anonymise video" satisfies the second and breaks the first.

Resolution applied:

- A vendor claim is attributed in the text by role — "The supplier states…", "The manufacturer describes…" — and to the named source through its source ID. The Milesight VS125-P privacy claim already used this form; the two Isarsoft claims now follow it in English, French and German.
- The source ID and the registry entry carry the vendor, the document and the page locator, so traceability loses nothing. See `docs/reference/technology/SOURCE-REGISTRY.md` and each implementation's `sourceRefs`.
- Where no attribution is possible because no document is mapped, no privacy claim is shown at all; the status message stays.

Name leaks found and removed in the same pass: the LiDAR limitation named the model ("Airy outputs a point cloud"), an HME limitation and a ClearSoundX claim named "NEXEO". `tests/technology-presentation.test.mjs` test 10 now scans the reviewed limitation and method layers, which the earlier naming test did not reach.

Not changed in that pass: the approved Configure previews still rendered `supplier` and `product` beneath the role. That was left open, and was closed later the same day by the product lead's instruction to apply the rule to Configure — see the next entry.

Correction to the 2026-08-18 entry above: the photograph it names, `isarsoft/bosch-3100i.jpg`, was identified by the product lead on 2026-09-27 as a FLEXIDOME 5100i and renamed `isarsoft/bosch-flexidome-5100i.jpg`. The decision about the folder stands; only the filename changed.

Sources:

- Product lead naming rule, 2026-09-27; `app/content/technology-presentation.ts` header.
- Content brief for this pass, 2026-09-28, point 7.
- `docs/content/CONTENT-REVIEW-2026-09-27.md` § What changed in the 2026-09-28 pass.
- `AGENTS.md`, "Do not silently resolve a material conflict".

## 2026-09-28 — Product lead input: Bosch privacy mapping, the PC2SE-O family, Configure names and the restored Outlet frame

Status: **DECIDED by the product lead; applied in content.**

Four product-lead instructions in one improvement pass. Each is recorded with what was applied and where its boundary is.

### 1. The Bosch privacy document applies to both IP detection sensors

Input: the FLEXIDOME micro 3100i and the FLEXIDOME 5100i are both CPP14 cameras. The IVA Pro Privacy document may be mapped to the two IP detection options, keeping its firmware, mode, synchronisation and masking limits. No compliance guarantee.

Applied:

- `SRC-BOSCH-IVA-PRO-PRIVACY-001` is now a registry entry (`docs/reference/technology/SOURCE-REGISTRY.md`) supporting `impl-ip-detection-indoor` and `impl-ip-detection-outdoor` for manufacturer-described privacy configuration only.
- Both implementations move from `requires_source_mapping` to `partially_source_backed`. Two supported claims are added, attributed to the manufacturer and bounded to "on supported firmware and analytics variants, and only as configured".
- The limits are kept as blocked claims, not dropped: masking depends on firmware 9.40, supported modes and correct configuration; the manufacturer lists failure cases (delayed metadata, some high-resolution stills, image stabilisation); the camera's settings do not make an installation legally compliant and do not describe the analytics a PFM deployment would run.

Not claimed: compliance, anonymisation of any PFM output, or anything about other devices.

### 2. The Xovis PC2SE-O is a member of the PC2SE family

Input: present family membership as confirmed. Do not carry indoor specifications across. No certification claim without a source.

Applied: `impl-xovis-3d-entrance-outdoor` states family membership as a supported claim, and states in the same breath that the family does not carry the indoor sensor's figures. The indoor datasheet figures, an accuracy figure and the indoor sensor's privacy certificate are blocked claims for this variant. Status stays `requires_source_mapping`: no PC2SE-O datasheet or certificate is mapped.

Amended later on 2026-09-28: the PC2SE-O datasheet (`SRC-XOVIS-PC2SE-O-TECH-001`, supplied by the product lead and added under `docs/reference/technology/xovis/pc2se-o/technical/`) is now mapped. The outdoor version's own figures — outdoor use, mounting 2.20–6.00 m, PoE, -33 °C to +40 °C, minimum 9 lux, protection against water and dust, four privacy modes with text-only data — are shown from that document; the indoor figures are still not carried across. Technical status is `source_backed`, privacy `partially_source_backed`. Certification is unchanged and unresolved: the ePrivacyseal certificate names the PC2SE, not the PC2SE-O, so none is claimed.

### 3. The naming rule applies to Configure

Input: use functional, customer-facing names in Configure; keep internal source references and technical detail internal where the existing presentation requires.

Applied:

- `ConfigureSceneLayout.tsx` shows the functional name under the role ("3D Sensor Basic FoV"), a method class's own class name where there is no supplier, and nothing where a supplier's product has no functional name yet — the role already says what it is.
- `solution-runtime.ts` builds the "Other possible implementations" labels from the functional name or the role, no longer from supplier and product.
- The example-implementation line under an explainer video shows the functional name, in Configure and in the drawer.
- Supplier and model stay in the model and in the Sales-mode internal line beside the implementation id and source references. Presentation mode never shows them.

`tests/technology-presentation.test.mjs` holds it: every Configure option label, in both audiences, is scanned for supplier and product tokens.

### 4. The Outlet visitor-composition frame is restored

Input: `outlet-centre-visitor-composition-hero1.png` was found and must be kept; the decision and the test must check the actual asset.

Applied: the file is back, byte-identical to `retail/retail-visitor-composition-hero.png` as the original rejection recorded. Its rejection stands — a store interior is not an outlet — and now names the file it duplicates. `tests/outlet-asset-decisions.test.mjs` compares the two byte for byte, and checks that the accepted `outlet-centre-visitor-composition-hero.png` is a different file.

Sources:

- Product lead input in the improvement brief of 2026-09-28.
- `docs/content/CONTENT-REVIEW-2026-09-27.md` § What changed in the 2026-09-28 improvement pass.
- `app/content/technology.ts`, `app/content/technology-presentation.ts`, `app/content/outlet-asset-decisions.ts`.

## 2026-09-28 — Two published customer cases approved as Retail proof

Status: **DECIDED by the product lead; applied.**

Input: the product lead asked for the Madaq and Future Stores London case videos to be used as evidence in the Retail brochure — Madaq for visitor counting to conversion, Future Stores for in-store analytics.

The rule this touches: AGENTS.md forbids real customer names or logos without documented approval. The approval is documented as follows: both cases are published by PFM itself on its own website (https://www.pfm-intelligence.com/cases/madaq, https://www.pfm-intelligence.com/cases/future-stores), each with a named customer representative quoted, and both videos are published on the PFM Intelligence Group YouTube channel (`_UjDI5o5T3I`, 2026-07-27; `FLLpevyxTss`, 2026-06-19). The product lead's instruction of 2026-09-28 to include them is the decision; this entry is its record. Verified 2026-09-28: the IDs are the ones embedded on those case pages.

Applied:

- `CASE-RET-01` is the Madaq case, `CASE-RET-02` Future Stores London: status `available`, externally approved, playable. All other proof slots stay placeholders.
- Each case is attached only to the scenes it evidences. Madaq: store visits and conversion — not the street scene (it measures no passers-by) and not visitor composition (its visitor attributes include gender, which the brochure does not present). Future Stores: in-store journey, zone engagement, visit duration and staff interaction — not product-category journey. The proof runtime now requires a proof to name the scene itself, so a shared slot cannot carry a case into a scene it does not cover.
- Truth boundaries shown beside each case: Madaq's sensors count visitors; conversion, basket value and products per visit are calculated with the retailer's own sales data. Neither case's figures are restated — not PFM's published "99% accuracy", not a shop count (PFM's own page gives both 8 and 11).
- The video is PFM's published copy, loaded from the privacy-enhanced YouTube embed only when the reader presses play; the case text and a link to its page stand without it.

Consequences on approved surfaces, all by the existing gates rather than new logic: the drawer's "In practice" shows the case; Configure's "See it in practice" appears in Presentation Mode for the three Retail directions whose scenes have a case; Retail Act's proof-gated "See it in practice" direction is now offered; the internal "No approved external proof yet" note disappears where a case exists.

Not included: a second Future Stores video on using existing CCTV cameras, mentioned alongside these; no video ID or page was supplied and it is not on the case pages.

## 2026-09-29 — PFM's CCTV explanation video, and the camera option's name

Status: **DECIDED by the product lead; applied.**

Input: the product lead supplied a third video, "PFM's CCTV AI Capabilities" (PFM Intelligence Group YouTube `F1-0cn8noeo`, published 2026-07-10): Mark King, PFM's Market Development Director, on using existing CCTV/IP cameras for AI analytics, recorded at PFM's event at Future Stores. Direction: show it in Configure's "What is needed" beside the camera option, labelled as PFM's explanation, not as proof. And: the analytics can run on existing IP cameras; the brochure calls that device an IP Detection Sensor.

Applied:

- `app/content/implementation-videos.ts` holds the video as PFM's explanation of `impl-isarsoft-camera-analytics`. It is not a proof asset and cannot reach the drawer's "In practice" or Configure's "See it in practice". It is labelled "PFM explains", says "An explanation by PFM, not a customer result", and loads from the privacy-enhanced embed only on request.
- The camera option's functional name is "IP Detection Sensor", matching the indoor and outdoor models; its role line still says the analytics run on existing camera infrastructure.

Resolves the conflict noted on 2026-09-28: the drawer keeps the IP detection sensors the product lead chose on 2026-09-27; Configure keeps its existing-camera option, now named the same way and explained by PFM.

Sources: https://www.pfm-intelligence.com/cctv; product lead instruction, 2026-09-29.

## 2026-09-29 — The brochure is approved for production

Status: **DECIDED by the product lead; applied.**

Input: "alles is nu goedgekeurd door mij" — the product lead approved the brochure as it stands for a production deployment.

What that changed. A production build previously showed prospects only the approved Retail shell: the segment picker's other cards were inert, and the Configure and Act stages of Retail, Shopping Centre and Retail Park answered 404. Now, through one switch (`app/content/release.ts`, `brochureApprovedForProduction`):

- the segment picker links every segment to its full journey in production, as it does locally;
- the Configure and Act routes of Retail, Shopping Centre and Retail Park render in production, and Configure's "See the next step" hands on to that segment's own Act (it did nothing before, locally as well). Retail Park Configure shows the control only on its own route, pointed at Retail Park's Act; the shell still has no Retail Park Act;
- the internal "capture harness", "draft preview" and "preview" wording left those routes' headers.

Unchanged: the per-scene review routes under /preview and the intro review route stay development-only; they are review tools, not the brochure. The approved shell and its own production rule (`shellRunsSegment`) are untouched. Setting the switch to false restores the previous production behaviour exactly.

Verified in a local production build: the picker shows five linked segments and no inert card; the six stage routes answer 200; a scene review route and the intro review route answer 404.

## 2026-09-29 — Review of the deployed brochure: vehicles, re-identification, "All segments"

Status: **DECIDED by the product lead (review deck "brochure verbetering.pptx"); applied.**

- **"All segments" returns to the picker, not the cover.** Since the Unified Intro became the front door, `/?locale=` opened the cover. The picker link is now `/?start=segments&locale=`, which opens the front door on the picker; `/` alone still opens on the cover.
- **Vehicle arrival (Retail Park, Outlet Centre).** Measured with the outdoor IP detection sensor or the ANPR sensor. The drawer's Technology tab shows those two devices, not the vehicle-arrival and parking-occupancy method classes; `impl-ip-detection-outdoor` is linked to TECH-06 with one claim (vehicle events at access lines — not visitors, not plates). The ANPR sensor has its photograph (`technology/anpr/tattile-basic-mk2.png`, from the content candidates). "How it works" shows two principles: plate reading and object detection.
- **Those two pictures carry real retailers' signs** in the candidates (`retail-park-anpr-lane-wide-reference.png`, `retail-park-people-vehicle-detection-wide-reference.png`). AGENTS.md forbids real customer names or logos without documented approval, and a retailer's sign in a PFM brochure reads as a customer, so the signs are blurred in the published copies. Their plates, dates and detection scores stay, flagged as embedded text and described as illustrative. Shopping Centre was not part of this review and keeps its vehicle list.
- **Re-identification.** The approved photographic explainer (`shopping-centre-anonymous-re-id-explainer.png`) is the explainer for every segment that measures re-identification; the schematic Retail Park and Outlet drawings of 2026-09-28 are retired.

Checked: every image path in the app matches its file exactly, including case, so a Linux host serves them all. The gaps seen in the review were places with no image assigned, not broken links.
