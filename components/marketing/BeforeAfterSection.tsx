import { GALLERY_IMAGES, GOLD_GRADIENT, MOTION_CAROUSEL } from "./media";
import { LazyVideo } from "./LazyVideo";

// ─────────────────────────────────────────────────────────────────────────────
// Before/After section — proves the creative system on real portfolio assets.
// "After" media uses existing legitimate portfolio examples (gallery images +
// motion). "Before" sides are labeled Starting point: real client before-inputs
// aren't published, so we describe the input honestly instead of faking one.
// TODO(devon): replace `afterImage`/`afterVideo` with specific before/after
// pairs as you export them (see docs/sales/before-after-website-content.md).
// ─────────────────────────────────────────────────────────────────────────────

interface BACard {
  category: string;
  before: string;
  problem: string;
  after: string;
  whatChanged: string;
  businessValue: string;
  bestUseCase: string;
  afterImage?: { src: string; alt: string };
  afterVideo?: { src: string; label: string };
  placeholderNote?: string;
}

// Featured three (top row, with media)
const FEATURED: BACard[] = [
  {
    category: "Hotel Property → Premium Campaign",
    before: "A normal room, exterior, lobby, or amenity photo.",
    problem: "The property looks great in person, but the online creative doesn't reflect the value.",
    after: "A polished hotel campaign asset that feels premium and brand-consistent.",
    whatChanged: "Professional finish: light, color, composition, branded treatment, and a campaign reason to post.",
    businessValue: "Stronger perceived value, better first impressions, and more usable content for property-level marketing.",
    bestUseCase: "Boutique and premium properties whose feed undersells the in-person experience.",
    afterImage: { src: GALLERY_IMAGES[1].src, alt: "Polished hotel guest suite campaign visual by Archer Design" },
  },
  {
    category: "Menu Item / F&B Special → Restaurant Campaign",
    before: "A food photo, menu item, or restaurant special.",
    problem: "The offer exists, but there's no scroll-stopping creative around it.",
    after: "A branded F&B campaign graphic or short-form motion concept.",
    whatChanged: "Color and texture work, branded layout, offer framing tied to a day, season, or special.",
    businessValue: "Better restaurant awareness, more private dining and event support, stronger local promotion.",
    bestUseCase: "Hotel restaurants and bars with strong menus and quiet feeds — Eliza-style F&B programs.",
    afterVideo: { src: MOTION_CAROUSEL[0].src, label: "Bar and cocktail campaign motion" },
  },
  {
    category: "Local Event → Hotel Booking Campaign",
    before: "A local event name, date, or basic event info.",
    problem: "Hotels miss the chance to turn nearby events into reasons to book.",
    after: "A hotel-branded event campaign that connects the property to the local demand driver.",
    whatChanged: "The event becomes the creative hook; the property becomes the obvious place to stay.",
    businessValue: "Relevant local campaigns and event-driven booking support, inside the booking window.",
    bestUseCase: "Properties near venues, stadiums, festivals, or conference traffic — Hampton-style local campaigns.",
    afterImage: { src: GALLERY_IMAGES[3].src, alt: "Hotel event campaign creative by Archer Design" },
  },
];

// Expanded three (collapsible row)
const MORE: BACard[] = [
  {
    category: "Plain Schedule → Branded Monthly Calendar",
    before: "A list of dates: live music, trivia nights, performers, property events.",
    problem: "Schedules are useful, but they look plain and are easy to ignore.",
    after: "A branded monthly event calendar guests save and share.",
    whatChanged: "A designed, reusable calendar system in the property's brand, refreshed monthly.",
    businessValue: "Consistent event promotion and easier sharing across social, email, and on-property channels.",
    bestUseCase: "Bars, restaurants, and event-driven properties with recurring programming — Eliza-style live music calendars.",
    placeholderNote: "Calendar example being added — ask to see the live version.",
  },
  {
    category: "Spa Service → Wellness Campaign",
    before: "A spa service, treatment name, or seasonal wellness offer.",
    problem: "The service is strong, but it needs visual polish and offer framing.",
    after: "A calm, premium wellness campaign asset.",
    whatChanged: "A serene visual language, service-specific creative, and seasonal timing (gift seasons especially).",
    businessValue: "Better promotion for spa services, seasonal campaigns, and local wellness audiences.",
    bestUseCase: "Hotel spas and wellness brands whose creative should feel like the treatment room.",
    afterImage: { src: GALLERY_IMAGES[2].src, alt: "Spa and wellness campaign creative by Archer Design" },
  },
  {
    category: "Basic Brand Asset → Polished Campaign System",
    before: "A logo, an offer, or a rough campaign idea.",
    problem: "The idea exists, but it needs a campaign identity.",
    after: "A polished visual system: social graphics, reel cover, story asset, and caption direction.",
    whatChanged: "New branded creative built as a system — one idea becomes a coordinated set, not a one-off graphic.",
    businessValue: "One idea becomes multiple usable campaign assets across every channel.",
    bestUseCase: "Seasonal launches, packages, and group-wide campaigns that need consistency across properties.",
    afterImage: { src: GALLERY_IMAGES[4].src, alt: "Seasonal campaign visual system by Archer Design" },
  },
];

