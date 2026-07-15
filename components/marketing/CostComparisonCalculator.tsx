"use client";

import { useMemo, useState } from "react";

// Illustrative, fully-editable in-house-vs-Archer cost model. Every figure a
// visitor sees is derived from the assumptions below, which the visitor can
// change. No number on this component is presented as a guarantee, and the
// caption at the bottom of the card is always visible (never a tooltip).

type CostComparisonAssumptions = {
  annualSalary: number;
  employerPayrollRate: number;
  benefitsRate: number;
  softwareAndEquipmentAnnual: number;
  recruitingAndOnboardingAnnualized: number;
  additionalFreelancerMonthly: number;
  internalManagementHoursMonthly: number;
  internalManagerHourlyCost: number;
  archerMonthlyRate: number;
};

const DEFAULT_ASSUMPTIONS: CostComparisonAssumptions = {
  annualSalary: 65000,
  employerPayrollRate: 0.0865,
  benefitsRate: 0.22,
  softwareAndEquipmentAnnual: 3000,
  recruitingAndOnboardingAnnualized: 2500,
  additionalFreelancerMonthly: 800,
  internalManagementHoursMonthly: 6,
  internalManagerHourlyCost: 45,
  archerMonthlyRate: 1700,
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type NumberField = {
  key: keyof CostComparisonAssumptions;
  label: string;
  helper: string;
  step: number;
  min: number;
  isPercent?: boolean;
};

const FIELDS: NumberField[] = [
  {
    key: "annualSalary",
    label: "In-house salary estimate",
    helper: "Base annual salary for a full-time designer or content specialist",
    step: 1000,
    min: 0,
  },
  {
    key: "employerPayrollRate",
    label: "Employer payroll cost rate",
    helper: "Employer-side payroll taxes as a percent of salary",
    step: 0.5,
    min: 0,
    isPercent: true,
  },
  {
    key: "benefitsRate",
    label: "Benefits and PTO rate",
    helper: "Health insurance, paid time off, and retirement, as a percent of salary",
    step: 0.5,
    min: 0,
    isPercent: true,
  },
  {
    key: "softwareAndEquipmentAnnual",
    label: "Software and equipment",
    helper: "Annual creative software, licenses, and hardware",
    step: 250,
    min: 0,
  },
  {
    key: "recruitingAndOnboardingAnnualized",
    label: "Recruiting and onboarding",
    helper: "Annualized cost of hiring and ramp-up time",
    step: 250,
    min: 0,
  },
  {
    key: "additionalFreelancerMonthly",
    label: "Additional freelance support",
    helper: "Separate monthly video editor, social, or reporting help",
    step: 50,
    min: 0,
  },
  {
    key: "internalManagementHoursMonthly",
    label: "Internal management hours",
    helper: "Hours per month spent managing this work internally",
    step: 1,
    min: 0,
  },
  {
    key: "internalManagerHourlyCost",
    label: "Internal manager hourly cost",
    helper: "Loaded hourly cost of the person managing this work",
    step: 5,
    min: 0,
  },
  {
    key: "archerMonthlyRate",
    label: "Archer Design monthly rate",
    helper: "The package rate being compared, editable to match either option",
    step: 50,
    min: 0,
  },
];

export function CostComparisonCalculator() {
  const [assumptions, setAssumptions] = useState<CostComparisonAssumptions>(DEFAULT_ASSUMPTIONS);

  function update(key: keyof CostComparisonAssumptions, rawValue: number, isPercent?: boolean) {
    const safe = Number.isFinite(rawValue) ? Math.max(0, rawValue) : 0;
    setAssumptions((prev) => ({
      ...prev,
      [key]: isPercent ? safe / 100 : safe,
    }));
  }

  const {
    inHouseMonthlyTotal,
    monthlyDifference,
    annualDifference,
  } = useMemo(() => {
    const {
      annualSalary,
      employerPayrollRate,
      benefitsRate,
      softwareAndEquipmentAnnual,
      recruitingAndOnboardingAnnualized,
      additionalFreelancerMonthly,
      internalManagementHoursMonthly,
      internalManagerHourlyCost,
      archerMonthlyRate,
    } = assumptions;

    const loadedSalaryMonthly =
      (annualSalary / 12) * (1 + employerPayrollRate + benefitsRate);
    const softwareMonthly = softwareAndEquipmentAnnual / 12;
    const recruitingMonthly = recruitingAndOnboardingAnnualized / 12;
    const managementMonthly = internalManagementHoursMonthly * internalManagerHourlyCost;

    const total =
      loadedSalaryMonthly +
      softwareMonthly +
      recruitingMonthly +
      additionalFreelancerMonthly +
      managementMonthly;

    return {
      inHouseMonthlyTotal: total,
      monthlyDifference: total - archerMonthlyRate,
      annualDifference: (total - archerMonthlyRate) * 12,
    };
  }, [assumptions]);

  return (
    <div className="st-card p-6 md:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-2xl text-[var(--st-ink)]">
          Illustrative cost model
        </h3>
        <span className="rounded-full border border-[var(--st-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--st-gold)]">
          Editable example
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
        Adjust the assumptions below to see an illustrative potential cost
        difference between building this capability in-house or through
        multiple vendors, and a predictable Archer Design monthly rate.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((field) => {
          const rawValue = assumptions[field.key];
          const displayValue = field.isPercent ? Math.round(rawValue * 1000) / 10 : rawValue;
          return (
            <label key={field.key} className="text-[13px] text-[var(--st-ink-soft)]">
              {field.label}
              <input
                type="number"
                inputMode="decimal"
                step={field.step}
                min={field.min}
                value={displayValue}
                onChange={(event) =>
                  update(field.key, Number(event.target.value), field.isPercent)
                }
                className="mt-2 w-full rounded-xl border border-[var(--st-line)] bg-[var(--st-cream)] px-4 py-3 text-[15px] text-[var(--st-ink)] outline-none transition focus:border-[var(--st-gold)]"
              />
              <span className="mt-1 block text-[11px] leading-snug text-[var(--st-ink-muted)]">
                {field.helper}
                {field.isPercent ? " (%)" : ""}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-cream)] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--st-ink-muted)]">
            In-house or multi-vendor monthly total
          </p>
          <p className="mt-2 font-serif text-2xl leading-none text-[var(--st-ink)]">
            {currency.format(inHouseMonthlyTotal)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-cream)] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--st-ink-muted)]">
            Archer Design monthly rate
          </p>
          <p className="mt-2 font-serif text-2xl leading-none text-[var(--st-ink)]">
            {currency.format(assumptions.archerMonthlyRate)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--st-gold)] bg-[rgba(169,138,76,0.08)] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--st-gold)]">
            Potential monthly difference
          </p>
          <p className="mt-2 font-serif text-2xl leading-none text-[var(--st-ink)]">
            {currency.format(monthlyDifference)}
          </p>
          <p className="mt-1 text-[11px] text-[var(--st-ink-muted)]">
            {currency.format(annualDifference)} potential annual difference
          </p>
        </div>
      </div>

      <p className="mt-6 rounded-xl border border-[var(--st-line)] bg-[var(--st-cream)] px-4 py-3 text-[12px] leading-relaxed text-[var(--st-ink-soft)]">
        Illustrative comparison only. Example based on transparent, editable
        assumptions you can adjust above. Actual costs vary by organization,
        role, location, and benefits structure. This is not legal, tax,
        accounting, or HR advice, and it does not guarantee that engaging an
        independent contractor avoids every employer obligation in every
        jurisdiction.
      </p>
    </div>
  );
}
