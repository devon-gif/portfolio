export type CreativePlan = {
  id: string;
  kind: "monthly" | "pilot" | "priority";
  name: string;
  title: string;
  eyebrow: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  recommended: boolean;
};

// Shared by the live HTML homepage and the React pricing page.
export const CREATIVE_PLANS: CreativePlan[] = [
  {
    "id": "30-day-creative-pilot",
    "kind": "pilot",
    "name": "30-Day Creative Pilot",
    "title": "30-Day Creative Pilot",
    "eyebrow": "Not sure where to start?",
    "price": "$3,500",
    "period": "one-time",
    "description": "A short first engagement designed to learn your workflow, take pressure off the current team, and determine what level of ongoing support actually makes sense.",
    "features": [
      "Up to 30 hours of support",
      "Design and creative production",
      "Social content and motion / reels",
      "Menus, events, campaigns, and promotional assets",
      "One weekly check-in",
      "Priority turnaround",
      "Review of the current workflow and creative queue",
      "End-of-month recommendation for ongoing support"
    ],
    "cta": "Start with the pilot →",
    "recommended": false
  },
  {
    "id": "priority-creative-partnership",
    "kind": "priority",
    "name": "Priority Creative Partnership",
    "title": "Priority Creative Partnership",
    "eyebrow": "High-volume / multi-property",
    "price": "$10K",
    "period": "+/mo",
    "description": "For high-volume, multi-property or multi-concept teams that want Archer functioning as an embedded external creative department. Typical scopes land around $10K–$12K+ per month depending on workload.",
    "features": [
      "Prioritized request queue within agreed capacity",
      "2–3 active projects at a time",
      "Priority turnaround and high-priority access",
      "Creative direction, design, social, motion, and campaign production",
      "Multi-property / multi-concept production systems",
      "Weekly coordination"
    ],
    "cta": "Talk through scope →",
    "recommended": false
  },
  {
    "id": "essential-creative-1299",
    "kind": "monthly",
    "name": "Essential Creative",
    "title": "Reliable production support",
    "eyebrow": "Essential Creative",
    "price": "$1,299",
    "period": "/mo",
    "description": "Still primarily production — dependable creative help without a large ongoing commitment.",
    "features": [
      "Up to 10 hours of creative support per month",
      "Social graphics, menus, flyers, event creative, and email graphics",
      "Digital signage and existing-template updates",
      "Light motion / simple animated assets where appropriate",
      "One active request at a time",
      "Standard turnaround",
      "Monthly check-in"
    ],
    "cta": "Discuss this level →",
    "recommended": false
  },
  {
    "id": "creative-support-2500",
    "kind": "monthly",
    "name": "Creative Support",
    "title": "Broader creative capacity",
    "eyebrow": "Creative Support",
    "price": "$2,500",
    "period": "/mo",
    "description": "Broader production capacity for steady creative overflow across more categories.",
    "features": [
      "Approximately 20 hours of support per month",
      "Graphic design, menus, social creative, and campaign assets",
      "Event promotion, digital signage, and email creative",
      "Sales collateral and quick-turn marketing requests",
      "Photo retouching and cleanup",
      "Turning existing stills into short-form motion",
      "Up to 2 active requests at a time",
      "Regular monthly planning call"
    ],
    "cta": "Discuss this level →",
    "recommended": false
  },
  {
    "id": "creative-marketing-partner-4500",
    "kind": "monthly",
    "name": "Creative + Marketing Partner",
    "title": "Production + ongoing marketing execution",
    "eyebrow": "Creative + Marketing Partner",
    "price": "$4,500",
    "period": "/mo",
    "description": "For teams that want Archer involved in both creative production and recurring marketing execution.",
    "features": [
      "Approximately 40 hours of monthly support",
      "Everything in Creative Support",
      "Social media management for up to 3 selected concepts / accounts",
      "Content calendars, captions, scheduling, and publishing",
      "Campaign planning and execution",
      "Motion graphics, reels, and still-to-motion creative",
      "Email marketing and landing-page creative",
      "Sales / proposal support and content repurposing",
      "Light analytics / monthly performance review",
      "Priority turnaround and 2–3 active projects at once",
      "Weekly or biweekly marketing check-in"
    ],
    "cta": "Talk through scope →",
    "recommended": true
  },
  {
    "id": "embedded-creative-partner-7500",
    "kind": "monthly",
    "name": "Embedded Creative Partner",
    "title": "A fractional extension of the marketing team",
    "eyebrow": "Embedded Creative Partner",
    "price": "$7,500",
    "period": "/mo",
    "description": "Designed for periods when a hospitality team needs meaningful additional marketing capacity without adding another full-time role.",
    "features": [
      "Approximately 65–70 hours of monthly capacity",
      "Multi-property / multi-concept creative support",
      "Ongoing social media management and campaign execution",
      "Advanced photo retouching, compositing, and VFX-driven motion",
      "Menus, events, email, digital, web, and landing-page creative",
      "Sales enablement / proposal support",
      "Asset and workflow organization + multi-brand template systems",
      "Priority production capacity and faster turnaround",
      "Up to 3 active projects at once",
      "Weekly planning and direct team collaboration"
    ],
    "cta": "Talk through scope →",
    "recommended": false
  }
];

export const PRICING_SCOPE_NOTE = "Additional support is quoted separately or handled at $125/hour with approval. Investor rooms, custom dashboards, full website builds, complex integrations, brand development and extensive video production are scoped separately. Monthly support covers the work agreed before kickoff. Revisions stay within that scope; turnaround depends on complexity and the active queue.";
