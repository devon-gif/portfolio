"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Film, LayoutGrid } from "lucide-react";
import { ASSET_PRICING, CUSTOM_PACK_BOUNDS, CUSTOM_PACK_COPY, CUSTOM_PACK_KEY, customPackTotal, fmtMoney } from "../tcrm-pricing";
import { Reveal } from "./Reveal";

/**
 * Build Your Own Creative Pack: a flexible 1-10 asset one-off, with a
 * static/motion mix chooser that structurally cannot violate
 * static + motion = total (static is always derived as total - motion,
 * never an independently settable number). Per-asset pricing is read from
 * ASSET_PRICING (tcrm-pricing.ts); when it is not yet approved for
 * client-facing display, this renders "Custom total, confirmed before
 * production" rather than inventing a figure.
 */
export function AssetPackBuilder() {
  const { min, max, defaultTotal, defaultMotion } = CUSTOM_PACK_BOUNDS;
  const [total, setTotal] = useState(defaultTotal);
  const [motion, setMotion] = useState(defaultMotion);
  const staticCount = total - motion;

  function changeTotal(next: number) {
    const clamped = Math.min(max, Math.max(min, next));
    setTotal(clamped);
    setMotion((m) => Math.min(m, clamped));
  }

  function changeMotion(next: number) {
    setMotion(Math.min(total, Math.max(0, next)));
  }

  const total$ = useMemo(() => customPackTotal(staticCount, motion), [staticCount, motion]);
  const pricingApproved = ASSET_PRICING.static != null && ASSET_PRICING.motion != null;

  const requestHref = `/tcrm/schedule?plan=${CUSTOM_PACK_KEY}&static=${staticCount}&motion=${motion}`;

  return (
    <Reveal delay={2} className="tl-panel tl-custom-card flex flex-col p-7 sm:p-8">
      <span className="tl-role-tag">On demand</span>
      <h3 className="mt-2 text-[21px] text-[var(--tl-ink)]">{CUSTOM_PACK_COPY.name}</h3>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--tl-ink-soft)]">
        <strong className="font-medium text-[var(--tl-ink)]">Best for:</strong> {CUSTOM_PACK_COPY.bestFor}
      </p>

      <span className="tl-hline my-6" aria-hidden="true" />

      <div className="tl-pack-total-row">
        <p className="tl-pkg-subhead">Total assets</p>
        <div className="tl-pack-stepper">
          <button
            type="button"
            className="tl-calc-stepper-btn"
            onClick={() => changeTotal(total - 1)}
            disabled={total <= min}
            aria-label="Decrease total assets"
          >
            <Minus size={13} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <span className="tl-pack-total-num">{total}</span>
          <button
            type="button"
            className="tl-calc-stepper-btn"
            onClick={() => changeTotal(total + 1)}
            disabled={total >= max}
            aria-label="Increase total assets"
          >
            <Plus size={13} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="tl-pack-mix mt-5">
        <div className="tl-pack-mix-item">
          <span className="tl-pack-mix-icon" aria-hidden="true">
            <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="tl-pack-mix-label">Static</span>
          <div className="tl-pack-stepper">
            <button
              type="button"
              className="tl-calc-stepper-btn"
              onClick={() => changeMotion(motion + 1)}
              disabled={staticCount <= 0}
              aria-label="Decrease static assets"
            >
              <Minus size={13} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <span className="tl-pack-mix-num">{staticCount}</span>
            <button
              type="button"
              className="tl-calc-stepper-btn"
              onClick={() => changeMotion(motion - 1)}
              disabled={motion <= 0}
              aria-label="Increase static assets"
            >
              <Plus size={13} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="tl-pack-mix-item">
          <span className="tl-pack-mix-icon" aria-hidden="true">
            <Film className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="tl-pack-mix-label">Motion</span>
          <div className="tl-pack-stepper">
            <button
              type="button"
              className="tl-calc-stepper-btn"
              onClick={() => changeMotion(motion - 1)}
              disabled={motion <= 0}
              aria-label="Decrease motion assets"
            >
              <Minus size={13} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <span className="tl-pack-mix-num">{motion}</span>
            <button
              type="button"
              className="tl-calc-stepper-btn"
              onClick={() => changeMotion(motion + 1)}
              disabled={staticCount <= 0}
              aria-label="Increase motion assets"
            >
              <Plus size={13} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-[var(--tl-ink-muted)]">
        Static and motion always add up to your total, {staticCount} + {motion} = {total}.
      </p>

      <span className="tl-hline my-6" aria-hidden="true" />

      <div className="tl-pack-summary">
        <p className="tl-pkg-subhead">Your creative pack</p>
        <p className="tl-pack-summary-total mt-2">
          {total} total assets <span className="tl-ink-muted">&middot;</span> {staticCount} static{" "}
          <span className="tl-ink-muted">&middot;</span> {motion} motion
        </p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {CUSTOM_PACK_COPY.summaryPoints.map((point) => (
            <li key={point} className="tl-pack-summary-point">
              {point}
            </li>
          ))}
        </ul>
        <p className="tl-pkg-price mt-4">
          {pricingApproved && total$ != null ? fmtMoney(total$) : "Custom total, confirmed before production"}
        </p>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-[var(--tl-ink-muted)]">
        One asset = one finished creative concept, for example one F&amp;B promotion, one event graphic, one
        motion campaign, one seasonal offer, one meeting-space campaign, or one package graphic.
      </p>

      <Link href={requestHref} className="tl-btn mt-6">
        Request This Creative Pack
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      </Link>
    </Reveal>
  );
}
