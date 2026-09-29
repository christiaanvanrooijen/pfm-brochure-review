/**
 * Act Runtime
 *
 * Deterministic query layer for the Act synthesis stage — the sixth and final
 * canonical stage. It answers exactly three questions:
 *
 *   what does the architecture say Act is?  -> segment `synthesis.act`
 *   which conversations may be offered?     -> act-directions.ts + proof gate
 *   is there anything real to show?         -> proof-runtime.ts, permission-gated
 *
 * Design constraints, all of them load-bearing and all of them mirroring the
 * discipline `solution-runtime.ts` already established for Configure:
 *
 * - NO RECOMMENDATION. Nothing ranks, scores, sorts by preference, marks a
 *   default or picks a "best" direction. Order is declaration order and carries
 *   no meaning. The segment's `synthesis.act.decisionOwner` is the literal
 *   `"human"` and `actDecisionOwner` re-exports it so the UI and the tests read
 *   the same fact rather than each assuming it.
 * - NO PRICING, ROI OR CALCULATION. Nothing here computes a number, and Act
 *   renders no measured value at all.
 * - NO HANDOFF. Nothing here creates, saves, sends or requests anything. There
 *   is deliberately no function that could be mistaken for one.
 * - PERMISSION-GATED PROOF. "See it in practice" uses the same definition of
 *   usable proof as Configure — `getPlayableProofsForScene`, which already
 *   requires status "available", a declared format, `playable` and
 *   `externalUseApproved`. In Presentation Mode a direction with no usable
 *   proof is not offered at all, so a prospect is never shown a dead action or
 *   a "coming soon".
 * - NO NEW TRUTH. This module composes typed content; it asserts nothing.
 */

import type { ProofAssetDefinition, SegmentId } from "./types.ts";
import { getSegment } from "./runtime.ts";
import {
  getInternalProofsForScene,
  getPlayableProofsForScene,
} from "./proof-runtime.ts";
import {
  actClosing,
  actConvergence,
  actDirectionIds,
  actRecapBeats,
  retailActDirections,
  validateActDirections,
  type ActDirectionDefinition,
  type ActDirectionId,
  type ActRecapBeat,
} from "./act-directions.ts";

export type { ActDirectionDefinition, ActDirectionId, ActRecapBeat };
export {
  actClosing,
  actConvergence,
  actDirectionIds,
  actRecapBeats,
  validateActDirections,
};

/**
 * The audience Act is currently being rendered to. Same two values and same
 * meaning as `ConfigureAudience`, kept as its own alias so the two stages can
 * never accidentally share a gate that only one of them intended.
 */
export type ActAudience = "sales" | "presentation";

/**
 * Machine-readable statement that Act generates no recommendation. Read from
 * the typed segment contract rather than asserted here.
 */
export const actDecisionOwner = "human" as const;

const allActDirections: readonly ActDirectionDefinition[] = retailActDirections;

/**
 * The typed Act synthesis contract for a segment.
 *
 * The UI binds to this rather than restating the governing question in JSX, so
 * Act cannot drift from the architecture that declares it a synthesis stage
 * whose decision owner is a human.
 */
export function getActSynthesis(segmentId: SegmentId) {
  return getSegment(segmentId)?.synthesis.act;
}

/** Every Act direction defined for a segment, in declaration order. */
export function getActDirectionsForSegment(
  segmentId: SegmentId,
): readonly ActDirectionDefinition[] {
  return allActDirections.filter((direction) => direction.segment === segmentId);
}

export function getActDirection(
  directionId: ActDirectionId,
): ActDirectionDefinition | undefined {
  return allActDirections.find((direction) => direction.id === directionId);
}

/* ==========================================================================
   PROOF — permission-gated, never invented
   ========================================================================== */

export interface ActProofView {
  /** Proof approved and playable for a prospect. Empty is the expected state. */
  usable: readonly ProofAssetDefinition[];
  /** Everything linked internally, including placeholders. Sales Mode only. */
  internal: readonly ProofAssetDefinition[];
  /** Quiet internal status line. Null in Presentation Mode. */
  internalStatusNote: string | null;
}

