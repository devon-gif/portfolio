import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { Webhook } from "svix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResendWebhookEvent = {
  type?: string;
  event?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
};

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function domainOf(email: string): string {
  return email.includes("@") ? email.split("@")[1].toLowerCase() : "";
}

async function findMessage(admin: ReturnType<typeof getAdminClient>, data: Record<string, unknown>) {
  const resendId =
    asString(data.email_id) ||
    asString(data.emailId) ||
    asString(data.id) ||
    asString((data.email as Record<string, unknown> | undefined)?.id);

  if (resendId) {
    const { data: msg } = await admin
      .from("messages")
      .select("*")
      .eq("resend_email_id", resendId)
      .limit(1)
      .maybeSingle();
    if (msg) return msg as Record<string, unknown>;
  }

  return null;
}

async function haltContact(admin: ReturnType<typeof getAdminClient>, contactId: string, reason: string) {
  await admin
    .from("contacts")
    .update({
      sequence_status: "halted",
      sequence_halt_reason: reason,
      next_step_due_at: null,
    })
    .eq("id", contactId);
}

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ ok: false, error: "RESEND_WEBHOOK_SECRET is not set." }, { status: 500 });
  }

  const payload = await req.text();

  let event: ResendWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, {
      "svix-id": req.headers.get("svix-id") ?? "",
      "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
      "svix-signature": req.headers.get("svix-signature") ?? "",
    }) as ResendWebhookEvent;
  } catch {
    return Response.json({ ok: false, error: "Invalid webhook signature." }, { status: 400 });
  }

  const admin = getAdminClient();
  const type = asString(event.type || event.event);
  const data = (event.data && typeof event.data === "object" ? event.data : event) as Record<string, unknown>;

  const message = await findMessage(admin, data);
  const now = new Date().toISOString();

  if (!message) {
    // Do not fail webhook retries just because the CRM cannot match an old/test email.
    return Response.json({ ok: true, matched: false, type });
  }

  const messageId = String(message.id);
  const contactId = asString(message.contact_id);

  if (type === "email.delivered") {
    await admin.from("messages").update({ delivered_at: now }).eq("id", messageId);
    return Response.json({ ok: true, matched: true, type });
  }

  if (type === "email.bounced") {
    await admin
      .from("messages")
      .update({
        status: "bounced",
        bounced_at: now,
        error_message: "Resend webhook: email bounced.",
      })
      .eq("id", messageId);

    if (contactId) {
      await admin
        .from("contacts")
        .update({
          bounced: true,
          bounced_at: now,
          sequence_status: "halted",
          sequence_halt_reason: "bounced",
          next_step_due_at: null,
        })
        .eq("id", contactId);
    }

    return Response.json({ ok: true, matched: true, type });
  }

  if (type === "email.complained") {
    await admin
      .from("messages")
      .update({
        status: "complained",
        complained_at: now,
        error_message: "Resend webhook: spam complaint.",
      })
      .eq("id", messageId);

    let email = "";
    if (contactId) {
      const { data: contact } = await admin.from("contacts").select("email").eq("id", contactId).single();
      email = asString((contact as Record<string, unknown> | null)?.email).toLowerCase();

      await admin
        .from("contacts")
        .update({
          email_opt_out: true,
          complained_at: now,
          status: "opted_out",
          sequence_status: "halted",
          sequence_halt_reason: "complained",
          next_step_due_at: null,
        })
        .eq("id", contactId);

      await haltContact(admin, contactId, "complained");
    }

    if (email) {
      await admin.from("suppression_list").insert({
        email,
        domain: domainOf(email),
        reason: "spam_complaint",
      });
    }

    return Response.json({ ok: true, matched: true, type });
  }

  return Response.json({ ok: true, matched: true, ignored: true, type });
}
