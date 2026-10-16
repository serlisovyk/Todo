# Plan: design tokens, base styles and Inter (MY-148)

Branch `my-148-tokens-inter`. Linear issue MY-148, milestone Фундамент. No spec: the page shows the
same text, now on the token palette and in Inter.

## Tokens — `src/styles/tokens.css`

Light values on `:root`, dark on `:root[data-theme='dark']`, `color-scheme` in both, no
`prefers-color-scheme` block (decision `plain-css-and-tokens`). Semantic names:

- `--color-page`, `--color-surface`, `--color-surface-hover`, `--color-text`, `--color-text-muted`,
  `--color-border` (dividers, decorative), `--color-border-control` (inputs and checkboxes, 3:1),
  `--color-accent`, `--color-on-accent`, `--color-focus`, `--color-highlight`,
  `--color-on-highlight`;
- `--color-category-{work,personal,study,shopping,health}`,
  `--color-priority-{high,medium,low}`;
- scales: `--space-1…12` (4px steps up to 48px), `--radius-{sm,md,lg,full}`,
  `--font-size-{xs,sm,md,base,lg}`, `--font-weight-{regular,medium}`, `--line-height-{tight,base}`,
  `--duration-{fast,base,slow}`, `--ease-out`, `--focus-ring-{width,offset}`, `--touch-target`
  (44px), `--content-max-width`.

The author's four palette values per theme stay as given. Contrast, by the WCAG formula (script in
the report):

- `--color-text-muted` light is `#65656f`, not the mockup's `#6b6b76`: that one is 4.47:1 on the
  hover surface;
- a separate `--color-border-control` (`#8a8a95` / `#6a6a77`, 3.1–3.6:1), because the decorative
  border (1.3:1) cannot outline a field;
- category and priority colours take a darker shade in light and a lighter one in dark, each at
  least 3:1 on page and surface. Study moves from amber to violet and Health from violet to green,
  so the medium priority (amber) and the categories do not share a hue.

## Base styles — `src/styles/base.css`

Box sizing, `body` (page colour, text colour, Inter, base size and line height, tabular digits),
form controls inherit the font, one `:focus-visible` outline in `--color-focus`, `.sr-only`.
`main.jsx` imports `tokens.css`, then `base.css`.

Changed in review by the author: `styles/style.css` imports both, and `main.jsx` imports only it,
after `App`; media queries are written without `=` (`width < 480px`).

## Inter

- `public/fonts/inter-latin-wght.woff2` — the Latin subset of Inter Variable 5.3.0 from Fontsource
  (48 KB), and `public/fonts/OFL.txt`, the licence it ships with.
- `@font-face` in `base.css`: weights 100–900 from one variable file, `font-display: swap`, the
  Latin `unicode-range`. The app uses 400 and 500 only, through the weight tokens.
- `<link rel="preload" as="font" crossorigin>` in `index.html`, so the font arrives with the first
  paint.
- An `Inter Fallback` face on local Arial with metric overrides (`size-adjust`, `ascent-override`,
  `descent-override`, `line-gap-override`) keeps the text the same size before and after the
  swap: no layout jump.
- `.size-limit.json`: a raw-bytes budget for `dist/fonts/*.woff2`.
- Recorded as a decision (public folder + preload + fallback metrics, one variable file).

Changed in review by the author: the file is `public/fonts/inter.woff2`, no `OFL.txt` (the font's
metadata carries its copyright and licence link), no `unicode-range` (one file covers all the
text), and no fallback face — the stack is `'Inter', Arial, sans-serif`.

## App shell

`components/app/app.css`: the page container on tokens (max width, centred, padding from the
spacing scale). `App` renders `<main className="app">`. The header and the heading belong to the
form task.

## Docs

`ai/map.md` (`public/`, the style files, `app.css`), `ai/rules/style.md` (token names and scales),
decisions: a new record for the tokens and their contrast, one for loading Inter;
`plain-css-and-tokens` becomes `accepted`.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`.
- Contrast script: every pair above in both themes.
- `pnpm dev` in the browser: `data-theme="dark"` on `<html>` repaints everything; 320px and
  desktop; the font comes from the app's origin; the same text measures the same width in Inter
  and in the fallback.
