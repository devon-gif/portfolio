"use client";

import { useEffect, useState } from "react";
import { CTA_HREF, NAV_ITEMS } from "@/lib/coraltree-content";

/**
 * Sticky header for the private CoralTree × Archer Design proposal.
 * Custom identity treatment (not the standard Archer Design site nav) —
 * scrolls to in-page sections rather than linking elsewhere, since this
 * is a single, self-contained proposal page.
 */
export function CoralTreeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`ct-header${scrolled ? " ct-scrolled" : ""}`}>
      <a href="#top" className="ct-nav-brand" aria-label="CoralTree Hospitality x Archer Design, top of page">
        <span className="ct-nav-mark" aria-hidden="true">CT</span>
        <span className="ct-nav-wordmark">
          CoralTree × Archer Design
          <small>A private creative proposal</small>
        </span>
      </a>

      <button
        type="button"
        className="ct-nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="coraltree-mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>

      <nav
        id="coraltree-mobile-nav"
        aria-label="Page sections"
        className={`ct-nav-links${open ? " ct-open" : ""}`}
      >
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a
          href={CTA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="ct-nav-cta"
          onClick={() => setOpen(false)}
        >
          Explore a creative partnership
        </a>
      </nav>
    </header>
  );
}
