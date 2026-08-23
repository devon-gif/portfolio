"use client";

import { useMemo, useState } from "react";
import { Info, Minus, Plus } from "lucide-react";
import { ACTIVATION_TIERS, DEFAULT_TIER_KEY, fmtMoney, type TierKey } from "../../tcrm/tcrm-pricing";
import {
  CALC_MODE_REFERRAL,
  CALC_MODE_ACTIVATION,
  CALC_INPUT_1_LABEL,
  CALC_INPUT_1_QUICK,
  CALC_INPUT_1_DEFAULT,
  CALC_INPUT_1_MAX,
  CALC_INPUT_2_LABEL,
  CALC_INPUT_2_OPTIONS,
  CALC_INPUT_2_DEFAULT,
  CALC_INPUT_3_LABEL,
  CALC_INPUT_3_NOTE,
  CALC_INPUT_4_LABEL,
  CALC_INPUT_4_OPTIONS,
  CALC_INPUT_4_DEFAULT,
  CALC_INPUT_4_TOOLTIP,
  CALC_STEP_1_LABEL,
  CALC_STEP_1_RESULT_LABEL,
  CALC_STEP_2_LABEL,
  CALC_STEP_2_RESULT_LABEL,
  CALC_STEP_3_LABEL,
  CALC_STEP_3_RESULT_LABEL,
  CALC_STEP_4_LABEL,
  CALC_STEP_4_RESULT_LABEL,
  CALC_STEP_4_NOTE,
  CALC_BONUS_TOGGLE_LABEL,
  CALC_BONUS_TOGGLE_YES,
  CALC_BONUS_TOGGLE_NO,
  CALC_BONUS_TOGGLE_DEFAULT,
  CALC_BONUS_TOGGLE_NOTE,
  CALC_STEP_BONUS_M1_LABEL,
  CALC_STEP_BONUS_M1_RESULT_LABEL,
  CALC_STEP_BONUS_M2_LABEL,
  CALC_STEP_BONUS_M2_RESULT_LABEL,
  CALC_STEP_BONUS_YEAR_LABEL,
  CALC_STEP_BONUS_YEAR_RESULT_LABEL,
  CALC_STEP_BONUS_YEAR_NOTE,
  FIRST_MONTH_BONUS_PCT,
  RECURRING_SHARE_TIERS,
  fmtDnsMoneySmart,
  fmtDnsMoneyExact,
  CALC_B_INTRO,
  CALC_B_INPUT_1_LABEL,
  CALC_B_INPUT_1_QUICK,
  CALC_B_INPUT_1_DEFAULT,
  CALC_B_INPUT_1_MAX,
  CALC_B_INPUT_2_LABEL,
  CALC_B_INPUT_2_OPTIONS,
  CALC_B_INPUT_2_DEFAULT,
  CALC_B_INPUT_3_LABEL,
  CALC_B_INPUT_3_OPTIONS,
  CALC_B_INPUT_3_DEFAULT,
  CALC_B_INPUT_3_NOTE,
  CALC_B_INPUT_4_LABEL,
  CALC_B_INPUT_4_OPTIONS,
  CALC_B_INPUT_4_DEFAULT,
  CALC_B_STEP_1_LABEL,
  CALC_B_STEP_1_RESULT_LABEL,
  CALC_B_STEP_2_LABEL,
  CALC_B_STEP_2_RESULT_LABEL,
  CALC_B_STEP_3_LABEL,
  CALC_B_STEP_3_RESULT_LABEL,
  CALC_DISCLAIMER,
  CALC_BOTH_WAYS_NOTE,
} from "../dns-content";

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

type Mode = "referral" | "activation";

/**
 * Illustrative scenario calculator inside the "Ways a property could work
 * with Archer" economics section. Two modes: "Recurring Referral
 * Opportunity" (primary/default — models a DNS-referred client becoming an
 * ongoing, recurring Archer subscriber) and "One-Time Activation"
 * (secondary — models DNS's own completed-project volume instead of
 * introduced leads, kept deliberately non-default so it doesn't dominate
 * the commercial story). Both read live pricing from
 * app/tcrm/tcrm-pricing.ts — never a hardcoded or invented number.
 */
