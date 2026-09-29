import type {
  AccountFixture,
  CapabilityFixture,
  ChallengeFixture,
  LensFixture,
  ProofFixture,
  QsrDaypartFixture,
  QsrMetricFixture,
  QsrRestaurantFixture,
  QsrStoryFixture,
  QsrVehicleJourneyFixture,
  RetailMetricFixture,
  RetailPeriodFixture,
  RetailStoryFixture,
  StageFixture,
} from "./types";

const direct = (sourceId: string, locator: string) => ({
  sourceId,
  locator,
  evidence: "direct" as const,
});

export const stages: StageFixture[] = [
  {
    id: "context",
    label: "Context",
    kicker: "01 · Context",
    title: "Start outside.",
    description:
      "See the catchment and movement around one retail location before measuring what becomes a visit.",
    nextLabel: "Move to measurement",
    source: direct("ce-demo-001r", "Context — outside opportunity"),
  },
  {
    id: "measure",
    label: "Measure",
    kicker: "02 · Measure",
    title: "Measure what enters.",
    description:
      "Use direct physical measurement at the entrance as a distinct, trusted location signal.",
    nextLabel: "Understand the visit",
    source: direct("ce-demo-001r", "Measure — aligned passing audience and visits"),
  },
  {
    id: "understand",
    label: "Understand",
    kicker: "03 · Understand",
    title: "Understand the visit.",
    description:
      "Connect physical visits with illustrative business data, then frame one decision-relevant question.",
    nextLabel: "Build confidence",
    source: direct("ce-demo-001r", "Understand — performance chain and comparison"),
  },
  {
    id: "prove",
    label: "Prove",
    kicker: "04 · Prove",
    title: "Build to believe.",
    description:
      "Use a short method story, illustrative proof and one compact case interaction to make the approach tangible.",
    nextLabel: "Configure the scope",
    source: direct("demo-scope", "Build to believe"),
  },
  {
    id: "configure",
    label: "Configure",
    kicker: "05 · Configure",
    title: "Shape the right starting point.",
    description:
      "Carry the questions, capabilities and data layers from this session into the Quote Builder boundary.",
    nextLabel: "Choose next actions",
    source: direct("demo-scope", "Configure"),
  },
  {
    id: "act",
    label: "Act",
    kicker: "06 · Act",
    title: "Keep the story moving.",
    description:
      "Simulate the commercial follow-up, publish a selected client view and prepare the next conversation.",
    nextLabel: "Complete session",
    source: direct("demo-scope", "Act and Client-room preview"),
  },
];

export const lenses: LensFixture[] = [
  {
    id: "mobile-geo",
    shortLabel: "Geo",
    label: "Mobile & geo context",
    role: "Sampled or modelled area context — never an exact sensor count.",
    truthLabel: "Contextual",
    source: direct("design-system", "Data semantics — Mobile and geo context"),
  },
  {
    id: "physical",
    shortLabel: "Measure",
    label: "Physical measurement",
    role: "Directly measured or explicitly supplied location signal.",
    truthLabel: "Measured",
    source: direct("design-system", "Data semantics — Physical measurement"),
  },
  {
    id: "business",
    shortLabel: "Business",
    label: "Connected business data",
    role: "Customer-connected context such as point-of-sale or staffing data.",
    truthLabel: "Connected",
    source: direct("design-system", "Data semantics — Business data"),
  },
  {
    id: "derived",
    shortLabel: "Insight",
    label: "Derived insight",
    role: "Calculated, classified, compared or modelled interpretation.",
    truthLabel: "Derived",
    source: direct("design-system", "Data semantics — Derived insight"),
  },
];

export const accounts: AccountFixture[] = [
  {
    id: "northstar",
    name: "Northstar Retail Group",
    detail: "Fictional account · simulated Odoo opportunity",
    opportunity: "Store opportunity and conversion review",
    locationCount: 24,
    fictional: true,
    source: direct("task-001", "Implementation boundaries — fictional local fixtures"),
  },
  {
    id: "fieldstone",
    name: "Fieldstone Stores",
    detail: "Fictional prospect · retail portfolio",
    opportunity: "New retail exploration",
    locationCount: 8,
    fictional: true,
    source: direct("task-001", "Implementation boundaries — fictional local fixtures"),
  },
];

