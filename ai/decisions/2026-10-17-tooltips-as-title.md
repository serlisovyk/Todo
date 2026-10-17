# Tooltips are the `title` attribute, placed where it adds no second description

Date: 2026-10-17 · Status: accepted

## Context

The icon buttons, the theme chips and the pills show no text, so hovering them shows the browser's
tooltip with their name. They were named by `aria-label` or by a visually hidden `<label>`. A `title`
with the same text on the same element looked enough, on the assumption that a browser does not make a
`title` equal to the name a description. Chrome does: its accessibility tree lists the name and the same
text as the description, for a button with both attributes and for a radio or a select with a hidden
label and a `title` on the control, so a screen reader that does not drop it reads it twice.

## Decision

- An icon-only button is named by its `title`, with no `aria-label`: the one attribute is the name and
  the tooltip, and the tree lists the name once and no description.
- A control named by a hidden `<label>` (a theme chip, a pill) keeps that label for its name and has the
  `title` on the `<label>` element, not on the control. A title on the wrapping label is no description
  of the control, and the pointer over the control is inside the label, so the tooltip still shows.
- No tooltip of our own: no script, no CSS tooltip, no library.

## Consequences

- A new icon button goes through `IconButton`, which sets `title` from `labelText`; an `aria-label` next
  to it brings the second reading back.
- Rejected: `aria-label` and `title` together on one element; an empty `aria-description` or an
  `aria-describedby` to an empty element to hide the description (tricks that rely on one browser); a
  `title` on an inner element (the tooltip would show over the icon only); a tooltip of our own.
