"use client";
/* eslint-disable react-hooks/set-state-in-effect -- same data-loading pattern as /contacts */

// Warm Intro Sources — people who can introduce Devon to multiple hotel
// decision-makers. Not prospects: multipliers. Manual outreach only.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, AlertTriangle, Handshake } from "lucide-react";
import { supabase } from "@/lib/supabase";

type IntroSource = {
  id: string;
  name: string;
  company: string | null;
  linkedin_url: string | null;
  category: string | null;
  relationship_strength: "cold" | "warming" | "warm" | "strong";
  intro_quality: "unknown" | "low" | "medium" | "high";
  hotel_network_size: string | null;
  partner_interest: "unknown" | "no" | "maybe" | "yes" | "active";
  referral_terms_discussed: boolean;
  last_touch: string | null;
  next_touch: string | null;
  intro_requested: boolean;
  intro_made: boolean;
  intro_result: string | null;
  notes: string | null;
  created_at: string;
};

type FormState = Omit<IntroSource, "id" | "created_at">;

const BLANK: FormState = {
  name: "", company: null, linkedin_url: null, category: null,
  relationship_strength: "cold", intro_quality: "unknown", hotel_network_size: null,
  partner_interest: "unknown", referral_terms_discussed: false,
  last_touch: null, next_touch: null, intro_requested: false, intro_made: false,
  intro_result: null, notes: null,
};

const CATEGORIES = [
  "hotel consultant", "revenue consultant", "former DOSM", "recruiter", "vendor",
  "event planner", "hotel tech rep", "photographer", "association leader", "GM", "owner/operator",
];

const STRENGTH_CLS: Record<string, string> = {
  cold: "bg-zinc-800 text-zinc-400 ring-zinc-700",
  warming: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  warm: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  strong: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
};

const INPUT = "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

