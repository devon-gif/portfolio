import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { sendMessageById, countSentToday } from "@/lib/send-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clampLimit(n: unknown, fallback = 20): number {
  const v = typeof n === "number" ? n : fallback;
  return Math.max(1, Math.min(200, Math.floor(v)));
}
function intOr(n: unknown, fallback: number): number {
  return typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : fallback;
}

// POST /api/send-due
// Sends a small batch of scheduled messages whose time has arrived.
// Designed to be called repeatedly (e.g. by a cron) — never exceeds the daily limit.
export async function POST() {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }
  const admin = getAdminClient();

  const { data: settings } = await admin.from("app_settings").select("*").limit(1).single();
  const dailyLimit = clampLimit(settings?.daily_send_limit, 20);
  const perRunCap = Math.max(1, intOr(settings?.batch_size_max, 8));

  const sentToday = await countSentToday(admin);
  const remaining = Math.max(0, dailyLimit - sentToday);
  if (remaining === 0) {
    return Response.json({ ok: true, sent: 0, failed: 0, message: "Daily limit reached.", daily_limit: dailyLimit });
  }
  const take = Math.min(remaining, perRunCap);

  const nowIso = new Date().toISOString();
  const { data: due, error } = await admin
    .from("messages")
    .select("id")
    .eq("status", "scheduled")
    .lte("scheduled_send_at", nowIso)
    .order("scheduled_send_at", { ascending: true })
    .limit(take);
  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
  if (!due || due.length === 0) {
    return Response.json({ ok: true, sent: 0, failed: 0, message: "Nothing due." });
  }

  const results: { message_id: string; ok: boolean; error?: string; resend_email_id?: string }[] = [];
  let sent = 0;
  let failed = 0;
  for (const m of due) {
    if (sentToday + sent >= dailyLimit) break; // hard stop at the daily cap
    const r = await sendMessageById(admin, m.id, { allowedStatuses: ["scheduled"], settings });
    results.push(r);
    if (r.ok) sent++;
    else failed++;
  }

  return Response.json({ ok: true, sent, failed, daily_limit: dailyLimit, results });
}
