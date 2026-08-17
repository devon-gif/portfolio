// ─────────────────────────────────────────────────────────────────────────────
// rebel-motion-data.ts — motion architecture for /rebel.
//
// REBEL_CLIPS is the source of truth for the seven real, Rebel-specific
// clips shot/produced for this concept (public/rebel/motion/videos/*.mp4).
// Every one of the seven is hard-wired to an explicit path here -- no
// `enabled` flag, no empty videoSrc, no server-side existence check --
// so whether a clip actually renders is never gated by config. Whether a
// file actually loads is discovered client-side by the video element
// itself, via components/RebelMotion.tsx's graceful video -> poster ->
// fallback chain (kept as a safety net, not as the primary path).
//
// Two more arrays live here for the handful of page moments that are
// NOT one of the seven specific clips above (the "One portfolio" grid's
// independent-lifestyle/branded-full-service/focused-service slots, and
// three of the six "Where Rebel + Archer connect" pairings):
//
//   1. REBEL_PROPERTY_MOTION — one entry per likely future NAMED Rebel
//      property clip (see Devon's brief). Every entry ships `enabled:
//      false` and an empty videoSrc/posterSrc today, because none of
//      that footage exists yet. Left untouched by the HERO/cityscape/
//      Noodles/Wedding/Room/Pool/timelapse-fire fix -- those are generic
//      Rebel-concept production, not footage of any specific named
//      property, so they don't belong in this named-property array.
//
//   2. ARCHER_MOTION_SPOTLIGHT — the graceful, non-"coming soon" stand-in
//      shown wherever a slot isn't covered by REBEL_CLIPS or a named
//      REBEL_PROPERTY_MOTION entry. Reuses Archer's existing,
//      already-approved generic /tcrm hospitality motion library, with
//      no Rebel property name attached to any clip -- so nothing on this
//      page ever implies a specific Rebel property has requested or
//      received Archer services.
// ─────────────────────────────────────────────────────────────────────────────

const REBEL_VIDEO_BASE = "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/rebel";

export type RebelClipKey = "hero" | "cityscape" | "noodles" | "wedding" | "room" | "pool" | "timelapseFire";

export type RebelClip = {
  key: RebelClipKey;
  src: string;
  alt: string;
  caption: string;
};

/**
 * The seven real Rebel-specific clips, explicit and hard-wired. Verify
 * with `ls public/rebel/motion/videos/` -- HERO.mp4, Wedding.mp4,
 * Noodles.mp4, cityscape.mp4, Room.mp4, Pool.mp4, timelapse-fire.mp4.
 */
export const REBEL_CLIPS: Record<RebelClipKey, RebelClip> = {
  hero: {
    key: "hero",
    src: `${REBEL_VIDEO_BASE}/HERO.mp4`,
    alt: "Rebel Hotel Company portfolio hero motion",
    caption: "",
  },
  cityscape: {
    key: "cityscape",
    src: `${REBEL_VIDEO_BASE}/cityscape.mp4`,
    alt: "City skyline motion, representing Rebel's urban, multi-platform portfolio",
    caption: "Urban portfolio",
  },
  noodles: {
    key: "noodles",
    src: `${REBEL_VIDEO_BASE}/Noodles.mp4`,
    alt: "F&B motion, restaurant and outlet promotion",
    caption: "F&B & outlet promotion",
  },
  wedding: {
    key: "wedding",
    src: `${REBEL_VIDEO_BASE}/Wedding.mp4`,
    alt: "Wedding and events motion, meetings and groups promotion",
    caption: "Meetings, weddings & events",
  },
  room: {
    key: "room",
    src: `${REBEL_VIDEO_BASE}/Room.mp4`,
    alt: "Guest room motion, direct-booking and property promotion",
    caption: "Rooms & direct booking",
  },
  pool: {
    key: "pool",
    src: `${REBEL_VIDEO_BASE}/Pool.mp4`,
    alt: "Pool and leisure motion, destination and seasonal storytelling",
    caption: "Leisure & seasonal",
  },
  timelapseFire: {
    key: "timelapseFire",
    src: `${REBEL_VIDEO_BASE}/timelapse-fire.mp4`,
    alt: "Fire pit timelapse, resort and lodge evening storytelling",
    caption: "Resort & lodge evenings",
  },
};

