import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { enrollContactsInSequence } from "@/lib/sequence-runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  let body: { contact_ids?: string[]; contact_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const contactIds = Array.isArray(body.contact_ids)
    ? body.contact_ids
    : body.contact_id
      ? [body.contact_id]
      : [];

  const admin = getAdminClient();
  const result = await enrollContactsInSequence(admin, contactIds);

  return Response.json(result, { status: result.ok ? 200 : 422 });
}