export default function IntroSourcesPage() {
  const [rows, setRows] = useState<IntroSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(BLANK);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "due" | "requested" | "made" | "partners">("all");
  const [tick, setTick] = useState(0);
  const reload = () => setTick((t) => t + 1);

  useEffect(() => {
    supabase
      .from("intro_sources")
      .select("*")
      .order("next_touch", { ascending: true, nullsFirst: false })
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message.includes("intro_sources")
            ? "intro_sources table not found — run supabase/migrations/20260611_warm_intro_engine.sql first."
            : err.message);
        } else {
          setError(null);
          setRows((data as IntroSource[]) ?? []);
        }
        setLoading(false);
      });
  }, [tick]);

  const today = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => rows.filter((r) => {
    switch (filter) {
      case "due": return !!r.next_touch && r.next_touch <= today;
      case "requested": return r.intro_requested && !r.intro_made;
      case "made": return r.intro_made;
      case "partners": return r.partner_interest === "yes" || r.partner_interest === "active";
      default: return true;
    }
  }), [rows, filter, today]);

  function openAdd() { setEditId(null); setForm(BLANK); setOpen(true); }
  function openEdit(r: IntroSource) {
    setEditId(r.id);
    const rest: Record<string, unknown> = { ...r };
    delete rest.id;
    delete rest.created_at;
    setForm(rest as unknown as FormState);
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error: err } = editId
      ? await supabase.from("intro_sources").update(payload).eq("id", editId)
      : await supabase.from("intro_sources").insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setOpen(false);
    setError(null);
    reload();
  }

  async function del() {
    if (!deleteId) return;
    await supabase.from("intro_sources").delete().eq("id", deleteId);
    setDeleteId(null);
    reload();
  }

  return (
    <div className="px-6 py-6 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-zinc-100">
            <Handshake className="h-5 w-5 text-emerald-400" /> Warm Intro Sources
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            People who can introduce you to multiple hotel decision-makers — multipliers, not prospects. {rows.length} total.
          </p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Add Intro Source
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}

      <div className="mb-5 flex flex-wrap gap-1.5">
        {([["all", "All"], ["due", "Touch due"], ["requested", "Intro requested"], ["made", "Intros made"], ["partners", "Active partners"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === k ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30" : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"}`}>
            {label}
          </button>
        ))}
        <Link href="/partners" className="ml-auto rounded-full bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200">
          Formal partners →
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Name", "Category", "Strength", "Intro quality", "Network", "Partner interest", "Next touch", "Intro status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-zinc-600">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-zinc-600">No intro sources yet — start with consultants, recruiters, task-force pros, and vendors you already know.</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="group hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-zinc-200">{r.name}</p>
                  <p className="text-xs text-zinc-500">
                    {r.company ?? ""}
                    {r.linkedin_url && (
                      <>
                        {r.company ? " · " : ""}
                        <a href={r.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">LinkedIn</a>
                      </>
                    )}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">{r.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset capitalize ${STRENGTH_CLS[r.relationship_strength]}`}>{r.relationship_strength}</span>
                </td>
                <td className="px-4 py-3 text-xs capitalize text-zinc-400">{r.intro_quality}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{r.hotel_network_size ?? "—"}</td>
                <td className="px-4 py-3 text-xs capitalize text-zinc-400">
                  {r.partner_interest}{r.referral_terms_discussed ? " · terms ✓" : ""}
                </td>
                <td className={`px-4 py-3 text-xs tabular-nums ${r.next_touch && r.next_touch <= today ? "font-semibold text-amber-400" : "text-zinc-500"}`}>
                  {r.next_touch ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">
                  {r.intro_made ? <span className="text-emerald-400">made{r.intro_result ? `: ${r.intro_result}` : ""}</span>
                    : r.intro_requested ? <span className="text-amber-400">requested</span>
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-700 hover:text-zinc-200"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(r.id)} className="rounded-lg p-1.5 text-zinc-600 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/edit slide-over */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative flex w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="text-base font-semibold text-zinc-100">{editId ? "Edit Intro Source" : "Add Intro Source"}</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {([["Name *", "name", "text"], ["Company", "company", "text"], ["LinkedIn URL", "linkedin_url", "url"], ["Hotel network size", "hotel_network_size", "text"]] as const).map(([label, key, type]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
                  <input type={type} value={(form[key] as string) ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value || (key === "name" ? "" : null) }))} className={INPUT} />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Category</label>
                <select value={form.category ?? ""} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value || null }))} className={`${INPUT} cursor-pointer`}>
                  <option value="">— Select —</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Relationship strength</label>
                  <select value={form.relationship_strength} onChange={(e) => setForm((f) => ({ ...f, relationship_strength: e.target.value as FormState["relationship_strength"] }))} className={`${INPUT} cursor-pointer`}>
                    {["cold", "warming", "warm", "strong"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Likely intro quality</label>
                  <select value={form.intro_quality} onChange={(e) => setForm((f) => ({ ...f, intro_quality: e.target.value as FormState["intro_quality"] }))} className={`${INPUT} cursor-pointer`}>
                    {["unknown", "low", "medium", "high"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Partner interest</label>
                  <select value={form.partner_interest} onChange={(e) => setForm((f) => ({ ...f, partner_interest: e.target.value as FormState["partner_interest"] }))} className={`${INPUT} cursor-pointer`}>
                    {["unknown", "no", "maybe", "yes", "active"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs text-zinc-400">
                    <input type="checkbox" checked={form.referral_terms_discussed} onChange={(e) => setForm((f) => ({ ...f, referral_terms_discussed: e.target.checked }))} />
                    Referral terms discussed
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Last touch</label>
                  <input type="date" value={form.last_touch ?? ""} onChange={(e) => setForm((f) => ({ ...f, last_touch: e.target.value || null }))} className={INPUT} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Next touch</label>
                  <input type="date" value={form.next_touch ?? ""} onChange={(e) => setForm((f) => ({ ...f, next_touch: e.target.value || null }))} className={INPUT} />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input type="checkbox" checked={form.intro_requested} onChange={(e) => setForm((f) => ({ ...f, intro_requested: e.target.checked }))} />
                  Intro requested
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input type="checkbox" checked={form.intro_made} onChange={(e) => setForm((f) => ({ ...f, intro_made: e.target.checked }))} />
                  Intro made
                </label>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Intro result</label>
                <input type="text" value={form.intro_result ?? ""} onChange={(e) => setForm((f) => ({ ...f, intro_result: e.target.value || null }))} placeholder="e.g. intro to DOSM at [group] → call booked" className={INPUT} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Notes</label>
                <textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value || null }))} className={`${INPUT} resize-none`} />
              </div>
              {error && <p className="flex items-center gap-1.5 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" />{error}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-800 px-6 py-4">
              <button onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">Cancel</button>
              <button onClick={save} disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Source"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-zinc-100">Delete intro source?</h3>
            <p className="mb-5 text-sm text-zinc-500">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800">Cancel</button>
              <button onClick={del} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
