/**
 * proof-stats.ts — Single source of truth for all public-facing proof numbers.
 *
 * Source: SHAIPE grouped performance report across all tracked hospitality profiles.
 * Report period: December 31, 2020 – June 14, 2026.
 * Profiles tracked: Eliza PGH / Eliza Hot Metal Bistro, Hotel Indigo Pittsburgh,
 *   Hampton Inn Greensburg, Hampton Inn Johnstown, Elements Salon & Wellness,
 *   and other tracked profiles.
 *
 * SAFE CLAIM LANGUAGE:
 *   "Across tracked hotel, restaurant, event, and wellness campaigns..."
 *   "Creative helped generate..."  "Supported visibility..."
 *   "Created measurable attention and action around..."
 *   "670K+ reported post clicks" (rounded from 672K+)
 *   "Direct booking attribution depends on property-level tracking setup."
 *
 * UNSAFE — DO NOT USE:
 *   "Hotel Indigo generated 14.8M impressions." (grouped report, not one profile)
 *   "Caused X bookings" / "Proved ROI" / "Directly drove room nights"
 */

// ─── Aggregate (public-facing) ────────────────────────────────────────────────

export const PROOF = {
  impressions:    "14.8M+",
  engagements:    "565K+",
  reach:          "4.3M+",
  post_clicks:    "670K+",
  reactions:      "122K+",
  comments:       "12.9K+",
  shares:         "11.4K+",
  posts_tracked:  "2.5K+",
  engagement_rate:"3.8%",
} as const;

/** Short tag line: top 4 stats for hero strip / email subject lines. */
export const PROOF_TAGLINE =
  `${PROOF.impressions} impressions · ${PROOF.engagements} engagements · ` +
  `${PROOF.reach} reach · ${PROOF.post_clicks} reported post clicks`;

/** Sentence form for proposals and outreach bodies. */
export const PROOF_SENTENCE =
  `Across tracked hotel, restaurant, event, and wellness campaigns, Archer Design creative ` +
  `has helped generate ${PROOF.impressions} impressions, ${PROOF.engagements} direct engagements, ` +
  `${PROOF.reach} reach, and ${PROOF.post_clicks} reported post clicks.`;

/** Short-form proof block for emails ({{stats_block}} template variable). */
export const STATS_BLOCK = [
  `• ${PROOF.impressions} impressions across tracked hospitality campaigns`,
  `• ${PROOF.engagements} direct engagements`,
  `• ${PROOF.reach} reach`,
  `• ${PROOF.post_clicks} reported post clicks`,
  `• ${PROOF.shares} shares · ${PROOF.comments} comments`,
].join("\n");

/** Safe attribution note — append when sharing proof numbers externally. */
export const ATTRIBUTION_NOTE =
  "Metrics sourced from SHAIPE-tracked profile data across hotel, restaurant, event, and " +
  "wellness campaigns. These reflect impressions, reach, engagement, and reported post " +
  "clicks. Direct booking attribution depends on property-level tracking setup and is not " +
  "claimed above.";

// ─── Per-profile data ─────────────────────────────────────────────────────────

export const PROFILE_STATS = {
  eliza: {
    name: "Eliza PGH / Eliza Hot Metal Bistro",
    category: "Restaurant, F&B, and event-driven creative",
    posts:          "444",
    impressions:    "5.88M",
    page_engagements: "392.6K",
    post_engagements: "608K",
    post_clicks:    "496K",
    reactions:      "98K",
    comments:       "3.69K",
    shares:         "9.88K",
  },
  indigo: {
    name: "Hotel Indigo Pittsburgh",
    category: "Boutique flag hotel",
    posts:          "408",
    impressions:    "1.91M",
    page_engagements: "100K",
    post_engagements: "105K",
    post_clicks:    "46.6K",
    reactions:      "46K",
    comments:       "9K",
    shares:         "3.5K",
  },
  hampton_greensburg: {
    name: "Hampton Inn Greensburg",
    category: "Select-service Hilton flag",
    posts:          "338",
    impressions:    "3.24M",
    page_engagements: "164K",
    post_engagements: "78K",
    post_clicks:    "46.8K",
    reactions:      "25K",
    comments:       "3.5K",
    shares:         "2.6K",
  },
  elements: {
    name: "Elements Salon & Wellness",
    category: "Salon, spa, and wellness",
    posts:          "165",
    impressions:    "3.26M",
    page_engagements: "131K",
    post_engagements: "87.9K",
    post_clicks:    "72.2K",
    reactions:      "13.7K",
    comments:       "497",
    shares:         "1.46K",
  },
} as const;

// ─── Top campaign moments ─────────────────────────────────────────────────────

export const TOP_CAMPAIGNS = [
  {
    id: "halloween",
    profile: "Eliza PGH",
    campaign: "Halloween Campaign",
    type: "Local event + F&B",
    engagements: "22.7K",
    reach:       "193.7K",
    shares:      "389",
    comments:    "107",
  },
  {
    id: "snowflake",
    profile: "Eliza PGH",
    campaign: "Snowflake Campaign",
    type: "Seasonal campaign",
    engagements: "19.8K",
    reach:       "56.8K",
  },
  {
    id: "elements-opening",
    profile: "Elements Salon & Wellness",
    campaign: "Opening Campaign",
    type: "Opening + wellness",
    engagements: "14K",
    reach:       "50.9K",
  },
  {
    id: "stitch",
    profile: "Eliza PGH",
    campaign: "Breakfast with Stitch",
    type: "Family + F&B experience",
    likes:    "3.6K",
    shares:   "807",
    comments: "221",
  },
] as const;

// ─── What we track (reporting scope) ─────────────────────────────────────────

export const TRACKING_SCOPE = [
  "Creative output (posts, assets, motion pieces delivered)",
  "Impressions",
  "Reach",
  "Direct engagements (likes, reactions, saves)",
  "Reactions",
  "Comments",
  "Shares",
  "Reported post clicks",
  "Link clicks where available",
  "Website traffic via UTM campaign links",
  "Google Business Profile actions where access is available",
  "Search Console visibility where access is available",
  "Event, F&B, wedding, and spa inquiry signals if the client provides them",
  "Booking-support signals where booking data is available",
] as const;
