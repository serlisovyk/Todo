# React Rules

Why: decisions `react-and-javascript`, `state-in-context-and-hooks` and `context-folders`. Layers
and storage: `ai/rules/architecture.md`.

## Components

- Function components only, except `ErrorBoundary`: React catches a render error only in a class
  (decision `error-boundary`). One component per file, in its own folder next to its stylesheet:
  `components/todo-item/todo-item.jsx` exports `TodoItem` and imports `./todo-item.css`.
- A component file holds only its imports and the component, and so does a provider file: constants,
  maps and lookup tables go to `constants/`, pure helpers to `utils/`, logic to a hook.
- Named exports only, no default exports.
- Props are plain data and callbacks named `on<Action>` (`onToggle`, `onDelete`); a prop that draws
  one item of a list is a function named `render<Thing>` (`renderMark`). A component that needs app
  state calls the hook instead of receiving it through several levels of props.
- Up to three props are destructured in the signature. A component with four or more takes `props`
  and destructures it in the first statement of its body, followed by a blank line:
  `const { labelText, name, options, value } = props`.
- List keys are stable ids (`todo.id`), never an array index.
- A piece that renders markup is a component of its own, in its own folder, even when one component
  is its only user: one component per file, no exception.

## State

- App state is `useState` inside a provider in `context/`, exposed through a `use-*` hook. Local
  UI state (a title being edited, an open panel) stays in the component. A component with real
  logic, such as a form's fields, submit and focus, moves it into its own hook in `hooks/` and keeps
  only the markup.
- A context is a folder `context/<name>/` with its object (`<name>.context.js`), its provider
  (`<name>.provider.jsx`) and its hook; the barrel exports only the provider and the hook. The
  object has its own file because `react-refresh` rejects a component file that also exports it.
- No `useReducer`, no state-management library, no server-state library.
- Derive instead of storing: the visible list, the counter, "has completed tasks" are computed
  during render from the tasks and the filters, never kept as their own state. State that follows a
  change of its inputs and must not follow their later values (the announced filter result) is
  replaced during render under a guard that compares the inputs, never by an effect that watches them.
- The React Compiler memoizes: no manual `useMemo`, `useCallback` or `memo`.

## Effects and events

- An effect only synchronizes with something outside React: the repository's `subscribe`, the
  document (`data-theme`, a meta tag), the URL, a document key listener. It returns its cleanup. A
  browser value that only feeds the render (`matchMedia`, the URL query) is read with
  `useSyncExternalStore`, not copied into state by an effect.
- Work that follows a user action runs in the event handler or the form action, not in an effect
  that watches state. A change the focus depends on (a button that comes back, a row that returns)
  is committed with `flushSync` in the handler or the action, and only then focused.
- Forms use `<form action>`; `useActionState` when the form shows a pending or error state. React
  resets the form after every action, and a reset puts a `<select>` back on its first option while its
  state keeps the old value: a form that keeps its fields holds them in state and cancels `onReset`.
- Nothing reads `localStorage` or `indexedDB` during render, and the URL only through
  `useSyncExternalStore`. The one exception is a provider's lazy `useState` initializer that
  restores a saved choice the first paint shows (the theme), read once through its repository.

## Hooks

- A hook lives in `use-<name>.js` and exports `use<Name>`: next to its context for a hook over a
  context, in `hooks/` for any other. A hook only one provider uses sits in that provider's folder
  and stays out of the barrel.
- A hook over a context throws a clear error when it is used outside its provider.
- The Rules of Hooks hold; `eslint-plugin-react-hooks` checks them.
- Each kind of hook call is its own paragraph: context (`useTodos`), refs and ids (`useRef`,
  `useId`), browser hooks (`useMediaQuery`), state (the `useState` block), action state
  (`useActionState`). Values derived from a hook's result form the next paragraph.

## Accessibility in components

- Real elements: `<button>` for actions, `<input type="checkbox">`, radio groups, `<select>`,
  `<form>`, `<ul>` for the list. A `div` with `onClick` is a bug; `eslint-plugin-jsx-a11y` reports
  it along with missing labels and alt texts.
- Every control has an accessible name: a visible or visually hidden `<label>`; an icon-only button
  has a `title`, which is its name and its tooltip (decision `tooltips-as-title`).
- After an action, focus lands somewhere meaningful: after adding — the input; after deleting —
  the next task, else the previous one, else the checked status radio (a text field would keep
  Ctrl/Cmd+Z for its own undo); after editing — the edit button.
- A change a screen-reader user must hear goes through one polite live region (`role="status"`),
  never a second region for the same event and never `assertive`. A message that can repeat is a
  node keyed by the attempt inside the region, so the second one is announced again. The tasks-left
  counter and the filter result are different events from a toast: the counter has its own
  `aria-live="polite"` element, the result its own `role="status"` region above the list, which speaks
  only when the filters change and its text differs from the last one. A limit counter's region is the
  same kind: its text depends on the range the length is in, never on the length, so it speaks when the
  range changes and not on each keystroke.
