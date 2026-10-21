# Architecture Rules

All sources live in `src/`; Vite builds them into `dist/`. `ai/map.md` says where every folder
lives; `ai/rules/react.md` covers components, state and hooks.

## Layers

Data flows one way: constants → storage → context → hooks → components. Each folder has one job
(decisions `structure-and-naming`, `context-folders`):

| Layer         | Owns                                                           | Must not                                |
| ------------- | -------------------------------------------------------------- | --------------------------------------- |
| `constants/`  | shared values: storage keys, categories, priorities, limits    | import from another layer               |
| `utils/`      | pure functions: filter, sort, validate, highlight              | use React, the DOM or storage           |
| `storage/`    | persistence behind `TodoRepository`                            | know about React or the UI              |
| `context/`    | app state, its actions, its hook, the repository               | render UI beyond its provider           |
| `hooks/`      | hooks not tied to a context: browser APIs, a component's logic | keep data that must survive a reload    |
| `components/` | markup, styles, simple local state; `App` wires the providers  | import `storage/`, touch `localStorage` |
| `main.jsx`    | `createRoot` and `StrictMode` around `App`                     | hold logic, wire providers              |

## Storage

- Every read and write of `localStorage` and `indexedDB` lives in `storage/`; ESLint reports any
  other use. The one exception is the theme script `public/theme.js`, a classic blocking `<script>`
  in `<head>` that sets `data-theme` before React starts (decision `theme-head-script`). Its key
  and values are literals that must equal `THEME_STORAGE_KEY` and the theme constants.
- `TodoRepository` is the contract: `list()`, `create(input)`, `update(id, patch)`,
  `remove(ids)` and `restore(todos)`, all asynchronous, and `subscribe(onExternalChange)`, which
  returns the function that stops the listening. `restore` writes tasks back unchanged, for Undo
  and for import. An implementation extends the class (decision
  `repository-storage-restore`). Besides the contract the base class holds the helpers the
  implementations share: checking a task, building a new one, applying a patch (`requireValidTodo`,
  `buildTodo`, `applyPatch`); an implementation calls them and never repeats that logic (decision
  `shared-repository-helpers`).
- `ThemeRepository` stores `todo:theme` and is not a `TodoRepository`: it holds one value, with
  synchronous `read()` and `save(theme)`. A missing, unknown or unreadable value reads as `system`;
  a refused `save` throws a readable `Error`, which the theme context shows as a toast.
- `createRepository()` picks the implementation from `import.meta.env.VITE_STORAGE`; nothing
  else knows which one runs. Besides the todos provider, the error screen's hook (`useErrorScreen`)
  calls it, in its click handler and only to read: the context may be what failed (decision
  `error-boundary`). No other hook or component imports `storage/`.
- Stored data is checked when read: a broken task costs only itself, unreadable or unknown data
  never stops the app, and nothing is written until something changes.
- A store that cannot be opened at all (a blocked IndexedDB) rejects `list()` with a readable
  `Error`; the context shows it as a toast and starts with an empty list, so the app still starts.
- A failed write rejects with a readable `Error` and never crashes the app; the context handles it
  (State).

## State

- App state lives in providers in `context/`: the tasks, the theme, the toast. Filter state is the
  URL query, read and written through `use-filters` (decision `filter-pills`).
- A component reads state and actions through the context's hook (`useTodos()`). A context
  folder exports only its provider and its hook, so the context object stays internal.
- A context changes the UI first, then writes through the repository; on failure it rolls the change
  back and shows the message as a toast (decision `errors-as-toasts`); the theme keeps its change,
  since a choice that is not remembered is still the choice. An action never throws or rejects to
  its caller. A context uses another through its folder (`@/context/toast`), not through
  `@/context`, which re-exports the importer.
- A change from another tab arrives through `subscribe` and reloads the list.

## Boundaries

- No inline `style` attribute. A value that JS hands to CSS is a data attribute a stylesheet maps to
  a custom property: `data-category` and `data-priority` in `styles/colors.css`. A number known only
  at runtime, such as the centre of the theme circle, goes through the Web Animations API.
- No app state on `window`, no global event bus, no singletons.
- No router: the only "route" state is the filter query string.
- A render error never leaves a blank page: `ErrorBoundary` is the outermost element of `App`, above the
  providers, and the `ErrorScreen` it shows reads no context (decision `error-boundary`).
- Do not rename existing CSS classes only for cosmetic reasons; class names are part of the
  component's styling contract.
