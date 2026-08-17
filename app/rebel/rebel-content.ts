// ─────────────────────────────────────────────────────────────────────────────
// rebel-content.ts: copy constants for the /rebel private partnership
// concept.
//
// VOICE: short, plain, concrete. The reader should be able to answer
// "what does Archer do, and what is being offered?" within the first two
// sentences of the hero. Third person ("Archer") through the page body,
// first person only inside the signed personal note. No stacked
// qualifiers, no sentence that restates the one before it.
//
// Every Rebel Hotel Company fact below was verified directly against
// Rebel's official site and press coverage on 2026-08-17:
//   https://www.rebelhotelcompany.com/                     (home)
//   https://www.rebelhotelcompany.com/en/who-we-are.html   (leadership)
//   https://www.rebelhotelcompany.com/en/what-we-do.html   (services)
//   https://www.rebelhotelcompany.com/en/portfolio.html    (portfolio)
//   https://www.hotelmanagement.net/operate/rebel-hotel-companys-renegade-hotels-expands-10-hotels
//     (Renegade Hotels reaching 10 properties, Oct 6 2025, Jena Tesse Fox)
// No lead-generation databases were used. No current total property count,
// revenue figures, guaranteed results, or client needs are invented
// anywhere below -- see SCALE_QUALIFIER. The only personnel named below
// (Sherrin Thomas, Executive Director of Sales & Marketing) is drawn
// directly from Rebel's own "Who We Are" leadership page. This page does
// not imply any particular Rebel property has requested or received
// Archer services.
//
// The legal disclosure strings (HERO_DISCLOSURE_*, FOOTER_DISCLAIMER,
// PROOF_FOOTNOTE, PORTFOLIO_NOTE, CONNECT_NOTE, SCALE_QUALIFIER) are
// tightened for readability but keep every substantive protection.
// ─────────────────────────────────────────────────────────────────────────────

import { CALENDLY_URL } from "@/lib/seo";
import type { RebelMotionCategory } from "./rebel-motion-data";

// Same Calendly destination used by the live Bridgetown/GRANT/Jacaruso
// pages -- read from the shared constant, never re-typed, so it can never
// drift.
export const PILOT_CALENDLY_URL = CALENDLY_URL;

/* ── Private / disclosure ─────────────────────────────────────────────── */
export const PRIVATE_LABEL_EYEBROW = "Private speculative concept";
export const PRIVATE_LABEL_SUB = "Prepared by Archer Design. Not published, not indexed.";

// Single-line, unobtrusive disclosure shown immediately below the hero
// (not inside it) -- the fuller disclosure still lives in the footer.
export const HERO_DISCLOSURE =
  "Private speculative partnership concept prepared by Archer Design. Not commissioned or approved by Rebel Hotel Company.";

/* ── Nav ──────────────────────────────────────────────────────────────── */
export const NAV_ITEMS = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#economics", label: "Economics" },
  { href: "#connect", label: "Where We Fit" },
  { href: "#workflow", label: "How It Works" },
  { href: "#pilot", label: "The Pilot" },
];

/* ── Hero (kept deliberately minimal -- video is the dominant visual) ──── */
export const HERO_EYEBROW = "REBEL HOTEL COMPANY × ARCHER DESIGN";
export const HERO_HEADLINE_LINE_1 = "Rebel keeps the strategy.";
export const HERO_HEADLINE_LINE_2 = "Archer adds the production capacity.";
export const HERO_BODY =
  "On-demand hospitality creative for participating Rebel properties — motion, social, F&B, events, weddings, and campaign assets.";
export const HERO_PRIMARY_CTA = "Discuss a Pilot";

/* ── Public Rebel facts (verified, current) ─────────────────────────────── */
export const SCALE_HEADING = "Rebel Hotel Company at a glance";
export const SCALE_STATS = [
  { value: "3 platforms", label: "Rebel Hotels & Resorts, Reserve Collection, Renegade Hotels" },
  { value: "10 hotels", label: "Renegade Hotels focused-service properties, Oct 2025" },
  { value: "Urban, resort & lifestyle", label: "Portfolio markets" },
  { value: "Independent, branded & focused-service", label: "Property types managed" },
  { value: "New York & Jupiter, FL", label: "Headquarters" },
];
export const SCALE_QUALIFIER =
  "Public information from Rebel Hotel Company's official website and Hotel Management's October 2025 coverage of Renegade Hotels. Needs vary by property and market.";

/* ── One portfolio, many different stories ──────────────────────────────── */
export const PORTFOLIO_EYEBROW = "Portfolio diversity";
export const PORTFOLIO_HEADING = "One portfolio. Many different stories to tell.";
export const PORTFOLIO_INTRO =
  "Rebel runs three platforms: independent and lifestyle hotels through Reserve Collection, branded full-service through Rebel Hotels & Resorts, and focused-service through Renegade Hotels. An independent hotel's F&B calendar looks nothing like a focused-service property's need-period push. The creative has to be built per property, not stamped from one template.";
