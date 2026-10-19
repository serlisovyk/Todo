# Plan: an error screen with a backup export (MY-168)

Branch `my-168-error-boundary`. Linear issue MY-168, milestone Полировка. MY-167 (the page footer, the GitHub
icon, the counts in the Category pill, the title counter) runs in parallel and touches `app.jsx`,
`components/index.js`, `ai/map.md` and the README's structure block; whichever branch merges second rebases, so
the edits to those files here are small and local. The spec is `ai/superpowers/specs/2026-10-19-error-boundary.md`.

## The author's answers (issue, «Решения автора», 2026-10-19)

- An error boundary with an export button: yes.
- Chosen here, not in the issue: the sentence under the heading; no export when there are no tasks, with a
  status instead of an empty file; the wording of the two statuses; a shared text button for both buttons.

## Where the boundary goes

`ErrorBoundary` is the outermost element of `App`, above `ToastProvider`. React shows the nearest boundary
above a failing component, and every provider can fail (the theme's lazy `useState`, the todos effect), so a
boundary inside them would miss a provider's own error and its fallback would sit under a context that may be
broken. Above all three, the fallback needs no context: `ErrorScreen` and its hook take nothing from
`useTodos`, `useToast` or `useTheme`. `main.jsx` stays `createRoot` and `StrictMode`; a render error in `App`
itself cannot happen, since it only returns elements.

## Code

Layers follow `architecture.md`; each new file is re-exported from its folder's `index.js`.

- `src/components/error-boundary/` (new): `ErrorBoundary`, the one class outside `storage/`. It holds `state`
  (`{ hasError }`), `static getDerivedStateFromError` and `render`: the fallback is `<ErrorScreen />`, otherwise
  `this.props.children`. No `componentDidCatch`: React 19 already reports a caught error to `console.error`
  (`onCaughtError`), and nothing else has a use for it. No reset: Reload reloads the page. React reads `state`
  and `getDerivedStateFromError` by name, so they are public, unlike the private fields of a storage class.
- `src/components/error-screen/` (new): `ErrorScreen`, markup only, and `error-screen.css`. It calls
  `useErrorScreen()` and draws the icon, the heading with `ref` and `tabIndex={-1}`, the sentence, the group of
  two `TextButton`s and `<p role="status">{message && <span key={attempt}>{message}</span>}</p>`, the pattern of
  `FilterAnnouncer` and `TodoForm`. The icon is `CircleAlert`, the one the toast uses.
- `src/hooks/use-error-screen.js` (new): the logic.
  - `headingRef`, and an effect that focuses it once: synchronizing with the document.
  - `useBackupDownload()` and the status in `useState`: `{ message, attempt }`, like the form's result.
  - `handleExport`: reads the tasks through `createRepository().list()` inside one `try` (the helper returns
    `null` on any failure, the constructor included), then the three outcomes: unreadable, empty, download.
  - `handleReload`: `location.reload()`.
  - Returns `headingRef`, `message`, `attempt` and the two handlers.
- `src/hooks/use-backup-download.js` (new): `useBackupDownload()` returns `downloadBackup(todos)`, the code that
  was inline in `handleExport` of `useTodoBackup`, moved unchanged: `buildBackup`, a `Blob`, an object URL, an
  `<a download>` named by `getBackupFileName`, and the delayed revoke. `useTodoBackup` calls it, so there is one
  download and the error screen's file cannot drift from the app's. Only hooks call it, so it stays out of the
  `hooks/` barrel.
- `src/constants/backup.constants.js`: `NOTHING_TO_EXPORT_MESSAGE` and `INITIAL_EXPORT_RESULT` (`{ attempt: 0 }`),
  re-exported by `constants/index.js`. The failed-read text is the existing `LOAD_ERROR_MESSAGE`.
- `src/components/app/app.jsx`: `<ErrorBoundary>` around the three-level tree (the whole tree is re-indented by
  Prettier, which is what makes the rebase of the other branch conflict there). `components/index.js` gets two
  lines.
- `eslint.config.js`: unchanged. No rule bans classes (`no-restricted-syntax` only bans default exports), so
  the exception lives in the rules and the decision; a new restriction would be a new rule for one class.

## Deliberate choices

- **A hook in `hooks/` reads the repository, not a component and not the context.** The layer table forbids
  `components/` to import `storage/` and `hooks/` to keep data that must survive a reload; a hook that reads
  once to build a download does neither, and `hooks/` is where a component's logic and browser APIs live. Other
  places were weighed and dropped: a new context (it would be the crashed layer again), a function in `storage/`
  that builds the backup (storage would know the file format and the DOM), a read in the component (forbidden).
  `useErrorScreen` is the one reader of the repository outside `context/`; `architecture.md` says so in a line.
- **`createRepository()` runs in the click handler, not during render.** A throw while rendering the fallback
  would escape every boundary and leave the white page the screen exists to prevent. A second instance is fine:
  `list()` reads afresh and keeps nothing; an IndexedDB one opens its own channel that no listener uses.
- **`useBackupDownload` has no React hook inside.** The repo keeps browser-API code in `hooks/`, and `utils/`
  may not touch the DOM. The alternative, repeating the ten lines of the download in the new hook, leaves two
  copies of a file format's writer.
- **Empty: a status, no file.** The Backup row hides Export while there are no tasks, for the same reason: a
  file with `todos: []` imports as "That backup has no tasks".
- **The status wording.** The failed-read text is the app's `LOAD_ERROR_MESSAGE`, one fact one home; "no tasks"
  mirrors the app's own "No tasks yet".
- **Both buttons are `TextButton`s.** One look everywhere, no new variant for one screen; the icon and the
  centred layout carry the weight, with no card around them.
- **No success message and no Undo.** Export changes nothing; the download is the feedback.

## Docs

- `ai/decisions/2026-10-19-error-boundary.md` (new, in the index): the boundary above the providers as the one
  class outside `storage/`, the export read straight from the repository by a hook, the empty and the failed
  read, and what was rejected.
- `ai/rules/react.md` and `ai/rules/style.md`: the class exception in one line each. `ai/rules/architecture.md`:
  the boundary and the one repository reader outside `context/`, two lines.
- `ai/map.md`: the two component folders and two hooks; `README.md`: the two folders in the structure block.
  `ai/skills/feature.md`: the "file in or out" recipe says the download is its own hook now.
- The map is at 149 lines and 11.9 kB, so it is trimmed in this change: the `constants/` entry, which retold
  what each constants file holds, becomes a list of the domains.

## Out of scope

Boundaries around single components, a retry, handler and async errors, error reporting, an import on the error
screen, MY-167's work, the accessibility audit.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size` (JavaScript 84.57 kB gzip before, budget 90 kB: stop
  and report if it would be crossed).
- In `pnpm dev` (port 5187), headless Chrome over the DevTools protocol, with a temporary throw in a component that
  is never committed (`git diff` proves it gone): a throw in a row, in the page and in a provider; the heading
  focused; Export backup with tasks: the file's name and content against the stored tasks, then imported through
  Import into a clean profile (every task, nothing lost) and again into the same profile ("already there");
  zero tasks: the status and no file; a temporarily failing read (a throw in `list()` for localStorage, a stubbed
  `IDBFactory.prototype.open` for IndexedDB): the "could not be loaded" status and no second crash; Reload;
  keyboard only; 320px and desktop, both themes; reduced motion; `VITE_STORAGE=indexeddb` as well. Screenshots go to
  `scratchpad\my168\`.
- `ai/rules/definition-of-done.md`, then the `review` skill, and the whole `git diff main..HEAD -- src
eslint.config.js` read line by line against `style.md` and `react.md`.
