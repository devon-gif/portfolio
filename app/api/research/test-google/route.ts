export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GoogleSearchItem {
  title?: string;
  link?: string;
  snippet?: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
  error?: { message?: string; code?: number; status?: string };
}

// GET /api/research/test-google
// Runs a test search and returns the top 5 results.
// Returns { ok: false, unavailable: true } specifically for 403 so the UI can
// distinguish "keys present but API not enabled" from a real error.
export async function GET() {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY?.trim();
  const cseId = process.env.GOOGLE_CSE_ID?.trim();

  if (!apiKey) return Response.json({ ok: false, error: "GOOGLE_SEARCH_API_KEY is not configured." }, { status: 400 });
  if (!cseId) return Response.json({ ok: false, error: "GOOGLE_CSE_ID is not configured." }, { status: 400 });

  const query = `site:linkedin.com/in "Director of Marketing" "hotel management"`;
  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", cseId);
  url.searchParams.set("q", query);
  url.searchParams.set("num", "5");

  let res: Response;
  try {
    res = await fetch(url.toString(), { headers: { "Accept": "application/json" } });
  } catch (e) {
    return Response.json({ ok: false, error: `Network error: ${e instanceof Error ? e.message : String(e)}` }, { status: 502 });
  }

  const data: GoogleSearchResponse = await res.json();

  if (!res.ok) {
    // 403 = API not enabled on this project — surface as "unavailable" so the UI
    // can show "Configured · unavailable" instead of a generic error.
    const unavailable = res.status === 403;
    const msg = data.error?.message ?? `HTTP ${res.status}`;
    return Response.json(
      { ok: false, unavailable, error: msg },
      { status: res.status },
    );
  }

  const results = (data.items ?? []).slice(0, 5).map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    snippet: item.snippet ?? "",
  }));

  return Response.json({ ok: true, query, results });
}
