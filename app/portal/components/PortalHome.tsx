import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { PortalData } from "@/lib/portal/types";
import { onboardingProgress, partyLabel } from "@/lib/portal/types";
import { QueueCard } from "./ReviewQueue";

function money(n: number | null) {
  return n == null ? "—" : `$${n.toLocaleString("en-US")}`;
}

/**
 * Client home.
 *
 * Creative leads; billing is a small footnote at the bottom. The old dashboard
 * opened with plan and fee, which made the portal feel like an invoice — the
 * reason a client signs in is to see what needs their attention.
 */
export function PortalHome({ data, hrefBase }: { data: PortalData; hrefBase: string }) {
  const visible = data.items.filter((i) => i.status !== "archived");
  const needsReview = visible.filter((i) => i.status === "ready_for_review");
  const captionsWaiting = visible.flatMap((i) => i.captions.filter((c) => c.status === "ready_for_review"));
  const inProgress = visible.filter(
    (i) => i.status === "draft" || i.status === "changes_requested" || i.status === "new_direction_requested"
  );
  const recent = [...visible]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  const progress = onboardingProgress(data.tasks);
  const onboardingIncomplete = data.tasks.length > 0 && progress < 100;

  const attention: string[] = [];
  if (needsReview.length) {
    attention.push(`${needsReview.length} creative ${needsReview.length === 1 ? "piece is" : "pieces are"} ready for review`);
  }
  if (captionsWaiting.length) {
    attention.push(`${captionsWaiting.length} caption${captionsWaiting.length === 1 ? "" : "s"} awaiting approval`);
  }

  const org = data.organizationName;

  return (
    <>
      {data.source === "demo" && (
        <div className="ap-notice" role="status">
          <span className="ap-pill ap-pill--gold">Demo data</span>
          <span>
            A preview of the client experience using a fictional account. Nothing here is real client data, and no
            billing or subscription exists for it.
          </span>
        </div>
      )}

      <header>
        <h1 className="ap-h1">Hi {data.viewerFirstName}</h1>
        <p className="ap-muted" style={{ marginTop: 8 }}>
          {org} · {data.properties.length} {data.properties.length === 1 ? "property" : "properties"}
        </p>
      </header>

      {/* Needs your attention — the primary card */}
      <section className="ap-card ap-card--accent">
        <span className="ap-eyebrow">Needs your attention</span>
        {attention.length === 0 ? (
          <>
            <h2 className="ap-h2" style={{ marginTop: 10 }}>You&apos;re all caught up</h2>
            <p className="ap-muted" style={{ marginTop: 8 }}>
              {inProgress.length > 0
                ? `Archer is working on ${inProgress.length} ${inProgress.length === 1 ? "piece" : "pieces"}. We'll let you know when they're ready.`
                : "Nothing is waiting on you right now."}
            </p>
          </>
        ) : (
          <>
            <h2 className="ap-h2" style={{ marginTop: 10 }}>
              {attention.join(" · ")}
            </h2>
            <Link href={hrefBase} className="ap-btn ap-btn--primary" style={{ marginTop: 16 }}>
              Go to Creative Review <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </>
        )}
      </section>

      {/* Recent creative */}
      {recent.length > 0 && (
        <section>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <h2 className="ap-h2">Recent creative</h2>
            <Link href={hrefBase} className="ap-muted" style={{ textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div className="ap-queue" style={{ marginTop: 14 }}>
            {recent.map((item) => (
              <QueueCard key={item.id} item={item} hrefBase={hrefBase} />
            ))}
          </div>
        </section>
      )}

      <div className="ap-row ap-row--2">
        {/* Workflow */}
        <section className="ap-card">
          <span className="ap-eyebrow">Your workflow</span>
          <p className="ap-muted" style={{ margin: "8px 0 16px" }}>
            How creative gets from an idea to published, and who does what.
          </p>
          <div className="ap-flow">
            <div className={`ap-flow-step${data.responsibility.creative === "client" ? " ap-flow-step--client" : ""}`}>
              <span className="ap-flow-who">{partyLabel(data.responsibility.creative, org)}</span>
              <span>Creates the creative</span>
            </div>
            <div className={`ap-flow-step${data.responsibility.copy === "client" ? " ap-flow-step--client" : ""}`}>
              <span className="ap-flow-who">{partyLabel(data.responsibility.copy, org)}</span>
              <span>Writes the social copy</span>
            </div>
            <div className="ap-flow-step ap-flow-step--client">
              <span className="ap-flow-who">Your team</span>
              <span>Reviews and approves</span>
            </div>
            <div className={`ap-flow-step${data.responsibility.publishing === "client" ? " ap-flow-step--client" : ""}`}>
              <span className="ap-flow-who">{partyLabel(data.responsibility.publishing, org)}</span>
              <span>Publishes approved content</span>
            </div>
          </div>
        </section>

        {/* This month */}
        <section className="ap-card">
          <span className="ap-eyebrow">This month</span>
          <div className="ap-row ap-row--3" style={{ marginTop: 14 }}>
            <div>
              <div className="ap-figure">{visible.length}</div>
              <span className="ap-label">Pieces in flight</span>
            </div>
            <div>
              <div className="ap-figure">{visible.filter((i) => i.status === "approved").length}</div>
              <span className="ap-label">Approved</span>
            </div>
            <div>
              <div className="ap-figure">{inProgress.length}</div>
              <span className="ap-label">In progress</span>
            </div>
          </div>
          {inProgress.length > 0 && (
            <ul className="ap-check" style={{ marginTop: 18 }}>
              {inProgress.slice(0, 4).map((i) => (
                <li key={i.id}>
                  <span className="ap-dot" />
                  <span>
                    {i.title}
                    <span style={{ display: "block", fontSize: 11.5, color: "var(--ap-text-3)" }}>{i.propertyName}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Onboarding — only when incomplete */}
      {onboardingIncomplete && (
        <section className="ap-card">
          <span className="ap-eyebrow">Getting set up</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "10px 0 12px" }}>
            <span className="ap-figure">{progress}%</span>
            <span className="ap-muted">complete</span>
          </div>
          <div className="ap-track" role="img" aria-label={`Onboarding ${progress} percent complete`}>
            <div className="ap-track-fill" style={{ width: `${progress}%` }} />
          </div>
          <ul className="ap-check" style={{ marginTop: 16 }}>
            {data.tasks.map((t) => (
              <li key={t.id} className={t.status === "done" ? "is-done" : ""}>
                <span className={`ap-dot${t.status === "done" ? " ap-dot--done" : ""}`}>
                  {t.status === "done" && <Check size={10} strokeWidth={3} aria-hidden="true" />}
                </span>
                <span>{t.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Plan — deliberately last and small */}
      <section className="ap-card ap-card--tight">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            <div>
              <span className="ap-label">Plan</span>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{data.account.packageName ?? "Creative partnership"}</div>
            </div>
            <div>
              <span className="ap-label">Monthly</span>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{money(data.account.monthlyFee)}</div>
            </div>
            <div>
              <span className="ap-label">Properties</span>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{data.account.propertyCount ?? "—"}</div>
            </div>
          </div>
          <Link href="/portal/billing" className="ap-btn ap-btn--quiet ap-btn--sm">
            Plan &amp; billing
          </Link>
        </div>
      </section>
    </>
  );
}
