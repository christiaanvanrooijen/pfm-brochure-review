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

export const outletCentreScenes: readonly SceneDefinition[] = [
  {
    id: "outlet-centre-destination-catchment",
    segment: "outlet-centre",
    title: "Destination catchment",
    journeyStage: "context",
    priority: "core",
    corePathOrder: 1,
    commercialQuestion: "How far are visitors willing to travel to the outlet destination?",
    supportingLine: "Support destination marketing, positioning and expansion of reach",
    visualAssetId: "VIS-OUT-04",
    dataRequirements: {
      required: ["mobile_geo", "insight"],
      optional: ["physical", "business"],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-destination-reach",
        "Destination reach, origin mix and travel-time bands",
        ["aggregate_mobility"],
      ),
    ],
    evidence: [
      measured(
        "On-site visits can anchor destination demand, but entrance sensors do not measure origin.",
        ["asset_baseline_visits"],
      ),
      connected(
        "Approved aggregate mobility, geo-location and destination context describe reach around the outlet.",
        ["aggregate_mobility"],
      ),
      derived(
        "Primary, secondary and extended catchment, travel-time reach and origin mix require the approved aggregate source.",
        ["aggregate_mobility"],
      ),
      decision("Support destination marketing, positioning and expansion of reach."),
    ],
    technologyCapabilityIds: ["TECH-07"],
    proofAssetIds: ["CASE-OUT-01"],
    nextCta: "Understand origin context",
    nextSceneId: "outlet-centre-tourism-origin-context",
    sourceRefs: source(37),
  },
  {
    id: "outlet-centre-tourism-origin-context",
    segment: "outlet-centre",
    title: "Tourism & origin context",
    journeyStage: "context",
    priority: "core",
    corePathOrder: 2,
    commercialQuestion: "How much of the audience is local, regional or destination-led?",
    supportingLine: "Adapt campaigns, operating pressure and destination strategy",
    visualAssetId: "VIS-OUT-04",
    dataRequirements: {
      required: ["mobile_geo", "insight"],
      optional: ["physical", "business"],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-tourism-origin-mix",
        "Local, regional and destination-led origin mix",
        ["tourism_origin_context"],
      ),
    ],
    evidence: [
      measured(
        "Measured vehicle or visitor arrivals can anchor destination demand but do not infer origin.",
        ["asset_baseline_visits"],
      ),
      connected(
        "Approved tourism, hotel, mobility or origin context supplies the destination framing.",
        ["tourism_origin_context"],
      ),
      derived(
        "Local, regional, tourism and destination signatures are limited to the approved origin source.",
        ["tourism_origin_context"],
      ),
      decision("Adapt campaigns, operating pressure and destination strategy."),
    ],
    technologyCapabilityIds: ["TECH-07"],
    proofAssetIds: ["CASE-OUT-01"],
    nextCta: "Measure destination arrival",
    nextSceneId: "outlet-centre-vehicle-coach-arrival",
    sourceRefs: source(38),
  },
  {
    id: "outlet-centre-competitive-destinations-white-spots",
    segment: "outlet-centre",
    title: "Competitive destinations & white spots",
    journeyStage: "context",
    priority: "optional",
    corePathOrder: null,
    commercialQuestion: "Which competing destinations share the same audience, and where are gaps?",
    supportingLine: "Focus marketing and understand destination competition",
    visualAssetId: "VIS-OUT-03",
    dataRequirements: {
      required: ["mobile_geo", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-competitive-overlap",
        "Competitive overlap, affinity and white spots",
        ["aggregate_mobility"],
      ),
    ],
    evidence: [
      connected(
        "Aggregate mobility and competitive destination locations provide contextual overlap.",
        ["aggregate_mobility"],
      ),
      derived(
        "Cross-visitation, overlap, competitive affinity and white spots are contextual outputs, not direct arrival measures.",
        ["aggregate_mobility"],
      ),
      decision("Focus marketing and understand destination competition."),
    ],
    technologyCapabilityIds: ["TECH-07"],
    proofAssetIds: ["CASE-OUT-01"],
    nextCta: "Measure destination arrival",
    nextSceneId: "outlet-centre-vehicle-coach-arrival",
    sourceRefs: source(39),
  },
  {
    id: "outlet-centre-vehicle-coach-arrival",
    segment: "outlet-centre",
    title: "Vehicle & coach arrival",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 3,
    commercialQuestion: "When do cars and coaches arrive, and through which access points?",
    supportingLine: "Prepare parking, staffing and operations for destination peaks",
    visualAssetId: "VIS-OUT-01",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-arrival-rhythm",
        "Vehicle arrival rhythm and access-point share",
        ["vehicle_events"],
      ),
      dependency(
        "outlet-centre-coach-car-pattern",
        "Coach-versus-car pattern where definitions support it",
        ["vehicle_events", "coach_events"],
      ),
    ],
    evidence: [
      measured(
        "Vehicle entries/exits are measured; coach arrivals are included only where explicitly measured.",
        ["vehicle_events", "coach_events"],
      ),
      connected(
        "Parking/access layout, tourism and event context explain the arrival pattern.",
        ["operational_context"],
      ),
      derived(
        "Arrival rhythm, access-point share and coach-versus-car pattern are shown only to the level supported by definitions.",
        ["vehicle_events", "coach_events"],
      ),
      decision("Prepare parking, staffing and operations for destination peaks."),
    ],
    technologyCapabilityIds: ["TECH-06"],
    proofAssetIds: ["CASE-OUT-02"],
    nextCta: "Measure centre entrances",
    nextSceneId: "outlet-centre-entrances",
    sourceRefs: source(40),
  },
  {
    id: "outlet-centre-entrances",
    segment: "outlet-centre",
    title: "Centre entrances",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 4,
    commercialQuestion: "How many visitors enter the outlet streets and when?",
    supportingLine: "Plan operations, staffing, security and opening hours",
    visualAssetId: "VIS-OUT-01",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-entrance-rhythm",
        "Entrance share and peak arrival periods",
        ["entrance_events"],
      ),
    ],
    evidence: [
      measured(
        "Entries and exits are measured per outlet entrance by time.",
        ["entrance_events"],
      ),
      connected(
        "Opening hours, tourism, events and weather context may explain arrival patterns.",
        ["operational_context"],
      ),
      derived(
        "Entrance share, peak arrival periods and demand signatures require the physical time series.",
        ["entrance_events"],
      ),
      decision("Plan operations, staffing, security and opening hours."),
    ],
    technologyCapabilityIds: ["TECH-02"],
    proofAssetIds: ["CASE-OUT-02"],
    nextCta: "Understand visitor mix",
    nextSceneId: "outlet-centre-visitor-composition",
    sourceRefs: source(41),
  },
  {
    id: "outlet-centre-visitor-composition",
    segment: "outlet-centre",
    title: "Visitor composition",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 5,
    commercialQuestion: "What anonymous visitor mix enters the outlet centre?",
    supportingLine: "Understand visitor mix by period, entrance and destination context",
    visualAssetId: "VIS-OUT-05",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-visitor-composition-classification",
        "Anonymous visitor composition",
        ["classification_compatible_events", "enabled_classification"],
      ),
    ],
    evidence: [
      measured(
        "Entrance visit events must support the selected anonymous classification.",
        ["classification_compatible_events", "enabled_classification"],
      ),
      connected(
        "Tourism, event and daypart context may segment the anonymous mix.",
        ["operational_context"],
      ),
      derived(
        "Group size, buying-unit and permitted anonymous classifications are estimated from configured events.",
        ["classification_compatible_events", "enabled_classification"],
      ),
      decision("Understand visitor mix by period, entrance and destination context."),
    ],
    technologyCapabilityIds: ["TECH-03"],
    proofAssetIds: ["CASE-OUT-03"],
    nextCta: "Follow circulation",
    nextSceneId: "outlet-centre-circulation",
    sourceRefs: source(42),
  },
  {
    id: "outlet-centre-time-in-destination",
    segment: "outlet-centre",
    title: "Time in destination",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 10,
    commercialQuestion: "How long do visitors stay in the outlet centre?",
    supportingLine: "Understand destination depth and operating pressure",
    visualAssetId: "VIS-OUT-02",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-time-in-destination-distribution",
        "Time-in-destination distribution",
        [],
        [["matched_visit_events"], ["trip_duration_events"]],
      ),
    ],
    evidence: [
      measured(
        "Anonymous matched entrance/exit events or continuous tracked journeys provide the duration signal.",
        ["matched_visit_events", "trip_duration_events"],
      ),
      connected(
        "Tourism, event and zone context may segment the destination-duration pattern.",
        ["operational_context"],
      ),
      derived(
        "Time-in-destination distribution is derived only from supported matching and aligned journey definitions.",
        ["matched_visit_events", "trip_duration_events"],
      ),
      decision("Understand destination depth and operating pressure."),
    ],
    technologyCapabilityIds: ["TECH-05", "TECH-04"],
    proofAssetIds: ["CASE-OUT-03"],
    nextCta: "Configure solution",
    sourceRefs: source(43),
  },
  {
    id: "outlet-centre-circulation",
    segment: "outlet-centre",
    title: "Circulation",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 6,
    commercialQuestion: "How do visitors move across outlet streets, zones and anchors?",
    supportingLine: "Improve wayfinding, layout, events and circulation planning",
    visualAssetId: "VIS-OUT-02",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-circulation-pattern",
        "Circulation patterns, route structure and bottlenecks",
        ["spatial_trajectories", "spatial_definitions", "zone_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Anonymous trajectories, zone entries/exits and transitions provide the movement signal.",
        ["spatial_trajectories"],
      ),
      connected(
        "Street, zone, anchor and brand-area definitions provide spatial meaning.",
        ["spatial_definitions", "zone_mapping"],
      ),
      derived(
        "Circulation patterns, route structure, movement depth and bottlenecks require aligned movement and definitions.",
        ["spatial_trajectories", "spatial_definitions", "zone_mapping"],
      ),
      decision("Improve wayfinding, layout, events and circulation planning."),
    ],
    technologyCapabilityIds: ["TECH-04"],
    proofAssetIds: ["CASE-OUT-03"],
    nextCta: "Explore zone exposure",
    nextSceneId: "outlet-centre-zone-exposure-dwell",
    sourceRefs: source(44),
  },
  {
    id: "outlet-centre-zone-exposure-dwell",
    segment: "outlet-centre",
    title: "Zone exposure & dwell",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 7,
    commercialQuestion: "Which outlet zones and brand areas receive attention?",
    supportingLine: "Support tenant conversations, events, leasing context and space planning",
    visualAssetId: "VIS-OUT-02",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-zone-exposure",
        "Zone exposure, reach, dwell and hot/cold areas",
        ["zone_events", "zone_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Zone presence, entries and time provide the physical exposure signal.",
        ["zone_events"],
      ),
      connected(
        "Brand-area, anchor, event and street mapping defines the comparison areas.",
        ["zone_mapping"],
      ),
      derived(
        "Zone exposure, dwell, reach and hot/cold areas require aligned zone events and spatial mappings.",
        ["zone_events", "zone_mapping"],
      ),
      decision("Support tenant conversations, events, leasing context and space planning."),
    ],
    technologyCapabilityIds: ["TECH-04"],
    proofAssetIds: ["CASE-OUT-03"],
    nextCta: "See brand visits",
    nextSceneId: "outlet-centre-brand-counting",
    sourceRefs: source(45),
  },
  {
    id: "outlet-centre-brand-counting",
    segment: "outlet-centre",
    title: "Brand counting",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 8,
    commercialQuestion: "Which brands are visited?",
    supportingLine: "Understand brand visitation without inferring turnover or rent potential",
    visualAssetId: "VIS-OUT-06",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-brand-visits",
        "Brand visits, visit share and time-pattern differences",
        ["brand_events", "brand_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Store or brand entry events are counted only within covered boundaries.",
        ["brand_events"],
      ),
      connected(
        "Tenant/brand directory and category mapping identify the covered brand areas.",
        ["brand_mapping"],
      ),
      derived(
        "Brand visits, visit share and time-pattern differences do not establish turnover or rent potential.",
        ["brand_events", "brand_mapping"],
      ),
      decision("Understand brand visitation without inferring turnover or rent potential."),
    ],
    technologyCapabilityIds: ["TECH-02", "TECH-04"],
    proofAssetIds: ["CASE-OUT-03"],
    nextCta: "Follow brand flow",
    nextSceneId: "outlet-centre-brand-flow",
    sourceRefs: source(46),
  },
  {
    id: "outlet-centre-brand-flow",
    segment: "outlet-centre",
    title: "Brand flow",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 9,
    commercialQuestion: "How do visitors move from one brand to another?",
    supportingLine: "Inform adjacency, wayfinding and tenant / leasing conversations",
    visualAssetId: "VIS-OUT-07",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-brand-flow-sequences",
        "Brand cross-visitation and common sequences",
        ["matched_brand_events", "brand_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Anonymous matched brand visits or transitions are used only where coverage supports them.",
        ["matched_brand_events"],
      ),
      connected(
        "Tenant/brand maps and category definitions explain each transition.",
        ["brand_mapping"],
      ),
      derived(
        "Brand cross-visitation, common sequences and adjacency relationships require supported matching and mapping.",
        ["matched_brand_events", "brand_mapping"],
      ),
      decision("Inform adjacency, wayfinding and tenant / leasing conversations."),
    ],
    technologyCapabilityIds: ["TECH-05", "TECH-04"],
    proofAssetIds: ["CASE-OUT-03"],
    nextCta: "Understand time in destination",
    nextSceneId: "outlet-centre-time-in-destination",
    sourceRefs: source(47),
  },
  {
    id: "outlet-centre-parking-occupancy",
    segment: "outlet-centre",
    title: "Parking occupancy",
    journeyStage: "measure",
    priority: "optional",
    corePathOrder: null,
    commercialQuestion: "When and where does destination parking reach pressure points?",
    supportingLine: "Manage capacity and improve peak-day arrival operations",
    visualAssetId: "VIS-OUT-01",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-parking-pressure",
        "Occupancy, utilisation, turnover and peak pressure",
        ["parking_events", "parking_capacity"],
      ),
    ],
    evidence: [
      measured(
        "Vehicle entry/exit counts or bay-state events provide parking pressure evidence.",
        ["parking_events"],
      ),
      connected(
        "Parking capacity, coach zones and operating rules define the denominator and context.",
        ["parking_capacity"],
      ),
      derived(
        "Occupancy, utilisation, turnover and peak pressure require configured events and capacity definitions.",
        ["parking_events", "parking_capacity"],
      ),
      decision("Manage capacity and improve peak-day arrival operations."),
    ],
    technologyCapabilityIds: ["TECH-06"],
    proofAssetIds: ["CASE-OUT-02"],
    nextCta: "Measure centre entrances",
    nextSceneId: "outlet-centre-entrances",
    sourceRefs: source(48),
  },
  {
    id: "outlet-centre-vehicle-origin",
    segment: "outlet-centre",
    title: "Vehicle origin",
    journeyStage: "context",
    priority: "optional",
    corePathOrder: null,
    commercialQuestion: "What vehicle-origin context can be added to destination demand?",
    supportingLine: "Add international / regional destination context without overstating precision",
    visualAssetId: "VIS-OUT-04",
    dataRequirements: {
      required: ["physical", "mobile_geo", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "outlet-centre-lawful-vehicle-origin",
        "Origin mix to the level supported by the source and jurisdiction",
        ["licence_plate_events", "lawful_origin_source"],
      ),
    ],
    evidence: [
      measured(
        "Licence-plate or country-code events are used only where lawful and configured.",
        ["licence_plate_events"],
      ),
      connected(
        "A lawful origin source is needed for local geographic origin; a plate alone does not reveal a Dutch home location.",
        ["lawful_origin_source"],
      ),
      derived(
        "Vehicle-origin context is limited to the level supported by the lawful source and jurisdiction.",
        ["licence_plate_events", "lawful_origin_source"],
      ),
      decision("Add international / regional destination context without overstating precision."),
    ],
    technologyCapabilityIds: ["TECH-06", "TECH-07"],
    proofAssetIds: ["CASE-OUT-01"],
    nextCta: "Explore destination reach",
    nextSceneId: "outlet-centre-destination-catchment",
    sourceRefs: source(49),
  },
];

