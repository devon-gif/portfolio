// ─────────────────────────────────────────────────────────────────────────────
// Existing Archer Design client work shown on /first-hospitality.
// Media lives under public/ and is referenced by URL. Do not use node:fs/path
// existence checks here: Next/Vercel file tracing can pull the entire public
// directory into the route function bundle.
// ─────────────────────────────────────────────────────────────────────────────

import type { GallerySlide } from "./components/FirstHospitalityGallery";

export type ExistingWorkCategory = "hotels" | "fb" | "events" | "campaigns" | "motion";

export type ExistingWorkItem = {
  id: string;
  kind: "video" | "image";
  title: string;
  client: string;
  categories: ExistingWorkCategory[];
  src: string;
  poster?: string;
  width: number;
  height: number;
  alt: string;
  order: number;
  available: boolean;
  posterAvailable: boolean;
};

type ItemInput = Omit<ExistingWorkItem, "available" | "posterAvailable">;

const ITEMS_INPUT: ItemInput[] = [
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
  available: true,
  posterAvailable: Boolean(item.poster),
})).sort((a, b) => a.order - b.order);

export const EXISTING_WORK_FILTERS: { key: ExistingWorkCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hotels", label: "Hotels" },
  { key: "fb", label: "Food & Beverage" },
  { key: "events", label: "Events" },
  { key: "campaigns", label: "Campaigns" },
  { key: "motion", label: "Motion from Stills" },
];

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

export type BrandProofLogo = {
  src: string;
  alt: string;
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
  BRAND_PROOF_LOGOS_INPUT.map((logo) => ({ ...logo, available: true }));
