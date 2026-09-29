/**
 * Demo Evidence Runtime
 *
 * Generic, deterministic runtime that answers "what evidence is available for
 * this scene?" without hard-coding KPI values or source semantics inside UI
 * components.
 *
 * Design principles:
 * - Pure, deterministic functions only — no randomness, no network, no state.
 * - Segment-safe and scene-safe: evidence never leaks across segments.
 * - Reuses the existing evidence-input/dependency model (`evidence-inputs.ts`,
 *   `SceneDefinition.derivedDependencies`) instead of duplicating truth rules.
 * - Reuses the existing approved Northstar demo values already present in
 *   `app/lib/fixtures.ts` (`retailStory`). No new KPI values are invented here.
 * - Derived evidence is computed from named source evidence, never hard-coded,
 *   so the dependency chain stays truthful and inspectable.
 * - A scene with no approved demo values resolves to "missing demo evidence",
 *   never to an invented plausible number.
 * - Lens-aware: callers may pass the set of currently active data roles
 *   (Physical / Mobile & geo / Business / Insight) and evidence availability
 *   recomputes accordingly. Omitting the lens set assumes all lenses active.
 * - No UI coupling — this is a data/query layer only.
 */

import type {
  DataRole,
  EvidenceAvailability,
  EvidenceDefinition,
  EvidenceId,
  EvidenceInputId,
  EvidenceMetadata,
  EvidenceType,
  SceneEvidenceRuntime,
  SceneId,
  SegmentId,
} from "./types.ts";

import { dataRoles } from "./types.ts";
import { getSceneForSegment } from "./runtime.ts";
import { qsrDriveThruStory, retailStory } from "../lib/fixtures.ts";

const fixtureSource = "app/lib/fixtures.ts: retailStory";
const retailPackage = "RETAIL-GO-DEMO-PACKAGE.md: §4 Screen 3-5, §6 Data and truth semantics";
const storyArchitecture = "SEGMENT-STORY-ARCHITECTURE.md: Core-scene data-role validation — Retail Core";

/** All four data roles, used as the default "no lens restriction" state. */
const allDataRoles: readonly DataRole[] = dataRoles;

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// The afternoon period is the canonical Northstar illustrative period already
// used as the default application state (see app/lib/session.ts
// `measuredVisits: 681`). Reusing it here keeps the evidence runtime aligned
// with the values already approved for the demo instead of introducing a
// second illustrative period.
const canonicalPeriod = retailStory.periods.find((period) => period.id === "afternoon");
if (!canonicalPeriod) {
  throw new Error("Expected an 'afternoon' period in retailStory.periods (app/lib/fixtures.ts)");
}

// Capture rate is not precomputed in the fixtures; it is calculated here from
// the two approved, aligned inputs using the documented formula
// `capture = measured visits ÷ aligned passing audience`
// (RETAIL-GO-DEMO-PACKAGE.md §4 Screen 4 — Measure). This is a derivation
// from approved values, not an invented KPI.
const captureRateValue = roundTo(
  (canonicalPeriod.visits.value / canonicalPeriod.passingAudience.value) * 100,
  1,
);

// Conversion is already precomputed and approved in the fixture
// (`conversionDisplay`); reuse it directly rather than recomputing a second
// illustrative figure.
const conversionRateValue = Number.parseFloat(canonicalPeriod.conversionDisplay);

// Sales per visitor is calculated from two approved connected/measured
// values using the standard `sales value ÷ visits` definition described in
// SEGMENT-STORY-ARCHITECTURE.md's Retail "Conversion and sales context" row.
const salesPerVisitorValue = roundTo(
  canonicalPeriod.transactionValue.value / canonicalPeriod.visits.value,
  2,
);

// Average transaction value is the fourth term of the Retail commercial
// equation (passers-by × capture rate × conversion rate × average transaction
// value = turnover). It is calculated here from two approved connected values
// using the standard `aligned sales value ÷ compatible transactions`
// definition, exactly as conversion and sales per visitor are calculated from
// their own named inputs — it is never typed into a component. Because both of
// its inputs are Business/connected, it correctly disappears with the Business
// layer through the shared `getEvidenceAvailability` dependency resolution.
const averageTransactionValue = roundTo(
  canonicalPeriod.transactionValue.value / canonicalPeriod.transactions.value,
  2,
);

/**
 * The Retail demo evidence catalog.
 *
 * Only scenes with an approved Northstar illustrative value in
 * `app/lib/fixtures.ts` receive entries here: Street opportunity, Store
 * visits and Conversion & sales context. Every other Retail scene, and every
 * Shopping Centre / Retail Park / Outlet Centre scene, intentionally has no
 * entries — `getSceneEvidenceRuntime` reports those as missing demo evidence
 * rather than inventing values.
 */
