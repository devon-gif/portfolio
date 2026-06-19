import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Allura, Fraunces } from "next/font/google";
import { SeedanceBackground } from "@/components/marketing/SeedanceBackground";
import { JsonLd } from "@/components/marketing/JsonLd";
import { PromoExampleCarousel } from "@/components/marketing/PromoExampleCarousel";
import { CoPilotHeroVideos, type HeroClip } from "@/components/marketing/CoPilotHeroVideos";
import { CoPilotWorkGallery, type WorkItem } from "@/components/marketing/CoPilotWorkGallery";
import { faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { GOLD_GRADIENT } from "@/components/marketing/media";

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

// ───────────────────────────────────────────────────────────────────────────
// CTA / PAYMENT LINKS
// Each package CTA reads one constant below. To turn a button into a real
// Stripe checkout, replace the matching mailto placeholder with a Stripe
// payment link. The existing $59.99 Promo Rescue Stripe link is kept here for
// reference — paste new links per package as you create them.
// ───────────────────────────────────────────────────────────────────────────
const CONTACT_EMAIL = "heydevon@gmail.com";

/** Build a prefilled intake email link for a given package. */
function intake(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

// Reference: existing live Stripe link (currently maps to the old $59.99 offer).
// const STRIPE_PROMO_RESCUE = "https://buy.stripe.com/8x2bJ21inf7H5mC0HucAo09";

// One-off package links (TODO(devon): swap mailto → Stripe link when ready)
const LINK_QUICK_POLISH = intake("Quick Polish — $29 (one-off)");
const LINK_RESCUE_LITE = intake("Promo Rescue Lite — $49 (one-off)");
const LINK_RESCUE_AI_KIT = intake("Promo Rescue AI Kit — $79 (one-off)");
const LINK_PROMO_SPRINT = intake("7-Day Promo Sprint — $149 (one-off)");
const LINK_CAMPAIGN_KIT = intake("Local Campaign Kit — $299–$399 (one-off)");

// Subscription links (TODO(devon): swap mailto → Stripe subscription link)
const LINK_LOCAL_SPARK = intake("Local Spark — $79.99/mo (beta)");
const LINK_LOCAL_PULSE = intake("Local Pulse — $149/mo");
const LINK_LOCAL_STARTER = intake("Local Starter — $249/mo");
const LINK_LOCAL_GROWTH = intake("Local Growth — $399/mo");
const LINK_RUN_IT = intake("Run It For Me — $599/mo");
const LINK_HOSPITALITY_PRO = intake("Hospitality / Event Pro — $899–$1,200/mo");

// Top-of-funnel CTAs
const LINK_FIX_ONE = "#one-offs";
const LINK_MONTHLY = "#monthly";
const LINK_EMAIL_DEVON = intake("Archer Local Co-Pilot — let's talk");

const TITLE = "Archer Design | AI-Powered Local Marketing Support";
const DESCRIPTION =
  "Affordable one-off promo design and monthly AI-assisted marketing support for restaurants, spas, hotels, venues, salons, cafes, and local businesses.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

// ── Media assets (served from /public) ──────────────────────────────────────
// Public-folder files with spaces are encoded per-segment so the URLs resolve.
const pub = (file: string) => `/${encodeURIComponent(file)}`;

// 1. Hero media rotator — strongest video clips with poster fallbacks.
const HERO_CLIPS: readonly HeroClip[] = [
  {
    src: "/promo-video.mp4",
    poster: pub("Image 2.png"),
    label: "Local promo reel",
    tag: "Promo video",
  },
  {
    src: "/poolside.mp4",
    poster: "/poolside-poster.jpg",
    label: "Hotel & resort lifestyle",
    tag: "Hotel",
  },
  {
    src: "/pancakes.mp4",
    poster: "/pancakes-poster.jpg",
    label: "Restaurant & F&B motion",
    tag: "Restaurant",
  },
  {
    src: "/timelapse.mp4",
    poster: "/timelapse-poster.jpg",
    label: "Design process timelapse",
    tag: "Behind the work",
  },
];

// 2. Featured creative slideshow — finished campaign graphics.
const CREATIVE_SLIDES = [
  { src: pub("lime drink drink minty.png"), alt: "“Minty Fresh” cocktail promo graphic", label: "Drink special" },
  { src: pub("Image 2.png"), alt: "Hotel Indigo room & lobby social campaign", label: "Hotel campaign" },
  { src: pub("Image 5.png"), alt: "Eliza Hot Metal Bistro burger promo, 15% off", label: "F&B special" },
  { src: pub("Image 7.png"), alt: "Eliza Hot Metal Bistro Take-Out Wednesday promo", label: "Restaurant promo" },
  { src: pub("Image 6.png"), alt: "Eliza Hot Metal Bistro live music flyer", label: "Event flyer" },
  { src: pub("Image 3.png"), alt: "Eliza Hot Metal Bistro wine & holiday billboard", label: "Local campaign" },
  { src: pub("Image 4.png"), alt: "Hampton Inn flood festival event flyer", label: "Hotel event" },
] as const;

// 3. Recent work / campaigns / builds — broader portfolio gallery.
const WORK_ITEMS: readonly WorkItem[] = [
  { src: pub("Screenshot 2026-06-19 at 11.45.11 AM.png"), alt: "Vigilant — real-time intelligence app launch creative", tag: "AI-assisted build" },
  { src: pub("Screenshot 2026-06-19 at 11.40.43 AM.png"), alt: "Steelers x Hampton x Eliza event giveaway posters", tag: "Event campaign" },
  { src: pub("Screenshot 2026-06-19 at 11.40.53 AM.png"), alt: "Hampton by Hilton shuttle service promo", tag: "Hotel promo" },
  { src: pub("Screenshot 2026-06-19 at 11.40.22 AM.png"), alt: "Maximus full brand identity system", tag: "Brand system" },
  { src: pub("Screenshot 2026-06-18 at 3.16.24 PM.png"), alt: "Three Tower Estates business card set", tag: "Brand identity" },
  { src: pub("Screenshot 2026-06-19 at 11.40.13 AM.png"), alt: "SA fragrance product campaign shot", tag: "Product campaign" },
  { src: pub("Screenshot 2026-06-19 at 11.40.29 AM.png"), alt: "Nike sneaker product launch visual", tag: "Product campaign" },
  { src: pub("Screenshot 2026-06-19 at 11.41.05 AM.png"), alt: "Bang & Olufsen headphones product shot", tag: "Product campaign" },
  { src: pub("Screenshot 2026-06-19 at 11.40.36 AM.png"), alt: "CHUG water bottle branding concept", tag: "Product branding" },
  { src: pub("Screenshot 2026-06-18 at 3.17.24 PM.png"), alt: "Backcountry outdoor mural / billboard campaign", tag: "Outdoor campaign" },
  { src: pub("Screenshot 2026-06-19 at 11.43.08 AM.png"), alt: "Eliza Hot Metal Bistro logo, debossed mockup", tag: "Logo / branding" },
];

// 4. Client / brand proof logos.
const BRAND_LOGOS = [
  { src: pub("Hampton-Brand-Logo_TM_CMYK_Full-Color.png"), alt: "Hampton by Hilton" },
  { src: pub("PITTSBURGH UNI-OAK_RGB_canvas_white_on_indigo_blue.png"), alt: "Hotel Indigo Pittsburgh University-Oakland" },
  { src: pub("Elements Full logo- NO BACK GROUND.png"), alt: "Elements" },
  { src: pub("Untitled.png"), alt: "Eliza Hot Metal Bistro" },
] as const;

// ── Hero supporting points ──────────────────────────────────────────────────
const HERO_POINTS = [
  "24-hour one-off promo options",
  "Monthly plans starting at $79.99/mo",
  "Built for restaurants, spas, salons, hotels, venues, cafes & local businesses",
  "AI-assisted, human-edited, owner-friendly",
];

// ── Hero mini "how it works" ────────────────────────────────────────────────
const HERO_STEPS = [
  { n: "1", t: "Text us the promo", d: "A special, event, menu item, or photo." },
  { n: "2", t: "We turn it into marketing", d: "Posts, stories, captions, Google updates." },
  { n: "3", t: "You post — or we keep it moving", d: "One-off, or recurring every month." },
];

// ── Problem section ─────────────────────────────────────────────────────────
const PROBLEMS = [
  "You know you should post more.",
  "Your specials happen fast.",
  "Flyers are rushed.",
  "Google Business gets ignored.",
  "Captions take too long.",
  "Your business looks less polished online than it does in real life.",
  "Hiring an agency is too expensive.",
  "Hiring a full-time marketer is unrealistic.",
];

type Pkg = {
  name: string;
  price: string;
  priceNote?: string;
  badge?: string;
  bestFor?: string;
  includes: string[];
  note?: string;
  buttonLabel: string;
  link: string;
  highlight?: boolean;
};

// ── One-off offers ──────────────────────────────────────────────────────────
const ONE_OFFS: Pkg[] = [
  {
    name: "Quick Polish",
    price: "$29",
    bestFor: "You already have a flyer or post — it just looks rough.",
    includes: [
      "1 cleaned-up feed graphic",
      "Basic layout polish",
      "48-hour turnaround",
      "No strategy",
      "1 tiny text fix only",
    ],
    buttonLabel: "Start Quick Polish",
    link: LINK_QUICK_POLISH,
  },
  {
    name: "Promo Rescue Lite",
    price: "$49",
    bestFor: "One promo, ready for the feed and stories.",
    includes: [
      "1 polished feed graphic",
      "1 story version",
      "1 caption",
      "24–48 hour turnaround",
      "1 small revision",
    ],
    buttonLabel: "Start Rescue Lite",
    link: LINK_RESCUE_LITE,
  },
  {
    name: "Promo Rescue AI Kit",
    price: "$79",
    badge: "Most Popular",
    bestFor: "One promo, built to actually post today.",
    includes: [
      "1 polished feed graphic",
      "1 story version",
      "1 caption",
      "3 headline / hook options",
      "1 Google Business / Facebook version",
      "“Post This Today” checklist",
      "24-hour turnaround after details",
      "1 small revision",
    ],
    buttonLabel: "Start AI Kit",
    link: LINK_RESCUE_AI_KIT,
    highlight: true,
  },
  {
    name: "7-Day Promo Sprint",
    price: "$149",
    bestFor: "One promo turned into a full week of content.",
    includes: [
      "3 feed graphics",
      "3 story graphics",
      "7 caption ideas",
      "Google / Facebook post copy",
      "Email / SMS copy",
      "Simple 7-day posting plan",
    ],
    buttonLabel: "Start the Sprint",
    link: LINK_PROMO_SPRINT,
  },
  {
    name: "Local Campaign Kit",
    price: "$299",
    priceNote: "starting at $299–$399",
    bestFor: "A fuller campaign for an event, season, or big offer.",
    includes: [
      "Campaign concept",
      "5–7 graphics",
      "Stories",
      "Captions",
      "Google Business posts",
      "Email / SMS copy",
      "Simple campaign calendar",
    ],
    buttonLabel: "Plan a Campaign",
    link: LINK_CAMPAIGN_KIT,
  },
];

// ── Subscriptions ───────────────────────────────────────────────────────────
const SUBSCRIPTIONS: Pkg[] = [
  {
    name: "Local Spark",
    price: "$79.99",
    priceNote: "/mo",
    badge: "Easiest Starter",
    bestFor: "For tiny businesses that just need to stop looking inactive online.",
    includes: [
      "2 feed posts/month",
      "2 story versions/month",
      "2 Google Business / Facebook versions/month",
      "Captions included",
      "1 monthly “what to post next” idea list",
      "Owner provides photos / details",
    ],
    note:
      "No scheduling, no full campaign planning, no monthly report. No revisions, or 1 tiny text fix/month. Limited beta pricing for the first 3 businesses.",
    buttonLabel: "Start Local Spark",
    link: LINK_LOCAL_SPARK,
  },
  {
    name: "Local Pulse",
    price: "$149",
    priceNote: "/mo",
    bestFor: "For tiny businesses that just need to stay visible.",
    includes: [
      "4 feed posts/month",
      "4 story versions",
      "4 Google Business / Facebook versions",
      "Captions included",
      "Monthly mini content plan",
      "Owner sends photos / specials as needed",
    ],
    note: "Best for: cafes, solo salons, small shops, diners.",
    buttonLabel: "Start Local Pulse",
    link: LINK_LOCAL_PULSE,
  },
  {
    name: "Local Starter",
    price: "$249",
    priceNote: "/mo",
    badge: "Best Starting Point",
    bestFor: "The best starter plan for most local businesses.",
    includes: [
      "8 feed posts/month",
      "8 story versions",
      "4 Google Business updates",
      "1 Promo Rescue/month",
      "Caption pack",
      "Monthly promo calendar",
      "Light AI offer ideas",
    ],
    note: "Best for: restaurants, salons, spas, cafes, local services.",
    buttonLabel: "Start Local Starter",
    link: LINK_LOCAL_STARTER,
    highlight: true,
  },
  {
    name: "Local Growth",
    price: "$399",
    priceNote: "/mo",
    bestFor: "For businesses with weekly specials or events.",
    includes: [
      "12 feed posts/month",
      "8 story versions",
      "4 Google Business updates",
      "2 Promo Rescues/month",
      "1 Reel script/month",
      "1 email or SMS promo/month",
      "Review-to-promo post",
      "Monthly mini report",
    ],
    note: "Best for: restaurants, wellness brands, med spas, event-heavy businesses.",
    buttonLabel: "Start Local Growth",
    link: LINK_LOCAL_GROWTH,
  },
  {
    name: "Run It For Me",
    price: "$599",
    priceNote: "/mo",
    badge: "Most Hands-Off",
    bestFor: "For owners who want the most hands-off affordable plan.",
    includes: [
      "16 feed posts/month",
      "12 story versions",
      "4 Google Business updates",
      "2 promo campaigns/month",
      "Review-to-promo posts",
      "Captions included",
      "Scheduling support or ready-to-schedule delivery",
      "Monthly report",
    ],
    note: "Best for: busy restaurants, salons, spas, gyms, venues, local services.",
    buttonLabel: "Start Run It For Me",
    link: LINK_RUN_IT,
  },
  {
    name: "Hospitality / Event Pro",
    price: "$899",
    priceNote: "starting at $899–$1,200/mo",
    bestFor: "For hotels, venues, private dining, restaurants, spas & event businesses.",
    includes: [
      "Event promos & seasonal packages",
      "Private dining / meeting / booking offers",
      "16+ posts/month",
      "Stories",
      "Google updates",
      "Campaign planning",
      "Light landing page / web promo support",
      "Monthly reporting",
    ],
    note: "Best for: hotels, venues, restaurants, spas, tourism businesses.",
    buttonLabel: "Talk to Devon",
    link: LINK_HOSPITALITY_PRO,
  },
];

// ── Feature grid (grouped) ──────────────────────────────────────────────────
const FEATURE_GROUPS = [
  {
    heading: "Content & posting",
    items: [
      "Text-to-Post Intake",
      "Weekly Content Calendar",
      "Monthly Promo Map",
      "Story Sequence Builder",
      "Menu Item Spotlight",
      "Service Spotlight Posts",
      "Staff Spotlight Posts",
      "Monthly Visual Refresh",
    ],
  },
  {
    heading: "Words & captions",
    items: [
      "AI Caption Pack",
      "Hashtag + Local Keyword Pack",
      "Email Promo Copy",
      "SMS Promo Copy",
      "FAQ-to-Content Generator",
      "Review-to-Post Converter",
    ],
  },
  {
    heading: "Channels & visibility",
    items: [
      "Google Business Post Generator",
      "Facebook Community Post Version",
      "Holiday Promo Templates",
      "Event Flyer Refresh",
      "Menu / Special Board Graphics",
      "Before/After Promo Cleanup",
    ],
  },
  {
    heading: "AI ideas & strategy",
    items: [
      "AI Offer Optimizer",
      "AI Promo Ideas of the Month",
      "AI Local Event Tie-In",
      "AI Competitor Snapshot",
      "AI Brand Voice Sheet",
      "Slow Day Promo Generator",
    ],
  },
  {
    heading: "Systems & brand",
    items: [
      "Mini Brand System",
      "Reusable Canva Templates",
      "Photo Direction Checklist",
      "Private Event / Catering Promo Kit",
    ],
  },
];

// ── Built for (industries) ──────────────────────────────────────────────────
const INDUSTRIES = [
  "Restaurants",
  "Cafes",
  "Bakeries",
  "Spas",
  "Salons",
  "Med spas",
  "Hotels",
  "Boutique hotels",
  "Hotel restaurants",
  "Wedding venues",
  "Event venues",
  "Gyms",
  "Fitness studios",
  "Local service businesses",
  "Tourism businesses",
  "Local shops",
];

// ── Proof ───────────────────────────────────────────────────────────────────
const PROOF_PRIMARY = [
  { value: "14.8M+", label: "Impressions" },
  { value: "4.3M+", label: "Reach" },
  { value: "670K+", label: "Reported post clicks" },
  { value: "565K+", label: "Engagements" },
];
const PROOF_SECONDARY = [
  { value: "2.5K+", label: "Creative pieces / posts tracked" },
  { value: "12.9K+", label: "Comments" },
  { value: "11.4K+", label: "Shares" },
];

// ── How it works ────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    n: "1",
    t: "Send us what’s happening",
    d: "Text, email, or submit your special, event, offer, menu item, service, photo, or idea.",
  },
  {
    n: "2",
    t: "We turn it into marketing",
    d: "Graphics, captions, stories, Google updates, hooks, and a posting plan.",
  },
  {
    n: "3",
    t: "You approve",
    d: "We revise small details if needed.",
  },
  {
    n: "4",
    t: "You post — or we keep it moving",
    d: "One-off, or recurring monthly support.",
  },
];

// ── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "Do you guarantee sales?",
    a: "No. We help your business show up consistently and professionally. Results depend on offer, audience, timing, and many other factors.",
  },
  {
    q: "Do you use AI?",
    a: "Yes. AI helps with speed, ideas, captions, variations, and workflows. Everything is reviewed and edited by a human designer.",
  },
  {
    q: "Do I need professional photos?",
    a: "No. We can work with phone photos, screenshots, existing flyers, menus, or simple details. Better photos help, but they are not required.",
  },
  {
    q: "Do you post for me?",
    a: "For lower plans, we deliver ready-to-post assets. For higher plans, scheduling support can be included depending on platform access and approval process.",
  },
  {
    q: "Can I cancel monthly?",
    a: "Yes. Month-to-month plans are simple and low-pressure.",
  },
  {
    q: "Who is this best for?",
    a: "Restaurants, salons, spas, cafes, hotels, venues, local shops, wellness brands, and small businesses that need consistent promos but cannot hire a full-time marketer.",
  },
  {
    q: "What do you need from me?",
    a: "The offer, dates, any photos/logo, and basic details. If you do not know what to post, we can help generate ideas.",
  },
];

// ── Shared button styles ────────────────────────────────────────────────────
const goldBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] px-6 py-3.5 text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C]";

