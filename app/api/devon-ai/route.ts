import { NextResponse } from "next/server";
import { appendFile } from "node:fs/promises";
import path from "node:path";
import { SYSTEM_PROMPT, answerFromKnowledge, referenceNotes } from "./knowledge";

/**
 * Devon AI: a recruiter-facing guide grounded in the portfolio.
 *
 * Knowledge, voice and guardrails come from knowledge.ts (built from the Devon AI
 * knowledge base). For each question the route retrieves the relevant knowledge
 * entries and the role-fit classification and hands them to the model with the
 * system prompt. Privacy, identity and prompt-injection questions are answered
 * from the approved wording directly, without calling the model. If the key is
 * missing or the model fails, it answers from the knowledge base alone, so
 * visitors never hit a dead end.
 *
 * Abuse protection for a public endpoint that spends API credit:
 *  - only same-origin browser requests are accepted
 *  - per-visitor rate limit plus a per-instance hourly ceiling
 *  - request size, message count and message length are capped
 *  - output tokens are capped and nothing is stored on OpenAI's side
 */

type ChatMessage = { role: "user" | "assistant"; content: string };
type Mode = "ai" | "portfolio";

const MAX_BODY_BYTES = 16_000;
const MAX_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 800;

// Per-visitor: 12 questions per 10 minutes. Per server instance: 300 per hour.
const VISITOR_LIMIT = 12;
const VISITOR_WINDOW_MS = 10 * 60_000;
const INSTANCE_LIMIT = 300;
const INSTANCE_WINDOW_MS = 60 * 60_000;

const visitors = new Map<string, number[]>();
let instanceHits: number[] = [];

function rateLimited(ip: string, now: number) {
  instanceHits = instanceHits.filter((t) => now - t < INSTANCE_WINDOW_MS);
  if (instanceHits.length >= INSTANCE_LIMIT) return true;

  const hits = (visitors.get(ip) ?? []).filter((t) => now - t < VISITOR_WINDOW_MS);
  if (hits.length >= VISITOR_LIMIT) {
    visitors.set(ip, hits);
    return true;
  }
  hits.push(now);
  visitors.set(ip, hits);
  instanceHits.push(now);

  // Keep the map from growing without bound on a long-lived instance.
  if (visitors.size > 5_000) {
    for (const [key, times] of visitors) {
      if (!times.some((t) => now - t < VISITOR_WINDOW_MS)) visitors.delete(key);
    }
  }
  return false;
}

function clientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "local").trim();
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function cleanMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") return false;
      const { role, content } = item as { role?: unknown; content?: unknown };
      return (role === "user" || role === "assistant") && typeof content === "string";
    })
    .slice(-MAX_MESSAGES)
    .map((item) => ({ role: item.role, content: item.content.slice(0, MAX_MESSAGE_CHARS) }));
}

type ResponsesPayload = {
  output_text?: unknown;
  output?: Array<{ content?: Array<{ type?: string; text?: unknown }> }>;
};

function extractText(payload: ResponsesPayload): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  for (const item of payload.output ?? []) {
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && typeof part.text === "string" && part.text.trim()) return part.text.trim();
    }
  }
  return "";
}

/** House style: no em dashes, even if the model slips one in. */
const tidy = (text: string) => text.replace(/\s*—\s*/g, ", ").replace(/\s*–\s*/g, " to ");

/**
 * During local development, keep a log of questions the knowledge base had no
 * entry for, so the knowledge can be improved before deployment. Never in production.
 */
async function logGap(question: string, mode: Mode) {
  if (process.env.NODE_ENV === "production") return;
  try {
    const line = JSON.stringify({ at: new Date().toISOString(), mode, question }) + "\n";
    await appendFile(path.join(process.cwd(), ".next", "devon-ai-unmatched.jsonl"), line);
  } catch {
    // Logging is best effort.
  }
}

async function askModel(messages: ChatMessage[], notes: string): Promise<string> {
  const apiKey = (process.env.OPENAI_API_KEY ?? "").trim();
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const model = process.env.DEVON_AI_MODEL || process.env.AI_AUDIT_MODEL || "gpt-5-nano";
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  // GPT-5 and o-series models spend output tokens on reasoning first; keep it minimal
  // so the token cap goes to the actual answer.
  const reasoning = /^(gpt-5|o\d)/.test(model) ? { reasoning: { effort: "minimal" } } : {};

  const call = (extra: object) =>
    fetch(`${base}/responses`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        instructions: notes ? `${SYSTEM_PROMPT}\n\n${notes}` : SYSTEM_PROMPT,
        input: messages.map((m) => ({ role: m.role, content: m.content })),
        max_output_tokens: 600,
        store: false,
        ...extra,
      }),
      signal: AbortSignal.timeout(25_000),
    });

  let response = await call(reasoning);
  // Some newer models name their lowest reasoning setting differently; retry once without it.
  if (response.status === 400 && "reasoning" in reasoning) response = await call({});

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${response.status}: ${detail.slice(0, 400)}`);
  }
  const text = extractText((await response.json()) as ResponsesPayload);
  if (!text) throw new Error("Model returned no text");
  return tidy(text);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Requests are only accepted from the portfolio." }, { status: 403 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "That message is too long." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }

  const messages = cleanMessages((body as { messages?: unknown })?.messages);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.content.trim()) {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }

  if (rateLimited(clientIp(request), Date.now())) {
    return NextResponse.json(
      { error: "That is a lot of questions in a short time. Give it a few minutes, or reach Devon directly through the contact section." },
      { status: 429 },
    );
  }

  const local = answerFromKnowledge(messages);
  const { notes, matched } = referenceNotes(messages);
  const headers = { "Cache-Control": "no-store" };

  // Privacy, identity and injection questions get the approved wording, not a model paraphrase.
  if (local.topic && /^(injection|identity|salary|authorization|availability|secrets|contracts|references|personal)$/.test(local.topic)) {
    const guardMode: Mode = (process.env.OPENAI_API_KEY ?? "").trim() ? "ai" : "portfolio";
    return NextResponse.json({ answer: local.answer, mode: guardMode }, { headers });
  }

  let answer: string;
  let mode: Mode = "ai";
  try {
    answer = await askModel(messages, notes);
  } catch (error) {
    // Missing key, quota, timeout or outage: answer from the knowledge base instead of failing.
    if ((process.env.OPENAI_API_KEY ?? "").trim()) console.error("Devon AI model error:", error);
    answer = local.answer;
    mode = "portfolio";
  }
  if (!matched && !local.topic) void logGap(lastUser.content, mode);

  return NextResponse.json({ answer, mode }, { headers });
}
