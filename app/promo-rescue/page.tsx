import type { Metadata } from "next";
import Image from "next/image";
import { Allura, Fraunces } from "next/font/google";
import { SeedanceBackground } from "@/components/marketing/SeedanceBackground";
import { PromoHeroVideo } from "@/components/marketing/PromoHeroVideo";
import { PromoExampleCarousel } from "@/components/marketing/PromoExampleCarousel";
import { PromoMotionCard } from "@/components/marketing/PromoMotionCard";
import {
  GOLD_GRADIENT,
  PROMO_RESCUE_HERO_IMAGE,
  PROMO_RESCUE_HERO_VIDEO,
  PROMO_RESCUE_EXAMPLES,
  PROMO_RESCUE_MOTION_EXAMPLES,
  BRAND_PROOF_LOGOS,
  ELIZA_BURGER_PROMO,
  HOTEL_INDIGO_COLLAGE,
  ELIZA_TAKEOUT_PROMO,
  HAMPTON_FLOOD_FESTIVAL,
} from "@/components/marketing/media";

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

// TODO(devon): Replace with a new Stripe payment link (or another payment
// link) whenever you want to swap how people pay for a slot. Easy to find —
// this one constant feeds every CTA button on the page.
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/8x2bJ21inf7H5mC0HucAo09";

// Per-package Stripe payment links. Only the $59.99 Promo Rescue link exists
// today (same link as STRIPE_PAYMENT_LINK above). TODO(devon): once you
// create Stripe payment links for the other three packages, paste them in
// below — each button will pick it up automatically.
const PROMO_RESCUE_LINK = STRIPE_PAYMENT_LINK;
const SOCIAL_PROMO_PACK_LINK = "#"; // TODO(devon): replace with Stripe link once created
const MOTION_BOOST_PACK_LINK = "#"; // TODO(devon): replace with Stripe link once created
const LOCAL_CAMPAIGN_KIT_LINK = "#"; // TODO(devon): replace with Stripe link once created

const DESCRIPTION =
  "A $59.99 limited promo cleanup offer for small businesses. Get one flyer, event, offer, or announcement turned into a polished social-ready promo package within 24 hours.";

export const metadata: Metadata = {
  title: "Promo Rescue | Archer Design",
  description: DESCRIPTION,
  alternates: { canonical: "/promo-rescue" },
  openGraph: {
    title: "Promo Rescue | Archer Design",
    description: DESCRIPTION,
    url: "/promo-rescue",
  },
};

const WHATS_INCLUDED = [
  {
    title: "Feed graphic",
    body: "One polished, social-ready promo graphic built around your offer, event, or announcement.",
  },
  {
    title: "Story version",
    body: "A resized, story-ready version so it's ready for Instagram and Facebook Stories too.",
  },
  {
    title: "Caption",
    body: "A short, ready-to-post caption written to match the promo, so you're not stuck staring at a blank box.",
  },
  {
    title: "Google Business / Facebook version",
    body: "A version formatted for a Google Business Profile post or Facebook update, so it looks right wherever you post it.",
  },
  {
    title: "24-hour turnaround",
    body: "Send your details and get a first draft back within 24 hours.",
  },
  {
    title: "1 small revision",
    body: "One small revision included to fine-tune wording, colors, or layout before it's final.",
  },
];

const BUSINESS_TYPES = [
  "Restaurants",
  "Cafes",
  "Bakeries",
  "Food trucks",
  "Bars",
  "Salons",
  "Spas",
  "Med spas",
  "Gyms",
  "Yoga studios",
  "Wedding venues",
  "Event venues",
  "Hotels",
  "Local shops",
  "Service businesses",
  "Realtors",
  "Car detailers",
  "Cleaning companies",
  "Landscapers",
  "Local community businesses",
];

