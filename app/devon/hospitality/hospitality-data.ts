import { TCRM_IMAGES } from "@/app/tcrm/tcrm-media";
import {
  DEVON_COMMERCIAL_MOTION,
  DEVON_FNB_MOTION,
  DEVON_HOTEL_MOTION,
  type DevonMotionItem,
} from "../motion-data";

function uniqueMotion(items: DevonMotionItem[]) {
  return items.filter((item, index, all) =>
    all.findIndex((other) => other.src === item.src && other.youtubeId === item.youtubeId) === index,
  );
}

// Reuse the established full-quality library. Proposal collection names identify
// where a clip was stored; they do not establish a commissioned client relationship.
function studioMotion(item: DevonMotionItem): DevonMotionItem {
  return { ...item, category: "Hospitality motion · studio study" };
}

const additionalHotelMotion: DevonMotionItem[] = [
  { src: "/Poolside.mp4", title: "Poolside Hospitality", category: "Hotel motion · studio study" },
  { src: "/promo-video.mp4", title: "Archer Design Hospitality Reel", category: "Hospitality creative reel" },
  { src: "/dovetail/media/01-hero-bermuda/hero-bermuda.mp4", title: "Bermuda Destination Study", category: "Destination motion · studio study" },
  { src: "/lark/media/01-hero/hero.mp4", title: "Coastal Arrival", category: "Destination motion · studio study" },
  { src: "/lark/media/02-destination/destination.mp4", title: "A Sense of Place", category: "Destination motion · studio study" },
  { src: "/lark/media/03-property/property.mp4", title: "Property & Architecture", category: "Hotel motion · studio study" },
  { src: "/lark/media/04-experience/experience.mp4", title: "The Guest Experience", category: "Hotel motion · studio study" },
  { src: "/lark/media/06-seasonal/seasonal.mp4", title: "Seasonal Stay", category: "Seasonal motion · studio study" },
];

const additionalFoodMotion: DevonMotionItem[] = [
  { src: "/infuse/videos/floating-sushi.mp4", title: "Floating Sushi", category: "Food & beverage · studio study" },
  { src: "/infuse/videos/floating-food.mp4", title: "Food in Motion", category: "Food & beverage · studio study" },
  { src: "/infuse/videos/floating-forks.mp4", title: "Floating Forks", category: "Food & beverage · studio study" },
  { src: "/waffle.mp4", title: "Breakfast Waffle", category: "Food & beverage motion" },
  { src: "/dovetail/media/04-food-beverage/food-beverage.mp4", title: "Restaurant Atmosphere", category: "Food & beverage · studio study" },
  { src: "/lark/media/05-food-experience/food-experience.mp4", title: "The Dining Experience", category: "Food & beverage · studio study" },
];

// These are the hospitality transition studies in the wider commercial library.
// Product ads, films, interfaces and unrelated client work stay on /devon/motion.
const transitionStudies = DEVON_COMMERCIAL_MOTION.filter((item) =>
  item.src?.startsWith("https://") && !/logo animation/i.test(item.title),
).map(studioMotion);

const hotels = uniqueMotion([...DEVON_HOTEL_MOTION.map(studioMotion), ...additionalHotelMotion]);
const food = uniqueMotion([...DEVON_FNB_MOTION.map(studioMotion), ...additionalFoodMotion]);

export const HOSPITALITY_MOTION = uniqueMotion([...hotels, ...food, ...transitionStudies]);
export const HOSPITALITY_MOTION_GROUPS = [
  { key: "all", label: "All videos", items: HOSPITALITY_MOTION },
  { key: "hotels", label: "Hotels & destinations", items: hotels },
  { key: "food", label: "Food & beverage", items: food },
  { key: "studies", label: "Motion studies", items: transitionStudies },
].filter((group) => group.items.length > 0);

export type HospitalityGraphic = {
  src: string;
  title: string;
  width: number;
  height: number;
  groups: string[];
  kind: string;
};

const additionalGraphics: HospitalityGraphic[] = [
  { src: "/Image%208.png", title: "Hospitality Campaign — Sports Promotion", width: 1080, height: 1350, groups: ["events"], kind: "Campaign design" },
  { src: "/Image%209.png", title: "Hospitality Campaign — Football Promotion", width: 1080, height: 1350, groups: ["events"], kind: "Campaign design" },
  { src: "/image%2010.png", title: "Hampton Inn Greensburg — Shuttle Promotion", width: 1080, height: 1350, groups: ["hotels"], kind: "Campaign design" },
  { src: "/image%2011.png", title: "Eliza Hot Metal Bistro — Brand Texture", width: 1080, height: 1350, groups: ["food", "studies"], kind: "Brand study" },
];

export const HOSPITALITY_GRAPHICS: HospitalityGraphic[] = [
  ...TCRM_IMAGES.map((item) => {
    const title = item.title.toLowerCase();
    const study = title.includes("minty fresh");
    const groups = [
      ...(/hampton|hotel indigo/.test(title) ? ["hotels"] : []),
      ...(/eliza|beverage/.test(title) ? ["food"] : []),
      ...(/festival|music|sound bath|lecture|wedding|party|christmas|anniversary|share the love/.test(title) ? ["events"] : []),
      ...(study ? ["studies"] : []),
    ];
    return { ...item, groups, kind: study ? "Independent beverage art direction" : "Campaign design" };
  }),
  ...additionalGraphics,
];

export const HOSPITALITY_DESIGN_FILTERS = [
  { key: "all", label: "All design" },
  { key: "hotels", label: "Hotels" },
  { key: "food", label: "Food & beverage" },
  { key: "events", label: "Events & wellness" },
  { key: "studies", label: "Studio studies" },
] as const;
