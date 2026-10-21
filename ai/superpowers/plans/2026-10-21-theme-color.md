# Plan: theme-color from the first load (MY-174)

Branch `my-174-theme-color`. Linear issue MY-174. It runs alone. There is no separate spec: the one observable change, the
address bar colour on a first load, is in "Behaviour" below.

## The problem

`index.html` carries `<meta name="theme-color" content="" />`. `ThemeProvider` fills it in an effect, with the computed
`--color-page`, so the colour exists only once React has started. Until then a phone's address bar is not the page colour.

## The author's decisions

- `index.html` gets two static metas in place of the empty one: `media="(prefers-color-scheme: light)"` with `#f4f4f6`
  and `media="(prefers-color-scheme: dark)"` with `#0e0e11`, the `--color-page` of each theme in `tokens.css`.
- `ThemeProvider` writes the resolved theme's page colour into **both** metas, found with `querySelectorAll`, and leaves
  their `media` alone. Both then carry the chosen theme's colour, so a chosen theme that differs from the system one still
  wins over the media query.
- `public/theme.js` is not touched (decision `theme-head-script`: it sets `data-theme` and nothing else). When the saved
  theme differs from the system one, the metas show the system colour for the few milliseconds before React starts. That
  is accepted.
- The duplicated colour is documented in one line in `ai/rules/style.md` and one in `ai/rules/assets-performance.md`,
  in the style of the `favicon.svg` line. No new decision record: the decisions `theme-three-states` ("`theme-color`
  follows the theme") and `theme-head-script` still hold as written.

## Behaviour

- First load, nothing saved: the address bar is the system theme's page colour from the first byte of the HTML.
- First load, a saved theme equal to the system one: the same.
- First load, a saved theme different from the system one: the system colour until React starts, then the saved theme's.
- Every later change (the theme switch, "system" following the OS live): both metas hold the resolved theme's colour at
  once, through the same effect as `data-theme`.

## Code

- `index.html` — the two metas.
- `src/context/theme/theme.provider.jsx` — the effect sets `content` on every match of `THEME_COLOR_META_SELECTOR`
  (`querySelectorAll`, one loop). No new constant, no new name.

## Docs

- `ai/rules/style.md` — a line under "Colours only through tokens".
- `ai/rules/assets-performance.md` — a line in "Page metadata".
- `ai/map.md` — the `index.html` line and the `context/theme/` line: two metas, both rewritten by the provider.

## Out of scope

A change to `theme.js`, a hex literal in JavaScript, a build step that writes the colours into the HTML, a web app
manifest.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`: report the sizes.
- Headless Chrome over the DevTools protocol against `pnpm preview`, `prefers-color-scheme` emulated light and dark:
  - the raw served HTML: both metas, their `media` and `content`;
  - the DOM after load with nothing saved, the saved theme equal to the system one, a saved `dark` under a light system
    and a saved `light` under a dark system: both metas, each time;
  - the switch back and forth, and "system" following the emulated scheme;
  - screenshots at desktop size and 320px in both themes: nothing visual changed.
- Then `ai/rules/definition-of-done.md`, the `review` skill, and the whole `git diff main..HEAD` read line by line against
  `ai/rules/style.md` and `ai/rules/react.md`.
