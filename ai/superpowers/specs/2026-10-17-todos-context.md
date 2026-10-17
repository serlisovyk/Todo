# Spec: the todos context and the `useTodos` hook (MY-150)

Decisions in force: `state-in-context-and-hooks` (Context, `useState`, no `useReducer`, no manual
memoization), `repository-storage-restore` (the contract with `restore`, written in this task; it
refines `repository-storage`), `todo-model` (the fields, Undo for deleting), `context-folders` (the
context is a folder; only the provider and the hook are public). There is no UI yet: the form, the
list and the toast arrive in later tasks and are this layer's first callers.

## What a component gets

`useTodos()` returns:

- `todos` — the tasks in storage order (insertion order); the visible order is derived by the UI
  from `createdAt` (`todo-model`).
- `isLoading` — `true` until the first read finishes.
- `error` — the message of the last failure, or `null`.
- the actions below and `dismissError()`.

Outside `TodosProvider` the hook throws an `Error`: "useTodos must be used inside TodosProvider."
`App` renders the provider around the page shell; `main.jsx` does not change. A component imports
`TodosProvider` and `useTodos` from `@/context`; the context object is not exported.

## Loading

- On mount the provider reads `list()` once. Until it resolves `todos` is empty and `isLoading` is
  `true`; then `isLoading` is `false`. Nothing is written at start.
- A read that rejects leaves `todos` empty, sets `error` to the message and ends the loading.
  (`LocalStorageRepository.list()` never rejects; the contract allows it.)

## Actions

A write is optimistic when the new state is known before the repository answers: the list changes
at once, then the repository is called. An action never throws and its promise never rejects.

| Action                      | The list changes                           | Resolves to                        |
| --------------------------- | ------------------------------------------ | ---------------------------------- |
| `addTodo(input)`            | after `create` resolves: the task is added | the new task, or `null` on failure |
| `updateTodo(todoId, patch)` | at once: the patch; then the stored task   | nothing                            |
| `toggleTodo(todoId)`        | like `updateTodo` with `completed` flipped | nothing                            |
| `removeTodos(todoIds)`      | at once: the tasks are gone                | the removed tasks, `[]` on failure |
| `restoreTodos(todos)`       | at once: tasks not in the list come back   | nothing                            |
| `toggleAll()`               | at once: every task gets the same state    | nothing                            |
| `clearCompleted()`          | like `removeTodos` for the completed tasks | the removed tasks, `[]` on failure |
| `dismissError()`            | `error` becomes `null`                     | nothing                            |

- `addTodo` takes `title`, `category`, `priority`. The list does not change while the repository
  builds the task (it owns the `id` and the timestamps); on success the task is appended. On failure
  the list is untouched and the form keeps its text, because the caller gets `null`.
- `updateTodo` shows the patch at once, then replaces the task with the one `update` resolved to
  (a fresh `updatedAt`). An id that is not in the list changes nothing locally and the write fails
  as usual. `toggleTodo` with an unknown id does nothing.
- `removeTodos` returns the tasks it removed so the caller can offer Undo with them. Ids that match
  nothing are ignored.
- `restoreTodos` takes tasks as `removeTodos` returned them. Those whose `id` is already in the
  list are skipped; the others are appended and keep every field, `id` and `createdAt` included,
  so the UI sorts them back to their old place.
- `toggleAll`: if every task is completed all become active, otherwise all become completed. One
  `update` per task that changes; the stored tasks replace the local ones when all resolved. An
  empty list does nothing.
- `clearCompleted` removes the completed tasks the way `removeTodos` does.

## Errors and rollback

- When a write rejects, the list goes back to what it was before that action, `error` gets the
  message of the `Error` the repository rejected with (readable text, see
  `storage.constants.js`), and the app keeps running.
- `error` stays until `dismissError()`. A later failure replaces it; a success does not clear it.
- Showing the message (a toast) is a later task: this layer only holds it.

## Other tabs

- The provider subscribes to the repository. When another tab changes the data it reads `list()`
  again and replaces `todos` with the result, like the first read (a rejection sets `error` and
  empties the list).
- The tab's own writes do not trigger it. The subscription ends when the provider unmounts;
  StrictMode's second mount leaves exactly one.

## The repository: `restore(todos)`

`TodoRepository` gains `restore(todos)`; `LocalStorageRepository` implements it (stored data):

- It writes the given tasks back exactly as given: `id`, `createdAt`, `updatedAt`, `completed`
  and every other field stay, each task through the shared validator. `create` cannot do this: it
  always makes a new `id` and `createdAt`.
- A task whose `id` is already stored is skipped. If every task is skipped nothing is written.
  The restored tasks are appended after the stored ones; the order of the screen comes from
  `createdAt`, not from the stored order (`todo-model`).
- A task that fails the validator rejects the call with the same `Error` as `create` ("The task
  has an invalid field.") and nothing is written. A write the browser refuses rejects with the
  readable `Error` and a `cause`, and the stored data stays as it was.
- It resolves to nothing and never throws synchronously.

## Out of scope

Any UI, the toast that shows `error`, the form, the list, the filters, IndexedDB and the
`VITE_STORAGE` switch, export and import.