const EXAMPLES = [
  "A weekly special at a restaurant or cafe",
  "A happy hour or drink promo at a bar",
  "A new menu item announcement",
  "A spa or salon service special",
  "A gym or studio class promo",
  "A wedding or event venue availability post",
  "A seasonal sale at a local shop",
  "A grand opening or anniversary announcement",
  "A holiday hours or closure notice",
  "A flash sale or limited-time discount",
  "A referral or loyalty program announcement",
  "A real estate listing or open house promo",
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Choose your package",
    body: "Pick the package that fits — from the $59.99 Promo Rescue up to the Local Campaign Kit.",
  },
  {
    step: "2",
    title: "Pay upfront",
    body: "Payment is required before work starts. This locks in your slot and turnaround window.",
  },
  {
    step: "3",
    title: "Send your promo details",
    body: "Tell me what you need promoted — the offer, event, service, or announcement — plus any logo or photo you have.",
  },
  {
    step: "4",
    title: "Get your first draft",
    body: "I'll send back your polished promo graphics, story versions, captions, and Google Business/Facebook versions.",
  },
  {
    step: "5",
    title: "Post it",
    body: "Request your included revision if needed, then post it wherever your business shows up online.",
  },
];

const WHAT_TO_SEND = [
  "Your business name",
  "Your logo (if you have one)",
  "A photo or a rough flyer/draft, even a phone photo is fine",
  "The offer, event, or announcement details",
  "The date and time, if relevant",
  "What you want people to do (the call to action)",
  "Where you plan to post it",
];

const NOT_INCLUDED_STATEMENT =
  "Complex video editing, filming, ad management, full branding, logo design, printing, and unlimited revisions are not included.";

type Package = {
  name: string;
  price: string;
  badge?: string;
  bestFor: string;
  includes: string[];
  note?: string;
  buttonLabel: string;
  link: string;
  image: string;
};

const PACKAGES: Package[] = [
  {
    name: "Promo Rescue",
    price: "$59.99 Limited Offer",
    bestFor:
      "Best for one flyer, event, offer, service, sale, menu item, or announcement that needs to look better fast.",
    includes: [
      "1 polished promo graphic",
      "1 story version",
      "1 caption",
      "1 Google Business / Facebook post version",
      "24-hour turnaround after payment and details are received",
      "1 small revision",
    ],
    buttonLabel: "Claim Promo Rescue",
    link: PROMO_RESCUE_LINK,
    image: ELIZA_BURGER_PROMO.src,
  },
  {
    name: "Social Promo Pack",
    price: "$149.99",
    badge: "Best Value",
    bestFor:
      "Best for small businesses that need more than one post or want a few polished pieces ready to go.",
    includes: [
      "3 polished promo graphics",
      "3 story versions",
      "3 captions",
      "3 Google Business / Facebook post versions",
      "48-hour turnaround after payment and details are received",
      "1 revision round",
    ],
    buttonLabel: "Get Social Promo Pack",
    link: SOCIAL_PROMO_PACK_LINK,
    image: HOTEL_INDIGO_COLLAGE.src,
  },
  {
    name: "Motion Boost Pack",
    price: "$249.99",
    bestFor:
      "Best for businesses that want their promo to feel more premium with a simple animated version.",
    includes: [
      "3 polished promo graphics",
      "3 story versions",
      "3 captions",
      "3 Google Business / Facebook post versions",
      "1 simple animated/motion promo",
      "48-hour turnaround after payment and details are received",
      "1 revision round",
    ],
    note: "Simple motion only. No filming or complex video editing included.",
    buttonLabel: "Get Motion Boost Pack",
    link: MOTION_BOOST_PACK_LINK,
    image: ELIZA_TAKEOUT_PROMO.src,
  },
  {
    name: "Local Campaign Kit",
    price: "$399.99",
    bestFor:
      "Best for businesses that need a fuller mini campaign for one offer, service, event, or seasonal push.",
    includes: [
      "5 polished promo graphics",
      "5 story versions",
      "5 captions",
      "5 Google Business / Facebook post versions",
      "2 simple animated/motion promos",
      "1 short 7-day posting plan",
      "3-day turnaround after payment and details are received",
      "1 revision round",
    ],
    buttonLabel: "Get Local Campaign Kit",
    link: LOCAL_CAMPAIGN_KIT_LINK,
    image: HAMPTON_FLOOD_FESTIVAL.src,
  },
];

