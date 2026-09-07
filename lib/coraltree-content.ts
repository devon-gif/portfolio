// ─────────────────────────────────────────────────────────────────────────────
// Content for the private CoralTree Hospitality × Archer Design proposal
// (app/coraltree). Kept separate from the page/components so copy, stats,
// and media references can be reviewed and edited in one place without
// touching JSX. This file is CoralTree-specific — it does not affect any
// other route (dovetail, revstudio, review, etc).
//
// Every "Archer example" video below is EXISTING Archer Design creative
// work already used elsewhere in this repository (dovetail, valencia, lark,
// archer-preview routes). None of it is CoralTree or Magnolia client work —
// see GALLERY_LABEL and the per-item captions, which describe the subject
// matter generically ("Resort arrival," "Restaurant & bar") rather than
// naming a CoralTree property.
// ─────────────────────────────────────────────────────────────────────────────

import { CALENDLY_URL } from "@/lib/seo";

/** Every CTA *button* on /coraltree (as opposed to the plain in-page nav
 *  links) opens Devon's Calendly directly, in a new tab. */
export const CTA_HREF = CALENDLY_URL;

export const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "#opportunity", label: "The opportunity" },
  { href: "#differentiator", label: "Motion" },
  { href: "#experience-system", label: "Creative system" },
  { href: "#gallery", label: "Motion studies" },
  { href: "#proof", label: "Proof" },
  { href: "#entry-point", label: "Getting started" },
];

export const HERO = {
  eyebrow: "A custom creative proposal for CoralTree Hospitality",
  headline: "Turn remarkable destinations into motion guests can feel.",
  body: "CoralTree creates distinctive hotels, resorts, restaurants, wellness experiences, and destinations with a true sense of place. Archer Design can help turn those experiences into polished short-form motion, campaigns, and property-level creative — without adding more production pressure to local or corporate teams.",
  primaryCta: "See the opportunity",
  primaryHref: CTA_HREF,
  // Scrolls to the motion gallery section below, rather than off-page —
  // "view examples" should show examples, not open a booking link.
  secondaryCta: "View motion examples",
  secondaryHref: "#gallery",
  // Dedicated hero clip supplied for this proposal (public/coral-tree/movies).
  // Square source (1440x1440) — kept on object-fit:cover (crops, never
  // distorts/stretches the frame) inside the full-bleed hero band.
  videoSrc: "/coral-tree/movies/hero background.mp4",
  sceneTag: "Archer Design reel — resort & lobby motion study",
};

/**
 * Second cinematic beat, directly beneath the hero — matches the Dovetail
 * page's "Bermuda, from above" full-bleed pattern (public/dovetail/index.html
 * .experience#bermuda): one eyebrow, one headline, no body copy, video fills
 * the frame edge to edge.
 */
export const CINEMATIC_BEAT = {
  eyebrow: "A moment worth staying in",
  headline: "The pace a destination sets, guests can feel.",
  videoSrc: "/coral-tree/movies/book.mp4",
  sceneTag: "Archer Design reel — destination downtime",
};

/**
 * Split video + copy section, directly after the cinematic beat — mirrors
 * Dovetail's "Different properties. Different stories." split section
 * (public/dovetail/index.html .split#idea): full-height video on one side,
 * copy on the other, on a dark ground.
 */
export const SPLIT_INTRO = {
  eyebrow: "Golden hour, every day",
  headline: "The moment a destination shows exactly what it promised.",
  body: "The light, the setting, the first real look at where a guest has landed — often the very first piece of content someone sees before they ever book. It deserves the same craft as the rest of the stay.",
  // Lobby.mp4 retired (quality) — replaced with the dedicated sunset clip.
  videoSrc: "/coral-tree/movies/sunset.mp4",
  sceneTag: "Archer Design reel — resort exterior, golden hour",
};

export const SCALE_STRIP = {
  heading: "Every one of those experiences creates something worth showing.",
  stats: [
    { value: "30", label: "Destinations" },
    { value: "70", label: "Properties" },
    { value: "45", label: "Restaurants" },
    { value: "10", label: "Golf courses" },
    { value: "9", label: "Spas" },
  ],
  note: "Figures reflect CoralTree Hospitality's publicly presented portfolio scale.",
};

