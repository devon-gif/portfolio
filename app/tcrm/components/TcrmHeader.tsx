"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "#motion", label: "Our work" },
  { href: "#packages", label: "Packages" },
  { href: "#capacity", label: "Capacity" },
  { href: "#gap", label: "The gap" },
  { href: "#model", label: "The model" },
  { href: "#pilot", label: "The pilot" },
  { href: "#expansion", label: "Expansion" },
];

/**
 * Sticky glass header for the /tcrm proposal. Intentionally not the
 * standard Archer Design site nav, since this is a private, personalized
 * page with its own identity. Includes a thin teal scroll-progress bar
 * (rAF-throttled transform only, so it never causes layout work).
 *
 * LOGO LOCKUP: TCRM's real supplied wordmark (public/tcrm/logos/
 * tcrm-logo.png, sourced from tcrmservices.com) and the Archer Design mark
 * alone (public/tcrm/logos/archer-design-monogram.png), separated by a
 * thin hairline. Two marks only -- there is no combined/co-branded lockup.
 */
export function TcrmHeader() {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
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
    <header className="tl-header">
      <div className="tl-shell flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 shrink-0 flex-col gap-1.5">
          <a href="#top" className="tl-logo-group" aria-label="Proposal prepared for Total Customized Revenue Management, delivered by Archer Design, top of page">
            <Image
              src="/tcrm/logos/tcrm-logo.png"
              alt="Total Customized Revenue Management"
              width={352}
              height={110}
              className="tl-logo-tcrm"
              priority
            />

            <span className="tl-logo-sep" aria-hidden="true" />

            {/* Archer Design's own mark, standing alone. */}
            <Image
              src="/tcrm/logos/archer-design-monogram.png"
              alt="Archer Design"
              width={1000}
              height={605}
              className="tl-logo-archer"
            />
          </a>
          <p className="tl-logo-microcopy">Proposed delivery model</p>
        </div>

        <nav className="hidden items-center gap-6 text-[12.5px] lg:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="whitespace-nowrap text-[var(--tl-ink-soft)] transition hover:text-[var(--tl-ink)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link href="/tcrm/schedule" className="tl-btn px-5 py-2.5 text-[12.5px]">
            Review the pilot
          </Link>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--tl-line)] text-[var(--tl-ink)] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="tcrm-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current" />
        </button>
      </div>

      {open && (
        <nav id="tcrm-mobile-nav" aria-label="Page sections" className="tl-mobile-nav border-t border-[var(--tl-line)] px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-[var(--tl-ink-soft)]" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/tcrm/schedule"
                className="tl-btn mt-1 px-5 py-2.5 text-[13px]"
                onClick={() => setOpen(false)}
              >
                Review the pilot
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="tl-progress" aria-hidden="true" />
    </header>
  );
}
