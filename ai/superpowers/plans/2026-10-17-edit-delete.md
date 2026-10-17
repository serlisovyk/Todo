# Plan: editing a task in its row, deleting with Undo, the toast (MY-153)

Branch `my-153-edit-delete`. Linear issue MY-153, milestone Ядро, after MY-152. The spec is
`ai/superpowers/specs/2026-10-17-edit-delete.md`. MY-154 (status, counter, mass actions) and MY-160
(import result) reuse the toast; MY-158 (animations) and MY-157 (theme) are other tasks and stay out.

## The author's answers (issue, «Решения автора», 2026-10-16 and 2026-10-17)

All questions are answered, so the work goes from this commit to the code:

- Icons from `lucide-react` (`Pencil`, `Trash2`); the toast is our own; deleting asks nothing and
  offers Undo.
- Storage errors are shown by the todos provider itself: `ToastProvider` wraps `TodosProvider`, and a
  rolled-back action or a failed first read calls `useToast()`. `error` and `dismissError` leave the
  todos context and everything that used or documented them; `addTodo` still resolves `null`.
- Inline edit covers the title, the category and the priority (the field and two `PillSelect`).
- Two deletions in a row: the new toast replaces the old one and the first deletion is final.
- Defaults: the toast is a context folder `context/toast/` (object, provider, `useToast`) and a
  component in `components/toast/`; bottom centre, full width under 480px; the buttons on the right of
  the row, always visible, 44px; Undo restores through `restoreTodos` and the focus goes to the
  restored checkbox; an error toast has no button; messages and the duration live in `constants/`;
  dev port 5186.
- The check moved here from MY-152 and MY-159: a storage error is visible as a toast, for a refused
  localStorage write and for an IndexedDB that cannot open.

### After the first handover

The author reviewed the branch and answered:

- Undo gets a keyboard shortcut: while a toast with an action is shown, Ctrl+Z (Cmd+Z on macOS) runs
  the action as a click does; it is ignored when the focus is in an editable field and when no action
  toast is shown. The button gets `aria-keyshortcuts`.
- An error toast gets an icon and the danger colour so it stands out: a `CircleAlert` in
  `--color-danger`, decorative, before the message. The variant is a plain flag of the toast, set by
  every place that shows a storage error and, later, by the theme provider for a failed save.
- Kept as they are: Enter on a select in the edit form opens its list (only Enter in the title
  saves), and the focus after leaving the edit form stays where the user moved it (only Enter and Esc
  return it to the pencil).
- A guard against saving on Alt-Tab is not needed. A cancel on a phone and the click lost under an
  editing row stay as they are; both go to the audit checklist.

## Code

Layers and file names follow `structure-and-naming` and `context-folders`; each new folder gets its
`index.js` with its first file.

- `src/constants/` — `toast.constants.js` (`TOAST_DURATION`, the shortcut's key, code and
  `aria-keyshortcuts` value, the editable-field selector, the missing-provider message);
  `todos.constants.js` gets `TODO_DELETED_MESSAGE`, `UNDO_LABEL` and `TITLE_INPUT_ID`; the barrel
  re-exports them.
- `src/context/toast/` — `toast.context.js`, `toast.provider.jsx`, `use-toast.js`, `index.js`
  (`ToastProvider`, `useToast`); `context/index.js` re-exports the folder. The provider holds one
  `toast` (`{ id, message, actionLabel, onAction }` or `null`) in `useState` and exposes
  `showToast({ message, isError, actionLabel, onAction })` and `dismissToast()`. `showToast` gives the toast a
  new `id`, so a replacement is always a new element.
- `src/context/todos/todos.provider.jsx` — `useToast()` replaces `error` and `dismissError`: a failed
  write (in `saveChange` and `addTodo`) and a failed load call `showToast({ message, isError: true })`. `restoreTodos`
  stops reading `todos` from its closure (below).
- `src/hooks/use-toast-timer.js` — `useToastTimer(onDismiss)`: the hover and focus flags, the 5-second
  timer as an effect that is cleared on every change, and the four handlers the markup attaches.
- `src/hooks/use-toast-shortcut.js` — `useToastShortcut(onAction)`: a document `keydown` listener, in an
  effect that is removed on cleanup, that runs `onAction` for Ctrl+Z or Cmd+Z; it does nothing without
  an `onAction`.
