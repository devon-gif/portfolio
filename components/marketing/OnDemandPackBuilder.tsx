"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ARCHER_PRICING, formatMoney } from "@/app/packages/pricing";

const MIN_ASSETS = 1;
const MAX_ASSETS = 10;
const DEFAULT_TOTAL = 6;
const DEFAULT_MOTION = 2;

export function OnDemandPackBuilder() {
  const [total, setTotal] = useState(DEFAULT_TOTAL);
  const [motion, setMotion] = useState(DEFAULT_MOTION);
  const staticCount = total - motion;

  function changeTotal(next: number) {
    const clamped = Math.min(MAX_ASSETS, Math.max(MIN_ASSETS, next));
    setTotal(clamped);
    setMotion((current) => Math.min(current, clamped));
  }

  function changeMotion(next: number) {
    setMotion(Math.min(total, Math.max(0, next)));
  }

  const price = useMemo(
    () => staticCount * ARCHER_PRICING.static + motion * ARCHER_PRICING.motion,
    [staticCount, motion],
  );

  const requestHref = `/contact?package=on-demand&static=${staticCount}&motion=${motion}`;

  const stepButton =
    "flex h-9 w-9 items-center justify-center rounded-full border border-[var(--st-line)] bg-white text-lg text-[var(--st-ink)] transition hover:border-[var(--st-gold)] disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div className="st-card overflow-hidden border-[var(--st-gold-soft)]">
      <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-[var(--st-line)] bg-[var(--st-ink)] p-7 text-[var(--st-ivory)] lg:border-b-0 lg:border-r lg:p-9">
          <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
            No contract
          </span>
          <h3 className="mt-5 font-serif text-[28px] leading-tight text-white">Build your own creative pack.</h3>
          <p className="mt-4 text-[14.5px] leading-relaxed text-white/70">
            Need only a few pieces right now? Choose the exact mix of static and motion creative you need. One project, one price, no monthly commitment.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Static</p>
              <p className="mt-2 font-serif text-[27px] text-white">{formatMoney(ARCHER_PRICING.static)}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/55">per finished concept</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Motion</p>
              <p className="mt-2 font-serif text-[27px] text-white">{formatMoney(ARCHER_PRICING.motion)}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/55">per finished concept</p>
            </div>
          </div>
        </div>

        <div className="p-7 lg:p-9">
          <div className="flex items-center justify-between gap-6 border-b border-[var(--st-line)] pb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--st-ink-muted)]">Total assets</p>
              <p className="mt-1 text-[13px] text-[var(--st-ink-soft)]">Choose 1–10 pieces for this project.</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className={stepButton} onClick={() => changeTotal(total - 1)} disabled={total <= MIN_ASSETS} aria-label="Decrease total assets">−</button>
              <span className="min-w-8 text-center font-serif text-[28px] text-[var(--st-ink)]">{total}</span>
              <button type="button" className={stepButton} onClick={() => changeTotal(total + 1)} disabled={total >= MAX_ASSETS} aria-label="Increase total assets">+</button>
            </div>
          </div>

          <div className="grid gap-4 py-6 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-cream)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-[19px] text-[var(--st-ink)]">Static</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--st-ink-muted)]">Social, F&B, event, offer, or campaign graphic.</p>
                </div>
                <span className="text-[12px] font-semibold text-[var(--st-gold)]">{formatMoney(ARCHER_PRICING.static)}</span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button type="button" className={stepButton} onClick={() => changeMotion(motion + 1)} disabled={staticCount <= 0} aria-label="Decrease static assets">−</button>
                <span className="min-w-8 text-center text-[18px] font-semibold text-[var(--st-ink)]">{staticCount}</span>
                <button type="button" className={stepButton} onClick={() => changeMotion(motion - 1)} disabled={motion <= 0} aria-label="Increase static assets">+</button>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-cream)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-[19px] text-[var(--st-ink)]">Motion</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--st-ink-muted)]">Short-form animated creative built for social.</p>
                </div>
                <span className="text-[12px] font-semibold text-[var(--st-gold)]">{formatMoney(ARCHER_PRICING.motion)}</span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button type="button" className={stepButton} onClick={() => changeMotion(motion - 1)} disabled={motion <= 0} aria-label="Decrease motion assets">−</button>
                <span className="min-w-8 text-center text-[18px] font-semibold text-[var(--st-ink)]">{motion}</span>
                <button type="button" className={stepButton} onClick={() => changeMotion(motion + 1)} disabled={staticCount <= 0} aria-label="Increase motion assets">+</button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--st-gold-soft)] bg-white p-5 sm:flex sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--st-ink-muted)]">Your pack</p>
              <p className="mt-2 text-[14px] text-[var(--st-ink-soft)]">{staticCount} static · {motion} motion · {total} total assets</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--st-ink-muted)]">Includes one consolidated minor revision round and finished campaign-ready files.</p>
            </div>
            <div className="mt-5 shrink-0 sm:mt-0 sm:text-right">
              <p className="font-serif text-[34px] leading-none text-[var(--st-ink)]">{formatMoney(price)}</p>
              <p className="mt-1 text-[11px] text-[var(--st-ink-muted)]">one-time project</p>
            </div>
          </div>

          <Link href={requestHref} className="st-btn mt-6 w-full justify-center sm:w-auto">
            Request this creative pack <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
