import { Fragment } from "react";
import Link from "next/link";
import { fraunces } from "@/components/marketing/studioFont";
import { Reveal } from "./components/Reveal";
import { InfuseNav } from "./InfuseNav";
import { InfuseScrollProgress } from "./InfuseScrollProgress";
import { InfuseAnimatedStat } from "./InfuseAnimatedStat";
import { InfuseHeroVideo } from "./components/InfuseHeroVideo";
import { InfuseHeroScrollCue } from "./InfuseHeroScrollCue";
import { InfuseLogoLockup } from "./InfuseLogoLockup";
import { InfusePricing } from "./InfusePricing";
import { InfuseStillToMotion } from "./InfuseStillToMotion";
import { InfuseMotionGallery } from "./InfuseMotionGallery";
import { InfuseValueQuote } from "./InfuseValueQuote";
import { InfuseGraphicGallery } from "./InfuseGraphicGallery";
import { HERO_VIDEO_SRC, HERO_VIDEO_POSTER, HERO_VIDEO_ALT } from "./infuse-media";
import {
  CALENDLY_URL,
  HERO_LABEL,
  HERO_HEADLINE_LINE_1,
  HERO_HEADLINE_LINE_2_BASE,
  HERO_HEADLINE_ACCENT,
  HERO_COPY,
  HERO_CTA_PRIMARY,
  HERO_CTA_PRIMARY_HREF,
  HERO_CTA_SECONDARY,
  HERO_SCROLL_TARGET_ID,
  LOGO_LOCKUP_CAPTION_HERO,
  SERVICES_EYEBROW,
  SERVICES_HEADLINE,
  SERVICES_SUBCOPY,
  SERVICES,
  SERVICES_MULTI_CONCEPT_NOTE,
  PROOF_STATS,
  THIRTY_EYEBROW,
  THIRTY_HEADLINE,
  THIRTY_SUBCOPY,
  THIRTY_ITEMS,
  ABOUT_EYEBROW,
  ABOUT_NAME,
  ABOUT_TITLE,
  ABOUT_COPY,
  ABOUT_EXPERIENCE,
  FINAL_LABEL,
  FINAL_EYEBROW,
  FINAL_HEADLINE_LINE_1,
  FINAL_HEADLINE_LINE_2,
  FINAL_COPY,
  FINAL_CTA_PRIMARY,
  FINAL_CTA_SECONDARY,
  FINAL_CTA_SECONDARY_HREF,
  FINAL_LOGO_LINE,
  FOOTER_LOCKUP,
  FOOTER_DISCLOSURE_LINE,
} from "./infuse-content";

