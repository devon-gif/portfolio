"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  ACTIVATION_TIERS,
  CALC_DISCLAIMER_1,
  CALC_DISCLAIMER_2,
  CALC_DISCLAIMER_3,
  CALC_SCENARIO_LABEL,
  MIN_PARTICIPATING_PROPERTIES,
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
} from "../grant-hospitality-economics";

/**
 * Interactive partner-economics calculator for /grant-hospitality.
 * Architecture cloned directly from
 * app/bridgetown/components/BridgetownCalculator.tsx (same slider +
 * numeric-input + stepper-button + package-tab pattern), with:
 *   - range 1-50 (GRANT does not publish a client count, per the brief)
 *   - default participating-property count of 3
 *   - every output relabeled to GRANT's partner-facing terms
 *     (property pays / Archer production rate / GRANT retains / GRANT
 *     gross partner margin)
 *   - no "Bridgetown" or "TCRM" string anywhere in a label, aria-label, or
 *     disclaimer
 *
 * Every figure below is computed live from grant-hospitality-economics.ts,
 * using the exact same formulas as bridgetown-economics.ts, never
 * hardcoded, so the calculator and the static package cards can never
 * drift apart.
 */

const RANGE_LABELS = [1, 10, 25, 50];

function clampPropertyCount(n: number, max: number) {
  if (Number.isNaN(n)) return MIN_PARTICIPATING_PROPERTIES;
  return Math.min(max, Math.max(MIN_PARTICIPATING_PROPERTIES, Math.round(n)));
}

export function GrantHospitalityCalculator({
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
    <div className="gh-calc">
      <p className="gh-calc-scenario-label">{CALC_SCENARIO_LABEL}</p>

      <div className="gh-calc-count-row">
        <p className="gh-calc-count">
          <span className="gh-calc-count-num">{propertyCount}</span> participating{" "}
          {pluralizeProperty(propertyCount)}
        </p>
      </div>

      <div className="gh-calc-slider-row mt-4">
        <button
          type="button"
          className="gh-calc-stepper-btn"
          onClick={() => commit(propertyCount - 1)}
          disabled={propertyCount <= MIN_PARTICIPATING_PROPERTIES}
          aria-label="Decrease participating property count by one"
        >
          <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className="gh-calc-slider-wrap">
          <input
            type="range"
            min={MIN_PARTICIPATING_PROPERTIES}
            max={maxProperties}
            step={1}
            value={propertyCount}
            onChange={(e) => commit(Number(e.target.value))}
            aria-label="Participating property count"
            aria-valuemin={MIN_PARTICIPATING_PROPERTIES}
            aria-valuemax={maxProperties}
            aria-valuenow={propertyCount}
            className="gh-calc-slider"
          />
          <div className="gh-calc-slider-labels" aria-hidden="true">
            {RANGE_LABELS.map((v, i) => (
              <span
                key={v}
                className="gh-calc-slider-label"
                style={{
                  left: `${((v - MIN_PARTICIPATING_PROPERTIES) / (maxProperties - MIN_PARTICIPATING_PROPERTIES)) * 100}%`,
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
          className="gh-calc-stepper-btn"
          onClick={() => commit(propertyCount + 1)}
          disabled={propertyCount >= maxProperties}
          aria-label="Increase participating property count by one"
        >
          <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <input
          type="number"
          inputMode="numeric"
          min={MIN_PARTICIPATING_PROPERTIES}
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
          className="gh-calc-num-input"
        />
      </div>

      <div className="gh-calc-tabs mt-7" role="tablist" aria-label="Creative activation package">
        {ACTIVATION_TIERS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tierKey === t.key}
            className={`gh-calc-tab${tierKey === t.key ? " is-active" : ""}`}
            onClick={() => setTierKey(t.key)}
          >
            {t.name}
            {t.badge ? <span className="gh-calc-tab-badge"> &middot; {t.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className="gh-calc-results mt-6">
        <div className="gh-calc-result-card">
          <p className="gh-calc-result-title">
            {tier.name}
            {tier.badge ? <span className="gh-calc-tab-badge"> &middot; {tier.badge}</span> : null}
          </p>
          <div className="gh-calc-result-rows mt-4">
            <div className="gh-calc-result-row">
              <span>Participating properties</span>
              <span>{propertyCount}</span>
            </div>
            <div className="gh-calc-result-row">
              <span>Hotel pays (monthly)</span>
              <span>{fmtMoney(totalPropertyPays)}</span>
            </div>
            <div className="gh-calc-result-row">
              <span>Archer production rate (monthly)</span>
              <span>{fmtMoney(totalArcherRate)}</span>
            </div>
            <div className="gh-calc-result-row gh-calc-result-row--highlight">
              <span>GRANT gross partner margin (monthly)</span>
              <span>{fmtMoney(totalGrossMargin)}</span>
            </div>
            <div className="gh-calc-result-row">
              <span>Illustrative annual gross margin</span>
              <span>{fmtMoney(totalAnnualGrossMargin)}</span>
            </div>
            <div className="gh-calc-result-row">
              <span>Illustrative gross margin</span>
              <span>{fmtPct(margin)}</span>
            </div>
            <div className="gh-calc-result-row">
              <span>Total original creative concepts</span>
              <span>{totalConceptsCount}</span>
            </div>
            <div className="gh-calc-result-row">
              <span>Total platform-ready files</span>
              <span>{totalFiles}</span>
            </div>
            <div className="gh-calc-result-row">
              <span>Total promotional captions</span>
              <span>{totalCaptions}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="gh-calc-disclaimer mt-6">{CALC_DISCLAIMER_1}</p>
      <p className="gh-calc-disclaimer">{CALC_DISCLAIMER_2}</p>
      <p className="gh-calc-disclaimer">{CALC_DISCLAIMER_3}</p>
    </div>
  );
}
