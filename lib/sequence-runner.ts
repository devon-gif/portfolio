import type { SupabaseClient } from "@supabase/supabase-js";
import { DRIP_SEQUENCE, getStep, TOTAL_DRIP_STEPS } from "./sequence";
import { renderTemplate, type RenderTemplate } from "./render";

type AdvanceResult = {
  ok: boolean;
  checked: number;
  created: number;
  halted: number;
  skipped: number;
  errors: string[];
};

const HALT_STATUSES = new Set([
  "replied",
  "not_interested",
  "do_not_contact",
  "unsubscribed",
  "opted_out",
  "bounced",
]);

function isoNow(): string {
  return new Date().toISOString();
}

function dueDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function toRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

async function haltContact(
  admin: SupabaseClient,
  contactId: string,
  reason: string
): Promise<void> {
  await admin
    .from("contacts")
    .update({
      sequence_status: "halted",
      sequence_halt_reason: reason,
      next_step_due_at: null,
    })
    .eq("id", contactId);
}

async function getTemplateForStep(admin: SupabaseClient, step: number): Promise<RenderTemplate> {
  const def = getStep(step);
  if (!def) throw new Error(`Unknown sequence step ${step}`);

  // Try tag-based template first. If schema/tags query fails, use fallback.
  try {
    const { data } = await admin
      .from("templates")
      .select("id, name, subject, body, type, tags")
      .eq("type", "email")
      .contains("tags", [def.templateTag])
      .limit(1)
      .maybeSingle();

    if (data?.subject && data?.body) return data as unknown as RenderTemplate;
  } catch {
    // fall through to fallback
  }

  return {
    name: `Cold sequence — ${def.label}`,
    subject: def.fallbackSubject,
    body: def.fallbackBody,
    type: "email",
  };
}

async function messageExistsForStep(
  admin: SupabaseClient,
  contactId: string,
  step: number
): Promise<boolean> {
  const { data } = await admin
    .from("messages")
    .select("id")
    .eq("contact_id", contactId)
    .eq("sequence_step", step)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

async function createSequenceMessage(
  admin: SupabaseClient,
  contact: Record<string, unknown>,
  nextStep: number,
  settings: Record<string, unknown> | null
): Promise<void> {
  const def = getStep(nextStep);
  if (!def) return;

  const tpl = await getTemplateForStep(admin, nextStep);
  const company = toRecord(contact.companies);
  const { subject, body } = renderTemplate(tpl, {
    contact,
    company,
    settings: settings ?? undefined,
  });

  // Step 1 must be reviewed. Steps 2-3 are pre-approved follow-ups.
  const status = nextStep === 1 ? "draft" : "approved_for_today";

  const { error } = await admin.from("messages").insert({
    contact_id: contact.id,
    company_id: contact.company_id ?? null,
    channel: "email",
    subject,
    body,
    status,
    template_id: null,
    sequence_step: nextStep,
    sequence_template_tag: def.templateTag,
  });

  if (error) throw new Error(error.message);
}

export async function advanceSequences(admin: SupabaseClient): Promise<AdvanceResult> {
  const result: AdvanceResult = { ok: true, checked: 0, created: 0, halted: 0, skipped: 0, errors: [] };

  const { data: settings } = await admin.from("app_settings").select("*").limit(1).single();

  const { data: contacts, error } = await admin
    .from("contacts")
    .select("*, companies(*)")
    .eq("sequence_status", "active")
    .lte("next_step_due_at", isoNow())
    .order("next_step_due_at", { ascending: true })
    .limit(200);

  if (error) {
    return { ...result, ok: false, errors: [error.message] };
  }

  for (const raw of contacts ?? []) {
    result.checked++;
    const contact = raw as Record<string, unknown>;
    const contactId = String(contact.id);

    const email = String(contact.email ?? "").trim();
    const status = String(contact.status ?? "").toLowerCase();
    const replied = Boolean(contact.replied_at);
    const optedOut = contact.email_opt_out === true;
    const bounced = contact.bounced === true;

    if (replied) {
      await haltContact(admin, contactId, "replied");
      result.halted++;
      continue;
    }
    if (optedOut) {
      await haltContact(admin, contactId, "opted_out");
      result.halted++;
      continue;
    }
    if (bounced) {
      await haltContact(admin, contactId, "bounced");
      result.halted++;
      continue;
    }
    if (status && HALT_STATUSES.has(status)) {
      await haltContact(admin, contactId, status);
      result.halted++;
      continue;
    }
    if (!email) {
      await haltContact(admin, contactId, "missing_email");
      result.halted++;
      continue;
    }

    const lastSentStep =
      typeof contact.sequence_step === "number"
        ? contact.sequence_step
        : Number(contact.sequence_step ?? 0);

    const nextStep = lastSentStep + 1;

    if (nextStep > TOTAL_DRIP_STEPS) {
      await admin
        .from("contacts")
        .update({
          sequence_status: "completed",
          sequence_completed_at: isoNow(),
          next_step_due_at: null,
        })
        .eq("id", contactId);
      result.skipped++;
      continue;
    }

    const exists = await messageExistsForStep(admin, contactId, nextStep);
    if (exists) {
      result.skipped++;
      continue;
    }

    try {
      await createSequenceMessage(admin, contact, nextStep, settings ?? null);
      result.created++;
    } catch (e) {
      result.errors.push(`${email}: ${e instanceof Error ? e.message : "unknown error"}`);
    }
  }

  result.ok = result.errors.length === 0;
  return result;
}

export async function enrollContactsInSequence(
  admin: SupabaseClient,
  contactIds: string[]
): Promise<{ ok: boolean; enrolled: number; errors: string[] }> {
  const ids = [...new Set(contactIds.map((x) => x.trim()).filter(Boolean))];
  if (ids.length === 0) return { ok: false, enrolled: 0, errors: ["No contact ids provided."] };

  const { error } = await admin
    .from("contacts")
    .update({
      sequence_status: "active",
      sequence_step: 0,
      next_step_due_at: isoNow(),
      sequence_started_at: isoNow(),
      sequence_halt_reason: null,
      sequence_completed_at: null,
    })
    .in("id", ids);

  if (error) return { ok: false, enrolled: 0, errors: [error.message] };
  return { ok: true, enrolled: ids.length, errors: [] };
}