export const outletCentreSegment: SegmentDefinition = {
  id: "outlet-centre",
  name: "Outlet Centre",
  implementationStatus: "architecture_only",
  commercialNarrative:
    "Destination reach becomes tourism and origin context, vehicle and coach arrival, entrances, visitor mix, circulation, exposure, brand flow and time in destination, then a destination decision.",
  scenes: outletCentreScenes,
  coreRoute: [
    "outlet-centre-destination-catchment",
    "outlet-centre-tourism-origin-context",
    "outlet-centre-vehicle-coach-arrival",
    "outlet-centre-entrances",
    "outlet-centre-visitor-composition",
    "outlet-centre-circulation",
    "outlet-centre-zone-exposure-dwell",
    "outlet-centre-brand-counting",
    "outlet-centre-brand-flow",
    "outlet-centre-time-in-destination",
  ],
  optionalBranches: [
    "outlet-centre-competitive-destinations-white-spots",
    "outlet-centre-parking-occupancy",
    "outlet-centre-vehicle-origin",
  ],
  advancedBranches: [],
  stageMapping: {
    context: [
      "outlet-centre-destination-catchment",
      "outlet-centre-tourism-origin-context",
      "outlet-centre-competitive-destinations-white-spots",
      "outlet-centre-vehicle-origin",
    ],
    measure: [
      "outlet-centre-vehicle-coach-arrival",
      "outlet-centre-entrances",
      "outlet-centre-visitor-composition",
      "outlet-centre-parking-occupancy",
    ],
    understand: [
      "outlet-centre-time-in-destination",
      "outlet-centre-circulation",
      "outlet-centre-zone-exposure-dwell",
      "outlet-centre-brand-counting",
      "outlet-centre-brand-flow",
    ],
    prove: [],
    configure: [],
    act: [],
  },
  synthesis: {
    configure: {
      journeyStage: "configure",
      governingQuestion:
        "What measurement and context do we need to answer this destination question?",
      captures: [
        "selected_question",
        "required_capabilities",
        "required_context",
        "selected_insight_depth",
        "possible_implementation_choices",
      ],
      recommendationMode: "none",
      sourceRefs: [
        `${storyArchitecture}: Outlet Centre synthesis route`,
        `${salesDirection}: §22 Configure direction`,
      ],
    },
    act: {
      journeyStage: "act",
      governingQuestion: "What destination decision should we explore, test or agree next?",
      captures: [
        "observed_evidence",
        "interpretation",
        "investigation_or_test",
        "next_step",
        "human_owned_decision",
      ],
      decisionOwner: "human",
      sourceRefs: [
        `${storyArchitecture}: Outlet Centre synthesis route`,
        `${salesDirection}: §23 Act direction`,
      ],
    },
  },
  sourceRefs: [
    `${storyArchitecture}: Outlet Centre — product architecture`,
    `${matrix}: PFM Matrix!A37:P49`,
  ],
};
