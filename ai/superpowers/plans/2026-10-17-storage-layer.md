# Plan: the storage layer, a repository over localStorage (MY-149)

Branch `my-149-storage-layer`. Linear issue MY-149, milestone Ядро. The spec is
`ai/superpowers/specs/2026-10-17-storage-layer.md`. There is no UI in this task: nothing imports
the layer until the context (MY-150), so the bundle does not change.

## The author's answers (issue, «Решения автора», 2026-10-16)

All questions are answered, so the work goes from this commit to the code:

- The repository builds the task: `create(input)` sets `id`, `completed: false`, `createdAt`,
  `updatedAt` and resolves to the full task; `update(id, patch)` sets `updatedAt` and resolves to
  the updated task. The context awaits `create` and applies `update` and `remove` optimistically.
- The validator is strict: a field against the rules drops the whole task, extra fields are
  stripped. One shared validator in `utils/`; the import (MY-160) reuses it.
- Category colours are not in JavaScript: a constant holds `id` and label, the colour is
  `--color-category-<id>`.
- Constants in two files, `storage.constants.js` and `todos.constants.js`.
- `subscribe` returns an unsubscribe function and calls back with no arguments.
- `navigator.storage.persist()` runs once in `createRepository()`.
- No cache: every operation reads storage. A failed write rejects with an `Error` carrying
  `cause`; a failed read gives an empty list.
- Docs: a new skill `storage`, the storage recipe and bullet move out of `feature` into it; no new
  decision record; `repository-storage` and `todo-model` keep their status.

## Code

Layers and file names follow `structure-and-naming`; every new folder gets its `index.js`.

- `src/constants/` — `storage.constants.js`: `DATA_STORAGE_KEY` (`todo:data`),
  `DATA_FORMAT_VERSION` (`1`) and the messages the storage layer raises (an invalid task, a task
  that no longer exists, a refused write, `Not implemented`), so a class file holds only its
  imports and the class. `todos.constants.js`: `CATEGORIES` and `PRIORITIES` (lists of
  `{ id, label }`; priorities in ascending order) and `TITLE_MAX_LENGTH` (200).
- `src/utils/validation.utils.js` — `isPlainObject(value)` and `isIsoDate(value)`: general
  checks that know nothing about tasks, so any module can reuse them.
- `src/utils/todos.utils.js` — `sanitizeTodo(value)` returns a clean task or `null`;
  `sanitizeTodos(values)` returns the valid ones (an empty list for a non-array). The checks
  that belong to a task (a known id, a valid title) stay here. Pure: no React, DOM or storage.
- `src/storage/todo.repository.js` — `TodoRepository`: `list`, `create`, `update`, `remove` are
  `async` and reject with `Not implemented`; `subscribe` throws it. All five call one private
  method, `#throwNotImplemented()`. The methods declare no parameters: ESLint reports unused
  ones and comments are not allowed, so the signatures live in `ai/rules/architecture.md` and in
  the implementation.
- `src/storage/local-storage.repository.js` — `LocalStorageRepository`: a private `#read()`
  (`getItem`, `JSON.parse`, version check, `sanitizeTodos`; any failure gives `[]`) and `#write()`
  (`setItem` in a `try`, a failure becomes the readable `Error` with `cause`). `create` and
  `update` pass the built task through `sanitizeTodo` before writing, so nothing the reader would
  drop is ever stored. `update` puts `id`, `createdAt` and `updatedAt` after the patch, so a patch
  cannot change them. `remove` writes only when it removed something.
- `src/storage/create-repository.js` — `createRepository()` asks for persistent storage in its
  own first line (the request applies to every backend, so it is not part of a class) and returns
  a `LocalStorageRepository`. `src/storage/index.js` exports `createRepository` only:
  the classes are an implementation detail, and a sibling imports `todo.repository.js` directly.

### Deliberate choices

- **No `VITE_STORAGE` read yet.** The issue lists the switch, but with one implementation it
  would be a branch that cannot be taken (the `feature` skill: no placeholder for what does not
  exist). MY-159 adds `if (import.meta.env.VITE_STORAGE === 'indexeddb')` with the second class.
- **Unknown id in `update` rejects** with an `Error` instead of resolving `null`: it is a failed
  write like any other, and the context already rolls those back.
- **A date is valid only in the form `Date#toISOString` writes** (UTC, milliseconds, `Z`): a plain
  round-trip check, the format the app itself stores. A hand-written offset form is dropped.

## Docs

- New `ai/skills/storage.md` (skill `storage`): adding a repository implementation and changing
  the stored format (validator, version bump, migration table). The "A storage backend" recipe and
  the **Storage** bullet leave `ai/skills/feature.md`, which keeps one line pointing at it.
- Linked from `ai/skills/README.md`, the Skills list in `AGENTS.md` and "Where is the recipe" in
  `ai/map.md`.
- `ai/map.md`: `constants/`, `utils/` and `storage/` in Sources, the Storage section no longer says
  "not built yet" for localStorage.
- `ai/rules/style.md`: two reading rules the review of this task settled, which later tasks
  follow: blank lines around a multi-line statement and a guard, and the import order.
- Decisions: none new; `repository-storage` stays `accepted (not implemented)` until MY-159,
  `todo-model` is not flipped.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`.
- In `pnpm dev` (port 5181) through a temporary call that is never committed: create, read,
  update, remove; a reload keeps the tasks; `todo:data` broken by hand (bad JSON, a non-object,
  `version: 2`, one broken task among good ones) gives the right list and leaves the key as it was;
  two tabs: a change in one reaches the other through `subscribe`; `Storage.prototype.setItem`
  stubbed to throw `QuotaExceededError`: the promise rejects with the readable `Error` and a
  `cause`.
- The app shell renders unchanged (nothing imports the layer): there is no UI to check at 320px or
  in both themes.
