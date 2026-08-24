import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monthly Service Terms",
  robots: { index: false, follow: false },
};

export default function ServiceTermsPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-14 text-[#F6F1E7]">
      <article className="mx-auto max-w-3xl">
        <a href="/start" className="text-sm text-[#C9A44C] hover:text-[#E8D7A2]">← Back to plans</a>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A44C]">Archer Design LLC</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Monthly service & billing terms</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#8F877B]">Last updated August 24, 2026.</p>

        <div className="mt-9 space-y-8 text-[15px] leading-relaxed text-[#B9B0A1]">
          <section>
            <h2 className="font-serif text-2xl text-[#F6F1E7]">1. Monthly service</h2>
            <p className="mt-3">
              The package selected at checkout establishes the monthly service level, monthly fee, and the number of properties or brands in scope. Specific deliverables, priorities, campaign timing, approval contacts, and access requirements are confirmed during onboarding. Any separate signed proposal, statement of work, or written agreement controls if it conflicts with these checkout terms.
            </p>
          </section>

          <section id="billing">
            <h2 className="font-serif text-2xl text-[#F6F1E7]">2. Recurring billing</h2>
            <p className="mt-3">
              By completing Stripe checkout, the client authorizes Archer Design LLC to charge the selected monthly amount at checkout and automatically each month thereafter until canceled. Payments are processed securely by Stripe; Archer Design does not store full card numbers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#F6F1E7]">3. Cancellation</h2>
            <p className="mt-3">
              Month-to-month subscriptions may be canceled before the next renewal date to stop future charges. Cancellation does not automatically create a refund for the current billing period, including work already delivered, scheduled, or underway. If a separate written agreement specifies a different term or notice period, that agreement controls.
            </p>
            <p className="mt-3">
              Billing can be managed through the Stripe customer portal once activated for the account. Clients can also request cancellation by emailing <a className="text-[#E8D7A2] underline underline-offset-4" href="mailto:hello@archerdesign.shop">hello@archerdesign.shop</a> before the next renewal date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#F6F1E7]">4. Client approvals & inputs</h2>
            <p className="mt-3">
              Timely delivery depends on access to brand assets, property information, source photos or video when needed, campaign details, and timely client approvals. Delays caused by missing information or approvals may shift delivery dates without changing the billing cycle.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#F6F1E7]">5. Revisions & additional work</h2>
            <p className="mt-3">
              Normal revisions are handled within the selected package and agreed workflow. Material scope changes, major website builds, paid media spend, on-site production, complex data integrations, extensive new branding, or work outside the selected package may require a separate quote or written approval before work begins.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#F6F1E7]">6. Ownership & portfolio use</h2>
            <p className="mt-3">
              Final approved deliverables are licensed to the client for normal business and marketing use once the applicable invoice is paid. Third-party fonts, stock assets, music, platform assets, trademarks, and licensed materials remain subject to their own license terms. Unless the client requests confidentiality in writing, Archer Design may reference completed public-facing work in its portfolio and case studies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#F6F1E7]">7. Questions</h2>
            <p className="mt-3">
              Questions about scope, billing, cancellation, or onboarding can be sent to <a className="text-[#E8D7A2] underline underline-offset-4" href="mailto:hello@archerdesign.shop">hello@archerdesign.shop</a> before checkout.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
