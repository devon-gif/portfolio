import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { getCheckoutOffer } from "@/lib/checkout-offers";

const fraunces = Fraunces({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Welcome to Archer Design",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ offer?: string }>;
}) {
  const params = await searchParams;
  const offer = getCheckoutOffer(params.offer);
  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_PORTAL_LOGIN_URL ?? "";

  return (
    <main className={`${fraunces.variable} min-h-screen bg-[#050505] px-6 py-16 text-[#F6F1E7]`}>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[32px] border border-[rgba(201,164,76,0.24)] bg-white/[0.035] p-8 shadow-[0_0_70px_rgba(201,164,76,0.1)] md:p-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A44C] text-xl font-bold text-[#161006]">✓</div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A44C]">Payment confirmed</p>
          <h1 className="mt-3 font-[family-name:var(--font-luxury-serif)] text-4xl font-semibold leading-tight md:text-5xl">
            You&apos;re on the Archer Design calendar.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[#A9A092]">
            Thanks for starting the {offer.id === "general" ? "Archer Design" : offer.eyebrow.toLowerCase()} partnership. Your package, scope count, and billing record are now in the onboarding system.
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-sm font-semibold text-[#F6F1E7]">What happens next</p>
            <ol className="mt-3 space-y-3 text-sm leading-relaxed text-[#A9A092]">
              <li><span className="mr-2 text-[#C9A44C]">01</span> Archer Design confirms your package and billing.</li>
              <li><span className="mr-2 text-[#C9A44C]">02</span> You receive the onboarding intake for properties, brand assets, approvals, and priorities.</li>
              <li><span className="mr-2 text-[#C9A44C]">03</span> We schedule kickoff and build the first monthly creative plan.</li>
            </ol>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:hello@archerdesign.shop"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#C9A44C] px-5 py-3.5 text-sm font-bold text-[#161006] hover:bg-[#D9BA68]"
            >
              Email Archer Design
            </a>
            {portalUrl ? (
              <a
                href={portalUrl}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-[#E8D7A2] hover:border-[#C9A44C]"
              >
                Manage billing
              </a>
            ) : (
              <a
                href="/start/terms#billing"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-[#E8D7A2] hover:border-[#C9A44C]"
              >
                Billing & cancellation info
              </a>
            )}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-[#777066]">
            Stripe will also send the payment receipt to the email used at checkout. Keep that email for your records.
          </p>
        </div>
      </div>
    </main>
  );
}
