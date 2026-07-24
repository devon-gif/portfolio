"use client";

// Archer Review — Supabase-backed repository. Used whenever
// isReviewSupabaseConfigured() is true (see lib/review/config.ts). Every
// write goes through a SECURITY DEFINER Postgres function created in
// supabase/migrations/20260723_review_portal_platform.sql (review_create_item,
// review_send_to_review, review_upload_version, review_archive_item,
// review_reopen_item, review_client_decide, review_send_message,
// review_mark_message_read) rather than raw table writes, so authorization
// is enforced in Postgres, not just in this file. Reads rely on Postgres RLS
// to automatically scope rows to whichever organization(s) the signed-in
// user belongs to — there is no client-side filtering standing in for
// security here, only for convenience (e.g. picking a property to upload
// against).
//
// This file never imports lib/supabase-admin.ts / the service-role key —
// only the anon-key browser client from lib/supabase.ts, exactly like every
// other Supabase-backed page in this project.

import { supabase } from "@/lib/supabase";
import type {
  ChatMessageRecord,
  ClientDecision,
  HistoryEntry,
  OrganizationRecord,
  PropertyRecord,
  ReviewItemRecord,
  ReviewProfile,
  ReviewStatus,
  Unsubscribe,
} from "./types";

const BUCKET = "review-media";

const DB_TO_UI_STATUS: Record<string, ReviewStatus> = {
  draft: "Draft",
  ready_for_review: "Awaiting review",
  approved: "Approved",
  changes_requested: "Revision requested",
  new_direction_requested: "New direction requested",
  archived: "Archived",
};

const UI_DECISION_TO_DB: Record<ClientDecision, string> = {
  Approved: "approved",
  "Revision requested": "changes_requested",
  "New direction requested": "new_direction_requested",
};

const ACTION_VERB: Record<string, string> = {
  submitted: "submitted for review",
  approved: "approved",
  changes_requested: "requested a revision",
  new_direction_requested: "requested a new direction",
  version_uploaded: "uploaded a new version",
  archived: "archived this item",
  reopened: "reopened this item",
};

type RawVersion = {
  id: string;
  version_number: number;
  storage_path: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size: number | null;
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
  review_organizations: { name: string } | { name: string }[] | null;
  review_versions: RawVersion[] | null;
  review_actions: RawAction[] | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

async function profileNamesFor(userIds: string[]): Promise<Map<string, string>> {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  const map = new Map<string, string>();
  if (unique.length === 0) return map;

  const { data, error } = await supabase
    .from("review_profiles")
    .select("user_id, first_name, email")
    .in("user_id", unique);

  if (error) throw new Error(error.message);
  for (const row of data ?? []) {
    map.set(row.user_id, row.first_name || row.email?.split("@")[0] || "Someone");
  }
  return map;
}

function buildHistory(actions: RawAction[], names: Map<string, string>): HistoryEntry[] {
  return [...actions]
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((a) => {
      const by = names.get(a.user_id ?? "") ?? "Someone";
      const verb = ACTION_VERB[a.action] ?? a.action;
      const message = a.message ? `${verb}: ${a.message}` : `${verb}.`;
      return {
        id: a.id,
        by,
        message: `${message.charAt(0).toUpperCase()}${message.slice(1)}`,
        createdAt: a.created_at,
      };
    });
}

function latestClientDecision(actions: RawAction[]): { by: string; at: string; feedback: string } | null {
  const decisionActions = actions
    .filter((a) => a.action === "approved" || a.action === "changes_requested" || a.action === "new_direction_requested")
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const latest = decisionActions[0];
  if (!latest) return null;
  return { by: latest.user_id ?? "", at: latest.created_at, feedback: latest.message ?? "" };
}

function toRecord(raw: RawItem, names: Map<string, string>): ReviewItemRecord {
  const property = one(raw.review_properties);
  const organization = one(raw.review_organizations);
  const versions = raw.review_versions ?? [];
  const actions = raw.review_actions ?? [];
  const currentVersion = [...versions].sort((a, b) => b.version_number - a.version_number)[0] ?? null;
  const decision = latestClientDecision(actions);

  return {
    id: raw.id,
    organizationId: raw.organization_id,
    organizationName: organization?.name ?? "",
    propertyId: raw.property_id,
    property: property?.name ?? "",
    title: raw.title,
    description: raw.description ?? "",
    kind: raw.media_type,
    assetSource: "storage",
    assetRef: currentVersion?.storage_path ?? "",
    assetName: currentVersion?.original_filename ?? undefined,
    assetSize: currentVersion?.file_size ?? undefined,
    version: raw.current_version,
    status: DB_TO_UI_STATUS[raw.current_status] ?? "Draft",
    dueDate: "",
    clientFeedback: decision?.feedback ?? "",
    internalNote: raw.description ?? "",
    decisionBy: decision ? names.get(decision.by) ?? "" : "",
    decisionAt: decision?.at ?? "",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    history: buildHistory(actions, names),
  };
}

const ITEM_SELECT = `
  id, organization_id, property_id, title, description, media_type,
  current_status, current_version, created_at, updated_at,
  review_properties ( name ),
  review_organizations ( name ),
  review_versions ( id, version_number, storage_path, original_filename, mime_type, file_size, created_at ),
  review_actions ( id, user_id, action, message, created_at )
`;

export async function listOrganizations(): Promise<OrganizationRecord[]> {
  const { data, error } = await supabase.from("review_organizations").select("id, name, slug").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listProperties(organizationId?: string): Promise<PropertyRecord[]> {
  let query = supabase
    .from("review_properties")
    .select("id, organization_id, name, slug, active")
    .eq("active", true)
    .order("name");
  if (organizationId) query = query.eq("organization_id", organizationId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    slug: row.slug,
    active: row.active,
  }));
}

