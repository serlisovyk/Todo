# Category and sort are two pills under the search field, and Reset is an icon

Date: 2026-10-18 · Status: accepted

## Context

`filters-and-search` put the category and the sort in a Filters panel and `filters-panel-behavior` fixed how it
behaves. Built, the panel hid the current filter while closed and was a heavy block of radios for two settings.
This record replaces both and restates what stays in force.

## Decision

- The toolbar under the add form is two rows at every width: the search field at the full width, and under it a
  Category pill, a Sort pill and, only while the category or the sort is not the default, an icon button "Reset
  filters" after them. Both pills are `PillSelect`s (`base-select-pickers`), so the choice is always on screen.
  The status stays a radio group. There is no Filters button, no panel and no open state.
- Reset resets the category and the sort only: the status and the search have their own controls on screen. The
  button leaves with the change, so the focus goes to the Category pill.
- Every filter is the URL query (`status`, `category`, `sort`, `q`), written with `replaceState`: defaults are not
  written, unknown values are ignored, no router.
- Search is case-insensitive on the title; matches are wrapped in `<mark>` without `dangerouslySetInnerHTML`. `/`
  focuses it (`search-shortcut-key`), `Escape` clears it, and the placeholder shows the `/` hint.
- Completed tasks sit at the bottom under every sort; the sort orders the open tasks and the completed ones, each
  on their own. Priority runs High, Medium, Low, newest first within a priority.

## Consequences

- A shared link that carries a category or a sort opens already filtered, and the pills say so. The pills keep the
  width the picker gives them and Reset follows them, so it moves nothing; under 480px the row wraps.
- Rejected: the disclosure panel (it hid the filter while closed and cost an open state and an `Escape` rule); a
  side block; the pills beside the search field (about 190px was left for it and its `/` hint was cut); pills
  that shrink to share a line on a phone (about 100px each with Reset, two letters of text); chips, a popover or a
  modal; a Reset that clears every filter; a priority sort that ranks completed tasks; filters in `localStorage`.
