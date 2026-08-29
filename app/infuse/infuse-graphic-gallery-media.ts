// ─────────────────────────────────────────────────────────────────────────────
// infuse-graphic-gallery-media.ts — the "Graphic + Campaign Work" gallery's
// media list for /infuse. Reuses the existing shared TCRM_IMAGES manifest
// (see app/tcrm/tcrm-media.ts) by reference — /tcrm itself is not modified
// — reordered specifically for Infuse: Eliza Hot Metal Bistro and other
// F&B work first, then Hotel Indigo and Hampton, then the rest.
// ─────────────────────────────────────────────────────────────────────────────

import { TCRM_IMAGES } from "@/app/tcrm/tcrm-media";

export type InfuseGraphicItem = {
  src: string;
  alt: string;
};

// Opening order for Infuse: Eliza (F&B) restaurant/campaign work first, in
// this exact sequence, then Eliza's event/live-music piece, then Hotel
// Indigo F&B/event and general hospitality creative, then Hampton hospitality
// campaigns, then the rest of the library.
const OPENING_ORDER = [
  "eliza-hot-metal-bistro-holiday-billboard.png",
  "eliza-hot-metal-bistro-burgers-poster.png",
  "eliza-hot-metal-bistro-july-menu.png",
  "eliza-hot-metal-bistro-june-menu.png",
  "eliza-hot-metal-bistro-may-menu.png",
  "minty-fresh-beverage-art-direction.png",
  "eliza-hot-metal-bistro-live-music-series.png",
  "eliza-hot-metal-bistro-hotel-indigo-share-the-love.png",
  "hotel-indigo-pittsburgh-room-collage.png",
  "hampton-by-hilton-flood-city-music-festival.png",
];

function filenameOf(src: string): string {
  const parts = src.split("/");
  return (parts[parts.length - 1] ?? src).toLowerCase();
}

// Lower rank sorts first. 0..n = the requested Eliza/F&B opening order,
// 100 = other Eliza / F&B pieces not explicitly listed, 200 = everything
// else (Hotel Indigo, Hampton, broader hospitality/campaigns).
function rankOf(src: string, category: string): number {
  const name = filenameOf(src);
  const openingIndex = OPENING_ORDER.indexOf(name);
  if (openingIndex !== -1) return openingIndex;
  if (name.includes("eliza") || category.includes("fb")) return 100;
  return 200;
}

export const INFUSE_GRAPHIC_ITEMS: InfuseGraphicItem[] = TCRM_IMAGES.map((image, index) => ({
  src: image.src,
  title: image.title,
  category: image.category,
  _rank: rankOf(image.src, image.category),
  _index: index,
}))
  .sort((a, b) => a._rank - b._rank || a._index - b._index)
  .map(({ src, title }) => ({ src, alt: title }));
