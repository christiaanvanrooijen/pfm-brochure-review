# Content review — drawer-content-v1

**Baseline:** `pfm-commercial-experience/drawer-content-v1-2026-09-27` (`f3f5830`).  
**Reviewed:** all 37 Core pages in the five demo journeys at 1024 × 768, their typed content and five drawer sections; the Retail page at 1440 × 900; the Outlet entrance drawer at 1440 × 900. Contact sheets and individual captures are in the ignored local directory `outputs/content-review-2026-09-27/`.  
**Scope of this pass:** customer-facing text and content truth. No layout, hero, navigation or interaction change.  
**Second pass:** 2026-09-28 — Retail completeness, source scoping and name leaks; see § What changed in the 2026-09-28 pass.

## What has been completed

- The How it works section now explains the measurement approach in words for each segment and capability, including places without an approved illustration. The wording distinguishes direct physical measurement, aggregate mobile/geo context, customer-supplied business information and derived interpretation. It does not turn a missing illustration into a borrowed image. Source: `docs/content/README.md` §§ Where the content lives today, The rules every text is held to; `app/content/technology.ts` capability `sourceRefs`; `app/content/scene-drawer-overrides.ts` scene and segment purposes.
- The Retail visitor-composition page now tells a reader that no illustrative result is shown and names the inputs needed for a reading, without exposing the internal “approved demo values” and “waiting on” phrasing. Source: `app/content/segments/retail.ts` scene `retail-visitor-composition`; `app/content/evidence-inputs.ts` input IDs; `docs/design/RETAIL-VISUAL-POLISH-BACKLOG.md` § Presentation Mode item 1.
- Internal proof notes on the existing Retail, Shopping Centre and Retail Park scene pages now state “Method shown; no customer result claimed.” This accurately describes the current proof registry without promising an upcoming case. Source: `app/content/proof-assets.ts` placeholder records and `app/content/proof-runtime.ts` external-use gate; `AGENTS.md` Truth rules.

## Reconciliation with the product lead's workbook

The filled `PFM-drawer-content-inventory.xlsx` is an editorial input, not a runtime source. Its `Capabilities` sheet has 26/26 proposed illustration captions (rows 3–28), the `Implementations` sheet has 23/23 proposed one-line limitations (rows 3–25), eight site-essential entries and five candidate privacy statements. The current Core drawer now resolves 24 distinct implementations, so the filled workbook is not a current one-to-one implementation inventory. The generator intentionally leaves the fill-in CSV columns blank; copying the workbook into those CSVs would not make the app display the text. Source: `docs/content/PFM-drawer-content-inventory.xlsx`, sheets `Capabilities!K3:K28` and `Implementations!P3:R25`; `scripts/content-inventory.mjs` emission section; `docs/content/README.md` § Where the content lives today.

- **Captions:** kept with the proposed artwork. Most refer to an illustration that is not yet approved or present; showing them under an empty image slot would describe something the reader cannot see. The new method copy supplies the missing verbal explanation now. Source: workbook `Capabilities!K3:K28`; `docs/content/EXPLAINER-BRIEF.md` § The six.
- **Limitations:** compared with each implementation's `unsupportedClaims`. The first blocked claim already renders on every Technology card, but some wording is internal validation language. Safe workbook phrasing is being adapted into customer-facing copy with its own translations and source trail; an unsupported Re-ID retention or identity detail is not promoted. Source: workbook `Implementations!P3:P25`; `app/content/technology.ts` `unsupportedClaims` and `sourceRefs`; `docs/reference/technology/SOURCE-REGISTRY.md` § Rules this registry enforces.
- **Essentials:** eight rows are filled in the older workbook; the current Core drawer resolves 24 distinct implementations and has seven site profiles. Five workbook rows overlap those profiles. The Isarsoft and anonymous-matching rows do not currently resolve in the Core drawer, while the Tattile row needs legal and site validation before being promoted. The two newly added IP detection profiles are in the runtime but not that workbook baseline. Source: workbook `Implementations!Q4:Q25`; `app/content/technology-visuals.ts` `implementationRequirementProfiles`; regenerated `03-implementations.csv`.
- **Privacy and proof candidates:** remain candidates. A product-lead sentence or a public supplier video is not, by itself, product privacy evidence or approved customer proof. Source: workbook `Implementations!R16:R25` and `Media register`; `AGENTS.md` Truth rules; `docs/content/README.md` §§ Privacy statement, Proof of practice.

## What cannot honestly be filled from the current sources

