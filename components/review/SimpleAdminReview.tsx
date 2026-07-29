"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Archive, Download, LogOut, RefreshCw, Send, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  archiveItem,
  createDraftItem,
  downloadApprovedAsset,
  listOrganizations,
  listProperties,
  listReviewItems,
  sendToReview,
  subscribeToChanges,
  uploadNewVersion,
  type OrganizationRecord,
  type PropertyRecord,
  type ReviewItemRecord,
  type ReviewStatus,
} from "@/lib/review";
import ChatPanel from "./ChatPanel";
import MediaDropzone from "./MediaDropzone";
import MediaPreview from "./MediaPreview";

const LOGO = "/review/valencia-hotel-collection-logo.jpeg";
const statuses: Array<"All" | ReviewStatus> = ["All", "Draft", "Awaiting review", "Revision requested", "New direction requested", "Approved", "Archived"];

function glass(extra = "") {
  // Keep the glass look without stacking large backdrop-filter layers.
  // Firefox can become unresponsive when several blurred surfaces are
  // mounted together, which previously crashed the admin tab as soon as
  // the dashboard replaced the lightweight login screen.
  return `rounded-3xl border border-white/80 bg-[#fffaf2]/95 shadow-[0_24px_80px_rgba(79,60,47,.10)] ${extra}`;
}

