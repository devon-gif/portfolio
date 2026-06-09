"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A muted, looping, inline video that only loads + plays once it scrolls into
 * view, and pauses when it leaves. Keeps many background videos performant.
 * Pass `eager` for an above-the-fold video that should load immediately.
 * Pass `label` so failed URLs are identifiable in the browser console.
 */
export function LazyVideo({
  src,
  className = "",
  poster,
  eager = false,
  label,
}: {
  src: string;
  className?: string;
  poster?: string;
  eager?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const loaded = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleError(e: Event) {
      const tag = label ? `[${label}]` : "[LazyVideo]";
      console.error(`${tag} video failed to load — src: ${src}`, e);
      setFailed(true);
    }

    el.addEventListener("error", handleError);

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
    return () => {
      el.removeEventListener("error", handleError);
      io.disconnect();
    };
  }, [src, eager, label]);

  if (failed) {
    if (poster) {
      return (
        <img
          src={poster}
          alt={label ?? "Video preview"}
          className={className}
          style={{ objectFit: "cover" }}
        />
      );
    }
    return (
      <div
        className={`flex items-center justify-center bg-[#0e0c0a] text-[12px] text-[#A9A092] ${className}`}
        aria-label={label ? `${label} — preview unavailable` : "Video preview unavailable"}
      >
        <span className="px-4 text-center opacity-60">Video preview loading</span>
      </div>
    );
  }

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
