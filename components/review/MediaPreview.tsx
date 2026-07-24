"use client";

import { useEffect, useState } from "react";
import { getSignedReviewMediaUrl, type AssetSource, type MediaKind } from "@/lib/review";

export default function MediaPreview({ kind, assetSource, assetRef, title }: {
  kind: MediaKind;
  assetSource: AssetSource;
  assetRef: string;
  title: string;
}) {
  const [url, setUrl] = useState(assetSource === "url" ? assetRef : "");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    if (assetSource === "url") { setUrl(assetRef); return; }
    getSignedReviewMediaUrl(assetRef).then((resolved) => {
      if (!active) return;
      if (assetSource === "blob") objectUrl = resolved;
      setUrl(resolved);
      setError(false);
    }).catch(() => setError(true));
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [assetRef, assetSource]);

  if (error || !url) return <div className="grid min-h-64 place-items-center bg-[#181714] text-sm text-[#bdb5aa]">Media preview unavailable</div>;
  if (kind === "video") return <video src={url} controls playsInline preload="metadata" className="max-h-[70vh] w-full bg-[#111] object-contain" onError={() => setError(true)} />;
  return <img src={url} alt={title} className="max-h-[70vh] w-full bg-[#111] object-contain" onError={() => setError(true)} />;
}
