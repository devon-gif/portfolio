import Image from "next/image";
import { Film, LayoutGrid } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * "Two types of creative. One property story." -- the static-vs-motion
 * explainer required near the packages/asset-pack chooser. Doubles as the
 * required visual chooser reference (each card is a compact, contained
 * media preview, not a wall of text) so the page does not repeat two
 * near-identical media blocks back to back.
 *
 * Motion media: the site's existing hotel-arrival clip (public/tcrm/videos/
 * hotel-arrival-vintage-car.mp4), the same "guest walking to her car"
 * footage already used as the hero background and the first item in the
 * motion library gallery -- reused here, not recreated.
 *
 * Static media: an existing, finished Archer Design hospitality campaign
 * graphic (public/tcrm/images/hampton-inn-johnstown-flood-city-music-
 * festival.png) already in the project's Selected Hospitality Work grid,
 * cropped to lead with the campaign artwork itself.
 */
export function CreativeTypePreview() {
  return (
    <section id="creative-types" className="tl-section">
      <div className="tl-glow-teal" aria-hidden="true" />
      <div className="tl-shell relative">
        <Reveal className="max-w-2xl">
          <p className="tl-eyebrow">Two types of creative</p>
          <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
            Two types of creative. One property story.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
            Every plan and pack on this page is built from a mix of these two formats. Here is what each one
            actually looks like.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal delay={1} className="tl-panel tl-type-card p-6 sm:p-7">
            <div className="tl-type-media">
              <video
                className="tl-type-media-el"
                src="/tcrm/videos/hotel-arrival-vintage-car.mp4"
                poster="/tcrm/images/tcrm-hero-poster.webp"
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                aria-label="Motion graphic example: a guest walking toward a vintage car in front of a boutique hotel"
              />
              <span className="tl-type-media-badge">
                <Film className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                Motion
              </span>
            </div>
            <h3 className="mt-5 text-[16px] tracking-[0.02em] text-[var(--tl-ink)]">MOTION GRAPHIC</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--tl-ink-soft)]">
              Animated creative designed to stop the scroll: movement, transitions, image animation, or
              short-form campaign motion.
            </p>
            <span className="tl-hline my-5" aria-hidden="true" />
            <p className="tl-pkg-subhead">Good for</p>
            <ul className="mt-3 flex flex-col gap-2">
              {["Scroll-stopping social content", "Transitions and atmosphere", "Event and campaign storytelling", "Social feeds and Stories"].map(
                (item) => (
                  <li key={item} className="tl-check">
                    <span className="tl-dot" aria-hidden="true" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </Reveal>

          <Reveal delay={2} className="tl-panel tl-type-card p-6 sm:p-7">
            <div className="tl-type-media">
              <Image
                src="/tcrm/images/hampton-inn-johnstown-flood-city-music-festival.png"
                alt="Static graphic example: a finished hotel event-campaign design"
                width={1334}
                height={1576}
                className="tl-type-media-el"
                sizes="(min-width: 768px) 34vw, 90vw"
              />
              <span className="tl-type-media-badge">
                <LayoutGrid className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                Static
              </span>
            </div>
            <h3 className="mt-5 text-[16px] tracking-[0.02em] text-[var(--tl-ink)]">STATIC GRAPHIC</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--tl-ink-soft)]">
              A finished still campaign graphic for social, events, offers, F&amp;B, meetings, or seasonal
              promotion.
            </p>
            <span className="tl-hline my-5" aria-hidden="true" />
            <p className="tl-pkg-subhead">Good for</p>
            <ul className="mt-3 flex flex-col gap-2">
              {["Clear offers and promotions", "Menus and F&B pushes", "Event and meeting information", "Seasonal campaign announcements"].map(
                (item) => (
                  <li key={item} className="tl-check">
                    <span className="tl-dot tl-dot--archer" aria-hidden="true" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
