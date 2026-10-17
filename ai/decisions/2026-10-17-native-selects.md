# Native `<select>`s for fixed pickers, the colour drawn beside them

Date: 2026-10-17 · Status: accepted

## Context

The task form picks a category (five fixed values) and a priority (three), each with its own colour.
A custom listbox, a button that opens a popup of `role="option"` items, could put a coloured dot in
every option; a native `<select>` cannot style its options.

## Decision

- A picker over a short, fixed list is a native `<select>`, named by a visually hidden `<label>` and
  drawn as a pill with `appearance: none` and an own chevron.
- The colour sits beside the select, not inside it: a dot or a flag that follows the selected value,
  exposed to CSS through a data attribute. The options stay plain text, and the text always says
  what the colour says.

## Consequences

- Keyboard use, typeahead, screen reader announcements and the picker of a phone come from the
  browser with no code of ours; the open list is drawn by the system and follows `color-scheme` in
  both themes.
- Rejected: a custom listbox or combobox (focus management, typeahead and ARIA to get right, and the
  native picker lost on touch screens), a headless or UI-kit select (`ai/rules/scope.md`).
- Revisit only if the options must show more than text, such as a swatch or an icon in the open list.
