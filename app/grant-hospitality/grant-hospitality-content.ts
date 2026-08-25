// ─────────────────────────────────────────────────────────────────────────────
// grant-hospitality-content.ts: copy constants for the /grant-hospitality
// private partnership concept. Structurally cloned from
// app/bridgetown/bridgetown-content.ts (same section shape, same private/
// speculative disclosure pattern) per Devon's brief: "a very close visual,
// structural, and interactive clone of the existing Bridgetown partnership
// page." Only content genuinely specific to Bridgetown was rewritten.
//
// Every GRANT Hospitality company fact below was verified directly against
// GRANT's official site on 2026-08-06:
//   https://www.granthospitality.com/                       (home)
//   https://www.granthospitality.com/about/                 (about / team)
//   https://www.granthospitality.com/services/               (services)
//   https://www.granthospitality.com/hotel-business-strategy/
//   https://www.granthospitality.com/hotel-sales-support/
//   https://www.granthospitality.com/underperforming-hotels/
//   https://www.granthospitality.com/contact/
// No lead-generation databases were used. No client counts, RevPAR figures,
// occupancy results or retention rates are stated anywhere below, because
// GRANT's official site does not publish any -- see SCALE_QUALIFIER.
//
// One Bridgetown section was intentionally dropped rather than reskinned:
// "The Craft" (Bridgetown's photography/VFX/AI production-method essay) is
// entirely specific to Bridgetown's actual creative offer and has no GRANT
// analogue in the brief, so it does not appear here. Every other section
// below preserves its Bridgetown position, UI pattern and component.
// ─────────────────────────────────────────────────────────────────────────────

import { CALENDLY_URL } from "@/lib/seo";

// Same Calendly destination used by the live Bridgetown page -- read from
// the shared constant, never re-typed, so it can never drift.
export const PILOT_CALENDLY_URL = CALENDLY_URL;

/* ── Private / disclosure ─────────────────────────────────────────────── */
export const PRIVATE_LABEL_EYEBROW = "Private speculative concept";
export const PRIVATE_LABEL_SUB = "Prepared by Archer Design, not published, not indexed";

export const HERO_DISCLOSURE_MAIN =
  "Independent speculative concept prepared by Archer Design. This page was not commissioned, sponsored, endorsed or approved by GRANT Hospitality.";
export const HERO_DISCLOSURE_NOTE =
  "GRANT Hospitality's name, logo, services and publicly presented information are referenced solely to demonstrate a proposed partnership model.";

/* ── Nav ──────────────────────────────────────────────────────────────── */
export const NAV_ITEMS = [
  { href: "#fit", label: "Core Alignment" },
  { href: "#economics", label: "Partner Economics" },
  { href: "#work", label: "The Work" },
  { href: "#workflow", label: "How It Works" },
  { href: "#pilot", label: "The Pilot" },
];

/* ── Hero ─────────────────────────────────────────────────────────────── */
export const HERO_EYEBROW = "GRANT HOSPITALITY × ARCHER DESIGN";
export const HERO_HEADLINE = "Your sales team finds the opportunity. Archer helps the hotel bring it to market.";
export const HERO_PARAGRAPH_1 =
  "GRANT Hospitality builds hotel sales strategy, prospecting, account development, RFP activity and hands-on sales support. Archer Design turns those commercial priorities into polished campaigns, motion graphics, direct-booking visuals and property-level creative.";
export const HERO_PARAGRAPH_2 = "GRANT develops the sales opportunity. Archer helps the hotel bring it to market.";
export const HERO_PRIMARY_CTA = "Explore the Partnership";
export const HERO_SECONDARY_CTA = "Discuss a Pilot";

/* ── Note to Christine & Jana (single note, near top of hero) ──────────── */
export const HERO_NOTE_HEADING = "A note for the GRANT Hospitality team";
export const HERO_NOTE_BODY =
  "Christine, Jana and the GRANT Hospitality team, this concept shows how Archer Design could expand the creative-production side of your hotel sales engagements while GRANT continues to lead strategy, prospecting, client relationships and sales execution.";

/* ── Public GRANT facts (verified, current, non-numeric where a number
   isn't published) ──────────────────────────────────────────────────── */
