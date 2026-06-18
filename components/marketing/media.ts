// ─────────────────────────────────────────────────────────────────────────────
// MediaAssetMap - single source of truth for Archer Design marketing media.
// Videos are served from Supabase Storage (portfolio-videos bucket).
//
// URL resolution order:
//   1. NEXT_PUBLIC_SUPABASE_VIDEO_BASE_URL env var (set in Vercel + .env.local)
//   2. Hard-coded Supabase public URL as defense-in-depth fallback
//
// encodeURI preserves path separators while safely encoding spaces and
// special characters present in Seedance filenames.
// ─────────────────────────────────────────────────────────────────────────────

const VIDEO_BASE =
  process.env.NEXT_PUBLIC_SUPABASE_VIDEO_BASE_URL ??
  "https://wzqetwkldvrtgnohbbpi.supabase.co/storage/v1/object/public/portfolio-videos";

/** Build a public Supabase Storage URL for a video filename. */
export function videoUrl(filename: string): string {
  return `${VIDEO_BASE}/${encodeURI(filename)}`;
}

// Internal shorthand keeps asset() calls terse.
const v = videoUrl;
const img = (file: string) => `/${encodeURIComponent(file)}`;

export type Orientation = "landscape" | "portrait" | "square";

export interface VideoAsset {
  src: string;
  label: string;
  category: string;
  width: number;
  height: number;
  orientation: Orientation;
}

function orient(w: number, h: number): Orientation {
  const r = w / h;
  if (r > 1.15) return "landscape";
  if (r < 0.87) return "portrait";
  return "square";
}

function asset(file: string, label: string, category: string, width: number, height: number): VideoAsset {
  return { src: v(file), label, category, width, height, orientation: orient(width, height) };
}

// ── Ambient background loop (subtle, page-wide) ──────────────────────────────
export const SEEDANCE_BG = v(
  "Seedance 2_0 - A high-end_ cinematic ambient background loop_ Subtle_ slow-moving golden light beams.mp4"
);

// ── Hero rotation: premium landscape hotel/lobby/resort loops ────────────────
export const HERO_ROTATION: VideoAsset[] = [
  asset("hero.mp4", "Signature reel", "Hotel", 1920, 1080),
  asset("hotel entrance.mp4", "Hotel entrance", "Hotel", 1280, 720),
  asset("Seedance 2_0 - Static locked-off shot of a modern upscale hotel bar interior_ Preserve the exact com.mp4", "Upscale hotel bar", "Restaurant", 1280, 720),
  asset("Seedance 2_0 - Static locked-off shot of a luxury hotel bar interior_ preserving the exact compositi.mp4", "Luxury hotel bar", "Restaurant", 1280, 720),
  asset("Seedance 2_0 - Static locked-off balcony shot overlooking a wide mountain valley from a modern terra.mp4", "Mountain valley terrace", "Resort", 1280, 720),
  asset("Seedance 2_0 - A cinematic luxury hotel room timelapse transitioning from daytime into sunset and th.mp4", "Luxury room timelapse", "Hotel", 1280, 720),
  asset("Seedance 2_0 - Create an 8-second cinematic video from this exact image of the open-air lodge lounge.mp4", "Open-air lodge lounge", "Resort", 1280, 720),
  asset("Seedance 2_0 - Static locked-off camera shot of a luxury outdoor hotel pool with lounge chairs_ umbr.mp4", "Luxury pool", "Resort", 1280, 720),
  asset("Seedance 2_0 - have the lights fade on_ lamps and ceiling lights and the fire turn on.mp4", "Lobby, lit", "Hotel", 1280, 720),
];

// Back-compat single hero video.
export const HERO_VIDEO = v("hero.mp4");
export const HERO_VIDEO_CINEMATIC = v(
  "timelapse.mp4"
);
export const HERO_VIDEO_TIMELAPSE = v(
  "Seedance 2_0 - A cinematic luxury hotel room timelapse transitioning from daytime into sunset and th.mp4"
);

// ── Featured large motion video (cinematic landscape) ────────────────────────
export const FEATURED_MOTION: VideoAsset = asset(
  "Poolside.mp4",
  "Resort / poolside campaign",
  "Resort",
  1280,
  720
);

// ── Motion carousel: curated mix of orientations + categories ────────────────
export const MOTION_CAROUSEL: VideoAsset[] = [
  asset("Bartender.mp4", "Bar & cocktails", "Restaurant", 834, 1112),
  asset("Seedance 2_0 - Create an 8-second cinematic video from this exact image of the open-air lodge lounge.mp4", "Lodge lounge", "Hotel", 1280, 720),
  asset("Wedding.mp4", "Wedding & events", "Events", 834, 1112),
  asset("Seedance 2_0 - Static locked-off camera shot of a luxury outdoor hotel pool with lounge chairs_ umbr.mp4", "Poolside", "Resort", 1280, 720),
  asset("Seedance 2_0 - A cinematic close-up in a dark_ upscale bar setting_ Keep the exact framing and compo.mp4", "Upscale bar", "Restaurant", 834, 1112),
  asset("Beach.mp4", "Coastal & beach", "Resort", 1112, 834),
  asset("Seedance 2_0 - Create a cinematic half-circle orbit shot around the couple kissing in front of the e.mp4", "Couple, orbit shot", "Events", 834, 1112),
  asset("Seedance 2_0 - Use the provided image as the exact source frame_ Preserve the couple_ pose_ courtyar.mp4", "Courtyard couple", "Events", 834, 1112),
  asset("Seedance 2_0 - Use the first image as the starting frame and the second image as the ending frame_Cr.mp4", "Image-to-image transition", "Events", 1280, 720),
  asset("Seedance 2_0 - Create a smooth_ photorealistic timelapse transition from the first reference image t.mp4", "Photorealistic timelapse transition", "Seasonal", 1280, 720),
  asset("Seedance 2_0 - Create a smooth_ cinematic 10-second timelapse transition between the two reference i.mp4", "Cinematic timelapse transition", "Seasonal", 1280, 720),
  asset("Seedance 2_0 - bring this image to life_ static shot_ have the person be totally still_ have the win.mp4", "Suite, window light", "Hotel", 1280, 720),
  asset("Video 3.mp4", "Vertical social", "Social", 1248, 1664),
  asset("Seedance 2_0 - timelapse of fall to winter please.mp4", "Seasonal timelapse", "Seasonal", 1280, 720),
  asset("Seedance 2_0 - Use the provided champagne detail image as the exact source frame_ Preserve the Grand.mp4", "Champagne detail", "Events", 1112, 834),
  asset("Video 7.mp4", "Square social", "Social", 1440, 1440),
];

