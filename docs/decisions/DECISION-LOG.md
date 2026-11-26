# Decision log

## 2026-11-04 — Retail Park Unit Visits hero asset approval

Status: approved for the Retail Park Unit visits scene only.

The product lead approved the existing `retail-park-brand-counting-hero.png`
for `retail-park-unit-visits` (`VIS-RP-02`). The image was visually reviewed in
the project and shows retail-unit threshold activity with illustrative purple
markers. Its visible tenant-style names are accepted as illustrative fictional
signage for this scene. This does not approve the same asset for
`retail-park-cross-visitation`; that scene requires a separate review.

No source, capability, customer-proof, or measurement claim is approved by this
decision.

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

## 2026-09-29 — "Beyond Core" leaves the scene page; the branch scenes still need a home

Status: **DECIDED by the product lead; applied. Follow-up open.**

Input: the product lead's review of the deployed Shopping Centre catchment scene — the block under the dark source rail looked out of place.

What it was. On eleven scenes (Retail 4, Shopping Centre 1, QSR 6) the journey listed the model's branch scenes (`branchFromSceneIds`) under the source rail, as "Beyond Core — Defined in the model and reachable from this scene. Not part of the Core walkthrough." It sat below the journey footer, so the footer no longer closed the page; nothing in it was clickable; the heading and note were model wording; and the branch titles and questions stayed English in FR and DE.

Decided. The block is removed from the scene page (`app/preview/demo/journey.tsx`), with its styles and its three-locale strings. The branch scenes stay in the typed model, unchanged.

**Open — the product lead wants these branches placed somewhere they add value.** They are useful in a sales conversation ("we can also show…"). Candidate: the closing review, as "What else we can show", translated, linked where a branch scene can be shown. Not started; needs its own task and FR/DE copy.

## 2026-09-29 — The segment overview no longer links to the approved shell

Status: **DECIDED by the product lead; applied.**

Input: the product lead, reviewing the deployed overview — "Open the approved sales shell" leads to a separate page that no longer matters.

Removed from the overview (`app/components/SegmentOverview.tsx`), with their three-locale strings and styles:

- the footer link "Open the approved sales shell" and its note;
- the per-card link "Approved sales experience" (Retail, Shopping Centre);
- the note that the journeys are "local previews … not implemented product". It was internal readiness wording, written before the brochure was approved for production.

Unchanged: `/shell` keeps its own address and still works. If the release switch (`brochureApprovedForProduction`) is set to false, the cards fall back to the shell exactly as before.

**Open — a short "who is PFM" on the overview.** The product lead suggested using the freed space for who PFM is and where it operates from. No company facts (history, offices, markets, scale) are recorded in `03-shared/brand/` or this project, and AGENTS.md forbids inventing claims, so this needs source-backed copy from the product lead or an approved source first.

## 2026-09-29 — "About PFM" on the overview; customer logos approved; installation accreditations in the drawer

Status: **DECIDED by the product lead; applied.**

Input: the product lead supplied four PFM deck slides and the Dutch website copy, and decided: (1) "we mogen klantlogo's gebruiken" — the customer logos are approved for use in this brochure; (2) the installation accreditations belong elsewhere than the front door.

- **About PFM** closes the segment overview (the space the shell link left): one line on what PFM does, three facts (offices, in-country teams, ISO/IEC 27001 · ISO 9001 · ISO 14001) and the fourteen customer logos. Every claim is traced in `docs/content/PFM-COMPANY-FACTS.md`.
- **Customer logos approved** by the product lead for this brochure. This is the documented approval the AGENTS.md truth rule asks for; it covers these fourteen organisations as shown on the source slide, not customer results or quotes.
- **Installation accreditations** (NICEIC, SafeContractor/SSIP, VCA, RI&E) close the drawer's Requirements tab on every scene that needs installed hardware.

Open: the logo files are cut from a slide screenshot; replace with originals when available. FR/DE wording is part of the open FR/DE copy review. Supersedes the "who is PFM" open item of the entry above.

## 2026-09-29 — Customer logos: the product lead's set of twenty

Status: **DECIDED by the product lead; applied.**

The product lead supplied black, transparent logo files and asked for them to be used, choosing how many fit. All twenty are shown: the slide's set without C&A (withdrawn), plus Pearle Opticiens, GrandOptical, KFC, Odido, Ace & Tate, Future Stores and MADAQ. The approval recorded above extends to these twenty. They are drawn at equal area rather than equal height, five to a row (two on a phone), so no single brand dominates. Origins are in `docs/content/PFM-COMPANY-FACTS.md`; the slide-screenshot crops are gone.

## 2026-09-29 — "What you get": a proof level beside the scene (spike, Shopping Centre catchment)

Status: **SPIKE — under review by the product lead; not committed.**

Input: the product lead's UX concept — three information levels per capability: Discover (the scene), Proof ("what do I actually get?"), Explain (the depth drawer). A secondary "See what you get" control on the scene swaps its two columns, in place, for the output; Back or Escape returns to the same scene state.

- **Version 1, editorial specimen — PARKED.** A dark, brochure-styled report with Reach / Visit pattern / Change lenses. The product lead liked it but ruled it too far from what customers receive: it could set expectations the product cannot meet. Kept in `app/components/redesign/CatchmentSpecimenEditorial.tsx` (styles `.spec*` in globals.css) to fall back on.
- **Version 2, the real report — CURRENT.** `CatchmentReportSpecimen.tsx` follows the actual catchment report ("Demografie" overview: KPI cards vs LY, average visit duration, day of week, postcode table, change-in-catchment map). The product lead's rule: "voor nu moet ik het echt met de werkelijke rapportages/dashboards doen".
- The data is illustrative for a fictional centre, **Centrum Lindenhaven**; the real customer's name from the reference screenshot is not used. The product lead approved showing postcodes, and waived the truth rules for this spike (illustrative figures are fine). The map is a neutral stand-in for the report's basemap with invented place names.

