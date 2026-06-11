// POST /api/prospects/draft  { contact_id }
//
// Creates a single email draft (status='draft') for a contact.
// NEVER sends. Checks suppression list first.
// Safe to call multiple times — returns 409 if a draft/sent already exists.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { renderTemplate, isUuid } from "@/lib/render";

const DEFAULT_TEMPLATE = {
  subject: "A creative partner for {{company_name}}",
  body: [
    "Hi {{first_name}},",
    "",
    "I work with hotel and hospitality teams as a dedicated creative partner — social graphics, short-form motion, F&B and event promos, and seasonal campaign assets, built from the photos and details you already have.",
    "",
    "{{stats_block}}",
    "",
    "Worth a quick look for {{company_name}}?",
    "",
    "Best,",
    "{{sender_name}}",
    "",
    "{{compliance_block}}",
  ].join("\n"),
  type: "email",
};

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  let body: { contact_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const contactId = body.contact_id?.trim();
  if (!contactId) {
    return Response.json({ ok: false, error: "contact_id is required." }, { status: 400 });
  }

  const admin = getAdminClient();

  // Guard: no existing active message
  const { data: existing } = await admin
    .from("messages")
    .select("id, status")
    .eq("contact_id", contactId)
    .in("status", ["draft", "needs_review", "approved", "approved_for_today", "scheduled", "sending", "sent"])
    .limit(1)
    .maybeSingle();

  if (existing) {
    return Response.json(
      { ok: false, error: `Already has a ${existing.status} message (id: ${existing.id}).` },
      { status: 409 },
    );
  }

  // Get contact with company join
  const { data: contact, error: cErr } = await admin
    .from("contacts")
    .select("id, company_id, first_name, last_name, email, status, email_opt_out, bounced, companies(name, personalization_angle, specific_use_cases, specific_client_type)")
    .eq("id", contactId)
    .single();

  if (cErr || !contact) {
    return Response.json({ ok: false, error: "Contact not found." }, { status: 404 });
  }

  if (!contact.email) {
    return Response.json({ ok: false, error: "Contact has no email address." }, { status: 422 });
  }

  // Safety: skip opted out / bounced
  if (contact.email_opt_out === true) {
    return Response.json({ ok: false, error: "Contact has opted out." }, { status: 422 });
  }
  if (contact.bounced === true) {
    return Response.json({ ok: false, error: "Contact email has bounced." }, { status: 422 });
  }
  const blockedStatuses = new Set(["sent", "replied", "not_interested", "do_not_contact", "unsubscribed"]);
  if (contact.status && blockedStatuses.has(contact.status)) {
    return Response.json({ ok: false, error: `Contact status is "${contact.status}".` }, { status: 422 });
  }

  // Suppression check
  const email = contact.email.toLowerCase();
  const domain = email.includes("@") ? email.split("@")[1] : "";
  const { data: supp } = await admin.from("suppression_list").select("email, domain, company_name").limit(1000);
  const suppEmails = new Set((supp ?? []).map((s: { email?: string | null }) => (s.email ?? "").toLowerCase()));
  const suppDomains = new Set((supp ?? []).map((s: { domain?: string | null }) => (s.domain ?? "").toLowerCase()));
  if (suppEmails.has(email) || (domain && suppDomains.has(domain))) {
    return Response.json({ ok: false, error: "Contact is on the suppression list." }, { status: 422 });
  }

  // Template
  const { data: tplRows } = await admin
    .from("templates")
    .select("id, name, subject, body, type, tags")
    .eq("type", "email")
    .limit(1);
  const tpl = (tplRows && tplRows.length > 0) ? tplRows[0] : DEFAULT_TEMPLATE;

  // Settings
  const { data: settings } = await admin
    .from("app_settings")
    .select("sender_name, email_signature, opt_out_line, portfolio_url, mailing_address")
    .limit(1)
    .maybeSingle();

  // Render
  const { subject, body: msgBody } = renderTemplate(tpl as Parameters<typeof renderTemplate>[0], {
    contact: contact as Record<string, unknown>,
    company: (contact.companies as unknown as Record<string, unknown> | null) ?? null,
    settings: settings ?? undefined,
  });

  // Insert draft
  const { data: msg, error: insertErr } = await admin
    .from("messages")
    .insert({
      contact_id: contactId,
      company_id: contact.company_id ?? null,
      channel: "email",
      subject,
      body: msgBody,
      status: "draft",
      template_id: isUuid(String((tpl as { id?: unknown }).id)) ? (tpl as { id?: string }).id : null,
    })
    .select("id, status, subject")
    .single();

  if (insertErr) {
    return Response.json({ ok: false, error: insertErr.message }, { status: 500 });
  }

  return Response.json({ ok: true, message: msg });
}
