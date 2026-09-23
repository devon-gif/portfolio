// Private + cron entrypoint for the Archer Design Hotel AI SDR.
//
// Authorization:
// - Vercel Cron: Authorization: Bearer <CRON_SECRET>
// - Manual dashboard run: Supabase access token belonging to the single CRM owner
//
// This route only discovers/enriches/prepares DRAFTS. It never approves or sends.
import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { isOwnerEmail } from "@/lib/owner";
import { runAiSdr } from "@/lib/ai-sdr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function authorize(req: Request): Promise<{ ok: true; trigger: "manual" | "cron" } | { ok: false }> {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET?.trim();

  if (secret && auth === `Bearer ${secret}`) {
    return { ok: true, trigger: "cron" };
  }

  if (!auth.toLowerCase().startsWith("bearer ")) return { ok: false };
  const token = auth.slice(7).trim();
  if (!token) return { ok: false };

  const admin = getAdminClient();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user || !isOwnerEmail(data.user.email)) return { ok: false };
  return { ok: true, trigger: "manual" };
}

async function handler(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }

  const auth = await authorize(req);
  if (!auth.ok) return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const result = await runAiSdr(getAdminClient(), auth.trigger);
  return Response.json(result, { status: result.ok ? 200 : 500 });
}

export async function POST(req: Request) {
  return handler(req);
}

export async function GET(req: Request) {
  return handler(req);
}
