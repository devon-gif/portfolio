// Hospitality brand logos shown beneath the hero on /revstudio. Assets are
// either reused from the HSC x Archer Design prospect page's logo strip
// (public/revenue-activation/logos/) or, for brands with no clean asset
// there yet, copied from the existing approved brand files already used on
// /social-media-work and /archer-preview into public/revstudio/logos/ —
// never AI-generated or hotlinked.
//
// `attribution` records which business's work the logo represents, so the
// strip never implies The Revstudio has worked with a brand it hasn't.
// Only Archer Design's property-level hospitality work is confirmed today.
// Confirmed Revstudio-attributed hotel brands can be appended here later;
// leave `approved: false` (and it will be excluded from the rendered
// strip) for anything not yet confirmed by Ghisela.
//
// Every logo renders as a plain white silhouette (see .rs-logos img in
// globals.css — a CSS `filter`, not a modification of the source files) so
// all seven read consistently on the dark background regardless of their
// native color, with no card/surface treatment needed.

export type HospitalityLogo = {
  name: string;
  src: string;
  alt: string;
  attribution: "archer" | "revstudio" | "shared";
  approved: boolean;
};

export const HOSPITALITY_LOGOS: HospitalityLogo[] = [
  {
    name: "Hampton by Hilton",
    src: "/revstudio/logos/hampton-by-hilton-full-color.png",
    alt: "Hampton by Hilton logo",
    attribution: "archer",
    approved: true,
  },
  {
    name: "Hotel Indigo",
    src: "/revenue-activation/logos/hotel-indigo-logo.svg",
    alt: "Hotel Indigo logo",
    attribution: "archer",
    approved: true,
  },
  {
    name: "Eliza Hot Metal Bistro",
    src: "/revstudio/logos/eliza-hot-metal-bistro-white.png",
    alt: "Eliza Hot Metal Bistro logo",
    attribution: "archer",
    approved: true,
  },
  {
    name: "Elements Salon & Wellness",
    src: "/revstudio/logos/elements-salon-wellness-full-color.png",
    alt: "Elements Salon & Wellness logo",
    attribution: "archer",
    approved: true,
  },
  {
    name: "IHG Hotels & Resorts",
    src: "/revenue-activation/logos/ihg-logo.png",
    alt: "IHG Hotels & Resorts logo",
    attribution: "archer",
    approved: true,
  },
  {
    name: "Hilton",
    src: "/revenue-activation/logos/hilton-worldwide-logo.svg",
    alt: "Hilton logo",
    attribution: "archer",
    approved: true,
  },
  {
    name: "Marriott International",
    src: "/revenue-activation/logos/marriott-international.svg",
    alt: "Marriott International logo",
    attribution: "archer",
    approved: true,
  },
];
