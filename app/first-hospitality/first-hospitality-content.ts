// ─────────────────────────────────────────────────────────────────────────────
// first-hospitality-content.ts — small, First-Hospitality-specific data
// constants used by app/first-hospitality/page.tsx and
// components/FirstHospitalityHeader.tsx. Keeps portfolio figures, proof
// numbers, commercial-model language, and CTA links defined exactly once
// instead of scattered through JSX, without over-architecting a one-page
// proposal into a larger content system than it needs.
//
// Copy rewritten per Devon's "Rewritten Page Copy" pass: tighter sentences
// throughout, and several previously-separate blocks consolidated to remove
// repeated ideas -- see WHY_EACH_SIDE_* (merges what were two separate
// "Why owners buy" / "Why First Hospitality offers it" sections into one
// section with two subsections) and COMMERCIAL_TERMS_NOTE (merges what were
// four sequential disclaimer paragraphs in the commercial-structure section
// into one blockquote + one plain-language terms paragraph). Section order
// on the page itself is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

/** Primary pilot / owner-service CTA. Exact mailto + CC + URL-encoded
 * subject as specified for the repositioned page. */
export const PILOT_MAILTO =
  "mailto:cfoster@firsthospitality.com?cc=jfishel@firsthospitality.com&subject=First%20Hospitality%20%C3%97%20Archer%20Design%20Owner-Service%20Partnership";

/* ── Hero ──────────────────────────────────────────────────────────────── */
export const HERO_EYEBROW = "Private partnership concept";
export const HERO_HEADLINE = "Add a creative production service to the First Hospitality platform.";
export const HERO_SUPPORTING_COPY =
  "Participating owners get a steady supply of finished motion and static campaigns. Archer Design produces all of it behind the scenes. First Hospitality keeps a margin on every package sold.";
export const HERO_SUPPORTING_LINE =
  "You package it. We produce it. Owners get finished creative. You keep the margin.";
export const HERO_NOTE =
  "Private concept prepared by Archer Design. Speculative only — not commissioned, approved, or endorsed by First Hospitality or any featured property.";

/* ── First Hospitality portfolio context ──────────────────────────────────
   Publicly presented First Hospitality figures (55 hotels / 35 restaurants
   and bars / ~9,000 keys). Nothing here is an internal/confidential figure
   -- no revenue, owner count, or performance data is included or invented. */
export const PORTFOLIO_STATS = [
  { value: "55", label: "Hotels" },
  { value: "35", label: "Restaurants and bars" },
  { value: "9,000", label: "Keys" },
  { value: "One", label: "Production partner that scales with you" },
];
export const PORTFOLIO_SOURCE_NOTE = "Portfolio figures reflect publicly presented First Hospitality information.";

/* ── The Opportunity ───────────────────────────────────────────────────── */
export const OPPORTUNITY_HEADING = "You find the opportunity. We make the work.";
export const OPPORTUNITY_COPY = [
  "First Hospitality already knows which properties need what, and already owns those relationships. What's missing is production capacity — the hands to turn an approved offer and a folder of photography into finished campaigns.",
  "That's the part Archer Design handles.",
];
export const OPPORTUNITY_POINTS = [
  { lead: "First Hospitality", rest: "spots the opportunity and keeps the owner relationship." },
  {
    lead: "Archer Design",
    rest: "turns approved photos, offers, briefs, and brand direction into finished motion and static campaigns.",
  },
  {
    lead: "The service",
    rest: "can run as a preferred partner, a white-label offering, or a central portfolio contract — whichever fits.",
  },
  { lead: "First Hospitality", rest: "shares in the revenue through a clear, agreed structure." },
  { lead: "The ask", rest: "is one focused pilot. Not a portfolio-wide commitment." },
];
export const OPPORTUNITY_SUPPORT_COPY =
  "Every property has its own offers, slow periods, dining events, and local demand. Knowing what to promote is rarely the hard part. Producing enough polished, property-specific creative after that decision is made — that's the bottleneck.";

/* ── The shared opportunity — placed immediately after Opportunity. ──────── */
export const SHARED_OPPORTUNITY_EYEBROW = "The shared opportunity";
export const SHARED_OPPORTUNITY_HEADING = "More for owners. New revenue for the platform.";
export const SHARED_OPPORTUNITY_COPY = [
  "Most properties already know their priority: a slow week to fill, a new restaurant menu, a wedding package, a local event, a seasonal push. What they don't have is a reliable way to get that promoted well.",
  "First Hospitality can close that gap with an approved creative package available across participating properties. Archer Design does the production. First Hospitality keeps the owner relationship, the approvals, and the client-facing service.",
];

