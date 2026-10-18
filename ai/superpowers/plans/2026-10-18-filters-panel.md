# Plan: the Filters panel, category and sort in the URL (MY-156)

Branch `my-156-filters-panel`. Linear issue MY-156, milestone Фильтры, after MY-154 (the status filter,
`use-filters`) and MY-155 (the search, the filter live region), both done; MY-160 (export and import, the
shared `TextButton`) is merged and this branch is rebased onto it. The spec is
`ai/superpowers/specs/2026-10-18-filters-panel.md`.

## The author's answers (issue, «Решения автора», 2026-10-16 and 2026-10-17)

All questions are answered, so the work goes from this commit to the code:

- Category and sort live in the Filters panel, not on screen; every filter is in the URL; the sort sets the
  order, with no drag and drop. The search is already in the URL, so only `category` and `sort` are added: a
  constant, a line in `parseFilters` and `buildFiltersSearch`, a predicate in `matchesFilters`; sorting is a
  pure function of the sort value in `utils/` and the visible list is derived during render.
- "Reset filters" resets only the category and the sort. The panel is closed on every load, even with a choice
  in the URL, and its open state is kept nowhere; the dot on the button tells about the choice.
- By default: Priority sorts High, Medium, Low and newest first within a priority; completed tasks are at the
  bottom under every sort; `Escape` closes the panel and returns the focus to the Filters button; the panel opens
  instantly (MY-158 animates); the existing filter live region announces category and sort changes; the focus
  after an edit that hides the row already follows every saved field. The Filters button has visible text.
  JavaScript budget 90 kB (`main` is 82.55 kB, MY-160 added about 1.1 kB): report the size.

## Code

Layers and names follow `structure-and-naming`; each new folder gets its `index.js` with its first file.

- `src/constants/filters.constants.js` — `CATEGORY_PARAM`, `SORT_PARAM`; `CATEGORY_ALL`,
  `CATEGORY_FILTERS` (the "All categories" option followed by `CATEGORIES`), `DEFAULT_CATEGORY_FILTER`;
  `SORT_NEWEST`, `SORT_OLDEST`, `SORT_PRIORITY`, `SORTS` (the labels), `DEFAULT_SORT`; `PANEL_DEFAULTS` (what
  Reset applies); `CLOSE_FILTERS_KEY`; the radio names `CATEGORY_INPUT_NAME`, `SORT_INPUT_NAME` and
  `CHECKED_CATEGORY_SELECTOR`, next to the status ones. `DEFAULT_CATEGORY` stays the default of a new task.
- `src/utils/filters.utils.js` — `parseFilters` returns `{ status, category, sort, query }` and
  `buildFiltersSearch` writes the non-default `category` and `sort` between `status` and `q`; a private
  `matchesCategory` joins the status and query predicates in `matchesFilters`; `hasPanelChoice(filters)` says
  whether the category or the sort is not the default (the dot, the Reset button). `getFiltersKey` needs no
  change: it is the query string of the filters, so the announcement hook sees category and sort changes. The
  three "is this id one of the options" checks are one call of `isKnownId`, moved from `todos.utils.js`, where
  `sanitizeTodo` had it, to `validation.utils.js`, instead of an `isStatus` and two more of the same shape.
- `src/utils/todos.utils.js` — `sortTodos(todos, sort)`: completed tasks last, then the order the sort names
  (private comparators: newest, oldest, priority by the rank of its place in `PRIORITIES`, then newest).
- `src/hooks/use-filters-toolbar.js` (new) — the open state, the button's ref, the panel's ref and id, `hasChoice`
  for the dot, `handleToggle`; a document `keydown` listener (removed in its cleanup) closes the panel and
  focuses the button when `Escape` comes from inside the panel or from the button.
- `src/hooks/use-filters-panel.js` (new) — the checked category and sort, `handleCategoryChange`,
  `handleSortChange`, `hasChoice` and `handleReset`, which commits the reset with `flushSync` and then focuses
  the checked category radio.
- `src/components/filters-toolbar/` (new) — `FiltersToolbar`: a `div` with `SearchField`, the Filters button (icon,
  text, the dot, the hidden "(applied)") and `FiltersPanel`. A grid: the search field and the button on one row,
  the panel across both columns; one column under 480px. It replaces `SearchField` in `App`.
- `src/components/filters-panel/` (new) — `FiltersPanel`: the card, `hidden` while closed, two `FilterGroup`s and,
  while there is a choice, a `TextButton` "Reset filters". It passes a `CategoryDot` as `renderMark`.
- `src/components/category-dot/` (new, in a `refactor:` commit of its own before the feature commits) —
  `CategoryDot({ categoryId })`: the 12px dot, a `span` with `data-category` and `aria-hidden`, the one look
  `todo-form-dot` and `todo-edit-form-dot` drew twice; `TodoForm`, `TodoEditForm` and the panel render it and
  the two classes go. The row's 8px meta dot and the priority flags stay as they are.
