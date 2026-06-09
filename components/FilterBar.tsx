import type { FilterKey } from "@/lib/types";
import clsx from "clsx";

interface Filter {
  key: FilterKey;
  label: string;
}

const FILTERS: Filter[] = [
  { key: "all",                label: "All" },
  { key: "buyer",              label: "Buyers" },
  { key: "partner",            label: "Partners" },
  { key: "management_company", label: "Management Cos." },
  { key: "property_level",     label: "Property-Level" },
  { key: "follow_up_due",      label: "Follow-up Due" },
  { key: "no_email",           label: "No Email" },
  { key: "linkedin_only",      label: "LinkedIn Only" },
];

interface FilterBarProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
  counts: Partial<Record<FilterKey, number>>;
}

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const count = counts[f.key];
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30"
                : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            )}
          >
            {f.label}
            {count !== undefined && (
              <span
                className={clsx(
                  "rounded-full px-1.5 py-px text-xs font-bold tabular-nums",
                  isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-700 text-zinc-400"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
