# Plan: the todos context and the `useTodos` hook (MY-150)

Branch `my-150-todos-context`. Linear issue MY-150, milestone Ядро, after MY-149; MY-151, MY-152
and MY-153 build on it. The spec is `ai/superpowers/specs/2026-10-17-todos-context.md`. There is no
UI in this task: `App` keeps rendering its shell inside the provider, and the layer is checked
through temporary code that is never committed.

## The author's answers (issue, «Решения автора», 2026-10-16 and 2026-10-17)

All questions are answered, so the work goes from this commit to the code:

- Context and own hooks on `useState`; no `useReducer`, no state manager, no manual `useMemo` or
  `useCallback`.
- The provider is inside `App`, not in `main.jsx` (the issue wins over the current rules): the
  `main.jsx` and `components/` rows of the layer table in `architecture.md` and step 3 of the
  `feature` skill change to match.
- A failed write rolls the change back and puts the message in `error`; `dismissError()` clears
  it. Actions never throw: `addTodo` resolves to the task or `null`. No UI for `error` here.
- `restore(todos)` joins the contract for Undo (the base class, `LocalStorageRepository`,
  `architecture.md`, the `storage` skill). A new record replaces `repository-storage`: it restates
  it with `restore`, status `accepted (not implemented)`; the old one becomes
  `superseded by <file>`.
- Defaults: `isLoading` is a boolean; a failed first load gives `error` and an empty list; rollback
  restores the snapshot taken before the change; `updateTodo` takes the task the repository
  resolved; `toggleAll` makes all active when all are completed, otherwise all completed; one
  `update` per changed task; `removeTodos` and `clearCompleted` return the removed tasks; an
  external change re-reads `list()`; the effect unsubscribes on unmount; no UI, a temporary
  component for the manual check.

### After the first handover

The author reviewed the branch and answered:

- A context is a folder: `context/todos/` holds the object, the provider and `useTodos`; its barrel
  exports only `TodosProvider` and `useTodos`, and `context/index.js` re-exports it. `hooks/`
  stays for hooks not tied to a context and appears with its first one. A short record,
  `context-folders`, covers the layout and the `.provider.jsx` suffix and refines
  `structure-and-naming` without superseding it.
- The pure list changes of the actions live in `utils/`: an action reads snapshot, optimistic
  `setTodos`, `saveChange`. No services layer; the repository plays that role.
- The old `repository-storage` citations in other records and in the archive stay; `restore`
  keeps rejecting the whole call on an invalid task.

## Code

Layers and file names follow `structure-and-naming` and `context-folders`; each new folder gets
its `index.js`.

- `src/constants/todos.constants.js` — `MISSING_TODOS_PROVIDER_MESSAGE`, the text `useTodos`
  throws (messages live in `constants/`); re-exported from `constants/index.js`.
- `src/storage/todo.repository.js` — `restore()` through `#throwNotImplemented()`, between
  `remove` and `subscribe`.
- `src/storage/local-storage.repository.js` — `restore(todos)`: `#read()`, every task through
  `#validate`, those whose `id` is not stored appended, written only when something is missing
  (the shape of `remove`).
- `src/utils/todos.utils.js` — the pure list changes the actions apply, each returning a new list:
  `patchTodo(todos, todoId, patch)` (the optimistic update), `splitTodosByIds(todos, ids)` (the
  `{ removed, remaining }` of `removeTodos`), `appendMissingTodos(todos, restoredTodos)` (the
  optimistic restore), `setAllCompleted(todos, isCompleted)` (the optimistic `toggleAll`) and
  `replaceTodos(todos, updatedTodos)` (each task swapped for the stored one of the same `id`).
- `src/context/todos/todos.context.js` — `TodosContext`, `createContext(null)`; internal.
- `src/context/todos/todos.provider.jsx` — `TodosProvider`: the repository from
  `useState(createRepository)`, `todos`, `isLoading` and `error` in `useState`, one effect that
  reads `list()` and subscribes, the actions, and `<TodosContext value={value}>`. One private
  function inside it, `saveChange(snapshot, write)`, holds the repeated scaffolding of the four
  optimistic actions: run the write, and on a failure put the snapshot back and set `error` (it
  resolves `{ isSaved, result }`). `addTodo` has no optimistic step, so it keeps its own `try` /
  `catch`.
- `src/context/todos/use-todos.js` — `useTodos()`: `use(TodosContext)` from the sibling file,
  throws when it is `null`.
