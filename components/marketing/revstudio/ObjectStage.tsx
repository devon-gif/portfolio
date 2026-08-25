import Image from "next/image";

const OBJECT_SRC = {
  knot: "/revenue-activation/objects/hero-knot.png",
  cube: "/revenue-activation/objects/system-cube.png",
  torus: "/revenue-activation/objects/pilot-torus.png",
} as const;

type ObjectVariant = keyof typeof OBJECT_SRC;

/**
 * Renders one of the three shared 3D object accents (glass knot, crystal
 * cube, glass torus — see public/revenue-activation/objects/) with the same
 * halo + orbit-ring + soft-float treatment used on the HSC × Archer Design
 * page (public/revenue-activation/index.html's .object-wrap system), ported
 * to CSS in app/globals.css under .revstudio-theme. Purely decorative:
 * always empty-alt + aria-hidden, never conveys unique information.
 */
export function ObjectStage({
  variant,
  size = 320,
  orbit = true,
  priority = false,
  className,
}: {
  variant: ObjectVariant;
  /** Max pixel width of the stage; scales down responsively via CSS. */
  size?: number;
  /** Show the two thin orbiting rings behind the object (hero/model use them; pilot omits for a calmer composition). */
  orbit?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rv-object-stage ${className ?? ""}`}
      style={{ width: "100%", maxWidth: size }}
      aria-hidden="true"
    >
      {orbit && (
        <>
          <div className="rv-orbit-ring rv-orbit-ring-1" />
          <div className="rv-orbit-ring rv-orbit-ring-2" />
        </>
      )}
      <div className="rv-object-halo" />
      <Image
        src={OBJECT_SRC[variant]}
        alt=""
        width={900}
        height={900}
        priority={priority}
        className={`rv-object-img rv-object-${variant}`}
      />
    </div>
  );
}
