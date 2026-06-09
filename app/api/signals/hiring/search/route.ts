// POST /api/signals/hiring/search  { query: string, location?: string }
// Cheap hiring-signal discovery via Firecrawl's /v1/search (Google fallback).
// Returns metadata only (title/url/snippet). Does NOT scrape pages, send email,
// or run Hunter. If FIRECRAWL_API_KEY is missing, returns ok:false so the UI can
// fall back to manual job-URL entry.
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

export async function POST(req: Request) {
  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      {
        ok: false,
        error: "FIRECRAWL_API_KEY is not configured. Use manual job-URL entry below instead.",
        manualOnly: true,
      },
      { status: 200 },
    );
  }

  let body: { query?: string; location?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const query = (body.query ?? "").trim();
  const location = (body.location ?? "").trim();
  if (!query) {
    return Response.json({ ok: false, error: "A search query is required." }, { status: 400 });
  }

  const composed = location ? `${query} ${location}` : query;

  let res: Response;
  try {
    res = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // Metadata only — no scrapeOptions formats, so this stays cheap.
      body: JSON.stringify({ query: composed, limit: 10, scrapeOptions: { formats: [] } }),
    });
  } catch (e) {
    return Response.json(
      { ok: false, error: `Network error: ${e instanceof Error ? e.message : String(e)}` },
      { status: 502 },
    );
  }

  let data: FirecrawlSearchResponse;
  try {
    data = await res.json();
  } catch {
    return Response.json({ ok: false, error: `HTTP ${res.status}` }, { status: 502 });
  }

  if (!res.ok || !data.success) {
    return Response.json({ ok: false, error: data.error ?? `HTTP ${res.status}` }, { status: res.status || 502 });
  }

  const results = (data.data ?? [])
    .filter((item) => item.url)
    .slice(0, 10)
    .map((item) => {
      let platform = "";
      try {
        platform = new URL(item.url as string).hostname.replace(/^www\./, "");
      } catch {
        platform = "";
      }
      return {
        title: item.title ?? "",
        url: item.url ?? "",
        snippet: item.description ?? "",
        platform,
      };
    });

  return Response.json({ ok: true, query: composed, results });
}
