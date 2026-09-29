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

export const shoppingCentreScenes: readonly SceneDefinition[] = [
  {
    id: "shopping-centre-catchment-area",
    segment: "shopping-centre",
    title: "Catchment area",
    journeyStage: "context",
    priority: "core",
    corePathOrder: 1,
    commercialQuestion: "Where do centre visitors come from, and who lives in that reach?",
    supportingLine: "Shape marketing, positioning, leasing context and destination strategy",
    visualAssetId: "VIS-SC-04",
    dataRequirements: {
      required: ["mobile_geo", "insight"],
      optional: ["physical", "business"],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-catchment-reach",
        "Catchment bands, origin mix and travel-time reach",
        ["aggregate_mobility"],
      ),
    ],
    evidence: [
      measured(
        "On-site visits can anchor the asset baseline, but entrance sensors do not measure origin.",
        ["asset_baseline_visits"],
      ),
      connected(
        "Approved aggregate mobility, geo-location and contextual origin sources describe reach around the centre.",
        ["aggregate_mobility"],
      ),
      derived(
        "Catchment bands, origin mix, travel-time reach and visitor-profile context require the approved aggregate source.",
        ["aggregate_mobility"],
      ),
      decision("Shape marketing, positioning, leasing context and destination strategy."),
    ],
    technologyCapabilityIds: ["TECH-07"],
    proofAssetIds: ["CASE-SC-01"],
    nextCta: "Measure centre arrivals",
    nextSceneId: "shopping-centre-entrances",
    sourceRefs: source(15),
  },
  {
    id: "shopping-centre-competitive-visitation-white-spots",
    segment: "shopping-centre",
    title: "Competitive visitation & white spots",
    journeyStage: "context",
    priority: "optional",
    corePathOrder: null,
    commercialQuestion: "Where else does the catchment go, and where are we under-represented?",
    supportingLine: "Target under-penetrated areas and understand competitive destination behaviour",
    visualAssetId: "VIS-SC-03",
    // The white-spots question is only ever asked once the catchment is on
    // screen: it reads the same approved aggregate source one step further out,
    // to where that catchment also goes. Declaring the parent here is what makes
    // it resolve through `getOptionalBranchesForScene` as an in-place branch of
    // Catchment rather than as a loose Optional scene in the segment. It does
    // not change the scene's own content, priority or route position.
    branchFromSceneIds: ["shopping-centre-catchment-area"],
    dataRequirements: {
      required: ["mobile_geo", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-competitive-overlap",
        "Competitive overlap, affinity and white spots",
        ["aggregate_mobility"],
      ),
    ],
    evidence: [
      connected(
        "Aggregate mobility and competitive asset locations provide contextual overlap.",
        ["aggregate_mobility"],
      ),
      derived(
        "Cross-visitation, overlap, competitive affinity and white spots are contextual outputs, not entrance measurements.",
        ["aggregate_mobility"],
      ),
      decision("Target under-penetrated areas and understand competitive destination behaviour."),
    ],
    technologyCapabilityIds: ["TECH-07"],
    proofAssetIds: ["CASE-SC-01"],
    nextCta: "Measure centre arrivals",
    nextSceneId: "shopping-centre-entrances",
    sourceRefs: source(16),
  },
  {
    id: "shopping-centre-entrances",
    segment: "shopping-centre",
    title: "Centre entrances",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 2,
    commercialQuestion: "How many visitors enter the asset, through which entrances and when?",
    supportingLine: "Plan operations, cleaning, security, opening hours and event staffing",
    visualAssetId: "VIS-SC-01",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-entrance-rhythm",
        "Entrance share and peak arrival rhythm",
        ["entrance_events"],
      ),
    ],
    evidence: [
      measured(
        "Entries and exits are measured per entrance by time.",
        ["entrance_events"],
      ),
      connected(
        "Opening hours, events, weather, campaigns and transport context can explain arrival patterns.",
        ["operational_context"],
      ),
      derived(
        "Entrance share, peak arrival rhythm and like-for-like entrance patterns require the physical time series.",
        ["entrance_events"],
      ),
      decision("Plan operations, cleaning, security, opening hours and event staffing."),
    ],
    technologyCapabilityIds: ["TECH-02"],
    proofAssetIds: ["CASE-SC-02"],
    nextCta: "Understand visitor mix",
    nextSceneId: "shopping-centre-visitor-composition",
    sourceRefs: source(17),
  },
  {
    id: "shopping-centre-visitor-composition",
    segment: "shopping-centre",
    title: "Visitor composition",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 3,
    commercialQuestion: "Who is entering the centre in anonymous visitor groups?",
    supportingLine: "Compare visitor mix by entrance, daypart, event or season",
    visualAssetId: "VIS-SC-05",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-visitor-composition-classification",
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
        "Classification is enabled, configured and permitted for the selected centre scope.",
        ["enabled_classification"],
      ),
      connected(
        "Event, campaign and daypart context may segment the anonymous mix.",
        ["operational_context"],
      ),
      derived(
        "Group size, buying-unit and permitted anonymous classifications are estimated from the named inputs.",
        ["classification_compatible_events", "enabled_classification"],
      ),
      decision("Compare visitor mix by entrance, daypart, event or season."),
    ],
    technologyCapabilityIds: ["TECH-03"],
    proofAssetIds: ["CASE-SC-02"],
    nextCta: "Follow centre circulation",
    nextSceneId: "shopping-centre-internal-circulation",
    sourceRefs: source(18),
  },
  {
    id: "shopping-centre-time-in-centre",
    segment: "shopping-centre",
    title: "Time in centre",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 8,
    commercialQuestion: "How long do visitors stay in the asset?",
    supportingLine: "Understand depth of visit and operational pressure by period",
    visualAssetId: "VIS-SC-02",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-time-in-centre-distribution",
        "Time-in-centre distribution",
        [],
        [["matched_visit_events"], ["trip_duration_events"]],
      ),
    ],
    evidence: [
      measured(
        "Anonymous entrance events are matched across supported coverage or continuous tracked journeys.",
        ["matched_visit_events", "trip_duration_events"],
      ),
      connected(
        "Event, opening-hours and zone context can segment the time pattern.",
        ["operational_context"],
      ),
      derived(
        "Short/long visit and dwell distributions are derived only from supported matching and aligned definitions.",
        ["matched_visit_events", "trip_duration_events"],
      ),
      decision("Understand depth of visit and operational pressure by period."),
    ],
    technologyCapabilityIds: ["TECH-05", "TECH-04"],
    proofAssetIds: ["CASE-SC-02"],
    nextCta: "Configure solution",
    sourceRefs: source(19),
  },
  {
    id: "shopping-centre-internal-circulation",
    segment: "shopping-centre",
    title: "Internal circulation",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 4,
    commercialQuestion: "How do visitors move across floors, corridors, zones and anchors?",
    supportingLine: "Improve wayfinding, layout, operations and anchor connectivity",
    visualAssetId: "VIS-SC-02",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-internal-circulation-flow",
        "Flow matrix, route structure and bottlenecks",
        ["spatial_trajectories", "spatial_definitions"],
      ),
    ],
    evidence: [
      measured(
        "Zone entries/exits, transitions and anonymous trajectories provide the movement signal.",
        ["spatial_trajectories"],
      ),
      connected(
        "Floorplan, floor, corridor, zone, anchor and vertical-transport definitions provide spatial meaning.",
        ["spatial_definitions"],
      ),
      derived(
        "Flow matrix, route structure, floor-to-floor movement and bottlenecks require aligned movement and spatial definitions.",
        ["spatial_trajectories", "spatial_definitions"],
      ),
      decision("Improve wayfinding, layout, operations and anchor connectivity."),
    ],
    technologyCapabilityIds: ["TECH-04"],
    proofAssetIds: ["CASE-SC-02"],
    nextCta: "Explore zone & anchor exposure",
    nextSceneId: "shopping-centre-zone-anchor-exposure",
    sourceRefs: source(20),
  },
  {
    id: "shopping-centre-zone-anchor-exposure",
    segment: "shopping-centre",
    title: "Zone & anchor exposure",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 5,
    commercialQuestion: "Which areas receive attention, and where do visitors dwell?",
    supportingLine: "Support tenant conversations, leasing context, events and space planning",
    visualAssetId: "VIS-SC-02",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-zone-anchor-exposure",
        "Exposure rate, reach, dwell and hot/cold areas",
        ["zone_events", "zone_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Presence, entries and time within zones provide the physical exposure signal.",
        ["zone_events"],
      ),
      connected(
        "Anchor, tenant, event and zone mapping defines the areas being compared.",
        ["zone_mapping"],
      ),
      derived(
        "Exposure rate, dwell, share reaching a zone and hot/cold areas require aligned zone events and mappings.",
        ["zone_events", "zone_mapping"],
      ),
      decision("Support tenant conversations, leasing context, events and space planning."),
    ],
    technologyCapabilityIds: ["TECH-04"],
    proofAssetIds: ["CASE-SC-02"],
    nextCta: "See brand visits",
    nextSceneId: "shopping-centre-brand-counting",
    sourceRefs: source(21),
  },
  {
    id: "shopping-centre-brand-counting",
    segment: "shopping-centre",
    title: "Brand counting",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 6,
    commercialQuestion: "Which stores or brands are actually visited?",
    supportingLine: "Understand tenant exposure and brand visitation without assuming tenant sales",
    visualAssetId: "VIS-SC-06",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-brand-visits",
        "Brand visits and visit share",
        ["brand_events", "brand_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Store or brand entry events are counted only within covered boundaries.",
        ["brand_events"],
      ),
      connected(
        "Tenant/brand directories and store boundaries give each entry its identity as a covered brand area.",
        ["brand_mapping"],
      ),
      derived(
        "Brand visits, visit share and period patterns do not establish tenant sales or conversion.",
        ["brand_events", "brand_mapping"],
      ),
      decision("Understand tenant exposure and brand visitation without assuming tenant sales."),
    ],
    technologyCapabilityIds: ["TECH-02", "TECH-04"],
    proofAssetIds: ["CASE-SC-03"],
    nextCta: "Follow brand flow",
    nextSceneId: "shopping-centre-brand-flow",
    sourceRefs: source(22),
  },
  {
    id: "shopping-centre-brand-flow",
    segment: "shopping-centre",
    title: "Brand flow",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 7,
    commercialQuestion: "How do visitors move from one brand to another?",
    supportingLine: "Inform adjacency, wayfinding, leasing context and tenant conversations",
    visualAssetId: "VIS-SC-07",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-brand-flow-sequences",
        "Brand cross-visitation and common sequences",
        ["matched_brand_events", "brand_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Anonymous matched visits or transitions are used only between covered brands or zones.",
        ["matched_brand_events"],
      ),
      connected(
        "Tenant/brand maps and category definitions explain the sequence.",
        ["brand_mapping"],
      ),
      derived(
        "Brand cross-visitation, common sequences and adjacency relationships require supported matching and mapping.",
        ["matched_brand_events", "brand_mapping"],
      ),
      decision("Inform adjacency, wayfinding, leasing context and tenant conversations."),
    ],
    technologyCapabilityIds: ["TECH-05", "TECH-04"],
    proofAssetIds: ["CASE-SC-03"],
    nextCta: "Understand time in centre",
    nextSceneId: "shopping-centre-time-in-centre",
    sourceRefs: source(23),
  },
  {
    id: "shopping-centre-parking-arrival",
    segment: "shopping-centre",
    title: "Parking arrival",
    journeyStage: "measure",
    priority: "optional",
    corePathOrder: null,
    commercialQuestion: "How does vehicle arrival translate into centre visits?",
    supportingLine: "Plan access, event operations and peak arrival management",
    visualAssetId: "VIS-SC-08",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-parking-to-entrance-flow",
        "Parking-to-entrance relationship and peak access pressure",
        ["vehicle_events", "entrance_events", "parking_capacity"],
      ),
    ],
    evidence: [
      measured(
        "Vehicle entries/exits and/or pedestrian flow from parking are measured where covered.",
        ["vehicle_events", "entrance_events"],
      ),
      connected(
        "Parking layout, capacity, transport access and event context define the arrival relationship.",
        ["parking_capacity", "operational_context"],
      ),
      derived(
        "Arrival rhythm, parking-to-entrance relationship and peak access pressure require aligned vehicle, entrance and parking definitions.",
        ["vehicle_events", "entrance_events", "parking_capacity"],
      ),
      decision("Plan access, event operations and peak arrival management."),
    ],
    technologyCapabilityIds: ["TECH-06", "TECH-02"],
    proofAssetIds: ["CASE-SC-04"],
    nextCta: "Explore parking pressure",
    nextSceneId: "shopping-centre-parking-occupancy",
    sourceRefs: source(24),
  },
  {
    id: "shopping-centre-parking-occupancy",
    segment: "shopping-centre",
    title: "Parking occupancy",
    journeyStage: "understand",
    priority: "optional",
    corePathOrder: null,
    commercialQuestion: "When and where is parking capacity under pressure?",
    supportingLine: "Manage capacity, circulation and operational interventions",
    visualAssetId: "VIS-SC-09",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-parking-pressure",
        "Occupancy, utilisation and peak pressure by zone",
        ["parking_events", "parking_capacity"],
      ),
    ],
    evidence: [
      measured(
        "Vehicle entry/exit counts or bay-state events provide the parking signal, depending on setup.",
        ["parking_events"],
      ),
      connected(
        "Parking zones, capacity and opening rules define the denominator and operating context.",
        ["parking_capacity"],
      ),
      derived(
        "Occupancy, utilisation by zone, turnover and peak pressure require the configured parking source and capacity definitions.",
        ["parking_events", "parking_capacity"],
      ),
      decision("Manage capacity, circulation and operational interventions."),
    ],
    technologyCapabilityIds: ["TECH-06"],
    proofAssetIds: ["CASE-SC-04"],
    nextCta: "Measure centre arrivals",
    nextSceneId: "shopping-centre-entrances",
    sourceRefs: source(25),
  },
  {
    id: "shopping-centre-vehicle-origin",
    segment: "shopping-centre",
    title: "Vehicle origin",
    journeyStage: "context",
    priority: "advanced",
    corePathOrder: null,
    commercialQuestion: "What vehicle-origin context can be added to asset visitation?",
    supportingLine: "Add destination / tourism context without overstating what the plate itself reveals",
    visualAssetId: "VIS-SC-10",
    dataRequirements: {
      required: ["physical", "mobile_geo", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "shopping-centre-lawful-vehicle-origin",
        "Origin mix to the level supported by the lawful source and jurisdiction",
        ["licence_plate_events", "lawful_origin_source"],
      ),
    ],
    evidence: [
      measured(
        "Licence-plate or country-code events are used only where lawful and configured.",
        ["licence_plate_events"],
      ),
      connected(
        "A lawful additional origin source is required; a Dutch plate alone does not encode local origin.",
        ["lawful_origin_source"],
      ),
      derived(
        "Vehicle-origin context is limited to the level supported by the lawful source and jurisdiction.",
        ["licence_plate_events", "lawful_origin_source"],
      ),
      decision("Add destination / tourism context without overstating what the plate itself reveals."),
    ],
    technologyCapabilityIds: ["TECH-06", "TECH-07"],
    proofAssetIds: ["CASE-SC-01"],
    nextCta: "Explore catchment",
    nextSceneId: "shopping-centre-catchment-area",
    sourceRefs: source(26),
  },
];

