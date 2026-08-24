"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import type { ClientDecision } from "@/lib/portal/types";

const DECISIONS: { value: ClientDecision; label: string; variant: string; needsNote: boolean }[] = [
  { value: "approved", label: "Approve", variant: "ap-btn--approve", needsNote: false },
  { value: "changes_requested", label: "Request changes", variant: "ap-btn--changes", needsNote: true },
  { value: "new_direction_requested", label: "Request new direction", variant: "ap-btn--direction", needsNote: true },
];

/**
 * The client's decision controls.
 *
 * Calls the review_client_decide RPC directly with the browser (anon) client —
 * the same pattern the existing review portal uses, and it is safe for the same
 * reason: the function is SECURITY DEFINER and re-derives the organization from
 * the review item's own row, then checks that the caller is a member of it. A
 * client cannot decide on another organization's item by passing its id, and
 * the required-feedback rule is enforced in SQL, not only here.
 *
 * The client-side note check below is therefore a courtesy that gives a fast,
 * inline error — not the guarantee.
 */
export function ReviewDecision({ itemId, readOnly }: { itemId: string; readOnly: boolean }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<ClientDecision | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: ClientDecision, needsNote: boolean) {
    setError(null);

    if (needsNote && !note.trim()) {
      setError("Please add a short note so Archer knows what to change.");
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setError("This workspace isn't connected right now. Please try again shortly.");
      return;
    }

    setBusy(decision);
    const { error: rpcError } = await client.rpc("review_client_decide", {
      p_review_item_id: itemId,
      p_decision: decision,
      p_message: note.trim() || null,
    });
    setBusy(null);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setNote("");
    router.refresh();
  }

  return (
    <div style={{ marginTop: 4 }}>
      <label className="ap-label" htmlFor={`note-${itemId}`}>
        Feedback for Archer
      </label>
      <textarea
        id={`note-${itemId}`}
        className="ap-textarea"
        style={{ marginTop: 8 }}
        placeholder="Optional when approving. Required if you're asking for changes."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={readOnly}
      />

      {error && (
        <p style={{ color: "var(--ap-changes)", fontSize: 12.5, margin: "8px 0 0" }} role="alert">
          {error}
        </p>
      )}

      <div className="ap-item-actions">
        {DECISIONS.map((d) => (
          <button
            key={d.value}
            type="button"
            className={`ap-btn ${d.variant}`}
            onClick={() => decide(d.value, d.needsNote)}
            disabled={readOnly || busy !== null}
          >
            {busy === d.value ? "Saving…" : d.label}
          </button>
        ))}
      </div>

      {readOnly && (
        <p className="ap-muted" style={{ fontSize: 12, marginTop: 10 }}>
          Decisions are disabled in preview — there is no real review item behind this demo card.
        </p>
      )}
    </div>
  );
}