function dedupe(assets: readonly ProofAssetDefinition[]) {
  return [...new Map(assets.map((asset) => [asset.id, asset])).values()];
}

export function getActProof(
  segmentId: SegmentId,
  audience: ActAudience,
): ActProofView {
  const sceneIds = allActDirections
    .filter((direction) => direction.segment === segmentId)
    .flatMap((direction) => direction.proofSceneIds);

  const usable = dedupe(
    sceneIds.flatMap((sceneId) => [...getPlayableProofsForScene(segmentId, sceneId)]),
  );
  const internal = dedupe(
    sceneIds.flatMap((sceneId) => [...getInternalProofsForScene(segmentId, sceneId)]),
  );

  const presenting = audience === "presentation";

  return {
    usable,
    internal: presenting ? [] : internal,
    internalStatusNote:
      presenting || usable.length > 0 ? null : "No approved external proof yet",
  };
}

/* ==========================================================================
   WHICH DIRECTIONS MAY BE OFFERED
   ========================================================================== */

export interface ActDirectionView {
  direction: ActDirectionDefinition;
  /**
   * Whether approved, externally-cleared proof exists behind this direction.
   * `false` for every direction that is not proof-gated, and read as such.
   */
  hasApprovedProof: boolean;
  /** Quiet internal status line for a proof-gated direction. Sales Mode only. */
  internalStatusNote: string | null;
}

/**
 * The directions that may actually be put in front of this audience.
 *
 * Presentation Mode: a proof-gated direction is withheld entirely unless
 * approved, playable, externally-cleared proof exists. This is the whole point
 * of the gate — a prospect must never meet "Coming soon" or "No approved proof"
 * dressed up as an invitation.
 *
 * Sales Mode: every direction is offered, and the proof-gated one carries its
 * true internal status so the presenter knows what is behind it.
 */
export function getOfferableActDirections(
  segmentId: SegmentId,
  audience: ActAudience,
): readonly ActDirectionView[] {
  const proof = getActProof(segmentId, audience);
  const hasApprovedProof = proof.usable.length > 0;
  const presenting = audience === "presentation";

  return getActDirectionsForSegment(segmentId)
    .filter((direction) =>
      direction.requiresApprovedProof && presenting ? hasApprovedProof : true,
    )
    .map((direction) => ({
      direction,
      hasApprovedProof: direction.requiresApprovedProof ? hasApprovedProof : false,
      internalStatusNote:
        direction.requiresApprovedProof && !presenting
          ? proof.internalStatusNote
          : null,
    }));
}

/* ==========================================================================
   Validation
   ========================================================================== */

/**
 * Structural checks over the Act content and its binding to the architecture.
 * Run from the test suite alongside the content validator.
 */
export function validateActRuntime(): readonly string[] {
  const errors: string[] = [...validateActDirections()];

  for (const direction of allActDirections) {
    const segment = getSegment(direction.segment);
    if (!segment) {
      errors.push(`actDirections.${direction.id}: unknown segment ${direction.segment}`);
      continue;
    }

    // Act must stay a synthesis stage. A direction that pointed at a scene in
    // `stageMapping.act` would mean Act had grown a capability scene.
    if (segment.stageMapping.act.length > 0) {
      errors.push(`${direction.segment}: Act is a synthesis stage and must hold no scenes`);
    }

    const synthesis = segment.synthesis.act;
    if (synthesis.journeyStage !== "act") {
      errors.push(`${direction.segment}: Act synthesis is not bound to the act stage`);
    }
    if (synthesis.decisionOwner !== actDecisionOwner) {
      errors.push(`${direction.segment}: Act decision owner is not human-owned`);
    }

    for (const sceneId of direction.proofSceneIds) {
      const known = segment.scenes.some((scene) => scene.id === sceneId);
      if (!known) {
        errors.push(
          `actDirections.${direction.id}: unknown or cross-segment proof scene ${sceneId}`,
        );
      }
    }
  }

  return errors;
}
