import Image from "next/image";
import { RevstudioContactTrigger } from "./RevstudioContactTrigger";

/** Joint footer for /revstudio, both companies, both sites, the
 *  independent-companies disclaimer required by the partnership brief. */
export function JointFooter() {
  return (
    <footer className="border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <Image
          src="/revstudio/media/trs-ad-logo.png"
          alt="The Revstudio x Archer Design"
          width={282}
          height={94}
          className="h-8 w-auto object-contain"
        />

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[var(--rv-ink-soft)]">
          <a href="https://therevstudio.co/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--rv-ink)]">
            therevstudio.co ↗
          </a>
          <a href="https://www.archerdesign.shop/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--rv-ink)]">
            archerdesign.shop ↗
          </a>
          <RevstudioContactTrigger className="hover:text-[var(--rv-ink)]">
            Contact
          </RevstudioContactTrigger>
          {/* No dedicated /privacy route exists on the site yet, routes to a
              direct question in the meantime. See setup doc. Left as a plain
              mailto: link intentionally — not a contact-modal CTA. */}
          <a href="mailto:hello@archerdesign.shop?subject=Privacy%20Question" className="hover:text-[var(--rv-ink)]">
            Privacy
          </a>
        </nav>

        <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--rv-ink-muted)]">
          The Revstudio and Archer Design are independent businesses. Services, responsibilities, fees, client
          ownership, and contracting structure are defined in writing for each engagement.
        </p>

        <p className="text-[11px] text-[var(--rv-ink-muted)]">© {new Date().getFullYear()} The Revstudio × Archer Design. All rights reserved.</p>
      </div>
    </footer>
  );
}
