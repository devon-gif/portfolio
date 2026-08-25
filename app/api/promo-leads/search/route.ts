import { NextRequest, NextResponse } from "next/server";
import { searchBusinesses, type PromoCategory } from "@/lib/promo-leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/promo-leads/search
// Finds businesses via Google Places. Does NOT scrape websites, does NOT
// score, does NOT save anything — pure discovery step.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const state = String(body.state || "PA").trim() || "PA";
    const city = body.city ? String(body.city).trim() : undefined;
    const category = String(body.category || "").trim() as PromoCategory;
    const maxResults = body.maxResults ? Number(body.maxResults) : 25;
    const minRating = body.minRating !== undefined && body.minRating !== null && body.minRating !== "" ? Number(body.minRating) : undefined;
    const hasWebsite =
      body.hasWebsite === true || body.hasWebsite === "true" ? true : body.hasWebsite === false || body.hasWebsite === "false" ? false : undefined;

    if (!category) {
      return NextResponse.json({ ok: false, error: "category is required." }, { status: 400 });
    }

    const result = await searchBusinesses({ state, city, category, maxResults, minRating, hasWebsite });
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
    }

    return NextResponse.json({ ok: true, results: result.results });
  } catch (error) {
    console.error("[promo-leads/search]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Search failed." },
      { status: 500 },
    );
  }
}
