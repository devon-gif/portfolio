// ─────────────────────────────────────────────────────────────────────────────
// infuse-media.ts — media asset references for the /infuse private,
// personalized page prepared for Jaimie DeLeon (Infuse Hospitality).
//
// Every path below already exists in this project's shared hospitality media
// library (public/tcrm/videos, public/tcrm/images — the same library used by
// /tcrm, /dns, and this project's other private proposal pages). Nothing
// here is newly uploaded; these are existing, optimized project assets
// reused by reference. None of this imagery is Infuse Hospitality's own
// work — it is Archer Design's own hospitality creative library (Eliza Hot
// Metal Bistro, Hotel Indigo Pittsburgh, Hampton Inn), shown here as Devon's
// actual food, beverage, and hospitality production work.
//
// Poster stills for the F&B motion clips below (public/infuse/posters/*.jpg)
// were generated locally from each clip's own first frame via ffmpeg —
// derived assets scoped to this page, not new photography.
//
// Wedding-adjacent and third-party-branded clips were deliberately excluded
// after a visual review of every candidate:
//   - champagne-detail.mp4 dropped: despite its filename, the frame shows a
//     wedding ceremony aisle/floral arch, not neutral hospitality context.
//   - breakfast-coffee-steam.mp4 dropped: shows a visible third-party
//     hotel's own branded mug (not Devon/Archer/Infuse work).
//   - a "beer-bubbling" outdoor lifestyle clip was dropped: it centers a
//     named third-party beverage brand's can/glassware, shot outdoors, not
//     a restaurant/bar setting.
// ─────────────────────────────────────────────────────────────────────────────

export type InfuseWorkVideo = {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
};

export type InfuseWorkImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type InfuseHeroClip = {
  src: string;
  poster: string;
  alt: string;
  label: string;
};

/**
 * Hero — a single continuously-looping clip. Per direction the hero no
 * longer cycles through multiple videos: InfuseShowcase.tsx renders this
 * directly as a plain autoplay/muted/loop/playsInline <video> (no reel /
 * slideshow component). The red-background floating sushi piece — one of
 * the four new Infuse-specific Seedance clips in public/infuse/videos/,
 * sourced as .mov and transcoded locally to a web-safe H.264 MP4, original
 * kept alongside untouched — is the page's one continuous visual identity.
 * The other three new clips (floating-food, chef-plating, floating-forks)
 * open the Motion Work gallery instead — see infuse-motion-gallery-media.ts
 * — so they are not duplicated here.
 */
export const HERO_VIDEO_SRC = "/infuse/videos/floating-sushi.mp4";
export const HERO_VIDEO_POSTER = "/infuse/posters/floating-sushi.jpg";
export const HERO_VIDEO_ALT =
  "Assorted sushi rolls and nigiri floating apart with a soy sauce splash and chopsticks, deep red background";

/** Static fallback for prefers-reduced-motion: the clip's first frame. */
export const HERO_POSTER = HERO_VIDEO_POSTER;
export const HERO_ALT = HERO_VIDEO_ALT;

/** Selected work — motion. Five verified F&B/bar clips plus one restaurant
 * interior, spanning brunch, cocktails, and venue atmosphere. Every poster
 * is a locally generated first-frame still (public/infuse/posters/). */
export const WORK_VIDEOS: InfuseWorkVideo[] = [
  {
    src: "/tcrm/videos/bar-social.mp4",
    poster: "/infuse/posters/bar-social.jpg",
    label: "Restaurant & bar interior",
    width: 1280,
    height: 720,
  },
  {
    src: "/tcrm/videos/upscale-bar-close-up.mp4",
    poster: "/infuse/posters/upscale-bar-close-up.jpg",
    label: "Upscale bar, close up",
    width: 834,
    height: 1112,
  },
  {
    src: "/tcrm/videos/chocolate-sauce-pancakes.mp4",
    poster: "/infuse/posters/chocolate-sauce-pancakes.jpg",
    label: "Plated brunch, berry compote",
    width: 834,
    height: 1112,
  },
  {
    src: "/tcrm/videos/signature-cocktail.mp4",
    poster: "/infuse/posters/signature-cocktail.jpg",
    label: "Signature cocktail",
    width: 1440,
    height: 1440,
  },
  {
    src: "/tcrm/videos/waffle-pour.mp4",
    poster: "/infuse/posters/waffle-pour.jpg",
    label: "Waffle, strawberry pour",
    width: 1280,
    height: 720,
  },
];

/** Selected work — stills. Real client work: Eliza Hot Metal Bistro (F&B,
 * campaigns, menus), Hotel Indigo Pittsburgh (hospitality, guest
 * experience), Hampton Inn (campaigns/events). */
export const ELIZA_IMAGES: InfuseWorkImage[] = [
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png",
    alt: "Eliza Hot Metal Bistro burgers promotional poster, 15% off all burgers",
    width: 1424,
    height: 1998,
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-holiday-billboard.png",
    alt: "Eliza Hot Metal Bistro seasonal holiday billboard concept with signature cocktail",
    width: 1784,
    height: 1616,
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-july-menu.png",
    alt: "Eliza Hot Metal Bistro July seasonal menu design",
    width: 1322,
    height: 1792,
  },
];

export const INDIGO_IMAGES: InfuseWorkImage[] = [
  {
    src: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png",
    alt: "Hotel Indigo Pittsburgh guest room and lounge photography collage",
    width: 1080,
    height: 1350,
  },
];

export const HAMPTON_IMAGES: InfuseWorkImage[] = [
  {
    src: "/tcrm/images/hampton-by-hilton-flood-city-music-festival.png",
    alt: "Hampton by Hilton, AmeriServ Flood City Music Festival campaign recap graphic",
    width: 1106,
    height: 1516,
  },
];

export const BEVERAGE_ART_IMAGE: InfuseWorkImage = {
  src: "/tcrm/images/minty-fresh-beverage-art-direction.png",
  alt: "Minty Fresh — standalone cocktail art direction and product styling",
  width: 1080,
  height: 1350,
};