| Content | Current position | Needed before publication |
| --- | --- | --- |
| Customer cases, results and “In practice” | 37/37 Core pages have no externally approved customer proof. The section remains an explicit unavailable state. | Approved case asset, consent, named source and external-use status for each case. Do not repurpose an illustrative scene or supplier demonstration as a customer result. Source: `app/content/proof-assets.ts`, `docs/content/README.md` § Proof of practice, `AGENTS.md` Truth rules. |
| Privacy detail | Only implementation-specific statements with mapped evidence may be shown. Unmapped options retain their evidence-status message. | Manufacturer/product privacy documents, scope and validation; in particular, do not inherit Xovis evidence for other devices. Source: `docs/reference/technology/SOURCE-REGISTRY.md` §§ Rules, Xovis; `app/content/technology.ts` implementation `privacyStatus`. |
| Installation essentials | Several options remain without a source-backed site profile. Generic cabling, mounting ranges or installation promises would be invented. | Product documentation and site-design confirmation for each implementation; translate and validate before rendering. Source: `docs/content/README.md` § Installation essentials; `app/content/technology-visuals.ts` `implementationRequirementProfiles`. |
| Illustrations and photographs | The missing assets are listed by segment and capability in `02-capabilities.csv` and by implementation in `03-implementations.csv`. The six priority principle illustrations have a complete production brief. | Produce/approve the six segment-specific explainers; verify product-image rights and source, especially HME and Xovis. Source: `docs/content/EXPLAINER-BRIEF.md` §§ The six, The rules; `docs/checkpoints/DRAWER-CONTENT-V1.md` § Open. |

## Review by journey

The lists below cover every Core page. Every page has an authored question, supporting line, truth boundary, lens sequence and next step in the typed scene and locale copy. The recurring content gap is in the deeper explanation or evidence, not in the page headline. Source: `app/content/segments/`, `app/i18n/scenes.ts`, `app/i18n/qsr-journey.ts`, `docs/content/01-views.csv`.

| Segment | Core pages reviewed | Content finding |
| --- | --- | --- |
| Retail | Street opportunity; Store visits; Visitor composition; In-store journey; Zone engagement; Conversion & sales context (6/6). | The complete demo story is present. Visitor composition needed a customer-readable empty state. Classification and business connection still need source-backed product/privacy detail; no case result can be claimed. |
| Shopping Centre | Catchment area; Centre entrances; Visitor composition; Internal circulation; Zone & anchor exposure; Brand counting; Brand flow; Time in centre (8/8). | The pages distinguish aggregate catchment from measured entrances and bounded internal movement. Several drawer approaches lacked their own artwork; method text now carries the explanation while visuals await approval. |
| Retail Park | Catchment area; Vehicle arrival; Parking occupancy; Unit visits; Cross-visitation; Time on site; Unit & category exposure (7/7). | Vehicle, bay, unit and visitor units are kept separate. Arrival/parking and matching options need implementation-specific sources, photographs and privacy validation. |
| Outlet Centre | Destination catchment; Tourism & origin context; Vehicle & coach arrival; Centre entrances; Visitor composition; Circulation; Zone exposure & dwell; Brand counting; Brand flow; Time in destination (10/10). | The copy distinguishes origin context, arrivals, store thresholds and cross-store movement. The visual compromises are recorded in `app/content/outlet-asset-decisions.ts` and already have explicit segment-owner sign-off; see the separate visual proposals below. |
| Drive-Thru Performance | Drive-thru context; Queue formation; Order point & guest communication; Bottleneck diagnosis; Real-time response; Estate performance (6/6). | The six-scene operational story is written. Supplier-specific HME images, tier/availability evidence and case proof remain unapproved or unmapped; no performance outcome is asserted. |

## Visual and navigation proposals — status after the 2026-09-28 improvement pass

The first 2026-09-28 pass held these as proposals because its scope was text only. The improvement pass later that day was authorised to make targeted UX, visual and navigation changes; the status of each is below. The details are in § What changed in the 2026-09-28 improvement pass.

