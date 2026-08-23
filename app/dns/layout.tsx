import type { ReactNode } from "react";
import "./dns.css";

// Scoped layout for the /dns private partnership concept.
// Importing dns.css here (rather than adding it to globals.css) keeps every
// .dns-theme rule out of the main site's bundle on every other route,
// matching the pattern used by /jacaruso, /bridgetown, /grant-hospitality,
// /tcrm, /pyramid, /rebel, and /first-hospitality.
export default function DnsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
