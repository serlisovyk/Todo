# React Rules

Why: decisions `react-and-javascript` and `state-in-context-and-hooks`. Layers and storage:
`ai/rules/architecture.md`.

## Components

- Function components only. One component per file, in its own folder next to its stylesheet:
  `components/todo-item/todo-item.jsx` exports `TodoItem` and imports `./todo-item.css`.
- Named exports only, no default exports.
- Props are plain data and callbacks named `on<Action>` (`onToggle`, `onDelete`). A component that
  needs app state calls the hook instead of receiving it through several levels of props.
- List keys are stable ids (`todo.id`), never an array index.
- A small piece used by one component only stays in its file as a module-level function; a piece
  used twice gets its own folder.

## State

- App state is `useState` inside a provider in `context/`, exposed through a `use-*` hook. Local
  UI state (a title being edited, an open panel) stays in the component.
- No `useReducer`, no state-management library, no server-state library.
- Derive instead of storing: the visible list, the counter, "has completed tasks" are computed
  during render from the tasks and the filters, never kept as their own state.
- The React Compiler memoizes: no manual `useMemo`, `useCallback` or `memo`.

## Effects and events

- An effect only synchronizes with something outside React: the repository's `subscribe`,
  `matchMedia`, the URL, a document key listener. It returns its cleanup.
- Work that follows a user action runs in the event handler or the form action, not in an effect
  that watches state.
- Forms use `<form action>`; `useActionState` when the form shows a pending or error state.
- Nothing reads `localStorage`, `indexedDB` or the URL during render.

## Hooks

- A hook lives in `hooks/use-<name>.js` and exports `use<Name>`.
- A hook over a context throws a clear error when it is used outside its provider.
- The Rules of Hooks hold; `eslint-plugin-react-hooks` checks them.

## Accessibility in components

- Real elements: `<button>` for actions, `<input type="checkbox">`, radio groups, `<select>`,
  `<form>`, `<ul>` for the list. A `div` with `onClick` is a bug.
- Every control has an accessible name: a visible or visually hidden `<label>`; an icon-only button
  has `aria-label`.
- After an action, focus lands somewhere meaningful: after adding — the input; after deleting —
  the next task; after editing — the edit button.
- A change a screen-reader user must hear goes through one polite live region (`role="status"`),
  never a second region for the same event and never `assertive`.
