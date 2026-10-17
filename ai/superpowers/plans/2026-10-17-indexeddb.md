# Plan: IndexedDB storage (MY-159)

Branch `my-159-indexeddb`. Linear issue MY-159, milestone Хранилища. The spec is
`ai/superpowers/specs/2026-10-17-indexeddb.md`. The task has no UI: nothing imports the storage
layer until the context (MY-150), so the app shell does not change. The bundle is measured through
a temporary import that is never committed.

## The author's answers (issue, «Решения автора», 2026-10-16 and 2026-10-17)

All questions are answered, so the work goes from this commit to the code:

- IndexedDB through `idb`, chosen by `VITE_STORAGE`; no HTTP repository. The two backends keep
  separate data; export and import (MY-160) move tasks between them.
- Runs in parallel with MY-150, which merges first. `IndexedDbRepository` implements
  `restore(todos)` to MY-150's contract from the start: the tasks are written back exactly as they
  were, each through the validator, ids already stored are skipped, it resolves when written, and a
  refused write rejects like the others. This task does not add `restore` to `TodoRepository`,
  `LocalStorageRepository`, `architecture.md` or the `storage` skill, and does not touch the
  `Status` of `repository-storage`: MY-150 does it, and this branch is rebased onto it afterwards.
- The logic both repositories share becomes ordinary methods of `TodoRepository`, because
  `#private` methods are not inherited; `LocalStorageRepository` moves onto them.
- A database that cannot be opened (blocked, private mode, refused) makes `list()` reject with a
  readable `Error` with a `cause`, and the context shows it. Broken stored data is not an error:
  the broken record is skipped. Every refused write rejects with a readable `Error` with a `cause`.
  Messages are in `storage.constants.js`.
- Defaults: database `todo`, version 1, store `todos`, key path `id`, no indexes, the schema in the
  upgrade callback; `BroadcastChannel('todo')`, a message after every write, `subscribe` listens
  to it; the connection is opened once per instance and the data is read afresh each time; broken
  records are skipped and left in the database; `idb` is a static import, and the default bundle
  must not grow by it; `.env.sample` is the single line `VITE_STORAGE=localstorage`; the variable is
  described in `README.md` and `ai/map.md`; the dev server for checks runs on port 5183.

## Code

Layers and file names follow `structure-and-naming`.

- `package.json`, `pnpm-lock.yaml` — `idb` as a runtime dependency, added with `pnpm add idb`
  (allowed by `scope.md`).
- `src/constants/storage.constants.js` (and the barrel) — the storage mode value `indexeddb`, the
  database name, version, store name and key path, the channel name, and two new messages: the
  database could not be opened, and the tasks could not be loaded. The refused-write message is the
  existing `SAVE_ERROR_MESSAGE`.
- `src/storage/todo.repository.js` — three ordinary methods beside the contract:
  `requireValidTodo(candidate)` returns the clean task or throws the "invalid field" `Error`;
  `buildTodo(input)` builds a new task (`id`, `completed: false`, both timestamps) and returns it
  validated; `applyPatch(current, patch)` merges a patch, keeps `id` and `createdAt`, sets
  `updatedAt` and returns it validated. The names say what they do and none is one of the contract
  operations. `#throwNotImplemented` stays private: only the base class uses it.
- `src/storage/local-storage.repository.js` — `create` calls `buildTodo`, `update` calls
  `applyPatch`; the private `#validate` and the inline building go away. Behaviour is unchanged.
- `src/storage/indexed-db.repository.js` — `IndexedDbRepository extends TodoRepository`:
  - `#open()` caches the `openDB` promise (so concurrent first calls share one connection), creates
    the store in `upgrade`, and turns any failure to open into the readable `Error` and forgets
    the cached promise.
  - `list()` reads all records, passes them through `sanitizeTodos`, sorts by `createdAt`.
  - `#write(operation)` runs a callback in one `readwrite` transaction together with
    `transaction.done` (`Promise.all`, so an abort is never an unhandled rejection) and turns a
    browser error (`DOMException`) into the readable save `Error`; the repository's own rejections
    ("no longer exists", "invalid field") pass through unchanged.
  - `create`, `update`, `remove` and `restore` follow the spec; `remove` and `restore` announce
    only when they changed something.
  - One `BroadcastChannel` field posts after a write and serves `subscribe`; a channel never gets
    its own messages, so a tab's writes do not reach its own subscribers.
- `src/storage/create-repository.js` — after the `persist()` line, returns an `IndexedDbRepository`
  when `import.meta.env.VITE_STORAGE` equals the storage mode constant, otherwise a
  `LocalStorageRepository`. The barrel still exports `createRepository` only.
- `.env.sample` — `VITE_STORAGE=localstorage`, no comment. `.gitignore` gets the pair `.env*` and
  `!.env.sample`, so a local `.env` never reaches a commit and the sample stays tracked. The checks
  set the variable on the command line.

### Deliberate choices

- **Validate before opening the transaction** where the input alone decides it (`create`,
  `restore`): an invalid task rejects without touching the database.
- **A broken record is "missing" for `update`**, exactly as `list()` hides it, and is not repaired.
- **`restore` rejects on an invalid task** (the whole call, nothing written) instead of skipping
  it, like `create` and `update`: the tasks it receives come from `remove`, so they are valid.
  MY-150 decides the same for `LocalStorageRepository`; the rebase aligns the two.
- **No `versionchange` handling:** the schema has one version, so a second tab never has to wait
  for this one to close; the first schema change adds it.

## Docs

- Decision `2026-10-17-shared-repository-helpers.md` (`accepted`): helpers shared by
  implementations are ordinary methods of the base class; rejected: helpers in `utils/` (they read
  the clock and `crypto.randomUUID()`, so they are not pure) and duplicating the code. Added to the
  index in `ai/decisions/README.md`. `repository-storage` keeps its status.
- `ai/rules/style.md` (Classes): the exception for a helper shared by subclasses.
  `ai/rules/architecture.md` (Storage): the base class holds those helpers beside the contract,
  and a store that cannot be opened rejects `list()` while the context shows the error.
- `ai/map.md`: `.env.sample` and `VITE_STORAGE`, the new constants, `IndexedDbRepository`, the
  Storage section (IndexedDB is built now).
- `README.md`: a short Environment Variables line.
- `ai/skills/storage.md`: only where the second implementation showed the recipe was wrong or
  incomplete: `create` and `update` use the base helpers; an unreachable store rejects `list()`
  while broken data stays an empty list; the checks for IndexedDB.
- Decisions flip: none here. After MY-150 merges, the record that replaces `repository-storage`
  becomes `accepted` in the rebase.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`. The bundle with the default
  storage is compared with and without the IndexedDB branch through a temporary import of
  `createRepository` in `main.jsx` (never committed).
- In `pnpm dev` on port 5183 with `VITE_STORAGE=indexeddb`, through a temporary call that puts the
  repository on `window` (never committed): create, list, update, remove, restore (same `id` and
  `createdAt`), and the same after a reload; the records in the `todo` database; a broken record
  among good ones is skipped and left untouched; a change in a second tab reaches the first
  through `subscribe`, and a tab's own write does not call its own callback; unsubscribe stops it;
  `indexedDB.open` failing makes `list()` and every write reject with the readable `Error` and no
  unhandled rejection; a refused write rejects and the data stays as it was; a private window
  works or fails cleanly.
- `pnpm dev` without the variable: the localStorage path works as before (create, update, remove,
  a reload).
- Using the app through the interface with `VITE_STORAGE=indexeddb` moves to MY-152.
