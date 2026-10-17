# The theme head script is the one storage read outside `storage/`

Date: 2026-10-17 · Status: accepted

## Context

Every read of `localStorage` lives in `storage/`, and ESLint reports any other use. `theme-three-states`
needs the saved theme on `<html>` before the first paint, and React starts only after the page has
been parsed and painted: applying the theme from React would draw one frame in the wrong theme for
every user whose choice is not the default.

## Decision

- `public/theme.js` is a classic, blocking `<script src>` in `<head>`, before the stylesheet. A
  module or a `defer` script runs after the first paint and brings the flash back; a file, not an
  inline script, so ESLint and Prettier check it.
- It may do three things: read `todo:theme`, resolve anything but `light` and `dark` with
  `matchMedia('(prefers-color-scheme: dark)')`, and set `<html data-theme>` to `light` or `dark`. It
  never writes, reads another key or holds app logic. A read that throws falls back to the OS
  preference.
- Its key and values are literals, because files in `public/` are not bundled and cannot import the
  constants. They must equal `THEME_STORAGE_KEY` and the theme constants: a change to one is a
  change to the other.
- The exception is spelled out in `eslint.config.js`: the storage restriction covers every
  `**/*.{js,jsx}` except `src/storage/**` and `public/theme.js`, so any other file, a new one in
  `public/` included, is still checked.

## Consequences

- No frame of the built page is drawn in the wrong theme, with any saved value or none.
- The page pays one small blocking request before it paints.
- Rejected: setting the theme from React (the flash), a module or deferred script, an inline script
  (not linted), and bundling the script through Vite to share the constants (it would defer).