export const challenges: ChallengeFixture[] = [
  {
    id: "compare-location-performance",
    label: "Compare locations fairly",
    description: "Separate outside opportunity from what happens at each entrance.",
    capabilityIds: ["entrance-intelligence", "portfolio-comparison"],
    source: direct("product-brief", "Initial vertical — Retail"),
  },
  {
    id: "understand-capture",
    label: "Understand capture",
    description: "Examine how passing movement becomes a measured visit.",
    capabilityIds: ["mobile-catchment", "capture-rate"],
    source: direct("product-brief", "Initial vertical — Retail"),
  },
  {
    id: "understand-the-visit",
    label: "Understand the visit",
    description: "Explore anonymous routes, dwell and relevant operating context.",
    capabilityIds: ["entrance-intelligence", "in-location-behaviour"],
    source: direct("product-brief", "Initial vertical — Retail"),
  },
];

export const discoveryQuestions = [
  {
    id: "location-potential",
    label: "Why does location potential not consistently become visits and performance?",
    description: "Separate surrounding reach, measured visits and relevant operating context.",
    challengeIds: ["compare-location-performance", "understand-capture", "understand-the-visit"],
    source: direct("retail-go-demo-package", "Screen 2 — Discovery question"),
  },
  {
    id: "location-attention",
    label: "Which locations need attention first?",
    description: "Compare locations using consistent definitions and clearly labelled evidence.",
    challengeIds: ["compare-location-performance"],
    source: direct("retail-go-demo-package", "Screen 2 — Discovery question"),
  },
  {
    id: "day-patterns",
    label: "How do visit patterns differ across the day?",
    description: "Explore movement and visits by time window without claiming a cause.",
    challengeIds: ["understand-capture", "understand-the-visit"],
    source: direct("retail-go-demo-package", "Screen 2 — Discovery question"),
  },
] as const;

export const capabilities: CapabilityFixture[] = [
  {
    id: "entrance-intelligence",
    label: "Entrance intelligence",
    description: "Direct entrance measurement and visit trends.",
    group: "core",
    source: direct("product-brief", "Initial vertical — entrance visits"),
  },
  {
    id: "capture-rate",
    label: "Capture-rate view",
    description: "A derived comparison when source definitions align.",
    group: "core",
    source: direct("demo-scope", "Configure — selected capabilities"),
  },
  {
    id: "mobile-catchment",
    label: "Mobile catchment context",
    description: "Sampled context around the location.",
    group: "core",
    source: direct("design-system", "Mobile and geo context"),
  },
  {
    id: "portfolio-comparison",
    label: "Portfolio comparison",
    description: "A consistent view across selected locations.",
    group: "core",
    source: direct("product-brief", "Initial vertical — portfolio comparison"),
  },
  {
    id: "in-location-behaviour",
    label: "In-location behaviour",
    description: "Anonymous route, dwell and zone patterns.",
    group: "continuity",
    source: direct("product-brief", "Initial vertical — in-store routes and dwell"),
  },
  {
    id: "visitor-classification",
    label: "Visitor classification",
    description: "Estimated classifications: Adults / children, Estimated age bands and Estimated gender classification; shown only when enabled.",
    group: "classification",
    source: direct("retail-go-demo-package", "Entrance — visitor classification"),
  },
  {
    id: "anonymous-journey-continuity",
    label: "Anonymous journey continuity",
    description: "Anonymous route and zone continuity; not named identity or facial identification.",
    group: "continuity",
    source: direct("retail-go-demo-package", "Entrance — journey continuity"),
  },
];

