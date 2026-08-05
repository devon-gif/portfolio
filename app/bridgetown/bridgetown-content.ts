// ─────────────────────────────────────────────────────────────────────────────
// bridgetown-content.ts: copy constants for the /bridgetown private
// partnership concept. Every company fact below (positioning, stats, five
// disciplines, client language) was verified directly against Bridgetown
// Revenue Management Solutions' current official site on 2026-08-05:
//   https://bridgetownrms.com/                    (home)
//   https://bridgetownrms.com/book-a-consultation/ (consultation page)
// Nothing here is scraped from a third-party directory or inferred. The
// logo assets live in public/bridgetown/ (see the source-URL comment in
// BridgetownHeader.tsx).
//
// Rewritten 2026-08-05 (v2) per Devon's copy pass: simplified, reordered so
// Partner Economics sits early instead of buried, and added "The Craft" --
// the section explaining the actual photography + VFX + AI production
// method, since the original draft never explained what makes the offer
// different from any other freelancer. Proof stats below were also
// reconciled against the live /pyramid page's tracked figures so the two
// decks never show conflicting numbers for the same body of work.
// ─────────────────────────────────────────────────────────────────────────────

import { CALENDLY_URL } from "@/lib/seo";

export const PILOT_CALENDLY_URL = CALENDLY_URL;

/* ── Private / disclosure ─────────────────────────────────────────────── */
export const PRIVATE_LABEL_EYEBROW = "Private speculative concept";
export const PRIVATE_LABEL_SUB = "Prepared by Archer Design, not published, not indexed";

export const HERO_DISCLOSURE =
  "Independent speculative concept prepared by Archer Design. Not commissioned, sponsored, endorsed or approved by Bridgetown Revenue Management Solutions. Bridgetown's name, services and publicly presented figures are referenced solely to demonstrate a proposed partnership model.";

/* ── Nav ──────────────────────────────────────────────────────────────── */
export const NAV_ITEMS = [
  { href: "#craft", label: "The Craft" },
  { href: "#fit", label: "Strategic Fit" },
  { href: "#economics", label: "Partner Economics" },
  { href: "#work", label: "The Work" },
  { href: "#workflow", label: "How It Works" },
  { href: "#pilot", label: "The Pilot" },
];

/* ── Hero ──────────────────────────────────────────────────────────────── */
export const HERO_EYEBROW = "Bridgetown RMS × Archer Design";
export const HERO_HEADLINE = "Your hotels already paid for the photography. I make it move.";
export const HERO_PARAGRAPH_1 =
  "VFX compositing, a photographer's read of the frame, and an AI-accelerated pipeline turn a single still into cinematic campaign motion: no reshoot, no crew, no property disruption.";
export const HERO_PARAGRAPH_2 =
  "Bridgetown identifies the revenue priority. I produce the campaign. Bridgetown keeps roughly 31% of every package sold.";
export const HERO_PRIMARY_CTA = "See how it's made";
export const HERO_SECONDARY_CTA = "See what Bridgetown keeps";

/* ── Note to Vicki (single note, near top) ───────────────────────────── */
export const NOTE_SALUTATION = "Vicki,";
export const NOTE_PARAGRAPHS = [
  "Bridgetown builds individualized revenue strategy instead of forcing every hotel into the same template. That's exactly why I think this fits.",
  "Your team already does the hard part: the trusted relationships, and the expertise to identify what each property should prioritize. What most of those hotels don't have is the capacity to turn that priority into something a guest actually sees.",
  "That's the layer I'd add, without Bridgetown building an internal motion department, and with a margin on every package that sells.",
];
export const NOTE_SIGNATURE = "Devon Archer, Founder, Archer Design";

/* ── The Craft (what actually happens to the photograph) ────────────────
   The section that explains the production method itself: photography,
   VFX compositing, and AI used as labor compression rather than a
   creative generator, and why that combination is what makes the
   Bridgetown margin possible in the first place. ───────────────────── */
export const CRAFT_EYEBROW = "What actually happens to the photograph";
export const CRAFT_HEADING = "Three disciplines most people don't have together.";
export const CRAFT_INTRO =
  "Hotels routinely spend $10,000–$40,000 on a professional photo shoot. That library then sits static on a website and gets posted a handful of times. Everything below is about extracting far more from work the property has already paid for.";

