// Sending guards + IONOS SMTP integration (server-only).
import tls from "node:tls";
import type { SupabaseClient } from "@supabase/supabase-js";

export const MAX_DAILY_LIMIT = 200;
export const DEFAULT_DAILY_LIMIT = 20;
export const THROTTLE_MIN_MS = 10_000; // 10s
export const THROTTLE_MAX_MS = 30_000; // 30s

const SMTP_HOST = "smtp.ionos.com";
const SMTP_PORT = 465;
const SMTP_USER = "hello@archerdesign.shop";
const SMTP_FROM = "Archer Design <hello@archerdesign.shop>";
const SMTP_REPLY_TO = "hello@archerdesign.shop";

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

export interface SendEmailArgs {
  to: string;
  subject: string;
  text: string;
  from?: string;
  replyTo?: string;
}

type SmtpReply = { code: number; lines: string[] };

function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function dotStuff(text: string): string {
  return text.replace(/(^|\r?\n)\./g, "$1..");
}

function smtpCommand(socket: tls.TLSSocket, command: string): Promise<SmtpReply> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onError = (err: Error) => cleanup(() => reject(err));
    const onData = (chunk: Buffer | string) => {
      buffer += chunk.toString();
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      const last = lines[lines.length - 1];
      if (!/^\d{3} /.test(last)) return;
      const code = Number(last.slice(0, 3));
      cleanup(() => resolve({ code, lines }));
    };
    const cleanup = (done: () => void) => {
      socket.off("data", onData);
      socket.off("error", onError);
      done();
    };
    socket.on("data", onData);
    socket.on("error", onError);
    if (command) socket.write(`${command}\r\n`);
  });
}

async function expect(socket: tls.TLSSocket, command: string, allowed: number[]): Promise<SmtpReply> {
  const reply = await smtpCommand(socket, command);
  if (!allowed.includes(reply.code)) {
    throw new Error(`SMTP ${reply.code}: ${reply.lines.join(" ")}`);
  }
  return reply;
}

/** Sends a plain-text email through the existing IONOS mailbox. */
export async function sendEmail(args: SendEmailArgs): Promise<string> {
  const password = process.env.IONOS_SMTP_PASSWORD ?? "";
  if (!password) throw new Error("IONOS_SMTP_PASSWORD is not set.");

  const from = sanitizeHeader(args.from || SMTP_FROM);
  const replyTo = sanitizeHeader(args.replyTo || SMTP_REPLY_TO);
  const to = sanitizeHeader(args.to);
  const subject = sanitizeHeader(args.subject);
  if (!to) throw new Error("Recipient email is required.");

  const messageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@archerdesign.shop>`;
  const body = dotStuff(args.text.replace(/\r?\n/g, "\r\n"));
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Reply-To: ${replyTo}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: ${messageId}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");

  const socket = tls.connect({
    host: SMTP_HOST,
    port: SMTP_PORT,
    servername: SMTP_HOST,
    rejectUnauthorized: true,
  });
  socket.setTimeout(30_000, () => socket.destroy(new Error("SMTP connection timed out.")));

  try {
    await expect(socket, "", [220]);
    await expect(socket, "EHLO archerdesign.shop", [250]);
    await expect(socket, "AUTH LOGIN", [334]);
    await expect(socket, Buffer.from(SMTP_USER).toString("base64"), [334]);
    await expect(socket, Buffer.from(password).toString("base64"), [235]);
    await expect(socket, `MAIL FROM:<${SMTP_USER}>`, [250]);
    await expect(socket, `RCPT TO:<${to}>`, [250, 251]);
    await expect(socket, "DATA", [354]);
    const sent = await expect(socket, `${message}\r\n.`, [250]);
    await expect(socket, "QUIT", [221]);
    return `${messageId}:${sent.code}`;
  } finally {
    socket.destroy();
  }
}

/** Random throttle delay (ms) between 10–30 seconds. */
export function throttleDelayMs(): number {
  return THROTTLE_MIN_MS + Math.floor(Math.random() * (THROTTLE_MAX_MS - THROTTLE_MIN_MS + 1));
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