export const proofItems: ProofFixture[] = [
  {
    id: "method",
    label: "Method story",
    detail: "How context and direct measurement remain distinct.",
    source: direct("demo-scope", "Build to believe — method/privacy explainer"),
  },
  {
    id: "case",
    label: "Retail case pattern",
    detail: "A fictional, outcome-free case interaction.",
    source: direct("demo-scope", "Build to believe — compact case interaction"),
  },
  {
    id: "why-pfm",
    label: "Why PFM",
    detail: "A connected story from question to next action.",
    source: direct("product-brief", "Product statement and vision"),
  },
];

const retailMetric = (
  metric: Omit<RetailMetricFixture, "source">,
  sourceId: string,
  locator: string,
): RetailMetricFixture => ({
  ...metric,
  source: direct(sourceId, locator),
});

const morningPeriod: RetailPeriodFixture = {
  id: "morning",
  label: "Illustrative morning · 08:00–12:00",
  passingAudience: retailMetric(
    {
      id: "morning-passing-audience",
      label: "Passing audience",
      value: 2900,
      displayValue: "2,900",
      unit: "passers-by",
      role: "contextual",
      definition: "Sampled aggregate people near the defined store frontage.",
      scope: "Utrecht Central Store frontage · primary entrance",
    },
    "kpi-library",
    "Passers-by and capture rate",
  ),
  visits: retailMetric(
    {
      id: "morning-visits",
      label: "Store entries",
      value: 420,
      displayValue: "420",
      unit: "visits",
      role: "measured",
      definition: "Anonymous entries crossing the primary entrance threshold.",
      scope: "Utrecht Central Store · same frontage and period",
    },
    "kpi-library",
    "Visits / footfall",
  ),
  transactions: retailMetric(
    {
      id: "morning-transactions",
      label: "Transactions",
      value: 76,
      displayValue: "76",
      unit: "transactions",
      role: "connected",
      definition: "Illustrative customer-supplied point-of-sale transaction count.",
      scope: "Utrecht Central Store · same period",
    },
    "kpi-library",
    "Conversion",
  ),
  transactionValue: retailMetric(
    {
      id: "morning-transaction-value",
      label: "Transaction value",
      value: 4560,
      displayValue: "€4,560",
      unit: "total value",
      role: "connected",
      definition: "Illustrative customer-supplied transaction value context.",
      scope: "Utrecht Central Store · same period",
    },
    "kpi-library",
    "Average transaction value",
  ),
  conversionDisplay: "18.1%",
  source: direct("retail-go-demo-package", "Screen 5 — Performance chain"),
};

const afternoonPeriod: RetailPeriodFixture = {
  id: "afternoon",
  label: "Illustrative afternoon · 12:00–18:00",
  passingAudience: retailMetric(
    {
      id: "afternoon-passing-audience",
      label: "Passing audience",
      value: 4250,
      displayValue: "4,250",
      unit: "passers-by",
      role: "contextual",
      definition: "Sampled aggregate people near the defined store frontage.",
      scope: "Utrecht Central Store frontage · primary entrance",
    },
    "kpi-library",
    "Passers-by and capture rate",
  ),
  visits: retailMetric(
    {
      id: "afternoon-visits",
      label: "Store entries",
      value: 681,
      displayValue: "681",
      unit: "visits",
      role: "measured",
      definition: "Anonymous entries crossing the primary entrance threshold.",
      scope: "Utrecht Central Store · same frontage and period",
    },
    "kpi-library",
    "Visits / footfall",
  ),
  transactions: retailMetric(
    {
      id: "afternoon-transactions",
      label: "Transactions",
      value: 103,
      displayValue: "103",
      unit: "transactions",
      role: "connected",
      definition: "Illustrative customer-supplied point-of-sale transaction count.",
      scope: "Utrecht Central Store · same period",
    },
    "kpi-library",
    "Conversion",
  ),
  transactionValue: retailMetric(
    {
      id: "afternoon-transaction-value",
      label: "Transaction value",
      value: 6480,
      displayValue: "€6,480",
      unit: "total value",
      role: "connected",
      definition: "Illustrative customer-supplied transaction value context.",
      scope: "Utrecht Central Store · same period",
    },
    "kpi-library",
    "Average transaction value",
  ),
  conversionDisplay: "15.1%",
  source: direct("retail-go-demo-package", "Screen 5 — Performance chain"),
};