export const SHARED_VALUE_COLUMNS = [
  {
    key: "owners",
    title: "For owners and properties",
    items: [
      "Motion and static campaigns delivered every month",
      "More mileage from photography they've already paid for",
      "Faster turnaround on hotel, dining, event, and sales priorities",
      "No need to hire a creative person at the property level",
      "A clear monthly scope, with no guesswork",
    ],
  },
  {
    key: "first-hospitality",
    title: "For First Hospitality",
    items: [
      "A stronger owner-services platform",
      "New revenue without building an in-house production team",
      "An agreed margin on every participating package",
      "Central visibility into what properties are asking for",
      "Something that can start small and grow",
    ],
  },
  {
    key: "archer",
    title: "For Archer Design",
    items: [
      "Briefs and approvals in one place",
      "A consistent production workflow",
      "Predictable monthly volume",
      "Direct access to approved materials",
      "Room to scale as adoption grows",
    ],
  },
];

/* ── How the money moves — four-step flow diagram, still shown inside the
   Shared Opportunity section but under its own small heading. ── */
export const MONEY_FLOW_HEADING = "How the money moves";
export const COMMERCIAL_FLOW_STEPS = [
  {
    key: "owner",
    title: "The owner or property",
    body: "Chooses a package and pays the agreed rate.",
  },
  {
    key: "first-hospitality",
    title: "First Hospitality",
    body: "Keeps the owner relationship, commercial oversight, and the agreed margin.",
  },
  {
    key: "archer",
    title: "Archer Design",
    body: "Gets paid the contracted production rate and delivers the work.",
  },
  {
    key: "assets",
    title: "The property",
    body: "Receives finished, approved campaign assets.",
  },
];
export const BILLING_STRUCTURE_NOTE =
  "Billing can run through First Hospitality, directly with properties, or through a central portfolio agreement — whichever model is approved.";

/* ── Large custom-video feature sections ──────────────────────────────────
   The five First Hospitality-specific concepts are distributed as large
   editorial features throughout the page rather than confined to one
   carousel. Heading/copy for the four non-hero placements (the wedding
   concept anchors the hero itself, see HERO_* above). Order and section
   placement are decided in page.tsx; keys here match
   first-hospitality-media.ts's concept `key` fields exactly. ── */
export const CUSTOM_FEATURES = {
  galaxy: {
    number: "02",
    heading: "One photograph can carry an entire campaign.",
    copy: "A single approved exterior shot can become a website hero, a seasonal campaign, a direct-booking visual, and a destination story — without booking a new video shoot for each one.",
  },
  room: {
    number: "03",
    heading: "More value from photography owners already funded.",
    copy: "Approved room, suite, and public-space photography becomes cinematic motion for property websites, paid media, package promotions, and guest-experience campaigns.",
  },
  drink: {
    number: "04",
    heading: "Creative support for the outlets that drive revenue.",
    copy: "Restaurant and bar teams get polished motion for seasonal menus, cocktails, culinary events, rooftops, private dining, and local promotions — without organizing a new shoot for every campaign.",
  },
  lady: {
    number: "05",
    heading: "The story is bigger than rooms and amenities.",
    copy: "Arrival, service, and guest interaction can become part of the campaign — helping a property show the hospitality behind the stay, not just the space.",
  },
} as const;

/* ── Existing Archer Design work slideshow ────────────────────────────────
   One polished slideshow (not the five First Hospitality custom concepts)
   demonstrating the broader quality and range of Archer Design's real,
   already-delivered hospitality client work. Modeled closely on
   /social-media-work's carousel experience. ── */
export const EXISTING_WORK_EYEBROW = "Existing Archer Design work";
export const EXISTING_WORK_HEADING = "Hospitality campaigns built for real commercial goals.";
export const EXISTING_WORK_SUPPORTING_COPY =
  "Selected work supporting hotel stays, restaurants, events, seasonal campaigns, local demand, meetings, and property storytelling.";
export const EXISTING_WORK_INTRO =
  "Most of these started as a single approved still photograph. Motion design, compositing, environmental animation, and visual effects turned them into flexible foundations for websites, ads, and campaigns.";
export const EXISTING_WORK_NOTE =
  "These versions are shown clean, without permanent promotional copy. Headlines, offers, logos, buttons, and calls to action get added per approved campaign placement.";

