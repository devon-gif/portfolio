// 8-step weekly drip sequence definition.
// Each step maps to a template tagged `drip-N` (seeded by the migration) and
// fires `intervalDays` after the previous step.

export interface DripStep {
  step: number; // 1-based
  templateTag: string; // tag on the templates row
  intervalDays: number; // days after the previous step (or after enrollment for step 1)
  label: string;
}

export const DRIP_SEQUENCE: DripStep[] = [
  { step: 1, templateTag: "drip-1", intervalDays: 0, label: "Intro & value" },
  { step: 2, templateTag: "drip-2", intervalDays: 7, label: "Proof & outcomes" },
  { step: 3, templateTag: "drip-3", intervalDays: 7, label: "Use cases" },
  { step: 4, templateTag: "drip-4", intervalDays: 7, label: "Cost comparison" },
  { step: 5, templateTag: "drip-5", intervalDays: 7, label: "Social proof" },
  { step: 6, templateTag: "drip-6", intervalDays: 7, label: "Light touch" },
  { step: 7, templateTag: "drip-7", intervalDays: 7, label: "Case angle" },
  { step: 8, templateTag: "drip-8", intervalDays: 7, label: "Final note" },
];

export const TOTAL_DRIP_STEPS = DRIP_SEQUENCE.length;

export function getStep(step: number): DripStep | undefined {
  return DRIP_SEQUENCE.find((s) => s.step === step);
}

/** When the next step (after `currentStep`) should send, measured from `from`. */
export function nextSendAt(currentStep: number, from: Date = new Date()): Date | null {
  const next = getStep(currentStep + 1);
  if (!next) return null; // sequence complete
  const d = new Date(from);
  d.setDate(d.getDate() + next.intervalDays);
  return d;
}
