# Bundle size budgets: JavaScript 80 kB, CSS 8 kB (gzip)

Date: 2026-10-16 · Status: superseded by 2026-10-17-js-budget-90-kb.md

## Context

CI checks the bundle size so that a heavy dependency shows up in the push that adds it. When the
check was set up, the JavaScript was 67.9 kB gzip — almost all of it React and React DOM — and the
CSS was empty. The planned features add components, icons, the IndexedDB wrapper and styles.

## Decision

- `size-limit` with `@size-limit/file`, gzip sizes from `.size-limit.json`:
  - `dist/assets/*.js` — 80 kB;
  - `dist/assets/*.css` — 8 kB.
- The font gets its own budget, in raw bytes, when it is added.
- `pnpm size` runs after `pnpm build`, locally and in CI.

## Consequences

- A change that crosses a budget is questioned first (a lighter way, a smaller import); raising a
  budget is a new record with the reason.
- Rejected: no budget at all; brotli sizes (the reports and budgets read gzip).
