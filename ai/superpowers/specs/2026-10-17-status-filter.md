# Spec: the status filter, the counter and the bulk actions (MY-154)

Decisions in force: `filters-and-search` (status is a radio group on screen and a URL parameter, the
rest of the filters come later), `todo-model` (the two empty texts, clearing completed tasks offers
Undo), `errors-as-toasts` (a failed write is a toast), `state-in-context-and-hooks` (the filter is
the URL, not context state), `accessibility-and-seo` (WCAG 2.2 AA, both themes) and
`js-budget-90-kb`. Search, category, sort, the Filters panel, export and import and list animation
are other tasks.

## The status switch

Under the add form and above the list, outside the future Filters panel, a group named "Filter by
status" holds three native radio buttons: All, Active, Completed. They are drawn as one pill with
three equal segments, like the theme switch: the selected segment is filled with the accent colour
in both themes and the pill is as wide as the content column. The group is always on screen, with
tasks or without.

- All is the default. Tab enters the group once, on the selected segment; the arrow keys move the
  selection and the focus together and wrap at the ends, as in any native radio group. A change
  applies the moment the selection moves.
- Every segment is at least 44px tall, the focus ring is the base one, and the selected state is
  the fill, not the colour of the text alone; in forced colours mode it is still visible.
- A screen reader says "Filter by status", then for example "Active, radio button, 2 of 3".

## The URL

- The status is the query parameter `status`: `?status=active` or `?status=completed`. All is the
  default and is never written, so choosing it leaves a clean URL.
- A reload keeps the choice; a link with the parameter opens the list filtered.
- A value that is not one of the three (`?status=done`, `?status=Active`) reads as All and the URL
  is left as it is until the status changes. Nothing is written at start.
- Changing the status replaces the current history entry: no new entry, so Back and Forward do not
  step through filter changes. The path and the hash stay. The query holds only the app's filters.
- When the address changes without a reload (Back or Forward across hash entries), the page
  follows it.

## The list

- All shows every task, Active the tasks not completed, Completed the completed ones. The order
  inside what is shown is the usual one: completed below active, newest first.
- With no tasks at all the card says "No tasks yet. Add your first one above.", whatever the
  status. With tasks but none shown it says "No tasks match your filters." in the same card.
- A task added while Completed is selected is stored and not shown; the form's own "Task added"
  message is still announced.
- Checking or unchecking a task so that it no longer matches the status removes its row. The
  focus first moves to the next row's checkbox, else the previous one, else the selected status
  radio, the same as when a task is deleted, so it never falls to the top of the page.

## The footer

Under the list, only while at least one task exists. Everything in it counts and acts on **all**
tasks, not on the ones the status shows (decision `footer-acts-on-all-tasks`). A button shows only
while it would change something; a hidden button is clearer than a disabled one that needs an
explanation.

| Control            | Shown when                | What it does                                      |
| ------------------ | ------------------------- | ------------------------------------------------- |
| "N tasks left"     | the footer is shown       | the number of active tasks out of all tasks       |
| Mark all as done   | at least one task is open | marks every task completed                        |
| Mark all as active | at least one is completed | marks every task active                           |
| Clear completed    | at least one is completed | removes the completed tasks, with the toast below |

- The counter reads "1 task left", "2 tasks left", "0 tasks left". Filtering never changes it.
- "Clear completed" removes at once and asks nothing. A toast says "1 task cleared" or "3 tasks
  cleared" with an "Undo" button, for 5 seconds and paused while hovered or focused. Undo, or
  Ctrl/Cmd+Z outside a text field, puts the tasks back at their old places.
- Both mark-all buttons write one change per task that changes. A refused write rolls the list
  back and shows the error toast, as every write does.
- Order: the counter first, then Mark all as done, Mark all as active, Clear completed.

## What a screen reader hears

- The counter is its own polite live region: when its text changes ("2 tasks left"), the new text
  is read once. It changes on adding, checking, deleting, marking all and Undo, and not on
  filtering or on clearing completed tasks. It is a different event from the toast, so deleting a
  task reads both the toast and the new count.
- The footer is not on screen with no tasks, so its counter is not announced when the first task is
  added: the form says "Task added".
- Every button has its visible text as its name.

## Focus after an action

- "Mark all as done" disappears when it is used, so the focus goes to "Mark all as active", which
  appears; "Mark all as active" hands it to "Mark all as done".
- "Clear completed" moves the focus before the tasks go, to the selected status radio button: it is
  on screen whatever is left and it is not a text field, so Ctrl/Cmd+Z still undoes. Undo, and
  Ctrl/Cmd+Z, bring "Clear completed" back and focus it.
- Deleting a task moves the focus to the next row's checkbox, else the previous one, else the
  selected status radio, never the add form's title field: there Ctrl/Cmd+Z would be the field's
  own undo. Undo, and Ctrl/Cmd+Z, put the task back and focus its checkbox.

## Look

Colours, spacing and radii come from the tokens, both themes keep the contrast (text 4.5:1, the
selected fill 3:1). At 320px the footer's controls wrap onto further lines with no horizontal
scroll, each at least 44px tall; the segments share the width and stack when enlarged text leaves
them no room. Hover only where the device can hover. The selected fill and the hover colours ease
over the base duration like the other controls, and reduced motion makes them instant.

## Out of scope

Search, category, sort, the Filters panel, the `/` shortcut, export and import, list animation,
a count of the shown tasks, and announcing the filtered list (the empty text included): the search
task adds one persistent visually hidden polite region above the list that status, search and the
Filters panel share.
