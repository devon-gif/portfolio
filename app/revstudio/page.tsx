import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/marketing/JsonLd";
import { JointPartnerHeader } from "@/components/marketing/revstudio/JointPartnerHeader";
import { JointFooter } from "@/components/marketing/revstudio/JointFooter";
import { TrackedBookingLink } from "@/components/marketing/revstudio/TrackedBookingLink";
import { PartnershipFAQ } from "@/components/marketing/revstudio/PartnershipFAQ";
import { ObjectStage } from "@/components/marketing/revstudio/ObjectStage";
import { Reveal } from "@/components/marketing/revstudio/Reveal";
import { fraunces } from "@/components/marketing/studioFont";
import { faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { isRevstudioPageApproved } from "@/lib/revstudio";
import { PROOF, ATTRIBUTION_NOTE } from "@/lib/proof-stats";
import {
  HERO,
  EXECUTION_GAP,
  MODEL,
  PROCESS,
  USE_CASES,
  AUDIENCES,
  PILOT,
  PARTNERS,
  FAQ,
  FINAL_CTA,
} from "@/lib/revstudio-content";

const TITLE = "The Revstudio × Archer Design | Revenue Strategy and Hotel Creative Execution";
const DESCRIPTION =
  "Hotel revenue and distribution operations paired with property-level creative execution for independent hotels, hotel groups, and revenue-management agencies.";

const APPROVED = isRevstudioPageApproved();

// Early, unapproved partnership page — noindex by default. Flip
// REVSTUDIO_PAGE_APPROVED=true (see REVSTUDIO_PARTNERSHIP_PAGE_SETUP.md)
// once Ghisela and Devon sign off on the copy below to allow indexing.
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/revstudio" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/revstudio" },
  twitter: { title: TITLE, description: DESCRIPTION },
  robots: APPROVED
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function RevstudioPage() {
  return (
    <div id="top" className={`${fraunces.variable} revstudio-theme relative min-h-screen`}>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "The Revstudio × Archer Design — Revenue Strategy and Creative Execution",
            description: DESCRIPTION,
            path: "/revstudio",
            serviceType: "Hotel revenue-management operations paired with hospitality creative execution",
          }),
          faqJsonLd(FAQ.map(({ q, a }) => ({ q, a }))),
        ]}
      />

      <JointPartnerHeader />

      <main>
        {/* ── 2. Hero — two-column, hero-knot.png anchoring the right side ── */}
        <section className="relative overflow-hidden px-6 pb-24 pt-16 lg:pt-24">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <Image
              src="/revenue-activation/media/background-winter.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_25%] opacity-80"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,11,22,0.6) 0%, rgba(6,11,22,0.8) 55%, rgba(6,11,22,0.97) 100%), linear-gradient(100deg, rgba(6,11,22,0.93) 0%, rgba(6,11,22,0.5) 48%, rgba(6,11,22,0.86) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(45% 55% at 80% 36%, rgba(61,108,255,0.16), transparent 68%)" }}
            />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <Reveal>
              <span className="rv-kicker">{HERO.eyebrow}</span>
              <h1 className="mt-5 font-serif text-[clamp(34px,5.4vw,60px)] leading-[1.04] text-[var(--rv-ink)]">
                {HERO.headline}
              </h1>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--rv-ink-soft)]">{HERO.supporting}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <TrackedBookingLink variant="hero" className="rv-btn px-6 py-3 text-[13.5px]">
                  Discuss a pilot <span aria-hidden>→</span>
                </TrackedBookingLink>
                <a href="#model" className="rv-btn-ghost px-6 py-3 text-[13.5px]">
                  See how the model works
                </a>
              </div>

              <p className="mt-6 text-[13px] text-[var(--rv-ink-muted)]">{HERO.microcopy}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {HERO.indicators.map((label) => (
                  <span key={label} className="rv-chip">
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-7 bg-[var(--rv-blue)]" />
                <p className="font-serif text-[15px] italic text-[var(--rv-slate)]">{HERO.connectorLine}</p>
              </div>
            </Reveal>

            <Reveal delay={2} className="mx-auto w-full max-w-sm lg:max-w-none">
              <ObjectStage variant="knot" size={420} priority />
            </Reveal>
          </div>
        </section>

        {/* ── 3. The execution gap — framed panel, architectural divider ──── */}
        <section id="opportunity" className="scroll-mt-24 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <span className="rv-kicker">{EXECUTION_GAP.eyebrow}</span>
              <h2 className="mt-4 max-w-3xl font-serif text-[clamp(24px,3.4vw,40px)] leading-[1.12] text-[var(--rv-ink)]">
                {EXECUTION_GAP.headline}
              </h2>
            </Reveal>

            <Reveal delay={1} className="mt-12 overflow-hidden rounded-[22px] border border-[var(--rv-line)] bg-[var(--rv-panel)] backdrop-blur-[2px]">
              <div className="grid lg:grid-cols-[1fr_1px_1fr]">
                <div className="p-8 lg:p-11">
                  <p className="rv-kicker !text-[var(--rv-slate)]">The common workflow</p>
                  <ul className="mt-5 space-y-3">
                    {EXECUTION_GAP.workflow.map((line) => (
                      <li key={line} className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">
                        <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--rv-gold)]" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden lg:block rv-vline" aria-hidden="true" />
                <div className="rv-hline lg:hidden" aria-hidden="true" />
                <div className="flex items-center p-8 lg:p-11">
                  <p className="font-serif text-[19px] leading-relaxed text-[var(--rv-ink)]">{EXECUTION_GAP.paragraph}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2} className="mt-14">
              <div className="rv-connector" aria-hidden="true" />
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-center sm:grid-cols-5">
                {EXECUTION_GAP.process.map((step) => (
                  <span key={step} className="rv-kicker !text-[var(--rv-slate)]">
                    {step}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 4. The combined model — system-cube.png centerpiece ─────────── */}
        <section id="model" className="scroll-mt-24 relative overflow-hidden bg-[var(--rv-bg-2)] px-6 py-20 lg:py-28">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ background: "radial-gradient(55% 60% at 50% 0%, rgba(61,108,255,0.09), transparent 65%)" }}
          />
          <div className="relative mx-auto max-w-6xl">
            <Reveal className="text-center">
              <span className="rv-kicker">{MODEL.eyebrow}</span>
              <h2 className="mx-auto mt-4 max-w-2xl font-serif text-[clamp(24px,3.4vw,40px)] leading-[1.12] text-[var(--rv-ink)]">
                {MODEL.headline}
              </h2>
            </Reveal>

            <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
              <Reveal delay={1} className="rv-card p-8">
                <p className="rv-kicker">{MODEL.revstudio.tag}</p>
                <h3 className="mt-2 font-serif text-[24px] text-[var(--rv-ink)]">{MODEL.revstudio.name}</h3>
                <ul className="mt-6 space-y-3">
                  {MODEL.revstudio.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-[var(--rv-ink-soft)]">
                      <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--rv-slate)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={2} className="flex justify-center px-2">
                <ObjectStage variant="cube" size={180} />
              </Reveal>

              <Reveal delay={3} className="rv-card border-[rgba(199,167,107,0.3)] p-8">
                <p className="rv-kicker">{MODEL.archer.tag}</p>
                <h3 className="mt-2 font-serif text-[24px] text-[var(--rv-ink)]">{MODEL.archer.name}</h3>
                <ul className="mt-6 space-y-3">
                  {MODEL.archer.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-[var(--rv-ink-soft)]">
                      <span aria-hidden="true" className="mt-[3px] shrink-0 text-[var(--rv-gold)]">
                        ✦
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={4}>
              <p className="mx-auto mt-10 max-w-xl text-center font-serif text-[16px] italic text-[var(--rv-slate)]">
                One commercial priority. One connected execution path.
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-center text-[12.5px] leading-relaxed text-[var(--rv-ink-muted)]">
                {MODEL.disclaimer}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 5. How it works ─────────────────────────────────────────── */}
        <section className="px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <span className="rv-kicker">{PROCESS.eyebrow}</span>
              <h2 className="mt-4 font-serif text-[clamp(24px,3.4vw,40px)] leading-[1.12] text-[var(--rv-ink)]">
                {PROCESS.headline}
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PROCESS.stages.map((s, i) => (
                <Reveal key={s.n} delay={((i % 3) + 1) as 1 | 2 | 3} className="rv-panel p-6">
                  <span className="font-serif text-[22px] text-[var(--rv-gold)]">{s.n}</span>
                  <h3 className="mt-3 font-serif text-[18px] text-[var(--rv-ink)]">{s.t}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--rv-ink-soft)]">{s.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. In-practice use cases ────────────────────────────────── */}
        <section id="practice" className="scroll-mt-24 bg-[var(--rv-bg-2)] px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <span className="rv-kicker">In practice</span>
              <h2 className="mt-4 font-serif text-[clamp(24px,3.4vw,40px)] leading-[1.12] text-[var(--rv-ink)]">
                What a combined engagement can look like.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {USE_CASES.map((u, i) => (
                <Reveal key={u.t} delay={((i % 2) + 1) as 1 | 2} className="rv-card p-7">
                  <h3 className="font-serif text-[19px] text-[var(--rv-ink)]">{u.t}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--rv-ink-soft)]">{u.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. Who it's for ─────────────────────────────────────────── */}
        <section id="who" className="scroll-mt-24 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <span className="rv-kicker">Who it&apos;s for</span>
              <h2 className="mt-4 font-serif text-[clamp(24px,3.4vw,40px)] leading-[1.12] text-[var(--rv-ink)]">
                Built for teams that identify opportunity but lack execution capacity.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AUDIENCES.map((a, i) => (
                <Reveal key={a.t} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="rv-panel p-6">
                  <h3 className="font-serif text-[17px] text-[var(--rv-ink)]">{a.t}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--rv-ink-soft)]">{a.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. The pilot — split layout, pilot-torus.png ─────────────── */}
        <section id="pilot" className="scroll-mt-24 relative overflow-hidden bg-[var(--rv-bg-2)] px-6 py-20 lg:py-28">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ background: "radial-gradient(45% 60% at 82% 45%, rgba(61,108,255,0.09), transparent 65%)" }}
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <Reveal>
                <span className="rv-kicker">{PILOT.eyebrow}</span>
                <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,40px)] leading-[1.12] text-[var(--rv-ink)]">
                  {PILOT.headline}
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">{PILOT.paragraph}</p>

                <ul className="mt-8 grid max-w-lg gap-2.5 sm:grid-cols-2">
                  {PILOT.framework.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[var(--rv-ink-soft)]">
                      <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--rv-gold)]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap items-center gap-6">
                  <span className="font-serif text-[21px] text-[var(--rv-ink)]">{PILOT.priceLabel}</span>
                  <TrackedBookingLink variant="pilot" className="rv-btn px-6 py-3 text-[13.5px]">
                    Talk through a pilot <span aria-hidden>→</span>
                  </TrackedBookingLink>
                </div>
              </Reveal>

              <Reveal delay={2} className="mx-auto w-full max-w-xs lg:max-w-none">
                <ObjectStage variant="torus" size={340} orbit={false} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 9. Partner introduction ─────────────────────────────────── */}
        <section id="about" className="scroll-mt-24 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="rv-kicker">{PARTNERS.eyebrow}</span>
            </Reveal>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <Reveal delay={1}>
                <h3 className="font-serif text-[20px] text-[var(--rv-ink)]">{PARTNERS.revstudio.name}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--rv-ink-soft)]">{PARTNERS.revstudio.d}</p>
                <a
                  href="https://therevstudio.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[13px] font-semibold text-[var(--rv-gold)] hover:text-[var(--rv-ink)]"
                >
                  therevstudio.co →
                </a>
              </Reveal>
              <Reveal delay={2}>
                <h3 className="font-serif text-[20px] text-[var(--rv-ink)]">{PARTNERS.archer.name}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--rv-ink-soft)]">{PARTNERS.archer.d}</p>
                <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--rv-ink-muted)]">
                  Across tracked hotel, restaurant, event, and wellness campaigns, Archer Design creative has helped
                  generate {PROOF.impressions} impressions, {PROOF.engagements} direct engagements, and {PROOF.reach}{" "}
                  reach.{" "}
                  <a href="/case-studies" className="font-semibold text-[var(--rv-gold)] hover:text-[var(--rv-ink)]">
                    See the case studies →
                  </a>
                </p>
              </Reveal>
            </div>
            <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-[var(--rv-ink-muted)]">{ATTRIBUTION_NOTE}</p>
          </div>
        </section>

        {/* ── 10. FAQ ──────────────────────────────────────────────────── */}
        <section className="bg-[var(--rv-bg-2)] px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className="rv-kicker">Good questions</span>
              <h2 className="mt-4 font-serif text-[clamp(24px,3.4vw,38px)] leading-[1.12] text-[var(--rv-ink)]">
                The practical details.
              </h2>
            </Reveal>
            <Reveal delay={1} className="mt-8">
              <PartnershipFAQ items={FAQ} />
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── 11. Final CTA — glow band ─────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ background: "radial-gradient(55% 70% at 50% 40%, rgba(61,108,255,0.12), transparent 68%)" }}
        />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-[clamp(24px,3.6vw,40px)] leading-[1.1] text-[var(--rv-ink)]">
            {FINAL_CTA.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">
            {FINAL_CTA.supporting}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackedBookingLink variant="final-cta" className="rv-btn px-6 py-3 text-[13.5px]">
              Discuss a pilot <span aria-hidden>→</span>
            </TrackedBookingLink>
            <a href="mailto:hello@archerdesign.shop?subject=The%20Revstudio%20%C3%97%20Archer%20Design" className="rv-btn-ghost px-6 py-3 text-[13.5px]">
              Contact the partners
            </a>
          </div>
          <p className="mt-6 text-[12.5px] text-[var(--rv-ink-muted)]">{FINAL_CTA.microcopy}</p>
        </Reveal>
      </section>

      {/* ── 12. Footer ───────────────────────────────────────────────── */}
      <JointFooter />
    </div>
  );
}
