// ─────────────────────────────────────────────────────────────────────────────
// 30-Day Premium Hospitality Creative Sprint — the full plan, versioned in code.
// The DB (creative_sprint_* tables) only stores STATUS: day/task progress,
// posted URLs, asset links, and end-of-day metrics. All copy lives here so it
// can be edited in one place and is never duplicated across DB rows.
//
// Safety: this plan is a manual work planner. LinkedIn is always manual-only.
// Nothing here sends anything.
// ─────────────────────────────────────────────────────────────────────────────

export const SPRINT_NAME = "30-Day Premium Hospitality Creative Sprint";
export const SPRINT_DESCRIPTION =
  "Reposition Archer Design as a premium hospitality creative system and land higher-paying multi-property clients in 2–3 focused hours per day.";

// ── Phases ────────────────────────────────────────────────────────────────────
export function phaseForDay(day: number): string {
  if (day <= 5) return "Premium Offer Reset";
  if (day <= 10) return "LinkedIn Trust Engine";
  if (day <= 15) return "High-Ticket Target List";
  if (day <= 20) return "Outreach + Sample Flywheel";
  if (day <= 25) return "Sales Calls + Pre-Call Nurture";
  return "Close + Follow-Up";
}

export const REVIEW_DAYS = new Set([5, 10, 15, 20, 25, 30]);

// ── Daily targets ─────────────────────────────────────────────────────────────
export interface DailyTargets {
  comments: number;
  connections: number;
  buyerDms: number;
  partnerDms: number;
  followups: string; // "all due"
  samplePacks: number;
  crmCleanup: boolean;
}

export function targetsForDay(day: number): DailyTargets {
  if (day <= 7) {
    return { comments: 10, connections: 12, buyerDms: 4, partnerDms: 3, followups: "all due", samplePacks: 0, crmCleanup: true };
  }
  return { comments: 10, connections: 20, buyerDms: 12, partnerDms: 5, followups: "all due", samplePacks: 1, crmCleanup: true };
}

export const SAMPLE_RULE_COLD =
  "No custom samples today unless someone shows clear signal. Cold leads get existing portfolio examples only.";
export const SAMPLE_RULE_WARM =
  "Max 1 custom sample pack today, ONLY for a warm signal: a reply, accepted connection + engagement, “send info,” a warm intro, or a hiring-signal lead. Timebox 60–90 min and build from reusable templates.";

export function sampleRuleForDay(day: number): string {
  return targetsForDay(day).samplePacks === 0 ? SAMPLE_RULE_COLD : SAMPLE_RULE_WARM;
}

// ── Work blocks (the 2–3 hour plan) ───────────────────────────────────────────
export interface WorkBlock {
  minutes: number;
  title: string;
  taskType: string;
}

export function workBlocksForDay(day: number): WorkBlock[] {
  const t = targetsForDay(day);
  const blocks: WorkBlock[] = [
    { minutes: 20, title: `LinkedIn warm-up — comment on ${t.comments} hospitality posts`, taskType: "linkedin_warmup" },
    { minutes: 25, title: "Post today's content + prep the graphic assignment", taskType: "linkedin_post" },
    { minutes: 35, title: `Targeted connection requests — ${t.connections} in today's segment`, taskType: "connection_requests" },
    { minutes: 35, title: `DMs + follow-ups — ${t.buyerDms} first DMs, plus everything due`, taskType: "first_dms" },
    {
      minutes: t.samplePacks > 0 ? 45 : 30,
      title: t.samplePacks > 0
        ? `Partner outreach (${t.partnerDms} DMs) OR 1 sample pack for a warm lead`
        : `Partner outreach — ${t.partnerDms} referral partner DMs`,
      taskType: t.samplePacks > 0 ? "sample_pack" : "partner_outreach",
    },
    { minutes: 10, title: "CRM cleanup + log today's metrics", taskType: "crm_cleanup" },
  ];
  if (REVIEW_DAYS.has(day)) {
    blocks.push({ minutes: 15, title: "Weekly review — log what worked, adjust next week", taskType: "weekly_review" });
  }
  return blocks;
}

// ── Target segment profiles ───────────────────────────────────────────────────
export interface SegmentProfile {
  label: string;
  personas: string[];
  queries: string[];
  exampleCompanies: string[];
  priorityRules: string;
  firstQuestion: string;
  nextStep: string;
}

const P = {
  corp: ["VP Marketing", "VP Sales & Marketing", "Corporate Director of Marketing", "VP Commercial Strategy"],
  property: ["Director of Sales & Marketing", "Area Director of Marketing", "Regional Director of Sales & Marketing", "General Manager"],
  digital: ["Director of Digital Marketing", "Director of Revenue Strategy", "Hotel Marketing Manager"],
  owner: ["Owner / Principal", "General Manager"],
  partner: ["Hospitality Consultant", "Hotel Revenue Consultant", "Hotel Sales Consultant", "Hospitality Recruiter", "Task Force Sales/Marketing"],
};