Open: English UI copy only (the report itself is in its own Dutch/English mix); whether this becomes a family across Outlet, Shopping Centre and Retail Park; the reference screenshot stays out of the repo.

Update 2026-09-30 (product lead review of version 2):

- The report sits flush left and the reading column takes the remaining width. The report scales to both the width left and the window height, so opening it never makes the page scroll.
- The report and everything around it follow the journey's locale (EN, FR, DE), including number formatting. Translations are in `app/components/redesign/catchment-report-copy.ts`; the FR and DE report wording needs the same native review as the rest of the FR/DE copy.
- **Reading guide (example of "more impact"):** three numbered points beside the report (visit quality · when they come · where they come from). Each lights up its part of the report with a matching number; on open they play through once. They point at what the report already shows and add no capability. Status: example for the product lead to judge.


## 2026-10-01 — "What you get": retail store report (Insights, Demographics)

- **Decision:** Two retail scenes get a store-report specimen, built as ONE component (`StoreReportSpecimen`) with a `page` prop, because both screenshots are tabs of the same report. `retail-conversion-sales-context` → Insights; `retail-visitor-composition` → Demographics.
- **Source:** product-lead request 2026-09-30 with 15 dashboard screenshots, filed (git-ignored) under `work/dashboard-screenshots/`; see its README for which scene each page belongs to.
- **Data:** fictional store (Northstar Utrecht), seeded fixture `app/content/output-specimens/store-fixture.ts`. Opportunity cards are derived from the daily rows (turnover = footfall × conversion × ATV; missed = potential at period averages − actual), so the cards and chart always agree. Truth rules waived for this work per the 2026-09-29 ruling.
- **Not reproduced:** the real report's unexplained second bar colour is kept as a colour (days below the period's average conversion are pink) without adding a legend item it does not have. STAR is shown under the report's own label; no definition is added because none is sourced in this repo.
- **FR/DE terms for native review:** Insights → FR "Insights", DE "Insights"; ATV → FR "Panier moyen", DE "ATV"; Missed turnover → FR "CA manqué", DE "Entgangener Umsatz"; Best opportunity date → FR "Meilleure date d'opportunité", DE "Tag mit größtem Potenzial"; Capture rate → FR "Taux de captation", DE "Capture Rate"; Rolling period → FR "Période glissante", DE "Rollierender Zeitraum".


## 2026-10-01 — "What you get": seven more report specimens

- **Decision:** Every scene with a received dashboard screenshot now has a specimen, one report page per scene: Retail · Store visits (Store report In-Depth), Zone engagement (Store map), Shopping Centre · Entrances (Footfall report In-Depth), Visitor composition (Landlord report), Brand counting (Location report · Shops), Brand flow (Portfolio · Retailer), Zone & anchor exposure (Portfolio · Mall).
- **Choices to review:** where a report has several pages for one scene (footfall report Overview/In-Depth; Portfolio · Operations), the page that answers the scene's question was used; unused pages remain in `work/dashboard-screenshots/` (git-ignored). Portfolio · Country and Overview belong to no scene.
- **Data and names:** all locations, shops, brands, regions, municipalities and sensors are fictional; figures from seeded fixtures (`report-fixtures.ts`), derived values computed from their rows. No third-party basemap: plans and maps are stylised stand-ins labelled "Map view · illustrative". The PFM logo shown in two reports is the approved logo asset, never a redraw.
- **FR/DE terms for native review:** YTD → FR "Cumul", DE "YTD"; Capture rate → FR "Taux de captation", DE "Capture Rate"; Brand affinity → FR "Affinité entre enseignes", DE "Markenaffinität"; Trade area → FR "Zone de chalandise", DE "Einzugsgebiet"; Dwell time → FR "Durée de présence", DE "Verweildauer"; Landlord report → FR "Rapport bailleur", DE "Vermieterbericht".
## 2026-11-03 — Automotive voorbereiding ter review

Status: **REVIEWVOORSTEL op gebruikersverzoek; geen productiegoedkeuring.**

De gebruiker vraagt Automotive in de bestaande segmentstijl voor te bereiden en de aangeleverde visuals op te slaan, vóór implementatie in de brochure. AGENTS.md noemt Retail als enige volledige go-demovertical. Automotive blijft daarom een zelfstandig lokaal reviewpakket in `docs/reviews/automotive/`, met inhoudelijke specificatie in `docs/product/AUTOMOTIVE-SEGMENT-REVIEW.md`; geen runtime- of segmentpickerwijziging.

Materieel bronconflict: het aangeleverde showroomdashboard spreekt over “genuine buying opportunities” en berekent extra deals/orderwaarde uit contacttargets. Het aangeleverde Word-document §3 zegt expliciet dat LiDAR geen koper of inhoudelijk verkoopgesprek herkent; AGENTS.md verbiedt verzonnen uplift/ROI. Het voorstel gebruikt daarom contactindicatoren, geobserveerde bestemmingen en afzonderlijke registraties, zonder target-, uplift-, prijs- of ROI-waarden. Het dashboard blijft inhoudelijke referentie. De cohortperiode en gewogen mediaan van deelmedianen vragen correctie bij eventuele hergebruikte analyses.

Automotive heeft in dit voorstel op expliciete gebruikersinstructie geen passantenverhaal of capture rate. Geo is optionele geaggregeerde context, fysiek entreevolume komt uit de voorgestelde Xovis/Milesight-meetopzet, binnentrajecten uit een nog te valideren LiDAR/Xovis-opstelling. Servicezone, medewerkercontact en deskbezoek worden niet gelijkgesteld aan bezoekdoel, gesprek, offerte of order.

