import { redirect } from "next/navigation";

// The Outreach Queue is consolidated into the Command Center (/daily).
// This route now redirects there so there's a single email-outreach workflow.
export default function OutreachRedirectPage() {
  redirect("/daily");
}
