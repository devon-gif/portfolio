"use client";

// Archer Review — repository facade. Every review-portal component should
// import from here, never directly from lib/review/local.ts or
// lib/review/supabase.ts. This is the single place that decides which
// backend answers a given call:
//
//   - Supabase (production path) when NEXT_PUBLIC_SUPABASE_URL and
//     NEXT_PUBLIC_SUPABASE_ANON_KEY are set (isReviewSupabaseConfigured()).
//   - The original localStorage + IndexedDB demo (lib/simple-review-store.ts
//     / lib/review-media-db.ts, wrapped by lib/review/local.ts) otherwise,
//     so the UI keeps rendering during local development with no Supabase
//     project connected.
//
// Every exported function here has the exact same signature regardless of
// backend, so SimpleAdminReview.tsx / SimpleClientReview.tsx / ChatPanel.tsx
// / MediaPreview.tsx never need to branch on which backend is active.

import { isReviewSupabaseConfigured } from "./config";
import { downloadReviewAsset, ensureFilenameExtension } from "./download";
import * as local from "./local";
import * as remote from "./supabase";
import type {
  AssetSource,
  ChatMessageRecord,
  ClientDecision,
  MediaKind,
  OrganizationRecord,
  PropertyRecord,
  ReviewItemRecord,
  ReviewProfile,
  Unsubscribe,
} from "./types";

export * from "./types";
export { isReviewSupabaseConfigured, isReviewProductionEnvironment } from "./config";

// The low-level, backend-agnostic download primitive — fetches a URL into a
// Blob and saves it via a blob: object URL, so the browser's `download`
// attribute is honored reliably instead of navigating/playing the file
// inline. See lib/review/download.ts for the full rationale. Re-exported
// here so every review-portal component only ever imports from "@/lib/review".
export { downloadReviewAsset } from "./download";

export function listOrganizations(): Promise<OrganizationRecord[]> {
  return isReviewSupabaseConfigured() ? remote.listOrganizations() : local.listOrganizations();
}

export function listProperties(organizationId?: string): Promise<PropertyRecord[]> {
  return isReviewSupabaseConfigured() ? remote.listProperties(organizationId) : local.listProperties();
}

export function listReviewItems(
  options: { organizationId?: string; propertyId?: string; forClient?: boolean } = {}
): Promise<ReviewItemRecord[]> {
  return isReviewSupabaseConfigured() ? remote.listReviewItems(options) : local.listReviewItems(options);
}

export function subscribeToChanges(organizationId: string | undefined, onChange: () => void): Unsubscribe {
  if (isReviewSupabaseConfigured() && organizationId) {
    return remote.subscribeToChanges(organizationId, onChange);
  }
  return local.subscribeToChanges(onChange);
}

export function createDraftItem(input: {
  organizationId: string;
  propertyId: string;
  property: string;
  title: string;
  description: string;
  dueDate: string;
  file: File;
}): Promise<ReviewItemRecord> {
  return isReviewSupabaseConfigured() ? remote.createDraftItem(input) : local.createDraftItem(input);
}

export function sendToReview(itemId: string): Promise<void> {
  return isReviewSupabaseConfigured() ? remote.sendToReview(itemId) : local.sendToReview(itemId);
}

export function uploadNewVersion(
  itemId: string,
  file: File,
  note: string,
  context: { organizationId: string; propertyId: string; nextVersion: number }
): Promise<void> {
  return isReviewSupabaseConfigured()
    ? remote.uploadNewVersion(itemId, file, note, context)
    : local.uploadNewVersion(itemId, file, note);
}

export function archiveItem(itemId: string): Promise<void> {
  return isReviewSupabaseConfigured() ? remote.archiveItem(itemId) : local.archiveItem(itemId);
}

export function reopenItem(itemId: string): Promise<void> {
  return isReviewSupabaseConfigured() ? remote.reopenItem(itemId) : local.reopenItem(itemId);
}

export function clientDecide(itemId: string, decision: ClientDecision, note: string): Promise<void> {
  return isReviewSupabaseConfigured() ? remote.clientDecide(itemId, decision, note) : local.clientDecide(itemId, decision, note);
}

export function getSignedReviewMediaUrl(assetRef: string): Promise<string> {
  return isReviewSupabaseConfigured() ? remote.getSignedReviewMediaUrl(assetRef) : local.getSignedReviewMediaUrl(assetRef);
}

