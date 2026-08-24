import Link from "next/link";
import { Check } from "lucide-react";
import type { PortalData, ReviewItem } from "@/lib/portal/types";
import { ACTIVE_STATUSES, onboardingProgress } from "@/lib/portal/types";
import { PortalHeader } from "./PortalHeader";
import { ReviewItemCard } from "./ReviewItemCard";

function money(n: number | null): string {
  if (n == null) return "—";
  return `$${n.toLocaleString("en-US")}`;
}

function billingLabel(status: string | null): string {
  if (!status) return "—";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * The client dashboard.
 *
 * Rendered for BOTH a real signed-in client (/portal) and the owner's
 * "View client dashboard" preview, from identical data shapes — so what the
 * owner reviews is genuinely what a client sees, not a mock-up of it.
 *
 * Note what is absent by construction: no internal notes, no other clients, no
 * MRR, no pipeline stage, no prospect data. PortalData has no field for any of
 * them, so none can be rendered by accident.
 */
export function PortalDashboard({ data, backHref }: { data: PortalData; backHref?: string }) {
  const progress = onboardingProgress(data.tasks);
  const outstanding = data.tasks.filter((t) => t.status === "pending");

  const visible = data.items.filter((i) => i.status !== "archived");
  const active = visible.filter((i) => (ACTIVE_STATUSES as string[]).includes(i.status));
  const inProgress = visible.filter((i) => i.status === "draft");

  const needsYou = active.filter((i) => i.status === "ready_for_review");
  const awaitingArcher = active.filter(
    (i) => i.status === "changes_requested" || i.status === "new_direction_requested"
  );
  const approved = active.filter((i) => i.status === "approved");

  const counts = [
    { label: "Ready for review", value: needsYou.length },
    { label: "Changes requested", value: awaitingArcher.length },
    { label: "Approved", value: approved.length },
    { label: "In progress", value: inProgress.length },
  ];

  const everythingElse = visible.filter((i) => !needsYou.includes(i));

  return (
    <>
      <PortalHeader
        organizationName={data.organizationName}
        viewerName={data.account.contactName ?? data.viewerFirstName}
        isDemo={data.source === "demo"}
        backHref={backHref}
      />

      <div className="ap-shell">
        <div className="ap-main">
          {data.source === "demo" && (
            <div className="ap-notice" role="status">
              <span className="ap-pill ap-pill--demo">Demo data</span>
              <span>
                This is a preview of the client experience using a fictional account. Nothing here is real client data,
                and no billing or subscription exists for it.
              </span>
            </div>
          )}

          {/* Greeting + plan */}
          <section className="ap-row ap-row--2" style={{ alignItems: "start" }}>
            <div>
              <h1 className="ap-greeting">Hi {data.viewerFirstName}</h1>
              <p className="ap-org">{data.organizationName}</p>
              <p className="ap-muted" style={{ marginTop: 18, maxWidth: "34ch" }}>
                {needsYou.length > 0
                  ? `${needsYou.length} ${needsYou.length === 1 ? "piece of creative is" : "pieces of creative are"} waiting on your decision.`
                  : inProgress.length > 0
                    ? "Nothing needs your decision right now — Archer is working on the next set."
                    : "Everything is up to date. Nothing is waiting on you."}
              </p>
            </div>

            <div className="ap-card">
              <span className="ap-eyebrow">Your plan</span>
              <h2 className="ap-section-title" style={{ marginTop: 10 }}>
                {data.account.packageName ?? "Creative partnership"}
              </h2>
              <div className="ap-row ap-row--3" style={{ marginTop: 18 }}>
                <div>
                  <div className="ap-figure">{money(data.account.monthlyFee)}</div>
                  <span className="ap-label">Per month</span>
                </div>
                <div>
                  <div className="ap-figure">{data.account.propertyCount ?? "—"}</div>
                  <span className="ap-label">{data.account.propertyCount === 1 ? "Property" : "Properties"}</span>
                </div>
                <div>
                  <div className="ap-figure" style={{ fontSize: 17, paddingTop: 8 }}>
                    {billingLabel(data.account.billingStatus)}
                  </div>
                  <span className="ap-label">Billing</span>
                </div>
              </div>
            </div>
          </section>

          {/* Creative review — the reason the portal exists, so it leads. */}
          <section>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <h2 className="ap-section-title">Creative review</h2>
              {needsYou.length > 0 && (
                <span className="ap-muted">
                  {needsYou.length} {needsYou.length === 1 ? "piece needs" : "pieces need"} your decision
                </span>
              )}
            </div>

            <div className="ap-row ap-row--4" style={{ marginTop: 16 }}>
              {counts.map((c) => (
                <div key={c.label} className="ap-stat">
                  <div className="ap-figure">{c.value}</div>
                  <span className="ap-label">{c.label}</span>
                </div>
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="ap-card" style={{ marginTop: 20 }}>
                <div className="ap-empty">
                  <strong>Nothing to review yet</strong>
                  When Archer sends work over, it will appear here for your approval.
                </div>
              </div>
            ) : (
              <>
                {needsYou.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <span className="ap-label">Needs your review</span>
                    <div className="ap-items" style={{ marginTop: 12 }}>
                      {needsYou.map((item) => (
                        <ReviewItemCard key={item.id} item={item} readOnly={data.source === "demo"} />
                      ))}
                    </div>
                  </div>
                )}

                {everythingElse.length > 0 && (
                  <div style={{ marginTop: needsYou.length > 0 ? 30 : 24 }}>
                    <span className="ap-label">{needsYou.length > 0 ? "Everything else" : "Your creative"}</span>
                    <div className="ap-items" style={{ marginTop: 12 }}>
                      {everythingElse.map((item) => (
                        <ReviewItemCard key={item.id} item={item} readOnly={data.source === "demo"} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Onboarding + account */}
          <section className="ap-row ap-row--2">
            <div className="ap-card">
              <span className="ap-eyebrow">Getting set up</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 10, marginBottom: 14 }}>
                <span className="ap-figure">{progress}%</span>
                <span className="ap-muted">complete</span>
              </div>
              <div className="ap-track" role="img" aria-label={`Onboarding ${progress} percent complete`}>
                <div className="ap-track-fill" style={{ width: `${progress}%` }} />
              </div>

              {data.tasks.length === 0 ? (
                <p className="ap-muted" style={{ marginTop: 16 }}>
                  Your onboarding checklist will appear here once your account is set up.
                </p>
              ) : (
                <ul className="ap-check" style={{ marginTop: 18 }}>
                  {data.tasks.map((t) => (
                    <li key={t.id} className={t.status === "done" ? "is-done" : ""}>
                      <span className={`ap-dot${t.status === "done" ? " ap-dot--done" : ""}`}>
                        {t.status === "done" && <Check size={10} strokeWidth={3} aria-hidden="true" />}
                      </span>
                      <span>
                        <span className="ap-check-text">{t.title}</span>
                        {t.description && (
                          <span style={{ display: "block", fontSize: 12, color: "var(--ap-charcoal-faint)" }}>
                            {t.description}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {outstanding.length > 0 && (
                <p className="ap-muted" style={{ marginTop: 16 }}>
                  {outstanding.length} {outstanding.length === 1 ? "item" : "items"} still outstanding.
                </p>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="ap-card">
                <span className="ap-eyebrow">Your properties</span>
                {data.properties.length === 0 ? (
                  <p className="ap-muted" style={{ marginTop: 12 }}>
                    No properties have been added to your workspace yet.
                  </p>
                ) : (
                  <ul className="ap-check" style={{ marginTop: 14 }}>
                    {data.properties.map((p) => (
                      <li key={p.id}>
                        <span className="ap-dot ap-dot--done">
                          <Check size={10} strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span className="ap-check-text">{p.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="ap-card">
                <span className="ap-eyebrow">Billing</span>
                <p className="ap-muted" style={{ marginTop: 12, marginBottom: 16 }}>
                  {data.account.hasBillingPortal
                    ? "Manage your payment method, view invoices, or update billing details."
                    : "Billing is handled directly with Archer Design. Reach out any time and we'll send an invoice or a payment link."}
                </p>
                {data.account.hasBillingPortal ? (
                  <Link href="/portal/billing" className="ap-btn ap-btn--quiet">
                    Manage billing
                  </Link>
                ) : (
                  <button type="button" className="ap-btn ap-btn--quiet" disabled>
                    Manage billing
                  </button>
                )}
              </div>
            </div>
          </section>

          <p className="ap-footer">Archer Design · Secure client workspace</p>
        </div>
      </div>
    </>
  );
}

export type { ReviewItem };
