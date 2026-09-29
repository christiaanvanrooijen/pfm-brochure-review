/**
 * Proof / Case Runtime
 *
 * Generic, deterministic runtime for querying the typed proof/case content model.
 * Enables the future Commercial Experience to answer proof-related questions
 * without building a separate case library or implementing playback.
 *
 * Design principles:
 * - Proof is contextual depth, not route navigation
 * - Scene-safe and segment-safe lookups
 * - Internal vs external availability distinction
 * - Placeholder truth: queryable but not playable/external
 * - No auto-playback, no customer logos, no invented content
 * - Scene → proof and Capability → proof relationships explicit
 * - Cross-segment leakage prevented
 * - Pure functions where possible
 * - No UI coupling - this is a data/query layer only
 */

import type {
  ProofAssetDefinition,
  ProofAssetId,
  ProofFormat,
  ProofStatus,
  SceneId,
  SegmentId,
  TechnologyCapabilityId,
} from "./types.ts";

import {
  proofAssets,
  contentBundle,
} from "./index.ts";

import {
  getScene,
  getSceneForSegment,
} from "./runtime.ts";

// Re-export types
export type { ProofAssetId, ProofFormat, ProofStatus };

/**
 * Proof availability modes for different audiences
 */
export type ProofAvailabilityMode = "internal" | "external";

/**
 * Proof playability status with reasons
 */
export interface ProofPlayability {
  playable: boolean;
  reason: "placeholder" | "missing_media" | "not_approved_externally" | "missing_format" | "approved";
}

/**
 * Get a proof asset by ID
 */
export function getProofAsset(proofId: ProofAssetId): ProofAssetDefinition | undefined {
  return proofAssets.find((p) => p.id === proofId);
}

/**
 * Get all proof assets
 */
export function getAllProofAssets(): readonly ProofAssetDefinition[] {
  return proofAssets;
}

/**
 * Get proof assets related to a specific scene (segment-safe)
 */
export function getProofsForScene(segmentId: SegmentId, sceneId: SceneId): readonly ProofAssetDefinition[] {
  // Validate scene belongs to segment
  const scene = getSceneForSegment(segmentId, sceneId);
  if (!scene) {
    return [];
  }

  // A scene's slot can be shared with scenes a case does not evidence (the
  // Retail street and store-visit scenes share CASE-RET-01), so the proof must
  // also name this scene itself. Stricter, never wider.
  return scene.proofAssetIds
    .map((id) => contentBundle.proofAssets.find((p) => p.id === id))
    .filter((p): p is ProofAssetDefinition => p !== undefined && p.relatedSceneIds.includes(sceneId));
}

/**
 * Get proof assets related to a specific capability
 */
export function getProofsForCapability(capabilityId: TechnologyCapabilityId): readonly ProofAssetDefinition[] {
  return proofAssets.filter((p) => p.relatedCapabilityIds.includes(capabilityId));
}

/**
 * Get usable proof assets for a scene (external-facing)
 * Only returns proof that is approved, playable, has format, and externally approved
 */
export function getUsableProofsForScene(segmentId: SegmentId, sceneId: SceneId): readonly ProofAssetDefinition[] {
  const proofs = getProofsForScene(segmentId, sceneId);
  return proofs.filter((p) =>
    p.status === "available" &&
    p.playable &&
    p.externalUseApproved &&
    p.format !== null
  );
}

/**
 * Get internal proof assets for a scene (available to sales users)
 * Returns all proof assets linked to the scene regardless of external approval
 */
export function getInternalProofsForScene(segmentId: SegmentId, sceneId: SceneId): readonly ProofAssetDefinition[] {
  return getProofsForScene(segmentId, sceneId);
}

/**
 * Get external proof assets for a scene (prospect-facing)
 * Only returns proof that is externally approved
 */
export function getExternalProofsForScene(segmentId: SegmentId, sceneId: SceneId): readonly ProofAssetDefinition[] {
  const proofs = getProofsForScene(segmentId, sceneId);
  return proofs.filter((p) => p.externalUseApproved);
}

/**
 * Get playable proof assets for a scene
 * Only returns proof that is playable, has format, and is approved
 */
export function getPlayableProofsForScene(segmentId: SegmentId, sceneId: SceneId): readonly ProofAssetDefinition[] {
  const proofs = getProofsForScene(segmentId, sceneId);
  return proofs.filter((p) =>
    p.playable &&
    p.format !== null &&
    p.status === "available" &&
    p.externalUseApproved
  );
}

/**
 * Check proof availability for a specific proof asset
 */
export interface ProofAvailability {
  internallyAvailable: boolean;    // Can be shown to internal users
  externallyAvailable: boolean;    // Approved for external/prospect use
  playable: ProofPlayability;      // Can be played/viewed
  status: ProofStatus;             // Current status
  format: ProofFormat | null;      // Media format if any
  missingMedia: boolean;           // Missing video/media reference
  missingFormat: boolean;          // Missing format declaration
  notApprovedExternally: boolean;  // Not approved for external use
  isPlaceholder: boolean;          // Is a placeholder
}

