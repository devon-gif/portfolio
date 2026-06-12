// ─────────────────────────────────────────────────────────────────────────────
// Stripe helper — SERVER ONLY. Uses fetch against the Stripe REST API so no new
// dependency is required. Never import from client components.
// Secrets come from env (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) and are
// never logged or returned to the client.
// ─────────────────────────────────────────────────────────────────────────────
import { createHmac, timingSafeEqual } from "crypto";

const KEY = process.env.STRIPE_SECRET_KEY ?? "";
export const isStripeConfigured = !!KEY;

type Params = Record<string, string | number | boolean | undefined>;

function encode(params: Params): URLSearchParams {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) body.append(k, String(v));
  }
  return body;
}

/** POST to a Stripe endpoint. Throws with Stripe's error message (no secrets). */
export async function stripePost<T = Record<string, unknown>>(path: string, params: Params): Promise<T> {
  if (!KEY) throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing).");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encode(params),
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(json.error?.message ?? `Stripe error (${res.status})`);
  return json;
}

/** Find-or-create a Stripe customer for an onboarding record. */
export async function ensureCustomer(opts: {
  existingId?: string | null;
  email?: string | null;
  name: string;
  recordId: string;
}): Promise<string> {
  if (opts.existingId) return opts.existingId;
  const customer = await stripePost<{ id: string }>("customers", {
    name: opts.name,
    email: opts.email ?? undefined,
    "metadata[onboarding_record_id]": opts.recordId,
  });
  return customer.id;
}

/** Verify a Stripe webhook signature (Stripe-Signature header). */
export function verifyStripeSignature(payload: string, sigHeader: string | null, secret: string): boolean {
  if (!sigHeader || !secret) return false;
  let t = "";
  const v1s: string[] = [];
  for (const part of sigHeader.split(",")) {
    const [k, v] = part.split("=");
    if (k === "t") t = v;
    if (k === "v1") v1s.push(v);
  }
  if (!t || v1s.length === 0) return false;
  // Reject very old timestamps (5 min tolerance) to limit replay.
  const age = Math.abs(Date.now() / 1000 - Number(t));
  if (!Number.isFinite(age) || age > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return v1s.some((v1) => {
    try {
      return v1.length === expected.length && timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
    } catch {
      return false;
    }
  });
}
