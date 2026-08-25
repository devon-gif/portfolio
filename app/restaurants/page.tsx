import type { Metadata } from "next";
import { JsonLd } from "@/components/marketing/JsonLd";
import { StudioSegment } from "@/components/marketing/StudioSegment";
import { HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";
import { serviceJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "Remote creative support for restaurants, hotel restaurants, and F&B teams. We turn existing food photography, menus, and event details into social graphics, short-form motion, menu promos, and seasonal campaign creative.";

export const metadata: Metadata = {
  title: "Restaurant & F&B Creative Support",
  description: DESCRIPTION,
  alternates: { canonical: "/restaurants" },
  openGraph: { title: "Restaurant & F&B Creative Support | Archer Design", description: DESCRIPTION, url: "/restaurants" },
};

const heroClips = [MOTION_CAROUSEL[0], HERO_ROTATION[2], MOTION_CAROUSEL[12], MOTION_CAROUSEL[15], HERO_ROTATION[3]].map(
  (v) => ({ src: v.src, label: v.label, tag: v.category }),
);

export default function RestaurantsPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "Restaurant & F&B Creative Support",
          description: DESCRIPTION,
          path: "/restaurants",
          serviceType: "Restaurant social media, menu, and campaign creative",
        })}
      />
      <StudioSegment
        active="restaurants"
        kicker="Restaurants & Bars"
        h1="Turn menus, dishes, and event nights into a feed that stays full."
        subhead="Archer Design is a remote hospitality creative studio that turns your existing food photography, menus, event details, and staff clips into polished social graphics, short-form motion, menu promos, and seasonal campaign creative — without pulling your team off the floor."
        heroClips={heroClips}
        intro="Restaurant and F&B teams are busy, and great dishes don't always make it online. We turn the content you already have into a steady, on-brand rhythm of creative your team can actually use."
        useCases={[
          { t: "Menu & dish features", d: "Menu launches, specials, and signature-dish creative that keeps offers visible and tables top of mind." },
          { t: "Seasonal campaigns", d: "Holidays, restaurant weeks, and limited-time offers built into a coordinated set of assets." },
          { t: "Events & private dining", d: "Live music, special nights, catering, and private-dining promos timed to your calendar." },
          { t: "Short-form motion", d: "Reels and food motion built from existing photos and quick clips — appetizing without a crew." },
          { t: "Bar & beverage program", d: "Cocktail features, happy hour, and beverage-program content that drives covers." },
          { t: "Google & local visibility", d: "Google Business and local campaign creative so nearby guests find you first." },
        ]}
        sendList={[
          "Existing food & drink photography",
          "Menus & specials",
          "Staff iPhone clips",
          "Event & private-dining details",
          "Seasonal offers",
          "Brand files & logos",
        ]}
        proof={[
          { value: "5.88M+", label: "Impressions (Eliza profile)" },
          { value: "323K+", label: "Engagements (Eliza)" },
          { value: "1.15M+", label: "Reach (Eliza)" },
          { value: "2.5K+", label: "Creative pieces / posts" },
        ]}
        ctaHeading="Let's make your menu work harder online."
        ctaBody="Send a restaurant link, a few photos, or your upcoming events and we'll take a practical look at where stronger creative could fill more tables."
      />
    </>
  );
}
