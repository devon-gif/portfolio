/** Joint footer for /revstudio — both companies, both sites, the
 *  independent-companies disclaimer required by the partnership brief. */
export function JointFooter() {
  return (
    <footer className="border-t border-[var(--rv-line)] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="font-serif text-[15px] text-[var(--rv-ink)]">
          The Revstudio <span className="text-[var(--rv-gold)]">×</span> Archer Design
        </p>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[var(--rv-ink-soft)]">
          <a href="https://therevstudio.co/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--rv-ink)]">
            The Revstudio
          </a>
          <a href="https://www.archerdesign.shop/" className="hover:text-[var(--rv-ink)]">
            Archer Design
          </a>
          <a href="mailto:hello@archerdesign.shop" className="hover:text-[var(--rv-ink)]">
            Contact
          </a>
          {/* No dedicated /privacy route exists on the site yet — routes to a
              direct question in the meantime. See setup doc. */}
          <a href="mailto:hello@archerdesign.shop?subject=Privacy%20Question" className="hover:text-[var(--rv-ink)]">
            Privacy
          </a>
        </nav>

        <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--rv-ink-muted)]">
          The Revstudio and Archer Design are independent businesses. Services, responsibilities, fees, and
          client ownership are defined in writing for each engagement.
        </p>

        <p className="text-[11px] text-[var(--rv-ink-muted)]">© {new Date().getFullYear()} Archer Design. All rights reserved.</p>
      </div>
    </footer>
  );
}
