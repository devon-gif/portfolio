import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sending";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await sendEmail({
      to: "hello@archerdesign.shop",
      subject: "Archer SMTP production test",
      text: "One-time production test of Vercel to IONOS SMTP. No prospect email was sent.",
    });
    console.log("SMTP_SELF_TEST_OK");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SMTP_SELF_TEST_FAILED", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
