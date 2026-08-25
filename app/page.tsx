import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/marketing/JsonLd";
import { StudioHeroMedia, type StudioClip } from "@/components/marketing/StudioHeroMedia";
import { StudioGallery, type StudioGalleryItem } from "@/components/marketing/StudioGallery";
import { StudioHeader } from "@/components/marketing/StudioHeader";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { StudioCTA } from "@/components/marketing/StudioCTA";
import { HomePricingSection } from "@/components/marketing/HomePricingSection";
import { fraunces } from "@/components/marketing/studioFont";
import { HERO_ROTATION } from "@/components/marketing/media";
import { faqJsonLd, serviceJsonLd } from "@/lib/seo";

const TITLE = "Archer Design | Remote Hospitality Creative Studio";
const DESCRIPTION =
  "Archer Design is a remote hospitality creative studio that turns the property photos, F&B content, event footage, and brand assets hotels already have into polished monthly campaigns, social graphics, short-form motion, and booking-support creative.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const pub = (file: string) => `/${encodeURIComponent(file)}`;

// Hero rotation — real landscape hotel / resort / F&B motion (Supabase).
const HERO_CLIPS: readonly StudioClip[] = HERO_ROTATION.slice(0, 6).map((v) => ({
  src: v.src,
  label: v.label,
  tag: v.category,
}));

// Work / proof gallery — real campaign creative from /public.
const WORK_ITEMS: readonly StudioGalleryItem[] = [
  { src: pub("Image 2.png"), alt: "Hotel Indigo Pittsburgh University-Oakland room & lobby social campaign", tag: "Hotel Indigo — social campaign" },
  { src: pub("Image 5.png"), alt: "Eliza Hot Metal Bistro burger promo, 15% off", tag: "Eliza Hot Metal Bistro — F&B promo" },
  { src: pub("Image 4.png"), alt: "Hampton Inn flood festival event flyer", tag: "Hampton Inn — event campaign" },
  { src: pub("Image 6.png"), alt: "Eliza Hot Metal Bistro live music flyer", tag: "Live music & events" },
  { src: pub("Image 3.png"), alt: "Eliza Hot Metal Bistro wine & holiday seasonal billboard", tag: "Seasonal campaign" },
  { src: pub("Image 7.png"), alt: "Eliza Hot Metal Bistro Take-Out Wednesday promo", tag: "Restaurant promo" },
];

// Brand proof logos.
const BRAND_LOGOS = [
  { src: pub("Hampton-Brand-Logo_TM_CMYK_Full-Color.png"), alt: "Hampton by Hilton" },
  { src: pub("PITTSBURGH UNI-OAK_RGB_canvas_white_on_indigo_blue.png"), alt: "Hotel Indigo Pittsburgh University-Oakland" },
  { src: pub("Elements Full logo- NO BACK GROUND.png"), alt: "Elements Spa" },
  { src: pub("Untitled.png"), alt: "Eliza Hot Metal Bistro" },
] as const;

const HERO_PROOF = [
  "14.8M+ tracked impressions",
  "4.3M+ reach",
  "565K+ engagements",
  "2.5K+ creative pieces / posts",
];

// 4 — What Archer makes each month.
const DELIVERABLES = [
  { t: "Social graphics", d: "On-brand feed and story creative for hotels, F&B, spas, and events." },
  { t: "Short-form motion & reels", d: "Polished motion built from existing stills and quick staff clips." },
  { t: "Campaign visuals", d: "Seasonal pushes, events, and offers turned into coordinated asset sets." },
  { t: "Booking-support creative", d: "Direct-booking visuals, sales decks, and one-sheets for group and leisure demand." },
  { t: "F&B & event promos", d: "Menu features, specials, live music, and private-dining promos timed to your calendar." },
  { t: "Google Business content", d: "Local visibility creative so nearby guests find and choose you first." },
];

