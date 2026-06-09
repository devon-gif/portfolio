export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FirecrawlSearchResult {
  url?: string;
  title?: string;
  description?: string;
}

interface FirecrawlSearchResponse {
  success?: boolean;
  data?: FirecrawlSearchResult[];
  error?: string;
}

// GET /api/research/test-firecrawl-search
// Uses Firecrawl's /v1/search endpoint as a Google Search fallback.
// Returns top 5 results for a fixed test query about hotel marketing directors.
export async function GET() {
  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();
  if (!apiKey) {
    return Response.json({ ok: false, error: "FIRECRAWL_API_KEY is not configured." }, { status: 400 });
  }

  const query = "HVMG Director of Marketing hotel";

  let res: Response;
  try {
    res = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 5,
        // No scrapeOptions — we only want metadata, not full page markdown
        scrapeOptions: { formats: [] },
      }),
    });
  } catch (e) {
    return Response.json(
      { ok: false, error: `Network error: ${e instanceof Error ? e.message : String(e)}` },
      { status: 502 },
    );
  }

  const data: FirecrawlSearchResponse = await res.json();

  if (!res.ok || !data.success) {
    return Response.json(
      { ok: false, error: data.error ?? `HTTP ${res.status}` },
      { status: res.status },
    );
  }

  const results = (data.data ?? []).slice(0, 5).map((item) => ({
    title: item.title ?? "",
    url: item.url ?? "",
    snippet: item.description ?? "",
  }));

  return Response.json({ ok: true, query, results });
}