function PackageCard({ pkg }: { pkg: Pkg }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        pkg.highlight
          ? "border-[#C9A44C] bg-[rgba(201,164,76,0.08)] shadow-[0_8px_40px_rgba(201,164,76,0.18)] lg:-translate-y-2"
          : "glass-card border-[rgba(201,164,76,0.16)]"
      }`}
    >
      {pkg.badge && (
        <span
          className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1a1407]"
          style={{ background: GOLD_GRADIENT }}
        >
          {pkg.badge}
        </span>
      )}

      <h3 className="font-serif text-[18px] font-semibold text-[#F6F1E7]">{pkg.name}</h3>

      <div className="mt-1.5 flex items-baseline gap-1">
        <span
          className="font-serif text-[28px] font-semibold bg-clip-text text-transparent"
          style={{ backgroundImage: GOLD_GRADIENT }}
        >
          {pkg.price}
        </span>
        {pkg.priceNote && (
          <span className="text-[12.5px] text-[#A9A092]">{pkg.priceNote}</span>
        )}
      </div>

      {pkg.bestFor && (
        <p className="mt-3 text-[13px] leading-relaxed text-[#A9A092]">{pkg.bestFor}</p>
      )}

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
        <p className="mt-4 text-[11.5px] italic leading-snug text-[#A9A092]">{pkg.note}</p>
      )}

      <a
        href={pkg.link}
        className={`mt-6 ${
          pkg.highlight
            ? goldBtn + " w-full px-5 py-3 text-[13.5px]"
            : ghostBtn + " w-full px-5 py-3 text-[13.5px]"
        }`}
        style={pkg.highlight ? { background: GOLD_GRADIENT } : undefined}
      >
        {pkg.buttonLabel} <span aria-hidden>→</span>
      </a>
    </div>
  );
}

export default function ArcherLocalCoPilotHome() {
  return (
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury relative min-h-screen text-[#F6F1E7] font-[family-name:var(--font-geist-sans)]`}
    >
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Archer Local Co-Pilot — AI-Powered Local Marketing Support",
            description: DESCRIPTION,
            path: "/",
            serviceType: "Local business marketing and social media content service",
          }),
          faqJsonLd(FAQ.map(({ q, a }) => ({ q, a }))),
        ]}
      />
      <SeedanceBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.68)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
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
          </Link>
          <nav className="flex items-center gap-5 text-sm text-[#A9A092]">
            <a href="#one-offs" className="hidden hover:text-[#F6F1E7] sm:inline">One-Offs</a>
            <a href="#monthly" className="hidden hover:text-[#F6F1E7] sm:inline">Monthly Plans</a>
            <a href="#how-it-works" className="hidden hover:text-[#F6F1E7] md:inline">How It Works</a>
            <a href="#proof" className="hidden hover:text-[#F6F1E7] md:inline">Proof</a>
            <a href="#faq" className="hidden hover:text-[#F6F1E7] md:inline">FAQ</a>
            <a
              href={LINK_MONTHLY}
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Start →
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden px-6 pb-14 pt-16 lg:pt-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="text-center lg:text-left">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C9A44C]">
                  Archer Local Co-Pilot
                </span>
                <h1 className="mt-4 font-serif text-[clamp(34px,5.2vw,58px)] font-semibold leading-tight text-[#F6F1E7]">
                  Stop trying to keep up with marketing by yourself.
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[#A9A092] lg:mx-0">
                  Send us what’s happening — a special, menu item, event, service offer, photo, or
                  idea — and we’ll turn it into ready-to-post graphics, captions, stories, Google
                  updates, and a simple promo plan.
                </p>
                <p className="mx-auto mt-3 max-w-xl font-serif text-[17px] text-[#E8D7A2] lg:mx-0">
                  You run the business. We keep the marketing moving.
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <a href={LINK_FIX_ONE} className={goldBtn} style={{ background: GOLD_GRADIENT }}>
                    Fix One Promo <span aria-hidden>→</span>
                  </a>
                  <a href={LINK_MONTHLY} className={ghostBtn}>
                    Run My Monthly Marketing
                  </a>
                </div>

                <ul className="mx-auto mt-8 grid max-w-xl gap-2.5 text-left sm:grid-cols-2 lg:mx-0">
                  {HERO_POINTS.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[13.5px] text-[#D8CFBE]">
                      <span className="mt-[5px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: hero video rotator + "how it works" mini card */}
              <div className="space-y-4">
                <CoPilotHeroVideos clips={HERO_CLIPS} />
                <div className="glass-card-strong rounded-3xl p-6 ring-1 ring-[rgba(201,164,76,0.3)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                    One text becomes a full mini campaign
                  </p>
                  <div className="mt-4 space-y-3">
                    {HERO_STEPS.map((s) => (
                      <div key={s.n} className="flex items-start gap-3">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-serif text-[13px] font-semibold text-[#1a1407]"
                          style={{ background: GOLD_GRADIENT }}
                        >
                          {s.n}
                        </span>
                        <div>
                          <p className="text-[14px] font-semibold text-[#F6F1E7]">{s.t}</p>
                          <p className="text-[12.5px] leading-snug text-[#A9A092]">{s.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand proof strip */}
        <section className="px-6 pb-4 pt-2">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A9A092]">
              Creative trusted on real hotel, restaurant & event brands
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
              {BRAND_LOGOS.map((logo) => (
                <div
                  key={logo.src}
                  className="relative h-9 w-28 shrink-0 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-11 sm:w-36"
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

        {/* 2. Problem */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Sound familiar?
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Your business looks better in real life than it does online.
              </h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {PROBLEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-[rgba(201,164,76,0.12)] bg-[rgba(5,5,5,0.28)] p-4 text-[14px] text-[#D8CFBE]"
                  >
                    <span className="mt-[5px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-7 font-serif text-[18px] text-[#E8D7A2]">
                Most owners don’t need a huge agency. They need someone to keep the weekly marketing
                moving.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Meet the offer */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card-strong rounded-3xl p-8 ring-1 ring-[rgba(201,164,76,0.3)] md:p-12">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                The new offer
              </span>
              <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
                Meet Archer Local Co-Pilot
              </h2>
              <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#A9A092]">
                A simple monthly marketing support service for businesses that need consistent posts,
                promos, Google updates, captions, stories, and campaign ideas — without hiring a
                full-time designer or agency.
              </p>
              <p className="mt-4 max-w-3xl font-serif text-[18px] text-[#F6F1E7]">
                Think of it as a tiny AI-powered marketing team for your local business. AI speed.
                Human taste. Local-business practicality.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={LINK_FIX_ONE} className={goldBtn} style={{ background: GOLD_GRADIENT }}>
                  Fix One Promo <span aria-hidden>→</span>
                </a>
                <a href={LINK_MONTHLY} className={ghostBtn}>
                  Run My Monthly Marketing
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured creative slideshow */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Recent creative work
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                From one photo or promo to a full campaign.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                Real promos, specials, events, and social graphics — built to make local businesses
                look active, polished, and ready to book.
              </p>
            </div>
            <div className="mt-10">
              <PromoExampleCarousel items={CREATIVE_SLIDES} />
            </div>
          </div>
        </section>

        {/* 4. One-off offers */}
        <section id="one-offs" className="scroll-mt-24 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                One-off offers
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Need one thing fixed fast? Start here.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                Send us the special. We’ll turn it into the post. No subscription required.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {ONE_OFFS.map((pkg) => (
                <PackageCard key={pkg.name} pkg={pkg} />
              ))}
            </div>
            <p className="mt-8 text-[12px] text-[#A9A092]">
              All one-offs are paid upfront; work begins once payment and details are received.
              Complex video, filming, ad management, and full branding are not included.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-2">
          <div className="gold-divider opacity-30" />
        </div>

        {/* 5. Subscriptions */}
        <section id="monthly" className="scroll-mt-24 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Monthly plans
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Want us to keep it moving every month?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                No full-time hire. No huge agency retainer. Just consistent marketing support,
                month to month.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SUBSCRIPTIONS.map((pkg) => (
                <PackageCard key={pkg.name} pkg={pkg} />
              ))}
            </div>
            <p className="mt-8 text-[12px] text-[#A9A092]">
              Month-to-month, cancel anytime. Owner sends photos and details as needed. Scheduling
              support is included only on the plans where it’s listed.
            </p>
          </div>
        </section>

        {/* 6. Feature grid */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                What’s under the hood
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Everything that keeps your marketing moving.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FEATURE_GROUPS.map((group) => (
                <div
                  key={group.heading}
                  className="glass-card rounded-2xl border border-[rgba(201,164,76,0.16)] p-6"
                >
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#C9A44C]">
                    {group.heading}
                  </h3>
                  <div className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[#D8CFBE]"
                      >
                        <span className="mt-[4px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Built for */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Built for
            </span>
            <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
              Made for real local businesses with real deadlines.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {INDUSTRIES.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-[rgba(201,164,76,0.22)] bg-[rgba(201,164,76,0.05)] px-4 py-2 text-[13px] text-[#D8CFBE]"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Proof */}
        <section id="proof" className="scroll-mt-24 px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card-strong rounded-3xl p-8 ring-1 ring-[rgba(201,164,76,0.3)] md:p-12">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                The proof
              </span>
              <h2 className="mt-3 font-serif text-[clamp(24px,3.2vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                AI speed. Human taste. Tracked results.
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#A9A092]">
                Across tracked hospitality, hotel, restaurant, event, and wellness campaigns, Devon’s
                creative work has contributed to:
              </p>
              <div className="mt-7 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {PROOF_PRIMARY.map((m) => (
                  <div key={m.label} className="text-center sm:text-left">
                    <div
                      className="font-serif text-[clamp(28px,3.4vw,40px)] font-semibold leading-none bg-clip-text text-transparent"
                      style={{ backgroundImage: GOLD_GRADIENT }}
                    >
                      {m.value}
                    </div>
                    <div className="mt-2 text-[12.5px] text-[#A9A092]">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {PROOF_SECONDARY.map((m) => (
                  <span
                    key={m.label}
                    className="rounded-full border border-[rgba(201,164,76,0.18)] bg-[rgba(201,164,76,0.04)] px-4 py-2 text-[13px] text-[#D8CFBE]"
                  >
                    <span className="font-semibold text-[#E8D7A2]">{m.value}</span> {m.label}
                  </span>
                ))}
              </div>
              <p className="mt-7 text-[12px] leading-relaxed text-[#A9A092]">
                Figures are cumulative across tracked hotel, restaurant, spa, event, wellness, and
                local business campaigns — not the result of any single client. Results depend on
                offer, audience, timing, and many other factors.
              </p>
            </div>
          </div>
        </section>

        {/* Recent work, campaigns & builds gallery */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Recent work, campaigns & builds
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Campaign assets, promos, videos & local marketing systems.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                A wider look at the branding, product, event, and AI-assisted build work behind
                Archer Design.
              </p>
            </div>
            <div className="mt-10">
              <CoPilotWorkGallery items={WORK_ITEMS} />
            </div>
          </div>
        </section>

        {/* 9. How it works */}
        <section id="how-it-works" className="scroll-mt-24 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                How it works
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                One text becomes a full mini campaign.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((s) => (
                <div
                  key={s.n}
                  className="glass-card rounded-2xl border border-[rgba(201,164,76,0.16)] p-6"
                >
                  <span
                    className="font-serif text-[28px] font-semibold bg-clip-text text-transparent"
                    style={{ backgroundImage: GOLD_GRADIENT }}
                  >
                    {s.n}
                  </span>
                  <h3 className="mt-2 font-serif text-[16px] font-semibold text-[#F6F1E7]">{s.t}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#A9A092]">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. FAQ */}
        <section id="faq" className="scroll-mt-24 px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">FAQ</span>
              <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
                Good questions.
              </h2>
            </div>
            <div className="divide-y divide-[rgba(201,164,76,0.18)]">
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-[#F6F1E7] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-2xl text-[#C9A44C] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] text-[#A9A092]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Final CTA */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="glass-card-strong rounded-3xl p-8 ring-1 ring-[rgba(201,164,76,0.3)] md:p-10">
              <h2 className="font-serif text-[clamp(26px,4vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Ready to stop guessing what to post?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                Send us the special, event, menu item, service offer, or photo. We’ll turn it into
                ready-to-post marketing.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={LINK_FIX_ONE} className={goldBtn} style={{ background: GOLD_GRADIENT }}>
                  Fix One Promo <span aria-hidden>→</span>
                </a>
                <a href={LINK_MONTHLY} className={ghostBtn}>
                  Start Monthly Support
                </a>
              </div>
              <div className="mt-5 border-t border-[rgba(201,164,76,0.18)] pt-5">
                <a
                  href={LINK_EMAIL_DEVON}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8D7A2] hover:text-[#C9A44C]"
                >
                  Email Devon <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(201,164,76,0.1)] px-6 py-16 text-center text-[13px] text-[#A9A092]">
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
        <p className="mt-4 font-serif text-[clamp(18px,2.4vw,26px)] text-[#F6F1E7]">
          You run the business.{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD_GRADIENT }}>
            We keep the marketing moving.
          </span>
        </p>
        <p className="mt-6 text-[11px] text-[#A9A092]/70">
          Archer Design — AI-assisted local marketing support for restaurants, spas, hotels, venues,
          salons, cafes, and local businesses.
        </p>
        <p className="mt-3 text-[11px] text-[#A9A092]/60">
          <Link href="/hotel-groups" className="hover:text-[#C9A44C]">
            Hotel groups & multi-property creative →
          </Link>
        </p>
      </footer>
    </div>
  );
}