const retailEvidenceCatalog: readonly EvidenceDefinition[] = [
  {
    id: "ev-retail-passing-audience",
    label: canonicalPeriod.passingAudience.label,
    value: canonicalPeriod.passingAudience.value,
    displayValue: canonicalPeriod.passingAudience.displayValue,
    unit: canonicalPeriod.passingAudience.unit,
    // Passer-by measurement is a PHYSICAL measurement of the outdoor
    // opportunity area (TECH-01 "Outdoor opportunity measurement"; the current
    // implementation direction is a passive-infrared outdoor sensor). It is not
    // mobile/geo context and must never be classified as such: capture rate is
    // physically measured passer-by count vs physically measured store visits.
    // Mobile & geo remains a separate, optional contextual layer that never
    // substitutes for or modifies this measurement.
    // [Source: AGENTS.md "Treat mobile/geo data as context, not as a
    // replacement for physical sensor measurement"; evidence-inputs.ts
    // `aligned_passer_by_audience` = physical/measured]
    evidenceType: "measured",
    dataRole: "physical",
    sourceLayer: "physical",
    segment: "retail",
    relatedSceneIds: [
      "retail-street-opportunity",
      "retail-store-visits",
      "retail-conversion-sales-context",
    ],
    period: canonicalPeriod.label,
    areaDefinition: canonicalPeriod.passingAudience.scope,
    illustrative: true,
    dependencyIds: ["aligned_passer_by_audience"],
    available: true,
    displayEligible: true,
    sourceRefs: [fixtureSource, retailPackage],
    // Scene association only. The Retail commercial equation begins outside the
    // store (passers-by × capture rate = store visits), so Conversion & sales
    // context reads the same single passer-by measurement the Capture scenes
    // read. Its value, evidence type, data role, classification and
    // dependencies are unchanged.
  },
  {
    id: "ev-retail-store-visits",
    label: canonicalPeriod.visits.label,
    value: canonicalPeriod.visits.value,
    displayValue: canonicalPeriod.visits.displayValue,
    unit: canonicalPeriod.visits.unit,
    evidenceType: "measured",
    dataRole: "physical",
    sourceLayer: "physical",
    segment: "retail",
    relatedSceneIds: [
      "retail-street-opportunity",
      "retail-store-visits",
      "retail-conversion-sales-context",
    ],
    period: canonicalPeriod.label,
    areaDefinition: canonicalPeriod.visits.scope,
    illustrative: true,
    dependencyIds: ["store_visits"],
    available: true,
    displayEligible: true,
    sourceRefs: [fixtureSource, retailPackage],
  },
  {
    id: "ev-retail-capture-rate",
    label: "Capture rate",
    value: captureRateValue,
    displayValue: `${captureRateValue}%`,
    unit: "capture rate",
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    segment: "retail",
    // Scene association only — see the passer-by entry above. Capture rate's
    // computation (visits ÷ aligned passer-by audience), its derived type and
    // its Insight role are unchanged; it is simply also read by the scene that
    // draws the full commercial equation.
    relatedSceneIds: [
      "retail-street-opportunity",
      "retail-store-visits",
      "retail-conversion-sales-context",
    ],
    period: canonicalPeriod.label,
    areaDefinition: retailStory.areaDefinition,
    illustrative: true,
    dependencyIds: ["aligned_passer_by_audience", "store_visits"],
    available: true,
    displayEligible: true,
    sourceRefs: [fixtureSource, retailPackage, storyArchitecture],
  },
  {
    id: "ev-retail-transactions",
    label: canonicalPeriod.transactions.label,
    value: canonicalPeriod.transactions.value,
    displayValue: canonicalPeriod.transactions.displayValue,
    unit: canonicalPeriod.transactions.unit,
    evidenceType: "connected",
    dataRole: "business",
    sourceLayer: "business",
    segment: "retail",
    relatedSceneIds: ["retail-conversion-sales-context"],
    period: canonicalPeriod.label,
    areaDefinition: canonicalPeriod.transactions.scope,
    illustrative: true,
    dependencyIds: ["transactions"],
    available: true,
    displayEligible: true,
    sourceRefs: [fixtureSource, retailPackage],
  },
  {
    id: "ev-retail-transaction-value",
    label: canonicalPeriod.transactionValue.label,
    value: canonicalPeriod.transactionValue.value,
    displayValue: canonicalPeriod.transactionValue.displayValue,
    unit: canonicalPeriod.transactionValue.unit,
    evidenceType: "connected",
    dataRole: "business",
    sourceLayer: "business",
    segment: "retail",
    relatedSceneIds: ["retail-conversion-sales-context"],
    period: canonicalPeriod.label,
    areaDefinition: canonicalPeriod.transactionValue.scope,
    illustrative: true,
    dependencyIds: ["sales_value"],
    available: true,
    displayEligible: true,
    sourceRefs: [fixtureSource, retailPackage],
  },
  {
    id: "ev-retail-conversion-rate",
    label: "Conversion rate",
    value: conversionRateValue,
    displayValue: canonicalPeriod.conversionDisplay,
    unit: "conversion rate",
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    segment: "retail",
    relatedSceneIds: ["retail-conversion-sales-context"],
    period: canonicalPeriod.label,
    areaDefinition: retailStory.areaDefinition,
    illustrative: true,
    dependencyIds: ["store_visits", "transactions"],
    available: true,
    displayEligible: true,
    sourceRefs: [fixtureSource, retailPackage, storyArchitecture],
  },
  {
    id: "ev-retail-sales-per-visitor",
    label: "Sales per visitor",
    value: salesPerVisitorValue,
    displayValue: `€${salesPerVisitorValue.toFixed(2)}`,
    unit: "value per visitor",
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    segment: "retail",
    relatedSceneIds: ["retail-conversion-sales-context"],
    period: canonicalPeriod.label,
    areaDefinition: retailStory.areaDefinition,
    illustrative: true,
    dependencyIds: ["store_visits", "transactions", "sales_value"],
    available: true,
    displayEligible: true,
    sourceRefs: [fixtureSource, retailPackage, storyArchitecture],
  },
  {
    id: "ev-retail-average-transaction-value",
    label: "Average transaction value",
    value: averageTransactionValue,
    displayValue: `€${averageTransactionValue.toFixed(2)}`,
    unit: "value per transaction",
    // Derived from two connected business values. Distinct from sales per
    // visitor: this is what one transaction is worth, not what one visitor is
    // worth. Both are kept, and neither replaces the other.
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    segment: "retail",
    relatedSceneIds: ["retail-conversion-sales-context"],
    period: canonicalPeriod.label,
    areaDefinition: retailStory.areaDefinition,
    illustrative: true,
    dependencyIds: ["sales_value", "transactions"],
    available: true,
    displayEligible: true,
    sourceRefs: [fixtureSource, retailPackage, storyArchitecture],
  },
] as const;

