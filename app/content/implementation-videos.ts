/**
 * PFM explaining an implementation, on video.
 *
 * NOT PROOF. A customer case says what happened at a customer; these say how
 * PFM describes its own capability. They are shown beside an implementation in
 * Configure's "What is needed", labelled as PFM's explanation, and never enter
 * the proof runtime or the drawer's "In practice".
 *
 * Only PFM's own published videos, played from the publisher's copy and only
 * when the reader asks (see `YouTubeOnRequest`).
 */

import type { TechnologyImplementationId } from "./types.ts";

export interface ImplementationExplainerVideo {
  implementationId: TechnologyImplementationId;
  kind: "youtube";
  videoId: string;
  /** The title PFM gave the video, for the accessible name. */
  publishedTitle: string;
  durationSeconds: number;
  /** What the viewer will see, in words the brochure can stand behind. */
  description: string;
  /** Always stated beside it. */
  notProofNote: string;
  sourceRefs: readonly string[];
}

export const implementationExplainerVideos: readonly ImplementationExplainerVideo[] = [
  {
    implementationId: "impl-isarsoft-camera-analytics",
    kind: "youtube",
    videoId: "F1-0cn8noeo",
    publishedTitle: "PFM's CCTV AI Capabilities",
    durationSeconds: 110,
    description:
      "Mark King, Market Development Director at PFM, explains how AI analytics can use IP cameras a site already has as a source. Recorded at PFM's event at Future Stores.",
    notProofNote: "An explanation by PFM, not a customer result.",
    sourceRefs: [
      "PFM Intelligence Group YouTube video F1-0cn8noeo, published 2026-07-10",
      "https://www.pfm-intelligence.com/cctv",
      "Product lead instruction, 2026-09-29: show in Configure as PFM's explanation, not as proof (DECISION-LOG.md)",
    ],
  },
];

export function getImplementationExplainerVideo(
  implementationId: TechnologyImplementationId,
): ImplementationExplainerVideo | null {
  return implementationExplainerVideos.find((video) => video.implementationId === implementationId) ?? null;
}
