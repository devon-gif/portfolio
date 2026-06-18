import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import type { ScoredLead } from "@/lib/promo-leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/promo-leads/save
// Upserts a scored lead into Supabase using the service-role key. Dedupes on
// place_id when present. This route never sends outreach — it only persists
// a record for manual review in /admin/promo-leads.
export async function POST(req: NextRequest) {
  try {
    if (!isAdminConfigured) {
      return NextResponse.json(
        { ok: false, error: "Supabase admin client is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." },
        { status: 503 },
      );
    }

    const body = await req.json();
    const lead = body.lead as Partial<ScoredLead> & { id?: string };

    if (!lead || !lead.business_name) {
      return NextResponse.json({ ok: false, error: "lead.business_name is required." }, { status: 400 });
    }

    const admin = getAdminClient();
    const payload = {
      place_id: lead.place_id ?? null,
      business_name: lead.business_name,
      category: lead.category ?? null,
      city: lead.city ?? null,
      state: lead.state ?? null,
      address: lead.address ?? null,
      phone: lead.phone ?? null,
      website: lead.website ?? null,
      google_maps_url: lead.google_maps_url ?? null,
      source_url: lead.source_url ?? null,
      rating: lead.rating ?? null,
      review_count: lead.review_count ?? null,
      fit_score: lead.fit_score ?? null,
      fit_reason: lead.fit_reason ?? null,
      visible_promo_signal: lead.visible_promo_signal ?? null,
      website_issue_summary: lead.website_issue_summary ?? null,
      suggested_angle: lead.suggested_angle ?? null,
      suggested_message: lead.suggested_message ?? null,
      signals_json: lead.signals_json ?? null,
      status: lead.status ?? "new",
      updated_at: new Date().toISOString(),
    };

    if (lead.id) {
      const { data, error } = await admin.from("promo_leads").update(payload).eq("id", lead.id).select().single();
      if (error) throw error;
      return NextResponse.json({ ok: true, lead: data });
    }

    if (lead.place_id) {
      const { data, error } = await admin
        .from("promo_leads")
        .upsert({ ...payload, place_id: lead.place_id }, { onConflict: "place_id" })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ ok: true, lead: data });
    }

    const { data, error } = await admin.from("promo_leads").insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json({ ok: true, lead: data });
  } catch (error) {
    console.error("[promo-leads/save]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Save failed." },
      { status: 500 },
    );
  }
}

// GET /api/promo-leads/save — lists saved leads (newest/highest score first).
// Kept on this route to avoid adding a route not in the original spec.
export async function GET() {
  try {
    if (!isAdminConfigured) {
      return NextResponse.json({ ok: true, leads: [] });
    }
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("promo_leads")
      .select("*")
      .order("fit_score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json({ ok: true, leads: data ?? [] });
  } catch (error) {
    console.error("[promo-leads/save:list]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "List failed." },
      { status: 500 },
    );
  }
}
