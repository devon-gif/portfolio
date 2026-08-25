"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { RevstudioStrategyCallModal } from "./RevstudioStrategyCallModal";

type RevstudioContactModalContextValue = {
  openModal: () => void;
};

const RevstudioContactModalContext = createContext<RevstudioContactModalContextValue | null>(null);

/**
 * Every conversion CTA on /revstudio ("Discuss a pilot," "Contact the
 * partners," the footer "Contact" link) calls this hook to open the same
 * "Request a strategy call" modal, instead of each button managing its own
 * open state or linking to Calendly/mailto. Must be used within
 * <RevstudioContactModalProvider>, which is mounted once at the page root
 * (app/revstudio/page.tsx).
 */
export function useRevstudioContactModal(): RevstudioContactModalContextValue {
  const ctx = useContext(RevstudioContactModalContext);
  if (!ctx) {
    throw new Error("useRevstudioContactModal must be used within RevstudioContactModalProvider");
  }
  return ctx;
}

export function RevstudioContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback(() => {
    // Captured *before* the state update, while the clicked CTA is still
    // document.activeElement — this is what focus returns to on close.
    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    lastFocusedRef.current?.focus?.();
  }, []);

  const value = useMemo(() => ({ openModal }), [openModal]);

  return (
    <RevstudioContactModalContext.Provider value={value}>
      {children}
      <RevstudioStrategyCallModal open={isOpen} onClose={closeModal} />
    </RevstudioContactModalContext.Provider>
  );
}
