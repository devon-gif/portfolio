import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  Check,
  GraduationCap,
  Handshake,
  Hotel,
  Layers3,
  MonitorPlay,
  Sparkles,
  UsersRound,
  Workflow,
} from "lucide-react";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { StudioHeader } from "@/components/marketing/StudioHeader";
import { fraunces } from "@/components/marketing/studioFont";
import { ReferralForm } from "./ReferralForm";

const TITLE = "Devon Archer | Hospitality Creative Referral Guide";
const DESCRIPTION =
  "A referral guide for Devon Archer and Archer Design: hospitality creative, motion, web, digital implementation, credentials, selected work, and how to make an introduction.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/referral" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/referral" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const pub = (file: string) => `/${encodeURIComponent(file)}`;

const PROOF = [
  { value: "18.6M+", label: "Tracked impressions" },
  { value: "4.9M+", label: "Reach" },
  { value: "612K+", label: "Engagements" },
  { value: "2.7K+", label: "Creative pieces" },
] as const;

const EDUCATION = [
  { degree: "M.S. UX Design", school: "Full Sail University" },
  { degree: "B.S. UX/UI Design", school: "Full Sail University" },
  { degree: "Graphic Design Certificate", school: "California Institute of the Arts" },
] as const;

const EXPERIENCE = [
  {
    role: "Founder — Archer Design",
    years: "2021–Present",
    text: "Hospitality-focused creative, motion, campaign systems, websites, landing pages, and AI-assisted digital implementation for hotels, restaurants, wellness, events, and local-demand brands.",
  },
  {
    role: "Graphic Designer & Client-Facing Operator — Shaipe Agency",
    years: "2021–2025",
    text: "Multi-account digital design, campaign visuals, brand assets, social creative, and direct client collaboration from brief through final delivery.",
  },
  {
    role: "Co-Founder, Growth Systems & Product Positioning — JobGhost",
    years: "2025–2026",
    text: "Product positioning, candidate communication workflows, outreach systems, growth experiments, and AI-assisted product thinking for a recruiting-focused SaaS concept.",
  },
] as const;

const STATIC_WORK = [
  {
    src: pub("Image 2.png"),
    alt: "Hotel Indigo Pittsburgh campaign work by Archer Design",
    label: "Hotel Indigo Pittsburgh",
    type: "Hotel campaign creative",
  },
  {
    src: pub("Image 5.png"),
    alt: "Eliza Hot Metal Bistro food and beverage promotion by Archer Design",
    label: "Eliza Hot Metal Bistro",
    type: "F&B campaign",
  },
  {
    src: pub("Image 4.png"),
    alt: "Hampton Inn local event campaign by Archer Design",
    label: "Hampton Inn",
    type: "Local-demand campaign",
  },
  {
    src: pub("Image 6.png"),
    alt: "Live music event promotion by Archer Design",
    label: "Hospitality events",
    type: "Event creative",
  },
] as const;

const MOTION_WORK = [
  {
    src: "/tcrm/videos/luxury-hotel-entrance-night-concept.mp4",
    label: "Luxury hotel arrival",
    type: "Hospitality motion",
  },
  {
    src: "/tcrm/videos/courtyard-couple.mp4",
    label: "Guest experience",
    type: "Lifestyle motion",
  },
  {
    src: "/tcrm/videos/champagne-detail.mp4",
    label: "F&B / celebration",
    type: "Detail animation",
  },
  {
    src: "/tcrm/videos/bridal-portrait-alt-cut.mp4",
    label: "Weddings & events",
    type: "Event motion",
  },
] as const;

