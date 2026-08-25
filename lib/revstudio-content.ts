// Page-specific copy for the joint Revstudio x Archer Design /revstudio page.
// Kept out of the component tree so the page itself stays focused on layout.
// This copy replaces the earlier standalone-Revstudio verbiage per Devon's
// "Complete Page Copy - Joint Partnership Page" brief. House rule: no em
// dashes anywhere in this file (Archer brand rule) - use periods, commas,
// or colons instead. Every claim here is the approved set; do not add
// invented stats, hotel counts, or client counts beyond what's written.

export const HERO = {
  eyebrow: "The Revstudio x Archer Design",
  headline: "From revenue priority to finished campaign.",
  supporting:
    "The Revstudio runs the commercial side: distribution, rates, and reporting. Archer Design turns those priorities into finished campaigns, motion, and social content.",
  // Icon-led benefit items (replaces the old plain-text pills). Icons are
  // chosen in the component (lucide-react), this just carries label/support.
  benefits: [
    { label: "Revenue strategy", support: "Distribution, pricing, and reporting aligned" },
    { label: "Campaign execution", support: "Finished creative built around the priority" },
    { label: "Property activation", support: "Guest-facing work reaches the market" },
  ],
  // No independently-verifiable, publicly-attributed client testimonial was
  // found on The Revstudio's public site (therevstudio.co is a client-
  // rendered app; no testimonial content was reachable/confirmable this
  // session). Per instructions, falling back to a proof statement built
  // only from figures already approved and cited elsewhere on this page
  // (see RESULTS.revstudio in this file) rather than inventing a quote.
  proof: {
    lead: "+60% reduction in operational time. +35% average cost reduction vs. in-house hiring.",
    attribution: "The Revstudio, operational results across RM agency hotel partnerships",
  },
  italicLine: "One connected path from commercial priority to finished campaign.",
  primaryCta: "Discuss a pilot",
  secondaryCta: "See how the model works",
};

export const OPPORTUNITY = {
  eyebrow: "The opportunity",
  headline: "Most hotels see the opportunity long before the campaign exists.",
  body: "A hotel usually knows which need period, package, segment, event, or restaurant deserves attention next. What slows everything down is what comes after: OTA updates, channel changes, rate coordination, and then the creative, the offer graphics, the reel, the landing page, the email, and the collateral a sales conversation needs. On a lean team, that work competes with everything else, and the moment passes.",
  bridge:
    "The Revstudio carries the priority through the commercial operation. Archer Design turns it into a campaign guests can see, understand, and act on.",
  // Four-stage "opportunity to activation" process used by the execution-gap
  // infographic beneath the intro copy. Distinct from PROCESS.stages below
  // (the six-step "How it works" section further down the page); this one
  // is scoped to the Opportunity section only. owner drives the accent
  // color: "revstudio" = violet, "archer" = champagne, "shared" = neutral.
  stages: [
    {
      index: "01",
      label: "Opportunity identified",
      description: "A need period, package, segment, restaurant, event, or local demand opportunity becomes clear.",
      owner: "shared" as const,
    },
    {
      index: "02",
      label: "Commercial priority",
      description: "Pricing, channels, distribution, reporting, and timing are coordinated.",
      owner: "revstudio" as const,
    },
    {
      index: "03",
      label: "Creative execution",
      description: "The campaign, motion, social content, landing page, email assets, and sales materials are produced.",
      owner: "archer" as const,
    },
    {
      index: "04",
      label: "Property activation",
      description: "Approved work reaches the appropriate guest-facing and sales touchpoints.",
      owner: "shared" as const,
    },
  ],
  gap: {
    label: "The execution gap",
    body: "Where lean teams most often lose time, consistency, and momentum.",
  },
  conclusion: {
    revstudio:
      "Carries the commercial priority through distribution, reporting, channel coordination, and operational follow-through.",
    archer:
      "Turns the priority into finished campaign creative, motion, social content, landing pages, and sales-support assets.",
    badge: "Coordinated activation",
    closing: "One priority. Two specialist execution layers. A clearer path to launch.",
  },
};

