# The edit form has Save and Cancel icon buttons

Date: 2026-10-17 · Status: accepted

## Context

The first edit form had no buttons: Enter in the title saved, Esc cancelled and leaving the form saved.
That choice was never a record; it stood only in the edit task's spec, which listed a visible Save or
Cancel button as out of scope. A phone has no Esc, and leaving the form saves, so an edit there could not
be cancelled; the accessibility audit listed it.

## Decision

- The form ends with two icon buttons at its right edge, where the row's pencil and trash are: `Check`
  named "Save" and `X` named "Cancel". Both are `IconButton`s, 44px, named by their `title`.
- Save is the form's submit button and does what Enter in the title does. Cancel closes the form and keeps
  the old values, as Esc does. Both return the focus to the row's pencil. Enter, Esc and leaving the form
  to save stay as they were.
- A press on either keeps the focus where it was (the default of `mousedown` is cancelled), so it is never
  "leaving the form": Cancel cannot save through the blur path, in a browser that does not focus a button
  on a click either.

## Consequences

- An edit can be saved or cancelled by mouse, keyboard and touch; nothing depends on Esc.
- The buttons are the last controls of the form in the tab order, after the title and the two pills.
- Rejected: a Cancel alone (by touch the only way to keep a change would still be to leave the form),
  text buttons (the row's actions are icons) and dropping "leaving the form saves" (a changed keyboard
  flow nobody asked for).
