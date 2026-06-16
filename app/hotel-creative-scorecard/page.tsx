"use client";

import { useEffect, useMemo, useState } from "react";

type AuditResult = {
  score_total: number;
  score_band: string;
  confidence: "low" | "medium" | "high";
  summary: string;
  what_ai_saw: string[];
  strongest_gaps: string[];
  quick_wins: string[];
  recommended_next_step: string;
};

const loadingSteps = [
  "Scanning your website…",
  "Checking property-level creative signals…",
  "Looking for F&B, event, meeting, wedding, and local campaign opportunities…",
  "Reviewing visual polish and campaign clarity…",
  "Building your preliminary creative bandwidth score…",
];

export default function HotelCreativeScorecardPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  const canSubmit = useMemo(() => {
    return hasMounted && Boolean(name.trim() && email.trim() && website.trim());
  }, [hasMounted, name, email, website]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingIndex((current) =>
        current >= loadingSteps.length - 1 ? current : current + 1
      );
    }, 1100);

    return () => clearInterval(interval);
  }, [loading]);

  async function runAudit() {
    setError("");

    if (!canSubmit) {
      setError("Please add your name, work email, and website.");
      return;
    }

    setLoading(true);
    setLoadingIndex(0);
    setResult(null);

    const startedAt = Date.now();

    try {
      const response = await fetch("/api/website-audit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          company,
          role,
          website,
          source: "hotel_creative_scorecard",
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        const debugMessage = json.debug ? `\n\nDebug: ${json.debug}` : "";
        throw new Error((json.error || "The audit failed.") + debugMessage);
      }

      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, 3000 - elapsed);

      await new Promise((resolve) => setTimeout(resolve, wait));

      setResult(json.result);
      setCalendlyUrl(json.calendlyUrl || "");
    } catch (err: any) {
      console.error("[scorecard-page] AI audit failed", err);

      const fallbackResult: AuditResult = {
        score_total: 40,
        score_band: "Manual Review Recommended",
        confidence: "low",
        summary:
          "The public website scan could not be completed from the submitted URL. This often happens with hotel websites that block server-side scans, redirect through brand systems, or have DNS/security restrictions. A manual Creative Gap Review is the best next step.",
        what_ai_saw: [
          "The website could not be fully scanned from the server.",
          "The submitted property or hotel group still appears to need a public-facing creative review.",
          "This result is intentionally low-confidence and should be confirmed manually.",
        ],
        strongest_gaps: [
          "Public website scan could not verify visual consistency, event visibility, or campaign clarity.",
          "Manual review should check social creative, F&B/event promotions, meeting/wedding visibility, and local campaign support.",
          "Hotel brand or corporate website structure may be limiting property-level marketing visibility.",
        ],
        quick_wins: [
          "Review the property website manually for active offers, events, dining, meetings, weddings, and local area content.",
          "Check whether the property has clear social links and a current Google Business Profile.",
          "Compare the website, social pages, and recent promos for consistency.",
        ],
        recommended_next_step:
          "Request a manual 3-property Creative Gap Review so Archer Design can review the property pages, social channels, and campaign opportunities directly.",
      };

      const params = new URLSearchParams();
      if (name) params.set("name", name);
      if (email) params.set("email", email);
      if (company) params.set("company", company);
      if (website) params.set("website", website);

      setError("");
      setResult(fallbackResult);
      setCalendlyUrl(`/creative-gap-review?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080705] text-stone-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-300/80">
              Archer Design
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Hotel Creative Bandwidth Scorecard
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              Enter your hotel or company website and AI will give you a
              preliminary read on where property-level creative may be helping —
              or holding you back.
            </p>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-4 text-sm text-stone-300">
              <div className="rounded-2xl border border-amber-300/20 bg-white/[0.03] p-4">
                <strong className="block text-2xl text-white">30 sec</strong>
                public website read
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-white/[0.03] p-4">
                <strong className="block text-2xl text-white">AI</strong>
                does the first pass
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-300/20 bg-stone-950/80 p-6 shadow-2xl">
            {!loading && !result && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-stone-300">
                    Name
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-amber-300/60"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Devon Archer"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-stone-300">
                    Work email
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-amber-300/60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@hotel.com"
                    type="email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-stone-300">
                    Company or hotel name
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-amber-300/60"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Hotel Group / Property"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-stone-300">
                    Role optional
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-amber-300/60"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="GM, DOSM, Marketing, Owner"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-stone-300">
                    Hotel / company website
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-amber-300/60"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="hotelwebsite.com"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <button
                  onClick={runAudit}
                  className="w-full rounded-xl bg-amber-300 px-5 py-4 font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canSubmit}
                >
                  Run my AI creative audit
                </button>

                <p className="text-center text-xs text-stone-500">
                  You’ll see a preliminary score immediately. No duplicate form
                  after this.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <div className="mb-8 h-16 w-16 animate-spin rounded-full border-2 border-amber-300/20 border-t-amber-300" />
                <h2 className="text-2xl font-semibold text-white">
                  Running your AI creative audit
                </h2>
                <p className="mt-4 max-w-sm text-stone-300">
                  {loadingSteps[loadingIndex]}
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-amber-300/80">
                    Preliminary AI read
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">
                    {result.score_total}/100 — {result.score_band}
                  </h2>
                  <p className="mt-3 text-sm text-stone-400">
                    Confidence: {result.confidence}. This is based on the public
                    website only.
                  </p>
                </div>

                <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-stone-200">
                  {result.summary}
                </p>

                <div>
                  <h3 className="font-semibold text-white">Strongest gaps</h3>
                  <ul className="mt-3 space-y-2 text-sm text-stone-300">
                    {result.strongest_gaps?.map((gap) => (
                      <li key={gap} className="rounded-xl bg-white/[0.04] p-3">
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Quick wins</h3>
                  <ul className="mt-3 space-y-2 text-sm text-stone-300">
                    {result.quick_wins?.map((win) => (
                      <li key={win} className="rounded-xl bg-white/[0.04] p-3">
                        {win}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <h3 className="font-semibold text-amber-100">
                    Recommended next step
                  </h3>
                  <p className="mt-2 text-sm text-stone-200">
                    {result.recommended_next_step}
                  </p>
                </div>

                {calendlyUrl ? (
                  <a
                    href={calendlyUrl}
                    className="block rounded-xl bg-amber-300 px-5 py-4 text-center font-semibold text-stone-950 transition hover:bg-amber-200"
                  >
                    Book my free Creative Gap Review
                  </a>
                ) : (
                  <p className="rounded-xl border border-white/10 p-3 text-sm text-stone-400">
                    Calendly link is not configured yet.
                  </p>
                )}

                <button
                  onClick={() => {
                    setResult(null);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-white/10 px-5 py-3 text-sm text-stone-300 hover:bg-white/[0.04]"
                >
                  Run another audit
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
