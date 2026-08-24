import type { Metadata } from "next";
import "./portal.css";

export const metadata: Metadata = {
  title: "Archer Design — Client Portal",
  // The portal is private to each client. Never indexable.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Chrome for the client portal.
 *
 * Deliberately does NOT render the CRM Sidebar or OwnerAuthGuard — see
 * components/AppChrome.tsx, which returns portal routes untouched. A client
 * must never see prospects, other clients, MRR, or internal notes, and
 * OwnerAuthGuard would sign them out for not being the owner.
 *
 * The .archer-portal class scopes the entire light visual system (portal.css)
 * so it cannot leak into the dark CRM, and repaints the background explicitly
 * so the app's near-black body never shows through.
 */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="archer-portal">{children}</div>;
}
