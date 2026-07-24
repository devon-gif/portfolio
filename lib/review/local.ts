"use client";

// Archer Review — local demo backend. This is a thin async-shaped adapter
// over the existing lib/simple-review-store.ts (localStorage) and
// lib/review-media-db.ts (IndexedDB blobs). Nothing about their on-disk
// format changes here; this file only reshapes their data into the
// normalized ReviewItemRecord/ChatMessageRecord types so the UI can call the
// same functions regardless of which backend (local or Supabase) is active.
//
// This is the fallback path used whenever Supabase environment variables
// are not configured (see lib/review/config.ts isReviewSupabaseConfigured),
// and is what keeps the review UI rendering during local development with
// no Supabase project connected.

import {
  createId,
  getSeedReviewState,
  loadReviewState,
  mutateReviewState,
  resetReviewState,
  subscribeReviewState,
  type ReviewItem as LocalReviewItem,
  type ReviewStatus as LocalReviewStatus,
} from "@/lib/simple-review-store";
import { saveReviewMedia, getReviewMedia } from "@/lib/review-media-db";
import type {
  ChatMessageRecord,
  ClientDecision,
  OrganizationRecord,
  PropertyRecord,
  ReviewItemRecord,
  Unsubscribe,
} from "./types";

const LOCAL_ORG_ID = "local-demo";
const LOCAL_ORG_NAME = "Valencia Hotel Collection (local demo)";

// Mirrors the property list the admin UI has always offered in the local
// demo (previously hardcoded directly in SimpleAdminReview.tsx as
// VALENCIA_PROPERTIES) — kept here so both the local and Supabase-backed
// paths go through the same listProperties() call.
const LOCAL_PROPERTIES = [
  "Hotel Valencia Riverwalk",
  "Hotel Valencia Santana Row",
  "Texican Court",
  "Lone Star Court",
  "Cotton Court",
  "Cavalry Court",
  "The George",
  "Caravan Court",
] as const;

const CHAT_STORAGE_KEY = "archer-review-chat-v1";
const CHAT_EVENT = "archer-review-chat-updated";

type LocalChatMessage = {
  id: string;
  sender: "Devon" | "Emma";
  body: string;
  createdAt: string;
};

function toRecord(item: LocalReviewItem): ReviewItemRecord {
  return {
    id: item.id,
    organizationId: LOCAL_ORG_ID,
    organizationName: LOCAL_ORG_NAME,
    propertyId: item.property,
    property: item.property,
    title: item.title,
    description: item.internalNote || "",
    kind: item.kind,
    // Seed items reference a real public path; uploaded items reference an
    // IndexedDB blob id — see lib/simple-review-store.ts's ReviewItem shape.
    assetSource: item.assetBlobId ? "blob" : "url",
    assetRef: item.assetBlobId || item.assetUrl,
    assetName: item.assetName,
    assetSize: item.assetSize,
    version: item.version,
    status: item.status,
    dueDate: item.dueDate,
    clientFeedback: item.clientFeedback,
    internalNote: item.internalNote,
    decisionBy: item.decisionBy,
    decisionAt: item.decisionAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    history: item.history,
  };
}

export async function listOrganizations(): Promise<OrganizationRecord[]> {
  return [{ id: LOCAL_ORG_ID, name: LOCAL_ORG_NAME, slug: LOCAL_ORG_ID }];
}

export async function listProperties(): Promise<PropertyRecord[]> {
  return LOCAL_PROPERTIES.map((name) => ({
    id: name,
    organizationId: LOCAL_ORG_ID,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    active: true,
  }));
}

export async function listReviewItems(options: { forClient?: boolean } = {}): Promise<ReviewItemRecord[]> {
  const state = loadReviewState();
  const items = state.items.filter((item) => {
    if (!options.forClient) return true;
    return item.status !== "Draft" && item.status !== "Archived";
  });
  return items.map(toRecord);
}

export function subscribeToChanges(onChange: () => void): Unsubscribe {
  return subscribeReviewState(() => onChange());
}

export async function createDraftItem(input: {
  property: string;
  title: string;
  description: string;
  dueDate: string;
  file: File;
}): Promise<ReviewItemRecord> {
  const assetBlobId = await saveReviewMedia(input.file);
  const timestamp = new Date().toISOString();
  const kind = input.file.type.startsWith("video/") ? "video" : "image";

  const next = mutateReviewState((draft) => {
    draft.items.unshift({
      id: createId(),
      property: input.property,
      title: input.title,
      kind,
      assetUrl: "",
      assetBlobId,
      assetName: input.file.name,
      assetSize: input.file.size,
      version: 1,
      status: "Draft",
      dueDate: input.dueDate,
      clientFeedback: "",
      internalNote: input.description,
      decisionBy: "",
      decisionAt: "",
      createdAt: timestamp,
      updatedAt: timestamp,
      history: [
        {
          id: createId(),
          by: "Devon",
          message: `Draft created with ${input.file.name}.`,
          createdAt: timestamp,
        },
      ],
    });
  });

  const created = next.items[0];
  return toRecord(created);
}