export const OPPORTUNITY = {
  eyebrow: "The creative opportunity",
  headline: "One portfolio. Thousands of moments guests can act on.",
  body: "Across CoralTree's collection, the same kinds of moments repeat property after property — and most of them already start with photography, video, menus, event details, and offers the team already has on hand. Archer Design turns those existing assets into finished, guest-facing creative.",
  moments: [
    { title: "Rooms, suites & arrivals", detail: "Residences, arrivals, and the first impression of a stay." },
    { title: "Restaurants & seasonal menus", detail: "Cocktails, chefs, seasonal dishes, and dining atmosphere." },
    { title: "Meetings, weddings & celebrations", detail: "Group events, retreats, wedding spaces, and holiday gatherings." },
    { title: "Spas, wellness & pools", detail: "Treatments, restorative experiences, and resort relaxation." },
    { title: "Golf & destination activities", detail: "Courses, outdoor adventures, and seasonal travel moments." },
    { title: "Openings, renovations & packages", detail: "Seasonal offers, refreshed spaces, and travel packages." },
    { title: "Local culture & sense of place", detail: "Neighborhood stories and the character unique to each destination." },
  ],
  // Video strip beneath the moment grid — same pattern as Dovetail's F&B
  // section (video frame under the labels row).
  videoSrc: "/coral-tree/movies/Room.mp4",
  sceneTag: "Archer Design reel — guest room & suite",
};

export const DIFFERENTIATOR = {
  eyebrow: "The differentiator",
  headline: "Hospitality motion is a specialty — not another template.",
  body: "Motion graphics and AI-assisted image animation are niche production capabilities that typically require several separate resources: a designer, a motion artist, a video editor, a social creative producer, and a campaign designer. Archer Design brings those disciplines together through one hospitality-focused creative system.",
  capabilities: [
    "Visual direction",
    "Image animation",
    "Cinematic movement",
    "Compositing",
    "Short-form editing",
    "Typography",
    "Campaign design",
    "Format adaptation",
    "Final social exports",
  ],
  process: [
    { index: "01", label: "Existing CoralTree asset", detail: "Photography, video, menus, or event details the property already owns." },
    { index: "02", label: "Creative direction", detail: "Visual language and pacing matched to the property's own character." },
    { index: "03", label: "Motion & campaign production", detail: "Animation, compositing, editing, and campaign design." },
    { index: "04", label: "Review", detail: "One structured, consolidated feedback pass." },
    { index: "05", label: "Final property-ready creative", detail: "Finished, formatted, and ready to publish." },
  ],
  // Ambient background video for this section — same treatment as
  // Dovetail's "arrival" cinematic beat (public/dovetail/index.html
  // .arrival): moody, mostly-dark, content layered on top via an overlay.
  ambientVideoSrc: "/archer-preview/motion/pendry-hotel-entrance-night.mp4",
  ambientSceneTag: "Archer Design reel — evening arrival",
};

export const EXPERIENCE_SYSTEM = {
  eyebrow: "The creative system",
  headline: "Built around how a hospitality portfolio actually operates.",
  body: "One property photograph can become a hero motion asset, a campaign visual, several resized adaptations, a story or reel cover, and a promotional graphic. Not unlimited work — a defined, repeatable system per experience type.",
  categories: [
    {
      title: "Hotels + Resorts",
      detail: "Rooms, arrivals, pools, packages, destination stories, local experiences.",
    },
    {
      title: "Restaurants + Bars",
      detail: "Menus, cocktails, chef stories, brunch, rooftop experiences, seasonal dining, private dining.",
    },
    {
      title: "Meetings + Weddings",
      detail: "Ballrooms, group sales, retreats, wedding spaces, holiday events, corporate gatherings.",
    },
    {
      title: "Spa + Wellness",
      detail: "Treatments, gift cards, seasonal wellness, spa interiors, restorative experiences.",
    },
    {
      title: "Golf + Outdoor Experiences",
      detail: "Courses, resort activities, destination recreation, seasonal travel.",
    },
    {
      title: "Residences + Lifestyle Collections",
      detail: "Longer stays, residence experiences, neighborhood stories — Outbound and Magnolia-style content.",
    },
  ],
  outputs: [
    "One hero motion asset",
    "One campaign visual",
    "Several resized adaptations",
    "One story/reel cover",
    "One promotional graphic",
  ],
  // Video strip beneath the outputs row.
  videoSrc: "/coral-tree/movies/lunch.mp4",
  sceneTag: "Archer Design reel — restaurant & dining",
};

