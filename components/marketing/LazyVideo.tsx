"use client";

import { useEffect, useRef } from "react";

/**
 * A muted, looping, inline video that only loads + plays once it scrolls into
 * view, and pauses when it leaves. Keeps many background videos performant.
 * Pass `eager` for an above-the-fold video that should load immediately.
 */
export function LazyVideo({
  src,
  className = "",
  poster,
  eager = false,
}: {
  src: string;
  className?: string;
  poster?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Eager videos load right away.
    if (eager && !loaded.current) {
      el.src = src;
      loaded.current = true;
      void el.play().catch(() => {});
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (!loaded.current) {
              video.src = src;
              loaded.current = true;
            }
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [src, eager]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      poster={poster}
      aria-hidden="true"
    />
  );
}
