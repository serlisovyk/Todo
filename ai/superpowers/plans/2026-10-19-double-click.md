# Plan: a double click acts once, one length rule for a title (MY-170)

Branch `my-170-double-click`. Linear issue MY-170, milestone Полировка, the first of a batch: the cleanups after it
touch the same hooks (`use-todo-item`, `use-todo-footer`, the forms). Nothing runs in parallel with it. The spec is
`ai/superpowers/specs/2026-10-19-double-click.md`.

## The author's answers (issue, «Решения автора», 2026-10-19)

- The double click is fixed with `event.detail > 1`; the deletions are not merged into one toast.
- The title length gets one rule for every browser: the change handler of each form cuts the value to
  `TITLE_MAX_LENGTH` by `.length`; `maxLength` on the field may stay.
- The other findings (a rollback on a failed write, the tab race, the focus after Undo) are not done.

## The author's answers, second round (issue comment, review, 2026-10-19)

- The check for a second click is one helper, `isRepeatedClick(event)` in `utils/`, not the same comparison in five
  handlers.
- The double click on Undo, whose second click went through the leaving toast to an Edit button, Export or Import
  under it, is fixed in this branch.

## What was measured first

Real double clicks over the DevTools protocol (`clickCount` 1 then 2 at one point, 50 ms apart), on the unchanged
code, five tasks, filter Active for the checkbox:

- The trash deletes two tasks and the toast offers Undo for the second only. The checkbox, from the box or from the
  title text, toggles the row and then the next one, which also leaves the Active list.
- The count of a click lands in `event.detail` (1, then 2) in Chromium, WebKit (Playwright 1.64, build 2370) and
  Firefox 157. A click on the title is not a click on the box: the label forwards one to the input, and Chromium
  and Firefox copy the count to it, while **WebKit gives it 0**.
- On the code with the guards, a double click on Undo restores the task and then presses whatever lies under the
  toast: an Edit button, Export, Import. It does at a gap of 50 ms and of 250 ms, with and without reduced motion, in
  Chromium and WebKit. The leaving toast made hit-testable again (`inert` on its two children instead of on itself)
  stops it at 50 ms only (measured in Chromium): the fade lasts 200 ms, and under reduced motion the toast is removed at once.

## Decisions taken in this plan

- **Buttons: the guard sits in the handler, the test in one helper.** `handleDelete`, `handleMarkAllDone`,
  `handleMarkAllActive` and `handleClearCompleted` take `event` (a React click event has `detail`) and start with
  `if (isRepeatedClick(event)) return`, a paragraph of its own. `isRepeatedClick` is a pure function in
  `events.utils.js`; the threshold is `FIRST_CLICK_DETAIL` in `events.constants.js` and appears nowhere else. The
  keyboard sends a click with `detail` 0, a single click with 1, so both pass.
