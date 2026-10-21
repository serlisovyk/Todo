---
name: feature
description: Use when adding or changing a user-facing feature in the Todo app — which layer owns its values, stored data, state, logic, markup and styles, and how they connect.
---

# Feature

## When to use

Adding or changing anything a user sees or anything that touches the tasks: a field, a control,
a filter, a toast, an animation, the stored format.

## Steps

1. Read `ai/map.md` and the rules (`architecture`, `react`, `style`); do not rediscover the code.
2. Split the feature across the layers before writing code:
   - **Constants** — every new shared value (a storage key, a list of options, a limit, a
     duration JS needs) in the matching `*.constants.js`; the barrel's line for a file of more than
     four names is `export *`, so a name added there needs no edit (`ai/rules/style.md`).
   - **Utils** — the logic as pure functions in a `*.utils.js`: filtering, sorting, validating,
     splitting text, the list change an action applies. No React, no DOM, no storage.
   - **Storage** — only when the stored data or the repository changes: `ai/skills/storage.md`.
   - **Context** — a folder `context/<name>/` with the object (`<name>.context.js`), the provider
     (`<name>.provider.jsx`) and the hook. The state is `useState` in the provider; the action
     changes the UI first, writes through the repository, and on failure rolls back and shows the
     message as a toast. It never throws or rejects; a caller that needs a result gets an empty
     one on failure (`null`, `[]`).
   - **Hook** — what components call (`useTodos()`: the tasks, `isLoading` and the actions),
     `use-<name>.js` in the context's folder. The folder's barrel exports only the
     provider and the hook, so the object stays internal. A browser API (the URL, `matchMedia`, a
     document key listener) gets its own `use-*` hook in `hooks/` that cleans up after itself, and
     so does a component's own logic (a form's fields, submit and focus): `use-<component>.js`. A
     hook only one provider uses sits in that provider's folder instead.
   - **Component** — a folder in `components/` with its `.jsx`, its `index.js` and its `.css`
     once it has rules; `components/index.js` re-exports the folder. It reads through the hook,
     renders, and reports actions through `on<Action>` props or the hook's actions. Another
     component imports it from `@/components/<name>`.
   - **Files** — a new folder gets its `index.js` with its first file; every new public name is
     re-exported there, and other folders import it through `@/<folder>`.
   - **Styles** — colours, sizes and durations from the tokens (`tokens.css` zeroes the durations
     under reduced motion, a component adds no block of its own), keyframes in `animations.css`; a
     category or priority colour through `data-category` / `data-priority`.
3. Providers are wired in one place, inside `App`; nothing else calls `createRoot`.
4. Verify per `ai/rules/definition-of-done.md`: use the feature on desktop and at 320px, in both
   themes, and reload for anything stored.

## Recipes

**A task field** — the validator accepts it (a default for older data), `todo-form` sets it,
`todo-item` shows it. Export and import need nothing extra: they use the same validator
(decision `backup-export-import`).

**A filter** — its allowed values and default in `filters.constants.js`; the URL query is its state:
`use-filters` reads it with `useSyncExternalStore` and `changeFilters(patch)` writes it with
`history.replaceState` (a default is not written, an unknown value is ignored), so every component
sees the same filters. A new one is a line in `parseFilters` and `buildFiltersSearch` and a
predicate in `matchesFilters`, all pure in `filters.utils.js`; the shown list is derived in render
with `filterTodos`, never stored. The search query (`q`) is the free-text one: the field shows the raw
text; the filter, `splitByQuery` (the plain and `<mark>` parts a row renders, never HTML) and the
announcement trim it. `FilterAnnouncer` says the result when the filters change and its text differs from the last one,
so a new filter needs nothing there. The control: the status stays a radio group on screen; the category and the
sort are `PillSelect`s in `FiltersToolbar`, on the row under the search field (decision `filter-pills`), their
options a list in `filters.constants.js` and a `CategoryDot` as the category's `renderMark`; the category's
labels carry each category's task count (`getCategoryFilterOptions(todos)`: every task, whatever the status and the
search, decision `category-counts`). A Reset icon
button shows while `canResetFilters`, applies `RESET_DEFAULTS`, commits it with `flushSync` and focuses the
category pill through its `ref`, since the button leaves. The sort is no predicate: `sortTodos(todos, sort)`
orders the shown list in render, completed tasks last under every sort. The footer's counter and buttons
ignore the filters (decision `footer-acts-on-all-tasks`). The status labels carry counts the same way
(`getStatusFilterOptions`), and an empty list says why through `getEmptyListMessage`, which the card and the
announcer share (decision `status-counts-and-empty-states`).

