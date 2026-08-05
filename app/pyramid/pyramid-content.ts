// ─────────────────────────────────────────────────────────────────────────────
// pyramid-content.ts — copy and small data constants for the /pyramid
// private creative-production concept, prepared privately by Archer Design
// for Pyramid Global Hospitality (initial audience: Jessica Milton and the
// Pyramid Global Hospitality marketing team). Not commissioned, reviewed, or
// approved by Pyramid, Benchmark, or any featured property — see the
// disclaimers below and in app/pyramid/page.tsx.
//
// Figures cited here (230+ properties; Benchmark's 60+ independent luxury
// and lifestyle properties, 11,000+ guest rooms, $1B+ annual operating
// revenue) are drawn from Pyramid Global Hospitality's current official
// website (pyramidglobal.com/who-we-are and
// pyramidglobal.com/benchmark-resorts-hotels), verified directly against
// those pages before writing this file. Benchmark-specific figures are
// always labeled as Benchmark's division, never applied to Pyramid's whole
// portfolio.
// ─────────────────────────────────────────────────────────────────────────────

export const PILOT_CALENDLY_URL = "https://calendly.com/devonavich0/30min";

/* ── Private concept label (bar under header) ──────────────────────────── */
export const PRIVATE_LABEL_EYEBROW = "Private creative concept";
export const PRIVATE_LABEL_SUB = "Prepared independently by Archer Design";

/* ── Hero ──────────────────────────────────────────────────────────────── */
export const HERO_EYEBROW = "A private creative concept for Pyramid Global Hospitality";
export const HERO_HEADLINE = "230+ properties. Thousands of approved photographs. Most get used once.";
export const HERO_SUPPORTING_COPY =
  "Archer Design turns photography Pyramid and its properties already own into motion — hero loops, vertical reels, campaign graphics, dining promotions, event and wellness creative.";
export const HERO_TAGLINE = "Your strategy. Your brand standards. Our production capacity.";
export const HERO_PRIMARY_CTA = "View the motion studies";
export const HERO_SECONDARY_CTA = "Explore a focused pilot";
export const HERO_DISCLAIMER =
  "Independent speculative concept. Not commissioned or approved by Pyramid Global Hospitality or any featured property.";

/* ── Scale strip — grouped: Pyramid overall, then the Benchmark division ─ */
export const SCALE_GROUPS = [
  {
    key: "pyramid",
    title: "Pyramid Global Hospitality",
    stats: [
      { value: "230+", label: "Properties globally" },
      { value: "Full-service to lifestyle", label: "Branded, independent, select-service, luxury, resort" },
    ],
  },
  {
    key: "benchmark",
    title: "Within the Benchmark division",
    stats: [
      { value: "60+", label: "Independent luxury and lifestyle properties" },
      { value: "11,000+", label: "Guest rooms" },
      { value: "$1B+", label: "Annual operating revenue" },
    ],
  },
];
export const SCALE_NOTE =
  "Figures reflect Pyramid Global Hospitality's publicly presented company information. Benchmark-specific figures are labeled separately.";

/* ── Portfolio breadth ─────────────────────────────────────────────────── */
export const PORTFOLIO_HEADING = "A select-service hotel and a luxury wellness resort should not sound the same.";
export const PORTFOLIO_COPY =
  "That's the hard part of creative at this scale. A system that produces work fast usually flattens everything into one house style. A system that respects each property usually can't keep up.";
export const PORTFOLIO_CARDS = [
  { key: "branded", title: "Branded hotels", note: "Full-service and select-service under major flags." },
  { key: "independent", title: "Independent resorts", note: "Brand-of-one properties with their own identity and rhythm." },
  { key: "luxury-lifestyle", title: "Luxury and lifestyle", note: "Design-led stays where tone matters as much as amenities." },
  { key: "fb", title: "Restaurants and bars", note: "Dining and drink programs on their own seasonal calendars." },
  { key: "meetings", title: "Meetings and conventions", note: "A different buyer, a different pace, a different proof point." },
  { key: "weddings", title: "Weddings and celebrations", note: "Milestone moments that earn a cinematic treatment." },
  { key: "wellness", title: "Wellness, golf, and recreation", note: "Spa, golf, and outdoor programs built around restoration." },
  { key: "openings", title: "Openings and seasonal packages", note: "Time-bound priorities that need fast turnaround." },
];

