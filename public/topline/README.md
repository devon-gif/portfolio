# /public/topline — assets for the Topline proposal microsite (/topline)

Private, personalized proposal page for Topline Revenue Management.
Nothing here is linked from the main site nav, sitemap, or portfolio.

## Folders and public URL conventions

Files placed in these folders are served by Next.js at the matching URL:

| Folder        | Public URL prefix        | Use for                                        |
|---------------|--------------------------|------------------------------------------------|
| `images/`     | `/topline/images/...`    | Stills, campaign visuals, property photography |
| `videos/`     | `/topline/videos/...`    | Motion samples (mp4, muted/playsInline)        |
| `logos/`      | `/topline/logos/...`     | Official supplied logos only                   |
| `documents/`  | `/topline/documents/...` | PDFs (scope docs, one-pagers) for download     |

Example: `public/topline/images/hero.jpg` → `https://archerdesign.shop/topline/images/hero.jpg`

## Topline logo

Do NOT fabricate or download a Topline logo. The page renders a clean
"Prepared for / TOPLINE" text wordmark until an official file supplied by
Topline is placed at:

    public/topline/logos/topline-logo.svg

Once that file exists, the header (app/topline/components/ToplineHeader.tsx)
switches to it automatically — see `hasToplineLogo` in app/topline/page.tsx.

## Notes

- Keep video files small and web-optimized; the page lazy-loads media below
  the fold and expects `muted` + `playsInline` sources.
- URL-encode spaces if you must use them in filenames (prefer kebab-case).
