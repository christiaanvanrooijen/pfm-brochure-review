import type {
  DerivedDependencyDefinition,
  EvidenceInputId,
  SceneDefinition,
  SceneEvidenceDefinition,
  SegmentDefinition,
} from "../types.ts";

const matrix = "PFM_Segment_Insight_Matrix_v1_1.xlsx";
const storyArchitecture = "SEGMENT-STORY-ARCHITECTURE.md";
const salesDirection = "SALES-EXPERIENCE-DIRECTION.md";

const source = (row: number): readonly string[] => [
  `${matrix}: PFM Matrix!A${row}:P${row}`,
];

const measured = (
  description: string,
  inputIds: readonly EvidenceInputId[],
): SceneEvidenceDefinition => ({ type: "measured", inputIds, description });

const connected = (
  description: string,
  inputIds: readonly EvidenceInputId[],
): SceneEvidenceDefinition => ({ type: "connected", inputIds, description });

const derived = (
  description: string,
  inputIds: readonly EvidenceInputId[],
): SceneEvidenceDefinition => ({ type: "derived", inputIds, description });

const decision = (description: string): SceneEvidenceDefinition => ({
  type: "decision",
  description,
});

const dependency = (
  id: string,
  output: string,
  requiredInputIds: readonly EvidenceInputId[],
  alternativeInputGroups?: readonly (readonly EvidenceInputId[])[],
): DerivedDependencyDefinition => ({
  id,
  output,
  requiredInputIds,
  ...(alternativeInputGroups ? { alternativeInputGroups } : {}),
});