export const PORTFOLIO_NOTE =
  "Shown to illustrate the range of property types across Rebel's platforms, based on Rebel's own published portfolio. Not a statement that any specific property has requested or received Archer services.";

/* ── Creative capacity without another department ──────────────────────── */
export const CAPACITY_EYEBROW = "Capacity, not another agency";
export const CAPACITY_HEADING = "Creative capacity without another department.";
export const CAPACITY_INTRO = "Rebel already owns the thinking. What's missing is hands to produce it.";
export const CAPACITY_BODY =
  "One property needs two assets this month — use two. A launch, event calendar or F&B program needs twenty — scale up. Demand slows — the cost slows with it.";
export const CAPACITY_POINTS = [
  "No permanent design headcount",
  "No motion department to build",
  "No requirement that every property participate",
];

/* ── Where Rebel + Archer connect ────────────────────────────────────────── */
export const CONNECT_EYEBROW = "Where Rebel + Archer connect";
export const CONNECT_HEADING = "What Rebel asks for. What Archer makes.";
export const CONNECT_INTRO = "Rebel sets the priority. Archer produces what that priority needs, at whatever volume it takes.";
export const CONNECT_PAIRS: { identifies: string; produces: string; motionCategory: RebelMotionCategory }[] = [
  {
    identifies: "F&B / outlet priority",
    produces: "Restaurant motion, menu launches, event and local-market promos",
    motionCategory: "fb",
  },
  {
    identifies: "Need period",
    produces: "Campaign visuals, direct-booking creative, seasonal assets",
    motionCategory: "branded-full-service",
  },
  {
    identifies: "Meetings / weddings / groups",
    produces: "Event motion, meeting-space assets, sales-support creative",
    motionCategory: "campaigns",
  },
  {
    identifies: "Destination / leisure",
    produces: "Property storytelling and experience-led motion",
    motionCategory: "destination",
  },
  {
    identifies: "Launch / repositioning",
    produces: "Launch assets, social rollout, multi-format production",
    motionCategory: "independent-lifestyle",
  },
  {
    identifies: "Multi-property execution",
    produces: "Repeatable production that keeps each property's own look",
    motionCategory: "focused-service",
  },
];
export const CONNECT_NOTE =
  "Examples of overflow and specialist production support — not a list of things Rebel lacks, and not a guarantee every deliverable is automatically included.";

/* ── How it works ────────────────────────────────────────────────────── */
export const WORKFLOW_EYEBROW = "Priority to live campaign";
export const WORKFLOW_HEADING = "How it works";
export const WORKFLOW_STEPS = [
  { idx: "01", title: "Rebel flags the need", body: "A property priority, campaign, event, outlet or production backlog." },
  { idx: "02", title: "Direction gets approved", body: "Objective, audience, offer, brand direction and the outputs required." },
  { idx: "03", title: "Assets come to Archer", body: "Photography, video, logos, brand standards, copy and offer details." },
  { idx: "04", title: "Archer produces", body: "Motion graphics, campaign creative, social, F&B and event assets." },
  { idx: "05", title: "Rebel approves and publishes", body: "One coordinated review. Final files organized and ready to post." },
];
export const WORKFLOW_CLOSING = "Archer doesn't need to own the strategy to make it easier to execute.";

/* ── Who controls what ──────────────────────────────────────────────── */
export const CONTROL_HEADING = "Who controls what";
export const REBEL_CONTROLS = [
  "Commercial strategy",
  "Sales & marketing direction",
  "Brand strategy",
  "Property priorities",
  "Owner relationship",
  "Approval structure",
  "Pricing & offer strategy",
  "Channel strategy",
];
export const ARCHER_DELIVERS = [
  "Motion graphics",
  "Campaign production",
  "Social creative",
  "F&B & event creative",
  "Meetings & weddings creative",
  "Property promotional assets",
  "Multi-format adaptations",
  "Recurring monthly production",
];
export const PROPERTY_RETAINS = [
  "Factual approval",
  "Brand approval",
  "Legal approval",
  "Asset rights & permissions",
  "Final publishing decision",
];

/* ── Partnership models ──────────────────────────────────────────────── */
export const OPERATING_MODELS_HEADING = "Three ways this could work.";
export const OPERATING_MODELS = [
  {
    key: "referral",
    subtitle: "Model A",
    title: "Approved Vendor / Referral",
    intro: "Rebel points a property to Archer. Archer contracts with that property directly. Referral terms documented in writing.",
    note: "Separate contracts, separate billing. Best for occasional needs.",
  },
  {
    key: "wholesale",
    subtitle: "Model B",
    badge: "Preferred, scalable model",
    title: "Wholesale / White Label",
    intro: "Rebel keeps the owner relationship and includes Archer production inside a broader Rebel service. Archer bills Rebel an agreed wholesale rate.",
    note: "Rebel holds the relationship. Properties opt in. Scope stays transparent.",
  },
  {
    key: "portfolio",
    subtitle: "Model C",
    title: "Portfolio Production Capacity",
    intro: "Rebel reserves a block of recurring Archer capacity and allocates it across participating properties.",
    note: "Coordinated capacity planning. Best for pilots and multi-property rollouts.",
  },
];
export const OPERATING_MODELS_NOTE =
  "All models are non-exclusive, between independent companies, and require a written commercial agreement with mutual approval.";

