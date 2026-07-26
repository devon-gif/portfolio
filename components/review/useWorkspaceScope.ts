"use client";

import { useCallback, useEffect, useState } from "react";

import {
  WORKSPACE_QUERY_PARAM,
  parseWorkspaceScope,
  serializeWorkspaceScope,
  type WorkspaceScope,
} from "@/lib/review";

/**
 * Remembers which workspace the admin shell is looking at, in the URL (so a
 * view can be linked or bookmarked) and in localStorage (so a plain visit to
 * /review/admin resumes where you left off).
 *
 * Deliberately NOT next/navigation's useSearchParams. That hook pulls the
 * whole client tree up to the nearest Suspense boundary out of prerendering,
 * and a statically-rendered page that calls it fails `next build` outright
 * with "Missing Suspense boundary with useSearchParams" — see
 * node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md.
 * /review/admin is a static page whose entire subtree is already client-only
 * behind ReviewAdminGate, so router-aware search params buy nothing here,
 * while reading window.location once on mount and writing back with
 * history.replaceState keeps the URL shareable without restructuring the
 * route or adding a Suspense wrapper.
 *
 * replaceState rather than pushState: switching workspaces is a filter, not a
 * navigation, and it should not stack up back-button history.
 *
 * Returns null until the first client-side read completes. Null means "no
 * preference expressed yet" — callers should fall back to
 * defaultWorkspaceScope() once they know which organizations exist, rather
 * than assuming a default here where that list isn't known.
 */
export function useWorkspaceScope(storageKey: string): {
  scope: WorkspaceScope | null;
  selectScope: (next: WorkspaceScope) => void;
} {
  const [scope, setScope] = useState<WorkspaceScope | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromUrl = parseWorkspaceScope(
      new URLSearchParams(window.location.search).get(WORKSPACE_QUERY_PARAM)
    );

    let stored: string | null = null;
    if (!fromUrl) {
      try {
        stored = window.localStorage.getItem(storageKey);
      } catch {
        // Private-mode / disabled storage: fall through to no preference.
      }
    }

    const resolved = fromUrl ?? parseWorkspaceScope(stored);
    if (!resolved) return;

    // Deferred via queueMicrotask rather than called straight from the effect
    // body, to avoid the cascading-render lint error — the same pattern used
    // for the local session check in SimpleAdminReview.tsx and for
    // GeorgeSlideshow.tsx earlier in this project.
    queueMicrotask(() => setScope(resolved));
  }, [storageKey]);

  const selectScope = useCallback(
    (next: WorkspaceScope) => {
      setScope(next);
      if (typeof window === "undefined") return;

      const token = serializeWorkspaceScope(next);

      try {
        window.localStorage.setItem(storageKey, token);
      } catch {
        // Persisting the preference is a convenience, never a requirement.
      }

      const url = new URL(window.location.href);
      url.searchParams.set(WORKSPACE_QUERY_PARAM, token);
      window.history.replaceState(null, "", url.toString());
    },
    [storageKey]
  );

  return { scope, selectScope };
}
