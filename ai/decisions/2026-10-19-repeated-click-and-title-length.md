# The second click of a double click is ignored, and a title is cut by `.length`

Date: 2026-10-19 · Status: accepted

## Context

The list changes at once (`list-motion-without-view-transitions`), so between the two clicks of a double click the
control under the pointer has moved and the second click lands on the one that took its place: two tasks deleted with
Undo for one only, Mark all as done pressing Clear completed, a checkbox under a status filter toggling the next row
too, Undo passing its second click through its leaving toast to an Edit button, Export or Import below. Separately, a
browser may count `maxlength` in visible characters while the code counts UTF-16 units, so an emoji title passed the
field and then failed the counter, the check on add and the check on save.

## Decision

- `isRepeatedClick(event)` is the one place that says a click is the second or later of a series (`detail` above 1). A
  repeated click does nothing on a row's delete button, a task's checkbox and the three footer buttons. The keyboard
  (`detail` 0) and a single click work as before. A deliberate second press on the same spot within the double-click
  time is ignored too: the accepted cost. The toast rule stays: a second deletion after that time still makes the
  first one final.
- The Undo button leaves with its toast, so it has no handler left to guard: `useToastExit` arms a capture-phase `click`
  listener on the document that cancels repeated clicks until the first fresh one. It does not lean on the leaving
  toast, which lasts one fade (`--duration-base`) and not at all under reduced motion, less than a double click.
- Each title field's change handler stores the value cut to `TITLE_MAX_LENGTH` by `.length`, without a lone high
  surrogate at the end, so a pair is never split and a title can end at 199. `maxLength` stays on the field. The
  field, the counter, the validator and the stored title count one way, in every browser.

## Consequences

- A new control that changes the list on click starts with the same guard (`ai/rules/react.md`). A checkbox has it on
  its label, in the capture phase: `onChange` has no click count, and WebKit gives a label's forwarded click a count of 0.
- Rejected: one toast for two deletions (it changes what Undo restores, and the guard makes it unnecessary); a debounce
  or a disabled button (the button leaves the list anyway, and a timer is more code than a comparison); a leaving toast
  that stays hit-testable but does nothing (it covers the fade only); counting graphemes with `Intl.Segmenter` (a second
  rule next to every `.length` check, the import included); dropping `maxLength` (it still stops the field in the
  browsers that count units).
