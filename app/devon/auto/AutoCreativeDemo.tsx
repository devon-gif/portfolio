"use client";

import { useMemo, useState } from "react";
import { Check, Layers3, RefreshCw, Sparkles } from "lucide-react";
import styles from "./AutoCreativeDemo.module.css";

type FormatId = "square" | "story" | "portrait" | "leaderboard";
type DealerId = "orlando" | "new-york" | "los-angeles";

type Format = {
  id: FormatId;
  label: string;
  size: string;
  ratio: string;
};

type Dealer = {
  id: DealerId;
  short: string;
  name: string;
  vehicle: string;
  image: string;
  headline: string;
  offer: string;
  kicker: string;
};

const formats: Format[] = [
  { id: "square", label: "Feed", size: "1080 × 1080", ratio: "1 / 1" },
  { id: "story", label: "Story", size: "1080 × 1920", ratio: "9 / 16" },
  { id: "portrait", label: "Portrait", size: "1080 × 1350", ratio: "4 / 5" },
  { id: "leaderboard", label: "Leaderboard", size: "728 × 90", ratio: "728 / 90" },
];

const dealers: Dealer[] = [
  {
    id: "orlando",
    short: "Orlando",
    name: "Orlando Motor Atelier",
    vehicle: "Mercedes-Benz GLC",
    image: "https://raw.githubusercontent.com/devon-gif/portfolio/auto-creative-os/public/auto/orlando-glc.webp",
    headline: "DESIGNED FOR EVERY ARRIVAL",
    offer: "FROM $699/MO",
    kicker: "GLC SPRING ARRIVAL",
  },
  {
    id: "new-york",
    short: "New York",
    name: "New York Auto House",
    vehicle: "BMW iX",
    image: "https://raw.githubusercontent.com/devon-gif/portfolio/auto-creative-os/public/auto/new-york-ix.webp",
    headline: "MOVE THE CITY",
    offer: "FROM $749/MO",
    kicker: "IX ELECTRIC CITY",
  },
  {
    id: "los-angeles",
    short: "Los Angeles",
    name: "Los Angeles Motor Gallery",
    vehicle: "Lexus RX",
    image: "https://raw.githubusercontent.com/devon-gif/portfolio/auto-creative-os/public/auto/los-angeles-rx.webp",
    headline: "OWN THE MOMENT",
    offer: "FROM $679/MO",
    kicker: "RX GOLDEN HOUR",
  },
];

function Creative({
  format,
  dealer,
  headline,
  offer,
}: {
  format: Format;
  dealer: Dealer;
  headline: string;
  offer: string;
}) {
  return (
    <div
      className={`${styles.creative} ${styles[format.id]}`}
      style={{ aspectRatio: format.ratio }}
      aria-label={`${format.label} creative preview for ${dealer.vehicle}`}
    >
      <img className={styles.creativeImage} src={dealer.image} alt="" />
      <div className={styles.imageShade} />
      <div className={styles.safeZone} aria-hidden="true" />
      <div className={styles.brand}>{dealer.name}</div>
      <div className={styles.copy}>
        <span className={styles.kicker}>{dealer.kicker}</span>
        <strong>{headline}</strong>
        <em>{offer}</em>
      </div>
      <div className={styles.legal}>Concept creative · offer, legal, inventory and eligibility require final approval.</div>
    </div>
  );
}

export function AutoCreativeDemo() {
  const [dealerId, setDealerId] = useState<DealerId>("orlando");
  const dealer = dealers.find((item) => item.id === dealerId) ?? dealers[0];
  const [headline, setHeadline] = useState(dealer.headline);
  const [offer, setOffer] = useState(dealer.offer);
  const [selected, setSelected] = useState<FormatId[]>(["square", "story", "portrait", "leaderboard"]);
  const [status, setStatus] = useState<"idle" | "building" | "ready">("idle");

  const selectedFormats = useMemo(
    () => formats.filter((format) => selected.includes(format.id)),
    [selected],
  );

  function changeDealer(id: DealerId) {
    const next = dealers.find((item) => item.id === id) ?? dealers[0];
    setDealerId(next.id);
    setHeadline(next.headline);
    setOffer(next.offer);
    setStatus("idle");
  }

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
          <h1>Build one approved campaign. Recompose it for every placement.</h1>
        </div>
        <p>
          This working demo uses real automotive campaign imagery from the original prototype. Pick a dealer,
          edit the semantic copy fields, choose the placement families, then generate responsive compositions
          without blindly shrinking one flat design.
        </p>
      </section>

      <section className={styles.workspace}>
        <aside className={styles.controls}>
          <div className={styles.panelHead}>
            <div>
              <span>01 / SOURCE</span>
              <h2>Approved master</h2>
            </div>
            <span className={styles.readyDot}>Mapped</span>
          </div>

          <div className={styles.dealerPicker} aria-label="Demo campaign source">
            {dealers.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.id === dealer.id ? styles.dealerActive : ""}
                onClick={() => changeDealer(item.id)}
              >
                <strong>{item.short}</strong>
                <small>{item.vehicle}</small>
              </button>
            ))}
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
              {["background", "vehicle", "headline", "offer", "logo", "legal"].map((role) => (
                <i key={role}><Check size={11} /> {role}</i>
              ))}
            </div>
          </div>

          <div className={styles.masterPreview}>
            <Creative format={formats[2]} dealer={dealer} headline={headline} offer={offer} />
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
            {status === "building" ? "Recomposing placements…" : `Generate ${selectedFormats.length} placement previews`}
          </button>

          <div className={`${styles.outputs} ${status === "ready" ? styles.outputsReady : ""}`}>
            {selectedFormats.map((format) => (
              <article key={format.id} className={styles.outputCard}>
                <div className={styles.outputMeta}>
                  <span>{format.label}</span>
                  <small>{format.size}</small>
                </div>
                <div className={styles.outputCreativeWrap}>
                  <Creative format={format} dealer={dealer} headline={headline} offer={offer} />
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
            <strong>What is actually working here</strong>
            <p>
              Dealer switching, editable semantic fields, placement selection and responsive compositions all run
              in the browser. The original prototype also documents PSD ingestion, automated QA and final export as
              the production layer rather than pretending those services are already connected.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
