import type { ReactNode } from "react";
import "../tcrm/tcrm.css";

// Hawkins intentionally reuses the warm editorial visual system built for
// the private TCRM proposal. The stylesheet is scoped under .tcrm-theme, so
// the Hawkins page opts into that system explicitly without affecting any
// public route.
export default function HawkinsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
