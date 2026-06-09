"use client";

import { LazyVideo } from "./LazyVideo";
import type { VideoAsset } from "./media";

// Per-orientation card width so landscape feels cinematic and portrait feels
// like a premium vertical social example. The container's aspect-ratio is set
// from the real pixel dimensions, so the video is never squeezed.
const WIDTH_BY_ORIENTATION: Record<VideoAsset["orientation"], string> = {
  landscape: "w-[86vw] sm:w-[560px]",
  portrait: "w-[64vw] sm:w-[300px]",
  square: "w-[72vw] sm:w-[380px]",
};

export function VideoCard({ asset, eager = false }: { asset: VideoAsset; eager?: boolean }) {
  return (
    <figure
      className={`group shrink-0 snap-start ${WIDTH_BY_ORIENTATION[asset.orientation]}`}
    >
      <div
        className="glass-card relative overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-0.5 group-hover:border-[#C9A44C] group-hover:shadow-[0_0_50px_rgba(201,164,76,0.16)]"
        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
      >
        <LazyVideo src={asset.src} eager={eager} className="h-full w-full object-cover" />
      </div>
      <figcaption className="mt-2.5 flex items-center justify-between px-1">
        <span className="text-[13px] text-[#D8CFBE]">{asset.label}</span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#C9A44C]">{asset.category}</span>
      </figcaption>
    </figure>
  );
}
