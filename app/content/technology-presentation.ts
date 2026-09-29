/**
 * What a prospect is allowed to read on a device card.
 *
 * THE RULE
 *
 * The commercial experience does not name a sensor by vendor or model number.
 * A prospect is buying a measurement capability, not a part number, and a
 * brochure that reads "Xovis PC2SE" invites a conversation about procurement
 * instead of about their location. So the drawer shows a FUNCTIONAL name — what
 * the device is, in the language the rest of the experience already uses.
 *
 * WHAT STAYS IN THE MODEL AND WHY
 *
 * `supplier` and `product` are not removed. They are how a requirement profile
 * is attached, how a privacy statement is sourced, and how the source registry
 * is audited — every technical claim in this product traces back to a named
 * product's documentation, and that chain must not be broken to tidy a label.
 * The names simply stop at the presentation boundary, which is this file.
 *
 * THE SAFE DIRECTION
 *
 * An implementation with no entry here does NOT fall through to its vendor
 * name. It falls back to `implementationRole`, which describes the job without
 * naming anyone — so a device added tomorrow is vendor-free by default, and
 * naming a vendor becomes a deliberate act rather than an oversight. A test
 * asserts that every vendor-named implementation is covered by one of the two.
 */

import type { TechnologyImplementationId } from "./types.ts";

/**
 * Functional names, as supplied by the product lead.
 *
 * Field of view is part of the name where it changes what the device can cover
 * — "Basic FoV" and "FishEye FoV" are the distinction a reader needs to
 * understand why two 3D sensors are not interchangeable.
 */
export const implementationPresentationNames: Readonly<
  Partial<Record<TechnologyImplementationId, string>>
> = {
  "impl-xovis-3d-entrance": "3D Sensor Basic FoV",
  // Named on the IP-detection pattern: same device family, outdoor housing.
  "impl-xovis-3d-entrance-outdoor": "3D Sensor Basic FoV outdoor",
  "impl-xovis-3d-spatial": "3D Sensor FishEye FoV",
  "impl-milesight-vs361-passerby": "Infrared Storefront sensor",
  "impl-milesight-vs125p-entrance": "Stereo Vision sensor Basic FoV",
  "impl-tattile-anpr-vehicle": "ANPR Sensor",
  "impl-lidar-spatial": "LiDAR 360° 92 Beam sensor",
  "impl-ip-detection-indoor": "IP Detection Sensor indoor",
  "impl-ip-detection-outdoor": "IP Detection Sensor outdoor",
  // Product lead, 2026-09-29: the analytics run on an IP camera — an existing
  // one where the site has it — and the brochure calls that device an IP
  // Detection Sensor, as it does the indoor and outdoor models above.
  "impl-isarsoft-camera-analytics": "IP Detection Sensor",
};

/**
 * Named by the product lead, but absent from the typed model.
 *
 * Recorded rather than quietly dropped, so the next person to add such a
 * device finds the decision already waiting. Empty since 2026-09-27, when the
 * two Bosch IP detection sensors that waited here entered the model.
 */
export const presentationNamesAwaitingImplementation: readonly {
  product: string;
  presentationName: string;
}[] = [];

/**
 * A device that another device cannot work without.
 *
 * Not an upsell and not an option: these are the units a site genuinely needs
 * alongside the sensor, and leaving them out of "what would we need" would make
 * the answer wrong in the direction that costs someone money later.
 *
 * `condition` is null where the accessory is always required, and a plain
 * sentence where it depends on the installation's size.
 */
export const implementationAccessories: readonly {
  implementationId: TechnologyImplementationId;
  name: string;
  purpose: string;
  condition: string | null;
}[] = [
  {
    implementationId: "impl-lidar-spatial",
    name: "LiDAR Processing unit",
    purpose: "Processes the sensor's stream and renders the point cloud it produces.",
    condition: null,
  },
  {
    implementationId: "impl-xovis-3d-spatial",
    name: "3D Processing unit",
    purpose: "Handles the combined load once a single site runs many of these sensors.",
    condition: "Required above nine sensors on one site.",
  },
];

/**
 * Excluding staff from a visitor count.
 *
 * A real question in Retail — a shop floor with eight staff on it will report
 * eight visitors that never were — and one with a narrow answer: it is
 * available on one device family, by wearing a tag. Typed with both the segment
 * and the implementation it depends on, so it can never be presented as a
 * general capability of the product.
 */
export const staffExclusionOptions: readonly {
  segment: string;
  implementationIds: readonly TechnologyImplementationId[];
  name: string;
  body: string;
}[] = [
  {
    segment: "retail",
    implementationIds: ["impl-milesight-vs125p-entrance"],
    name: "Staff exclusion",
    body:
      "Staff can be kept out of the visitor count by wearing a tag — either a UWB wireless tag from the Advanced Staff Exclusion Kit, or a lanyard. It is available on this sensor family only.",
  },
];

/** The name a prospect sees. Never a vendor, never a model number. */
export function presentationNameOf(implementation: {
  id: TechnologyImplementationId;
  implementationRole: string;
}): string {
  return implementationPresentationNames[implementation.id] ?? implementation.implementationRole;
}

export function accessoriesFor(
  implementationId: TechnologyImplementationId,
): readonly { name: string; purpose: string; condition: string | null }[] {
  return implementationAccessories.filter((a) => a.implementationId === implementationId);
}

export function staffExclusionFor(
  segmentId: string,
  implementationIds: readonly TechnologyImplementationId[],
): { name: string; body: string } | null {
  const match = staffExclusionOptions.find(
    (option) =>
      option.segment === segmentId &&
      option.implementationIds.some((id) => implementationIds.includes(id)),
  );
  return match ? { name: match.name, body: match.body } : null;
}
