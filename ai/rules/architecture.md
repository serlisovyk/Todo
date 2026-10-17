# Architecture Rules

All sources live in `src/`; Vite builds them into `dist/`. `ai/map.md` says where every folder
lives; `ai/rules/react.md` covers components, state and hooks.

## Layers

Data flows one way: constants → storage → context → hooks → components. Each folder has one job
(decision `structure-and-naming`):

| Layer         | Owns                                                        | Must not                                |
| ------------- | ----------------------------------------------------------- | --------------------------------------- |
| `constants/`  | shared values: storage keys, categories, priorities, limits | import from another layer               |
| `utils/`      | pure functions: filter, sort, validate, highlight           | use React, the DOM or storage           |
| `storage/`    | persistence behind `TodoRepository`                         | know about React or the UI              |
| `context/`    | app state in `useState`, its actions, the repository        | render UI beyond its provider           |
| `hooks/`      | access to a context; wrappers over browser APIs             | keep data that must survive a reload    |
| `components/` | markup, local UI state, its own stylesheet                  | import `storage/`, touch `localStorage` |
| `main.jsx`    | `createRoot`, the providers around `App`                    | hold logic                              |

## Storage

- Every read and write of `localStorage` and `indexedDB` lives in `storage/`; ESLint reports any
  other use in `src/`. The one exception is the theme script in `<head>`, which reads the saved
  theme before React starts (decision `theme-three-states`).
- `TodoRepository` is the contract: `list()`, `create(input)`, `update(id, patch)`,
  `remove(ids)`, `restore(todos)`, `subscribe(onExternalChange)`, all asynchronous. `restore` writes
  removed tasks back unchanged, for Undo. An implementation extends the class (decision
  `repository-storage-restore`).
- `createRepository()` picks the implementation from `import.meta.env.VITE_STORAGE`; nothing
  else knows which one runs.
- Stored data is checked when read: a broken task costs only itself, unreadable or unknown data
  never stops the app, and nothing is written until something changes.
- A failed write is reported to the context, which rolls the change back and shows it; it never
  crashes the app.

## State

- App state lives in providers in `context/`: the tasks, the theme, the toast. Filter state is the
  URL query, read and written through `use-filters` (decision `filters-and-search`).
- A component reads state and actions through the matching hook (`useTodos()`), never by
  importing a context object.
- A context changes the UI first, then writes through the repository, and rolls back on failure.
- A change from another tab arrives through `subscribe` and reloads the list.

## Boundaries

- No inline `style` attribute, except CSS custom properties that pass a value from JS to CSS.
- No app state on `window`, no global event bus, no singletons.
- No router: the only "route" state is the filter query string.
- Do not rename existing CSS classes only for cosmetic reasons; class names are part of the
  component's styling contract.
