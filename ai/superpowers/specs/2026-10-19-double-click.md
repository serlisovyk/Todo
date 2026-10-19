# Spec: a double click acts once, one length rule for a title (MY-170)

Decisions in force: `todo-model` (a title is at most 200 characters; a delete and a clear offer Undo),
`footer-acts-on-all-tasks`, `list-motion-without-view-transitions` (the list changes at once, so a row or a button
can move under the pointer between the two clicks), `undo-toast-time-limit` and `accessibility-and-seo`. Unchanged
and still in force: one toast at a time, and a second deletion makes the first final. The new record
`repeated-click-and-title-length` holds what is decided here.

## A double click

The second click of a double click, a click the browser counts as the second or later of a series, does nothing on
these controls. The first click acts as it always did.

| Control                   | A double click                                                                   |
| ------------------------- | -------------------------------------------------------------------------------- |
| A row's delete button     | deletes that task once; "Task deleted" with Undo; the next row stays             |
| A task's checkbox         | toggles that row once, whether the click is on the box or on the title text      |
| Under Active or Completed | the row leaves the list, the row that takes its place is not touched             |
| Mark all as done / active | acts once; the button that appears in its place is not pressed                   |
| Clear completed           | clears once, "N tasks cleared" with Undo; the button in its place is not pressed |
| The Undo button           | undoes once; whatever lies under the toast is not pressed                        |

- Not affected: the keyboard (a click from Space or Enter counts 0), a single click, two clicks the browser does not
  count as a double click (a pause, or another place on the screen) — two quick single clicks on two different rows
  or on two delete buttons act twice —, Edit, Save and Cancel.
- Under the toast: the second click of a double click on Undo presses nothing under the toast (an Edit button, Export,
  Import), however long the double click lasts and under reduced motion; a third click is ignored too. A click that
  is not a repeat reaches what is under the toast once it is gone. Ctrl or Cmd+Z, Enter on the button and a single
  click work as before; the toast leaves as it did, still taking no input while it fades, and the next toast is not
  held back.
- The ignored click changes nothing: no state, no toast, no focus move by the app, no flicker of a checkbox. A
  checkbox shows what the tasks say.
- Focus and what a screen reader hears after the first click are as before.

## The title length

- Neither title field, the add form's and the edit form's, ever holds more than 200 UTF-16 units (`.length`), in any
  browser. A longer value, typed or pasted, is cut to 200 as it arrives, and the counter, the check on add and on
  save, and the stored title all count the same way: the counter never shows more than "200 / 200".
- A cut that falls inside an emoji's surrogate pair drops the first half, so the title ends at 199 and is never
  broken. A cut inside a longer sequence (a skin tone, a joined emoji) leaves a valid but shorter-looking sequence.
- The fields keep `maxlength="200"`: Chromium, Firefox and WebKit stop at 200 units themselves; a browser that counts
  visible characters lets more in, and the cut brings it back.
- Adding a title of exactly 200 units works, and so does saving an edit to one; "Enter a task title." appears only
  for an empty one. Titles already stored are not touched.
- The counter's look and its announcements are unchanged: it appears 20 characters before the limit, and its status
  says "Character limit of 200 reached" at it.

## Out of scope

A rollback after a failed write, a race between tabs, the focus after Undo, one toast for two deletions, grapheme
counting, a change to stored titles, and the double click of any other control.
