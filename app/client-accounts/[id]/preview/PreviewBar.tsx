import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Owner-only escape hatch back to the CRM. A real client never sees this. */
export function PreviewBar({ recordId }: { recordId: string }) {
  return (
    <div style={{ padding: "14px 24px 0" }}>
      <Link href={`/client-accounts/${recordId}`} className="ap-btn ap-btn--quiet ap-btn--sm">
        <ArrowLeft size={14} aria-hidden="true" /> Back to admin workspace
      </Link>
    </div>
  );
}
