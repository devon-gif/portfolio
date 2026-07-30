"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  ACTIVATION_TIERS,
  fmtMoney,
  fmtPct,
  grossProfit,
  marginPct,
  platformFiles,
  totalConcepts,
  type ActivationTier,
  type TierKey,
} from "../tcrm-pricing";

/**
 * Interactive portfolio earnings calculator for /tcrm. The user picks one
 * of the three Revenue Priority Creative Activation tiers and a property
 * count (1 to maxHotels); every output below is computed live from that
 * selection and the tier data in tcrm-pricing.ts, so nothing on screen is a
 * hardcoded, pre-baked figure.
 *
 * Explicitly illustrative: nowhere does this imply a committed hotel count,
 * and every profit figure is labeled "gross profit" (retail minus Archer
 * Design wholesale cost), never "net profit".
 */

const RANGE_LABELS = [1, 5, 10, 25, 50, 70];

function clampHotelCount(n: number, max: number) {
  if (Number.isNaN(n)) return 1;
  return Math.min(max, Math.max(1, Math.round(n)));
}

export function PortfolioCalculator({
  maxHotels,
  defaultHotels,
  defaultTierKey,
}: {
  maxHotels: number;
  defaultHotels: number;
  defaultTierKey: TierKey;
}) {
  const [hotelCount, setHotelCount] = useState(defaultHotels);
  const [inputText, setInputText] = useState(String(defaultHotels));
  const [tierKey, setTierKey] = useState<TierKey>(defaultTierKey);

  const tier = ACTIVATION_TIERS.find((t) => t.key === tierKey) as ActivationTier;

  function commit(n: number) {
    const clamped = clampHotelCount(n, maxHotels);
    setHotelCount(clamped);
    setInputText(String(clamped));
  }

  const totalRetail = tier.retail * hotelCount;
  const totalWholesale = tier.wholesale * hotelCount;
  const totalGrossProfit = grossProfit(tier) * hotelCount;
  const margin = marginPct(tier);
  const totalConceptsCount = totalConcepts(tier) * hotelCount;
  const totalFiles = platformFiles(tier) * hotelCount;
  const totalCaptions = tier.captions * hotelCount;

  return (
    <div className="tl-calc">
      <div className="tl-calc-count-row">
        <p className="tl-calc-count">
          <span className="tl-calc-count-num">{hotelCount}</span> participating{" "}
          {hotelCount === 1 ? "property" : "properties"}
        </p>
      </div>

      <div className="tl-calc-slider-row mt-4">
        <button
          type="button"
          className="tl-calc-stepper-btn"
          onClick={() => commit(hotelCount - 1)}
          disabled={hotelCount <= 1}
          aria-label="Decrease participating property count by one"
        >
          <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className="tl-calc-slider-wrap">
          <input
            type="range"
            min={1}
            max={maxHotels}
            step={1}
            value={hotelCount}
            onChange={(e) => commit(Number(e.target.value))}
            aria-label="Participating property count"
            aria-valuemin={1}
            aria-valuemax={maxHotels}
            aria-valuenow={hotelCount}
            className="tl-calc-slider"
          />
          <div className="tl-calc-slider-labels" aria-hidden="true">
            {RANGE_LABELS.map((v, i) => (
              <span
                key={v}
                className="tl-calc-slider-label"
                style={{
                  left: `${((v - 1) / (maxHotels - 1)) * 100}%`,
                  transform:
                    i === 0
                      ? "translateX(0)"
                      : i === RANGE_LABELS.length - 1
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="tl-calc-stepper-btn"
          onClick={() => commit(hotelCount + 1)}
          disabled={hotelCount >= maxHotels}
          aria-label="Increase participating property count by one"
        >
          <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={maxHotels}
          step={1}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value !== "") {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) commit(n);
            }
          }}
          onBlur={() => setInputText(String(hotelCount))}
          aria-label="Participating property count, numeric entry"
          className="tl-calc-num-input"
        />
      </div>

      <div className="tl-calc-tabs mt-7" role="tablist" aria-label="Activation level">
        {ACTIVATION_TIERS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tierKey === t.key}
            className={`tl-calc-tab${tierKey === t.key ? " is-active" : ""}`}
            onClick={() => setTierKey(t.key)}
          >
            {t.name}
            {t.badge ? <span className="tl-calc-tab-badge"> &middot; {t.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className="tl-calc-results mt-6">
        <div className="tl-calc-result-card">
          <p className="tl-role-tag">
            {tier.name}
            {tier.badge ? <span className="tl-calc-tab-badge"> &middot; {tier.badge}</span> : null}
          </p>
          <div className="tl-calc-result-rows mt-4">
            <div className="tl-calc-result-row">
              <span>Participating properties</span>
              <span>{hotelCount}</span>
            </div>
            <div className="tl-calc-result-row">
              <span>Suggested hotel-facing revenue (monthly)</span>
              <span>{fmtMoney(totalRetail)}</span>
            </div>
            <div className="tl-calc-result-row">
              <span>Archer Design wholesale cost (monthly)</span>
              <span>{fmtMoney(totalWholesale)}</span>
            </div>
            <div className="tl-calc-result-row tl-calc-result-row--highlight">
              <span>Illustrative TCRM gross profit (monthly)</span>
              <span>{fmtMoney(totalGrossProfit)}</span>
            </div>
            <div className="tl-calc-result-row">
              <span>Illustrative gross margin</span>
              <span>{fmtPct(margin)}</span>
            </div>
            <div className="tl-calc-result-row">
              <span>Total original creative concepts</span>
              <span>{totalConceptsCount}</span>
            </div>
            <div className="tl-calc-result-row">
              <span>Total platform-ready files</span>
              <span>{totalFiles}</span>
            </div>
            <div className="tl-calc-result-row">
              <span>Total promotional captions</span>
              <span>{totalCaptions}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="tl-calc-disclaimer mt-6">
        Gross profit shown here is retail price minus Archer Design&rsquo;s wholesale cost before any
        TCRM operating expense; it is not a net-profit figure. Illustrative only, does not imply any
        hotel count, participation level, or revenue is committed or guaranteed.
      </p>
    </div>
  );
}
