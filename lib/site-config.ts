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
} as const;

// Convenience exports.
export const scorecardUrl = siteConfig.scorecardUrl;
export const creativeGapReviewUrl = siteConfig.creativeGapReviewUrl;

/** Build a gap-review link that carries scorecard attribution. */
export function gapReviewLink(submissionId?: string | null): string {
  const base = `${siteConfig.creativeGapReviewUrl}?source=scorecard`;
  return submissionId ? `${base}&submission_id=${encodeURIComponent(submissionId)}` : base;
}