- `src/components/toast-region/` — `ToastRegion`: the `role="status"` element, always rendered, and the
  current `Toast` inside it keyed by `toast.id`. `src/components/toast/` — `Toast({ toast, onDismiss })`:
  the message (after a `CircleAlert` when `isError`) and, when there is an `actionLabel`, a button that
  runs `onAction` and closes the toast;
  the same function answers the shortcut, and the button carries `aria-keyshortcuts`.
- `src/components/app/app.jsx` — `ToastProvider` around `TodosProvider`, `ToastRegion` after it.
- `src/utils/todos.utils.js` — `getTodoCheckboxId(todoId)`, the id the row gives its checkbox and Undo
  looks up.
- `src/hooks/use-todo-item.js` — `useTodoItem(todo)`: the row's refs, `isEditing`, the toggle, the
  delete with the toast and the focus moves, Undo, and `stopEditing`.
- `src/components/todo-item/` — the row: the body (label and meta, as now) and an actions area with the
  two buttons; while `isEditing` the row holds `TodoEditForm` instead. `todo-item.css` lays the row out
  as body plus actions.
- `src/hooks/use-todo-edit.js` — `useTodoEdit(todo, onClose)`: the three fields as state, the focus
  and select on mount, the form action that saves, a document key listener for Escape, and the
  handler for leaving the form.
