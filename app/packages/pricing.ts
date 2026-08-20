export const ARCHER_PRICING = {
  static: 75,
  motion: 95,
  starter: 895,
  essential: 895,
  growth: 1295,
  fullCampaign: 1695,
} as const;

export const MONTHLY_PLANS = [
  {
    key: "essential",
    name: "Essential",
    badge: null,
    price: ARCHER_PRICING.essential,
    motion: 6,
    static: 6,
    captions: 12,
    bestFor: "Properties that need a dependable monthly stream of polished creative.",
    features: ["Recommended posting order", "Standard social-format exports", "One consolidated minor revision round"],
  },
  {
    key: "growth",
    name: "Growth",
    badge: "Recommended",
    price: ARCHER_PRICING.growth,
    motion: 9,
    static: 9,
    captions: 18,
    bestFor: "Active properties with multiple revenue moments to promote every month.",
    features: ["Recommended 30-day activation calendar", "One rapid-turn campaign adaptation", "One consolidated minor revision round"],
  },
  {
    key: "full-campaign",
    name: "Full Campaign",
    badge: null,
    price: ARCHER_PRICING.fullCampaign,
    motion: 12,
    static: 12,
    captions: 24,
    bestFor: "Properties with F&B, meetings, events, seasonal campaigns, and higher creative volume.",
    features: ["Recommended 30-day activation calendar", "Two rapid-turn campaign adaptations", "Priority production scheduling"],
  },
] as const;

export function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}
