// ─────────────────────────────────────────────────────────────────────────────
// dns-content.ts — copy constants for the /dns private collaboration concept
// (DNS Industries × Archer Design), prepared for Tony Spagnolo, VP Design at
// DNS Industries.
//
// LANGUAGE GUARDRAILS (do not violate when editing):
//  - Never state the collaboration as an established fact ("we have
//    partnered", "our partnership", "DNS clients receive...").
//  - Never imply Tony or DNS approved this concept.
//  - Never position Archer as an interior design / architecture / rendering /
//    fabrication / millwork competitor to DNS, or imply DNS lacks design or
//    marketing competence. Archer's lane is hospitality COMMERCIAL
//    APPLICATION — how a finished environment gets launched, promoted, and
//    kept selling — not design, engineering, fabrication, or visualization.
//  - Never invent DNS metrics (hotel counts, revenue, ROI, client counts,
//    percentages, project results, employee counts, geographic coverage
//    beyond what's verified) or claim a specific DNS project was a hotel
//    unless verified. Only the facts in DNS_FACTS below, sourced from
//    dnsdisplay.com and dnsdisplay.com/about.
//  - Only real, existing Archer Design proof numbers from lib/proof-stats.ts
//    and real, current pricing from app/tcrm/tcrm-pricing.ts (Mode A of the
//    calculator only — Mode B's "average activation value" is a plain
//    user-selectable scenario number, not tied to a real named Archer plan,
//    since no Project Reveal Kit price has actually been set).
//  - Referral income is one possible outcome of this concept, not the
//    reason for it — keep the calculator positioned after the
//    strategic/creative case, and never call its output "DNS earnings",
//    "guaranteed revenue", or "expected commission."
//  - The speculative/no-partnership-exists disclaimer lives in exactly two
//    places: the footer (comprehensive) and the calculator's "scenario only"
//    line (specific to its numbers). Do not re-add it elsewhere — repeating
//    it reads as nervous, not confident.
//  - Avoid hype ("revolutionary", "game changing"), generic agency
//    language, and overuse of the word "partnership." Prefer: potential
//    collaboration, extension, activation, opportunity, complementary
//    capability, one possible model, support layer, project lifecycle.
// ─────────────────────────────────────────────────────────────────────────────

/** Primary contact CTA. A private concept prepared ahead of a meeting Tony
 * already has scheduled — the mailto opens a message to Devon directly
 * rather than pushing a new booking flow. */
export const CONTACT_MAILTO =
  "mailto:devonavich0@gmail.com?subject=DNS%20Industries%20%C3%97%20Archer%20Design%20%E2%80%94%20Partnership%20Discussion";