export const SEGMENTS: Record<string, SegmentProfile> = {
  mgmt_companies: {
    label: "Multi-property hotel management companies",
    personas: [...P.corp, ...P.property],
    queries: [`"hotel management company" marketing director`, `"Corporate Director of Marketing" hotels`, `"VP marketing" hospitality hotel group`],
    exampleCompanies: ["HHM Hotels", "PM Hotel Group", "Schulte Hospitality", "Hotel Equities (verify before outreach)"],
    priorityRules: "Priority: 5–40 properties, no visible in-house creative team, inconsistent property feeds. Higher priority if select-service flags.",
    firstQuestion: "Is property-level creative handled centrally, or does each hotel mostly fend for itself?",
    nextStep: "If engaged: offer 2–3 relevant examples, then float a 3–5 property pilot.",
  },
  boutique: {
    label: "Boutique / lifestyle hotel groups",
    personas: [...P.corp, ...P.owner],
    queries: [`"boutique hotel group" marketing`, `"lifestyle hotel" director of marketing`],
    exampleCompanies: ["Method Co", "Life House-style operators", "local independents (verify)"],
    priorityRules: "Priority: strong brand standards but thin posting cadence. The luxury-perception angle lands hardest here.",
    firstQuestion: "Your brand standard is clearly premium — does the feed get the same attention as the property?",
    nextStep: "Show one photo-polish before/after matched to their aesthetic.",
  },
  fnb: {
    label: "F&B-heavy hotel groups",
    personas: [...P.property, "Director of F&B Marketing"],
    queries: [`"hotel group F&B marketing"`, `"restaurant group marketing director"`],
    exampleCompanies: ["Hotel restaurant groups (e.g. Eliza-style hotel F&B)", "Starr-style groups with hotel ties (verify)"],
    priorityRules: "Priority: hotels with named restaurants/bars that post menus as flat photos. Fast wins, wedge into the parent hotel.",
    firstQuestion: "Who handles creative for the restaurant — the hotel team or the F&B team?",
    nextStep: "Offer one menu-item → campaign-asset example.",
  },
  resorts: {
    label: "Resorts with spa / weddings / events",
    personas: [...P.property, "Director of Events", "Spa Director"],
    queries: [`"wedding venue marketing director"`, `resort "director of sales and marketing"`],
    exampleCompanies: ["Regional resorts with wedding business (verify locally)"],
    priorityRules: "Priority: open wedding/event dates next season + thin promo creative. Seasonal urgency is the angle.",
    firstQuestion: "Are next season's open wedding dates getting any dedicated promo creative yet?",
    nextStep: "Offer an event-promo example aimed at filling a specific season.",
  },
  consultants: {
    label: "Hospitality consultants / referral partners",
    personas: P.partner,
    queries: [`"hospitality consultant" hotel sales marketing`, `"hotel revenue consultant"`, `"hotel task force" sales marketing`],
    exampleCompanies: ["Independent consultants, task-force pros, hospitality recruiters"],
    priorityRules: "Priority: consultants who work with multiple properties and don't sell creative themselves (no conflict).",
    firstQuestion: "Do your clients ever have a creative-bandwidth problem you can't solve for them?",
    nextStep: "Pitch the recurring referral cut — they intro, you deliver, they get paid for the life of the contract.",
  },
  hiring_signal: {
    label: "Hiring-signal companies (marketing/social roles)",
    personas: ["Hiring Manager", "Hospitality Recruiter", ...P.property],
    queries: [`"hotel marketing manager" hiring`, `"social media manager" hotel hiring`],
    exampleCompanies: ["Any hotel/group with a live marketing or social job post — check /hiring-signals"],
    priorityRules: "Highest intent that exists: budget is already allocated. Work every one. Never disparage the hire.",
    firstQuestion: "Whatever you decide on the hire — would it help to see what flexible outside creative support covers?",
    nextStep: "Contract-alternative frame; offer examples, not a hard pitch.",
  },
  former_operators: {
    label: "Former DOSMs / GMs + senior operators",
    personas: ["Former DOSM", "Former GM", ...P.partner],
    queries: [`former "director of sales and marketing" hotel consultant`, `hotel "task force" marketing`],
    exampleCompanies: ["Task-force and fractional operators"],
    priorityRules: "Treat as partners first, buyers second. They know exactly which properties are stretched.",
    firstQuestion: "You've sat in the seat — which of your old properties had the worst creative bottleneck?",
    nextStep: "Referral-partner conversation.",
  },
  independents: {
    label: "Independent premium hotels",
    personas: [...P.owner, ...P.property],
    queries: [`independent hotel "general manager" marketing`, `"director of sales and marketing" independent hotel`],
    exampleCompanies: ["Center-city boutiques and independents in target metros (verify)"],
    priorityRules: "Priority: premium ADR + amateur feed. One-property deals are smaller — keep effort proportional.",
    firstQuestion: "Does social land on whoever has a spare hour, or does someone actually own it?",
    nextStep: "Free-sample path only if warm; otherwise portfolio examples.",
  },
};

// ── Copy/paste templates (manual sending only) ────────────────────────────────
export interface SprintTemplate {
  key: string;
  label: string;
  body: string;
}

