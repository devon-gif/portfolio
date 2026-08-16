import fs from "fs";
import path from "path";
import styles from "./NonHotelWork.module.css";
import { NonHotelImageSlideshow } from "./NonHotelImageSlideshow";

const youtubeWork = [
  {
    id: "q-FAWqOdBFM",
    title: "Archer Design — Selected Video Work 01",
  },
  {
    id: "7gIJCHNmFts",
    title: "Archer Design — Selected Video Work 02",
  },
  {
    id: "-y1ZDJq33HY",
    title: "Archer Design — Selected Video Work 03",
  },
];

const testimonialPlaceholders = [
  {
    quote:
      "Archer Design took a loose campaign idea and turned it into polished creative that felt elevated, intentional, and ready to launch.",
    role: "Marketing Director",
  },
  {
    quote:
      "The process was fast, collaborative, and much more strategic than simply handing projects off to a production designer.",
    role: "Brand & Marketing Lead",
  },
  {
    quote:
      "Motion, static, and campaign assets all felt connected instead of looking like separate one-off pieces.",
    role: "Client Partner",
  },
  {
    quote:
      "Archer Design gave us the flexibility of an outside creative team without adding another layer of complexity to the process.",
    role: "Growth & Marketing",
  },
];

function getMediaFiles(
  folder: "images" | "videos",
  extensions: string[],
) {
  const root = path.join(
    process.cwd(),
    "public",
    "tcrm",
    "non-hotel",
    folder,
  );

  if (!fs.existsSync(root)) return [];

  const excludedNonHotelImages = [
    "screenshot 2026-08-13 at 9.10.59",
    "signal-2026-04-15-12-43-44-030_002",
  ];

  return fs
    .readdirSync(root)
    .filter((name) =>
      extensions.some((ext) => name.toLowerCase().endsWith(ext)),
    )
    .filter((name) => {
      if (folder !== "images") return true;

      const lower = name.toLowerCase();

      return !excludedNonHotelImages.some((blocked) =>
        lower.includes(blocked)
      );
    })
    .sort((a, b) => {
      // Bring the VibeCode website toward the front whenever its
      // filename identifies it.
      const aVibe = a.toLowerCase().includes("vibe");
      const bVibe = b.toLowerCase().includes("vibe");

      if (aVibe && !bVibe) return -1;
      if (!aVibe && bVibe) return 1;

      return a.localeCompare(b);
    });
}

function assetUrl(folder: string, name: string) {
  return `/tcrm/non-hotel/${folder}/${encodeURIComponent(name)}`;
}

export function NonHotelWork() {
  const images = getMediaFiles("images", [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".avif",
  ]);

  const videos = getMediaFiles("videos", [
    ".mp4",
    ".mov",
    ".webm",
    ".m4v",
  ]);

  return (
    <>
      <section className={styles.section} id="beyond-hospitality">
        <div className={styles.shell}>
          <div className={styles.eyebrow}>
            <span>BEYOND HOSPITALITY</span>
            <i />
          </div>

          <div className={styles.headingRow}>
            <div>
              <h2>
                A broader range of
                <br />
                <em>creative capability.</em>
              </h2>
            </div>

            <p>
              Archer Design also works across product visualization, 3D,
              branded digital experiences, motion, campaign concepts, and
              visual storytelling beyond the hotel space.
            </p>
          </div>

          {images.length > 0 && (
            <NonHotelImageSlideshow
              items={images.map((name) => ({
                src: assetUrl("images", name),
                alt: "Selected Archer Design brand, product, 3D, and digital creative work",
              }))}
            />
          )}

          {videos.length > 0 && (
            <div className={styles.localVideoBlock}>
              <div className={styles.subhead}>
                <span>SELECTED MOTION &amp; 3D</span>
                <p>
                  Product, campaign, animation, and visual-development work.
                </p>
              </div>

              <div className={styles.localVideos}>
                {videos.map((name) => (
                  <div className={styles.videoFrame} key={name}>
                    <video
                      src={assetUrl("videos", name)}
                      controls
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.youtubeBlock}>
            <div className={styles.subhead}>
              <span>MORE VIDEO WORK</span>
              <p>
                A few additional examples of long-form, motion, and visual
                storytelling work by Archer Design.
              </p>
            </div>

            <div className={styles.youtubeGrid}>
              {youtubeWork.map((video) => (
                <article className={styles.youtubeCard} key={video.id}>
                  <div className={styles.youtubeFrame}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch on YouTube <span>↗</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
