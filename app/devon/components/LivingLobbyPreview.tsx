"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  seed: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

export default function LivingLobbyPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let particles: Particle[] = [];
    let targets: Array<{ x: number; y: number }> = [];
    const pointer = { x: 0, y: 0, active: false };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function buildTargets(w: number, h: number) {
      const sample = document.createElement("canvas");
      sample.width = Math.max(640, Math.round(w));
      sample.height = Math.max(180, Math.round(h * 0.45));
      const sctx = sample.getContext("2d");
      if (!sctx) return [];

      sctx.clearRect(0, 0, sample.width, sample.height);
      sctx.fillStyle = "#fff";
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      sctx.font = `800 ${Math.max(72, Math.round(sample.width * 0.15))}px Arial, sans-serif`;
      sctx.fillText("ARCHER", sample.width / 2, sample.height / 2);

      const image = sctx.getImageData(0, 0, sample.width, sample.height).data;
      const points: Array<{ x: number; y: number }> = [];
      const step = Math.max(5, Math.round(sample.width / 145));

      for (let y = 0; y < sample.height; y += step) {
        for (let x = 0; x < sample.width; x += step) {
          const alpha = image[(y * sample.width + x) * 4 + 3];
          if (alpha > 80) {
            points.push({
              x: (x / sample.width) * w,
              y: h * 0.31 + (y / sample.height) * h * 0.38,
            });
          }
        }
      }

      return points;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      targets = buildTargets(width, height);
      const count = Math.min(520, Math.max(240, Math.round(width * 0.62)));

      particles = Array.from({ length: count }, (_, index) => {
        const target = targets[index % Math.max(1, targets.length)] ?? {
          x: width / 2,
          y: height / 2,
        };
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          tx: target.x,
          ty: target.y,
          seed: Math.random() * Math.PI * 2,
        };
      });
    }

    function pointerMove(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    }

    function pointerLeave() {
      pointer.active = false;
    }

    function draw(timeMs: number) {
      const t = timeMs / 1000;
      const cycle = t % 18;
      const gather = smoothstep(5.5, 8.0, cycle) * (1 - smoothstep(12.4, 15.2, cycle));

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#05070a");
      gradient.addColorStop(0.5, "#0b1019");
      gradient.addColorStop(1, "#101416");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(
        width * 0.72,
        height * 0.24,
        0,
        width * 0.72,
        height * 0.24,
        width * 0.62
      );
      glow.addColorStop(0, "rgba(197,255,87,.11)");
      glow.addColorStop(0.45, "rgba(89,190,255,.05)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const targetAlpha = 0.6 + gather * 0.4;

      particles.forEach((particle, index) => {
        const flowX = Math.sin(t * 0.32 + particle.seed + particle.y * 0.009) * 0.018;
        const flowY = Math.cos(t * 0.27 + particle.seed + particle.x * 0.008) * 0.014;

        particle.vx += flowX;
        particle.vy += flowY;

        if (gather > 0.01) {
          particle.vx += (particle.tx - particle.x) * 0.0019 * gather;
          particle.vy += (particle.ty - particle.y) * 0.0019 * gather;
        }

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 135;
          if (dist2 < radius * radius && dist2 > 4) {
            const distance = Math.sqrt(dist2);
            const force = (1 - distance / radius) * 0.34;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        particle.vx *= gather > 0.55 ? 0.91 : 0.982;
        particle.vy *= gather > 0.55 ? 0.91 : 0.982;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (gather < 0.15) {
          if (particle.x < -10) particle.x = width + 10;
          if (particle.x > width + 10) particle.x = -10;
          if (particle.y < -10) particle.y = height + 10;
          if (particle.y > height + 10) particle.y = -10;
        }

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + particle.seed);
        const size = 0.8 + pulse * 1.05 + gather * 0.45;
        const accent = index % 7 === 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = accent
          ? `rgba(212,255,104,${0.22 + targetAlpha * 0.46})`
          : `rgba(224,236,242,${0.12 + targetAlpha * 0.36})`;
        ctx.fill();
      });

      ctx.strokeStyle = "rgba(255,255,255,.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - 46);
      ctx.lineTo(width, height - 46);
      ctx.stroke();

      if (!reduced) frame = requestAnimationFrame(draw);
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerleave", pointerLeave);

    if (reduced) draw(8500);
    else frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerleave", pointerLeave);
    };
  }, []);

  return (
    <div className="db-lobby-preview">
      <canvas ref={canvasRef} aria-label="Interactive particle preview for Living Lobby" />
      <div className="db-lobby-preview-top">
        <span>LIVE SYSTEM PREVIEW</span>
        <span>POINTER / PARTICLE INPUT</span>
      </div>
      <div className="db-lobby-preview-bottom">
        <span>LIGHTWEIGHT PORTFOLIO MODE</span>
        <span>FULL BUILD: THREE.JS + GLSL + LIVE WEATHER</span>
      </div>
    </div>
  );
}
