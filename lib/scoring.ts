import type { Contact } from "./types";

const HIGH_VALUE_TITLES = [
  "owner",
  "founder",
  "president",
  "ceo",
  "coo",
  "vp",
  "regional director",
  "area director",
  "director of marketing",
  "director of sales",
  "director of sales & marketing",
  "director of sales and marketing",
  "general manager",
  "commercial strategy",
  "revenue strategy",
  "ecommerce",
  "digital marketing",
];

const HIGH_VALUE_COMPANY_TYPES = [
  "hotel_management_company",
  "hospitality_group",
  "boutique_hotel_group",
  "resort_group",
  "independent_lifestyle_hotel",
];

const NOTES_KEYWORDS = [
  "portfolio",
  "multi-property",
  "multi property",
  "owner",
  "management company",
  "pre-opening",
  "pre opening",
  "turnaround",
  "stabilization",
  "restaurant",
  "events",
  "f&b",
  "lifestyle",
  "boutique",
];

export function scoreContact(contact: Contact): number {
  if (contact.suppressed) return -Infinity;

  let score = 0;

  const titleLower = (contact.title ?? "").toLowerCase();
  if (HIGH_VALUE_TITLES.some((t) => titleLower.includes(t))) score += 3;

  if (contact.company_type && HIGH_VALUE_COMPANY_TYPES.includes(contact.company_type)) score += 3;

  if (contact.contact_type === "buyer" || contact.contact_type === "partner") score += 2;

  const notesLower = (contact.notes ?? "").toLowerCase();
  if (NOTES_KEYWORDS.some((kw) => notesLower.includes(kw))) score += 2;

  if (contact.opted_out) score -= 3;
  if (contact.status === "not_fit") score -= 2;

  return score;
}
