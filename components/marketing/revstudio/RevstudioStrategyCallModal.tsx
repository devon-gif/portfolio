"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fraunces } from "@/components/marketing/studioFont";
import { REVSTUDIO_CONTACT_INTEREST_OPTIONS } from "@/lib/revstudio";
import styles from "./RevstudioStrategyCallModal.module.css";

type FormValues = {
  fullName: string;
  email: string;
  companyOrProperty: string;
  role: string;
  phone: string;
  propertyCount: string;
  website: string;
  primaryInterest: string;
  message: string;
};

const EMPTY_FORM: FormValues = {
  fullName: "",
  email: "",
  companyOrProperty: "",
  role: "",
  phone: "",
  propertyCount: "",
  website: "",
  primaryInterest: "",
  message: "",
};

const MAX_LENGTHS: Partial<Record<keyof FormValues, number>> = {
  fullName: 200,
  email: 320,
  companyOrProperty: 300,
  role: 200,
  phone: 60,
  propertyCount: 60,
  website: 300,
  message: 4000,
};

const REQUIRED_FIELDS: (keyof FormValues)[] = ["fullName", "email", "companyOrProperty", "role"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lenient — only rejects obviously-not-a-website input (no dot, has spaces).
// Prospects type bare domains ("acmehotels.com") far more often than full URLs.
const WEBSITE_RE = /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#].*)?$/i;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function fieldError(field: keyof FormValues, values: FormValues): string | null {
  const raw = values[field];
  const trimmed = raw.trim();
  const max = MAX_LENGTHS[field];

  if (REQUIRED_FIELDS.includes(field) && !trimmed) {
    switch (field) {
      case "fullName": return "Please enter your full name.";
      case "email": return "Please enter your work email.";
      case "companyOrProperty": return "Please enter your hotel, property, agency, or management company.";
      case "role": return "Please enter your role or title.";
      default: return "This field is required.";
    }
  }
  if (field === "email" && trimmed && !EMAIL_RE.test(trimmed)) {
    return "Enter a valid email address.";
  }
  if (field === "website" && trimmed && !WEBSITE_RE.test(trimmed)) {
    return "Enter a valid website (e.g. yourhotel.com).";
  }
  if (max && raw.length > max) {
    return `Please shorten this to ${max} characters or fewer.`;
  }
  return null;
}

function validateAll(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  (Object.keys(values) as (keyof FormValues)[]).forEach((field) => {
    const err = fieldError(field, values);
    if (err) errors[field] = err;
  });
  return errors;
}

/**
 * The "Request a strategy call" modal for /revstudio — rendered via a React
 * portal directly under document.body so its `position: fixed` overlay is
 * always relative to the viewport, never to some ancestor on the page that
 * happens to set a `transform`/`filter`/`backdrop-filter` (any of those on
 * an ancestor turns a descendant's `position: fixed` into something scoped
 * to that ancestor instead of the viewport — the animated Reveal sections
 * and gradient/backdrop layers on this page are exactly that kind of
 * ancestor). Styling lives in RevstudioStrategyCallModal.module.css, which
 * is fully self-contained (no dependency on the `.revstudio-theme` class
 * being an ancestor) for the same reason.
 *
 * Opened via useRevstudioContactModal() (RevstudioContactModalContext.tsx)
 * from every conversion CTA on the page.
 */
