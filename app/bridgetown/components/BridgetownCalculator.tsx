"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  ACTIVATION_TIERS,
  CALC_DISCLAIMER_1,
  CALC_DISCLAIMER_2,
  CALC_DISCLAIMER_3,
  CALC_SCENARIO_LABEL,
  annualGrossMargin,
  fmtMoney,
  fmtPct,
  grossMargin,
  marginPct,
  platformFiles,
  pluralizeProperty,
  totalConcepts,
  type ActivationTier,
  type TierKey,
} from "../bridgetown-economics";

/**
 * Interactive partner-economics calculator for /bridgetown. Architecture
 * cloned from app/tcrm/components/PortfolioCalculator.tsx (same
 * slider + numeric-input + stepper-button + package-tab pattern), with:
 *   - range raised to 1-150 (Bridgetown's own published "150+ hotels
 *     served" scale, used only as an illustrative slider ceiling)
 *   - default participating-property count of 3, not TCRM's 10
 *   - every output relabeled to Bridgetown's partner-facing terms
 *     (property pays / Archer production rate / Bridgetown retains /
 *     Bridgetown gross partner margin) per the brief
 *   - no "TCRM" string anywhere in a label, aria-label, or disclaimer
 *
 * Every figure below is computed live from bridgetown-economics.ts, never
 * hardcoded, so the calculator and the static package cards can never
 * drift apart.
 */

const RANGE_LABELS = [1, 10, 25, 50, 100, 150];

function clampPropertyCount(n: number, max: number) {
  if (Number.isNaN(n)) return 1;
  return Math.min(max, Math.max(1, Math.round(n)));
}

export function BridgetownCalculator({
  maxProperties,
  defaultProperties,
  defaultTierKey,
}: {
  maxProperties: number;
  defaultProperties: number;
  defaultTierKey: TierKey;
}) {
  const [propertyCount, setPropertyCount] = useState(defaultProperties);
  const [inputText, setInputText] = useState(String(defaultProperties));
  const [tierKey, setTierKey] = useState<TierKey>(defaultTierKey);

  const tier = ACTIVATION_TIERS.find((t) => t.key === tierKey) as ActivationTier;

  function commit(n: number) {
    const clamped = clampPropertyCount(n, maxProperties);
    setPropertyCount(clamped);
    setInputText(String(clamped));
  }

  const totalPropertyPays = tier.propertyPays * propertyCount;
  const totalArcherRate = tier.archerRate * propertyCount;
  const totalGrossMargin = grossMargin(tier) * propertyCount;
  const totalAnnualGrossMargin = annualGrossMargin(tier) * propertyCount;
  const margin = marginPct(tier);
  const totalConceptsCount = totalConcepts(tier) * propertyCount;
  const totalFiles = platformFiles(tier) * propertyCount;
  const totalCaptions = tier.captions * propertyCount;

  return (
    <div className="bt-calc">
      <p className="bt-calc-scenario-label">{CALC_SCENARIO_LABEL}</p>

      <div className="bt-calc-count-row">
        <p className="bt-calc-count">
          <span className="bt-calc-count-num">{propertyCount}</span> participating{" "}
          {pluralizeProperty(propertyCount)}
        </p>
      </div>

      <div className="bt-calc-slider-row mt-4">
        <button
          type="button"
          className="bt-calc-stepper-btn"
          onClick={() => commit(propertyCount - 1)}
          disabled={propertyCount <= 1}
          aria-label="Decrease participating property count by one"
        >
          <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className="bt-calc-slider-wrap">
          <input
            type="range"
            min={1}
            max={maxProperties}
            step={1}
            value={propertyCount}
            onChange={(e) => commit(Number(e.target.value))}
            aria-label="Participating property count"
            aria-valuemin={1}
            aria-valuemax={maxProperties}
            aria-valuenow={propertyCount}
            className="bt-calc-slider"
          />
          <div className="bt-calc-slider-labels" aria-hidden="true">
            {RANGE_LABELS.map((v, i) => (
              <span
                key={v}
                className="bt-calc-slider-label"
                style={{
                  left: `${((v - 1) / (maxProperties - 1)) * 100}%`,
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
          className="bt-calc-stepper-btn"
          onClick={() => commit(propertyCount + 1)}
          disabled={propertyCount >= maxProperties}
          aria-label="Increase participating property count by one"
        >
          <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={maxProperties}
          step={1}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value !== "") {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) commit(n);
            }
          }}
          onBlur={() => setInputText(String(propertyCount))}
          aria-label="Participating property count, numeric entry"
          className="bt-calc-num-input"
        />
      </div>

      <div className="bt-calc-tabs mt-7" role="tablist" aria-label="Creative activation package">
        {ACTIVATION_TIERS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tierKey === t.key}
            className={`bt-calc-tab${tierKey === t.key ? " is-active" : ""}`}
            onClick={() => setTierKey(t.key)}
          >
            {t.name}
            {t.badge ? <span className="bt-calc-tab-badge"> &middot; {t.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className="bt-calc-results mt-6">
        <div className="bt-calc-result-card">
          <p className="bt-calc-result-title">
            {tier.name}
            {tier.badge ? <span className="bt-calc-tab-badge"> &middot; {tier.badge}</span> : null}
          </p>
          <div className="bt-calc-result-rows mt-4">
            <div className="bt-calc-result-row">
              <span>Participating properties</span>
              <span>{propertyCount}</span>
            </div>
            <div className="bt-calc-result-row">
              <span>Property pays (monthly)</span>
              <span>{fmtMoney(totalPropertyPays)}</span>
            </div>
            <div className="bt-calc-result-row">
              <span>Archer production rate (monthly)</span>
              <span>{fmtMoney(totalArcherRate)}</span>
            </div>
            <div className="bt-calc-result-row bt-calc-result-row--highlight">
              <span>Bridgetown gross partner margin (monthly)</span>
              <span>{fmtMoney(totalGrossMargin)}</span>
            </div>
            <div className="bt-calc-result-row">
              <span>Illustrative annual gross margin</span>
              <span>{fmtMoney(totalAnnualGrossMargin)}</span>
            </div>
            <div className="bt-calc-result-row">
              <span>Illustrative gross margin</span>
              <span>{fmtPct(margin)}</span>
            </div>
            <div className="bt-calc-result-row">
              <span>Total original creative concepts</span>
              <span>{totalConceptsCount}</span>
            </div>
            <div className="bt-calc-result-row">
              <span>Total platform-ready files</span>
              <span>{totalFiles}</span>
            </div>
            <div className="bt-calc-result-row">
              <span>Total promotional captions</span>
              <span>{totalCaptions}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="bt-calc-disclaimer mt-6">{CALC_DISCLAIMER_1}</p>
      <p className="bt-calc-disclaimer">{CALC_DISCLAIMER_2}</p>
      <p className="bt-calc-disclaimer">{CALC_DISCLAIMER_3}</p>
    </div>
  );
}
