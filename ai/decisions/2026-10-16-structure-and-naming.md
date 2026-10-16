# Flat folders by role, kebab-case files with role suffixes, barrels and the `@/` alias

Date: 2026-10-16 · Status: accepted

## Context

Feature folders were proposed during planning. The author chose a small flat structure by role,
with Angular-like file names but without a `.component` suffix, and wanted barrel files and
alias imports.

## Decision

- Folders in `src/`: `components/`, `context/`, `hooks/`, `storage/`, `utils/`, `constants/`,
  `styles/`; `main.jsx` is the entry point.
- Files and folders are kebab-case. A non-component file carries its role as a suffix:
  `.constants.js`, `.utils.js`, `.context.jsx`, `.repository.js`. A component has no suffix and a
  folder of its own with its stylesheet (`todo-item/todo-item.jsx` + `todo-item.css`). A hook is
  `use-*.js`.
- Every folder has an `index.js` re-exporting its public names; named exports only.
- Cross-folder imports use the `@/` alias (Vite `resolve.alias` plus `jsconfig.json` paths for
  editors) and the folder's barrel; a sibling in the same folder is imported directly; no `../`.
- ESLint enforces the file names and the import rules.

## Consequences

- A folder appears with its first file and its `index.js`; no empty placeholders.
- Rejected: feature folders, a `.component.jsx` suffix, default exports.
