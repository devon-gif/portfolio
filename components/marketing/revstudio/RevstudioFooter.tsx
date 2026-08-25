import { REVSTUDIO_CONTACT_EMAIL } from "@/lib/revstudio";

const FOOTER_NAV = [
  { href: "#model", label: "The model" },
  { href: "#services", label: "Services" },
  { href: "#agencies", label: "For agencies" },
  { href: "#hotels", label: "For hotels" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

/** Standalone Revstudio footer. Archer Design appears once, as an
 *  acknowledgement of the optional activation-layer relationship described
 *  in the page body — never presented as a merger or as the primary focus.
 *  No social links: none are verified/approved for public use yet. */
export function RevstudioFooter() {
  return (
    <footer className="border-t border-[var(--rv-line)] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="font-serif text-[15px] text-[var(--rv-ink)]">The Revstudio</p>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[var(--rv-ink-soft)]">
          {FOOTER_NAV.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--rv-ink)]">
              {item.label}
            </a>
          ))}
          <a href={`mailto:${REVSTUDIO_CONTACT_EMAIL}`} className="hover:text-[var(--rv-ink)]">
            Contact
          </a>
          {/* No dedicated /privacy route exists on the site yet — routes to a
              direct question in the meantime. */}
          <a href={`mailto:${REVSTUDIO_CONTACT_EMAIL}?subject=Privacy%20Question`} className="hover:text-[var(--rv-ink)]">
            Privacy
          </a>
        </nav>

        <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--rv-ink-muted)]">
          The Revstudio may coordinate with Archer Design, an independent hospitality creative studio, when a commercial
          priority also calls for guest-facing campaign work. The two remain separate businesses — services,
          responsibilities, fees, and client ownership are defined in writing for each engagement.
        </p>

        <p className="text-[11px] text-[var(--rv-ink-muted)]">© {new Date().getFullYear()} The Revstudio. All rights reserved.</p>
      </div>
    </footer>
  );
}
