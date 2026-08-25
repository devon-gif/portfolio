import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { loadPortalData } from "@/lib/portal/data";
import { PortalShell } from "../components/PortalShell";
import { NotProvisioned } from "../components/NotProvisioned";

export const dynamic = "force-dynamic";

function money(n: number | null) {
  return n == null ? "—" : `$${n.toLocaleString("en-US")}`;
}

function label(s: string | null) {
  if (!s) return "—";
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function BillingPage() {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect("/portal/login");
  if (ctx.role === "owner") redirect("/client-accounts");

  const data = await loadPortalData(ctx);
  if (!data) return <NotProvisioned />;

  return (
    <PortalShell reviewCount={data.items.filter((i) => i.status === "ready_for_review").length}>
      <header>
        <h1 className="ap-h1">Plan &amp; billing</h1>
      </header>

      <section className="ap-card">
        <span className="ap-eyebrow">Your plan</span>
        <h2 className="ap-h2" style={{ marginTop: 10 }}>{data.account.packageName ?? "Creative partnership"}</h2>
        <div className="ap-row ap-row--3" style={{ marginTop: 20 }}>
          <div>
            <div className="ap-figure">{money(data.account.monthlyFee)}</div>
            <span className="ap-label">Per month</span>
          </div>
          <div>
            <div className="ap-figure">{data.account.propertyCount ?? "—"}</div>
            <span className="ap-label">{data.account.propertyCount === 1 ? "Property" : "Properties"}</span>
          </div>
          <div>
            <div className="ap-figure" style={{ fontSize: 17, paddingTop: 7 }}>{label(data.account.billingStatus)}</div>
            <span className="ap-label">Status</span>
          </div>
        </div>
      </section>

      <section className="ap-card">
        <span className="ap-eyebrow">Manage billing</span>
        <p className="ap-muted" style={{ margin: "10px 0 16px" }}>
          {data.account.hasBillingPortal
            ? "Update your payment method, view invoices, or change billing details in Stripe's secure portal."
            : "Billing is handled directly with Archer Design. Reach out any time and we'll send an invoice or a payment link."}
        </p>
        {/*
          Intentionally NOT wired to /api/stripe/portal-link: that route is
          owner-only and takes a caller-supplied record_id. A client-facing
          billing link needs its own endpoint that derives the customer from the
          caller's membership and accepts no id at all.
        */}
        <button type="button" className="ap-btn ap-btn--quiet" disabled>
          Manage billing
        </button>
        {data.account.hasBillingPortal && (
          <p className="ap-muted" style={{ fontSize: 12, marginTop: 10 }}>
            Self-serve billing is being connected. In the meantime, email Devon and he&apos;ll send your portal link.
          </p>
        )}
      </section>
    </PortalShell>
  );
}
