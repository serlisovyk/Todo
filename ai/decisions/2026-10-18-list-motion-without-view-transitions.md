# The list moves with CSS only, never with View Transitions

Date: 2026-10-18 · Status: accepted

## Context

`list-animations` set View Transitions for the list and promised that nothing blocks the next action. Measured in
Chrome 155, a document View Transition drops pointer input while it runs (the events land on `html`): with 200 ms
animations clicks are lost for about 215 to 225 ms, four rapid clicks on four checkboxes landed 1 of 4 at gaps of 0
to 40 ms, taps are lost up to about 150 ms; only the keyboard works. One scoped to the list
(`element.startViewTransition`) leaves the rest of the page clickable but still swallows the list's own clicks, and
fails Chrome's layout check on 6 of 10 to 9 of 12 mouse deletes, where the row just vanishes. In a list that is all
clicks, a swallowed click is a bug. This record replaces `list-animations`, restating what stays in force.

## Decision

- The list moves with CSS only. A new task enters with `@starting-style`, only while the add form's title has
  focus, so the rows a search brings back and the ones of the first load do not fade. A task that is checked or
  unchecked changes through CSS transitions of the box, the check mark and the title.
- A reorder, a delete, Undo, Clear completed and a filter change are instant; the Undo toast and the live regions
  are their feedback. Every `@keyframes` is in `animations.css`; every duration is a token, which reduced motion
  zeroes; a component has no reduced-motion block.
- The theme keeps its document View Transition, the circle reveal: a theme change is rare and a click lost in that
  half second is accepted. If a reorder animation is wanted, it is FLIP through the Web Animations API.

## Consequences

- A browser starts no transition for an element React moves in the DOM, and a check sends its row down. The
  toggling row carries `data-toggling` for one frame, and a `@starting-style` under it gives its box, check mark and
  title the look of the state they came from, so the row animates whether it or its neighbours moved. The next
  frame clears the attribute, never `transitionend`, so reduced motion or a cancelled transition leaves none stale.
- Rejected: View Transitions for the list, document or scoped; an animation library.
