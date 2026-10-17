# The open list of the pill selects is styled with `base-select`, as an enhancement

Date: 2026-10-17 · Status: accepted

## Context

`native-selects` left the open list to the system. A native `<select>` cannot style its options or
draw a colour inside them, so the list stood out from "Ink and indigo" in both themes and the dot or
flag could only sit beside the closed pill. `appearance: base-select` lets the page style the list and
put markup in an `<option>`. Chrome and Edge ship it (135) and so does Safari (27); Firefox has it only
behind preferences.

## Decision

- The picker stays a native `<select>`, named by a hidden `<label>` and drawn as a pill; no custom
  listbox. What `native-selects` decided stays in force, except that the open list may show more than
  text.
- One `@supports (appearance: base-select)` block makes the control and its `::picker(select)` opt in
  and turns the list into a card of tokens. Each option leads with the dot or the flag of the closed
  pill, drawn by the `renderMark` the caller passes to `PillSelect`; the chosen one ends with a check mark.
- Without support nothing of it applies: the marks and the sizer are `display: none`, and the system
  list and the closed pill are as before. An option's text still says what its colour says.
- `base-select` sizes a select by its chosen option, so a hidden `aria-hidden` stack of every label
  inside the pill keeps the width of the widest instead of changing it with each choice.

## Consequences

- Keyboard, type-ahead, screen reader and touch stay the browser's, and so does placing the list on
  screen. No script is added; a new select gets the same list through `PillSelect`.
- Rejected: a custom listbox (as before); a data attribute on `<option>` and `::before` for the marks
  (markup inside `<option>` renders with no warning and is the closed pill's own element); a pill that
  changes width with every choice.
