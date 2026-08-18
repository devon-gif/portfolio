import type { ReactNode } from "react";
import "./coraltree.css";

// /coraltree is a private, personalized sales proposal. Its original styles
// are restored in a route-scoped stylesheet so newer portfolio pages remain
// untouched.
export default function CoralTreeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
