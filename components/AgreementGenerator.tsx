"use client";

// Agreement Generator — copy/paste MSA + SOW output. No e-signature in v1:
// paste into DocuSign / Dropbox Sign / PandaDoc / Google Docs.

import { useMemo, useState } from "react";
import { Clipboard, ClipboardCheck, ScrollText } from "lucide-react";
import {
  AGREEMENT_DEFAULTS, AGREEMENT_TYPES, generateAgreementBundle, type AgreementInputs,
} from "@/lib/agreements";

const INPUT = "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
    >
      {done ? <ClipboardCheck className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
      {done ? "Copied" : label}
    </button>
  );
}

export function AgreementGenerator({ prefill }: { prefill?: Partial<AgreementInputs> }) {
  const [form, setForm] = useState<AgreementInputs>({
    clientLegalName: "", contactName: "", contactTitle: "", billingEmail: "", companyAddress: "",
    packageName: "", agreementType: "pilot", propertyCount: "", propertyNames: "",
    servicesIncluded: "", monthlyFee: "", setupFee: "", startDate: "", termLength: "30 days",
    paymentTerms: AGREEMENT_DEFAULTS.paymentTerms ?? "",
    revisionTerms: AGREEMENT_DEFAULTS.revisionTerms ?? "",
    approvalContact: "",
    latePaymentTerms: AGREEMENT_DEFAULTS.latePaymentTerms ?? "",
    cancellationTerms: AGREEMENT_DEFAULTS.cancellationTerms ?? "",
    publicityPermission: true, specialNotes: "",
    ...prefill,
  });
  const [show, setShow] = useState(false);

  const bundle = useMemo(() => generateAgreementBundle(form), [form]);
  const fullText = useMemo(
    () => bundle.map((b) => b.body).join("\n\n" + "─".repeat(60) + "\n\n"),
    [bundle]
  );

  const set = <K extends keyof AgreementInputs>(k: K, v: AgreementInputs[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const FIELDS: [string, keyof AgreementInputs, string][] = [
    ["Client company legal name", "clientLegalName", "text"],
    ["Contact name", "contactName", "text"],
    ["Contact title", "contactTitle", "text"],
    ["Billing email", "billingEmail", "email"],
    ["Company address", "companyAddress", "text"],
    ["Package selected", "packageName", "text"],
    ["Number of properties", "propertyCount", "text"],
    ["Property names", "propertyNames", "text"],
    ["Services included", "servicesIncluded", "text"],
    ["Monthly fee (USD)", "monthlyFee", "text"],
    ["Setup fee (USD, optional)", "setupFee", "text"],
    ["Start date", "startDate", "date"],
    ["Term length", "termLength", "text"],
    ["Approval contact", "approvalContact", "text"],
  ];

  const TEXTAREAS: [string, keyof AgreementInputs][] = [
    ["Payment terms", "paymentTerms"],
    ["Revision terms", "revisionTerms"],
    ["Late payment terms", "latePaymentTerms"],
    ["Cancellation terms", "cancellationTerms"],
    ["Special notes", "specialNotes"],
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <ScrollText className="h-4 w-4 text-[#C9A44C]" /> Agreement Generator (MSA + SOW)
        </h2>
        <CopyBtn text={fullText} label="Copy full bundle" />
      </div>
      <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-300">
        ⚠ AI-generated agreement templates — have an attorney review before client use. Paste into
        DocuSign, Dropbox Sign, PandaDoc, or Google Docs for signature (no e-signature in v1).
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Agreement type</label>
          <select value={form.agreementType} onChange={(e) => set("agreementType", e.target.value)} className={`${INPUT} cursor-pointer`}>
            {AGREEMENT_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>
        {FIELDS.map(([label, key, type]) => (
          <div key={key}>
            <label className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
            <input type={type} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value as never)} className={INPUT} />
          </div>
        ))}
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input type="checkbox" checked={form.publicityPermission} onChange={(e) => set("publicityPermission", e.target.checked)} />
            Portfolio/publicity permission
          </label>
        </div>
      </div>

      <details className="group mt-3">
        <summary className="cursor-pointer list-none text-xs text-zinc-500 hover:text-zinc-300 [&::-webkit-details-marker]:hidden">
          ▸ Edit standard terms (payment, revisions, late payment, cancellation, notes)
        </summary>
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {TEXTAREAS.map(([label, key]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
              <textarea rows={2} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value as never)} className={`${INPUT} resize-y`} />
            </div>
          ))}
        </div>
      </details>

      <button
        onClick={() => setShow((v) => !v)}
        className="mt-4 rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-600/40"
      >
        {show ? "Hide generated documents" : "Generate documents"}
      </button>

      {show && (
        <div className="mt-4 space-y-4">
          {bundle.map((doc) => (
            <div key={doc.name} className="rounded-lg border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
                <span className="text-xs font-semibold text-zinc-300">{doc.name}</span>
                <span className="flex items-center gap-2">
                  <CopyBtn text={doc.body} />
                  <span className="text-[10px] text-zinc-600">PDF export: paste into Docs → download as PDF (placeholder for v2)</span>
                </span>
              </div>
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap p-3 font-sans text-[11px] leading-relaxed text-zinc-400">
                {doc.body}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
