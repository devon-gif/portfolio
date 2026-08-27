import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Check,
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

const TITLE = "Refer a Hospitality Client | Archer Design";
const DESCRIPTION =
  "Refer a hotel, resort, restaurant, spa, hospitality group, or strategic partner to Archer Design. See Devon Archer's work, results, services, and referral process.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/referral" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/referral" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const pub = (file: string) => `/${encodeURIComponent(file)}`;

const PROOF = [
  { value: "18.6M+", label: "Impressions" },
  { value: "4.9M+", label: "Reach" },
  { value: "612K+", label: "Engagements" },
  { value: "2.7K+", label: "Creative pieces" },
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
    label: "Hotel arrival / day-to-night",
  },
  {
    src: "/tcrm/videos/courtyard-couple.mp4",
    label: "Guest-experience motion",
  },
  {
    src: "/tcrm/videos/fall-to-winter-timelapse.mp4",
    label: "Seasonal transition",
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
              <span className="st-kicker">Archer Design referral partners</span>
              <h1 className="mt-5 max-w-3xl font-serif text-[clamp(38px,5.6vw,68px)] leading-[1.01] text-[var(--st-ink)]">
                Know a hospitality team that needs better creative?
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--st-ink-soft)]">
                I’m Devon Archer, founder of Archer Design. I help hotels, restaurants, resorts, spas, and multi-property groups turn the assets and offers they already have into polished motion, campaign creative, social content, and digital experiences that are easier for guests to notice and act on.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#refer" className="st-btn">
                  Make an introduction <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href="#work" className="st-btn-ghost">See selected work</a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-[var(--st-ink-muted)]">
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Success-based referral fee</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> No upfront cost</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Paid after client payment clears</span>
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
                <h2 className="mt-3 max-w-md font-serif text-3xl leading-tight">Make the digital experience feel as good as the stay.</h2>
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
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
            <div>
              <span className="st-kicker">About Devon</span>
              <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">
                Creative direction, production, and systems thinking in one partner.
              </h2>
            </div>
            <div className="space-y-6 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
              <p>
                Archer Design currently supports a western Pennsylvania hospitality group across Hotel Indigo Pittsburgh University-Oakland, Hampton Inn Greensburg, Hampton Inn Johnstown, Eliza Hot Metal Bistro, and occasional spa/wellness work.
              </p>
              <p>
                My work spans hospitality design, short-form motion, AI-assisted image animation, campaign systems, landing pages, product prototyping, and creative workflow development. I’ve also built working AI products and production systems, so when a client needs implementation behind the creative—not just another deck—I can operate there too.
              </p>
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                {["Founder — Archer Design LLC", "Hospitality creative partner", "Creative technologist", "Motion + AI-assisted production", "Web / landing page builds", "Workflow + product prototyping"].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm text-[var(--st-ink)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f0ede7] px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <span className="st-kicker">Good referrals</span>
              <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">Where Archer fits best.</h2>
              <p className="mt-5 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                The best introductions are teams with plenty to promote but not enough creative bandwidth to package it consistently across properties, outlets, events, and seasons.
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
              <Link href="/" className="text-sm font-semibold text-[var(--st-ink)] underline decoration-black/25 underline-offset-4 hover:decoration-black">View the full Archer Design site</Link>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {MOTION_WORK.map((item) => (
                <article key={item.src} className="overflow-hidden rounded-[24px] bg-[#1b1b18]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <video src={item.src} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" aria-label={item.label} />
                  </div>
                  <div className="px-5 py-4 text-sm font-medium text-white/85">{item.label}</div>
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Where partnerships get stronger</span>
              <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08]">Internal capability + external presentation.</h2>
              <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/68">
                Operations, revenue, leadership, service, and guest-experience partners solve what happens inside the property. Archer Design helps make the improvement visible outside it—through campaigns, motion, websites, internal screens, digital experiences, and the creative execution guests actually see.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: UsersRound, title: "Operations / service partner", text: "Diagnoses leadership, service, retention, sales, or operational gaps." },
                { icon: Sparkles, title: "Archer Design", text: "Turns priorities into finished guest-facing creative, motion, web, and campaigns." },
                { icon: MonitorPlay, title: "AI + digital implementation", text: "Builds practical workflows, dashboards, landing pages, and prototypes when needed." },
                { icon: Handshake, title: "Joint / white-label", text: "Separate economics and scope for active co-selling or joint client delivery." },
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
                <span className="st-kicker">How a first engagement works</span>
                <h2 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">Start focused. Prove the workflow. Expand from evidence.</h2>
                <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  For hotel groups, the normal starting point is a focused 3–5 property pilot rather than a portfolio-wide rollout on day one.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { n: "01", title: "Warm introduction", text: "You connect Devon with an owner, GM, marketing leader, management company, consultant, or other qualified hospitality decision-maker." },
                  { n: "02", title: "Focused discovery", text: "Archer reviews the property or portfolio, identifies the visible creative gap, and scopes a simple first engagement." },
                  { n: "03", title: "Pilot", text: "Typical starting range: 3 properties at $4,500–$5,500/month or 5 properties at $7,500–$8,500/month, depending on scope." },
                  { n: "04", title: "Expansion", text: "If the workflow works, the client can expand across more properties, outlets, campaigns, or digital implementation needs." },
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
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div>
              <BadgeDollarSign className="h-7 w-7 text-[var(--st-ink)]" aria-hidden />
              <span className="st-kicker mt-5 block">Referral compensation</span>
              <h2 className="mt-4 font-serif text-[clamp(32px,4vw,50px)] leading-[1.06] text-[var(--st-ink)]">Simple: you get paid when the client does.</h2>
            </div>

            <div>
              <div className="rounded-[30px] border border-black/10 bg-white p-7 sm:p-9">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--st-ink-muted)]">Standard warm-referral structure</p>
                <div className="mt-5 flex items-end gap-3">
                  <span className="font-serif text-6xl leading-none text-[var(--st-ink)]">20%</span>
                  <span className="pb-1 text-sm font-semibold text-[var(--st-ink-soft)]">of the first month of service fees collected</span>
                </div>
                <p className="mt-5 text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
                  No upfront fee and no lifetime commission. The referral is earned only if the introduction becomes a signed client and Archer Design actually receives the client’s first payment.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f6f3ed] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--st-ink-muted)]">Example</p>
                    <p className="mt-2 font-serif text-2xl text-[var(--st-ink)]">$5,000 pilot → $1,000 referral</p>
                  </div>
                  <div className="rounded-2xl bg-[#f6f3ed] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--st-ink-muted)]">Example</p>
                    <p className="mt-2 font-serif text-2xl text-[var(--st-ink)]">$8,000 pilot → $1,600 referral</p>
                  </div>
                </div>

                <ul className="mt-7 space-y-3 text-sm leading-relaxed text-[var(--st-ink-soft)]">
                  <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0" /> Paid after the client’s first payment clears.</li>
                  <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0" /> Applies to qualified introductions that are not already active opportunities in Archer Design’s pipeline.</li>
                  <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0" /> Larger co-selling, white-label, or joint-delivery relationships use a separate written structure.</li>
                  <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0" /> Final eligibility and payment terms are confirmed in writing before commission is owed.</li>
                </ul>

                <p className="mt-6 border-t border-black/8 pt-5 text-[11px] leading-relaxed text-[var(--st-ink-muted)]">
                  This page is a referral-program overview, not a binding commission agreement. Taxes, reimbursed expenses, pass-through costs, refunds, and chargebacks are excluded from referral calculations unless otherwise agreed in writing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="refer" className="scroll-mt-24 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <span className="st-kicker">Make an introduction</span>
              <h2 className="mt-4 font-serif text-[clamp(32px,4vw,50px)] leading-[1.08] text-[var(--st-ink)]">Send the referral directly to Devon.</h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
                A name, company, and a little context are enough. If there’s a strong fit, Devon will coordinate the next step with you and keep the introduction professional and low-pressure.
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