function AfterMedia({ card }: { card: BACard }) {
  if (card.afterVideo) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden bg-black">
        <LazyVideo src={card.afterVideo.src} label={card.afterVideo.label} className="h-full w-full object-cover" />
      </div>
    );
  }
  if (card.afterImage) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.afterImage.src} alt={card.afterImage.alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#0b0a08] px-6 text-center">
      <p className="text-[12px] text-[#A9A092]/70">{card.placeholderNote ?? "Example asset coming soon."}</p>
    </div>
  );
}

function Card({ card }: { card: BACard }) {
  return (
    <article
      className="glass-card flex h-full flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A44C] hover:shadow-[0_0_44px_rgba(201,164,76,0.10)]"
      aria-label={`Before and after: ${card.category}`}
    >
      {/* Media: starting point strip + after media */}
      <div className="relative">
        <AfterMedia card={card} />
        <span className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1407]" style={{ background: GOLD_GRADIENT }}>
          After
        </span>
      </div>
      <div className="border-y border-[rgba(201,164,76,0.14)] bg-[#0b0a08]/80 px-5 py-2.5">
        <p className="text-[11px] leading-snug text-[#A9A092]">
          <span className="font-semibold uppercase tracking-[0.16em] text-[#E8D7A2]">Starting point:</span>{" "}
          {card.before}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-[17px] font-semibold leading-snug text-[#F6F1E7]">{card.category}</h3>
        <dl className="mt-3 space-y-2.5 text-[13px] leading-relaxed">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A9A092]">The problem</dt>
            <dd className="mt-0.5 text-[#A9A092]">{card.problem}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A44C]">The after</dt>
            <dd className="mt-0.5 text-[#F6F1E7]">{card.after}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A9A092]">What changed</dt>
            <dd className="mt-0.5 text-[#A9A092]">{card.whatChanged}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A9A092]">Business value</dt>
            <dd className="mt-0.5 text-[#A9A092]">{card.businessValue}</dd>
          </div>
          <div className="border-t border-[rgba(201,164,76,0.14)] pt-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8D7A2]">Best use case</dt>
            <dd className="mt-0.5 text-[#D8CFBE]">{card.bestUseCase}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export function BeforeAfterSection() {
  return (
    <section id="before-after" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Before / After
          </span>
          <h2 className="mt-3 font-serif text-[clamp(26px,3.6vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
            Turning everyday hospitality moments into premium campaign assets.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
            A property photo, menu item, event detail, seasonal offer, or brand idea is often enough
            to start. Archer Design turns those moments into polished creative built for hotels,
            restaurants, spas, resorts, and event-driven hospitality brands.
          </p>
        </div>

        {/* Featured three */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURED.map((c) => <Card key={c.category} card={c} />)}
        </div>

        {/* Expanded grid */}
        <details className="group mt-6">
          <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.28)] px-5 py-2.5 text-sm font-semibold text-[#E8D7A2] transition hover:border-[#C9A44C] [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">See three more transformations</span>
            <span className="hidden group-open:inline">Show fewer</span>
            <span aria-hidden className="text-[#C9A44C] transition group-open:rotate-45">+</span>
          </summary>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {MORE.map((c) => <Card key={c.category} card={c} />)}
          </div>
        </details>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="font-serif text-[clamp(18px,2.4vw,26px)] text-[#F6F1E7]">
            Want to see what this could look like for 3–5 properties?
          </p>
          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
            style={{ background: GOLD_GRADIENT }}
          >
            Request a Creative Pilot <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
