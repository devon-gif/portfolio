import { siteConfig } from "@/lib/site-config";
import { GOLD_GRADIENT } from "./media";

type Pkg = {
  id: string;
  name: string;
  price: string;
  note: string;
  features: string[];
  badge?: string;
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
};

// Five-tier model: free entry point, then single-property through portfolio scale.
// Spa + restaurant get a compact footer row below.
const PACKAGES: Pkg[] = [
  {
    id: "gap-review",
    name: "Creative Gap Review",
    price: "Free",
    note: "One property, restaurant, spa, or event venue",
    badge: "Start here",
    features: [
      "A short, practical review of how one property shows up online",
      "Website, social, Google Business content, and visible campaigns",
      "3-5 practical fixes you can act on",
      "No pressure, no long brief, no card required",
    ],
    ctaLabel: "Request a Creative Gap Review →",
    ctaHref: siteConfig.creativeGapReviewUrl,
  },
  {
    id: "single",
    name: "Single Property Creative Support",
    price: "Starting at $1,799/mo",
    note: "One hotel, restaurant, spa, resort, or event property",
    features: [
      "Social graphics",
      "Short-form motion pieces",
      "F&B and event promos",
      "Seasonal campaign visuals",
      "Captions included with every asset",
      "Monthly creative plan",
    ],
    ctaLabel: "Request a Creative Gap Review →",
    ctaHref: siteConfig.creativeGapReviewUrl,
  },
  {
    id: "pilot-3",
    name: "3-Property Hospitality Pilot",
    price: "$4,500–$5,500/mo",
    note: "Small hotel groups & management companies",
    features: [
      "Social graphics across all three properties",
      "Short-form motion pieces",
      "F&B and event promos",
      "Seasonal campaign visuals",
      "Meeting, wedding & event graphics",
      "Captions included with every asset",
      "One monthly creative plan, one invoice",
    ],
    ctaLabel: "Request a Creative Gap Review →",
    ctaHref: siteConfig.creativeGapReviewUrl,
  },
  {
    id: "pilot-5",
    name: "5-Property Creative Pilot",
    price: "$7,500–$8,500/mo",
    note: "The proving ground before a portfolio rollout",
    featured: true,
    badge: "Built for multi-property teams",
    features: [
      "Five properties on one coordinated creative system",
      "Social graphics, short-form motion, and campaign visuals per property",
      "F&B, event, wedding, and seasonal promos",
      "Google Business content support",
      "One approval workflow, one monthly plan, one invoice",
      "Expansion roadmap after the pilot",
    ],
    ctaLabel: "Request a Creative Gap Review →",
    ctaHref: siteConfig.creativeGapReviewUrl,
  },
  {
    id: "portfolio",
    name: "Portfolio Partnership",
    price: "Custom",
    note: "10+ properties, management companies & ownership groups",
    features: [
      "Everything in the 5-Property Creative Pilot, scaled per property",
      "Portfolio-wide brand consistency with property-level customization",
      "Group-level monthly creative plan and reporting",
      "Priority turnaround across all properties",
      "Optional quarterly campaign planning sessions",
      "One partner, one invoice, every property covered",
    ],
    ctaLabel: "Request a Creative Gap Review →",
    ctaHref: siteConfig.creativeGapReviewUrl,
  },
];

export function PackageCards() {
  return (
    <section id="packages" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Packages
          </span>
          <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
            Clear packages for single properties and multi-property teams.
          </h2>
          <p className="mt-4 text-[#A9A092]">
            Start with a free Creative Gap Review, then scale into fixed monthly creative support
            across social, motion, F&amp;B, and events. Pilots can grow based on seasonality,
            property count, and campaign volume.
          </p>
        </div>

        {/* Main cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PACKAGES.map((p) => (
            <div
              key={p.id}
              className="glass-card flex h-full flex-col rounded-2xl p-7 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A44C] hover:shadow-[0_0_50px_rgba(201,164,76,0.10)]"
              style={
                p.featured
                  ? {
                      borderColor: "transparent",
                      boxShadow: "0 0 60px rgba(201,164,76,0.18)",
                      backgroundImage: `linear-gradient(#11100E,#11100E), ${GOLD_GRADIENT}`,
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      border: "1.5px solid transparent",
                    }
                  : undefined
              }
            >
              {p.badge && (
                <span
                  className="mb-3 self-start rounded-full border border-[rgba(232,215,162,0.42)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1407] shadow-[0_0_20px_rgba(201,164,76,0.22)]"
                  style={{ background: GOLD_GRADIENT }}
                >
                  {p.badge}
                </span>
              )}
              <div className="mb-4 h-px w-full bg-[linear-gradient(90deg,rgba(201,164,76,0.55),transparent)]" />
              <h3 className="font-serif text-xl text-[#F6F1E7]">{p.name}</h3>
              <div className="mt-2 font-serif text-2xl text-[#C9A44C]">{p.price}</div>
              <div className="mt-1 text-[13px] text-[#A9A092]">{p.note}</div>
              <ul className="mt-5 flex-1 space-y-2 text-[14.5px] text-[#A9A092]">
                {p.features.map((f) => (
                  <li key={f} className="relative pl-5">
                    <span className="absolute left-0 top-[7px] text-[9px] text-[#C9A44C]">◆</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={p.ctaHref}
                className="mt-6 rounded-full border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.26)] px-5 py-3 text-center text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C] hover:bg-[rgba(201,164,76,0.08)]"
              >
                {p.ctaLabel}
              </a>
            </div>
          ))}
        </div>

        {/* Small-property tiers: spa + restaurant cards */}
        <div className="mt-6">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#A9A092]">
            Focused monthly creative support for independent spas and restaurants
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              {
                name: "Spa & wellness creative",
                price: "$1,250/mo",
                note: "Calm, premium creative for spas and wellness brands",
                features: ["Service & treatment promos", "Seasonal wellness campaigns", "Soft-motion content", "Captions included"],
              },
              {
                name: "Restaurant & F&B creative",
                price: "$1,500/mo",
                note: "Menu, specials, and event creative that fills covers",
                features: ["Menu features & specials", "Bar program & event promos", "Short-form food motion", "Captions included"],
              },
            ].map((p) => (
              <div
                key={p.name}
                className="glass-card flex h-full flex-col rounded-2xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A44C] hover:shadow-[0_0_44px_rgba(201,164,76,0.10)]"
              >
                <div className="mb-3 h-px w-full bg-[linear-gradient(90deg,rgba(201,164,76,0.55),transparent)]" />
                <h3 className="font-serif text-lg text-[#F6F1E7]">{p.name}</h3>
                <div className="mt-1.5 font-serif text-xl text-[#C9A44C]">{p.price}</div>
                <div className="mt-1 text-[13px] text-[#A9A092]">{p.note}</div>
                <ul className="mt-4 flex-1 space-y-1.5 text-[14px] text-[#A9A092]">
                  {p.features.map((f) => (
                    <li key={f} className="relative pl-5">
                      <span className="absolute left-0 top-[7px] text-[9px] text-[#C9A44C]">◆</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className="mt-5 rounded-full border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.26)] px-5 py-2.5 text-center text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C] hover:bg-[rgba(201,164,76,0.08)]"
                >
                  Inquire →
                </a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[13px] text-[#A9A092]">
            Independent property?{" "}
            <a href="/#sprint" className="text-[#E8D7A2] underline underline-offset-4 hover:text-[#F6F1E7]">
              Start with a $950 Sprint
            </a>{" "}
            and credit it toward your first month.
          </p>
        </div>
      </div>
    </section>
  );
}
