"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Shared "interested in exploring this with Topline" modal for /topline.
 * Every sales CTA on the page (header "Review the pilot", hero "Review the
 * 30-day pilot", the final CTA's "Discuss the three-property pilot", and
 * any future primary/secondary sales CTA) opens this single instance
 * instead of navigating away or triggering a mailto link. Ordinary
 * navigation, gallery/lightbox controls, calculator controls, and the
 * expandable pilot terms are untouched and do not use this component.
 *
 * One <ToplineInterestModalProvider> is mounted once near the root of the
 * page; any descendant calls useToplineInterestModal() to get `openModal`,
 * or renders the `<ToplineCtaButton>` convenience wrapper below.
 */

type ToplineInterestModalContextValue = {
  openModal: () => void;
};

const ToplineInterestModalContext = createContext<ToplineInterestModalContextValue | null>(null);

export function useToplineInterestModal() {
  const ctx = useContext(ToplineInterestModalContext);
  if (!ctx) {
    throw new Error("useToplineInterestModal must be used within a ToplineInterestModalProvider");
  }
  return ctx;
}

/** Drop-in replacement for a CTA <a>/<button>: same classes and children
 * (text, icons), but clicking it opens the shared modal instead of
 * navigating or mailing. */
export function ToplineCtaButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openModal } = useToplineInterestModal();
  return (
    <button type="button" className={className} onClick={openModal}>
      {children}
    </button>
  );
}

export function ToplineInterestModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const headingId = useId();
  const descriptionId = useId();

  const openModal = useCallback(() => {
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  // Track prefers-reduced-motion live, same pattern as HeroVideoBackground.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Move focus into the dialog on open; return it to whatever triggered it
  // (any CTA button) on close.
  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    } else {
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [open]);

  // Escape closes the modal; Tab is trapped inside it while open.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeModal]);

  return (
    <ToplineInterestModalContext.Provider value={{ openModal }}>
      {children}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`tl-modal-backdrop${reducedMotion ? " tl-modal--reduced-motion" : ""}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              aria-describedby={descriptionId}
              tabIndex={-1}
              className={`tl-modal${reducedMotion ? " tl-modal--reduced-motion" : ""}`}
            >
              <button
                type="button"
                className="tl-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
              <h2 id={headingId} className="tl-modal-heading">
                Interested in exploring this with Topline?
              </h2>
              <p id={descriptionId} className="tl-modal-message">
                Please let Ghisela know you are interested, and we will set up a meeting that works for
                your schedule.
              </p>
              <button type="button" className="tl-btn tl-modal-primary" onClick={closeModal}>
                Got it
              </button>
            </div>
          </div>,
          document.body
        )}
    </ToplineInterestModalContext.Provider>
  );
}
