// ─────────────────────────────────────────────────────────────────────────────
// infuse-content.ts — copy for the /infuse private, personalized page
// prepared for Jaimie DeLeon (Executive Operations Director, Infuse
// Hospitality). Introduced via Rachel Cimino. Not a cold outreach page —
// never linked from nav/sitemap/footer, direct URL only. See app/robots.ts
// and components/AppChrome.tsx (PUBLIC_PREFIXES) for the belt-and-suspenders
// noindex/no-CRM-chrome treatment matching this project's other private
// proposal microsites.
// ─────────────────────────────────────────────────────────────────────────────

// CONTACT_MAILTO is kept for reference only — every contact/conversation
// CTA on this page now points to CALENDLY_URL instead (see below). It is no
// longer wired to any link on the page.
export const CONTACT_MAILTO =
  "mailto:devonavich0@gmail.com?subject=Infuse%20Hospitality%20%C3%97%20Archer%20Design%20%E2%80%94%20Let%27s%20Talk";

/** Every contact / talk / discuss / book CTA on /infuse points here, opened
 * in a new tab. Portfolio-navigation links (View Selected Work, View Full
 * Archer Design Site) are left untouched — this is only for CTAs whose
 * purpose is to start a conversation. */
export const CALENDLY_URL = "https://calendly.com/devonavich0/30min";

export const NAV_LOCKUP = "Prepared for Infuse Hospitality";

/* ── Hero ──────────────────────────────────────────────────────────────── */
export const HERO_LABEL = "PREPARED FOR JAIMIE DELEON · INFUSE HOSPITALITY";
export const HERO_HEADLINE_LINE_1 = "More creative capacity.";
// Split so only the final word can be highlighted in coral, per direction.
export const HERO_HEADLINE_LINE_2_BASE = "Without another layer to ";
export const HERO_HEADLINE_ACCENT = "manage.";
export const HERO_COPY =
  "Creative, motion and marketing support that helps Infuse make more from the assets, campaigns and concepts it already has.";
export const HERO_CTA_PRIMARY = "View the Work";
export const HERO_CTA_PRIMARY_HREF = "#work";
export const HERO_CTA_SECONDARY = "Book a quick intro";
/** The hero's "Scroll to explore" control jumps to the section immediately
 * after the hero — the Motion Work gallery (also #work, the same target as
 * the "View the Work" button, since proof now comes first). */
export const HERO_SCROLL_TARGET_ID = "work";

/* ── Archer × Infuse logo lockup ───────────────────────────────────────────
   Two tasteful spots pairing the real Archer monogram with the real Infuse
   wordmark behind a thin divider (see InfuseLogoLockup.tsx). Deliberately
   "prepared for" framing only — never a merged mark, never partnership /
   ownership language. */
export const LOGO_LOCKUP_CAPTION_HERO = "Prepared for Jaimie DeLeon";

/* ── Positioning ───────────────────────────────────────────────────────────
   The standalone "How I'd fit in" section itself is no longer rendered
   (removed in an earlier restructure), but POSITIONING_HEADLINE is back in
   active use — it's the strongest recurring positioning line on the page,
   now surfaced prominently in the Capabilities section (see
   InfuseShowcase.tsx). Reused by reference rather than duplicating the
   string. ─────────────────────────────────────────────────────────────── */
export const POSITIONING_EYEBROW = "HOW I'D FIT IN";
export const POSITIONING_HEADLINE = "An extension of your marketing team — not another agency layer.";
export const POSITIONING_COPY =
  "Infuse already knows hospitality, culinary, branding, marketing, operations, and guest experience — that expertise isn't something I'm bringing in. I help the team move more of the work: following your existing brand standards, supporting the strategy that's already in place, and taking hands-on ownership of the creative and production that needs another set of hands.";

