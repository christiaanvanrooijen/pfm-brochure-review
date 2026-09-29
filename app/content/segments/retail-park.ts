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
): DerivedDependencyDefinition => ({ id, output, requiredInputIds });

export const retailParkScenes: readonly SceneDefinition[] = [
  {
    id: "retail-park-catchment-area",
    segment: "retail-park",
    title: "Catchment area",
    journeyStage: "context",
    priority: "core",
    corePathOrder: 1,
    commercialQuestion: "Where do park visitors come from, and what demand sits around the asset?",
    supportingLine: "Inform marketing, tenant mix and park positioning",
    visualAssetId: "VIS-RP-04",
    dataRequirements: {
      required: ["mobile_geo", "insight"],
      optional: ["physical", "business"],
    },
    derivedDependencies: [
      dependency(
        "retail-park-catchment-reach",
        "Catchment bands, origin mix, visitor profile and drive-time reach",
        ["aggregate_mobility"],
      ),
    ],
    evidence: [
      measured(
        "Asset or unit visits can anchor on-site demand, but unit sensors do not measure origin.",
        ["asset_baseline_visits"],
      ),
      connected(
        "Approved aggregate mobility, geo-location and contextual origin sources describe demand around the park.",
        ["aggregate_mobility"],
      ),
      derived(
        "Catchment bands, origin mix, visitor-profile context and drive-time reach require the approved aggregate source.",
        ["aggregate_mobility"],
      ),
      decision("Inform marketing, tenant mix and park positioning."),
    ],
    technologyCapabilityIds: ["TECH-07"],
    proofAssetIds: ["CASE-RP-01"],
    nextCta: "Measure vehicle arrival",
    nextSceneId: "retail-park-vehicle-arrival",
    sourceRefs: source(27),
  },
  {
    id: "retail-park-competitive-visitation-white-spots",
    segment: "retail-park",
    title: "Competitive visitation & white spots",
    journeyStage: "context",
    priority: "optional",
    corePathOrder: null,
    commercialQuestion: "Which competing parks or centres attract the same audience?",
    supportingLine: "Prioritise marketing areas and understand competitive behaviour",
    visualAssetId: "VIS-RP-03",
    dataRequirements: {
      required: ["mobile_geo", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-park-competitive-overlap",
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
        "Cross-visitation, overlap, competitive affinity and white spots are contextual outputs, not direct vehicle counts.",
        ["aggregate_mobility"],
      ),
      decision("Prioritise marketing areas and understand competitive behaviour."),
    ],
    technologyCapabilityIds: ["TECH-07"],
    proofAssetIds: ["CASE-RP-01"],
    nextCta: "Measure vehicle arrival",
    nextSceneId: "retail-park-vehicle-arrival",
    sourceRefs: source(28),
  },
  {
    id: "retail-park-vehicle-arrival",
    segment: "retail-park",
    title: "Vehicle arrival",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 2,
    commercialQuestion: "How many vehicles arrive, and when?",
    supportingLine: "Manage access, peaks and operating requirements",
    visualAssetId: "VIS-RP-01",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "retail-park-vehicle-arrival-rhythm",
        "Arrival peaks, access-point share and vehicle demand signature",
        ["vehicle_events"],
      ),
    ],
    evidence: [
      measured(
        "Vehicle entries and exits are measured by access point and time.",
        ["vehicle_events"],
      ),
      connected(
        "Opening hours, events, access-road and weather context may explain vehicle demand.",
        ["operational_context"],
      ),
      derived(
        "Arrival peaks, access-point share and the vehicle demand signature require the physical time series.",
        ["vehicle_events"],
      ),
      decision("Manage access, peaks and operating requirements."),
    ],
    technologyCapabilityIds: ["TECH-06"],
    proofAssetIds: ["CASE-RP-02"],
    nextCta: "Explore parking",
    nextSceneId: "retail-park-parking-occupancy",
    sourceRefs: source(29),
  },
  {
    id: "retail-park-parking-occupancy",
    segment: "retail-park",
    title: "Parking occupancy",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 3,
    commercialQuestion: "How much parking capacity is used and where?",
    supportingLine: "Improve parking operations and peak-day planning",
    visualAssetId: "VIS-RP-01",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-park-parking-pressure",
        "Occupancy, utilisation, turnover and pressure by zone",
        ["parking_events", "parking_capacity"],
      ),
    ],
    evidence: [
      measured(
        "Vehicle entry/exit counts or bay-state events provide the parking signal, depending on setup.",
        ["parking_events"],
      ),
      connected(
        "Parking capacity, zones and operating rules define the denominator and context.",
        ["parking_capacity"],
      ),
      derived(
        "Occupancy, utilisation, turnover and pressure by zone require configured parking events and capacity definitions.",
        ["parking_events", "parking_capacity"],
      ),
      decision("Improve parking operations and peak-day planning."),
    ],
    technologyCapabilityIds: ["TECH-06"],
    proofAssetIds: ["CASE-RP-02"],
    nextCta: "See unit visits",
    nextSceneId: "retail-park-unit-visits",
    sourceRefs: source(30),
  },
  {
    id: "retail-park-unit-visits",
    segment: "retail-park",
    title: "Unit visits",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 4,
    commercialQuestion: "Which units are visited, and when?",
    supportingLine: "Understand unit exposure and operating patterns",
    visualAssetId: "VIS-RP-02",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-park-unit-visits-by-period",
        "Unit visits, visit share, peaks and category visitation",
        ["unit_events", "unit_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Visitor entries at covered units or pedestrian zones provide the unit signal.",
        ["unit_events"],
      ),
      connected(
        "Tenant directory, unit category, boundaries and applicable opening hours define coverage.",
        ["unit_mapping"],
      ),
      derived(
        "Unit visits, visit share, peaks and category visitation require covered unit events and mapping.",
        ["unit_events", "unit_mapping"],
      ),
      decision("Understand unit exposure and operating patterns."),
    ],
    technologyCapabilityIds: ["TECH-02"],
    proofAssetIds: ["CASE-RP-02"],
    nextCta: "Follow cross-visitation",
    nextSceneId: "retail-park-cross-visitation",
    sourceRefs: source(31),
  },
  {
    id: "retail-park-visitor-composition",
    segment: "retail-park",
    title: "Visitor composition",
    journeyStage: "measure",
    priority: "optional",
    corePathOrder: null,
    commercialQuestion: "What anonymous visitor mix reaches units or shared areas?",
    supportingLine: "Compare audience mix across units, periods or categories",
    visualAssetId: "VIS-RP-05",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "retail-park-visitor-composition-classification",
        "Anonymous visitor composition",
        ["classification_compatible_events", "enabled_classification"],
      ),
    ],
    evidence: [
      measured(
        "Visit events at covered unit or shared-area sensors must support the configured classification.",
        ["classification_compatible_events", "enabled_classification"],
      ),
      connected(
        "Time, category or campaign context may segment the anonymous mix.",
        ["operational_context"],
      ),
      derived(
        "Group size, buying-unit and permitted anonymous classifications are estimated from configured events.",
        ["classification_compatible_events", "enabled_classification"],
      ),
      decision("Compare audience mix across units, periods or categories."),
    ],
    technologyCapabilityIds: ["TECH-03"],
    proofAssetIds: ["CASE-RP-03"],
    nextCta: "Follow cross-visitation",
    nextSceneId: "retail-park-cross-visitation",
    sourceRefs: source(32),
  },
  {
    id: "retail-park-cross-visitation",
    segment: "retail-park",
    title: "Cross-visitation",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 5,
    commercialQuestion: "How do visitors move from unit to unit?",
    supportingLine: "Support adjacency, tenant mix, leasing context and park layout",
    visualAssetId: "VIS-RP-02",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-park-unit-cross-visitation",
        "Cross-visitation, common sequences and units per trip",
        ["matched_visit_events", "unit_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Anonymous matched unit visits and transitions are used only where coverage supports them.",
        ["matched_visit_events"],
      ),
      connected(
        "Tenant and category mapping defines the units and categories in the flow network.",
        ["unit_mapping"],
      ),
      derived(
        "Cross-visitation, common sequences, average units per trip and category relationships require matching and mapping.",
        ["matched_visit_events", "unit_mapping"],
      ),
      decision("Support adjacency, tenant mix, leasing context and park layout."),
    ],
    technologyCapabilityIds: ["TECH-05"],
    proofAssetIds: ["CASE-RP-03"],
    nextCta: "Understand time on site",
    nextSceneId: "retail-park-time-on-site",
    sourceRefs: source(33),
  },
  {
    id: "retail-park-time-on-site",
    segment: "retail-park",
    title: "Time on site",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 6,
    commercialQuestion: "How long do visitors spend in the retail park?",
    supportingLine: "Compare quick missions with deeper multi-unit visits",
    visualAssetId: "VIS-RP-06",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "retail-park-time-on-site-distribution",
        "Time-on-site distribution by visit pattern",
        ["trip_duration_events"],
      ),
    ],
    evidence: [
      measured(
        "Supported vehicle or visitor duration events provide the explicitly labelled duration unit.",
        ["trip_duration_events"],
      ),
      connected(
        "Opening hours, unit visits and event context may segment the duration pattern.",
        ["operational_context"],
      ),
      derived(
        "Time-on-site distribution is derived from aligned arrival/departure definitions; vehicle duration is not people duration.",
        ["trip_duration_events"],
      ),
      decision("Compare quick missions with deeper multi-unit visits."),
    ],
    technologyCapabilityIds: ["TECH-05", "TECH-06"],
    proofAssetIds: ["CASE-RP-03"],
    nextCta: "Explore unit exposure",
    nextSceneId: "retail-park-unit-category-exposure",
    sourceRefs: source(34),
  },
  {
    id: "retail-park-unit-category-exposure",
    segment: "retail-park",
    title: "Unit & category exposure",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 7,
    commercialQuestion: "How does visitor exposure vary across units and categories?",
    supportingLine: "Inform category planning, signage and leasing conversations",
    visualAssetId: "VIS-RP-07",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-park-unit-category-exposure",
        "Exposure rate, category reach and unit visitation depth",
        ["unit_events", "unit_mapping", "category_mapping"],
      ),
    ],
    evidence: [
      measured(
        "Unit and zone visits plus time provide the physical exposure signal.",
        ["unit_events"],
      ),
      connected(
        "Tenant, unit, category and boundary mappings provide the business meaning.",
        ["unit_mapping", "category_mapping"],
      ),
      derived(
        "Exposure rate, category reach and unit visitation depth require covered events and aligned mappings.",
        ["unit_events", "unit_mapping", "category_mapping"],
      ),
      decision("Inform category planning, signage and leasing conversations."),
    ],
    technologyCapabilityIds: ["TECH-02"],
    proofAssetIds: ["CASE-RP-03"],
    nextCta: "Configure solution",
    sourceRefs: source(35),
  },
  {
    id: "retail-park-vehicle-origin",
    segment: "retail-park",
    title: "Vehicle origin",
    journeyStage: "context",
    priority: "advanced",
    corePathOrder: null,
    commercialQuestion: "What origin context can legally be associated with vehicle arrivals?",
    supportingLine: "Add regional/destination context to vehicle-heavy visitation",
    visualAssetId: "VIS-RP-04",
    dataRequirements: {
      required: ["physical", "mobile_geo", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "retail-park-lawful-vehicle-origin",
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
        "Local origin needs a lawful external source; plate format alone may support only limited context.",
        ["lawful_origin_source"],
      ),
      derived(
        "Origin mix is limited to the level supported by the lawful source and jurisdiction.",
        ["licence_plate_events", "lawful_origin_source"],
      ),
      decision("Add regional/destination context to vehicle-heavy visitation."),
    ],
    technologyCapabilityIds: ["TECH-06", "TECH-07"],
    proofAssetIds: ["CASE-RP-01"],
    nextCta: "Explore catchment",
    nextSceneId: "retail-park-catchment-area",
    sourceRefs: source(36),
  },
];