function badge(status: ReviewStatus) {
  const tone = status === "Approved" ? "bg-[#e7dec2] text-[#6d541d]" : status.includes("requested") ? "bg-[#ead9d5] text-[#773b45]" : status === "Draft" ? "bg-[#e8e3dc] text-[#645d55]" : "bg-[#e9e2f0] text-[#5b4770]";
  return <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${tone}`}>{status}</span>;
}

export default function SimpleAdminReview() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [items, setItems] = useState<ReviewItemRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | ReviewStatus>("All");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ propertyId: "", title: "", description: "", dueDate: "" });
  const [busy, setBusy] = useState(false);
  const [replacement, setReplacement] = useState<Record<string, File | null>>({});
  const [replacementNote, setReplacementNote] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Record<string, string>>({});

  const refresh = useCallback(() => {
    listReviewItems({ organizationId: organizationId || undefined }).then(setItems).catch(console.error);
  }, [organizationId]);

  useEffect(() => {
    listOrganizations().then((rows) => { setOrganizations(rows); setOrganizationId(rows[0]?.id || ""); }).catch(console.error);
  }, []);
  useEffect(() => {
    if (!organizationId) return;
    listProperties(organizationId).then(setProperties).catch(console.error);
    refresh();
    return subscribeToChanges(organizationId, refresh);
  }, [organizationId, refresh]);

  const visible = useMemo(() => items.filter((item) => (statusFilter === "All" || item.status === statusFilter) && (propertyFilter === "All" || item.propertyId === propertyFilter)), [items, propertyFilter, statusFilter]);
  const counts = {
    draft: items.filter((i) => i.status === "Draft").length,
    awaiting: items.filter((i) => i.status === "Awaiting review").length,
    changes: items.filter((i) => i.status.includes("requested")).length,
    approved: items.filter((i) => i.status === "Approved").length,
  };

  async function create(event: FormEvent) {
    event.preventDefault();
    const property = properties.find((p) => p.id === form.propertyId);
    if (!file || !property || !form.title.trim()) { window.alert("Choose a property, title, and image or video."); return; }
    setBusy(true);
    try {
      await createDraftItem({ organizationId, propertyId: property.id, property: property.name, title: form.title.trim(), description: form.description.trim(), dueDate: form.dueDate, file });
      setForm({ propertyId: "", title: "", description: "", dueDate: "" }); setFile(null); refresh();
    } catch (error) { console.error(error); window.alert("The item could not be created."); }
    finally { setBusy(false); }
  }

  async function act(itemId: string, action: () => Promise<void>) {
    setNotice((n) => ({ ...n, [itemId]: "Working…" }));
    try { await action(); setNotice((n) => ({ ...n, [itemId]: "Saved." })); refresh(); }
    catch (error) { console.error(error); setNotice((n) => ({ ...n, [itemId]: "That action could not be completed." })); }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_75%_0%,rgba(169,129,47,.15),transparent_34%),radial-gradient(circle_at_8%_90%,rgba(216,189,184,.18),transparent_40%),#f8f3ea] text-[#2b241f]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/70 bg-[#fffaf2]/95 px-5 py-4 shadow-[0_8px_28px_rgba(79,60,47,.06)] md:px-10">
        <div className="flex items-center gap-3"><img src={LOGO} alt="Valencia Hotel Collection" className="h-9 rounded-lg" /><div><h1 className="font-serif text-xl">Archer Review Admin</h1><p className="text-xs text-[#817668]">Valencia Hotel Group creative workflow</p></div></div>
        <button type="button" onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb8] bg-white/60 px-4 py-2 text-xs font-semibold"><LogOut className="h-4 w-4" /> Sign out</button>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
        <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#a9812f]">Private operations workspace</p><h2 className="mt-2 font-serif text-4xl md:text-5xl">Upload, review, revise, approve.</h2></div>
          <div className="grid grid-cols-4 gap-2">{Object.entries(counts).map(([key, value]) => <div key={key} className={glass("min-w-20 p-3 text-center")}><strong className="block text-xl">{value}</strong><span className="text-[10px] uppercase text-[#817668]">{key}</span></div>)}</div>
        </section>

        <form onSubmit={create} className={glass("grid gap-5 p-5 md:grid-cols-2 md:p-7")}>
          <div className="md:col-span-2 flex items-center gap-2"><UploadCloud className="h-5 w-5 text-[#a9812f]" /><h3 className="font-serif text-2xl">Create a review item</h3></div>
          <label className="text-sm">Organization<select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} className="mt-1 w-full rounded-xl border border-[#d9cbb8] bg-white/70 px-3 py-3">{organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
          <label className="text-sm">Property<select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} className="mt-1 w-full rounded-xl border border-[#d9cbb8] bg-white/70 px-3 py-3"><option value="">Choose property</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <label className="text-sm">Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-xl border border-[#d9cbb8] bg-white/70 px-3 py-3" placeholder="Summer rooftop motion" /></label>
          <label className="text-sm">Optional due date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="mt-1 w-full rounded-xl border border-[#d9cbb8] bg-white/70 px-3 py-3" /></label>
          <label className="text-sm md:col-span-2">Notes<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 min-h-24 w-full rounded-xl border border-[#d9cbb8] bg-white/70 px-3 py-3" /></label>
          <div className="md:col-span-2"><MediaDropzone file={file} onFileChange={setFile} /></div>
          <button disabled={busy} className="md:col-span-2 rounded-full bg-[#2b241f] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Uploading…" : "Save draft"}</button>
        </form>

        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">{statuses.map((s) => <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full px-4 py-2 text-xs font-semibold ${statusFilter === s ? "bg-[#a9812f] text-white" : "border border-[#d9cbb8] bg-white/55"}`}>{s}</button>)}<select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="rounded-full border border-[#d9cbb8] bg-white/70 px-4 py-2 text-xs"><option value="All">All properties</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select><button onClick={refresh} className="ml-auto inline-flex items-center gap-1 rounded-full border border-[#d9cbb8] bg-white/60 px-4 py-2 text-xs"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button></div>

          {visible.map((item) => (
            <article key={item.id} className={glass("overflow-hidden")}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3d8ca] px-5 py-4"><div><h3 className="font-serif text-2xl">{item.title}</h3><p className="text-xs text-[#817668]">{item.property} · V{item.version} · {item.kind}</p></div>{badge(item.status)}</div>
              <div className="grid md:grid-cols-[minmax(0,1.7fr)_minmax(280px,.7fr)]">
                <div className="bg-[#151411]"><MediaPreview kind={item.kind} assetSource={item.assetSource} assetRef={item.assetRef} title={item.title} /></div>
                <aside className="space-y-4 p-5">
                  {item.clientFeedback && <div className="rounded-2xl bg-[#f2e8e1] p-4"><strong className="text-sm">Emma’s feedback</strong><p className="mt-2 text-sm leading-relaxed text-[#6d6155]">{item.clientFeedback}</p></div>}
                  {item.status === "Draft" && <button onClick={() => act(item.id, () => sendToReview(item.id))} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#a9812f] px-4 py-3 font-semibold text-white"><Send className="h-4 w-4" /> Send to Emma</button>}
                  {(item.status === "Revision requested" || item.status === "New direction requested") && <><MediaDropzone compact file={replacement[item.id] || null} onFileChange={(next) => setReplacement((r) => ({ ...r, [item.id]: next }))} /><textarea value={replacementNote[item.id] || ""} onChange={(e) => setReplacementNote((r) => ({ ...r, [item.id]: e.target.value }))} placeholder="What changed?" className="min-h-20 w-full rounded-xl border border-[#d9cbb8] bg-white/70 px-3 py-2 text-sm" /><button onClick={() => { const next = replacement[item.id]; if (!next) return window.alert("Choose the revised file first."); act(item.id, () => uploadNewVersion(item.id, next, replacementNote[item.id] || "", { organizationId: item.organizationId, propertyId: item.propertyId, nextVersion: item.version + 1 })); }} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#a9812f] px-4 py-3 font-semibold text-white"><UploadCloud className="h-4 w-4" /> Submit new version</button></>}
                  {item.status === "Approved" && <><button onClick={() => act(item.id, () => downloadApprovedAsset(item))} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#b89955] bg-[#f6edda] px-4 py-3 font-semibold text-[#72571d]"><Download className="h-4 w-4" /> Download approved asset</button><button onClick={() => act(item.id, () => archiveItem(item.id))} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d9cbb8] bg-white/60 px-4 py-3 text-sm font-semibold"><Archive className="h-4 w-4" /> Archive</button></>}
                  {notice[item.id] && <p className="text-center text-xs text-[#817668]">{notice[item.id]}</p>}
                  <details className="text-sm"><summary className="cursor-pointer font-semibold">Version history</summary><div className="mt-3 space-y-2">{[...item.history].reverse().map((h) => <div key={h.id} className="rounded-xl bg-white/55 p-3 text-xs"><strong>{h.by}</strong>: {h.message}<time className="mt-1 block text-[#817668]">{new Date(h.createdAt).toLocaleString()}</time></div>)}</div></details>
                </aside>
              </div>
            </article>
          ))}
          {visible.length === 0 && <div className={glass("p-12 text-center text-[#817668]")}>No creative items match this view.</div>}
        </section>
      </main>
      <ChatPanel currentUser="Devon" organizationId={organizationId || undefined} />
    </div>
  );
}
