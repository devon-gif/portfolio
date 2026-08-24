"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export function PortalSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    // Full navigation so the server re-reads the (now cleared) session cookie.
    router.replace("/portal/login");
    router.refresh();
  }

  return (
    <button type="button" className="ap-btn ap-btn--quiet" onClick={signOut} disabled={busy}>
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