- `src/context/todos/index.js` — exports `TodosProvider` and `useTodos` only.
  `src/context/index.js` re-exports `./todos`. There is no `hooks/` folder yet.
- `src/components/app/app.jsx` — wraps the shell in `TodosProvider`, imported from `@/context`.

### Deliberate choices

- **The context object is its own file, in the context's folder.** `eslint-plugin-react-refresh`
  (`only-export-components`) rejects a file that exports a component and a context object ("Move
  your React context(s) to a separate file"). The plain fix is separate files: `todos.context.js`
  (the object, role suffix `context`) and `todos.provider.jsx` (the component, role suffix
  `provider`). No lint override, and no comment to switch the rule off. `useTodos` joins them in
  `context/todos/`, so the object never leaves the folder and the barrel offers only the provider
  and the hook (`context-folders`).
- **The repository comes from `useState(createRepository)`**, one instance per provider. A module
  constant would be a singleton created on import (`architecture.md`, Boundaries). StrictMode
  calls the initializer twice in development; `createRepository` is stateless and the second
  `persist()` request changes nothing.
- **The read and the subscription share one effect** and one local `loadTodos`, so the dependency
  is only `repository`. No guard against a stale read: with localStorage the read resolves at once
  and two reads return the same data; a guard can come with a backend where reads overlap.
- **Rollback is the snapshot of the whole list**, as decided. A failure after another action
  changed the list would put that change back too; with localStorage the writes settle before the
  next event, so it cannot happen yet.
- **`toggleAll` writes the changed tasks in parallel** (`Promise.all` of `update`). If one write
  failed halfway the UI would roll back while earlier writes stayed stored; the next read (reload
  or another tab's change) shows the stored truth. Not guarded: the only failures are blocked or
  full storage, which fail from the first write.
- **`restore` rejects on an invalid task** instead of dropping it like a read does: a silent drop
  would let Undo "succeed" with the task gone. The same `Error` as `create` and `update`.
- **`error` is the message string** of the `Error` the repository rejected with; every storage
  message is already readable, so the context adds none of its own.
- **The `restore` order**: appended after the stored tasks. The screen sorts by `createdAt`, so a
  restored task lands where it was.

## Docs

- `ai/decisions/2026-10-17-repository-storage-restore.md` — the new record (`restore`, status
  `accepted (not implemented)`); `repository-storage` gets `superseded by <file>` and nothing else;
  the index in `ai/decisions/README.md` points to the new one. The `react-and-javascript` record
  cites `repository-storage` by name; a record's text is not rewritten, so it keeps the citation,
  which resolves to the superseded record and its pointer.
- `ai/decisions/2026-10-17-context-folders.md` — a small record, status `accepted`: a context is a
  folder with its object, provider and hook, only the last two public; the `.provider.jsx`
  suffix; `hooks/` for hooks not tied to a context. It refines the `.context.jsx` mention and the
  `hooks/` row of `structure-and-naming`, which stays in force and keeps its status and text.
  Added to the index.
- `ai/rules/architecture.md` — the layer table (`context/`, `hooks/`, `components/`, `main.jsx`),
  the contract line with `restore`, the decision names, the State bullets.
- `ai/rules/react.md`, `ai/rules/style.md` — a context is a folder, what its barrel exports, where
  a hook lives; the file-name examples.
- `ai/skills/storage.md` — six operations, the `restore` bullet, the decision name, the checks.
- `ai/skills/feature.md` — step 3 (providers inside `App`), the Utils, Context and Hook bullets.
- `ai/map.md` — `context/todos/` in Sources (no `hooks/` bullet: the folder does not exist yet),
  `components/app/`, the decision names, the layout table rows.
- Nothing else cites `repository-storage`; the archived MY-149 plan and spec keep their text.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`.
- In `pnpm dev` (port 5182) through temporary code that is never committed: every action changes
  the list and survives a reload; `addTodo` resolves the task, and `null` with `setItem` stubbed to
  throw; the same stub rolls `updateTodo`, `removeTodos`, `toggleAll` back, sets `error`, and
  `dismissError()` clears it; `removeTodos` then `restoreTodos` bring back the same `id` and
  `createdAt`; `toggleAll` both ways; `clearCompleted`; a change in a second tab shows in the first
  without a reload; `useTodos()` outside the provider throws the message; the shell renders at
  320px in both themes.
- `git status` clean after the temporary code is removed.
