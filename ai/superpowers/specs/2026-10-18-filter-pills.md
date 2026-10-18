# Spec: category and sort as pills on the row under the search field (MY-166)

Decisions in force: `filter-pills` (new: the panel is replaced, the URL state, the search, `/` and the sort
order are restated), `base-select-pickers` (the pill and its open list), `tooltips-as-title` (a pill is named
by its label, the label carries the `title`; an icon button is named by its `title`), `search-shortcut-key`,
`footer-acts-on-all-tasks` (the counter and the buttons ignore category and sort), `design-tokens`,
`accessibility-and-seo` (WCAG 2.2 AA, both themes), `js-budget-90-kb` and `rejected-features`. List animation
(MY-158) and the audit (MY-161) are other tasks.

## The toolbar

Under the add form and above the status switch, two rows at every width. The first is the search field, at the
full width of the page. The second is the Category pill, the Sort pill and, only while the category or the sort
is not the default, the Reset button, in that order from the left. There is no Filters button, no dot, no panel
and no radio groups for category and sort; the status switch is unchanged. Nothing about the toolbar is open or
closed: the choice is always on screen.

## The pills

Two `PillSelect`s, native selects drawn as pills, each named by a visually hidden label ("Category", "Sort")
that carries the `title`, so hovering shows the name and the accessibility tree lists it once.

- **Category**: "All categories" (the default, no dot), "Work", "Personal", "Study", "Shopping", "Health".
  Each category has its dot in the closed pill and in its option in the open list (where the browser has
  `base-select`); the text names the category.
- **Sort**: "Newest first" (the default), "Oldest first", "Priority". The closed pill and every option lead with
  the same `ArrowDownUp` icon in the muted text colour; the text says which order it is.
- Choosing applies at once, with no Apply button; the choice is the URL. A pill keeps its width whatever is
  chosen (`base-select-pickers`).

## Reset

An icon button with the `X` icon, named and titled "Reset filters", 44px, shown only while the category or the
sort is not the default (a button that would do nothing is not offered). It sets both to their defaults in one
change and leaves the status and the query as they are. The button leaves with the change, so the focus goes
to the Category pill.

## The URL and the list

Unchanged from the panel: `?status=active&category=work&sort=priority&q=report`, defaults never written,
nothing written at start, an unknown value read as the default (`?category=xyz&sort=abc` shows every task
newest first), `replaceState` with no new history entry, a reload restores all four. A shared link that holds a
category or a sort loads with the pills showing it and the Reset button present. Filtering, the order (completed
tasks last under every sort, Priority High, Medium, Low and newest first within a priority), the two empty texts
and the edit that hides the row handing the focus on are as before.

## The keyboard

- Tab order: the add form, the search field and its clear button, the Category pill, the Sort pill, Reset when
  it is there, the status radios.
- A pill opens and chooses the way a native select does (Space, Enter, Alt+Down, the arrows, type-ahead);
  `Escape` closes the open list. `Escape` in the search field clears the query and `/` focuses the field, as before.

## What a screen reader hears

- The pills: "Category" and "Sort", each a combo box with its chosen option; Reset: "Reset filters", a button.
- The existing filter live region speaks when the filters change: a category or sort choice says "N tasks
  shown" or "No tasks match your filters", and Reset speaks once. A load with a choice in the URL, and a change
  of the tasks under unchanged filters, stay silent.

## Layout

All widths from 256px (400% zoom) up, no horizontal scroll from the toolbar. The search field is the full
width and shows its whole placeholder "Search tasks (press /)" down to about 300px; below that the browser cuts
it, as it did before the pills.

- **480px and wider**: the pills keep the fixed width the picker gives them (185px and 173px), start at the left
  and stay in that order; Reset comes after them, so its appearance moves nothing. The one exception is a window
  480 to 488px wide with a classic scrollbar, where the row is a few pixels short of the 426px the pills and
  Reset need and Reset takes a line of its own.
- **Under 480px**: the pills cannot share a line with Reset (at 320px they would be about 100px wide, with room
  for two letters of text, and a pill that narrows wraps its text and grows taller), so the row wraps: the
  Category pill takes the first line at the full width, the Sort pill the second and grows to fill it, Reset
  beside it. This is how the add form's pills stack on a phone. At 256px the Sort pill cannot share a line
  with Reset, and Reset takes a line of its own.

## Look

Colours, spacing and radii from the tokens, both themes; the pills look as they do in the forms. Hover only
where the device can hover. In forced colours the pills and the Reset icon take the system colours as in the
forms. Reduced motion needs nothing of its own: the row animates nothing and the pill's hover colour already
takes its duration from a token.

## Out of scope

List animation (MY-158), the audit (MY-161), several categories at once, more sorts, a sort direction toggle, a
visible chip per active filter, a side block with filters.