/* ── What Archer produces ─────────────────────────────────────────────────── */
export const SERVICE_OUTPUTS_HEADING = "One production partner. Every kind of campaign.";
export const SERVICE_OUTPUTS_COPY =
  "Once strategy and offers are approved, Archer Design turns them into finished, property-ready creative in whatever formats each hotel or outlet needs.";
export const SERVICE_OUTPUTS = [
  "Motion built from approved property photography",
  "Static campaign graphics",
  "Restaurant and bar promotions",
  "Meetings, weddings, and event creative",
  "Need-period and seasonal campaigns",
  "Opening and rebrand support",
  "Platform-ready size adaptations",
  "Sales-support and direct-booking visuals",
];

/* ── Partnership workflow — four steps ────────────────────────────────────── */
export const WORKFLOW_STEPS = [
  {
    idx: "01",
    title: "Pick the priority",
    body: "A hotel, restaurant, opening, slow period, or campaign is selected.",
  },
  {
    idx: "02",
    title: "Send the materials",
    body: "Archer receives the brief, brand guidance, photography, offer details, formats, and deadline.",
  },
  {
    idx: "03",
    title: "Archer builds it",
    body: "Motion and static assets are produced in every required size and format.",
  },
  {
    idx: "04",
    title: "You approve and publish",
    body: "First Hospitality and the property keep control of strategy, owner communication, approvals, and publishing.",
  },
];
export const WORKFLOW_SUMMARY = "The property gets finished creative. You never lose the relationship.";

/* ── Commercial partnership models ────────────────────────────────────────
   White-label owner service is presented as the recommended model -- it
   gives First Hospitality the clearest, most direct path to incremental
   platform margin. Nothing here claims the structure has already been
   approved or adopted. ── */
export const PARTNERSHIP_HEADING = "Three ways to structure it.";
export const PARTNERSHIP_COPY =
  "Archer Design can work as a preferred, referred, or white-label production partner. Pick the structure that fits how First Hospitality prefers to contract.";
export const PARTNERSHIP_MODELS = [
  {
    key: "white-label",
    title: "White-label owner service",
    recommended: true,
    badge: "Strongest revenue opportunity",
    body: "First Hospitality offers the package as its own owner-facing service. Archer produces at an agreed wholesale rate.",
    emphasis: "First Hospitality keeps the difference between what the owner pays and what Archer charges.",
  },
  {
    key: "preferred",
    title: "Preferred partner",
    body: "Properties contract directly with Archer Design. First Hospitality receives an agreed referral or platform fee where permitted and contractually approved.",
  },
  {
    key: "central",
    title: "Central portfolio support",
    body: "First Hospitality contracts Archer centrally and allocates production across selected properties, restaurants, and bars. Pricing is based on total committed volume rather than property-by-property enrollment.",
  },
];

/* ── Commercial structure disclaimers — consolidated from what were four
   sequential paragraphs into one blockquote plus one plain-language terms
   paragraph. ── */
export const PARTNERSHIP_QUOTE =
  "The white-label structure gives First Hospitality the clearest path to new platform revenue while keeping the owner experience consistent. Structure to be agreed after pilot selection.";
export const COMMERCIAL_TERMS_NOTE =
  "This would be a company-level agreement. Any referral fee, markup, or platform participation would be transparent, contractually defined, and owner-approved where required. Brand standards and property approvals stay in force. Owner participation would be optional unless folded into another approved agreement. First Hospitality has not endorsed or adopted any of this. Final legal, billing, tax, procurement, and vendor structure would be determined jointly.";

/* ── Why each side says yes — merged from what were two separate sections
   ("Why an owner would approve the service" / "Why this strengthens the
   First Hospitality platform") into one section with two subsections. ── */
export const WHY_EACH_SIDE_EYEBROW = "Why it works";
export const WHY_EACH_SIDE_HEADING = "Why each side says yes.";
export const WHY_OWNER_HEADING = "Why an owner approves it";
export const WHY_OWNER_POINTS = [
  "Their priorities actually get promoted, consistently",
  "More value from photography they've already commissioned",
  "No full-time creative hire at the property",
  "A predictable monthly scope",
  "Coverage across hotel, restaurant, bar, wedding, meeting, and event needs",
  "Motion and static from one partner",
  "Central quality control and approvals",
  "The option to pilot before committing",
];
export const WHY_PLATFORM_HEADING = "Why it strengthens the platform";
export const WHY_PLATFORM_POINTS = [
  "Another real solution to offer owners",
  "Gives the commercial team a way to act on priorities, not just identify them",
  "Supports restaurants and bars as revenue drivers",
  "Helps properties execute after strategy is set",
  "Creates new gross platform margin",
  "Far less fixed overhead than building an internal production team",
  "Scales gradually — by property, region, category, or segment",
  "Reinforces First Hospitality as a full-service operating partner",
];