/* ── The pilot ───────────────────────────────────────────────────────── */
export const PILOT_EYEBROW = "Getting started";
export const PILOT_HEADING = "Two or three properties. Ninety days.";
export const PILOT_PHASES = [
  {
    idx: "01",
    title: "Select",
    items: ["Pick a small mix of property types", "Confirm each property's priorities", "Document who does what"],
  },
  {
    idx: "02",
    title: "Set Up",
    items: ["Collect approved assets and brand rules", "Set the review workflow", "Confirm a delivery calendar"],
  },
  {
    idx: "03",
    title: "Produce",
    items: ["Run real requests through Archer", "Deliver on schedule", "Track approvals and bottlenecks"],
  },
  {
    idx: "04",
    title: "Review",
    items: ["Measure turnaround and workload saved", "Check property satisfaction and usage", "Decide whether to expand"],
  },
];
export const PILOT_NOTE =
  "Creative doesn't produce hotel revenue on its own. It supports the commercial strategy Rebel is already running.";
export const PILOT_CTA = "Discuss a Pilot";

/* ── Proof of execution (Archer's own proof -- identical figures and
   qualifier language to /bridgetown, /grant-hospitality and /jacaruso, so
   no page ever shows conflicting numbers for the same underlying body of
   work) ──────────────────────────────────────────────────────────────── */
export const PROOF_EYEBROW = "What Archer has produced";
export const PROOF_STATS = [
  { value: "2.64K", label: "Published social posts" },
  { value: "16.05M", label: "Impressions" },
  { value: "5.2M", label: "People reached" },
  { value: "596.43K", label: "Engagements" },
];
export const CONFIDENCE_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming the top-performing Hotel Indigo on the East Coast.";
export const CONFIDENCE_SUPPORTING =
  "That came from tying events, F&B, meetings, local demand and seasonal priorities to one consistent creative calendar — the same execution this model brings to a Rebel-identified priority.";
export const PROOF_FOOTNOTE =
  "Results reflect tracked hospitality campaigns and vary by property, audience, offer, platform, budget, season and market. The performance statement reflects reporting shared by that property during the engagement, not an independently audited brand-wide claim. Shown as existing Archer Design work, unrelated to Rebel Hotel Company. Past results do not guarantee future performance.";

/* ── Personal note ───────────────────────────────────────────────────── */
export const NOTE_SALUTATION = "Sherrin and the Rebel team,";
export const NOTE_PARAGRAPHS = [
  "Rebel already has the sales, marketing, commercial strategy and brand leadership a diverse portfolio needs — across independent lifestyle hotels, branded full-service properties and the Renegade platform. I'm not proposing to change any of that.",
  "I'm proposing one thing: when an approved priority needs polished creative produced quickly, participating properties have somewhere to send it. Photos, offers, event details and brand direction go in. Finished motion, campaign assets and guest-facing creative come out.",
  "Rebel keeps the strategy, the owner relationship and every approval. I just add production.",
];
export const NOTE_SIGNATURE = "Devon Archer, Founder, Archer Design";

/* ── Closing ──────────────────────────────────────────────────────────── */
export const FINAL_EYEBROW = "Rebel Hotel Company × Archer Design";
export const FINAL_HEADING = "Rebel keeps the strategy. Archer helps more of it get produced.";
export const FINAL_COPY =
  "On-demand creative production for participating Rebel properties — activated when needed, priced per property, working underneath the structure Rebel already has.";
export const FINAL_PRIMARY_CTA = "Discuss a Pilot";

/* ── Footer ───────────────────────────────────────────────────────────── */
export const FOOTER_DISCLAIMER =
  "Independent speculative concept prepared by Archer Design. Not commissioned, sponsored, endorsed, or approved by Rebel Hotel Company. Rebel Hotel Company's name, logo, services, and public information are referenced only to illustrate a proposed partnership model. All pricing, margins and participation scenarios are illustrative and subject to negotiation and written agreement.";

/* ── Official Rebel contact reference (verified against
   rebelhotelcompany.com footer/contact on 2026-08-17; shown nowhere as an
   active mailto/tel link on this page, kept here only as a sourced
   reference for the record) ─────────────────────────────────────────────── */
export const REBEL_OFFICIAL_EMAIL = "info@rebelhotelco.com";
export const REBEL_OFFICIAL_ADDRESS_NY = "450 Park Avenue S, 4th Floor, New York, NY 10016";
export const REBEL_OFFICIAL_ADDRESS_FL = "10 Front St Suite 300, Jupiter, FL 33477";
