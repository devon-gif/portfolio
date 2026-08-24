import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortalSignOut } from "./PortalSignOut";

/**
 * Portal header. `backHref` is set only by the owner preview, which is how the
 * owner returns to the admin workspace — a real client session never receives
 * it, so no CRM link is ever rendered to a client.
 */
export function PortalHeader({
  organizationName,
  viewerName,
  isDemo,
  backHref,
}: {
  organizationName: string;
  viewerName: string;
  isDemo: boolean;
  backHref?: string;
}) {
  return (
    <header className="ap-header">
      <div className="ap-shell">
        <div className="ap-header-inner">
          <div className="ap-brand">
            <span className="ap-brand-name">Archer Design</span>
            <span className="ap-brand-sub">Client Portal</span>
          </div>

          <div className="ap-header-right">
            <div className="ap-whoami">
              <strong>{viewerName}</strong>
              <span>{organizationName}</span>
            </div>
            {backHref ? (
              <Link href={backHref} className="ap-btn ap-btn--quiet">
                <ArrowLeft size={14} aria-hidden="true" />
                Back to workspace
              </Link>
            ) : isDemo ? null : (
              <PortalSignOut />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
