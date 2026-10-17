# Spec: task storage in IndexedDB (MY-159)

Decisions in force: `repository-storage` (the contract, the schema, `BroadcastChannel('todo')`),
`todo-model` (the fields), `export-and-import` (the backends hold separate data). The behaviour of
the contract is the one in `2026-10-17-storage-layer.md`; this spec fixes what IndexedDB does
differently or adds. There is no UI yet: the context (MY-150) is the first caller.

## Choosing the storage

- `VITE_STORAGE=indexeddb` selects IndexedDB; any other value, or none, selects localStorage.
  Vite reads the variable when the dev server or the build starts, so the choice is fixed per run.
- `.env.sample` lists the variable with its default value, `localstorage`.
- The two backends keep separate data; moving tasks between them is export and import.

## Stored data

- The database `todo`, version 1, the object store `todos`, key path `id`, no indexes. The schema
  is created in the upgrade step. Nothing is written at start, and a read never writes.
- One record per task, with the seven fields of `todo-model`, as the shared validator returns it.
- `list()` returns the tasks oldest first (by `createdAt`), the order localStorage gives by
  appending; the app's own sort comes on top of it.

## Reading

Every operation reads the database afresh; the repository keeps no copy of the tasks.

| Situation                                                    | `list()` gives                         | Stored data            |
| ------------------------------------------------------------ | -------------------------------------- | ---------------------- |
| the store is empty                                           | an empty list                          | unchanged              |
| a record breaks a rule (or is not an object)                 | the other tasks                        | the record stays as is |
| the database cannot be opened (blocked, refused, no support) | rejects with a readable `Error`, cause | n/a                    |
| the read fails after the database was opened                 | rejects with a readable `Error`, cause | unchanged              |

A record is valid by the same rules as a localStorage task (`2026-10-17-storage-layer.md`, Reading).
Broken records are never repaired and never deleted: they are skipped on every read.

## Writing

Every write is one `readwrite` transaction, so it is atomic and all-or-nothing.

- `create(input)` builds the task as in the storage layer spec, adds it and resolves to it.
- `update(id, patch)` reads the record, applies the patch and puts it back in the same transaction,
  so two tabs cannot overwrite each other's fields. A missing id, or a record that fails the
  validator, rejects with the "no longer exists" `Error`, as localStorage does for an unknown id.
  `id` and `createdAt` never change.
- `remove(ids)` deletes the stored ids and ignores the rest; when nothing was stored, it writes and
  announces nothing.
- `restore(todos)` writes each task back exactly as it was (same `id`, `createdAt`, every field).
  Every task goes through the validator before anything is written: one that fails rejects the
  whole call with the "invalid field" `Error` and nothing is written. Ids already stored are
  skipped; the rest are added in one transaction. It resolves to nothing, and announces only when
  it added something.
- A write that is refused (full or blocked storage, an aborted transaction, a closing connection)
  rejects with a readable `Error` whose `cause` is the browser's error; the transaction is rolled
  back, so the stored data stays as it was. A database that cannot be opened rejects the write with
  the "could not be opened" `Error`.
- Every operation returns a promise and never throws synchronously; `subscribe` returns the
  unsubscribe function at once.

## Connection

The database is opened on the first operation, once per repository instance, and reused. A failed
open is not remembered: the next operation tries again.

## Other tabs

- Each repository instance owns one `BroadcastChannel('todo')`, used both to post and to listen.
- After every successful write (a `remove` or `restore` that changed nothing is not a write) the
  instance posts a message with no data.
- `subscribe(onExternalChange)` listens to the channel, calls `onExternalChange()` with no
  arguments on every message and returns a function that stops the listening. The caller then
  reads `list()` again.
- A tab's own writes do not call its own callback: a channel instance never receives the messages
  it posted itself, which is why one channel serves both directions.

## Persistent storage

Unchanged: `createRepository()` asks for persistent storage first, whichever backend it returns.

## Out of scope

The context and how it shows an error (MY-150, MY-153); `restore` in the base contract and in
`LocalStorageRepository` (MY-150); using the app with `VITE_STORAGE=indexeddb` through the
interface (MY-152); closing the connection on a schema upgrade from another tab, and a migration
step, until a second schema version exists.
