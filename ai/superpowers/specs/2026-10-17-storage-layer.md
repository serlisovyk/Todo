# Spec: task storage in localStorage (MY-149)

Decisions in force: `repository-storage` (the contract, the format, the read rules), `todo-model`
(the fields, categories and priorities), `design-tokens` (category colours). This spec fixes the
exact behaviour of the layer. There is no UI yet: the context (MY-150) is its first caller.

## Stored data

- The key `todo:data` holds `{ "version": 1, "todos": [...] }`.
- A task has `id`, `title`, `category`, `priority`, `completed`, `createdAt`, `updatedAt`
  (`todo-model`). A category is stored by its lowercase id (`work`, `personal`, `study`, `shopping`,
  `health`), a priority as `low`, `medium` or `high`.
- A category's colour is not stored and not in JavaScript: it is the token
  `--color-category-<id>`.
- Nothing is written at start. A read never writes.

## Reading

Every operation reads the key afresh; the repository keeps no copy of the tasks.

| Stored value                                          | `list()` gives  | Stored data                            |
| ----------------------------------------------------- | --------------- | -------------------------------------- |
| the key is missing                                    | an empty list   | unchanged                              |
| not JSON, not an object, `version` missing or not `1` | an empty list   | untouched until the first change       |
| `todos` is not an array                               | an empty list   | untouched until the first change       |
| one task breaks a rule                                | the other tasks | the broken one goes at the next change |
| the browser refuses to read (blocked storage)         | an empty list   | unchanged                              |

A task is valid when all of this holds:

- `id` is a non-empty string;
- `title` is a string whose trimmed value is 1 to 200 characters; it is kept trimmed;
- `category` and `priority` are known ids;
- `completed` is a boolean;
- `createdAt` and `updatedAt` are ISO 8601 UTC timestamps in the exact form `Date#toISOString`
  writes (`2026-10-17T06:54:49.227Z`).

One field against the rules drops the whole task; a field that is not in the list is stripped. One
shared validator does this check, and the import (`export-and-import`) reuses it.

## Writing

- `create(input)` takes `title`, `category` and `priority`. The repository sets the `id`
  (`crypto.randomUUID()`), `completed: false` and both timestamps to now, appends the task and
  resolves to the full task as stored. Anything else in `input` is ignored.
- `update(id, patch)` takes any of `title`, `category`, `priority`, `completed`. It sets
  `updatedAt` to now and resolves to the updated task; `id` and `createdAt` never change. An
  unknown `id` rejects with an `Error` ("no longer exists"): another tab may have deleted the task.
- `remove(ids)` takes an array of ids, drops those tasks and resolves to nothing. Ids that are not
  stored are ignored; if none matches, nothing is written.
- A task that would not pass the validator (an empty title, an unknown category) is never written:
  `create` and `update` reject with an `Error`.
- A write the browser refuses (full or blocked storage) rejects with a readable `Error` whose
  `cause` is the browser's error. The stored data stays as it was.
- `list`, `create`, `update` and `remove` return a promise and never throw synchronously;
  `subscribe` returns the unsubscribe function at once.

## Other tabs

`subscribe(onExternalChange)` calls `onExternalChange()` with no arguments when another tab changes
`todo:data` (the `storage` event for that key), and returns a function that stops the listening.
The caller then reads `list()` again. The tab's own writes do not call it.

## Persistent storage

`createRepository()` asks the browser once for persistent storage (`navigator.storage.persist()`).
A browser without the API, a refusal or a rejection changes nothing and shows nothing.

## Out of scope

IndexedDB and the `VITE_STORAGE` switch (MY-159), the context and its rollback (MY-150), showing
a write error (MY-150, MY-153), export and import (MY-160).
