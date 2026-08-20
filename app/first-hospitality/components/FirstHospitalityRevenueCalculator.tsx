"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  FIRST_HOSPITALITY_PACKAGES,
  DEFAULT_PACKAGE_KEY,
  MAX_PARTICIPATING_PROPERTIES,
  DEFAULT_PARTICIPATING_PROPERTIES,
  MONTHLY_MOTION_ASSETS,
  MONTHLY_STATIC_ASSETS,
  fmtMoney,
  type FirstHospitalityPackageKey,
} from "../first-hospitality-pricing";

/**
 * Illustrative portfolio revenue calculator for /first-hospitality, modeled
 * on app/topline/components/PortfolioCalculator.tsx (same slider + stepper +
 * numeric-entry pattern, same package-tabs pattern, same "gross, not net"
 * framing) but built as its own First-Hospitality-scoped component reading
 * from first-hospitality-pricing.ts rather than importing anything from
 * /topline directly -- so nothing here can ever change Topline's behavior,
 * and nothing on /topline depends on this file.
 *
 * Deliberately restrained: no animated counters, no confetti, no "make up
 * to" language, no default set to the full 55-property ceiling, and every
 * retained-margin figure is labeled "partner margin" (gross, before First
 * Hospitality's own administrative/billing/sales/legal/tax costs), never
 * "profit guaranteed". This is meant to read as a business-planning tool,
 * not a promotional earnings pitch.
 */

const RANGE_LABELS = [1, 10, 25, 40, MAX_PARTICIPATING_PROPERTIES];

type View = FirstHospitalityPackageKey | "compare";

const TABS: { key: View; label: string }[] = [
  ...FIRST_HOSPITALITY_PACKAGES.map((p) => ({ key: p.key as View, label: p.name })),
  { key: "compare" as View, label: "Compare both" },
];

function clampCount(n: number, max: number) {
  if (Number.isNaN(n)) return 1;
  return Math.min(max, Math.max(1, Math.round(n)));
}

function ResultCard({ packageKey, propertyCount }: { packageKey: FirstHospitalityPackageKey; propertyCount: number }) {
  const pkg = FIRST_HOSPITALITY_PACKAGES.find((p) => p.key === packageKey)!;
  const ownerFacingVolume = pkg.retail * propertyCount;
  const productionCost = pkg.wholesale * propertyCount;
  const monthlyMargin = ownerFacingVolume - productionCost;
  const annualMargin = monthlyMargin * 12;
  const marginPct = (monthlyMargin / ownerFacingVolume) * 100;
  const totalMotion = MONTHLY_MOTION_ASSETS * propertyCount;
  const totalStatic = MONTHLY_STATIC_ASSETS * propertyCount;

  return (
    <div className="fh-calc-result-card fh-glass">
      <p className="fh-calc-result-title">{pkg.name}</p>
      <div className="fh-calc-result-rows">
        <div className="fh-calc-result-row">
          <span>Owner-facing monthly package volume</span>
          <span>{fmtMoney(ownerFacingVolume)}</span>
        </div>
        <div className="fh-calc-result-row">
          <span>Archer production rate (total)</span>
          <span>{fmtMoney(productionCost)}</span>
        </div>
        <div className="fh-calc-result-row fh-calc-result-row--highlight">
          <span>First Hospitality retains (monthly partner margin)</span>
          <span className="fh-calc-margin-figure">
            {fmtMoney(monthlyMargin)} <span className="fh-calc-margin-pct">({Math.round(marginPct * 10) / 10}%)</span>
          </span>
        </div>
        <div className="fh-calc-result-row">
          <span>First Hospitality retains (annual partner margin)</span>
          <span className="fh-calc-margin-figure">{fmtMoney(annualMargin)}</span>
        </div>
        <div className="fh-calc-result-row fh-calc-result-row--assets">
          <span>Creative output across participating properties</span>
          <span>
            {totalMotion} motion + {totalStatic} static / month
          </span>
        </div>
      </div>
    </div>
  );
}

export function FirstHospitalityRevenueCalculator() {
  const [propertyCount, setPropertyCount] = useState(DEFAULT_PARTICIPATING_PROPERTIES);
  const [inputText, setInputText] = useState(String(DEFAULT_PARTICIPATING_PROPERTIES));
  const [view, setView] = useState<View>((DEFAULT_PACKAGE_KEY as View) ?? "compare");

  function commit(n: number) {
    const clamped = clampCount(n, MAX_PARTICIPATING_PROPERTIES);
    setPropertyCount(clamped);
    setInputText(String(clamped));
  }

  return (
    <div className="fh-calc">
      <span className="fh-calc-scenario-label">Illustrative commercial scenario</span>

      <div className="fh-calc-count-row">
        <p className="fh-calc-count">
          <span className="fh-calc-count-num">{propertyCount}</span> participating{" "}
          {propertyCount === 1 ? "property" : "properties"}
        </p>
      </div>

      <div className="fh-calc-slider-row">
        <button
          type="button"
          className="fh-calc-stepper-btn"
          onClick={() => commit(propertyCount - 1)}
          disabled={propertyCount <= 1}
          aria-label="Decrease participating property count by one"
        >
          <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className="fh-calc-slider-wrap">
          <input
            type="range"
            min={1}
            max={MAX_PARTICIPATING_PROPERTIES}
            step={1}
            value={propertyCount}
            onChange={(e) => commit(Number(e.target.value))}
            aria-label="Participating property count"
            aria-valuemin={1}
            aria-valuemax={MAX_PARTICIPATING_PROPERTIES}
            aria-valuenow={propertyCount}
            className="fh-calc-slider"
          />
          <div className="fh-calc-slider-labels" aria-hidden="true">
            {RANGE_LABELS.map((v, i) => (
              <span
                key={v}
                className="fh-calc-slider-label"
                style={{
                  left: `${((v - 1) / (MAX_PARTICIPATING_PROPERTIES - 1)) * 100}%`,
                  transform:
                    i === 0 ? "translateX(0)" : i === RANGE_LABELS.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="fh-calc-stepper-btn"
          onClick={() => commit(propertyCount + 1)}
          disabled={propertyCount >= MAX_PARTICIPATING_PROPERTIES}
          aria-label="Increase participating property count by one"
        >
          <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_PARTICIPATING_PROPERTIES}
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
          className="fh-calc-num-input"
        />
      </div>

      <div className="fh-calc-tabs" role="tablist" aria-label="Package view">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={view === t.key}
            className={`fh-calc-tab${view === t.key ? " is-active" : ""}`}
            onClick={() => setView(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`fh-calc-results${view === "compare" ? " fh-calc-results--compare" : ""}`}>
        {FIRST_HOSPITALITY_PACKAGES.filter((p) => view === "compare" || view === p.key).map((p) => (
          <ResultCard key={p.key} packageKey={p.key} propertyCount={propertyCount} />
        ))}
      </div>

      <p className="fh-calc-disclaimer">
        This assumes every selected property participates for the full displayed period. It is not a forecast of
        adoption, revenue, retention, or net profit.
      </p>
    </div>
  );
}
