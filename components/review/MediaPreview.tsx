"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getSignedReviewMediaUrl,
} from "@/lib/review";

import type {
  AssetSource,
  MediaKind,
} from "@/lib/review";

import styles from "./SimpleReview.module.css";

export default function MediaPreview({
  kind,
  assetSource,
  assetRef,
  title,
}: {
  kind: MediaKind;
  assetSource: AssetSource;
  assetRef: string;
  title: string;
}) {
  const [resolvedUrl, setResolvedUrl] =
    useState(assetSource === "url" ? assetRef : "");

  const [loading, setLoading] =
    useState(assetSource !== "url");

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let objectUrl = "";
    let active = true;

    async function resolve() {
      if (assetSource === "url") {
        setResolvedUrl(assetRef || "");
        setLoading(false);
        return;
      }

      if (!assetRef) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // For "blob" (local IndexedDB demo) this returns a fresh
        // object URL; for "storage" (Supabase) it returns a signed,
        // time-limited URL. Either way MediaPreview doesn't need to
        // know which — see lib/review/index.ts.
        const resolved =
          await getSignedReviewMediaUrl(
            assetRef,
          );

        if (!active) {
          return;
        }

        if (assetSource === "blob") {
          objectUrl = resolved;
        }

        setResolvedUrl(resolved);
        setError(false);
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    resolve();

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(
          objectUrl,
        );
      }
    };
  }, [assetSource, assetRef]);

  if (loading) {
    return (
      <div
        className={
          styles.mediaFallback
        }
      >
        Loading uploaded media…
      </div>
    );
  }

  if (
    error ||
    !resolvedUrl
  ) {
    return (
      <div
        className={
          styles.mediaFallback
        }
      >
        <strong>
          Media preview unavailable
        </strong>

        <p>
          The uploaded file could not be
          loaded from local browser
          storage.
        </p>
      </div>
    );
  }

  if (kind === "video") {
    return (
      <video
        src={resolvedUrl}
        controls
        muted
        loop
        playsInline
        preload="metadata"
        onError={() =>
          setError(true)
        }
      />
    );
  }

  return (
    <img
      src={resolvedUrl}
      alt={title}
      onError={() =>
        setError(true)
      }
    />
  );
}
