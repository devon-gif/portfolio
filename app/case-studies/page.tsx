import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/marketing/JsonLd";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import { StudioHeader } from "@/components/marketing/StudioHeader";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { StudioCTA } from "@/components/marketing/StudioCTA";
import { fraunces } from "@/components/marketing/studioFont";
import { MOTION_CAROUSEL, HERO_ROTATION } from "@/components/marketing/media";
import { organizationJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "How Archer Design supports real hospitality clients — Hampton Inn Greensburg, Hotel Indigo Pittsburgh & Eliza, and Elements Salon & Wellness — with social graphics, short-form video, and approval-ready content built from existing assets.";

export const metadata: Metadata = {
  title: "Hospitality Client Case Studies",
  description: DESCRIPTION,
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Hospitality Client Case Studies | Archer Design",
    description: DESCRIPTION,
    url: "/case-studies",
  },
};

// Safe attribution: "helped generate", "supported", "created measurable attention around."
// No direct booking or revenue claims. Booking attribution notes added where relevant.
const CASE_STUDIES = [
  {
    name: "Hampton Inn Greensburg",
    logo: "/Hampton-Brand-Logo_TM_CMYK_Full-Color.png",
    logoAlt: "Hampton Inn by Hilton brand logo",
    category: "Select-service flag hotel",
    challenge:
      "A select-service Hilton flag with no creative person on property. Social posting was inconsistent, fell to whoever had a spare hour, and everything had to respect Hampton brand standards, which made one-off freelance help risky.",
    work: "Ongoing monthly creative built from the property's existing assets: feed graphics, local-market content, seasonal pushes, and short-form video, all produced brand-standard-aware so it clears review the first time. Captions included, delivered approval-ready for the property's scheduler.",
    outcome:
      "338 posts tracked across the Hampton Greensburg profile. Creative helped generate 3.24M impressions, 78.3K direct engagements, and 734K reach. The same monthly workflow now extends to a second Hampton property in Johnstown. The GM team reviews and approves instead of designing.",
    video: HERO_ROTATION[1], // Hotel entrance
  },
  {
    name: "Hotel Indigo Pittsburgh",
    logo: "/PITTSBURGH%20UNI-OAK_RGB_canvas_white_on_indigo_blue.png",
    logoAlt: "Hotel Indigo Pittsburgh logo",
    category: "Boutique flag hotel + restaurant",
    challenge:
      "A boutique IHG property with a strong identity and an on-site restaurant, Eliza Hot Metal Bistro, that each needed their own voice: rooms-and-neighborhood storytelling for the hotel, menu and specials promotion for the restaurant, with one stretched team behind both.",
    work: "Two coordinated content streams on one plan: boutique-styled hotel creative on one side, F&B promos for Eliza on the other, menu features, bar program content, and event pushes timed to the restaurant's calendar. Short-form video built from existing assets keeps both feeds moving.",
    outcome:
      "408 posts tracked across the Hotel Indigo Pittsburgh profile. Creative supported 1.91M impressions, 54.7K direct engagements, and 210K reach. Hotel and restaurant each maintain a consistent, distinct presence without competing for the same internal bandwidth.",
    video: MOTION_CAROUSEL[0], // Bar & cocktails
  },
  {
    name: "Eliza PGH / Eliza Hot Metal Bistro",
    logo: "/PITTSBURGH%20UNI-OAK_RGB_canvas_white_on_indigo_blue.png",
    logoAlt: "Eliza Hot Metal Bistro logo",
    category: "Restaurant, F&B & event creative",
    challenge:
      "An on-site restaurant with a strong local identity, active events calendar, and seasonal specials that needed consistent creative output without adding another person to the team or waiting on hotel-side marketing cycles.",
    work: "F&B promos, seasonal campaigns, event creative, bar program content, and community-focused posts built from the restaurant's own imagery and calendar. Campaign highlights included a Halloween campaign, Snowflake campaign, and family experience events like Breakfast with Stitch.",
    outcome:
      "444 posts tracked across the Eliza PGH profile. Creative helped generate 5.88M impressions, 323K direct engagements, and 1.15M reach. The Halloween campaign alone drove 22.7K engagements and 193.7K reach. The Snowflake campaign drove 19.8K engagements and 56.8K reach.",
    video: MOTION_CAROUSEL[0], // Bar & cocktails
  },
  {
    name: "Elements Salon & Wellness",
    logo: "/Elements%20Full%20logo-%20NO%20BACK%20GROUND.png",
    logoAlt: "Elements Salon & Wellness logo",
    category: "Salon, spa & wellness",
    challenge:
      "A wellness business whose brand depends on a calm, premium feel, exactly the aesthetic that's hardest to produce in spare moments between clients. The opening campaign and ongoing creative needed to look serene and intentional, not rushed.",
    work: "A steady monthly stream of polished wellness creative: service features, seasonal promotions, and soft-motion content built from the studio's own imagery, with captions written in the brand's quieter voice. Opening campaign creative helped introduce the brand to local audiences.",
    outcome:
      "165 posts tracked across the Elements Salon & Wellness profile. Creative helped generate 3.26M impressions, 87.9K direct engagements, and 2.17M reach. The opening campaign alone drove 14K engagements and 50.9K reach, supporting strong local awareness for the new location.",
    video: HERO_ROTATION[5], // Luxury room timelapse (calm motion)
  },
];

