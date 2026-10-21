# Plan: counts on the status switch, empty texts by status (MY-172)

Branch `my-172-status-counts`. Linear issue MY-172, milestone Полировка, after MY-170 (the double click). It runs in
parallel with MY-171 (a code cleanup), which also edits `todo-list`, `todo-item`, the constants and utils barrels
(barrels of more than four names become `export *`), `ai/map.md` and `ai/skills/feature.md`, so the edits to those
files stay small and local, and whichever branch merges second rebases. The spec is
`ai/superpowers/specs/2026-10-21-status-counts.md`.

## The author's answers (issue, «Решения автора», 2026-10-19)

Counts on the status switch: yes, in parentheses like the Category pill, `All (6)`, `Active (2)`, `Completed (4)`,
over all tasks. Empty states by status: yes, text only. If the labels with counts do not fit one row at 320px the
switch wraps, as it does with large text; no horizontal scroll. The plan decides what the issue left open: which text
wins when a status and a search or category both explain an empty list, and what the live region says.

## What was measured first

Real labels in headless Chrome, 6 tasks, on the unchanged stylesheet (a script wrote the labels into the DOM):

- The segment's label may break at its space. With `Completed (4)` in a 85px share it wraps to two lines, and the row
  grows to 48px: `white-space: nowrap` on the label is needed.
- With only that, the labels have no air: in the tightest one-row case the text touches the capsule's curved end and the
  texts of two neighbours sit 4px apart. A `padding-inline` of `--space-1` on the label (the smallest token, enough to
  clear the curve) costs 24px of the row; `--space-2` costs 48px and wraps the row at 320px for any count.
- With `--space-1`, measured on a phone with no scrollbar: at 320px one row while every count has one digit and a wrap
  from two digits in two of them (10 or more tasks); from 330px one row up to two digits; from 360px one row up to
  three digits. Beside a classic scrollbar (a 273px column at 320px) and at 256px it wraps at once. A wrap puts two
  segments on the first row and the last one takes the rest of the second, each 44px tall, the page without a
  horizontal scroll: the wrap the author allowed.

## Decisions taken in this plan

- **The status text wins exactly when the segment's own count is 0.** The issue's two status cases read as claims
  about all tasks ("all are done", "none completed yet"), so they hold only when the status has no tasks at all. If it
  has some and the list is still empty, the search or the category hid them, and the honest text is "No tasks match
  your filters." The alternative, the search or category first (any narrowing that finds nothing says "match"; the
  status text only when the narrowed set is non-empty), says "All tasks are done" under Active with open tasks in
  another category, which is false. A search that finds nothing under an all-done Active says "All tasks are done.":
  true, and it is the reason no search could help. The number on the segment and the text then always agree. The rule
  is in the spec, and in a decision record, because the other order is the obvious one to "fix" it to.
- **One pure helper builds both labelled lists.** `getCategoryFilterOptions` already counts through a private
  `countTodosInCategory`; the status list is the same map with another predicate. A private
  `getCountedOptions(todos, options, matches)` replaces it and serves both, so the two kinds of count cannot drift
  and `getStatusFilterOptions(todos)` is one line over `matchesStatus`. The status and the category use the same rule
  already (`matchesStatus`, `matchesCategory`), so no new predicate. Rejected: a second copy of the map with its own
  label format.
- **The empty text is one pure function, used twice.** `getEmptyListMessage(todos, filters)` in `filters.utils.js`
  returns the filters text unless the status holds no tasks, then the text of that status
  (`EMPTY_STATUS_MESSAGES`, keyed by the status id, in `filters.constants.js`; All has none, so it falls back). The list
  card renders it and the announcer says it, so the two cannot disagree. `getFilterResultMessage(todos, filters)`
  (silent with no tasks, the empty text when none is shown, `N tasks shown` otherwise) moves the announcer's decision
  out of the hook; `getTasksShownMessage` loses its zero branch and its import.
