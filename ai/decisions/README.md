# Decisions

Durable project decisions: why a choice was made, with a date. One decision per file, named
`YYYY-MM-DD-<slug>.md`. Format: a title, a `Date: … · Status: …` line, then `Context` →
`Decision` → `Consequences`; short and specific (about 30 lines, `ai/rules/docs.md`), rejected
alternatives with their reason, no check logs.

How this differs from `ai/rules/`: **rules** state what to do now (current law, rewritten as it
changes). **Decisions** state _why_, with a date. A record's text is not rewritten or deleted; only
its `Status` line changes.

The point: an agent (or a human) does not relitigate settled questions or "helpfully" restore
something that was deliberately rejected.

## Status

- `accepted` — in force and built.
- `accepted (not implemented)` — agreed now, built by a later task; that task sets it to `accepted`.
- `superseded by <file>` — replaced by a newer record.

## Changing a decision

A refinement or a reversal is a **new record** that restates what stays in force, so the reader
needs only the newest one. The old record only changes its `Status` line to
`superseded by <file>`.

## When to add a record

Propose one as soon as the decision surfaces, without being asked, and only for:

- a standing constraint ("we will not do X", "always / never Y");
- a feature the author deliberately rejected — all of them go into `rejected-features`;
- a tradeoff accepted over a named alternative, one a future agent would likely undo;
- a goal agreed now and built later (`accepted (not implemented)`);
- a convention chosen where an obvious alternative existed.

Not decisions: one-off task details, plain current-state facts, a choice nobody would reverse,
anything `ai/rules/` and `ai/map.md` already cover. Do not create noise records.

## Records

### Project and process

- [React 19 and Vite in plain JavaScript, no TypeScript](2026-10-16-react-and-javascript.md)
- [No automated tests](2026-10-16-no-automated-tests.md)
- [pnpm is the package manager](2026-10-16-pnpm.md)
- [Merge locally into `main`, no pull requests](2026-10-16-local-merge-without-pr.md)
- [Deployed on Vercel through its Git integration](2026-10-16-vercel-deploy.md)
- [Bundle size budgets: JavaScript 90 kB, CSS 8 kB (gzip)](2026-10-17-js-budget-90-kb.md)
- [`eslint-plugin-jsx-a11y` runs on ESLint 10 through an allowed peer](2026-10-16-jsx-a11y-on-eslint-10.md)
- [Features the author rejected](2026-10-16-rejected-features.md)

### Code structure, state and storage

- [Flat folders by role, kebab-case files with role suffixes, barrels and `@/`](2026-10-16-structure-and-naming.md)
- [A context is a folder: object, provider and hook; only the last two are public](2026-10-17-context-folders.md)
- [App state in Context and custom hooks on `useState`](2026-10-16-state-in-context-and-hooks.md)
- [Storage errors are shown as toasts by the provider that raises them](2026-10-17-errors-as-toasts.md)
- [Storage behind a `TodoRepository` base class, with `restore` for Undo](2026-10-17-repository-storage-restore.md)
- [Helpers shared by repositories are ordinary methods of the base class](2026-10-17-shared-repository-helpers.md)
- [A task has a title, a fixed category and a priority; no due date](2026-10-16-todo-model.md)
- [Backup by JSON export and import, in a row of its own, merged by id](2026-10-17-backup-export-import.md)

### Interface and look

- [Category and sort are two pills under the search field, Reset is an icon; filters in the URL](2026-10-18-filter-pills.md)
- [The `/` shortcut stays a single-key shortcut that cannot be turned off](2026-10-17-search-shortcut-key.md)
- [The Undo toast keeps its 5-second limit, a conscious deviation from WCAG 2.2.1](2026-10-18-undo-toast-time-limit.md)
- [The footer counts and acts on all tasks, not on the filtered list](2026-10-17-footer-acts-on-all-tasks.md)
- [Plain CSS per component with design tokens, palette "Ink and indigo"](2026-10-16-plain-css-and-tokens.md)
- [Design tokens: semantic names, two borders, category and priority shades per theme](2026-10-16-design-tokens.md)
- [`lucide-react` icons, self-hosted Inter, an own toast](2026-10-16-ui-dependencies.md)
- [Native `<select>`s for fixed pickers; the open list styled with `base-select`](2026-10-17-base-select-pickers.md)
- [The edit form has Save and Cancel icon buttons](2026-10-17-edit-form-buttons.md)
- [Tooltips are the `title` attribute, placed where it adds no second description](2026-10-17-tooltips-as-title.md)
- [Inter loads from `public/` with a preload, Arial as the fallback](2026-10-16-inter-font-loading.md)
- [Theme: light, dark or system, set before the first paint](2026-10-16-theme-three-states.md)
- [The theme head script is the one storage read outside `storage/`](2026-10-17-theme-head-script.md)
- [The list moves with CSS only: `@starting-style` for a new task, transitions for a checked one](2026-10-18-list-motion-without-view-transitions.md)
- [Accessibility and SEO: WCAG 2.2 AA, Lighthouse 100](2026-10-16-accessibility-and-seo.md)
