# A task has a title, a fixed category and a priority; no due date

Date: 2026-10-16 · Status: accepted

## Context

Planning considered due dates with a date picker, user-defined categories with colours, and a
manual order by drag and drop. The author kept the model small.

## Decision

- Fields: `id` (`crypto.randomUUID()`), `title` (trimmed, not empty, at most 200 characters),
  `category`, `priority` (`low`, `medium`, `high`), `completed`, `createdAt`, `updatedAt` (ISO).
- Categories are a fixed list in the constants: Work, Personal, Study, Shopping, Health. Each
  colour is a token named after its category.
- No due date and no manual order: the order comes from the sort.
- Completed tasks sink below the active ones under every sort; the sort applies inside each group,
  newest first by default.
- Deleting asks nothing and offers Undo in a toast for 5 seconds; clearing completed tasks too.
- An empty list shows text in its place: "No tasks yet" or "No tasks match your filters".

## Consequences

- A new field follows the `feature` skill and the shared validator.
- Due dates, custom categories and drag and drop are in `rejected-features`.
