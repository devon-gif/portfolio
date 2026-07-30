"use client";

import { useEffect } from "react";

/**
 * Scheduling action card for /tcrm/schedule.
 *
 * Uses Devon Archer's own generic Calendly link (lib/seo.ts CALENDLY_URL,
 * the same link already reused on /coraltree) rather than a TCRM-specific
 * booking tool. If that URL is ever emptied out, this renders a graceful
 * "coming soon" message with a safe mailto fallback, never a fake or
 * placeholder link.
 *
 * When a real URL is present, both a visible "Schedule a call" button
 * (opened in a new tab with safe rel attributes) and Calendly's own inline
 * embed widget are rendered, matching the embed technique already used
 * elsewhere in this project (see public/dovetail/book/index.html).
 */
export function ScheduleAction({
  bookingUrl,
  fallbackMailto,
}: {
  bookingUrl: string;
  fallbackMailto: string;
}) {
  useEffect(() => {
    if (!bookingUrl) return;
    const src = "https://assets.calendly.com/assets/external/widget.js";
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, [bookingUrl]);

  if (!bookingUrl) {
    return (
      <div className="tl-schedule-card">
        <p className="tl-schedule-pending-title">Scheduling link coming soon</p>
        <p className="tl-schedule-pending-copy">
          Devon&rsquo;s direct scheduling link is not yet configured on this page. In the meantime,
          reach the team directly and we will coordinate a time by email.
        </p>
        <a href={fallbackMailto} className="tl-btn-ghost mt-5">
          Email the team
        </a>
      </div>
    );
  }

  return (
    <div className="tl-schedule-card">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="tl-btn tl-schedule-btn"
      >
        Schedule a call
      </a>
      <p className="tl-schedule-note">Opens Devon&rsquo;s scheduling calendar in a new tab.</p>
      <div className="tl-schedule-embed-wrap mt-6">
        <div
          className="calendly-inline-widget"
          data-url={bookingUrl}
          style={{ minWidth: "280px", height: "700px" }}
        />
      </div>
    </div>
  );
}
