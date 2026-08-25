import { redirect } from "next/navigation";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { getAuthContext } from "@/lib/auth/server";
import { buildDemoPortalData } from "@/lib/portal/demo-fixture";
import { PortalDashboard } from "@/app/portal/components/PortalDashboard";
import type { PortalData } from "@/lib/portal/types";
import "@/app/portal/portal.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Client dashboard preview — Archer Design",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Owner-only "View client dashboard".
 *
 * This is the ONLY place a client's portal is addressed by a URL id, and it is
 * owner-gated twice: proxy.ts rejects non-owner sessions before the route runs,
 * and getAuthContext() is checked again here. Production client authorization
 * never uses this path — /portal resolves the organization from
 * review_memberships and accepts no id at all.
 *
 * It renders the SAME PortalDashboard component a real client gets, so what is
 * reviewed here is genuinely the client experience.
 *
 * Data source: the client's real onboarding record (plan, fee, properties,
 * checklist) plus DEMO creative items, because the live review_* tables are
 * empty and the migration linking a CRM record to a review organization is
 * written but not applied. Internal notes are never loaded — the select list
 * below is explicit and omits `notes`.
 */
export default async function ClientPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAuthContext();
  if (ctx.role !== "owner") redirect("/login");

  const { id } = await params;
  const demo = buildDemoPortalData();

  if (!isAdminConfigured) {
    return (
      <div className="archer-portal">
        <PortalDashboard data={demo} backHref={`/client-accounts/${id}`} />
      </div>
    );
  }

  // Explicit column list. `notes` is internal-only and must never be selected
  // into a client-facing render — a select("*") here would put it one careless
  // JSX line away from being displayed.
  const admin = getAdminClient();
  const { data: record } = await admin
    .from("client_onboarding_records")
    .select("id, company_name, contact_name, package_name, monthly_fee, property_count, billing_status, stripe_customer_id")
    .eq("id", id)
    .maybeSingle();

  if (!record) {
    return (
      <div className="archer-portal">
        <PortalDashboard data={demo} backHref={`/client-accounts/${id}`} />
      </div>
    );
  }

  const { data: taskRows } = await admin
    .from("client_onboarding_tasks")
    .select("id, title, description, status, sort_order")
    .eq("onboarding_record_id", id)
    .order("sort_order", { ascending: true });

  const contactName = (record.contact_name as string | null) ?? null;
  const firstName = contactName?.trim().split(/\s+/)[0] || "there";

  const data: PortalData = {
    // Still "demo" — the creative items below are fixture data, and the banner
    // must say so even though the plan and checklist are this client's real
    // values.
    source: "demo",
    organizationId: null,
    organizationName: (record.company_name as string) ?? demo.organizationName,
    viewerFirstName: firstName,
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
    properties: demo.properties,
    tasks:
      (taskRows ?? []).length > 0
        ? (taskRows ?? []).map((t) => ({
            id: t.id as string,
            title: t.title as string,
            description: (t.description as string) ?? null,
            status: (t.status as "pending" | "done" | "skipped") ?? "pending",
          }))
        : demo.tasks,
    items: demo.items,
    otherOrganizations: [],
  };

  return (
    <div className="archer-portal">
      <PortalDashboard data={data} backHref={`/client-accounts/${id}`} />
    </div>
  );
}