export type RebelMotionCategory =
  | "independent-lifestyle"
  | "branded-full-service"
  | "focused-service"
  | "fb"
  | "campaigns"
  | "destination";

export type RebelMotionAsset = {
  key: string;
  order: number;
  propertyName: string;
  location: string;
  videoSrc: string;
  posterSrc: string;
  category: RebelMotionCategory;
  caption: string;
  alt: string;
  enabled: boolean;
};

// ── Future NAMED Rebel property motion (disabled placeholders) ────────────
// Suggested drop-in convention once real footage exists:
//   public/rebel/motion/videos/<key>.mp4
//   public/rebel/motion/posters/<key>.webp
export const REBEL_PROPERTY_MOTION: RebelMotionAsset[] = [
  {
    key: "hotel-la-jolla",
    order: 1,
    propertyName: "Hotel La Jolla",
    location: "",
    videoSrc: "",
    posterSrc: "",
    category: "independent-lifestyle",
    caption: "Reserved for future Hotel La Jolla motion.",
    alt: "Hotel La Jolla, placeholder for future Archer motion production",
    enabled: false,
  },
  {
    key: "smyth-tribeca",
    order: 2,
    propertyName: "Smyth Tribeca",
    location: "Tribeca, New York, NY",
    videoSrc: "",
    posterSrc: "",
    category: "independent-lifestyle",
    caption: "Reserved for future Smyth Tribeca motion.",
    alt: "Smyth Tribeca, placeholder for future Archer motion production",
    enabled: false,
  },
  {
    key: "ink48",
    order: 3,
    propertyName: "Ink48",
    location: "Hell's Kitchen, New York, NY",
    videoSrc: "",
    posterSrc: "",
    category: "branded-full-service",
    caption: "Reserved for future Ink48 motion.",
    alt: "Ink48, placeholder for future Archer motion production",
    enabled: false,
  },
  {
    key: "circa-39",
    order: 4,
    propertyName: "Circa 39",
    location: "",
    videoSrc: "",
    posterSrc: "",
    category: "independent-lifestyle",
    caption: "Reserved for future Circa 39 motion.",
    alt: "Circa 39, placeholder for future Archer motion production",
    enabled: false,
  },
  {
    key: "the-coachman",
    order: 5,
    propertyName: "The Coachman",
    location: "",
    videoSrc: "",
    posterSrc: "",
    category: "independent-lifestyle",
    caption: "Reserved for future The Coachman motion.",
    alt: "The Coachman, placeholder for future Archer motion production",
    enabled: false,
  },
  {
    key: "the-renwick",
    order: 6,
    propertyName: "The Renwick",
    location: "Midtown Manhattan, New York, NY",
    videoSrc: "",
    posterSrc: "",
    category: "branded-full-service",
    caption: "Reserved for future The Renwick motion.",
    alt: "The Renwick, placeholder for future Archer motion production",
    enabled: false,
  },
  {
    key: "hilton-capitol-hill",
    order: 7,
    propertyName: "Hilton Washington DC Capitol Hill",
    location: "Washington, DC",
    videoSrc: "",
    posterSrc: "",
    category: "branded-full-service",
    caption: "Reserved for future Hilton Capitol Hill motion.",
    alt: "Hilton Washington DC Capitol Hill, placeholder for future Archer motion production",
    enabled: false,
  },
  {
    key: "renegade-focused-service",
    order: 8,
    propertyName: "Renegade Hotels focused-service property",
    location: "",
    videoSrc: "",
    posterSrc: "",
    category: "focused-service",
    caption: "Reserved for a future Renegade Hotels focused-service property.",
    alt: "Renegade Hotels focused-service property, placeholder for future Archer motion production",
    enabled: false,
  },
];

// ── Graceful generic stand-in (enabled today) ──────────────────────────────
// Reuses Archer's existing, already-approved /tcrm hospitality motion
// library (see app/tcrm/tcrm-media.ts, the same source /jacaruso's "The
// Work" section draws from). No Rebel property name is attached to any
// clip below.
const TCRM_VIDEO_BASE = "/tcrm/videos";

