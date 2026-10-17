# Spec: the open list of the pill selects (MY-164)

Decisions in force: `native-selects` (a native `<select>` for a short fixed list, no custom
listbox), `design-tokens` and `plain-css-and-tokens` (colours, spacing and radii only from tokens, both
themes), `list-animations` (an entering element uses `@starting-style`, `prefers-reduced-motion` turns
motion off), `accessibility-and-seo` (WCAG 2.2 AA) and `js-budget-90-kb`. The pills are the category and
priority selects of the add form and of a row's edit form; the filter panel will reuse them.

## The closed pill

Unchanged in every browser: the same size, border, indicator (the category dot or the priority flag),
text and chevron, in both themes, on hover and with the focus ring. In a browser with `base-select`
the pill keeps the width of its widest option, within one pixel on desktop, and does not change width
when another option is chosen.

## The open list (a browser with `appearance: base-select`)

- A card under the pill, at least as wide as the pill: the surface colour, a border, rounded corners
  and a soft shadow, in both themes. It opens on the side with more room (above the pill when there is
  more room above), so every option is on screen at 320px wide and in a short window.
- One row per option, at least 44px high, in the page font, the dot or the flag first, then the label.
  A category row has a dot in the category colour, a priority row a flag in the priority colour, the
  same marks as the closed pill.
- The chosen option has a check mark at the end of its row in the accent colour.
- The row under the pointer (where the device can hover) and the row that has the focus are filled with
  the hover surface colour. A row reached by the keyboard also has the focus ring.
- The list fades in over `--duration-base`; with `prefers-reduced-motion: reduce` it appears at once.
  It closes at once.
- The text and the check mark keep at least 4.5:1 on the list and on a filled row; the ring, the dots
  and the flags at least 3:1, in both themes.

## Keyboard, touch and screen reader

Everything works as with any native `<select>`; nothing is added or removed.

- Space, Enter or a click opens the list; the arrow keys, Home and End move the highlight; typing
  letters jumps to a match; Enter picks the highlighted option; Esc closes the list and keeps the old
  value; Tab leaves the pill.
- Picking an option sets the task's category or priority (add form and edit form alike) and the
  indicator follows the choice at once.
- The select is named "Category" or "Priority"; each option is named by its label alone. The marks and
  the check mark are decorative and are not read.
- A phone may show its own picker; that is fine.

## Without `base-select`

The select looks and works as it does today: the closed pill as above and the list drawn by the
system. The marks and the hidden sizer inside the pill are not displayed, so nothing about the pill
changes.

## Out of scope

A custom listbox; Firefox's preferences; an exit animation; a hover fill in forced colours mode (the
focus ring and the check mark remain); a different mark inside the closed pill.
