# Plan: the status filter, the counter and the bulk actions (MY-154)

Branch `my-154-status-filter`. Linear issue MY-154, milestone Фильтры, after MY-153 (editing,
deleting, the toast), which is done. MY-164 (the `PillSelect` picker) runs in parallel and touches
only `components/pill-select/`. MY-155 and MY-156 build on `use-filters` from here; MY-160 joins the
footer after it. The spec is `ai/superpowers/specs/2026-10-17-status-filter.md`.

## The author's answers (issue, «Решения автора», 2026-10-16 and 2026-10-17)

All questions are answered, so the work goes from this commit to the code:

- The status is outside the Filters panel; category and sort are MY-156. "Clear completed" has Undo
  and no dialog.
- The status is in the URL from the start: `use-filters`, a hook in `hooks/` over a browser API that
  cleans up after itself, reads and writes `?status=` with `history.replaceState`; the default is
  not written, an unknown value is ignored. MY-155 and MY-156 add their parameters to the same hook,
  so adding one is a small change. The filtering is a pure function in `utils/`; the visible list is
  derived during render, never stored.
- Two buttons, "Mark all as done" and "Mark all as active", each available only when it does
  something. **Chosen here: each is shown only then** (hidden otherwise, not disabled), see below.
- The counter "N tasks left" (a correct `task` / `tasks`) has its own `aria-live="polite"` element;
  it is another event than the toast, and `react.md` gets one line saying so.
- Defaults the author did not object to: the switch is native radios in a segmented look above the
  list; the counter is the active tasks out of all; "Clear completed" shows only with completed tasks
  and shows the toast "N tasks cleared" with Undo (Ctrl/Cmd+Z through the existing toast); the footer
  sits under the list and is absent with no tasks; the empty state under a filter is "No tasks match
  your filters", with no tasks at all "No tasks yet. Add your first one above."; dev port 5189.

## Code

Layers and names follow `structure-and-naming` and `context-folders`; each new folder gets its
`index.js` with its first file.

