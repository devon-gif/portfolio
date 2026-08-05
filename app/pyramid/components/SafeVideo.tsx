"use client";

import { useEffect, useRef, useState } from "react";

type LoadState = "pending" | "video" | "poster" | "fallback";

/**
 * Client-only, graceful-degradation video frame for the five custom Pyramid
 * motion studies. Deliberately contains no server-side file-existence check
 * (no node:fs, no fs.existsSync) — see pyramid-media.ts for why. Instead,
 * SafeVideo discovers whether a file exists purely through the browser's own
 * <video>/<img> error events, layered:
 *
 *   1. Try the video. Muted, looped, playsInline, lazy (IntersectionObserver
 *      gated), and reduced only when it scrolls into view.
 *   2. If the video fails to load, fall back to the static poster image.
 *   3. If the poster also fails (or prefers-reduced-motion is set and no
 *      poster is available), show a polished branded fallback panel instead
 *      of a broken box — so the page always looks finished, with or without
 *      the real media.
 *
 * Respects prefers-reduced-motion: when set, the video is never autoplayed;
 * the component goes straight to the static poster (or the fallback panel)
 * so nothing moves that the visitor didn't opt into.
 */
export function SafeVideo({
  videoSrc,
  posterSrc,
  alt,
  className = "",
  eager = false,
}: {
  videoSrc: string;
  posterSrc: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<LoadState>("pending");
  const [reducedMotion, setReducedMotion] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    // Reduced-motion visitors go straight to the static poster (or, if that
    // also fails, the fallback panel below) — no video element is ever set
    // to autoplay for them.
    if (reducedMotion) {
      setState((s) => (s === "pending" ? "poster" : s));
      return;
    }

    const frame = frameRef.current;
    if (!frame) return;

    if (eager) {
      setState("video");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            setState("video");
          }
          const v = videoRef.current;
          if (v && v.readyState > 0) {
            if (entry.isIntersecting) void v.play().catch(() => {});
            else v.pause();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [eager, reducedMotion]);

  // Explicitly kick off playback once the real <video> element mounts.
  // Below-fold clips use preload="none" to avoid loading all six videos at
  // once -- but that also means the browser never fires "canplay" on its
  // own, since preload="none" tells it not to start loading in the first
  // place. Calling play() directly forces the browser to start loading and
  // playing regardless of the preload hint, so lazy clips actually start
  // once they scroll into view instead of sitting frozen on their poster
  // frame forever.
  useEffect(() => {
    if (state !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {});
  }, [state]);

  return (
    <div ref={frameRef} className={`pyr-safevideo ${className}`}>
      {state === "video" && (
        <video
          ref={videoRef}
          className="pyr-safevideo-media"
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          autoPlay={eager}
          preload={eager ? "metadata" : "none"}
          aria-hidden="true"
          onError={() => setState("poster")}
          onCanPlay={(e) => {
            void (e.currentTarget as HTMLVideoElement).play().catch(() => {});
          }}
        />
      )}
      {state === "poster" && (
        // eslint-disable-next-line @next/next/no-img-element -- local static poster, no remote hotlinking, graceful client-side fallback
        <img
          className="pyr-safevideo-media"
          src={posterSrc}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={() => setState("fallback")}
        />
      )}
      {state === "pending" && <div className="pyr-safevideo-skeleton" aria-hidden="true" />}
      {state === "fallback" && (
        <div className="pyr-safevideo-fallback" role="img" aria-label={alt}>
          <span className="pyr-safevideo-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="pyr-safevideo-fallback-eyebrow">Custom Pyramid motion study</span>
          <span className="pyr-safevideo-fallback-note">Media ready to be added</span>
        </div>
      )}
    </div>
  );
}