// ─────────────────────────────────────────────────────────────────────────
// RESULTS. Two separately attributed proof sets: The Revstudio's
// operational figures and Archer Design's creative figures. Never blend
// these into a shared/combined total; each stays owned by the business
// that produced it.
//
// IMPLEMENTATION NOTE: the Revstudio figures below were supplied by Devon
// from existing Revstudio materials, not independently audited. Final
// public wording and supporting documentation should be approved by
// Ghisela before production publication.
// ─────────────────────────────────────────────────────────────────────────
export const RESULTS = {
  eyebrow: "Results",
  headline: "Two types of proof. One coordinated model.",
  body: "The Revstudio measures operational capacity, efficiency, and commercial execution. Archer Design measures creative reach, engagement, and finished production. Each result remains attributed to the team responsible for it.",
  revstudio: {
    name: "The Revstudio",
    tag: "Operational results",
    stats: [
      { value: "+60%", label: "Reduction in operational time", sublabel: "For RM teams" },
      { value: "+35%", label: "Average cost reduction", sublabel: "Vs. in-house hiring" },
      { value: "7+", label: "Client span of control per manager", sublabel: "Up from 4" },
      { value: "+28%", label: "Workflow efficiency", sublabel: "Improvement reported" },
    ],
    // Keep this disclaimer intact; do not shorten it to the point the
    // qualification is lost.
    disclaimer:
      "Figures are based on results observed across The Revstudio agency partnerships with independent hotels under full-scope service. Outcomes may vary depending on agency size, workflows, and scope of engagement.",
  },
  archer: {
    name: "Archer Design",
    tag: "Creative results",
    stats: [
      { value: "18.6M+", label: "Tracked impressions" },
      { value: "4.9M+", label: "Reach" },
      { value: "612K+", label: "Engagements" },
      { value: "2.7K+", label: "Creative pieces delivered" },
    ],
    disclaimer: "Tracked across supported hospitality campaigns. Built to demonstrate the body of work, not to guarantee a future result.",
  },
  bridge: { top: "Operations", bottom: "Creative execution" },
  bridgeNote: "Operational performance and creative performance are measured separately so attribution remains clear.",
  logosHeading: "Selected brands represented in Archer Design's property-level hospitality work",
  logosDisclaimer:
    "Experience reflects property-level, management-company, and creative-support work. Logos are shown for context and do not imply corporate endorsement, sponsorship, or a direct brand-wide engagement unless specifically stated.",
};

export const MODEL = {
  eyebrow: "The model",
  headline: "One commercial priority. Two specialist layers.",
  revstudio: {
    name: "The Revstudio",
    tag: "Revenue and commercial operations",
    items: [
      "Revenue-management support",
      "OTA setup, optimization, and administration",
      "Channel and rate coordination",
      "Rate-parity support",
      "Pricing and promotion coordination",
      "Commercial reporting and portfolio visibility",
      "White-label support for revenue-management agencies",
      "The daily follow-through that keeps it all moving",
    ],
  },
  archer: {
    name: "Archer Design",
    tag: "Creative execution",
    items: [
      "Campaign concepts and visuals",
      "Social graphics and recurring monthly content",
      "Short-form motion and reels",
      "F&B and restaurant promotion",
      "Meetings, weddings, and event creative",
      "Package, offer, and direct-booking assets",
      "Landing-page and email visuals",
      "Sales-support collateral, approval-ready",
    ],
  },
  bridge: "Strategy identifies the opportunity. Creative brings it to market.",
};

