# Plan: ESLint, Husky, lint-staged and CI (MY-146)

Branch `my-146-eslint-husky-ci`. Linear issue MY-146, milestone Фундамент. No spec: nothing a user
sees changes.

## ESLint

- Add `eslint-plugin-jsx-a11y` (its flat `recommended`), `eslint-plugin-check-file` and
  `eslint-config-prettier`, the last one last in the config.
- `src/` rules:
  - file names kebab-case, middle extensions ignored (`todos.context.jsx` passes); folder names
    kebab-case;
  - no default export (`no-restricted-syntax` on `ExportDefaultDeclaration`); root configs keep
    theirs, the tools need them;
  - `localStorage` and `indexedDB` (bare or through `window` / `globalThis`) are errors outside
    `src/storage/`. The theme head script gets its exception with the theme task.
- `.claude/` joins the global ignores: agent worktrees are full copies of the repo.
- The scaffold must pass the new rules: `src/App.jsx` becomes `src/app.jsx` with a named `App`
  export, and `main.jsx` imports it by name. Moving it into `components/` stays with MY-147, as
  does the `../` import rule.
- `eslint-plugin-jsx-a11y` 6.10.2 declares ESLint up to 9 as its peer, while the repo is on ESLint 10. A probe file showed its rules work (click handler on a `div`, `img` without `alt`, `a`
  without `href`, a label without a control). Allow the peer in `pnpm-workspace.yaml`
  (`peerDependencyRules.allowedVersions`) so the install stays clean, and record the tradeoff.

## Pre-commit

- `husky` and `lint-staged`; `"prepare": "husky"`; `.husky/pre-commit` runs `pnpm lint-staged`.
- `.lintstagedrc.json`: `*.{js,jsx}` → `eslint --fix`, `prettier --write`;
  `*.{css,html,json,md,yml}` → `prettier --write`.

## Bundle size

- `size-limit` + `@size-limit/file`, script `size`, `.size-limit.json` with gzip budgets for
  `dist/assets/*.js` and `dist/assets/*.css`.
- Today the JS is 68.7 kB gzip (React and React DOM) and the CSS is empty. Budgets: JS 80 kB, CSS
  8 kB — room for the planned features, small enough to catch a heavy dependency. The font budget
  arrives with the font. Recorded as a decision.

## CI

`.github/workflows/ci.yml` as in the standard, on pnpm: every push, `contents: read`, concurrency per
ref, `HUSKY: 0`; `actions/checkout@v7`, `pnpm/action-setup@v6` (pnpm 12), `actions/setup-node@v7`
(Node 22, `cache: pnpm`); `pnpm install --frozen-lockfile`, lint, format check, build, size.

## Docs

- `AGENTS.md`: `pnpm size` under Verification; pre-commit and CI under Project Defaults.
- `ai/workflow.md`: the pre-commit hook in step 6, the merge commands and the CI check in step 13.
- `ai/linear-task-template.md`: `pnpm build` + `pnpm size`.
- `ai/map.md`: the new config files, the hook, CI, the scripts.
- `ai/rules/`: what ESLint now enforces (architecture, style, react).
- `ai/decisions/`: bundle-size budgets; the jsx-a11y peer override.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`; `pnpm install --frozen-lockfile`.
- Probe files (not committed) prove each new rule: a PascalCase file name, a default export,
  `localStorage` outside `storage/` and inside it, a click handler on a `div`.
- A commit with a lint error and one with an unformatted file are rejected by the hook.
- Push the branch and confirm the CI run is green.
