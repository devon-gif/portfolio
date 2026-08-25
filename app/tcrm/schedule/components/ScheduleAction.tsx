"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";
import styles from "./ScheduleAction.module.css";

const PLAN_LABELS: Record<string, string> = {
  essential: "Essential — $895/month",
  growth: "Growth — $1,295/month",
  "full-campaign": "Full Campaign — $1,695/month",
  starter: "30-Day Creative Starter — $895 one time",
  custom: "Build Your Own Creative Pack",
};

export function ScheduleAction(
  _props: Record<string, unknown>,
) {
  const params = useSearchParams();

  const plan =
    params.get("plan") || "essential";

  const staticCount =
    Number(params.get("static") || 0);

  const motionCount =
    Number(params.get("motion") || 0);

  const [step, setStep] = useState(1);

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const [message, setMessage] =
    useState("");

  const customTotal =
    staticCount * 75 + motionCount * 95;

  const planLabel =
    plan === "custom"
      ? `Build Your Own — ${motionCount} motion + ${staticCount} static — $${customTotal}`
      : PLAN_LABELS[plan] || plan;

  function next(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const form =
      event.currentTarget.closest("form");

    if (!form) return;

    const data = new FormData(form);

    const requiredByStep: Record<
      number,
      string[]
    > = {
      1: [
        "propertyName",
        "contactName",
        "contactEmail",
      ],
      2: ["firstPromotion"],
      3: [],
      4: [],
    };

    const missing =
      requiredByStep[step]?.find(
        (name) =>
          !String(data.get(name) || "").trim(),
      );

    if (missing) {
      setMessage(
        "Please complete the required fields before continuing.",
      );
      setStatus("error");
      return;
    }

    setStatus("idle");
    setMessage("");

    setStep((current) =>
      Math.min(4, current + 1),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function back() {
    setStatus("idle");
    setMessage("");

    setStep((current) =>
      Math.max(1, current - 1),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setStatus("sending");
    setMessage("");

    const form =
      new FormData(event.currentTarget);

    const payload = {
      plan,
      staticCount,
      motionCount,

      website: String(
        form.get("website") || "",
      ),

      propertyName: String(
        form.get("propertyName") || "",
      ),

      propertyWebsite: String(
        form.get("propertyWebsite") || "",
      ),

      propertyLocation: String(
        form.get("propertyLocation") || "",
      ),

      contactName: String(
        form.get("contactName") || "",
      ),

      contactEmail: String(
        form.get("contactEmail") || "",
      ),

      contactPhone: String(
        form.get("contactPhone") || "",
      ),

      tcrmContact: String(
        form.get("tcrmContact") || "",
      ),

      priorities: form
        .getAll("priorities")
        .map(String),

      firstPromotion: String(
        form.get("firstPromotion") || "",
      ),

      targetAudience: String(
        form.get("targetAudience") || "",
      ),

      importantDates: String(
        form.get("importantDates") || "",
      ),

      offerDetails: String(
        form.get("offerDetails") || "",
      ),

      brandAssetsUrl: String(
        form.get("brandAssetsUrl") || "",
      ),

      brandGuidelinesUrl: String(
        form.get("brandGuidelinesUrl") || "",
      ),

      photoLibraryUrl: String(
        form.get("photoLibraryUrl") || "",
      ),

      instagram: String(
        form.get("instagram") || "",
      ),

      facebook: String(
        form.get("facebook") || "",
      ),

      approverName: String(
        form.get("approverName") || "",
      ),

      approverEmail: String(
        form.get("approverEmail") || "",
      ),

      approvalNotes: String(
        form.get("approvalNotes") || "",
      ),

      kickoffPreference: String(
        form.get("kickoffPreference") || "",
      ),

      availabilityNotes: String(
        form.get("availabilityNotes") || "",
      ),

      additionalNotes: String(
        form.get("additionalNotes") || "",
      ),
    };

    try {
      const response = await fetch(
        "/api/tcrm/activation-request",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result =
        await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ||
            "Unable to submit onboarding.",
        );
      }

      setStatus("success");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit onboarding.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          ✓
        </div>

        <p className={styles.eyebrow}>
          CREATIVE ONBOARDING RECEIVED
        </p>

        <h2>
          You’ve given us what we need
          to prepare.
        </h2>

        <p>
          Your selected creative plan and
          onboarding information have been
          sent to TCRM and Archer Design.
        </p>

        <div className={styles.successPlan}>
          <span>SELECTED PLAN</span>
          <strong>{planLabel}</strong>
        </div>

        <div className={styles.nextSteps}>
          <div>
            <strong>01</strong>
            <span>
              TCRM confirms your activation
              and payment method.
            </span>
          </div>

          <div>
            <strong>02</strong>
            <span>
              Archer Design reviews your
              brand assets and priorities.
            </span>
          </div>

          <div>
            <strong>03</strong>
            <span>
              If a kickoff was requested,
              we’ll coordinate it after
              activation.
            </span>
          </div>

          <div>
            <strong>04</strong>
            <span>
              Your first creative priorities
              move into production.
            </span>
          </div>
        </div>

        <p className={styles.paymentNote}>
          No payment was collected on this
          page. TCRM will confirm billing and
          activation separately.
        </p>

        <a
          className={styles.returnLink}
          href="/tcrm"
        >
          ← Return to Creative Activation
        </a>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <div className={styles.top}>
        <div>
          <p className={styles.eyebrow}>
            TCRM CREATIVE ACTIVATION
          </p>

          <h2>
            Complete your creative
            onboarding.
          </h2>

          <p className={styles.intro}>
            Give TCRM and Archer Design the
            information needed to prepare
            your first creative work.
          </p>
        </div>

        <div className={styles.selectedPlan}>
          <span>YOUR SELECTION</span>
          <strong>{planLabel}</strong>
        </div>
      </div>

      <div className={styles.progress}>
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`${styles.progressItem} ${
              step >= item
                ? styles.progressActive
                : ""
            }`}
          >
            <span>{item}</span>

            <small>
              {item === 1 && "Property"}
              {item === 2 && "Priorities"}
              {item === 3 && "Assets"}
              {item === 4 && "Approval"}
            </small>
          </div>
        ))}
      </div>

      <section
        className={styles.stepSection}
        hidden={step !== 1}
      >
        <div className={styles.stepHeading}>
          <span>01</span>

          <div>
            <h3>
              Property &amp; contact
            </h3>

            <p>
              Tell us where this creative
              will be used and who we should
              work with.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <label className={styles.full}>
            <span>
              Property / Hotel Name *
            </span>

            <input
              name="propertyName"
              autoComplete="organization"
              placeholder="Hotel or property name"
            />
          </label>

          <label>
            <span>Property Website</span>

            <input
              name="propertyWebsite"
              placeholder="https://..."
            />
          </label>

          <label>
            <span>City / Location</span>

            <input
              name="propertyLocation"
              placeholder="City, State"
            />
          </label>

          <label>
            <span>Your Name *</span>

            <input
              name="contactName"
              autoComplete="name"
              placeholder="First and last name"
            />
          </label>

          <label>
            <span>Work Email *</span>

            <input
              type="email"
              name="contactEmail"
              autoComplete="email"
              placeholder="you@hotel.com"
            />
          </label>

          <label>
            <span>Phone</span>

            <input
              type="tel"
              name="contactPhone"
              autoComplete="tel"
              placeholder="Optional"
            />
          </label>

          <label>
            <span>Your TCRM Contact</span>

            <select
              name="tcrmContact"
              defaultValue=""
            >
              <option value="">
                Select if known
              </option>

              <option value="David Beaulieu">
                David Beaulieu
              </option>

              <option value="Kathryn Baker">
                Kathryn Baker
              </option>

              <option value="Other TCRM contact">
                Another TCRM contact
              </option>

              <option value="Not sure">
                Not sure
              </option>
            </select>
          </label>
        </div>
      </section>

      <section
        className={styles.stepSection}
        hidden={step !== 2}
      >
        <div className={styles.stepHeading}>
          <span>02</span>

          <div>
            <h3>
              Creative priorities
            </h3>

            <p>
              Tell us where you want the
              creative team focused first.
            </p>
          </div>
        </div>

        <p className={styles.fieldLabel}>
          What would you like help
          promoting?
        </p>

        <div className={styles.checkGrid}>
          {[
            "Rooms & direct bookings",
            "Food & beverage",
            "Meetings & events",
            "Weddings",
            "Spa & wellness",
            "Seasonal promotions",
            "Packages & offers",
            "Local experiences",
          ].map((priority) => (
            <label
              key={priority}
              className={styles.checkCard}
            >
              <input
                type="checkbox"
                name="priorities"
                value={priority}
              />

              <span>{priority}</span>
            </label>
          ))}
        </div>

        <div className={styles.grid}>
          <label className={styles.full}>
            <span>
              What should we promote first? *
            </span>

            <textarea
              name="firstPromotion"
              rows={4}
              placeholder="Example: Labor Day weekend package, rooftop dining, wedding inquiries, meeting space, seasonal offer..."
            />
          </label>

          <label className={styles.full}>
            <span>
              Who are you trying to reach?
            </span>

            <textarea
              name="targetAudience"
              rows={3}
              placeholder="Business travelers, local diners, wedding planners, families, leisure travelers..."
            />
          </label>

          <label>
            <span>
              Important dates / deadlines
            </span>

            <input
              name="importantDates"
              placeholder="Launch date, event date, etc."
            />
          </label>

          <label>
            <span>
              Offer / promotion details
            </span>

            <input
              name="offerDetails"
              placeholder="Rates, codes, restrictions, CTA..."
            />
          </label>
        </div>
      </section>

      <section
        className={styles.stepSection}
        hidden={step !== 3}
      >
        <div className={styles.stepHeading}>
          <span>03</span>

          <div>
            <h3>
              Brand assets
            </h3>

            <p>
              For now, simply share links
              to the folders your team
              already uses.
            </p>
          </div>
        </div>

        <div className={styles.assetNotice}>
          <strong>
            No need to upload everything
            again.
          </strong>

          <p>
            Paste Google Drive, Dropbox,
            OneDrive, SharePoint, or other
            accessible asset links below.
          </p>
        </div>

        <div className={styles.grid}>
          <label className={styles.full}>
            <span>
              Main Brand Asset Folder
            </span>

            <input
              name="brandAssetsUrl"
              placeholder="Logo files, fonts, property assets..."
            />
          </label>

          <label>
            <span>
              Brand Guidelines
            </span>

            <input
              name="brandGuidelinesUrl"
              placeholder="Link if available"
            />
          </label>

          <label>
            <span>
              Photo / Video Library
            </span>

            <input
              name="photoLibraryUrl"
              placeholder="Drive, Dropbox, DAM..."
            />
          </label>

          <label>
            <span>Instagram</span>

            <input
              name="instagram"
              placeholder="@property or URL"
            />
          </label>

          <label>
            <span>Facebook</span>

            <input
              name="facebook"
              placeholder="Page URL"
            />
          </label>
        </div>
      </section>

      <section
        className={styles.stepSection}
        hidden={step !== 4}
      >
        <div className={styles.stepHeading}>
          <span>04</span>

          <div>
            <h3>
              Approval &amp; kickoff
            </h3>

            <p>
              Help us understand who signs
              off on creative and how you
              prefer to work.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <label>
            <span>
              Final Creative Approver
            </span>

            <input
              name="approverName"
              placeholder="Name"
            />
          </label>

          <label>
            <span>Approver Email</span>

            <input
              type="email"
              name="approverEmail"
              placeholder="approver@hotel.com"
            />
          </label>

          <label className={styles.full}>
            <span>
              Approval / Brand Notes
            </span>

            <textarea
              name="approvalNotes"
              rows={3}
              placeholder="Corporate approvals, required disclaimers, brand restrictions, typical turnaround..."
            />
          </label>

          <label className={styles.full}>
            <span>
              Creative Kickoff Preference
            </span>

            <select
              name="kickoffPreference"
              defaultValue="recommended"
            >
              <option value="recommended">
                Yes — a short creative kickoff
                would be helpful
              </option>

              <option value="email">
                Email onboarding is enough
                for now
              </option>

              <option value="unsure">
                Not sure — recommend what is
                best
              </option>
            </select>
          </label>

          <label className={styles.full}>
            <span>
              Scheduling / Availability Notes
            </span>

            <input
              name="availabilityNotes"
              placeholder="Example: Tuesdays and Thursdays after 2 PM ET"
            />
          </label>

          <label className={styles.full}>
            <span>
              Anything else we should know?
            </span>

            <textarea
              name="additionalNotes"
              rows={4}
              placeholder="Upcoming campaigns, challenges, creative preferences, additional stakeholders..."
            />
          </label>
        </div>

        <div className={styles.reviewBox}>
          <span>
            SELECTED CREATIVE PLAN
          </span>

          <strong>{planLabel}</strong>

          <p>
            Submitting this onboarding does
            not charge your property. TCRM
            will separately confirm billing,
            activation, and any optional
            6- or 12-month agreement.
          </p>
        </div>
      </section>

      <label
        className={styles.honeypot}
        aria-hidden="true"
      >
        Website

        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      {status === "error" && (
        <div
          className={styles.error}
          role="alert"
        >
          {message}
        </div>
      )}

      <div className={styles.actions}>
        {step > 1 && (
          <button
            type="button"
            className={styles.back}
            onClick={back}
          >
            ← Back
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            className={styles.continue}
            onClick={next}
          >
            Continue
            <span>→</span>
          </button>
        ) : (
          <button
            type="submit"
            className={styles.continue}
            disabled={
              status === "sending"
            }
          >
            {status === "sending"
              ? "Submitting…"
              : "Submit Creative Onboarding"}

            <span>→</span>
          </button>
        )}
      </div>

      <p className={styles.note}>
        Your information is sent to TCRM
        and Archer Design so your team can
        prepare for activation and creative
        production.
      </p>
    </form>
  );
}
