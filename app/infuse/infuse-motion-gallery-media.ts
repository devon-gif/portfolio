// ─────────────────────────────────────────────────────────────────────────────
// infuse-motion-gallery-media.ts — the "Motion Work" gallery's media list
// for /infuse. Reuses the existing shared TCRM_BLOB_MOTION manifest (see
// app/tcrm/tcrm-motion-blob-manifest.ts) by reference — /tcrm itself is not
// modified — and reorders it specifically for Infuse: food-heaviest work
// concentrated at the very front (per direct request — Jaimie should see
// food-heavy motion immediately), then the rest of the hospitality/hotel/
// campaign motion work, with wedding/bridal-heavy pieces pushed to the end
// rather than removed.
//
// Four filenames (champagne-detail.mp4, breakfast-coffee-steam.mp4,
// beer-bubbling.mp4, waffle-pour.mp4) were previously excluded outright
// after a visual-review pass flagged a third-party brand or wedding-context
// element visible in frame. Per this round's explicit priority-order
// request, all four are back in, in the exact requested positions —
// flagged here in case that visual-review concern should still apply.
//
// Three of the four new Infuse-specific Seedance food clips
// (public/infuse/videos/, added directly to this project rather than the
// shared TCRM library) open the gallery ahead of everything else, in the
// order requested: ingredients -> plating -> elements. The fourth new clip,
// floating-sushi.mp4 (the red-background floating sushi piece), is now the
// HERO's single looping video (see infuse-media.ts) and is deliberately
// excluded here so it never repeats as a gallery item. The next food beat —
// "sushi-related food motion" — is instead the existing Oxford library's
// Sushi.mp4, the only other sushi clip available.
// ─────────────────────────────────────────────────────────────────────────────

import { TCRM_BLOB_MOTION } from "@/app/tcrm/tcrm-motion-blob-manifest";

export type InfuseMotionItem = {
  src: string;
  label: string;
  group: string;
};

const NEW_INFUSE_CLIPS: InfuseMotionItem[] = [
  { src: "/infuse/videos/floating-food.mp4", label: "Floating Ingredients", group: "Infuse · New Food Motion" },
  { src: "/infuse/videos/chef-plating.mp4", label: "Chef Plating", group: "Infuse · New Food Motion" },
  { src: "/infuse/videos/floating-forks.mp4", label: "Floating Elements", group: "Infuse · New Food Motion" },
];

// Food-first priority order, in this exact sequence (items 1-3 above are
// the new Infuse clips; this picks up at item 4 — "sushi-related food
// motion" — through item 14 of the requested priority list).
const OPENING_ORDER = [
  "sushi.mp4",
  "bar-and-cocktails.mp4",
  "upscale-bar-close-up.mp4",
  "breakfast-coffee-steam.mp4",
  "chocolate-sauce-pancakes.mp4",
  "waffle-pour.mp4",
  "pancake-pour.mp4",
  "signature-cocktail.mp4",
  "champagne-detail.mp4",
  "bar-social.mp4",
  "beer-bubbling.mp4",
];

const FNB_KEYWORDS = [
  "bar",
  "cocktail",
  "coffee",
  "pancake",
  "waffle",
  "champagne",
  "beer",
  "drink",
  "sushi",
  "lunch",
  "breakfast",
  "fnb",
];

const CAMPAIGN_KEYWORDS = ["transition", "timelapse", "composition", "cinematic", "grayscale"];

const WEDDING_KEYWORDS = ["wedding", "bridal", "couple", "courtyard"];

function filenameOf(local: string): string {
  const parts = local.split("/");
  return (parts[parts.length - 1] ?? local).toLowerCase();
}

// Lower rank sorts first. Tiers: 0 = requested opening order, 100 = other
// F&B, 200 = hospitality environments / hotels / guest experience
// (including other-client case studies — real proof of range, same
// standard already used in the PROOF section), 300 = campaigns /
// experimental VFX, 400 = wedding/bridal (kept, pushed last).
function rankOf(local: string, label: string): number {
  const name = filenameOf(local);
  const lower = `${label} ${name}`.toLowerCase();

  const openingIndex = OPENING_ORDER.indexOf(name);
  if (openingIndex !== -1) return openingIndex;

  if (WEDDING_KEYWORDS.some((k) => lower.includes(k))) return 400;
  if (FNB_KEYWORDS.some((k) => lower.includes(k))) return 100;
  if (CAMPAIGN_KEYWORDS.some((k) => lower.includes(k))) return 300;
  return 200;
}

const REST_OF_LIBRARY: InfuseMotionItem[] = TCRM_BLOB_MOTION.map((item, index) => ({
  src: item.src,
  label: item.label,
  group: item.group,
  _rank: rankOf(item.local, item.label),
  _index: index,
}))
  .sort((a, b) => a._rank - b._rank || a._index - b._index)
  .map(({ src, label, group }) => ({ src, label, group }));

export const INFUSE_MOTION_ITEMS: InfuseMotionItem[] = [...NEW_INFUSE_CLIPS, ...REST_OF_LIBRARY];