// ---------------------------------------------------------------------------
// QSR / Drive-Thru demo evidence catalog.
//
// Every entry below reuses an explicitly illustrative value from
// `app/lib/fixtures.ts` (`qsrDriveThruStory`), which itself carries the QSR
// specification's fictional interface examples (§17). No QSR value is invented
// here and none of these are HME benchmarks, QSR industry benchmarks, customer
// results or PFM performance claims.
//
// Only five QSR scenes receive demo evidence: Context, Queue, Order, Bottleneck
// and Estate. Every other QSR scene — including Respond and all six Optional
// scenes — intentionally has no entries, so `getSceneEvidenceRuntime` reports
// missing demo evidence rather than inventing plausible numbers.
//
// Revenue, average order value, order accuracy, labour cost and profitability
// are deliberately absent: they require connected business data that this demo
// fixture does not contain, so the corresponding derived dependency resolves as
// unavailable. Drive-off is absent for the same reason.
// ---------------------------------------------------------------------------

const qsrFixtureSource = "app/lib/fixtures.ts: qsrDriveThruStory";
const qsrSpecSource =
  "docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md: §17 Example narrative data for prototype mode";

const qsrDaypart = qsrDriveThruStory.daypart;
const qsrJourney = qsrDriveThruStory.vehicleJourney;

const qsrJourneyStage = (id: string) => {
  const stage = qsrJourney.stages.find((item) => item.id === id);
  if (!stage) {
    throw new Error(`Expected QSR journey stage '${id}' in qsrDriveThruStory (app/lib/fixtures.ts)`);
  }
  return stage;
};

const qsrArrivalToOrder = qsrJourneyStage("qsr-journey-arrival-to-order");
const qsrOrderDwell = qsrJourneyStage("qsr-journey-order-dwell");
const qsrOrderToPayment = qsrJourneyStage("qsr-journey-order-to-payment");
const qsrPaymentToPickup = qsrJourneyStage("qsr-journey-payment-to-pickup");

// Goal variance is derived from two approved illustrative values
// (average lane total minus the configured goal), never hard-coded.
const qsrGoalVarianceSeconds =
  qsrDaypart.averageLaneTotal.value - qsrDaypart.serviceGoal.value;

const qsrEvidence = (
  entry: Omit<EvidenceDefinition, "segment" | "illustrative" | "available" | "displayEligible" | "sourceRefs"> &
    Partial<Pick<EvidenceDefinition, "sourceRefs">>,
): EvidenceDefinition => ({
  ...entry,
  segment: "qsr",
  illustrative: true,
  available: true,
  displayEligible: true,
  sourceRefs: entry.sourceRefs ?? [qsrFixtureSource, qsrSpecSource],
});

