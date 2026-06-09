import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact Archer Design",
  description: "Request a 7-day trial or get in touch about hospitality creative support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-[#F6F1E7] md:py-20">
      <section className="mx-auto max-w-3xl rounded-3xl border border-[rgba(201,164,76,0.24)] bg-[#0b0a08] p-8 shadow-[0_0_60px_rgba(201,164,76,0.10)] md:p-12">
        <div className="mx-auto flex flex-col items-center text-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-[rgba(201,164,76,0.24)] bg-black shadow-[0_0_28px_rgba(201,164,76,0.18)] md:h-36 md:w-36">
            <Image
              src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
              alt="Archer Design logo"
              fill
              sizes="(max-width: 768px) 112px, 144px"
              className="object-cover"
              priority
            />
          </div>
          <span className="mt-6 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Contact
          </span>
          <h1 className="mt-3 font-serif text-[clamp(30px,4vw,48px)] font-semibold leading-tight text-[#F6F1E7]">
            Request a 7-day trial or ask a quick question.
          </h1>
          <p className="mt-4 max-w-2xl text-[#A9A092]">
            Share a few details and I’ll reply by email. This form goes straight to Archer Design and
            keeps the inbox address off the page.
          </p>
        </div>

        <div className="mt-8">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