- **The three texts end in a full stop** like the two that exist, and are constants. `NO_MATCHES_MESSAGE` gains the
  full stop it already shows in the card (the region said it without one), so one string serves both. The loading and
  no-tasks texts stay inline in `TodoList`, as they are.
- **`StatusSwitch` reads the tasks itself.** It calls `useTodos()` and `getStatusFilterOptions(todos)` during render
  and keeps its markup; a derived list and one handler are not the logic that earns a hook (`react.md`). The toolbar
  has a hook because it also owns Reset, a ref and `flushSync`.
- **The label does not wrap and has a little air.** `.status-switch-label` gets `white-space: nowrap` and `padding-inline:
var(--space-1)`; the segments' flex already wraps to rows and takes the rest of a row, so nothing else changes.
- **A decision record** `status-counts-and-empty-states`: the status counts follow `category-counts`, the status
  text wins exactly when the segment's count is 0, and the segments are never disabled at `(0)`.

## Code

- `src/constants/filters.constants.js` (barrel lines) — `ALL_DONE_MESSAGE`, `NO_COMPLETED_MESSAGE`,
  `EMPTY_STATUS_MESSAGES`; the full stop in `NO_MATCHES_MESSAGE`.
- `src/utils/filters.utils.js` (barrel lines) — `getCountedOptions` (private), `getStatusFilterOptions`,
  `getEmptyListMessage`, `getFilterResultMessage`; `getCategoryFilterOptions` over `getCountedOptions`.
- `src/utils/todos.utils.js` (barrel unchanged) — `getTasksShownMessage` without the zero branch.
- `src/hooks/use-filter-announcement.js` — the message from `getFilterResultMessage`.
- `src/components/status-switch/` — the counted options; `status-switch.css` — `nowrap` and the inline padding.
- `src/components/todo-list/todo-list.jsx` — the empty-filters branch renders `getEmptyListMessage` (a small, local
  edit).

## Docs

- `ai/decisions/2026-10-21-status-counts-and-empty-states.md` (new) and its line in the index.
- `ai/map.md` — the `status-switch`, `todo-list` and `filters` utils lines; it is at 149 lines and 11.9 KB of 150 and
  12 KB, so words are cut from other lines in the same change.
- `ai/skills/feature.md` — the filter recipe: the status labels carry counts through the same helper, and the empty
  text is `getEmptyListMessage`. `ai/skills/review.md` — the filters checklist names the three texts and the counts.
- `README.md` — "with task counts" in the filters feature line.

## Out of scope

As the spec: counts that follow the filters, a count in the live region, counts on the forms' pills, disabling a
segment at `(0)`, an action in an empty card, an announcement when the tasks (not the filters) empty the list.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`: report the sizes (JavaScript budget 90 kB, CSS 8 kB).
- In `pnpm dev` (port 5187), headless Chrome over the DevTools protocol, both themes, desktop, 320px and 256px:
  - the counts after an add, a check and an uncheck, a delete, Undo, Mark all as done and as active, Clear completed
    and an import, each time read from the segments and compared with the tasks; the counts with a search and a
    category set (unchanged), and equal to the Category pill's "All categories (N)";
  - the accessibility tree: each radio named `All (6)`, `Active (2)`, `Completed (4)`, the group named "Filter by
    status", no description equal to a name; the arrow keys in the radio group, wrapping, one tab stop;
  - the empty card in every combination of status (All, Active, Completed), search (none, a miss) and category
    (All, a category with and without the status's tasks), on a list of mixed tasks, an all-done list, an all-open
    list and no tasks: each against the table in the spec;
  - the live region log (a `MutationObserver`) on each change of status, search and category: the same text as the
    card, once, silent when the text repeats and with no tasks;
  - the switch at 320px and 256px with one-, two- and three-digit counts: one row or a wrap, no horizontal scroll,
    44px segments; 200% text; reduced motion; the console.
    Screenshots go to `scratchpad\my172\`.
- Then `ai/rules/definition-of-done.md`, the `review` skill, and the whole `git diff main..HEAD -- src` read line by
  line against `ai/rules/style.md` and `ai/rules/react.md`.
