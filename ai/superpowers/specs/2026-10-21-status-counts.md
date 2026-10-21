# Spec: counts on the status switch, empty texts by status (MY-172)

Decisions in force: `category-counts` (a count is every task of its kind, whatever the filters say),
`footer-acts-on-all-tasks` (the tasks-left counter does the same), `filter-pills` (the status stays a radio group
and a URL parameter), `accessibility-and-seo` (WCAG 2.2 AA, both themes), `design-tokens` and `js-budget-90-kb`. One
record is new: `status-counts-and-empty-states`.

## Counts on the status switch

Each segment ends with a number in parentheses, like the Category pill: `All (6)`, `Active (2)`, `Completed (4)`.

- All is the number of all tasks, Active the open ones, Completed the done ones, so All is always Active plus
  Completed. They count every task, whatever the status, the category and the search say, exactly as the Category pill
  counts: the same helper does both, so the two cannot drift apart.
- They are derived from the tasks on every render and never stored. They change at once after an add, a check or an
  uncheck, a delete, Undo, Mark all as done or active, Clear completed, an import and a change from another tab, and
  never after a change of the status, the category or the search. An edit that leaves the task's state alone moves
  nothing. While the tasks load they read `(0)`, as the Category pill does.
- A screen reader reads each radio as its text: "Filter by status", then "Active (2), radio button, 2 of 3". The
  counts are no live region: the tasks-left counter and the toasts already say what a change did.
- A segment with `(0)` stays a normal, selectable segment. The list under it says why it is empty (below).

### Look

Colours, spacing, radii and sizes are the tokens' and unchanged; the count is part of the label's text, in the same
weight and colour. A label never breaks inside a segment (`Completed` and `(4)` stay together).

- The segments share the width equally while the labels fit, as now, and each label keeps 4px of air on both sides, so
  the text never touches the segment's curved end. On a phone, the labels fit one row at 320px wide with one-digit
  counts, at 330px with two digits and at 360px with three.
- When they do not fit one row, the segments wrap onto a further row, as they already do with large text: a segment
  that wraps takes the rest of its row. There is never a horizontal scroll, and every segment stays at least 44px tall.
  Larger counts, a classic scrollbar beside a 320px window, and 150 to 200% text are such cases at 320px.

### The keyboard

Unchanged: Tab enters the group once, on the checked segment; the arrow keys move the selection and the focus
together and wrap at the ends; a change applies at once.

## The empty list

A text in the card, never an icon, a button or a link.

| State                                                                    | Text                                     |
| ------------------------------------------------------------------------ | ---------------------------------------- |
| the tasks are loading                                                    | Loading tasks… (unchanged)               |
| there are no tasks at all, whatever the filters                          | No tasks yet. Add your first one above.  |
| Active, and no task is open: the Active count is 0                       | All tasks are done.                      |
| Completed, and no task is done: the Completed count is 0                 | No completed tasks yet.                  |
| tasks exist, none is shown, and the status holds tasks (its count is 1+) | No tasks match your filters. (unchanged) |

The texts end in a full stop like the two that exist; the three new ones are constants (`filters.constants.js`).

### Which text wins

The order is the table's, from the top: loading, no tasks at all, then a shown list (no text), then a status text,
then the filters text. A status text appears **exactly when the segment's own count is 0**, whatever the search and
the category say; every other empty list says "No tasks match your filters."

- Active with every task done: "All tasks are done." with no search, with a search that finds nothing and with any
  category. It is a claim about all tasks, true whatever else is set, and the search cannot change it.
- Active with open tasks only in Study, category Work chosen: "No tasks match your filters." There are open tasks, the
  category hides them, and "All tasks are done" would be false. Likewise Completed with done tasks only in Study and
  category Work chosen.
- Active with open tasks and a search that finds none of them: "No tasks match your filters."
- All never shows a status text: with tasks it holds all of them.
- The number on the segment and the text agree: `Active (0)` goes with "All tasks are done.", `Completed (0)` with
  "No completed tasks yet."

### What a screen reader hears

The filter live region (`role="status"` above the list) says the same text as the card whenever the filters change
while tasks exist and none is shown: "All tasks are done.", "No completed tasks yet." or "No tasks match your
filters.", so the card and the region never disagree. With no tasks at all it stays silent, as now (the form says
"Task added"); with tasks shown it says "N tasks shown". It still speaks only when the filters change and its text
differs from the last one, once.

## Focus

Unchanged. After the last open task is checked under Active, or the last done one unchecked under Completed, the focus
has already moved (the next row, else the previous one, else the checked status radio), and the card appears.

## Out of scope

Counts that follow the status, the category or the search; a count in the live region; a count on the pills of the
forms; disabling or hiding a segment at `(0)`; an icon, a button or a link in an empty card ("Show all"); a change to
"Loading tasks…" and "No tasks yet. Add your first one above."; an announcement when a change of the tasks, not of the
filters, empties the list; `forced-colors` styling.
