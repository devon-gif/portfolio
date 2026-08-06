"use client";

import { useRevstudioContactModal } from "./RevstudioContactModalContext";

/**
 * Generic "opens the Request a strategy call modal" trigger for the
 * non-booking-flow CTAs on /revstudio — the final-CTA secondary link
 * ("Contact the partners") and the footer "Contact" link. Distinct from
 * TrackedBookingLink (which carries the data-revstudio-cta attribution
 * variant for the primary pilot-booking CTAs) since these two were plain
 * mailto: links, not part of that tracked-variant set.
 */
export function RevstudioContactTrigger({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const { openModal } = useRevstudioContactModal();
  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={openModal}>
      {children}
    </button>
  );
}