export type CraftDiscipline = {
  key: string;
  title: string;
  paragraphs: string[];
  items?: string[];
  closing?: string;
};

export const CRAFT_DISCIPLINES: CraftDiscipline[] = [
  {
    key: "photography",
    title: "A photographer's read of the frame",
    paragraphs: [
      "I shoot. That's why I can look through a hotel's existing library and know within seconds which frames will hold up in motion and which will fall apart: where there's real depth to separate, where the light will carry a camera move, where a sky can be replaced without the whole image collapsing.",
      "Most motion designers get handed photographs. I know how they were made, which means I know what's recoverable in them.",
    ],
  },
  {
    key: "vfx",
    title: "VFX compositing, not filters",
    paragraphs: ["A still gets separated into depth layers and rebuilt as a dimensional scene. That allows:"],
    items: [
      "Real camera movement: push, parallax, drift, and rack, generated from a single frame",
      "Environmental animation: moving water, drifting cloud, shifting light, steam off a plate, flame in a fire pit, reflections that respond",
      "Frame extension: a 4:5 still becomes a 9:16 vertical without cropping the subject out",
      "Relighting and grading: a midday exterior becomes golden hour; a flat interior gains depth",
    ],
    closing: "This is film-post technique applied to hotel photography. Not a Ken Burns zoom on a JPEG.",
  },
  {
    key: "ai",
    title: "AI where it earns its place",
    paragraphs: [
      "Not to invent the creative, but to remove the tedium. Rotoscoping, cleanup, upscaling, frame extension and variant generation are where motion work has always burned its hours.",
      "Compressing those steps is the entire reason eight finished concepts can cost $750 instead of $8,000.",
      "Every frame is still reviewed by a human before delivery. Nothing invented is ever presented as a real property feature: no rooms that don't exist, no views the hotel doesn't have.",
    ],
  },
];

export const CRAFT_CASE_LABEL = "Why this is the whole business case";
export const CRAFT_CASE_QUOTE_1 = "A traditional motion studio quotes $3,000–$8,000 for one hero video.";
export const CRAFT_CASE_QUOTE_2 = "This model delivers eight concepts a month for $750.";
export const CRAFT_CASE_BODY =
  "That gap is what makes the partnership work. It's what lets Bridgetown price a package at $1,095, pay production, and keep $345, without the hotel ever feeling overcharged.";
export const CRAFT_CASE_CLOSING = "The margin isn't a markup on the same old work. It comes from a genuinely faster way of making it.";

/* ── Bridgetown at scale (current official Bridgetown figures only) ────── */
export const SCALE_HEADING = "Bridgetown at scale";
export const SCALE_STATS = [
  { value: "150+", label: "Hotels served" },
  { value: "45+", label: "Markets" },
  { value: "13+", label: "Years in business" },
  { value: "70+", label: "Years of combined experience" },
  { value: "32%", label: "Reported average RevPAR increase" },
];
export const SCALE_QUALIFIER =
  "Figures reflect information currently presented by Bridgetown Revenue Management Solutions. Results vary by property, market, demand conditions, starting performance and implementation.";

/* ── Strategic fit ───────────────────────────────────────────────────────── */
export const STRATEGIC_FIT_EYEBROW = "Where the two services connect";
export const STRATEGIC_FIT_HEADING = "A revenue recommendation only works if the market can see it.";
export const STRATEGIC_FIT_INTRO =
  "Hotels usually understand the need period, the target segment, the package opportunity. What stops them is production capacity.";
export const STRATEGIC_FIT_PAIRS = [
  { identifies: "A soft Sunday–Thursday need period", produces: "A weekday-stay campaign in motion, social and direct-booking formats" },
  { identifies: "An opportunity to shift toward direct channels", produces: "Direct-booking value creative, offer graphics, landing-page visuals" },
  { identifies: "Underperforming F&B, spa or package revenue", produces: "Restaurant, wellness, rooftop, event or package-launch campaigns" },
  { identifies: "A group, meeting or corporate segment opportunity", produces: "Sales-support creative and meeting-space campaigns" },
  { identifies: "A seasonal demand shift", produces: "Fast-turn seasonal creative in every required format" },
];
export const STRATEGIC_FIT_NOTE = "Creative execution helps the market see a revenue priority. On its own it does not guarantee bookings or revenue.";