/* ── The creative system (now precedes the motion studies) ─────────────── */
export const CREATIVE_SYSTEM_HEADING = "One photograph. Ten finished assets.";
export const CREATIVE_SYSTEM_COPY = "A single approved property photograph becomes:";
export const CREATIVE_SYSTEM_SOURCE = "Approved property photograph";
export const CREATIVE_SYSTEM_OUTPUTS = [
  "A hero motion asset",
  "A vertical 9:16 reel",
  "A 4:5 social campaign",
  "A story or reel cover",
  "A static promotional graphic",
  "An F&B or event variation",
  "Sales-support creative",
  "A website or landing-page loop",
  "Resized property adaptations",
];
export const CREATIVE_SYSTEM_TRANSITION = "The studies below show what that looks like in practice.";
export const CREATIVE_SYSTEM_NOTE =
  "Every scope stays defined. This is a repeatable production system, not a promise of unlimited work.";

/* ── Motion studies section intro ─────────────────────────────────────── */
export const MOTION_STUDIES_HEADING = "Five clips. Five different reasons to move.";
export const MOTION_STUDIES_COPY =
  "Each of these began as a still photograph. Motion, compositing, and environmental animation turned them into campaign-ready assets — without losing the setting, atmosphere, or character of the original frame.";
export const MOTION_STUDIES_ATTRIBUTION_NOTE =
  "Where footage clearly matches a Pyramid or Benchmark property, it's identified. Where it doesn't, it's presented as a general creative study.";

/* ── Food & beverage supporting feature ──────────────────────────────── */
export const FB_SECTION_EYEBROW = "Food & beverage storytelling";
export const FB_SECTION_HEADING = "The same system, applied to what's on the plate.";
export const FB_SECTION_COPY =
  "One plated shot becomes a menu launch, a breakfast campaign, a seasonal package, and a property-level dining promotion. Restaurant, bar, and breakfast moments follow exactly the same approach as the property work.";

/* ── How the workflow fits ───────────────────────────────────────────── */
export const WORKFLOW_HEADING = "Pyramid keeps the strategy. Archer adds the capacity.";
export const WORKFLOW_STEPS = [
  {
    idx: "01",
    title: "The priority is set",
    body: "Your marketing team picks the offer, experience, need period, event, opening, or story.",
  },
  {
    idx: "02",
    title: "Assets come over",
    body: "The participating team sends approved photography, details, brand guidance, and the deadline.",
  },
  {
    idx: "03",
    title: "Archer produces",
    body: "Animation, campaign design, editing, typography, format adaptation, final exports.",
  },
  {
    idx: "04",
    title: "One round of review",
    body: "A single structured feedback pass instead of scattered property-level revisions.",
  },
  {
    idx: "05",
    title: "Delivery",
    body: "Final assets organized, formatted, and ready for approved channels.",
  },
];
export const WORKFLOW_CONTROL_HEADING = "Who controls what";
export const PYRAMID_RETAINS = ["Strategy", "Brand standards", "Messaging", "Property priorities", "Media approval", "Publishing decisions", "Final approval"];
export const ARCHER_SUPPLIES = ["Motion production", "Design execution", "Editing", "Campaign variations", "Resizing", "Organized delivery", "Additional monthly capacity"];

/* ── Two potential operating models ──────────────────────────────────── */
export const MODELS_HEADING = "An extension of your team — or a resource for owners.";
export const OPERATING_MODELS = [
  {
    key: "corporate",
    title: "Corporate creative extension",
    subtitle: "Model A",
    intro: "Archer works as added capacity for centralized, regional, or property marketing teams.",
    items: [
      "Defined monthly production capacity",
      "One consolidated intake for projects",
      "Work driven by approved property priorities",
      "A predictable creative workflow",
      "No new full-time motion department",
    ],
  },
  {
    key: "owner-facing",
    title: "Approved owner-facing program",
    subtitle: "Model B",
    intro: "Archer is offered to participating owners and properties as an approved resource.",
    items: [
      "Preferred-vendor or approved-resource structure",
      "Properties opt in themselves",
      "Central creative standards maintained",
      "Transparent scope and pricing",
      "Scales only where demand is proven",
    ],
  },
];
export const MODELS_NOTE =
  "Any commercial structure would be company-approved, transparent, contractually defined, and shaped around the participating properties.";

