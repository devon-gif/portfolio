import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { HeroVideoBackground } from "./HeroVideoBackground";
import { PROOF_STATS, CONFIDENCE_QUOTE, CONFIDENCE_QUALIFICATION, TRUST_BAR, TRUST_ICONS } from "../tcrm-content";
import { Quote, ShieldCheck } from "lucide-react";

/**
 * Client-facing hero for /tcrm. Speaks directly to a hotel GM who received
 * this URL from their TCRM contact: what this is, who is producing it,
 * and where to click next. Deliberately not framed as a proposal or pitch
 * to TCRM itself -- TCRM is the presenting relationship, Archer Design is
 * named as the production specialist powering it.
 */
export function TcrmClientHero() {
  return (
    <section className="tl-hero--video">
      <HeroVideoBackground
        src="/tcrm/videos/tcrm-hero.mp4"
        poster="/tcrm/images/tcrm-hero-poster.webp"
        alt="Hotel arrival with vintage car, The Wayfinder"
      />
      <div className="tl-hero-overlay" aria-hidden="true" />

      <div className="tl-shell relative z-[3]">
        <Reveal className="tl-hero-content">
          <p className="tl-eyebrow">TCRM Creative Activation</p>
          <span className="mt-4 block h-px w-12 bg-[#7fe0d0] opacity-80" aria-hidden="true" />
          <h1 className="mt-5 text-[2.05rem] leading-[1.14] sm:text-[2.5rem] lg:text-[2.75rem]">
            Turn your revenue priorities into finished creative.
          </h1>
          <p className="tl-hero-copy mt-5 max-w-[42ch] text-[14.5px] leading-[1.65]">
            TCRM clients can now access specialized hospitality creative production through Archer Design,
            including motion graphics, campaign visuals, F&amp;B promotions, event creative, seasonal
            campaigns, and property-level marketing assets.
          </p>

          <div className="tl-partnership-card mt-5">
            <span className="tl-partnership-logo-chip">
              <Image
                src="/tcrm/logos/tcrm-logo.png"
                alt="Total Customized Revenue Management"
                width={352}
                height={110}
                className="tl-partnership-logo"
              />
            </span>
            <p className="tl-partnership-card-text">
              Creative strategy informed by TCRM. Production by Archer Design.
            </p>
          </div>

          <div className="tl-metrics-band mt-5">
            {PROOF_STATS.map((s) => (
              <div key={s.label} className="tl-metric">
                <s.icon className="tl-metric-icon" size={15} strokeWidth={1.75} aria-hidden="true" />
                <p className="tl-metric-value">{s.value}</p>
                <p className="tl-metric-label">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-stretch gap-3.5">
            <a href="#plans" className="tl-btn">
              Explore Creative Plans
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </a>
            <a href="#creative-types" className="tl-btn-ghost tl-btn-ghost--on-dark">
              See What You Can Create
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          <div className="tl-trust-bar mt-6">
            {TRUST_BAR.map((label, i) => {
              const Icon = TRUST_ICONS[i] ?? ShieldCheck;
              return (
                <span key={label} className="tl-trust-chip tl-trust-chip--on-dark">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {label}
                </span>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={2} className="tl-proof-float">
          <Quote className="tl-proof-float-mark" size={22} strokeWidth={0} fill="currentColor" aria-hidden="true" />
          <p className="tl-proof-float-text">{CONFIDENCE_QUOTE}</p>
          <span className="tl-hline my-4" aria-hidden="true" />
          <p className="tl-proof-float-qualifier">{CONFIDENCE_QUALIFICATION}</p>
        </Reveal>
      </div>

      <div className="tl-hero-fade" aria-hidden="true" />
    </section>
  );
}
