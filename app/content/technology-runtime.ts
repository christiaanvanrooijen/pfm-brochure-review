/**
 * Technology Drilldown Runtime
 *
 * Generic, deterministic runtime for querying the typed technology content model.
 * Enables the future Commercial Experience to answer technology drilldown questions
 * without auto-selecting products or making recommendations.
 *
 * Design principles:
 * - Capability-first: scene -> capability -> implementation options
 * - Vendor-neutral capabilities; implementations are one-to-many options
 * - No auto-selection, ranking, pricing, or recommendation logic
 * - Privacy evidence is implementation-specific, not generalised
 * - Supported/blocked claims exposed truthfully
 * - Source/privacy gaps surfaced honestly
 * - Segment-safe scene lookups
 * - Pure functions where possible
 * - No UI coupling - this is a data/query layer only
 */

import type {
  TechnologyCapabilityDefinition,
  TechnologyCapabilityId,
  TechnologyImplementationDefinition,
  TechnologyImplementationId,
  SceneDefinition,
  SceneId,
  SegmentId,
  SourceStatus,
} from "./types.ts";

import {
  technologyCapabilities,
  technologyImplementations,
  contentBundle,
} from "./index.ts";

import {
  getSceneForSegment,
} from "./runtime.ts";

// Re-export canonical technology capability IDs
export type { TechnologyCapabilityId, TechnologyImplementationId, SourceStatus };

/**
 * Readiness states derived from existing SourceStatus fields
 * These are computed, not stored, to avoid competing concepts
 */
export type ImplementationReadiness =
  | "READY_FOR_EXTERNAL_EXPLANATION"
  | "PARTIAL"
  | "SOURCE_MAPPING_REQUIRED"
  | "PRODUCT_VALIDATION_REQUIRED"
  | "ARCHITECTURE_ONLY";

/**
 * Capability-level readiness derived from implementation readiness
 */
export type CapabilityReadiness =
  | "READY_FOR_EXTERNAL_EXPLANATION"
  | "PARTIAL"
  | "SOURCE_MAPPING_REQUIRED"
  | "PRODUCT_VALIDATION_REQUIRED"
  | "ARCHITECTURE_ONLY";

/**
 * Derive implementation readiness from source statuses
 * Implementation is "READY_FOR_EXTERNAL_EXPLANATION" only when all critical fields are source_backed
 */
export function deriveImplementationReadiness(impl: TechnologyImplementationDefinition): ImplementationReadiness {
  const criticalFields: (keyof TechnologyImplementationDefinition)[] = [
    "sourceStatus",
    "privacyStatus",
    "technicalDetailStatus",
  ];

  const statuses = criticalFields.map((field) => impl[field] as SourceStatus);

  // If any critical field requires source mapping or product validation -> not ready for external explanation
  if (statuses.some((s) => s === "requires_source_mapping" || s === "requires_product_validation")) {
    return "SOURCE_MAPPING_REQUIRED";
  }

  // If any critical field is architecture_only -> not ready for external explanation
  if (statuses.some((s) => s === "architecture_only")) {
    return "ARCHITECTURE_ONLY";
  }

  // If all critical fields are source_backed -> ready for external explanation
  if (statuses.every((s) => s === "source_backed")) {
    return "READY_FOR_EXTERNAL_EXPLANATION";
  }

  // Partially source backed -> partial
  if (statuses.some((s) => s === "partially_source_backed" || s === "user_approved_product_input")) {
    return "PARTIAL";
  }

  return "PARTIAL";
}

/**
 * Derive capability readiness from its implementations
 * Capability is ready only if at least one implementation is ready for external explanation
 */
export function deriveCapabilityReadiness(capabilityId: TechnologyCapabilityId): CapabilityReadiness {
  const implementations = getImplementationsForCapability(capabilityId);
  if (implementations.length === 0) {
    return "ARCHITECTURE_ONLY";
  }

  const readinesses = implementations.map(deriveImplementationReadiness);

  // If any implementation is ready for external explanation -> capability is ready
  if (readinesses.includes("READY_FOR_EXTERNAL_EXPLANATION")) {
    return "READY_FOR_EXTERNAL_EXPLANATION";
  }

  // If any implementation is partial -> capability is partial
  if (readinesses.includes("PARTIAL")) {
    return "PARTIAL";
  }

  // If all require source mapping -> source mapping required
  if (readinesses.every((r) => r === "SOURCE_MAPPING_REQUIRED")) {
    return "SOURCE_MAPPING_REQUIRED";
  }

  // If all require product validation -> product validation required
  if (readinesses.every((r) => r === "PRODUCT_VALIDATION_REQUIRED")) {
    return "PRODUCT_VALIDATION_REQUIRED";
  }

  // If all are architecture only -> architecture only
  if (readinesses.every((r) => r === "ARCHITECTURE_ONLY")) {
    return "ARCHITECTURE_ONLY";
  }

  return "PARTIAL";
}

