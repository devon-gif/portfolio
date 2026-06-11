import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Allura, Fraunces } from "next/font/google";
import { JsonLd } from "@/components/marketing/JsonLd";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import { GOLD_GRADIENT, MOTION_CAROUSEL, HERO_ROTATION } from "@/components/marketing/media";
import { CALENDLY_URL, LOGO_PATH, organizationJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "How Archer Design supports real hospitality clients, Hampton Inn Greensburg, Hotel Indigo Pittsburgh & Eliza, and Elements Salon & Wellness, with social graphics, short-form video, and approval-ready content.";

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

const fraunces = Fraunces({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const allura = Allura({
  variable: "--font-wordmark-script",
  subsets: ["latin"],
  weight: ["400"],
});

const CASE_STUDIES = [
  {
    name: "Hampton Inn Greensburg",
    logo: "/Hampton-Brand-Logo_TM_CMYK_Full-Color.png",
    logoAlt: "Hampton Inn by Hilton brand logo",
    category: "Select-service flag hotel",
    challenge:
      "A select-service Hilton flag with no creative person on property. Social posting was inconsistent, fell to whoever had a spare hour, and everything had to respect Hampton brand standards, which made one-off freelance help risky.",
    work: "Ongoing monthly creative built from the property's existing photography: feed graphics, local-market content, seasonal pushes, and short-form video, all produced brand-standard-aware so it clears review the first time. Captions included, delivered approval-ready for the property's scheduler.",
    outcome:
      "A feed that stays active through every season without adding anyone to payroll, and a GM team that reviews and approves instead of designing. The same model now extends to a second Hampton property in Johnstown.",
    video: HERO_ROTATION[1], // Hotel entrance
  },
  {
    name: "Hotel Indigo Pittsburgh & Eliza Hot Metal Bistro",
    logo: "/PITTSBURGH%20UNI-OAK_RGB_canvas_white_on_indigo_blue.png",
    logoAlt: "Hotel Indigo Pittsburgh logo",
    category: "Boutique flag hotel + restaurant",
    challenge:
      "A boutique IHG property with a strong identity and an on-site restaurant, Eliza Hot Metal Bistro, that each needed their own voice, rooms-and-neighborhood storytelling for the hotel, menu and specials promotion for the restaurant, with one stretched team behind both.",
    work: "Two coordinated content streams on one plan: boutique-styled hotel creative on one side, F&B promos for Eliza on the other, menu features, bar program content, and event pushes timed to the restaurant's calendar. Short-form video built from existing assets keeps both feeds moving.",
    outcome:
      "Hotel and restaurant each get a consistent, distinct presence without competing for the same internal bandwidth, and promos for Eliza ship while the special is still on the menu.",
    video: MOTION_CAROUSEL[0], // Bar & cocktails
  },
  {
    name: "Elements Salon & Wellness",
    logo: "/Elements%20Full%20logo-%20NO%20BACK%20GROUND.png",
    logoAlt: "Elements Salon & Wellness logo",
    category: "Salon, spa & wellness",
    challenge:
      "A wellness business whose brand depends on a calm, premium feel, exactly the aesthetic that's hardest to produce in spare moments between clients. Content needed to look serene and intentional, not rushed.",
    work: "A steady monthly stream of polished wellness creative: service features, seasonal promotions, and soft-motion content built from the studio's own imagery, with captions written in the brand's quieter voice.",
    outcome:
      "A presence that finally matches the in-person experience, produced without pulling the team off the floor, and a template for how Archer Design supports spa and wellness operators inside and outside hotels.",
    video: HERO_ROTATION[5], // Luxury room timelapse (calm motion)
  },
];

export default function CaseStudiesPage() {
  return (
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury min-h-screen bg-[#050505] text-[#F6F1E7]`}
    >
      <JsonLd data={organizationJsonLd()} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Archer Design home">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black">
              <Image src={LOGO_PATH} alt="Archer Design logo" fill sizes="40px" className="object-cover" />
            </div>
            <div className="wordmark-font text-[0.84rem]">
              <span className="text-[#F6F1E7]">Archer</span>
              <span className="text-[#C9A44C]">Design</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-[#A9A092]" aria-label="Main">
            <Link href="/packages" className="hidden hover:text-[#F6F1E7] sm:inline">Packages</Link>
            <Link
              href="/contact"
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Get 5 Free Sample Assets
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <section className="pt-16 md:pt-20">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Case Studies
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(30px,4.5vw,52px)] font-semibold leading-tight">
            Real properties, real workload taken off real teams.
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[#A9A092]">
            Across our hospitality clients, Archer Design creative has delivered 13.9M+ impressions,
            543K+ engagements, and 3.6M+ reach, all built from assets the properties already had.
            Here&apos;s what the work looks like client by client.
          </p>
        </section>

        <div className="mt-16 space-y-12">
          {CASE_STUDIES.map((cs) => (
            <article
              key={cs.name}
              className="overflow-hidden rounded-3xl border border-[rgba(201,164,76,0.16)] bg-[#0b0a08]"
              aria-label={`Case study: ${cs.name}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video w-full overflow-hidden bg-black lg:aspect-auto lg:min-h-[320px]">
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
                    <span className="rounded-full border border-[rgba(201,164,76,0.24)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#C9A44C]">
                      {cs.category}
                    </span>
                  </div>
                  <h2 className="mt-5 font-serif text-2xl font-semibold">{cs.name}</h2>
                  <dl className="mt-4 space-y-4 text-[14.5px] leading-relaxed text-[#A9A092]">
                    <div>
                      <dt className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#E8D7A2]">
                        The situation
                      </dt>
                      <dd className="mt-1">{cs.challenge}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#E8D7A2]">
                        The work
                      </dt>
                      <dd className="mt-1">{cs.work}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#E8D7A2]">
                        Where it landed
                      </dt>
                      <dd className="mt-1">{cs.outcome}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <section className="glass-card-strong mt-20 rounded-3xl p-9 text-center md:p-12">
          <h2 className="font-serif text-[clamp(24px,3.2vw,38px)] font-semibold leading-tight">
            Your property could be the next one here.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-[#A9A092]">
            Start the same way every client above did: send your existing photos and details, get 5
            finished assets back in 7 days, free, then decide.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Request a free trial <span aria-hidden>→</span>
            </Link>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] px-6 py-3 text-sm font-semibold text-[#E8D7A2]"
            >
              Book a 30-minute call
            </a>
          </div>
          <p className="mt-4 text-[13px] text-[#A9A092]/70">
            Or compare <Link href="/packages" className="text-[#E8D7A2] underline underline-offset-4">monthly packages</Link> first.
          </p>
        </section>
      </main>

      <footer className="border-t border-[rgba(201,164,76,0.1)] px-6 py-12 text-center text-[13px] text-[#A9A092]">
        <p className="space-x-4">
          <Link href="/" className="hover:text-[#F6F1E7]">Home</Link>
          <Link href="/packages" className="hover:text-[#F6F1E7]">Packages</Link>
          <Link href="/hospitality-creative-support" className="hover:text-[#F6F1E7]">Services</Link>
          <Link href="/contact" className="hover:text-[#F6F1E7]">Contact</Link>
        </p>
      </footer>
    </div>
  );
}
