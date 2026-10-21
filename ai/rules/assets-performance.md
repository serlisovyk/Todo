# Assets and Performance Rules

What holds for the font, `public/`, the page metadata and the size of the build. Why: decisions `ui-dependencies`,
`inter-font-loading`, `vercel-and-link-previews` and `js-budget-90-kb`. Making the preview card again:
`ai/skills/og-image.md`. Where the files are: `ai/map.md`.

## Font

- Inter is self-hosted: one Latin-subset variable `woff2` in `public/fonts/`, declared in `styles/base.css` with
  `font-display: swap`. No font CDN and no second face.
- `index.html` preloads it with `as="font"`, `type="font/woff2"` and `crossorigin`; a font preload without
  `crossorigin` makes the browser fetch the file twice.
- The URL is not hashed: a changed font gets a new file name, in the preload and in `base.css`.

## `public/`

- `public/` holds only files that need a stable URL: the head script `theme.js`, the font, `favicon.svg`, the preview
  card `og-image.png`, `robots.txt` and `llms.txt`. Anything else is imported from `src/`, so the build hashes it.
- `robots.txt` allows all and names no sitemap; `llms.txt` describes the app.
- `favicon.svg` cannot read custom properties: its two stroke colours are literals equal to `--color-accent` on `:root`
  and on `:root[data-theme='dark']` in `tokens.css`.

## Page metadata

- Every address in `index.html` is absolute and on the production domain: the canonical, `og:url`, `og:image` and
  `twitter:image`. `llms.txt` names the same address, and a new domain changes all of them.
- `og:image:width` and `og:image:height` are the pixel size of the file, and `og:image:alt` says what the card shows.
- `twitter:*` repeats `og:*` and changes with it: title, description, image and alt.
- The card is under 200 kB and outside the size budgets: `.size-limit.json` does not measure it.
- The metadata is true: it names only what the app does today, and `description`, `og:description` and
  `twitter:description` are one text. A change to what the app does or looks like updates them, `llms.txt` and the card.

## Bundle and third parties

- No third-party runtime scripts and no font CDN: the only scripts are the module entry and `public/theme.js`.
- No sitemap and no web app manifest (one page, not a PWA) unless the author asks.
- No source maps in the production build: `vite.config.js` sets no `build.sourcemap`, so `dist/` holds no `.map` file.
- The budgets in `.size-limit.json` cover the JavaScript, the CSS and the font; `pnpm size` runs after `pnpm build`,
  locally and in CI. A change that crosses one is questioned first: a lighter way, a smaller import.
- A budget is raised only on purpose, in the task that needs it, with a new decision record that gives the reason. The
  comparison is the production build before and after (`pnpm build`, `pnpm size`), never the source.
