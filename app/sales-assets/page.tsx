"use client";

// Sales Assets — copy/paste command center. Open before any outreach or call.
// Manual only: nothing here sends anything anywhere.

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clipboard, ClipboardCheck, Award, FileText } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import {
  CATEGORY_LABELS,
  SALES_ASSETS,
  type SalesAsset,
  type SalesCategory,
} from "@/lib/sales-assets";

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 transition-colors hover:bg-zinc-800"
    >
      {done ? <ClipboardCheck className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
      {done ? "Copied" : label}
    </button>
  );
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as SalesCategory[];

export default function SalesAssetsPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<SalesCategory | "all">("all");
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return SALES_ASSETS.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.whenToUse.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  const grouped = useMemo(() => {
    const map = new Map<SalesCategory, SalesAsset[]>();
    for (const c of CATEGORIES) map.set(c, []);
    for (const a of filtered) map.get(a.category)?.push(a);
    return [...map.entries()].filter(([, items]) => items.length > 0);
  }, [filtered]);

  async function saveAsWinner(asset: SalesAsset) {
    setSavingId(asset.id);
    const { error } = await supabase.from("winning_messages").insert({
      source: "sales_assets",
      message_type: asset.category,
      audience: asset.title,
      message_body: asset.body,
      result: "template",
      notes: `Saved from /sales-assets: ${asset.title}`,
    });
    setSavingId(null);
    setSavedNote(error
      ? (error.message.includes("winning_messages")
          ? "winning_messages table missing — run the 20260611 migration first."
          : `Save failed: ${error.message}`)
      : `Saved "${asset.title}" to winning messages.`);
  }

  return (
    <div className="max-w-5xl px-6 py-6">
      <PageHeader
        title="Sales Assets"
        description="Copy/paste command center — open this before any DM, email, or call. Everything is manual; nothing sends."
        action={
          <Link href="/creative-output" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
            Creative Sprint →
          </Link>
        }
      />

      {/* Search + filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search assets… (e.g. budget, pilot, partner)"
          className="w-72 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-600/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        <button
          onClick={() => setCat("all")}
          className={clsx("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", cat === "all" ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30" : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200")}
        >
          All ({SALES_ASSETS.length})
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={clsx("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", cat === c ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30" : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200")}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {savedNote && <p className="mb-4 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300">{savedNote}</p>}

      {/* Sections */}
      <div className="space-y-8">
        {grouped.map(([category, items]) => (
          <section key={category}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <FileText className="h-4 w-4 text-[#C9A44C]" /> {CATEGORY_LABELS[category]}
                <span className="text-xs font-normal text-zinc-600">({items.length})</span>
              </h2>
              <CopyBtn
                label="Copy all for this section"
                text={items.map((a) => `## ${a.title}\n${a.body}`).join("\n\n")}
              />
            </div>
            <div className="space-y-2">
              {items.map((a) => (
                <details key={a.id} className="group rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-zinc-200">{a.title}</span>
                      <span className="block truncate text-[11px] text-zinc-500">{a.whenToUse}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <CopyBtn text={a.body} />
                      <button
                        onClick={(e) => { e.preventDefault(); void saveAsWinner(a); }}
                        disabled={savingId === a.id}
                        title="Save to winning_messages"
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 px-2 py-1.5 text-[11px] text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
                      >
                        <Award className="h-3 w-3" /> Winner
                      </button>
                    </span>
                  </summary>
                  <p className="whitespace-pre-wrap border-t border-zinc-800 px-4 py-3 text-[12.5px] leading-relaxed text-zinc-400">
                    {a.body}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
        {grouped.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-600">Nothing matches — try a broader search.</p>
        )}
      </div>

      <p className="mt-10 border-t border-zinc-800 pt-4 text-[11px] text-zinc-600">
        Personalize every [bracket] before sending. LinkedIn is manual-only. Full docs:
        docs/sales/ (deck, meet script, proposal template, proof library). Generate a tailored
        proposal at <Link href="/proposal-generator" className="text-emerald-400 hover:underline">/proposal-generator</Link>.
      </p>
    </div>
  );
}
