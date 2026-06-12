import type { SupabaseClient } from "@supabase/supabase-js";

export interface RampInfo {
  baseDailyLimit: number;
  effectiveDailyLimit: number;
  rampEnabled: boolean;
  rampWeek: number;
  rampCap: number;
  rampTarget: number;
  trailingSent: number;
  trailingBounced: number;
  trailingComplaints: number;
  trailingBounceRate: number;
  throttled: boolean;
  throttleReason?: string;
}

function numberOr(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? Math.floor(v) : fallback;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export function rampCapForWeek(week: number, target = 100): number {
  const caps = [10, 20, 30, 45, 60, 80];
  if (week <= 0) return caps[0];
  if (week <= caps.length) return Math.min(caps[week - 1], target);
  return target;
}

export function rampWeekFromStart(startDate?: string | null, now = new Date()): number {
  if (!startDate) return 1;
  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return 1;
  const diffDays = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86_400_000));
  return Math.floor(diffDays / 7) + 1;
}

export async function getTrailingDeliverability(
  admin: SupabaseClient,
  now = new Date()
): Promise<{ sent: number; bounced: number; complaints: number; bounceRate: number }> {
  const start = new Date(now.getTime() - 7 * 86_400_000).toISOString();

  const { count: sent } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("sent_at", start);

  const { count: bounced } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .not("bounced_at", "is", null)
    .gte("bounced_at", start);

  const { count: complaints } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .not("complained_at", "is", null)
    .gte("complained_at", start);

  const s = sent ?? 0;
  const b = bounced ?? 0;
  const c = complaints ?? 0;
  return {
    sent: s,
    bounced: b,
    complaints: c,
    bounceRate: s > 0 ? b / s : 0,
  };
}

export async function getEffectiveDailyLimit(
  admin: SupabaseClient,
  settings?: Record<string, unknown> | null
): Promise<RampInfo> {
  const row = settings ?? (await admin.from("app_settings").select("*").limit(1).single()).data ?? {};

  const baseDailyLimit = clamp(numberOr(row.daily_send_limit, 20), 1, 200);
  const rampEnabled = row.ramp_enabled === true;
  const rampTarget = clamp(numberOr(row.ramp_target, 100), 1, 200);
  const rampWeek = rampWeekFromStart((row.ramp_start_date as string | null | undefined) ?? null);
  const normalRampCap = rampCapForWeek(rampWeek, rampTarget);

  const trailing = await getTrailingDeliverability(admin);
  const shouldThrottle = trailing.bounceRate > 0.03 || trailing.complaints > 0;
  const throttledRampCap = shouldThrottle
    ? rampCapForWeek(Math.max(1, rampWeek - 1), rampTarget)
    : normalRampCap;

  const rampCap = rampEnabled ? throttledRampCap : baseDailyLimit;
  const effectiveDailyLimit = Math.min(baseDailyLimit, rampCap);

  return {
    baseDailyLimit,
    effectiveDailyLimit,
    rampEnabled,
    rampWeek,
    rampCap,
    rampTarget,
    trailingSent: trailing.sent,
    trailingBounced: trailing.bounced,
    trailingComplaints: trailing.complaints,
    trailingBounceRate: trailing.bounceRate,
    throttled: rampEnabled && shouldThrottle,
    throttleReason: shouldThrottle
      ? `Ramp held: ${(trailing.bounceRate * 100).toFixed(1)}% bounce rate, ${trailing.complaints} complaints in trailing 7 days.`
      : undefined,
  };
}
