import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact Archer Design",
  description:
    "Get 5 free sample assets or book a 30-minute call to discuss creative support for your hospitality properties.",
};

const GOLD = "linear-gradient(135deg, #E8D7A2, #C9A44C, #8B6A21)";
const CALENDLY_URL = "https://calendly.com/devonavich0/30min";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-[#F6F1E7] md:py-20">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[rgba(201,164,76,0.24)] bg-black shadow-[0_0_28px_rgba(201,164,76,0.18)]">
            <Image
              src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
              alt="Archer Design logo"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>
          <span className="mt-5 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Get started
          </span>
          <h1 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
            Get 5 free sample assets.
          </h1>
          <p className="mt-3 max-w-xl text-[#A9A092]">
            Send your existing property photos, menus, or event details and we&apos;ll build 5
            polished, campaign-ready assets in 7 days, free, no card required. Or book a quick
            call if you&apos;d rather talk first.
          </p>
        </div>

        {/* Option 1: Book a call */}
        <section
          className="rounded-2xl border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] p-7 shadow-[0_0_40px_rgba(201,164,76,0.10)]"
          aria-label="Book a call"
        >
          <div className="flex items-start gap-4">
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#1a1407]"
              style={{ background: GOLD }}
            >
              1
            </span>
            <div>
              <h2 className="font-serif text-xl text-[#F6F1E7]">Book a 30-minute call</h2>
              <p className="mt-1.5 text-[14px] text-[#A9A092]">
                Pick a time that works for you. We&apos;ll talk through your properties, what you
                need, and whether the free trial makes sense to start.
              </p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[#1a1407] shadow-[0_4px_20px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_32px_rgba(201,164,76,0.4)]"
                style={{ background: GOLD }}
              >
                Book a 30-minute call <span aria-hidden>→</span>
              </a>
              <p className="mt-2.5 text-[12px] text-[#A9A092]/70">Opens Calendly in a new tab.</p>
            </div>
          </div>
        </section>

        {/* OR divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[rgba(201,164,76,0.16)]" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#A9A092]">or</span>
          <div className="h-px flex-1 bg-[rgba(201,164,76,0.16)]" />
        </div>

        {/* Option 2: Send a message */}
        <section
          className="rounded-2xl border border-[rgba(201,164,76,0.18)] bg-[#0b0a08] p-7 shadow-[0_0_40px_rgba(0,0,0,0.28)]"
          aria-label="Send a message"
        >
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(201,164,76,0.28)] bg-[rgba(5,5,5,0.6)] text-sm font-bold text-[#C9A44C]">
              2
            </span>
            <div className="w-full">
              <h2 className="font-serif text-xl text-[#F6F1E7]">Send a message</h2>
              <p className="mt-1.5 text-[14px] text-[#A9A092]">
                Prefer to write? Send your details and I&apos;ll reply by email, usually within
                one business day.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

      </div>
    </main>
  );
}