export const SPRINT_TEMPLATES: SprintTemplate[] = [
  {
    key: "connection_buyer",
    label: "Connection request — direct buyer",
    body: "Hi [First] — I help hospitality groups keep property-level creative consistent without adding headcount. Saw your work with [Company] and thought it made sense to connect.",
  },
  {
    key: "dm1_buyer",
    label: "First DM — direct buyer",
    body: "Thanks for connecting, [First]. Quick question — is property-level creative handled centrally at [Company], or does each hotel mostly handle social, campaigns, and local promos on its own?",
  },
  {
    key: "followup_buyer",
    label: "Follow-up — direct buyer",
    body: "One thing I see with hotel groups is that there is usually plenty to promote — rooms, F&B, events, weddings, seasonal offers — but not always enough creative bandwidth to keep it consistent. That is the gap I help with. Worth seeing what a small 3–5 property pilot could look like?",
  },
  {
    key: "partner_dm",
    label: "Referral partner DM",
    body: "Hi [First] — I wanted to ask directly. I'm looking for a few hospitality referral partners who already know hotel owners, GMs, DOSMs, or management companies. I provide ongoing creative support for hotel groups — social graphics, short-form motion, F&B/event creative, campaign visuals, photo polishing, and local SEO support. If an intro becomes a monthly client, I pay a success-based referral percentage. Does that ever make sense with the people you know in hospitality?",
  },
  {
    key: "hiring_signal_dm",
    label: "Hiring-signal DM",
    body: "Hi [First], I saw [Company] is hiring for [Role]. That role usually covers a lot — social content, design, campaigns, video, local promos, sometimes SEO. Archer Design can cover that creative output as an outside hospitality partner while you hire or instead of adding another full-time role. Worth sending over a few examples?",
  },
  {
    key: "send_info",
    label: "“Send info” response",
    body: "Absolutely. The short version: Archer Design gives hospitality groups a fixed monthly creative system — social graphics, short-form motion, campaign visuals, F&B/event promos, photo polishing, branded creative, and optional local SEO — without adding another full-time hire. The best starting point is usually a 3–5 property pilot. I'll send a few examples and the pilot breakdown.",
  },
  {
    key: "warm_intro_perspective",
    label: "Warm intro — perspective ask",
    body: "Quick question since you're closer to hotel owners/operators than I am — do you see many hotel groups struggling with creative bandwidth at the property level?",
  },
  {
    key: "warm_intro_referral",
    label: "Warm intro — referral ask",
    body: "If someone comes to mind, I'd be happy to make it a paid referral if it turns into a monthly client.",
  },
  {
    key: "warm_intro_routing",
    label: "Warm intro — routing ask",
    body: "Would this usually sit with corporate marketing, commercial strategy, digital, or someone else?",
  },
  {
    key: "have_team",
    label: "“We already have a team” response",
    body: "Totally makes sense. Most groups I'd be a fit for already have someone internally. The gap is usually overflow — campaign visuals, F&B/event creative, short-form motion, seasonal pushes, and property-level assets the internal team does not have time to produce. I'm not trying to replace the team. I'm usually more useful as an outside creative extension.",
  },
];

// ── The 30 days ───────────────────────────────────────────────────────────────
export interface SprintDayPlan {
  day: number;
  objective: string;
  contentTheme: string;
  postHook: string;
  postBody: string;
  cta: string;
  mediaType: string;
  creativeType: "Hotel" | "F&B" | "Event" | "Spa" | "Hiring-signal" | "Partner" | "Proof" | "General";
  graphicAssignment: string;
  beforeSource: string;
  afterOutput: string;
  suggestedHeadline: string;
  captionAngle: string;
  tools: string[];
  assetTimeboxMinutes: number;
  segmentKey: keyof typeof SEGMENTS;
  extraTasks?: string[];
}

const CTA_DEFAULT = "If creative bandwidth is the bottleneck at your properties, my DMs are open.";
const TOOLS_GFX = ["Photoshop", "Canva/Figma"];
const TOOLS_PHOTO = ["Lightroom", "Photoshop"];
const TOOLS_MOTION = ["Seedance", "Premiere", "After Effects"];

