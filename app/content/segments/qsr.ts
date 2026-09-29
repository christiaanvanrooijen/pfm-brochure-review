/**
 * QSR / Drive-Thru Performance — typed content architecture.
 *
 * Architecture only. This file adds QSR to the existing typed content model so
 * the generic Scene, Technology, Proof and Evidence runtimes can answer QSR
 * questions. It does not expose QSR in the production UI and it does not
 * introduce a QSR-specific journey, router or runtime.
 *
 * Source of truth for the QSR experience content:
 * docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md
 *
 * Truth rules preserved here:
 * - The canonical journey (Context → Measure → Understand → Prove → Configure →
 *   Act) is unchanged; Configure and Act remain synthesis stages, not scenes.
 * - Timing evidence never proves a business cause. A long queue does not prove
 *   that staffing, production or communication caused it.
 * - Revenue, average order value, order accuracy, labour cost and profitability
 *   are never derived from timer data; they require connected business data.
 * - Drive-off is only available where the configured detection/AI
 *   implementation can actually determine it.
 * - No HME product is selected, ranked or recommended anywhere in this model.
 */

import type {
  DerivedDependencyDefinition,
  EvidenceInputId,
  ExperienceLensDefinition,
  SceneDefinition,
  SceneEvidenceDefinition,
  SegmentDefinition,
  TechnologyCapabilityId,
} from "../types.ts";

const qsrSpec = "docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md";
const storyArchitecture = "SEGMENT-STORY-ARCHITECTURE.md";
const salesDirection = "SALES-EXPERIENCE-DIRECTION.md";

const source = (...sections: readonly string[]): readonly string[] =>
  sections.map((section) => `${qsrSpec}: ${section}`);

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

/**
 * QSR presenter lenses.
 *
 * These are presentation groupings proposed by the QSR specification (§12).
 * They map onto the existing global evidence roles and never replace or rename
 * them. The Automation lens stays hidden by default: Voice AI and Vision AI are
 * advanced/optional, not the default configuration.
 */
export const qsrExperienceLenses: readonly ExperienceLensDefinition[] = [
  {
    id: "qsr-vehicle-flow",
    label: "Vehicle flow",
    purpose:
      "Vehicles, configured detection points, queue, stage transitions and additional configured spaces.",
    dataRoles: ["physical"],
    defaultState: "active",
    advanced: false,
    sourceRefs: source("§12.1 Physical / Vehicle Flow"),
  },
  {
    id: "qsr-communication",
    label: "Communication",
    purpose:
      "Order-point audio, crew communication, alert routing and the timer-to-headset event flow.",
    dataRoles: ["physical"],
    defaultState: "inactive",
    advanced: false,
    sourceRefs: source("§12.2 Communication"),
  },
  {
    id: "qsr-business-order",
    label: "Business / Order",
    purpose:
      "Transaction reference, order value and order state; only where a compatible POS integration is connected.",
    dataRoles: ["business"],
    defaultState: "disabled",
    advanced: false,
    sourceRefs: source("§12.3 Business / Order"),
  },
  {
    id: "qsr-insight",
    label: "Insight",
    purpose:
      "Bottleneck interpretation, goal variance, daypart pattern, comparison and the next question to ask.",
    dataRoles: ["insight"],
    defaultState: "active",
    advanced: false,
    sourceRefs: source("§12.4 Insight"),
  },
  {
    id: "qsr-automation",
    label: "Automation",
    purpose:
      "Advanced, optional automation readiness. Hidden by default; never a permanent hero lens.",
    dataRoles: ["physical", "insight"],
    defaultState: "hidden",
    advanced: true,
    sourceRefs: source("§12.5 Automation — optional advanced lens"),
  },
];

