"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ShieldBan, AlertTriangle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PageHeader } from "@/components/PageHeader";

type Row = { id: string; email: string | null; domain: string | null; company_name: string | null; reason: string | null; created_at: string };

const INPUT = "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

export default function SuppressionPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", domain: "", company_name: "", reason: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    supabase.from("suppression_list").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setRows((data as Row[]) ?? []); setLoading(false); });
  }, [tick]);

  async function add() {
    setError(null);
    const email = form.email.trim();
    const domain = form.domain.trim();
    const company_name = form.company_name.trim();
    if (!email && !domain && !company_name) { setError("Enter an email, domain, or company name."); return; }
    setSaving(true);
    const { error } = await supabase.from("suppression_list").insert({
      email: email || null, domain: domain || null, company_name: company_name || null, reason: form.reason.trim() || null,
    });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setForm({ email: "", domain: "", company_name: "", reason: "" });
    setTick((t) => t + 1);
  }

  async function del() {
    if (!deleteId) return;
    await supabase.from("suppression_list").delete().eq("id", deleteId);
    setDeleteId(null);
    setTick((t) => t + 1);
  }

  return (
    <div className="px-6 py-6 max-w-5xl">
      <PageHeader title="Suppression List" description={`${rows.length} blocked ${rows.length === 1 ? "entry" : "entries"}`} />

      <div className="mb-5 flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
        <ShieldBan className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
        <p>Anyone matching an entry here by <span className="text-zinc-300">email</span>, <span className="text-zinc-300">domain</span>, or <span className="text-zinc-300">company name</span> is permanently blocked from all sends. The sending pipeline checks this list before every email.</p>
      </div>

      {/* Add form */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className={INPUT} placeholder="Email (person@company.com)" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input className={INPUT} placeholder="Domain (company.com)" value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))} />
          <input className={INPUT} placeholder="Company name" value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} />
          <input className={INPUT} placeholder="Reason (optional)" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
        </div>
        <div className="flex items-center justify-between mt-3">
          {error ? <p className="flex items-center gap-1.5 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" />{error}</p> : <span className="text-xs text-zinc-600">Provide at least one of email, domain, or company name.</span>}
          <button onClick={add} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-4 py-2 text-sm font-semibold text-white transition-colors">
            <Plus className="h-4 w-4" />{saving ? "Adding…" : "Add to suppression"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Email", "Domain", "Company", "Reason", "Added", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
            {!isSupabaseConfigured ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-600">Connect Supabase to manage the suppression list.</td></tr>
            ) : loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-600">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-600">No suppressed entries.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="group hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-sm text-zinc-200">{r.email ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{r.domain ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{r.company_name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-zinc-500">{r.reason ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-zinc-600 tabular-nums">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setDeleteId(r.id)} className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Remove from suppression?</h3>
            <p className="text-sm text-zinc-500 mb-5">This contact/domain could be emailed again. Continue?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={del} className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
