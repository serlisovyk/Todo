# Agent Instructions

This is the canonical instruction file for **every** AI agent working in this repo.
`CLAUDE.md` and any other tool-specific entry point point here — keep shared knowledge
in `ai/`, not duplicated per tool.

## Project

A one-page todo app built with React 19 (with the React Compiler) and Vite, in plain
JavaScript. Tasks live only in the browser — localStorage or IndexedDB behind a swappable
repository. No TypeScript, no state manager, no backend, no automated tests. Keep the code
clean, practical, accessible, and proportional to the project size.

- Repo: <https://github.com/serlisovyk/Todo>
- Tasks: Linear, project **Todo** (team `MY`, issues `MY-<n>`)

## Read First

- `ai/map.md` — where files and folders live, the storage keys, what the project
  deliberately does **not** have. Read it before exploring the code from scratch.
- The rules of the area you touch, in `ai/rules/`: `architecture.md` and `react.md` for
  code, `style.md` for JavaScript, JSX and CSS, `scope.md` for what not to add without an
  explicit request.
- `ai/rules/definition-of-done.md` — the gate before a change is handed over;
  `ai/rules/docs.md` — one fact one home, size limits, no history in docs.
- `ai/superpowers/` is the archive of past plans and specs: read only the plan or spec of
  the feature you change.

## Decisions

`ai/decisions/` records durable decisions and **why** they were made. Start from its
`README.md` index and read the records of what you touch, before proposing to change or
"restore" anything — rules say what to do now, decisions say why. Reversing one means a
new dated record, not editing the old one.

Propose a new record, without being asked, when a decision meets the criteria in that
`README.md`.

## Workflow

`ai/workflow.md` is the end-to-end flow for a Linear task: orient → plan (+ spec when
behavior changes) → implement → docs → verify → Definition of Done → self-review →
report → author approval → local merge into `main`.

The parts that never bend:

- Never commit task work directly on `main` — use a `my-<n>-<slug>` branch.
- Write a **plan** for anything non-trivial, and a **spec** when observable behavior
  changes, under `ai/superpowers/` — one commit, before any code.
- Nothing is merged and no issue is marked `Done` without the author's explicit
  approval.
- Merges happen locally into `main`, then `main` is pushed. No pull requests, and never
  a force-push of `main`.
- Never bypass a pre-commit hook (`--no-verify`).
- No automated tests — do not add them unless explicitly asked.

Prompts to start agent sessions live in `ai/prompts/` (index in `ai/prompts/README.md`):
`orchestrator.md` runs several tasks from one session, `task.md` runs a single task.
Linear issues follow `ai/linear-task-template.md`.

## Skills

Skill playbooks live in `ai/skills/` (tool-agnostic Markdown, index in
`ai/skills/README.md`):

- `feature` — which layer owns a feature's data, state, logic, markup and styles, and how
  they connect.
- `storage` — how to add a repository implementation and how to change the stored format.
- `review` — self-review for regressions, scope creep, accessibility, and docs drift.
- `og-image` — how to make a new link preview card and keep the favicon's colours in step with the accent.

If a change materially reshapes a pattern, update the matching skill in the same change
(`ai/rules/docs.md`).

## Working Principles

- Prefer small, focused changes.
- A feature lands in the layer that owns it (`ai/rules/architecture.md`): components never
  touch storage, state lives in a context, pure logic in `utils/`.
- Follow the existing folder structure, file naming and patterns.
- Do not add new abstractions unless they remove real duplication or clarify a boundary.
- Do not rewrite working code just to make it look different.
- Keep UI changes responsive, accessible, and consistent with the current visual language.
- If a request conflicts with these rules, follow the user's explicit request and mention
  the tradeoff.

## Project Defaults

- Package manager: `pnpm`, never npm or yarn; keep `pnpm-lock.yaml`, no other lockfile, and
  do not edit the lockfile by hand unless there is no safer option.
- Stack: React 19 with the React Compiler (`babel-plugin-react-compiler` through
  `@rolldown/plugin-babel`), Vite 8, JavaScript ESM (`.js`, `.jsx`), plain CSS per component
  with design tokens.
- Sources: `src/`; `index.html` at the repo root (Vite's entry); output in `dist/`.
- Formatting: Prettier (`.prettierrc`, the workspace config); `pnpm format` applies it.
- Linting: ESLint 10 flat config (`eslint.config.js`): React Hooks, React Refresh, `jsx-a11y`,
  and the rules that enforce `ai/rules/` (kebab-case file names, named exports, storage only in
  `src/storage/`); `eslint-config-prettier` last.
- Pre-commit: Husky + lint-staged run ESLint and Prettier on the staged files.
- CI: GitHub Actions runs lint, format check, build and size on every push — a post-push signal;
  a red `main` is fixed right away.

## Language

- Chat with the author in Russian.
- Code, comments, commit messages, specs, plans, prompts, and `ai/` docs stay in English.
- Linear issues are written in Russian, following `ai/linear-task-template.md`.

## Verification

Run before handing over any change:

```bash
pnpm lint
pnpm format:check
pnpm build
pnpm size
```

Then exercise the change in the browser (`pnpm dev`): desktop with keyboard and mouse,
and 320px wide, in both themes — a green build does not prove a UI change works. If a
check cannot be run, report that clearly.
