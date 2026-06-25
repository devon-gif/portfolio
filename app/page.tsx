import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { JsonLd } from "@/components/marketing/JsonLd";
import { StudioHeroMedia, type StudioClip } from "@/components/marketing/StudioHeroMedia";
import { StudioGallery, type StudioGalleryItem } from "@/components/marketing/StudioGallery";
import { HERO_ROTATION } from "@/components/marketing/media";
import { faqJsonLd, serviceJsonLd } from "@/lib/seo";

const fraunces = Fraunces({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// ── CTAs ─────────────────────────────────────────────────────────────────────
const CONTACT_EMAIL = "heydevon@gmail.com";
const SEND_PROPERTY = "/contact";
const BOOK_INTRO = "/contact";
const EMAIL_LINK = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Archer Design — here's a property / restaurant / event link"
)}`;

const TITLE = "Archer Design | Remote Hospitality Creative Studio";
const DESCRIPTION =
  "Archer Design is a remote hospitality creative studio that turns the property photos, F&B content, event footage, and brand assets hotels already have into polished campaigns, social graphics, short-form motion, and booking-support creative.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

// ── Media ────────────────────────────────────────────────────────────────────
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

// ── Content ──────────────────────────────────────────────────────────────────
const PROOF_LINE = [
  "14.8M+ tracked impressions",
  "565K+ engagements",
  "4.3M+ reach",
  "2.5K+ creative pieces / posts",
];

const PROCESS = [
  {
    n: "01",
    t: "Send what you have",
    d: "Professional photos, staff iPhone clips, menus, event details, property links, seasonal offers, and brand files. Whatever already exists.",
  },
  {
    n: "02",
    t: "We turn it into polished creative",
    d: "Social graphics, reels and motion assets, ads, campaign visuals, email / Google / Facebook creative, event promos, and F&B assets.",
  },
  {
    n: "03",
    t: "Your team approves and uses it everywhere",
    d: "Social, sales decks, local campaigns, property marketing, meetings and events, restaurant promos, and direct-booking support.",
  },
];

const REMOTE_ANGLES = [
  {
    t: "Asset maximizer",
    d: "Most hotels already paid for professional photography. We help those assets keep working long after the shoot wraps.",
  },
  {
    t: "Motion without a full crew",
    d: "High-quality stills can become polished short-form motion and campaign videos — no on-site production day required.",
  },
  {
    t: "Authentic social, handled",
    d: "Your staff capture quick iPhone clips; we handle the editing, pacing, polish, captions, and motion.",
  },
  {
    t: "Hybrid when it matters",
    d: "If a property truly needs new hero assets, we can help coordinate a local shooter — but most monthly creative is handled remotely.",
  },
];

const SERVICES = [
  {
    t: "Hotels & Resorts",
    d: "Room, lobby, amenity, and lifestyle creative for social, seasonal pushes, and direct-booking support.",
  },
  {
    t: "Restaurants & Bars",
    d: "Menu launches, F&B specials, cocktail and dish features, and weekly content that keeps the feed alive.",
  },
  {
    t: "Meetings & Events",
    d: "Event recaps, promo flyers, weddings and private dining, and sales-ready visuals for group business.",
  },
  {
    t: "Spas & Wellness",
    d: "Treatment promos, seasonal packages, and calm, on-brand creative for memberships and gift offers.",
  },
  {
    t: "Multi-Property Groups",
    d: "Consistent, scalable creative across a portfolio — one studio, one rhythm, every property on-brand.",
  },
  {
    t: "Seasonal Campaigns",
    d: "Holidays, local events, and limited-time offers turned into a coordinated set of ready-to-post assets.",
  },
];

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

const PROOF_METRICS = [
  { value: "14.8M+", label: "Tracked impressions" },
  { value: "4.3M+", label: "Reach" },
  { value: "670K+", label: "Reported post clicks" },
  { value: "565K+", label: "Engagements" },
  { value: "2.5K+", label: "Creative pieces / posts" },
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

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[var(--st-line-soft)] bg-[rgba(251,248,242,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--st-line)] bg-white">
              <Image
                src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
                alt="Archer Design logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div className="wordmark-font text-[1rem]">
              <span className="text-[var(--st-ink)]">Archer</span>
              <span className="text-[var(--st-gold)]">Design</span>
            </div>
          </Link>
          <nav className="flex items-center gap-7 text-[13.5px] text-[var(--st-ink-soft)]">
            <a href="#approach" className="hidden hover:text-[var(--st-ink)] md:inline">Approach</a>
            <a href="#services" className="hidden hover:text-[var(--st-ink)] sm:inline">Where we help</a>
            <a href="#value" className="hidden hover:text-[var(--st-ink)] md:inline">Value</a>
            <a href="#work" className="hidden hover:text-[var(--st-ink)] sm:inline">Work</a>
            <Link href={SEND_PROPERTY} className="st-btn px-5 py-2.5 text-[13px]">
              Send a property link
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
        <section className="px-6 pt-16 pb-14 lg:pt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <span className="st-kicker">Remote hospitality creative studio</span>
              <h1 className="mt-5 font-serif text-[clamp(34px,5vw,60px)] leading-[1.05] text-[var(--st-ink)]">
                Hospitality creative for properties that already have the
                assets — but not the time to turn them into campaigns.
              </h1>
              <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-[var(--st-ink-soft)]">
                Archer Design helps hotels, restaurants, bars, spas, and
                hospitality groups transform existing property assets into social
                graphics, short-form motion, campaign visuals, booking-support
                creative, and sales-ready content — without adding more in-house
                overhead.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={SEND_PROPERTY} className="st-btn">
                  Send a property link <span aria-hidden>→</span>
                </Link>
                <a href="#work" className="st-btn-ghost">
                  View hospitality work
                </a>
              </div>

              <p className="mt-8 text-[13px] leading-relaxed text-[var(--st-ink-muted)]">
                {PROOF_LINE.join("  ·  ")}
              </p>
            </div>

            <div className="lg:pl-4">
              <StudioHeroMedia clips={HERO_CLIPS} />
            </div>
          </div>
        </section>

        {/* ── Trust strip ──────────────────────────────────────────────────── */}
        <section className="px-6 py-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--st-ink-muted)]">
              Creative built on real hotel, restaurant & event brands
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {BRAND_LOGOS.map((logo) => (
                <div
                  key={logo.src}
                  className="relative h-9 w-28 shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-10 sm:w-32"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    sizes="160px"
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. Problem ───────────────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <span className="st-kicker">The opportunity</span>
            <h2 className="mt-4 max-w-3xl font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
              Your property already has the raw material. It just needs a better
              creative system.
            </h2>
            <div className="mt-9 grid gap-6 md:grid-cols-2">
              <p className="text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Most hotels have beautiful photos sitting in folders — rooms,
                lobbies, food and beverage, events, and brand materials, much of
                it professionally shot. After the initial shoot, those assets
                tend to go quiet.
              </p>
              <p className="text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Meanwhile, restaurant and event teams are busy, and GMs and sales
                leaders don&apos;t have time to design campaigns. Social slips into
                inconsistency, and genuinely great guest experiences don&apos;t always
                translate online.
              </p>
            </div>
            <p className="mt-9 max-w-3xl font-serif text-[19px] leading-relaxed text-[var(--st-ink)]">
              The gap is rarely the assets. It&apos;s the bandwidth to turn them into
              a steady stream of polished, on-brand creative.
            </p>
          </div>
        </section>

        {/* ── 3. Process ───────────────────────────────────────────────────── */}
        <section id="approach" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">How it works</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
                Raw assets in. Finished hospitality creative out.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Think of Archer Design as your remote hospitality post-production
                studio. You send the raw ingredients — we turn them into creative
                your team can actually use.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PROCESS.map((s) => (
                <div key={s.n} className="st-card p-7">
                  <span className="font-serif text-[26px] text-[var(--st-gold)]">{s.n}</span>
                  <h3 className="mt-3 font-serif text-[20px] text-[var(--st-ink)]">{s.t}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Remote production ─────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <span className="st-kicker">Remote, by design</span>
                <h2 className="mt-4 font-serif text-[clamp(26px,3.4vw,40px)] leading-[1.12] text-[var(--st-ink)]">
                  &ldquo;How does this work if you&apos;re not on-site?&rdquo;
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                  It&apos;s the most common question — and the remote model is a
                  strategic advantage, not a limitation. Here&apos;s how the work gets
                  done without a standing camera crew.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {REMOTE_ANGLES.map((a) => (
                  <div key={a.t} className="st-panel p-6">
                    <h3 className="font-serif text-[18px] text-[var(--st-ink)]">{a.t}</h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                      {a.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Services ──────────────────────────────────────────────────── */}
        <section id="services" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">Where we help</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
                One studio across the whole property.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <div key={s.t} className="st-card flex flex-col p-7">
                  <h3 className="font-serif text-[20px] text-[var(--st-ink)]">{s.t}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Cost comparison ───────────────────────────────────────────── */}
        <section id="value" className="scroll-mt-24 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">The advantage</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
                More creative output. Less overhead.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Serious hospitality brands deserve serious creative — without the
                cost of stacking multiple vendors and in-house hires.
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
            <p className="mt-7 max-w-3xl text-[14px] leading-relaxed text-[var(--st-ink-muted)]">
              Monthly creative support starts with single-property and
              multi-property pilot options. We&apos;ll scope the right rhythm for your
              team on a quick intro call.
            </p>
          </div>
        </section>

        {/* ── 7. Work / proof ──────────────────────────────────────────────── */}
        <section id="work" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
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

            <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--st-line)] pt-10 sm:grid-cols-3 lg:grid-cols-5">
              {PROOF_METRICS.map((m) => (
                <div key={m.label}>
                  <div className="font-serif text-[clamp(26px,3.2vw,38px)] leading-none text-[var(--st-ink)]">
                    {m.value}
                  </div>
                  <div className="mt-2 text-[12.5px] leading-snug text-[var(--st-ink-muted)]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-[var(--st-ink-muted)]">
              Figures are cumulative across tracked hotel, restaurant, spa,
              event, and seasonal hospitality campaigns — not the result of any
              single client. Results depend on offer, audience, timing, and many
              other factors.
            </p>
          </div>
        </section>

        {/* ── 8. FAQ ───────────────────────────────────────────────────────── */}
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

        {/* ── 9. Final CTA ─────────────────────────────────────────────────── */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-4xl">
            <div className="st-card overflow-hidden p-10 text-center md:p-14">
              <h2 className="mx-auto max-w-2xl font-serif text-[clamp(28px,4vw,46px)] leading-[1.08] text-[var(--st-ink)]">
                Want to see what your existing assets could become?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                Send a property, restaurant, event, spa, or campaign link and
                we&apos;ll take a practical look at where stronger creative could
                support your team.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href={SEND_PROPERTY} className="st-btn">
                  Send a property link <span aria-hidden>→</span>
                </Link>
                <Link href={BOOK_INTRO} className="st-btn-ghost">
                  Book a quick intro
                </Link>
              </div>
              <div className="mt-6 border-t border-[var(--st-line)] pt-5">
                <a
                  href={EMAIL_LINK}
                  className="text-[13.5px] font-semibold text-[var(--st-gold)] hover:text-[var(--st-ink)]"
                >
                  Or email us directly →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--st-line)] px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[var(--st-line)] bg-white">
              <Image
                src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
                alt="Archer Design logo"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div className="wordmark-font text-[0.95rem]">
              <span className="text-[var(--st-ink)]">Archer</span>
              <span className="text-[var(--st-gold)]">Design</span>
            </div>
          </div>
          <p className="max-w-2xl font-serif text-[clamp(18px,2.4vw,26px)] leading-snug text-[var(--st-ink)]">
            A remote hospitality creative studio making the assets you already
            have work harder.
          </p>
          <p className="max-w-2xl text-[12.5px] leading-relaxed text-[var(--st-ink-muted)]">
            Archer Design — hospitality creative, social content, short-form
            motion, and booking-support visuals for hotels, hotel groups,
            restaurants, bars, spas, and events.
          </p>
          <Link href="/hotel-groups" className="text-[12.5px] text-[var(--st-gold)] hover:text-[var(--st-ink)]">
            Multi-property & hotel group creative →
          </Link>
        </div>
      </footer>
    </div>
  );
}
