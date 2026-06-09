"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Partner, PartnerType, PartnerStatus, CommissionType } from "@/lib/types";
import { MOCK_PARTNERS } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { SlideOver, Field, Input, Textarea, Select } from "@/components/SlideOver";
import clsx from "clsx";

const EMPTY: Omit<Partner, "id" | "created_at" | "updated_at" | "referral_count"> = {
  name: "",
  company: "",
  email: "",
  phone: "",
  linkedin_url: "",
  partnership_type: "referral",
  commission_type: "percentage" as CommissionType,
  commission_value: 10,
  status: "active" as PartnerStatus,
  notes: "",
};

const TYPE_LABELS: Record<PartnerType, string> = {
  referral: "Referral",
  agency: "Agency",
  tech: "Tech",
  co_marketing: "Co-Marketing",
  other: "Other",
};

const COMMISSION_LABELS: Record<CommissionType, string> = {
  percentage: "% of Deal",
  flat: "Flat Fee",
  retainer: "Retainer",
};

const STATUS_COLORS: Record<PartnerStatus, string> = {
  active:   "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  inactive: "bg-zinc-800 text-zinc-500 ring-zinc-700",
  prospect: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [search, setSearch] = useState("");
  const [slideOver, setSlideOver] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<Partner> }>({
    open: false, mode: "add", data: EMPTY,
  });
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return partners.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.company?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q)
    );
  }, [partners, search]);

  function openAdd() {
    setSlideOver({ open: true, mode: "add", data: { ...EMPTY } });
  }

  function openEdit(p: Partner) {
    setSlideOver({ open: true, mode: "edit", data: { ...p } });
  }

  function handleSave() {
    const d = slideOver.data as Partner;
    if (slideOver.mode === "add") {
      const newPartner: Partner = {
        ...d,
        id: crypto.randomUUID(),
        referral_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPartners((prev) => [newPartner, ...prev]);
    } else {
      setPartners((prev) => prev.map((p) => (p.id === d.id ? { ...p, ...d, updated_at: new Date().toISOString() } : p)));
    }
    setSlideOver((s) => ({ ...s, open: false }));
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setPartners((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function patch(key: string, value: unknown) {
    setSlideOver((s) => ({ ...s, data: { ...s.data, [key]: value } }));
  }

  const d = slideOver.data;

  return (
    <div className="px-6 py-6 max-w-7xl">
      <PageHeader
        title="Partners"
        description={`${partners.length} referral partner${partners.length !== 1 ? "s" : ""}`}
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Partner
          </button>
        }
      />

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search partners…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50 transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No partners found" description="Add your first referral partner to get started." />
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                {["Name", "Type", "Commission", "Referrals", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
              {filtered.map((p) => (
                <tr key={p.id} className="group hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-zinc-200">{p.name}</div>
                    <div className="text-xs text-zinc-500">
                      {p.company && <span>{p.company}</span>}
                      {p.email && <span className="ml-1 text-zinc-600">· {p.email}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400">{TYPE_LABELS[p.partnership_type as PartnerType]}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400">
                    {p.commission_type
                      ? `${COMMISSION_LABELS[p.commission_type as CommissionType]}${p.commission_type === "percentage" ? ` — ${p.commission_value}%` : p.commission_value ? ` — $${p.commission_value}` : ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-zinc-300 tabular-nums">
                    {p.referral_count ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset capitalize", STATUS_COLORS[p.status as PartnerStatus])}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1 items-center">
                      {p.linkedin_url && (
                        <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-700 transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-700 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over form */}
      <SlideOver
        open={slideOver.open}
        onClose={() => setSlideOver((s) => ({ ...s, open: false }))}
        title={slideOver.mode === "add" ? "Add Partner" : "Edit Partner"}
        footer={
          <>
            <button onClick={() => setSlideOver((s) => ({ ...s, open: false }))} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
              {slideOver.mode === "add" ? "Add Partner" : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name *"><Input value={d.name ?? ""} onChange={(e) => patch("name", e.target.value)} /></Field>
          <Field label="Company"><Input value={d.company ?? ""} onChange={(e) => patch("company", e.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={d.email ?? ""} onChange={(e) => patch("email", e.target.value)} /></Field>
          <Field label="Phone"><Input type="tel" value={d.phone ?? ""} onChange={(e) => patch("phone", e.target.value)} /></Field>
          <Field label="LinkedIn URL"><Input value={d.linkedin_url ?? ""} onChange={(e) => patch("linkedin_url", e.target.value)} /></Field>
          <Field label="Partnership Type">
            <Select value={d.partnership_type ?? "referral"} onChange={(e) => patch("partnership_type", e.target.value)}>
              {(Object.keys(TYPE_LABELS) as PartnerType[]).map((k) => (
                <option key={k} value={k}>{TYPE_LABELS[k]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Commission Type">
            <Select value={d.commission_type ?? "percentage"} onChange={(e) => patch("commission_type", e.target.value || null)}>
              <option value="">None</option>
              {(Object.keys(COMMISSION_LABELS) as CommissionType[]).map((k) => (
                <option key={k} value={k}>{COMMISSION_LABELS[k]}</option>
              ))}
            </Select>
          </Field>
          {d.commission_type && d.commission_type !== "retainer" && (
            <Field label={d.commission_type === "percentage" ? "Commission %" : "Flat Fee ($)"}>
              <Input type="number" value={d.commission_value ?? ""} onChange={(e) => patch("commission_value", parseFloat(e.target.value))} />
            </Field>
          )}
          <Field label="Status">
            <Select value={d.status ?? "active"} onChange={(e) => patch("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
          <Field label="Notes"><Textarea value={d.notes ?? ""} onChange={(e) => patch("notes", e.target.value)} rows={3} /></Field>
        </div>
      </SlideOver>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Delete Partner</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Remove <span className="text-zinc-200 font-medium">{deleteTarget.name}</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
