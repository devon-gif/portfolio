import type { ContactStatus } from "@/lib/types";
import clsx from "clsx";

const STATUS_CONFIG: Record<ContactStatus, { label: string; classes: string }> = {
  new:           { label: "New",           classes: "bg-blue-500/10 text-blue-400 ring-blue-500/20" },
  queued:        { label: "Queued",        classes: "bg-violet-500/10 text-violet-400 ring-violet-500/20" },
  approved:      { label: "Approved",      classes: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20" },
  sent:          { label: "Sent",          classes: "bg-sky-500/10 text-sky-400 ring-sky-500/20" },
  replied:       { label: "Replied",       classes: "bg-teal-500/10 text-teal-400 ring-teal-500/20" },
  follow_up_due: { label: "Follow-up Due", classes: "bg-amber-500/10 text-amber-400 ring-amber-500/20" },
  call_booked:   { label: "Call Booked",   classes: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" },
  won:           { label: "Won",           classes: "bg-green-500/10 text-green-400 ring-green-500/20" },
  lost:          { label: "Lost",          classes: "bg-zinc-800 text-zinc-500 ring-zinc-700" },
  not_fit:        { label: "Not a Fit",      classes: "bg-zinc-800 text-zinc-600 ring-zinc-700" },
  not_interested: { label: "Not Interested", classes: "bg-zinc-800 text-zinc-500 ring-zinc-700" },
  unsubscribed:   { label: "Unsubscribed",   classes: "bg-red-500/10 text-red-400 ring-red-500/20" },
  bounced:        { label: "Bounced",        classes: "bg-orange-500/10 text-orange-400 ring-orange-500/20" },
  opted_out:      { label: "Opted Out",      classes: "bg-red-500/10 text-red-400 ring-red-500/20" },
};

// Render any status string safely, even values not in the config above.
const FALLBACK = { label: "Unknown", classes: "bg-zinc-800 text-zinc-500 ring-zinc-700" };

interface StatusBadgeProps {
  status: ContactStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as ContactStatus] ?? FALLBACK;
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
