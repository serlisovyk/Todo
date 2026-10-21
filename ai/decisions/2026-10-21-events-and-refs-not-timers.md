# Order work by events and refs, not by timers and DOM walks

Date: 2026-10-21 · Status: accepted

## Context

The edit form closed through `setTimeout(…, 0)` after the focus left it, asked CSS whether a button was down
(`document.querySelector(':active')`), and the task to focus after a delete was found by walking sibling elements
(`nextElementSibling`). The author calls a zero timer bad practice and asked for the form to close on a `click` on the
document, once the clicked control has done its work.

## Decision

- No `setTimeout` to wait out a turn. When the focus leaves the edit form, it closes at once if no mouse button is
  down; otherwise on the next `click` on the document, once, which runs after the clicked control's own handler.
- "A button is down" is `mousedown` to `mouseup` on the document, in the capture phase (`useMousePressed`). Not
  `pointerdown` to `pointerup`: a tap's `pointerup` is over before the emulated `mousedown` that blurs the field, so
  the form closed under the finger, the rows below moved up and the tap landed on the list (measured with Chromium's
  touch emulation, a trash button below an open form). Not `:active`: it works, but it is state read back from CSS.
- The task to focus is found through refs: `TodoList` keeps a `Map` from a task id to its checkbox and hands each
  row its neighbour's id. A row in edit mode has no checkbox, so a neighbour that is being edited sends the focus to
  the checked status radio, as the DOM walk did; the radio itself stays a DOM query.

## Consequences

- A mouse released outside the page gives no `click`: the listener waits for the next one and closes the form then.
- The toast's capture-phase guard (`useToastExit`) stops only repeated clicks, so a click it swallows leaves the
  form's listener armed for the next fresh one; the two never hold each other back.
- A new control that moves the page when a field blurs relies on the same hook, not on a timer.
- Rejected: pointer events (above), keeping `:active`, and a `mouseup` listener with a timer behind it.
