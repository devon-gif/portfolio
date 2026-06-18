import { NextRequest, NextResponse } from "next/server";
import {
  scrapeWebsiteSignals,
  scoreAndDraftLead,
  type DiscoveredBusiness,
  type PromoCategory,
} from "@/lib/promo-leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/promo-leads/score
// Takes one discovered business, scrapes its public website (if it has one)
// via Firecrawl, extracts signals, and computes a fit score + draft outreach
// message. Does NOT save anything and does NOT send anything.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const business = body.business as DiscoveredBusiness | undefined;
    const category = String(body.category || "") as PromoCategory;

    if (!business || !business.business_name) {
      return NextResponse.json({ ok: false, error: "business is required." }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ ok: false, error: "category is required." }, { status: 400 });
    }

    const signals = business.website
      ? await scrapeWebsiteSignals(business.website)
      : {
          scraped: false,
          mentionsPromo: false,
          promoExcerpt: null,
          hasMenuOrServicesPage: false,
          hasSocialLinks: false,
          hasClearCta: false,
          weakMetaDescription: true,
          weakHeadline: true,
          oldCopyrightYear: null,
          outdatedLanguage: false,
          ownerOperatedSignal: false,
          chainSignal: false,
          agencyPolishSignal: false,
          pagesScraped: [],
        };

    const lead = scoreAndDraftLead({ business, category, signals });

    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    console.error("[promo-leads/score]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Scoring failed." },
      { status: 500 },
    );
  }
}
