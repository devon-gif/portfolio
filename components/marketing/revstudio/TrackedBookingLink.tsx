"use client";

import { useEffect, useRef } from "react";
import {
  REVSTUDIO_BOOKING_URL,
  REVSTUDIO_FALLBACK_MAILTO,
  buildRevstudioBookingUrl,
} from "@/lib/revstudio";

/**
 * The single reusable CTA every "Book a pilot conversation" button on
 * /revstudio must use, so every click carries the same attribution
 * (utm_source=archerdesign_shop, utm_medium=partner_landing_page,
 * utm_campaign=revstudio_joint_offer, lead_source=ARCHER_REVSTUDIO_PAGE —
 * see lib/revstudio.ts). Falls back to a plain mailto contact link when
 * NEXT_PUBLIC_REVSTUDIO_BOOKING_URL isn't configured yet, so nothing on
 * the page ever links to a dead URL.
 *
 * Renders the base (UTM-only) URL on first paint so server and client
 * markup match, then enriches with landing_page_url / referrer_url after
 * mount (those two params aren't reliably read back from Calendly's
 * webhook payload — see buildRevstudioBookingUrl — but are included
 * best-effort for future use, e.g. a client-side beacon).
 */
export function TrackedBookingLink({
  variant,
  className,
  children,
  ariaLabel,
}: {
  /** Internal only — identifies which CTA on the page was clicked for our
   *  own debugging. Never exposes internal lead-source codes to the visitor. */
  variant: "header" | "hero" | "model" | "pilot" | "agencies" | "hotels" | "portfolio" | "final-cta";
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const initialHref = REVSTUDIO_BOOKING_URL ? buildRevstudioBookingUrl({}) || REVSTUDIO_FALLBACK_MAILTO : REVSTUDIO_FALLBACK_MAILTO;
  const anchorRef = useRef<HTMLAnchorElement>(null);

  // Enrich the href with landing_page_url / referrer_url after mount by
  // mutating the DOM node directly (not React state) — window/document
  // aren't available during SSR, and this is a one-time, external-system
  // sync rather than something that should trigger a re-render.
  useEffect(() => {
    if (!REVSTUDIO_BOOKING_URL || !anchorRef.current) return;
    const enriched = buildRevstudioBookingUrl({
      landingPageUrl: window.location.href,
      referrerUrl: document.referrer || null,
    });
    if (enriched) anchorRef.current.href = enriched;
  }, []);

  const isExternal = /^https?:\/\//.test(initialHref);

  return (
    <a
      ref={anchorRef}
      href={initialHref}
      className={className}
      data-revstudio-cta={variant}
      aria-label={ariaLabel}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
