import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, supabaseAdminConfigured: false }, { status: 500 });
  }

  const { data: settings, error } = await admin.from("app_settings").select("*").limit(1).maybeSingle();
  if (error) {
    return NextResponse.json({ ok: false, supabaseAdminConfigured: true, settingsError: true, error: error.message }, { status: 500 });
  }

  const s = (settings ?? {}) as Record<string, unknown>;
  return NextResponse.json({
    ok: true,
    supabaseAdminConfigured: true,
    settingsFound: Boolean(settings),
    mailingAddressConfigured: typeof s.mailing_address === "string" && s.mailing_address.trim().length > 0,
    publicAppUrlConfigured: Boolean(process.env.PUBLIC_APP_URL),
    testMode: s.test_mode === true,
    testEmailConfigured: typeof s.test_email === "string" && s.test_email.trim().length > 0,
    requireManualApproval: s.require_manual_approval !== false,
    dailySendLimit: typeof s.daily_send_limit === "number" ? s.daily_send_limit : null,
    targetDailySendLimit: typeof s.target_daily_send_limit === "number" ? s.target_daily_send_limit : null,
    optOutLineConfigured: typeof s.opt_out_line === "string" && s.opt_out_line.trim().length > 0,
    senderNameConfigured: typeof s.sender_name === "string" && s.sender_name.trim().length > 0,
    emailSignatureConfigured: typeof s.email_signature === "string" && s.email_signature.trim().length > 0,
  });
}
