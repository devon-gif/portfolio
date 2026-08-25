// ─────────────────────────────────────────────────────────────────────────────
// jacaruso-content.ts: copy constants for the /jacaruso private partnership
// concept. Structurally cloned from app/grant-hospitality/grant-hospitality-content.ts
// and app/bridgetown/bridgetown-content.ts (same section shape, same
// private/speculative disclosure pattern) per Devon's brief: build this in
// the same visual system, quality level and overall structure as the
// existing Bridgetown / GRANT partnership pages.
//
// Every Jacaruso Enterprises company fact below was verified directly
// against Jacaruso's official site on 2026-08-06:
//   https://jacaruso.com/                              (home)
//   https://jacaruso.com/about/                         (about)
//   https://jacaruso.com/hotel-sales-support-services/  (core service)
//   https://jacaruso.com/press-room/                    (press / leadership)
// No lead-generation databases were used. No current active client count,
// exact portfolio count, guaranteed results or unsupported performance
// claims are stated anywhere below -- see SCALE_QUALIFIER. The only
// personnel named below (Toni Jacaruso, Founder; Jason Webb, CEO) are drawn
// directly from Jacaruso's own official Press Room coverage of Jason Webb's
// October 2025 CEO appointment and the About page's founder attribution.
// ─────────────────────────────────────────────────────────────────────────────

import { CALENDLY_URL } from "@/lib/seo";

// Same Calendly destination used by the live Bridgetown/GRANT pages --
// read from the shared constant, never re-typed, so it can never drift.
export const PILOT_CALENDLY_URL = CALENDLY_URL;

/* ── Private / disclosure ─────────────────────────────────────────────── */
export const PRIVATE_LABEL_EYEBROW = "Private speculative concept";
export const PRIVATE_LABEL_SUB = "Prepared by Archer Design, not published, not indexed";

export const HERO_DISCLOSURE_MAIN =
  "Independent speculative concept prepared by Archer Design. This page was not commissioned, sponsored, endorsed, or approved by Jacaruso Enterprises.";
export const HERO_DISCLOSURE_NOTE =
  "Jacaruso Enterprises' name, logo, services, and publicly presented information are referenced solely to demonstrate a proposed partnership model.";

/* ── Nav ──────────────────────────────────────────────────────────────── */
export const NAV_ITEMS = [
  { href: "#fit", label: "Partnership Fit" },
  { href: "#economics", label: "Partner Economics" },
  { href: "#work", label: "The Work" },
  { href: "#workflow", label: "How It Works" },
  { href: "#pilot", label: "The Pilot" },
];

/* ── Hero ─────────────────────────────────────────────────────────────── */
export const HERO_EYEBROW = "JACARUSO ENTERPRISES × ARCHER DESIGN";
export const HERO_HEADLINE = "Your sales team uncovers the opportunity. Archer helps the hotel bring it to market.";
export const HERO_PARAGRAPH_1 =
  "Jacaruso Enterprises helps hotels build pipeline through prospecting, account development, RFP support, sales coverage, and commercial strategy. Archer Design turns those priorities into polished motion graphics, direct-booking visuals, campaign assets, and property-level creative.";
export const HERO_PARAGRAPH_2 = "Jacaruso creates the sales opportunity. Archer helps the hotel bring it to market.";
export const HERO_PRIMARY_CTA = "Explore the Partnership";
export const HERO_SECONDARY_CTA = "Discuss a Pilot";

/* ── Note to the Jacaruso team (single note, near top of hero) ─────────── */
export const HERO_NOTE_HEADING = "A note for the Jacaruso Enterprises team";
export const HERO_NOTE_BODY =
  "This concept shows how Archer Design could serve as an added creative-production layer for Jacaruso-supported hotels, helping turn approved commercial priorities into finished campaigns and guest-facing assets while Jacaruso continues to lead sales strategy, prospecting, and the hotel relationship.";

/* ── Public Jacaruso facts (verified, current) ──────────────────────────── */
export const SCALE_HEADING = "Jacaruso Enterprises at a glance";
export const SCALE_STATS = [
  { value: "2007", label: "Founded" },
  { value: "3,500+", label: "Hotels supported" },
  { value: "US, Canada & Latin America", label: "Geographic reach" },
  { value: "Branded & independent", label: "Hotel types supported" },
  { value: "Prospecting, RFPs & sales support", label: "Core focus" },
];
export const SCALE_QUALIFIER =
  "Public company information referenced from Jacaruso Enterprises' official website. Results and client needs vary by property and market.";