- `src/constants/filters.constants.js` (new, re-exported by `constants/index.js`) — `STATUS_ALL`,
  `STATUS_ACTIVE`, `STATUS_COMPLETED`, `STATUSES` (`{ id, label }` per segment, in order),
  `DEFAULT_STATUS`, `STATUS_PARAM` (`status`), `FILTERS_CHANGE_EVENT` (`todo:filters`),
  `STATUS_INPUT_NAME` (the radios' `name`) and `CHECKED_STATUS_SELECTOR`. The filter values live
  with the filters, not with the tasks or the storage.
- `src/constants/todos.constants.js` — `TASK_NOUNS` (`{ one: 'task', other: 'tasks' }`) and
  `PLURAL_LOCALE` for the counter and the toast.
- `src/utils/filters.utils.js` (new) — pure: `matchesFilters(todo, filters)`,
  `filterTodos(todos, filters)`, `parseFilters(search)` (a query string to `{ status }`, the default
  for a missing or unknown value, checked by a private `isStatus`) and `buildFiltersSearch(filters)`
  (the query string, a default left out). A new parameter is a constant, a line in `parseFilters`, a line in `buildFiltersSearch` and a
  predicate in `matchesFilters`.
- `src/utils/todos.utils.js` — `countActiveTodos(todos)`, `getTasksLeftMessage(count)` and
  `getTasksClearedMessage(count)` over a private `formatTaskCount` that picks the noun with
  `Intl.PluralRules`, so the plural is the platform's rule and `1` is not a magic number.
- `src/hooks/use-filters.js` — `useFilters()` returns `{ filters, changeFilters }`. The URL is an
  external store read with `useSyncExternalStore`: the snapshot is `window.location.search`, the
  subscription is `popstate` plus `FILTERS_CHANGE_EVENT`, both removed in the cleanup. `filters` is
  derived from the snapshot by `parseFilters` on every render. `changeFilters(patch)` merges the
  patch into the current filters, sets the query of the current URL with `buildFiltersSearch`,
  calls `history.replaceState` and dispatches `FILTERS_CHANGE_EVENT` on `window`.
- `src/hooks/use-todo-footer.js` — `useTodoFooter()`: the counts, the three handlers, the three button
  refs. The handlers and the focus moves are in the spec.
- `src/hooks/use-todo-item.js` — `handleToggle` moves the focus to the neighbour first when the
  toggled task will no longer match `filters`, with the `findFocusTarget` that delete uses. Its last
  resort, when no row is left to focus, is the checked status radio instead of the title field, so
  Ctrl/Cmd+Z works after deleting the last task as it does after "Clear completed".
- `src/context/todos/todos.provider.jsx` — `toggleAll` becomes `markAll(isCompleted)`: the same
  optimistic change and writes, with the target state given by the caller. The toggle had no caller,
  and with two buttons "Mark all as active" must work on a mixed list, which a toggle cannot do.
- `src/components/status-switch/` (new) — `StatusSwitch`: a `<fieldset>` with an `.sr-only` legend
  and one `<label>` per `STATUSES` entry (a native radio and its text), `onChange` calls
  `changeFilters({ status })`. `status-switch.css` follows `theme-switch.css`: the input is the
  segment, the text sits over it, `:checked` is the accent fill, hover only under `(hover: hover)`,
  `forced-colors` uses `Highlight`, and the text over it `forced-color-adjust: none` so the browser's
  backplate does not hide it. The segments are an `auto-fit` grid with a minimum of two touch
  targets, so they share the width and, when large text leaves no room, stack instead of
  overflowing. The fill and the text colour, like the footer buttons' background, ease over
  `--duration-base` as on the other controls; reduced motion is the tokens' job, so these files have
  no block of their own.
- `src/components/todo-footer/` (new) — `TodoFooter`: renders nothing with no tasks; otherwise a
  `<footer>` with the counter `<p aria-live="polite" aria-atomic="true">` and the buttons.
  `todo-footer.css`: a wrapping flex row at the small text size, the buttons as text buttons like the
  toast's, 44px tall, so the controls fit one row at desktop width and two at 320px.
- `src/components/todo-list/todo-list.jsx` — filters with `filterTodos`, then sorts; the empty text
  for "tasks exist but none match".
- `src/components/app/app.jsx` — `<StatusSwitch />` between the form and the list, `<TodoFooter />`
  after the list.

## Deliberate choices

- **The URL is an external store, not state in a component or a provider.** Several components read
  the filters (the switch, the list, the row now, search and the panel later); an own `useState` per
  hook call would split them, and `state-in-context-and-hooks` says the filter is the URL, not
  context state. `replaceState` fires no event, so the hook announces its own write with one
  `window` event that only its instances hear: not a bus, nothing else sends or listens to it.
  `popstate` keeps the page right if an entry is revisited. `react.md` says nothing reads the URL
  during render; the bullet gets the URL named next to `matchMedia` as read through
  `useSyncExternalStore`.
- **The mark-all buttons and "Clear completed" are hidden when they would do nothing, not
  disabled.** The author preferred hiding over a disabled button that needs an explanation. The
  clicked button disappears, so the focus is moved with `flushSync` to the button that appears; the
  footer component stays mounted and returns nothing with no tasks, so its refs outlive a clear and an
  Undo.
- **The footer acts on all tasks, not on the shown ones.** Recorded as `footer-acts-on-all-tasks`: a
  future search or category filter must not turn the counter and the buttons into something that
  changes with every keystroke. "Clear completed" under Active removes tasks that are not on screen;
  the toast names the number and Undo reverts it.
- **"Clear completed" moves the focus to the selected status radio,** not to a task or the title
  field. The radio group is on screen in every state, so the move never depends on what is left, and
  it is not a text field, where Ctrl/Cmd+Z would be the field's own undo and not the toast's. Delete
  follows the same rule when no neighbouring row is left (the author's answer to the first handover).
  `TITLE_INPUT_ID` stays: the form still uses it.
- **The status switch is always on screen,** even with no tasks, so adding the first task does not
  make a control appear.
- **A toggle that removes its row moves the focus first.** Without it a keyboard user checking a
  task under Active loses the focus to the top of the page; the fix reuses delete's lookup.
- **The query holds only the app's filters.** `buildFiltersSearch` builds the string from the
  filters, so a foreign parameter is dropped on the first change; the app has no other.
- **The filtered empty state is not announced.** The counter does not change on filtering and a
  message node that appears with its text is not reliably read; the toast's region is the one
  `role="status"` for transient messages. The author left it out of this task: the search task adds
  one persistent visually hidden polite region above the list, shared by status, search and the
  Filters panel.

## Docs

- `ai/map.md` — `StatusSwitch`, `TodoFooter`, `useFilters`, `useTodoFooter`, `filters.constants.js`,
  `filters.utils.js`, the new `todos.utils.js` names and the `markAll` action.
- `ai/rules/react.md` — the counter's own polite region, one line; the URL next to `matchMedia`.
- `ai/skills/feature.md` — the filter recipe says how a parameter is added. `ai/skills/review.md` —
  the counter counts all tasks, and a button that hides when used hands the focus on.
- `ai/decisions/2026-10-17-footer-acts-on-all-tasks.md` (new, in the index): what the counter and
  the buttons count and act on. `todo-model` goes to `accepted`: the fields, the order, Undo for
  clearing and both empty texts all exist now; the other sorts belong to `filters-and-search`, which
  stays `accepted (not implemented)` until the panel and the search exist.
- Nothing else: `README.md` has no feature list.

## Out of scope

Search (MY-155), category, sort and the Filters panel (MY-156), list animation (MY-158), export and
import (MY-160). Announcing the filtered list, the empty text included, is not built here: MY-155
adds one persistent visually hidden polite region above the list ("N shown" / "No tasks match your
filters") that status, search and the Filters panel share.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size` (JavaScript budget 90 kB, `main` at
  79.43 kB: stop and report if it would be crossed).
- In `pnpm dev` (port 5189), headless Chrome over the DevTools protocol: switching by mouse and by
  the arrows, with Tab entering the group once; `?status=active` and `?status=completed` written,
  All leaving no parameter, `?status=bogus` ignored and left alone, a reload keeping it, the history
  length unchanged, Back and Forward across a hash entry following the URL; the counter text for 0, 1
  and many, its element and mutations (`aria-live`), the accessibility tree of the group and the
  footer; "Clear completed" with its toast, Undo by the button and by Ctrl/Cmd+Z, and where the
  focus lands; both mark-all buttons from a mixed, an all-open and an all-done list, with the focus
  after each; the filtered empty state against "No tasks yet"; a toggle under Active with the
  keyboard; deleting the only task under All, Active and Completed with the focus on the checked
  radio and Ctrl/Cmd+Z putting it back; a reload after each stored change; 320px and desktop in both themes; keyboard only; a
  refused write on "Mark all as done" rolling back with the error toast. Screenshots go to
  `scratchpad\my154\`.
