# Plain CSS per component with design tokens, palette "Ink and indigo"

Date: 2026-10-16 · Status: accepted (not implemented)

## Context

Considered: Tailwind, CSS Modules, plain CSS. CSS Modules rename `@keyframes`, which conflicts with
the workspace rule that every keyframe lives in one file. Three palettes were mocked up: Warm paper,
Ink and indigo, Sage.

## Decision

- Plain CSS with native nesting, one stylesheet per component imported by it; class names start
  with the component's name.
- Tokens in `styles/tokens.css`: light values on `:root`, dark ones on `:root[data-theme='dark']`;
  no `prefers-color-scheme` block — JS decides the theme once (decision `theme-three-states`).
- Ink and indigo. Light: page `#f4f4f6`, surface `#ffffff`, text `#18181b`, accent `#5b5bd6`.
  Dark: page `#0e0e11`, surface `#18181c`, text `#ededf0`, accent `#8b8cf8`.
- More air than the first mockup: spacing comes from a `--space-*` scale.
- The search highlight is a yellow marker with dark text in both themes.

## Consequences

- A new colour gets a light and a dark value and a contrast check in both themes.
- Rejected: Tailwind, CSS Modules, CSS-in-JS, the Warm paper and Sage palettes.
