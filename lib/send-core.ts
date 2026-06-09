// Shared "send one message" pipeline used by /api/send-approved and /api/send-due.
// Performs every safety check, builds the compliant body, sends via Resend, and
// records the result. Server-only.
import type { SupabaseClient } from "@supabase/supabase-js";
import { checkContactEligibility, isSuppressed, sendEmail } from "./sending";
import {
  finalizeEmailBody,
  generateUnsubscribeToken,
  buildUnsubscribeUrl,
} from "./compliance";

export interface SendResult {
  ok: boolean;
  message_id: string;
  resend_email_id?: string;
  error?: string;
}

interface SendOptions {
  /** Statuses the message is allowed to be in to send (e.g. ['approved'] or ['scheduled']). */
  allowedStatuses: string[];
  /** Pre-fetched settings row (optional — fetched if omitted). */
  settings?: Record<string, unknown> | null;
}

async function markFailed(
  admin: SupabaseClient,
  id: string,
  reason: string
): Promise<SendResult> {
  await admin.from("messages").update({ status: "send_failed", error_message: reason }).eq("id", id);
  return { ok: false, message_id: id, error: reason };
}

export async function sendMessageById(
  admin: SupabaseClient,
  messageId: string,
  opts: SendOptions
): Promise<SendResult> {
  // Hard requirement: we can never build an unsubscribe link without a base URL.
  if (!process.env.PUBLIC_APP_URL) {
    return { ok: false, message_id: messageId, error: "PUBLIC_APP_URL is not set — refusing to send." };
  }

  // 1) Fetch message.
  const { data: message, error: mErr } = await admin
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();
  if (mErr || !message) {
    return { ok: false, message_id: messageId, error: "Message not found." };
  }

  // 2) Status gate — never send anything outside the allowed set.
  if (!opts.allowedStatuses.includes(message.status)) {
    return {
      ok: false,
      message_id: messageId,
      error: `Message status is "${message.status}", expected one of: ${opts.allowedStatuses.join(", ")}.`,
    };
  }
  if (message.channel && message.channel !== "email") {
    return { ok: false, message_id: messageId, error: "Only email messages can be sent." };
  }
  if (!message.subject || !String(message.subject).trim()) {
    return await markFailed(admin, messageId, "Message has no subject.");
  }

  // 3) Optimistic lock: flip to "sending" only if still in the expected status.
  const { data: locked } = await admin
    .from("messages")
    .update({ status: "sending" })
    .eq("id", messageId)
    .eq("status", message.status)
    .select("id");
  if (!locked || locked.length === 0) {
    return { ok: false, message_id: messageId, error: "Message is already being sent or changed state." };
  }

  // 4) Fetch contact.
  if (!message.contact_id) {
    return await markFailed(admin, messageId, "Message has no linked contact.");
  }
  const { data: contact, error: cErr } = await admin
    .from("contacts")
    .select("*")
    .eq("id", message.contact_id)
    .single();
  if (cErr || !contact) {
    return await markFailed(admin, messageId, "Contact not found.");
  }

  // 5) Contact eligibility (email present, opt-out, replied, bounces, status).
  const elig = checkContactEligibility(contact);
  if (!elig.ok) {
    return await markFailed(admin, messageId, elig.reason || "Contact not eligible.");
  }

  // 7) Settings + company for personalization, suppression & compliance footer.
  let settings = opts.settings ?? null;
  if (!settings) {
    const { data } = await admin.from("app_settings").select("*").limit(1).single();
    settings = data ?? null;
  }
  let company: Record<string, unknown> | null = null;
  if (contact.company_id) {
    const { data } = await admin.from("companies").select("*").eq("id", contact.company_id).single();
    company = data ?? null;
  }
  const companyName = (contact.company_name as string) || (company?.name as string) || "";

  // 6) Suppression list (email, domain, company name).
  try {
    if (await isSuppressed(admin, contact.email, companyName)) {
      return await markFailed(admin, messageId, "Contact is on the suppression list.");
    }
  } catch (e) {
    return await markFailed(admin, messageId, e instanceof Error ? e.message : "Suppression check failed.");
  }

  // 8) Unsubscribe token + URL (persist token so the link is stable).
  const token: string = message.unsubscribe_token || generateUnsubscribeToken();
  let unsubscribeUrl: string;
  try {
    unsubscribeUrl = buildUnsubscribeUrl(token);
  } catch (e) {
    return await markFailed(admin, messageId, e instanceof Error ? e.message : "Unsubscribe link failed.");
  }

  // 9) Build the compliant, variable-substituted body (throws if address missing).
  let finalBody: string;
  try {
    finalBody = finalizeEmailBody(message.body, {
      contact,
      company,
      settings: settings ?? undefined,
      unsubscribeUrl,
    });
  } catch (e) {
    return await markFailed(admin, messageId, e instanceof Error ? e.message : "Could not build compliant email.");
  }

  // 10) Send via Resend. In test mode, redirect every send to your own inbox.
  const testMode = (settings as Record<string, unknown> | null)?.test_mode === true;
  const testEmail = ((settings as Record<string, unknown> | null)?.test_email as string) || "";
  if (testMode && !testEmail) {
    return await markFailed(admin, messageId, "Test mode is on but no test email is set in Settings.");
  }
  const recipient = testMode ? testEmail : contact.email;
  const subject = testMode
    ? `[TEST → ${contact.email}] ${String(message.subject)}`
    : String(message.subject);

  let resendId: string;
  try {
    resendId = await sendEmail({ to: recipient, subject, text: finalBody });
  } catch (e) {
    return await markFailed(admin, messageId, e instanceof Error ? e.message : "Resend send failed.");
  }

  // 11) Record success.
  const now = new Date().toISOString();
  await admin
    .from("messages")
    .update({
      status: "sent",
      sent_at: now,
      resend_email_id: resendId,
      unsubscribe_token: token,
      body: finalBody,
    })
    .eq("id", messageId);

  await admin.from("contacts").update({ last_contacted_at: now, status: "sent" }).eq("id", message.contact_id);

  return { ok: true, message_id: messageId, resend_email_id: resendId };
}

