import type { Metadata } from "next";
import { GapReviewForm } from "./GapReviewForm";

const DESCRIPTION =
  "Send 3 property links and get a clear map of your biggest creative opportunities across social, F&B/events, local campaigns, and reporting.";

export const metadata: Metadata = {
  title: "Request a 3-Property Creative Gap Review",
  description: DESCRIPTION,
  alternates: { canonical: "/creative-gap-review" },
  openGraph: {
    title: "Request a 3-Property Creative Gap Review",
    description: DESCRIPTION,
    url: "/creative-gap-review",
  },
};

export default function CreativeGapReviewPage() {
  return (
    <main className="min-h-screen bg-[#0b0a08] text-[#F6F1E7]">
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(1100px 520px at 50% -10%, rgba(201,164,76,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
        <header className="mb-9 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
            Archer Design · Free Review
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Request a 3-Property Creative Gap Review
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#C8BFAD]">
            Send over 3 property links and I&apos;ll map the biggest creative opportunities
            around social, F&amp;B/events, local campaigns, and reporting. No pitch — just a
            clear picture of where the gains are.
          </p>
        </header>

        <GapReviewForm />

        <footer className="mt-12 text-center text-xs text-[#7c7468]">
          Make every property look as strong online as it does in person.
        </footer>
      </div>
    </main>
  );
}
