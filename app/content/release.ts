/**
 * What a production build may show.
 *
 * Until 2026-09-29 production offered prospects only the approved Retail shell:
 * the segment picker linked nowhere else, and the Configure and Act stages of
 * the segment journeys were development-only review routes. On 2026-09-29 the
 * product lead approved the brochure as it stands — the cover, the five segment
 * journeys, and the Configure and Act stages of Retail, Shopping Centre and
 * Retail Park — for production (DECISION-LOG.md).
 *
 * One switch, so the approval can be read, tested and reverted in one place.
 * The per-scene review routes under /preview are not part of the brochure and
 * stay development-only.
 */
export const brochureApprovedForProduction = true;

/** Whether a brochure route may render in this build. */
export function brochureRouteAvailable(): boolean {
  return brochureApprovedForProduction || process.env.NODE_ENV !== "production";
}