/**
 * Send a one-off TEST copy of a message to your own inbox.
 * Skips the approval/eligibility/suppression gates (you're emailing yourself),
 * but still builds the fully compliant body. Does NOT change the message status.
 */
export async function sendTestMessageById(
  admin: SupabaseClient,
  messageId: string,
  overrideTo?: string
): Promise<SendResult> {
  if (!process.env.PUBLIC_APP_URL) {
    return { ok: false, message_id: messageId, error: "PUBLIC_APP_URL is not set — refusing to send." };
  }
  const { data: message, error } = await admin.from("messages").select("*").eq("id", messageId).single();
  if (error || !message) return { ok: false, message_id: messageId, error: "Message not found." };
  if (!message.subject || !String(message.subject).trim()) {
    return { ok: false, message_id: messageId, error: "Message has no subject." };
  }

  const { data: settings } = await admin.from("app_settings").select("*").limit(1).single();
  const to = (overrideTo || (settings as Record<string, unknown>)?.test_email || "").toString().trim();
  if (!to) return { ok: false, message_id: messageId, error: "No test email set in Settings." };

  let contact: Record<string, unknown> | null = null;
  if (message.contact_id) {
    const { data } = await admin.from("contacts").select("*").eq("id", message.contact_id).single();
    contact = data ?? null;
  }
  let company: Record<string, unknown> | null = null;
  if (contact?.company_id) {
    const { data } = await admin.from("companies").select("*").eq("id", contact.company_id).single();
    company = data ?? null;
  }

  const token: string = message.unsubscribe_token || generateUnsubscribeToken();
  let unsubscribeUrl: string;
  let finalBody: string;
  try {
    unsubscribeUrl = buildUnsubscribeUrl(token);
    finalBody = finalizeEmailBody(message.body, {
      contact: contact ?? { first_name: "there" },
      company,
      settings: settings ?? undefined,
      unsubscribeUrl,
    });
  } catch (e) {
    return { ok: false, message_id: messageId, error: e instanceof Error ? e.message : "Could not build test email." };
  }

  // Persist the token so the unsubscribe link in the test actually resolves.
  if (!message.unsubscribe_token) {
    await admin.from("messages").update({ unsubscribe_token: token }).eq("id", messageId);
  }

  try {
    const resendId = await sendEmail({
      to,
      subject: `[TEST] ${String(message.subject)}`,
      text: finalBody,
    });
    return { ok: true, message_id: messageId, resend_email_id: resendId };
  } catch (e) {
    return { ok: false, message_id: messageId, error: e instanceof Error ? e.message : "Resend send failed." };
  }
}

/** Count of messages already sent today (for daily-limit enforcement). */
export async function countSentToday(admin: SupabaseClient): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { count } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("sent_at", start.toISOString());
  return count ?? 0;
}