/* ── Partnership fit / opportunity (5 pairings per the brief) ──────────── */
export const STRATEGIC_FIT_EYEBROW = "Where the two services connect";
export const STRATEGIC_FIT_HEADING = "A sales opportunity only closes if the market can see it.";
export const STRATEGIC_FIT_INTRO =
  "Jacaruso already does the difficult work of finding, qualifying and advancing hotel sales opportunities. What most of those opportunities need next is finished, usable creative.";
export const STRATEGIC_FIT_PAIRS = [
  {
    identifies: "Prospecting and account development: identifying target accounts, developing outreach and pipeline, supporting negotiated-rate and account activity",
    produces: "Polished property one-sheets, visual support for account-facing outreach, property-specific campaign assets",
  },
  {
    identifies: "Group and meeting demand: supporting group lead development, helping advance meeting and event business",
    produces: "Meetings, weddings and event promotional creative, campaign graphics and short-form motion",
  },
  {
    identifies: "RFP and hotel sales support: managing response activity, helping hotels stay organized commercially",
    produces: "Sales-support visuals, amenity graphics, and supporting creative materials",
  },
  {
    identifies: "Underperforming or transition periods: helping stabilize or improve hotel sales activity",
    produces: "Need-period campaigns and visually stronger commercial storytelling",
  },
  {
    identifies: "Multi-property scalability: supporting many properties across different hotel contexts",
    produces: "A repeatable creative-production system for participating properties, without an internal motion department",
  },
];
export const STRATEGIC_FIT_NOTE =
  "These are examples of how the partnership could work, not a guarantee that every deliverable is included automatically.";

/* ── Selected hospitality work (reuses Archer's existing, already-approved
   /tcrm media -- generic body-of-work proof, not Jacaruso-branded content) ── */
export const WORK_EYEBROW = "Selected hospitality work";
export const WORK_HEADING = "Sales priorities, turned into finished creative.";
export const WORK_FOOTNOTE =
  "Shown clean, without permanent promotional copy. Headlines, offers, logos and calls to action are added per approved campaign.";

/* ── How it works ────────────────────────────────────────────────────── */
export const WORKFLOW_EYEBROW = "From sales priority to live campaign";
export const WORKFLOW_HEADING = "How it works";
export const WORKFLOW_STEPS = [
  { idx: "01", title: "Jacaruso identifies the priority", body: "Account development need, group opportunity, need period, underperforming segment, RFP support need or collateral gap." },
  { idx: "02", title: "Sales direction is defined", body: "Target audience, timing, offer or campaign direction, approved hotel focus, and commercial objective." },
  { idx: "03", title: "Approved property materials are supplied", body: "Photography, logos, brand guidance, amenity details, offer details, and approved claims." },
  { idx: "04", title: "Archer produces the creative", body: "Motion graphics, static graphics, property visuals, account-facing collateral, social exports, campaign variations." },
  { idx: "05", title: "Coordinated review", body: "Jacaruso validates the sales objective; the hotel validates property facts and brand requirements; Archer completes the agreed revision process." },
  { idx: "06", title: "Assets go to market", body: "The hotel or Jacaruso uses the approved materials in the intended channels." },
];
export const WORKFLOW_CLOSING = "Sales recommendations should not stop at strategy. They should become polished materials the hotel can actually use.";

/* ── Who controls what ──────────────────────────────────────────────── */
export const CONTROL_HEADING = "Who controls what";
export const JACARUSO_CONTROLS = [
  "Sales strategy",
  "Prospecting",
  "Account development",
  "RFP activity",
  "Sales support",
  "Hotel relationship",
  "Commercial direction",
  "Sales coverage",
  "Sales reporting",
  "Final sales-priority approval",
];
export const ARCHER_DELIVERS = [
  "Motion graphics",
  "Static campaign design",
  "Direct-booking visuals",
  "Property one-sheets and polished collateral",
  "Meetings and event creative",
  "F&B and outlet creative",
  "Multi-format adaptations",
  "Organized delivery",
  "Recurring creative-production capacity",
];
export const HOTEL_RETAINS = [
  "Factual approval",
  "Brand approval",
  "Legal approval",
  "Final publishing decisions",
  "Rights and permissions for supplied assets",
];

