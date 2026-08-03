// ─────────────────────────────────────────────────────────────────────────────
// first-hospitality-existing-work.ts — real, already-produced Archer Design
// client work shown in the "Existing Archer Design Work" gallery on
// /first-hospitality. Every item below is real client creative (Hotel Indigo
// Pittsburgh University-Oakland, Eliza Hot Metal Bistro, Hampton Inn
// Johnstown, Hampton Inn Greensburg, plus unbranded F&B/hospitality motion),
// never the Oxford or First-Hospitality speculative concept work.
//
// Source files physically live under public/work-page/ (lowercase, hyphenated
// -- confirmed correct and already used by /social-media-work) and, for a
// handful of items, under public/"Work page/" (capitalized, literal space).
// That second folder is real and on disk, but components/marketing/media.ts
// and components/marketing/work-page-media.ts both reference several of
// these same source images/clips via bare public-root paths (e.g. "/Image
// 2.png", "/Poolside.mp4", "/Bartender.mp4") that do NOT exist at the public
// root in this project -- confirmed missing via direct filesystem check.
// That pre-existing path mismatch was not introduced here and is not fixed
// here (out of scope: /social-media-work and components/marketing/media.ts
// are not modified by this file), but this gallery does not reuse those
// broken root-level paths. Every src below points at the verified, real,
// on-disk location instead, so nothing in this gallery can render as a
// broken image or black video box.
//
// Poster frames for the 5 motion clips below were extracted directly from
// each real source clip via ffmpeg (public/first-hospitality/posters/
// existing-work/*.jpg), the same pre-extraction approach already used for
// the 5 custom First Hospitality concept clips in first-hospitality-media.ts,
// so the gallery filmstrip/dots never need to mount a second live <video>
// just to show a thumbnail.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import type { GallerySlide } from "./components/FirstHospitalityGallery";

export type ExistingWorkCategory = "hotels" | "fb" | "events" | "campaigns" | "motion";

export type ExistingWorkItem = {
  id: string;
  kind: "video" | "image";
  title: string;
  /** Real, verified client/property name. */
  client: string;
  categories: ExistingWorkCategory[];
  src: string;
  /** Poster frame -- required for video items, unused for image items. */
  poster?: string;
  width: number;
  height: number;
  alt: string;
  /** Explicit display order, independent of array position. */
  order: number;
  available: boolean;
  posterAvailable: boolean;
};

