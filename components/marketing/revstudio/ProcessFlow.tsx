import { Target, Link2, SlidersHorizontal, Palette, Rocket, RefreshCcw } from "lucide-react";
import { Reveal } from "./Reveal";

export type ProcessStage = {
  n: string;
  label: string;
  t: string;
  d: string;
  owner: string;
  /** Drives the small owner-dot color + className hook; expected values
   *  are "revstudio" | "shared" | "archer" | "mixed" but kept as a plain
   *  string so lib/revstudio-content.ts doesn't need `as const` literals. */
  ownerType: string;
};

const STAGE_ICONS = [Target, Link2, SlidersHorizontal, Palette, Rocket, RefreshCcw];

/**
 * "How the work moves." — one connected six-step workflow rather than six
 * text-heavy cards. All six nodes sit on one straight illuminated line
 * (mobile: a left-rail vertical line; tablet: two rows of three; desktop:
 * one row) — see .rv-process-* in app/globals.css for the responsive
 * behavior. The central "one priority / one brief / one coordinated
 * launch" badge sits in normal document flow above the track (not
 * floated over it) so it can never overlap node content. Icon/line color
 * progresses from Revstudio violet (01-03) through a transition node (04)
 * to warmer Archer Design gold accents (05-06); ownership is additionally
 * spelled out in text + a small dot so it never relies on color alone.
 */
export function ProcessFlow({ stages, centralBadge }: { stages: ProcessStage[]; centralBadge: string[] }) {
  return (
    <Reveal className="rv-process">
      <div className="rv-process-badge-wrap" aria-hidden="true">
        <div className="rv-process-badge">
          {centralBadge.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>

      <div className="rv-process-body">
        <div className="rv-process-line" aria-hidden="true" />

        <ol className="rv-process-track">
          {stages.map((s, i) => {
            const Icon = STAGE_ICONS[i] ?? Target;
            return (
              <li key={s.n} className={`rv-process-node rv-process-node--${s.ownerType}`} aria-label={`Step ${s.n}, ${s.label}: ${s.t}`}>
                <Reveal delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="rv-process-node-inner">
                  <span className="rv-process-icon" aria-hidden="true">
                    <Icon strokeWidth={1.6} />
                  </span>
                  <span className="rv-process-num" aria-hidden="true">
                    {s.n}
                  </span>
                  <p className="rv-process-label">{s.label}</p>
                  <p className="rv-process-detail">{s.d}</p>
                  <p className="rv-process-owner">
                    <span className="rv-process-owner-dot" aria-hidden="true" />
                    {s.owner}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="rv-process-loop">
        <RefreshCcw aria-hidden="true" strokeWidth={1.5} />
        Refine, then loop back to 01 · Identify
      </p>
    </Reveal>
  );
}
