// ─────────────────────────────────────────────────────────────────────────────
// portal/context.ts — resolves which PortalData a request should render.
//
// Two callers, one shape:
//   · /portal/**                      → a real client, resolved from
//                                       review_memberships. Never from a URL.
//   · /client-accounts/[id]/preview   → the owner previewing a client, gated by
//                                       proxy.ts and re-checked in the route.
//
// Keeping the decision here means the portal pages never branch on "am I a
// preview?" and can't accidentally take an identity from the URL.
// ─────────────────────────────────────────────────────────────────────────────
import "server-only";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { buildDemoPortalData } from "./demo-fixture";
import type { PortalData } from "./types";

/**
 * The owner's preview of one client.
 *
 * Uses that client's REAL onboarding record (plan, fee, properties, checklist)
 * with DEMO creative, because the live review_* tables are empty and the
 * linking migration is not applied. `source` stays "demo" so the banner shows.
 *
 * The select list is explicit and omits `notes` — internal notes must never be
 * loaded into a client-facing render, and a select("*") here would put them one
 * careless line away from being displayed.
 */
export async function loadOwnerPreviewData(recordId: string): Promise<PortalData> {
  const demo = buildDemoPortalData();
  if (!isAdminConfigured) return demo;

  const admin = getAdminClient();
  const { data: record } = await admin
    .from("client_onboarding_records")
    .select("id, company_name, contact_name, package_name, monthly_fee, property_count, billing_status, stripe_customer_id")
    .eq("id", recordId)
    .maybeSingle();

  if (!record) return demo;

  const { data: taskRows } = await admin
    .from("client_onboarding_tasks")
    .select("id, title, description, status, sort_order")
    .eq("onboarding_record_id", recordId)
    .order("sort_order", { ascending: true });

  const contactName = (record.contact_name as string | null) ?? null;
  const cleanCompany = ((record.company_name as string) ?? "").replace(/^\[(TEST|DEMO)\]\s*/i, "").trim();

  return {
    ...demo,
    organizationName: cleanCompany || demo.organizationName,
    viewerFirstName: contactName?.trim().split(/\s+/)[0] || "there",
    account: {
      id: (record.id as string) ?? null,
      companyName: (record.company_name as string) ?? "",
      contactName,
      packageName: (record.package_name as string) ?? null,
      monthlyFee: (record.monthly_fee as number) ?? null,
      propertyCount: (record.property_count as number) ?? null,
      billingStatus: (record.billing_status as string) ?? null,
      hasBillingPortal: Boolean(record.stripe_customer_id),
    },
    tasks:
      (taskRows ?? []).length > 0
        ? (taskRows ?? []).map((t) => ({
            id: t.id as string,
            title: t.title as string,
            description: (t.description as string) ?? null,
            status: (t.status as "pending" | "done" | "skipped") ?? "pending",
          }))
        : demo.tasks,
  };
}