export function RevstudioStrategyCallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [hpToken, setHpToken] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [phase, setPhase] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const successCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Fresh form every time the modal opens — no stale values, no stale
  // validation state, no errors visible on first paint.
  useEffect(() => {
    if (!open) return;
    setValues(EMPTY_FORM);
    setHpToken("");
    setTouched({});
    setSubmitAttempted(false);
    setPhase("form");
    setSubmitting(false);
    setErrorMessage(null);
  }, [open]);

  // Initial focus + scroll lock + Escape/Tab handling while open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      fullNameRef.current?.focus();
    }, 30);

    function getFocusable(): HTMLElement[] {
      const modal = modalRef.current;
      if (!modal) return [];
      return Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      );
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
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
    }

    document.addEventListener("keydown", onKeydown, true);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeydown, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && phase === "success") successCloseRef.current?.focus();
  }, [open, phase]);

  const handleChange = useCallback(
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setValues((prev) => ({ ...prev, [field]: v }));
    },
    []
  );

  const handleBlur = useCallback(
    (field: keyof FormValues) => () => {
      setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    },
    []
  );

  function onBackdropMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  const errors = validateAll(values);
  const shouldShowError = (field: keyof FormValues) => (touched[field] || submitAttempted) && !!errors[field];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return; // duplicate-click protection
    setErrorMessage(null);
    setSubmitAttempted(true);

    if (Object.keys(errors).length > 0) {
      const order: (keyof FormValues)[] = ["fullName", "email", "companyOrProperty", "role"];
      const firstInvalid = order.find((f) => errors[f]);
      if (firstInvalid === "fullName") fullNameRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/revstudio/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, hp_token: hpToken }),
      });
      const data: unknown = await res.json().catch(() => null);
      const ok = !!(data && typeof data === "object" && "ok" in data && (data as { ok: boolean }).ok);
      if (ok) {
        setPhase("success");
      } else {
        const message =
          data && typeof data === "object" && "error" in data && typeof (data as { error?: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Something went wrong. Please try again.";
        setErrorMessage(message);
      }
    } catch {
      setErrorMessage("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  const fieldClass = (field: keyof FormValues) => `${styles.field} ${shouldShowError(field) ? styles.fieldInvalid : ""}`;

  const node = (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
      aria-hidden={open ? "false" : "true"}
      onMouseDown={onBackdropMouseDown}
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${fraunces.variable}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rvStrategyCallTitle"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          &times;
        </button>

        {phase === "form" ? (
          <form onSubmit={handleSubmit} noValidate>
            <h2 id="rvStrategyCallTitle" className={styles.heading}>Request a strategy call</h2>
            <p className={styles.sub}>
              Share a few details about your property, portfolio, or current priorities. Ghisela and Devon will review
              your request and follow up to coordinate a Microsoft Teams or Google Meet conversation.
            </p>

            <div className={`${styles.errorBanner} ${errorMessage ? styles.errorBannerVisible : ""}`} role="alert">
              {errorMessage}
            </div>

            {/* Honeypot — real visitors never see or focus this field. */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="rvHpToken">Leave this field blank</label>
              <input
                type="text"
                id="rvHpToken"
                name="hp_token"
                tabIndex={-1}
                autoComplete="off"
                value={hpToken}
                onChange={(e) => setHpToken(e.target.value)}
              />
            </div>

            <div className={fieldClass("fullName")}>
              <label className={styles.label} htmlFor="rvFullName">
                Full name<span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                ref={fullNameRef}
                type="text"
                id="rvFullName"
                name="fullName"
                className={styles.input}
                autoComplete="name"
                required
                aria-required="true"
                aria-describedby="rvFullNameErr"
                value={values.fullName}
                onChange={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
              />
              <p className={styles.errorMsg} id="rvFullNameErr">{errors.fullName}</p>
            </div>

            <div className={styles.row}>
              <div className={fieldClass("email")}>
                <label className={styles.label} htmlFor="rvEmail">
                  Work email<span className={styles.required} aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="rvEmail"
                  name="email"
                  className={styles.input}
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-describedby="rvEmailErr"
                  value={values.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <p className={styles.errorMsg} id="rvEmailErr">{errors.email}</p>
              </div>
              <div className={fieldClass("phone")}>
                <label className={styles.label} htmlFor="rvPhone">
                  Phone number<span className={styles.optional}>(optional)</span>
                </label>
                <input
                  type="tel"
                  id="rvPhone"
                  name="phone"
                  className={styles.input}
                  autoComplete="tel"
                  value={values.phone}
                  onChange={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                />
                <p className={styles.errorMsg}>{errors.phone}</p>
              </div>
            </div>

            <div className={fieldClass("companyOrProperty")}>
              <label className={styles.label} htmlFor="rvCompany">
                Hotel, property, agency, or management company<span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="rvCompany"
                name="companyOrProperty"
                className={styles.input}
                autoComplete="organization"
                required
                aria-required="true"
                aria-describedby="rvCompanyErr"
                value={values.companyOrProperty}
                onChange={handleChange("companyOrProperty")}
                onBlur={handleBlur("companyOrProperty")}
              />
              <p className={styles.errorMsg} id="rvCompanyErr">{errors.companyOrProperty}</p>
            </div>

            <div className={styles.row}>
              <div className={fieldClass("role")}>
                <label className={styles.label} htmlFor="rvRole">
                  Role or title<span className={styles.required} aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="rvRole"
                  name="role"
                  className={styles.input}
                  autoComplete="organization-title"
                  required
                  aria-required="true"
                  aria-describedby="rvRoleErr"
                  value={values.role}
                  onChange={handleChange("role")}
                  onBlur={handleBlur("role")}
                />
                <p className={styles.errorMsg} id="rvRoleErr">{errors.role}</p>
              </div>
              <div className={fieldClass("propertyCount")}>
                <label className={styles.label} htmlFor="rvPropertyCount">
                  Number of properties<span className={styles.optional}>(optional)</span>
                </label>
                <input
                  type="text"
                  id="rvPropertyCount"
                  name="propertyCount"
                  className={styles.input}
                  inputMode="numeric"
                  placeholder="e.g. 1, 3, 12+"
                  value={values.propertyCount}
                  onChange={handleChange("propertyCount")}
                  onBlur={handleBlur("propertyCount")}
                />
                <p className={styles.errorMsg}>{errors.propertyCount}</p>
              </div>
            </div>

            <div className={fieldClass("website")}>
              <label className={styles.label} htmlFor="rvWebsite">
                Website<span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="text"
                id="rvWebsite"
                name="website"
                className={styles.input}
                autoComplete="url"
                placeholder="yourhotel.com"
                value={values.website}
                onChange={handleChange("website")}
                onBlur={handleBlur("website")}
              />
              <p className={styles.errorMsg}>{errors.website}</p>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="rvInterest">
                Primary area of interest<span className={styles.optional}>(optional)</span>
              </label>
              <select
                id="rvInterest"
                name="primaryInterest"
                className={styles.select}
                value={values.primaryInterest}
                onChange={handleChange("primaryInterest")}
              >
                <option value="">Select an option</option>
                {REVSTUDIO_CONTACT_INTEREST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="rvMessage">
                Brief message or current priority<span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="rvMessage"
                name="message"
                className={styles.textarea}
                placeholder="Anything specific you'd like Ghisela and Devon to know before the call."
                value={values.message}
                onChange={handleChange("message")}
                onBlur={handleBlur("message")}
              />
            </div>

            <div className={styles.submitRow}>
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit request"}
              </button>
              <span className={styles.submitNote}>Fields marked * are required.</span>
            </div>
          </form>
        ) : (
          <div className={`${styles.success} ${fraunces.variable}`}>
            <div className={styles.successIcon} aria-hidden="true">&#10003;</div>
            <h3 className={styles.successHeading}>Thank you — your request has been received.</h3>
            <p className={styles.successBody}>Ghisela and Devon will review the information and follow up shortly to coordinate a conversation.</p>
            <button ref={successCloseRef} type="button" className={styles.ghostButton} onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
