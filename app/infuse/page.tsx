import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Layers3,
  Megaphone,
  MonitorPlay,
  Palette,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { StudioHeader } from "@/components/marketing/StudioHeader";
import { fraunces } from "@/components/marketing/studioFont";

const TITLE = "Creative Support for Infuse Hospitality | Archer Design";
const DESCRIPTION =
  "A private creative support overview for Infuse Hospitality: social media management, campaign creative, menus, launches, motion, digital signage, web, and multi-concept marketing support from Archer Design.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/infuse" },
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/infuse" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const pub = (file: string) => `/${encodeURIComponent(file)}`;

const SERVICES = [
  {
    icon: CalendarDays,
    title: "Social media management",
    text: "Monthly content planning, captions, scheduling, publishing, campaign coordination, content repurposing, and practical reporting across individual concepts or selected locations.",
  },
  {
    icon: Palette,
    title: "Day-to-day creative",
    text: "Menus, flyers, digital signage, social assets, email graphics, event pieces, sales collateral, print-ready files, and the quick-turn requests that keep hospitality marketing moving.",
  },
  {
    icon: Megaphone,
    title: "Campaigns & activations",
    text: "Seasonal LTOs, new menus, tenant activations, events, catering pushes, holiday campaigns, openings, and localized promotions built to drive attention and participation.",
  },
  {
    icon: MonitorPlay,
    title: "Motion, reels & digital",
    text: "Short-form video, motion graphics, animated stills, digital display creative, paid-media assets, web graphics, and campaign landing pages when a static post is not enough.",
  },
  {
    icon: Layers3,
    title: "Multi-concept systems",
    text: "Reusable templates, brand-safe production systems, asset libraries, versioning, and request workflows that help multiple concepts stay distinct without slowing the team down.",
  },
  {
    icon: BarChart3,
    title: "Marketing support",
    text: "Campaign planning, channel recommendations, content calendars, creative testing, light performance review, and hands-on execution that complements Infuse's existing strategy and operations team.",
  },
] as const;

const PROOF = [
  { value: "18.6M+", label: "Tracked impressions" },
  { value: "4.9M+", label: "Reach" },
  { value: "612K+", label: "Engagements" },
  { value: "2.7K+", label: "Creative pieces" },
] as const;

const STATIC_WORK = [
  {
    src: pub("Image 5.png"),
    alt: "Eliza Hot Metal Bistro food and beverage campaign creative by Archer Design",
    label: "Eliza Hot Metal Bistro",
    type: "Restaurant · menus · events · social",
  },
  {
    src: pub("Image 2.png"),
    alt: "Hotel Indigo Pittsburgh hospitality campaign creative by Archer Design",
    label: "Hotel Indigo Pittsburgh",
    type: "Hotel · F&B · local campaigns",
  },
  {
    src: pub("Image 4.png"),
    alt: "Hampton Inn campaign creative by Archer Design",
    label: "Hampton Inn",
    type: "Ongoing property-level creative",
  },
] as const;

const FIRST_30 = [
  "Learn the current marketing queue, brand guardrails, priority concepts, and approval flow.",
  "Take pressure off the team immediately with a clearly defined quick-turn creative lane.",
  "Build or clean up the next 30 days of social, menu, event, and campaign production.",
  "Identify repeatable assets that can become templates without making every concept look the same.",
  "Create a simple rhythm for requests, approvals, publishing, and monthly performance review.",
] as const;