Ontbrekende bron: `docs/design/DESIGN-SYSTEM.md` staat in de bronhiërarchie maar ontbreekt in deze checkout. Voor de review gelden daarom de expliciete merkregels uit AGENTS.md en de bestaande scenestijl als referentie; geen nieuw ontwerpsysteem geïntroduceerd.

Assetstatus: er was geen `location-visuals/automotive/`-map of goedgekeurde Automotive-mapping. Zestien Automotive-beelden zijn als reviewkandidaten opgeslagen in `public/assets/content-candidates/automotive/`, met origineelpad, dimensies en checksum in het manifest. De galerie toont de alternatieven; de hoofdscènes tonen een voorgestelde keuze. De portretten zijn lage resolutie en één breed beeld heeft ongedefinieerde scores. Het winkelstraatbeeld is niet als Automotive geclassificeerd. Productiehero-selectie en eventuele verplaatsing volgen na review.

## 2026-11-03 — Automotive PDF en vijf talen

Status: **GEBRUIKERSINSTRUCTIE toegepast op het reviewpakket.**

De gebruiker vraagt een deelbare PDF en stelt Engels als hoofdtaal met NL, DE, FR en ES als aanvullende talen. Vijf losse PDF’s van 14 pagina’s zijn gemaakt met dezelfde scènes, meetvoorwaarden en galerie; de lokale HTML-review heeft dezelfde taalkeuze met Engels als standaard. De canonieke fasen blijven behouden. De taalvereiste geldt als input voor latere brochure-implementatie; de overige segmenten en runtime-localecontracten zijn binnen deze PDF-opdracht niet gewijzigd. Conceptvertalingen blijven onderdeel van inhoudelijke en lokale taalreview.

## 2026-11-04 — Vaste navigatie voor PFM, services, platforms en pakketten

Status: **LOKAAL REVIEWVOORSTEL op gebruikersverzoek; geen productiegoedkeuring.**

De gebruiker vraagt een volledig klikbaar voorbeeld op basis van de bestaande online brochure en de aangeleverde PPT-screenshots, waarin Data Services, ARC, packages en Toolbox een vaste plaats in UX/navigatie hebben. Het zelfstandige voorstel staat in `docs/reviews/digital-brochure-2026-11-04/v2/`. De eerder gedeelde review-index verwijst hiernaar; de eerdere opzet is behouden als `v1.html`.

Voorgestelde vaste header: Locations / How PFM works / Platforms & insights / Service packages. PFM krijgt About / ARC / Data Services; platforms krijgen Toolbox / Advantage / Pulse / Connected data flow; packages krijgen twee vergelijkingen: Reporting & insights en Service & support. Retail behoudt de zes canonieke fasen in de bestaande volgorde. Ondersteunende pagina’s zijn globaal bereikbaar en bieden terugkeer naar de laatst geopende Retail-fase. Dit vervangt geen goedgekeurde runtime-navigatie.

Bronbehandeling: pakketwaarden zijn uit de aangeleverde screenshots overgenomen, met firmware/statusregels uit de genummerde servicematrix. Contractuele voetnoten en HLA-definitie vragen nadere publicatiecopy. Pulse wordt niet aan een pakket toegekend omdat de bronmatrix die koppeling niet maakt. ARC (Accurate, Reliable, Consistent) is gecontroleerd op de officiële PFM-site; de praktische toelichtingen zijn voorgestelde brochurecopy. Originele slides zijn lokaal beschikbaar in de reviewguide. Toolbox/Advantage-illustraties zijn schematisch, Pulse is een aangeleverde illustratieve appreferentie.

Controles: alle 25 reviewbestemmingen en hun interne links/render-assets gecontroleerd, JavaScript-syntax akkoord; typecheck en productiebuild akkoord; lint 0 fouten, 27 bestaande waarschuwingen. Projecttests 884/885 akkoord; de bestaande test op `tests/content.test.mjs:246` verwacht 2 approved visuals, terwijl de vooraf aanwezige VIS-RP-02-goedkeuring 3 oplevert. Die bronwijziging is niet aangepast voor dit reviewwerk. Visuele browser-QA/screenshots konden niet worden uitgevoerd vanwege ontbrekende toegang tot lokale browserpreview.

## 2026-11-04 — Review v2 vastgehouden als UX- en navigatiebasis

Status: **BEVESTIGD door de gebruiker als basis voor verdere uitwerking.**

De gebruiker geeft aan de complete v2-opzet voorlopig vast te willen houden. De vaste navigatie Locations / How PFM works / Platforms & insights / Service packages, de bijbehorende onderverdeling en de terugkeer naar de Retail-journey vormen daarmee de afgesproken ontwerpbasis. De canonieke zes fasen blijven behouden. Verdere aanpassingen worden in een volgende versie uitgewerkt.

De exacte lokale versie is gearchiveerd in `docs/reviews/digital-brochure-2026-11-04/snapshots/PFM_Brochure_Baseline_2026-11-04_v2.zip`. Bestands- en archiefchecksums staan in `BASELINE-2026-11-04.json` in dezelfde reviewhoofdmap. Het archief is op leesbaarheid en overeenkomende inhoud gecontroleerd. De bestaande inhoudelijke open punten en visuele verificatiebeperking blijven gedocumenteerd in de v2 README; deze bevestiging betreft de UX- en navigatierichting.

## 2026-11-04 — Eerste feedbackronde in zelfstandige v3

Status: **REVIEWVOORSTEL op gebruikersinstructie om verder te gaan met de feedback.**

