// Cana-specific media manifest.
//
// Cana's page needs a different lead story than /tcrm: F&B, bars, and
// events first, broad hospitality later. Rather than reordering shared
// media arrays (and risking regressions elsewhere), this file curates the
// verified media already present in the repo for /cana only.
//
// Sources include the TCRM hospitality library, the Valencia concept media,
// and a small set of unique Archer portfolio assets from /public. Duplicate
// files with alternate paths are intentionally omitted.

export type CanaMediaVideo = {
  src: string;
  title: string;
  /** Single-token category used for the Cana motion filter pills. */
  category: "bars" | "fb" | "events" | "hospitality" | "experimental";
  width: number;
  height: number;
  order: number;
};

export type CanaMediaImage = {
  src: string;
  title: string;
  category: string;
  width: number;
  height: number;
};

// Order: bars/cocktails first, then food + drink, then event/social
// motion, then hospitality environments and hotel/resort exteriors, then
// experimental/transition work last. The goal is that the first screen a
// visitor sees reads as restaurants + bars + events, not a hotel reel.
export const CANA_VIDEOS: CanaMediaVideo[] = [
  { src: "/tcrm/videos/signature-cocktail.mp4", title: "Signature Cocktail", category: "bars", width: 1440, height: 1440, order: 1 },
  { src: "/tcrm/videos/bar-and-cocktails.mp4", title: "Bar & Cocktails", category: "bars", width: 834, height: 1112, order: 2 },
  { src: "/tcrm/videos/upscale-bar-close-up.mp4", title: "Upscale Bar, Close-Up", category: "bars", width: 834, height: 1112, order: 3 },
  { src: "/tcrm/videos/bar-social.mp4", title: "Bar Social", category: "bars", width: 1280, height: 720, order: 4 },
  { src: "/tcrm/videos/chocolate-sauce-pancakes.mp4", title: "Chocolate Sauce, Pancakes", category: "fb", width: 834, height: 1112, order: 5 },
  { src: "/tcrm/videos/waffle-pour.mp4", title: "Waffle Pour", category: "fb", width: 1280, height: 720, order: 6 },
  { src: "/tcrm/videos/pancake-pour.mp4", title: "Pancake Pour", category: "fb", width: 1248, height: 1664, order: 7 },
  { src: "/tcrm/videos/breakfast-coffee-steam.mp4", title: "Breakfast, Coffee Steam", category: "fb", width: 1112, height: 834, order: 8 },
  { src: "/tcrm/videos/beer-bubbling.mp4", title: "Beer, Bubbling", category: "fb", width: 834, height: 1112, order: 9 },
  { src: "/tcrm/videos/couple-orbit-shot.mp4", title: "Couple, Orbit Shot", category: "events", width: 834, height: 1112, order: 10 },
  { src: "/tcrm/videos/champagne-detail.mp4", title: "Champagne Detail", category: "events", width: 1112, height: 834, order: 11 },
  { src: "/tcrm/videos/bridal-portrait-alt-cut.mp4", title: "Bridal Portrait, Alt Cut", category: "events", width: 1112, height: 834, order: 12 },
  { src: "/tcrm/videos/courtyard-couple.mp4", title: "Courtyard Couple", category: "events", width: 834, height: 1112, order: 13 },
  { src: "/tcrm/videos/elegant-hospitality-moment.mp4", title: "Elegant Hospitality Moment", category: "hospitality", width: 1280, height: 720, order: 14 },
  { src: "/tcrm/videos/luxury-bedroom-sequence.mp4", title: "Luxury Bedroom Sequence", category: "hospitality", width: 1920, height: 1080, order: 15 },
  { src: "/tcrm/videos/suite-window-light.mp4", title: "Suite, Window Light", category: "hospitality", width: 1280, height: 720, order: 16 },
  { src: "/tcrm/videos/luxury-starting-frame.mp4", title: "Luxury Starting Frame", category: "hospitality", width: 1280, height: 720, order: 17 },
  { src: "/tcrm/videos/poolside-lounge.mp4", title: "Poolside Lounge", category: "hospitality", width: 1280, height: 720, order: 18 },
  { src: "/tcrm/videos/palm-trees-light-wind.mp4", title: "Palm Trees, Light Wind", category: "hospitality", width: 1280, height: 720, order: 19 },
  { src: "/tcrm/videos/tropical-resort-daylight.mp4", title: "Tropical Resort Daylight", category: "hospitality", width: 1112, height: 834, order: 20 },
  { src: "/tcrm/videos/hotel-exterior-transition.mp4", title: "Hotel Exterior Transition", category: "hospitality", width: 1280, height: 720, order: 21 },
  { src: "/tcrm/videos/luxury-hotel-entrance-night-concept.mp4", title: "Luxury Hotel Entrance, Night (Concept)", category: "hospitality", width: 1280, height: 720, order: 22 },
  { src: "/tcrm/videos/hotel-arrival-vintage-car.mp4", title: "Hotel Arrival, Vintage Car", category: "hospitality", width: 1664, height: 1248, order: 23 },
  { src: "/valencia/media/cielo-sunset.mp4", title: "Cielo, Sunset", category: "hospitality", width: 1920, height: 1080, order: 24 },
  { src: "/valencia/media/george-exterior.mp4", title: "The George, Exterior", category: "hospitality", width: 1920, height: 1080, order: 25 },
  { src: "/valencia/media/hero.mp4", title: "Hospitality Brand Reel", category: "hospitality", width: 1920, height: 1080, order: 26 },
  { src: "/valencia/media/pool-experience.mp4", title: "Pool Experience", category: "hospitality", width: 1920, height: 1080, order: 27 },
  { src: "/valencia/media/texican-bar.mp4", title: "Texican Bar", category: "bars", width: 1920, height: 1080, order: 28 },
  { src: "/waffle.mp4", title: "Waffle Detail", category: "fb", width: 1920, height: 1080, order: 29 },
  { src: "/timelapse.mp4", title: "Luxury Property Timelapse", category: "hospitality", width: 1920, height: 1080, order: 30 },
  { src: "/tcrm/videos/luxury-room-timelapse.mp4", title: "Luxury Room Timelapse", category: "experimental", width: 1280, height: 720, order: 31 },
  { src: "/tcrm/videos/cinematic-timelapse-transition.mp4", title: "Cinematic Timelapse Transition", category: "experimental", width: 834, height: 1112, order: 32 },
  { src: "/tcrm/videos/image-to-image-transition.mp4", title: "Image-to-Image Transition", category: "experimental", width: 720, height: 1280, order: 33 },
  { src: "/tcrm/videos/image-to-image-transition-alt-cut.mp4", title: "Image-to-Image Transition, Alt Cut", category: "experimental", width: 720, height: 1280, order: 34 },
  { src: "/tcrm/videos/environment-transition.mp4", title: "Environment Transition", category: "experimental", width: 1112, height: 834, order: 35 },
  { src: "/tcrm/videos/grayscale-to-color-transition.mp4", title: "Grayscale to Color Transition", category: "experimental", width: 960, height: 960, order: 36 },
  { src: "/tcrm/videos/cinematic-reference-composition.mp4", title: "Cinematic Reference Composition", category: "experimental", width: 834, height: 1112, order: 37 },
  { src: "/tcrm/videos/fall-to-winter-timelapse.mp4", title: "Fall to Winter Timelapse", category: "experimental", width: 1280, height: 720, order: 38 },
  { src: "/tcrm/videos/logo-animation.mp4", title: "Logo Animation", category: "experimental", width: 1280, height: 720, order: 39 },
];