- `src/components/filter-group/` (new) — `FilterGroup`: a `<fieldset>` with a visible `<legend>` and a radio per
  option, an optional `renderMark(id)` before the text; `legendText`, `name`, `options`, `value` and `onChange`
  like `PillSelect`. The radios are drawn like the task checkbox: `appearance: none`, `--color-border-control`
  outline, `--color-accent` fill when checked.
- `src/components/todo-list/` — `sortTodos(visibleTodos, filters.sort)`.
- `src/components/app/app.jsx`, `src/components/index.js` — `FiltersToolbar` instead of `SearchField`; the
  barrel gains the three components.

## Deliberate choices

- **The Filters button is part of `FiltersToolbar`, not a component of its own.** The button and the panel share
  the open state and the refs, so their parent owns them (`useFiltersToolbar`); the button is a few lines of that
  parent's own markup. The panel's own logic, the radios and Reset, is another hook, `useFiltersPanel`.
- **The panel is always in the page and `hidden` while closed.** `aria-controls` then always names an element,
  which a missing one while collapsed would not; the markup is a few radios. The stylesheet restates `hidden`
  because the card sets its own `display`.
- **The panel sits between the search row and the status switch.** The DOM order is the visual order: button,
  panel, then the status radios, so the Tab key enters the panel right after its button and the status switch is
  not between them.
- **`Escape` is a document listener, not an `onKeyDown` on the panel.** `jsx-a11y` rejects a key handler on any
  non-interactive element, a `div`, `section`, `fieldset` or `form`, and the rule of `react.md` already allows an
  effect for a document key listener. It acts only when the event target is inside the panel or is the button, so the search
  field's `Escape` and the edit form's `Escape` keep their meaning. It stays attached while the panel is closed:
  a hidden panel cannot hold the focus, so it never acts.
- **Opening does not move the focus.** The button keeps it (the disclosure pattern), the next Tab enters the
  panel; closing with `Escape` is the only move, to the button.
- **Reset is offered only while it would change something, and it hands the focus on.** Like the footer's
  buttons: a button that does nothing is not offered; it leaves with the change, so the focus goes first to the
  checked category radio, found after the change is committed with `flushSync` (`react.md`). The panel grows by
  one row while the choice is set; nothing the user is pointing at moves.
- **A sort change speaks the same "N tasks shown".** The announcement is keyed by the filters' query string, so a
  new sort is a new key and a message with the same text is read again (the span is keyed by the attempt). A
  message naming the sort would be a new message type for a result the author already decided is announced.
- **The sort is derived and stored nowhere.** `sortTodos` is a pure function of the tasks and the sort value,
  called in render by `TodoList`; the stored order never changes.
- **The "Priority" label is not extended.** The order is High, Medium, Low as decided; the issue names the
  option "Priority", and a longer label would repeat the order on screen.
- **Rank by place in `PRIORITIES`.** The list is ordered Low, Medium, High, so a task's rank is its index and
  the priority comparator needs no table of its own.

## Docs

- `ai/map.md` — the four components and the two hooks, the constants and utils lines; it is at its limit, so the
  entries that grew are shortened in the same change.
- `ai/skills/feature.md` — the filter recipe: category and sort are the panel's, how an option list and a
  `FilterGroup` are added, the sort as a pure function; the picker recipe names `CategoryDot` as the mark.
- `ai/skills/review.md` — the Filters line: a reload restores all four, the panel is closed on load, Reset,
  `Escape` returns to the button.
- `ai/decisions/2026-10-16-filters-and-search.md` — `Status` becomes `accepted`, nothing else changes.
- `ai/decisions/2026-10-18-filters-panel-behavior.md` (new, in the index) — what the panel decides that a later
  agent would likely undo: closed on every load with its state kept nowhere, Reset covers only the category
  and the sort, completed tasks stay at the bottom under every sort.
- Nothing else: `README.md` has no feature list, `ai/rules/*` still say what holds.

## Out of scope

List animation (MY-158), several categories at once, more sorts, a sort direction toggle, keeping the panel
open, a visible count of applied filters, export and import (MY-160, merged).

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size` (JavaScript budget 90 kB: stop and report if it
  would be crossed).
- In `pnpm dev` (port 5186), headless Chrome over the DevTools protocol: a reload of
  `?status=active&category=work&sort=priority&q=report` restores all four; defaults are never written and
  nothing is written at start; `?category=xyz&sort=abc` is ignored without errors; the Filters button (text,
  icon, `aria-expanded`, `aria-controls`, the dot and the accessible name with and without a choice); the
  panel closed on every load, opening under the toolbar and pushing the list, `Escape` closing it with the
  focus on the button, and the search and edit `Escape` unchanged; the radios with dots; the three sorts with
  completed tasks last, priority with newest first inside a priority; Reset (visible only with a choice,
  focus, status and query untouched); the live region on category, sort and Reset, silent on load, on open and
  close and on task changes; an edit that changes the category and hides the row, and one that changes the
  priority under the Priority sort; the empty text; keyboard only; 320px and desktop in both themes; forced
  colours; reduced motion; a reload after each change. The add form and the edit form, with the open category
  list, are screenshotted at 1000px and 320px in both themes before and after the `CategoryDot` refactor and
  compared. Screenshots go to `scratchpad\my156\`.
