import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Cpu, CloudSun, Gauge, Sunrise } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import LivingLobbyPreview, { LIVING_LOBBY_SRC } from "../components/LivingLobbyPreview";
import { Crumb, PortfolioContact, PortfolioFooter, PortfolioNav } from "../components/PortfolioChrome";
import opus from "../opus.module.css";
import sub from "../subpage.module.css";

export const metadata: Metadata = {
  title: "Living Lobby · Devon Archer",
  description:
    "A real-time generative brand installation for hotel lobbies: GPU particles, a sky that follows the real sun and live weather, and a director mode that shows the system underneath.",
  alternates: { canonical: absoluteUrl("/devon/living-lobby") },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Living Lobby · Devon Archer",
    description: "A real-time generative brand installation for hotel lobbies.",
    images: [{ url: absoluteUrl("/devon/projects/living-lobby-halcyon.jpg"), width: 1600, height: 1000, alt: "Living Lobby" }],
  },
};

const tryStates = [
  ["Golden hour", "phase=golden"],
  ["Night", "phase=night"],
  ["Snow", "phase=dusk&weather=snow"],
  ["Thunderstorm", "phase=night&weather=storm"],
  ["24h in 60 seconds", "timelapse=1"],
  ["Director mode", "director=1"],
] as const;

const specs = [
  ["Particles", "26k to 124k particles simulated entirely on the GPU, picked to suit the hardware."],
  ["Day cycle", "Six phases from night to golden hour, anchored to the real sunrise and sunset for the property's location."],
  ["Weather", "Live conditions from Open-Meteo. Clouds grey the sky, rain pulls particles down, snow slows and whitens them, wind pushes them sideways, storms add lightning."],
  ["Brand moment", "Every cycle the particles gather into the property's wordmark, hold, then release back into the flow."],
  ["Interaction", "Pointer and touch push the field with a swirl today. Camera hand and body tracking plug into the same input system in Part 2."],
  ["Director mode", "Frame rate, the 24-hour phase strip, raw weather, every derived value, live palette and thumbnails of the GPU buffers, plus overrides for demos."],
] as const;

const build = [
  {
    icon: Cpu,
    title: "Particles live on the GPU",
    body: "Position and velocity are stored in float textures and advanced by two fragment-shader passes. Curl noise, wind, gravity, a spring toward the wordmark and people as attractors are all forces in one shader.",
  },
  {
    icon: CloudSun,
    title: "Data becomes mood in one place",
    body: "One module blends the brand palettes for the current phase, applies the weather and eases every value, so nothing ever snaps when conditions change.",
  },
  {
    icon: Sunrise,
    title: "It follows the real sun",
    body: "Phase keyframes are offsets from sunrise and sunset, so golden hour lands at the right time in every season. A local sunrise equation covers offline moments.",
  },
  {
    icon: Gauge,
    title: "It degrades instead of breaking",
    body: "Weather falls back from live to cached to clear. Quality steps down when frames run long and climbs back with headroom. The display stays awake and reloads nightly in kiosk mode.",
  },
];

const roadmap = [
  ["Part 1", "Visual engine", "GPU particles, live sun and weather, director mode, kiosk hardening.", true],
  ["Part 2", "Camera interaction", "Hand and body tracking as a new input source, plus audio reactivity.", false],
  ["Part 3", "Phone as controller", "Guests join from a QR code and steer the field from their phone.", false],
  ["Part 4", "Generative content", "Brand-constrained AI imagery with deterministic guardrails and a take-home clip.", false],
  ["Part 5", "On site", "Performance pass, a real lobby install, filming and a full case study.", false],
] as const;

export default function LivingLobbyPage() {
  return (
    <div className={opus.opusPage}>
      <PortfolioNav current="work" />

      <main className={opus.shell}>
        <section className={opus.panel} id="top">
          <div className={sub.head} style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Crumb label="Living Lobby" />
              <span className={opus.status}>In development · Part 1 of 5 built</span>
              <h2 style={{ fontSize: "clamp(3rem, 8vw, 7.4rem)" }}>
                <span>Living</span> Lobby.
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ margin: 0, color: "var(--soft)", fontSize: 16, lineHeight: 1.65, maxWidth: "54ch" }}>
                A generative brand installation for hotel lobbies. Particles drift through a sky that follows the real sun
                and the live weather, gather into the property&apos;s wordmark, and scatter when guests reach toward the
                screen. It is built to run unattended for days, like an installation rather than a demo.
              </p>
              <div className={sub.actions}>
                <a className={opus.pill} href={LIVING_LOBBY_SRC} target="_blank" rel="noreferrer">
                  Open full screen{" "}
                  <i>
                    <ArrowUpRight size={15} />
                  </i>
                </a>
                <a className={sub.ghost} href="#how">
                  How it works <ArrowDown size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={sub.frame} aria-label="Living Lobby live build">
          <div className={sub.frameBar}>
            <span className={sub.frameDots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>Live build · Halcyon demo brand · Salt Lake City</span>
            <a href={LIVING_LOBBY_SRC} target="_blank" rel="noreferrer">
              Full screen ↗
            </a>
          </div>
          <div className={`${sub.frameBody} ${sub.wide}`}>
            <LivingLobbyPreview showOpen={false} />
          </div>
        </section>

        <section className={opus.panel}>
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}>
              <b /> Try it
            </p>
            <h2>
              <span>Any time,</span> any weather.
            </h2>
            <p>
              The embedded build shows the real time and weather in Salt Lake City right now. These open it full screen in
              a specific state. Inside, press D for director mode and W to form the wordmark.
            </p>
          </div>
          <ul className={opus.facts} style={{ marginTop: 0 }}>
            {tryStates.map(([label, q]) => (
              <li key={label}>
                <a href={`${LIVING_LOBBY_SRC}?${q}`} target="_blank" rel="noreferrer">
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={opus.panel} id="how">
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}>
              <b /> What it does
            </p>
            <h2>
              <span>A lobby that</span> behaves like a place.
            </h2>
            <p>Part 1 is the visual engine and the plumbing that lets it run unattended. Later parts plug into interfaces that already exist.</p>
          </div>
          <dl className={sub.specs} style={{ margin: 0 }}>
            {specs.map(([k, v]) => (
              <div className={sub.spec} key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={sub.dark}>
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`} style={{ color: "rgba(241,239,231,.6)" }}>
              <b /> How it&apos;s built
            </p>
            <h2>
              <span>Vite, TypeScript,</span> three.js and GLSL.
            </h2>
            <p>No framework in the render loop. Every input, from the clock to a cursor, becomes a handful of eased numbers the shaders read each frame.</p>
          </div>
          <div className={sub.grid4}>
            {build.map(({ icon: Icon, title, body }) => (
              <article className={sub.step} key={title} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(241,239,231,.12)" }}>
                <Icon size={22} color="#d7ff3f" aria-hidden="true" />
                <h3 style={{ marginTop: 6 }}>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={opus.panel}>
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}>
              <b /> Roadmap
            </p>
            <h2>
              <span>Five parts,</span> one installation.
            </h2>
            <p>Each part ships as a working build. The goal is a real lobby, real guests and honest numbers.</p>
          </div>
          <div className={sub.roadmap}>
            {roadmap.map(([part, title, body, done]) => (
              <article className={sub.phase} data-done={done ? "true" : undefined} key={part}>
                <span>
                  {part}
                  {done ? " · built" : ""}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <PortfolioContact />
        <PortfolioFooter />
      </main>
    </div>
  );
}
