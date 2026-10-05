"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  /** H.264 MP4, plays in every current browser. */
  src: string;
  /** Optional VP9 WebM fallback for browsers without H.264 (some Chromium builds). */
  webm?: string;
  /** First frame of the video: shown while loading and for reduced motion. */
  poster: string;
  alt: string;
  objectPosition?: string;
};

/**
 * A silent, looping project video for a project card.
 *
 * Plays only while the card is on screen (paused otherwise, so it costs
 * nothing elsewhere on the page) and stays on the still poster for visitors
 * who prefer reduced motion.
 */
export default function ProjectVideo({ src, webm, poster, alt, objectPosition = "center" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      // Reduced motion: never start the video.
      queueMicrotask(() => setStill(true));
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const fit = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition } as const;

  if (still) {
    return <Image src={poster} alt={alt} fill sizes="(min-width: 1000px) 62vw, 94vw" style={{ objectFit: "cover", objectPosition }} />;
  }
  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      style={fit}
    >
      <source src={src} type='video/mp4; codecs="avc1.640028"' />
      {webm ? <source src={webm} type='video/webm; codecs="vp9"' /> : null}
    </video>
  );
}
