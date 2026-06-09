export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FirecrawlScrapeResult {
  success?: boolean;
  data?: {
    markdown?: string;
    content?: string;
    metadata?: {
      title?: string;
      sourceURL?: string;
      description?: string;
      [key: string]: unknown;
    };
  };
  error?: string;
}

// POST /api/research/test-firecrawl  { url: string }
// Scrapes a single URL and returns the title + first 1000 chars of text.
export async function POST(req: Request) {
  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();
  if (!apiKey) return Response.json({ ok: false, error: "FIRECRAWL_API_KEY is not configured." }, { status: 400 });

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const targetUrl = body.url?.trim();
  if (!targetUrl) return Response.json({ ok: false, error: "url is required." }, { status: 400 });

  // Validate it's a real URL
  try {
    new URL(targetUrl);
  } catch {
    return Response.json({ ok: false, error: "Invalid URL." }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 0,
      }),
    });
  } catch (e) {
    return Response.json({ ok: false, error: `Network error: ${e instanceof Error ? e.message : String(e)}` }, { status: 502 });
  }

  const data: FirecrawlScrapeResult = await res.json();

  if (!res.ok || !data.success) {
    return Response.json({ ok: false, error: data.error ?? `HTTP ${res.status}` }, { status: res.status });
  }

  const raw = data.data?.markdown ?? data.data?.content ?? "";
  const preview = raw.slice(0, 1000);

  return Response.json({
    ok: true,
    url: data.data?.metadata?.sourceURL ?? targetUrl,
    title: data.data?.metadata?.title ?? "",
    description: data.data?.metadata?.description ?? "",
    preview,
    total_chars: raw.length,
  });
}
