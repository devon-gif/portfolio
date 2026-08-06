"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's single visual anchor: a 3D glass ring (public/revstudio/objects/
 * circle.png) inside a soft-glow glass frame, with a restrained scroll-linked
 * float + tilt. Deliberately the only object in the hero — no extra 3D
 * elements per the brief.
 *
 * The glow layer runs a slow CSS keyframe pulse (always on, cheap). The ring
 * image itself gets a scroll-position-driven transform applied directly via
 * a ref (rAF-throttled, not React state) so scrolling never triggers a
 * re-render. `prefers-reduced-motion` disables both the pulse and the scroll
 * transform, leaving the ring static.
 */
export function RevstudioHeroRing() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wrap = wrapRef.current;
        const img = imgRef.current;
        if (!wrap || !img) return;
        const rect = wrap.getBoundingClientRect();
        const viewportH = window.innerHeight || 1;
        // -1..1 as the frame's center passes through the viewport center.
        const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
        const clamped = Math.max(-1, Math.min(1, progress));
        const translateY = clamped * -26;
        const rotate = clamped * -3;
        img.style.transform = `translate3d(0, ${translateY}px, 0) rotate(${rotate}deg)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className="rv-hero-ring-frame">
      <span className="rv-hero-ring-glow" aria-hidden="true" />
      <span className="rv-hero-corner rv-hero-corner-tl" aria-hidden="true" />
      <span className="rv-hero-corner rv-hero-corner-br" aria-hidden="true" />
      {/* Plain <img>, not next/image — a fixed absolute local path
          ("/revstudio/objects/circle.png", never a relative "./" path) to
          the real 3000x3000 transparent PNG at
          public/revstudio/objects/circle.png. width/height are set as real
          HTML attributes (not just CSS) so the browser reserves the box
          before the image loads; CSS below still controls the final
          rendered size via max-width/height:auto. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/revstudio/objects/circle.png"
        alt="A three-dimensional glass ring, The Revstudio's signature visual mark"
        width={1200}
        height={1200}
        className="rv-hero-ring-image"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}
