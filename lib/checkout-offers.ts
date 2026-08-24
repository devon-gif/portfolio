export type PricingModel = "flat" | "per_property";

export type CheckoutPlan = {
  id: string;
  name: string;
  description: string;
  monthlyUnitAmount: number;
  pricingModel: PricingModel;
  minProperties: number;
  maxProperties: number;
  fixedProperties?: number;
  badge?: string;
  features: string[];
};

export type CheckoutOffer = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  propertyLabel: string;
  plans: CheckoutPlan[];
};

const GENERAL: CheckoutOffer = {
  id: "general",
  eyebrow: "Archer Design monthly partnership",
  title: "Choose the level that fits your property or portfolio.",
  subtitle:
    "Select a monthly package, confirm the number of properties, and continue to secure Stripe checkout. Billing is month-to-month unless a separate written agreement says otherwise.",
  propertyLabel: "Properties included",
  plans: [
    {
      id: "single-property",
      name: "Single Property Creative Support",
      description: "Ongoing hospitality creative for one hotel, restaurant, spa, resort, or event property.",
      monthlyUnitAmount: 179900,
      pricingModel: "flat",
      minProperties: 1,
      maxProperties: 1,
      fixedProperties: 1,
      features: [
        "Social graphics and campaign visuals",
        "Short-form motion creative",
        "F&B, event, and seasonal promos",
        "Captions included",
        "Monthly creative plan",
      ],
    },
    {
      id: "three-property-pilot",
      name: "3-Property Hospitality Pilot",
      description: "A coordinated proving ground for a small hotel group or management company.",
      monthlyUnitAmount: 500000,
      pricingModel: "flat",
      minProperties: 3,
      maxProperties: 3,
      fixedProperties: 3,
      badge: "Popular pilot",
      features: [
        "Three properties on one monthly creative system",
        "Social, motion, F&B, event, and seasonal creative",
        "One approval workflow",
        "One monthly plan and invoice",
        "Expansion roadmap after the pilot",
      ],
    },
    {
      id: "five-property-pilot",
      name: "5-Property Creative Pilot",
      description: "A larger portfolio pilot with coordinated property-level creative support.",
      monthlyUnitAmount: 800000,
      pricingModel: "flat",
      minProperties: 5,
      maxProperties: 5,
      fixedProperties: 5,
      features: [
        "Five properties on one coordinated system",
        "Property-level social and motion creative",
        "F&B, event, wedding, and seasonal promos",
        "Google Business content support",
        "One approval workflow and invoice",
      ],
    },
  ],
};

const ELAINE: CheckoutOffer = {
  id: "elaine",
  eyebrow: "CR 91 / Real Nice & Easy partnership options",
  title: "Start at the level that makes sense now. Scale as the destination grows.",
  subtitle:
    "These are flexible monthly options for the current RV park and CR 91 development work. The property / brand count is captured for onboarding and scope planning; pricing is flat for this offer.",
  propertyLabel: "Properties / brands in scope",
  plans: [
    {
      id: "launch-essentials",
      name: "Launch Essentials",
      description: "A focused monthly creative rhythm for the existing property and early CR 91 storytelling.",
      monthlyUnitAmount: 95000,
      pricingModel: "flat",
      minProperties: 1,
      maxProperties: 3,
      features: [
        "4–6 finished creative assets per month",
        "Current RV park promotions",
        "Light CR 91 development content",
        "Seasonal and local-demand campaigns",
        "One monthly planning touchpoint",
      ],
    },
    {
      id: "pre-opening-growth",
      name: "Pre-Opening Growth",
      description: "More room for development storytelling, food-and-beverage concepts, events, and active campaigns.",
      monthlyUnitAmount: 150000,
      pricingModel: "flat",
      minProperties: 1,
      maxProperties: 4,
      badge: "Recommended",
      features: [
        "8–10 finished creative assets per month",
        "Regular motion / short-form video",
        "RV park + CR 91 campaign planning",
        "Steakhouse / F&B and event concepts",
        "Development and investor-facing graphics",
        "Monthly performance recap",
      ],
    },
    {
      id: "destination-marketing",
      name: "Destination Marketing Partner",
      description: "The broader outside marketing role for a funded project moving toward launch.",
      monthlyUnitAmount: 240000,
      pricingModel: "flat",
      minProperties: 1,
      maxProperties: 6,
      features: [
        "12–16 finished creative assets per month",
        "Priority motion and campaign production",
        "Full monthly content calendar",
        "Email and landing-page support",
        "Event and F&B campaign support",
        "Reporting and monthly optimization",
      ],
    },
  ],
};

