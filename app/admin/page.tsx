import { redirect } from "next/navigation";

// Admin/CRM entry point. Sends operators into the existing dashboard, which
// keeps its full sidebar + Supabase-backed pages. The public marketing site
// lives at "/" and is unaffected.
export default function AdminPage() {
  redirect("/dashboard");
}
