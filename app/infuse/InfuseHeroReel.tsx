"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { InfuseHeroClip } from "./infuse-media";

/**
 * Sequential hero video reel for /infuse. One curated clip plays at a time;
 * when it ends, the next clip in `clips` begins, wrapping back to the first
 * after the last — a showreel, not several videos crossfading while all
 * still playing underneath.
 *
 * Two <video> elements alternate the "active" role. On each transition the
 * incoming element starts playing and the outgoing element is paused
 * immediately (only ever one truly playing at a time); a short CSS opacity
 * transition crossfades between them so there's no flash of black.
 *
 * Preload strategy: only the active clip is actively buffered at full
 * preload; the single next clip in the sequence is preloaded into the idle
 * slot ahead of time so the transition never stalls, and clips further out
 * are not fetched until their turn comes.
 *
 * prefers-reduced-motion: no <video> is created — a static poster (the
 * first clip's first frame) is shown instead, matching the rest of the
 * site's motion treatment.
 *
 * A thin coral progress line (CSS keyframe animation, re-mounted via the
 * `uiIndex` React key) fills once per clip alongside the counter — a purely
 * decorative approximation of playback progress, not synced to exact clip
 * duration, and hidden entirely under prefers-reduced-motion.
 */
export function InfuseHeroReel({ clips }: { clips: InfuseHeroClip[] }) {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [uiIndex, setUiIndex] = useState(0);
  const [uiActive, setUiActive] = useState<0 | 1>(0);

  const ref0 = useRef<HTMLVideoElement | null>(null);
  const ref1 = useRef<HTMLVideoElement | null>(null);
  const idxRef = useRef(0);
  const activeRef = useRef<0 | 1>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Start clip 0 in slot A; buffer clip 1 into slot B ahead of time. Only
  // runs when motion is actually allowed, so a reduced-motion visitor never
  // triggers a single video fetch.
  useEffect(() => {
    if (reducedMotion || clips.length === 0) return;
    // idxRef/activeRef/uiIndex/uiActive all already start at their slot-0
    // defaults (useRef(0) / useState(0)); nothing advances them until
    // handleEnded fires, which can't happen before this effect has run —
    // so there is nothing to reset here, only the actual side effect of
    // starting playback.
    const active = ref0.current;
    if (active) {
      active.src = clips[0].src;
      active.currentTime = 0;
      void active.play().catch(() => {});
    }
    if (clips.length > 1) {
      const idle = ref1.current;
      if (idle) {
        idle.src = clips[1].src;
        idle.load();
      }
    }
    // Intentionally only re-runs when reducedMotion changes — `clips` is a
    // static curated list for this page, not something that changes at runtime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  function handleEnded(slot: 0 | 1) {
    if (reducedMotion || clips.length === 0 || slot !== activeRef.current) return;

    if (clips.length === 1) {
      const only = slot === 0 ? ref0.current : ref1.current;
      if (only) {
        only.currentTime = 0;
        void only.play().catch(() => {});
      }
      return;
    }

    const nextIndex = (idxRef.current + 1) % clips.length;
    const idleSlot: 0 | 1 = slot === 0 ? 1 : 0;
    const incoming = idleSlot === 0 ? ref0.current : ref1.current;
    const outgoing = slot === 0 ? ref0.current : ref1.current;

    if (incoming) {
      incoming.currentTime = 0;
      void incoming.play().catch(() => {});
    }
    if (outgoing) outgoing.pause();

    idxRef.current = nextIndex;
    activeRef.current = idleSlot;
    setUiIndex(nextIndex);
    setUiActive(idleSlot);

    // Pre-buffer the clip after next into the slot that just went idle, so
    // the *following* transition is just as seamless.
    const afterNext = (nextIndex + 1) % clips.length;
    if (outgoing) {
      outgoing.src = clips[afterNext].src;
      outgoing.load();
    }
  }

  if (reducedMotion || clips.length === 0) {
    const poster = clips[0]?.poster;
    if (!poster) return null;
    return (
      <Image
        src={poster}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="infuse-hero-media"
      />
    );
  }

  return (
    <div className="infuse-hero-reel" role="img" aria-label="Hospitality showreel: food, beverage, dining, and hospitality environments">
      <video
        ref={ref0}
        className={`infuse-hero-media infuse-hero-reel-layer${uiActive === 0 ? " is-active" : ""}`}
        muted
        playsInline
        autoPlay
        preload="auto"
        poster={clips[0]?.poster}
        aria-hidden="true"
        onEnded={() => handleEnded(0)}
      />
      {clips.length > 1 && (
        <video
          ref={ref1}
          className={`infuse-hero-media infuse-hero-reel-layer${uiActive === 1 ? " is-active" : ""}`}
          muted
          playsInline
          preload="auto"
          poster={clips[1]?.poster}
          aria-hidden="true"
          onEnded={() => handleEnded(1)}
        />
      )}
      {clips.length > 1 && (
        <div className="infuse-hero-reel-indicator" aria-hidden="true">
          <span className="infuse-hero-reel-count">
            {String(uiIndex + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
          </span>
          <div className="infuse-hero-reel-progress">
            <div key={uiIndex} className="infuse-hero-reel-progress-fill" />
          </div>
        </div>
      )}
    </div>
  );
}