const FITS = [
  {
    icon: Hotel,
    title: "Hotels & hotel groups",
    text: "Boutique, lifestyle, select-service, resort, and multi-property operators that need stronger property-level creative without another full-time hire.",
  },
  {
    icon: Layers3,
    title: "F&B, events, meetings & spas",
    text: "Restaurants, bars, private dining, weddings, meetings, seasonal offers, spa services, and the revenue moments property teams need to keep promoting.",
  },
  {
    icon: Handshake,
    title: "Consultants & agencies",
    text: "Hospitality consultants, fractional leaders, revenue partners, and agencies that need a reliable creative execution arm or white-label production partner.",
  },
  {
    icon: Workflow,
    title: "AI-enabled implementation",
    text: "Creative workflows, dashboards, landing pages, product prototypes, and AI-assisted systems when a hospitality client needs implementation—not another generic tool.",
  },
] as const;

const REFERRAL_TRIGGERS = [
  "The hotel looks better in person than it does online.",
  "Internal screens, lobby displays, or guest touchpoints are blank or underused.",
  "F&B, events, meetings, weddings, packages, or spa offers are not being promoted consistently.",
  "The sales team has weak, outdated, or inconsistent visual collateral.",
  "A small marketing team has plenty to promote but not enough production bandwidth.",
  "A repositioning, service improvement, or operational change needs a guest-facing campaign layer.",
  "The property needs motion, short-form video, landing pages, or better digital presentation from existing assets.",
  "AI-generated creative is being used, but it still needs professional art direction and finishing.",
] as const;

