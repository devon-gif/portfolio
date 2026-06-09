import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title = "No results",
  description = "Nothing here yet.",
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="mb-4 text-zinc-700">
        {icon ?? <Inbox className="h-10 w-10" />}
      </div>
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