export const PROCESS = {
  eyebrow: "How it works",
  headline: "How the work moves.",
  subheading: "From commercial opportunity to finished campaign, every step stays connected.",
  // Six-step connected workflow. `t` is the full sentence, kept for
  // accessibility (aria-label) and as documentation of intent; `label` is
  // the short display word shown on the node; `d` is the short supporting
  // line. `owner`/`ownerType` drive the ownership tag and the node's
  // violet/gold styling hook (ownerType: "revstudio" | "shared" | "archer" | "mixed").
  stages: [
    {
      n: "01",
      label: "Identify",
      t: "Identify the commercial opportunity",
      d: "Need period, segment, channel, package, or promotion",
      owner: "REVSTUDIO",
      ownerType: "revstudio",
    },
    {
      n: "02",
      label: "Align",
      t: "Define the activation",
      d: "Offer, audience, timing, channels, and deliverables",
      owner: "SHARED",
      ownerType: "shared",
    },
    {
      n: "03",
      label: "Activate Revenue",
      t: "Move the commercial levers",
      d: "Distribution, pricing, channels, and reporting",
      owner: "REVSTUDIO",
      ownerType: "revstudio",
    },
    {
      n: "04",
      label: "Build Creative",
      t: "Build the creative",
      d: "Campaign visuals, motion, social, email, and landing assets",
      owner: "ARCHER DESIGN",
      ownerType: "archer",
    },
    {
      n: "05",
      label: "Launch Together",
      t: "Review and launch",
      d: "Hotel approval, commercial changes, and creative go live",
      owner: "HOTEL + BOTH TEAMS",
      ownerType: "mixed",
    },
    {
      n: "06",
      label: "Measure + Refine",
      t: "Measure and refine",
      d: "Review results and sharpen the next priority",
      owner: "SHARED REPORTING",
      ownerType: "shared",
    },
  ],
  centralBadge: ["One priority", "One brief", "One coordinated launch"],
};

export const USE_CASES = {
  eyebrow: "In practice",
  headline: "What a coordinated priority looks like.",
  subheading: "Four common hotel scenarios. One coordinated commercial + creative workflow.",
  // Each scenario is shown as a short 4-step flow: setup -> revstudio ->
  // archer -> outcome. Meaning preserved from the original longer copy,
  // compressed to single lines for the scenario-switcher infographic.
  items: [
    {
      t: "Need-period campaign",
      setup: "Soft weeks need demand support",
      revstudio: "Flags the window, adjusts rates/promotions, improves visibility",
      archer: "Builds the offer creative, reel, email, and landing page",
      outcome: "Campaign launches while the booking window is still open",
    },
    {
      t: "Direct-booking package",
      setup: "A package needs to sell clearly across channels",
      revstudio: "Structures the package and where it appears",
      archer: "Builds the web, email, social, and sales visuals",
      outcome: "The offer feels guest-ready and easier to book",
    },
    {
      t: "F&B, events, and local demand",
      setup: "Restaurant, rooftop, weddings, or local moments need promotion",
      revstudio: "Connects the opportunity to the commercial calendar",
      archer: "Creates promos, event graphics, and motion assets",
      outcome: "More visibility for on-property demand drivers",
    },
    {
      t: "Revenue-management agency support",
      setup: "Agency clients need both ops execution and campaign creative",
      revstudio: "Handles white-label distribution, reporting, and operations support",
      archer: "Supplies the creative layer the hotels still need",
      outcome: "Agency delivery expands without building a full internal team",
    },
  ],
};

export const AGENCIES = {
  eyebrow: "For agencies",
  headline: "Extend your delivery on both sides: operations and creative.",
  body: "Revenue-management agencies rarely lose clients over strategy. They lose them over bandwidth. The Revstudio adds analyst capacity, distribution execution, and consistent reporting behind your brand. And when your hotel clients need the campaign built, not just the priority named, Archer Design provides the creative layer without you hiring a design and production team.",
  cardLabel: "Extend delivery without building a second internal team",
  groups: [
    {
      title: "Operations support",
      items: ["White-label revenue operations and reporting", "Flexible analyst capacity", "Distribution and channel execution"],
    },
    {
      title: "Creative support",
      items: ["Campaign creative, motion, and social production", "Landing-page and sales-support assets"],
    },
    {
      title: "Engagement structure",
      items: ["Clear client and account boundaries"],
    },
  ],
  benefits: [
    "White-label revenue operations and reporting",
    "Distribution and channel execution",
    "Flexible analyst capacity",
    "Campaign creative, motion, and social production",
    "Landing-page and sales-support assets",
    "Clear client and account boundaries",
  ],
  disclaimer: "White-label scope, referral ownership, client communication, and responsibilities are defined in writing for each engagement.",
};

