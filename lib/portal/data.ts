// ─────────────────────────────────────────────────────────────────────────────
// portal/data.ts — the live client-portal data layer.
//
// SECURITY MODEL
// Every read here goes through the caller's own cookie-bound Supabase client
// (lib/auth/server.ts), so Postgres RLS decides what comes back:
//
//   review_items      → admin, or org in review_member_org_ids() AND not draft
//   review_versions   → via the parent item
//   review_actions    → via the parent item
//   review_properties → org in review_member_org_ids()
//
// Nothing in this module filters by an id taken from a URL. The organization is
// derived from review_memberships for the signed-in user. Passing a different
// organizationId cannot widen access — RLS returns zero rows for an org the
// caller is not a member of — but the entry point still refuses it explicitly
// so the failure is a clear error rather than a confusing empty page.
//
// Names come from the review_participants RPC, never from review_profiles
// directly: that table's policy is "your own row, or you are an admin", so a
// client reading it would see nobody but themselves, and it carries emails.
// ─────────────────────────────────────────────────────────────────────────────
import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getServerSupabase, type AuthContext } from "@/lib/auth/server";
import type {
  OnboardingTask,
  PortalAccount,
  PortalData,
  ReviewAction,
  ReviewItem,
  ReviewStatus,
  ReviewVersion,
} from "./types";

const MEDIA_BUCKET = "review-media";
const SIGNED_URL_TTL_SECONDS = 600;

type RawVersion = {
  id: string;
  version_number: number;
  storage_path: string;
  original_filename: string | null;
  mime_type: string | null;
  created_at: string;
};

type RawAction = {
  id: string;
  user_id: string | null;
  action: string;
  message: string | null;
  created_at: string;
};

type RawItem = {
  id: string;
  organization_id: string;
  property_id: string;
  title: string;
  description: string | null;
  media_type: "image" | "video";
  current_status: string;
  current_version: number;
  created_at: string;
  updated_at: string;
  review_properties: { name: string } | { name: string }[] | null;
  review_versions: RawVersion[] | null;
  review_actions: RawAction[] | null;
};

const ITEM_SELECT = `
  id, organization_id, property_id, title, description, media_type,
  current_status, current_version, created_at, updated_at,
  review_properties ( name ),
  review_versions ( id, version_number, storage_path, original_filename, mime_type, created_at ),
  review_actions ( id, user_id, action, message, created_at )
`;

function first<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

type Participant = { displayName: string; role: "admin" | "client" };

async function resolveParticipants(supabase: SupabaseClient, userIds: string[]): Promise<Map<string, Participant>> {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  const map = new Map<string, Participant>();
  if (unique.length === 0) return map;

  const { data, error } = await supabase.rpc("review_participants", { p_user_ids: unique });
  if (error || !data) return map;

  for (const row of data as { user_id: string; display_name: string | null; role: string }[]) {
    map.set(row.user_id, {
      displayName: row.display_name || "Someone",
      role: row.role === "admin" ? "admin" : "client",
    });
  }
  return map;
}

async function signVersion(supabase: SupabaseClient, storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);
  if (error || !data) return null;
  return data.signedUrl;
}

async function toItem(supabase: SupabaseClient, raw: RawItem, participants: Map<string, Participant>): Promise<ReviewItem> {
  const versions = [...(raw.review_versions ?? [])].sort((a, b) => b.version_number - a.version_number);

  const signed: ReviewVersion[] = await Promise.all(
    versions.map(async (v) => ({
      id: v.id,
      versionNumber: v.version_number,
      storagePath: v.storage_path,
      originalFilename: v.original_filename,
      mimeType: v.mime_type,
      createdAt: v.created_at,
      url: await signVersion(supabase, v.storage_path),
    }))
  );

  const actions: ReviewAction[] = [...(raw.review_actions ?? [])]
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((a) => {
      const who = a.user_id ? participants.get(a.user_id) : undefined;
      return {
        id: a.id,
        action: a.action,
        message: a.message,
        createdAt: a.created_at,
        byName: who?.displayName ?? "Someone",
        byRole: who?.role ?? "admin",
      };
    });

  return {
    id: raw.id,
    organizationId: raw.organization_id,
    propertyId: raw.property_id,
    propertyName: first(raw.review_properties)?.name ?? "",
    title: raw.title,
    description: raw.description,
    mediaType: raw.media_type,
    status: raw.current_status as ReviewStatus,
    currentVersion: raw.current_version,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    versions: signed,
    actions,
  };
}

