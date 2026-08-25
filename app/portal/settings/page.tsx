import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { PortalShell } from "../components/PortalShell";

export const dynamic = "force-dynamic";

export default async function Page() {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect("/portal/login");
  if (ctx.role === "owner") redirect("/client-accounts");

  return (
    <PortalShell>
      <header>
        <h1 className="ap-h1">Settings</h1>
      </header>
      <div className="ap-card">
        <div className="ap-empty">
          <strong>Coming soon</strong>
          Your contact details, properties, and notification preferences.
        </div>
      </div>
    </PortalShell>
  );
}
