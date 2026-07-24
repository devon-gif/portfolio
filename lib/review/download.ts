"use client";

// Archer Review — the one true download path for review-portal media.
//
// Why not a plain `<a href={url} download>`? The HTML `download` attribute
// is only a hint. Browsers are free to ignore it and navigate/play the
// resource inline instead — and in practice they often do exactly that for
// cross-origin URLs (a Supabase signed URL lives on a different origin than
// the app) and, in Safari especially, even for same-origin video files. That
// mismatch is the root cause of "Download approved asset" (and the
// auto-download after Approve) opening or navigating to the raw media URL
// instead of saving a file.
//
// The fix that reliably works across browsers: fetch the resource ourselves,
// turn the response into a Blob, mint a `blob:` object URL from that Blob,
// and point the anchor at the blob URL instead of the original resource URL.
// A `blob:` URL is always same-origin and is never something the browser
// considers "navigable content" — the `download` attribute is honored on it
// every time, in every browser this project needs to support.

export type DownloadableAsset = {
  url: string;
  filename: string;
  mimeType?: string;
};

// Best-effort extension fallback when neither the filename nor the URL has
// one. Keyed by the MIME types this portal actually produces (see
// MediaDropzone.tsx's accept="image/*,video/*").
const EXTENSION_BY_MIME: Record<string, string> = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
  "video/x-msvideo": "avi",
  "video/x-matroska": "mkv",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
};

function stripQueryAndHash(pathOrUrl: string): string {
  return pathOrUrl.split("#")[0].split("?")[0];
}

/** Extracts a lowercase extension (no dot) from a path or URL, or null. */
export function extensionFromPath(pathOrUrl: string): string | null {
  if (!pathOrUrl) return null;
  const clean = stripQueryAndHash(pathOrUrl);
  const match = /\.([a-zA-Z0-9]{2,5})$/.exec(clean);
  return match ? match[1].toLowerCase() : null;
}

function hasExtension(filename: string): boolean {
  return /\.[a-zA-Z0-9]{2,5}$/.test(filename);
}

/**
 * Guarantees the returned filename ends in a real extension — never a bare
 * "download" or "review-asset" with nothing after it. Tries, in order: the
 * filename's own extension, the source URL's extension, the MIME type, and
 * finally an explicit caller-supplied fallback (e.g. "mp4" for a known video
 * item) before giving up and using "bin".
 */
export function ensureFilenameExtension(
  filename: string,
  url: string,
  mimeType?: string,
  fallbackExt?: string
): string {
  const trimmed = (filename || "").trim() || "review-asset";
  if (hasExtension(trimmed)) return trimmed;

  const ext =
    extensionFromPath(trimmed) ||
    extensionFromPath(url) ||
    (mimeType && EXTENSION_BY_MIME[mimeType.toLowerCase()]) ||
    fallbackExt ||
    "bin";

  return `${trimmed}.${ext}`;
}

/**
 * Downloads a review asset to the visitor's device without ever navigating
 * the current tab or opening a new one. Safe to call repeatedly — each call
 * fetches fresh (Supabase signed URLs expire, and `cache: "no-store"` avoids
 * serving a stale cached response for local demo assets that may have been
 * replaced by a new version).
 *
 * Throws on any failure (network error, non-2xx response) so callers can
 * show their own inline error state — this function never shows an alert or
 * navigates on failure, it just rejects.
 */
export async function downloadReviewAsset({ url, filename, mimeType }: DownloadableAsset): Promise<void> {
  if (!url) {
    throw new Error("No file is available to download yet.");
  }

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new Error("Could not reach the file. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  const blob = await response.blob();
  const safeFilename = ensureFilenameExtension(filename, url, mimeType || blob.type);
  const objectUrl = URL.createObjectURL(blob);

  try {
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = safeFilename;
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    // Give the browser a moment to actually start reading the blob before
    // the URL is revoked — revoking immediately can race the download start
    // in some browsers.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}
