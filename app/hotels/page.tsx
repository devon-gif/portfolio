import type { Metadata } from "next";
import { JsonLd } from "@/components/marketing/JsonLd";
import { StudioSegment } from "@/components/marketing/StudioSegment";
import { HERO_ROTATION } from "@/components/marketing/media";
import { serviceJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "Remote hospitality creative for hotels, resorts, and multi-property groups. We turn your existing property photos, room and amenity shots, and staff clips into social graphics, short-form motion, campaign visuals, and booking-support creative.";

export const metadata: Metadata = {
  title: "Hotel & Resort Creative Support",
  description: DESCRIPTION,
  alternates: { canonical: "/hotels" },
  openGraph: { title: "Hotel & Resort Creative Support | Archer Design", description: DESCRIPTION, url: "/hotels" },
};

const heroClips = [HERO_ROTATION[0], HERO_ROTATION[8], HERO_ROTATION[7], HERO_ROTATION[5], HERO_ROTATION[4]].map(
  (v) => ({ src: v.src, label: v.label, tag: v.category }),
);

export default function HotelsPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "Hotel & Resort Creative Support",
          description: DESCRIPTION,
          path: "/hotels",
          serviceType: "Hotel social media, video, and campaign creative",
        })}
      />
      <StudioSegment
        active="hotels"
        kicker="Hotels & Resorts"
        h1="Your hotel already has the photos. We turn them into campaigns."
        subhead="Archer Design is a remote hospitality creative studio that transforms your existing property assets — room and lobby photos, amenity shots, and staff iPhone clips — into polished social graphics, short-form motion, campaign visuals, and booking-support creative, without adding in-house overhead."
        heroClips={heroClips}
        intro="Most properties already paid for professional photography. After the shoot, those assets go quiet. We help them keep working — month after month, on-brand, and approval-ready for your scheduler."
        useCases={[
          { t: "Rooms & amenities", d: "Room, suite, lobby, pool, and amenity creative that keeps the feed active between shoots." },
          { t: "Seasonal & local campaigns", d: "Holidays, local events, and limited-time offers turned into a coordinated set of ready-to-post assets." },
          { t: "Booking-support visuals", d: "Direct-booking creative, sales decks, and email / Google / Facebook assets for group and leisure demand." },
          { t: "Short-form motion", d: "Reels and campaign video built from existing stills and clips — polished motion without a production day." },
          { t: "Multi-property groups", d: "Consistent, scalable creative across a portfolio — one studio keeping every property on-brand." },
          { t: "Meetings & events", d: "Event recaps, venue promos, and sales-ready visuals for group business and private functions." },
        ]}
        sendList={[
          "Past professional property photos",
          "Room, lobby & amenity shots",
          "Staff iPhone clips",
          "Property links & brand files",
          "Seasonal offers & event details",
          "Campaign ideas",
        ]}
        proof={[
          { value: "14.8M+", label: "Tracked impressions" },
          { value: "4.3M+", label: "Reach" },
          { value: "565K+", label: "Engagements" },
          { value: "2.5K+", label: "Creative pieces / posts" },
        ]}
        ctaHeading="See what your property's assets could become."
        ctaBody="Send a property link and we'll take a practical look at where stronger creative could support bookings, social, and sales — for one property or a whole group."
      />
    </>
  );
}
