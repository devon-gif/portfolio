// Central public-link config for Archer Design CTAs. Use these constants for
// links instead of hardcoding paths so the funnel stays consistent everywhere.

export const siteConfig = {
  /** Public scorecard landing page — the link Devon sends from LinkedIn. */
  scorecardUrl: "/hotel-creative-scorecard",
  /** Next step after the scorecard — the 3-Property Creative Gap Review. */
  creativeGapReviewUrl: "/creative-gap-review",
  /** Public resource hub. */
  resourceVaultUrl: "/hospitality-resource-vault",
  /** Existing contact / samples request page. */
  contactUrl: "/contact",
  /** HSC x Archer Design revenue-activation prospect page (static HTML,
   *  served via a next.config.ts rewrite — not a React route). */
  revenueActivationUrl: "/revenue-activation",
  /** Post-booking confirmation page for the dedicated Hotel Portfolio
   *  Strategy Call. See lib/strategy-call.ts + STRATEGY_CALL_BOOKING_SETUP.md. */
  strategyCallConfirmationUrl: "/revenue-activation/confirmed",
} as const;

// Convenience exports.
export const scorecardUrl = siteConfig.scorecardUrl;
export const creativeGapReviewUrl = siteConfig.creativeGapReviewUrl;

/** Build a gap-review link that carries scorecard attribution. */
export function gapReviewLink(submissionId?: string | null): string {
  const base = `${siteConfig.creativeGapReviewUrl}?source=scorecard`;
  return submissionId ? `${base}&submission_id=${encodeURIComponent(submissionId)}` : base;
}

// Strategy-call booking config lives in lib/strategy-call.ts (its own module
// since it carries a good amount of attribution/round-robin logic) — re-export
// the pieces other files are most likely to need so `siteConfig` remains a
// reasonable first place to look.
export {
  STRATEGY_CALL_BASE_URL,
  STRATEGY_CALL_EVENT_SLUG,
  buildStrategyCallUrl,
} from "@/lib/strategy-call";
