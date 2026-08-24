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
  searchParams: Promise<{ offer?: string; test?: string }>;
}) {
  const params = await searchParams;
  const offer = getCheckoutOffer(params.offer);
  const isTest = params.test === "1";
  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_PORTAL_LOGIN_URL ?? "";

  return (
    <main className={`${fraunces.variable} min-h-screen bg-[#050505] px-6 py-16 text-[#F6F1E7]`}>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[32px] border border-[rgba(201,164,76,0.24)] bg-white/[0.035] p-8 shadow-[0_0_70px_rgba(201,164,76,0.1)] md:p-10">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${isTest ? "bg-violet-400 text-[#160d24]" : "bg-[#C9A44C] text-[#161006]"}`}>✓</div>
          <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.22em] ${isTest ? "text-violet-300" : "text-[#C9A44C]"}`}>
            {isTest ? "No-charge onboarding test completed" : "Payment confirmed"}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-luxury-serif)] text-4xl font-semibold leading-tight md:text-5xl">
            {isTest ? "The onboarding flow worked." : "You’re on the Archer Design calendar."}
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[#A9A092]">
            {isTest
              ? "A clearly marked test client record was created in Archer Design onboarding. No Stripe customer, subscription, card, or charge was created."
              : `Thanks for starting the ${offer.id === "general" ? "Archer Design" : offer.eyebrow.toLowerCase()} partnership. Your package, scope count, and billing record are now in the onboarding system.`}
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-sm font-semibold text-[#F6F1E7]">{isTest ? "What to test next" : "What happens next"}</p>
            <ol className="mt-3 space-y-3 text-sm leading-relaxed text-[#A9A092]">
              {isTest ? (
                <>
                  <li><span className="mr-2 text-violet-300">01</span> Open Client Accounts and confirm the [TEST] record appears.</li>
                  <li><span className="mr-2 text-violet-300">02</span> Continue through intake, kickoff, approvals, and account setup as if this were a real client.</li>
                  <li><span className="mr-2 text-violet-300">03</span> Delete or archive the test record when the workflow is verified.</li>
                </>
              ) : (
                <>
                  <li><span className="mr-2 text-[#C9A44C]">01</span> Archer Design confirms your package and billing.</li>
                  <li><span className="mr-2 text-[#C9A44C]">02</span> You receive the onboarding intake for properties, brand assets, approvals, and priorities.</li>
                  <li><span className="mr-2 text-[#C9A44C]">03</span> We schedule kickoff and build the first monthly creative plan.</li>
                </>
              )}
            </ol>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {isTest ? (
              <a
                href="/client-accounts"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-violet-400 px-5 py-3.5 text-sm font-bold text-[#160d24] hover:bg-violet-300"
              >
                Open Client Accounts
              </a>
            ) : (
              <a
                href="mailto:hello@archerdesign.shop"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#C9A44C] px-5 py-3.5 text-sm font-bold text-[#161006] hover:bg-[#D9BA68]"
              >
                Email Archer Design
              </a>
            )}
            {!isTest && portalUrl ? (
              <a
                href={portalUrl}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-[#E8D7A2] hover:border-[#C9A44C]"
              >
                Manage billing
              </a>
            ) : (
              <a
                href={isTest ? `/start?offer=${encodeURIComponent(offer.id)}` : "/start/terms#billing"}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-[#E8D7A2] hover:border-[#C9A44C]"
              >
                {isTest ? "Run another test" : "Billing & cancellation info"}
              </a>
            )}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-[#777066]">
            {isTest
              ? "Local test mode never calls Stripe. Use Stripe test mode separately when you want to verify the hosted payment screen and webhook flow without real money."
              : "Stripe will also send the payment receipt to the email used at checkout. Keep that email for your records."}
          </p>
        </div>
      </div>
    </main>
  );
}
