import type { ReactNode } from "react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  accent?: "default" | "emerald" | "amber" | "red" | "sky";
}

const ACCENT_CLASSES = {
  default: "text-zinc-100",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
  sky: "text-sky-400",
};

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "default",
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            {label}
          </p>
          <p
            className={clsx(
              "mt-1.5 text-2xl font-bold tabular-nums",
              ACCENT_CLASSES[accent]
            )}
          >
            {value}
          </p>
          {sub && <p className="mt-0.5 text-xs text-zinc-600">{sub}</p>}
        </div>
        {icon && (
          <div className="shrink-0 mt-0.5 text-zinc-600">{icon}</div>
        )}
      </div>
    </div>
  );
}
