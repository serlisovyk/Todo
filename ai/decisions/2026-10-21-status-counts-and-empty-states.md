# The status switch counts every task, and an empty list names a status only when that status is empty

Date: 2026-10-21 · Status: accepted

## Context

The status switch got numbers like the Category pill's (`category-counts`), and the empty list, which had two texts
(`todo-model`) and said "No tasks match your filters." under every filter, got two more: "All tasks are done." under
Active and "No completed tasks yet." under Completed. With a status, a category and a search all able to empty the list, two orders were possible: the
search or the category first (any narrowing that finds nothing says "match", the status text only when what is left
holds tasks), or the status first. An agent adding the next filter would likely make the numbers follow the filters,
or reach for the first order.

## Decision

- Each segment ends with the number of tasks in it, over every task, whatever the status, the category and the search
  say, as the Category pill and the tasks-left counter do (`category-counts`, `footer-acts-on-all-tasks`). One helper
  counts both lists, so they cannot drift. A segment at `(0)` stays a normal segment.
- A label never breaks inside a segment. When the labels do not fit one row the switch wraps onto a further row, as it
  does with large text; nothing scrolls sideways.
- The status text shows exactly when the segment's own count is 0: Active with every task done, Completed with none
  done, whatever the search and the category say. Every other empty list says "No tasks match your filters." The number
  on the segment and the text always agree.
- The filter live region says the same text as the card, so a screen reader and the screen never disagree.

## Consequences

- "All tasks are done." under a search that finds nothing is accepted: it is true, and no search could change it.
- Rejected: the search or the category first ("All tasks are done." under Active with open tasks only in another
  category is false, and so is "No completed tasks yet." with done tasks in another category); numbers that follow the
  search or the category (a segment would read `(0)` while it holds tasks); disabling or hiding a segment at `(0)` (the
  layout would jump and the control would need its own explanation, which the card gives); an icon or a "Show all"
  button in the card.