const VALENCIA: CheckoutOffer = {
  id: "valencia",
  eyebrow: "Valencia Hotel Group motion creative",
  title: "Choose a motion package, then choose how many hotels to include.",
  subtitle:
    "These options match the custom motion creative package sent to Emma Stinson on July 16, 2026. Final monthly billing equals the selected per-hotel rate multiplied by the number of active participating properties.",
  propertyLabel: "Participating hotels",
  plans: [
    {
      id: "motion-essentials",
      name: "Motion Essentials",
      description: "A streamlined monthly creative plan for consistent motion content without a larger campaign-production commitment.",
      monthlyUnitAmount: 80000,
      pricingModel: "per_property",
      minProperties: 1,
      maxProperties: 25,
      features: [
        "4 original motion assets per hotel / month",
        "AI-assisted animation of approved property photography and visual assets",
        "Standard vertical or square delivery format",
        "1 revision round per asset",
        "Final approved files delivered through Archer Review or shared folder",
      ],
    },
    {
      id: "motion-growth",
      name: "Motion Growth",
      description: "A higher-output motion program for property stories, dining, meetings, seasonal campaigns, events, and guest-experience content.",
      monthlyUnitAmount: 100000,
      pricingModel: "per_property",
      minProperties: 1,
      maxProperties: 25,
      badge: "Recommended",
      features: [
        "6–10 original motion assets per hotel / month",
        "AI-assisted motion, visual effects, image animation, compositing, light editing, and format adaptation",
        "Up to 5 revision rounds per asset within the approved concept and source assets",
        "Priority planning for seasonal, restaurant, event, package, wedding, meeting, and destination creative",
        "Final approved files organized for direct handoff",
      ],
    },
    {
      id: "portfolio-studio",
      name: "Portfolio Studio",
      description: "A broader creative-studio package for high-volume motion plus campaign, commercial, and digital-design support.",
      monthlyUnitAmount: 120000,
      pricingModel: "per_property",
      minProperties: 1,
      maxProperties: 25,
      features: [
        "10–12 original motion assets per hotel / month",
        "1 completed 60-second commercial per hotel / month, or 2 completed 30-second commercials",
        "Landing-page design and website redesign support for agreed pages or sections",
        "Commercial adaptations for paid advertising, campaign launches, property storytelling, dining, meetings, weddings, and seasonal offers",
        "Final scope and revision calendar confirmed in the service agreement and monthly brief",
      ],
    },
  ],
};

export const CHECKOUT_OFFERS: Record<string, CheckoutOffer> = {
  general: GENERAL,
  elaine: ELAINE,
  valencia: VALENCIA,
};

export function getCheckoutOffer(id?: string | null): CheckoutOffer {
  if (!id) return GENERAL;
  return CHECKOUT_OFFERS[id] ?? GENERAL;
}

export function getCheckoutPlan(offerId: string, planId: string): CheckoutPlan | null {
  const offer = CHECKOUT_OFFERS[offerId];
  if (!offer) return null;
  return offer.plans.find((plan) => plan.id === planId) ?? null;
}

export function normalizePropertyCount(plan: CheckoutPlan, requested: number): number {
  if (plan.fixedProperties) return plan.fixedProperties;
  const safe = Number.isFinite(requested) ? Math.round(requested) : plan.minProperties;
  return Math.min(plan.maxProperties, Math.max(plan.minProperties, safe));
}

export function monthlyTotal(plan: CheckoutPlan, propertyCount: number): number {
  const quantity = plan.pricingModel === "per_property" ? propertyCount : 1;
  return plan.monthlyUnitAmount * quantity;
}
