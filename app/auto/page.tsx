import type { Metadata } from "next";
import { AutoCreativeOS } from "./AutoCreativeOS";

export const metadata: Metadata = {
  title: "Dealer Creative OS",
  description:
    "A controlled automotive creative production prototype by Archer Design.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AutoPage() {
  return <AutoCreativeOS />;
}
