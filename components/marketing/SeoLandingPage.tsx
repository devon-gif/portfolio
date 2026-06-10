import Image from "next/image";
import Link from "next/link";
import { Allura, Fraunces } from "next/font/google";
import { LazyVideo } from "./LazyVideo";
import { JsonLd } from "./JsonLd";
import { GOLD_GRADIENT, type VideoAsset } from "./media";
import {
  CALENDLY_URL,
  LOGO_PATH,
  faqJsonLd,
  serviceJsonLd,
  type FaqItem,
} from "@/lib/seo";

const fraunces = Fraunces({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const allura = Allura({
  variable: "--font-wordmark-script",
  subsets: ["latin"],
  weight: ["400"],
});

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
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[#1a1407] shadow-[0_4px_20px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_32px_rgba(201,164,76,0.4)]"
        style={{ background: GOLD_GRADIENT }}
      >
        Request a free trial <span aria-hidden>→</span>
      </Link>
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] px-6 py-3 text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[rgba(201,164,76,0.55)]"
      >
        Book a 30-minute call
      </a>
    </div>
  );
}

/**
 * Shared layout for the public SEO landing pages. Server component;
 * only the lazy videos hydrate on the client.
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
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury min-h-screen bg-[#050505] text-[#F6F1E7]`}
    >
      <JsonLd
        data={[
          serviceJsonLd({ name: serviceName, description: metaDescription, path, serviceType }),
          faqJsonLd(faqs),
        ]}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Archer Design home">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black">
              <Image
                src={LOGO_PATH}
                alt="Archer Design logo"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="wordmark-font text-[0.84rem]">
              <span className="text-[#F6F1E7]">Archer</span>
              <span className="text-[#C9A44C]">Design</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-[#A9A092]" aria-label="Main">
            <Link href="/packages" className="hidden hover:text-[#F6F1E7] sm:inline">Packages</Link>
            <Link href="/case-studies" className="hidden hover:text-[#F6F1E7] sm:inline">Case Studies</Link>
            <Link
              href="/contact"
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Get 5 Free Sample Assets
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        {/* Hero */}
        <section className="pt-16 md:pt-20">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            {eyebrow}
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(30px,4.5vw,52px)] font-semibold leading-tight">
            {h1}
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-[16px] leading-relaxed text-[#A9A092]">
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <CtaButtons />
          </div>
          <p className="mt-3 text-[13px] text-[#A9A092]/70">
            The trial is 5 finished assets in 7 days, built from your existing photos. No card, no
            contract.
          </p>
        </section>

        {/* Work examples */}
        <section className="mt-20" aria-label="Work examples">
          <h2 className="font-serif text-[clamp(24px,3vw,36px)] font-semibold">{videoHeading}</h2>
          <p className="mt-3 max-w-2xl text-[15px] text-[#A9A092]">{videoBlurb}</p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <figure
                key={v.src}
                className="overflow-hidden rounded-2xl border border-[rgba(201,164,76,0.16)] bg-[#0b0a08]"
                aria-label={`${v.label} — ${v.category} short-form video example`}
              >
                <div className="aspect-video w-full overflow-hidden bg-black">
                  <LazyVideo
                    src={v.src}
                    label={v.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-[#F6F1E7]">{v.label}</span>
                  <span className="text-[#C9A44C]">{v.category}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-5 text-[14px] text-[#A9A092]">
            See more in our{" "}
            <Link href="/case-studies" className="text-[#E8D7A2] underline underline-offset-4 hover:text-[#F6F1E7]">
              client case studies
            </Link>{" "}
            or compare{" "}
            <Link href="/packages" className="text-[#E8D7A2] underline underline-offset-4 hover:text-[#F6F1E7]">
              monthly packages
            </Link>
            .
          </p>
        </section>

        {/* Content sections */}
        {sections.map((s) => (
          <section key={s.heading} className="mt-16 max-w-3xl">
            <h2 className="font-serif text-[clamp(22px,2.8vw,32px)] font-semibold">{s.heading}</h2>
            <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-[#A9A092]">
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.bullets && (
                <ul className="list-disc space-y-2 pl-5 marker:text-[#C9A44C]">
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
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">FAQ</span>
          <h2 className="mt-3 font-serif text-[clamp(24px,3vw,36px)] font-semibold">
            Questions hotel teams actually ask.
          </h2>
          <div className="mt-6 divide-y divide-[rgba(201,164,76,0.18)]">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-[#F6F1E7] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-2xl text-[#C9A44C] transition group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="glass-card-strong mt-20 rounded-3xl p-9 text-center md:p-12">
          <h2 className="font-serif text-[clamp(24px,3.2vw,38px)] font-semibold leading-tight">
            See the quality on your own brand first.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-[#A9A092]">
            Send your existing photos, menus, or event details and get 5 finished, approval-ready
            assets back within 7 days — free. Or book a 30-minute call and we&apos;ll talk through
            your properties first.
          </p>
          <div className="mt-7 flex justify-center">
            <CtaButtons />
          </div>
          <p className="mt-4 text-[13px] text-[#A9A092]/70">
            Prefer to compare options first? View{" "}
            <Link href="/packages" className="text-[#E8D7A2] underline underline-offset-4">
              packages and pricing paths
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-[#E8D7A2] underline underline-offset-4">
              send a message
            </Link>
            .
          </p>
        </section>

        {/* Related pages */}
        <nav className="mt-16" aria-label="Related services">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#A9A092]">
            Related
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-block rounded-full border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.4)] px-4 py-2 text-[13px] text-[#E8D7A2] transition hover:border-[rgba(201,164,76,0.5)] hover:text-[#F6F1E7]"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(201,164,76,0.1)] px-6 py-12 text-center text-[13px] text-[#A9A092]">
        <p>
          Archer Design — hospitality creative support for hotels, restaurants, spas, and event
          venues.
        </p>
        <p className="mt-3 space-x-4">
          <Link href="/" className="hover:text-[#F6F1E7]">Home</Link>
          <Link href="/packages" className="hover:text-[#F6F1E7]">Packages</Link>
          <Link href="/case-studies" className="hover:text-[#F6F1E7]">Case Studies</Link>
          <Link href="/contact" className="hover:text-[#F6F1E7]">Contact</Link>
        </p>
      </footer>
    </div>
  );
}