export const qsrScenes: readonly SceneDefinition[] = [
  {
    id: "qsr-drive-thru-context",
    segment: "qsr",
    title: "Drive-thru context",
    eyebrow: "Context · Drive-Thru",
    journeyStage: "context",
    priority: "core",
    corePathOrder: 1,
    commercialQuestion: "Where does your drive-thru lose time?",
    supportingLine:
      "Follow every measurable stage from arrival to handoff before discussing technology",
    visualAssetId: "VIS-QSR-CONTEXT-DRIVE-THRU",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "qsr-lane-total-time",
        "Lane total time",
        ["lane_entry_timestamp", "pickup_timestamp"],
      ),
      dependency(
        "qsr-throughput",
        "Throughput for a defined period",
        ["vehicle_count", "measurement_period"],
      ),
      dependency(
        "qsr-goal-attainment",
        "Goal attainment against a configured target",
        ["lane_entry_timestamp", "pickup_timestamp", "configured_service_goal"],
      ),
    ],
    evidence: [
      measured(
        "Vehicle detections at the configured journey start and end points provide the measured timing signal.",
        ["vehicle_detection", "lane_entry_timestamp", "pickup_timestamp", "vehicle_count"],
      ),
      connected(
        "The measurement period and the configured service goal are supplied by the operation, not measured by the timer.",
        ["measurement_period", "configured_service_goal"],
      ),
      derived(
        "Lane total time, throughput and goal attainment are calculated only from compatible journey start/end definitions and a configured target.",
        ["lane_entry_timestamp", "pickup_timestamp", "vehicle_count", "measurement_period", "configured_service_goal"],
      ),
      decision(
        "Decide which part of the drive-thru journey deserves the first operational conversation.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-01", "TECH-QSR-02"],
    proofAssetIds: [],
    nextCta: "Follow the vehicle journey",
    nextSceneId: "qsr-queue",
    presenterNotes: [
      "Open on the physical drive-thru, not on a dashboard or an HME product.",
      "Narrative metric values are illustrative interface examples, never benchmarks.",
    ],
    sourceRefs: source("§4 Experience-level headline", "§6 Scene 0 — QSR landing / context", "§33 Preferred prototype hero copy"),
  },
  {
    id: "qsr-arrival",
    segment: "qsr",
    title: "Arrival / lane entry",
    eyebrow: "Measure · Arrival",
    journeyStage: "measure",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["qsr-queue"],
    commercialQuestion: "When does the drive-thru journey really begin?",
    supportingLine:
      "The journey starts when the vehicle enters the measurable service flow, not at the pickup window",
    visualAssetId: "VIS-QSR-ARRIVAL",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "qsr-journey-start",
        "Journey start position and elapsed time from lane entry",
        ["vehicle_detection", "lane_entry_timestamp"],
      ),
    ],
    evidence: [
      measured(
        "A vehicle detection at the configured lane-entry point starts the measured journey.",
        ["vehicle_detection", "lane_entry_timestamp"],
      ),
      derived(
        "Queue position and elapsed journey time follow from the configured detection design, not from an assumed lane layout.",
        ["vehicle_detection", "lane_entry_timestamp"],
      ),
      decision(
        "Agree where the measurable drive-thru journey should start for this site.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-01", "TECH-QSR-02"],
    proofAssetIds: [],
    nextCta: "Return to queue formation",
    nextSceneId: "qsr-queue",
    sourceRefs: source("§7 Scene 1 — Arrival / lane entry"),
  },
  {
    id: "qsr-queue",
    segment: "qsr",
    title: "Queue formation",
    eyebrow: "Measure · Queue",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 2,
    commercialQuestion:
      "How long are guests waiting before they can even order?",
    supportingLine:
      "Total service time hides where friction starts; queue time can reveal capacity pressure earlier",
    visualAssetId: "VIS-QSR-QUEUE",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "qsr-queue-time",
        "Queue time before the order point",
        ["lane_entry_timestamp", "order_point_timestamp"],
      ),
      dependency(
        "qsr-peak-queue",
        "Peak queue length within the measured period",
        ["lane_entry_timestamp", "order_point_timestamp", "vehicle_count"],
      ),
      dependency(
        "qsr-drive-off",
        "Drive-off — only where the configured detection or AI implementation can determine it",
        ["drive_off_capable_detection", "lane_entry_timestamp"],
      ),
    ],
    evidence: [
      measured(
        "Detections at the defined queue start and the order point provide the measured queue boundary.",
        ["lane_entry_timestamp", "order_point_timestamp", "vehicle_count"],
      ),
      derived(
        "Queue time requires a defined queue start and a defined queue end or order-point detection; it is never inferred from total lane time.",
        ["lane_entry_timestamp", "order_point_timestamp"],
      ),
      derived(
        "Drive-off remains unavailable unless the configured detection or vision implementation can actually determine it.",
        ["drive_off_capable_detection"],
      ),
      decision(
        "Ask whether pre-order waiting is a capacity question worth investigating.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-01", "TECH-QSR-02"],
    proofAssetIds: ["proof-qsr-queue-performance"],
    nextCta: "Move to the order point",
    nextSceneId: "qsr-order",
    presenterNotes: [
      "Observed delay before order taking is an observation, not a proven staffing or production cause.",
    ],
    sourceRefs: source("§7 Scene 2 — Queue formation", "§16 KPI and data vocabulary"),
  },
  {
    id: "qsr-order",
    segment: "qsr",
    title: "Order point & guest communication",
    eyebrow: "Measure · Order",
    journeyStage: "measure",
    priority: "core",
    corePathOrder: 3,
    commercialQuestion:
      "How much time is lost when guest and crew cannot hear each other clearly?",
    supportingLine:
      "Ordering is an operational moment and a communication moment at the same time",
    visualAssetId: "VIS-QSR-ORDER",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "qsr-order-stage-time",
        "Order-stage time between two compatible configured detection points",
        ["order_point_timestamp", "payment_timestamp"],
      ),
    ],
    evidence: [
      measured(
        "Order-point and payment detections provide the two compatible configured points a stage time requires.",
        ["order_point_timestamp", "payment_timestamp"],
      ),
      measured(
        "Drive-thru and crew communication events are measured by the configured communication platform.",
        ["communication_event"],
      ),
      derived(
        "Stage time is only calculated between two compatible configured detection points.",
        ["order_point_timestamp", "payment_timestamp"],
      ),
      decision(
        "Review communication clarity where repeated-order friction is observed.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-02", "TECH-QSR-03", "TECH-QSR-04"],
    proofAssetIds: ["proof-qsr-communication"],
    nextCta: "Diagnose the bottleneck",
    nextSceneId: "qsr-bottleneck",
    presenterNotes: [
      "No causal claim about order accuracy or repetition may be made without an approved proof source.",
    ],
    sourceRefs: source("§7 Scene 3 — Order point / guest communication", "§5 Capability C", "§5 Capability D"),
  },
  {
    id: "qsr-payment",
    segment: "qsr",
    title: "Payment & production synchronisation",
    eyebrow: "Measure · Payment",
    journeyStage: "measure",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["qsr-order"],
    commercialQuestion: "Is the queue slow — or is one order slowing the queue?",
    supportingLine:
      "Order context can be associated with wait time only where a compatible POS integration exists",
    visualAssetId: "VIS-QSR-PAYMENT",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "qsr-order-context",
        "Wait time associated with order context, subject to POS compatibility",
        ["payment_timestamp", "pos_transaction_reference", "pos_order_state"],
      ),
    ],
    evidence: [
      measured(
        "Payment-window detections provide the measured stage boundary.",
        ["payment_timestamp"],
      ),
      connected(
        "Transaction reference, order value and order state remain connected POS data, subject to brand and platform compatibility.",
        ["pos_transaction_reference", "pos_order_value", "pos_order_state"],
      ),
      derived(
        "Associating wait time with order context requires a compatible POS integration; it is never inferred from timing alone.",
        ["payment_timestamp", "pos_transaction_reference", "pos_order_state"],
      ),
      decision(
        "Discuss whether a large or complex order should follow a different flow.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-02", "TECH-QSR-05"],
    proofAssetIds: [],
    nextCta: "Return to the order point",
    nextSceneId: "qsr-order",
    presenterNotes: [
      "POS capabilities depend on brand and platform integration and must never be presented as universally available.",
    ],
    sourceRefs: source("§7 Scene 4 — Payment / production synchronization", "§5 Capability E"),
  },
  {
    id: "qsr-handoff",
    segment: "qsr",
    title: "Pickup & handoff",
    eyebrow: "Measure · Handoff",
    journeyStage: "measure",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["qsr-order"],
    commercialQuestion:
      "How fast does an order become a completed guest journey?",
    supportingLine:
      "The total can be decomposed into actionable stages instead of one average",
    visualAssetId: "VIS-QSR-HANDOFF",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "qsr-handoff-stage-time",
        "Payment-to-handoff stage time",
        ["payment_timestamp", "pickup_timestamp"],
      ),
    ],
    evidence: [
      measured(
        "Payment and pickup detections close the measured journey.",
        ["payment_timestamp", "pickup_timestamp"],
      ),
      derived(
        "The handoff stage time is one decomposed part of lane total time, not a standalone performance verdict.",
        ["payment_timestamp", "pickup_timestamp"],
      ),
      decision(
        "Decide whether handoff or an upstream stage deserves attention first.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-01", "TECH-QSR-02"],
    proofAssetIds: [],
    nextCta: "Return to the order point",
    nextSceneId: "qsr-order",
    sourceRefs: source("§7 Scene 5 — Pickup / handoff"),
  },
  {
    id: "qsr-beyond-lane",
    segment: "qsr",
    title: "Pull-forward, mobile & curbside",
    eyebrow: "Measure · Beyond the lane",
    journeyStage: "measure",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["qsr-queue"],
    commercialQuestion:
      "Does moving a vehicle out of the lane really remove the wait?",
    supportingLine:
      "Pull-forward protects main-lane flow, but the guest is still waiting",
    visualAssetId: "VIS-QSR-BEYOND-LANE",
    dataRequirements: {
      required: ["physical", "insight"],
      optional: ["business"],
    },
    derivedDependencies: [
      dependency(
        "qsr-pull-forward-wait",
        "Pull-forward wait time",
        ["pull_forward_timestamp"],
      ),
      dependency(
        "qsr-mobile-pickup-wait",
        "Mobile pickup wait time",
        ["mobile_pickup_timestamp"],
      ),
    ],
    evidence: [
      measured(
        "Pull-forward and mobile-pickup waiting are only measured where those spaces are configured measurement points.",
        ["pull_forward_timestamp", "mobile_pickup_timestamp"],
      ),
      derived(
        "Pull-forward wait requires a configured pull-forward measurement point or space; mobile pickup wait requires a configured mobile pickup measurement point or space.",
        ["pull_forward_timestamp", "mobile_pickup_timestamp"],
      ),
      decision(
        "Validate whether pull-forward reduces lane time while keeping guest wait acceptable.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-01", "TECH-QSR-02"],
    proofAssetIds: [],
    nextCta: "Return to queue formation",
    nextSceneId: "qsr-queue",
    presenterNotes: [
      "The number of additional configurable dashboard spaces is a vendor-stated technical detail, not a headline message.",
    ],
    sourceRefs: source("§7 Scene 6 — Pull-forward / mobile / curbside", "§15 Product / capability truth table"),
  },
  {
    id: "qsr-bottleneck",
    segment: "qsr",
    title: "Bottleneck diagnosis",
    eyebrow: "Understand · Bottleneck",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 4,
    commercialQuestion: "Where is today's lost time actually coming from?",
    supportingLine:
      "See where time accumulates across stages instead of reading one final average",
    visualAssetId: "VIS-QSR-BOTTLENECK",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "qsr-stage-comparison",
        "Stage-level time comparison across the measured journey",
        ["lane_entry_timestamp", "order_point_timestamp", "payment_timestamp", "pickup_timestamp"],
      ),
      dependency(
        "qsr-goal-variance",
        "Variance against a configured service goal",
        ["lane_entry_timestamp", "pickup_timestamp", "configured_service_goal"],
      ),
    ],
    evidence: [
      measured(
        "Detections at every configured stage point provide the measured stage durations.",
        ["lane_entry_timestamp", "order_point_timestamp", "payment_timestamp", "pickup_timestamp"],
      ),
      connected(
        "The service goal against which variance is expressed is a configured operational target.",
        ["configured_service_goal"],
      ),
      derived(
        "The bottleneck stage and its goal variance are interpretations of measured stage time; they do not establish an operational cause.",
        ["lane_entry_timestamp", "order_point_timestamp", "payment_timestamp", "pickup_timestamp", "configured_service_goal"],
      ),
      decision(
        "Use the bottleneck to choose the next question: staffing, production, order taking, lane procedure or pull-forward.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-02", "TECH-QSR-07"],
    proofAssetIds: ["proof-qsr-bottleneck"],
    nextCta: "Close the loop with the crew",
    nextSceneId: "qsr-respond",
    presenterNotes: [
      "A stage running above goal identifies where time accumulates; it does not prove why.",
    ],
    sourceRefs: source("§8 Scene 7 — Bottleneck diagnosis", "§23 Rule 7 — Do not over-promise causality"),
  },
  {
    id: "qsr-respond",
    segment: "qsr",
    title: "Real-time response",
    eyebrow: "Understand · Respond",
    journeyStage: "understand",
    priority: "core",
    corePathOrder: 5,
    commercialQuestion:
      "Can the right person know before the queue becomes the problem?",
    supportingLine:
      "Insight is only valuable when it reaches the person who can change the outcome",
    visualAssetId: "VIS-QSR-RESPOND",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "qsr-threshold-alert",
        "Threshold alert from measured time against a configured target",
        ["lane_entry_timestamp", "pickup_timestamp", "configured_service_goal", "timer_alert_event"],
      ),
      dependency(
        "qsr-closed-loop-response",
        "Alert delivered into crew communication",
        ["timer_alert_event", "communication_event"],
      ),
    ],
    evidence: [
      measured(
        "Timer threshold events and crew communication events are measured by the configured system.",
        ["timer_alert_event", "communication_event"],
      ),
      connected(
        "Alert thresholds are configured operational targets, not measured values.",
        ["configured_service_goal"],
      ),
      derived(
        "The closed loop — detect, understand, alert, act — requires both a timer alert event and a compatible communication configuration.",
        ["timer_alert_event", "communication_event"],
      ),
      decision(
        "Agree who should be alerted, at which threshold, and what they are expected to do.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-02", "TECH-QSR-06", "TECH-QSR-03"],
    proofAssetIds: ["proof-qsr-closed-loop-response"],
    nextCta: "Compare the estate",
    nextSceneId: "qsr-estate",
    presenterNotes: [
      "The technology creates visibility and enables intervention; the operational change creates the outcome.",
    ],
    sourceRefs: source("§8 Scene 8 — Real-time action / headset alert", "§5 Capability F"),
  },
  {
    id: "qsr-daypart",
    segment: "qsr",
    title: "Daypart pattern",
    eyebrow: "Understand · Daypart",
    journeyStage: "understand",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["qsr-bottleneck"],
    commercialQuestion: "Is this a bad moment — or a repeatable operating pattern?",
    supportingLine:
      "Separate a one-off shift from a structural pattern before changing the operation",
    visualAssetId: "VIS-QSR-DAYPART",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "qsr-daypart-pattern",
        "Daypart pattern from historical evidence and consistent daypart definitions",
        ["lane_entry_timestamp", "pickup_timestamp", "vehicle_count", "daypart", "measurement_period"],
      ),
    ],
    evidence: [
      measured(
        "Historical stage timing and vehicle counts provide the measured time series.",
        ["lane_entry_timestamp", "pickup_timestamp", "vehicle_count"],
      ),
      connected(
        "Daypart boundaries and the comparison period are consistent operational definitions.",
        ["daypart", "measurement_period"],
      ),
      derived(
        "A daypart pattern requires historical time-series evidence and consistent daypart definitions across the compared periods.",
        ["lane_entry_timestamp", "pickup_timestamp", "daypart", "measurement_period"],
      ),
      decision(
        "Review staffing, process, menu mix or preparation capacity against the observed arrival pattern.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-02", "TECH-QSR-07"],
    proofAssetIds: [],
    nextCta: "Return to bottleneck diagnosis",
    nextSceneId: "qsr-bottleneck",
    presenterNotes: [
      "The system must not claim the root cause of a daypart pattern without evidence.",
    ],
    sourceRefs: source("§8 Scene 9 — Daypart pattern"),
  },
  {
    id: "qsr-estate",
    segment: "qsr",
    title: "Estate performance",
    eyebrow: "Prove · Estate",
    journeyStage: "prove",
    priority: "core",
    corePathOrder: 6,
    commercialQuestion:
      "Which restaurants are converting the same demand into faster service?",
    supportingLine:
      "Compare restaurants on comparable definitions, periods and dayparts",
    visualAssetId: "VIS-QSR-ESTATE",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "qsr-estate-comparison",
        "Cross-restaurant comparison on compatible metric definitions",
        [
          "restaurant_id",
          "restaurant_hierarchy",
          "vehicle_count",
          "lane_entry_timestamp",
          "pickup_timestamp",
          "configured_service_goal",
          "daypart",
          "measurement_period",
        ],
      ),
    ],
    evidence: [
      measured(
        "Comparable measured timing and vehicle counts are required from every compared restaurant.",
        ["lane_entry_timestamp", "pickup_timestamp", "vehicle_count"],
      ),
      connected(
        "Restaurant identity, hierarchy, goals, daypart and period definitions are supplied by the operation.",
        ["restaurant_id", "restaurant_hierarchy", "configured_service_goal", "daypart", "measurement_period"],
      ),
      derived(
        "Estate comparison requires multiple restaurants, compatible metric definitions and a comparable period or daypart.",
        ["restaurant_id", "restaurant_hierarchy", "vehicle_count", "configured_service_goal", "daypart", "measurement_period"],
      ),
      decision(
        "Compare the process of a better-performing restaurant with the selected restaurant.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-07", "TECH-QSR-02"],
    proofAssetIds: ["proof-qsr-estate-performance"],
    nextCta: "Configure the drive-thru performance view",
    presenterNotes: [
      "A faster restaurant is a question to investigate, not a proven better operating model.",
    ],
    sourceRefs: source("§9 Scene 10 — Multi-store comparison", "§5 Capability G"),
  },
  {
    id: "qsr-improvement-proof",
    segment: "qsr",
    title: "Improvement proof",
    eyebrow: "Prove · Change",
    journeyStage: "prove",
    priority: "optional",
    corePathOrder: null,
    branchFromSceneIds: ["qsr-estate"],
    commercialQuestion: "Did the operational change actually improve the drive-thru?",
    supportingLine:
      "Compare a before period, a recorded change and an after period on identical definitions",
    visualAssetId: "VIS-QSR-IMPROVEMENT-PROOF",
    dataRequirements: {
      required: ["physical", "business", "insight"],
      optional: [],
    },
    derivedDependencies: [
      dependency(
        "qsr-improvement-proof",
        "Before/after improvement comparison",
        [
          "lane_entry_timestamp",
          "pickup_timestamp",
          "vehicle_count",
          "operational_change_marker",
          "measurement_period",
          "configured_service_goal",
        ],
      ),
      dependency(
        "qsr-revenue-context",
        "Revenue, average order value and profitability — unavailable unless compatible business data is connected",
        ["pos_order_value", "pos_transaction_reference", "measurement_period"],
      ),
    ],
    evidence: [
      measured(
        "Comparable measured timing and vehicle counts are required in both the before and the after period.",
        ["lane_entry_timestamp", "pickup_timestamp", "vehicle_count"],
      ),
      connected(
        "The operational change marker, the compared periods and any revenue or order value must come from connected business data.",
        ["operational_change_marker", "measurement_period", "pos_order_value", "pos_transaction_reference"],
      ),
      derived(
        "Improvement proof requires a before period, a recorded operational change marker, an after period and compatible measurement definitions.",
        ["lane_entry_timestamp", "pickup_timestamp", "operational_change_marker", "measurement_period"],
      ),
      derived(
        "Revenue, average order value, order accuracy, labour cost and profitability are never derived from timer data.",
        ["pos_order_value", "pos_transaction_reference"],
      ),
      decision(
        "Decide whether the observed change is worth keeping, extending or testing again.",
      ),
    ],
    technologyCapabilityIds: ["TECH-QSR-07", "TECH-QSR-05"],
    proofAssetIds: ["proof-qsr-improvement"],
    nextCta: "Return to estate performance",
    nextSceneId: "qsr-estate",
    presenterNotes: [
      "An improved measured time is an observed outcome of an operational change, never a guaranteed result of the technology.",
    ],
    sourceRefs: source("§9 Scene 11 — Improvement proof", "§16 Business metrics — require external or integrated data"),
  },
] satisfies readonly SceneDefinition[];