// Order: Eliza (F&B) menus, burgers, live music, and holiday billboards
// first; hotel x restaurant crossover and event/festival campaigns next;
// hospitality-only stills (rooms, pools, Instagram grids) last so the
// first impression reads as restaurant/event work, not a hotel brochure.
export const CANA_IMAGES: CanaMediaImage[] = [
  { src: "/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png", title: "Eliza Hot Metal Bistro, Burgers Poster", category: "fb campaigns", width: 1424, height: 1998 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-july-menu.png", title: "Eliza Hot Metal Bistro, July Menu", category: "fb", width: 1322, height: 1792 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-june-menu.png", title: "Eliza Hot Metal Bistro, June Menu", category: "fb", width: 1352, height: 1556 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-may-menu.png", title: "Eliza Hot Metal Bistro, May Menu", category: "fb", width: 1336, height: 1544 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-live-music-series.png", title: "Eliza Hot Metal Bistro, Live Music Series", category: "campaigns experimental", width: 1080, height: 1350 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-holiday-billboard.png", title: "Eliza Hot Metal Bistro, Holiday Billboard", category: "campaigns fb", width: 1784, height: 1616 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-hotel-indigo-share-the-love.png", title: "Eliza Hot Metal Bistro × Hotel Indigo, Share the Love", category: "campaigns fb", width: 1308, height: 1760 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-takeout-packaging.png", title: "Eliza Hot Metal Bistro, Takeout Packaging", category: "product", width: 1150, height: 1460 },
  { src: "/tcrm/images/minty-fresh-beverage-art-direction.png", title: "Minty Fresh, Beverage Art Direction", category: "product experimental fb", width: 1080, height: 1350 },
  { src: "/tcrm/images/hampton-by-hilton-flood-city-music-festival.png", title: "Hampton by Hilton, Flood City Music Festival", category: "campaigns hospitality", width: 1106, height: 1516 },
  { src: "/tcrm/images/hampton-inn-johnstown-flood-city-music-festival.png", title: "Hampton Inn Johnstown, Flood City Music Festival", category: "campaigns hospitality", width: 1334, height: 1576 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-rooftop-party-big-blitz-band.png", title: "Hotel Indigo Pittsburgh, Rooftop Party, Big Blitz Band", category: "campaigns hospitality", width: 1336, height: 1782 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-rooftop-party-eliza-live-music.png", title: "Hotel Indigo Pittsburgh, Rooftop Party, Eliza Live Music", category: "campaigns hospitality", width: 1342, height: 1762 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-last-minute-christmas-party.png", title: "Hotel Indigo Pittsburgh, Last Minute Christmas Party", category: "campaigns hospitality", width: 1354, height: 1758 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-wings-of-steel-lecture-series.png", title: "Hotel Indigo Pittsburgh, Wings of Steel Lecture Series", category: "campaigns hospitality", width: 1346, height: 1042 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-america-s-250th-anniversary.png", title: "Hotel Indigo Pittsburgh, America's 250th Anniversary", category: "campaigns hospitality", width: 1328, height: 1778 },
  { src: "/tcrm/images/hampton-inn-greensburg-elements-floating-sound-bath.png", title: "Hampton Inn Greensburg × Elements, Floating Sound Bath", category: "hospitality", width: 1322, height: 1848 },
  { src: "/tcrm/images/hampton-inn-johnstown-pet-friendly.png", title: "Hampton Inn Johnstown, Pet Friendly", category: "hospitality", width: 1348, height: 1782 },
  { src: "/tcrm/images/hampton-inn-johnstown-pool-and-patio.png", title: "Hampton Inn Johnstown, Pool & Patio", category: "hospitality", width: 1346, height: 1816 },
  { src: "/tcrm/images/hampton-inn-johnstown-bring-your-best-friend.png", title: "Hampton Inn Johnstown, Bring Your Best Friend", category: "hospitality", width: 1332, height: 1774 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-wedding-room-block.png", title: "Hotel Indigo Pittsburgh, Wedding Room Block", category: "hospitality", width: 1326, height: 1792 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png", title: "Hotel Indigo Pittsburgh, Room Collage", category: "hospitality", width: 1080, height: 1350 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-instagram-grid.png", title: "Hotel Indigo Pittsburgh, Instagram Grid", category: "hospitality", width: 3024, height: 2202 },
  { src: "/tcrm/images/hampton-inn-greensburg-instagram-grid.png", title: "Hampton Inn Greensburg, Instagram Grid", category: "hospitality", width: 3032, height: 2202 },
  { src: "/Image 1.png", title: "Hospitality Social Campaign", category: "campaigns hospitality", width: 1080, height: 1350 },
  { src: "/Image 8.png", title: "Hotel Campaign Creative", category: "campaigns hospitality", width: 1080, height: 1350 },
  { src: "/Image 9.png", title: "Hospitality Promotional Creative", category: "campaigns hospitality", width: 1080, height: 1350 },
  { src: "/image 10.png", title: "Property Marketing Creative", category: "campaigns hospitality", width: 1080, height: 1350 },
  { src: "/image 11.png", title: "Hospitality Brand Campaign", category: "campaigns hospitality", width: 1080, height: 1350 },
];
