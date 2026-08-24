import type { Metadata } from "next";
import Image from "next/image";
import { Fraunces } from "next/font/google";
import { CheckoutClient } from "./CheckoutClient";
import { getCheckoutOffer } from "@/lib/checkout-offers";

const fraunces = Fraunces({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Start a Partnership",
  description: "Choose an Archer Design monthly service plan and continue to secure Stripe checkout.",
  robots: { index: false, follow: false },
};

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ offer?: string; canceled?: string }>;
}) {
  const params = await searchParams;
  const offer = getCheckoutOffer(params.offer);
  const canceled = params.canceled === "1";
  const allowTestOnboarding = process.env.NODE_ENV !== "production";

  return (
    <main className={`${fraunces.variable} min-h-screen bg-[#050505] text-[#F6F1E7]`}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(201,164,76,0.12),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(135,100,42,0.08),transparent_28%)]" />

      <header className="relative border-b border-[rgba(201,164,76,0.14)] bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black">
              <Image
                src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
                alt="Archer Design logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div className="text-sm font-semibold tracking-wide">
              <span className="text-[#F6F1E7]">Archer</span>
              <span className="text-[#C9A44C]">Design</span>
            </div>
          </a>
          <span className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#8F877B] sm:inline">
            Secure monthly onboarding
          </span>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
        <section className="mb-10 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9A44C]">{offer.eyebrow}</p>
          <h1 className="mt-4 font-[family-name:var(--font-luxury-serif)] text-[clamp(34px,5.8vw,68px)] font-semibold leading-[0.98] text-[#F6F1E7]">
            {offer.title}
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#A9A092] md:text-base">{offer.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#8F877B]">
            <span className="rounded-full border border-white/10 px-3 py-1.5">Month-to-month</span>
            <span className="rounded-full border border-white/10 px-3 py-1.5">Secure Stripe checkout</span>
            <span className="rounded-full border border-white/10 px-3 py-1.5">Cancel future renewals anytime</span>
            {allowTestOnboarding && (
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-violet-200">Local no-charge test available</span>
            )}
          </div>
        </section>

        <CheckoutClient offer={offer} canceled={canceled} allowTestOnboarding={allowTestOnboarding} />

        <footer className="mt-14 border-t border-white/10 pt-7 text-xs leading-relaxed text-[#69635A]">
          Archer Design LLC · Lehi, Utah · hello@archerdesign.shop
          <span className="mx-2">·</span>
          <a href="/start/terms" className="underline underline-offset-4 hover:text-[#A9A092]">Service terms</a>
        </footer>
      </div>
    </main>
  );
}
