"use client";

import { useEffect, useRef, useState } from "react";

type LoadState = "pending" | "video" | "poster" | "fallback";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Client-only, graceful-degradation motion frame for /rebel. Same layered
 * fallback idea as app/pyramid/components/SafeVideo.tsx (video -> poster
 * -> branded fallback, muted/looped/playsInline, lazy via
 * IntersectionObserver unless `eager`), but restructured so every setState
 * call sits either in a lazy useState initializer (synchronous, no effect
 * involved) or inside a nested event/observer callback -- never directly
 * in an effect body -- per React's "you might not need an effect"
 * guidance.
 *
 *   1. Try the video: muted, looped, playsInline, preload="metadata" so
 *      nothing downloads until it's actually needed.
 *   2. If the video errors, fall back to the poster image (when one exists).
 *   3. If there's no poster (or it also fails), or the visitor has
 *      prefers-reduced-motion set, show a quiet branded panel instead of a
 *      broken box or an ugly "coming soon" placeholder.
 *
 * `posterSrc` is optional -- the reused generic Archer /tcrm clips this
 * page falls back to don't each have a dedicated poster on disk.
 *
 * Reserves aspect-ratio via the wrapping .rb-motion-frame CSS class (see
 * rebel.css) so nothing shifts layout while media loads.
 */
export function RebelMotion({
  videoSrc,
  posterSrc,
  alt,
  caption,
  className = "",
  eager = false,
}: {
  videoSrc: string;
  posterSrc?: string;
  alt: string;
  caption?: string;
  className?: string;
  eager?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Read prefers-reduced-motion synchronously via a lazy initializer, so
  // the very first render already reflects it -- no flash of autoplaying
  // video for reduced-motion visitors.
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [state, setState] = useState<LoadState>(() => {
    if (!videoSrc) return "fallback";
    if (reducedMotion) return posterSrc ? "poster" : "fallback";
    return eager ? "video" : "pending";
  });
  const started = useRef(false);

  // Keeps reduced-motion live if the OS-level setting changes mid-session.
  // Both setState calls below live inside the "change" event callback, not
  // the effect body itself, so nothing here runs synchronously as a direct
  // result of the effect executing.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      const reduced = mq.matches;
      setReducedMotion(reduced);
      setState((prev) => {
        if (!videoSrc) return "fallback";
        if (reduced) return posterSrc ? "poster" : "fallback";
        // Switching back to motion-allowed: resume playback unless we're
        // already sitting on a real error state (no video to resume to).
        return prev === "poster" || prev === "pending" || prev === "fallback" ? (eager ? "video" : "pending") : prev;
      });
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [videoSrc, posterSrc, eager]);

  useEffect(() => {
    if (!videoSrc || reducedMotion || eager) return;

    const frame = frameRef.current;
    if (!frame) return;

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
  }, [videoSrc, eager, reducedMotion]);

  useEffect(() => {
    if (state !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {});
  }, [state]);

  return (
    <div ref={frameRef} className={`rb-motion-frame ${className}`}>
      {state === "video" && (
        <video
          ref={videoRef}
          className="rb-motion-media"
          src={videoSrc}
          poster={posterSrc || undefined}
          muted
          loop
          playsInline
          autoPlay={eager}
          preload={eager ? "metadata" : "none"}
          aria-hidden="true"
          onError={() => setState(posterSrc ? "poster" : "fallback")}
          onCanPlay={(e) => {
            void (e.currentTarget as HTMLVideoElement).play().catch(() => {});
          }}
        />
      )}
      {state === "poster" && posterSrc && (
        // eslint-disable-next-line @next/next/no-img-element -- local static poster, graceful client-side fallback
        <img
          className="rb-motion-media"
          src={posterSrc}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={() => setState("fallback")}
        />
      )}
      {state === "pending" && <div className="rb-motion-skeleton" aria-hidden="true" />}
      {state === "fallback" && (
        <div className="rb-motion-fallback" role="img" aria-label={alt}>
          <span className="rb-motion-fallback-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="rb-motion-fallback-eyebrow">Archer Design</span>
          {caption ? <span className="rb-motion-fallback-caption">{caption}</span> : null}
        </div>
      )}
      {caption && state === "video" ? <span className="rb-motion-caption">{caption}</span> : null}
    </div>
  );
}
