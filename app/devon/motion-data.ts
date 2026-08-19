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

const mixedTcrmIndexes = [
  3, 10, 17, 22,
  1, 11, 18, 23,
  31, 12, 19, 24,
  0, 13, 20, 25,
  2, 14, 21, 26,
  4, 15, 27, 29,
  5, 16, 28, 30,
  6, 9, 7, 8,
];

const mixedTcrm: DevonMotionItem[] = mixedTcrmIndexes.map((index) => {
  const item = TCRM_VIDEOS[index];
  return { src: item.src, title: item.title, category: item.category };
});

function buildMixedLibrary() {
  const result: DevonMotionItem[] = [];
  let extraIndex = 0;

  // Nike is intentionally first.
  result.push(DEVON_EXTRA_MOTION[extraIndex++]);

  mixedTcrm.forEach((item, index) => {
    result.push(item);
    if ((index + 1) % 2 === 0 && extraIndex < DEVON_EXTRA_MOTION.length) {
      result.push(DEVON_EXTRA_MOTION[extraIndex++]);
    }
  });

  while (extraIndex < DEVON_EXTRA_MOTION.length) {
    result.push(DEVON_EXTRA_MOTION[extraIndex++]);
  }

  return result;
}

export const DEVON_ALL_MOTION = buildMixedLibrary();

export const DEVON_MOTION_HIGHLIGHTS: DevonMotionItem[] = [
  DEVON_EXTRA_MOTION[0],
  { src: TCRM_VIDEOS[3].src, title: TCRM_VIDEOS[3].title, category: TCRM_VIDEOS[3].category },
  DEVON_EXTRA_MOTION[1],
  { src: TCRM_VIDEOS[30].src, title: TCRM_VIDEOS[30].title, category: TCRM_VIDEOS[30].category },
  DEVON_EXTRA_MOTION[6],
  { src: TCRM_VIDEOS[17].src, title: TCRM_VIDEOS[17].title, category: TCRM_VIDEOS[17].category },
  DEVON_EXTRA_MOTION[10],
  { src: TCRM_VIDEOS[22].src, title: TCRM_VIDEOS[22].title, category: TCRM_VIDEOS[22].category },
  DEVON_EXTRA_MOTION[4],
  { src: TCRM_VIDEOS[31].src, title: TCRM_VIDEOS[31].title, category: TCRM_VIDEOS[31].category },
  DEVON_EXTRA_MOTION[7],
  { src: TCRM_VIDEOS[29].src, title: TCRM_VIDEOS[29].title, category: TCRM_VIDEOS[29].category },
  DEVON_EXTRA_MOTION[5],
  { src: TCRM_VIDEOS[20].src, title: TCRM_VIDEOS[20].title, category: TCRM_VIDEOS[20].category },
  DEVON_EXTRA_MOTION[9],
];