/* ── Selected hospitality work (reuses Archer's existing, already-approved
   /tcrm media -- generic body-of-work proof, not TCRM-branded content) ── */
export const WORK_EYEBROW = "Selected hospitality work";
export const WORK_HEADING = "Every piece here started as a still photograph.";
export const WORK_FOOTNOTE = "Shown clean, without permanent promotional copy. Headlines, offers, logos and calls to action are added per approved campaign.";

/* ── How it works ─────────────────────────────────────────────────────── */
export const WORKFLOW_EYEBROW = "From revenue signal to live campaign";
export const WORKFLOW_HEADING = "How it works";
export const WORKFLOW_STEPS = [
  { idx: "01", title: "Bridgetown identifies the priority", body: "Pricing, demand, channel, segment, need period, package or positioning." },
  { idx: "02", title: "The property sends approved assets", body: "Photography, offer details, brand guidance, dates, disclaimers, required formats." },
  { idx: "03", title: "Archer produces", body: "Compositing, motion design, editing, typography, campaign graphics, variations, final exports." },
  { idx: "04", title: "One coordinated review", body: "Bridgetown and the property retain strategic and brand approval." },
  { idx: "05", title: "Assets go live", body: "Final files delivered for the property's approved website, social, sales and campaign channels." },
];

/* ── Who controls what ───────────────────────────────────────────────── */
export const CONTROL_HEADING = "Who controls what";
export const BRIDGETOWN_CONTROLS = [
  "Revenue strategy",
  "Pricing priorities",
  "Demand and market analysis",
  "Distribution strategy",
  "Client relationship",
  "Commercial recommendations",
  "Final strategic approval",
];
export const ARCHER_DELIVERS = [
  "Motion and VFX production",
  "Campaign design",
  "Editing and typography",
  "Social and direct-booking formats",
  "F&B, event and sales assets",
  "Property-level adaptations",
  "Organized final delivery",
];
export const SHARED_RESPONSIBILITIES = ["Scope approval", "Timeline", "Client communication", "Performance review", "Renewal recommendation"];

/* ── Operating models ────────────────────────────────────────────────────── */
export const OPERATING_MODELS_HEADING = "Three ways this could work.";
export const OPERATING_MODELS = [
  {
    key: "referral",
    subtitle: "Model A",
    title: "Referral",
    intro: "Bridgetown introduces the client. Archer contracts and bills the property directly. Bridgetown receives an agreed referral fee.",
    note: "Simple. Separate contracts, separate billing. Best for occasional needs.",
  },
  {
    key: "addon",
    subtitle: "Model B",
    badge: "Best fit for repeatable production",
    title: "Bridgetown-approved add-on",
    intro: "Bridgetown offers the service as an optional add-on to participating clients, invoices the hotel, pays Archer the production rate, and keeps the margin.",
    note: "Bridgetown holds the relationship. Properties opt in. Scope stays transparent.",
  },
  {
    key: "integrated",
    subtitle: "Model C",
    title: "Integrated revenue + creative engagement",
    intro: "Revenue strategy and creative execution presented as one coordinated commercial solution.",
    note: "Coordinated onboarding, connected reporting, client-facing or white-label. Strongest for pilots, transitions and multi-property opportunities.",
  },
];
export const OPERATING_MODELS_NOTE = "Every commercial arrangement would require mutual approval and a written agreement.";

/* ── Why each side says yes ──────────────────────────────────────────────── */
export const VALUE_HEADING = "Why each side says yes";
export const VALUE_COLUMNS = [
  {
    key: "hotel",
    title: "For the hotel",
    points: [
      "Revenue priorities become finished campaigns",
      "far more use from photography already paid for",
      "no reshoot cost or property disruption",
      "predictable monthly output",
      "no internal motion team",
      "optional participation",
    ],
  },
  {
    key: "bridgetown",
    title: "For Bridgetown",
    points: [
      "Strategy extends into execution",
      "a new optional client service",
      "stronger implementation support",
      "a ~31% gross margin line",
      "no production headcount or fixed cost",
      "the client relationship stays yours",
    ],
  },
  {
    key: "archer",
    title: "For Archer",
    points: ["Clear commercial direction", "repeatable monthly production", "consolidated feedback", "qualified hospitality clients", "defined deliverables and timelines"],
  },
];

