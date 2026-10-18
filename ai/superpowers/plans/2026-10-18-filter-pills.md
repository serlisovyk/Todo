# Plan: category and sort as pills on the row under the search field (MY-166)

Branch `my-166-filter-pills`. Linear issue MY-166, milestone Фильтры, after MY-156 (the Filters panel, replaced
here) and MY-164 (`PillSelect`, reused). It runs in parallel with MY-158 (list motion, and a small change in
`use-filters.js` and the provider actions), so edits to the shared files stay small and local, and whichever
branch merges second rebases. The spec is `ai/superpowers/specs/2026-10-18-filter-pills.md`.

## The author's answers (issue, «Решения автора», 2026-10-18)

«Да: две пилюли PillSelect (категория и сортировка) в строке с поиском, панель и кнопку Filters убрать, Reset
иконкой только когда фильтр изменён.» A side block of filters is not built. All questions are answered, so the
work goes from this commit to the code. The issue leaves "where the focus goes after Reset" to the plan; the
default taken here, and confirmed or changed at review, is the Category pill (see below).

Review, round 1: the first version put the search field and the pills on one row from 700px. The author chose
the layout instead: «пилюли и Reset всегда второй строкой под поиском, поиск на всю ширину.» The plan and the
spec say so; the 700px breakpoint and the search field's padding workaround are gone.

## Code

- `src/constants/filters.constants.js` (and its barrel line) — drop `CLOSE_FILTERS_KEY`, `CATEGORY_INPUT_NAME`,
  `SORT_INPUT_NAME` and `CHECKED_CATEGORY_SELECTOR`, which only the panel used; `PANEL_DEFAULTS` becomes
  `RESET_DEFAULTS` (what Reset applies). `STATUS_INPUT_NAME` and `CHECKED_STATUS_SELECTOR` stay: the status
  switch and the focus rules use them.
- `src/utils/filters.utils.js` — `hasPanelChoice` becomes `canResetFilters(filters)`, named by what it decides:
  the category or the sort is not the default.
- `src/hooks/use-filters-panel.js` — deleted. `use-filters-toolbar.js` is rewritten as the row's logic: the
  chosen category and sort, `canReset`, the two change handlers, `handleReset` (commits the reset with
  `flushSync`, then focuses the Category select through a ref) and the ref.
- `src/components/filters-panel/` and `src/components/filter-group/` — deleted with their styles; the barrels
  lose both.
- `src/components/filters-toolbar/` — stays the toolbar component (the name still says what it is). It renders
  `SearchField` and, under it, a `div` with two `PillSelect`s and, while `canReset`, an `IconButton` `X` "Reset
  filters". The category pill passes a `CategoryDot` as `renderMark` (nothing for "All categories"), the sort
  pill the `ArrowDownUp` icon. Its stylesheet is a column (the search field, then the pills row) and a wrapping
  flex row for the pills; one media query, the project's 480px, stacks the pills.
- `src/components/pill-select/` — takes a `ref` and hands it to its `<select>` (React 19 passes `ref` as a prop).
- `src/components/app/app.jsx` — no change: `FiltersToolbar` is still the one element.

## Deliberate choices

- **`FiltersToolbar` keeps its name and its hook.** A rename to something like `SearchRow` would say the same
  with no gain; what changes is the content, and the old `useFiltersPanel` merges into the one remaining hook.
- **Focus after Reset goes to the Category pill.** The button leaves with the change, so the focus must land
  elsewhere (`react.md`). The Category pill is the first of the two things Reset changes, it is where the
  panel's Reset sent the focus (the checked category radio), and a screen reader then reads "Category, All
  categories", which confirms the result. The Sort pill, the nearest control, and the search field were
  considered and are not clearly better. A ref on the select finds it, not a `querySelector`: the add form has a
  select named `category` too.
