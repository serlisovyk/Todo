# The footer counts and acts on all tasks, not on the filtered list

Date: 2026-10-17 · Status: accepted

## Context

Under the list sit a counter ("N tasks left") and the bulk buttons. With a status filter now, and a
search and a category filter to come (`filters-and-search`), each of them could follow what the list
shows or stay on the whole set. An agent adding the next filter would likely make the footer follow
it.

## Decision

- The counter is the number of active tasks out of all tasks, whatever the status, search or
  category.
- "Mark all as done", "Mark all as active" and "Clear completed" act on every task, and each shows
  only while it would change something among all tasks. Under the Active filter, "Clear completed"
  therefore removes tasks that are not on screen; its toast says how many and offers Undo.
- The footer is absent with no tasks at all, and present when tasks exist but the filter shows none.

## Consequences

- A later filter touches the list and not the footer; the buttons and the counter never depend on
  `use-filters`.
- Export and import join the same footer and act on all tasks too.
- Rejected: a counter and buttons over the shown tasks. They would change with every keystroke of the
  search, and "Mark all as done" over a search result would leave the rest of the list open without
  saying so.
