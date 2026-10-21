# A barrel re-exports a module of more than four names with `export *`

Date: 2026-10-21 · Status: accepted

## Context

Every barrel named every name of every module. `constants/index.js` ran to 112 lines, a new constant was two edits
in two files, and two branches that each added a name to the same line conflicted. `structure-and-naming` asks for a
barrel of named exports in every folder; it does not say how the lines are written.

## Decision

- A barrel line re-exports one module. Up to four names, it lists them, so the line says what a small module gives:
  `export { isTheme, resolveTheme } from './theme.utils.js'`. Above four it is `export * from './todos.utils.js'`.
- `export *` re-exports named exports only, so the rule against default exports still holds. The set of public
  names does not change.

## Consequences

- A name added to a module that already has more than four needs no barrel edit; a module that grows past four
  turns its line into `export *`.
- Every export of a module re-exported with `*` is public, so a helper that is private to its folder is not exported
  from such a file. Two modules re-exported with `*` must not export the same name: the clash is dropped without an
  error, and the importer gets `undefined`.
- The rest of `structure-and-naming` stays in force.