/* ── Archer Design proof ─────────────────────────────────────────────── */
export const PROOF_STATS = [
  { value: "2.64K", label: "Published social posts" },
  { value: "16.05M", label: "Impressions" },
  { value: "5.2M", label: "People reached" },
  { value: "596.43K", label: "Engagements" },
];
export const PROOF_EXPERIENCE_LABEL = "Property-level experience";
export const PROOF_EXPERIENCE = [
  "Hotel Indigo Pittsburgh University–Oakland",
  "Hampton Inn Greensburg",
  "Hampton Inn Johnstown",
  "Eliza Hot Metal Bistro",
  "Elements Salon & Wellness",
];
export const HOTEL_INDIGO_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University–Oakland reported becoming a top-performing Hotel Indigo property on the East Coast.";
export const PROOF_DISCLAIMER =
  "Results reflect tracked hospitality campaigns and vary by property, audience, offer, platform, publishing strategy, media budget, season, and market. Brand names reflect property-level experience and do not imply corporate endorsement.";

/* ── Recommended pilot ───────────────────────────────────────────────── */
export const PILOT_HEADING = "Start focused. Prove the workflow. Scale only when it earns the right.";
export const PILOT_RECOMMENDATION = "A three- to five-property creative pilot";
export const PILOT_MIX = [
  "One independent luxury resort",
  "One lifestyle hotel",
  "One branded full-service property",
  "One restaurant- or events-heavy property",
  "One meetings, wellness, or destination property",
];
export const PILOT_OBJECTIVES_HEADING = "What the pilot answers";
export const PILOT_OBJECTIVES = [
  "Does asset intake work cleanly?",
  "How fast is turnaround, really?",
  "Does consolidated review hold up?",
  "Do properties actually use what they get?",
  "Is the creative good enough to keep?",
  "Is there recurring demand, or was this a one-time need?",
  "Can this become a scalable operating model?",
];
export const PILOT_PRICING_NOTE =
  "Scope and portfolio pricing would be based on the participating properties, monthly volume, complexity, formats, turnaround expectations, and service term.";
export const PILOT_CTA = "Discuss a focused Pyramid pilot";

/* ── Pilot: testing the business model, not just the creative workflow ─── */
export const PILOT_COMMERCIAL_HEADING = "Testing the business model";
export const PILOT_COMMERCIAL_QUESTIONS = [
  "Do participating owners understand the service?",
  "Are owners willing to pay for recurring creative production?",
  "Do participating properties use the completed assets?",
  "Does consolidated review remain manageable?",
  "Does the pricing create enough value for the owner?",
  "Does the gross partner margin justify Pyramid's involvement?",
  "Which package receives stronger demand?",
  "Which billing and contracting structure works best?",
  "Are participating properties willing to renew?",
];
export const PILOT_COMMERCIAL_NOTE =
  "A focused pilot would test both creative execution and commercial viability before any broader rollout.";

/* ── Personalized note — direct address, placed just above the final CTA ─ */
export const NOTE_SALUTATION = "Jessica —";
export const NOTE_PARAGRAPHS = [
  "Pyramid already has the properties, commercial priorities, and an enormous library of approved photography. Archer's role is to turn selected still images into recurring motion and campaign assets.",
  "The service could be used as direct production capacity for Pyramid's marketing organization. It could also become an optional owner-facing program: participating properties purchase a defined package, Archer receives the agreed production rate, and Pyramid retains the agreed gross partner margin.",
  "The proposal is to begin with three to five properties, confirm that teams use the work, test owner willingness to pay, and determine whether the operating and commercial model deserves to scale.",
];
export const NOTE_SIGNATURE = "— Devon, Archer Design";

/* ── Final CTA ────────────────────────────────────────────────────────── */
export const FINAL_EYEBROW = "Archer Design × Pyramid Global Hospitality";
export const FINAL_HEADING = "Turn existing photography into a repeatable property service.";
export const FINAL_COPY =
  "Participating owners receive a defined stream of motion and campaign creative. Pyramid gains additional portfolio production capacity and a potential gross partner-margin opportunity. Archer handles the specialized execution.";
export const FINAL_PRIMARY_CTA = "Discuss a Pyramid pilot";
export const FINAL_SECONDARY_CTA = "View Archer Design hospitality work";

/* ── Footer disclaimer ────────────────────────────────────────────────── */
export const FOOTER_DISCLAIMER_LEAD = "Important:";
export const FOOTER_DISCLAIMER =
  "This is an independent speculative concept prepared privately by Archer Design. It is not commissioned, sponsored, endorsed, or approved by Pyramid Global Hospitality, Benchmark Resorts & Hotels, or any featured property. Property names and imagery are referenced solely to demonstrate a proposed creative capability. Portfolio figures reflect publicly presented company information.";
