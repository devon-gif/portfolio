"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Download, LogOut, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  clientDecide,
  downloadApprovedAsset,
  listOrganizations,
  listProperties,
  listReviewItems,
  subscribeToChanges,
  type ClientDecision,
  type OrganizationRecord,
  type PropertyRecord,
  type ReviewItemRecord,
  type ReviewStatus,
} from "@/lib/review";
import ChatPanel from "./ChatPanel";
import MediaPreview from "./MediaPreview";

const LOGO = "/review/valencia-hotel-collection-logo.jpeg";
const filters: Array<"All" | ReviewStatus> = ["All", "Awaiting review", "Revision requested", "New direction requested", "Approved"];

function glass(extra = "") {
  return `rounded-3xl border border-white/70 bg-[#fffaf2]/70 shadow-[0_24px_80px_rgba(79,60,47,.10)] backdrop-blur-2xl ${extra}`;
}

function badge(status: ReviewStatus) {
  const tone = status === "Approved" ? "bg-[#e7dec2] text-[#6d541d]" : status.includes("requested") ? "bg-[#ead9d5] text-[#773b45]" : "bg-[#e9e2f0] text-[#5b4770]";
  return <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${tone}`}>{status}</span>;
}

export default function SimpleClientReview() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [items, setItems] = useState<ReviewItemRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | ReviewStatus>("All");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState<Record<string, string>>({});

  const refresh = useCallback(() => {
    listReviewItems({ organizationId: organizationId || undefined, forClient: true }).then(setItems).catch(console.error);
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
    awaiting: items.filter((i) => i.status === "Awaiting review").length,
    changes: items.filter((i) => i.status.includes("requested")).length,
    approved: items.filter((i) => i.status === "Approved").length,
  };

  async function decide(item: ReviewItemRecord, decision: ClientDecision) {
    const note = (feedback[item.id] || "").trim();
    if (decision !== "Approved" && !note) { setNotice((n) => ({ ...n, [item.id]: "Please add feedback before requesting a change." })); return; }
    if (busy[item.id]) return;
    setBusy((b) => ({ ...b, [item.id]: true }));
    setNotice((n) => ({ ...n, [item.id]: "Saving your decision…" }));
    try {
      await clientDecide(item.id, decision, note);
      refresh();
      if (decision === "Approved") {
        setNotice((n) => ({ ...n, [item.id]: "Approved and ready to share. Preparing the download…" }));
        try { await downloadApprovedAsset(item); setNotice((n) => ({ ...n, [item.id]: "Approved and ready to share. Download started." })); }
        catch { setNotice((n) => ({ ...n, [item.id]: "Your approval was saved, but the automatic download could not start. Use the download button below." })); }
      } else {
        setNotice((n) => ({ ...n, [item.id]: "Your feedback was sent to Devon." }));
      }
    } catch (error) { console.error(error); setNotice((n) => ({ ...n, [item.id]: "Your decision could not be saved. Please try again." })); }
    finally { setBusy((b) => ({ ...b, [item.id]: false })); }
  }

  async function download(item: ReviewItemRecord) {
    if (busy[item.id]) return;
    setBusy((b) => ({ ...b, [item.id]: true })); setNotice((n) => ({ ...n, [item.id]: "Preparing download…" }));
    try { await downloadApprovedAsset(item); setNotice((n) => ({ ...n, [item.id]: "Download started." })); }
    catch { setNotice((n) => ({ ...n, [item.id]: "The download could not start. Please try again." })); }
    finally { setBusy((b) => ({ ...b, [item.id]: false })); }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_75%_0%,rgba(169,129,47,.15),transparent_34%),radial-gradient(circle_at_8%_90%,rgba(216,189,184,.2),transparent_40%),#f8f3ea] text-[#2b241f]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/60 bg-[#fffaf2]/75 px-5 py-4 backdrop-blur-2xl md:px-10">
        <div className="flex items-center gap-3"><img src={LOGO} alt="Valencia Hotel Collection" className="h-9 rounded-lg" /><div><h1 className="font-serif text-xl">Archer Review</h1><p className="text-xs uppercase tracking-[.12em] text-[#817668]">Valencia Hotel Group</p></div></div>
        <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><strong className="block text-sm">Emma Stinson</strong><span className="text-xs text-[#817668]">Client approver</span></div><button type="button" onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb8] bg-white/60 px-4 py-2 text-xs font-semibold"><LogOut className="h-4 w-4" /> Sign out</button></div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
        <section className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#a9812f]">Private creative workspace</p><h2 className="mt-2 font-serif text-4xl md:text-6xl">Creative review queue</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6d6155]">Review each asset, approve it, request a specific revision, or ask Devon to explore a completely new direction.</p></div>
          <div className="grid grid-cols-3 gap-2">{Object.entries(counts).map(([key, value]) => <div key={key} className={glass("min-w-24 p-4 text-center")}><strong className="block text-2xl">{value}</strong><span className="text-[10px] uppercase text-[#817668]">{key}</span></div>)}</div>
        </section>

        <section className="flex flex-wrap gap-2">
          {filters.map((s) => <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full px-4 py-2 text-xs font-semibold ${statusFilter === s ? "bg-[#a9812f] text-white" : "border border-[#d9cbb8] bg-white/55"}`}>{s}</button>)}
          <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="rounded-full border border-[#d9cbb8] bg-white/70 px-4 py-2 text-xs"><option value="All">All properties</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <button onClick={refresh} className="ml-auto inline-flex items-center gap-1 rounded-full border border-[#d9cbb8] bg-white/60 px-4 py-2 text-xs"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button>
        </section>

        <section className="space-y-6">
          {visible.map((item) => (
            <article key={item.id} className={glass("overflow-hidden")}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3d8ca] px-5 py-4"><div><h3 className="font-serif text-2xl">{item.title}</h3><p className="text-xs text-[#817668]">{item.property} · Version {item.version}</p></div>{badge(item.status)}</div>
              <div className="bg-[#151411]"><MediaPreview kind={item.kind} assetSource={item.assetSource} assetRef={item.assetRef} title={item.title} /></div>
              <div className="grid gap-5 p-5 md:grid-cols-[1fr_360px] md:p-7">
                <div className="space-y-4">
                  <dl className="grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#a9812f]">Property</dt><dd className="mt-1">{item.property}</dd></div><div><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#a9812f]">Asset</dt><dd className="mt-1 capitalize">{item.kind}</dd></div><div><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#a9812f]">Version</dt><dd className="mt-1">V{item.version}</dd></div></dl>
                  {item.description && <p className="text-sm leading-relaxed text-[#6d6155]">{item.description}</p>}
                  <details className="text-sm"><summary className="cursor-pointer font-semibold">Version history</summary><div className="mt-3 space-y-2">{[...item.history].reverse().map((h) => <div key={h.id} className="rounded-xl bg-white/55 p-3 text-xs"><strong>{h.by}</strong>: {h.message}<time className="mt-1 block text-[#817668]">{new Date(h.createdAt).toLocaleString()}</time></div>)}</div></details>
                </div>

                <aside className="rounded-2xl border border-white/80 bg-[#fbf5ed]/80 p-4 shadow-inner">
                  {item.status === "Approved" ? <><div className="rounded-2xl bg-[#eee5cf] p-4"><div className="flex items-center gap-2 text-[#6d541d]"><Check className="h-5 w-5" /><strong>Approved and ready to share</strong></div>{item.decisionAt && <p className="mt-2 text-xs text-[#817668]">By Emma · {new Date(item.decisionAt).toLocaleString()}</p>}</div><button disabled={busy[item.id]} onClick={() => download(item)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#b89955] bg-white/70 px-4 py-3 font-semibold text-[#72571d] disabled:opacity-50"><Download className="h-4 w-4" /> {busy[item.id] ? "Preparing download…" : "Download approved asset"}</button></> : <><label className="text-sm font-medium">Feedback for Devon<textarea value={feedback[item.id] || ""} onChange={(e) => setFeedback((f) => ({ ...f, [item.id]: e.target.value }))} placeholder="Only required when requesting a revision or a new direction." className="mt-2 min-h-28 w-full rounded-xl border border-[#d9cbb8] bg-white/80 px-3 py-3 text-sm outline-none focus:border-[#a9812f]" /></label><div className="mt-4 grid gap-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3"><button disabled={busy[item.id]} onClick={() => decide(item, "Approved")} className="rounded-xl bg-[#b89955] px-3 py-3 text-sm font-semibold text-white disabled:opacity-50">Approve</button><button disabled={busy[item.id]} onClick={() => decide(item, "Revision requested")} className="rounded-xl bg-[#d4ad69] px-3 py-3 text-sm font-semibold text-[#3d2c16] disabled:opacity-50">Request revision</button><button disabled={busy[item.id]} onClick={() => decide(item, "New direction requested")} className="rounded-xl border border-[#b57883] bg-[#f1dfdf] px-3 py-3 text-sm font-semibold text-[#773b45] disabled:opacity-50">New direction</button></div></>}
                  {notice[item.id] && <p aria-live="polite" className="mt-3 text-center text-xs leading-relaxed text-[#817668]">{notice[item.id]}</p>}
                </aside>
              </div>
            </article>
          ))}
          {visible.length === 0 && <div className={glass("p-12 text-center text-[#817668]")}>There are no review items in this view.</div>}
        </section>
      </main>
      <ChatPanel currentUser="Emma" organizationId={organizationId || undefined} />
    </div>
  );
}
