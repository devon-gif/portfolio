// ─────────────────────────────────────────────────────────────────────────────
// oxford-media.ts — single source of truth for every image path used on the
// /oxford private proposal. Devon will supply approved Oxford Hotels &
// Resorts property photography later; until then, OxfordImagePlaceholder
// (see ./components/OxfordImagePlaceholder.tsx) renders a polished
// placeholder for any path below that does not yet exist in public/oxford.
//
// TO REPLACE A PLACEHOLDER: drop a file at the exact path listed below into
// public/oxford/. No code changes are required — the placeholder component
// checks for the file on the server and automatically renders the real
// <Image> once it exists. The build never fails because a file is missing.
// ─────────────────────────────────────────────────────────────────────────────

export type OxfordWorkItem = {
  key: string;
  src: string;
  category: string;
  sentence: string;
  badge?: "Motion" | "Campaign";
  /** Recommended shot description, shown inside the placeholder until src exists. */
  recommended: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// OXFORD_VIDEOS — every finished motion clip supplied by Devon, sourced from
// public/oxford/videos/ (11 files, all in use). Each entry is real,
// already-produced footage (not a placeholder), so these render through
// OxfordVideoCard (see ./components/OxfordVideoCard.tsx), which wraps the
// project's existing components/marketing/LazyVideo.tsx (viewport-aware
// autoplay/pause, muted, loop, playsInline, no controls) rather than a new
// video system.
//
// `order` is the single source of truth for display order on the page --
// app/oxford/page.tsx derives every section purely by filtering/sorting this
// array, so paths are never hardcoded more than once. `presentation` maps to
// the section treatment used in oxford.css:
//   hero       -> full-bleed cinematic opener (1 clip)
//   immersive  -> the single largest feature after the hero (1 clip)
//   feature    -> large standalone sections, sized to each clip's real
//                 aspect ratio (3 clips)
//   editorial  -> large alternating left/right/wide sections (3 clips)
//   compact    -> smaller supporting grid near the bottom (3 clips)
//
// A note on Langham.mp4: this clip visibly shows "THE LANGHAM" signage on
// the entrance canopy -- a different, unrelated hotel brand, not an Oxford
// Hotels & Resorts property. An earlier pass on this page excluded it for
// that reason. Devon has since explicitly confirmed (in-session, before this
// file was edited) that it should be used as-is, signage and all, as the
// hero. That direction is followed here; nothing about the file itself
// changed.
// ─────────────────────────────────────────────────────────────────────────────

export type OxfordVideo = {
  key: string;
  src: string;
  poster: string;
  title: string;
  category: string;
  description: string;
  aspect: "landscape" | "portrait" | "square";
  presentation: "hero" | "immersive" | "feature" | "editorial" | "compact";
  order: number;
  badge?: "Motion";
};

export const OXFORD_VIDEOS: OxfordVideo[] = [
  {
    key: "langham",
    src: "/oxford/videos/Langham.mp4",
    poster: "/oxford/videos/posters/Langham.jpg",
    title: "Arrival motion concept",
    category: "Hotel Entrance",
    description: "Porte-cochere arrival, doorman motion, and vehicle activity brought to life at the entrance.",
    aspect: "landscape", // 1280x720
    presentation: "hero",
    order: 1,
  },
  {
    key: "lexington",
    src: "/oxford/videos/Lexington.mp4",
    poster: "/oxford/videos/posters/Lexington.jpg",
    title: "Hotel exterior",
    category: "Hotel Exterior",
    description:
      "A static hotel exterior becomes a complete nighttime sequence through changing architectural light, moving traffic, and cinematic pacing.",
    aspect: "portrait", // 1248x1664 -- vertical night exterior, full building height
    presentation: "immersive",
    order: 2,
    badge: "Motion",
  },
  {
    key: "sushi",
    src: "/oxford/videos/Sushi.mp4",
    poster: "/oxford/videos/posters/Sushi.jpg",
    title: "Food & beverage",
    category: "Food & Beverage",
    description: "Subtle movement, preparation, texture, and pacing extend one restaurant photograph into polished campaign content.",
    aspect: "square", // 1440x1440
    presentation: "feature",
    order: 3,
    badge: "Motion",
  },
  {
    key: "rooftop",
    src: "/oxford/videos/rooftop.mp4",
    poster: "/oxford/videos/posters/rooftop.jpg",
    title: "Rooftop & nightlife",
    category: "Rooftop & Nightlife",
    description: "Guest movement, changing light, traffic, clouds, and environmental detail turn a rooftop image into a living hospitality moment.",
    aspect: "landscape", // 1664x1248
    presentation: "feature",
    order: 4,
    badge: "Motion",
  },
  {
    key: "sailboat",
    src: "/oxford/videos/sailboat.mp4",
    poster: "/oxford/videos/posters/sailboat.jpg",
    title: "Rooms & destination",
    category: "Rooms & Destination",
    description: "A guest room window frames the bridge, sailboats, and open water outside -- the destination visible from where you sleep.",
    aspect: "portrait", // 834x1112 -- room interior + window view
    presentation: "feature",
    order: 5,
    badge: "Motion",
  },
  {
    key: "lobby",
    src: "/oxford/videos/Lobby.mp4",
    poster: "/oxford/videos/posters/Lobby.jpg",
    title: "Lobby & arrival",
    category: "Lobby & Arrival",
    description: "Ambient interior motion turns a lobby photograph into a scene a guest can feel walking into.",
    aspect: "landscape", // 1920x1080
    presentation: "editorial",
    order: 6,
    badge: "Motion",
  },
  {
    key: "fountain",
    src: "/oxford/videos/Fountain.mp4",
    poster: "/oxford/videos/posters/Fountain.jpg",
    title: "Property experience",
    category: "Property Experience",
    description: "Evening courtyard atmosphere, water motion, and warm lighting show life on the property beyond the guest room.",
    aspect: "portrait", // 834x1112
    presentation: "editorial",
    order: 7,
    badge: "Motion",
  },
  {
    key: "galaxy",
    src: "/oxford/videos/galaxy.mp4",
    poster: "/oxford/videos/posters/galaxy.jpg",
    title: "Destination & view",
    category: "Destination & View",
    description: "Changing light and environmental motion extend the value of a single property image into an entire evening.",
    aspect: "square", // 1440x1440
    presentation: "editorial",
    order: 8,
    badge: "Motion",
  },
  {
    key: "pool",
    src: "/oxford/videos/pool.mp4",
    poster: "/oxford/videos/posters/pool.jpg",
    title: "Guest experience",
    category: "Guest Experience",
    description: "Human movement transforms a quiet amenity photograph into an aspirational hotel experience.",
    aspect: "landscape", // 1920x1080
    presentation: "compact",
    order: 9,
    badge: "Motion",
  },
  {
    key: "drink",
    src: "/oxford/videos/Drink.mp4",
    poster: "/oxford/videos/posters/Drink.jpg",
    title: "Cocktail & dining",
    category: "Cocktail & Dining",
    description: "Small movements, garnish details, and reflections elevate existing restaurant photography.",
    aspect: "square", // 1440x1440
    presentation: "compact",
    order: 10,
    badge: "Motion",
  },
  {
    key: "wedding",
    src: "/oxford/videos/Wedding.mp4",
    poster: "/oxford/videos/posters/Wedding.jpg",
    title: "Weddings & events",
    category: "Weddings & Events",
    description: "A prepared venue transitions into a living ceremony and emotional guest moment.",
    aspect: "landscape", // 1664x1248
    presentation: "compact",
    order: 11,
    badge: "Motion",
  },
];

/** Look up any video by key. */
export function oxfordVideoByKey(key: string): OxfordVideo {
  const found = OXFORD_VIDEOS.find((v) => v.key === key);
  if (!found) throw new Error(`Unknown Oxford video key: ${key}`);
  return found;
}

/** All videos matching a presentation tier, sorted by `order`. */
export function oxfordVideosByPresentation(presentation: OxfordVideo["presentation"]): OxfordVideo[] {
  return OXFORD_VIDEOS.filter((v) => v.presentation === presentation).sort((a, b) => a.order - b.order);
}

export const OXFORD_IMAGES = {
  hero: "/oxford/oxford-hero.jpg",
  hotels: "/oxford/oxford-hotels.jpg",
  foodAndBeverage: "/oxford/oxford-fb.jpg",
  events: "/oxford/oxford-events.jpg",
  work: [
    {
      key: "lifestyle",
      src: "/oxford/work-lifestyle.jpg",
      category: "Lifestyle hotel",
      sentence: "Property storytelling built around arrival, design, and the guest experience.",
      badge: "Campaign",
      recommended: "Lifestyle hotel lobby, exterior, or guest room, well-lit and true to the property's design identity",
    },
    {
      key: "dining",
      src: "/oxford/work-dining.jpg",
      category: "Restaurant and dining",
      sentence: "Menu, plating, and atmosphere creative built for a restaurant's own voice.",
      badge: "Campaign",
      recommended: "Restaurant interior, plated dish, or dining-room atmosphere shot",
    },
    {
      key: "rooftop",
      src: "/oxford/work-rooftop.jpg",
      category: "Rooftop or nightlife",
      sentence: "Evening energy and venue atmosphere for a rooftop or nightlife promotion.",
      badge: "Motion",
      recommended: "Rooftop bar or nightlife venue at golden hour or evening, showing crowd energy or skyline",
    },
    {
      key: "events",
      src: "/oxford/work-events.jpg",
      category: "Wedding and events",
      sentence: "Wedding and event-space creative built for booking inquiries, not just visibility.",
      recommended: "Wedding setup, event space, or ballroom styled for a real booking-driving campaign",
    },
    {
      key: "seasonal",
      src: "/oxford/work-seasonal.jpg",
      category: "Seasonal campaign",
      sentence: "A seasonal push turned into a finished, platform-ready campaign moment.",
      badge: "Campaign",
      recommended: "Seasonal property or venue moment, e.g. holiday, summer rooftop, or local-event tie-in",
    },
    {
      key: "package",
      src: "/oxford/work-package.jpg",
      category: "Property or package promotion",
      sentence: "A direct-booking package translated into guest-facing creative.",
      recommended: "Package or offer-driven property shot suited to a direct-booking promotion",
    },
  ] as OxfordWorkItem[],
} as const;
