"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

type TierKey = "essential" | "growth" | "full";

const TIERS = [
  {
    key: "essential" as const,
    name: "Essential",
    retail: 895,
    wholesale: 625,
  },
  {
    key: "growth" as const,
    name: "Growth",
    retail: 1095,
    wholesale: 750,
    badge: "Suggested starting point",
  },
  {
    key: "full" as const,
    name: "Full",
    retail: 1395,
    wholesale: 950,
  },
];

const MAX_HOTELS = 50;
const RANGE_LABELS = [1, 5, 10, 25, 50];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function percent(value: number) {
  return `${Math.round(value * 10) / 10}%`;
}

function clamp(value: number) {
  if (Number.isNaN(value)) return 1;
  return Math.min(MAX_HOTELS, Math.max(1, Math.round(value)));
}

export function HawkinsProfitCalculator() {
  const [hotelCount, setHotelCount] = useState(3);
  const [inputText, setInputText] = useState("3");
  const [tierKey, setTierKey] = useState<TierKey>("growth");

  const tier = TIERS.find((item) => item.key === tierKey)!;

  function commit(value: number) {
    const next = clamp(value);
    setHotelCount(next);
    setInputText(String(next));
  }

  const perHotelProfit = tier.retail - tier.wholesale;
  const monthlyRevenue = tier.retail * hotelCount;
  const monthlyWholesale = tier.wholesale * hotelCount;
  const monthlyProfit = perHotelProfit * hotelCount;
  const annualProfit = monthlyProfit * 12;
  const margin = (perHotelProfit / tier.retail) * 100;

  return (
    <div className="tl-calc">
      <div className="tl-calc-count-row">
        <p className="tl-calc-count">
          <span className="tl-calc-count-num">{hotelCount}</span>{" "}
          participating {hotelCount === 1 ? "hotel" : "hotels"}
        </p>
      </div>

      <div className="tl-calc-slider-row mt-4">
        <button
          type="button"
          className="tl-calc-stepper-btn"
          onClick={() => commit(hotelCount - 1)}
          disabled={hotelCount <= 1}
          aria-label="Decrease hotel count"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>

        <div className="tl-calc-slider-wrap">
          <input
            type="range"
            min={1}
            max={MAX_HOTELS}
            step={1}
            value={hotelCount}
            onChange={(event) => commit(Number(event.target.value))}
            className="tl-calc-slider"
            aria-label="Participating Hawkins hotel count"
          />

          <div className="tl-calc-slider-labels" aria-hidden="true">
            {RANGE_LABELS.map((value, index) => (
              <span
                key={value}
                className="tl-calc-slider-label"
                style={{
                  left: `${((value - 1) / (MAX_HOTELS - 1)) * 100}%`,
                  transform:
                    index === 0
                      ? "translateX(0)"
                      : index === RANGE_LABELS.length - 1
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                }}
              >
                {value}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="tl-calc-stepper-btn"
          onClick={() => commit(hotelCount + 1)}
          disabled={hotelCount >= MAX_HOTELS}
          aria-label="Increase hotel count"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>

        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_HOTELS}
          value={inputText}
          onChange={(event) => {
            setInputText(event.target.value);

            if (event.target.value !== "") {
              const value = Number(event.target.value);
              if (!Number.isNaN(value)) commit(value);
            }
          }}
          onBlur={() => setInputText(String(hotelCount))}
          className="tl-calc-num-input"
          aria-label="Participating hotel count"
        />
      </div>

      <div
        className="tl-calc-tabs mt-7"
        role="tablist"
        aria-label="Creative program"
      >
        {TIERS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tierKey === item.key}
            className={`tl-calc-tab${tierKey === item.key ? " is-active" : ""}`}
            onClick={() => setTierKey(item.key)}
          >
            {item.name}
            {item.badge ? (
              <span className="tl-calc-tab-badge">
                {" "}· {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="tl-calc-results mt-6">
        <div className="tl-calc-result-card">
          <p className="tl-role-tag tl-role-tag--tcrm">
            {tier.name} program
          </p>

          <div className="tl-calc-result-rows mt-4">
            <div className="tl-calc-result-row">
              <span>Participating hotels</span>
              <span>{hotelCount}</span>
            </div>

            <div className="tl-calc-result-row">
              <span>Hotel-facing program revenue / month</span>
              <span>{money(monthlyRevenue)}</span>
            </div>

            <div className="tl-calc-result-row">
              <span>Archer wholesale production / month</span>
              <span>{money(monthlyWholesale)}</span>
            </div>

            <div className="tl-calc-result-row">
              <span>Hawkins gross profit per hotel</span>
              <span>{money(perHotelProfit)}</span>
            </div>

            <div className="tl-calc-result-row tl-calc-result-row--highlight">
              <span>Illustrative Hawkins gross profit / month</span>
              <span>{money(monthlyProfit)}</span>
            </div>

            <div className="tl-calc-result-row">
              <span>Illustrative Hawkins gross profit / year</span>
              <span>{money(annualProfit)}</span>
            </div>

            <div className="tl-calc-result-row">
              <span>Illustrative gross margin</span>
              <span>{percent(margin)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="tl-calc-disclaimer mt-6">
        Gross profit is calculated as the illustrative hotel-facing program
        price less Archer Design&apos;s proposed wholesale production cost,
        before any Hawkins operating expenses. It is not net profit. Hawkins
        publicly reports 50+ hotels under management; 50 is used only as a
        conservative visualization ceiling and does not imply participation,
        committed revenue, or an agreed commercial arrangement.
      </p>
    </div>
  );
}
