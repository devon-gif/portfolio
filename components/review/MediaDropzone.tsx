"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, X } from "lucide-react";

export default function MediaDropzone({ file, onFileChange, compact = false }: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function choose(selected?: File) {
    if (!selected) return;
    if (!selected.type.startsWith("image/") && !selected.type.startsWith("video/")) {
      window.alert("Please choose an image or video file.");
      return;
    }
    onFileChange(selected);
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    choose(event.dataTransfer.files[0]);
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") input.current?.click();
        }}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        className={`cursor-pointer rounded-2xl border border-dashed p-5 text-center transition ${compact ? "min-h-28" : "min-h-40"} ${dragging ? "border-[#a9812f] bg-[#f4ead7]" : "border-[#d9cbb8] bg-white/45 hover:bg-white/70"}`}
      >
        <input ref={input} type="file" accept="image/*,video/*" className="hidden" onChange={(event) => { choose(event.target.files?.[0]); event.target.value = ""; }} />
        {file ? (
          <div className="flex h-full items-center justify-center gap-3 text-left">
            <UploadCloud className="h-6 w-6 text-[#a9812f]" />
            <div className="min-w-0">
              <strong className="block truncate text-sm text-[#2b241f]">{file.name}</strong>
              <span className="text-xs text-[#817668]">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#6d6155]">
            <UploadCloud className="h-7 w-7 text-[#a9812f]" />
            <strong className="text-sm text-[#2b241f]">Drop an image or video here</strong>
            <span className="text-xs">or click to choose a file</span>
          </div>
        )}
      </div>
      {file && (
        <button type="button" onClick={() => onFileChange(null)} className="mt-2 inline-flex items-center gap-1 text-xs text-[#7c3338] hover:underline">
          <X className="h-3.5 w-3.5" /> Remove file
        </button>
      )}
    </div>
  );
}
