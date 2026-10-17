---
name: storage
description: Use when adding a TodoRepository implementation (a storage backend) or changing the stored format of the tasks in the Todo app — the validator, the format version and the migration table.
---

# Storage

## When to use

- A new class that extends `TodoRepository`.
- A change to what is stored: a new field, or a different meaning or range of an existing one.

What must hold is in `ai/rules/architecture.md` (Storage); why it is shaped so is in the decision
`repository-storage-restore`. A feature that only reads and writes tasks through the repository does not
need this skill: see `feature`.

## A repository implementation

1. A class in `storage/` that extends `TodoRepository` (imported from its file, never through the
   barrel) and implements all six operations. The signatures are in `architecture.md`; every
   operation returns a promise and none throws synchronously, except `subscribe`.
   - `list()` reads the data afresh on every call, keeps no copy in memory, and runs every record
     through `sanitizeTodos`. A failed read, unreadable data or an unknown version is an empty
     list, never an exception. Nothing is written at start, and a read never writes.
   - `create(input)` builds the whole task (`id`, `completed: false`, both timestamps), passes it
     through `sanitizeTodo`, writes it and resolves to it.
   - `update(id, patch)` merges the patch, keeps `id` and `createdAt`, sets `updatedAt`, validates,
     writes and resolves to the updated task. An unknown `id` rejects.
   - `remove(ids)` ignores ids that are not stored and writes only when it removed something.
   - `restore(todos)` writes tasks back exactly as given (same `id`, `createdAt`, every field),
     each through `sanitizeTodo`: an invalid one rejects and nothing is written. It skips ids that
     are already stored, writes only when something was missing, and resolves to nothing.
   - `subscribe(onExternalChange)` calls it with no arguments when another tab changes the data,
     and returns the function that stops the listening. A tab's own writes do not call it.
   - A write the browser refuses rejects with a readable `Error` whose `cause` is the original.
     The error messages are in `storage.constants.js`: reuse them, so every implementation says
     the same.
2. `createRepository()` returns the localStorage implementation by default; the new one is picked
   there by `import.meta.env.VITE_STORAGE`. Only `createRepository` is exported from the folder.
3. Contexts and components do not change. The map's Storage section gets the new storage.

## A change to the stored format

- **A new field with a safe default** — `sanitizeTodo` in `utils/` fills the default for older
  data. Every implementation and the import use that one validator, so nothing else changes and
  the format version stays.
- **A field that means or allows something else** (a rename, a stricter or looser range, a new
  required field with no default):
  1. Bump the format version in `storage.constants.js`.
  2. Add a step to the migration table, keyed by the version it starts from. A step is a pure
     function from that version's data to the next one's, so the table lives in `utils/`: the
     import reuses it. The reader applies the steps from the stored version up to the current one
     before validating; a version above the current one still reads as an empty list.
  3. Change `sanitizeTodo` to the new shape.
  4. Update every implementation (an IndexedDB schema changes through `onupgradeneeded`) and the
     export, which shares the format version (decision `export-and-import`).
  5. A durable change to the model is a new dated record in `ai/decisions/`.

## Verify

Through a temporary call that is never committed (for example a temporary import in `main.jsx`
that puts the repository on `window`), then remove it and check `git status`:

- create, update, remove, restore and read, and the same after a reload; a restored task keeps
  its `id` and `createdAt`;
- `todo:data` broken by hand: bad JSON, a non-object, another `version`, one broken task among
  good ones. The app starts with the right list and the key is not rewritten until a change;
- a change in a second tab reaches the first through `subscribe`;
- a refused write: stub `Storage.prototype.setItem` to throw a `QuotaExceededError`; the promise
  rejects with the readable `Error` and the stored data stays as it was;
- after a format change, data written in the previous format is still read.
