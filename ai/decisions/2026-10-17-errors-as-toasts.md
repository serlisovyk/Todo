# Storage errors are shown as toasts by the provider that raises them

Date: 2026-10-17 · Status: accepted

## Context

A failed write or a failed first read has to reach the user. The first shape kept the message in
`error` of the todos context, with `dismissError`, for a component to show. Every consumer then had
to remember to show it, and an `error` outlived the action that raised it.

## Decision

- `ToastProvider` wraps `TodosProvider` in `App`; the todos provider calls `useToast()` itself when an
  action rolls back or the first read fails, with the repository's message.
- The todos context has no `error` and no `dismissError`. An action still never throws or rejects:
  `addTodo` resolves `null` and `removeTodos` an empty list, so a caller keeps its input.
- An error toast is a toast with an error flag: a danger-coloured icon before the message so it stands
  out, no action button, one at a time, the same timing and the same single live region.

## Consequences

- A component never handles a storage error; a new context that writes through the repository raises
  its own errors the same way and holds no error state.
- The todos provider only works inside the toast provider.
- Rejected: `error` state in the context shown by a component (each consumer must remember it), and a
  global event bus (`ai/rules/architecture.md`).
