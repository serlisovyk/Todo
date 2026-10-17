# Storage behind a `TodoRepository` base class, with `restore` for Undo

Date: 2026-10-17 · Status: accepted

## Context

Tasks live only in the browser, in storage that is easy to swap. This record replaces
`repository-storage`: it restates it and adds `restore`, which Undo needs. `create` always makes a
new `id` and `createdAt`, and the order comes from `createdAt`, so it cannot put a removed task back.

## Decision

- `TodoRepository` in `storage/` is the contract: `list()`, `create(input)`, `update(id, patch)`,
  `remove(ids)`, `restore(todos)`, `subscribe(onExternalChange)`, all asynchronous even for
  localStorage. Its methods throw `Not implemented`; implementations extend it.
- `restore(todos)` writes tasks back exactly as they were (same `id`, `createdAt`, every field),
  each through the shared validator, and skips ids that are already stored. An invalid task or a
  refused write rejects like the other writes.
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
- Rejected: an HTTP repository with a mock server (the project has no backend), a TypeScript
  interface, writing at start, and Undo through `create` with a forged `id` and `createdAt`.
