/**
 * Vehicle evidence semantics.
 *
 * ARCHITECTURE ONLY. Nothing here is rendered anywhere today. It exists because
 * the Retail Park, Shopping Centre and Outlet Centre stories will all need
 * vehicle evidence, and the single most expensive mistake available in those
 * stories is to let a vehicle number quietly become a people number.
 *
 * The invariant, stated once, in one place, so a future segment inherits it
 * rather than re-deriving it:
 *
 *   A vehicle is not a visitor.
 *
 * A vehicle count is a count of vehicles. A matched arrival and departure is a
 * vehicle visit. A duration between them is vehicle dwell. A plate's
 * registration country is where a vehicle is registered. None of the four
 * becomes people visits or property footfall without a separate, stated
 * methodology and a separate source — an occupancy assumption is a modelling
 * decision, not a measurement, and it belongs to whoever makes it explicitly.
 *
 * [Source: AGENTS.md Data layers and Truth rules;
 *          docs/reference/technology/SOURCE-REGISTRY.md: SRC-TATTILE-MK2-TECH-001;
 *          docs/reference/digital-sales-journey/privacy-governance-notes.md]
 */

import type { EvidenceInputId } from "./types.ts";

export const vehicleEvidenceUnits = [
  "vehicle_count",
  "vehicle_visit",
  "vehicle_dwell",
  "registration_origin",
] as const;
export type VehicleEvidenceUnit = (typeof vehicleEvidenceUnits)[number];

export interface VehicleEvidenceSemantic {
  unit: VehicleEvidenceUnit;
  label: string;
  /** How this unit comes to exist. */
  derivation: "direct_measurement" | "matched_events" | "derived_duration" | "classified_context";
  /** Evidence inputs a compatible implementation must supply for this unit. */
  requiredInputIds: readonly EvidenceInputId[];
  /** What this unit means, in one sentence. */
  meaning: string;
  /** What it explicitly does not mean. Load-bearing, not commentary. */
  isNot: readonly string[];
}

export const vehicleEvidenceSemantics: readonly VehicleEvidenceSemantic[] = [
  {
    unit: "vehicle_count",
    label: "Vehicle count",
    derivation: "direct_measurement",
    requiredInputIds: ["vehicle_events"],
    meaning: "How many vehicles were detected entering or leaving, in a defined period and area.",
    isNot: [
      "A number of people",
      "A number of visitors or visits",
      "Property footfall",
    ],
  },
  {
    unit: "vehicle_visit",
    label: "Vehicle visit",
    derivation: "matched_events",
    requiredInputIds: ["vehicle_events", "trip_duration_events"],
    meaning: "One arrival matched to one departure, where the measurement design supports matching.",
    isNot: [
      "A customer visit",
      "A shopping trip by a known number of people",
      "Available wherever vehicles are merely counted",
    ],
  },
  {
    unit: "vehicle_dwell",
    label: "Vehicle dwell",
    derivation: "derived_duration",
    requiredInputIds: ["vehicle_events", "trip_duration_events"],
    meaning: "The duration between a matched arrival and departure for one vehicle.",
    isNot: [
      "Time a person spent inside the property",
      "Dwell measured anywhere other than the vehicle's own location",
      "Derivable from a vehicle count alone",
    ],
  },
  {
    unit: "registration_origin",
    label: "Registration origin",
    derivation: "classified_context",
    requiredInputIds: ["licence_plate_events", "lawful_origin_source"],
    meaning:
      "The country or region in which a vehicle is registered, where this is lawful, configured and supported.",
    isNot: [
      "Where a person lives",
      "A visitor's home location or catchment home location",
      "A substitute for catchment analysis",
      "Anonymous — a licence plate identifies a vehicle",
    ],
  },
] as const;

export function getVehicleEvidenceSemantic(
  unit: VehicleEvidenceUnit,
): VehicleEvidenceSemantic | null {
  return vehicleEvidenceSemantics.find((semantic) => semantic.unit === unit) ?? null;
}

/**
 * Whether a vehicle evidence unit may be presented as people evidence.
 *
 * Always `false`, by construction and for every unit. It is a function rather
 * than a comment so that the rule is executable and a test can hold it, and so
 * that a future caller that wants people evidence from vehicle evidence has to
 * meet a hard `false` rather than an absence of guidance.
 */
export function resolvesAsPeopleEvidence(unit: VehicleEvidenceUnit): false {
  void unit;
  return false;
}

/**
 * Whether the inputs available can support a given vehicle evidence unit.
 *
 * Same discipline as the existing derived-dependency model: a unit is only
 * available when every input it declares is present. Vehicle dwell in
 * particular must never appear off the back of a bare vehicle count.
 */
export function vehicleUnitAvailable(
  unit: VehicleEvidenceUnit,
  availableInputIds: readonly EvidenceInputId[],
): boolean {
  const semantic = getVehicleEvidenceSemantic(unit);
  if (!semantic) return false;
  return semantic.requiredInputIds.every((id) => availableInputIds.includes(id));
}

/** Deterministic structural checks, run from the test suite. */
export function validateVehicleSemantics(): readonly string[] {
  const errors: string[] = [];
  for (const semantic of vehicleEvidenceSemantics) {
    const path = `vehicleEvidenceSemantics.${semantic.unit}`;
    if (!semantic.requiredInputIds.length) {
      errors.push(`${path}: declares no required input`);
    }
    if (!semantic.isNot.length) {
      errors.push(`${path}: declares no boundary`);
    }
    if (resolvesAsPeopleEvidence(semantic.unit) !== false) {
      errors.push(`${path}: resolves as people evidence`);
    }
  }
  const units = vehicleEvidenceSemantics.map((semantic) => semantic.unit);
  if (new Set(units).size !== units.length) {
    errors.push("vehicleEvidenceSemantics: duplicate unit");
  }
  return errors;
}