export default function InfusePage() {
  return (
    <div className={`${fraunces.variable} archer-studio relative min-h-screen bg-[#f6f1e8]`}>
      <StudioHeader />

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-14 lg:pb-24 lg:pt-20">
          <div className="pointer-events-none absolute -right-28 top-0 h-96 w-96 rounded-full bg-[#d6dfd3]/70 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#edc6aa]/45 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div>
              <span className="st-kicker">Prepared for Jaimie DeLeon · Infuse Hospitality</span>
              <h1 className="mt-5 max-w-3xl font-serif text-[clamp(42px,6.3vw,76px)] leading-[0.98] text-[var(--st-ink)]">
                Creative support built for the pace of hospitality.
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--st-ink-soft)]">
                Hi Jaimie — Rachel mentioned Infuse is navigating a transition on the marketing side. I put this together to show where I could plug in quickly: keeping day-to-day creative moving, supporting social and campaigns, and helping individual concepts stay polished without adding another layer for your team to manage.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#work" className="st-btn">
                  See selected work <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href="mailto:hello@archerdesign.shop?subject=Infuse%20Hospitality%20x%20Archer%20Design"
                  className="st-btn-ghost"
                >
                  Start a conversation
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-[var(--st-ink-muted)]">
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Hospitality-focused</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Remote + multi-concept capable</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Flexible embedded support</span>
              </div>
            </div>

            <div className="relative min-h-[470px] overflow-hidden rounded-[36px] bg-[#171b18] shadow-[0_36px_110px_rgba(29,39,33,0.2)]">
              <video
                src="/Bartender.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                aria-label="Hospitality motion work by Archer Design"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">Creative + motion + marketing execution</p>
                <h2 className="mt-3 max-w-md font-serif text-3xl leading-tight">An extension of the team, not another agency layer.</h2>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/8 bg-white/60 px-6 py-8">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
            {PROOF.map((item) => (
              <div key={item.label}>
                <div className="font-serif text-3xl text-[var(--st-ink)] sm:text-4xl">{item.value}</div>
                <div className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--st-ink-muted)]">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
              <div>
                <span className="st-kicker">Where I fit</span>
                <h2 className="mt-4 font-serif text-[clamp(32px,4.4vw,52px)] leading-[1.04] text-[var(--st-ink)]">
                  Infuse already knows hospitality. I add creative capacity.
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                  Infuse operates across cafés, restaurants, workplace dining, amenity spaces, catering, and custom concepts. That creates a steady stream of guest-facing work. My role would not be to reinvent your strategy — it would be to help the team execute it faster, more consistently, and with enough flexibility for each concept to retain its own personality.
                </p>
                <p className="mt-5 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                  I can work directly from existing brand systems and briefs, own selected channels or concepts, or serve as overflow creative during busy periods, launches, and team transitions.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {SERVICES.map((service) => {
                  const Icon = service.icon;
                  return (
                    <article key={service.title} className="rounded-[26px] border border-black/8 bg-white/80 p-6">
                      <Icon className="h-5 w-5 text-[#355246]" aria-hidden />
                      <h3 className="mt-4 font-serif text-2xl leading-tight text-[var(--st-ink)]">{service.title}</h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">{service.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="bg-[#1d2722] px-6 py-20 text-white lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d2bd9e]">Selected hospitality work</span>
              <h2 className="mt-4 font-serif text-[clamp(34px,4.6vw,54px)] leading-[1.04]">Restaurant, hotel, event, and guest-experience creative.</h2>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/68">
                I already work inside the same kind of environment Infuse manages: individual F&B concepts, branded hospitality properties, recurring seasonal campaigns, events, offers, and high-volume monthly content.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              <article className="overflow-hidden rounded-[28px] bg-black/25">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <video src="/Hopping%20Bar.mp4" autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">F&B motion</p>
                  <h3 className="mt-2 font-serif text-2xl">Turn a still asset into something guests stop for.</h3>
                </div>
              </article>

              <article className="overflow-hidden rounded-[28px] bg-black/25">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <video src="/tcrm/videos/champagne-detail.mp4" autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Campaign detail</p>
                  <h3 className="mt-2 font-serif text-2xl">Premium motion for menus, events, offers, and celebrations.</h3>
                </div>
              </article>

              <article className="overflow-hidden rounded-[28px] bg-black/25">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <video src="/tcrm/videos/courtyard-couple.mp4" autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Guest experience</p>
                  <h3 className="mt-2 font-serif text-2xl">Creative that sells the feeling, not just the feature.</h3>
                </div>
              </article>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {STATIC_WORK.map((item) => (
                <article key={item.label} className="overflow-hidden rounded-[26px] bg-white/6 ring-1 ring-white/10">
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl">{item.label}</h3>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.13em] text-white/45">{item.type}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div className="rounded-[32px] border border-black/8 bg-[#e8ede6] p-8 sm:p-10">
                <Sparkles className="h-6 w-6 text-[#355246]" aria-hidden />
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--st-ink-muted)]">One partner · many concepts</p>
                <h2 className="mt-3 font-serif text-[clamp(30px,4vw,46px)] leading-[1.05] text-[var(--st-ink)]">Consistency behind the scenes. Distinct brands out front.</h2>
                <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  The challenge with a multi-concept portfolio is not making one good graphic. It is keeping dozens of requests moving without every café, restaurant, lounge, or amenity brand beginning to look the same. I build repeatable production systems behind the scenes while respecting the identity of each concept.
                </p>
              </div>

              <div>
                <span className="st-kicker">A practical first 30 days</span>
                <h2 className="mt-4 font-serif text-[clamp(30px,4vw,46px)] leading-[1.05] text-[var(--st-ink)]">Start by removing pressure from the current team.</h2>
                <div className="mt-7 space-y-4">
                  {FIRST_30.map((item) => (
                    <div key={item} className="flex gap-4 rounded-[20px] border border-black/8 bg-white/70 p-5">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#355246] text-white">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </div>
                      <p className="text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 lg:pb-28">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[34px] bg-[#d97345] px-7 py-12 text-[#241d19] sm:px-10 lg:px-14 lg:py-16">
            <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/55">Jaimie, if it would help</p>
                <h2 className="mt-4 max-w-3xl font-serif text-[clamp(34px,5vw,58px)] leading-[1.02]">Send me one current project and I’ll show you how I’d approach it.</h2>
                <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-black/68">
                  Whether the immediate need is transition coverage, overflow design, social management, a campaign, or support for a few specific concepts, I can start narrow and expand only where it is useful.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href="mailto:hello@archerdesign.shop?subject=Infuse%20Hospitality%20x%20Archer%20Design"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#201b18] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Email Devon <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-black/20 px-6 py-3.5 text-sm font-semibold text-[#241d19] transition hover:bg-black/5"
                >
                  Full Archer Design site
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