// ── Secondary video archive (kept for back-compat / lower-page use) ───────────
export const LIBRARY_VIDEOS = MOTION_CAROUSEL.map((a) => ({ src: a.src, label: a.label }));
export const FEATURED_VIDEOS = [
  { src: v("hotel entrance.mp4"), label: "Hotel storytelling" },
  { src: v("Poolside.mp4"), label: "Resort / poolside campaign" },
  { src: v("Bartender.mp4"), label: "Restaurant / bar promotion" },
  { src: v("Wedding.mp4"), label: "Wedding / event creative" },
] as const;

// ── Still images (gallery) - served from /public root ────────────────────────
export const GALLERY_IMAGES = [
  { src: img("Image 2.png"), alt: "Hospitality creative, hotel lobby", category: "Hotel" },
  { src: img("Image 3.png"), alt: "Hospitality creative, guest suite", category: "Hotel" },
  { src: img("Image 4.png"), alt: "Hospitality creative, spa & wellness", category: "Spa" },
  { src: img("Image 5.png"), alt: "Hospitality creative, events", category: "Events" },
  { src: img("Image 6.png"), alt: "Hospitality creative, seasonal campaign", category: "Seasonal" },
  { src: img("Image 7.png"), alt: "Hospitality creative, restaurant & F&B", category: "Restaurant" },
] as const;

// ── Promo Rescue hero image — curated, manually picked (no auto-dumping) ─────
// The hero card uses a strong static promo image rather than promo-video.mp4:
// that file turned out to be a generic personal demo reel (intro bumper +
// an unrelated past project), not Archer Design hospitality work, so it is
// not used anywhere on this page.
export const PROMO_RESCUE_HERO_IMAGE = {
  src: img("Image 2.png"),
  alt: 'Hotel Indigo Pittsburgh University-Oakland "Comfy Yet?" room and lobby promo collage',
};

// ── Real examples ─ curated, deduplicated promo creative (Promo Rescue) ─────
// Manually selected. Every entry below has been verified by hand to be real
// hospitality/restaurant/event promo work, with no headshots, no unrelated
// product photos, and no repeats. Do not auto-add files from /public here.
export const PROMO_RESCUE_EXAMPLES = [
  {
    src: img("Image 3.png"),
    alt: "Eliza Hot Metal Bistro wine and holiday season billboard promo",
  },
  {
    src: img("Image 4.png"),
    alt: "Hampton Inn flood festival promo flyer",
  },
  {
    src: img("Image 5.png"),
    alt: "Eliza Hot Metal Bistro burgers promo graphic, 15% off all burgers",
  },
  {
    src: img("Image 6.png"),
    alt: "Eliza Hot Metal Bistro live music November promo flyer",
  },
  {
    src: img("Image 7.png"),
    alt: "Eliza Hot Metal Bistro Take Out Wednesday promo graphic",
  },
  {
    src: img("Screenshot 2026-06-18 at 1.52.10 PM.png"),
    alt: "Hotel Indigo Pittsburgh University-Oakland Pitt football ticket giveaway promo",
  },
] as const;

// ── Motion examples (Promo Rescue) — only real, verified-playable clips ─────
// Each clip below was opened and confirmed to show real hospitality/F&B
// footage (not template intros or unrelated projects) before being added.
export const PROMO_RESCUE_MOTION_EXAMPLES = [
  { src: "/Poolside.mp4", alt: "Rooftop resort poolside loungers promo clip" },
  { src: "/pancakes.mp4", alt: "Restaurant pancakes plating promo clip" },
  { src: "/timelapse.mp4", alt: "Resort poolside cabins seasonal promo clip" },
] as const;

// ── Brand proof logo strip (clients/partners, shown smaller than gallery) ────
export const BRAND_PROOF_LOGOS = [
  { src: img("Hampton-Brand-Logo_TM_CMYK_Full-Color.png"), alt: "Hampton by Hilton brand logo" },
  {
    src: img("PITTSBURGH UNI-OAK_RGB_canvas_white_on_indigo_blue.png"),
    alt: "Hotel Indigo Pittsburgh University-Oakland logo",
  },
  { src: img("Elements Full logo- NO BACK GROUND.png"), alt: "Elements brand logo" },
] as const;

// ── Brand ────────────────────────────────────────────────────────────────────
export const GOLD_GRADIENT = "linear-gradient(135deg, #E8D7A2, #C9A44C, #8B6A21)";
