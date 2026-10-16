# Plan: package.json and Prettier (MY-145)

Branch `my-145-package-prettier`. Linear issue MY-145, milestone Фундамент. No spec: nothing a user
sees changes.

## Changes

1. `package.json` by the workspace standard: fields in the order `name`, `version`, `description`,
   `author`, `type`, `scripts`, `dependencies`, `devDependencies`.
   - `name: "todo"`, `version: "1.0.0"`, `author: "Serhii Lisovyk"`, `type: "module"`.
   - `description`: "Todo app built with React, Vite, localStorage, and IndexedDB." — one sentence
     in the standard's shape, close to the future GitHub About text.
   - Drop `private: true`: the standard lists the fields a package has, and this one is never
     published.
   - Scripts with the standard's names, in its order: `dev`, `build`, `preview`, `lint`,
     `lint:fix`, `format` (`prettier . --write`), `format:check` (`prettier . --check`).
2. `prettier` as a dev dependency (`pnpm add -D`).
3. `.prettierrc` — the standard's config, unchanged. `.prettierignore` — `node_modules`,
   `pnpm-lock.yaml`, `dist`.
4. `pnpm format` over the whole repo in a commit of its own, so the formatting diff stays apart
   from the config.
5. `index.html` already has `lang="en"` and `<title>Todo</title>`: no change.
6. Docs: `pnpm format:check` joins "Verification" in `AGENTS.md` (the prompts read it from there),
   the merge commands in `ai/workflow.md` and the checks in `ai/linear-task-template.md`; Prettier
   goes into "Project Defaults"; `ai/map.md` lists the new config files and scripts.

`eslint-config-prettier`, Husky, lint-staged, CI and size-limit belong to MY-146.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`.
- `pnpm format` run twice changes nothing the second time.
- `pnpm dev` still serves the page.
