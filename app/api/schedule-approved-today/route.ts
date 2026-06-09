import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clampLimit(n: unknown, fallback = 20): number {
  const v = typeof n === "number" ? n : fallback;
  return Math.max(0, Math.min(200, Math.floor(v)));
}
function intOr(n: unknown, fallback: number): number {
  return typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : fallback;
}
function randBetween(min: number, max: number): number {
  if (max <= min) return min;
  return min + Math.floor(Math.random() * (max - min + 1));
}

// POST /api/schedule-approved-today
//
// Turns approved-for-today emails into SCHEDULED sends, spreading scheduled_send_at
// slowly across today's send window so they trickle out over the day. The user
// approves once; the timed sends (via /api/send-due) need no further approval.
//
// Rules (from app_settings):
//   • Only messages in status 'approved_for_today' (or legacy 'approved') are scheduled.
//   • Respect daily_send_limit (counting today's already scheduled/sending/sent).
//   • Batches of batch_size_min..batch_size_max, spaced minutes_between_batches_min..max.
//   • Window = send_window_start_hour .. send_window_end_hour.
// Nothing is sent here — only scheduled.
export async function POST() {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }

  const admin = getAdminClient();

  const { data: settings } = await admin.from("app_settings").select("*").limit(1).single();
  const dailyLimit = clampLimit(settings?.daily_send_limit, 20);
  const startHour = intOr(settings?.send_window_start_hour, 9);
  const endHour = intOr(settings?.send_window_end_hour, 17);
  const batchMin = Math.max(1, intOr(settings?.batch_size_min, 3));
  const batchMax = Math.max(batchMin, intOr(settings?.batch_size_max, 8));
  const gapMin = Math.max(1, intOr(settings?.minutes_between_batches_min, 20));
  const gapMax = Math.max(gapMin, intOr(settings?.minutes_between_batches_max, 60));

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Everything that already counts against today's send budget.
  const { count: pending } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .in("status", ["scheduled", "sending"]);
  const { count: sentToday } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("sent_at", startOfDay.toISOString());

  const remaining = Math.max(0, dailyLimit - (pending ?? 0) - (sentToday ?? 0));
  if (remaining === 0) {
    return Response.json({ ok: true, scheduled: 0, message: "Daily limit already reached.", daily_limit: dailyLimit });
  }

  // Approved emails awaiting scheduling, oldest first, capped to the remaining budget.
  const { data: approved, error } = await admin
    .from("messages")
    .select("id")
    .in("status", ["approved_for_today", "approved"])
    .eq("channel", "email")
    .order("created_at", { ascending: true })
    .limit(remaining);

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  if (!approved?.length) {
    return Response.json({ ok: true, scheduled: 0, message: "No approved-for-today emails to schedule.", daily_limit: dailyLimit });
  }

  // Walk today's window assigning scheduled_send_at in randomized batches.
  const now = new Date();
  let cursor = new Date();
  cursor.setHours(startHour, randBetween(0, 9), randBetween(0, 59), 0);
  if (cursor < now) cursor = new Date(now.getTime() + 2 * 60_000); // never schedule in the past

  let endAt = new Date();
  endAt.setHours(endHour, 0, 0, 0);
  // If the window has already passed for today, open a short window from now so
  // approved mail still goes out today rather than being stranded.
  if (endAt <= cursor) endAt = new Date(cursor.getTime() + 60 * 60_000);

  const updates: { id: string; at: string }[] = [];
  let i = 0;
  while (i < approved.length) {
    const size = randBetween(batchMin, batchMax);
    for (let b = 0; b < size && i < approved.length; b++) {
      updates.push({ id: approved[i].id, at: cursor.toISOString() });
      i++;
    }
    cursor = new Date(cursor.getTime() + randBetween(gapMin, gapMax) * 60_000);
    if (cursor > endAt) cursor = new Date(endAt.getTime()); // clamp overflow to the window end
  }

  // Flip to scheduled, guarding against concurrent state changes.
  const results = await Promise.all(
    updates.map((u) =>
      admin
        .from("messages")
        .update({ status: "scheduled", scheduled_send_at: u.at })
        .eq("id", u.id)
        .in("status", ["approved_for_today", "approved"])
        .select("id"),
    ),
  );
  const scheduled = results.reduce((n, r) => n + ((r.data?.length ?? 0) > 0 ? 1 : 0), 0);

  return Response.json({
    ok: true,
    scheduled,
    daily_limit: dailyLimit,
    window: { start_hour: startHour, end_hour: endHour },
  });
}
