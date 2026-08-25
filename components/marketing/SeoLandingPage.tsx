import Link from "next/link";
import { LazyVideo } from "./LazyVideo";
import { JsonLd } from "./JsonLd";
import { StudioHeader } from "./StudioHeader";
import { StudioFooter } from "./StudioFooter";
import { fraunces } from "./studioFont";
import { type VideoAsset } from "./media";
import { siteConfig } from "@/lib/site-config";
import {
  CALENDLY_URL,
  faqJsonLd,
  serviceJsonLd,
  type FaqItem,
} from "@/lib/seo";

export interface LandingSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface RelatedLink {
  href: string;
  label: string;
}

interface SeoLandingPageProps {
  /** Small gold eyebrow above the H1. */
  eyebrow: string;
  h1: string;
  /** Intro paragraphs rendered under the H1. */
  intro: string[];
  sections: LandingSection[];
  /** Portfolio videos shown as work examples. */
  videos: VideoAsset[];
  videoHeading: string;
  videoBlurb: string;
  faqs: FaqItem[];
  related: RelatedLink[];
  /** Used for Service JSON-LD. */
  path: string;
  serviceName: string;
  serviceType: string;
  metaDescription: string;
}

function CtaButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href="/contact" className="st-btn">
        Send a property link <span aria-hidden>→</span>
      </Link>
      <Link href={siteConfig.scorecardUrl} className="st-btn-ghost">
        Take the scorecard
      </Link>
      <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="st-btn-ghost">
        Book a quick intro
      </a>
    </div>
  );
}

/**
 * Shared layout for the public SEO landing pages. Server component;
 * only the lazy videos hydrate on the client. Light "Archer Studio" theme.
 */
export function SeoLandingPage({
  eyebrow,
  h1,
  intro,
  sections,
  videos,
  videoHeading,
  videoBlurb,
  faqs,
  related,
  path,
  serviceName,
  serviceType,
  metaDescription,
}: SeoLandingPageProps) {
  return (
    <div className={`${fraunces.variable} archer-studio min-h-screen`}>
      <JsonLd
        data={[
          serviceJsonLd({ name: serviceName, description: metaDescription, path, serviceType }),
          faqJsonLd(faqs),
        ]}
      />

      <StudioHeader />

      <main className="mx-auto max-w-5xl px-6 pb-24">
        {/* Hero */}
        <section className="pt-16 md:pt-20">
          <span className="st-kicker">{eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(30px,4.5vw,52px)] leading-[1.06] text-[var(--st-ink)]">
            {h1}
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <CtaButtons />
          </div>
          <p className="mt-3 text-[13px] text-[var(--st-ink-muted)]">
            Start by sending the assets you already have. We&apos;ll show you what stronger creative
            could look like, built from your own photos.
          </p>
        </section>

        {/* Work examples */}
        <section className="mt-20" aria-label="Work examples">
          <h2 className="font-serif text-[clamp(24px,3vw,36px)] text-[var(--st-ink)]">{videoHeading}</h2>
          <p className="mt-3 max-w-2xl text-[15px] text-[var(--st-ink-soft)]">{videoBlurb}</p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <figure
                key={v.src}
                className="overflow-hidden rounded-2xl border border-[var(--st-line)] bg-[var(--st-white)] shadow-[var(--st-shadow-soft)]"
                aria-label={`${v.label}, ${v.category} short-form video example`}
              >
                <div className="aspect-video w-full overflow-hidden bg-[var(--st-sand)]">
                  <LazyVideo src={v.src} label={v.label} className="h-full w-full object-cover" />
                </div>
                <figcaption className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-[var(--st-ink)]">{v.label}</span>
                  <span className="text-[var(--st-gold)]">{v.category}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-5 text-[14px] text-[var(--st-ink-soft)]">
            See more in our{" "}
            <Link href="/case-studies" className="text-[var(--st-gold)] underline underline-offset-4 hover:text-[var(--st-ink)]">
              client case studies
            </Link>{" "}
            or compare{" "}
            <Link href="/packages" className="text-[var(--st-gold)] underline underline-offset-4 hover:text-[var(--st-ink)]">
              monthly packages
            </Link>
            .
          </p>
        </section>

        {/* Content sections */}
        {sections.map((s) => (
          <section key={s.heading} className="mt-16 max-w-3xl">
            <h2 className="font-serif text-[clamp(22px,2.8vw,32px)] text-[var(--st-ink)]">{s.heading}</h2>
            <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.bullets && (
                <ul className="list-disc space-y-2 pl-5 marker:text-[var(--st-gold)]">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        {/* FAQ */}
        <section className="mt-20 max-w-3xl" aria-label="Frequently asked questions">
          <span className="st-kicker">FAQ</span>
          <h2 className="mt-3 font-serif text-[clamp(24px,3vw,36px)] text-[var(--st-ink)]">
            Questions hospitality teams actually ask.
          </h2>
          <div className="mt-6 divide-y divide-[var(--st-line)] border-y border-[var(--st-line)]">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[19px] text-[var(--st-ink)] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-2xl text-[var(--st-gold)] transition group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--st-ink-soft)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="st-card mt-20 p-9 text-center md:p-12">
          <h2 className="font-serif text-[clamp(24px,3.2vw,38px)] leading-tight text-[var(--st-ink)]">
            See the quality on your own brand first.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-[var(--st-ink-soft)]">
            Send your existing photos, menus, or event details and we&apos;ll show you what stronger,
            approval-ready creative could look like. Or book a quick intro and we&apos;ll talk through
            your properties first.
          </p>
          <div className="mt-7 flex justify-center">
            <CtaButtons />
          </div>
          <p className="mt-4 text-[13px] text-[var(--st-ink-muted)]">
            Prefer to compare options first? View{" "}
            <Link href="/packages" className="text-[var(--st-gold)] underline underline-offset-4">
              packages
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-[var(--st-gold)] underline underline-offset-4">
              send a message
            </Link>
            .
          </p>
        </section>

        {/* Related pages */}
        <nav className="mt-16" aria-label="Related services">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[var(--st-ink-muted)]">
            Related
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-block rounded-full border border-[var(--st-line)] bg-white px-4 py-2 text-[13px] text-[var(--st-ink-soft)] transition hover:border-[var(--st-gold)] hover:text-[var(--st-ink)]"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <StudioFooter />
    </div>
  );
}
