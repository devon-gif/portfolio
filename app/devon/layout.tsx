import type { ReactNode } from "react";
import { AutoCreativeMainPageShowcase } from "./components/AutoCreativeMainPageShowcase";
import "./devon.css";
import "./devon-v2.css";

export default function DevonLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AutoCreativeMainPageShowcase />
    </>
  );
}