1. **Outlet hero fit — reviewed, unchanged.** The Outlet catchment aerial, arrival frame and centre-entrance frame stay as accepted, with their sign-off visible. Every production file in `public/assets/location-visuals/outlet-centre/` was opened and each is already recorded against these scenes as an alternative or a rejection. The two newer candidates in `public/assets/content-candidates/` were opened and are not usable: `outlet-centre-anpr-entrance-reference.png` shows a retail park with a legible plate, date and time burnt in; `outlet-centre-people-vehicle-detection-reference.png` shows a retail park with detection confidence scores and a count panel burnt in. Both stay reference-only. Open-air outlet imagery for these three scenes remains a production task. Source: `app/content/outlet-asset-decisions.ts`.
2. **Drawer illustration coverage — done, as schematic illustrations.** The six concepts in the brief, plus proposal 5, are drawn and wired. See below.
3. **Lens rail at 1024 × 768 — done.** The supporting lines stay visible, set compactly. See below.
4. **Shell continuity — premise corrected, no routing change.** `/shell` does not show “next demo slice” Prove and Configure panels for Retail: the stage router renders `RetailConversionSalesContextScene` for Prove and a Configure scene for every Configure stage before it reaches the legacy `StagePanel`, so `PlaceholderPanel` is unreachable in the Retail journey. Routing is unchanged, and the unreachable code was deliberately not removed as a stand-alone clean-up. The one presenter-visible trace was the entry disclaimer; see proposal 7. Source: `app/components/CommercialExperience.tsx` stage branch.
5. **Retail visitor-composition illustration — done.** Schematic, see below.
6. **Vendor names in Configure — done.** Functional names, on the product lead's instruction. See below.
7. **Shell entry disclaimer — done.** Now reads: “No records will be changed. All account and opportunity data shown here is simulated.” Source: `app/components/CommercialExperience.tsx`.

## What changed in the 2026-09-28 pass

Scope: text and content truth only. No image, layout, navigation or interaction was changed. Two statements in this section were later superseded the same day and are marked where they stand.

**Every Retail drawer, audited as a reader sees it.** All six Retail Core pages were walked through the drawer's own resolver in English, French and German: method copy, implementations, limitations, installation essentials, privacy status and proof. Every capability has method copy in all three languages. The gaps found and closed:

| Where | What a reader saw | Now |
| --- | --- | --- |
| Stereo Vision sensor Basic FoV — Technology (Retail pages 1, 2, 3, 6 and every other segment) | “Limitation: Equivalence with the 3D Sensor Basic FoV in accuracy…” — a refused claim, not a limitation | The workbook's own sentence: counts crossings at configured lines; cannot follow a visitor beyond the covered area or establish purchase intent. Workbook `Implementations!P19`; `technology.ts` `supportedClaims[2]`. |
| IP Detection Sensor indoor/outdoor — Technology | “Limitation: A count or a route outside the configured views…” | Measures only inside its configured views; no count and no route outside them; re-identification never establishes identity. `technology.ts` `unsupportedClaims[0–1]`. |
| 3D Sensor Basic FoV outdoor — Technology | “Any figure from the indoor sensor's datasheet…” | Counts crossings at its threshold; no specification stated until its own documentation is mapped. |
| LiDAR 360° 92 Beam sensor — Technology (Retail pages 4, 5) | “Airy outputs a point cloud; the mapped sensor source…” — a model name and internal wording | Outputs a point cloud; its own documentation does not cover how visitors move; that depends on a separate analytics layer. `SRC-ROBOSENSE-AIRY-TECH-001`. |
| Stereo Vision sensor — Privacy | “selectable no-image preview modes” — plural, reading as an image-free device | The manufacturer describes image processing on the device, depth and colour images used to detect people; one of three preview modes shows no image. `SRC-MILESIGHT-VS125-PRIVACY-001` pp. 7–10. |
| Stereo Vision sensor — Configure blocked claims | “The manufacturer's own 99.8% counting-accuracy figure…” | The figure is no longer repeated; the boundary remains. A percentage shown to a prospect is read as a result. |

**Privacy attribution.** Vendor privacy claims now say whose claim they are — “The supplier states…”, “The manufacturer describes…” — without naming the vendor, which the product lead's naming rule forbids in the brochure. The vendor, document and page stay in the source ID. The conflict and its resolution are recorded in `docs/decisions/DECISION-LOG.md`, 2026-09-28.

**Name leaks in shared content.** An HME limitation and a ClearSoundX claim named “NEXEO”; both reworded. `tests/technology-presentation.test.mjs` test 10 now scans the reviewed limitation and method layers, which the earlier naming test could not reach — that gap is how “Airy” and “NEXEO” got through.

**Source registry.** `SRC-BOSCH-IVA-PRO-PRIVACY-001` was recorded as not mapped to the two IP detection sensors: the whitepaper is scoped to CPP14 platforms and named firmware, and neither FLEXIDOME model was shown to be within it. *(Superseded: the product lead confirmed both are CPP14 and the document is now mapped, within its limits — see the improvement pass below.)* The PC2SE-O is recorded as not covered by the PC2SE datasheet or the Xovis certificate. The five supplied sources are used only within their stated scope: Isarsoft for attributed vendor privacy features only; Milesight for described processing and available preview modes; Bosch for no current implementation; Xovis for the PC2SE and PF-L only; OPTEX for nothing.

