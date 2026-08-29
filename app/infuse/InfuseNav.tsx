"use client";

import { useState } from "react";
import { CALENDLY_URL } from "./infuse-content";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#approach", label: "Approach" },
  { href: "#pricing", label: "Pricing" },
] as const;

/**
 * Infuse-page-only floating glass-pill nav, rendered INSIDE the hero frame
 * near the top (see infuse.css .infuse-nav* — .infuse-nav-wrap is absolutely
 * positioned within .infuse-hero, not page-sticky) — scoped entirely to
 * /infuse and rendered only inside InfuseShowcase. Does NOT replace or touch
 * the global Archer site nav in components/AppChrome.tsx.
 */
export function InfuseNav() {
  const [open, setOpen] = useState(false);

  function handleLinkClick() {
    setOpen(false);
  }

  return (
    <div className="infuse-nav-wrap">
      <nav className="infuse-nav" aria-label="Infuse proposal">
        <a href="#top" className="infuse-nav-lockup">
          <span className="infuse-nav-mark infuse-serif">Archer</span>
          <span className="infuse-nav-for">For Infuse</span>
        </a>

        <div className={`infuse-nav-links${open ? " is-open" : ""}`}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="infuse-nav-link" onClick={handleLinkClick}>
              {link.label}
            </a>
          ))}
          <a
            className="infuse-nav-cta"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
          >
            Book a quick intro
          </a>
        </div>

        <button
          type="button"
          className="infuse-nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>
    </div>
  );
}