/**
 * Get detailed availability for a proof asset
 */
export function getProofAvailability(proofId: ProofAssetId): ProofAvailability | null {
  const proof = getProofAsset(proofId);
  if (!proof) {
    return null;
  }

  const isPlaceholder = proof.status === "placeholder";
  const missingMedia = proof.format === null || proof.videoDuration === null;
  const missingFormat = proof.format === null;
  const notApprovedExternally = !proof.externalUseApproved;

  let playable: ProofPlayability;
  if (isPlaceholder) {
    playable = { playable: false, reason: "placeholder" };
  } else if (missingMedia) {
    playable = { playable: false, reason: "missing_media" };
  } else if (!proof.externalUseApproved) {
    playable = { playable: false, reason: "not_approved_externally" };
  } else if (missingFormat) {
    playable = { playable: false, reason: "missing_format" };
  } else if (proof.status === "available" && proof.playable && proof.format !== null && proof.externalUseApproved) {
    playable = { playable: true, reason: "approved" };
  } else {
    playable = { playable: false, reason: "not_approved_externally" };
  }

  return {
    internallyAvailable: true, // All proof assets are internally queryable
    externallyAvailable: proof.externalUseApproved && proof.status === "available",
    playable,
    status: proof.status,
    format: proof.format,
    missingMedia,
    missingFormat,
    notApprovedExternally,
    isPlaceholder,
  };
}

/**
 * Get permission status for a proof asset
 */
export interface ProofPermissionStatus {
  canViewInternally: boolean;
  canViewExternally: boolean;
  canPlayInternally: boolean;
  canPlayExternally: boolean;
  requiresApproval: boolean;
  approvalStatus: "approved" | "pending" | "placeholder" | "unavailable" | "available" | "approval_required";
}

export function getProofPermissionStatus(proofId: ProofAssetId): ProofPermissionStatus | null {
  const proof = getProofAsset(proofId);
  if (!proof) {
    return null;
  }

  const isPlaceholder = proof.status === "placeholder";

  return {
    canViewInternally: true,
    canViewExternally: proof.externalUseApproved && proof.status === "available",
    canPlayInternally: proof.playable && proof.format !== null,
    canPlayExternally: proof.playable && proof.format !== null && proof.externalUseApproved && proof.status === "available",
    requiresApproval: proof.status === "placeholder" || proof.status === "approval_required",
    approvalStatus: isPlaceholder ? "placeholder" : proof.status,
  };
}

/**
 * Get content readiness for a proof asset
 */
export interface ProofContentReadiness {
  hasMediaReference: boolean;
  hasFormat: boolean;
  hasDuration: boolean;
  hasThumbnail: boolean;
  hasChallenge: boolean;
  hasMeasurementApproach: boolean;
  hasCustomerLearning: boolean;
  hasExternalUseApproval: boolean;
  completenessScore: number; // 0-1
}

export function getProofContentReadiness(proofId: ProofAssetId): ProofContentReadiness | null {
  const proof = getProofAsset(proofId);
  if (!proof) {
    return null;
  }

  const fields = [
    { key: "format", value: proof.format },
    { key: "videoDuration", value: proof.videoDuration },
    { key: "thumbnailAssetId", value: proof.thumbnailAssetId },
    { key: "challenge", value: proof.challenge },
    { key: "measurementApproach", value: proof.measurementApproach },
    { key: "customerLearning", value: proof.customerLearning },
    { key: "externalUseApproved", value: proof.externalUseApproved },
  ];

  const present = fields.filter((f) => f.value !== null && f.value !== false).length;
  const total = fields.length;

  return {
    hasMediaReference: proof.format !== null,
    hasFormat: proof.format !== null,
    hasDuration: proof.videoDuration !== null,
    hasThumbnail: proof.thumbnailAssetId !== null,
    hasChallenge: proof.challenge !== null,
    hasMeasurementApproach: proof.measurementApproach !== null,
    hasCustomerLearning: proof.customerLearning !== null,
    hasExternalUseApproval: proof.externalUseApproved,
    completenessScore: present / total,
  };
}

/**
 * Complete proof runtime for a scene (for UI binding)
 */
export interface ProofRuntimeForScene {
  scene: {
    id: SceneId;
    segment: SegmentId;
    title: string;
  };
  internalProofs: readonly ProofAssetDefinition[];
  externalProofs: readonly ProofAssetDefinition[];
  playableProofs: readonly ProofAssetDefinition[];
  hasInternalProof: boolean;
  hasExternalProof: boolean;
  hasPlayableProof: boolean;
  proofDetails: Array<{
    proof: ProofAssetDefinition;
    availability: ProofAvailability;
    permission: ProofPermissionStatus;
    contentReadiness: ProofContentReadiness;
  }>;
  capabilityProofs: Map<TechnologyCapabilityId, readonly ProofAssetDefinition[]>;
}