- **One icon for the sort pill, not one per option.** `renderMark` runs for the closed pill and for every option
  of the open list, so one icon marks the control and the list the same way and keeps the option text aligned.
  Per-option icons were rejected: arrows suggest a direction that "Priority" does not have, and a flag would be
  read as the priority flag of the forms. `ArrowDownUp` says "sort" without claiming an order, and the text
  names the order.
- **The labels are "Category" and "Sort", as the forms label their pills.** "Category" also names the add
  form's pill and the edit form's pill; the status switch next to the row is "Filter by status". A more specific
  name ("Filter by category", "Sort by") is two strings if the audit (MY-161) asks for it.
- **Two rows at every width, and the pills row wraps under 480px.** The search field on its own row shows the
  whole `/` hint down to about 300px with no change to `SearchField`. The pills are 185px and 173px wide
  whatever is chosen (`base-select-pickers`), so pills and Reset need 426px: they fit in one line from 480px, at
  the left in a fixed order, and Reset after them moves nothing. At 320px they do not. Letting the pills shrink
  (`min-width: 0`, the Reset button fixed) was tried: with Reset each pill is about 100px wide, which leaves two
  letters of text, and a pill that narrows below its text wraps the text and grows to 66px tall (measured),
  whatever its `text-overflow`. Making that work would change `PillSelect` and the picker of the forms for a
  text nobody could read, so the row wraps under the project's one breakpoint instead: the Category pill takes a line, the Sort pill the next and grows to fill it, Reset
  beside it, as the add form's pills stack.
- **Known edges.** In a window 480 to 488px wide with a classic scrollbar the row has 417px of the 426 it needs,
  so Reset takes a line of its own; at 256px the Sort pill and Reset do not fit on a line and Reset takes its
  own. Both are accepted rather than moving the breakpoint or shrinking a pill.
- **The status switch and the footer stay out of it.** Status is still a radio group on screen; the footer
  ignores the filters (`footer-acts-on-all-tasks`).

## Docs

- `ai/decisions/2026-10-18-filter-pills.md` (new, in the index) — supersedes `filters-and-search` and
  `filters-panel-behavior` and restates what stays: the URL state, the search, `/` and `Escape`, completed tasks
  last, Reset covering only the category and the sort. Both old records get `Status: superseded by …` and leave
  the index; nothing else in them changes.
- `ai/map.md` — the two components and the hook go, `FiltersToolbar`, `useFiltersToolbar`, `CategoryDot` and
  `PillSelect` are described anew; it is at its limit, so the entries are cut as they are rewritten.
- `ai/skills/feature.md` — the filter recipe (pills in the row instead of the panel) and the picker recipe (a
  `ref`); `ai/skills/review.md` — the Filters line; `ai/rules/architecture.md` — the decision it cites.
- `README.md` has no feature list to change; nothing else.

## Out of scope

List animation (MY-158), the accessibility audit (MY-161), several categories at once, more sorts, a sort
direction toggle, chips for the active filters, a side block.

## Verification

- `pnpm lint`, `pnpm format:check`, `pnpm build`, `pnpm size` (JavaScript budget 90 kB; `main` is 85.18 kB and
  removing the panel should shrink it: report the size).
- In `pnpm dev` (port 5186), headless Chrome over the DevTools protocol: each pill filters or sorts at once and
  writes the URL (defaults not written); a reload restores it; `?category=xyz&sort=abc` is ignored; Reset
  shows only with a non-default choice, restores All categories and Newest first, leaves the status and the
  query alone, and the focus lands on the Category pill; keyboard only (Tab order search, category, sort,
  Reset, status; a pill opens and chooses from the keyboard); a tap in touch emulation; the live region speaks
  on a pill change and on Reset and stays quiet on load; an edit that changes the category so the row leaves
  the filter still hands the focus on; 256, 320, 375, 479, 480, 700 and 1000px in both themes, with and
  without Reset, no horizontal scroll from the toolbar and the whole placeholder visible; forced colours;
  reduced motion; no console errors. Screenshots go to `scratchpad\my166\`.
