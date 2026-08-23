// ─────────────────────────────────────────────────────────────────────────────
// dns-stills-data.ts — static/campaign stills for /dns's static gallery
// section. Every src/title/dimension below is copied by reference from this
// project's existing app/tcrm/tcrm-media.ts manifest (TCRM_IMAGES) — real,
// already-optimized Archer Design hospitality work, nothing newly uploaded
// or invented.
//
// TCRM_IMAGES itself is left completely unmodified; this file re-reads every
// one of its entries (all of them — this gallery is meant to show volume and
// range, not a small curated handful) and assigns a fresh `category` tag set
// suited to /dns's own filter chips: All / Hospitality / F&B / Events /
// Seasonal / Campaigns / Brand & Promo. An item can carry more than one tag
// when it genuinely fits more than one filter (e.g. a holiday billboard is
// both "fb" and "seasonal").
// ─────────────────────────────────────────────────────────────────────────────

import { TCRM_IMAGES } from "../tcrm/tcrm-media";

export type DnsStillCategory = "hospitality" | "fb" | "events" | "seasonal" | "campaigns" | "brand-promo";

export type DnsStillImage = {
  src: string;
  title: string;
  category: string; // space-separated DnsStillCategory values
  width: number;
  height: number;
};

// Category overrides keyed by the TCRM_IMAGES src path, so this file never
// has to hand-retype titles/dimensions (and can't drift out of sync with
// the source manifest). Every TCRM_IMAGES entry gets an override below —
// none are dropped.
const CATEGORY_OVERRIDES: Record<string, string> = {
  "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png": "hospitality",
  "/tcrm/images/eliza-hot-metal-bistro-holiday-billboard.png": "fb campaigns seasonal",
  "/tcrm/images/hampton-by-hilton-flood-city-music-festival.png": "hospitality campaigns events",
  "/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png": "fb campaigns",
  "/tcrm/images/eliza-hot-metal-bistro-live-music-series.png": "fb campaigns events",
  "/tcrm/images/eliza-hot-metal-bistro-takeout-packaging.png": "fb brand-promo",
  "/tcrm/images/eliza-hot-metal-bistro-july-menu.png": "fb seasonal",
  "/tcrm/images/eliza-hot-metal-bistro-june-menu.png": "fb seasonal",
  "/tcrm/images/eliza-hot-metal-bistro-may-menu.png": "fb seasonal",
  "/tcrm/images/hampton-inn-greensburg-elements-floating-sound-bath.png": "hospitality events",
  "/tcrm/images/hampton-inn-johnstown-flood-city-music-festival.png": "hospitality campaigns events",
  "/tcrm/images/hampton-inn-johnstown-pet-friendly.png": "hospitality brand-promo",
  "/tcrm/images/hampton-inn-johnstown-pool-and-patio.png": "hospitality seasonal",
  "/tcrm/images/hampton-inn-johnstown-bring-your-best-friend.png": "hospitality brand-promo",
  "/tcrm/images/hotel-indigo-pittsburgh-america-s-250th-anniversary.png": "hospitality campaigns seasonal events",
  "/tcrm/images/hotel-indigo-pittsburgh-wings-of-steel-lecture-series.png": "hospitality campaigns events",
  "/tcrm/images/hotel-indigo-pittsburgh-wedding-room-block.png": "hospitality events",
  "/tcrm/images/hotel-indigo-pittsburgh-rooftop-party-big-blitz-band.png": "hospitality campaigns events seasonal",
  "/tcrm/images/eliza-hot-metal-bistro-hotel-indigo-share-the-love.png": "hospitality fb campaigns seasonal",
  "/tcrm/images/hotel-indigo-pittsburgh-last-minute-christmas-party.png": "hospitality campaigns events seasonal",
  "/tcrm/images/hotel-indigo-pittsburgh-rooftop-party-eliza-live-music.png": "hospitality campaigns events seasonal",
  "/tcrm/images/hotel-indigo-pittsburgh-instagram-grid.png": "hospitality brand-promo",
  "/tcrm/images/hampton-inn-greensburg-instagram-grid.png": "hospitality brand-promo",
  "/tcrm/images/minty-fresh-beverage-art-direction.png": "brand-promo fb",
};

export const DNS_STILLS: DnsStillImage[] = TCRM_IMAGES.map((img) => ({
  src: img.src,
  title: img.title,
  width: img.width,
  height: img.height,
  category: CATEGORY_OVERRIDES[img.src] ?? "hospitality",
}));

export const DNS_STILLS_NOTE = "Existing Archer Design hospitality work, shown as reference. Unrelated to DNS Industries.";
