"use client";

import { useMemo, useState } from "react";
import { Check, Layers3, RefreshCw, Sparkles } from "lucide-react";
import styles from "./AutoCreativeDemo.module.css";

type FormatId = "square" | "story" | "portrait" | "leaderboard";

type Format = {
  id: FormatId;
  label: string;
  size: string;
  ratio: string;
};

const formats: Format[] = [
  { id: "square", label: "Feed", size: "1080 × 1080", ratio: "1 / 1" },
  { id: "story", label: "Story", size: "1080 × 1920", ratio: "9 / 16" },
  { id: "portrait", label: "Portrait", size: "1080 × 1350", ratio: "4 / 5" },
  { id: "leaderboard", label: "Leaderboard", size: "728 × 90", ratio: "728 / 90" },
];

function Creative({ format, headline, offer }: { format: Format; headline: string; offer: string }) {
  return (
    <div
      className={`${styles.creative} ${styles[format.id]}`}
      style={{ aspectRatio: format.ratio }}
      aria-label={`${format.label} creative preview`}
    >
      <div className={styles.texture} />
      <div className={styles.vehicleShape} aria-hidden="true">
        <span />
        <i />
      </div>
      <div className={styles.brand}>ATELIER MOTORS</div>
      <div className={styles.copy}>
        <span className={styles.kicker}>NEW SEASON / MODEL X</span>
        <strong>{headline}</strong>
        <em>{offer}</em>
      </div>
      <div className={styles.legal}>Concept creative · offer and legal copy require final approval.</div>
    </div>
  );
}

export function AutoCreativeDemo() {
  const [headline, setHeadline] = useState("BUILT FOR WHAT'S NEXT");
  const [offer, setOffer] = useState("0.9% APR · 36 MONTHS");
  const [selected, setSelected] = useState<FormatId[]>(["square", "story", "portrait", "leaderboard"]);
  const [status, setStatus] = useState<"idle" | "building" | "ready">("idle");

  const selectedFormats = useMemo(
    () => formats.filter((format) => selected.includes(format.id)),
    [selected],
  );

  function toggleFormat(id: FormatId) {
    setSelected((current) =>
      current.includes(id)
        ? current.length > 1
          ? current.filter((item) => item !== id)
          : current
        : [...current, id],
    );
    setStatus("idle");
  }

  function build() {
    setStatus("building");
    window.setTimeout(() => setStatus("ready"), 650);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/devon" className={styles.back}>← Devon Archer</a>
        <div className={styles.brandLockup}>
          <Layers3 size={18} />
          <span>Auto Creative OS</span>
        </div>
        <span className={styles.prototype}>Interactive portfolio prototype</span>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Creative systems / production automation</p>
          <h1>Build the campaign once. Recompose it for every placement.</h1>
        </div>
        <p>
          This working browser demo shows the core idea behind Auto Creative OS: preserve semantic creative roles,
          select the placement families you need, then generate responsive previews without treating every size as
          a blind resize.
        </p>
      </section>

      <section className={styles.workspace}>
        <aside className={styles.controls}>
          <div className={styles.panelHead}>
            <div>
              <span>01 / SOURCE</span>
              <h2>Approved master</h2>
            </div>
            <span className={styles.readyDot}>Ready</span>
          </div>

          <label className={styles.field}>
            <span>Headline role</span>
            <input value={headline} onChange={(event) => { setHeadline(event.target.value); setStatus("idle"); }} />
          </label>
          <label className={styles.field}>
            <span>Offer role</span>
            <input value={offer} onChange={(event) => { setOffer(event.target.value); setStatus("idle"); }} />
          </label>

          <div className={styles.roles}>
            <span>Mapped semantic roles</span>
            <div>
              {['background', 'vehicle', 'headline', 'offer', 'logo', 'legal'].map((role) => (
                <i key={role}><Check size={11} /> {role}</i>
              ))}
            </div>
          </div>

          <div className={styles.masterPreview}>
            <Creative format={formats[2]} headline={headline} offer={offer} />
          </div>
        </aside>

        <section className={styles.outputPanel}>
          <div className={styles.panelHead}>
            <div>
              <span>02 / COMPOSE</span>
              <h2>Select placement families</h2>
            </div>
            <span>{selectedFormats.length} selected</span>
          </div>

          <div className={styles.formatPicker}>
            {formats.map((format) => {
              const active = selected.includes(format.id);
              return (
                <button
                  type="button"
                  key={format.id}
                  className={active ? styles.formatActive : ""}
                  onClick={() => toggleFormat(format.id)}
                  aria-pressed={active}
                >
                  <span className={styles.formatShape} style={{ aspectRatio: format.ratio }} />
                  <strong>{format.label}</strong>
                  <small>{format.size}</small>
                  <i>{active ? <Check size={12} /> : null}</i>
                </button>
              );
            })}
          </div>

          <button type="button" className={styles.generate} onClick={build} disabled={status === "building"}>
            {status === "building" ? <RefreshCw size={18} className={styles.spin} /> : <Sparkles size={18} />}
            {status === "building" ? "Recomposing placements…" : "Generate placement previews"}
          </button>

          <div className={`${styles.outputs} ${status === "ready" ? styles.outputsReady : ""}`}>
            {selectedFormats.map((format) => (
              <article key={format.id} className={styles.outputCard}>
                <div className={styles.outputMeta}>
                  <span>{format.label}</span>
                  <small>{format.size}</small>
                </div>
                <div className={styles.outputCreativeWrap}>
                  <Creative format={format} headline={headline} offer={offer} />
                </div>
                <div className={styles.validation}>
                  <span><Check size={12} /> hierarchy</span>
                  <span><Check size={12} /> legal</span>
                  <span><Check size={12} /> safe zone</span>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.truth}>
            <strong>Prototype boundary</strong>
            <p>
              The placement selection, responsive compositions, editable semantic fields, and preview generation
              are working in-browser. Final PSD ingestion, automated compliance checks, and downloadable production
              exports are the documented next layer rather than simulated here.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
