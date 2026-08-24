export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { CHECKOUT_OFFERS } from "@/lib/checkout-offers";
import { isStripeConfigured, stripeGet, stripeMode, stripePost } from "@/lib/stripe";

type StripePrice = {
  id: string;
  active: boolean;
  unit_amount: number | null;
  currency: string;
  lookup_key: string | null;
  recurring?: { interval?: string } | null;
};

type StripeList<T> = { data: T[] };

function isLocal(req: Request) {
  const host = new URL(req.url).hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function lookupKey(offerId: string, planId: string) {
  return `archer_${offerId}_${planId.replace(/-/g, "_")}_monthly`;
}

async function findPrice(key: string): Promise<StripePrice | null> {
  const result = await stripeGet<StripeList<StripePrice>>("prices", {
    "lookup_keys[0]": key,
    active: true,
    limit: 10,
  });
  return result.data[0] ?? null;
}

export async function GET(req: Request) {
  if (!isLocal(req) && process.env.ALLOW_STRIPE_CATALOG_SYNC !== "1") {
    return Response.json({ ok: false, error: "Catalog sync is restricted to localhost." }, { status: 403 });
  }
  if (!isStripeConfigured) {
    return Response.json({ ok: false, error: "Stripe is not configured." }, { status: 500 });
  }

  const items = [];
  for (const offerId of ["valencia", "elaine"] as const) {
    const offer = CHECKOUT_OFFERS[offerId];
    for (const plan of offer.plans) {
      const key = lookupKey(offer.id, plan.id);
      const price = await findPrice(key);
      items.push({
        offer_id: offer.id,
        plan_id: plan.id,
        plan_name: plan.name,
        lookup_key: key,
        expected_amount: plan.monthlyUnitAmount,
        stripe_price_id: price?.id ?? null,
        stripe_amount: price?.unit_amount ?? null,
        ready: Boolean(price && price.unit_amount === plan.monthlyUnitAmount && price.recurring?.interval === "month"),
      });
    }
  }

  return Response.json({ ok: true, stripe_mode: stripeMode, items });
}

export async function POST(req: Request) {
  if (!isLocal(req) && process.env.ALLOW_STRIPE_CATALOG_SYNC !== "1") {
    return Response.json({ ok: false, error: "Catalog sync is restricted to localhost." }, { status: 403 });
  }
  if (!isStripeConfigured) {
    return Response.json({ ok: false, error: "Stripe is not configured." }, { status: 500 });
  }

  const items = [];
  for (const offerId of ["valencia", "elaine"] as const) {
    const offer = CHECKOUT_OFFERS[offerId];
    for (const plan of offer.plans) {
      const key = lookupKey(offer.id, plan.id);
      const existing = await findPrice(key);

      if (existing && existing.unit_amount === plan.monthlyUnitAmount && existing.recurring?.interval === "month") {
        items.push({ offer_id: offer.id, plan_id: plan.id, plan_name: plan.name, lookup_key: key, price_id: existing.id, action: "existing" });
        continue;
      }

      const created = await stripePost<StripePrice>("prices", {
        currency: "usd",
        unit_amount: plan.monthlyUnitAmount,
        "recurring[interval]": "month",
        lookup_key: key,
        transfer_lookup_key: true,
        nickname: `${offer.id} · ${plan.name} · monthly`,
        "product_data[name]": `Archer Design — ${plan.name}`,
        "metadata[archer_offer_id]": offer.id,
        "metadata[archer_plan_id]": plan.id,
        "metadata[pricing_model]": plan.pricingModel,
      });

      items.push({ offer_id: offer.id, plan_id: plan.id, plan_name: plan.name, lookup_key: key, price_id: created.id, action: existing ? "replaced" : "created" });
    }
  }

  return Response.json({ ok: true, stripe_mode: stripeMode, items });
}