export async function listReviewItems(
  options: { organizationId?: string; propertyId?: string; forClient?: boolean } = {}
): Promise<ReviewItemRecord[]> {
  let query = supabase.from("review_items").select(ITEM_SELECT).order("updated_at", { ascending: false });
  if (options.organizationId) query = query.eq("organization_id", options.organizationId);
  if (options.propertyId) query = query.eq("property_id", options.propertyId);
  if (options.forClient) query = query.neq("current_status", "draft");

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as unknown as RawItem[];

  const allUserIds = rows.flatMap((r) => (r.review_actions ?? []).map((a) => a.user_id ?? ""));
  const names = await profileNamesFor(allUserIds);

  return rows.map((r) => toRecord(r, names));
}

export function subscribeToChanges(organizationId: string, onChange: () => void): Unsubscribe {
  const channel = supabase
    .channel(`review-org-${organizationId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "review_items", filter: `organization_id=eq.${organizationId}` },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "review_actions" },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "review_messages", filter: `organization_id=eq.${organizationId}` },
      onChange
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "-");
}

async function uploadToReviewMedia(organizationId: string, propertyId: string, version: number, file: File): Promise<string> {
  const path = `${organizationId}/${propertyId}/${crypto.randomUUID()}-v${version}-${sanitizeFilename(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  return path;
}

export async function createDraftItem(input: {
  organizationId: string;
  propertyId: string;
  title: string;
  description: string;
  file: File;
}): Promise<ReviewItemRecord> {
  const storagePath = await uploadToReviewMedia(input.organizationId, input.propertyId, 1, input.file);
  const mediaType = input.file.type.startsWith("video/") ? "video" : "image";

  const { data, error } = await supabase.rpc("review_create_item", {
    p_organization_id: input.organizationId,
    p_property_id: input.propertyId,
    p_title: input.title,
    p_description: input.description,
    p_media_type: mediaType,
    p_storage_path: storagePath,
    p_original_filename: input.file.name,
    p_mime_type: input.file.type,
    p_file_size: input.file.size,
  });
  if (error) throw new Error(error.message);

  const items = await listReviewItems({ organizationId: input.organizationId, propertyId: input.propertyId });
  const created = items.find((i) => i.id === data);
  if (!created) throw new Error("The item was created but could not be reloaded.");
  return created;
}

export async function sendToReview(itemId: string): Promise<void> {
  const { error } = await supabase.rpc("review_send_to_review", { p_review_item_id: itemId });
  if (error) throw new Error(error.message);
}

export async function uploadNewVersion(
  itemId: string,
  file: File,
  note: string,
  context: { organizationId: string; propertyId: string; nextVersion: number }
): Promise<void> {
  const storagePath = await uploadToReviewMedia(context.organizationId, context.propertyId, context.nextVersion, file);
  const { error } = await supabase.rpc("review_upload_version", {
    p_review_item_id: itemId,
    p_storage_path: storagePath,
    p_original_filename: file.name,
    p_mime_type: file.type,
    p_file_size: file.size,
    p_note: note || null,
  });
  if (error) throw new Error(error.message);
}

export async function archiveItem(itemId: string): Promise<void> {
  const { error } = await supabase.rpc("review_archive_item", { p_review_item_id: itemId });
  if (error) throw new Error(error.message);
}

export async function reopenItem(itemId: string): Promise<void> {
  const { error } = await supabase.rpc("review_reopen_item", { p_review_item_id: itemId });
  if (error) throw new Error(error.message);
}

export async function clientDecide(itemId: string, decision: ClientDecision, note: string): Promise<void> {
  if (decision !== "Approved" && !note.trim()) {
    throw new Error("Please include feedback before requesting a change.");
  }
  const { error } = await supabase.rpc("review_client_decide", {
    p_review_item_id: itemId,
    p_decision: UI_DECISION_TO_DB[decision],
    p_message: note || null,
  });
  if (error) throw new Error(error.message);
}

export async function getSignedReviewMediaUrl(storagePath: string, expiresInSeconds = 600): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, expiresInSeconds);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

/**
 * A signed URL configured for downloading, distinct from
 * getSignedReviewMediaUrl above (which MediaPreview uses for inline
 * playback and must NOT carry a download disposition, or the <video>/<img>
 * preview would break). Supabase's `download` option sets
 * `Content-Disposition: attachment; filename="..."` on the response, so even
 * a plain link click against this URL would save rather than play the file
 * — on top of that, the review-portal download helper (lib/review/download.ts)
 * also fetches it into a Blob itself, so the correct filename is guaranteed
 * either way. The Storage bucket stays private; this still requires the
 * signed token, never the service-role key, and is only ever called from
 * this anon-key browser client.
 */
export async function getSignedReviewMediaDownloadUrl(
  storagePath: string,
  filename: string,
  expiresInSeconds = 600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds, { download: filename });
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function listMessages(options: { organizationId: string; reviewItemId?: string }): Promise<ChatMessageRecord[]> {
  let query = supabase
    .from("review_messages")
    .select("id, organization_id, review_item_id, sender_id, body, created_at, read_at")
    .eq("organization_id", options.organizationId)
    .order("created_at", { ascending: true });
  if (options.reviewItemId) query = query.eq("review_item_id", options.reviewItemId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const rows = data ?? [];

  const names = await profileNamesFor(rows.map((r) => r.sender_id ?? ""));
  const { data: profiles } = await supabase
    .from("review_profiles")
    .select("user_id, role")
    .in("user_id", Array.from(new Set(rows.map((r) => r.sender_id ?? "").filter(Boolean))));
  const roleByUser = new Map((profiles ?? []).map((p) => [p.user_id, p.role as "admin" | "client"]));

  return rows.map((r) => ({
    id: r.id,
    organizationId: r.organization_id,
    reviewItemId: r.review_item_id,
    sender: names.get(r.sender_id ?? "") ?? "Someone",
    senderRole: roleByUser.get(r.sender_id ?? "") ?? "client",
    body: r.body,
    createdAt: r.created_at,
    readAt: r.read_at,
  }));
}

export async function sendMessage(input: { organizationId: string; propertyId?: string; reviewItemId?: string; body: string }): Promise<void> {
  const { error } = await supabase.rpc("review_send_message", {
    p_organization_id: input.organizationId,
    p_property_id: input.propertyId ?? null,
    p_review_item_id: input.reviewItemId ?? null,
    p_body: input.body,
  });
  if (error) throw new Error(error.message);
}

export async function markMessageRead(messageId: string): Promise<void> {
  const { error } = await supabase.rpc("review_mark_message_read", { p_message_id: messageId });
  if (error) throw new Error(error.message);
}

export async function getCurrentProfile(): Promise<ReviewProfile | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("review_profiles")
    .select("user_id, email, first_name, last_name, role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    userId: data.user_id,
    email: data.email,
    firstName: data.first_name ?? "",
    lastName: data.last_name ?? "",
    role: data.role,
  };
}