- `src/components/todo-edit-form/` — `TodoEditForm({ todo, onClose })`: the markup of the edit form with
  two `PillSelect` (reused as they are; the form's own stylesheet only lets the pills stretch).
- `src/components/todo-form/todo-form.jsx` — the title field takes `TITLE_INPUT_ID` instead of
  `useId()`, so the row can send the focus there.
- `src/components/index.js` — a line for each new component folder.

### Deliberate choices

- **The toast keeps no timer in the context.** `Toast` is mounted per toast (the region keys it by
  `id`), so its hover and focus flags and its timer start clean and end with it. A timer in the
  provider would need two flags in the context API and a reset on every `showToast` and dismissal.
- **The region is always mounted, the toast inside it.** A live region added together with its text is
  not reliably announced; the keyed child makes a repeated "Task deleted" a new node, announced again.
- **The shortcut lives in the toast, so it exists only while an action toast does.** `Toast` is mounted
  per toast, so the listener is added with it and removed with it; a replaced toast takes its shortcut
  along, which is why Ctrl+Z after two deletions restores only the last. The toast owns the action, so
  the shortcut calls the same function as the button.
- **"Editable field" excludes checkboxes and radios.** After a keyboard delete the focus sits on a
  checkbox, and native undo means nothing there; text inputs, `<textarea>`, `<select>` and
  `contenteditable` keep their own Ctrl+Z. The key matches `z` or the physical `KeyZ`, so a Russian
  layout works too; Shift (redo) and Alt do not trigger it.
- **No hidden hint is read with the toast.** It would be announced with every toast and says "Ctrl"
  on a Mac; `aria-keyshortcuts` on the button carries the shortcut without that.
- **Resuming restarts the full 5 seconds.** Plain and enough for "paused while hovered or focused"; no
  remaining-time arithmetic.
- **`restoreTodos` no longer reads `todos` from its closure.** The Undo callback is created when the
  row is deleted and runs seconds later; `appendMissingTodos(todos, …)` over that old list would drop a
  task added in between. It appends with a functional update, and a failed write removes exactly the
  restored tasks (`saveChange` takes the rollback as a value or an updater, both fit `setTodos`).
- **Focus after delete is found in the page, not in the data.** The next row is the row element's next
  sibling, the previous one its previous sibling, so the answer is right for whatever the list shows
  once filters exist; the last resort is the title field by its constant id. Undo finds the restored
  checkbox by `getTodoCheckboxId` after `flushSync` has committed the restored row (React's documented
  way to read the DOM right after an update). The target is the checkbox because it is the row's first
  control.
- **After Enter or Esc the focus goes to the pencil; after leaving the form it stays where the user
  put it.** Pulling the focus back to the pencil after a click on another control would take it from
  the user. The pencil exists only outside the form, so `stopEditing` commits the row with
  `flushSync` and then focuses it.
- **The edit form is a `<form action>`.** Enter in the title submits it. The action closes the form
  and moves the focus in the same step, which needs `flushSync`; a check in the browser showed that
  `flushSync` inside an action commits at once, so the form keeps the rule and no `onSubmit` is needed.
- **Escape is a document key listener, not a handler on the form.** `jsx-a11y` rejects a key handler on
  a non-interactive element such as a `<form>`; a listener in an effect, removed on cleanup, hears
  Escape from the field and from the pills alike. An open native list keeps Escape for itself.
- **Leaving the form by a click on a control below the edited row loses that click.** The save closes
  the form, the row gets shorter, and the control under the pointer moves before the click completes;
  the second click works. It follows from "leaving the form saves" and is left as specified.
- **No guard against a second save on removal.** Browsers do not fire `blur` when a focused element is
  removed (checked in the Chrome used here), so closing the form by Enter or Esc never reaches the
  leave handler.
- **Neither `PillSelect` nor its stylesheet is edited** (another task restyles its list). The edit
  form's stylesheet reaches the pills only to stretch them, the way the add form's does.
- **An error toast is a toast with an `isError` flag.** No second component and no second live region
  (no `alert` role): the same `role="status"` region announces it. The `CircleAlert` is `aria-hidden`,
  so the screen reader hears only the message, and its colour is `--color-danger` through the one
  `.toast-icon` rule. The icon is part of the message's flex row, so a long message wraps beside it
  instead of dropping under it. Contrast of the icon on the toast surface is 4.83:1 in the light theme
  and 6.4:1 in the dark one.

## Commits

1. spec and plan (this commit);
2. the toast context: constants and `context/toast/`;
3. the toast: `useToastTimer`, `useToastShortcut`, `Toast`, `ToastRegion`, wired in `App`;
4. storage errors as toasts: the todos provider, without `error` and `dismissError`;
5. `restoreTodos` on the current list;
6. delete with Undo: the row's actions area and trash, `useTodoItem`, the checkbox id, the title id;
7. inline edit: the pencil, `TodoEditForm`, `useTodoEdit`;
8. docs: map, rules, the feature skill, decisions.

## Docs

- `ai/map.md` — the toast context and components, the edit form, the hooks, the constants line, the
  todos context line without `error`.
- `ai/rules/architecture.md`, `ai/rules/react.md`, `ai/rules/style.md`, `ai/skills/storage.md` — `error`
  becomes "a toast"; a change the focus depends on is committed with `flushSync`; a context imports
  another through its folder.
- `ai/skills/feature.md` — the toast recipe says how to show one (`showToast`, the undoable shape, the
  focus, the shortcut), and the context and hook bullets lose `error`.
- `ai/decisions/` — `ui-dependencies` goes to `accepted` (the icons, Inter and the toast are all built);
  a new record: storage errors are raised as toasts by the provider, not kept as state for a component.
  `todo-model` stays `accepted (not implemented)`: the filter messages are still to come.
- `README.md` — unchanged: it has no features list yet.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size` (JavaScript budget 80 kB; `main` is at
  74.92 kB).
- In `pnpm dev` on port 5186, through headless Chrome over the DevTools protocol, with tasks added in the
  app:
  - desktop, keyboard: Tab order, the pencil, Enter saves, Esc cancels, leaving saves, an empty title
    keeps the old one, the focus after each; the trash, the focus after deleting the first, a middle,
    the last and the only task, Undo and its focus; the toast pauses on focus and hover and closes after
    5 seconds; two deletions in a row;
  - Ctrl+Z and Cmd+Z restore the deleted task to its place with the focus on its checkbox; they do
    nothing while typing in the add form or the edit field, in a select, after the toast is gone, with
    an error toast, with Shift, and after two deletions only the last is restored;
  - the error toast (a refused localStorage write) shows the danger icon in both themes, at 320px and
    with large text, and the deleted toast has none;
  - mouse and touch emulation: the pencil, a click outside, the pills inside the form, Undo;
  - the accessibility tree: the row's buttons and the form's names, the status region's content;
  - 320px and 200% zoom without horizontal scroll, a long title with and without spaces, the toast full
    width; both themes (`data-theme="dark"` set by hand on `<html>`);
  - a reload after edit, delete and Undo;
  - storage errors: `localStorage.setItem` refused (an add, a toggle, an edit, a delete, an Undo) and,
    with `VITE_STORAGE=indexeddb`, `indexedDB.open` failing, each shown as a toast; and no second load
    when a toast appears (the load effect depends on `showToast`);
  - screenshots (a row with buttons, edit mode, the toast, 320px; light and dark) in the scratchpad.
- The Definition of Done point by point, then the `review` skill over the diff.
