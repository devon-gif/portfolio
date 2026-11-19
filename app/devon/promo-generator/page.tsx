import type { Metadata } from "next";
import { ArrowDown, FileSpreadsheet, LayoutTemplate, Lock, Clapperboard } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import ProjectVideo from "../components/ProjectVideo";
import { Crumb, PortfolioContact, PortfolioFooter, PortfolioNav } from "../components/PortfolioChrome";
import opus from "../opus.module.css";
import sub from "../subpage.module.css";

export const metadata: Metadata = {
  title: "Hotel Promo Generator · Devon Archer",
  description:
    "A Remotion template system that turns a spreadsheet of hotel offers into on-brand promo videos for every social format with one command.",
  alternates: { canonical: absoluteUrl("/devon/promo-generator") },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Hotel Promo Generator · Devon Archer",
    description: "One template, four offers, three formats, twelve videos, one command.",
    images: [{ url: absoluteUrl("/devon/projects/promo-generator-grid.jpg"), width: 1920, height: 1200, alt: "Hotel Promo Generator" }],
  },
};

const MEDIA = "/devon/promo-generator";

const specs = [
  ["Problem", "Hotels need the same offer in every size, every season, for every channel. Rebuilding each version by hand is slow and is where brands drift."],
  ["Input", "A spreadsheet with one row per offer: headline, details, price, dates, call to action and two photos."],
  ["Output", "A 10 second promo per offer in 9:16 for Reels and TikTok, 1:1 for feeds and 16:9 for YouTube, web and lobby screens."],
  ["Brand", "Name, palette, type and timing live in one file, so every video follows the same rules without anyone policing it."],
  ["Hook", "The headline lands inside the first second, then the offer, the price and the dates, then a branded end card with the call to action."],
  ["Safe zones", "Text stays clear of the areas where Instagram and TikTok draw their own buttons and captions."],
] as const;

const build = [
  {
    icon: FileSpreadsheet,
    title: "Spreadsheet in",
    body: "Marketing edits rows in Excel, Numbers or Google Sheets. A small script turns the sheet into data the template reads, and checks every row before rendering.",
  },
  {
    icon: LayoutTemplate,
    title: "One template, every size",
    body: "A single React component lays itself out for vertical, square and wide, scaling type and moving copy so each format feels designed rather than cropped.",
  },
  {
    icon: Lock,
    title: "Brand locked in code",
    body: "Colors, fonts and the motion timeline are defined once. Swapping the brand file restyles every video at once, so a new property is a new config, not a new edit.",
  },
  {
    icon: Clapperboard,
    title: "One command renders the campaign",
    body: "A batch script bundles the project once and renders every offer in every format with Remotion, with options for a single offer, some sizes or quick previews.",
  },
];

const next = [
  ["Now", "Template system", "Spreadsheet driven offers, three formats, batch rendering, locked brand.", true],
  ["Next", "Sound", "Music and an ElevenLabs voiceover track, timed to the template.", false],
  ["Next", "AI imagery", "Generated scenes with locked brand references and a human check before render.", false],
  ["Later", "Many properties", "One brand file per hotel, so a group can run the same campaign across its whole portfolio.", false],
  ["Later", "On demand", "Render from a web form or straight from booking and CRM data in the cloud.", false],
] as const;

const formats = [
  ["story", "9:16", "Reels, Stories, TikTok", "9 / 16"],
  ["square", "1:1", "Feed", "1 / 1"],
  ["wide", "16:9", "YouTube, web, lobby screens", "16 / 9"],
] as const;

export default function PromoGeneratorPage() {
  return (
    <div className={opus.opusPage}>
      <PortfolioNav current="work" />

      <main className={opus.shell}>
        <section className={opus.panel} id="top">
          <div className={sub.head} style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Crumb label="Hotel Promo Generator" />
              <span className={opus.status}>Working tool · Remotion</span>
              <h2 style={{ fontSize: "clamp(3rem, 8vw, 7.4rem)" }}>
                <span>Promo</span> generator.
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ margin: 0, color: "var(--soft)", fontSize: 16, lineHeight: 1.65, maxWidth: "54ch" }}>
                One branded template turns a spreadsheet of hotel offers into finished promo videos for every social format.
                The marketing team edits rows instead of timelines, and a single command renders the whole campaign on
                brand.
              </p>
              <div className={sub.actions}>
                <a className={sub.ghost} href="#formats">
                  One offer, three formats <ArrowDown size={14} />
                </a>
                <a className={sub.ghost} href="#how">
                  How it works <ArrowDown size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={sub.frame} aria-label="Twelve generated promo videos">
          <div className={sub.frameBar}>
            <span className={sub.frameDots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>1 template · 4 offers · 3 formats · 1 command</span>
            <span />
          </div>
          <div className={`${sub.frameBody}`} style={{ position: "relative", aspectRatio: "16 / 10" }}>
            <ProjectVideo
              src="/devon/projects/promo-generator-grid.mp4"
              poster="/devon/projects/promo-generator-grid.jpg"
              alt="Twelve hotel promo videos generated from one template, playing together"
            />
          </div>
        </section>

        <section className={opus.panel} id="formats">
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}>
              <b /> One offer
            </p>
            <h2>
              <span>Three formats,</span> one layout system.
            </h2>
            <p>The same row of data, rendered three times. Type scale, copy position and safe zones adapt to each size.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
            {formats.map(([key, ratio, use, aspect]) => (
              <figure key={key} style={{ margin: 0, flex: key === "wide" ? "2.2 1 360px" : key === "square" ? "1.25 1 220px" : "0.7 1 160px" }}>
                <div style={{ position: "relative", aspectRatio: aspect, borderRadius: 18, overflow: "hidden", background: "#14110f" }}>
                  <ProjectVideo src={`${MEDIA}/winter-${key}.mp4`} poster={`${MEDIA}/winter-${key}.jpg`} alt={`Winter Escape promo, ${ratio}`} />
                </div>
                <figcaption style={{ marginTop: 10, color: "var(--soft)", font: "500 11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace", letterSpacing: ".08em", textTransform: "uppercase" }}>
                  {ratio} · {use}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={opus.panel} id="how">
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}>
              <b /> What it does
            </p>
            <h2>
              <span>Campaigns,</span> not one-off edits.
            </h2>
            <p>Built for the way hotel marketing actually works: many offers, many sizes, short deadlines and a brand that has to hold.</p>
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
              <span>Remotion, React</span> and TypeScript.
            </h2>
            <p>Video as code: the same tools I use for product interfaces, pointed at motion and production volume.</p>
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
              <b /> What&apos;s next
            </p>
            <h2>
              <span>From template</span> to pipeline.
            </h2>
            <p>
              HALCYON is a fictional hotel brand used for this study. Photography is licensed from Envato Elements and appears
              only inside the finished videos.
            </p>
          </div>
          <div className={sub.roadmap}>
            {next.map(([part, title, body, done]) => (
              <article className={sub.phase} data-done={done ? "true" : undefined} key={title}>
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
