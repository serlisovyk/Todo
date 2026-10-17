# Spec: editing a task in its row, deleting with Undo, the toast (MY-153)

Decisions in force: `todo-model` (the fields, the 200-character limit, deleting asks nothing and
offers Undo for 5 seconds), `ui-dependencies` (`lucide-react` icons, an own toast with one toast at
a time, `role="status"`, 5 seconds, paused while hovered or focused), `native-selects` (the pickers),
`repository-storage-restore` (`restore` for Undo), `context-folders` and `structure-and-naming`
(where the files go), `design-tokens` and `plain-css-and-tokens` (colours and sizes only from
tokens), `accessibility-and-seo` (WCAG 2.2 AA, both themes). The filters, the counter, "Clear
completed", search, the theme switch and list animation are other tasks.

## A row

Left to right: the checkbox, the title with the category and the priority under it (as now), then
two icon buttons on the right edge, always visible:

| Button | Icon     | Name for assistive technology |
| ------ | -------- | ----------------------------- |
| Edit   | `Pencil` | "Edit <title>"                |
| Delete | `Trash2` | "Delete <title>"              |

- Each button is at least 44px wide and tall, the icon is muted and turns to the text colour (the
  trash to the danger colour) on hover where the device can hover.
- A long title wraps in the space the buttons leave; at 320px nothing overflows the row.
- Tab order in a row: the checkbox, Edit, Delete.

## Editing

The pencil (a click, Enter or Space) replaces the row's content with an edit form: the title in a
text field, then the category and the priority in the same pills as the add form, each set to the
task's current value. The field takes the focus with the whole title selected. While the form is
open the row shows no checkbox, meta or buttons.

- **Enter** in the title saves. **Esc** cancels and restores the old values. Moving the focus out of
  the form, by Tab or by a click elsewhere, saves; moving it between the field and the pills does
  not leave the form.
- Saving trims the title and, when the title is not empty and something differs from the stored
  task, calls `updateTodo(id, { title, category, priority })`. An empty or whitespace title is not
  saved and the old title stays; nothing changed writes nothing.
- The title keeps the 200-character limit of the add form (a longer paste is cut).
- The row shows the new values at once; a refused write puts the old ones back and shows the error
  toast. Editing never moves the row: the order comes from `createdAt` and completion.
- After Enter or Esc the focus lands on the same row's pencil. After the focus left the form on its
  own, it stays where the user put it.
- The field is named "Task title", the pills "Category" and "Priority"; the pencil, back in the row,
  is named after the saved title, so the screen reader says what was saved.

## Deleting and Undo

The trash deletes the task at once, with no question, and shows the toast "Task deleted" with an
"Undo" button.

- The focus goes to the next row's checkbox in the list as shown; with no next row, to the previous
  one; with no rows left, to the add form's title field.
- **Undo** puts the task back exactly as it was (same id, creation time and completion), so it
  returns to the same place in the order; the toast closes and the focus lands on the restored
  task's checkbox. The restored task is stored again, so it survives a reload.
- After the toast has gone, or been replaced, the deletion is final.
- A refused delete puts the row back and shows the error toast instead of "Task deleted".

## The toast

- One toast at a time. A new toast replaces the current one at once; if that was a "Task deleted",
  its Undo is gone and the deletion is final.
- It lives in one polite live region (`role="status"`) that is always in the page, so a screen reader
  announces the message ("Task deleted", then the button) each time a toast appears, a repeated
  message included.
- It closes after 5 seconds (`TOAST_DURATION`), when its button is used, or when it is replaced.
  While the pointer is over it or the focus is inside it the time stops; when both have ended the 5
  seconds start again.
- Position: fixed at the bottom centre over the page, as wide as its text up to the content width;
  under 480px it takes the full width minus the page gutter. A surface card with a control border and
  the text colour; the action in the accent colour, at least 44px tall; both themes through tokens.
- An error toast (a toast with `isError`) shows a `CircleAlert` icon in the danger colour before the
  message, so it stands out from "Task deleted · Undo". The icon is decorative, hidden from assistive
  technology, so the one live region reads only the text; there is no button, and the timing is the
  same. The icon keeps 3:1 against the toast surface in both themes.
- **Ctrl+Z (Cmd+Z on macOS)** runs the toast's action while the toast is shown, exactly as a click on
  its button does: the task returns, the focus lands on its checkbox, the toast closes. It is left to
  the page when the focus is in a text field, a `<select>` or an editable region, so native undo keeps
  working there; a checkbox, where the focus sits after a keyboard delete, is not such a field. Shift
  or Alt with the keys, the other keys, and a toast with no action (an error toast) do nothing.
- The button carries `aria-keyshortcuts` ("Control+Z Meta+Z"), so assistive technology can tell the
  shortcut; the visible text stays "Undo" and no extra text is read with the toast.

## Storage errors

- A refused write (add, edit, toggle, delete, Undo) rolls the list back and shows the repository's
  message as an error toast. `addTodo` still resolves `null`, so the form keeps its text.
- A first read that fails (an IndexedDB that cannot open) shows the message as an error toast and
  the list is empty.
- `useTodos()` no longer returns `error` or `dismissError`; the list shows no error text itself.

## Layout and keyboard

- Everything works from the keyboard; the focus ring is the global one. The hover look only appears
  where the device can hover.
- From 320px wide to desktop and at 200% zoom there is no horizontal scroll; the edit form's pills
  stretch and wrap like the add form's.
- Both themes work through the tokens alone; the icons and the toast border keep 3:1, the text 4.5:1.

## Out of scope

The status filter, the counter, "Clear completed", "toggle all", search, the theme switch, list
animation, a visible Save or Cancel button, export and import.