/* ── Best fit (Bridgetown's own published client language) ─────────────── */
export const IDEAL_CLIENT_HEADING = "The properties this suits.";
export const IDEAL_CLIENT_ITEMS = [
  "Independent and boutique hotels",
  "owner-operated properties",
  "small management groups",
  "hotels in transition or facing a need period",
  "properties launching packages, outlets or repositioning campaigns",
  "and above all, hotels with strong existing photography and no capacity to use it",
];
export const IDEAL_CLIENT_NOTE = "Reflects the property type Bridgetown already serves, based on its published client profile. Not a list of confirmed or current Archer Design clients.";

/* ── The pilot ────────────────────────────────────────────────────────────── */
export const PILOT_EYEBROW = "Getting started";
export const PILOT_HEADING = "Three to five hotels. Ninety days.";
export const PILOT_MIX_ITEMS = [
  "one independent boutique",
  "one branded property",
  "one multi-property owner",
  "one hotel with a clear need period",
  "one with strong F&B, meetings, wellness or package revenue",
];
export const PILOT_QUESTIONS_HEADING = "What the pilot has to answer:";
export const PILOT_QUESTIONS = [
  "Do Bridgetown clients understand the offer, and will they pay for it?",
  "Does a revenue priority translate cleanly into a creative brief?",
  "Do the finished assets actually get used?",
  "Is the turnaround sustainable, and does consolidated review hold up?",
  "Does the margin justify Bridgetown's involvement?",
  "Will clients renew, and which operating model works best?",
];
export const PILOT_CTA = "Discuss a Bridgetown pilot";

/* ── Proof of execution (reconciled 2026-08-05 against the tracked figures
   already live on /pyramid, so the two decks never show conflicting
   numbers for the same underlying body of work) ────────────────────────── */
export const PROOF_EYEBROW = "Proof of execution";
export const PROOF_STATS = [
  { value: "2.64K", label: "Published social posts" },
  { value: "16.05M", label: "Impressions" },
  { value: "5.2M", label: "People reached" },
  { value: "596.43K", label: "Engagements" },
];
export const CONFIDENCE_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming the top-performing Hotel Indigo on the East Coast.";
export const CONFIDENCE_SUPPORTING =
  "That result came from connecting events, F&B, meetings, local demand drivers, seasonal priorities and property storytelling to one consistent creative calendar. That's the same execution this model would bring to a Bridgetown-identified priority.";
export const PROOF_FOOTNOTE =
  "Results reflect tracked hospitality campaigns and vary by property, audience, offer, platform, publishing strategy, media budget, season and market. The performance statement reflects reporting shared by the property during the engagement and is not an independently audited brand-wide claim. Shown as existing Archer Design work, unrelated to Bridgetown. Property names reflect Archer's property-level experience and do not imply corporate endorsement.";

/* ── Closing ──────────────────────────────────────────────────────────────── */
export const FINAL_EYEBROW = "Bridgetown RMS × Archer Design";
export const FINAL_HEADING = "Bridgetown finds the opportunity. I help the guest see it.";
export const FINAL_COPY = "Start with three to five hotels. Test whether the work gets used, whether clients renew, and whether the margin earns a wider rollout.";
export const FINAL_PRIMARY_CTA = "Discuss a Bridgetown pilot";
export const FINAL_SECONDARY_CTA = "View Archer Design hospitality work";

/* ── Footer ───────────────────────────────────────────────────────────────── */
export const FOOTER_DISCLAIMER =
  "Independent speculative concept prepared by Archer Design. Not commissioned, sponsored, endorsed or approved by Bridgetown Revenue Management Solutions. Bridgetown's name, logo, services and publicly presented figures are referenced solely to demonstrate a proposed partnership model. All pricing, margins and participation scenarios are illustrative and subject to negotiation and written agreement.";
