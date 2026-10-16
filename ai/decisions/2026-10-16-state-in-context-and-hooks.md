# App state in Context and custom hooks on `useState`

Date: 2026-10-16 · Status: accepted

## Context

The app state is small: the tasks, the theme, the toast and the filters. Considered: a state
library (Zustand, Redux), `useReducer` with Context, and Context with `useState`. The author wanted
no state manager and found `useReducer` too heavy for this size.

## Decision

- Providers in `context/` hold state in `useState` and expose actions; components reach them only
  through `use-*` hooks.
- No `useReducer`, no state-management or server-state library.
- Filter state is the URL query, not context state (decision `filters-and-search`).
- No manual `useMemo`, `useCallback` or `memo`: the React Compiler memoizes.

## Consequences

- An action is a function in the provider: change the UI first, write through the repository,
  roll back and report on failure.
- Adding a state library or `useReducer` reverses this record.