Het volledige gebundelde feedbackdocument DB-01 t/m DB-21 is gelezen en afgezet tegen de vastgelegde v2. De afgebakende eerste ronde betreft DB-01/02/08/13/19/20: direct Retail-overzicht met acht klantvragen, expliciete capture- en dwell-ingangen, kortere/grotere kerncopy, minder dominant beeld, vervanging van de standaard bronfooter door uitklapbare bronuitleg en directe ARC-/privacy-ingangen. De bronlagen blijven benoemd; er zijn geen KPI’s of generieke privacygaranties toegevoegd. De dwell-uitleg volgt de alternatieve ondersteunde event-/trajectoryvereisten uit het bestaande Retail-contentmodel.

V3 staat in `docs/reviews/digital-brochure-2026-11-04/v3/`. Het volledige ID-register met gedeeltelijke verwerking, validatiepunten en latere ideeën staat in `FEEDBACK-REGISTER-2026-11-04.md` in de reviewhoofdmap. Het document is behandeld als feedbackbron; voorstellen daarin gelden niet zelfstandig als opdrachten of productiegoedkeuring.

De vier vastgelegde hoofditems en de canonieke zes fasen blijven behouden. V2 plus het baseline-archief zijn met de opgeslagen checksums op ongewijzigde inhoud gecontroleerd. De zelfstandige v3-check slaagt voor 32 bestemmingen, links, assets, terugkeer naar Retail, pakketgedrag en de afgebakende navigatie-/footerwijzigingen. Browser-/screensharevalidatie staat open. Applicatiecode is niet gewijzigd. PDF, feedbackopslag, Quotation Builder-integratie en nieuwe hoofdsegmenten zijn buiten deze ronde gehouden.

## 2026-11-05 — ARC objectdetectiedoelstelling en AI-positionering in v4

Status: **GEBRUIKERSINPUT verwerkt in lokale reviewversie; geen claim over behaalde prestaties.**

De gebruiker benoemt 98% nauwkeurigheid in objectdetecties als PFM-doelstelling en vraagt de langdurige focus op betrouwbare en consistente data te verbinden aan het gebruik van agentic business agents in de AI-era. De nieuwe bronnotitie `docs/content/PFM-ARC-POSITIONING-2026-11-05.md` onderscheidt deze aangeleverde doelstelling van een gemeten resultaat of universele prestatiegarantie. Definities van accuracy, objectklassen en validatiemethode zijn niet aangeleverd en worden niet verzonnen.

De ARC-pagina in `docs/reviews/digital-brochure-2026-11-04/v4/` toont een 98%-doelblok met scope/validatiecontext naast de AI-uitleg. Het A/R/C-paneel gebruikt klantgerichte copy. Er wordt geen live PFM-agentproduct of koppeling verondersteld. De gedeelde actie-rijstijl centreert knoppen en tekstlinks verticaal, waarmee ook de afwijkingen op About PFM en Privacy worden aangepakt. V2/v3 blijven behouden.

JavaScript-syntax en alle 32 zelfstandige reviewroutes slagen. Inhoud gecontroleerd op het onderscheid doelstelling/resultaat en de opgegeven scope. Visuele browsercontrole blijft open; het layoutprobleem en de CSS-correctie zijn gebaseerd op de aangeleverde screenshots.

## 2026-11-05 — V4 expliciet akkoord bevonden

Status: **GOEDGEKEURDE REVIEWBASIS door expliciete gebruikersbevestiging: “v4 akkoord bevonden”.**

V4 vervangt v2/v3 als vertrekpunt voor verdere uitwerking. De bevestiging betreft de gepresenteerde navigatie, inhoudsindeling, Retail-feedbackuitwerking, actie-uitlijning en ARC-copy met de 98%-doelstelling en AI-positionering. De bestaande bron- en verificatienotities blijven bewaard; de accuracy-doelstelling wordt niet omgezet in een claim over een gemeten resultaat.

De centrale review-index verwijst nu naar v4. De status staat in `docs/reviews/digital-brochure-2026-11-04/CURRENT-REVIEW.md`; het goedgekeurde archief is `snapshots/PFM_Brochure_Approved_2026-11-05_v4.zip`, met bestands- en archiefchecksums in `BASELINE-2026-11-05-v4.json`. Archiefintegriteit en het ongewijzigd blijven van de eerdere v2-baseline zijn gecontroleerd. Vervolgwijzigingen krijgen een volgende versie. Er is geen deployment uitgevoerd.

## 2026-11-05 — Bestaande segmentervaring behouden bij integratie van v4

Status: **GEBRUIKERSVERDUIDELIJKING bij de v4-goedkeuring.**

De gebruiker vraagt te bevestigen dat de overige segmentpagina’s, beelden, voorbeelden en rapportages niet volledig naar de losse v4-review zijn overgenomen en benadrukt de kwaliteit van de huidige brochure. Bevestigd: de Advantage-visual in v4 is een schematisch reviewvoorbeeld. De bestaande runtime bevat onder meer StoreReportSpecimen, FootfallReportSpecimen, LocationReportSpecimen, CatchmentReportSpecimen, StoreMapSpecimen, LandlordReportSpecimen en PortfolioSpecimen. Deze zijn niet door het schematische voorbeeld vervangen.

Integratierandvoorwaarde: behoud de huidige segmentpagina’s, goedgekeurde assets, rapportvoorbeelden en soepele interacties. Verbind de v4-navigatie, afgesproken aanvullingen en gerichte feedbackwijzigingen aan die bestaande ervaring. V4-goedkeuring geldt niet als toestemming om bestaande rapportages of beelden generiek te vervangen door de tijdelijke mockups. De verduidelijking is ook vastgelegd in CURRENT-REVIEW.md; de goedgekeurde v4-bestanden en het snapshot blijven intact.

