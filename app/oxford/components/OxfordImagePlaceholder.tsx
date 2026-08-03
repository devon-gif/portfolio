import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Reusable image slot for /oxford. Devon has not supplied approved Oxford
 * Hotels & Resorts photography yet, so this component checks (server-side,
 * at render time) whether a real file exists at the given public path:
 *  - If it exists: renders a real Next.js <Image>, filling the frame.
 *  - If it does not exist yet: renders a polished placeholder (subtle
 *    gradient, category label, recommended shot description, and the
 *    expected file path) so nothing ever looks broken.
 *
 * This means adding a photo later is a drop-in: save the file at the exact
 * `src` path under public/oxford/ and this component automatically swaps
 * from placeholder to real image with no code change. Missing files never
 * fail the build (existsSync only, no import of the asset itself).
 */
export function OxfordImagePlaceholder({
  src,
  alt,
  category,
  recommended,
  aspectClassName = "aspect-[4/3]",
  className,
  priority,
}: {
  /** Public path, e.g. "/oxford/oxford-hero.jpg" */
  src: string;
  alt: string;
  /** Short label, e.g. "Oxford hero photography" */
  category: string;
  /** Recommended shot description shown only while placeholder is active. */
  recommended: string;
  aspectClassName?: string;
  className?: string;
  priority?: boolean;
}) {
  const exists = fileExists(src);

  if (exists) {
    return (
      <div className={["ox-media-frame", aspectClassName, className].filter(Boolean).join(" ")}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={["ox-media-frame ox-placeholder", aspectClassName, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={`${category} placeholder. ${alt}`}
    >
      <div className="ox-placeholder-inner">
        <span className="ox-placeholder-eyebrow">Image placeholder</span>
        <p className="ox-placeholder-category">{category}</p>
        <p className="ox-placeholder-recommended">{recommended}</p>
        <p className="ox-placeholder-path">{src}</p>
      </div>
    </div>
  );
}

function fileExists(publicPath: string): boolean {
  try {
    const cleaned = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
    const fullPath = path.join(process.cwd(), "public", cleaned);
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}
