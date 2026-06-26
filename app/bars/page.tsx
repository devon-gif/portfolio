import type { Metadata } from "next";
import { JsonLd } from "@/components/marketing/JsonLd";
import { StudioSegment } from "@/components/marketing/StudioSegment";
import { HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";
import { serviceJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "Remote creative support for bars, hotel bars, and lounges. We turn cocktail photography, event nights, and staff clips into social graphics, short-form motion, and event promos that keep the room full.";

export const metadata: Metadata = {
  title: "Bar & Lounge Creative Support",
  description: DESCRIPTION,
  alternates: { canonical: "/bars" },
  openGraph: { title: "Bar & Lounge Creative Support | Archer Design", description: DESCRIPTION, url: "/bars" },
};

const heroClips = [HERO_ROTATION[2], MOTION_CAROUSEL[4], MOTION_CAROUSEL[0], HERO_ROTATION[3], MOTION_CAROUSEL[14]].map(
  (v) => ({ src: v.src, label: v.label, tag: v.category }),
);

export default function BarsPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "Bar & Lounge Creative Support",
          description: DESCRIPTION,
          path: "/bars",
          serviceType: "Bar social media, event, and campaign creative",
        })}
      />
      <StudioSegment
        active="bars"
        kicker="Bars & Lounges"
        h1="Cocktails, events, and late nights — turned into scroll-stopping social."
        subhead="Archer Design is a remote hospitality creative studio that turns your existing cocktail photography, event nights, and staff clips into polished social graphics, short-form motion, and event promos — so the room stays full without anyone behind the bar becoming a content team."
        heroClips={heroClips}
        intro="The energy of a great bar rarely makes it online. We take the photos and clips you already have and turn them into a consistent, on-brand rhythm of creative that pulls people in."
        useCases={[
          { t: "Cocktail & menu features", d: "Signature cocktails, seasonal menus, and beverage-program creative built to be shared." },
          { t: "Events & live music", d: "DJ nights, live music, watch parties, and special events promoted on a timely cadence." },
          { t: "Happy hour & specials", d: "Recurring specials and limited-time offers turned into a steady set of ready-to-post assets." },
          { t: "Short-form motion", d: "Reels and atmosphere motion built from quick clips — the vibe, without a production crew." },
          { t: "Hotel & rooftop bars", d: "Coordinated creative that fits the property's brand while giving the bar its own voice." },
          { t: "Local visibility", d: "Google Business and local campaign creative so nearby guests choose your room first." },
        ]}
        sendList={[
          "Cocktail & interior photography",
          "Event & live-music details",
          "Staff iPhone clips",
          "Menus & specials",
          "Seasonal offers",
          "Brand files & logos",
        ]}
        proof={[
          { value: "14.8M+", label: "Tracked impressions" },
          { value: "565K+", label: "Engagements" },
          { value: "4.3M+", label: "Reach" },
          { value: "2.5K+", label: "Creative pieces / posts" },
        ]}
        ctaHeading="Let's keep your room full."
        ctaBody="Send a bar link, a few photos, or your event lineup and we'll take a practical look at where stronger creative could pull in more guests."
      />
    </>
  );
}
