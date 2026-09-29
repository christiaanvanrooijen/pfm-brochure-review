import type {
  DataRole,
  EvidenceInputDefinition,
  EvidenceInputId,
} from "./types.ts";

const matrix = "PFM_Segment_Insight_Matrix_v1_1.xlsx";
const qsrSpec = "docs/reference/PFM_QSR_Commercial_Experience_Agent_Spec.md";

const input = (
  id: EvidenceInputId,
  label: string,
  dataRole: DataRole,
  evidenceType: "measured" | "connected",
): EvidenceInputDefinition => ({
  id,
  label,
  dataRole,
  evidenceType,
  sourceRefs: [`${matrix}: Definitions & guardrails!A5:B15`],
});

const qsrInput = (
  id: EvidenceInputId,
  label: string,
  dataRole: DataRole,
  evidenceType: "measured" | "connected",
): EvidenceInputDefinition => ({
  id,
  label,
  dataRole,
  evidenceType,
  sourceRefs: [`${qsrSpec}: §16 KPI and data vocabulary`],
});

export const evidenceInputs: readonly EvidenceInputDefinition[] = [
  input("aligned_passer_by_audience", "Aligned passer-by audience", "physical", "measured"),
  input("entrance_events", "Entrance IN/OUT events", "physical", "measured"),
  input("store_visits", "Compatible store visits", "physical", "measured"),
  input("classification_compatible_events", "Classification-compatible visit events", "physical", "measured"),
  input("enabled_classification", "Enabled, configured and permitted classification", "physical", "measured"),
  input("matched_visit_events", "Supported anonymous matched visit events", "physical", "measured"),
  input("spatial_trajectories", "Anonymous spatial trajectories and transitions", "physical", "measured"),
  input("spatial_definitions", "Floorplan and spatial definitions", "business", "connected"),
  input("zone_events", "Zone presence, entry and time events", "physical", "measured"),
  input("zone_mapping", "Zone, anchor or boundary mapping", "business", "connected"),
  input("category_mapping", "Product or category mapping", "business", "connected"),
  input("staff_events", "Configured staff and visitor events", "physical", "measured"),
  input("staff_context", "Staff roster, role or zone context", "business", "connected"),
  input("transactions", "Compatible transaction count", "business", "connected"),
  input("sales_value", "Aligned sales or turnover value", "business", "connected"),
  input("comparable_metrics", "Comparable measured metrics", "physical", "measured"),
  input("portfolio_context", "Store type, area, region and period context", "business", "connected"),
  input("aggregate_mobility", "Approved aggregate mobility or origin context", "mobile_geo", "connected"),
  input("asset_baseline_visits", "On-site visit baseline", "physical", "measured"),
  input("vehicle_events", "Vehicle entry and exit events", "physical", "measured"),
  input("coach_events", "Explicitly measured coach events", "physical", "measured"),
  input("parking_events", "Parking entry/exit or bay-state events", "physical", "measured"),
  input("parking_capacity", "Parking capacity, zone and operating definitions", "business", "connected"),
  input("unit_events", "Covered unit entrance or spatial events", "physical", "measured"),
  input("unit_mapping", "Tenant, unit and category mapping", "business", "connected"),
  input("brand_events", "Covered brand entrance or spatial events", "physical", "measured"),
  input("brand_mapping", "Tenant, brand and boundary mapping", "business", "connected"),
  input("matched_brand_events", "Supported matched brand visits or transitions", "physical", "measured"),
  input("tenant_mapping", "Tenant directory and boundaries", "business", "connected"),
  input("trip_duration_events", "Supported vehicle or visitor duration events", "physical", "measured"),
  input("licence_plate_events", "Lawfully configured licence-plate or country-code events", "physical", "measured"),
  input("lawful_origin_source", "Lawful additional origin source", "mobile_geo", "connected"),
  input("tourism_origin_context", "Approved tourism or origin context", "mobile_geo", "connected"),
  input("operational_context", "Opening hours, events, campaigns or operational context", "business", "connected"),

  // QSR / Drive-Thru evidence inputs.
  //
  // These reuse the existing four global data roles; QSR presentation lenses
  // (Vehicle flow / Communication / Business & order / Insight / Automation)
  // are defined separately on the segment and never rename these roles.
  //
  // Timing, communication and alert events are treated as directly measured
  // signals of the configured drive-thru system ("physical"). POS, goals,
  // hierarchy, daypart definitions and change markers are customer- or
  // configuration-supplied ("business"/connected) and must never be inferred
  // from timer data.
  // [Source: PFM_QSR_Commercial_Experience_Agent_Spec.md §16, §21, §24]
  qsrInput("vehicle_detection", "Vehicle detection event at a configured point", "physical", "measured"),
  qsrInput("lane_entry_timestamp", "Lane-entry detection timestamp", "physical", "measured"),
  qsrInput("order_point_timestamp", "Order-point detection timestamp", "physical", "measured"),
  qsrInput("payment_timestamp", "Payment-window detection timestamp", "physical", "measured"),
  qsrInput("pickup_timestamp", "Pickup/present-window detection timestamp", "physical", "measured"),
  qsrInput("pull_forward_timestamp", "Configured pull-forward space detection timestamp", "physical", "measured"),
  qsrInput("mobile_pickup_timestamp", "Configured mobile-pickup space detection timestamp", "physical", "measured"),
  qsrInput("vehicle_count", "Detected vehicle / car count", "physical", "measured"),
  qsrInput("communication_event", "Drive-thru or crew communication event", "physical", "measured"),
  qsrInput("timer_alert_event", "Configured timer threshold alert event", "physical", "measured"),
  qsrInput("drive_off_capable_detection", "Detection or vision implementation able to determine a drive-off", "physical", "measured"),
  qsrInput("measurement_period", "Defined measurement period", "business", "connected"),
  qsrInput("configured_service_goal", "Configured service-time target or goal", "business", "connected"),
  qsrInput("restaurant_id", "Restaurant identifier", "business", "connected"),
  qsrInput("restaurant_hierarchy", "Restaurant, district or region hierarchy", "business", "connected"),
  qsrInput("daypart", "Consistent daypart definition", "business", "connected"),
  qsrInput("pos_transaction_reference", "Compatible POS transaction reference", "business", "connected"),
  qsrInput("pos_order_value", "Compatible POS order value", "business", "connected"),
  qsrInput("pos_order_state", "Compatible POS order state", "business", "connected"),
  qsrInput("operational_change_marker", "Recorded operational change marker", "business", "connected"),
];
