"use client";

import { useEffect, useRef, useState } from "react";
import AuraTeaser from "./AuraTeaser";

const AURA_ORIGIN = "https://aura.archerdesign.shop";
const AURA_EMBED = AURA_ORIGIN + "/embed";

/**
 * Live, moving AURA preview with a safe fallback.
 * AURA's /embed route sends { type: "aura:embed-ready" } from AURA_ORIGIN
 * after its headphone scene is fully rendered. The preview only becomes visible after the animation sends its ready signal. Cross-origin iframe onLoad
 * alone is not sufficient because an unavailable domain can also fire onLoad.
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
      if (event.origin !== AURA_ORIGIN) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === "aura:embed-ready") setReady(true);
    };
    window.addEventListener("message", onMessage);

    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <div ref={rootRef} style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#111a20" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: ready ? 0 : 1,
          transition: "opacity 450ms ease",
          pointerEvents: "none",
        }}
      >
        <AuraTeaser />
      </div>
      {near && (
        <iframe
          ref={frameRef}
          src={AURA_EMBED}
          title="AURA ONE live animated headphone preview"
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          allow="autoplay"
          sandbox="allow-scripts allow-same-origin"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            background: "transparent",
            opacity: ready ? 1 : 0,
            transition: "opacity 450ms ease",
            pointerEvents: "none",
          }}
        />
      )}
      <a
        href={ready ? AURA_ORIGIN : "/devon/aura-one"}
        target={ready ? "_blank" : undefined}
        rel={ready ? "noreferrer" : undefined}
        aria-label={ready ? "Open the live AURA ONE website" : "View the AURA ONE case study"}
        style={{ position: "absolute", inset: 0, zIndex: 3, cursor: "pointer" }}
      />
      {ready && (
        <span
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            zIndex: 2,
            color: "#f7f8f8",
            background: "rgba(0,0,0,.55)",
            borderRadius: 999,
            padding: "7px 12px",
            font: "600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
            textTransform: "uppercase",
            pointerEvents: "none",
            letterSpacing: ".1em",
          }}
        >
          ● Live animated preview
        </span>
      )}
    </div>
  );
}
