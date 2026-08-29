import type { ReactNode } from "react";
import "./infuse.css";

// Scoped layout for the /infuse private, personalized page. Importing
// infuse.css here (rather than adding it to globals.css) keeps every
// .infuse-theme rule out of the main site's bundle on every other route,
// matching the pattern used by /dns, /jacaruso, /grant-hospitality, /tcrm,
// /pyramid, /rebel, and /first-hospitality.
export default function InfuseLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