**Inventory.** `03-implementations.csv` was one claim behind the runtime and has been regenerated. The product lead's filled workbook was not touched.

**The long-standing test failure.** *(Superseded.)* This pass removed `outlet-centre-visitor-composition-hero1.png` from the rejection list because the file was missing from disk. The product lead then found the file, and it has been restored; see the improvement pass below.

## What changed in the 2026-09-28 improvement pass

Scope: the product lead authorised limited, targeted UX, visual and navigation changes. The canonical journey, the Retail Prove and Configure routing, 1440 × 900 and 1024 × 768 support, keyboard navigation and reduced motion are unchanged.

**The restored Outlet frame.** `outlet-centre-visitor-composition-hero1.png` is back in `public/assets/location-visuals/outlet-centre/`, byte-identical to `retail/retail-visitor-composition-hero.png` — as the original rejection recorded. It stays rejected for the scene (a store interior is not an outlet) and now names the file it duplicates. `tests/outlet-asset-decisions.test.mjs` compares the two byte for byte and checks that the accepted `outlet-centre-visitor-composition-hero.png` is a different file, so the check is on the asset, not on its name. It is not deleted again and not silently replaced.

**Seven drawer explainers.** The six concepts in `EXPLAINER-BRIEF.md` and the Retail classification gap now have illustrations, each drawn in its own kind of place and attached to its own segment only:

| File | Segment · capability | Scenes |
| --- | --- | --- |
| `retail-anonymous-classification-explainer.svg` | Retail · TECH-03 | Visitor composition |
| `shopping-centre-threshold-counting-explainer.svg` | Shopping Centre · TECH-02 | Entrances; Internal circulation; Brand counting |
| `retail-park-unit-entrance-counting-explainer.svg` | Retail Park · TECH-02 | Unit visits; Unit & category exposure |
| `retail-park-anonymous-re-id-explainer.svg` | Retail Park · TECH-05 | Cross-visitation; Time on site |
| `outlet-centre-entrance-counting-explainer.svg` | Outlet Centre · TECH-02 | Centre entrances; Brand counting |
| `outlet-centre-zone-counting-lines-explainer.svg` | Outlet Centre · TECH-04 | Circulation; Zone exposure & dwell |
| `outlet-centre-anonymous-re-id-explainer.svg` | Outlet Centre · TECH-05 | Brand flow; Time in destination |

Visual choices. They are axonometric line drawings on the PFM black canvas, with the measurement principle drawn as glass layers in the red-to-purple range — the brand's device for concept explanation (`03-shared/brand/visual-style.md`). Only brand colour tokens are used. They keep the brief's rules: figures have no faces; there is no text, number or label in any file; fascias are blank; a sensor is a small generic disc; coverage is partial, with visible gaps; the Outlet zone drawing has no point cloud or scanning beam. The approach name, explanation, alt text and a note saying the drawing is schematic come from the content model in English, French and German. Generated by `scripts/explainer-illustrations.py`; wired in `app/content/scene-drawer-overrides.ts`; held by `tests/drawer-schematic-explainers.test.mjs`.

Their limit. The brief asks for photographic artwork matching the three approved explainers. These are not that, and do not pretend to be: each carries the note “Schematic illustration of the measurement principle. Not customer data, not a real location and not a depiction of specific hardware.” The photographic versions remain a production task; when they arrive they replace these files one for one.

In the same place, the method heading under each explainer was English in the French and German drawer. It now resolves like the rest of the drawer.

**Lens rail at 1024 × 768.** The supporting line under each data lens was hidden below 1200 px. It now stays, set compactly: a smaller mark, less padding, and a note set at 10 px and clamped to four lines, which every current note fits. The clamp is visual only; the note is inside the lens button, so its full text stays in the accessible name. Checked in all fifteen Shopping Centre and Retail Park lens-rail scenes and on Retail Measure at 1024 × 768: no note clipped, no overflow, no horizontal scroll. 1440 × 900 is unchanged. Held by `tests/lens-rail-compact.test.mjs`.

**Shell entry.** “Public Experience and Client Room follow in the next demo slice” is gone. The entry screen now says: “No records will be changed. All account and opportunity data shown here is simulated.”

**Configure names.** The naming rule now applies to Configure. Under each implementation's role Configure shows the functional name (“3D Sensor Basic FoV”, “IP Detection Sensor outdoor”); a method class shows its class; a supplier's product without a functional name yet shows nothing there — the role already says what it is. The “Other possible implementations” labels and the example-implementation line under an explainer video use the same names, in Configure and in the drawer. Supplier and model stay in the model and in the Sales-mode internal line beside the implementation id and source references; Presentation mode never shows them.

