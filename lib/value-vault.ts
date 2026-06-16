// Hospitality Resource Vault (Value Vault) — public resource hub content.
// Used by /hospitality-resource-vault and surfaced (with copy-link) in admin.

export type VaultResource = {
  id: string;
  title: string;
  description: string;
  audience: string;
  ctaLabel: string;
  /** Internal path or external URL. */
  href: string;
  status: "available" | "coming_soon";
};

export const VAULT_TITLE = "Hospitality Resource Vault";
export const VAULT_SUBTITLE =
  "Practical tools for hotel, resort, restaurant, spa, and venue leaders who want every property to look as strong online as it does in person.";

export const VAULT_RESOURCES: VaultResource[] = [
  {
    id: "scorecard",
    title: "Hotel Creative Bandwidth Scorecard",
    description:
      "A 3–5 minute diagnostic that scores how consistent your property-level creative really is across social, F&B/events, local campaigns, and reporting.",
    audience: "Hotel groups, management companies, multi-property operators",
    ctaLabel: "Take the scorecard",
    href: "/hotel-creative-scorecard",
    status: "available",
  },
  {
    id: "pilot_map",
    title: "3–5 Property Creative Pilot Map",
    description:
      "How a focused creative pilot is scoped across a handful of properties — what's delivered each month and how consistency is built without overloading your team.",
    audience: "Marketing, sales, and GM leaders evaluating a pilot",
    ctaLabel: "Request the gap review",
    href: "/creative-gap-review",
    status: "available",
  },
  {
    id: "before_after",
    title: "Before/After Hospitality Creative Examples",
    description:
      "Real property creative, before and after — social graphics, short-form motion, and F&B/event promos built from existing assets.",
    audience: "Anyone deciding if the quality bar is right for their brand",
    ctaLabel: "See the work",
    href: "/case-studies",
    status: "available",
  },
  {
    id: "what_we_track",
    title: "What We Track Beyond Likes",
    description:
      "The attention and action signals that actually matter — and the booking-support signals we can see where tracking is available.",
    audience: "Revenue, commercial, and marketing leaders",
    ctaLabel: "Read the breakdown",
    href: "/hotel-marketing-cost-savings",
    status: "coming_soon",
  },
  {
    id: "cost_comparison",
    title: "Cost Comparison: Creative Hire vs Creative Pilot",
    description:
      "A side-by-side look at a full-time creative hire versus a fixed-fee property creative pilot — salary, ramp, coverage, and output.",
    audience: "Owners and operators weighing in-house vs partner",
    ctaLabel: "Compare the options",
    href: "/hotel-marketing-cost-savings",
    status: "available",
  },
  {
    id: "fb_event_examples",
    title: "F&B / Event Campaign Examples",
    description:
      "Promo creative for restaurants, bars, brunches, private dining, weddings, meetings, and seasonal events.",
    audience: "F&B, events, and group sales teams",
    ctaLabel: "Browse examples",
    href: "/hotel-restaurant-event-promos",
    status: "available",
  },
  {
    id: "gap_review",
    title: "Request a 3-Property Creative Gap Review",
    description:
      "Send 3 property links and get a clear map of the biggest creative opportunities across social, F&B/events, local campaigns, and reporting.",
    audience: "Multi-property hospitality teams ready for a next step",
    ctaLabel: "Request your review",
    href: "/creative-gap-review",
    status: "available",
  },
];
