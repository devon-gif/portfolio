"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useToplineInterestModal } from "./ToplineInterestModal";

const NAV = [
  { href: "#motion", label: "Our work" },
  { href: "#packages", label: "Packages" },
  { href: "#gap", label: "The gap" },
  { href: "#model", label: "The model" },
  { href: "#pilot", label: "The pilot" },
  { href: "#expansion", label: "Expansion" },
];

/**
 * Sticky glass header for the /topline proposal. Intentionally not the
 * standard Archer Design site nav, since this is a private, personalized
 * page with its own identity. Includes a thin teal scroll-progress bar
 * (rAF-throttled transform only, so it never causes layout work).
 *
 * LOGO LOCKUP: Topline (dominant, real supplied wordmark image at
 * /public/topline/logos/topline-logo.png), then the real supplied "The
 * Revstudio x Archer Design" combined mark (the same file used as the
 * header logo on the live /revstudio joint page) at
 * /public/topline/logos/trs-archer-logo.png, separated by a thin hairline.
 * No invented/text-based logo treatments; both marks are actual supplied
 * brand assets.
 */
export function ToplineHeader({ hasLogo }: { hasLogo: boolean }) {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const { openModal } = useToplineInterestModal();

  function handleCtaClick() {
    setOpen(false);
    openModal();
  }

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
          <a href="#top" className="tl-logo-group" aria-label="Proposal prepared for Topline Revenue Management, delivered with The Revstudio and Archer Design, top of page">
            {hasLogo ? (
              // Official supplied Topline wordmark, kept visually dominant
              // since this proposal is prepared for Topline (see comment
              // above on the component).
              <Image
                src="/topline/logos/topline-logo.png"
                alt="Topline Revenue Management"
                width={140}
                height={44}
                className="tl-logo-topline"
                priority
              />
            ) : (
              <span className="tl-wordmark">
                <span className="tl-wordmark-prep">Prepared for</span>
                TOPLINE
              </span>
            )}

            <span className="tl-logo-sep" aria-hidden="true" />

            {/* Real supplied combined mark, same file used as the header
                logo on the live /revstudio joint page. Not a fabricated
                text treatment. */}
            <Image
              src="/topline/logos/trs-archer-logo.png"
              alt="The Revstudio and Archer Design"
              width={354}
              height={116}
              className="tl-logo-trs-ad"
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
          <button type="button" className="tl-btn px-5 py-2.5 text-[12.5px]" onClick={handleCtaClick}>
            Review the pilot
          </button>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--tl-line)] text-[var(--tl-ink)] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="topline-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current" />
        </button>
      </div>

      {open && (
        <nav id="topline-mobile-nav" aria-label="Page sections" className="tl-mobile-nav border-t border-[var(--tl-line)] px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-[var(--tl-ink-soft)]" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="tl-btn mt-1 px-5 py-2.5 text-[13px]"
                onClick={handleCtaClick}
              >
                Review the pilot
              </button>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="tl-progress" aria-hidden="true" />
    </header>
  );
}