## 2026-11-05 — Automotive contactkansen en actiegerichte output

Status: **REVIEWVOORSTEL bijgewerkt op basis van expliciet aangeleverde collega-feedback.**

De gebruiker vraagt de commerciële meerwaarde sterker te maken en levert een dashboard aan als mogelijke “What do we get?”-verdieping. De tien Automotive-scènes behouden de canonieke fasen; contactgaten, tijdige reactie, piekdekking, modelpresentatie, marketing en CRM-opvolging worden concreter. Twee verdiepingen tonen een illustratief outputvoorbeeld en de lus detecteren → reageren → evalueren. De vijf lokale taalversies en PDF's worden bijgewerkt; de bestaande brochure-runtime en de elders goedgekeurde v4-reviewbasis worden niet vervangen.

De collega bevestigt telefoon-/smartwatchmeldingen als reeds mogelijke functie. Dit wordt als aangeleverde productinput gebruikt met configuratievoorwaarden, niet als onbevestigde algemene vendorclaim. Deze review verstuurt geen meldingen. Komende implementatie vraagt een versiecontract, valide personeelsonderscheid, regelversie, routering, beschikbaarheid, herhaalonderdrukking en escalatie.

Materieel interpretatieverschil: de bron noemt 60s modelverblijf “geïnteresseerd”, contact “verkoopgesprek” en toont live-status, groepen/ bezoekers door elkaar en vertrekken na de zichtbare peildatum. De herbouwde output gebruikt daarom fictieve Northstar Retail Group-data en expliciete definities. 60s verblijf is een gedragsregel, geen koopintentie; geen gedetecteerd contact is geen bewijs van geen gesprek of verloren omzet. De definitieve, onafhankelijk fictief aangemaakte fixture bevat 68 geldige persoonsbezoeken = 40 met contact + 22 vertrokken zonder contactsignaal + 6 nog aanwezig zonder contactsignaal, op 96 showroombezoeken; contactsignaaldekking is afgerond 59%. Drempels 60s/90s en waarden zijn illustratief. De zeven CRM-offertes en drie orders blijven aparte dagregistraties zonder bezoekcohortconversie. Geen benchmark, uplift of bewezen campagne-effect toegevoegd.

De originele screenshot is intern bewaard met checksum in docs/reference/automotive/. Geen PON/CUPRA-klantcase of live productkoppeling wordt hiermee geclaimd. De gelokaliseerde “What do we get?”-weergave is een inhoudelijk bespreekvoorbeeld, geen toezegging dat elk productscherm exact zo wordt geleverd.

## 2026-11-05 — Xovis 3D-trackingvideo bij Retail in-store analytics

Status: **GEBRUIKERSINSTRUCTIE verwerkt in de bestaande Retail-ervaring.**

De gebruiker identificeert `public/assets/videos/xovis-tracking-video.mp4` als voorbeeldmateriaal voor 3D-tracking in een winkel en vraagt het naast de LiDAR-uitleg te tonen. De clip is daarom verplaatst uit de entree-meetvideo als vervolgweergave en gekoppeld aan Retail TECH-04 / de bestaande `3d-path-tracking`-aanpak. In de technische zijlade en Configure heeft Retail nu afzonderlijke keuzes “See LiDAR in a store” en “See 3D tracking in a store”. De LiDAR-rapportageclip blijft als afgeleide vervolglaag onder LiDAR.

De Xovis-clip toont een afgeleide trackingweergave, niet de ruwe fysieke meetomgeving; de UI labelt dat onderscheid. Videoresolutie is nu per segment en meetmethode, zodat de Retail-storeclip niet naar Shopping Centre of andere segmenten lekt. De oorspronkelijke Xovis-entreeclip blijft ongewijzigd als directe meting zonder de verkeerde trackingvervolgclip.

## 2026-11-05 — Review van een klantgerichte follow-up

Status: **reviewprototype op verzoek van de gebruiker**. De geïntegreerde review krijgt een aparte Follow-up-ingang met een expliciete selectie voor Retail en een lokaal gegenereerd, zelfstandig HTML-bestand. Geopende scènes gelden niet automatisch als besproken onderwerpen. De bestaande Conversation Brief en zijn `brief-v1`-contract blijven beschikbaar; de nieuwe samensteller doet geen CRM- of n8n-aanroep en verstuurt niets. Andere segmenten zijn zichtbaar als toekomstige uitbreiding. Certificering en hosting verwijzen voorlopig naar het PFM-contact; SOC 2, certificaatbereik en hostingclaims worden niet ingevuld zonder bevestigde bron. De gegenereerde pagina draagt een reviewlabel en is nog geen goedgekeurd klantdocument.

## 2026-11-05 — Aanvulling follow-up met sensorprofielen en PFM-bronbeelden

De gebruiker levert een 3D-dieptebeeld, een illustratie van IP-privacy masking en slides voor certificeringen, Data Services en Toolbox/AWS-infrastructuur aan voor gebruik in de follow-up. Deze zijn opgeslagen onder public/assets/follow-up. Specificaties en installatievoorwaarden komen uit de bestaande implementationRequirementProfiles en hun EN/DE/FR-vertalingen, alleen voor expliciet gekozen meetmethoden. Modelnamen blijven zichtbaar; een videoframe bewijst geen sensorhardwarekeuze of specificatie. De certificeringsslide noemt geen SOC 2; PFM krijgt daarom geen SOC 2-status toegekend. RI&E wordt als proces beschreven. De screenshots van Engelstalige bron-slides behouden hun oorspronkelijke taal naast vertaalde toelichting.

## 2026-11-05 — PFM-informatie als opgemaakte copy, geen ingeplakte slides

