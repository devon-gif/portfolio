"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export function SlideOver({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  wide = false,
}: SlideOverProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={clsx(
          "flex flex-col bg-zinc-900 border-l border-zinc-800 shadow-2xl overflow-hidden",
          wide ? "w-full max-w-2xl" : "w-full max-w-lg"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-zinc-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-zinc-800 px-6 py-4 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Form field helpers ───────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-zinc-600">{hint}</p>}
    </div>
  );
}

const INPUT_CLASS =
  "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition-colors";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(INPUT_CLASS, props.className)} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={clsx(
        INPUT_CLASS,
        "resize-none leading-6",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(
        INPUT_CLASS,
        "cursor-pointer",
        props.className
      )}
    />
  );
}
