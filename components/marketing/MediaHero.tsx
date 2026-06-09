"use client";

import { GOLD_GRADIENT, HERO_VIDEO_CINEMATIC } from "./media";

/**
 * Above-the-fold hero: eyebrow + headline, subhead, cinematic video, dual CTAs.
 * Primary CTA: "Get 5 Free Sample Assets" — used everywhere, never changed.
 */
export function MediaHero() {
  return (
    <section className="relative mx-auto max-w-[1180px] px-6 pt-8 pb-10 md:pt-10">
      <div className="mx-auto flex max-w-[940px] flex-col items-center text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
          Hospitality Creative Studio
        </span>

        <h1 className="mt-3 max-w-[880px] font-serif text-[clamp(34px,5.4vw,60px)] font-semibold leading-[0.96] tracking-[-0.01em] text-[#F6F1E7]">
          Your hotel group&apos;s creative team —{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD_GRADIENT }}>
            without the $90K hire.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-[680px] text-[clamp(13px,1.3vw,16px)] leading-relaxed text-[#A9A092]">
          Social content, short-form motion, and local SEO for hotel groups, management companies,
          and multi-property brands. 13.9M+ impressions delivered for hospitality clients — using
          the photos and assets your properties already have.
        </p>

        {/* Large cinematic hero video with a soft golden glow + thin gold border */}
        <div className="relative mt-7 w-full">
          <div
            className="pointer-events-none absolute -inset-5 -z-10 rounded-[28px] opacity-70 blur-[44px]"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(201,164,76,0.42), rgba(201,164,76,0.16) 38%, transparent 74%)",
            }}
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[20px] border border-[rgba(201,164,76,0.32)] shadow-[0_0_0_1px_rgba(232,215,162,0.18),0_24px_70px_rgba(0,0,0,0.55)]">
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.05),rgba(5,5,5,0.28))]" />
            <video
              className="aspect-[16/9] w-full object-cover sm:aspect-[2/1]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Archer Design hospitality creative showreel"
            >
              <source src={HERO_VIDEO_CINEMATIC} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
            style={{ background: GOLD_GRADIENT }}
          >
            Get 5 Free Sample Assets <span aria-hidden>→</span>
          </a>
          <a
            href="#work"
            className="rounded-xl border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.28)] px-6 py-3.5 text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C] hover:bg-[rgba(201,164,76,0.06)]"
          >
            See the work →
          </a>
        </div>

        <p className="mt-3 text-[13px] text-[#A9A092]">
          No call required. No card. Send your existing photos and get 5 finished pieces in 7 days.
        </p>

        <p className="mt-4 flex items-center gap-2 text-[13px] text-[#A9A092]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9A44C] shadow-[0_0_10px_#C9A44C]" />
          Currently onboarding 1–2 new hospitality groups for monthly creative support.
        </p>
      </div>
    </section>
  );
}