export const SCALE_HEADING = "GRANT Hospitality at a glance";
export const SCALE_STATS = [
  { value: "2017", label: "Company launched" },
  { value: "120+", label: "Years of combined team experience" },
  { value: "16", label: "States served" },
  { value: "Small & mid-size", label: "Hotel focus" },
  { value: "Sales-first", label: "Consulting model" },
];
export const SCALE_QUALIFIER =
  "Public company information referenced from GRANT Hospitality's official website. Client needs and results vary by property and market.";

/* ── Core service alignment (Bridgetown's "Strategic fit" paired UI,
   rewritten for GRANT's sales focus -- 6 pairings instead of 5) ────────── */
export const STRATEGIC_FIT_EYEBROW = "Where the two services connect";
export const STRATEGIC_FIT_HEADING = "A sales opportunity only closes if the market can see it.";
export const STRATEGIC_FIT_INTRO =
  "GRANT already does the difficult work of finding, qualifying and advancing hotel sales opportunities. What most of those opportunities need next is finished, usable creative.";
export const STRATEGIC_FIT_PAIRS = [
  {
    identifies: "Corporate and local account development: target companies, decision-makers, negotiated-rate opportunities",
    produces: "Account-facing property one-sheets, corporate offer visuals, branded outreach graphics, reusable benefit materials",
  },
  {
    identifies: "Group, meeting and event business: prospecting, lead follow-up, contracting support",
    produces: "Meeting-space campaigns, event and wedding promotional assets, social and digital graphics using approved imagery",
  },
  {
    identifies: "RFP and negotiated-account activity: responses, rate and term discussions, account information",
    produces: "Polished visual collateral, amenity and differentiator highlights, reusable account-facing assets in multiple formats",
  },
  {
    identifies: "Underperforming hotels and repositioning: market review, visibility gaps, sales-recovery strategy",
    produces: "Refreshed campaign presentation, need-period creative, motion graphics from approved photography",
  },
  {
    identifies: "Workforce and extended-stay demand: local projects, decision-maker relationships, rate discussions",
    produces: "Extended-stay offer graphics, amenity-led campaigns, account-facing and guest-facing assets, rapid property variations",
  },
  {
    identifies: "Hotel visibility and market differentiation: what to emphasize, ideal guests, competitive review",
    produces: "Finished visual stories, property and outlet campaigns, consistent digital creative, an expanded content library",
  },
];
export const STRATEGIC_FIT_NOTE =
  "These are examples of how the partnership could work, not a guarantee that every deliverable is included automatically.";

/* ── Selected hospitality work (reuses Archer's existing, already-approved
   /tcrm media -- generic body-of-work proof, not GRANT-branded content) ── */
export const WORK_EYEBROW = "Selected hospitality work";
export const WORK_HEADING = "Sales priorities, turned into finished creative.";
export const WORK_FOOTNOTE =
  "Shown clean, without permanent promotional copy. Headlines, offers, logos and calls to action are added per approved campaign.";

/* ── How it works ────────────────────────────────────────────────────── */
export const WORKFLOW_EYEBROW = "From sales priority to live campaign";
export const WORKFLOW_HEADING = "How it works";
export const WORKFLOW_STEPS = [
  { idx: "01", title: "GRANT identifies the priority", body: "Target account, group opportunity, need period, underperforming segment, RFP, repositioning need or collateral gap." },
  { idx: "02", title: "GRANT defines the sales objective", body: "Audience, offer, account, timing, approved sales direction and required property information." },
  { idx: "03", title: "The property supplies approved assets", body: "Photography, logos, brand guidelines, offer details, meeting-space information, amenity details, approved claims." },
  { idx: "04", title: "Archer produces the creative", body: "Motion, static graphics, account-facing collateral, campaign adaptations, digital and social exports." },
  { idx: "05", title: "Coordinated review", body: "GRANT validates the sales objective, the hotel validates property information and brand requirements." },
  { idx: "06", title: "The assets go to market", body: "The hotel or GRANT uses the approved creative in the agreed channels." },
];
export const WORKFLOW_CLOSING = "Sales strategy should not stop at a recommendation. The opportunity should move into finished materials the hotel can actually use.";

