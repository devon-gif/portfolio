"use client";

import { useState } from "react";
import Link from "next/link";
import { TrackedBookingLink } from "./TrackedBookingLink";

const NAV = [
  { href: "#model", label: "The model" },
  { href: "#services", label: "Services" },
  { href: "#agencies", label: "For agencies" },
  { href: "#hotels", label: "For hotels" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
];

/**
 * Standalone Revstudio header. No approved Revstudio logo asset exists yet
 * (see public/revstudio/README.md), so the mark is a small purple geometric
 * accent plus a refined text wordmark rather than an invented/AI-approximated
 * logo file. Archer Design appears only as a small, clearly-external,
 * secondary link — never implying the two businesses are merged.
 */
export function RevstudioHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rv-line)] bg-[rgba(3,3,4,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="#top" className="flex min-w-0 items-center gap-2.5" aria-label="The Revstudio — home">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px]"
            style={{
              background: "linear-gradient(135deg, var(--rv-blue-bright), var(--rv-blue))",
              boxShadow: "0 0 12px rgba(150,104,215,0.55)",
            }}
          />
          <span className="min-w-0 truncate font-serif text-[15px] leading-tight text-[var(--rv-ink)]">
            The Revstudio
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] lg:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-[var(--rv-ink-soft)] transition hover:text-[var(--rv-ink)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href="https://www.archerdesign.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11.5px] text-[var(--rv-ink-muted)] transition hover:text-[var(--rv-slate)]"
          >
            Archer Design ↗
          </a>
          <TrackedBookingLink variant="header" className="rv-btn px-5 py-2.5 text-[12.5px]">
            Discuss your portfolio
          </TrackedBookingLink>
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--rv-line)] text-[var(--rv-ink)] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="revstudio-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current" />
        </button>
      </div>

      {open && (
        <nav
          id="revstudio-mobile-nav"
          aria-label="Page sections"
          className="border-t border-[var(--rv-line)] bg-[rgba(3,3,4,0.98)] px-6 py-5 lg:hidden"
        >
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-[var(--rv-ink-soft)]" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="https://www.archerdesign.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[var(--rv-ink-muted)]"
            >
              Archer Design ↗
            </a>
            <TrackedBookingLink variant="header" className="rv-btn justify-center px-5 py-3 text-[13px]">
              Discuss your portfolio
            </TrackedBookingLink>
          </div>
        </nav>
      )}
    </header>
  );
}