export const retailParkSegment: SegmentDefinition = {
  id: "retail-park",
  name: "Retail Park",
  implementationStatus: "architecture_only",
  commercialNarrative:
    "Catchment becomes vehicle arrival, parking, unit visits, cross-visitation, time on site and unit/category exposure, then a property decision.",
  scenes: retailParkScenes,
  coreRoute: [
    "retail-park-catchment-area",
    "retail-park-vehicle-arrival",
    "retail-park-parking-occupancy",
    "retail-park-unit-visits",
    "retail-park-cross-visitation",
    "retail-park-time-on-site",
    "retail-park-unit-category-exposure",
  ],
  optionalBranches: [
    "retail-park-competitive-visitation-white-spots",
    "retail-park-visitor-composition",
  ],
  advancedBranches: ["retail-park-vehicle-origin"],
  stageMapping: {
    context: [
      "retail-park-catchment-area",
      "retail-park-competitive-visitation-white-spots",
      "retail-park-vehicle-origin",
    ],
    measure: [
      "retail-park-vehicle-arrival",
      "retail-park-parking-occupancy",
      "retail-park-unit-visits",
      "retail-park-visitor-composition",
    ],
    understand: [
      "retail-park-cross-visitation",
      "retail-park-time-on-site",
      "retail-park-unit-category-exposure",
    ],
    prove: [],
    configure: [],
    act: [],
  },
  synthesis: {
    configure: {
      journeyStage: "configure",
      governingQuestion:
        "What measurement and context do we need to answer this park question?",
      captures: [
        "selected_question",
        "required_capabilities",
        "required_context",
        "selected_insight_depth",
        "possible_implementation_choices",
      ],
      recommendationMode: "none",
      sourceRefs: [
        `${storyArchitecture}: Retail Park synthesis route`,
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
        `${storyArchitecture}: Retail Park synthesis route`,
        `${salesDirection}: §23 Act direction`,
      ],
    },
  },
  sourceRefs: [
    `${storyArchitecture}: Retail Park — product architecture`,
    `${matrix}: PFM Matrix!A27:P36`,
  ],
};