**A toast** — `const { showToast } = useToast()`, then `showToast({ message })`; an undoable action
adds `actionLabel` and `onAction`, an error `isError: true` (a danger icon, no action). One toast at a time, a new one replaces the old; `ToastRegion` is
the one live region, the toast goes after `TOAST_DURATION` and waits while hovered or focused. An
undoable action keeps what it removed and `restoreTodos` puts it back at the same position: the
callback runs seconds later, so it must not read state from its own closure. The focus moves before
the row goes (to the next task, else the previous one, else the checked status radio) and after Undo (to the restored one); a change that must be on screen
before the focus moves is committed with `flushSync` first. An action toast also answers Ctrl/Cmd+Z
outside text fields (`useToastShortcut`, in `Toast`), and its button names the keys in
`aria-keyshortcuts`. A toast enters with `@starting-style` and leaves through `useToastExit`: the
timer and the button set `is-leaving`, CSS moves it away and `transitionend` removes it (at once
under reduced motion, where no transition runs), and while it leaves it takes no input. Its exit also arms a document
click listener that cancels the repeated clicks that follow, since the toast is gone before a double click ends.

**An icon button** — an `IconButton` with a `lucide-react` icon, a `labelText` (its `title`: the name and
the tooltip, no `aria-label`) and, for a destructive one, `tone="danger"`. It is 44px and always
visible (a touch screen has no hover); `ref`, `type` and handlers go to the `<button>`. A button in a
form that must not count as leaving the field cancels the default of `mousedown` (`TodoEditForm`). An icon that
is a link (`GithubLink`) is its own component with the same look, named by its `title`; one that opens a new tab
says so in the `title` and has `target="_blank"` with `rel="noopener noreferrer"`.

**A text button** — a `TextButton`: its children are the label, `ref`, `type` and handlers go to the
`<button>`. One look everywhere (the footer, the toast's action, the backup row); it has no `className` and no
variants, and a layout need, such as the toast keeping its action at the end, is the container's CSS.

**A file in or out** — the pure parts (the object written, the file name, the whole-file check, the split into
new, present and broken tasks, the summary) are in `backup.utils.js`; the `Blob` and `<a download>` are
`useBackupDownload`, which the error screen's export shares; the `<input type="file" hidden>` and the import
flow are one hook, driven by real buttons (`useTodoBackup`). An import
rejects a file by `file.size` before reading it, checks the whole file, then writes only the new valid tasks
with `restoreTodos`, which says whether the write held: a refused write shows the storage error toast and no
summary. Every failure is an error toast and changes nothing; the input is cleared after each choice, so the
same file can be chosen again (decision `backup-export-import`).

**A picker** — a `PillSelect` over a short fixed list. The caller passes `renderMark(id)`, the mark
for one option (a `CategoryDot`, a flag with `data-priority`, an icon); the pill shows it for the
value and the open list shows it in each option where the browser has `base-select`. The text of an
option always says what its mark says, and the list stays the browser's (decision
`base-select-pickers`). A mark is optional: an option whose `renderMark` returns nothing has no mark span,
and the closed pill, whose indicator is then empty, starts its text at the dot's offset, so "All categories"
leaves no slot. A `ref` goes to the `<select>`, for a caller that moves the focus to it.

**A limit counter** — a field with a character limit has a `TitleCounter` under it. `getTitleCounterText(length)`
is empty until `TITLE_COUNTER_THRESHOLD` characters remain, so the element stays in the DOM and the field's
`aria-describedby` always points at it. Its own `role="status"` says `getTitleCounterMessage(length)`, one text per
range (near the limit, at it), so it speaks when the range changes and never on each keystroke: no timer, no state.
The field's change handler stores `limitTitle(value)`, a cut by `.length` that never leaves half of a surrogate pair,
so the counter, `isValidTitle` and the stored title count alike in every browser; `maxLength` stays on the field, but
a browser may count it in visible characters and let more in.

**An animation** — a colour that changes on hover or selection is a `transition` of that property over
`--duration-base`, which reduced motion zeroes in `tokens.css`; `@starting-style` for an element that
enters, applied only in the state that means "added" (`todo-item.css` waits for the add form's focused
title). The list uses no View Transition: it takes the page's clicks while it runs, so a reorder, a delete,
Undo and a filter change are instant and a row that changes in place (a checked task) is a CSS transition
(decision `list-motion-without-view-transitions`). A browser starts no transition for an element React moves in
the DOM (a task checked sends its row down), so a toggling row carries `data-toggling` (`useTodoItem`, cleared
on the next frame) and `todo-item.css` gives it a `@starting-style` with the look of the state it came from. A
reorder animation, if one is wanted, is FLIP through the Web Animations API. The theme's reveal,
`useCircleTransition` in `context/theme/`, is the one View Transition and checks the feature and the
reduced-motion query itself.

## Avoid

What the rules and decisions do not already say loudly:

- The same data kept in two places: a copy of the tasks in a component, a counter in state.
- An effect that watches state to do what an event handler should do.
- A placeholder control, section or state for a feature that does not exist yet.
- A colour, spacing or duration literal outside the tokens.