export const POSITIONING_CAPABILITIES = [
  "Follow existing brand standards",
  "Support existing strategy",
  "Take ownership of selected concepts",
  "Handle overflow creative",
  "Manage selected social accounts",
  "Support launches",
  "Handle quick-turn work",
  "Help organize production across multiple concepts",
] as const;

/* ── Services / Capabilities ───────────────────────────────────────────── */
export type ServiceItem = {
  number: string;
  title: string;
  copy: string;
};

export const SERVICES_EYEBROW = "WHERE I COULD HELP";
export const SERVICES_HEADLINE = "Flexible capacity, not fixed packages.";
export const SERVICES_SUBCOPY =
  "None of this is a rigid package — it's capability. Some months that looks like one concept's social calendar; other months it's overflow design work across several properties. Scope narrows or widens with what Infuse actually needs.";

export const SERVICES: ServiceItem[] = [
  {
    number: "01",
    title: "Social Media Management",
    copy: "Content calendars, captions, creative, scheduling, publishing, campaign coordination, repurposing, and light reporting.",
  },
  {
    number: "02",
    title: "Day-to-Day Design",
    copy: "Menus, flyers, digital signage, social graphics, email creative, event graphics, print assets, sales collateral, and quick-turn requests.",
  },
  {
    number: "03",
    title: "Campaigns & Activations",
    copy: "Seasonal menus, LTOs, catering pushes, tenant events, launches, holidays, promotions, and localized campaigns.",
  },
  {
    number: "04",
    title: "Asset Enhancement + Motion Transformation",
    copy: "Turn existing food, beverage, venue and hospitality photography into polished campaign assets and short-form motion through professional retouching, design, VFX and AI-assisted production.",
  },
  {
    number: "05",
    title: "Multi-Concept Creative Systems",
    copy: "Templates, asset libraries, scalable production workflows, and brand-safe systems that make it easier to support many concepts without making them all look identical.",
  },
  {
    number: "06",
    title: "Marketing Support",
    copy: "Campaign ideas, creative direction, content planning, channel recommendations, light performance analysis, and hands-on execution.",
  },
];

/** Short piece of copy preserving the "multi-concept" idea inside the
 * Capabilities section, after the former standalone "Multi-Concept
 * Portfolios" section (workflow boxes + channel pills + stacked concept
 * cards) was removed as visually empty and redundant. Wording kept exact
 * per direction — do not rewrite. */
export const SERVICES_MULTI_CONCEPT_NOTE =
  "Consistency behind the scenes. Distinct brands out front. I can support multiple Infuse concepts through one streamlined creative workflow while keeping each brand’s identity, campaigns, menus, social and guest-facing work distinct.";

/* ── Selected work ─────────────────────────────────────────────────────── */
export const WORK_EYEBROW = "SELECTED WORK";
export const WORK_HEADLINE = "Hospitality production, already understood.";
export const WORK_SUBCOPY =
  "Food and beverage first — restaurants, menus, seasonal campaigns, cocktails, plated food, and events. This is the kind of production I'd bring to Infuse's concepts.";

export const ELIZA_LABEL = "Eliza Hot Metal Bistro";
export const ELIZA_TAGS = "Restaurant · menus · seasonal campaigns · events · social";

export const INDIGO_LABEL = "Hotel Indigo Pittsburgh";
export const INDIGO_TAGS = "Hotel + F&B · campaigns · guest experience";

export const HAMPTON_LABEL = "Hampton Inn";
export const HAMPTON_TAGS = "Campaigns · events · guest experience";

export const MOTION_LABEL = "Hospitality Motion";
export const MOTION_COPY =
  "Food, beverage, and venue imagery transformed into scroll-stopping short-form creative.";

