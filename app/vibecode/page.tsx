import type { Metadata } from "next";
import {
  Activity,
  ArrowRight,
  Bot,
  Braces,
  GitBranch,
  Github,
  Radar,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import "./vibecode.css";

export const metadata: Metadata = {
  title: "VibeCode+ — Self-healing codebase concept",
  description:
    "VibeCode+ is an AI engineering concept designed to monitor Next.js apps, identify fatal logic failures, and prepare focused GitHub fixes for human review.",
};

const workflow = [
  {
    icon: Radar,
    step: "01",
    title: "Monitor",
    body: "Watch production signals and capture the context around failures instead of waiting for manual triage.",
  },
  {
    icon: Bot,
    step: "02",
    title: "Analyze",
    body: "Use AI to inspect the failure, relevant code paths, and likely root cause within a bounded engineering workflow.",
  },
  {
    icon: Wrench,
    step: "03",
    title: "Prepare a fix",
    body: "Generate a focused branch-level change rather than modifying production silently.",
  },
  {
    icon: GitBranch,
    step: "04",
    title: "Open a PR",
    body: "Put the proposed repair where engineering teams already work: GitHub, with a diff a human can review.",
  },
];

const features = [
  ["GitHub-native", "Issues, branches, pull requests and review stay at the center of the workflow."],
  ["Next.js focused", "Designed around App Router, TypeScript and Vercel-shaped production workflows."],
  ["Human approval", "Automation can prepare the fix; merge authority remains with the team."],
  ["Visible failure states", "The system is designed to surface uncertainty rather than pretend every diagnosis is safe."],
];

export default function VibeCodePage() {
  return (
    <div className="vc-site">
      <header className="vc-nav">
        <a href="#home" className="vc-logo" aria-label="VibeCode Plus home">
          VibeCode<span>+</span>
        </a>
        <nav className="vc-links" aria-label="VibeCode sections">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#workflow">Workflow</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#notes">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="vc-nav-actions">
          <a href="#workflow" className="vc-login">Log In</a>
          <a href="#workflow" className="vc-nav-button">Install on GitHub</a>
        </div>
      </header>

      <main>
        <section className="vc-hero" id="home">
          <div className="vc-stars" aria-hidden="true" />
          <div className="vc-side-card vc-side-card-a" aria-hidden="true"><Activity /></div>
          <div className="vc-side-card vc-side-card-b" aria-hidden="true"><Braces /></div>
          <div className="vc-side-card vc-side-card-c" aria-hidden="true"><Radar /></div>
          <div className="vc-side-card vc-side-card-d" aria-hidden="true"><GitBranch /></div>

          <div className="vc-hero-copy">
            <div className="vc-pill"><Sparkles size={15} /> Works while you sleep</div>
            <h1>Makes your codebase<br /><span>self-healing</span></h1>
            <p>
              The AI engineering concept that actively monitors your Next.js app,
              catches fatal logic errors, and prepares the fix for GitHub review while you sleep.
            </p>
            <a href="#workflow" className="vc-primary-button">
              <Github size={19} /> Explore the GitHub workflow
            </a>
          </div>

          <div className="vc-hero-machine" aria-label="VibeCode workflow visualization">
            <div className="vc-machine-card vc-card-settings"><Wrench /></div>
            <div className="vc-machine-rail"><span /></div>
            <div className="vc-machine-card vc-card-user"><UserRound /></div>
            <div className="vc-floor-card vc-floor-1" />
            <div className="vc-floor-card vc-floor-2" />
            <div className="vc-floor-card vc-floor-3" />
            <div className="vc-floor-line" />
          </div>
        </section>

        <section className="vc-statement" id="about">
          <div className="vc-mini-pill"><span /> VibeCode+</div>
          <h2>No manual work.<span>*</span></h2>
          <p>*The system prepares focused fixes automatically. A human still reviews what gets merged.</p>
        </section>

        <section className="vc-section" id="workflow">
          <div className="vc-section-head">
            <div>
              <p className="vc-eyebrow">Workflow</p>
              <h2>Crash to pull request, without the midnight triage loop.</h2>
            </div>
            <p>
              VibeCode+ was built around a straightforward product idea: when a production app fails,
              the system should gather context, reason about the likely cause, prepare a focused repair,
              and put that repair into the team&apos;s existing review process.
            </p>
          </div>
          <div className="vc-workflow-grid">
            {workflow.map(({ icon: Icon, step, title, body }) => (
              <article key={step} className="vc-workflow-card">
                <div className="vc-workflow-icon"><Icon /></div>
                <div className="vc-step">{step}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="vc-section vc-feature-section" id="features">
          <div className="vc-section-head">
            <div>
              <p className="vc-eyebrow">Features</p>
              <h2>Automation with engineering guardrails.</h2>
            </div>
            <p>
              The useful part is not “AI writes code.” It is the system around the model: context boundaries,
              repository permissions, visible diffs, review states, and an explicit human decision before merge.
            </p>
          </div>
          <div className="vc-feature-grid">
            {features.map(([title, body], index) => (
              <article key={title} className="vc-feature-card">
                <span>0{index + 1}</span>
                <ShieldCheck />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="vc-section vc-pricing" id="pricing">
          <div className="vc-pricing-card">
            <p className="vc-eyebrow">Original product model</p>
            <h2>Built as a real SaaS concept, not just a landing-page mockup.</h2>
            <p>
              The original application includes pricing, dashboard flows, GitHub integration architecture,
              crash-report handling, AI analysis, pull-request generation and Supabase-backed product logic.
            </p>
            <div className="vc-price-row">
              <div><strong>$0</strong><span>Starter</span></div>
              <div><strong>$15</strong><span>Solo Founder</span></div>
              <div><strong>$89</strong><span>Startup Team</span></div>
            </div>
          </div>
        </section>

        <section className="vc-section vc-notes" id="notes">
          <div className="vc-notes-copy">
            <p className="vc-eyebrow">Build note</p>
            <h2>Why this project matters.</h2>
            <p>
              VibeCode+ explores a problem that sits directly between product design, AI systems and frontend engineering:
              how do you turn an autonomous coding idea into a workflow a real team could understand, review and trust?
            </p>
          </div>
          <div className="vc-code-window" aria-label="Concept architecture">
            <div className="vc-code-top"><span /><span /><span /></div>
            <pre>{`production error\n  ↓\ncontext capture\n  ↓\nAI diagnosis\n  ↓\nscoped code change\n  ↓\nGitHub pull request\n  ↓\nhuman review`}</pre>
          </div>
        </section>
      </main>

      <footer className="vc-footer" id="contact">
        <div>
          <a href="#home" className="vc-logo">VibeCode<span>+</span></a>
          <p>AI engineering concept / product design + systems build.</p>
        </div>
        <a href="/devon" className="vc-footer-link">View Devon&apos;s portfolio <ArrowRight size={16} /></a>
      </footer>
    </div>
  );
}
