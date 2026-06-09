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
  { label: "Spa Social Starter, $499/month", monthly: 499 },
  { label: "Spa Social + SEO, $999/month", monthly: 999 },
  { label: "Restaurant Social Starter, $399/month", monthly: 399 },
  { label: "Restaurant Social + SEO, $699/month", monthly: 699 },
];

const IN_HOUSE_COSTS = [
  "Salary",
  "Health insurance",
  "Benefits",
  "Payroll taxes",
  "Workers comp",
  "PTO / sick time",
  "Recruiting",
  "Onboarding",
  "Software",
  "Management time",
];

const ARCHER_OUTPUTS = [
  "Social graphics",
  "Short-form motion",
  "Event promos",
  "Restaurant/bar campaigns",
  "Spa/wellness creative",
  "Seasonal campaigns",
  "Local campaign visuals",
  "Optional SEO support",
  "Flexible monthly support",
  "No employee overhead",
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyPrecise = new Intl.NumberFormat("en-US", {
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
          <div className="lg:col-span-6">
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">RETAINER VALUE</span>
            <h2 className="mt-4 max-w-2xl font-serif text-[clamp(34px,5vw,56px)] font-semibold leading-[0.94] text-[#F6F1E7]">
              Premium creative without hiring in-house.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] font-semibold leading-relaxed text-[#E8D7A2]">
              No salary. No insurance. No payroll taxes. No recruiting. Just consistent hospitality creative support.
            </p>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-[#A9A092]">
              Hiring in-house means salary, benefits, insurance, payroll taxes, recruiting, onboarding, software,
              management time, and the risk of replacing someone if they leave. Archer Design gives hospitality teams
              a lean creative layer for social graphics, short-form motion, event promos, restaurant campaigns,
              spa/wellness content, seasonal visuals, and optional SEO support without adding another full-time role.
            </p>
          </div>

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
                <h3 className="font-serif text-2xl text-[#F6F1E7]">Estimate your overhead avoided.</h3>
                <span className="rounded-full border border-[rgba(201,164,76,0.32)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E8D7A2]">
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
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#A9A092]">Estimated loaded in-house monthly cost</p>
                  <p className="mt-2 font-serif text-3xl leading-none text-[#F6F1E7]">{currencyPrecise.format(loadedMonthly)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(169,160,146,0.2)] bg-[rgba(5,5,5,0.35)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#A9A092]">Archer Design monthly package</p>
                  <p className="mt-2 font-serif text-3xl leading-none text-[#E8D7A2]">{currencyPrecise.format(archerMonthly)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(201,164,76,0.35)] bg-[rgba(201,164,76,0.08)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#E8D7A2]">Estimated monthly overhead avoided</p>
                  <p className="mt-2 font-serif text-3xl leading-none text-[#F6F1E7]">{currencyPrecise.format(monthlySavings)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(201,164,76,0.35)] bg-[rgba(201,164,76,0.08)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#E8D7A2]">Estimated annual overhead avoided</p>
                  <p className="mt-2 font-serif text-3xl leading-none text-[#C9A44C]">{currencyPrecise.format(annualSavings)}</p>
                </div>
              </div>

              {monthlySavings < 0 && (
                <p className="mt-4 rounded-xl border border-[rgba(201,164,76,0.2)] bg-[rgba(201,164,76,0.08)] px-4 py-3 text-[13px] leading-relaxed text-[#E8D7A2]">
                  This package may be above your current in-house estimate, but it can still provide flexible support
                  across design, motion, social, and SEO depending on scope.
                </p>
              )}

              <p className="mt-4 text-[12px] leading-relaxed text-[#A9A092]">
                Estimates are for planning only. Actual internal costs vary by role, market, benefits, insurance,
                software, recruiting, and management structure.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="glass-card-strong rounded-2xl p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A9A092]">IN-HOUSE CREATIVE HIRE</p>
            <p className="mt-2 font-serif text-[clamp(32px,4.5vw,48px)] leading-none text-[#F6F1E7]">$90K-$180K+/year</p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#A9A092]">
              Estimated loaded annual cost for one full-time creative, social, or digital marketing hire after salary,
              insurance, benefits, payroll taxes, software, recruiting, and management overhead.
            </p>
          </article>
          <article className="glass-card-strong rounded-2xl border-[rgba(201,164,76,0.42)] p-6 shadow-[0_0_52px_rgba(201,164,76,0.18)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8D7A2]">ARCHER DESIGN</p>
            <p className="mt-2 font-serif text-[clamp(32px,4.5vw,48px)] leading-none text-[#C9A44C]">Starting at $1,999/month</p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#D8CFBE]">
              Monthly hospitality creative support for hotels, restaurants, spas, events, social graphics,
              short-form motion, seasonal campaigns, and optional SEO.
            </p>
          </article>
          <article className="glass-card-strong rounded-2xl p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A9A092]">POTENTIAL OVERHEAD AVOIDED</p>
            <p className="mt-2 font-serif text-[clamp(32px,4.5vw,48px)] leading-none text-[#F6F1E7]">$60K-$150K+/year</p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#A9A092]">
              A leaner way to get consistent creative output without adding another full-time employee to payroll.
            </p>
          </article>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-serif text-xl text-[#F6F1E7]">With an in-house hire, you may pay for:</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-[14px] text-[#A9A092] sm:grid-cols-2">
              {IN_HOUSE_COSTS.map((item) => (
                <li key={item} className="relative pl-5">
                  <span className="absolute left-0 text-[#A9A092]">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-2xl border-[rgba(201,164,76,0.3)] p-6">
            <h3 className="font-serif text-xl text-[#F6F1E7]">With Archer Design, you get:</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-[14px] text-[#D8CFBE] sm:grid-cols-2">
              {ARCHER_OUTPUTS.map((item) => (
                <li key={item} className="relative pl-5">
                  <span className="absolute left-0 text-[#C9A44C]">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[rgba(201,164,76,0.3)] bg-[rgba(5,5,5,0.48)] p-6 text-center shadow-[0_0_60px_rgba(201,164,76,0.12)]">
          <h3 className="font-serif text-2xl text-[#F6F1E7]">Want to see what this looks like before committing?</h3>
          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407]"
            style={{ background: GOLD_GRADIENT }}
          >
            Request a 7-Day Trial <span aria-hidden>→</span>
          </a>
          <p className="mx-auto mt-4 max-w-3xl text-[13px] leading-relaxed text-[#A9A092]">
            Send existing photos, menus, event details, spa services, or campaign notes. We will create 5 sample
            assets so you can see the quality before adding any monthly support.
          </p>
          <p className="mt-4 text-[12px] text-[#A9A092]">
            Default planning example: {currency.format(75000)} salary with 30% overhead = {currency.format(8125)}
            loaded monthly. Hotel Creative System ({currency.format(1999)}/month) can indicate an estimated
            {" "}{currency.format(6126)} monthly and {currency.format(73512)} annual overhead difference.
          </p>
        </div>
      </div>
    </section>
  );
}
