import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { advanceSequences } from "@/lib/sequence-runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: Request): { ok: boolean; reason?: string } {
  const secret = process.env.CRON_SECRET;
  if (!secret) return { ok: false, reason: "CRON_SECRET is not set — refusing to run sequence-advance." };

  const auth = req.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return { ok: true };

  const url = new URL(req.url);
  if (url.searchParams.get("key") === secret) return { ok: true };

  return { ok: false, reason: "Unauthorized." };
}

async function run(req: Request) {
  const auth = isAuthorized(req);
  if (!auth.ok) return Response.json({ ok: false, error: auth.reason }, { status: 401 });

  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }

  const admin = getAdminClient();
  const result = await advanceSequences(admin);
  return Response.json(result, { status: result.ok ? 200 : 500 });
}

export async function GET(req: Request) {
  return run(req);
}

export async function POST(req: Request) {
  return run(req);
}
