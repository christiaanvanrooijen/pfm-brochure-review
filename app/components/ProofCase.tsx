"use client";

/**
 * One approved customer case: who, what was measured, what it changed, what it
 * does not show — and the customer's published video.
 *
 * Shared by the drawer's "In practice" tab and Configure's "See it in
 * practice". It renders only what the proof runtime already cleared: callers
 * pass `getPlayableProofsForScene` results, never a placeholder.
 *
 * THE VIDEO
 *
 * The brochure hosts no customer footage. It plays the copy PFM published, and
 * only when asked (`YouTubeOnRequest`; "No auto-playback" in proof-runtime.ts),
 * so an offline demo still shows the whole case in words and a link to its page.
 */

import type { ProofAssetDefinition } from "../content/types";
import type { Locale } from "../i18n/locales";
import { proofCaseTranslations, proofUiCopy } from "../i18n/proof";
import { YouTubeOnRequest } from "./YouTubeOnRequest";

export function ProofCase({ proof, locale }: { proof: ProofAssetDefinition; locale: Locale }) {
  const ui = proofUiCopy[locale];
  const copy =
    locale === "en"
      ? {
          title: proof.title,
          challenge: proof.challenge,
          measurementApproach: proof.measurementApproach,
          customerLearning: proof.customerLearning,
          truthBoundary: proof.truthBoundary,
        }
      : (proofCaseTranslations[locale][proof.id] ?? {
          title: proof.title,
          challenge: proof.challenge,
          measurementApproach: proof.measurementApproach,
          customerLearning: proof.customerLearning,
          truthBoundary: proof.truthBoundary,
        });

  return (
    <article className="proof-case">
      <p className="proof-case__kicker">
        {ui.kicker}
        {proof.customerName && (
          <>
            <span aria-hidden="true"> · </span>
            {proof.customerName}
          </>
        )}
      </p>
      <h4 className="proof-case__title">{copy.title}</h4>

      {proof.media?.kind === "youtube" && (
        <YouTubeOnRequest
          videoId={proof.media.videoId}
          title={proof.media.publishedTitle}
          playLabel={ui.play}
          note={ui.loadsFrom}
          durationSeconds={proof.videoDuration}
        />
      )}

      <dl className="proof-case__facts">
        {copy.challenge && (
          <>
            <dt>{ui.challenge}</dt>
            <dd>{copy.challenge}</dd>
          </>
        )}
        {copy.measurementApproach && (
          <>
            <dt>{ui.approach}</dt>
            <dd>{copy.measurementApproach}</dd>
          </>
        )}
        {copy.customerLearning && (
          <>
            <dt>{ui.learning}</dt>
            <dd>{copy.customerLearning}</dd>
          </>
        )}
      </dl>

      {copy.truthBoundary && <p className="proof-case__boundary">{copy.truthBoundary}</p>}

      {proof.publishedSourceUrls.map((url) => (
        <a key={url} className="proof-case__source" href={url} target="_blank" rel="noopener noreferrer">
          {ui.published} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </article>
  );
}
