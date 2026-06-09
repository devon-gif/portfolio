"use client";

import { useMemo, useState } from "react";
import { GOLD_GRADIENT } from "./media";

type PackageOption = {
  label: string;
  monthly: number;
};

const PACKAGE_OPTIONS: PackageOption[] = [
  { label: "Hotel Creative System, $1,999/month", monthly: 1999 },
  { label: "Hotel Creative + SEO, $3,999/month", monthly: 3999 },
  { label: "Spa & Wellness Creative, $499/month", monthly: 499 },
  { label: "Spa Social + SEO, $999/month", monthly: 999 },
  { label: "Restaurant Social Starter, $399/month", monthly: 399 },
  { label: "Restaurant Social + SEO, $699/month", monthly: 699 },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function RetainerValueSection() {
  const [salary, setSalary] = useState(75000);
  const [overheadPercent, setOverheadPercent] = useState(30);
  const [selectedPackage, setSelectedPackage] = useState(PACKAGE_OPTIONS[0].label);

  const selected = useMemo(
    () => PACKAGE_OPTIONS.find((option) => option.label === selectedPackage) ?? PACKAGE_OPTIONS[0],
    [selectedPackage]
  );

  const { loadedMonthly, archerMonthly, monthlySavings, annualSavings } = useMemo(() => {
    const normalizedSalary = Number.isFinite(salary) ? Math.max(0, salary) : 0;
    const normalizedOverhead = Number.isFinite(overheadPercent) ? Math.max(0, overheadPercent) : 0;

    const calcLoadedAnnual = normalizedSalary * (1 + normalizedOverhead / 100);
    const calcLoadedMonthly = calcLoadedAnnual / 12;
    const calcArcherMonthly = selected.monthly;
    const calcMonthlySavings = calcLoadedMonthly - calcArcherMonthly;
    const calcAnnualSavings = calcMonthlySavings * 12;

    return {
      loadedMonthly: calcLoadedMonthly,
      archerMonthly: calcArcherMonthly,
      monthlySavings: calcMonthlySavings,
      annualSavings: calcAnnualSavings,
    };
  }, [salary, overheadPercent, selected.monthly]);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: headline + context */}
          <div className="lg:col-span-6">
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Retainer value
            </span>
            <h2 className="mt-4 max-w-2xl font-serif text-[clamp(28px,4.4vw,50px)] font-semibold leading-[1.0] text-[#F6F1E7]">
              One in-house creative hire costs $90K–$180K a year, fully loaded.{" "}
              <span className="text-[#C9A44C]">Here&apos;s the leaner option.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#A9A092]">
              Salary, insurance, payroll taxes, software, recruiting, management time, and the risk
              of starting over if they leave. Archer Design gives your properties consistent creative
              output for a fraction of one loaded salary, with no employee overhead and no long-term
              commitment.
            </p>
          </div>

          {/* Right: calculator */}
          <div className="relative lg:col-span-6">
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[30px] blur-[42px]"
              style={{
                background:
                  "radial-gradient(circle at 50% 20%, rgba(201,164,76,0.52), rgba(201,164,76,0.2) 36%, transparent 72%)",
              }}
              aria-hidden="true"
            />
            <div className="glass-card-strong rounded-[28px] border-[rgba(201,164,76,0.34)] p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-2xl text-[#F6F1E7]">
                  Estimate what you&apos;d avoid by not making the hire.
                </h3>
                <span className="rounded-full border border-[rgba(201,164,76,0.32)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E8D7A2] shrink-0">
                  Planning tool
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="text-[13px] text-[#A9A092]">
                  In-house salary estimate
                  <input
                    type="number"
                    inputMode="numeric"
                    value={salary}
                    onChange={(event) => setSalary(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.4)] px-4 py-3 text-[15px] text-[#F6F1E7] outline-none transition focus:border-[#C9A44C]"
                  />
                </label>

                <label className="text-[13px] text-[#A9A092]">
                  Overhead percentage
                  <input
                    type="number"
                    inputMode="numeric"
                    value={overheadPercent}
                    onChange={(event) => setOverheadPercent(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.4)] px-4 py-3 text-[15px] text-[#F6F1E7] outline-none transition focus:border-[#C9A44C]"
                  />
                </label>

                <label className="text-[13px] text-[#A9A092]">
                  Archer Design package
                  <select
                    value={selectedPackage}
                    onChange={(event) => setSelectedPackage(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.45)] px-4 py-3 text-[15px] text-[#F6F1E7] outline-none transition focus:border-[#C9A44C]"
                  >
                    {PACKAGE_OPTIONS.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[rgba(169,160,146,0.2)] bg-[rgba(5,5,5,0.35)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#A9A092]">
                    Estimated loaded in-house monthly cost
                  </p>
                  <p className="mt-2 font-serif text-3xl leading-none text-[#F6F1E7]">
                    {currency.format(loadedMonthly)}
                  </p>
                </div>
                <div className="rounded-xl border border-[rgba(169,160,146,0.2)] bg-[rgba(5,5,5,0.35)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#A9A092]">
                    Archer Design monthly package
                  </p>
                  <p className="mt-2 font-serif text-3xl leading-none text-[#E8D7A2]">
                    {currency.format(archerMonthly)}
                  </p>
                </div>
                <div className="rounded-xl border border-[rgba(201,164,76,0.35)] bg-[rgba(201,164,76,0.08)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#E8D7A2]">
                    Estimated monthly overhead avoided
                  </p>
                  <p className="mt-2 font-serif text-3xl leading-none text-[#F6F1E7]">
                    {currency.format(monthlySavings)}
                  </p>
                </div>
                <div className="rounded-xl border border-[rgba(201,164,76,0.35)] bg-[rgba(201,164,76,0.08)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#E8D7A2]">
                    Estimated annual overhead avoided
                  </p>
                  <p className="mt-2 font-serif text-3xl leading-none text-[#C9A44C]">
                    {currency.format(annualSavings)}
                  </p>
                </div>
              </div>

              {monthlySavings < 0 && (
                <p className="mt-4 rounded-xl border border-[rgba(201,164,76,0.2)] bg-[rgba(201,164,76,0.08)] px-4 py-3 text-[13px] leading-relaxed text-[#E8D7A2]">
                  This package may be above your current in-house estimate, but it can still provide
                  flexible support across design, motion, social, and SEO depending on scope.
                </p>
              )}

              <p className="mt-4 text-[12px] leading-relaxed text-[#A9A092]">
                Estimates are for planning only. Actual internal costs vary by role, market,
                benefits, insurance, software, recruiting, and management structure.
              </p>
            </div>
          </div>
        </div>

        {/* Under-calculator CTA */}
        <div className="mt-8 rounded-2xl border border-[rgba(201,164,76,0.3)] bg-[rgba(5,5,5,0.48)] p-8 text-center shadow-[0_0_60px_rgba(201,164,76,0.12)]">
          <h3 className="font-serif text-2xl text-[#F6F1E7]">
            Want to see the quality before any monthly commitment?
          </h3>
          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
            style={{ background: GOLD_GRADIENT }}
          >
            Get 5 Free Sample Assets <span aria-hidden>→</span>
          </a>
          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-[#A9A092]">
            Send existing photos, menus, or event details. You&apos;ll have 5 finished pieces in 7
            days, free.
          </p>
        </div>
      </div>
    </section>
  );
}