export const qsrSegment: SegmentDefinition = {
  id: "qsr",
  name: "QSR",
  experienceName: "Drive-Thru Performance",
  implementationStatus: "architecture_only",
  commercialNarrative:
    "A physical drive-thru becomes a measured vehicle journey, then stage-level time, a bottleneck, a crew response, multi-site performance, the capability required and only then a possible implementation.",
  scenes: qsrScenes,
  coreRoute: [
    "qsr-drive-thru-context",
    "qsr-queue",
    "qsr-order",
    "qsr-bottleneck",
    "qsr-respond",
    "qsr-estate",
  ],
  optionalBranches: [
    "qsr-arrival",
    "qsr-payment",
    "qsr-handoff",
    "qsr-beyond-lane",
    "qsr-daypart",
    "qsr-improvement-proof",
  ],
  advancedBranches: [],
  stageMapping: {
    context: ["qsr-drive-thru-context"],
    measure: [
      "qsr-arrival",
      "qsr-queue",
      "qsr-order",
      "qsr-payment",
      "qsr-handoff",
      "qsr-beyond-lane",
    ],
    understand: ["qsr-bottleneck", "qsr-respond", "qsr-daypart"],
    prove: ["qsr-estate", "qsr-improvement-proof"],
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
        `${qsrSpec}: §10 Scene 12 — "How we enable this" technology layer`,
        `${qsrSpec}: §24 Suggested "How we measure this" component`,
        `${qsrSpec}: §30 Technical-readiness layer`,
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
        `${qsrSpec}: §11 Scene 13 — Operational playbook`,
      ],
    },
  },
  experienceLenses: qsrExperienceLenses,
  sourceRefs: [
    `${qsrSpec}: §3 Canonical journey navigation`,
    `${qsrSpec}: §22 Suggested content model for implementation agents`,
    `${qsrSpec}: §32 Recommended first prototype scope`,
  ],
};

