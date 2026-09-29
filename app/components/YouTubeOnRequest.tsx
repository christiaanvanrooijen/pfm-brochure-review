"use client";

/**
 * A published YouTube video that loads only when the reader asks.
 *
 * Until the button is pressed nothing is requested from YouTube, so an offline
 * demo or a blocked network still shows a working page, and no third-party
 * content loads on arrival. Played from the privacy-enhanced embed.
 */

import { useState } from "react";

const minutes = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export function YouTubeOnRequest({
  videoId,
  title,
  playLabel,
  note,
  durationSeconds,
}: {
  videoId: string;
  title: string;
  playLabel: string;
  note: string;
  durationSeconds: number | null;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="proof-case__media">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button type="button" className="proof-case__play" onClick={() => setPlaying(true)}>
          <span className="proof-case__play-mark" aria-hidden="true">▶</span>
          <span>
            {playLabel}
            {durationSeconds ? ` · ${minutes(durationSeconds)}` : ""}
          </span>
          <small>{note}</small>
        </button>
      )}
    </div>
  );
}