/* ── Who controls what ──────────────────────────────────────────────── */
export const CONTROL_HEADING = "Who controls what";
export const GRANT_CONTROLS = [
  "Hotel sales strategy",
  "Market analysis",
  "Prospecting",
  "Account development",
  "RFP activity",
  "Rate and term discussions within its approved scope",
  "Sales-team coordination",
  "Client relationship",
  "Sales reporting",
  "Final sales-direction approval",
];
export const ARCHER_DELIVERS = [
  "Motion graphics",
  "Static campaign graphics",
  "Digital campaign production",
  "Direct-booking creative",
  "Meetings and event promotion",
  "F&B and outlet promotion",
  "Property one-sheets and visual collateral",
  "Multi-format adaptations",
  "Organized delivery",
  "Creative-production workflow",
];
export const HOTEL_RETAINS = [
  "Final factual approval",
  "Brand approval",
  "Offer approval",
  "Legal approval",
  "Rights and permissions for supplied assets",
  "Final decision on where and when materials are published",
];

/* ── Operating models ────────────────────────────────────────────────── */
export const OPERATING_MODELS_HEADING = "Three ways this could work.";
export const OPERATING_MODELS = [
  {
    key: "referral",
    subtitle: "Model A",
    title: "Qualified Referral",
    intro: "GRANT introduces a hotel that needs ongoing creative support. Archer contracts and delivers directly. The referral structure is documented before introduction.",
    note: "Simple. Separate contracts, separate billing. Best for occasional needs.",
  },
  {
    key: "addon",
    subtitle: "Model B",
    badge: "Best fit for repeatable production",
    title: "GRANT-Approved Creative Add-On",
    intro: "GRANT includes Archer's creative-production capacity within a broader hotel sales engagement. GRANT may remain the primary client relationship. Archer works under an approved wholesale, subcontractor or white-label structure.",
    note: "GRANT holds the relationship. Properties opt in. Scope stays transparent.",
  },
  {
    key: "integrated",
    subtitle: "Model C",
    title: "Integrated Sales + Creative Engagement",
    intro: "GRANT and Archer are both included in the approved hotel scope. GRANT leads hotel sales strategy and execution. Archer leads creative production.",
    note: "Responsibilities, pricing and payment structure confirmed in an opportunity-specific addendum. Strongest for pilots, transitions and multi-property opportunities.",
  },
];
export const OPERATING_MODELS_NOTE =
  "The relationship is non-exclusive, flexible by opportunity, between independent companies, and subject to written approval. Every commercial arrangement would require mutual approval and a written agreement.";

/* ── Why each side says yes ─────────────────────────────────────────── */
export const VALUE_HEADING = "Why each side says yes";
export const VALUE_COLUMNS = [
  {
    key: "hotel",
    title: "For the hotel",
    points: [
      "Sales opportunities supported by usable creative",
      "faster property-level execution",
      "more consistent campaign presentation",
      "less coordination between disconnected vendors",
      "creative tied to actual sales priorities",
    ],
  },
  {
    key: "grant",
    title: "For GRANT",
    points: [
      "Expanded specialist production capacity",
      "additional value for existing hotel relationships",
      "more polished delivery of sales recommendations",
      "ability to support recurring campaign needs",
      "potential partner margin without building a full internal motion team",
      "stronger continuity between sales strategy and market-facing materials",
    ],
  },
  {
    key: "archer",
    title: "For Archer",
    points: [
      "Qualified hospitality opportunities",
      "clear sales direction",
      "repeatable property-level production",
      "recurring partner channel",
      "better access to approved hotel priorities and assets",
    ],
  },
];

/* ── Best-fit clients ───────────────────────────────────────────────── */
export const IDEAL_CLIENT_HEADING = "The properties this suits.";
export const STRONG_FIT_LABEL = "Strong-fit properties";
export const STRONG_FIT_ITEMS = [
  "Small and medium-sized hotels",
  "independent hotels",
  "branded select-service hotels",
  "hotels without a complete onsite sales team",
  "underperforming hotels",
  "properties entering repositioning periods",
  "hotels pursuing corporate or negotiated-rate business",
  "hotels pursuing group and meeting business",
  "properties with approved photography but limited production capacity",
  "hotels that need recurring sales-support creative",
  "owners and operators managing several participating properties",
];
export const POOR_FIT_LABEL = "Poor-fit situations";
export const POOR_FIT_ITEMS = [
  "Hotels seeking only one isolated graphic",
  "properties unwilling to supply approved information and assets",
  "hotels without a clear approval owner",
  "properties expecting guaranteed bookings or revenue",
  "hotels that cannot approve offers or factual property claims",
  "engagements without a defined GRANT or hotel decision-maker",
];
export const IDEAL_CLIENT_NOTE =
  "Reflects the property type GRANT already serves, based on its published client profile. Not a list of confirmed or current Archer Design clients.";

