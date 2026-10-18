# Vercel deploys with no `vercel.json`; the link preview is a render of the app's list

Date: 2026-10-18 · Status: accepted

## Context

`vercel-deploy` planned a `vercel.json` that pins the build and answers 404. The author deployed the app from GitHub
as it was, at <https://todo-plum-nu-78.vercel.app/>: Vercel's Vite preset builds `dist/`, pnpm comes from the
lockfile, and a path with no file already gets a real 404, because no rewrite exists. `accessibility-and-seo` asks
for the SEO tags, a preview image, a favicon, `robots.txt`, `llms.txt` and a real 404.

## Decision

- Vercel through its Git integration, as in `vercel-deploy`: a push to `main` is production, other branches get
  previews. The project is the author's; agents never recreate, reconnect or reconfigure it.
- No `vercel.json`: nothing needs pinning. One is added only for something the platform cannot do alone, and never
  with `rewrites` that send unknown paths to `index.html`: the app has no router and the 404 must stay a 404. No
  custom `404.html` either.
- The public address is written out as the canonical, `og:url` and the absolute `og:image` of `index.html`, and in
  `llms.txt`; a new domain changes those. A filtered address (the query string) names the root as canonical.
- The preview shows the app itself: its own task list card, half in the dark theme and half in the light one, cut
  by a diagonal, with the header logo and the author's name. It is rendered by headless Chrome from the repo's
  tokens and component stylesheets, not a screenshot of a running page, and it holds only the list card, so a change
  to the forms, the toolbar or the header leaves it true. No source is stored; the skill `og-image` says how to
  make it again.
- The favicon is an SVG whose accent follows `prefers-color-scheme`, with two literals equal to `--color-accent`, as
  `theme.js` holds literals. `robots.txt` allows all and names no sitemap (one page); `llms.txt` describes the app.

## Consequences

- A new palette, list card or author name means making the card again; a new palette also means the favicon's two
  colours.
- A branch preview points at the production card by its absolute URL, which exists after the merge.
- Rejected: a `vercel.json` that repeats the preset; a custom 404 page (the status is already right); a card of a
  logo and a tagline (it shows nothing of the app); a screenshot of the whole page; an image built at deploy time by
  a package such as `satori` (a dependency and a build step for an image that rarely changes); stored card sources
  (a template to keep in step with the palette, for an image that changes about once a year); an apple-touch-icon
  (the app is not a PWA, the favicon covers the tab); `favicon.ico`, a web manifest (`scope.md`) and a sitemap.
