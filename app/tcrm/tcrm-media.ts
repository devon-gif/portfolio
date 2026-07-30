// TCRM media manifest.
//
// Full-resolution motion and stills library for the /tcrm proposal page,
// served from a dedicated /tcrm-scoped folder (public/tcrm/videos,
// public/tcrm/images) so every asset URL on this page is self-contained.

export type TcrmMediaVideo = {
  src: string;
  title: string;
  category: string;
  width: number;
  height: number;
  order: number;
};

export type TcrmMediaImage = {
  src: string;
  title: string;
  category: string;
  width: number;
  height: number;
};

// Order tuned so the slideshow leads with strong, verified hospitality
// motion that is NOT the hero background clip (the hero now uses
// hotel-arrival-vintage-car.mp4, so that clip was moved to the very end
// here rather than sitting as both the hero and the first gallery item).
// Sequence: premium hospitality interiors/exteriors first, then other real
// hospitality motion, F&B, campaigns, experimental/product work, and
// finally the hero clip.
export const TCRM_VIDEOS: TcrmMediaVideo[] = [
  { src: "/tcrm/videos/luxury-bedroom-sequence.mp4", title: "Luxury Bedroom Sequence", category: "motion hospitality", width: 1920, height: 1080, order: 1 },
  { src: "/tcrm/videos/tropical-resort-daylight.mp4", title: "Tropical Resort Daylight", category: "motion hospitality", width: 1112, height: 834, order: 2 },
  { src: "/tcrm/videos/hotel-exterior-transition.mp4", title: "Hotel Exterior Transition", category: "motion hospitality", width: 1280, height: 720, order: 3 },
  { src: "/tcrm/videos/luxury-hotel-entrance-night-concept.mp4", title: "Luxury Hotel Entrance, Night (Concept)", category: "motion hospitality", width: 1280, height: 720, order: 4 },
  { src: "/tcrm/videos/elegant-hospitality-moment.mp4", title: "Elegant Hospitality Moment", category: "motion hospitality", width: 1280, height: 720, order: 5 },
  { src: "/tcrm/videos/luxury-starting-frame.mp4", title: "Luxury Starting Frame", category: "motion hospitality", width: 1280, height: 720, order: 6 },
  { src: "/tcrm/videos/suite-window-light.mp4", title: "Suite, Window Light", category: "motion hospitality", width: 1280, height: 720, order: 7 },
  { src: "/tcrm/videos/palm-trees-light-wind.mp4", title: "Palm Trees, Light Wind", category: "motion hospitality", width: 1280, height: 720, order: 8 },
  { src: "/tcrm/videos/poolside-lounge.mp4", title: "Poolside Lounge", category: "motion hospitality", width: 1280, height: 720, order: 9 },
  { src: "/tcrm/videos/bar-social.mp4", title: "Bar Social", category: "motion hospitality", width: 1280, height: 720, order: 10 },
  { src: "/tcrm/videos/bar-and-cocktails.mp4", title: "Bar & Cocktails", category: "motion fb", width: 834, height: 1112, order: 11 },
  { src: "/tcrm/videos/upscale-bar-close-up.mp4", title: "Upscale Bar, Close-Up", category: "motion fb", width: 834, height: 1112, order: 12 },
  { src: "/tcrm/videos/breakfast-coffee-steam.mp4", title: "Breakfast, Coffee Steam", category: "motion fb", width: 1112, height: 834, order: 13 },
  { src: "/tcrm/videos/beer-bubbling.mp4", title: "Beer, Bubbling", category: "motion fb", width: 834, height: 1112, order: 14 },
  { src: "/tcrm/videos/chocolate-sauce-pancakes.mp4", title: "Chocolate Sauce, Pancakes", category: "motion fb", width: 834, height: 1112, order: 15 },
  { src: "/tcrm/videos/waffle-pour.mp4", title: "Waffle Pour", category: "motion fb", width: 1280, height: 720, order: 16 },
  { src: "/tcrm/videos/pancake-pour.mp4", title: "Pancake Pour", category: "motion fb", width: 1248, height: 1664, order: 17 },
  { src: "/tcrm/videos/couple-orbit-shot.mp4", title: "Couple, Orbit Shot", category: "motion campaigns", width: 834, height: 1112, order: 18 },
  { src: "/tcrm/videos/champagne-detail.mp4", title: "Champagne Detail", category: "motion campaigns", width: 1112, height: 834, order: 19 },
  { src: "/tcrm/videos/bridal-portrait-alt-cut.mp4", title: "Bridal Portrait, Alt Cut", category: "motion campaigns", width: 1112, height: 834, order: 20 },
  { src: "/tcrm/videos/courtyard-couple.mp4", title: "Courtyard Couple", category: "motion campaigns", width: 834, height: 1112, order: 21 },
  { src: "/tcrm/videos/luxury-room-timelapse.mp4", title: "Luxury Room Timelapse", category: "motion hospitality experimental", width: 1280, height: 720, order: 22 },
  { src: "/tcrm/videos/cinematic-timelapse-transition.mp4", title: "Cinematic Timelapse Transition", category: "motion experimental", width: 834, height: 1112, order: 23 },
  { src: "/tcrm/videos/image-to-image-transition.mp4", title: "Image-to-Image Transition", category: "motion experimental", width: 720, height: 1280, order: 24 },
  { src: "/tcrm/videos/image-to-image-transition-alt-cut.mp4", title: "Image-to-Image Transition, Alt Cut", category: "motion experimental", width: 720, height: 1280, order: 25 },
  { src: "/tcrm/videos/environment-transition.mp4", title: "Environment Transition", category: "motion experimental", width: 1112, height: 834, order: 26 },
  { src: "/tcrm/videos/grayscale-to-color-transition.mp4", title: "Grayscale to Color Transition", category: "motion experimental", width: 960, height: 960, order: 27 },
  { src: "/tcrm/videos/cinematic-reference-composition.mp4", title: "Cinematic Reference Composition", category: "motion experimental", width: 834, height: 1112, order: 28 },
  { src: "/tcrm/videos/fall-to-winter-timelapse.mp4", title: "Fall to Winter Timelapse", category: "motion experimental", width: 1280, height: 720, order: 29 },
  { src: "/tcrm/videos/logo-animation.mp4", title: "Logo Animation", category: "motion product experimental", width: 1280, height: 720, order: 30 },
  { src: "/tcrm/videos/signature-cocktail.mp4", title: "Signature Cocktail", category: "motion fb experimental", width: 1440, height: 1440, order: 31 },
  // The Wayfinder / hero clip: intentionally last. This is the same clip
  // used as the hero video background, so it closes the slideshow instead
  // of duplicating the hero as the opening item.
  { src: "/tcrm/videos/hotel-arrival-vintage-car.mp4", title: "Hotel Arrival, Vintage Car", category: "motion hospitality", width: 1664, height: 1248, order: 32 },
];

