# /revstudio assets

Asset location for the Revstudio × Archer Design partnership page
(`app/revstudio/page.tsx`). Nothing here yet — the page currently reuses
existing repo assets and a live text lockup instead of image files. See
`REVSTUDIO_PARTNERSHIP_PAGE_SETUP.md` for the full breakdown.

## Currently used (already in the repo, not duplicated here)

- Archer Design mark: `/archer-preview/brand/ad-logo.png`
- Hero background: `/revenue-activation/media/background-winter.png`

## Expected final assets (place them in this folder when available)

- `revstudio-logo.svg` or `.png` — The Revstudio's real logo. **Not yet
  provided.** Until then, "The Revstudio" renders as styled text
  (`components/marketing/revstudio/JointPartnerHeader.tsx`), not an
  AI-generated approximation of a mark that doesn't exist yet.
- `joint-logo-lockup.svg` or `.png` — optional pre-composed lockup, once
  the real Revstudio mark exists. Not required — the header currently
  composes the Archer mark + Revstudio wordmark live in JSX.
- `hero-image.jpg` / `.png` — optional dedicated hero photo (hotel
  exterior, lobby, or operations image) if a better fit than the reused
  `background-winter.png` is preferred later.
- `ghisela.jpg`, `devon.jpg` — optional headshots for the About section,
  only if/when approved for public use. No bios or headshots are
  currently shown — see the setup doc for what's needed to add them.

Do not add AI-generated approximations of either company's logo here.
