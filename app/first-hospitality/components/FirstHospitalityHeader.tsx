"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PILOT_MAILTO } from "../first-hospitality-content";

const NAV = [
  { href: "#opportunity", label: "The Opportunity" },
  { href: "#custom-work", label: "Custom Work" },
  { href: "#partnership", label: "Partnership" },
  { href: "#archer-work", label: "Archer Work" },
  { href: "#proof", label: "Proof" },
  { href: "#pilot", label: "Pilot" },
];

/**
 * Restrained sticky header for the /first-hospitality private partnership
 * concept, modeled on app/oxford/components/OxfordHeader.tsx's structure
 * (fixed, glass-on-scroll, scroll progress bar) with a First-Hospitality-only
 * accent. Never added to the main site's public navigation -- direct URL
 * only, matching every other private proposal microsite in this project.
 */
export function FirstHospitalityHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        const el = barRef.current;
        if (!el) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        el.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className={`fh-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="fh-shell flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 shrink-0 flex-col gap-1.5">
          <a href="#top" className="fh-logo-group" aria-label="First Hospitality times Archer Design, top of page">
            <span className="fh-logo-word">First Hospitality</span>
            <span className="fh-logo-x" aria-hidden="true">&times;</span>
            <span className="fh-logo-word fh-logo-word-accent">Archer Design</span>
          </a>
          <p className="fh-logo-microcopy">Private partnership concept</p>
        </div>

        <nav className="hidden items-center gap-6 text-[12.5px] lg:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="fh-header-nav-link whitespace-nowrap">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/social-media-work" className="fh-text-link whitespace-nowrap">
            View Archer work
          </Link>
          <a href={PILOT_MAILTO} className="fh-btn fh-btn-primary px-5 py-2.5 text-[12.5px]">
            Discuss a pilot
          </a>
        </div>

        <button
          type="button"
          className="fh-header-menu-btn flex h-9 w-9 items-center justify-center rounded-md border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="first-hospitality-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            aria-hidden="true"
            className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current"
          />
        </button>
      </div>

      {open && (
        <nav id="first-hospitality-mobile-nav" aria-label="Page sections" className="fh-mobile-nav border-t px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="fh-header-nav-link" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/social-media-work"
                className="fh-text-link"
                onClick={() => setOpen(false)}
              >
                View Archer work
              </Link>
            </li>
            <li>
              <a
                href={PILOT_MAILTO}
                className="fh-btn fh-btn-primary mt-1 px-5 py-2.5 text-[13px]"
                onClick={() => setOpen(false)}
              >
                Discuss a pilot
              </a>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="fh-progress" aria-hidden="true" />
    </header>
  );
}