export const TCRM_IMAGES: TcrmMediaImage[] = [
  { src: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png", title: "Hotel Indigo Pittsburgh, Room Collage", category: "hospitality", width: 1080, height: 1350 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-holiday-billboard.png", title: "Eliza Hot Metal Bistro, Holiday Billboard", category: "campaigns fb", width: 1784, height: 1616 },
  { src: "/tcrm/images/hampton-by-hilton-flood-city-music-festival.png", title: "Hampton by Hilton, Flood City Music Festival", category: "campaigns hospitality", width: 1106, height: 1516 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png", title: "Eliza Hot Metal Bistro, Burgers Poster", category: "fb campaigns", width: 1424, height: 1998 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-live-music-series.png", title: "Eliza Hot Metal Bistro, Live Music Series", category: "campaigns experimental", width: 1080, height: 1350 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-takeout-packaging.png", title: "Eliza Hot Metal Bistro, Takeout Packaging", category: "product", width: 1150, height: 1460 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-july-menu.png", title: "Eliza Hot Metal Bistro, July Menu", category: "fb", width: 1322, height: 1792 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-june-menu.png", title: "Eliza Hot Metal Bistro, June Menu", category: "fb", width: 1352, height: 1556 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-may-menu.png", title: "Eliza Hot Metal Bistro, May Menu", category: "fb", width: 1336, height: 1544 },
  { src: "/tcrm/images/hampton-inn-greensburg-elements-floating-sound-bath.png", title: "Hampton Inn Greensburg × Elements, Floating Sound Bath", category: "hospitality", width: 1322, height: 1848 },
  { src: "/tcrm/images/hampton-inn-johnstown-flood-city-music-festival.png", title: "Hampton Inn Johnstown, Flood City Music Festival", category: "campaigns hospitality", width: 1334, height: 1576 },
  { src: "/tcrm/images/hampton-inn-johnstown-pet-friendly.png", title: "Hampton Inn Johnstown, Pet Friendly", category: "hospitality", width: 1348, height: 1782 },
  { src: "/tcrm/images/hampton-inn-johnstown-pool-and-patio.png", title: "Hampton Inn Johnstown, Pool & Patio", category: "hospitality", width: 1346, height: 1816 },
  { src: "/tcrm/images/hampton-inn-johnstown-bring-your-best-friend.png", title: "Hampton Inn Johnstown, Bring Your Best Friend", category: "hospitality", width: 1332, height: 1774 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-america-s-250th-anniversary.png", title: "Hotel Indigo Pittsburgh, America's 250th Anniversary", category: "campaigns hospitality", width: 1328, height: 1778 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-wings-of-steel-lecture-series.png", title: "Hotel Indigo Pittsburgh, Wings of Steel Lecture Series", category: "campaigns hospitality", width: 1346, height: 1042 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-wedding-room-block.png", title: "Hotel Indigo Pittsburgh, Wedding Room Block", category: "hospitality", width: 1326, height: 1792 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-rooftop-party-big-blitz-band.png", title: "Hotel Indigo Pittsburgh, Rooftop Party, Big Blitz Band", category: "campaigns hospitality", width: 1336, height: 1782 },
  { src: "/tcrm/images/eliza-hot-metal-bistro-hotel-indigo-share-the-love.png", title: "Eliza Hot Metal Bistro × Hotel Indigo, Share the Love", category: "campaigns fb", width: 1308, height: 1760 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-last-minute-christmas-party.png", title: "Hotel Indigo Pittsburgh, Last Minute Christmas Party", category: "campaigns hospitality", width: 1354, height: 1758 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-rooftop-party-eliza-live-music.png", title: "Hotel Indigo Pittsburgh, Rooftop Party, Eliza Live Music", category: "campaigns hospitality", width: 1342, height: 1762 },
  { src: "/tcrm/images/hotel-indigo-pittsburgh-instagram-grid.png", title: "Hotel Indigo Pittsburgh, Instagram Grid", category: "hospitality", width: 3024, height: 2202 },
  { src: "/tcrm/images/hampton-inn-greensburg-instagram-grid.png", title: "Hampton Inn Greensburg, Instagram Grid", category: "hospitality", width: 3032, height: 2202 },
  { src: "/tcrm/images/minty-fresh-beverage-art-direction.png", title: "Minty Fresh, Beverage Art Direction", category: "product experimental fb", width: 1080, height: 1350 },
];
