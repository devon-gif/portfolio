import type { ReactNode } from "react";
import "./grant-hospitality.css";

// Scoped layout for the /grant-hospitality private partnership concept.
// Importing grant-hospitality.css here (rather than adding it to
// globals.css) keeps every .grant-theme rule out of the main site's bundle
// on every other route, matching the pattern used by /bridgetown, /tcrm,
// /pyramid, and /first-hospitality.
export default function GrantHospitalityLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
