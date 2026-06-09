import Image from "next/image";

// Only real client logos — no keyword/category tags (those belong in the footer for SEO).
// Lead with Revest Properties (the group) since hotel groups are the primary buyer.
type LogoItem = {
  name: string;
  imageSrc?: string;
};

const LOGOS: LogoItem[] = [
  {
    name: "Revest Properties",
    // TODO(devon): Add Revest Properties logo to /public and set imageSrc here.
  },
  {
    name: "Hotel Indigo Pittsburgh",
    imageSrc: "/PITTSBURGH%20UNI-OAK_RGB_canvas_white_on_indigo_blue.png",
  },
  {
    name: "Hampton Inn Greensburg & Johnstown",
    imageSrc: "/Hampton-Brand-Logo_TM_CMYK_Full-Color.png",
  },
  {
    name: "Eliza Hot Metal Bistro",
    imageSrc: "/Untitled.png",
  },
  {
    name: "Elements Spa & Wellness",
    imageSrc: "/Elements%20Full%20logo-%20NO%20BACK%20GROUND.png",
  },
];

const TICKER_LOOP = [...LOGOS, ...LOGOS];

export function ClientLogoStrip() {
  return (
    <section className="px-6 pb-2 pt-6" aria-label="Trusted hospitality clients">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A9A092]">
        Trusted by hospitality teams at
      </p>
      <div className="client-ticker">
        <div className="client-ticker-mask mx-auto max-w-7xl">
          <div className="client-ticker-track">
            {TICKER_LOOP.map((item, index) => (
              <span key={`${item.name}-${index}`} className="client-ticker-item">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={`${item.name} logo`}
                    width={160}
                    height={34}
                    className="client-ticker-logo"
                  />
                ) : (
                  <span className="client-ticker-fallback">{item.name}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