export const retailScenes: readonly SceneDefinition[] = [
  {
    id: "retail-street-opportunity",
    segment: "retail",
    title: "Street opportunity",
    journeyStage: "context",
    priority: "core",
    corePathOrder: 1,
    commercialQuestion:
      "How much passing traffic is available, and what share enters the store?",
    supportingLine:
      "Optimise frontage, campaign timing and store-level opportunity",
    visualAssetId: "VIS-RET-01",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "retail-street-opportunity-capture",
        "Capture rate and aligned street opportunity",
        ["aligned_passer_by_audience", "store_visits"],
      ),
    ],
    evidence: [
      measured(
        "Passing pedestrians and store entries/exits by time are kept as separate physical signals.",
        ["aligned_passer_by_audience", "store_visits"],
      ),
      connected(
        "Store hours, campaigns, weather or street context may explain the observed period.",
        ["operational_context"],
      ),
      derived(
        "Capture rate and missed street opportunity are shown only when the aligned inputs share area, period and definitions.",
        ["aligned_passer_by_audience", "store_visits"],
      ),
      decision("Optimise frontage, campaign timing and store-level opportunity."),
    ],
    technologyCapabilityIds: ["TECH-01", "TECH-02"],
    proofAssetIds: ["CASE-RET-01"],
    nextCta: "Measure store visits",
    nextSceneId: "retail-store-visits",
    sourceRefs: source(5),
  },
  {
    id: "retail-store-visits",
    segment: "retail",
    title: "Store visits",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 2,
    commercialQuestion: "How much opportunity becomes a visit?",
    supportingLine:
      "See the passing audience, the entrance threshold and the visits that result",
    visualAssetId: "VIS-RET-04",
    // Capture is measured end to end: the passing opportunity and the visits
    // are both physical measurements, and the capture rate is derived from
    // them. Mobile & geo is an optional contextual layer only — it may add
    // catchment/origin context alongside the measurement, but it is never
    // required for, and never substitutes for, the capture calculation.
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business", "mobile_geo"],
    },
    derivedDependencies: [
      dependency(
        "retail-store-visits-capture",
        "Capture rate from aligned opportunity and visits",
        ["aligned_passer_by_audience", "store_visits"],
      ),
    ],
    evidence: [
      measured(
        "Store visits are measured directly at the entrance threshold.",
        ["store_visits"],
      ),
      measured(
        "The aligned passing opportunity is measured physically in the outdoor opportunity area, separately from the entrance sensor.",
        ["aligned_passer_by_audience"],
      ),
      connected(
        "Aggregate catchment or origin context may be added alongside the measurement; it is never part of the capture calculation.",
        ["aggregate_mobility"],
      ),
      derived(
        "Capture rate is derived only when aligned passer-by audience and store visits share area, period and definitions.",
        ["aligned_passer_by_audience", "store_visits"],
      ),
      decision("Align staffing, opening hours and operations with demand."),
    ],
    // Both physical measurements this scene depends on: TECH-01 measures the
    // outdoor passing opportunity, TECH-02 measures the entrance visits.
    technologyCapabilityIds: ["TECH-01", "TECH-02"],
    proofAssetIds: ["CASE-RET-01"],
    nextCta: "Enter the location",
    // The Core route runs Store visits -> Visitor composition -> In-store
    // journey. This field previously skipped Visitor composition, which
    // contradicted `coreRoute` and `corePathOrder`.
    nextSceneId: "retail-visitor-composition",
    sourceRefs: source(6),
  },
  {
    id: "retail-visitor-composition",
    segment: "retail",
    title: "Visitor composition",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 3,
    commercialQuestion: "What kind of anonymous visitor mix enters the store?",
    supportingLine:
      "Understand buying-unit mix and compare visitor composition by store or period",
    visualAssetId: "VIS-RET-03",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "retail-visitor-composition-classification",
        "Anonymous visitor composition",
        ["classification_compatible_events", "enabled_classification"],
      ),
    ],
    evidence: [
      measured(
        "Entrance visit events must come from a classification-compatible implementation.",
        ["classification_compatible_events"],
      ),
      measured(
        "The classification must be enabled, configured and permitted for the selected scope.",
        ["enabled_classification"],
      ),
      connected(
        "Campaign, store format or time-period context may segment the anonymous mix.",
        ["operational_context"],
      ),
      derived(
        "Group size, buying-unit and permitted anonymous classification output are estimated from the named inputs.",
        ["classification_compatible_events", "enabled_classification"],
      ),
      decision(
        "Understand buying-unit mix and compare visitor composition by store or period.",
      ),
    ],
    technologyCapabilityIds: ["TECH-03"],
    proofAssetIds: ["CASE-RET-01"],
    // Distinct from the Store visits CTA ("Enter the location"): the visit has
    // already been entered here, so the progression follows it deeper inside.
    nextCta: "Follow the visit",
    nextSceneId: "retail-in-store-journey",
    sourceRefs: source(7),
  },
  {
    id: "retail-visit-duration",
    segment: "retail",
    title: "Visit duration",
    journeyStage: "understand",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["retail-visitor-composition"],
    commercialQuestion: "How long do visitors stay in the store?",
    supportingLine:
      "Compare engagement depth and identify unusual visit-duration patterns",
    visualAssetId: "VIS-RET-06",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "retail-visit-duration-distribution",
        "Visit duration distribution",
        [],
        [["matched_visit_events"], ["trip_duration_events"]],
      ),
    ],
    evidence: [
      measured(
        "Anonymous entry and exit events are matched only within supported coverage.",
        ["matched_visit_events", "trip_duration_events"],
      ),
      connected(
        "Store hours, campaigns and staffing context can segment the duration pattern.",
        ["operational_context"],
      ),
      derived(
        "Short and long visit distributions are derived from supported matched events.",
        ["matched_visit_events", "trip_duration_events"],
      ),
      decision(
        "Compare engagement depth and identify unusual visit-duration patterns.",
      ),
    ],
    technologyCapabilityIds: ["TECH-05", "TECH-04"],
    proofAssetIds: ["CASE-RET-02"],
    nextCta: "Explore in-store journey",
    nextSceneId: "retail-in-store-journey",
    sourceRefs: source(8),
  },
  {
    id: "retail-in-store-journey",
    segment: "retail",
    title: "In-store journey",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 4,
    commercialQuestion: "Where do visitors go during the visit?",
    supportingLine: "Improve layout, wayfinding and merchandising tests",
    visualAssetId: "VIS-RET-02",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-in-store-journey-routes",
        "Zone-to-zone flow and journey paths",
        ["spatial_trajectories", "spatial_definitions"],
      ),
    ],
    evidence: [
      measured(
        "Anonymous trajectories, zone entries/exits and transitions provide the physical movement signal.",
        ["spatial_trajectories"],
      ),
      connected(
        "Store layout and zone definitions provide the spatial meaning for the route.",
        ["spatial_definitions"],
      ),
      derived(
        "Zone-to-zone flow, journey paths, route frequency and drop-off points are interpreted from aligned movement and definitions.",
        ["spatial_trajectories", "spatial_definitions"],
      ),
      decision("Improve layout, wayfinding and merchandising tests."),
    ],
    technologyCapabilityIds: ["TECH-04"],
    proofAssetIds: ["CASE-RET-02"],
    nextCta: "Explore zone engagement",
    nextSceneId: "retail-zone-engagement",
    sourceRefs: source(9),
  },
  {
    id: "retail-product-category-journey",
    segment: "retail",
    title: "Product-category journey",
    journeyStage: "understand",
    priority: "advanced",
    corePathOrder: null,
    branchFromSceneIds: ["retail-in-store-journey"],
    commercialQuestion: "Which product categories are visited, and in what sequence?",
    supportingLine: "Evaluate category placement and adjacencies",
    visualAssetId: "VIS-RET-07",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-product-category-sequence",
        "Category exposure and sequence",
        ["spatial_trajectories", "zone_mapping", "category_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Zone visits and transitions provide the physical category-journey signal.",
        ["spatial_trajectories"],
      ),
      connected(
        "Product-category, planogram and zone mappings give the movement its business meaning.",
        ["zone_mapping", "category_mapping"],
      ),
      derived(
        "Category exposure, category sequence and cross-category visitation are calculated from aligned movement and mappings.",
        ["spatial_trajectories", "zone_mapping", "category_mapping"],
      ),
      decision("Evaluate category placement and adjacencies."),
    ],
    technologyCapabilityIds: ["TECH-04", "TECH-08"],
    proofAssetIds: ["CASE-RET-02"],
    nextCta: "Explore zone engagement",
    nextSceneId: "retail-zone-engagement",
    sourceRefs: source(10),
  },
  {
    id: "retail-zone-engagement",
    segment: "retail",
    title: "Zone engagement",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 5,
    commercialQuestion: "What do visitors do in the zones they reach?",
    supportingLine:
      "Prioritise hot/cold zones and test merchandising or layout changes",
    visualAssetId: "VIS-RET-05",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-zone-engagement-pattern",
        "Dwell and zone exposure",
        ["zone_events", "zone_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Presence, movement and time within defined zones provide the physical signal.",
        ["zone_events"],
      ),
      connected(
        "Zone and category definitions provide the business context for each area.",
        ["zone_mapping"],
      ),
      derived(
        "Dwell, exposure rate, repeat zone visits and engagement proxies are calculated only for defined zones.",
        ["zone_events", "zone_mapping"],
      ),
      decision(
        "Prioritise hot/cold zones and test merchandising or layout changes.",
      ),
    ],
    technologyCapabilityIds: ["TECH-04"],
    proofAssetIds: ["CASE-RET-02"],
    nextCta: "Connect performance",
    nextSceneId: "retail-conversion-sales-context",
    sourceRefs: source(11),
  },
  {
    id: "retail-staff-interaction",
    segment: "retail",
    title: "Staff interaction",
    journeyStage: "prove",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["retail-zone-engagement"],
    commercialQuestion:
      "Are visitors being helped in the zones where opportunity occurs?",
    supportingLine:
      "Align service coverage with visitor demand and high-opportunity zones",
    visualAssetId: "VIS-RET-08",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "retail-staff-interaction-coverage",
        "Visitor-staff interaction and coverage patterns",
        ["staff_events"],
      ),
    ],
    evidence: [
      measured(
        "Visitor and staff presence/proximity events are used only where configured.",
        ["staff_events"],
      ),
      connected(
        "Staff roster, role and zone-plan context defines the agreed coverage question.",
        ["staff_context"],
      ),
      derived(
        "Interaction events, assisted versus unassisted visits and response-time patterns require reliable staff/visitor definitions.",
        ["staff_events"],
      ),
      decision(
        "Align service coverage with visitor demand and high-opportunity zones.",
      ),
    ],
    technologyCapabilityIds: ["TECH-04", "TECH-08"],
    proofAssetIds: ["CASE-RET-02"],
    nextCta: "Connect performance",
    nextSceneId: "retail-conversion-sales-context",
    sourceRefs: source(12),
  },
  {
    id: "retail-conversion-sales-context",
    segment: "retail",
    title: "Conversion & sales context",
    journeyStage: "prove",
    priority: "core",
    corePathOrder: 6,
    commercialQuestion: "Do store visits become transactions?",
    supportingLine:
      "Identify whether opportunity sits in traffic, conversion or transaction value",
    visualAssetId: "VIS-RET-09",
    // The Retail commercial equation does not begin at store visits: it begins
    // outside the store. This scene therefore states both halves —
    // passers-by × capture rate = store visits, and store visits × conversion
    // rate × average transaction value = turnover — with store visits as the
    // single shared term. That adds the outdoor physical measurement to the
    // scene's declared evidence, and adds Mobile & geo as optional context
    // only: catchment or origin context may be discussed beside the equation,
    // but it never measures the passing opportunity and never enters the
    // capture calculation.
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: ["mobile_geo"],
    },
    derivedDependencies: [
      dependency(
        "retail-conversion-sales-context-capture",
        "Capture rate from aligned passer-by audience and store visits",
        ["aligned_passer_by_audience", "store_visits"],
      ),
      dependency(
        "retail-conversion-rate",
        "Conversion rate from compatible visits and transactions",
        ["store_visits", "transactions"],
      ),
      dependency(
        "retail-average-transaction-value",
        "Average transaction value from aligned sales value and compatible transactions",
        ["transactions", "sales_value"],
      ),
      dependency(
        "retail-sales-per-visitor",
        "Sales per visitor where aligned sales value is available",
        ["store_visits", "transactions", "sales_value"],
      ),
    ],
    evidence: [
      measured(
        "Store visits or buying-unit traffic provide the physical denominator.",
        ["store_visits"],
      ),
      measured(
        "The passing opportunity outside the store is measured physically in the outdoor opportunity area, separately from the entrance sensor.",
        ["aligned_passer_by_audience"],
      ),
      connected(
        "POS transactions, turnover, average transaction value and optional staffing/campaign context remain customer-connected data.",
        ["transactions", "sales_value"],
      ),
      connected(
        "Aggregate catchment or origin context may be discussed alongside the equation; it never measures passers-by, visits or capture.",
        ["aggregate_mobility"],
      ),
      derived(
        "Capture rate, conversion, average transaction value and sales per visitor are calculated only when the passer-by, visit and connected sales inputs share the same store, area, period and definitions.",
        ["aligned_passer_by_audience", "store_visits", "transactions", "sales_value"],
      ),
      decision(
        "Identify whether opportunity sits in traffic, conversion or transaction value.",
      ),
    ],
    // TECH-01 measures the outdoor passing opportunity, TECH-02 the entrance
    // visits, TECH-08 the connected business context. All three now appear on
    // screen here, so all three must be explainable from this scene's
    // "How we measure this" panel.
    technologyCapabilityIds: ["TECH-01", "TECH-02", "TECH-08"],
    proofAssetIds: ["CASE-RET-01"],
    // Last scene on the Core route (corePathOrder 6). There is no next Core
    // content scene: Configure and Act are synthesis stages with empty scene
    // arrays, so they are not reachable through `nextSceneId` at all.
    //
    // This field previously read "Compare locations" ->
    // `retail-portfolio-comparison`, which is the same fault class already
    // fixed on `retail-store-visits`: a Core scene's primary next-pointer aimed
    // at what is actually a secondary branch. Portfolio comparison is
    // `priority: "optional"` and declares this scene as its
    // `branchFromSceneIds` parent, so it belongs in the branch affordance
    // beside the CTA, not in the CTA itself. `nextSceneId` is optional on
    // `SceneDefinition` and is intentionally omitted here.
    nextCta: "Choose what to improve",
    sourceRefs: source(13),
  },
  {
    id: "retail-portfolio-comparison",
    segment: "retail",
    title: "Portfolio comparison",
    journeyStage: "prove",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["retail-conversion-sales-context"],
    commercialQuestion: "Which stores, days or moments deserve attention first?",
    supportingLine:
      "Prioritise stores and tests instead of treating the portfolio as one average",
    visualAssetId: "VIS-RET-10",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-portfolio-like-for-like",
        "Like-for-like benchmarks and performance priorities",
        ["comparable_metrics", "portfolio_context"],
      ),
    ],
    evidence: [
      measured(
        "Comparable traffic and spatial metrics provide the aligned physical baseline.",
        ["comparable_metrics"],
      ),
      connected(
        "POS, store type, square metres, region, campaigns and staffing add portfolio context where available.",
        ["portfolio_context"],
      ),
      derived(
        "Like-for-like benchmarks, outliers and performance priorities require aligned definitions across stores, days or moments.",
        ["comparable_metrics", "portfolio_context"],
      ),
      decision(
        "Prioritise stores and tests instead of treating the portfolio as one average.",
      ),
    ],
    technologyCapabilityIds: ["TECH-08"],
    proofAssetIds: ["CASE-RET-03"],
    nextCta: "Configure solution",
    sourceRefs: source(14),
  },
] satisfies readonly SceneDefinition[];

