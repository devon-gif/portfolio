import { TCRM_VIDEOS } from "@/app/tcrm/tcrm-media";

export type DevonMotionItem = {
  src: string;
  title: string;
  category: string;
};

export const DEVON_EXTRA_MOTION: DevonMotionItem[] = [
  { src: "/tcrm/videos/Nike.mp4", title: "Nike Product Motion", category: "product motion" },
  { src: "/tcrm/videos/App.mp4", title: "App Motion Study", category: "digital product motion" },
  { src: "/tcrm/videos/kid eating.mp4", title: "Lifestyle Food Moment", category: "lifestyle motion" },
  { src: "/tcrm/videos/dashboard2.mp4", title: "Dashboard Interface Study II", category: "digital product motion" },
  { src: "/tcrm/videos/headphones.mp4", title: "Headphones Product Motion", category: "product motion" },
  { src: "/tcrm/videos/tiny building.mp4", title: "Miniature Building Study", category: "3d experimental motion" },
  { src: "/tcrm/videos/white sneaker.mp4", title: "White Sneaker Product Motion", category: "product motion" },
  { src: "/tcrm/videos/food.mp4", title: "Food Motion Study", category: "food lifestyle motion" },
  { src: "/tcrm/videos/man falling.mp4", title: "Falling Figure Study", category: "experimental motion" },
  { src: "/tcrm/videos/Baker.mp4", title: "Baker Motion Study", category: "lifestyle food motion" },
  { src: "/tcrm/videos/Dashboard.mp4", title: "Dashboard Interface Study", category: "digital product motion" },
  { src: "/tcrm/videos/SEO thing.mp4", title: "SEO Interface Motion", category: "digital product motion" },
];

function tcrm(index: number): DevonMotionItem {
  const item = TCRM_VIDEOS[index];
  return { src: item.src, title: item.title, category: item.category };
}

function unique(items: DevonMotionItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
}

// Curated for the /devon reel rather than mirroring every source asset.
// The hotel-arrival shot opens the reel, Nike follows, then the strongest
// hospitality, product, F&B, campaign and experimental pieces. Alternate
// cuts and near-duplicate studies are intentionally omitted.
export const DEVON_ALL_MOTION: DevonMotionItem[] = unique([
  tcrm(31), // Hotel Arrival, Vintage Car — car pulls up / guest exits
  DEVON_EXTRA_MOTION[0], // Nike

  // Hospitality / cinematic
  tcrm(3),  // Luxury Hotel Entrance, Night
  tcrm(1),  // Tropical Resort Daylight
  tcrm(0),  // Luxury Bedroom Sequence
  tcrm(2),  // Hotel Exterior Transition
  tcrm(4),  // Elegant Hospitality Moment
  tcrm(6),  // Suite, Window Light
  tcrm(7),  // Palm Trees, Light Wind
  tcrm(8),  // Poolside Lounge

  // Product / interface
  DEVON_EXTRA_MOTION[1],  // App
  DEVON_EXTRA_MOTION[6],  // White Sneaker
  DEVON_EXTRA_MOTION[4],  // Headphones
  DEVON_EXTRA_MOTION[10], // Dashboard — keep one dashboard study
  DEVON_EXTRA_MOTION[11], // SEO interface
  DEVON_EXTRA_MOTION[5],  // Miniature Building

  // Food / beverage / lifestyle
  tcrm(10), // Bar & Cocktails
  tcrm(12), // Breakfast, Coffee Steam
  tcrm(14), // Chocolate Sauce, Pancakes
  tcrm(15), // Waffle Pour
  tcrm(30), // Signature Cocktail
  DEVON_EXTRA_MOTION[9], // Baker
  DEVON_EXTRA_MOTION[2], // Lifestyle Food Moment

  // Campaign / people
  tcrm(17), // Couple, Orbit Shot
  tcrm(18), // Champagne Detail
  tcrm(20), // Courtyard Couple
  tcrm(19), // Bridal Portrait, Alt Cut

  // Experimental / transitions
  tcrm(28), // Fall to Winter Timelapse
  tcrm(26), // Grayscale to Color Transition
  tcrm(25), // Environment Transition
  tcrm(23), // Image-to-Image Transition — keep one cut only
  tcrm(21), // Luxury Room Timelapse
  tcrm(29), // Logo Animation
]);

// Highlights now match the beginning of the curated reel so any other
// consumer gets the same strongest opening sequence.
export const DEVON_MOTION_HIGHLIGHTS: DevonMotionItem[] = DEVON_ALL_MOTION.slice(0, 15);
