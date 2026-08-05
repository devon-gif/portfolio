import type { ReactNode } from "react";
import "./bridgetown.css";

// Scoped layout for the /bridgetown private partnership concept.
// Importing bridgetown.css here (rather than adding it to globals.css) keeps
// every .bridgetown-theme rule out of the main site's bundle on every other
// route, matching the pattern used by /tcrm, /pyramid, and /first-hospitality.
export default function BridgetownLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
