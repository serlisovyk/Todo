# A context is a folder: object, provider and hook; only the provider and the hook are public

Date: 2026-10-17 · Status: accepted

## Context

`structure-and-naming` names `.context.jsx` as the suffix of a context file and `hooks/` as the
home of every hook. The first context showed two things: `eslint-plugin-react-refresh` rejects a
file that exports both a component and a context object, so the object needs a file of its own;
and a hook over a context is useless without that object, so it belongs next to it.

## Decision

- A context is a folder `context/<name>/` with `<name>.context.js` (the context object),
  `<name>.provider.jsx` (the provider) and `use-<name>.js` (the hook, which reads the object as a
  sibling and throws outside the provider).
- The folder's `index.js` exports only the provider and the hook; the object stays internal.
  `context/index.js` re-exports each context folder, and other folders import from `@/context`.
- `.provider.jsx` is the role suffix of a provider file, `.context.js` that of the object.
- `hooks/` holds the hooks that are not tied to a context (browser APIs) and appears with its first
  one.
- This refines the `.context.jsx` suffix and the `hooks/` row of `structure-and-naming`; the rest
  of that record stays in force.

## Consequences

- A component cannot reach a context object: the barrel only offers the provider and the hook.
- A new context copies the shape of `context/todos/`.
- Rejected: one `.context.jsx` file with both exports (the lint rule), turning that rule off for
  it, and a hook in `hooks/` that imports an exported context object.
