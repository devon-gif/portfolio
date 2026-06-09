import Image from "next/image";

type TickerItem = {
  name: string;
  type: "logo" | "category";
  imageSrc?: string;
};

const TICKER_ITEMS: TickerItem[] = [
  {
    name: "Hampton Inn",
    type: "logo",
    imageSrc: "/Hampton-Brand-Logo_TM_CMYK_Full-Color.png",
  },
  {
    name: "Hotel Indigo",
    type: "logo",
    imageSrc: "/PITTSBURGH%20UNI-OAK_RGB_canvas_white_on_indigo_blue.png",
  },
  {
    name: "Eliza Hot Metal Bistro",
    type: "logo",
    imageSrc: "/Untitled.png",
  },
  {
    name: "Elements Spa",
    type: "logo",
    imageSrc: "/Elements%20Full%20logo-%20NO%20BACK%20GROUND.png",
  },
  {
    name: "Vigilant",
    type: "logo",
    // TODO(devon): Add local Vigilant logo asset in /public and set imageSrc here.
  },
  { name: "Boutique Spas", type: "category" },
  { name: "Hotel Restaurants", type: "category" },
  { name: "Event Venues", type: "category" },
  { name: "Multi-Property Groups", type: "category" },
  { name: "F&B Campaigns", type: "category" },
  { name: "Local SEO", type: "category" },
];

const TICKER_LOOP = [...TICKER_ITEMS, ...TICKER_ITEMS];

export function ClientLogoStrip() {
  return (
    <section className="client-ticker" aria-label="Selected hospitality work and categories">
      <div className="client-ticker-mask mx-auto max-w-7xl">
        <div className="client-ticker-track">
          {TICKER_LOOP.map((item, index) => (
            <span key={`${item.name}-${index}`} className="client-ticker-item">
              {item.type === "logo" && item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={`${item.name} logo`}
                  width={160}
                  height={34}
                  className="client-ticker-logo"
                />
              ) : (
                <span className={item.type === "category" ? "client-ticker-category" : "client-ticker-fallback"}>
                  {item.name}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
