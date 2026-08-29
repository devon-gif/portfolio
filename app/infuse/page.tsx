import type { Metadata } from "next";
import { InfuseShowcase } from "./InfuseShowcase";

// Private, personalized project overview prepared for Jaimie DeLeon
// (Executive Operations Director, Infuse Hospitality), following an
// introduction from Rachel Cimino. Never indexed, never linked from the
// main nav, sitemap (lib/seo.ts PUBLIC_PAGES intentionally omits this
// route), or footer. Accessible only via the direct URL. Same treatment as
// this project's other private proposal microsites (/dns, /jacaruso,
// /grant-hospitality, /tcrm) — see app/robots.ts and
// components/AppChrome.tsx (PUBLIC_PREFIXES) for the belt-and-suspenders
// noindex + full-bleed-chrome handling.
export const metadata: Metadata = {
  title: "Infuse Hospitality × Archer Design",
  description:
    "A private project overview prepared for Jaimie DeLeon at Infuse Hospitality.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function InfusePage() {
  return <InfuseShowcase />;
}