/* ── Proof / Track Record ─────────────────────────────────────────────── */
// Figures provided directly by Devon for this page (more current than
// lib/proof-stats.ts's grouped SHAIPE report figures, which power the
// public-site MetricsStrip). Kept page-local and not merged into the shared
// lib file, which other live public pages still read from.
export const PROOF_EYEBROW = "TRACK RECORD";
export const PROOF_HEADLINE = "What the work has already done.";
export const PROOF_STATS = [
  { value: "18.6M+", label: "Tracked impressions" },
  { value: "4.9M+", label: "Reach" },
  { value: "612K+", label: "Engagements" },
  { value: "2.7K+", label: "Creative pieces" },
] as const;
export const PROOF_NOTE =
  "Across tracked hotel, restaurant, event, and wellness campaigns. This page is about what that same capacity could do for Infuse.";

/* ── First 30 days ─────────────────────────────────────────────────────── */
export const THIRTY_EYEBROW = "GETTING STARTED";
export const THIRTY_HEADLINE = "A practical first 30 days.";
export const THIRTY_SUBCOPY = "The goal is reducing pressure on your team, starting immediately — not a long ramp-up.";

export const THIRTY_ITEMS = [
  "Learn the existing brand systems, priority concepts, marketing calendar, and approval process.",
  "Take immediate ownership of a defined creative or social workload.",
  "Organize the next 30 days of campaigns, menus, events, and content.",
  "Identify repeatable pieces that can become templates or systems.",
  "Establish a simple request → creation → approval → publishing workflow.",
] as const;

/* ── About Devon ───────────────────────────────────────────────────────── */
export const ABOUT_EYEBROW = "ABOUT DEVON";
export const ABOUT_NAME = "Devon Archer";
export const ABOUT_TITLE = "Founder, Archer Design";
export const ABOUT_COPY =
  "A hospitality-focused designer and creative technologist working across graphic design, social, motion, video, web, campaigns, AI-assisted creative production, and UX/UI.";
export const ABOUT_EXPERIENCE =
  "Recent and current hospitality work includes Hotel Indigo Pittsburgh University-Oakland, Eliza Hot Metal Bistro, and Hampton Inn properties — restaurant, hotel, and event creative built for real operating businesses, not case-study concepts.";

/* ── Final CTA ─────────────────────────────────────────────────────────── */
export const FINAL_LABEL = "JAIMIE, IF IT WOULD HELP";
export const FINAL_EYEBROW = "NEXT STEP";
export const FINAL_HEADLINE_LINE_1 = "Send me one current project.";
export const FINAL_HEADLINE_LINE_2 = "I'll show you how I'd approach it.";
export const FINAL_COPY =
  "It can be design, social, motion, email, a campaign, a sales presentation or something your team simply has not had time to get to.";
export const FINAL_CTA_PRIMARY = "Book a quick intro";
export const FINAL_CTA_SECONDARY = "View Full Archer Design Site";
export const FINAL_CTA_SECONDARY_HREF = "/";
/** Small optional secondary line beneath the CTA buttons, pointing to the
 * lowest-commitment entry point (the 30-day pilot, anchored at #pilot in
 * InfusePricing.tsx) for anyone not ready for "book an intro" yet. */
export const FINAL_SECONDARY_NOTE = "Or start with the 30-Day Infuse Creative Pilot.";
export const FINAL_SECONDARY_NOTE_HREF = "#pilot";
export const FINAL_LOGO_LINE = "Prepared specifically for Infuse Hospitality.";

/* ── Footer ────────────────────────────────────────────────────────────── */
// Deliberately NOT an "×" partnership lockup — this page must read as an
// Archer Design proposal prepared for Infuse, never as though Archer owns
// or operates Infuse, or that a partnership already exists.
export const FOOTER_LOCKUP = "Archer Design — prepared for Infuse Hospitality";
export const FOOTER_DISCLOSURE_LINE =
  "A private, personalized project overview prepared by Archer Design for Jaimie DeLeon at Infuse Hospitality, following an introduction from Rachel Cimino. Not commissioned, sponsored, endorsed, or approved by Infuse Hospitality. No partnership or engagement currently exists.";
