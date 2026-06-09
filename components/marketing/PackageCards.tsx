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

// Group offer leads. Spa + restaurant starters get a compact footer row.
const PACKAGES: Pkg[] = [
  {
    id: "group",
    name: "Hospitality Group Partnership",
    price: "Custom quote",
    note: "5+ properties",
    badge: "Built for hotel groups & management companies",
    featured: true,
    features: [
      "Everything in the Hotel Creative + SEO Bundle, scaled per property",
      "Portfolio-wide brand consistency with property-level customization",
      "Group-level monthly creative plan and reporting",
      "Priority turnaround across all properties",
      "One partner, one invoice, every property covered",
    ],
    ctaLabel: "Book a 20-Minute Portfolio Call →",
    // TODO(devon): Replace with your real Calendly or booking link.
    ctaHref: "/contact",
  },
  {
    id: "hotel-seo",
    name: "Hotel Creative + SEO Bundle",
    price: "Starting at $3,999/mo",
    note: "Up to 3 properties",
    features: [
      "Everything in the Hotel Creative System",
      "Google Business Profile content support",
      "Local landing page copy recommendations",
      "Monthly SEO content",
      "Metadata, title & description recommendations",
      "FAQ and review-response support",
    ],
    ctaLabel: "Get 5 Free Sample Assets →",
    ctaHref: "/contact",
  },
  {
    id: "hotel-creative",
    name: "Hotel Creative System",
    price: "Starting at $1,999/mo",
    note: "Up to 3 properties",
    features: [
      "Social graphics",
      "Short-form motion pieces",
      "F&B and event promos",
      "Seasonal campaign visuals",
      "Meeting, wedding & event graphics",
      "Captions included with every asset",
      "Monthly creative plan",
      "Built entirely from your existing assets",
    ],
    ctaLabel: "Get 5 Free Sample Assets →",
    ctaHref: "/contact",
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
            Clear monthly packages, built from your existing assets.
          </h2>
          <p className="mt-4 text-[#A9A092]">
            Start with the properties you have. Scale as your portfolio grows. No paid ad
            management, no account-management fees, just creative output, delivered monthly.
          </p>
        </div>

        {/* Main cards: group, hotel+seo, hotel creative */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
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

        {/* Compact spa + restaurant row */}
        <div className="mt-6 glass-card rounded-2xl p-6">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#A9A092]">
            Also supporting independent spas and restaurants
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <div className="text-[15px] text-[#D8CFBE]">
              <span className="font-semibold text-[#F6F1E7]">Spa &amp; wellness creative</span> from{" "}
              <span className="text-[#C9A44C] font-semibold">$499/mo</span>
              <span className="mx-2 text-[#A9A092]">→</span>
              <a href="/contact" className="text-[#C9A44C] underline-offset-2 hover:underline">
                See spa packages
              </a>
            </div>
            <div className="text-[15px] text-[#D8CFBE]">
              <span className="font-semibold text-[#F6F1E7]">Restaurant &amp; F&amp;B creative</span>{" "}
              from <span className="text-[#C9A44C] font-semibold">$399/mo</span>
              <span className="mx-2 text-[#A9A092]">→</span>
              <a href="/contact" className="text-[#C9A44C] underline-offset-2 hover:underline">
                See restaurant packages
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
