import Image from "next/image";

type InfuseLogoLockupProps = {
  /** Which Infuse wordmark variant to use — pick to match the background
   * it's placed on (light variant for dark grounds, dark variant for light
   * grounds), same convention already used by the Final CTA logo. */
  infuseLogoSrc: string;
  className?: string;
};

/**
 * [Archer monogram] | [Infuse wordmark] lockup with a thin vertical divider
 * — the real assets from the project (public/tcrm/logos/archer-design-
 * monogram.png, public/infuse/brand/infuse-hospitality-logo-*.webp), never
 * a fabricated combined logo. Used in two tasteful spots (just beneath the
 * hero, and again in the Final CTA) paired with a "prepared for" caption
 * supplied by the caller — deliberately never a merged/co-branded mark, so
 * it can't read as a formal partnership or shared ownership.
 */
export function InfuseLogoLockup({ infuseLogoSrc, className }: InfuseLogoLockupProps) {
  return (
    <div className={`infuse-logo-lockup${className ? ` ${className}` : ""}`}>
      <Image
        src="/tcrm/logos/archer-design-monogram.png"
        alt="Archer Design"
        width={86}
        height={52}
        className="infuse-logo-lockup-archer"
      />
      <span className="infuse-logo-lockup-divider" aria-hidden="true" />
      <Image
        src={infuseLogoSrc}
        alt="Infuse Hospitality"
        width={167}
        height={52}
        className="infuse-logo-lockup-infuse"
      />
    </div>
  );
}
