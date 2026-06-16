import type { Metadata } from "next";
import Link from "next/link";
import { VAULT_RESOURCES, VAULT_SUBTITLE, VAULT_TITLE } from "@/lib/value-vault";

const DESCRIPTION =
  "Practical tools for hotel, resort, restaurant, spa, and venue leaders: the Creative Bandwidth Scorecard, pilot map, before/after examples, cost comparison, and more.";

export const metadata: Metadata = {
  title: "Hospitality Resource Vault",
  description: DESCRIPTION,
  alternates: { canonical: "/hospitality-resource-vault" },
  openGraph: {
    title: "Hospitality Resource Vault",
    description: DESCRIPTION,
    url: "/hospitality-resource-vault",
  },
};

export default function HospitalityResourceVaultPage() {
  return (
    <main className="min-h-screen bg-[#0b0a08] text-[#F6F1E7]">
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(1100px 520px at 50% -10%, rgba(201,164,76,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-5xl px-5 py-14 sm:py-20">
        <header className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
            Archer Design · Hospitality Creative
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{VAULT_TITLE}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#C8BFAD]">
            {VAULT_SUBTITLE}
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {VAULT_RESOURCES.map((r) => {
            const comingSoon = r.status === "coming_soon";
            const card = (
              <div
                className={`flex h-full flex-col rounded-2xl border p-6 transition ${
                  comingSoon
                    ? "border-[rgba(201,164,76,0.10)] bg-[#100e0b]/60"
                    : "border-[rgba(201,164,76,0.16)] bg-[#100e0b]/80 hover:border-[rgba(201,164,76,0.45)]"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-[#F6F1E7]">{r.title}</h2>
                  {comingSoon && (
                    <span className="shrink-0 rounded-full border border-[rgba(201,164,76,0.25)] px-2.5 py-1 text-[10px] uppercase tracking-wide text-[#9a917f]">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[#C8BFAD]">{r.description}</p>
                <p className="mt-4 text-xs text-[#8f8674]">
                  <span className="text-[#C9A44C]">For:</span> {r.audience}
                </p>
                <div className="mt-5 pt-1">
                  <span
                    className={`inline-flex items-center text-sm font-medium ${
                      comingSoon ? "text-[#6f685c]" : "text-[#E8D7A2]"
                    }`}
                  >
                    {comingSoon ? "Available soon" : `${r.ctaLabel} →`}
                  </span>
                </div>
              </div>
            );

            if (comingSoon) {
              return (
                <div key={r.id} className="cursor-default">
                  {card}
                </div>
              );
            }
            return (
              <Link key={r.id} href={r.href} className="block">
                {card}
              </Link>
            );
          })}
        </div>

        <div className="mt-14 rounded-2xl border border-[rgba(201,164,76,0.25)] bg-[rgba(201,164,76,0.06)] p-8 text-center">
          <h3 className="text-xl font-semibold">Not sure where to start?</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#C8BFAD]">
            Run the Creative Bandwidth Scorecard first — it takes 3–5 minutes and points you
            to the resources that match your biggest gaps.
          </p>
          <Link
            href="/hotel-creative-scorecard"
            className="mt-5 inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] transition"
            style={{ background: "linear-gradient(135deg, #E8D7A2, #C9A44C, #8B6A21)" }}
          >
            Take the scorecard →
          </Link>
        </div>
      </div>
    </main>
  );
}
