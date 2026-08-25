import type { ReactNode } from "react";
import "./cana.css";
import { CanaHeroVideoSwap } from "./CanaHeroVideoSwap";

export default function CanaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CanaHeroVideoSwap />
    </>
  );
}