export const HOTELS = {
  eyebrow: "For hotels",
  headline: "Built for teams already wearing too many hats.",
  body: "At most independent hotels, revenue tasks and marketing tasks land on the same few people, in the margins of their real jobs. The Revstudio brings structure to distribution, rates, and reporting. Archer Design keeps the property visible with finished monthly creative. Neither replaces your team. Both give it room to breathe.",
  summaryLabel: "Commercial structure + creative execution",
  summaryBanner: "Your team gets room to breathe.",
  revstudioHandles: ["Distribution", "OTA visibility", "Rate consistency", "Reporting", "Commercial coordination", "Operational follow-through"],
  archerHandles: ["Social and motion", "Campaign creative", "F&B promotion", "Event and meeting assets", "Offer and package visuals", "Landing pages and sales collateral"],
};

export const PORTFOLIO = {
  headline: "One operating rhythm across revenue and creative.",
  body: "For hotel groups, management companies, and agency portfolios, the model scales the same way at every property: shared standards at the portfolio level, execution at the property level.",
  portfolioTitle: "Shared commercial standards",
  propertyTitle: "Property-level execution",
  connector: "Shared standards at the portfolio level. Execution at the property level.",
  portfolioLevel: ["Shared commercial standards", "Prioritized revenue opportunities", "Reporting and visibility", "Campaign planning", "One approval structure"],
  propertyLevel: ["Distribution execution", "Property-specific priorities", "Local campaign adaptation", "F&B and event promotion", "Recurring creative production", "Sales-support materials"],
};

export const PRICING = {
  eyebrow: "Pricing",
  headline: "One number per hotel. Both sides covered.",
  body: "Combined revenue operations and creative execution from $3,000 per hotel per month. That covers The Revstudio's distribution, channel, and reporting work and Archer Design's monthly creative production for the same property, scoped together so the commercial priority and the campaign never drift apart.",
  primaryCallout: "From $3,000",
  calloutUnit: "/ hotel / month",
  calloutSubLabel: "Combined revenue operations + creative execution",
  visualRow: "The Revstudio + Archer Design = one coordinated monthly model",
  detailLines: [
    "Combined Revstudio + Archer Design support",
    "Pilot engagements available for a first hotel or cluster",
    "Multi-property and portfolio pricing available",
    "Exact scope, deliverable volume, and reporting defined per engagement",
  ],
  smallPrint: "Pricing depends on portfolio size and the mix of revenue, distribution, reporting, and creative support required. No engagement includes unlimited work; scope is defined in writing.",
};

export const PILOT = {
  eyebrow: "The pilot",
  headline: "Start with one real opportunity.",
  body: "Bring one hotel, one cluster, or one clearly defined commercial priority. The pilot runs the full loop once: priority set, channels moved, creative shipped, results reported. Then everyone decides whether to expand, with evidence instead of promises.",
  checklistTitle: "What the pilot includes",
  structure: [
    "One hotel, cluster, or agency client",
    "One defined commercial priority",
    "Agreed Revstudio responsibilities",
    "Agreed Archer Design deliverables",
    "Clear timeline and approvals",
    "Commercial and creative results reported side by side",
    "Post-pilot review, optional expansion",
  ],
  // Three-step mini diagram shown alongside the checklist.
  flow: [
    { label: "Priority", detail: "Chosen" },
    { label: "Execution", detail: "Coordinated" },
    { label: "Review", detail: "Reported" },
  ],
  cta: "Discuss a pilot",
};

