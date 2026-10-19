# A render error shows an error screen that exports the tasks straight from the repository

Date: 2026-10-19 · Status: accepted

## Context

A render error makes React unmount the whole tree: a white page, with the tasks still in storage and no way to
reach them. Only a class component catches it (`getDerivedStateFromError`); the rules allowed classes only in
`storage/`.

## Decision

- `ErrorBoundary` is the one class component outside `storage/`, in `components/`. It holds `state` and
  `getDerivedStateFromError`, shows `ErrorScreen` after an error and never resets: the way out is Reload. No
  `componentDidCatch`: React already logs a caught error.
- It is the outermost element of `App`, above `ToastProvider`: every provider can fail, and a fallback inside
  one would sit under a context that may be broken. `ErrorScreen` reads no context.
- Export backup reads the tasks through `createRepository().list()` in a hook, never from the crashed context,
  and downloads the file of the Backup row through the shared `useBackupDownload`, so Import takes it back
  (`backup-export-import`). The repository is made in the click handler: a throw while rendering the fallback
  would escape every boundary. `useErrorScreen` is the one reader of it besides the todos provider.
- No tasks: a status says so and no file is written (the Backup row hides Export for the same reason). A read
  that fails, or a repository that cannot be made: a status says the tasks could not be loaded.

## Consequences

- Only errors React routes to a boundary (render, lifecycle, effects) show the screen. A throw in an event
  handler or in async code does not, and a failed write stays a toast (`errors-as-toasts`).
- If stored data is what throws, Reload shows the screen again; the exported file is what the person keeps.
- No lint rule bans classes, so the exception lives in the rules.
- Rejected: `react-error-boundary` (a dependency for one small class, `scope.md`); the boundary in `main.jsx`
  (the providers are wired in `App`) or inside the providers; the tasks from `useTodos()`; a "Try again" that
  resets the boundary (the same data throws again); an empty file for no tasks; a function in `storage/` that
  builds the backup (storage would know the file and the DOM).
