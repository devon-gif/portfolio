"use client";

import { useEffect, useRef } from "react";
import { HeroFieldEngine } from "./hero-field/engine";

/**
 * Living color field behind the /devon hero.
 *
 * Mounts a canvas that fills its positioned parent and hands it to a
 * standalone WebGL2 engine. React renders this once; all animation and
 * pointer tracking happen inside the engine, so moving the mouse never
 * re-renders anything. If WebGL2 is unavailable the canvas stays hidden and
 * the hero's static CSS gradient shows instead.
 */
export function HeroColorField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = new HeroFieldEngine(canvas, host, {
      reducedMotion,
      onReady: () => {
        canvas.dataset.state = "ready";
      },
    });

    if (!engine.start()) {
      canvas.dataset.state = "unsupported";
      engine.dispose();
      return;
    }
    if (process.env.NODE_ENV === "development") {
      // Exposed for local visual testing only (see engine.debugRun).
      (canvas as HTMLCanvasElement & { __heroField?: HeroFieldEngine }).__heroField = engine;
    }
    return () => engine.dispose();
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" data-state="idle" />;
}