/* ── Partner economics section intro ──────────────────────────────────────── */
export const PARTNER_ECONOMICS_HEADING = "What First Hospitality keeps.";
export const PARTNER_ECONOMICS_COPY =
  "For each participating property, First Hospitality sells the package at the agreed rate, pays Archer the production rate, and keeps the rest.";
export const PARTNER_ECONOMICS_QUALIFICATION =
  "Amounts shown are gross margin, before First Hospitality's administrative, billing, sales, legal, tax, or internal servicing costs.";

/* ── Archer proof — verified dashboard totals, Jan 1 2021 - Aug 3 2026.
   Unchanged from the prior revision of this page -- preserved exactly. ── */
export const PROOF_STATS = [
  { value: "2.64K", label: "Social posts published" },
  { value: "16.05M", label: "Impressions generated" },
  { value: "5.2M", label: "People reached" },
  { value: "596.43K", label: "Engagements generated" },
];
export const PROOF_NOTE =
  "Tracked across supported hospitality social campaigns, January 1, 2021 – August 3, 2026. Evidence of past Archer Design work; not a guarantee of future performance.";

/* ── Hotel Indigo qualified proof statement — quote wording preserved
   exactly; supporting copy and qualification tightened. ── */
export const HOTEL_INDIGO_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming a top-performing Hotel Indigo property on the East Coast.";
export const HOTEL_INDIGO_SUPPORTING_COPY =
  "The work tied events, food and beverage, meetings, local demand, seasonal priorities, and property storytelling to one consistent creative and social calendar.";
export const HOTEL_INDIGO_QUALIFICATION =
  "Reflects reporting shared by the property during the engagement. Not an independently audited brand-wide claim.";

/* ── Pilot — validates both the operating workflow and the commercial
   economics, not just creative output. ── */
export const PILOT_HEADING = "Test the service and the economics in 60 days.";
export const PILOT_STRUCTURE = [
  { value: "2", label: "Hotels" },
  { value: "1", label: "Restaurant or bar" },
  { value: "60", label: "Days" },
  { value: "1", label: "Package per participant" },
];
export const PILOT_SETUP_HEADING = "What we set up:";
export const PILOT_ITEMS = [
  "One central request and approval workflow",
  "Access to approved brand and property imagery",
  "Agreed owner-facing and partner pricing",
  "Defined turnaround expectations",
];
export const PILOT_REVIEW_HEADING = "What we review at the end:";
export const PILOT_REVIEW_CRITERIA = [
  "Creative quality",
  "Turnaround time",
  "How much properties actually used",
  "Owner satisfaction",
  "Operational effort",
  "Billing workflow",
  "Margin retained",
  "Whether to expand",
];
export const PILOT_CLOSING_COPY =
  "The pilot exists to answer one question: does this create enough value for properties, efficiently enough, to become a standing First Hospitality owner service?";
export const PILOT_SCOPE_NOTE = "Scope and terms finalized with the selected pilot participants.";

/* ── Final CTA ─────────────────────────────────────────────────────────────── */
export const FINAL_CTA_HEADING = "Turn creative production into an owner service.";
export const FINAL_CTA_COPY =
  "Start with one focused pilot. Validate the workflow and the economics. Then decide whether Archer Design becomes a scalable production resource across participating First Hospitality hotels, restaurants, and bars.";

/* ── Legal / commercial disclaimer — the calculator carries its own short
   forecast caveat (see FirstHospitalityRevenueCalculator.tsx); this longer
   version now appears once, in the footer, instead of being repeated near
   the calculator as well. ── */
export const FOOTER_IMPORTANT_NOTE =
  "This page is a private speculative proposal created by Archer Design. It is not commissioned, approved, or endorsed by First Hospitality or any featured property. All pricing, margins, projections, package structures, billing methods, and participation scenarios shown here are illustrative and subject to negotiation, due diligence, owner approval where required, brand approval, vendor onboarding, and executed agreements. Retained margin shown is gross and is not a guarantee of net profit or property participation. Property imagery is publicly displayed material used for evaluation purposes only.";
