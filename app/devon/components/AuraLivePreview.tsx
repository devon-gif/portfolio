"use client";

import { useEffect, useRef, useState } from "react";

const AURA_ORIGIN = "https://aura-one-devon-gifs-projects.vercel.app";
const AURA_EMBED = AURA_ORIGIN + "/embed";
const HERO_POSTER = AURA_ORIGIN + "/video/hero/aura-hero-champagne-poster.webp";

/**
 * Real AURA ONE Blender hero art and looping /embed preview.
 * The custom AURA subdomain can replace AURA_ORIGIN once external DNS is configured.
 * The public Vercel production hostname is intentionally used in the meantime.
 */
export default function AuraLivePreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reducedMotion || saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (!entry.isIntersecting) setReady(false);
      },
      { rootMargin: "45% 0px" },
    );
    observer.observe(root);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== AURA_ORIGIN || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === "aura:embed-ready") setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <div ref={rootRef} style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#101115" }}>
      {/* Actual first frame of the production Blender hero, not the old illustrated placeholder. */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(90% 85% at 60% 45%, #34353c, #1f2025 47%, #0b0b0d)",
        opacity: ready ? 0 : 1,
        transition: "opacity 550ms ease",
        pointerEvents: "none",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote origin serves real Blender hero poster directly */}
        <img
          src={HERO_POSTER}
          alt="AURA ONE Champagne headphones, a real Blender product render from the live website"
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute", top: "-5%", left: "31%",
            width: "74%", height: "111%", objectFit: "contain", objectPosition: "center",
            filter: "drop-shadow(0 16px 40px rgba(0,0,0,.22))",
          }}
        />
      </div>

      {near && (
        <iframe
          ref={frameRef}
          src={AURA_EMBED}
          title="AURA ONE live animated Blender headphone hero"
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          allow="autoplay"
          sandbox="allow-scripts allow-same-origin"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            border: 0, background: "transparent", opacity: ready ? 1 : 0,
            transition: "opacity 550ms ease", pointerEvents: "none",
          }}
        />
      )}

      <div aria-hidden="true" style={{
        position: "absolute", zIndex: 2, top: "9%", left: "7%", width: "42%",
        pointerEvents: "none", color: "#f4f1ed",
        textShadow: "0 2px 20px rgba(0,0,0,.28)",
      }}>
        <span style={{
          display: "block", fontSize: "clamp(9px,1vw,13px)",
          letterSpacing: ".34em", fontWeight: 600, marginBottom: "clamp(20px,5vw,70px)",
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

      <a
        href={AURA_ORIGIN}
        target="_blank"
        rel="noreferrer"
        aria-label="Open the live AURA ONE headphone website"
        style={{ position: "absolute", inset: 0, zIndex: 3, cursor: "pointer" }}
      />
      <span style={{
        position: "absolute", zIndex: 2, bottom: 16, left: 22,
        color: "#f7f8f8", background: "rgba(0,0,0,.42)", borderRadius: 999,
        padding: "7px 12px", font: "600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
        letterSpacing: ".1em", textTransform: "uppercase", pointerEvents: "none",
      }}>{ready ? "● Live motion" : "● AURA ONE live project"}</span>
    </div>
  );
}
