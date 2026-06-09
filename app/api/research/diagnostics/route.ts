export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/research/diagnostics
// Returns only booleans — never exposes actual key values to the browser.
export async function GET() {
  return Response.json({
    firecrawl: !!process.env.FIRECRAWL_API_KEY?.trim(),
    google_search_api_key: !!process.env.GOOGLE_SEARCH_API_KEY?.trim(),
    google_cse_id: !!process.env.GOOGLE_CSE_ID?.trim(),
    hunter: !!process.env.HUNTER_API_KEY?.trim(),
    apollo: !!process.env.APOLLO_API_KEY?.trim(),
  });
}