// 5 — Remote workflow steps.
const WORKFLOW = [
  { n: "01", t: "You send the raw ingredients", d: "Past professional photos, staff iPhone clips, property links, event details, menus, and seasonal offers." },
  { n: "02", t: "We edit, design, animate, and caption", d: "Your assets become polished, on-brand graphics, motion, and campaign visuals — a steady monthly rhythm." },
  { n: "03", t: "You receive ready-to-use creative", d: "Approval-ready to post, send, or print across social, sales, and property marketing." },
];

// 5 — Objection pillars.
const REMOTE_ANGLES = [
  { t: "Asset maximizer", d: "Most hotels already paid for professional photography. We make those assets work harder, long after the shoot." },
  { t: "Motion without a full crew", d: "High-quality stills become polished short-form motion and campaign video — no production day required." },
  { t: "Authentic social, handled", d: "Your staff capture quick iPhone clips; we handle the editing, pacing, polish, captions, and motion." },
  { t: "Hybrid when it matters", d: "If a property truly needs new hero assets, we can help coordinate a local shooter — but most monthly work is remote." },
];

// 6 — Proof band.
const PROOF_METRICS = [
  { value: "14.8M+", label: "Tracked impressions" },
  { value: "4.3M+", label: "Reach" },
  { value: "565K+", label: "Engagements" },
  { value: "670K+", label: "Reported post clicks" },
  { value: "2.5K+", label: "Creative pieces / posts" },
];

// 8 — Who it's for.
const AUDIENCES = [
  { t: "Single properties", d: "Boutique and select-service hotels that need consistent creative without a hire." },
  { t: "Hotel restaurants & bars", d: "F&B teams that need menu, event, and beverage creative on a steady cadence." },
  { t: "Resorts & spas", d: "Calm, premium creative for amenities, wellness, and seasonal packages." },
  { t: "Multi-property & groups", d: "Scalable, on-brand creative across a portfolio — one studio, one rhythm." },
];

// 10 — Comparison.
const OLD_WAY = [
  "Freelance designer",
  "Video editor",
  "Social content support",
  "Photographer / production crew",
  "Agency support",
  "Internal coordination time",
];
const ARCHER_WAY = [
  "One hospitality creative studio",
  "A steady monthly creative rhythm",
  "A remote post-production workflow",
  "Scalable support for one property or many",
  "Lower overhead than building a full creative team",
];

const FAQ = [
  {
    q: "How does this work if you're not on-site?",
    a: "Most properties already have strong raw assets — professional photos, room and F&B imagery, event photos, and brand files. We turn those into ongoing creative remotely. When a property genuinely needs new hero assets, we can help coordinate a local shooter.",
  },
  {
    q: "Do we need new professional photos first?",
    a: "No. The whole point is making the assets you already paid for work harder. Past professional photos, staff iPhone clips, menus, and property links are usually more than enough to build a strong monthly creative rhythm.",
  },
  {
    q: "Can you support more than one property?",
    a: "Yes. Archer Design is built to scale from a single property to a multi-property group, keeping every location on-brand with one consistent creative workflow.",
  },
  {
    q: "Do you work within our brand standards?",
    a: "Yes. We produce brand-standard-aware creative built from your existing brand kit, so it clears review the first time — including for franchise- and flag-operated properties.",
  },
  {
    q: "How is this different from hiring an agency or in-house team?",
    a: "It's lower overhead. Instead of stacking a designer, video editor, social support, and production crew, you get one hospitality creative studio with a predictable monthly rhythm — premium output without building a full team.",
  },
];

