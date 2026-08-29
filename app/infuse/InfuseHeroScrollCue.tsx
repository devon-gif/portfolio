"use client";

/**
 * Small "Scroll to explore" control at the lower-right of the hero. Purely a
 * smooth-scroll convenience to the next section — respects
 * prefers-reduced-motion by jumping instantly instead of animating the
 * scroll, and degrades to a plain in-page anchor link if JS never runs.
 */
export function InfuseHeroScrollCue({ targetId }: { targetId: string }) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <a href={`#${targetId}`} className="infuse-hero-scrollcue" onClick={handleClick}>
      <span>Scroll to explore</span>
      <span className="infuse-hero-scrollcue-line" aria-hidden="true" />
      <span className="infuse-hero-scrollcue-arrow" aria-hidden="true">
        &darr;
      </span>
    </a>
  );
}