Status: **GEBRUIKERSVERDUIDELIJKING verwerkt in de brochure en follow-up review.**

De gebruiker geeft aan dat eerdere follow-up-output te veel losse screenshots bevatte en deelt `public/assets/context/PFM-info-for-brochure.pptx` als tekstbron voor About PFM, Data Services, Toolbox/infrastructuur, accreditaties en maatschappelijke bijdrage. De Data Services-, Toolbox- en accreditatieslides worden niet meer als ingeplakte afbeeldingen in de klantoutput getoond; de inhoud is herzet in PFM-gestileerde tekstblokken en compacte rijen. Bestaande product-/sensorbeelden blijven alleen bij relevante gekozen onderwerpen.

De bestaande vaste About PFM-pagina en standaard PFM-sectie in de Follow-up noemen nu ook de Accessibility Fund, het werk rond KNGF en eZwayZ en de bijdrage per verkochte data licence. Dezelfde About-sectie bevat de bereikcijfers die de deck noemt: 500+ shopping centres, 25.000+ retail locations en 1.500+ drive-thru locations. Ze blijven bronclaims, geen eigen berekende resultaten. Data Services, Toolbox/AWS-datastroom en de in de deck genoemde standaarden/accreditaties zijn klantgericht als tekst opgenomen; RI&E staat expliciet als risicobeoordelingsproces.

SOC 2 staat niet in de aangeleverde deck en wordt niet genoemd of gesuggereerd. De gebruiker kondigt aanvullende informatie aan; eventuele SOC 2-status, scope en hostingdetails blijven open totdat die inhoud beschikbaar is. Vertalingen zijn EN/DE/FR.

## 2026-11-05 — Twee PFM-opmaakvarianten voor klant-follow-up

Status: **GEBRUIKERSINSTRUCTIE verwerkt in de reviewgenerator.**

De gebruiker levert twee lokale HTML-bronvarianten aan in `public/assets/content-candidates/html output/`: de UK Brand-template met donkere cover en PFM-rode accenten, en de Light Version-template met lichte cover en paarse accenten. De Follow-up-preview biedt nu beide opmaakkeuzes. De gekozen variant wordt meegenomen in het zelfstandige HTML-bestand en de downloadnaam. Onderwerpkeuze, inhoud, brongebonden toelichtingen en relevante illustraties blijven hetzelfde; de bron-HTML wordt gebruikt als stijlreferentie, niet als vaste statische klantoutput. Geen commerciële voorwaarden of ongevalideerde claims uit de referentie worden geïmporteerd.


## 2026-11-06 — Klant-follow-up: technische inhoud en opmaak

De klantpresentatie PFM-retail-solutions.pptx (2024, 28 slides) is onderzocht als inhoudelijke referentie. De volgorde klantvraag, meetprincipe, installatie en technische gegevens wordt overgenomen. De legacy radar- en LiDAR-specificaties worden niet aan huidige IP- of RoboSense-modellen toegeschreven. Claims van 99% en absolute GDPR-compliance conflicteren met de huidige bronregels en ARC-doelstelling; de bestaande modelspecifieke requirement profiles blijven leidend.

Selecties voor store visits en visitor composition voegen automatisch een 3D-entrance-voorbeeld toe; spatial journey/zone-selecties voegen 3D-tracking en LiDAR als alternatieven toe. Street opportunity gebruikt de huidige IP-detection-route, niet de legacy radar uit 2024. Technische hoofdstukken worden gededupliceerd en als voorbeeldimplementatie benoemd. De selectiekaart vermeldt welke technische uitleg wordt toegevoegd.

Data Services, Toolbox en certificeringen worden opgebouwd uit HTML-tekst en schemaonderdelen; volledige slides worden niet meer als uitvoerafbeeldingen opgenomen. De HTML bevat hoofdstuklinks, consistente beeldkaders en een afzonderlijk technisch gedeelte.

## 2026-11-06 — Portable customer HTML and Proforto reference

The supplied six-page Proforto PDF is used as a layout reference: a balanced hardware/explanation row, practical installation facts and compact model-specific specifications. Customer names, prices, UWB scope and absolute privacy statements are not copied into the generic brochure output. Existing verified implementation profiles remain the source for the four current method sheets (3D entrance, 3D spatial, LiDAR, IP detection).

The HTML renderer and styles now live in app/lib/customer-document, independent of React and pricing. Brochure output uses this renderer. output/customer-html-template-v1 includes source, plain JavaScript, example data and both standalone themes for Quotation Builder handoff. Integration into the separate Quotation Builder remains a separate action.


## 2026-11-06 — Certificeringen vastgelegd
De aangeleverde PFM_Brochureteksten_Per_Onderwerp.docx, onderdeel 02, is verwerkt in app/content/pfm-certifications.ts (EN/DE/FR). De vaste brochurepagina #pfm/certifications en de HTML-selectie assurance lezen dezelfde inhoud. De zeven onderdelen zijn afzonderlijk uitgewerkt; RI&E wordt als risicobeoordeling benoemd. Certificaten blijven entiteit- en scopegebonden. SOC 2 wordt niet genoemd in deze bron. De absolute privacyclaims uit het document zijn niet universeel toepasbaar op alle implementaties; de huidige implementatiespecifieke uitleg blijft leidend.

## 2026-11-06 — Visual surfaces, portfolio proof and portable PDF layout
Hardware cutouts were derived from the three supplied product photos with transparent alpha and saved as sibling assets in public/assets/follow-up/hardware. Bosch already has alpha. Original imagery is retained. The customer document now supports per-image stage colour (black tracking/LiDAR, blue Xovis depth view). About PFM always embeds six portfolio logos from the previously approved customer-logos registry, with a configurations-vary caption.
The generator and standalone HTML expose PDF printing. Dedicated A4 CSS preserves backgrounds and uses technology-page breaks. The portable handoff package documents section order, wording, visual treatment, source rules, logo usage and PDF export. No quote pricing logic is imported into the brochure.


