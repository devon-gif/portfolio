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

// A second demo organization, so the multi-client admin shell (workspace
// switcher, All Workspaces view, cross-organization property filtering) is
// actually exercisable during local development — with no Supabase project
// connected there is otherwise only ever one organization and the switcher
// hides itself. Entirely fictional and clearly labeled; this file only ever
// runs when Supabase is unconfigured, which lib/review/config.ts refuses to
// allow in a real deployment.
const SECOND_LOCAL_ORG_ID = "local-demo-harborlight";
const SECOND_LOCAL_ORG_NAME = "Harborlight Collection (local demo)";

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

const SECOND_LOCAL_PROPERTIES = ["Harborlight Point", "Harborlight Cove"] as const;

const LOCAL_ORGANIZATIONS: OrganizationRecord[] = [
  { id: LOCAL_ORG_ID, name: LOCAL_ORG_NAME, slug: LOCAL_ORG_ID },
  { id: SECOND_LOCAL_ORG_ID, name: SECOND_LOCAL_ORG_NAME, slug: SECOND_LOCAL_ORG_ID },
];

// The local store (lib/simple-review-store.ts) predates organizations and
// keys items by property NAME alone, so ownership is derived from that name
// here rather than stored. Anything unrecognized — including every item
// already sitting in a developer's localStorage — falls back to the original
// organization, which keeps existing local demo data exactly where it was.
const LOCAL_PROPERTY_ORG: Record<string, string> = {
  ...Object.fromEntries(LOCAL_PROPERTIES.map((name) => [name, LOCAL_ORG_ID])),
  ...Object.fromEntries(SECOND_LOCAL_PROPERTIES.map((name) => [name, SECOND_LOCAL_ORG_ID])),
};

function localOrganizationIdForProperty(property: string): string {
  return LOCAL_PROPERTY_ORG[property] ?? LOCAL_ORG_ID;
}

function localOrganizationName(organizationId: string): string {
  return LOCAL_ORGANIZATIONS.find((organization) => organization.id === organizationId)?.name ?? LOCAL_ORG_NAME;
}

const CHAT_STORAGE_KEY = "archer-review-chat-v1";
const CHAT_EVENT = "archer-review-chat-updated";

type LocalChatMessage = {
  id: string;
  sender: "Devon" | "Emma";
  body: string;
  createdAt: string;
};

function toRecord(item: LocalReviewItem): ReviewItemRecord {
  const organizationId = localOrganizationIdForProperty(item.property);

  return {
    id: item.id,
    organizationId,
    organizationName: localOrganizationName(organizationId),
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
  return LOCAL_ORGANIZATIONS.map((organization) => ({ ...organization }));
}

/**
 * Mirrors the Supabase signature: an omitted organizationId means "every
 * property the caller can see", which is what the admin All Workspaces view
 * asks for.
 */
export async function listProperties(organizationId?: string): Promise<PropertyRecord[]> {
  const all: PropertyRecord[] = [...LOCAL_PROPERTIES, ...SECOND_LOCAL_PROPERTIES].map((name) => ({
    id: name,
    organizationId: localOrganizationIdForProperty(name),
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    active: true,
  }));

  if (!organizationId) return all;
  return all.filter((property) => property.organizationId === organizationId);
}

export async function listReviewItems(
  options: { organizationId?: string; propertyId?: string; forClient?: boolean } = {}
): Promise<ReviewItemRecord[]> {
  const state = loadReviewState();
  const items = state.items.filter((item) => {
    if (options.organizationId && localOrganizationIdForProperty(item.property) !== options.organizationId) {
      return false;
    }
    if (options.propertyId && item.property !== options.propertyId) return false;
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

// ── Chat (one shared local thread, not per-organization: the demo store
// predates organizations, so both local demo workspaces surface the same
// conversation. Supabase-backed chat is properly org-scoped — see
// listMessages in lib/review/supabase.ts.) See components/review/ChatPanel.tsx,
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