export default function ArcherStudioHome() {
  return (
    <div className={`${fraunces.variable} archer-studio relative min-h-screen`}>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Archer Design — Remote Hospitality Creative Studio",
            description: DESCRIPTION,
            path: "/",
            serviceType: "Hospitality creative, social content, and post-production studio",
          }),
          faqJsonLd(FAQ.map(({ q, a }) => ({ q, a }))),
        ]}
      />

      <StudioHeader />

      <main>
        {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
        <section className="px-6 pt-16 pb-14 lg:pt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <span className="st-kicker">Remote hospitality creative studio</span>
              <h1 className="mt-5 font-serif text-[clamp(34px,5vw,60px)] leading-[1.05] text-[var(--st-ink)]">
                The creative your property needs — from the assets you already
                have.
              </h1>
              <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-[var(--st-ink-soft)]">
                Send us your photos, clips, menus, and seasonal offers. We turn
                them into polished monthly creative — social graphics, short-form
                motion, and campaign visuals — your team can actually post,
                without adding more in-house overhead.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="st-btn">
                  Send a property link <span aria-hidden>→</span>
                </Link>
                <a href="#work" className="st-btn-ghost">
                  View hospitality work
                </a>
              </div>

              <p className="mt-8 text-[13px] leading-relaxed text-[var(--st-ink-muted)]">
                {HERO_PROOF.join("  ·  ")}
              </p>
            </div>

            <div className="lg:pl-4">
              <StudioHeroMedia clips={HERO_CLIPS} />
            </div>
          </div>
        </section>

        {/* ── 2. Trust strip ───────────────────────────────────────────────── */}
        <section className="px-6 py-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--st-ink-muted)]">
              Creative built for real hotel, restaurant & event brands
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {BRAND_LOGOS.map((logo) => (
                <div
                  key={logo.src}
                  className="relative h-9 w-28 shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-10 sm:w-32"
                >
                  <Image src={logo.src} alt={logo.alt} fill sizes="160px" loading="lazy" className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Problem ───────────────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <span className="st-kicker">The opportunity</span>
            <h2 className="mt-4 max-w-3xl font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
              You already paid for great photography. Let&apos;s make it work harder.
            </h2>
            <div className="mt-9 grid gap-6 md:grid-cols-2">
              <p className="text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Most properties sit on a library of professional photos, F&amp;B
                shots, event coverage, and brand materials. After the initial
                shoot, those assets tend to go quiet in a folder.
              </p>
              <p className="text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Meanwhile, restaurant and event teams are busy, and GMs and sales
                leaders don&apos;t have time to design campaigns. Social slips into
                inconsistency, and great guest experiences don&apos;t always translate
                online.
              </p>
            </div>
            <p className="mt-9 max-w-3xl font-serif text-[19px] leading-relaxed text-[var(--st-ink)]">
              The gap is rarely the assets. It&apos;s the bandwidth to turn them into a
              steady stream of polished, on-brand creative.
            </p>
          </div>
        </section>

        {/* ── 4. What we make each month ───────────────────────────────────── */}
        <section className="bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">What we make</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
                Finished hospitality creative, every month.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {DELIVERABLES.map((d) => (
                <div key={d.t} className="st-card p-7">
                  <h3 className="font-serif text-[20px] text-[var(--st-ink)]">{d.t}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">{d.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Remote workflow + objection ───────────────────────────────── */}
        <section id="approach" className="scroll-mt-24 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">How remote production works</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
                Raw ingredients in. Finished creative out.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Think of Archer Design as your remote hospitality post-production
                studio. The workflow is simple — and the remote model is a
                strategic advantage, not a limitation.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {WORKFLOW.map((s) => (
                <div key={s.n} className="st-card p-7">
                  <span className="font-serif text-[26px] text-[var(--st-gold)]">{s.n}</span>
                  <h3 className="mt-3 font-serif text-[20px] text-[var(--st-ink)]">{s.t}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">{s.d}</p>
                </div>
              ))}
            </div>

            <div className="st-panel mt-8 p-8 md:p-10">
              <h3 className="font-serif text-[clamp(20px,2.6vw,28px)] text-[var(--st-ink)]">
                &ldquo;But how do you handle photo and video if you&apos;re not on-site?&rdquo;
              </h3>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                {REMOTE_ANGLES.map((a) => (
                  <div key={a.t}>
                    <h4 className="font-serif text-[17px] text-[var(--st-ink)]">{a.t}</h4>
                    <p className="mt-2 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">{a.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Proof numbers band ────────────────────────────────────────── */}
        <section className="bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">The proof</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
                Tracked across real hospitality clients.
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {PROOF_METRICS.map((m) => (
                <div key={m.label}>
                  <div className="font-serif text-[clamp(28px,3.4vw,42px)] leading-none text-[var(--st-ink)]">
                    {m.value}
                  </div>
                  <div className="mt-2 text-[12.5px] leading-snug text-[var(--st-ink-muted)]">{m.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-[var(--st-ink-muted)]">
              Figures are cumulative across tracked hotel, restaurant, spa, event,
              and seasonal hospitality campaigns — not the result of any single
              client. Results depend on offer, audience, timing, and many other
              factors.
            </p>
          </div>
        </section>

        {/* ── 7. Selected work ─────────────────────────────────────────────── */}
        <section id="work" className="scroll-mt-24 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">Selected work</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
                Real properties. Real hospitality creative.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Campaigns and content built from existing assets for hotels,
                restaurants, events, and seasonal pushes.
              </p>
            </div>
            <div className="mt-12">
              <StudioGallery items={WORK_ITEMS} />
            </div>
            <p className="mt-8">
              <Link href="/case-studies" className="text-[14px] font-semibold text-[var(--st-gold)] hover:text-[var(--st-ink)]">
                See the full case studies →
              </Link>
            </p>
          </div>
        </section>

        {/* ── 8. Who it's for ──────────────────────────────────────────────── */}
        <section id="who" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">Who it&apos;s for</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
                Built for one property or a whole portfolio.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AUDIENCES.map((a) => (
                <div key={a.t} className="st-card p-7">
                  <h3 className="font-serif text-[19px] text-[var(--st-ink)]">{a.t}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. Pricing ───────────────────────────────────────────────────── */}
        <HomePricingSection />

        {/* ── 10. Lower-overhead comparison ────────────────────────────────── */}
        <section id="value" className="scroll-mt-24 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">The advantage</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
                More creative output. Less overhead.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Instead of stacking multiple vendors and in-house hires, one studio
                keeps the creative moving — with far less coordination burden on
                your team.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="st-panel p-8">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--st-ink-muted)]">
                  The old way
                </p>
                <ul className="mt-5 space-y-3">
                  {OLD_WAY.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-[var(--st-ink-soft)]">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--st-taupe)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="st-card border-[var(--st-gold-soft)] p-8">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">
                  With Archer Design
                </p>
                <ul className="mt-5 space-y-3">
                  {ARCHER_WAY.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-[var(--st-ink)]">
                      <span className="mt-[3px] shrink-0 text-[var(--st-gold)]">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. Getting started ──────────────────────────────────────────── */}
        <section className="px-6 pb-4">
          <div className="mx-auto max-w-5xl">
            <div className="st-panel p-8 text-center md:p-12">
              <span className="st-kicker">Getting started</span>
              <p className="mx-auto mt-4 max-w-3xl font-serif text-[clamp(20px,2.6vw,28px)] leading-snug text-[var(--st-ink)]">
                Start with one asset, a $299.99 monthly creative lane, or a fuller property-level partnership.
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
                The goal is to match the amount of creative support to what your team actually needs now — then scale only when the workload and results justify it.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="#pricing" className="st-btn">
                  See pricing <span aria-hidden>→</span>
                </a>
                <Link href="/contact" className="st-btn-ghost">
                  Talk through the right fit
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12. FAQ ──────────────────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <span className="st-kicker">Good questions</span>
            <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
              The practical details.
            </h2>
            <div className="mt-8 divide-y divide-[var(--st-line)] border-y border-[var(--st-line)]">
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[19px] text-[var(--st-ink)] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-2xl text-[var(--st-gold)] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--st-ink-soft)]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── 13. Final CTA ──────────────────────────────────────────────────── */}
      <StudioCTA />

      <StudioFooter />
    </div>
  );
}
