"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

/**
 * Interactive portfolio earnings calculator for /topline, replacing the old
 * static "Portfolio scale example" cards (which only showed three fixed
 * 10-hotel scenarios). Everything here is computed live from the
 * `hotelCount` slider/input and the pricing props passed in from page.tsx
 * (the same CREATIVE_ and MANAGED_ pricing constants that drive the package
 * cards above), so nothing on screen is a hardcoded, pre-baked figure.
 *
 * Explicitly illustrative: nowhere does this imply a committed hotel count,
 * and every profit figure is labeled "gross profit" (retail minus Archer
 * Design wholesale cost), never "net profit".
 */

const RANGE_LABELS = [1, 25, 50, 100, 150, 190];

type PackageView = "creative" | "managed" | "compare";

const TABS: { key: PackageView; label: string }[] = [
  { key: "creative", label: "Creative Activation" },
  { key: "managed", label: "Managed Social" },
  { key: "compare", label: "Compare Both" },
];

function fmtMoney(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function clampHotelCount(n: number, max: number) {
  if (Number.isNaN(n)) return 1;
  return Math.min(max, Math.max(1, Math.round(n)));
}

function ResultCard({
  title,
  accent,
  hotelCount,
  retailPrice,
  wholesaleCost,
}: {
  title: string;
  accent: "topline" | "archer";
  hotelCount: number;
  retailPrice: number;
  wholesaleCost: number;
}) {
  const totalRetail = retailPrice * hotelCount;
  const totalWholesale = wholesaleCost * hotelCount;
  const monthlyGrossProfit = totalRetail - totalWholesale;
  const annualGrossProfit = monthlyGrossProfit * 12;

  return (
    <div className={`tl-calc-result-card tl-calc-result-card--${accent}`}>
      <p className={`tl-role-tag tl-role-tag--${accent}`}>{title}</p>
      <div className="tl-calc-result-rows mt-4">
        <div className="tl-calc-result-row">
          <span>Total client revenue (monthly)</span>
          <span>{fmtMoney(totalRetail)}</span>
        </div>
        <div className="tl-calc-result-row">
          <span>White-label production cost (monthly)</span>
          <span>{fmtMoney(totalWholesale)}</span>
        </div>
        <div className="tl-calc-result-row tl-calc-result-row--highlight">
          <span>Illustrative Topline gross profit (monthly)</span>
          <span>{fmtMoney(monthlyGrossProfit)}</span>
        </div>
        <div className="tl-calc-result-row">
          <span>Illustrative Topline gross profit (annual)</span>
          <span>{fmtMoney(annualGrossProfit)}</span>
        </div>
      </div>
    </div>
  );
}

export function PortfolioCalculator({
  maxHotels,
  defaultHotels,
  creativeRetail,
  creativeWholesale,
  managedRetail,
  managedWholesale,
}: {
  maxHotels: number;
  defaultHotels: number;
  creativeRetail: number;
  creativeWholesale: number;
  managedRetail: number;
  managedWholesale: number;
}) {
  const [hotelCount, setHotelCount] = useState(defaultHotels);
  const [inputText, setInputText] = useState(String(defaultHotels));
  const [view, setView] = useState<PackageView>("compare");

  function commit(n: number) {
    const clamped = clampHotelCount(n, maxHotels);
    setHotelCount(clamped);
    setInputText(String(clamped));
  }

  return (
    <div className="tl-calc">
      <div className="tl-calc-count-row">
        <p className="tl-calc-count">
          <span className="tl-calc-count-num">{hotelCount}</span> participating{" "}
          {hotelCount === 1 ? "hotel" : "hotels"}
        </p>
      </div>

      <div className="tl-calc-slider-row mt-4">
        <button
          type="button"
          className="tl-calc-stepper-btn"
          onClick={() => commit(hotelCount - 1)}
          disabled={hotelCount <= 1}
          aria-label="Decrease participating hotel count by one"
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
            aria-label="Participating hotel count"
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
          aria-label="Increase participating hotel count by one"
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
          aria-label="Participating hotel count, numeric entry"
          className="tl-calc-num-input"
        />
      </div>

      <div className="tl-calc-tabs mt-7" role="tablist" aria-label="Package view">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={view === t.key}
            className={`tl-calc-tab${view === t.key ? " is-active" : ""}`}
            onClick={() => setView(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`tl-calc-results mt-6${view === "compare" ? " tl-calc-results--compare" : ""}`}>
        {(view === "creative" || view === "compare") && (
          <ResultCard
            title="Creative Activation"
            accent="topline"
            hotelCount={hotelCount}
            retailPrice={creativeRetail}
            wholesaleCost={creativeWholesale}
          />
        )}
        {(view === "managed" || view === "compare") && (
          <ResultCard
            title="Managed Social"
            accent="archer"
            hotelCount={hotelCount}
            retailPrice={managedRetail}
            wholesaleCost={managedWholesale}
          />
        )}
      </div>

      <p className="tl-calc-disclaimer mt-6">
        Gross profit shown here is retail price minus Archer Design&rsquo;s wholesale cost before any
        Topline operating expense; it is not a net-profit figure. Illustrative only, does not imply any
        hotel count, participation level, or revenue is committed or guaranteed.
      </p>
    </div>
  );
}