/**
 * The CRM record for an organization.
 *
 * Prefers the review_organization_id FK added by migration 20260824a. That
 * migration is written but NOT yet applied, so the column may not exist —
 * Postgres answers with 42703 (undefined_column), which is caught here and
 * falls back to matching the signed-in user's email against contact_email.
 *
 * The email match is a stopgap, not a key: it is case-sensitive to whatever the
 * CRM row holds and breaks if a client signs in with a different address. Once
 * the migration is applied the FK path takes over automatically and this
 * fallback stops being reached.
 */
async function loadAccount(
  supabase: SupabaseClient,
  organizationId: string,
  viewerEmail: string | null
): Promise<{ account: PortalAccount; recordId: string | null }> {
  const columns = "id, company_name, contact_name, package_name, monthly_fee, property_count, billing_status, stripe_customer_id";

  const byLink = await supabase
    .from("client_onboarding_records")
    .select(columns)
    .eq("review_organization_id", organizationId)
    .maybeSingle();

  let row = byLink.data as Record<string, unknown> | null;

  const linkColumnMissing = byLink.error?.code === "42703";
  if ((linkColumnMissing || !row) && viewerEmail) {
    const byEmail = await supabase
      .from("client_onboarding_records")
      .select(columns)
      .eq("contact_email", viewerEmail)
      .maybeSingle();
    if (!byEmail.error && byEmail.data) row = byEmail.data as Record<string, unknown>;
  }

  if (!row) {
    return {
      recordId: null,
      account: {
        id: null,
        companyName: "",
        contactName: null,
        packageName: null,
        monthlyFee: null,
        propertyCount: null,
        billingStatus: null,
        hasBillingPortal: false,
      },
    };
  }

  return {
    recordId: (row.id as string) ?? null,
    account: {
      id: (row.id as string) ?? null,
      companyName: (row.company_name as string) ?? "",
      contactName: (row.contact_name as string) ?? null,
      packageName: (row.package_name as string) ?? null,
      monthlyFee: (row.monthly_fee as number) ?? null,
      propertyCount: (row.property_count as number) ?? null,
      billingStatus: (row.billing_status as string) ?? null,
      // The id itself is never sent to the browser — only whether one exists.
      hasBillingPortal: Boolean(row.stripe_customer_id),
    },
  };
}

async function loadTasks(supabase: SupabaseClient, recordId: string | null): Promise<OnboardingTask[]> {
  if (!recordId) return [];
  const { data, error } = await supabase
    .from("client_onboarding_tasks")
    .select("id, title, description, status, sort_order")
    .eq("onboarding_record_id", recordId)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map((t) => ({
    id: t.id as string,
    title: t.title as string,
    description: (t.description as string) ?? null,
    status: (t.status as OnboardingTask["status"]) ?? "pending",
  }));
}

/**
 * Loads the portal for a signed-in client.
 *
 * `organizationId` may be supplied to pick between multiple memberships, but it
 * is validated against ctx.organizationIds first — a value from a URL can never
 * reach the query.
 */
export async function loadPortalData(ctx: AuthContext, organizationId?: string): Promise<PortalData | null> {
  if (!ctx.user || ctx.organizationIds.length === 0) return null;

  const orgId =
    organizationId && ctx.organizationIds.includes(organizationId) ? organizationId : ctx.organizationIds[0];

  const supabase = await getServerSupabase();
  if (!supabase) return null;

  const [orgsResult, propsResult, itemsResult] = await Promise.all([
    supabase.from("review_organizations").select("id, name").in("id", ctx.organizationIds),
    supabase.from("review_properties").select("id, name").eq("organization_id", orgId).eq("active", true).order("name"),
    supabase.from("review_items").select(ITEM_SELECT).eq("organization_id", orgId).order("updated_at", { ascending: false }),
  ]);

  const orgs = (orgsResult.data ?? []) as { id: string; name: string }[];
  const organizationName = orgs.find((o) => o.id === orgId)?.name ?? "";

  const rawItems = (itemsResult.data ?? []) as unknown as RawItem[];
  const participants = await resolveParticipants(
    supabase,
    rawItems.flatMap((r) => (r.review_actions ?? []).map((a) => a.user_id ?? ""))
  );
  const items = await Promise.all(rawItems.map((r) => toItem(supabase, r, participants)));

  const { account, recordId } = await loadAccount(supabase, orgId, ctx.user.email);
  const tasks = await loadTasks(supabase, recordId);

  const viewerFirstName =
    account.contactName?.trim().split(/\s+/)[0] || ctx.user.email?.split("@")[0] || "there";

  return {
    source: "live",
    organizationId: orgId,
    organizationName: organizationName || account.companyName || "Your workspace",
    viewerFirstName,
    account,
    properties: (propsResult.data ?? []) as { id: string; name: string }[],
    tasks,
    items,
    otherOrganizations: orgs.filter((o) => o.id !== orgId),
  };
}
