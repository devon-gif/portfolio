import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function processUnsubscribe(token: string): Promise<"ok" | "notfound" | "error"> {
  if (!isAdminConfigured) return "error";
  const admin = getAdminClient();

  const { data: message, error } = await admin
    .from("messages")
    .select("id, contact_id")
    .eq("unsubscribe_token", token)
    .maybeSingle();
  if (error) return "error";
  if (!message?.contact_id) return "notfound";

  const { data: contact } = await admin
    .from("contacts")
    .select("id, email, company_id")
    .eq("id", message.contact_id)
    .single();

  await admin
    .from("contacts")
    .update({ email_opt_out: true, status: "unsubscribed" })
    .eq("id", message.contact_id);

  if (contact?.email) {
    // suppression_list.email is not unique — insert only if not already present.
    const { data: existing } = await admin
      .from("suppression_list")
      .select("id")
      .ilike("email", contact.email)
      .limit(1);
    if (!existing || existing.length === 0) {
      const domain = contact.email.includes("@") ? contact.email.split("@")[1] : null;
      let companyName: string | null = null;
      if (contact.company_id) {
        const { data: co } = await admin.from("companies").select("name").eq("id", contact.company_id).single();
        companyName = co?.name ?? null;
      }
      await admin
        .from("suppression_list")
        .insert({ email: contact.email, domain, company_name: companyName, reason: "Unsubscribed via email link" });
    }
  }

  // Stop any active drip enrollment.
  await admin
    .from("enrollments")
    .update({ status: "stopped", stopped_reason: "unsubscribed" })
    .eq("contact_id", message.contact_id)
    .eq("status", "active");

  return "ok";
}

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await processUnsubscribe(token);

  const heading =
    result === "ok" || result === "notfound" ? "You're unsubscribed" : "Something went wrong";
  const body =
    result === "error"
      ? "We couldn't process your request right now. Please reply to the email with the word UNSUBSCRIBE and we'll remove you manually."
      : "You've been removed from this mailing list and won't receive further emails. If this was a mistake, simply reply to any previous email.";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-10 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-2xl">
          ✓
        </div>
        <h1 className="text-xl font-semibold text-zinc-100">{heading}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{body}</p>
      </div>
    </div>
  );
}
