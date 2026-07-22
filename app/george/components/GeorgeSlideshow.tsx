"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2 } from "lucide-react";

export type SlideshowItem = {
  key: string;
  src: string;
  title: string;
  description: string;
};

/**
 * The main content of the /george private preview: one large "stage" video
 * plus title, short description, a 1 / N counter, previous/next arrows, a
 * play/pause control, an optional fullscreen control, and a thumbnail strip.
 *
 * Only the active clip ever has a src set and only it ever plays -- switching
 * slides pauses/unloads the previous clip before loading the next one, so
 * multiple videos never play at once and idle clips never buffer. Thumbnails
 * use preload="metadata" only (no full video fetch) to keep the page light.
 *
 * Every clip renders at its own natural aspect ratio: the <video> element is
 * given no fixed width/height, only max-width/max-height, so the browser
 * sizes it from the file's own intrinsic dimensions the same way an <img>
 * would -- portrait clips stay tall, landscape clips stay wide, and nothing
 * is ever cropped or stretched to a single fixed box.
 */
export function GeorgeSlideshow({ items }: { items: SlideshowItem[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const active = items[index];

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % items.length) + items.length) % items.length);
    },
    [items.length]
  );
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  // Load (and, unless reduced motion is requested, play) whenever the active
  // slide changes. This is the single place a video src is ever assigned, so
  // only one clip is ever loaded or playing at a time.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Reset state asynchronously (rather than synchronously in the effect
    // body) to avoid cascading renders -- see react-hooks/set-state-in-effect.
    queueMicrotask(() => setFailed(false));

    el.pause();
    el.currentTime = 0;
    el.src = active.src;
    el.load();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced) {
      void el
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      queueMicrotask(() => setPlaying(false));
    }

    function handleError() {
      console.error(`[GeorgeSlideshow] video failed to load, src: ${active.src}`);
      setFailed(true);
    }
    el.addEventListener("error", handleError);
    return () => el.removeEventListener("error", handleError);
  }, [active.src]);

  // Keyboard support.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function handleFullscreen() {
    const el = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (!el) return;
    if (el.requestFullscreen) {
      void el.requestFullscreen().catch(() => {});
    } else if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  }

  return (
    <div className="gg-slideshow" role="region" aria-roledescription="carousel" aria-label="The George video concepts">
      <div className="gg-slideshow-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <button
          type="button"
          className="gg-slideshow-arrow gg-slideshow-arrow--prev"
          onClick={goPrev}
          aria-label="Previous video"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>

        {failed ? (
          <div className="gg-hero-stage-fallback" role="img" aria-label={`${active.title}, preview unavailable`}>
            Preview unavailable
          </div>
        ) : (
          <video ref={videoRef} className="gg-slideshow-video" muted loop playsInline aria-label={active.title} />
        )}

        <button
          type="button"
          className="gg-slideshow-arrow gg-slideshow-arrow--next"
          onClick={goNext}
          aria-label="Next video"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>

        <div className="gg-slideshow-stage-controls">
          <button
            type="button"
            className="gg-slideshow-iconbtn"
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
          >
            {playing ? <Pause size={14} strokeWidth={2} /> : <Play size={14} strokeWidth={2} />}
          </button>
          <button
            type="button"
            className="gg-slideshow-iconbtn"
            onClick={handleFullscreen}
            aria-label="Open fullscreen"
          >
            <Maximize2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="gg-slideshow-meta">
        <div>
          <p className="gg-slideshow-title">{active.title}</p>
          <p className="gg-slideshow-desc">{active.description}</p>
        </div>
        <p className="gg-slideshow-counter" aria-live="polite">
          {index + 1} / {items.length}
        </p>
      </div>

      <div className="gg-slideshow-thumbs">
        {items.map((item, i) => (
          <button
            key={item.key}
            type="button"
            className={`gg-slideshow-thumb${i === index ? " is-active" : ""}`}
            aria-current={i === index ? "true" : undefined}
            aria-label={`Show ${item.title}`}
            onClick={() => goTo(i)}
          >
            <video src={item.src} muted playsInline preload="metadata" aria-hidden="true" />
            <Play className="gg-slideshow-thumb-play" size={14} strokeWidth={2} aria-hidden="true" />
            <span className="gg-slideshow-thumb-label">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