export const SPRINT_DAYS: SprintDayPlan[] = [
  {
    day: 1,
    objective: "Reposition Archer Design from “social media help” to premium hospitality creative system.",
    contentTheme: "Positioning reset",
    postHook: "I'm no longer positioning Archer Design as social media help.",
    postBody:
      "I'm building Archer Design around one clearer idea: hospitality teams need consistent creative output, not another generic marketing pitch. Hotels, restaurants, spas, and event-driven properties usually have plenty to promote — rooms, F&B, weddings, meetings, seasonal offers, amenities — but the internal team is stretched. The offer is simple: premium creative support without adding another full-time hire or large agency retainer.",
    cta: "If that sounds like your properties, let's talk.",
    mediaType: "Quote graphic",
    creativeType: "General",
    graphicAssignment: "Black/gold quote graphic with the line “Hospitality creative without adding headcount.”",
    beforeSource: "Brand files (logo, gold gradient)",
    afterOutput: "1080×1350 quote card in the Archer black/gold look",
    suggestedHeadline: "Hospitality creative without adding headcount.",
    captionAngle: "Positioning statement — declare the lane.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "consultants",
    extraTasks: ["Update LinkedIn headline draft to the premium positioning"],
  },
  {
    day: 2,
    objective: "Show the perceived-value gap a polish pass creates.",
    contentTheme: "Before/after proof",
    postHook: "Same property. Different perceived value.",
    postBody:
      "Took one ordinary property photo and ran it through the same polish pass I use for client campaigns. Same room, same angle, same camera. The difference is what a guest *feels* scrolling past it — and that feeling is what they book. Most hotels don't need a new shoot. They need the assets they already own finished properly.",
    cta: CTA_DEFAULT,
    mediaType: "Before/after image pair",
    creativeType: "Hotel",
    graphicAssignment: "Before/after: raw hotel property photo → polished campaign visual.",
    beforeSource: "One raw property photo (own portfolio or licensed)",
    afterOutput: "Side-by-side before/after card, 1080×1350",
    suggestedHeadline: "Same property. Different perceived value.",
    captionAngle: "Perception drives bookings; polish beats reshoots.",
    tools: TOOLS_PHOTO,
    assetTimeboxMinutes: 45,
    segmentKey: "boutique",
  },
  {
    day: 3,
    objective: "Plant the cost anchor: system vs full-time creative hire.",
    contentTheme: "Cost comparison",
    postHook: "A hotel group does not need to hire a full creative team to get premium creative output.",
    postBody:
      "The math on an in-house creative hire is rough once you load it: salary, benefits, payroll tax, software, recruiting, management time. For one property it rarely pencils. A fixed monthly creative system delivers the same output across 3–5 properties for a fraction of the loaded cost — with no vacancy gap and no replacement risk.",
    cta: "Happy to walk any group through the numbers.",
    mediaType: "Comparison graphic",
    creativeType: "Hotel",
    graphicAssignment: "Cost comparison card: in-house creative hire vs fixed monthly creative system.",
    beforeSource: "Hire-cost line items (salary, benefits, software, recruiting)",
    afterOutput: "Two-column comparison graphic, branded",
    suggestedHeadline: "The $90K question every hotel group eventually asks.",
    captionAngle: "Lower overhead, same output — never say “cheap.”",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 40,
    segmentKey: "mgmt_companies",
  },
  {
    day: 4,
    objective: "Reframe the problem: it's a creative system gap, not a photo gap.",
    contentTheme: "System > assets",
    postHook: "Most hotels do not have a photo problem. They have a creative system problem.",
    postBody:
      "Almost every property I look at is sitting on years of photography that never became content. The gap isn't the camera — it's the workflow that turns a raw photo into a finished post, a story, a Reel cover, and a campaign visual, every week, on brand. That workflow is the product.",
    cta: CTA_DEFAULT,
    mediaType: "Carousel",
    creativeType: "Hotel",
    graphicAssignment: "Carousel: raw photo → polished post → motion concept → caption.",
    beforeSource: "One raw property photo + its finished derivatives",
    afterOutput: "4-slide carousel showing the transformation chain",
    suggestedHeadline: "Raw photo → finished campaign, in four slides.",
    captionAngle: "Sell the workflow, not the single asset.",
    tools: [...TOOLS_GFX, "Seedance"],
    assetTimeboxMinutes: 60,
    segmentKey: "mgmt_companies",
  },
  {
    day: 5,
    objective: "Weekly review + open the referral partner channel publicly.",
    contentTheme: "Partner recruiting",
    postHook: "I'm looking for a few hospitality referral partners.",
    postBody:
      "If you consult for hotels, recruit for them, or run task-force work, you already know which properties have a creative bottleneck. I provide the ongoing creative system — graphics, short-form motion, F&B/event promos, photo polishing. When an intro becomes a monthly client, you get a recurring cut for the life of the contract. You make the intro; I do all the delivery.",
    cta: "DM me “partner” and I'll send the one-pager.",
    mediaType: "Offer graphic",
    creativeType: "Partner",
    graphicAssignment: "Referral partner offer graphic: intro → client → recurring cut.",
    beforeSource: "Partner offer terms (partner-offer.md)",
    afterOutput: "Clean offer card with 3-step flow",
    suggestedHeadline: "Know hotels? Get paid for the intro — for the life of the contract.",
    captionAngle: "Zero delivery work for the partner; recurring upside.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "consultants",
  },
  {
    day: 6,
    objective: "Start the trust engine: teach with an audit-style observation.",
    contentTheme: "Perception gap education",
    postHook: "5-star property. 3-star feed.",
    postBody:
      "It's the most common gap in hospitality marketing: the property experience is premium, the digital presence isn't. Guests can't feel your lobby through a phone — they feel your creative. When the feed undersells the property, the OTA wins the booking and keeps the margin.",
    cta: "Want an honest read on your feed? Ask.",
    mediaType: "Educational graphic",
    creativeType: "Hotel",
    graphicAssignment: "Audit-style graphic: what a 5-star property's 3-star feed costs it.",
    beforeSource: "Generic premium-property imagery",
    afterOutput: "Single educational card with the 5-star/3-star contrast",
    suggestedHeadline: "5-star property. 3-star feed.",
    captionAngle: "Diagnose, don't pitch.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "independents",
  },
  {
    day: 7,
    objective: "Open the F&B wedge: hotel restaurants as under-marketed assets.",
    contentTheme: "F&B creative",
    postHook: "Hotel restaurants are often the most under-marketed asset on property.",
    postBody:
      "The restaurant generates local customers who'll never book a room — and most hotel feeds treat it as an afterthought. A menu item photographed on a phone can become a campaign asset in under an hour. Locals follow, share, and show up. That's revenue the rooms team never sees coming.",
    cta: CTA_DEFAULT,
    mediaType: "Before/after image pair",
    creativeType: "F&B",
    graphicAssignment: "Before/after: menu item phone photo → finished campaign asset.",
    beforeSource: "One menu-item phone photo",
    afterOutput: "Polished F&B promo asset + side-by-side card",
    suggestedHeadline: "One phone photo. One campaign asset.",
    captionAngle: "F&B is the fastest visible win on property.",
    tools: TOOLS_PHOTO,
    assetTimeboxMinutes: 50,
    segmentKey: "fnb",
  },
  {
    day: 8,
    objective: "Demonstrate motion: stills become video without a shoot.",
    contentTheme: "Motion from stills",
    postHook: "Turned a still photo into a motion asset.",
    postBody:
      "No videographer, no production day. One still hotel exterior, one motion pass, and the property moves. Short-form video out-reaches static posts on every platform hotels care about — and most properties already own everything needed to make it.",
    cta: "If your property has photos, it has video. Happy to show how.",
    mediaType: "Video (before still → motion)",
    creativeType: "Hotel",
    graphicAssignment: "Still hotel exterior → simple motion concept (8–10s).",
    beforeSource: "One still exterior photo",
    afterOutput: "Short motion clip + the original still for contrast",
    suggestedHeadline: "Still photo → motion asset. No shoot.",
    captionAngle: "Video without production days.",
    tools: TOOLS_MOTION,
    assetTimeboxMinutes: 60,
    segmentKey: "boutique",
  },
  {
    day: 9,
    objective: "Speak to groups: consistency breaks at portfolio scale.",
    contentTheme: "Portfolio consistency",
    postHook: "The bigger the hotel group, the easier the creative gets messy.",
    postBody:
      "At 8+ properties, every hotel posts differently: different templates, different quality, different voice. The portfolio reads smaller than it is. Group-level brand consistency with property-level customization is exactly what an outside creative system is built to hold.",
    cta: "Running a group? Worth comparing notes.",
    mediaType: "Diagram",
    creativeType: "Hotel",
    graphicAssignment: "Portfolio consistency diagram: scattered feeds → one system.",
    beforeSource: "Mock 'messy portfolio' grid",
    afterOutput: "Before/after diagram: chaos → consistent system",
    suggestedHeadline: "8 hotels. 8 different feeds. 1 fix.",
    captionAngle: "Scale is where creative breaks — and where the system shines.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 45,
    segmentKey: "mgmt_companies",
  },
  {
    day: 10,
    objective: "Weekly review + de-risk the entry: the 3–5 property pilot.",
    contentTheme: "Pilot framing",
    postHook: "Why I'd start with 3–5 properties, not an entire portfolio.",
    postBody:
      "Big creative rollouts fail when they start too big. A 3–5 property pilot proves the workflow on real properties, with real approvals, in one month — then expansion is a decision based on output, not a leap of faith. It's how I'd buy this service if I were on the other side.",
    cta: "Want the pilot breakdown? DM me “pilot.”",
    mediaType: "Workflow graphic",
    creativeType: "Hotel",
    graphicAssignment: "3–5 property pilot workflow: onboard → deliver → review → expand.",
    beforeSource: "Pilot deliverables list",
    afterOutput: "4-step pilot flow card",
    suggestedHeadline: "Start with 3–5 properties. Expand on proof.",
    captionAngle: "De-risk the decision for the buyer.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 35,
    segmentKey: "mgmt_companies",
  },
  {
    day: 11,
    objective: "Photo polishing as the cheapest luxury upgrade.",
    contentTheme: "Photo polish",
    postHook: "The fastest way to make a hotel feel more expensive online is not always a new photo shoot.",
    postBody:
      "Color, light, crop, and consistency do more for perceived ADR than most reshoots. The same room can read $159 or $289 depending on the finish of the photo. Polishing the library you already own is the highest-ROI creative work in hospitality.",
    cta: CTA_DEFAULT,
    mediaType: "Before/after image pair",
    creativeType: "Hotel",
    graphicAssignment: "Photo polishing before/after on a guest room or lobby shot.",
    beforeSource: "One flat/under-edited room photo",
    afterOutput: "Polished version + side-by-side card",
    suggestedHeadline: "Same room. $130 more a night in perceived value.",
    captionAngle: "Perceived ADR is a creative output.",
    tools: TOOLS_PHOTO,
    assetTimeboxMinutes: 40,
    segmentKey: "boutique",
  },
  {
    day: 12,
    objective: "Connect local events to booking demand.",
    contentTheme: "Event-driven demand",
    postHook: "A local event is not just an event. It is a booking reason.",
    postBody:
      "Every concert, festival, game, and conference near your property is a campaign waiting to be built: rooms + the event + F&B, packaged in one visual. Most hotels post about the event after it sells out — the creative should run while the booking window is open.",
    cta: "What's the next big event near your property? That's the campaign.",
    mediaType: "Campaign graphic",
    creativeType: "Event",
    graphicAssignment: "Local event details → hotel booking campaign visual.",
    beforeSource: "A real local event listing + property photo",
    afterOutput: "Event-tied booking promo asset",
    suggestedHeadline: "In town for [event]? Stay 5 minutes away.",
    captionAngle: "Events are demand spikes; creative should catch them.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 45,
    segmentKey: "resorts",
  },
  {
    day: 13,
    objective: "Name the perception gap directly for premium properties.",
    contentTheme: "Perception gap",
    postHook: "Your lobby can feel luxury while your feed feels budget.",
    postBody:
      "Walk-in guests get the marble, the lighting, the scent program. Scrolling guests get a dim phone photo with a stretched logo. Two different hotels — same property. The feed is the lobby for everyone who hasn't visited yet.",
    cta: CTA_DEFAULT,
    mediaType: "Side-by-side graphic",
    creativeType: "Hotel",
    graphicAssignment: "Side-by-side perception gap: lobby reality vs feed reality.",
    beforeSource: "Premium lobby photo + a deliberately weak feed mock",
    afterOutput: "Split-screen perception card",
    suggestedHeadline: "The feed is the lobby, online.",
    captionAngle: "Make the gap visceral.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 35,
    segmentKey: "independents",
  },
  {
    day: 14,
    objective: "Show asset leverage: one photo, five outputs.",
    contentTheme: "Asset multiplication",
    postHook: "One property photo can become five assets.",
    postBody:
      "Feed post. Story. Reel cover. Event promo. Email banner. Same source photo, five jobs. This is why “we don't have enough content” is almost never true — properties have plenty of raw material and no multiplication system.",
    cta: "Send me one photo and I'll tell you what it could become.",
    mediaType: "Carousel",
    creativeType: "Hotel",
    graphicAssignment: "Asset breakdown carousel: one photo → feed post, story, reel cover, event promo, banner.",
    beforeSource: "One strong property photo",
    afterOutput: "5-slide derivative carousel",
    suggestedHeadline: "1 photo. 5 assets.",
    captionAngle: "Leverage, not volume.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 60,
    segmentKey: "mgmt_companies",
  },
  {
    day: 15,
    objective: "Weekly review + drop the proof card.",
    contentTheme: "Proof",
    postHook: "14.8M+ impressions later, here's what I've learned about hospitality creative.",
    postBody:
      "Across hotel, F&B, spa, and event clients: consistency beats virality, F&B out-engages rooms, motion beats stills, and the properties that win treat creative as a system, not a task. 14.8M+ impressions, 565K+ engagements, 4.3M+ reach, 670K+ reported post clicks — across tracked hotel, restaurant, event, and wellness campaigns.",
    cta: "Happy to share what would move the needle for your properties.",
    mediaType: "Stats card",
    creativeType: "Proof",
    graphicAssignment: "Proof/results card with the headline stats.",
    beforeSource: "Verified stats (render.ts PERFORMANCE_STATS)",
    afterOutput: "Branded results card",
    suggestedHeadline: "14.8M+ impressions. 670K+ reported post clicks. Zero new photo shoots.",
    captionAngle: "Proof with lessons, not bragging.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "mgmt_companies",
  },
  {
    day: 16,
    objective: "Disarm the #1 objection in public.",
    contentTheme: "Objection content",
    postHook: "“We already have a team” is not a no.",
    postBody:
      "Most groups I work with have someone internally. The internal team owns strategy and brand; I'm the overflow that keeps property-level output consistent when they're slammed — campaign visuals, F&B promos, short-form motion, seasonal pushes. Extension, not replacement.",
    cta: "If your team is great but stretched, that's exactly the fit.",
    mediaType: "Diagram",
    creativeType: "General",
    graphicAssignment: "Internal team + outside creative extension diagram.",
    beforeSource: "Simple org sketch",
    afterOutput: "Team + extension diagram card",
    suggestedHeadline: "Your team owns the brand. I keep the output flowing.",
    captionAngle: "Pre-handle the objection before the DM.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "mgmt_companies",
  },
  {
    day: 17,
    objective: "Activate the hiring-signal channel publicly.",
    contentTheme: "Hiring alternative",
    postHook: "Before hiring another full-time creative role, test the workflow first.",
    postBody:
      "If you're posting a marketing/social role for a property right now, you've already budgeted for the output. A contract creative system can cover the work while you hire — or instead of the hire — without salary, benefits, or ramp time. Worst case, your new hire starts with a library of finished assets.",
    cta: "Hiring for marketing right now? Let's compare the math.",
    mediaType: "Comparison graphic",
    creativeType: "Hiring-signal",
    graphicAssignment: "Hiring-signal card: full-time hire vs contract creative alternative.",
    beforeSource: "Role-scope bullets from a real job post",
    afterOutput: "Hire vs contract comparison card",
    suggestedHeadline: "The role covers 6 jobs. The system covers them today.",
    captionAngle: "Respect the hire; offer the flexible path.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 35,
    segmentKey: "hiring_signal",
  },
  {
    day: 18,
    objective: "Map the full content surface of a property.",
    contentTheme: "Content opportunity map",
    postHook: "F&B, events, weddings, spa, rooms — every property has more to promote than it thinks.",
    postBody:
      "When a hotel says “we don't have much to post,” I map it: rooms, restaurant, bar, spa, pool, weddings, meetings, seasonal packages, local partnerships, staff stories. That's 10 content streams before anyone picks up a camera. The constraint was never material. It's bandwidth.",
    cta: CTA_DEFAULT,
    mediaType: "Infographic",
    creativeType: "F&B",
    graphicAssignment: "Content opportunity map of a full-service property.",
    beforeSource: "Property amenity list",
    afterOutput: "Property map infographic with 10 content streams",
    suggestedHeadline: "10 content streams. 1 property.",
    captionAngle: "Abundance reframe.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 50,
    segmentKey: "fnb",
  },
  {
    day: 19,
    objective: "Sharpen the stakes: bad creative is expensive.",
    contentTheme: "Cost of bad creative",
    postHook: "Bad creative makes a good hotel feel cheaper.",
    postBody:
      "It works in both directions. Great creative raises perceived value; sloppy creative discounts a property that did nothing wrong. Every blurry post is a tiny price cut on the brand. Consistency isn't cosmetic — it protects rate.",
    cta: CTA_DEFAULT,
    mediaType: "Before/after card",
    creativeType: "Hotel",
    graphicAssignment: "Simple before/after perception card (same property, two treatments).",
    beforeSource: "One property photo, two treatments",
    afterOutput: "Two-treatment perception card",
    suggestedHeadline: "Every sloppy post is a rate cut.",
    captionAngle: "Tie creative directly to rate protection.",
    tools: TOOLS_PHOTO,
    assetTimeboxMinutes: 35,
    segmentKey: "independents",
  },
  {
    day: 20,
    objective: "Weekly review + make the pilot concrete.",
    contentTheme: "Pilot deliverables",
    postHook: "What a 3–5 property creative pilot actually includes.",
    postBody:
      "No mystery: a monthly creative plan per property, social graphics, short-form motion, F&B/event promos, captions, one feedback round, and group-level brand consistency — delivered approval-ready. One month, real properties, then you decide with evidence.",
    cta: "Want this list as a one-pager? DM “pilot.”",
    mediaType: "Checklist graphic",
    creativeType: "Hotel",
    graphicAssignment: "Pilot deliverables checklist card.",
    beforeSource: "Pilot scope list",
    afterOutput: "Branded checklist graphic",
    suggestedHeadline: "The 3–5 property pilot, itemized.",
    captionAngle: "Concreteness sells; vagueness stalls.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "mgmt_companies",
  },
  {
    day: 21,
    objective: "Shift from looks to decisions: creative as choice architecture.",
    contentTheme: "Conversion framing",
    postHook: "The best hotel creative does not just look nice. It makes the property easier to choose.",
    postBody:
      "A guest comparing three hotels picks the one they can already imagine staying in. Good creative does that imagining for them: the room at golden hour, the bar on a Friday, the wedding on the lawn. Pretty is table stakes. Choosable is the goal.",
    cta: CTA_DEFAULT,
    mediaType: "Diagram",
    creativeType: "Hotel",
    graphicAssignment: "Guest decision journey: scroll → feel → shortlist → book.",
    beforeSource: "Simple journey sketch",
    afterOutput: "4-step decision journey card",
    suggestedHeadline: "Make the property easier to choose.",
    captionAngle: "Speak GM/DOSM language: conversion, not aesthetics.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 35,
    segmentKey: "former_operators",
  },
  {
    day: 22,
    objective: "Surface hidden inventory: under-promoted amenities.",
    contentTheme: "Amenity promotion",
    postHook: "Your best amenities are probably under-promoted.",
    postBody:
      "Free breakfast, the pool, the gym, the shuttle, the pet policy — the things guests actually decide on are usually buried in an OTA bullet list. Each amenity is a campaign. Select-service properties especially: your amenities ARE the brand story.",
    cta: CTA_DEFAULT,
    mediaType: "Concept set",
    creativeType: "Hotel",
    graphicAssignment: "Amenities → campaign concepts (3 quick examples).",
    beforeSource: "Standard select-service amenity list",
    afterOutput: "3 amenity campaign concept cards",
    suggestedHeadline: "The pool is a campaign. So is breakfast.",
    captionAngle: "Hidden inventory reframe for select-service.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 45,
    segmentKey: "independents",
  },
  {
    day: 23,
    objective: "Sell the cadence: system beats sporadic.",
    contentTheme: "Monthly cadence",
    postHook: "A monthly creative system beats random posting.",
    postBody:
      "Random posting follows energy; a system follows the calendar. Seasonal pushes prepped before the season, event promos before the booking window, F&B content on the days locals decide where to eat. Same effort, radically different results — because timing is half of creative.",
    cta: CTA_DEFAULT,
    mediaType: "Calendar graphic",
    creativeType: "General",
    graphicAssignment: "Monthly cadence/calendar visual: what ships when and why.",
    beforeSource: "A sample month plan",
    afterOutput: "Branded monthly cadence calendar",
    suggestedHeadline: "Creative that ships on the calendar, not on vibes.",
    captionAngle: "Predictability is the premium feature.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 40,
    segmentKey: "mgmt_companies",
  },
  {
    day: 24,
    objective: "Portfolio coherence for multi-property groups.",
    contentTheme: "Portfolio consistency II",
    postHook: "If every property posts differently, the portfolio feels smaller than it is.",
    postBody:
      "A 20-property group whose feeds share one visual language reads like a brand. The same group with 20 styles reads like 20 small hotels. Consistency at the group level is a growth asset — it makes the next acquisition, the next flag deal, and the next corporate contract easier.",
    cta: "Group leaders: worth an audit of how consistent the portfolio reads?",
    mediaType: "Before/after grid",
    creativeType: "Hotel",
    graphicAssignment: "Portfolio consistency before/after grid (scattered → unified).",
    beforeSource: "Mock multi-property feed grid",
    afterOutput: "Before/after portfolio grid card",
    suggestedHeadline: "20 properties. One brand. Or 20 small hotels.",
    captionAngle: "Consistency as a corporate-level asset.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 45,
    segmentKey: "mgmt_companies",
  },
  {
    day: 25,
    objective: "Weekly review + publish the engagement model.",
    contentTheme: "How we'd start",
    postHook: "Here's how I would start with a hotel group.",
    postBody:
      "Discovery call to map properties and bottlenecks. A 3–5 property pilot month with approval-ready delivery. Review the output together. Expand only on evidence. No long contract up front, no agency onboarding theater — just work, reviewed monthly.",
    cta: "If that sounds sane, my calendar link is in the comments.",
    mediaType: "Flow graphic",
    creativeType: "Hotel",
    graphicAssignment: "Discovery → pilot → expansion flow card.",
    beforeSource: "Engagement model steps",
    afterOutput: "3-step flow graphic",
    suggestedHeadline: "Discovery → pilot → expand. That's it.",
    captionAngle: "Reduce process anxiety for high-fit groups.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "mgmt_companies",
  },
  {
    day: 26,
    objective: "Open pilot availability — the direct ask.",
    contentTheme: "Pilot availability",
    postHook: "I'm opening a few spots for 3–5 property hospitality creative pilots.",
    postBody:
      "One month, 3–5 of your properties, full creative system: social graphics, short-form motion, F&B/event promos, photo polishing, captions — approval-ready. Built for groups that want premium output without another hire. Limited to what I can deliver at quality, so genuinely a few spots.",
    cta: "DM “pilot” for the breakdown and current availability.",
    mediaType: "Offer card",
    creativeType: "Hotel",
    graphicAssignment: "Premium pilot availability card.",
    beforeSource: "Pilot scope + availability",
    afterOutput: "Black/gold availability announcement card",
    suggestedHeadline: "3–5 property pilots: open.",
    captionAngle: "Direct ask, scarcity stated honestly (capacity, not fake urgency).",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "mgmt_companies",
  },
  {
    day: 27,
    objective: "Re-run the partner ask with sharper criteria.",
    contentTheme: "Partner criteria",
    postHook: "The right referral partner knows when a hotel has a creative bandwidth problem.",
    postBody:
      "Consultants, recruiters, task-force pros, revenue strategists: you hear it in every engagement — “we just don't have time to keep up with content.” That sentence is worth recurring income. Intro me when you hear it; if it becomes a client, you're paid for the life of the contract.",
    cta: "DM “partner” and I'll send terms.",
    mediaType: "Criteria card",
    creativeType: "Partner",
    graphicAssignment: "Referral partner criteria card: who you know → what you earn.",
    beforeSource: "Partner terms",
    afterOutput: "Criteria + payout structure card",
    suggestedHeadline: "You hear the problem weekly. Get paid for it.",
    captionAngle: "Specific trigger sentence partners can recognize.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "consultants",
  },
  {
    day: 28,
    objective: "Elevate the conversation: demand, not posts.",
    contentTheme: "Demand framing",
    postHook: "The goal is not more posts. The goal is better property-level demand.",
    postBody:
      "Posting volume is a vanity input. The outputs that matter: direct bookings vs OTA share, F&B covers, event inquiries, rate integrity. Creative is the demand engine that feeds all four — when it runs as a system aimed at revenue moments, not a chore aimed at the algorithm.",
    cta: CTA_DEFAULT,
    mediaType: "Comparison graphic",
    creativeType: "General",
    graphicAssignment: "Posts vs campaign system comparison.",
    beforeSource: "Two-column concept sketch",
    afterOutput: "Posts vs system comparison card",
    suggestedHeadline: "Stop counting posts. Start counting demand.",
    captionAngle: "Speak revenue language to sales/marketing leaders.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 35,
    segmentKey: "former_operators",
  },
  {
    day: 29,
    objective: "Give away the audit — generosity as proof of competence.",
    contentTheme: "Audit checklist",
    postHook: "What I'd fix first in most hotel feeds.",
    postBody:
      "The 5-point audit I run on every property: (1) photo finish quality, (2) F&B presence, (3) motion vs static ratio, (4) seasonal timing, (5) brand consistency across posts. Score your own feed — most properties fail 3 of 5, and all 5 are fixable without a photo shoot.",
    cta: "Want me to run it on your property? DM the handle.",
    mediaType: "Checklist graphic",
    creativeType: "Hotel",
    graphicAssignment: "5-point audit checklist card.",
    beforeSource: "Audit criteria",
    afterOutput: "Self-score checklist graphic",
    suggestedHeadline: "Score your hotel's feed in 60 seconds.",
    captionAngle: "Useful enough to save and share.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 30,
    segmentKey: "independents",
  },
  {
    day: 30,
    objective: "Final review: recap the sprint, restate the offer, harvest the pipeline.",
    contentTheme: "Sprint recap",
    postHook: "30 days of rebuilding Archer Design around premium hospitality creative.",
    postBody:
      "A month ago I stopped pitching “social media help” and rebuilt around a clearer offer: a premium creative system for hospitality groups — without adding headcount. 30 posts, dozens of conversations, real pilots in motion. If you've been watching and the creative bottleneck is real at your properties, this is the moment to say hi.",
    cta: "Pilot spots for next month open now — DM “pilot.”",
    mediaType: "Recap card",
    creativeType: "Proof",
    graphicAssignment: "Sprint recap card: proof, lessons, next-pilot CTA.",
    beforeSource: "Sprint metrics + best post screenshots",
    afterOutput: "Recap/proof card with CTA",
    suggestedHeadline: "30 days. One clearer offer.",
    captionAngle: "Close the loop publicly; invite the lurkers.",
    tools: TOOLS_GFX,
    assetTimeboxMinutes: 40,
    segmentKey: "mgmt_companies",
  },
];

