# The Category pill counts every task of a category, whatever the filters say

Date: 2026-10-19 · Status: accepted

## Context

The Category pill shows how many tasks each category holds. With a status filter and a search on screen, the
numbers could follow them ("Work (1)" under Completed) or stay on the whole set. An agent adding the next filter
would likely make them follow it, as it would the footer (`footer-acts-on-all-tasks`).

## Decision

- Each option ends with the number of tasks in that category, whatever the status filter and the search say;
  "All categories" is the number of all tasks. It is the rule of the tasks-left counter.
- The numbers are derived during render by a pure util from the tasks and are part of the option's label, so a
  screen reader reads "Work (3)" and the pill's width sizer measures them. They are never stored. A category with
  no tasks reads "(0)".

## Consequences

- The numbers move only when the tasks do, not with each keystroke of the search. Choosing "Work (3)" under a search
  can show fewer than three rows: the number says what the category holds, the list says what matches, and the live
  region says "N tasks shown".
- The pill is as wide as its widest option, `All categories (N)`, so it grows by a digit at 10 and at 100 tasks.
- Rejected: numbers over the shown tasks (they would change with the search and an option could read "(0)" for a
  category that has tasks); counts in the pills of the forms.
