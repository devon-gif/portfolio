"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Copy, Check } from "lucide-react";
import type { Template, TemplateType } from "@/lib/types";
import { MOCK_TEMPLATES } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { SlideOver, Field, Input, Textarea, Select } from "@/components/SlideOver";
import clsx from "clsx";

const TYPE_CONFIG: Record<TemplateType, { label: string; color: string }> = {
  email:    { label: "Email",    color: "bg-sky-500/10 text-sky-400 ring-sky-500/20" },
  linkedin: { label: "LinkedIn", color: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20" },
  followup: { label: "Follow-up", color: "bg-amber-500/10 text-amber-400 ring-amber-500/20" },
};

const EMPTY: Omit<Template, "id" | "created_at" | "updated_at"> = {
  name: "",
  type: "email",
  subject: "",
  body: "",
  tags: [],
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TemplateType | "all">("all");
  const [slideOver, setSlideOver] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<Template> }>({
    open: false, mode: "add", data: { ...EMPTY },
  });
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return templates.filter(
      (t) =>
        (typeFilter === "all" || t.type === typeFilter) &&
        (t.name.toLowerCase().includes(q) || t.body.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q))
    );
  }, [templates, search, typeFilter]);

  function openAdd() {
    setSlideOver({ open: true, mode: "add", data: { ...EMPTY } });
  }

  function openEdit(t: Template) {
    setSlideOver({ open: true, mode: "edit", data: { ...t, tags: [...(t.tags ?? [])] } });
  }

  function handleSave() {
    const d = slideOver.data as Template;
    if (slideOver.mode === "add") {
      const t: Template = {
        ...d,
        id: crypto.randomUUID(),
        tags: d.tags ?? [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTemplates((prev) => [t, ...prev]);
    } else {
      setTemplates((prev) => prev.map((t) => (t.id === d.id ? { ...t, ...d, updated_at: new Date().toISOString() } : t)));
    }
    setSlideOver((s) => ({ ...s, open: false }));
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function handleCopy(t: Template) {
    navigator.clipboard.writeText(t.body).catch(() => {});
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function patch(key: string, value: unknown) {
    setSlideOver((s) => ({ ...s, data: { ...s.data, [key]: value } }));
  }

  function patchTags(raw: string) {
    const tags = raw.split(",").map((s) => s.trim()).filter(Boolean);
    patch("tags", tags);
  }

  const d = slideOver.data;

  return (
    <div className="px-6 py-6 max-w-7xl">
      <PageHeader
        title="Templates"
        description={`${templates.length} message template${templates.length !== 1 ? "s" : ""}`}
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
            <Plus className="h-4 w-4" />
            Add Template
          </button>
        }
      />

      <div className="flex items-center gap-3 mb-5">
        <input
          type="search"
          placeholder="Search templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50 transition-colors"
        />
        <div className="flex gap-1.5">
          {(["all", "email", "linkedin", "followup"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                typeFilter === key
                  ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30"
                  : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              )}
            >
              {key === "all" ? "All" : TYPE_CONFIG[key].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No templates found" description="Create your first message template to speed up outreach." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((t) => {
            const cfg = TYPE_CONFIG[t.type as TemplateType] ?? TYPE_CONFIG.email;
            return (
              <div key={t.id} className="group rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 hover:border-zinc-700 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", cfg.color)}>
                      {cfg.label}
                    </span>
                    <span className="text-sm font-semibold text-zinc-200">{t.name}</span>
                    {t.subject && <span className="text-xs text-zinc-500">— {t.subject}</span>}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
                    <button onClick={() => handleCopy(t)} title="Copy body" className="rounded-lg p-1.5 text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      {copiedId === t.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-700 transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(t)} className="rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-3 font-mono leading-5 whitespace-pre-line">{t.body}</p>
                {(t.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(t.tags ?? []).map((tag) => (
                      <span key={tag} className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over */}
      <SlideOver
        open={slideOver.open}
        onClose={() => setSlideOver((s) => ({ ...s, open: false }))}
        title={slideOver.mode === "add" ? "Add Template" : "Edit Template"}
        footer={
          <>
            <button onClick={() => setSlideOver((s) => ({ ...s, open: false }))} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
              {slideOver.mode === "add" ? "Add Template" : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name *"><Input value={d.name ?? ""} onChange={(e) => patch("name", e.target.value)} /></Field>
          <Field label="Type">
            <Select value={d.type ?? "email"} onChange={(e) => patch("type", e.target.value)}>
              <option value="email">Email</option>
              <option value="linkedin">LinkedIn</option>
              <option value="followup">Follow-up</option>
            </Select>
          </Field>
          {(d.type === "email" || d.type === "followup") && (
            <Field label="Subject Line"><Input value={d.subject ?? ""} onChange={(e) => patch("subject", e.target.value)} /></Field>
          )}
          <Field label="Body *">
            <Textarea rows={10} value={d.body ?? ""} onChange={(e) => patch("body", e.target.value)} className="font-mono text-xs" />
          </Field>
          <Field label="Tags (comma-separated)">
            <Input value={(d.tags ?? []).join(", ")} onChange={(e) => patchTags(e.target.value)} placeholder="boutique, intro, warm" />
          </Field>
        </div>
      </SlideOver>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Delete Template</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Remove <span className="text-zinc-200 font-medium">{deleteTarget.name}</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
