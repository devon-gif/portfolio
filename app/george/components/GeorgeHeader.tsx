/**
 * Minimal, quiet header for the /george private creative preview.
 *
 * This is not the standard Archer Design site nav and intentionally has no
 * multi-item navigation menu, since the page beneath it is a single short
 * scroll rather than a multi-section proposal (contrast with the fuller
 * app/topline/components/ToplineHeader.tsx, which still needs in-page
 * section links). A server component -- no interactivity, no hamburger menu,
 * since there is nothing here that needs one.
 */
export function GeorgeHeader() {
  return (
    <header className="gg-header">
      <div className="gg-shell flex flex-wrap items-center justify-between gap-3 py-4">
        <a
          href="#top"
          className="gg-logo-group"
          aria-label="The George, prepared with Archer Design, top of page"
        >
          <span className="gg-logo-mark">
            The George <span className="gg-logo-x" aria-hidden="true">&times;</span> Archer Design
          </span>
        </a>

        <div className="flex items-center gap-5">
          <span className="gg-header-tag">Private creative preview</span>
          <a
            href="mailto:hello@archerdesign.shop?subject=The%20George%20Creative%20Preview"
            className="gg-header-cta"
          >
            Contact Devon
          </a>
        </div>
      </div>
    </header>
  );
}
