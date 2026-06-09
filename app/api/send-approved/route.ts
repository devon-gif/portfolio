import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { sendMessageById } from "@/lib/send-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/send-approved  { message_id }
// Sends a single message — only if its status is 'approved'.
export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }
  let body: { message_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
  const messageId = body.message_id?.trim();
  if (!messageId) {
    return Response.json({ ok: false, error: "message_id is required." }, { status: 400 });
  }

  const admin = getAdminClient();
  const result = await sendMessageById(admin, messageId, { allowedStatuses: ["approved"] });
  return Response.json(result, { status: result.ok ? 200 : 422 });
}
