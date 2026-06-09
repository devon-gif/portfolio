"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Only columns that actually exist on the live `contacts` table.
type ContactForm = {
  first_name: string;
  last_name: string;
  title: string | null;
  email: string | null;
  linkedin_url: string | null;
  phone: string | null;
  city: string | null;
  market: "US" | "Canada" | "UK" | "UAE" | "Other" | null;
  type: string;
  status: string | null;
  notes: string | null;
  company_id: string | null;
  personalization_angle: string | null;
  specific_use_cases: string | null;
  specific_client_type: string | null;
};

type ContactRow = ContactForm & { id: string; created_at: string; city: string | null; type: string; companies?: { name?: string | null } | null };

const BLANK: ContactForm = {
  first_name: "", last_name: "", title: null, email: null, linkedin_url: null,
  phone: null, city: null, market: null, type: "unknown", status: "new", notes: null, company_id: null,
  personalization_angle: null, specific_use_cases: null, specific_client_type: null,
};

function suggestMarket(input: { city?: string | null; email?: string | null; linkedin_url?: string | null }): "US" | "Canada" | "UK" | "UAE" | "Other" {
  const text = `${input.city ?? ""} ${input.email ?? ""} ${input.linkedin_url ?? ""}`.toLowerCase();
  if (/\b(uk|united kingdom|london|manchester|birmingham|\.co\.uk)\b/.test(text)) return "UK";
  if (/\b(canada|toronto|vancouver|montreal|\.ca)\b/.test(text)) return "Canada";
  if (/\b(uae|dubai|abu dhabi|emirates|\.ae)\b/.test(text)) return "UAE";
  if (/\b(us|usa|united states|new york|los angeles|chicago|miami|\.com)\b/.test(text)) return "US";
  return "Other";
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  queued: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
  sent: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  replied: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  not_interested: "bg-zinc-800 text-zinc-500 ring-zinc-700",
  unsubscribed: "bg-red-500/10 text-red-400 ring-red-500/20",
  won: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
};

function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="text-zinc-600 text-sm">—</span>;
  const cls = STATUS_COLORS[status] ?? "bg-zinc-800 text-zinc-400 ring-zinc-700";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${cls}`}>{status.replace(/_/g, " ")}</span>;
}

const INPUT = "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

export default function ContactsPage() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ContactForm>(BLANK);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  function reload() { setTick((t) => t + 1); }

  useEffect(() => {
    supabase
      .from("contacts")
      .select("*, companies(name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setRows((data as ContactRow[]) ?? []); setLoading(false); });
  }, [tick]);

  useEffect(() => {
    supabase.from("companies").select("id, name").order("name", { ascending: true })
      .then(({ data }) => setCompanies((data as { id: string; name: string }[]) ?? []));
  }, []);

  function openAdd() { setEditId(null); setForm(BLANK); setError(null); setOpen(true); }
  function openEdit(c: ContactRow) {
    setEditId(c.id);
    setForm({
      first_name: c.first_name, last_name: c.last_name, title: c.title, email: c.email,
      linkedin_url: c.linkedin_url, phone: c.phone, city: c.city, type: c.type ?? "unknown",
      market: c.market ?? null, status: c.status, notes: c.notes, company_id: c.company_id,
      personalization_angle: c.personalization_angle, specific_use_cases: c.specific_use_cases,
      specific_client_type: c.specific_client_type,
    });
    setError(null);
    setOpen(true);
  }

  async function save() {
    if (!form.first_name.trim()) { setError("First name is required."); return; }
    setSaving(true);
    setError(null);
    // Payload contains only real columns; company_id is null when none chosen.
    const payload = { ...form, company_id: form.company_id || null };
    const { error } = editId
      ? await supabase.from("contacts").update(payload).eq("id", editId)
      : await supabase.from("contacts").insert(payload);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setOpen(false);
    reload();
  }

  async function del() {
    if (!deleteId) return;
    await supabase.from("contacts").delete().eq("id", deleteId);
    setDeleteId(null);
    reload();
  }

  const filtered = rows.filter((r) =>
    `${r.first_name} ${r.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    (r.companies?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (r.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const TEXT_FIELDS: [string, keyof ContactForm, string][] = [
    ["First Name *", "first_name", "text"],
    ["Last Name", "last_name", "text"],
    ["Title", "title", "text"],
    ["Email", "email", "email"],
    ["LinkedIn URL", "linkedin_url", "url"],
    ["Phone", "phone", "tel"],
    ["City", "city", "text"],
  ];
  const PERSONALIZATION: [string, keyof ContactForm, string][] = [
    ["Personalization angle", "personalization_angle", "Why now / what's relevant to this contact"],
    ["Specific use cases", "specific_use_cases", "e.g. social content, paid campaigns, brand creative"],
    ["Specific client type", "specific_client_type", "e.g. boutique hotel groups"],
  ];

  return (
    <div className="px-6 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Contacts</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{rows.length} total</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
          <Plus className="h-4 w-4" />Add Contact
        </button>
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts…" className="mb-5 w-72 rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50" />

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Name", "Company", "Title", "Email", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-600">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-600">No contacts found.</td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="group hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-zinc-200">{c.first_name} {c.last_name}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{c.companies?.name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{c.title ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{c.email ?? "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(c.id)} className="rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-100">{editId ? "Edit Contact" : "Add Contact"}</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {TEXT_FIELDS.map(([label, key, inputType]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
                  <input type={inputType} value={(form[key] as string) ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value || null }))} className={INPUT} />
                </div>
              ))}

              {/* Company select → company_id */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Company</label>
                <select value={form.company_id ?? ""} onChange={(e) => setForm((f) => ({ ...f, company_id: e.target.value || null }))} className={`${INPUT} cursor-pointer`}>
                  <option value="">— None —</option>
                  {companies.map((co) => <option key={co.id} value={co.id}>{co.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Market</label>
                <div className="flex gap-2">
                  <select value={form.market ?? ""} onChange={(e) => setForm((f) => ({ ...f, market: (e.target.value || null) as ContactForm["market"] }))} className={`${INPUT} cursor-pointer`}>
                    <option value="">— Unknown —</option>
                    <option value="US">US</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                    <option value="UAE">UAE</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, market: suggestMarket({ city: f.city, email: f.email, linkedin_url: f.linkedin_url }) }))}
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Type (required) */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Contact Type *</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={`${INPUT} cursor-pointer`}>
                  <option value="unknown">Unknown</option>
                  <option value="buyer">Buyer</option>
                  <option value="decision_maker">Decision Maker</option>
                  <option value="influencer">Influencer</option>
                  <option value="partner">Partner</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
                <select value={form.status ?? "new"} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={`${INPUT} cursor-pointer`}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="queued">Queued</option>
                  <option value="replied">Replied</option>
                  <option value="meeting_set">Meeting Set</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="not_fit">Not a Fit</option>
                  <option value="opted_out">Opted Out</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              {/* Personalization */}
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Personalization</p>
                <div className="space-y-4">
                  {PERSONALIZATION.map(([label, key, placeholder]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
                      <textarea rows={2} placeholder={placeholder} value={(form[key] as string) ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value || null }))} className={`${INPUT} resize-none`} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Notes</label>
                <textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value || null }))} className={`${INPUT} resize-none`} />
              </div>

              {error && <p className="flex items-center gap-1.5 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" />{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800">
              <button onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-4 py-2 text-sm font-semibold text-white transition-colors">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Delete contact?</h3>
            <p className="text-sm text-zinc-500 mb-5">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={del} className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
