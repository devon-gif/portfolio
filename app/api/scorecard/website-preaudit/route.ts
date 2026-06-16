// Website pre-audit — FUTURE-READY PLACEHOLDER. Intentionally disabled.
//
// Planned behavior (do NOT build until a safe AI provider is configured):
//   1. Accept a website URL (and optional submission_id).
//   2. Fetch the public homepage only (respect robots, timeouts, size limits).
//   3. Inspect visible content for hospitality signals: F&B/restaurant, events,
//      meetings, weddings, spa/wellness, local/seasonal campaigns, photo quality,
//      short-form motion, Google Business Profile / local SEO presence.
//   4. Generate preliminary, clearly-labeled creative-gap OBSERVATIONS only.
//   5. NEVER claim anything about a team's internal bandwidth or process without
//      explicit user confirmation — observations are about public output only.
//
// No external/AI calls are made here yet to avoid cost and unsafe claims.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    { ok: false, enabled: false, message: "AI website pre-audit coming soon." },
    { status: 200 },
  );
}

export async function GET() {
  return Response.json({ ok: false, enabled: false, message: "AI website pre-audit coming soon." });
}