export const GALLERY_LABEL = "Selected Archer Design hospitality motion studies and client work.";
export const GALLERY_DISCLAIMER =
  "Examples of Archer Design creative capability — not current CoralTree client work.";
export const GALLERY_MORE_WORK = {
  label: "See more work",
  href: "https://www.archerdesign.shop/social-media-work",
};

export type GalleryItem = {
  id: string;
  name: string;
  tag: string;
  /** Public path with real spaces/parens — encodeURI() is applied at render time. */
  srcPath: string;
  span: "wide" | "tall" | "square" | "full";
};

// Note: the dedicated clips supplied for this proposal (public/coral-tree/
// movies — hero background, book, Room, lunch, sunset) each already get
// their own full-bleed spotlight elsewhere on the page (hero, cinematic
// beat, split-intro, opportunity video strip, experience-system video
// strip). Lobby.mp4 was retired (quality) and is no longer used anywhere.
// Same convention Dovetail itself uses (its 5 signature reels each get one
// dedicated cinematic section; the work gallery uses separate, distinct
// footage rather than repeating them). Evening-arrival similarly moved to
// the differentiator section's ambient background.
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "arrival-experience", name: "Arrival experience", tag: "Property arrival, motion", srcPath: "/valencia/media/arrival-car.mp4", span: "wide" },
  { id: "exterior-day", name: "Exterior architecture", tag: "Property exterior, daylight", srcPath: "/valencia/media/george-exterior.mp4", span: "square" },
  { id: "in-room", name: "In-room ambiance", tag: "Room storytelling", srcPath: "/dovetail/media/03-guest-experience/experience.mp4", span: "tall" },
  { id: "bar-lounge", name: "Bar & lounge", tag: "F&B storytelling", srcPath: "/valencia/media/texican-bar.mp4", span: "square" },
  { id: "pool", name: "Pool experience", tag: "Resort recreation", srcPath: "/valencia/media/pool-experience.mp4", span: "wide" },
  { id: "seasonal", name: "Seasonal transformation", tag: "Seasonal campaign", srcPath: "/lark/media/06-seasonal/seasonal.mp4", span: "square" },
  // sunset.mp4 now lives in the split-intro section above (golden hour
  // destination shot) — kept out of the gallery to avoid repeating it.
  { id: "destination-sunset", name: "Destination sunset", tag: "Sense of place", srcPath: "/valencia/media/cielo-sunset.mp4", span: "square" },
  { id: "spa-wellness", name: "Spa & wellness", tag: "Restorative experience", srcPath: "/Work page/poolside.mp4", span: "tall" },
  {
    id: "weddings",
    name: "Weddings & celebrations",
    tag: "Events, motion",
    srcPath: "/Work page/Seedance 2_0 - Use the provided image as the exact source frame_ Preserve the composition_ the bride(1).mp4",
    span: "full",
  },
];

export const PROOF = {
  eyebrow: "Performance proof",
  headline: "Specialized creative. Measurable attention.",
  metrics: [
    { value: "14.8M+", label: "Impressions" },
    { value: "4.3M+", label: "Reach" },
    { value: "565K+", label: "Direct engagements" },
    { value: "670K+", label: "Reported post clicks" },
    { value: "2.5K+", label: "Creative pieces" },
  ],
  clients: [
    "Hotel Indigo Pittsburgh University–Oakland",
    "Hampton Inn Greensburg",
    "Hampton Inn Johnstown",
    "Eliza Hot Metal Bistro",
    "Elements Salon & Wellness",
  ],
  disclaimer:
    "Results reflect tracked hospitality campaigns and vary by property, audience, offer, platform, budget, and publishing strategy. Direct bookings are not claimed unless supported by attribution data. Brand names shown reflect relevant property-level experience and do not imply corporate endorsement.",
};

