# Inter loads from `public/` with a preload, Arial as the fallback

Date: 2026-10-16 · Status: accepted

## Context

Inter is self-hosted (decision `ui-dependencies`). A font that arrives late either hides the text
or swaps it in. Considered: the font as a hashed asset imported from CSS, a static file per weight,
the Fontsource package as a dependency, and a metric-matched fallback face.

## Decision

- One file: the Latin subset of Inter Variable from Fontsource, `public/fonts/inter.woff2`. Its
  copyright and licence link live in the font's own metadata. One variable file instead of two
  static weights; the app still uses only the two weight tokens.
- `index.html` preloads it, so it usually arrives with the first paint; `font-display: swap`.
- The font stack is `'Inter', Arial, sans-serif`: plain Arial while Inter loads, no extra fallback
  face.
- `.size-limit.json` checks the raw size of the font.

## Consequences

- If the swap happens after the first paint, text set in Arial can shift slightly when Inter
  arrives; the preload keeps that rare.
- The stable URL is not content-hashed; a changed font needs a new file name to bust caches.
- Rejected: the Fontsource package as a runtime dependency, a hashed asset that cannot be preloaded
  from `index.html`, two static files, a metric-matched fallback face (kept simple instead).
