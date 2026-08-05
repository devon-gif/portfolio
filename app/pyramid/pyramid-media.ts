// ─────────────────────────────────────────────────────────────────────────────
// pyramid-media.ts — data-only config for the seven real Pyramid motion/food
// clips now on disk under public/Pyramid hospitality/. Deliberately contains
// NO server-side file-existence checks (no node:fs, no node:path, no
// fs.existsSync) — that pattern has previously caused oversized Vercel
// function tracing. Every path below is just a plain string; whether the
// file actually loads is discovered entirely client-side inside
// components/SafeVideo.tsx, via the browser's own <video>/<img> error
// events.
//
// SOURCE FOLDER — confirmed on disk exactly as follows (note the real
// capitalization/spacing, different from the placeholder paths used before
// these files existed):
//   public/Pyramid hospitality/Videos/*.mp4
//   public/Pyramid hospitality/Posters/*.webp
// Public URLs below URL-encode the space in "Pyramid hospitality".
//
// FIVE OF THE SEVEN CLIPS WERE RE-ENCODED for web delivery (originals were
// exported at 21-52 Mbps, 7-44 MB for 5-7 second loops -- see the
// -web.mp4 siblings alongside each original, created via ffmpeg: H.264,
// yuv420p, +faststart, audio stripped since every clip renders muted).
// Originals are untouched and still sit alongside the compressed copies.
// lady.mp4 (12.7 MB) and lobby.mp4 (7.4 MB) were already under the ~15-20 MB
// threshold and are used unmodified.
//
// PROPERTY ATTRIBUTION — only assigned where the actual footage clearly
// supports it (checked frame-by-frame via ffmpeg before writing this file):
//   - aerial: pink Bermuda-style cottages + turquoise water = Cambridge
//     Beaches Resort & Spa, Bermuda (matches Pyramid's own published
//     property imagery).
//   - Pool: red sandstone rock formations behind an infinity pool = Garden
//     of the Gods Resort and Club, Colorado Springs.
//   - dock: rocky New England shoreline, dock, kayaks = Spruce Point Inn,
//     Boothbay Harbor, ME.
//   - lobby: mid-century lounge, stone fireplace, retro furniture = Hotel
//     Valley Ho, Scottsdale, AZ.
// The remaining three (lady, Room, pancake) show generic settings with no
// identifying signage or architecture, so no property name is attached --
// each is presented as a general speculative creative study instead, per
// Devon's explicit instruction not to claim a specific property unless the
// footage clearly supports it.
// ─────────────────────────────────────────────────────────────────────────────

const VIDEO_BASE = "/Pyramid%20hospitality/Videos";
const POSTER_BASE = "/Pyramid%20hospitality/Posters";

export type MotionStudyVariant = "oversized" | "split" | "split-reverse" | "strip" | "cinematic";

export type PyramidMotionStudy = {
  key: string;
  order: number;
  /** Confirmed property name, only set when the footage itself clearly supports it. */
  property?: string;
  location?: string;
  category: string;
  creativeDirection: string;
  caption: string;
  videoSrc: string;
  posterSrc: string;
  variant: MotionStudyVariant;
};

export const PYRAMID_MOTION_STUDIES: PyramidMotionStudy[] = [
  {
    key: "aerial",
    order: 1,
    property: "Cambridge Beaches Resort & Spa",
    location: "Bermuda",
    category: "International coastal resort",
    creativeDirection: "Sunset aerial over pink cottages, turquoise shallows, palms, and moored boats.",
    caption:
      "One aerial still becomes a destination invitation: drifting cloud shadow, moving water, and a slow, restrained descent.",
    videoSrc: `${VIDEO_BASE}/aerial-web.mp4`,
    posterSrc: `${POSTER_BASE}/cambridge-beaches.webp`,
    variant: "oversized",
  },
  {
    key: "pool",
    order: 2,
    property: "Garden of the Gods Resort and Club",
    location: "Colorado Springs, CO",
    category: "Landscape, wellness, and destination experience",
    creativeDirection: "An infinity-edge pool facing red-rock formations under shifting mountain light.",
    caption: "Motion carries the scale of the landscape and the calm of the setting — without pulling attention off the property.",
    videoSrc: `${VIDEO_BASE}/pool-web.mp4`,
    posterSrc: `${POSTER_BASE}/garden-of-the-gods.webp`,
    variant: "split",
  },
  {
    key: "dock",
    order: 3,
    property: "Spruce Point Inn",
    location: "Boothbay Harbor, ME",
    category: "New England coastal retreat",
    creativeDirection: "An aerial descent over a poolside deck and a dock reaching into clear, rocky water.",
    caption: "Environmental movement does the work that a caption usually has to: place, season, and the slower pace of a coastal stay.",
    videoSrc: `${VIDEO_BASE}/dock-web.mp4`,
    posterSrc: `${POSTER_BASE}/spruce-point-inn.webp`,
    variant: "split-reverse",
  },
  {
    key: "lobby",
    order: 4,
    property: "Hotel Valley Ho",
    location: "Scottsdale, AZ",
    category: "Lifestyle, pool, and mid-century identity",
    creativeDirection: "A mid-century lounge — stone fireplace, retro furniture, warm evening light.",
    caption:
      "A distinctive architectural identity becomes short-form campaign content through subtle movement and era-appropriate pacing.",
    videoSrc: `${VIDEO_BASE}/lobby.mp4`,
    posterSrc: `${POSTER_BASE}/hotel-valley-ho.webp`,
    variant: "strip",
  },
  {
    key: "lady",
    order: 5,
    category: "Wellness and leisure moment",
    creativeDirection: "A poolside guest moment at golden hour, striped loungers, calm open water.",
    caption: "A quiet leisure frame becomes a flexible wellness and lifestyle asset — the kind that supports spa, pool, and rooftop storytelling across many property types.",
    videoSrc: `${VIDEO_BASE}/lady.mp4`,
    posterSrc: `${POSTER_BASE}/poolside-leisure.webp`,
    variant: "cinematic",
  },
];

/** Hero background reuses the first motion study (Cambridge Beaches aerial) when its media is available. */
export const HERO_MOTION_STUDY = PYRAMID_MOTION_STUDIES[0];

/** Food & beverage supporting feature -- generic plating, no property attribution. */
export const FB_STUDY: PyramidMotionStudy = {
  key: "pancake",
  order: 6,
  category: "Food & beverage storytelling",
  creativeDirection: "A plated breakfast stack, powdered sugar falling in slow motion, syrup, and warm table light.",
  caption: "The same treatment applied to a plated dish becomes a restaurant promotion, a breakfast campaign, or a seasonal package asset.",
  videoSrc: `${VIDEO_BASE}/pancake-web.mp4`,
  posterSrc: `${POSTER_BASE}/fb-pancake.webp`,
  variant: "cinematic",
};

/** Interior ambient loop -- used as a subdued background in the "One Asset, Multiple Outputs" section, not a named property. */
export const INTERIOR_AMBIENT_STUDY: PyramidMotionStudy = {
  key: "room",
  order: 7,
  category: "Property interiors and arrival",
  creativeDirection: "A softly lit guest room interior at dusk, city window light, and understated arrival atmosphere.",
  caption: "Interior photography, brought to life the same way -- arrival, guest rooms, and public spaces all become part of the same repeatable system.",
  videoSrc: `${VIDEO_BASE}/room-web.mp4`,
  posterSrc: `${POSTER_BASE}/room-interior.webp`,
  variant: "cinematic",
};