export function getProofRuntimeForScene(segmentId: SegmentId, sceneId: SceneId): ProofRuntimeForScene | null {
  // Validate scene belongs to segment
  const scene = getSceneForSegment(segmentId, sceneId);
  if (!scene) {
    return null;
  }

  const internalProofs = getInternalProofsForScene(segmentId, sceneId);
  const externalProofs = getExternalProofsForScene(segmentId, sceneId);
  const playableProofs = getPlayableProofsForScene(segmentId, sceneId);

  const proofDetails = internalProofs.map((proof) => ({
    proof,
    availability: getProofAvailability(proof.id)!,
    permission: getProofPermissionStatus(proof.id)!,
    contentReadiness: getProofContentReadiness(proof.id)!,
  }));

  // Build capability-proof map
  const capabilityProofs = new Map<TechnologyCapabilityId, readonly ProofAssetDefinition[]>();
  for (const proof of internalProofs) {
    for (const capId of proof.relatedCapabilityIds) {
      const existing = capabilityProofs.get(capId) || [];
      capabilityProofs.set(capId, [...existing, proof]);
    }
  }

  return {
    scene: {
      id: scene.id,
      segment: scene.segment,
      title: scene.title,
    },
    internalProofs,
    externalProofs,
    playableProofs,
    hasInternalProof: internalProofs.length > 0,
    hasExternalProof: externalProofs.length > 0,
    hasPlayableProof: playableProofs.length > 0,
    proofDetails,
    capabilityProofs,
  };
}

/**
 * Check if a scene has any internal proof
 */
export function sceneHasInternalProof(segmentId: SegmentId, sceneId: SceneId): boolean {
  return getInternalProofsForScene(segmentId, sceneId).length > 0;
}

/**
 * Check if a scene has any external proof
 */
export function sceneHasExternalProof(segmentId: SegmentId, sceneId: SceneId): boolean {
  return getExternalProofsForScene(segmentId, sceneId).length > 0;
}

/**
 * Check if a scene has any playable proof
 */
export function sceneHasPlayableProof(segmentId: SegmentId, sceneId: SceneId): boolean {
  return getPlayableProofsForScene(segmentId, sceneId).length > 0;
}

/**
 * Cross-segment proof leakage prevention
 * Validates that proof assets only reference scenes/capabilities in their declared segment
 */
export function validateProofCrossSegment(): readonly string[] {
  const errors: string[] = [];
  for (const proof of proofAssets) {
    // Check related scenes
    for (const sceneId of proof.relatedSceneIds) {
      const scene = getScene(sceneId);
      if (scene && scene.segment !== proof.segment) {
        errors.push(`Proof ${proof.id} (${proof.segment}) references scene ${sceneId} (${scene.segment})`);
      }
    }
    // Check related capabilities (capabilities are global, but implementations may be segment-specific)
    // This is a warning-level check
  }
  return errors;
}

/**
 * Get all proof assets for a segment
 */
export function getProofsForSegment(segmentId: SegmentId): readonly ProofAssetDefinition[] {
  return proofAssets.filter((p) => p.segment === segmentId);
}

/**
 * Get proof asset counts by status for a segment
 */
export function getProofStatusCounts(segmentId: SegmentId): Record<ProofStatus, number> {
  const proofs = getProofsForSegment(segmentId);
  const counts: Record<ProofStatus, number> = {
    available: 0,
    placeholder: 0,
    approval_required: 0,
    unavailable: 0,
  };
  for (const proof of proofs) {
    counts[proof.status]++;
  }
  return counts;
}

/**
 * Verify placeholder proof constraints
 * Placeholder proof must not be playable, must not have media, must not be externally available
 */
export function validatePlaceholderConstraints(): readonly string[] {
  const errors: string[] = [];
  for (const proof of proofAssets) {
    if (proof.status === "placeholder") {
      if (proof.playable) {
        errors.push(`Placeholder proof ${proof.id} is marked as playable`);
      }
      if (proof.format !== null) {
        errors.push(`Placeholder proof ${proof.id} has format set`);
      }
      if (proof.externalUseApproved) {
        errors.push(`Placeholder proof ${proof.id} is marked externally approved`);
      }
      if (proof.videoDuration !== null) {
        errors.push(`Placeholder proof ${proof.id} has video duration`);
      }
      if (proof.thumbnailAssetId !== null) {
        errors.push(`Placeholder proof ${proof.id} has thumbnail`);
      }
      if (proof.challenge !== null) {
        errors.push(`Placeholder proof ${proof.id} has challenge`);
      }
      if (proof.measurementApproach !== null) {
        errors.push(`Placeholder proof ${proof.id} has measurement approach`);
      }
      if (proof.customerLearning !== null) {
        errors.push(`Placeholder proof ${proof.id} has customer learning`);
      }
    }
  }
  return errors;
}
