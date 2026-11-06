"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Real product photography and motion from the independently deployed AURA ONE website.
 * Use the stable public Vercel production hostname until the branded subdomain has DNS.
 */
const AURA_ORIGIN = "https://aura-one-devon-gifs-projects.vercel.app";
const HERO_PATH = AURA_ORIGIN + "/video/hero/aura-hero-champagne";
const HERO_POSTER = HERO_PATH + "-poster.webp";

function chooseVideoSource(video: HTMLVideoElement) {
  const safari = /Apple/.test(navigator.vendor) && video.canPlayType('video/mp4; codecs="hvc1"') !== "";
  if (safari) return HERO_PATH + "-960-alpha.mov";
  if (video.canPlayType('video/webm; codecs="vp9"') !== "") return HERO_PATH + "-960.webm";
  return HERO_PATH + "-960.mp4";
}

export default function AuraLivePreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionDisabled = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (motionDisabled || saveData) return;

    video.src = chooseVideoSource(video);
    video.muted = true;
    let visible = false;
    const sync = () => {
      if (visible && document.visibilityState === "visible") {
        video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; sync(); },
      { rootMargin: "30% 0px", threshold: 0.01 },
    );
    observer.observe(video);
    video.addEventListener("canplay", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      video.pause();
      video.removeEventListener("canplay", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const productStyle = {
    position: "absolute", top: "-5%", left: "31%", width: "74%", height: "111%",
    objectFit: "contain", objectPosition: "center",
    filter: "drop-shadow(0 16px 40px rgba(0,0,0,.22))",
  } as const;

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      background: "radial-gradient(90% 85% at 60% 45%, #34353c, #1f2025 47%, #0b0b0d)",
    }}>
      {/* First frame and reduced-motion fallback: actual Blender Cycles hero render. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- production asset from separate AURA deployment */}
      <img src={HERO_POSTER}
        alt="Photorealistic Champagne AURA ONE headphones from the live product experience"
        loading="lazy" decoding="async"
        style={{ ...productStyle, opacity: playing ? 0 : 1 }}
      />
      <video
        ref={videoRef}
        muted loop playsInline preload="none"
        disablePictureInPicture aria-hidden="true" tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        onError={() => setPlaying(false)}
        style={{ ...productStyle, opacity: playing ? 1 : 0, transition: "opacity .25s ease", pointerEvents: "none" }}
      />

      <div aria-hidden="true" style={{
        position: "absolute", zIndex: 2, top: "9%", left: "7%", width: "42%",
        pointerEvents: "none", color: "#f4f1ed",
        textShadow: "0 2px 20px rgba(0,0,0,.28)",
      }}>
        <span style={{
          display: "block", fontSize: "clamp(9px,1vw,13px)", fontWeight: 600,
          letterSpacing: ".34em", marginBottom: "clamp(20px,5vw,70px)",
        }}>AURA ONE</span>
        <strong style={{
          display: "block", fontWeight: 400, letterSpacing: "-.052em",
          fontSize: "clamp(23px,3.7vw,60px)", lineHeight: 1.03,
        }}>Hear more.<br />Feel everything.</strong>
        <span style={{
          display: "block", marginTop: 14, fontSize: "clamp(9px,.85vw,12px)",
          letterSpacing: ".11em", textTransform: "uppercase", opacity: .65,
        }}>Interactive 3D / Blender / Next.js</span>
      </div>

      <a href={AURA_ORIGIN} target="_blank" rel="noreferrer"
        aria-label="Open the live AURA ONE headphone website"
        style={{ position: "absolute", inset: 0, zIndex: 3, cursor: "pointer" }}
      />
      <span style={{
        position: "absolute", zIndex: 2, bottom: 16, left: 22,
        color: "#f7f8f8", background: "rgba(0,0,0,.42)", borderRadius: 999,
        padding: "7px 12px", font: "600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
        letterSpacing: ".1em", textTransform: "uppercase", pointerEvents: "none",
      }}>{playing ? "● Live motion" : "● AURA ONE live project"}</span>
    </div>
  );
}
