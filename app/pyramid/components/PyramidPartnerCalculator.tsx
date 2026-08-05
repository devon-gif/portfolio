"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  PYRAMID_PACKAGES,
  DEFAULT_PACKAGE_KEY,
  MAX_PARTICIPATING_PROPERTIES,
  DEFAULT_PARTICIPATING_PROPERTIES,
  MONTHLY_MOTION_ASSETS,
  MONTHLY_STATIC_ASSETS,
  fmtMoney,
  pluralizeProperty,
  CALC_SCENARIO_LABEL,
  CALC_DISCLAIMER_1,
  CALC_DISCLAIMER_2,
  CALC_DISCLAIMER_3,
  type PyramidPackageKey,
} from "../pyramid-economics";

/**
 * Illustrative commercial-scenario calculator for /pyramid, modeled on the
 * approved app/first-hospitality/components/FirstHospitalityRevenueCalculator.tsx
 * (same slider + stepper + numeric-entry pattern, same package-tabs pattern,
 * same "gross, not net" framing) but built as its own Pyramid-scoped
 * component reading from pyramid-economics.ts rather than importing
 * anything from /first-hospitality directly -- so nothing here can ever
 * change First Hospitality's behavior, and nothing on /first-hospitality
 * depends on this file.
 *
 * Deliberately avoids the low-contrast dark-on-dark tab issue seen on the
 * First Hospitality reference: this component's own CSS (pyramid.css) uses
 * fixed, explicit colors for every state rather than a media-query-driven
 * background swap, so inactive tab labels stay readable in every
 * environment.
 */

const RANGE_LABELS = [1, 25, 55, 100, 150, MAX_PARTICIPATING_PROPERTIES];

type View = PyramidPackageKey | "compare";

const TABS: { key: View; label: string }[] = [
  ...PYRAMID_PACKAGES.map((p) => ({ key: p.key as View, label: p.name })),
  { key: "compare" as View, label: "Compare both" },
];

function clampCount(n: number, max: number) {
  if (Number.isNaN(n)) return 1;
  return Math.min(max, Math.max(1, Math.round(n)));
}

function ResultCard({ packageKey, propertyCount }: { packageKey: PyramidPackageKey; propertyCount: number }) {
  const pkg = PYRAMID_PACKAGES.find((p) => p.key === packageKey)!;
  const ownerFacingVolume = pkg.ownerPays * propertyCount;
  const archerRateTotal = pkg.archerRate * propertyCount;
  const monthlyMargin = ownerFacingVolume - archerRateTotal;
  const annualMarginTotal = monthlyMargin * 12;
  const marginPctValue = (monthlyMargin / ownerFacingVolume) * 100;
  const totalMotion = MONTHLY_MOTION_ASSETS * propertyCount;
  const totalStatic = MONTHLY_STATIC_ASSETS * propertyCount;
  const isManaged = packageKey === "managed";

  return (
    <div className="pyr-calc-result-card">
      <p className="pyr-calc-result-title pyr-serif">{pkg.name}</p>
      <div className="pyr-calc-result-rows">
        <div className="pyr-calc-result-row">
          <span>Owner-facing monthly package volume</span>
          <span>{fmtMoney(ownerFacingVolume)}</span>
        </div>
        <div className="pyr-calc-result-row">
          <span>Archer production rate (total)</span>
          <span>{fmtMoney(archerRateTotal)}</span>
        </div>
        <div className="pyr-calc-result-row pyr-calc-result-row--highlight">
          <span>Pyramid retains (monthly gross margin)</span>
          <span className="pyr-calc-margin-figure">
            {fmtMoney(monthlyMargin)} <span className="pyr-calc-margin-pct">({Math.round(marginPctValue * 10) / 10}%)</span>
          </span>
        </div>
        <div className="pyr-calc-result-row">
          <span>Pyramid retains (annual gross margin)</span>
          <span className="pyr-calc-margin-figure">{fmtMoney(annualMarginTotal)}</span>
        </div>
        <div className="pyr-calc-result-row pyr-calc-result-row--assets">
          <span>Monthly creative output</span>
          <span>
            {totalMotion} motion + {totalStatic} static / month
          </span>
        </div>
        {isManaged && (
          <>
            <div className="pyr-calc-result-row">
              <span>Monthly content calendars</span>
              <span>{propertyCount}</span>
            </div>
            <div className="pyr-calc-result-row">
              <span>Properties receiving scheduling support</span>
              <span>{propertyCount}</span>
            </div>
            <div className="pyr-calc-result-row">
              <span>Monthly performance snapshots</span>
              <span>{propertyCount}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function PyramidPartnerCalculator() {
  const [propertyCount, setPropertyCount] = useState(DEFAULT_PARTICIPATING_PROPERTIES);
  const [inputText, setInputText] = useState(String(DEFAULT_PARTICIPATING_PROPERTIES));
  const [view, setView] = useState<View>((DEFAULT_PACKAGE_KEY as View) ?? "compare");

  function commit(n: number) {
    const clamped = clampCount(n, MAX_PARTICIPATING_PROPERTIES);
    setPropertyCount(clamped);
    setInputText(String(clamped));
  }

  return (
    <div className="pyr-calc">
      <span className="pyr-calc-scenario-label">{CALC_SCENARIO_LABEL}</span>

      <div className="pyr-calc-count-row">
        <p className="pyr-calc-count">
          <span className="pyr-calc-count-num pyr-serif">{propertyCount}</span> participating {pluralizeProperty(propertyCount)}
        </p>
      </div>

      <div className="pyr-calc-slider-row">
        <button
          type="button"
          className="pyr-calc-stepper-btn"
          onClick={() => commit(propertyCount - 1)}
          disabled={propertyCount <= 1}
          aria-label="Decrease participating property count by one"
        >
          <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className="pyr-calc-slider-wrap">
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
            className="pyr-calc-slider"
          />
          <div className="pyr-calc-slider-labels" aria-hidden="true">
            {RANGE_LABELS.map((v, i) => (
              <span
                key={v}
                className="pyr-calc-slider-label"
                style={{
                  left: `${((v - 1) / (MAX_PARTICIPATING_PROPERTIES - 1)) * 100}%`,
                  transform: i === 0 ? "translateX(0)" : i === RANGE_LABELS.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="pyr-calc-stepper-btn"
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
          className="pyr-calc-num-input"
        />
      </div>

      <div className="pyr-calc-tabs" role="tablist" aria-label="Package view">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={view === t.key}
            className={`pyr-calc-tab${view === t.key ? " is-active" : ""}`}
            onClick={() => setView(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`pyr-calc-results${view === "compare" ? " pyr-calc-results--compare" : ""}`}>
        {PYRAMID_PACKAGES.filter((p) => view === "compare" || view === p.key).map((p) => (
          <ResultCard key={p.key} packageKey={p.key} propertyCount={propertyCount} />
        ))}
      </div>

      <p className="pyr-calc-disclaimer">{CALC_DISCLAIMER_1}</p>
      <p className="pyr-calc-disclaimer">{CALC_DISCLAIMER_2}</p>
      <p className="pyr-calc-disclaimer">{CALC_DISCLAIMER_3}</p>
    </div>
  );
}
