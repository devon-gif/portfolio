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
  onFailed,
}: {
  src: string;
  className?: string;
  poster?: string;
  eager?: boolean;
  label?: string;
  onFailed?: () => void;
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
      onFailed?.();
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
  }, [src, eager, label, onFailed]);

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
    // No poster to fall back to: show a quiet, in-UI "unavailable" state
    // rather than rendering nothing (which reads as a layout bug) or letting
    // the failed <video> linger (which is what was producing the disruptive
    // dev-mode overlays reported on /topline's motion library).
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.06)",
          color: "rgba(0,0,0,0.4)",
          fontSize: "11px",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          textAlign: "center",
          padding: "8px",
        }}
      >
        Preview unavailable
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