export function DnsReferralCalculator() {
  const [mode, setMode] = useState<Mode>("referral");

  // ---- Mode A: referral introductions ----
  const [introductions, setIntroductions] = useState(CALC_INPUT_1_DEFAULT);
  const [introText, setIntroText] = useState(String(CALC_INPUT_1_DEFAULT));
  const [conversionPct, setConversionPct] = useState<number>(CALC_INPUT_2_DEFAULT);
  const [tierKey, setTierKey] = useState<TierKey>(DEFAULT_TIER_KEY);
  const [referralPct, setReferralPct] = useState<number>(CALC_INPUT_4_DEFAULT);
  const [includeBonus, setIncludeBonus] = useState<boolean>(CALC_BONUS_TOGGLE_DEFAULT);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // ---- Mode B: post-install activation ----
  const [projects, setProjects] = useState(CALC_B_INPUT_1_DEFAULT);
  const [projectsText, setProjectsText] = useState(String(CALC_B_INPUT_1_DEFAULT));
  const [addingPct, setAddingPct] = useState<number>(CALC_B_INPUT_2_DEFAULT);
  // Illustrative scenario dollar value only — never one of Archer's real
  // named plans, since no Project Reveal Kit price has actually been set.
  const [activationValue, setActivationValue] = useState<number>(CALC_B_INPUT_3_DEFAULT);
  const [bSharePct, setBSharePct] = useState<number>(CALC_B_INPUT_4_DEFAULT);

  const tier = ACTIVATION_TIERS.find((t) => t.key === tierKey) ?? ACTIVATION_TIERS[0];

  function commitIntroductions(n: number) {
    const clamped = clamp(n, 1, CALC_INPUT_1_MAX);
    setIntroductions(clamped);
    setIntroText(String(clamped));
  }

  function commitProjects(n: number) {
    const clamped = clamp(n, 1, CALC_B_INPUT_1_MAX);
    setProjects(clamped);
    setProjectsText(String(clamped));
  }

  const referralResult = useMemo(() => {
    const newClients = introductions * (conversionPct / 100);
    const monthlyRevenue = newClients * tier.retail;
    // Non-bonus path: flat recurring percentage every month, all 12 months.
    const monthlyReferralValue = monthlyRevenue * (referralPct / 100);
    const annualReferralValue = monthlyReferralValue * 12;
    // Bonus path: month one pays FIRST_MONTH_BONUS_PCT of month-one revenue
    // INSTEAD OF the recurring percentage (never both); months two through
    // twelve (11 months) pay the selected recurring percentage.
    const month1BonusValue = monthlyRevenue * (FIRST_MONTH_BONUS_PCT / 100);
    const month2PlusMonthlyValue = monthlyReferralValue;
    const yearOneBonusValue = month1BonusValue + month2PlusMonthlyValue * 11;
    return { newClients, monthlyRevenue, monthlyReferralValue, annualReferralValue, month1BonusValue, month2PlusMonthlyValue, yearOneBonusValue };
  }, [introductions, conversionPct, tier, referralPct]);

  const activationResult = useMemo(() => {
    const activatedProjects = projects * (addingPct / 100);
    const activationValueCreated = activatedProjects * activationValue;
    const partnerValue = activationValueCreated * (bSharePct / 100);
    return { activatedProjects, activationValueCreated, partnerValue };
  }, [projects, addingPct, activationValue, bSharePct]);

  const clientsDisplay = Number.isInteger(referralResult.newClients) ? String(referralResult.newClients) : referralResult.newClients.toFixed(1);
  const activatedDisplay = Number.isInteger(activationResult.activatedProjects)
    ? String(activationResult.activatedProjects)
    : activationResult.activatedProjects.toFixed(1);

  return (
    <div className="dns-calc">
      <div className="dns-calc-mode-tabs" role="tablist" aria-label="Scenario mode">
        <button type="button" role="tab" aria-selected={mode === "referral"} className={`dns-calc-mode-tab${mode === "referral" ? " is-active" : ""}`} onClick={() => setMode("referral")}>
          {CALC_MODE_REFERRAL}
        </button>
        <button type="button" role="tab" aria-selected={mode === "activation"} className={`dns-calc-mode-tab${mode === "activation" ? " is-active" : ""}`} onClick={() => setMode("activation")}>
          {CALC_MODE_ACTIVATION}
        </button>
      </div>

      {mode === "referral" ? (
        <>
          <div className="dns-calc-field">
            <label className="dns-calc-label" htmlFor="dns-calc-intro">
              {CALC_INPUT_1_LABEL}
            </label>
            <div className="dns-calc-slider-row">
              <button type="button" className="dns-calc-stepper" onClick={() => commitIntroductions(introductions - 1)} disabled={introductions <= 1} aria-label="Decrease introductions per year by one">
                <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <input
                id="dns-calc-intro"
                type="range"
                min={1}
                max={CALC_INPUT_1_MAX}
                step={1}
                value={introductions}
                onChange={(e) => commitIntroductions(Number(e.target.value))}
                aria-valuemin={1}
                aria-valuemax={CALC_INPUT_1_MAX}
                aria-valuenow={introductions}
                className="dns-calc-slider"
              />
              <button type="button" className="dns-calc-stepper" onClick={() => commitIntroductions(introductions + 1)} disabled={introductions >= CALC_INPUT_1_MAX} aria-label="Increase introductions per year by one">
                <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={CALC_INPUT_1_MAX}
                value={introText}
                onChange={(e) => {
                  setIntroText(e.target.value);
                  if (e.target.value !== "") {
                    const n = Number(e.target.value);
                    if (!Number.isNaN(n)) commitIntroductions(n);
                  }
                }}
                onBlur={() => setIntroText(String(introductions))}
                aria-label="Introductions per year, numeric entry"
                className="dns-calc-num-input"
              />
            </div>
            <div className="dns-calc-quick-row">
              {CALC_INPUT_1_QUICK.map((v) => (
                <button key={v} type="button" className={`dns-calc-quick${introductions === v ? " is-active" : ""}`} onClick={() => commitIntroductions(v)}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="dns-calc-field">
            <span className="dns-calc-label">{CALC_INPUT_2_LABEL}</span>
            <div className="dns-calc-tabs" role="tablist" aria-label="Estimated conversion rate">
              {CALC_INPUT_2_OPTIONS.map((v) => (
                <button key={v} type="button" role="tab" aria-selected={conversionPct === v} className={`dns-calc-tab${conversionPct === v ? " is-active" : ""}`} onClick={() => setConversionPct(v)}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <div className="dns-calc-field">
            <span className="dns-calc-label">{CALC_INPUT_3_LABEL}</span>
            <div className="dns-calc-tabs" role="tablist" aria-label="Archer plan">
              {ACTIVATION_TIERS.map((t) => (
                <button key={t.key} type="button" role="tab" aria-selected={tierKey === t.key} className={`dns-calc-tab${tierKey === t.key ? " is-active" : ""}`} onClick={() => setTierKey(t.key)}>
                  {t.name} · {fmtMoney(t.retail)}/mo
                </button>
              ))}
            </div>
            <p className="dns-calc-note">{CALC_INPUT_3_NOTE}</p>
          </div>

          <div className="dns-calc-field">
            <span className="dns-calc-label">
              {CALC_INPUT_4_LABEL}
              <button type="button" className="dns-calc-info" aria-label="What does illustrative referral share mean?" onClick={() => setTooltipOpen((v) => !v)}>
                <Info size={13} strokeWidth={2} aria-hidden="true" />
              </button>
              <span className="dns-calc-illustrative-tag">Illustrative Only</span>
            </span>
            {tooltipOpen && <p className="dns-calc-tooltip">{CALC_INPUT_4_TOOLTIP}</p>}
            <div className="dns-calc-tabs" role="tablist" aria-label="Illustrative referral share">
              {CALC_INPUT_4_OPTIONS.map((v) => {
                const tierName = RECURRING_SHARE_TIERS.find((t) => t.pct === v)?.name;
                return (
                  <button key={v} type="button" role="tab" aria-selected={referralPct === v} className={`dns-calc-tab${referralPct === v ? " is-active" : ""}`} onClick={() => setReferralPct(v)}>
                    {v}%{tierName ? <span className="dns-calc-tab-sub"> {tierName}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dns-calc-field">
            <span className="dns-calc-label">{CALC_BONUS_TOGGLE_LABEL}</span>
            <div className="dns-calc-tabs dns-calc-tabs--toggle" role="tablist" aria-label="Include proposed first-month bonus">
              <button type="button" role="tab" aria-selected={includeBonus} className={`dns-calc-tab${includeBonus ? " is-active" : ""}`} onClick={() => setIncludeBonus(true)}>
                {CALC_BONUS_TOGGLE_YES}
              </button>
              <button type="button" role="tab" aria-selected={!includeBonus} className={`dns-calc-tab${!includeBonus ? " is-active" : ""}`} onClick={() => setIncludeBonus(false)}>
                {CALC_BONUS_TOGGLE_NO}
              </button>
            </div>
            <p className="dns-calc-note">{CALC_BONUS_TOGGLE_NOTE}</p>
          </div>

          <div className="dns-calc-results">
            <div className="dns-calc-step">
              <span className="dns-calc-step-formula">{CALC_STEP_1_LABEL}</span>
              <div className="dns-calc-step-row">
                <span>{CALC_STEP_1_RESULT_LABEL}</span>
                <span className="dns-calc-step-value">{clientsDisplay}</span>
              </div>
            </div>
            <div className="dns-calc-step">
              <span className="dns-calc-step-formula">{CALC_STEP_2_LABEL}</span>
              <div className="dns-calc-step-row">
                <span>{CALC_STEP_2_RESULT_LABEL}</span>
                <span className="dns-calc-step-value">{fmtMoney(referralResult.monthlyRevenue)}</span>
              </div>
            </div>

            {includeBonus ? (
              <>
                <div className="dns-calc-step">
                  <span className="dns-calc-step-formula">{CALC_STEP_BONUS_M1_LABEL}</span>
                  <div className="dns-calc-step-row">
                    <span>{CALC_STEP_BONUS_M1_RESULT_LABEL}</span>
                    <span className="dns-calc-step-value">{fmtDnsMoneySmart(referralResult.month1BonusValue)}</span>
                  </div>
                </div>
                <div className="dns-calc-step">
                  <span className="dns-calc-step-formula">{CALC_STEP_BONUS_M2_LABEL}</span>
                  <div className="dns-calc-step-row">
                    <span>{CALC_STEP_BONUS_M2_RESULT_LABEL}</span>
                    <span className="dns-calc-step-value">{fmtDnsMoneySmart(referralResult.month2PlusMonthlyValue)}</span>
                  </div>
                </div>
                <div className="dns-calc-step dns-calc-step--highlight">
                  <span className="dns-calc-step-formula">{CALC_STEP_BONUS_YEAR_LABEL}</span>
                  <div className="dns-calc-step-row">
                    <span>{CALC_STEP_BONUS_YEAR_RESULT_LABEL}</span>
                    <span className="dns-calc-step-value dns-calc-step-value--highlight">{fmtDnsMoneyExact(referralResult.yearOneBonusValue)}</span>
                  </div>
                  <p className="dns-calc-step-note">{CALC_STEP_BONUS_YEAR_NOTE}</p>
                </div>
              </>
            ) : (
              <>
                <div className="dns-calc-step">
                  <span className="dns-calc-step-formula">{CALC_STEP_3_LABEL}</span>
                  <div className="dns-calc-step-row">
                    <span>{CALC_STEP_3_RESULT_LABEL}</span>
                    <span className="dns-calc-step-value">{fmtMoney(referralResult.monthlyReferralValue)}</span>
                  </div>
                </div>
                <div className="dns-calc-step dns-calc-step--highlight">
                  <span className="dns-calc-step-formula">{CALC_STEP_4_LABEL}</span>
                  <div className="dns-calc-step-row">
                    <span>{CALC_STEP_4_RESULT_LABEL}</span>
                    <span className="dns-calc-step-value dns-calc-step-value--highlight">{fmtMoney(referralResult.annualReferralValue)}</span>
                  </div>
                  <p className="dns-calc-step-note">{CALC_STEP_4_NOTE}</p>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="dns-calc-b-intro">{CALC_B_INTRO}</p>
          <div className="dns-calc-field">
            <label className="dns-calc-label" htmlFor="dns-calc-projects">
              {CALC_B_INPUT_1_LABEL}
            </label>
            <div className="dns-calc-slider-row">
              <button type="button" className="dns-calc-stepper" onClick={() => commitProjects(projects - 1)} disabled={projects <= 1} aria-label="Decrease DNS hospitality projects per year by one">
                <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <input
                id="dns-calc-projects"
                type="range"
                min={1}
                max={CALC_B_INPUT_1_MAX}
                step={1}
                value={projects}
                onChange={(e) => commitProjects(Number(e.target.value))}
                aria-valuemin={1}
                aria-valuemax={CALC_B_INPUT_1_MAX}
                aria-valuenow={projects}
                className="dns-calc-slider"
              />
              <button type="button" className="dns-calc-stepper" onClick={() => commitProjects(projects + 1)} disabled={projects >= CALC_B_INPUT_1_MAX} aria-label="Increase DNS hospitality projects per year by one">
                <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={CALC_B_INPUT_1_MAX}
                value={projectsText}
                onChange={(e) => {
                  setProjectsText(e.target.value);
                  if (e.target.value !== "") {
                    const n = Number(e.target.value);
                    if (!Number.isNaN(n)) commitProjects(n);
                  }
                }}
                onBlur={() => setProjectsText(String(projects))}
                aria-label="DNS hospitality projects per year, numeric entry"
                className="dns-calc-num-input"
              />
            </div>
            <div className="dns-calc-quick-row">
              {CALC_B_INPUT_1_QUICK.map((v) => (
                <button key={v} type="button" className={`dns-calc-quick${projects === v ? " is-active" : ""}`} onClick={() => commitProjects(v)}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="dns-calc-field">
            <span className="dns-calc-label">{CALC_B_INPUT_2_LABEL}</span>
            <div className="dns-calc-tabs" role="tablist" aria-label="Percent adding Archer activation">
              {CALC_B_INPUT_2_OPTIONS.map((v) => (
                <button key={v} type="button" role="tab" aria-selected={addingPct === v} className={`dns-calc-tab${addingPct === v ? " is-active" : ""}`} onClick={() => setAddingPct(v)}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <div className="dns-calc-field">
            <span className="dns-calc-label">
              {CALC_B_INPUT_3_LABEL}
              <span className="dns-calc-illustrative-tag">Illustrative Only</span>
            </span>
            <div className="dns-calc-tabs" role="tablist" aria-label="Average activation value">
              {CALC_B_INPUT_3_OPTIONS.map((v) => (
                <button key={v} type="button" role="tab" aria-selected={activationValue === v} className={`dns-calc-tab${activationValue === v ? " is-active" : ""}`} onClick={() => setActivationValue(v)}>
                  {fmtMoney(v)}
                </button>
              ))}
            </div>
            <p className="dns-calc-note">{CALC_B_INPUT_3_NOTE}</p>
          </div>

          <div className="dns-calc-field">
            <span className="dns-calc-label">
              {CALC_B_INPUT_4_LABEL}
              <span className="dns-calc-illustrative-tag">Illustrative Only</span>
            </span>
            <div className="dns-calc-tabs" role="tablist" aria-label="Illustrative partner share">
              {CALC_B_INPUT_4_OPTIONS.map((v) => (
                <button key={v} type="button" role="tab" aria-selected={bSharePct === v} className={`dns-calc-tab${bSharePct === v ? " is-active" : ""}`} onClick={() => setBSharePct(v)}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <div className="dns-calc-results">
            <div className="dns-calc-step">
              <span className="dns-calc-step-formula">{CALC_B_STEP_1_LABEL}</span>
              <div className="dns-calc-step-row">
                <span>{CALC_B_STEP_1_RESULT_LABEL}</span>
                <span className="dns-calc-step-value">{activatedDisplay}</span>
              </div>
            </div>
            <div className="dns-calc-step">
              <span className="dns-calc-step-formula">{CALC_B_STEP_2_LABEL}</span>
              <div className="dns-calc-step-row">
                <span>{CALC_B_STEP_2_RESULT_LABEL}</span>
                <span className="dns-calc-step-value">{fmtMoney(activationResult.activationValueCreated)}</span>
              </div>
            </div>
            <div className="dns-calc-step dns-calc-step--highlight">
              <span className="dns-calc-step-formula">{CALC_B_STEP_3_LABEL}</span>
              <div className="dns-calc-step-row">
                <span>{CALC_B_STEP_3_RESULT_LABEL}</span>
                <span className="dns-calc-step-value dns-calc-step-value--highlight">{fmtMoney(activationResult.partnerValue)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <p className="dns-calc-disclaimer">{CALC_DISCLAIMER}</p>
      <p className="dns-calc-both-ways">{CALC_BOTH_WAYS_NOTE}</p>
    </div>
  );
}
