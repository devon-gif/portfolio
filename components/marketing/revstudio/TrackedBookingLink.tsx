"use client";

import { useRevstudioContactModal } from "./RevstudioContactModalContext";

/**
 * The single reusable CTA every "Discuss a pilot"-style button on /revstudio
 * must use. Opens the shared "Request a strategy call" contact modal
 * (RevstudioContactModal.tsx -> POST /api/revstudio/contact) instead of
 * linking out to Calendly or a mailto: address, so every primary conversion
 * CTA on the page ends in the same real, working request form.
 *
 * Kept as a <button> (not <a>) since it no longer navigates anywhere —
 * className/data-revstudio-cta/ariaLabel props are preserved as-is so
 * existing styling and analytics selectors keep working unchanged.
 */
export function TrackedBookingLink({
  variant,
  className,
  children,
  ariaLabel,
}: {
  /** Internal only — identifies which CTA on the page was clicked, kept for
   *  styling/analytics continuity. Never exposes internal lead-source codes. */
  variant: "header" | "hero" | "model" | "pilot" | "agencies" | "hotels" | "portfolio" | "final-cta";
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const { openModal } = useRevstudioContactModal();

  return (
    <button
      type="button"
      className={className}
      data-revstudio-cta={variant}
      aria-label={ariaLabel}
      onClick={openModal}
    >
      {children}
    </button>
  );
}
