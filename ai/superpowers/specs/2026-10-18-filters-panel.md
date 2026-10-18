# Spec: the Filters panel, category and sort in the URL (MY-156)

Decisions in force: `filters-and-search` (a disclosure panel under the toolbar that pushes the list down, a
dot on the button, "Reset filters", every filter in the URL with defaults left out and unknown values
ignored), `tooltips-as-title` (the Filters button has visible text, so it has no `title`),
`footer-acts-on-all-tasks` (the counter and the buttons ignore category and sort), `design-tokens`,
`accessibility-and-seo` (WCAG 2.2 AA, both themes), `js-budget-90-kb` and `rejected-features` (no drag and
drop: the sort alone sets the order). List animation (MY-158) is another task, so the panel opens instantly.

## The button

In the toolbar, on the row of the search field and next to it; below 480px it sits under the search field and
takes the full width, because the search field would not fit beside it at 320px. It is a real `<button
type="button">` with the Lucide `SlidersHorizontal` icon (decorative) and the visible text "Filters".

- `aria-expanded` says whether the panel is open and `aria-controls` names the panel, which is always in the
  page, hidden while closed.
- A dot after the text shows while the category or the sort is not the default. The dot is decorative; the
  button's name then ends with the visually hidden text "(applied)", so a screen reader says "Filters
  (applied)". With defaults the name is "Filters". The status and the query have their own controls on
  screen and do not light the dot.
- While the panel is open the button has the hover fill, so the state is visible without the panel in view.

## The panel

A card like the add form, under the search row and above the status switch, so the list moves down while it is
open. It is closed on every load, also when the URL holds a category or a sort: the dot says so. Open or
closed is kept nowhere: not in the URL, not in storage, not across reloads.

- It opens and closes at once, with the button (click, Enter, Space), and with `Escape` inside it or on the button.
- Two groups, each a `<fieldset>` with a visible `<legend>` ("Category" and "Sort by"), and under them the
  Reset button.
- **Category**: radio buttons "All categories" (the default, no dot), "Work", "Personal", "Study", "Shopping",
  "Health"; each category has a dot in its own colour from `data-category`. The dot is decorative: the text
  names the category.
- **Sort**: radio buttons "Newest first" (the default), "Oldest first" and "Priority". Priority goes High,
  Medium, Low, newest first within a priority.
- Choosing a radio applies at once, with no Apply button; the choice is the URL.
- **Reset filters** is a text button shown only while the category or the sort is not the default (a button
  that would do nothing is not offered). It sets both to their defaults in one change and leaves the status
  and the query as they are. Focus goes to the checked category radio, "All categories", because the button
  leaves with the change.

## The URL

- The parameters are `category` (a category id: `work`, `personal`, `study`, `shopping`, `health`) and `sort`
  (`oldest` or `priority`), written next to `status` and `q` in that order:
  `?status=active&category=work&sort=priority&q=report`. Written with `history.replaceState`, no new history
  entry; changing one leaves the others.
- A default is never written: "All categories" has no `category`, "Newest first" has no `sort`, and a clean
  state is a clean URL. Nothing is written at start.
- An unknown value is read as the default and the app does not break: `?category=xyz&sort=abc` shows every task
  newest first; `?category=all` and `?sort=newest` read the same.
- A reload restores all four filters; the panel stays closed and the dot shows what the panel holds.

## The list

- A task is shown when its status, its category and its query all match. "All categories" matches every task.
- The order is derived from the sort and nothing is stored: **completed tasks are at the bottom under every
  sort**; within the open tasks, and again within the completed ones, newest first sorts by creation time
  descending, oldest first ascending, and priority by High, Medium, Low and then newest first. Tasks that tie
  keep the order they have.
- Changing a task's priority under the Priority sort moves its row; changing it under another sort does not.
- With tasks but none shown the card says "No tasks match your filters."; with no tasks at all it says "No
  tasks yet. Add your first one above.", whatever the filters.
- A task added while the category hides it is stored and not shown; the form still says "Task added".
- Saving an edit that changes the category so that the row no longer matches removes the row: the focus
  goes where delete sends it (the next row's checkbox, else the previous one, else the checked status radio),
  not to the edit button the row is about to lose. Toggling a task never changes its category, so the focus
  rule of the status filter needs no change.

## The keyboard

- Tab order: the add form, the search field and its clear button, the Filters button, the open panel (one stop
  for the category group, one for the sort group, then Reset when it is there), the status radios. A closed
  panel has no stops. The arrow keys move within a radio group, as natively.
- Opening the panel leaves the focus on the Filters button; the next Tab enters the panel.
- `Escape` with the focus inside the panel, or on the Filters button, closes the panel and leaves the focus on
  the button. Anywhere else it keeps its meaning: in the search field it clears the query, in an edit field it
  cancels the edit.

## What a screen reader hears

- The button: "Filters" or "Filters (applied)", a button, expanded or collapsed.
- The groups: "Category" and "Sort by", each with its radios and their checked state.
- The existing filter live region, unchanged, speaks when the filters change: a category change says "N tasks
  shown" or "No tasks match your filters", and so does a sort change, whose count stays the same and is read
  again. Reset is one change and speaks once. Opening and closing the panel, a load with a category or a sort in
  the URL, and a change of the tasks under unchanged filters stay silent.

## Look

Colours, spacing and radii from the tokens, both themes; the panel's card, border and padding match the add
form. The radios are 20px circles outlined with `--color-border-control` and filled with `--color-accent` when
checked, each option is at least 44px tall, and the options wrap, so at 320px the panel needs no horizontal
scroll and at 200% zoom it stays usable. The dot on the button and in the options are circles of the same
size in every theme; in forced colours the button's dot is `Highlight`. Hover only where the device can hover.
Reduced motion needs nothing of its own: the panel animates nothing.

## Out of scope

List animation (MY-158), several categories at once, more sorts, a sort direction toggle, keeping the panel
open, a visible count of applied filters, and anything of export and import (MY-160).
