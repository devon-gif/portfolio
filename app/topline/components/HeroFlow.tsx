/**
 * Hero visual for /topline: the proposed three-stage flow from a Topline
 * revenue priority to a finished hotel activation, rendered as four glass
 * stages on a drawn vertical rail (pure CSS/SVG-free markup — the rail and
 * nodes come from topline.css). No invented data anywhere. Server
 * component; the rail draw-in is triggered by the parent Reveal's
 * .is-visible class.
 */
const STAGES = [
  {
    key: "topline",
    kicker: "01 · Topline",
    label: "Revenue priority",
    desc: "A soft period, package opportunity, or demand driver — identified and approved by Topline.",
  },
  {
    key: "revstudio",
    kicker: "02 · The Revstudio",
    label: "Commercial support",
    desc: "Rates, dates, restrictions, and booking paths confirmed within Topline-authorized scope.",
  },
  {
    key: "archer",
    kicker: "03 · Archer Design",
    label: "Campaign production",
    desc: "Finished motion, campaign visuals, and property-ready exports — brand-safe and white-label.",
  },
  {
    key: "result",
    kicker: "04 · The property",
    label: "Finished hotel activation",
    desc: "The recommendation ships as a launch-ready campaign, behind Topline's client relationship.",
  },
] as const;

export function HeroFlow() {
  return (
    <div className="tl-flow" role="img" aria-label="Proposed flow: a Topline revenue priority, supported commercially by The Revstudio, produced by Archer Design, delivered as a finished hotel activation.">
      <span className="tl-flow-rail" aria-hidden="true" />
      {STAGES.map((s) => (
        <div key={s.key} className={`tl-flow-stage tl-flow-stage--${s.key}`}>
          <span className="tl-flow-node" aria-hidden="true" />
          <p className="tl-flow-kicker">{s.kicker}</p>
          <p className="tl-flow-label tl-serif">{s.label}</p>
          <p className="tl-flow-desc">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
