import Link from "next/link";
import { CALENDLY_URL } from "@/lib/seo";

type Props = {
  heading?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  showIntro?: boolean;
};

/**
 * Shared light-theme final CTA band for Archer Studio marketing pages.
 * Defaults to the homepage's "send a property link" message; pass overrides
 * for page-specific copy.
 */
export function StudioCTA({
  heading = "Want to see what your existing assets could become?",
  body = "Send a property, restaurant, event, spa, or campaign link and we'll take a practical look at where stronger creative could support your team.",
  primaryLabel = "Send a property link",
  primaryHref = "/contact",
  showIntro = true,
}: Props) {
  return (
    <section className="px-6 pb-24 pt-4">
      <div className="mx-auto max-w-4xl">
        <div className="st-card p-10 text-center md:p-14">
          <h2 className="mx-auto max-w-2xl font-serif text-[clamp(28px,4vw,46px)] leading-[1.08] text-[var(--st-ink)]">
            {heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
            {body}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={primaryHref} className="st-btn">
              {primaryLabel} <span aria-hidden>→</span>
            </Link>
            {showIntro && (
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="st-btn-ghost"
              >
                Book a quick intro
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
