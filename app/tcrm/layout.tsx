import type { ReactNode } from "react";
import "./tcrm.css";

// Scoped layout for the /tcrm private proposal.
// Importing tcrm.css here (rather than adding it to globals.css) keeps every
// .tcrm-theme rule out of the main site's bundle on every other route.
export default function TcrmLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
