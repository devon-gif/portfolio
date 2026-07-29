"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Allura, Fraunces } from "next/font/google";
import {
  BadgeCheck,
  Camera,
  CalendarDays,
  CheckCircle2,
  LayoutGrid,
  MapPin,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { SeedanceBackground } from "@/components/marketing/SeedanceBackground";
import { GOLD_GRADIENT } from "@/components/marketing/media";

const fraunces = Fraunces({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const allura = Allura({
  variable: "--font-wordmark-script",
  subsets: ["latin"],
  weight: ["400"],
});

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

const TRUST_BULLETS = [
  "30-second public website read",
  "AI first pass + human-backed strategy",
  "No duplicate intake form after completion",
];

const PROOF_STATS = [
  { value: "18.6M+", label: "Impressions" },
  { value: "612K+", label: "Engagements" },
  { value: "4.9M+", label: "Reach" },
  { value: "670K+", label: "Reported post clicks" },
];

const SCORECARD_CHECKS = [
  {
    icon: LayoutGrid,
    title: "Visual consistency",
    body: "Whether the brand look stays consistent across the website, social, and recent campaigns.",
  },
  {
    icon: Megaphone,
    title: "Offer and promo visibility",
    body: "Whether current packages, promotions, and seasonal offers are easy to find and act on.",
  },
  {
    icon: CalendarDays,
    title: "Event / F&B campaign clarity",
    body: "Whether events, dining, weddings, and meetings are promoted with clear, polished creative.",
  },
  {
    icon: MapPin,
    title: "Local SEO / Google Business Profile signals",
    body: "Whether the Google Business Profile is current, active, and supporting local discovery.",
  },
  {
    icon: Camera,
    title: "Photo and creative quality",
    body: "Whether existing photography and graphics feel premium and on-brand for the property.",
  },
  {
    icon: Sparkles,
    title: "Property-level content cadence",
    body: "Whether new creative is going out consistently enough to stay visible month to month.",
  },
];

const PROOF_CARDS = [
  {
    name: "Hotel Indigo Pittsburgh",
    line: "Creative support for hotel promos, events, and local campaigns.",
    stats: "3.26M+ page impressions • 131K+ page engagements • 87K+ post engagements • 72K+ reported post clicks",
    tags: ["Events", "Dining", "Social Creative", "Promo Campaigns"],
  },
  {
    name: "Eliza PGH",
    line: "Campaign creative built around restaurant promotions, events, and seasonal content.",
    stats: "5.88M+ page impressions • 392K+ page engagements • 608K+ post engagements • 496K+ reported post clicks",
    tags: ["Restaurant Promos", "Seasonal Campaigns", "Dining", "Events"],
  },
  {
    name: "Elements Salon & Wellness",
    line: "Service-based campaign support for salon and wellness promotions.",
    stats: "3.26M+ page impressions • 131K+ page engagements • 87K+ post engagements • 72K+ reported post clicks",
    tags: ["Wellness", "Service Promos", "Social Creative", "Local Campaigns"],
  },
];

const ABOUT_BULLETS = [
  "18.6M+ impressions tracked",
  "612K+ engagements",
  "2,700+ creative pieces / posts tracked",
  "Hospitality-focused creative support",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter your hotel or company website",
    body: "Just the URL. No long intake form to fill out first.",
  },
  {
    step: "02",
    title: "AI gives a quick first-pass read",
    body: "A 30-second scan checks visual consistency, promo visibility, and local signals.",
  },
  {
    step: "03",
    title: "Get your preliminary score plus recommended next steps",
    body: "See the score, the strongest gaps, quick wins, and a clear recommended next step.",
  },
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
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury relative min-h-screen text-[#F6F1E7] font-[family-name:var(--font-geist-sans)]`}
    >
      <SeedanceBackground />

      {/* Minimal header — logo only, no internal nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black shadow-[0_0_18px_rgba(201,164,76,0.16)]">
            <Image
              src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
              alt="Archer Design logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="wordmark-font text-[0.82rem]">
            <span className="text-[#F6F1E7]">Archer</span>
            <span className="text-[#C9A44C]">Design</span>
          </div>
        </a>
        <a
          href="/"
          className="text-[13px] text-[#A9A092] transition hover:text-[#F6F1E7]"
        >
          ← Back to home
        </a>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="px-6 pb-16 pt-4 md:pt-8">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            {/* Left: positioning */}
            <div>
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[rgba(201,164,76,0.4)] shadow-[0_0_20px_rgba(201,164,76,0.22)]">
                  <Image
                    src="/1780601845089.png"
                    alt="Devon Archer"
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                  Reviewed by Devon Archer
                </span>
              </div>

              <h1 className="mt-6 max-w-xl font-serif text-[clamp(32px,4.6vw,52px)] font-semibold leading-[1.08] text-[#F6F1E7]">
                See whether your hotel creative is{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: GOLD_GRADIENT }}
                >
                  helping bookings or holding them back.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-[#A9A092]">
                Enter your hotel or company website and get a fast AI-assisted first read on
                your property-level creative, promo visibility, campaign clarity, and content
                consistency.
              </p>

              <div className="mt-8 max-w-md space-y-3">
                {TRUST_BULLETS.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[14px] text-[#D8CFBE]">
                    <CheckCircle2 className="mt-[1px] h-4 w-4 shrink-0 text-[#C9A44C]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card */}
            <div className="glass-card-strong rounded-3xl p-7 ring-1 ring-[rgba(201,164,76,0.28)] md:p-9">
              {!loading && !result && (
                <div className="space-y-4">
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C9A44C]">
                      Preliminary scorecard
                    </span>
                    <h2 className="mt-2 font-serif text-[22px] font-semibold leading-tight text-[#F6F1E7]">
                      Get my preliminary score
                    </h2>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] text-[#A9A092]">Name</label>
                    <input
                      className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[rgba(5,5,5,0.4)] px-4 py-3 text-[#F6F1E7] placeholder-[#6b6358] outline-none transition focus:border-[#C9A44C]"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Devon Archer"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] text-[#A9A092]">Work email</label>
                    <input
                      className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[rgba(5,5,5,0.4)] px-4 py-3 text-[#F6F1E7] placeholder-[#6b6358] outline-none transition focus:border-[#C9A44C]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@hotel.com"
                      type="email"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] text-[#A9A092]">
                      Company or hotel name
                    </label>
                    <input
                      className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[rgba(5,5,5,0.4)] px-4 py-3 text-[#F6F1E7] placeholder-[#6b6358] outline-none transition focus:border-[#C9A44C]"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Hotel Group / Property"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] text-[#A9A092]">
                      Role <span className="text-[#6b6358]">optional</span>
                    </label>
                    <input
                      className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[rgba(5,5,5,0.4)] px-4 py-3 text-[#F6F1E7] placeholder-[#6b6358] outline-none transition focus:border-[#C9A44C]"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="GM, DOSM, Marketing, Owner"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] text-[#A9A092]">
                      Hotel / company website
                    </label>
                    <input
                      className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[rgba(5,5,5,0.4)] px-4 py-3 text-[#F6F1E7] placeholder-[#6b6358] outline-none transition focus:border-[#C9A44C]"
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
                    className="w-full rounded-xl px-5 py-4 text-[15px] font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    style={{ background: GOLD_GRADIENT }}
                    disabled={!canSubmit}
                  >
                    Get my preliminary score
                  </button>

                  <p className="text-center text-[12px] text-[#A9A092]">
                    You&apos;ll see your preliminary score immediately, with no duplicate form
                    afterward.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <div className="mb-8 h-16 w-16 animate-spin rounded-full border-2 border-[rgba(201,164,76,0.2)] border-t-[#C9A44C]" />
                  <h2 className="font-serif text-2xl font-semibold text-[#F6F1E7]">
                    Running your AI creative audit
                  </h2>
                  <p className="mt-4 max-w-sm text-[#A9A092]">{loadingSteps[loadingIndex]}</p>
                </div>
              )}

              {!loading && result && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A44C]">
                      Preliminary AI read
                    </p>
                    <h2 className="mt-2 font-serif text-3xl font-semibold text-[#F6F1E7]">
                      <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: GOLD_GRADIENT }}
                      >
                        {result.score_total}/100
                      </span>{" "}
                      — {result.score_band}
                    </h2>
                    <p className="mt-3 text-sm text-[#A9A092]">
                      Confidence: {result.confidence}. This is based on the public website only.
                    </p>
                  </div>

                  <p className="rounded-2xl border border-[rgba(201,164,76,0.16)] bg-[rgba(201,164,76,0.04)] p-4 text-[#D8CFBE]">
                    {result.summary}
                  </p>

                  <div>
                    <h3 className="font-serif font-semibold text-[#F6F1E7]">Strongest gaps</h3>
                    <ul className="mt-3 space-y-2 text-sm text-[#D8CFBE]">
                      {result.strongest_gaps?.map((gap) => (
                        <li
                          key={gap}
                          className="flex items-start gap-3 rounded-xl border border-[rgba(201,164,76,0.12)] bg-[rgba(5,5,5,0.3)] p-3"
                        >
                          <span className="mt-[5px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-serif font-semibold text-[#F6F1E7]">Quick wins</h3>
                    <ul className="mt-3 space-y-2 text-sm text-[#D8CFBE]">
                      {result.quick_wins?.map((win) => (
                        <li
                          key={win}
                          className="flex items-start gap-3 rounded-xl border border-[rgba(201,164,76,0.12)] bg-[rgba(5,5,5,0.3)] p-3"
                        >
                          <span className="mt-[5px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                          {win}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-[rgba(201,164,76,0.3)] bg-[rgba(201,164,76,0.08)] p-4">
                    <h3 className="font-serif font-semibold text-[#E8D7A2]">
                      Recommended next step
                    </h3>
                    <p className="mt-2 text-sm text-[#D8CFBE]">{result.recommended_next_step}</p>
                  </div>

                  {calendlyUrl ? (
                    <a
                      href={calendlyUrl}
                      className="block rounded-xl px-5 py-4 text-center text-[15px] font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                      style={{ background: GOLD_GRADIENT }}
                    >
                      Book my free Creative Gap Review
                    </a>
                  ) : (
                    <p className="rounded-xl border border-[rgba(201,164,76,0.14)] p-3 text-sm text-[#A9A092]">
                      Calendly link is not configured yet.
                    </p>
                  )}

                  <button
                    onClick={() => {
                      setResult(null);
                      setError("");
                    }}
                    className="w-full rounded-xl border border-[rgba(201,164,76,0.2)] px-5 py-3 text-sm text-[#A9A092] transition hover:border-[#C9A44C] hover:text-[#F6F1E7]"
                  >
                    Run another audit
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Proof strip */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card rounded-2xl px-6 py-8">
              <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                {PROOF_STATS.map((s) => (
                  <div key={s.label}>
                    <div
                      className="font-serif text-[clamp(24px,3.2vw,34px)] font-semibold leading-none bg-clip-text text-transparent"
                      style={{ backgroundImage: GOLD_GRADIENT }}
                    >
                      {s.value}
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#A9A092]">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-[12px] text-[#A9A092]">
                Campaign proof across tracked hospitality accounts.
              </p>
            </div>
          </div>
        </section>

        {/* What this scorecard checks */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                What this scorecard checks
              </span>
              <h2 className="mt-3 font-serif text-[clamp(24px,3.4vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                Six signals that show whether your creative is working.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SCORECARD_CHECKS.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.title}
                    className="glass-card flex flex-col gap-3 rounded-2xl border border-[rgba(201,164,76,0.16)] p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(201,164,76,0.3)] bg-[rgba(201,164,76,0.08)]">
                      <Icon className="h-5 w-5 text-[#C9A44C]" />
                    </div>
                    <h3 className="font-serif text-[16px] font-semibold text-[#F6F1E7]">
                      {c.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-[#A9A092]">{c.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trusted proof from hospitality campaigns */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Campaign spotlight
              </span>
              <h2 className="mt-3 font-serif text-[clamp(24px,3.4vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                Trusted proof from hospitality campaigns.
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#A9A092]">
                Verified campaign data, not invented quotes. These reflect impressions,
                engagement, and reported post clicks across tracked accounts.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {PROOF_CARDS.map((c) => (
                <div
                  key={c.name}
                  className="glass-card flex flex-col gap-4 rounded-2xl border border-[rgba(201,164,76,0.16)] p-6"
                >
                  <div className="flex items-center gap-2 text-[#C9A44C]">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                      Campaign spotlight
                    </span>
                  </div>
                  <h3 className="font-serif text-[17px] font-semibold leading-snug text-[#F6F1E7]">
                    {c.name}
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-[#A9A092]">{c.line}</p>
                  <p className="border-t border-[rgba(201,164,76,0.14)] pt-3 text-[12.5px] leading-relaxed text-[#D8CFBE]">
                    {c.stats}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[rgba(201,164,76,0.24)] px-3 py-1 text-[10.5px] text-[#E8D7A2]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-center text-[12px] text-[#A9A092]/60">
              Numbers reflect impressions, reach, engagement, and reported post clicks across
              tracked accounts. Direct booking attribution depends on each property&apos;s own
              tracking setup and is not claimed above.
            </p>
          </div>
        </section>

        {/* About Devon */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card-strong grid gap-8 rounded-3xl p-8 ring-1 ring-[rgba(201,164,76,0.2)] md:grid-cols-[auto_1fr] md:items-start md:p-12">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[rgba(201,164,76,0.4)] shadow-[0_0_24px_rgba(201,164,76,0.22)] md:h-24 md:w-24">
                <Image
                  src="/1780601845089.png"
                  alt="Devon Archer, Founder of Archer Design"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                  About Devon
                </span>
                <h2 className="mt-3 font-serif text-[clamp(22px,2.8vw,30px)] font-semibold leading-tight text-[#F6F1E7]">
                  Devon Archer, Founder of Archer Design
                </h2>
                <p className="mt-4 text-[14.5px] leading-relaxed text-[#A9A092]">
                  Hospitality creative support for hotels, restaurants, spas, and wellness
                  brands. Archer Design helps hospitality teams turn promotions, events, offers,
                  and service highlights into polished monthly creative that drives more
                  attention, inquiries, and repeat visibility without adding a full-time hire.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ABOUT_BULLETS.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-[rgba(201,164,76,0.16)] bg-[rgba(201,164,76,0.04)] px-3 py-2.5 text-center text-[12px] text-[#D8CFBE]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                How it works
              </span>
              <h2 className="mt-3 font-serif text-[clamp(24px,3.4vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                Three steps. One score.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {HOW_IT_WORKS.map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-[rgba(201,164,76,0.16)] bg-[rgba(201,164,76,0.04)] p-6"
                >
                  <span
                    className="font-serif text-[28px] font-semibold bg-clip-text text-transparent"
                    style={{ backgroundImage: GOLD_GRADIENT }}
                  >
                    {s.step}
                  </span>
                  <h3 className="mt-3 font-serif text-[16px] font-semibold text-[#F6F1E7]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#A9A092]">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="#top"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                style={{ background: GOLD_GRADIENT }}
              >
                Get my preliminary score <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(201,164,76,0.1)] px-6 py-12 text-center text-[13px] text-[#A9A092]">
        <div className="mx-auto flex w-fit items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black shadow-[0_0_18px_rgba(201,164,76,0.14)]">
            <Image
              src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
              alt="Archer Design logo"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="wordmark-font text-[0.74rem] text-[#F6F1E7]">
            <span className="text-[#F6F1E7]">Archer</span>
            <span className="text-[#C9A44C]">Design</span>
          </div>
        </div>
        <p className="mt-6 text-[11px] text-[#A9A092]/50">
          Hotels &middot; Restaurants &middot; Spas &middot; Wellness Brands &middot; Resorts &middot; Event Venues
        </p>
      </footer>
    </div>
  );
}
