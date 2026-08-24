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
  title: "Choose a motion plan, then choose how many hotels to include.",
  subtitle:
    "Each hotel receives its own recurring monthly creative allocation. The total updates automatically based on the number of participating properties.",
  propertyLabel: "Hotels included",
  plans: [
    {
      id: "core-motion",
      name: "Core Motion",
      description: "A dependable monthly motion package for each participating hotel.",
      monthlyUnitAmount: 80000,
      pricingModel: "per_property",
      minProperties: 1,
      maxProperties: 25,
      features: [
        "4 original motion assets per hotel / month",
        "Property-specific creative",
        "One consolidated revision round",
        "Social-ready exports",
      ],
    },
    {
      id: "expanded-motion",
      name: "Expanded Motion",
      description: "More monthly creative room for active properties and seasonal campaigns.",
      monthlyUnitAmount: 100000,
      pricingModel: "per_property",
      minProperties: 1,
      maxProperties: 25,
      badge: "Recommended",
      features: [
        "6 original motion assets per hotel / month",
        "Property-specific creative",
        "Up to two consolidated revision rounds",
        "Campaign adaptation support",
      ],
    },
    {
      id: "full-motion",
      name: "Full Motion + Adaptations",
      description: "Higher-volume motion support for properties with more active campaign needs.",
      monthlyUnitAmount: 120000,
      pricingModel: "per_property",
      minProperties: 1,
      maxProperties: 25,
      features: [
        "8 original motion assets per hotel / month",
        "Priority production scheduling",
        "Up to two consolidated revision rounds",
        "Limited campaign adaptations",
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