**Bosch privacy, bounded.** On the product lead's confirmation that the FLEXIDOME micro 3100i and FLEXIDOME 5100i are CPP14 cameras, `SRC-BOSCH-IVA-PRO-PRIVACY-001` is mapped to both IP Detection Sensors. They move to `partially_source_backed` with two claims, both attributed to the manufacturer: optional privacy masking on this camera platform (blurring or masking people, faces or vehicles, or hiding the video while keeping its metadata); and that these settings are per video stream, on supported firmware and analytics variants, and only as configured. What stays blocked: that masking is active on every installation (it depends on firmware 9.40, supported modes and correct configuration, and the manufacturer lists failure cases — delayed metadata, some high-resolution stills, image stabilisation); that the camera's settings make an installation legally compliant or describe the analytics a PFM deployment would run; and any other device's evidence. No compliance guarantee is made.

**Xovis PC2SE-O, mapped to its own datasheet.** The outdoor sensor is a member of the PC2SE family (product lead) and now rests on its own datasheet, `SRC-XOVIS-PC2SE-O-TECH-001` (`docs/reference/technology/xovis/pc2se-o/technical/`). Mapped from that document only: on-device 3D stereo vision for outdoor use; mounting 2.20–6.00 m for the base model; one PoE cable; -33 °C to +40 °C and a minimum of 9 lux, with protection against water and dust (no IP code is stated); four privacy modes with text-only data and no personally identifiable information, attributed to the manufacturer. Nothing is inherited from the indoor datasheet — the two differ in temperature range, illumination and ingress protection. Blocked: any accuracy, capture-rate or coverage figure (the datasheet states none), legal compliance, and certification — the ePrivacyseal certificate names the PC2SE but not the PC2SE-O, and the datasheet's own mention of the seal is not the certificate. Technical status `source_backed`; privacy `partially_source_backed`.

Decisions for this pass are recorded in `docs/decisions/DECISION-LOG.md`, 2026-09-28, “Product lead input”.

## Open source and product questions

1. **Bosch firmware and licence per installation.** Answered for the platform: both cameras are CPP14. Still open per deployment: that firmware 9.40 and the IVA Pro Privacy analytics are actually installed and configured. The drawer says it depends on this; it does not assume it. Source: `docs/reference/technology/SOURCE-REGISTRY.md`, `SRC-BOSCH-IVA-PRO-PRIVACY-001`.
2. **PC2SE-O certification scope.** The PC2SE-O datasheet is mapped. What remains is certification only: the ePrivacyseal certificate's product list names the PC2SE but not the PC2SE-O, while the PC2SE-O datasheet lists an ePrivacy seal. Until the certifier or the certificate confirms the outdoor variant is in scope, no certification is shown for it. Source: registry, `SRC-XOVIS-PRIVACY-001` and `SRC-XOVIS-PC2SE-O-TECH-001`.
3. **Functional names still missing.** The camera-analytics option is now "IP Detection Sensor" (2026-09-29); the HME products have no functional name yet, so Configure shows their role only. A name from the product lead would let them carry one. Source: `app/content/technology-presentation.ts` `implementationPresentationNames`.
4. **Photographic explainers.** The seven schematic explainers stand in for commissioned photographic artwork. Source: `docs/content/EXPLAINER-BRIEF.md`.
5. **Open-air Outlet heroes.** Catchment, arrival and entrance still use accepted compromises; see proposal 1.
6. **QSR claim translations.** The ClearSoundX supported claims have no French or German translation, so those locales show English. QSR is outside this pass's scope; recorded, not fixed. Source: `app/i18n/domain-claims.ts` `supportedClaimTranslations`.
7. **Customer proof.** Two published cases are now approved for Retail (product lead, 2026-09-28): Madaq on store visits and conversion, Future Stores London on in-store journey and zone engagement. Every other scene, and every other segment, still has no approved proof. PFM's own video on existing CCTV/IP cameras (2026-09-29) is shown in Configure beside the camera option as PFM's explanation, not as proof. Source: `app/content/proof-assets.ts`; `docs/decisions/DECISION-LOG.md`, 2026-09-28.

## Verification and limits

- Captured all 37 Core URLs with the local preview; image contact sheets by segment are in `outputs/content-review-2026-09-27/` (ignored from Git).
- The CSV inventory is generated from the typed runtime. Regenerate it after changing drawer content with `node scripts/content-inventory.mjs`; do not regenerate the product lead's filled workbook without preserving its edits.
- This is a complete review and text pass for the authorised scope. It does not assert that absent customer proof, supplier documents, usage rights or commissioned imagery exist.
