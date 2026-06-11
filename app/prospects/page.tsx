"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus, RefreshCw, Mail, Search, Calendar, UserPlus,
  MoreHorizontal, CheckCircle, XCircle, AlertTriangle,
  ChevronDown, ExternalLink, MessageSquare, Clock,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import clsx from "clsx";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProspectStatus =
  | "need_contact"
  | "need_email"
  | "ready_to_email"
  | "drafted"
  | "sent"
  | "follow_up_due"
  | "replied"
  | "not_interested"
  | "do_not_contact"
  | "client";

interface ProspectRow {
  // identity
  key: string;
  companyId: string | null;
  contactId: string | null;
  // company fields
  companyName: string;
  website: string | null;
  location: string | null;
  companyType: string | null;
  // contact fields
  contactName: string | null;
  contactTitle: string | null;
  email: string | null;
  emailStatus: string | null;
  source: string | null;
  // status
  status: ProspectStatus;
  lastContactedAt: string | null;
  nextFollowUp: string | null;
  followUpId: string | null;
  notes: string | null;
  // message
  messageId: string | null;
  messageStatus: string | null;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProspectStatus, { label: string; cls: string; dot: string }> = {
  need_contact:    { label: "Need Contact",    cls: "bg-zinc-800 text-zinc-400 ring-zinc-700",            dot: "bg-zinc-500" },
  need_email:      { label: "Need Email",      cls: "bg-amber-500/10 text-amber-400 ring-amber-500/20",   dot: "bg-amber-400" },
  ready_to_email:  { label: "Ready",           cls: "bg-blue-500/10 text-blue-400 ring-blue-500/20",      dot: "bg-blue-400" },
  drafted:         { label: "Drafted",         cls: "bg-violet-500/10 text-violet-400 ring-violet-500/20",dot: "bg-violet-400" },
  sent:            { label: "Sent",            cls: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20", dot: "bg-emerald-400" },
  follow_up_due:   { label: "Follow-up Due",   cls: "bg-orange-500/10 text-orange-400 ring-orange-500/20",dot: "bg-orange-400" },
  replied:         { label: "Replied",         cls: "bg-teal-500/10 text-teal-400 ring-teal-500/20",      dot: "bg-teal-400" },
  not_interested:  { label: "Not Interested",  cls: "bg-zinc-800 text-zinc-500 ring-zinc-700",            dot: "bg-zinc-600" },
  do_not_contact:  { label: "Do Not Contact",  cls: "bg-red-500/10 text-red-400 ring-red-500/20",         dot: "bg-red-400" },
  client:          { label: "Client",          cls: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",dot: "bg-yellow-400" },
};

const STATUS_ORDER: ProspectStatus[] = [
  "follow_up_due", "need_contact", "need_email", "ready_to_email",
  "drafted", "sent", "replied", "not_interested", "do_not_contact", "client",
];

type FilterTab = "all" | ProspectStatus;
const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all",           label: "All" },
  { key: "follow_up_due", label: "Follow-up Due" },
  { key: "need_contact",  label: "Need Contact" },
  { key: "need_email",    label: "Need Email" },
  { key: "ready_to_email",label: "Ready" },
  { key: "drafted",       label: "Drafted" },
  { key: "sent",          label: "Sent" },
  { key: "replied",       label: "Replied" },
  { key: "not_interested",label: "Not Interested" },
  { key: "do_not_contact",label: "Do Not Contact" },
];

// ─── Status derivation ────────────────────────────────────────────────────────

type MsgRow = { id: string; contact_id: string | null; status: string; sent_at: string | null };
type FupRow = { id: string; contact_id: string | null; due_date: string | null; status: string | null };

function deriveStatus(
  contact: {
    email?: string | null;
    status?: string | null;
    email_opt_out?: boolean | null;
    replied_at?: string | null;
  } | null,
  msgs: MsgRow[],
  fups: FupRow[],
): ProspectStatus {
  if (!contact) return "need_contact";

  const s = (contact.status ?? "").toLowerCase();
  if (s === "do_not_contact" || s === "unsubscribed") return "do_not_contact";
  if (s === "won" || s === "client") return "client";
  if (s === "not_interested" || contact.email_opt_out === true) return "not_interested";
  if (contact.replied_at || msgs.some((m) => m.status === "replied")) return "replied";

  const sentMsg = msgs.find((m) => m.status === "sent" || m.status === "approved_for_today");
  if (sentMsg) {
    const pending = fups.find((f) => f.status === "pending" && f.due_date);
    if (pending?.due_date && new Date(pending.due_date) <= new Date()) return "follow_up_due";
    if (pending?.due_date) return "sent";
    return "sent";
  }

  const draftMsg = msgs.find((m) =>
    ["draft", "needs_review", "approved", "scheduled", "sending"].includes(m.status),
  );
  if (draftMsg) return "drafted";

  if (!contact.email) return "need_email";
  return "ready_to_email";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtDomain(url: string | null) {
  if (!url) return null;
  try {
    const raw = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(raw).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// ─── SlideOver shell ──────────────────────────────────────────────────────────

function SlideOver({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-zinc-500 hover:text-zinc-300">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">{children}</div>
        {footer && <div className="border-t border-zinc-800 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500 resize-none"
    />
  );
}

function Btn({ onClick, disabled, children, variant = "primary", size = "sm" }: {
  onClick?: () => void; disabled?: boolean; children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger"; size?: "sm" | "xs";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50",
        size === "sm" ? "px-3 py-2 text-sm" : "px-2.5 py-1.5 text-xs",
        variant === "primary" && "bg-emerald-500 text-zinc-950 hover:bg-emerald-400",
        variant === "secondary" && "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
        variant === "danger" && "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
      )}
    >
      {children}
    </button>
  );
}

// ─── Action menu ──────────────────────────────────────────────────────────────

function ActionMenu({ row, onAction, busy }: {
  row: ProspectRow;
  onAction: (action: string, row: ProspectRow) => void;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);

  const actions: { label: string; action: string; icon?: React.ReactNode; danger?: boolean; disabled?: boolean }[] = [];

  if (!row.contactId) {
    actions.push({ label: "Add contact", action: "add_contact", icon: <UserPlus className="h-3.5 w-3.5" /> });
  } else {
    if (row.status === "need_email") {
      actions.push({ label: "Find/verify email (Hunter)", action: "hunter", icon: <Search className="h-3.5 w-3.5" /> });
      actions.push({ label: "Set email manually", action: "set_email", icon: <Mail className="h-3.5 w-3.5" /> });
    }
    if (row.status === "ready_to_email" || row.status === "need_email") {
      if (row.email) {
        actions.push({ label: "Draft email", action: "draft", icon: <Mail className="h-3.5 w-3.5" /> });
        actions.push({ label: "Find/verify email (Hunter)", action: "hunter", icon: <Search className="h-3.5 w-3.5" /> });
      }
    }
    if (row.status === "drafted" && row.messageId) {
      actions.push({ label: "View draft", action: "view_draft", icon: <ExternalLink className="h-3.5 w-3.5" /> });
    }
    if (row.status === "sent" || row.status === "follow_up_due" || row.status === "replied") {
      actions.push({ label: "Schedule follow-up", action: "schedule_followup", icon: <Calendar className="h-3.5 w-3.5" /> });
      actions.push({ label: "Mark replied", action: "mark_replied", icon: <CheckCircle className="h-3.5 w-3.5" /> });
    }
    if (!["do_not_contact", "not_interested", "client"].includes(row.status)) {
      actions.push({ label: "Add note", action: "add_note", icon: <MessageSquare className="h-3.5 w-3.5" /> });
      actions.push({ label: "Schedule follow-up", action: "schedule_followup", icon: <Calendar className="h-3.5 w-3.5" /> });
    }
    if (!["do_not_contact", "not_interested"].includes(row.status)) {
      actions.push({ label: "Mark not interested", action: "mark_not_interested", danger: true });
      actions.push({ label: "Mark do not contact", action: "mark_dnc", danger: true });
    }
  }

  if (actions.length === 0) {
    actions.push({ label: "Add note", action: "add_note" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen((o) => !o)}
        className="rounded p-1.5 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-40"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-zinc-700 bg-zinc-900 py-1 shadow-xl">
            {actions.map((a) => (
              <button
                key={a.action}
                type="button"
                disabled={a.disabled}
                onClick={() => { setOpen(false); onAction(a.action, row); }}
                className={clsx(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors disabled:opacity-40",
                  a.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-zinc-300 hover:bg-zinc-800",
                )}
              >
                {a.icon && <span className="text-zinc-500">{a.icon}</span>}
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProspectsPage() {
  const [rows, setRows] = useState<ProspectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [note, setNote] = useState<{ text: string; type: "info" | "error" } | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  // SlideOver state
  type SlideOverType = "add_prospect" | "add_contact" | "add_note" | "schedule_followup" | "set_email" | null;
  const [slideOver, setSlideOver] = useState<SlideOverType>(null);
  const [activeRow, setActiveRow] = useState<ProspectRow | null>(null);

  // Add Prospect form
  const [apName, setApName] = useState("");
  const [apWebsite, setApWebsite] = useState("");
  const [apLocation, setApLocation] = useState("");
  const [apType, setApType] = useState("");

  // Add Contact form
  const [acFirst, setAcFirst] = useState("");
  const [acLast, setAcLast] = useState("");
  const [acTitle, setAcTitle] = useState("");
  const [acEmail, setAcEmail] = useState("");
  const [acLinkedin, setAcLinkedin] = useState("");

  // Note form
  const [noteText, setNoteText] = useState("");

  // Follow-up form
  const [fupDate, setFupDate] = useState("");
  const [fupNote, setFupNote] = useState("");

  // Email form
  const [emailVal, setEmailVal] = useState("");

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: companies },
        { data: contacts },
        { data: messages },
        { data: followups },
      ] = await Promise.all([
        supabase.from("companies").select("id, name, website, location, company_type, notes").order("name"),
        supabase.from("contacts").select(
          "id, company_id, first_name, last_name, title, email, email_verification_status, email_opt_out, replied_at, source, status, notes, last_contacted_at, companies(name)"
        ).order("created_at", { ascending: false }),
        supabase.from("messages").select("id, contact_id, status, sent_at"),
        supabase.from("followups").select("id, contact_id, due_date, status").eq("status", "pending"),
      ]);

      const msgs: MsgRow[] = (messages ?? []) as MsgRow[];
      const fups: FupRow[] = (followups ?? []) as FupRow[];

      const contactsByCompany = new Map<string, typeof contacts>();
      const contactsWithNoCompany: typeof contacts = [];

      for (const c of contacts ?? []) {
        if (c.company_id) {
          const arr = contactsByCompany.get(c.company_id) ?? [];
          arr.push(c);
          contactsByCompany.set(c.company_id, arr);
        } else {
          contactsWithNoCompany.push(c);
        }
      }

      const built: ProspectRow[] = [];

      // Companies
      for (const co of companies ?? []) {
        const coContacts = contactsByCompany.get(co.id) ?? [];
        if (coContacts.length === 0) {
          built.push({
            key: `co-${co.id}`,
            companyId: co.id,
            contactId: null,
            companyName: co.name,
            website: co.website ?? null,
            location: co.location ?? null,
            companyType: co.company_type ?? null,
            contactName: null,
            contactTitle: null,
            email: null,
            emailStatus: null,
            source: null,
            status: "need_contact",
            lastContactedAt: null,
            nextFollowUp: null,
            followUpId: null,
            notes: co.notes ?? null,
            messageId: null,
            messageStatus: null,
          });
        } else {
          for (const ct of coContacts) {
            const cMsgs = msgs.filter((m) => m.contact_id === ct.id);
            const cFups = fups.filter((f) => f.contact_id === ct.id);
            const status = deriveStatus(ct, cMsgs, cFups);
            const latestMsg = cMsgs.find((m) =>
              ["draft", "needs_review", "approved", "scheduled", "sent", "approved_for_today", "sending"].includes(m.status),
            ) ?? cMsgs[0] ?? null;
            const pendingFup = cFups.find((f) => f.status === "pending") ?? null;

            built.push({
              key: `ct-${ct.id}`,
              companyId: co.id,
              contactId: ct.id,
              companyName: co.name,
              website: co.website ?? null,
              location: co.location ?? null,
              companyType: co.company_type ?? null,
              contactName: `${ct.first_name} ${ct.last_name}`.trim(),
              contactTitle: ct.title ?? null,
              email: ct.email ?? null,
              emailStatus: ct.email_verification_status ?? null,
              source: ct.source ?? null,
              status,
              lastContactedAt: ct.last_contacted_at ?? null,
              nextFollowUp: pendingFup?.due_date ?? null,
              followUpId: pendingFup?.id ?? null,
              notes: ct.notes ?? null,
              messageId: latestMsg?.id ?? null,
              messageStatus: latestMsg?.status ?? null,
            });
          }
        }
      }

      // Contacts with no company
      for (const ct of contactsWithNoCompany) {
        const cMsgs = msgs.filter((m) => m.contact_id === ct.id);
        const cFups = fups.filter((f) => f.contact_id === ct.id);
        const status = deriveStatus(ct, cMsgs, cFups);
        const latestMsg = cMsgs[0] ?? null;
        const pendingFup = cFups[0] ?? null;
        const coName = (ct.companies as { name?: string } | null)?.name ?? "(No company)";

        built.push({
          key: `ct-${ct.id}`,
          companyId: null,
          contactId: ct.id,
          companyName: coName,
          website: null,
          location: null,
          companyType: null,
          contactName: `${ct.first_name} ${ct.last_name}`.trim(),
          contactTitle: ct.title ?? null,
          email: ct.email ?? null,
          emailStatus: ct.email_verification_status ?? null,
          source: ct.source ?? null,
          status,
          lastContactedAt: ct.last_contacted_at ?? null,
          nextFollowUp: pendingFup?.due_date ?? null,
          followUpId: pendingFup?.id ?? null,
          notes: ct.notes ?? null,
          messageId: latestMsg?.id ?? null,
          messageStatus: latestMsg?.status ?? null,
        });
      }

      // Sort by status priority
      built.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
      setRows(built);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Counts ──────────────────────────────────────────────────────────────────

  const counts = useMemo(() => {
    const c: Partial<Record<ProspectStatus, number>> = {};
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  // ── Filtered + searched rows ─────────────────────────────────────────────────

  const visible = useMemo(() => {
    let r = filter === "all" ? rows : rows.filter((x) => x.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((x) =>
        x.companyName.toLowerCase().includes(q) ||
        (x.contactName ?? "").toLowerCase().includes(q) ||
        (x.email ?? "").toLowerCase().includes(q),
      );
    }
    return r;
  }, [rows, filter, search]);

  // ── Action handler ───────────────────────────────────────────────────────────

  function setBusy(key: string, on: boolean) {
    setBusyIds((prev) => {
      const next = new Set(prev);
      on ? next.add(key) : next.delete(key);
      return next;
    });
  }

  function showNote(text: string, type: "info" | "error" = "info") {
    setNote({ text, type });
    setTimeout(() => setNote(null), 5000);
  }

  function openSlide(type: SlideOverType, row: ProspectRow | null = null) {
    setActiveRow(row);
    setSlideOver(type);
    // reset forms
    setNoteText(row?.notes ?? "");
    setFupDate("");
    setFupNote("");
    setEmailVal(row?.email ?? "");
    setAcFirst(""); setAcLast(""); setAcTitle(""); setAcEmail(""); setAcLinkedin("");
  }

  async function handleAction(action: string, row: ProspectRow) {
    if (action === "add_contact") { openSlide("add_contact", row); return; }
    if (action === "add_note") { openSlide("add_note", row); return; }
    if (action === "schedule_followup") { openSlide("schedule_followup", row); return; }
    if (action === "set_email") { openSlide("set_email", row); return; }
    if (action === "view_draft") { window.open("/messages", "_blank"); return; }

    if (action === "draft") {
      setBusy(row.key, true);
      try {
        const res = await fetch("/api/prospects/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact_id: row.contactId }),
        });
        const data = await res.json();
        if (data.ok) {
          showNote("Draft created. Review it in Messages.");
          await loadAll();
        } else {
          showNote(data.error ?? "Draft failed.", "error");
        }
      } catch {
        showNote("Network error creating draft.", "error");
      } finally {
        setBusy(row.key, false);
      }
      return;
    }

    if (action === "hunter") {
      if (!row.contactId) return;
      setBusy(row.key, true);
      try {
        const res = await fetch("/api/prospects/hunter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact_id: row.contactId }),
        });
        const data = await res.json();
        if (data.ok) {
          const msg = data.email
            ? `Found: ${data.email} (${data.email_verification_status})`
            : "Hunter found no email for this contact.";
          showNote(msg);
          await loadAll();
        } else {
          showNote(data.error ?? "Hunter lookup failed.", "error");
        }
      } catch {
        showNote("Network error.", "error");
      } finally {
        setBusy(row.key, false);
      }
      return;
    }

    if (action === "mark_replied") {
      if (!row.contactId) return;
      setBusy(row.key, true);
      const { error } = await supabase
        .from("contacts")
        .update({ replied_at: new Date().toISOString(), status: "replied" })
        .eq("id", row.contactId);
      setBusy(row.key, false);
      if (error) showNote(error.message, "error");
      else { showNote("Marked replied."); await loadAll(); }
      return;
    }

    if (action === "mark_not_interested") {
      if (!row.contactId) return;
      setBusy(row.key, true);
      const { error } = await supabase
        .from("contacts")
        .update({ status: "not_interested" })
        .eq("id", row.contactId);
      setBusy(row.key, false);
      if (error) showNote(error.message, "error");
      else { showNote("Marked not interested."); await loadAll(); }
      return;
    }

    if (action === "mark_dnc") {
      if (!row.contactId) return;
      setBusy(row.key, true);
      const { error } = await supabase
        .from("contacts")
        .update({ status: "do_not_contact" })
        .eq("id", row.contactId);
      setBusy(row.key, false);
      if (error) showNote(error.message, "error");
      else { showNote("Marked do not contact."); await loadAll(); }
      return;
    }
  }

  // ── SlideOver submit handlers ────────────────────────────────────────────────

  async function submitAddProspect() {
    if (!apName.trim()) return;
    const { error } = await supabase.from("companies").insert({
      name: apName.trim(),
      website: apWebsite.trim() || null,
      location: apLocation.trim() || null,
      company_type: apType.trim() || null,
    });
    if (error) { showNote(error.message, "error"); return; }
    setSlideOver(null);
    setApName(""); setApWebsite(""); setApLocation(""); setApType("");
    showNote("Prospect added.");
    await loadAll();
  }

  async function submitAddContact() {
    if (!acFirst.trim() || !acLast.trim()) return;
    const { error } = await supabase.from("contacts").insert({
      company_id: activeRow?.companyId ?? null,
      first_name: acFirst.trim(),
      last_name: acLast.trim(),
      title: acTitle.trim() || null,
      email: acEmail.trim() || null,
      linkedin_url: acLinkedin.trim() || null,
      status: "new",
    });
    if (error) { showNote(error.message, "error"); return; }
    setSlideOver(null);
    showNote("Contact added.");
    await loadAll();
  }

  async function submitAddNote() {
    if (!activeRow?.contactId) return;
    const { error } = await supabase
      .from("contacts")
      .update({ notes: noteText })
      .eq("id", activeRow.contactId);
    if (error) { showNote(error.message, "error"); return; }
    setSlideOver(null);
    showNote("Note saved.");
    await loadAll();
  }

  async function submitScheduleFollowUp() {
    if (!activeRow?.contactId || !fupDate) return;
    const { error } = await supabase.from("followups").insert({
      contact_id: activeRow.contactId,
      due_date: fupDate,
      notes: fupNote.trim() || null,
      status: "pending",
    });
    if (error) { showNote(error.message, "error"); return; }
    setSlideOver(null);
    showNote("Follow-up scheduled.");
    await loadAll();
  }

  async function submitSetEmail() {
    if (!activeRow?.contactId || !emailVal.trim()) return;
    const { error } = await supabase
      .from("contacts")
      .update({ email: emailVal.trim() })
      .eq("id", activeRow.contactId);
    if (error) { showNote(error.message, "error"); return; }
    setSlideOver(null);
    showNote("Email saved.");
    await loadAll();
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 py-6 max-w-full">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Prospects</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {rows.length} total · {counts.follow_up_due ?? 0} follow-ups due · {counts.ready_to_email ?? 0} ready to email
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadAll}
            disabled={loading}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-zinc-400 hover:text-zinc-200 disabled:opacity-40"
          >
            <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
          </button>
          <Btn onClick={() => openSlide("add_prospect")} variant="primary">
            <Plus className="h-4 w-4" /> Add Prospect
          </Btn>
        </div>
      </div>

      {/* Toast */}
      {note && (
        <div className={clsx(
          "mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm",
          note.type === "error"
            ? "border border-red-500/30 bg-red-500/10 text-red-400"
            : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        )}>
          {note.type === "error" ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <CheckCircle className="h-4 w-4 shrink-0" />}
          {note.text}
        </div>
      )}

      {/* Search + filters */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact, email..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500"
          />
        </div>
        <Link
          href="/messages"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <MessageSquare className="h-4 w-4" /> Messages
        </Link>
        <Link
          href="/followups"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Clock className="h-4 w-4" /> Follow-ups
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTER_TABS.map(({ key, label }) => {
          const count = key === "all" ? rows.length : (counts[key as ProspectStatus] ?? 0);
          if (key !== "all" && count === 0) return null;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === key
                  ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200",
              )}
            >
              {key !== "all" && (
                <span className={clsx("h-1.5 w-1.5 rounded-full", STATUS_CONFIG[key as ProspectStatus]?.dot)} />
              )}
              {label}
              <span className="tabular-nums opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60">
              {[
                "Company", "Website", "Location", "Type",
                "Contact", "Title", "Email", "Email Status",
                "Status", "Last Contacted", "Follow-up", "Notes", "",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading && (
              <tr>
                <td colSpan={13} className="px-3 py-10 text-center text-sm text-zinc-600">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={13} className="px-3 py-10 text-center text-sm text-zinc-600">
                  {rows.length === 0 ? "No prospects yet. Add one above." : "No matches."}
                </td>
              </tr>
            )}
            {visible.map((row) => {
              const sc = STATUS_CONFIG[row.status];
              const isBusy = busyIds.has(row.key);
              return (
                <tr key={row.key} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="max-w-[150px] truncate px-3 py-2.5 font-medium text-zinc-200">
                    {row.companyName}
                  </td>
                  <td className="px-3 py-2.5 text-zinc-500">
                    {row.website ? (
                      <a
                        href={row.website.startsWith("http") ? row.website : `https://${row.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200"
                      >
                        {fmtDomain(row.website)}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : ""}
                  </td>
                  <td className="max-w-[110px] truncate px-3 py-2.5 text-zinc-500">{row.location ?? ""}</td>
                  <td className="max-w-[120px] truncate px-3 py-2.5 text-zinc-500">
                    {row.companyType?.replace(/_/g, " ") ?? ""}
                  </td>
                  <td className="max-w-[130px] truncate px-3 py-2.5 text-zinc-300">{row.contactName ?? ""}</td>
                  <td className="max-w-[130px] truncate px-3 py-2.5 text-zinc-500">{row.contactTitle ?? ""}</td>
                  <td className="max-w-[180px] truncate px-3 py-2.5 text-zinc-400">
                    {row.email ? (
                      <a href={`mailto:${row.email}`} className="hover:text-zinc-200">{row.email}</a>
                    ) : ""}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.emailStatus && (
                      <span className={clsx(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                        row.emailStatus === "verified" ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" :
                        row.emailStatus === "risky" ? "bg-amber-500/10 text-amber-400 ring-amber-500/20" :
                        row.emailStatus === "invalid" ? "bg-red-500/10 text-red-400 ring-red-500/20" :
                        "bg-zinc-800 text-zinc-500 ring-zinc-700",
                      )}>
                        {row.emailStatus}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={clsx(
                      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                      sc.cls,
                    )}>
                      <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
                      {sc.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-zinc-500">{fmtDate(row.lastContactedAt)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    {row.nextFollowUp && (
                      <span className={clsx(
                        "text-xs",
                        new Date(row.nextFollowUp) <= new Date() ? "font-semibold text-orange-400" : "text-zinc-500",
                      )}>
                        {fmtDate(row.nextFollowUp)}
                      </span>
                    )}
                  </td>
                  <td className="max-w-[140px] truncate px-3 py-2.5 text-xs text-zinc-600">{row.notes ?? ""}</td>
                  <td className="px-2 py-2.5">
                    {isBusy ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-zinc-500" />
                    ) : (
                      <ActionMenu row={row} onAction={handleAction} busy={isBusy} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── SlideOvers ─────────────────────────────────────────────────────── */}

      {/* Add Prospect */}
      <SlideOver
        open={slideOver === "add_prospect"}
        onClose={() => setSlideOver(null)}
        title="Add Prospect"
        footer={
          <Btn onClick={submitAddProspect} disabled={!apName.trim()}>Add Prospect</Btn>
        }
      >
        <Field label="Company name *"><Input value={apName} onChange={setApName} placeholder="The Grand Hotel" /></Field>
        <Field label="Website"><Input value={apWebsite} onChange={setApWebsite} placeholder="thegrandhotel.com" /></Field>
        <Field label="City / market"><Input value={apLocation} onChange={setApLocation} placeholder="Pittsburgh, PA" /></Field>
        <Field label="Type">
          <select
            value={apType}
            onChange={(e) => setApType(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          >
            <option value="">Select type</option>
            <option value="hotel_management_company">Hotel Management Company</option>
            <option value="hospitality_group">Hospitality Group</option>
            <option value="boutique_hotel_group">Boutique Hotel Group</option>
            <option value="independent_lifestyle_hotel">Independent / Lifestyle Hotel</option>
            <option value="resort_group">Resort Group</option>
            <option value="branded_hotel">Branded Hotel</option>
            <option value="restaurant">Restaurant / F&B</option>
            <option value="spa">Spa / Wellness</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </SlideOver>

      {/* Add Contact */}
      <SlideOver
        open={slideOver === "add_contact"}
        onClose={() => setSlideOver(null)}
        title={`Add Contact${activeRow ? ` — ${activeRow.companyName}` : ""}`}
        footer={
          <Btn onClick={submitAddContact} disabled={!acFirst.trim() || !acLast.trim()}>Add Contact</Btn>
        }
      >
        <Field label="First name *"><Input value={acFirst} onChange={setAcFirst} placeholder="Jane" /></Field>
        <Field label="Last name *"><Input value={acLast} onChange={setAcLast} placeholder="Smith" /></Field>
        <Field label="Title"><Input value={acTitle} onChange={setAcTitle} placeholder="Director of Marketing" /></Field>
        <Field label="Email"><Input value={acEmail} onChange={setAcEmail} placeholder="jane@example.com" type="email" /></Field>
        <Field label="LinkedIn URL"><Input value={acLinkedin} onChange={setAcLinkedin} placeholder="linkedin.com/in/janesmith" /></Field>
      </SlideOver>

      {/* Add Note */}
      <SlideOver
        open={slideOver === "add_note"}
        onClose={() => setSlideOver(null)}
        title={`Note — ${activeRow?.contactName ?? activeRow?.companyName ?? ""}`}
        footer={<Btn onClick={submitAddNote}>Save Note</Btn>}
      >
        <Field label="Notes">
          <Textarea value={noteText} onChange={setNoteText} placeholder="Add context, conversation notes, next steps..." rows={6} />
        </Field>
      </SlideOver>

      {/* Schedule Follow-up */}
      <SlideOver
        open={slideOver === "schedule_followup"}
        onClose={() => setSlideOver(null)}
        title={`Follow-up — ${activeRow?.contactName ?? activeRow?.companyName ?? ""}`}
        footer={<Btn onClick={submitScheduleFollowUp} disabled={!fupDate}>Schedule</Btn>}
      >
        <Field label="Due date *"><Input type="date" value={fupDate} onChange={setFupDate} /></Field>
        <Field label="Notes">
          <Textarea value={fupNote} onChange={setFupNote} placeholder="What to follow up on..." rows={4} />
        </Field>
      </SlideOver>

      {/* Set Email Manually */}
      <SlideOver
        open={slideOver === "set_email"}
        onClose={() => setSlideOver(null)}
        title={`Set Email — ${activeRow?.contactName ?? ""}`}
        footer={<Btn onClick={submitSetEmail} disabled={!emailVal.trim()}>Save Email</Btn>}
      >
        <Field label="Email address">
          <Input type="email" value={emailVal} onChange={setEmailVal} placeholder="name@company.com" />
        </Field>
        <p className="text-xs text-zinc-600">
          Use Hunter (via the action menu) to find and auto-verify emails instead.
        </p>
      </SlideOver>
    </div>
  );
}