export const retailSegment: SegmentDefinition = {
  id: "retail",
  name: "Retail",
  implementationStatus: "implementation_ready",
  commercialNarrative:
    "Outside opportunity becomes store capture, visits, anonymous visitor and journey context, conversion and sales context, then a configured next step.",
  scenes: retailScenes,
  coreRoute: [
    "retail-street-opportunity",
    "retail-store-visits",
    "retail-visitor-composition",
    "retail-in-store-journey",
    "retail-zone-engagement",
    "retail-conversion-sales-context",
  ],
  optionalBranches: ["retail-visit-duration", "retail-staff-interaction", "retail-portfolio-comparison"],
  advancedBranches: ["retail-product-category-journey"],
  stageMapping: {
    context: ["retail-street-opportunity"],
    measure: ["retail-store-visits", "retail-visitor-composition"],
    understand: [
      "retail-visit-duration",
      "retail-in-store-journey",
      "retail-product-category-journey",
      "retail-zone-engagement",
    ],
    prove: [
      "retail-staff-interaction",
      "retail-conversion-sales-context",
      "retail-portfolio-comparison",
    ],
    configure: [],
    act: [],
  },
  synthesis: {
    configure: {
      journeyStage: "configure",
      governingQuestion:
        "What measurement and context do we need to answer this customer's question?",
      captures: [
        "selected_question",
        "required_capabilities",
        "required_context",
        "selected_insight_depth",
        "possible_implementation_choices",
      ],
      recommendationMode: "none",
      sourceRefs: [
        `${storyArchitecture}: Configure and Act synthesis contract`,
        `${salesDirection}: §22 Configure direction`,
      ],
    },
    act: {
      journeyStage: "act",
      governingQuestion: "What should we explore, test or agree next?",
      captures: [
        "observed_evidence",
        "interpretation",
        "investigation_or_test",
        "next_step",
        "human_owned_decision",
      ],
      decisionOwner: "human",
      sourceRefs: [
        `${storyArchitecture}: Configure and Act synthesis contract`,
        `${salesDirection}: §23 Act direction`,
      ],
    },
  },
  sourceRefs: [
    `${storyArchitecture}: Retail — current go-demo route`,
    `${matrix}: PFM Matrix!A5:P14`,
  ],
};
