import type { Metadata } from "next";
import { AutoCreativeDemo } from "./AutoCreativeDemo";

export const metadata: Metadata = {
  title: "Auto Creative OS — Devon Archer",
  description: "Interactive creative-production prototype showing responsive campaign recomposition across placement sizes.",
  robots: { index: false, follow: false },
};

export default function AutoCreativeOSPortfolioPage() {
  return <AutoCreativeDemo />;
}
