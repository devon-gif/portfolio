import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./cootoh.css";

export const metadata: Metadata = {
  title: "Cootoh × Archer Design | Premium Chef Launch System",
  description:
    "A concept for turning Cootoh chef profiles into premium booking-ready microsites, launch campaigns, motion and hospitality experiences.",
  robots: { index: false, follow: false },
};

export default function CootohLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