export function listMessages(options: { organizationId?: string; reviewItemId?: string } = {}): Promise<ChatMessageRecord[]> {
  if (isReviewSupabaseConfigured() && options.organizationId) {
    return remote.listMessages({ organizationId: options.organizationId, reviewItemId: options.reviewItemId });
  }
  return local.listMessages();
}

export function sendMessage(input: {
  organizationId?: string;
  propertyId?: string;
  reviewItemId?: string;
  senderName: "Devon" | "Emma";
  body: string;
}): Promise<void> {
  if (isReviewSupabaseConfigured() && input.organizationId) {
    return remote.sendMessage({
      organizationId: input.organizationId,
      propertyId: input.propertyId,
      reviewItemId: input.reviewItemId,
      body: input.body,
    });
  }
  return local.sendMessage(input.senderName, input.body);
}

export function markMessageRead(messageId: string): Promise<void> {
  return isReviewSupabaseConfigured() ? remote.markMessageRead(messageId) : local.markMessageRead();
}

export function getCurrentProfile(): Promise<ReviewProfile | null> {
  return isReviewSupabaseConfigured() ? remote.getCurrentProfile() : Promise.resolve(null);
}

/** Local-demo-only helper; intentionally a no-op when Supabase is configured. */
export function resetLocalDemo(): Promise<void> {
  return isReviewSupabaseConfigured() ? Promise.resolve() : local.resetLocalDemo();
}

function slugifyFilenamePart(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics after NFKD decomposition
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Builds a safe, human-readable filename for an item's current asset. Uses
 * the original uploaded filename when one is on record (true for every
 * Supabase-backed item and every locally-uploaded item — only the three
 * hardcoded local-demo seed items have no assetName). Otherwise falls back
 * to "<property>-<title>-v<version>", e.g.
 * "lone-star-court-property-arrival-motion-v1.mp4". Either way the result is
 * always routed through ensureFilenameExtension so it never comes out
 * without a real extension.
 */
export function buildReviewAssetFilename(item: {
  assetName?: string;
  assetRef?: string;
  property?: string;
  title?: string;
  version?: number;
  kind?: MediaKind;
}): string {
  const raw =
    item.assetName?.trim() ||
    [item.property, item.title, item.version ? `v${item.version}` : ""]
      .filter((part): part is string => Boolean(part && String(part).trim()))
      .map((part) => slugifyFilenamePart(String(part)))
      .filter(Boolean)
      .join("-") ||
    "review-asset";

  const fallbackExt = item.kind === "video" ? "mp4" : "jpg";

  return ensureFilenameExtension(raw, item.assetRef || "", undefined, fallbackExt);
}

/**
 * Resolves the download URL + filename for an item's current asset, without
 * actually downloading it. Split out from downloadApprovedAsset so callers
 * that need just the URL (none currently, but keeps the two concerns
 * separate) don't have to reimplement the local/Supabase branching.
 *
 * For "url"-sourced local-demo seed items, assetRef already IS the URL — no
 * resolution call needed. Otherwise this asks whichever backend is active
 * for a fresh URL: the Supabase branch requests a signed URL that's
 * additionally configured for downloading (Content-Disposition: attachment
 * with the real filename); the local-demo branch resolves the IndexedDB
 * blob to an object URL.
 */
export async function resolveReviewAssetDownload(item: {
  assetSource: AssetSource;
  assetRef: string;
  assetName?: string;
  property?: string;
  title: string;
  version?: number;
  kind?: MediaKind;
}): Promise<{ url: string; filename: string }> {
  const filename = buildReviewAssetFilename(item);

  if (item.assetSource === "url") {
    return { url: item.assetRef, filename };
  }

  const url = isReviewSupabaseConfigured()
    ? await remote.getSignedReviewMediaDownloadUrl(item.assetRef, filename)
    : await local.getSignedReviewMediaUrl(item.assetRef);

  return { url, filename };
}

/**
 * Downloads an item's current approved asset to the visitor's device. This
 * is the one call site both SimpleClientReview.tsx (automatic attempt right
 * after Approve, plus the permanent "Download approved asset" button) and
 * SimpleAdminReview.tsx (Devon's own download button) should use — never
 * construct an anchor/URL by hand, and never reuse a previously-resolved
 * URL, since Supabase signed URLs expire.
 */
export async function downloadApprovedAsset(item: {
  assetSource: AssetSource;
  assetRef: string;
  assetName?: string;
  property?: string;
  title: string;
  version?: number;
  kind?: MediaKind;
}): Promise<void> {
  const { url, filename } = await resolveReviewAssetDownload(item);
  await downloadReviewAsset({ url, filename });
}
