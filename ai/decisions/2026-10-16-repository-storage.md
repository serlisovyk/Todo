# Storage behind a `TodoRepository` base class: localStorage by default, IndexedDB by env

Date: 2026-10-16 · Status: accepted (not implemented)

## Context

Tasks live only in the browser. The author wanted storage that is easy to swap. An HTTP backend
with a mock server was considered and rejected: the project has no backend.

## Decision

- `TodoRepository` in `storage/` is the contract: `list()`, `create(input)`, `update(id, patch)`,
  `remove(ids)`, `subscribe(onExternalChange)`, all asynchronous even for localStorage. Its methods
  throw `Not implemented`; implementations extend it.
- `LocalStorageRepository` is the default; `IndexedDbRepository` is built on `idb`.
  `createRepository()` picks by `VITE_STORAGE`: `indexeddb` → IndexedDB, anything else →
  localStorage.
- localStorage: key `todo:data`, `{ version: 1, todos }`. IndexedDB: database `todo`, store
  `todos`, key path `id`, schema versions through `onupgradeneeded`.
- Reads go through one shared validator: unreadable data, a non-object or an unknown version gives
  an empty list and the stored data is not overwritten until the first change; a broken task is
  dropped alone. Nothing is written at start.
- No migration code in the first version; the first format change adds a migration table, one step
  per version.
- Other tabs' changes arrive through `subscribe` (the `storage` event; `BroadcastChannel('todo')`
  for IndexedDB). Without it a stale tab overwrites another tab's work.
- `navigator.storage.persist()` is requested at start; a refusal changes nothing.

## Consequences

- The two backends hold separate data; export and import move tasks between them.
- Rejected: an HTTP repository with MSW, a TypeScript interface, writing at start.
