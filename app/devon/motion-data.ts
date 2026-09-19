import { TCRM_BLOB_MOTION } from "@/app/tcrm/tcrm-motion-blob-manifest";

export type DevonMotionItem = {
  src: string;
  title: string;
  category: string;
};

export const DEVON_EXTRA_MOTION: DevonMotionItem[] = [
  { src: "/tcrm/videos/Nike.mp4", title: "Nike Product Motion", category: "commercial" },
  { src: "/tcrm/videos/App.mp4", title: "App Motion Study", category: "commercial" },
  { src: "/tcrm/videos/kid eating.mp4", title: "Lifestyle Food Moment", category: "f&b" },
  { src: "/tcrm/videos/dashboard2.mp4", title: "Dashboard Interface Study II", category: "commercial" },
  { src: "/tcrm/videos/headphones.mp4", title: "Headphones Product Motion", category: "commercial" },
  { src: "/tcrm/videos/tiny building.mp4", title: "Miniature Building Study", category: "commercial" },
  { src: "/tcrm/videos/white sneaker.mp4", title: "White Sneaker Product Motion", category: "commercial" },
  { src: "/tcrm/videos/food.mp4", title: "Food Motion Study", category: "f&b" },
  { src: "/tcrm/videos/man falling.mp4", title: "Falling Figure Study", category: "commercial" },
  { src: "/tcrm/videos/Baker.mp4", title: "Baker Motion Study", category: "f&b" },
  { src: "/tcrm/videos/SEO thing.mp4", title: "SEO Interface Motion", category: "commercial" },
];

const FNB_KEYWORDS = [
  "bar",
  "beer",
  "breakfast",
  "champagne",
  "chocolate",
  "cocktail",
  "drink",
  "food",
  "lunch",
  "pancake",
  "sushi",
  "texican",
  "waffle",
  "fnb",
];

const COMMERCIAL_KEYWORDS = [
  "cinematic reference",
  "cinematic timelapse",
  "environment transition",
  "fall to winter",
  "grayscale to color",
  "image to image",
  "logo animation",
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isKnownDuplicateEncode(local: string) {
  const lower = local.toLowerCase();

  // Pyramid stores both a lightweight -web encode and the full-quality source.
  // Keep the full-quality source only.
  if (
    lower.includes("public/pyramid hospitality/videos/") &&
    /(?:aerial|dock|pancake|pool|room)-web\.mp4$/.test(lower)
  ) {
    return true;
  }

  // These six Valencia numbered files are duplicate exports of the named
  // Valencia media files (same underlying clips / byte sizes). Keep the
  // clearer named versions: Hero, Pool Experience, Arrival Car, etc.
  if (lower.includes("public/tcrm/videos/valencia/valencia-motion-")) {
    return true;
  }

  return false;
}

const TCRM_UNIQUE = TCRM_BLOB_MOTION
  .filter((item) => !isKnownDuplicateEncode(item.local))
  .map<DevonMotionItem>((item) => ({
    src: item.src,
    title: item.label,
    category: item.group,
  }));

function isFnb(item: DevonMotionItem) {
  const haystack = normalize(`${item.title} ${item.category}`);
  return FNB_KEYWORDS.some((keyword) => haystack.includes(normalize(keyword)));
}

function isCommercial(item: DevonMotionItem) {
  const haystack = normalize(`${item.title} ${item.category}`);
  return COMMERCIAL_KEYWORDS.some((keyword) => haystack.includes(normalize(keyword)));
}

function uniqueBySrc(items: DevonMotionItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
}

function prioritize(items: DevonMotionItem[], firstTitles: string[]) {
  const priority = new Map(firstTitles.map((title, index) => [normalize(title), index]));
  return [...items].sort((a, b) => {
    const aPriority = priority.get(normalize(a.title)) ?? 999;
    const bPriority = priority.get(normalize(b.title)) ?? 999;
    return aPriority - bPriority;
  });
}

// HOTEL / HOSPITALITY
// Everything from the TCRM library that is clearly property-, room-, resort-,
// wedding-, arrival-, or place-oriented lives here, including motion from
// CoralTree, First Hospitality, Oxford, Pyramid, Dovetail, Lark, Valencia,
// and Archer's hospitality motion library.
export const DEVON_HOTEL_MOTION = prioritize(
  uniqueBySrc(TCRM_UNIQUE.filter((item) => !isFnb(item) && !isCommercial(item))),
  [
    "Hotel Arrival Vintage Car",
    "Lady",
    "Luxury Hotel Entrance Night Concept",
    "Luxury Bedroom Sequence",
    "Tropical Resort Daylight",
    "Hotel Exterior Transition",
    "Lobby",
    "Room",
  ],
);

// FOOD & BEVERAGE
export const DEVON_FNB_MOTION = prioritize(
  uniqueBySrc([
    ...TCRM_UNIQUE.filter(isFnb),
    ...DEVON_EXTRA_MOTION.filter((item) => item.category === "f&b"),
  ]),
  [
    "Lark Coastal Fnb",
    "Bar And Cocktails",
    "Signature Cocktail",
    "Sushi",
    "Breakfast Coffee Steam",
    "Chocolate Sauce Pancakes",
    "Pancake",
    "Waffle Pour",
  ],
);

// COMMERCIAL / PRODUCT / DIGITAL / EXPERIMENTAL
export const DEVON_COMMERCIAL_MOTION = prioritize(
  uniqueBySrc([
    ...DEVON_EXTRA_MOTION.filter((item) => item.category === "commercial"),
    ...TCRM_UNIQUE.filter(isCommercial),
  ]),
  [
    "Nike Product Motion",
    "App Motion Study",
    "White Sneaker Product Motion",
    "Headphones Product Motion",
    "Dashboard Interface Study II",
    "SEO Interface Motion",
  ],
);

// Backwards-compatible exports for any other route/component that still expects
// the older single-list API.
export const DEVON_ALL_MOTION = uniqueBySrc([
  ...DEVON_HOTEL_MOTION,
  ...DEVON_FNB_MOTION,
  ...DEVON_COMMERCIAL_MOTION,
]);

export const DEVON_MOTION_HIGHLIGHTS = DEVON_ALL_MOTION.slice(0, 15);