export const retailStory: RetailStoryFixture = {
  locationLabel: "Utrecht Central Store",
  areaDefinition: "Utrecht Central Store frontage · primary entrance",
  audienceDefinition: "Passing audience = sampled aggregate people near the defined frontage; visits = anonymous entries crossing the primary entrance threshold.",
  periodDefinition: "Illustrative comparable periods · same frontage and definitions",
  context: retailMetric(
    {
      id: "context-passing-audience",
      label: "Outside opportunity",
      value: 4250,
      displayValue: "4,250",
      unit: "passers-by",
      role: "contextual",
      definition: "Sampled aggregate passing opportunity, not an exact sensor count.",
      scope: "Illustrative afternoon · 12:00–18:00 · Utrecht Central Store frontage",
    },
    "retail-fit-signals",
    "Outside location context and movement patterns",
  ),
  periods: [morningPeriod, afternoonPeriod],
  source: direct("retail-go-demo-package", "Screen 3–5 — Context, Measure and Understand"),
};

// ---------------------------------------------------------------------------
// QSR / Drive-Thru illustrative demo fixture.
//
// EVERY value below is a fictional interface example taken from the QSR
// specification's prototype-data section (§17). They are explicitly NOT:
//   - HME benchmarks;
//   - QSR industry benchmarks;
//   - customer results;
//   - PFM performance claims;
//   - evidence that any operational cause, revenue effect or improvement
//     is attributable to the technology.
//
// The restaurant names are ordinary Dutch city names used as fictional
// locations for a fictional neutral QSR brand. No real customer, franchise or
// brand is represented. [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md
// §17 Example narrative data for prototype mode, §13.1 fictional brand rule]
// ---------------------------------------------------------------------------

const qsrSpecSource = direct(
  "qsr-commercial-experience-agent-spec",
  "§17 Example narrative data for prototype mode — fictional interface examples",
);

const qsrMetric = (
  metric: Omit<QsrMetricFixture, "source" | "illustrative">,
): QsrMetricFixture => ({
  ...metric,
  illustrative: true,
  source: qsrSpecSource,
});

const qsrLunchDaypart: QsrDaypartFixture = {
  id: "qsr-lunch",
  label: "Illustrative lunch daypart",
  vehicles: qsrMetric({
    id: "qsr-lunch-vehicles",
    label: "Vehicles",
    value: 126,
    displayValue: "126",
    unit: "vehicles",
    role: "measured",
    definition: "Vehicles detected at the configured lane-entry point in the measured period.",
    scope: "Illustrative lunch daypart · single restaurant · configured drive-thru lane",
  }),
  averageLaneTotal: qsrMetric({
    id: "qsr-lunch-average-lane-total",
    label: "Average lane total",
    value: 188,
    displayValue: "03:08",
    unit: "mm:ss",
    role: "derived",
    definition: "Mean measured time between the configured journey start and end detection points.",
    scope: "Illustrative lunch daypart · same detection design and period",
  }),
  serviceGoal: qsrMetric({
    id: "qsr-lunch-service-goal",
    label: "Configured service goal",
    value: 180,
    displayValue: "03:00",
    unit: "mm:ss",
    role: "connected",
    definition: "Operational target configured by the restaurant; not a measured or PFM-supplied value.",
    scope: "Illustrative lunch daypart · configured lane total target",
  }),
  withinGoal: qsrMetric({
    id: "qsr-lunch-within-goal",
    label: "Within goal",
    value: 87,
    displayValue: "87%",
    unit: "share of vehicles",
    role: "derived",
    definition: "Share of measured journeys at or below the configured goal, on aligned definitions.",
    scope: "Illustrative lunch daypart · same period and goal",
  }),
  peakQueue: qsrMetric({
    id: "qsr-lunch-peak-queue",
    label: "Peak queue",
    value: 8,
    displayValue: "8 vehicles",
    unit: "vehicles",
    role: "derived",
    definition: "Highest concurrent vehicle count between the configured queue start and the order point.",
    scope: "Illustrative lunch daypart · configured queue boundary",
  }),
  bottleneckStage: "Pickup",
  illustrative: true,
  source: qsrSpecSource,
};

