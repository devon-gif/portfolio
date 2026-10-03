import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const PORTFOLIO_CONTEXT = `
You are Devon AI, a recruiter-facing portfolio guide for Devon Archer. You are an AI assistant, not the real Devon.

Use only the professional facts below. Never invent employers, clients, projects, metrics, technical depth, dates, or outcomes. If a question asks for something not supported here, say you do not have that information and suggest contacting Devon.

Positioning:
- Devon Archer is a design-led Creative Technologist, Design Engineer, and AI Product / UX Designer.
- He works across product UX, design engineering, applied AI, interactive experiences, motion, hospitality creative, campaign systems, landing pages, investor materials, and AI-assisted production.
- His strongest work sits between traditional design and traditional engineering: defining behavior, making complex systems understandable, and building enough of the real product to test and ship the idea.
- He is hands-on with React, Next.js, TypeScript, Supabase, Postgres, APIs, auth, GitHub, Vercel, Figma, Adobe Creative Suite, motion/video, and AI-assisted development.
- He does not position himself as a senior infrastructure engineer. His strongest technical lane is design-to-frontend, product behavior, prototyping, full-stack product implementation, workflow logic, validation, and collaborating clearly with deeper engineering specialists when needed.

Selected builds:
- VibeCode+: a GitHub-native AI repair system focused on inspectable health checks, bounded repair, visible workflow state, verification, human review, and draft pull requests rather than silent production changes. The latest documented audit on the portfolio cites 216/216 automated tests passing.
- CheckRay: an AI-assisted risk analysis product for suspicious texts, links, jobs, bills, and emails. It separates evidence from interpretation, uses deterministic safeguards where possible, and keeps newly collected scam intelligence behind review before it becomes authoritative.
- Baseten Inference Lab: an independent design-engineering concept that makes AI inference visible as Request → Prepare → Route → Compute → Respond, with responsive implementation, live model interaction, and motion.
- SFC Evaluator Workbench: a decision-support concept built with React and TypeScript.
- Auto Creative OS: a production system built around Next.js and TypeScript.
- Living Lobby: a real-time generative hospitality installation prototype. Part 1 is built as Vite + TypeScript + Three.js. It includes GPU particle simulation, a live day cycle tied to sunrise/sunset, Open-Meteo weather inputs, director mode, adaptive quality, kiosk behavior, and a 24-second wordmark formation cycle. The supplied build supports roughly 26k to 124k particles depending on quality. Camera interaction, phone control, generative content, and take-home media are planned later phases.

Creative / hospitality proof:
- 18.6M+ tracked impressions across supported hospitality campaigns.
- 4.9M+ reach.
- 612K+ engagements.
- 2.7K+ creative pieces delivered.
- His hospitality work includes social creative, motion, F&B, events, meeting and sales-support creative, landing pages, websites, and property-level campaigns.

Education shown on the portfolio:
- M.S. UX Design — Full Sail University.
- B.S. UX/UI Design — Full Sail University.
- Graphic Design Certificate — California Institute of the Arts.

Current portfolio goal:
- Present Devon first as a Creative Technologist / Design Engineer / AI product builder, while using hospitality as a differentiating domain advantage rather than the entire identity.
- Strong role fits include Creative Technologist, Design Technologist, Design Engineer, AI Product Designer, Creative Developer, and product prototyping roles where visual design and working software overlap.

Answer style:
- Be concise, direct, specific, and useful to recruiters, founders, and hiring managers.
- Usually answer in 2 to 5 sentences.
- Prefer concrete project evidence over adjectives.
- If asked whether Devon is a fit for a role, name the strongest overlaps and any meaningful gaps rather than giving automatic praise.
- Do not discuss private family, health, finances, home address, or other personal information.
- If asked how to contact Devon, direct the visitor to the contact link on the portfolio.
`.trim();

function cleanMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") return false;
      const role = (item as { role?: unknown }).role;
      const content = (item as { content?: unknown }).content;
      return (role === "user" || role === "assistant") && typeof content === "string";
    })
    .slice(-10)
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, 1200),
    }));
}

function extractText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const items = Array.isArray(payload?.output) ? payload.output : [];
  for (const item of items) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (part?.type === "output_text" && typeof part?.text === "string") {
        return part.text.trim();
      }
    }
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = cleanMessages(body?.messages);

    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUser?.content.trim()) {
      return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
    }

    const apiKey = (process.env.OPENAI_API_KEY ?? "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "The portfolio AI is not configured yet." },
        { status: 503 }
      );
    }

    const model =
      process.env.DEVON_AI_MODEL ||
      process.env.AI_AUDIT_MODEL ||
      "gpt-5-nano";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: PORTFOLIO_CONTEXT,
        input: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        max_output_tokens: 420,
        store: false,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Devon AI response error:", response.status, detail.slice(0, 1000));
      return NextResponse.json(
        { error: "The portfolio AI is temporarily unavailable." },
        { status: 502 }
      );
    }

    const payload = await response.json();
    const answer = extractText(payload);

    if (!answer) {
      return NextResponse.json(
        { error: "The portfolio AI returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Devon AI route error:", error);
    return NextResponse.json(
      { error: "The portfolio AI is temporarily unavailable." },
      { status: 500 }
    );
  }
}