export const shoppingCentreSegment: SegmentDefinition = {
  id: "shopping-centre",
  name: "Shopping Centre",
  implementationStatus: "architecture_only",
  commercialNarrative:
    "Catchment becomes entrances, visitor mix, circulation, zones and anchors, brand visits and flow, time in centre, then a property decision.",
  scenes: shoppingCentreScenes,
  coreRoute: [
    "shopping-centre-catchment-area",
    "shopping-centre-entrances",
    "shopping-centre-visitor-composition",
    "shopping-centre-internal-circulation",
    "shopping-centre-zone-anchor-exposure",
    "shopping-centre-brand-counting",
    "shopping-centre-brand-flow",
    "shopping-centre-time-in-centre",
  ],
  optionalBranches: [
    "shopping-centre-competitive-visitation-white-spots",
    "shopping-centre-parking-arrival",
    "shopping-centre-parking-occupancy",
  ],
  advancedBranches: ["shopping-centre-vehicle-origin"],
  stageMapping: {
    context: [
      "shopping-centre-catchment-area",
      "shopping-centre-competitive-visitation-white-spots",
      "shopping-centre-vehicle-origin",
    ],
    measure: [
      "shopping-centre-entrances",
      "shopping-centre-visitor-composition",
      "shopping-centre-parking-arrival",
    ],
    understand: [
      "shopping-centre-time-in-centre",
      "shopping-centre-internal-circulation",
      "shopping-centre-zone-anchor-exposure",
      "shopping-centre-brand-counting",
      "shopping-centre-brand-flow",
      "shopping-centre-parking-occupancy",
    ],
    prove: [],
    configure: [],
    act: [],
  },
  synthesis: {
    configure: {
      journeyStage: "configure",
      governingQuestion:
        "What measurement and context do we need to answer this centre question?",
      captures: [
        "selected_question",
        "required_capabilities",
        "required_context",
        "selected_insight_depth",
        "possible_implementation_choices",
      ],
      recommendationMode: "none",
      sourceRefs: [
        `${storyArchitecture}: Shopping Centre synthesis route`,
        `${salesDirection}: §22 Configure direction`,
      ],
    },
    act: {
      journeyStage: "act",
      governingQuestion: "What property decision should we explore, test or agree next?",
      captures: [
        "observed_evidence",
        "interpretation",
        "investigation_or_test",
        "next_step",
        "human_owned_decision",
      ],
      decisionOwner: "human",
      sourceRefs: [
        `${storyArchitecture}: Shopping Centre synthesis route`,
        `${salesDirection}: §23 Act direction`,
      ],
    },
  },
  sourceRefs: [
    `${storyArchitecture}: Shopping Centre — product architecture`,
    `${matrix}: PFM Matrix!A15:P26`,
  ],
};