export default function CaseStudiesPage() {
  return (
    <div className={`${fraunces.variable} archer-studio min-h-screen`}>
      <JsonLd data={organizationJsonLd()} />
      <StudioHeader active="work" />

      <main className="mx-auto max-w-5xl px-6 pb-8">
        <section className="pt-16 md:pt-20">
          <span className="st-kicker">Case studies</span>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(30px,4.5vw,52px)] leading-[1.06] text-[var(--st-ink)]">
            Real properties. Real workload taken off real teams.
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
            Across tracked hotel, restaurant, event, and wellness profiles, Archer
            Design creative has helped generate 14.8M+ impressions, 565K+ direct
            engagements, and 4.3M+ reach to date. Here&apos;s what the work looks like
            property by property.
          </p>
        </section>

        <div className="mt-14 space-y-10">
          {CASE_STUDIES.map((cs) => (
            <article
              key={cs.name}
              className="st-card overflow-hidden"
              aria-label={`Case study: ${cs.name}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video w-full overflow-hidden bg-[var(--st-sand)] lg:aspect-auto lg:min-h-[340px]">
                  <LazyVideo
                    src={cs.video.src}
                    label={`${cs.name} example creative`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-7 md:p-9">
                  <div className="flex items-center gap-4">
                    <Image
                      src={cs.logo}
                      alt={cs.logoAlt}
                      width={120}
                      height={40}
                      className="h-9 w-auto object-contain"
                    />
                    <span className="rounded-full border border-[var(--st-line)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--st-gold)]">
                      {cs.category}
                    </span>
                  </div>
                  <h2 className="mt-5 font-serif text-[26px] text-[var(--st-ink)]">{cs.name}</h2>
                  <dl className="mt-4 space-y-4 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                    <div>
                      <dt className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--st-ink-muted)]">
                        The situation
                      </dt>
                      <dd className="mt-1">{cs.challenge}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--st-ink-muted)]">
                        The work
                      </dt>
                      <dd className="mt-1">{cs.work}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--st-ink-muted)]">
                        Results
                      </dt>
                      <dd className="mt-1">{cs.outcome}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-[11px] text-[var(--st-ink-muted)]">
                    Metrics sourced from SHAIPE-tracked profile data, reflecting impressions, reach, and engagement. Direct booking attribution depends on property-level tracking setup and is not claimed above.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <StudioCTA
        heading="Your property could be the next one here."
        body="Start with a focused single- or multi-property pilot. Send your existing assets, campaign details, or event notes, and we'll show you what the work looks like before any longer commitment."
        primaryLabel="Request a pilot"
      />

      <StudioFooter />
    </div>
  );
}
