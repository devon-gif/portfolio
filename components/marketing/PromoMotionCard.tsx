"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  poster: string;
  alt: string;
  label: string;
};

/**
 * Motion example card for /promo-rescue. Always shows the poster frame
 * immediately (no black box while loading) and falls back to a static
 * poster image if the clip fails to load for any reason.
 */
export function PromoMotionCard({ src, poster, alt, label }: Props) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="glass-card-strong overflow-hidden rounded-2xl border border-[rgba(201,164,76,0.16)] p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        {videoFailed ? (
          <Image
            src={poster}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <video
            src={src}
            poster={poster}
            aria-label={alt}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            onError={() => setVideoFailed(true)}
          />
        )}
      </div>
      <p className="px-2 py-2.5 text-center text-[12.5px] font-medium text-[#D8CFBE]">{label}</p>
    </div>
  );
}