/* ── Operating models ────────────────────────────────────────────────── */
export const OPERATING_MODELS_HEADING = "Three ways this could work.";
export const OPERATING_MODELS = [
  {
    key: "referral",
    subtitle: "Model A",
    title: "Referral",
    intro: "Jacaruso introduces a hotel that needs creative support. Archer contracts directly with the hotel. The referral and payment structure is documented in writing.",
    note: "Simple. Separate contracts, separate billing. Best for occasional needs.",
  },
  {
    key: "addon",
    subtitle: "Model B",
    badge: "Best fit for repeatable production",
    title: "Approved Add-On",
    intro: "Jacaruso includes Archer as a creative-production layer inside a broader Jacaruso engagement. Jacaruso may remain the lead relationship. Archer works in an approved vendor, wholesale or white-label structure.",
    note: "Jacaruso holds the relationship. Properties opt in. Scope stays transparent.",
  },
  {
    key: "integrated",
    subtitle: "Model C",
    title: "Integrated Engagement",
    intro: "Jacaruso and Archer are both included in a coordinated hotel scope. Jacaruso leads sales support. Archer leads creative production. Opportunity-specific commercial terms are documented in writing.",
    note: "Coordinated onboarding, connected reporting. Strongest for pilots, transitions and multi-property opportunities.",
  },
];
export const OPERATING_MODELS_NOTE =
  "The relationship is non-exclusive, flexible by opportunity, between independent companies, and subject to written agreement. Every commercial arrangement would require mutual approval.";

/* ── Why each side says yes ─────────────────────────────────────────── */
export const VALUE_HEADING = "Why each side says yes";
export const VALUE_COLUMNS = [
  {
    key: "hotel",
    title: "For the hotel",
    points: [
      "Sales priorities supported by polished creative",
      "faster execution",
      "improved campaign presentation",
      "better use of approved photography",
      "less friction between commercial direction and creative output",
    ],
  },
  {
    key: "jacaruso",
    title: "For Jacaruso",
    points: [
      "Deeper service value",
      "added specialist production capacity",
      "ability to support recurring hotel creative needs",
      "stronger commercial execution",
      "potential partner margin without hiring a full internal motion/design team",
    ],
  },
  {
    key: "archer",
    title: "For Archer",
    points: [
      "Qualified hotel opportunities",
      "clearer commercial direction",
      "repeatable production",
      "recurring hospitality work",
      "a stronger partner channel",
    ],
  },
];

/* ── Best-fit clients ───────────────────────────────────────────────── */
export const IDEAL_CLIENT_HEADING = "The properties this suits.";
export const STRONG_FIT_LABEL = "Strong-fit hotel situations";
export const STRONG_FIT_ITEMS = [
  "Independent hotels",
  "branded select-service properties",
  "hotels without a full onsite sales team",
  "underperforming properties",
  "hotels needing stronger collateral or campaign support",
  "properties with approved photography but weak output volume",
  "owners and operators managing multiple participating properties",
  "hotels pursuing group, account or need-period demand",
];
export const POOR_FIT_LABEL = "Poor-fit situations";
export const POOR_FIT_ITEMS = [
  "One-off requests with no real process",
  "properties unwilling to provide approved materials",
  "unclear ownership or approval structure",
  "expectation of guaranteed bookings",
  "undefined scope or decision-maker",
];
export const IDEAL_CLIENT_NOTE =
  "Reflects the property type Jacaruso already serves, based on its published client profile. Not a list of confirmed or current Archer Design clients.";