export const PARTNERS = {
  eyebrow: "The partners",
  headline: "Two independent specialists. One coordinated engagement.",
  connectorLabel: "Coordinated commercial priority + finished campaign delivery",
  revstudio: {
    name: "The Revstudio",
    tag: "Revenue & commercial operations",
    body: "The Revstudio provides revenue-management and distribution operations for independent hotels and revenue-management agencies: OTA and channel administration, rate-parity support, pricing and promotion coordination, and commercial reporting. Execution capacity is based nearshore, giving hotel and agency teams real operational bandwidth without new headcount.",
    bullets: [
      "OTA and channel administration",
      "Rate-parity and pricing coordination",
      "Revenue-management support",
      "Commercial reporting",
      "Operational follow-through",
      "Nearshore execution capacity",
    ],
  },
  archer: {
    name: "Archer Design",
    tag: "Creative execution",
    body: "Archer Design is a hospitality creative studio producing recurring social content, short-form motion, campaign visuals, F&B and event promotion, direct-booking assets, landing pages, and sales-support materials. Work to date spans brands including Hampton by Hilton, IHG, and Hotel Indigo, with 2,700+ creative pieces delivered and 18.6M+ tracked impressions across supported hospitality campaigns.",
    bullets: [
      "Recurring social content",
      "Short-form motion",
      "Campaign visuals",
      "F&B and event promotion",
      "Direct-booking assets",
      "Landing pages and sales support",
    ],
    // Same approved figures as RESULTS.archer.stats above; kept in sync,
    // not a new/separate claim.
    stats: [
      { value: "2.7K+", label: "Creative pieces delivered" },
      { value: "18.6M+", label: "Tracked impressions" },
    ],
  },
  independenceLine:
    "The Revstudio and Archer Design are independent businesses. Scope, client ownership, responsibilities, fees, and contracting structure are defined in writing for each engagement.",
};

// The two business owners behind this partnership, shown near the bottom
// of the page. `side` drives the violet/gold accent tying each person to
// their company, matching the color convention used throughout the page.
export const PRINCIPALS = {
  eyebrow: "The people",
  headline: "Run by two people, not two logos.",
  people: [
    { name: "Ghisela Angulo", company: "The Revstudio", photo: "/revstudio/media/ghisela-angulo-photo-DeEuDGLL.jpg", side: "revstudio" },
    { name: "Devon Archer", company: "Archer Design", photo: "/revstudio/media/devo.png", side: "archer" },
  ],
};

export const FAQ = [
  {
    q: "What does The Revstudio handle?",
    a: "The commercial side: revenue-management support, OTA and channel administration, rate parity, pricing and promotion coordination, reporting, and day-to-day distribution follow-through.",
  },
  {
    q: "What does Archer Design handle?",
    a: "The guest-facing side: campaign creative, social graphics, short-form motion, F&B and event promotion, package and direct-booking visuals, landing pages, email creative, and sales-support collateral.",
  },
  {
    q: "Do we have to use both companies?",
    a: "No. Some engagements involve only one specialist. The combined model exists for hotels and agencies that need the priority and the campaign handled together.",
  },
  {
    q: "Is this a merged company?",
    a: "No. The Revstudio and Archer Design are independent businesses that collaborate on the right hotel and agency opportunities.",
  },
  {
    q: "Can a revenue-management agency use this as a white-label service?",
    a: "Yes, on both sides. White-label, referral, and collaborative structures are defined case by case, in writing.",
  },
  {
    q: "Can we begin with one hotel?",
    a: "Yes. A focused pilot on one property or one commercial priority is the recommended starting point.",
  },
  {
    q: "Who owns final approval?",
    a: "The hotel or designated client team. Nothing publishes, reprices, or launches without your sign-off, and publishing responsibilities are defined in the scope.",
  },
  {
    q: "How is pricing structured?",
    a: "Combined support starts at $3,000 per hotel per month, with multi-property and pilot pricing available. Final pricing depends on portfolio size and scope.",
  },
];

export const FINAL_CTA = {
  headline: "Turn the next revenue priority into a finished campaign.",
  body: "Bring one hotel, one need period, one package, or one agency client. The Revstudio and Archer Design will tell you honestly whether a coordinated pilot makes sense.",
  primaryCta: "Discuss a pilot",
  secondaryCta: "Contact the partners",
};
