"use client";

import { SEEDANCE_BG } from "./media";

/**
 * Ambient Seedance 2.0 loop fixed behind the entire marketing page.
 * Muted, looping, playsInline. A dark gradient overlay keeps text readable.
 */
export function SeedanceBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]" aria-hidden="true">
      <video
        className="h-full w-full object-cover opacity-[0.42] brightness-[1.2] saturate-[1.18]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={SEEDANCE_BG} type="video/mp4" />
      </video>
      {/* Readability overlay: darken + warm vignette. */}
      <div className="absolute inset-0 bg-[#050505]/42" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(201,164,76,0.18), transparent 60%), linear-gradient(180deg, rgba(5,5,5,0.28), rgba(5,5,5,0.72))",
        }}
      />
    </div>
  );
}