- **The checkbox: a gate in front of the label, not a guard in `handleToggle`.** `onChange` has no `detail`;
  `event.nativeEvent.detail` would be the click's, and would stop a double click on the box, but a double click on
  the title text reaches `onChange` as the forwarded click, with 0 in WebKit, so Safari would still toggle the next
  row. A label `onClick` that cancels the forwarded click leaves the box's own click to `onChange`, so it needs a
  second guard. One handler does it all: `onClickCapture` on the label, which for a repeated click calls
  `preventDefault()` (the browser neither forwards a click nor keeps the box's toggle) and `stopPropagation()`
  (React dispatches `onChange` from the bubble phase of that same native click, so it never runs). It covers the
  box, the title and the label's padding, and works in all three engines (measured with the spike before this plan).
  The handler lives in `useTodoItem` as `ignoreRepeatedClick` and tests the click with `isRepeatedClick`.
- **Undo: a document listener armed by the toast's exit, not the leaving toast.** The Undo button has no handler to
  guard once it is gone. `dismiss` in `useToastExit` adds a capture-phase `click` listener to the document: a
  repeated click is default-prevented and stopped (React sees nothing), the first click that is not a repeat removes
  the listener, so a triple click is covered too. It is the only thing that holds at any speed of the double click and
  under reduced motion, and the toast itself is unchanged: still `inert` while it fades, the next toast is not held
  back. Rejected: a leaving toast that keeps catching pointer events (50 ms covered, 250 ms not, reduced motion not),
  and a guard in each control that can lie under a toast (Edit, Export, Import, and more as the page changes).
- **The title is cut in the handler, by a pure function.** `limitTitle(title)` in `todos.utils.js` returns the title
  unchanged up to `TITLE_MAX_LENGTH`; above it, the first `TITLE_MAX_LENGTH` units without a lone high surrogate at
  the end (`LONE_HIGH_SURROGATE_PATTERN` in `todos.constants.js`), so a pair is never cut in half and the length
  can be 199. Both `handleTitleChange`s call it, so the state, the counter, `isValidTitle` and the stored title
  all count by `.length`. `maxLength` stays: Chromium and Firefox then never take more than 200 units at all.
  Rejected: counting graphemes with `Intl.Segmenter` (a second rule next to every `.length` check, the validator,
  the import and `sanitizeTodo` included), and removing `maxLength` (it is free).
- **A decision record** `repeated-click-and-title-length` holds both rules and what was rejected, since a later
  cleanup could merge the toasts, drop the guard or "improve" the counter to graphemes.

## Code

- `src/constants/events.constants.js` (new) — `FIRST_CLICK_DETAIL`; `src/utils/events.utils.js` (new) —
  `isRepeatedClick`; their barrel lines.
- `src/hooks/use-todo-item.js` — `ignoreRepeatedClick`, returned; `handleDelete(event)` with the guard.
- `src/components/todo-item/todo-item.jsx` — `onClickCapture={ignoreRepeatedClick}` on the label.
- `src/hooks/use-todo-footer.js` — the guard in the three handlers.
- `src/hooks/use-toast-exit.js` — the listener `dismiss` arms.
- `src/constants/todos.constants.js` — `LONE_HIGH_SURROGATE_PATTERN`.
- `src/utils/todos.utils.js` (barrel line) — `limitTitle`.
- `src/hooks/use-todo-form.js`, `src/hooks/use-todo-edit.js` — `handleTitleChange` stores `limitTitle(value)`.

## Docs

- `ai/rules/react.md` — a button that changes the list ignores the second click of a double click, how the
  checkbox does it, and how a control that leaves on click (Undo) does.
- `ai/skills/feature.md` — the limit counter recipe: the field's change handler cuts by `.length`; the toast recipe:
  the exit's click listener. `ai/skills/review.md` — the task checklist names the double click.
- `ai/map.md` — `limitTitle` in the utils line and `events` in the utils and constants lines; the map is at 149 lines
  and 11.9 KB of 150 and 12 KB, so the edits stay a few words.
- `ai/decisions/2026-10-19-repeated-click-and-title-length.md` (new), and its line in the index.

## Out of scope

The three findings the author declined, one merged toast for two deletions (the earlier decision stands: a second
deletion makes the first final), a debounce or a disabled button, the double click of any control the issue and the
author's review do not name, grapheme counting, and a change to stored titles.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size`: report the sizes.
- In `pnpm dev` (port 5186), headless Chrome over the DevTools protocol, real double clicks: the trash (one task
  gone, Undo works), the checkbox from the box and from the title under All, Active and Completed (only that row),
  Mark all as done, Mark all as active and Clear completed (one action each); the same by keyboard (Space, Enter);
  two single clicks on two rows and on two trash buttons in a burst still act twice.
- Undo: a real double click on it, with an Edit button, Export or Import under the toast, restores once and presses
  nothing, at gaps of 50 and 250 ms and under reduced motion, and so does a triple click; Enter on the button, Ctrl+Z
  and a single click work as before, as does a click on the element under the toast after it is gone. An Edit button
  and Export can be reached only with a longer toast than "Task deleted" has, so a test stylesheet widens it. The run
  must fail on the code without the listener, in Chromium and in WebKit.
- A title of «👍🏽» repeated, and of a text with one emoji astride the limit, in both forms: the field never passes
  200 units, the counter never shows more, adding and editing work, a reload keeps it. Chromium, and WebKit through
  the Playwright build in its cache (nothing added to the project); the same double-click checks in WebKit and
  Firefox. That WebKit build counts `maxlength` in UTF-16 units like the others (measured), so a browser that counts
  visible characters is emulated by removing the field's `maxlength` with a script; the run must fail on the unchanged
  code and pass on the fix.
- Desktop and 320px, both themes. Screenshots go to `scratchpad\my170\`.
- Then `ai/rules/definition-of-done.md` and the `review` skill over the diff.
