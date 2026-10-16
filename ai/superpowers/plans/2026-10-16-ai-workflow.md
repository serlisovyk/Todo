# Plan: AI workflow (MY-144)

Branch `my-144-ai-workflow`. Linear issue MY-144, milestone Фундамент.

## Goal

Give every agent one entry point (`AGENTS.md`) and the project docs in `ai/`, following the
workspace «Стандарт проекта», written for React. Record every decision of the
2026-10-16 planning, so later tasks neither guess nor relitigate them. No app code, no tooling.

## Files

- `AGENTS.md` — the project, what to read first, workflow rules that never bend, defaults,
  languages, verification. `CLAUDE.md` — `@AGENTS.md` plus a short orientation.
- `ai/map.md` — the repo as it is now, the agreed `src/` layout, storage keys, what the project
  does not have.
- `ai/workflow.md` — the 13 steps of the standard, with `pnpm`, parallel work in worktrees and
  the local merge.
- `ai/rules/` — `architecture.md`, `react.md`, `style.md`, `scope.md`, `docs.md`,
  `definition-of-done.md` (accessibility included).
- `ai/decisions/` — `README.md` index and one dated record (2026-10-16) per planning decision:
  React and JavaScript, no tests, pnpm, state in Context and hooks, structure and naming,
  storage behind a repository, the todo model, plain CSS with tokens, UI dependencies, the
  three-state theme, filters and search, list animations, export and import, accessibility and
  SEO level, local merge without PRs, Vercel, rejected features. Records for work a later task
  builds are `accepted (not implemented)`.
- `ai/skills/` — `README.md`, `feature.md`, `review.md`.
- `ai/prompts/` — `README.md`, `orchestrator.md`, `task.md` from the standard's templates with
  the project's values filled in.
- `ai/linear-task-template.md` — the structure of the Todo issues in Linear.
- `ai/superpowers/specs/.gitkeep`; this plan opens `ai/superpowers/plans/`.
- `.gitignore` — `.claude/worktrees/`.

## Approach

- Follow the shape the standard gives `ai/`; write the rules from the React decisions agreed in
  planning (Context + hooks on `useState`, flat folders, kebab-case files
  with role suffixes, barrels, `@/`).
- The code does not exist yet: rules and the `feature` skill state the agreed pattern; the map
  marks the layout the Фундамент tasks create. Commands that MY-145 and MY-146 add are listed
  where the workflow needs them, with the task that brings them.
- Commits: plan; entry points; map and workflow; rules; decisions; skills; prompts and the
  Linear template.

## Verification

- `pnpm lint`, `pnpm build` (the only checks that exist yet).
- A script checks that every relative link between the docs resolves.
- Line and size limits of `ai/rules/docs.md`.
- Walk `ai/rules/definition-of-done.md`, then the `review` skill over the diff.