export function InfuseShowcase() {
  return (
    <main className={`infuse-theme ${fraunces.variable}`}>
      <InfuseScrollProgress />

      {/* ── Hero — one large designed frame: single looping sushi clip,
          floating glass nav, dark-glass content panel, decorative rail,
          and a floating stats bar carrying the real Archer track record ── */}
      <section className="infuse-hero-shell" id="top">
        <div className="infuse-hero">
          <InfuseHeroVideo src={HERO_VIDEO_SRC} poster={HERO_VIDEO_POSTER} alt={HERO_VIDEO_ALT} />
          <div className="infuse-hero-shade" />

          <div className="infuse-hero-inner">
            <InfuseNav />

            <div className="infuse-hero-rail" aria-hidden="true">
              <span className="infuse-hero-rail-dot" />
              <span className="infuse-hero-rail-dot" />
              <span className="infuse-hero-rail-dot is-active" />
              <span className="infuse-hero-rail-num">02</span>
              <span className="infuse-hero-rail-line" />
              <span className="infuse-hero-rail-total">10</span>
            </div>

            <div className="infuse-hero-content">
              <div className="infuse-hero-textpanel">
                <span className="infuse-hero-label">{HERO_LABEL}</span>
                <h1 className="infuse-serif">
                  {HERO_HEADLINE_LINE_1}
                  <br />
                  {HERO_HEADLINE_LINE_2_BASE}
                  <span className="infuse-hero-accent">{HERO_HEADLINE_ACCENT}</span>
                </h1>
                <p className="infuse-hero-copy">{HERO_COPY}</p>
                <div className="infuse-hero-actions">
                  <a className="infuse-btn infuse-btn-solid" href={HERO_CTA_PRIMARY_HREF}>
                    {HERO_CTA_PRIMARY}
                  </a>
                  <a className="infuse-btn infuse-btn-outline" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                    {HERO_CTA_SECONDARY}
                  </a>
                </div>
              </div>
            </div>

            <div className="infuse-hero-stats">
              {PROOF_STATS.map((stat, i) => (
                <Fragment key={stat.label}>
                  {i > 0 && <span className="infuse-hero-stat-divider" aria-hidden="true" />}
                  <div className="infuse-hero-stat">
                    <strong>
                      <InfuseAnimatedStat value={stat.value} />
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                </Fragment>
              ))}
            </div>

            <InfuseHeroScrollCue targetId={HERO_SCROLL_TARGET_ID} />
          </div>
        </div>
      </section>

      {/* ── Archer × Infuse lockup — "prepared for" framing, not a
          partnership announcement ──────────────────────────────────────── */}
      <section className="infuse-logo-band">
        <div className="infuse-shell">
          <Reveal className="infuse-logo-band-inner">
            <InfuseLogoLockup infuseLogoSrc="/infuse/brand/infuse-hospitality-logo-light.webp" />
            <span className="infuse-logo-band-caption">{LOGO_LOCKUP_CAPTION_HERO}</span>
          </Reveal>
        </div>
      </section>

      {/* ── Motion Work (major gallery) — immediately after the hero:
          proof first, explanation second ─────────────────────────────── */}
      <InfuseMotionGallery />

      {/* ── Short "still image doesn't have to stay still" positioning ──── */}
      <InfuseStillToMotion />

      {/* ── Standalone value quote ────────────────────────────────────── */}
      <InfuseValueQuote />

      {/* ── Graphic + Campaign Work (major gallery) ─────────────────────── */}
      <InfuseGraphicGallery />

      {/* ── Capabilities ("Services") — staggered masonry ────────────────── */}
      <section className="infuse-services" id="capabilities">
        <div className="infuse-shell">
          <Reveal>
            <span className="infuse-eyebrow">{SERVICES_EYEBROW}</span>
            <div className="infuse-heading">
              <h2 className="infuse-serif">{SERVICES_HEADLINE}</h2>
              <p>{SERVICES_SUBCOPY}</p>
            </div>
          </Reveal>
          <div className="infuse-services-grid">
            {SERVICES.map((service, i) => (
              <Reveal key={service.number} delay={((i % 3) + 2) as 2 | 3 | 4}>
                <div className="infuse-service-card">
                  <span className="infuse-service-number">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={3}>
            <p className="infuse-services-note">{SERVICES_MULTI_CONCEPT_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── First 30 days — floating glass cards ─────────────────────────── */}
      <section className="infuse-thirty" id="approach">
        <div className="infuse-shell">
          <Reveal>
            <span className="infuse-eyebrow">{THIRTY_EYEBROW}</span>
            <div className="infuse-heading">
              <h2 className="infuse-serif">{THIRTY_HEADLINE}</h2>
              <p>{THIRTY_SUBCOPY}</p>
            </div>
          </Reveal>
          <div className="infuse-thirty-list">
            {THIRTY_ITEMS.map((item, i) => (
              <Reveal key={item} delay={((i % 3) + 2) as 2 | 3 | 4}>
                <div className="infuse-thirty-item">
                  <strong>{String(i + 1).padStart(2, "0")}</strong>
                  <p>{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing / engagement ────────────────────────────────────────── */}
      <InfusePricing />

      {/* ── About Devon ─────────────────────────────────────────────────── */}
      <section className="infuse-about">
        <div className="infuse-shell">
          <Reveal>
            <span className="infuse-eyebrow">{ABOUT_EYEBROW}</span>
            <div className="infuse-about-grid">
              <div>
                <div className="infuse-about-name infuse-serif">{ABOUT_NAME}</div>
                <div className="infuse-about-title">{ABOUT_TITLE}</div>
              </div>
              <div>
                <p>{ABOUT_COPY}</p>
                <p>{ABOUT_EXPERIENCE}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA — bold coral finish ────────────────────────────────── */}
      <section className="infuse-final" id="contact">
        <div className="infuse-shell">
          <Reveal>
            <span className="infuse-final-label">{FINAL_LABEL}</span>
            <span className="infuse-eyebrow">{FINAL_EYEBROW}</span>
            <h2 className="infuse-serif">
              {FINAL_HEADLINE_LINE_1}
              <br />
              {FINAL_HEADLINE_LINE_2}
            </h2>
            <p>{FINAL_COPY}</p>
            <div className="infuse-final-actions">
              <a className="infuse-btn infuse-btn-solid" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                {FINAL_CTA_PRIMARY}
              </a>
              <Link className="infuse-btn infuse-btn-outline" href={FINAL_CTA_SECONDARY_HREF}>
                {FINAL_CTA_SECONDARY}
              </Link>
            </div>
            <div className="infuse-final-logo">
              <InfuseLogoLockup infuseLogoSrc="/infuse/brand/infuse-hospitality-logo-light.webp" />
              <span className="infuse-final-logo-line">{FINAL_LOGO_LINE}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="infuse-footer">
        <div className="infuse-shell">
          <span className="infuse-footer-lockup">{FOOTER_LOCKUP}</span>
          <p className="infuse-footer-note">{FOOTER_DISCLOSURE_LINE}</p>
        </div>
      </footer>
    </main>
  );
}
