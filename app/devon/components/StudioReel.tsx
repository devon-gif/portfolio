"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./StudioReel.module.css";

/**
 * "Living studio reel": real Archer Design work floating on a dark light table.
 *
 * Motion model (desktop, fine pointer):
 *  - every card drifts on its own slow sine path (different periods per card)
 *  - the pointer adds a little parallax, scaled by each card's depth
 *  - hovering a card lifts it forward, slows its drift and straightens it
 *  - all of it runs through a per-card spring, so changes ease in with a bit of inertia
 *
 * Performance: transforms are written straight to the DOM from one
 * requestAnimationFrame loop (no React state per frame), the loop only runs
 * while the section is on screen, and videos play only while visible.
 * Reduced motion: no loop, videos stay on their poster frame.
 * Mobile: a simpler, static overlap of four pieces (see the CSS).
 */

type Piece = {
  id: string;
  label: string;
  alt: string;
  /** width / height of the artwork */
  aspect: number;
  /** desktop placement, percent of the stage */
  left: number;
  top: number;
  width: number;
  /** resting rotation in degrees */
  rot: number;
  /** parallax depth: 0 (far) to 1 (near) */
  depth: number;
  z: number;
  image?: string;
  /** Video loop. `marker` shows the small lime motion dot (skip it where another card covers the corner). */
  video?: { mp4: string; webm: string; poster: string; marker?: boolean };
  objectPosition?: string;
  /** mobile placement (percent); omit to hide the piece on small screens */
  m?: { left: number; top: number; width: number; rot: number };
};

const PIECES: Piece[] = [
  {
    id: "room",
    label: "Hotel motion · AI-assisted",
    alt: "Hotel room timelapse moving from daylight to sunset to night",
    aspect: 16 / 9,
    left: 18,
    top: 14,
    width: 60,
    rot: -1.2,
    depth: 0.3,
    z: 2,
    video: {
      mp4: "/devon/studio/studio-room-timelapse.mp4",
      webm: "/devon/studio/studio-room-timelapse.webm",
      poster: "/devon/studio/studio-room-timelapse-poster.jpg",
      marker: false,
    },
    m: { left: 0, top: 0, width: 72, rot: -2 },
  },
  {
    id: "comfy",
    label: "Hotel campaign · Hotel Indigo Pittsburgh",
    alt: "Hotel Indigo Pittsburgh 'Comfy Yet?' room campaign graphic",
    aspect: 1080 / 1350,
    left: 75,
    top: 1,
    width: 25,
    rot: 5,
    depth: 0.8,
    z: 5,
    image: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png",
    m: { left: 61, top: 5, width: 38, rot: 4 },
  },
  {
    id: "billboard",
    label: "Out-of-home · Eliza Hot Metal Bistro",
    alt: "Eliza Hot Metal Bistro holiday billboard",
    aspect: 1784 / 1616,
    left: 1,
    top: 3,
    width: 30,
    rot: -5,
    depth: 0.55,
    z: 3,
    image: "/tcrm/images/eliza-hot-metal-bistro-holiday-billboard.png",
  },
  {
    id: "web",
    label: "Web experience · CR-91 Park Plaza",
    alt: "CR-91 Park Plaza project website shown on a desktop monitor",
    aspect: 1448 / 1086,
    left: 0,
    top: 60,
    width: 41,
    rot: -2.5,
    depth: 0.65,
    z: 4,
    image: "/devon/investor/cr91-project-website-system.png",
    m: { left: 3, top: 47, width: 56, rot: -3 },
  },
  {
    id: "pancakes",
    label: "F&B motion",
    alt: "Chocolate sauce slowly poured over blueberry pancakes",
    aspect: 3 / 4,
    left: 46,
    top: 51,
    width: 20,
    rot: -2,
    depth: 1,
    z: 6,
    video: {
      mp4: "/devon/studio/studio-pancake-pour.mp4",
      webm: "/devon/studio/studio-pancake-pour.webm",
      poster: "/devon/studio/studio-pancake-pour-poster.jpg",
    },
    m: { left: 61, top: 49, width: 35, rot: 3 },
  },
  {
    id: "deck",
    label: "Investor deck · CR-91 Park Plaza",
    alt: "CR-91 Park Plaza investor pitch deck pages and laptop",
    aspect: 1448 / 1086,
    left: 62,
    top: 64,
    width: 37,
    rot: 3.5,
    depth: 0.45,
    z: 3,
    image: "/devon/investor/cr91-pitch-deck-updates.png",
  },
];

type Spring = { x: number; y: number; r: number; s: number; vx: number; vy: number; vr: number; vs: number };