/* ── The pilot ───────────────────────────────────────────────────────── */
export const PILOT_EYEBROW = "Getting started";
export const PILOT_HEADING = "Three to five hotels. Ninety days.";
export const PILOT_PHASES = [
  {
    idx: "01",
    title: "Select",
    items: [
      "Identify suitable Jacaruso-supported properties",
      "Confirm each hotel's sales priorities",
      "Select the creative-production level",
      "Document Jacaruso, Archer and hotel responsibilities",
    ],
  },
  {
    idx: "02",
    title: "Set Up",
    items: [
      "Collect approved property and brand assets",
      "Establish request and approval workflow",
      "Confirm delivery calendar",
      "Establish baseline sales priorities",
    ],
  },
  {
    idx: "03",
    title: "Produce & Activate",
    items: [
      "Translate active sales priorities into creative",
      "Deliver monthly production",
      "Track approvals and bottlenecks",
      "Refine the workflow",
    ],
  },
  {
    idx: "04",
    title: "Review",
    items: [
      "Evaluate delivery speed",
      "Review hotel and Jacaruso feedback",
      "Identify renewal or expansion opportunities",
      "Finalize the longer-term partnership structure",
    ],
  },
];
export const PILOT_NOTE = "The creative alone does not produce hotel revenue; it supports the sales strategy Jacaruso is already running.";
export const PILOT_CTA = "Discuss a Pilot";

/* ── Proof of execution (Archer's own proof -- identical figures and
   qualifier language to /bridgetown and /grant-hospitality, so no page
   ever shows conflicting numbers for the same underlying body of work) ── */
export const PROOF_EYEBROW = "Archer proof";
export const PROOF_STATS = [
  { value: "2.64K", label: "Published social posts" },
  { value: "16.05M", label: "Impressions" },
  { value: "5.2M", label: "People reached" },
  { value: "596.43K", label: "Engagements" },
];
export const CONFIDENCE_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming the top-performing Hotel Indigo on the East Coast.";
export const CONFIDENCE_SUPPORTING =
  "That result came from connecting events, F&B, meetings, local demand drivers, seasonal priorities and property storytelling to one consistent creative calendar. That's the same execution this model would bring to a Jacaruso-identified priority.";
export const PROOF_FOOTNOTE =
  "Results reflect tracked hospitality campaigns and vary by property, audience, offer, platform, publishing strategy, media budget, season and market. The performance statement reflects reporting shared by the property during the engagement and is not an independently audited brand-wide claim. Shown as existing Archer Design work, unrelated to Jacaruso Enterprises. Property names reflect Archer's property-level experience and do not imply corporate endorsement. Past results and portfolio examples do not guarantee future hotel performance.";

/* ── Personal note ───────────────────────────────────────────────────── */
export const NOTE_SALUTATION = "Toni, Jason and the Jacaruso Enterprises team,";
export const NOTE_PARAGRAPHS = [
  "Jacaruso already performs the difficult work of prospecting, developing accounts, managing RFP activity, and giving hotels sales coverage they would otherwise have to hire and manage in-house.",
  "The opportunity I see is not to change that process. It is to give your team an additional creative-production resource when a hotel needs polished, recurring materials to support the sales strategy already in motion.",
  "Archer can take approved property photography, offers, meeting-space information, and sales direction and turn them into finished motion graphics, campaign assets, and account-facing creative.",
  "The goal is simple: Jacaruso continues to lead the hotel's sales strategy and relationship. Archer helps bring those priorities to market.",
];
export const NOTE_SIGNATURE = "Devon Archer, Founder, Archer Design";

/* ── Closing ──────────────────────────────────────────────────────────── */
export const FINAL_EYEBROW = "Jacaruso Enterprises × Archer Design";
export const FINAL_HEADING = "Jacaruso uncovers the opportunity. Archer helps bring it to market.";
export const FINAL_COPY =
  "A flexible creative-production partnership for hotel sales campaigns, account development, need periods, direct-booking support, group business, and recurring property-level execution.";
export const FINAL_PRIMARY_CTA = "Discuss a Pilot";
export const FINAL_SECONDARY_CTA = "View Archer's Work";

/* ── Footer ───────────────────────────────────────────────────────────── */
export const FOOTER_DISCLAIMER =
  "Independent speculative concept prepared by Archer Design. This page was not commissioned, sponsored, endorsed, or approved by Jacaruso Enterprises. Jacaruso Enterprises' name, logo, services, and publicly presented information are referenced solely to demonstrate a proposed partnership model. All pricing, margins and participation scenarios are illustrative and subject to negotiation and written agreement.";

/* ── Official Jacaruso contact reference (verified against jacaruso.com
   footer/contact on 2026-08-06; shown nowhere as an active mailto/tel link
   on this page, kept here only as a sourced reference for the record) ──── */
export const JACARUSO_OFFICIAL_PHONE = "888-362-7620";
export const JACARUSO_OFFICIAL_ADDRESS = "405 County Road 135, Hutto, TX 78634";