export const ARCHER_MOTION_SPOTLIGHT: RebelMotionAsset[] = [
  {
    key: "spotlight-hospitality",
    order: 1,
    propertyName: "Archer hospitality motion library",
    location: "",
    videoSrc: `${TCRM_VIDEO_BASE}/luxury-bedroom-sequence.mp4`,
    posterSrc: "",
    category: "independent-lifestyle",
    caption: "Independent & lifestyle — guest room storytelling",
    alt: "Archer motion example: luxury guest room, still photography brought to life",
    enabled: true,
  },
  {
    key: "spotlight-branded",
    order: 2,
    propertyName: "Archer hospitality motion library",
    location: "",
    videoSrc: `${TCRM_VIDEO_BASE}/hotel-exterior-transition.mp4`,
    posterSrc: "",
    category: "branded-full-service",
    caption: "Branded full-service — arrival & exterior",
    alt: "Archer motion example: branded full-service hotel exterior transition",
    enabled: true,
  },
  {
    key: "spotlight-focused-service",
    order: 3,
    propertyName: "Archer hospitality motion library",
    location: "",
    videoSrc: `${TCRM_VIDEO_BASE}/suite-window-light.mp4`,
    posterSrc: "",
    category: "focused-service",
    caption: "Focused-service — repeatable property coverage",
    alt: "Archer motion example: focused-service guest room, window light",
    enabled: true,
  },
  {
    key: "spotlight-fb",
    order: 4,
    propertyName: "Archer hospitality motion library",
    location: "",
    videoSrc: `${TCRM_VIDEO_BASE}/bar-and-cocktails.mp4`,
    posterSrc: "",
    category: "fb",
    caption: "F&B — restaurant, bar & outlet promotion",
    alt: "Archer motion example: bar and cocktails, F&B promotion",
    enabled: true,
  },
  {
    key: "spotlight-campaigns",
    order: 5,
    propertyName: "Archer hospitality motion library",
    location: "",
    videoSrc: `${TCRM_VIDEO_BASE}/courtyard-couple.mp4`,
    posterSrc: "",
    category: "campaigns",
    caption: "Meetings, weddings & groups",
    alt: "Archer motion example: courtyard couple, event and wedding promotion",
    enabled: true,
  },
  {
    key: "spotlight-destination",
    order: 6,
    propertyName: "Archer hospitality motion library",
    location: "",
    videoSrc: `${TCRM_VIDEO_BASE}/tropical-resort-daylight.mp4`,
    posterSrc: "",
    category: "destination",
    caption: "Destination & leisure",
    alt: "Archer motion example: tropical resort in daylight, destination storytelling",
    enabled: true,
  },
  {
    key: "spotlight-launch",
    order: 7,
    propertyName: "Archer hospitality motion library",
    location: "",
    videoSrc: `${TCRM_VIDEO_BASE}/champagne-detail.mp4`,
    posterSrc: "",
    category: "campaigns",
    caption: "Launch & repositioning",
    alt: "Archer motion example: champagne detail, launch campaign creative",
    enabled: true,
  },
];

/**
 * Returns the motion assets to actually render for a given category slot:
 * any enabled, property-specific Rebel clips first (none today), padded
 * out with the generic Archer spotlight so a section is never left with
 * fewer items than requested and never falls back to an empty/"coming
 * soon" box.
 */
export function getMotionForCategory(category: RebelMotionCategory, count: number): RebelMotionAsset[] {
  const specific = REBEL_PROPERTY_MOTION.filter((m) => m.enabled && m.category === category).sort((a, b) => a.order - b.order);
  if (specific.length >= count) return specific.slice(0, count);

  const fallback = ARCHER_MOTION_SPOTLIGHT.filter((m) => m.category === category);
  const generalFallback = ARCHER_MOTION_SPOTLIGHT.filter((m) => m.category !== category);
  const padded = [...specific, ...fallback, ...generalFallback];
  return padded.slice(0, count);
}