export default function StudioReel() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const movers = cards.map((c) => c.querySelector<HTMLElement>("[data-mover]")!);
    const videos = Array.from(stage.querySelectorAll<HTMLVideoElement>("video"));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const full = window.matchMedia("(min-width: 761px) and (pointer: fine)");

    // Videos: play only while the reel is on screen, never for reduced motion.
    let visible = false;
    const syncVideos = () => {
      for (const v of videos) {
        if (visible && !reduced.matches) v.play().catch(() => {});
        else v.pause();
      }
    };

    // Per-card motion parameters, fixed per card so each drifts at its own pace.
    const params = PIECES.map((p, i) => ({
      base: p.rot,
      depth: p.depth,
      ax: 5 + p.depth * 4,
      ay: 4 + p.depth * 4,
      ar: 0.35 + p.depth * 0.25,
      wx: (2 * Math.PI) / (13 + i * 2.3),
      wy: (2 * Math.PI) / (17 + i * 1.7),
      wr: (2 * Math.PI) / (19 + i * 2.9),
      px: i * 1.7,
      py: i * 2.9 + 1,
      pr: i * 0.8 + 2,
    }));
    const springs: Spring[] = PIECES.map((p) => ({ x: 0, y: 0, r: p.rot, s: 1, vx: 0, vy: 0, vr: 0, vs: 0 }));

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let hovered = -1;
    let raf = 0;
    let last = 0;
    const t0 = performance.now();

    const write = (i: number, sp: Spring) => {
      movers[i].style.transform = `translate3d(${sp.x.toFixed(2)}px, ${sp.y.toFixed(2)}px, 0) rotate(${sp.r.toFixed(3)}deg) scale(${sp.s.toFixed(4)})`;
    };

    // Rest pose (used for reduced motion and before the loop starts).
    const rest = () => springs.forEach((sp, i) => { sp.x = sp.y = 0; sp.r = params[i].base; sp.s = 1; write(i, sp); });

    const K = 70; // spring stiffness
    const C = 2 * Math.sqrt(K) * 0.8; // slightly under-damped: a little inertia, no wobble
    const step = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 1 / 30);
      last = now;
      const t = (now - t0) / 1000;

      // Ease the pointer itself so parallax never snaps.
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4);

      for (let i = 0; i < springs.length; i++) {
        const p = params[i];
        const sp = springs[i];
        const isHover = i === hovered;
        const drift = isHover ? 0.25 : 1;
        const tx = drift * p.ax * Math.sin(t * p.wx + p.px) + pointer.x * p.depth * 16;
        const ty = drift * p.ay * Math.sin(t * p.wy + p.py) + pointer.y * p.depth * 11 + (isHover ? -6 : 0);
        const tr = (isHover ? p.base * 0.3 : p.base) + drift * p.ar * Math.sin(t * p.wr + p.pr);
        const ts = isHover ? 1.045 : hovered >= 0 ? 0.992 : 1;

        sp.vx += (K * (tx - sp.x) - C * sp.vx) * dt;
        sp.vy += (K * (ty - sp.y) - C * sp.vy) * dt;
        sp.vr += (K * (tr - sp.r) - C * sp.vr) * dt;
        sp.vs += (K * (ts - sp.s) - C * sp.vs) * dt;
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.r += sp.vr * dt;
        sp.s += sp.vs * dt;
        write(i, sp);
      }
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (raf || reduced.matches || !full.matches) return;
      last = 0;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncVideos();
        if (visible) start();
        else stop();
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(stage);

    // Pointer parallax across the whole studio section, not just the reel.
    const area = stage.closest("section") ?? stage;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      pointer.tx = Math.max(-1, Math.min(1, ((e.clientX - (r.left + r.width / 2)) / r.width) * 2));
      pointer.ty = Math.max(-1, Math.min(1, ((e.clientY - (r.top + r.height / 2)) / r.height) * 2));
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };
    area.addEventListener("pointermove", onMove as EventListener);
    area.addEventListener("pointerleave", onLeave);

    const enter = cards.map((card, i) => () => {
      hovered = i;
      card.dataset.hover = "true";
    });
    const leave = cards.map((card, i) => () => {
      if (hovered === i) hovered = -1;
      delete card.dataset.hover;
    });
    cards.forEach((c, i) => {
      c.addEventListener("pointerenter", enter[i]);
      c.addEventListener("pointerleave", leave[i]);
    });

    const onPref = () => {
      stop();
      rest();
      syncVideos();
      if (visible) start();
    };
    reduced.addEventListener("change", onPref);
    full.addEventListener("change", onPref);
    rest();

    return () => {
      stop();
      io.disconnect();
      area.removeEventListener("pointermove", onMove as EventListener);
      area.removeEventListener("pointerleave", onLeave);
      cards.forEach((c, i) => {
        c.removeEventListener("pointerenter", enter[i]);
        c.removeEventListener("pointerleave", leave[i]);
      });
      reduced.removeEventListener("change", onPref);
      full.removeEventListener("change", onPref);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage} aria-label="Selected Archer Design work">
      {PIECES.map((p) => (
        <figure
          key={p.id}
          data-card
          className={styles.card}
          data-mobile={p.m ? undefined : "hide"}
          style={
            {
              "--l": `${p.left}%`,
              "--t": `${p.top}%`,
              "--w": `${p.width}%`,
              "--ml": p.m ? `${p.m.left}%` : undefined,
              "--mt": p.m ? `${p.m.top}%` : undefined,
              "--mw": p.m ? `${p.m.width}%` : undefined,
              "--mr": p.m ? `${p.m.rot}deg` : undefined,
              zIndex: p.z,
            } as React.CSSProperties
          }
        >
          <div className={styles.mover} data-mover style={{ transform: `rotate(${p.rot}deg)` }}>
            <div className={styles.art} style={{ aspectRatio: String(p.aspect) }} data-kind={p.video ? "video" : "image"}>
              {p.video ? (
                <>
                  <video muted loop playsInline preload="metadata" poster={p.video.poster} aria-label={p.alt}>
                    <source src={p.video.mp4} type='video/mp4; codecs="avc1.640028"' />
                    <source src={p.video.webm} type='video/webm; codecs="vp9"' />
                  </video>
                  {p.video.marker !== false ? <span className={styles.live} aria-hidden="true" /> : null}
                </>
              ) : (
                <Image
                  src={p.image!}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1000px) 22vw, 50vw"
                  style={{ objectFit: "cover", objectPosition: p.objectPosition ?? "center" }}
                />
              )}
            </div>
            <figcaption className={styles.label}>{p.label}</figcaption>
          </div>
        </figure>
      ))}
    </div>
  );
}
