// Compliance helpers: unsubscribe links + required footer (CAN-SPAM).
// Rule: an email must NEVER be sent without a working unsubscribe link and a
// physical mailing address. The send routes throw if these can't be produced.
import { randomUUID } from "crypto";
import { applyVariables, buildVariables, type RenderContact, type RenderCompany } from "./render";

export function generateUnsubscribeToken(): string {
  // Two UUIDs joined => long, unguessable, URL-safe token.
  return (randomUUID() + randomUUID()).replace(/-/g, "");
}

export function appBaseUrl(): string {
  return (process.env.PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function buildUnsubscribeUrl(token: string): string {
  const t = (token || "").trim();
  if (!t) throw new Error("Cannot build unsubscribe URL: missing token.");
  return `${appBaseUrl()}/unsubscribe/${encodeURIComponent(t)}`;
}

/**
 * The required footer block: unsubscribe link + physical mailing address.
 * Throws if either piece is missing — callers must not send without it.
 */
export function buildComplianceBlock(opts: {
  unsubscribeUrl: string;
  mailingAddress: string;
  optOutLine?: string;
}): string {
  const url = (opts.unsubscribeUrl || "").trim();
  const addr = (opts.mailingAddress || "").trim();
  if (!url) throw new Error("Refusing to send: unsubscribe link could not be generated.");
  if (!addr) throw new Error("Refusing to send: physical mailing address is not set in Settings.");

  const optOut = (opts.optOutLine || "").trim();
  return [
    "—",
    optOut || "You received this email as part of a business outreach.",
    `Unsubscribe: ${url}`,
    "",
    addr,
  ].join("\n");
}

/**
 * Finalize an email body for sending:
 *  - substitutes any remaining {{variables}} (incl. {{unsubscribe_url}},
 *    {{mailing_address}}, {{compliance_block}})
 *  - guarantees the unsubscribe URL and mailing address are present, appending
 *    the compliance block if the template didn't include {{compliance_block}}.
 */
export function finalizeEmailBody(
  rawBody: string,
  ctx: {
    contact: RenderContact;
    company?: RenderCompany;
    settings?: {
      sender_name?: string | null;
      email_signature?: string | null;
      opt_out_line?: string | null;
      portfolio_url?: string | null;
      mailing_address?: string | null;
    };
    unsubscribeUrl: string;
  }
): string {
  const complianceBlock = buildComplianceBlock({
    unsubscribeUrl: ctx.unsubscribeUrl,
    mailingAddress: ctx.settings?.mailing_address ?? "",
    optOutLine: ctx.settings?.opt_out_line ?? "",
  });

  const vars = {
    ...buildVariables(ctx.contact, ctx.company, ctx.settings ?? undefined),
    unsubscribe_url: ctx.unsubscribeUrl,
    mailing_address: (ctx.settings?.mailing_address ?? "").trim(),
    compliance_block: complianceBlock,
  };

  let body = applyVariables(rawBody, vars);

  // Safety net: if the template omitted the compliance block, append it so the
  // unsubscribe link + address are always present.
  if (!body.includes(ctx.unsubscribeUrl)) {
    body = `${body.trimEnd()}\n\n${complianceBlock}`;
  }
  return body;
}
