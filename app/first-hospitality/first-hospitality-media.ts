// ─────────────────────────────────────────────────────────────────────────────
// first-hospitality-media.ts — single source of truth for the custom First
// Hospitality motion concepts on /first-hospitality.
//
// Media lives under public/first-hospitality and is referenced by URL. Do not
// use node:fs/path existence checks here: Next/Vercel file tracing can then
// pull the entire public directory into the route function bundle.
// ─────────────────────────────────────────────────────────────────────────────

export type FirstHospitalityConcept = {
  key: string;
  property?: string;
  category: string;
  description: string;
  src: string;
  poster: string;
  aspectClassName: string;
  available: boolean;
  posterAvailable: boolean;
};

type ConceptInput = Omit<FirstHospitalityConcept, "available" | "posterAvailable">;

const CONCEPTS_INPUT: ConceptInput[] = [
  {
    key: "wedding-hero",
    property: "Hotel Fort Des Moines",
    category: "Weddings & Events",
    description:
      "Arrival and celebration motion outside Hotel Fort Des Moines, showing how a real wedding moment at the property could anchor an events-focused campaign.",
    src: "/first-hospitality/videos/wedding-hero.mp4",
    poster: "/first-hospitality/videos/posters/wedding-hero.jpg",
    aspectClassName: "aspect-[4/3]",
  },
  {
    key: "galaxy",
    property: "The Abbey Resort",
    category: "Destination Arrival & Evening Ambiance",
    description:
      "Dusk arrival at The Abbey Resort, showing how evening lighting and property signage could be turned into a recurring destination-awareness campaign.",
    src: "/first-hospitality/videos/galaxy.mp4",
    poster: "/first-hospitality/videos/posters/galaxy.jpg",
    aspectClassName: "aspect-video",
  },
  {
    key: "room",
    category: "Lobby & Guest Lounge",
    description:
      "Ambient lobby and lounge motion showing how a property's public spaces could be turned into a recurring arrival-experience campaign format.",
    src: "/first-hospitality/videos/room.mp4",
    poster: "/first-hospitality/videos/posters/room.jpg",
    aspectClassName: "aspect-[3/4]",
  },
  {
    key: "drink",
    category: "Bar & Cocktail Service",
    description:
      "Outdoor bar and cocktail-service motion showing how a property's food-and-beverage program could be turned into recurring seasonal promotion creative.",
    src: "/first-hospitality/videos/drink.mp4",
    poster: "/first-hospitality/videos/posters/drink.jpg",
    aspectClassName: "aspect-[3/4]",
  },
  {
    key: "lady",
    category: "Arrival & Guest Service",
    description:
      "Doorman and guest-arrival motion showing how a property's service moments could support sales and direct-booking creative.",
    src: "/first-hospitality/videos/lady.mp4",
    poster: "/first-hospitality/videos/posters/lady.jpg",
    aspectClassName: "aspect-[3/4]",
  },
];

export const FIRST_HOSPITALITY_CONCEPTS: FirstHospitalityConcept[] = CONCEPTS_INPUT.map((concept) => ({
  ...concept,
  available: true,
  posterAvailable: true,
}));

export const HERO_CONCEPT = FIRST_HOSPITALITY_CONCEPTS[0];

function conceptByKey(key: string): FirstHospitalityConcept {
  const found = FIRST_HOSPITALITY_CONCEPTS.find((concept) => concept.key === key);
  if (!found) throw new Error(`Unknown First Hospitality concept key: ${key}`);
  return found;
}

export const CONCEPT_GALAXY = conceptByKey("galaxy");
export const CONCEPT_ROOM = conceptByKey("room");
export const CONCEPT_DRINK = conceptByKey("drink");
export const CONCEPT_LADY = conceptByKey("lady");

export const CONCEPT_DISCLAIMER_FULL =
  "Private speculative concept created by Archer Design using publicly displayed First Hospitality property imagery for evaluation purposes. Not commissioned or approved by First Hospitality or the featured property.";

export const CONCEPT_DISCLAIMER_SHORT =
  "Speculative concept, not commissioned by First Hospitality.";
