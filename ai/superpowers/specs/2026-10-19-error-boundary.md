# Spec: an error screen with a backup export (MY-168)

Decisions in force: `backup-export-import` (the file and its format), `repository-storage-restore` (the
repository and what `list()` does with broken data), `errors-as-toasts` (storage errors in the app are toasts),
`tooltips-as-title`, `accessibility-and-seo` (WCAG 2.2 AA, both themes) and `js-budget-90-kb`. The new record
`error-boundary` holds what is decided here.

## When it shows

- An error thrown while React renders any part of `App`, the providers included, replaces the whole page with
  the error screen: no header, no toast region, no white page.
- Only errors React routes to a boundary: render, lifecycle and effect errors. A thrown error in an event
  handler or in async code is not one, and a failed storage write is already a toast.
- The screen never goes away by itself and has no "Try again": the same data would throw the same error. Reload
  is the way out.

## The screen

- A `<main>` in the app's look: a centred column of centred text, in the middle of the page colour, with the
  header's heading size, the muted text colour and the accent text buttons, from the tokens in both themes.
  `data-theme` was set by the head script before React started and nothing removes it, so the tokens resolve.
- In this order:
  - a decorative error icon in the danger colour (the toast's);
  - the heading "Something went wrong", an `<h1>`: the screen replaces the page, so it is the only one;
  - one sentence: "Export a backup of your tasks, then reload the page.";
  - a row of two buttons, "Export backup" and "Reload", the shared text button, real `<button type="button">`
    named by their visible text;
  - the status line (below).
- Nothing on the screen reads a context, so it works however the providers failed.

## Keyboard and focus

- When the screen appears the focus moves to the heading (`tabIndex="-1"`: focusable by script, not in the tab
  order). A screen reader says "Something went wrong, heading level 1".
- Tab goes to Export backup, then Reload; Enter and Space press them; the focus ring is the app's. Nothing moves
  the focus afterwards: it stays on the button that was pressed.

## Export backup

- The tasks are read from the repository directly (`createRepository()` and `list()`, the backend `VITE_STORAGE`
  picks), never from the crashed context. A read gives the same tasks as the app's own start: validated, a broken
  one skipped.
- With one task or more it downloads `todo-backup-YYYY-MM-DD.json`: the same object, file name and type as Export
  in the Backup row (`buildBackup`, `getBackupFileName`, one shared download), so Import takes it back with
  every task.
- With no tasks nothing is downloaded and the status says "There are no tasks to export".
- If the read fails (a store that cannot be opened, or `createRepository()` itself throws) the status says
  "Your tasks could not be loaded. The browser storage may be blocked or unavailable.", the text the app shows
  for a failed first read. The handler never throws, so the screen does not crash again.
- A localStorage that holds broken data reads as no tasks (`repository-storage-restore`), so that case says
  "There are no tasks to export".
- A successful export says nothing, like Export in the app: the browser's download is the feedback.

## Status line

- One polite `role="status"` region, in the page from the first render, so a message set later is announced. A
  message is a `<span>` keyed by the attempt, so the same message pressed twice is heard twice. The toast region
  is outside this screen, so this is the only live region on it.
- The text is on screen, below the buttons, in the normal text colour; it wraps, never scrolls.

## Reload

Reload reloads the page. The app starts as it always does; if the cause is in the stored data, the screen
returns, and the exported file is what the person keeps.

## Look

- Desktop: the column is at most `--content-max-width` wide, centred both ways, with the page's side gutters.
- At 320px: the same column with a smaller gutter, the buttons wrapping, no horizontal scroll, also at 200% zoom
  and with 150 to 200% text.
- Colours, spacing, radii and sizes are tokens; contrast holds in both themes. Hover on the buttons is the text
  button's own, only where the device can hover. The screen has no motion of its own.

## Out of scope

A retry that resets the boundary, boundaries around single components, catching handler and async errors,
reporting an error anywhere (no backend, no analytics), a page for a script that fails to load before React
starts, a success message after the export, an import on the error screen, and a lint rule for classes.