export const COST_CAPACITY = {
  eyebrow: "The capacity case",
  headline: "More specialized output without building five separate roles.",
  body: "A portfolio seeking consistent static design, motion, editing, campaign production, and property-level adaptations may otherwise need several employees, freelancers, or agencies. Archer Design consolidates that specialized creative production into one hospitality-focused relationship — lower overhead than building every specialty internally, scalable by property count and monthly volume, with centralized creative consistency, fewer handoffs, one structured review process, and more value from photography CoralTree already owns.",
  fragmented: {
    heading: "Traditional fragmented model",
    items: ["Designer", "Motion artist", "Editor", "Freelancers", "Multiple feedback chains"],
  },
  consolidated: {
    heading: "Archer Design model",
    items: ["One hospitality creative partner", "One monthly plan", "One review system", "Multiple creative disciplines"],
  },
};

export const ENTRY_POINT = {
  eyebrow: "Recommended entry point",
  headline: "Begin with a focused collection. Build the system. Scale with confidence.",
  body: "Rather than starting across all 70 properties, a controlled multi-property starting group lets the creative system prove itself before expanding further.",
  cluster: {
    heading: "5-property creative cluster",
    mix: [
      "One luxury resort",
      "One lifestyle or Magnolia hotel",
      "One restaurant-heavy property",
      "One wellness or golf destination",
      "One meetings or events-focused property",
    ],
  },
  deliverables: [
    "Monthly motion and campaign calendar",
    "Property-specific creative priorities",
    "Short-form motion assets",
    "Restaurant/event/wellness support",
    "Consolidated feedback",
    "Final organized exports",
    "Monthly creative recap",
  ],
  pricingNote: "Custom portfolio pricing based on participating properties, monthly volume, complexity, and service term.",
};

export const PERSONALIZED_NOTE = {
  heading: "Prepared for Genevieve Belou, CHSP",
  role: "Complex Director of Sales and Marketing",
  org: "CoralTree Hospitality / Magnolia Hotels",
  body: "Genevieve, Magnolia's historic city hotels, dining, meetings, celebrations, and local experiences are especially well suited to motion-led creative. This page illustrates how that capability could begin with Magnolia and expand wherever it creates value across CoralTree's wider collection.",
};

export const FINAL_CTA = {
  headline: "CoralTree already has the stories. Let's give them more ways to move.",
  body: "A focused creative partnership can help turn existing property assets, seasonal priorities, dining experiences, meetings, wellness, and destination stories into a stronger stream of finished campaign creative.",
  primaryLabel: "Discuss a CoralTree creative program",
  primaryHref: CTA_HREF,
  secondaryLabel: "View Archer Design",
  secondaryHref: "https://www.archerdesign.shop/social-media-work",
  // Ambient background video, same silky-abstract treatment (and literal
  // same asset) as Dovetail's own final-CTA section
  // (public/dovetail/index.html .cta video.cta-bg) — not property-specific,
  // just soft motion behind the closing call to action.
  videoSrc: "/dovetail/media/background-cloth.mp4",
};

// Small, curated set of OFFICIAL CoralTree reference images (not Archer
// creative work) — see public/coraltree/media/SOURCE_NOTES.txt for full
// source attribution. Used only as context/reference thumbnails.
export const REFERENCE_IMAGES = {
  magnoliaDenver: {
    src: "/coraltree/media/reference/magnolia-denver-exterior.webp",
    alt: "Magnolia Denver, a Tribute Portfolio Hotel — exterior (official CoralTree Hospitality photography, reference only)",
    caption: "Magnolia Denver — referenced from coraltreehospitality.com",
  },
  magnoliaStLouis: {
    src: "/coraltree/media/reference/magnolia-stlouis-lobby.webp",
    alt: "Magnolia St. Louis, a Tribute Portfolio Hotel — interior (official CoralTree Hospitality photography, reference only)",
    caption: "Magnolia St. Louis — referenced from coraltreehospitality.com",
  },
};
