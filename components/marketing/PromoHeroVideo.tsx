"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  poster: string;
  posterAlt: string;
};

/**
 * Hero preview card for /promo-rescue. Plays the real promo-video.mp4 clip
 * with the Hotel Indigo collage as the poster (shown instantly while the
 * video loads, and used as a static fallback if the video ever fails to
 * load) — so this card never renders as a black/empty box.
 */
export function PromoHeroVideo({ src, poster, posterAlt }: Props) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (videoFailed) {
    return (
      <Image
        src={poster}
        alt={posterAlt}
        fill
        sizes="(max-width: 1024px) 90vw, 45vw"
        priority
        className="object-cover"
      />
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={posterAlt}
      className="h-full w-full object-cover"
      onError={() => setVideoFailed(true)}
    />
  );
}
