// ─────────────────────────────────────────────────────────────────────────────
// Central SEO configuration for the Archer Design marketing site.
// Used by app/layout.tsx, app/sitemap.ts, app/robots.ts, and the public
// landing pages. Does NOT touch CRM/admin code.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.archerdesign.shop";

export const SITE_NAME = "Archer Design";

export const DEFAULT_TITLE =
  "Archer Design | Hotel Social Media & Hospitality Creative Support";

export const DEFAULT_DESCRIPTION =
  "Hospitality creative support for hotels, restaurants, spas, and event venues — social graphics, short-form video, captions, campaign copy, and approval-ready content without adding full-time creative headcount.";

export const CALENDLY_URL = "https://calendly.com/devonavich0/30min";

export const LOGO_PATH = "/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png";

/** Default Open Graph image (hospitality creative still, landscape). */
export const OG_IMAGE = {
  url: "/Image%203.png",
  width: 1784,
  height: 1616,
  alt: "Archer Design hospitality creative example — hotel guest suite campaign visual",
};

/** Public marketing routes that belong in the sitemap. */
export const PUBLIC_PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/hotel-groups", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  { path: "/packages", priority: 0.9, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hotel-social-media-management", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hotel-video-marketing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hospitality-creative-support", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hotel-restaurant-event-promos", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hotel-marketing-cost-savings", priority: 0.8, changeFrequency: "monthly" },
  { path: "/promo-rescue", priority: 0.8, changeFrequency: "monthly" },
];

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

// ── JSON-LD builders ─────────────────────────────────────────────────────────

export interface FaqItem {
  q: string;
  a: string;
}

/** Organization schema for Archer Design (used site-wide). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    description: DEFAULT_DESCRIPTION,
    founder: { "@type": "Person", name: "Devon Archer" },
    areaServed: "United States",
    knowsAbout: [
      "hotel social media management",
      "hospitality marketing",
      "short-form video for hotels",
      "restaurant and F&B promotion",
      "spa and wellness marketing",
      "event venue promotion",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: absoluteUrl("/contact"),
      availableLanguage: "English",
    },
  };
}

/** Service schema for a specific landing page. */
export function serviceJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    serviceType: opts.serviceType,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "United States",
    audience: {
      "@type": "BusinessAudience",
      name: "Hotels, restaurants, spas, and event venues",
    },
    offers: {
      "@type": "Offer",
      description:
        "Free 5-asset trial, then fixed monthly creative packages. No employment overhead.",
      url: absoluteUrl("/contact"),
    },
  };
}

/** FAQPage schema from a list of Q&A pairs. */
export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** VideoObject schema for portfolio videos. */
export function videoObjectJsonLd(videos: {
  name: string;
  description: string;
  contentUrl: string;
  thumbnailUrl: string;
}[]) {
  return videos.map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.name,
    description: v.description,
    contentUrl: v.contentUrl,
    thumbnailUrl: v.thumbnailUrl,
    // TODO(devon): replace with real publish dates per video if known.
    uploadDate: "2026-01-01",
    publisher: { "@id": `${SITE_URL}/#organization` },
  }));
}