export function planForDay(day: number): SprintDayPlan {
  return SPRINT_DAYS[Math.min(Math.max(day, 1), 30) - 1];
}

// ── Lead stages the sprint understands (superset of contact statuses) ─────────
export const SPRINT_STAGES = [
  "Identified", "Warming", "Connection Sent", "Connected", "DM1 Sent", "Engaged",
  "Sample Requested", "Sample Sent", "Followed Up", "Call Booked", "Pilot Offered",
  "Won", "Nurture", "Not a Fit",
] as const;

// ── Weekly-review adjustment rules ────────────────────────────────────────────
export interface WeekStats {
  connectionsSent: number;
  accepted: number;
  dmsSent: number;
  buyerReplies: number;
  partnerReplies: number;
  sampleInterest: number;
}

export function weeklyAdjustments(s: WeekStats): string[] {
  const out: string[] = [];
  const acceptRate = s.connectionsSent > 0 ? s.accepted / s.connectionsSent : null;
  const replyRate = s.dmsSent > 0 ? (s.buyerReplies + s.partnerReplies) / s.dmsSent : null;
  if (acceptRate !== null && acceptRate < 0.3)
    out.push(`Acceptance rate ${(acceptRate * 100).toFixed(0)}% (<30%) — tighten targeting and reduce connection volume.`);
  if (replyRate !== null && replyRate < 0.05)
    out.push(`Reply rate ${(replyRate * 100).toFixed(1)}% (<5%) — make the first DM more question-led and less pitchy.`);
  if (s.partnerReplies > s.buyerReplies && s.partnerReplies > 0)
    out.push("Partner sequence is outperforming direct buyers — shift more daily effort to partner outreach.");
  if (s.sampleInterest > 0)
    out.push("Samples are getting interest — turn the best one into a public before/after post.");
  if (out.length === 0)
    out.push("Numbers look healthy — keep the current targeting and volume, and double down on whatever produced this week's best reply.");
  return out;
}
