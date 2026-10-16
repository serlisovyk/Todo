# Plan: src structure, the `@/` alias and barrels (MY-147)

Branch `my-147-src-structure`. Linear issue MY-147, milestone Фундамент. No spec: the page looks
and works the same.

## Changes

1. Move the scaffold into the agreed layout (decision `structure-and-naming`):
   - `src/app.jsx` → `src/components/app/app.jsx` (the named `App` export stays);
   - `src/components/app/index.js` re-exports `App` from `./app.jsx`, and
     `src/components/index.js` re-exports it from `./app`: every folder, a component's folder
     too, has its barrel (asked by the author in review);
   - `src/index.css` → `src/styles/base.css`;
   - `src/main.jsx` stays the entry point and imports `App` from `@/components` and the base
     styles from `@/styles/base.css`.
2. No `app.css` yet: the component has no styles, and the rules allow no empty placeholders. Its
   stylesheet appears with its first rule.
3. Alias `@/` → `src/`: `resolve.alias` in `vite.config.js`; `jsconfig.json` with `paths` (and
   `include: ["src"]`) so VS Code completes and follows `@/` imports.
4. ESLint in `src/`, through `no-restricted-imports`:
   - an import that climbs out of its folder (`../…`) is an error — use `@/`;
   - a module importing its own folder's barrel (`./index.js`, `.`) is an error — import the
     sibling file.
5. `styles/` has no `index.js`: it holds CSS that is imported by path. The style rule says
   "every folder of JavaScript modules".
6. No other scaffold leftovers remain (`public/` and the template's assets are already gone).

## Docs

- `ai/map.md` — the real `src/` today and the alias files.
- `ai/rules/style.md` — the barrel rule for JavaScript folders, the alias, what ESLint enforces.
- `ai/skills/feature.md` — where a new file goes and how it is exported.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`.
- Probe files (not committed) prove both import rules.
- `pnpm dev` in the browser: the page renders "Todo" with no console errors.