## 2026-11-06 — Geïntegreerd in brochure en salesoutput
De transparante varianten zijn nu de hardwarebeelden in de centrale implementationVisuals-registry voor alle bestaande segmenten. De brochure toont de foto's volledig met contain; videovlakken gebruiken zwart. De algemene About PFM-pagina en de selectie-export delen de goedgekeurde compacte customerProofLogos-set. De bestaande salesgenerator gebruikt de portable HTML-renderer, technische selectieprofielen, certificeringsinhoud en A4-PDF-opmaak. Het betreft de bestaande review-implementatie; er is geen externe publicatie uitgevoerd.


## 2026-11-06 — Eén geïntegreerde journeyheader
Tijdens een segmentjourney beheert de bovenste reviewheader het merk, taalkeuze, segment/scènecontext, canonieke fasen, voortgang, herstart en onderwerpingang. De header en fasenbalk van het same-origin journeyframe worden in geïntegreerde modus verborgen. De getoonde labels/status worden uit de bestaande journey afgeleid; herstart en taal blijven de oorspronkelijke handlers gebruiken. Zelfstandig geopende journeys behouden hun header.

## 2026-11-17 — Retail passerendetelling: alternatieven in review

Er is een concept opgesteld voor radar (SensMax TAC-B) en Bosch IP-objectdetectie als alternatieven voor de momenteel niet leverbare Milesight VS361. De twee aangeleverde beelden zijn uitsluitend conceptuele uitleg, geen meetbereik, installatieplan of prestatiebewijs. De TAC-B-datasheet noemt TAC-B 3D-WP; de productinput noemt TAC-3D EWP. Deze modelidentiteit moet worden bevestigd voordat modelgebonden claims live gaan. De Bosch-fiche betreft FLEXIDOME micro 3100i outdoor; er is geen indoor-datasheet aangeleverd. Passanten buiten de gevel blijven semantisch gescheiden van winkelbezoeken aan de entree. De VS361-beschikbaarheid en opvolgertiming zijn productinput, geen fabrikantbevestiging.

## 2026-11-17 — Automotive in geïntegreerde review

Status: **Nederlandse reviewimplementatie op expliciet gebruikersverzoek; niet gepubliceerd.** De zes canonieke fasen en tien Automotive-scènes zijn toegevoegd binnen de bestaande geïntegreerde review. De segmentkeuze en navigatie openen de reviewroute; de bestaande brochure en talen blijven behouden. De bestaande NL-reviewcopy en fictieve fixtures worden hergebruikt; het dashboard en telefoon-/smartwatchvoorbeeld zijn illustratief en gesimuleerd. Geo is een afzonderlijke contextverdieping.

Materiële scopeafweging: AGENTS.md noemt Retail de enige volledige go-demovertical; de gebruiker vraagt nu expliciet Automotive ter review. De toevoeging is beperkt tot de afzonderlijke geïntegreerde review en wordt niet voorgesteld als productiegoedkeuring. De huidige geïntegreerde brochure ondersteunt EN/DE/FR; Automotive zelf is voorlopig Nederlandstalig, met de bestaande navigatie daaromheen. Er bestaat geen goedgekeurde automotive-map onder location-visuals; de eerder getoonde beeldkandidaten blijven expliciet kandidaten en vormen geen productiehero-goedkeuring.

Controle: lint 0 fouten met 34 waarschuwingen, typecheck en build geslaagd; 883/885 tests geslaagd. De twee bestaande falende tests betreffen visual-registry-aantallen en een test over de bestaande picker. Browsercontrole: Automotive-ingang, eerste en laatste fase en dashboard geopend. Volledige visuele controle op beide opgegeven formaten is nog niet uitgevoerd.

## 2026-11-18 — Automotive review volgt de bestaande brochure-UX

Status: **correctie ter review op expliciete gebruikersfeedback.** De eerdere Automotive-review had eigen tabbladen en een extra hoofdnavigatie-ingang. De gebruiker vroeg Automotive als normaal segment binnen de bestaande brochure-UX. Automotive is daarom als kaart onder Locations bereikbaar; de extra hoofdnavigatie-ingang is verwijderd. De review gebruikt de bestaande scèneklassen en voortgangsbalk, de gedeelde WhatYouGet-component en een Nederlands zijpaneel met dezelfde structuur als de bestaande verdieping. De zes canonieke fasen blijven behouden.

De route blijft een Nederlandstalige geïntegreerde review, zonder externe publicatie. De bovenliggende bestaande brochure ondersteunt EN/DE/FR en is niet globaal naar NL omgezet. Automotive-beeldbestanden blijven kandidaten: er is geen goedgekeurde production-hero-map en geen productiegoedkeuring afgeleid. De dashboardwaarden blijven fictief en illustratief; CRM-cijfers zijn afzonderlijke registraties en de melding is gesimuleerd.

De vergelijking met de aangeleverde screenshots is uitgevoerd, evenals een browsercontrole van de kaart, scène, rapportwissel en zijpaneel. Volledige visuele verificatie op 1440×900 en 1024×768 blijft een open reviewpunt. Typecheck, lint en build slagen; twee al aanwezige projecttests falen (visual-registry-aantal en bestaande picker-test).

## 2026-11-18 — Productbeelden en SensMax-model bevestigd

