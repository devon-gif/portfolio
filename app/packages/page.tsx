import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Allura, Fraunces } from "next/font/google";
import { PackageCards } from "@/components/marketing/PackageCards";
import { PackagePathCards } from "@/components/marketing/PackagePathCards";
import { RetainerValueSection } from "@/components/marketing/RetainerValueSection";
import { TrialCTA } from "@/components/marketing/TrialCTA";
import { GOLD_GRADIENT } from "@/components/marketing/media";
import { LOGO_PATH } from "@/lib/seo";

const DESCRIPTION =
  "Monthly creative packages for hotels, restaurants, spas, and event venues — social graphics, short-form video, and captions at a fixed fee. Compare tiers and run the cost math against an in-house hire.";

export const metadata: Metadata = {
  title: "Packages & Pricing Paths",
  description: DESCRIPTION,
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Packages & Pricing Paths | Archer Design",
    description: DESCRIPTION,
    url: "/packages",
  },
};

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

export default function PackagesPage() {
  return (
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury min-h-screen bg-[#050505] text-[#F6F1E7]`}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Archer Design home">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black">
              <Image src={LOGO_PATH} alt="Archer Design logo" fill sizes="40px" className="object-cover" />
            </div>
            <div className="wordmark-font text-[0.84rem]">
              <span className="text-[#F6F1E7]">Archer</span>
              <span className="text-[#C9A44C]">Design</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-[#A9A092]" aria-label="Main">
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

      <main>
        <section className="mx-auto max-w-5xl px-6 pt-16 md:pt-20">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Packages
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(30px,4.5vw,52px)] font-semibold leading-tight">
            Fixed monthly packages. No employment overhead.
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[#A9A092]">
            Every tier delivers finished, approval-ready creative — social graphics, short-form
            video, and captions — built from the assets your properties already have. Start with
            the free 5-asset trial, then pick the path that matches your property type and volume.
          </p>
        </section>

        {/* Property-type paths */}
        <PackagePathCards />

        {/* Full package listing */}
        <PackageCards />

        {/* ROI calculator + overhead comparison */}
        <RetainerValueSection />

        <TrialCTA />

        <section className="mx-auto max-w-3xl px-6 pb-20 text-center text-[14px] text-[#A9A092]">
          <p>
            Not sure which tier fits?{" "}
            <Link href="/contact" className="text-[#E8D7A2] underline underline-offset-4 hover:text-[#F6F1E7]">
              Send a message or book a 30-minute call
            </Link>{" "}
            — or see how the work plays out in our{" "}
            <Link href="/case-studies" className="text-[#E8D7A2] underline underline-offset-4 hover:text-[#F6F1E7]">
              client case studies
            </Link>
            .
          </p>
        </section>
      </main>

      <footer className="border-t border-[rgba(201,164,76,0.1)] px-6 py-12 text-center text-[13px] text-[#A9A092]">
        <p className="space-x-4">
          <Link href="/" className="hover:text-[#F6F1E7]">Home</Link>
          <Link href="/case-studies" className="hover:text-[#F6F1E7]">Case Studies</Link>
          <Link href="/hospitality-creative-support" className="hover:text-[#F6F1E7]">Services</Link>
          <Link href="/contact" className="hover:text-[#F6F1E7]">Contact</Link>
        </p>
      </footer>
    </div>
  );
}