const qsrEvidenceCatalog: readonly EvidenceDefinition[] = [
  // Base measured evidence — one entry per measured evidence input.
  qsrEvidence({
    id: "ev-qsr-vehicle-count",
    label: qsrDaypart.vehicles.label,
    value: qsrDaypart.vehicles.value,
    displayValue: qsrDaypart.vehicles.displayValue,
    unit: qsrDaypart.vehicles.unit,
    evidenceType: "measured",
    dataRole: "physical",
    sourceLayer: "physical",
    relatedSceneIds: ["qsr-drive-thru-context", "qsr-queue", "qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDaypart.vehicles.scope,
    dependencyIds: ["vehicle_count"],
  }),
  qsrEvidence({
    id: "ev-qsr-lane-entry-detections",
    label: "Lane-entry detections",
    value: qsrDaypart.vehicles.value,
    displayValue: `${qsrDaypart.vehicles.displayValue} lane-entry detections`,
    unit: "detections",
    evidenceType: "measured",
    dataRole: "physical",
    sourceLayer: "physical",
    relatedSceneIds: ["qsr-drive-thru-context", "qsr-queue"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.areaDefinition,
    dependencyIds: ["lane_entry_timestamp"],
  }),
  qsrEvidence({
    id: "ev-qsr-order-point-dwell",
    label: qsrOrderDwell.label,
    value: qsrOrderDwell.value,
    displayValue: qsrOrderDwell.displayValue,
    unit: qsrOrderDwell.unit,
    evidenceType: "measured",
    dataRole: "physical",
    sourceLayer: "physical",
    relatedSceneIds: ["qsr-order"],
    period: qsrJourney.label,
    areaDefinition: qsrOrderDwell.scope,
    dependencyIds: ["order_point_timestamp"],
  }),
  qsrEvidence({
    id: "ev-qsr-payment-detections",
    label: "Payment-window detections",
    value: qsrDaypart.vehicles.value,
    displayValue: `${qsrDaypart.vehicles.displayValue} payment-window detections`,
    unit: "detections",
    evidenceType: "measured",
    dataRole: "physical",
    sourceLayer: "physical",
    relatedSceneIds: ["qsr-bottleneck"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.areaDefinition,
    dependencyIds: ["payment_timestamp"],
  }),
  qsrEvidence({
    id: "ev-qsr-pickup-detections",
    label: "Pickup-window detections",
    value: qsrDaypart.vehicles.value,
    displayValue: `${qsrDaypart.vehicles.displayValue} pickup-window detections`,
    unit: "detections",
    evidenceType: "measured",
    dataRole: "physical",
    sourceLayer: "physical",
    relatedSceneIds: ["qsr-drive-thru-context", "qsr-bottleneck"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.areaDefinition,
    dependencyIds: ["pickup_timestamp"],
  }),

  // Base connected evidence — configured or operator-supplied context.
  qsrEvidence({
    id: "ev-qsr-service-goal",
    label: qsrDaypart.serviceGoal.label,
    value: qsrDaypart.serviceGoal.value,
    displayValue: qsrDaypart.serviceGoal.displayValue,
    unit: qsrDaypart.serviceGoal.unit,
    evidenceType: "connected",
    dataRole: "business",
    sourceLayer: "business",
    relatedSceneIds: ["qsr-drive-thru-context", "qsr-bottleneck", "qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDaypart.serviceGoal.scope,
    dependencyIds: ["configured_service_goal"],
  }),
  qsrEvidence({
    id: "ev-qsr-measurement-period",
    label: "Measurement period",
    value: qsrDaypart.label,
    displayValue: qsrDaypart.label,
    unit: "period definition",
    evidenceType: "connected",
    dataRole: "business",
    sourceLayer: "business",
    relatedSceneIds: ["qsr-drive-thru-context", "qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.periodDefinition,
    dependencyIds: ["measurement_period"],
  }),
  qsrEvidence({
    id: "ev-qsr-daypart",
    label: "Daypart definition",
    value: "Lunch",
    displayValue: "Lunch",
    unit: "daypart definition",
    evidenceType: "connected",
    dataRole: "business",
    sourceLayer: "business",
    relatedSceneIds: ["qsr-drive-thru-context", "qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.periodDefinition,
    dependencyIds: ["daypart"],
  }),
  qsrEvidence({
    id: "ev-qsr-restaurant-id",
    label: "Selected restaurant",
    value: qsrDriveThruStory.locationLabel,
    displayValue: qsrDriveThruStory.locationLabel,
    unit: "restaurant",
    evidenceType: "connected",
    dataRole: "business",
    sourceLayer: "business",
    relatedSceneIds: ["qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.areaDefinition,
    dependencyIds: ["restaurant_id"],
  }),
  qsrEvidence({
    id: "ev-qsr-restaurant-hierarchy",
    label: "Restaurant hierarchy",
    value: qsrDriveThruStory.estate.length,
    displayValue: `${qsrDriveThruStory.estate.length} restaurants`,
    unit: "restaurants",
    evidenceType: "connected",
    dataRole: "business",
    sourceLayer: "business",
    relatedSceneIds: ["qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.estateDefinition,
    dependencyIds: ["restaurant_hierarchy"],
  }),

  // Derived evidence — calculated from the named base evidence above.
  qsrEvidence({
    id: "ev-qsr-throughput",
    label: "Throughput",
    value: qsrDaypart.vehicles.value,
    displayValue: `${qsrDaypart.vehicles.displayValue} vehicles · ${qsrDaypart.label}`,
    unit: "vehicles per defined period",
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-drive-thru-context"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.areaDefinition,
    dependencyIds: ["vehicle_count", "measurement_period"],
  }),
  qsrEvidence({
    id: "ev-qsr-average-lane-total",
    label: qsrDaypart.averageLaneTotal.label,
    value: qsrDaypart.averageLaneTotal.value,
    displayValue: qsrDaypart.averageLaneTotal.displayValue,
    unit: qsrDaypart.averageLaneTotal.unit,
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-drive-thru-context", "qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDaypart.averageLaneTotal.scope,
    dependencyIds: ["lane_entry_timestamp", "pickup_timestamp", "vehicle_count"],
  }),
  qsrEvidence({
    id: "ev-qsr-goal-attainment",
    label: qsrDaypart.withinGoal.label,
    value: qsrDaypart.withinGoal.value,
    displayValue: qsrDaypart.withinGoal.displayValue,
    unit: qsrDaypart.withinGoal.unit,
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-drive-thru-context", "qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDaypart.withinGoal.scope,
    dependencyIds: ["lane_entry_timestamp", "pickup_timestamp", "configured_service_goal"],
  }),
  qsrEvidence({
    id: "ev-qsr-queue-time",
    label: "Queue time before the order point",
    value: qsrArrivalToOrder.value,
    displayValue: qsrArrivalToOrder.displayValue,
    unit: qsrArrivalToOrder.unit,
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-queue"],
    period: qsrJourney.label,
    areaDefinition: qsrArrivalToOrder.scope,
    dependencyIds: ["lane_entry_timestamp", "order_point_timestamp"],
  }),
  qsrEvidence({
    id: "ev-qsr-peak-queue",
    label: qsrDaypart.peakQueue.label,
    value: qsrDaypart.peakQueue.value,
    displayValue: qsrDaypart.peakQueue.displayValue,
    unit: qsrDaypart.peakQueue.unit,
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-queue"],
    period: qsrDaypart.label,
    areaDefinition: qsrDaypart.peakQueue.scope,
    dependencyIds: ["lane_entry_timestamp", "order_point_timestamp", "vehicle_count"],
  }),
  qsrEvidence({
    id: "ev-qsr-order-to-payment",
    label: qsrOrderToPayment.label,
    value: qsrOrderToPayment.value,
    displayValue: qsrOrderToPayment.displayValue,
    unit: qsrOrderToPayment.unit,
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-order"],
    period: qsrJourney.label,
    areaDefinition: qsrOrderToPayment.scope,
    dependencyIds: ["order_point_timestamp", "payment_timestamp"],
  }),
  qsrEvidence({
    id: "ev-qsr-payment-to-pickup",
    label: qsrPaymentToPickup.label,
    value: qsrPaymentToPickup.value,
    displayValue: qsrPaymentToPickup.displayValue,
    unit: qsrPaymentToPickup.unit,
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-bottleneck"],
    period: qsrJourney.label,
    areaDefinition: qsrPaymentToPickup.scope,
    dependencyIds: ["payment_timestamp", "pickup_timestamp"],
  }),
  qsrEvidence({
    id: "ev-qsr-goal-variance",
    label: "Variance against the configured goal",
    value: qsrGoalVarianceSeconds,
    displayValue: `+00:${String(qsrGoalVarianceSeconds).padStart(2, "0")}`,
    unit: "mm:ss above the configured goal",
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-bottleneck"],
    period: qsrDaypart.label,
    areaDefinition: qsrDaypart.averageLaneTotal.scope,
    dependencyIds: ["lane_entry_timestamp", "pickup_timestamp", "configured_service_goal"],
  }),
  qsrEvidence({
    id: "ev-qsr-bottleneck-stage",
    label: "Current bottleneck stage",
    value: qsrDaypart.bottleneckStage,
    displayValue: qsrDaypart.bottleneckStage,
    unit: "journey stage",
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-bottleneck"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.areaDefinition,
    dependencyIds: ["payment_timestamp", "pickup_timestamp", "configured_service_goal"],
  }),
  qsrEvidence({
    id: "ev-qsr-estate-comparison",
    label: "Estate comparison",
    value: qsrDriveThruStory.estate.length,
    displayValue: qsrDriveThruStory.estate
      .map((restaurant) => `${restaurant.label} ${restaurant.averageLaneTotalDisplay}`)
      .join(" · "),
    unit: "restaurants on comparable definitions",
    evidenceType: "derived",
    dataRole: "insight",
    sourceLayer: "insight",
    relatedSceneIds: ["qsr-estate"],
    period: qsrDaypart.label,
    areaDefinition: qsrDriveThruStory.estateDefinition,
    dependencyIds: [
      "restaurant_id",
      "restaurant_hierarchy",
      "vehicle_count",
      "lane_entry_timestamp",
      "pickup_timestamp",
      "configured_service_goal",
      "daypart",
      "measurement_period",
    ],
  }),
];

/**
 * The full demo evidence catalog.
 *
 * Retail (approved Northstar values) and QSR (illustrative QSR specification
 * interface examples). Shopping Centre, Retail Park and Outlet Centre remain
 * empty by design.
 */
export const evidenceCatalog: readonly EvidenceDefinition[] = [
  ...retailEvidenceCatalog,
  ...qsrEvidenceCatalog,
];

/**
 * Numerator/denominator metadata for derived evidence that needs it for
 * truthful presentation (AGENTS.md "State the relevant area, period and
 * definition when displaying a calculated KPI"). Base measured/connected
 * evidence does not need this, so it is intentionally omitted for those ids.
 */
const derivedMetadataExtras: Readonly<
  Record<
    EvidenceId,
    Pick<EvidenceMetadata, "numeratorDefinition" | "denominatorDefinition" | "compatibleSourceRequired">
  >
> = {
  "ev-retail-capture-rate": {
    numeratorDefinition: canonicalPeriod.visits.definition,
    denominatorDefinition: canonicalPeriod.passingAudience.definition,
    compatibleSourceRequired: true,
  },
  "ev-retail-conversion-rate": {
    numeratorDefinition: canonicalPeriod.transactions.definition,
    denominatorDefinition: canonicalPeriod.visits.definition,
    compatibleSourceRequired: true,
  },
  "ev-retail-sales-per-visitor": {
    numeratorDefinition: canonicalPeriod.transactionValue.definition,
    denominatorDefinition: canonicalPeriod.visits.definition,
    compatibleSourceRequired: true,
  },
  "ev-retail-average-transaction-value": {
    numeratorDefinition: canonicalPeriod.transactionValue.definition,
    denominatorDefinition: canonicalPeriod.transactions.definition,
    compatibleSourceRequired: true,
  },
  "ev-qsr-average-lane-total": {
    numeratorDefinition: "Summed measured time between the configured journey start and end detection points",
    denominatorDefinition: "Vehicles detected in the measured period",
    compatibleSourceRequired: true,
  },
  "ev-qsr-goal-attainment": {
    numeratorDefinition: "Measured journeys at or below the configured goal",
    denominatorDefinition: "Vehicles measured across the full configured journey in the same period",
    compatibleSourceRequired: true,
  },
  "ev-qsr-throughput": {
    numeratorDefinition: "Vehicles detected at the configured lane-entry point",
    denominatorDefinition: "Defined measurement period",
    compatibleSourceRequired: true,
  },
  "ev-qsr-queue-time": {
    numeratorDefinition: "Elapsed time between the configured queue start and the order point",
    denominatorDefinition: "Vehicles measured across both configured detection points",
    compatibleSourceRequired: true,
  },
  "ev-qsr-estate-comparison": {
    numeratorDefinition: "Per-restaurant measured lane total on identical definitions",
    denominatorDefinition: "Comparable period and daypart across every compared restaurant",
    compatibleSourceRequired: true,
  },
};

/** Base (non-derived) evidence entry that supplies a given evidence input id, if any. */
function getBaseEvidenceForInput(inputId: EvidenceInputId): EvidenceDefinition | undefined {
  return evidenceCatalog.find(
    (evidence) =>
      evidence.evidenceType !== "derived" &&
      evidence.dependencyIds.length === 1 &&
      evidence.dependencyIds[0] === inputId,
  );
}

/**
 * Get a single evidence definition by its stable id.
 * Returns undefined rather than inventing a value when the id is unknown.
 */
export function getEvidence(evidenceId: EvidenceId): EvidenceDefinition | undefined {
  return evidenceCatalog.find((evidence) => evidence.id === evidenceId);
}

/**
 * Get evidence metadata (period/area/definition) for a single evidence item.
 * Only derived KPIs receive numerator/denominator/compatible-source fields;
 * metadata is not forced onto evidence that does not need it.
 */
export function getEvidenceMetadata(evidenceId: EvidenceId): EvidenceMetadata | null {
  const evidence = getEvidence(evidenceId);
  if (!evidence) {
    return null;
  }
  return {
    period: evidence.period,
    areaDefinition: evidence.areaDefinition,
    ...derivedMetadataExtras[evidenceId],
  };
}

/**
 * Determine whether a single evidence item is available, given a set of
 * active data-role lenses (defaults to all four lenses active).
 *
 * - Unknown evidence id -> unavailable, reason "no_demo_values".
 * - The evidence's own data role must be an active lens.
 * - Derived evidence additionally requires every named dependency's backing
 *   evidence to exist and be available (reused from the existing
 *   evidence-input/dependency model — no separate truth rules are defined
 *   here).
 */
export function getEvidenceAvailability(
  evidenceId: EvidenceId,
  activeLenses: readonly DataRole[] = allDataRoles,
): EvidenceAvailability {
  const evidence = getEvidence(evidenceId);
  if (!evidence) {
    return { available: false, reason: "no_demo_values" };
  }

  if (!activeLenses.includes(evidence.dataRole)) {
    return { available: false, reason: "lens_disabled" };
  }

  if (evidence.evidenceType !== "derived") {
    return { available: true };
  }

  const missingDependencies: EvidenceInputId[] = [];
  let anyDependencyStructurallyMissing = false;

  for (const inputId of evidence.dependencyIds) {
    const base = getBaseEvidenceForInput(inputId);
    if (!base) {
      anyDependencyStructurallyMissing = true;
      missingDependencies.push(inputId);
      continue;
    }
    if (!activeLenses.includes(base.dataRole)) {
      missingDependencies.push(inputId);
    }
  }

  if (missingDependencies.length > 0) {
    return {
      available: false,
      reason: anyDependencyStructurallyMissing ? "missing_dependency" : "lens_disabled",
      missingDependencies,
    };
  }

  return { available: true };
}

/**
 * Get every catalog evidence item related to a scene (segment-safe and
 * scene-safe: throws for an unknown scene or a scene/segment mismatch, via
 * the existing `getSceneForSegment` guard, and never returns evidence from a
 * different segment).
 */
export function getEvidenceForScene(
  segmentId: SegmentId,
  sceneId: SceneId,
): readonly EvidenceDefinition[] {
  getSceneForSegment(segmentId, sceneId); // segment-safety guard; throws on mismatch
  return evidenceCatalog.filter(
    (evidence) => evidence.segment === segmentId && evidence.relatedSceneIds.includes(sceneId),
  );
}

/**
 * Get only the evidence for a scene that is currently available for
 * presentation, given the active lenses (defaults to all four lenses).
 */
export function getAvailableEvidenceForScene(
  segmentId: SegmentId,
  sceneId: SceneId,
  activeLenses: readonly DataRole[] = allDataRoles,
): readonly EvidenceDefinition[] {
  return getEvidenceForScene(segmentId, sceneId).filter(
    (evidence) =>
      evidence.displayEligible && getEvidenceAvailability(evidence.id, activeLenses).available,
  );
}

function getAvailableEvidenceForSceneByType(
  segmentId: SegmentId,
  sceneId: SceneId,
  evidenceType: EvidenceType,
  activeLenses: readonly DataRole[],
): readonly EvidenceDefinition[] {
  return getAvailableEvidenceForScene(segmentId, sceneId, activeLenses).filter(
    (evidence) => evidence.evidenceType === evidenceType,
  );
}

/** Get only the available Measured evidence for a scene. */
export function getMeasuredEvidenceForScene(
  segmentId: SegmentId,
  sceneId: SceneId,
  activeLenses: readonly DataRole[] = allDataRoles,
): readonly EvidenceDefinition[] {
  return getAvailableEvidenceForSceneByType(segmentId, sceneId, "measured", activeLenses);
}

/** Get only the available Connected evidence for a scene. */
export function getConnectedEvidenceForScene(
  segmentId: SegmentId,
  sceneId: SceneId,
  activeLenses: readonly DataRole[] = allDataRoles,
): readonly EvidenceDefinition[] {
  return getAvailableEvidenceForSceneByType(segmentId, sceneId, "connected", activeLenses);
}

/** Get only the available Derived evidence for a scene. */
export function getDerivedEvidenceForScene(
  segmentId: SegmentId,
  sceneId: SceneId,
  activeLenses: readonly DataRole[] = allDataRoles,
): readonly EvidenceDefinition[] {
  return getAvailableEvidenceForSceneByType(segmentId, sceneId, "derived", activeLenses);
}

/**
 * Build the compact future-UI presentation contract for a scene: available
 * evidence, unavailable evidence (with reasons), measured/connected/derived
 * splits, illustrative flag and period metadata. No cards, charts, layout or
 * ordering are prescribed here.
 */
export function getSceneEvidenceRuntime(
  segmentId: SegmentId,
  sceneId: SceneId,
  activeLenses: readonly DataRole[] = allDataRoles,
): SceneEvidenceRuntime {
  const scene = getSceneForSegment(segmentId, sceneId);
  const sceneEvidence = getEvidenceForScene(segmentId, sceneId);

  const evaluated = sceneEvidence.map((evidence) => ({
    evidence,
    availability: getEvidenceAvailability(evidence.id, activeLenses),
  }));

  const availableEvidence = evaluated
    .filter((entry) => entry.evidence.displayEligible && entry.availability.available)
    .map((entry) => entry.evidence);

  const unavailableFromCatalog = evaluated
    .filter((entry) => !(entry.evidence.displayEligible && entry.availability.available))
    .map((entry) => ({
      id: entry.evidence.id,
      reason: entry.availability.reason ?? ("no_demo_values" as const),
      missingDependencies: entry.availability.missingDependencies,
    }));

  // A scene with no catalog entries at all has no approved demo values.
  // Report every declared (non-decision) evidence slot as missing rather
  // than inventing a plausible number for it.
  const missingDemoEvidence =
    sceneEvidence.length === 0
      ? scene.evidence
          .filter((declared) => declared.type !== "decision")
          .map((declared, index) => ({
            id: `${sceneId}::${declared.type}::${index}`,
            reason: "no_demo_values" as const,
            missingDependencies: declared.inputIds,
          }))
      : [];

  const byType = (evidenceType: EvidenceType) =>
    availableEvidence.filter((evidence) => evidence.evidenceType === evidenceType);

  return {
    scene: { id: scene.id, segment: scene.segment, title: scene.title },
    evidence: sceneEvidence,
    availableEvidence,
    measuredEvidence: byType("measured"),
    connectedEvidence: byType("connected"),
    derivedEvidence: byType("derived"),
    illustrativeFlag: availableEvidence.length > 0 && availableEvidence.every((evidence) => evidence.illustrative),
    periodMetadata:
      availableEvidence.length > 0
        ? { period: availableEvidence[0].period, areaDefinition: availableEvidence[0].areaDefinition }
        : null,
    unavailableEvidence: [...unavailableFromCatalog, ...missingDemoEvidence],
  };
}

/**
 * Availability of one scene-declared derived dependency.
 *
 * This is the machine-readable answer to "can this calculation be shown?".
 * It reuses the existing `SceneDefinition.derivedDependencies` model and the
 * demo evidence catalog; it defines no new truth rules and invents no values.
 */
export interface DerivedDependencyAvailability {
  dependencyId: string;
  output: string;
  available: boolean;
  requiredInputIds: readonly EvidenceInputId[];
  satisfiedInputIds: readonly EvidenceInputId[];
  missingInputIds: readonly EvidenceInputId[];
  /** Set when an alternative input group satisfied the dependency instead. */
  satisfiedByAlternativeGroup?: readonly EvidenceInputId[];
}

function inputIsSatisfied(
  inputId: EvidenceInputId,
  activeLenses: readonly DataRole[],
): boolean {
  const base = getBaseEvidenceForInput(inputId);
  return base !== undefined && activeLenses.includes(base.dataRole);
}

/**
 * Resolve every derived dependency declared by a scene against the demo
 * evidence catalog (segment-safe). A dependency whose named inputs have no
 * backing evidence resolves as unavailable with the missing inputs named —
 * never as a plausible substitute value.
 *
 * This is how the model keeps concepts such as revenue, average order value,
 * profitability and drive-off unavailable until the required connected or
 * detection-capable source is actually present.
 */
export function getSceneDependencyAvailability(
  segmentId: SegmentId,
  sceneId: SceneId,
  activeLenses: readonly DataRole[] = allDataRoles,
): readonly DerivedDependencyAvailability[] {
  const scene = getSceneForSegment(segmentId, sceneId);

  return scene.derivedDependencies.map((dependency) => {
    const satisfiedInputIds = dependency.requiredInputIds.filter((inputId) =>
      inputIsSatisfied(inputId, activeLenses),
    );
    const missingInputIds = dependency.requiredInputIds.filter(
      (inputId) => !inputIsSatisfied(inputId, activeLenses),
    );

    const requiredSatisfied =
      dependency.requiredInputIds.length > 0 && missingInputIds.length === 0;

    const satisfiedGroup = (dependency.alternativeInputGroups ?? []).find((group) =>
      group.every((inputId) => inputIsSatisfied(inputId, activeLenses)),
    );

    return {
      dependencyId: dependency.id,
      output: dependency.output,
      available: requiredSatisfied || satisfiedGroup !== undefined,
      requiredInputIds: dependency.requiredInputIds,
      satisfiedInputIds,
      missingInputIds,
      ...(satisfiedGroup ? { satisfiedByAlternativeGroup: satisfiedGroup } : {}),
    };
  });
}

/**
 * Resolve a single scene-declared derived dependency by id. Returns null when
 * the scene does not declare it.
 */
export function getDerivedDependencyAvailability(
  segmentId: SegmentId,
  sceneId: SceneId,
  dependencyId: string,
  activeLenses: readonly DataRole[] = allDataRoles,
): DerivedDependencyAvailability | null {
  return (
    getSceneDependencyAvailability(segmentId, sceneId, activeLenses).find(
      (entry) => entry.dependencyId === dependencyId,
    ) ?? null
  );
}
