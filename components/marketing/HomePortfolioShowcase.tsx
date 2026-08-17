import { StudioMotionLibrary } from "./StudioMotionLibrary";
import { WorkPageStillsGallery } from "./WorkPageStillsGallery";
import { TCRM_BLOB_MOTION } from "@/app/tcrm/tcrm-motion-blob-manifest";
import { TCRM_IMAGES } from "@/app/tcrm/tcrm-media";

export function HomePortfolioShowcase() {
  return (
    <>
      <section id="motion-library" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="st-kicker">Motion library</span>
            <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
              Hospitality motion that makes the property feel alive.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
              Browse the full motion library: hotel storytelling, F&amp;B, weddings,
              events, seasonal campaigns, portfolio concepts, and short-form
              social creative. The videos are streamed from the same optimized
              library used in our TCRM creative activation experience.
            </p>
          </div>

          <div className="mt-12">
            <StudioMotionLibrary items={TCRM_BLOB_MOTION} />
          </div>
        </div>
      </section>

      <section id="stills-library" className="scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="st-kicker">Stills &amp; campaigns</span>
            <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] leading-[1.1] text-[var(--st-ink)]">
              Real hospitality graphics, shown at full scale.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
              Hotel, restaurant, event, wedding, seasonal, spa, package, menu,
              and social campaign work from real properties, with the original
              proportions preserved and a full-screen view for closer review.
            </p>
          </div>

          <div className="mt-12">
            <WorkPageStillsGallery items={TCRM_IMAGES} />
          </div>
        </div>
      </section>
    </>
  );
}
