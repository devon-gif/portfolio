"use client";

import { useEffect, useRef } from "react";

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

/**
 * The isolated hero hotel video (public/revstudio/media/revstudio-hotel-hero.mp4
 * — re-encoded from the original public/revstudio/media/Video Homepage.mp4:
 * audio stripped, faststart flagged, bitrate brought down from ~13.1 Mbps to
 * ~4.1 Mbps). Autoplay/muted/loop/playsInline with no controls, and no
 * audio track at all, so there's nothing to mute/toggle. The poster frame
 * covers both the "autoplay blocked" case and the first-paint frame.
 *
 * Respects prefers-reduced-motion and Save-Data by pausing right after
 * mount — kept as a post-mount effect (not a render-time branch) so the
 * server-rendered markup matches the client on first paint.
 */
export function RevstudioHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;

    if (reducedMotion || saveData) {
      video.pause();
      video.removeAttribute("autoplay");
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="rv-hero-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/revstudio/media/revstudio-hotel-hero-poster.jpg"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/revstudio/media/revstudio-hotel-hero.mp4" type="video/mp4" />
    </video>
  );
}
