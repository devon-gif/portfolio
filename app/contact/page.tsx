import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/ContactForm";
import { StudioHeader } from "@/components/marketing/StudioHeader";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { fraunces } from "@/components/marketing/studioFont";
import { CALENDLY_URL } from "@/lib/seo";
import { ARCHER_PRICING, formatMoney } from "@/app/packages/pricing";

export const metadata: Metadata = {
  title: "Contact Archer Design",
  description:
    "Send a property link, request a one-off creative pack, or book a quick intro to see how Archer Design can turn your existing hospitality assets into polished creative.",
  alternates: { canonical: "/contact" },
};

const STEPS = [
  "A property, restaurant, event, spa, or campaign link",
  "Any existing assets — past professional photos, staff iPhone clips, menus, or event details",
  "What you'd like to see more of: social, short-form motion, campaign visuals, or booking-support creative",
];

const PLAN_LABELS: Record<string, string> = {
  starter: "30-Day Creative Starter — $895 one-time",
  essential: "Essential monthly plan — $895/month",
  growth: "Growth monthly plan — $1,295/month",
  "full-campaign": "Full Campaign monthly plan — $1,695/month",
};

type ContactSearchParams = Promise<{
  package?: string;
  static?: string;
  motion?: string;
  plan?: string;
}>;

function selectedMessage(params: Awaited<ContactSearchParams>): string {
  if (params.package === "on-demand") {
    const staticCount = Math.max(0, Math.min(10, Number.parseInt(params.static ?? "0", 10) || 0));
    const motionCount = Math.max(0, Math.min(10, Number.parseInt(params.motion ?? "0", 10) || 0));
    const count = staticCount + motionCount;

    if (count > 0 && count <= 10) {
      const total = staticCount * ARCHER_PRICING.static + motionCount * ARCHER_PRICING.motion;
      return `I'm interested in an on-demand creative pack with ${staticCount} static graphic${staticCount === 1 ? "" : "s"} and ${motionCount} motion graphic${motionCount === 1 ? "" : "s"} (${count} total assets, ${formatMoney(total)}).\n\nProperty / campaign link:\n\nWhat I need:`;
    }
  }

  if (params.plan && PLAN_LABELS[params.plan]) {
    return `I'm interested in the ${PLAN_LABELS[params.plan]}.\n\nProperty / campaign link:\n\nWhat I'd like help promoting:`;
  }

  return "";
}

export default async function ContactPage({ searchParams }: { searchParams: ContactSearchParams }) {
  const params = await searchParams;
  const initialMessage = selectedMessage(params);

  return (
    <div className={`${fraunces.variable} archer-studio min-h-screen`}>
      <StudioHeader />

      <main className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="st-kicker">Get started</span>
            <h1 className="mt-4 font-serif text-[clamp(30px,4.5vw,50px)] leading-[1.06] text-[var(--st-ink)]">
              {initialMessage ? "Tell us where to start." : "Send a property link."}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
              {initialMessage
                ? "Your pricing selection is already added below. Send the property or campaign details and we'll confirm scope before production begins."
                : "Share what you already have and we'll take a practical look at where stronger creative could support your team. Need only a few pieces? You can also build a one-off pack with no monthly commitment."}
            </p>
            {!initialMessage ? (
              <p className="mt-4 text-[13px] text-[var(--st-ink-muted)]">
                Want to see pricing first?{" "}
                <Link href="/packages" className="text-[var(--st-gold)] underline underline-offset-4 hover:text-[var(--st-ink)]">
                  View flexible creative options
                </Link>
                .
              </p>
            ) : null}
          </div>

          <section className="st-card mt-10 p-7 md:p-8" aria-label="Book a call">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--st-ink)] text-sm font-semibold text-[var(--st-ivory)]">1</span>
              <div>
                <h2 className="font-serif text-[22px] text-[var(--st-ink)]">Book a quick intro</h2>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  Pick a time that works for you. We&apos;ll talk through the property, the assets you already have, and the right creative starting point.
                </p>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="st-btn mt-5">
                  Book a 30-minute call <span aria-hidden>→</span>
                </a>
                <p className="mt-2.5 text-[12px] text-[var(--st-ink-muted)]">Opens Calendly in a new tab.</p>
              </div>
            </div>
          </section>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--st-line)]" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[var(--st-ink-muted)]">or</span>
            <div className="h-px flex-1 bg-[var(--st-line)]" />
          </div>

          <section className="st-panel p-7 md:p-8" aria-label="Send a message">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--st-line)] bg-white text-sm font-semibold text-[var(--st-gold)]">2</span>
              <div className="w-full">
                <h2 className="font-serif text-[22px] text-[var(--st-ink)]">Send a message</h2>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  Prefer to write? Send your details and we&apos;ll reply by email, usually within one business day. Helpful to include:
                </p>
                <ul className="mt-3 space-y-2">
                  {STEPS.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[var(--st-ink-soft)]">
                      <span className="mt-[2px] shrink-0 text-[var(--st-gold)]">✦</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <ContactForm initialMessage={initialMessage} />
            </div>
          </section>

          <p className="mt-8 text-center text-[13px] text-[var(--st-ink-muted)]">
            Curious how the work plays out first? See our{" "}
            <Link href="/case-studies" className="text-[var(--st-gold)] underline underline-offset-4 hover:text-[var(--st-ink)]">
              hospitality case studies
            </Link>
            .
          </p>
        </div>
      </main>

      <StudioFooter />
    </div>
  );
}