const FAQS = [
  {
    q: "What counts as one promo?",
    a: "One offer, event, service, special, menu item, flyer, or announcement. One clear thing you want turned into a polished, ready-to-post graphic.",
  },
  {
    q: "How fast is the turnaround?",
    a: "24 hours from when I have everything I need from you (your details, plus any logo or photo).",
  },
  {
    q: "Do I need a logo or photo?",
    a: "It helps, but it's not required. If you don't have one, send what you do have, even a phone photo or a rough flyer, and I'll work with that.",
  },
  {
    q: "What if I have more than one promo?",
    a: "This offer covers one promo per order. If you have a few coming up, ask about a small multi-promo pack and I'll put one together for you.",
  },
  {
    q: "Can you do video or animation?",
    a: "Simple motion is available in the Motion Boost Pack and Local Campaign Kit. The $59.99 Promo Rescue package is focused on a static promo graphic, story version, caption, and Google Business/Facebook version. Complex video editing, filming, and full commercial production are not included.",
  },
  {
    q: "Is this only for Pennsylvania?",
    a: "This limited offer is currently focused on Pennsylvania small businesses first, but the service can work for any small business.",
  },
];

export default function PromoRescuePage() {
  return (
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury relative min-h-screen text-[#F6F1E7] font-[family-name:var(--font-geist-sans)]`}
    >
      <SeedanceBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.68)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black shadow-[0_0_22px_rgba(201,164,76,0.16)]">
              <Image
                src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
                alt="Archer Design logo"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div className="wordmark-font text-[0.88rem] sm:text-[0.96rem]">
              <span className="text-[#F6F1E7]">Archer</span>
              <span className="text-[#C9A44C]">Design</span>
            </div>
          </a>
          <nav className="flex items-center gap-5 text-sm text-[#A9A092]">
            <a href="/" className="hidden hover:text-[#F6F1E7] sm:inline">Home</a>
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Claim My $59.99 Promo Rescue →
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* 1. Hero — split layout: copy left, video card right */}
        <section className="relative overflow-hidden px-6 pb-14 pt-16 lg:pt-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Left: copy */}
              <div className="text-center lg:text-left">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C9A44C]">
                  Limited offer for small businesses
                </span>
                <h1 className="mt-4 font-serif text-[clamp(32px,5vw,56px)] font-semibold leading-tight text-[#F6F1E7]">
                  Get one promo cleaned up in 24 hours.
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[#A9A092] lg:mx-0">
                  Send one flyer, event, menu item, service special, sale, or announcement.
                  I&apos;ll turn it into a polished social-ready promo graphic, story version,
                  caption, and Google Business/Facebook post version.
                </p>

                <div className="mx-auto mt-8 max-w-sm lg:mx-0">
                  <div className="glass-card-strong rounded-2xl p-6 ring-1 ring-[rgba(201,164,76,0.3)]">
                    <p className="text-[13px] text-[#A9A092]">Normally</p>
                    <p className="text-[20px] text-[#A9A092] line-through">$99.99</p>
                    <p
                      className="mt-1 font-serif text-[clamp(28px,4vw,40px)] font-semibold bg-clip-text text-transparent"
                      style={{ backgroundImage: GOLD_GRADIENT }}
                    >
                      $59.99 Limited Offer
                    </p>
                    <p className="mt-3 text-[12px] text-[#A9A092]">
                      Limited discounted slots available. One promo per order.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <a
                    href={STRIPE_PAYMENT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                    style={{ background: GOLD_GRADIENT }}
                  >
                    Claim My $59.99 Promo Rescue <span aria-hidden>→</span>
                  </a>
                  <a
                    href="#examples"
                    className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] px-6 py-3.5 text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C]"
                  >
                    See real examples
                  </a>
                </div>
                <p className="mt-4 text-[12px] text-[#A9A092]">
                  Secure checkout through Stripe. After payment, send your promo details and
                  I&apos;ll begin your 24-hour cleanup.
                </p>
              </div>

              {/* Right: strong static promo image card */}
              <div>
                <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C] lg:text-left">
                  Promo samples built for fast local marketing
                </p>
                <div className="glass-card-strong overflow-hidden rounded-3xl p-2 ring-1 ring-[rgba(201,164,76,0.3)] sm:p-3">
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                    <PromoHeroVideo
                      src={PROMO_RESCUE_HERO_VIDEO}
                      poster={PROMO_RESCUE_HERO_IMAGE.src}
                      posterAlt={PROMO_RESCUE_HERO_IMAGE.alt}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real examples — visual proof: featured video + galleries + brand logos */}
        <section id="examples" className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Real examples
              </span>
              <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,40px)] font-semibold leading-tight text-[#F6F1E7]">
                See the kind of promo work your business can get.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#A9A092]">
                Restaurant specials, hotel promos, event flyers, service offers, and local
                campaigns — cleaned up and ready to post.
              </p>
            </div>

            {/* Curated carousel of unique promo examples */}
            <div className="mt-10">
              <PromoExampleCarousel items={PROMO_RESCUE_EXAMPLES} />
            </div>

            {/* Motion examples */}
            <div className="mt-14">
              <p className="text-center text-[12px] font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
                Motion examples
              </p>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {PROMO_RESCUE_MOTION_EXAMPLES.map((clip) => (
                  <PromoMotionCard
                    key={clip.src}
                    src={clip.src}
                    poster={clip.poster}
                    alt={clip.alt}
                    label={clip.label}
                  />
                ))}
              </div>
            </div>

            {/* Brand proof logo strip */}
            <div className="mt-14">
              <p className="text-center text-[12px] font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
                Brand proof
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                {BRAND_PROOF_LOGOS.map((logo) => (
                  <div
                    key={logo.src}
                    className="relative h-14 w-32 shrink-0 opacity-80 transition hover:opacity-100 sm:h-16 sm:w-40"
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
          </div>
        </section>

        {/* Mid-page CTA, after visual proof */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="glass-card-strong rounded-3xl p-8 ring-1 ring-[rgba(201,164,76,0.3)] md:p-10">
              <h2 className="font-serif text-[clamp(22px,3.2vw,34px)] font-semibold leading-tight text-[#F6F1E7]">
                Have one promo that needs to look this polished?
              </h2>
              <div className="mt-7">
                <a
                  href={STRIPE_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                  style={{ background: GOLD_GRADIENT }}
                >
                  Claim My $59.99 Promo Rescue <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / packages — moved below visual proof */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Packages
              </span>
              <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                Choose your promo package
              </h2>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`relative flex flex-col overflow-hidden rounded-2xl border ${
                    pkg.badge
                      ? "border-[#C9A44C] bg-[rgba(201,164,76,0.08)] shadow-[0_8px_40px_rgba(201,164,76,0.18)] lg:-translate-y-2"
                      : "glass-card border-[rgba(201,164,76,0.16)]"
                  }`}
                >
                  {pkg.badge && (
                    <span
                      className="absolute top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1a1407]"
                      style={{ background: GOLD_GRADIENT }}
                    >
                      {pkg.badge}
                    </span>
                  )}

                  <div className="relative h-32 w-full">
                    <Image
                      src={pkg.image}
                      alt={`${pkg.name} sample preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      loading="lazy"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(180deg, rgba(5,5,5,0) 50%, rgba(5,5,5,0.55) 100%)",
                      }}
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-[18px] font-semibold text-[#F6F1E7]">
                      {pkg.name}
                    </h3>
                    <p
                      className="mt-1.5 font-serif text-[22px] font-semibold bg-clip-text text-transparent"
                      style={{ backgroundImage: GOLD_GRADIENT }}
                    >
                      {pkg.price}
                    </p>
                    <p className="mt-3 text-[13px] leading-relaxed text-[#A9A092]">
                      {pkg.bestFor}
                    </p>

                    <div className="mt-4 flex-1 space-y-2">
                      {pkg.includes.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#D8CFBE]"
                        >
                          <span className="mt-[3px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                          {item}
                        </div>
                      ))}
                    </div>

                    {pkg.note && (
                      <p className="mt-4 text-[11.5px] italic leading-snug text-[#A9A092]">
                        {pkg.note}
                      </p>
                    )}

                    <a
                      href={pkg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13.5px] font-semibold transition hover:-translate-y-0.5 ${
                        pkg.badge
                          ? "text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                          : "border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] text-[#E8D7A2] hover:border-[#C9A44C]"
                      }`}
                      style={pkg.badge ? { background: GOLD_GRADIENT } : undefined}
                    >
                      {pkg.buttonLabel} <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-[12px] text-[#A9A092]">
              All packages are paid upfront. Work begins after payment and details are received.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-center text-[12px] leading-relaxed text-[#A9A092]">
              {NOT_INCLUDED_STATEMENT}
            </p>
          </div>
        </section>

        {/* 2. What You Get */}
        <section id="included" className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              The offer
            </span>
            <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
              What&apos;s included
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WHATS_INCLUDED.map((item) => (
                <div
                  key={item.title}
                  className="glass-card rounded-2xl border border-[rgba(201,164,76,0.16)] p-6"
                >
                  <h3 className="font-serif text-[16px] font-semibold text-[#F6F1E7]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#A9A092]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Who It's For */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Who this is for
            </span>
            <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
              Built for small businesses that need something posted now
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {BUSINESS_TYPES.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-[rgba(201,164,76,0.22)] bg-[rgba(201,164,76,0.05)] px-4 py-2 text-[13px] text-[#D8CFBE]"
                >
                  {type}
                </span>
              ))}
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-[#A9A092]">
              If you already have the offer, event, or announcement but the graphic looks
              rushed, this is for you.
            </p>
          </div>
        </section>

        {/* 4. Examples */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Examples
            </span>
            <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
              Perfect for promos like these
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {EXAMPLES.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-[rgba(201,164,76,0.14)] bg-[rgba(201,164,76,0.04)] px-4 py-3 text-[13.5px] text-[#D8CFBE]"
                >
                  <span className="mt-[3px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-[13px] text-[#A9A092]">
              Want to see more? Scroll back up to the real examples section for a full look at
              the promo work behind this offer.
            </p>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Process
            </span>
            <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
              How it works
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {HOW_IT_WORKS.map((item) => (
                <div
                  key={item.step}
                  className="glass-card rounded-2xl border border-[rgba(201,164,76,0.16)] p-6"
                >
                  <span
                    className="font-serif text-[26px] font-semibold bg-clip-text text-transparent"
                    style={{ backgroundImage: GOLD_GRADIENT }}
                  >
                    {item.step}
                  </span>
                  <h3 className="mt-2 font-serif text-[15px] font-semibold text-[#F6F1E7]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#A9A092]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. What To Send */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <div className="glass-card rounded-2xl border border-[rgba(201,164,76,0.16)] p-7 md:p-9">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Getting started
              </span>
              <h2 className="mt-3 font-serif text-[clamp(22px,3vw,32px)] font-semibold leading-tight text-[#F6F1E7]">
                What I need from you
              </h2>
              <div className="mt-5 space-y-2.5">
                {WHAT_TO_SEND.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[14.5px] text-[#D8CFBE]">
                    <span className="shrink-0 text-[#C9A44C]">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. About Archer Design */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                  Who&apos;s behind this
                </span>
                <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,36px)] font-semibold leading-tight text-[#F6F1E7]">
                  Built by Archer Design
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                  Archer Design is run by Devon Archer, a hospitality and small business creative
                  designer. Devon has created social graphics, promo campaigns, and event creative
                  for properties including Hotel Indigo Pittsburgh University-Oakland, Eliza Hot
                  Metal Bistro, and Hampton Inn properties, along with spa and wellness brands.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
                  Promo Rescue is a faster, smaller version of that same creative process, built
                  for small businesses that need one promo to look professional, fast.
                </p>
                <a
                  href="https://devonarcher.framer.website/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#E8D7A2] hover:text-[#C9A44C]"
                >
                  View portfolio <span aria-hidden>→</span>
                </a>
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-[rgba(201,164,76,0.16)] bg-[rgba(201,164,76,0.04)] p-3">
                  <p className="text-[12.5px] leading-snug text-[#A9A092]">
                    Selected hospitality and local business work includes hotel, restaurant,
                    event, and wellness brands — every promo gets the same level of polish.
                  </p>
                </div>
              </div>
              <div className="glass-card rounded-2xl border border-[rgba(201,164,76,0.16)] p-7">
                <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
                  Proven across hospitality and small business creative
                </p>
                <div className="grid grid-cols-2 gap-6 text-center">
                  {[
                    { value: "14.8M+", label: "Impressions" },
                    { value: "565K+", label: "Engagements" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div
                        className="font-serif text-[clamp(24px,3vw,34px)] font-semibold leading-none bg-clip-text text-transparent"
                        style={{ backgroundImage: GOLD_GRADIENT }}
                      >
                        {m.value}
                      </div>
                      <div className="mt-1.5 text-[12px] text-[#A9A092]">{m.label}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-[12px] text-[#A9A092]">
                  Figures reflect tracked hospitality campaign data across active client accounts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Scope / Not Included */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.35)] p-7 md:p-9">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
                Scope
              </span>
              <h2 className="mt-3 font-serif text-[clamp(22px,3vw,32px)] font-semibold leading-tight text-[#F6F1E7]">
                Simple scope, fast turnaround
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                Every package, from the $59.99 Promo Rescue up to the Local Campaign Kit,
                keeps a clear, fast scope. {NOT_INCLUDED_STATEMENT}
              </p>
              <p className="mt-5 text-[13.5px] leading-relaxed text-[#A9A092]">
                Have a few promos coming up? Ask about a small 3-promo mini pack instead of
                ordering one at a time.
              </p>
            </div>
          </div>
        </section>

        {/* After payment */}
        <section className="px-6 py-10">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-[rgba(201,164,76,0.18)] bg-[rgba(201,164,76,0.05)] p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
                After payment
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#D8CFBE]">
                After you pay, send your business name, promo details, logo/photo if you have
                one, and where you plan to post it. I&apos;ll send the first draft within 24
                hours after payment and details are received.
              </p>
            </div>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">FAQ</span>
              <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                Good questions.
              </h2>
            </div>
            <div className="divide-y divide-[rgba(201,164,76,0.18)]">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[18px] text-[#F6F1E7] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-2xl text-[#C9A44C] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] text-[#A9A092]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Final CTA */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="glass-card-strong rounded-3xl p-8 md:p-10 ring-1 ring-[rgba(201,164,76,0.3)]">
              <h2 className="font-serif text-[clamp(24px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                Have one promo that needs to look better?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                Send your details and get a polished, ready-to-post promo back within 24 hours.
              </p>
              <div className="mt-7">
                <a
                  href={STRIPE_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                  style={{ background: GOLD_GRADIENT }}
                >
                  Claim My $59.99 Promo Rescue <span aria-hidden>→</span>
                </a>
              </div>
              <p className="mt-4 text-[12px] text-[#A9A092]">
                Secure checkout through Stripe. After payment, send your promo details and
                I&apos;ll begin your 24-hour cleanup.
              </p>
              <div className="mt-5 border-t border-[rgba(201,164,76,0.18)] pt-5">
                <a
                  href={STRIPE_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] px-6 py-3.5 text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C]"
                >
                  Start with the $59.99 Promo Rescue <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(201,164,76,0.1)] px-6 py-14 text-center text-[13px] text-[#A9A092]">
        <div className="mx-auto flex w-fit items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black shadow-[0_0_18px_rgba(201,164,76,0.14)]">
            <Image
              src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
              alt="Archer Design logo"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="wordmark-font text-[0.74rem] text-[#F6F1E7]">
            <span className="text-[#F6F1E7]">Archer</span>
            <span className="text-[#C9A44C]">Design</span>
          </div>
        </div>
        <p className="mt-6 text-[11px] text-[#A9A092]/70">
          Archer Design — hospitality and small business creative support
        </p>
      </footer>
    </div>
  );
}
