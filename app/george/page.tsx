import type { Metadata } from "next";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { GeorgeHeader } from "./components/GeorgeHeader";
import { GeorgeHeroVideo } from "./components/GeorgeHeroVideo";
import { GeorgeSlideshow, type SlideshowItem } from "./components/GeorgeSlideshow";

// Root layout's metadata.title.template appends " | Archer Design"
// automatically (see app/layout.tsx) -- this string must NOT repeat that
// suffix itself.
const PAGE_TITLE = "A Private Creative Preview for The George";
const PAGE_DESCRIPTION = "A private video preview prepared for The George.";

// Private, personalized preview -- never indexed, never linked from the main
// nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which intentionally omits this
// route), or footer. Accessible only via the direct URL, same treatment as
// /topline and /coraltree. See components/AppChrome.tsx, which lists
// "/george" among the public prefixes so it renders with no CRM chrome.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/george") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/* ── Content ─────────────────────────────────────────────────────────────── */

// The 6 real supplied clips, in the requested viewing order. george-slideshow
// .mp4 is reserved for the hero player above so it never repeats here.
const SLIDES: SlideshowItem[] = [
  {
    key: "wedding",
    src: "/george/videos/wedding.mp4",
    title: "The George Weddings",
    description: "Celebrations, entrances, and memorable event moments.",
  },
  {
    key: "room",
    src: "/george/videos/room.mp4",
    title: "Guest Rooms",
    description: "A more cinematic way to present the stay experience.",
  },
  {
    key: "bar",
    src: "/george/videos/bar.mp4",
    title: "The Bar",
    description: "Atmosphere, detail, and evening hospitality.",
  },
  {
    key: "pool",
    src: "/george/videos/pool.mp4",
    title: "The Pool",
    description: "Seasonal leisure and social moments.",
  },
  {
    key: "books",
    src: "/george/videos/books.mp4",
    title: "Interior Details",
    description: "Small design moments that help define the property.",
  },
  {
    key: "snow",
    src: "/george/videos/snow.mp4",
    title: "Seasonal Storytelling",
    description: "The George through a different season.",
  },
];

export default function GeorgePage() {
  return (
    <div id="top" className={`${fraunces.variable} george-theme relative min-h-screen`}>
      <GeorgeHeader />

      <main>
        {/* ══════════════════════ HERO ══════════════════════ */}
        <section className="gg-section gg-hero-simple">
          <div className="gg-shell">
            <div className="gg-hero-intro gg-fade-up">
              <p className="gg-eyebrow">Private creative preview</p>
              <h1 className="mt-4">A few ideas for The George.</h1>
              <p>
                Emma, I put this together as a simple visual preview of how Archer Design could help
                bring The George&rsquo;s rooms, bar, pool, weddings, seasonal moments, and property story
                to life through motion and design.
              </p>
            </div>

            <div className="gg-hero-stage gg-fade-up">
              <GeorgeHeroVideo src="/george/videos/george-slideshow.mp4" label="The George, an introduction" />
            </div>

            {/* ══════════════════ PERSONAL NOTE ══════════════════ */}
            <div className="gg-note gg-fade-up">
              <p>
                Hi Emma &mdash; you had mentioned that The George could use some creative support, so I
                put together these video concepts to make the possibilities a little easier to visualize.
                These are not meant to be final directions, just a starting point for what we could build
                together.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════ SLIDESHOW ══════════════════════ */}
        <section id="slideshow" className="gg-section pt-0">
          <div className="gg-shell">
            <GeorgeSlideshow items={SLIDES} />
          </div>
        </section>

        {/* ══════════════════════ CLOSING NOTE ══════════════════════ */}
        <section className="gg-section gg-note-section">
          <div className="gg-shell">
            <div className="gg-note gg-fade-up">
              <p>Thanks for taking a look, Emma. These are simply early creative ideas, but I hope they help show what ongoing visual support for The George could look like.</p>
              <p className="mt-4">
                When the timing feels right, I&rsquo;d be glad to reconnect and hear which areas of the
                property need the most help.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════ CTA ══════════════════════ */}
        <section className="gg-section gg-final-cta">
          <div className="gg-shell relative mx-auto max-w-lg text-center">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:hello@archerdesign.shop?subject=The%20George%20Creative%20Preview"
                className="gg-btn"
              >
                Talk with Devon
              </a>
              <a href="https://www.archerdesign.shop" className="gg-btn-ghost gg-btn-ghost--on-dark">
                View Archer Design
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════ FOOTER / DISCLAIMER ══════════════════════ */}
      <footer className="gg-footer">
        <div className="gg-shell flex flex-col items-center gap-4 text-center">
          <span className="gg-wordmark" aria-hidden="true">
            The George
          </span>
          <p className="text-[11.5px] text-[var(--gg-ink-muted)]">
            &copy; {new Date().getFullYear()} Archer Design &middot; Private preview &middot; Not for distribution
          </p>
        </div>
      </footer>
    </div>
  );
}
