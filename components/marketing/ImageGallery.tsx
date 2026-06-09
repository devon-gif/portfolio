// Editorial masonry gallery - still images only, natural aspect ratios
// preserved (no cropping/squeezing). Uses CSS multi-column masonry.

import { GALLERY_IMAGES } from "./media";

export function ImageGallery() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Stills &amp; campaigns
          </span>
          <h2 className="mt-3 font-serif text-[clamp(26px,4vw,44px)] font-semibold leading-tight text-[#F6F1E7]">
            The photos your properties already have, turned into finished campaigns.
          </h2>
          <p className="mt-3 text-[#A9A092]">
            Most hotels are sitting on usable assets, room photography, menus, event spaces, spa
            interiors. We turn that raw material into consistent, on-brand creative that keeps
            rooms, restaurants, events, and services visible between major campaigns.
          </p>
        </div>

        <div className="gap-4 [column-fill:_balance] columns-1 sm:columns-2 lg:columns-3">
          {GALLERY_IMAGES.map((image) => (
            <figure
              key={image.src}
              className="glass-card group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:border-[#C9A44C] hover:shadow-[0_0_48px_rgba(201,164,76,0.16)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="block h-auto w-full object-contain transition duration-500 group-hover:scale-[1.015]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.72))]" />
              <figcaption className="absolute left-3 top-3 rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/70 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#E8D7A2] backdrop-blur-md">
                {image.category}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
