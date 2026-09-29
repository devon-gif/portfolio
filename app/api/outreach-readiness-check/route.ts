import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, supabaseAdminConfigured: false }, { status: 500 });
  }

  const { data: settings, error } = await admin.from("app_settings").select("mailing_address,test_mode,test_email,require_manual_approval,daily_send_limit,target_daily_send_limit,opt_out_line,sender_name,email_signature").limit(1).maybeSingle();
  if (error) {
    return NextResponse.json({ ok: false, supabaseAdminConfigured: true, settingsError: true }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    supabaseAdminConfigured: true,
    settingsFound: Boolean(settings),
    mailingAddressConfigured: Boolean(settings?.mailing_address?.trim()),
    publicAppUrlConfigured: Boolean(process.env.PUBLIC_APP_URL),
    testMode: settings?.test_mode === true,
    testEmailConfigured: Boolean(settings?.test_email?.trim()),
    requireManualApproval: settings?.require_manual_approval !== false,
    dailySendLimit: settings?.daily_send_limit ?? null,
    targetDailySendLimit: settings?.target_daily_send_limit ?? null,
    optOutLineConfigured: Boolean(settings?.opt_out_line?.trim()),
    senderNameConfigured: Boolean(settings?.sender_name?.trim()),
    emailSignatureConfigured: Boolean(settings?.email_signature?.trim()),
  });
}