/* ── Header ────────────────────────────────────────────────────────────── */
export const NAV_LOCKUP_SHORT = "DNS × Archer";
export const NAV_MICROCOPY = "Private collaboration concept";
export const NAV_ITEMS = [
  { href: "#creative", label: "Creative" },
  { href: "#where-archer-fits", label: "Opportunity" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#work", label: "Work" },
] as const;
export const NAV_CTA = "Discuss the Opportunity";

/* ── 01 — Hero ─────────────────────────────────────────────────────────── */
export const HERO_EYEBROW = "DNS × Archer Design";
export const HERO_EYEBROW_SUB = "Private collaboration concept";
// "We help launch it" chosen over "We help fill it" — "fill it" reads a
// little occupancy/leasing-casual for a VP of Design audience, and "launch"
// stays consistent with the vocabulary used throughout the rest of the page
// (launch campaign, project reveal, activation).
export const HERO_HEADLINE_LINE_1 = "You build the space.";
export const HERO_HEADLINE_LINE_2 = "We help launch it.";
export const HERO_COPY =
  "DNS designs, engineers, fabricates and installs the environments guests experience in person. Archer builds the campaigns that get them through the door.";
export const HERO_CTA_PRIMARY = "Explore the Opportunity";
export const HERO_CTA_SECONDARY = "See the Creative";

// Small hero workflow diagram: DNS's build stages handing off at "the space
// opens" into Archer's activation stages.
export const HERO_WORKFLOW_DNS_LABEL = "DNS Industries";
export const HERO_WORKFLOW_DNS_STAGES = ["Design", "Engineering", "Fabrication", "Installation"];
export const HERO_WORKFLOW_HANDOFF = "The Space Opens";
export const HERO_WORKFLOW_ARCHER_LABEL = "Archer Design";
export const HERO_WORKFLOW_ARCHER_STAGES = ["Reveal", "Campaign", "Events", "F&B", "Ongoing Creative"];

export const HERO_FIT_CARD_TITLE = "The Opportunity";
export const HERO_FIT_CARD_BODY =
  "DNS creates the environment guests experience in person. Archer can help transform that same investment into the creative guests see before they ever walk through the door.";
export const HERO_FIT_CARD_NOTE = "Potential collaboration concept — not an existing partnership.";

/* ── 02 — The Opportunity ("the build is finished, now what?") ───────── */
export const POSTINSTALL_EYEBROW = "The Opportunity";
export const POSTINSTALL_HEADING_LINE_1 = "The build is finished.";
export const POSTINSTALL_HEADING_LINE_2 = "Now what?";
export const POSTINSTALL_COPY =
  "A new lobby, restaurant, bar, rooftop, spa or meeting venue gives a property something new to sell. Someone still has to launch it, promote it, fill it, and keep giving guests a reason to come back.";

export const POSTINSTALL_DNS_LABEL = "DNS Completes";
export const POSTINSTALL_DNS_ITEMS = ["Lobby", "Restaurant", "Bar", "Rooftop", "Spa", "Meeting Space", "Guest Experience"];
export const POSTINSTALL_ARCHER_LABEL = "Archer Creates";
export const POSTINSTALL_ARCHER_ITEMS = [
  "Project Reveal",
  "Launch Campaign",
  "Social Motion",
  "Email Creative",
  "F&B Promotions",
  "Event Campaigns",
  "Digital Ads",
  "Seasonal Activation",
];

export const POSTINSTALL_STATEMENT_LINE_1 = "DNS builds the environment guests walk into.";
export const POSTINSTALL_STATEMENT_LINE_2 = "Archer builds the one they see first.";

/* ── 03 — Motion ───────────────────────────────────────────────────────── */
export const CREATIVE_EYEBROW = "Motion";
export const CREATIVE_HEADING_LINE_1 = "Motion that turns";
export const CREATIVE_HEADING_LINE_2 = "the space into a story.";
export const CREATIVE_COPY =
  "The environment is finished. The story around it is not. Archer turns rooms, restaurants, venues and amenities into campaign-ready motion built for how hospitality actually markets itself.";
export const CREATIVE_TAGS = ["Short-form motion", "Hospitality campaigns", "Brand motion", "Social creative"];

/* ── 04 — Stills and campaigns ─────────────────────────────────────────── */
export const STATIC_EYEBROW = "Stills and Campaigns";
export const STATIC_HEADING_LINE_1 = "The space becomes";
export const STATIC_HEADING_LINE_2 = "the campaign.";
export const STATIC_COPY =
  "Openings, F&B promotions, events, meetings, weddings, packages and seasonal offers, built around the experience the property already paid for.";
export const STATIC_NOTE = "Existing Archer Design hospitality work, shown as reference. Unrelated to DNS Industries.";

/* ── 05 — Three ways this could work (includes the merged two-way
   referral content — previously duplicated in a separate "Mutual
   Opportunity" section, now said once, here) ─────────────────────────── */
export const THREE_WAYS_EYEBROW = "Where Archer Could Fit";
export const THREE_WAYS_HEADING = "Three ways this could work.";

export const THREE_WAYS = [
  {
    number: "01",
    eyebrow: "DNS hires Archer",
    title: "Hospitality business development",
    copy: "As DNS moves further into hospitality, Archer can translate technical and physical expertise into the language owners, operators, developers and hospitality groups respond to.",
    copy2: "",
    capabilities: [
      "Hospitality sales collateral",
      "Hospitality microsites and landing pages",
      "Pursuit presentations",
      "Project case studies",
      "Before and after storytelling",
      "LinkedIn and business-development creative",
      "Capability decks",
      "Completed-project reveal content",
    ],
    situations: null as null | { dnsLabel: string; dnsItems: string[]; archerLabel: string; archerItems: string[] },
    keyLine: "DNS knows how to build the environment. Archer can package that capability for the people buying it.",
  },
  {
    number: "02",
    eyebrow: "Archer supports DNS clients",
    title: "Post-install activation",
    copy: "When DNS finishes a hospitality environment, Archer can step in as an optional marketing-production resource for the operator.",
    copy2: "",
    capabilities: [
      "Grand-opening creative",
      "Renovation and repositioning campaigns",
      "Project reveal videos",
      "Short-form motion",
      "Social campaigns",
      "F&B promotions",
      "Event and meeting creative",
      "Email campaigns",
      "Digital advertising",
      "Ongoing property activation",
    ],
    situations: null,
    keyLine: "Installation does not have to be where the client relationship ends.",
  },
  {
    number: "03",
    eyebrow: "Both sides make introductions",
    title: "Two-way referrals",
    copy: "DNS is in conversations with owners, operators, developers and project teams while physical environments are being planned and built. Archer is in conversations with hotels, restaurants and hospitality groups when marketing needs surface.",
    copy2: "When either side meets a need outside its own specialty, there is a natural reason to make an introduction.",
    capabilities: [],
    situations: {
      dnsLabel: "DNS → Archer",
      dnsItems: [
        "Property opening or reopening",
        "New restaurant or bar launch",
        "Renovation reveal",
        "Ongoing hotel marketing production",
        "F&B, meetings and event campaigns",
      ],
      archerLabel: "Archer → DNS",
      archerItems: [
        "Hotel renovation",
        "Lobby or reception refresh",
        "Restaurant and bar build-out",
        "Custom millwork or fixtures",
        "Multi-property physical rollout",
      ],
    },
    keyLine: "Each company stays independent. Every opportunity gets handled on its own terms.",
  },
] as const;

/* ── 06 — The Project Reveal Kit (conceptual offering) ────────────────── */
export const REVEALKIT_EYEBROW = "One Possible Offering";
export const REVEALKIT_HEADING = "The Project Reveal Kit";
export const REVEALKIT_COPY = "After an installation, Archer could turn the finished environment into a ready-to-launch marketing package.";

export const REVEALKIT_DELIVERABLES = [
  "1 cinematic project reveal",
  "3 to 5 short-form motion assets",
  "6 to 10 social and campaign graphics",
  "Before and after creative",
  "Email campaign creative",
  "Opening or reopening campaign",
  "Digital ad formats",
  "Optional F&B and event extensions",
] as const;

export const REVEALKIT_STATEMENT_LINE_1 = "DNS delivers the finished space.";
export const REVEALKIT_STATEMENT_LINE_2 = "Archer helps the operator show it to the market.";
export const REVEALKIT_NOTE = "Could run as a referral, a direct engagement, a white-label extension, or a joint project.";
export const REVEALKIT_DISCLAIMER = "A conceptual offering for discussion, not a service either company currently sells.";

/* ── 07 — Before the contract (DNS business-development support) ─────── */
export const DNSBD_EYEBROW = "Before The Contract";
export const DNSBD_HEADING_LINE_1 = "Archer could also help DNS";
export const DNSBD_HEADING_LINE_2 = "win the work.";
export const DNSBD_COPY =
  "The opportunity does not start after DNS wins a project. It starts with how DNS presents itself to owners, developers, management groups, architects and operators.";

export const DNSBD_EXAMPLES = [
  { title: "Hospitality microsite", body: "DNS's fabrication and environmental capability, presented for a hospitality audience." },
  { title: "Case study system", body: "Completed projects as business-development assets, not gallery images." },
  { title: "Pursuit support", body: "Technical work, renderings and rollout capability packaged into executive presentations." },
  { title: "Project reveals", body: "Finished spaces as cinematic sales tools that help win the next one." },
  { title: "LinkedIn and B2B content", body: "A steady hospitality-facing stream built around DNS's work, materials and process." },
] as const;

export const DNSBD_IMPORTANT = "This is not about replacing DNS's design expertise. It is about getting that expertise in front of the people deciding.";

// Verified DNS facts, only sourced from dnsdisplay.com and dnsdisplay.com/about.
export const DNS_AT_A_GLANCE_LABEL = "DNS at a Glance";
export const DNS_FACTS = [
  { value: "20+ years", label: "Commercial design, engineering and manufacturing" },
  { value: "Since 2001", label: "Founded in the Greater Toronto Area (Vaughan, Ontario)" },
  { value: "Under one roof", label: "Design, engineering, fabrication, finishing and staging" },
  { value: "Multi-material", label: "Wood, metal, glass, acrylic, solid surface, stone, lighting, graphics" },
  { value: "North American", label: "Serving clients across the continent" },
] as const;
export const DNS_CREDIBILITY_NOTE = "Public company information referenced from current DNS Industries materials (dnsdisplay.com).";

// Case-study reframe, folded into this section — merged into one flowing
// statement rather than a separate section or a repeated tag list.
export const DNSBD_CASESTUDY_HEADING = "One Project Sells the Next";
export const DNSBD_CASESTUDY_COPY =
  "DNS's best work should not end up as a photo gallery. A completed project can become a cinematic case study, a sales-deck story, a LinkedIn campaign, a project landing page, a before and after reveal, an email campaign, or a pursuit asset.";
export const DNSBD_CASESTUDY_NOTE = "Most valuable on repeatable programs and multi-location work.";

/* ── 08 — How the work could run (flexible partnership models) ───────── */
export const MODELS_EYEBROW = "Flexible By Project";
export const MODELS_HEADING = "How the work could run.";

export const PARTNERSHIP_MODELS = [
  {
    key: "referred",
    title: "Referred resource",
    body: "DNS makes the introduction. Archer contracts directly.",
  },
  {
    key: "white-label",
    title: "White-label extension",
    body: "Archer works behind DNS where DNS keeps the client relationship.",
  },
  {
    key: "collaboration",
    title: "Project collaboration",
    body: "DNS leads the physical environment. Archer joins at launch, reveal and ongoing activation. Each company stays in its specialty, and the client gets one connected path from finished space to campaign.",
  },
  {
    key: "dns-as-client",
    title: "DNS as the client",
    body: "DNS hires Archer directly for business-development creative, case studies, hospitality collateral and content.",
  },
] as const;

export const MODELS_NOTE = "Options for discussion, not an agreed arrangement.";

/* ── 09 — Ways a property could work with Archer (pricing / partner
   economics). This whole block replaces the old, narrower "hypothetical
   scenario" framing: the strategic point now made explicit is that the
   opening is a start, not an endpoint, and that a DNS-referred client can
   choose either a one-time project or an ongoing monthly subscription —
   with DNS's referral participation able to continue monthly, for as long
   as that subscription stays active, if DNS and Archer agree to it. ─────── */
export const ECON_EYEBROW = "Engagement Options";
export const ECON_HEADING = "Ways a property could work with Archer.";
export const ECON_COPY =
  "Not every opportunity needs the same structure. A property can use Archer for a defined launch or campaign, or keep Archer available as ongoing monthly creative capacity.";

/* ── The strategic reframe + client journey diagram ───────────────────── */
export const JOURNEY_EYEBROW = "The Bigger Picture";
export const JOURNEY_HEADING = "The opening is only the first campaign.";
export const JOURNEY_COPY =
  "A new lobby, restaurant, rooftop, bar, spa, meeting venue, or guest experience creates an immediate launch opportunity. But the creative need continues long after opening day. Hotels and hospitality operators continually need campaigns for F&B, events, meetings, weddings, packages, seasonal offers, social media, email, local programming, amenities, and new experiences. Archer can remain available as ongoing monthly creative capacity after the initial launch.";

export const JOURNEY_STAGES = [
  { key: "dns-project", label: "DNS Project", items: ["Design", "Engineering", "Fabrication", "Installation"] },
  { key: "space-opens", label: "Space Opens", items: [] as string[] },
  {
    key: "launch",
    label: "Archer Launch Activation",
    items: ["Project reveal", "Opening campaign", "Motion", "Social", "Email", "Digital creative"],
  },
  {
    key: "subscription",
    label: "Ongoing Archer Subscription",
    items: ["F&B", "Events", "Seasonal campaigns", "Meetings", "Weddings", "Packages", "Social", "Motion", "Email", "Ongoing production"],
  },
] as const;
export const JOURNEY_FINAL_LABEL = "Recurring Partner Value";
export const JOURNEY_FINAL_COPY = "DNS participates in an agreed percentage of the referred client's active monthly Archer subscription.";

/* ── Two engagement paths ─────────────────────────────────────────────── */
export const PATHS_NOTE = "Both paths are available. Neither is the only way to work with Archer.";

export const PATH_PROJECT = {
  label: "Path 01",
  badge: "One Project · Defined Scope",
  title: "Project Activation",
  bestForLabel: "Best for:",
  bestFor: ["Openings", "Renovations", "Repositionings", "Restaurant launches", "New amenities", "Major campaigns", "Project reveals"],
  copy: "A defined creative scope around one specific moment or project.",
  deliverablesLabel: "Possible deliverables:",
  deliverables: ["Project reveal motion", "Launch campaign", "Social assets", "Email creative", "Digital ads", "F&B launch creative", "Event promotion"],
} as const;

export const PATH_SUBSCRIPTION = {
  label: "Path 02",
  title: "Ongoing Creative Subscription",
  headline: "Ongoing Creative Support",
  subhead: "Monthly production capacity for active hospitality brands.",
  copy: "Once the property is open, the marketing calendar keeps moving. Archer can stay involved as flexible monthly creative capacity for the operator — producing the recurring campaigns, motion, graphics, and promotional assets a hotel or hospitality business continually needs.",
  examplesLabel: "Examples:",
  examples: [
    "F&B promotions",
    "Events",
    "Seasonal campaigns",
    "Packages",
    "Meetings",
    "Weddings",
    "Social graphics",
    "Motion",
    "Email creative",
    "Digital ads",
    "Local programming",
    "Amenity campaigns",
    "Property-level promotions",
  ],
  keyLine: "Start with the launch. Stay for the ongoing momentum.",
  plansLabel: "Current Archer monthly plans:",
} as const;

/* ── Recurring DNS referral economics ──────────────────────────────────
   PROPOSED_REFERRAL_SHARE_PCT is the default/standard proposed percentage
   (matches RECURRING_SHARE_TIERS[0]). FIRST_MONTH_BONUS_PCT is the one,
   canonical, easy-to-edit proposed first-month bonus percentage. Every
   display of these on this page — the recurring-partner-level cards, the
   bonus callout, the calculator's defaults, and the worked examples —
   reads from these single constants (and derives every dollar figure from
   ACTIVATION_TIERS at render time) so nothing can drift out of sync. */
export const PROPOSED_REFERRAL_SHARE_PCT = 10;
export const FIRST_MONTH_BONUS_PCT = 50;

// Three possible recurring partnership levels, framed by depth of
// involvement rather than as arbitrary pricing tiers DNS simply chooses.
export const RECURRING_SHARE_TIERS = [
  {
    pct: 10,
    name: "Standard Referral",
    copy: "For a qualified introduction where Archer manages the relationship from there.",
  },
  {
    pct: 20,
    name: "Active Partner",
    copy: "For warmer introductions, or situations where DNS plays a more active role in connecting Archer with the hospitality operator.",
  },
  {
    pct: 30,
    name: "Strategic / Channel Partner",
    copy: "For a deeper recurring relationship, white-label structure, preferred creative-partner arrangement, or other higher-involvement model.",
  },
] as const;

export const RECURRING_EYEBROW = "Recurring Partner Model";
export const RECURRING_HEADING = "A partnership can grow with the level of involvement.";
export const RECURRING_COPY =
  "Not every introduction has the same level of involvement. A straightforward referral, an active partner relationship, and a deeper channel or white-label arrangement could reasonably carry different recurring economics.";
export const RECURRING_SUPPORTING_LINE = "The more integrated the relationship, the more value can be shared.";

export const RECURRING_TIERS_LABEL = "Proposed Recurring Partner Levels";
export const RECURRING_SHARE_NOTE =
  "All percentages shown are proposed and illustrative for discussion only — not a current offer, rate, or agreement. Final percentage, eligibility, payment timing, term, exclusions, and client ownership would be defined in a written agreement between DNS Industries and Archer Design.";

export const RECURRING_RETENTION_NOTE =
  "Recurring referral value continues only while the referred client's eligible subscription remains active and paid, subject to the final written referral agreement.";

/* ── Optional first-month partner bonus ─────────────────────────────────
   A separate, clearly-scoped possible incentive: DNS could receive
   FIRST_MONTH_BONUS_PCT of the first collected month only, with the
   agreed recurring percentage (one of RECURRING_SHARE_TIERS) applying
   starting month two. The bonus REPLACES the recurring percentage for
   month one — it is never added on top of it. */
export const BONUS_EYEBROW = "Optional First-Month Partner Bonus";
export const BONUS_COPY = `One possible structure could provide DNS with ${FIRST_MONTH_BONUS_PCT}% of the referred client's first collected monthly subscription payment, followed by the agreed recurring partner share beginning in month two.`;
export const BONUS_TAG_1 = "Proposed Structure";
export const BONUS_TAG_2 = "Subject To Mutual Agreement";

// Simple visual flow: referred client -> month 1 bonus -> month 2+
// recurring share -> continues while active. BONUS_FLOW_STEP_2_VALUE is
// derived from RECURRING_SHARE_TIERS rather than hand-typed, so the three
// levels never drift out of sync with the cards above.
export const BONUS_FLOW_STEP_0 = "Referred Hospitality Client";
export const BONUS_FLOW_STEP_1_STAGE = "Month 01";
export const BONUS_FLOW_STEP_1_VALUE = `${FIRST_MONTH_BONUS_PCT}%`;
export const BONUS_FLOW_STEP_1_DESC = "Potential First-Month Partner Bonus";
export const BONUS_FLOW_STEP_2_STAGE = "Month 02+";
export const BONUS_FLOW_STEP_2_VALUE = RECURRING_SHARE_TIERS.map((t) => `${t.pct}%`).join(" / ");
export const BONUS_FLOW_STEP_2_DESC = "Agreed Recurring Partner Share";
export const BONUS_FLOW_FINAL = "Continues while the eligible referred subscription remains active and paid.";

/* ── Money formatting for this section only ─────────────────────────────
   tcrm-pricing.ts's fmtMoney() rounds to whole dollars (correct for real
   subscription prices). The first-month-bonus math below produces exact
   half-dollar figures (e.g. 50% of $1,295 = $647.50), so this section
   uses its own cents-aware formatters instead of touching fmtMoney(),
   which other routes also depend on. fmtDnsMoneySmart hides ".00" when a
   figure happens to land on a whole dollar; fmtDnsMoneyExact always shows
   two decimals, for final totals. */
export function fmtDnsMoneySmart(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  const hasCents = Math.abs(rounded % 1) > 0.001;
  return `$${rounded.toLocaleString("en-US", { minimumFractionDigits: hasCents ? 2 : 0, maximumFractionDigits: 2 })}`;
}
export function fmtDnsMoneyExact(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return `$${rounded.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Worked examples — rendered directly in page.tsx, computed from
// ACTIVATION_TIERS + RECURRING_SHARE_TIERS + FIRST_MONTH_BONUS_PCT at
// render time. Never a hand-typed total.
export const EXAMPLE_EYEBROW = "Illustrative Examples";
export const EXAMPLE_PROPERTY_LABEL = "One Active Referred Client";
export const EXAMPLE_MONTH1_LABEL = "Month 1 (First-Month Bonus)";
export const EXAMPLE_MONTH2_LABEL = "Month 2+ (Recurring)";
export const EXAMPLE_YEAR1_LABEL = "Illustrative Year-One Value";
export const EXAMPLE_NOTE =
  "Assumes the referred client remains active and paid for all 12 months and includes the proposed first-month bonus. Not a guarantee.";

/* ── Why this benefits each side ──────────────────────────────────────── */
export const WHY_DNS_HEADING = "More value from a successful introduction.";
export const WHY_DNS_COPY =
  "DNS does not need to become the hotel's marketing department. DNS can make the introduction. Archer manages the ongoing creative relationship. The property gets dependable creative production. DNS can continue participating economically in the value created by a successful referred subscription.";

export const WHY_HOTEL_HEADING = "Ongoing creative capacity without adding another full-time creative hire.";
export const WHY_HOTEL_INTRO = "The property gets help with:";
export const WHY_HOTEL_ITEMS = [
  "Daily and weekly campaign needs",
  "F&B",
  "Events",
  "Seasonal offers",
  "Meetings",
  "Weddings",
  "Packages",
  "Motion",
  "Social",
  "Email",
  "Property promotions",
] as const;

export const LEGAL_EYEBROW = "Proposed Commercial Model";
export const LEGAL_COPY =
  "No referral agreement currently exists between DNS Industries and Archer Design. Percentages, qualifying referrals, payment timing, subscription eligibility, term, client ownership, refunds, cancellations, and other commercial terms would be defined in a separate written agreement.";

/* ── The calculator widget itself ──────────────────────────────────────── */
export const CALC_WIDGET_HEADING = "Run the numbers.";
export const CALC_WIDGET_COPY =
  "Referral income is one possible outcome, not the reason to do this. Adjust the inputs to see how a single structure could play out.";

// Primary mode, and the one shown by default: models a DNS-referred client
// becoming an ongoing, recurring Archer subscriber (matches the "Ongoing
// Creative Subscription" path above). Secondary mode: one-time project
// work (matches the "Project Activation" path above) — kept, but
// deliberately not the default tab, so it doesn't dominate the commercial
// story.
export const CALC_MODE_REFERRAL = "Recurring Referral Opportunity";
export const CALC_MODE_ACTIVATION = "One-Time Activation";
export const CALC_B_INTRO =
  "One-time project work — a Project Reveal Kit, opening campaign, repositioning launch, or major campaign — can also carry its own separately agreed referral economics.";

// Mode A — recurring referral opportunity. Uses Archer's real, published,
// current pricing (tcrm-pricing.ts) since this models someone becoming an
// actual paying Archer subscriber on a real named monthly plan.
export const CALC_INPUT_1_LABEL = "Hospitality Clients Introduced Per Year";
export const CALC_INPUT_1_QUICK = [1, 3, 5, 10, 15, 20] as const;
export const CALC_INPUT_1_DEFAULT = 4;
export const CALC_INPUT_1_MAX = 20;

export const CALC_INPUT_2_LABEL = "Client Conversion Rate";
export const CALC_INPUT_2_OPTIONS = [25, 50, 75] as const;
export const CALC_INPUT_2_DEFAULT = 50;

export const CALC_INPUT_3_LABEL = "Monthly Archer Plan";
export const CALC_INPUT_3_NOTE = "Reflects Archer's current published creative activation pricing.";

export const CALC_INPUT_4_LABEL = "Proposed DNS Recurring Share";
export const CALC_INPUT_4_OPTIONS = RECURRING_SHARE_TIERS.map((t) => t.pct);
export const CALC_INPUT_4_DEFAULT: number = PROPOSED_REFERRAL_SHARE_PCT;
export const CALC_INPUT_4_TOOLTIP =
  "Shown only to illustrate what a referral arrangement could look like if DNS and Archer chose to formalize one. Not a current offer, rate, or agreement.";

export const CALC_STEP_1_LABEL = "Introductions × Conversion Rate";
export const CALC_STEP_1_RESULT_LABEL = "Estimated Active Referred Clients";
export const CALC_STEP_2_LABEL = "Active Referred Clients × Selected Monthly Archer Subscription";
export const CALC_STEP_2_RESULT_LABEL = "Monthly Archer Subscription Revenue Introduced";
export const CALC_STEP_3_LABEL = "Monthly Subscription Revenue × Proposed DNS Referral %";
export const CALC_STEP_3_RESULT_LABEL = "Illustrative Monthly DNS Referral Value";
export const CALC_STEP_4_LABEL = "Monthly DNS Referral Value × 12";
export const CALC_STEP_4_RESULT_LABEL = "Illustrative 12-Month DNS Referral Value";
export const CALC_STEP_4_NOTE = "Assumes the referred subscriptions remain active for all 12 months. Not a guarantee.";

/* ── Optional first-month bonus toggle (Recurring Referral Opportunity
   calculator only) ────────────────────────────────────────────────────── */
export const CALC_BONUS_TOGGLE_LABEL = "Include Proposed First-Month Bonus?";
export const CALC_BONUS_TOGGLE_YES = "Yes";
export const CALC_BONUS_TOGGLE_NO = "No";
export const CALC_BONUS_TOGGLE_DEFAULT = true;
export const CALC_BONUS_TOGGLE_NOTE = `When enabled, the proposed ${FIRST_MONTH_BONUS_PCT}% first-month bonus replaces — not adds to — the recurring percentage for month one only.`;

export const CALC_STEP_BONUS_M1_LABEL = `${FIRST_MONTH_BONUS_PCT}% × Monthly Archer Subscription Revenue Introduced`;
export const CALC_STEP_BONUS_M1_RESULT_LABEL = "Month 1 — Illustrative DNS Partner Value";
export const CALC_STEP_BONUS_M2_LABEL = "Monthly Subscription Revenue × Selected Recurring Partner Share";
export const CALC_STEP_BONUS_M2_RESULT_LABEL = "Month 2+ — Illustrative Monthly DNS Partner Value";
export const CALC_STEP_BONUS_YEAR_LABEL = "Month 1 Bonus + (Month 2+ Value × 11)";
export const CALC_STEP_BONUS_YEAR_RESULT_LABEL = "Illustrative Year-One DNS Partner Value";
export const CALC_STEP_BONUS_YEAR_NOTE = "Assumes the referred subscription remains active and paid for all 12 months, including month one. Not a guarantee.";

// Mode B — one-time activation. IMPORTANT: unlike Mode A, this models a
// package that doesn't exist as a priced product yet (the Project Reveal
// Kit is explicitly conceptual — see REVEALKIT_DISCLAIMER). Its "average
// activation value" is therefore a plain, user-selectable illustrative
// number — never one of Archer's real named monthly plans — so nothing on
// this page implies a package price has actually been set.
export const CALC_B_INPUT_1_LABEL = "DNS hospitality projects per year";
export const CALC_B_INPUT_1_QUICK = [1, 3, 5, 10, 15, 20] as const;
export const CALC_B_INPUT_1_DEFAULT = 6;
export const CALC_B_INPUT_1_MAX = 20;

export const CALC_B_INPUT_2_LABEL = "% adding Archer activation";
export const CALC_B_INPUT_2_OPTIONS = [25, 50, 75] as const;
export const CALC_B_INPUT_2_DEFAULT = 50;

export const CALC_B_INPUT_3_LABEL = "Average Activation Value";
export const CALC_B_INPUT_3_OPTIONS = [500, 1000, 2000, 3000] as const;
export const CALC_B_INPUT_3_DEFAULT = 1000;
export const CALC_B_INPUT_3_NOTE = "An illustrative scenario value only — Archer has not set a price for a productized post-install package.";

export const CALC_B_INPUT_4_LABEL = "Illustrative Partner Share";
export const CALC_B_INPUT_4_OPTIONS = [5, 10, 15] as const;
export const CALC_B_INPUT_4_DEFAULT = 10;

export const CALC_B_STEP_1_LABEL = "DNS projects × % adding Archer activation";
export const CALC_B_STEP_1_RESULT_LABEL = "Estimated activated projects";
export const CALC_B_STEP_2_LABEL = "Activated projects × average activation value";
export const CALC_B_STEP_2_RESULT_LABEL = "Illustrative activation value created";
export const CALC_B_STEP_3_LABEL = "Activation value × illustrative partner share";
export const CALC_B_STEP_3_RESULT_LABEL = "Illustrative Partner Value";

export const CALC_DISCLAIMER = "Scenario only. Not a forecast. Actual economics, client ownership, scope and terms would be agreed separately.";
export const CALC_BOTH_WAYS_NOTE =
  "Opportunity would not run one direction. Archer works alongside hospitality operators who eventually need exactly the design, fabrication and installation work DNS provides.";

/* ── 09.5 — Additional creative range (broader motion capability) ────────
   Placed directly below the calculator, per request: everything above this
   point is hospitality-specific; this section exists only to show Tony that
   Archer's motion/campaign range extends further, without shifting the
   page's overall focus away from hospitality. */
export const BROADER_EYEBROW = "Additional Creative Range";
export const BROADER_HEADING = "A broader visual range, still relevant to the opportunity.";
export const BROADER_COPY =
  "While the most immediate fit is hospitality launch and activation work, Archer's motion and campaign capabilities extend beyond hotel-specific content. This broader range can be useful when DNS needs more elevated storytelling, branded presentation, or visually ambitious campaign work.";
export const BROADER_TAGS = ["Branded motion", "Product motion", "Campaign storytelling", "Experimental visual work"];
export const BROADER_NOTE = "Shown for range. The hospitality work above remains the direct fit for this opportunity.";

/* ── 10 — How it works (lifecycle) ────────────────────────────────────── */
export const LIFECYCLE_EYEBROW = "How It Works";
export const LIFECYCLE_HEADING_LINE_1 = "From built environment";
export const LIFECYCLE_HEADING_LINE_2 = "to marketable experience.";

export const LIFECYCLE_STAGES = [
  { key: "concept", label: "Concept", owner: "dns" },
  { key: "design", label: "Design", owner: "dns" },
  { key: "engineering", label: "Engineering", owner: "dns" },
  { key: "fabrication", label: "Fabrication", owner: "dns" },
  { key: "installation", label: "Installation", owner: "dns" },
  { key: "space-opens", label: "Space Opens", owner: "both" },
  { key: "reveal", label: "Project Reveal", owner: "archer" },
  { key: "campaigns", label: "Campaigns", owner: "archer" },
  { key: "events-fb", label: "Events and F&B", owner: "archer" },
  { key: "activation", label: "Ongoing Activation", owner: "archer" },
] as const;

export const LIFECYCLE_DNS_LABEL = "DNS Industries — physical development";
export const LIFECYCLE_ARCHER_LABEL = "Archer Design — marketing activation";
export const LIFECYCLE_OVERLAP_NOTE = "The two sides meet where the space opens, when a finished environment becomes a story worth telling.";

/* ── 11 — Proof ────────────────────────────────────────────────────────── */
export const PROOF_EYEBROW = "Proof";
export const PROOF_HEADING_LINE_1 = "Hospitality creative";
export const PROOF_HEADING_LINE_2 = "built for real property activity.";
export const PROOF_SUPPORTING_COPY =
  "Archer works as an extension of hospitality teams, turning existing photography, offers, F&B, meetings, weddings and property priorities into finished campaign assets.";

export const HOTEL_INDIGO_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming a top-performing Hotel Indigo property on the East Coast.";
export const HOTEL_INDIGO_SUPPORTING_COPY =
  "The work tied events, F&B, meetings, local demand and seasonal priorities to one consistent creative and social calendar.";
export const HOTEL_INDIGO_QUALIFICATION =
  "Reflects reporting shared by the property during the engagement. Not an independently audited brand-wide claim.";

/* ── 12 — Close (final CTA) ────────────────────────────────────────────── */
export const FINAL_EYEBROW = "Close";
export const FINAL_HEADING = "Start with one project. Build something repeatable.";
export const FINAL_COPY =
  "A first hospitality opportunity could begin with a launch, project reveal, or simple introduction. If the fit works, the larger opportunity is a repeatable model where Archer supports DNS-referred hospitality clients on an ongoing basis and DNS participates in the recurring value those relationships create.";
export const FINAL_CTA_PRIMARY = "Explore a First Opportunity";
export const FINAL_CTA_SECONDARY = "View the Creative";

export const FOOTER_LOCKUP = "DNS Industries × Archer Design";
// The one comprehensive speculative/no-partnership disclaimer, combining
// what used to be two separate versions shown in five places across the
// page down to this single footer placement (the other surviving mention,
// CALC_DISCLAIMER above, is specific to the calculator's numbers).
export const FOOTER_DISCLOSURE_LINE =
  "Independent speculative concept prepared by Archer Design for discussion with DNS Industries. Not commissioned, sponsored, endorsed or approved by DNS Industries. No partnership, referral arrangement, financial terms or endorsement currently exists.";
