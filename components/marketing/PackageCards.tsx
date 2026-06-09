import { GOLD_GRADIENT } from "./media";

type Pkg = {
  name: string;
  price: string;
  note: string;
  features: string[];
  featured?: boolean;
};

const PACKAGES: Pkg[] = [
  {
    name: "Hotel Creative System",
    price: "$1,999/mo",
    note: "For up to 3 properties",
    features: [
      "Social graphics",
      "Short-form motion pieces",
      "F&B / event promos",
      "Seasonal campaign visuals",
      "Meeting / wedding / event graphics",
      "Light caption support",
      "Monthly creative plan",
      "Existing assets only",
    ],
  },
  {
    name: "Hotel Creative + SEO Bundle",
    price: "$3,999/mo",
    note: "For up to 3 properties · best for hotel groups",
    featured: true,
    features: [
      "Everything in the Hotel Creative System",
      "Google Business Profile content support",
      "Local landing / page copy recommendations",
      "Monthly SEO content",
      "Metadata / title / description recommendations",
      "FAQ / review-response support",
    ],
  },
  {
    name: "Spa Social Starter",
    price: "$499/mo",
    note: "Spa & wellness",
    features: [
      "Service promos",
      "Treatment / wellness visuals",
      "Social graphics",
      "Light motion pieces",
      "Seasonal campaigns",
    ],
  },
  {
    name: "Spa Social + SEO",
    price: "$999/mo",
    note: "Spa & wellness",
    features: [
      "Everything in Spa Social Starter",
      "Google Business Profile support",
      "Local SEO / service page recommendations",
      "Monthly local content",
    ],
  },
  {
    name: "Restaurant Social Starter",
    price: "$399/mo",
    note: "Restaurants & F&B",
    features: ["Menu features", "Specials", "Event promos", "Short-form motion", "Social graphics"],
  },
  {
    name: "Restaurant Social + Local SEO",
    price: "$699/mo",
    note: "Restaurants & F&B",
    features: [
      "Everything in Restaurant Social Starter",
      "Google Business Profile support",
      "Menu / local search improvements",
      "One monthly content piece",
    ],
  },
];

export function PackageCards() {
  return (
    <section id="packages" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Packages
          </span>
          <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
            Clear monthly packages, built from your assets.
          </h2>
          <p className="mt-4 text-[#A9A092]">
            Start small, scale by property. All packages use your existing assets, with no paid ad
            management or account management included.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className="glass-card flex h-full flex-col rounded-2xl p-7 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A44C] hover:shadow-[0_0_50px_rgba(201,164,76,0.10)]"
              style={
                p.featured
                  ? { borderColor: "transparent", boxShadow: "0 0 60px rgba(201,164,76,0.16)", backgroundImage: `linear-gradient(#11100E,#11100E), ${GOLD_GRADIENT}`, backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box", border: "1.5px solid transparent" }
                  : undefined
              }
            >
              {p.featured && (
                <span
                  className="mb-3 self-start rounded-full border border-[rgba(232,215,162,0.42)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1407] shadow-[0_0_20px_rgba(201,164,76,0.22)]"
                  style={{ background: GOLD_GRADIENT }}
                >
                  Best for groups
                </span>
              )}
              <div className="mb-4 h-px w-full bg-[linear-gradient(90deg,rgba(201,164,76,0.55),transparent)]" />
              <h3 className="font-serif text-xl text-[#F6F1E7]">{p.name}</h3>
              <div className="mt-2 font-serif text-3xl text-[#C9A44C]">
                <span className="text-sm text-[#A9A092]">starting at </span>
                {p.price}
              </div>
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
                href="#trial"
                className="mt-6 rounded-full border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.26)] px-5 py-3 text-center text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C] hover:bg-[rgba(201,164,76,0.08)]"
              >
                Request a 7-Day Trial
              </a>
            </div>
          ))}
        </div>

        <div className="glass-card mt-6 rounded-2xl p-6 text-center text-[#A9A092]">
          <span className="text-[#F6F1E7]">Custom Hospitality Group Package</span>, quote-based for
          5+ properties: boutique hotel groups, management companies, resort groups, restaurant
          groups, and multi-location spa &amp; wellness brands.
        </div>
      </div>
    </section>
  );
}
