// ─────────────────────────────────────────────────────────────────────────────
// first-hospitality-media.ts — single source of truth for the custom First
// Hospitality motion concepts on /first-hospitality.
//
// Devon supplied 5 real clips directly into public/first-hospitality/videos/
// (room.mp4, drink.mp4, "wedding hero.mp4" -> renamed wedding-hero.mp4,
// galaxy.mp4, lady.mp4) and confirmed all five are legitimately First
// Hospitality-owned/associated assets. Two of the five have a clearly
// legible property name burned into the footage itself (checked frame-by-
// frame via ffprobe/ffmpeg poster extraction):
//   - wedding-hero.mp4  -> "HOTEL FORT DES MOINES" signage, clearly legible
//   - galaxy.mp4        -> "THE ABBEY RESORT" signage, clearly legible
// The other three (room, drink, lady) show no legible property signage, so
// `property` is deliberately left undefined for them rather than guessing --
// this avoids the one failure mode the original brief called out explicitly
// ("never show incorrect property footage under a First Hospitality property
// label"). Each still gets an honest, accurate category label.
//
// Each entry resolves an `available` flag (and a separate `posterAvailable`
// flag) by checking, at render time, whether a real file exists at the given
// public path (same fileExists pattern as
// app/oxford/components/OxfordImagePlaceholder.tsx and app/oxford/oxford-
// media.ts), so the page never fails to build if a file is temporarily
// missing -- it renders a refined placeholder card instead (see
// FirstHospitalityConceptCard.tsx).
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

export type FirstHospitalityConcept = {
  key: string;
  /** Property name, only set when clearly legible/identifiable in the footage itself. */
  property?: string;
  /** Campaign-category label, always present and always accurate. */
  category: string;
  /** One-sentence business-use description (not a creative brief). */
  description: string;
  src: string;
  poster: string;
  /** Real aspect ratio of the supplied clip (from ffprobe), used for the media frame. */
  aspectClassName: string;
  available: boolean;
  posterAvailable: boolean;
};

function fileExists(publicPath: string): boolean {
  try {
    const cleaned = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
    const fullPath = path.join(process.cwd(), "public", cleaned);
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}

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
      "Ambient lobby and lounge motion showing how a property's public spaces could be turned into a recurring \"arrival experience\" campaign format.",
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

export const FIRST_HOSPITALITY_CONCEPTS: FirstHospitalityConcept[] = CONCEPTS_INPUT.map((c) => ({
  ...c,
  available: fileExists(c.src),
  posterAvailable: fileExists(c.poster),
}));

/** Hero concept: Hotel Fort Des Moines wedding sequence -- the largest, most cinematic clip supplied. Used as the hero background AND as custom feature 01. */
export const HERO_CONCEPT = FIRST_HOSPITALITY_CONCEPTS[0];

/**
 * Named lookups for the four remaining concepts, used as large distributed
 * editorial features throughout the page (see components/
 * FirstHospitalityFeature.tsx and page.tsx) rather than grouped into one
 * slideshow. Order below matches first-hospitality-media.ts's underlying
 * array; the page decides each feature's on-page position and layout.
 */
function conceptByKey(key: string): FirstHospitalityConcept {
  const found = FIRST_HOSPITALITY_CONCEPTS.find((c) => c.key === key);
  if (!found) throw new Error(`Unknown First Hospitality concept key: ${key}`);
  return found;
}
export const CONCEPT_GALAXY = conceptByKey("galaxy");
export const CONCEPT_ROOM = conceptByKey("room");
export const CONCEPT_DRINK = conceptByKey("drink");
export const CONCEPT_LADY = conceptByKey("lady");

/** Full speculative-work disclaimer -- shown once, near the first distributed custom feature, and in the footer. */
export const CONCEPT_DISCLAIMER_FULL =
  "Private speculative concept created by Archer Design using publicly displayed First Hospitality property imagery for evaluation purposes. Not commissioned or approved by First Hospitality or the featured property.";
/** Shortened repeat of the same qualification, used near the remaining distributed custom features. */
export const CONCEPT_DISCLAIMER_SHORT = "Speculative concept, not commissioned by First Hospitality.";