/**
 * Get a technology capability by ID
 */
export function getTechnologyCapability(capabilityId: TechnologyCapabilityId): TechnologyCapabilityDefinition | undefined {
  return technologyCapabilities.find((c) => c.id === capabilityId);
}

/**
 * Get all technology capabilities
 */
export function getAllTechnologyCapabilities(): readonly TechnologyCapabilityDefinition[] {
  return technologyCapabilities;
}

/**
 * Get a technology implementation by ID
 */
export function getImplementation(implementationId: TechnologyImplementationId): TechnologyImplementationDefinition | undefined {
  return technologyImplementations.find((i) => i.id === implementationId);
}

/**
 * Get all technology implementations
 */
export function getAllImplementations(): readonly TechnologyImplementationDefinition[] {
  return technologyImplementations;
}

/**
 * Get capabilities attached to a specific scene (segment-safe)
 */
export function getCapabilitiesForScene(segmentId: SegmentId, sceneId: SceneId): readonly TechnologyCapabilityDefinition[] {
  // Validate scene belongs to segment
  const scene = getSceneForSegment(segmentId, sceneId);
  return scene.technologyCapabilityIds
    .map((id) => getTechnologyCapability(id))
    .filter((c): c is TechnologyCapabilityDefinition => c !== undefined);
}

/**
 * Get implementation options for a capability
 */
export function getImplementationsForCapability(capabilityId: TechnologyCapabilityId): readonly TechnologyImplementationDefinition[] {
  return technologyImplementations.filter((impl) =>
    impl.capabilityIds.includes(capabilityId)
  );
}

/**
 * Get implementation readiness (derived)
 */
export function getImplementationReadiness(implementationId: TechnologyImplementationId): ImplementationReadiness {
  const impl = getImplementation(implementationId);
  if (!impl) {
    return "ARCHITECTURE_ONLY";
  }
  return deriveImplementationReadiness(impl);
}

/**
 * Get capability readiness (derived)
 */
export function getCapabilityReadiness(capabilityId: TechnologyCapabilityId): CapabilityReadiness {
  return deriveCapabilityReadiness(capabilityId);
}

/**
 * Get privacy status for an implementation
 */
export function getPrivacyStatusForImplementation(implementationId: TechnologyImplementationId): SourceStatus | undefined {
  const impl = getImplementation(implementationId);
  return impl?.privacyStatus;
}

/**
 * Get source status for an implementation
 */
export function getSourceStatusForImplementation(implementationId: TechnologyImplementationId): SourceStatus | undefined {
  const impl = getImplementation(implementationId);
  return impl?.sourceStatus;
}

/**
 * Get supported claims for an implementation
 */
export function getSupportedClaimsForImplementation(implementationId: TechnologyImplementationId): readonly string[] | undefined {
  const impl = getImplementation(implementationId);
  return impl?.supportedClaims;
}

/**
 * Get blocked/unsupported claims for an implementation
 */
export function getBlockedClaimsForImplementation(implementationId: TechnologyImplementationId): readonly string[] | undefined {
  const impl = getImplementation(implementationId);
  return impl?.unsupportedClaims;
}

/**
 * Get source references for an implementation
 */
export function getSourceRefsForImplementation(implementationId: TechnologyImplementationId): readonly string[] | undefined {
  const impl = getImplementation(implementationId);
  return impl?.sourceRefs;
}

/**
 * Get technology drilldown data for a scene (complete contract for UI binding)
 */
export interface TechnologyDrilldownForScene {
  scene: SceneDefinition;
  capabilities: Array<{
    capability: TechnologyCapabilityDefinition;
    readiness: CapabilityReadiness;
    purpose: string;
    privacyPrinciple: string;
    evidenceTypes: readonly string[];
    implementations: Array<{
      implementation: TechnologyImplementationDefinition;
      readiness: ImplementationReadiness;
      supplier: string | null;
      product: string | null;
      implementationRole: string;
      sourceStatus: SourceStatus;
      privacyStatus: SourceStatus;
      technicalDetailStatus: SourceStatus;
      supportedClaims: readonly string[];
      blockedClaims: readonly string[];
      sourceRefs: readonly string[];
    }>;
  }>;
}

