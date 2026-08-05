"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PILOT_CALENDLY_URL } from "../pyramid-content";

const NAV = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#motion-studies", label: "Motion Studies" },
  { href: "#workflow", label: "How It Works" },
  { href: "#proof", label: "Proof" },
  { href: "#pilot", label: "Pilot" },
];

/**
 * Restrained sticky header for the /pyramid private creative concept,
 * modeled structurally on this project's other private-proposal headers
 * (fixed, glass-on-scroll, scroll progress bar — see
 * app/first-hospitality/components/FirstHospitalityHeader.tsx). The lockup
 * pairs Pyramid Global Hospitality's real published logo (sourced from
 * pyramidglobal.com, used here solely to identify the prospective partner
 * on a private, unpublished concept page) with the Archer Design wordmark.
 * Never added to the main site's public navigation — direct URL only,
 * matching this project's other private proposal microsites.
 */
export function PyramidHeader() {
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
    <header className={`pyr-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="pyr-shell flex items-center justify-between gap-4 py-4">
        <a href="#top" className="pyr-logo-group" aria-label="Pyramid Global Hospitality times Archer Design, top of page">
          {/* eslint-disable-next-line @next/next/no-img-element -- local static brand asset, no remote hotlinking */}
          <img
            src="/pyramid/pyramid-global-hospitality-logo-color.png"
            alt="Pyramid Global Hospitality"
            className="pyr-logo-image"
            width={1200}
            height={418}
          />
          <span className="pyr-logo-x" aria-hidden="true">&times;</span>
          <span className="pyr-logo-word pyr-logo-word-accent">ARCHER DESIGN</span>
        </a>

        <nav className="hidden items-center gap-6 text-[12.5px] lg:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="pyr-header-nav-link whitespace-nowrap">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/social-media-work" className="pyr-text-link whitespace-nowrap">
            View Archer work
          </Link>
          <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener" className="pyr-btn pyr-btn-primary px-5 py-2.5 text-[12.5px]">
            Discuss a pilot
          </a>
        </div>

        <button
          type="button"
          className="pyr-header-menu-btn flex h-9 w-9 items-center justify-center rounded-md border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="pyramid-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            aria-hidden="true"
            className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current"
          />
        </button>
      </div>

      {open && (
        <nav id="pyramid-mobile-nav" aria-label="Page sections" className="pyr-mobile-nav border-t px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="pyr-header-nav-link" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/social-media-work" className="pyr-text-link" onClick={() => setOpen(false)}>
                View Archer work
              </Link>
            </li>
            <li>
              <a
                href={PILOT_CALENDLY_URL}
                target="_blank"
                rel="noopener"
                className="pyr-btn pyr-btn-primary mt-1 px-5 py-2.5 text-[13px]"
                onClick={() => setOpen(false)}
              >
                Discuss a pilot
              </a>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="pyr-progress" aria-hidden="true" />
    </header>
  );
}