const qsrVehicleJourney: QsrVehicleJourneyFixture = {
  id: "qsr-example-journey",
  label: "Illustrative single-vehicle journey",
  stages: [
    qsrMetric({
      id: "qsr-journey-arrival-to-order",
      label: "Arrival → order point",
      value: 72,
      displayValue: "01:12",
      unit: "mm:ss",
      role: "derived",
      definition: "Elapsed time between the configured lane-entry and order-point detection points.",
      scope: "Illustrative single vehicle · configured detection design",
    }),
    qsrMetric({
      id: "qsr-journey-order-dwell",
      label: "Order point dwell",
      value: 44,
      displayValue: "00:44",
      unit: "mm:ss",
      role: "measured",
      definition: "Measured dwell at the configured order-point detection point.",
      scope: "Illustrative single vehicle · configured detection design",
    }),
    qsrMetric({
      id: "qsr-journey-order-to-payment",
      label: "Order → payment",
      value: 38,
      displayValue: "00:38",
      unit: "mm:ss",
      role: "derived",
      definition: "Elapsed time between the configured order-point and payment detection points.",
      scope: "Illustrative single vehicle · configured detection design",
    }),
    qsrMetric({
      id: "qsr-journey-payment-to-pickup",
      label: "Payment → pickup",
      value: 57,
      displayValue: "00:57",
      unit: "mm:ss",
      role: "derived",
      definition: "Elapsed time between the configured payment and pickup detection points.",
      scope: "Illustrative single vehicle · configured detection design",
    }),
  ],
  total: qsrMetric({
    id: "qsr-journey-total",
    label: "Total measured journey",
    value: 211,
    displayValue: "03:31",
    unit: "mm:ss",
    role: "derived",
    definition: "Elapsed time between the configured journey start and end detection points.",
    scope: "Illustrative single vehicle · configured detection design",
  }),
  illustrative: true,
  source: qsrSpecSource,
};

const qsrEstate: QsrRestaurantFixture[] = [
  { id: "qsr-utrecht", label: "Utrecht", averageLaneTotalSeconds: 168, averageLaneTotalDisplay: "02:48", vehicles: 141, withinGoalPercent: 94, illustrative: true },
  { id: "qsr-rotterdam", label: "Rotterdam", averageLaneTotalSeconds: 186, averageLaneTotalDisplay: "03:06", vehicles: 154, withinGoalPercent: 88, illustrative: true },
  { id: "qsr-breda", label: "Breda", averageLaneTotalSeconds: 211, averageLaneTotalDisplay: "03:31", vehicles: 137, withinGoalPercent: 76, illustrative: true },
  { id: "qsr-eindhoven", label: "Eindhoven", averageLaneTotalSeconds: 176, averageLaneTotalDisplay: "02:56", vehicles: 149, withinGoalPercent: 91, illustrative: true },
];

export const qsrDriveThruStory: QsrStoryFixture = {
  brandLabel: "Northstar QSR",
  fictional: true,
  illustrative: true,
  locationLabel: "Northstar QSR Utrecht",
  areaDefinition: "Single configured drive-thru lane · lane entry to pickup window",
  periodDefinition: "Illustrative lunch daypart · same detection design and definitions",
  measurementDefinition:
    "Lane total time = measured time between the configured journey start and end detection points; queue time = measured time between the configured queue start and the order point.",
  daypart: qsrLunchDaypart,
  vehicleJourney: qsrVehicleJourney,
  estate: qsrEstate,
  estateDefinition:
    "Illustrative four-restaurant comparison on identical metric definitions, the same comparable daypart and the same configured goal.",
  disclaimer:
    "Illustrative demo data. Fictional interface examples only — not HME benchmarks, not QSR industry benchmarks, not customer results and not PFM performance claims.",
  source: qsrSpecSource,
};