/**
 * QSR Configure synthesis reference paths.
 *
 * These express the Configure question chain from the QSR specification
 * (business/operational need → capability → possible implementation →
 * dependencies) using existing capability and implementation IDs. They are
 * reference paths for the synthesis stage, not a hardware catalogue and not a
 * selection: no tier, product or vendor is chosen for the customer.
 */
export interface QsrConfigurePath {
  id: string;
  need: string;
  capabilityIds: readonly TechnologyCapabilityId[];
  dependencies: readonly string[];
  sourceRefs: readonly string[];
}

export const qsrConfigurePaths: readonly QsrConfigurePath[] = [
  {
    id: "qsr-configure-stage-timing",
    need: "See stage-level timing across the drive-thru journey",
    capabilityIds: ["TECH-QSR-01", "TECH-QSR-02"],
    dependencies: [
      "Site and lane survey",
      "Detection-point design",
      "Configuration of time goals",
      "Power and connectivity as required",
      "Optional cloud or integration services",
    ],
    sourceRefs: source("§24 Suggested \"How we measure this\" component", "§10 Scene 12"),
  },
  {
    id: "qsr-configure-alert-reaches-employee",
    need: "A timer alert reaches the employee who can act",
    capabilityIds: ["TECH-QSR-02", "TECH-QSR-06", "TECH-QSR-03"],
    dependencies: [
      "Configured alert thresholds",
      "Compatible communication configuration",
      "Agreed alert recipients or groups",
    ],
    sourceRefs: source("§10 Scene 12", "§5 Capability F"),
  },
  {
    id: "qsr-configure-order-context",
    need: "Associate wait time with order context",
    capabilityIds: ["TECH-QSR-05"],
    dependencies: [
      "Brand and POS platform compatibility validation",
      "Agreed order-context fields",
    ],
    sourceRefs: source("§5 Capability E", "§21 Availability and confidence states"),
  },
  {
    id: "qsr-configure-enterprise-visibility",
    need: "Compare restaurants, districts and dayparts",
    capabilityIds: ["TECH-QSR-07"],
    dependencies: [
      "Consistent metric and daypart definitions across sites",
      "Restaurant hierarchy",
      "Reporting environment and access model",
    ],
    sourceRefs: source("§9 Scene 10", "§5 Capability G"),
  },
  {
    id: "qsr-configure-voice-automation",
    need: "Prepare for automated order taking with crew takeover",
    capabilityIds: ["TECH-QSR-09"],
    dependencies: [
      "Advanced communication tier supporting third-party integration",
      "Separate compatible third-party voice AI provider selected by the customer",
      "Availability and compatibility validation",
    ],
    sourceRefs: source("§5 Capability I", "§21 Availability and confidence states"),
  },
];

/**
 * QSR Act hypotheses.
 *
 * Human-owned questions to validate, never automated recommendations and never
 * asserted causes. [Source: QSR spec §11]
 */
export const qsrActHypotheses: readonly string[] = [
  "Review lunch staffing against the observed vehicle arrival pattern.",
  "Investigate whether pickup, rather than order taking, is the current constraint.",
  "Validate whether pull-forward reduces lane time while keeping guest wait acceptable.",
  "Compare the best-performing restaurant's process with the selected restaurant.",
  "Review communication clarity where repeated-order friction is observed.",
];
