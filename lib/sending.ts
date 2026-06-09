// Sending guards + Resend integration (server-only).
import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";

export const MAX_DAILY_LIMIT = 200;
export const DEFAULT_DAILY_LIMIT = 20;
export const THROTTLE_MIN_MS = 10_000; // 10s
export const THROTTLE_MAX_MS = 30_000; // 30s

export interface GuardResult {
  ok: boolean;
  reason?: string;
}

/** Field-level eligibility checks on a contact row (no DB calls). */
export function checkContactEligibility(contact: Record<string, unknown> | null | undefined): GuardResult {
  if (!contact) return { ok: false, reason: "Contact not found." };
  const email = typeof contact.email === "string" ? contact.email.trim() : "";
  if (!email) return { ok: false, reason: "Contact has no email address." };

  if (contact.email_opt_out === true) return { ok: false, reason: "Contact opted out of email." };
  if (contact.opted_out === true) return { ok: false, reason: "Contact is opted out." };
  if (contact.suppressed === true) return { ok: false, reason: "Contact is suppressed." };
  if (contact.replied_at) return { ok: false, reason: "Contact already replied." };
  if (contact.bounced === true) return { ok: false, reason: "Contact email previously bounced." };

  const bounceCount = typeof contact.bounce_count === "number" ? contact.bounce_count : 0;
  if (bounceCount >= 2) return { ok: false, reason: "Contact has 2+ bounces." };

  const blockedStatuses = new Set([
    "replied",
    "unsubscribed",
    "not_interested",
    "do_not_contact",
    "opted_out",
    "bounced",
    "suppressed",
  ]);
  if (typeof contact.status === "string" && blockedStatuses.has(contact.status)) {
    return { ok: false, reason: `Contact status is "${contact.status}".` };
  }
  return { ok: true };
}

/**
 * Returns true if the contact should be suppressed — matched by exact email,
 * email domain, or company name on the suppression_list.
 */
export async function isSuppressed(
  admin: SupabaseClient,
  email: string,
  companyName?: string | null
): Promise<boolean> {
  const e = (email || "").trim().toLowerCase();
  if (!e) return true;
  const domain = e.includes("@") ? e.split("@")[1] : "";
  const company = (companyName || "").trim();

  // The suppression_list has separate email / domain / company_name columns.
  // Check each independently so company names containing commas don't break filters.
  const checks: PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>[] = [
    admin.from("suppression_list").select("id").ilike("email", e).limit(1),
  ];
  if (domain) checks.push(admin.from("suppression_list").select("id").ilike("domain", domain).limit(1));
  if (company) checks.push(admin.from("suppression_list").select("id").ilike("company_name", company).limit(1));

  const results = await Promise.all(checks);
  for (const r of results) {
    if (r.error) throw new Error(`Suppression check failed: ${r.error.message}`); // fail closed
    if ((r.data?.length ?? 0) > 0) return true;
  }
  return false;
}

let _resend: Resend | null = null;
export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY ?? "";
  if (!key) throw new Error("RESEND_API_KEY is not set.");
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

export interface SendEmailArgs {
  to: string;
  subject: string;
  text: string;
  from?: string;
  replyTo?: string;
}

/** Sends a plain-text email through Resend. Returns the Resend message id. */
export async function sendEmail(args: SendEmailArgs): Promise<string> {
  const from = (args.from || process.env.RESEND_FROM_EMAIL || "").trim();
  if (!from) throw new Error("RESEND_FROM_EMAIL is not set.");
  const replyTo = (args.replyTo || process.env.RESEND_REPLY_TO || "").trim();

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    ...(replyTo ? { replyTo } : {}),
  });
  if (error) throw new Error(error.message || "Resend send failed.");
  if (!data?.id) throw new Error("Resend did not return a message id.");
  return data.id;
}

/** Random throttle delay (ms) between 10–30 seconds. */
export function throttleDelayMs(): number {
  return THROTTLE_MIN_MS + Math.floor(Math.random() * (THROTTLE_MAX_MS - THROTTLE_MIN_MS + 1));
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