/* ── The pilot ───────────────────────────────────────────────────────── */
export const PILOT_EYEBROW = "Getting started";
export const PILOT_HEADING = "Three to five hotels. Ninety days.";
export const PILOT_PHASES = [
  {
    idx: "01",
    title: "Select",
    items: [
      "Identify suitable GRANT client properties",
      "Confirm the hotel's sales priorities",
      "Select the creative-production level",
      "Document client, partner and approval responsibilities",
    ],
  },
  {
    idx: "02",
    title: "Set Up",
    items: [
      "Collect approved brand and property assets",
      "Establish request and approval workflow",
      "Confirm delivery calendar",
      "Establish baseline priorities",
    ],
  },
  {
    idx: "03",
    title: "Produce & Activate",
    items: [
      "Translate active sales opportunities into creative",
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
      "Review hotel and GRANT feedback",
      "Identify renewal or expansion opportunities",
      "Finalize the longer-term partnership structure",
    ],
  },
];
export const PILOT_NOTE = "The creative alone does not produce hotel revenue; it supports the sales strategy GRANT is already running.";
export const PILOT_CTA = "Discuss a Pilot";

/* ── Proof of execution (Archer's own proof -- identical figures and
   qualifier language to /bridgetown, so the two pages never show
   conflicting numbers for the same underlying body of work) ──────────── */
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
  "That result came from connecting events, F&B, meetings, local demand drivers, seasonal priorities and property storytelling to one consistent creative calendar. That's the same execution this model would bring to a GRANT-identified priority.";
export const PROOF_FOOTNOTE =
  "Results reflect tracked hospitality campaigns and vary by property, audience, offer, platform, publishing strategy, media budget, season and market. The performance statement reflects reporting shared by the property during the engagement and is not an independently audited brand-wide claim. Shown as existing Archer Design work, unrelated to GRANT Hospitality. Property names reflect Archer's property-level experience and do not imply corporate endorsement. Past results and portfolio examples do not guarantee future hotel performance.";

/* ── Personal note ───────────────────────────────────────────────────── */
export const NOTE_SALUTATION = "Christine, Jana and the GRANT Hospitality team,";
export const NOTE_PARAGRAPHS = [
  "GRANT already performs the difficult work of identifying sales opportunities, building account relationships, managing RFP activity and helping hotels compete more effectively.",
  "The opportunity I see is not to change that process. It is to give your team an additional creative-production resource when a hotel needs polished, recurring materials to support the strategy.",
  "Archer can take approved property photography, offers, meeting-space information, outlet priorities and sales direction and turn them into finished motion graphics, campaign assets and account-facing creative.",
  "The goal is simple: GRANT continues to lead the hotel's sales strategy and relationship. Archer helps bring those priorities to market.",
];
export const NOTE_SIGNATURE = "Devon Archer, Founder, Archer Design";

/* ── Closing ──────────────────────────────────────────────────────────── */
export const FINAL_EYEBROW = "GRANT Hospitality × Archer Design";
export const FINAL_HEADING = "GRANT develops the opportunity. Archer helps bring it to market.";
export const FINAL_COPY =
  "A flexible creative-production partnership for hotel sales campaigns, account development, meetings and events, need periods and recurring property-level execution.";
export const FINAL_PRIMARY_CTA = "Discuss a Pilot";
export const FINAL_SECONDARY_CTA = "View Archer's Work";

/* ── Footer ───────────────────────────────────────────────────────────── */
export const FOOTER_DISCLAIMER =
  "Independent speculative concept prepared by Archer Design. This page was not commissioned, sponsored, endorsed or approved by GRANT Hospitality. GRANT Hospitality's name, logo, services and publicly presented information are referenced solely to demonstrate a proposed partnership model. All pricing, margins and participation scenarios are illustrative and subject to negotiation and written agreement.";

/* ── Official GRANT contact reference (verified against granthospitality.com
   /contact/ on 2026-08-06; shown nowhere as an active mailto/tel link on
   this page, kept here only as a sourced reference for the record) ────── */
export const GRANT_OFFICIAL_PHONE = "720-460-1584";
export const GRANT_OFFICIAL_EMAIL = "info@granthospitality.com";