export function getTechnologyDrilldownForScene(segmentId: SegmentId, sceneId: SceneId): TechnologyDrilldownForScene | null {
  // Validate scene belongs to segment
  const scene = getSceneForSegment(segmentId, sceneId);
  if (!scene) {
    return null;
  }

  const capabilities = scene.technologyCapabilityIds
    .map((capId) => getTechnologyCapability(capId))
    .filter((c): c is TechnologyCapabilityDefinition => c !== undefined)
    .map((capability) => {
      const implementations = getImplementationsForCapability(capability.id);
      return {
        capability,
        readiness: getCapabilityReadiness(capability.id),
        purpose: capability.purpose,
        privacyPrinciple: capability.privacyPrinciple,
        evidenceTypes: capability.evidenceTypes,
        implementations: implementations.map((impl) => ({
          implementation: impl,
          readiness: getImplementationReadiness(impl.id),
          supplier: impl.supplier,
          product: impl.product,
          implementationRole: impl.implementationRole,
          sourceStatus: impl.sourceStatus,
          privacyStatus: impl.privacyStatus,
          technicalDetailStatus: impl.technicalDetailStatus,
          supportedClaims: impl.supportedClaims,
          blockedClaims: impl.unsupportedClaims,
          sourceRefs: impl.sourceRefs,
        })),
      };
    });

  return {
    scene,
    capabilities,
  };
}

/**
 * Check if a capability is for entrance measurement (TECH-02)
 */
export function isEntranceMeasurementCapability(capabilityId: TechnologyCapabilityId): boolean {
  return capabilityId === "TECH-02";
}

/**
 * Check if a capability is for passer-by measurement (TECH-01)
 */
export function isPasserByMeasurementCapability(capabilityId: TechnologyCapabilityId): boolean {
  return capabilityId === "TECH-01";
}

/**
 * Check if a capability is for in-store spatial measurement (TECH-04)
 */
export function isSpatialMeasurementCapability(capabilityId: TechnologyCapabilityId): boolean {
  return capabilityId === "TECH-04";
}

/**
 * Check if a capability is for visitor classification (TECH-03)
 */
export function isClassificationCapability(capabilityId: TechnologyCapabilityId): boolean {
  return capabilityId === "TECH-03";
}

/**
 * Check if a capability is for vehicle/parking (TECH-06)
 */
export function isVehicleParkingCapability(capabilityId: TechnologyCapabilityId): boolean {
  return capabilityId === "TECH-06";
}

/**
 * Check if a capability is for geo/mobility (TECH-07)
 */
export function isGeoMobilityCapability(capabilityId: TechnologyCapabilityId): boolean {
  return capabilityId === "TECH-07";
}

/**
 * Check if a capability is for business data connection (TECH-08)
 */
export function isBusinessDataCapability(capabilityId: TechnologyCapabilityId): boolean {
  return capabilityId === "TECH-08";
}

/**
 * Check if a capability is for anonymous visit matching (TECH-05)
 */
export function isVisitMatchingCapability(capabilityId: TechnologyCapabilityId): boolean {
  return capabilityId === "TECH-05";
}

/**
 * Get all entrance measurement implementations (Premium 3D, Basic 3D, IP-camera)
 */
export function getEntranceMeasurementImplementations(): readonly TechnologyImplementationDefinition[] {
  return getImplementationsForCapability("TECH-02");
}

/**
 * Get all passer-by measurement implementations (separate from entrance)
 */
export function getPasserByMeasurementImplementations(): readonly TechnologyImplementationDefinition[] {
  return getImplementationsForCapability("TECH-01");
}

/**
 * Get all in-store spatial measurement implementations
 */
export function getSpatialMeasurementImplementations(): readonly TechnologyImplementationDefinition[] {
  return getImplementationsForCapability("TECH-04");
}

/**
 * Get all visitor classification implementations
 */
export function getClassificationImplementations(): readonly TechnologyImplementationDefinition[] {
  return getImplementationsForCapability("TECH-03");
}

/**
 * Get all vehicle/parking implementations
 */
export function getVehicleParkingImplementations(): readonly TechnologyImplementationDefinition[] {
  return getImplementationsForCapability("TECH-06");
}

/**
 * Get all geo/mobility implementations
 */
export function getGeoMobilityImplementations(): readonly TechnologyImplementationDefinition[] {
  return getImplementationsForCapability("TECH-07");
}

/**
 * Get all business data implementations
 */
export function getBusinessDataImplementations(): readonly TechnologyImplementationDefinition[] {
  return getImplementationsForCapability("TECH-08");
}

/**
 * Get all visit matching implementations
 */
export function getVisitMatchingImplementations(): readonly TechnologyImplementationDefinition[] {
  return getImplementationsForCapability("TECH-05");
}

/**
 * Validate cross-segment technology misuse
 * Returns errors if scene references capability from wrong segment
 */
export function validateTechnologyCrossSegment(): readonly string[] {
  const errors: string[] = [];
  // The scene->capability mapping is already validated in runtime.ts validateCrossSegmentReferences
  // This function can be extended for technology-specific cross-segment checks if needed
  return errors;
}
