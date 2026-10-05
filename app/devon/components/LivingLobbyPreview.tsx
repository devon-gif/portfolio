"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./LivingLobbyPreview.module.css";

/** The real Living Lobby build, served as static files from /public. */
export const LIVING_LOBBY_SRC = "/devon/living-lobby-app/index.html";

type Props = {
  /** Extra query string for the embedded build, e.g. "phase=golden". */
  params?: string;
  /** Show the "open the project" button in the corner. */
  showOpen?: boolean;
};

/**
 * Embeds the actual Living Lobby installation (not a stand-in animation).
 *
 * The iframe is only created once the card nears the viewport, and the build
 * is paused through postMessage whenever the card scrolls out of view, so it
 * costs nothing while the visitor is elsewhere on the page. Until it loads, a
 * still frame from the real build is shown in its place.
 */
export default function LivingLobbyPreview({ params = "", showOpen = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Reduced motion: keep the still frame and never start the live build.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const post = (type: string) => frameRef.current?.contentWindow?.postMessage({ type }, window.location.origin);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          post("living-lobby:resume");
        } else {
          post("living-lobby:pause");
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const src = `${LIVING_LOBBY_SRC}?embed=1&quality=medium${params ? `&${params}` : ""}`;

  return (
    <div ref={rootRef} className={styles.root}>
      {/* Still frame from the real build: visible while loading and for reduced motion. */}
      <Image
        className={styles.poster}
        src="/devon/projects/living-lobby-halcyon.jpg"
        alt="Living Lobby forming the HALCYON wordmark from particles at golden hour"
        fill
        sizes="(min-width: 1000px) 62vw, 94vw"
        data-hidden={loaded ? "true" : undefined}
      />
      {mounted ? (
        <iframe
          ref={frameRef}
          className={styles.frame}
          src={src}
          title="Living Lobby, live real-time build"
          allow="fullscreen"
          tabIndex={-1}
          data-loaded={loaded ? "true" : undefined}
          onLoad={() => setLoaded(true)}
        />
      ) : null}

      <div className={styles.chrome} aria-hidden={!loaded}>
        <span className={styles.tag}>
          <span className={styles.dot} />
          {loaded ? "Live build · move your cursor" : "Loading live build"}
        </span>
        {showOpen ? (
          <Link className={styles.open} href="/devon/living-lobby">
            Open project <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