export async function sendToReview(itemId: string): Promise<void> {
  const timestamp = new Date().toISOString();
  mutateReviewState((draft) => {
    const current = draft.items.find((entry) => entry.id === itemId);
    if (!current) return;
    current.status = "Awaiting review";
    current.updatedAt = timestamp;
    current.decisionBy = "";
    current.decisionAt = "";
    current.history.push({
      id: createId(),
      by: "Devon",
      message: `Version ${current.version} submitted to Emma for review.`,
      createdAt: timestamp,
    });
  });
}

export async function uploadNewVersion(itemId: string, file: File, note: string): Promise<void> {
  const assetBlobId = await saveReviewMedia(file);
  const timestamp = new Date().toISOString();
  const kind = file.type.startsWith("video/") ? "video" : "image";

  mutateReviewState((draft) => {
    const current = draft.items.find((entry) => entry.id === itemId);
    if (!current) return;
    current.version += 1;
    current.kind = kind;
    current.assetUrl = "";
    current.assetBlobId = assetBlobId;
    current.assetName = file.name;
    current.assetSize = file.size;
    current.status = "Awaiting review";
    current.updatedAt = timestamp;
    current.internalNote = note || current.internalNote;
    current.decisionBy = "";
    current.decisionAt = "";
    current.history.push({
      id: createId(),
      by: "Devon",
      message: `Version ${current.version} uploaded${note ? `: ${note}` : "."}`,
      createdAt: timestamp,
    });
  });
}

export async function archiveItem(itemId: string): Promise<void> {
  const timestamp = new Date().toISOString();
  mutateReviewState((draft) => {
    const current = draft.items.find((entry) => entry.id === itemId);
    if (!current) return;
    current.status = "Archived";
    current.updatedAt = timestamp;
    current.history.push({ id: createId(), by: "Devon", message: "Item archived.", createdAt: timestamp });
  });
}

export async function reopenItem(itemId: string): Promise<void> {
  const timestamp = new Date().toISOString();
  mutateReviewState((draft) => {
    const current = draft.items.find((entry) => entry.id === itemId);
    if (!current) return;
    current.status = "Awaiting review";
    current.updatedAt = timestamp;
    current.history.push({ id: createId(), by: "Devon", message: "Item reopened.", createdAt: timestamp });
  });
}

const DECISION_TO_LOCAL_STATUS: Record<ClientDecision, LocalReviewStatus> = {
  Approved: "Approved",
  "Revision requested": "Revision requested",
  "New direction requested": "New direction requested",
};

export async function clientDecide(itemId: string, decision: ClientDecision, note: string): Promise<void> {
  if (decision !== "Approved" && !note.trim()) {
    throw new Error("Please include feedback before requesting a change.");
  }
  const timestamp = new Date().toISOString();
  mutateReviewState((draft) => {
    const current = draft.items.find((entry) => entry.id === itemId);
    if (!current) return;
    current.status = DECISION_TO_LOCAL_STATUS[decision];
    current.clientFeedback = note;
    current.decisionBy = "Emma";
    current.decisionAt = timestamp;
    current.updatedAt = timestamp;
    current.history.push({
      id: createId(),
      by: "Emma",
      message: decision === "Approved" ? `Version ${current.version} approved.` : `${decision}: ${note}`,
      createdAt: timestamp,
    });
  });
}

export async function resetLocalDemo(): Promise<void> {
  resetReviewState();
}

export async function getSignedReviewMediaUrl(assetRef: string): Promise<string> {
  const stored = await getReviewMedia(assetRef);
  if (!stored) throw new Error("The uploaded file could not be loaded from local browser storage.");
  return URL.createObjectURL(stored.blob);
}

// ── Chat (single shared local thread — see components/review/ChatPanel.tsx,
// which still owns its own localStorage read/write for the demo path; these
// helpers exist so a future single call-site could read the same data
// through the repository facade if needed) ────────────────────────────────

function loadLocalMessages(): LocalChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as LocalChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function listMessages(): Promise<ChatMessageRecord[]> {
  return loadLocalMessages().map((m) => ({
    id: m.id,
    organizationId: LOCAL_ORG_ID,
    reviewItemId: null,
    sender: m.sender,
    senderRole: m.sender === "Devon" ? "admin" : "client",
    body: m.body,
    createdAt: m.createdAt,
    readAt: null,
  }));
}

export async function sendMessage(sender: "Devon" | "Emma", body: string): Promise<void> {
  const next = [
    ...loadLocalMessages(),
    { id: createId(), sender, body, createdAt: new Date().toISOString() },
  ];
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(CHAT_EVENT));
}

export async function markMessageRead(): Promise<void> {
  // No-op locally: the demo chat has no per-message read state.
}

export { getSeedReviewState };
