"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrackedBookingLink } from "./TrackedBookingLink";

const NAV = [
  { href: "#opportunity", label: "The opportunity" },
  { href: "#model", label: "The model" },
  { href: "#revenue-operations", label: "Revenue operations" },
  { href: "#creative-execution", label: "Creative execution" },
  { href: "#agencies", label: "For agencies" },
  { href: "#hotels", label: "For hotels" },
  { href: "#pricing", label: "Pricing" },
  { href: "#pilot", label: "The pilot" },
];

/**
 * Joint partnership header for /revstudio, the Revstudio x Archer Design
 * page. Intentionally not the standard Archer Design site nav (Hotels /
 * Restaurants / Bars / Work / Packages), since this page has its own
 * two-brand identity (not yet in the main nav; see
 * REVSTUDIO_PARTNERSHIP_PAGE_SETUP.md).
 */
export function JointPartnerHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="rv-header sticky top-0 z-40">
      <div className="rv-shell flex items-center justify-between gap-4 py-4">
        <Link href="#top" className="flex min-w-0 shrink-0 items-center" aria-label="The Revstudio x Archer Design, home">
          <Image
            src="/revstudio/media/trs-ad-logo.png"
            alt="The Revstudio x Archer Design"
            width={282}
            height={94}
            priority
            className="h-7 w-auto object-contain sm:h-8"
          />
        </Link>

        <nav className="hidden items-center gap-5 text-[12.5px] xl:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="whitespace-nowrap text-[var(--rv-ink-soft)] transition hover:text-[var(--rv-ink)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <TrackedBookingLink variant="header" className="rv-btn px-5 py-2.5 text-[12.5px]">
            Discuss a pilot
          </TrackedBookingLink>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--rv-line)] text-[var(--rv-ink)] xl:hidden"
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
          className="rv-mobile-nav border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-5 xl:hidden"
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
            <TrackedBookingLink variant="header" className="rv-btn justify-center px-5 py-3 text-[13px]">
              Discuss a pilot
            </TrackedBookingLink>
          </div>
        </nav>
      )}
    </header>
  );
}