De product lead bevestigt SensMax TAC-3Dn EWP als de gebruikte radar en leverde een radar- en Bosch-productbeeld aan. Beide beelden zijn opgenomen in de Retail-technologiekaarten. De eerder aangeleverde SensMax-fiche noemt TAC-B 3D-WP; de bevestiging van het gekozen model bewijst niet dat die fiche hetzelfde model beschrijft. Daarom worden de modelspecifieke waarden uit die fiche niet aan TAC-3Dn EWP toegeschreven totdat een passende fiche of bevestiging beschikbaar is. De Bosch-fiche beschrijft FLEXIDOME micro 3100i outdoor NUE-3703-F04.

## 2026-11-18 — Integrated review and Automotive preview boundary

The approved v4 navigation and PFM, platform, service-package and follow-up content are available through the local `/preview/integrated` review route, alongside the existing segment journeys. Per the user's current direction, the route also contains a Dutch Automotive review journey. This is local review material, not a launch or production integration; Retail remains the only complete go-demo vertical.

## 2026-11-18 — Compact sensor requirements and configured privacy

The shared brochure drawer groups mounting, network, power and processing requirements by sensor. Detailed specs remain expandable. Installation accreditations remain in their dedicated content. The product lead confirms on-device processing, active blur and no video storage or transmission for PFM’s Bosch IVA Traffic configuration. The brochure scopes that description to PFM’s setup because the supplier documentation describes configurable modes.

## 2026-11-19 — Integrated navigation promoted to the live brochure

The user explicitly directs that the integrated v4 brochure experience be applied to the live brochure, after previously reviewing it at `/preview/integrated`. The root route keeps the existing Unified PFM Intro, then opens the integrated Locations experience with the global `How PFM works`, `Platforms & insights`, `Service packages` and `Follow-up` sections. Existing segment journeys remain embedded from the shared journey implementation. The preview route continues to use the same experience and keeps its review label. Automotive remains preview-only because the user clarified that it is being implemented today, while the product scope still treats Retail as the only complete go-demo vertical; no Automotive launch was inferred.

## 2026-11-19 — Klantbrochure via de bestaande Sales-export

De aangeleverde HTML-voorbeelden bepalen de visuele familie. De brochurevariant bouwt toepassingen, meetmethoden, rapportage en vervolgstap uit de Sales-selectie op. De selectie bevat geen gespreksbron, dus de klanttekst schrijft geen uitspraken aan de prospect toe. De bestaande technische profielen, privacybeschrijvingen en vrijgegeven portfoliologo's blijven leidend. Het illustratieve Advantage-uurprofiel komt uit het aangeleverde brochurevoorbeeld en wordt alleen bij entreetelling opgenomen. Automotive-reviewbeelden hebben geen vrijgave voor deze uitvoer.

Het footerconcept en de [officiële PFM-contactpagina](https://www.pfm-intelligence.com/contact) noemen Redditch, terwijl de interne PFM-company-facts Birmingham noemt. De export gebruikt het actuele adres uit de contactpagina. Andere schermen en de referentiebestanden zijn buiten deze correctie gehouden.

De Retail-correctie gebruikt de twee bestaande contextbeelden uit de journey en generieke sensornamen. De IP-specificaties gelden voor het getoonde outdoor-voorbeeld (NUE-3703-F04, aangeleverde fabrikantdatasheet). De afbeelding en specificaties verwijzen naar dezelfde hardwarefamilie. De passantenrapportage gebruikt de bestaande illustratieve Northstar-tijdvakken en geaggregeerde passantenwaarden. Het aangeleverde In-Depth-scherm bevat ook winkel- en verkoop-KPI’s en wordt daarom niet integraal als passantenrapport weergegeven.

## 2026-11-20 — Bestaande rapportpanelen in de klantbrochure

Your reporting gebruikt uitsneden van de bestaande What you get-rapporten voor de bijbehorende Retail- en Shopping Centre-onderwerpen. De exports sluiten alleen de gekozen panelen in. De Engelse rapportbeelden behouden hun oorspronkelijke labels en krijgen een bijschrift in de exporttaal. Voor winkelbezoeken is het weekdag-/uurpaneel gebruikt, zodat de In-Depth-pagina geen ongerelateerde capture- en verkoopcijfers meeneemt. Het bestaande passantenvoorbeeld blijft bij de passantenmeting.

### 2026-11-25 — SensMax TAC-B EWP in Follow-up

De product lead corrigeert het radarmodel naar **SensMax TAC-B EWP**, ter vervanging van de eerdere aanduiding TAC-3Dn EWP. De technische gegevens in Follow-up zijn gebaseerd op de modelspecifieke fabrikantdocumentatie (https://docs.sensmax.eu/tac-b-radar-sensors/tac-b-ewp/0-tac-b-ewp-overview/) en productpagina (https://sensmax.eu/devices/sensmax-tac-b-ewp-poe-indooroutdoor-radar-people-counting-sensor/), geraadpleegd 2026-11-25. Die bronnen verschillen over aanbevolen montagehoogte en maximale snelheid in wandmodus; deze waarden blijven buiten de brochure tot bevestiging. Claims over nauwkeurigheid en absolute privacy blijven buiten de demo conform de truth rules. De bestaande productafbeelding is eerder aangeleverd onder de oude modelnaam; bevestiging dat deze het TAC-B EWP-model toont staat open.

## 2026-11-25 — Donatiegrondslag in Over PFM en follow-up

Op verzoek van PFM noemt de brochure € 0,50 per aangesloten sensorpunt voor het Accessibility Fund en gebruikt ze KNGF Geleidehonden als concreet voorbeeld. Dit vervangt de eerdere formulering per verkochte datalicentie. De publieke toegankelijkheidspagina noemt een bijdrage per verkochte sensor. De brochure en de gegenereerde follow-up delen de door PFM opgegeven grondslag.
