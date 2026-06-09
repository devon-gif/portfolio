import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { sendTestMessageById } from "@/lib/send-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/send-test  { message_id, to? }
// Sends a TEST copy of the message to your own inbox without changing its status.
export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }
  let body: { message_id?: string; to?: string };
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
  const result = await sendTestMessageById(admin, messageId, body.to?.trim());
  return Response.json(result, { status: result.ok ? 200 : 422 });
}