export default function ReferralPage() {
  return (
    <div className={`${fraunces.variable} archer-studio relative min-h-screen`}>
      <StudioHeader />

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-16 lg:pb-24 lg:pt-24">
          <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#e8ddd0]/55 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#dce6e1]/55 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div>
              <span className="st-kicker">Referral guide · Devon Archer</span>
              <h1 className="mt-5 max-w-3xl font-serif text-[clamp(38px,5.6vw,68px)] leading-[1.01] text-[var(--st-ink)]">
                The creative partner to call when a hospitality opportunity needs to look as good as it should feel.
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--st-ink-soft)]">
                I’m Devon Archer, founder of Archer Design. I help hotels, restaurants, resorts, spas, hospitality groups, and consulting partners turn business priorities into polished motion, campaign creative, digital experiences, websites, and guest-facing assets.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#refer" className="st-btn">
                  Make an introduction <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href="#work" className="st-btn-ghost">See selected work</a>
                <Link href="/" className="st-btn-ghost">Full Archer Design site</Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-[var(--st-ink-muted)]">
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Hospitality-focused</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Remote + multi-property capable</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Referral-friendly</span>
              </div>
            </div>

            <div className="relative min-h-[440px] overflow-hidden rounded-[34px] bg-[#191916] shadow-[0_35px_100px_rgba(25,25,20,0.18)]">
              <video
                src="/tcrm/videos/luxury-hotel-entrance-night-concept.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                aria-label="Selected Archer Design hospitality motion work"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">Hospitality motion + campaign design</p>
                <h2 className="mt-3 max-w-md font-serif text-3xl leading-tight">Make the digital experience feel as considered as the stay.</h2>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/8 bg-white/55 px-6 py-8">
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
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <span className="st-kicker">About Devon</span>
                <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">
                  Design training, hospitality execution, and technical range in one partner.
                </h2>
                <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  Archer Design sits between traditional creative production and hands-on digital implementation. I can move from concept and art direction into finished campaign assets, motion, landing pages, prototypes, and working systems without handing the idea through five different vendors.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <article className="rounded-[26px] border border-black/8 bg-white p-7 sm:col-span-2">
                  <Award className="h-6 w-6 text-[var(--st-ink)]" aria-hidden />
                  <h3 className="mt-5 font-serif text-2xl text-[var(--st-ink)]">Hospitality experience</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                    Current and selected work includes Hotel Indigo Pittsburgh University-Oakland, Hampton Inn properties, Eliza Hot Metal Bistro, spa/wellness work, hospitality events, and multi-brand property-level campaigns. My work spans social, motion, F&B, meetings, weddings, local-demand offers, web, digital signage, and creative systems.
                  </p>
                </article>

                {EDUCATION.map((item) => (
                  <article key={item.degree} className="rounded-[26px] border border-black/8 bg-[#f7f4ef] p-6">
                    <GraduationCap className="h-5 w-5 text-[var(--st-ink)]" aria-hidden />
                    <h3 className="mt-4 font-serif text-xl text-[var(--st-ink)]">{item.degree}</h3>
                    <p className="mt-2 text-sm text-[var(--st-ink-soft)]">{item.school}</p>
                  </article>
                ))}

                <article className="rounded-[26px] border border-black/8 bg-[#1b1b18] p-6 text-white">
                  <Sparkles className="h-5 w-5 text-white/80" aria-hidden />
                  <h3 className="mt-4 font-serif text-xl">Creative technologist</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Figma, Adobe Creative Suite, Next.js, GitHub, Vercel, Supabase, AI-assisted development, CRM workflows, dashboards, product prototypes, and lightweight automation.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f0ede7] px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <span className="st-kicker">Selected experience</span>
              <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">A mix of client delivery, studio work, and product building.</h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {EXPERIENCE.map((item) => (
                <article key={item.role} className="rounded-[26px] border border-black/8 bg-white/80 p-7">
                  <Briefcase className="h-5 w-5 text-[var(--st-ink)]" aria-hidden />
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--st-ink-muted)]">{item.years}</p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight text-[var(--st-ink)]">{item.role}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <span className="st-kicker">When to think of Archer</span>
              <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">The signals that usually mean there’s a fit.</h2>
              <p className="mt-5 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                You do not need to diagnose the exact service. If one of these situations sounds familiar, a simple introduction is enough.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {REFERRAL_TRIGGERS.map((item) => (
                <div key={item} className="flex gap-4 rounded-[22px] border border-black/8 bg-white p-5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--st-ink)]" aria-hidden />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f0ede7] px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <span className="st-kicker">Good referrals</span>
              <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">Where Archer fits best.</h2>
              <p className="mt-5 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                The strongest introductions are teams with something valuable to promote, improve, launch, or reposition—but not enough internal creative bandwidth to execute it consistently.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {FITS.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-[26px] border border-black/8 bg-white/75 p-7">
                  <Icon className="h-6 w-6 text-[var(--st-ink)]" aria-hidden />
                  <h3 className="mt-5 font-serif text-2xl text-[var(--st-ink)]">{title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="scroll-mt-24 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <span className="st-kicker">Selected work</span>
                <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">Motion, campaigns, and property-level creative.</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="text-sm font-semibold text-[var(--st-ink)] underline decoration-black/25 underline-offset-4 hover:decoration-black">Full Archer Design site</Link>
                <Link href="/devon" className="text-sm font-semibold text-[var(--st-ink)] underline decoration-black/25 underline-offset-4 hover:decoration-black">Full Devon portfolio</Link>
              </div>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {MOTION_WORK.map((item) => (
                <article key={item.src} className="overflow-hidden rounded-[24px] bg-[#1b1b18]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <video src={item.src} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" aria-label={item.label} />
                  </div>
                  <div className="px-5 py-4 text-white/85">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">{item.type}</p>
                    <p className="mt-1 text-sm font-medium">{item.label}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STATIC_WORK.map((item) => (
                <article key={item.src} className="overflow-hidden rounded-[24px] border border-black/8 bg-white">
                  <div className="relative aspect-[4/5] bg-[#ece9e3]">
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--st-ink-muted)]">{item.type}</p>
                    <h3 className="mt-2 font-serif text-xl text-[var(--st-ink)]">{item.label}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1b1b18] px-6 py-20 text-white lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Why referral partners use Archer</span>
              <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08]">I complement the work you already do instead of competing with it.</h2>
              <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/68">
                Operations, revenue, leadership, service, technology, and guest-experience partners solve important problems inside the property. Archer can turn those priorities into the polished campaigns, motion, web, sales assets, digital signage, and guest-facing execution people actually see.
              </p>
              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/68">
                The relationship can work both directions: when an Archer client needs operational, revenue, AI, or other specialist support, I prefer to send that work back to trusted partners rather than pretend to be everything to everyone.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: UsersRound, title: "You diagnose", text: "Your consulting, revenue, operations, service, or technology work surfaces an opportunity." },
                { icon: Sparkles, title: "Archer activates", text: "I turn the priority into finished guest-facing creative, motion, web, and campaigns." },
                { icon: MonitorPlay, title: "Digital implementation", text: "When needed, I can build landing pages, dashboards, prototypes, and lightweight workflows behind the creative." },
                { icon: Handshake, title: "Referrals go both ways", text: "If an Archer client needs your specialty, I can make the introduction back to you." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/12 bg-white/[0.05] p-5">
                  <Icon className="h-5 w-5 text-white/75" aria-hidden />
                  <h3 className="mt-4 font-serif text-xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <span className="st-kicker">How a referral works</span>
                <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">Warm introduction. Focused first step. No pressure.</h2>
                <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  You do not have to sell Archer for me. A short introduction and a sentence about the visible need are enough.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { n: "01", title: "Warm introduction", text: "Connect me with an owner, GM, marketing leader, consultant, management company, or other qualified hospitality decision-maker." },
                  { n: "02", title: "Focused discovery", text: "I review the property or portfolio, identify the visible creative or digital gap, and ask only the questions needed to understand the opportunity." },
                  { n: "03", title: "Small first engagement", text: "When possible, I start with a focused project or pilot instead of forcing a large retainer before the workflow is proven." },
                  { n: "04", title: "Keep the partner in the loop", text: "I respect the relationship that created the introduction and coordinate with the referring partner when collaboration makes sense." },
                ].map((step) => (
                  <div key={step.n} className="grid gap-4 rounded-[24px] border border-black/8 bg-white p-6 sm:grid-cols-[52px_1fr]">
                    <div className="font-serif text-2xl text-[var(--st-ink-muted)]">{step.n}</div>
                    <div>
                      <h3 className="font-serif text-2xl text-[var(--st-ink)]">{step.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#ece5da] px-6 py-20 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
            <div>
              <Handshake className="h-7 w-7 text-[var(--st-ink)]" aria-hidden />
              <span className="st-kicker mt-5 block">Easy introduction</span>
              <h2 className="mt-4 font-serif text-[clamp(32px,4vw,50px)] leading-[1.06] text-[var(--st-ink)]">Copy this if you want to make the intro in 30 seconds.</h2>
            </div>

            <div className="rounded-[30px] border border-black/10 bg-white p-7 sm:p-9">
              <p className="font-serif text-[22px] leading-relaxed text-[var(--st-ink)]">
                “Devon runs Archer Design, a hospitality-focused creative studio that helps hotels turn offers, spaces, F&B, meetings, events, and guest experiences into polished motion, digital, web, and campaign creative. I thought you two should meet because there may be a useful fit.”
              </p>
              <p className="mt-6 border-t border-black/8 pt-5 text-[13px] leading-relaxed text-[var(--st-ink-muted)]">
                Referral compensation is available for qualified partner relationships. I prefer to confirm the percentage, duration, and eligibility in writing with each partner rather than publish one blanket commission structure that may not fit every collaboration.
              </p>
            </div>
          </div>
        </section>

        <section id="refer" className="scroll-mt-24 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <span className="st-kicker">Make an introduction</span>
              <h2 className="mt-4 font-serif text-[clamp(32px,4vw,50px)] leading-[1.08] text-[var(--st-ink)]">Send the referral directly to Devon.</h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
                A name, company, and a little context are enough. If there’s a strong fit, I’ll coordinate the next step with you and keep the introduction professional and low-pressure.
              </p>
            </div>
            <ReferralForm />
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
