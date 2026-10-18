# The Filters panel starts closed, Reset covers the category and the sort, completed tasks stay last

Date: 2026-10-18 · Status: superseded by 2026-10-18-filter-pills.md

## Context

`filters-and-search` says where the category and the sort live and that the URL holds every filter. Building
the panel left choices a later agent would be tempted to "improve": open the panel when the URL holds a choice,
keep it open across reloads, make Reset clear the status and the search too, or let a sort rank completed
tasks among the open ones.

## Decision

- The panel is closed on every load, even when the URL holds a category or a sort; the dot on the Filters
  button says so. Open or closed is kept nowhere: not in the URL, not in storage.
- "Reset filters" resets the category and the sort only. The status and the search have their own controls on
  screen, so resetting the panel never touches what is outside it. The button is offered only while the
  category or the sort is not the default.
- Completed tasks sit at the bottom under every sort; the sort orders the open tasks and the completed ones,
  each on their own. Priority runs High, Medium, Low, newest first within a priority.

## Consequences

- A shared link that carries a category or a sort opens with the list already filtered and the panel closed.
- Rejected: opening the panel when a choice is set; remembering the open state in the URL or `localStorage`,
  since a view detail would become a second state and a shared link would carry it; a Reset that clears every
  filter; a priority sort that ranks the completed tasks as well.