function fileExists(publicPath: string): boolean {
  try {
    const cleaned = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
    const fullPath = path.join(process.cwd(), "public", decodeURIComponent(cleaned));
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}

type ItemInput = Omit<ExistingWorkItem, "available" | "posterAvailable">;

const ITEMS_INPUT: ItemInput[] = [
  // ── Stills ──────────────────────────────────────────────────────────────
  {
    id: "indigo-room-collage",
    kind: "image",
    title: "Room & Suite Collage",
    client: "Hotel Indigo Pittsburgh, University-Oakland",
    categories: ["hotels"],
    src: "/Work%20page/Image%202.png",
    width: 1080,
    height: 1350,
    alt: "Hotel Indigo Pittsburgh University-Oakland room and lobby promo collage",
    order: 6,
  },
  {
    id: "indigo-wedding-room-block",
    kind: "image",
    title: "Wedding Room Block",
    client: "Hotel Indigo Pittsburgh, University-Oakland",
    categories: ["hotels", "events"],
    src: "/work-page/Screenshot%202026-07-14%20at%209.06.03%E2%80%AFAM.png",
    width: 1326,
    height: 1792,
    alt: "Hotel Indigo Pittsburgh University-Oakland wedding room block promo graphic",
    order: 7,
  },
  {
    id: "indigo-rooftop-party",
    kind: "image",
    title: "Rooftop Party, Live Band",
    client: "Hotel Indigo Pittsburgh, University-Oakland",
    categories: ["events", "campaigns"],
    src: "/work-page/Screenshot%202026-07-14%20at%209.07.04%E2%80%AFAM.png",
    width: 1336,
    height: 1782,
    alt: "Hotel Indigo Pittsburgh University-Oakland rooftop party promo graphic",
    order: 8,
  },
  {
    id: "indigo-250th-anniversary",
    kind: "image",
    title: "America's 250th Anniversary Campaign",
    client: "Hotel Indigo Pittsburgh, University-Oakland",
    categories: ["campaigns", "hotels"],
    src: "/work-page/Screenshot%202026-07-14%20at%209.05.09%E2%80%AFAM.png",
    width: 1328,
    height: 1778,
    alt: "Hotel Indigo Pittsburgh University-Oakland America's 250th Anniversary campaign graphic",
    order: 9,
  },
  {
    id: "hampton-johnstown-flood-festival",
    kind: "image",
    title: "Flood City Music Festival",
    client: "Hampton Inn Johnstown",
    categories: ["events", "campaigns", "hotels"],
    src: "/work-page/Screenshot%202026-07-14%20at%209.03.18%E2%80%AFAM.png",
    width: 1334,
    height: 1576,
    alt: "Hampton Inn Johnstown Flood City Music Festival promo graphic",
    order: 10,
  },
  {
    id: "hampton-greensburg-grid",
    kind: "image",
    title: "Instagram Grid",
    client: "Hampton Inn Greensburg",
    categories: ["hotels"],
    src: "/work-page/Screenshot%202026-07-14%20at%209.49.55%E2%80%AFAM.png",
    width: 3032,
    height: 2202,
    alt: "Hampton Inn Greensburg Instagram grid layout",
    order: 11,
  },
  {
    id: "eliza-burgers-poster",
    kind: "image",
    title: "Burgers Promo",
    client: "Eliza Hot Metal Bistro",
    categories: ["fb"],
    src: "/Work%20page/Image%205.png",
    width: 1424,
    height: 1998,
    alt: "Eliza Hot Metal Bistro burgers promo graphic, 15% off all burgers",
    order: 12,
  },

  // ── Motion ──────────────────────────────────────────────────────────────
  {
    id: "hotel-arrival-vintage-car",
    kind: "video",
    title: "Hotel Arrival, Vintage Car",
    client: "Hospitality motion library",
    categories: ["hotels", "motion"],
    src: "/work-page/Seedance%202_0%20-%20Use%20the%20uploaded%20hotel%20exterior%20images%20as%20the%20visual%20reference%20and%20keep%20the%20building.mp4",
    poster: "/first-hospitality/posters/existing-work/hotel-arrival-vintage-car.jpg",
    width: 1664,
    height: 1248,
    alt: "Hotel exterior arrival motion, vintage car passing entrance",
    order: 1,
  },
  {
    id: "poolside-lounge",
    kind: "video",
    title: "Poolside Lounge",
    client: "Hospitality motion library",
    categories: ["hotels", "motion"],
    src: "/Work%20page/poolside.mp4",
    poster: "/first-hospitality/posters/existing-work/poolside-lounge.jpg",
    width: 1280,
    height: 720,
    alt: "Rooftop pool loungers and umbrellas motion clip",
    order: 2,
  },
  {
    id: "bar-cocktails",
    kind: "video",
    title: "Bar & Cocktails",
    client: "Food & beverage motion library",
    categories: ["fb", "motion"],
    src: "/Work%20page/Bartender.mp4",
    poster: "/first-hospitality/posters/existing-work/bar-cocktails.jpg",
    width: 834,
    height: 1112,
    alt: "Bartender finishing a cocktail with a citrus twist, close-up motion clip",
    order: 3,
  },
  {
    id: "champagne-detail",
    kind: "video",
    title: "Champagne Detail",
    client: "Events motion library",
    categories: ["events", "motion"],
    src: "/work-page/Seedance%202_0%20-%20Use%20the%20provided%20champagne%20detail%20image%20as%20the%20exact%20source%20frame_%20Preserve%20the%20Grand.mp4",
    poster: "/first-hospitality/posters/existing-work/champagne-detail.jpg",
    width: 1112,
    height: 834,
    alt: "Champagne pour detail motion clip for event promotion",
    order: 4,
  },
  {
    id: "elegant-hospitality-moment",
    kind: "video",
    title: "Elegant Hospitality Moment",
    client: "Hospitality motion library",
    categories: ["hotels", "motion"],
    src: "/work-page/Seedance%202_0%20-%20Use%20the%20provided%20image%20as%20the%20exact%20source%20frame_%20Create%20an%208-second%20elegant%20hospital.mp4",
    poster: "/first-hospitality/posters/existing-work/elegant-hospitality-moment.jpg",
    width: 1280,
    height: 720,
    alt: "Elegant hospitality moment, ambient motion clip",
    order: 5,
  },
];

export const EXISTING_WORK_ITEMS: ExistingWorkItem[] = ITEMS_INPUT.map((item) => ({
  ...item,
  available: fileExists(item.src),
  posterAvailable: item.poster ? fileExists(item.poster) : false,
})).sort((a, b) => a.order - b.order);

export const EXISTING_WORK_FILTERS: { key: ExistingWorkCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hotels", label: "Hotels" },
  { key: "fb", label: "Food & Beverage" },
  { key: "events", label: "Events" },
  { key: "campaigns", label: "Campaigns" },
  { key: "motion", label: "Motion from Stills" },
];

/** Adapted into the shared FirstHospitalityGallery slide shape for the "Existing Archer Design Work" slideshow. */
export const EXISTING_WORK_SLIDES: GallerySlide[] = EXISTING_WORK_ITEMS.map((item) => ({
  id: item.id,
  kind: item.kind,
  title: item.title,
  subtitle: item.client,
  categories: item.categories,
  src: item.src,
  poster: item.poster,
  width: item.width,
  height: item.height,
  alt: item.alt,
  available: item.available,
  posterAvailable: item.posterAvailable,
  order: item.order,
}));

// ── Brand proof logo strip ───────────────────────────────────────────────
// Full 7-brand set Devon asked to match from archerdesign.shop's own logo
// strip, sourced from real on-disk brand assets (verified below), and kept
// local to /first-hospitality rather than added to the shared
// components/marketing/media.ts BRAND_PROOF_LOGOS (which /social-media-work
// and /promo-rescue also render) -- so this change can never affect those
// other pages.
//
// Each logo file is either an opaque/color mark on a light or transparent
// ground ("light" tone -- reads correctly on a pale chip) or a white mark on
// a transparent ground ("dark" tone -- needs a dark chip, or it's invisible).
// Verified per-file via a pixel-alpha/color check before wiring in, so
// nothing here can render as a blank or illegible logo.
export type BrandProofLogo = {
  src: string;
  alt: string;
  /** "light" = color/black mark, needs a pale chip. "dark" = white mark, needs a dark chip. */
  tone: "light" | "dark";
};

const BRAND_PROOF_LOGOS_INPUT: BrandProofLogo[] = [
  { src: "/Hampton-Brand-Logo_TM_CMYK_Full-Color.png", alt: "Hampton by Hilton brand logo", tone: "light" },
  { src: "/archer-preview/logos/ihg-logo.png", alt: "IHG Hotels & Resorts brand logo", tone: "light" },
  {
    src: "/dovetail/logos/PITTSBURGH%20UNI-OAK_RGB_canvas_white_no_background.png",
    alt: "Hotel Indigo Pittsburgh University-Oakland logo",
    tone: "dark",
  },
  { src: "/archer-preview/logos/ELIZA%20LOGO%20UPDATE%20WHITE.png", alt: "Eliza Hot Metal Bistro logo", tone: "dark" },
  { src: "/Elements%20Full%20logo-%20NO%20BACK%20GROUND.png", alt: "Elements Salon & Wellness Spa brand logo", tone: "light" },
  { src: "/archer-preview/logos/rev.png", alt: "Revest Properties brand logo", tone: "light" },
  { src: "/archer-preview/logos/PRIMARY-1.png", alt: "Vigilant Travel brand logo", tone: "dark" },
];

export const FIRST_HOSPITALITY_PROOF_LOGOS: (BrandProofLogo & { available: boolean })[] =
  BRAND_PROOF_LOGOS_INPUT.map((logo) => ({ ...logo, available: fileExists(logo.src) }));
